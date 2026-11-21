// [VXG RealForever][VEXWORK][VEXBOARD][LOCALIZATION][CHANGE-SET]
//
// Mutable localization intent over immutable Product observation.
//
// A Localization Change Set records what a human expects to become true while preserving the
// Product-owned value that was observed when the request was formed. Reconciliation is derived
// against a fresh Localization Inventory; this module never mutates Product source and never owns
// completion as a separate ledger.

import {
  LOCALIZATION_INVENTORY_SCHEMA,
  localizationValueForLocale,
  normalizeLocalizationInventory,
  normalizeLocalizationLocaleRef,
} from './vexboard-localization-inventory.mjs';

export const LOCALIZATION_CHANGE_SET_SCHEMA = 'vexboard.localization-change-set/v1';
export const LOCALIZATION_CHANGE_STATES = Object.freeze([
  'SATISFIED',
  'OPEN',
  'OPEN_TRANSLATION',
  'DIVERGED',
  'SOURCE_REMOVED',
]);
export const LOCALIZATION_CHANGE_SET_COLLECTION_SCHEMA = 'vexboard.localization-change-set-collection/v1';
export const LOCALIZATION_CHANGE_SET_EXPORT_SCHEMA = 'vexboard.localization-change-set-export/v1';
export const LOCALIZATION_CHANGE_SET_EXPORT_MANIFEST_SCHEMA = 'vexboard.localization-change-set-export-manifest/v1';
export const LOCALIZATION_CHANGE_SET_STORAGE_KEY = 'vexboard.localization-change-sets/v1';

const REF = /^[A-Za-z0-9][A-Za-z0-9._:/-]*$/u;
const SHA = /^[0-9a-f]{40}$/u;
const SHA256 = /^[0-9a-f]{64}$/u;

function fail(message) {
  throw new TypeError(`localization change set: ${message}`);
}
function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  }
  return value;
}
export async function localizationSemanticHash(value) {
  if (!globalThis.crypto?.subtle) fail('Web Crypto SHA-256 required');
  const encoded = new TextEncoder().encode(JSON.stringify(canonicalize(value)));
  const digest = await globalThis.crypto.subtle.digest('SHA-256', encoded);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}
function text(value, label, { empty = false } = {}) {
  if (typeof value !== 'string' || (!empty && !value.trim())) fail(`${label} must be a string`);
  return value;
}
function ref(value, label) {
  const accepted = text(value, label);
  if (!REF.test(accepted)) fail(`${label} must be one stable ref`);
  return accepted;
}
function nullableText(value, label) {
  if (value === null || value === undefined) return null;
  return text(value, label, { empty: true });
}
function timestampOrNull(value, label) {
  if (value === null || value === undefined) return null;
  const accepted = text(value, label);
  if (!Number.isFinite(Date.parse(accepted))) fail(`${label} must be an ISO-compatible timestamp`);
  return accepted;
}
function uniqueSorted(values, label) {
  if (!Array.isArray(values)) fail(`${label} must be an array`);
  const out = values.map((value, index) => ref(value, `${label}[${index}]`)).sort();
  if (new Set(out).size !== out.length) fail(`${label} must be unique`);
  return out;
}
function inventory(input) {
  if (!input || input.schemaVersion !== LOCALIZATION_INVENTORY_SCHEMA) fail('Localization Inventory required');
  return input;
}
function normalizeChange(input) {
  return Object.freeze({
    changeRef: ref(input.changeRef, 'change.changeRef'),
    sourceStringRef: ref(input.sourceStringRef, 'change.sourceStringRef'),
    locale: normalizeLocalizationLocaleRef(input.locale),
    observedValueOrNull: input.observedValueOrNull === null
      ? null
      : text(input.observedValueOrNull, 'change.observedValueOrNull', { empty: true }),
    expectedValue: text(input.expectedValue, 'change.expectedValue', { empty: true }),
    occurrenceRefs: Object.freeze(uniqueSorted(input.occurrenceRefs ?? [], 'change.occurrenceRefs')),
    noteOrRationale: nullableText(input.noteOrRationale ?? null, 'change.noteOrRationale'),
  });
}

