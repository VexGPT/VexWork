// VexBoard UI Blueprint v2 — portable UI construction intent.
//
// A UI Blueprint answers one question: "what exactly did the human mean when they composed
// this interface?" It preserves
//
//   - source-grounded component evidence (exact occurrence / commit / repository),
//   - Builder-authored structure (containment, order, container layout, sizing, placement),
//   - authored content beside — never on top of — source evidence,
//   - behavior seams: OPEN app actions / navigation, Builder-local presentation relationships,
//   - visibility / presence and accessibility relationships,
//   - reusable component definitions and their instances (overrides, port bindings, slots).
//
// It is non-executing: it never becomes the target application's State / Effect / Store /
// Family owner and never carries callback implementations.
//
// PREVIEW PIXELS != LAYOUT MEANING
// DEFINITION != INSTANCE != TARGET REALIZATION
// SOURCE EVIDENCE != AUTHORED CONTENT
// OPEN SEAM != CALLBACK IMPLEMENTATION

import {
  canContainKind,
  isKnownKind,
  kindSpec,
  normalizeSeamKey,
  seamsFromSourceIntent,
  UI_PRESENTATION_VERBS,
  UI_SEAM_KINDS,
  UI_TRIGGERS,
} from './vexboard-ui-kinds.mjs';
import {
  componentForOccurrence,
} from './vexboard-component-inventory.mjs';
import {
  candidatesForSourceFamily,
  targetRealizations,
} from './vexboard-component-architecture.mjs';

export const UI_BLUEPRINT_SCHEMA = 'vexboard.ui-blueprint/v2';
export const UI_BLUEPRINT_SCHEMA_V1 = 'vexboard.ui-blueprint/v1';

export const UI_FRACTION_DENOMINATOR = 24;
export const UI_SPACING_TOKENS = Object.freeze({ NONE: 0, XS: 4, S: 8, M: 12, L: 16, XL: 24 });
export const UI_CONTAINER_MODES = Object.freeze(['STACK', 'OVERLAY', 'FREEFORM']);
export const UI_AXES = Object.freeze(['VERTICAL', 'HORIZONTAL']);
export const UI_ALIGNMENTS = Object.freeze(['START', 'CENTER', 'END', 'STRETCH']);
export const UI_JUSTIFICATIONS = Object.freeze(['START', 'CENTER', 'END', 'SPACE_BETWEEN']);
export const UI_SIZE_MODES = Object.freeze(['HUG', 'FILL', 'FIXED']);
export const UI_ANCHORS = Object.freeze([
  'TOP_START', 'TOP_CENTER', 'TOP_END',
  'CENTER_START', 'CENTER', 'CENTER_END',
  'BOTTOM_START', 'BOTTOM_CENTER', 'BOTTOM_END',
]);
export const UI_PRESENCE = Object.freeze(['ALWAYS', 'WHEN_OPEN', 'CONDITIONAL']);
export const UI_CONSTRUCTION_DISPOSITIONS = Object.freeze([
  'PORTABLE_RELATIONSHIP_AVAILABLE',
  'PORTABILITY_HELD',
  'SOURCE_BOUND',
]);
export const UI_PREVIEW_PROFILES = Object.freeze({
  COMPACT: Object.freeze({ label: 'Phone', sizeClass: 'compact', width: 390, height: 844 }),
  MEDIUM: Object.freeze({ label: 'Tablet', sizeClass: 'medium', width: 768, height: 1024 }),
  EXPANDED: Object.freeze({ label: 'Desktop', sizeClass: 'expanded', width: 1280, height: 800 }),
});
export const UI_DIRECTIONS = Object.freeze(['LTR', 'RTL']);
export const UI_MIN_TOUCH_TARGET_DP = 48;

const D = UI_FRACTION_DENOMINATOR;
const NODE_REF_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]*$/u;

// ---------------------------------------------------------------------------------------
// primitive validation
// ---------------------------------------------------------------------------------------

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
function oneOf(value, allowed, label, fallback) {
  const candidate = value === undefined || value === null ? fallback : String(value).toUpperCase();
  if (!allowed.includes(candidate)) fail(label + ' must be one of ' + allowed.join(', '));
  return candidate;
}
function nonNegativeInteger(value, label) {
  if (!Number.isInteger(value) || value < 0) fail(label + ' must be a non-negative integer');
  return value;
}
function positiveNumber(value, label) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) fail(label + ' must be a positive number');
  return value;
}
function ref(value, label) {
  const value2 = text(value, label);
  if (!NODE_REF_PATTERN.test(value2)) fail(label + ' has invalid characters');
  return value2;
}
function uniqueSorted(values) {
  return [...new Set((values ?? []).filter((value) => value !== null && value !== undefined && value !== '').map(String))].sort();
}
function freezeDeep(value) {
  if (Array.isArray(value)) value.forEach(freezeDeep);
  else if (value && typeof value === 'object') Object.values(value).forEach(freezeDeep);
  return Object.freeze(value);
}
function bool(value) {
  return value === true;
}
function canonicalJson(value) {
  return JSON.stringify(value);
}

// ---------------------------------------------------------------------------------------
// source evidence
// ---------------------------------------------------------------------------------------

function constructionDisposition(accepted, held) {
  if (accepted.length) return 'PORTABLE_RELATIONSHIP_AVAILABLE';
  if (held.length) return 'PORTABILITY_HELD';
  return 'SOURCE_BOUND';
}

// Capture immutable source evidence for one inventory occurrence. `inventory` and
// `architectureCatalog` must already be normalized by the caller (normalize once, reuse).
export function sourceEvidenceFromOccurrence({ inventory, occurrenceRef, architectureCatalog }) {
  const occurrence = inventory?.occurrences?.find((row) => row.occurrenceRef === occurrenceRef);
  if (!occurrence) fail('unknown occurrence ' + occurrenceRef);
  const component = componentForOccurrence(inventory, occurrenceRef);
  const candidates = architectureCatalog ? candidatesForSourceFamily(architectureCatalog, component.componentRef) : [];
  const accepted = candidates.filter((row) => row.state === 'ACCEPTED_PORTABLE' && row.formation?.state === 'ACCEPTED');
  const held = candidates.filter((row) => row.state === 'HELD' || row.formation?.state === 'HELD');
  const acceptedRefs = accepted.map((row) => row.candidateRef);
  const realizationRefs = architectureCatalog
    ? targetRealizations(architectureCatalog).filter((row) => acceptedRefs.includes(row.candidateRef)).map((row) => row.realizationRef)
    : [];
  return normalizeSource({
    subjectRef: inventory.subjectRef,
    buildRef: inventory.buildRef,
    repositoryRef: inventory.sourceSnapshot.repositoryRef,
    commit: inventory.sourceSnapshot.commit,
    componentRef: component.componentRef,
    occurrenceRef: occurrence.occurrenceRef,
    elementRef: occurrence.elementRef,
    surfaceRef: occurrence.surfaceRef,
    surfaceLabelOrNull: occurrence.surfaceLabel ?? null,
    screenRefOrNull: occurrence.screenRef ?? null,
    kind: occurrence.kind,
    label: occurrence.label,
    sourcePathOrNull: occurrence.sourcePath ?? null,
    styleOrNull: occurrence.style ?? null,
    slotOrNull: occurrence.slot ?? null,
    layerOrNull: occurrence.layer ?? null,
    textRoleOrNull: occurrence.textRole ?? null,
    iconOrNull: occurrence.icon ?? null,
    semanticRole: occurrence.semanticRole,
    intentOrNull: occurrence.intent ?? null,
    actionKeyOrNull: occurrence.actionKey ?? null,
    callOrNull: occurrence.call ?? null,
    pathwayRefOrNull: occurrence.pathwayRef ?? null,
    navigatesToOrNull: occurrence.navigatesTo ?? null,
    visibleWhenOrNull: occurrence.visibleWhen ?? null,
    interactions: occurrence.interactions ?? [],
    presenceRefs: occurrence.realization?.presenceRefs ?? [],
    conditionRefs: occurrence.realization?.conditionRefs ?? [],
    localizationSourceStringRefs: occurrence.localization?.sourceStringRefs ?? [],
    accessibilityState: occurrence.accessibility?.state ?? 'NOT_PROJECTED',
    portable: {
      disposition: constructionDisposition(accepted, held),
      acceptedCandidateRefs: acceptedRefs,
      heldCandidateRefs: held.map((row) => row.candidateRef),
      targetRealizationRefs: realizationRefs,
    },
  }, 'source');
}

