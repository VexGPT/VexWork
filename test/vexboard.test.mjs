import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { semanticHash as nodeHash } from '../src/core/semantic.mjs';
import { applyBoardControl, createBoardGraph, createBoardProjection } from '../src/core/vexboard.mjs';
import * as Journey from '../src/shared/vexboard-journey.mjs';
import * as Simulation from '../src/shared/vexboard-simulation.mjs';
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
  const readOnly = {
    ...roundTrip,
    draftRef: 'board.self-map',
    title: 'Self map',
    mode: 'READ_ONLY_SOURCE',
    presentation: {
      schemaVersion: 'vexboard.test-presentation/v1',
      profileRef: 'profile.test',
    },
    design: {
      schemaVersion: 'vexboard.screen-design/poc-v1',
      designRef: 'design.test',
      authorityState: 'REVERSE_ADOPTED_CANDIDATE',
      referenceViewport: { profileRef: 'profile.test.phone', widthDp: 412, heightDp: 915 },
      constraints: [],
    },
    adoptionCoverage: {
      schemaVersion: 'vexlife-android.vexboard-adoption-coverage/poc-v1',
      screenRealizationModes: {
        'screen.test': 'CUSTOM_NATIVE_REALIZATION',
      },
      identityExceptions: [{
        semanticRef: 'element.test.derived',
        origin: 'DERIVED_CUSTOM_PRESENTATION',
        staticRegistryStatus: 'UNREGISTERED_STATIC',
        sourceRefs: ['repo.test:source'],
      }],
    },
    adoptionReadiness: {
      schemaVersion: 'vexlife-android.vexboard-adoption-readiness/poc-v1',
      status: 'HELD',
      blockingFindingRefs: ['finding.test'],
      identityExceptionCount: 1,
      findingCount: 1,
    },
    sourceRefs: ['repo.test:source'],
  };
  const fork = await Reader.forkReadOnlyBoard(readOnly, { draftRef: 'draft.fork' });
  assert.equal(fork.derivedFromRefOrNull, 'board.self-map');
  assert.equal(fork.mode, 'LOCAL_DRAFT');
  assert.equal(fork.graph.semanticFingerprint, roundTrip.graph.semanticFingerprint);
  assert.deepEqual(fork.presentation, readOnly.presentation);
  assert.deepEqual(fork.design, readOnly.design);
  assert.deepEqual(fork.adoptionCoverage, readOnly.adoptionCoverage);
  assert.deepEqual(fork.adoptionReadiness, readOnly.adoptionReadiness);
  assert.deepEqual(fork.sourceRefs, readOnly.sourceRefs);
  assert.notEqual(fork.presentation, readOnly.presentation, 'fork must retain presentation by value, not shared object identity');
  assert.notEqual(fork.design, readOnly.design, 'fork must retain design constraints by value, not shared object identity');
  assert.notEqual(
    fork.adoptionCoverage,
    readOnly.adoptionCoverage,
    'fork must retain adoption coverage by value, not shared object identity',
  );
  assert.notEqual(
    fork.adoptionReadiness,
    readOnly.adoptionReadiness,
    'fork must retain adoption readiness by value, not shared object identity',
  );

  const forkRoundTrip = Reader.deserializeDraft(Reader.serializeDraft(fork));
  assert.deepEqual(forkRoundTrip.presentation, fork.presentation);
  assert.deepEqual(forkRoundTrip.design, fork.design);
  assert.deepEqual(forkRoundTrip.adoptionCoverage, fork.adoptionCoverage);
  assert.deepEqual(forkRoundTrip.adoptionReadiness, fork.adoptionReadiness);
  assert.deepEqual(forkRoundTrip.sourceRefs, fork.sourceRefs);
  const collectionRoundTrip = Reader.parseDraftCollection(JSON.stringify(
    Reader.upsertDraft([], forkRoundTrip),
  ));
  assert.deepEqual(collectionRoundTrip[0].design, fork.design);
  assert.deepEqual(collectionRoundTrip[0].presentation, fork.presentation);
  assert.deepEqual(collectionRoundTrip[0].adoptionCoverage, fork.adoptionCoverage);
  assert.deepEqual(collectionRoundTrip[0].adoptionReadiness, fork.adoptionReadiness);
});

