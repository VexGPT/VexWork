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

test('Android Widget Foundation keeps reusable substrate ahead of VexStream patient zero', () => {
  assert.deepEqual(projectWorkRefs(project, graph), [
    'work.android-widget-foundation.outcome',
    'work.android-widget-foundation.semantic-widget-surface',
    'work.android-widget-foundation.vexstream-playback-widget',
  ]);
  assert.deepEqual(childRefs(graph, 'work.android-widget-foundation.outcome'), [
    'work.android-widget-foundation.semantic-widget-surface',
    'work.android-widget-foundation.vexstream-playback-widget',
  ]);

  const foundation = graph.items.find((item) => item.workRef === 'work.android-widget-foundation.semantic-widget-surface');
  const patientZero = graph.items.find((item) => item.workRef === 'work.android-widget-foundation.vexstream-playback-widget');
  assert.equal(foundation.state, 'READY');
  assert.deepEqual(patientZero.dependencyRefs, [
    foundation.workRef,
    'work.vexstream.mobile-library.full-player',
  ]);
});

test('Android Widget Foundation board shows the reusable substrate as immediate edge', () => {
  const board = projectWorkBoard({ project, graph, view, registry });
  const ready = board.lanes.find((lane) => lane.laneRef === 'lane.work.ready');
  const planned = board.lanes.find((lane) => lane.laneRef === 'lane.work.planned');
  assert.equal(ready.cards.some((card) => card.workRef === 'work.android-widget-foundation.semantic-widget-surface'), true);
  assert.equal(planned.cards.some((card) => card.workRef === 'work.android-widget-foundation.vexstream-playback-widget'), true);
});