function normalizeSource(input, label) {
  if (input === null || input === undefined) return null;
  const portable = input.portable ?? {};
  return {
    subjectRef: text(input.subjectRef, label + '.subjectRef'),
    buildRef: text(input.buildRef, label + '.buildRef'),
    repositoryRef: text(input.repositoryRef, label + '.repositoryRef'),
    commit: text(input.commit, label + '.commit'),
    componentRef: text(input.componentRef, label + '.componentRef'),
    occurrenceRef: text(input.occurrenceRef, label + '.occurrenceRef'),
    elementRef: text(input.elementRef, label + '.elementRef'),
    surfaceRef: text(input.surfaceRef, label + '.surfaceRef'),
    surfaceLabelOrNull: optionalText(input.surfaceLabelOrNull, label + '.surfaceLabelOrNull'),
    screenRefOrNull: optionalText(input.screenRefOrNull, label + '.screenRefOrNull'),
    kind: text(input.kind, label + '.kind').toUpperCase(),
    label: text(input.label, label + '.label'),
    sourcePathOrNull: optionalText(input.sourcePathOrNull, label + '.sourcePathOrNull'),
    styleOrNull: optionalText(input.styleOrNull, label + '.styleOrNull'),
    slotOrNull: optionalText(input.slotOrNull, label + '.slotOrNull'),
    layerOrNull: optionalText(input.layerOrNull, label + '.layerOrNull'),
    textRoleOrNull: optionalText(input.textRoleOrNull, label + '.textRoleOrNull'),
    iconOrNull: optionalText(input.iconOrNull, label + '.iconOrNull'),
    semanticRole: text(input.semanticRole ?? 'ELEMENT', label + '.semanticRole'),
    intentOrNull: optionalText(input.intentOrNull, label + '.intentOrNull'),
    actionKeyOrNull: optionalText(input.actionKeyOrNull, label + '.actionKeyOrNull'),
    callOrNull: optionalText(input.callOrNull, label + '.callOrNull'),
    pathwayRefOrNull: optionalText(input.pathwayRefOrNull, label + '.pathwayRefOrNull'),
    navigatesToOrNull: optionalText(input.navigatesToOrNull, label + '.navigatesToOrNull'),
    visibleWhenOrNull: optionalText(input.visibleWhenOrNull, label + '.visibleWhenOrNull'),
    interactions: uniqueSorted(input.interactions).map((value) => value.toUpperCase()),
    presenceRefs: uniqueSorted(input.presenceRefs),
    conditionRefs: uniqueSorted(input.conditionRefs),
    localizationSourceStringRefs: uniqueSorted(input.localizationSourceStringRefs),
    accessibilityState: oneOf(input.accessibilityState, ['NOT_PROJECTED', 'OBSERVED'], label + '.accessibilityState', 'NOT_PROJECTED'),
    portable: {
      disposition: oneOf(portable.disposition, UI_CONSTRUCTION_DISPOSITIONS, label + '.portable.disposition', 'SOURCE_BOUND'),
      acceptedCandidateRefs: uniqueSorted(portable.acceptedCandidateRefs),
      heldCandidateRefs: uniqueSorted(portable.heldCandidateRefs),
      targetRealizationRefs: uniqueSorted(portable.targetRealizationRefs),
    },
  };
}

// ---------------------------------------------------------------------------------------
// node parts
// ---------------------------------------------------------------------------------------

function normalizeContainer(input, label, kindValue) {
  const spec = kindSpec(kindValue);
  if (!spec.container) {
    if (input !== undefined && input !== null) fail(label + ' is only valid for container kinds');
    return null;
  }
  const defaults = spec.defaultContainer ?? { mode: 'STACK', axis: 'VERTICAL' };
  const value = input ?? {};
  const mode = oneOf(value.mode, UI_CONTAINER_MODES, label + '.mode', defaults.mode);
  return {
    mode,
    axis: mode === 'STACK' ? oneOf(value.axis, UI_AXES, label + '.axis', defaults.axis ?? 'VERTICAL') : null,
    gap: oneOf(value.gap, Object.keys(UI_SPACING_TOKENS), label + '.gap', 'S'),
    padding: oneOf(value.padding, Object.keys(UI_SPACING_TOKENS), label + '.padding', kindValue === 'GROUP' ? 'NONE' : 'M'),
    align: mode === 'STACK' ? oneOf(value.align, UI_ALIGNMENTS, label + '.align', 'STRETCH') : null,
    justify: mode === 'STACK' ? oneOf(value.justify, UI_JUSTIFICATIONS, label + '.justify', 'START') : null,
  };
}

function normalizeSize(input, label, fallback) {
  const value = input ?? {};
  const mode = oneOf(value.mode, UI_SIZE_MODES, label + '.mode', fallback);
  const raw = value.valueOrNull ?? null;
  if (mode === 'FIXED') return { mode, valueOrNull: positiveNumber(raw, label + '.valueOrNull') };
  if (raw !== null) fail(label + '.valueOrNull is only valid for FIXED');
  return { mode, valueOrNull: null };
}

function normalizeFractionAxis(input, label) {
  const start = nonNegativeInteger(input?.start, label + '.start');
  if (start >= D) fail(label + '.start must be below ' + D);
  const end = input?.end === undefined || input?.end === null ? null : nonNegativeInteger(input.end, label + '.end');
  if (end !== null && (end <= start || end > D)) fail(label + '.end must be greater than start and at most ' + D);
  return { start, end };
}

function normalizePlacement(input, label, parentMode) {
  if (parentMode === 'FREEFORM') {
    if (!input || input.type !== 'FRACTION') fail(label + ' must be a FRACTION placement inside a free-form container');
    return {
      type: 'FRACTION',
      x: normalizeFractionAxis(input.x, label + '.x'),
      y: normalizeFractionAxis(input.y, label + '.y'),
    };
  }
  if (parentMode === 'OVERLAY') {
    if (!input || input.type !== 'ANCHOR') fail(label + ' must be an ANCHOR placement inside a layered container');
    return {
      type: 'ANCHOR',
      anchor: oneOf(input.anchor, UI_ANCHORS, label + '.anchor', 'TOP_START'),
      inset: oneOf(input.inset, Object.keys(UI_SPACING_TOKENS), label + '.inset', 'NONE'),
    };
  }
  if (input !== undefined && input !== null) fail(label + ' is only valid inside layered or free-form containers');
  return null;
}

function normalizeSeam(input, label, nodeRef) {
  const kindValue = oneOf(input?.kind, UI_SEAM_KINDS, label + '.kind');
  const origin = oneOf(input?.origin, ['SOURCE', 'AUTHORED'], label + '.origin', 'AUTHORED');
  const keyRaw = text(input?.key, label + '.key');
  const key = normalizeSeamKey(keyRaw);
  if (!key || key !== keyRaw) fail(label + '.key must be a lowercase dotted seam key');
  const source = input?.source ? {
    intent: optionalText(input.source.intent, label + '.source.intent'),
    actionKeyOrNull: optionalText(input.source.actionKeyOrNull, label + '.source.actionKeyOrNull'),
    callOrNull: optionalText(input.source.callOrNull, label + '.source.callOrNull'),
    pathwayRefOrNull: optionalText(input.source.pathwayRefOrNull, label + '.source.pathwayRefOrNull'),
  } : null;
  if (origin === 'SOURCE' && !source) fail(label + ' SOURCE seams must keep their source evidence');
  if (origin === 'AUTHORED' && source) fail(label + ' AUTHORED seams cannot claim source evidence');
  const seam = {
    seamRef: ref(input?.seamRef, label + '.seamRef'),
    trigger: oneOf(input?.trigger, UI_TRIGGERS, label + '.trigger', 'ACTIVATE'),
    kind: kindValue,
    key,
    origin,
    source,
    destinationOrNull: null,
    verbOrNull: null,
    targetHintOrNull: null,
    targetNodeRefOrNull: null,
    binding: 'OPEN',
  };
  if (kindValue === 'NAVIGATION') {
    seam.destinationOrNull = optionalText(input.destinationOrNull, label + '.destinationOrNull');
  } else if (input?.destinationOrNull) {
    fail(label + '.destinationOrNull is only valid for NAVIGATION');
  }
  if (kindValue === 'PRESENTATION') {
    seam.verbOrNull = oneOf(input.verbOrNull, UI_PRESENTATION_VERBS, label + '.verbOrNull', 'OPEN');
    seam.targetHintOrNull = optionalText(input.targetHintOrNull, label + '.targetHintOrNull');
    seam.targetNodeRefOrNull = optionalText(input.targetNodeRefOrNull, label + '.targetNodeRefOrNull');
    if (seam.targetNodeRefOrNull === nodeRef) fail(label + ' cannot target its own node');
    seam.binding = seam.targetNodeRefOrNull ? 'BUILDER_LOCAL' : 'OPEN';
  } else if (input?.verbOrNull || input?.targetNodeRefOrNull) {
    fail(label + ' presentation fields are only valid for PRESENTATION');
  }
  if (input?.binding !== undefined && input.binding !== seam.binding) {
    fail(label + '.binding must be ' + seam.binding + ' (callback implementations never live in a UI Blueprint)');
  }
  return seam;
}

