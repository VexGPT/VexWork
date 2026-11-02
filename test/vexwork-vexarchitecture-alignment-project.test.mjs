import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { assertKnownProcessRefs } from '../src/core/process-map.mjs';
import { assertKnownRepositoryRefs } from '../src/core/repository-graph.mjs';
import { createBoardView, projectWorkBoard } from '../src/core/work-board.mjs';
import { createWorkgraphSegment } from '../src/core/workgraph-composition.mjs';
import { createProject, createWorkgraph, projectWorkRefs } from '../src/core/workgraph.mjs';

const read = (relative) => JSON.parse(fs.readFileSync(new URL('../' + relative, import.meta.url), 'utf8'));

const workRegistry = read('blueprint/work-registry.json');
const repositoryRegistry = read('blueprint/repository-registry.json');
const processRegistry = read('blueprint/process-registry.json');
const project = createProject(read('projects/vexwork-vexarchitecture-alignment/project.json'));
const view = createBoardView(read('projects/vexwork-vexarchitecture-alignment/board.view.json'), workRegistry);
const segment = createWorkgraphSegment(read('workgraphs/segments/vexwork-vexarchitecture-alignment.json'), workRegistry);

const graph = createWorkgraph({
  schemaVersion: 'vexwork.workgraph/v1',
  graphRef: segment.graphRef,
  rootWorkRefs: segment.items.filter((item) => item.parentWorkRefOrNull === null).map((item) => item.workRef),
  items: segment.items,
  transitions: segment.transitions,
  sourceRefs: segment.sourceRefs,
  formedAt: segment.formedAt,
}, workRegistry);

test('VexWork VexArchitecture Alignment project-local source is internally coherent', () => {
  assert.equal(project.projectRef, 'project.vexwork.vexarchitecture-alignment');
  assert.equal(view.projectRef, project.projectRef);
  assert.deepEqual(project.rootWorkRefs, ['work.vexwork.vexarchitecture-alignment.outcome']);
  assert.deepEqual(projectWorkRefs(project, graph), [
    'work.vexwork.vexarchitecture-alignment.end-to-end-foundation-proof',
    'work.vexwork.vexarchitecture-alignment.generated-consequence-reconciliation',
    'work.vexwork.vexarchitecture-alignment.map-current-contracts',
    'work.vexwork.vexarchitecture-alignment.outcome',
    'work.vexwork.vexarchitecture-alignment.project-discoverability-contract',
    'work.vexwork.vexarchitecture-alignment.relationship-attention-healing',
    'work.vexwork.vexarchitecture-alignment.vexboard-projection-alignment',
  ]);
});

test('alignment source points only to known repositories and registered reusable processes', () => {
  assert.equal(assertKnownRepositoryRefs(project.repositoryRefs, repositoryRegistry), true);
  for (const item of graph.items) {
    assert.equal(assertKnownRepositoryRefs(item.repositoryRefs, repositoryRegistry), true);
    if (item.formationProcessRefOrNull) {
      assert.equal(assertKnownProcessRefs([item.formationProcessRefOrNull], processRegistry), true);
    }
    assert.equal(assertKnownProcessRefs(item.nextProcessRefs, processRegistry), true);
  }
});

test('VexWork architecture work remains ahead of VexBoard projection alignment', () => {
  const projected = projectWorkBoard({ project, graph, view, registry: workRegistry });
  const active = projected.lanes.find((lane) => lane.laneRef === 'lane.work.active');
  const planned = projected.lanes.find((lane) => lane.laneRef === 'lane.work.planned');

  assert.deepEqual(active.cards.map((card) => card.workRef), [
    'work.vexwork.vexarchitecture-alignment.map-current-contracts',
    'work.vexwork.vexarchitecture-alignment.outcome',
  ]);

  const plannedRefs = planned.cards.map((card) => card.workRef);
  assert.equal(plannedRefs.includes('work.vexwork.vexarchitecture-alignment.project-discoverability-contract'), true);
  assert.equal(plannedRefs.includes('work.vexwork.vexarchitecture-alignment.vexboard-projection-alignment'), true);

  const vexboard = graph.items.find((item) => item.workRef === 'work.vexwork.vexarchitecture-alignment.vexboard-projection-alignment');
  assert.deepEqual(vexboard.dependencyRefs, ['work.vexwork.vexarchitecture-alignment.end-to-end-foundation-proof']);
});

test('patient-zero closure is a named implementation edge, not a hard-coded Project count', () => {
  const discoverability = graph.items.find((item) => item.workRef === 'work.vexwork.vexarchitecture-alignment.project-discoverability-contract');
  assert.match(discoverability.purpose, /every eligible source-managed Project resolves exactly once/i);
  assert.equal(discoverability.sourceRefs.includes('projects/vexlife-new-beginnings/project.json'), true);
  assert.equal(discoverability.sourceRefs.includes('test/project-registry.test.mjs'), true);
});