export function normalizeLocalizationChangeSet(input) {
  if (!input || input.schemaVersion !== LOCALIZATION_CHANGE_SET_SCHEMA) {
    fail(`schemaVersion must be ${LOCALIZATION_CHANGE_SET_SCHEMA}`);
  }
  const observedRevision = text(input.observedRevision, 'observedRevision');
  if (!SHA.test(observedRevision)) fail('observedRevision must be a full Git SHA');
  const changes = (input.changes ?? []).map(normalizeChange)
    .sort((left, right) => left.changeRef.localeCompare(right.changeRef));
  if (!changes.length) fail('changes must contain at least one requested change');
  if (new Set(changes.map((change) => change.changeRef)).size !== changes.length) fail('changeRef must be unique');
  const coordinates = changes.map((change) => `${change.sourceStringRef}|${change.locale}`);
  if (new Set(coordinates).size !== coordinates.length) fail('one Change Set cannot request two values for the same sourceStringRef + locale');

  return Object.freeze({
    schemaVersion: LOCALIZATION_CHANGE_SET_SCHEMA,
    changeSetRef: ref(input.changeSetRef, 'changeSetRef'),
    subjectRef: ref(input.subjectRef, 'subjectRef'),
    observedRevision,
    inventoryRef: ref(input.inventoryRef, 'inventoryRef'),
    changes: Object.freeze(changes),
  });
}


export function normalizeLocalizationChangeSetCollection(input) {
  if (!input || input.schemaVersion !== LOCALIZATION_CHANGE_SET_COLLECTION_SCHEMA) {
    fail(`collection.schemaVersion must be ${LOCALIZATION_CHANGE_SET_COLLECTION_SCHEMA}`);
  }
  const changeSets = (input.changeSets ?? []).map(normalizeLocalizationChangeSet)
    .sort((left, right) => left.changeSetRef.localeCompare(right.changeSetRef));
  if (new Set(changeSets.map((changeSet) => changeSet.changeSetRef)).size !== changeSets.length) {
    fail('collection.changeSetRef must be unique');
  }
  return Object.freeze({
    schemaVersion: LOCALIZATION_CHANGE_SET_COLLECTION_SCHEMA,
    changeSets: Object.freeze(changeSets),
  });
}

export function createLocalizationChangeSetCollection(changeSets = []) {
  return normalizeLocalizationChangeSetCollection({
    schemaVersion: LOCALIZATION_CHANGE_SET_COLLECTION_SCHEMA,
    changeSets,
  });
}

export function upsertLocalizationChangeSet(collectionInput, changeSetInput) {
  const collection = normalizeLocalizationChangeSetCollection(collectionInput);
  const changeSet = normalizeLocalizationChangeSet(changeSetInput);
  return createLocalizationChangeSetCollection([
    ...collection.changeSets.filter((candidate) => candidate.changeSetRef !== changeSet.changeSetRef),
    changeSet,
  ]);
}

export function serializeLocalizationChangeSetCollection(input) {
  return `${JSON.stringify(canonicalize(normalizeLocalizationChangeSetCollection(input)), null, 2)}\n`;
}

export function parseLocalizationChangeSetCollection(value) {
  const raw = typeof value === 'string' ? value : String(value ?? '');
  if (!raw.trim()) return createLocalizationChangeSetCollection();
  return normalizeLocalizationChangeSetCollection(JSON.parse(raw));
}

function storageAdapter(input) {
  if (!input || typeof input.getItem !== 'function' || typeof input.setItem !== 'function') {
    fail('storage adapter must provide getItem/setItem');
  }
  return input;
}

export function loadLocalizationChangeSetCollection(storageInput) {
  const storage = storageAdapter(storageInput);
  return parseLocalizationChangeSetCollection(storage.getItem(LOCALIZATION_CHANGE_SET_STORAGE_KEY));
}

