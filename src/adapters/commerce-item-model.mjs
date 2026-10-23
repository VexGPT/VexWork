import {
  POPULATION_SNAPSHOT_SCHEMA,
  createPopulationSnapshot,
} from '../core/derived-attention.mjs';
import {
  verifySemanticFingerprint,
  withSemanticFingerprint,
} from '../core/semantic.mjs';

export const COMMERCE_ITEM_OBSERVATION_SCHEMA = 'vexwork.commerce-item-observation/v1';
export const COMMERCE_ITEM_ENTITY_KIND = 'entity.commerce.sellable-item';
export const COMMERCE_ITEM_INVENTORY_STATES = Object.freeze([
  'AVAILABLE',
  'SOLD',
  'WITHDRAWN',
  'UNKNOWN',
]);

const REF = /^[A-Za-z0-9][A-Za-z0-9._:/-]*$/u;
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/u;
const CURRENCY = /^[A-Z]{3}$/u;
const REQUIRED_KEYS = Object.freeze([
  'schemaVersion',
  'itemRef',
  'providerRef',
  'label',
  'inventoryState',
  'observedAt',
  'sourceRefs',
]);
const OPTIONAL_KEYS = Object.freeze([
  'description',
  'condition',
  'dimensions',
  'maker',
  'provenanceNotes',
  'price',
  'imageRefs',
  'listingUrl',
  'soldAt',
  'expectedShipmentAt',
  'fulfillmentEvidenceRefs',
]);
const STORED_KEYS = Object.freeze([
  'effects',
  'executionAuthority',
  'semanticFingerprint',
]);

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

function knownKeys(value, label) {
  assert(value && typeof value === 'object' && !Array.isArray(value), `${label} must be one object`);
  const allowed = new Set([...REQUIRED_KEYS, ...OPTIONAL_KEYS, ...STORED_KEYS]);
  for (const key of Object.keys(value)) assert(allowed.has(key), `${label} has unexpected field ${key}`);
  for (const key of REQUIRED_KEYS) assert(Object.hasOwn(value, key), `${label} missing required field ${key}`);
  if (value.semanticFingerprint === undefined) {
    assert(value.effects === undefined, `${label} source input cannot declare effects`);
    assert(value.executionAuthority === undefined, `${label} source input cannot declare executionAuthority`);
  }
}

function optionalText(value, label) {
  if (value === undefined) return undefined;
  return text(value, label);
}

function optionalTimestamp(value, label) {
  if (value === undefined) return undefined;
  return timestamp(value, label);
}

function canonicalHttpsUrl(value, label) {
  assert(typeof value === 'string' && value.length > 0, `${label} is required`);
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new TypeError(`${label} must be one canonical HTTPS URL`);
  }
  assert(parsed.protocol === 'https:', `${label} must use https`);
  assert(parsed.username === '' && parsed.password === '', `${label} must not contain URL credentials`);
  assert(parsed.hash === '', `${label} must not contain a fragment`);
  assert(parsed.toString() === value, `${label} must be canonical`);
  return value;
}

function normalizePrice(value) {
  assert(value && typeof value === 'object' && !Array.isArray(value), 'price must be one object');
  assert(JSON.stringify(Object.keys(value).sort()) === JSON.stringify(['amountMinor', 'currency']), 'price has unexpected fields');
  assert(Number.isInteger(value.amountMinor) && value.amountMinor >= 0, 'price.amountMinor must be one non-negative integer');
  assert(typeof value.currency === 'string' && CURRENCY.test(value.currency), 'price.currency must be one ISO-like uppercase currency code');
  return Object.freeze({ amountMinor: value.amountMinor, currency: value.currency });
}

function optionalNonemptyRefs(value, label) {
  if (value === undefined) return undefined;
  return refs(value, label, { allowEmpty: false });
}

