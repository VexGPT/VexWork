import assert from 'node:assert/strict';
import test from 'node:test';

import {
  SCREEN_DESIGN_AUTHORITY_STATES,
  SCREEN_DESIGN_COMPONENT_TEMPLATES,
  SCREEN_DESIGN_LAYOUT_MODES,
  VEXBOARD_SCREEN_DESIGN_SCHEMA,
  boundedResponsiveMetric,
  normalizeScreenDesign,
  resolveBoundedResponsiveMetric,
  resolveScreenDesignBox,
  resolveScreenDesignAnchorBox,
  resolveScreenDesignConstraintBox,
  screenDesignViewportProfile,
  screenDesignComponentAssignment,
  screenDesignSemanticElement,
} from '../src/core/vexboard-screen-design.mjs';

test('Screen design authority states preserve reverse adoption, draft proposal and accepted authority separately', () => {
  assert.deepEqual(
    SCREEN_DESIGN_AUTHORITY_STATES,
    ['REVERSE_ADOPTED_CANDIDATE', 'VEXBOARD_DESIGN_DRAFT', 'VEXBOARD_DESIGN_AUTHORITY'],
  );
});

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
    referenceViewport: { profileRef: 'profile.test.phone', widthDp: 412, heightDp: 915 },
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

test('named metric references resolve constraints without duplicating responsive values', () => {
  const design = normalizeScreenDesign({
    schemaVersion: VEXBOARD_SCREEN_DESIGN_SCHEMA,
    designRef: 'design.metric-ref',
    authorityState: 'VEXBOARD_DESIGN_DRAFT',
    referenceViewport: {
      profileRef: 'profile.phone',
      widthDp: 412,
      heightDp: 915,
    },
    metrics: {
      inset: boundedResponsiveMetric({
        referenceDp: 16,
        referenceExtentDp: 412,
        minDp: 12,
        maxDp: 24,
      }),
    },
    constraints: [{
      occurrenceRef: 'occ.content',
      semanticRef: 'screen.example',
      parentOccurrenceRefOrNull: null,
      horizontal: {
        startMargin: { metricRef: 'inset' },
        endMargin: { metricRef: 'inset' },
        size: { mode: 'FILL' },
        bias: 0.5,
      },
      vertical: {
        size: { mode: 'FILL' },
        bias: 0.5,
      },
    }],
  });

  const box = resolveScreenDesignConstraintBox({
    designInput: design,
    parentBoundsDp: { x: 0, y: 0, width: 412, height: 915 },
    constraintInput: design.constraints[0],
  });
  assert.deepEqual(box, { x: 16, y: 0, width: 380, height: 915 });
  assert.deepEqual(design.constraints[0].horizontal.startMargin, { metricRef: 'inset' });
});

test('screen design resolves named viewport profiles without changing design identity', () => {
  const design = normalizeScreenDesign({
    schemaVersion: VEXBOARD_SCREEN_DESIGN_SCHEMA,
    designRef: 'design.viewport-proof',
    authorityState: 'VEXBOARD_DESIGN_AUTHORITY',
    referenceViewport: {
      profileRef: 'profile.phone',
      widthDp: 412,
      heightDp: 915,
    },
    viewportProfiles: [
      {
        profileRef: 'profile.phone',
        label: 'Phone',
        widthDp: 412,
        heightDp: 915,
        fontScale: 1,
      },
      {
        profileRef: 'profile.compact',
        label: 'Compact',
        widthDp: 360,
        heightDp: 720,
        fontScale: 1.45,
      },
    ],
    constraints: [],
  });

  assert.deepEqual(screenDesignViewportProfile(design, 'profile.compact'), {
    profileRef: 'profile.compact',
    label: 'Compact',
    widthDp: 360,
    heightDp: 720,
    fontScale: 1.45,
  });
  assert.equal(screenDesignViewportProfile(design).profileRef, 'profile.phone');
  assert.throws(
    () => screenDesignViewportProfile(design, 'profile.missing'),
    /unknown screen design viewport profile/,
  );
});

