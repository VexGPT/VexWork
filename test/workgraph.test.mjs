import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { createProject, createWorkgraph, projectWorkRefs, requestTransition, validateRegistry } from '../src/core/workgraph.mjs';
import { verifySemanticFingerprint } from '../src/core/semantic.mjs';

const read = (relative) => JSON.parse(fs.readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8'));
const registry = read('blueprint/work-registry.json');
const projectSource = read('projects/vexwork-foundation/project.json');
const toCompletionProjectSource = read('projects/vexlife-tocompletion/project.json');
const connectedServicesProjectSource = read('projects/vexlife-connected-services/project.json');
const operationalConsoleProjectSource = read('projects/vexwork-operational-console/project.json');
const graphSource = read('workgraphs/public.json');

test('work registry covers lifecycle states exactly once on the default Work Board', () => {
  const result = validateRegistry(registry);
  assert.equal(result.ok, true, result.errors.join('\n'));
});

test('one Workgraph can contain project work and unprojected parked work', () => {
  const project = createProject(projectSource);
  const graph = createWorkgraph(graphSource, registry);
  assert.equal(graph.items.length, 82);
  assert.equal(projectWorkRefs(project, graph).length, 7);
  const toCompletionProject = createProject(toCompletionProjectSource);
  assert.equal(projectWorkRefs(toCompletionProject, graph).length, 17);
  const connectedServicesProject = createProject(connectedServicesProjectSource);
  assert.equal(projectWorkRefs(connectedServicesProject, graph).length, 19);
  const operationalConsoleProject = createProject(operationalConsoleProjectSource);
  assert.equal(projectWorkRefs(operationalConsoleProject, graph).length, 24);
  assert.equal(verifySemanticFingerprint(project), true);
  assert.equal(verifySemanticFingerprint(graph), true);

  assert.equal(graph.items.find((item) => item.workRef === 'work.vexwork.foundation.portable-workgraph').state, 'COMPLETED');
  assert.equal(graph.items.find((item) => item.workRef === 'work.vexwork.foundation.work-board').state, 'COMPLETED');
  assert.equal(graph.items.find((item) => item.workRef === 'work.vexwork.foundation.repository-graph').state, 'COMPLETED');
  assert.equal(graph.items.find((item) => item.workRef === 'work.vexwork.foundation.runtime-persistence').state, 'COMPLETED');
  assert.equal(graph.items.find((item) => item.workRef === 'work.vexwork.foundation.runtime-persistence').authorityDisposition, 'AUTHORIZED_BOUNDED');
  assert.equal(graph.items.find((item) => item.workRef === 'work.vexwork.foundation.runtime-persistence').effectDisposition, 'EFFECTS_BOUND');
  assert.equal(graph.items.find((item) => item.workRef === 'work.vexwork.visibility.public-dashboard').state, 'COMPLETED');
  const foundationRoot = graph.items.find((item) => item.workRef === 'work.vexwork.foundation.outcome');
  assert.equal(foundationRoot.state, 'COMPLETED');
  const ideaIntake = graph.items.find((item) => item.workRef === 'work.vexwork.foundation.idea-intake');
  assert.equal(ideaIntake.state, 'CANCELLED');
  assert.equal(ideaIntake.authorityDisposition, 'NO_AUTHORITY');
  assert.equal(ideaIntake.effectDisposition, 'NO_EFFECTS');
  const historyBackfill = graph.items.find((item) => item.workRef === 'work.vexwork.history.foundational-infrastructure-backfill');
  assert.equal(historyBackfill.state, 'CAPTURED');
  assert.equal(historyBackfill.parentWorkRefOrNull, null);
  assert.equal(historyBackfill.workDisposition, 'PARKED');
  assert.equal(historyBackfill.authorityDisposition, 'NO_AUTHORITY');
  assert.equal(historyBackfill.effectDisposition, 'NO_EFFECTS');
  assert.equal(historyBackfill.formationProcessRefOrNull, 'process.vexwork.capture-discovered-work');
  assert.equal(graph.rootWorkRefs.includes(historyBackfill.workRef), true);
  assert.equal(graph.transitions.length, 62);

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
  const routing = graph.items.find((item) => item.workRef === 'work.vexwork.operational-console.multi-fulfiller-routing');
  assert.equal(routing.workClass, 'POTENTIAL');
  assert.equal(routing.state, 'CAPTURED');
  assert.equal(routing.workDisposition, 'PARKED');
  assert.equal(routing.authorityDisposition, 'NO_AUTHORITY');
  assert.equal(routing.effectDisposition, 'NO_EFFECTS');
  assert.equal(routing.formationProcessRefOrNull, 'process.vexwork.capture-discovered-work');
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
  const p0 = graph.items.find((item) => item.workRef === 'work.vexlife.tocompletion.p0.research-closure');
  const p0b = graph.items.find((item) => item.workRef === 'work.vexlife.tocompletion.p0b.foundation');
  const p1 = graph.items.find((item) => item.workRef === 'work.vexlife.tocompletion.p1.heretic-establishment');
  const p2 = graph.items.find((item) => item.workRef === 'work.vexlife.tocompletion.p2.first-lived-turn');
  const p3 = graph.items.find((item) => item.workRef === 'work.vexlife.tocompletion.p3.restart-durability');
  assert.deepEqual([p0.state, p0b.state, p1.state, p2.state, p3.state], ['COMPLETED', 'COMPLETED', 'COMPLETED', 'COMPLETED', 'COMPLETED']);
  assert.deepEqual(p0b.dependencyRefs, ['work.vexlife.tocompletion.p0.research-closure']);
  const p4 = graph.items.find((item) => item.workRef === 'work.vexlife.tocompletion.p4.typed-local-effect');
  assert.equal(p4.state, 'COMPLETED');
  const p4Source = graph.items.find((item) => item.workRef === 'work.vexlife.tocompletion.p4.source-acceptance');
  assert.equal(p4Source.state, 'COMPLETED');
  assert.equal(p4Source.sourceRefs.includes('github.pull.vexlife.916'), true);
  const p4Lived = graph.items.find((item) => item.workRef === 'work.vexlife.tocompletion.p4.lived-reinjection');
  assert.equal(p4Lived.state, 'COMPLETED');
  assert.deepEqual(p4Lived.dependencyRefs, ['work.vexlife.tocompletion.p4.source-acceptance']);
  const p4A053 = graph.items.find((item) => item.workRef === 'work.vexlife.tocompletion.p4.lived-attempt-a053');
  assert.equal(p4A053.state, 'COMPLETED');
  const p4A054 = graph.items.find((item) => item.workRef === 'work.vexlife.tocompletion.p4.runtime-currentness-a054');
  assert.equal(p4A054.state, 'COMPLETED');
  assert.deepEqual(p4A054.dependencyRefs, ['work.vexlife.tocompletion.p4.lived-attempt-a053']);
  const p5 = graph.items.find((item) => item.workRef === 'work.vexlife.tocompletion.p5.lived-continuity-learning');
  assert.equal(p5.state, 'RUNNING');
  assert.deepEqual(p5.dependencyRefs, ['work.vexlife.tocompletion.p4.typed-local-effect']);
  const p5G02 = graph.items.find((item) => item.workRef === 'work.vexlife.tocompletion.p5.g02-semantic-authority-materializer');
  assert.equal(p5G02.state, 'RUNNING');
  assert.deepEqual(p5G02.dependencyRefs, ['work.vexlife.tocompletion.p4.typed-local-effect']);
  const p5Harness = graph.items.find((item) => item.workRef === 'work.vexlife.tocompletion.p5.g02.coder-harness-a055-a056');
  assert.equal(p5Harness.state, 'COMPLETED');
  const p5A057 = graph.items.find((item) => item.workRef === 'work.vexlife.tocompletion.p5.g02.sdk-runner-a057');
  assert.equal(p5A057.state, 'READY');
  assert.deepEqual(p5A057.dependencyRefs, ['work.vexlife.tocompletion.p5.g02.coder-harness-a055-a056']);
  const p6 = graph.items.find((item) => item.workRef === 'work.vexlife.tocompletion.p6.cultivation-training-birth');
  assert.equal(p6.state, 'WAITING_DEPENDENCIES');
  assert.deepEqual(p6.dependencyRefs, ['work.vexlife.tocompletion.p5.lived-continuity-learning']);
  const p7 = graph.items.find((item) => item.workRef === 'work.vexlife.tocompletion.p7.whole-product-expansion');
  assert.equal(p7.state, 'PLAN_VALIDATED');
  assert.deepEqual(p7.dependencyRefs, ['work.vexlife.tocompletion.p4.typed-local-effect']);
  const connectedOutcome = graph.items.find((item) => item.workRef === 'work.vexlife.connected-services.outcome');
  const connectedPhase1 = graph.items.find((item) => item.workRef === 'work.vexlife.connected-services.vcs04.phase1-prechallenge');
  const connectedPhase2 = graph.items.find((item) => item.workRef === 'work.vexlife.connected-services.vcs04.phase2-fixture-l1-l5');
  const connectedPhase3 = graph.items.find((item) => item.workRef === 'work.vexlife.connected-services.vcs04.phase3-fresh-user-family');
  const connectedPhase3Defect = graph.items.find((item) => item.workRef === 'work.vexlife.connected-services.vcs04.phase3.owner-only-family-readability');
  const connectedPhase3Lived = graph.items.find((item) => item.workRef === 'work.vexlife.connected-services.vcs04.phase3.host-to-android-l1-l5');
  assert.equal(connectedOutcome.state, 'RUNNING');
  assert.deepEqual([connectedPhase1.state, connectedPhase2.state, connectedPhase3.state], ['COMPLETED', 'COMPLETED', 'COMPLETED']);
  assert.equal(connectedPhase3Defect.state, 'COMPLETED');
  assert.equal(connectedPhase3Lived.state, 'COMPLETED');
  assert.deepEqual(connectedPhase3Lived.dependencyRefs, [connectedPhase3Defect.workRef]);

  const operationalOutcome = graph.items.find((item) => item.workRef === 'work.vexwork.operational-console.outcome');
  const derivedFoundation = graph.items.find((item) => item.workRef === 'work.vexwork.operational-console.derived-work-foundation');
  const derivedContract = graph.items.find((item) => item.workRef === 'work.vexwork.operational-console.derived-work-contract');
  const derivedProjection = graph.items.find((item) => item.workRef === 'work.vexwork.operational-console.derived-work-projection');
  const derivedPromotion = graph.items.find((item) => item.workRef === 'work.vexwork.operational-console.derived-work-promotion');
  const vexsite = graph.items.find((item) => item.workRef === 'work.vexwork.operational-console.vexsite-dogfood');
  const populationScope = graph.items.find((item) => item.workRef === 'work.vexwork.operational-console.vexsite-population-scope');
  const terrain = graph.items.find((item) => item.workRef === 'work.vexwork.operational-console.relational-terrain');
  const terrainPatient = graph.items.find((item) => item.workRef === 'work.vexwork.operational-console.relational-terrain.patient-zero');
  assert.equal(operationalOutcome.state, 'RUNNING');
  assert.equal(derivedFoundation.state, 'COMPLETED');
  assert.equal(derivedContract.state, 'COMPLETED');
  assert.equal(derivedProjection.state, 'COMPLETED');
  assert.equal(derivedPromotion.state, 'COMPLETED');
  assert.equal(vexsite.state, 'READY');
  assert.equal(populationScope.state, 'READY');
  assert.equal(terrain.state, 'RUNNING');
  assert.equal(terrainPatient.state, 'RUNNING');

});

test('typed transition rejects stale observation and accepts exact current transition', () => {
  const transitionSource = structuredClone(graphSource);
  const transitionRoot = transitionSource.items.find((item) => item.workRef === 'work.vexwork.foundation.outcome');
  transitionRoot.state = 'RUNNING';
  transitionRoot.updatedAt = transitionRoot.createdAt;
  transitionSource.transitions = transitionSource.transitions.filter((transition) => transition.workRef !== transitionRoot.workRef);
  const graph = createWorkgraph(transitionSource, registry);
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
