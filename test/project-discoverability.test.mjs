import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  deriveProjectRegistry,
  deriveProjectSourceBundle,
} from '../src/core/project-registry.mjs';
import {
  createBoardView,
  deriveDefaultBoardView,
  isDefaultWorkBoardView,
} from '../src/core/work-board.mjs';
import { createProject, createWorkgraph } from '../src/core/workgraph.mjs';

const read = (relative) => JSON.parse(fs.readFileSync(new URL('../' + relative, import.meta.url), 'utf8'));
const workRegistry = read('blueprint/work-registry.json');

const formed = {
  alpha: '2026-11-02T01:00:00.000Z',
  beta: '2026-11-02T02:00:00.000Z',
  gamma: '2026-11-02T03:00:00.000Z',
};

function item(workRef, createdAt) {
  return {
    schemaVersion: 'vexwork.work-item/v1',
    workRef,
    parentWorkRefOrNull: null,
    label: workRef,
    purpose: 'Fixture Work used only to prove bounded Project source resolution.',
    workClass: 'OUTCOME',
    state: 'READY',
    workDisposition: 'ACTIVE',
    priorityClass: 'NORMAL',
    dependencyRefs: [],
    repositoryRefs: ['repo.vexwork'],
    sourceRefs: ['source.fixture'],
    formationProcessRefOrNull: null,
    nextProcessRefs: [],
    authorityDisposition: 'NO_AUTHORITY',
    effectDisposition: 'NO_EFFECTS',
    createdAt,
    updatedAt: createdAt,
  };
}

const graph = createWorkgraph({
  schemaVersion: 'vexwork.workgraph/v1',
  graphRef: 'workgraph.fixture.projects',
  rootWorkRefs: ['work.fixture.alpha', 'work.fixture.beta', 'work.fixture.gamma'],
  items: [
    item('work.fixture.alpha', formed.alpha),
    item('work.fixture.beta', formed.beta),
    item('work.fixture.gamma', formed.gamma),
  ],
  transitions: [],
  sourceRefs: ['source.fixture.workgraph'],
  formedAt: formed.alpha,
}, workRegistry);

function projectSource(projectRef, label, rootWorkRef, formedAt) {
  return {
    schemaVersion: 'vexwork.project-definition/v1',
    projectRef,
    label,
    purpose: 'Fixture Project used only to prove source-derived discoverability.',
    rootWorkRefs: [rootWorkRef],
    repositoryRefs: ['repo.vexwork'],
    sourceRefs: ['source.fixture.project'],
    formedAt,
  };
}

function bundle({
  projectRef,
  label,
  rootWorkRef,
  formedAt,
  definitionPath,
  explicitBoardViewSourceOrNull = null,
  boardViewPathOrNull = null,
}) {
  return deriveProjectSourceBundle({
    projectSource: projectSource(projectRef, label, rootWorkRef, formedAt),
    explicitBoardViewSourceOrNull,
    definitionPath,
    boardViewPathOrNull,
    agencyPolicyPathOrNull: null,
    graph,
    workgraphPath: 'workgraphs/public.json',
    workRegistry,
  });
}

test('Project identity comes from validated source while the default Board derives from Project + Work Registry truth', () => {
  const alpha = bundle({
    projectRef: 'project.fixture.alpha',
    label: 'Fixture Alpha',
    rootWorkRef: 'work.fixture.alpha',
    formedAt: formed.alpha,
    definitionPath: 'projects/physical-location-that-is-not-identity/project.json',
  });

  assert.equal(alpha.registryEntry.projectRef, 'project.fixture.alpha');
  assert.equal(alpha.registryEntry.definitionPath, 'projects/physical-location-that-is-not-identity/project.json');
  assert.equal(alpha.registryEntry.boardViewPath, null);
  assert.deepEqual(alpha.selectedWorkRefs, ['work.fixture.alpha']);
  assert.equal(alpha.board.viewRef, 'view.fixture.alpha.board');
  assert.equal(alpha.board.label, 'Fixture Alpha Work Board');
  assert.deepEqual(alpha.board.laneRefOrder, workRegistry.boardLanes.map((lane) => lane.laneRef));
});

