import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  LOCALIZATION_WORKSPACE_PIVOTS,
  LOCALIZATION_WORKSPACE_SCHEMA,
  filterLocalizationWorkspaceRows,
  localizationWorkspaceStringValue,
  projectLocalizationWorkspace,
} from '../src/shared/vexboard-localization-workspace.mjs';
import { analyzeLocalizationConvergence } from '../src/shared/vexboard-localization-convergence.mjs';
import {
  createLocalizationChangeSet,
  createLocalizationChangeSetCollection,
} from '../src/shared/vexboard-localization-change-set.mjs';

const android = JSON.parse(fs.readFileSync(
  new URL('../projects/localization-architecture/inventory/vexlife-android.main.localization.json', import.meta.url),
  'utf8',
));
const prod = JSON.parse(fs.readFileSync(
  new URL('../projects/localization-architecture/inventory/vexlife-prod.main.localization.json', import.meta.url),
  'utf8',
));

test('global Localization Workspace projects current inventories through all earned pivots without new source identity', () => {
  const projection = projectLocalizationWorkspace({ inventories: [prod, android] });
  const convergence = analyzeLocalizationConvergence([android, prod]);

  assert.deepEqual(LOCALIZATION_WORKSPACE_PIVOTS, [
    'ELEMENTS', 'STRINGS', 'VALUES', 'GROUPS', 'LOCALES', 'COVERAGE', 'CHANGE_SETS',
  ]);
  assert.deepEqual(projection.subjectRefs, ['subject.vexlife-android', 'subject.vexlife-prod']);
  assert.equal(projection.summary.inventoryCount, 2);
  assert.equal(projection.summary.subjectCount, 2);
  assert.equal(projection.summary.sourceStringCount, 1434);
  assert.equal(projection.summary.occurrenceCount, 877);
  assert.equal(projection.summary.localeCount, 11);
  assert.equal(projection.summary.candidateGroupCount, convergence.summary.candidateGroupCount);
  assert.equal(projection.summary.alreadySharedSourceCount, convergence.summary.alreadySharedSourceCount);

  const prodPrivate = projection.strings.find((row) => row.sourceStringRef === 'vexlife-prod:workspace.status.private-kept');
  assert.ok(prodPrivate);
  assert.equal(prodPrivate.subjectRef, 'subject.vexlife-prod');
  assert.equal(prodPrivate.revision, 'a0edba10c93a95dae1a16d0f915f07788c5112ba');
  assert.equal(prodPrivate.localeRefs.includes('es'), true);
  assert.equal(prodPrivate.localeRefs.includes('zh-Hans'), true);

  const candidate = projection.groups.find((row) => row.groupType === 'CANDIDATE');
  assert.ok(candidate);
  assert.equal(candidate.sourceStringRefs.length, new Set(candidate.sourceStringRefs).size, 'grouping never rewrites Product string identity');
  assert.equal(['LIKELY_SHARED', 'NEEDS_REVIEW', 'KEEP_SEPARATE'].includes(candidate.disposition), true);
});

test('explicit missing locale work target remains visible without becoming Product support', () => {
  const projection = projectLocalizationWorkspace({
    inventories: [android, prod],
    workLocaleRefs: ['it'],
  });
  const italian = projection.locales.find((row) => row.localeRef === 'it');
  assert.ok(italian);
  assert.equal(italian.observedSubjectCount, 0);
  assert.equal(italian.completeSubjectCount, 0);
  assert.equal(italian.requestedChangeCount, 0);

  const coverage = filterLocalizationWorkspaceRows(projection, 'COVERAGE', { localeRef: 'it' });
  assert.equal(coverage.length, 2);
  assert.equal(coverage.every((row) => row.completeness === 'NOT_OBSERVED'), true);
  assert.equal(coverage.find((row) => row.subjectRef === 'subject.vexlife-android').missingStringCount, 405);
  assert.equal(coverage.find((row) => row.subjectRef === 'subject.vexlife-prod').missingStringCount, 1029);

  const privateKeptStrings = filterLocalizationWorkspaceRows(projection, 'STRINGS', {
    subjectRef: 'subject.vexlife-prod',
    localeRef: 'it',
    query: 'private-kept',
  });
  assert.deepEqual(
    privateKeptStrings.map((row) => row.sourceStringRef),
    [
      'vexlife-prod:workspace.description.private-kept',
      'vexlife-prod:workspace.status.private-kept',
    ],
    'a structured fragment remains allowed to match every distinct source identity that actually contains it',
  );

  const prodStrings = filterLocalizationWorkspaceRows(projection, 'STRINGS', {
    subjectRef: 'subject.vexlife-prod',
    localeRef: 'it',
    query: 'workspace.status.private-kept',
  });
  assert.equal(prodStrings.length, 1);
  assert.equal(prodStrings[0].sourceStringRef, 'vexlife-prod:workspace.status.private-kept');
  assert.equal(prodStrings[0].localeRefs.includes('it'), false, 'work target filtering must not relabel Italian as an observed Product locale');
});

