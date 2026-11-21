// [VXG RealForever][VEXWORK][VEXBOARD][LOCALIZATION][VEXLIFE-PROD]
//
// VexLife Prod localization adapter.
//
// It consumes Product-owned keyed localization sources plus their existing `lens` namespace.
// The shared VexBoard frame owns presentation; this adapter only projects Product truth into the
// normalized Localization Inventory contract.

import {
  createLocalizationInventory,
  normalizeLocalizationLocaleRef,
} from '../shared/vexboard-localization-inventory.mjs';

export const VEXLIFE_PROD_LOCALIZATION_PRODUCER = Object.freeze({
  ref: 'producer.vexboard.localization.vexlife-prod-string-catalog',
  version: 'vexlife-prod-localization/1',
});

export const VEXLIFE_PROD_STRING_SOURCE_PATHS = Object.freeze([
  'localization/strings/source/release-alerts.json',
  'localization/strings/source/setup.json',
  'localization/strings/source/windows-setup.json',
  'localization/strings/source/workspace.json',
]);

function fail(message) {
  throw new TypeError(`vexlife-prod localization: ${message}`);
}

function canonicalLocaleRef(localeRef) {
  // Product source law explicitly defines stored "zh" as Simplified-screen Chinese.
  if (localeRef === 'zh') return 'zh-Hans';
  return normalizeLocalizationLocaleRef(localeRef);
}

function parseSourceFile(sourcePath, json) {
  if (typeof sourcePath !== 'string' || !sourcePath) fail('sourcePath required');
  if (typeof json !== 'string') fail(`${sourcePath} source bytes required`);

  let root;
  try { root = JSON.parse(json); }
  catch { fail(`${sourcePath} must be valid JSON`); }

  const scope = root?._meta?.scope;
  if (typeof scope !== 'string' || !scope) fail(`${sourcePath} has no _meta.scope`);

  const entries = [];
  for (const [sourceKey, element] of Object.entries(root)) {
    if (sourceKey === '_meta') continue;
    if (!sourceKey.startsWith(`${scope}.`)) fail(`${sourcePath} key ${sourceKey} is outside scope ${scope}`);
    if (!element || typeof element !== 'object' || Array.isArray(element)) fail(`${sourceKey} must be an element object`);
    const strings = element.strings;
    if (!strings || typeof strings !== 'object' || Array.isArray(strings)) fail(`${sourceKey} has no strings object`);
    const english = strings.en;
    if (!english || typeof english.text !== 'string') fail(`${sourceKey} has no English text`);

    const localeVariants = {};
    for (const [rawLocale, variant] of Object.entries(strings)) {
      if (rawLocale === 'en') continue;
      if (!variant || typeof variant !== 'object' || Array.isArray(variant)) fail(`${sourceKey} ${rawLocale} variant must be an object`);
      if (variant._stale === true) continue;
      if (typeof variant.text !== 'string') fail(`${sourceKey} ${rawLocale} variant has no text`);
      const localeRef = canonicalLocaleRef(rawLocale);
      if (Object.hasOwn(localeVariants, localeRef)) fail(`${sourceKey} duplicates locale ${localeRef}`);
      localeVariants[localeRef] = variant.text;
    }

    entries.push(Object.freeze({
      sourceStringRef: `vexlife-prod:${sourceKey}`,
      sourceKey,
      sourceValue: english.text,
      sourcePath,
      localeVariants: Object.freeze(localeVariants),
      lensRefOrNull: typeof element.lens === 'string' ? element.lens : null,
    }));
  }
  return entries;
}

export function vexLifeProdLocalizationSourceCatalog(sourceFiles) {
  if (!sourceFiles || typeof sourceFiles !== 'object' || Array.isArray(sourceFiles)) {
    fail('sourceFiles must map source path to exact JSON bytes');
  }
  const expected = new Set(VEXLIFE_PROD_STRING_SOURCE_PATHS);
  const actual = Object.keys(sourceFiles);
  for (const sourcePath of expected) {
    if (!Object.hasOwn(sourceFiles, sourcePath)) fail(`missing source file ${sourcePath}`);
  }
  for (const sourcePath of actual) {
    if (!expected.has(sourcePath)) fail(`unexpected source file ${sourcePath}`);
  }

  const entries = VEXLIFE_PROD_STRING_SOURCE_PATHS
    .flatMap((sourcePath) => parseSourceFile(sourcePath, sourceFiles[sourcePath]))
    .sort((left, right) => left.sourceStringRef.localeCompare(right.sourceStringRef));

  if (new Set(entries.map((entry) => entry.sourceStringRef)).size !== entries.length) {
    fail('sourceStringRef must be unique across source files');
  }

  return Object.freeze({
    sourceStrings: Object.freeze(entries.map((entry) => Object.freeze({
      sourceStringRef: entry.sourceStringRef,
      sourceKey: entry.sourceKey,
      sourceValue: entry.sourceValue,
      sourcePath: entry.sourcePath,
      ...(Object.keys(entry.localeVariants).length ? { localeVariants: entry.localeVariants } : {}),
    }))),
    lensBindings: Object.freeze(entries
      .filter((entry) => entry.lensRefOrNull !== null)
      .map((entry) => Object.freeze({
        sourceStringRef: entry.sourceStringRef,
        sourceKey: entry.sourceKey,
        sourceValue: entry.sourceValue,
        sourcePath: entry.sourcePath,
        elementRef: entry.lensRefOrNull,
      }))),
  });
}

