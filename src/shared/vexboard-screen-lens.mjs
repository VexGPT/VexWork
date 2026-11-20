// Screen Lens: one screen seen through four faces.
//
//                 FRONT                         BACK
//   EXPERIENCE    SURFACE   what is touched     STRUCTURE  where it lives in code
//   BEHAVIOR      BEHAVIOR  what it means       DEPTH      what it touches underneath
//
// The lens is a read-only projection of source-owned meaning. It owns no State,
// lifecycle, identity or execution; it only makes existing relationships
// traversable without duplicate pages or copied subtrees.

import { normalizeExamples, normalizeScreenRealization } from './vexboard-screen-lens-realization.mjs';
import { LAYERS, normalizeScreenLayout } from './vexboard-screen-lens-frames.mjs';

export const SCREEN_LENS_SCHEMA = 'vexboard.screen-lens/v1';

export const LENS_SIDES = Object.freeze({ EXPERIENCE: 'EXPERIENCE', BEHAVIOR: 'BEHAVIOR' });

export const LENS_FACES = Object.freeze({
  SURFACE: Object.freeze({ face: 'SURFACE', side: 'EXPERIENCE', depth: 'FRONT', title: 'Surface', question: 'What does the human see and touch?', flipTo: 'STRUCTURE' }),
  STRUCTURE: Object.freeze({ face: 'STRUCTURE', side: 'EXPERIENCE', depth: 'BACK', title: 'Structure', question: 'Which container, id and declaration is it?', flipTo: 'SURFACE' }),
  BEHAVIOR: Object.freeze({ face: 'BEHAVIOR', side: 'BEHAVIOR', depth: 'FRONT', title: 'Behavior', question: 'What does this interaction mean, and which semantic owner decides it?', flipTo: 'DEPTH' }),
  DEPTH: Object.freeze({ face: 'DEPTH', side: 'BEHAVIOR', depth: 'BACK', title: 'Depth', question: 'What realizes that meaning, which outside truths participate, and how does truth return?', flipTo: 'BEHAVIOR' }),
});

export const LENS_BANDS = Object.freeze({
  EXPERIENCE: Object.freeze({ band: 'EXPERIENCE', label: 'Experience', question: 'what the human meets' }),
  DOORWAY: Object.freeze({ band: 'DOORWAY', label: 'Doorway', question: 'how a touch reaches an owner' }),
  SEMANTIC: Object.freeze({ band: 'SEMANTIC', label: 'Semantic', question: 'what the owner decides' }),
  RUNTIME: Object.freeze({ band: 'RUNTIME', label: 'Runtime', question: 'what runs or realizes meaning' }),
  OUTSIDE: Object.freeze({ band: 'OUTSIDE', label: 'Outside truth', question: 'what reality says' }),
  SUPPORT: Object.freeze({ band: 'SUPPORT', label: 'Beside the path', question: 'construction and chronology' }),
});

// Color is presentation only. Every role also carries a chip so meaning survives
// color-vision differences and high-contrast mode.
export const LENS_ROLES = Object.freeze({
  SCREEN: Object.freeze({ role: 'SCREEN', band: 'EXPERIENCE', chip: 'SCR', label: 'Screen' }),
  CONTAINER: Object.freeze({ role: 'CONTAINER', band: 'EXPERIENCE', chip: 'BOX', label: 'Container' }),
  CONTENT: Object.freeze({ role: 'CONTENT', band: 'EXPERIENCE', chip: 'TXT', label: 'Content' }),
  ELEMENT: Object.freeze({ role: 'ELEMENT', band: 'EXPERIENCE', chip: 'UI', label: 'UI element' }),
  NAVIGATION: Object.freeze({ role: 'NAVIGATION', band: 'EXPERIENCE', chip: 'NAV', label: 'Typed navigation / presentation' }),
  INTENT: Object.freeze({ role: 'INTENT', band: 'DOORWAY', chip: 'INT', label: 'Declared intent' }),
  DISPATCH: Object.freeze({ role: 'DISPATCH', band: 'DOORWAY', chip: 'DSP', label: 'Dispatch / registration' }),
  CONTROL: Object.freeze({ role: 'CONTROL', band: 'SEMANTIC', chip: 'CTL', label: 'Control' }),
  STATE: Object.freeze({ role: 'STATE', band: 'SEMANTIC', chip: 'STA', label: 'State' }),
  ACT: Object.freeze({ role: 'ACT', band: 'SEMANTIC', chip: 'ACT', label: 'Act' }),
  EFFECT: Object.freeze({ role: 'EFFECT', band: 'SEMANTIC', chip: 'EFF', label: 'Effect' }),
  PROJECTION: Object.freeze({ role: 'PROJECTION', band: 'SEMANTIC', chip: 'PRJ', label: 'Projection' }),
  METHOD: Object.freeze({ role: 'METHOD', band: 'RUNTIME', chip: 'MTH', label: 'Bound Method' }),
  RESULT: Object.freeze({ role: 'RESULT', band: 'RUNTIME', chip: 'RES', label: 'Method result' }),
  EXECUTION: Object.freeze({ role: 'EXECUTION', band: 'RUNTIME', chip: 'EXE', label: 'Execution custody' }),
  REALIZATION: Object.freeze({ role: 'REALIZATION', band: 'RUNTIME', chip: 'RZN', label: 'Realization / reconciliation' }),
  CONNECTION: Object.freeze({ role: 'CONNECTION', band: 'RUNTIME', chip: 'CON', label: 'Partner Connection' }),
  CONVERSION: Object.freeze({ role: 'CONVERSION', band: 'RUNTIME', chip: 'CVT', label: 'Provider → Partner conversion' }),
  DECODER: Object.freeze({ role: 'DECODER', band: 'RUNTIME', chip: 'DEC', label: 'Concrete decoder' }),
  RECEIVER: Object.freeze({ role: 'RECEIVER', band: 'RUNTIME', chip: 'RCV', label: 'Partner Receiver' }),
  PARTNER: Object.freeze({ role: 'PARTNER', band: 'OUTSIDE', chip: 'PAR', label: 'Partner' }),
  SOURCE: Object.freeze({ role: 'SOURCE', band: 'OUTSIDE', chip: 'SRC', label: 'Partner Source' }),
  SIGNAL: Object.freeze({ role: 'SIGNAL', band: 'OUTSIDE', chip: 'SIG', label: 'Partner Signal' }),
  STORE: Object.freeze({ role: 'STORE', band: 'OUTSIDE', chip: 'STO', label: 'Store / provider · outside truth' }),
  OBSERVATION: Object.freeze({ role: 'OBSERVATION', band: 'OUTSIDE', chip: 'OBS', label: 'Observation' }),
  CHRONOLOGY: Object.freeze({ role: 'CHRONOLOGY', band: 'SUPPORT', chip: 'LOG', label: 'Chronology' }),
  CONSTRUCTION: Object.freeze({ role: 'CONSTRUCTION', band: 'SUPPORT', chip: 'DI', label: 'Construction' }),
});

