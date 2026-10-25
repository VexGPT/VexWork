import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { createProject, createWorkgraph, childRefs, projectWorkRefs } from '../src/core/workgraph.mjs';
import { createBoardView, projectWorkBoard } from '../src/core/work-board.mjs';

const read = (relative) => JSON.parse(fs.readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8'));
const registry = read('blueprint/work-registry.json');
const graph = createWorkgraph(read('workgraphs/public.json'), registry);
const project = createProject(read('projects/android-widget-foundation/project.json'));
const view = createBoardView(read('projects/android-widget-foundation/board.view.json'), registry);

test('Android Widget Foundation keeps reusable substrate separate from patient-zero lived defects', () => {
  assert.deepEqual(projectWorkRefs(project, graph), [
    'work.android-widget-foundation.outcome',
    'work.android-widget-foundation.semantic-widget-surface',
    'work.android-widget-foundation.vexstream-playback-widget',
    'work.android-widget-foundation.vexstream-playback-widget.layout-usability',
    'work.android-widget-foundation.vexstream-playback-widget.state-refresh',
  ]);
  assert.deepEqual(childRefs(graph, 'work.android-widget-foundation.outcome'), [
    'work.android-widget-foundation.semantic-widget-surface',
    'work.android-widget-foundation.vexstream-playback-widget',
  ]);
  assert.deepEqual(childRefs(graph, 'work.android-widget-foundation.vexstream-playback-widget'), [
    'work.android-widget-foundation.vexstream-playback-widget.layout-usability',
    'work.android-widget-foundation.vexstream-playback-widget.state-refresh',
  ]);

  const foundation = graph.items.find((item) => item.workRef === 'work.android-widget-foundation.semantic-widget-surface');
  const patientZero = graph.items.find((item) => item.workRef === 'work.android-widget-foundation.vexstream-playback-widget');
  const convergence = graph.items.find((item) => item.workRef === 'work.android-widget-foundation.vexstream-playback-widget.state-refresh');
  const layout = graph.items.find((item) => item.workRef === 'work.android-widget-foundation.vexstream-playback-widget.layout-usability');

  assert.equal(foundation.state, 'COMPLETED');
  assert.equal(patientZero.state, 'RUNNING');
  assert.deepEqual(patientZero.dependencyRefs, [foundation.workRef]);
  assert.equal(convergence.label, 'VexStream widget currentness convergence');
  assert.equal(convergence.state, 'FAILED_RECOVERABLE');
  assert.equal(layout.state, 'VERIFYING');
});

test('Android Widget Foundation board exposes currentness failure without reopening accepted substrate', () => {
  const board = projectWorkBoard({ project, graph, view, registry });
  const active = board.lanes.find((lane) => lane.laneRef === 'lane.work.active');
  const verify = board.lanes.find((lane) => lane.laneRef === 'lane.work.verify');
  const attention = board.lanes.find((lane) => lane.laneRef === 'lane.work.attention');
  const done = board.lanes.find((lane) => lane.laneRef === 'lane.work.done');

  assert.equal(done.cards.some((card) => card.workRef === 'work.android-widget-foundation.semantic-widget-surface'), true);
  assert.equal(active.cards.some((card) => card.workRef === 'work.android-widget-foundation.vexstream-playback-widget'), true);
  assert.equal(attention.cards.some((card) => card.workRef === 'work.android-widget-foundation.vexstream-playback-widget.state-refresh'), true);
  assert.equal(verify.cards.some((card) => card.workRef === 'work.android-widget-foundation.vexstream-playback-widget.layout-usability'), true);
});
