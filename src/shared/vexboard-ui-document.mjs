// VexBoard UI Builder editing commands + history.
//
// Every edit is a named command applied to an authored draft. The result is re-validated by
// the canonical UI Blueprint normalizer before it is admitted, so the editor cannot produce a
// blueprint that import would reject (invalid nesting, orphaned seams, drifted instances...).
// A rejected command leaves the state unchanged and reports why in ordinary language.
//
// EDITOR COMMAND != PRODUCT EFFECT
// HISTORY = authored-design chronology only; preview state (open overlays, RTL, stress text)
// is deliberately outside history and outside the saved meaning.

import {
  createUiBlueprint,
  defaultSeams,
  effectiveKind,
  UI_FRACTION_DENOMINATOR,
} from './vexboard-ui-blueprint.mjs';
import { kindSpec, normalizeSeamKey } from './vexboard-ui-kinds.mjs';

export const UI_HISTORY_LIMIT = 200;
const D = UI_FRACTION_DENOMINATOR;

function fail(message) {
  throw new TypeError(message);
}
function clone(value) {
  return structuredClone(value);
}
function slug(value) {
  return String(value ?? 'component').toLowerCase().replace(/[^a-z0-9]+/gu, '-').replace(/^-|-$/gu, '') || 'component';
}

// ---------------------------------------------------------------------------------------
// draft <-> blueprint
// ---------------------------------------------------------------------------------------

function authoredNode(node) {
  const out = {
    nodeRef: node.nodeRef,
    parentRef: node.parentRef ?? null,
    slotRef: node.slotRef ?? null,
    order: node.order ?? 0,
    kind: node.kind,
    source: node.source ?? null,
    instance: node.instance ?? null,
    layout: clone(node.layout ?? {}),
    behavior: { seams: clone(node.behavior?.seams ?? []) },
    visibility: node.visibility ? clone(node.visibility) : undefined,
    accessibility: node.accessibility ? clone(node.accessibility) : undefined,
  };
  if (node.content?.text) out.content = { text: { origin: node.content.text.origin, value: node.content.text.value } };
  if (out.instance) out.behavior = { seams: [] };
  return out;
}

export function draftFromBlueprint(blueprint) {
  return {
    blueprintRef: blueprint.blueprintRef,
    label: blueprint.label,
    surface: clone(blueprint.surface),
    preview: { profile: blueprint.preview.profile, direction: blueprint.preview.direction },
    nodes: blueprint.nodes.map(authoredNode),
    definitions: blueprint.definitions.map((definition) => ({
      definitionRef: definition.definitionRef,
      label: definition.label,
      version: definition.version,
      rootNodeRef: definition.rootNodeRef,
      nodes: definition.nodes.map(authoredNode),
      slots: clone(definition.slots),
    })),
  };
}

export function blueprintFromDraft(draft) {
  return createUiBlueprint(clone(draft));
}

export function emptyDraft({ blueprintRef = 'ui.blueprint.untitled', label = 'Untitled design' } = {}) {
  return {
    blueprintRef,
    label,
    surface: { container: { mode: 'STACK', axis: 'VERTICAL', gap: 'M', padding: 'L' } },
    preview: { profile: 'COMPACT', direction: 'LTR' },
    nodes: [],
    definitions: [],
  };
}

// ---------------------------------------------------------------------------------------
// editor state
// ---------------------------------------------------------------------------------------

export function createEditorState(blueprint = null) {
  const draft = blueprint ? draftFromBlueprint(blueprint) : emptyDraft();
  const canonical = blueprintFromDraft(draft);
  return Object.freeze({
    draft: draftFromBlueprint(canonical),
    blueprint: canonical,
    scope: null, // null = the design surface; otherwise a definitionRef being edited
    scopeDirty: false,
    selection: null,
    past: [],
    future: [],
  });
}

export function scopeNodes(draft, scope) {
  if (!scope) return draft.nodes;
  const definition = draft.definitions.find((row) => row.definitionRef === scope);
  if (!definition) fail('Component ' + scope + ' no longer exists.');
  return definition.nodes;
}

function definitionMap(draft) {
  return new Map(draft.definitions.map((row) => [row.definitionRef, row]));
}

export function nodeKind(draft, node) {
  return effectiveKind(node, definitionMap(draft));
}

export function containerModeOf(draft, scope, parentRef, slotRef = null) {
  const nodes = scopeNodes(draft, scope);
  if (!parentRef) return scope ? null : draft.surface.container.mode;
  const parent = nodes.find((row) => row.nodeRef === parentRef);
  if (!parent) return null;
  if (parent.kind === 'INSTANCE') {
    const definition = draft.definitions.find((row) => row.definitionRef === parent.instance.definitionRef);
    const slot = definition?.slots.find((row) => row.slotRef === slotRef);
    const host = slot ? definition.nodes.find((row) => row.nodeRef === slot.templateNodeRef) : null;
    return host?.layout?.container?.mode ?? kindSpec(host?.kind).defaultContainer?.mode ?? 'STACK';
  }
  return parent.layout?.container?.mode ?? kindSpec(parent.kind).defaultContainer?.mode ?? null;
}

