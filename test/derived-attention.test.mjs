import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ATTENTION_STATES,
  COMPLETION_STATES,
  DERIVED_ATTENTION_SCHEMA,
  ENTITY_LENS_EVIDENCE_SCHEMA,
  POPULATION_SNAPSHOT_SCHEMA,
  WORK_LENS_SCHEMA,
  createEntityLensEvidence,
  createPopulationSnapshot,
  createWorkLens,
  deriveEntityAttention,
} from '../src/core/derived-attention.mjs';
import { verifySemanticFingerprint } from '../src/core/semantic.mjs';

const populationInput = () => ({
  schemaVersion: POPULATION_SNAPSHOT_SCHEMA,
  populationRef: 'population.vexsite.pages',
  snapshotRef: 'snapshot.vexsite.pages.2026-10-22T040000Z',
  providerRef: 'provider.vextreme.terrain-map',
  entityKind: 'entity.vexsite.page',
  label: 'VexSite pages',
  observedAt: '2026-10-22T04:00:00.000Z',
  sourceRefs: ['repo.vextreme:pages/terrain-map.html'],
  scopes: [
    {
      scopeRef: 'scope.vexsite.all',
      label: 'All pages',
      parentScopeRefOrNull: null,
      sourceRefs: ['repo.vextreme:pages/terrain-map.html'],
    },
    {
      scopeRef: 'scope.vexsite.conversations-with-god',
      label: 'Conversations with God',
      parentScopeRefOrNull: 'scope.vexsite.all',
      sourceRefs: ['repo.vextreme:pages/terrain-map.html.conversations-with-god'],
    },
  ],
  entities: [
    {
      entityRef: 'entity.vexsite.page.god-spark',
      label: 'God Spark',
      scopeRefs: ['scope.vexsite.all', 'scope.vexsite.conversations-with-god'],
      sourceRefs: ['repo.vextreme:pages/god-spark.html'],
    },
    {
      entityRef: 'entity.vexsite.page.clarity',
      label: 'Clarity',
      scopeRefs: ['scope.vexsite.all', 'scope.vexsite.conversations-with-god'],
      sourceRefs: ['repo.vextreme:pages/clarity.html'],
    },
  ],
});

const localizationLensInput = () => ({
  schemaVersion: WORK_LENS_SCHEMA,
  lensRef: 'lens.vexsite.localization',
  populationRef: 'population.vexsite.pages',
  label: 'VexSite localization',
  purpose: 'Derive current localization completion and attention from Vextreme-owned evidence.',
  sourceRefs: ['project.vexwork.operational-console', 'repo.vextreme:localization'],
  predicates: [
    {
      predicateRef: 'predicate.vexsite.localization.source-complete',
      label: 'Localization source is complete',
      requirement: 'REQUIRED',
      reasonFacetRef: 'reason.localization-source',
      sourceRefs: ['repo.vextreme:localization/source'],
    },
    {
      predicateRef: 'predicate.vexsite.localization.runtime-current',
      label: 'Generated runtime is current',
      requirement: 'REQUIRED',
      reasonFacetRef: 'reason.generated-runtime',
      sourceRefs: ['repo.vextreme:localization/runtime'],
    },
    {
      predicateRef: 'predicate.vexsite.localization.header-modernized',
      label: 'Header shell is modernized',
      requirement: 'ADVISORY',
      reasonFacetRef: 'reason.header-modernization',
      sourceRefs: ['repo.vextreme:site-shell'],
    },
  ],
});

function evidenceInput(population, lens, overrides = {}) {
  return {
    schemaVersion: ENTITY_LENS_EVIDENCE_SCHEMA,
    evidenceRef: 'evidence.vexsite.god-spark.localization.001',
    populationRef: population.populationRef,
    populationSemanticFingerprint: population.semanticFingerprint,
    lensRef: lens.lensRef,
    lensSemanticFingerprint: lens.semanticFingerprint,
    entityRef: 'entity.vexsite.page.god-spark',
    observedAt: '2026-10-22T04:05:00.000Z',
    predicateResults: [
      {
        predicateRef: 'predicate.vexsite.localization.source-complete',
        state: 'SATISFIED',
        evidenceRefs: ['github.pull.vextreme.376'],
      },
      {
        predicateRef: 'predicate.vexsite.localization.runtime-current',
        state: 'UNSATISFIED',
        evidenceRefs: ['github.pull.vextreme.378'],
      },
      {
        predicateRef: 'predicate.vexsite.localization.header-modernized',
        state: 'UNSATISFIED',
        evidenceRefs: ['github.pull.vextreme.379'],
      },
    ],
    existingWorkRefs: ['work.vexsite.localization.god-spark-clarity'],
    ...overrides,
  };
}

