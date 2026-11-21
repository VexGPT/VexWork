import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ANDROID_LOCALIZATION_PRODUCER,
  androidLocalizationOccurrences,
  projectAndroidLocalizationInventory,
} from '../src/core/vexboard-localization-android.mjs';

const lens = {
  sourceSnapshot: {
    repositoryRef: 'repo.vexlife-android',
    repositoryUrl: 'https://github.com/vgong24/VexLife-Android',
    commit: 'd857a92371555472e0303b18eadf353da2a868d6',
    observedAt: '2026-11-10',
  },
  chrome: [{
    chromeRef: 'chrome.app-shell',
    source: 'app:shell/AppShell.kt',
    elements: [
      {
        ref: 'element.shell.back',
        kind: 'BUTTON',
        label: 'Back',
        parentRef: 'element.shell.toolbar',
        labelRes: 'R.string.back',
      },
      {
        ref: 'element.shell.brand',
        kind: 'IMAGE',
        label: 'VexLife',
        parentRef: 'element.shell.toolbar',
      },
    ],
  }],
  screens: [{
    screenRef: 'screen.settings',
    source: 'app:screens/SettingsScreen.kt',
    elements: [
      {
        ref: 'element.settings.title',
        kind: 'TEXT',
        label: 'Settings',
        parentRef: 'element.settings.body',
        labelRes: 'R.string.settings_title',
        textRole: 'TITLE',
      },
      {
        ref: 'element.settings.container',
        kind: 'COLUMN',
        label: 'Container',
        parentRef: null,
      },
    ],
  }],
};

test('Android adapter reuses Screen Lens element identities and only projects explicit R.string bindings', () => {
  const rows = androidLocalizationOccurrences({ subjectRef: 'subject.vexlife-android', lens });
  assert.equal(rows.length, 2);
  assert.deepEqual(rows.map((row) => row.sourceStringRef), [
    'android:R.string.back',
    'android:R.string.settings_title',
  ]);
  assert.equal(rows[0].surfaceRef, 'chrome.app-shell');
  assert.equal(rows[0].screenRef, null);
  assert.equal(rows[0].bindingRole, 'LABEL');
  assert.equal(rows[1].surfaceRef, 'screen.settings');
  assert.equal(rows[1].bindingRole, 'TEXT');
  assert.equal(rows[1].textRole, 'TITLE');
});

test('Android patient-zero inventory retains exact Product source currentness and reverse coordinates', () => {
  const inventory = projectAndroidLocalizationInventory({
    lens,
    buildRef: 'main',
  });
  assert.equal(inventory.inventoryRef, 'localization.vexlife-android');
  assert.equal(inventory.buildRef, 'main');
  assert.equal(inventory.sourceSnapshot.commit, lens.sourceSnapshot.commit);
  assert.equal(inventory.producer.ref, ANDROID_LOCALIZATION_PRODUCER.ref);
  assert.equal(inventory.summary.occurrenceCount, 2);
  assert.equal(inventory.summary.sourceStringCount, 2);
  assert.deepEqual(
    inventory.occurrences.map((row) => row.elementRef),
    ['element.settings.title', 'element.shell.back'],
  );
});

test('Android localization projection refuses a Lens without source currentness', () => {
  assert.throws(
    () => projectAndroidLocalizationInventory({ lens: { screens: [], chrome: [] } }),
    /sourceSnapshot is required/,
  );
});
