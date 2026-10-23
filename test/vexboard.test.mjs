import assert from 'node:assert/strict';
import test from 'node:test';

import { semanticHash as nodeHash } from '../src/core/semantic.mjs';
import { applyBoardControl, createBoardGraph, createBoardProjection } from '../src/core/vexboard.mjs';
import {
  BOARD_CONTROL_SCHEMA,
  BOARD_GRAPH_SCHEMA,
  BOARD_PROJECTION_SCHEMA,
  applyBoardAct,
  normalizeBoardGraph,
  normalizeBoardProjection,
} from '../src/shared/vexboard-model.mjs';
import * as Reader from '../vexboard-reader.js';

function baseGraph() {
  return {
    schemaVersion: BOARD_GRAPH_SCHEMA,
    graphRef: 'graph.demo',
    nodes: [
      { nodeRef: 'node.a', kind: 'PROCESS', label: 'A', parentRefOrNull: null, detailBoardRefOrNull: null, sourceRefs: [] },
      { nodeRef: 'node.b', kind: 'PROCESS', label: 'B', parentRefOrNull: null, detailBoardRefOrNull: null, sourceRefs: [] },
    ],
    relationships: [],
    sourceRefs: [],
  };
}

function baseProjection() {
  return {
    schemaVersion: BOARD_PROJECTION_SCHEMA,
    projectionRef: 'projection.demo',
    graphRef: 'graph.demo',
    layoutIntent: 'SEQUENCE',
    items: [
      { projectionItemRef: 'item.a', semanticRef: 'node.a', shapeKind: 'RECTANGLE', bounds: { x: 0, y: 0, width: 160, height: 80 }, layer: 0, parentProjectionItemRefOrNull: null, visible: true, locked: false },
      { projectionItemRef: 'item.b', semanticRef: 'node.b', shapeKind: 'RECTANGLE', bounds: { x: 260, y: 0, width: 160, height: 80 }, layer: 0, parentProjectionItemRefOrNull: null, visible: true, locked: false },
    ],
    sourceRefs: [],
  };
}

function control(graph, projection, act, args, ref = 'control.test') {
  return {
    schemaVersion: BOARD_CONTROL_SCHEMA,
    controlRef: ref,
    actorRef: 'actor.test',
    act,
    expectedGraphFingerprint: graph.semanticFingerprint,
    expectedProjectionFingerprint: projection.semanticFingerprint,
    arguments: args,
  };
}

test('BoardGraph identity is independent of source order and projection geometry', () => {
  const left = createBoardGraph(baseGraph());
  const reversed = baseGraph();
  reversed.nodes.reverse();
  const right = createBoardGraph(reversed);
  assert.equal(left.semanticFingerprint, right.semanticFingerprint);
  const projection = createBoardProjection(baseProjection(), left);
  const moved = structuredClone(projection);
  delete moved.semanticFingerprint;
  moved.items[0].bounds.x = 999;
  const movedProjection = createBoardProjection(moved, left);
  assert.equal(left.semanticFingerprint, right.semanticFingerprint);
  assert.notEqual(projection.semanticFingerprint, movedProjection.semanticFingerprint);
});

test('graph validation fails closed on missing refs and containment cycles', () => {
  const missing = baseGraph();
  missing.relationships.push({ relationshipRef: 'rel.bad', kind: 'FLOW', fromRef: 'node.a', toRef: 'node.missing', labelOrNull: null, sourceRefs: [] });
  assert.throws(() => normalizeBoardGraph(missing), /toRef missing/);
  const cyclic = baseGraph();
  cyclic.nodes[0].parentRefOrNull = 'node.b';
  cyclic.nodes[1].parentRefOrNull = 'node.a';
  assert.throws(() => normalizeBoardGraph(cyclic), /containment cycle/);
});

test('projection validation fails closed on invalid geometry and foreign semantic refs', () => {
  const graph = normalizeBoardGraph(baseGraph());
  const badGeometry = baseProjection();
  badGeometry.items[0].bounds.width = 0;
  assert.throws(() => normalizeBoardProjection(badGeometry, graph), /width must be positive/);
  const foreign = baseProjection();
  foreign.items[0].semanticRef = 'node.foreign';
  assert.throws(() => normalizeBoardProjection(foreign, graph), /semanticRef missing/);
});

