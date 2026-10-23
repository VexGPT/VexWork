import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import * as Reader from '../vexboard-reader.js';
import { normalizeBoardGraph, normalizeBoardProjection } from '../src/shared/vexboard-model.mjs';

const page = fs.readFileSync(new URL('../vexboard/index.html', import.meta.url), 'utf8');
const selfMap = JSON.parse(fs.readFileSync(new URL('../vexboard/self-map.json', import.meta.url), 'utf8'));
const publishMap = JSON.parse(fs.readFileSync(new URL('../vexboard/publish-map.json', import.meta.url), 'utf8'));

test('VexBoard Pages entry exposes create/open/read-only/fork/save-draft workflow', () => {
  assert.match(page, /Create new/);
  assert.match(page, /Open VexBoard self-map/);
  assert.match(page, /Request edit → draft copy/);
  assert.match(page, /Save draft/);
  assert.match(page, /Browser-local proving copies · not source truth/);
  assert.match(page, /Local draft · source detached/);
  assert.match(page, /href="\.\.\/">← VexWork/);
});

test('browser UI uses the shared BoardControl adapter for mutation rather than source/provider writes', () => {
  assert.match(page, /Board\.controlFor\(current/);
  assert.match(page, /Board\.applyBoardControl/);
  assert.match(page, /'CREATE_NODE'/);
  assert.match(page, /'MOVE_ITEM'/);
  assert.match(page, /'RESIZE_ITEM'/);
  assert.match(page, /'CONNECT_NODES'/);
  assert.match(page, /Board\.boardPointFromClient/);
  assert.doesNotMatch(page, /method:\s*['"](?:POST|PUT|PATCH|DELETE)['"]/i);
  assert.doesNotMatch(page, /api\.github\.com|raw\.githubusercontent\.com/);
});

test('canvas projection exposes pan zoom fit focus minimap and read-only recursive navigation', () => {
  for (const label of ['Pan', 'Zoom out', 'Zoom in', 'Fit', 'Reset view', 'Focus selected', 'Collapse children', 'Enter portal']) {
    assert.match(page, new RegExp(label));
  }
  assert.match(page, /el\(['"]div['"],['"]minimap['"]\)/);
  assert.match(page, /Board\.zoomCameraAt/);
  assert.match(page, /Board\.cameraForBounds/);
  assert.match(page, /Board\.boardViewport/);
  assert.match(page, /Board\.visibleProjectionItems/);
  assert.match(page, /Board\.builtinBoardUrl/);
  assert.match(page, /↩ Return/);
});

test('Context Inspector remains identity-first and includes bounded neighborhood query', () => {
  assert.match(page, /Context Inspector/);
  assert.match(page, /stable identity, projection geometry, source refs/);
  assert.match(page, /nodeRef/);
  assert.match(page, /Relationships/);
  assert.match(page, /Source refs/);
  assert.match(page, /Neighborhood · bounded query/);
  assert.match(page, /Board\.queryBoardNeighborhood/);
});

test('self-map and publish-map are valid read-only built-in boards with reciprocal portal routing', () => {
  for (const source of [selfMap, publishMap]) {
    assert.equal(source.schemaVersion, Reader.VEXBOARD_DRAFT_SCHEMA);
    assert.equal(source.mode, 'READ_ONLY_SOURCE');
    const graph = normalizeBoardGraph(source.graph);
    const projection = normalizeBoardProjection(source.projection, graph);
    assert.ok(graph.nodes.length > 0);
    assert.ok(projection.items.length > 0);
  }
  const selfGraph = normalizeBoardGraph(selfMap.graph);
  assert.ok(selfGraph.nodes.some((node) => node.nodeRef === 'node.vexboard.create-new'));
  assert.ok(selfGraph.nodes.some((node) => node.nodeRef === 'node.vexboard.request-edit'));
  assert.ok(selfGraph.nodes.some((node) => node.nodeRef === 'node.vexboard.save-draft'));
  assert.ok(selfGraph.nodes.some((node) => node.detailBoardRefOrNull === 'board.vexboard.publish'));
  assert.equal(Reader.builtinBoardUrl('board.vexboard.self-map'), './self-map.json');
  assert.equal(Reader.builtinBoardUrl('board.vexboard.publish'), './publish-map.json');
  const publishGraph = normalizeBoardGraph(publishMap.graph);
  assert.ok(publishGraph.nodes.some((node) => node.detailBoardRefOrNull === 'board.vexboard.self-map'));
});

test('draft reader keeps read-only source separate from editable local fork', async () => {
  const state = await Reader.hydrateBoardState(selfMap.graph, selfMap.projection);
  const source = { ...selfMap, graph: state.graph, projection: state.projection };
  const fork = await Reader.forkReadOnlyBoard(source, { draftRef: 'draft.ui-proof' });
  assert.equal(source.mode, 'READ_ONLY_SOURCE');
  assert.equal(fork.mode, 'LOCAL_DRAFT');
  assert.equal(fork.derivedFromRefOrNull, selfMap.draftRef);
  assert.equal(fork.graph.semanticFingerprint, source.graph.semanticFingerprint);
});

// [VXG RealForever][VEXWORK][VEXBOARD][UI-PROOF]
