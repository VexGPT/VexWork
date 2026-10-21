import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { createProject, createWorkgraph } from '../src/core/workgraph.mjs';
import { createBoardView, projectWorkBoard, projectWorkGraph } from '../src/core/work-board.mjs';

const read = (relative) => JSON.parse(fs.readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8'));
const registry = read('blueprint/work-registry.json');
const project = createProject(read('projects/vexwork-foundation/project.json'));
const graph = createWorkgraph(read('projects/vexwork-foundation/workgraph.json'), registry);
const view = createBoardView(read('projects/vexwork-foundation/board.view.json'), registry);

test('Work Board projects every work item without becoming lifecycle authority', () => {
  const board = projectWorkBoard({ project, graph, view, registry });
  const cards = board.lanes.flatMap((lane) => lane.cards);
  assert.equal(cards.length, graph.items.length);
  assert.equal(board.effects, false);
  assert.equal(board.executionAuthority, 'NONE');
  assert.equal(board.graphSemanticFingerprint, graph.semanticFingerprint);
  const intake = board.lanes.find((lane) => lane.laneRef === 'lane.work.intake');
  assert.equal(intake.cards.some((card) => card.workRef === 'work.vexwork.foundation.idea-intake'), true);
  const verify = board.lanes.find((lane) => lane.laneRef === 'lane.work.verify');
  assert.equal(verify.cards.length, 3);
});

test('Graph projection preserves containment, dependencies and repository relations', () => {
  const projection = projectWorkGraph({ project, graph });
  assert.equal(projection.nodes.length, graph.items.length);
  assert.equal(projection.edges.some((edge) => edge.kind === 'DEPENDS_ON'), true);
  assert.equal(projection.edges.some((edge) => edge.kind === 'TOUCHES_REPOSITORY' && edge.to === 'repo.vexlife-android'), true);
  assert.equal(projection.effects, false);
});