export function siblingsOf(draft, scope, parentRef, slotRef = null, { overlays = null } = {}) {
  return scopeNodes(draft, scope)
    .filter((row) => (row.parentRef ?? null) === (parentRef ?? null) && (row.slotRef ?? null) === (slotRef ?? null))
    .filter((row) => {
      if (parentRef || overlays === null) return true;
      const overlay = Boolean(kindSpec(nodeKind(draft, row)).overlay);
      return overlays ? overlay : !overlay;
    })
    .sort((a, b) => a.order - b.order);
}

function nextNodeRef(draft) {
  let max = 0;
  const visit = (nodes) => {
    for (const node of nodes) {
      const match = /^n(\d+)$/u.exec(node.nodeRef);
      if (match) max = Math.max(max, Number(match[1]));
    }
  };
  visit(draft.nodes);
  draft.definitions.forEach((row) => visit(row.nodes));
  return () => 'n' + ++max;
}

function descendants(nodes, nodeRef) {
  const refs = new Set([nodeRef]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const node of nodes) {
      if (node.parentRef && refs.has(node.parentRef) && !refs.has(node.nodeRef)) {
        refs.add(node.nodeRef);
        changed = true;
      }
    }
  }
  return refs;
}

function isLayered(mode) {
  return mode === 'OVERLAY' || mode === 'FREEFORM';
}

function defaultFreeformPlacement(draft, scope, parentRef, slotRef, node) {
  const siblings = siblingsOf(draft, scope, parentRef, slotRef, { overlays: false }).filter((row) => row.nodeRef !== node.nodeRef);
  let row = 1;
  for (const sibling of siblings) {
    const y = sibling.layout?.placement?.y;
    if (y) row = Math.max(row, (y.end ?? y.start + 2) + 1);
  }
  row = Math.min(row, D - 2);
  const fill = kindSpec(nodeKind(draft, node)).defaultWidth === 'FILL' || kindSpec(nodeKind(draft, node)).container;
  return { type: 'FRACTION', x: { start: 1, end: fill ? D - 1 : null }, y: { start: row, end: null } };
}

function adaptToParent(draft, scope, node, parentRef, slotRef, placement = null) {
  const overlay = !parentRef && Boolean(kindSpec(nodeKind(draft, node)).overlay);
  const mode = overlay ? null : containerModeOf(draft, scope, parentRef, slotRef);
  node.layout = node.layout ?? {};
  if (mode === 'FREEFORM') node.layout.placement = placement?.type === 'FRACTION' ? placement : defaultFreeformPlacement(draft, scope, parentRef, slotRef, node);
  else if (mode === 'OVERLAY') node.layout.placement = placement?.type === 'ANCHOR' ? placement : { type: 'ANCHOR', anchor: 'TOP_START', inset: 'NONE' };
  else node.layout.placement = null;
  if (overlay || isLayered(mode)) {
    const siblings = siblingsOf(draft, scope, parentRef, slotRef, { overlays: overlay }).filter((row) => row.nodeRef !== node.nodeRef);
    node.layout.depth = siblings.length ? Math.max(...siblings.map((row) => row.layout?.depth ?? 0)) + 1 : 0;
  } else {
    node.layout.depth = 0;
  }
}

function resequence(draft, scope, parentRef, slotRef, overlays = null) {
  siblingsOf(draft, scope, parentRef, slotRef, { overlays }).forEach((row, index) => { row.order = index; });
}

function resequenceDepth(draft, scope, parentRef, slotRef, overlays = null) {
  const siblings = siblingsOf(draft, scope, parentRef, slotRef, { overlays });
  const mode = parentRef ? containerModeOf(draft, scope, parentRef, slotRef) : overlays ? 'OVERLAY' : (scope ? null : draft.surface.container.mode);
  if (!isLayered(mode)) {
    siblings.forEach((row) => { row.layout.depth = 0; });
    return;
  }
  [...siblings].sort((a, b) => (a.layout.depth ?? 0) - (b.layout.depth ?? 0) || a.order - b.order).forEach((row, index) => { row.layout.depth = index; });
}

function insertAt(draft, scope, node, parentRef, slotRef, index) {
  const nodes = scopeNodes(draft, scope);
  const overlay = !parentRef && Boolean(kindSpec(nodeKind(draft, node)).overlay);
  const siblings = siblingsOf(draft, scope, parentRef, slotRef, { overlays: parentRef ? null : overlay }).filter((row) => row.nodeRef !== node.nodeRef);
  const at = index === null || index === undefined ? siblings.length : Math.max(0, Math.min(index, siblings.length));
  siblings.splice(at, 0, node);
  node.parentRef = parentRef ?? null;
  node.slotRef = slotRef ?? null;
  if (!nodes.includes(node)) nodes.push(node);
  siblings.forEach((row, position) => { row.order = position; });
}

function convertChildrenForMode(draft, scope, parentRef, slotRef, mode) {
  const children = siblingsOf(draft, scope, parentRef, slotRef, { overlays: parentRef ? null : false });
  children.forEach((child) => { child.layout.placement = null; });
  children.forEach((child, index) => {
    if (mode === 'FREEFORM') child.layout.placement = defaultFreeformPlacement(draft, scope, parentRef, slotRef, child);
    else if (mode === 'OVERLAY') child.layout.placement = { type: 'ANCHOR', anchor: 'TOP_START', inset: 'NONE' };
    child.layout.depth = isLayered(mode) ? index : 0;
  });
}