function normalizeText(input, label, spec, source) {
  if (!spec.text) {
    if (input !== undefined && input !== null) fail(label + ' is not valid for a kind without text');
    return null;
  }
  if (input === undefined || input === null) {
    if (!source) return null;
    return defaultTextFromSource(source);
  }
  const origin = oneOf(input.origin, ['SOURCE', 'AUTHORED'], label + '.origin', 'AUTHORED');
  const value = text(input.value, label + '.value');
  if (origin === 'SOURCE') {
    if (!source) fail(label + ' SOURCE text requires source evidence');
    if (value !== source.label) fail(label + ' SOURCE text must equal the observed source label; authored copy uses AUTHORED');
    return defaultTextFromSource(source);
  }
  return {
    value,
    origin: 'AUTHORED',
    localization: { state: 'NEEDS_KEY', sourceStringRefs: [] },
  };
}

function defaultTextFromSource(source) {
  return {
    value: source.label,
    origin: 'SOURCE',
    localization: {
      state: source.localizationSourceStringRefs.length ? 'BOUND' : 'NOT_PROJECTED',
      sourceStringRefs: source.localizationSourceStringRefs,
    },
  };
}

function defaultVisibility(kindValue, source) {
  const spec = kindSpec(kindValue);
  const visibleWhen = source?.visibleWhenOrNull ?? null;
  if (spec.overlay) return { presence: 'WHEN_OPEN', conditionKeyOrNull: null, sourceVisibleWhenOrNull: visibleWhen };
  if (visibleWhen) {
    return {
      presence: 'CONDITIONAL',
      conditionKeyOrNull: normalizeSeamKey(visibleWhen.replace(/^runtime\./u, '')) ?? 'condition',
      sourceVisibleWhenOrNull: visibleWhen,
    };
  }
  return { presence: 'ALWAYS', conditionKeyOrNull: null, sourceVisibleWhenOrNull: null };
}

function normalizeVisibility(input, label, kindValue, source) {
  if (input === undefined || input === null) return defaultVisibility(kindValue, source);
  const presence = oneOf(input.presence, UI_PRESENCE, label + '.presence', 'ALWAYS');
  const spec = kindSpec(kindValue);
  if (presence === 'WHEN_OPEN' && !spec.overlay) fail(label + ' WHEN_OPEN is only valid for overlays');
  let conditionKeyOrNull = null;
  if (presence === 'CONDITIONAL') {
    conditionKeyOrNull = normalizeSeamKey(text(input.conditionKeyOrNull, label + '.conditionKeyOrNull'));
    if (!conditionKeyOrNull) fail(label + '.conditionKeyOrNull must be a seam key');
  } else if (input.conditionKeyOrNull) {
    fail(label + '.conditionKeyOrNull is only valid for CONDITIONAL presence');
  }
  return {
    presence,
    conditionKeyOrNull,
    sourceVisibleWhenOrNull: source?.visibleWhenOrNull ?? null,
  };
}

function normalizeAccessibility(input, label, kindValue) {
  const value = input ?? {};
  const decorative = bool(value.decorative);
  if (decorative && kindValue !== 'IMAGE') fail(label + '.decorative is only valid for images');
  return {
    labelOrNull: optionalText(value.labelOrNull, label + '.labelOrNull'),
    decorative,
  };
}

function normalizeInstance(input, label) {
  if (input === undefined || input === null) return null;
  const textOverrides = (Array.isArray(input.textOverrides) ? input.textOverrides : []).map((row, index) => ({
    templatePath: text(row?.templatePath, label + '.textOverrides[' + index + '].templatePath'),
    value: text(row?.value, label + '.textOverrides[' + index + '].value'),
  })).sort((a, b) => a.templatePath.localeCompare(b.templatePath));
  if (new Set(textOverrides.map((row) => row.templatePath)).size !== textOverrides.length) fail(label + ' has duplicate text overrides');
  const portBindings = (Array.isArray(input.portBindings) ? input.portBindings : []).map((row, index) => {
    const key = normalizeSeamKey(text(row?.key, label + '.portBindings[' + index + '].key'));
    if (!key) fail(label + '.portBindings[' + index + '].key must be a seam key');
    return { portRef: text(row?.portRef, label + '.portBindings[' + index + '].portRef'), key };
  }).sort((a, b) => a.portRef.localeCompare(b.portRef));
  if (new Set(portBindings.map((row) => row.portRef)).size !== portBindings.length) fail(label + ' has duplicate port bindings');
  return {
    definitionRef: ref(input.definitionRef, label + '.definitionRef'),
    definitionVersion: nonNegativeInteger(input.definitionVersion, label + '.definitionVersion'),
    textOverrides,
    portBindings,
  };
}

// Normalize one node shape (no cross-node checks yet). `parentMode` is the container mode of
// the parent (or of the surface for top-level content), or null for overlays / templates roots.
function normalizeNodeShape(input, parentMode, definitions) {
  const nodeRef = ref(input?.nodeRef, 'nodeRef');
  const label = nodeRef;
  const instance = normalizeInstance(input.instance, label + ' instance');
  const source = normalizeSource(input.source, label + ' source');
  if (instance && source) fail(label + ' cannot be both a source node and an instance');
  let kindValue = text(input.kind, label + ' kind').toUpperCase();
  if (instance) {
    if (kindValue !== 'INSTANCE') fail(label + ' instance nodes must have kind INSTANCE');
  } else if (source) {
    if (kindValue !== source.kind) fail(label + ' kind must equal its source kind ' + source.kind);
  } else if (kindValue !== 'GROUP') {
    fail(label + ' must be a source node, a layout GROUP, or a component INSTANCE');
  }
  const spec = instance ? kindSpec('GROUP') : kindSpec(kindValue);
  const layoutInput = input.layout ?? {};
  const seamsInput = Array.isArray(input.behavior?.seams) ? input.behavior.seams : null;
  const seams = instance
    ? []
    : (seamsInput ?? defaultSeams(nodeRef, kindValue, source)).map((row, index) => normalizeSeam(row, label + ' seam[' + index + ']', nodeRef));
  if (instance && seamsInput && seamsInput.length) fail(label + ' instance seams come from its definition ports');
  if (new Set(seams.map((row) => row.seamRef)).size !== seams.length) fail(label + ' has duplicate seamRefs');
  return {
    nodeRef,
    parentRef: optionalText(input.parentRef, label + ' parentRef'),
    slotRef: optionalText(input.slotRef, label + ' slotRef'),
    order: nonNegativeInteger(input.order ?? 0, label + ' order'),
    kind: kindValue,
    source,
    instance,
    content: {
      text: instance ? null : normalizeText(input.content?.text, label + ' content.text', spec, source),
    },
    layout: {
      container: instance ? null : normalizeContainer(layoutInput.container, label + ' layout.container', kindValue),
      width: normalizeSize(layoutInput.width, label + ' layout.width', spec.defaultWidth),
      height: normalizeSize(layoutInput.height, label + ' layout.height', spec.defaultHeight),
      placement: normalizePlacement(layoutInput.placement, label + ' layout.placement', parentMode),
      depth: nonNegativeInteger(layoutInput.depth ?? 0, label + ' layout.depth'),
    },
    behavior: { seams },
    visibility: instance
      ? normalizeVisibility(input.visibility, label + ' visibility', effectiveKindOfRawInstance(input, definitions), null)
      : normalizeVisibility(input.visibility, label + ' visibility', kindValue, source),
    accessibility: normalizeAccessibility(input.accessibility, label + ' accessibility', kindValue),
  };
}

export function defaultSeams(nodeRef, kindValue, source) {
  if (!source) return [];
  return seamsFromSourceIntent({
    kind: kindValue,
    intentOrNull: source.intentOrNull,
    actionKeyOrNull: source.actionKeyOrNull,
    callOrNull: source.callOrNull,
    pathwayRefOrNull: source.pathwayRefOrNull,
    navigatesToOrNull: source.navigatesToOrNull,
    elementRef: source.elementRef,
    interactions: source.interactions,
  }).map((seam, index) => ({ ...seam, seamRef: 's' + (index + 1) }));
}

