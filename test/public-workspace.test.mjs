import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { validateProjectRegistry } from '../src/core/project-registry.mjs';
import { projectPublicWorkspace } from '../src/core/public-workspace.mjs';
import { createProject, createWorkgraph } from '../src/core/workgraph.mjs';
import { createBoardView, projectParkingLot, projectWorkBoard } from '../src/core/work-board.mjs';

const read = (relative) => JSON.parse(fs.readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8'));
const registry = read('blueprint/work-registry.json');
const projectRegistry = read('blueprint/project-registry.json');

function buildWorkspace() {
  assert.equal(validateProjectRegistry(projectRegistry).ok, true);
  const graphCache = new Map();
  const projectEntries = projectRegistry.projects.map((entry) => {
    let graph = graphCache.get(entry.workgraphPath);
    if (!graph) {
      graph = createWorkgraph(read(entry.workgraphPath), registry);
      graphCache.set(entry.workgraphPath, graph);
    }
    const project = createProject(read(entry.definitionPath));
    const view = createBoardView(read(entry.boardViewPath), registry);
    const board = projectWorkBoard({ project, graph, view, registry });
    return { project, board, graph };
  });
  const parkingLots = [...graphCache.values()].map((graph) => ({ graph, parkingLot: projectParkingLot({ graph, registry }) }));
  return projectPublicWorkspace({ projectRegistry, projectEntries, parkingLots });
}

test('public workspace projects every registered Project without becoming a work-state owner', () => {
  const workspace = buildWorkspace();
  assert.equal(workspace.schemaVersion, 'vexwork.public-workspace/v1');
  assert.deepEqual(workspace.projects.map((entry) => entry.project.projectRef), projectRegistry.projects.map((entry) => entry.projectRef));
  assert.equal(workspace.effects, false);
  assert.equal(workspace.executionAuthority, 'NONE');
});

test('public workspace preserves recursive containment and Jira-like detail fields', () => {
  const workspace = buildWorkspace();
  const project = workspace.projects.find((entry) => entry.project.projectRef === 'project.vexlife.tocompletion');
  assert.ok(project);
  const p4 = project.items.find((item) => item.workRef === 'work.vexlife.tocompletion.p4.typed-local-effect');
  assert.ok(p4);
  assert.equal(p4.workClass, 'OUTCOME');
  assert.deepEqual(p4.childWorkRefs.sort(), [
    'work.vexlife.tocompletion.p4.lived-attempt-a053',
    'work.vexlife.tocompletion.p4.lived-reinjection',
    'work.vexlife.tocompletion.p4.runtime-currentness-a054',
    'work.vexlife.tocompletion.p4.source-acceptance',
  ]);
  const source = project.items.find((item) => item.workRef === 'work.vexlife.tocompletion.p4.source-acceptance');
  const canonical = read('workgraphs/public.json').items.find((item) => item.workRef === source.workRef);
  assert.equal(source.parentWorkRefOrNull, p4.workRef);
  assert.equal(source.state, canonical.state);
  assert.equal(source.updatedAt, canonical.updatedAt);
  assert.ok(Array.isArray(source.sourceRefs) && source.sourceRefs.length > 0);
  assert.ok(Array.isArray(source.transitionHistory));
  const p5 = project.items.find((item) => item.workRef === 'work.vexlife.tocompletion.p5.lived-continuity-learning');
  const p5G02 = project.items.find((item) => item.workRef === 'work.vexlife.tocompletion.p5.g02-semantic-authority-materializer');
  const p5G03 = project.items.find((item) => item.workRef === 'work.vexlife.tocompletion.p5.g03.daily-memory-dream');
  assert.equal(p5.state, 'PAUSED_AT_CHECKPOINT');
  assert.equal(p5G02.state, 'COMPLETED');
  assert.equal(p5G03.state, 'COMPLETED');
  assert.deepEqual(p5.childWorkRefs, [
    'work.vexlife.tocompletion.p5.g02-semantic-authority-materializer',
    'work.vexlife.tocompletion.p5.g03.daily-memory-dream',
  ]);
  const productization = project.items.find((item) => item.workRef === 'work.vexlife.tocompletion.productization.ordinary-heretic-setup');
  const setupConvergence = project.items.find((item) => item.workRef === 'work.vexlife.tocompletion.productization.setup-safety-convergence');
  const hereticIntegration = project.items.find((item) => item.workRef === 'work.vexlife.tocompletion.productization.heretic-normal-start-integration');
  assert.equal(productization.state, 'RUNNING');
  assert.equal(setupConvergence.state, 'COMPLETED');
  assert.equal(hereticIntegration.state, 'RUNNING');
  assert.equal(project.lanes.find((lane) => lane.laneRef === 'lane.work.done').workRefs.includes(setupConvergence.workRef), true);
  assert.equal(project.lanes.find((lane) => lane.laneRef === 'lane.work.active').workRefs.includes(hereticIntegration.workRef), true);
  assert.equal(project.lanes.find((lane) => lane.laneRef === 'lane.work.planned').workRefs.includes(hereticIntegration.workRef), false);
  const p6 = project.items.find((item) => item.workRef === 'work.vexlife.tocompletion.p6.cultivation-training-birth');
  const p7 = project.items.find((item) => item.workRef === 'work.vexlife.tocompletion.p7.whole-product-expansion');
  assert.equal(p6.state, 'WAITING_DEPENDENCIES');
  assert.equal(p7.state, 'PLAN_VALIDATED');
  assert.deepEqual(p6.childWorkRefs, []);
  assert.deepEqual(p7.childWorkRefs, []);
});

test('public workspace board lanes reference the same canonical projected items', () => {
  const workspace = buildWorkspace();
  for (const project of workspace.projects) {
    const known = new Set(project.items.map((item) => item.workRef));
    for (const lane of project.lanes) assert.equal(lane.workRefs.every((workRef) => known.has(workRef)), true);
  }
});

test('Foundation Project is terminal while optional history remains globally parked', () => {
  const workspace = buildWorkspace();
  const foundation = workspace.projects.find((entry) => entry.project.projectRef === 'project.vexwork.foundation');
  assert.ok(foundation);
  assert.equal(foundation.summary.workItemCount, 8);
  assert.equal(foundation.summary.openWorkItemCount, 0);
  assert.equal(foundation.summary.completedCount, 8);
  assert.equal(foundation.items.find((item) => item.workRef === 'work.vexwork.foundation.outcome').state, 'COMPLETED');
  assert.equal(foundation.items.find((item) => item.workRef === 'work.vexwork.foundation.maturity-closure').state, 'COMPLETED');
  assert.equal(foundation.lanes.find((lane) => lane.laneRef === 'lane.work.done').workRefs.includes('work.vexwork.foundation.maturity-closure'), true);
  assert.equal(foundation.items.find((item) => item.workRef === 'work.vexwork.foundation.idea-intake').state, 'CANCELLED');
  assert.equal(foundation.items.some((item) => item.workRef === 'work.vexwork.history.foundational-infrastructure-backfill'), false);
  assert.equal(foundation.lanes.find((lane) => lane.laneRef === 'lane.work.archive').workRefs.includes('work.vexwork.foundation.idea-intake'), true);
  assert.equal(workspace.parkingLot.items.some((item) => item.workRef === 'work.vexwork.operational-console.multi-fulfiller-routing'), true);
  assert.equal(workspace.parkingLot.items.some((item) => item.workRef === 'work.vexwork.history.foundational-infrastructure-backfill'), true);
});

test('public workspace keeps global Parking Lot separate from Project membership', () => {
  const workspace = buildWorkspace();
  assert.equal(workspace.parkingLot.items.every((item) => item.workDisposition === 'PARKED'), true);
  assert.equal(workspace.parkingLot.items.every((item) => item.authorityDisposition === 'NO_AUTHORITY'), true);
  assert.equal(workspace.parkingLot.items.some((item) => item.workRef === 'work.vexstream.mobile-library.keep-offline-sync'), true);
  assert.equal(workspace.parkingLot.items.some((item) => item.workRef === 'work.vextreme.vexsite.localization.closed-circuit.global-core'), true);
});

test('checked-in public workspace is generated-current', () => {
  assert.deepEqual(read('public/workspace.json'), buildWorkspace());
});

// [VXG RealForever]


test('Connected Services is discoverable as a real Project with the current lived edge in Ready', () => {
  const workspace = buildWorkspace();
  const connected = workspace.projects.find((entry) => entry.project.projectRef === 'project.vexlife.connected-services');
  assert.ok(connected);
  assert.equal(connected.summary.workItemCount, 19);
  const phase1 = connected.items.find((item) => item.workRef === 'work.vexlife.connected-services.vcs04.phase1-prechallenge');
  const phase2 = connected.items.find((item) => item.workRef === 'work.vexlife.connected-services.vcs04.phase2-fixture-l1-l5');
  const phase3 = connected.items.find((item) => item.workRef === 'work.vexlife.connected-services.vcs04.phase3-fresh-user-family');
  const defect = connected.items.find((item) => item.workRef === 'work.vexlife.connected-services.vcs04.phase3.owner-only-family-readability');
  const lived = connected.items.find((item) => item.workRef === 'work.vexlife.connected-services.vcs04.phase3.host-to-android-l1-l5');
  const phase4 = connected.items.find((item) => item.workRef === 'work.vexlife.connected-services.vcs04.phase4-send-companion');
  assert.deepEqual([phase1.state, phase2.state, phase3.state], ['COMPLETED', 'COMPLETED', 'COMPLETED']);
  assert.equal(defect.state, 'COMPLETED');
  assert.equal(lived.state, 'COMPLETED');
  assert.deepEqual(lived.dependencyRefs, [defect.workRef]);
  assert.equal(phase4.state, 'READY');
  assert.equal(connected.lanes.find((lane) => lane.laneRef === 'lane.work.ready').workRefs.includes(phase4.workRef), true);
  assert.equal(connected.items.some((item) => item.workRef === 'work.vexlife.connected-services.guided-onboarding'), false);
  assert.equal(workspace.parkingLot.items.some((item) => item.workRef === 'work.vexlife.connected-services.guided-onboarding'), true);
});

test('VexBoard projects completed navigation foundations with Source Projectors active and BoardPatch still ready', () => {
  const workspace = buildWorkspace();
  const vexboard = workspace.projects.find((entry) => entry.project.projectRef === 'project.vexboard');
  assert.ok(vexboard);
  assert.equal(vexboard.summary.workItemCount, 7);
  assert.equal(vexboard.summary.openWorkItemCount, 3);
  assert.equal(vexboard.summary.completedCount, 4);
  assert.equal(vexboard.items.find((item) => item.workRef === 'work.vexboard.project-architecture').state, 'COMPLETED');
  const boardgraph = vexboard.items.find((item) => item.workRef === 'work.vexboard.boardgraph-contract');
  const canvas = vexboard.items.find((item) => item.workRef === 'work.vexboard.canvas-projection');
  const journey = vexboard.items.find((item) => item.workRef === 'work.vexboard.boardjourney-simulation');
  const boardpatch = vexboard.items.find((item) => item.workRef === 'work.vexboard.boardpatch-authoring');
  const projectors = vexboard.items.find((item) => item.workRef === 'work.vexboard.source-projectors');
  assert.deepEqual([boardgraph.state, canvas.state, journey.state], ['COMPLETED', 'COMPLETED', 'COMPLETED']);
  assert.equal(canvas.authorityDisposition, 'AUTHORIZED_BOUNDED');
  assert.equal(canvas.effectDisposition, 'EFFECTS_BOUND');
  assert.equal(journey.authorityDisposition, 'AUTHORIZED_BOUNDED');
  assert.equal(journey.effectDisposition, 'EFFECTS_BOUND');
  assert.deepEqual([boardpatch.state, projectors.state], ['READY', 'RUNNING']);
  assert.deepEqual([boardpatch.authorityDisposition, projectors.authorityDisposition], ['NO_AUTHORITY', 'AUTHORIZED_BOUNDED']);
  assert.deepEqual([boardpatch.effectDisposition, projectors.effectDisposition], ['NO_EFFECTS', 'EFFECTS_BOUND']);
  assert.equal(projectors.sourceRefs.includes('github.pull.vexwork.108'), true);
  assert.equal(projectors.sourceRefs.includes('src/core/vexboard-source-projectors.mjs'), true);
  assert.equal(vexboard.lanes.find((lane) => lane.laneRef === 'lane.work.done').workRefs.includes(canvas.workRef), true);
  assert.equal(vexboard.lanes.find((lane) => lane.laneRef === 'lane.work.done').workRefs.includes(journey.workRef), true);
  assert.equal(vexboard.lanes.find((lane) => lane.laneRef === 'lane.work.ready').workRefs.includes(boardpatch.workRef), true);
  assert.equal(vexboard.lanes.find((lane) => lane.laneRef === 'lane.work.active').workRefs.includes(projectors.workRef), true);
  assert.equal(vexboard.lanes.find((lane) => lane.laneRef === 'lane.work.ready').workRefs.includes(projectors.workRef), false);
  assert.equal(vexboard.project.sourceRefs.includes('projects/vexboard/README.md'), true);
});

// [VXG RealForever]


test('Vex Universe Foundations exposes this trajectory and keeps the VexBoard refactor seam explicit', () => {
  const workspace = buildWorkspace();
  const universe = workspace.projects.find((entry) => entry.project.projectRef === 'project.vex-universe');
  assert.ok(universe);
  assert.equal(universe.summary.workItemCount, 6);
  assert.equal(universe.summary.openWorkItemCount, 5);
  assert.equal(universe.summary.completedCount, 1);
  assert.equal(universe.items.find((item) => item.workRef === 'work.vex-universe.outcome').state, 'RUNNING');
  assert.equal(universe.items.find((item) => item.workRef === 'work.vex-universe.visible-work-record').state, 'COMPLETED');
  assert.equal(universe.items.find((item) => item.workRef === 'work.vex-universe.process-board-addressability').state, 'VERIFYING');
  assert.equal(universe.items.find((item) => item.workRef === 'work.vex-universe.businessfactory-convergence').state, 'WAITING_RESOURCE');
  assert.equal(universe.items.find((item) => item.workRef === 'work.vex-universe.vexboard-contract-alignment').state, 'WAITING_RESOURCE');
  assert.equal(universe.items.find((item) => item.workRef === 'work.vex-universe.journey-evidence-patient-zero').state, 'WAITING_DEPENDENCIES');
  assert.equal(universe.lanes.find((lane) => lane.laneRef === 'lane.work.verify').workRefs.includes('work.vex-universe.process-board-addressability'), true);
  assert.equal(universe.lanes.find((lane) => lane.laneRef === 'lane.work.done').workRefs.includes('work.vex-universe.visible-work-record'), true);
  assert.equal(universe.lanes.find((lane) => lane.laneRef === 'lane.work.waiting').workRefs.includes('work.vex-universe.vexboard-contract-alignment'), true);
  assert.equal(universe.lanes.find((lane) => lane.laneRef === 'lane.work.planned').workRefs.includes('work.vex-universe.journey-evidence-patient-zero'), true);
});

test('Blueprint SOT is durably paused without active effects while preserving its exact resume edge', () => {
  const workspace = buildWorkspace();
  const blueprint = workspace.projects.find((entry) => entry.project.projectRef === 'project.vexlife.blueprint-source-of-truth');
  assert.ok(blueprint);
  assert.equal(blueprint.summary.workItemCount, 14);
  assert.equal(blueprint.summary.completedCount, 8);
  assert.equal(blueprint.summary.openWorkItemCount, 6);
  const root = blueprint.items.find((item) => item.workRef === 'work.vexlife.blueprint-source-of-truth.outcome');
  const practicum = blueprint.items.find((item) => item.workRef === 'work.vexlife.blueprint-source-of-truth.play-pause-practicum');
  const nativeSource = blueprint.items.find((item) => item.workRef === 'work.vexlife.blueprint-source-of-truth.play-pause.native-source-admission');
  assert.equal(root.state, 'PAUSED_AT_CHECKPOINT');
  assert.equal(root.effectDisposition, 'NO_EFFECTS');
  assert.equal(practicum.state, 'PAUSED_AT_CHECKPOINT');
  assert.equal(practicum.effectDisposition, 'NO_EFFECTS');
  assert.equal(nativeSource.state, 'WAITING_RESOURCE');
  assert.equal(nativeSource.effectDisposition, 'NO_EFFECTS');
  assert.equal(blueprint.lanes.find((lane) => lane.laneRef === 'lane.work.waiting').workRefs.includes(root.workRef), true);
  assert.equal(blueprint.lanes.find((lane) => lane.laneRef === 'lane.work.waiting').workRefs.includes(nativeSource.workRef), true);
});
