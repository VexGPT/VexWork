import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { withSemanticFingerprint } from '../src/core/semantic.mjs';
import {
  ATTENTION_QUEUE_PROJECTION_SCHEMA,
  createAttentionQueueSnapshot,
  projectAttentionQueue,
} from '../src/core/attention-queue.mjs';

const read = (relative) => JSON.parse(fs.readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8'));
const repositoryRegistry = read('blueprint/repository-registry.json');
const processRegistry = read('blueprint/process-registry.json');

function source() {
  return {
    schemaVersion: 'vexwork.attention-queue-snapshot/v1',
    queueRef: 'queue.vexwork.operational-console.example-fulfillment',
    snapshotRef: 'snapshot.vexwork.operational-console.example-fulfillment.001',
    ownerRepositoryRef: 'repo.vexwork',
    label: 'Example fulfillment attention',
    purpose: 'Prove current event/exception-shaped attention without creating WorkState or execution authority.',
    observedAt: '2026-10-23T04:30:00.000Z',
    sourceRefs: ['source.fixture.example-fulfillment', 'source.fixture.queue-contract'],
    entries: [
      {
        attentionRef: 'attention.example.order-42.fulfillment',
        subjectRef: 'order.example.42',
        subjectKind: 'commerce.order',
        label: 'Ship order 42',
        attentionState: 'ATTENTION',
        observedAt: '2026-10-23T04:28:00.000Z',
        reasonRefs: ['reason.fulfillment.shipment-required', 'reason.fulfillment.physical-action'],
        evidenceRefs: ['evidence.order-42.sold'],
        sourceRefs: ['provider.example.order-42'],
        existingWorkRefs: [],
        processRefOrNull: null,
      },
      {
        attentionRef: 'attention.example.order-43.fulfillment',
        subjectRef: 'order.example.43',
        subjectKind: 'commerce.order',
        label: 'Resolve shipment status for order 43',
        attentionState: 'UNKNOWN',
        observedAt: '2026-10-23T04:27:00.000Z',
        reasonRefs: ['reason.fulfillment.shipment-status-unknown'],
        evidenceRefs: [],
        sourceRefs: ['provider.example.order-43'],
        existingWorkRefs: ['work.example.order-43-followup'],
        processRefOrNull: 'process.vexwork.promote-derived-concern',
      },
      {
        attentionRef: 'attention.example.order-44.fulfillment',
        subjectRef: 'order.example.44',
        subjectKind: 'commerce.order',
        label: 'Order 44 fulfillment acknowledged',
        attentionState: 'CLEAR',
        observedAt: '2026-10-23T04:26:00.000Z',
        reasonRefs: ['reason.fulfillment.shipment-acknowledged'],
        evidenceRefs: ['evidence.order-44.shipment-receipt'],
        sourceRefs: ['provider.example.order-44'],
        existingWorkRefs: [],
        processRefOrNull: null,
      },
    ],
  };
}

function create(value = source()) {
  return createAttentionQueueSnapshot(value, { repositoryRegistry, processRegistry });
}

test('current attention queue projects ATTENTION and UNKNOWN without turning CLEAR into queued work', () => {
  const snapshot = create();
  const projection = projectAttentionQueue(snapshot, { repositoryRegistry, processRegistry });

  assert.equal(snapshot.effects, false);
  assert.equal(snapshot.executionAuthority, 'NONE');
  assert.equal(projection.schemaVersion, ATTENTION_QUEUE_PROJECTION_SCHEMA);
  assert.equal(projection.effects, false);
  assert.equal(projection.executionAuthority, 'NONE');
  assert.deepEqual(projection.summary.stateCounts, { CLEAR: 1, ATTENTION: 1, UNKNOWN: 1 });
  assert.equal(projection.summary.entryCount, 3);
  assert.equal(projection.summary.queuedCount, 2);
  assert.equal(projection.summary.processRoutedCount, 1);
  assert.deepEqual(projection.summary.existingWorkRefs, ['work.example.order-43-followup']);
  assert.deepEqual(projection.queuedEntries.map((entry) => entry.attentionRef), [
    'attention.example.order-42.fulfillment',
    'attention.example.order-43.fulfillment',
  ]);
  assert.deepEqual(projection.clearEntryRefs, ['attention.example.order-44.fulfillment']);
});

test('semantic fingerprint is stable across entry and reference ordering differences', () => {
  const left = create();
  const reordered = source();
  reordered.entries.reverse();
  reordered.entries[0].reasonRefs.reverse();
  reordered.sourceRefs.reverse();
  const right = create(reordered);

  assert.equal(left.semanticFingerprint, right.semanticFingerprint);
  assert.deepEqual(left, right);
});

test('queue owner must be a known repository', () => {
  const value = source();
  value.ownerRepositoryRef = 'repo.not-registered';
  assert.throws(() => create(value), /unknown repositoryRef repo\.not-registered/);
});

test('routed entries must reference a known Process Map process', () => {
  const value = source();
  value.entries[0].processRefOrNull = 'process.not-registered';
  assert.throws(() => create(value), /unknown processRef process\.not-registered/);
});

test('ATTENTION and CLEAR require evidence while UNKNOWN may remain evidence-empty', () => {
  const attention = source();
  attention.entries[0].evidenceRefs = [];
  assert.throws(() => create(attention), /ATTENTION requires evidenceRefs/);

  const clear = source();
  clear.entries[2].evidenceRefs = [];
  assert.throws(() => create(clear), /CLEAR requires evidenceRefs/);

  const unknown = source();
  unknown.entries[1].evidenceRefs = [];
  assert.equal(create(unknown).entries.find((entry) => entry.attentionState === 'UNKNOWN').evidenceRefs.length, 0);
});

test('duplicate attention identities fail closed', () => {
  const value = source();
  value.entries.push(structuredClone(value.entries[0]));
  assert.throws(() => create(value), /attentionRef must be unique/);
});

test('entry observations cannot be newer than their queue snapshot', () => {
  const value = source();
  value.entries[0].observedAt = '2026-10-23T04:31:00.000Z';
  assert.throws(() => create(value), /observedAt cannot be after queue snapshot observedAt/);
});

test('hidden authority fields are rejected at queue and entry boundaries', () => {
  const root = source();
  root.mutationAuthority = 'WRITE_SOURCE';
  assert.throws(() => create(root), /attention queue snapshot has unexpected fields/);

  const entry = source();
  entry.entries[0].executionAuthority = 'WRITE_SOURCE';
  assert.throws(() => create(entry), /entries\[0\] has unexpected fields/);
});

test('stored semantic identity must already be canonical and read-only', () => {
  const current = create();
  const reorderedCore = structuredClone(source());
  reorderedCore.entries.reverse();
  reorderedCore.sourceRefs.reverse();
  reorderedCore.entries[2].reasonRefs.reverse();
  const noncanonicalStored = withSemanticFingerprint({ ...reorderedCore, effects: false, executionAuthority: 'NONE' });
  assert.throws(() => create(noncanonicalStored), /semanticFingerprint is not canonical/);

  const tampered = structuredClone(current);
  tampered.label = 'Tampered queue';
  assert.throws(() => create(tampered), /semanticFingerprint mismatch/);
});

// [VXG RealForever][VEXWORK][ATTENTION-QUEUE]
