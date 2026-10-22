import { verifySemanticFingerprint, withSemanticFingerprint } from './semantic.mjs';

export const POPULATION_SNAPSHOT_SCHEMA = 'vexwork.entity-population-snapshot/v1';
export const WORK_LENS_SCHEMA = 'vexwork.work-lens/v1';
export const ENTITY_LENS_EVIDENCE_SCHEMA = 'vexwork.entity-lens-evidence/v1';
export const DERIVED_ATTENTION_SCHEMA = 'vexwork.derived-attention/v1';

export const PREDICATE_REQUIREMENTS = Object.freeze(['REQUIRED', 'ADVISORY']);
export const EVIDENCE_STATES = Object.freeze(['SATISFIED', 'UNSATISFIED', 'UNKNOWN', 'NOT_APPLICABLE']);
export const COMPLETION_STATES = Object.freeze(['COMPLETE', 'INCOMPLETE', 'UNKNOWN', 'NOT_APPLICABLE']);
export const ATTENTION_STATES = Object.freeze(['CLEAR', 'ATTENTION', 'UNKNOWN', 'NOT_APPLICABLE']);

const REF = /^[A-Za-z0-9][A-Za-z0-9._:/-]*$/u;
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/u;

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function stableRef(value, label) {
  assert(typeof value === 'string' && REF.test(value), `${label} must be one stable ref`);
  return value;
}

function optionalRef(value, label) {
  if (value === null) return null;
  return stableRef(value, label);
}

function refs(values, label, { allowEmpty = true } = {}) {
  assert(Array.isArray(values), `${label} must be an array`);
  if (!allowEmpty) assert(values.length > 0, `${label} must not be empty`);
  const result = values.map((value, index) => stableRef(value, `${label}[${index}]`));
  assert(new Set(result).size === result.length, `${label} must be unique`);
  return result.sort((left, right) => left.localeCompare(right));
}

function timestamp(value, label) {
  assert(typeof value === 'string' && ISO.test(value) && new Date(value).toISOString() === value, `${label} must be canonical UTC ISO`);
  return value;
}

function text(value, label) {
  assert(typeof value === 'string' && value.trim(), `${label} required`);
  return value;
}

function assertStoredFingerprintIfPresent(value, label) {
  if (value?.semanticFingerprint !== undefined) {
    assert(verifySemanticFingerprint(value), `${label} semanticFingerprint mismatch`);
  }
}

function withCanonicalSemanticFingerprint(input, normalized, label) {
  const accepted = withSemanticFingerprint(normalized);
  if (input?.semanticFingerprint !== undefined) {
    assert(input.semanticFingerprint === accepted.semanticFingerprint, `${label} semanticFingerprint is not canonical`);
  }
  return accepted;
}

function assertScopeAcyclic(scopes) {
  const byRef = new Map(scopes.map((scope) => [scope.scopeRef, scope]));
  const visiting = new Set();
  const visited = new Set();
  const visit = (scopeRef) => {
    if (visiting.has(scopeRef)) throw new TypeError(`scope cycle detected at ${scopeRef}`);
    if (visited.has(scopeRef)) return;
    visiting.add(scopeRef);
    const parent = byRef.get(scopeRef).parentScopeRefOrNull;
    if (parent !== null) visit(parent);
    visiting.delete(scopeRef);
    visited.add(scopeRef);
  };
  for (const scopeRef of byRef.keys()) visit(scopeRef);
}

