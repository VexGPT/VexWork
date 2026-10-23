export const BOARD_GRAPH_SCHEMA = 'vexboard.board-graph/v1';
export const BOARD_PROJECTION_SCHEMA = 'vexboard.board-projection/v1';
export const BOARD_CONTROL_SCHEMA = 'vexboard.board-control/v1';

export const BOARD_NODE_KINDS = Object.freeze([
  'SCENE',
  'CONTROL',
  'PROCESS',
  'DECISION',
  'ARTIFACT',
  'CONTAINER',
  'PORTAL',
  'REFERENCE',
  'ANNOTATION',
]);

export const BOARD_RELATIONSHIP_KINDS = Object.freeze([
  'FLOW',
  'TRANSITION',
  'DATA',
  'REFERENCE',
]);

export const BOARD_SHAPE_KINDS = Object.freeze([
  'RECTANGLE',
  'ELLIPSE',
  'DIAMOND',
  'FRAME',
  'TEXT',
]);

export const BOARD_LAYOUT_INTENTS = Object.freeze([
  'SEQUENCE',
  'TREE',
  'SWIMLANE',
  'GRID',
  'SCREEN_FLOW',
  'SYSTEM_MAP',
  'FREE_WITH_CONSTRAINTS',
]);

export const BOARD_CONTROL_ACTS = Object.freeze([
  'CREATE_NODE',
  'MOVE_ITEM',
  'RESIZE_ITEM',
  'SET_LAYER',
  'SET_CONTAINMENT',
  'CONNECT_NODES',
]);

