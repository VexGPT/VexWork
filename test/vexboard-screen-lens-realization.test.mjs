import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import * as R from '../src/shared/vexboard-screen-lens-realization.mjs';
import { normalizeScreenLens } from '../src/shared/vexboard-screen-lens.mjs';

const base = () => ({
  schemaVersion: 'vexboard.screen-lens/v1',
  lensRef: 'lens.test.realization',
  title: 'Realization',
  sourceSnapshot: { repositoryUrl: 'https://github.com/owner/repo', commit: 'a'.repeat(40) },
  chrome: [],
  screens: [{
    screenRef: 'screen.s',
    label: 'S',
    placement: 'SHARED',
    mapped: 'MAPPED',
    elements: [
      { ref: 'element.s.body', kind: 'COLUMN', label: 'Body' },
      { ref: 'element.s.body.content', kind: 'REGION', label: 'Content', parentRef: 'element.s.body', symbol: 'S.Content' },
      { ref: 'element.s.body.a', kind: 'COLUMN', label: 'A', parentRef: 'element.s.body.content', symbol: 'S.A' },
      { ref: 'element.s.body.b', kind: 'COLUMN', label: 'B', parentRef: 'element.s.body.content', symbol: 'S.B' },
      { ref: 'element.s.body.open', kind: 'BUTTON', label: 'Open', parentRef: 'element.s.body', symbol: 'S.Open', intent: 'open(Sheet)' },
      { ref: 'element.s.body.sheet', kind: 'SHEET', label: 'Sheet', parentRef: 'element.s.body', symbol: 'S.Sheet' },
      { ref: 'element.s.body.sheet.close', kind: 'BUTTON', label: 'Close', parentRef: 'element.s.body.sheet', symbol: 'S.Close' },
      { ref: 'element.s.body.flag', kind: 'TEXT', label: 'Flag', parentRef: 'element.s.body' },
      { ref: 'element.s.body.bucket', kind: 'COLUMN', label: 'Bucket', parentRef: 'element.s.body' },
      { ref: 'element.s.body.bucket.act', kind: 'BUTTON', label: 'Act', parentRef: 'element.s.body.bucket' },
      { ref: 'element.s.body.nowhere', kind: 'BUTTON', label: 'Nowhere', parentRef: 'element.s.body' },
    ],
    realization: {
      status: 'PARTIAL',
      entry: { symbol: 'SContent', source: 'app:S.kt' },
      presence: [
        { ref: 'presence.s.sheet-open', kind: 'PRESENTATION', subjectRef: 'element.s.body.sheet', owner: 'runtime.presentation', condition: 'runtime.presentation.isOpen(S.Sheet)', realizes: ['element.s.body.sheet.close'] },
        { ref: 'presence.s.content-selection', kind: 'SELECTION', subjectRef: 'element.s.body.content', owner: 'runtime.presentation', defaultRef: 'element.s.body.a', choices: [
          { condition: 'loading', kind: 'GUARD', realizedBy: 'Spinner', realizes: [] },
          { condition: 'selected == S.B', kind: 'SELECTION', targetRef: 'element.s.body.b', realizedBy: 'BPane', realizes: ['element.s.body.b'] },
          { condition: 'else', kind: 'OTHERWISE', realizedBy: 'APane', realizes: [] },
        ] },
        { ref: 'presence.s.flag-branch', kind: 'BRANCH', subjectRef: 'element.s.body.flag', owner: 'feature', choices: [{ condition: 'state.flag', realizes: ['element.s.body.flag'] }] },
        { ref: 'presence.s.list-population', kind: 'POPULATION', subjectRef: null, owner: 'items', realizedBy: 'APane', list: { ref: null, expression: null, identity: 'NONE' }, items: 'entries', provenance: [{ symbol: 'entries', expression: 'entries: List<Entry>', via: 'parameter' }], templateRef: 'template.s.card', empty: [], emptyRealization: 'NONE', held: 'raw lazy list without stable list identity' },
      ],
      templates: [{ ref: 'template.s.card', symbol: 'Card', usedBy: ['presence.s.list-population'], realizes: ['element.s.body.bucket.act'], slots: [{ path: 'title', kind: 'TEXT', depth: 0 }, { kind: 'BUTTON', primitive: 'RowItem', realizes: 'element.s.body.bucket.act', depth: 0 }] }],
      elements: [{ ref: 'element.s.body.bucket.act', presenceRefs: [], conditionRefs: [], realizedBy: ['RowItem'], realizedIn: ['template.s.card'] }],
      opaque: [{ symbol: 'AndroidView', source: 'app:S.kt', reason: 'native view boundary' }],
      held: [{ reason: 'raw lazy list without stable list identity', source: 'app:S.kt', symbol: 'APane' }],
    },
  }],
  pathways: [],
  examples: [
    { ref: 'preview:s-open', kind: 'PREVIEW', subjectRef: 'screen.s', setup: [{ op: 'OPEN', targetRef: 'element.s.body.sheet' }, { op: 'SELECT', containerRef: 'element.s.body.content', targetRef: 'element.s.body.b' }], fixture: { expression: '{ fixture() }', functions: ['fixture'] }, related: [{ ref: 'golden:s.case', via: ['fixture'] }] },
    { ref: 'golden:s.case', kind: 'GOLDEN', subjectRef: null, subjectHeld: 'foreign root', evidence: [{ kind: 'GOLDEN_REFERENCE', path: 'ref/a b.png' }], related: [{ ref: 'preview:s-open', via: ['fixture'] }] },
  ],
});