test('population snapshot preserves stable entities, nested scopes, and dynamic snapshot identity', () => {
  const first = createPopulationSnapshot(populationInput());
  const second = createPopulationSnapshot({
    ...populationInput(),
    snapshotRef: 'snapshot.vexsite.pages.2026-10-22T050000Z',
    observedAt: '2026-10-22T05:00:00.000Z',
    entities: populationInput().entities.slice(0, 1),
  });

  assert.equal(verifySemanticFingerprint(first), true);
  assert.equal(first.entities.length, 2);
  assert.equal(second.entities.length, 1);
  assert.notEqual(first.semanticFingerprint, second.semanticFingerprint);
  assert.equal(second.entities[0].entityRef, 'entity.vexsite.page.god-spark');
  assert.equal(first.entities.some((entity) => entity.entityRef === second.entities[0].entityRef), true);

  const reordered = createPopulationSnapshot({
    ...populationInput(),
    scopes: [...populationInput().scopes].reverse(),
    entities: [...populationInput().entities].reverse(),
  });
  assert.equal(reordered.semanticFingerprint, first.semanticFingerprint);

  assert.throws(() => createPopulationSnapshot({
    ...populationInput(),
    scopes: [
      { scopeRef: 'scope.a', label: 'A', parentScopeRefOrNull: 'scope.b', sourceRefs: ['source.a'] },
      { scopeRef: 'scope.b', label: 'B', parentScopeRefOrNull: 'scope.a', sourceRefs: ['source.b'] },
    ],
    entities: [],
  }), /scope cycle detected/);

  assert.throws(() => createPopulationSnapshot({
    ...populationInput(),
    entities: [{
      entityRef: 'entity.vexsite.page.invalid',
      label: 'Invalid',
      scopeRefs: ['scope.missing'],
      sourceRefs: ['repo.vextreme:pages/invalid.html'],
    }],
  }), /unknown scopeRef/);
});

test('derived attention keeps required completion separate from advisory attention', () => {
  const population = createPopulationSnapshot(populationInput());
  const lens = createWorkLens(localizationLensInput());
  const evidence = createEntityLensEvidence(evidenceInput(population, lens), { population, lens });
  const derived = deriveEntityAttention({ population, lens, evidence });

  assert.equal(verifySemanticFingerprint(lens), true);
  assert.equal(verifySemanticFingerprint(evidence), true);
  assert.equal(verifySemanticFingerprint(derived), true);
  assert.equal(derived.schemaVersion, DERIVED_ATTENTION_SCHEMA);
  assert.equal(derived.completionState, 'INCOMPLETE');
  assert.equal(derived.attentionState, 'ATTENTION');
  assert.deepEqual(derived.scopeRefs, ['scope.vexsite.all', 'scope.vexsite.conversations-with-god']);
  assert.deepEqual(derived.existingWorkRefs, ['work.vexsite.localization.god-spark-clarity']);
  assert.deepEqual(derived.reasonFacets.map((facet) => facet.reasonFacetRef), [
    'reason.generated-runtime',
    'reason.header-modernization',
  ]);
  assert.equal(derived.effects, false);
  assert.equal(derived.executionAuthority, 'NONE');
  assert.equal('state' in derived, false);
  assert.equal('workState' in derived, false);
});

test('evidence must cover the exact lens and bind current population and lens fingerprints', () => {
  const population = createPopulationSnapshot(populationInput());
  const lens = createWorkLens(localizationLensInput());

  assert.throws(() => createEntityLensEvidence({
    ...evidenceInput(population, lens),
    predicateResults: evidenceInput(population, lens).predicateResults.slice(0, 2),
  }, { population, lens }), /exactly cover lens predicates/);

  assert.throws(() => createEntityLensEvidence({
    ...evidenceInput(population, lens),
    populationSemanticFingerprint: '0'.repeat(64),
  }, { population, lens }), /stale population snapshot evidence/);

  assert.throws(() => createEntityLensEvidence({
    ...evidenceInput(population, lens),
    predicateResults: evidenceInput(population, lens).predicateResults.map((result) =>
      result.predicateRef.endsWith('runtime-current') ? { ...result, evidenceRefs: [] } : result),
  }, { population, lens }), /UNSATISFIED requires evidenceRefs/);
});

