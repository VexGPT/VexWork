import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import * as Layout from '../src/shared/vexboard-lens-layout.mjs';
import * as Query from '../src/shared/vexboard-screen-lens-query.mjs';
import * as Lens from '../src/shared/vexboard-screen-lens.mjs';

const source = JSON.parse(fs.readFileSync(new URL('../projects/vexboard/examples/vexlife-android-vexstream-playback.screen-lens.reference.json', import.meta.url), 'utf8'));
const generatedSource = JSON.parse(fs.readFileSync(new URL('../projects/vexboard/lens/vexlife-android.screen-lens.json', import.meta.url), 'utf8'));
const lens = Lens.normalizeScreenLens(source);
const PLAY_PAUSE = 'element.vexstream-music.body.player.play-pause';
const FIND = 'element.vexstream-music.body.connection.find';
const PLAYBACK = 'pathway.vexstream.playback.play-pause';

test('stable VexStream reference keeps Claude direct-registration meaning beside the Playback Family case', () => {
  assert.equal(lens.lensRef, 'lens.reference.vexlife-android.vexstream-playback');
  assert.equal(lens.entryScreenRef, 'screen.vexstream-music');
  assert.equal(lens.entryElementRef, PLAY_PAUSE);
  assert.equal(Lens.pathwayForElement(lens, FIND).disposition, 'DIRECT_REGISTRATION');
  assert.equal(Lens.pathwayForElement(lens, PLAY_PAUSE).pathwayRef, PLAYBACK);
  assert.equal(Lens.pathwayForElement(lens, PLAY_PAUSE).disposition, 'SCAE_FAMILY');
});

test('reference preserves Claude generated VexStream screen and existing pathways except the one intentional Play/Pause bond', () => {
  const generatedScreen = structuredClone(generatedSource.screens.find((screen) => screen.screenRef === 'screen.vexstream-music'));
  const referenceScreen = structuredClone(source.screens[0]);
  // The reference preserves REGISTRATION (element tree + pathways). Realization is an additive projection
  // section with its own regression surface (test/vexboard-android-realization.test.mjs).
  delete generatedScreen.realization;
  generatedScreen.elements.find((element) => element.ref === PLAY_PAUSE).pathwayRef = PLAYBACK;
  assert.deepEqual(referenceScreen, generatedScreen);

  const existingRefs = new Set(referenceScreen.elements.map((element) => element.pathwayRef).filter((ref) => ref && ref !== PLAYBACK));
  const generatedPathways = generatedSource.pathways.filter((pathway) => existingRefs.has(pathway.pathwayRef));
  const referencePathways = source.pathways.filter((pathway) => pathway.pathwayRef !== PLAYBACK);
  assert.deepEqual(referencePathways, generatedPathways);
});

test('Playback reference is a closed semantic/provider round trip without invented Method or VexExecution', () => {
  const pathway = Lens.pathwayFor(lens, PLAYBACK);
  const behavior = Lens.faceGraph(pathway, 'BEHAVIOR');
  const depth = Lens.faceGraph(pathway, 'DEPTH');

  assert.ok(behavior.nodes.some((node) => node.ref === 'vexstream.playback.play-pause.control' && node.role === 'CONTROL'));
  assert.ok(behavior.nodes.some((node) => node.ref === 'vexstream.playback.play-pause.state' && node.role === 'STATE'));
  assert.ok(behavior.nodes.some((node) => node.ref === 'vexstream.playback.play-pause.act' && node.role === 'ACT'));
  assert.ok(behavior.nodes.some((node) => node.ref === 'vexstream.playback.play-pause.effect' && node.role === 'EFFECT'));
  assert.ok(behavior.nodes.some((node) => node.ref === 'vexstream.playback.play-pause.presentation' && node.role === 'PROJECTION'));
  assert.ok(depth.nodes.some((node) => node.ref === 'vexstream.playback.play-pause.connection'));
  assert.ok(depth.nodes.some((node) => node.ref === 'vexstream.playback.play-pause.provider' && node.role === 'STORE'));
  assert.ok(depth.nodes.some((node) => node.ref === 'vexstream.playback.play-pause.reconcile' && node.role === 'OBSERVATION'));
  assert.ok(!pathway.nodes.some((node) => node.role === 'METHOD'));
  assert.ok(!pathway.nodes.some((node) => node.role === 'EXECUTION'));
  assert.ok(pathway.edges.some((edge) => edge.from === 'vexstream.playback.play-pause.reconcile' && edge.to === 'vexstream.playback.play-pause.state' && edge.kind === 'RETURN'));
  assert.equal(pathway.returnRef, 'vexstream.playback.play-pause.presentation');
});

test('both Playback faces are deterministic and collision-free in the same layout engine Claude uses', () => {
  const pathway = Lens.pathwayFor(lens, PLAYBACK);
  for (const face of ['BEHAVIOR', 'DEPTH']) {
    for (const hideBands of [[], ['DOORWAY']]) {
      const graph = Lens.faceGraph(pathway, face, { hideBands });
      if (!graph.nodes.length) continue;
      const input = { nodes: graph.nodes.map((node) => ({ ...node, footer: true })), edges: graph.edges };
      const layout = Layout.layoutLensFace(input);
      assert.deepEqual(layout, Layout.layoutLensFace(input), `${face} layout stays deterministic`);
      assert.deepEqual(Layout.layoutCollisions(layout), [], `${face} ${hideBands} has no collisions`);
      assert.ok(layout.edges.every((edge) => !edge.labelCollides), `${face} ${hideBands} has no label collisions`);
    }
  }
});

test('source search, reverse targeting, impact and AI brief all enter the same Playback case', () => {
  const search = Query.searchLens(lens, 'Media3VexStreamPlaybackConnection', { currentScreenRef: 'screen.vexstream-music' });
  assert.equal(search[0].kind, 'STEP');
  assert.equal(search[0].ref, 'vexstream.playback.play-pause.connection');
  assert.deepEqual(search[0].target, {
    screenRef: 'screen.vexstream-music',
    elementRef: PLAY_PAUSE,
    pathwayRef: PLAYBACK,
    nodeRef: 'vexstream.playback.play-pause.connection',
  });

  const impact = Query.impactOf(lens, PLAY_PAUSE);
  assert.equal(impact.pathwayRef, PLAYBACK);
  assert.ok(impact.touches.includes('vexstream.playback.play-pause.provider'));
  assert.ok(impact.touches.includes('vexstream.playback.play-pause.reconcile'));

  const brief = Query.controlBrief(lens, PLAY_PAUSE, { screenRef: 'screen.vexstream-music' });
  assert.match(brief, /VexStreamPlaybackControl\.PlayPause/);
  assert.match(brief, /Media3VexStreamPlaybackConnection/);
  assert.match(brief, /reconcileVexStreamPlaybackObservation/);
  assert.match(brief, /Stable reference case, not a second source of truth/);
});

test('reference sources resolve to the same pinned VexLife commit as Claude generated lens', () => {
  assert.equal(lens.sourceSnapshot.commit, '305a09eac1fabebcf2241bd207386950f41121f2');
  assert.equal(
    Lens.sourceUrl(lens, 'app:vexstream/playback/VexStreamPlaybackPending.kt'),
    'https://github.com/vgong24/VexLife-Android/blob/305a09eac1fabebcf2241bd207386950f41121f2/app/src/main/kotlin/com/vextreme/vexlife/android/vexstream/playback/VexStreamPlaybackPending.kt',
  );
});

// [VXG RealForever][VEXWORK][VEXBOARD][SCREEN-LENS][VEXSTREAM-REFERENCE]
