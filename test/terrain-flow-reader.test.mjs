import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  deepestCurrentFrontiers,
  projectActivitySummary,
  projectRoadmap,
  projectScopeRoadmap,
  projectSequenceDistance,
  projectWorkfronts,
} from '../terrain-flow-reader.js';

const workspace = JSON.parse(fs.readFileSync(new URL('../public/workspace.json', import.meta.url), 'utf8'));
const project = (ref) => workspace.projects.find((entry) => entry.project.projectRef === ref);

test('ToCompletion surfaces the real deep active frontier without requiring descent', () => {
  const p = project('project.vexlife.tocompletion');
  const fronts = deepestCurrentFrontiers(p);
  assert.deepEqual(fronts.map((item) => item.workRef), [
    'work.vexlife.tocompletion.p5.g02-semantic-authority-materializer',
  ]);

  const rows = projectWorkfronts(p, { maxRows: 8 }).rows;
  const p5 = rows.find((row) => row.scopeRef === 'work.vexlife.tocompletion.p5.lived-continuity-learning');
  assert.ok(p5);
  assert.deepEqual(p5.currentItems.map((item) => item.workRef), [
    'work.vexlife.tocompletion.p5.g02-semantic-authority-materializer',
  ]);
  assert.deepEqual(p5.nextStructuralItems.map((item) => item.workRef), [
    'work.vexlife.tocompletion.p5.g02.sdk-runner-a057',
  ]);
});

test('Operational Console keeps Terrain review while Antique Plate becomes the next Commerce frontier', () => {
  const p = project('project.vexwork.operational-console');
  const rows = projectWorkfronts(p, { maxRows: 8 }).rows;
  assert.equal(rows.some((row) => row.scopeRef === 'work.vexwork.operational-console.relational-terrain'), true);
  assert.equal(rows.some((row) => row.scopeRef === 'work.vexwork.operational-console.commerce-template'), false);
  assert.equal(rows.some((row) => row.scopeRef === 'work.vexwork.operational-console.antique-pilot'), true);
  const terrain = rows.find((row) => row.scopeRef === 'work.vexwork.operational-console.relational-terrain');
  const antique = rows.find((row) => row.scopeRef === 'work.vexwork.operational-console.antique-pilot');
  assert.equal(terrain.currentItems.some((item) => item.state === 'VERIFYING'), true);
  assert.equal(antique.scopeState, 'READY');
  assert.deepEqual(antique.currentItems.map((item) => item.workRef), [
    'work.vexwork.operational-console.antique-pilot',
  ]);
  assert.equal(antique.currentItems[0].state, 'READY');
});

test('Connected Services Roadmap derives next-next-next from dependency truth', () => {
  const p = project('project.vexlife.connected-services');
  const roadmap = projectScopeRoadmap(p, { maxSteps: 4 });
  const row = roadmap.rows.find((candidate) => candidate.scopeRef === 'work.vexlife.connected-services.vcs04-conversation-adoption');
  assert.ok(row);
  assert.deepEqual(
    row.steps.map((step) => step.items.map((item) => item.workRef)),
    [
      ['work.vexlife.connected-services.vcs04-conversation-adoption'],
      ['work.vexlife.connected-services.vcs05-stream-stress'],
      ['work.vexlife.connected-services.vcs06-architecture-extraction'],
      ['work.vexlife.connected-services.vcs07-deployment-choices'],
    ],
  );
  assert.deepEqual(row.steps.map((step) => step.basis), ['CURRENT', 'DEPENDENCY', 'DEPENDENCY', 'DEPENDENCY']);
});