test('coverage says NOT_OBSERVED instead of pretending a locale exists for a Product', () => {
  const projection = projectLocalizationWorkspace({ inventories: [android, prod] });
  const spanish = filterLocalizationWorkspaceRows(projection, 'COVERAGE', { localeRef: 'es' });
  assert.equal(spanish.length, 2);

  const androidEs = spanish.find((row) => row.subjectRef === 'subject.vexlife-android');
  const prodEs = spanish.find((row) => row.subjectRef === 'subject.vexlife-prod');
  assert.equal(androidEs.completeness, 'NOT_OBSERVED');
  assert.equal(androidEs.observedStringCount, 0);
  assert.equal(androidEs.missingStringCount, 405);
  assert.equal(prodEs.completeness, 'OBSERVED_COMPLETE');
  assert.equal(prodEs.observedStringCount, 1029);
  assert.equal(prodEs.missingStringCount, 0);
});

test('existing browser Change Sets reconcile against the current inventory in the global workspace', () => {
  const changeSet = createLocalizationChangeSet({
    changeSetRef: 'change-set.test.global-workspace',
    inventory: prod,
    changes: [{
      changeRef: 'change.test.global-workspace.private-kept.it',
      sourceStringRef: 'vexlife-prod:workspace.status.private-kept',
      locale: 'it',
      expectedValue: 'Conservata',
    }],
  });
  const projection = projectLocalizationWorkspace({
    inventories: [android, prod],
    changeSetCollection: createLocalizationChangeSetCollection([changeSet]),
  });

  assert.equal(projection.summary.changeSetCount, 1);
  assert.equal(projection.summary.activeChangeCount, 1);
  assert.equal(projection.changeSets.length, 1);
  assert.equal(projection.changeSets[0].state, 'OPEN_TRANSLATION');
  const italian = projection.locales.find((row) => row.localeRef === 'it');
  assert.ok(italian);
  assert.equal(italian.observedSubjectCount, 0);
  assert.equal(italian.requestedChangeCount, 1);
  const prodItalian = projection.coverage.find((row) => row.subjectRef === 'subject.vexlife-prod' && row.localeRef === 'it');
  const androidItalian = projection.coverage.find((row) => row.subjectRef === 'subject.vexlife-android' && row.localeRef === 'it');
  assert.equal(prodItalian.completeness, 'NOT_OBSERVED');
  assert.equal(prodItalian.requestedChangeCount, 1);
  assert.equal(androidItalian.requestedChangeCount, 0);
  assert.equal(projection.changeSets[0].currentValueOrNull, null);
  assert.equal(projection.changeSets[0].expectedValue, 'Conservata');
});

test('workspace filtering composes pivot, Product, locale and text without mutating the projection', () => {
  const projection = projectLocalizationWorkspace({ inventories: [android, prod] });
  const before = JSON.stringify(projection);

  const prodStrings = filterLocalizationWorkspaceRows(projection, 'STRINGS', {
    subjectRef: 'subject.vexlife-prod',
    query: 'private-kept',
  });
  assert.equal(prodStrings.some((row) => row.sourceStringRef === 'vexlife-prod:workspace.status.private-kept'), true);
  assert.equal(prodStrings.every((row) => row.subjectRef === 'subject.vexlife-prod'), true);

  const japaneseCoverage = filterLocalizationWorkspaceRows(projection, 'COVERAGE', { localeRef: 'ja' });
  assert.equal(japaneseCoverage.length, 2);

  const spanishElements = filterLocalizationWorkspaceRows(projection, 'ELEMENTS', { localeRef: 'es' });
  assert.equal(spanishElements.length, 687, 'complete Product locale relationships remain filterable from the Element pivot');
  assert.equal(spanishElements.every((row) => row.subjectRef === 'subject.vexlife-prod'), true);

  assert.equal(JSON.stringify(projection), before);
});


