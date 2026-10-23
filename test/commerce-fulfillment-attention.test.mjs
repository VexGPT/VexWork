import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  createCommerceFulfillmentAttention,
  createCommerceFulfillmentObservation,
  COMMERCE_FULFILLMENT_OBSERVATION_SCHEMA,
} from '../src/adapters/commerce-fulfillment-attention.mjs';
import {
  COMMERCE_ITEM_OBSERVATION_SCHEMA,
  createCommerceItemObservation,
} from '../src/adapters/commerce-item-model.mjs';
import { projectAttentionQueue } from '../src/core/attention-queue.mjs';
import { withSemanticFingerprint } from '../src/core/semantic.mjs';

const read = (relative) => JSON.parse(fs.readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8'));
const repositoryRegistry = read('blueprint/repository-registry.json');
const processRegistry = read('blueprint/process-registry.json');
const context = { repositoryRegistry, processRegistry };

function item(overrides = {}) {
  return {
    schemaVersion: COMMERCE_ITEM_OBSERVATION_SCHEMA,
    itemRef: 'item.commerce.example.plate-001',
    providerRef: 'provider.commerce.example',
    label: 'Blue floral plate',
    inventoryState: 'SOLD',
    observedAt: '2026-10-23T05:00:00.000Z',
    sourceRefs: ['provider.commerce.example:item/plate-001'],
    ...overrides,
  };
}

function fulfillment(overrides = {}) {
  return {
    schemaVersion: COMMERCE_FULFILLMENT_OBSERVATION_SCHEMA,
    fulfillmentRef: 'attention.commerce.example.plate-001.fulfillment',
    itemRef: 'item.commerce.example.plate-001',
    providerRef: 'provider.commerce.example',
    fulfillmentState: 'ACTION_REQUIRED',
    observedAt: '2026-10-23T05:05:00.000Z',
    sourceRefs: ['provider.commerce.example:fulfillment/plate-001'],
    evidenceRefs: ['evidence.commerce.example.plate-001.sold'],
    ...overrides,
  };
}

function attention(overrides = {}) {
  return createCommerceFulfillmentAttention({
    queueRef: 'queue.commerce.example.fulfillment',
    snapshotRef: 'snapshot.commerce.example.fulfillment.001',
    ownerRepositoryRef: 'repo.vexwork',
    label: 'Example fulfillment',
    purpose: 'Show current physical fulfillment attention without creating Work or copying customer data.',
    sourceRefs: ['source.commerce.example.fulfillment-adapter'],
    item: item(),
    fulfillment: fulfillment(),
    existingWorkRefs: [],
    processRefOrNull: null,
    ...overrides,
  }, context);
}

test('ACTION_REQUIRED maps a sold item into active fulfillment ATTENTION', () => {
  const snapshot = attention();
  assert.equal(snapshot.effects, false);
  assert.equal(snapshot.executionAuthority, 'NONE');
  assert.equal(snapshot.entries.length, 1);
  assert.equal(snapshot.entries[0].attentionState, 'ATTENTION');
  assert.equal(snapshot.entries[0].subjectRef, 'item.commerce.example.plate-001');

  const projection = projectAttentionQueue(snapshot, context);
  assert.equal(projection.summary.queuedCount, 1);
  assert.deepEqual(projection.queuedEntries.map((entry) => entry.attentionRef), [
    'attention.commerce.example.plate-001.fulfillment',
  ]);
});

test('explicit ACKNOWLEDGED evidence maps to CLEAR without claiming completed Work', () => {
  const snapshot = attention({
    fulfillment: fulfillment({
      fulfillmentState: 'ACKNOWLEDGED',
      evidenceRefs: ['evidence.commerce.example.plate-001.shipment-receipt'],
    }),
  });
  assert.equal(snapshot.entries[0].attentionState, 'CLEAR');
  const projection = projectAttentionQueue(snapshot, context);
  assert.equal(projection.summary.queuedCount, 0);
  assert.deepEqual(projection.clearEntryRefs, ['attention.commerce.example.plate-001.fulfillment']);
  assert.deepEqual(projection.summary.existingWorkRefs, []);
});

test('truthful UNKNOWN remains queued without manufactured evidence', () => {
  const snapshot = attention({
    fulfillment: fulfillment({
      fulfillmentState: 'UNKNOWN',
      evidenceRefs: [],
    }),
  });
  assert.equal(snapshot.entries[0].attentionState, 'UNKNOWN');
  assert.deepEqual(snapshot.entries[0].evidenceRefs, []);
  assert.equal(projectAttentionQueue(snapshot, context).summary.queuedCount, 1);
});

test('only a current SOLD item can enter fulfillment attention', () => {
  for (const inventoryState of ['AVAILABLE', 'WITHDRAWN', 'UNKNOWN']) {
    assert.throws(
      () => attention({ item: item({ inventoryState }) }),
      /requires item inventoryState SOLD/,
    );
  }
});

test('item and fulfillment identity, provider, and observation order must agree', () => {
  assert.throws(
    () => attention({ fulfillment: fulfillment({ itemRef: 'item.commerce.example.other' }) }),
    /itemRef must match Commerce item/,
  );
  assert.throws(
    () => attention({ fulfillment: fulfillment({ providerRef: 'provider.other' }) }),
    /providerRef must match Commerce item/,
  );
  assert.throws(
    () => attention({
      fulfillment: fulfillment({ observedAt: '2026-10-23T04:59:59.000Z' }),
    }),
    /cannot precede Commerce item observation/,
  );
});

test('non-UNKNOWN fulfillment states require explicit evidence', () => {
  assert.throws(
    () => createCommerceFulfillmentObservation(fulfillment({ evidenceRefs: [] })),
    /ACTION_REQUIRED requires evidenceRefs/,
  );
  assert.throws(
    () => createCommerceFulfillmentObservation(fulfillment({
      fulfillmentState: 'ACKNOWLEDGED',
      evidenceRefs: [],
    })),
    /ACKNOWLEDGED requires evidenceRefs/,
  );
  assert.throws(
    () => createCommerceFulfillmentObservation(fulfillment({ fulfillmentState: 'NOT_SHIPPED' })),
    /unsupported fulfillmentState/,
  );
});

test('fulfillment observation rejects hidden authority and private-data fields', () => {
  assert.throws(
    () => createCommerceFulfillmentObservation({ ...fulfillment(), executionAuthority: 'WRITE_PROVIDER' }),
    /unexpected or missing fields/,
  );
  assert.throws(
    () => createCommerceFulfillmentObservation({ ...fulfillment(), shippingAddress: 'private address' }),
    /unexpected or missing fields/,
  );
  assert.throws(
    () => createCommerceFulfillmentObservation({ ...fulfillment(), customerName: 'private customer' }),
    /unexpected or missing fields/,
  );
});

test('stored fulfillment identity must already be canonical and read-only', () => {
  const accepted = createCommerceFulfillmentObservation(fulfillment({
    sourceRefs: ['source.a', 'source.z'],
    evidenceRefs: ['evidence.a', 'evidence.z'],
  }));
  assert.throws(
    () => createCommerceFulfillmentObservation({ ...accepted, fulfillmentState: 'ACKNOWLEDGED' }),
    /semanticFingerprint mismatch/,
  );

  const noncanonical = withSemanticFingerprint({
    ...fulfillment({
      sourceRefs: ['source.z', 'source.a'],
      evidenceRefs: ['evidence.z', 'evidence.a'],
    }),
    effects: false,
    executionAuthority: 'NONE',
  });
  assert.throws(
    () => createCommerceFulfillmentObservation(noncanonical),
    /semanticFingerprint is not canonical/,
  );
});

test('shared item and fulfillment provenance is de-duplicated rather than treated as contradiction', () => {
  const shared = 'provider.commerce.example:shared/plate-001';
  const snapshot = attention({
    sourceRefs: [shared],
    item: item({ sourceRefs: [shared] }),
    fulfillment: fulfillment({ sourceRefs: [shared] }),
  });
  assert.deepEqual(snapshot.sourceRefs, [shared]);
  assert.deepEqual(snapshot.entries[0].sourceRefs, [shared]);
});

test('queue repository ownership and optional process routing stay in existing contracts', () => {
  assert.throws(
    () => attention({ ownerRepositoryRef: 'repo.not-registered' }),
    /unknown repositoryRef/,
  );
  assert.throws(
    () => attention({ processRefOrNull: 'process.not-registered' }),
    /unknown processRef/,
  );

  const routed = attention({
    existingWorkRefs: ['work.example.fulfillment-followup'],
    processRefOrNull: 'process.vexwork.promote-derived-concern',
  });
  const projection = projectAttentionQueue(routed, context);
  assert.deepEqual(projection.summary.existingWorkRefs, ['work.example.fulfillment-followup']);
  assert.equal(projection.summary.processRoutedCount, 1);
});

test('expected shipment date and item evidence do not silently close or prioritize the queue', () => {
  const soldItem = createCommerceItemObservation(item({
    expectedShipmentAt: '2026-10-24T18:00:00.000Z',
    fulfillmentEvidenceRefs: ['evidence.commerce.example.plate-001.photo'],
  }));
  const snapshot = attention({
    item: soldItem,
    fulfillment: fulfillment({
      fulfillmentState: 'ACTION_REQUIRED',
      evidenceRefs: ['evidence.commerce.example.plate-001.sold'],
    }),
  });
  const entry = snapshot.entries[0];
  assert.equal(entry.attentionState, 'ATTENTION');
  assert.equal(Object.hasOwn(entry, 'expectedShipmentAt'), false);
  assert.equal(Object.hasOwn(entry, 'priority'), false);
  assert.deepEqual(entry.evidenceRefs, ['evidence.commerce.example.plate-001.sold']);
});

test('attention input rejects hidden queue authority or customer fields', () => {
  assert.throws(
    () => createCommerceFulfillmentAttention({
      queueRef: 'queue.commerce.example.fulfillment',
      snapshotRef: 'snapshot.commerce.example.fulfillment.001',
      ownerRepositoryRef: 'repo.vexwork',
      label: 'Example fulfillment',
      purpose: 'Test.',
      sourceRefs: ['source.test'],
      item: item(),
      fulfillment: fulfillment(),
      mutationAuthority: 'WRITE_PROVIDER',
    }, context),
    /unexpected field mutationAuthority/,
  );
});

// [VXG RealForever][VEXWORK][OPERATIONAL-CONSOLE][P4][COMMERCE-FULFILLMENT-ATTENTION]
