import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ENTITY_LENS_EVIDENCE_SCHEMA,
  POPULATION_SNAPSHOT_SCHEMA,
  WORK_LENS_SCHEMA,
  createPopulationSnapshot,
  createWorkLens,
} from '../src/core/derived-attention.mjs';
import { projectDerivedAttention } from '../src/core/derived-attention-projection.mjs';
import {
  DERIVED_WORK_PROMOTION_DECISION_SCHEMA,
  DERIVED_WORK_PROMOTION_PROCESS_REF,
  DERIVED_WORK_PROMOTION_PROPOSAL_SCHEMA,
  DERIVED_WORK_PROMOTION_RESULT_SCHEMA,
  applyDerivedWorkPromotion,
  createDerivedWorkPromotionDecision,
  createDerivedWorkPromotionProposal,
} from '../src/core/derived-work-promotion.mjs';
import {
  WORKGRAPH_SCHEMA,
  WORK_ITEM_SCHEMA,
  createWorkgraph,
} from '../src/core/workgraph.mjs';
import { verifySemanticFingerprint, withSemanticFingerprint } from '../src/core/semantic.mjs';

const P = Object.freeze({
  alpha: Object.freeze({ runtime: 'UNSATISFIED', modernization: 'SATISFIED' }),
  beta: Object.freeze({ runtime: 'UNSATISFIED', modernization: 'NOT_APPLICABLE' }),
  gamma: Object.freeze({ runtime: 'NOT_APPLICABLE', modernization: 'NOT_APPLICABLE' }),
});

const registry = Object.freeze({
  workClasses: ['OUTCOME', 'TASK', 'DEFECT', 'POTENTIAL'],
  lifecycleStates: [
    'CAPTURED', 'NEEDS_CLARIFICATION', 'DECOMPOSED', 'PLAN_VALIDATED',
    'WAITING_DEPENDENCIES', 'WAITING_RESOURCE', 'READY', 'RUNNING',
    'VERIFYING', 'BLOCKED', 'COMPLETED', 'CANCELLED', 'SUPERSEDED',
    'PARKED', 'ARCHIVED',
  ],
  allowedTransitions: {},
  workDispositions: ['ACTIVE', 'PARKED'],
  priorityClasses: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'UNSET'],
  authorityDispositions: ['AUTHORIZED_BOUNDED', 'AUTHORITY_REQUIRED', 'NO_AUTHORITY'],
  effectDispositions: ['EFFECTS_ALLOWED_BOUNDED', 'EFFECTS_HELD', 'NO_EFFECTS'],
});

function workItem({
  workRef,
  parentWorkRefOrNull = 'work.example.outcome',
  label = workRef,
  purpose = `Purpose for ${workRef}`,
  workClass = 'TASK',
  state = 'READY',
  sourceRefs = ['source.example'],
  formationProcessRefOrNull = 'process.example.seed',
  createdAt = '2026-10-22T06:00:00.000Z',
  updatedAt = createdAt,
  dependencyRefs = [],
} = {}) {
  return {
    schemaVersion: WORK_ITEM_SCHEMA,
    workRef,
    parentWorkRefOrNull,
    label,
    purpose,
    workClass,
    state,
    workDisposition: 'ACTIVE',
    priorityClass: 'MEDIUM',
    authorityDisposition: 'AUTHORIZED_BOUNDED',
    effectDisposition: 'EFFECTS_ALLOWED_BOUNDED',
    dependencyRefs,
    repositoryRefs: ['repo.example'],
    sourceRefs,
    formationProcessRefOrNull,
    nextProcessRefs: [],
    createdAt,
    updatedAt,
  };
}

function graphFixture() {
  return createWorkgraph({
    schemaVersion: WORKGRAPH_SCHEMA,
    graphRef: 'graph.example.001',
    rootWorkRefs: ['work.example.outcome'],
    sourceRefs: ['source.graph.example'],
    formedAt: '2026-10-22T05:00:00.000Z',
    items: [
      workItem({
        workRef: 'work.example.outcome',
        parentWorkRefOrNull: null,
        workClass: 'OUTCOME',
        label: 'Example outcome',
        formationProcessRefOrNull: null,
        sourceRefs: ['source.outcome.example'],
      }),
      workItem({
        workRef: 'work.example.beta-existing',
        label: 'Existing beta runtime work',
        sourceRefs: ['source.existing.beta'],
      }),
    ],
    transitions: [],
  }, registry);
}

