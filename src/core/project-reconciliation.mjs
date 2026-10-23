import { verifySemanticFingerprint, withSemanticFingerprint } from './semantic.mjs';
import { projectWorkRefs } from './workgraph.mjs';

export const PROJECT_RECONCILIATION_REGISTRY_SCHEMA = 'vexwork.project-reconciliation-registry/v1';
export const PROJECT_EVIDENCE_RELATION_SCHEMA = 'vexwork.project-evidence-relation/v1';
export const PROJECT_PROVIDER_OBSERVATION_SCHEMA = 'vexwork.project-provider-observation/v1';
export const PROJECT_PROOF_OBSERVATION_SCHEMA = 'vexwork.project-proof-observation/v1';
export const PROJECT_RECONCILIATION_RESULT_SCHEMA = 'vexwork.project-reconciliation-result/v1';

const REF = /^[A-Za-z0-9][A-Za-z0-9._:/-]*$/u;
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/u;
const SHA40 = /^[a-f0-9]{40}$/u;
const SHA64 = /^[a-f0-9]{64}$/u;

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function stableRef(value, label) {
  assert(typeof value === 'string' && REF.test(value), `${label} must be one stable ref`);
  return value;
}

function timestamp(value, label) {
  assert(typeof value === 'string' && ISO.test(value) && new Date(value).toISOString() === value, `${label} must be canonical UTC ISO`);
  return value;
}

function refs(values, label) {
  assert(Array.isArray(values), `${label} must be an array`);
  const accepted = values.map((value, index) => stableRef(value, `${label}[${index}]`));
  assert(new Set(accepted).size === accepted.length, `${label} must be unique`);
  return [...accepted].sort();
}

function shaOrNull(value, regex, label) {
  assert(value === null || (typeof value === 'string' && regex.test(value)), `${label} invalid`);
  return value;
}

function storedFingerprintIfPresent(value, label) {
  if (value?.semanticFingerprint !== undefined) assert(verifySemanticFingerprint(value), `${label} semanticFingerprint mismatch`);
}

export function validateProjectReconciliationRegistry(registry) {
  const errors = [];
  if (registry?.schemaVersion !== PROJECT_RECONCILIATION_REGISTRY_SCHEMA) errors.push('project reconciliation registry schema mismatch');
  if (typeof registry?.registryRef !== 'string' || !REF.test(registry.registryRef ?? '')) errors.push('project reconciliation registryRef invalid');
  if (!Number.isSafeInteger(registry?.registryVersion) || registry.registryVersion < 1) errors.push('project reconciliation registryVersion invalid');
  if (typeof registry?.purpose !== 'string' || !registry.purpose.trim()) errors.push('project reconciliation registry purpose required');
  const expectedDispositions = ['CURRENT_IN_REVIEW', 'REVERIFY_REQUIRED', 'COMPLETION_EVIDENCE_READY', 'HELD_UNKNOWN'];
  if (JSON.stringify(registry?.dispositions) !== JSON.stringify(expectedDispositions)) errors.push('project reconciliation dispositions invalid');
  const expectedProviderStates = ['OPEN', 'MERGED', 'CLOSED_UNMERGED', 'UNKNOWN'];
  if (JSON.stringify(registry?.providerStates) !== JSON.stringify(expectedProviderStates)) errors.push('project reconciliation provider states invalid');
  const expectedProofStates = ['PASSED', 'FAILED', 'UNKNOWN'];
  if (JSON.stringify(registry?.proofStates) !== JSON.stringify(expectedProofStates)) errors.push('project reconciliation proof states invalid');
  return Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) });
}