// FRAME, SEAM and HANDLE belong to a screen realized as frames of regions divided by seams
// (vexboard-screen-lens-frames.mjs): a frame and a seam are structure, a seam handle is touched.
export const ELEMENT_KINDS = Object.freeze({
  COLUMN: 'CONTAINER', ROW: 'CONTAINER', STACK: 'CONTAINER', CARD: 'CONTAINER', MENU: 'CONTAINER', SHEET: 'CONTAINER', DIALOG: 'CONTAINER', REGION: 'CONTAINER',
  FRAME: 'CONTAINER', SEAM: 'CONTAINER',
  TEXT: 'CONTENT', IMAGE: 'CONTENT',
  TOGGLE: 'ELEMENT', BUTTON: 'ELEMENT', FAB: 'ELEMENT', MENU_ITEM: 'ELEMENT', FIELD: 'ELEMENT', HANDLE: 'ELEMENT',
});
export const ELEMENT_INTERACTIONS = Object.freeze(['ACTIVATE', 'RESIZE', 'COLLAPSE_BEFORE', 'COLLAPSE_AFTER']);

export const PATHWAY_DISPOSITIONS = Object.freeze({
  SCAE_FAMILY: 'Source earns a semantic owner: Control, State, Act, Effect and Projection relationships are explicit.',
  TYPED_PRESENTATION: 'Open / Close / Toggle already says everything; no Behavior is earned.',
  TYPED_NAVIGATION: 'NavigateTo(ScreenId) already says everything; no Act identity is earned.',
  DIRECT_REGISTRATION: 'The registration calls owners directly; no Family has earned this meaning yet.',
  PARTNER_CIRCUIT: 'Source proves an external Partner / Connection / Conversion / Signal / Observation / Receiver path and its return through Store / Family truth without pretending ingress is a Family Control.',
});

export const SCREEN_PLACEMENTS = Object.freeze(['PRIMARY', 'SHARED']);
export const SCREEN_MAPPING = Object.freeze(['MAPPED', 'CHROME_ONLY', 'HELD']);
export const EDGE_KINDS = Object.freeze(['FLOW', 'DATA', 'RETURN', 'SIDE']);
export const BACK = 'BACK';

function fail(message) {
  throw new TypeError(`screen lens: ${message}`);
}

function text(value, label) {
  if (typeof value !== 'string' || !value.trim()) fail(`${label} must be a non-empty string`);
  return value;
}

function optionalText(value, label) {
  if (value === undefined || value === null) return null;
  return text(value, label);
}

