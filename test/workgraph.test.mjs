import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { createProject, createWorkgraph, projectWorkRefs, requestTransition, validateRegistry } from '../src/core/workgraph.mjs';
import { verifySemanticFingerprint } from '../src/core/semantic.mjs';

const read = (relative) => JSON.parse(fs.readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8'));
const registry = read('blueprint/work-registry.json');
const projectSource = read('projects/vexwork-foundation/project.json');
const toCompletionProjectSource = read('projects/vexlife-tocompletion/project.json');
const graphSource = read('workgraphs/public.json');

test('work registry covers lifecycle states exactly once on the default Work Board', () => {
  const result = validateRegistry(registry);
  assert.equal(result.ok, true, result.errors.join('\n'));
});

test('one Workgraph can contain project work and unprojected parked work', () => {
  const project = createProject(projectSource);
  const graph = createWorkgraph(graphSource, registry);
  assert.equal(graph.items.length, 29);
  assert.equal(projectWorkRefs(project, graph).length, 8);
  const toCompletionProject = createProject(toCompletionProjectSource);
  assert.equal(projectWorkRefs(toCompletionProject, graph).length, 8);
  assert.equal(verifySemanticFingerprint(project), true);
  assert.equal(verifySemanticFingerprint(graph), true);

  assert.equal(graph.items.find((item) => item.workRef === 'work.vexwork.foundation.portable-workgraph').state, 'COMPLETED');
  assert.equal(graph.items.find((item) => item.workRef === 'work.vexwork.foundation.work-board').state, 'COMPLETED');
  assert.equal(graph.items.find((item) => item.workRef === 'work.vexwork.foundation.repository-graph').state, 'COMPLETED');
  assert.equal(graph.items.find((item) => item.workRef === 'work.vexwork.foundation.runtime-persistence').state, 'COMPLETED');
  assert.equal(graph.items.find((item) => item.workRef === 'work.vexwork.foundation.runtime-persistence').authorityDisposition, 'AUTHORIZED_BOUNDED');
  assert.equal(graph.items.find((item) => item.workRef === 'work.vexwork.foundation.runtime-persistence').effectDisposition, 'EFFECTS_BOUND');
  assert.equal(graph.items.find((item) => item.workRef === 'work.vexwork.visibility.public-dashboard').state, 'COMPLETED');
  assert.equal(graph.items.find((item) => item.workRef === 'work.vexwork.history.foundational-infrastructure-backfill').state, 'CAPTURED');
  assert.equal(graph.items.find((item) => item.workRef === 'work.vexwork.history.foundational-infrastructure-backfill').authorityDisposition, 'NO_AUTHORITY');
  assert.equal(graph.transitions.length, 9);

  const parked = graph.items.find((item) => item.workRef === 'work.vexlife-android.vexstream.not-yet-downloaded-filter');
  assert.equal(parked.workClass, 'POTENTIAL');
  assert.equal(parked.state, 'CAPTURED');
  assert.equal(parked.workDisposition, 'PARKED');
  assert.equal(parked.authorityDisposition, 'NO_AUTHORITY');
  assert.equal(parked.effectDisposition, 'NO_EFFECTS');
  assert.equal(parked.formationProcessRefOrNull, 'process.vexwork.capture-discovered-work');
  assert.deepEqual(parked.nextProcessRefs, ['process.vexlife-android.feature-authoring']);
  const tailscale = graph.items.find((item) => item.workRef === 'work.vexlife.connected-services.guided-onboarding');
  assert.equal(tailscale.workClass, 'POTENTIAL');
  assert.equal(tailscale.state, 'CAPTURED');
  assert.equal(tailscale.workDisposition, 'PARKED');
  assert.equal(tailscale.authorityDisposition, 'NO_AUTHORITY');
  assert.equal(tailscale.effectDisposition, 'NO_EFFECTS');
  assert.deepEqual(tailscale.repositoryRefs, ['repo.vexlife', 'repo.vexlife-android']);
  assert.equal(tailscale.formationProcessRefOrNull, 'process.vexwork.capture-discovered-work');
  assert.deepEqual(tailscale.nextProcessRefs, []);
  const mobile = graph.items.find((item) => item.workRef === 'work.vexstream.mobile-library.outcome');
  assert.equal(mobile.workClass, 'OUTCOME');
  assert.equal(mobile.state, 'DECOMPOSED');
  assert.equal(mobile.authorityDisposition, 'AUTHORIZED_BOUNDED');
  const massDownload = graph.items.find((item) => item.workRef === 'work.vexstream.mobile-library.massdownload-product');
  assert.equal(massDownload.state, 'COMPLETED');
  const e2e = graph.items.find((item) => item.workRef === 'work.vexstream.mobile-library.massdownload-e2e');
  assert.equal(e2e.state, 'CAPTURED');
  assert.equal(e2e.authorityDisposition, 'HELD_UNKNOWN');
  const keepOffline = graph.items.find((item) => item.workRef === 'work.vexstream.mobile-library.keep-offline-sync');
  assert.equal(keepOffline.workDisposition, 'PARKED');
  assert.equal(keepOffline.authorityDisposition, 'NO_AUTHORITY');
  assert.equal(keepOffline.effectDisposition, 'NO_EFFECTS');

  const toCompletion = graph.items.find((item) => item.workRef === 'work.vexlife.tocompletion.outcome');
  assert.equal(toCompletion.workClass, 'OUTCOME');
  assert.equal(toCompletion.state, 'RUNNING');
  assert.equal(toCompletion.authorityDisposition, 'AUTHORIZED_BOUNDED');
  const p0b = graph.items.find((item) => item.workRef === 'work.vexlife.tocompletion.p0b.foundation');
  const p1 = graph.items.find((item) => item.workRef === 'work.vexlife.tocompletion.p1.heretic-establishment');
  const p2 = graph.items.find((item) => item.workRef === 'work.vexlife.tocompletion.p2.first-lived-turn');
  const p3 = graph.items.find((item) => item.workRef === 'work.vexlife.tocompletion.p3.restart-durability');
  assert.deepEqual([p0b.state, p1.state, p2.state, p3.state], ['COMPLETED', 'COMPLETED', 'COMPLETED', 'COMPLETED']);
  const p4 = graph.items.find((item) => item.workRef === 'work.vexlife.tocompletion.p4.typed-local-effect');
  assert.equal(p4.state, 'RUNNING');
  const p4Source = graph.items.find((item) => item.workRef === 'work.vexlife.tocompletion.p4.source-acceptance');
  assert.equal(p4Source.state, 'COMPLETED');
  assert.equal(p4Source.sourceRefs.includes('github.pull.vexlife.916'), true);
  const p4Lived = graph.items.find((item) => item.workRef === 'work.vexlife.tocompletion.p4.lived-reinjection');
  assert.equal(p4Lived.state, 'READY');
  assert.deepEqual(p4Lived.dependencyRefs, ['work.vexlife.tocompletion.p4.source-acceptance']);
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
