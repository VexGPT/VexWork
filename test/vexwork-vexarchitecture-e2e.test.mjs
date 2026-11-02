import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  createRelationshipAttentionQueueSnapshot,
  projectAttentionQueue,
} from '../src/core/attention-queue.mjs';
import { deriveDefaultBoardView } from '../src/core/work-board.mjs';
import {
  composeWorkgraph,
  createWorkgraphComposition,
} from '../src/core/workgraph-composition.mjs';
import { createProject, createWorkgraph } from '../src/core/workgraph.mjs';
import { projectRegistryBytes } from '../scripts/build-project-registry.mjs';
import {
  locateItem,
  parseRoute,
  projectByRef,
  searchWorkspace,
  validateWorkspace,
} from '../workspace-reader.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relative) => JSON.parse(fs.readFileSync(path.join(ROOT, relative), 'utf8'));
const readText = (relative) => fs.readFileSync(path.join(ROOT, relative), 'utf8');

const workRegistry = read('blueprint/work-registry.json');
const repositoryRegistry = read('blueprint/repository-registry.json');
const processRegistry = read('blueprint/process-registry.json');
const projectRegistry = read('blueprint/project-registry.json');
const publicWorkgraph = read('workgraphs/public.json');
const workspace = validateWorkspace(read('public/workspace.json'));

const segmentPaths = fs.readdirSync(path.join(ROOT, 'workgraphs', 'segments'))
  .filter((name) => name.endsWith('.json'))
  .sort()
  .map((name) => `workgraphs/segments/${name}`);

test('A4 composes exact source truth through the checked-in Workgraph and Project Registry consequences', () => {
  const composition = createWorkgraphComposition(read('workgraphs/composition.json'));
  const segments = segmentPaths.map(read);
  const composed = composeWorkgraph({ composition, segments, registry: workRegistry }).graph;
  const accepted = createWorkgraph(publicWorkgraph, workRegistry);

  assert.deepEqual(composed, accepted);
  assert.equal(projectRegistryBytes(ROOT), readText('blueprint/project-registry.json'));

  const sourceDefinitionPaths = fs.readdirSync(path.join(ROOT, 'projects'), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => `projects/${entry.name}/project.json`)
    .filter((relative) => fs.existsSync(path.join(ROOT, relative)))
    .sort();
  assert.equal(projectRegistry.projects.length, sourceDefinitionPaths.length);
  assert.deepEqual(
    [...projectRegistry.projects.map((entry) => entry.definitionPath)].sort(),
    sourceDefinitionPaths,
  );
});

test('A4 patient-zero Projects flow from source identity to Workgraph, derived Board, workspace and reader navigation', () => {
  for (const [projectRef, projectPath, rootWorkRef, query] of [
    [
      'project.vexlife.new-beginnings',
      'projects/vexlife-new-beginnings/project.json',
      'work.vexlife.new-beginnings.outcome',
      'New Beginnings',
    ],
    [
      'project.vexwork.vexarchitecture-alignment',
      'projects/vexwork-vexarchitecture-alignment/project.json',
      'work.vexwork.vexarchitecture-alignment.outcome',
      'VexArchitecture Alignment',
    ],
  ]) {
    const project = createProject(read(projectPath));
    assert.equal(project.projectRef, projectRef);

    const registryEntry = projectRegistry.projects.find((entry) => entry.projectRef === projectRef);
    assert.ok(registryEntry, projectRef);
    assert.equal(registryEntry.definitionPath, projectPath);
    assert.equal(registryEntry.boardViewPath, null);

    const root = publicWorkgraph.items.find((item) => item.workRef === rootWorkRef);
    assert.ok(root, rootWorkRef);

    const derivedBoard = deriveDefaultBoardView({ project, registry: workRegistry });
    assert.equal(derivedBoard.projectRef, projectRef);
    assert.equal(derivedBoard.viewRef, `view.${projectRef.slice('project.'.length)}.board`);

    const workspaceProject = projectByRef(workspace, projectRef);
    assert.ok(workspaceProject, projectRef);
    assert.equal(workspaceProject.viewRef, derivedBoard.viewRef);
    assert.ok(workspaceProject.items.some((item) => item.workRef === rootWorkRef));

    const route = parseRoute(`?project=${encodeURIComponent(projectRef)}`);
    assert.equal(route.level, 'PROJECT');
    assert.equal(route.projectRef, projectRef);
    assert.equal(projectByRef(workspace, route.projectRef).project.projectRef, projectRef);

    const located = locateItem(workspace, projectRef, rootWorkRef);
    assert.equal(located.project.project.projectRef, projectRef);
    assert.equal(located.item.workRef, rootWorkRef);

    const search = searchWorkspace(workspace, query);
    assert.equal(search.projects.some((entry) => entry.project.projectRef === projectRef), true, query);
  }
});

