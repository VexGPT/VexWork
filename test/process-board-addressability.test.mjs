import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { projectProcessMap, validateProcessRegistry } from '../src/core/process-map.mjs';
import { normalizeBoardGraph, normalizeBoardProjection } from '../src/shared/vexboard-model.mjs';
import { advanceBoardJourney, createBoardJourney, journeyChoices } from '../src/shared/vexboard-journey.mjs';
import { builtinBoardUrl } from '../vexboard-reader.js';

const read = (relative) => JSON.parse(fs.readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8'));
const processRegistry = read('blueprint/process-registry.json');
const repositoryRegistry = read('blueprint/repository-registry.json');
const formProjectBoard = read('vexboard/form-project-process.json');

test('process.vexwork.form-project resolves to one read-only VexBoard Journey without creating authority', () => {
  const validation = validateProcessRegistry(processRegistry, repositoryRegistry);
  assert.equal(validation.ok, true, validation.errors.join('\n'));
  const map = projectProcessMap(processRegistry);
  const process = map.processes.find((entry) => entry.processRef === 'process.vexwork.form-project');
  assert.equal(process.boardRefOrNull, 'board.vexwork.form-project');
  assert.equal(process.effects, false);
  assert.equal(process.executionAuthority, 'NONE');
  assert.equal(builtinBoardUrl(process.boardRefOrNull), './form-project-process.json');
  assert.equal(formProjectBoard.draftRef, process.boardRefOrNull);
  assert.equal(formProjectBoard.mode, 'READ_ONLY_SOURCE');

  const graph = normalizeBoardGraph(formProjectBoard.graph);
  const projection = normalizeBoardProjection(formProjectBoard.projection, graph);
  assert.equal(projection.graphRef, graph.graphRef);

  let journey = createBoardJourney(graph, {
    journeyRef: 'journey.vexwork.form-project.proof',
    boardRef: process.boardRefOrNull,
    startRef: 'node.vexwork.form-project.entry',
  });
  for (const relationshipRef of [
    'rel.vexwork.form-project.entry-ground',
    'rel.vexwork.form-project.ground-name',
    'rel.vexwork.form-project.name-decompose',
    'rel.vexwork.form-project.decompose-currentness',
    'rel.vexwork.form-project.currentness-routes',
    'rel.vexwork.form-project.routes-authority',
    'rel.vexwork.form-project.authority-form',
  ]) journey = advanceBoardJourney(graph, journey, relationshipRef);

  assert.deepEqual(journeyChoices(graph, journey).map((choice) => choice.relationshipRef), [
    'rel.vexwork.form-project.form-agency',
    'rel.vexwork.form-project.form-prove',
  ]);
  const direct = advanceBoardJourney(graph, journey, 'rel.vexwork.form-project.form-prove');
  assert.equal(direct.currentRef, 'node.vexwork.form-project.prove');
  const delegated = advanceBoardJourney(graph, journey, 'rel.vexwork.form-project.form-agency');
  assert.equal(advanceBoardJourney(graph, delegated, 'rel.vexwork.form-project.agency-prove').currentRef,
    'node.vexwork.form-project.prove');
  assert.equal(builtinBoardUrl('board.vexwork.unknown'), null);
});
