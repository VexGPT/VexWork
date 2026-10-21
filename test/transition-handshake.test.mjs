import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  createAiTransitionConfirmation,
  createHumanTransitionResponse,
  createProjectAgencyPolicy,
  createTransitionProposal,
  requestProjectTransition,
  transitionHandshakeRequirement,
} from '../src/core/transition-handshake.mjs';
import { withSemanticFingerprint } from '../src/core/semantic.mjs';
import { createProject, createWorkgraph, requestTransition } from '../src/core/workgraph.mjs';

const registry = JSON.parse(fs.readFileSync(new URL('../blueprint/work-registry.json', import.meta.url), 'utf8'));

function project() {
  return createProject({
    schemaVersion: 'vexwork.project-definition/v1',
    projectRef: 'project.test.agency',
    label: 'Agency test',
    purpose: 'Prove delegated routine agency and exact human transition handshake semantics.',
    rootWorkRefs: ['work.test.agency'],
    repositoryRefs: [],
    sourceRefs: ['test.transition-handshake'],
    formedAt: '2026-10-21T08:00:00.000Z',
  });
}

function graph(state = 'READY', authorityDisposition = 'AUTHORIZED_BOUNDED', effectDisposition = 'EFFECTS_BOUND') {
  return createWorkgraph({
    schemaVersion: 'vexwork.workgraph/v1',
    graphRef: 'workgraph.test.agency',
    rootWorkRefs: ['work.test.agency'],
    items: [{
      schemaVersion: 'vexwork.work-item/v1',
      workRef: 'work.test.agency',
      parentWorkRefOrNull: null,
      label: 'Agency test work',
      purpose: 'Advance only through the delegated Project handshake contract.',
      workClass: 'TASK',
      state,
      workDisposition: 'ACTIVE',
      priorityClass: 'NORMAL',
      dependencyRefs: [],
      repositoryRefs: [],
      sourceRefs: ['test.transition-handshake'],
      formationProcessRefOrNull: null,
      nextProcessRefs: [],
      authorityDisposition,
      effectDisposition,
      createdAt: '2026-10-21T08:00:00.000Z',
      updatedAt: '2026-10-21T08:00:00.000Z',
    }],
    transitions: [],
    sourceRefs: ['test.transition-handshake'],
    formedAt: '2026-10-21T08:00:00.000Z',
  }, registry);
}

function policy() {
  return createProjectAgencyPolicy({
    schemaVersion: 'vexwork.project-agency-policy/v1',
    policyRef: 'agency.test.delegated-handshake',
    projectRef: 'project.test.agency',
    mode: 'DELEGATED_WITH_TRANSITION_HANDSHAKE',
    routineTransitionAutonomy: 'WITHIN_CURRENT_PHASE',
    handshakeLaneTransitions: [
      { boundaryRef: 'boundary.test.ready-active', fromLaneRef: 'lane.work.ready', toLaneRef: 'lane.work.active' },
      { boundaryRef: 'boundary.test.active-verify', fromLaneRef: 'lane.work.active', toLaneRef: 'lane.work.verify' },
      { boundaryRef: 'boundary.test.verify-done', fromLaneRef: 'lane.work.verify', toLaneRef: 'lane.work.done' },
    ],
    discoveredWorkDefault: {
      workClass: 'POTENTIAL',
      workDisposition: 'PARKED',
      authorityDisposition: 'NO_AUTHORITY',
      effectDisposition: 'NO_EFFECTS',
    },
    sourceRefs: ['test.transition-handshake'],
    formedAt: '2026-10-21T08:00:00.000Z',
  }, registry);
}

function transition(current, nextState, ref = 'transition.test.agency') {
  return {
    workRef: 'work.test.agency',
    transitionRef: ref,
    expectedGraphFingerprint: current.semanticFingerprint,
    expectedState: current.items[0].state,
    nextState,
    actorRef: 'role.test.ai-worker',
    sourceRefs: ['test.transition-handshake'],
    reason: 'agency transition proof',
    createdAt: '2026-10-21T08:01:00.000Z',
  };
}

