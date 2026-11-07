import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { createProject, createWorkgraph, projectWorkRefs } from '../src/core/workgraph.mjs';
import { createBoardView, projectWorkBoard } from '../src/core/work-board.mjs';

const read = (relative) => JSON.parse(fs.readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8'));
const registry = read('blueprint/work-registry.json');
const graph = createWorkgraph(read('workgraphs/public.json'), registry);
const project = createProject(read('projects/vexlife-android-current-state-refinement/project.json'));
const view = createBoardView(read('projects/vexlife-android-current-state-refinement/board.view.json'), registry);

test('current-state refinement groups review work without stealing VexStream defect ownership', () => {
  const refs = projectWorkRefs(project, graph);
  assert.equal(refs.length, 10);
  assert.equal(refs.includes('work.vexlife-android.current-state-refinement.outcome'), true);
  assert.equal(refs.includes('work.vexstream.mobile-library.large-offline-startup-performance'), false);

  const root = graph.items.find((item) => item.workRef === 'work.vexlife-android.current-state-refinement.outcome');
  const audit = graph.items.find((item) => item.workRef === 'work.vexlife-android.current-state-refinement.scalability-scae-audit');
  const lists = graph.items.find((item) => item.workRef === 'work.vexlife-android.current-state-refinement.dynamic-collections');
  const maps = graph.items.find((item) => item.workRef === 'work.vexlife-android.current-state-refinement.vexmaps-discovery-navigation');
  const conversation = graph.items.find((item) => item.workRef === 'work.vexlife-android.current-state-refinement.conversation-growth');
  const diagnostics = graph.items.find((item) => item.workRef === 'work.vexlife-android.current-state-refinement.performance-debugging');
  const convergence = graph.items.find((item) => item.workRef === 'work.vexlife-android.current-state-refinement.semantic-family-convergence');
  const mapsMode = graph.items.find((item) => item.workRef === 'work.vexlife-android.current-state-refinement.semantic-family-convergence.maps-mode');
  const repeat = graph.items.find((item) => item.workRef === 'work.vexlife-android.current-state-refinement.semantic-family-convergence.repeat');
  const hubPartner = graph.items.find((item) => item.workRef === 'work.vexlife-android.current-state-refinement.semantic-family-convergence.vexstream-hub-partner');

  assert.deepEqual([root.state, audit.state], ['RUNNING', 'RUNNING']);
  assert.deepEqual([lists.state, maps.state, conversation.state, diagnostics.state], ['READY', 'READY', 'READY', 'READY']);
  assert.deepEqual([convergence.state, mapsMode.state, repeat.state, hubPartner.state], ['RUNNING', 'RUNNING', 'RUNNING', 'RUNNING']);
  assert.equal(mapsMode.parentWorkRefOrNull, convergence.workRef);
  assert.equal(repeat.parentWorkRefOrNull, convergence.workRef);
  assert.equal(hubPartner.parentWorkRefOrNull, convergence.workRef);
  assert.equal(convergence.sourceRefs.includes('github.pull.vexlife-android.220'), true);
  assert.equal(mapsMode.sourceRefs.includes('github.pull.vexlife-android.220'), true);
  assert.equal(repeat.sourceRefs.includes('github.pull.vexlife-android.221'), true);
  assert.equal(hubPartner.sourceRefs.includes('github.pull.vexlife-android.223'), true);
  assert.equal(hubPartner.dependencyRefs.includes('github.pull.vexlife-android.219'), true);
  assert.equal(audit.sourceRefs.includes('github.issue.vexlife-android.168'), true);
  assert.equal(audit.sourceRefs.includes('work.vexstream.mobile-library.large-offline-startup-performance'), true);
  assert.equal(maps.sourceRefs.some((ref) => ref.endsWith('VexMapsDestinationSearchSession.kt')), true);
  assert.equal(conversation.sourceRefs.some((ref) => ref.endsWith('VexConversationState.kt')), true);
  assert.equal(diagnostics.sourceRefs.includes('repo.vexlife-android:docs/foundation/ANDROID-HOST-PROOF.md'), true);

  const board = projectWorkBoard({ project, graph, view, registry });
  assert.equal(board.lanes.find((lane) => lane.laneRef === 'lane.work.active').cards.length, 6);
  assert.equal(board.lanes.find((lane) => lane.laneRef === 'lane.work.ready').cards.length, 4);
  assert.equal(board.lanes.flatMap((lane) => lane.cards).every((card) => card.effectDisposition === 'NO_EFFECTS'), true);
});
