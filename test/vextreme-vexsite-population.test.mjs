import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ENTITY_LENS_EVIDENCE_SCHEMA,
  WORK_LENS_SCHEMA,
  createWorkLens,
} from '../src/core/derived-attention.mjs';
import { projectDerivedAttention } from '../src/core/derived-attention-projection.mjs';
import { verifySemanticFingerprint } from '../src/core/semantic.mjs';
import {
  VEXTREME_VEXSITE_POPULATION_REF,
  VEXTREME_VEXSITE_ROOT_SCOPE_REF,
  createVextremeVexSitePopulation,
} from '../src/adapters/vextreme-vexsite-population.mjs';

const OBSERVED_AT = '2026-10-22T09:00:00.000Z';
const SOURCE_REFS = [
  'github.commit.vextreme.87a013e00fe13d43688e4c7abd1ea7ebaecca243',
  'source.vextreme.data-index.4eaafb71685d',
];

function page(slug, title, arcKeys, extra = {}) {
  return { slug, title, arcKeys, date: '', vexData: {}, ...extra };
}

function fixture() {
  return {
    contentFingerprint: '4eaafb71685d',
    nodeCount: 4,
    curatedNodeCount: 3,
    autoDiscoveredCount: 1,
    arcCount: 2,
    slugMap: {
      alpha: page('alpha', 'Alpha', ['arc_a']),
      beta: page('beta', 'Beta', ['arc_a', 'arc_b']),
      gamma: page('gamma', 'Gamma', ['arc_b']),
      orphan: page('orphan', 'Orphan', [], { autoDiscovered: true }),
    },
    arcMap: {
      arc_a: [{ label: 'Arc A group', slugs: ['alpha', 'beta'] }],
      arc_b: [{ label: 'Arc B group', slugs: ['beta', 'gamma'] }],
    },
    arcMeta: {
      arc_a: { title: 'Arc A', url: '/a', renderMode: 'dots' },
      arc_b: { title: 'Arc B', url: '/b', renderMode: 'dots' },
    },
    departmentMap: {
      media: {
        records: [
          { slug: 'alpha', title: 'Alpha', ported: true },
          { slug: 'beta', title: 'Beta', ported: true },
          { slug: 'gamma', title: 'Gamma', ported: false },
        ],
        unsorted: [{ slug: 'orphan', title: 'Orphan', ported: true }],
      },
    },
  };
}

function population(index = fixture(), observedAt = OBSERVED_AT) {
  return createVextremeVexSitePopulation({ index, observedAt, sourceRefs: SOURCE_REFS });
}

function completeProjection(currentPopulation) {
  const lens = createWorkLens({
    schemaVersion: WORK_LENS_SCHEMA,
    lensRef: 'lens.test.vextreme.population-current',
    populationRef: VEXTREME_VEXSITE_POPULATION_REF,
    label: 'Population currentness fixture',
    purpose: 'Prove adapter population and scope descent without creating Work.',
    sourceRefs: ['source.test.vextreme.population-current'],
    predicates: [{
      predicateRef: 'predicate.test.vextreme.population-current',
      label: 'Current in provider snapshot',
      requirement: 'REQUIRED',
      reasonFacetRef: 'reason.test.vextreme.population-current',
      sourceRefs: ['source.test.vextreme.population-current'],
    }],
  });
  const evidence = currentPopulation.entities.map((entity, index) => ({
    schemaVersion: ENTITY_LENS_EVIDENCE_SCHEMA,
    evidenceRef: `evidence.test.vextreme.population-current.${String(index + 1).padStart(2, '0')}`,
    populationRef: currentPopulation.populationRef,
    populationSemanticFingerprint: currentPopulation.semanticFingerprint,
    lensRef: lens.lensRef,
    lensSemanticFingerprint: lens.semanticFingerprint,
    entityRef: entity.entityRef,
    observedAt: `2026-10-22T09:${String(index + 1).padStart(2, '0')}:00.000Z`,
    predicateResults: [{
      predicateRef: 'predicate.test.vextreme.population-current',
      state: 'SATISFIED',
      evidenceRefs: [`source.test.vextreme.population-current.${String(index + 1).padStart(2, '0')}`],
    }],
    existingWorkRefs: [],
  }));
  return projectDerivedAttention({ population: currentPopulation, lens, evidence });
}