test('screen design can mint proposed semantic elements before target registration catches up', () => {
  const design = normalizeScreenDesign({
    schemaVersion: VEXBOARD_SCREEN_DESIGN_SCHEMA,
    designRef: 'design.proposed-elements',
    authorityState: 'VEXBOARD_DESIGN_DRAFT',
    referenceViewport: {
      profileRef: 'profile.phone',
      widthDp: 412,
      heightDp: 915,
    },
    constraints: [],
    visualTokens: {
      colors: { onSurface: '#FFFFFF' },
      shapes: {},
      dimensions: {},
      typography: {
        headlineSmall: {
          fontFamily: 'PLATFORM_DEFAULT',
          fontWeight: 400,
          fontSizeSp: 24,
          lineHeightSp: 32,
        },
      },
    },
    semanticElements: [{
      semanticRef: 'element.example.title',
      parentSemanticRef: 'element.example.surface',
      kind: 'TEXT',
      identityState: 'VEXBOARD_PROPOSED',
      label: 'Example',
      referenceLineCount: 1,
      sourceRefs: ['repo.example:source'],
    }],
    componentAssignments: [{
      assignmentRef: 'assignment.element.example.title',
      semanticRef: 'element.example.title',
      templateRef: 'component.text',
      styleRef: 'style.default',
      selectedStyleRefOrNull: null,
      iconRefOrNull: null,
      typographyRefOrNull: 'headlineSmall',
      colorRefOrNull: 'onSurface',
    }],
  });

  assert.deepEqual(screenDesignSemanticElement(design, 'element.example.title'), {
    semanticRef: 'element.example.title',
    parentSemanticRef: 'element.example.surface',
    kind: 'TEXT',
    identityState: 'VEXBOARD_PROPOSED',
    label: 'Example',
    referenceLineCount: 1,
    sourceRefs: ['repo.example:source'],
  });
  assert.equal(
    screenDesignComponentAssignment(design, 'element.example.title').templateRef,
    'component.text',
  );
});

test('screen design owns reusable component/template assignments and state-conditioned style variants', () => {
  assert.ok(SCREEN_DESIGN_COMPONENT_TEMPLATES.includes('component.button'));
  assert.ok(SCREEN_DESIGN_COMPONENT_TEMPLATES.includes('component.modal-bottom-sheet'));

  const design = normalizeScreenDesign({
    schemaVersion: VEXBOARD_SCREEN_DESIGN_SCHEMA,
    designRef: 'design.components',
    authorityState: 'VEXBOARD_DESIGN_DRAFT',
    referenceViewport: {
      profileRef: 'profile.phone',
      widthDp: 412,
      heightDp: 915,
    },
    constraints: [],
    componentAssignments: [{
      assignmentRef: 'assignment.tab',
      semanticRef: 'element.example.tab',
      templateRef: 'component.tab',
      styleRef: 'style.navigation',
      selectedStyleRefOrNull: 'style.action.primary',
      iconRefOrNull: null,
    }],
  });

  assert.deepEqual(screenDesignComponentAssignment(design, 'element.example.tab'), {
    assignmentRef: 'assignment.tab',
    semanticRef: 'element.example.tab',
    templateRef: 'component.tab',
    styleRef: 'style.navigation',
    selectedStyleRefOrNull: 'style.action.primary',
    iconRefOrNull: null,
  });

  const duplicate = structuredClone(design);
  duplicate.componentAssignments.push({
    assignmentRef: 'assignment.tab.2',
    semanticRef: 'element.example.tab',
    templateRef: 'component.button',
    styleRef: 'style.action.primary',
    selectedStyleRefOrNull: null,
    iconRefOrNull: null,
  });
  assert.throws(
    () => normalizeScreenDesign(duplicate),
    /duplicate screen design component semanticRef/,
  );
});

