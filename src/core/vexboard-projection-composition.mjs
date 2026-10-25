import { createBoardGraph, createBoardProjection } from './vexboard.mjs';

export const BOARD_PROJECTION_COMPOSITION_SCHEMA = 'vexboard.projection-composition/v1';
export const BOARD_PROJECTION_COMPOSITION_RESULT_SCHEMA = 'vexboard.projection-composition-result/v1';
export const BOARD_LOCAL_LAYOUT_MODES = Object.freeze(['FREE', 'ROW', 'COLUMN', 'STACK']);
export const BOARD_LOCAL_BOUNDARY_POLICIES = Object.freeze(['FAIL', 'WRAP', 'SERPENTINE']);

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

function fingerprint(value, label) {
  assert(typeof value === 'string' && HEX64.test(value), `${label} must be sha256`);
  return value;
}

function nonNegativeNumber(value, label) {
  assert(typeof value === 'number' && Number.isFinite(value) && value >= 0, `${label} must be a non-negative finite number`);
  return value;
}

function refList(values, label) {
  assert(Array.isArray(values), `${label} must be an array`);
  const refs = values.map((value, index) => stableRef(value, `${label}[${index}]`));
  assert(new Set(refs).size === refs.length, `${label} must be unique`);
  return refs;
}

function normalizeComposition(input) {
  exactKeys(input, [
    'schemaVersion', 'compositionRef', 'graphRef', 'projectionRef',
    'expectedGraphFingerprint', 'expectedProjectionFingerprint', 'metrics', 'containers',
  ], 'projection composition');
  assert(input.schemaVersion === BOARD_PROJECTION_COMPOSITION_SCHEMA, 'projection composition schema mismatch');
  exactKeys(input.metrics, ['padding', 'gap'], 'projection composition metrics');
  assert(Array.isArray(input.containers), 'projection composition containers must be an array');

  const containers = input.containers.map((container, index) => {
    assert(isObject(container), `projection composition containers[${index}] must be one object`);
    const legacyKeys = [
      'containerProjectionItemRef', 'layout', 'orderedChildProjectionItemRefs',
    ].sort(compareCanonicalText);
    const boundedKeys = [...legacyKeys, 'boundaryPolicy'].sort(compareCanonicalText);
    const actualKeys = Object.keys(container).sort(compareCanonicalText);
    assert(
      JSON.stringify(actualKeys) === JSON.stringify(legacyKeys)
        || JSON.stringify(actualKeys) === JSON.stringify(boundedKeys),
      `projection composition containers[${index}] schema drift`,
    );
    assert(BOARD_LOCAL_LAYOUT_MODES.includes(container.layout),
      `unsupported local layout mode ${container.layout}`);
    const boundaryPolicy = container.boundaryPolicy ?? 'FAIL';
    assert(BOARD_LOCAL_BOUNDARY_POLICIES.includes(boundaryPolicy),
      `unsupported local boundary policy ${boundaryPolicy}`);
    assert(
      boundaryPolicy === 'FAIL' || ['ROW', 'COLUMN'].includes(container.layout),
      `boundary policy ${boundaryPolicy} requires ROW or COLUMN layout`,
    );
    return {
      containerProjectionItemRef: stableRef(
        container.containerProjectionItemRef,
        `projection composition containers[${index}].containerProjectionItemRef`,
      ),
      layout: container.layout,
      boundaryPolicy,
      orderedChildProjectionItemRefs: refList(
        container.orderedChildProjectionItemRefs,
        `projection composition containers[${index}].orderedChildProjectionItemRefs`,
      ),
    };
  });
  assert(new Set(containers.map((container) => container.containerProjectionItemRef)).size === containers.length,
    'projection composition containerProjectionItemRef must be unique');

  return Object.freeze({
    schemaVersion: BOARD_PROJECTION_COMPOSITION_SCHEMA,
    compositionRef: stableRef(input.compositionRef, 'projection composition compositionRef'),
    graphRef: stableRef(input.graphRef, 'projection composition graphRef'),
    projectionRef: stableRef(input.projectionRef, 'projection composition projectionRef'),
    expectedGraphFingerprint: fingerprint(input.expectedGraphFingerprint, 'projection composition expectedGraphFingerprint'),
    expectedProjectionFingerprint: fingerprint(input.expectedProjectionFingerprint, 'projection composition expectedProjectionFingerprint'),
    metrics: Object.freeze({
      padding: nonNegativeNumber(input.metrics.padding, 'projection composition metrics.padding'),
      gap: nonNegativeNumber(input.metrics.gap, 'projection composition metrics.gap'),
    }),
    containers: Object.freeze(containers.map((container) => Object.freeze({
      ...container,
      orderedChildProjectionItemRefs: Object.freeze([...container.orderedChildProjectionItemRefs]),
    }))),
  });
}

