import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  createAiTransitionConfirmation,
  createHumanTransitionResponse,
  createProjectAgencyPolicy,
  createTransitionProposal,
  requestProjectTransition,
} from '../src/core/transition-handshake.mjs';
import { withSemanticFingerprint } from '../src/core/semantic.mjs';
import { createProject, createWorkgraph } from '../src/core/workgraph.mjs';

const registry = JSON.parse(fs.readFileSync(new URL('../blueprint/work-registry.json', import.meta.url), 'utf8'));

function project() {
  return createProject({
    schemaVersion: 'vexwork.project-definition/v1',
    projectRef: 'project.test.handshake-admission',
    label: 'Handshake admission test',
    purpose: 'Prove final transition admission revalidates every typed handshake object after constructor bypass.',
    rootWorkRefs: ['work.test.handshake-admission'],
    repositoryRefs: [],
    sourceRefs: ['test.transition-handshake-admission'],
    formedAt: '2026-10-21T10:00:00.000Z',
  });
}

function graph() {
  return createWorkgraph({
    schemaVersion: 'vexwork.workgraph/v1',
    graphRef: 'workgraph.test.handshake-admission',
    rootWorkRefs: ['work.test.handshake-admission'],
    items: [{
      schemaVersion: 'vexwork.work-item/v1',
      workRef: 'work.test.handshake-admission',
      parentWorkRefOrNull: null,
      label: 'Handshake admission work',
      purpose: 'Advance only through one fully typed, exact-current three-way handshake.',
      workClass: 'TASK',
      state: 'READY',
      workDisposition: 'ACTIVE',
      priorityClass: 'NORMAL',
      dependencyRefs: [],
      repositoryRefs: [],
      sourceRefs: ['test.transition-handshake-admission'],
      formationProcessRefOrNull: null,
      nextProcessRefs: [],
      authorityDisposition: 'AUTHORIZED_BOUNDED',
      effectDisposition: 'EFFECTS_BOUND',
      createdAt: '2026-10-21T10:00:00.000Z',
      updatedAt: '2026-10-21T10:00:00.000Z',
    }],
    transitions: [],
    sourceRefs: ['test.transition-handshake-admission'],
    formedAt: '2026-10-21T10:00:00.000Z',
  }, registry);
}

function policy() {
  return createProjectAgencyPolicy({
    schemaVersion: 'vexwork.project-agency-policy/v1',
    policyRef: 'agency.test.handshake-admission',
    projectRef: 'project.test.handshake-admission',
    mode: 'DELEGATED_WITH_TRANSITION_HANDSHAKE',
    routineTransitionAutonomy: 'WITHIN_CURRENT_PHASE',
    handshakeLaneTransitions: [{
      boundaryRef: 'boundary.test.handshake-admission.ready-active',
      fromLaneRef: 'lane.work.ready',
      toLaneRef: 'lane.work.active',
    }],
    discoveredWorkDefault: {
      workClass: 'POTENTIAL',
      workDisposition: 'PARKED',
      authorityDisposition: 'NO_AUTHORITY',
      effectDisposition: 'NO_EFFECTS',
    },
    sourceRefs: ['test.transition-handshake-admission'],
    formedAt: '2026-10-21T10:00:00.000Z',
  }, registry);
}

function transition(current, transitionRef) {
  return {
    workRef: 'work.test.handshake-admission',
    transitionRef,
    expectedGraphFingerprint: current.semanticFingerprint,
    expectedState: 'READY',
    nextState: 'RUNNING',
    actorRef: 'role.test.ai-worker',
    sourceRefs: ['test.transition-handshake-admission'],
    reason: 'typed handshake admission regression',
    createdAt: '2026-10-21T10:01:00.000Z',
  };
}

