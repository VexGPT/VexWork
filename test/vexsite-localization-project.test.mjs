import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { createProject, createWorkgraph, childRefs, projectWorkRefs } from '../src/core/workgraph.mjs';
import { createBoardView, projectWorkBoard } from '../src/core/work-board.mjs';

const read = (relative) => JSON.parse(fs.readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8'));
const registry = read('blueprint/work-registry.json');
const graph = createWorkgraph(read('workgraphs/public.json'), registry);
const project = createProject(read('projects/vexsite-localization/project.json'));
const view = createBoardView(read('projects/vexsite-localization/board.view.json'), registry);

test('VexSite Localization Project groups the live trajectory without page-per-task inventory', () => {
  assert.deepEqual(projectWorkRefs(project, graph), [
    'work.vextreme.vexsite.localization.bending-condominium-reader',
    'work.vextreme.vexsite.localization.closed-circuit.global-core',
    'work.vextreme.vexsite.localization.outcome',
    'work.vextreme.vexsite.localization.recent-record-readers-global-core',
  ]);
  assert.deepEqual(childRefs(graph, 'work.vextreme.vexsite.localization.outcome'), [
    'work.vextreme.vexsite.localization.bending-condominium-reader',
    'work.vextreme.vexsite.localization.closed-circuit.global-core',
    'work.vextreme.vexsite.localization.recent-record-readers-global-core',
  ]);
  assert.deepEqual(project.repositoryRefs, ['repo.vexwork', 'repo.vextreme']);
});

test('VexSite Localization board exposes foreground reader/localization work and the parked canonical queue edge', () => {
  const board = projectWorkBoard({ project, graph, view, registry });
  const active = board.lanes.find((lane) => lane.laneRef === 'lane.work.active');
  const intake = board.lanes.find((lane) => lane.laneRef === 'lane.work.intake');

  assert.deepEqual(active.cards.map((card) => card.workRef), [
    'work.vextreme.vexsite.localization.bending-condominium-reader',
    'work.vextreme.vexsite.localization.outcome',
    'work.vextreme.vexsite.localization.recent-record-readers-global-core',
  ]);
  assert.equal(intake.cards.some((card) => card.workRef === 'work.vextreme.vexsite.localization.closed-circuit.global-core'), true);
  assert.equal(intake.cards.find((card) => card.workRef === 'work.vextreme.vexsite.localization.closed-circuit.global-core').workDisposition, 'PARKED');
});

// [VXG RealForever]