function normalizeScreenView(input, screenRef) {
  if (input === undefined || input === null) return null;
  if (!input || typeof input !== 'object') fail(`${screenRef} view must be an object`);
  if (input.kind !== 'STATIC_HTML_CSS') fail(`${screenRef} view kind ${input.kind} is unknown`);
  if (input.scriptPolicy !== 'NONE') fail(`${screenRef} static view scriptPolicy must be NONE`);
  const attribute = (value, label, { required = false } = {}) => {
    if (value === undefined || value === null) {
      if (required) fail(`${label} is required`);
      return null;
    }
    const name = text(value, label);
    if (!/^data-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) fail(`${label} must be a data-* attribute`);
    return name;
  };
  const anchors = input.anchors && typeof input.anchors === 'object' ? input.anchors : {};
  const stateAttribute = (value, label) => {
    const name = text(value, label);
    if (!/^(?:data-[a-z0-9]+(?:-[a-z0-9]+)*|aria-[a-z0-9]+(?:-[a-z0-9]+)*|hidden|open|inert)$/.test(name)) {
      fail(`${label} must be a safe presentation attribute`);
    }
    return name;
  };
  const stateBindings = (input.stateBindings || []).map((binding, bindingIndex) => {
    const presenceRef = text(binding?.presenceRef, `${screenRef} view stateBindings[${bindingIndex}] presenceRef`);
    const value = String(binding?.value ?? '');
    if (!value) fail(`${screenRef} view stateBindings[${bindingIndex}] value is required`);
    const operations = (binding.operations || []).map((operation, operationIndex) => {
      if (operation?.op !== 'SET_ATTRIBUTE' && operation?.op !== 'REMOVE_ATTRIBUTE') {
        fail(`${screenRef} view stateBindings[${bindingIndex}] operation[${operationIndex}] op is unknown`);
      }
      const out = {
        op: operation.op,
        targetRef: text(operation.targetRef, `${screenRef} view stateBindings[${bindingIndex}] operation[${operationIndex}] targetRef`),
        attribute: stateAttribute(operation.attribute, `${screenRef} view stateBindings[${bindingIndex}] operation[${operationIndex}] attribute`),
      };
      if (operation.op === 'SET_ATTRIBUTE') out.value = String(operation.value ?? '');
      return out;
    });
    if (!operations.length) fail(`${screenRef} view stateBindings[${bindingIndex}] needs an operation`);
    return { presenceRef, value, operations };
  });
  const interactionBindings = (input.interactionBindings || []).map((binding, bindingIndex) => {
    const kind = text(binding?.kind, `${screenRef} view interactionBindings[${bindingIndex}] kind`);
    if (kind === 'SPLIT') {
      const styleProperty = text(binding.styleProperty, `${screenRef} view interactionBindings[${bindingIndex}] styleProperty`);
      if (!/^--[a-z0-9]+(?:-[a-z0-9]+)*$/.test(styleProperty)) {
        fail(`${screenRef} view interactionBindings[${bindingIndex}] styleProperty must be a CSS custom property`);
      }
      return {
        kind,
        elementRef: text(binding.elementRef, `${screenRef} view interactionBindings[${bindingIndex}] elementRef`),
        targetRef: text(binding.targetRef, `${screenRef} view interactionBindings[${bindingIndex}] targetRef`),
        beforeRef: text(binding.beforeRef, `${screenRef} view interactionBindings[${bindingIndex}] beforeRef`),
        afterRef: text(binding.afterRef, `${screenRef} view interactionBindings[${bindingIndex}] afterRef`),
        styleProperty,
        collapsedAttribute: stateAttribute(binding.collapsedAttribute, `${screenRef} view interactionBindings[${bindingIndex}] collapsedAttribute`),
        collapsedBeforeValue: text(binding.collapsedBeforeValue, `${screenRef} view interactionBindings[${bindingIndex}] collapsedBeforeValue`),
        collapsedAfterValue: text(binding.collapsedAfterValue, `${screenRef} view interactionBindings[${bindingIndex}] collapsedAfterValue`),
      };
    }
    if (kind === 'SELECT') {
      const options = (binding.options || []).map((entry, optionIndex) => ({
        value: text(entry?.value, `${screenRef} view interactionBindings[${bindingIndex}] options[${optionIndex}] value`),
        outcome: text(entry?.outcome, `${screenRef} view interactionBindings[${bindingIndex}] options[${optionIndex}] outcome`),
      }));
      if (!options.length) fail(`${screenRef} view interactionBindings[${bindingIndex}] SELECT needs options`);
      if (new Set(options.map((entry) => entry.value)).size !== options.length) fail(`${screenRef} view interactionBindings[${bindingIndex}] SELECT option values must be unique`);
      return {
        kind,
        elementRef: text(binding.elementRef, `${screenRef} view interactionBindings[${bindingIndex}] elementRef`),
        presenceRef: text(binding.presenceRef, `${screenRef} view interactionBindings[${bindingIndex}] presenceRef`),
        options,
      };
    }
    if (kind === 'TOGGLE') {
      return {
        kind,
        elementRef: text(binding.elementRef, `${screenRef} view interactionBindings[${bindingIndex}] elementRef`),
        targetRef: text(binding.targetRef, `${screenRef} view interactionBindings[${bindingIndex}] targetRef`),
        presenceRef: text(binding.presenceRef, `${screenRef} view interactionBindings[${bindingIndex}] presenceRef`),
        attribute: stateAttribute(binding.attribute, `${screenRef} view interactionBindings[${bindingIndex}] attribute`),
        closedValue: String(binding.closedValue ?? ''),
        openValue: String(binding.openValue ?? ''),
      };
    }
    fail(`${screenRef} view interactionBindings[${bindingIndex}] kind ${kind} is unknown`);
  });
  let colorMode = null;
  if (input.colorMode !== undefined && input.colorMode !== null) {
    if (!input.colorMode || typeof input.colorMode !== 'object' || Array.isArray(input.colorMode)) {
      fail(`${screenRef} view colorMode must be an object`);
    }
    const options = (input.colorMode.options || []).map((option, optionIndex) => ({
      ref: text(option?.ref, `${screenRef} view colorMode options[${optionIndex}] ref`),
      label: text(option?.label, `${screenRef} view colorMode options[${optionIndex}] label`),
      attributeValue: option?.attributeValue === undefined || option?.attributeValue === null
        ? null
        : text(option.attributeValue, `${screenRef} view colorMode options[${optionIndex}] attributeValue`),
    }));
    if (!options.length) fail(`${screenRef} view colorMode needs options`);
    if (new Set(options.map((option) => option.ref)).size !== options.length) {
      fail(`${screenRef} view colorMode option refs must be unique`);
    }
    const defaultRef = text(input.colorMode.defaultRef, `${screenRef} view colorMode defaultRef`);
    if (!options.some((option) => option.ref === defaultRef)) {
      fail(`${screenRef} view colorMode defaultRef ${defaultRef} is not one of its options`);
    }
    colorMode = {
      owner: text(input.colorMode.owner, `${screenRef} view colorMode owner`),
      source: text(input.colorMode.source, `${screenRef} view colorMode source`),
      attribute: attribute(input.colorMode.attribute, `${screenRef} view colorMode attribute`, { required: true }),
      storageKey: optionalText(input.colorMode.storageKey, `${screenRef} view colorMode storageKey`),
      defaultRef,
      options,
    };
  }
  return {
    kind: 'STATIC_HTML_CSS',
    html: text(input.html, `${screenRef} view html`),
    css: text(input.css, `${screenRef} view css`),
    scriptPolicy: 'NONE',
    htmlSource: optionalText(input.htmlSource, `${screenRef} view htmlSource`),
    cssSource: optionalText(input.cssSource, `${screenRef} view cssSource`),
    anchors: {
      screenAttribute: attribute(anchors.screenAttribute, `${screenRef} view screenAttribute`),
      elementAttribute: attribute(anchors.elementAttribute, `${screenRef} view elementAttribute`, { required: true }),
      structuralAttribute: attribute(anchors.structuralAttribute, `${screenRef} view structuralAttribute`, { required: true }),
      structuralParentAttribute: attribute(anchors.structuralParentAttribute, `${screenRef} view structuralParentAttribute`),
    },
    colorMode,
    stateBindings,
    interactionBindings,
  };
}

