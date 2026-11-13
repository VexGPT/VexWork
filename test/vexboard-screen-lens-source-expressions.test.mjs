import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import * as X from '../src/shared/vexboard-screen-lens-source-expressions.mjs';
import * as R from '../src/shared/vexboard-screen-lens-realization.mjs';
import { LENS_ROLES, normalizeScreenLens } from '../src/shared/vexboard-screen-lens.mjs';

const committed = () => normalizeScreenLens(JSON.parse(fs.readFileSync(new URL('../projects/vexboard/lens/vexlife-android.screen-lens.json', import.meta.url), 'utf8')));
const lens = committed();
const STREAM = 'screen.vexstream-music';
const stream = X.expressionsFor(lens, STREAM);
const byWhat = (list, where, what) => list.find((expression) => expression.where === where && expression.what === what);

test('every screen has Source first, then its source-authored examples, then distinct relationship expressions', () => {
  for (const screen of lens.screens) {
    const list = X.expressionsFor(lens, screen.screenRef);
    assert.equal(list[0].ref, X.SOURCE_EXPRESSION_REF, `${screen.screenRef} starts at Source`);
    assert.deepEqual(list[0].context, R.emptyRealizationContext());
    const refs = list.map((expression) => expression.ref);
    assert.equal(new Set(refs).size, refs.length, `${screen.screenRef} has no duplicate expression`);
    const firstRelationship = list.findIndex((expression) => !['SOURCE', 'EXAMPLE'].includes(expression.kind));
    if (firstRelationship > 0) assert.ok(list.slice(firstRelationship).every((expression) => expression.kind !== 'EXAMPLE'), 'examples come before relationship expressions');
    for (const expression of list) {
      assert.ok(X.EXPRESSION_KINDS[expression.kind], expression.ref);
      assert.ok(Number.isInteger(expression.depth));
      // An alias is never also a primary expression.
      for (const alias of expression.also) assert.ok(!refs.includes(alias), `${alias} is an alias, not a second expression`);
    }
  }
});

test('expressions are identified by what they present: no two present the same thing', () => {
  const signature = (expression) => {
    const resolved = R.resolvePresence(lens, STREAM, expression.context);
    return [...resolved.elements.values()].map((entry) => entry.state).join() + [...resolved.presence.values()].map((outcome) => (outcome.gate === false ? '-' : outcome.value)).join();
  };
  const relationship = stream.filter((expression) => !['EXAMPLE'].includes(expression.kind));
  assert.equal(new Set(relationship.map(signature)).size, relationship.length);
});

test('a selection expression swaps the registered child and both sides read it: Surface context and Behavior graph', () => {
  const albums = byWhat(stream, 'Library', 'Albums');
  assert.equal(albums.kind, 'SELECTION');
  assert.deepEqual(albums.context.overrides, { 'presence.vexstream-music.body-library-selection': 'element.vexstream-music.body.library.albums' });
  assert.ok(albums.reveals.includes('element.vexstream-music.body.library.albums'));
  assert.ok(albums.hides.includes('element.vexstream-music.body.library.songs'), 'the default child steps aside');
  assert.equal(albums.focusRef, 'element.vexstream-music.body.library.albums');

  const graph = X.expressionGraph(lens, STREAM, albums);
  assert.equal(graph.disposition, 'EXPRESSION');
  const role = (label) => graph.nodes.find((node) => node.label === label)?.role;
  assert.equal(role('Albums'), 'ELEMENT', 'the tab that selects it');
  assert.equal(role('swapTo(container = LibraryContent, child = AlbumsPanel)'), 'INTENT');
  assert.equal(role('selected(LibraryContent) == AlbumsPanel'), 'STATE');
  assert.equal(graph.nodes.find((node) => node.role === 'CONTAINER').elementRef, 'element.vexstream-music.body.library.albums');
  assert.equal(graph.nodes.find((node) => node.face === 'DEPTH').label, 'VexStreamAlbumsPane');
  for (const node of graph.nodes) assert.ok(LENS_ROLES[node.role], `${node.role} is a lens role`);
  for (const edge of graph.edges) assert.ok(graph.nodes.some((node) => node.ref === edge.from) && graph.nodes.some((node) => node.ref === edge.to));
});

