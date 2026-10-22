import { DERIVED_ATTENTION_PROJECTION_SCHEMA } from './derived-attention-projection.mjs';
import { createWorkItem, createWorkgraph } from './workgraph.mjs';
import { verifySemanticFingerprint, withSemanticFingerprint } from './semantic.mjs';

export const DERIVED_WORK_PROMOTION_PROPOSAL_SCHEMA = 'vexwork.derived-work-promotion-proposal/v1';
export const DERIVED_WORK_PROMOTION_DECISION_SCHEMA = 'vexwork.derived-work-promotion-decision/v1';
export const DERIVED_WORK_PROMOTION_RESULT_SCHEMA = 'vexwork.derived-work-promotion-result/v1';
export const DERIVED_WORK_PROMOTION_PROCESS_REF = 'process.vexwork.promote-derived-concern';

export const PROMOTION_ACTIONS = Object.freeze(['CREATE_NEW_WORK', 'CONFIRM_EXISTING_WORK']);
export const PROMOTION_DECISIONS = Object.freeze(['APPROVE', 'HOLD', 'REJECT']);
export const PROMOTION_INITIAL_STATES = Object.freeze([
  'CAPTURED',
  'NEEDS_CLARIFICATION',
  'DECOMPOSED',
  'PLAN_VALIDATED',
  'WAITING_DEPENDENCIES',
  'READY',
]);
export const PROMOTION_WORK_CLASSES = Object.freeze(['POTENTIAL', 'TASK', 'DEFECT']);

const PROMOTABLE_EVIDENCE_STATES = new Set(['UNSATISFIED', 'UNKNOWN']);
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

function sameRefs(left, right) {
  return JSON.stringify([...left].sort()) === JSON.stringify([...right].sort());
}

function acceptCurrentGraph(graph, registry) {
  assert(verifySemanticFingerprint(graph), 'current Workgraph semanticFingerprint mismatch');
  const current = createWorkgraph(graph, registry);
  assert(current.semanticFingerprint === graph.semanticFingerprint, 'validated Workgraph semanticFingerprint mismatch');
  return current;
}

function acceptProjection(projection) {
  assert(projection?.schemaVersion === DERIVED_ATTENTION_PROJECTION_SCHEMA, 'derived attention projection schema mismatch');
  assert(verifySemanticFingerprint(projection), 'derived attention projection semanticFingerprint mismatch');
  assert(projection.effects === false, 'derived attention projection must be read-only');
  assert(projection.executionAuthority === 'NONE', 'derived attention projection must carry no execution authority');
  return projection;
}

function acceptProposal(proposal) {
  assert(proposal?.schemaVersion === DERIVED_WORK_PROMOTION_PROPOSAL_SCHEMA, 'promotion proposal schema mismatch');
  assert(verifySemanticFingerprint(proposal), 'promotion proposal semanticFingerprint mismatch');
  return proposal;
}

function acceptDecision(decision) {
  assert(decision?.schemaVersion === DERIVED_WORK_PROMOTION_DECISION_SCHEMA, 'promotion decision schema mismatch');
  assert(verifySemanticFingerprint(decision), 'promotion decision semanticFingerprint mismatch');
  return decision;
}

function provisionalGraphWithCandidate(currentGraph, candidate, registry) {
  const roots = candidate.parentWorkRefOrNull === null
    ? [...currentGraph.rootWorkRefs, candidate.workRef]
    : [...currentGraph.rootWorkRefs];
  const core = {
    ...currentGraph,
    rootWorkRefs: roots,
    items: [...currentGraph.items, candidate],
  };
  delete core.semanticFingerprint;
  return createWorkgraph(core, registry);
}

function requiredCandidateSourceRefs({ proposalRef, concernRef, projection, entity, facet }) {
  return [
    proposalRef,
    concernRef,
    projection.populationRef,
    projection.snapshotRef,
    projection.lensRef,
    entity.entityRef,
    entity.evidenceRef,
    facet.reasonFacetRef,
    facet.predicateRef,
  ].sort((left, right) => left.localeCompare(right));
}

