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

const REF = /^[A-Za-z0-9][A-Za-z0-9._:/-]*$/u;
const SHA = /^[0-9a-f]{40}$/u;

function fail(message) {
  throw new TypeError(`localization change set: ${message}`);
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
