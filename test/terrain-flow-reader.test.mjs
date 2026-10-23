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

test('ToCompletion surfaces setup-safety convergence as the real active productization frontier', () => {
  const p = project('project.vexlife.tocompletion');
  const fronts = deepestCurrentFrontiers(p);
  assert.deepEqual(fronts.map((item) => item.workRef), [
    'work.vexlife.tocompletion.productization.setup-safety-convergence',
  ]);

  const rows = projectWorkfronts(p, { maxRows: 8 }).rows;
  const productization = rows.find((row) => row.scopeRef === 'work.vexlife.tocompletion.productization.ordinary-heretic-setup');
  assert.ok(productization);
  assert.deepEqual(productization.currentItems.map((item) => item.workRef), [
    'work.vexlife.tocompletion.productization.setup-safety-convergence',
  ]);
  assert.deepEqual(productization.nextDependencyItems.map((item) => item.workRef), [
    'work.vexlife.tocompletion.productization.heretic-normal-start-integration',
  ]);
});

test('Operational Console keeps concurrent Terrain review and active storefront realization inside running Commerce', () => {
  const p = project('project.vexwork.operational-console');
  const rows = projectWorkfronts(p, { maxRows: 8 }).rows;
  assert.equal(rows.some((row) => row.scopeRef === 'work.vexwork.operational-console.relational-terrain'), true);
  assert.equal(rows.some((row) => row.scopeRef === 'work.vexwork.operational-console.commerce-template'), true);
  const terrain = rows.find((row) => row.scopeRef === 'work.vexwork.operational-console.relational-terrain');
  const commerce = rows.find((row) => row.scopeRef === 'work.vexwork.operational-console.commerce-template');
  assert.equal(terrain.currentItems.some((item) => item.state === 'VERIFYING'), true);
  assert.equal(commerce.scopeState, 'RUNNING');
  assert.deepEqual(commerce.currentItems.map((item) => item.workRef), [
    'work.vexwork.operational-console.commerce-ai-site',
  ]);
  assert.equal(commerce.currentItems[0].state, 'RUNNING');
  assert.equal(commerce.nextStructuralItems.some((item) => item.workRef === 'work.vexwork.operational-console.commerce-ai-site'), false);
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

test('ToCompletion Roadmap keeps ordinary productization current while developmental and lateral scopes remain unsequenced', () => {
  const p = project('project.vexlife.tocompletion');
  const roadmap = projectScopeRoadmap(p, { maxSteps: 4 });
  const row = roadmap.rows.find((candidate) => candidate.scopeRef === 'work.vexlife.tocompletion.productization.ordinary-heretic-setup');
  assert.ok(row);
  assert.equal(row.steps[0].items.some((item) => item.workRef === 'work.vexlife.tocompletion.productization.ordinary-heretic-setup'), true);
  assert.equal(row.laterItems.some((item) => item.workRef === 'work.vexlife.tocompletion.p5.lived-continuity-learning'), true);
  assert.equal(row.laterItems.some((item) => item.workRef === 'work.vexlife.tocompletion.p6.cultivation-training-birth'), true);
  assert.equal(row.laterItems.some((item) => item.workRef === 'work.vexlife.tocompletion.p7.whole-product-expansion'), true);

  const p6 = projectSequenceDistance(p, 'work.vexlife.tocompletion.p6.cultivation-training-birth');
  assert.equal(p6.distance, null);
  assert.equal(p6.basis, 'LATER_UNSEQUENCED');

  const p7 = projectSequenceDistance(p, 'work.vexlife.tocompletion.p7.whole-product-expansion');
  assert.equal(p7.distance, null);
  assert.equal(p7.basis, 'LATER_UNSEQUENCED');
});

test('time lens adds recent accepted movement but current work remains pinned', () => {
  const p = project('project.vexwork.operational-console');
  const nowMs = Date.parse('2026-10-23T05:20:00.000Z');
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

test('local workfront roadmap advances from setup safety into normal-start Heretic integration by dependency', () => {
  const p = project('project.vexlife.tocompletion');
  const roadmap = projectRoadmap(p, { maxSteps: 4, maxRows: 8 });
  const productization = roadmap.rows.find((row) => row.scopeRef === 'work.vexlife.tocompletion.productization.ordinary-heretic-setup');
  assert.ok(productization);
  assert.equal(productization.steps[0].items[0].workRef, 'work.vexlife.tocompletion.productization.setup-safety-convergence');
  assert.equal(productization.steps[1].items.some((item) => item.workRef === 'work.vexlife.tocompletion.productization.heretic-normal-start-integration'), true);
  assert.equal(productization.steps[1].basis, 'DEPENDENCY');
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
