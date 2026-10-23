import {
  ATTENTION_QUEUE_SNAPSHOT_SCHEMA,
  createAttentionQueueSnapshot,
} from '../core/attention-queue.mjs';
import {
  verifySemanticFingerprint,
  withSemanticFingerprint,
} from '../core/semantic.mjs';
import {
  COMMERCE_ITEM_ENTITY_KIND,
  createCommerceItemObservation,
} from './commerce-item-model.mjs';

export const COMMERCE_FULFILLMENT_OBSERVATION_SCHEMA = 'vexwork.commerce-fulfillment-observation/v1';
export const COMMERCE_FULFILLMENT_STATES = Object.freeze([
  'ACTION_REQUIRED',
  'ACKNOWLEDGED',
  'UNKNOWN',
]);

const REF = /^[A-Za-z0-9][A-Za-z0-9._:/-]*$/u;
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/u;
const SOURCE_KEYS = Object.freeze([
  'schemaVersion',
  'fulfillmentRef',
  'itemRef',
  'providerRef',
  'fulfillmentState',
  'observedAt',
  'sourceRefs',
  'evidenceRefs',
]);
const STORED_KEYS = Object.freeze([
  ...SOURCE_KEYS,
  'effects',
  'executionAuthority',
  'semanticFingerprint',
]);
const ATTENTION_INPUT_KEYS = Object.freeze([
  'queueRef',
  'snapshotRef',
  'ownerRepositoryRef',
  'label',
  'purpose',
  'sourceRefs',
  'item',
  'fulfillment',
  'existingWorkRefs',
  'processRefOrNull',
]);

const ATTENTION_STATE_BY_FULFILLMENT_STATE = Object.freeze({
  ACTION_REQUIRED: 'ATTENTION',
  ACKNOWLEDGED: 'CLEAR',
  UNKNOWN: 'UNKNOWN',
});

const REASON_BY_FULFILLMENT_STATE = Object.freeze({
  ACTION_REQUIRED: 'reason.commerce.fulfillment.action-required',
  ACKNOWLEDGED: 'reason.commerce.fulfillment.acknowledged',
  UNKNOWN: 'reason.commerce.fulfillment.status-unknown',
});

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function stableRef(value, label) {
  assert(typeof value === 'string' && REF.test(value), `${label} must be one stable ref`);
  return value;
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
  assert(
    JSON.stringify(Object.keys(value).sort()) === JSON.stringify([...keys].sort()),
    `${label} has unexpected or missing fields`,
  );
}

function optionalExactKeys(value, required, optional, label) {
  assert(value && typeof value === 'object' && !Array.isArray(value), `${label} must be one object`);
  const allowed = new Set([...required, ...optional]);
  for (const key of Object.keys(value)) assert(allowed.has(key), `${label} has unexpected field ${key}`);
  for (const key of required) assert(Object.hasOwn(value, key), `${label} missing required field ${key}`);
}

function normalizedFulfillment(input) {
  const fulfillmentState = stableRef(input.fulfillmentState, 'fulfillmentState');
  assert(COMMERCE_FULFILLMENT_STATES.includes(fulfillmentState), `unsupported fulfillmentState ${fulfillmentState}`);
  const evidenceRefs = refs(input.evidenceRefs, 'evidenceRefs');
  if (fulfillmentState !== 'UNKNOWN') {
    assert(evidenceRefs.length > 0, `${fulfillmentState} requires evidenceRefs`);
  }
  return {
    schemaVersion: COMMERCE_FULFILLMENT_OBSERVATION_SCHEMA,
    fulfillmentRef: stableRef(input.fulfillmentRef, 'fulfillmentRef'),
    itemRef: stableRef(input.itemRef, 'itemRef'),
    providerRef: stableRef(input.providerRef, 'providerRef'),
    fulfillmentState,
    observedAt: timestamp(input.observedAt, 'observedAt'),
    sourceRefs: refs(input.sourceRefs, 'sourceRefs', { allowEmpty: false }),
    evidenceRefs,
    effects: false,
    executionAuthority: 'NONE',
  };
}

