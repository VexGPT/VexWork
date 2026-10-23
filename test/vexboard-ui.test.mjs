import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import * as Reader from '../vexboard-reader.js';
import { normalizeBoardGraph, normalizeBoardProjection } from '../src/shared/vexboard-model.mjs';

const page = fs.readFileSync(new URL('../vexboard/index.html', import.meta.url), 'utf8');
const selfMap = JSON.parse(fs.readFileSync(new URL('../vexboard/self-map.json', import.meta.url), 'utf8'));

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
  assert.doesNotMatch(page, /method:\s*['"](?:POST|PUT|PATCH|DELETE)['"]/i);
  assert.doesNotMatch(page, /api\.github\.com|raw\.githubusercontent\.com/);
});

test('self-map is a valid read-only VexBoard source that documents how to begin', () => {
  assert.equal(selfMap.schemaVersion, Reader.VEXBOARD_DRAFT_SCHEMA);
  assert.equal(selfMap.mode, 'READ_ONLY_SOURCE');
  const graph = normalizeBoardGraph(selfMap.graph);
  const projection = normalizeBoardProjection(selfMap.projection, graph);
  assert.ok(graph.nodes.some((node) => node.nodeRef === 'node.vexboard.create-new'));
  assert.ok(graph.nodes.some((node) => node.nodeRef === 'node.vexboard.request-edit'));
  assert.ok(graph.nodes.some((node) => node.nodeRef === 'node.vexboard.save-draft'));
  assert.ok(graph.relationships.length >= 7);
  assert.equal(projection.layoutIntent, 'SCREEN_FLOW');
});

test('Context Inspector is identity-first and source-aware in the initial UI slice', () => {
  assert.match(page, /Context Inspector/);
  assert.match(page, /stable identity, projection geometry, source refs/);
  assert.match(page, /nodeRef/);
  assert.match(page, /Relationships/);
  assert.match(page, /Source refs/);
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
