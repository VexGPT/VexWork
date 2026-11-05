import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import * as Board from '../vexboard-reader.js';
import { evidenceForSemanticRef, normalizeBoardEvidence } from '../src/shared/vexboard-evidence.mjs';

const raw = JSON.parse(fs.readFileSync(
  new URL('../projects/vexboard/examples/vexstream-phone-desktop-connection.board.json', import.meta.url),
  'utf8',
));
const construction = JSON.parse(fs.readFileSync(
  new URL('../projects/vexboard/examples/vexstream-phone-desktop-connection-construction.board.json', import.meta.url),
  'utf8',
));

test('VexStream primary living Blueprint is journey-first and delegates construction detail through a bounded portal', async () => {
  const draft = Board.normalizeDraft(raw);
  const state = await Board.hydrateBoardState(draft.graph, draft.projection);
  const evidence = normalizeBoardEvidence(draft.evidence, state.graph);
  assert.equal(draft.draftRef, 'board.vexstream.phone-desktop-connection.living-blueprint');
  assert.equal(state.projection.layoutIntent, 'SWIMLANE');
  assert.equal(state.graph.nodes.some((node) => node.kind === 'SCREENSHOT'), false);
  assert.equal(state.graph.nodes.some((node) => node.nodeRef.startsWith('annotation.vexstream.')), false);
  const portal = state.graph.nodes.find((node) => node.nodeRef === 'portal.vexstream.construction-evidence');
  assert.ok(portal);
  assert.equal(portal.detailBoardRefOrNull, 'board.vexstream.phone-desktop-connection.construction-evidence');
  assert.equal(evidence.artifacts.length, 3);
  assert.equal(evidence.slots.length, 10);

  const home = evidenceForSemanticRef(evidence, state.graph, 'scene.vexstream.android.home')[0];
  const notPaired = evidenceForSemanticRef(evidence, state.graph, 'scene.vexstream.android.not-paired')[0];
  const confirm = evidenceForSemanticRef(evidence, state.graph, 'scene.vexstream.android.confirm-code')[0];

  assert.equal(home.artifacts[0].contentSha256OrNull, 'f5b84da36456bfeba22a1f1874c09360fe7b33eef303776ed0412fb72bdcb3da');
  assert.equal(home.artifacts[0].capturedAtOrNull, '2026-10-19T03:59:25.489Z');
  assert.equal(notPaired.artifacts[0].contentSha256OrNull, '3bde6851344aacc36fc5b647d1ed7b7937c2450e3e4c06ddaf5d101661164434');
  assert.equal(notPaired.artifacts[0].capturedAtOrNull, '2026-10-19T03:59:25.982Z');
  assert.equal(confirm.artifacts[0].contentSha256OrNull, '733f78c0ef2c117fd29cbab030abea8b17dcf0a5786366eb37f62ef6b9d26d23');
  assert.equal(confirm.artifacts[0].capturedAtOrNull, '2026-10-19T03:59:27.014Z');

  for (const item of [home.artifacts[0], notPaired.artifacts[0], confirm.artifacts[0]]) {
    assert.equal(item.role, 'OBSERVED');
    assert.ok(item.sourceRefs.includes('return.vexstream-v4-android-lived-proof.a011.sha256-dcfe892eccbc85f2c51ec6b197298727dc7da456820248a8d9696d10757dc20c'));
    assert.ok(item.sourceRefs.includes('git.commit.vexlife-android.eb1edba1b76a295ce59195b889b0bcd58613f334'));
    assert.ok(item.sourceRefs.includes('git.commit.vexstream-music.ea3fce6cbfb666c84e3a0bccb6ff67fe830093b3'));
  }
  assert.ok(home.sourceRefs.includes('git.commit.vexlife-android.31a99c92d2c7a5e15a5e187e044dd7be19440552'));
  assert.equal(home.artifacts[0].sourceRefs.includes('git.commit.vexlife-android.31a99c92d2c7a5e15a5e187e044dd7be19440552'), false,
    'observed A011 source stays distinct from the newer expected-source slot');
});