function projectionDepth(itemRef, byItemRef, memo = new Map(), visiting = new Set()) {
  if (memo.has(itemRef)) return memo.get(itemRef);
  assert(!visiting.has(itemRef), `projection containment cycle detected at ${itemRef}`);
  visiting.add(itemRef);
  const item = byItemRef.get(itemRef);
  assert(item, `unknown projectionItemRef ${itemRef}`);
  const value = item.parentProjectionItemRefOrNull === null
    ? 0
    : projectionDepth(item.parentProjectionItemRefOrNull, byItemRef, memo, visiting) + 1;
  visiting.delete(itemRef);
  memo.set(itemRef, value);
  return value;
}

function sameRefSet(left, right) {
  if (left.length !== right.length) return false;
  const expected = new Set(left);
  return right.every((ref) => expected.has(ref));
}

function innerContainerBounds(containerBounds, padding) {
  return {
    left: containerBounds.x + padding,
    top: containerBounds.y + padding,
    right: containerBounds.x + containerBounds.width - padding,
    bottom: containerBounds.y + containerBounds.height - padding,
  };
}

function createBoundaryFlowState({ layout, containerBounds, padding }) {
  const inner = innerContainerBounds(containerBounds, padding);
  return {
    layout,
    inner,
    lineIndex: 0,
    direction: 1,
    cursorX: inner.left,
    cursorY: inner.top,
    lineCrossExtent: 0,
  };
}

function beginNextBoundaryLine(state, boundaryPolicy, gap) {
  state.lineIndex += 1;
  const reverse = boundaryPolicy === 'SERPENTINE' && state.lineIndex % 2 === 1;
  state.direction = reverse ? -1 : 1;
  if (state.layout === 'ROW') {
    state.cursorY += state.lineCrossExtent + gap;
    state.cursorX = reverse ? state.inner.right : state.inner.left;
  } else {
    state.cursorX += state.lineCrossExtent + gap;
    state.cursorY = reverse ? state.inner.bottom : state.inner.top;
  }
  state.lineCrossExtent = 0;
}

function boundedRowPosition({ state, childBounds, boundaryPolicy, gap }) {
  const width = childBounds.width;
  const wouldOverflow = state.direction === 1
    ? state.cursorX + width > state.inner.right
    : state.cursorX - width < state.inner.left;
  if (wouldOverflow && state.lineCrossExtent > 0) beginNextBoundaryLine(state, boundaryPolicy, gap);
  const x = state.direction === 1 ? state.cursorX : state.cursorX - width;
  const y = state.cursorY;
  state.cursorX = state.direction === 1 ? x + width + gap : x - gap;
  state.lineCrossExtent = Math.max(state.lineCrossExtent, childBounds.height);
  return { x, y };
}

function boundedColumnPosition({ state, childBounds, boundaryPolicy, gap }) {
  const height = childBounds.height;
  const wouldOverflow = state.direction === 1
    ? state.cursorY + height > state.inner.bottom
    : state.cursorY - height < state.inner.top;
  if (wouldOverflow && state.lineCrossExtent > 0) beginNextBoundaryLine(state, boundaryPolicy, gap);
  const x = state.cursorX;
  const y = state.direction === 1 ? state.cursorY : state.cursorY - height;
  state.cursorY = state.direction === 1 ? y + height + gap : y - gap;
  state.lineCrossExtent = Math.max(state.lineCrossExtent, childBounds.width);
  return { x, y };
}

function desiredPosition({
  layout, boundaryPolicy, containerBounds, childBounds, priorChildren, padding, gap, flowState,
}) {
  if (layout === 'FREE') return { x: childBounds.x, y: childBounds.y };
  if (layout === 'STACK') return { x: containerBounds.x + padding, y: containerBounds.y + padding };
  if (boundaryPolicy !== 'FAIL') {
    if (layout === 'ROW') return boundedRowPosition({ state: flowState, childBounds, boundaryPolicy, gap });
    return boundedColumnPosition({ state: flowState, childBounds, boundaryPolicy, gap });
  }
  if (layout === 'ROW') {
    const x = priorChildren.reduce(
      (cursor, child) => cursor + child.bounds.width + gap,
      containerBounds.x + padding,
    );
    return { x, y: containerBounds.y + padding };
  }
  const y = priorChildren.reduce(
    (cursor, child) => cursor + child.bounds.height + gap,
    containerBounds.y + padding,
  );
  return { x: containerBounds.x + padding, y };
}

