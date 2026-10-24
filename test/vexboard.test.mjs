import assert from 'node:assert/strict';
import test from 'node:test';

import { semanticHash as nodeHash } from '../src/core/semantic.mjs';
import { applyBoardControl, createBoardGraph, createBoardProjection } from '../src/core/vexboard.mjs';
import * as Journey from '../src/shared/vexboard-journey.mjs';
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

test('canonical ref ordering is locale-independent code-point order', () => {
  const graph = baseGraph();
  graph.nodes = [
    { nodeRef: 'node.i', kind: 'PROCESS', label: 'lower', parentRefOrNull: null, detailBoardRefOrNull: null, sourceRefs: [] },
    { nodeRef: 'node.I', kind: 'PROCESS', label: 'upper', parentRefOrNull: null, detailBoardRefOrNull: null, sourceRefs: [] },
  ];
  const normalized = normalizeBoardGraph(graph);
  assert.deepEqual(normalized.nodes.map((node) => node.nodeRef), ['node.I', 'node.i']);

  const projection = baseProjection();
  projection.items = [
    { projectionItemRef: 'item.i', semanticRef: 'node.i', shapeKind: 'RECTANGLE', bounds: { x: 0, y: 0, width: 160, height: 80 }, layer: 0, parentProjectionItemRefOrNull: null, visible: true, locked: false },
    { projectionItemRef: 'item.I', semanticRef: 'node.I', shapeKind: 'RECTANGLE', bounds: { x: 260, y: 0, width: 160, height: 80 }, layer: 0, parentProjectionItemRefOrNull: null, visible: true, locked: false },
  ];
  const normalizedProjection = normalizeBoardProjection(projection, normalized);
  assert.deepEqual(normalizedProjection.items.map((item) => item.projectionItemRef), ['item.I', 'item.i']);
});

