import { verifySemanticFingerprint, withSemanticFingerprint } from './semantic.mjs';
import { projectWorkRefs, requestTransition } from './workgraph.mjs';

export const PROJECT_AGENCY_POLICY_SCHEMA = 'vexwork.project-agency-policy/v1';
export const TRANSITION_PROPOSAL_SCHEMA = 'vexwork.transition-proposal/v1';
export const HUMAN_TRANSITION_RESPONSE_SCHEMA = 'vexwork.human-transition-response/v1';
export const AI_TRANSITION_CONFIRMATION_SCHEMA = 'vexwork.ai-transition-confirmation/v1';
export const PROJECT_TRANSITION_RESULT_SCHEMA = 'vexwork.project-transition-result/v1';

export const PROJECT_AGENCY_MODE = 'DELEGATED_WITH_TRANSITION_HANDSHAKE';
export const HUMAN_TRANSITION_DECISIONS = Object.freeze(['ACK_APPROVED', 'ACK_FEEDBACK', 'ACK_HOLD']);

const REF = /^[A-Za-z0-9][A-Za-z0-9._:/-]*$/u;
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/u;

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function stableRef(value, label) {
  assert(typeof value === 'string' && REF.test(value), `${label} must be one stable ref`);
  return value;
}

function refs(values, label) {
  assert(Array.isArray(values), `${label} must be an array`);
  const result = values.map((value, index) => stableRef(value, `${label}[${index}]`));
  assert(new Set(result).size === result.length, `${label} must be unique`);
  return result;
}

function text(value, label) {
  assert(typeof value === 'string' && value.trim(), `${label} required`);
  return value;
}

function textArray(values, label) {
  assert(Array.isArray(values), `${label} must be an array`);
  return values.map((value, index) => text(value, `${label}[${index}]`));
}

function timestamp(value, label) {
  assert(typeof value === 'string' && ISO.test(value) && new Date(value).toISOString() === value, `${label} must be canonical UTC ISO`);
  return value;
}

function laneForState(registry, state) {
  const lanes = registry.boardLanes.filter((lane) => lane.lifecycleStates.includes(state));
  assert(lanes.length === 1, `state ${state} must map to exactly one Board lane`);
  return lanes[0].laneRef;
}

function knownLaneRefs(registry) {
  return new Set(registry.boardLanes.map((lane) => lane.laneRef));
}

export function createProjectAgencyPolicy(input, registry) {
  if (input?.semanticFingerprint !== undefined) {
    assert(verifySemanticFingerprint(input), 'Project Agency Policy semanticFingerprint mismatch');
  }
  assert(input?.schemaVersion === PROJECT_AGENCY_POLICY_SCHEMA, 'Project Agency Policy schema mismatch');
  stableRef(input.policyRef, 'policyRef');
  stableRef(input.projectRef, 'projectRef');
  assert(input.mode === PROJECT_AGENCY_MODE, 'unsupported Project Agency Policy mode');
  assert(input.routineTransitionAutonomy === 'WITHIN_CURRENT_PHASE', 'unsupported routineTransitionAutonomy');

  const knownLanes = knownLaneRefs(registry);
  assert(Array.isArray(input.handshakeLaneTransitions) && input.handshakeLaneTransitions.length > 0, 'handshakeLaneTransitions required');
  const pairs = new Set();
  for (const boundary of input.handshakeLaneTransitions) {
    stableRef(boundary.boundaryRef, 'boundaryRef');
    assert(knownLanes.has(boundary.fromLaneRef), `unknown fromLaneRef ${boundary.fromLaneRef}`);
    assert(knownLanes.has(boundary.toLaneRef), `unknown toLaneRef ${boundary.toLaneRef}`);
    assert(boundary.fromLaneRef !== boundary.toLaneRef, 'handshake boundary must cross Board lanes');
    const key = `${boundary.fromLaneRef}->${boundary.toLaneRef}`;
    assert(!pairs.has(key), `duplicate handshake lane transition ${key}`);
    pairs.add(key);
  }

  const discovered = input.discoveredWorkDefault;
  assert(discovered && typeof discovered === 'object' && !Array.isArray(discovered), 'discoveredWorkDefault required');
  assert(registry.workClasses.includes(discovered.workClass), 'discovered workClass unsupported');
  assert(registry.workDispositions.includes(discovered.workDisposition), 'discovered workDisposition unsupported');
  assert(registry.authorityDispositions.includes(discovered.authorityDisposition), 'discovered authorityDisposition unsupported');
  assert(registry.effectDispositions.includes(discovered.effectDisposition), 'discovered effectDisposition unsupported');

  refs(input.sourceRefs, 'sourceRefs');
  timestamp(input.formedAt, 'formedAt');
  return withSemanticFingerprint(input);
}