test('projection-only controls do not mutate BoardGraph identity', () => {
  const graph = createBoardGraph(baseGraph());
  const projection = createBoardProjection(baseProjection(), graph);
  const result = applyBoardControl({
    graph,
    projection,
    control: control(graph, projection, 'MOVE_ITEM', { projectionItemRef: 'item.a', x: 45, y: 55 }),
  });
  assert.equal(result.graph.semanticFingerprint, graph.semanticFingerprint);
  assert.notEqual(result.projection.semanticFingerprint, projection.semanticFingerprint);
  assert.equal(result.projection.items.find((item) => item.projectionItemRef === 'item.a').bounds.x, 45);
  assert.deepEqual(result.effects, { graphChanged: false, projectionChanged: true, externalEffectsPerformed: false });
});

test('semantic controls create, contain and connect through one control grammar', () => {
  let graph = createBoardGraph(baseGraph());
  let projection = createBoardProjection(baseProjection(), graph);
  let result = applyBoardControl({ graph, projection, control: control(graph, projection, 'CREATE_NODE', {
    node: { nodeRef: 'node.frame', kind: 'CONTAINER', label: 'Frame', parentRefOrNull: null, detailBoardRefOrNull: null, sourceRefs: [] },
    projectionItem: { projectionItemRef: 'item.frame', semanticRef: 'node.frame', shapeKind: 'FRAME', bounds: { x: -40, y: -40, width: 520, height: 200 }, layer: -1, parentProjectionItemRefOrNull: null, visible: true, locked: false },
  }) });
  graph = result.graph; projection = result.projection;
  result = applyBoardControl({ graph, projection, control: control(graph, projection, 'SET_CONTAINMENT', {
    nodeRef: 'node.a', parentRefOrNull: 'node.frame', projectionItemRef: 'item.a', parentProjectionItemRefOrNull: 'item.frame',
  }, 'control.contain') });
  graph = result.graph; projection = result.projection;
  result = applyBoardControl({ graph, projection, control: control(graph, projection, 'CONNECT_NODES', {
    relationship: { relationshipRef: 'rel.a-b', kind: 'FLOW', fromRef: 'node.a', toRef: 'node.b', labelOrNull: 'next', sourceRefs: [] },
  }, 'control.connect') });
  assert.equal(result.graph.nodes.find((node) => node.nodeRef === 'node.a').parentRefOrNull, 'node.frame');
  assert.equal(result.projection.items.find((item) => item.projectionItemRef === 'item.a').parentProjectionItemRefOrNull, 'item.frame');
  assert.equal(result.graph.relationships[0].relationshipRef, 'rel.a-b');
  assert.equal(result.effects.externalEffectsPerformed, false);
});

test('SET_CONTAINMENT fails closed when semantic and projection identities diverge', () => {
  const graph = createBoardGraph(baseGraph());
  const projection = createBoardProjection(baseProjection(), graph);

  assert.throws(() => applyBoardControl({
    graph,
    projection,
    control: control(graph, projection, 'SET_CONTAINMENT', {
      nodeRef: 'node.a',
      parentRefOrNull: 'node.b',
      projectionItemRef: 'item.b',
      parentProjectionItemRefOrNull: 'item.a',
    }, 'control.bad-containment'),
  }), /must project node node\.a/);

  assert.throws(() => applyBoardControl({
    graph,
    projection,
    control: control(graph, projection, 'SET_CONTAINMENT', {
      nodeRef: 'node.a',
      parentRefOrNull: 'node.b',
      projectionItemRef: 'item.a',
      parentProjectionItemRefOrNull: 'item.a',
    }, 'control.bad-parent-projection'),
  }), /must project node node\.b/);

  assert.throws(() => applyBoardControl({
    graph,
    projection,
    control: control(graph, projection, 'SET_CONTAINMENT', {
      nodeRef: 'node.a',
      parentRefOrNull: null,
      projectionItemRef: 'item.a',
      parentProjectionItemRefOrNull: 'item.b',
    }, 'control.split-containment'),
  }), /must both be null or both be present/);
});

