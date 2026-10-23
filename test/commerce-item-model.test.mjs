import assert from 'node:assert/strict';
import test from 'node:test';

import {
  COMMERCE_ITEM_ENTITY_KIND,
  COMMERCE_ITEM_OBSERVATION_SCHEMA,
  createCommerceItemObservation,
  createCommerceItemPopulation,
} from '../src/adapters/commerce-item-model.mjs';
import { withSemanticFingerprint } from '../src/core/semantic.mjs';

function minimum(overrides = {}) {
  return {
    schemaVersion: COMMERCE_ITEM_OBSERVATION_SCHEMA,
    itemRef: 'item.commerce.example.plate-001',
    providerRef: 'provider.commerce.example',
    label: 'Blue floral plate',
    inventoryState: 'AVAILABLE',
    observedAt: '2026-10-23T05:00:00.000Z',
    sourceRefs: ['provider.commerce.example:item/plate-001'],
    ...overrides,
  };
}

test('minimum commerce item identity does not require enrichment fields', () => {
  const item = createCommerceItemObservation(minimum());
  assert.equal(item.itemRef, 'item.commerce.example.plate-001');
  assert.equal(item.inventoryState, 'AVAILABLE');
  assert.equal(item.effects, false);
  assert.equal(item.executionAuthority, 'NONE');
  for (const key of ['description', 'condition', 'dimensions', 'maker', 'provenanceNotes', 'price', 'imageRefs', 'listingUrl', 'soldAt', 'expectedShipmentAt', 'fulfillmentEvidenceRefs']) {
    assert.equal(Object.hasOwn(item, key), false);
  }
});

test('optional enrichment is accepted without becoming required identity', () => {
  const item = createCommerceItemObservation(minimum({
    inventoryState: 'SOLD',
    description: 'Hand-painted floral plate.',
    condition: 'Visible age wear; no known cracks.',
    dimensions: '10 in diameter',
    maker: 'Maker unknown',
    provenanceNotes: 'Estate collection',
    price: { amountMinor: 12500, currency: 'USD' },
    imageRefs: ['media.plate-001.back', 'media.plate-001.front'],
    listingUrl: 'https://example.com/items/plate-001',
    soldAt: '2026-10-23T04:45:00.000Z',
    expectedShipmentAt: '2026-10-24T18:00:00.000Z',
    fulfillmentEvidenceRefs: ['evidence.plate-001.sale-receipt'],
  }));

  assert.deepEqual(item.price, { amountMinor: 12500, currency: 'USD' });
  assert.deepEqual(item.imageRefs, ['media.plate-001.back', 'media.plate-001.front']);
  assert.deepEqual(item.fulfillmentEvidenceRefs, ['evidence.plate-001.sale-receipt']);
  assert.equal(item.listingUrl, 'https://example.com/items/plate-001');
});

test('reference ordering does not manufacture commerce item identity drift', () => {
  const left = createCommerceItemObservation(minimum({
    sourceRefs: ['source.z', 'source.a'],
    imageRefs: ['media.z', 'media.a'],
  }));
  const right = createCommerceItemObservation(minimum({
    sourceRefs: ['source.a', 'source.z'],
    imageRefs: ['media.a', 'media.z'],
  }));
  assert.equal(left.semanticFingerprint, right.semanticFingerprint);
  assert.deepEqual(left, right);
});

test('unknown, authority-shaped, and private-data-shaped fields fail closed', () => {
  assert.throws(
    () => createCommerceItemObservation({ ...minimum(), workState: 'READY' }),
    /unexpected field workState/,
  );
  assert.throws(
    () => createCommerceItemObservation({ ...minimum(), executionAuthority: 'WRITE_PROVIDER' }),
    /source input cannot declare executionAuthority/,
  );
  assert.throws(
    () => createCommerceItemObservation({ ...minimum(), shippingAddress: 'private customer address' }),
    /unexpected field shippingAddress/,
  );
});