function freezeDeep(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(freezeDeep);
    Object.freeze(value);
  }
  return value;
}

function normalizeElement(input, owner, refs) {
  const ref = text(input?.ref, `${owner} element ref`);
  if (refs.has(ref)) fail(`duplicate ref ${ref}`);
  refs.add(ref);
  if (!Object.hasOwn(ELEMENT_KINDS, input.kind)) fail(`${ref} has unknown element kind ${input.kind}`);
  return {
    ref,
    kind: input.kind,
    role: ELEMENT_KINDS[input.kind],
    label: text(input.label, `${ref} label`),
    parentRef: optionalText(input.parentRef, `${ref} parentRef`),
    symbol: optionalText(input.symbol, `${ref} symbol`),
    declared: optionalText(input.declared, `${ref} declared`),
    labelRes: optionalText(input.labelRes, `${ref} labelRes`),
    intent: optionalText(input.intent, `${ref} intent`),
    actionKey: optionalText(input.actionKey, `${ref} actionKey`),
    call: optionalText(input.call, `${ref} call`),
    pathwayRef: optionalText(input.pathwayRef, `${ref} pathwayRef`),
    navigatesTo: optionalText(input.navigatesTo, `${ref} navigatesTo`),
    visibleWhen: optionalText(input.visibleWhen, `${ref} visibleWhen`),
    alwaysVisible: input.alwaysVisible === true,
    slot: optionalText(input.slot, `${ref} slot`),
    textRole: optionalText(input.textRole, `${ref} textRole`),
    icon: optionalText(input.icon, `${ref} icon`),
    style: optionalText(input.style, `${ref} style`),
    // Which plane it is drawn on (content, chrome, transient feedback, modal) and how it is touched,
    // when source says so. Both are optional: a lens generated before them stays valid.
    layer: input.layer === undefined || input.layer === null ? null : (LAYERS.includes(input.layer) ? input.layer : fail(`${ref} layer ${input.layer} is unknown`)),
    interactions: (input.interactions || []).map((value) => (ELEMENT_INTERACTIONS.includes(value) ? value : fail(`${ref} interaction ${value} is unknown`))),
    ownerRef: owner,
  };
}

function checkTree(elements, owner) {
  const byRef = new Map(elements.map((element) => [element.ref, element]));
  for (const element of elements) {
    if (element.parentRef && !byRef.has(element.parentRef)) fail(`${element.ref} parent ${element.parentRef} is not inside ${owner}`);
    const seen = new Set([element.ref]);
    let cursor = element.parentRef ? byRef.get(element.parentRef) : null;
    while (cursor) {
      if (seen.has(cursor.ref)) fail(`containment cycle at ${element.ref}`);
      seen.add(cursor.ref);
      cursor = cursor.parentRef ? byRef.get(cursor.parentRef) : null;
    }
  }
}