test('canonical Board states are deeply immutable outside BoardControl', async () => {
  const graph = createBoardGraph(baseGraph());
  const projection = createBoardProjection(baseProjection(), graph);
  assert.equal(Object.isFrozen(graph.nodes), true);
  assert.equal(Object.isFrozen(graph.nodes[0]), true);
  assert.equal(Object.isFrozen(projection.items), true);
  assert.equal(Object.isFrozen(projection.items[0].bounds), true);
  assert.throws(() => { graph.nodes[0].label = 'bypass'; }, TypeError);
  assert.throws(() => { projection.items[0].bounds.x = 999; }, TypeError);

  const browser = await Reader.hydrateBoardState(baseGraph(), baseProjection());
  assert.equal(Object.isFrozen(browser.graph.nodes[0]), true);
  assert.equal(Object.isFrozen(browser.projection.items[0].bounds), true);
  assert.throws(() => { browser.graph.nodes[0].label = 'browser-bypass'; }, TypeError);
  assert.throws(() => { browser.projection.items[0].bounds.x = 999; }, TypeError);
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

test('CREATE_NODE fails closed when semantic and projection containment diverge', () => {
  const graph = createBoardGraph(baseGraph());
  const projection = createBoardProjection(baseProjection(), graph);

  assert.throws(() => applyBoardControl({
    graph,
    projection,
    control: control(graph, projection, 'CREATE_NODE', {
      node: { nodeRef: 'node.child', kind: 'PROCESS', label: 'Child', parentRefOrNull: null, detailBoardRefOrNull: null, sourceRefs: [] },
      projectionItem: { projectionItemRef: 'item.child', semanticRef: 'node.child', shapeKind: 'RECTANGLE', bounds: { x: 20, y: 120, width: 160, height: 80 }, layer: 0, parentProjectionItemRefOrNull: 'item.a', visible: true, locked: false },
    }, 'control.create-split-containment'),
  }), /must both be null or both be present/);

  assert.throws(() => applyBoardControl({
    graph,
    projection,
    control: control(graph, projection, 'CREATE_NODE', {
      node: { nodeRef: 'node.child', kind: 'PROCESS', label: 'Child', parentRefOrNull: 'node.b', detailBoardRefOrNull: null, sourceRefs: [] },
      projectionItem: { projectionItemRef: 'item.child', semanticRef: 'node.child', shapeKind: 'RECTANGLE', bounds: { x: 20, y: 120, width: 160, height: 80 }, layer: 0, parentProjectionItemRefOrNull: 'item.a', visible: true, locked: false },
    }, 'control.create-parent-mismatch'),
  }), /must project node node\.b/);

  const result = applyBoardControl({
    graph,
    projection,
    control: control(graph, projection, 'CREATE_NODE', {
      node: { nodeRef: 'node.child', kind: 'PROCESS', label: 'Child', parentRefOrNull: 'node.b', detailBoardRefOrNull: null, sourceRefs: [] },
      projectionItem: { projectionItemRef: 'item.child', semanticRef: 'node.child', shapeKind: 'RECTANGLE', bounds: { x: 20, y: 120, width: 160, height: 80 }, layer: 0, parentProjectionItemRefOrNull: 'item.b', visible: true, locked: false },
    }, 'control.create-contained'),
  });
  assert.equal(result.graph.nodes.find((node) => node.nodeRef === 'node.child').parentRefOrNull, 'node.b');
  assert.equal(result.projection.items.find((item) => item.projectionItemRef === 'item.child').parentProjectionItemRefOrNull, 'item.b');
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

test('browser reload rejects stale graph and projection fingerprints instead of healing them', async () => {
  const state = await Reader.hydrateBoardState(baseGraph(), baseProjection());

  const staleGraph = structuredClone(state.graph);
  staleGraph.nodes[0].label = 'tampered';
  await assert.rejects(
    () => Reader.hydrateBoardState(staleGraph, state.projection),
    /BoardGraph semanticFingerprint mismatch/,
  );

  const staleProjection = structuredClone(state.projection);
  staleProjection.items[0].bounds.x = 999;
  await assert.rejects(
    () => Reader.hydrateBoardState(state.graph, staleProjection),
    /BoardProjection semanticFingerprint mismatch/,
  );
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


test('canvas camera helpers preserve board coordinates while zooming and fitting', () => {
  const camera = Reader.normalizeCamera({ x: 10, y: 20, zoom: 1 });
  const zoomed = Reader.zoomCameraAt(camera, { factor: 2, anchorX: 100, anchorY: 80 });
  assert.equal(zoomed.zoom, 2);
  assert.deepEqual(Reader.boardPointFromClient({ clientX: 100, clientY: 80 }, { left: 0, top: 0 }, zoomed), { x: 90, y: 60 });
  const fit = Reader.cameraForBounds({ x: 0, y: 0, width: 400, height: 200 }, { width: 800, height: 600 }, { padding: 100 });
  assert.ok(fit.zoom > 0);
  const visible = Reader.boardViewport(fit, { width: 800, height: 600 });
  assert.ok(visible.width >= 400);
  assert.ok(visible.height >= 200);
});

test('collapsed view state hides descendants without mutating BoardGraph or BoardProjection', () => {
  const graph = baseGraph();
  graph.nodes[1].parentRefOrNull = 'node.a';
  const projection = baseProjection();
  projection.items[1].parentProjectionItemRefOrNull = 'item.a';
  const before = JSON.stringify({ graph, projection });
  const visible = Reader.visibleProjectionItems(graph, projection, ['node.a']);
  assert.deepEqual(visible.map((item) => item.semanticRef), ['node.a']);
  assert.equal(JSON.stringify({ graph, projection }), before);
});

test('bounded neighborhood query follows relationships and containment deterministically', () => {
  const graph = baseGraph();
  graph.nodes[1].parentRefOrNull = 'node.a';
  graph.relationships = [{ relationshipRef: 'rel.a-b', kind: 'FLOW', fromRef: 'node.a', toRef: 'node.b', labelOrNull: null, sourceRefs: ['source.rel'] }];
  const projection = baseProjection();
  projection.items[1].parentProjectionItemRefOrNull = 'item.a';
  const query = Reader.queryBoardNeighborhood({ graph, projection }, { semanticRef: 'node.a', depth: 1, maxNodes: 10 });
  assert.equal(query.schemaVersion, Reader.VEXBOARD_NEIGHBORHOOD_SCHEMA);
  assert.deepEqual(query.nodes.map((node) => node.nodeRef), ['node.a', 'node.b']);
  assert.deepEqual(query.relationships.map((relationship) => relationship.relationshipRef), ['rel.a-b']);
  assert.deepEqual(query.projectionItems.map((item) => item.semanticRef), ['node.a', 'node.b']);
  assert.ok(query.sourceRefs.includes('source.rel'));
  assert.throws(() => Reader.queryBoardNeighborhood({ graph, projection }, { semanticRef: 'node.missing' }), /unknown semanticRef/);
});

test('built-in board routing is explicit and fail-closed for unknown portal targets', () => {
  assert.equal(Reader.builtinBoardUrl('board.vexboard.self-map'), './self-map.json');
  assert.equal(Reader.builtinBoardUrl('board.vexboard.publish'), './publish-map.json');
  assert.equal(Reader.builtinBoardUrl('board.vexboard.unknown'), null);
});

test('BoardJourney follows explicit relationships and preserves repeated visits without mutating board truth', () => {
  const graph = baseGraph();
  graph.relationships = [
    { relationshipRef: 'rel.a-b', kind: 'FLOW', fromRef: 'node.a', toRef: 'node.b', labelOrNull: 'Next', sourceRefs: [] },
    { relationshipRef: 'rel.b-a', kind: 'FLOW', fromRef: 'node.b', toRef: 'node.a', labelOrNull: 'Loop', sourceRefs: [] },
  ];
  const before = JSON.stringify(graph);
  let journey = Journey.createBoardJourney(graph, { journeyRef: 'journey.test', boardRef: 'board.test', startRef: 'node.a' });
  assert.equal(journey.schemaVersion, Journey.BOARD_JOURNEY_SCHEMA);
  assert.deepEqual(Journey.journeyChoices(graph, journey).map((choice) => choice.relationshipRef), ['rel.a-b']);
  journey = Journey.advanceBoardJourney(graph, journey, 'rel.a-b');
  journey = Journey.advanceBoardJourney(graph, journey, 'rel.b-a');
  assert.deepEqual(journey.steps.map((step) => step.semanticRef), ['node.a', 'node.b', 'node.a']);
  assert.deepEqual(journey.steps.map((step) => step.navigationKind), ['START', 'RELATIONSHIP', 'RELATIONSHIP']);
  assert.deepEqual(journey.returnStack, ['node.a', 'node.b']);
  assert.equal(JSON.stringify(graph), before);
});

test('BoardJourney Back and Revisit append semantic history while preserving return semantics', () => {
  const graph = baseGraph();
  graph.relationships = [{ relationshipRef: 'rel.a-b', kind: 'FLOW', fromRef: 'node.a', toRef: 'node.b', labelOrNull: null, sourceRefs: [] }];
  let journey = Journey.createBoardJourney(graph, { journeyRef: 'journey.return', boardRef: 'board.test', startRef: 'node.a' });
  journey = Journey.advanceBoardJourney(graph, journey, 'rel.a-b');
  journey = Journey.backBoardJourney(graph, journey);
  assert.deepEqual(journey.steps.map((step) => [step.semanticRef, step.navigationKind]), [
    ['node.a', 'START'],
    ['node.b', 'RELATIONSHIP'],
    ['node.a', 'BACK'],
  ]);
  assert.deepEqual(journey.returnStack, []);
  journey = Journey.revisitBoardJourney(graph, journey, 1);
  assert.equal(journey.currentRef, 'node.b');
  assert.equal(journey.steps.at(-1).navigationKind, 'REVISIT');
  assert.deepEqual(journey.returnStack, ['node.a']);
});

test('BoardJourney fails closed on invalid semantic traversal coordinates', () => {
  const graph = baseGraph();
  graph.relationships = [{ relationshipRef: 'rel.a-b', kind: 'FLOW', fromRef: 'node.a', toRef: 'node.b', labelOrNull: null, sourceRefs: [] }];
  assert.throws(() => Journey.createBoardJourney(graph, { journeyRef: 'journey.bad', boardRef: 'board.test', startRef: 'node.missing' }), /startRef missing/);
  const journey = Journey.createBoardJourney(graph, { journeyRef: 'journey.bad', boardRef: 'board.test', startRef: 'node.a' });
  assert.throws(() => Journey.advanceBoardJourney(graph, journey, 'rel.missing'), /relationship missing/);
  assert.throws(() => Journey.backBoardJourney(graph, journey), /return stack is empty/);
  assert.throws(() => Journey.revisitBoardJourney(graph, journey, 99), /revisit sequence invalid/);
});

test('BoardJourney normalization rejects fabricated semantic history and return stacks', () => {
  const graph = baseGraph();
  graph.nodes.push({ nodeRef: 'node.c', kind: 'PROCESS', label: 'C', parentRefOrNull: null, detailBoardRefOrNull: null, sourceRefs: [] });
  graph.relationships = [{ relationshipRef: 'rel.a-b', kind: 'FLOW', fromRef: 'node.a', toRef: 'node.b', labelOrNull: null, sourceRefs: [] }];

  const traversed = Journey.advanceBoardJourney(
    graph,
    Journey.createBoardJourney(graph, { journeyRef: 'journey.integrity', boardRef: 'board.test', startRef: 'node.a' }),
    'rel.a-b',
  );

  const wrongDestination = structuredClone(traversed);
  wrongDestination.currentRef = 'node.a';
  wrongDestination.steps[1].semanticRef = 'node.a';
  assert.throws(() => Journey.normalizeBoardJourney(wrongDestination, graph), /relationship destination mismatch/);

  const wrongOrigin = structuredClone(traversed);
  wrongOrigin.steps[0].semanticRef = 'node.b';
  wrongOrigin.returnStack = ['node.b'];
  assert.throws(() => Journey.normalizeBoardJourney(wrongOrigin, graph), /relationship origin mismatch/);

  const restarted = structuredClone(traversed);
  restarted.steps[1].navigationKind = 'START';
  restarted.steps[1].viaRelationshipRefOrNull = null;
  restarted.returnStack = [];
  assert.throws(() => Journey.normalizeBoardJourney(restarted, graph), /cannot restart an existing journey/);

  const backed = Journey.backBoardJourney(graph, traversed);
  const wrongBackTarget = structuredClone(backed);
  wrongBackTarget.currentRef = 'node.b';
  wrongBackTarget.steps.at(-1).semanticRef = 'node.b';
  assert.throws(() => Journey.normalizeBoardJourney(wrongBackTarget, graph), /BACK target mismatch/);

  const unseenRevisit = structuredClone(Journey.createBoardJourney(
    graph,
    { journeyRef: 'journey.revisit-integrity', boardRef: 'board.test', startRef: 'node.a' },
  ));
  unseenRevisit.currentRef = 'node.c';
  unseenRevisit.steps.push({ sequence: 1, semanticRef: 'node.c', navigationKind: 'REVISIT', viaRelationshipRefOrNull: null });
  unseenRevisit.returnStack = ['node.a'];
  assert.throws(() => Journey.normalizeBoardJourney(unseenRevisit, graph), /REVISIT target was not previously visited/);

  const wrongStack = structuredClone(traversed);
  wrongStack.returnStack = ['node.b'];
  assert.throws(() => Journey.normalizeBoardJourney(wrongStack, graph), /returnStack does not match journey history/);
});

test('BoardJourney choices preserve canonical locale-independent ref ordering', () => {
  const graph = baseGraph();
  graph.relationships = [
    { relationshipRef: 'rel.i', kind: 'FLOW', fromRef: 'node.a', toRef: 'node.b', labelOrNull: 'lower', sourceRefs: [] },
    { relationshipRef: 'rel.I', kind: 'FLOW', fromRef: 'node.a', toRef: 'node.b', labelOrNull: 'upper', sourceRefs: [] },
  ];
  const journey = Journey.createBoardJourney(graph, {
    journeyRef: 'journey.canonical-order',
    boardRef: 'board.test',
    startRef: 'node.a',
  });
  assert.deepEqual(
    Journey.journeyChoices(graph, journey).map((choice) => choice.relationshipRef),
    ['rel.I', 'rel.i'],
  );
});
