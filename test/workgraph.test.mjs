import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { createProject, createWorkgraph, requestTransition, validateRegistry } from '../src/core/workgraph.mjs';
import { verifySemanticFingerprint } from '../src/core/semantic.mjs';

const read = (relative) => JSON.parse(fs.readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8'));
const registry = read('blueprint/work-registry.json');
const projectSource = read('projects/vexwork-foundation/project.json');
const graphSource = read('projects/vexwork-foundation/workgraph.json');

test('work registry covers lifecycle states exactly once on the default Work Board', () => {
  const result = validateRegistry(registry);
  assert.equal(result.ok, true, result.errors.join('\n'));
});

test('source-managed VexWork foundation project and Workgraph are canonical', () => {
  const project = createProject(projectSource);
  const graph = createWorkgraph(graphSource, registry);
  assert.equal(project.projectRef, graph.projectRef);
  assert.equal(graph.items.length, 6);
  assert.equal(verifySemanticFingerprint(project), true);
  assert.equal(verifySemanticFingerprint(graph), true);
  const potential = graph.items.find((item) => item.workClass === 'POTENTIAL');
  assert.equal(potential.authorityDisposition, 'NO_AUTHORITY');
  assert.equal(potential.effectDisposition, 'NO_EFFECTS');
});

test('typed transition rejects stale observation and accepts exact current transition', () => {
  const graph = createWorkgraph(graphSource, registry);
  assert.throws(() => requestTransition(graph, {
    workRef: 'work.vexwork.foundation.portable-workgraph',
    transitionRef: 'transition.test.stale',
    expectedGraphFingerprint: '0'.repeat(64),
    expectedState: 'VERIFYING',
    nextState: 'COMPLETED',
    actorRef: 'actor.test',
    sourceRefs: ['test.workgraph'],
    reason: 'stale test',
    createdAt: '2026-10-21T01:46:00.000Z'
  }, registry), /stale Workgraph observation/);

  const result = requestTransition(graph, {
    workRef: 'work.vexwork.foundation.portable-workgraph',
    transitionRef: 'transition.test.complete',
    expectedGraphFingerprint: graph.semanticFingerprint,
    expectedState: 'VERIFYING',
    nextState: 'COMPLETED',
    actorRef: 'actor.test',
    sourceRefs: ['test.workgraph'],
    reason: 'focused proof complete',
    createdAt: '2026-10-21T01:46:01.000Z'
  }, registry);
  assert.equal(result.state, 'ACCEPTED');
  assert.equal(result.graph.items.find((item) => item.workRef === 'work.vexwork.foundation.portable-workgraph').state, 'COMPLETED');
  assert.equal(result.effects.providerMutationPerformed, false);
});


test('dependency cycles fail closed', () => {
  const cyclic = structuredClone(graphSource);
  cyclic.items[1].dependencyRefs = ['work.vexwork.foundation.work-board'];
  cyclic.items[2].dependencyRefs = ['work.vexwork.foundation.portable-workgraph'];
  assert.throws(() => createWorkgraph(cyclic, registry), /dependency cycle detected/);
});