// ---------------------------------------------------------------------------------------
// commands
// ---------------------------------------------------------------------------------------

function findNode(draft, scope, nodeRef) {
  const node = scopeNodes(draft, scope).find((row) => row.nodeRef === nodeRef);
  if (!node) fail('That element is no longer in the design.');
  return node;
}

function makeNode(draft, spec, newRef) {
  if (spec.instance) {
    const definition = draft.definitions.find((row) => row.definitionRef === spec.instance.definitionRef);
    if (!definition) fail('Component ' + spec.instance.definitionRef + ' is not in this design.');
    return {
      nodeRef: newRef(), kind: 'INSTANCE', source: null,
      instance: { definitionRef: definition.definitionRef, definitionVersion: definition.version, textOverrides: [], portBindings: [] },
      layout: { width: { mode: 'FILL' }, height: { mode: 'HUG' } }, behavior: { seams: [] },
    };
  }
  if (spec.group) {
    const container = clone(spec.group.container);
    const height = container.mode === 'FREEFORM' ? { mode: 'FIXED', valueOrNull: 320 } : { mode: 'HUG' };
    return { nodeRef: newRef(), kind: 'GROUP', source: null, instance: null, layout: { container, width: { mode: 'FILL' }, height }, behavior: { seams: [] } };
  }
  if (!spec.source) fail('Nothing to place.');
  const nodeRef = newRef();
  const kindValue = spec.source.kind;
  return {
    nodeRef, kind: kindValue, source: spec.source, instance: null,
    layout: {},
    behavior: { seams: defaultSeams(nodeRef, kindValue, spec.source) },
  };
}

