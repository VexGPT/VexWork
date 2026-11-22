// Element kind capabilities + source-intent classification for the VexBoard UI Builder.
//
// This module answers two narrow questions and nothing else:
//
//   1. What can an element of kind K structurally do inside a UI Blueprint?
//      (contain children, which children, default layout, triggers, accessible role)
//   2. What behavior seam does a source occurrence's intent describe?
//      (an app-owned ACTION, a NAVIGATION request, or a UI-local PRESENTATION change)
//
// Kinds are data, not a renderer switch. Unknown future kinds degrade to a HELD leaf
// instead of failing or being silently mapped onto a familiar kind.
//
// KIND CAPABILITY != PRODUCT SEMANTICS
// SOURCE INTENT CLASSIFICATION != CALLBACK IMPLEMENTATION

export const UI_KIND_CATEGORIES = Object.freeze([
  'ACTION',
  'INPUT',
  'CONTENT',
  'CONTAINER',
  'OVERLAY',
  'STRUCTURE',
  'LAYOUT',
  'OTHER',
]);

export const UI_CATEGORY_LABELS = Object.freeze({
  ACTION: 'Actions',
  INPUT: 'Inputs',
  CONTENT: 'Content',
  CONTAINER: 'Containers',
  OVERLAY: 'Overlays',
  STRUCTURE: 'Structure',
  LAYOUT: 'Layout',
  OTHER: 'Other',
});

export const UI_TRIGGERS = Object.freeze([
  'ACTIVATE',
  'CHANGE',
  'SUBMIT',
  'RESIZE',
  'COLLAPSE_BEFORE',
  'COLLAPSE_AFTER',
]);

export const UI_SEAM_KINDS = Object.freeze(['ACTION', 'NAVIGATION', 'PRESENTATION']);
export const UI_PRESENTATION_VERBS = Object.freeze(['OPEN', 'CLOSE', 'TOGGLE', 'SWAP', 'REVEAL', 'RESIZE', 'COLLAPSE']);

const STACK_V = Object.freeze({ mode: 'STACK', axis: 'VERTICAL' });
const STACK_H = Object.freeze({ mode: 'STACK', axis: 'HORIZONTAL' });
const OVERLAY = Object.freeze({ mode: 'OVERLAY', axis: 'VERTICAL' });
const FREEFORM = Object.freeze({ mode: 'FREEFORM', axis: 'VERTICAL' });

function kind(spec) {
  return Object.freeze({
    container: false,
    overlay: null,
    childPolicy: 'NONE',
    defaultContainer: null,
    triggers: [],
    a11yRole: 'generic',
    focusable: false,
    text: true,
    defaultWidth: 'HUG',
    defaultHeight: 'HUG',
    needsDescription: false,
    held: false,
    ...spec,
  });
}