export function createPopulationSnapshot(input) {
  assertStoredFingerprintIfPresent(input, 'population snapshot');
  assert(input?.schemaVersion === POPULATION_SNAPSHOT_SCHEMA, 'population snapshot schema mismatch');
  stableRef(input.populationRef, 'populationRef');
  stableRef(input.snapshotRef, 'snapshotRef');
  stableRef(input.providerRef, 'providerRef');
  stableRef(input.entityKind, 'entityKind');
  text(input.label, 'population label');
  timestamp(input.observedAt, 'observedAt');
  const sourceRefs = refs(input.sourceRefs, 'sourceRefs', { allowEmpty: false });
  assert(Array.isArray(input.scopes), 'scopes must be an array');
  assert(Array.isArray(input.entities), 'entities must be an array');

  const scopes = input.scopes.map((scope, index) => {
    stableRef(scope?.scopeRef, `scopes[${index}].scopeRef`);
    text(scope?.label, `scopes[${index}].label`);
    optionalRef(scope?.parentScopeRefOrNull, `scopes[${index}].parentScopeRefOrNull`);
    const sourceRefs = refs(scope?.sourceRefs, `scopes[${index}].sourceRefs`, { allowEmpty: false });
    return { ...scope, sourceRefs };
  });
  const scopeRefs = new Set(scopes.map((scope) => scope.scopeRef));
  assert(scopeRefs.size === scopes.length, 'scopeRef must be unique');
  for (const scope of scopes) {
    if (scope.parentScopeRefOrNull !== null) {
      assert(scopeRefs.has(scope.parentScopeRefOrNull), `${scope.scopeRef} parent scope missing`);
      assert(scope.parentScopeRefOrNull !== scope.scopeRef, `${scope.scopeRef} cannot parent itself`);
    }
  }
  scopes.sort((left, right) => left.scopeRef.localeCompare(right.scopeRef));
  assertScopeAcyclic(scopes);

  const entities = input.entities.map((entity, index) => {
    stableRef(entity?.entityRef, `entities[${index}].entityRef`);
    text(entity?.label, `entities[${index}].label`);
    const entityScopeRefs = refs(entity?.scopeRefs, `entities[${index}].scopeRefs`);
    assert(entityScopeRefs.every((scopeRef) => scopeRefs.has(scopeRef)), `${entity.entityRef} contains unknown scopeRef`);
    const sourceRefs = refs(entity?.sourceRefs, `entities[${index}].sourceRefs`, { allowEmpty: false });
    return { ...entity, scopeRefs: entityScopeRefs, sourceRefs };
  });
  assert(new Set(entities.map((entity) => entity.entityRef)).size === entities.length, 'entityRef must be unique');
  entities.sort((left, right) => left.entityRef.localeCompare(right.entityRef));

  return withCanonicalSemanticFingerprint(input, { ...input, sourceRefs, scopes, entities }, 'population snapshot');
}

export function createWorkLens(input) {
  assertStoredFingerprintIfPresent(input, 'work lens');
  assert(input?.schemaVersion === WORK_LENS_SCHEMA, 'work lens schema mismatch');
  stableRef(input.lensRef, 'lensRef');
  stableRef(input.populationRef, 'populationRef');
  text(input.label, 'lens label');
  text(input.purpose, 'lens purpose');
  const sourceRefs = refs(input.sourceRefs, 'sourceRefs', { allowEmpty: false });
  assert(Array.isArray(input.predicates) && input.predicates.length > 0, 'lens predicates required');

  const predicates = input.predicates.map((predicate, index) => {
    stableRef(predicate?.predicateRef, `predicates[${index}].predicateRef`);
    stableRef(predicate?.reasonFacetRef, `predicates[${index}].reasonFacetRef`);
    text(predicate?.label, `predicates[${index}].label`);
    assert(PREDICATE_REQUIREMENTS.includes(predicate?.requirement), `unsupported predicate requirement ${predicate?.requirement}`);
    const sourceRefs = refs(predicate?.sourceRefs, `predicates[${index}].sourceRefs`, { allowEmpty: false });
    return { ...predicate, sourceRefs };
  });
  assert(new Set(predicates.map((predicate) => predicate.predicateRef)).size === predicates.length, 'predicateRef must be unique');
  predicates.sort((left, right) => left.predicateRef.localeCompare(right.predicateRef));

  return withCanonicalSemanticFingerprint(input, { ...input, sourceRefs, predicates }, 'work lens');
}