const COMMANDS = {
  // Insert one element, or a source subtree (`items[0]` root, others name `parentIndex`).
  INSERT(draft, scope, { items, parentRef = null, slotRef = null, index = null, placement = null }) {
    if (!Array.isArray(items) || !items.length) fail('Nothing to place.');
    const newRef = nextNodeRef(draft);
    const created = [];
    items.forEach((item, position) => {
      const node = makeNode(draft, item, newRef);
      if (position === 0) {
        const kindValue = nodeKind(draft, node);
        let targetParent = parentRef;
        if (kindSpec(kindValue).overlay) targetParent = null; // overlays always attach to the surface
        if (scope && !targetParent && !kindSpec(kindValue).overlay) {
          const definition = draft.definitions.find((row) => row.definitionRef === scope);
          targetParent = definition.rootNodeRef;
        }
        insertAt(draft, scope, node, targetParent, targetParent ? slotRef : null, targetParent === parentRef ? index : null);
        adaptToParent(draft, scope, node, targetParent, targetParent ? slotRef : null, placement);
      } else {
        const parent = created[item.parentIndex ?? 0];
        insertAt(draft, scope, node, parent.nodeRef, null, null);
        adaptToParent(draft, scope, node, parent.nodeRef, null, null);
      }
      created.push(node);
    });
    return created[0].nodeRef;
  },

  MOVE(draft, scope, { nodeRef, parentRef = null, slotRef = null, index = null, placement = null }) {
    const node = findNode(draft, scope, nodeRef);
    if (parentRef && descendants(scopeNodes(draft, scope), nodeRef).has(parentRef)) fail('An element cannot be moved inside itself.');
    const overlay = Boolean(kindSpec(nodeKind(draft, node)).overlay);
    if (overlay) parentRef = null;
    if (scope && !parentRef && !overlay) fail('A component keeps exactly one root element.');
    const from = { parentRef: node.parentRef ?? null, slotRef: node.slotRef ?? null };
    const sameParent = from.parentRef === (parentRef ?? null) && from.slotRef === (slotRef ?? null);
    insertAt(draft, scope, node, parentRef, slotRef, index);
    if (!sameParent || placement) adaptToParent(draft, scope, node, parentRef, slotRef, placement);
    if (!sameParent) {
      resequence(draft, scope, from.parentRef, from.slotRef, from.parentRef ? null : overlay);
      resequenceDepth(draft, scope, from.parentRef, from.slotRef, from.parentRef ? null : overlay);
    }
    return nodeRef;
  },

  PLACE(draft, scope, { nodeRef, placement }) {
    const node = findNode(draft, scope, nodeRef);
    node.layout.placement = clone(placement);
    return nodeRef;
  },

  UPDATE_LAYOUT(draft, scope, { nodeRef, patch }) {
    const node = findNode(draft, scope, nodeRef);
    if (patch.container) {
      const before = node.layout.container?.mode ?? kindSpec(node.kind).defaultContainer?.mode;
      node.layout.container = { ...(node.layout.container ?? kindSpec(node.kind).defaultContainer ?? {}), ...patch.container };
      if (node.layout.container.mode !== 'STACK') {
        delete node.layout.container.axis;
        delete node.layout.container.align;
        delete node.layout.container.justify;
      }
      if (node.layout.container.mode === 'FREEFORM' && node.layout.height?.mode !== 'FIXED') {
        node.layout.height = { mode: 'FIXED', valueOrNull: 320 };
      }
      if (before !== node.layout.container.mode) {
        convertChildrenForMode(draft, scope, nodeRef, null, node.layout.container.mode);
      }
    }
    for (const axis of ['width', 'height']) {
      if (patch[axis]) node.layout[axis] = patch[axis].mode === 'FIXED' ? { mode: 'FIXED', valueOrNull: patch[axis].valueOrNull } : { mode: patch[axis].mode };
    }
    return nodeRef;
  },

  SET_SURFACE(draft, scope, { container }) {
    if (scope) fail('Finish editing the component before changing the design surface.');
    const before = draft.surface.container.mode;
    draft.surface.container = { ...draft.surface.container, ...container };
    if (draft.surface.container.mode !== 'STACK') {
      delete draft.surface.container.axis;
      delete draft.surface.container.align;
      delete draft.surface.container.justify;
    }
    if (before !== draft.surface.container.mode) convertChildrenForMode(draft, null, null, null, draft.surface.container.mode);
    return null;
  },

  SET_TEXT(draft, scope, { nodeRef, value }) {
    const node = findNode(draft, scope, nodeRef);
    if (!kindSpec(node.kind).text || node.kind === 'INSTANCE') fail('This element has no text of its own.');
    const trimmed = typeof value === 'string' ? value.trim() : '';
    if (!trimmed || (node.source && trimmed === node.source.label)) {
      if (!node.source) fail('Layout groups have no text.');
      node.content = { text: { origin: 'SOURCE', value: node.source.label } };
    } else {
      node.content = { text: { origin: 'AUTHORED', value: trimmed } };
    }
    return nodeRef;
  },

  ADD_SEAM(draft, scope, { nodeRef, seam }) {
    const node = findNode(draft, scope, nodeRef);
    if (node.kind === 'INSTANCE') fail('Instances expose their component ports; edit bindings instead.');
    const used = new Set(node.behavior.seams.map((row) => row.seamRef));
    let index = node.behavior.seams.length + 1;
    while (used.has('a' + index)) index += 1;
    const key = normalizeSeamKey(seam.key);
    if (!key) fail('Use a short lowercase name like profile.save for the action.');
    node.behavior.seams.push({ trigger: kindSpec(node.kind).triggers[0] ?? 'ACTIVATE', ...clone(seam), key, seamRef: 'a' + index, origin: 'AUTHORED', source: null });
    return nodeRef;
  },

  SET_SEAM(draft, scope, { nodeRef, seamRef, patch }) {
    const node = findNode(draft, scope, nodeRef);
    const seam = node.behavior.seams.find((row) => row.seamRef === seamRef);
    if (!seam) fail('That behavior seam no longer exists.');
    if (patch.key !== undefined) {
      const key = normalizeSeamKey(patch.key);
      if (!key) fail('Use a short lowercase name like profile.save.');
      seam.key = key;
    }
    if (patch.targetNodeRefOrNull !== undefined) seam.targetNodeRefOrNull = patch.targetNodeRefOrNull;
    if (patch.verbOrNull !== undefined) seam.verbOrNull = patch.verbOrNull;
    if (patch.destinationOrNull !== undefined) seam.destinationOrNull = patch.destinationOrNull || null;
    if (patch.trigger !== undefined) seam.trigger = patch.trigger;
    delete seam.binding;
    return nodeRef;
  },

  REMOVE_SEAM(draft, scope, { nodeRef, seamRef }) {
    const node = findNode(draft, scope, nodeRef);
    node.behavior.seams = node.behavior.seams.filter((row) => row.seamRef !== seamRef);
    return nodeRef;
  },

  SET_VISIBILITY(draft, scope, { nodeRef, presence, conditionKeyOrNull = null }) {
    const node = findNode(draft, scope, nodeRef);
    node.visibility = { presence, conditionKeyOrNull: presence === 'CONDITIONAL' ? normalizeSeamKey(conditionKeyOrNull) : null };
    return nodeRef;
  },

  SET_ACCESSIBILITY(draft, scope, { nodeRef, patch }) {
    const node = findNode(draft, scope, nodeRef);
    node.accessibility = { labelOrNull: null, decorative: false, ...(node.accessibility ?? {}), ...patch };
    if (typeof node.accessibility.labelOrNull === 'string' && !node.accessibility.labelOrNull.trim()) node.accessibility.labelOrNull = null;
    return nodeRef;
  },

  DEPTH(draft, scope, { nodeRef, action }) {
    const node = findNode(draft, scope, nodeRef);
    const overlay = !node.parentRef && Boolean(kindSpec(nodeKind(draft, node)).overlay);
    const siblings = siblingsOf(draft, scope, node.parentRef ?? null, node.slotRef ?? null, { overlays: node.parentRef ? null : overlay })
      .sort((a, b) => (a.layout.depth ?? 0) - (b.layout.depth ?? 0) || a.order - b.order);
    const index = siblings.indexOf(node);
    const target = { BACK: 0, BACKWARD: Math.max(0, index - 1), FORWARD: Math.min(siblings.length - 1, index + 1), FRONT: siblings.length - 1 }[action];
    if (target === undefined) fail('Unknown depth action.');
    siblings.splice(index, 1);
    siblings.splice(target, 0, node);
    siblings.forEach((row, depth) => { row.layout.depth = depth; });
    return nodeRef;
  },

  DELETE(draft, scope, { nodeRef }) {
    const nodes = scopeNodes(draft, scope);
    const node = findNode(draft, scope, nodeRef);
    if (scope && !node.parentRef) {
      const definition = draft.definitions.find((row) => row.definitionRef === scope);
      if (definition.rootNodeRef === nodeRef) fail('A component needs its root element. Delete the component from the library instead.');
    }
    const removed = descendants(nodes, nodeRef);
    const overlay = !node.parentRef && Boolean(kindSpec(nodeKind(draft, node)).overlay);
    const keep = nodes.filter((row) => !removed.has(row.nodeRef));
    nodes.length = 0;
    nodes.push(...keep);
    // presentation seams that targeted removed overlays become OPEN again rather than dangling
    for (const row of nodes) {
      for (const seam of row.behavior?.seams ?? []) {
        if (seam.targetNodeRefOrNull && removed.has(seam.targetNodeRefOrNull)) {
          seam.targetNodeRefOrNull = null;
          delete seam.binding;
        }
      }
    }
    if (scope) {
      const definition = draft.definitions.find((row) => row.definitionRef === scope);
      definition.slots = definition.slots.filter((row) => !removed.has(row.templateNodeRef));
    }
    resequence(draft, scope, node.parentRef ?? null, node.slotRef ?? null, node.parentRef ? null : overlay);
    resequenceDepth(draft, scope, node.parentRef ?? null, node.slotRef ?? null, node.parentRef ? null : overlay);
    return node.parentRef ?? null;
  },

  DUPLICATE(draft, scope, { nodeRef }) {
    const nodes = scopeNodes(draft, scope);
    const node = findNode(draft, scope, nodeRef);
    if (scope && !node.parentRef) fail('Duplicate the component instance on the design instead.');
    const refs = descendants(nodes, nodeRef);
    const newRef = nextNodeRef(draft);
    const mapping = new Map([...refs].map((ref) => [ref, newRef()]));
    const copies = nodes.filter((row) => refs.has(row.nodeRef)).map((row) => {
      const copy = clone(row);
      copy.nodeRef = mapping.get(row.nodeRef);
      if (row.nodeRef !== nodeRef) copy.parentRef = mapping.get(row.parentRef);
      for (const seam of copy.behavior?.seams ?? []) {
        if (seam.targetNodeRefOrNull && mapping.has(seam.targetNodeRefOrNull)) seam.targetNodeRefOrNull = mapping.get(seam.targetNodeRefOrNull);
      }
      return copy;
    });
    const root = copies.find((row) => row.nodeRef === mapping.get(nodeRef));
    nodes.push(...copies.filter((row) => row !== root));
    insertAt(draft, scope, root, node.parentRef ?? null, node.slotRef ?? null, node.order + 1);
    adaptToParent(draft, scope, root, node.parentRef ?? null, node.slotRef ?? null, null);
    if (root.layout.placement?.type === 'FRACTION' && node.layout.placement?.type === 'FRACTION') {
      const shift = (axis) => {
        const span = axis.end === null ? 0 : axis.end - axis.start;
        const start = Math.min(axis.start + 1, D - Math.max(1, span));
        return { start, end: axis.end === null ? null : start + span };
      };
      root.layout.placement = { type: 'FRACTION', x: shift(node.layout.placement.x), y: shift(node.layout.placement.y) };
    }
    return root.nodeRef;
  },

  // Turn a subtree into a reusable component definition and replace it with an instance.
  CREATE_DEFINITION(draft, scope, { nodeRef, label }) {
    const nodes = scopeNodes(draft, scope);
    const node = findNode(draft, scope, nodeRef);
    const refs = descendants(nodes, nodeRef);
    for (const row of nodes) {
      for (const seam of row.behavior?.seams ?? []) {
        const inside = refs.has(row.nodeRef);
        const targetInside = seam.targetNodeRefOrNull ? refs.has(seam.targetNodeRefOrNull) : inside;
        if (inside !== targetInside) fail('This selection opens an overlay outside it (or is opened from outside). Include the overlay or clear that link first.');
      }
    }
    const name = String(label ?? '').trim() || 'Component';
    let definitionRef = 'component.' + slug(name);
    let suffix = 2;
    while (draft.definitions.some((row) => row.definitionRef === definitionRef)) definitionRef = 'component.' + slug(name) + '-' + suffix++;
    const template = nodes.filter((row) => refs.has(row.nodeRef)).map((row) => clone(row));
    const root = template.find((row) => row.nodeRef === nodeRef);
    const placement = root.layout.placement;
    const depth = root.layout.depth;
    root.parentRef = null;
    root.slotRef = null;
    root.order = 0;
    root.layout.placement = null;
    root.layout.depth = 0;
    root.visibility = undefined;
    draft.definitions.push({ definitionRef, label: name, version: 1, rootNodeRef: nodeRef, nodes: template, slots: [] });
    const keep = nodes.filter((row) => !refs.has(row.nodeRef));
    nodes.length = 0;
    nodes.push(...keep);
    const instance = {
      nodeRef: nextNodeRef(draft)(),
      parentRef: node.parentRef ?? null,
      slotRef: node.slotRef ?? null,
      order: node.order,
      kind: 'INSTANCE',
      source: null,
      instance: { definitionRef, definitionVersion: 1, textOverrides: [], portBindings: [] },
      layout: { width: clone(node.layout.width ?? { mode: 'FILL' }), height: clone(node.layout.height ?? { mode: 'HUG' }), placement, depth },
      behavior: { seams: [] },
      visibility: kindSpec(nodeKind(draft, node)).overlay ? { presence: 'WHEN_OPEN' } : undefined,
    };
    nodes.push(instance);
    return instance.nodeRef;
  },

  // Replace an instance with an editable copy of its template (nested instances stay instances).
  DETACH(draft, scope, { nodeRef }) {
    const nodes = scopeNodes(draft, scope);
    const node = findNode(draft, scope, nodeRef);
    if (node.kind !== 'INSTANCE') fail('Only component instances can be detached.');
    const definition = draft.definitions.find((row) => row.definitionRef === node.instance.definitionRef);
    const newRef = nextNodeRef(draft);
    const mapping = new Map(definition.nodes.map((row) => [row.nodeRef, newRef()]));
    const copies = definition.nodes.map((row) => {
      const copy = clone(row);
      copy.nodeRef = mapping.get(row.nodeRef);
      copy.parentRef = row.parentRef ? mapping.get(row.parentRef) : null;
      for (const seam of copy.behavior?.seams ?? []) {
        if (seam.targetNodeRefOrNull) seam.targetNodeRefOrNull = mapping.get(seam.targetNodeRefOrNull);
        const binding = node.instance.portBindings.find((item) => item.portRef === row.nodeRef + '/' + seam.seamRef);
        if (binding) seam.key = binding.key;
        delete seam.binding;
      }
      const override = node.instance.textOverrides.find((item) => item.templatePath === row.nodeRef);
      if (override) copy.content = { text: { origin: 'AUTHORED', value: override.value } };
      if (copy.kind === 'INSTANCE') {
        // carry overrides addressed through this nested instance down one level
        const prefix = row.nodeRef + '/';
        for (const item of node.instance.textOverrides.filter((entry) => entry.templatePath.startsWith(prefix))) {
          const templatePath = item.templatePath.slice(prefix.length);
          copy.instance.textOverrides = [...copy.instance.textOverrides.filter((entry) => entry.templatePath !== templatePath), { templatePath, value: item.value }];
        }
        for (const item of node.instance.portBindings.filter((entry) => entry.portRef.startsWith(prefix))) {
          const portRef = item.portRef.slice(prefix.length);
          copy.instance.portBindings = [...copy.instance.portBindings.filter((entry) => entry.portRef !== portRef), { portRef, key: item.key }];
        }
      }
      return copy;
    });
    const root = copies.find((row) => row.nodeRef === mapping.get(definition.rootNodeRef));
    root.parentRef = node.parentRef ?? null;
    root.slotRef = node.slotRef ?? null;
    root.order = node.order;
    root.layout.placement = node.layout.placement ?? null;
    root.layout.depth = node.layout.depth ?? 0;
    if (node.visibility) root.visibility = clone(node.visibility);
    // slot children move into the template node that hosted the slot
    for (const child of nodes.filter((row) => row.parentRef === nodeRef)) {
      const slot = definition.slots.find((row) => row.slotRef === child.slotRef);
      child.parentRef = mapping.get(slot.templateNodeRef);
      child.slotRef = null;
    }
    const keep = nodes.filter((row) => row.nodeRef !== nodeRef);
    nodes.length = 0;
    nodes.push(...keep, ...copies);
    for (const slot of definition.slots) {
      const host = mapping.get(slot.templateNodeRef);
      siblingsOf(draft, scope, host, null).forEach((row, index) => { row.order = index; });
      resequenceDepth(draft, scope, host, null);
    }
    return root.nodeRef;
  },

  SET_OVERRIDE(draft, scope, { nodeRef, templatePath, value }) {
    const node = findNode(draft, scope, nodeRef);
    if (node.kind !== 'INSTANCE') fail('Only instances carry overrides.');
    const others = node.instance.textOverrides.filter((row) => row.templatePath !== templatePath);
    const trimmed = typeof value === 'string' ? value.trim() : '';
    node.instance.textOverrides = trimmed ? [...others, { templatePath, value: trimmed }] : others;
    return nodeRef;
  },

  SET_BINDING(draft, scope, { nodeRef, portRef, key }) {
    const node = findNode(draft, scope, nodeRef);
    if (node.kind !== 'INSTANCE') fail('Only instances carry port bindings.');
    const others = node.instance.portBindings.filter((row) => row.portRef !== portRef);
    if (key === null || key === undefined || !String(key).trim()) {
      node.instance.portBindings = others;
    } else {
      const normalized = normalizeSeamKey(key);
      if (!normalized) fail('Use a short lowercase name like profile.save.');
      node.instance.portBindings = [...others, { portRef, key: normalized }];
    }
    return nodeRef;
  },

  SET_SLOT(draft, scope, { templateNodeRef, slotRef, label = null }) {
    if (!scope) fail('Slots belong to components. Open a component to edit its slots.');
    const definition = draft.definitions.find((row) => row.definitionRef === scope);
    definition.slots = definition.slots.filter((row) => row.templateNodeRef !== templateNodeRef);
    if (slotRef) {
      const normalized = slug(slotRef);
      if (definition.slots.some((row) => row.slotRef === normalized)) fail('Another container already uses the slot name ' + normalized + '.');
      definition.slots.push({ slotRef: normalized, label: label || slotRef, templateNodeRef });
    }
    return templateNodeRef;
  },

  RENAME_DEFINITION(draft, scope, { definitionRef, label }) {
    const definition = draft.definitions.find((row) => row.definitionRef === definitionRef);
    if (!definition) fail('That component no longer exists.');
    if (!String(label ?? '').trim()) fail('Components need a name.');
    definition.label = String(label).trim();
    return null;
  },

  DELETE_DEFINITION(draft, scope, { definitionRef }) {
    const used = [...draft.nodes, ...draft.definitions.flatMap((row) => row.nodes)].some((row) => row.instance?.definitionRef === definitionRef);
    if (used) fail('This component is still placed in the design. Detach or delete its instances first.');
    draft.definitions = draft.definitions.filter((row) => row.definitionRef !== definitionRef);
    return null;
  },

  // Re-point a node at fresh source evidence for the same occurrence (reconciliation is explicit).
  REBIND_SOURCE(draft, scope, { nodeRef, source }) {
    const node = findNode(draft, scope, nodeRef);
    if (!node.source) fail('Only source components have source evidence.');
    if (source.occurrenceRef !== node.source.occurrenceRef) fail('Reconciliation keeps the same source occurrence.');
    if (source.kind !== node.kind) fail('The source occurrence changed kind from ' + node.kind + ' to ' + source.kind + '; replace the element instead.');
    const authored = node.content?.text?.origin === 'AUTHORED';
    const seams = node.behavior.seams.filter((row) => row.origin === 'AUTHORED');
    node.source = clone(source);
    if (!authored && node.content) delete node.content;
    const previous = new Map(node.behavior.seams.filter((row) => row.origin === 'SOURCE').map((row) => [row.kind + '|' + (row.source?.intent ?? ''), row]));
    const refreshed = defaultSeams(nodeRef, node.kind, source).map((row) => {
      const kept = previous.get(row.kind + '|' + (row.source?.intent ?? ''));
      return kept ? { ...row, key: kept.key, targetNodeRefOrNull: kept.targetNodeRefOrNull ?? null } : row;
    });
    node.behavior.seams = [...refreshed, ...seams];
    return nodeRef;
  },

  RENAME(draft, scope, { label }) {
    const value = String(label ?? '').trim();
    if (!value) fail('Designs need a name.');
    draft.label = value;
    draft.blueprintRef = 'ui.blueprint.' + slug(value);
    return null;
  },
};