function populationFixture() {
  return createPopulationSnapshot({
    schemaVersion: POPULATION_SNAPSHOT_SCHEMA,
    populationRef: 'population.example.pages',
    snapshotRef: 'snapshot.example.pages.001',
    providerRef: 'provider.example.pages',
    entityKind: 'entity.example.page',
    label: 'Example pages',
    observedAt: '2026-10-22T06:00:00.000Z',
    sourceRefs: ['source.population.example'],
    scopes: [{
      scopeRef: 'scope.example.all',
      label: 'All pages',
      parentScopeRefOrNull: null,
      sourceRefs: ['source.scope.example'],
    }],
    entities: [
      {
        entityRef: 'entity.example.alpha',
        label: 'Alpha',
        scopeRefs: ['scope.example.all'],
        sourceRefs: ['source.entity.alpha'],
      },
      {
        entityRef: 'entity.example.beta',
        label: 'Beta',
        scopeRefs: ['scope.example.all'],
        sourceRefs: ['source.entity.beta'],
      },
      {
        entityRef: 'entity.example.gamma',
        label: 'Gamma',
        scopeRefs: ['scope.example.all'],
        sourceRefs: ['source.entity.gamma'],
      },
    ],
  });
}

function lensFixture() {
  return createWorkLens({
    schemaVersion: WORK_LENS_SCHEMA,
    lensRef: 'lens.example.localization',
    populationRef: 'population.example.pages',
    label: 'Localization',
    purpose: 'Evaluate localization without manufacturing Work.',
    sourceRefs: ['source.lens.example'],
    predicates: [
      {
        predicateRef: 'predicate.example.runtime',
        label: 'Runtime current',
        requirement: 'REQUIRED',
        reasonFacetRef: 'reason.example.runtime',
        sourceRefs: ['source.predicate.runtime'],
      },
      {
        predicateRef: 'predicate.example.modernization',
        label: 'Shell modernized',
        requirement: 'ADVISORY',
        reasonFacetRef: 'reason.example.modernization',
        sourceRefs: ['source.predicate.modernization'],
      },
    ],
  });
}

function evidenceFixture(population, lens) {
  return population.entities.map((entity, entityIndex) => ({
    schemaVersion: ENTITY_LENS_EVIDENCE_SCHEMA,
    evidenceRef: `evidence.example.${entity.entityRef.split('.').at(-1)}`,
    populationRef: population.populationRef,
    populationSemanticFingerprint: population.semanticFingerprint,
    lensRef: lens.lensRef,
    lensSemanticFingerprint: lens.semanticFingerprint,
    entityRef: entity.entityRef,
    observedAt: `2026-10-22T06:0${entityIndex + 1}:00.000Z`,
    predicateResults: lens.predicates.map((predicate, predicateIndex) => {
      const entityName = entity.entityRef.split('.').at(-1);
      const predicateName = predicate.predicateRef.split('.').at(-1);
      const state = P[entityName][predicateName];
      return {
        predicateRef: predicate.predicateRef,
        state,
        evidenceRefs: state === 'UNKNOWN' ? [] : [`evidence.source.${entityIndex}.${predicateIndex}`],
      };
    }),
    existingWorkRefs: entity.entityRef === 'entity.example.beta'
      ? ['work.example.beta-existing']
      : [],
  }));
}

function projectionFixture() {
  const population = populationFixture();
  const lens = lensFixture();
  return projectDerivedAttention({
    population,
    lens,
    evidence: evidenceFixture(population, lens),
  });
}

const formedAt = '2026-10-22T06:10:00.000Z';

function newCandidateSourceRefs() {
  return [
    'proposal.example.alpha-runtime',
    'concern.example.alpha-runtime',
    'population.example.pages',
    'snapshot.example.pages.001',
    'lens.example.localization',
    'entity.example.alpha',
    'evidence.example.alpha',
    'reason.example.runtime',
    'predicate.example.runtime',
  ];
}

function candidateWork(overrides = {}) {
  return workItem({
    workRef: 'work.example.alpha-runtime',
    label: 'Restore Alpha localization runtime',
    purpose: 'Make Alpha runtime current from the exact promoted concern.',
    workClass: 'DEFECT',
    state: 'READY',
    sourceRefs: newCandidateSourceRefs(),
    formationProcessRefOrNull: DERIVED_WORK_PROMOTION_PROCESS_REF,
    createdAt: formedAt,
    updatedAt: formedAt,
    ...overrides,
  });
}