test('browser client-to-canvas conversion does not double-apply scroll offsets', () => {
  assert.deepEqual(
    Reader.localPointFromClient({ clientX: 410, clientY: 320 }, { left: -190, top: -80 }),
    { x: 600, y: 400 },
  );
  assert.throws(
    () => Reader.localPointFromClient({ clientX: Number.NaN, clientY: 0 }, { left: 0, top: 0 }),
    /clientX must be finite/,
  );
});

test('stale fingerprints and locked item movement fail closed', () => {
  const graph = createBoardGraph(baseGraph());
  const projection = createBoardProjection(baseProjection(), graph);
  const stale = control(graph, projection, 'MOVE_ITEM', { projectionItemRef: 'item.a', x: 1, y: 2 });
  stale.expectedGraphFingerprint = '0'.repeat(64);
  assert.throws(() => applyBoardControl({ graph, projection, control: stale }), /stale BoardGraph observation/);

  const lockedProjection = structuredClone(projection);
  delete lockedProjection.semanticFingerprint;
  lockedProjection.items[0].locked = true;
  const locked = createBoardProjection(lockedProjection, graph);
  assert.throws(() => applyBoardControl({
    graph,
    projection: locked,
    control: control(graph, locked, 'MOVE_ITEM', { projectionItemRef: 'item.a', x: 1, y: 2 }),
  }), /is locked/);
});

test('browser and Node semantic hashing agree on canonical Board values', async () => {
  const value = normalizeBoardGraph(baseGraph());
  assert.equal(await Reader.semanticHash(value), nodeHash(value));
});

test('local draft flow creates, forks, serializes and uses the same BoardControl shape', async () => {
  const draft = await Reader.createBlankDraft({ draftRef: 'draft.alpha', title: 'Alpha' });
  assert.equal(draft.mode, 'LOCAL_DRAFT');
  const ctrl = Reader.controlFor(draft, {
    controlRef: 'control.browser.create',
    actorRef: 'actor.browser.human',
    act: 'CREATE_NODE',
    arguments: {
      node: { nodeRef: 'node.hello', kind: 'ANNOTATION', label: 'Hello', parentRefOrNull: null, detailBoardRefOrNull: null, sourceRefs: [] },
      projectionItem: { projectionItemRef: 'item.hello', semanticRef: 'node.hello', shapeKind: 'TEXT', bounds: { x: 20, y: 30, width: 180, height: 60 }, layer: 0, parentProjectionItemRefOrNull: null, visible: true, locked: false },
    },
  });
  const state = await Reader.applyBoardControl({ graph: draft.graph, projection: draft.projection, control: ctrl });
  const changed = { ...draft, graph: state.graph, projection: state.projection, savedAtOrNull: '2026-10-23T03:15:00.000Z' };
  const roundTrip = Reader.deserializeDraft(Reader.serializeDraft(changed));
  assert.equal(roundTrip.graph.nodes[0].nodeRef, 'node.hello');
  const readOnly = { ...roundTrip, draftRef: 'board.self-map', title: 'Self map', mode: 'READ_ONLY_SOURCE' };
  const fork = await Reader.forkReadOnlyBoard(readOnly, { draftRef: 'draft.fork' });
  assert.equal(fork.derivedFromRefOrNull, 'board.self-map');
  assert.equal(fork.mode, 'LOCAL_DRAFT');
  assert.equal(fork.graph.semanticFingerprint, roundTrip.graph.semanticFingerprint);
});

test('shared model rejects schema drift rather than silently dropping unknown fields', () => {
  const graph = baseGraph();
  graph.unknown = true;
  assert.throws(() => normalizeBoardGraph(graph), /schema drift/);
  assert.throws(() => applyBoardAct({
    graph: baseGraph(),
    projection: baseProjection(),
    act: 'MOVE_ITEM',
    arguments: { projectionItemRef: 'item.a', x: 1, y: 2, mystery: 3 },
  }), /schema drift/);
});