function elementCoordinates(lens) {
  const byRef = new Map();
  for (const chrome of lens.chrome ?? []) {
    for (const element of chrome.elements ?? []) {
      if (byRef.has(element.ref)) fail(`Screen Lens element ref repeated: ${element.ref}`);
      byRef.set(element.ref, { element, surfaceRef: chrome.chromeRef, screenRef: null, sourcePath: chrome.source ?? null });
    }
  }
  for (const screen of lens.screens ?? []) {
    for (const element of screen.elements ?? []) {
      if (byRef.has(element.ref)) fail(`Screen Lens element ref repeated: ${element.ref}`);
      byRef.set(element.ref, { element, surfaceRef: screen.screenRef, screenRef: screen.screenRef, sourcePath: screen.source ?? null });
    }
  }
  return byRef;
}

function bindingRole(sourceKey, element) {
  const elementType = sourceKey.split('.')[1] ?? '';
  if (elementType === 'heading') return 'TITLE';
  if (elementType === 'description') return 'SUPPORTING';
  if (elementType === 'status') return 'STATUS';
  if (elementType === 'label') return 'LABEL';
  if (elementType === 'button') return 'LABEL';
  return element.kind === 'TEXT' ? 'TEXT' : 'LABEL';
}

export function vexLifeProdLocalizationOccurrences({ subjectRef, lens, sourceStrings, lensBindings }) {
  const byElement = elementCoordinates(lens);
  const bySource = new Map(sourceStrings.map((row) => [row.sourceStringRef, row]));
  const subject = subjectRef.replace(/^subject\./, '');

  return lensBindings.map((binding) => {
    const coordinates = byElement.get(binding.elementRef);
    if (!coordinates) fail(`${binding.sourceKey} lens ref ${binding.elementRef} is absent from the exact Screen Lens`);
    const source = bySource.get(binding.sourceStringRef);
    if (!source) fail(`${binding.sourceStringRef} binding has no source string`);
    const role = bindingRole(binding.sourceKey, coordinates.element);
    return Object.freeze({
      occurrenceRef: `occurrence.localization.${subject}.${binding.sourceKey}`,
      surfaceRef: coordinates.surfaceRef,
      screenRef: coordinates.screenRef,
      elementRef: coordinates.element.ref,
      parentElementRef: coordinates.element.parentRef ?? null,
      elementKind: coordinates.element.kind,
      bindingRole: role,
      textRole: role,
      sourceStringRef: source.sourceStringRef,
      sourceKey: source.sourceKey,
      sourceValue: source.sourceValue,
      sourcePath: binding.sourcePath ?? coordinates.sourcePath,
    });
  });
}

export function projectVexLifeProdLocalizationInventory({
  subjectRef = 'subject.vexlife-prod',
  lens,
  sourceFiles,
  sourceLocale = 'en',
  buildRef = null,
}) {
  if (!lens?.sourceSnapshot?.repositoryRef || !lens?.sourceSnapshot?.commit) {
    fail('Screen Lens sourceSnapshot is required');
  }
  const catalog = vexLifeProdLocalizationSourceCatalog(sourceFiles);
  return createLocalizationInventory({
    inventoryRef: `localization.${subjectRef.replace(/^subject\./, '')}`,
    subjectRef,
    sourceSnapshot: lens.sourceSnapshot,
    sourceLocale,
    buildRef,
    producer: VEXLIFE_PROD_LOCALIZATION_PRODUCER,
    sourceStrings: catalog.sourceStrings,
    occurrences: vexLifeProdLocalizationOccurrences({
      subjectRef,
      lens,
      sourceStrings: catalog.sourceStrings,
      lensBindings: catalog.lensBindings,
    }),
  });
}
