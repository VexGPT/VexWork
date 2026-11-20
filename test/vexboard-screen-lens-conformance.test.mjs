import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import * as Expressions from '../src/shared/vexboard-screen-lens-source-expressions.mjs';
import * as Realization from '../src/shared/vexboard-screen-lens-realization.mjs';
import {
  LENS_ROLES,
  SCREEN_LENS_SCHEMA,
  aggregateContainedFaceGraph,
  containedPathways,
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


test('a mapped container projects the relationships contained inside it', () => {
  const vexstream = assertEmittedLensConformance(subjects[2][0], subjects[2][1]);
  const shellRef = 'vexstream.desktop.library.region.shell';
  const pathways = containedPathways(vexstream, shellRef);
  assert.equal(pathways.length, 7);
  assert.ok(pathways.some((pathway) => pathway.pathwayRef === 'pathway.vexstream.player.previous'));
  assert.ok(pathways.some((pathway) => pathway.pathwayRef === 'pathway.vexstream.playback.play-pause'));
  assert.ok(pathways.some((pathway) => pathway.pathwayRef === 'pathway.vexstream.phone.connection.open'));
  assert.ok(pathways.some((pathway) => pathway.pathwayRef === 'pathway.vexstream.system.status.open'));

  const behavior = aggregateContainedFaceGraph(vexstream, shellRef, 'BEHAVIOR');
  const depth = aggregateContainedFaceGraph(vexstream, shellRef, 'DEPTH');
  assert.equal(behavior.pathwayRefs.length, 7);
  assert.ok(behavior.nodes.length > 5, 'aggregate Behavior contains actual pathway nodes, not a screenshot placeholder');
  assert.ok(depth.nodes.length > 0, 'aggregate Depth exposes the contained runtime/provider relationships');
});

test('VexStream current default-visible projection carries the zero-blocker addressability census', () => {
  const vexstream = assertEmittedLensConformance(subjects[2][0], subjects[2][1]);
  const [screen] = vexstream.screens;
  assert.equal(screen.elements.length, 67, 'merged target source exports zero-blocker default-visible coverage plus admitted Library/Discover presentation structure');
  assert.equal(vexstream.pathways.length, 7, 'coverage completeness does not invent deeper semantic pathways');
  const refs = new Set(screen.elements.map((element) => element.ref));
  for (const ref of [
    'element.vexstream.shell.sidebar.toggle',
    'element.vexstream.library.rescan',
    'element.vexstream.library.search.query',
    'element.vexstream.library.search.execute',
    'element.vexstream.library.filter.genre',
    'element.vexstream.player.shuffle-library',
    'element.vexstream.discover.add.open',
    'element.vexstream.playback.timeline.seek',
    'element.vexstream.playback.volume.set',
    'element.vexstream.queue.drawer.toggle',
    'element.vexstream.queue.shuffle-upcoming',
  ]) assert.ok(refs.has(ref), ref + ' remains addressable');
});

test('VexStream bounded Library terrain is expressed through the shared selection grammar', () => {
  const vexstream = assertEmittedLensConformance(subjects[2][0], subjects[2][1]);
  const [screen] = vexstream.screens;
  const expressions = Expressions.expressionsFor(vexstream, screen.screenRef);
  const resolved = expressions.map((expression) => ({
    expression,
    presence: Realization.resolvePresence(vexstream, screen.screenRef, expression.context),
  }));
  const shellRef = 'presence.vexstream.shell.primary-terrain';
  const modeRef = 'presence.vexstream.library.mode';
  const HOME = 'vexstream.desktop.library.panel.home';
  const LIBRARY = 'vexstream.desktop.library.panel.library';
  const SONGS = 'vexstream.desktop.library.mode-state.songs';
  const ALBUMS = 'vexstream.desktop.library.mode-state.albums';
  const ARTISTS = 'vexstream.desktop.library.mode-state.artists';

  assert.equal(resolved[0].expression.ref, Expressions.SOURCE_EXPRESSION_REF);
  assert.equal(resolved[0].presence.presence.get(shellRef)?.value, HOME);

  const find = (shell, mode) => resolved.find(({ presence }) =>
    presence.presence.get(shellRef)?.value === shell &&
    presence.presence.get(modeRef)?.value === mode
  );
  assert.ok(find(LIBRARY, SONGS), 'Library / Songs alternate expression exists');
  assert.ok(find(LIBRARY, ALBUMS), 'Library / Albums alternate expression exists');
  assert.ok(find(LIBRARY, ARTISTS), 'Library / Artists alternate expression exists');
  assert.equal(screen.view?.scriptPolicy, 'NONE');
  const bindingPairs = new Set((screen.view?.stateBindings ?? []).map((binding) =>
    binding.presenceRef + '::' + binding.value
  ));
  for (const [presenceRef, value] of [
    [shellRef, HOME],
    [shellRef, LIBRARY],
    [modeRef, SONGS],
    [modeRef, ALBUMS],
    [modeRef, ARTISTS],
  ]) {
    assert.ok(bindingPairs.has(presenceRef + '::' + value), 'Library-required source-view consequence stays present: ' + value);
  }
  assert.equal(vexstream.pathways.length, 7, 'presentation expansion does not manufacture semantic pathways');
});

test('VexStream bounded Discover terrain is expressed through the same shared selection grammar', () => {
  const vexstream = assertEmittedLensConformance(subjects[2][0], subjects[2][1]);
  const [screen] = vexstream.screens;
  const expressions = Expressions.expressionsFor(vexstream, screen.screenRef);
  const resolved = expressions.map((expression) => ({
    expression,
    presence: Realization.resolvePresence(vexstream, screen.screenRef, expression.context),
  }));
  const shellRef = 'presence.vexstream.shell.primary-terrain';
  const discoverRef = 'presence.vexstream.discover.mode';
  const DISCOVER = 'vexstream.desktop.library.panel.discover';
  const PC = 'vexstream.desktop.library.discover-panel.pc';
  const YOUTUBE = 'vexstream.desktop.library.discover-panel.youtube';
  const EXPLORE = 'vexstream.desktop.library.discover-panel.explore';

  const find = (mode) => resolved.find(({ presence }) =>
    presence.presence.get(shellRef)?.value === DISCOVER &&
    presence.presence.get(discoverRef)?.value === mode
  );
  assert.ok(find(PC), 'Discover / This PC alternate expression exists');
  assert.ok(find(YOUTUBE), 'Discover / YouTube alternate expression exists');
  assert.ok(find(EXPLORE), 'Discover / Explore alternate expression exists');
  assert.equal(expressions.length, 7, 'Source + Library modes + Discover modes derive from the same generic expression engine');
  assert.equal(screen.view?.scriptPolicy, 'NONE');
  const discoverBindings = screen.view?.stateBindings?.filter((binding) =>
    binding.presenceRef === discoverRef
  ) ?? [];
  assert.equal(discoverBindings.length, 3);
  assert.equal(vexstream.pathways.length, 7, 'terrain expansion does not manufacture semantic pathways');
});

test('VexStream stable source controls remain addressable even when deeper pathways are held', () => {
  const vexstream = assertEmittedLensConformance(subjects[2][0], subjects[2][1]);
  const refs = new Set(vexstream.screens[0].elements.map((element) => element.ref));
  assert.ok(refs.has('element.vexstream.phone.connection.open'));
  assert.ok(refs.has('element.vexstream.system.status.open'));
  assert.ok(refs.has('element.vexstream.player.play-next'));
  assert.ok(refs.has('element.vexstream.system.exit'));
  assert.equal(
    vexstream.screens[0].elements.find((element) => element.ref === 'element.vexstream.player.play-next')?.pathwayRef,
    null,
    'a source-stable element may be addressable while its deeper pathway remains intentionally unprojected',
  );
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
