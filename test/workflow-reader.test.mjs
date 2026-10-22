import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  classifyTransition,
  laneForState,
  policyScopeSummary,
  projectLifecycleWorkflow,
  reviewRequirementForTransition,
  shortestRouteToDone,
} from '../workflow-reader.js';

const registry = JSON.parse(fs.readFileSync(new URL('../blueprint/work-registry.json', import.meta.url), 'utf8'));

const v1Policy = {
  schemaVersion: 'vexwork.project-agency-policy/v1',
  policyRef: 'agency.test.v1',
  projectRef: 'project.test',
  handshakeLaneTransitions: [
    { boundaryRef: 'boundary.test.ready-active', fromLaneRef: 'lane.work.ready', toLaneRef: 'lane.work.active' },
    { boundaryRef: 'boundary.test.active-verify', fromLaneRef: 'lane.work.active', toLaneRef: 'lane.work.verify' },
    { boundaryRef: 'boundary.test.verify-done', fromLaneRef: 'lane.work.verify', toLaneRef: 'lane.work.done' },
  ],
};

const v2OutcomeReview = {
  schemaVersion: 'vexwork.project-agency-policy/v2',
  policyRef: 'agency.test.v2',
  projectRef: 'project.test',
  handshakeLaneTransitions: [
    {
      boundaryRef: 'boundary.test.verify-done.outcome',
      fromLaneRef: 'lane.work.verify',
      toLaneRef: 'lane.work.done',
      appliesTo: { workClasses: ['OUTCOME'] },
    },
  ],
};

test('workflow projection is a live projection of every canonical registry state and transition', () => {
  const projection = projectLifecycleWorkflow(registry);
  assert.equal(projection.lanes.flatMap((lane) => lane.states).length, registry.lifecycleStates.length);
  assert.deepEqual(projection.lanes.flatMap((lane) => lane.states).sort(), [...registry.lifecycleStates].sort());
  assert.equal(projection.edges.length, Object.values(registry.allowedTransitions).reduce((sum, next) => sum + next.length, 0));
  const registryEdges = new Set(Object.entries(registry.allowedTransitions).flatMap(([from, next]) => next.map((to) => from + '->' + to)));
  assert.equal(projection.edges.every((edge) => registryEdges.has(edge.fromState + '->' + edge.toState)), true);
});

test('workflow projection preserves Board phase language over canonical states', () => {
  assert.equal(laneForState(registry, 'RUNNING').laneRef, 'lane.work.active');
  assert.equal(laneForState(registry, 'VERIFYING').laneRef, 'lane.work.verify');
  assert.equal(classifyTransition(registry, 'RUNNING', 'WAITING_HUMAN'), 'EXCEPTION');
  assert.equal(classifyTransition(registry, 'WAITING_HUMAN', 'RUNNING'), 'RESUME');
  assert.equal(classifyTransition(registry, 'VERIFYING', 'COMPLETED'), 'DONE');

  const projection = projectLifecycleWorkflow(registry, { currentState: 'RUNNING' });
  assert.equal(projection.lanes.find((lane) => lane.laneRef === 'lane.work.active').role, 'PRIMARY');
  assert.equal(projection.lanes.find((lane) => lane.laneRef === 'lane.work.attention').role, 'SUPPORT');
  assert.equal(projection.lanes.find((lane) => lane.laneRef === 'lane.work.archive').role, 'ARCHIVE');
  assert.equal(projection.effects, false);
  assert.equal(projection.executionAuthority, 'NONE');
});

test('workflow derives one shortest lawful route to Done without inventing direct skips', () => {
  assert.deepEqual(shortestRouteToDone(registry, 'RUNNING'), ['RUNNING', 'VERIFYING', 'COMPLETED']);
  assert.deepEqual(shortestRouteToDone(registry, 'FAILED_RECOVERABLE'), ['FAILED_RECOVERABLE', 'READY', 'RUNNING', 'VERIFYING', 'COMPLETED']);
  assert.deepEqual(shortestRouteToDone(registry, 'COMPLETED'), ['COMPLETED']);
  assert.deepEqual(shortestRouteToDone(registry, 'CANCELLED'), []);
});

test('v1 policy marks every configured phase crossing as human-reviewed', () => {
  const result = reviewRequirementForTransition(v1Policy, registry, {
    fromState: 'VERIFYING',
    toState: 'COMPLETED',
    workClass: 'TASK',
    workRef: 'work.test.task',
  });
  assert.equal(result.mode, 'REQUIRED');
  assert.equal(result.boundaryRefOrNull, 'boundary.test.verify-done');
});

test('v2 policy can require human acceptance for outcomes while allowing ordinary tasks to close', () => {
  const outcome = reviewRequirementForTransition(v2OutcomeReview, registry, {
    fromState: 'VERIFYING',
    toState: 'COMPLETED',
    workClass: 'OUTCOME',
    workRef: 'work.test.outcome',
  });
  const task = reviewRequirementForTransition(v2OutcomeReview, registry, {
    fromState: 'VERIFYING',
    toState: 'COMPLETED',
    workClass: 'TASK',
    workRef: 'work.test.task',
  });
  assert.equal(outcome.mode, 'REQUIRED');
  assert.equal(task.mode, 'NONE');
  assert.equal(policyScopeSummary(v2OutcomeReview.handshakeLaneTransitions[0]), 'OUTCOME');
});

test('protected target phase stays review-gated without same-phase provenance', () => {
  const outcome = reviewRequirementForTransition(v2OutcomeReview, registry, {
    fromState: 'WAITING_HUMAN',
    toState: 'VERIFYING',
    workClass: 'OUTCOME',
    workRef: 'work.test.outcome',
  });
  const task = reviewRequirementForTransition(v2OutcomeReview, registry, {
    fromState: 'WAITING_HUMAN',
    toState: 'VERIFYING',
    workClass: 'TASK',
    workRef: 'work.test.task',
  });
  assert.equal(outcome.mode, 'PROTECTED_TARGET');
  assert.match(outcome.reason, /no exact same-phase resume provenance/);
  assert.equal(task.mode, 'NONE');
});

test('exact transition history makes a true same-phase resume autonomous in the map', () => {
  const result = reviewRequirementForTransition(v1Policy, registry, {
    fromState: 'WAITING_HUMAN',
    toState: 'VERIFYING',
    workClass: 'TASK',
    workRef: 'work.test.task',
    transitionHistory: [
      { priorState: 'RUNNING', nextState: 'VERIFYING' },
      { priorState: 'VERIFYING', nextState: 'WAITING_HUMAN' },
    ],
  });
  assert.equal(result.mode, 'NONE');
  assert.match(result.reason, /same-phase resume/);
});

test('project workflow projection carries exact current-state branches and review markers', () => {
  const projection = projectLifecycleWorkflow(registry, {
    policy: v2OutcomeReview,
    currentState: 'VERIFYING',
    workClass: 'OUTCOME',
    workRef: 'work.test.outcome',
  });
  const complete = projection.outgoing.find((edge) => edge.toState === 'COMPLETED');
  const recover = projection.outgoing.find((edge) => edge.toState === 'FAILED_RECOVERABLE');
  assert.equal(complete.review.mode, 'REQUIRED');
  assert.equal(recover.review.mode, 'NONE');
  assert.deepEqual(projection.routeToDone, ['VERIFYING', 'COMPLETED']);
  assert.equal(projection.policy.boundaries[0].scope, 'OUTCOME');
});

// [VXG RealForever][VEXWORK][LIFECYCLE-WORKFLOW-PROJECTION]
