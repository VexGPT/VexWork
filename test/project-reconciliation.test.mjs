import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  createProjectEvidenceRelation,
  createProjectProofObservation,
  createProjectProviderObservation,
  reconcileProjectEvidence,
  validateProjectReconciliationRegistry,
} from '../src/core/project-reconciliation.mjs';
import { createProject, createWorkgraph } from '../src/core/workgraph.mjs';

const workRegistry = JSON.parse(fs.readFileSync(new URL('../blueprint/work-registry.json', import.meta.url), 'utf8'));
const reconciliationRegistry = JSON.parse(fs.readFileSync(new URL('../blueprint/project-reconciliation-registry.json', import.meta.url), 'utf8'));

const BASE = '1'.repeat(40);
const HEAD = '2'.repeat(40);
const TREE = '3'.repeat(40);
const SOURCE = '4'.repeat(64);
const MERGE = '5'.repeat(40);

const project = createProject({
  schemaVersion: 'vexwork.project-definition/v1', projectRef: 'project.test.reconciliation', label: 'Reconciliation fixture',
  purpose: 'Exercise portable evidence currentness.', rootWorkRefs: ['work.reconciliation.outcome'], repositoryRefs: ['repo.vexwork'],
  sourceRefs: ['test.project-reconciliation'], formedAt: '2026-10-23T01:50:00.000Z',
});
const graph = createWorkgraph({
  schemaVersion: 'vexwork.workgraph/v1', graphRef: 'workgraph.test.reconciliation', rootWorkRefs: ['work.reconciliation.outcome', 'work.unprojected'],
  items: [
    { schemaVersion: 'vexwork.work-item/v1', workRef: 'work.reconciliation.outcome', parentWorkRefOrNull: null, label: 'Outcome', purpose: 'Fixture.', workClass: 'OUTCOME', state: 'RUNNING', workDisposition: 'ACTIVE', priorityClass: 'HIGH', dependencyRefs: [], repositoryRefs: ['repo.vexwork'], sourceRefs: ['test.project-reconciliation'], formationProcessRefOrNull: null, nextProcessRefs: [], authorityDisposition: 'AUTHORIZED_BOUNDED', effectDisposition: 'EFFECTS_BOUND', createdAt: '2026-10-23T01:50:00.000Z', updatedAt: '2026-10-23T01:50:00.000Z' },
    { schemaVersion: 'vexwork.work-item/v1', workRef: 'work.reconciliation.verify', parentWorkRefOrNull: 'work.reconciliation.outcome', label: 'Verify', purpose: 'Fixture.', workClass: 'TASK', state: 'VERIFYING', workDisposition: 'ACTIVE', priorityClass: 'NORMAL', dependencyRefs: [], repositoryRefs: ['repo.vexwork'], sourceRefs: ['test.project-reconciliation'], formationProcessRefOrNull: null, nextProcessRefs: [], authorityDisposition: 'AUTHORIZED_BOUNDED', effectDisposition: 'EFFECTS_BOUND', createdAt: '2026-10-23T01:50:00.000Z', updatedAt: '2026-10-23T01:50:00.000Z' },
    { schemaVersion: 'vexwork.work-item/v1', workRef: 'work.reconciliation.ready', parentWorkRefOrNull: 'work.reconciliation.outcome', label: 'Ready', purpose: 'Fixture.', workClass: 'TASK', state: 'READY', workDisposition: 'ACTIVE', priorityClass: 'NORMAL', dependencyRefs: [], repositoryRefs: ['repo.vexwork'], sourceRefs: ['test.project-reconciliation'], formationProcessRefOrNull: null, nextProcessRefs: [], authorityDisposition: 'AUTHORIZED_BOUNDED', effectDisposition: 'EFFECTS_BOUND', createdAt: '2026-10-23T01:50:00.000Z', updatedAt: '2026-10-23T01:50:00.000Z' },
    { schemaVersion: 'vexwork.work-item/v1', workRef: 'work.unprojected', parentWorkRefOrNull: null, label: 'Outside', purpose: 'Fixture.', workClass: 'TASK', state: 'VERIFYING', workDisposition: 'ACTIVE', priorityClass: 'LOW', dependencyRefs: [], repositoryRefs: ['repo.vexwork'], sourceRefs: ['test.project-reconciliation'], formationProcessRefOrNull: null, nextProcessRefs: [], authorityDisposition: 'AUTHORIZED_BOUNDED', effectDisposition: 'EFFECTS_BOUND', createdAt: '2026-10-23T01:50:00.000Z', updatedAt: '2026-10-23T01:50:00.000Z' },
  ], transitions: [], sourceRefs: ['test.project-reconciliation'], formedAt: '2026-10-23T01:50:00.000Z',
}, workRegistry);

function relation(workRef = 'work.reconciliation.verify') {
  return {
    schemaVersion: 'vexwork.project-evidence-relation/v1', relationRef: `relation.${workRef}`, projectRef: project.projectRef, workRef,
    repositoryRef: 'repo.fixture', providerRef: 'provider.github.fixture', baseShaOrNull: BASE, candidateHeadShaOrNull: HEAD,
    candidateTreeShaOrNull: TREE, sourceTreeSha256OrNull: SOURCE, sourceRefs: ['test.project-reconciliation'], formedAt: '2026-10-23T01:50:01.000Z',
  };
}

