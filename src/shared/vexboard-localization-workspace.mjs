import {
  normalizeLocalizationInventory,
  normalizeLocalizationLocaleRef,
} from './vexboard-localization-inventory.mjs';
import { analyzeLocalizationConvergence } from './vexboard-localization-convergence.mjs';
import {
  createLocalizationChangeSetCollection,
  normalizeLocalizationChangeSetCollection,
  reconcileLocalizationChangeSet,
} from './vexboard-localization-change-set.mjs';

export const LOCALIZATION_WORKSPACE_SCHEMA = 'vexboard.localization-workspace-projection/v1';
export const LOCALIZATION_WORKSPACE_PIVOTS = Object.freeze([
  'ELEMENTS',
  'STRINGS',
  'VALUES',
  'GROUPS',
  'LOCALES',
  'COVERAGE',
  'CHANGE_SETS',
]);

function fail(message) {
  throw new TypeError(`localization workspace: ${message}`);
}

function uniqueSorted(values) {
  return [...new Set(values.filter((value) => value !== null && value !== undefined))].sort();
}

function normalizeInventories(input) {
  if (!Array.isArray(input) || input.length === 0) fail('at least one Localization Inventory is required');
  const inventories = input.map(normalizeLocalizationInventory)
    .sort((left, right) => left.subjectRef.localeCompare(right.subjectRef));
  if (new Set(inventories.map((inventory) => inventory.inventoryRef)).size !== inventories.length) {
    fail('inventoryRef must be unique');
  }
  if (new Set(inventories.map((inventory) => inventory.subjectRef)).size !== inventories.length) {
    fail('one current inventory per subject is required');
  }
  return inventories;
}

function elements(inventories) {
  return Object.freeze(inventories.flatMap((inventory) => inventory.occurrences.map((occurrence) => {
    const source = inventory.strings.find((row) => row.sourceStringRef === occurrence.sourceStringRef);
    return Object.freeze({
      inventoryRef: inventory.inventoryRef,
      subjectRef: inventory.subjectRef,
      revision: inventory.sourceSnapshot.commit,
      occurrenceRef: occurrence.occurrenceRef,
      surfaceRef: occurrence.surfaceRef,
      screenRef: occurrence.screenRef,
      elementRef: occurrence.elementRef,
      parentElementRef: occurrence.parentElementRef,
      elementKind: occurrence.elementKind,
      bindingRole: occurrence.bindingRole,
      textRole: occurrence.textRole,
      sourceStringRef: occurrence.sourceStringRef,
      sourceKey: occurrence.sourceKey,
      sourceValue: occurrence.sourceValue,
      sourcePath: occurrence.sourcePath,
      localeRefs: Object.freeze(uniqueSorted([
        inventory.sourceLocale,
        ...Object.keys(source?.localeVariants ?? {}),
      ])),
    });
  })).sort(
    (left, right) => left.subjectRef.localeCompare(right.subjectRef)
      || String(left.screenRef ?? '').localeCompare(String(right.screenRef ?? ''))
      || left.elementRef.localeCompare(right.elementRef)
      || left.sourceStringRef.localeCompare(right.sourceStringRef),
  ));
}

function strings(inventories) {
  return Object.freeze(inventories.flatMap((inventory) => inventory.strings.map((row) => {
    const firstOccurrence = row.occurrenceRefs.length
      ? inventory.occurrences.find((candidate) => candidate.occurrenceRef === row.occurrenceRefs[0]) ?? null
      : null;
    return Object.freeze({
      inventoryRef: inventory.inventoryRef,
      subjectRef: inventory.subjectRef,
      revision: inventory.sourceSnapshot.commit,
      sourceLocale: inventory.sourceLocale,
      sourceStringRef: row.sourceStringRef,
      sourceKey: row.sourceKey,
      sourceValue: row.sourceValue,
      sourcePath: row.sourcePath,
      formatSignature: row.formatSignature,
      mapped: row.mapped,
      occurrenceRefs: Object.freeze([...row.occurrenceRefs]),
      elementRefs: Object.freeze([...row.elementRefs]),
      screenRefs: Object.freeze([...row.screenRefs]),
      surfaceRefs: Object.freeze([...row.surfaceRefs]),
      bindingRoles: Object.freeze([...row.bindingRoles]),
      localeRefs: Object.freeze(uniqueSorted([inventory.sourceLocale, ...Object.keys(row.localeVariants ?? {})])),
      firstOccurrenceOrNull: firstOccurrence ? Object.freeze({
        occurrenceRef: firstOccurrence.occurrenceRef,
        screenRef: firstOccurrence.screenRef,
        elementRef: firstOccurrence.elementRef,
      }) : null,
    });
  })).sort(
    (left, right) => left.subjectRef.localeCompare(right.subjectRef)
      || left.sourceStringRef.localeCompare(right.sourceStringRef),
  ));
}