test('a nested expression carries the enclosing choices it needs, and variations follow their parent', () => {
  const queue = byWhat(stream, 'Full player content', 'Queue panel');
  assert.deepEqual(queue.context.overrides, {
    'presence.vexstream-music.body-player-sheet-open': 'OPEN',
    'presence.vexstream-music.body-player-sheet-content-selection': 'element.vexstream-music.body.queue.sheet',
  });
  const sheet = byWhat(stream, 'Full player sheet', 'open');
  assert.equal(queue.parentRef, sheet.ref);
  assert.ok(stream.indexOf(queue) > stream.indexOf(sheet));
  assert.equal(queue.depth, sheet.depth + 1);
  // The default child is implicit: it names where the expression lives without becoming an override.
  const songsRows = stream.find((expression) => expression.where === 'Songs' && expression.kind === 'POPULATION');
  assert.ok(songsRows.steps.some((step) => step.implicit && step.value === 'element.vexstream-music.body.library.songs'));
  assert.ok(!Object.values(songsRows.context.overrides).includes('element.vexstream-music.body.library.songs'));
});

test('a guard decided by feature data alone yields no expression', () => {
  assert.ok(!stream.some((expression) => expression.steps.some((step) => step.presenceRef === 'presence.vexstream-music.body-library-selection' && step.value === null)));
  assert.ok(!stream.some((expression) => /isLoading/.test(expression.what)));
});

test('populations: rows and declared empty content are expressions; the data chain is Depth, ending at the owner', () => {
  const events = X.expressionsFor(lens, 'screen.events');
  const rows = events.find((expression) => expression.kind === 'POPULATION' && expression.context.overrides['presence.events.body-population'] === 'ITEMS');
  const empty = events.find((expression) => expression.kind === 'POPULATION' && expression.context.overrides['presence.events.body-population'] === 'EMPTY');
  assert.ok(rows && empty, 'Events declares its empty content to the list');
  const graph = X.expressionGraph(lens, 'screen.events', rows);
  const depth = graph.nodes.filter((node) => node.face === 'DEPTH');
  assert.deepEqual(depth.filter((node) => node.role === 'PROJECTION').map((node) => node.label).slice(0, 2), ['displayedEvents', 'attention']);
  assert.equal(depth.find((node) => node.role === 'STORE').label, 'relay', 'the Relay the screen is handed is outside truth');
  assert.match(graph.nodes.find((node) => node.role === 'CONTAINER').label, /↻ EventRow/);
});

test('a presentation expression is reached through its openers; a preview expression through its own setup and fixture', () => {
  const debug = X.expressionsFor(lens, 'screen.debug-menu');
  const open = debug.find((expression) => expression.kind === 'PRESENTATION');
  const graph = X.expressionGraph(lens, 'screen.debug-menu', open);
  assert.ok(graph.nodes.some((node) => node.role === 'ELEMENT' && node.elementRef === 'element.debug-menu.body.log-history.actions.show'));
  assert.ok(graph.nodes.some((node) => node.role === 'INTENT' && node.label === 'open(LogSheet)'));
  const preview = debug.find((expression) => expression.exampleRef === 'preview:debug-history-open');
  assert.deepEqual(preview.reveals, open.reveals, 'the preview and the relationship present the same sheet');
  const previewGraph = X.expressionGraph(lens, 'screen.debug-menu', preview);
  assert.ok(previewGraph.nodes.some((node) => node.role === 'CONSTRUCTION' && node.label === 'debugHistoryPreviewFixture()'));
  assert.ok(previewGraph.nodes.some((node) => node.role === 'NAVIGATION' && /open/.test(node.label)));
  assert.equal(X.expressionExposing(debug, 'element.debug-menu.log-history.sheet').ref, open.ref, 'a relationship expression is preferred over an example');
});

test('the typed intent of a control finds the expression it brings about; a source default is Source itself', () => {
  const find = (ref) => X.expressionForControl(lens, STREAM, stream, `element.vexstream-music.${ref}`)?.ref;
  assert.equal(find('body.library-tabs.songs'), X.SOURCE_EXPRESSION_REF);
  assert.equal(find('body.library-tabs.albums'), byWhat(stream, 'Library', 'Albums').ref);
  assert.equal(find('body.player.queue.show'), byWhat(stream, 'Full player content', 'Queue panel').ref, 'swapTo(...).then(open(...)) needs both steps');
  assert.equal(find('body.connection.forget.request'), byWhat(stream, 'Forget confirmation', 'open').ref);
  assert.equal(X.expressionForControl(lens, STREAM, stream, 'element.vexstream-music.body.library'), null, 'no intent, no expression');
  // A per-item action is exposed where its population has rows, closest to Source.
  const exposing = X.expressionExposing(stream, 'element.vexstream-music.body.track-actions.menu');
  assert.equal(exposing.where, 'Songs');
});

