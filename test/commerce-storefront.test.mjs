import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  COMMERCE_STOREFRONT_DOCUMENT_SCHEMA,
  COMMERCE_STOREFRONT_PUBLICATION_RECEIPT_SCHEMA,
  createCommerceStorefrontDocument,
  createCommerceStorefrontPublicationReceipt,
} from '../src/adapters/commerce-storefront.mjs';
import {
  COMMERCE_ITEM_OBSERVATION_SCHEMA,
  createCommerceItemObservation,
} from '../src/adapters/commerce-item-model.mjs';

const repositoryRegistry = {
  schemaVersion: 'vexwork.repository-registry/v1',
  repositories: [{
    repositoryRef: 'repo.example-storefront',
    label: 'Example Storefront',
    provider: 'GITHUB',
    nameWithOwner: 'example/storefront',
    visibility: 'PUBLIC',
    purpose: 'Synthetic storefront owner used only to prove repository-bound publication receipts.',
    entryRefs: ['README.md'],
    cultureRefs: [],
  }],
};

function item(overrides = {}) {
  return createCommerceItemObservation({
    schemaVersion: COMMERCE_ITEM_OBSERVATION_SCHEMA,
    itemRef: 'item.commerce.example.plate-001',
    providerRef: 'provider.commerce.example',
    label: 'Blue floral plate',
    inventoryState: 'AVAILABLE',
    observedAt: '2026-10-23T05:20:00.000Z',
    sourceRefs: ['provider.commerce.example:item/plate-001'],
    ...overrides,
  });
}

function document(sourceItem = item(), overrides = {}) {
  return createCommerceStorefrontDocument({
    schemaVersion: COMMERCE_STOREFRONT_DOCUMENT_SCHEMA,
    documentRef: 'document.commerce.example.plate-001.storefront',
    storefrontRef: 'storefront.commerce.example',
    publicFieldRefs: [],
    imageRefs: [],
    sourceRefs: ['source.commerce.example.storefront-selection'],
    ...overrides,
  }, { item: sourceItem });
}

function receipt(sourceDocument, sourceItem, overrides = {}) {
  return createCommerceStorefrontPublicationReceipt({
    schemaVersion: COMMERCE_STOREFRONT_PUBLICATION_RECEIPT_SCHEMA,
    receiptRef: 'receipt.commerce.example.plate-001.publication',
    storefrontRef: sourceDocument.storefrontRef,
    documentRef: sourceDocument.documentRef,
    itemRef: sourceDocument.itemRef,
    documentSemanticFingerprint: sourceDocument.semanticFingerprint,
    ownerRepositoryRef: 'repo.example-storefront',
    publicationState: 'PUBLISHED',
    publicUrlOrNull: 'https://example.com/items/plate-001',
    observedAt: '2026-10-23T05:25:00.000Z',
    sourceRefs: ['repo.example-storefront:publication/plate-001'],
    evidenceRefs: ['evidence.example-storefront.plate-001.public'],
    ...overrides,
  }, {
    repositoryRegistry,
    document: sourceDocument,
    item: sourceItem,
  });
}

test('minimal item forms a public storefront document without invented optional content', () => {
  const sourceItem = item();
  const result = document(sourceItem);
  assert.equal(result.itemRef, sourceItem.itemRef);
  assert.equal(result.label, 'Blue floral plate');
  assert.equal(result.availabilityState, 'AVAILABLE');
  assert.deepEqual(result.publicFieldRefs, []);
  assert.deepEqual(result.publicFields, {});
  assert.deepEqual(result.imageRefs, []);
  assert.equal(result.effects, false);
  assert.equal(result.executionAuthority, 'NONE');
});

