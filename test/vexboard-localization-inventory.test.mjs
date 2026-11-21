import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createLocalizationInventory,
  localizationFormatSignature,
  localizationOccurrencesCsv,
  localizationStringsCsv,
  localizationOccurrenceTarget,
  localizationValueForLocale,
  normalizeLocalizationInventory,
  normalizeLocalizationLocaleRef,
  observedLocalizationLocales,
  occurrencesForString,
  occurrencesForSurface,
  searchLocalizationStrings,
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
    sourceStrings: [
      { sourceStringRef: 'fixture:string.settings', sourceKey: 'settings', sourceValue: 'Settings', sourcePath: 'strings.json' },
      { sourceStringRef: 'fixture:string.settings-alt', sourceKey: 'settings-alt', sourceValue: 'Settings', sourcePath: 'strings.json' },
      { sourceStringRef: 'fixture:string.status', sourceKey: 'status', sourceValue: '%1$d of %2$d ready', sourcePath: 'strings.json' },
      { sourceStringRef: 'fixture:string.unmapped', sourceKey: 'unmapped', sourceValue: 'Not projected yet', sourcePath: 'strings.json' },
    ],
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

test('format signature preserves explicit argument identity without guessing implicit formatter indexing', () => {
  assert.deepEqual(localizationFormatSignature('%1$d of %2$d · %3$s').placeholders, [
    { ordinal: 1, argumentIndex: 1, type: 'INT', token: '%1$d' },
    { ordinal: 2, argumentIndex: 2, type: 'INT', token: '%2$d' },
    { ordinal: 3, argumentIndex: 3, type: 'STRING', token: '%3$s' },
  ]);
  assert.equal(localizationFormatSignature('%1$d of %2$d · %3$s').signature, 'arg1:INT|arg2:INT|arg3:STRING');
  assert.deepEqual(localizationFormatSignature('%s then %2$d').placeholders, [
    { ordinal: 1, argumentIndex: null, type: 'STRING', token: '%s' },
    { ordinal: 2, argumentIndex: 2, type: 'INT', token: '%2$d' },
  ]);
  assert.equal(localizationFormatSignature('100%% ready').signature, '');
  assert.deepEqual(localizationFormatSignature('reading {target} ({state})').placeholders, [
    { ordinal: 1, name: 'target', type: 'NAMED', token: '{target}' },
    { ordinal: 2, name: 'state', type: 'NAMED', token: '{state}' },
  ]);
  assert.equal(localizationFormatSignature('reading {target} ({state})').signature, 'name:target|name:state');
  assert.deepEqual(localizationFormatSignature('%1$s → {target}').placeholders, [
    { ordinal: 1, argumentIndex: 1, type: 'STRING', token: '%1$s' },
    { ordinal: 2, name: 'target', type: 'NAMED', token: '{target}' },
  ]);
});