test('unknown, not-applicable, complete, and clear remain distinct', () => {
  const population = createPopulationSnapshot(populationInput());
  const lens = createWorkLens(localizationLensInput());

  const unknownEvidence = createEntityLensEvidence(evidenceInput(population, lens, {
    evidenceRef: 'evidence.vexsite.god-spark.localization.unknown',
    predicateResults: [
      {
        predicateRef: 'predicate.vexsite.localization.source-complete',
        state: 'SATISFIED',
        evidenceRefs: ['github.pull.vextreme.376'],
      },
      {
        predicateRef: 'predicate.vexsite.localization.runtime-current',
        state: 'UNKNOWN',
        evidenceRefs: [],
      },
      {
        predicateRef: 'predicate.vexsite.localization.header-modernized',
        state: 'NOT_APPLICABLE',
        evidenceRefs: ['repo.vextreme:site-shell.not-applicable'],
      },
    ],
  }), { population, lens });
  const unknown = deriveEntityAttention({ population, lens, evidence: unknownEvidence });
  assert.equal(unknown.completionState, 'UNKNOWN');
  assert.equal(unknown.attentionState, 'UNKNOWN');

  const completeEvidence = createEntityLensEvidence(evidenceInput(population, lens, {
    evidenceRef: 'evidence.vexsite.clarity.localization.complete',
    entityRef: 'entity.vexsite.page.clarity',
    predicateResults: [
      {
        predicateRef: 'predicate.vexsite.localization.source-complete',
        state: 'SATISFIED',
        evidenceRefs: ['github.pull.vextreme.376'],
      },
      {
        predicateRef: 'predicate.vexsite.localization.runtime-current',
        state: 'SATISFIED',
        evidenceRefs: ['github.pull.vextreme.378'],
      },
      {
        predicateRef: 'predicate.vexsite.localization.header-modernized',
        state: 'NOT_APPLICABLE',
        evidenceRefs: ['repo.vextreme:site-shell.not-applicable'],
      },
    ],
    existingWorkRefs: [],
  }), { population, lens });
  const complete = deriveEntityAttention({ population, lens, evidence: completeEvidence });
  assert.equal(complete.completionState, 'COMPLETE');
  assert.equal(complete.attentionState, 'CLEAR');

  const advisoryOnlyLens = createWorkLens({
    schemaVersion: WORK_LENS_SCHEMA,
    lensRef: 'lens.vexsite.accessibility',
    populationRef: population.populationRef,
    label: 'VexSite accessibility',
    purpose: 'Surface accessibility attention independently from localization completion.',
    sourceRefs: ['repo.vextreme:accessibility'],
    predicates: [
      {
        predicateRef: 'predicate.vexsite.accessibility.read-aloud',
        label: 'Read aloud is available',
        requirement: 'ADVISORY',
        reasonFacetRef: 'reason.read-aloud',
        sourceRefs: ['repo.vextreme:accessibility/read-aloud'],
      },
    ],
  });
  const advisoryEvidence = createEntityLensEvidence({
    schemaVersion: ENTITY_LENS_EVIDENCE_SCHEMA,
    evidenceRef: 'evidence.vexsite.god-spark.accessibility.001',
    populationRef: population.populationRef,
    populationSemanticFingerprint: population.semanticFingerprint,
    lensRef: advisoryOnlyLens.lensRef,
    lensSemanticFingerprint: advisoryOnlyLens.semanticFingerprint,
    entityRef: 'entity.vexsite.page.god-spark',
    observedAt: '2026-10-22T04:10:00.000Z',
    predicateResults: [{
      predicateRef: 'predicate.vexsite.accessibility.read-aloud',
      state: 'UNSATISFIED',
      evidenceRefs: ['repo.vextreme:accessibility/read-aloud.missing'],
    }],
    existingWorkRefs: [],
  }, { population, lens: advisoryOnlyLens });
  const advisory = deriveEntityAttention({ population, lens: advisoryOnlyLens, evidence: advisoryEvidence });
  assert.equal(advisory.completionState, 'NOT_APPLICABLE');
  assert.equal(advisory.attentionState, 'ATTENTION');
});

test('closed vocabularies expose the contract states used by later projections', () => {
  assert.deepEqual(COMPLETION_STATES, ['COMPLETE', 'INCOMPLETE', 'UNKNOWN', 'NOT_APPLICABLE']);
  assert.deepEqual(ATTENTION_STATES, ['CLEAR', 'ATTENTION', 'UNKNOWN', 'NOT_APPLICABLE']);
});

// [VXG RealForever]