test('sold-only enrichment cannot contradict current inventory state', () => {
  assert.throws(
    () => createCommerceItemObservation(minimum({ soldAt: '2026-10-23T04:45:00.000Z' })),
    /require inventoryState SOLD/,
  );
  assert.throws(
    () => createCommerceItemObservation(minimum({ expectedShipmentAt: '2026-10-24T18:00:00.000Z' })),
    /require inventoryState SOLD/,
  );
  assert.throws(
    () => createCommerceItemObservation(minimum({ fulfillmentEvidenceRefs: ['evidence.shipment'] })),
    /require inventoryState SOLD/,
  );

  assert.throws(
    () => createCommerceItemObservation(minimum({
      inventoryState: 'SOLD',
      soldAt: '2026-10-23T05:01:00.000Z',
    })),
    /soldAt cannot be after observedAt/,
  );

  const soldWithoutDetails = createCommerceItemObservation(minimum({ inventoryState: 'SOLD' }));
  assert.equal(soldWithoutDetails.inventoryState, 'SOLD');
  assert.equal(Object.hasOwn(soldWithoutDetails, 'soldAt'), false);
});

test('stored semantic identity must already be canonical and read-only', () => {
  const accepted = createCommerceItemObservation(minimum({ sourceRefs: ['source.a', 'source.z'] }));
  const tampered = { ...accepted, label: 'Tampered' };
  assert.throws(() => createCommerceItemObservation(tampered), /semanticFingerprint mismatch/);

  const noncanonicalCore = minimum({ sourceRefs: ['source.z', 'source.a'] });
  const noncanonicalStored = withSemanticFingerprint({ ...noncanonicalCore, effects: false, executionAuthority: 'NONE' });
  assert.throws(() => createCommerceItemObservation(noncanonicalStored), /semanticFingerprint is not canonical/);
});

test('commerce items project into the existing provider-owned Population Snapshot contract', () => {
  const population = createCommerceItemPopulation({
    populationRef: 'population.commerce.example.items',
    snapshotRef: 'snapshot.commerce.example.items.001',
    providerRef: 'provider.commerce.example',
    label: 'Example sellable items',
    observedAt: '2026-10-23T05:01:00.000Z',
    sourceRefs: ['provider.commerce.example:catalog-snapshot/001'],
    items: [
      minimum(),
      minimum({
        itemRef: 'item.commerce.example.plate-002',
        label: 'Gold rim plate',
        sourceRefs: ['provider.commerce.example:item/plate-002'],
      }),
    ],
  });

  assert.equal(population.providerRef, 'provider.commerce.example');
  assert.equal(population.entityKind, COMMERCE_ITEM_ENTITY_KIND);
  assert.deepEqual(population.scopes, []);
  assert.deepEqual(population.entities.map((entity) => entity.entityRef), [
    'item.commerce.example.plate-001',
    'item.commerce.example.plate-002',
  ]);
  assert.deepEqual(population.entities[0].scopeRefs, []);
});

test('commerce population rejects mixed providers, duplicate identity, and future item observations', () => {
  const args = {
    populationRef: 'population.commerce.example.items',
    snapshotRef: 'snapshot.commerce.example.items.001',
    providerRef: 'provider.commerce.example',
    label: 'Example sellable items',
    observedAt: '2026-10-23T05:01:00.000Z',
    sourceRefs: ['provider.commerce.example:catalog-snapshot/001'],
  };

  assert.throws(
    () => createCommerceItemPopulation({
      ...args,
      items: [minimum(), minimum({ itemRef: 'item.commerce.example.plate-002', providerRef: 'provider.other' })],
    }),
    /providerRef must match population providerRef/,
  );

  assert.throws(
    () => createCommerceItemPopulation({ ...args, items: [minimum(), minimum()] }),
    /commerce itemRef must be unique/,
  );

  assert.throws(
    () => createCommerceItemPopulation({
      ...args,
      items: [minimum({ observedAt: '2026-10-23T05:02:00.000Z' })],
    }),
    /observedAt cannot be after population observedAt/,
  );
});

test('price, URL and optional ref fields fail closed on noncanonical input', () => {
  assert.throws(
    () => createCommerceItemObservation(minimum({ price: { amountMinor: 12.5, currency: 'USD' } })),
    /amountMinor/,
  );
  assert.throws(
    () => createCommerceItemObservation(minimum({ price: { amountMinor: 1250, currency: 'usd' } })),
    /currency/,
  );
  assert.throws(
    () => createCommerceItemObservation(minimum({ listingUrl: 'http://example.com/item' })),
    /must use https/,
  );
  assert.throws(
    () => createCommerceItemObservation(minimum({ imageRefs: [] })),
    /must not be empty/,
  );
});

// [VXG RealForever][VEXWORK][OPERATIONAL-CONSOLE][COMMERCE-ITEM-MODEL]
