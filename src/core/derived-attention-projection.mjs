import {
  ATTENTION_STATES,
  COMPLETION_STATES,
  EVIDENCE_STATES,
  PREDICATE_REQUIREMENTS,
  createPopulationSnapshot,
  createWorkLens,
  deriveEntityAttentionBatch,
} from './derived-attention.mjs';
import { verifySemanticFingerprint, withSemanticFingerprint } from './semantic.mjs';

export const DERIVED_ATTENTION_PROJECTION_SCHEMA = 'vexwork.derived-attention-projection/v1';

const REASON_EVIDENCE_STATES = Object.freeze(EVIDENCE_STATES.filter((state) => state !== 'SATISFIED'));

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function zeroCounts(values) {
  return Object.fromEntries(values.map((value) => [value, 0]));
}

function sorted(values) {
  return [...values].sort((left, right) => left.localeCompare(right));
}

function observedAtRange(entities) {
  if (entities.length === 0) return Object.freeze({ earliestOrNull: null, latestOrNull: null });
  const observed = entities.map((entity) => entity.evidenceObservedAt).sort((left, right) => left.localeCompare(right));
  return Object.freeze({ earliestOrNull: observed[0], latestOrNull: observed.at(-1) });
}

function summarize(entities) {
  const completionCounts = zeroCounts(COMPLETION_STATES);
  const attentionCounts = zeroCounts(ATTENTION_STATES);
  const existingWorkRefs = new Set();
  const entitiesWithExistingWork = new Set();
  const facetsByRef = new Map();

  for (const entity of entities) {
    completionCounts[entity.completionState] += 1;
    attentionCounts[entity.attentionState] += 1;
    if (entity.existingWorkRefs.length > 0) entitiesWithExistingWork.add(entity.entityRef);
    for (const workRef of entity.existingWorkRefs) existingWorkRefs.add(workRef);

    for (const facet of entity.reasonFacets) {
      let aggregate = facetsByRef.get(facet.reasonFacetRef);
      if (!aggregate) {
        aggregate = {
          reasonFacetRef: facet.reasonFacetRef,
          occurrenceCount: 0,
          entityRefs: new Set(),
          predicateRefs: new Set(),
          requirementCounts: zeroCounts(PREDICATE_REQUIREMENTS),
          evidenceStateCounts: zeroCounts(REASON_EVIDENCE_STATES),
        };
        facetsByRef.set(facet.reasonFacetRef, aggregate);
      }
      aggregate.occurrenceCount += 1;
      aggregate.entityRefs.add(entity.entityRef);
      aggregate.predicateRefs.add(facet.predicateRef);
      aggregate.requirementCounts[facet.requirement] += 1;
      aggregate.evidenceStateCounts[facet.evidenceState] += 1;
    }
  }

  const reasonFacets = [...facetsByRef.values()]
    .map((facet) => Object.freeze({
      reasonFacetRef: facet.reasonFacetRef,
      occurrenceCount: facet.occurrenceCount,
      entityCount: facet.entityRefs.size,
      entityRefs: sorted(facet.entityRefs),
      predicateRefs: sorted(facet.predicateRefs),
      requirementCounts: facet.requirementCounts,
      evidenceStateCounts: facet.evidenceStateCounts,
    }))
    .sort((left, right) => left.reasonFacetRef.localeCompare(right.reasonFacetRef));

  return Object.freeze({
    entityCount: entities.length,
    completionCounts,
    attentionCounts,
    evidenceObservedAtRange: observedAtRange(entities),
    entitiesWithExistingWorkCount: entitiesWithExistingWork.size,
    existingWorkRefs: sorted(existingWorkRefs),
    reasonFacets,
  });
}

function projectEntity({ population, evidence, derived }) {
  const entity = population.entities.find((candidate) => candidate.entityRef === evidence.entityRef);
  assert(entity, `derived entity missing from population: ${evidence.entityRef}`);
  assert(verifySemanticFingerprint(derived), `derived attention fingerprint mismatch: ${evidence.entityRef}`);
  return Object.freeze({
    entityRef: entity.entityRef,
    label: entity.label,
    sourceRefs: entity.sourceRefs,
    scopeRefs: entity.scopeRefs,
    evidenceRef: evidence.evidenceRef,
    evidenceSemanticFingerprint: evidence.semanticFingerprint,
    evidenceObservedAt: evidence.observedAt,
    completionState: derived.completionState,
    attentionState: derived.attentionState,
    reasonFacets: derived.reasonFacets,
    existingWorkRefs: derived.existingWorkRefs,
    derivedAttentionSemanticFingerprint: derived.semanticFingerprint,
  });
}