export function saveLocalizationChangeSetCollection(storageInput, collectionInput) {
  const storage = storageAdapter(storageInput);
  const collection = normalizeLocalizationChangeSetCollection(collectionInput);
  storage.setItem(LOCALIZATION_CHANGE_SET_STORAGE_KEY, serializeLocalizationChangeSetCollection(collection));
  return collection;
}

export function createLocalizationChangeSet({ changeSetRef, inventory: inventoryInput, changes }) {
  const observed = inventory(inventoryInput);
  if (!Array.isArray(changes) || !changes.length) fail('changes must contain at least one requested change');

  const formed = changes.map((request, index) => {
    const sourceStringRef = ref(request.sourceStringRef, `changes[${index}].sourceStringRef`);
    const source = observed.strings.find((row) => row.sourceStringRef === sourceStringRef);
    if (!source) fail(`${sourceStringRef} is not present in observed inventory`);
    const locale = normalizeLocalizationLocaleRef(request.locale);
    const value = localizationValueForLocale(observed, sourceStringRef, locale);
    const occurrenceRefs = request.occurrenceRefs === undefined
      ? [...source.occurrenceRefs]
      : uniqueSorted(request.occurrenceRefs, `changes[${index}].occurrenceRefs`);
    const knownOccurrences = new Set(source.occurrenceRefs);
    for (const occurrenceRef of occurrenceRefs) {
      if (!knownOccurrences.has(occurrenceRef)) fail(`${occurrenceRef} is not an occurrence of ${sourceStringRef}`);
    }
    return {
      changeRef: request.changeRef,
      sourceStringRef,
      locale,
      observedValueOrNull: value.value,
      expectedValue: request.expectedValue,
      occurrenceRefs,
      noteOrRationale: request.noteOrRationale ?? null,
    };
  });

  return normalizeLocalizationChangeSet({
    schemaVersion: LOCALIZATION_CHANGE_SET_SCHEMA,
    changeSetRef,
    subjectRef: observed.subjectRef,
    observedRevision: observed.sourceSnapshot.commit,
    inventoryRef: observed.inventoryRef,
    changes: formed,
  });
}

function reconciliationState(change, currentInventory) {
  const source = currentInventory.strings.find((row) => row.sourceStringRef === change.sourceStringRef);
  if (!source) return { state: 'SOURCE_REMOVED', currentValueOrNull: null, currentLocaleState: null };

  const current = localizationValueForLocale(currentInventory, change.sourceStringRef, change.locale);
  if (current.value === change.expectedValue) {
    return { state: 'SATISFIED', currentValueOrNull: current.value, currentLocaleState: current.state };
  }
  if (current.value === change.observedValueOrNull) {
    return {
      state: current.state === 'MISSING' && change.observedValueOrNull === null ? 'OPEN_TRANSLATION' : 'OPEN',
      currentValueOrNull: current.value,
      currentLocaleState: current.state,
    };
  }
  return { state: 'DIVERGED', currentValueOrNull: current.value, currentLocaleState: current.state };
}

export function reconcileLocalizationChangeSet(changeSetInput, currentInventoryInput) {
  const changeSet = normalizeLocalizationChangeSet(changeSetInput);
  const currentInventory = inventory(currentInventoryInput);
  if (currentInventory.subjectRef !== changeSet.subjectRef) {
    fail(`subject mismatch: Change Set ${changeSet.subjectRef} vs inventory ${currentInventory.subjectRef}`);
  }

  const changes = changeSet.changes.map((change) => Object.freeze({
    ...change,
    ...reconciliationState(change, currentInventory),
  }));
  const counts = Object.fromEntries(LOCALIZATION_CHANGE_STATES.map((state) => [
    state,
    changes.filter((change) => change.state === state).length,
  ]));

  return Object.freeze({
    schemaVersion: 'vexboard.localization-change-set-reconciliation/v1',
    changeSetRef: changeSet.changeSetRef,
    subjectRef: changeSet.subjectRef,
    observedRevision: changeSet.observedRevision,
    currentRevision: currentInventory.sourceSnapshot.commit,
    changes: Object.freeze(changes),
    summary: Object.freeze({
      changeCount: changes.length,
      ...counts,
      activeCount: changes.filter((change) => change.state !== 'SATISFIED').length,
    }),
  });
}

