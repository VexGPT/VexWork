import assert from 'node:assert/strict';
import test from 'node:test';

import {
  VEXBOARD_SCREEN_DESIGN_SCHEMA,
  boundedResponsiveMetric,
  normalizeScreenDesign,
  resolveBoundedResponsiveMetric,
  resolveScreenDesignBox,
} from '../src/core/vexboard-screen-design.mjs';

test('bounded responsive metrics preserve the adopted Android value at the reference width', () => {
  const margin = boundedResponsiveMetric({
    referenceDp: 16,
    referenceExtentDp: 412,
    minDp: 16,
    maxDp: 24,
  });
  assert.equal(margin.preferredPercent, 16 / 412);
  assert.equal(resolveBoundedResponsiveMetric(margin, 412), 16);
  assert.equal(resolveBoundedResponsiveMetric(margin, 824), 24);
  assert.equal(resolveBoundedResponsiveMetric(margin, 206), 16);
});

test('constraint bias resolves within bounded margins instead of becoming copied x/y geometry', () => {
  const margin = boundedResponsiveMetric({
    referenceDp: 16,
    referenceExtentDp: 412,
    minDp: 12,
    maxDp: 24,
  });

  const full = resolveScreenDesignBox({
    parentBoundsDp: { x: 0, y: 0, width: 412, height: 915 },
    horizontal: {
      startMargin: margin,
      endMargin: margin,
      size: { mode: 'FILL' },
      bias: 0.5,
    },
    vertical: {
      startMargin: boundedResponsiveMetric({
        referenceDp: 70,
        referenceExtentDp: 915,
        minDp: 70,
        maxDp: 70,
      }),
      endMargin: boundedResponsiveMetric({
        referenceDp: 70,
        referenceExtentDp: 915,
        minDp: 70,
        maxDp: 70,
      }),
      size: { mode: 'FILL' },
      bias: 0.5,
    },
  });

  assert.deepEqual(full, {
    x: 16,
    y: 70,
    width: 380,
    height: 775,
  });

  const centered = resolveScreenDesignBox({
    parentBoundsDp: { x: 0, y: 0, width: 412, height: 915 },
    horizontal: {
      startMargin: margin,
      endMargin: margin,
      size: { mode: 'FRACTION', fraction: 0.5 },
      bias: 0.5,
    },
    vertical: {
      size: { mode: 'FIXED_REFERENCE', referenceDp: 100 },
      bias: 0.25,
    },
  });

  assert.equal(centered.width, 190);
  assert.equal(centered.x, 111);
  assert.equal(centered.height, 100);
  assert.equal(centered.y, 203.75);
});

test('screen design contract keeps authority state separate from resolved projection', () => {
  const design = normalizeScreenDesign({
    schemaVersion: VEXBOARD_SCREEN_DESIGN_SCHEMA,
    designRef: 'design.vexstream.screen.poc',
    authorityState: 'REVERSE_ADOPTED_CANDIDATE',
    referenceViewport: { widthDp: 412, heightDp: 915 },
    constraints: [{
      occurrenceRef: 'design-occurrence.vexstream.content',
      semanticRef: 'screen.vexstream-music',
      parentOccurrenceRefOrNull: null,
      horizontal: {
        size: { mode: 'FILL' },
        bias: 0.5,
      },
      vertical: {
        size: { mode: 'FILL' },
        bias: 0.5,
      },
    }],
  });

  assert.equal(design.authorityState, 'REVERSE_ADOPTED_CANDIDATE');
  assert.equal(design.constraints[0].semanticRef, 'screen.vexstream-music');
});

test('screen design rejects invalid percentage and duplicate occurrence identity', () => {
  assert.throws(() => boundedResponsiveMetric({
    referenceDp: 16,
    referenceExtentDp: 0,
  }), /referenceExtentDp must be positive/);

  assert.throws(() => normalizeScreenDesign({
    schemaVersion: VEXBOARD_SCREEN_DESIGN_SCHEMA,
    designRef: 'design.bad',
    authorityState: 'VEXBOARD_DESIGN_AUTHORITY',
    referenceViewport: { widthDp: 412, heightDp: 915 },
    constraints: [
      {
        occurrenceRef: 'occ.same',
        semanticRef: 'screen.a',
        parentOccurrenceRefOrNull: null,
        horizontal: { size: { mode: 'FILL' }, bias: 0 },
        vertical: { size: { mode: 'FILL' }, bias: 0 },
      },
      {
        occurrenceRef: 'occ.same',
        semanticRef: 'screen.b',
        parentOccurrenceRefOrNull: null,
        horizontal: { size: { mode: 'FILL' }, bias: 0 },
        vertical: { size: { mode: 'FILL' }, bias: 0 },
      },
    ],
  }), /duplicate screen design occurrenceRef/);
});

// [VXG RealForever][VEXWORK][VEXBOARD][SCREEN-DESIGN][POC]