// ---------------------------------------------------------------------------------------
// composition (one node set: blueprint nodes or one definition's template)
// ---------------------------------------------------------------------------------------

function normalizeSurface(input) {
  const value = input ?? {};
  const container = normalizeContainer(value.container ?? { mode: 'STACK', axis: 'VERTICAL', padding: 'L', gap: 'M' }, 'surface.container', 'GROUP');
  return { container };
}

function rawParentMode(rawByRef, raw, surfaceMode, definitions, isTemplate) {
  if (!raw?.parentRef) {
    const k = String(raw?.kind ?? '').toUpperCase();
    if (k !== 'INSTANCE' && kindSpec(k).overlay) return null;
    if (k === 'INSTANCE') {
      const effective = effectiveKindOfRawInstance(raw, definitions);
      if (kindSpec(effective).overlay) return null;
    }
    return isTemplate ? null : surfaceMode;
  }
  const parent = rawByRef.get(raw.parentRef);
  if (!parent) return 'STACK'; // missing parent is rejected later with a clearer message
  if (String(parent.kind).toUpperCase() === 'INSTANCE') {
    // children of an instance live in a definition slot; placement follows the slot's container
    const definition = definitions.get(parent.instance?.definitionRef);
    const slot = definition?.slots?.find((row) => row.slotRef === raw.slotRef);
    const templateNode = slot ? definition.nodes.find((row) => row.nodeRef === slot.templateNodeRef) : null;
    return templateNode?.layout?.container?.mode ?? 'STACK';
  }
  const parentKind = String(parent.kind).toUpperCase();
  const spec = kindSpec(parentKind);
  return parent.layout?.container?.mode ?? spec.defaultContainer?.mode ?? 'STACK';
}

function effectiveKindOfRawInstance(raw, definitions, seen = new Set()) {
  const definition = definitions.get(raw?.instance?.definitionRef);
  if (!definition || seen.has(definition.definitionRef)) return 'GROUP';
  seen.add(definition.definitionRef);
  const root = definition.nodes.find((row) => row.nodeRef === definition.rootNodeRef);
  if (!root) return 'GROUP';
  if (root.kind === 'INSTANCE') return effectiveKindOfRawInstance(root, definitions, seen);
  return root.kind;
}

export function effectiveKind(node, definitions) {
  if (node.kind !== 'INSTANCE') return node.kind;
  return effectiveKindOfRawInstance(node, definitions instanceof Map ? definitions : new Map((definitions ?? []).map((row) => [row.definitionRef, row])));
}

function preorder(nodes) {
  const byParent = new Map();
  for (const node of nodes) {
    const key = node.parentRef ?? '';
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key).push(node);
  }
  for (const list of byParent.values()) {
    list.sort((a, b) => (a.slotRef ?? '').localeCompare(b.slotRef ?? '') || a.order - b.order || a.nodeRef.localeCompare(b.nodeRef));
  }
  const out = [];
  const visit = (node) => {
    out.push(node);
    for (const child of byParent.get(node.nodeRef) ?? []) visit(child);
  };
  for (const root of byParent.get('') ?? []) visit(root);
  return out;
}

function normalizeComposition(rawNodes, { label, surfaceMode, definitions, isTemplate }) {
  if (!Array.isArray(rawNodes)) fail(label + ' nodes must be an array');
  const rawByRef = new Map();
  for (const raw of rawNodes) {
    const nodeRef = ref(raw?.nodeRef, label + ' nodeRef');
    if (rawByRef.has(nodeRef)) fail(label + ' duplicate node ' + nodeRef);
    rawByRef.set(nodeRef, raw);
  }
  const nodes = rawNodes.map((raw) => normalizeNodeShape(raw, rawParentMode(rawByRef, raw, surfaceMode, definitions, isTemplate), definitions));
  const byRef = new Map(nodes.map((node) => [node.nodeRef, node]));
  const kindOf = (node) => effectiveKind(node, definitions);

  for (const node of nodes) {
    const kindValue = kindOf(node);
    if (node.instance) {
      const definition = definitions.get(node.instance.definitionRef);
      if (!definition) fail(node.nodeRef + ' references missing component definition ' + node.instance.definitionRef);
      if (definition.version !== node.instance.definitionVersion) {
        fail(node.nodeRef + ' was placed from ' + node.instance.definitionRef + ' v' + node.instance.definitionVersion + ' but the definition is v' + definition.version);
      }
      const texts = new Set(definition.texts.map((row) => row.templatePath));
      for (const row of node.instance.textOverrides) {
        if (!texts.has(row.templatePath)) fail(node.nodeRef + ' overrides unknown text ' + row.templatePath);
      }
      const ports = new Set(definition.ports.map((row) => row.portRef));
      for (const row of node.instance.portBindings) {
        if (!ports.has(row.portRef)) fail(node.nodeRef + ' binds unknown port ' + row.portRef);
      }
    }
    if (node.parentRef === null) {
      if (node.slotRef) fail(node.nodeRef + ' slotRef requires an instance parent');
      if (kindSpec(kindValue).overlay) {
        if (node.layout.placement) fail(node.nodeRef + ' overlays are placed by their overlay kind, not by placement');
      }
      continue;
    }
    if (node.parentRef === node.nodeRef) fail(node.nodeRef + ' cannot parent itself');
    const parent = byRef.get(node.parentRef);
    if (!parent) fail(node.nodeRef + ' references missing parent ' + node.parentRef);
    if (parent.instance) {
      const definition = definitions.get(parent.instance.definitionRef);
      const slot = definition.slots.find((row) => row.slotRef === node.slotRef);
      if (!slot) fail(node.nodeRef + ' must name a slot of ' + parent.instance.definitionRef);
      const slotNode = definition.nodes.find((row) => row.nodeRef === slot.templateNodeRef);
      if (!canContainKind(kindOf(slotNode), kindValue)) fail(node.nodeRef + ' (' + kindValue + ') cannot be placed in slot ' + slot.slotRef);
    } else {
      if (node.slotRef) fail(node.nodeRef + ' slotRef is only valid inside an instance');
      if (kindSpec(kindValue).overlay) fail(node.nodeRef + ' overlays attach to the surface overlay layer and cannot be nested');
      if (!canContainKind(parent.kind, kindValue)) {
        fail(node.nodeRef + ' (' + kindValue + ') cannot be placed inside ' + parent.nodeRef + ' (' + parent.kind + ')');
      }
    }
  }
  // cycles
  for (const node of nodes) {
    const seen = new Set([node.nodeRef]);
    let cursor = node.parentRef ? byRef.get(node.parentRef) : null;
    while (cursor) {
      if (seen.has(cursor.nodeRef)) fail(label + ' composition cycle at ' + node.nodeRef);
      seen.add(cursor.nodeRef);
      cursor = cursor.parentRef ? byRef.get(cursor.parentRef) : null;
    }
  }
  // sibling order + depth
  const siblingGroups = new Map();
  for (const node of nodes) {
    const overlay = node.parentRef === null && kindSpec(kindOf(node)).overlay;
    const key = (node.parentRef ?? (overlay ? '#overlay' : '#surface')) + '|' + (node.slotRef ?? '');
    if (!siblingGroups.has(key)) siblingGroups.set(key, []);
    siblingGroups.get(key).push(node);
  }
  for (const [key, siblings] of siblingGroups) {
    const orders = siblings.map((row) => row.order);
    if (new Set(orders).size !== orders.length) fail(label + ' duplicate sibling order in ' + key);
    const layered = key.startsWith('#overlay')
      || (key.startsWith('#surface') ? surfaceMode !== 'STACK' : (() => {
        const parent = byRef.get(siblings[0].parentRef);
        if (parent.instance) return siblings[0].layout.placement !== null;
        return parent.layout.container.mode !== 'STACK';
      })());
    if (isTemplate && key.startsWith('#surface')) {
      if (siblings.length !== 1) fail(label + ' must have exactly one root node');
      continue;
    }
    if (!layered) {
      if (siblings.some((row) => row.layout.depth !== 0)) fail(label + ' depth only applies inside layered or free-form containers (' + key + ')');
    } else {
      const depths = siblings.map((row) => row.layout.depth);
      if (new Set(depths).size !== depths.length) fail(label + ' duplicate sibling depth in ' + key);
    }
  }
  // free-form containers need a definite height
  for (const node of nodes) {
    if (node.layout.container?.mode === 'FREEFORM' && node.layout.height.mode !== 'FIXED') {
      fail(node.nodeRef + ' free-form containers need a FIXED height so fractional placement has meaning');
    }
  }
  // presentation targets
  for (const node of nodes) {
    for (const seam of node.behavior.seams) {
      if (!seam.targetNodeRefOrNull) continue;
      const target = byRef.get(seam.targetNodeRefOrNull);
      if (!target) fail(node.nodeRef + ' seam ' + seam.seamRef + ' targets missing node ' + seam.targetNodeRefOrNull);
      if (!kindSpec(kindOf(target)).overlay) fail(node.nodeRef + ' seam ' + seam.seamRef + ' may only open/close overlays');
      if (!['OPEN', 'CLOSE', 'TOGGLE'].includes(seam.verbOrNull)) fail(node.nodeRef + ' seam ' + seam.seamRef + ' ' + seam.verbOrNull + ' cannot be bound to an overlay');
    }
  }
  return preorder(nodes);
}