function approvedHandshake(current, nextState) {
  const proposal = createTransitionProposal({
    project: project(),
    graph: current,
    policy: policy(),
    registry,
    proposalRef: 'proposal.test.agency',
    workRef: 'work.test.agency',
    nextState,
    whatBecameTrue: 'The current phase is complete and its bounded proof is current.',
    nextIntent: 'Enter the next phase and continue autonomously within its described envelope.',
    attention: ['Human trajectory acknowledgement is requested; no technical action is required.'],
    heldBoundaries: ['No scope expansion or new provider effect is implied.'],
    authorityBasisRefs: ['authority.test.delegated-envelope'],
    proposedByActorRef: 'role.test.ai-worker',
    formedAt: '2026-10-21T08:00:30.000Z',
  });
  const response = createHumanTransitionResponse({
    proposal,
    responseRef: 'response.test.victor',
    humanActorRef: 'human.victor',
    decision: 'ACK_APPROVED',
    respondedAt: '2026-10-21T08:00:40.000Z',
  });
  const confirmation = createAiTransitionConfirmation({
    proposal,
    response,
    confirmationRef: 'confirmation.test.ai',
    actorRef: 'role.test.ai-worker',
    confirmedInterpretation: 'Victor understood and approved the exact proposed phase transition.',
    confirmedEnvelope: 'Continue only inside the already delegated bounded work envelope.',
    nextAction: 'COMMIT_TRANSITION',
    confirmedAt: '2026-10-21T08:00:50.000Z',
  });
  return { proposal, response, confirmation };
}

test('Project Agency Policy distinguishes routine movement from phase handshakes', () => {
  const p = policy();
  assert.equal(transitionHandshakeRequirement({ policy: p, priorState: 'RUNNING', nextState: 'WAITING_TOOL', registry }).required, false);
  assert.equal(transitionHandshakeRequirement({ policy: p, priorState: 'READY', nextState: 'RUNNING', registry }).required, true);
  assert.equal(transitionHandshakeRequirement({ policy: p, priorState: 'RUNNING', nextState: 'VERIFYING', registry }).required, true);
  assert.equal(transitionHandshakeRequirement({ policy: p, priorState: 'VERIFYING', nextState: 'COMPLETED', registry }).required, true);
});


test('transient lanes cannot bypass protected phase entry while proven same-phase resume stays autonomous', () => {
  const ready = graph('READY');
  const waitingResource = requestTransition(
    ready,
    transition(ready, 'WAITING_RESOURCE', 'transition.test.waiting-resource'),
    registry,
  ).graph;
  assert.equal(transitionHandshakeRequirement({
    policy: policy(),
    priorState: 'WAITING_RESOURCE',
    nextState: 'CONTEXT_ADMITTED',
    registry,
    graph: waitingResource,
    workRef: 'work.test.agency',
  }).required, true);
  assert.throws(() => requestProjectTransition({
    project: project(),
    graph: waitingResource,
    policy: policy(),
    transitionRequest: transition(waitingResource, 'CONTEXT_ADMITTED', 'transition.test.waiting-resource-active'),
    registry,
  }), /transition handshake required/);

  const active = graph('RUNNING');
  const waitingHuman = requestTransition(
    active,
    transition(active, 'WAITING_HUMAN', 'transition.test.waiting-human'),
    registry,
  ).graph;
  assert.equal(transitionHandshakeRequirement({
    policy: policy(),
    priorState: 'WAITING_HUMAN',
    nextState: 'RUNNING',
    registry,
    graph: waitingHuman,
    workRef: 'work.test.agency',
  }).required, false);
  const resumed = requestProjectTransition({
    project: project(),
    graph: waitingHuman,
    policy: policy(),
    transitionRequest: transition(waitingHuman, 'RUNNING', 'transition.test.waiting-human-resume'),
    registry,
  });
  assert.equal(resumed.state, 'ACCEPTED');
  assert.equal(resumed.handshake.required, false);

  assert.equal(transitionHandshakeRequirement({
    policy: policy(),
    priorState: 'WAITING_HUMAN',
    nextState: 'VERIFYING',
    registry,
    graph: waitingHuman,
    workRef: 'work.test.agency',
  }).required, true);
  assert.throws(() => requestProjectTransition({
    project: project(),
    graph: waitingHuman,
    policy: policy(),
    transitionRequest: transition(waitingHuman, 'VERIFYING', 'transition.test.waiting-human-verify'),
    registry,
  }), /transition handshake required/);
});