export function createCommerceFulfillmentObservation(input) {
  exactKeys(
    input,
    input?.semanticFingerprint === undefined ? SOURCE_KEYS : STORED_KEYS,
    'commerce fulfillment observation',
  );
  assert(
    input.schemaVersion === COMMERCE_FULFILLMENT_OBSERVATION_SCHEMA,
    'commerce fulfillment observation schema mismatch',
  );

  if (input.semanticFingerprint !== undefined) {
    assert(verifySemanticFingerprint(input), 'commerce fulfillment observation semanticFingerprint mismatch');
    assert(input.effects === false, 'stored commerce fulfillment observation effects must remain false');
    assert(input.executionAuthority === 'NONE', 'stored commerce fulfillment observation executionAuthority must remain NONE');
  }

  const accepted = withSemanticFingerprint(normalizedFulfillment(input));
  if (input.semanticFingerprint !== undefined) {
    assert(
      input.semanticFingerprint === accepted.semanticFingerprint,
      'commerce fulfillment observation semanticFingerprint is not canonical',
    );
  }
  return accepted;
}

export function createCommerceFulfillmentAttention(input, {
  repositoryRegistry,
  processRegistry = null,
}) {
  optionalExactKeys(
    input,
    ['queueRef', 'snapshotRef', 'ownerRepositoryRef', 'label', 'purpose', 'sourceRefs', 'item', 'fulfillment'],
    ['existingWorkRefs', 'processRefOrNull'],
    'commerce fulfillment attention input',
  );

  const item = createCommerceItemObservation(input.item);
  const fulfillment = createCommerceFulfillmentObservation(input.fulfillment);

  assert(item.inventoryState === 'SOLD', 'commerce fulfillment attention requires item inventoryState SOLD');
  assert(fulfillment.itemRef === item.itemRef, 'fulfillment itemRef must match Commerce item');
  assert(fulfillment.providerRef === item.providerRef, 'fulfillment providerRef must match Commerce item');
  assert(item.observedAt <= fulfillment.observedAt, 'fulfillment observation cannot precede Commerce item observation');

  const existingWorkRefs = refs(input.existingWorkRefs ?? [], 'existingWorkRefs');
  const processRefOrNull = input.processRefOrNull ?? null;
  if (processRefOrNull !== null) stableRef(processRefOrNull, 'processRefOrNull');

  const attentionState = ATTENTION_STATE_BY_FULFILLMENT_STATE[fulfillment.fulfillmentState];
  const entryLabel = fulfillment.fulfillmentState === 'ACKNOWLEDGED'
    ? `Fulfillment acknowledged: ${item.label}`
    : `Fulfill ${item.label}`;

  const combinedSourceRefs = refs([...new Set([
    ...input.sourceRefs,
    ...item.sourceRefs,
    ...fulfillment.sourceRefs,
  ])], 'combined sourceRefs', { allowEmpty: false });

  return createAttentionQueueSnapshot({
    schemaVersion: ATTENTION_QUEUE_SNAPSHOT_SCHEMA,
    queueRef: stableRef(input.queueRef, 'queueRef'),
    snapshotRef: stableRef(input.snapshotRef, 'snapshotRef'),
    ownerRepositoryRef: stableRef(input.ownerRepositoryRef, 'ownerRepositoryRef'),
    label: text(input.label, 'label'),
    purpose: text(input.purpose, 'purpose'),
    observedAt: fulfillment.observedAt,
    sourceRefs: combinedSourceRefs,
    entries: [{
      attentionRef: fulfillment.fulfillmentRef,
      subjectRef: item.itemRef,
      subjectKind: COMMERCE_ITEM_ENTITY_KIND,
      label: entryLabel,
      attentionState,
      observedAt: fulfillment.observedAt,
      reasonRefs: [REASON_BY_FULFILLMENT_STATE[fulfillment.fulfillmentState]],
      evidenceRefs: [...fulfillment.evidenceRefs],
      sourceRefs: combinedSourceRefs,
      existingWorkRefs,
      processRefOrNull,
    }],
  }, { repositoryRegistry, processRegistry });
}

// [VXG RealForever][VEXWORK][OPERATIONAL-CONSOLE][COMMERCE-FULFILLMENT-ATTENTION]