export function transitionHandshakeRequirement({ policy, priorState, nextState, registry }) {
  policy = createProjectAgencyPolicy(policy, registry);
  const fromLaneRef = laneForState(registry, priorState);
  const toLaneRef = laneForState(registry, nextState);
  const boundary = policy.handshakeLaneTransitions.find(
    (candidate) => candidate.fromLaneRef === fromLaneRef && candidate.toLaneRef === toLaneRef,
  ) ?? null;
  return Object.freeze({
    required: boundary !== null,
    boundaryRefOrNull: boundary?.boundaryRef ?? null,
    fromLaneRef,
    toLaneRef,
  });
}

export function createTransitionProposal({
  project,
  graph,
  policy,
  registry,
  proposalRef,
  workRef,
  nextState,
  whatBecameTrue,
  nextIntent,
  attention,
  heldBoundaries,
  authorityBasisRefs,
  proposedByActorRef,
  formedAt,
}) {
  assert(verifySemanticFingerprint(project), 'project semanticFingerprint mismatch');
  assert(verifySemanticFingerprint(graph), 'Workgraph semanticFingerprint mismatch');
  policy = createProjectAgencyPolicy(policy, registry);
  assert(policy.projectRef === project.projectRef, 'Project Agency Policy project mismatch');
  assert(projectWorkRefs(project, graph).includes(workRef), 'transition proposal work is outside Project');

  const item = graph.items.find((candidate) => candidate.workRef === workRef);
  assert(item, `unknown workRef ${workRef}`);
  assert((registry.allowedTransitions[item.state] ?? []).includes(nextState), `transition ${item.state} -> ${nextState} not allowed`);

  const requirement = transitionHandshakeRequirement({ policy, priorState: item.state, nextState, registry });
  assert(requirement.required, 'transition does not require a human handshake');

  stableRef(proposalRef, 'proposalRef');
  text(whatBecameTrue, 'whatBecameTrue');
  text(nextIntent, 'nextIntent');
  textArray(attention, 'attention');
  textArray(heldBoundaries, 'heldBoundaries');
  refs(authorityBasisRefs, 'authorityBasisRefs');
  stableRef(proposedByActorRef, 'proposedByActorRef');
  timestamp(formedAt, 'formedAt');

  return withSemanticFingerprint({
    schemaVersion: TRANSITION_PROPOSAL_SCHEMA,
    proposalRef,
    projectRef: project.projectRef,
    workRef,
    observedGraphFingerprint: graph.semanticFingerprint,
    observedState: item.state,
    proposedState: nextState,
    fromLaneRef: requirement.fromLaneRef,
    toLaneRef: requirement.toLaneRef,
    boundaryRef: requirement.boundaryRefOrNull,
    whatBecameTrue,
    nextIntent,
    attention,
    heldBoundaries,
    authorityBasisRefs,
    proposedByActorRef,
    formedAt,
  });
}