test('routine same-phase transition proceeds autonomously inside bounded authority', () => {
  const current = graph('RUNNING');
  const result = requestProjectTransition({
    project: project(),
    graph: current,
    policy: policy(),
    transitionRequest: transition(current, 'WAITING_TOOL'),
    registry,
  });
  assert.equal(result.state, 'ACCEPTED');
  assert.equal(result.graph.items[0].state, 'WAITING_TOOL');
  assert.equal(result.handshake.required, false);
});

test('phase promotion fails closed without the three-way handshake', () => {
  const current = graph('READY');
  assert.throws(() => requestProjectTransition({
    project: project(),
    graph: current,
    policy: policy(),
    transitionRequest: transition(current, 'RUNNING'),
    registry,
  }), /transition handshake required/);
});

test('approved exact handshake commits the proposed phase transition and retains all three refs', () => {
  const current = graph('READY');
  const handshake = approvedHandshake(current, 'RUNNING');
  const result = requestProjectTransition({
    project: project(),
    graph: current,
    policy: policy(),
    transitionRequest: transition(current, 'RUNNING'),
    registry,
    handshakeOrNull: handshake,
  });
  assert.equal(result.state, 'ACCEPTED');
  assert.equal(result.graph.items[0].state, 'RUNNING');
  assert.equal(result.handshake.decision, 'ACK_APPROVED');
  assert.equal(result.transition.sourceRefs.includes(handshake.proposal.proposalRef), true);
  assert.equal(result.transition.sourceRefs.includes(handshake.response.responseRef), true);
  assert.equal(result.transition.sourceRefs.includes(handshake.confirmation.confirmationRef), true);
});

test('human feedback is acknowledged by the AI but holds the transition', () => {
  const current = graph('READY');
  const proposal = approvedHandshake(current, 'RUNNING').proposal;
  const response = createHumanTransitionResponse({
    proposal,
    responseRef: 'response.test.feedback',
    humanActorRef: 'human.victor',
    decision: 'ACK_FEEDBACK',
    feedbackOrNull: 'Keep migration held during the first implementation phase.',
    respondedAt: '2026-10-21T08:00:40.000Z',
  });
  const confirmation = createAiTransitionConfirmation({
    proposal,
    response,
    confirmationRef: 'confirmation.test.feedback',
    actorRef: 'role.test.ai-worker',
    confirmedInterpretation: 'Feedback received; migration remains held.',
    confirmedEnvelope: 'Do not enter Active until the proposal is revised.',
    nextAction: 'HOLD',
    confirmedAt: '2026-10-21T08:00:50.000Z',
  });
  const result = requestProjectTransition({
    project: project(),
    graph: current,
    policy: policy(),
    transitionRequest: transition(current, 'RUNNING'),
    registry,
    handshakeOrNull: { proposal, response, confirmation },
  });
  assert.equal(result.state, 'HELD');
  assert.equal(result.changed, false);
  assert.equal(result.graph.semanticFingerprint, current.semanticFingerprint);
});

test('stale proposal cannot apply after Workgraph currentness changes', () => {
  const current = graph('READY');
  const handshake = approvedHandshake(current, 'RUNNING');

  const waiting = requestTransition(
    current,
    transition(current, 'WAITING_RESOURCE', 'transition.test.wait'),
    registry,
  ).graph;
  const returned = requestTransition(
    waiting,
    transition(waiting, 'READY', 'transition.test.return-ready'),
    registry,
  ).graph;

  assert.equal(returned.items[0].state, 'READY');
  assert.notEqual(returned.semanticFingerprint, current.semanticFingerprint);

  assert.throws(() => requestProjectTransition({
    project: project(),
    graph: returned,
    policy: policy(),
    transitionRequest: transition(returned, 'RUNNING', 'transition.test.stale-active'),
    registry,
    handshakeOrNull: handshake,
  }), /transition proposal is stale/);
});