// ---------------------------------------------------------------------------------------
// definitions
// ---------------------------------------------------------------------------------------

function definitionDependencies(rawDefinition) {
  return uniqueSorted((rawDefinition.nodes ?? []).filter((row) => String(row?.kind).toUpperCase() === 'INSTANCE').map((row) => row.instance?.definitionRef));
}

function orderDefinitions(rawDefinitions) {
  const byRef = new Map();
  for (const raw of rawDefinitions) {
    const definitionRef = ref(raw?.definitionRef, 'definitionRef');
    if (byRef.has(definitionRef)) fail('duplicate component definition ' + definitionRef);
    byRef.set(definitionRef, raw);
  }
  const ordered = [];
  const state = new Map();
  const visit = (definitionRef, trail) => {
    if (state.get(definitionRef) === 'DONE') return;
    if (state.get(definitionRef) === 'VISITING') fail('component definition cycle: ' + [...trail, definitionRef].join(' -> '));
    const raw = byRef.get(definitionRef);
    if (!raw) fail((trail.at(-1) ?? 'blueprint') + ' uses missing component definition ' + definitionRef);
    state.set(definitionRef, 'VISITING');
    for (const dependency of definitionDependencies(raw)) visit(dependency, [...trail, definitionRef]);
    state.set(definitionRef, 'DONE');
    ordered.push(raw);
  };
  for (const definitionRef of [...byRef.keys()].sort()) visit(definitionRef, []);
  return ordered;
}

function normalizeDefinition(raw, definitions) {
  const definitionRef = ref(raw.definitionRef, 'definitionRef');
  const label = text(raw.label, definitionRef + ' label');
  const version = nonNegativeInteger(raw.version, definitionRef + ' version');
  if (version < 1) fail(definitionRef + ' version must start at 1');
  const nodes = normalizeComposition(raw.nodes, {
    label: 'definition ' + definitionRef,
    surfaceMode: null,
    definitions,
    isTemplate: true,
  });
  const roots = nodes.filter((node) => node.parentRef === null);
  if (roots.length !== 1) fail(definitionRef + ' must have exactly one root node');
  const root = roots[0];
  if (root.nodeRef !== ref(raw.rootNodeRef, definitionRef + ' rootNodeRef')) fail(definitionRef + ' rootNodeRef must be its only root node');
  if (root.layout.depth !== 0) fail(definitionRef + ' root depth belongs to each placed instance');
  const byRef = new Map(nodes.map((node) => [node.nodeRef, node]));
  const slots = (Array.isArray(raw.slots) ? raw.slots : []).map((row, index) => {
    const slotRef = ref(row?.slotRef, definitionRef + ' slots[' + index + '].slotRef');
    const templateNodeRef = text(row?.templateNodeRef, definitionRef + ' slots[' + index + '].templateNodeRef');
    const node = byRef.get(templateNodeRef);
    if (!node) fail(definitionRef + ' slot ' + slotRef + ' references missing node ' + templateNodeRef);
    if (node.instance || !kindSpec(node.kind).container) fail(definitionRef + ' slot ' + slotRef + ' must be a container template node');
    return { slotRef, label: text(row?.label ?? slotRef, definitionRef + ' slot label'), templateNodeRef };
  }).sort((a, b) => a.slotRef.localeCompare(b.slotRef));
  if (new Set(slots.map((row) => row.slotRef)).size !== slots.length) fail(definitionRef + ' duplicate slotRef');
  if (new Set(slots.map((row) => row.templateNodeRef)).size !== slots.length) fail(definitionRef + ' one template node can host only one slot');
  const definition = { definitionRef, label, version, rootNodeRef: root.nodeRef, nodes, slots };
  const derived = deriveDefinitionInterface(definition, definitions);
  return { ...definition, ...derived };
}

// Ports / overridable texts are the reusable component's public interface. They are derived
// from the template so they cannot drift from it.
function deriveDefinitionInterface(definition, definitions) {
  const ports = [];
  const texts = [];
  const snapshots = new Map();
  for (const node of definition.nodes) {
    if (node.source) {
      snapshots.set(node.source.repositoryRef + '@' + node.source.commit, { repositoryRef: node.source.repositoryRef, commit: node.source.commit });
    }
    if (node.instance) {
      const inner = definitions.get(node.instance.definitionRef);
      for (const port of inner.ports) {
        const binding = node.instance.portBindings.find((row) => row.portRef === port.portRef);
        ports.push({ ...port, portRef: node.nodeRef + '/' + port.portRef, defaultKey: binding?.key ?? port.defaultKey });
      }
      for (const row of inner.texts) {
        const override = node.instance.textOverrides.find((item) => item.templatePath === row.templatePath);
        texts.push({ templatePath: node.nodeRef + '/' + row.templatePath, defaultValue: override?.value ?? row.defaultValue });
      }
      for (const snapshot of inner.sourceSnapshots) snapshots.set(snapshot.repositoryRef + '@' + snapshot.commit, snapshot);
      continue;
    }
    for (const seam of node.behavior.seams) {
      if (seam.kind === 'PRESENTATION' && seam.targetNodeRefOrNull) continue; // internal to the component
      ports.push({ portRef: node.nodeRef + '/' + seam.seamRef, kind: seam.kind, trigger: seam.trigger, defaultKey: seam.key });
    }
    if (node.content.text) texts.push({ templatePath: node.nodeRef, defaultValue: node.content.text.value });
  }
  return {
    ports: ports.sort((a, b) => a.portRef.localeCompare(b.portRef)),
    texts: texts.sort((a, b) => a.templatePath.localeCompare(b.templatePath)),
    sourceSnapshots: [...snapshots.values()].sort((a, b) => a.repositoryRef.localeCompare(b.repositoryRef) || a.commit.localeCompare(b.commit)),
    dependsOn: uniqueSorted(definition.nodes.filter((node) => node.instance).map((node) => node.instance.definitionRef)),
  };
}

function normalizeDefinitions(rawDefinitions) {
  if (!Array.isArray(rawDefinitions)) fail('definitions must be an array');
  const definitions = new Map();
  for (const raw of orderDefinitions(rawDefinitions)) {
    const definition = normalizeDefinition(raw, definitions);
    definitions.set(definition.definitionRef, definition);
  }
  return definitions;
}

// ---------------------------------------------------------------------------------------
// expansion — the resolved tree adapters, previews and reviews consume
// ---------------------------------------------------------------------------------------

