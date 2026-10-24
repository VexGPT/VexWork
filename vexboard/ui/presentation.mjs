export const PALETTE_MODES = Object.freeze(['STANDARD', 'COLOR_SAFE', 'HIGH_CONTRAST']);
export const VEXBOARD_PALETTE_STORAGE_KEY = 'vexboard.palette-mode/v1';
export const DEFAULT_CANVAS_EXTENT = Object.freeze({
  minimumWidth: 720,
  minimumHeight: 480,
  padding: 96,
});

export const PALETTE_PRESENTATION_CSS = `
.viewport .palette-fab {
  width: auto;
  min-width: 42px;
  padding: 0 10px;
  gap: 7px;
  white-space: nowrap;
}
.viewport .palette-fab::after {
  font: 700 8px ui-monospace, monospace;
  letter-spacing: .04em;
  text-transform: uppercase;
}
.viewport.palette-standard .palette-fab::after { content: "Standard"; }
.viewport.palette-color-safe .palette-fab::after { content: "Color safe"; }
.viewport.palette-high-contrast .palette-fab::after { content: "High contrast"; }

.viewport.palette-color-safe {
  background-color: #f8fafc;
  background-image:
    linear-gradient(to right, rgb(3 105 161 / 8%) 1px, transparent 1px),
    linear-gradient(to bottom, rgb(3 105 161 / 8%) 1px, transparent 1px);
  background-position: 0 0;
  background-size: 20px 20px;
}
.viewport.palette-color-safe .shape.role-BEGIN {
  background-image: repeating-linear-gradient(135deg, transparent 0 8px, rgb(3 105 161 / 12%) 8px 12px);
}
.viewport.palette-color-safe .shape.role-DECISION {
  background-image: repeating-linear-gradient(45deg, transparent 0 8px, rgb(194 65 12 / 12%) 8px 12px);
}
.viewport.palette-color-safe .shape.role-END {
  background-image: repeating-linear-gradient(0deg, transparent 0 8px, rgb(4 120 87 / 12%) 8px 12px);
}
.viewport.palette-color-safe .role-marker,
.viewport.palette-color-safe .branch-marker {
  border-width: 2px;
}

.viewport.palette-high-contrast {
  background-color: #fff;
  background-image: radial-gradient(#000 1px, transparent 1px);
}
.viewport.palette-high-contrast .canvas {
  border-color: #000;
}
.viewport.palette-high-contrast .canvas-boundary-label,
.viewport.palette-high-contrast .role-marker,
.viewport.palette-high-contrast .kind-marker,
.viewport.palette-high-contrast .branch-marker,
.viewport.palette-high-contrast .contained-marker,
.viewport.palette-high-contrast .shape.FRAME .shape-label {
  border-color: #000;
  background: #fff;
  color: #000;
}
.viewport.palette-high-contrast .minimap {
  border: 2px solid #000;
  box-shadow: none;
}
.viewport.palette-high-contrast .minimap-item {
  background: #fff;
  border-color: #000;
}
.viewport.palette-high-contrast .minimap-view {
  border-color: #000;
  background: transparent;
}

@media (max-width: 640px) {
  .viewport .palette-fab {
    width: 42px;
    padding: 0;
  }
  .viewport .palette-fab::after { display: none; }
}
`;

const FLOW_KINDS = new Set(['FLOW', 'TRANSITION']);
const PALETTE_STYLE_ID = 'vexboard-palette-presentation-v2';
const PALETTE_LABELS = Object.freeze({
  STANDARD: 'Standard',
  COLOR_SAFE: 'Color safe',
  HIGH_CONTRAST: 'High contrast',
});

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

export function paletteModeLabel(value) {
  return PALETTE_LABELS[normalizePaletteMode(value)];
}

export function installPalettePresentation(documentRef = globalThis.document) {
  if (!documentRef?.documentElement || typeof documentRef.createElement !== 'function') return false;
  if (documentRef.getElementById?.(PALETTE_STYLE_ID)) return false;
  const style = documentRef.createElement('style');
  style.id = PALETTE_STYLE_ID;
  style.textContent = PALETTE_PRESENTATION_CSS;
  (documentRef.head ?? documentRef.documentElement).append(style);
  return true;
}

installPalettePresentation();

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
  minimumWidth = DEFAULT_CANVAS_EXTENT.minimumWidth,
  minimumHeight = DEFAULT_CANVAS_EXTENT.minimumHeight,
  padding = DEFAULT_CANVAS_EXTENT.padding,
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