test('A4 public Projects surface consumes the generated workspace population instead of a parallel hard-coded Project list', () => {
  const html = readText('index.html');
  assert.match(html, /const WORKSPACE_URL = '\.\/public\/workspace\.json'/);
  assert.match(html, /workspace\.projects\.forEach\(\(p\)=>grid\.appendChild\(projectCard\(p\)\)\)/);

  for (const projectRef of [
    'project.vexlife.new-beginnings',
    'project.vexwork.vexarchitecture-alignment',
  ]) {
    assert.equal(workspace.projects.some((entry) => entry.project.projectRef === projectRef), true);
  }
});

test('A4 held relationship attention clears by evidence without changing WorkState', () => {
  const relationshipRef = 'relationship.vexwork.patient-zero.generated-currentness';
  const base = {
    queueRef: 'queue.vexwork.relationship-currentness',
    ownerRepositoryRef: 'repo.vexwork',
    label: 'A4 relationship currentness',
    purpose: 'Prove held relationship visibility and evidence-driven clearing.',
    sourceRefs: ['project.vexwork.vexarchitecture-alignment'],
  };
  const relationship = (relationshipState, observedAt, evidenceRefs) => ({
    relationshipRef,
    subjectRef: 'project.vexlife.new-beginnings',
    subjectKind: 'vexwork.project',
    label: 'New Beginnings generated consequence currentness',
    relationshipState,
    observedAt,
    reasonRefs: ['reason.vexwork.generated-consequence.currentness'],
    evidenceRefs,
    sourceRefs: ['workgraphs/segments/vexlife-new-beginnings.json', 'workgraphs/public.json'],
    existingWorkRefs: ['work.vexwork.vexarchitecture-alignment.generated-consequence-reconciliation'],
    processRefOrNull: null,
  });

  const stale = createRelationshipAttentionQueueSnapshot({
    ...base,
    snapshotRef: 'snapshot.vexwork.a4.relationship.stale',
    observedAt: '2026-11-02T13:04:59.000Z',
    relationships: [relationship('UNSATISFIED', '2026-11-02T13:04:59.000Z', ['evidence.vexwork.a4.generated-stale'])],
  }, { repositoryRegistry, processRegistry });
  const staleProjection = projectAttentionQueue(stale, { repositoryRegistry, processRegistry });
  assert.equal(staleProjection.queuedEntries[0].attentionRef, relationshipRef);

  const clear = createRelationshipAttentionQueueSnapshot({
    ...base,
    snapshotRef: 'snapshot.vexwork.a4.relationship.clear',
    observedAt: '2026-11-02T13:05:00.000Z',
    relationships: [relationship('SATISFIED', '2026-11-02T13:05:00.000Z', ['evidence.vexwork.a4.generated-current'])],
  }, { repositoryRegistry, processRegistry });
  const clearProjection = projectAttentionQueue(clear, { repositoryRegistry, processRegistry });
  assert.equal(clearProjection.queuedEntries.length, 0);
  assert.deepEqual(clearProjection.clearEntryRefs, [relationshipRef]);

  assert.equal(
    publicWorkgraph.items.find((item) =>
      item.workRef === 'work.vexwork.vexarchitecture-alignment.generated-consequence-reconciliation'
    ).state,
    'COMPLETED',
  );
});

test('A4 does not encode the current Project population as a literal correctness law', () => {
  const registryTest = readText('test/project-registry.test.mjs');
  assert.doesNotMatch(registryTest, /projection\.projects\.length\s*,\s*\d+/);
  assert.match(readText('docs/foundation/PROJECTS.md'), /LITERAL PROJECT COUNT != ARCHITECTURE LAW/);
});

test('A4 ordinary orientation can recover the active architecture trajectory without PR/chat archaeology', () => {
  for (const relative of [
    'docs/foundation/INDEX.md',
    'docs/foundation/VEXWORK-ORIENTATION.md',
    'orientation.html',
  ]) {
    assert.match(readText(relative), /vexwork-vexarchitecture-alignment/i, relative);
  }
});

// [VXG RealForever][VEXWORK][VEXARCHITECTURE-ALIGNMENT][A4-E2E]