test('acknowledgement cannot manufacture authority', () => {
  const current = graph('READY', 'NO_AUTHORITY', 'NO_EFFECTS');
  const handshake = approvedHandshake(current, 'RUNNING');
  assert.throws(() => requestProjectTransition({
    project: project(),
    graph: current,
    policy: policy(),
    transitionRequest: transition(current, 'RUNNING'),
    registry,
    handshakeOrNull: handshake,
  }), /cannot advance work without bounded authority/);
});


test('Project Agency Policy rejects reused boundary identity across different phase crossings', () => {
  const source = structuredClone(policy());
  delete source.semanticFingerprint;
  source.handshakeLaneTransitions[1].boundaryRef = source.handshakeLaneTransitions[0].boundaryRef;
  assert.throws(() => createProjectAgencyPolicy(source, registry), /duplicate boundaryRef/);
});


test('Project Agency Policy rejects ambiguous duplicate protected target phases', () => {
  const source = structuredClone(policy());
  delete source.semanticFingerprint;
  source.handshakeLaneTransitions[1] = {
    boundaryRef: 'boundary.test.planned-active',
    fromLaneRef: 'lane.work.planned',
    toLaneRef: 'lane.work.active',
  };
  assert.throws(() => createProjectAgencyPolicy(source, registry), /duplicate handshake target lane/);
});

test('final transition admission rejects fingerprint-valid handshake schema substitution', () => {
  const current = graph('READY');
  const original = approvedHandshake(current, 'RUNNING');

  const forgedProposal = withSemanticFingerprint({
    ...original.proposal,
    schemaVersion: 'vexwork.not-a-transition-proposal/v1',
  });
  const forgedResponse = withSemanticFingerprint({
    ...original.response,
    proposalRef: forgedProposal.proposalRef,
    proposalSemanticFingerprint: forgedProposal.semanticFingerprint,
  });
  const forgedConfirmation = withSemanticFingerprint({
    ...original.confirmation,
    proposalRef: forgedProposal.proposalRef,
    proposalSemanticFingerprint: forgedProposal.semanticFingerprint,
    responseRef: forgedResponse.responseRef,
    responseSemanticFingerprint: forgedResponse.semanticFingerprint,
  });

  assert.throws(() => requestProjectTransition({
    project: project(),
    graph: current,
    policy: policy(),
    transitionRequest: transition(current, 'RUNNING'),
    registry,
    handshakeOrNull: {
      proposal: forgedProposal,
      response: forgedResponse,
      confirmation: forgedConfirmation,
    },
  }), /transition proposal schema mismatch/);

  const validProposal = original.proposal;
  const wrongResponse = withSemanticFingerprint({
    ...original.response,
    schemaVersion: 'vexwork.not-a-human-response/v1',
  });
  const confirmationForWrongResponse = withSemanticFingerprint({
    ...original.confirmation,
    responseRef: wrongResponse.responseRef,
    responseSemanticFingerprint: wrongResponse.semanticFingerprint,
  });
  assert.throws(() => requestProjectTransition({
    project: project(),
    graph: current,
    policy: policy(),
    transitionRequest: transition(current, 'RUNNING', 'transition.test.wrong-response-schema'),
    registry,
    handshakeOrNull: {
      proposal: validProposal,
      response: wrongResponse,
      confirmation: confirmationForWrongResponse,
    },
  }), /human transition response schema mismatch/);

  const wrongConfirmation = withSemanticFingerprint({
    ...original.confirmation,
    schemaVersion: 'vexwork.not-an-ai-confirmation/v1',
  });
  assert.throws(() => requestProjectTransition({
    project: project(),
    graph: current,
    policy: policy(),
    transitionRequest: transition(current, 'RUNNING', 'transition.test.wrong-confirmation-schema'),
    registry,
    handshakeOrNull: {
      proposal: validProposal,
      response: original.response,
      confirmation: wrongConfirmation,
    },
  }), /AI transition confirmation schema mismatch/);
});
