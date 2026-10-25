import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ANDROID_REFERENCE_STYLE_ID,
  VEXBOARD_ANDROID_REFERENCE_PRESENTATION_SCHEMA,
  androidReferenceClassNames,
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
      { projectionItemRef: 'item.settings', role: 'ICON_BUTTON', variant: 'Settings' },
      { projectionItemRef: 'item.condition', role: 'STATE_CHIP', variant: 'LOADED' },
      { projectionItemRef: 'item.viewport', role: 'SCROLL_VIEWPORT', variant: 'HORIZONTAL' },
      { projectionItemRef: 'item.tab', role: 'TAB', variant: 'DEFAULT' },
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
    ['android-reference', 'android-role-icon-button', 'android-variant-settings'],
  );
  assert.deepEqual(
    androidReferenceClassNames(presentation, 'item.condition'),
    ['android-reference', 'android-role-state-chip', 'android-variant-loaded'],
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
  assert.match(appended[0].textContent, /android-role-modal-sheet/);
  assert.match(appended[0].textContent, /android-role-api-endpoint/);
  assert.match(appended[0].textContent, /#0f1012/);
});

// [VXG RealForever][VEXWORK][VEXBOARD][ANDROID-REFERENCE-PRESENTATION]
