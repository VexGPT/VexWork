import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import * as Board from '../vexboard-reader.js';
import {
  evidenceForSemanticRef,
  normalizeBoardEvidence,
} from '../src/shared/vexboard-evidence.mjs';

const raw = JSON.parse(fs.readFileSync(
  new URL('../projects/vexboard/examples/vexstream-phone-desktop-connection.board.json', import.meta.url),
  'utf8',
));

test('VexStream living Blueprint binds current Android/Desktop source without turning screenshots into semantic nodes', async () => {
  const draft = Board.normalizeDraft(raw);
  const state = await Board.hydrateBoardState(draft.graph, draft.projection);
  const evidence = normalizeBoardEvidence(draft.evidence, state.graph);

  assert.equal(draft.draftRef, 'board.vexstream.phone-desktop-connection.living-blueprint');
  assert.equal(state.projection.layoutIntent, 'SWIMLANE');
  assert.equal(state.graph.nodes.some((node) => node.kind === 'SCREENSHOT'), false);
  assert.equal(state.graph.sourceRefs.includes('git.commit.vexlife-android.31a99c92d2c7a5e15a5e187e044dd7be19440552'), true);
  assert.equal(state.graph.sourceRefs.includes('git.commit.vexstream-music.6ab8fef3e0acdf3a919fc64f9e28e3758060ec15'), true);
  assert.equal(evidence.artifacts.length, 0);
  assert.equal(evidence.slots.length, 10);

  const constraint = state.graph.nodes.find(
    (node) => node.nodeRef === 'annotation.vexstream.android.connection-constraints',
  );
  assert.ok(constraint);
  assert.match(constraint.label, /START↔END/);
  assert.match(constraint.label, /H12dp\/V8dp/);
  assert.match(constraint.label, /16dp/);
  assert.match(constraint.label, /12dp/);
  assert.equal(constraint.sourceRefs.includes('repo.vexlife-android:architecture/elements/src/main/kotlin/com/vextreme/vexlife/android/elements/ElementCells.kt'), true);
});

test('VexStream living Blueprint preserves the remembered-phone conditional branch and one navigable human path', async () => {
  const state = await Board.hydrateBoardState(raw.graph, raw.projection);
  const decisionChoices = state.graph.relationships
    .filter((relationship) => relationship.fromRef === 'decision.vexstream.desktop.remembered-phone')
    .map((relationship) => relationship.labelOrNull)
    .sort();
  assert.deepEqual(decisionChoices, ['NO_REMEMBERED_PHONE · AUTO_START', 'REMEMBERED_PHONE']);

  let journey = Board.createBoardJourney(state.graph, {
    journeyRef: 'journey.vexstream.phone-desktop-connection.no-remembered',
    boardRef: raw.draftRef,
    startRef: 'scene.vexstream.desktop.library',
  });
  for (const relationshipRef of [
    'rel.vexstream.desktop.library-open-phone',
    'rel.vexstream.desktop.open-phone-connection',
    'rel.vexstream.desktop.connection-condition',
    'rel.vexstream.desktop.no-remembered-ready',
    'rel.vexstream.desktop.ready-android-home',
    'rel.vexstream.android.home-connect',
    'rel.vexstream.android.connect-not-paired',
    'rel.vexstream.android.not-paired-find',
    'rel.vexstream.android.find-searching',
    'rel.vexstream.android.searching-confirm-code',
    'rel.vexstream.android.confirm-request',
    'rel.vexstream.android.request-waiting',
    'rel.vexstream.approval-checkpoint',
    'rel.vexstream.desktop.pending-allow',
    'rel.vexstream.desktop.allow-paired',
  ]) {
    journey = Board.advanceBoardJourney(state.graph, journey, relationshipRef);
  }
  assert.equal(journey.currentRef, 'scene.vexstream.android.paired-library');
  assert.equal(journey.returnStack.length, 15);
  journey = Board.backBoardJourney(state.graph, journey);
  assert.equal(journey.currentRef, 'control.vexstream.desktop.allow');
});

test('VexStream evidence slots preserve expected visuals while observed screenshot admission remains held', async () => {
  const state = await Board.hydrateBoardState(raw.graph, raw.projection);
  const evidence = normalizeBoardEvidence(raw.evidence, state.graph);
  const confirm = evidenceForSemanticRef(evidence, state.graph, 'scene.vexstream.android.confirm-code');
  assert.equal(confirm.length, 1);
  assert.match(confirm[0].expectation, /six-digit code/);
  assert.deepEqual(confirm[0].artifacts, []);

  const osPermission = evidenceForSemanticRef(
    evidence,
    state.graph,
    'reference.vexstream.android-os.media-permission',
  );
  assert.equal(osPermission.length, 1);
  assert.match(osPermission[0].expectation, /platform-owned/);
  assert.match(osPermission[0].expectation, /not modeled as the prerequisite/);
});
