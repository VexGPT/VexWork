import assert from 'node:assert/strict';
import test from 'node:test';

import {
  SCREEN_LENS_IDENTITY_KINDS,
  SCREEN_LENS_INSTANCE_CONTINUITY,
  SCREEN_LENS_INSTANCE_ENCODING,
  appendLensIdentityPath,
  dynamicLensInstanceRef,
  normalizeElementIdentity,
  normalizeIdentityFormationContract,
  normalizeLensIdentityPath,
  utf8Hex,
} from '../src/shared/vexboard-screen-lens-identity.mjs';

test('derived Lens identity paths normalize mechanically without replacing source-owned identity', () => {
  assert.equal(normalizeLensIdentityPath(' body/search field '), 'body.search-field');
  assert.equal(normalizeLensIdentityPath('a/b/c'), 'a.b.c');
  assert.equal(appendLensIdentityPath('element.settings', 'body/search field'), 'element.settings.body.search-field');
  assert.throws(() => normalizeLensIdentityPath(' / '), /must not normalize to blank/);
});

test('runtime instance identity uses UTF-8 hex over NUL-delimited stable instance parts', () => {
  assert.equal(utf8Hex('A'), '41');
  assert.equal(utf8Hex('é'), 'c3a9');
  const expected = 'element.track.dynamic.utf8hex.' + utf8Hex('album-1\u0000track-7');
  assert.equal(dynamicLensInstanceRef('element.track', ['album-1', 'track-7']), expected);
  assert.throws(() => dynamicLensInstanceRef('element.track', []), /non-empty array/);
});

test('identity formation contracts preserve derived-child and runtime-instance meanings separately', () => {
  assert.deepEqual(
    normalizeIdentityFormationContract({
      kind: SCREEN_LENS_IDENTITY_KINDS.DERIVED_CHILD,
      parentSource: 'screen.content',
      localPath: 'row / title',
    }),
    {
      kind: SCREEN_LENS_IDENTITY_KINDS.DERIVED_CHILD,
      parentSource: 'screen.content',
      localPath: 'row.title',
    },
  );

  assert.deepEqual(
    normalizeIdentityFormationContract({
      kind: SCREEN_LENS_IDENTITY_KINDS.RUNTIME_INSTANCE,
      baseRef: 'element.track',
      partSources: ['track.id'],
      continuity: SCREEN_LENS_INSTANCE_CONTINUITY.STABLE_INSTANCE,
    }),
    {
      kind: SCREEN_LENS_IDENTITY_KINDS.RUNTIME_INSTANCE,
      baseRef: 'element.track',
      partSources: ['track.id'],
      encoding: SCREEN_LENS_INSTANCE_ENCODING,
      continuity: SCREEN_LENS_INSTANCE_CONTINUITY.STABLE_INSTANCE,
    },
  );

  assert.throws(() => normalizeIdentityFormationContract({ kind: 'UNKNOWN' }), /kind UNKNOWN is unknown/);
});

test('element identity validation proves the projected ref matches its declared formation rule', () => {
  assert.deepEqual(
    normalizeElementIdentity(
      { kind: SCREEN_LENS_IDENTITY_KINDS.DERIVED_CHILD, localPath: 'body/title' },
      { ref: 'element.settings.body.title', parentRef: 'element.settings' },
    ),
    { kind: SCREEN_LENS_IDENTITY_KINDS.DERIVED_CHILD, localPath: 'body.title' },
  );

  const ref = dynamicLensInstanceRef('element.track', ['42']);
  assert.deepEqual(
    normalizeElementIdentity(
      {
        kind: SCREEN_LENS_IDENTITY_KINDS.RUNTIME_INSTANCE,
        baseRef: 'element.track',
        instanceParts: ['42'],
        continuity: SCREEN_LENS_INSTANCE_CONTINUITY.CURRENT_OCCURRENCE,
      },
      { ref, parentRef: null },
    ),
    {
      kind: SCREEN_LENS_IDENTITY_KINDS.RUNTIME_INSTANCE,
      baseRef: 'element.track',
      instanceParts: ['42'],
      encoding: SCREEN_LENS_INSTANCE_ENCODING,
      continuity: SCREEN_LENS_INSTANCE_CONTINUITY.CURRENT_OCCURRENCE,
    },
  );

  assert.throws(
    () => normalizeElementIdentity(
      { kind: SCREEN_LENS_IDENTITY_KINDS.DERIVED_CHILD, localPath: 'body/title' },
      { ref: 'element.settings.wrong', parentRef: 'element.settings' },
    ),
    /does not match derived child identity/,
  );
  assert.throws(
    () => normalizeElementIdentity(
      { kind: SCREEN_LENS_IDENTITY_KINDS.DERIVED_CHILD, localPath: 'body/title' },
      { ref: 'element.settings.body.title', parentRef: null },
    ),
    /requires parentRef/,
  );
});

// [VXG RealForever][VEXWORK][VEXBOARD][SCREEN-LENS][IDENTITY][DIRECT-REGRESSION]
