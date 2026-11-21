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
  assert.equal(JSON.stringify(projection), before);
});

test('workspace rejects duplicate current inventories for one subject', () => {
  assert.throws(
    () => projectLocalizationWorkspace({ inventories: [prod, prod] }),
    /inventoryRef must be unique|one current inventory per subject/,
  );
});

// [VXG RealForever][VEXWORK][VEXBOARD][LOCALIZATION][A5-WORKSPACE]