export function createHumanTransitionResponse({
  proposal,
  responseRef,
  humanActorRef,
  decision,
  feedbackOrNull = null,
  respondedAt,
}) {
  assert(verifySemanticFingerprint(proposal), 'transition proposal semanticFingerprint mismatch');
  assert(proposal.schemaVersion === TRANSITION_PROPOSAL_SCHEMA, 'transition proposal schema mismatch');
  stableRef(responseRef, 'responseRef');
  stableRef(humanActorRef, 'humanActorRef');
  assert(HUMAN_TRANSITION_DECISIONS.includes(decision), 'unsupported human transition decision');
  if (decision === 'ACK_FEEDBACK') text(feedbackOrNull, 'feedbackOrNull');
  else assert(feedbackOrNull === null || (typeof feedbackOrNull === 'string' && feedbackOrNull.trim()), 'feedbackOrNull invalid');
  timestamp(respondedAt, 'respondedAt');

  return withSemanticFingerprint({
    schemaVersion: HUMAN_TRANSITION_RESPONSE_SCHEMA,
    responseRef,
    proposalRef: proposal.proposalRef,
    proposalSemanticFingerprint: proposal.semanticFingerprint,
    humanActorRef,
    decision,
    feedbackOrNull,
    respondedAt,
  });
}

export function createAiTransitionConfirmation({
  proposal,
  response,
  confirmationRef,
  actorRef,
  confirmedInterpretation,
  confirmedEnvelope,
  nextAction,
  confirmedAt,
}) {
  assert(verifySemanticFingerprint(proposal), 'transition proposal semanticFingerprint mismatch');
  assert(verifySemanticFingerprint(response), 'human transition response semanticFingerprint mismatch');
  assert(response.proposalRef === proposal.proposalRef, 'human response proposalRef mismatch');
  assert(response.proposalSemanticFingerprint === proposal.semanticFingerprint, 'human response proposal fingerprint mismatch');
  stableRef(confirmationRef, 'confirmationRef');
  stableRef(actorRef, 'actorRef');
  text(confirmedInterpretation, 'confirmedInterpretation');
  text(confirmedEnvelope, 'confirmedEnvelope');
  assert(['COMMIT_TRANSITION', 'HOLD'].includes(nextAction), 'unsupported confirmation nextAction');
  if (response.decision === 'ACK_APPROVED') {
    assert(nextAction === 'COMMIT_TRANSITION', 'approved response must confirm COMMIT_TRANSITION');
  } else {
    assert(nextAction === 'HOLD', 'feedback/hold response must confirm HOLD');
  }
  timestamp(confirmedAt, 'confirmedAt');

  return withSemanticFingerprint({
    schemaVersion: AI_TRANSITION_CONFIRMATION_SCHEMA,
    confirmationRef,
    proposalRef: proposal.proposalRef,
    proposalSemanticFingerprint: proposal.semanticFingerprint,
    responseRef: response.responseRef,
    responseSemanticFingerprint: response.semanticFingerprint,
    actorRef,
    confirmedInterpretation,
    confirmedEnvelope,
    nextAction,
    confirmedAt,
  });
}

