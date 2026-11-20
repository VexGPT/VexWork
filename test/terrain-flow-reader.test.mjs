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

test('ToCompletion treats terminal Heretic integration as historical under paused productization', () => {
  const p = project('project.vexlife.tocompletion');
  assert.deepEqual(deepestCurrentFrontiers(p), []);

  const rows = projectWorkfronts(p, { maxRows: 8 }).rows;
  const productization = rows.find((row) => row.scopeRef === 'work.vexlife.tocompletion.productization.ordinary-heretic-setup');
  assert.ok(productization);
  assert.equal(productization.basis, 'LATEST_COMPLETED');
  assert.deepEqual(productization.currentItems.map((item) => [item.workRef, item.state]), [
    ['work.vexlife.tocompletion.productization.heretic-normal-start-integration', 'COMPLETED'],
  ]);
  assert.deepEqual(productization.nextDependencyItems.map((item) => item.workRef), []);
});

test('Operational Console keeps completed Terrain and Commerce as prior context while Antique Plate remains current', () => {
  const p = project('project.vexwork.operational-console');
  const rows = projectWorkfronts(p, { maxRows: 8 }).rows;
  assert.equal(rows.some((row) => row.scopeRef === 'work.vexwork.operational-console.relational-terrain'), false);
  assert.equal(rows.some((row) => row.scopeRef === 'work.vexwork.operational-console.commerce-template'), false);
  const antique = rows.find((row) => row.scopeRef === 'work.vexwork.operational-console.antique-pilot');
  assert.ok(antique);
  assert.equal(antique.scopeState, 'RUNNING');
  assert.deepEqual(antique.currentItems.map((item) => item.workRef), [
    'work.vexwork.operational-console.antique-pilot',
  ]);
  assert.deepEqual(antique.priorItems.map((item) => [item.workRef, item.state]), [
    ['work.vexwork.operational-console.commerce-template', 'COMPLETED'],
  ]);
});

test('Connected Services Roadmap releases the human acceptance walk after terminal VCS-07', () => {
  const p = project('project.vexlife.connected-services');
  const roadmap = projectScopeRoadmap(p, { maxSteps: 4 });
  const row = roadmap.rows.find((candidate) => candidate.scopeRef === 'work.vexlife.connected-services.human-acceptance-walk');
  assert.ok(row);
  assert.deepEqual(row.priorItems.map((item) => item.workRef), [
    'work.vexlife.connected-services.vcs07-deployment-choices',
  ]);
  assert.deepEqual(
    row.steps.map((step) => step.items.map((item) => item.workRef)),
    [
      ['work.vexlife.connected-services.human-acceptance-walk'],
    ],
  );
  assert.deepEqual(row.steps.map((step) => step.basis), ['CURRENT']);
});

test('ToCompletion Roadmap preserves paused later scopes while dependency distance remains discoverable', () => {
  const p = project('project.vexlife.tocompletion');
  const roadmap = projectScopeRoadmap(p, { maxSteps: 4 });
  const row = roadmap.rows.find((candidate) => candidate.scopeRef === 'work.vexlife.tocompletion.p0b.foundation');
  assert.ok(row);
  assert.equal(row.laterItems.some((item) => item.workRef === 'work.vexlife.tocompletion.p5.lived-continuity-learning'), true);
  assert.equal(row.laterItems.some((item) => item.workRef === 'work.vexlife.tocompletion.p6.cultivation-training-birth'), true);
  assert.equal(row.laterItems.some((item) => item.workRef === 'work.vexlife.tocompletion.p7.whole-product-expansion'), true);
  assert.equal(row.laterItems.some((item) => item.workRef === 'work.vexlife.tocompletion.productization.ordinary-heretic-setup'), true);

  const p6 = projectSequenceDistance(p, 'work.vexlife.tocompletion.p6.cultivation-training-birth');
  assert.equal(p6.distance, 6);
  assert.equal(p6.basis, 'DEPENDENCY');

  const p7 = projectSequenceDistance(p, 'work.vexlife.tocompletion.p7.whole-product-expansion');
  assert.equal(p7.distance, 5);
  assert.equal(p7.basis, 'DEPENDENCY');
});

test('time lens preserves the current Antique workfront while project activity counts accepted movement', () => {
  const p = project('project.vexwork.operational-console');
  const nowMs = Date.parse('2026-10-23T06:20:00.000Z');
  const now = projectWorkfronts(p, { recentHours: 0, nowMs, maxRows: 8 });
  const day = projectWorkfronts(p, { recentHours: 24, nowMs, maxRows: 8 });
  const antiqueNow = now.rows.find((row) => row.scopeRef === 'work.vexwork.operational-console.antique-pilot');
  const antiqueDay = day.rows.find((row) => row.scopeRef === 'work.vexwork.operational-console.antique-pilot');
  assert.deepEqual(antiqueNow.currentItems.map((item) => item.workRef), antiqueDay.currentItems.map((item) => item.workRef));
  assert.equal(day.rows.some((row) => row.scopeRef === 'work.vexwork.operational-console.relational-terrain'), false);

  const summary = projectActivitySummary(p, { recentHours: 24, nowMs });
  assert.equal(summary.running, 1);
  assert.equal(summary.review, 0);
  assert.equal(summary.recentExactTransitionCount >= 1, true);
});

test('completed Foundation collapses to a latest-completed workfront instead of inventing current activity', () => {
  const p = project('project.vexwork.foundation');
  const result = projectWorkfronts(p, { maxRows: 8 });
  assert.equal(result.currentFrontierCount, 0);
  assert.equal(result.rows.length, 1);
  assert.equal(result.rows[0].basis, 'LATEST_COMPLETED');
});

test('local workfront roadmap keeps completed setup safety and terminal Heretic integration as historical context', () => {
  const p = project('project.vexlife.tocompletion');
  const roadmap = projectRoadmap(p, { maxSteps: 4, maxRows: 8 });
  const productization = roadmap.rows.find((row) => row.scopeRef === 'work.vexlife.tocompletion.productization.ordinary-heretic-setup');
  assert.ok(productization);
  assert.equal(productization.steps[0].basis, 'HISTORICAL');
  assert.deepEqual(productization.steps[0].items.map((item) => item.workRef), [
    'work.vexlife.tocompletion.productization.heretic-normal-start-integration',
  ]);
  assert.equal(productization.steps.length, 1);
  assert.equal(productization.priorItems.some((item) => item.workRef === 'work.vexlife.tocompletion.productization.setup-safety-convergence' && item.state === 'COMPLETED'), true);
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
