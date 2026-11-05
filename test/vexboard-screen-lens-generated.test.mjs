import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { normalizeScreenLens, pathwayForElement, screenGraph } from '../src/shared/vexboard-screen-lens.mjs';
import { screenCoverage } from '../src/shared/vexboard-screen-lens-query.mjs';

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
  assert.match(raw.provenance.sourceCommit, /^[0-9a-f]{40}$/);
  assert.equal(raw.provenance.sourceCommit, lens.sourceSnapshot.commit);
  assert.match(lens.sourceSnapshot.notes[0], /Regenerate it; do not edit by hand/);
});

test('generated related boards are stable VexBoard identities', () => {
  assert.deepEqual(lens.relatedBoardRefs, [
    'board.vexlife.debug-menu.theme-mode.origin-walk',
    'board.vexlife-prod.perceivability-alignment',
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
  for (const role of ['CONTROL', 'STATE', 'ACT', 'EFFECT', 'PROJECTION', 'METHOD', 'EXECUTION', 'STORE', 'OBSERVATION']) {
    assert.ok(theme.nodes.some((node) => node.role === role), role);
  }
  assert.ok(theme.nodes.some((node) => node.ref === 'theme.dark-mode.toggle.fence'), 'overlay adds the ThemeMode-local fence');
});

test('Debug Menu controls are all traced', () => {
  const coverage = screenCoverage(lens, 'screen.debug-menu');
  assert.equal(coverage.untraced.length, 0);
  assert.ok(coverage.traced >= 14);
});

// [VXG RealForever][VEXWORK][VEXBOARD][SCREEN-LENS][GENERATED-TEST]
