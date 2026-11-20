import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import * as Lens from '../src/shared/vexboard-screen-lens.mjs';
import {
  PROJECTABILITY_RELATIONSHIP_KINDS,
  listScreenLensExpressions,
  normalizeScreenLensExpressionFixture,
  resolveScreenLensExpression,
} from '../src/shared/vexboard-screen-lens-expressions.mjs';

const lensSource = JSON.parse(
  fs.readFileSync(
    new URL(
      '../projects/vexboard/lens/vexlife-android.screen-lens.json',
      import.meta.url,
    ),
    'utf8',
  ),
);
const fixtureSource = JSON.parse(
  fs.readFileSync(
    new URL(
      '../projects/vexboard/examples/vexlife-android-vexstream.screen-lens-expressions.fixture.json',
      import.meta.url,
    ),
    'utf8',
  ),
);

const lens = Lens.normalizeScreenLens(lensSource);
const fixture = normalizeScreenLensExpressionFixture(lens, fixtureSource);

const SOURCE_DEFAULTS = 'expression.vexstream.source-defaults';
const SONGS_POPULATED = 'expression.vexstream.songs-populated';
const ALBUMS_SELECTED = 'expression.vexstream.albums-selected';
const PLAYER_DOCKED = 'expression.vexstream.player-docked';
const FULL_PLAYER_OPEN = 'expression.vexstream.full-player-open';
const CONNECTION_MENU_OPEN = 'expression.vexstream.connection-menu-open';

function cloneFixture() {
  return structuredClone(fixtureSource);
}

function resolve(expressionRef) {
  return resolveScreenLensExpression(lens, fixture, expressionRef);
}

test('VexStream fixture keeps the seven representative contexts instead of a Cartesian product', () => {
  assert.deepEqual(PROJECTABILITY_RELATIONSHIP_KINDS, [
    'REGISTERED',
    'REALIZED_AS',
    'SELECTS',
    'PRESENTS',
    'POPULATES',
    'CONDITIONED_BY',
    'EVIDENCED_BY',
  ]);
  assert.equal(fixture.lensSourceCommit, '305a09eac1fabebcf2241bd207386950f41121f2');
  assert.equal(
    fixture.sourceRevisionRef,
    'git.commit.vexlife-android.ecbb6987d1da338fa0adf7297456d3f652f04155',
  );
  assert.deepEqual(
    listScreenLensExpressions(fixture).map((entry) => entry.expressionRef),
    [
      SOURCE_DEFAULTS,
      'expression.vexstream.paired',
      SONGS_POPULATED,
      ALBUMS_SELECTED,
      PLAYER_DOCKED,
      FULL_PLAYER_OPEN,
      CONNECTION_MENU_OPEN,
    ],
  );
});

test('source-default expression resolves only source-owned defaults for the modeled axes', () => {
  const resolved = resolve(SOURCE_DEFAULTS);

  assert.equal(resolved.assignments['relationship.vexstream.connection.state'], 'connection.not-paired');
  assert.equal(resolved.assignments['relationship.vexstream.library.selection'], 'library.songs');
  assert.equal(resolved.assignments['relationship.vexstream.songs.population'], 'population.empty');
  assert.equal(resolved.assignments['relationship.vexstream.player.display'], 'player.inactive');
  assert.equal(resolved.assignments['relationship.vexstream.full-player.presentation'], 'full-player.closed');
  assert.equal(resolved.assignments['relationship.vexstream.connection-menu.presentation'], 'connection-menu.closed');
  assert.deepEqual(resolved.surface.runtimeItems, []);
  assert.ok(resolved.surface.elementRefs.includes('element.vexstream-music.body'));
  assert.ok(resolved.surface.elementRefs.includes('element.vexstream-music.body.connection'));
  assert.ok(resolved.surface.elementRefs.includes('element.vexstream-music.body.library'));
  assert.ok(resolved.surface.elementRefs.includes('element.vexstream-music.body.library.songs'));
  assert.deepEqual(resolved.structure.elementRefs, resolved.surface.elementRefs);
});