function approvedHandshake(current) {
  const proposal = createTransitionProposal({
    project: project(),
    graph: current,
    policy: policy(),
    registry,
    proposalRef: 'proposal.test.handshake-admission',
    workRef: 'work.test.handshake-admission',
    nextState: 'RUNNING',
    whatBecameTrue: 'Planning is complete and the exact implementation envelope is ready.',
    nextIntent: 'Enter Active and continue only inside the bounded implementation envelope.',
    attention: ['Review and approve the phase transition; no technical host action is required.'],
    heldBoundaries: ['No scope expansion, publication, or destructive effect is implied.'],
    authorityBasisRefs: ['authority.test.handshake-admission'],
    proposedByActorRef: 'role.test.ai-worker',
    formedAt: '2026-10-21T10:00:30.000Z',
  });
  const response = createHumanTransitionResponse({
    proposal,
    responseRef: 'response.test.handshake-admission',
    humanActorRef: 'human.victor',
    decision: 'ACK_APPROVED',
    respondedAt: '2026-10-21T10:00:40.000Z',
  });
  const confirmation = createAiTransitionConfirmation({
    proposal,
    response,
    confirmationRef: 'confirmation.test.handshake-admission',
    actorRef: 'role.test.ai-worker',
    confirmedInterpretation: 'Victor understood and approved the exact proposed transition.',
    confirmedEnvelope: 'Continue only inside the already delegated bounded implementation envelope.',
    nextAction: 'COMMIT_TRANSITION',
    confirmedAt: '2026-10-21T10:00:50.000Z',
  });
  return { proposal, response, confirmation };
}

function responseBoundTo(response, proposal, patch = {}) {
  return withSemanticFingerprint({
    ...response,
    ...patch,
    proposalRef: proposal.proposalRef,
    proposalSemanticFingerprint: proposal.semanticFingerprint,
  });
}

function confirmationBoundTo(confirmation, proposal, response, patch = {}) {
  return withSemanticFingerprint({
    ...confirmation,
    ...patch,
    proposalRef: proposal.proposalRef,
    proposalSemanticFingerprint: proposal.semanticFingerprint,
    responseRef: response.responseRef,
    responseSemanticFingerprint: response.semanticFingerprint,
  });
}

test('final transition admission rejects correct-schema fingerprint-valid malformed handshake objects', () => {
  const current = graph();
  const original = approvedHandshake(current);

  const malformedProposal = withSemanticFingerprint({
    ...original.proposal,
    attention: 'not-an-array',
  });
  const responseForMalformedProposal = responseBoundTo(original.response, malformedProposal);
  const confirmationForMalformedProposal = confirmationBoundTo(
    original.confirmation,
    malformedProposal,
    responseForMalformedProposal,
  );
  assert.throws(() => requestProjectTransition({
    project: project(),
    graph: current,
    policy: policy(),
    transitionRequest: transition(current, 'transition.test.malformed-proposal'),
    registry,
    handshakeOrNull: {
      proposal: malformedProposal,
      response: responseForMalformedProposal,
      confirmation: confirmationForMalformedProposal,
    },
  }), /attention must be an array/);

  const malformedResponse = responseBoundTo(original.response, original.proposal, {
    humanActorRef: '',
  });
  const confirmationForMalformedResponse = confirmationBoundTo(
    original.confirmation,
    original.proposal,
    malformedResponse,
  );
  assert.throws(() => requestProjectTransition({
    project: project(),
    graph: current,
    policy: policy(),
    transitionRequest: transition(current, 'transition.test.malformed-response'),
    registry,
    handshakeOrNull: {
      proposal: original.proposal,
      response: malformedResponse,
      confirmation: confirmationForMalformedResponse,
    },
  }), /humanActorRef must be one stable ref/);

  const malformedConfirmation = confirmationBoundTo(
    original.confirmation,
    original.proposal,
    original.response,
    { confirmedAt: 'not-a-time' },
  );
  assert.throws(() => requestProjectTransition({
    project: project(),
    graph: current,
    policy: policy(),
    transitionRequest: transition(current, 'transition.test.malformed-confirmation'),
    registry,
    handshakeOrNull: {
      proposal: original.proposal,
      response: original.response,
      confirmation: malformedConfirmation,
    },
  }), /confirmedAt must be canonical UTC ISO/);
});
