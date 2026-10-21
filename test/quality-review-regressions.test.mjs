import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { createWorkgraph, requestTransition } from '../src/core/workgraph.mjs';
import { createBoardView } from '../src/core/work-board.mjs';
import { verifySemanticFingerprint, withSemanticFingerprint } from '../src/core/semantic.mjs';

const read = (relative) => JSON.parse(fs.readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8'));
const registry = read('blueprint/work-registry.json');
const graphSource = read('projects/vexwork-foundation/workgraph.json');
const boardViewSource = read('projects/vexwork-foundation/board.view.json');

function storedTransition(overrides = {}) {
  return {
    schemaVersion: 'vexwork.work-transition/v1',
    transitionRef: 'transition.test.history.1',
    workRef: 'work.vexwork.foundation.idea-intake',
    priorState: 'CAPTURED',
    nextState: 'NEEDS_CLARIFICATION',
    reason: 'history fixture',
    actorRef: 'actor.test',
    sourceRefs: ['test.workgraph'],
    createdAt: '2026-10-21T02:30:00.000Z',
    ...overrides,
  };
}

test('stored transition history rejects illegal lifecycle edges', () => {
  const candidate = structuredClone(graphSource);
  candidate.items[4].state = 'CLOSED';
  candidate.items[4].updatedAt = '2026-10-21T02:30:00.000Z';
  candidate.transitions = [storedTransition({ nextState: 'CLOSED' })];
  assert.throws(() => createWorkgraph(candidate, registry), /transition CAPTURED -> CLOSED not allowed/);
});

test('stored transition history must be continuous and converge on current WorkState', () => {
  const mismatch = structuredClone(graphSource);
  mismatch.transitions = [storedTransition()];
  assert.throws(() => createWorkgraph(mismatch, registry), /latest state NEEDS_CLARIFICATION does not match current CAPTURED/);

  const discontinuous = structuredClone(graphSource);
  discontinuous.items[4].state = 'PLAN_VALIDATED';
  discontinuous.items[4].updatedAt = '2026-10-21T02:31:00.000Z';
  discontinuous.transitions = [
    storedTransition(),
    storedTransition({ transitionRef: 'transition.test.history.2', priorState: 'DECOMPOSED', nextState: 'PLAN_VALIDATED', createdAt: '2026-10-21T02:31:00.000Z' }),
  ];
  assert.throws(() => createWorkgraph(discontinuous, registry), /transition history discontinuity/);
});

test('stored and requested transition identities are unique', () => {
  const duplicate = structuredClone(graphSource);
  duplicate.items[4].state = 'DECOMPOSED';
  duplicate.items[4].updatedAt = '2026-10-21T02:31:00.000Z';
  duplicate.transitions = [
    storedTransition(),
    storedTransition({ priorState: 'NEEDS_CLARIFICATION', nextState: 'DECOMPOSED', createdAt: '2026-10-21T02:31:00.000Z' }),
  ];
  assert.throws(() => createWorkgraph(duplicate, registry), /duplicate transitionRef/);

  const accepted = structuredClone(graphSource);
  accepted.items[4].state = 'NEEDS_CLARIFICATION';
  accepted.items[4].updatedAt = '2026-10-21T02:30:00.000Z';
  accepted.transitions = [storedTransition()];
  const graph = createWorkgraph(accepted, registry);
  assert.throws(() => requestTransition(graph, {
    workRef: 'work.vexwork.foundation.idea-intake',
    transitionRef: 'transition.test.history.1',
    expectedGraphFingerprint: graph.semanticFingerprint,
    expectedState: 'NEEDS_CLARIFICATION',
    nextState: 'DECOMPOSED',
    actorRef: 'actor.test',
    sourceRefs: ['test.workgraph'],
    reason: 'duplicate transition identity',
    createdAt: '2026-10-21T02:31:00.000Z'
  }, registry), /transitionRef already used/);
});

test('valid stored transition history remains accepted', () => {
  const candidate = structuredClone(graphSource);
  candidate.items[4].state = 'DECOMPOSED';
  candidate.items[4].updatedAt = '2026-10-21T02:31:00.000Z';
  candidate.transitions = [
    storedTransition(),
    storedTransition({ transitionRef: 'transition.test.history.2', priorState: 'NEEDS_CLARIFICATION', nextState: 'DECOMPOSED', createdAt: '2026-10-21T02:31:00.000Z' }),
  ];
  const graph = createWorkgraph(candidate, registry);
  assert.equal(graph.transitions.length, 2);
});

test('Board lane order is an exact unique permutation, not a filtering mechanism', () => {
  const omitted = structuredClone(boardViewSource);
  omitted.laneRefOrder = omitted.laneRefOrder.slice(0, -1);
  assert.throws(() => createBoardView(omitted, registry), /exact unique permutation/);

  const duplicated = structuredClone(boardViewSource);
  duplicated.laneRefOrder[duplicated.laneRefOrder.length - 1] = duplicated.laneRefOrder[0];
  assert.throws(() => createBoardView(duplicated, registry), /exact unique permutation/);
});

test('requestTransition refuses a correctly fingerprinted Workgraph with invalid stored history', () => {
  const valid = createWorkgraph(graphSource, registry);
  const invalid = structuredClone(valid);

  invalid.items[4] = withSemanticFingerprint({
    ...invalid.items[4],
    state: 'CLOSED',
    updatedAt: '2026-10-21T02:40:00.000Z',
  });
  invalid.transitions = [
    storedTransition({
      transitionRef: 'transition.test.invalid-history',
      nextState: 'CLOSED',
      createdAt: '2026-10-21T02:40:00.000Z',
    }),
  ];
  delete invalid.semanticFingerprint;
  const fingerprintedInvalid = withSemanticFingerprint(invalid);
  assert.equal(verifySemanticFingerprint(fingerprintedInvalid), true);

  assert.throws(() => requestTransition(fingerprintedInvalid, {
    workRef: 'work.vexwork.foundation.portable-workgraph',
    transitionRef: 'transition.test.other-work',
    expectedGraphFingerprint: fingerprintedInvalid.semanticFingerprint,
    expectedState: 'VERIFYING',
    nextState: 'COMPLETED',
    actorRef: 'actor.test',
    sourceRefs: ['test.quality-review'],
    reason: 'must reject invalid graph before deriving new truth',
    createdAt: '2026-10-21T02:41:00.000Z',
  }, registry), /transition CAPTURED -> CLOSED not allowed/);
});