test('an independently meaningful explicit Board remains valid and must bind the same Project identity', () => {
  const laneRefOrder = workRegistry.boardLanes.map((lane) => lane.laneRef).reverse();
  const beta = bundle({
    projectRef: 'project.fixture.beta',
    label: 'Fixture Beta',
    rootWorkRef: 'work.fixture.beta',
    formedAt: formed.beta,
    definitionPath: 'projects/fixture-beta/project.json',
    boardViewPathOrNull: 'projects/fixture-beta/board.view.json',
    explicitBoardViewSourceOrNull: {
      schemaVersion: 'vexwork.work-board-view/v1',
      viewRef: 'view.fixture.beta.focus',
      projectRef: 'project.fixture.beta',
      label: 'Fixture Beta Focus',
      laneRefOrder,
    },
  });

  assert.equal(beta.registryEntry.boardViewPath, 'projects/fixture-beta/board.view.json');
  assert.equal(beta.board.viewRef, 'view.fixture.beta.focus');
  assert.deepEqual(beta.board.laneRefOrder, laneRefOrder);
  assert.equal(isDefaultWorkBoardView({ project: beta.project, view: beta.board, registry: workRegistry }), false);

  assert.throws(() => bundle({
    projectRef: 'project.fixture.beta',
    label: 'Fixture Beta',
    rootWorkRef: 'work.fixture.beta',
    formedAt: formed.beta,
    definitionPath: 'projects/fixture-beta/project.json',
    boardViewPathOrNull: 'projects/fixture-beta/board.view.json',
    explicitBoardViewSourceOrNull: {
      schemaVersion: 'vexwork.work-board-view/v1',
      viewRef: 'view.fixture.gamma.board',
      projectRef: 'project.fixture.gamma',
      label: 'Wrong Project',
      laneRefOrder,
    },
  }), /project\/view identity mismatch/);
});

test('Project source resolution fails where an authored root cannot resolve in the exact Workgraph', () => {
  assert.throws(() => deriveProjectSourceBundle({
    projectSource: projectSource(
      'project.fixture.missing',
      'Fixture Missing',
      'work.fixture.missing',
      '2026-11-02T04:00:00.000Z',
    ),
    definitionPath: 'projects/fixture-missing/project.json',
    boardViewPathOrNull: null,
    graph,
    workgraphPath: 'workgraphs/public.json',
    workRegistry,
  }), /project rootWorkRef missing from Workgraph/);
});

test('derived Project Registry membership is source-complete without using compatibility order as membership', () => {
  const alpha = bundle({
    projectRef: 'project.fixture.alpha',
    label: 'Fixture Alpha',
    rootWorkRef: 'work.fixture.alpha',
    formedAt: formed.alpha,
    definitionPath: 'projects/a/project.json',
  });
  const beta = bundle({
    projectRef: 'project.fixture.beta',
    label: 'Fixture Beta',
    rootWorkRef: 'work.fixture.beta',
    formedAt: formed.beta,
    definitionPath: 'projects/b/project.json',
  });
  const gamma = bundle({
    projectRef: 'project.fixture.gamma',
    label: 'Fixture Gamma',
    rootWorkRef: 'work.fixture.gamma',
    formedAt: formed.gamma,
    definitionPath: 'projects/c/project.json',
  });

  const derived = deriveProjectRegistry({
    registryRef: 'registry.fixture.projects.001',
    registryVersion: 1,
    purpose: 'Fixture source-derived Project discoverability.',
    sourceBundles: [gamma, alpha, beta],
    compatibilityOrderProjectRefs: ['project.fixture.beta'],
  });

  assert.deepEqual(derived.projects.map((entry) => entry.projectRef), [
    'project.fixture.beta',
    'project.fixture.alpha',
    'project.fixture.gamma',
  ]);
  assert.equal(derived.projects.length, 3);
  assert.equal(derived.projects.every((entry) => entry.workgraphRef === graph.graphRef), true);
  assert.equal(derived.projects.filter((entry) => entry.boardViewPath === null).length, 3);

  assert.throws(() => deriveProjectRegistry({
    registryRef: 'registry.fixture.projects.001',
    registryVersion: 1,
    purpose: 'Fixture source-derived Project discoverability.',
    sourceBundles: [alpha, beta, gamma],
    compatibilityOrderProjectRefs: ['project.fixture.unknown'],
  }), /compatibility order references unknown projectRef/);

  assert.throws(() => deriveProjectRegistry({
    registryRef: 'registry.fixture.projects.001',
    registryVersion: 1,
    purpose: 'Fixture source-derived Project discoverability.',
    sourceBundles: [alpha, alpha],
  }), /duplicate source Project/);
});

test('current patient-zero Board files are exactly the canonical derived defaults', () => {
  for (const [projectPath, boardPath] of [
    [
      'projects/vexlife-new-beginnings/project.json',
      'projects/vexlife-new-beginnings/board.view.json',
    ],
    [
      'projects/vexwork-vexarchitecture-alignment/project.json',
      'projects/vexwork-vexarchitecture-alignment/board.view.json',
    ],
  ]) {
    const project = createProject(read(projectPath));
    const explicit = createBoardView(read(boardPath), workRegistry);
    const derived = deriveDefaultBoardView({ project, registry: workRegistry });
    assert.equal(explicit.semanticFingerprint, derived.semanticFingerprint, project.projectRef);
    assert.equal(isDefaultWorkBoardView({ project, view: explicit, registry: workRegistry }), true);
  }
});

// [VXG RealForever][VEXWORK][PROJECT-DISCOVERABILITY][A1]