test('library containers belong to library selection rather than the Paired condition', () => {
  const sourceDefaults = resolve(SOURCE_DEFAULTS);
  const paired = resolve('expression.vexstream.paired');

  assert.ok(
    sourceDefaults.surface.elementRefs.includes('element.vexstream-music.body.library'),
  );
  assert.ok(
    paired.surface.elementRefs.includes('element.vexstream-music.body.library'),
  );
  assert.ok(
    sourceDefaults.surface.elementRefs.includes('element.vexstream-music.body.library-tabs.songs'),
  );
  assert.ok(
    paired.surface.elementRefs.includes('element.vexstream-music.body.library-tabs.songs'),
  );

  const connection = fixture.relationships.find(
    (entry) => entry.relationshipRef === 'relationship.vexstream.connection.state',
  );
  const pairedValue = connection.values.find((entry) => entry.valueRef === 'connection.paired');
  assert.deepEqual(pairedValue.elementRefs, []);

  const selection = fixture.relationships.find(
    (entry) => entry.relationshipRef === 'relationship.vexstream.library.selection',
  );
  assert.deepEqual(selection.elementRefs, [
    'element.vexstream-music.body.library',
  ]);
});

test('Songs populated keeps runtime track identity outside static Screen registration', () => {
  const resolved = resolve(SONGS_POPULATED);
  const runtimeRefs = resolved.surface.runtimeItems.map((item) => item.itemRef);

  assert.deepEqual(runtimeRefs, ['preview.streamed', 'preview.downloaded']);
  for (const runtimeRef of runtimeRefs) {
    assert.equal(Lens.elementFor(lens, runtimeRef), null, `${runtimeRef} must remain runtime identity`);
  }
  assert.ok(
    resolved.surface.runtimeItems.every(
      (item) => item.realizationRef === 'element.vexstream-music.body.library.songs',
    ),
  );
  assert.ok(
    resolved.structure.sourceRefs.includes(
      'arch:elements/src/main/kotlin/com/vextreme/vexlife/android/elements/VexStableLazyList.kt',
    ),
  );
  assert.ok(
    resolved.evidenceRefs.includes(
      'evidence.vexstream.songs-golden.expected-reference-mismatch',
    ),
  );
});

test('Albums selection changes the same Screen through the existing typed presentation pathway', () => {
  const resolved = resolve(ALBUMS_SELECTED);

  assert.equal(resolved.assignments['relationship.vexstream.library.selection'], 'library.albums');
  assert.ok(resolved.surface.elementRefs.includes('element.vexstream-music.body.library-tabs.albums'));
  assert.ok(resolved.surface.elementRefs.includes('element.vexstream-music.body.library.albums'));
  assert.ok(
    resolved.behavior.pathwayRefs.includes(
      'pathway.vexstream-music.swap-to-child-albums-panel-container-library-content',
    ),
  );
});

test('player-docked expression reuses the existing Playback Behavior and Depth pathway', () => {
  const resolved = resolve(PLAYER_DOCKED);

  assert.equal(resolved.assignments['relationship.vexstream.player.display'], 'player.active');
  assert.ok(resolved.surface.elementRefs.includes('element.vexstream-music.body.player.play-pause'));
  assert.ok(resolved.behavior.pathwayRefs.includes('pathway.vexstream.playback.play-pause'));
  assert.ok(resolved.behavior.nodeRefs.includes('vexstream.playback.play-pause.control'));
  assert.ok(resolved.behavior.nodeRefs.includes('vexstream.playback.play-pause.state'));
  assert.ok(resolved.depth.nodeRefs.includes('vexstream.playback.play-pause.connection'));
  assert.ok(resolved.depth.nodeRefs.includes('vexstream.playback.play-pause.provider'));
  assert.ok(resolved.depth.nodeRefs.includes('vexstream.playback.play-pause.reconcile'));
});

