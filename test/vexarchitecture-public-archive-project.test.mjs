import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { assertKnownProcessRefs } from '../src/core/process-map.mjs';
import { assertKnownRepositoryRefs } from '../src/core/repository-graph.mjs';
import { createBoardView } from '../src/core/work-board.mjs';
import { createWorkgraphSegment } from '../src/core/workgraph-composition.mjs';
import { createProject, createWorkgraph, projectWorkRefs } from '../src/core/workgraph.mjs';

const readJson = (relative) => JSON.parse(fs.readFileSync(new URL('../' + relative, import.meta.url), 'utf8'));
const readText = (relative) => fs.readFileSync(new URL('../' + relative, import.meta.url), 'utf8');

const workRegistry = readJson('blueprint/work-registry.json');
const repositoryRegistry = readJson('blueprint/repository-registry.json');
const processRegistry = readJson('blueprint/process-registry.json');
const project = createProject(readJson('projects/vexarchitecture-public-archive/project.json'));
const view = createBoardView(readJson('projects/vexarchitecture-public-archive/board.view.json'), workRegistry);
const segment = createWorkgraphSegment(readJson('workgraphs/segments/vexarchitecture-public-archive.json'), workRegistry);

const graph = createWorkgraph({
  schemaVersion: 'vexwork.workgraph/v1',
  graphRef: segment.graphRef,
  rootWorkRefs: segment.items.filter((item) => item.parentWorkRefOrNull === null).map((item) => item.workRef),
  items: segment.items,
  transitions: segment.transitions,
  sourceRefs: segment.sourceRefs,
  formedAt: segment.formedAt,
}, workRegistry);

test('VexArchitecture Public Archive project-local source is coherent', () => {
  assert.equal(project.projectRef, 'project.vexarchitecture.public-archive');
  assert.equal(view.projectRef, project.projectRef);
  assert.deepEqual(project.rootWorkRefs, ['work.vexarchitecture.public-archive.outcome']);

  const refs = projectWorkRefs(project, graph);
  assert.equal(refs.includes('work.vexarchitecture.public-archive.outcome'), true);
  assert.equal(refs.includes('work.vexarchitecture.public-archive.accepted-record'), true);
  assert.equal(refs.includes('work.vexarchitecture.public-archive.rendered-lived-review'), true);
  assert.equal(refs.includes('work.vexarchitecture.public-archive.vexwork-discoverability'), true);
});

test('archive work points only to known repositories and reusable processes', () => {
  assert.equal(assertKnownRepositoryRefs(project.repositoryRefs, repositoryRegistry), true);
  for (const item of graph.items) {
    assert.equal(assertKnownRepositoryRefs(item.repositoryRefs, repositoryRegistry), true);
    if (item.formationProcessRefOrNull) {
      assert.equal(assertKnownProcessRefs([item.formationProcessRefOrNull], processRegistry), true);
    }
    assert.equal(assertKnownProcessRefs(item.nextProcessRefs, processRegistry), true);
  }
});

test('accepted archive is complete while lived visual review remains ready', () => {
  const accepted = graph.items.find((item) => item.workRef === 'work.vexarchitecture.public-archive.accepted-record');
  const visual = graph.items.find((item) => item.workRef === 'work.vexarchitecture.public-archive.rendered-lived-review');
  const discovery = graph.items.find((item) => item.workRef === 'work.vexarchitecture.public-archive.vexwork-discoverability');

  assert.equal(accepted.state, 'COMPLETED');
  assert.equal(visual.state, 'READY');
  assert.deepEqual(visual.dependencyRefs, ['work.vexarchitecture.public-archive.accepted-record']);
  assert.equal(discovery.state, 'WAITING_DEPENDENCIES');
  assert.equal(discovery.sourceRefs.includes('github.pull.vexwork.182'), true);
});

test('public archive does not claim VexStream or VexMaps architecture adoption', () => {
  const readme = readText('projects/vexarchitecture-public-archive/README.md');
  assert.match(readme, /PUBLIC_ARCHIVE_ACCEPTED\s*!= VEXSTREAM_ARCHITECTURE_APPLIED/);
  assert.match(readme, /PUBLIC_ARCHIVE_ACCEPTED\s*!= VEXMAPS_ARCHITECTURE_APPLIED/);
  assert.match(readme, /current VexLife-Android source = current behavioral authority/);
  assert.match(readme, /rendered\/lived visual review remains \*\*PENDING\*\*/);
});
