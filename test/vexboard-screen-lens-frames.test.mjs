import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { normalizeScreenLens } from '../src/shared/vexboard-screen-lens.mjs';
import { frameGeometry, layoutRole, normalizeScreenLayout } from '../src/shared/vexboard-screen-lens-frames.mjs';

const read = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url), 'utf8'));
// Exported by the composed VexLife-Prod R2 candidate (#387); refreshed from the exact Product-owned export.
const workspace = read('./fixtures/screen-lens/vexlife-prod.browser-workspace.screen-lens.json');

const FRAME = 'vexweb.vexlife-workspace.p1.frame';
const BODY = 'vexweb.vexlife-workspace.p1.body.frame';
const HEADER_SEAM = 'vexweb.vexlife-workspace.p1.seam.header-body';
const BODY_SEAM = 'vexweb.vexlife-workspace.p1.body.seam.browser-companion';
const HANDLE = `${BODY_SEAM}.handle`;

test('a Product-exported browser workspace normalizes into frames, seams, regions, chrome and overlays', () => {
  const lens = normalizeScreenLens(workspace);
  const [screen] = lens.screens;
  assert.equal(screen.layout.kind, 'FRAME');
  assert.equal(screen.layout.root, FRAME);
  assert.deepEqual(screen.layout.frames.map((frame) => frame.ref), [FRAME, BODY]);
  assert.deepEqual(screen.layout.overlays, ['vexweb.vexlife-workspace.p1.overlay']);
  const byRef = new Map(screen.elements.map((element) => [element.ref, element]));
  assert.equal(byRef.get(FRAME).kind, 'FRAME');
  assert.equal(byRef.get(HEADER_SEAM).kind, 'SEAM');
  assert.equal(byRef.get(HANDLE).kind, 'HANDLE');
  assert.equal(byRef.get(HANDLE).role, 'ELEMENT');
  assert.deepEqual(byRef.get(HANDLE).interactions, ['RESIZE', 'COLLAPSE_BEFORE', 'COLLAPSE_AFTER']);
  assert.equal(byRef.get('vexweb.vexlife-workspace.p1.overlay.snackbar').layer, 'TRANSIENT');
  // The semantic pathways are untouched by the spatial export.
  assert.equal(byRef.get('element.vexlife-workspace.companion.conversation.send').pathwayRef, 'pathway.vexlife-prod.conversation.send');
  assert.equal(byRef.get('element.vexlife-workspace.companion.vision').pathwayRef, 'pathway.vexlife-prod.vision.selected-scope');
  assert.equal(byRef.get('element.vexlife-workspace.companion.private-mode').pathwayRef, 'pathway.vexlife-prod.conversation.private');
  assert.equal(lens.pathways.find((pathway) => pathway.pathwayRef === byRef.get(HANDLE).pathwayRef).disposition, 'TYPED_PRESENTATION');
});

test('geometry comes from the authored allocations: a 1:11 header band over a 1:1 Browser and Companion', () => {
  const [screen] = normalizeScreenLens(workspace).screens;
  const [outer, body] = screen.layout.frames.map(frameGeometry);
  const header = outer.regions.find((region) => region.ref.endsWith('region.header'));
  assert.equal(header.top, 0);
  assert.equal(header.bottom, 1 / 12);
  assert.deepEqual(outer.seams.map((seam) => [seam.axis, seam.at]), [['HORIZONTAL', 1 / 12]]);
  const browser = body.regions.find((region) => region.ref.endsWith('region.browser'));
  const companion = body.regions.find((region) => region.ref.endsWith('region.companion'));
  assert.deepEqual([browser.left, browser.right, companion.left, companion.right], [0, 0.5, 0.5, 1]);
  assert.deepEqual(body.chrome, [{ ref: HANDLE, seamRef: BODY_SEAM, at: 0.5 }]);
  assert.equal(layoutRole(screen.layout, BODY_SEAM).role, 'SEAM');
  assert.equal(layoutRole(screen.layout, HANDLE).chrome.seamRef, BODY_SEAM);
  assert.equal(layoutRole(screen.layout, 'vexweb.vexlife-workspace.p1.overlay').role, 'OVERLAY');
  assert.equal(layoutRole(screen.layout, 'element.vexlife-workspace.companion.conversation.send'), null);
});

test('a lens without a layout keeps the phone realization (Android, and Product commits before the export)', () => {
  for (const file of ['vexlife-android.screen-lens.json', 'vexlife-prod.screen-lens.json', 'vexlife-prod.main.screen-lens.json']) {
    const lens = normalizeScreenLens(read(`../projects/vexboard/lens/${file}`));
    assert.ok(lens.screens.every((screen) => screen.layout === null), file);
  }
});

