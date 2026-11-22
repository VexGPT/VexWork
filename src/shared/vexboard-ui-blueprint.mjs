import {
  createStudioBlueprint,
  studioNodeFromOccurrence,
} from './vexboard-component-studio.mjs';

export const UI_BLUEPRINT_SCHEMA = 'vexboard.ui-blueprint/v1';
export const UI_LAYOUT_MODES = Object.freeze(['FLOW', 'CONSTRAINT']);
export const UI_FLOW_DIRECTIONS = Object.freeze(['VERTICAL', 'HORIZONTAL', 'OVERLAY']);
export const UI_DIMENSION_MODES = Object.freeze(['WRAP', 'FILL', 'FIXED']);
export const UI_CONSTRAINT_EDGES = Object.freeze([
  'START',
  'END',
  'TOP',
  'BOTTOM',
  'CENTER_X',
  'CENTER_Y',
]);
export const UI_PREVIEW_PROFILES = Object.freeze({
  MOBILE: Object.freeze({ label: 'Mobile', width: 390, height: 844 }),
  WINDOWS: Object.freeze({ label: 'Windows', width: 1280, height: 800 }),
  CONTAINER: Object.freeze({ label: 'Container', width: 960, height: 640 }),
});

function fail(message) {
  throw new TypeError('ui blueprint: ' + message);
}
function text(value, label) {
  if (typeof value !== 'string' || !value.trim()) fail(label + ' is required');
  return value.trim();
}
function optionalText(value, label) {
  if (value === undefined || value === null || value === '') return null;
  return text(value, label);
}
function finiteNumber(value, label) {
  if (typeof value !== 'number' || !Number.isFinite(value)) fail(label + ' must be finite');
  return value;
}
function unique(values) {
  return [...new Set(values)];
}
function freezeDeep(value) {
  if (Array.isArray(value)) value.forEach(freezeDeep);
  else if (value && typeof value === 'object') Object.values(value).forEach(freezeDeep);
  return Object.freeze(value);
}
function slug(value) {
  return String(value ?? 'event')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'event';
}
function normalizeDimension(input, label) {
  const value = input ?? {};
  const mode = String(value.mode ?? 'WRAP').toUpperCase();
  if (!UI_DIMENSION_MODES.includes(mode)) fail(label + '.mode is invalid');
  const fixed = value.valueOrNull === undefined || value.valueOrNull === null
    ? null
    : finiteNumber(value.valueOrNull, label + '.valueOrNull');
  if (mode === 'FIXED' && (fixed === null || fixed <= 0)) fail(label + ' FIXED requires a positive value');
  if (mode !== 'FIXED' && fixed !== null) fail(label + ' value is only valid for FIXED');
  return { mode, valueOrNull: fixed };
}
function normalizeConstraint(input, label) {
  const edge = text(input?.edge, label + '.edge').toUpperCase();
  if (!UI_CONSTRAINT_EDGES.includes(edge)) fail(label + '.edge is invalid');
  const targetNodeRefOrParent = text(input?.targetNodeRefOrParent ?? 'PARENT', label + '.targetNodeRefOrParent');
  const targetEdge = text(input?.targetEdge ?? edge, label + '.targetEdge').toUpperCase();
  if (!UI_CONSTRAINT_EDGES.includes(targetEdge)) fail(label + '.targetEdge is invalid');
  const offset = input?.offset === undefined ? 0 : finiteNumber(input.offset, label + '.offset');
  return { edge, targetNodeRefOrParent, targetEdge, offset };
}
function defaultFlowDirection(kind) {
  if (kind === 'ROW') return 'HORIZONTAL';
  if (kind === 'STACK') return 'OVERLAY';
  return 'VERTICAL';
}
function normalizeLayout(input, nodeRef, kind) {
  const value = input ?? {};
  const containerMode = String(value.containerMode ?? 'FLOW').toUpperCase();
  if (!UI_LAYOUT_MODES.includes(containerMode)) fail(nodeRef + ' authoring.layout.containerMode is invalid');
  const flowDirection = String(value.flowDirection ?? defaultFlowDirection(kind)).toUpperCase();
  if (!UI_FLOW_DIRECTIONS.includes(flowDirection)) fail(nodeRef + ' authoring.layout.flowDirection is invalid');
  const constraints = Array.isArray(value.constraints)
    ? value.constraints.map((row, index) => normalizeConstraint(row, nodeRef + ' constraint[' + index + ']'))
    : [];
  const edges = constraints.map((row) => row.edge);
  if (new Set(edges).size !== edges.length) fail(nodeRef + ' has duplicate constraint edges');
  return {
    containerMode,
    flowDirection,
    width: normalizeDimension(value.width, nodeRef + ' authoring.layout.width'),
    height: normalizeDimension(value.height, nodeRef + ' authoring.layout.height'),
    constraints,
  };
}
function normalizeCallbackPort(input, nodeRef, index) {
  const portRef = text(input?.portRef, nodeRef + ' callbackPorts[' + index + '].portRef');
  const eventRef = text(input?.eventRef, nodeRef + ' callbackPorts[' + index + '].eventRef');
  const sourceIntentOrNull = optionalText(input?.sourceIntentOrNull, nodeRef + ' callbackPorts[' + index + '].sourceIntentOrNull');
  const bindingState = String(input?.bindingState ?? 'OPEN').toUpperCase();
  if (bindingState !== 'OPEN') fail(nodeRef + ' callback ports must remain OPEN in A5');
  return { portRef, eventRef, sourceIntentOrNull, bindingState: 'OPEN' };
}
function defaultCallbackPorts(node) {
  return node.presentation.interactions.map((eventRef, index) => ({
    portRef: 'callback.' + node.nodeRef + '.' + slug(eventRef || ('event-' + index)),
    eventRef,
    sourceIntentOrNull: node.relationships.intentOrNull,
    bindingState: 'OPEN',
  }));
}
function normalizeAuthoring(raw, node) {
  const input = raw ?? {};
  const callbacks = Array.isArray(input.callbackPorts)
    ? input.callbackPorts.map((row, index) => normalizeCallbackPort(row, node.nodeRef, index))
    : defaultCallbackPorts(node);
  const refs = callbacks.map((row) => row.portRef);
  if (new Set(refs).size !== refs.length) fail(node.nodeRef + ' has duplicate callback port refs');
  return {
    layout: normalizeLayout(input.layout, node.nodeRef, node.source.kind),
    callbackPorts: callbacks,
  };
}
function normalizePreview(input) {
  const profile = String(input?.profile ?? 'MOBILE').toUpperCase();
  const preset = UI_PREVIEW_PROFILES[profile];
  if (!preset) fail('preview.profile is invalid');
  return {
    profile,
    label: preset.label,
    width: preset.width,
    height: preset.height,
    previewOnly: true,
  };
}