test('ToCompletion Roadmap keeps P6 dependency-grounded while P7 remains later/unsequenced relative to P5', () => {
  const p = project('project.vexlife.tocompletion');
  const roadmap = projectScopeRoadmap(p, { maxSteps: 4 });
  const row = roadmap.rows.find((candidate) => candidate.scopeRef === 'work.vexlife.tocompletion.p5.lived-continuity-learning');
  assert.ok(row);
  assert.equal(row.steps[1].items.some((item) => item.workRef === 'work.vexlife.tocompletion.p6.cultivation-training-birth'), true);
  assert.equal(row.laterItems.some((item) => item.workRef === 'work.vexlife.tocompletion.p7.whole-product-expansion'), true);

  const p6 = projectSequenceDistance(p, 'work.vexlife.tocompletion.p6.cultivation-training-birth');
  assert.equal(p6.distance, 1);
  assert.equal(p6.basis, 'DEPENDENCY');

  const p7 = projectSequenceDistance(p, 'work.vexlife.tocompletion.p7.whole-product-expansion');
  assert.equal(p7.distance, null);
  assert.equal(p7.basis, 'LATER_UNSEQUENCED');
});

test('time lens adds recent accepted movement but current work remains pinned', () => {
  const p = project('project.vexwork.operational-console');
  const nowMs = Date.parse('2026-10-23T06:20:00.000Z');
  const now = projectWorkfronts(p, { recentHours: 0, nowMs, maxRows: 8 });
  const day = projectWorkfronts(p, { recentHours: 24, nowMs, maxRows: 8 });
  const terrainNow = now.rows.find((row) => row.scopeRef === 'work.vexwork.operational-console.relational-terrain');
  const terrainDay = day.rows.find((row) => row.scopeRef === 'work.vexwork.operational-console.relational-terrain');
  assert.deepEqual(terrainNow.currentItems.map((item) => item.workRef), terrainDay.currentItems.map((item) => item.workRef));
  assert.equal(day.rows.some((row) => row.recentItems.length > 0), true);

  const summary = projectActivitySummary(p, { recentHours: 24, nowMs });
  assert.equal(summary.review >= 1, true);
  assert.equal(summary.recentExactTransitionCount >= 1, true);
});

test('completed Foundation collapses to a latest-completed workfront instead of inventing current activity', () => {
  const p = project('project.vexwork.foundation');
  const result = projectWorkfronts(p, { maxRows: 8 });
  assert.equal(result.currentFrontierCount, 0);
  assert.equal(result.rows.length, 1);
  assert.equal(result.rows[0].basis, 'LATEST_COMPLETED');
});

test('local workfront roadmap can extend inside a running scope using dependency then structural evidence', () => {
  const p = project('project.vexlife.tocompletion');
  const roadmap = projectRoadmap(p, { maxSteps: 4, maxRows: 8 });
  const p5 = roadmap.rows.find((row) => row.scopeRef === 'work.vexlife.tocompletion.p5.lived-continuity-learning');
  assert.ok(p5);
  assert.equal(p5.steps[0].items[0].workRef, 'work.vexlife.tocompletion.p5.g02-semantic-authority-materializer');
  assert.equal(p5.steps[1].items.some((item) => item.workRef === 'work.vexlife.tocompletion.p5.g02.sdk-runner-a057'), true);
  assert.equal(p5.steps[1].basis, 'STRUCTURAL');
});

test('flow projections never freeze or mutate the canonical public workspace input', () => {
  const p = project('project.vexlife.tocompletion');
  const before = JSON.stringify(p);
  const item = p.items[0];
  assert.equal(Object.isFrozen(p), false);
  assert.equal(Object.isFrozen(item), false);
  assert.equal(Object.getOwnPropertyDescriptor(item, 'workRef').writable, true);

  projectWorkfronts(p, { maxRows: 8 });
  projectActivitySummary(p, { recentHours: 24, nowMs: Date.parse('2026-10-22T07:30:00.000Z') });
  projectRoadmap(p, { maxSteps: 4, maxRows: 8 });
  projectScopeRoadmap(p, { maxSteps: 4 });
  projectWorkfronts(p, { maxRows: 8 });

  assert.equal(Object.isFrozen(p), false);
  assert.equal(Object.isFrozen(item), false);
  assert.equal(Object.getOwnPropertyDescriptor(item, 'workRef').writable, true);
  assert.equal(JSON.stringify(p), before);
});

// [VXG RealForever][VEXWORK][TERRAIN][FLOW-PROJECTION]
