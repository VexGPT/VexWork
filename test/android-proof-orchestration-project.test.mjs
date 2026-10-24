import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { createProject, createWorkgraph, projectWorkRefs } from '../src/core/workgraph.mjs';
import { createBoardView, projectWorkBoard } from '../src/core/work-board.mjs';

const read = (relative) => JSON.parse(fs.readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8'));
const registry = read('blueprint/work-registry.json');
const graph = createWorkgraph(read('workgraphs/public.json'), registry);
const project = createProject(read('projects/android-proof-orchestration/project.json'));
const view = createBoardView(read('projects/android-proof-orchestration/board.view.json'), registry);

test('Android Proof Orchestration keeps the reusable API runner ahead of broader lease coordination', () => {
  const refs = projectWorkRefs(project, graph);
  assert.deepEqual(refs, [
    'work.android-proof-orchestration.api-target-runner',
    'work.android-proof-orchestration.device-lease-queue',
    'work.android-proof-orchestration.outcome',
    'work.android-proof-orchestration.vexrelay-integration',
  ]);

  const runner = graph.items.find((item) => item.workRef === 'work.android-proof-orchestration.api-target-runner');
  const relay = graph.items.find((item) => item.workRef === 'work.android-proof-orchestration.vexrelay-integration');
  const lease = graph.items.find((item) => item.workRef === 'work.android-proof-orchestration.device-lease-queue');
  assert.equal(runner.state, 'READY');
  assert.equal(runner.priorityClass, 'HIGH');
  assert.deepEqual(runner.dependencyRefs, []);
  assert.deepEqual(relay.dependencyRefs, [runner.workRef]);
  assert.deepEqual(lease.dependencyRefs, [runner.workRef]);
  assert.equal(lease.priorityClass, 'NORMAL');
});

test('Android Proof Orchestration board exposes runner as the immediate ready edge', () => {
  const board = projectWorkBoard({ project, graph, view, registry });
  const ready = board.lanes.find((lane) => lane.laneRef === 'lane.work.ready');
  const planned = board.lanes.find((lane) => lane.laneRef === 'lane.work.planned');
  assert.deepEqual(ready.cards.map((card) => card.workRef), [
    'work.android-proof-orchestration.api-target-runner',
  ]);
  assert.equal(planned.cards.some((card) => card.workRef === 'work.android-proof-orchestration.vexrelay-integration'), true);
  assert.equal(planned.cards.some((card) => card.workRef === 'work.android-proof-orchestration.device-lease-queue'), true);
});

test('VexStream durable device storage is terminal and no longer depends on the reusable API target runner', () => {
  const storage = graph.items.find((item) => item.workRef === 'work.vexstream.mobile-library.device-storage');
  assert.equal(storage.state, 'COMPLETED');
  assert.deepEqual(storage.dependencyRefs, []);
  assert.equal(storage.authorityDisposition, 'AUTHORIZED_BOUNDED');
  assert.equal(storage.effectDisposition, 'EFFECTS_BOUND');
});
