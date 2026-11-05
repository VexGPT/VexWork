import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  SCREEN_LENS_REVISION_COMPARISON_SCHEMA,
  comparePathwayRevision,
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
  assert.deepEqual(comparison.relatedBoards.removed, [
    'board.vexlife-android.vexstream-playback.vexarchitecture',
    'board.vexstream.phone-desktop-connection.living-blueprint',
  ]);
  assert.equal(comparison.summary.entityChangeCount, 0);
  assert.equal(comparison.summary.relatedBoardChangeCount, 2);
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

test('pathway detail names the steps and relationships that moved, and which fields', () => {
  const base = raw.pathways.find((entry) => entry.pathwayRef === 'pathway.theme.dark-mode.toggle');
  const next = clone(base);
  const result = next.nodes.find((node) => node.ref === 'theme.dark-mode.toggle.result');
  result.label = 'Result.Success(…)';
  result.symbol = 'ThemeModeStore.Result';
  next.nodes.push({ ref: 'theme.dark-mode.toggle.extra', face: 'DEPTH', role: 'STATE', label: 'Extra' });
  next.nodes = next.nodes.filter((node) => node.ref !== 'theme.dark-mode.toggle.log');
  next.edges = next.edges.filter((edge) => edge.to !== 'theme.dark-mode.toggle.log' && edge.from !== 'theme.dark-mode.toggle.log');
  next.edges.push({ from: 'theme.dark-mode.toggle.result', to: 'theme.dark-mode.toggle.extra', label: 'new' });
  next.label = 'Renamed';
  const detail = comparePathwayRevision(base, next);
  assert.equal(detail.status, 'CHANGED');
  assert.deepEqual(detail.fields, ['label']);
  assert.deepEqual(detail.nodes.added, ['theme.dark-mode.toggle.extra']);
  assert.deepEqual(detail.nodes.removed, ['theme.dark-mode.toggle.log']);
  assert.deepEqual(detail.nodeChanges, [{ ref: 'theme.dark-mode.toggle.result', fields: ['label', 'symbol'] }]);
  assert.ok(detail.edges.added.includes('theme.dark-mode.toggle.result->theme.dark-mode.toggle.extra|FLOW'));
  assert.ok(detail.edges.removed.some((edgeRef) => edgeRef.includes('->theme.dark-mode.toggle.log|')));
  assert.ok(Object.isFrozen(detail.nodes.added));

  const added = comparePathwayRevision(null, base);
  assert.equal(added.status, 'ADDED');
  assert.equal(added.nodes.added.length, base.nodes.length);
  assert.deepEqual(added.fields, []);
  assert.equal(comparePathwayRevision(base, null).status, 'REMOVED');
  assert.equal(comparePathwayRevision(base, clone(base)).nodes.changed.length, 0);
  assert.throws(() => comparePathwayRevision(null, null), /at least one/);
  assert.throws(() => comparePathwayRevision(base, { ...base, pathwayRef: 'pathway.other' }), /one pathwayRef/);
});


test('parallel relationship kinds keep distinct comparison identity', () => {
  const base = {
    pathwayRef: 'pathway.parallel',
    label: 'Parallel',
    nodes: [],
    edges: [
      { from: 'a', to: 'b', kind: 'FLOW', label: 'first' },
      { from: 'a', to: 'b', kind: 'DATA', label: 'second' },
    ],
  };
  const next = clone(base);
  next.edges[0].label = 'changed';
  const detail = comparePathwayRevision(base, next);
  assert.deepEqual(detail.edges.changed, ['a->b|FLOW']);
  assert.deepEqual(detail.edges.unchanged, ['a->b|DATA']);
});