test('anchor rules resolve bounded bottom-end placement from design metrics', () => {
  const design = normalizeScreenDesign({
    schemaVersion: VEXBOARD_SCREEN_DESIGN_SCHEMA,
    designRef: 'design.anchor-proof',
    authorityState: 'VEXBOARD_DESIGN_DRAFT',
    referenceViewport: {
      profileRef: 'profile.phone',
      widthDp: 412,
      heightDp: 915,
    },
    metrics: {
      insetH: boundedResponsiveMetric({
        referenceDp: 16,
        referenceExtentDp: 412,
        minDp: 16,
        maxDp: 16,
      }),
      insetV: boundedResponsiveMetric({
        referenceDp: 16,
        referenceExtentDp: 845,
        minDp: 16,
        maxDp: 16,
      }),
    },
    constraints: [],
    anchorRules: [{
      anchorRef: 'anchor.fab',
      semanticRef: 'element.fab-cluster',
      parentSemanticRef: 'screen.example',
      horizontalAnchor: 'END',
      verticalAnchor: 'BOTTOM',
      horizontalInsetMetricRefOrNull: 'insetH',
      verticalInsetMetricRefOrNull: 'insetV',
    }],
  });

  const box = resolveScreenDesignAnchorBox({
    designInput: design,
    anchorRuleInput: design.anchorRules[0],
    parentBoundsDp: { x: 0, y: 70, width: 412, height: 845 },
    widthDp: 40,
    heightDp: 90,
  });
  assert.deepEqual(box, {
    x: 356,
    y: 809,
    width: 40,
    height: 90,
  });
});

test('screen design preserves scroll/layout intent independently of resolved rectangles', () => {
  assert.deepEqual(
    SCREEN_DESIGN_LAYOUT_MODES,
    ['FREE', 'ROW', 'COLUMN', 'STACK', 'SCROLL_ROW', 'SCROLL_COLUMN'],
  );

  const design = normalizeScreenDesign({
    schemaVersion: VEXBOARD_SCREEN_DESIGN_SCHEMA,
    designRef: 'design.layout-proof',
    authorityState: 'VEXBOARD_DESIGN_AUTHORITY',
    referenceViewport: {
      profileRef: 'profile.test.phone',
      widthDp: 412,
      heightDp: 915,
    },
    metrics: {
      tabGap: boundedResponsiveMetric({
        referenceDp: 8,
        referenceExtentDp: 412,
        minDp: 8,
        maxDp: 8,
      }),
    },
    constraints: [],
    layoutRules: [{
      layoutRef: 'layout.tabs',
      semanticRef: 'element.example.tabs',
      mode: 'SCROLL_ROW',
      gapMetricRefOrNull: 'tabGap',
    }],
  });

  assert.equal(design.layoutRules[0].mode, 'SCROLL_ROW');
  assert.equal(design.layoutRules[0].gapMetricRefOrNull, 'tabGap');

  const invalid = structuredClone(design);
  invalid.layoutRules[0].gapMetricRefOrNull = 'missingMetric';
  assert.throws(
    () => normalizeScreenDesign(invalid),
    /gapMetricRefOrNull missing metric missingMetric/,
  );
});

test('screen design containment cycles fail closed', () => {
  assert.throws(() => normalizeScreenDesign({
    schemaVersion: VEXBOARD_SCREEN_DESIGN_SCHEMA,
    designRef: 'design.cycle',
    authorityState: 'VEXBOARD_DESIGN_AUTHORITY',
    referenceViewport: {
      profileRef: 'profile.test.phone',
      widthDp: 412,
      heightDp: 915,
    },
    constraints: [
      {
        occurrenceRef: 'occ.a',
        semanticRef: 'screen.a',
        parentOccurrenceRefOrNull: 'occ.b',
        horizontal: { size: { mode: 'FILL' }, bias: 0 },
        vertical: { size: { mode: 'FILL' }, bias: 0 },
      },
      {
        occurrenceRef: 'occ.b',
        semanticRef: 'screen.b',
        parentOccurrenceRefOrNull: 'occ.a',
        horizontal: { size: { mode: 'FILL' }, bias: 0 },
        vertical: { size: { mode: 'FILL' }, bias: 0 },
      },
    ],
  }), /containment cycle/);
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
    referenceViewport: { profileRef: 'profile.test.phone', widthDp: 412, heightDp: 915 },
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
