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
  assert.equal(refs.length, 12);
  assert.equal(refs.includes('work.vexstream.mobile-library.outcome'), true);
  assert.equal(refs.includes('work.vexstream.mobile-library.download-experience'), true);
  assert.equal(refs.includes('work.vexstream.mobile-library.massdownload-maturity'), true);
  assert.equal(refs.includes('work.vexstream.mobile-library.keep-offline-sync'), false);
  assert.equal(project.repositoryRefs.includes('repo.vexlife-android'), true);
  assert.equal(project.repositoryRefs.includes('repo.vexstream-music'), true);
  assert.equal(project.sourceRefs.includes('projects/vexstream-mobile-library/README.md'), true);
  assert.equal(project.sourceRefs.includes('github.pull.vexlife-android.151'), true);
  assert.equal(project.sourceRefs.includes('github.pull.vexlife-android.155'), true);
  assert.equal(project.sourceRefs.includes('github.pull.vextreme-sdk.1887'), true);
  assert.equal(project.sourceRefs.includes('github.issue.vexlife-android.157'), true);

  assert.deepEqual(childRefs(graph, 'work.vexstream.mobile-library.outcome'), [
    'work.vexstream.mobile-library.download-experience',
    'work.vexstream.mobile-library.durable-device-library',
    'work.vexstream.mobile-library.massdownload-maturity',
  ]);

  assert.deepEqual(childRefs(graph, 'work.vexstream.mobile-library.durable-device-library'), [
    'work.vexstream.mobile-library.clear-data-proof',
    'work.vexstream.mobile-library.device-storage',
    'work.vexstream.mobile-library.private-download-migration',
    'work.vexstream.mobile-library.rediscovery',
  ]);
  assert.deepEqual(childRefs(graph, 'work.vexstream.mobile-library.download-experience'), [
    'work.vexstream.mobile-library.contextual-download-missing',
  ]);
  assert.deepEqual(childRefs(graph, 'work.vexstream.mobile-library.massdownload-maturity'), [
    'work.vexstream.mobile-library.massdownload-e2e',
    'work.vexstream.mobile-library.massdownload-product',
    'work.vexstream.mobile-library.track-menu-presentation-defect',
  ]);
  assert.deepEqual(childRefs(graph, 'work.vexstream.mobile-library.massdownload-e2e'), []);
});

test('Mobile Library Board separates terminal MassDownload from the paused Queue checkpoint', () => {
  const board = projectWorkBoard({ project, graph, view, registry });
  const done = board.lanes.find((lane) => lane.laneRef === 'lane.work.done');
  const active = board.lanes.find((lane) => lane.laneRef === 'lane.work.active');
  const waiting = board.lanes.find((lane) => lane.laneRef === 'lane.work.waiting');

  assert.equal(board.lanes.flatMap((lane) => lane.cards).length, 12);
  assert.equal(done.cards.some((card) => card.workRef === 'work.vexstream.mobile-library.massdownload-product'), true);
  assert.equal(done.cards.some((card) => card.workRef === 'work.vexstream.mobile-library.massdownload-e2e'), true);
  assert.equal(active.cards.some((card) => card.workRef === 'work.vexstream.mobile-library.track-menu-presentation-defect'), false);
  assert.equal(waiting.cards.some((card) => card.workRef === 'work.vexstream.mobile-library.track-menu-presentation-defect'), true);
  const queueIncident = waiting.cards.find((card) => card.workRef === 'work.vexstream.mobile-library.track-menu-presentation-defect');
  assert.equal(queueIncident.state, 'PAUSED_AT_CHECKPOINT');
  assert.equal(queueIncident.workDisposition, 'ACTIVE');
  assert.equal(queueIncident.authorityDisposition, 'AUTHORIZED_BOUNDED');
  assert.equal(queueIncident.effectDisposition, 'NO_EFFECTS');
});

test('durable device library is terminal without closing separate Mobile Library work', () => {
  const durableRefs = [
    'work.vexstream.mobile-library.durable-device-library',
    'work.vexstream.mobile-library.device-storage',
    'work.vexstream.mobile-library.rediscovery',
    'work.vexstream.mobile-library.private-download-migration',
    'work.vexstream.mobile-library.clear-data-proof',
  ];
  for (const workRef of durableRefs) {
    const item = graph.items.find((candidate) => candidate.workRef === workRef);
    assert.ok(item, workRef);
    assert.equal(item.state, 'COMPLETED', workRef);
    assert.equal(item.workDisposition, 'ACTIVE', workRef);
  }

  const storage = graph.items.find((candidate) => candidate.workRef === 'work.vexstream.mobile-library.device-storage');
  assert.deepEqual(storage.dependencyRefs, []);
  assert.equal(storage.sourceRefs.includes('github.pull.vexlife-android.165'), true);

  const clearData = graph.items.find((candidate) => candidate.workRef === 'work.vexstream.mobile-library.clear-data-proof');
  assert.equal(clearData.sourceRefs.includes('github.pull.vextreme-sdk.1898'), true);
  assert.equal(clearData.sourceRefs.includes('github.issue.vexlife-android.162'), true);

  const root = graph.items.find((candidate) => candidate.workRef === 'work.vexstream.mobile-library.outcome');
  assert.equal(root.state, 'DECOMPOSED');

  const storageHistory = graph.transitions.filter(
    (transition) => transition.workRef === storage.workRef,
  );
  assert.deepEqual(
    storageHistory.slice(-2).map((transition) => [transition.priorState, transition.nextState]),
    [
      ['WAITING_TOOL', 'VERIFYING'],
      ['VERIFYING', 'COMPLETED'],
    ],
  );

  const board = projectWorkBoard({ project, graph, view, registry });
  const done = board.lanes.find((lane) => lane.laneRef === 'lane.work.done');
  const active = board.lanes.find((lane) => lane.laneRef === 'lane.work.active');
  const intake = board.lanes.find((lane) => lane.laneRef === 'lane.work.intake');
  const waiting = board.lanes.find((lane) => lane.laneRef === 'lane.work.waiting');

  for (const workRef of durableRefs) {
    assert.equal(done.cards.some((card) => card.workRef === workRef), true, workRef);
  }
  assert.equal(active.cards.some((card) => card.workRef === storage.workRef), false);
  assert.equal(intake.cards.some((card) => card.workRef === root.workRef), true);
  assert.equal(intake.cards.some((card) => card.workRef === 'work.vexstream.mobile-library.download-experience'), true);
  assert.equal(waiting.cards.some((card) => card.workRef === 'work.vexstream.mobile-library.track-menu-presentation-defect'), true);
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

test('Mobile Library Project keeps a human audit/decision front door beside graph truth', () => {
  const readme = fs.readFileSync(new URL('../projects/vexstream-mobile-library/README.md', import.meta.url), 'utf8');
  assert.match(readme, /ML-D1 — Preserve exact media identity/);
  assert.match(readme, /ML-D4 — Contextual Download Missing reuses MassDownload semantics/);
  assert.match(readme, /ML-D6 — MassDownload product source and terminal EndToEnd proof are different Work/);
  assert.match(readme, /VexLife-Android issue #157/);
  assert.match(readme, /DEVICE_STORAGE_READY/);
  assert.match(readme, /Android target orchestration is a reusable dependency/);
  assert.match(readme, /Known VexWork modeling gap/);
});