export function normalizeScreenLens(input) {
  if (!input || input.schemaVersion !== SCREEN_LENS_SCHEMA) fail(`schemaVersion must be ${SCREEN_LENS_SCHEMA}`);
  const refs = new Set();
  const snapshot = input.sourceSnapshot || {};
  const roots = snapshot.roots && typeof snapshot.roots === 'object' ? { ...snapshot.roots } : {};

  const chrome = (input.chrome || []).map((entry) => {
    const chromeRef = text(entry?.chromeRef, 'chromeRef');
    if (refs.has(chromeRef)) fail(`duplicate ref ${chromeRef}`);
    refs.add(chromeRef);
    if (!SCREEN_PLACEMENTS.includes(entry.appliesTo)) fail(`${chromeRef} appliesTo must be one of ${SCREEN_PLACEMENTS.join(', ')}`);
    const elements = (entry.elements || []).map((element) => normalizeElement(element, chromeRef, refs));
    checkTree(elements, chromeRef);
    return {
      chromeRef,
      label: text(entry.label, `${chromeRef} label`),
      symbol: optionalText(entry.symbol, `${chromeRef} symbol`),
      source: optionalText(entry.source, `${chromeRef} source`),
      appliesTo: entry.appliesTo,
      summary: optionalText(entry.summary, `${chromeRef} summary`),
      elements,
    };
  });

  const screens = (input.screens || []).map((entry) => {
    const screenRef = text(entry?.screenRef, 'screenRef');
    if (refs.has(screenRef)) fail(`duplicate ref ${screenRef}`);
    refs.add(screenRef);
    if (!SCREEN_PLACEMENTS.includes(entry.placement)) fail(`${screenRef} placement must be one of ${SCREEN_PLACEMENTS.join(', ')}`);
    if (!SCREEN_MAPPING.includes(entry.mapped)) fail(`${screenRef} mapped must be one of ${SCREEN_MAPPING.join(', ')}`);
    const elements = (entry.elements || []).map((element) => normalizeElement(element, screenRef, refs));
    checkTree(elements, screenRef);
    return {
      screenRef,
      label: text(entry.label, `${screenRef} label`),
      placement: entry.placement,
      symbol: optionalText(entry.symbol, `${screenRef} symbol`),
      source: optionalText(entry.source, `${screenRef} source`),
      mapped: entry.mapped,
      summary: optionalText(entry.summary, `${screenRef} summary`),
      view: normalizeScreenView(entry.view, screenRef),
      elements,
    };
  });
  if (!screens.length) fail('at least one screen is required');

  const pathways = (input.pathways || []).map((entry) => {
    const pathwayRef = text(entry?.pathwayRef, 'pathwayRef');
    if (refs.has(pathwayRef)) fail(`duplicate ref ${pathwayRef}`);
    refs.add(pathwayRef);
    if (!Object.hasOwn(PATHWAY_DISPOSITIONS, entry.disposition)) fail(`${pathwayRef} has unknown disposition ${entry.disposition}`);
    const nodes = (entry.nodes || []).map((node) => {
      const ref = text(node?.ref, `${pathwayRef} node ref`);
      if (refs.has(ref)) fail(`duplicate ref ${ref}`);
      refs.add(ref);
      if (node.face !== 'BEHAVIOR' && node.face !== 'DEPTH') fail(`${ref} face must be BEHAVIOR or DEPTH`);
      if (!Object.hasOwn(LENS_ROLES, node.role)) fail(`${ref} has unknown role ${node.role}`);
      return {
        ref,
        face: node.face,
        role: node.role,
        label: text(node.label, `${ref} label`),
        symbol: optionalText(node.symbol, `${ref} symbol`),
        summary: optionalText(node.summary, `${ref} summary`),
        source: optionalText(node.source, `${ref} source`),
        code: optionalText(node.code, `${ref} code`),
        pathwayRef,
      };
    });
    if (!nodes.some((node) => node.face === 'BEHAVIOR')) fail(`${pathwayRef} needs at least one BEHAVIOR node`);
    const local = new Set(nodes.map((node) => node.ref));
    const edges = (entry.edges || []).map((edge) => {
      if (!local.has(edge?.from) || !local.has(edge?.to)) fail(`${pathwayRef} edge ${edge?.from} -> ${edge?.to} leaves the pathway`);
      const kind = edge.kind ?? 'FLOW';
      if (!EDGE_KINDS.includes(kind)) fail(`${pathwayRef} edge kind ${kind} is unknown`);
      return { from: edge.from, to: edge.to, label: optionalText(edge.label, `${pathwayRef} edge label`), kind };
    });
    const returnRef = optionalText(entry.returnRef, `${pathwayRef} returnRef`);
    if (returnRef && !local.has(returnRef)) fail(`${pathwayRef} returnRef ${returnRef} is not a pathway node`);
    return {
      pathwayRef,
      label: text(entry.label, `${pathwayRef} label`),
      disposition: entry.disposition,
      summary: optionalText(entry.summary, `${pathwayRef} summary`),
      returns: optionalText(entry.returns, `${pathwayRef} returns`),
      returnRef,
      nodes,
      edges,
    };
  });
  const pathwayRefs = new Set(pathways.map((pathway) => pathway.pathwayRef));
  const screenRefs = new Set(screens.map((screen) => screen.screenRef));
  for (const element of [...chrome.flatMap((entry) => entry.elements), ...screens.flatMap((screen) => screen.elements)]) {
    if (element.pathwayRef && !pathwayRefs.has(element.pathwayRef)) fail(`${element.ref} pathway ${element.pathwayRef} is not defined`);
    if (element.navigatesTo && element.navigatesTo !== BACK && !screenRefs.has(element.navigatesTo)) fail(`${element.ref} navigates to unknown screen ${element.navigatesTo}`);
  }

  const annotations = (input.annotations || []).map((entry) => {
    const ref = text(entry?.ref, 'annotation ref');
    if (refs.has(ref)) fail(`duplicate ref ${ref}`);
    const subjectRef = text(entry.subjectRef, `${ref} subjectRef`);
    if (!refs.has(subjectRef)) fail(`${ref} annotates unknown subject ${subjectRef}`);
    refs.add(ref);
    return { ref, subjectRef, text: text(entry.text, `${ref} text`), detail: optionalText(entry.detail, `${ref} detail`) };
  });

  // Realization and source-authored examples are optional, additive sections: a lens generated
  // before they existed stays valid, and every ref they name must already be a lens ref.
  const lensRefs = new Set([...refs, ...screenRefs]);
  for (const screen of screens) {
    const raw = (input.screens || []).find((entry) => entry.screenRef === screen.screenRef)?.realization;
    screen.realization = normalizeScreenRealization(raw, { screenRef: screen.screenRef, knownRefs: lensRefs });
    if (screen.view?.stateBindings.length) {
      const presenceRefs = new Set(screen.realization?.presence.map((entry) => entry.ref) ?? []);
      for (const binding of screen.view.stateBindings) {
        if (!presenceRefs.has(binding.presenceRef)) fail(`${screen.screenRef} view state binding presence ${binding.presenceRef} is not declared`);
        for (const operation of binding.operations) {
          if (!lensRefs.has(operation.targetRef)) fail(`${screen.screenRef} view state binding target ${operation.targetRef} is not a lens ref`);
        }
      }
    }
    for (const binding of screen.view?.interactionBindings ?? []) {
      if (binding.kind === 'SPLIT') {
        for (const [label, ref] of [['element', binding.elementRef], ['target', binding.targetRef], ['before', binding.beforeRef], ['after', binding.afterRef]]) {
          if (!lensRefs.has(ref)) fail(`${screen.screenRef} view split binding ${label} ${ref} is not a lens ref`);
        }
        const handle = screen.elements.find((element) => element.ref === binding.elementRef);
        if (!handle || handle.kind !== 'HANDLE') fail(`${screen.screenRef} view split binding ${binding.elementRef} is not a HANDLE`);
        if (!handle.interactions.includes('RESIZE')) fail(`${screen.screenRef} view split binding ${binding.elementRef} does not declare RESIZE`);
        continue;
      }
      if (!lensRefs.has(binding.elementRef)) fail(`${screen.screenRef} view ${binding.kind.toLowerCase()} binding element ${binding.elementRef} is not a lens ref`);
      if (binding.kind === 'SELECT') {
        const presence = screen.realization?.presence.find((entry) => entry.ref === binding.presenceRef);
        if (!presence) fail(`${screen.screenRef} view select binding presence ${binding.presenceRef} is not declared`);
        if (presence.kind !== 'SELECTION') fail(`${screen.screenRef} view select binding presence ${binding.presenceRef} is not a SELECTION`);
        const outcomes = new Set([presence.defaultRef, ...(presence.choices ?? []).map((choice) => choice.targetRef)].filter(Boolean));
        for (const option of binding.options) if (!outcomes.has(option.outcome)) fail(`${screen.screenRef} view select option outcome ${option.outcome} is not authored by ${binding.presenceRef}`);
        continue;
      }
      if (binding.kind === 'TOGGLE') {
        if (!lensRefs.has(binding.targetRef)) fail(`${screen.screenRef} view toggle binding target ${binding.targetRef} is not a lens ref`);
        const presence = screen.realization?.presence.find((entry) => entry.ref === binding.presenceRef);
        if (!presence) fail(`${screen.screenRef} view toggle binding presence ${binding.presenceRef} is not declared`);
        if (presence.kind !== 'PRESENTATION') fail(`${screen.screenRef} view toggle binding presence ${binding.presenceRef} is not PRESENTATION`);
      }
    }
    const layout = (input.screens || []).find((entry) => entry.screenRef === screen.screenRef)?.layout;
    screen.layout = normalizeScreenLayout(layout, { screenRef: screen.screenRef, elements: screen.elements });
  }
  const examples = normalizeExamples(input.examples, { knownRefs: lensRefs });
  const examplesHeld = (input.examplesHeld || []).map((entry) => ({ ref: optionalText(entry.ref, 'examplesHeld ref'), source: optionalText(entry.source, 'examplesHeld source'), reason: text(entry.reason, 'examplesHeld reason') }));

  const entryScreenRef = text(input.entryScreenRef ?? screens[0].screenRef, 'entryScreenRef');
  if (!screenRefs.has(entryScreenRef)) fail(`entryScreenRef ${entryScreenRef} is not a screen`);
  const entryElementRef = optionalText(input.entryElementRef, 'entryElementRef');
  if (entryElementRef && !refs.has(entryElementRef)) fail(`entryElementRef ${entryElementRef} is unknown`);

  return freezeDeep({
    schemaVersion: SCREEN_LENS_SCHEMA,
    lensRef: text(input.lensRef, 'lensRef'),
    title: text(input.title, 'title'),
    summary: optionalText(input.summary, 'summary'),
    entryScreenRef,
    entryElementRef,
    relatedBoardRefs: [...(input.relatedBoardRefs || [])],
    sourceSnapshot: {
      repositoryRef: optionalText(snapshot.repositoryRef, 'sourceSnapshot.repositoryRef'),
      repositoryUrl: optionalText(snapshot.repositoryUrl, 'sourceSnapshot.repositoryUrl'),
      commit: optionalText(snapshot.commit, 'sourceSnapshot.commit'),
      observedAt: optionalText(snapshot.observedAt, 'sourceSnapshot.observedAt'),
      roots,
      notes: [...(snapshot.notes || [])],
    },
    chrome,
    screens,
    pathways,
    annotations,
    examples,
    examplesHeld,
  });
}