// Expand instances into a resolved tree. Every resolved node carries a stable `path`:
//   top-level node          -> nodeRef
//   template node of an instance -> instancePath + '/' + templateNodeRef
// so generated target code can map back to blueprint meaning without counters.
export function expandBlueprint(blueprint) {
  const definitions = new Map((blueprint.definitions ?? []).map((row) => [row.definitionRef, row]));
  const childrenOf = (nodes) => {
    const map = new Map();
    for (const node of nodes) {
      const key = node.parentRef ?? '';
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(node);
    }
    for (const list of map.values()) list.sort((a, b) => a.order - b.order);
    return map;
  };
  const topChildren = childrenOf(blueprint.nodes);

  function expandNode(node, path, context) {
    if (node.instance) return expandInstance(node, path, context);
    const resolvedSeams = node.behavior.seams.map((seam) => {
      const portRef = context.portPrefix !== null ? context.portPrefix + node.nodeRef + '/' + seam.seamRef : null;
      const bound = portRef !== null ? context.portKey(portRef) : null;
      return {
        ...seam,
        key: bound ?? seam.key,
        targetPathOrNull: seam.targetNodeRefOrNull ? context.resolveTarget(seam.targetNodeRefOrNull) : null,
      };
    });
    const textValue = node.content.text
      ? (context.textOverride(context.portPrefix !== null ? context.portPrefix + node.nodeRef : null) ?? node.content.text.value)
      : null;
    const resolved = {
      path,
      nodeRef: node.nodeRef,
      kind: node.kind,
      source: node.source,
      instanceChain: context.chain,
      text: node.content.text ? {
        ...node.content.text,
        value: textValue,
        origin: textValue !== node.content.text.value ? 'AUTHORED' : node.content.text.origin,
        localization: textValue !== node.content.text.value ? { state: 'NEEDS_KEY', sourceStringRefs: [] } : node.content.text.localization,
      } : null,
      layout: node.layout,
      visibility: node.visibility,
      accessibility: node.accessibility,
      seams: resolvedSeams,
      slotHostOrNull: context.slotHost(node.nodeRef),
      children: [],
    };
    const kids = context.children.get(node.nodeRef) ?? [];
    resolved.children = kids.map((child) => expandNode(child, context.childPath(child), context));
    const slotted = context.slotChildren(node.nodeRef);
    for (const child of slotted) resolved.children.push(child);
    return resolved;
  }

  function expandInstance(node, path, outer) {
    const definition = definitions.get(node.instance.definitionRef);
    const templateChildren = childrenOf(definition.nodes);
    const root = definition.nodes.find((row) => row.nodeRef === definition.rootNodeRef);
    const instanceChildren = (outer.children.get(node.nodeRef) ?? []).map((child) => ({ child, resolved: expandNode(child, outer.childPath(child), outer) }));
    // The outermost placement wins: a placed instance may rebind what a nested template
    // instance declared as its default, never the reverse.
    const portKey = (portRef) => {
      const fromOuter = outer.portPrefix !== null ? outer.portKey(outer.portPrefix + node.nodeRef + '/' + portRef) : null;
      if (fromOuter) return fromOuter;
      return node.instance.portBindings.find((row) => row.portRef === portRef)?.key ?? null;
    };
    const textOverride = (templatePath) => {
      const fromOuter = outer.portPrefix !== null ? outer.textOverride(outer.portPrefix + node.nodeRef + '/' + templatePath) : null;
      if (fromOuter) return fromOuter;
      return node.instance.textOverrides.find((row) => row.templatePath === templatePath)?.value ?? null;
    };
    const inner = {
      chain: [...outer.chain, { instancePath: path, definitionRef: definition.definitionRef, definitionVersion: definition.version }],
      children: templateChildren,
      portPrefix: '',
      portKey,
      textOverride,
      childPath: (child) => path + '/' + child.nodeRef,
      resolveTarget: (templateRef) => path + '/' + templateRef,
      slotHost: (templateRef) => {
        const slot = definition.slots.find((row) => row.templateNodeRef === templateRef);
        return slot ? { instancePath: path, slotRef: slot.slotRef, label: slot.label } : null;
      },
      slotChildren: (templateRef) => {
        const slot = definition.slots.find((row) => row.templateNodeRef === templateRef);
        if (!slot) return [];
        return instanceChildren.filter((row) => row.child.slotRef === slot.slotRef).map((row) => row.resolved);
      },
    };
    const resolved = expandNode(root, path + '/' + root.nodeRef, inner);
    // the instance node owns placement / depth / visibility in its parent
    return {
      ...resolved,
      path,
      instanceNodeRef: node.nodeRef,
      layout: { ...resolved.layout, placement: node.layout.placement, depth: node.layout.depth, width: node.layout.width, height: node.layout.height },
      visibility: node.visibility.presence === 'ALWAYS' ? resolved.visibility : node.visibility,
    };
  }

  const topContext = {
    chain: [],
    children: topChildren,
    portPrefix: null,
    portKey: () => null,
    textOverride: () => null,
    childPath: (child) => child.nodeRef,
    resolveTarget: (nodeRef) => nodeRef,
    slotHost: () => null,
    slotChildren: () => [],
  };
  const roots = (topChildren.get('') ?? []).map((node) => expandNode(node, node.nodeRef, topContext));
  const isOverlay = (resolved) => Boolean(kindSpec(resolved.kind).overlay);
  return {
    content: roots.filter((row) => !isOverlay(row)),
    overlays: roots.filter(isOverlay),
  };
}

export function walkResolved(expanded, visit) {
  const go = (node, parent, depth) => {
    visit(node, parent, depth);
    for (const child of node.children) go(child, node, depth + 1);
  };
  for (const node of [...expanded.content, ...expanded.overlays]) go(node, null, 0);
}

// ---------------------------------------------------------------------------------------
// derived integration contract
// ---------------------------------------------------------------------------------------

function deriveIntegration(expanded) {
  const actions = new Map();
  const navigation = new Map();
  const presentation = [];
  const conditions = new Map();
  walkResolved(expanded, (node) => {
    for (const seam of node.seams) {
      const use = { path: node.path, trigger: seam.trigger, origin: seam.origin, sourceIntentOrNull: seam.source?.intent ?? null };
      if (seam.kind === 'ACTION') {
        if (!actions.has(seam.key)) actions.set(seam.key, { key: seam.key, binding: 'OPEN', sourceActionKeys: [], uses: [] });
        const entry = actions.get(seam.key);
        if (seam.source?.actionKeyOrNull) entry.sourceActionKeys = uniqueSorted([...entry.sourceActionKeys, seam.source.actionKeyOrNull]);
        entry.uses.push(use);
      } else if (seam.kind === 'NAVIGATION') {
        if (!navigation.has(seam.key)) navigation.set(seam.key, { key: seam.key, binding: 'OPEN', destinations: [], uses: [] });
        const entry = navigation.get(seam.key);
        if (seam.destinationOrNull) entry.destinations = uniqueSorted([...entry.destinations, seam.destinationOrNull]);
        entry.uses.push(use);
      } else {
        presentation.push({
          key: seam.key,
          verb: seam.verbOrNull,
          binding: seam.targetPathOrNull ? 'BUILDER_LOCAL' : 'OPEN',
          targetPathOrNull: seam.targetPathOrNull,
          targetHintOrNull: seam.targetHintOrNull,
          ...use,
        });
      }
    }
    if (node.visibility.presence === 'CONDITIONAL') {
      const key = node.visibility.conditionKeyOrNull;
      if (!conditions.has(key)) conditions.set(key, { key, binding: 'OPEN', sourceVisibleWhen: [], paths: [] });
      const entry = conditions.get(key);
      if (node.visibility.sourceVisibleWhenOrNull) entry.sourceVisibleWhen = uniqueSorted([...entry.sourceVisibleWhen, node.visibility.sourceVisibleWhenOrNull]);
      entry.paths.push(node.path);
    }
  });
  const byKey = (a, b) => a.key.localeCompare(b.key);
  const sortUses = (entry) => ({ ...entry, uses: entry.uses.sort((a, b) => a.path.localeCompare(b.path) || a.trigger.localeCompare(b.trigger)) });
  return {
    bindingMode: 'OPEN_SEAMS',
    actions: [...actions.values()].map(sortUses).sort(byKey),
    navigation: [...navigation.values()].map(sortUses).sort(byKey),
    presentation: presentation.sort((a, b) => a.path.localeCompare(b.path) || a.key.localeCompare(b.key)),
    conditions: [...conditions.values()].map((entry) => ({ ...entry, paths: entry.paths.sort() })).sort(byKey),
  };
}

function deriveSummary(nodes, definitions, expanded, integration) {
  let resolvedCount = 0;
  const dispositions = { PORTABLE_RELATIONSHIP_AVAILABLE: 0, PORTABILITY_HELD: 0, SOURCE_BOUND: 0, BUILDER_LAYOUT: 0 };
  let unknownKinds = 0;
  walkResolved(expanded, (node) => {
    resolvedCount += 1;
    if (node.source) dispositions[node.source.portable.disposition] += 1;
    else dispositions.BUILDER_LAYOUT += 1;
    if (node.source && !isKnownKind(node.kind)) unknownKinds += 1;
  });
  return {
    nodeCount: nodes.length,
    resolvedNodeCount: resolvedCount,
    overlayCount: expanded.overlays.length,
    definitionCount: definitions.length,
    instanceCount: nodes.filter((node) => node.instance).length,
    openActionCount: integration.actions.length,
    openNavigationCount: integration.navigation.length,
    openPresentationCount: integration.presentation.filter((row) => row.binding === 'OPEN').length,
    builderLocalPresentationCount: integration.presentation.filter((row) => row.binding === 'BUILDER_LOCAL').length,
    openConditionCount: integration.conditions.length,
    unknownKindCount: unknownKinds,
    dispositions,
  };
}