function createProposal(overrides = {}) {
  const projection = overrides.projection ?? projectionFixture();
  const graph = overrides.graph ?? graphFixture();
  return createDerivedWorkPromotionProposal({
    projection,
    graph,
    registry,
    proposalRef: 'proposal.example.alpha-runtime',
    concernRef: 'concern.example.alpha-runtime',
    action: 'CREATE_NEW_WORK',
    entityRef: 'entity.example.alpha',
    reasonFacetRef: 'reason.example.runtime',
    predicateRef: 'predicate.example.runtime',
    proposedByActorRef: 'actor.example.operator',
    sourceRefs: ['project.example.operational-console'],
    rationale: 'This exact runtime concern has earned bounded canonical Work.',
    formedAt,
    existingWorkReview: {
      reviewedWorkRefs: [],
      duplicateDisposition: 'NO_EXISTING_WORK_REFERENCES',
      distinctionOrNull: null,
    },
    candidateWorkItemOrNull: candidateWork(),
    selectedExistingWorkRefOrNull: null,
    ...overrides,
    projection,
    graph,
  });
}

function approve(proposal, { projection = projectionFixture(), graph = graphFixture(), ...overrides } = {}) {
  return createDerivedWorkPromotionDecision({
    proposal,
    projection,
    graph,
    registry,
    decisionRef: 'decision.example.alpha-runtime',
    decision: 'APPROVE',
    decidedByActorRef: 'actor.example.authority',
    authorityBasisRefs: ['authority.example.operational-console'],
    sourceRefs: ['source.decision.example'],
    reason: 'Admit the exact bounded concern as canonical Work.',
    decidedAt: '2026-10-22T06:11:00.000Z',
    ...overrides,
  });
}

test('approved promotion creates exactly one canonical Work item with exact provenance and no provider effect', () => {
  const graph = graphFixture();
  const projection = projectionFixture();
  const proposal = createProposal({ graph, projection });
  const decision = approve(proposal, { graph, projection });
  const result = applyDerivedWorkPromotion({ graph, registry, projection, proposal, decision });

  assert.equal(proposal.schemaVersion, DERIVED_WORK_PROMOTION_PROPOSAL_SCHEMA);
  assert.equal(decision.schemaVersion, DERIVED_WORK_PROMOTION_DECISION_SCHEMA);
  assert.equal(result.schemaVersion, DERIVED_WORK_PROMOTION_RESULT_SCHEMA);
  assert.equal(verifySemanticFingerprint(proposal), true);
  assert.equal(verifySemanticFingerprint(decision), true);
  assert.equal(verifySemanticFingerprint(result), true);
  assert.equal(proposal.effects, false);
  assert.equal(proposal.executionAuthority, 'NONE');
  assert.equal(decision.effects, false);
  assert.equal(result.state, 'WORK_CREATED');
  assert.equal(result.workRefOrNull, 'work.example.alpha-runtime');
  assert.equal(result.graph.items.length, graph.items.length + 1);
  assert.equal(result.graph.rootWorkRefs.length, 1);
  assert.equal(result.effects.workgraphMutationRepresented, true);
  assert.equal(result.effects.providerMutationPerformed, false);

  const created = result.graph.items.find((item) => item.workRef === result.workRefOrNull);
  assert.equal(created.parentWorkRefOrNull, 'work.example.outcome');
  assert.equal(created.formationProcessRefOrNull, DERIVED_WORK_PROMOTION_PROCESS_REF);
  for (const required of newCandidateSourceRefs()) assert.equal(created.sourceRefs.includes(required), true, required);
  assert.equal(result.graph.items.filter((item) => item.workRef === created.workRef).length, 1);
});

test('proposal formation never mutates Workgraph and rejects automatic or invalid Work creation', () => {
  const graph = graphFixture();
  const proposal = createProposal({ graph });
  assert.equal(graph.items.some((item) => item.workRef === 'work.example.alpha-runtime'), false);
  assert.equal(proposal.candidateWorkItemOrNull.workRef, 'work.example.alpha-runtime');

  assert.throws(() => createProposal({
    candidateWorkItemOrNull: candidateWork({ sourceRefs: newCandidateSourceRefs().filter((ref) => ref !== 'reason.example.runtime') }),
  }), /missing promotion provenance/);

  assert.throws(() => createProposal({
    candidateWorkItemOrNull: candidateWork({ state: 'RUNNING' }),
  }), /cannot begin in state RUNNING/);

  assert.throws(() => createProposal({
    candidateWorkItemOrNull: candidateWork({ parentWorkRefOrNull: 'work.example.missing-parent' }),
  }), /parent missing/);
});

