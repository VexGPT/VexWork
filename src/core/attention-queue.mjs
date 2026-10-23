import { ATTENTION_STATES } from './derived-attention.mjs';
import { assertKnownProcessRefs } from './process-map.mjs';
import { assertKnownRepositoryRefs } from './repository-graph.mjs';
import { verifySemanticFingerprint, withSemanticFingerprint } from './semantic.mjs';

export const ATTENTION_QUEUE_SNAPSHOT_SCHEMA = 'vexwork.attention-queue-snapshot/v1';
export const ATTENTION_QUEUE_PROJECTION_SCHEMA = 'vexwork.attention-queue-projection/v1';
export const ATTENTION_QUEUE_STATES = Object.freeze(ATTENTION_STATES.filter((state) => state !== 'NOT_APPLICABLE'));

const REF = /^[A-Za-z0-9][A-Za-z0-9._:/-]*$/u;
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/u;

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function stableRef(value, label) {
  assert(typeof value === 'string' && REF.test(value), `${label} must be one stable ref`);
  return value;
}

function optionalRef(value, label) {
  if (value === null) return null;
  return stableRef(value, label);
}

function text(value, label) {
  assert(typeof value === 'string' && value.trim(), `${label} is required`);
  return value;
}

function timestamp(value, label) {
  assert(typeof value === 'string' && ISO.test(value) && new Date(value).toISOString() === value, `${label} must be canonical UTC ISO`);
  return value;
}

function refs(values, label, { allowEmpty = true } = {}) {
  assert(Array.isArray(values), `${label} must be an array`);
  if (!allowEmpty) assert(values.length > 0, `${label} must not be empty`);
  const result = values.map((value, index) => stableRef(value, `${label}[${index}]`));
  assert(new Set(result).size === result.length, `${label} must be unique`);
  return result.sort((left, right) => left.localeCompare(right));
}

function exactKeys(value, keys, label) {
  assert(value && typeof value === 'object' && !Array.isArray(value), `${label} must be one object`);
  assert(JSON.stringify(Object.keys(value).sort()) === JSON.stringify([...keys].sort()), `${label} has unexpected fields`);
}

function assertStoredFingerprintIfPresent(value, label) {
  if (value?.semanticFingerprint !== undefined) {
    assert(verifySemanticFingerprint(value), `${label} semanticFingerprint mismatch`);
  }
}

function withCanonicalSemanticFingerprint(input, normalized, label) {
  const accepted = withSemanticFingerprint(normalized);
  if (input?.semanticFingerprint !== undefined) {
    assert(input.semanticFingerprint === accepted.semanticFingerprint, `${label} semanticFingerprint is not canonical`);
  }
  return accepted;
}

function normalizeEntry(entry, index, processRegistry) {
  const keys = [
    'attentionRef', 'subjectRef', 'subjectKind', 'label', 'attentionState', 'observedAt',
    'reasonRefs', 'evidenceRefs', 'sourceRefs', 'existingWorkRefs', 'processRefOrNull',
  ];
  exactKeys(entry, keys, `entries[${index}]`);

  const processRefOrNull = optionalRef(entry.processRefOrNull, `entries[${index}].processRefOrNull`);
  if (processRefOrNull !== null) {
    assert(processRegistry && Array.isArray(processRegistry.processes), 'processRegistry required for routed attention entries');
    assertKnownProcessRefs([processRefOrNull], processRegistry);
  }

  const attentionState = stableRef(entry.attentionState, `entries[${index}].attentionState`);
  assert(ATTENTION_QUEUE_STATES.includes(attentionState), `unsupported attentionState ${attentionState}`);

  const evidenceRefs = refs(entry.evidenceRefs, `entries[${index}].evidenceRefs`);
  if (attentionState !== 'UNKNOWN') {
    assert(evidenceRefs.length > 0, `${entry.attentionRef} ${attentionState} requires evidenceRefs`);
  }

  return Object.freeze({
    attentionRef: stableRef(entry.attentionRef, `entries[${index}].attentionRef`),
    subjectRef: stableRef(entry.subjectRef, `entries[${index}].subjectRef`),
    subjectKind: stableRef(entry.subjectKind, `entries[${index}].subjectKind`),
    label: text(entry.label, `entries[${index}].label`),
    attentionState,
    observedAt: timestamp(entry.observedAt, `entries[${index}].observedAt`),
    reasonRefs: refs(entry.reasonRefs, `entries[${index}].reasonRefs`, { allowEmpty: false }),
    evidenceRefs,
    sourceRefs: refs(entry.sourceRefs, `entries[${index}].sourceRefs`, { allowEmpty: false }),
    existingWorkRefs: refs(entry.existingWorkRefs, `entries[${index}].existingWorkRefs`),
    processRefOrNull,
  });
}

