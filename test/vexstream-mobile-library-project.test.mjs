import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { createProjectAgencyPolicy, transitionHandshakeRequirement } from '../src/core/transition-handshake.mjs';
import { createProject, createWorkgraph, childRefs, projectWorkRefs } from '../src/core/workgraph.mjs';
import { createBoardView, projectParkingLot, projectWorkBoard } from '../src/core/work-board.mjs';

const read = (relative) => JSON.parse(fs.readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8'));
const registry = read('blueprint/work-registry.json');
const graph = createWorkgraph(read('workgraphs/public.json'), registry);
const project = createProject(read('projects/vexstream-mobile-library/project.json'));
const view = createBoardView(read('projects/vexstream-mobile-library/board.view.json'), registry);
const policy = createProjectAgencyPolicy(read('projects/vexstream-mobile-library/agency.policy.json'), registry);

test('VexStream Mobile Library is the first external Project over the shared Workgraph', () => {
  const refs = projectWorkRefs(project, graph);
  assert.equal(refs.length, 10);
  assert.equal(refs.includes('work.vexstream.mobile-library.outcome'), true);
  assert.equal(refs.includes('work.vexstream.mobile-library.keep-offline-sync'), false);
  assert.equal(project.repositoryRefs.includes('repo.vexlife-android'), true);

  assert.deepEqual(childRefs(graph, 'work.vexstream.mobile-library.durable-device-library'), [
    'work.vexstream.mobile-library.clear-data-proof',
    'work.vexstream.mobile-library.device-storage',
    'work.vexstream.mobile-library.private-download-migration',
    'work.vexstream.mobile-library.rediscovery',
  ]);
  assert.deepEqual(childRefs(graph, 'work.vexstream.mobile-library.massdownload-e2e'), [
    'work.vexstream.mobile-library.track-menu-presentation-defect',
  ]);
});

test('Mobile Library Board preserves current truth without pretending unknown proof work is active', () => {
  const board = projectWorkBoard({ project, graph, view, registry });
  const intake = board.lanes.find((lane) => lane.laneRef === 'lane.work.intake');
  const done = board.lanes.find((lane) => lane.laneRef === 'lane.work.done');
  const active = board.lanes.find((lane) => lane.laneRef === 'lane.work.active');

  assert.equal(board.lanes.flatMap((lane) => lane.cards).length, 10);
  assert.equal(done.cards.some((card) => card.workRef === 'work.vexstream.mobile-library.massdownload-product'), true);
  assert.equal(intake.cards.some((card) => card.workRef === 'work.vexstream.mobile-library.massdownload-e2e'), true);
  assert.equal(intake.cards.some((card) => card.workRef === 'work.vexstream.mobile-library.track-menu-presentation-defect'), true);
  assert.equal(active.cards.length, 0);
});

test('persistent Keep Offline remains parked outside Project membership', () => {
  const lot = projectParkingLot({ graph, registry, repositoryRefOrNull: 'repo.vexlife-android' });
  const keepOffline = lot.items.find((item) => item.workRef === 'work.vexstream.mobile-library.keep-offline-sync');
  assert.ok(keepOffline);
  assert.equal(keepOffline.workClass, 'POTENTIAL');
  assert.equal(keepOffline.state, 'CAPTURED');
  assert.equal(keepOffline.workDisposition, 'PARKED');
  assert.equal(keepOffline.authorityDisposition, 'NO_AUTHORITY');
  assert.equal(keepOffline.effectDisposition, 'NO_EFFECTS');
});

test('Mobile Library agency policy requires human handshake only at meaningful phase promotion', () => {
  assert.equal(policy.mode, 'DELEGATED_WITH_TRANSITION_HANDSHAKE');
  assert.equal(transitionHandshakeRequirement({ policy, priorState: 'PLAN_VALIDATED', nextState: 'READY', registry }).required, false);
  assert.equal(transitionHandshakeRequirement({ policy, priorState: 'READY', nextState: 'RUNNING', registry }).required, true);
  assert.equal(transitionHandshakeRequirement({ policy, priorState: 'RUNNING', nextState: 'WAITING_TOOL', registry }).required, false);
  assert.equal(transitionHandshakeRequirement({ policy, priorState: 'RUNNING', nextState: 'VERIFYING', registry }).required, true);
  assert.equal(transitionHandshakeRequirement({ policy, priorState: 'VERIFYING', nextState: 'COMPLETED', registry }).required, true);
});
