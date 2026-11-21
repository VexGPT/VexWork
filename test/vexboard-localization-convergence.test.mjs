import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  analyzeLocalizationConvergence,
  applyLocalizationConvergenceReviews,
  createLocalizationConvergenceReview,
  localizationConvergenceCandidateBinding,
  localizationConvergenceCsv,
  normalizeLocalizationConvergenceReview,
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

test('observed conflicting locale variants force KEEP_SEPARATE', () => {
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
  assert.equal(group.evidence.includes('VARIANT_EVIDENCE_INCOMPLETE'), false);
});

test('missing locale variants stay incomplete review evidence instead of becoming divergence', () => {
  const partial = inventory({
    strings: [
      { sourceStringRef: 'fixture:string.open.action', sourceKey: 'open_action', sourceValue: 'Open', localeVariants: { es: 'Abrir' } },
      { sourceStringRef: 'fixture:string.open.secondary', sourceKey: 'open_secondary', sourceValue: 'Open' },
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
        ref: 'occurrence.open-secondary',
        sourceStringRef: 'fixture:string.open.secondary',
        sourceKey: 'open_secondary',
        sourceValue: 'Open',
        elementRef: 'element.open.secondary',
      }),
    ],
  });
  const group = analyzeLocalizationConvergence(partial).candidateGroups[0];
  assert.equal(group.suggestedDisposition, 'NEEDS_REVIEW');
  assert.ok(group.evidence.includes('VARIANT_EVIDENCE_INCOMPLETE'));
  assert.equal(group.evidence.includes('DIVERGENT_TRANSLATION_SET'), false);
});

test('equal complete locale variants are compatible evidence only, never semantic identity', () => {
  const aligned = inventory({
    strings: [
      { sourceStringRef: 'fixture:string.settings.nav', sourceKey: 'settings_nav', sourceValue: 'Settings', localeVariants: { es: 'Configuración' } },
      { sourceStringRef: 'fixture:string.settings.title', sourceKey: 'settings_title', sourceValue: 'Settings', localeVariants: { es: 'Configuración' } },
    ],
    occurrences: [
      occurrence({
        ref: 'occurrence.settings-nav',
        sourceStringRef: 'fixture:string.settings.nav',
        sourceKey: 'settings_nav',
        sourceValue: 'Settings',
        elementRef: 'element.settings.nav',
      }),
      occurrence({
        ref: 'occurrence.settings-title',
        sourceStringRef: 'fixture:string.settings.title',
        sourceKey: 'settings_title',
        sourceValue: 'Settings',
        elementRef: 'element.settings.title',
      }),
    ],
  });
  const group = analyzeLocalizationConvergence(aligned).candidateGroups[0];
  assert.equal(group.suggestedDisposition, 'LIKELY_SHARED');
  assert.ok(group.evidence.includes('SAME_TRANSLATION_SET'));
  assert.equal(Object.hasOwn(group, 'semanticGroupRef'), false);
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
  assert.equal(analysis.summary.dispositions.LIKELY_SHARED, 4);
  assert.equal(analysis.summary.dispositions.NEEDS_REVIEW, 9);
  assert.equal(analysis.summary.dispositions.KEEP_SEPARATE, 0);
  assert.equal(analysis.summary.alreadySharedSourceCount, 6);
  assert.equal(analysis.candidateGroups.every((group) => group.memberCount === 2), true);
});

// [VXG RealForever][VEXWORK][VEXBOARD][LOCALIZATION][A4-CONVERGENCE]

