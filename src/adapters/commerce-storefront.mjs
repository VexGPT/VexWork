import {
  assertKnownRepositoryRefs,
  validateRepositoryRegistry,
} from '../core/repository-graph.mjs';
import {
  verifySemanticFingerprint,
  withSemanticFingerprint,
} from '../core/semantic.mjs';
import {
  createCommerceItemObservation,
} from './commerce-item-model.mjs';

export const COMMERCE_STOREFRONT_DOCUMENT_SCHEMA = 'vexwork.commerce-storefront-document/v1';
export const COMMERCE_STOREFRONT_PUBLICATION_RECEIPT_SCHEMA = 'vexwork.commerce-storefront-publication-receipt/v1';

export const COMMERCE_STOREFRONT_PUBLIC_FIELD_REFS = Object.freeze([
  'field.commerce.storefront.condition',
  'field.commerce.storefront.description',
  'field.commerce.storefront.dimensions',
  'field.commerce.storefront.maker',
  'field.commerce.storefront.price',
  'field.commerce.storefront.provenance-notes',
]);

export const COMMERCE_STOREFRONT_PUBLICATION_STATES = Object.freeze([
  'PUBLISHED',
  'WITHDRAWN',
  'UNKNOWN',
]);

const REF = /^[A-Za-z0-9][A-Za-z0-9._:/-]*$/u;
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/u;
const FIELD_TO_ITEM_KEY = Object.freeze({
  'field.commerce.storefront.condition': 'condition',
  'field.commerce.storefront.description': 'description',
  'field.commerce.storefront.dimensions': 'dimensions',
  'field.commerce.storefront.maker': 'maker',
  'field.commerce.storefront.price': 'price',
  'field.commerce.storefront.provenance-notes': 'provenanceNotes',
});
const DOCUMENT_SOURCE_KEYS = Object.freeze([
  'schemaVersion',
  'documentRef',
  'storefrontRef',
  'publicFieldRefs',
  'imageRefs',
  'sourceRefs',
]);
const DOCUMENT_STORED_KEYS = Object.freeze([
  'schemaVersion',
  'documentRef',
  'storefrontRef',
  'itemRef',
  'itemSemanticFingerprint',
  'itemObservedAt',
  'label',
  'availabilityState',
  'publicFieldRefs',
  'imageRefs',
  'publicFields',
  'sourceRefs',
  'effects',
  'executionAuthority',
  'semanticFingerprint',
]);
const RECEIPT_SOURCE_KEYS = Object.freeze([
  'schemaVersion',
  'receiptRef',
  'storefrontRef',
  'documentRef',
  'itemRef',
  'documentSemanticFingerprint',
  'ownerRepositoryRef',
  'publicationState',
  'publicUrlOrNull',
  'observedAt',
  'sourceRefs',
  'evidenceRefs',
]);

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function stableRef(value, label) {
  assert(typeof value === 'string' && REF.test(value), label + ' must be one stable ref');
  return value;
}

function timestamp(value, label) {
  assert(typeof value === 'string' && ISO.test(value) && new Date(value).toISOString() === value, label + ' must be canonical UTC ISO');
  return value;
}

function refs(values, label, { allowEmpty = true } = {}) {
  assert(Array.isArray(values), label + ' must be an array');
  if (!allowEmpty) assert(values.length > 0, label + ' must not be empty');
  const result = values.map((value, index) => stableRef(value, label + '[' + index + ']'));
  assert(new Set(result).size === result.length, label + ' must be unique');
  return result.sort((left, right) => left.localeCompare(right));
}

function exactKeys(value, keys, label) {
  assert(value && typeof value === 'object' && !Array.isArray(value), label + ' must be one object');
  assert(
    JSON.stringify(Object.keys(value).sort()) === JSON.stringify([...keys].sort()),
    label + ' has unexpected or missing fields',
  );
}

function canonicalHttpsUrlOrNull(value, label) {
  if (value === null) return null;
  assert(typeof value === 'string' && value.length > 0, label + ' must be null or one HTTPS URL');
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new TypeError(label + ' must be null or one canonical HTTPS URL');
  }
  assert(parsed.protocol === 'https:', label + ' must use https');
  assert(parsed.username === '' && parsed.password === '', label + ' must not contain URL credentials');
  assert(parsed.hash === '', label + ' must not contain a fragment');
  assert(parsed.toString() === value, label + ' must be canonical');
  return value;
}

function publicFieldRefs(values) {
  const result = refs(values, 'publicFieldRefs');
  for (const ref of result) {
    assert(COMMERCE_STOREFRONT_PUBLIC_FIELD_REFS.includes(ref), 'unsupported publicFieldRef ' + ref);
  }
  return result;
}

function publicFieldsForItem(item, selectedRefs) {
  const result = {};
  for (const fieldRef of selectedRefs) {
    const itemKey = FIELD_TO_ITEM_KEY[fieldRef];
    assert(Object.hasOwn(item, itemKey), fieldRef + ' requested but Commerce item does not contain ' + itemKey);
    result[itemKey] = itemKey === 'price'
      ? { amountMinor: item.price.amountMinor, currency: item.price.currency }
      : item[itemKey];
  }
  return result;
}