function normalizeExportManifest(input) {
  if (!input || input.schemaVersion !== LOCALIZATION_CHANGE_SET_EXPORT_MANIFEST_SCHEMA) {
    fail(`export.manifest.schemaVersion must be ${LOCALIZATION_CHANGE_SET_EXPORT_MANIFEST_SCHEMA}`);
  }
  const observedRevision = text(input.observedRevision, 'export.manifest.observedRevision');
  if (!SHA.test(observedRevision)) fail('export.manifest.observedRevision must be a full Git SHA');
  const inventoryFingerprint = text(input.inventoryFingerprint, 'export.manifest.inventoryFingerprint');
  const changeSetFingerprint = text(input.changeSetFingerprint, 'export.manifest.changeSetFingerprint');
  if (!SHA256.test(inventoryFingerprint)) fail('export.manifest.inventoryFingerprint must be SHA-256');
  if (!SHA256.test(changeSetFingerprint)) fail('export.manifest.changeSetFingerprint must be SHA-256');
  return Object.freeze({
    schemaVersion: LOCALIZATION_CHANGE_SET_EXPORT_MANIFEST_SCHEMA,
    subjectRef: ref(input.subjectRef, 'export.manifest.subjectRef'),
    observedRevision,
    inventoryRef: ref(input.inventoryRef, 'export.manifest.inventoryRef'),
    inventoryFingerprint,
    changeSetFingerprint,
    exportedAtOrNull: timestampOrNull(input.exportedAtOrNull ?? null, 'export.manifest.exportedAtOrNull'),
  });
}

function assertObservedInventoryBinding(changeSet, observedInventory) {
  if (observedInventory.subjectRef !== changeSet.subjectRef) {
    fail(`observed subject mismatch: Change Set ${changeSet.subjectRef} vs inventory ${observedInventory.subjectRef}`);
  }
  if (observedInventory.inventoryRef !== changeSet.inventoryRef) {
    fail(`observed inventory mismatch: Change Set ${changeSet.inventoryRef} vs inventory ${observedInventory.inventoryRef}`);
  }
  if (observedInventory.sourceSnapshot.commit !== changeSet.observedRevision) {
    fail(`observed revision mismatch: Change Set ${changeSet.observedRevision} vs inventory ${observedInventory.sourceSnapshot.commit}`);
  }

  for (const change of changeSet.changes) {
    const source = observedInventory.strings.find((row) => row.sourceStringRef === change.sourceStringRef);
    if (!source) fail(`${change.sourceStringRef} is absent from observed inventory`);
    const observed = localizationValueForLocale(observedInventory, change.sourceStringRef, change.locale);
    if (observed.value !== change.observedValueOrNull) {
      fail(`${change.changeRef} observedValueOrNull disagrees with observed inventory`);
    }
    const knownOccurrences = new Set(source.occurrenceRefs);
    for (const occurrenceRef of change.occurrenceRefs) {
      if (!knownOccurrences.has(occurrenceRef)) {
        fail(`${change.changeRef} occurrence ${occurrenceRef} disagrees with observed inventory`);
      }
    }
  }
}

export async function createLocalizationChangeSetExport({
  changeSet: changeSetInput,
  inventory: inventoryInput,
  exportedAtOrNull = null,
}) {
  const changeSet = normalizeLocalizationChangeSet(changeSetInput);
  const observedInventory = normalizeLocalizationInventory(inventoryInput);
  assertObservedInventoryBinding(changeSet, observedInventory);
  const [inventoryFingerprint, changeSetFingerprint] = await Promise.all([
    localizationSemanticHash(observedInventory),
    localizationSemanticHash(changeSet),
  ]);
  return Object.freeze({
    schemaVersion: LOCALIZATION_CHANGE_SET_EXPORT_SCHEMA,
    manifest: Object.freeze({
      schemaVersion: LOCALIZATION_CHANGE_SET_EXPORT_MANIFEST_SCHEMA,
      subjectRef: changeSet.subjectRef,
      observedRevision: changeSet.observedRevision,
      inventoryRef: changeSet.inventoryRef,
      inventoryFingerprint,
      changeSetFingerprint,
      exportedAtOrNull: timestampOrNull(exportedAtOrNull, 'exportedAtOrNull'),
    }),
    changeSet,
  });
}

