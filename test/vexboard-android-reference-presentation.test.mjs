import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ANDROID_REFERENCE_STYLE_ID,
  VEXBOARD_ANDROID_REFERENCE_PRESENTATION_SCHEMA,
  androidReferenceClassNames,
  androidReferenceProfileSummary,
  androidReferenceRelationshipRoute,
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
  assert.match(appended[0].textContent, /android-role-modal-sheet/);
  assert.match(appended[0].textContent, /android-role-api-endpoint/);
  assert.match(appended[0].textContent, /#0f1012/);
});

// [VXG RealForever][VEXWORK][VEXBOARD][ANDROID-REFERENCE-PRESENTATION]