function assertStoredDocument(document, { item }) {
  exactKeys(document, DOCUMENT_STORED_KEYS, 'commerce storefront document');
  assert(document.schemaVersion === COMMERCE_STOREFRONT_DOCUMENT_SCHEMA, 'commerce storefront document schema mismatch');
  assert(verifySemanticFingerprint(document), 'commerce storefront document semanticFingerprint mismatch');
  assert(document.effects === false, 'commerce storefront document effects must remain false');
  assert(document.executionAuthority === 'NONE', 'commerce storefront document executionAuthority must remain NONE');

  const rebuilt = createCommerceStorefrontDocument({
    schemaVersion: COMMERCE_STOREFRONT_DOCUMENT_SCHEMA,
    documentRef: document.documentRef,
    storefrontRef: document.storefrontRef,
    publicFieldRefs: document.publicFieldRefs,
    imageRefs: document.imageRefs,
    sourceRefs: document.sourceRefs,
  }, { item });

  assert(
    document.semanticFingerprint === rebuilt.semanticFingerprint,
    'commerce storefront document does not match current Commerce item observation',
  );
  return rebuilt;
}

export function createCommerceStorefrontDocument(input, { item }) {
  exactKeys(input, DOCUMENT_SOURCE_KEYS, 'commerce storefront document input');
  assert(input.schemaVersion === COMMERCE_STOREFRONT_DOCUMENT_SCHEMA, 'commerce storefront document schema mismatch');

  item = createCommerceItemObservation(item);
  const selectedFields = publicFieldRefs(input.publicFieldRefs);
  const selectedImages = refs(input.imageRefs, 'imageRefs');
  const availableImages = new Set(item.imageRefs ?? []);
  assert(selectedImages.every((ref) => availableImages.has(ref)), 'storefront imageRefs must be a subset of Commerce item imageRefs');

  const sourceRefs = refs([...new Set([
    ...input.sourceRefs,
    ...item.sourceRefs,
  ])], 'sourceRefs', { allowEmpty: false });

  return withSemanticFingerprint({
    schemaVersion: COMMERCE_STOREFRONT_DOCUMENT_SCHEMA,
    documentRef: stableRef(input.documentRef, 'documentRef'),
    storefrontRef: stableRef(input.storefrontRef, 'storefrontRef'),
    itemRef: item.itemRef,
    itemSemanticFingerprint: item.semanticFingerprint,
    itemObservedAt: item.observedAt,
    label: item.label,
    availabilityState: item.inventoryState,
    publicFieldRefs: selectedFields,
    imageRefs: selectedImages,
    publicFields: publicFieldsForItem(item, selectedFields),
    sourceRefs,
    effects: false,
    executionAuthority: 'NONE',
  });
}

export function createCommerceStorefrontPublicationReceipt(input, {
  repositoryRegistry,
  document,
  item,
}) {
  exactKeys(input, RECEIPT_SOURCE_KEYS, 'commerce storefront publication receipt input');
  assert(
    input.schemaVersion === COMMERCE_STOREFRONT_PUBLICATION_RECEIPT_SCHEMA,
    'commerce storefront publication receipt schema mismatch',
  );

  const repositoryValidation = validateRepositoryRegistry(repositoryRegistry);
  assert(repositoryValidation.ok, repositoryValidation.errors[0]);
  const acceptedDocument = assertStoredDocument(document, { item });

  const ownerRepositoryRef = stableRef(input.ownerRepositoryRef, 'ownerRepositoryRef');
  assertKnownRepositoryRefs([ownerRepositoryRef], repositoryRegistry);

  const publicationState = stableRef(input.publicationState, 'publicationState');
  assert(
    COMMERCE_STOREFRONT_PUBLICATION_STATES.includes(publicationState),
    'unsupported publicationState ' + publicationState,
  );

  const publicUrlOrNull = canonicalHttpsUrlOrNull(input.publicUrlOrNull, 'publicUrlOrNull');
  const evidenceRefs = refs(input.evidenceRefs, 'evidenceRefs');
  if (publicationState === 'PUBLISHED') {
    assert(publicUrlOrNull !== null, 'PUBLISHED requires publicUrlOrNull');
    assert(evidenceRefs.length > 0, 'PUBLISHED requires evidenceRefs');
  }
  if (publicationState === 'WITHDRAWN') {
    assert(evidenceRefs.length > 0, 'WITHDRAWN requires evidenceRefs');
  }

  assert(input.storefrontRef === acceptedDocument.storefrontRef, 'receipt storefrontRef must match document');
  assert(input.documentRef === acceptedDocument.documentRef, 'receipt documentRef must match document');
  assert(input.itemRef === acceptedDocument.itemRef, 'receipt itemRef must match document');
  assert(
    input.documentSemanticFingerprint === acceptedDocument.semanticFingerprint,
    'receipt documentSemanticFingerprint must match document',
  );
  const observedAt = timestamp(input.observedAt, 'observedAt');
  assert(observedAt >= acceptedDocument.itemObservedAt, 'publication receipt cannot predate Commerce item observation');

  return withSemanticFingerprint({
    schemaVersion: COMMERCE_STOREFRONT_PUBLICATION_RECEIPT_SCHEMA,
    receiptRef: stableRef(input.receiptRef, 'receiptRef'),
    storefrontRef: acceptedDocument.storefrontRef,
    documentRef: acceptedDocument.documentRef,
    itemRef: acceptedDocument.itemRef,
    documentSemanticFingerprint: acceptedDocument.semanticFingerprint,
    ownerRepositoryRef,
    publicationState,
    publicUrlOrNull,
    observedAt,
    sourceRefs: refs(input.sourceRefs, 'sourceRefs', { allowEmpty: false }),
    evidenceRefs,
    effects: false,
    executionAuthority: 'NONE',
  });
}

// [VXG RealForever][VEXWORK][OPERATIONAL-CONSOLE][COMMERCE-STOREFRONT]
