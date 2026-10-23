import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import * as reader from '../workspace-reader.js';

const page = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('VexWork Pages owns the semantic navigator and reads same-origin public workspace', () => {
  assert.match(page, /class="brand-home" href="\.\/">VexWork<\/a>/);
  assert.match(page, /class="terrain-home" href="\.\/terrain\.html">Terrain Map<\/a>/);
  assert.match(page, /class="terrain-home" href="\.\/vexboard\/">VexBoard<\/a>/);
  assert.match(page, /const WORKSPACE_URL = '\.\/public\/workspace\.json'/);
  assert.doesNotMatch(page, /raw\.githubusercontent\.com/);
  assert.match(page, /VEXWORK VIEW · VEXWORK TRUTH OWNER/);
});

test('semantic routes distinguish Projects, Project and work-item levels', () => {
  assert.deepEqual(reader.parseRoute(''), { projectRef: null, workRef: null, view: 'projects', level: 'PROJECTS' });
  assert.deepEqual(reader.parseRoute('?project=project.demo'), { projectRef: 'project.demo', workRef: null, view: 'story', level: 'PROJECT' });
  assert.deepEqual(reader.parseRoute('?project=project.demo&work=work.demo.task&view=history'), { projectRef: 'project.demo', workRef: 'work.demo.task', view: 'history', level: 'ITEM' });
  assert.equal(reader.routeSearch({ projectRef: 'project.demo', workRef: 'work.demo.task', view: 'overview' }), '?project=project.demo&work=work.demo.task');
  assert.deepEqual(reader.parseRoute('?view=open'), { projectRef: null, workRef: null, view: 'open', level: 'PROJECTS' });
  assert.equal(reader.routeSearch({ projectRef: null, workRef: null, view: 'open' }), '?view=open');
});

test('recursive containment and incoming dependencies remain projection helpers', () => {
  const project = {
    project: { projectRef: 'project.demo', rootWorkRefs: ['work.root'] },
    items: [
      { workRef: 'work.root', parentWorkRefOrNull: null, childWorkRefs: ['work.child'], dependencyRefs: [] },
      { workRef: 'work.child', parentWorkRefOrNull: 'work.root', childWorkRefs: [], dependencyRefs: [] },
      { workRef: 'work.consumer', parentWorkRefOrNull: 'work.root', childWorkRefs: [], dependencyRefs: ['work.child'] },
    ],
  };
  assert.deepEqual(reader.ancestorRefs(project, 'work.child'), ['work.root']);
  assert.deepEqual(reader.childItems(project, 'work.root').map((item) => item.workRef), ['work.child']);
  assert.deepEqual(reader.incomingDependencyRefs(project, 'work.child'), ['work.consumer']);
  project.lanes = [
    { laneRef: 'lane.work.active', workRefs: ['work.root', 'work.consumer'] },
    { laneRef: 'lane.work.done', workRefs: ['work.child'] },
    { laneRef: 'lane.work.archive', workRefs: [] },
  ];
  assert.deepEqual(reader.openWorkItems(project).map((item) => item.workRef), ['work.root', 'work.consumer']);
  assert.deepEqual(reader.openWorkGroups(project).map((group) => group.scopeRef), ['work.root', 'work.consumer']);
});

test('public schema validator preserves no-effects boundary', () => {
  const data = { schemaVersion: 'vexwork.public-workspace/v1', projects: [], parkingLot: { items: [] }, effects: false, executionAuthority: 'NONE' };
  assert.equal(reader.validateWorkspace(data), data);
  assert.throws(() => reader.validateWorkspace({ ...data, effects: true }), /no-effects boundary/);
});