function projectScopes(population, entities) {
  const childrenByParent = new Map(population.scopes.map((scope) => [scope.scopeRef, []]));
  const directByScope = new Map(population.scopes.map((scope) => [scope.scopeRef, new Set()]));
  const entitiesByRef = new Map(entities.map((entity) => [entity.entityRef, entity]));

  for (const scope of population.scopes) {
    if (scope.parentScopeRefOrNull !== null) childrenByParent.get(scope.parentScopeRefOrNull).push(scope.scopeRef);
  }
  for (const childRefs of childrenByParent.values()) childRefs.sort((left, right) => left.localeCompare(right));
  for (const entity of entities) {
    for (const scopeRef of entity.scopeRefs) directByScope.get(scopeRef).add(entity.entityRef);
  }

  const inclusiveMemo = new Map();
  const inclusiveEntityRefs = (scopeRef) => {
    if (inclusiveMemo.has(scopeRef)) return inclusiveMemo.get(scopeRef);
    const refs = new Set(directByScope.get(scopeRef));
    for (const childScopeRef of childrenByParent.get(scopeRef)) {
      for (const entityRef of inclusiveEntityRefs(childScopeRef)) refs.add(entityRef);
    }
    const result = sorted(refs);
    inclusiveMemo.set(scopeRef, result);
    return result;
  };

  return population.scopes.map((scope) => {
    const directEntityRefs = sorted(directByScope.get(scope.scopeRef));
    const entityRefs = inclusiveEntityRefs(scope.scopeRef);
    return Object.freeze({
      scopeRef: scope.scopeRef,
      label: scope.label,
      parentScopeRefOrNull: scope.parentScopeRefOrNull,
      sourceRefs: scope.sourceRefs,
      childScopeRefs: childrenByParent.get(scope.scopeRef),
      directEntityRefs,
      entityRefs,
      summary: summarize(entityRefs.map((entityRef) => entitiesByRef.get(entityRef))),
    });
  });
}

export function projectDerivedAttention({ population, lens, evidence }) {
  population = createPopulationSnapshot(population);
  lens = createWorkLens(lens);
  assert(lens.populationRef === population.populationRef, 'lens populationRef mismatch');
  assert(Array.isArray(evidence), 'projection evidence must be an array');

  const batch = deriveEntityAttentionBatch({ population, lens, evidence });
  const entityRefs = batch.map((entry) => entry.evidence.entityRef);
  const evidenceRefs = batch.map((entry) => entry.evidence.evidenceRef);
  assert(new Set(entityRefs).size === entityRefs.length, 'projection evidence entityRef must be unique');
  assert(new Set(evidenceRefs).size === evidenceRefs.length, 'projection evidenceRef must be unique');

  const expectedEntityRefs = population.entities.map((entity) => entity.entityRef);
  const actualEntityRefs = new Set(entityRefs);
  assert(
    actualEntityRefs.size === expectedEntityRefs.length
      && expectedEntityRefs.every((entityRef) => actualEntityRefs.has(entityRef)),
    'projection evidence must exactly cover population entities',
  );

  const entities = [...batch]
    .sort((left, right) => left.evidence.entityRef.localeCompare(right.evidence.entityRef))
    .map((entry) => projectEntity({
      population,
      evidence: entry.evidence,
      derived: entry.derived,
    }));
  const scopes = projectScopes(population, entities);

  return withSemanticFingerprint({
    schemaVersion: DERIVED_ATTENTION_PROJECTION_SCHEMA,
    populationRef: population.populationRef,
    populationSemanticFingerprint: population.semanticFingerprint,
    snapshotRef: population.snapshotRef,
    populationObservedAt: population.observedAt,
    providerRef: population.providerRef,
    entityKind: population.entityKind,
    lensRef: lens.lensRef,
    lensSemanticFingerprint: lens.semanticFingerprint,
    lensLabel: lens.label,
    lensPurpose: lens.purpose,
    rootScopeRefs: population.scopes
      .filter((scope) => scope.parentScopeRefOrNull === null)
      .map((scope) => scope.scopeRef),
    aggregate: summarize(entities),
    scopes,
    entities,
    effects: false,
    executionAuthority: 'NONE',
  });
}

// [VXG RealForever]