// Canonical kinds observed across the current VexLife Android, VexLife Prod and VexStream
// inventories, plus Builder-authored layout groups. Labels are human-facing projection only.
export const UI_KINDS = Object.freeze({
  BUTTON: kind({ label: 'Button', category: 'ACTION', triggers: ['ACTIVATE'], a11yRole: 'button', focusable: true }),
  FAB: kind({ label: 'Floating action', category: 'ACTION', triggers: ['ACTIVATE'], a11yRole: 'button', focusable: true }),
  MENU_ITEM: kind({ label: 'Menu item', category: 'ACTION', triggers: ['ACTIVATE'], a11yRole: 'menuitem', focusable: true, defaultWidth: 'FILL' }),
  FIELD: kind({ label: 'Text field', category: 'INPUT', triggers: ['CHANGE', 'SUBMIT'], a11yRole: 'textbox', focusable: true, defaultWidth: 'FILL' }),
  TOGGLE: kind({ label: 'Toggle', category: 'INPUT', triggers: ['CHANGE'], a11yRole: 'switch', focusable: true, defaultWidth: 'FILL' }),
  TEXT: kind({ label: 'Text', category: 'CONTENT', a11yRole: 'text' }),
  IMAGE: kind({ label: 'Image', category: 'CONTENT', a11yRole: 'img', needsDescription: true, defaultWidth: 'FILL' }),
  CARD: kind({ label: 'Card', category: 'CONTAINER', container: true, childPolicy: 'ANY', defaultContainer: STACK_V, a11yRole: 'group', defaultWidth: 'FILL' }),
  COLUMN: kind({ label: 'Column', category: 'CONTAINER', container: true, childPolicy: 'ANY', defaultContainer: STACK_V, a11yRole: 'group', text: false, defaultWidth: 'FILL' }),
  ROW: kind({ label: 'Row', category: 'CONTAINER', container: true, childPolicy: 'ANY', defaultContainer: STACK_H, a11yRole: 'group', text: false, defaultWidth: 'FILL' }),
  STACK: kind({ label: 'Layered stack', category: 'CONTAINER', container: true, childPolicy: 'ANY', defaultContainer: OVERLAY, a11yRole: 'group', text: false, defaultWidth: 'FILL' }),
  REGION: kind({ label: 'Region', category: 'STRUCTURE', container: true, childPolicy: 'ANY', defaultContainer: STACK_V, a11yRole: 'region', defaultWidth: 'FILL' }),
  FRAME: kind({ label: 'Frame', category: 'STRUCTURE', container: true, childPolicy: 'ANY', defaultContainer: STACK_V, a11yRole: 'group', defaultWidth: 'FILL' }),
  SEAM: kind({ label: 'Seam', category: 'STRUCTURE', a11yRole: 'separator', text: false, defaultWidth: 'FILL' }),
  HANDLE: kind({ label: 'Handle', category: 'STRUCTURE', triggers: ['RESIZE', 'COLLAPSE_BEFORE', 'COLLAPSE_AFTER'], a11yRole: 'separator', focusable: true, text: false }),
  DIALOG: kind({ label: 'Dialog', category: 'OVERLAY', container: true, overlay: 'MODAL', childPolicy: 'ANY', defaultContainer: STACK_V, a11yRole: 'dialog' }),
  SHEET: kind({ label: 'Bottom sheet', category: 'OVERLAY', container: true, overlay: 'SHEET', childPolicy: 'ANY', defaultContainer: STACK_V, a11yRole: 'dialog' }),
  MENU: kind({
    label: 'Menu',
    category: 'OVERLAY',
    container: true,
    overlay: 'POPOVER',
    childPolicy: Object.freeze(['MENU_ITEM', 'TEXT', 'SEAM']),
    defaultContainer: STACK_V,
    a11yRole: 'menu',
    text: false,
  }),
  GROUP: kind({ label: 'Group', category: 'LAYOUT', container: true, childPolicy: 'ANY', defaultContainer: STACK_V, a11yRole: 'group', text: false, defaultWidth: 'FILL' }),
  UNKNOWN: kind({ label: 'Unrecognized kind', category: 'OTHER', a11yRole: 'generic', held: true }),
});

// Builder-authored layout groups. They carry no source occurrence because layout structure
// is the Builder's own relationship (typed containment), not Product meaning.
export const UI_LAYOUT_GROUPS = Object.freeze([
  Object.freeze({ groupRef: 'layout.stack-vertical', label: 'Vertical stack', container: STACK_V }),
  Object.freeze({ groupRef: 'layout.stack-horizontal', label: 'Horizontal stack', container: STACK_H }),
  Object.freeze({ groupRef: 'layout.overlay', label: 'Layered area', container: OVERLAY }),
  Object.freeze({ groupRef: 'layout.freeform', label: 'Free-form area', container: FREEFORM }),
]);

export function kindSpec(value) {
  return UI_KINDS[String(value ?? '').toUpperCase()] ?? UI_KINDS.UNKNOWN;
}

export function isKnownKind(value) {
  return Object.hasOwn(UI_KINDS, String(value ?? '').toUpperCase()) && value !== 'UNKNOWN';
}

export function canContainKind(parentKind, childKind) {
  const parent = kindSpec(parentKind);
  if (!parent.container) return false;
  const child = kindSpec(childKind);
  if (child.overlay) return false; // overlays attach to the surface overlay layer, never nested
  if (parent.childPolicy === 'ANY') return true;
  return Array.isArray(parent.childPolicy) && parent.childPolicy.includes(String(childKind).toUpperCase());
}