// ---------------------------------------------------------------------------------------
// public construction
// ---------------------------------------------------------------------------------------

export function createUiBlueprint({
  blueprintRef,
  label,
  surface = undefined,
  preview = undefined,
  nodes = [],
  definitions = [],
}) {
  blueprintRef = ref(blueprintRef, 'blueprintRef');
  label = text(label, 'label');
  const normalizedSurface = normalizeSurface(surface);
  const definitionMap = normalizeDefinitions(definitions);
  const normalizedNodes = normalizeComposition(nodes, {
    label: 'blueprint',
    surfaceMode: normalizedSurface.container.mode,
    definitions: definitionMap,
    isTemplate: false,
  });
  const definitionList = [...definitionMap.values()].sort((a, b) => a.definitionRef.localeCompare(b.definitionRef));
  const previewValue = {
    profile: oneOf(preview?.profile, Object.keys(UI_PREVIEW_PROFILES), 'preview.profile', 'COMPACT'),
    direction: oneOf(preview?.direction, UI_DIRECTIONS, 'preview.direction', 'LTR'),
    previewOnly: true,
  };
  const draft = {
    schemaVersion: UI_BLUEPRINT_SCHEMA,
    blueprintRef,
    label,
    aiRequired: false,
    effects: false,
    executionAuthority: 'NONE',
    units: { length: 'dp', fractionDenominator: D, spacingTokens: { ...UI_SPACING_TOKENS } },
    surface: normalizedSurface,
    preview: previewValue,
    definitions: definitionList,
    nodes: normalizedNodes,
  };
  const expanded = expandBlueprint(draft);
  const integration = deriveIntegration(expanded);
  const snapshots = new Map();
  for (const node of normalizedNodes) {
    if (node.source) snapshots.set(node.source.repositoryRef + '@' + node.source.commit, { repositoryRef: node.source.repositoryRef, commit: node.source.commit });
  }
  for (const definition of definitionList) {
    for (const snapshot of definition.sourceSnapshots) snapshots.set(snapshot.repositoryRef + '@' + snapshot.commit, snapshot);
  }
  return freezeDeep({
    ...draft,
    derived: {
      sourceSnapshots: [...snapshots.values()].sort((a, b) => a.repositoryRef.localeCompare(b.repositoryRef) || a.commit.localeCompare(b.commit)),
      integration,
      summary: deriveSummary(normalizedNodes, definitionList, expanded, integration),
    },
  });
}

function stripDerivedDefinition(definition) {
  return {
    definitionRef: definition.definitionRef,
    label: definition.label,
    version: definition.version,
    rootNodeRef: definition.rootNodeRef,
    nodes: definition.nodes,
    slots: definition.slots,
  };
}

// Read a v2 blueprint and prove its derived sections agree with its authored sections.
export function normalizeUiBlueprint(input) {
  if (!input || input.schemaVersion !== UI_BLUEPRINT_SCHEMA) fail('schemaVersion must be ' + UI_BLUEPRINT_SCHEMA);
  if (input.aiRequired !== false) fail('aiRequired must be false');
  if (input.effects !== false || input.executionAuthority !== 'NONE') fail('UI Blueprint is non-executing');
  if (input.units !== undefined && (input.units?.length !== 'dp' || input.units?.fractionDenominator !== D)) {
    fail('units must be dp with fraction denominator ' + D);
  }
  const canonical = createUiBlueprint({
    blueprintRef: input.blueprintRef,
    label: input.label,
    surface: input.surface,
    preview: input.preview,
    nodes: input.nodes,
    definitions: (input.definitions ?? []).map(stripDerivedDefinition),
  });
  if (input.derived !== undefined && canonicalJson(canonical.derived) !== canonicalJson(input.derived)) {
    fail('derived integration / summary disagrees with authored nodes');
  }
  for (const definition of input.definitions ?? []) {
    const own = canonical.definitions.find((row) => row.definitionRef === definition.definitionRef);
    for (const key of ['ports', 'texts', 'sourceSnapshots', 'dependsOn']) {
      if (definition[key] !== undefined && canonicalJson(own[key]) !== canonicalJson(definition[key])) {
        fail(definition.definitionRef + ' ' + key + ' disagrees with its template');
      }
    }
  }
  return canonical;
}

export function uiBlueprintBytes(input) {
  return JSON.stringify(normalizeUiBlueprint(input), null, 2) + '\n';
}

// Accept any supported schema version. v1 is migrated, never silently reinterpreted.
export function readUiBlueprint(input) {
  if (input?.schemaVersion === UI_BLUEPRINT_SCHEMA) {
    return { blueprint: normalizeUiBlueprint(input), migratedFrom: null, notes: [] };
  }
  if (input?.schemaVersion === UI_BLUEPRINT_SCHEMA_V1) {
    const { blueprint, notes } = migrateUiBlueprintV1(input);
    return { blueprint, migratedFrom: UI_BLUEPRINT_SCHEMA_V1, notes };
  }
  fail('unsupported schemaVersion ' + String(input?.schemaVersion ?? 'missing'));
}

// ---------------------------------------------------------------------------------------
// v1 -> v2 migration
// ---------------------------------------------------------------------------------------

function v1Source(node) {
  const source = node.source ?? {};
  const presentation = node.presentation ?? {};
  const relationships = node.relationships ?? {};
  return {
    subjectRef: source.subjectRef,
    buildRef: source.buildRef,
    repositoryRef: source.repositoryRef,
    commit: source.commit,
    componentRef: source.componentRef,
    occurrenceRef: source.occurrenceRef,
    elementRef: source.elementRef,
    surfaceRef: source.surfaceRef,
    screenRefOrNull: source.screenRefOrNull ?? null,
    kind: source.kind,
    label: source.label,
    sourcePathOrNull: source.sourcePathOrNull ?? null,
    styleOrNull: presentation.styleOrNull ?? null,
    slotOrNull: presentation.slotOrNull ?? null,
    layerOrNull: presentation.layerOrNull ?? null,
    textRoleOrNull: presentation.textRoleOrNull ?? null,
    iconOrNull: presentation.iconOrNull ?? null,
    semanticRole: relationships.semanticRole ?? 'ELEMENT',
    intentOrNull: relationships.intentOrNull ?? null,
    actionKeyOrNull: relationships.actionKeyOrNull ?? null,
    callOrNull: relationships.callOrNull ?? null,
    pathwayRefOrNull: relationships.pathwayRefOrNull ?? null,
    navigatesToOrNull: relationships.navigatesToOrNull ?? null,
    visibleWhenOrNull: relationships.visibleWhenOrNull ?? null,
    interactions: presentation.interactions ?? [],
    presenceRefs: relationships.presenceRefs ?? [],
    conditionRefs: relationships.conditionRefs ?? [],
    localizationSourceStringRefs: presentation.localizationSourceStringRefs ?? [],
    accessibilityState: presentation.accessibilityState ?? 'NOT_PROJECTED',
    portable: node.portable ?? { disposition: 'SOURCE_BOUND' },
  };
}

function v1Container(node) {
  const layout = node.authoring?.layout ?? {};
  if (!kindSpec(node.source?.kind).container) return null;
  if (layout.containerMode === 'CONSTRAINT') return { mode: 'FREEFORM' };
  if (layout.flowDirection === 'OVERLAY') return { mode: 'OVERLAY' };
  return { mode: 'STACK', axis: layout.flowDirection === 'HORIZONTAL' ? 'HORIZONTAL' : 'VERTICAL' };
}

function v1Size(value, fallback) {
  if (!value) return { mode: fallback };
  if (value.mode === 'WRAP') return { mode: 'HUG' };
  if (value.mode === 'FIXED') return { mode: 'FIXED', valueOrNull: value.valueOrNull };
  if (value.mode === 'FILL') return { mode: 'FILL' };
  return { mode: fallback };
}

function v1Placement(node) {
  const grid = node.authoring?.layout?.gridPlacement;
  if (!grid) return { type: 'FRACTION', x: { start: 1, end: 23 }, y: { start: 1, end: null } };
  const scale = (value) => Math.round(value * D / 24);
  return {
    type: 'FRACTION',
    x: { start: scale(grid.columnStart), end: scale(grid.columnStart + grid.columnSpan) },
    y: { start: scale(grid.rowStart), end: scale(grid.rowStart + grid.rowSpan) },
  };
}