export function createAttentionQueueSnapshot(input, { repositoryRegistry, processRegistry = null }) {
  const sourceKeys = [
    'schemaVersion', 'queueRef', 'snapshotRef', 'ownerRepositoryRef', 'label', 'purpose',
    'observedAt', 'sourceRefs', 'entries',
  ];
  const storedKeys = [...sourceKeys, 'effects', 'executionAuthority', 'semanticFingerprint'];
  exactKeys(input, input?.semanticFingerprint === undefined ? sourceKeys : storedKeys, 'attention queue snapshot');
  assertStoredFingerprintIfPresent(input, 'attention queue snapshot');
  assert(input?.schemaVersion === ATTENTION_QUEUE_SNAPSHOT_SCHEMA, 'attention queue snapshot schema mismatch');

  if (input.semanticFingerprint !== undefined) {
    assert(input.effects === false, 'stored attention queue snapshot effects must remain false');
    assert(input.executionAuthority === 'NONE', 'stored attention queue snapshot executionAuthority must remain NONE');
  }

  const ownerRepositoryRef = stableRef(input.ownerRepositoryRef, 'ownerRepositoryRef');
  assertKnownRepositoryRefs([ownerRepositoryRef], repositoryRegistry);
  const observedAt = timestamp(input.observedAt, 'observedAt');
  const sourceRefs = refs(input.sourceRefs, 'sourceRefs', { allowEmpty: false });
  assert(Array.isArray(input.entries), 'entries must be an array');

  const entries = input.entries
    .map((entry, index) => normalizeEntry(entry, index, processRegistry))
    .sort((left, right) => left.attentionRef.localeCompare(right.attentionRef));
  assert(new Set(entries.map((entry) => entry.attentionRef)).size === entries.length, 'attentionRef must be unique');
  for (const entry of entries) {
    assert(entry.observedAt <= observedAt, `${entry.attentionRef} observedAt cannot be after queue snapshot observedAt`);
  }

  return withCanonicalSemanticFingerprint(input, {
    schemaVersion: ATTENTION_QUEUE_SNAPSHOT_SCHEMA,
    queueRef: stableRef(input.queueRef, 'queueRef'),
    snapshotRef: stableRef(input.snapshotRef, 'snapshotRef'),
    ownerRepositoryRef,
    label: text(input.label, 'label'),
    purpose: text(input.purpose, 'purpose'),
    observedAt,
    sourceRefs,
    entries,
    effects: false,
    executionAuthority: 'NONE',
  }, 'attention queue snapshot');
}

export function projectAttentionQueue(snapshot, context) {
  snapshot = createAttentionQueueSnapshot(snapshot, context);
  const stateCounts = Object.fromEntries(ATTENTION_QUEUE_STATES.map((state) => [state, 0]));
  const existingWorkRefs = new Set();
  let processRoutedCount = 0;

  for (const entry of snapshot.entries) {
    stateCounts[entry.attentionState] += 1;
    for (const workRef of entry.existingWorkRefs) existingWorkRefs.add(workRef);
    if (entry.processRefOrNull !== null) processRoutedCount += 1;
  }

  const queuedEntries = snapshot.entries
    .filter((entry) => entry.attentionState !== 'CLEAR')
    .map((entry) => Object.freeze({
      ...entry,
      reasonRefs: [...entry.reasonRefs],
      evidenceRefs: [...entry.evidenceRefs],
      sourceRefs: [...entry.sourceRefs],
      existingWorkRefs: [...entry.existingWorkRefs],
    }));

  return withSemanticFingerprint({
    schemaVersion: ATTENTION_QUEUE_PROJECTION_SCHEMA,
    queueRef: snapshot.queueRef,
    snapshotRef: snapshot.snapshotRef,
    ownerRepositoryRef: snapshot.ownerRepositoryRef,
    label: snapshot.label,
    purpose: snapshot.purpose,
    observedAt: snapshot.observedAt,
    summary: Object.freeze({
      entryCount: snapshot.entries.length,
      queuedCount: queuedEntries.length,
      stateCounts,
      processRoutedCount,
      existingWorkRefs: [...existingWorkRefs].sort((left, right) => left.localeCompare(right)),
    }),
    queuedEntries,
    clearEntryRefs: snapshot.entries
      .filter((entry) => entry.attentionState === 'CLEAR')
      .map((entry) => entry.attentionRef),
    sourceRefs: [...snapshot.sourceRefs],
    effects: false,
    executionAuthority: 'NONE',
  });
}

// [VXG RealForever][VEXWORK][ATTENTION-QUEUE]
