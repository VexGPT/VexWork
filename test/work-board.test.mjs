import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { createProject, createWorkgraph } from '../src/core/workgraph.mjs';
import { createBoardView, projectParkingLot, projectWorkBoard, projectWorkGraph } from '../src/core/work-board.mjs';

const read = (relative) => JSON.parse(fs.readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8'));
const registry = read('blueprint/work-registry.json');
const project = createProject(read('projects/vexwork-foundation/project.json'));
const graph = createWorkgraph(read('workgraphs/public.json'), registry);
const view = createBoardView(read('projects/vexwork-foundation/board.view.json'), registry);

test('Project Work Board projects only the Project subgraph without becoming lifecycle authority', () => {
  const board = projectWorkBoard({ project, graph, view, registry });
  const cards = board.lanes.flatMap((lane) => lane.cards);
  assert.equal(cards.length, 8);
  assert.equal(graph.items.length > cards.length, true);
  assert.equal(cards.some((card) => card.workRef === 'work.vexlife-android.vexstream.not-yet-downloaded-filter'), false);
  assert.equal(board.effects, false);
  assert.equal(board.executionAuthority, 'NONE');
  assert.equal(board.graphSemanticFingerprint, graph.semanticFingerprint);
  const intake = board.lanes.find((lane) => lane.laneRef === 'lane.work.intake');
  assert.equal(intake.cards.length, 0);
  const active = board.lanes.find((lane) => lane.laneRef === 'lane.work.active');
  assert.equal(active.cards.length, 0);
  const verify = board.lanes.find((lane) => lane.laneRef === 'lane.work.verify');
  assert.equal(verify.cards.length, 0);
  const done = board.lanes.find((lane) => lane.laneRef === 'lane.work.done');
  assert.equal(done.cards.length, 7);
  assert.equal(done.cards.some((card) => card.workRef === 'work.vexwork.foundation.outcome'), true);
  assert.equal(done.cards.some((card) => card.workRef === 'work.vexwork.foundation.maturity-closure'), true);
  assert.equal(done.cards.some((card) => card.workRef === 'work.vexwork.visibility.public-dashboard'), true);
  const archive = board.lanes.find((lane) => lane.laneRef === 'lane.work.archive');
  assert.deepEqual(archive.cards.map((card) => card.workRef), ['work.vexwork.foundation.idea-intake']);
  const ready = board.lanes.find((lane) => lane.laneRef === 'lane.work.ready');
  assert.equal(ready.cards.length, 0);
});

test('Parking Lot projects parked work independently of Project membership', () => {
  const lot = projectParkingLot({ graph, registry });
  assert.equal(lot.items.length, 6);
  assert.deepEqual(lot.items.map((item) => item.workRef).sort(), ['work.vexlife-android.vexstream.not-yet-downloaded-filter', 'work.vexlife.connected-services.guided-onboarding', 'work.vexstream.mobile-library.keep-offline-sync', 'work.vexwork.operational-console.multi-fulfiller-routing', 'work.vexwork.history.foundational-infrastructure-backfill'].sort());
  assert.equal(lot.items.every((item) => item.workDisposition === 'PARKED'), true);
  assert.equal(lot.items.some((item) => item.workRef === 'work.vexlife-android.vexstream.not-yet-downloaded-filter' && item.repositoryRefs.includes('repo.vexlife-android')), true);
  assert.equal(lot.items.some((item) => item.workRef === 'work.vextreme.vexsite.localization.closed-circuit.global-core' && item.repositoryRefs.includes('repo.vextreme')), true);
  assert.equal(lot.effects, false);
  assert.equal(lot.executionAuthority, 'NONE');

  const androidOnly = projectParkingLot({ graph, registry, repositoryRefOrNull: 'repo.vexlife-android' });
  assert.equal(androidOnly.items.length, 3);
  const vexlifeOnly = projectParkingLot({ graph, registry, repositoryRefOrNull: 'repo.vexlife' });
  assert.equal(vexlifeOnly.items.length, 1);
  assert.equal(vexlifeOnly.items[0].workRef, 'work.vexlife.connected-services.guided-onboarding');
  const vexworkOnly = projectParkingLot({ graph, registry, repositoryRefOrNull: 'repo.vexwork' });
  assert.equal(vexworkOnly.items.length, 2);
  assert.deepEqual(vexworkOnly.items.map((item) => item.workRef).sort(), ['work.vexwork.history.foundational-infrastructure-backfill', 'work.vexwork.operational-console.multi-fulfiller-routing'].sort());
});

test('Project Graph projection preserves project containment, dependencies and repository relations', () => {
  const projection = projectWorkGraph({ project, graph });
  assert.equal(projection.nodes.length, 8);
  assert.equal(projection.edges.some((edge) => edge.kind === 'DEPENDS_ON'), true);
  assert.equal(projection.edges.some((edge) => edge.kind === 'TOUCHES_REPOSITORY' && edge.to === 'repo.vexlife-android'), true);
  assert.equal(projection.nodes.some((node) => node.workRef === 'work.vexlife-android.vexstream.not-yet-downloaded-filter'), false);
  assert.equal(projection.effects, false);
});
