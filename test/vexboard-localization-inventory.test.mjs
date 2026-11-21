import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createLocalizationInventory,
  localizationFormatSignature,
  localizationOccurrencesCsv,
  localizationStringsCsv,
  occurrencesForString,
  occurrencesForSurface,
  sourceStringsForExactValue,
  stringsForElement,
} from '../src/shared/vexboard-localization-inventory.mjs';

function inventory() {
  return createLocalizationInventory({
    inventoryRef: 'localization.fixture',
    subjectRef: 'subject.fixture',
    buildRef: 'main',
    sourceLocale: 'en',
    sourceSnapshot: {
      repositoryRef: 'repo.fixture',
      repositoryUrl: 'https://example.test/fixture',
      commit: '0123456789012345678901234567890123456789',
      observedAt: '2026-11-21',
    },
    producer: {
      ref: 'producer.fixture.localization',
      version: 'fixture/1',
    },
    occurrences: [
      {
        occurrenceRef: 'occurrence.fixture.settings.label',
        surfaceRef: 'screen.settings',
        screenRef: 'screen.settings',
        elementRef: 'element.settings.button',
        parentElementRef: 'element.settings.body',
        elementKind: 'BUTTON',
        bindingRole: 'LABEL',
        textRole: null,
        sourceStringRef: 'fixture:string.settings',
        sourceKey: 'settings',
        sourceValue: 'Settings',
        sourcePath: 'Settings.kt',
      },
      {
        occurrenceRef: 'occurrence.fixture.home.label',
        surfaceRef: 'screen.home',
        screenRef: 'screen.home',
        elementRef: 'element.home.settings',
        parentElementRef: 'element.home.body',
        elementKind: 'BUTTON',
        bindingRole: 'LABEL',
        textRole: null,
        sourceStringRef: 'fixture:string.settings',
        sourceKey: 'settings',
        sourceValue: 'Settings',
        sourcePath: 'Home.kt',
      },
      {
        occurrenceRef: 'occurrence.fixture.status.text',
        surfaceRef: 'screen.home',
        screenRef: 'screen.home',
        elementRef: 'element.home.status',
        parentElementRef: 'element.home.body',
        elementKind: 'TEXT',
        bindingRole: 'TEXT',
        textRole: 'SUPPORTING',
        sourceStringRef: 'fixture:string.status',
        sourceKey: 'status',
        sourceValue: '%1$d of %2$d ready',
        sourcePath: 'Home.kt',
      },
      {
        occurrenceRef: 'occurrence.fixture.alt-settings.label',
        surfaceRef: 'screen.other',
        screenRef: 'screen.other',
        elementRef: 'element.other.settings',
        parentElementRef: null,
        elementKind: 'BUTTON',
        bindingRole: 'LABEL',
        textRole: null,
        sourceStringRef: 'fixture:string.settings-alt',
        sourceKey: 'settings-alt',
        sourceValue: 'Settings',
        sourcePath: 'Other.kt',
      },
    ],
  });
}

test('format signature preserves placeholder position and type without making rendered values identity', () => {
  assert.deepEqual(localizationFormatSignature('%1$d of %2$d · %3$s').placeholders, [
    { index: 1, type: 'INT', token: '%1$d' },
    { index: 2, type: 'INT', token: '%2$d' },
    { index: 3, type: 'STRING', token: '%3$s' },
  ]);
  assert.equal(localizationFormatSignature('%1$d of %2$d · %3$s').signature, '1:INT|2:INT|3:STRING');
  assert.equal(localizationFormatSignature('100%% ready').signature, '');
});

test('inventory keeps stable occurrences separate while aggregating exact source-string identity', () => {
  const value = inventory();
  assert.equal(value.schemaVersion, 'vexboard.localization-inventory/v1');
  assert.equal(value.summary.occurrenceCount, 4);
  assert.equal(value.summary.sourceStringCount, 3);
  assert.equal(value.summary.reusedSourceStringCount, 1);
  assert.equal(value.summary.formatStringCount, 1);

  const settings = value.strings.find((row) => row.sourceStringRef === 'fixture:string.settings');
  assert.equal(settings.occurrenceRefs.length, 2);
  assert.deepEqual(settings.screenRefs, ['screen.home', 'screen.settings']);
  assert.deepEqual(settings.bindingRoles, ['LABEL']);
});

test('reverse queries pivot one relational inventory by string, element, surface and exact value', () => {
  const value = inventory();
  assert.deepEqual(
    occurrencesForString(value, 'fixture:string.settings').map((row) => row.elementRef),
    ['element.home.settings', 'element.settings.button'],
  );
  assert.deepEqual(
    stringsForElement(value, 'element.home.status').map((row) => row.sourceStringRef),
    ['fixture:string.status'],
  );
  assert.equal(occurrencesForSurface(value, 'screen.home').length, 2);
  assert.deepEqual(
    sourceStringsForExactValue(value, 'Settings').map((row) => row.sourceStringRef),
    ['fixture:string.settings', 'fixture:string.settings-alt'],
  );
});

test('same source string resolving to different values fails instead of silently choosing one', () => {
  assert.throws(() => createLocalizationInventory({
    inventoryRef: 'localization.bad',
    subjectRef: 'subject.bad',
    sourceSnapshot: { repositoryRef: 'repo.bad', commit: 'a'.repeat(40) },
    producer: { ref: 'producer.bad', version: 'bad/1' },
    occurrences: [
      {
        occurrenceRef: 'occurrence.bad.a',
        surfaceRef: 'screen.a',
        screenRef: 'screen.a',
        elementRef: 'element.a',
        parentElementRef: null,
        elementKind: 'BUTTON',
        bindingRole: 'LABEL',
        textRole: null,
        sourceStringRef: 'bad:string.same',
        sourceKey: 'same',
        sourceValue: 'One',
        sourcePath: null,
      },
      {
        occurrenceRef: 'occurrence.bad.b',
        surfaceRef: 'screen.b',
        screenRef: 'screen.b',
        elementRef: 'element.b',
        parentElementRef: null,
        elementKind: 'BUTTON',
        bindingRole: 'LABEL',
        textRole: null,
        sourceStringRef: 'bad:string.same',
        sourceKey: 'same',
        sourceValue: 'Two',
        sourcePath: null,
      },
    ],
  }), /inconsistent source values/);
});

test('CSV projections stay deterministic and quote human copy without becoming source truth', () => {
  const value = inventory();
  const occurrences = localizationOccurrencesCsv(value);
  const strings = localizationStringsCsv(value);
  assert.match(occurrences, /^occurrenceRef,surfaceRef,screenRef,elementRef,/);
  assert.match(occurrences, /fixture:string\.status,status,%1\$d of %2\$d ready/);
  assert.match(strings, /^sourceStringRef,sourceKey,sourceValue,formatSignature,/);
  assert.match(strings, /fixture:string\.status,status,%1\$d of %2\$d ready,1:INT\|2:INT/);
});
