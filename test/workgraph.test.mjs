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
const vexboardProjectSource = read('projects/vexboard/project.json');
const blueprintProjectSource = read('projects/vexlife-blueprint-source-of-truth/project.json');
const androidProofProjectSource = read('projects/android-proof-orchestration/project.json');
const vexsyncDebugMenuProjectSource = read('projects/vexsync-debugmenu-blueprints/project.json');
const graphSource = read('workgraphs/public.json');

test('work registry covers lifecycle states exactly once on the default Work Board', () => {
  const result = validateRegistry(registry);
  assert.equal(result.ok, true, result.errors.join('\n'));
});

test('one Workgraph can contain project work and unprojected parked work', () => {
  const project = createProject(projectSource);
  const graph = createWorkgraph(graphSource, registry);
  assert.equal(graph.items.length, graphSource.items.length);
  assert.equal(graph.transitions.length, graphSource.transitions.length);
  assert.equal(projectWorkRefs(project, graph).length, 8);
  const toCompletionProject = createProject(toCompletionProjectSource);
  assert.equal(projectWorkRefs(toCompletionProject, graph).length, 21);
  const connectedServicesProject = createProject(connectedServicesProjectSource);
  assert.equal(projectWorkRefs(connectedServicesProject, graph).length, 21);
  const operationalConsoleProject = createProject(operationalConsoleProjectSource);
  assert.equal(projectWorkRefs(operationalConsoleProject, graph).length, 24);
  const vexboardProject = createProject(vexboardProjectSource);
  assert.equal(projectWorkRefs(vexboardProject, graph).length, 11);
  const blueprintProject = createProject(blueprintProjectSource);
  assert.equal(projectWorkRefs(blueprintProject, graph).length, 14);
  const androidProofProject = createProject(androidProofProjectSource);
  assert.equal(projectWorkRefs(androidProofProject, graph).length, 4);
  const vexsyncDebugMenuProject = createProject(vexsyncDebugMenuProjectSource);
  assert.equal(projectWorkRefs(vexsyncDebugMenuProject, graph).length, 3);
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
  const maturityClosure = graph.items.find((item) => item.workRef === 'work.vexwork.foundation.maturity-closure');
  assert.equal(maturityClosure.state, 'COMPLETED');
  assert.equal(maturityClosure.parentWorkRefOrNull, 'work.vexwork.foundation.outcome');
  assert.equal(maturityClosure.sourceRefs.includes('github.pull.vexwork.59'), true);
  const ideaIntake = graph.items.find((item) => item.workRef === 'work.vexwork.foundation.idea-intake');
  assert.equal(ideaIntake.state, 'CANCELLED');
  assert.equal(ideaIntake.authorityDisposition, 'NO_AUTHORITY');
  assert.equal(ideaIntake.effectDisposition, 'NO_EFFECTS');
  const closedCircuit = graph.items.find((item) => item.workRef === 'work.vextreme.vexsite.localization.closed-circuit.global-core');
  assert.equal(closedCircuit.state, 'COMPLETED');
  assert.equal(closedCircuit.workDisposition, 'ACTIVE');
  assert.equal(closedCircuit.parentWorkRefOrNull, 'work.vextreme.vexsite.localization.outcome');
  assert.equal(closedCircuit.authorityDisposition, 'NO_AUTHORITY');
  assert.equal(graph.rootWorkRefs.includes(closedCircuit.workRef), false);
  assert.equal(graph.rootWorkRefs.includes('work.vextreme.vexsite.localization.outcome'), true);
  const historyBackfill = graph.items.find((item) => item.workRef === 'work.vexwork.history.foundational-infrastructure-backfill');
  assert.equal(historyBackfill.state, 'CAPTURED');
  assert.equal(historyBackfill.parentWorkRefOrNull, null);
  assert.equal(historyBackfill.workDisposition, 'PARKED');
  assert.equal(historyBackfill.authorityDisposition, 'NO_AUTHORITY');
  assert.equal(historyBackfill.effectDisposition, 'NO_EFFECTS');
  assert.equal(historyBackfill.formationProcessRefOrNull, 'process.vexwork.capture-discovered-work');
  assert.equal(graph.rootWorkRefs.includes(historyBackfill.workRef), true);
  assert.ok(graph.transitions.some((transition) => transition.transitionRef === 'transition.vexstream.mobile-library.device-storage.decomposed.20261022'));
  assert.ok(graph.transitions.some((transition) => transition.transitionRef === 'transition.vexstream.mobile-library.device-storage.plan-validated.20261022'));
  assert.ok(graph.transitions.some((transition) => transition.transitionRef === 'transition.vexstream.mobile-library.device-storage.ready.20261022'));
  assert.ok(graph.transitions.some((transition) => transition.transitionRef === 'transition.vexstream.mobile-library.device-storage.running.20261022'));
  const storageWait = graph.transitions.find(
    (transition) =>
      transition.transitionRef ===
      'transition.vexstream.mobile-library.device-storage.waiting-tool.android-proof-orchestration.20261022',
  );
  assert.ok(storageWait);
  assert.equal(storageWait.priorState, 'RUNNING');
  assert.equal(storageWait.nextState, 'WAITING_TOOL');

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
  const vexboardRoot = graph.items.find((item) => item.workRef === 'work.vexboard.outcome');
  const vexboardArchitecture = graph.items.find((item) => item.workRef === 'work.vexboard.project-architecture');
  const vexboardContract = graph.items.find((item) => item.workRef === 'work.vexboard.boardgraph-contract');
  const vexboardCanvas = graph.items.find((item) => item.workRef === 'work.vexboard.canvas-projection');
  const vexboardJourney = graph.items.find((item) => item.workRef === 'work.vexboard.boardjourney-simulation');
  const vexboardBoardPatch = graph.items.find((item) => item.workRef === 'work.vexboard.boardpatch-authoring');
  const vexboardProjectors = graph.items.find((item) => item.workRef === 'work.vexboard.source-projectors');
  const vexboardRefinement = graph.items.find((item) => item.workRef === 'work.vexboard.usability-refinement');
  const vexboardComposition = graph.items.find((item) => item.workRef === 'work.vexboard.fractal-semantic-composition-spatial-layout');
  assert.equal(vexboardRoot.state, 'DECOMPOSED');
  assert.equal(vexboardArchitecture.state, 'COMPLETED');
  assert.equal(vexboardContract.state, 'COMPLETED');
  assert.equal(vexboardContract.authorityDisposition, 'AUTHORIZED_BOUNDED');
  assert.equal(vexboardContract.effectDisposition, 'EFFECTS_BOUND');
  assert.ok(graph.transitions.some((transition) => transition.transitionRef === 'transition.vexboard.boardgraph-contract.running.20261023a'));
  assert.ok(graph.transitions.some((transition) => transition.transitionRef === 'transition.vexboard.boardgraph-contract.verifying.pr66-terminal'));
  assert.ok(graph.transitions.some((transition) => transition.transitionRef === 'transition.vexboard.boardgraph-contract.completed.pr66-terminal'));
  assert.equal(vexboardCanvas.state, 'COMPLETED');
  assert.deepEqual(vexboardCanvas.dependencyRefs, [vexboardContract.workRef]);
  assert.equal(vexboardCanvas.authorityDisposition, 'AUTHORIZED_BOUNDED');
  assert.equal(vexboardCanvas.effectDisposition, 'EFFECTS_BOUND');
  assert.ok(graph.transitions.some((transition) => transition.transitionRef === 'transition.vexboard.canvas-projection.completed.pr88-terminal'));
  assert.equal(vexboardJourney.state, 'COMPLETED');
  assert.equal(vexboardJourney.authorityDisposition, 'AUTHORIZED_BOUNDED');
  assert.equal(vexboardJourney.effectDisposition, 'EFFECTS_BOUND');
  assert.ok(graph.transitions.some((transition) => transition.transitionRef === 'transition.vexboard.boardjourney-simulation.completed.pr95-terminal'));
  assert.equal(vexboardBoardPatch.state, 'READY');
  assert.equal(vexboardBoardPatch.authorityDisposition, 'NO_AUTHORITY');
  assert.equal(vexboardBoardPatch.effectDisposition, 'NO_EFFECTS');
  assert.equal(vexboardProjectors.state, 'RUNNING');
  assert.equal(vexboardProjectors.authorityDisposition, 'AUTHORIZED_BOUNDED');
  assert.equal(vexboardProjectors.effectDisposition, 'EFFECTS_BOUND');
  assert.equal(vexboardProjectors.sourceRefs.includes('github.pull.vexwork.108'), true);
  assert.equal(vexboardProjectors.sourceRefs.includes('src/core/vexboard-source-projectors.mjs'), true);
  assert.equal(vexboardProjectors.sourceRefs.includes('github.pull.vexwork.110'), true);
  assert.equal(vexboardProjectors.sourceRefs.includes('src/shared/vexboard-evidence.mjs'), true);
  assert.equal(vexboardProjectors.sourceRefs.includes('github.pull.vexwork.115'), true);
  assert.equal(vexboardProjectors.sourceRefs.includes('src/shared/vexboard-source-resolver.mjs'), true);
  assert.ok(graph.transitions.some((transition) => transition.transitionRef === 'transition.vexboard.source-projectors.running.pr108'));
  assert.equal(vexboardRefinement.state, 'COMPLETED');
  assert.ok(graph.transitions.some((transition) => transition.transitionRef === 'transition.vexboard.usability-refinement.completed.lived-acceptance-pr135'));
  assert.equal(vexboardComposition.state, 'RUNNING');
  assert.equal(vexboardComposition.authorityDisposition, 'AUTHORIZED_BOUNDED');
  assert.equal(vexboardComposition.effectDisposition, 'EFFECTS_BOUND');
  assert.equal(vexboardComposition.sourceRefs.includes('projects/vexboard/FRACTAL-SEMANTIC-COMPOSITION-AND-SPATIAL-LAYOUT.md'), true);
  assert.ok(graph.transitions.some((transition) => transition.transitionRef === 'transition.vexboard.fractal-semantic-composition-spatial-layout.running.successor-authorization'));
  assert.equal(vexboardContract.sourceRefs.includes('src/shared/vexboard-model.mjs'), true);
  assert.equal(vexboardContract.sourceRefs.includes('vexboard/index.html'), true);
  assert.equal(vexboardContract.sourceRefs.includes('vexboard/self-map.json'), true);

  const blueprintRoot = graph.items.find((item) => item.workRef === 'work.vexlife.blueprint-source-of-truth.outcome');
  const blueprintPracticum = graph.items.find((item) => item.workRef === 'work.vexlife.blueprint-source-of-truth.play-pause-practicum');
  const blueprintNativeSource = graph.items.find((item) => item.workRef === 'work.vexlife.blueprint-source-of-truth.play-pause.native-source-admission');
  const blueprintNativeLived = graph.items.find((item) => item.workRef === 'work.vexlife.blueprint-source-of-truth.play-pause.native-lived-proof');
  const blueprintReusable = graph.items.find((item) => item.workRef === 'work.vexlife.blueprint-source-of-truth.reusable-v1');
  const blueprintTotal = graph.items.find((item) => item.workRef === 'work.vexlife.blueprint-source-of-truth.total-feature-capacity');
  assert.equal(blueprintRoot.state, 'PAUSED_AT_CHECKPOINT');
  assert.equal(blueprintRoot.effectDisposition, 'NO_EFFECTS');
  assert.equal(blueprintPracticum.state, 'PAUSED_AT_CHECKPOINT');
  assert.equal(blueprintPracticum.effectDisposition, 'NO_EFFECTS');
  assert.equal(blueprintNativeSource.state, 'WAITING_RESOURCE');
  assert.equal(blueprintNativeSource.effectDisposition, 'NO_EFFECTS');
  assert.equal(blueprintNativeSource.sourceRefs.includes('github.pull.VexGPT.VexLife-Construction-Reference.12'), true);
  assert.equal(blueprintNativeLived.state, 'WAITING_DEPENDENCIES');
  assert.deepEqual(blueprintNativeLived.dependencyRefs, [blueprintNativeSource.workRef]);
  assert.equal(blueprintReusable.state, 'WAITING_DEPENDENCIES');
  assert.deepEqual(blueprintReusable.dependencyRefs, [blueprintPracticum.workRef]);
  assert.equal(blueprintTotal.state, 'WAITING_DEPENDENCIES');
  assert.deepEqual(blueprintTotal.dependencyRefs, [blueprintReusable.workRef]);

  const mobile = graph.items.find((item) => item.workRef === 'work.vexstream.mobile-library.outcome');
  assert.equal(mobile.workClass, 'OUTCOME');
  assert.equal(mobile.state, 'DECOMPOSED');
  assert.equal(mobile.authorityDisposition, 'AUTHORIZED_BOUNDED');
  const storage = graph.items.find((item) => item.workRef === 'work.vexstream.mobile-library.device-storage');
  assert.equal(storage.state, 'COMPLETED');
  assert.deepEqual(storage.dependencyRefs, []);
  assert.ok(graph.transitions.some((transition) => transition.transitionRef === 'transition.vexstream.mobile-library.device-storage.verifying.a033-a039-terminal'));
  assert.ok(graph.transitions.some((transition) => transition.transitionRef === 'transition.vexstream.mobile-library.device-storage.completed.pr165-terminal'));
  const runner = graph.items.find((item) => item.workRef === 'work.android-proof-orchestration.api-target-runner');
  assert.equal(runner.state, 'READY');
  assert.equal(runner.priorityClass, 'HIGH');
  const lease = graph.items.find((item) => item.workRef === 'work.android-proof-orchestration.device-lease-queue');
  assert.equal(lease.state, 'WAITING_DEPENDENCIES');
  assert.deepEqual(lease.dependencyRefs, [runner.workRef]);
  const massDownload = graph.items.find((item) => item.workRef === 'work.vexstream.mobile-library.massdownload-product');
  assert.equal(massDownload.state, 'COMPLETED');
  const e2e = graph.items.find((item) => item.workRef === 'work.vexstream.mobile-library.massdownload-e2e');
  assert.equal(e2e.state, 'COMPLETED');
  assert.equal(e2e.authorityDisposition, 'AUTHORIZED_BOUNDED');
  const queueIncident = graph.items.find((item) => item.workRef === 'work.vexstream.mobile-library.track-menu-presentation-defect');
  assert.equal(queueIncident.state, 'PAUSED_AT_CHECKPOINT');
  assert.equal(queueIncident.workDisposition, 'ACTIVE');
  assert.equal(queueIncident.parentWorkRefOrNull, 'work.vexstream.mobile-library.massdownload-maturity');
  assert.equal(queueIncident.authorityDisposition, 'AUTHORIZED_BOUNDED');
  assert.equal(queueIncident.effectDisposition, 'NO_EFFECTS');
  const queueCheckpoint = graph.transitions.find((transition) => transition.transitionRef === 'transition.vexstream.mobile-library.track-menu-defect.paused.current-n8-01');
  assert.ok(queueCheckpoint);
  assert.equal(queueCheckpoint.priorState, 'RUNNING');
  assert.equal(queueCheckpoint.nextState, 'PAUSED_AT_CHECKPOINT');
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
  assert.equal(p5.state, 'PAUSED_AT_CHECKPOINT');
  assert.equal(p5.authorityDisposition, 'NO_AUTHORITY');
  assert.equal(p5.effectDisposition, 'NO_EFFECTS');
  assert.deepEqual(p5.dependencyRefs, ['work.vexlife.tocompletion.p4.typed-local-effect']);
  const p5G02 = graph.items.find((item) => item.workRef === 'work.vexlife.tocompletion.p5.g02-semantic-authority-materializer');
  assert.equal(p5G02.state, 'COMPLETED');
  assert.deepEqual(p5G02.dependencyRefs, ['work.vexlife.tocompletion.p4.typed-local-effect']);
  const p5Harness = graph.items.find((item) => item.workRef === 'work.vexlife.tocompletion.p5.g02.coder-harness-a055-a056');
  assert.equal(p5Harness.state, 'COMPLETED');
  const p5A057 = graph.items.find((item) => item.workRef === 'work.vexlife.tocompletion.p5.g02.sdk-runner-a057');
  assert.equal(p5A057.state, 'COMPLETED');
  assert.deepEqual(p5A057.dependencyRefs, ['work.vexlife.tocompletion.p5.g02.coder-harness-a055-a056']);
  const p5G03 = graph.items.find((item) => item.workRef === 'work.vexlife.tocompletion.p5.g03.daily-memory-dream');
  assert.equal(p5G03.state, 'COMPLETED');
  assert.deepEqual(p5G03.dependencyRefs, ['work.vexlife.tocompletion.p5.g02-semantic-authority-materializer']);
  const productization = graph.items.find((item) => item.workRef === 'work.vexlife.tocompletion.productization.ordinary-heretic-setup');
  const setupConvergence = graph.items.find((item) => item.workRef === 'work.vexlife.tocompletion.productization.setup-safety-convergence');
  const hereticIntegration = graph.items.find((item) => item.workRef === 'work.vexlife.tocompletion.productization.heretic-normal-start-integration');
  assert.equal(productization.state, 'RUNNING');
  assert.equal(setupConvergence.state, 'COMPLETED');
  assert.equal(hereticIntegration.state, 'RUNNING');
  assert.deepEqual(hereticIntegration.dependencyRefs, ['work.vexlife.tocompletion.productization.setup-safety-convergence']);
  assert.equal(hereticIntegration.authorityDisposition, 'AUTHORIZED_BOUNDED');
  assert.equal(hereticIntegration.effectDisposition, 'EFFECTS_BOUND');
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
  const connectedVcs04 = graph.items.find((item) => item.workRef === 'work.vexlife.connected-services.vcs04-conversation-adoption');
  const connectedPhase4 = graph.items.find((item) => item.workRef === 'work.vexlife.connected-services.vcs04.phase4-send-companion');
  const connectedPhase5 = graph.items.find((item) => item.workRef === 'work.vexlife.connected-services.vcs04.phase5-restart-no-duplicates');
  const connectedPhase6 = graph.items.find((item) => item.workRef === 'work.vexlife.connected-services.vcs04.phase6-terminal-currentness');
  const connectedVcs05 = graph.items.find((item) => item.workRef === 'work.vexlife.connected-services.vcs05-stream-stress');
  const connectedVcs06 = graph.items.find((item) => item.workRef === 'work.vexlife.connected-services.vcs06-architecture-extraction');
  assert.deepEqual([connectedPhase4.state, connectedPhase5.state, connectedPhase6.state, connectedVcs04.state], ['COMPLETED', 'COMPLETED', 'COMPLETED', 'COMPLETED']);
  assert.equal(connectedVcs05.state, 'COMPLETED');
  assert.equal(connectedVcs06.state, 'READY');
  assert.deepEqual(connectedVcs05.dependencyRefs, [connectedVcs04.workRef]);
  assert.deepEqual(connectedVcs06.dependencyRefs, [connectedVcs05.workRef]);

  const vexsyncOutcome = graph.items.find((item) => item.workRef === 'work.vexsync.debugmenu-blueprints.outcome');
  const vexsyncDiscovery = graph.items.find((item) => item.workRef === 'work.vexsync.debugmenu-blueprints.feature-intention-builder-discovery');
  const vexsyncRoundtrip = graph.items.find((item) => item.workRef === 'work.vexsync.debugmenu-blueprints.debugmenu-origin-roundtrip');
  assert.equal(vexsyncOutcome.state, 'RUNNING');
  assert.equal(vexsyncOutcome.authorityDisposition, 'NO_AUTHORITY');
  assert.equal(vexsyncOutcome.effectDisposition, 'NO_EFFECTS');
  assert.equal(vexsyncDiscovery.state, 'READY');
  assert.equal(vexsyncDiscovery.priorityClass, 'IMMEDIATE');
  assert.equal(vexsyncDiscovery.authorityDisposition, 'NO_AUTHORITY');
  assert.deepEqual(vexsyncDiscovery.dependencyRefs, []);
  assert.equal(vexsyncRoundtrip.state, 'WAITING_DEPENDENCIES');
  assert.deepEqual(vexsyncRoundtrip.dependencyRefs, [vexsyncDiscovery.workRef]);
  assert.equal(graph.items.some((item) => item.workRef === 'work.vexsync.debugmenu-blueprints.android-construction-proof'), false);
  assert.equal(graph.items.some((item) => item.workRef === 'work.vexsync.debugmenu-blueprints.save-apply-pr-loop'), false);

  const vextremeArchitectureOutcome = graph.items.find((item) => item.workRef === 'work.vextreme.architecture-convergence.outcome');
  const vextremeArchitectureOwnerMap = graph.items.find((item) => item.workRef === 'work.vextreme.architecture-convergence.semantic-owner-map');
  const vextremeArchitectureJourneyInspection = graph.items.find((item) => item.workRef === 'work.vextreme.architecture-convergence.terrain-journey-inspection');
  const vextremeArchitectureTerrainReader = graph.items.find((item) => item.workRef === 'work.vextreme.architecture-convergence.terrain-reader-navigation');
  assert.equal(vextremeArchitectureOutcome.state, 'RUNNING');
  assert.equal(vextremeArchitectureOutcome.priorityClass, 'IMMEDIATE');
  assert.equal(vextremeArchitectureOwnerMap.state, 'RUNNING');
  assert.deepEqual(vextremeArchitectureOwnerMap.dependencyRefs, []);
  assert.equal(
    vextremeArchitectureOwnerMap.sourceRefs.includes('work.vexsync.debugmenu-blueprints.feature-intention-builder-discovery'),
    true,
  );
  assert.equal(vextremeArchitectureJourneyInspection.state, 'RUNNING');
  assert.deepEqual(vextremeArchitectureJourneyInspection.dependencyRefs, []);
  assert.equal(vextremeArchitectureJourneyInspection.sourceRefs.includes('repo.vextreme:lib/terrain-journey.js'), true);
  assert.equal(vextremeArchitectureTerrainReader.state, 'VERIFYING');
  assert.deepEqual(vextremeArchitectureTerrainReader.dependencyRefs, []);
  assert.equal(vextremeArchitectureTerrainReader.sourceRefs.includes('github.pull.vextreme.493'), true);
  assert.equal(vextremeArchitectureTerrainReader.sourceRefs.includes('github.commit.vextreme.36ced69ee6719bf05481110a753aee9e989d4885'), true);
  assert.ok(graph.transitions.some((transition) =>
    transition.transitionRef === 'transition.vextreme.architecture-convergence.terrain-reader-navigation.verifying.pr493-merge'
    && transition.priorState === 'RUNNING'
    && transition.nextState === 'VERIFYING'
  ));

  const operationalOutcome = graph.items.find((item) => item.workRef === 'work.vexwork.operational-console.outcome');
  const derivedFoundation = graph.items.find((item) => item.workRef === 'work.vexwork.operational-console.derived-work-foundation');
  const derivedContract = graph.items.find((item) => item.workRef === 'work.vexwork.operational-console.derived-work-contract');
  const derivedProjection = graph.items.find((item) => item.workRef === 'work.vexwork.operational-console.derived-work-projection');
  const derivedPromotion = graph.items.find((item) => item.workRef === 'work.vexwork.operational-console.derived-work-promotion');
  const vexsite = graph.items.find((item) => item.workRef === 'work.vexwork.operational-console.vexsite-dogfood');
  const populationScope = graph.items.find((item) => item.workRef === 'work.vexwork.operational-console.vexsite-population-scope');
  const localizationLens = graph.items.find((item) => item.workRef === 'work.vexwork.operational-console.vexsite-localization-lens');
  const patientZeroProof = graph.items.find((item) => item.workRef === 'work.vexwork.operational-console.vexsite-patient-zero-proof');
  const operatingDomainTemplate = graph.items.find((item) => item.workRef === 'work.vexwork.operational-console.operating-domain-template');
  const operatingDomainContract = graph.items.find((item) => item.workRef === 'work.vexwork.operational-console.operating-domain-contract');
  const attentionQueue = graph.items.find((item) => item.workRef === 'work.vexwork.operational-console.attention-queue-contract');
  const commerceTemplate = graph.items.find((item) => item.workRef === 'work.vexwork.operational-console.commerce-template');
  const commerceItemModel = graph.items.find((item) => item.workRef === 'work.vexwork.operational-console.commerce-item-model');
  const commerceAiSite = graph.items.find((item) => item.workRef === 'work.vexwork.operational-console.commerce-ai-site');
  const commerceFulfillment = graph.items.find((item) => item.workRef === 'work.vexwork.operational-console.commerce-fulfillment-attention');
  const antiquePilot = graph.items.find((item) => item.workRef === 'work.vexwork.operational-console.antique-pilot');
  const antiqueBootstrap = graph.items.find((item) => item.workRef === 'work.vexwork.operational-console.antique-bootstrap');
  const antiqueFirstItem = graph.items.find((item) => item.workRef === 'work.vexwork.operational-console.antique-first-item');
  const terrain = graph.items.find((item) => item.workRef === 'work.vexwork.operational-console.relational-terrain');
  const terrainPatient = graph.items.find((item) => item.workRef === 'work.vexwork.operational-console.relational-terrain.patient-zero');
  assert.equal(operationalOutcome.state, 'RUNNING');
  assert.equal(derivedFoundation.state, 'COMPLETED');
  assert.equal(derivedContract.state, 'COMPLETED');
  assert.equal(derivedProjection.state, 'COMPLETED');
  assert.equal(derivedPromotion.state, 'COMPLETED');
  assert.equal(vexsite.state, 'COMPLETED');
  assert.equal(populationScope.state, 'COMPLETED');
  assert.equal(localizationLens.state, 'COMPLETED');
  assert.equal(patientZeroProof.state, 'COMPLETED');
  assert.equal(operatingDomainTemplate.state, 'COMPLETED');
  assert.equal(operatingDomainContract.state, 'COMPLETED');
  assert.equal(attentionQueue.state, 'COMPLETED');
  assert.equal(commerceTemplate.state, 'COMPLETED');
  assert.equal(commerceItemModel.state, 'COMPLETED');
  assert.equal(commerceAiSite.state, 'COMPLETED');
  assert.equal(commerceFulfillment.state, 'COMPLETED');
  assert.equal(antiquePilot.state, 'RUNNING');
  assert.equal(antiqueBootstrap.state, 'COMPLETED');
  assert.equal(antiqueFirstItem.state, 'READY');
  assert.equal(terrain.state, 'RUNNING');
  assert.equal(terrainPatient.state, 'VERIFYING');

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
