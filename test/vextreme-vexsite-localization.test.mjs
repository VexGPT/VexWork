import assert from 'node:assert/strict';
import test from 'node:test';

import { projectDerivedAttention } from '../src/core/derived-attention-projection.mjs';
import { verifySemanticFingerprint } from '../src/core/semantic.mjs';
import { createVextremeVexSitePopulation } from '../src/adapters/vextreme-vexsite-population.mjs';
import {
  VEXTREME_VEXSITE_LOCALIZATION_GENERATED_PREDICATE_REF,
  VEXTREME_VEXSITE_LOCALIZATION_LENS_REF,
  VEXTREME_VEXSITE_LOCALIZATION_TIER_PREDICATE_REF,
  createVextremeVexSiteLocalizationEvidenceBatch,
  createVextremeVexSiteLocalizationLens,
  localePredicateRef,
} from '../src/adapters/vextreme-vexsite-localization.mjs';

const OBSERVED_AT = '2026-10-22T23:30:00.000Z';
const SOURCE_REFS = [
  'github.commit.vextreme.87a013e00fe13d43688e4c7abd1ea7ebaecca243',
  'source.vextreme.data-index.4eaafb71685d',
];

function page(slug, scopes, extra = {}) {
  return {
    slug,
    title: slug.toUpperCase(),
    arcKeys: ['arc_a'],
    date: '',
    vexData: {},
    viewmodel: { category: 'production', template: 'page', scopes, features: ['lang'] },
    ...extra,
  };
}

function indexFixture() {
  return {
    contentFingerprint: '4eaafb71685d',
    nodeCount: 3,
    curatedNodeCount: 3,
    autoDiscoveredCount: 0,
    arcCount: 1,
    supportedLangs: ['ar', 'en', 'fr'],
    sourceOnlyScopes: ['pages.source-only'],
    slugMap: {
      alpha: page('alpha', ['pages.alpha']),
      beta: page('beta', ['pages.beta']),
      'source-only': page('source-only', ['pages.source-only']),
    },
    pageLanguageMap: {
      alpha: { availableLangs: ['en', 'ar', 'fr'], completeLangs: ['en', 'ar', 'fr'] },
      beta: { availableLangs: ['en', 'ar', 'fr'], completeLangs: ['en', 'ar'] },
      'source-only': { availableLangs: ['en'], completeLangs: ['en'] },
    },
    arcMap: {
      arc_a: [{ label: 'Arc A', slugs: ['alpha', 'beta', 'source-only'] }],
    },
    arcMeta: {
      arc_a: { title: 'Arc A', url: '/a', renderMode: 'dots' },
    },
    departmentMap: {
      rd: {
        default: [
          { slug: 'alpha', title: 'ALPHA', ported: true },
          { slug: 'beta', title: 'BETA', ported: true },
          { slug: 'source-only', title: 'SOURCE-ONLY', ported: true },
        ],
      },
    },
  };
}

function population(index = indexFixture()) {
  return createVextremeVexSitePopulation({ index, observedAt: OBSERVED_AT, sourceRefs: SOURCE_REFS });
}

function lens() {
  return createVextremeVexSiteLocalizationLens({
    targetLocales: ['fr', 'ar'],
    sourceRefs: ['source.vexwork.operational-console.vexsite-localization'],
  });
}

function evidence(currentPopulation = population(), currentLens = lens(), overrides = {}) {
  return createVextremeVexSiteLocalizationEvidenceBatch({
    index: indexFixture(),
    population: currentPopulation,
    lens: currentLens,
    observedAt: OBSERVED_AT,
    generatedCurrentness: {
      state: 'SATISFIED',
      evidenceRefs: ['evidence.vextreme.generated-currentness.87a013e'],
    },
    ...overrides,
  });
}

test('lens turns each target locale into a required reason facet and keeps other currentness dimensions advisory', () => {
  const result = lens();
  assert.equal(result.lensRef, VEXTREME_VEXSITE_LOCALIZATION_LENS_REF);
  assert.deepEqual(result.targetLocales, ['ar', 'fr']);
  assert.deepEqual(result.predicates.filter((predicate) => predicate.requirement === 'REQUIRED').map((predicate) => predicate.predicateRef), [
    localePredicateRef('ar'),
    localePredicateRef('fr'),
    VEXTREME_VEXSITE_LOCALIZATION_TIER_PREDICATE_REF,
  ]);
  assert.equal(result.predicates.find((predicate) => predicate.predicateRef === VEXTREME_VEXSITE_LOCALIZATION_GENERATED_PREDICATE_REF).requirement, 'ADVISORY');
  assert.equal(verifySemanticFingerprint(result), true);
});

