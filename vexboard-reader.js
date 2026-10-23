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

export const VEXBOARD_DRAFT_SCHEMA = 'vexboard.local-draft/v1';
export const VEXBOARD_SELF_MAP_URL = './self-map.json';
export const VEXBOARD_DRAFT_STORAGE_KEY = 'vexboard.local-drafts/v1';

export function localPointFromClient({ clientX, clientY }, { left, top }) {
  for (const [label, value] of Object.entries({ clientX, clientY, left, top })) {
    if (typeof value !== 'number' || !Number.isFinite(value)) throw new TypeError(`${label} must be finite`);
  }
  return Object.freeze({ x: clientX - left, y: clientY - top });
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
