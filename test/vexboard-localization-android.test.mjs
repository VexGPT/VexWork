import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ANDROID_LOCALIZATION_PRODUCER,
  androidLocalizationOccurrences,
  androidSourceStrings,
  projectAndroidLocalizationInventory,
  projectAndroidLocalizationInventoryFromSourceStrings,
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
        ref: 'element.shell.fab.add',
        kind: 'FAB',
        label: '+',
        parentRef: 'element.shell.fab-cluster',
        labelRes: 'R.string.fab_more',
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

const stringsXml = `<resources>
<string name="back">Back</string>
<string name="fab_more">More</string>
<string name="settings_title">Settings</string>
<string name="unmapped">Not projected yet</string>
</resources>`;

test('Android source catalog comes from strings.xml independently of Screen Lens display labels', () => {
  const rows = androidSourceStrings(stringsXml);
  assert.equal(rows.length, 4);
  assert.equal(rows.find((row) => row.sourceKey === 'fab_more').sourceValue, 'More');
});

test('Android adapter reuses Screen Lens identities but resolves value from source catalog, not presentation override', () => {
  const sourceStrings = androidSourceStrings(stringsXml);
  const rows = androidLocalizationOccurrences({
    subjectRef: 'subject.vexlife-android',
    lens,
    sourceStrings,
  });
  assert.equal(rows.length, 3);
  assert.equal(rows.find((row) => row.elementRef === 'element.shell.fab.add').sourceValue, 'More');
  assert.equal(rows.find((row) => row.elementRef === 'element.settings.title').bindingRole, 'TEXT');
  assert.equal(rows.find((row) => row.elementRef === 'element.settings.title').textRole, 'TITLE');
});

test('Android patient-zero inventory retains full source catalog and exact Product currentness', () => {
  const inventory = projectAndroidLocalizationInventory({
    lens,
    stringsXml,
    buildRef: 'main',
  });
  assert.equal(inventory.inventoryRef, 'localization.vexlife-android');
  assert.equal(inventory.buildRef, 'main');
  assert.equal(inventory.sourceSnapshot.commit, lens.sourceSnapshot.commit);
  assert.equal(inventory.producer.ref, ANDROID_LOCALIZATION_PRODUCER.ref);
  assert.equal(inventory.summary.occurrenceCount, 3);
  assert.equal(inventory.summary.sourceStringCount, 4);
  assert.equal(inventory.summary.mappedSourceStringCount, 3);
  assert.equal(inventory.summary.unmappedSourceStringCount, 1);
  assert.equal(inventory.strings.find((row) => row.sourceKey === 'unmapped').mapped, false);
});

test('source-catalog projection seam supports deterministic generated-currentness checks', () => {
  const sourceStrings = androidSourceStrings(stringsXml);
  const inventory = projectAndroidLocalizationInventoryFromSourceStrings({
    lens,
    sourceStrings,
    buildRef: 'main',
  });
  assert.equal(inventory.summary.sourceStringCount, sourceStrings.length);
});

test('Android localization projection refuses absent source catalog and missing bound keys', () => {
  assert.throws(
    () => projectAndroidLocalizationInventoryFromSourceStrings({ lens, sourceStrings: [] }),
    /source string catalog is required/,
  );
  assert.throws(
    () => projectAndroidLocalizationInventory({
      lens: {
        ...lens,
        chrome: [{
          ...lens.chrome[0],
          elements: [{
            ref: 'element.shell.missing',
            kind: 'BUTTON',
            label: 'Missing',
            parentRef: null,
            labelRes: 'R.string.does_not_exist',
          }],
        }],
      },
      stringsXml,
    }),
    /references missing android:R\.string\.does_not_exist/,
  );
});
