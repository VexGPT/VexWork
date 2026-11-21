import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  analyzeLocalizationConvergence,
  localizationConvergenceCsv,
} from '../src/shared/vexboard-localization-convergence.mjs';
import { createLocalizationInventory } from '../src/shared/vexboard-localization-inventory.mjs';

function inventory({
  inventoryRef = 'localization.fixture',
  subjectRef = 'subject.fixture',
  repositoryRef = 'repo.fixture',
  commit = '1'.repeat(40),
  strings,
  occurrences = [],
}) {
  return createLocalizationInventory({
    inventoryRef,
    subjectRef,
    buildRef: 'main',
    sourceLocale: 'en',
    sourceSnapshot: { repositoryRef, commit },
    producer: { ref: 'producer.fixture', version: 'fixture/1' },
    sourceStrings: strings,
    occurrences,
  });
}

function occurrence({
  ref,
  sourceStringRef,
  sourceKey,
  sourceValue,
  screenRef = 'screen.settings',
  surfaceRef = 'surface.settings',
  elementRef,
  bindingRole = 'LABEL',
  textRole = 'LABEL',
}) {
  return {
    occurrenceRef: ref,
    surfaceRef,
    screenRef,
    elementRef,
    parentElementRef: null,
    elementKind: 'TEXT',
    bindingRole,
    textRole,
    sourceStringRef,
    sourceKey,
    sourceValue,
    sourcePath: 'Fixture.kt',
  };
}

test('exact value plus compatible context remains a derived LIKELY_SHARED candidate, not semantic identity', () => {
  const source = inventory({
    strings: [
      { sourceStringRef: 'fixture:string.nav_settings', sourceKey: 'nav_settings', sourceValue: 'Settings', sourcePath: 'strings.xml' },
      { sourceStringRef: 'fixture:string.settings_title', sourceKey: 'settings_title', sourceValue: 'Settings', sourcePath: 'strings.xml' },
    ],
    occurrences: [
      occurrence({
        ref: 'occurrence.nav-settings',
        sourceStringRef: 'fixture:string.nav_settings',
        sourceKey: 'nav_settings',
        sourceValue: 'Settings',
        elementRef: 'element.nav.settings',
      }),
      occurrence({
        ref: 'occurrence.settings-title',
        sourceStringRef: 'fixture:string.settings_title',
        sourceKey: 'settings_title',
        sourceValue: 'Settings',
        elementRef: 'element.settings.title',
      }),
    ],
  });
  const analysis = analyzeLocalizationConvergence(source);
  assert.equal(analysis.candidateGroups.length, 1);
  const group = analysis.candidateGroups[0];
  assert.equal(group.suggestedDisposition, 'LIKELY_SHARED');
  assert.deepEqual(group.evidence, [
    'NORMALIZED_SOURCE_VALUE',
    'EXACT_SOURCE_VALUE',
    'SAME_FORMAT_SIGNATURE',
    'SAME_TEXT_ROLE',
    'SAME_DOMAIN',
    'NO_VARIANT_EVIDENCE',
  ]);
  assert.deepEqual(group.sourceStringRefs, [
    'fixture:string.nav_settings',
    'fixture:string.settings_title',
  ]);
  assert.equal(Object.hasOwn(group, 'semanticGroupRef'), false, 'derived candidate must not mint accepted semantic identity');
});

test('cross-Product value equality remains review evidence instead of automatic sharing', () => {
  const source = inventory({
    strings: [
      { sourceStringRef: 'fixture:string.count.a', sourceKey: 'count_a', sourceValue: '%1$d items' },
      { sourceStringRef: 'fixture:string.count.b', sourceKey: 'count_b', sourceValue: '%1$s items' },
    ],
  });
  // Different source bytes do not form one candidate even when prose is similar.
  assert.equal(analyzeLocalizationConvergence(source).candidateGroups.length, 0);

  const cross = analyzeLocalizationConvergence([
    inventory({
      inventoryRef: 'localization.left',
      subjectRef: 'subject.left',
      strings: [{ sourceStringRef: 'left:string.count', sourceKey: 'count', sourceValue: '%1$d items' }],
    }),
    inventory({
      inventoryRef: 'localization.right',
      subjectRef: 'subject.right',
      commit: '2'.repeat(40),
      strings: [{ sourceStringRef: 'right:string.count', sourceKey: 'count', sourceValue: '%1$d items' }],
    }),
  ]);
  assert.equal(cross.candidateGroups[0].suggestedDisposition, 'NEEDS_REVIEW', 'cross-Product equality remains review, not automatic sharing');
});



test('analysis rejects multiple revisions of one subject so temporal copies cannot look like duplicates', () => {
  const left = inventory({
    inventoryRef: 'localization.fixture.left',
    subjectRef: 'subject.fixture',
    strings: [{ sourceStringRef: 'fixture:string.settings', sourceKey: 'settings', sourceValue: 'Settings' }],
  });
  const right = inventory({
    inventoryRef: 'localization.fixture.right',
    subjectRef: 'subject.fixture',
    commit: '2'.repeat(40),
    strings: [{ sourceStringRef: 'fixture:string.settings', sourceKey: 'settings', sourceValue: 'Settings' }],
  });
  assert.throws(
    () => analyzeLocalizationConvergence([left, right]),
    /one current inventory per subject is required/,
  );
});