test('only explicitly selected known fields and item images become public document content', () => {
  const sourceItem = item({
    description: 'Hand-painted floral plate.',
    condition: 'Visible age wear.',
    price: { amountMinor: 12500, currency: 'USD' },
    imageRefs: ['media.plate-001.back', 'media.plate-001.front'],
  });
  const result = document(sourceItem, {
    publicFieldRefs: [
      'field.commerce.storefront.price',
      'field.commerce.storefront.description',
    ],
    imageRefs: ['media.plate-001.front'],
  });

  assert.deepEqual(result.publicFieldRefs, [
    'field.commerce.storefront.description',
    'field.commerce.storefront.price',
  ]);
  assert.deepEqual(result.publicFields, {
    description: 'Hand-painted floral plate.',
    price: { amountMinor: 12500, currency: 'USD' },
  });
  assert.deepEqual(result.imageRefs, ['media.plate-001.front']);
  assert.equal(Object.hasOwn(result.publicFields, 'condition'), false);
});

test('requested public fields must exist and image selection must come from current item', () => {
  assert.throws(
    () => document(item(), { publicFieldRefs: ['field.commerce.storefront.price'] }),
    /does not contain price/,
  );
  assert.throws(
    () => document(item({ imageRefs: ['media.plate-001.front'] }), {
      imageRefs: ['media.plate-001.back'],
    }),
    /subset of Commerce item imageRefs/,
  );
  assert.throws(
    () => document(item(), { publicFieldRefs: ['field.commerce.storefront.shipping-address'] }),
    /unsupported publicFieldRef/,
  );
});

test('operational fulfillment and shipment fields never project into storefront document', () => {
  const sourceItem = item({
    inventoryState: 'SOLD',
    soldAt: '2026-10-23T05:19:00.000Z',
    expectedShipmentAt: '2026-10-24T18:00:00.000Z',
    fulfillmentEvidenceRefs: ['evidence.plate-001.shipment'],
    description: 'Sold plate.',
  });
  const result = document(sourceItem, {
    publicFieldRefs: ['field.commerce.storefront.description'],
  });

  assert.equal(result.availabilityState, 'SOLD');
  assert.equal(Object.hasOwn(result, 'soldAt'), false);
  assert.equal(Object.hasOwn(result, 'expectedShipmentAt'), false);
  assert.equal(Object.hasOwn(result, 'fulfillmentEvidenceRefs'), false);
  assert.deepEqual(result.publicFields, { description: 'Sold plate.' });
});

test('public selection ordering does not manufacture storefront document identity drift', () => {
  const sourceItem = item({
    description: 'Plate.',
    condition: 'Good.',
    imageRefs: ['media.b', 'media.a'],
  });
  const left = document(sourceItem, {
    publicFieldRefs: [
      'field.commerce.storefront.description',
      'field.commerce.storefront.condition',
    ],
    imageRefs: ['media.b', 'media.a'],
    sourceRefs: ['source.z', 'source.a'],
  });
  const right = document(sourceItem, {
    publicFieldRefs: [
      'field.commerce.storefront.condition',
      'field.commerce.storefront.description',
    ],
    imageRefs: ['media.a', 'media.b'],
    sourceRefs: ['source.a', 'source.z'],
  });
  assert.deepEqual(left, right);
  assert.equal(left.semanticFingerprint, right.semanticFingerprint);
});

test('new item observation revises document identity and rejects stale storefront content', () => {
  const firstItem = item({
    description: 'Original description.',
  });
  const firstDocument = document(firstItem, {
    publicFieldRefs: ['field.commerce.storefront.description'],
  });

  const nextItem = item({
    observedAt: '2026-10-23T05:21:00.000Z',
    description: 'Revised description.',
  });
  const nextDocument = document(nextItem, {
    publicFieldRefs: ['field.commerce.storefront.description'],
  });

  assert.equal(firstDocument.itemRef, nextDocument.itemRef);
  assert.notEqual(firstDocument.itemSemanticFingerprint, nextDocument.itemSemanticFingerprint);
  assert.notEqual(firstDocument.semanticFingerprint, nextDocument.semanticFingerprint);
  assert.deepEqual(nextDocument.publicFields, { description: 'Revised description.' });

  assert.throws(
    () => receipt(firstDocument, nextItem),
    /does not match current Commerce item observation/,
  );
});