export const UI_COMMAND_TYPES = Object.freeze(Object.keys(COMMANDS));

// Keep every instance of `definitionRef` addressing only what its template still exposes.
// Optionally bump the definition version (when leaving component editing).
function reconcileInstances(draft, definitionRef, { bump = false } = {}) {
  const definition = draft.definitions.find((row) => row.definitionRef === definitionRef);
  if (bump) definition.version += 1;
  const own = createUiBlueprint(stripForInterface(draft, definitionRef)).definitions.find((row) => row.definitionRef === definitionRef);
  const texts = new Set(own.texts.map((row) => row.templatePath));
  const ports = new Set(own.ports.map((row) => row.portRef));
  const pruned = [];
  for (const node of [...draft.nodes, ...draft.definitions.flatMap((row) => row.nodes)]) {
    if (node.instance?.definitionRef !== definitionRef) continue;
    node.instance.definitionVersion = definition.version;
    const keepTexts = node.instance.textOverrides.filter((row) => texts.has(row.templatePath));
    const keepPorts = node.instance.portBindings.filter((row) => ports.has(row.portRef));
    if (keepTexts.length !== node.instance.textOverrides.length || keepPorts.length !== node.instance.portBindings.length) pruned.push(node.nodeRef);
    node.instance.textOverrides = keepTexts;
    node.instance.portBindings = keepPorts;
  }
  // slot children whose slot disappeared move next to their instance instead of dangling
  const scopes = [null, ...draft.definitions.map((row) => row.definitionRef)];
  for (const scope of scopes) {
    const nodes = scopeNodes(draft, scope);
    for (const host of nodes.filter((row) => row.instance?.definitionRef === definitionRef)) {
      for (const child of nodes.filter((row) => row.parentRef === host.nodeRef)) {
        if (definition.slots.some((row) => row.slotRef === child.slotRef)) continue;
        const parentRef = host.parentRef ?? (scope ? draft.definitions.find((row) => row.definitionRef === scope).rootNodeRef : null);
        if (parentRef === host.nodeRef || (scope && !host.parentRef)) {
          const gone = descendants(nodes, child.nodeRef);
          const keep = nodes.filter((row) => !gone.has(row.nodeRef));
          nodes.length = 0;
          nodes.push(...keep);
          pruned.push(child.nodeRef);
          continue;
        }
        insertAt(draft, scope, child, parentRef, host.parentRef ? host.slotRef ?? null : null, null);
        adaptToParent(draft, scope, child, parentRef, host.parentRef ? host.slotRef ?? null : null, null);
        pruned.push(child.nodeRef);
      }
    }
  }
  return pruned;
}