test('explicit ACCEPT_SHARED review mints semanticGroupRef without rewriting derived suggestion or source identities', () => {
  const source = inventory({
    strings: [
      { sourceStringRef: 'fixture:string.settings.nav', sourceKey: 'settings_nav', sourceValue: 'Settings' },
      { sourceStringRef: 'fixture:string.settings.title', sourceKey: 'settings_title', sourceValue: 'Settings' },
    ],
    occurrences: [
      occurrence({
        ref: 'occurrence.settings-nav',
        sourceStringRef: 'fixture:string.settings.nav',
        sourceKey: 'settings_nav',
        sourceValue: 'Settings',
        elementRef: 'element.settings.nav',
      }),
      occurrence({
        ref: 'occurrence.settings-title',
        sourceStringRef: 'fixture:string.settings.title',
        sourceKey: 'settings_title',
        sourceValue: 'Settings',
        elementRef: 'element.settings.title',
      }),
    ],
  });
  const analysis = analyzeLocalizationConvergence(source);
  const candidate = analysis.candidateGroups[0];
  const review = createLocalizationConvergenceReview({
    reviewRef: 'review.localization.settings.shared',
    candidate,
    decision: 'ACCEPT_SHARED',
    semanticGroupRefOrNull: 'semantic-group.settings',
    rationale: 'Navigation and title use the same settings concept.',
    reviewedAtOrNull: '2026-11-21T12:00:00.000Z',
  });
  const projection = applyLocalizationConvergenceReviews(analysis, [review]);

  assert.equal(candidate.suggestedDisposition, 'LIKELY_SHARED');
  assert.equal(projection.candidateGroups[0].suggestedDisposition, 'LIKELY_SHARED');
  assert.equal(projection.candidateGroups[0].review.decision, 'ACCEPT_SHARED');
  assert.equal(projection.acceptedSemanticGroups.length, 1);
  assert.equal(projection.acceptedSemanticGroups[0].semanticGroupRef, 'semantic-group.settings');
  assert.deepEqual(
    projection.acceptedSemanticGroups[0].memberRefs.map((entry) => entry.sourceStringRef),
    ['fixture:string.settings.nav', 'fixture:string.settings.title'],
  );
  assert.deepEqual(candidate.sourceStringRefs, [
    'fixture:string.settings.nav',
    'fixture:string.settings.title',
  ], 'accepted semantic grouping never rewrites Product source identities');
});

test('review binding ignores ephemeral candidate ordinal but binds exact member/evidence snapshot', () => {
  const source = inventory({
    strings: [
      { sourceStringRef: 'fixture:string.a', sourceKey: 'a', sourceValue: 'Settings' },
      { sourceStringRef: 'fixture:string.b', sourceKey: 'b', sourceValue: 'Settings' },
    ],
    occurrences: [
      occurrence({
        ref: 'occurrence.a',
        sourceStringRef: 'fixture:string.a',
        sourceKey: 'a',
        sourceValue: 'Settings',
        elementRef: 'element.a',
      }),
      occurrence({
        ref: 'occurrence.b',
        sourceStringRef: 'fixture:string.b',
        sourceKey: 'b',
        sourceValue: 'Settings',
        elementRef: 'element.b',
      }),
    ],
  });
  const analysis = analyzeLocalizationConvergence(source);
  const candidate = analysis.candidateGroups[0];
  const review = createLocalizationConvergenceReview({
    reviewRef: 'review.localization.settings.keep',
    candidate,
    decision: 'KEEP_SEPARATE',
    rationale: 'Distinct source ownership remains intentional.',
  });

  const renumberedCandidate = Object.freeze({
    ...candidate,
    candidateGroupRef: 'localization-candidate-group.0999',
  });
  const renumberedAnalysis = Object.freeze({
    ...analysis,
    candidateGroups: Object.freeze([renumberedCandidate]),
  });
  const projection = applyLocalizationConvergenceReviews(renumberedAnalysis, [review]);

  assert.equal(projection.candidateGroups[0].review.reviewRef, review.reviewRef);
  assert.equal(projection.staleReviews.length, 0);
  assert.deepEqual(
    localizationConvergenceCandidateBinding(candidate),
    localizationConvergenceCandidateBinding(renumberedCandidate),
  );
});

