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
  assert.equal(refs.length, 23);
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
  assert.equal(project.sourceRefs.includes('github.pull.vexlife-android.166'), true);
  assert.equal(project.sourceRefs.includes('github.pull.vexlife-android.167'), true);

  assert.deepEqual(childRefs(graph, 'work.vexstream.mobile-library.outcome'), [
    'work.vexstream.mobile-library.download-experience',
    'work.vexstream.mobile-library.durable-device-library',
    'work.vexstream.mobile-library.large-offline-startup-performance',
    'work.vexstream.mobile-library.library-browse-discovery',
    'work.vexstream.mobile-library.massdownload-maturity',
    'work.vexstream.mobile-library.pairing-continuity-after-uninstall-reinstall',
    'work.vexstream.mobile-library.pairing-reconnect-build-continuity',
    'work.vexstream.mobile-library.playback-surfaces',
  ]);

  assert.deepEqual(childRefs(graph, 'work.vexstream.mobile-library.library-browse-discovery'), [
    'work.vexstream.mobile-library.sort-filter-controls',
  ]);

  assert.deepEqual(childRefs(graph, 'work.vexstream.mobile-library.playback-surfaces'), [
    'work.vexstream.mobile-library.current-artwork-availability',
    'work.vexstream.mobile-library.full-player',
    'work.vexstream.mobile-library.missing-artwork-reconciliation',
    'work.vexstream.mobile-library.now-playing-artwork-projection',
    'work.vexstream.mobile-library.offline-artwork-durability',
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

  assert.equal(board.lanes.flatMap((lane) => lane.cards).length, 23);
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
test('Sort / Filter returns to active refinement when lived review cannot find fresh music', () => {
  const browse = graph.items.find((candidate) => candidate.workRef === 'work.vexstream.mobile-library.library-browse-discovery');
  const controls = graph.items.find((candidate) => candidate.workRef === 'work.vexstream.mobile-library.sort-filter-controls');
  assert.ok(browse);
  assert.ok(controls);
  assert.equal(browse.state, 'DECOMPOSED');
  assert.equal(controls.parentWorkRefOrNull, browse.workRef);
  assert.equal(controls.state, 'RUNNING');
  assert.equal(controls.authorityDisposition, 'AUTHORIZED_BOUNDED');
  assert.equal(controls.effectDisposition, 'EFFECTS_BOUND');
  assert.equal(controls.sourceRefs.includes('github.issue.vexlife-android.163'), true);
  assert.equal(controls.sourceRefs.includes('github.pull.vexlife-android.166'), true);
  assert.equal(controls.sourceRefs.includes('github.pull.vexlife-android.165'), true);

  const durable = graph.items.find((candidate) => candidate.workRef === 'work.vexstream.mobile-library.durable-device-library');
  assert.equal(durable.state, 'COMPLETED');

  const board = projectWorkBoard({ project, graph, view, registry });
  const active = board.lanes.find((lane) => lane.laneRef === 'lane.work.active');
  const done = board.lanes.find((lane) => lane.laneRef === 'lane.work.done');
  assert.equal(active.cards.some((card) => card.workRef === controls.workRef), true);
  assert.equal(done.cards.some((card) => card.workRef === durable.workRef), true);
  assert.equal(controls.label, 'Sort / Filter / Recently added library controls');
  assert.equal(controls.priorityClass, 'HIGH');
  assert.equal(controls.sourceRefs.includes('human.lived-feedback.vexstream.mobile-library.recently-added.20261025a'), true);
  const history = graph.transitions.filter((transition) => transition.workRef === controls.workRef);
  assert.deepEqual(history.slice(-2).map((transition) => [transition.priorState, transition.nextState]), [['RUNNING', 'WAITING_HUMAN'], ['WAITING_HUMAN', 'RUNNING']]);
});

test('Songs bulk download and remove-all is merged/proven and waits on human review without fabricated history', () => {
  const item = graph.items.find((candidate) => candidate.workRef === 'work.vexstream.mobile-library.contextual-download-missing');
  assert.ok(item);
  assert.equal(item.label, 'Songs bulk download / remove all');
  assert.equal(item.state, 'WAITING_HUMAN');
  assert.equal(item.sourceRefs.includes('github.pull.vexlife-android.167'), true);
  assert.equal(graph.transitions.some((transition) => transition.workRef === item.workRef), false);
  const board = projectWorkBoard({ project, graph, view, registry });
  const needsHuman = board.lanes.find((lane) => lane.laneRef === 'lane.work.needs-human');
  assert.equal(needsHuman.cards.some((card) => card.workRef === item.workRef), true);
});

test('large offline library startup performance is a bounded active defect', () => {
  const item = graph.items.find((candidate) => candidate.workRef === 'work.vexstream.mobile-library.large-offline-startup-performance');
  assert.ok(item);
  assert.equal(item.workClass, 'DEFECT');
  assert.equal(item.state, 'WAITING_HUMAN');
  assert.equal(item.workDisposition, 'ACTIVE');
  assert.equal(item.priorityClass, 'HIGH');
  assert.equal(item.sourceRefs.includes('github.issue.vexlife-android.168'), true);
  assert.equal(item.authorityDisposition, 'AUTHORIZED_BOUNDED');
  assert.equal(item.effectDisposition, 'EFFECTS_BOUND');
  assert.deepEqual(item.dependencyRefs, ['work.vexstream.mobile-library.durable-device-library']);
});
test('Playback Surfaces separates accepted projection from lived artwork convergence and reconciliation', () => {
  const outcome = graph.items.find((candidate) => candidate.workRef === 'work.vexstream.mobile-library.playback-surfaces');
  const artwork = graph.items.find((candidate) => candidate.workRef === 'work.vexstream.mobile-library.now-playing-artwork-projection');
  const player = graph.items.find((candidate) => candidate.workRef === 'work.vexstream.mobile-library.full-player');
  const offlineArtwork = graph.items.find((candidate) => candidate.workRef === 'work.vexstream.mobile-library.offline-artwork-durability');
  const currentArtwork = graph.items.find((candidate) => candidate.workRef === 'work.vexstream.mobile-library.current-artwork-availability');
  const reconcile = graph.items.find((candidate) => candidate.workRef === 'work.vexstream.mobile-library.missing-artwork-reconciliation');
  assert.ok(outcome);
  assert.ok(artwork);
  assert.ok(player);
  assert.ok(offlineArtwork);
  assert.ok(currentArtwork);
  assert.ok(reconcile);
  assert.equal(outcome.state, 'DECOMPOSED');
  assert.equal(artwork.state, 'COMPLETED');
  assert.equal(player.state, 'VERIFYING');
  assert.equal(offlineArtwork.state, 'RUNNING');
  assert.equal(currentArtwork.state, 'RUNNING');
  assert.equal(reconcile.state, 'DECOMPOSED');
  assert.equal(reconcile.authorityDisposition, 'NO_AUTHORITY');
  assert.equal(reconcile.effectDisposition, 'NO_EFFECTS');
  assert.deepEqual(reconcile.dependencyRefs, [currentArtwork.workRef]);
  assert.deepEqual(player.dependencyRefs, [artwork.workRef]);
  assert.equal(artwork.repositoryRefs.includes('repo.vexstream-music'), true);
  assert.equal(artwork.repositoryRefs.includes('repo.vexlife-android'), true);
});

test('persistent Keep Offline and future tag stations remain parked outside Project membership', () => {
  const lot = projectParkingLot({ graph, registry, repositoryRefOrNull: 'repo.vexlife-android' });
  const keepOffline = lot.items.find((item) => item.workRef === 'work.vexstream.mobile-library.keep-offline-sync');
  const tagStations = lot.items.find((item) => item.workRef === 'work.vexstream.mobile-library.tag-topology-stations');
  assert.ok(keepOffline);
  assert.ok(tagStations);
  assert.equal(keepOffline.workClass, 'POTENTIAL');
  assert.equal(keepOffline.state, 'CAPTURED');
  assert.equal(keepOffline.workDisposition, 'PARKED');
  assert.equal(keepOffline.authorityDisposition, 'NO_AUTHORITY');
  assert.equal(keepOffline.effectDisposition, 'NO_EFFECTS');
  assert.equal(tagStations.workClass, 'POTENTIAL');
  assert.equal(tagStations.state, 'CAPTURED');
  assert.equal(tagStations.workDisposition, 'PARKED');
  assert.equal(tagStations.authorityDisposition, 'NO_AUTHORITY');
  assert.equal(tagStations.effectDisposition, 'NO_EFFECTS');
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
  assert.match(readme, /ML-D4 — Songs settings actions reuse MassDownload \/ Offline Copy truth/);
  assert.match(readme, /ML-D6 — MassDownload product source and terminal EndToEnd proof are different Work/);
  assert.match(readme, /Issue #157/);
  assert.match(readme, /DEVICE_STORAGE_COMPLETE/);
  assert.match(readme, /Android target orchestration remains reusable, but VexStream no longer waits on it/);
  assert.match(readme, /ML-D9 — Sort by and Filter by are one presentation surface, not one measurement/);
  assert.match(readme, /ML-D10 — VexStream source tags\/categories remain a later mobile-projection seam/);
  assert.match(readme, /ML-D11 — User-authored tags and dynamic stations remain separate future Work/);
  assert.match(readme, /ML-D12 — Sort \/ Filter Android source and proof are accepted; human Verify entry remains/);
  assert.match(readme, /ML-D13 — Songs bulk management is merged\/proven and waiting on lived review/);
  assert.match(readme, /ML-D14 — Large offline libraries exposed a cold-start performance defect/);
  assert.match(readme, /ML-D15 — Full Player is one Now Playing sheet; Android Widget work stays cross-cutting/);
  assert.match(readme, /ML-D18 — Freshness discovery is required; catalog-added and device-downloaded are different clocks/);
  assert.match(readme, /ML-D19 — Missing-artwork reconciliation is not persistent Keep Offline sync/);
  assert.match(readme, /Android issue #168/);
  assert.match(readme, /PR #166 merged/);
  assert.match(readme, /PR #167/);
  assert.match(readme, /CLEAR_DATA_LIVED_PROOF_COMPLETE/);
  assert.match(readme, /Known VexWork modeling gap/);
});