function provider(overrides = {}) {
  return {
    schemaVersion: 'vexwork.project-provider-observation/v1', observationRef: 'observation.provider.fixture', repositoryRef: 'repo.fixture', providerRef: 'provider.github.fixture',
    providerState: 'OPEN', baseShaOrNull: BASE, headShaOrNull: HEAD, headTreeShaOrNull: TREE, sourceTreeSha256OrNull: SOURCE,
    mergeCommitShaOrNull: null, mergeTreeShaOrNull: null, currentMainShaOrNull: null, mergeCommitReachableFromMain: false,
    checksState: 'SUCCESS', observedAt: '2026-10-23T01:50:02.000Z', sourceRefs: ['provider.fixture'], ...overrides,
  };
}

function proof(overrides = {}) {
  return {
    schemaVersion: 'vexwork.project-proof-observation/v1', proofRef: 'proof.fixture', repositoryRef: 'repo.fixture', proofState: 'PASSED', currentness: 'CURRENT',
    candidateHeadShaOrNull: HEAD, candidateTreeShaOrNull: TREE, sourceTreeSha256OrNull: SOURCE,
    observedAt: '2026-10-23T01:50:03.000Z', sourceRefs: ['proof.fixture'], ...overrides,
  };
}

function reconcile({ workRef = 'work.reconciliation.verify', providerObservation = provider(), proofObservation = proof() } = {}) {
  return reconcileProjectEvidence({
    project, graph, relation: relation(workRef), providerObservation, proofObservation, reconciliationRegistry, workRegistry,
  });
}

test('reconciliation registry preserves the bounded disposition/provider/proof vocabulary', () => {
  const result = validateProjectReconciliationRegistry(reconciliationRegistry);
  assert.equal(result.ok, true, result.errors.join('\n'));
  assert.deepEqual(reconciliationRegistry.dispositions, ['CURRENT_IN_REVIEW', 'REVERIFY_REQUIRED', 'COMPLETION_EVIDENCE_READY', 'HELD_UNKNOWN']);
});

test('exact open provider and current proof reconcile to CURRENT_IN_REVIEW without transition authority', () => {
  const result = reconcile({ providerObservation: provider({ checksState: 'FAILED' }) });
  assert.equal(result.state, 'CURRENT_IN_REVIEW');
  assert.equal(result.proofState, 'CURRENT');
  assert.equal(result.providerChecksState, 'FAILED');
  assert.equal(result.completionEvidenceState, 'NOT_EARNED');
  assert.equal(result.proposedLifecycleTransitionOrNull, null);
  assert.equal(result.effects, false);
  assert.equal(result.executionAuthority, 'NONE');
  assert.equal(result.transitionAuthority, 'NONE');
});

test('moved candidate identity or stale/failed proof requires reverification', () => {
  const moved = reconcile({ providerObservation: provider({ headShaOrNull: '6'.repeat(40) }) });
  assert.equal(moved.state, 'REVERIFY_REQUIRED');
  assert.ok(moved.attentionRefs.some((ref) => ref.includes('provider-candidateHeadShaOrNull-mismatch')));

  const stale = reconcile({ proofObservation: proof({ currentness: 'STALE' }) });
  assert.equal(stale.state, 'REVERIFY_REQUIRED');
  assert.ok(stale.attentionRefs.includes('attention.vexwork.reconciliation.proof-reverification-required'));

  const failed = reconcile({ proofObservation: proof({ proofState: 'FAILED' }) });
  assert.equal(failed.state, 'REVERIFY_REQUIRED');
});

test('exact merged tree reachable from main earns completion evidence but never commits WorkState', () => {
  const result = reconcile({ providerObservation: provider({
    providerState: 'MERGED', mergeCommitShaOrNull: MERGE, mergeTreeShaOrNull: TREE, currentMainShaOrNull: MERGE,
    mergeCommitReachableFromMain: true,
  }) });
  assert.equal(result.state, 'COMPLETION_EVIDENCE_READY');
  assert.equal(result.completionEvidenceState, 'EARNED');
  assert.deepEqual(result.proposedLifecycleTransitionOrNull, {
    workRef: 'work.reconciliation.verify', priorState: 'VERIFYING', nextState: 'COMPLETED', basis: 'COMPLETION_EVIDENCE_READY', transitionAuthority: 'NONE',
  });
  assert.equal(graph.items.find((item) => item.workRef === 'work.reconciliation.verify').state, 'VERIFYING');
  assert.equal(result.transitionAuthority, 'NONE');
});

