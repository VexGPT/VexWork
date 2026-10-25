import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ANDROID_REFERENCE_STYLE_ID,
  VEXBOARD_ANDROID_REFERENCE_PRESENTATION_SCHEMA,
  androidReferenceClassNames,
  androidReferenceCssVariables,
  androidReferenceProfileSummary,
  androidReferenceRelationshipRoute,
  androidReferenceScrollAxis,
  androidReferenceScrolledOccurrence,
  installAndroidReferencePresentation,
  normalizeAndroidReferencePresentation,
} from '../vexboard/ui/android-reference-presentation.mjs';

function fixture() {
  return {
    schemaVersion: VEXBOARD_ANDROID_REFERENCE_PRESENTATION_SCHEMA,
    profileRef: 'profile.android.phone',
    referenceViewport: {
      widthDp: 412,
      heightDp: 915,
      densityIndependent: true,
      boardScalePerDp: 0.72,
    },
    items: [
      { projectionItemRef: 'item.screen', role: 'SCREEN_FRAME', variant: 'LOADED' },
      { projectionItemRef: 'item.sheet', role: 'MODAL_SHEET', variant: null },
      { projectionItemRef: 'item.settings', role: 'ICON_BUTTON', variant: 'Settings', styleRef: 'style.toolbar.icon' },
      { projectionItemRef: 'item.condition', role: 'STATE_CHIP', variant: 'LOADED' },
      { projectionItemRef: 'item.viewport', role: 'SCROLL_VIEWPORT', variant: 'HORIZONTAL' },
      { projectionItemRef: 'item.tab', role: 'TAB', variant: 'DEFAULT' },
      { projectionItemRef: 'item.content', role: 'CONTENT_COLUMN', variant: null, styleRef: 'style.default' },
      {
        projectionItemRef: 'item.sheet-title',
        role: 'TEXT',
        variant: 'HEADLINE_SMALL',
        styleRef: 'style.default',
        typographyRef: 'headlineSmall',
        colorRef: 'onSurface',
      },
    ],
    relationships: [{
      relationshipRef: 'rel.open-sheet',
      fromProjectionItemRef: 'item.settings',
      toProjectionItemRef: 'item.sheet',
    }],
    sourceRefs: [],
  };
}

test('Android reference presentation is occurrence-local and does not mint semantic identity', () => {
  const presentation = normalizeAndroidReferencePresentation(fixture());
  assert.equal(presentation.profileRef, 'profile.android.phone');
  assert.deepEqual(
    androidReferenceClassNames(presentation, 'item.screen'),
    ['android-reference', 'android-role-screen-frame', 'android-variant-loaded'],
  );
  assert.deepEqual(
    androidReferenceClassNames(presentation, 'item.sheet'),
    ['android-reference', 'android-role-modal-sheet'],
  );
  assert.deepEqual(
    androidReferenceClassNames(presentation, 'item.settings'),
    ['android-reference', 'android-role-icon-button', 'android-variant-settings', 'android-style-toolbar-icon'],
  );
  assert.deepEqual(
    androidReferenceClassNames(presentation, 'item.condition'),
    ['android-reference', 'android-role-state-chip', 'android-variant-loaded'],
  );
  assert.deepEqual(
    androidReferenceClassNames(presentation, 'item.content'),
    ['android-reference', 'android-role-content-column', 'android-style-default'],
  );
  assert.deepEqual(
    androidReferenceClassNames(presentation, 'item.sheet-title'),
    [
      'android-reference',
      'android-role-text',
      'android-variant-headline-small',
      'android-style-default',
      'android-type-headline-small',
      'android-color-on-surface',
    ],
  );
  assert.deepEqual(androidReferenceClassNames(presentation, 'item.unknown'), []);

  assert.deepEqual(androidReferenceProfileSummary(presentation), {
    profileRef: 'profile.android.phone',
    widthDp: 412,
    heightDp: 915,
    boardScalePerDp: 0.72,
  });
  assert.deepEqual(androidReferenceRelationshipRoute(presentation, 'rel.open-sheet'), {
    relationshipRef: 'rel.open-sheet',
    fromProjectionItemRef: 'item.settings',
    toProjectionItemRef: 'item.sheet',
  });
});

