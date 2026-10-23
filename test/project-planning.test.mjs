import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  applyProjectPlanningTransaction,
  createProjectPlanningTransaction,
  projectPlanningContextFingerprint,
  validateProjectPlanningRegistry,
} from '../src/core/project-planning.mjs';
import { createProject, createWorkgraph } from '../src/core/workgraph.mjs';

const workRegistry = JSON.parse(fs.readFileSync(new URL('../blueprint/work-registry.json', import.meta.url), 'utf8'));
const planningRegistry = JSON.parse(fs.readFileSync(new URL('../blueprint/project-planning-registry.json', import.meta.url), 'utf8'));

const project = createProject({
  schemaVersion: 'vexwork.project-definition/v1',
  projectRef: 'project.test.planning',
  label: 'Planning fixture',
  purpose: 'Exercise portable VexWork planning semantics.',
  rootWorkRefs: ['work.test.outcome'],
  repositoryRefs: ['repo.vexwork'],
  sourceRefs: ['test.project-planning'],
  formedAt: '2026-10-23T01:30:00.000Z',
});

const graph = createWorkgraph({
  schemaVersion: 'vexwork.workgraph/v1',
  graphRef: 'workgraph.test.planning',
  rootWorkRefs: ['work.test.outcome', 'work.unprojected'],
  items: [
    {
      schemaVersion: 'vexwork.work-item/v1', workRef: 'work.test.outcome', parentWorkRefOrNull: null,
      label: 'Outcome', purpose: 'Fixture outcome.', workClass: 'OUTCOME', state: 'RUNNING', workDisposition: 'ACTIVE', priorityClass: 'HIGH',
      dependencyRefs: [], repositoryRefs: ['repo.vexwork'], sourceRefs: ['test.project-planning'], formationProcessRefOrNull: null, nextProcessRefs: [],
      authorityDisposition: 'AUTHORIZED_BOUNDED', effectDisposition: 'EFFECTS_BOUND', createdAt: '2026-10-23T01:30:00.000Z', updatedAt: '2026-10-23T01:30:00.000Z',
    },
    {
      schemaVersion: 'vexwork.work-item/v1', workRef: 'work.test.task', parentWorkRefOrNull: 'work.test.outcome',
      label: 'Task', purpose: 'Fixture task.', workClass: 'TASK', state: 'READY', workDisposition: 'ACTIVE', priorityClass: 'NORMAL',
      dependencyRefs: [], repositoryRefs: ['repo.vexwork'], sourceRefs: ['test.project-planning'], formationProcessRefOrNull: null, nextProcessRefs: [],
      authorityDisposition: 'AUTHORIZED_BOUNDED', effectDisposition: 'EFFECTS_BOUND', createdAt: '2026-10-23T01:30:00.000Z', updatedAt: '2026-10-23T01:30:00.000Z',
    },
    {
      schemaVersion: 'vexwork.work-item/v1', workRef: 'work.unprojected', parentWorkRefOrNull: null,
      label: 'Unprojected', purpose: 'Must stay outside Project planning.', workClass: 'TASK', state: 'READY', workDisposition: 'ACTIVE', priorityClass: 'LOW',
      dependencyRefs: [], repositoryRefs: ['repo.vexwork'], sourceRefs: ['test.project-planning'], formationProcessRefOrNull: null, nextProcessRefs: [],
      authorityDisposition: 'AUTHORIZED_BOUNDED', effectDisposition: 'EFFECTS_BOUND', createdAt: '2026-10-23T01:30:00.000Z', updatedAt: '2026-10-23T01:30:00.000Z',
    },
  ],
  transitions: [],
  sourceRefs: ['test.project-planning'],
  formedAt: '2026-10-23T01:30:00.000Z',
}, workRegistry);

const viewRefs = ['view.test.board', 'view.test.graph'];
const contextFingerprint = projectPlanningContextFingerprint({ project, graph, viewRefs, workRegistry });

function tx({ eventClass, payload, current = null, n = 1, context = contextFingerprint }) {
  return {
    schemaVersion: 'vexwork.project-planning-transaction/v1',
    transactionRef: `transaction.test.planning.${n}`,
    eventRef: `event.test.planning.${n}`,
    projectRef: project.projectRef,
    eventClass,
    payload,
    expectedContextFingerprint: context,
    expectedPlanningSnapshotFingerprintOrNull: current?.semanticFingerprint ?? null,
    actorRef: 'actor.test',
    sourceRefs: ['test.project-planning'],
    formedAt: `2026-10-23T01:30:${String(n).padStart(2, '0')}.000Z`,
  };
}

function apply(transaction, current = null) {
  return applyProjectPlanningTransaction({
    project, graph, viewRefs, currentSnapshotOrNull: current, transaction,
    planningRegistry, workRegistry,
  });
}

test('planning registry preserves six planning-only event classes', () => {
  const result = validateProjectPlanningRegistry(planningRegistry);
  assert.equal(result.ok, true, result.errors.join('\n'));
  assert.deepEqual(planningRegistry.planningEventClasses.map((item) => item.eventClass), [
    'ITERATION_DEFINED', 'ITERATION_CLOSED', 'ITERATION_MEMBERSHIP_SET', 'SHARED_ORDER_SET', 'WIP_POLICY_SET', 'VIEW_SELECTED',
  ]);
});

