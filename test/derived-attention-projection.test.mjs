import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ENTITY_LENS_EVIDENCE_SCHEMA,
  POPULATION_SNAPSHOT_SCHEMA,
  WORK_LENS_SCHEMA,
  createPopulationSnapshot,
  createWorkLens,
} from '../src/core/derived-attention.mjs';
import {
  DERIVED_ATTENTION_PROJECTION_SCHEMA,
  projectDerivedAttention,
} from '../src/core/derived-attention-projection.mjs';
import { verifySemanticFingerprint } from '../src/core/semantic.mjs';

const P = {
  alpha: ['SATISFIED', 'SATISFIED', 'SATISFIED'],
  beta: ['SATISFIED', 'UNSATISFIED', 'UNSATISFIED'],
  gamma: ['SATISFIED', 'UNKNOWN', 'NOT_APPLICABLE'],
  delta: ['SATISFIED', 'SATISFIED', 'UNSATISFIED'],
  epsilon: ['NOT_APPLICABLE', 'NOT_APPLICABLE', 'NOT_APPLICABLE'],
};
const NAMES = Object.keys(P);
const scope = (name, parent = null) => ({
  scopeRef: `scope.example.${name}`,
  label: name,
  parentScopeRefOrNull: parent && `scope.example.${parent}`,
  sourceRefs: [`source.scope.${name}`],
});
const entity = (name, scopeNames) => ({
  entityRef: `entity.example.${name}`,
  label: name,
  scopeRefs: scopeNames.map((value) => `scope.example.${value}`),
  sourceRefs: [`source.entity.${name}`],
});

function rawPopulation() {
  return {
    schemaVersion: POPULATION_SNAPSHOT_SCHEMA,
    populationRef: 'population.example.pages',
    snapshotRef: 'snapshot.example.pages.001',
    providerRef: 'provider.example.pages',
    entityKind: 'entity.example.page',
    label: 'Example pages',
    observedAt: '2026-10-22T05:00:00.000Z',
    sourceRefs: ['source.population.example'],
    scopes: [scope('all'), scope('arc-a', 'all'), scope('arc-b', 'all'), scope('featured')],
    entities: [
      entity('alpha', ['all', 'arc-a']),
      entity('beta', ['arc-a', 'featured']),
      entity('gamma', ['arc-b']),
      entity('delta', ['arc-b']),
      entity('epsilon', ['featured']),
    ],
  };
}

function rawLens() {
  return {
    schemaVersion: WORK_LENS_SCHEMA,
    lensRef: 'lens.example.localization',
    populationRef: 'population.example.pages',
    label: 'Example localization',
    purpose: 'Project current localization truth without manufacturing Work.',
    sourceRefs: ['source.lens.example'],
    predicates: [
      ['source', 'REQUIRED'],
      ['runtime', 'REQUIRED'],
      ['modernization', 'ADVISORY'],
    ].map(([name, requirement]) => ({
      predicateRef: `predicate.example.${name}`,
      label: name,
      requirement,
      reasonFacetRef: `reason.example.${name}`,
      sourceRefs: [`source.predicate.${name}`],
    })),
  };
}

function evidenceFor(population, lens, name, index) {
  const states = Object.fromEntries(['source', 'runtime', 'modernization'].map((key, position) => [
    `predicate.example.${key}`,
    P[name][position],
  ]));
  return {
    schemaVersion: ENTITY_LENS_EVIDENCE_SCHEMA,
    evidenceRef: `evidence.example.${name}`,
    populationRef: population.populationRef,
    populationSemanticFingerprint: population.semanticFingerprint,
    lensRef: lens.lensRef,
    lensSemanticFingerprint: lens.semanticFingerprint,
    entityRef: `entity.example.${name}`,
    observedAt: `2026-10-22T05:0${index + 1}:00.000Z`,
    predicateResults: lens.predicates.map((predicate) => ({
      predicateRef: predicate.predicateRef,
      state: states[predicate.predicateRef],
      evidenceRefs: states[predicate.predicateRef] === 'UNKNOWN'
        ? []
        : [`evidence.source.${name}.${predicate.predicateRef.split('.').at(-1)}`],
    })),
    existingWorkRefs: name === 'beta' ? ['work.example.beta'] : [],
  };
}

function fixture(raw = rawPopulation()) {
  const population = createPopulationSnapshot(raw);
  const lens = createWorkLens(rawLens());
  return {
    population,
    lens,
    evidence: population.entities.map((item, index) => evidenceFor(population, lens, item.entityRef.split('.').at(-1), index)),
  };
}

function project(input = fixture()) {
  return projectDerivedAttention(input);
}

