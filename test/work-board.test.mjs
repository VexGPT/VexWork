import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { createProject, createWorkgraph } from '../src/core/workgraph.mjs';
import { createBoardView, projectParkingLot, projectWorkBoard, projectWorkGraph } from '../src/core/work-board.mjs';

const read = (relative) => JSON.parse(fs.readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8'));
const registry = read('blueprint/work-registry.json');
const project = createProject(read('projects/vexwork-foundation/project.json'));
const graph = createWorkgraph(read('projects/vexwork-foundation/workgraph.json'), registry);
const view = createBoardView(read('projects/vexwork-foundation/board.view.json'), registry);

test('Project Work Board projects only the Project subgraph without becoming lifecycle authority', () => {
  const board = projectWorkBoard({ project, graph, view, registry });
  const cards = board.lanes.flatMap((lane) => lane.cards);
  assert.equal(cards.length, 6);
  assert.equal(graph.items.length, 7);
  assert.equal(cards.some((card) => card.workRef === 'work.vexlife-android.vexstream.not-yet-downloaded-filter'), false);
  assert.equal(board.effects, false);
  assert.equal(board.executionAuthority, 'NONE');
  assert.equal(board.graphSemanticFingerprint, graph.semanticFingerprint);
  const intake = board.lanes.find((lane) => lane.laneRef === 'lane.work.intake');
  assert.equal(intake.cards.some((card) => card.workRef === 'work.vexwork.foundation.idea-intake'), true);
  const verify = board.lanes.find((lane) => lane.laneRef === 'lane.work.verify');
  assert.equal(verify.cards.length, 1);
  assert.equal(verify.cards.some((card) => card.workRef === 'work.vexwork.foundation.runtime-persistence'), true);
  const done = board.lanes.find((lane) => lane.laneRef === 'lane.work.done');
  assert.equal(done.cards.length, 3);
  const ready = board.lanes.find((lane) => lane.laneRef === 'lane.work.ready');
  assert.equal(ready.cards.length, 0);
});

test('Parking Lot projects parked work independently of Project membership', () => {
  const lot = projectParkingLot({ graph, registry });
  assert.equal(lot.items.length, 1);
  assert.equal(lot.items[0].workRef, 'work.vexlife-android.vexstream.not-yet-downloaded-filter');
  assert.equal(lot.items[0].workDisposition, 'PARKED');
  assert.deepEqual(lot.items[0].repositoryRefs, ['repo.vexlife-android']);
  assert.equal(lot.effects, false);
  assert.equal(lot.executionAuthority, 'NONE');

  const androidOnly = projectParkingLot({ graph, registry, repositoryRefOrNull: 'repo.vexlife-android' });
  assert.equal(androidOnly.items.length, 1);
  const vexworkOnly = projectParkingLot({ graph, registry, repositoryRefOrNull: 'repo.vexwork' });
  assert.equal(vexworkOnly.items.length, 0);
});

test('Project Graph projection preserves project containment, dependencies and repository relations', () => {
  const projection = projectWorkGraph({ project, graph });
  assert.equal(projection.nodes.length, 6);
  assert.equal(projection.edges.some((edge) => edge.kind === 'DEPENDS_ON'), true);
  assert.equal(projection.edges.some((edge) => edge.kind === 'TOUCHES_REPOSITORY' && edge.to === 'repo.vexlife-android'), true);
  assert.equal(projection.nodes.some((node) => node.workRef === 'work.vexlife-android.vexstream.not-yet-downloaded-filter'), false);
  assert.equal(projection.effects, false);
});