test('construction/evidence board preserves target-specific Android mapping without treating dp as portable truth', async () => {
  const detail = Board.normalizeDraft(construction);
  const state = await Board.hydrateBoardState(detail.graph, detail.projection);
  const constraint = state.graph.nodes.find((node) => node.nodeRef === 'annotation.vexstream.android.connection-constraints');
  assert.ok(constraint);
  assert.match(constraint.label, /START↔END/);
  assert.match(constraint.label, /H12dp\/V8dp/);
  assert.match(constraint.label, /16dp/);
  assert.match(constraint.label, /12dp/);
  assert.match(constraint.label, /not universal Blueprint units/);
});

test('VexStream living Blueprint preserves the remembered-phone conditional branch and one navigable human path', async () => {
  const state = await Board.hydrateBoardState(raw.graph, raw.projection);
  const decisionChoices = state.graph.relationships
    .filter((relationship) => relationship.fromRef === 'decision.vexstream.desktop.remembered-phone')
    .map((relationship) => relationship.labelOrNull)
    .sort();
  assert.deepEqual(decisionChoices, ['No remembered → auto-start', 'Remembered']);
  let journey = Board.createBoardJourney(state.graph, {
    journeyRef: 'journey.vexstream.phone-desktop-connection.no-remembered',
    boardRef: raw.draftRef,
    startRef: 'scene.vexstream.desktop.library',
  });
  for (const relationshipRef of [
    'rel.vexstream.desktop.library-open-phone','rel.vexstream.desktop.open-phone-connection',
    'rel.vexstream.desktop.connection-condition','rel.vexstream.desktop.no-remembered-ready',
    'rel.vexstream.desktop.ready-android-home','rel.vexstream.android.home-connect',
    'rel.vexstream.android.connect-not-paired','rel.vexstream.android.not-paired-find',
    'rel.vexstream.android.find-searching','rel.vexstream.android.searching-confirm-code',
    'rel.vexstream.android.confirm-request','rel.vexstream.android.request-waiting',
    'rel.vexstream.approval-checkpoint','rel.vexstream.desktop.pending-allow',
    'rel.vexstream.desktop.allow-paired'
  ]) journey = Board.advanceBoardJourney(state.graph, journey, relationshipRef);
  assert.equal(journey.currentRef, 'scene.vexstream.android.paired-library');
  assert.equal(journey.returnStack.length, 15);
  journey = Board.backBoardJourney(state.graph, journey);
  assert.equal(journey.currentRef, 'control.vexstream.desktop.allow');
});

test('VexStream evidence slots admit the exact A011 Android observed subset without widening whole-run truth', async () => {
  const state = await Board.hydrateBoardState(raw.graph, raw.projection);
  const evidence = normalizeBoardEvidence(raw.evidence, state.graph);
  const confirm = evidenceForSemanticRef(evidence, state.graph, 'scene.vexstream.android.confirm-code');
  assert.equal(confirm.length, 1);
  assert.match(confirm[0].expectation, /six-digit code/);
  assert.equal(confirm[0].artifacts.length, 1);
  assert.equal(confirm[0].artifacts[0].assetRef, 'asset.screenshot.vexstream.android-confirm-code.a011');

  const waiting = evidenceForSemanticRef(evidence, state.graph, 'scene.vexstream.android.waiting-approval');
  assert.deepEqual(waiting[0].artifacts, [], 'A011 visual does not prove WaitingForDesktopApproval even though the test state advanced');

  const desktopReady = evidenceForSemanticRef(evidence, state.graph, 'scene.vexstream.desktop.pairing-ready');
  assert.deepEqual(desktopReady[0].artifacts, [], 'A011 host screenshot did not isolate the VexStream pairing UI');

  const osPermission = evidenceForSemanticRef(evidence, state.graph, 'reference.vexstream.android-os.media-permission');
  assert.equal(osPermission.length, 1);
  assert.match(osPermission[0].expectation, /platform-owned/);
  assert.match(osPermission[0].expectation, /not modeled as the prerequisite/);
});