export function kindsByCategory() {
  const groups = new Map(UI_KIND_CATEGORIES.map((category) => [category, []]));
  for (const [key, spec] of Object.entries(UI_KINDS)) {
    if (key === 'UNKNOWN' || key === 'GROUP') continue;
    groups.get(spec.category).push(key);
  }
  return groups;
}

// ---------------------------------------------------------------------------------------
// Source intent -> behavior seam classification
// ---------------------------------------------------------------------------------------

export function seamKeySlug(value) {
  return String(value ?? '')
    .trim()
    .replace(/^AppActions\./u, '')
    .replace(/([a-z0-9])([A-Z])/gu, '$1-$2')
    .toLowerCase()
    .replace(/[^a-z0-9.:-]+/gu, '-')
    .replace(/-+/gu, '-')
    .replace(/^[-.]+|[-.]+$/gu, '');
}

export const SEAM_KEY_PATTERN = /^[a-z][a-z0-9]*(?:[.:-][a-z0-9]+)*$/u;

export function normalizeSeamKey(value) {
  const key = seamKeySlug(value);
  return SEAM_KEY_PATTERN.test(key) ? key : null;
}

function pathwayKey(pathwayRef) {
  if (!pathwayRef) return null;
  return normalizeSeamKey(String(pathwayRef).replace(/^pathway\./u, ''));
}

function elementKey(elementRef) {
  if (!elementRef) return null;
  return normalizeSeamKey(String(elementRef).replace(/^element\./u, ''));
}

function classifyIntentPart(part, context) {
  const text = part.trim();
  let match;
  if ((match = /^invoke\((.+)\)$/u.exec(text))) {
    return {
      kind: 'ACTION',
      key: normalizeSeamKey(context.actionKeyOrNull) ?? normalizeSeamKey(match[1]),
      actionKeyOrNull: context.actionKeyOrNull ?? null,
      destinationOrNull: null,
      verbOrNull: null,
      targetHintOrNull: null,
    };
  }
  if (/^localEffect\(\)$/u.test(text)) {
    return {
      kind: 'ACTION',
      key: pathwayKey(context.pathwayRefOrNull) ?? elementKey(context.elementRef) ?? 'local-effect',
      actionKeyOrNull: context.actionKeyOrNull ?? null,
      destinationOrNull: null,
      verbOrNull: null,
      targetHintOrNull: null,
    };
  }
  if ((match = /^navigateTo\((.+)\)$/u.exec(text))) {
    return {
      kind: 'NAVIGATION',
      key: 'navigate.' + (normalizeSeamKey(context.navigatesToOrNull?.replace(/^screen\./u, '') ?? match[1]) ?? 'destination'),
      actionKeyOrNull: null,
      destinationOrNull: context.navigatesToOrNull ?? match[1],
      verbOrNull: null,
      targetHintOrNull: null,
    };
  }
  if (/^navigateBack\(\)$/u.test(text)) {
    return { kind: 'NAVIGATION', key: 'navigate.back', actionKeyOrNull: null, destinationOrNull: 'BACK', verbOrNull: null, targetHintOrNull: null };
  }
  if ((match = /^external\s+(\S+)$/u.exec(text))) {
    return { kind: 'NAVIGATION', key: 'navigate.external', actionKeyOrNull: null, destinationOrNull: match[1], verbOrNull: null, targetHintOrNull: null };
  }
  if ((match = /^(open|close|toggle|swapTo)\((.+)\)$/u.exec(text))) {
    const verb = { open: 'OPEN', close: 'CLOSE', toggle: 'TOGGLE', swapTo: 'SWAP' }[match[1]];
    return {
      kind: 'PRESENTATION',
      key: verb.toLowerCase() + '.' + (normalizeSeamKey(match[2]) ?? 'target'),
      actionKeyOrNull: null,
      destinationOrNull: null,
      verbOrNull: verb,
      targetHintOrNull: match[2],
    };
  }
  if ((match = /^local\s+(.+)$/u.exec(text))) {
    return {
      kind: 'PRESENTATION',
      key: 'reveal.' + (normalizeSeamKey(match[1].split(/\s+/u).pop()) ?? 'target'),
      actionKeyOrNull: null,
      destinationOrNull: null,
      verbOrNull: 'REVEAL',
      targetHintOrNull: match[1],
    };
  }
  if ((match = /^(?:capability|action|presentation)\s+(.+)$/u.exec(text))) {
    // "presentation X" in VexLife Prod names app-owned presentation State (color mode,
    // companion mode). The Builder cannot own it, so it stays an OPEN app action.
    return { kind: 'ACTION', key: normalizeSeamKey(match[1]) ?? 'action', actionKeyOrNull: null, destinationOrNull: null, verbOrNull: null, targetHintOrNull: null };
  }
  return {
    kind: 'ACTION',
    key: normalizeSeamKey(text) ?? normalizeSeamKey(context.actionKeyOrNull) ?? pathwayKey(context.pathwayRefOrNull) ?? 'action',
    actionKeyOrNull: context.actionKeyOrNull ?? null,
    destinationOrNull: null,
    verbOrNull: null,
    targetHintOrNull: null,
  };
}

