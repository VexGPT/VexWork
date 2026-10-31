import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { createProject, createWorkgraph, projectWorkRefs } from '../src/core/workgraph.mjs';
import { createBoardView, projectWorkBoard } from '../src/core/work-board.mjs';

const read = (relative) => JSON.parse(fs.readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8'));
const registry = read('blueprint/work-registry.json');
const graph = createWorkgraph(read('workgraphs/public.json'), registry);
const project = createProject(read('projects/vexlife-startup-sequence/project.json'));
const view = createBoardView(read('projects/vexlife-startup-sequence/board.view.json'), registry);
const readme = fs.readFileSync(new URL('../projects/vexlife-startup-sequence/README.md', import.meta.url), 'utf8');

test('VexLife StartUp Sequence preserves one proven origin and explicit incomplete branch joints', () => {
  const refs = projectWorkRefs(project, graph);
  assert.equal(refs.length, 9);

  const byRef = new Map(graph.items.map((item) => [item.workRef, item]));
  assert.equal(byRef.get('work.vexlife.startup-sequence.outcome')?.state, 'RUNNING');
  assert.equal(byRef.get('work.vexlife.startup-sequence.baseline-origin')?.state, 'COMPLETED');
  assert.equal(byRef.get('work.vexlife.startup-sequence.explainable-progression')?.state, 'READY');
  assert.equal(byRef.get('work.vexlife.startup-sequence.managed-bootstrap-dependencies')?.state, 'READY');
  assert.equal(byRef.get('work.vexlife.startup-sequence.python-compatibility-qualification')?.state, 'READY');
  assert.equal(byRef.get('work.vexlife.startup-sequence.layered-failure-report')?.state, 'READY');
  assert.equal(byRef.get('work.vexlife.startup-sequence.clean-slate-acceptance')?.state, 'WAITING_DEPENDENCIES');

  assert.deepEqual(
    byRef.get('work.vexlife.startup-sequence.clean-slate-acceptance')?.dependencyRefs,
    [
      'work.vexlife.startup-sequence.explainable-progression',
      'work.vexlife.startup-sequence.managed-bootstrap-dependencies',
      'work.vexlife.startup-sequence.layered-failure-report'
    ]
  );

  const board = projectWorkBoard({ project, graph, view, registry });
  assert.equal(board.lanes.find((lane) => lane.laneRef === 'lane.work.active').cards.length, 1);
  assert.equal(board.lanes.find((lane) => lane.laneRef === 'lane.work.ready').cards.length, 4);
  assert.equal(board.lanes.find((lane) => lane.laneRef === 'lane.work.planned').cards.length, 3);
  assert.equal(board.lanes.find((lane) => lane.laneRef === 'lane.work.done').cards.length, 1);
  assert.equal(board.lanes.flatMap((lane) => lane.cards).every((card) => card.effectDisposition === 'NO_EFFECTS'), true);

  assert.match(readme, /BASELINE ORIGIN != IMMORTAL COMMIT/u);
  assert.match(readme, /Python 3\.14\.7/u);
  assert.match(readme, /NEWER = UNVERIFIED_CANDIDATE/u);
  assert.match(readme, /PLAUSIBLE_UNVERIFIED_PROFILE/u);
  assert.match(readme, /Layered support report/u);
});