test('UI exposes semantic lenses but no work/comment mutation controls', () => {
  assert.match(page, /Story Map/);
  assert.match(page, /Board/);
  assert.match(page, /Dependencies/);
  assert.match(page, /State History/);
  assert.match(page, /Open Work/);
  assert.match(page, /fold-toggle/);
  assert.match(page, /preserveScroll/);
  assert.match(page, /Priority ·/);
  assert.match(page, /This page cannot mutate Workgraph truth/);
  assert.match(page, /VexWork stays read-only/);
  assert.doesNotMatch(page, /method:\s*['"](?:POST|PUT|PATCH|DELETE)['"]/i);
  assert.doesNotMatch(page, /dragstart|draggable\s*=|add comment|save comment/i);
});

test('dynamic VexWork strings enter through textContent, not producer HTML', () => {
  assert.match(page, /n\.textContent=String\(text\)/);
  assert.doesNotMatch(page, /\.innerHTML\s*=\s*item\.|\.innerHTML\s*=\s*project\./);
});

test('family navigation keeps Vextreme and VexLife as sibling destinations', () => {
  assert.match(page, /https:\/\/vgong24\.github\.io\/Vextreme\/pages\/terrain-map\.html\?view=content&amp;profile=evolution-v1/);
  assert.match(page, /https:\/\/vgong24\.github\.io\/VexLife\//);
});

test('state presentation uses stable semantic color families and keeps priority separate', () => {
  assert.equal(reader.stateTone('COMPLETED'), 'done');
  assert.equal(reader.stateTone('RUNNING'), 'open');
  assert.equal(reader.stateTone('BLOCKED'), 'blocked');
  assert.equal(reader.stateTone('WAITING_HUMAN'), 'waiting');
  assert.equal(reader.stateTone('DECOMPOSED'), 'pending');
  assert.equal(reader.priorityTone('IMMEDIATE'), 'immediate');
  assert.equal(reader.priorityTone('HIGH'), 'high');
  assert.equal(reader.priorityTone('NORMAL'), 'normal');
});

test('semantic level rail and VexWork title expose navigation home/back controls', () => {
  assert.match(page, /class="family-current" href="\.\/"/);
  assert.match(page, /class="brand-home" href="\.\/">VexWork<\/a>/);
  assert.match(page, /data-level="PROJECTS"/);
  assert.match(page, /data-level="PROJECT"/);
});

test('lifecycle workflow map is projected from canonical registries rather than copied into the page', () => {
  assert.match(page, /const WORK_REGISTRY_URL = '\.\/blueprint\/work-registry\.json'/);
  assert.match(page, /const PROJECT_REGISTRY_URL = '\.\/blueprint\/project-registry\.json'/);
  assert.match(page, /import \* as Workflow from '\.\/workflow-reader\.js'/);
  assert.match(page, /Workflow\.projectLifecycleWorkflow\(workRegistry/);
  assert.match(page, /class="workflow-map-canvas"/);
  assert.match(page, /View workflows/);
  assert.match(page, /marker-end/);
  assert.doesNotMatch(page, /const\s+WORKFLOW_STATES\s*=/);
  assert.doesNotMatch(page, /const\s+WORKFLOW_TRANSITIONS\s*=/);
});

test('workflow map stays read-only and carries exact item transition history into review interpretation', () => {
  assert.match(page, /transitionHistory:item\?\.transitionHistory\|\|\[\]/);
  assert.match(page, /policy overlay:/);
  assert.match(page, /human review boundary/);
  assert.doesNotMatch(page, /workflow.*method:\s*['"](?:POST|PUT|PATCH|DELETE)['"]/i);
});

test('workflow map reuses the same V1 state-tone owner as cards and legend', () => {
  assert.match(page, /node\.dataset\.tone=Reader\.stateTone\(state\)/);
  assert.match(page, /workflow-state\[data-tone="open"\]/);
  assert.match(page, /workflow-state\[data-tone="waiting"\]/);
  assert.match(page, /workflow-state\[data-tone="blocked"\]/);
  assert.match(page, /workflow-state\[data-tone="done"\]/);
  assert.match(page, /workflow-swatch open/);
  assert.match(page, /workflow-swatch waiting/);
  assert.match(page, /workflow-swatch blocked/);
  assert.match(page, /workflow-swatch done/);
});

// [VXG RealForever]
