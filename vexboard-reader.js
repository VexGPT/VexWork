import {
  BOARD_CONTROL_SCHEMA,
  BOARD_GRAPH_SCHEMA,
  BOARD_PROJECTION_SCHEMA,
  applyBoardAct,
  freezeBoardValue,
  normalizeBoardControl,
  normalizeBoardGraph,
  normalizeBoardProjection,
} from './src/shared/vexboard-model.mjs';
import {
  BOARD_JOURNEY_SCHEMA,
  advanceBoardJourney,
  backBoardJourney,
  createBoardJourney,
  journeyChoices,
  normalizeBoardJourney,
  revisitBoardJourney,
} from './src/shared/vexboard-journey.mjs';

import {
  BOARD_CONDITION_OPERATORS,
  BOARD_CONDITION_STATES,
  BOARD_INTERACTION_TRIGGERS,
  BOARD_PROTOTYPE_SCHEMA,
  BOARD_SCENARIO_SCHEMA,
  BOARD_SIMULATED_ACTION_KINDS,
  BOARD_SIMULATION_RESULT_SCHEMA,
  applyBoardInteraction,
  boardInteractionChoices,
  createBoardScenario,
  evaluateBoardCondition,
  normalizeBoardPrototype,
  normalizeBoardScenario,
} from './src/shared/vexboard-simulation.mjs';


export {
  BOARD_JOURNEY_SCHEMA,
  advanceBoardJourney,
  backBoardJourney,
  createBoardJourney,
  journeyChoices,
  normalizeBoardJourney,
  revisitBoardJourney,
  BOARD_CONDITION_OPERATORS,
  BOARD_CONDITION_STATES,
  BOARD_INTERACTION_TRIGGERS,
  BOARD_PROTOTYPE_SCHEMA,
  BOARD_SCENARIO_SCHEMA,
  BOARD_SIMULATED_ACTION_KINDS,
  BOARD_SIMULATION_RESULT_SCHEMA,
  applyBoardInteraction,
  boardInteractionChoices,
  createBoardScenario,
  evaluateBoardCondition,
  normalizeBoardPrototype,
  normalizeBoardScenario,
};

export const VEXBOARD_DRAFT_SCHEMA = 'vexboard.local-draft/v1';
export const VEXBOARD_NEIGHBORHOOD_SCHEMA = 'vexboard.board-neighborhood/v1';
export const VEXBOARD_SELF_MAP_URL = './self-map.json';
export const VEXBOARD_DRAFT_STORAGE_KEY = 'vexboard.local-drafts/v1';
export const VEXBOARD_BUILTIN_BOARD_URLS = Object.freeze({
  'board.vexboard.self-map': './self-map.json',
  'board.vexboard.publish': './publish-map.json',
});

const MIN_ZOOM = 0.2;
const MAX_ZOOM = 3;

function finite(value, label) {
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new TypeError(`${label} must be finite`);
  return value;
}

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

export function builtinBoardUrl(boardRef) {
  if (typeof boardRef !== 'string' || !boardRef) throw new TypeError('boardRef required');
  return VEXBOARD_BUILTIN_BOARD_URLS[boardRef] ?? null;
}

export function localPointFromClient({ clientX, clientY }, { left, top }) {
  for (const [label, value] of Object.entries({ clientX, clientY, left, top })) finite(value, label);
  return Object.freeze({ x: clientX - left, y: clientY - top });
}

export function normalizeCamera(input = {}) {
  const x = finite(input.x ?? 0, 'camera.x');
  const y = finite(input.y ?? 0, 'camera.y');
  const zoom = clamp(finite(input.zoom ?? 1, 'camera.zoom'), MIN_ZOOM, MAX_ZOOM);
  return Object.freeze({ x, y, zoom });
}

export function boardPointFromClient({ clientX, clientY }, { left, top }, cameraInput) {
  const local = localPointFromClient({ clientX, clientY }, { left, top });
  const camera = normalizeCamera(cameraInput);
  return Object.freeze({
    x: (local.x - camera.x) / camera.zoom,
    y: (local.y - camera.y) / camera.zoom,
  });
}