const REF = /^[A-Za-z0-9][A-Za-z0-9._:/-]*$/u;
const HEX64 = /^[0-9a-f]{64}$/u;

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function compareCanonicalText(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

export function freezeBoardValue(value, seen = new WeakSet()) {
  if (!value || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const child of Object.values(value)) freezeBoardValue(child, seen);
  return Object.freeze(value);
}

function exactKeys(value, keys, label) {
  assert(isObject(value), `${label} must be one object`);
  const actual = Object.keys(value).sort(compareCanonicalText);
  const expected = [...keys].sort(compareCanonicalText);
  assert(JSON.stringify(actual) === JSON.stringify(expected), `${label} schema drift`);
}

function stableRef(value, label) {
  assert(typeof value === 'string' && REF.test(value), `${label} must be one stable ref`);
  return value;
}

function optionalRef(value, label) {
  if (value === null) return null;
  return stableRef(value, label);
}

function refs(values, label) {
  assert(Array.isArray(values), `${label} must be an array`);
  const result = values.map((value, index) => stableRef(value, `${label}[${index}]`));
  assert(new Set(result).size === result.length, `${label} must be unique`);
  return [...result].sort(compareCanonicalText);
}

function finiteNumber(value, label) {
  assert(typeof value === 'number' && Number.isFinite(value), `${label} must be finite`);
  return value;
}

function positiveNumber(value, label) {
  finiteNumber(value, label);
  assert(value > 0, `${label} must be positive`);
  return value;
}

function booleanValue(value, label) {
  assert(typeof value === 'boolean', `${label} must be boolean`);
  return value;
}

function integer(value, label) {
  assert(Number.isInteger(value), `${label} must be an integer`);
  return value;
}

function normalizeBounds(bounds, label) {
  exactKeys(bounds, ['x', 'y', 'width', 'height'], label);
  return {
    x: finiteNumber(bounds.x, `${label}.x`),
    y: finiteNumber(bounds.y, `${label}.y`),
    width: positiveNumber(bounds.width, `${label}.width`),
    height: positiveNumber(bounds.height, `${label}.height`),
  };
}

function normalizeNode(input) {
  exactKeys(input, ['nodeRef', 'kind', 'label', 'parentRefOrNull', 'detailBoardRefOrNull', 'sourceRefs'], 'node');
  const nodeRef = stableRef(input.nodeRef, 'nodeRef');
  assert(BOARD_NODE_KINDS.includes(input.kind), `unsupported node kind ${input.kind}`);
  assert(typeof input.label === 'string' && input.label.trim(), `node ${nodeRef} label required`);
  return {
    nodeRef,
    kind: input.kind,
    label: input.label,
    parentRefOrNull: optionalRef(input.parentRefOrNull, `node ${nodeRef}.parentRefOrNull`),
    detailBoardRefOrNull: optionalRef(input.detailBoardRefOrNull, `node ${nodeRef}.detailBoardRefOrNull`),
    sourceRefs: refs(input.sourceRefs, `node ${nodeRef}.sourceRefs`),
  };
}

function normalizeRelationship(input) {
  exactKeys(input, ['relationshipRef', 'kind', 'fromRef', 'toRef', 'labelOrNull', 'sourceRefs'], 'relationship');
  const relationshipRef = stableRef(input.relationshipRef, 'relationshipRef');
  assert(BOARD_RELATIONSHIP_KINDS.includes(input.kind), `unsupported relationship kind ${input.kind}`);
  assert(input.labelOrNull === null || typeof input.labelOrNull === 'string', `relationship ${relationshipRef}.labelOrNull invalid`);
  return {
    relationshipRef,
    kind: input.kind,
    fromRef: stableRef(input.fromRef, `relationship ${relationshipRef}.fromRef`),
    toRef: stableRef(input.toRef, `relationship ${relationshipRef}.toRef`),
    labelOrNull: input.labelOrNull,
    sourceRefs: refs(input.sourceRefs, `relationship ${relationshipRef}.sourceRefs`),
  };
}

function assertAcyclic(items, refFor, parentFor, label) {
  const byRef = new Map(items.map((item) => [refFor(item), item]));
  const visiting = new Set();
  const visited = new Set();
  const visit = (ref) => {
    if (visiting.has(ref)) throw new TypeError(`${label} cycle detected at ${ref}`);
    if (visited.has(ref)) return;
    visiting.add(ref);
    const parentRef = parentFor(byRef.get(ref));
    if (parentRef) visit(parentRef);
    visiting.delete(ref);
    visited.add(ref);
  };
  for (const ref of byRef.keys()) visit(ref);
}

export function normalizeBoardGraph(input) {
  exactKeys(input, ['schemaVersion', 'graphRef', 'nodes', 'relationships', 'sourceRefs'], 'BoardGraph');
  assert(input.schemaVersion === BOARD_GRAPH_SCHEMA, 'BoardGraph schema mismatch');
  const graphRef = stableRef(input.graphRef, 'graphRef');
  assert(Array.isArray(input.nodes), 'BoardGraph nodes must be an array');
  assert(Array.isArray(input.relationships), 'BoardGraph relationships must be an array');

  const nodes = input.nodes.map(normalizeNode).sort((a, b) => compareCanonicalText(a.nodeRef, b.nodeRef));
  const relationships = input.relationships.map(normalizeRelationship)
    .sort((a, b) => compareCanonicalText(a.relationshipRef, b.relationshipRef));
  const byRef = new Map(nodes.map((node) => [node.nodeRef, node]));
  assert(byRef.size === nodes.length, 'BoardGraph nodeRef must be unique');
  assert(new Set(relationships.map((relationship) => relationship.relationshipRef)).size === relationships.length,
    'BoardGraph relationshipRef must be unique');

  for (const node of nodes) {
    if (node.parentRefOrNull !== null) {
      assert(byRef.has(node.parentRefOrNull), `node ${node.nodeRef} parent missing: ${node.parentRefOrNull}`);
      assert(node.parentRefOrNull !== node.nodeRef, `node ${node.nodeRef} cannot contain itself`);
    }
  }
  assertAcyclic(nodes, (node) => node.nodeRef, (node) => node.parentRefOrNull, 'containment');

  for (const relationship of relationships) {
    assert(byRef.has(relationship.fromRef), `relationship ${relationship.relationshipRef} fromRef missing: ${relationship.fromRef}`);
    assert(byRef.has(relationship.toRef), `relationship ${relationship.relationshipRef} toRef missing: ${relationship.toRef}`);
  }

  return {
    schemaVersion: BOARD_GRAPH_SCHEMA,
    graphRef,
    nodes,
    relationships,
    sourceRefs: refs(input.sourceRefs, 'BoardGraph.sourceRefs'),
  };
}

function normalizeProjectionItem(input) {
  exactKeys(input, [
    'projectionItemRef', 'semanticRef', 'shapeKind', 'bounds', 'layer',
    'parentProjectionItemRefOrNull', 'visible', 'locked',
  ], 'projection item');
  const projectionItemRef = stableRef(input.projectionItemRef, 'projectionItemRef');
  assert(BOARD_SHAPE_KINDS.includes(input.shapeKind), `unsupported shape kind ${input.shapeKind}`);
  return {
    projectionItemRef,
    semanticRef: stableRef(input.semanticRef, `projection item ${projectionItemRef}.semanticRef`),
    shapeKind: input.shapeKind,
    bounds: normalizeBounds(input.bounds, `projection item ${projectionItemRef}.bounds`),
    layer: integer(input.layer, `projection item ${projectionItemRef}.layer`),
    parentProjectionItemRefOrNull: optionalRef(input.parentProjectionItemRefOrNull, `projection item ${projectionItemRef}.parentProjectionItemRefOrNull`),
    visible: booleanValue(input.visible, `projection item ${projectionItemRef}.visible`),
    locked: booleanValue(input.locked, `projection item ${projectionItemRef}.locked`),
  };
}

export function normalizeBoardProjection(input, graphInput) {
  exactKeys(input, ['schemaVersion', 'projectionRef', 'graphRef', 'layoutIntent', 'items', 'sourceRefs'], 'BoardProjection');
  assert(input.schemaVersion === BOARD_PROJECTION_SCHEMA, 'BoardProjection schema mismatch');
  const graph = normalizeBoardGraph(graphInput);
  const projectionRef = stableRef(input.projectionRef, 'projectionRef');
  const graphRef = stableRef(input.graphRef, 'projection.graphRef');
  assert(graphRef === graph.graphRef, 'BoardProjection graphRef mismatch');
  assert(BOARD_LAYOUT_INTENTS.includes(input.layoutIntent), `unsupported layout intent ${input.layoutIntent}`);
  assert(Array.isArray(input.items), 'BoardProjection items must be an array');
  const items = input.items.map(normalizeProjectionItem)
    .sort((a, b) => compareCanonicalText(a.projectionItemRef, b.projectionItemRef));
  const byItemRef = new Map(items.map((item) => [item.projectionItemRef, item]));
  assert(byItemRef.size === items.length, 'BoardProjection projectionItemRef must be unique');
  const nodeRefs = new Set(graph.nodes.map((node) => node.nodeRef));
  for (const item of items) {
    assert(nodeRefs.has(item.semanticRef), `projection item ${item.projectionItemRef} semanticRef missing: ${item.semanticRef}`);
    if (item.parentProjectionItemRefOrNull !== null) {
      assert(byItemRef.has(item.parentProjectionItemRefOrNull), `projection item ${item.projectionItemRef} parent missing: ${item.parentProjectionItemRefOrNull}`);
      assert(item.parentProjectionItemRefOrNull !== item.projectionItemRef, `projection item ${item.projectionItemRef} cannot contain itself`);
    }
  }
  assertAcyclic(items, (item) => item.projectionItemRef, (item) => item.parentProjectionItemRefOrNull, 'projection containment');
  return {
    schemaVersion: BOARD_PROJECTION_SCHEMA,
    projectionRef,
    graphRef,
    layoutIntent: input.layoutIntent,
    items,
    sourceRefs: refs(input.sourceRefs, 'BoardProjection.sourceRefs'),
  };
}

export function normalizeBoardControl(input) {
  exactKeys(input, [
    'schemaVersion', 'controlRef', 'actorRef', 'act',
    'expectedGraphFingerprint', 'expectedProjectionFingerprint', 'arguments',
  ], 'BoardControl');
  assert(input.schemaVersion === BOARD_CONTROL_SCHEMA, 'BoardControl schema mismatch');
  assert(BOARD_CONTROL_ACTS.includes(input.act), `unsupported BoardControl act ${input.act}`);
  assert(typeof input.expectedGraphFingerprint === 'string' && HEX64.test(input.expectedGraphFingerprint),
    'expectedGraphFingerprint must be sha256');
  assert(typeof input.expectedProjectionFingerprint === 'string' && HEX64.test(input.expectedProjectionFingerprint),
    'expectedProjectionFingerprint must be sha256');
  assert(isObject(input.arguments), 'BoardControl arguments must be one object');
  return {
    schemaVersion: BOARD_CONTROL_SCHEMA,
    controlRef: stableRef(input.controlRef, 'controlRef'),
    actorRef: stableRef(input.actorRef, 'actorRef'),
    act: input.act,
    expectedGraphFingerprint: input.expectedGraphFingerprint,
    expectedProjectionFingerprint: input.expectedProjectionFingerprint,
    arguments: structuredClone(input.arguments),
  };
}

function replaceByRef(items, ref, refField, transform, missingMessage) {
  const index = items.findIndex((item) => item[refField] === ref);
  assert(index >= 0, missingMessage);
  const next = [...items];
  next[index] = transform(items[index]);
  return next;
}

function normalizeState(graph, projection) {
  const nextGraph = normalizeBoardGraph(graph);
  const nextProjection = normalizeBoardProjection(projection, nextGraph);
  return { graph: nextGraph, projection: nextProjection };
}

export function applyBoardAct({ graph: graphInput, projection: projectionInput, act, arguments: args }) {
  assert(BOARD_CONTROL_ACTS.includes(act), `unsupported BoardControl act ${act}`);
  const graph = normalizeBoardGraph(graphInput);
  const projection = normalizeBoardProjection(projectionInput, graph);
  let nextGraph = structuredClone(graph);
  let nextProjection = structuredClone(projection);
  let graphChanged = false;
  let projectionChanged = false;

  if (act === 'CREATE_NODE') {
    exactKeys(args, ['node', 'projectionItem'], 'CREATE_NODE arguments');
    const node = normalizeNode(args.node);
    assert(!graph.nodes.some((item) => item.nodeRef === node.nodeRef), `nodeRef already exists ${node.nodeRef}`);
    const item = normalizeProjectionItem(args.projectionItem);
    assert(item.semanticRef === node.nodeRef, 'CREATE_NODE projection semanticRef must equal nodeRef');
    assert(!projection.items.some((candidate) => candidate.projectionItemRef === item.projectionItemRef),
      `projectionItemRef already exists ${item.projectionItemRef}`);
    nextGraph.nodes.push(node);
    nextProjection.items.push(item);
    graphChanged = true;
    projectionChanged = true;
  } else if (act === 'MOVE_ITEM') {
    exactKeys(args, ['projectionItemRef', 'x', 'y'], 'MOVE_ITEM arguments');
    const ref = stableRef(args.projectionItemRef, 'MOVE_ITEM.projectionItemRef');
    nextProjection.items = replaceByRef(nextProjection.items, ref, 'projectionItemRef', (item) => {
      assert(!item.locked, `projection item ${ref} is locked`);
      return { ...item, bounds: { ...item.bounds, x: finiteNumber(args.x, 'MOVE_ITEM.x'), y: finiteNumber(args.y, 'MOVE_ITEM.y') } };
    }, `unknown projectionItemRef ${ref}`);
    projectionChanged = true;
  } else if (act === 'RESIZE_ITEM') {
    exactKeys(args, ['projectionItemRef', 'width', 'height'], 'RESIZE_ITEM arguments');
    const ref = stableRef(args.projectionItemRef, 'RESIZE_ITEM.projectionItemRef');
    nextProjection.items = replaceByRef(nextProjection.items, ref, 'projectionItemRef', (item) => {
      assert(!item.locked, `projection item ${ref} is locked`);
      return { ...item, bounds: { ...item.bounds, width: positiveNumber(args.width, 'RESIZE_ITEM.width'), height: positiveNumber(args.height, 'RESIZE_ITEM.height') } };
    }, `unknown projectionItemRef ${ref}`);
    projectionChanged = true;
  } else if (act === 'SET_LAYER') {
    exactKeys(args, ['projectionItemRef', 'layer'], 'SET_LAYER arguments');
    const ref = stableRef(args.projectionItemRef, 'SET_LAYER.projectionItemRef');
    nextProjection.items = replaceByRef(nextProjection.items, ref, 'projectionItemRef', (item) => ({
      ...item,
      layer: integer(args.layer, 'SET_LAYER.layer'),
    }), `unknown projectionItemRef ${ref}`);
    projectionChanged = true;
  } else if (act === 'SET_CONTAINMENT') {
    exactKeys(args, [
      'nodeRef', 'parentRefOrNull', 'projectionItemRef', 'parentProjectionItemRefOrNull',
    ], 'SET_CONTAINMENT arguments');
    const nodeRef = stableRef(args.nodeRef, 'SET_CONTAINMENT.nodeRef');
    const projectionItemRef = stableRef(args.projectionItemRef, 'SET_CONTAINMENT.projectionItemRef');
    const parentRefOrNull = optionalRef(args.parentRefOrNull, 'SET_CONTAINMENT.parentRefOrNull');
    const parentProjectionItemRefOrNull = optionalRef(args.parentProjectionItemRefOrNull, 'SET_CONTAINMENT.parentProjectionItemRefOrNull');
    const projectionItem = projection.items.find((item) => item.projectionItemRef === projectionItemRef);
    assert(projectionItem, `unknown projectionItemRef ${projectionItemRef}`);
    assert(projectionItem.semanticRef === nodeRef,
      `SET_CONTAINMENT projection item ${projectionItemRef} must project node ${nodeRef}`);
    assert((parentRefOrNull === null) === (parentProjectionItemRefOrNull === null),
      'SET_CONTAINMENT semantic and projection parents must both be null or both be present');
    if (parentRefOrNull !== null) {
      const parentProjectionItem = projection.items.find((item) => item.projectionItemRef === parentProjectionItemRefOrNull);
      assert(parentProjectionItem, `unknown parentProjectionItemRef ${parentProjectionItemRefOrNull}`);
      assert(parentProjectionItem.semanticRef === parentRefOrNull,
        `SET_CONTAINMENT parent projection ${parentProjectionItemRefOrNull} must project node ${parentRefOrNull}`);
    }
    nextGraph.nodes = replaceByRef(nextGraph.nodes, nodeRef, 'nodeRef', (node) => ({ ...node, parentRefOrNull }), `unknown nodeRef ${nodeRef}`);
    nextProjection.items = replaceByRef(nextProjection.items, projectionItemRef, 'projectionItemRef', (item) => ({
      ...item,
      parentProjectionItemRefOrNull,
    }), `unknown projectionItemRef ${projectionItemRef}`);
    graphChanged = true;
    projectionChanged = true;
  } else if (act === 'CONNECT_NODES') {
    exactKeys(args, ['relationship'], 'CONNECT_NODES arguments');
    const relationship = normalizeRelationship(args.relationship);
    assert(!graph.relationships.some((item) => item.relationshipRef === relationship.relationshipRef),
      `relationshipRef already exists ${relationship.relationshipRef}`);
    nextGraph.relationships.push(relationship);
    graphChanged = true;
  }

  const normalized = normalizeState(nextGraph, nextProjection);
  return Object.freeze({
    graph: normalized.graph,
    projection: normalized.projection,
    effects: Object.freeze({
      graphChanged,
      projectionChanged,
      externalEffectsPerformed: false,
    }),
  });
}

// [VXG RealForever][VEXWORK][VEXBOARD][SHARED-MODEL]