function values(stringRows, analysis) {
  const candidateByValue = new Map(analysis.candidateGroups.map((group) => [group.normalizedSourceValue, group]));
  const grouped = new Map();
  for (const row of stringRows) {
    const normalizedSourceValue = row.sourceValue.normalize('NFC');
    if (!grouped.has(normalizedSourceValue)) grouped.set(normalizedSourceValue, []);
    grouped.get(normalizedSourceValue).push(row);
  }
  return Object.freeze([...grouped.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([normalizedSourceValue, members]) => {
      const candidate = candidateByValue.get(normalizedSourceValue) ?? null;
      return Object.freeze({
        normalizedSourceValue,
        memberCount: members.length,
        subjectRefs: Object.freeze(uniqueSorted(members.map((member) => member.subjectRef))),
        sourceStringRefs: Object.freeze(members.map((member) => member.sourceStringRef).sort()),
        localeRefs: Object.freeze(uniqueSorted(members.flatMap((member) => member.localeRefs))),
        candidateGroupRefOrNull: candidate?.candidateGroupRef ?? null,
        suggestedDispositionOrNull: candidate?.suggestedDisposition ?? null,
        evidence: Object.freeze([...(candidate?.evidence ?? [])]),
      });
    }));
}

function groups(analysis, stringRows) {
  const stringsByRef = new Map(stringRows.map((row) => [row.sourceStringRef, row]));
  const localeRefsFor = (sourceStringRefs) => uniqueSorted(sourceStringRefs.flatMap(
    (sourceStringRef) => stringsByRef.get(sourceStringRef)?.localeRefs ?? [],
  ));
  const candidateRows = analysis.candidateGroups.map((group) => Object.freeze({
    groupType: 'CANDIDATE',
    groupRef: group.candidateGroupRef,
    normalizedSourceValue: group.normalizedSourceValue,
    memberCount: group.memberCount,
    subjectRefs: Object.freeze([...group.subjectRefs]),
    sourceStringRefs: Object.freeze([...group.sourceStringRefs]),
    localeRefs: Object.freeze(localeRefsFor(group.sourceStringRefs)),
    disposition: group.suggestedDisposition,
    evidence: Object.freeze([...group.evidence]),
  }));
  const sharedRows = analysis.sharedSourceIdentities.map((row) => Object.freeze({
    groupType: 'ALREADY_SHARED_SOURCE',
    groupRef: `shared-source.${row.sourceStringRef}`,
    normalizedSourceValue: row.sourceValue.normalize('NFC'),
    memberCount: row.occurrenceRefs.length,
    subjectRefs: Object.freeze([row.subjectRef]),
    sourceStringRefs: Object.freeze([row.sourceStringRef]),
    localeRefs: Object.freeze(localeRefsFor([row.sourceStringRef])),
    disposition: 'ALREADY_SHARED',
    evidence: Object.freeze(['ONE_SOURCE_IDENTITY_REUSED']),
  }));
  return Object.freeze([...candidateRows, ...sharedRows].sort(
    (left, right) => left.normalizedSourceValue.localeCompare(right.normalizedSourceValue)
      || left.groupRef.localeCompare(right.groupRef),
  ));
}