test('normalization carries realization and examples, and fails closed on dangling refs and unknown kinds', () => {
  const lens = normalizeScreenLens(base());
  assert.equal(lens.screens[0].realization.presence.length, 4);
  assert.equal(lens.examples.length, 2);

  const unknownKind = base();
  unknownKind.screens[0].realization.presence[0].kind = 'VISIBLE_WHEN';
  assert.throws(() => normalizeScreenLens(unknownKind), /kind VISIBLE_WHEN is unknown/, 'one Boolean visibleWhen is not a presence kind');

  const dangling = base();
  dangling.screens[0].realization.presence[0].subjectRef = 'element.s.nope';
  assert.throws(() => normalizeScreenLens(dangling), /not a lens ref/);

  const badTemplate = base();
  badTemplate.screens[0].realization.elements[0].realizedIn = ['template.s.ghost'];
  assert.throws(() => normalizeScreenLens(badTemplate), /template template\.s\.ghost is not declared/);

  const badExample = base();
  badExample.examples[0].related = [{ ref: 'golden:ghost', via: [] }];
  assert.throws(() => normalizeScreenLens(badExample), /relates to unknown example/);

  const legacy = base();
  delete legacy.screens[0].realization;
  delete legacy.examples;
  const old = normalizeScreenLens(legacy);
  assert.equal(old.screens[0].realization, null, 'a lens generated before realization existed stays valid');
  assert.deepEqual(old.examples, []);
});

test('source defaults: closed modal and its contents latent, default child selected, data branches depend', () => {
  const lens = normalizeScreenLens(base());
  const resolved = R.resolvePresence(lens, 'screen.s');
  const state = (ref) => resolved.elements.get(ref).state;
  assert.equal(state('element.s.body.sheet'), 'LATENT');
  assert.equal(state('element.s.body.sheet.close'), 'LATENT', 'a closed sheet carries its controls latent');
  assert.equal(state('element.s.body.a'), 'SOURCE');
  assert.equal(state('element.s.body.b'), 'LATENT');
  assert.equal(state('element.s.body.flag'), 'DEPENDS', 'VexBoard does not evaluate feature conditions');
  assert.equal(state('element.s.body.nowhere'), 'UNTRACED', 'registered but never traced is visible as such');
  assert.equal(resolved.presence.get('presence.s.list-population').value, 'UNKNOWN');
  assert.ok(resolved.elements.get('element.s.body.bucket.act').perInstance, 'registered row action is realized per item, not in its bucket');
});

test('an example applies its own presentation setup; its fixture stays opaque', () => {
  const lens = normalizeScreenLens(base());
  const resolved = R.resolvePresence(lens, 'screen.s', R.withExample(R.emptyRealizationContext(), 'preview:s-open'));
  assert.equal(resolved.elements.get('element.s.body.sheet').state, 'EXAMPLE');
  assert.equal(resolved.elements.get('element.s.body.sheet.close').state, 'EXAMPLE');
  assert.equal(resolved.elements.get('element.s.body.b').state, 'EXAMPLE');
  assert.equal(resolved.elements.get('element.s.body.a').state, 'LATENT');
  assert.match(resolved.presence.get('presence.s.list-population').why, /fixture \(fixture\)/);
});

test('a scenario override is a bounded value over one relationship and resets cleanly', () => {
  const lens = normalizeScreenLens(base());
  let context = R.emptyRealizationContext();
  context = R.withOverride(context, 'presence.s.sheet-open', 'OPEN');
  context = R.withOverride(context, 'presence.s.flag-branch', '0');
  context = R.withOverride(context, 'presence.s.list-population', 'EMPTY');
  const resolved = R.resolvePresence(lens, 'screen.s', context);
  assert.equal(resolved.elements.get('element.s.body.sheet').state, 'SCENARIO');
  assert.equal(resolved.elements.get('element.s.body.flag').state, 'SCENARIO');
  assert.equal(resolved.presence.get('presence.s.list-population').value, 'EMPTY');
  assert.ok(Object.isFrozen(context.overrides), 'scenario state is an immutable value the page owns');

  const reset = R.resetScenario(context);
  assert.deepEqual(reset.overrides, {});
  assert.equal(R.resolvePresence(lens, 'screen.s', reset).elements.get('element.s.body.sheet').state, 'LATENT');
  assert.deepEqual(R.withOverride(context, 'presence.s.sheet-open', null).overrides['presence.s.sheet-open'], undefined);
});