export async function normalizeLocalizationChangeSetExport(input) {
  if (!input || input.schemaVersion !== LOCALIZATION_CHANGE_SET_EXPORT_SCHEMA) {
    fail(`export.schemaVersion must be ${LOCALIZATION_CHANGE_SET_EXPORT_SCHEMA}`);
  }
  const manifest = normalizeExportManifest(input.manifest);
  const changeSet = normalizeLocalizationChangeSet(input.changeSet);
  if (manifest.subjectRef !== changeSet.subjectRef) fail('export manifest subjectRef disagrees with Change Set');
  if (manifest.observedRevision !== changeSet.observedRevision) fail('export manifest observedRevision disagrees with Change Set');
  if (manifest.inventoryRef !== changeSet.inventoryRef) fail('export manifest inventoryRef disagrees with Change Set');
  const observedChangeSetFingerprint = await localizationSemanticHash(changeSet);
  if (observedChangeSetFingerprint !== manifest.changeSetFingerprint) {
    fail('export Change Set fingerprint mismatch');
  }
  return Object.freeze({
    schemaVersion: LOCALIZATION_CHANGE_SET_EXPORT_SCHEMA,
    manifest,
    changeSet,
  });
}

export async function verifyLocalizationChangeSetExportObservedInventory(exportInput, inventoryInput) {
  const exported = await normalizeLocalizationChangeSetExport(exportInput);
  const observedInventory = normalizeLocalizationInventory(inventoryInput);
  assertObservedInventoryBinding(exported.changeSet, observedInventory);
  const fingerprint = await localizationSemanticHash(observedInventory);
  if (fingerprint !== exported.manifest.inventoryFingerprint) {
    fail('export observed inventory fingerprint mismatch');
  }
  return true;
}

export async function serializeLocalizationChangeSetExport(input) {
  const exported = await normalizeLocalizationChangeSetExport(input);
  return `${JSON.stringify(canonicalize(exported), null, 2)}\n`;
}

export async function parseLocalizationChangeSetExport(value) {
  const raw = typeof value === 'string' ? value : String(value ?? '');
  if (!raw.trim()) fail('export text required');
  return normalizeLocalizationChangeSetExport(JSON.parse(raw));
}

export async function importLocalizationChangeSetExport(
  exportInput,
  currentInventoryInput,
  { observedInventoryOrNull = null } = {},
) {
  const exported = typeof exportInput === 'string'
    ? await parseLocalizationChangeSetExport(exportInput)
    : await normalizeLocalizationChangeSetExport(exportInput);
  const currentInventory = normalizeLocalizationInventory(currentInventoryInput);
  if (currentInventory.subjectRef !== exported.changeSet.subjectRef) {
    fail(`import subject mismatch: Change Set ${exported.changeSet.subjectRef} vs inventory ${currentInventory.subjectRef}`);
  }

  let observedInventoryVerification = 'NOT_AVAILABLE';
  const observedInventory = observedInventoryOrNull
    ?? (
      currentInventory.sourceSnapshot.commit === exported.manifest.observedRevision
      && currentInventory.inventoryRef === exported.manifest.inventoryRef
        ? currentInventory
        : null
    );
  if (observedInventory) {
    await verifyLocalizationChangeSetExportObservedInventory(exported, observedInventory);
    observedInventoryVerification = 'VERIFIED';
  }

  return Object.freeze({
    schemaVersion: 'vexboard.localization-change-set-import/v1',
    manifest: exported.manifest,
    changeSet: exported.changeSet,
    observedInventoryVerification,
    reconciliation: reconcileLocalizationChangeSet(exported.changeSet, currentInventory),
  });
}