export function createEntityLensEvidence(input, { population, lens }) {
  population = createPopulationSnapshot(population);
  lens = createWorkLens(lens);
  assertStoredFingerprintIfPresent(input, 'entity lens evidence');
  assert(input?.schemaVersion === ENTITY_LENS_EVIDENCE_SCHEMA, 'entity lens evidence schema mismatch');
  stableRef(input.evidenceRef, 'evidenceRef');
  stableRef(input.populationRef, 'populationRef');
  stableRef(input.lensRef, 'lensRef');
  stableRef(input.entityRef, 'entityRef');
  assert(input.populationRef === population.populationRef, 'evidence populationRef mismatch');
  assert(input.populationSemanticFingerprint === population.semanticFingerprint, 'stale population snapshot evidence');
  assert(input.lensRef === lens.lensRef, 'evidence lensRef mismatch');
  assert(input.lensSemanticFingerprint === lens.semanticFingerprint, 'stale work lens evidence');
  assert(lens.populationRef === population.populationRef, 'lens populationRef mismatch');
  assert(population.entities.some((entity) => entity.entityRef === input.entityRef), `evidence entity missing from population: ${input.entityRef}`);
  timestamp(input.observedAt, 'evidence observedAt');
  const existingWorkRefs = refs(input.existingWorkRefs, 'existingWorkRefs');
  assert(Array.isArray(input.predicateResults), 'predicateResults must be an array');

  const predicateRefs = new Set(lens.predicates.map((predicate) => predicate.predicateRef));
  const predicateResults = input.predicateResults.map((result, index) => {
    stableRef(result?.predicateRef, `predicateResults[${index}].predicateRef`);
    assert(predicateRefs.has(result.predicateRef), `unknown predicate result ${result.predicateRef}`);
    assert(EVIDENCE_STATES.includes(result?.state), `unsupported evidence state ${result?.state}`);
    const evidenceRefs = refs(result?.evidenceRefs, `predicateResults[${index}].evidenceRefs`);
    if (result.state !== 'UNKNOWN') {
      assert(evidenceRefs.length > 0, `${result.predicateRef} ${result.state} requires evidenceRefs`);
    }
    return { ...result, evidenceRefs };
  });
  assert(new Set(predicateResults.map((result) => result.predicateRef)).size === predicateResults.length, 'predicate result must be unique');
  assert(predicateResults.length === predicateRefs.size && predicateResults.every((result) => predicateRefs.has(result.predicateRef)), 'predicateResults must exactly cover lens predicates');
  predicateResults.sort((left, right) => left.predicateRef.localeCompare(right.predicateRef));

  return withCanonicalSemanticFingerprint(input, { ...input, existingWorkRefs, predicateResults }, 'entity lens evidence');
}

function completionState(predicates, resultsByRef) {
  const required = predicates
    .filter((predicate) => predicate.requirement === 'REQUIRED')
    .map((predicate) => resultsByRef.get(predicate.predicateRef));
  if (required.length === 0 || required.every((result) => result.state === 'NOT_APPLICABLE')) return 'NOT_APPLICABLE';
  if (required.some((result) => result.state === 'UNSATISFIED')) return 'INCOMPLETE';
  if (required.some((result) => result.state === 'UNKNOWN')) return 'UNKNOWN';
  return 'COMPLETE';
}

function attentionState(predicateResults) {
  const applicable = predicateResults.filter((result) => result.state !== 'NOT_APPLICABLE');
  if (applicable.length === 0) return 'NOT_APPLICABLE';
  if (applicable.some((result) => result.state === 'UNSATISFIED')) return 'ATTENTION';
  if (applicable.some((result) => result.state === 'UNKNOWN')) return 'UNKNOWN';
  return 'CLEAR';
}

export function deriveEntityAttention({ population, lens, evidence }) {
  population = createPopulationSnapshot(population);
  lens = createWorkLens(lens);
  evidence = createEntityLensEvidence(evidence, { population, lens });
  const entity = population.entities.find((candidate) => candidate.entityRef === evidence.entityRef);
  const predicatesByRef = new Map(lens.predicates.map((predicate) => [predicate.predicateRef, predicate]));
  const resultsByRef = new Map(evidence.predicateResults.map((result) => [result.predicateRef, result]));
  const reasonFacets = evidence.predicateResults
    .filter((result) => result.state !== 'SATISFIED')
    .map((result) => {
      const predicate = predicatesByRef.get(result.predicateRef);
      return Object.freeze({
        reasonFacetRef: predicate.reasonFacetRef,
        predicateRef: predicate.predicateRef,
        requirement: predicate.requirement,
        evidenceState: result.state,
        evidenceRefs: result.evidenceRefs,
      });
    })
    .sort((left, right) => left.reasonFacetRef.localeCompare(right.reasonFacetRef) || left.predicateRef.localeCompare(right.predicateRef));

  const result = withSemanticFingerprint({
    schemaVersion: DERIVED_ATTENTION_SCHEMA,
    populationRef: population.populationRef,
    populationSemanticFingerprint: population.semanticFingerprint,
    snapshotRef: population.snapshotRef,
    lensRef: lens.lensRef,
    lensSemanticFingerprint: lens.semanticFingerprint,
    evidenceRef: evidence.evidenceRef,
    evidenceSemanticFingerprint: evidence.semanticFingerprint,
    entityRef: entity.entityRef,
    entityKind: population.entityKind,
    scopeRefs: entity.scopeRefs,
    completionState: completionState(lens.predicates, resultsByRef),
    attentionState: attentionState(evidence.predicateResults),
    reasonFacets,
    existingWorkRefs: evidence.existingWorkRefs,
    effects: false,
    executionAuthority: 'NONE',
  });
  assert(COMPLETION_STATES.includes(result.completionState), 'derived completionState invalid');
  assert(ATTENTION_STATES.includes(result.attentionState), 'derived attentionState invalid');
  return result;
}

// [VXG RealForever]