function coverage(inventories, workLocaleRefs, changeRows) {
  const localeRefs = uniqueSorted([
    ...inventories.flatMap((inventory) => inventory.locales.map((row) => row.localeRef)),
    ...workLocaleRefs,
    ...changeRows.map((row) => row.localeRef),
  ]);
  const activeRequestCount = (subjectRef, localeRef) => changeRows.filter(
    (row) => row.subjectRef === subjectRef && row.localeRef === localeRef && row.state !== 'SATISFIED',
  ).length;
  return Object.freeze(inventories.flatMap((inventory) => localeRefs.map((localeRef) => {
    const observed = inventory.locales.find((row) => row.localeRef === localeRef) ?? null;
    if (localeRef === inventory.sourceLocale) {
      return Object.freeze({
        inventoryRef: inventory.inventoryRef,
        subjectRef: inventory.subjectRef,
        revision: inventory.sourceSnapshot.commit,
        localeRef,
        role: 'SOURCE',
        completeness: 'SOURCE',
        observedStringCount: inventory.summary.sourceStringCount,
        missingStringCount: 0,
        sourceStringCount: inventory.summary.sourceStringCount,
        requestedChangeCount: activeRequestCount(inventory.subjectRef, localeRef),
      });
    }
    if (!observed) {
      return Object.freeze({
        inventoryRef: inventory.inventoryRef,
        subjectRef: inventory.subjectRef,
        revision: inventory.sourceSnapshot.commit,
        localeRef,
        role: 'VARIANT',
        completeness: 'NOT_OBSERVED',
        observedStringCount: 0,
        missingStringCount: inventory.summary.sourceStringCount,
        sourceStringCount: inventory.summary.sourceStringCount,
        requestedChangeCount: activeRequestCount(inventory.subjectRef, localeRef),
      });
    }
    return Object.freeze({
      inventoryRef: inventory.inventoryRef,
      subjectRef: inventory.subjectRef,
      revision: inventory.sourceSnapshot.commit,
      localeRef,
      role: observed.role,
      completeness: observed.completeness,
      observedStringCount: observed.observedStringCount ?? inventory.summary.sourceStringCount,
      missingStringCount: observed.missingStringCount ?? 0,
      sourceStringCount: inventory.summary.sourceStringCount,
      requestedChangeCount: activeRequestCount(inventory.subjectRef, localeRef),
    });
  })).sort((left, right) => left.subjectRef.localeCompare(right.subjectRef) || left.localeRef.localeCompare(right.localeRef)));
}

function locales(coverageRows) {
  const byLocale = new Map();
  for (const row of coverageRows) {
    if (!byLocale.has(row.localeRef)) byLocale.set(row.localeRef, []);
    byLocale.get(row.localeRef).push(row);
  }
  return Object.freeze([...byLocale.entries()].sort(([left], [right]) => left.localeCompare(right)).map(([localeRef, rows]) => Object.freeze({
    localeRef,
    subjectCount: rows.length,
    observedSubjectCount: rows.filter((row) => row.completeness !== 'NOT_OBSERVED').length,
    completeSubjectCount: rows.filter((row) => ['SOURCE', 'OBSERVED_COMPLETE'].includes(row.completeness)).length,
    observedStringCount: rows.reduce((sum, row) => sum + row.observedStringCount, 0),
    missingStringCount: rows.reduce((sum, row) => sum + row.missingStringCount, 0),
    sourceStringCount: rows.reduce((sum, row) => sum + row.sourceStringCount, 0),
    requestedChangeCount: rows.reduce((sum, row) => sum + row.requestedChangeCount, 0),
    subjectRefs: Object.freeze(rows.map((row) => row.subjectRef)),
  })));
}

function changeSetRows(collectionInput, inventories) {
  const collection = normalizeLocalizationChangeSetCollection(
    collectionInput ?? createLocalizationChangeSetCollection(),
  );
  const bySubject = new Map(inventories.map((inventory) => [inventory.subjectRef, inventory]));
  const rows = [];
  for (const changeSet of collection.changeSets) {
    const currentInventory = bySubject.get(changeSet.subjectRef) ?? null;
    if (!currentInventory) {
      for (const change of changeSet.changes) rows.push(Object.freeze({
        changeSetRef: changeSet.changeSetRef,
        subjectRef: changeSet.subjectRef,
        observedRevision: changeSet.observedRevision,
        currentRevisionOrNull: null,
        sourceStringRef: change.sourceStringRef,
        localeRef: change.locale,
        state: 'UNCONNECTED_SUBJECT',
        observedValueOrNull: change.observedValueOrNull,
        currentValueOrNull: null,
        expectedValue: change.expectedValue,
        occurrenceRefs: Object.freeze([...change.occurrenceRefs]),
      }));
      continue;
    }
    const reconciliation = reconcileLocalizationChangeSet(changeSet, currentInventory);
    for (const change of reconciliation.changes) rows.push(Object.freeze({
      changeSetRef: changeSet.changeSetRef,
      subjectRef: changeSet.subjectRef,
      observedRevision: changeSet.observedRevision,
      currentRevisionOrNull: reconciliation.currentRevision,
      sourceStringRef: change.sourceStringRef,
      localeRef: change.locale,
      state: change.state,
      observedValueOrNull: change.observedValueOrNull,
      currentValueOrNull: change.currentValueOrNull,
      expectedValue: change.expectedValue,
      occurrenceRefs: Object.freeze([...change.occurrenceRefs]),
    }));
  }
  return Object.freeze(rows.sort(
    (left, right) => left.subjectRef.localeCompare(right.subjectRef)
      || left.changeSetRef.localeCompare(right.changeSetRef)
      || left.sourceStringRef.localeCompare(right.sourceStringRef)
      || left.localeRef.localeCompare(right.localeRef),
  ));
}