export function zoomCameraAt(cameraInput, { factor, anchorX, anchorY }) {
  const camera = normalizeCamera(cameraInput);
  finite(factor, 'zoom factor');
  if (factor <= 0) throw new TypeError('zoom factor must be positive');
  finite(anchorX, 'zoom anchorX');
  finite(anchorY, 'zoom anchorY');
  const nextZoom = clamp(camera.zoom * factor, MIN_ZOOM, MAX_ZOOM);
  const boardX = (anchorX - camera.x) / camera.zoom;
  const boardY = (anchorY - camera.y) / camera.zoom;
  return normalizeCamera({
    x: anchorX - boardX * nextZoom,
    y: anchorY - boardY * nextZoom,
    zoom: nextZoom,
  });
}

export function projectionBounds(items) {
  if (!Array.isArray(items)) throw new TypeError('projection items must be an array');
  const visible = items.filter((item) => item?.visible !== false);
  if (!visible.length) return Object.freeze({ x: 0, y: 0, width: 1, height: 1 });
  const left = Math.min(...visible.map((item) => finite(item.bounds?.x, 'projection bounds x')));
  const top = Math.min(...visible.map((item) => finite(item.bounds?.y, 'projection bounds y')));
  const right = Math.max(...visible.map((item) => finite(item.bounds?.x, 'projection bounds x') + finite(item.bounds?.width, 'projection bounds width')));
  const bottom = Math.max(...visible.map((item) => finite(item.bounds?.y, 'projection bounds y') + finite(item.bounds?.height, 'projection bounds height')));
  return Object.freeze({ x: left, y: top, width: Math.max(1, right - left), height: Math.max(1, bottom - top) });
}

export function cameraForBounds(bounds, viewport, options = {}) {
  for (const [label, value] of Object.entries({
    x: bounds?.x, y: bounds?.y, width: bounds?.width, height: bounds?.height,
    viewportWidth: viewport?.width, viewportHeight: viewport?.height,
  })) finite(value, label);
  if (bounds.width <= 0 || bounds.height <= 0 || viewport.width <= 0 || viewport.height <= 0) {
    throw new TypeError('camera bounds and viewport must be positive');
  }
  const padding = finite(options.padding ?? 72, 'camera padding');
  const minZoom = clamp(finite(options.minZoom ?? MIN_ZOOM, 'camera minZoom'), MIN_ZOOM, MAX_ZOOM);
  const maxZoom = clamp(finite(options.maxZoom ?? 1.6, 'camera maxZoom'), minZoom, MAX_ZOOM);
  const usableWidth = Math.max(1, viewport.width - padding * 2);
  const usableHeight = Math.max(1, viewport.height - padding * 2);
  const zoom = clamp(Math.min(usableWidth / bounds.width, usableHeight / bounds.height), minZoom, maxZoom);
  const centerX = bounds.x + bounds.width / 2;
  const centerY = bounds.y + bounds.height / 2;
  return normalizeCamera({
    x: viewport.width / 2 - centerX * zoom,
    y: viewport.height / 2 - centerY * zoom,
    zoom,
  });
}

export function boardViewport(cameraInput, viewport) {
  const camera = normalizeCamera(cameraInput);
  const width = finite(viewport?.width, 'viewport width');
  const height = finite(viewport?.height, 'viewport height');
  if (width <= 0 || height <= 0) throw new TypeError('viewport dimensions must be positive');
  return Object.freeze({
    x: -camera.x / camera.zoom,
    y: -camera.y / camera.zoom,
    width: width / camera.zoom,
    height: height / camera.zoom,
  });
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  }
  return value;
}

function utf8(value) {
  return new TextEncoder().encode(value);
}

function hex(bytes) {
  return [...new Uint8Array(bytes)].map((value) => value.toString(16).padStart(2, '0')).join('');
}

export async function semanticHash(value) {
  const digest = await globalThis.crypto.subtle.digest('SHA-256', utf8(JSON.stringify(canonicalize(value))));
  return hex(digest);
}

async function verifyInputFingerprint(value, label) {
  if (value?.semanticFingerprint === undefined) return;
  const core = structuredClone(value);
  delete core.semanticFingerprint;
  const observed = await semanticHash(core);
  if (value.semanticFingerprint !== observed) throw new TypeError(`${label} semanticFingerprint mismatch`);
}

async function fingerprint(value) {
  const core = structuredClone(value);
  delete core.semanticFingerprint;
  return freezeBoardValue({ ...core, semanticFingerprint: await semanticHash(core) });
}

function stripFingerprint(value) {
  const copy = structuredClone(value);
  delete copy.semanticFingerprint;
  return copy;
}

