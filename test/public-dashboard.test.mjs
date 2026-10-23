import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { projectPublicWorkDashboard } from '../src/core/public-dashboard.mjs';
import { createProject, createWorkgraph } from '../src/core/workgraph.mjs';
import { createBoardView, projectParkingLot, projectWorkBoard } from '../src/core/work-board.mjs';

const read = (relative) => JSON.parse(fs.readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8'));
const registry = read('blueprint/work-registry.json');
const project = createProject(read('projects/vexwork-foundation/project.json'));
const graph = createWorkgraph(read('workgraphs/public.json'), registry);
const view = createBoardView(read('projects/vexwork-foundation/board.view.json'), registry);
const board = projectWorkBoard({ project, graph, view, registry });
const parkingLot = projectParkingLot({ graph, registry });

test('public dashboard is a read-only composition of Board and Parking Lot truth', () => {
  const dashboard = projectPublicWorkDashboard({ project, board, parkingLot });
  const cards = dashboard.lanes.flatMap((lane) => lane.cards);

  assert.equal(dashboard.schemaVersion, 'vexwork.public-work-dashboard/v1');
  assert.equal(dashboard.project.projectRef, project.projectRef);
  assert.equal(dashboard.graphRef, graph.graphRef);
  assert.equal(dashboard.summary.projectWorkItemCount, 8);
  assert.equal(dashboard.summary.openProjectWorkItemCount, 0);
  assert.equal(dashboard.summary.parkingLotItemCount, 6);
  assert.equal(cards.some((card) => card.workRef === 'work.vexwork.visibility.public-dashboard'), true);
  assert.equal(dashboard.lanes.find((lane) => lane.laneRef === 'lane.work.done').cards.some((card) => card.workRef === 'work.vexwork.visibility.public-dashboard'), true);
  assert.equal(cards.some((card) => card.workRef === 'work.vexwork.history.foundational-infrastructure-backfill'), false);
  assert.equal(cards.some((card) => card.workRef === 'work.vexlife-android.vexstream.not-yet-downloaded-filter'), false);
  assert.equal(dashboard.parkingLot.items.some((item) => item.workRef === 'work.vexlife-android.vexstream.not-yet-downloaded-filter'), true);
  assert.equal(dashboard.parkingLot.items.some((item) => item.workRef === 'work.vexlife.connected-services.guided-onboarding'), true);
  assert.equal(dashboard.parkingLot.items.some((item) => item.workRef === 'work.vexstream.mobile-library.keep-offline-sync'), true);
  assert.equal(dashboard.parkingLot.items.some((item) => item.workRef === 'work.vexwork.operational-console.multi-fulfiller-routing'), true);
  assert.equal(dashboard.parkingLot.items.some((item) => item.workRef === 'work.vexwork.history.foundational-infrastructure-backfill'), true);
  assert.equal(dashboard.parkingLot.items.some((item) => item.workRef === 'work.vextreme.vexsite.localization.closed-circuit.global-core'), true);
  assert.equal(dashboard.lanes.find((lane) => lane.laneRef === 'lane.work.done').cards.some((card) => card.workRef === 'work.vexwork.foundation.outcome'), true);
  assert.equal(dashboard.lanes.find((lane) => lane.laneRef === 'lane.work.done').cards.some((card) => card.workRef === 'work.vexwork.foundation.maturity-closure'), true);
  assert.equal(dashboard.lanes.find((lane) => lane.laneRef === 'lane.work.archive').cards.some((card) => card.workRef === 'work.vexwork.foundation.idea-intake'), true);
  assert.equal(dashboard.effects, false);
  assert.equal(dashboard.executionAuthority, 'NONE');

  const forgedBoard = { ...board, semanticFingerprint: '0'.repeat(64) };
  assert.throws(
    () => projectPublicWorkDashboard({ project, board: forgedBoard, parkingLot }),
    /board semanticFingerprint mismatch/,
  );
});

test('public dashboard rejects Board and Parking Lot from different semantic versions of the same Workgraph', () => {
  const nextGraphSource = structuredClone(read('workgraphs/public.json'));
  const parked = nextGraphSource.items.find((item) => item.workRef === 'work.vexlife.connected-services.guided-onboarding');
  parked.updatedAt = '2026-10-21T06:23:28.000Z';

  const nextGraph = createWorkgraph(nextGraphSource, registry);
  assert.equal(nextGraph.graphRef, graph.graphRef);
  assert.notEqual(nextGraph.semanticFingerprint, graph.semanticFingerprint);

  const nextParkingLot = projectParkingLot({ graph: nextGraph, registry });
  assert.equal(nextParkingLot.graphRef, board.graphRef);
  assert.notEqual(nextParkingLot.graphSemanticFingerprint, board.graphSemanticFingerprint);

  assert.throws(
    () => projectPublicWorkDashboard({ project, board, parkingLot: nextParkingLot }),
    /board\/parking Workgraph semantic version mismatch/,
  );
});

test('checked-in public dashboard exactly matches the canonical projection', () => {
  const dashboard = projectPublicWorkDashboard({ project, board, parkingLot });
  assert.deepEqual(read('public/work-dashboard.json'), dashboard);
});