// Validate a definition's interface in isolation (instances elsewhere are updated afterwards).
function stripForInterface(draft, definitionRef) {
  const wanted = new Set([definitionRef]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const row of draft.definitions) {
      if (!wanted.has(row.definitionRef)) continue;
      for (const node of row.nodes) {
        if (node.instance && !wanted.has(node.instance.definitionRef)) {
          wanted.add(node.instance.definitionRef);
          changed = true;
        }
      }
    }
  }
  return { ...clone(draft), nodes: [], definitions: clone(draft.definitions.filter((row) => wanted.has(row.definitionRef))) };
}

function admit(state, draft, { selection, record = true, scope = state.scope, scopeDirty = state.scopeDirty }) {
  const blueprint = blueprintFromDraft(draft);
  return Object.freeze({
    draft: draftFromBlueprint(blueprint),
    blueprint,
    scope,
    scopeDirty,
    selection,
    past: record ? [...state.past, state.draft].slice(-UI_HISTORY_LIMIT) : state.past,
    future: record ? [] : state.future,
  });
}

// Apply one command. Returns { state, ok, message }. Never throws for user-facing failures.
export function applyCommand(state, command) {
  const handler = COMMANDS[command?.type];
  if (!handler) return { state, ok: false, message: 'Unknown edit ' + String(command?.type) + '.' };
  const draft = clone(state.draft);
  try {
    const result = handler(draft, state.scope, command);
    const pruned = state.scope ? reconcileInstances(draft, state.scope) : [];
    const selection = command.type === 'DELETE' ? result : result ?? state.selection;
    const next = admit(state, draft, { selection, scopeDirty: state.scope ? true : state.scopeDirty });
    const message = pruned.length ? 'Cleared overrides that no longer apply on ' + pruned.length + ' placed instance(s).' : null;
    return { state: next, ok: true, message };
  } catch (error) {
    return { state, ok: false, message: humanizeError(error) };
  }
}