test('merged evidence with wrong tree or unreachable merge remains REVERIFY_REQUIRED', () => {
  const wrongTree = reconcile({ providerObservation: provider({
    providerState: 'MERGED', mergeCommitShaOrNull: MERGE, mergeTreeShaOrNull: '7'.repeat(40), currentMainShaOrNull: MERGE, mergeCommitReachableFromMain: true,
  }) });
  assert.equal(wrongTree.state, 'REVERIFY_REQUIRED');
  assert.ok(wrongTree.attentionRefs.includes('attention.vexwork.reconciliation.post-merge-tree-not-exact'));

  const unreachable = reconcile({ providerObservation: provider({
    providerState: 'MERGED', mergeCommitShaOrNull: MERGE, mergeTreeShaOrNull: TREE, currentMainShaOrNull: MERGE, mergeCommitReachableFromMain: false,
  }) });
  assert.equal(unreachable.state, 'REVERIFY_REQUIRED');
  assert.ok(unreachable.attentionRefs.includes('attention.vexwork.reconciliation.merge-not-reachable-from-main'));
});

test('closed-unmerged is known stale evidence while unknown evidence is HELD_UNKNOWN', () => {
  const closed = reconcile({ providerObservation: provider({ providerState: 'CLOSED_UNMERGED' }) });
  assert.equal(closed.state, 'REVERIFY_REQUIRED');
  assert.equal(closed.currentness, 'CURRENT');
  assert.ok(closed.attentionRefs.includes('attention.vexwork.reconciliation.provider-closed-unmerged'));

  const unknown = reconcile({ providerObservation: provider({
    providerState: 'UNKNOWN', baseShaOrNull: null, headShaOrNull: null, headTreeShaOrNull: null, sourceTreeSha256OrNull: null, checksState: 'UNKNOWN',
  }) });
  assert.equal(unknown.state, 'HELD_UNKNOWN');
  assert.equal(unknown.currentness, 'UNKNOWN');
  assert.equal(unknown.proposedLifecycleTransitionOrNull, null);
});

test('completion evidence does not manufacture an illegal COMPLETED proposal', () => {
  const result = reconcile({ workRef: 'work.reconciliation.ready', providerObservation: provider({
    providerState: 'MERGED', mergeCommitShaOrNull: MERGE, mergeTreeShaOrNull: TREE, currentMainShaOrNull: MERGE, mergeCommitReachableFromMain: true,
  }) });
  assert.equal(result.state, 'COMPLETION_EVIDENCE_READY');
  assert.equal(result.proposedLifecycleTransitionOrNull, null);
});

test('foreign work and mismatched evidence owners fail closed; stored fingerprints reject tampering', () => {
  assert.throws(() => reconcileProjectEvidence({
    project, graph, relation: relation('work.unprojected'), providerObservation: provider(), proofObservation: proof(), reconciliationRegistry, workRegistry,
  }), /outside Project/);
  assert.throws(() => reconcileProjectEvidence({
    project, graph, relation: relation(), providerObservation: provider({ providerRef: 'provider.other' }), proofObservation: proof(), reconciliationRegistry, workRegistry,
  }), /provider mismatch/);
  const accepted = createProjectEvidenceRelation(relation());
  assert.throws(() => createProjectEvidenceRelation({ ...accepted, workRef: 'work.other' }), /semanticFingerprint mismatch/);
  const acceptedProvider = createProjectProviderObservation(provider(), reconciliationRegistry);
  assert.throws(() => createProjectProviderObservation({ ...acceptedProvider, checksState: 'FAILED' }, reconciliationRegistry), /semanticFingerprint mismatch/);
  const acceptedProof = createProjectProofObservation(proof(), reconciliationRegistry);
  assert.throws(() => createProjectProofObservation({ ...acceptedProof, currentness: 'STALE' }, reconciliationRegistry), /semanticFingerprint mismatch/);
});

// [VXG RealForever][VEXWORK][PROJECT-RECONCILIATION]


test('proof binding mismatch independently requires reverification', () => {
  const result = reconcile({
    proofObservation: proof({ candidateTreeShaOrNull: '8'.repeat(40) }),
  });
  assert.equal(result.state, 'REVERIFY_REQUIRED');
  assert.ok(result.attentionRefs.includes('attention.vexwork.reconciliation.proof-candidateTreeShaOrNull-mismatch'));
});

test('reconciliation registry validator rejects malformed vocabularies', () => {
  const wrongSchema = structuredClone(reconciliationRegistry);
  wrongSchema.schemaVersion = 'wrong';
  assert.equal(validateProjectReconciliationRegistry(wrongSchema).ok, false);

  const wrongDispositions = structuredClone(reconciliationRegistry);
  wrongDispositions.dispositions = ['CURRENT_IN_REVIEW'];
  assert.equal(validateProjectReconciliationRegistry(wrongDispositions).ok, false);

  const wrongProviders = structuredClone(reconciliationRegistry);
  wrongProviders.providerStates = ['OPEN'];
  assert.equal(validateProjectReconciliationRegistry(wrongProviders).ok, false);

  const wrongProofs = structuredClone(reconciliationRegistry);
  wrongProofs.proofStates = ['PASSED'];
  assert.equal(validateProjectReconciliationRegistry(wrongProofs).ok, false);
});