test('inventory preserves full source catalog while mapping exact source-string identity to occurrences', () => {
  const value = inventory();
  assert.equal(value.schemaVersion, 'vexboard.localization-inventory/v1');
  assert.equal(value.summary.occurrenceCount, 4);
  assert.equal(value.summary.sourceStringCount, 4);
  assert.equal(value.summary.mappedSourceStringCount, 3);
  assert.equal(value.summary.unmappedSourceStringCount, 1);
  assert.equal(value.summary.reusedSourceStringCount, 1);
  assert.equal(value.summary.formatStringCount, 1);

  const settings = value.strings.find((row) => row.sourceStringRef === 'fixture:string.settings');
  assert.equal(settings.occurrenceRefs.length, 2);
  assert.equal(settings.mapped, true);
  assert.deepEqual(settings.screenRefs, ['screen.home', 'screen.settings']);

  const unmapped = value.strings.find((row) => row.sourceStringRef === 'fixture:string.unmapped');
  assert.equal(unmapped.mapped, false);
  assert.deepEqual(unmapped.occurrenceRefs, []);
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

test('materialized inventory reload validates the same normalized relationship truth', () => {
  const value = inventory();
  const roundTrip = JSON.parse(JSON.stringify(value));
  assert.deepEqual(normalizeLocalizationInventory(roundTrip), value);

  const drift = JSON.parse(JSON.stringify(value));
  drift.summary.sourceStringCount += 1;
  assert.throws(() => normalizeLocalizationInventory(drift), /materialized inventory disagrees/);
});

test('localization search finds source identity, value and where-used coordinates without inferring semantics', () => {
  const value = inventory();
  assert.deepEqual(
    searchLocalizationStrings(value, 'settings').map((row) => row.sourceStringRef),
    ['fixture:string.settings', 'fixture:string.settings-alt'],
  );
  assert.deepEqual(
    searchLocalizationStrings(value, 'screen.home').map((row) => row.sourceStringRef),
    ['fixture:string.settings', 'fixture:string.status'],
  );
  assert.deepEqual(searchLocalizationStrings(value, ''), []);
  assert.throws(() => searchLocalizationStrings(value, 'settings', { limit: 0 }), /search limit/);
});

test('occurrence target exposes the existing Screen Lens navigation coordinates only', () => {
  const value = inventory();
  assert.deepEqual(
    localizationOccurrenceTarget(value, 'occurrence.fixture.settings.label'),
    { screenRef: 'screen.settings', elementRef: 'element.settings.button' },
  );
  assert.throws(() => localizationOccurrenceTarget(value, 'occurrence.missing'), /unknown occurrence/);
});

test('locale refs normalize for inspection without inventing Product support', () => {
  assert.equal(normalizeLocalizationLocaleRef('EN'), 'en');
  assert.equal(normalizeLocalizationLocaleRef('zh-hant'), 'zh-Hant');
  assert.equal(normalizeLocalizationLocaleRef('es-419'), 'es-419');
  assert.throws(() => normalizeLocalizationLocaleRef('../ja'), /localeRef/);
});

test('locale value observation distinguishes source, observed variant, and missing without fallback inference', () => {
  const value = createLocalizationInventory({
    inventoryRef: 'localization.locale-fixture',
    subjectRef: 'subject.fixture',
    buildRef: 'main',
    sourceLocale: 'en',
    sourceSnapshot: { repositoryRef: 'repo.fixture', commit: 'b'.repeat(40) },
    producer: { ref: 'producer.fixture.localization', version: 'fixture/1' },
    sourceStrings: [
      {
        sourceStringRef: 'fixture:string.settings',
        sourceKey: 'settings',
        sourceValue: 'Settings',
        sourcePath: 'strings.json',
        localeVariants: { ja: '設定', 'zh-hant': '設定' },
      },
      {
        sourceStringRef: 'fixture:string.more',
        sourceKey: 'more',
        sourceValue: 'More',
        sourcePath: 'strings.json',
        localeVariants: { ja: 'その他' },
      },
    ],
    occurrences: [],
  });

  assert.deepEqual(observedLocalizationLocales(value), ['en', 'ja', 'zh-Hant']);
  assert.deepEqual(localizationValueForLocale(value, 'fixture:string.settings', 'EN'), {
    sourceStringRef: 'fixture:string.settings',
    localeRef: 'en',
    state: 'SOURCE',
    value: 'Settings',
    sourceValue: 'Settings',
  });
  assert.deepEqual(localizationValueForLocale(value, 'fixture:string.settings', 'zh-hant'), {
    sourceStringRef: 'fixture:string.settings',
    localeRef: 'zh-Hant',
    state: 'VARIANT',
    value: '設定',
    sourceValue: 'Settings',
  });
  assert.deepEqual(localizationValueForLocale(value, 'fixture:string.more', 'zh-Hant'), {
    sourceStringRef: 'fixture:string.more',
    localeRef: 'zh-Hant',
    state: 'MISSING',
    value: null,
    sourceValue: 'More',
  });
  assert.equal(value.locales.find((row) => row.localeRef === 'ja').completeness, 'OBSERVED_COMPLETE');
  assert.equal(value.locales.find((row) => row.localeRef === 'zh-Hant').completeness, 'OBSERVED_PARTIAL');
  assert.throws(() => createLocalizationInventory({
    inventoryRef: 'localization.bad-locale',
    subjectRef: 'subject.fixture',
    sourceLocale: 'en',
    sourceSnapshot: { repositoryRef: 'repo.fixture', commit: 'c'.repeat(40) },
    producer: { ref: 'producer.fixture.localization', version: 'fixture/1' },
    sourceStrings: [{
      sourceStringRef: 'fixture:string.bad',
      sourceKey: 'bad',
      sourceValue: 'Bad',
      localeVariants: { en: 'Duplicate source' },
    }],
    occurrences: [],
  }), /must not duplicate sourceLocale/);
});

test('occurrence referencing an absent source string fails rather than synthesizing source truth', () => {
  assert.throws(() => createLocalizationInventory({
    inventoryRef: 'localization.bad',
    subjectRef: 'subject.bad',
    sourceSnapshot: { repositoryRef: 'repo.bad', commit: 'a'.repeat(40) },
    producer: { ref: 'producer.bad', version: 'bad/1' },
    sourceStrings: [
      { sourceStringRef: 'bad:string.known', sourceKey: 'known', sourceValue: 'Known', sourcePath: 'strings.json' },
    ],
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
        sourceStringRef: 'bad:string.missing',
        sourceKey: 'missing',
        sourceValue: 'Missing',
        sourcePath: null,
      },
    ],
  }), /references unknown source string/);
});

test('CSV projections remain deterministic materialized views, including unmapped source rows', () => {
  const value = inventory();
  const occurrences = localizationOccurrencesCsv(value);
  const strings = localizationStringsCsv(value);
  assert.match(occurrences, /^occurrenceRef,surfaceRef,screenRef,elementRef,/);
  assert.match(strings, /^sourceStringRef,sourceKey,sourceValue,sourcePath,mapped,formatSignature,/);
  assert.match(strings, /fixture:string\.unmapped,unmapped,Not projected yet,strings\.json,false,/);
  assert.match(strings, /fixture:string\.status,status,%1\$d of %2\$d ready,strings\.json,true,arg1:INT\|arg2:INT/);
});
