// [VXG RealForever][VEXWORK][VEXBOARD][LOCALIZATION][INVENTORY]
//
// Platform-neutral localization inventory.
//
// Product/source adapters emit exact source strings plus exact text occurrences. This module owns only:
// - stable inventory normalization;
// - exact source-string aggregation;
// - reverse where-used queries;
// - deterministic CSV materializations.
//
// It does not infer semantic equivalence from equal values and it does not mutate Product source.

export const LOCALIZATION_INVENTORY_SCHEMA = 'vexboard.localization-inventory/v1';

const REF = /^[A-Za-z0-9][A-Za-z0-9._:/-]*$/u;

function fail(message) {
  throw new TypeError(`localization inventory: ${message}`);
}

function text(value, label) {
  if (typeof value !== 'string' || !value.trim()) fail(`${label} must be a non-empty string`);
  return value;
}

function ref(value, label) {
  const accepted = text(value, label);
  if (!REF.test(accepted)) fail(`${label} must be one stable ref`);
  return accepted;
}

function nullableRef(value, label) {
  if (value === null || value === undefined) return null;
  return ref(value, label);
}

function uniqueSorted(values) {
  return [...new Set(values.filter((value) => value !== null && value !== undefined))].sort();
}

function placeholderType(type) {
  if ('diouxX'.includes(type)) return 'INT';
  if ('eEfgGaA'.includes(type)) return 'FLOAT';
  if (type === 's' || type === 'S') return 'STRING';
  if (type === 'c' || type === 'C') return 'CHAR';
  if (type === 'b' || type === 'B') return 'BOOLEAN';
  if (type === 't' || type === 'T') return 'DATE_TIME';
  return type.toUpperCase();
}

