import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import * as Expressions from '../src/shared/vexboard-screen-lens-source-expressions.mjs';
import * as Realization from '../src/shared/vexboard-screen-lens-realization.mjs';
import {
  LENS_ROLES,
  SCREEN_LENS_SCHEMA,
  normalizeScreenLens,
} from '../src/shared/vexboard-screen-lens.mjs';
import { frameGeometry } from '../src/shared/vexboard-screen-lens-frames.mjs';

const read = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url), 'utf8'));

const subjects = [
  ['VexLife Android Main', read('../projects/vexboard/lens/vexlife-android.main.screen-lens.json')],
  ['VexLife Prod accepted/current projection', read('../projects/vexboard/lens/vexlife-prod.screen-lens.json')],
  ['VexStream Music candidate', read('../projects/vexboard/lens/vexstream-music.candidate.screen-lens.json')],
  ['neutral framed element-tree subject', read('./fixtures/screen-lens/neutral-framed-element-tree.screen-lens.json')],
];

function assertEmittedLensConformance(label, raw) {
  const lens = normalizeScreenLens(raw);
  assert.equal(lens.schemaVersion, SCREEN_LENS_SCHEMA, label + ' uses the shared schema');
  assert.ok(lens.screens.length > 0, label + ' has at least one Screen');
  assert.ok(Object.isFrozen(lens), label + ' normalizes into an immutable consumer value');

  for (const screen of lens.screens) {
    const expressions = Expressions.expressionsFor(lens, screen.screenRef);
    assert.ok(expressions.length > 0, label + ' / ' + screen.screenRef + ' has an expression set');
    assert.equal(expressions[0].ref, Expressions.SOURCE_EXPRESSION_REF, label + ' / ' + screen.screenRef + ' starts from Source defaults');

    const expressionRefs = expressions.map((expression) => expression.ref);
    assert.equal(new Set(expressionRefs).size, expressionRefs.length, label + ' / ' + screen.screenRef + ' expression refs are unique');

    for (const expression of expressions) {
      assert.ok(Expressions.EXPRESSION_KINDS[expression.kind], label + ' / ' + expression.ref + ' uses a known expression kind');
      assert.ok(Number.isInteger(expression.depth), label + ' / ' + expression.ref + ' has bounded expression depth');

      const resolved = Realization.resolvePresence(lens, screen.screenRef, expression.context);
      assert.equal(resolved.screenRef, screen.screenRef);
      assert.equal(resolved.elements.size, screen.elements.length, label + ' / ' + expression.ref + ' resolves every registered screen element');

      const graph = Expressions.expressionGraph(lens, screen.screenRef, expression);
      if (!graph) continue;
      const nodeRefs = new Set(graph.nodes.map((node) => node.ref));
      for (const node of graph.nodes) assert.ok(LENS_ROLES[node.role], label + ' / ' + graph.pathwayRef + ' uses shared role ' + node.role);
      for (const edge of graph.edges) {
        assert.ok(nodeRefs.has(edge.from), label + ' / ' + graph.pathwayRef + ' edge source exists');
        assert.ok(nodeRefs.has(edge.to), label + ' / ' + graph.pathwayRef + ' edge target exists');
      }
    }

    if (screen.layout) {
      assert.equal(screen.layout.kind, 'FRAME', label + ' / ' + screen.screenRef + ' uses the admitted frame topology');
      for (const frame of screen.layout.frames) {
        const geometry = frameGeometry(frame);
        assert.equal(geometry.regions.length, frame.regions.length, label + ' / ' + frame.ref + ' resolves all authored regions');
        assert.equal(geometry.seams.length, frame.seams.length, label + ' / ' + frame.ref + ' resolves all authored seams');
      }
    }

    if (screen.view) {
      assert.equal(screen.view.kind, 'STATIC_HTML_CSS', label + ' / ' + screen.screenRef + ' uses the admitted source-view substrate');
      assert.equal(screen.view.scriptPolicy, 'NONE', label + ' / ' + screen.screenRef + ' keeps Product JavaScript outside the Lens');
    }
  }

  return lens;
}

for (const [label, raw] of subjects) {
  test(label + ' emitted payload conforms through the same Screen Lens consumer seam', () => {
    assertEmittedLensConformance(label, raw);
  });
}

test('the two real products may differ in manifestation while sharing the same conformance proof', () => {
  const android = assertEmittedLensConformance(subjects[0][0], subjects[0][1]);
  const product = assertEmittedLensConformance(subjects[1][0], subjects[1][1]);

  assert.ok(android.screens.some((screen) => screen.view === null && screen.layout === null), 'Android includes compact element-tree Screens');
  assert.ok(product.screens.some((screen) => screen.view?.kind === 'STATIC_HTML_CSS'), 'Product carries a source-owned static view');
  assert.ok(product.screens.some((screen) => screen.layout?.kind === 'FRAME'), 'Product carries authored frame topology');
});

test('a neutral FRAME workspace does not imply VexLife-Prod or STATIC_HTML_CSS', () => {
  const neutral = assertEmittedLensConformance(subjects[3][0], subjects[3][1]);
  const [screen] = neutral.screens;

  assert.equal(neutral.lensRef, 'lens.neutral-framed-element-tree');
  assert.equal(screen.layout.kind, 'FRAME');
  assert.equal(screen.view, null, 'the neutral workspace is rendered from Lens elements rather than a Product source view');

  const geometry = frameGeometry(screen.layout.frames[0]);
  assert.deepEqual(
    geometry.regions.map((region) => [region.left, region.right]),
    [[0, 0.5], [0.5, 1]],
    'authored 1:1 allocation produces two persistent regions without Product identity',
  );

  const expressions = Expressions.expressionsFor(neutral, screen.screenRef);
  const opened = expressions.find((expression) => expression.kind === 'PRESENTATION');
  assert.ok(opened, 'the same generic presence/expression grammar can open content inside the neutral workspace');
  assert.ok(opened.reveals.includes('element.neutral-workspace.secondary.panel'));
});


test('VexStream proves a third real SOURCE_VIEW producer without a reader fork', () => {
  const vexstream = assertEmittedLensConformance(subjects[2][0], subjects[2][1]);
  const [screen] = vexstream.screens;

  assert.equal(vexstream.lensRef, 'lens.vexstream-music.desktop');
  assert.equal(screen.screenRef, 'vexstream.desktop.library');
  assert.equal(screen.view?.kind, 'STATIC_HTML_CSS');
  assert.equal(screen.layout?.kind, 'FRAME');
  assert.ok(screen.elements.some((element) => element.ref === 'element.vexstream.player.previous'));
  assert.equal(
    vexstream.pathways.find((pathway) => pathway.pathwayRef === 'pathway.vexstream.player.previous')?.disposition,
    'DIRECT_REGISTRATION',
    'Player composition remains distinct from Queue Family ownership',
  );
  assert.equal(
    vexstream.pathways.find((pathway) => pathway.pathwayRef === 'pathway.vexstream.playback.play-pause')?.disposition,
    'SCAE_FAMILY',
  );
});

// [VXG RealForever][VEXWORK][VEXBOARD][PROJECTION-CONSOLIDATION][CONFORMANCE]