const element = (ref, kind, parentRef = null) => ({ ref, kind, label: ref, parentRef });
const elements = [
  element('f', 'FRAME'),
  element('s1', 'SEAM', 'f'),
  element('s2', 'SEAM', 'f'),
  element('a', 'REGION', 'f'),
  element('b', 'REGION', 'f'),
  element('c', 'REGION', 'f'),
  element('g', 'FRAME'),
  element('gs', 'SEAM', 'g'),
  element('ga', 'REGION', 'g'),
  element('o', 'REGION'),
];
const nested = {
  kind: 'FRAME',
  root: 'f',
  frames: [{
    ref: 'f',
    seams: [
      { ref: 's1', axis: 'VERTICAL', between: ['FRAME_START', 'FRAME_END'], span: ['FRAME_TOP', 'FRAME_BOTTOM'], allocation: { before: 1, after: 1 } },
      { ref: 's2', axis: 'VERTICAL', between: ['s1', 'FRAME_END'], span: ['FRAME_TOP', 'FRAME_BOTTOM'], allocation: { before: 1, after: 1 } },
    ],
    regions: [
      { ref: 'a', start: 'FRAME_START', end: 's1', top: 'FRAME_TOP', bottom: 'FRAME_BOTTOM' },
      { ref: 'b', start: 's1', end: 's2', top: 'FRAME_TOP', bottom: 'FRAME_BOTTOM' },
      { ref: 'c', start: 's2', end: 'FRAME_END', top: 'FRAME_TOP', bottom: 'FRAME_BOTTOM' },
    ],
    chrome: [],
  }],
  overlays: ['o'],
};

test('seams bounded by other seams resolve through them', () => {
  const layout = normalizeScreenLayout(nested, { screenRef: 'screen.x', elements });
  const geometry = frameGeometry(layout.frames[0]);
  assert.deepEqual(geometry.seams.map((seam) => seam.at), [0.5, 0.75]);
  assert.deepEqual(geometry.regions.map((region) => [region.left, region.right]), [[0, 0.5], [0.5, 0.75], [0.75, 1]]);
});

test('the layout fails closed on anything its elements do not say', () => {
  const at = (mutate) => () => {
    const copy = structuredClone(nested);
    mutate(copy);
    normalizeScreenLayout(copy, { screenRef: 'screen.x', elements });
  };
  assert.throws(at((copy) => { copy.kind = 'GRID'; }), /layout kind GRID is unknown/);
  assert.throws(at((copy) => { copy.root = 'a'; }), /root a is not one of its frames/);
  assert.throws(at((copy) => { copy.frames[0].ref = 'a'; }), /frame a is a REGION, not FRAME/);
  assert.throws(at((copy) => { copy.frames[0].seams[0].ref = 'gs'; }), /seam gs is not inside frame f/);
  assert.throws(at((copy) => { copy.frames[0].regions[0].top = 's1'; }), /region a top s1 is neither frame f's edge nor one of its horizontal seams/);
  assert.throws(at((copy) => { copy.frames[0].regions[0].end = 'gs'; }), /region a end gs is neither/);
  assert.throws(at((copy) => { copy.frames[0].regions[0].ref = 'ga'; }), /region ga is not inside frame f/);
  assert.throws(at((copy) => { copy.frames[0].seams[0].allocation.before = 0; }), /allocation before must be a positive integer/);
  assert.throws(at((copy) => { copy.frames[0].seams[0].axis = 'DIAGONAL'; }), /axis DIAGONAL is unknown/);
  assert.throws(at((copy) => { copy.overlays = ['missing']; }), /overlay missing is not an element/);
  assert.throws(at((copy) => { copy.frames[0].chrome = [{ ref: 'o', seamRef: null }]; }), /chrome o is not inside frame f/);
  assert.throws(at((copy) => { copy.frames[0].regions = []; }), /frame f has no region/);
  const cyclic = structuredClone(nested);
  cyclic.frames[0].seams[0].between = ['s2', 'FRAME_END'];
  const layout = normalizeScreenLayout(cyclic, { screenRef: 'screen.x', elements });
  assert.throws(() => frameGeometry(layout.frames[0]), /seams bound each other in a cycle/);
});

test('element layer and interactions are optional and validated', () => {
  const base = read('../projects/vexboard/lens/vexlife-prod.screen-lens.json');
  const withLayer = structuredClone(base);
  withLayer.screens[0].elements[0].layer = 'SIDEWAYS';
  assert.throws(() => normalizeScreenLens(withLayer), /layer SIDEWAYS is unknown/);
  const withInteraction = structuredClone(base);
  withInteraction.screens[0].elements[0].interactions = ['TELEPORT'];
  assert.throws(() => normalizeScreenLens(withInteraction), /interaction TELEPORT is unknown/);
  const plain = normalizeScreenLens(base).screens[0].elements[0];
  assert.equal(plain.layer, null);
  assert.deepEqual(plain.interactions, []);
});