test('adapter derives real-page entities and nested overlapping arc scopes from one Vextreme index', () => {
  const result = population();
  assert.equal(verifySemanticFingerprint(result), true);
  assert.equal(result.populationRef, VEXTREME_VEXSITE_POPULATION_REF);
  assert.equal(result.snapshotRef, 'snapshot.vextreme.vexsite.pages.4eaafb71685d.20261022T090000000Z');
  assert.deepEqual(result.entities.map((entity) => entity.entityRef), [
    'entity.vextreme.vexsite.page.alpha',
    'entity.vextreme.vexsite.page.beta',
    'entity.vextreme.vexsite.page.orphan',
  ]);
  assert.equal(result.entities.some((entity) => entity.entityRef.endsWith('.gamma')), false);

  const beta = result.entities.find((entity) => entity.entityRef.endsWith('.beta'));
  assert.deepEqual(beta.scopeRefs, [
    'scope.vextreme.vexsite.arc.arc_a.section.01',
    'scope.vextreme.vexsite.arc.arc_b.section.01',
  ]);
  const orphan = result.entities.find((entity) => entity.entityRef.endsWith('.orphan'));
  assert.deepEqual(orphan.scopeRefs, ['scope.vextreme.vexsite.pages.unscoped']);
  assert.equal(orphan.sourceRefs.includes('repo.vextreme:lib/auto-discover-nodes.js'), true);
  assert.equal(orphan.sourceRefs.includes('repo.vextreme:data/nodes.json'), false);
  assert.equal('workRef' in beta, false);
});

test('adapter output composes with Derived Attention aggregate -> arc -> section -> entity descent', () => {
  const result = completeProjection(population());
  assert.equal(result.aggregate.entityCount, 3);
  assert.equal(result.aggregate.completionCounts.COMPLETE, 3);
  assert.equal(result.effects, false);
  assert.equal(result.executionAuthority, 'NONE');
  assert.deepEqual(result.rootScopeRefs, [VEXTREME_VEXSITE_ROOT_SCOPE_REF]);

  const root = result.scopes.find((scope) => scope.scopeRef === VEXTREME_VEXSITE_ROOT_SCOPE_REF);
  assert.equal(root.summary.entityCount, 3);
  assert.deepEqual(root.entityRefs, [
    'entity.vextreme.vexsite.page.alpha',
    'entity.vextreme.vexsite.page.beta',
    'entity.vextreme.vexsite.page.orphan',
  ]);
  const arcA = result.scopes.find((scope) => scope.scopeRef === 'scope.vextreme.vexsite.arc.arc_a');
  assert.equal(arcA.summary.entityCount, 2);
  const arcB = result.scopes.find((scope) => scope.scopeRef === 'scope.vextreme.vexsite.arc.arc_b');
  assert.equal(arcB.summary.entityCount, 1);
  const sectionA = result.scopes.find((scope) => scope.scopeRef === 'scope.vextreme.vexsite.arc.arc_a.section.01');
  assert.deepEqual(sectionA.directEntityRefs, [
    'entity.vextreme.vexsite.page.alpha',
    'entity.vextreme.vexsite.page.beta',
  ]);
  assert.equal(root.summary.entityCount < arcA.summary.entityCount + arcB.summary.entityCount + 1, true);
});

test('population identity is provider-content-driven rather than a fixed page count', () => {
  const first = population();
  const nextIndex = structuredClone(fixture());
  nextIndex.contentFingerprint = '5eaafb71685d';
  nextIndex.nodeCount = 5;
  nextIndex.curatedNodeCount = 4;
  nextIndex.slugMap.delta = page('delta', 'Delta', ['arc_a']);
  nextIndex.arcMap.arc_a[0].slugs.push('delta');
  nextIndex.departmentMap.media.records.push({ slug: 'delta', title: 'Delta', ported: true });
  const next = population(nextIndex, '2026-10-22T10:00:00.000Z');
  assert.equal(first.entities.length, 3);
  assert.equal(next.entities.length, 4);
  assert.notEqual(next.snapshotRef, first.snapshotRef);
  assert.notEqual(next.semanticFingerprint, first.semanticFingerprint);
});

test('semantically equivalent provider object ordering converges', () => {
  const first = population();
  const reordered = fixture();
  reordered.slugMap = Object.fromEntries(Object.entries(reordered.slugMap).reverse());
  reordered.arcMap = Object.fromEntries(Object.entries(reordered.arcMap).reverse());
  reordered.arcMeta = Object.fromEntries(Object.entries(reordered.arcMeta).reverse());
  reordered.departmentMap.media.records.reverse();
  const second = population(reordered);
  assert.equal(second.semanticFingerprint, first.semanticFingerprint);
});

test('adapter fails closed on provider projection contradictions', () => {
  const duplicate = fixture();
  duplicate.departmentMap.media.unsorted.push({ slug: 'alpha', title: 'Alpha', ported: true });
  assert.throws(() => population(duplicate), /duplicate slug alpha/);

  const missingArcMember = fixture();
  missingArcMember.arcMap.arc_a[0].slugs = ['alpha'];
  assert.throws(() => population(missingArcMember), /declares arc arc_a but arcMap omits it/);

  const foreignArcMember = fixture();
  foreignArcMember.slugMap.beta.arcKeys = ['arc_b'];
  assert.throws(() => population(foreignArcMember), /arcKeys does not include arc_a/);

  const staleCount = fixture();
  staleCount.nodeCount = 99;
  assert.throws(() => population(staleCount), /nodeCount must equal slugMap size/);
});

// [VXG RealForever]