test('divergent locale variants force KEEP_SEPARATE while equal variant sets remain evidence only', () => {
  const divergent = inventory({
    strings: [
      { sourceStringRef: 'fixture:string.open.action', sourceKey: 'open_action', sourceValue: 'Open', localeVariants: { es: 'Abrir' } },
      { sourceStringRef: 'fixture:string.open.state', sourceKey: 'open_state', sourceValue: 'Open', localeVariants: { es: 'Abierto' } },
    ],
    occurrences: [
      occurrence({
        ref: 'occurrence.open-action',
        sourceStringRef: 'fixture:string.open.action',
        sourceKey: 'open_action',
        sourceValue: 'Open',
        elementRef: 'element.open.action',
      }),
      occurrence({
        ref: 'occurrence.open-state',
        sourceStringRef: 'fixture:string.open.state',
        sourceKey: 'open_state',
        sourceValue: 'Open',
        elementRef: 'element.open.state',
      }),
    ],
  });
  const group = analyzeLocalizationConvergence(divergent).candidateGroups[0];
  assert.equal(group.suggestedDisposition, 'KEEP_SEPARATE');
  assert.ok(group.evidence.includes('DIVERGENT_TRANSLATION_SET'));
});

test('unmapped candidates stay NEEDS_REVIEW rather than becoming likely-shared from value equality alone', () => {
  const source = inventory({
    strings: [
      { sourceStringRef: 'fixture:string.a', sourceKey: 'a', sourceValue: 'Unavailable' },
      { sourceStringRef: 'fixture:string.b', sourceKey: 'b', sourceValue: 'Unavailable' },
    ],
  });
  const group = analyzeLocalizationConvergence(source).candidateGroups[0];
  assert.equal(group.suggestedDisposition, 'NEEDS_REVIEW');
  assert.ok(group.evidence.includes('TEXT_ROLE_CONTEXT_INCOMPLETE'));
  assert.ok(group.evidence.includes('UNMAPPED_CONTEXT'));
});

test('already reused source identities remain separate from duplicate candidate groups', () => {
  const source = inventory({
    strings: [{ sourceStringRef: 'fixture:string.settings', sourceKey: 'settings', sourceValue: 'Settings' }],
    occurrences: [
      occurrence({
        ref: 'occurrence.settings.nav',
        sourceStringRef: 'fixture:string.settings',
        sourceKey: 'settings',
        sourceValue: 'Settings',
        elementRef: 'element.nav.settings',
      }),
      occurrence({
        ref: 'occurrence.settings.title',
        sourceStringRef: 'fixture:string.settings',
        sourceKey: 'settings',
        sourceValue: 'Settings',
        elementRef: 'element.settings.title',
      }),
    ],
  });
  const analysis = analyzeLocalizationConvergence(source);
  assert.equal(analysis.candidateGroups.length, 0);
  assert.equal(analysis.sharedSourceIdentities.length, 1);
  assert.equal(analysis.sharedSourceIdentities[0].disposition, 'ALREADY_SHARED');
});

test('candidate grouping uses minimal Unicode NFC normalization without case or whitespace collapse', () => {
  const source = inventory({
    strings: [
      { sourceStringRef: 'fixture:string.cafe.composed', sourceKey: 'cafe_composed', sourceValue: 'Café' },
      { sourceStringRef: 'fixture:string.cafe.decomposed', sourceKey: 'cafe_decomposed', sourceValue: 'Cafe\u0301' },
      { sourceStringRef: 'fixture:string.cafe.upper', sourceKey: 'cafe_upper', sourceValue: 'CAFÉ' },
      { sourceStringRef: 'fixture:string.cafe.spaced', sourceKey: 'cafe_spaced', sourceValue: ' Café ' },
    ],
  });
  const analysis = analyzeLocalizationConvergence(source);
  assert.equal(analysis.candidateGroups.length, 1);
  assert.equal(analysis.candidateGroups[0].normalizedSourceValue, 'Café');
  assert.equal(analysis.candidateGroups[0].memberCount, 2);
  assert.equal(analysis.candidateGroups[0].evidence.includes('EXACT_SOURCE_VALUE'), false);
});

test('CSV is a deterministic projection of candidate evidence, not source authority', () => {
  const source = inventory({
    strings: [
      { sourceStringRef: 'fixture:string.a', sourceKey: 'a', sourceValue: 'Settings' },
      { sourceStringRef: 'fixture:string.b', sourceKey: 'b', sourceValue: 'Settings' },
    ],
  });
  const analysis = analyzeLocalizationConvergence(source);
  const csv = localizationConvergenceCsv(analysis);
  assert.match(csv, /^candidateGroupRef,normalizedSourceValue,suggestedDisposition,evidence,/);
  assert.match(csv, /localization-candidate-group\.0001/);
  assert.match(csv, /NEEDS_REVIEW/);
  assert.equal(localizationConvergenceCsv(analysis), csv);
});

test('Android patient zero exposes exact candidate counts without collapsing source identity', () => {
  const source = JSON.parse(fs.readFileSync(
    new URL('../projects/localization-architecture/inventory/vexlife-android.main.localization.json', import.meta.url),
    'utf8',
  ));
  const analysis = analyzeLocalizationConvergence(source);
  assert.equal(analysis.summary.sourceStringCount, 405);
  assert.equal(analysis.summary.candidateGroupCount, 13);
  assert.equal(analysis.summary.candidateMemberCount, 26);
  assert.equal(analysis.summary.dispositions.LIKELY_SHARED, 11);
  assert.equal(analysis.summary.dispositions.NEEDS_REVIEW, 2);
  assert.equal(analysis.summary.dispositions.KEEP_SEPARATE, 0);
  assert.equal(analysis.summary.alreadySharedSourceCount, 6);
  assert.equal(analysis.candidateGroups.every((group) => group.memberCount === 2), true);
});

// [VXG RealForever][VEXWORK][VEXBOARD][LOCALIZATION][A4-CONVERGENCE]