test('a hand-set context is a custom expression, read the same way by both sides', () => {
  const context = R.withOverride(R.withOverride(R.emptyRealizationContext(), 'presence.vexstream-music.body-player-sheet-open', 'OPEN'), 'presence.vexstream-music.body-library-selection', 'element.vexstream-music.body.library.albums');
  assert.equal(X.expressionMatching(stream, context), null);
  const custom = X.customExpression(lens, STREAM, context);
  assert.equal(custom.kind, 'CUSTOM');
  assert.equal(custom.steps.length, 2);
  assert.ok(custom.reveals.includes('element.vexstream-music.body.library.albums') && custom.reveals.includes('element.vexstream-music.body.player.sheet'));
  const graph = X.expressionGraph(lens, STREAM, custom);
  assert.ok(graph.nodes.some((node) => node.label === 'selected(LibraryContent) == AlbumsPanel'));
  assert.ok(graph.nodes.some((node) => node.role === 'CONTAINER' && node.elementRef === 'element.vexstream-music.body.player.sheet'));
  const closed = X.customExpression(lens, STREAM, R.withOverride(R.emptyRealizationContext(), 'presence.vexstream-music.body-player-sheet-open', 'CLOSED'));
  assert.equal(closed.steps.length, 0, 'closing what is closed by default reaches nothing new');
  assert.equal(X.expressionMatching(stream, byWhat(stream, 'Library', 'Albums').context).ref, byWhat(stream, 'Library', 'Albums').ref);
});

test('Source Depth consumes preserved realization topology and keeps only the relevant ancestor closure', () => {
  const input = JSON.parse(fs.readFileSync(new URL('../projects/vexboard/lens/vexlife-android.screen-lens.json', import.meta.url), 'utf8'));
  const raw = input.screens.find((screen) => screen.screenRef === STREAM).realization;
  assert.ok(raw.realizers.includes('VexStreamMusicScreenContent'));
  assert.ok(raw.realizers.includes('VexStreamLibrarySurface'));
  const target = raw.presence.find((entry) => entry.realizedBy && !['VexStreamMusicScreenContent', 'VexStreamLibrarySurface'].includes(entry.realizedBy))?.realizedBy;
  assert.ok(target, 'fixture needs one source-earned nested realizer below the library surface');
  const relationshipRealizers = new Set([
    raw.entry.symbol,
    ...raw.presence.flatMap((entry) => [entry.realizedBy, ...(entry.choices ?? []).map((choice) => choice.realizedBy)]),
    ...raw.templates.map((template) => template.symbol),
    ...raw.elements.flatMap((entry) => entry.realizedBy ?? []),
  ].filter(Boolean));
  const irrelevant = raw.realizers.find((symbol) => !relationshipRealizers.has(symbol));
  assert.ok(irrelevant, 'fixture needs one traversed composable that owns no projected realization relationship');
  raw.callEdges = [
    { caller: 'VexStreamMusicScreenContent', callee: 'VexStreamLibrarySurface', callerSource: raw.entry.source, calleeSource: raw.entry.source },
    { caller: 'VexStreamLibrarySurface', callee: target, callerSource: raw.entry.source, calleeSource: raw.entry.source },
    { caller: 'VexStreamMusicScreenContent', callee: irrelevant, callerSource: raw.entry.source, calleeSource: raw.entry.source },
  ];
  const projected = normalizeScreenLens(input);
  const expressions = X.expressionsFor(projected, STREAM);
  const graph = X.expressionGraph(projected, STREAM, expressions[0]);
  assert.ok(graph.nodes.some((node) => node.face === 'DEPTH' && node.label === 'VexStreamMusicScreenContent'));
  assert.ok(graph.nodes.some((node) => node.face === 'DEPTH' && node.label === 'VexStreamLibrarySurface'));
  assert.ok(graph.nodes.some((node) => node.face === 'DEPTH' && node.label === target));
  assert.ok(!graph.nodes.some((node) => node.face === 'DEPTH' && node.label === irrelevant), 'unrelated traversed calls stay out of Source Depth');
  assert.ok(graph.edges.some((edge) => edge.label === 'calls' && graph.nodes.find((node) => node.ref === edge.from)?.label === 'VexStreamMusicScreenContent' && graph.nodes.find((node) => node.ref === edge.to)?.label === 'VexStreamLibrarySurface'));
});

test('realization call topology fails closed when an edge names an unknown realizer', () => {
  const input = JSON.parse(fs.readFileSync(new URL('../projects/vexboard/lens/vexlife-android.screen-lens.json', import.meta.url), 'utf8'));
  const raw = input.screens.find((screen) => screen.screenRef === STREAM).realization;
  raw.callEdges = [{ caller: 'VexStreamMusicScreenContent', callee: 'NotARealizer' }];
  assert.throws(() => normalizeScreenLens(input), /call edge callee NotARealizer is not a realizer/);
});

