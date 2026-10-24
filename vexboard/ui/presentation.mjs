export const PALETTE_MODES = Object.freeze(['STANDARD', 'COLOR_SAFE', 'HIGH_CONTRAST']);
export const VEXBOARD_PALETTE_STORAGE_KEY = 'vexboard.palette-mode/v1';

const FLOW_KINDS = new Set(['FLOW', 'TRANSITION']);

function assertGraph(graph) {
  if (!graph || !Array.isArray(graph.nodes) || !Array.isArray(graph.relationships)) {
    throw new TypeError('graph with nodes and relationships required');
  }
}

function compareText(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

export function normalizePaletteMode(value) {
  return PALETTE_MODES.includes(value) ? value : 'STANDARD';
}

export function nextPaletteMode(value) {
  const current = normalizePaletteMode(value);
  return PALETTE_MODES[(PALETTE_MODES.indexOf(current) + 1) % PALETTE_MODES.length];
}

export function semanticRole(graph, nodeRef) {
  assertGraph(graph);
  const node = graph.nodes.find((candidate) => candidate.nodeRef === nodeRef);
  if (!node) throw new TypeError(`unknown nodeRef ${nodeRef}`);
  if (node.kind === 'CONTAINER') return 'CONTAINER';
  if (node.kind === 'DECISION') return 'DECISION';

  const incoming = graph.relationships.filter((relationship) =>
    FLOW_KINDS.has(relationship.kind) && relationship.toRef === nodeRef);
  const outgoing = graph.relationships.filter((relationship) =>
    FLOW_KINDS.has(relationship.kind) && relationship.fromRef === nodeRef);

  if (incoming.length === 0 && outgoing.length > 0) return 'BEGIN';
  if (outgoing.length === 0 && incoming.length > 0) return 'END';
  return 'PROCESS';
}

export function roleMarker(role) {
  return Object.freeze({
    BEGIN: 'START',
    DECISION: 'CHOICE',
    END: 'END',
    CONTAINER: 'FRAME',
    PROCESS: '',
  })[role] ?? '';
}

export function deriveBranchPresentation(graph) {
  assertGraph(graph);
  const flowRelationships = graph.relationships
    .filter((relationship) => FLOW_KINDS.has(relationship.kind))
    .sort((left, right) => compareText(left.relationshipRef, right.relationshipRef));

  const outgoing = new Map(graph.nodes.map((node) => [node.nodeRef, []]));
  const incoming = new Map(graph.nodes.map((node) => [node.nodeRef, []]));
  for (const relationship of flowRelationships) {
    outgoing.get(relationship.fromRef)?.push(relationship);
    incoming.get(relationship.toRef)?.push(relationship);
  }
  for (const list of outgoing.values()) list.sort((a, b) => compareText(a.relationshipRef, b.relationshipRef));
  for (const list of incoming.values()) list.sort((a, b) => compareText(a.relationshipRef, b.relationshipRef));

  const nodeAccentByRef = {};
  const relationshipAccentByRef = {};
  const queued = new Set();
  const queue = [];

  function seed(nodeRef, accent) {
    if (nodeAccentByRef[nodeRef] === undefined) nodeAccentByRef[nodeRef] = accent;
    if (!queued.has(nodeRef)) {
      queued.add(nodeRef);
      queue.push(nodeRef);
    }
  }

  function drain() {
    while (queue.length) {
      const nodeRef = queue.shift();
      const currentAccent = nodeAccentByRef[nodeRef];
      const branches = outgoing.get(nodeRef) ?? [];
      branches.forEach((relationship, index) => {
        const accent = branches.length > 1
          ? ((Number.isInteger(currentAccent) ? currentAccent : 0) + index) % 4
          : (Number.isInteger(currentAccent) ? currentAccent : 0);
        relationshipAccentByRef[relationship.relationshipRef] = accent;
        const existing = nodeAccentByRef[relationship.toRef];
        if (existing === undefined) {
          nodeAccentByRef[relationship.toRef] = accent;
          seed(relationship.toRef, accent);
        } else if (existing !== accent) {
          nodeAccentByRef[relationship.toRef] = null;
        }
      });
    }
  }

  const starts = graph.nodes
    .filter((node) => (incoming.get(node.nodeRef)?.length ?? 0) === 0
      && (outgoing.get(node.nodeRef)?.length ?? 0) > 0)
    .sort((left, right) => compareText(left.nodeRef, right.nodeRef));
  starts.forEach((node, index) => seed(node.nodeRef, index % 4));
  drain();

  let componentIndex = starts.length;
  for (const node of [...graph.nodes].sort((left, right) => compareText(left.nodeRef, right.nodeRef))) {
    if (nodeAccentByRef[node.nodeRef] === undefined
      && ((incoming.get(node.nodeRef)?.length ?? 0) > 0 || (outgoing.get(node.nodeRef)?.length ?? 0) > 0)) {
      seed(node.nodeRef, componentIndex % 4);
      componentIndex += 1;
      drain();
    }
  }

  for (const node of graph.nodes) {
    if (nodeAccentByRef[node.nodeRef] === undefined) nodeAccentByRef[node.nodeRef] = null;
  }

  return Object.freeze({
    nodeAccentByRef: Object.freeze({ ...nodeAccentByRef }),
    relationshipAccentByRef: Object.freeze({ ...relationshipAccentByRef }),
    hasBranching: [...outgoing.values()].some((relationships) => relationships.length > 1),
  });
}

export function canvasExtent(items, {
  minimumWidth = 2100,
  minimumHeight = 1100,
  padding = 240,
} = {}) {
  if (!Array.isArray(items)) throw new TypeError('items must be an array');
  const right = items.length
    ? Math.max(...items.map((item) => Number(item?.bounds?.x ?? 0) + Number(item?.bounds?.width ?? 0)))
    : 0;
  const bottom = items.length
    ? Math.max(...items.map((item) => Number(item?.bounds?.y ?? 0) + Number(item?.bounds?.height ?? 0)))
    : 0;
  return Object.freeze({
    width: Math.max(minimumWidth, Math.ceil(right + padding)),
    height: Math.max(minimumHeight, Math.ceil(bottom + padding)),
  });
}

// [VXG RealForever][VEXWORK][VEXBOARD][PRESENTATION]