test('evidence drift makes a prior review stale instead of silently carrying the decision forward', () => {
  const initial = inventory({
    strings: [
      { sourceStringRef: 'fixture:string.open.a', sourceKey: 'open_a', sourceValue: 'Open' },
      { sourceStringRef: 'fixture:string.open.b', sourceKey: 'open_b', sourceValue: 'Open' },
    ],
    occurrences: [
      occurrence({
        ref: 'occurrence.open-a',
        sourceStringRef: 'fixture:string.open.a',
        sourceKey: 'open_a',
        sourceValue: 'Open',
        elementRef: 'element.open.a',
      }),
      occurrence({
        ref: 'occurrence.open-b',
        sourceStringRef: 'fixture:string.open.b',
        sourceKey: 'open_b',
        sourceValue: 'Open',
        elementRef: 'element.open.b',
      }),
    ],
  });
  const initialAnalysis = analyzeLocalizationConvergence(initial);
  const review = createLocalizationConvergenceReview({
    reviewRef: 'review.localization.open.shared',
    candidate: initialAnalysis.candidateGroups[0],
    decision: 'ACCEPT_SHARED',
    semanticGroupRefOrNull: 'semantic-group.open',
    rationale: 'Current evidence supports one meaning.',
  });

  const evolved = inventory({
    commit: '2'.repeat(40),
    strings: [
      { sourceStringRef: 'fixture:string.open.a', sourceKey: 'open_a', sourceValue: 'Open', localeVariants: { es: 'Abrir' } },
      { sourceStringRef: 'fixture:string.open.b', sourceKey: 'open_b', sourceValue: 'Open' },
    ],
    occurrences: initial.occurrences,
  });
  const projection = applyLocalizationConvergenceReviews(analyzeLocalizationConvergence(evolved), [review]);

  assert.equal(projection.summary.reviewedCandidateCount, 0);
  assert.equal(projection.summary.acceptedSemanticGroupCount, 0);
  assert.equal(projection.summary.staleReviewCount, 1);
  assert.equal(projection.staleReviews[0].reason, 'CURRENT_CANDIDATE_BINDING_NOT_FOUND');
});