export function requestProjectTransition({
  project,
  graph,
  policy,
  transitionRequest,
  registry,
  handshakeOrNull = null,
}) {
  assert(verifySemanticFingerprint(project), 'project semanticFingerprint mismatch');
  assert(verifySemanticFingerprint(graph), 'Workgraph semanticFingerprint mismatch');
  policy = createProjectAgencyPolicy(policy, registry);
  assert(policy.projectRef === project.projectRef, 'Project Agency Policy project mismatch');
  assert(projectWorkRefs(project, graph).includes(transitionRequest.workRef), 'transition work is outside Project');

  const item = graph.items.find((candidate) => candidate.workRef === transitionRequest.workRef);
  assert(item, `unknown workRef ${transitionRequest.workRef}`);
  assert(item.authorityDisposition === 'AUTHORIZED_BOUNDED', 'Project agency cannot advance work without bounded authority');

  const requirement = transitionHandshakeRequirement({
    policy,
    priorState: item.state,
    nextState: transitionRequest.nextState,
    registry,
  });

  if (!requirement.required) {
    const accepted = requestTransition(graph, transitionRequest, registry);
    return Object.freeze({
      ...accepted,
      schemaVersion: PROJECT_TRANSITION_RESULT_SCHEMA,
      handshake: Object.freeze({ required: false, boundaryRefOrNull: null }),
    });
  }

  assert(item.effectDisposition === 'EFFECTS_BOUND', 'phase promotion requires bounded effects');
  assert(handshakeOrNull && typeof handshakeOrNull === 'object', 'transition handshake required');
  const { proposal, response, confirmation } = handshakeOrNull;
  assert(verifySemanticFingerprint(proposal), 'transition proposal semanticFingerprint mismatch');
  assert(verifySemanticFingerprint(response), 'human transition response semanticFingerprint mismatch');
  assert(verifySemanticFingerprint(confirmation), 'AI transition confirmation semanticFingerprint mismatch');

  assert(proposal.projectRef === project.projectRef, 'transition proposal project mismatch');
  assert(proposal.workRef === item.workRef, 'transition proposal work mismatch');
  assert(proposal.observedGraphFingerprint === graph.semanticFingerprint, 'transition proposal is stale');
  assert(proposal.observedState === item.state, 'transition proposal WorkState is stale');
  assert(proposal.proposedState === transitionRequest.nextState, 'transition proposal next state mismatch');
  assert(proposal.fromLaneRef === requirement.fromLaneRef && proposal.toLaneRef === requirement.toLaneRef, 'transition proposal lane boundary mismatch');
  assert(proposal.boundaryRef === requirement.boundaryRefOrNull, 'transition proposal boundary mismatch');

  assert(response.proposalRef === proposal.proposalRef, 'human response proposalRef mismatch');
  assert(response.proposalSemanticFingerprint === proposal.semanticFingerprint, 'human response proposal fingerprint mismatch');
  assert(confirmation.proposalRef === proposal.proposalRef, 'confirmation proposalRef mismatch');
  assert(confirmation.proposalSemanticFingerprint === proposal.semanticFingerprint, 'confirmation proposal fingerprint mismatch');
  assert(confirmation.responseRef === response.responseRef, 'confirmation responseRef mismatch');
  assert(confirmation.responseSemanticFingerprint === response.semanticFingerprint, 'confirmation response fingerprint mismatch');

  if (response.decision !== 'ACK_APPROVED') {
    assert(confirmation.nextAction === 'HOLD', 'non-approved handshake must hold');
    return Object.freeze({
      schemaVersion: PROJECT_TRANSITION_RESULT_SCHEMA,
      state: 'HELD',
      changed: false,
      priorGraphFingerprint: graph.semanticFingerprint,
      nextGraphFingerprint: graph.semanticFingerprint,
      graph,
      handshake: Object.freeze({
        required: true,
        boundaryRefOrNull: requirement.boundaryRefOrNull,
        decision: response.decision,
        proposalRef: proposal.proposalRef,
        responseRef: response.responseRef,
        confirmationRef: confirmation.confirmationRef,
      }),
      effects: Object.freeze({ workgraphMutationRepresented: false, providerMutationPerformed: false }),
    });
  }

  assert(confirmation.nextAction === 'COMMIT_TRANSITION', 'approved handshake must confirm COMMIT_TRANSITION');
  const sourceRefs = [...new Set([
    ...transitionRequest.sourceRefs,
    proposal.proposalRef,
    response.responseRef,
    confirmation.confirmationRef,
  ])];
  const accepted = requestTransition(graph, { ...transitionRequest, sourceRefs }, registry);

  return Object.freeze({
    ...accepted,
    schemaVersion: PROJECT_TRANSITION_RESULT_SCHEMA,
    handshake: Object.freeze({
      required: true,
      boundaryRefOrNull: requirement.boundaryRefOrNull,
      decision: response.decision,
      proposalRef: proposal.proposalRef,
      responseRef: response.responseRef,
      confirmationRef: confirmation.confirmationRef,
    }),
  });
}
