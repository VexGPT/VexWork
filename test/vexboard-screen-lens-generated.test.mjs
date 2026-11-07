import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { normalizeScreenLens, pathwayForElement, screenGraph } from '../src/shared/vexboard-screen-lens.mjs';
import { screenCoverage } from '../src/shared/vexboard-screen-lens-query.mjs';
import { requireForwardMainRelation } from '../scripts/build-screen-lens.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const generatedFile = path.join(ROOT, 'projects/vexboard/lens/vexlife-android.screen-lens.json');
const raw = JSON.parse(fs.readFileSync(generatedFile, 'utf8'));
const lens = normalizeScreenLens(raw);
const hand = normalizeScreenLens(JSON.parse(fs.readFileSync(new URL('./fixtures/screen-lens/debug-menu.hand.screen-lens.json', import.meta.url), 'utf8')));

test('the committed lens is current with its adapter, overlay and generator', () => {
  const output = execFileSync(process.execPath, [path.join(ROOT, 'scripts/build-screen-lens.mjs'), '--verify'], { cwd: ROOT, encoding: 'utf8' });
  const verified = JSON.parse(output);
  assert.equal(verified.state, 'PASS');
  assert.deepEqual(verified.builds.map((entry) => `${entry.subject}:${entry.build}:${entry.state}`), ['vexlife-android:stable:PASS', 'vexlife-android:main:PASS'], 'every catalog build is verified at its own pointer');
  assert.match(raw.provenance.generator, /^vexlife-android-adapter\//);
  assert.equal(raw.provenance.projectorBlobSha1, '9c8f41180cc9e8d8c7793524cd85f790d706ff33');
  // D34 extended: the projector's own module imports (Kotlin reading, realization, examples) are bound too.
  assert.match(raw.provenance.projectorSupportSha256, /^[0-9a-f]{64}$/);
  assert.match(raw.provenance.sourceCommit, /^[0-9a-f]{40}$/);
  assert.equal(raw.provenance.sourceCommit, lens.sourceSnapshot.commit);
  assert.match(lens.sourceSnapshot.notes[0], /Regenerate it; do not edit by hand/);
});

test('ordinary Main movement admits only identical or forward branch history', () => {
  assert.deepEqual(requireForwardMainRelation({ currentMain: '1'.repeat(40), liveHead: '1'.repeat(40), isAncestor: null, branch: 'main' }), { status: 'IDENTICAL', head: '1'.repeat(40) });
  assert.deepEqual(requireForwardMainRelation({ currentMain: '1'.repeat(40), liveHead: '2'.repeat(40), isAncestor: true, branch: 'main' }), { status: 'AHEAD', head: '2'.repeat(40) });
  assert.throws(() => requireForwardMainRelation({ currentMain: '1'.repeat(40), liveHead: '2'.repeat(40), isAncestor: false, branch: 'main' }), /not forward/);
  assert.throws(() => requireForwardMainRelation({ currentMain: '1'.repeat(40), liveHead: '2'.repeat(40), isAncestor: null, branch: 'main' }), /could not prove/);
});

test('generated related boards are stable VexBoard identities', () => {
  assert.deepEqual(lens.relatedBoardRefs, [
    'board.vexlife.debug-menu.theme-mode.origin-walk',
    'board.vexlife-android.vexstream-playback.vexarchitecture',
    'board.vexstream.phone-desktop-connection.living-blueprint',
  ]);
});

test('every registered screen is projected from source', () => {
  assert.deepEqual(lens.screens.map((screen) => screen.screenRef).sort(), [
    'screen.debug-menu', 'screen.events', 'screen.family-conversation', 'screen.gallery', 'screen.home',
    'screen.settings', 'screen.talk-to-vex', 'screen.user-profile', 'screen.vex-maps', 'screen.vexstream-music',
  ]);
  assert.ok(lens.screens.every((screen) => screen.mapped === 'MAPPED'));
  const graph = screenGraph(lens);
  assert.ok(graph.screens.every((screen) => screen.inboundRouteCount > 0), 'every screen is reachable in the map');
});

test('the generated Debug Menu reproduces every identity the hand-made lens had', () => {
  const handRefs = [...hand.chrome.flatMap((entry) => entry.elements), ...hand.screens.find((screen) => screen.screenRef === 'screen.debug-menu').elements].map((element) => element.ref);
  const generated = new Set([...lens.chrome.flatMap((entry) => entry.elements), ...lens.screens.flatMap((screen) => screen.elements)].map((element) => element.ref));
  const missing = handRefs.filter((ref) => !generated.has(ref));
  assert.deepEqual(missing, []);
});

test('dispositions match what the code earns', () => {
  const disposition = (ref) => pathwayForElement(lens, ref)?.disposition ?? null;
  assert.equal(disposition('element.debug-menu.body.dark-mode'), 'SCAE_FAMILY');
  assert.equal(disposition('element.debug-menu.body.log-history.actions.show'), 'TYPED_PRESENTATION');
  assert.equal(disposition('element.debug-menu.body.log-history.actions.reset'), 'DIRECT_REGISTRATION');
  assert.equal(disposition('element.debug-menu.body.events-simulator.actions.start'), 'DIRECT_REGISTRATION');
  assert.equal(disposition('element.debug-menu'), 'TYPED_NAVIGATION');
  assert.equal(disposition('element.shell.back'), 'TYPED_NAVIGATION');
  assert.equal(disposition('element.debug-menu.body.log-history'), null);
  const theme = pathwayForElement(lens, 'element.debug-menu.body.dark-mode');
  for (const role of ['CONTROL', 'STATE', 'ACT', 'EFFECT', 'PROJECTION', 'METHOD', 'RESULT', 'EXECUTION', 'REALIZATION', 'STORE', 'OBSERVATION']) {
    assert.ok(theme.nodes.some((node) => node.role === role), role);
  }
  assert.ok(theme.nodes.some((node) => node.ref === 'theme.dark-mode.toggle.fence'), 'overlay adds the ThemeMode-local fence');
});

test('typed pathway instances carry semantic operands instead of reusing one shape instance', () => {
  const all = [...lens.chrome.flatMap((entry) => entry.elements), ...lens.screens.flatMap((screen) => screen.elements)];
  const byRef = (ref) => all.find((element) => element.ref === ref);
  const galleryElements = byRef('element.gallery.page.bottom-navigation.elements');
  const galleryGraph = byRef('element.gallery.page.bottom-navigation.app-graph');
  assert.notEqual(galleryElements.pathwayRef, galleryGraph.pathwayRef);
  assert.match(pathwayForElement(lens, galleryElements.ref).nodes[0].label, /ElementsPanel/);
  assert.match(pathwayForElement(lens, galleryGraph.ref).nodes[0].label, /AppGraphPanel/);
  const songs = byRef('element.vexstream-music.body.library-tabs.songs');
  const albums = byRef('element.vexstream-music.body.library-tabs.albums');
  assert.notEqual(songs.pathwayRef, albums.pathwayRef);
  assert.match(pathwayForElement(lens, songs.ref).nodes[0].label, /SongsPanel/);
  assert.match(pathwayForElement(lens, albums.ref).nodes[0].label, /AlbumsPanel/);
});

test('unproven localEffect controls remain visible but do not claim a generic typed pathway', () => {
  const screen = lens.screens.find((entry) => entry.screenRef === 'screen.vexstream-music');
  const addQueue = screen.elements.find((element) => element.ref === 'element.vexstream-music.body.track-actions.add-queue');
  assert.equal(addQueue.intent, 'localEffect()');
  assert.equal(addQueue.pathwayRef, null);
  assert.equal(lens.pathways.some((pathway) => pathway.disposition === 'TYPED_PRESENTATION' && pathway.nodes[0]?.label === 'localEffect()'), false);
  assert.ok(screenCoverage(lens, 'screen.vexstream-music').untraced.includes(addQueue.ref));
});

test('ThemeMode distinguishes Method Result reconciliation from independent Store source observation', () => {
  const theme = pathwayForElement(lens, 'element.debug-menu.body.dark-mode');
  assert.equal(theme.returnRef, 'theme.dark-mode.toggle.render');
  assert.ok(theme.nodes.some((node) => node.ref === 'theme.dark-mode.toggle.result' && node.role === 'RESULT'));
  assert.ok(theme.nodes.some((node) => node.ref === 'theme.dark-mode.toggle.method-observe' && node.symbol === 'observeThemeModeState' && node.role === 'REALIZATION'));
  assert.ok(theme.nodes.some((node) => node.ref === 'theme.dark-mode.toggle.observe' && node.role === 'OBSERVATION'));
  assert.equal(theme.edges.some((edge) => edge.from === 'theme.dark-mode.toggle.result' && edge.to === 'theme.dark-mode.toggle.observe'), false);
  assert.ok(theme.edges.some((edge) => edge.from === 'theme.dark-mode.toggle.method-observe' && edge.to === 'theme.dark-mode.toggle.state' && edge.kind === 'RETURN'));
  assert.ok(theme.edges.some((edge) => edge.from === 'theme.dark-mode.toggle.store' && edge.to === 'theme.dark-mode.toggle.observe' && edge.kind === 'DATA'));
});

test('VexStream Playback keeps realization, provider truth and observation as distinct roles', () => {
  const playback = pathwayForElement(lens, 'element.vexstream-music.body.player.play-pause');
  assert.ok(playback.nodes.some((node) => node.ref === 'vexstream.playback.play-pause.connection' && node.role === 'REALIZATION'));
  assert.ok(playback.nodes.some((node) => node.ref === 'vexstream.playback.play-pause.provider' && node.role === 'STORE'));
  assert.ok(playback.nodes.some((node) => node.ref === 'vexstream.playback.play-pause.observation' && node.role === 'OBSERVATION'));
});

test('Debug Menu controls are all traced', () => {
  const coverage = screenCoverage(lens, 'screen.debug-menu');
  assert.equal(coverage.untraced.length, 0);
  assert.ok(coverage.traced >= 14);
});

// [VXG RealForever][VEXWORK][VEXBOARD][SCREEN-LENS][GENERATED-TEST]
