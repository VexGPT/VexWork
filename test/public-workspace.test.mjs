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
  assert.equal(p5.state, 'RUNNING');
  assert.equal(p5G02.state, 'RUNNING');
  assert.deepEqual(p5.childWorkRefs, ['work.vexlife.tocompletion.p5.g02-semantic-authority-materializer']);
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

test('public workspace keeps global Parking Lot separate from Project membership', () => {
  const workspace = buildWorkspace();
  assert.equal(workspace.parkingLot.items.every((item) => item.workDisposition === 'PARKED'), true);
  assert.equal(workspace.parkingLot.items.every((item) => item.authorityDisposition === 'NO_AUTHORITY'), true);
  assert.equal(workspace.parkingLot.items.some((item) => item.workRef === 'work.vexstream.mobile-library.keep-offline-sync'), true);
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
  assert.deepEqual([phase1.state, phase2.state, phase3.state], ['COMPLETED', 'COMPLETED', 'RUNNING']);
  assert.equal(defect.state, 'COMPLETED');
  assert.equal(lived.state, 'READY');
  assert.deepEqual(lived.dependencyRefs, [defect.workRef]);
  assert.equal(connected.lanes.find((lane) => lane.laneRef === 'lane.work.ready').workRefs.includes(lived.workRef), true);
  assert.equal(connected.items.some((item) => item.workRef === 'work.vexlife.connected-services.guided-onboarding'), false);
  assert.equal(workspace.parkingLot.items.some((item) => item.workRef === 'work.vexlife.connected-services.guided-onboarding'), true);
});