export function localizationFormatSignature(value) {
  const source = String(value ?? '');
  const placeholders = [];
  let ordinal = 0;
  for (const match of source.matchAll(/%(?:(\d+)\$)?[-#+ 0,(<]*\d*(?:\.\d+)?([A-Za-z%])/g)) {
    if (match[2] === '%') continue;
    ordinal += 1;
    placeholders.push({
      ordinal,
      argumentIndex: match[1] ? Number(match[1]) : null,
      type: placeholderType(match[2]),
      token: match[0],
    });
  }
  const signature = placeholders
    .map((placeholder) => `${placeholder.argumentIndex === null ? `seq${placeholder.ordinal}` : `arg${placeholder.argumentIndex}`}:${placeholder.type}`)
    .join('|');
  return Object.freeze({
    signature,
    placeholders: Object.freeze(placeholders.map((placeholder) => Object.freeze(placeholder))),
  });
}

function normalizeSourceString(input) {
  const sourceStringRef = ref(input.sourceStringRef, 'sourceString.sourceStringRef');
  const sourceKey = text(input.sourceKey, 'sourceString.sourceKey');
  const sourceValue = typeof input.sourceValue === 'string'
    ? input.sourceValue
    : fail('sourceString.sourceValue must be a string');
  return {
    sourceStringRef,
    sourceKey,
    sourceValue,
    sourcePath: input.sourcePath ? text(input.sourcePath, 'sourceString.sourcePath') : null,
  };
}

function normalizeOccurrence(input) {
  const sourceStringRef = ref(input.sourceStringRef, 'occurrence.sourceStringRef');
  const sourceKey = text(input.sourceKey, 'occurrence.sourceKey');
  const sourceValue = typeof input.sourceValue === 'string'
    ? input.sourceValue
    : fail('occurrence.sourceValue must be a string');
  return Object.freeze({
    occurrenceRef: ref(input.occurrenceRef, 'occurrence.occurrenceRef'),
    surfaceRef: ref(input.surfaceRef, 'occurrence.surfaceRef'),
    screenRef: nullableRef(input.screenRef ?? null, 'occurrence.screenRef'),
    elementRef: ref(input.elementRef, 'occurrence.elementRef'),
    parentElementRef: nullableRef(input.parentElementRef ?? null, 'occurrence.parentElementRef'),
    elementKind: text(input.elementKind, 'occurrence.elementKind'),
    bindingRole: text(input.bindingRole, 'occurrence.bindingRole'),
    textRole: input.textRole ? text(input.textRole, 'occurrence.textRole') : null,
    sourceStringRef,
    sourceKey,
    sourceValue,
    sourcePath: input.sourcePath ? text(input.sourcePath, 'occurrence.sourcePath') : null,
  });
}

export function createLocalizationInventory({
  inventoryRef,
  subjectRef,
  sourceSnapshot,
  sourceLocale = 'en',
  buildRef = null,
  producer,
  sourceStrings,
  occurrences,
}) {
  ref(inventoryRef, 'inventoryRef');
  ref(subjectRef, 'subjectRef');
  text(sourceLocale, 'sourceLocale');
  if (!sourceSnapshot || typeof sourceSnapshot !== 'object') fail('sourceSnapshot required');
  ref(sourceSnapshot.repositoryRef, 'sourceSnapshot.repositoryRef');
  text(sourceSnapshot.commit, 'sourceSnapshot.commit');
  if (!Array.isArray(sourceStrings) || !sourceStrings.length) fail('sourceStrings must be a non-empty array');
  if (!Array.isArray(occurrences)) fail('occurrences must be an array');
  if (!producer || typeof producer !== 'object') fail('producer required');
  ref(producer.ref, 'producer.ref');
  text(producer.version, 'producer.version');

  const sourceRows = sourceStrings.map(normalizeSourceString)
    .sort((a, b) => a.sourceStringRef.localeCompare(b.sourceStringRef));
  if (new Set(sourceRows.map((row) => row.sourceStringRef)).size !== sourceRows.length) {
    fail('sourceStringRef must be unique');
  }

  const normalized = occurrences.map(normalizeOccurrence)
    .sort((a, b) => a.occurrenceRef.localeCompare(b.occurrenceRef));
  if (new Set(normalized.map((row) => row.occurrenceRef)).size !== normalized.length) {
    fail('occurrenceRef must be unique');
  }

  const byString = new Map(sourceRows.map((row) => [row.sourceStringRef, {
    ...row,
    occurrenceRefs: [],
    elementRefs: [],
    screenRefs: [],
    surfaceRefs: [],
    bindingRoles: [],
  }]));

  for (const occurrence of normalized) {
    const row = byString.get(occurrence.sourceStringRef);
    if (!row) fail(`${occurrence.occurrenceRef} references unknown source string ${occurrence.sourceStringRef}`);
    if (row.sourceKey !== occurrence.sourceKey || row.sourceValue !== occurrence.sourceValue) {
      fail(`${occurrence.sourceStringRef} occurrence disagrees with source catalog`);
    }
    row.occurrenceRefs.push(occurrence.occurrenceRef);
    row.elementRefs.push(occurrence.elementRef);
    row.screenRefs.push(occurrence.screenRef);
    row.surfaceRefs.push(occurrence.surfaceRef);
    row.bindingRoles.push(occurrence.bindingRole);
  }

  const strings = [...byString.values()]
    .map((row) => {
      const format = localizationFormatSignature(row.sourceValue);
      const occurrenceRefs = uniqueSorted(row.occurrenceRefs);
      return Object.freeze({
        sourceStringRef: row.sourceStringRef,
        sourceKey: row.sourceKey,
        sourceValue: row.sourceValue,
        sourcePath: row.sourcePath,
        formatSignature: format.signature,
        placeholders: format.placeholders,
        mapped: occurrenceRefs.length > 0,
        occurrenceRefs: Object.freeze(occurrenceRefs),
        elementRefs: Object.freeze(uniqueSorted(row.elementRefs)),
        screenRefs: Object.freeze(uniqueSorted(row.screenRefs)),
        surfaceRefs: Object.freeze(uniqueSorted(row.surfaceRefs)),
        bindingRoles: Object.freeze(uniqueSorted(row.bindingRoles)),
      });
    })
    .sort((a, b) => a.sourceStringRef.localeCompare(b.sourceStringRef));

  const mapped = strings.filter((row) => row.mapped);

  return Object.freeze({
    schemaVersion: LOCALIZATION_INVENTORY_SCHEMA,
    inventoryRef,
    subjectRef,
    buildRef,
    sourceLocale,
    sourceSnapshot: Object.freeze({
      repositoryRef: sourceSnapshot.repositoryRef,
      repositoryUrl: sourceSnapshot.repositoryUrl ?? null,
      commit: sourceSnapshot.commit,
      observedAt: sourceSnapshot.observedAt ?? null,
    }),
    producer: Object.freeze({ ref: producer.ref, version: producer.version }),
    locales: Object.freeze([
      Object.freeze({
        localeRef: sourceLocale,
        role: 'SOURCE',
        completeness: 'OBSERVED_SOURCE',
      }),
    ]),
    occurrences: Object.freeze(normalized),
    strings: Object.freeze(strings),
    summary: Object.freeze({
      occurrenceCount: normalized.length,
      sourceStringCount: strings.length,
      mappedSourceStringCount: mapped.length,
      unmappedSourceStringCount: strings.length - mapped.length,
      reusedSourceStringCount: mapped.filter((row) => row.occurrenceRefs.length > 1).length,
      formatStringCount: strings.filter((row) => row.placeholders.length > 0).length,
      screenCount: uniqueSorted(normalized.map((row) => row.screenRef)).length,
      surfaceCount: uniqueSorted(normalized.map((row) => row.surfaceRef)).length,
    }),
  });
}

export function occurrencesForString(inventory, sourceStringRef) {
  return inventory.occurrences.filter((row) => row.sourceStringRef === sourceStringRef);
}

export function stringsForElement(inventory, elementRef) {
  const refs = new Set(inventory.occurrences
    .filter((row) => row.elementRef === elementRef)
    .map((row) => row.sourceStringRef));
  return inventory.strings.filter((row) => refs.has(row.sourceStringRef));
}

export function occurrencesForSurface(inventory, surfaceRef) {
  return inventory.occurrences.filter((row) => row.surfaceRef === surfaceRef);
}

export function sourceStringsForExactValue(inventory, sourceValue) {
  return inventory.strings.filter((row) => row.sourceValue === sourceValue);
}

function csvCell(value) {
  const textValue = value === null || value === undefined ? '' : String(value);
  return /[",\n\r]/.test(textValue) ? `"${textValue.replaceAll('"', '""')}"` : textValue;
}

function csv(rows) {
  return rows.map((row) => row.map(csvCell).join(',')).join('\n') + '\n';
}

export function localizationOccurrencesCsv(inventory) {
  return csv([
    ['occurrenceRef', 'surfaceRef', 'screenRef', 'elementRef', 'parentElementRef', 'elementKind', 'bindingRole', 'textRole', 'sourceStringRef', 'sourceKey', 'sourceValue', 'sourcePath'],
    ...inventory.occurrences.map((row) => [
      row.occurrenceRef,
      row.surfaceRef,
      row.screenRef,
      row.elementRef,
      row.parentElementRef,
      row.elementKind,
      row.bindingRole,
      row.textRole,
      row.sourceStringRef,
      row.sourceKey,
      row.sourceValue,
      row.sourcePath,
    ]),
  ]);
}

export function localizationStringsCsv(inventory) {
  return csv([
    ['sourceStringRef', 'sourceKey', 'sourceValue', 'sourcePath', 'mapped', 'formatSignature', 'occurrenceCount', 'surfaceRefs', 'screenRefs', 'elementRefs', 'bindingRoles'],
    ...inventory.strings.map((row) => [
      row.sourceStringRef,
      row.sourceKey,
      row.sourceValue,
      row.sourcePath,
      row.mapped,
      row.formatSignature,
      row.occurrenceRefs.length,
      row.surfaceRefs.join(' | '),
      row.screenRefs.join(' | '),
      row.elementRefs.join(' | '),
      row.bindingRoles.join(' | '),
    ]),
  ]);
}