test('workspace text search follows active-pivot meaning instead of serialized hidden relations', () => {
  const projection = projectLocalizationWorkspace({ inventories: [android, prod] });
  const playStrings = filterLocalizationWorkspaceRows(projection, 'STRINGS', { query: 'play', limit: 5000 });

  assert.equal(playStrings[0].sourceStringRef, 'android:R.string.vexstream_music_play', 'exact visible Play ranks first');
  assert.equal(playStrings.some((row) => row.sourceStringRef === 'android:R.string.vexstream_music_play_all'), true);
  assert.equal(playStrings.some((row) => row.sourceStringRef === 'android:R.string.vexstream_music_now_playing'), true);
  assert.equal(playStrings.some((row) => row.sourceStringRef === 'android:R.string.close'), false, 'hidden element.player relation must not leak into STRINGS search');
  assert.equal(playStrings.some((row) => row.sourceStringRef === 'android:R.string.events_attention_lab_blocking'), false, 'displayed must not match play');
  assert.equal(playStrings.some((row) => row.sourceStringRef === 'android:R.string.events_attention_lab_seed'), false, 'Replay must not match play');

  const replayStrings = filterLocalizationWorkspaceRows(projection, 'STRINGS', { query: 'replay' });
  assert.equal(replayStrings.some((row) => row.sourceStringRef === 'android:R.string.events_attention_lab_seed'), true);
});

test('workspace search keeps relationship locality with the pivot where that relationship is visible', () => {
  const projection = {
    schemaVersion: LOCALIZATION_WORKSPACE_SCHEMA,
    workLocaleRefs: [],
    strings: [{
      subjectRef: 'subject.test',
      sourceStringRef: 'android:R.string.close',
      sourceValue: 'Close',
      sourcePath: 'app/src/main/res/values/strings.xml',
      formatSignature: '',
      elementRefs: ['element.player.sheet.close'],
    }],
    elements: [{
      subjectRef: 'subject.test',
      elementRef: 'element.player.sheet.close',
      screenRef: 'screen.music',
      textRole: 'LABEL',
      bindingRole: 'LABEL',
      sourceStringRef: 'android:R.string.close',
      sourceValue: 'Close',
    }],
    values: [],
    groups: [],
    locales: [],
    coverage: [],
    changeSets: [],
  };

  assert.equal(filterLocalizationWorkspaceRows(projection, 'STRINGS', { query: 'play' }).length, 0);
  assert.equal(filterLocalizationWorkspaceRows(projection, 'ELEMENTS', { query: 'play' }).length, 1);
});

test('workspace search is case/diacritic tolerant, punctuation-aware, and ranks before applying the row limit', () => {
  const prefixRows = Array.from({ length: 800 }, (_, index) => ({
    subjectRef: 'subject.test',
    sourceStringRef: `android:R.string.player_${String(index).padStart(4, '0')}`,
    sourceValue: `Player ${index}`,
    sourcePath: 'app/src/main/res/values/strings.xml',
    formatSignature: '',
  }));
  const projection = {
    schemaVersion: LOCALIZATION_WORKSPACE_SCHEMA,
    workLocaleRefs: [],
    strings: [
      ...prefixRows,
      {
        subjectRef: 'subject.test',
        sourceStringRef: 'android:R.string.play',
        sourceValue: 'Play',
        sourcePath: 'app/src/main/res/values/strings.xml',
        formatSignature: '',
      },
      {
        subjectRef: 'subject.test',
        sourceStringRef: 'vexlife-prod:workspace.status.private-kept',
        sourceValue: 'Conversación',
        sourcePath: 'src/locales/es.json',
        formatSignature: '',
      },
      {
        subjectRef: 'subject.test',
        sourceStringRef: 'test:ja.play',
        sourceValue: '再生',
        sourcePath: 'src/locales/ja.json',
        formatSignature: '',
      },
    ],
    elements: [],
    values: [],
    groups: [],
    locales: [],
    coverage: [],
    changeSets: [],
  };

  assert.equal(filterLocalizationWorkspaceRows(projection, 'STRINGS', { query: 'play', limit: 10 })[0].sourceStringRef, 'android:R.string.play');
  assert.equal(filterLocalizationWorkspaceRows(projection, 'STRINGS', { query: 'private-kept' }).length, 1);
  assert.equal(filterLocalizationWorkspaceRows(projection, 'STRINGS', { query: 'conversacion' }).length, 1);
  assert.equal(filterLocalizationWorkspaceRows(projection, 'STRINGS', { query: '再生' }).length, 1);
  assert.equal(filterLocalizationWorkspaceRows(projection, 'STRINGS', { query: '---' }).length, 0);
});