export async function hydrateBoardState(graphInput, projectionInput) {
  await verifyInputFingerprint(graphInput, 'BoardGraph');
  const graph = await fingerprint(normalizeBoardGraph(stripFingerprint(graphInput)));
  await verifyInputFingerprint(projectionInput, 'BoardProjection');
  const projection = await fingerprint(normalizeBoardProjection(stripFingerprint(projectionInput), stripFingerprint(graph)));
  return Object.freeze({ graph, projection });
}

export function visibleProjectionItems(graphInput, projectionInput, collapsedNodeRefs = []) {
  const graph = normalizeBoardGraph(stripFingerprint(graphInput));
  const projection = normalizeBoardProjection(stripFingerprint(projectionInput), graph);
  if (!Array.isArray(collapsedNodeRefs) || collapsedNodeRefs.some((value) => typeof value !== 'string')) {
    throw new TypeError('collapsedNodeRefs must be an array of refs');
  }
  const collapsed = new Set(collapsedNodeRefs);
  const byRef = new Map(graph.nodes.map((node) => [node.nodeRef, node]));
  const hiddenByAncestor = (semanticRef) => {
    let cursor = byRef.get(semanticRef)?.parentRefOrNull ?? null;
    while (cursor) {
      if (collapsed.has(cursor)) return true;
      cursor = byRef.get(cursor)?.parentRefOrNull ?? null;
    }
    return false;
  };
  return Object.freeze(projection.items.filter((item) => item.visible && !hiddenByAncestor(item.semanticRef)));
}

export function queryBoardNeighborhood(state, options) {
  const graph = normalizeBoardGraph(stripFingerprint(state?.graph));
  const projection = normalizeBoardProjection(stripFingerprint(state?.projection), graph);
  const semanticRef = options?.semanticRef;
  if (typeof semanticRef !== 'string' || !semanticRef) throw new TypeError('semanticRef required');
  const depth = options?.depth ?? 1;
  const maxNodes = options?.maxNodes ?? 25;
  if (!Number.isInteger(depth) || depth < 0 || depth > 4) throw new TypeError('depth must be an integer from 0 to 4');
  if (!Number.isInteger(maxNodes) || maxNodes < 1 || maxNodes > 100) throw new TypeError('maxNodes must be an integer from 1 to 100');
  const byRef = new Map(graph.nodes.map((node) => [node.nodeRef, node]));
  if (!byRef.has(semanticRef)) throw new TypeError(`unknown semanticRef ${semanticRef}`);
  const neighbors = new Map(graph.nodes.map((node) => [node.nodeRef, new Set()]));
  for (const node of graph.nodes) {
    if (node.parentRefOrNull) {
      neighbors.get(node.nodeRef).add(node.parentRefOrNull);
      neighbors.get(node.parentRefOrNull).add(node.nodeRef);
    }
  }
  for (const relationship of graph.relationships) {
    neighbors.get(relationship.fromRef).add(relationship.toRef);
    neighbors.get(relationship.toRef).add(relationship.fromRef);
  }
  const seen = new Map([[semanticRef, 0]]);
  const queue = [semanticRef];
  while (queue.length && seen.size < maxNodes) {
    const ref = queue.shift();
    const currentDepth = seen.get(ref);
    if (currentDepth >= depth) continue;
    for (const next of [...neighbors.get(ref)].sort()) {
      if (seen.has(next)) continue;
      seen.set(next, currentDepth + 1);
      queue.push(next);
      if (seen.size >= maxNodes) break;
    }
  }
  const refs = [...seen.keys()].sort();
  const refSet = new Set(refs);
  const nodes = graph.nodes.filter((node) => refSet.has(node.nodeRef));
  const relationships = graph.relationships.filter((relationship) => refSet.has(relationship.fromRef) && refSet.has(relationship.toRef));
  const items = projection.items.filter((item) => refSet.has(item.semanticRef));
  const sourceRefs = [...new Set([
    ...graph.sourceRefs,
    ...nodes.flatMap((node) => node.sourceRefs),
    ...relationships.flatMap((relationship) => relationship.sourceRefs),
    ...projection.sourceRefs,
  ])].sort();
  return freezeBoardValue({
    schemaVersion: VEXBOARD_NEIGHBORHOOD_SCHEMA,
    graphRef: graph.graphRef,
    projectionRef: projection.projectionRef,
    centerRef: semanticRef,
    depth,
    nodes,
    relationships,
    projectionItems: items,
    sourceRefs,
  });
}