function humanizeError(error) {
  return String(error?.message ?? error).replace(/^ui blueprint: /u, 'Not allowed: ');
}

export function undo(state) {
  if (!state.past.length) return state;
  const previous = state.past.at(-1);
  const blueprint = blueprintFromDraft(previous);
  const scope = state.scope && previous.definitions.some((row) => row.definitionRef === state.scope) ? state.scope : null;
  return Object.freeze({
    draft: draftFromBlueprint(blueprint), blueprint, scope, scopeDirty: state.scopeDirty,
    selection: scopeHas(previous, scope, state.selection) ? state.selection : null,
    past: state.past.slice(0, -1), future: [state.draft, ...state.future],
  });
}

export function redo(state) {
  if (!state.future.length) return state;
  const next = state.future[0];
  const blueprint = blueprintFromDraft(next);
  const scope = state.scope && next.definitions.some((row) => row.definitionRef === state.scope) ? state.scope : null;
  return Object.freeze({
    draft: draftFromBlueprint(blueprint), blueprint, scope, scopeDirty: state.scopeDirty,
    selection: scopeHas(next, scope, state.selection) ? state.selection : null,
    past: [...state.past, state.draft].slice(-UI_HISTORY_LIMIT), future: state.future.slice(1),
  });
}

function scopeHas(draft, scope, nodeRef) {
  if (!nodeRef) return false;
  try {
    return scopeNodes(draft, scope).some((row) => row.nodeRef === nodeRef);
  } catch {
    return false;
  }
}