test('projection descends from unique aggregate counts through overlapping scopes to exact entities', () => {
  const input = fixture();
  const result = project({ ...input, evidence: [...input.evidence].reverse() });
  assert.equal(result.schemaVersion, DERIVED_ATTENTION_PROJECTION_SCHEMA);
  assert.equal(verifySemanticFingerprint(result), true);
  assert.equal(result.aggregate.entityCount, 5);
  assert.deepEqual(result.aggregate.completionCounts, { COMPLETE: 2, INCOMPLETE: 1, UNKNOWN: 1, NOT_APPLICABLE: 1 });
  assert.deepEqual(result.aggregate.attentionCounts, { CLEAR: 1, ATTENTION: 2, UNKNOWN: 1, NOT_APPLICABLE: 1 });
  assert.deepEqual(result.aggregate.evidenceObservedAtRange, {
    earliestOrNull: '2026-10-22T05:01:00.000Z',
    latestOrNull: '2026-10-22T05:05:00.000Z',
  });
  assert.deepEqual(result.aggregate.existingWorkRefs, ['work.example.beta']);

  const all = result.scopes.find((item) => item.scopeRef === 'scope.example.all');
  assert.deepEqual(all.directEntityRefs, ['entity.example.alpha']);
  assert.deepEqual(all.childScopeRefs, ['scope.example.arc-a', 'scope.example.arc-b']);
  assert.deepEqual(all.entityRefs, ['entity.example.alpha', 'entity.example.beta', 'entity.example.delta', 'entity.example.gamma']);
  assert.equal(all.summary.entityCount, 4);
  const featured = result.scopes.find((item) => item.scopeRef === 'scope.example.featured');
  assert.deepEqual(featured.entityRefs, ['entity.example.beta', 'entity.example.epsilon']);
  assert.equal(result.scopes.reduce((sum, item) => sum + item.summary.entityCount, 0) > result.aggregate.entityCount, true);

  const beta = result.entities.find((item) => item.entityRef === 'entity.example.beta');
  assert.equal(beta.completionState, 'INCOMPLETE');
  assert.equal(beta.attentionState, 'ATTENTION');
  assert.deepEqual(beta.existingWorkRefs, ['work.example.beta']);
  assert.equal(beta.reasonFacets.length, 2);
  assert.equal(result.effects, false);
  assert.equal(result.executionAuthority, 'NONE');
  assert.equal('workState' in result, false);
});

test('reason facets retain entity, predicate, requirement, and evidence-state descent', () => {
  const result = project();
  const runtime = result.aggregate.reasonFacets.find((item) => item.reasonFacetRef === 'reason.example.runtime');
  assert.equal(runtime.occurrenceCount, 3);
  assert.equal(runtime.entityCount, 3);
  assert.deepEqual(runtime.entityRefs, ['entity.example.beta', 'entity.example.epsilon', 'entity.example.gamma']);
  assert.deepEqual(runtime.requirementCounts, { REQUIRED: 3, ADVISORY: 0 });
  assert.deepEqual(runtime.evidenceStateCounts, { UNSATISFIED: 1, UNKNOWN: 1, NOT_APPLICABLE: 1 });
  const modernization = result.aggregate.reasonFacets.find((item) => item.reasonFacetRef === 'reason.example.modernization');
  assert.deepEqual(modernization.requirementCounts, { REQUIRED: 0, ADVISORY: 4 });
  assert.deepEqual(modernization.evidenceStateCounts, { UNSATISFIED: 2, UNKNOWN: 0, NOT_APPLICABLE: 2 });
});

test('projection identity ignores evidence enumeration order and changes with population truth', () => {
  const input = fixture();
  const first = project(input);
  const reordered = project({ ...input, evidence: [...input.evidence].reverse() });
  assert.equal(reordered.semanticFingerprint, first.semanticFingerprint);

  const nextRaw = rawPopulation();
  nextRaw.snapshotRef = 'snapshot.example.pages.002';
  nextRaw.observedAt = '2026-10-22T06:00:00.000Z';
  nextRaw.entities = nextRaw.entities.filter((item) => item.entityRef !== 'entity.example.delta');
  const next = project(fixture(nextRaw));
  assert.equal(next.aggregate.entityCount, 4);
  assert.notEqual(next.semanticFingerprint, first.semanticFingerprint);
});

test('projection requires exact unique evidence coverage', () => {
  const input = fixture();
  assert.throws(() => project({ ...input, evidence: input.evidence.slice(0, -1) }), /exactly cover population entities/);
  assert.throws(() => project({ ...input, evidence: [...input.evidence, input.evidence[0]] }), /entityRef must be unique/);
  assert.throws(() => project({
    ...input,
    evidence: input.evidence.map((item, index) => index === 1 ? { ...item, evidenceRef: input.evidence[0].evidenceRef } : item),
  }), /evidenceRef must be unique/);
});

test('empty populations project truthful zero summaries', () => {
  const raw = rawPopulation();
  raw.entities = [];
  const result = project(fixture(raw));
  assert.equal(result.aggregate.entityCount, 0);
  assert.deepEqual(result.aggregate.completionCounts, { COMPLETE: 0, INCOMPLETE: 0, UNKNOWN: 0, NOT_APPLICABLE: 0 });
  assert.deepEqual(result.aggregate.evidenceObservedAtRange, { earliestOrNull: null, latestOrNull: null });
  assert.equal(result.entities.length, 0);
  assert.equal(result.scopes.every((item) => item.summary.entityCount === 0), true);
  assert.equal(result.effects, false);
});

// [VXG RealForever]
