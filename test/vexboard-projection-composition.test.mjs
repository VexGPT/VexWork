import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  BOARD_LOCAL_BOUNDARY_POLICIES,
  BOARD_LOCAL_LAYOUT_MODES,
  BOARD_PROJECTION_COMPOSITION_SCHEMA,
  BOARD_PROJECTION_COMPOSITION_RESULT_SCHEMA,
  resolveBoardProjectionComposition,
} from '../src/core/vexboard-projection-composition.mjs';
import { createBoardGraph, createBoardProjection } from '../src/core/vexboard.mjs';
import { BOARD_GRAPH_SCHEMA, BOARD_PROJECTION_SCHEMA } from '../src/shared/vexboard-model.mjs';

const read = (relative) => JSON.parse(fs.readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8'));
const BOUNDARY_POLICY_LAYOUT_ERROR_MESSAGE = 'boundary policy WRAP requires ROW or COLUMN layout';

function uiGraphInput() {
  const node = (nodeRef, kind, label, parentRefOrNull = null) => ({
    nodeRef, kind, label, parentRefOrNull, detailBoardRefOrNull: null, sourceRefs: [],
  });
  return {
    schemaVersion: BOARD_GRAPH_SCHEMA,
    graphRef: 'graph.vexboard.composition.ui',
    nodes: [
      node('node.screen', 'SCENE', 'Screen'),
      node('node.header', 'CONTAINER', 'Header', 'node.screen'),
      node('node.title', 'ANNOTATION', 'Title', 'node.header'),
      node('node.nav', 'CONTROL', 'Navigation', 'node.header'),
      node('node.content', 'CONTAINER', 'Content', 'node.screen'),
      node('node.main', 'CONTAINER', 'Main panel', 'node.content'),
      node('node.form', 'CONTAINER', 'Form', 'node.main'),
      node('node.field', 'CONTROL', 'Field', 'node.form'),
      node('node.submit', 'CONTROL', 'Submit', 'node.form'),
      node('node.result', 'ANNOTATION', 'Result', 'node.main'),
      node('node.status', 'ANNOTATION', 'Status overlay', 'node.content'),
      node('node.footer', 'CONTAINER', 'Footer', 'node.screen'),
    ],
    relationships: [],
    sourceRefs: [],
  };
}

function uiProjectionInput() {
  const item = (projectionItemRef, semanticRef, bounds, layer, parentProjectionItemRefOrNull = null) => ({
    projectionItemRef,
    semanticRef,
    shapeKind: semanticRef.includes('field') || semanticRef.includes('submit') || semanticRef.includes('nav')
      ? 'RECTANGLE'
      : semanticRef.includes('title') || semanticRef.includes('result') || semanticRef.includes('status')
        ? 'TEXT'
        : 'FRAME',
    bounds,
    layer,
    parentProjectionItemRefOrNull,
    visible: true,
    locked: false,
  });
  return {
    schemaVersion: BOARD_PROJECTION_SCHEMA,
    projectionRef: 'projection.vexboard.composition.ui',
    graphRef: 'graph.vexboard.composition.ui',
    layoutIntent: 'SCREEN_FLOW',
    items: [
      item('item.screen', 'node.screen', { x: 0, y: 0, width: 600, height: 700 }, 0),
      item('item.header', 'node.header', { x: 400, y: 400, width: 560, height: 80 }, 7, 'item.screen'),
      item('item.title', 'node.title', { x: 1, y: 1, width: 180, height: 40 }, 1, 'item.header'),
      item('item.nav', 'node.nav', { x: 2, y: 2, width: 300, height: 40 }, 12, 'item.header'),
      item('item.content', 'node.content', { x: 300, y: 300, width: 560, height: 460 }, 2, 'item.screen'),
      item('item.main', 'node.main', { x: 9, y: 9, width: 520, height: 420 }, 3, 'item.content'),
      item('item.status', 'node.status', { x: 11, y: 11, width: 180, height: 48 }, 30, 'item.content'),
      item('item.form', 'node.form', { x: 100, y: 100, width: 480, height: 100 }, 4, 'item.main'),
      item('item.field', 'node.field', { x: 100, y: 100, width: 300, height: 50 }, 2, 'item.form'),
      item('item.submit', 'node.submit', { x: 100, y: 100, width: 120, height: 50 }, 20, 'item.form'),
      item('item.result', 'node.result', { x: 100, y: 100, width: 480, height: 120 }, 8, 'item.main'),
      item('item.footer', 'node.footer', { x: 200, y: 200, width: 560, height: 80 }, 9, 'item.screen'),
    ],
    sourceRefs: [],
  };
}

function processGraphInput() {
  return {
    schemaVersion: BOARD_GRAPH_SCHEMA,
    graphRef: 'graph.vexboard.composition.process',
    nodes: [
      { nodeRef: 'node.fulfillment', kind: 'CONTAINER', label: 'Fulfillment', parentRefOrNull: null, detailBoardRefOrNull: null, sourceRefs: ['process.fulfillment'] },
      { nodeRef: 'node.refund', kind: 'CONTAINER', label: 'Refund', parentRefOrNull: null, detailBoardRefOrNull: null, sourceRefs: ['process.refund'] },
      { nodeRef: 'node.validate', kind: 'PROCESS', label: 'Validate order', parentRefOrNull: null, detailBoardRefOrNull: null, sourceRefs: ['process.validate'] },
      { nodeRef: 'node.refund-check', kind: 'PROCESS', label: 'Validate refund', parentRefOrNull: null, detailBoardRefOrNull: null, sourceRefs: ['process.refund-check'] },
      { nodeRef: 'node.payment', kind: 'PORTAL', label: 'Payment', parentRefOrNull: null, detailBoardRefOrNull: 'board.payment', sourceRefs: ['process.payment'] },
      { nodeRef: 'node.delivery', kind: 'PORTAL', label: 'Delivery', parentRefOrNull: null, detailBoardRefOrNull: 'board.delivery', sourceRefs: ['process.delivery'] },
    ],
    relationships: [
      { relationshipRef: 'rel.validate-payment', kind: 'FLOW', fromRef: 'node.validate', toRef: 'node.payment', labelOrNull: 'NEXT', sourceRefs: ['process.fulfillment'] },
      { relationshipRef: 'rel.payment-delivery', kind: 'FLOW', fromRef: 'node.payment', toRef: 'node.delivery', labelOrNull: 'NEXT', sourceRefs: ['process.fulfillment'] },
    ],
    sourceRefs: ['process.fulfillment', 'process.refund', 'process.payment', 'process.delivery'],
  };
}

function processProjectionInput() {
  const item = (projectionItemRef, semanticRef, bounds, layer, parentProjectionItemRefOrNull = null) => ({
    projectionItemRef,
    semanticRef,
    shapeKind: semanticRef === 'node.fulfillment' || semanticRef === 'node.refund' ? 'FRAME' : 'RECTANGLE',
    bounds,
    layer,
    parentProjectionItemRefOrNull,
    visible: true,
    locked: false,
  });
  return {
    schemaVersion: BOARD_PROJECTION_SCHEMA,
    projectionRef: 'projection.vexboard.composition.process',
    graphRef: 'graph.vexboard.composition.process',
    layoutIntent: 'SYSTEM_MAP',
    items: [
      item('item.fulfillment', 'node.fulfillment', { x: 0, y: 0, width: 320, height: 360 }, 0),
      item('item.validate', 'node.validate', { x: 90, y: 90, width: 280, height: 60 }, 1, 'item.fulfillment'),
      item('item.payment.fulfillment', 'node.payment', { x: 90, y: 90, width: 280, height: 60 }, 12, 'item.fulfillment'),
      item('item.delivery', 'node.delivery', { x: 90, y: 90, width: 280, height: 60 }, 3, 'item.fulfillment'),
      item('item.refund', 'node.refund', { x: 500, y: 0, width: 320, height: 300 }, 0),
      item('item.refund-check', 'node.refund-check', { x: 590, y: 90, width: 280, height: 60 }, 1, 'item.refund'),
      item('item.payment.refund', 'node.payment', { x: 590, y: 90, width: 280, height: 60 }, 20, 'item.refund'),
    ],
    sourceRefs: ['process.fulfillment', 'process.refund'],
  };
}

function compositionFor(graph, projection, { compositionRef, containers, padding = 20, gap = 16 }) {
  return {
    schemaVersion: BOARD_PROJECTION_COMPOSITION_SCHEMA,
    compositionRef,
    graphRef: graph.graphRef,
    projectionRef: projection.projectionRef,
    expectedGraphFingerprint: graph.semanticFingerprint,
    expectedProjectionFingerprint: projection.semanticFingerprint,
    metrics: { padding, gap },
    containers,
  };
}

function byItem(projection, ref) {
  return projection.items.find((item) => item.projectionItemRef === ref);
}

test('nested UI composition resolves COLUMN, ROW and STACK locally without changing semantic truth or visual layers', () => {
  const graph = createBoardGraph(uiGraphInput());
  const projection = createBoardProjection(uiProjectionInput(), graph);
  const composition = compositionFor(graph, projection, {
    compositionRef: 'composition.vexboard.ui.001',
    containers: [
      { containerProjectionItemRef: 'item.screen', layout: 'COLUMN', orderedChildProjectionItemRefs: ['item.header', 'item.content', 'item.footer'] },
      { containerProjectionItemRef: 'item.header', layout: 'ROW', orderedChildProjectionItemRefs: ['item.title', 'item.nav'] },
      { containerProjectionItemRef: 'item.content', layout: 'STACK', orderedChildProjectionItemRefs: ['item.main', 'item.status'] },
      { containerProjectionItemRef: 'item.main', layout: 'COLUMN', orderedChildProjectionItemRefs: ['item.form', 'item.result'] },
      { containerProjectionItemRef: 'item.form', layout: 'ROW', orderedChildProjectionItemRefs: ['item.field', 'item.submit'] },
    ],
  });

  const first = resolveBoardProjectionComposition({ graph, projection, composition });
  const second = resolveBoardProjectionComposition({ graph, projection, composition });

  assert.deepEqual(first, second);
  assert.equal(first.schemaVersion, BOARD_PROJECTION_COMPOSITION_RESULT_SCHEMA);
  assert.equal(first.graph.semanticFingerprint, graph.semanticFingerprint);
  assert.equal(first.effects.graphChanged, false);
  assert.equal(first.effects.externalEffectsPerformed, false);
  assert.equal(first.effects.projectionChanged, true);

  assert.deepEqual(byItem(first.projection, 'item.header').bounds, { x: 20, y: 20, width: 560, height: 80 });
  assert.deepEqual(byItem(first.projection, 'item.content').bounds, { x: 20, y: 116, width: 560, height: 460 });
  assert.deepEqual(byItem(first.projection, 'item.footer').bounds, { x: 20, y: 592, width: 560, height: 80 });
  assert.deepEqual(byItem(first.projection, 'item.title').bounds, { x: 40, y: 40, width: 180, height: 40 });
  assert.deepEqual(byItem(first.projection, 'item.nav').bounds, { x: 236, y: 40, width: 300, height: 40 });
  assert.deepEqual(byItem(first.projection, 'item.main').bounds, { x: 40, y: 136, width: 520, height: 420 });
  assert.deepEqual(byItem(first.projection, 'item.status').bounds, { x: 40, y: 136, width: 180, height: 48 });
  assert.deepEqual(byItem(first.projection, 'item.form').bounds, { x: 60, y: 156, width: 480, height: 100 });
  assert.deepEqual(byItem(first.projection, 'item.result').bounds, { x: 60, y: 272, width: 480, height: 120 });
  assert.deepEqual(byItem(first.projection, 'item.field').bounds, { x: 80, y: 176, width: 300, height: 50 });
  assert.deepEqual(byItem(first.projection, 'item.submit').bounds, { x: 396, y: 176, width: 120, height: 50 });

  assert.equal(byItem(first.projection, 'item.content').layer, 2);
  assert.equal(byItem(first.projection, 'item.footer').layer, 9);
  assert.equal(byItem(first.projection, 'item.nav').layer, 12);
  assert.equal(byItem(first.projection, 'item.status').layer, 30);
});

test('reusable process composition resolves occurrence-local structure while one semantic PORTAL identity remains source-owned', () => {
  const graph = createBoardGraph(processGraphInput());
  const projection = createBoardProjection(processProjectionInput(), graph);
  const composition = compositionFor(graph, projection, {
    compositionRef: 'composition.vexboard.process.001',
    padding: 20,
    gap: 12,
    containers: [
      { containerProjectionItemRef: 'item.fulfillment', layout: 'COLUMN', orderedChildProjectionItemRefs: ['item.validate', 'item.payment.fulfillment', 'item.delivery'] },
      { containerProjectionItemRef: 'item.refund', layout: 'COLUMN', orderedChildProjectionItemRefs: ['item.refund-check', 'item.payment.refund'] },
    ],
  });

  const result = resolveBoardProjectionComposition({ graph, projection, composition });
  const payment = graph.nodes.find((node) => node.nodeRef === 'node.payment');
  const fulfillmentPayment = byItem(result.projection, 'item.payment.fulfillment');
  const refundPayment = byItem(result.projection, 'item.payment.refund');

  assert.equal(payment.parentRefOrNull, null);
  assert.equal(payment.detailBoardRefOrNull, 'board.payment');
  assert.equal(fulfillmentPayment.semanticRef, 'node.payment');
  assert.equal(refundPayment.semanticRef, 'node.payment');
  assert.equal(fulfillmentPayment.parentProjectionItemRefOrNull, 'item.fulfillment');
  assert.equal(refundPayment.parentProjectionItemRefOrNull, 'item.refund');
  assert.deepEqual(fulfillmentPayment.bounds, { x: 20, y: 92, width: 280, height: 60 });
  assert.deepEqual(refundPayment.bounds, { x: 520, y: 92, width: 280, height: 60 });
  assert.equal(fulfillmentPayment.layer, 12);
  assert.equal(refundPayment.layer, 20);
  assert.equal(result.graph.semanticFingerprint, graph.semanticFingerprint);
});

test('FREE composition preserves authored geometry while still validating explicit structural child order', () => {
  const graph = createBoardGraph(processGraphInput());
  const projection = createBoardProjection(processProjectionInput(), graph);
  const composition = compositionFor(graph, projection, {
    compositionRef: 'composition.vexboard.process.free.001',
    containers: [{
      containerProjectionItemRef: 'item.fulfillment',
      layout: 'FREE',
      orderedChildProjectionItemRefs: ['item.payment.fulfillment', 'item.delivery', 'item.validate'],
    }],
  });
  const result = resolveBoardProjectionComposition({ graph, projection, composition });
  assert.deepEqual(byItem(result.projection, 'item.validate').bounds, byItem(projection, 'item.validate').bounds);
  assert.deepEqual(byItem(result.projection, 'item.payment.fulfillment').bounds, byItem(projection, 'item.payment.fulfillment').bounds);
  assert.equal(result.effects.projectionChanged, false);
});

test('projection composition fails closed on stale inputs, incomplete structural order, overflow and locked movement', () => {
  const graph = createBoardGraph(processGraphInput());
  const projection = createBoardProjection(processProjectionInput(), graph);
  const base = compositionFor(graph, projection, {
    compositionRef: 'composition.vexboard.process.guard.001',
    padding: 20,
    gap: 12,
    containers: [{
      containerProjectionItemRef: 'item.fulfillment',
      layout: 'COLUMN',
      orderedChildProjectionItemRefs: ['item.validate', 'item.payment.fulfillment', 'item.delivery'],
    }],
  });

  assert.throws(
    () => resolveBoardProjectionComposition({
      graph,
      projection,
      composition: { ...base, expectedProjectionFingerprint: '0'.repeat(64) },
    }),
    /stale BoardProjection observation/,
  );

  assert.throws(
    () => resolveBoardProjectionComposition({
      graph,
      projection,
      composition: {
        ...base,
        containers: [{
          containerProjectionItemRef: 'item.fulfillment',
          layout: 'COLUMN',
          orderedChildProjectionItemRefs: ['item.validate', 'item.payment.fulfillment'],
        }],
      },
    }),
    /must exactly cover direct projection children/,
  );

  const tooSmall = structuredClone(projection);
  delete tooSmall.semanticFingerprint;
  byItem(tooSmall, 'item.fulfillment').bounds.height = 120;
  const smallProjection = createBoardProjection(tooSmall, graph);
  const smallComposition = compositionFor(graph, smallProjection, {
    compositionRef: 'composition.vexboard.process.overflow.001',
    padding: 20,
    gap: 12,
    containers: [{
      containerProjectionItemRef: 'item.fulfillment',
      layout: 'COLUMN',
      orderedChildProjectionItemRefs: ['item.validate', 'item.payment.fulfillment', 'item.delivery'],
    }],
  });
  assert.throws(
    () => resolveBoardProjectionComposition({ graph, projection: smallProjection, composition: smallComposition }),
    /exceeds container .* bounds/,
  );

  const lockedInput = structuredClone(projection);
  delete lockedInput.semanticFingerprint;
  byItem(lockedInput, 'item.validate').locked = true;
  const lockedProjection = createBoardProjection(lockedInput, graph);
  const lockedComposition = compositionFor(graph, lockedProjection, {
    compositionRef: 'composition.vexboard.process.locked.001',
    padding: 20,
    gap: 12,
    containers: [{
      containerProjectionItemRef: 'item.fulfillment',
      layout: 'COLUMN',
      orderedChildProjectionItemRefs: ['item.validate', 'item.payment.fulfillment', 'item.delivery'],
    }],
  });
  assert.throws(
    () => resolveBoardProjectionComposition({ graph, projection: lockedProjection, composition: lockedComposition }),
    /cannot reposition locked child item\.validate/,
  );
});

test('local layout and boundary vocabularies remain intentionally bounded', () => {
  assert.deepEqual(BOARD_LOCAL_LAYOUT_MODES, ['FREE', 'ROW', 'COLUMN', 'STACK']);
  assert.deepEqual(BOARD_LOCAL_BOUNDARY_POLICIES, ['FAIL', 'WRAP', 'SERPENTINE']);
});



test('width-bounded ROW wrapping continues downward locally without changing BoardGraph truth', () => {
  const children = Array.from({ length: 5 }, (_, index) => ({
    nodeRef: `node.width.child-${index + 1}`,
    kind: 'PROCESS',
    label: `Step ${index + 1}`,
    parentRefOrNull: 'node.width.container',
    detailBoardRefOrNull: null,
    sourceRefs: [],
  }));
  const graph = createBoardGraph({
    schemaVersion: BOARD_GRAPH_SCHEMA,
    graphRef: 'graph.vexboard.composition.width-bound',
    nodes: [{
      nodeRef: 'node.width.container',
      kind: 'CONTAINER',
      label: 'Width-bounded flow',
      parentRefOrNull: null,
      detailBoardRefOrNull: null,
      sourceRefs: [],
    }, ...children],
    relationships: [],
    sourceRefs: [],
  });
  const projection = createBoardProjection({
    schemaVersion: BOARD_PROJECTION_SCHEMA,
    projectionRef: 'projection.vexboard.composition.width-bound',
    graphRef: graph.graphRef,
    layoutIntent: 'SCREEN_FLOW',
    items: [{
      projectionItemRef: 'item.width.container',
      semanticRef: 'node.width.container',
      shapeKind: 'FRAME',
      bounds: { x: 0, y: 0, width: 300, height: 220 },
      layer: 0,
      parentProjectionItemRefOrNull: null,
      visible: true,
      locked: false,
    }, ...children.map((child, index) => ({
      projectionItemRef: `item.width.child-${index + 1}`,
      semanticRef: child.nodeRef,
      shapeKind: 'RECTANGLE',
      bounds: { x: 200, y: 160, width: 90, height: 40 },
      layer: index + 1,
      parentProjectionItemRefOrNull: 'item.width.container',
      visible: true,
      locked: false,
    }))],
    sourceRefs: [],
  }, graph);
  const ordered = children.map((_, index) => `item.width.child-${index + 1}`);
  const composition = compositionFor(graph, projection, {
    compositionRef: 'composition.vexboard.width-bound.wrap.001',
    padding: 20,
    gap: 10,
    containers: [{
      containerProjectionItemRef: 'item.width.container',
      layout: 'ROW',
      boundaryPolicy: 'WRAP',
      orderedChildProjectionItemRefs: ordered,
    }],
  });

  const result = resolveBoardProjectionComposition({ graph, projection, composition });
  assert.equal(result.graph.semanticFingerprint, graph.semanticFingerprint);
  assert.equal(result.effects.graphChanged, false);
  assert.deepEqual(
    ordered.map((ref) => {
      const bounds = byItem(result.projection, ref).bounds;
      return [bounds.x, bounds.y];
    }),
    [[20, 20], [120, 20], [20, 70], [120, 70], [20, 120]],
  );
});

test('SERPENTINE width continuation alternates local row direction without changing structural order', () => {
  const children = Array.from({ length: 5 }, (_, index) => ({
    nodeRef: `node.serp.child-${index + 1}`,
    kind: 'PROCESS',
    label: `Step ${index + 1}`,
    parentRefOrNull: 'node.serp.container',
    detailBoardRefOrNull: null,
    sourceRefs: [],
  }));
  const graph = createBoardGraph({
    schemaVersion: BOARD_GRAPH_SCHEMA,
    graphRef: 'graph.vexboard.composition.serpentine',
    nodes: [{
      nodeRef: 'node.serp.container',
      kind: 'CONTAINER',
      label: 'Serpentine flow',
      parentRefOrNull: null,
      detailBoardRefOrNull: null,
      sourceRefs: [],
    }, ...children],
    relationships: [],
    sourceRefs: [],
  });
  const projection = createBoardProjection({
    schemaVersion: BOARD_PROJECTION_SCHEMA,
    projectionRef: 'projection.vexboard.composition.serpentine',
    graphRef: graph.graphRef,
    layoutIntent: 'SCREEN_FLOW',
    items: [{
      projectionItemRef: 'item.serp.container',
      semanticRef: 'node.serp.container',
      shapeKind: 'FRAME',
      bounds: { x: 0, y: 0, width: 300, height: 220 },
      layer: 0,
      parentProjectionItemRefOrNull: null,
      visible: true,
      locked: false,
    }, ...children.map((child, index) => ({
      projectionItemRef: `item.serp.child-${index + 1}`,
      semanticRef: child.nodeRef,
      shapeKind: 'RECTANGLE',
      bounds: { x: 200, y: 160, width: 90, height: 40 },
      layer: index + 1,
      parentProjectionItemRefOrNull: 'item.serp.container',
      visible: true,
      locked: false,
    }))],
    sourceRefs: [],
  }, graph);
  const ordered = children.map((_, index) => `item.serp.child-${index + 1}`);
  const composition = compositionFor(graph, projection, {
    compositionRef: 'composition.vexboard.width-bound.serpentine.001',
    padding: 20,
    gap: 10,
    containers: [{
      containerProjectionItemRef: 'item.serp.container',
      layout: 'ROW',
      boundaryPolicy: 'SERPENTINE',
      orderedChildProjectionItemRefs: ordered,
    }],
  });

  const result = resolveBoardProjectionComposition({ graph, projection, composition });
  assert.deepEqual(
    ordered.map((ref) => {
      const bounds = byItem(result.projection, ref).bounds;
      return [bounds.x, bounds.y];
    }),
    [[20, 20], [120, 20], [190, 70], [90, 70], [20, 120]],
  );
  assert.deepEqual(
    graph.nodes.filter((node) => node.parentRefOrNull === 'node.serp.container').map((node) => node.nodeRef),
    children.map((child) => child.nodeRef),
  );
});

test('boundary continuation is opt-in and rejects unsupported layout combinations', () => {
  const graph = createBoardGraph(processGraphInput());
  const projection = createBoardProjection(processProjectionInput(), graph);
  const invalid = compositionFor(graph, projection, {
    compositionRef: 'composition.vexboard.boundary-policy.invalid.001',
    containers: [{
      containerProjectionItemRef: 'item.fulfillment',
      layout: 'STACK',
      boundaryPolicy: 'WRAP',
      orderedChildProjectionItemRefs: ['item.validate', 'item.payment.fulfillment', 'item.delivery'],
    }],
  });
  assert.throws(
    () => resolveBoardProjectionComposition({ graph, projection, composition: invalid }),
    (error) => error instanceof TypeError && error.message === BOUNDARY_POLICY_LAYOUT_ERROR_MESSAGE,
  );
});

test('VexBusinessFactory system-anatomy patient zero composes source, storage, convergence and UI without collapsing identity into form', () => {
  const draft = read('projects/vexboard/examples/vexbusinessfactory-system-anatomy.board.json');
  const graph = createBoardGraph(draft.graph);
  const projection = createBoardProjection(draft.projection, graph);
  const composition = compositionFor(graph, projection, {
    compositionRef: 'composition.vexboard.vexbusinessfactory.system-anatomy.001',
    padding: 20,
    gap: 16,
    containers: [
      {
        containerProjectionItemRef: 'item.vbf.system-anatomy',
        layout: 'ROW',
        orderedChildProjectionItemRefs: [
          'item.vbf.source',
          'item.vbf.storage',
          'item.vbf.interfaces',
          'item.vbf.convergence',
          'item.vbf.presentation',
        ],
      },
      {
        containerProjectionItemRef: 'item.vbf.source',
        layout: 'COLUMN',
        orderedChildProjectionItemRefs: [
          'item.vbf.string.inventory-buy.source',
          'item.vbf.asset.inventory-icon.source',
        ],
      },
      {
        containerProjectionItemRef: 'item.vbf.storage',
        layout: 'COLUMN',
        orderedChildProjectionItemRefs: [
          'item.vbf.db.product-title',
          'item.vbf.db.inventory-item-name',
          'item.vbf.db.inventory-quantity',
          'item.vbf.example.inventory-basic',
        ],
      },
      {
        containerProjectionItemRef: 'item.vbf.interfaces',
        layout: 'COLUMN',
        orderedChildProjectionItemRefs: [
          'item.vbf.dependency.inventory-service',
          'item.vbf.api.inventory-read',
          'item.vbf.api.input.product-id',
          'item.vbf.api.output.inventory-record',
        ],
      },
      {
        containerProjectionItemRef: 'item.vbf.convergence',
        layout: 'COLUMN',
        orderedChildProjectionItemRefs: [
          'item.vbf.process.inventory-join',
          'item.vbf.model.inventory-item',
          'item.vbf.process.buy-label-format',
          'item.vbf.text.buy-item-title.transform',
        ],
      },
      {
        containerProjectionItemRef: 'item.vbf.presentation',
        layout: 'COLUMN',
        orderedChildProjectionItemRefs: ['item.vbf.ui.inventory-block'],
      },
      {
        containerProjectionItemRef: 'item.vbf.ui.inventory-block',
        layout: 'COLUMN',
        orderedChildProjectionItemRefs: [
          'item.vbf.ui.buy',
          'item.vbf.string.inventory-buy.ui',
          'item.vbf.text.buy-item-title.ui',
        ],
      },
    ],
  });

  const result = resolveBoardProjectionComposition({ graph, projection, composition });
  const stringNode = graph.nodes.find((node) => node.nodeRef === 'node.vbf.string.inventory-buy');
  const stringOccurrences = result.projection.items
    .filter((item) => item.semanticRef === stringNode.nodeRef);
  const renderedTextOccurrences = result.projection.items
    .filter((item) => item.semanticRef === 'node.vbf.text.buy-item-title');

  assert.equal(result.graph.semanticFingerprint, graph.semanticFingerprint);
  assert.equal(result.effects.graphChanged, false);
  assert.equal(result.effects.externalEffectsPerformed, false);
  assert.equal(stringNode.parentRefOrNull, 'node.vbf.source');
  assert.equal(stringOccurrences.length, 2);
  assert.deepEqual(
    stringOccurrences.map((item) => item.parentProjectionItemRefOrNull).sort(),
    ['item.vbf.source', 'item.vbf.ui.inventory-block'],
  );
  assert.equal(renderedTextOccurrences.length, 2);
  assert.equal(
    result.projection.items.find((item) => item.projectionItemRef === 'item.vbf.ui.buy').layer,
    30,
  );

  const sectionXs = [
    'item.vbf.source',
    'item.vbf.storage',
    'item.vbf.interfaces',
    'item.vbf.convergence',
    'item.vbf.presentation',
  ].map((ref) => byItem(result.projection, ref).bounds.x);
  assert.deepEqual(sectionXs, [20, 376, 732, 1088, 1444]);

  assert.deepEqual(
    graph.relationships
      .filter((relationship) => relationship.kind === 'DATA')
      .map((relationship) => relationship.relationshipRef),
    [
      'rel.vbf.api-input.endpoint',
      'rel.vbf.api-output.join',
      'rel.vbf.endpoint.api-output',
      'rel.vbf.format.text',
      'rel.vbf.item-name.api-output',
      'rel.vbf.join.model',
      'rel.vbf.model.format',
      'rel.vbf.product-title.join',
      'rel.vbf.quantity.api-output',
      'rel.vbf.string.format',
      'rel.vbf.text.ui',
    ],
  );
  assert.equal(
    graph.relationships.find((relationship) => relationship.relationshipRef === 'rel.vbf.asset.ui').kind,
    'REFERENCE',
  );
  assert.equal(
    graph.relationships.find((relationship) => relationship.relationshipRef === 'rel.vbf.dependency.exposes-api').kind,
    'REFERENCE',
  );
  assert.equal(
    graph.nodes.find((node) => node.nodeRef === 'node.vbf.api.inventory-read').label,
    'API · GET /inventory/{productId}',
  );
  const placeholder = graph.nodes.find((node) => node.nodeRef === 'node.vbf.example.inventory-basic');
  assert.equal(placeholder.kind, 'ARTIFACT');
  assert.match(placeholder.label, /^Synthetic placeholder · inventory\/basic/);
  assert.deepEqual(
    graph.relationships
      .filter((relationship) => relationship.fromRef === placeholder.nodeRef)
      .map((relationship) => [relationship.kind, relationship.labelOrNull]),
    [
      ['REFERENCE', 'EXAMPLE_VALUE_FOR'],
      ['REFERENCE', 'EXAMPLE_VALUE_FOR'],
      ['REFERENCE', 'EXAMPLE_VALUE_FOR'],
      ['REFERENCE', 'EXAMPLE_VALUE_FOR'],
    ],
  );
  assert.equal(
    graph.relationships.some(
      (relationship) => relationship.fromRef === placeholder.nodeRef && relationship.kind === 'DATA',
    ),
    false,
  );
});

test('one full system graph supports designer, client-dev and server/API lenses without reminting semantic identity', () => {
  const draft = read('projects/vexboard/examples/vexbusinessfactory-system-anatomy.board.json');
  const graph = createBoardGraph(draft.graph);
  const full = createBoardProjection(draft.projection, graph);

  const projectLens = (projectionRef, semanticRefs) => {
    const allowed = new Set(semanticRefs);
    const selected = full.items.filter((item) => allowed.has(item.semanticRef));
    const selectedRefs = new Set(selected.map((item) => item.projectionItemRef));
    return createBoardProjection({
      schemaVersion: BOARD_PROJECTION_SCHEMA,
      projectionRef,
      graphRef: graph.graphRef,
      layoutIntent: full.layoutIntent,
      items: selected.map((item) => ({
        ...item,
        parentProjectionItemRefOrNull:
          item.parentProjectionItemRefOrNull && selectedRefs.has(item.parentProjectionItemRefOrNull)
            ? item.parentProjectionItemRefOrNull
            : null,
      })),
      sourceRefs: ['github.issue.vexwork.138'],
    }, graph);
  };

  const designer = projectLens('projection.vbf.system-anatomy.designer', [
    'node.vbf.string.inventory-buy',
    'node.vbf.asset.inventory-icon',
    'node.vbf.text.buy-item-title',
    'node.vbf.ui.inventory-block',
    'node.vbf.ui.buy',
  ]);
  const clientDev = projectLens('projection.vbf.system-anatomy.client-dev', [
    'node.vbf.string.inventory-buy',
    'node.vbf.api.inventory-read',
    'node.vbf.api.input.product-id',
    'node.vbf.api.output.inventory-record',
    'node.vbf.process.inventory-join',
    'node.vbf.model.inventory-item',
    'node.vbf.process.buy-label-format',
    'node.vbf.text.buy-item-title',
    'node.vbf.ui.buy',
  ]);
  const server = projectLens('projection.vbf.system-anatomy.server-api', [
    'node.vbf.db.product-title',
    'node.vbf.db.inventory-item-name',
    'node.vbf.db.inventory-quantity',
    'node.vbf.dependency.inventory-service',
    'node.vbf.api.inventory-read',
    'node.vbf.api.input.product-id',
    'node.vbf.api.output.inventory-record',
  ]);

  assert.equal(graph.semanticFingerprint, createBoardGraph(draft.graph).semanticFingerprint);
  assert.ok(designer.items.length < full.items.length);
  assert.ok(clientDev.items.length < full.items.length);
  assert.ok(server.items.length < full.items.length);

  assert.equal(designer.items.some((item) => item.semanticRef === 'node.vbf.ui.buy'), true);
  assert.equal(designer.items.some((item) => item.semanticRef === 'node.vbf.db.inventory-quantity'), false);

  assert.equal(clientDev.items.some((item) => item.semanticRef === 'node.vbf.api.inventory-read'), true);
  assert.equal(clientDev.items.some((item) => item.semanticRef === 'node.vbf.process.inventory-join'), true);

  assert.equal(server.items.some((item) => item.semanticRef === 'node.vbf.api.inventory-read'), true);
  assert.equal(server.items.some((item) => item.semanticRef === 'node.vbf.db.inventory-quantity'), true);
  assert.equal(server.items.some((item) => item.semanticRef === 'node.vbf.ui.buy'), false);

  const sharedApiRef = 'node.vbf.api.inventory-read';
  assert.equal(
    clientDev.items.find((item) => item.semanticRef === sharedApiRef).semanticRef,
    server.items.find((item) => item.semanticRef === sharedApiRef).semanticRef,
  );
});


test('recursive local composition resolves six nested boundaries without a global layout owner', () => {
  const nodes = [
    { nodeRef: 'node.scale.root', kind: 'CONTAINER', label: 'Root', parentRefOrNull: null, detailBoardRefOrNull: null, sourceRefs: [] },
  ];
  for (let depth = 1; depth <= 5; depth += 1) {
    nodes.push({
      nodeRef: `node.scale.c${depth}`,
      kind: 'CONTAINER',
      label: `Container ${depth}`,
      parentRefOrNull: depth === 1 ? 'node.scale.root' : `node.scale.c${depth - 1}`,
      detailBoardRefOrNull: null,
      sourceRefs: [],
    });
  }
  nodes.push({
    nodeRef: 'node.scale.leaf',
    kind: 'ARTIFACT',
    label: 'Deep leaf',
    parentRefOrNull: 'node.scale.c5',
    detailBoardRefOrNull: null,
    sourceRefs: [],
  });

  const graph = createBoardGraph({
    schemaVersion: BOARD_GRAPH_SCHEMA,
    graphRef: 'graph.vexboard.composition.recursive-scale',
    nodes,
    relationships: [],
    sourceRefs: [],
  });

  const items = [
    {
      projectionItemRef: 'item.scale.root',
      semanticRef: 'node.scale.root',
      shapeKind: 'FRAME',
      bounds: { x: 0, y: 0, width: 1000, height: 1000 },
      layer: 0,
      parentProjectionItemRefOrNull: null,
      visible: true,
      locked: false,
    },
  ];
  for (let depth = 1; depth <= 5; depth += 1) {
    items.push({
      projectionItemRef: `item.scale.c${depth}`,
      semanticRef: `node.scale.c${depth}`,
      shapeKind: 'FRAME',
      bounds: { x: 700, y: 700, width: 1000 - depth * 100, height: 1000 - depth * 100 },
      layer: depth,
      parentProjectionItemRefOrNull: depth === 1 ? 'item.scale.root' : `item.scale.c${depth - 1}`,
      visible: true,
      locked: false,
    });
  }
  items.push({
    projectionItemRef: 'item.scale.leaf',
    semanticRef: 'node.scale.leaf',
    shapeKind: 'RECTANGLE',
    bounds: { x: 700, y: 700, width: 100, height: 60 },
    layer: 99,
    parentProjectionItemRefOrNull: 'item.scale.c5',
    visible: true,
    locked: false,
  });

  const projection = createBoardProjection({
    schemaVersion: BOARD_PROJECTION_SCHEMA,
    projectionRef: 'projection.vexboard.composition.recursive-scale',
    graphRef: graph.graphRef,
    layoutIntent: 'SYSTEM_MAP',
    items,
    sourceRefs: [],
  }, graph);

  const containers = [
    {
      containerProjectionItemRef: 'item.scale.root',
      layout: 'COLUMN',
      orderedChildProjectionItemRefs: ['item.scale.c1'],
    },
  ];
  for (let depth = 1; depth <= 4; depth += 1) {
    containers.push({
      containerProjectionItemRef: `item.scale.c${depth}`,
      layout: 'COLUMN',
      orderedChildProjectionItemRefs: [`item.scale.c${depth + 1}`],
    });
  }
  containers.push({
    containerProjectionItemRef: 'item.scale.c5',
    layout: 'COLUMN',
    orderedChildProjectionItemRefs: ['item.scale.leaf'],
  });

  const composition = compositionFor(graph, projection, {
    compositionRef: 'composition.vexboard.recursive-scale.001',
    containers,
    padding: 10,
    gap: 4,
  });

  const first = resolveBoardProjectionComposition({ graph, projection, composition });
  const second = resolveBoardProjectionComposition({ graph, projection, composition });

  assert.deepEqual(first, second);
  assert.equal(first.graph.semanticFingerprint, graph.semanticFingerprint);
  assert.equal(first.effects.graphChanged, false);
  assert.equal(first.effects.externalEffectsPerformed, false);

  for (let depth = 1; depth <= 5; depth += 1) {
    assert.deepEqual(
      {
        x: byItem(first.projection, `item.scale.c${depth}`).bounds.x,
        y: byItem(first.projection, `item.scale.c${depth}`).bounds.y,
      },
      { x: depth * 10, y: depth * 10 },
    );
  }
  assert.deepEqual(
    {
      x: byItem(first.projection, 'item.scale.leaf').bounds.x,
      y: byItem(first.projection, 'item.scale.leaf').bounds.y,
    },
    { x: 60, y: 60 },
  );
  assert.equal(byItem(first.projection, 'item.scale.leaf').layer, 99);
});

// [VXG RealForever][VEXWORK][VEXBOARD][PROJECTION-COMPOSITION][TEST]
