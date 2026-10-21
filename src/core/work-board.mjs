import { projectWorkRefs } from './workgraph.mjs';
import { verifySemanticFingerprint, withSemanticFingerprint } from './semantic.mjs';

export const BOARD_VIEW_SCHEMA = 'vexwork.work-board-view/v1';
export const BOARD_PROJECTION_SCHEMA = 'vexwork.work-board-projection/v1';
export const PARKING_LOT_PROJECTION_SCHEMA = 'vexwork.parking-lot-projection/v1';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function laneIndex(registry) {
  const byState = new Map();
  for (const lane of registry.boardLanes) {
    for (const state of lane.lifecycleStates) {
      assert(!byState.has(state), `state ${state} belongs to more than one lane`);
      byState.set(state, lane.laneRef);
    }
  }
  return byState;
}

function card(item) {
  return Object.freeze({
    workRef: item.workRef,
    label: item.label,
    purpose: item.purpose,
    workClass: item.workClass,
    state: item.state,
    workDisposition: item.workDisposition,
    priorityClass: item.priorityClass,
    dependencyRefs: item.dependencyRefs,
    repositoryRefs: item.repositoryRefs,
    formationProcessRefOrNull: item.formationProcessRefOrNull,
    nextProcessRefs: item.nextProcessRefs,
    authorityDisposition: item.authorityDisposition,
    effectDisposition: item.effectDisposition,
    updatedAt: item.updatedAt,
    semanticFingerprint: item.semanticFingerprint,
  });
}

export function createBoardView(input, registry) {
  assert(input?.schemaVersion === BOARD_VIEW_SCHEMA, 'board view schema mismatch');
  assert(typeof input.viewRef === 'string' && input.viewRef.length > 0, 'viewRef required');
  assert(typeof input.projectRef === 'string' && input.projectRef.length > 0, 'projectRef required');
  assert(typeof input.label === 'string' && input.label.trim(), 'view label required');
  assert(Array.isArray(input.laneRefOrder) && input.laneRefOrder.length > 0, 'laneRefOrder required');
  const known = new Set(registry.boardLanes.map((lane) => lane.laneRef));
  assert(input.laneRefOrder.every((ref) => known.has(ref)), 'board view contains unknown lane');
  if (input.semanticFingerprint && !verifySemanticFingerprint(input)) throw new TypeError('board view semanticFingerprint mismatch');
  return withSemanticFingerprint(input);
}

export function projectWorkBoard({ project, graph, view, registry }) {
  assert(verifySemanticFingerprint(project), 'project semanticFingerprint mismatch');
  assert(verifySemanticFingerprint(graph), 'workgraph semanticFingerprint mismatch');
  if (!verifySemanticFingerprint(view)) view = createBoardView(view, registry);
  assert(project.projectRef === view.projectRef, 'project/view identity mismatch');

  const selectedRefs = new Set(projectWorkRefs(project, graph));
  const byLane = new Map(registry.boardLanes.map((lane) => [lane.laneRef, { laneRef: lane.laneRef, label: lane.label, cards: [] }]));
  const states = laneIndex(registry);
  for (const item of graph.items) {
    if (!selectedRefs.has(item.workRef)) continue;
    const laneRef = states.get(item.state);
    assert(laneRef, `no board lane for state ${item.state}`);
    byLane.get(laneRef).cards.push(card(item));
  }
  const priorityRank = new Map(registry.priorityClasses.map((value, index) => [value, index]));
  const lanes = view.laneRefOrder.map((laneRef) => {
    const lane = byLane.get(laneRef);
    lane.cards.sort((a, b) => priorityRank.get(a.priorityClass) - priorityRank.get(b.priorityClass) || a.workRef.localeCompare(b.workRef));
    return Object.freeze(lane);
  });
  return withSemanticFingerprint({
    schemaVersion: BOARD_PROJECTION_SCHEMA,
    projectRef: project.projectRef,
    graphRef: graph.graphRef,
    graphSemanticFingerprint: graph.semanticFingerprint,
    viewRef: view.viewRef,
    lanes,
    effects: false,
    executionAuthority: 'NONE',
  });
}

export function projectParkingLot({ graph, registry, repositoryRefOrNull = null }) {
  assert(verifySemanticFingerprint(graph), 'workgraph semanticFingerprint mismatch');
  const terminal = new Set(registry.terminalStates);
  const items = graph.items
    .filter((item) => item.workDisposition === 'PARKED')
    .filter((item) => !terminal.has(item.state))
    .filter((item) => repositoryRefOrNull === null || item.repositoryRefs.includes(repositoryRefOrNull))
    .map(card)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt) || a.workRef.localeCompare(b.workRef));
  return withSemanticFingerprint({
    schemaVersion: PARKING_LOT_PROJECTION_SCHEMA,
    graphRef: graph.graphRef,
    graphSemanticFingerprint: graph.semanticFingerprint,
    repositoryRefOrNull,
    items,
    effects: false,
    executionAuthority: 'NONE',
  });
}

export function projectWorkGraph({ project, graph }) {
  assert(verifySemanticFingerprint(project), 'project semanticFingerprint mismatch');
  assert(verifySemanticFingerprint(graph), 'workgraph semanticFingerprint mismatch');
  const selected = new Set(projectWorkRefs(project, graph));
  const nodes = graph.items.filter((item) => selected.has(item.workRef)).map((item) => ({
    workRef: item.workRef,
    label: item.label,
    workClass: item.workClass,
    state: item.state,
    workDisposition: item.workDisposition,
    parentWorkRefOrNull: item.parentWorkRefOrNull,
    repositoryRefs: item.repositoryRefs,
  }));
  const edges = [];
  for (const item of graph.items) {
    if (!selected.has(item.workRef)) continue;
    if (item.parentWorkRefOrNull && selected.has(item.parentWorkRefOrNull)) edges.push({ kind: 'CONTAINS', from: item.parentWorkRefOrNull, to: item.workRef });
    for (const dep of item.dependencyRefs) if (selected.has(dep)) edges.push({ kind: 'DEPENDS_ON', from: item.workRef, to: dep });
    for (const repo of item.repositoryRefs) edges.push({ kind: 'TOUCHES_REPOSITORY', from: item.workRef, to: repo });
  }
  return withSemanticFingerprint({
    schemaVersion: 'vexwork.work-graph-projection/v1',
    projectRef: project.projectRef,
    graphRef: graph.graphRef,
    graphSemanticFingerprint: graph.semanticFingerprint,
    nodes,
    edges,
    effects: false,
    executionAuthority: 'NONE',
  });
}
