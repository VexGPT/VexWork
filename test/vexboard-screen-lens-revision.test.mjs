import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  SCREEN_LENS_REVISION_COMPARISON_SCHEMA,
  compareScreenLensRevisions,
} from '../src/shared/vexboard-screen-lens-revision.mjs';

const raw = JSON.parse(fs.readFileSync(new URL('../projects/vexboard/lens/vexlife-android.screen-lens.json', import.meta.url), 'utf8'));
const clone = (value) => JSON.parse(JSON.stringify(value));

test('same Screen Lens revision has no projection or source-revision change', () => {
  const comparison = compareScreenLensRevisions(raw, raw);
  assert.equal(comparison.schemaVersion, SCREEN_LENS_REVISION_COMPARISON_SCHEMA);
  assert.equal(comparison.sourceRevisionChanged, false);
  assert.equal(comparison.sourceBindingChanged, false);
  assert.equal(comparison.projectionChanged, false);
  assert.equal(comparison.summary.entityChangeCount, 0);
  assert.equal(comparison.summary.relatedBoardChangeCount, 0);
});

test('a new source commit does not by itself imply a projection change', () => {
  const next = clone(raw);
  next.sourceSnapshot.commit = '1111111111111111111111111111111111111111';
  next.sourceSnapshot.observedAt = '2026-11-04';
  const comparison = compareScreenLensRevisions(raw, next);
  assert.equal(comparison.sourceRevisionChanged, true);
  assert.equal(comparison.sourceBindingChanged, false);
  assert.equal(comparison.projectionChanged, false);
  assert.equal(comparison.summary.entityChangeCount, 0);
});

test('stable refs expose pathway and element projection changes', () => {
  const next = clone(raw);
  const pathway = next.pathways.find((entry) => entry.pathwayRef === 'pathway.vexstream.playback.play-pause');
  pathway.label = 'VexStream Playback · Play / Pause changed';
  const element = next.screens
    .find((screen) => screen.screenRef === 'screen.vexstream-music')
    .elements.find((entry) => entry.ref === 'element.vexstream-music.body.player.play-pause');
  element.label = 'Play or Pause';
  const comparison = compareScreenLensRevisions(raw, next);
  assert.equal(comparison.projectionChanged, true);
  assert.deepEqual(comparison.pathways.changed, ['pathway.vexstream.playback.play-pause']);
  assert.deepEqual(comparison.elements.changed, ['element.vexstream-music.body.player.play-pause']);
  assert.equal(comparison.summary.changedPathwayCount, 1);
  assert.equal(comparison.summary.changedElementCount, 1);
});

test('related-board changes stay distinct from source-derived entity changes', () => {
  const next = clone(raw);
  next.relatedBoardRefs = next.relatedBoardRefs.slice(0, 1);
  const comparison = compareScreenLensRevisions(raw, next);
  assert.equal(comparison.projectionChanged, true);
  assert.deepEqual(comparison.relatedBoards.removed, ['board.vexlife-prod.perceivability-alignment']);
  assert.equal(comparison.summary.entityChangeCount, 0);
  assert.equal(comparison.summary.relatedBoardChangeCount, 1);
});

test('revision comparison fails closed across different lens identities', () => {
  const next = clone(raw);
  next.lensRef = 'lens.some-other-product';
  assert.throws(
    () => compareScreenLensRevisions(raw, next),
    /requires one lensRef/,
  );
});

// [VXG RealForever][VEXWORK][VEXBOARD][SCREEN-LENS][REVISION-COMPARISON-TEST]