function normalizeExistingWorkReview(input, entity, currentGraph, action) {
  assert(input && typeof input === 'object', 'existingWorkReview required');
  const reviewedWorkRefs = refs(input.reviewedWorkRefs, 'existingWorkReview.reviewedWorkRefs');
  assert(sameRefs(reviewedWorkRefs, entity.existingWorkRefs), 'reviewedWorkRefs must exactly cover entity existingWorkRefs');
  const knownWorkRefs = new Set(currentGraph.items.map((item) => item.workRef));
  for (const workRef of reviewedWorkRefs) assert(knownWorkRefs.has(workRef), `reviewed existing Work missing from current Workgraph: ${workRef}`);

  const duplicateDisposition = text(input.duplicateDisposition, 'existingWorkReview.duplicateDisposition');
  const distinctionOrNull = input.distinctionOrNull === null
    ? null
    : text(input.distinctionOrNull, 'existingWorkReview.distinctionOrNull');

  if (action === 'CREATE_NEW_WORK') {
    const expected = reviewedWorkRefs.length === 0
      ? 'NO_EXISTING_WORK_REFERENCES'
      : 'EXISTING_WORK_REVIEWED_NOT_SAME_CONCERN';
    assert(duplicateDisposition === expected, `CREATE_NEW_WORK requires duplicateDisposition=${expected}`);
    if (reviewedWorkRefs.length > 0) assert(distinctionOrNull !== null, 'existing Work distinction required before creating new Work');
  } else {
    assert(duplicateDisposition === 'EXACT_EXISTING_WORK_SELECTED', 'CONFIRM_EXISTING_WORK requires exact existing Work selection');
    assert(distinctionOrNull !== null, 'existing Work confirmation reason required');
  }

  return Object.freeze({ reviewedWorkRefs, duplicateDisposition, distinctionOrNull });
}

export function createDerivedWorkPromotionProposal({
  projection,
  graph,
  registry,
  proposalRef,
  concernRef,
  action,
  entityRef,
  reasonFacetRef,
  predicateRef,
  proposedByActorRef,
  sourceRefs,
  rationale,
  formedAt,
  existingWorkReview,
  candidateWorkItemOrNull = null,
  selectedExistingWorkRefOrNull = null,
}) {
  projection = acceptProjection(projection);
  const currentGraph = acceptCurrentGraph(graph, registry);
  stableRef(proposalRef, 'proposalRef');
  stableRef(concernRef, 'concernRef');
  assert(PROMOTION_ACTIONS.includes(action), `unsupported promotion action ${action}`);
  stableRef(entityRef, 'entityRef');
  stableRef(reasonFacetRef, 'reasonFacetRef');
  stableRef(predicateRef, 'predicateRef');
  stableRef(proposedByActorRef, 'proposedByActorRef');
  const proposalSourceRefs = refs(sourceRefs, 'sourceRefs', { allowEmpty: false });
  text(rationale, 'rationale');
  timestamp(formedAt, 'formedAt');

  const entity = projection.entities.find((candidate) => candidate.entityRef === entityRef);
  assert(entity, `promotion entity missing from projection: ${entityRef}`);
  const facet = entity.reasonFacets.find((candidate) =>
    candidate.reasonFacetRef === reasonFacetRef && candidate.predicateRef === predicateRef);
  assert(facet, `promotion reason facet missing from entity: ${reasonFacetRef}/${predicateRef}`);
  assert(PROMOTABLE_EVIDENCE_STATES.has(facet.evidenceState), `evidence state ${facet.evidenceState} is not promotable`);

  const review = normalizeExistingWorkReview(existingWorkReview, entity, currentGraph, action);
  const selectedExistingWorkRef = optionalRef(selectedExistingWorkRefOrNull, 'selectedExistingWorkRefOrNull');
  let candidateWorkItem = null;

  if (action === 'CREATE_NEW_WORK') {
    assert(selectedExistingWorkRef === null, 'CREATE_NEW_WORK cannot select an existing Work ref');
    assert(candidateWorkItemOrNull && typeof candidateWorkItemOrNull === 'object', 'candidateWorkItemOrNull required for CREATE_NEW_WORK');
    candidateWorkItem = createWorkItem(candidateWorkItemOrNull, registry);
    assert(!currentGraph.items.some((item) => item.workRef === candidateWorkItem.workRef), `candidate workRef already exists ${candidateWorkItem.workRef}`);
    assert(PROMOTION_WORK_CLASSES.includes(candidateWorkItem.workClass), `derived concern cannot promote to workClass ${candidateWorkItem.workClass}`);
    assert(PROMOTION_INITIAL_STATES.includes(candidateWorkItem.state), `derived concern cannot begin in state ${candidateWorkItem.state}`);
    assert(candidateWorkItem.formationProcessRefOrNull === DERIVED_WORK_PROMOTION_PROCESS_REF, 'candidate Work formationProcessRefOrNull mismatch');
    assert(candidateWorkItem.createdAt === formedAt && candidateWorkItem.updatedAt === formedAt, 'candidate Work timestamps must equal proposal formedAt');

    const requiredRefs = requiredCandidateSourceRefs({ proposalRef, concernRef, projection, entity, facet });
    const candidateSources = new Set(candidateWorkItem.sourceRefs);
    for (const sourceRef of requiredRefs) assert(candidateSources.has(sourceRef), `candidate Work sourceRefs missing promotion provenance: ${sourceRef}`);
    provisionalGraphWithCandidate(currentGraph, candidateWorkItem, registry);
  } else {
    assert(candidateWorkItemOrNull === null, 'CONFIRM_EXISTING_WORK cannot carry a candidate Work item');
    assert(selectedExistingWorkRef !== null, 'CONFIRM_EXISTING_WORK requires selectedExistingWorkRefOrNull');
    assert(entity.existingWorkRefs.includes(selectedExistingWorkRef), 'selected existing Work is not referenced by the derived entity');
    assert(currentGraph.items.some((item) => item.workRef === selectedExistingWorkRef), 'selected existing Work missing from current Workgraph');
  }

  return withSemanticFingerprint({
    schemaVersion: DERIVED_WORK_PROMOTION_PROPOSAL_SCHEMA,
    proposalRef,
    concernRef,
    action,
    expectedGraphFingerprint: currentGraph.semanticFingerprint,
    projectionSemanticFingerprint: projection.semanticFingerprint,
    populationRef: projection.populationRef,
    populationSemanticFingerprint: projection.populationSemanticFingerprint,
    snapshotRef: projection.snapshotRef,
    lensRef: projection.lensRef,
    lensSemanticFingerprint: projection.lensSemanticFingerprint,
    entityRef: entity.entityRef,
    entitySourceRefs: entity.sourceRefs,
    evidenceRef: entity.evidenceRef,
    evidenceSemanticFingerprint: entity.evidenceSemanticFingerprint,
    evidenceObservedAt: entity.evidenceObservedAt,
    derivedAttentionSemanticFingerprint: entity.derivedAttentionSemanticFingerprint,
    reasonFacet: Object.freeze({
      reasonFacetRef: facet.reasonFacetRef,
      predicateRef: facet.predicateRef,
      requirement: facet.requirement,
      evidenceState: facet.evidenceState,
      evidenceRefs: facet.evidenceRefs,
    }),
    existingWorkRefs: entity.existingWorkRefs,
    existingWorkReview: review,
    candidateWorkItemOrNull: candidateWorkItem,
    selectedExistingWorkRefOrNull: selectedExistingWorkRef,
    proposedByActorRef,
    sourceRefs: proposalSourceRefs,
    rationale,
    formedAt,
    effects: false,
    executionAuthority: 'NONE',
  });
}