export function uiNodeFromOccurrence({
  nodeRef,
  inventory,
  occurrenceRef,
  architectureCatalog,
  parentNodeRefOrNull = null,
  siblingOrder = 0,
  layout = null,
  callbackPorts = null,
}) {
  const node = studioNodeFromOccurrence({
    nodeRef,
    inventory,
    occurrenceRef,
    architectureCatalog,
    parentNodeRefOrNull,
    siblingOrder,
  });
  return freezeDeep({
    ...node,
    authoring: normalizeAuthoring({
      layout,
      callbackPorts: callbackPorts ?? undefined,
    }, node),
  });
}

export function createUiBlueprint({
  blueprintRef,
  label,
  preview = { profile: 'MOBILE' },
  nodes,
}) {
  blueprintRef = text(blueprintRef, 'blueprintRef');
  label = text(label, 'label');
  if (!Array.isArray(nodes)) fail('nodes must be an array');

  const componentBlueprint = createStudioBlueprint({
    blueprintRef: 'component-composition.' + blueprintRef,
    label,
    nodes,
  });
  const rawByRef = new Map(nodes.map((row) => [row.nodeRef, row]));
  const normalized = componentBlueprint.nodes.map((node) => ({
    ...node,
    authoring: normalizeAuthoring(rawByRef.get(node.nodeRef)?.authoring, node),
  }));
  const byRef = new Map(normalized.map((node) => [node.nodeRef, node]));

  for (const node of normalized) {
    for (const constraint of node.authoring.layout.constraints) {
      if (constraint.targetNodeRefOrParent === 'PARENT') continue;
      if (constraint.targetNodeRefOrParent === node.nodeRef) fail(node.nodeRef + ' cannot constrain to itself');
      const target = byRef.get(constraint.targetNodeRefOrParent);
      if (!target) fail(node.nodeRef + ' constraint references missing node ' + constraint.targetNodeRefOrParent);
      if (target.parentNodeRefOrNull !== node.parentNodeRefOrNull) {
        fail(node.nodeRef + ' constraints may target only PARENT or a sibling in v1');
      }
    }
  }

  const openCallbackPorts = normalized
    .flatMap((node) => node.authoring.callbackPorts.map((port) => ({
      nodeRef: node.nodeRef,
      ...port,
    })))
    .sort((a, b) => a.portRef.localeCompare(b.portRef));

  const sourceSnapshots = componentBlueprint.sourceSnapshots;
  const previewValue = normalizePreview(preview);
  const summary = {
    nodeCount: normalized.length,
    openCallbackPortCount: openCallbackPorts.length,
    constrainedNodeCount: normalized.filter((node) => node.authoring.layout.constraints.length > 0).length,
    constraintContainerCount: normalized.filter((node) => node.authoring.layout.containerMode === 'CONSTRAINT').length,
  };

  return freezeDeep({
    schemaVersion: UI_BLUEPRINT_SCHEMA,
    blueprintRef,
    label,
    aiRequired: false,
    effects: false,
    executionAuthority: 'NONE',
    preview: previewValue,
    rootNodeRefs: componentBlueprint.rootNodeRefs,
    sourceSnapshots,
    nodes: normalized,
    integration: {
      bindingMode: 'OPEN_PORTS',
      openCallbackPorts,
    },
    summary,
  });
}

export function normalizeUiBlueprint(input) {
  if (!input || input.schemaVersion !== UI_BLUEPRINT_SCHEMA) {
    fail('schemaVersion must be ' + UI_BLUEPRINT_SCHEMA);
  }
  if (input.aiRequired !== false) fail('aiRequired must be false');
  if (input.effects !== false || input.executionAuthority !== 'NONE') {
    fail('UI Blueprint is non-executing');
  }
  const canonical = createUiBlueprint({
    blueprintRef: input.blueprintRef,
    label: input.label,
    preview: input.preview,
    nodes: input.nodes,
  });
  for (const key of ['rootNodeRefs', 'sourceSnapshots', 'integration', 'summary']) {
    if (JSON.stringify(canonical[key]) !== JSON.stringify(input[key])) {
      fail(key + ' disagrees with nodes');
    }
  }
  return canonical;
}

export function uiBlueprintBytes(input) {
  return JSON.stringify(normalizeUiBlueprint(input), null, 2) + '\n';
}

// [VXG RealForever][VEXWORK][COMPONENT-LIBRARY][A5-UI-BLUEPRINT]