test('read-only fork preserves optional Family Kotlin construction sidecar', async () => {
  const source = {
    schemaVersion: Reader.VEXBOARD_DRAFT_SCHEMA,
    draftRef: 'board.family-kotlin.source',
    title: 'Family Kotlin source',
    mode: 'READ_ONLY_SOURCE',
    derivedFromRefOrNull: null,
    savedAtOrNull: null,
    graph: baseGraph(),
    projection: baseProjection(),
    familyKotlin: {
      schemaVersion: 'vexboard.family-kotlin/poc-v1',
      modelRef: 'model.family-kotlin.test',
      targetSourceRefOrNull: null,
      testSourceRef: 'repo.test:FamilyTest.kt',
      families: [{
        familyRef: 'family.test',
        familyName: 'TestFamily',
        controlForm: 'SEALED',
        states: ['Idle'],
        resources: [],
        controls: [{
          controlRef: 'control.keep',
          name: 'Keep',
          resourceIdRefOrNull: null,
          payloadFields: [],
        }],
      }],
      sourceRefs: ['repo.test:FamilyTest.kt'],
    },
  };

  const fork = await Reader.forkReadOnlyBoard(source, { draftRef: 'draft.family-kotlin' });
  assert.deepEqual(fork.familyKotlin, source.familyKotlin);
  assert.notEqual(fork.familyKotlin, source.familyKotlin);
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

test('multi-ID relational focus connects, traces and projects repeated occurrences without semantic mutation', () => {
  const graph = baseGraph();
  graph.nodes.push(
    { nodeRef: 'node.c', kind: 'ARTIFACT', label: 'C', parentRefOrNull: null, detailBoardRefOrNull: null, sourceRefs: ['source.c'] },
    { nodeRef: 'node.d', kind: 'ARTIFACT', label: 'D', parentRefOrNull: null, detailBoardRefOrNull: null, sourceRefs: ['source.d'] },
  );
  graph.relationships = [
    { relationshipRef: 'rel.a-b', kind: 'DATA', fromRef: 'node.a', toRef: 'node.b', labelOrNull: 'A_TO_B', sourceRefs: ['source.a-b'] },
    { relationshipRef: 'rel.b-c', kind: 'DATA', fromRef: 'node.b', toRef: 'node.c', labelOrNull: 'B_TO_C', sourceRefs: ['source.b-c'] },
    { relationshipRef: 'rel.a-d', kind: 'REFERENCE', fromRef: 'node.a', toRef: 'node.d', labelOrNull: 'A_TO_D', sourceRefs: ['source.a-d'] },
  ];
  const projection = baseProjection();
  projection.items.push(
    { projectionItemRef: 'item.b.second', semanticRef: 'node.b', shapeKind: 'RECTANGLE', bounds: { x: 260, y: 180, width: 160, height: 80 }, layer: 4, parentProjectionItemRefOrNull: null, visible: true, locked: false },
    { projectionItemRef: 'item.c', semanticRef: 'node.c', shapeKind: 'RECTANGLE', bounds: { x: 520, y: 0, width: 160, height: 80 }, layer: 0, parentProjectionItemRefOrNull: null, visible: true, locked: false },
    { projectionItemRef: 'item.d', semanticRef: 'node.d', shapeKind: 'RECTANGLE', bounds: { x: 0, y: 180, width: 160, height: 80 }, layer: 0, parentProjectionItemRefOrNull: null, visible: true, locked: false },
  );
  const before = JSON.stringify({ graph, projection });

  const connected = Reader.queryBoardRelationalFocus(
    { graph, projection },
    { semanticRefs: ['node.c', 'node.a'], mode: 'CONNECT', maxDepth: 4, maxNodes: 10 },
  );
  assert.equal(connected.schemaVersion, Reader.VEXBOARD_RELATIONAL_FOCUS_SCHEMA);
  assert.deepEqual(connected.pinnedRefs, ['node.a', 'node.c']);
  assert.deepEqual(connected.nodes.map((node) => node.nodeRef), ['node.a', 'node.b', 'node.c']);
  assert.deepEqual(connected.relationships.map((relationship) => relationship.relationshipRef), ['rel.a-b', 'rel.b-c']);
  assert.deepEqual(
    connected.projectionItems.filter((item) => item.semanticRef === 'node.b').map((item) => item.projectionItemRef),
    ['item.b', 'item.b.second'],
  );
  assert.deepEqual(connected.unconnectedRefs, []);
  assert.equal(connected.truncated, false);

  const direct = Reader.queryBoardRelationalFocus(
    { graph, projection },
    { semanticRefs: ['node.a', 'node.c'], mode: 'DIRECT' },
  );
  assert.deepEqual(direct.nodes.map((node) => node.nodeRef), ['node.a', 'node.c']);
  assert.deepEqual(direct.relationships, []);

  const downstream = Reader.queryBoardRelationalFocus(
    { graph, projection },
    { semanticRefs: ['node.a'], mode: 'DOWNSTREAM', maxDepth: 2, maxNodes: 10 },
  );
  assert.deepEqual(downstream.nodes.map((node) => node.nodeRef), ['node.a', 'node.b', 'node.c', 'node.d']);
  assert.deepEqual(downstream.relationships.map((relationship) => relationship.relationshipRef), ['rel.a-b', 'rel.a-d', 'rel.b-c']);

  const upstream = Reader.queryBoardRelationalFocus(
    { graph, projection },
    { semanticRefs: ['node.c'], mode: 'UPSTREAM', maxDepth: 2, maxNodes: 10 },
  );
  assert.deepEqual(upstream.nodes.map((node) => node.nodeRef), ['node.a', 'node.b', 'node.c']);
  assert.deepEqual(upstream.relationships.map((relationship) => relationship.relationshipRef), ['rel.a-b', 'rel.b-c']);

  const occurrences = Reader.queryBoardRelationalFocus(
    { graph, projection },
    { semanticRefs: ['node.b'], mode: 'OCCURRENCES' },
  );
  assert.equal(occurrences.relationships.length, 0);
  assert.deepEqual(occurrences.projectionItems.map((item) => item.projectionItemRef), ['item.b', 'item.b.second']);

  assert.equal(JSON.stringify({ graph, projection }), before);
  assert.throws(
    () => Reader.queryBoardRelationalFocus({ graph, projection }, { semanticRefs: ['node.a', 'node.a'] }),
    /semanticRefs must be unique/,
  );
  assert.throws(
    () => Reader.queryBoardRelationalFocus({ graph, projection }, { semanticRefs: ['node.missing'] }),
    /unknown semanticRef/,
  );
  assert.throws(
    () => Reader.queryBoardRelationalFocus({ graph, projection }, { semanticRefs: ['node.a'], mode: 'EVERYTHING' }),
    /unsupported relational focus mode/,
  );
});
test('built-in board routing is explicit and fail-closed for unknown portal targets', () => {
  assert.equal(Reader.builtinBoardUrl('board.vexboard.self-map'), './self-map.json');
  assert.equal(Reader.builtinBoardUrl('board.vexboard.publish'), './publish-map.json');
  assert.equal(Reader.builtinBoardUrl('board.vexboard.unknown'), null);
});

test('VexBoard how-to-begin map exposes the accepted MetaWalk as a read-only onboarding portal', () => {
  const selfMap = JSON.parse(fs.readFileSync(new URL('../vexboard/self-map.json', import.meta.url), 'utf8'));
  const graph = normalizeBoardGraph(selfMap.graph);
  const projection = normalizeBoardProjection(selfMap.projection, graph);

  assert.equal(selfMap.draftRef, 'board.vexboard.self-map');
  assert.equal(selfMap.title, 'VexBoard — how to begin');
  assert.equal(selfMap.mode, 'READ_ONLY_SOURCE');

  const createNew = graph.nodes.find((node) => node.nodeRef === 'node.vexboard.create-new');
  assert.ok(createNew, 'existing Create new control must remain present');
  assert.deepEqual(
    createNew.sourceRefs,
    ['vexboard/index.html'],
    'MetaWalk onboarding must not inflate unrelated Create new provenance',
  );

  const portal = graph.nodes.find((node) => node.nodeRef === 'node.vexboard.vexwork-metawalk');
  assert.ok(portal, 'how-to-begin map must expose one MetaWalk onboarding portal');
  assert.equal(portal.kind, 'PORTAL');
  assert.equal(portal.label, 'VexWork Onboarding · MetaWalk');
  assert.equal(portal.detailBoardRefOrNull, 'board.vexwork.process-family-metawalk');
  assert.equal(portal.sourceRefs.includes('docs/process/VEX-PROCESS-FAMILY-METAWALK.md'), true);
  assert.equal(portal.sourceRefs.includes('docs/foundation/VEXWORK-ORIENTATION.md'), true);
  assert.equal(portal.sourceRefs.includes('orientation.html'), true);
  assert.equal(
    portal.sourceRefs.includes('projects/vexboard/examples/vexwork-process-family-metawalk.board.json'),
    true,
  );

  const relationship = graph.relationships.find(
    (entry) => entry.relationshipRef === 'rel.vexboard.entry-metawalk',
  );
  assert.ok(relationship, 'self-map must relate its entry to the MetaWalk portal');
  assert.equal(relationship.kind, 'REFERENCE');
  assert.equal(relationship.fromRef, 'node.vexboard.entry');
  assert.equal(relationship.toRef, portal.nodeRef);
  assert.equal(relationship.labelOrNull, 'continue work');

  const projected = projection.items.find(
    (item) => item.semanticRef === portal.nodeRef,
  );
  assert.ok(projected, 'MetaWalk onboarding portal must be visible in the self-map projection');
  assert.equal(projected.visible, true);

  assert.equal(
    Reader.builtinBoardUrl('board.vexwork.process-family-metawalk'),
    null,
    'MetaWalk remains source-catalog-owned rather than becoming a second built-in board route',
  );
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

test('BoardJourney Back pops semantic history while Revisit remains explicit navigation', () => {
  const graph = baseGraph();
  graph.relationships = [{ relationshipRef: 'rel.a-b', kind: 'FLOW', fromRef: 'node.a', toRef: 'node.b', labelOrNull: null, sourceRefs: [] }];
  let journey = Journey.createBoardJourney(graph, { journeyRef: 'journey.return', boardRef: 'board.test', startRef: 'node.a' });
  journey = Journey.advanceBoardJourney(graph, journey, 'rel.a-b');
  journey = Journey.revisitBoardJourney(graph, journey, 0);
  assert.deepEqual(journey.steps.map((step) => [step.semanticRef, step.navigationKind]), [
    ['node.a', 'START'],
    ['node.b', 'RELATIONSHIP'],
    ['node.a', 'REVISIT'],
  ]);
  assert.deepEqual(journey.returnStack, ['node.a', 'node.b']);

  journey = Journey.backBoardJourney(graph, journey);
  assert.deepEqual(journey.steps.map((step) => [step.semanticRef, step.navigationKind]), [
    ['node.a', 'START'],
    ['node.b', 'RELATIONSHIP'],
  ]);
  assert.deepEqual(journey.returnStack, ['node.a']);

  journey = Journey.backBoardJourney(graph, journey);
  assert.deepEqual(journey.steps.map((step) => [step.semanticRef, step.navigationKind]), [
    ['node.a', 'START'],
  ]);
  assert.deepEqual(journey.returnStack, []);
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

  const legacyBack = structuredClone(traversed);
  legacyBack.currentRef = 'node.a';
  legacyBack.steps.push({
    sequence: 2,
    semanticRef: 'node.a',
    navigationKind: 'BACK',
    viaRelationshipRefOrNull: null,
  });
  legacyBack.returnStack = [];
  assert.equal(Journey.normalizeBoardJourney(legacyBack, graph).currentRef, 'node.a');

  const wrongBackTarget = structuredClone(legacyBack);
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


function simulationGraph() {
  return {
    schemaVersion: BOARD_GRAPH_SCHEMA,
    graphRef: 'graph.simulation',
    nodes: [
      { nodeRef: 'node.control.submit', kind: 'CONTROL', label: 'Submit', parentRefOrNull: null, detailBoardRefOrNull: null, sourceRefs: [] },
      { nodeRef: 'node.control.back', kind: 'CONTROL', label: 'Back', parentRefOrNull: null, detailBoardRefOrNull: null, sourceRefs: [] },
      { nodeRef: 'node.scene.done', kind: 'SCENE', label: 'Done', parentRefOrNull: null, detailBoardRefOrNull: null, sourceRefs: [] },
      { nodeRef: 'node.process.other', kind: 'PROCESS', label: 'Other', parentRefOrNull: null, detailBoardRefOrNull: null, sourceRefs: [] },
    ],
    relationships: [
      { relationshipRef: 'rel.submit-done', kind: 'TRANSITION', fromRef: 'node.control.submit', toRef: 'node.scene.done', labelOrNull: 'continue', sourceRefs: [] },
      { relationshipRef: 'rel.done-back', kind: 'FLOW', fromRef: 'node.scene.done', toRef: 'node.control.back', labelOrNull: null, sourceRefs: [] },
      { relationshipRef: 'rel.submit-other', kind: 'FLOW', fromRef: 'node.control.submit', toRef: 'node.process.other', labelOrNull: null, sourceRefs: [] },
    ],
    sourceRefs: [],
  };
}

function simulationPrototype() {
  return {
    schemaVersion: Simulation.BOARD_PROTOTYPE_SCHEMA,
    prototypeRef: 'prototype.simulation',
    graphRef: 'graph.simulation',
    overlays: [
      { overlayRef: 'overlay.success', label: 'Success', sourceRefs: [] },
    ],
    interactions: [
      {
        interactionRef: 'interaction.submit',
        controlRef: 'node.control.submit',
        trigger: 'CLICK',
        conditionOrNull: {
          conditionRef: 'condition.can-submit',
          valueRef: 'value.can-submit',
          operator: 'EQUALS',
          expectedValueOrNull: true,
        },
        actions: [
          { actionRef: 'action.mark-submitted', kind: 'SET_SCENARIO_VALUE', arguments: { valueRef: 'value.submitted', value: true } },
          { actionRef: 'action.open-success', kind: 'OPEN_OVERLAY', arguments: { overlayRef: 'overlay.success' } },
          { actionRef: 'action.focus-done', kind: 'FOCUS_NODE', arguments: { semanticRef: 'node.scene.done' } },
          { actionRef: 'action.emit-submitted', kind: 'EMIT_SIMULATED_EVENT', arguments: { eventRef: 'event.submitted' } },
          { actionRef: 'action.navigate-done', kind: 'NAVIGATE_TO_SCENE', arguments: { relationshipRef: 'rel.submit-done' } },
        ],
        sourceRefs: [],
      },
      {
        interactionRef: 'interaction.back',
        controlRef: 'node.control.back',
        trigger: 'BACK',
        conditionOrNull: null,
        actions: [
          { actionRef: 'action.close-success', kind: 'CLOSE_OVERLAY', arguments: { overlayRef: 'overlay.success' } },
          { actionRef: 'action.return', kind: 'RETURN', arguments: {} },
        ],
        sourceRefs: [],
      },
    ],
    sourceRefs: [],
  };
}

test('prototype simulation applies ordered local actions and performs zero external effects', () => {
  const graph = simulationGraph();
  const prototype = Simulation.normalizeBoardPrototype(simulationPrototype(), graph);
  const scenario = Simulation.createBoardScenario(prototype, graph, {
    scenarioRef: 'scenario.allowed',
    values: [
      { valueRef: 'value.can-submit', value: true },
      { valueRef: 'value.submitted', value: false },
    ],
  });
  const journey = Journey.createBoardJourney(graph, {
    journeyRef: 'journey.simulation',
    boardRef: 'board.simulation',
    startRef: 'node.control.submit',
  });
  const result = Simulation.applyBoardInteraction({
    graph,
    journey,
    prototype,
    scenario,
    interactionRef: 'interaction.submit',
  });
  assert.equal(result.schemaVersion, Simulation.BOARD_SIMULATION_RESULT_SCHEMA);
  assert.equal(result.conditionState, 'TRUE');
  assert.equal(result.journey.currentRef, 'node.scene.done');
  assert.equal(result.journey.steps.at(-1).viaRelationshipRefOrNull, 'rel.submit-done');
  assert.equal(result.scenario.values.find((entry) => entry.valueRef === 'value.submitted').value, true);
  assert.deepEqual(result.scenario.openOverlayRefs, ['overlay.success']);
  assert.equal(result.focusRefOrNull, 'node.scene.done');
  assert.deepEqual(result.emittedEventRefs, ['event.submitted']);
  assert.deepEqual(result.effects, { externalEffectsPerformed: false });
  assert.deepEqual(scenario.openOverlayRefs, []);
  assert.equal(scenario.values.find((entry) => entry.valueRef === 'value.submitted').value, false);
});

test('prototype conditions distinguish TRUE FALSE and UNKNOWN without inventing missing scenario truth', () => {
  const graph = simulationGraph();
  const prototype = Simulation.normalizeBoardPrototype(simulationPrototype(), graph);
  const condition = prototype.interactions.find((entry) => entry.interactionRef === 'interaction.submit').conditionOrNull;
  const makeScenario = (scenarioRef, values) => Simulation.createBoardScenario(prototype, graph, { scenarioRef, values });
  const allowed = makeScenario('scenario.true', [{ valueRef: 'value.can-submit', value: true }]);
  const blocked = makeScenario('scenario.false', [{ valueRef: 'value.can-submit', value: false }]);
  const unknown = makeScenario('scenario.unknown', []);
  assert.equal(Simulation.evaluateBoardCondition(condition, allowed, prototype, graph), 'TRUE');
  assert.equal(Simulation.evaluateBoardCondition(condition, blocked, prototype, graph), 'FALSE');
  assert.equal(Simulation.evaluateBoardCondition(condition, unknown, prototype, graph), 'UNKNOWN');
  assert.deepEqual(
    Simulation.boardInteractionChoices(graph, prototype, unknown, { controlRef: 'node.control.submit', trigger: 'CLICK' }),
    [{
      interactionRef: 'interaction.submit',
      controlRef: 'node.control.submit',
      trigger: 'CLICK',
      conditionRefOrNull: 'condition.can-submit',
      conditionState: 'UNKNOWN',
    }],
  );
  const journey = Journey.createBoardJourney(graph, { journeyRef: 'journey.blocked', boardRef: 'board.simulation', startRef: 'node.control.submit' });
  assert.throws(() => Simulation.applyBoardInteraction({
    graph, journey, prototype, scenario: blocked, interactionRef: 'interaction.submit',
  }), /condition is FALSE/);
  assert.throws(() => Simulation.applyBoardInteraction({
    graph, journey, prototype, scenario: unknown, interactionRef: 'interaction.submit',
  }), /condition is UNKNOWN/);
});

test('prototype condition operators and unconditional choices evaluate deterministically', () => {
  const graph = simulationGraph();
  for (const [operator, expectedValueOrNull, observedValue, expectedState] of [
    ['NOT_EQUALS', 'blocked', 'ready', 'TRUE'],
    ['NOT_EQUALS', 'ready', 'ready', 'FALSE'],
    ['TRUTHY', null, 'ready', 'TRUE'],
    ['TRUTHY', null, '', 'FALSE'],
    ['FALSY', null, 0, 'TRUE'],
    ['FALSY', null, 1, 'FALSE'],
  ]) {
    const input = simulationPrototype();
    input.interactions[0].conditionOrNull = {
      conditionRef: 'condition.operator',
      valueRef: 'value.operator',
      operator,
      expectedValueOrNull,
    };
    input.interactions[0].actions[0].arguments.valueRef = 'value.operator';
    const prototype = Simulation.normalizeBoardPrototype(input, graph);
    const scenario = Simulation.createBoardScenario(prototype, graph, {
      scenarioRef: `scenario.${operator.toLowerCase()}.${String(observedValue || 'empty')}`,
      values: [{ valueRef: 'value.operator', value: observedValue }],
    });
    const condition = prototype.interactions.find((entry) => entry.interactionRef === 'interaction.submit').conditionOrNull;
    assert.equal(Simulation.evaluateBoardCondition(condition, scenario, prototype, graph), expectedState);
  }

  const prototype = Simulation.normalizeBoardPrototype(simulationPrototype(), graph);
  const scenario = Simulation.createBoardScenario(prototype, graph, { scenarioRef: 'scenario.unconditional' });
  assert.deepEqual(
    Simulation.boardInteractionChoices(graph, prototype, scenario, { controlRef: 'node.control.back', trigger: 'BACK' }),
    [{
      interactionRef: 'interaction.back',
      controlRef: 'node.control.back',
      trigger: 'BACK',
      conditionRefOrNull: null,
      conditionState: 'TRUE',
    }],
  );
});

test('prototype RETURN uses BoardJourney return semantics while scenario overlays remain simulation state', () => {
  const graph = simulationGraph();
  const prototype = Simulation.normalizeBoardPrototype(simulationPrototype(), graph);
  let journey = Journey.createBoardJourney(graph, { journeyRef: 'journey.return-sim', boardRef: 'board.simulation', startRef: 'node.control.submit' });
  journey = Journey.advanceBoardJourney(graph, journey, 'rel.submit-done');
  journey = Journey.advanceBoardJourney(graph, journey, 'rel.done-back');
  const scenario = Simulation.normalizeBoardScenario({
    schemaVersion: Simulation.BOARD_SCENARIO_SCHEMA,
    scenarioRef: 'scenario.return',
    prototypeRef: prototype.prototypeRef,
    values: [{ valueRef: 'value.can-submit', value: true }],
    openOverlayRefs: ['overlay.success'],
  }, prototype, graph);
  const result = Simulation.applyBoardInteraction({
    graph, journey, prototype, scenario, interactionRef: 'interaction.back',
  });
  assert.equal(result.journey.currentRef, 'node.scene.done');
  assert.deepEqual(result.journey.steps.map((step) => [step.semanticRef, step.navigationKind]), [
    ['node.control.submit', 'START'],
    ['node.scene.done', 'RELATIONSHIP'],
  ]);
  assert.deepEqual(result.journey.returnStack, ['node.control.submit']);
  assert.deepEqual(result.scenario.openOverlayRefs, []);
  assert.deepEqual(result.effects, { externalEffectsPerformed: false });
});

test('prototype validation fails closed on invalid controls, navigation, action ordering and hidden scenario state', () => {
  const graph = simulationGraph();

  const nonControl = simulationPrototype();
  nonControl.interactions[0].controlRef = 'node.process.other';
  assert.throws(() => Simulation.normalizeBoardPrototype(nonControl, graph), /controlRef must reference one CONTROL/);

  const wrongTarget = simulationPrototype();
  wrongTarget.interactions[0].actions.at(-1).arguments.relationshipRef = 'rel.submit-other';
  const wrongTargetGraph = simulationGraph();
  wrongTargetGraph.relationships.find((relationship) => relationship.relationshipRef === 'rel.submit-other').kind = 'TRANSITION';
  assert.throws(() => Simulation.normalizeBoardPrototype(wrongTarget, wrongTargetGraph), /target must be SCENE/);

  const wrongRelationshipKindGraph = simulationGraph();
  wrongRelationshipKindGraph.relationships.find((relationship) => relationship.relationshipRef === 'rel.submit-done').kind = 'REFERENCE';
  assert.throws(
    () => Simulation.normalizeBoardPrototype(simulationPrototype(), wrongRelationshipKindGraph),
    /NAVIGATE_TO_SCENE relationship must be TRANSITION/,
  );

  const badOrder = simulationPrototype();
  badOrder.interactions[0].actions = [
    { actionRef: 'action.navigate-first', kind: 'NAVIGATE_TO_SCENE', arguments: { relationshipRef: 'rel.submit-done' } },
    { actionRef: 'action.event-after', kind: 'EMIT_SIMULATED_EVENT', arguments: { eventRef: 'event.after' } },
  ];
  assert.throws(() => Simulation.normalizeBoardPrototype(badOrder, graph), /semantic traversal action must be last/);

  const duplicateTraversal = simulationPrototype();
  duplicateTraversal.interactions[0].actions.push({ actionRef: 'action.return-too', kind: 'RETURN', arguments: {} });
  assert.throws(() => Simulation.normalizeBoardPrototype(duplicateTraversal, graph), /at most one semantic traversal action/);

  const unknownOverlay = simulationPrototype();
  unknownOverlay.interactions[0].actions[1].arguments.overlayRef = 'overlay.missing';
  assert.throws(() => Simulation.normalizeBoardPrototype(unknownOverlay, graph), /overlay missing/);

  const prototype = Simulation.normalizeBoardPrototype(simulationPrototype(), graph);
  assert.throws(() => Simulation.createBoardScenario(prototype, graph, {
    scenarioRef: 'scenario.hidden',
    values: [{ valueRef: 'value.unowned', value: true }],
  }), /undeclared valueRef/);
});

test('prototype condition and schema validation reject drift, undeclared condition identity and invalid primitive values', () => {
  const graph = simulationGraph();
  const prototype = Simulation.normalizeBoardPrototype(simulationPrototype(), graph);
  const scenario = Simulation.createBoardScenario(prototype, graph, {
    scenarioRef: 'scenario.condition',
    values: [{ valueRef: 'value.can-submit', value: true }],
  });
  const condition = structuredClone(prototype.interactions.find((entry) => entry.interactionRef === 'interaction.submit').conditionOrNull);
  const drifted = structuredClone(condition);
  drifted.expectedValueOrNull = false;
  assert.throws(() => Simulation.evaluateBoardCondition(drifted, scenario, prototype, graph), /does not match prototype declaration/);

  const undeclared = structuredClone(condition);
  undeclared.conditionRef = 'condition.undeclared';
  assert.throws(() => Simulation.evaluateBoardCondition(undeclared, scenario, prototype, graph), /condition not declared/);

  const badCondition = simulationPrototype();
  badCondition.interactions[0].conditionOrNull = {
    conditionRef: 'condition.bad',
    valueRef: 'value.can-submit',
    operator: 'TRUTHY',
    expectedValueOrNull: true,
  };
  assert.throws(() => Simulation.normalizeBoardPrototype(badCondition, graph), /cannot carry an expected value/);

  const badValue = simulationPrototype();
  badValue.interactions[0].actions[0].arguments.value = { nested: true };
  assert.throws(() => Simulation.normalizeBoardPrototype(badValue, graph), /must be one JSON primitive/);

  const drift = simulationPrototype();
  drift.mystery = true;
  assert.throws(() => Simulation.normalizeBoardPrototype(drift, graph), /schema drift/);
});