function revalidateProposal({ proposal, projection, graph, registry }) {
  proposal = acceptProposal(proposal);
  const rebuilt = createDerivedWorkPromotionProposal({
    projection,
    graph,
    registry,
    proposalRef: proposal.proposalRef,
    concernRef: proposal.concernRef,
    action: proposal.action,
    entityRef: proposal.entityRef,
    reasonFacetRef: proposal.reasonFacet.reasonFacetRef,
    predicateRef: proposal.reasonFacet.predicateRef,
    proposedByActorRef: proposal.proposedByActorRef,
    sourceRefs: proposal.sourceRefs,
    rationale: proposal.rationale,
    formedAt: proposal.formedAt,
    existingWorkReview: proposal.existingWorkReview,
    candidateWorkItemOrNull: proposal.candidateWorkItemOrNull,
    selectedExistingWorkRefOrNull: proposal.selectedExistingWorkRefOrNull,
  });
  assert(rebuilt.semanticFingerprint === proposal.semanticFingerprint, 'promotion proposal semantic validation mismatch');
  return rebuilt;
}

export function createDerivedWorkPromotionDecision({
  proposal,
  projection,
  graph,
  registry,
  decisionRef,
  decision,
  decidedByActorRef,
  authorityBasisRefs,
  sourceRefs,
  reason,
  decidedAt,
}) {
  proposal = revalidateProposal({ proposal, projection, graph, registry });
  stableRef(decisionRef, 'decisionRef');
  assert(PROMOTION_DECISIONS.includes(decision), `unsupported promotion decision ${decision}`);
  stableRef(decidedByActorRef, 'decidedByActorRef');
  const authorityRefs = refs(authorityBasisRefs, 'authorityBasisRefs');
  const decisionSourceRefs = refs(sourceRefs, 'sourceRefs', { allowEmpty: false });
  text(reason, 'reason');
  timestamp(decidedAt, 'decidedAt');
  if (decision === 'APPROVE') assert(authorityRefs.length > 0, 'APPROVE requires authorityBasisRefs');

  return withSemanticFingerprint({
    schemaVersion: DERIVED_WORK_PROMOTION_DECISION_SCHEMA,
    decisionRef,
    proposalRef: proposal.proposalRef,
    proposalSemanticFingerprint: proposal.semanticFingerprint,
    concernRef: proposal.concernRef,
    action: proposal.action,
    decision,
    decidedByActorRef,
    authorityBasisRefs: authorityRefs,
    sourceRefs: decisionSourceRefs,
    reason,
    decidedAt,
    effects: false,
    executionAuthority: 'NONE',
  });
}