test('publication receipt proves observed public state without performing publication', () => {
  const sourceItem = item({ description: 'Plate.' });
  const sourceDocument = document(sourceItem, {
    publicFieldRefs: ['field.commerce.storefront.description'],
  });
  const result = receipt(sourceDocument, sourceItem);

  assert.equal(result.publicationState, 'PUBLISHED');
  assert.equal(result.publicUrlOrNull, 'https://example.com/items/plate-001');
  assert.equal(result.ownerRepositoryRef, 'repo.example-storefront');
  assert.equal(result.effects, false);
  assert.equal(result.executionAuthority, 'NONE');
});

test('published and withdrawn receipts require evidence; published also requires HTTPS URL', () => {
  const sourceItem = item();
  const sourceDocument = document(sourceItem);

  assert.throws(
    () => receipt(sourceDocument, sourceItem, { evidenceRefs: [] }),
    /PUBLISHED requires evidenceRefs/,
  );
  assert.throws(
    () => receipt(sourceDocument, sourceItem, { publicUrlOrNull: null }),
    /PUBLISHED requires publicUrlOrNull/,
  );
  assert.throws(
    () => receipt(sourceDocument, sourceItem, { publicUrlOrNull: 'http://example.com/item' }),
    /must use https/,
  );
  assert.throws(
    () => receipt(sourceDocument, sourceItem, {
      publicationState: 'WITHDRAWN',
      publicUrlOrNull: null,
      evidenceRefs: [],
    }),
    /WITHDRAWN requires evidenceRefs/,
  );

  const withdrawn = receipt(sourceDocument, sourceItem, {
    publicationState: 'WITHDRAWN',
    publicUrlOrNull: null,
    evidenceRefs: ['evidence.example-storefront.plate-001.withdrawn'],
  });
  assert.equal(withdrawn.publicationState, 'WITHDRAWN');
});

test('unknown publication may remain evidence-free without inventing public success', () => {
  const sourceItem = item();
  const sourceDocument = document(sourceItem);
  const result = receipt(sourceDocument, sourceItem, {
    publicationState: 'UNKNOWN',
    publicUrlOrNull: null,
    evidenceRefs: [],
  });
  assert.equal(result.publicationState, 'UNKNOWN');
  assert.equal(result.publicUrlOrNull, null);
  assert.deepEqual(result.evidenceRefs, []);
});

test('publication receipts require a registered owner repository and exact document binding', () => {
  const sourceItem = item();
  const sourceDocument = document(sourceItem);

  assert.throws(
    () => receipt(sourceDocument, sourceItem, { ownerRepositoryRef: 'repo.not-registered' }),
    /unknown repositoryRef/,
  );
  assert.throws(
    () => receipt(sourceDocument, sourceItem, { itemRef: 'item.commerce.example.other' }),
    /itemRef must match document/,
  );
  assert.throws(
    () => receipt(sourceDocument, sourceItem, { documentSemanticFingerprint: '0'.repeat(64) }),
    /must match document/,
  );
  assert.throws(
    () => receipt(sourceDocument, sourceItem, { observedAt: '2026-10-23T05:19:59.000Z' }),
    /cannot predate Commerce item observation/,
  );
});

test('tampered storefront documents cannot be accepted against current item truth', () => {
  const sourceItem = item({ description: 'Plate.' });
  const sourceDocument = document(sourceItem, {
    publicFieldRefs: ['field.commerce.storefront.description'],
  });
  const tampered = {
    ...sourceDocument,
    publicFields: { description: 'Different text.' },
  };

  assert.throws(
    () => receipt(tampered, sourceItem),
    /semanticFingerprint mismatch/,
  );
});

