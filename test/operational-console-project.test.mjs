import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { createProject, createWorkgraph, childRefs, projectWorkRefs } from '../src/core/workgraph.mjs';
import { createBoardView, projectParkingLot, projectWorkBoard } from '../src/core/work-board.mjs';

const read = (relative) => JSON.parse(fs.readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8'));
const registry = read('blueprint/work-registry.json');
const graph = createWorkgraph(read('workgraphs/public.json'), registry);
const project = createProject(read('projects/vexwork-operational-console/project.json'));
const view = createBoardView(read('projects/vexwork-operational-console/board.view.json'), registry);

test('Operational Console Project models evolution without entity-per-task explosion', () => {
  const refs = projectWorkRefs(project, graph);
  assert.equal(refs.length, 21);
  assert.equal(refs.includes('work.vexwork.operational-console.outcome'), true);
  assert.equal(refs.includes('work.vexwork.operational-console.multi-fulfiller-routing'), false);
  assert.deepEqual(project.repositoryRefs, ['repo.vexwork', 'repo.vextreme']);

  assert.deepEqual(childRefs(graph, 'work.vexwork.operational-console.outcome'), [
    'work.vexwork.operational-console.commerce-template',
    'work.vexwork.operational-console.cross-domain-completion',
    'work.vexwork.operational-console.derived-work-foundation',
    'work.vexwork.operational-console.operating-domain-template',
    'work.vexwork.operational-console.vexsite-dogfood',
    'work.vexwork.operational-console.antique-pilot',
  ]);
});

test('Operational Console progression keeps patient zero before generalized commerce dogfood', () => {
  const byRef = new Map(graph.items.map((item) => [item.workRef, item]));
  assert.deepEqual(byRef.get('work.vexwork.operational-console.vexsite-dogfood').dependencyRefs, [
    'work.vexwork.operational-console.derived-work-foundation',
  ]);
  assert.deepEqual(byRef.get('work.vexwork.operational-console.operating-domain-template').dependencyRefs, [
    'work.vexwork.operational-console.vexsite-patient-zero-proof',
  ]);
  assert.deepEqual(byRef.get('work.vexwork.operational-console.commerce-template').dependencyRefs, [
    'work.vexwork.operational-console.operating-domain-template',
  ]);
  assert.deepEqual(byRef.get('work.vexwork.operational-console.antique-pilot').dependencyRefs, [
    'work.vexwork.operational-console.commerce-template',
  ]);
  assert.deepEqual(byRef.get('work.vexwork.operational-console.cross-domain-completion').dependencyRefs, [
    'work.vexwork.operational-console.antique-pilot',
    'work.vexwork.operational-console.vexsite-patient-zero-proof',
  ]);
});

test('Operational Console board distinguishes admitted evolution from held future logistics', () => {
  const board = projectWorkBoard({ project, graph, view, registry });
  const ready = board.lanes.find((lane) => lane.laneRef === 'lane.work.ready');
  const planned = board.lanes.find((lane) => lane.laneRef === 'lane.work.planned');
  assert.equal(board.lanes.flatMap((lane) => lane.cards).length, 21);
  assert.equal(ready.cards.some((card) => card.workRef === 'work.vexwork.operational-console.derived-work-foundation'), true);
  assert.equal(ready.cards.some((card) => card.workRef === 'work.vexwork.operational-console.derived-work-contract'), true);
  assert.equal(planned.cards.some((card) => card.workRef === 'work.vexwork.operational-console.vexsite-dogfood'), true);

  const lot = projectParkingLot({ graph, registry, repositoryRefOrNull: 'repo.vexwork' });
  const routing = lot.items.find((item) => item.workRef === 'work.vexwork.operational-console.multi-fulfiller-routing');
  assert.ok(routing);
  assert.equal(routing.workClass, 'POTENTIAL');
  assert.equal(routing.workDisposition, 'PARKED');
  assert.equal(routing.authorityDisposition, 'NO_AUTHORITY');
  assert.equal(routing.effectDisposition, 'NO_EFFECTS');
});

// [VXG RealForever]
