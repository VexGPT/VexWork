import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { normalizeBoardGraph, normalizeBoardProjection } from '../src/shared/vexboard-model.mjs';
import { normalizeBoardSourceCatalog, resolveBoardSource } from '../src/shared/vexboard-source-resolver.mjs';

const read = (relative) => JSON.parse(fs.readFileSync(new URL('../' + relative, import.meta.url), 'utf8'));

const boardPath = 'projects/vexboard/examples/vexwork-process-family-metawalk.board.json';
const sourcePath = 'docs/process/VEX-PROCESS-FAMILY-METAWALK.md';

test('MetaWalk board is one valid read-only projection of the formation source', () => {
  const board = read(boardPath);
  assert.equal(board.schemaVersion, 'vexboard.local-draft/v1');
  assert.equal(board.draftRef, 'board.vexwork.process-family-metawalk');
  assert.equal(board.mode, 'READ_ONLY_SOURCE');

  const graph = normalizeBoardGraph(board.graph);
  const projection = normalizeBoardProjection(board.projection, graph);

  assert.equal(graph.graphRef, 'graph.vexwork.process-family-metawalk');
  assert.equal(projection.graphRef, graph.graphRef);
  assert.equal(graph.nodes.length, 10);
  assert.equal(graph.relationships.length, 13);
  assert.equal(projection.items.length, graph.nodes.length);

  assert.equal(
    graph.nodes.every((node) => node.sourceRefs.includes(sourcePath)),
    true,
    'every MetaWalk node must descend to the canonical formation source',
  );
});

test('MetaWalk preserves forward shape plus explicit causal revisit edges', () => {
  const board = read(boardPath);
  const graph = normalizeBoardGraph(board.graph);
  const relationships = new Map(graph.relationships.map((relationship) => [relationship.relationshipRef, relationship]));

  const forward = [
    'rel.vexwork.process-family-metawalk.entry-recover',
    'rel.vexwork.process-family-metawalk.recover-topology',
    'rel.vexwork.process-family-metawalk.topology-ownership',
    'rel.vexwork.process-family-metawalk.ownership-contracts',
    'rel.vexwork.process-family-metawalk.contracts-proof-plan',
    'rel.vexwork.process-family-metawalk.proof-plan-implementation',
    'rel.vexwork.process-family-metawalk.implementation-focused-proof',
    'rel.vexwork.process-family-metawalk.focused-lived',
    'rel.vexwork.process-family-metawalk.lived-reconcile',
  ];
  for (const ref of forward) assert.equal(relationships.get(ref)?.kind, 'FLOW', ref);

  assert.equal(
    relationships.get('rel.vexwork.process-family-metawalk.implementation-ownership-gap')?.labelOrNull,
    'semantic ambiguity',
  );
  assert.equal(
    relationships.get('rel.vexwork.process-family-metawalk.focused-contract-gap')?.labelOrNull,
    'contract gap',
  );
  assert.equal(
    relationships.get('rel.vexwork.process-family-metawalk.lived-implementation-defect')?.labelOrNull,
    'implementation defect',
  );
});

test('MetaWalk is discoverable through the existing VexBoard source catalog without creating a second loader', () => {
  const catalog = normalizeBoardSourceCatalog(read('projects/vexboard/examples/board-source-catalog.json'));
  const resolution = resolveBoardSource('board.vexwork.process-family-metawalk', [catalog]);

  assert.equal(resolution?.catalogRef, 'catalog.vexboard.patient-zero-examples');
  assert.equal(resolution?.location, './vexwork-process-family-metawalk.board.json');
  assert.equal(resolution?.sourceRefs.includes(sourcePath), true);
  assert.equal(resolution?.sourceRefs.includes(boardPath), true);
});