test('strong separation evidence cannot be overridden by ACCEPT_SHARED creation or imported review bytes', () => {
  const source = inventory({
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
  const analysis = analyzeLocalizationConvergence(source);
  const candidate = analysis.candidateGroups[0];
  assert.equal(candidate.suggestedDisposition, 'KEEP_SEPARATE');

  assert.throws(() => createLocalizationConvergenceReview({
    reviewRef: 'review.localization.open.forced',
    candidate,
    decision: 'ACCEPT_SHARED',
    semanticGroupRefOrNull: 'semantic-group.open',
    rationale: 'Attempted override.',
  }), /cannot override current strong separation evidence/);

  const forged = normalizeLocalizationConvergenceReview({
    schemaVersion: 'vexboard.localization-convergence-review/v1',
    reviewRef: 'review.localization.open.forged',
    decision: 'ACCEPT_SHARED',
    candidateGroupRefAtReview: candidate.candidateGroupRef,
    candidateBinding: localizationConvergenceCandidateBinding(candidate),
    suggestedDispositionAtReview: candidate.suggestedDisposition,
    semanticGroupRefOrNull: 'semantic-group.open',
    rationale: 'Hand-authored bytes must not bypass apply-time safety.',
    reviewedAtOrNull: null,
  });
  assert.throws(
    () => applyLocalizationConvergenceReviews(analysis, [forged]),
    /cannot ACCEPT_SHARED current strong separation evidence/,
  );
});

test('KEEP_SEPARATE review records human judgment without changing analyzer evidence', () => {
  const source = inventory({
    strings: [
      { sourceStringRef: 'fixture:string.events.nav', sourceKey: 'events_nav', sourceValue: 'Events' },
      { sourceStringRef: 'fixture:string.events.title', sourceKey: 'events_title', sourceValue: 'Events' },
    ],
    occurrences: [
      occurrence({
        ref: 'occurrence.events-nav',
        sourceStringRef: 'fixture:string.events.nav',
        sourceKey: 'events_nav',
        sourceValue: 'Events',
        elementRef: 'element.events.nav',
      }),
      occurrence({
        ref: 'occurrence.events-title',
        sourceStringRef: 'fixture:string.events.title',
        sourceKey: 'events_title',
        sourceValue: 'Events',
        elementRef: 'element.events.title',
      }),
    ],
  });
  const analysis = analyzeLocalizationConvergence(source);
  const candidate = analysis.candidateGroups[0];
  const review = createLocalizationConvergenceReview({
    reviewRef: 'review.localization.events.separate',
    candidate,
    decision: 'KEEP_SEPARATE',
    rationale: 'Navigation taxonomy and page-title identity remain intentionally independent.',
  });
  const projection = applyLocalizationConvergenceReviews(analysis, [review]);

  assert.equal(candidate.suggestedDisposition, 'LIKELY_SHARED');
  assert.equal(projection.candidateGroups[0].suggestedDisposition, 'LIKELY_SHARED');
  assert.equal(projection.candidateGroups[0].review.decision, 'KEEP_SEPARATE');
  assert.equal(projection.summary.keptSeparateCount, 1);
  assert.equal(projection.acceptedSemanticGroups.length, 0);
});

test('review collection rejects duplicate exact bindings and duplicate semantic-group identities', () => {
  const source = inventory({
    strings: [
      { sourceStringRef: 'fixture:string.a', sourceKey: 'a', sourceValue: 'Settings' },
      { sourceStringRef: 'fixture:string.b', sourceKey: 'b', sourceValue: 'Settings' },
    ],
    occurrences: [
      occurrence({
        ref: 'occurrence.a',
        sourceStringRef: 'fixture:string.a',
        sourceKey: 'a',
        sourceValue: 'Settings',
        elementRef: 'element.a',
      }),
      occurrence({
        ref: 'occurrence.b',
        sourceStringRef: 'fixture:string.b',
        sourceKey: 'b',
        sourceValue: 'Settings',
        elementRef: 'element.b',
      }),
    ],
  });
  const analysis = analyzeLocalizationConvergence(source);
  const candidate = analysis.candidateGroups[0];
  const first = createLocalizationConvergenceReview({
    reviewRef: 'review.localization.settings.first',
    candidate,
    decision: 'ACCEPT_SHARED',
    semanticGroupRefOrNull: 'semantic-group.settings',
    rationale: 'First decision.',
  });
  const second = createLocalizationConvergenceReview({
    reviewRef: 'review.localization.settings.second',
    candidate,
    decision: 'KEEP_SEPARATE',
    rationale: 'Conflicting decision.',
  });
  assert.throws(
    () => applyLocalizationConvergenceReviews(analysis, [first, second]),
    /one review decision per exact candidate binding/,
  );

  const otherSource = inventory({
    inventoryRef: 'localization.other',
    subjectRef: 'subject.other',
    commit: '2'.repeat(40),
    strings: [
      { sourceStringRef: 'other:string.a', sourceKey: 'a', sourceValue: 'Home' },
      { sourceStringRef: 'other:string.b', sourceKey: 'b', sourceValue: 'Home' },
    ],
    occurrences: [
      occurrence({
        ref: 'occurrence.other-a',
        sourceStringRef: 'other:string.a',
        sourceKey: 'a',
        sourceValue: 'Home',
        elementRef: 'element.other.a',
      }),
      occurrence({
        ref: 'occurrence.other-b',
        sourceStringRef: 'other:string.b',
        sourceKey: 'b',
        sourceValue: 'Home',
        elementRef: 'element.other.b',
      }),
    ],
  });
  const combined = analyzeLocalizationConvergence([source, otherSource]);
  const reviews = combined.candidateGroups.map((group, index) => createLocalizationConvergenceReview({
    reviewRef: `review.localization.shared-ref.${index + 1}`,
    candidate: group,
    decision: 'ACCEPT_SHARED',
    semanticGroupRefOrNull: 'semantic-group.duplicate',
    rationale: 'Fixture duplicate semantic group ref.',
  }));
  assert.throws(
    () => applyLocalizationConvergenceReviews(combined, reviews),
    /semanticGroupRefOrNull must be unique/,
  );
});


// [VXG RealForever][VEXWORK][VEXBOARD][LOCALIZATION][A4-CONVERGENCE-REVIEW]

test('stale historical acceptance may be re-reviewed with the same semanticGroupRef', () => {
  const initial = inventory({
    strings: [
      { sourceStringRef: 'fixture:string.settings.a', sourceKey: 'settings_a', sourceValue: 'Settings' },
      { sourceStringRef: 'fixture:string.settings.b', sourceKey: 'settings_b', sourceValue: 'Settings' },
    ],
    occurrences: [
      occurrence({
        ref: 'occurrence.settings-a',
        sourceStringRef: 'fixture:string.settings.a',
        sourceKey: 'settings_a',
        sourceValue: 'Settings',
        elementRef: 'element.settings.a',
      }),
      occurrence({
        ref: 'occurrence.settings-b',
        sourceStringRef: 'fixture:string.settings.b',
        sourceKey: 'settings_b',
        sourceValue: 'Settings',
        elementRef: 'element.settings.b',
      }),
    ],
  });
  const initialAnalysis = analyzeLocalizationConvergence(initial);
  const historical = createLocalizationConvergenceReview({
    reviewRef: 'review.localization.settings.history',
    candidate: initialAnalysis.candidateGroups[0],
    decision: 'ACCEPT_SHARED',
    semanticGroupRefOrNull: 'semantic-group.settings',
    rationale: 'Initial accepted meaning.',
  });

  const current = inventory({
    commit: '2'.repeat(40),
    strings: [
      { sourceStringRef: 'fixture:string.settings.a', sourceKey: 'settings_a', sourceValue: 'Settings', localeVariants: { es: 'Configuración' } },
      { sourceStringRef: 'fixture:string.settings.b', sourceKey: 'settings_b', sourceValue: 'Settings', localeVariants: { es: 'Configuración' } },
    ],
    occurrences: initial.occurrences,
  });
  const currentAnalysis = analyzeLocalizationConvergence(current);
  const reaffirmed = createLocalizationConvergenceReview({
    reviewRef: 'review.localization.settings.reaffirmed',
    candidate: currentAnalysis.candidateGroups[0],
    decision: 'ACCEPT_SHARED',
    semanticGroupRefOrNull: 'semantic-group.settings',
    rationale: 'Re-reviewed after locale evidence arrived.',
  });
  const projection = applyLocalizationConvergenceReviews(currentAnalysis, [historical, reaffirmed]);

  assert.equal(projection.summary.acceptedSemanticGroupCount, 1);
  assert.equal(projection.summary.staleReviewCount, 1);
  assert.equal(projection.acceptedSemanticGroups[0].semanticGroupRef, 'semantic-group.settings');
  assert.equal(projection.acceptedSemanticGroups[0].reviewRef, 'review.localization.settings.reaffirmed');
  assert.equal(projection.staleReviews[0].reviewRef, 'review.localization.settings.history');
});

test('review normalization rejects type coercion in imported candidate binding bytes', () => {
  const source = inventory({
    strings: [
      { sourceStringRef: 'fixture:string.a', sourceKey: 'a', sourceValue: 'Settings' },
      { sourceStringRef: 'fixture:string.b', sourceKey: 'b', sourceValue: 'Settings' },
    ],
    occurrences: [
      occurrence({
        ref: 'occurrence.a',
        sourceStringRef: 'fixture:string.a',
        sourceKey: 'a',
        sourceValue: 'Settings',
        elementRef: 'element.a',
      }),
      occurrence({
        ref: 'occurrence.b',
        sourceStringRef: 'fixture:string.b',
        sourceKey: 'b',
        sourceValue: 'Settings',
        elementRef: 'element.b',
      }),
    ],
  });
  const candidate = analyzeLocalizationConvergence(source).candidateGroups[0];
  const review = createLocalizationConvergenceReview({
    reviewRef: 'review.localization.settings.valid',
    candidate,
    decision: 'KEEP_SEPARATE',
    rationale: 'Fixture.',
  });
  const bytes = JSON.parse(JSON.stringify(review));
  bytes.candidateBinding.members[0].mapped = 'false';

  assert.throws(
    () => normalizeLocalizationConvergenceReview(bytes),
    /candidate.member.mapped must be boolean/,
  );
});