test('storefront input fails closed on hidden or private-data-shaped fields', () => {
  const sourceItem = item();

  assert.throws(
    () => createCommerceStorefrontDocument({
      schemaVersion: COMMERCE_STOREFRONT_DOCUMENT_SCHEMA,
      documentRef: 'document.commerce.example.plate-001.storefront',
      storefrontRef: 'storefront.commerce.example',
      publicFieldRefs: [],
      imageRefs: [],
      sourceRefs: ['source.test'],
      shippingAddress: 'private address',
    }, { item: sourceItem }),
    /unexpected or missing fields/,
  );

  const sourceDocument = document(sourceItem);
  assert.throws(
    () => createCommerceStorefrontPublicationReceipt({
      schemaVersion: COMMERCE_STOREFRONT_PUBLICATION_RECEIPT_SCHEMA,
      receiptRef: 'receipt.commerce.example.plate-001.publication',
      storefrontRef: sourceDocument.storefrontRef,
      documentRef: sourceDocument.documentRef,
      itemRef: sourceDocument.itemRef,
      documentSemanticFingerprint: sourceDocument.semanticFingerprint,
      ownerRepositoryRef: 'repo.example-storefront',
      publicationState: 'PUBLISHED',
      publicUrlOrNull: 'https://example.com/items/plate-001',
      observedAt: '2026-10-23T05:25:00.000Z',
      sourceRefs: ['source.test'],
      evidenceRefs: ['evidence.test'],
      publicationAuthority: 'WRITE_PROVIDER',
    }, { repositoryRegistry, document: sourceDocument, item: sourceItem }),
    /unexpected or missing fields/,
  );
});


test('lived reference storefront publication reconstructs one exact PUBLISHED receipt', () => {
  const proof = JSON.parse(fs.readFileSync(new URL('../projects/vexwork-operational-console/commerce-storefront-reference-publication.json', import.meta.url), 'utf8'));
  const registry = JSON.parse(fs.readFileSync(new URL('../blueprint/repository-registry.json', import.meta.url), 'utf8'));
  const sourceItem = createCommerceItemObservation(proof.itemObservation);
  const stored = proof.publicationReceipt;
  const result = createCommerceStorefrontPublicationReceipt({
    schemaVersion: stored.schemaVersion,
    receiptRef: stored.receiptRef,
    storefrontRef: stored.storefrontRef,
    documentRef: stored.documentRef,
    itemRef: stored.itemRef,
    documentSemanticFingerprint: stored.documentSemanticFingerprint,
    ownerRepositoryRef: stored.ownerRepositoryRef,
    publicationState: stored.publicationState,
    publicUrlOrNull: stored.publicUrlOrNull,
    observedAt: stored.observedAt,
    sourceRefs: stored.sourceRefs,
    evidenceRefs: stored.evidenceRefs,
  }, {
    repositoryRegistry: registry,
    document: proof.storefrontDocument,
    item: sourceItem,
  });

  assert.deepEqual(result, proof.publicationReceipt);
  assert.equal(result.publicationState, 'PUBLISHED');
  assert.equal(result.ownerRepositoryRef, 'repo.vexcommerce-storefront-reference');
  assert.equal(result.publicUrlOrNull, 'https://vgong24.github.io/VexCommerce-Storefront-Reference/');
  assert.deepEqual(proof.storefrontDocument.imageRefs, ['assets/reference-plate.svg']);
  assert.equal(proof.hostEvidence.mergeCommit, 'a43b54a4626c6ff9b5eb2b402ffae9db9b466836');
  assert.equal(proof.hostEvidence.pageMarker, 'PASS');
  assert.equal(proof.hostEvidence.imageMarker, 'PASS');
  assert.equal(proof.hostEvidence.syntheticOnly, true);
  assert.equal(proof.hostEvidence.realCustomerDataIncluded, false);
});

// [VXG RealForever][VEXWORK][OPERATIONAL-CONSOLE][P4][COMMERCE-STOREFRONT]