export function select(state, nodeRef) {
  return Object.freeze({ ...state, selection: scopeHas(state.draft, state.scope, nodeRef) ? nodeRef : null });
}

export function enterDefinition(state, definitionRef) {
  if (!state.draft.definitions.some((row) => row.definitionRef === definitionRef)) {
    return { state, ok: false, message: 'That component no longer exists.' };
  }
  const base = state.scope ? exitDefinition(state).state : state;
  const definition = base.draft.definitions.find((row) => row.definitionRef === definitionRef);
  return { state: Object.freeze({ ...base, scope: definitionRef, scopeDirty: false, selection: definition.rootNodeRef }), ok: true, message: null };
}

// Leave component editing. A changed definition gets a new version and every instance follows
// it; overrides/bindings that no longer address the template are pruned and reported.
export function exitDefinition(state) {
  if (!state.scope) return { state, ok: true, message: null, pruned: [] };
  if (!state.scopeDirty) return { state: Object.freeze({ ...state, scope: null, selection: null }), ok: true, message: null, pruned: [] };
  const draft = clone(state.draft);
  const definitionRef = state.scope;
  const pruned = reconcileInstances(draft, definitionRef, { bump: true });
  const next = admit(state, draft, { selection: null, scope: null, scopeDirty: false });
  const definition = next.draft.definitions.find((row) => row.definitionRef === definitionRef);
  const message = definition.label + ' updated to v' + definition.version
    + (pruned.length ? '; cleared overrides that no longer apply on ' + pruned.length + ' instance(s).' : '.');
  return { state: next, ok: true, message, pruned };
}

export function setPreview(state, patch) {
  const draft = clone(state.draft);
  draft.preview = { ...draft.preview, ...patch };
  return admit(state, draft, { selection: state.selection, record: false });
}

export function replaceDesign(state, blueprint) {
  const next = createEditorState(blueprint);
  return Object.freeze({ ...next, past: [...state.past, state.draft].slice(-UI_HISTORY_LIMIT) });
}

// [VXG RealForever][VEXWORK][COMPONENT-LIBRARY][A5-UI-DOCUMENT]
