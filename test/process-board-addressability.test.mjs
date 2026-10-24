import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { projectProcessMap, validateProcessRegistry } from '../src/core/process-map.mjs';
import { normalizeBoardGraph, normalizeBoardProjection } from '../src/shared/vexboard-model.mjs';
import { advanceBoardJourney, createBoardJourney, journeyChoices } from '../src/shared/vexboard-journey.mjs';
import {
  catalogFromBoardUrlMap,
  normalizeBoardSourceCatalog,
  resolveBoardSource,
} from '../src/shared/vexboard-source-resolver.mjs';
import { VEXBOARD_BUILTIN_BOARD_URLS } from '../vexboard-reader.js';

const read = (relative) => JSON.parse(fs.readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8'));
const processRegistry = read('blueprint/process-registry.json');
const repositoryRegistry = read('blueprint/repository-registry.json');
const formProjectBoard = read('vexboard/form-project-process.json');
const processBoardCatalog = read('vexboard/process-board-catalog.json');

const builtinCatalog = () => catalogFromBoardUrlMap({
  catalogRef: 'catalog.vexboard.builtin',
  urls: VEXBOARD_BUILTIN_BOARD_URLS,
  sourceRefs: ['vexboard-reader.js'],
});

test('process.vexwork.form-project resolves through the source-owned VexWork catalog to one read-only VexBoard Journey', () => {
  const validation = validateProcessRegistry(processRegistry, repositoryRegistry);
  assert.equal(validation.ok, true, validation.errors.join('\n'));

  const map = projectProcessMap(processRegistry);
  const process = map.processes.find((entry) => entry.processRef === 'process.vexwork.form-project');
  assert.equal(process.boardRefOrNull, 'board.vexwork.form-project');
  assert.equal(process.effects, false);
  assert.equal(process.executionAuthority, 'NONE');

  const catalog = normalizeBoardSourceCatalog(processBoardCatalog);
  assert.deepEqual(
    catalog.entries.map((entry) => entry.boardRef),
    map.processes
      .filter((entry) => entry.boardRefOrNull !== null)
      .map((entry) => entry.boardRefOrNull)
      .sort(),
  );
  assert.equal(VEXBOARD_BUILTIN_BOARD_URLS[process.boardRefOrNull], undefined);

  const resolution = resolveBoardSource(process.boardRefOrNull, [
    builtinCatalog(),
    catalog,
  ]);
  assert.equal(resolution.boardRef, process.boardRefOrNull);
  assert.equal(resolution.catalogRef, 'catalog.vexwork.process-boards');
  assert.equal(resolution.location, './form-project-process.json');
  assert.deepEqual(resolution.sourceRefs, [
    'blueprint/process-registry.json',
    'docs/process/FORM-PROJECT.md',
    'process.vexwork.form-project',
    'vexboard/form-project-process.json',
  ]);

  assert.equal(formProjectBoard.draftRef, resolution.boardRef);
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
  assert.equal(
    advanceBoardJourney(graph, delegated, 'rel.vexwork.form-project.agency-prove').currentRef,
    'node.vexwork.form-project.prove',
  );

  assert.equal(resolveBoardSource('board.vexwork.unknown', [builtinCatalog(), catalog]), null);
});