test('existing Work must be explicitly reviewed before new Work and can be confirmed without mutation', () => {
  const graph = graphFixture();
  const projection = projectionFixture();

  assert.throws(() => createDerivedWorkPromotionProposal({
    projection,
    graph,
    registry,
    proposalRef: 'proposal.example.beta-runtime-new',
    concernRef: 'concern.example.beta-runtime',
    action: 'CREATE_NEW_WORK',
    entityRef: 'entity.example.beta',
    reasonFacetRef: 'reason.example.runtime',
    predicateRef: 'predicate.example.runtime',
    proposedByActorRef: 'actor.example.operator',
    sourceRefs: ['project.example.operational-console'],
    rationale: 'Attempt duplicate creation.',
    formedAt,
    existingWorkReview: {
      reviewedWorkRefs: [],
      duplicateDisposition: 'NO_EXISTING_WORK_REFERENCES',
      distinctionOrNull: null,
    },
    candidateWorkItemOrNull: candidateWork({
      workRef: 'work.example.beta-runtime-new',
      sourceRefs: [
        'proposal.example.beta-runtime-new',
        'concern.example.beta-runtime',
        'population.example.pages',
        'snapshot.example.pages.001',
        'lens.example.localization',
        'entity.example.beta',
        'evidence.example.beta',
        'reason.example.runtime',
        'predicate.example.runtime',
      ],
    }),
    selectedExistingWorkRefOrNull: null,
  }), /exactly cover entity existingWorkRefs/);

  const proposal = createDerivedWorkPromotionProposal({
    projection,
    graph,
    registry,
    proposalRef: 'proposal.example.beta-runtime-existing',
    concernRef: 'concern.example.beta-runtime',
    action: 'CONFIRM_EXISTING_WORK',
    entityRef: 'entity.example.beta',
    reasonFacetRef: 'reason.example.runtime',
    predicateRef: 'predicate.example.runtime',
    proposedByActorRef: 'actor.example.operator',
    sourceRefs: ['project.example.operational-console'],
    rationale: 'The existing canonical Work already represents this exact concern.',
    formedAt,
    existingWorkReview: {
      reviewedWorkRefs: ['work.example.beta-existing'],
      duplicateDisposition: 'EXACT_EXISTING_WORK_SELECTED',
      distinctionOrNull: 'The existing Work owns the same entity, Lens, and runtime concern.',
    },
    candidateWorkItemOrNull: null,
    selectedExistingWorkRefOrNull: 'work.example.beta-existing',
  });
  const decision = approve(proposal, {
    graph,
    projection,
    decisionRef: 'decision.example.beta-runtime-existing',
    reason: 'Confirm rather than duplicate canonical Work.',
  });
  const result = applyDerivedWorkPromotion({ graph, registry, projection, proposal, decision });
  assert.equal(result.state, 'EXISTING_WORK_CONFIRMED');
  assert.equal(result.workRefOrNull, 'work.example.beta-existing');
  assert.equal(result.priorGraphFingerprint, result.nextGraphFingerprint);
  assert.equal(result.graph.semanticFingerprint, graph.semanticFingerprint);
  assert.equal(result.effects.workgraphMutationRepresented, false);
});

test('hold and reject decisions preserve the exact graph, while approval requires authority', () => {
  const graph = graphFixture();
  const projection = projectionFixture();
  const proposal = createProposal({ graph, projection });
  assert.throws(() => approve(proposal, { graph, projection, authorityBasisRefs: [] }), /APPROVE requires authorityBasisRefs/);

  for (const decisionName of ['HOLD', 'REJECT']) {
    const decision = createDerivedWorkPromotionDecision({
      proposal,
      projection,
      graph,
      registry,
      decisionRef: `decision.example.alpha-runtime.${decisionName.toLowerCase()}`,
      decision: decisionName,
      decidedByActorRef: 'actor.example.reviewer',
      authorityBasisRefs: [],
      sourceRefs: ['source.decision.example'],
      reason: decisionName === 'HOLD' ? 'Evidence needs another observation.' : 'The concern does not deserve Work.',
      decidedAt: '2026-10-22T06:11:00.000Z',
    });
    const result = applyDerivedWorkPromotion({ graph, registry, projection, proposal, decision });
    assert.equal(result.state, decisionName === 'HOLD' ? 'HELD' : 'REJECTED');
    assert.equal(result.workRefOrNull, null);
    assert.equal(result.graph.semanticFingerprint, graph.semanticFingerprint);
    assert.equal(result.effects.workgraphMutationRepresented, false);
  }
});

