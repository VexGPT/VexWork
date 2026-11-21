import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  LOCALIZATION_WORKSPACE_PIVOTS,
  filterLocalizationWorkspaceRows,
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

  const prodStrings = filterLocalizationWorkspaceRows(projection, 'STRINGS', {
    subjectRef: 'subject.vexlife-prod',
    localeRef: 'it',
    query: 'private-kept',
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

test('workspace rejects duplicate current inventories for one subject', () => {
  assert.throws(
    () => projectLocalizationWorkspace({ inventories: [prod, prod] }),
    /inventoryRef must be unique|one current inventory per subject/,
  );
});

// [VXG RealForever][VEXWORK][VEXBOARD][LOCALIZATION][A5-WORKSPACE]
