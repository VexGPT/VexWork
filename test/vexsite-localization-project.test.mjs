import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { createProject, createWorkgraph, childRefs, projectWorkRefs } from '../src/core/workgraph.mjs';
import { createBoardView, projectWorkBoard } from '../src/core/work-board.mjs';

const read = (relative) => JSON.parse(fs.readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8'));
const registry = read('blueprint/work-registry.json');
const graph = createWorkgraph(read('workgraphs/public.json'), registry);
const project = createProject(read('projects/vexsite-localization/project.json'));
const view = createBoardView(read('projects/vexsite-localization/board.view.json'), registry);

test('VexSite Localization Project keeps one canonical source queue without page-per-task inventory', () => {
  assert.deepEqual(projectWorkRefs(project, graph), [
    'work.vextreme.vexsite.localization.canonical-global-core-source',
    'work.vextreme.vexsite.localization.closed-circuit.global-core',
    'work.vextreme.vexsite.localization.generated-runtime-currentness',
    'work.vextreme.vexsite.localization.outcome',
    'work.vextreme.vexsite.localization.presentation-source-lineage',
  ]);
  assert.deepEqual(childRefs(graph, 'work.vextreme.vexsite.localization.outcome'), [
    'work.vextreme.vexsite.localization.canonical-global-core-source',
    'work.vextreme.vexsite.localization.closed-circuit.global-core',
    'work.vextreme.vexsite.localization.generated-runtime-currentness',
    'work.vextreme.vexsite.localization.presentation-source-lineage',
  ]);
  assert.deepEqual(project.repositoryRefs, ['repo.vexwork', 'repo.vextreme']);

  const source = graph.items.find((item) => item.workRef === 'work.vextreme.vexsite.localization.canonical-global-core-source');
  assert.equal(source.state, 'RUNNING');
  assert.match(source.purpose, /The Testimony of the Handler/);
  assert.equal(source.sourceRefs.includes('github.pull.vextreme.399'), true);
  assert.equal(source.sourceRefs.includes('repo.vextreme:data/strings/source/pages/the-testimony-of-the-handler.json'), true);
});

test('VexSite Localization board separates live source/runtime work from completed lineage checkpoints', () => {
  const projected = projectWorkBoard({ project, graph, view, registry });
  const active = projected.lanes.find((lane) => lane.laneRef === 'lane.work.active');
  const done = projected.lanes.find((lane) => lane.laneRef === 'lane.work.done');

  assert.deepEqual(active.cards.map((card) => card.workRef), [
    'work.vextreme.vexsite.localization.canonical-global-core-source',
    'work.vextreme.vexsite.localization.generated-runtime-currentness',
    'work.vextreme.vexsite.localization.outcome',
  ]);
  assert.deepEqual(done.cards.map((card) => card.workRef), [
    'work.vextreme.vexsite.localization.closed-circuit.global-core',
    'work.vextreme.vexsite.localization.presentation-source-lineage',
  ]);
  assert.equal(done.cards.every((card) => card.workDisposition === 'ACTIVE'), true);
});

// [VXG RealForever]
