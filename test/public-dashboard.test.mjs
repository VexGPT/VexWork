import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { projectPublicWorkDashboard } from '../src/core/public-dashboard.mjs';
import { createProject, createWorkgraph } from '../src/core/workgraph.mjs';
import { createBoardView, projectParkingLot, projectWorkBoard } from '../src/core/work-board.mjs';

const read = (relative) => JSON.parse(fs.readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8'));
const registry = read('blueprint/work-registry.json');
const project = createProject(read('projects/vexwork-foundation/project.json'));
const graph = createWorkgraph(read('projects/vexwork-foundation/workgraph.json'), registry);
const view = createBoardView(read('projects/vexwork-foundation/board.view.json'), registry);
const board = projectWorkBoard({ project, graph, view, registry });
const parkingLot = projectParkingLot({ graph, registry });

test('public dashboard is a read-only composition of Board and Parking Lot truth', () => {
  const dashboard = projectPublicWorkDashboard({ project, board, parkingLot });
  const cards = dashboard.lanes.flatMap((lane) => lane.cards);

  assert.equal(dashboard.schemaVersion, 'vexwork.public-work-dashboard/v1');
  assert.equal(dashboard.project.projectRef, project.projectRef);
  assert.equal(dashboard.graphRef, graph.graphRef);
  assert.equal(dashboard.summary.projectWorkItemCount, 6);
  assert.equal(dashboard.summary.activeProjectWorkItemCount, 2);
  assert.equal(dashboard.summary.parkingLotItemCount, 1);
  assert.equal(cards.some((card) => card.workRef === 'work.vexlife-android.vexstream.not-yet-downloaded-filter'), false);
  assert.equal(dashboard.parkingLot.items.some((item) => item.workRef === 'work.vexlife-android.vexstream.not-yet-downloaded-filter'), true);
  assert.equal(dashboard.effects, false);
  assert.equal(dashboard.executionAuthority, 'NONE');
});

test('checked-in public dashboard exactly matches the canonical projection', () => {
  const dashboard = projectPublicWorkDashboard({ project, board, parkingLot });
  assert.deepEqual(read('public/work-dashboard.json'), dashboard);
});