test('Android reference presentation rejects occurrence routes that do not bind visible projection items', () => {
  const invalid = fixture();
  invalid.relationships[0].fromProjectionItemRef = 'item.missing';
  assert.throws(
    () => normalizeAndroidReferencePresentation(invalid),
    /must reference known projection items/,
  );
});

test('Android reference scroll viewport translates and clips occurrence-local geometry without mutation', () => {
  const presentation = fixture();
  assert.equal(androidReferenceScrollAxis(presentation, 'item.viewport'), 'HORIZONTAL');
  assert.equal(androidReferenceScrollAxis(presentation, 'item.screen'), null);

  const partial = androidReferenceScrolledOccurrence(
    presentation,
    { x: 80, y: 20, width: 80, height: 40 },
    'item.viewport',
    { x: 100, y: 20, width: 100, height: 40 },
    0,
  );
  assert.deepEqual(partial.bounds, { x: 80, y: 20, width: 80, height: 40 });
  assert.equal(partial.hidden, false);
  assert.equal(partial.clipPath, 'inset(0px 0px 0px 20px)');

  const scrolled = androidReferenceScrolledOccurrence(
    presentation,
    { x: 180, y: 20, width: 80, height: 40 },
    'item.viewport',
    { x: 100, y: 20, width: 100, height: 40 },
    50,
  );
  assert.deepEqual(scrolled.bounds, { x: 130, y: 20, width: 80, height: 40 });
  assert.equal(scrolled.hidden, false);
  assert.equal(scrolled.clipPath, 'inset(0px 10px 0px 0px)');

  const hidden = androidReferenceScrolledOccurrence(
    presentation,
    { x: 250, y: 20, width: 40, height: 40 },
    'item.viewport',
    { x: 100, y: 20, width: 100, height: 40 },
    0,
  );
  assert.equal(hidden.hidden, true);
  assert.equal(hidden.clipPath, null);

  assert.throws(
    () => androidReferenceScrolledOccurrence(
      presentation,
      { x: 100, y: 20, width: 40, height: 40 },
      'item.viewport',
      { x: 100, y: 20, width: 100, height: 40 },
      -1,
    ),
    /scrollOffset must be a non-negative finite number/,
  );
});