function normalizedCore(input) {
  const inventoryState = stableRef(input.inventoryState, 'inventoryState');
  assert(COMMERCE_ITEM_INVENTORY_STATES.includes(inventoryState), `unsupported inventoryState ${inventoryState}`);

  const normalized = {
    schemaVersion: COMMERCE_ITEM_OBSERVATION_SCHEMA,
    itemRef: stableRef(input.itemRef, 'itemRef'),
    providerRef: stableRef(input.providerRef, 'providerRef'),
    label: text(input.label, 'label'),
    inventoryState,
    observedAt: timestamp(input.observedAt, 'observedAt'),
    sourceRefs: refs(input.sourceRefs, 'sourceRefs', { allowEmpty: false }),
    effects: false,
    executionAuthority: 'NONE',
  };

  for (const key of ['description', 'condition', 'dimensions', 'maker', 'provenanceNotes']) {
    const value = optionalText(input[key], key);
    if (value !== undefined) normalized[key] = value;
  }
  if (input.price !== undefined) normalized.price = normalizePrice(input.price);

  const imageRefs = optionalNonemptyRefs(input.imageRefs, 'imageRefs');
  if (imageRefs !== undefined) normalized.imageRefs = imageRefs;

  if (input.listingUrl !== undefined) normalized.listingUrl = canonicalHttpsUrl(input.listingUrl, 'listingUrl');

  const soldAt = optionalTimestamp(input.soldAt, 'soldAt');
  if (soldAt !== undefined) {
    assert(soldAt <= normalized.observedAt, 'soldAt cannot be after observedAt');
    normalized.soldAt = soldAt;
  }

  const expectedShipmentAt = optionalTimestamp(input.expectedShipmentAt, 'expectedShipmentAt');
  if (expectedShipmentAt !== undefined) normalized.expectedShipmentAt = expectedShipmentAt;

  const fulfillmentEvidenceRefs = optionalNonemptyRefs(input.fulfillmentEvidenceRefs, 'fulfillmentEvidenceRefs');
  if (fulfillmentEvidenceRefs !== undefined) normalized.fulfillmentEvidenceRefs = fulfillmentEvidenceRefs;

  const hasSoldOnlyData = soldAt !== undefined || expectedShipmentAt !== undefined || fulfillmentEvidenceRefs !== undefined;
  assert(!hasSoldOnlyData || inventoryState === 'SOLD', 'sold/shipment/fulfillment fields require inventoryState SOLD');

  return normalized;
}

export function createCommerceItemObservation(input) {
  knownKeys(input, 'commerce item observation');
  assert(input.schemaVersion === COMMERCE_ITEM_OBSERVATION_SCHEMA, 'commerce item observation schema mismatch');

  if (input.semanticFingerprint !== undefined) {
    assert(verifySemanticFingerprint(input), 'commerce item observation semanticFingerprint mismatch');
    assert(input.effects === false, 'stored commerce item observation effects must remain false');
    assert(input.executionAuthority === 'NONE', 'stored commerce item observation executionAuthority must remain NONE');
  }

  const accepted = withSemanticFingerprint(normalizedCore(input));
  if (input.semanticFingerprint !== undefined) {
    assert(input.semanticFingerprint === accepted.semanticFingerprint, 'commerce item observation semanticFingerprint is not canonical');
  }
  return accepted;
}

export function createCommerceItemPopulation({
  populationRef,
  snapshotRef,
  providerRef,
  label,
  observedAt,
  sourceRefs,
  items,
}) {
  stableRef(populationRef, 'populationRef');
  stableRef(snapshotRef, 'snapshotRef');
  providerRef = stableRef(providerRef, 'providerRef');
  text(label, 'population label');
  observedAt = timestamp(observedAt, 'population observedAt');
  sourceRefs = refs(sourceRefs, 'population sourceRefs', { allowEmpty: false });
  assert(Array.isArray(items), 'items must be an array');

  const acceptedItems = items.map((item) => createCommerceItemObservation(item));
  assert(new Set(acceptedItems.map((item) => item.itemRef)).size === acceptedItems.length, 'commerce itemRef must be unique');

  for (const item of acceptedItems) {
    assert(item.providerRef === providerRef, `${item.itemRef} providerRef must match population providerRef`);
    assert(item.observedAt <= observedAt, `${item.itemRef} observedAt cannot be after population observedAt`);
  }

  return createPopulationSnapshot({
    schemaVersion: POPULATION_SNAPSHOT_SCHEMA,
    populationRef,
    snapshotRef,
    providerRef,
    entityKind: COMMERCE_ITEM_ENTITY_KIND,
    label,
    observedAt,
    sourceRefs,
    scopes: [],
    entities: acceptedItems.map((item) => ({
      entityRef: item.itemRef,
      label: item.label,
      scopeRefs: [],
      sourceRefs: [...item.sourceRefs],
    })),
  });
}

// [VXG RealForever][VEXWORK][OPERATIONAL-CONSOLE][COMMERCE-ITEM-MODEL]
