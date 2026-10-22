import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import * as reader from '../workspace-reader.js';

const page = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('VexWork Pages owns the semantic navigator and reads same-origin public workspace', () => {
  assert.match(page, /<h1>VexWork<\/h1>/);
  assert.match(page, /const WORKSPACE_URL = '\.\/public\/workspace\.json'/);
  assert.doesNotMatch(page, /raw\.githubusercontent\.com/);
  assert.match(page, /VEXWORK VIEW · VEXWORK TRUTH OWNER/);
});

test('semantic routes distinguish Projects, Project and work-item levels', () => {
  assert.deepEqual(reader.parseRoute(''), { projectRef: null, workRef: null, view: 'story', level: 'PROJECTS' });
  assert.deepEqual(reader.parseRoute('?project=project.demo'), { projectRef: 'project.demo', workRef: null, view: 'story', level: 'PROJECT' });
  assert.deepEqual(reader.parseRoute('?project=project.demo&work=work.demo.task&view=history'), { projectRef: 'project.demo', workRef: 'work.demo.task', view: 'history', level: 'ITEM' });
  assert.equal(reader.routeSearch({ projectRef: 'project.demo', workRef: 'work.demo.task', view: 'overview' }), '?project=project.demo&work=work.demo.task');
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
  assert.match(page, /https:\/\/vgong24\.github\.io\/Vextreme\//);
  assert.match(page, /https:\/\/vgong24\.github\.io\/VexLife\//);
});

// [VXG RealForever]