test('iteration definition, membership, and explicit closure freeze final membership without changing Workgraph state', () => {
  const defined = apply(tx({
    eventClass: 'ITERATION_DEFINED', n: 1,
    payload: { iterationRef: 'iteration.test.1', label: 'Iteration 1', startsAt: '2026-10-23T00:00:00.000Z', endsAt: '2026-10-30T00:00:00.000Z' },
  }));
  const membership = apply(tx({
    eventClass: 'ITERATION_MEMBERSHIP_SET', n: 2, current: defined.snapshot,
    payload: { iterationRef: 'iteration.test.1', workRefs: ['work.test.task'] },
  }), defined.snapshot);
  const closed = apply(tx({
    eventClass: 'ITERATION_CLOSED', n: 3, current: membership.snapshot,
    payload: { iterationRef: 'iteration.test.1', closedAt: '2026-10-29T12:00:00.000Z' },
  }), membership.snapshot);

  assert.deepEqual(closed.snapshot.iterations[0].finalWorkRefs, ['work.test.task']);
  assert.equal(closed.graph.semanticFingerprint, graph.semanticFingerprint);
  assert.equal(closed.effects.workgraphMutationRepresented, false);
  assert.throws(() => apply(tx({
    eventClass: 'ITERATION_MEMBERSHIP_SET', n: 4, current: closed.snapshot,
    payload: { iterationRef: 'iteration.test.1', workRefs: [] },
  }), closed.snapshot), /closed iteration membership cannot change/);
});

test('shared order, WIP policy, and selected view remain planning truth only', () => {
  const order = apply(tx({ eventClass: 'SHARED_ORDER_SET', n: 1, payload: { scopeRef: 'scope.test', workRefs: ['work.test.task', 'work.test.outcome'] } }));
  const wip = apply(tx({ eventClass: 'WIP_POLICY_SET', n: 2, current: order.snapshot, payload: { laneRef: 'lane.work.active', limit: 3 } }), order.snapshot);
  const view = apply(tx({ eventClass: 'VIEW_SELECTED', n: 3, current: wip.snapshot, payload: { viewRef: 'view.test.graph' } }), wip.snapshot);
  assert.deepEqual(view.snapshot.sharedOrders, [{ scopeRef: 'scope.test', workRefs: ['work.test.task', 'work.test.outcome'] }]);
  assert.deepEqual(view.snapshot.wipPolicies, [{ laneRef: 'lane.work.active', limit: 3 }]);
  assert.equal(view.snapshot.selectedViewRefOrNull, 'view.test.graph');
  assert.equal(view.executionAuthority, 'NONE');
});

test('planning fails closed for stale context, stale snapshots, unknown lanes/views, and foreign work', () => {
  const accepted = apply(tx({ eventClass: 'WIP_POLICY_SET', n: 1, payload: { laneRef: 'lane.work.active', limit: 2 } }));
  assert.throws(() => createProjectPlanningTransaction(tx({ eventClass: 'WIP_POLICY_SET', n: 2, payload: { laneRef: 'lane.work.active', limit: 2 }, context: 'not-a-sha' }), planningRegistry), /expectedContextFingerprint/);
  assert.throws(() => apply({ ...tx({ eventClass: 'WIP_POLICY_SET', n: 2, current: accepted.snapshot, payload: { laneRef: 'lane.work.active', limit: 2 } }), expectedContextFingerprint: '0'.repeat(64) }, accepted.snapshot), /context is stale/);
  assert.throws(() => apply({ ...tx({ eventClass: 'WIP_POLICY_SET', n: 2, current: accepted.snapshot, payload: { laneRef: 'lane.work.active', limit: 2 } }), expectedPlanningSnapshotFingerprintOrNull: null }, accepted.snapshot), /snapshot is stale/);
  assert.throws(() => apply(tx({ eventClass: 'WIP_POLICY_SET', n: 2, current: accepted.snapshot, payload: { laneRef: 'lane.nope', limit: 2 } }), accepted.snapshot), /unknown Board lane/);
  assert.throws(() => apply(tx({ eventClass: 'VIEW_SELECTED', n: 2, current: accepted.snapshot, payload: { viewRef: 'view.nope' } }), accepted.snapshot), /unknown Project view/);

  const defined = apply(tx({ eventClass: 'ITERATION_DEFINED', n: 2, current: accepted.snapshot, payload: { iterationRef: 'iteration.test.2', label: 'I2', startsAt: '2026-10-23T00:00:00.000Z', endsAt: '2026-10-24T00:00:00.000Z' } }), accepted.snapshot);
  assert.throws(() => apply(tx({ eventClass: 'ITERATION_MEMBERSHIP_SET', n: 3, current: defined.snapshot, payload: { iterationRef: 'iteration.test.2', workRefs: ['work.unprojected'] } }), defined.snapshot), /outside Project/);
});

test('planning events preserve causal sequence and prior-event fingerprint', () => {
  const first = apply(tx({ eventClass: 'SHARED_ORDER_SET', n: 1, payload: { scopeRef: 'scope.test', workRefs: ['work.test.task'] } }));
  const second = apply(tx({ eventClass: 'SHARED_ORDER_SET', n: 2, current: first.snapshot, payload: { scopeRef: 'scope.test', workRefs: ['work.test.outcome', 'work.test.task'] } }), first.snapshot);
  assert.equal(first.event.sequence, 1);
  assert.equal(second.event.sequence, 2);
  assert.equal(second.event.priorEventRefOrNull, first.event.eventRef);
  assert.equal(second.event.priorEventFingerprintOrNull, first.event.semanticFingerprint);
});

// [VXG RealForever][VEXWORK][PROJECT-PLANNING]