// Derive behavior seams from source evidence. Every seam is OPEN (app or Builder binds it);
// this function never invents a seam where source projects no intent or interaction.
export function seamsFromSourceIntent({
  kind: elementKind,
  intentOrNull = null,
  actionKeyOrNull = null,
  callOrNull = null,
  pathwayRefOrNull = null,
  navigatesToOrNull = null,
  elementRef = null,
  interactions = [],
} = {}) {
  const spec = kindSpec(elementKind);
  const declared = (Array.isArray(interactions) ? interactions : []).map((value) => String(value).toUpperCase());
  const triggers = declared.filter((value) => UI_TRIGGERS.includes(value));
  const primaryTrigger = triggers.find((value) => value !== 'RESIZE' && !value.startsWith('COLLAPSE'))
    ?? spec.triggers[0]
    ?? triggers[0]
    ?? 'ACTIVATE';
  const context = { actionKeyOrNull, callOrNull, pathwayRefOrNull, navigatesToOrNull, elementRef };
  const seams = [];
  if (intentOrNull && String(intentOrNull).trim()) {
    const parts = String(intentOrNull).split(/\s+then\s+/u);
    parts.forEach((part) => {
      const classified = classifyIntentPart(part, context);
      seams.push({
        trigger: primaryTrigger,
        kind: classified.kind,
        key: classified.key,
        origin: 'SOURCE',
        source: {
          intent: part.trim(),
          actionKeyOrNull: classified.actionKeyOrNull,
          callOrNull: classified.kind === 'ACTION' ? callOrNull : null,
          pathwayRefOrNull,
        },
        destinationOrNull: classified.destinationOrNull,
        verbOrNull: classified.verbOrNull,
        targetHintOrNull: classified.targetHintOrNull,
        targetNodeRefOrNull: null,
      });
    });
  } else if (actionKeyOrNull) {
    seams.push({
      trigger: primaryTrigger,
      kind: 'ACTION',
      key: normalizeSeamKey(actionKeyOrNull) ?? 'action',
      origin: 'SOURCE',
      source: { intent: null, actionKeyOrNull, callOrNull, pathwayRefOrNull },
      destinationOrNull: null,
      verbOrNull: null,
      targetHintOrNull: null,
      targetNodeRefOrNull: null,
    });
  }
  // Spatial handle interactions (resize / collapse) are UI-local presentation relationships.
  for (const trigger of triggers.filter((value) => value === 'RESIZE' || value.startsWith('COLLAPSE'))) {
    seams.push({
      trigger,
      kind: 'PRESENTATION',
      key: trigger.toLowerCase().replace(/_/gu, '-') + '.' + (elementKey(elementRef) ?? 'handle'),
      origin: 'SOURCE',
      source: { intent: null, actionKeyOrNull: null, callOrNull: null, pathwayRefOrNull },
      destinationOrNull: null,
      verbOrNull: trigger === 'RESIZE' ? 'RESIZE' : 'COLLAPSE',
      targetHintOrNull: elementRef,
      targetNodeRefOrNull: null,
    });
  }
  return seams;
}

// [VXG RealForever][VEXWORK][COMPONENT-LIBRARY][A5-UI-KINDS]