function revalidateDecision({ decision, proposal, projection, graph, registry }) {
  decision = acceptDecision(decision);
  const rebuilt = createDerivedWorkPromotionDecision({
    proposal,
    projection,
    graph,
    registry,
    decisionRef: decision.decisionRef,
    decision: decision.decision,
    decidedByActorRef: decision.decidedByActorRef,
    authorityBasisRefs: decision.authorityBasisRefs,
    sourceRefs: decision.sourceRefs,
    reason: decision.reason,
    decidedAt: decision.decidedAt,
  });
  assert(rebuilt.semanticFingerprint === decision.semanticFingerprint, 'promotion decision semantic validation mismatch');
  return rebuilt;
}

export function applyDerivedWorkPromotion({ graph, registry, projection, proposal, decision }) {
  const currentGraph = acceptCurrentGraph(graph, registry);
  proposal = acceptProposal(proposal);
  assert(proposal.expectedGraphFingerprint === currentGraph.semanticFingerprint, 'stale Workgraph observation for promotion');
  proposal = revalidateProposal({ proposal, projection, graph: currentGraph, registry });
  decision = revalidateDecision({ decision, proposal, projection, graph: currentGraph, registry });
  assert(decision.proposalRef === proposal.proposalRef, 'promotion decision proposalRef mismatch');
  assert(decision.proposalSemanticFingerprint === proposal.semanticFingerprint, 'promotion decision proposal fingerprint mismatch');
  assert(decision.concernRef === proposal.concernRef, 'promotion decision concernRef mismatch');
  assert(decision.action === proposal.action, 'promotion decision action mismatch');

  if (decision.decision !== 'APPROVE') {
    return withSemanticFingerprint({
      schemaVersion: DERIVED_WORK_PROMOTION_RESULT_SCHEMA,
      state: decision.decision === 'HOLD' ? 'HELD' : 'REJECTED',
      action: proposal.action,
      concernRef: proposal.concernRef,
      proposalRef: proposal.proposalRef,
      proposalSemanticFingerprint: proposal.semanticFingerprint,
      decisionRef: decision.decisionRef,
      decisionSemanticFingerprint: decision.semanticFingerprint,
      priorGraphFingerprint: currentGraph.semanticFingerprint,
      nextGraphFingerprint: currentGraph.semanticFingerprint,
      workRefOrNull: null,
      graph: currentGraph,
      effects: Object.freeze({ workgraphMutationRepresented: false, providerMutationPerformed: false }),
    });
  }

  if (proposal.action === 'CONFIRM_EXISTING_WORK') {
    const existing = currentGraph.items.find((item) => item.workRef === proposal.selectedExistingWorkRefOrNull);
    assert(existing, 'selected existing Work missing from current Workgraph');
    return withSemanticFingerprint({
      schemaVersion: DERIVED_WORK_PROMOTION_RESULT_SCHEMA,
      state: 'EXISTING_WORK_CONFIRMED',
      action: proposal.action,
      concernRef: proposal.concernRef,
      proposalRef: proposal.proposalRef,
      proposalSemanticFingerprint: proposal.semanticFingerprint,
      decisionRef: decision.decisionRef,
      decisionSemanticFingerprint: decision.semanticFingerprint,
      priorGraphFingerprint: currentGraph.semanticFingerprint,
      nextGraphFingerprint: currentGraph.semanticFingerprint,
      workRefOrNull: existing.workRef,
      graph: currentGraph,
      effects: Object.freeze({ workgraphMutationRepresented: false, providerMutationPerformed: false }),
    });
  }

  const candidate = createWorkItem(proposal.candidateWorkItemOrNull, registry);
  assert(!currentGraph.items.some((item) => item.workRef === candidate.workRef), `candidate workRef already exists ${candidate.workRef}`);
  const nextGraph = provisionalGraphWithCandidate(currentGraph, candidate, registry);
  return withSemanticFingerprint({
    schemaVersion: DERIVED_WORK_PROMOTION_RESULT_SCHEMA,
    state: 'WORK_CREATED',
    action: proposal.action,
    concernRef: proposal.concernRef,
    proposalRef: proposal.proposalRef,
    proposalSemanticFingerprint: proposal.semanticFingerprint,
    decisionRef: decision.decisionRef,
    decisionSemanticFingerprint: decision.semanticFingerprint,
    priorGraphFingerprint: currentGraph.semanticFingerprint,
    nextGraphFingerprint: nextGraph.semanticFingerprint,
    workRefOrNull: candidate.workRef,
    graph: nextGraph,
    effects: Object.freeze({ workgraphMutationRepresented: true, providerMutationPerformed: false }),
  });
}

// [VXG RealForever]