export function roleFor(role) {
  const value = LENS_ROLES[role];
  if (!value) fail(`unknown role ${role}`);
  return value;
}

export function screenFor(lens, screenRef) {
  const screen = lens.screens.find((candidate) => candidate.screenRef === screenRef);
  if (!screen) fail(`unknown screen ${screenRef}`);
  return screen;
}

export function chromeForScreen(lens, screenRef) {
  const screen = screenFor(lens, screenRef);
  return lens.chrome.filter((entry) => entry.appliesTo === screen.placement);
}

// Elements a human can reach on this screen: the screen's own tree plus chrome
// owned elsewhere. Chrome that is not applied here can still contribute elements
// marked alwaysVisible (for example a toolbar Back).
export function elementsForScreen(lens, screenRef) {
  const screen = screenFor(lens, screenRef);
  const applied = new Set(chromeForScreen(lens, screenRef).map((entry) => entry.chromeRef));
  const chromeElements = [];
  for (const entry of lens.chrome) {
    if (applied.has(entry.chromeRef)) chromeElements.push(...entry.elements);
    else chromeElements.push(...alwaysVisibleClosure(entry.elements));
  }
  return [...chromeElements, ...screen.elements];
}

function alwaysVisibleClosure(elements) {
  const byRef = new Map(elements.map((element) => [element.ref, element]));
  const keep = new Set();
  for (const element of elements) {
    if (!element.alwaysVisible) continue;
    let cursor = element;
    while (cursor) {
      keep.add(cursor.ref);
      cursor = cursor.parentRef ? byRef.get(cursor.parentRef) : null;
    }
  }
  return elements.filter((element) => keep.has(element.ref));
}