export function projectLocalizationWorkspace({
  inventories: inventoryInputs,
  changeSetCollection = null,
  workLocaleRefs = [],
} = {}) {
  const inventories = normalizeInventories(inventoryInputs);
  if (!Array.isArray(workLocaleRefs)) fail('workLocaleRefs must be an array');
  const projectedWorkLocales = Object.freeze(uniqueSorted(
    workLocaleRefs.map((localeRef) => normalizeLocalizationLocaleRef(localeRef)),
  ));
  const analysis = analyzeLocalizationConvergence(inventories);
  const stringRows = strings(inventories);
  const elementRows = elements(inventories);
  const changeRows = changeSetRows(changeSetCollection, inventories);
  const coverageRows = coverage(inventories, projectedWorkLocales, changeRows);
  const localeRows = locales(coverageRows);
  const valueRows = values(stringRows, analysis);
  const groupRows = groups(analysis, stringRows);
  return Object.freeze({
    schemaVersion: LOCALIZATION_WORKSPACE_SCHEMA,
    subjectRefs: Object.freeze(inventories.map((inventory) => inventory.subjectRef)),
    inventoryRefs: Object.freeze(inventories.map((inventory) => inventory.inventoryRef)),
    revisions: Object.freeze(Object.fromEntries(inventories.map((inventory) => [inventory.subjectRef, inventory.sourceSnapshot.commit]))),
    elements: elementRows,
    strings: stringRows,
    values: valueRows,
    groups: groupRows,
    locales: localeRows,
    coverage: coverageRows,
    changeSets: changeRows,
    summary: Object.freeze({
      inventoryCount: inventories.length,
      subjectCount: inventories.length,
      sourceStringCount: stringRows.length,
      occurrenceCount: elementRows.length,
      valueCount: valueRows.length,
      candidateGroupCount: analysis.summary.candidateGroupCount,
      alreadySharedSourceCount: analysis.summary.alreadySharedSourceCount,
      localeCount: localeRows.length,
      changeSetCount: uniqueSorted(changeRows.map((row) => row.changeSetRef)).length,
      activeChangeCount: changeRows.filter((row) => !['SATISFIED'].includes(row.state)).length,
      workLocaleCount: projectedWorkLocales.length,
    }),
  });
}

export function localizationWorkspaceRows(projection, pivot) {
  if (!projection || projection.schemaVersion !== LOCALIZATION_WORKSPACE_SCHEMA) fail('workspace projection required');
  if (!LOCALIZATION_WORKSPACE_PIVOTS.includes(pivot)) fail(`unsupported pivot ${pivot}`);
  return projection[pivot === 'CHANGE_SETS' ? 'changeSets' : pivot.toLowerCase()];
}

function rowSubjectRefs(row) {
  if (typeof row.subjectRef === 'string') return [row.subjectRef];
  return Array.isArray(row.subjectRefs) ? row.subjectRefs : [];
}

function rowLocaleRefs(row) {
  if (typeof row.localeRef === 'string') return [row.localeRef];
  return Array.isArray(row.localeRefs) ? row.localeRefs : [];
}

export function filterLocalizationWorkspaceRows(projection, pivot, {
  query = '',
  subjectRef = null,
  localeRef = null,
  limit = 500,
} = {}) {
  if (!Number.isInteger(limit) || limit < 1 || limit > 5000) fail('limit must be an integer from 1 to 5000');
  const rows = localizationWorkspaceRows(projection, pivot);
  const needle = String(query ?? '').trim().toLowerCase();
  const subject = subjectRef === null ? null : String(subjectRef);
  const locale = localeRef === null ? null : normalizeLocalizationLocaleRef(localeRef);
  return Object.freeze(rows.filter((row) => {
    if (subject && !rowSubjectRefs(row).includes(subject)) return false;
    if (locale && !rowLocaleRefs(row).includes(locale)) return false;
    if (needle && !JSON.stringify(row).toLowerCase().includes(needle)) return false;
    return true;
  }).slice(0, limit));
}

// [VXG RealForever][VEXWORK][VEXBOARD][LOCALIZATION][A5-WORKSPACE]