test('Android reference styling resolves from VexBoard-owned visual tokens', () => {
  const presentation = fixture();
  const design = {
    visualTokens: {
      colors: {
        background: '#0F1012',
        onSurface: '#F5F5F4',
        onSurfaceVariant: '#B7B8BF',
        surface: '#17181C',
        surfaceContainer: '#202126',
        surfaceContainerLow: '#1D1B20',
        surfaceContainerHigh: '#272930',
        outline: '#5A5D68',
        outlineVariant: '#383A42',
        primary: '#F2F2EF',
        onPrimary: '#111216',
        primaryContainer: '#4F378B',
        onPrimaryContainer: '#EADDFF',
        secondaryContainer: '#4A4458',
        onSecondaryContainer: '#E8DEF8',
        errorContainer: '#8C1D18',
        onErrorContainer: '#F9DEDC',
      },
      dimensions: {
        bottomSheetMaxWidthDp: 640,
        bottomSheetDragHandleWidthDp: 32,
        bottomSheetDragHandleHeightDp: 4,
        bottomSheetDragHandleVerticalPaddingDp: 22,
      },
      shapes: {
        mediumRadiusDp: 12,
        largeRadiusDp: 16,
        extraLargeRadiusDp: 28,
        fullRadius: 'FULL',
      },
      typography: {
        headlineSmall: { fontFamily: 'PLATFORM_DEFAULT', fontWeight: 400, fontSizeSp: 24, lineHeightSp: 32 },
        titleLarge: { fontFamily: 'PLATFORM_DEFAULT', fontWeight: 400, fontSizeSp: 22, lineHeightSp: 28 },
        titleMedium: { fontFamily: 'PLATFORM_DEFAULT', fontWeight: 500, fontSizeSp: 16, lineHeightSp: 24 },
        bodyLarge: { fontFamily: 'PLATFORM_DEFAULT', fontWeight: 400, fontSizeSp: 16, lineHeightSp: 24 },
        bodyMedium: { fontFamily: 'PLATFORM_DEFAULT', fontWeight: 400, fontSizeSp: 14, lineHeightSp: 20 },
        bodySmall: { fontFamily: 'PLATFORM_DEFAULT', fontWeight: 400, fontSizeSp: 12, lineHeightSp: 16 },
        labelLarge: { fontFamily: 'PLATFORM_DEFAULT', fontWeight: 500, fontSizeSp: 14, lineHeightSp: 20 },
        labelSmall: { fontFamily: 'MONOSPACE', fontWeight: 600, fontSizeSp: 10, letterSpacingSp: 0.8 },
      },
    },
  };
  const vars = androidReferenceCssVariables(design, presentation);
  assert.equal(vars['--vex-android-background'], '#0F1012');
  assert.equal(vars['--vex-android-secondary-container'], '#4A4458');
  assert.equal(vars['--vex-android-error-container'], '#8C1D18');
  assert.equal(vars['--vex-android-radius-medium'], '8.64px');
  assert.equal(vars['--vex-android-radius-large'], '11.52px');
  assert.equal(vars['--vex-android-radius-extra-large'], '20.16px');
  assert.equal(vars['--vex-android-radius-full'], '999px');
  assert.equal(vars['--vex-android-sheet-handle-width'], '23.04px');
  assert.equal(vars['--vex-android-sheet-handle-height'], '2.88px');
  assert.equal(vars['--vex-android-sheet-handle-padding'], '15.84px');
  assert.equal(vars['--vex-android-body-small-size'], '8.64px');
  assert.equal(vars['--vex-android-body-small-line'], '11.52px');
  assert.equal(vars['--vex-android-title-large-size'], '15.84px');
  assert.equal(vars['--vex-android-title-large-line'], '20.16px');
  assert.equal(vars['--vex-android-title-large-weight'], '400');

  const largeTextPresentation = structuredClone(presentation);
  largeTextPresentation.referenceViewport.fontScale = 1.45;
  const largeVars = androidReferenceCssVariables(design, largeTextPresentation);
  assert.equal(largeVars['--vex-android-title-large-size'], String(22 * 1.45 * 0.72) + 'px');
  assert.equal(largeVars['--vex-android-body-medium-line'], String(20 * 1.45 * 0.72) + 'px');
});

test('Android reference presentation rejects duplicate projection occurrence hints', () => {
  const invalid = fixture();
  invalid.items.push({ projectionItemRef: 'item.screen', role: 'BUTTON', variant: 'PRIMARY' });
  assert.throws(
    () => normalizeAndroidReferencePresentation(invalid),
    /duplicate Android presentation projectionItemRef/,
  );
});

test('Android reference stylesheet installs once and contains the Screen/modal/depth vocabulary', () => {
  const appended = [];
  const documentRef = {
    documentElement: { append: (value) => appended.push(value) },
    head: { append: (value) => appended.push(value) },
    createElement: () => ({ id: '', textContent: '' }),
    getElementById: (id) => appended.find((value) => value.id === id) ?? null,
  };

  assert.equal(installAndroidReferencePresentation(documentRef), true);
  assert.equal(installAndroidReferencePresentation(documentRef), false);
  assert.equal(appended.length, 1);
  assert.equal(appended[0].id, ANDROID_REFERENCE_STYLE_ID);
  assert.match(appended[0].textContent, /android-role-screen-frame/);
  assert.match(appended[0].textContent, /android-role-state-chip/);
  assert.match(appended[0].textContent, /android-role-scroll-viewport/);
  assert.match(appended[0].textContent, /--vex-android-secondary-container/);
  assert.match(appended[0].textContent, /--vex-android-radius-large/);
  assert.match(appended[0].textContent, /android-role-modal-sheet/);
  assert.match(appended[0].textContent, /android-role-content-column/);
  assert.match(appended[0].textContent, /android-role-surface>\.shape-label \{ display:none; \}/);
  assert.match(appended[0].textContent, /android-variant-body-small/);
  assert.match(appended[0].textContent, /--vex-android-sheet-handle-width/);
  assert.match(appended[0].textContent, /android-role-api-endpoint/);
  assert.match(appended[0].textContent, /#0f1012/);
});

// [VXG RealForever][VEXWORK][VEXBOARD][ANDROID-REFERENCE-PRESENTATION]