test('full-player and connection-menu expressions reuse registered presentation identities', () => {
  const fullPlayer = resolve(FULL_PLAYER_OPEN);
  assert.equal(
    fullPlayer.assignments['relationship.vexstream.full-player.presentation'],
    'full-player.open',
  );
  assert.ok(fullPlayer.surface.elementRefs.includes('element.vexstream-music.body.player.sheet'));
  assert.ok(
    fullPlayer.behavior.pathwayRefs.includes(
      'pathway.vexstream-music.swap-to-child-full-player-now-playing-panel-container-full-player-content-then-open-full-player-sheet',
    ),
  );
  assert.ok(fullPlayer.behavior.pathwayRefs.includes('pathway.vexstream-music.close.FullPlayerSheet'));

  const connectionMenu = resolve(CONNECTION_MENU_OPEN);
  assert.equal(
    connectionMenu.assignments['relationship.vexstream.connection-menu.presentation'],
    'connection-menu.open',
  );
  assert.ok(connectionMenu.surface.elementRefs.includes('element.vexstream-music.body.connection.menu'));
  assert.ok(connectionMenu.surface.elementRefs.includes('element.vexstream-music.body.connection.reconnect'));
  assert.ok(connectionMenu.behavior.pathwayRefs.includes('pathway.vexstream-music.connection.reconnect'));
  assert.ok(connectionMenu.behavior.pathwayRefs.includes('pathway.vexstream-music.close.ConnectionMenuSheet'));
});

test('fixture fails closed when runtime identity tries to impersonate a static Lens element', () => {
  const candidate = cloneFixture();
  const population = candidate.relationships.find(
    (entry) => entry.relationshipRef === 'relationship.vexstream.songs.population',
  );
  const preview = population.values.find((entry) => entry.valueRef === 'population.preview');
  preview.runtimeItems[0].itemRef = 'element.vexstream-music.body.library.songs';

  assert.throws(
    () => normalizeScreenLensExpressionFixture(lens, candidate),
    /must not reuse static Screen Lens element identity/,
  );
});

test('fixture rejects unknown refs, invalid axis values and missing source defaults', () => {
  const unknownPath = cloneFixture();
  unknownPath.relationships[0].pathwayRefs = ['pathway.does-not-exist'];
  assert.throws(
    () => normalizeScreenLensExpressionFixture(lens, unknownPath),
    /unknown pathway/,
  );

  const invalidValue = cloneFixture();
  invalidValue.expressions[0].assignments['relationship.vexstream.connection.state'] = 'connection.unknown';
  assert.throws(
    () => normalizeScreenLensExpressionFixture(lens, invalidValue),
    /unknown value/,
  );

  const missingDefault = cloneFixture();
  const selection = missingDefault.relationships.find(
    (entry) => entry.relationshipRef === 'relationship.vexstream.library.selection',
  );
  delete selection.defaultValueRef;
  assert.throws(
    () => normalizeScreenLensExpressionFixture(lens, missingDefault),
    /requires defaultValueRef/,
  );
});

test('fixture currentness fence rejects an unreconciled Lens snapshot', () => {
  const candidate = cloneFixture();
  candidate.lensSourceCommit = '1111111111111111111111111111111111111111';
  assert.throws(
    () => normalizeScreenLensExpressionFixture(lens, candidate),
    /lensSourceCommit .* does not match/,
  );
});

test('expression resolution is immutable and does not mutate the accepted Lens', () => {
  const before = JSON.stringify(lens);
  const resolved = resolve(FULL_PLAYER_OPEN);

  assert.equal(JSON.stringify(lens), before);
  assert.ok(Object.isFrozen(resolved));
  assert.ok(Object.isFrozen(resolved.surface));
  assert.ok(Object.isFrozen(resolved.structure));
  assert.ok(Object.isFrozen(resolved.behavior));
  assert.ok(Object.isFrozen(resolved.depth));
  assert.ok(Object.isFrozen(resolved.surface.elementRefs));
  assert.ok(Object.isFrozen(resolved.surface.runtimeItems));
});

// [VXG RealForever][VEXWORK][VEXBOARD][SCREEN-LENS][EXPRESSIONS][TEST]