test('selection else-choices resolve by elimination, and placements by realizer are flagged', () => {
  const lens = normalizeScreenLens(base());
  const selection = lens.screens[0].realization.presence.find((entry) => entry.kind === 'SELECTION');
  const choices = R.selectionTargets(selection, ['element.s.body.a', 'element.s.body.b']);
  assert.deepEqual(choices.map((choice) => [choice.resolvedTargetRef, choice.byElimination]), [[null, false], ['element.s.body.b', false], ['element.s.body.a', true]]);
  const placed = R.populationsAt(lens, 'screen.s', 'element.s.body.a');
  assert.deepEqual(placed.map((entry) => [entry.presence.ref, entry.placement]), [['presence.s.list-population', 'REALIZER_BY_ELIMINATION']]);
});

test('openers come from declared intents; evidence resolves at the pinned commit through the repository', () => {
  const lens = normalizeScreenLens(base());
  assert.deepEqual(R.openersOf(lens, 'screen.s', 'element.s.body.sheet').map((element) => element.ref), ['element.s.body.open']);
  assert.equal(R.evidenceUrl(lens, 'ref/a b.png'), `https://github.com/owner/repo/raw/${'a'.repeat(40)}/ref/a%20b.png`);
  assert.deepEqual(R.examplesForScreen(lens, 'screen.s').map((example) => example.ref), ['preview:s-open']);
});

test('on the committed lens, the VexStream registration buckets are exactly what realization cannot trace', () => {
  const lens = normalizeScreenLens(JSON.parse(fs.readFileSync(new URL('../projects/vexboard/lens/vexlife-android.screen-lens.json', import.meta.url), 'utf8')));
  const resolved = R.resolvePresence(lens, 'screen.vexstream-music');
  const untraced = [...resolved.elements.values()].filter((entry) => entry.state === 'UNTRACED').map((entry) => entry.ref.replace('element.vexstream-music.', ''));
  for (const bucket of ['body.track-actions', 'body.library-actions', 'body.collection-actions']) assert.ok(untraced.includes(bucket), `${bucket} is a registration bucket, not a visible container`);
  for (const action of ['play', 'play-next', 'add-queue', 'menu']) {
    assert.ok(resolved.elements.get(`element.vexstream-music.body.track-actions.${action}`).perInstance, `${action} renders inside each row`);
  }
  assert.equal(resolved.elements.get('element.vexstream-music.body.connection.menu').state, 'LATENT');
  const opened = R.resolvePresence(lens, 'screen.debug-menu', R.withExample(R.emptyRealizationContext(), 'preview:debug-history-open'));
  assert.equal(opened.elements.get('element.debug-menu.log-history.sheet').state, 'EXAMPLE');
});

test('a nested relationship decides over its enclosing one; choices that all realize a ref leave no dependence', () => {
  const lens = normalizeScreenLens(JSON.parse(fs.readFileSync(new URL('../projects/vexboard/lens/vexlife-android.screen-lens.json', import.meta.url), 'utf8')));
  const screen = 'screen.vexstream-music';
  // The full player sheet realizes both of its panels, but its own selection presents only one.
  const opened = R.resolvePresence(lens, screen, R.withOverride(R.emptyRealizationContext(), 'presence.vexstream-music.body-player-sheet-open', 'OPEN'));
  assert.equal(opened.elements.get('element.vexstream-music.body.player.sheet').state, 'SCENARIO');
  assert.equal(opened.elements.get('element.vexstream-music.body.queue.sheet').state, 'LATENT', 'the queue panel is not the default child');
  // Player controls are registered under the mini player, yet the now-playing panel realizes them too:
  // their own realization site presents them, whatever the mini player's dependence.
  assert.equal(opened.elements.get('element.vexstream-music.body.player.play-pause').state, 'SCENARIO');
  assert.equal(R.resolvePresence(lens, screen).elements.get('element.vexstream-music.body.player.play-pause').state, 'DEPENDS');
  // The collection index shows the library tabs; its detail route does not, so with the route unknown they depend.
  const albums = R.resolvePresence(lens, screen, R.withOverride(R.emptyRealizationContext(), 'presence.vexstream-music.body-library-selection', 'element.vexstream-music.body.library.albums'));
  assert.equal(albums.elements.get('element.vexstream-music.body.library-tabs.albums').state, 'DEPENDS');
});

test('every choice of an exhaustive relationship realizing the same ref is presence, not dependence', () => {
  const input = base();
  input.screens[0].realization.presence[2] = { ref: 'presence.s.flag-branch', kind: 'CASES', subjectRef: 'element.s.body.flag', owner: 'feature', exhaustive: true, choices: [{ condition: 'is On', realizes: ['element.s.body.flag', 'element.s.body.nowhere'] }, { condition: 'is Off', realizes: ['element.s.body.flag'] }] };
  const resolved = R.resolvePresence(normalizeScreenLens(input), 'screen.s');
  assert.equal(resolved.elements.get('element.s.body.flag').state, 'SOURCE');
  assert.equal(resolved.elements.get('element.s.body.nowhere').state, 'DEPENDS');
});

// [VXG RealForever][VEXWORK][VEXBOARD][SCREEN-LENS][REALIZATION-PROJECTION-TEST]