test('page-local completeLangs projects completion and aggregate missing-locale reasons without page Work items', () => {
  const currentPopulation = population();
  const currentLens = lens();
  const currentEvidence = evidence(currentPopulation, currentLens, {
    existingWorkRefsByEntityRef: {
      'entity.vextreme.vexsite.page.beta': ['work.example.beta-localization'],
    },
  });
  const projection = projectDerivedAttention({ population: currentPopulation, lens: currentLens, evidence: currentEvidence });

  assert.equal(projection.aggregate.entityCount, 3);
  assert.deepEqual(projection.aggregate.completionCounts, {
    COMPLETE: 1,
    INCOMPLETE: 1,
    UNKNOWN: 0,
    NOT_APPLICABLE: 1,
  });
  const alpha = projection.entities.find((entity) => entity.entityRef.endsWith('.alpha'));
  const beta = projection.entities.find((entity) => entity.entityRef.endsWith('.beta'));
  const sourceOnly = projection.entities.find((entity) => entity.entityRef.endsWith('.source-only'));
  assert.equal(alpha.completionState, 'COMPLETE');
  assert.equal(beta.completionState, 'INCOMPLETE');
  assert.equal(sourceOnly.completionState, 'NOT_APPLICABLE');
  assert.deepEqual(beta.existingWorkRefs, ['work.example.beta-localization']);
  assert.equal('workState' in beta, false);

  const fr = projection.aggregate.reasonFacets.find((facet) => facet.reasonFacetRef.endsWith('.locale.fr'));
  assert.equal(fr.entityCount, 2);
  assert.deepEqual(fr.entityRefs, [
    'entity.vextreme.vexsite.page.beta',
    'entity.vextreme.vexsite.page.source-only',
  ]);
  assert.deepEqual(fr.evidenceStateCounts, { UNSATISFIED: 1, UNKNOWN: 0, NOT_APPLICABLE: 1 });
});

test('source-only policy is NOT_APPLICABLE rather than localization debt', () => {
  const currentPopulation = population();
  const currentLens = lens();
  const currentEvidence = evidence(currentPopulation, currentLens);
  const item = currentEvidence.find((entry) => entry.entityRef.endsWith('.source-only'));
  assert.deepEqual(item.predicateResults.filter((result) => result.predicateRef.includes('.locale.')).map((result) => result.state), [
    'NOT_APPLICABLE',
    'NOT_APPLICABLE',
  ]);
  assert.equal(item.predicateResults.find((result) => result.predicateRef === VEXTREME_VEXSITE_LOCALIZATION_TIER_PREDICATE_REF).state, 'NOT_APPLICABLE');
  assert.equal(item.predicateResults.every((result) => result.state === 'UNKNOWN' || result.evidenceRefs.length > 0), true);
});

test('target-tier predicate aligns one promotion concern with the provider page-tier work unit', () => {
  const currentPopulation = population();
  const currentLens = lens();
  const currentEvidence = evidence(currentPopulation, currentLens);
  const alpha = currentEvidence.find((entry) => entry.entityRef.endsWith('.alpha'));
  const beta = currentEvidence.find((entry) => entry.entityRef.endsWith('.beta'));

  assert.equal(alpha.predicateResults.find((result) => result.predicateRef === VEXTREME_VEXSITE_LOCALIZATION_TIER_PREDICATE_REF).state, 'SATISFIED');
  assert.equal(beta.predicateResults.find((result) => result.predicateRef === VEXTREME_VEXSITE_LOCALIZATION_TIER_PREDICATE_REF).state, 'UNSATISFIED');
  assert.equal(beta.predicateResults.filter((result) => result.predicateRef.includes('.locale.') && result.state === 'UNSATISFIED').length, 1);
});

test('generated, lived, and modernization evidence stay separately typed instead of being inferred from completeLangs', () => {
  const currentPopulation = population();
  const currentLens = lens();
  const currentEvidence = evidence(currentPopulation, currentLens, {
    livedProofByEntityRef: {
      'entity.vextreme.vexsite.page.alpha': {
        state: 'SATISFIED',
        evidenceRefs: ['evidence.vextreme.assets.alpha.fr'],
      },
    },
    modernizationByEntityRef: {
      'entity.vextreme.vexsite.page.beta': {
        state: 'UNSATISFIED',
        evidenceRefs: ['evidence.vextreme.modernization.beta'],
      },
    },
  });
  const alpha = currentEvidence.find((entry) => entry.entityRef.endsWith('.alpha'));
  const beta = currentEvidence.find((entry) => entry.entityRef.endsWith('.beta'));
  assert.equal(alpha.predicateResults.find((result) => result.predicateRef.endsWith('.lived-proof')).state, 'SATISFIED');
  assert.equal(beta.predicateResults.find((result) => result.predicateRef.endsWith('.lived-proof')).state, 'UNKNOWN');
  assert.equal(beta.predicateResults.find((result) => result.predicateRef.endsWith('.modernization')).state, 'UNSATISFIED');
});

test('evidence fails closed when provider index identity no longer matches the population snapshot', () => {
  const currentPopulation = population();
  const currentLens = lens();
  const changed = indexFixture();
  changed.contentFingerprint = '5eaafb71685d';
  assert.throws(() => createVextremeVexSiteLocalizationEvidenceBatch({
    index: changed,
    population: currentPopulation,
    lens: currentLens,
    observedAt: OBSERVED_AT,
  }), /index does not match population snapshot/);
});

test('applicable population pages require the provider pageLanguageMap surface', () => {
  const currentPopulation = population();
  const currentLens = lens();
  const broken = indexFixture();
  delete broken.pageLanguageMap.beta;
  assert.throws(() => createVextremeVexSiteLocalizationEvidenceBatch({
    index: broken,
    population: currentPopulation,
    lens: currentLens,
    observedAt: OBSERVED_AT,
  }), /pageLanguageMap.beta must be one object/);
});

test('lens refuses source locale en and duplicate target locales', () => {
  assert.throws(() => createVextremeVexSiteLocalizationLens({ targetLocales: ['en'], sourceRefs: ['source.test'] }), /must not contain source locale en/);
  assert.throws(() => createVextremeVexSiteLocalizationLens({ targetLocales: ['fr', 'fr'], sourceRefs: ['source.test'] }), /must be unique/);
});

// [VXG RealForever]