test('promotion is exact-current and rejects stale, tampered, or non-promotable concerns', () => {
  const graph = graphFixture();
  const projection = projectionFixture();
  const proposal = createProposal({ graph, projection });
  const decision = approve(proposal, { graph, projection });

  const staleCore = structuredClone(graph);
  delete staleCore.semanticFingerprint;
  staleCore.sourceRefs = [...staleCore.sourceRefs, 'source.graph.advanced'];
  const staleGraph = createWorkgraph(staleCore, registry);
  assert.throws(() => applyDerivedWorkPromotion({ graph: staleGraph, registry, projection, proposal, decision }), /stale Workgraph observation/);

  const tamperedProposal = { ...proposal, rationale: 'silently changed' };
  assert.throws(() => applyDerivedWorkPromotion({ graph, registry, projection, proposal: tamperedProposal, decision }), /proposal semanticFingerprint mismatch/);

  const tamperedDecision = { ...decision, reason: 'silently changed' };
  assert.throws(() => applyDerivedWorkPromotion({ graph, registry, projection, proposal, decision: tamperedDecision }), /decision semanticFingerprint mismatch/);

  const forgedDecisionCore = { ...decision, authorityBasisRefs: [] };
  delete forgedDecisionCore.semanticFingerprint;
  const forgedDecision = withSemanticFingerprint(forgedDecisionCore);
  assert.throws(() => applyDerivedWorkPromotion({ graph, registry, projection, proposal, decision: forgedDecision }), /APPROVE requires authorityBasisRefs/);

  const forgedCandidateCore = { ...proposal.candidateWorkItemOrNull, state: 'RUNNING' };
  delete forgedCandidateCore.semanticFingerprint;
  const forgedProposalCore = { ...proposal, candidateWorkItemOrNull: withSemanticFingerprint(forgedCandidateCore) };
  delete forgedProposalCore.semanticFingerprint;
  const forgedProposal = withSemanticFingerprint(forgedProposalCore);
  assert.throws(() => createDerivedWorkPromotionDecision({
    proposal: forgedProposal,
    projection,
    graph,
    registry,
    decisionRef: 'decision.example.forged',
    decision: 'APPROVE',
    decidedByActorRef: 'actor.example.authority',
    authorityBasisRefs: ['authority.example.operational-console'],
    sourceRefs: ['source.decision.example'],
    reason: 'Attempt to approve a self-consistent invalid proposal.',
    decidedAt: '2026-10-22T06:11:00.000Z',
  }), /cannot begin in state RUNNING/);

  assert.throws(() => createDerivedWorkPromotionProposal({
    projection,
    graph,
    registry,
    proposalRef: 'proposal.example.gamma-runtime',
    concernRef: 'concern.example.gamma-runtime',
    action: 'CREATE_NEW_WORK',
    entityRef: 'entity.example.gamma',
    reasonFacetRef: 'reason.example.runtime',
    predicateRef: 'predicate.example.runtime',
    proposedByActorRef: 'actor.example.operator',
    sourceRefs: ['project.example.operational-console'],
    rationale: 'Not applicable should not become Work.',
    formedAt,
    existingWorkReview: {
      reviewedWorkRefs: [],
      duplicateDisposition: 'NO_EXISTING_WORK_REFERENCES',
      distinctionOrNull: null,
    },
    candidateWorkItemOrNull: candidateWork({
      workRef: 'work.example.gamma-runtime',
      sourceRefs: [
        'proposal.example.gamma-runtime',
        'concern.example.gamma-runtime',
        'population.example.pages',
        'snapshot.example.pages.001',
        'lens.example.localization',
        'entity.example.gamma',
        'evidence.example.gamma',
        'reason.example.runtime',
        'predicate.example.runtime',
      ],
    }),
    selectedExistingWorkRefOrNull: null,
  }), /NOT_APPLICABLE is not promotable/);
});

test('closed promotion schemas remain source-addressable', () => {
  assert.equal(DERIVED_WORK_PROMOTION_PROPOSAL_SCHEMA, 'vexwork.derived-work-promotion-proposal/v1');
  assert.equal(DERIVED_WORK_PROMOTION_DECISION_SCHEMA, 'vexwork.derived-work-promotion-decision/v1');
  assert.equal(DERIVED_WORK_PROMOTION_RESULT_SCHEMA, 'vexwork.derived-work-promotion-result/v1');
  assert.equal(DERIVED_WORK_PROMOTION_PROCESS_REF, 'process.vexwork.promote-derived-concern');
});

// [VXG RealForever]