function assertInsideContainer(container, child, bounds, padding) {
  const left = container.bounds.x + padding;
  const top = container.bounds.y + padding;
  const right = container.bounds.x + container.bounds.width - padding;
  const bottom = container.bounds.y + container.bounds.height - padding;
  assert(bounds.x >= left && bounds.y >= top
    && bounds.x + child.bounds.width <= right
    && bounds.y + child.bounds.height <= bottom,
  `projection composition child ${child.projectionItemRef} exceeds container ${container.projectionItemRef} bounds`);
}

export function resolveBoardProjectionComposition({ graph: graphInput, projection: projectionInput, composition: compositionInput }) {
  const graph = createBoardGraph(graphInput);
  const projection = createBoardProjection(projectionInput, graph);
  const composition = normalizeComposition(compositionInput);

  assert(composition.graphRef === graph.graphRef, 'projection composition graphRef mismatch');
  assert(composition.projectionRef === projection.projectionRef, 'projection composition projectionRef mismatch');
  assert(composition.expectedGraphFingerprint === graph.semanticFingerprint, 'stale BoardGraph observation for projection composition');
  assert(composition.expectedProjectionFingerprint === projection.semanticFingerprint, 'stale BoardProjection observation for projection composition');

  const next = structuredClone(projection);
  delete next.semanticFingerprint;
  const byItemRef = new Map(next.items.map((item) => [item.projectionItemRef, item]));
  const depthMemo = new Map();
  const orderedContainers = [...composition.containers].sort((left, right) => {
    const depthDelta = projectionDepth(left.containerProjectionItemRef, byItemRef, depthMemo)
      - projectionDepth(right.containerProjectionItemRef, byItemRef, depthMemo);
    return depthDelta || compareCanonicalText(left.containerProjectionItemRef, right.containerProjectionItemRef);
  });

  for (const local of orderedContainers) {
    const container = byItemRef.get(local.containerProjectionItemRef);
    assert(container, `unknown container projectionItemRef ${local.containerProjectionItemRef}`);
    const directChildren = next.items
      .filter((item) => item.parentProjectionItemRefOrNull === container.projectionItemRef)
      .map((item) => item.projectionItemRef);
    assert(sameRefSet(directChildren, local.orderedChildProjectionItemRefs),
      `projection composition children for ${container.projectionItemRef} must exactly cover direct projection children`);

    const resolvedChildren = [];
    const flowState = local.boundaryPolicy === 'FAIL'
      ? null
      : createBoundaryFlowState({
        layout: local.layout,
        containerBounds: container.bounds,
        padding: composition.metrics.padding,
      });
    for (let index = 0; index < local.orderedChildProjectionItemRefs.length; index += 1) {
      const childRef = local.orderedChildProjectionItemRefs[index];
      const child = byItemRef.get(childRef);
      assert(child, `unknown child projectionItemRef ${childRef}`);
      const desired = desiredPosition({
        layout: local.layout,
        boundaryPolicy: local.boundaryPolicy,
        containerBounds: container.bounds,
        childBounds: child.bounds,
        priorChildren: resolvedChildren,
        padding: composition.metrics.padding,
        gap: composition.metrics.gap,
        flowState,
      });
      const changed = desired.x !== child.bounds.x || desired.y !== child.bounds.y;
      assert(!changed || !child.locked,
        `projection composition cannot reposition locked child ${child.projectionItemRef}`);
      if (local.layout !== 'FREE') assertInsideContainer(container, child, desired, composition.metrics.padding);
      child.bounds = { ...child.bounds, x: desired.x, y: desired.y };
      resolvedChildren.push(child);
    }
  }

  const resolvedProjection = createBoardProjection(next, graph);
  return Object.freeze({
    schemaVersion: BOARD_PROJECTION_COMPOSITION_RESULT_SCHEMA,
    compositionRef: composition.compositionRef,
    graph,
    priorProjectionFingerprint: projection.semanticFingerprint,
    nextProjectionFingerprint: resolvedProjection.semanticFingerprint,
    projection: resolvedProjection,
    effects: Object.freeze({
      graphChanged: false,
      projectionChanged: projection.semanticFingerprint !== resolvedProjection.semanticFingerprint,
      externalEffectsPerformed: false,
    }),
  });
}

// [VXG RealForever][VEXWORK][VEXBOARD][PROJECTION-COMPOSITION]