export function elementFor(lens, elementRef) {
  for (const owner of [...lens.chrome, ...lens.screens]) {
    const found = owner.elements.find((element) => element.ref === elementRef);
    if (found) return found;
  }
  return null;
}

export function elementTree(elements) {
  const nodes = new Map(elements.map((element) => [element.ref, { element, children: [] }]));
  const roots = [];
  for (const element of elements) {
    const node = nodes.get(element.ref);
    const parent = element.parentRef ? nodes.get(element.parentRef) : null;
    if (parent) parent.children.push(node);
    else roots.push(node);
  }
  return roots;
}

export function elementPath(lens, elementRef) {
  const path = [];
  let cursor = elementFor(lens, elementRef);
  if (!cursor) fail(`unknown element ${elementRef}`);
  while (cursor) {
    path.unshift(cursor);
    cursor = cursor.parentRef ? elementFor(lens, cursor.parentRef) : null;
  }
  return path;
}

export function pathwayFor(lens, pathwayRef) {
  if (!pathwayRef) return null;
  return lens.pathways.find((pathway) => pathway.pathwayRef === pathwayRef) ?? null;
}

export function pathwayForElement(lens, elementRef) {
  const element = elementFor(lens, elementRef);
  return element ? pathwayFor(lens, element.pathwayRef) : null;
}

export function elementsUsingPathway(lens, pathwayRef) {
  return [...lens.chrome, ...lens.screens]
    .flatMap((owner) => owner.elements)
    .filter((element) => element.pathwayRef === pathwayRef);
}

// One face of one pathway: its nodes, the edges inside the face, and ports for
// edges that continue on the other face so a human knows a flip is waiting.
export function faceGraph(pathway, face, { hideBands = [] } = {}) {
  if (face !== 'BEHAVIOR' && face !== 'DEPTH') fail(`faceGraph face must be BEHAVIOR or DEPTH, got ${face}`);
  if (!pathway) return freezeDeep({ face, nodes: [], edges: [], portsIn: [], portsOut: [], hidden: [] });
  const hiddenBands = new Set(hideBands);
  const byRef = new Map(pathway.nodes.map((node) => [node.ref, node]));
  const onFace = pathway.nodes.filter((node) => node.face === face);
  const hidden = onFace.filter((node) => hiddenBands.has(LENS_ROLES[node.role].band));
  const nodes = onFace.filter((node) => !hiddenBands.has(LENS_ROLES[node.role].band));
  const inside = new Set(nodes.map((node) => node.ref));
  const edges = pathway.edges.filter((edge) => inside.has(edge.from) && inside.has(edge.to));
  const crosses = (ref) => byRef.get(ref).face !== face;
  const portsIn = pathway.edges
    .filter((edge) => inside.has(edge.to) && crosses(edge.from))
    .map((edge) => ({ ...edge, otherFace: byRef.get(edge.from).face, otherLabel: byRef.get(edge.from).label }));
  const portsOut = pathway.edges
    .filter((edge) => inside.has(edge.from) && crosses(edge.to))
    .map((edge) => ({ ...edge, otherFace: byRef.get(edge.to).face, otherLabel: byRef.get(edge.to).label }));
  return freezeDeep({ face, nodes, edges, portsIn, portsOut, hidden });
}

// Screen map for traversal: chrome owners and screen-owned routes become one
// node each, destinations appear once, and screens no route reaches yet are
// listed separately instead of floating as disconnected nodes.
export function screenMapGraph(lens) {
  const graph = screenGraph(lens);
  const labelOf = new Map(lens.screens.map((screen) => [screen.screenRef, screen.label]));
  const linked = new Set();
  const owners = new Map();
  for (const route of graph.routes) {
    linked.add(route.toScreenRef);
    if (!owners.has(route.ownerRef)) owners.set(route.ownerRef, route);
    if (labelOf.has(route.ownerRef)) linked.add(route.ownerRef);
  }
  const nodes = [];
  for (const entry of lens.chrome) {
    const route = owners.get(entry.chromeRef);
    if (!route) continue;
    nodes.push({
      ref: entry.chromeRef,
      kind: 'CHROME',
      label: `${entry.label} · ${entry.appliesTo.toLowerCase()} chrome`,
      summary: `One owner, shown on ${route.fromScreenRefs.map((ref) => labelOf.get(ref)).join(', ')}`,
    });
  }
  for (const screen of lens.screens) {
    if (!linked.has(screen.screenRef)) continue;
    nodes.push({ ref: screen.screenRef, kind: 'SCREEN', label: screen.label, summary: `${screen.placement.toLowerCase()} · ${screen.mapped.toLowerCase().replace('_', ' ')}`, placement: screen.placement, mapped: screen.mapped });
  }
  const grouped = new Map();
  for (const route of graph.routes) {
    const key = `${route.ownerRef}->${route.toScreenRef}`;
    if (!grouped.has(key)) grouped.set(key, { from: route.ownerRef, to: route.toScreenRef, labels: [] });
    grouped.get(key).labels.push(route.viaLabel);
  }
  const edges = [...grouped.values()].map((entry) => ({ from: entry.from, to: entry.to, label: entry.labels.join(' · '), kind: 'FLOW' }));
  const unreachable = lens.screens.filter((screen) => !linked.has(screen.screenRef)).map((screen) => screen.screenRef);
  return freezeDeep({ nodes, edges, unreachable });
}