function migrateV1Nodes(v1Nodes, { notes, rootMode, isTemplate, idPrefix }) {
  const byRef = new Map(v1Nodes.map((node) => [node.nodeRef, node]));
  const parentMode = (node) => {
    if (!node.parentNodeRefOrNull) return isTemplate ? null : rootMode;
    const parent = byRef.get(node.parentNodeRefOrNull);
    return v1Container(parent)?.mode ?? 'STACK';
  };
  const out = [];
  for (const node of v1Nodes) {
    const source = v1Source(node);
    const kindValue = String(source.kind).toUpperCase();
    const spec = kindSpec(kindValue);
    let parentRef = node.parentNodeRefOrNull ?? null;
    let mode = parentMode(node);
    if (spec.overlay && parentRef) {
      notes.push(node.nodeRef + ': ' + spec.label + ' moved to the surface overlay layer (overlays cannot be nested in v2).');
      parentRef = null;
      mode = null;
    } else if (spec.overlay) {
      mode = null;
    }
    if (parentRef && !canContainKind(byRef.get(parentRef)?.source?.kind, kindValue)) {
      notes.push(node.nodeRef + ': ' + kindValue + ' was nested inside a ' + (byRef.get(parentRef)?.source?.kind ?? 'missing') + ' parent that cannot contain it; moved to the surface.');
      parentRef = null;
      mode = isTemplate ? null : rootMode;
    }
    if ((node.authoring?.layout?.constraints ?? []).length) {
      notes.push(node.nodeRef + ': pixel edge constraints dropped (pixel offsets are not portable layout meaning); review its placement.');
    }
    const layout = {
      container: v1Container(node),
      width: v1Size(node.authoring?.layout?.width, spec.defaultWidth),
      height: v1Size(node.authoring?.layout?.height, spec.defaultHeight),
      placement: mode === 'FREEFORM' ? v1Placement(node) : mode === 'OVERLAY' ? { type: 'ANCHOR', anchor: 'TOP_START', inset: 'NONE' } : null,
      depth: mode === 'FREEFORM' || mode === 'OVERLAY' || (!parentRef && spec.overlay) ? (node.authoring?.layout?.depthOrder ?? 0) : 0,
    };
    if (layout.container?.mode === 'FREEFORM' && layout.height.mode !== 'FIXED') layout.height = { mode: 'FIXED', valueOrNull: 240 };
    const seams = defaultSeams(idPrefix + node.nodeRef, kindValue, normalizeSource(source, node.nodeRef + ' source'));
    (node.authoring?.callbackPorts ?? []).forEach((port, index) => {
      const key = normalizeSeamKey(String(port.portRef).replace(/^callback\./u, ''));
      if (!key) return;
      const existing = seams[index];
      if (existing) existing.key = key;
      else seams.push({ seamRef: 's' + (seams.length + 1), trigger: 'ACTIVATE', kind: 'ACTION', key, origin: 'AUTHORED', source: null });
    });
    out.push({
      nodeRef: idPrefix + node.nodeRef,
      parentRef: parentRef ? idPrefix + parentRef : null,
      order: node.siblingOrder ?? 0,
      kind: kindValue,
      source,
      layout,
      behavior: { seams },
    });
  }
  // re-sequence order / depth per sibling group so moved nodes cannot collide
  const groups = new Map();
  for (const node of out) {
    const overlay = !node.parentRef && kindSpec(node.kind).overlay;
    const key = (node.parentRef ?? (overlay ? '#overlay' : '#surface'));
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(node);
  }
  for (const siblings of groups.values()) {
    siblings.sort((a, b) => a.order - b.order || a.nodeRef.localeCompare(b.nodeRef)).forEach((node, index) => { node.order = index; });
    const layered = siblings.filter((node) => node.layout.placement || (!node.parentRef && kindSpec(node.kind).overlay));
    layered.sort((a, b) => a.layout.depth - b.layout.depth || a.order - b.order).forEach((node, index) => { node.layout.depth = index; });
  }
  return out;
}

export function migrateUiBlueprintV1(input) {
  if (!input || input.schemaVersion !== UI_BLUEPRINT_SCHEMA_V1) fail('migration expects ' + UI_BLUEPRINT_SCHEMA_V1);
  const notes = [];
  const rootMode = 'FREEFORM'; // v1 root was always the 24 x 24 ratio grid
  notes.push('Surface migrated as a free-form area because v1 placed every root node on the 24 × 24 ratio grid.');
  const definitions = (input.componentDefinitions ?? []).map((definition) => {
    const nodes = migrateV1Nodes(definition.nodes ?? [], { notes, rootMode: null, isTemplate: true, idPrefix: '' });
    const roots = nodes.filter((node) => !node.parentRef);
    if (roots.length !== 1) fail(definition.definitionRef + ' could not be migrated with exactly one root');
    roots[0].layout.placement = null;
    roots[0].layout.depth = 0;
    return { definitionRef: definition.definitionRef, label: definition.label, version: 1, rootNodeRef: roots[0].nodeRef, nodes, slots: [] };
  });
  const definitionByRef = new Map(definitions.map((row) => [row.definitionRef, row]));
  // collapse intact v1 instance expansions into one INSTANCE node; detach drifted ones
  const v1Nodes = [...(input.nodes ?? [])];
  const byInstance = new Map();
  for (const node of v1Nodes) {
    const instance = node.authoring?.componentInstance;
    if (!instance) continue;
    if (!byInstance.has(instance.instanceRef)) byInstance.set(instance.instanceRef, []);
    byInstance.get(instance.instanceRef).push(node);
  }
  const replaced = new Set();
  const instanceNodes = [];
  for (const [instanceRef, members] of byInstance) {
    const definitionRef = members[0].authoring.componentInstance.definitionRef;
    const definition = definitionByRef.get(definitionRef);
    const templateRefs = new Set(members.map((node) => node.authoring.componentInstance.templateNodeRef));
    const intact = definition && definition.nodes.length === members.length && definition.nodes.every((node) => templateRefs.has(node.nodeRef));
    if (!intact) {
      notes.push(instanceRef + ': instance no longer matched ' + definitionRef + ' and was detached into ordinary nodes.');
      continue;
    }
    const root = members.find((node) => node.authoring.componentInstance.templateNodeRef === definition.rootNodeRef);
    members.forEach((node) => replaced.add(node.nodeRef));
    instanceNodes.push({ root, instanceRef, definitionRef });
  }
  const rootRefs = new Set(instanceNodes.map(({ root }) => root.nodeRef));
  const plain = v1Nodes.filter((node) => !replaced.has(node.nodeRef)).map((node) => {
    if (node.parentNodeRefOrNull && replaced.has(node.parentNodeRefOrNull) && !rootRefs.has(node.parentNodeRefOrNull)) {
      notes.push(node.nodeRef + ': was added inside a component instance; moved to the surface because instances cannot be edited structurally.');
      return { ...node, parentNodeRefOrNull: null, siblingOrder: 100000 + (node.siblingOrder ?? 0) };
    }
    return node;
  });
  const migrated = migrateV1Nodes(
    [...plain, ...instanceNodes.map(({ root }) => root)].map((node) => (replaced.has(node.nodeRef) ? { ...node, authoring: { ...node.authoring, componentInstance: null, callbackPorts: [] } } : node)),
    { notes, rootMode, isTemplate: false, idPrefix: '' },
  );
  for (const { root, definitionRef } of instanceNodes) {
    const node = migrated.find((row) => row.nodeRef === root.nodeRef);
    const definition = definitionByRef.get(definitionRef);
    node.kind = 'INSTANCE';
    node.instance = { definitionRef, definitionVersion: definition.version, textOverrides: [], portBindings: [] };
    delete node.source;
    node.behavior = { seams: [] };
    node.layout.container = null;
  }
  const blueprint = createUiBlueprint({
    blueprintRef: input.blueprintRef,
    label: input.label,
    surface: { container: { mode: rootMode, padding: 'NONE' } },
    preview: { profile: input.preview?.profile === 'WINDOWS' ? 'EXPANDED' : input.preview?.profile === 'CONTAINER' ? 'MEDIUM' : 'COMPACT' },
    nodes: migrated,
    definitions,
  });
  return { blueprint, notes };
}

// [VXG RealForever][VEXWORK][COMPONENT-LIBRARY][A5-UI-BLUEPRINT-V2]