export async function applyBoardControl({ graph: graphInput, projection: projectionInput, control: controlInput }) {
  const current = await hydrateBoardState(graphInput, projectionInput);
  const control = normalizeBoardControl(controlInput);
  if (control.expectedGraphFingerprint !== current.graph.semanticFingerprint) throw new TypeError('stale BoardGraph observation');
  if (control.expectedProjectionFingerprint !== current.projection.semanticFingerprint) throw new TypeError('stale BoardProjection observation');
  const result = applyBoardAct({
    graph: stripFingerprint(current.graph),
    projection: stripFingerprint(current.projection),
    act: control.act,
    arguments: control.arguments,
  });
  const next = await hydrateBoardState(result.graph, result.projection);
  return Object.freeze({ ...next, effects: result.effects, controlRef: control.controlRef, act: control.act });
}

export function normalizeDraft(input) {
  if (!input || input.schemaVersion !== VEXBOARD_DRAFT_SCHEMA) throw new TypeError('unsupported VexBoard draft schema');
  if (typeof input.draftRef !== 'string' || !input.draftRef) throw new TypeError('draftRef required');
  if (typeof input.title !== 'string' || !input.title.trim()) throw new TypeError('draft title required');
  if (!['LOCAL_DRAFT', 'READ_ONLY_SOURCE'].includes(input.mode)) throw new TypeError('draft mode invalid');
  if (input.derivedFromRefOrNull !== null && typeof input.derivedFromRefOrNull !== 'string') throw new TypeError('derivedFromRefOrNull invalid');
  if (input.savedAtOrNull !== null && typeof input.savedAtOrNull !== 'string') throw new TypeError('savedAtOrNull invalid');
  return structuredClone(input);
}

export async function createBlankDraft({ draftRef, title = 'Untitled VexBoard' }) {
  const graphRef = `graph.${draftRef}`;
  const state = await hydrateBoardState({
    schemaVersion: BOARD_GRAPH_SCHEMA,
    graphRef,
    nodes: [],
    relationships: [],
    sourceRefs: [],
  }, {
    schemaVersion: BOARD_PROJECTION_SCHEMA,
    projectionRef: `projection.${draftRef}`,
    graphRef,
    layoutIntent: 'FREE_WITH_CONSTRAINTS',
    items: [],
    sourceRefs: [],
  });
  return Object.freeze({
    schemaVersion: VEXBOARD_DRAFT_SCHEMA,
    draftRef,
    title,
    mode: 'LOCAL_DRAFT',
    derivedFromRefOrNull: null,
    savedAtOrNull: null,
    graph: state.graph,
    projection: state.projection,
  });
}

export async function forkReadOnlyBoard(source, { draftRef, title = null }) {
  const accepted = normalizeDraft(source);
  const hydrated = await hydrateBoardState(accepted.graph, accepted.projection);
  return Object.freeze({
    schemaVersion: VEXBOARD_DRAFT_SCHEMA,
    draftRef,
    title: title || `${accepted.title} — draft`,
    mode: 'LOCAL_DRAFT',
    derivedFromRefOrNull: accepted.draftRef,
    savedAtOrNull: null,
    graph: hydrated.graph,
    projection: hydrated.projection,
  });
}

export function serializeDraft(input) {
  const draft = normalizeDraft(input);
  return JSON.stringify(draft, null, 2);
}

export function deserializeDraft(text) {
  return normalizeDraft(JSON.parse(text));
}

export function parseDraftCollection(text) {
  if (!text) return [];
  const value = JSON.parse(text);
  if (!Array.isArray(value)) throw new TypeError('draft collection must be an array');
  return value.map(normalizeDraft);
}

export function upsertDraft(collection, draftInput) {
  const draft = normalizeDraft(draftInput);
  const next = collection.map(normalizeDraft).filter((item) => item.draftRef !== draft.draftRef);
  next.push(draft);
  return next.sort((a, b) => a.title.localeCompare(b.title) || a.draftRef.localeCompare(b.draftRef));
}

export function controlFor(state, { controlRef, actorRef, act, arguments: args }) {
  return {
    schemaVersion: BOARD_CONTROL_SCHEMA,
    controlRef,
    actorRef,
    act,
    expectedGraphFingerprint: state.graph.semanticFingerprint,
    expectedProjectionFingerprint: state.projection.semanticFingerprint,
    arguments: structuredClone(args),
  };
}

// [VXG RealForever][VEXWORK][VEXBOARD][BROWSER-READER]