test('STRINGS can compare one selected locale beside source truth without rewriting source identity', () => {
  const projection = projectLocalizationWorkspace({ inventories: [android, prod] });
  const rawLocalized = prod.strings.find((row) => (
    row.localeVariants?.es
    && row.localeVariants?.ja
    && row.localeVariants.es !== row.sourceValue
    && row.localeVariants.es !== row.localeVariants.ja
  ));
  assert.ok(rawLocalized, 'Product fixture must contain at least one distinct Spanish/Japanese variant');

  const row = projection.strings.find((candidate) => candidate.sourceStringRef === rawLocalized.sourceStringRef);
  assert.ok(row);
  assert.equal(row.sourceValue, rawLocalized.sourceValue);
  assert.deepEqual(row.localeVariants, rawLocalized.localeVariants);

  const spanish = localizationWorkspaceStringValue(row, 'es');
  assert.equal(spanish.state, 'VARIANT');
  assert.equal(spanish.value, rawLocalized.localeVariants.es);

  const source = localizationWorkspaceStringValue(row, row.sourceLocale);
  assert.equal(source.state, 'SOURCE');
  assert.equal(source.value, row.sourceValue);

  const androidOnly = projection.strings.find((candidate) => candidate.subjectRef === 'subject.vexlife-android');
  const missingSpanish = localizationWorkspaceStringValue(androidOnly, 'es');
  assert.equal(missingSpanish.state, 'MISSING');
  assert.equal(missingSpanish.value, null, 'missing locale must not fall back to the source value');
});

test('STRINGS search includes only the currently visible comparison locale value', () => {
  const projection = projectLocalizationWorkspace({ inventories: [android, prod] });
  const rawLocalized = prod.strings.find((row) => (
    row.localeVariants?.es
    && row.localeVariants?.ja
    && row.localeVariants.es !== row.sourceValue
    && row.localeVariants.es !== row.localeVariants.ja
  ));
  assert.ok(rawLocalized);

  const spanishSearch = filterLocalizationWorkspaceRows(projection, 'STRINGS', {
    subjectRef: 'subject.vexlife-prod',
    valueLocaleRef: 'es',
    query: rawLocalized.localeVariants.es,
  });
  assert.equal(spanishSearch.some((row) => row.sourceStringRef === rawLocalized.sourceStringRef), true);

  const japaneseSearch = filterLocalizationWorkspaceRows(projection, 'STRINGS', {
    subjectRef: 'subject.vexlife-prod',
    valueLocaleRef: 'ja',
    query: rawLocalized.localeVariants.es,
  });
  assert.equal(
    japaneseSearch.some((row) => row.sourceStringRef === rawLocalized.sourceStringRef),
    false,
    'a hidden Spanish value must not remain searchable while Japanese is the visible comparison locale',
  );
});

test('workspace rejects duplicate current inventories for one subject', () => {
  assert.throws(
    () => projectLocalizationWorkspace({ inventories: [prod, prod] }),
    /inventoryRef must be unique|one current inventory per subject/,
  );
});

// [VXG RealForever][VEXWORK][VEXBOARD][LOCALIZATION][A5-WORKSPACE]