export function createProjectEvidenceRelation(input) {
  storedFingerprintIfPresent(input, 'project evidence relation');
  assert(input?.schemaVersion === PROJECT_EVIDENCE_RELATION_SCHEMA, 'project evidence relation schema mismatch');
  stableRef(input.relationRef, 'relationRef');
  stableRef(input.projectRef, 'projectRef');
  stableRef(input.workRef, 'workRef');
  stableRef(input.repositoryRef, 'repositoryRef');
  stableRef(input.providerRef, 'providerRef');
  shaOrNull(input.baseShaOrNull, SHA40, 'baseShaOrNull');
  shaOrNull(input.candidateHeadShaOrNull, SHA40, 'candidateHeadShaOrNull');
  shaOrNull(input.candidateTreeShaOrNull, SHA40, 'candidateTreeShaOrNull');
  shaOrNull(input.sourceTreeSha256OrNull, SHA64, 'sourceTreeSha256OrNull');
  const sourceRefs = refs(input.sourceRefs, 'sourceRefs');
  assert(sourceRefs.length > 0, 'sourceRefs must be non-empty');
  timestamp(input.formedAt, 'formedAt');
  return withSemanticFingerprint({
    schemaVersion: PROJECT_EVIDENCE_RELATION_SCHEMA,
    relationRef: input.relationRef,
    projectRef: input.projectRef,
    workRef: input.workRef,
    repositoryRef: input.repositoryRef,
    providerRef: input.providerRef,
    baseShaOrNull: input.baseShaOrNull,
    candidateHeadShaOrNull: input.candidateHeadShaOrNull,
    candidateTreeShaOrNull: input.candidateTreeShaOrNull,
    sourceTreeSha256OrNull: input.sourceTreeSha256OrNull,
    sourceRefs,
    formedAt: input.formedAt,
  });
}

export function createProjectProviderObservation(input, registry) {
  storedFingerprintIfPresent(input, 'project provider observation');
  assert(input?.schemaVersion === PROJECT_PROVIDER_OBSERVATION_SCHEMA, 'project provider observation schema mismatch');
  stableRef(input.observationRef, 'observationRef');
  stableRef(input.repositoryRef, 'repositoryRef');
  stableRef(input.providerRef, 'providerRef');
  assert(registry.providerStates.includes(input.providerState), 'unsupported providerState');
  shaOrNull(input.baseShaOrNull, SHA40, 'baseShaOrNull');
  shaOrNull(input.headShaOrNull, SHA40, 'headShaOrNull');
  shaOrNull(input.headTreeShaOrNull, SHA40, 'headTreeShaOrNull');
  shaOrNull(input.sourceTreeSha256OrNull, SHA64, 'sourceTreeSha256OrNull');
  shaOrNull(input.mergeCommitShaOrNull, SHA40, 'mergeCommitShaOrNull');
  shaOrNull(input.mergeTreeShaOrNull, SHA40, 'mergeTreeShaOrNull');
  shaOrNull(input.currentMainShaOrNull, SHA40, 'currentMainShaOrNull');
  assert(typeof input.mergeCommitReachableFromMain === 'boolean', 'mergeCommitReachableFromMain must be boolean');
  assert(['SUCCESS', 'PENDING', 'FAILED', 'UNKNOWN'].includes(input.checksState), 'unsupported checksState');
  timestamp(input.observedAt, 'observedAt');
  const sourceRefs = refs(input.sourceRefs, 'sourceRefs');
  assert(sourceRefs.length > 0, 'sourceRefs must be non-empty');
  return withSemanticFingerprint({
    schemaVersion: PROJECT_PROVIDER_OBSERVATION_SCHEMA,
    observationRef: input.observationRef,
    repositoryRef: input.repositoryRef,
    providerRef: input.providerRef,
    providerState: input.providerState,
    baseShaOrNull: input.baseShaOrNull,
    headShaOrNull: input.headShaOrNull,
    headTreeShaOrNull: input.headTreeShaOrNull,
    sourceTreeSha256OrNull: input.sourceTreeSha256OrNull,
    mergeCommitShaOrNull: input.mergeCommitShaOrNull,
    mergeTreeShaOrNull: input.mergeTreeShaOrNull,
    currentMainShaOrNull: input.currentMainShaOrNull,
    mergeCommitReachableFromMain: input.mergeCommitReachableFromMain,
    checksState: input.checksState,
    observedAt: input.observedAt,
    sourceRefs,
  });
}

export function createProjectProofObservation(input, registry) {
  storedFingerprintIfPresent(input, 'project proof obser