test('Source graph: each top-level relationship with its default; a golden keeps its accepted render as evidence', () => {
  const graph = X.expressionGraph(lens, 'screen.debug-menu', X.expressionsFor(lens, 'screen.debug-menu')[0]);
  assert.ok(graph.nodes.some((node) => node.role === 'STATE' && node.label === 'Log sheet closed'));
  const sourceStream = X.expressionGraph(lens, STREAM, stream[0]);
  assert.ok(sourceStream.nodes.some((node) => node.label === 'Library shows Songs'));
  assert.ok(sourceStream.nodes.some((node) => /feature-owned relationships decide/.test(node.label)), 'conditions VexBoard does not evaluate are grouped');
  assert.ok(graph.nodes.some((node) => node.face === 'DEPTH' && node.role === 'REALIZATION' && node.label === 'DebugMenuScreenContent'));
  const golden = stream.find((expression) => expression.exampleRef === 'golden:vexstream.library.songs');
  assert.equal(golden.evidence.length, 1);
  const goldenGraph = X.expressionGraph(lens, STREAM, golden);
  assert.ok(goldenGraph.nodes.some((node) => node.role === 'PROJECTION' && /expected, not an observed device run/.test(node.summary)));
  assert.equal(X.expressionGraph(lens, STREAM, null), null);
});

test('Maps keeps its native map opaque: no expression reveals inside the boundary', () => {
  const maps = X.expressionsFor(lens, 'screen.vex-maps');
  assert.ok(maps.length > 1, 'the planner and offline panel still have expressions');
  const opaque = R.realizationOf(lens, 'screen.vex-maps').opaque.map((entry) => entry.symbol);
  assert.ok(opaque.includes('AndroidView'));
  for (const expression of maps) assert.ok(!expression.reveals.some((ref) => /maplibre|android-view/i.test(ref)));
});

test('expressions stay effect-free: no storage, network or clock (product nouns: see the realization law test)', () => {
  const text = fs.readFileSync(new URL('../src/shared/vexboard-screen-lens-source-expressions.mjs', import.meta.url), 'utf8');
  assert.doesNotMatch(text, /localStorage|sessionStorage|fetch\(|Date\.now/);
});

test('an if with no else can also not hold: that state is an expression, phrased as the negation', () => {
  const paired = byWhat(stream, 'Connection', 'if state.connectionState is VexStreamConnectionState.Paired');
  assert.ok(paired, 'the connected state is reachable');
  assert.deepEqual(paired.context.overrides, { 'presence.vexstream-music.vex-stream-library-surface-branch-2': R.NONE_CHOICE });
  const resolved = R.resolvePresence(lens, STREAM, paired.context);
  assert.equal(resolved.elements.get('element.vexstream-music.body.connection').state, 'LATENT');
  assert.equal(resolved.presence.get('presence.vexstream-music.vex-stream-library-surface-branch-2').value, R.NONE_CHOICE);
  // An exhaustive relationship has no such state.
  const cases = R.resolvePresence(lens, STREAM, R.withOverride(R.emptyRealizationContext(), 'presence.vexstream-music.body-connection-cases', R.NONE_CHOICE));
  assert.notEqual(cases.presence.get('presence.vexstream-music.body-connection-cases').value, R.NONE_CHOICE);
  const graph = X.expressionGraph(lens, STREAM, paired);
  assert.ok(graph.nodes.some((node) => /^nothing of \d+ registered element/.test(node.label)));
  for (const [condition, negated] of [['a !is B', 'a is B'], ['x.isNotEmpty()', 'x.isEmpty()'], ['a != null', 'a == null'], ['flag', '!flag'], ['!flag', 'flag'], ['a && b', 'not (a && b)'], ['', 'otherwise']]) {
    assert.equal(X.negateCondition(condition), negated);
  }
});

test('a list with no registered identity is drawn inside its nearest registered element', () => {
  const at = (ref) => R.populationsAt(lens, STREAM, ref).map((entry) => [entry.presence.ref.replace('presence.vexstream-music.', ''), entry.placement]);
  assert.deepEqual(at('element.vexstream-music.body.library.albums'), [['body-library-albums-population', 'WITHIN'], ['body-library-albums-population-2', 'WITHIN']]);
  assert.deepEqual(at('element.vexstream-music.body.library.songs'), [['vex-stream-songs-pane-population', 'REALIZER_BY_ELIMINATION']]);
});

// [VXG RealForever][VEXWORK][VEXBOARD][SCREEN-LENS][EXPRESSIONS-TEST]