import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { createProject, createWorkgraph, projectWorkRefs, requestTransition, validateRegistry } from '../src/core/workgraph.mjs';
import { verifySemanticFingerprint } from '../src/core/semantic.mjs';

const read = (relative) => JSON.parse(fs.readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8'));
const registry = read('blueprint/work-registry.json');
const projectSource = read('projects/vexwork-foundation/project.json');
const graphSource = read('projects/vexwork-foundation/workgraph.json');

test('work registry covers lifecycle states exactly once on the default Work Board', () => {
  const result = validateRegistry(registry);
  assert.equal(result.ok, true, result.errors.join('\n'));
});

test('one Workgraph can contain project work and unprojected parked work', () => {
  const project = createProject(projectSource);
  const graph = createWorkgraph(graphSource, registry);
  assert.equal(graph.items.length, 7);
  assert.equal(projectWorkRefs(project, graph).length, 6);
  assert.equal(verifySemanticFingerprint(project), true);
  assert.equal(verifySemanticFingerprint(graph), true);

  assert.equal(graph.items.find((item) => item.workRef === 'work.vexwork.foundation.portable-workgraph').state, 'COMPLETED');
  assert.equal(graph.items.find((item) => item.workRef === 'work.vexwork.foundation.work-board').state, 'COMPLETED');
  assert.equal(graph.items.find((item) => item.workRef === 'work.vexwork.foundation.repository-graph').state, 'COMPLETED');
  assert.equal(graph.items.find((item) => item.workRef === 'work.vexwork.foundation.runtime-persistence').state, 'COMPLETED');
  assert.equal(graph.items.find((item) => item.workRef === 'work.vexwork.foundation.runtime-persistence').authorityDisposition, 'AUTHORIZED_BOUNDED');
  assert.equal(graph.items.find((item) => item.workRef === 'work.vexwork.foundation.runtime-persistence').effectDisposition, 'EFFECTS_BOUND');
  assert.equal(graph.transitions.length, 7);

  const parked = graph.items.find((item) => item.workRef === 'work.vexlife-android.vexstream.not-yet-downloaded-filter');
  assert.equal(parked.workClass, 'POTENTIAL');
  assert.equal(parked.state, 'CAPTURED');
  assert.equal(parked.workDisposition, 'PARKED');
  assert.equal(parked.authorityDisposition, 'NO_AUTHORITY');
  assert.equal(parked.effectDisposition, 'NO_EFFECTS');
  assert.equal(parked.formationProcessRefOrNull, 'process.vexwork.capture-discovered-work');
  assert.deepEqual(parked.nextProcessRefs, ['process.vexlife-android.feature-authoring']);
});

test('typed transition rejects stale observation and accepts exact current transition', () => {
  const graph = createWorkgraph(graphSource, registry);
  assert.throws(() => requestTransition(graph, {
    workRef: 'work.vexwork.foundation.outcome',
    transitionRef: 'transition.test.stale',
    expectedGraphFingerprint: '0'.repeat(64),
    expectedState: 'RUNNING',
    nextState: 'VERIFYING',
    actorRef: 'actor.test',
    sourceRefs: ['test.workgraph'],
    reason: 'stale test',
    createdAt: '2026-10-21T04:00:00.000Z'
  }, registry), /stale Workgraph observation/);

  const result = requestTransition(graph, {
    workRef: 'work.vexwork.foundation.outcome',
    transitionRef: 'transition.test.verify-outcome',
    expectedGraphFingerprint: graph.semanticFingerprint,
    expectedState: 'RUNNING',
    nextState: 'VERIFYING',
    actorRef: 'actor.test',
    sourceRefs: ['test.workgraph'],
    reason: 'exact-current transition proof',
    createdAt: '2026-10-21T04:00:01.000Z'
  }, registry);
  assert.equal(result.state, 'ACCEPTED');
  assert.equal(result.graph.items.find((item) => item.workRef === 'work.vexwork.foundation.outcome').state, 'VERIFYING');
  assert.equal(result.effects.providerMutationPerformed, false);
});

test('dependency cycles fail closed', () => {
  const cyclic = structuredClone(graphSource);
  cyclic.items[1].dependencyRefs = ['work.vexwork.foundation.work-board'];
  cyclic.items[2].dependencyRefs = ['work.vexwork.foundation.portable-workgraph'];
  assert.throws(() => createWorkgraph(cyclic, registry), /dependency cycle detected/);
});

test('declared Workgraph roots must include every parentless work item', () => {
  const missingParkingRoot = structuredClone(graphSource);
  missingParkingRoot.rootWorkRefs = ['work.vexwork.foundation.outcome'];
  assert.throws(() => createWorkgraph(missingParkingRoot, registry), /rootWorkRefs must exactly equal parentless work items/);
});