export function pathwayEntryRef(pathway) {
  if (!pathway) return null;
  const behavior = faceGraph(pathway, 'BEHAVIOR');
  const targets = new Set(behavior.edges.map((edge) => edge.to));
  return (behavior.nodes.find((node) => !targets.has(node.ref)) ?? behavior.nodes[0]).ref;
}

export function annotationsFor(lens, subjectRef) {
  return lens.annotations.filter((annotation) => annotation.subjectRef === subjectRef);
}

export function sourceUrl(lens, source) {
  if (!source) return null;
  const snapshot = lens.sourceSnapshot;
  const match = /^([a-z][a-z0-9-]*):(.+)$/.exec(source);
  const path = match && Object.hasOwn(snapshot.roots, match[1]) ? `${snapshot.roots[match[1]]}${match[2]}` : source;
  if (!snapshot.repositoryUrl || !snapshot.commit) return null;
  return `${snapshot.repositoryUrl.replace(/\/$/, '')}/blob/${snapshot.commit}/${path}`;
}

export function sourcePath(lens, source) {
  if (!source) return null;
  const match = /^([a-z][a-z0-9-]*):(.+)$/.exec(source);
  return match && Object.hasOwn(lens.sourceSnapshot.roots, match[1]) ? `${lens.sourceSnapshot.roots[match[1]]}${match[2]}` : source;
}

// Screen map: every screen appears exactly once. A route owned by chrome is one
// route group with many origins, never a copy nested under each origin screen.
export function screenGraph(lens) {
  const routes = [];
  const add = (fromScreenRefs, element, ownerRef) => {
    if (!element.navigatesTo || element.navigatesTo === BACK) return;
    routes.push({
      routeRef: `${ownerRef}:${element.ref}`,
      ownerRef,
      viaElementRef: element.ref,
      viaLabel: element.label,
      fromScreenRefs,
      toScreenRef: element.navigatesTo,
    });
  };
  for (const entry of lens.chrome) {
    const origins = lens.screens.filter((screen) => screen.placement === entry.appliesTo).map((screen) => screen.screenRef);
    for (const element of entry.elements) add(origins, element, entry.chromeRef);
  }
  for (const screen of lens.screens) {
    for (const element of screen.elements) add([screen.screenRef], element, screen.screenRef);
  }
  const screens = lens.screens.map((screen) => ({
    screenRef: screen.screenRef,
    label: screen.label,
    placement: screen.placement,
    mapped: screen.mapped,
    inboundRouteCount: routes.filter((route) => route.toScreenRef === screen.screenRef).length,
    inboundOriginCount: new Set(routes.filter((route) => route.toScreenRef === screen.screenRef).flatMap((route) => route.fromScreenRefs)).size,
  }));
  return freezeDeep({ screens, routes });
}

export function screenNeighborhood(lens, screenRef) {
  screenFor(lens, screenRef);
  const graph = screenGraph(lens);
  return freezeDeep({
    outbound: graph.routes.filter((route) => route.fromScreenRefs.includes(screenRef) && route.toScreenRef !== screenRef),
    inbound: graph.routes.filter((route) => route.toScreenRef === screenRef),
  });
}

// Walk stack. Camera movement never appends; only explicit traversal does.
// A -> B -> A stays real history: the second visit to A is not discarded.
export function createScreenWalk(lens, startScreenRef = lens.entryScreenRef) {
  screenFor(lens, startScreenRef);
  return freezeDeep({ steps: [{ sequence: 1, screenRef: startScreenRef, viaElementRef: null, how: 'START' }] });
}

export function currentWalkScreen(walk) {
  return walk.steps[walk.steps.length - 1].screenRef;
}

export function advanceScreenWalk(lens, walk, { toScreenRef, viaElementRef = null, how = 'NAVIGATE' }) {
  if (!['NAVIGATE', 'JUMP', 'REVISIT'].includes(how)) fail(`walk step how must be NAVIGATE, JUMP or REVISIT, got ${how}`);
  screenFor(lens, toScreenRef);
  if (viaElementRef && !elementFor(lens, viaElementRef)) fail(`walk step via unknown element ${viaElementRef}`);
  const last = walk.steps[walk.steps.length - 1];
  if (last.screenRef === toScreenRef && how !== 'REVISIT') return walk;
  return freezeDeep({
    steps: [...walk.steps, { sequence: last.sequence + 1, screenRef: toScreenRef, viaElementRef, how }],
  });
}

export function backScreenWalk(walk) {
  if (walk.steps.length <= 1) return walk;
  return freezeDeep({ steps: walk.steps.slice(0, -1) });
}

export function revisitScreenWalk(lens, walk, sequence) {
  const step = walk.steps.find((candidate) => candidate.sequence === sequence);
  if (!step) fail(`walk has no step ${sequence}`);
  return advanceScreenWalk(lens, walk, { toScreenRef: step.screenRef, how: 'REVISIT' });
}

export function walkVisitCounts(walk) {
  const counts = new Map();
  for (const step of walk.steps) counts.set(step.screenRef, (counts.get(step.screenRef) || 0) + 1);
  return counts;
}

// [VXG RealForever][VEXWORK][VEXBOARD][SCREEN-LENS][MODEL]
