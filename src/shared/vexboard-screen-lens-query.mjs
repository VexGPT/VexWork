// Screen Lens queries: answer "where is this?", "what depends on this?" and
// "what is the current state of this screen?" from an already-normalized lens.
//
// Every function here is read-only and deterministic. Nothing ranks, scores or
// summarizes in a way that becomes truth: results always point back to the
// lens refs and, through them, to pinned source.

import {
  BACK,
  LENS_BANDS,
  LENS_FACES,
  LENS_ROLES,
  PATHWAY_DISPOSITIONS,
  annotationsFor,
  elementFor,
  elementPath,
  elementsForScreen,
  elementsUsingPathway,
  faceGraph,
  pathwayFor,
  screenFor,
  screenNeighborhood,
  sourcePath,
  sourceUrl,
} from './vexboard-screen-lens.mjs';

export const SEARCH_KINDS = Object.freeze(['ELEMENT', 'STEP', 'SCREEN', 'PATHWAY', 'NOTE']);
export const DISPOSITION_LABELS = Object.freeze({
  SCAE_FAMILY: 'SCAE semantic owner',
  TYPED_PRESENTATION: 'Typed presentation',
  TYPED_NAVIGATION: 'Typed navigation',
  DIRECT_REGISTRATION: 'Direct registration',
});

function fail(message) {
  throw new TypeError(`screen lens query: ${message}`);
}

const lower = (value) => String(value ?? '').toLowerCase();

export function findStep(lens, ref) {
  for (const pathway of lens.pathways) {
    const node = pathway.nodes.find((candidate) => candidate.ref === ref);
    if (node) return { pathway, node };
  }
  return null;
}

// Screens on which a human can meet this element. Chrome elements belong to
// one owner but appear on every screen their placement rule covers.
export function screensForElement(lens, elementRef) {
  if (!elementFor(lens, elementRef)) fail(`unknown element ${elementRef}`);
  return lens.screens
    .filter((screen) => elementsForScreen(lens, screen.screenRef).some((element) => element.ref === elementRef))
    .map((screen) => screen.screenRef);
}

function prefer(list, preferred) {
  return preferred && list.includes(preferred) ? preferred : (list[0] ?? null);
}

// Where to take the reader when a result is chosen: the screen, the control
// to anchor, and the step to select. Prefers the screen the reader is on.
export function targetFor(lens, kind, ref, currentScreenRef = null) {
  if (kind === 'SCREEN') {
    screenFor(lens, ref);
    return Object.freeze({ screenRef: ref, elementRef: null, pathwayRef: null, nodeRef: null });
  }
  if (kind === 'ELEMENT') {
    const element = elementFor(lens, ref);
    if (!element) fail(`unknown element ${ref}`);
    return Object.freeze({ screenRef: prefer(screensForElement(lens, ref), currentScreenRef), elementRef: ref, pathwayRef: element.pathwayRef, nodeRef: null });
  }
  if (kind === 'PATHWAY' || kind === 'STEP') {
    const found = kind === 'STEP' ? findStep(lens, ref) : null;
    const pathway = kind === 'STEP' ? found?.pathway : pathwayFor(lens, ref);
    if (!pathway) fail(`unknown ${kind.toLowerCase()} ${ref}`);
    const users = elementsUsingPathway(lens, pathway.pathwayRef);
    const onCurrent = currentScreenRef ? users.find((element) => screensForElement(lens, element.ref).includes(currentScreenRef)) : null;
    const anchor = onCurrent ?? users[0] ?? null;
    return Object.freeze({
      screenRef: anchor ? prefer(screensForElement(lens, anchor.ref), currentScreenRef) : null,
      elementRef: anchor?.ref ?? null,
      pathwayRef: pathway.pathwayRef,
      nodeRef: kind === 'STEP' ? ref : null,
    });
  }
  if (kind === 'NOTE') {
    const note = lens.annotations.find((annotation) => annotation.ref === ref);
    if (!note) fail(`unknown note ${ref}`);
    const subject = note.subjectRef;
    if (lens.screens.some((screen) => screen.screenRef === subject)) return targetFor(lens, 'SCREEN', subject, currentScreenRef);
    if (elementFor(lens, subject)) return targetFor(lens, 'ELEMENT', subject, currentScreenRef);
    if (findStep(lens, subject)) return targetFor(lens, 'STEP', subject, currentScreenRef);
    if (pathwayFor(lens, subject)) return targetFor(lens, 'PATHWAY', subject, currentScreenRef);
    return Object.freeze({ screenRef: null, elementRef: null, pathwayRef: null, nodeRef: null });
  }
  return fail(`unknown kind ${kind}`);
}

function searchEntries(lens) {
  const entries = [];
  for (const screen of lens.screens) {
    entries.push({ kind: 'SCREEN', ref: screen.screenRef, role: 'SCREEN', label: screen.label, detail: screen.screenRef, ids: [screen.screenRef, screen.symbol], text: [screen.label, sourcePath(lens, screen.source), screen.summary] });
  }
  for (const owner of [...lens.chrome, ...lens.screens]) {
    for (const element of owner.elements) {
      entries.push({ kind: 'ELEMENT', ref: element.ref, role: element.role, label: element.label, detail: element.actionKey ?? element.ref, ids: [element.ref, element.symbol, element.actionKey, element.labelRes], text: [element.label, element.declared, element.intent, element.call] });
    }
  }
  for (const pathway of lens.pathways) {
    entries.push({ kind: 'PATHWAY', ref: pathway.pathwayRef, role: pathway.nodes[0].role, label: pathway.label, detail: DISPOSITION_LABELS[pathway.disposition], ids: [pathway.pathwayRef, pathway.disposition], text: [pathway.label, pathway.summary] });
    for (const node of pathway.nodes) {
      entries.push({ kind: 'STEP', ref: node.ref, role: node.role, label: node.label, detail: node.symbol ?? node.ref, ids: [node.ref, node.symbol], text: [node.label, sourcePath(lens, node.source), node.summary, node.code] });
    }
  }
  for (const note of lens.annotations) {
    entries.push({ kind: 'NOTE', ref: note.ref, role: null, label: note.text, detail: note.subjectRef, ids: [note.ref, note.subjectRef], text: [note.text, note.detail] });
  }
  return entries;
}

// Every query token must appear somewhere in the entry. Identifiers win over
// prose: an exact ref, symbol or action key ranks first, then a label that
// starts with the query, then any identifier containing it, then prose.
export function searchLens(lens, query, { limit = 40, currentScreenRef = null } = {}) {
  const phrase = lower(query).trim();
  const tokens = phrase.split(/\s+/).filter(Boolean);
  if (!tokens.length) return Object.freeze([]);
  const results = [];
  searchEntries(lens).forEach((entry, order) => {
    const ids = entry.ids.filter(Boolean).map(lower);
    const text = entry.text.filter(Boolean).map(lower);
    const label = lower(entry.label);
    const haystack = [...ids, ...text].join('\n');
    if (!tokens.every((token) => haystack.includes(token))) return;
    let score = 10;
    let field = 'text';
    if (ids.some((id) => id === phrase)) { score = 100; field = 'id'; }
    else if (label === phrase) { score = 90; field = 'label'; }
    else if (label.startsWith(phrase)) { score = 80; field = 'label'; }
    else if (ids.some((id) => id.includes(phrase))) { score = 60; field = 'id'; }
    else if (label.includes(phrase)) { score = 50; field = 'label'; }
    else if (text.some((value) => value.includes(phrase))) { score = 30; field = 'text'; }
    results.push({ ...entry, score, field, order, ids: undefined, text: undefined });
  });
  results.sort((a, b) => b.score - a.score || SEARCH_KINDS.indexOf(a.kind) - SEARCH_KINDS.indexOf(b.kind) || a.order - b.order);
  return Object.freeze(results.slice(0, limit).map((result) => Object.freeze({
    kind: result.kind,
    ref: result.ref,
    role: result.role,
    label: result.label,
    detail: result.detail,
    field: result.field,
    score: result.score,
    target: targetFor(lens, result.kind, result.ref, currentScreenRef),
  })));
}

const UNDERNEATH_BANDS = new Set(['RUNTIME', 'OUTSIDE', 'SUPPORT']);

// What a change here could reach. For a control: the screens it appears on,
// the controls sharing its pathway, and the outside truth that pathway touches.
// For a step: every control (and screen) that reaches it, plus steps in other
// pathways that share its symbol or source file.
export function impactOf(lens, ref) {
  const element = elementFor(lens, ref);
  if (element) {
    const pathway = pathwayFor(lens, element.pathwayRef);
    return Object.freeze({
      kind: 'ELEMENT',
      ref,
      screenRefs: Object.freeze(screensForElement(lens, ref)),
      pathwayRef: pathway?.pathwayRef ?? null,
      sharesPathwayWith: Object.freeze(pathway ? elementsUsingPathway(lens, pathway.pathwayRef).filter((other) => other.ref !== ref).map((other) => other.ref) : []),
      touches: Object.freeze(pathway ? pathway.nodes.filter((node) => UNDERNEATH_BANDS.has(LENS_ROLES[node.role].band)).map((node) => node.ref) : []),
    });
  }
  const found = findStep(lens, ref);
  if (!found) fail(`impact needs an element or pathway step, got ${ref}`);
  const { pathway, node } = found;
  const users = elementsUsingPathway(lens, pathway.pathwayRef);
  const reachedFrom = users.map((user) => Object.freeze({ elementRef: user.ref, screenRefs: Object.freeze(screensForElement(lens, user.ref)) }));
  const elsewhere = lens.pathways.filter((other) => other.pathwayRef !== pathway.pathwayRef).flatMap((other) => other.nodes);
  return Object.freeze({
    kind: 'STEP',
    ref,
    pathwayRef: pathway.pathwayRef,
    reachedFrom: Object.freeze(reachedFrom),
    screenRefs: Object.freeze([...new Set(reachedFrom.flatMap((entry) => entry.screenRefs))]),
    sameSymbol: Object.freeze(node.symbol ? elsewhere.filter((other) => other.symbol === node.symbol).map((other) => other.ref) : []),
    sameSource: Object.freeze(node.source ? elsewhere.filter((other) => other.source === node.source).map((other) => other.ref) : []),
  });
}

// How much of a screen this lens can explain. "Traced" means a control has a
// pathway; it does not mean that pathway is proven or current.
export function screenCoverage(lens, screenRef) {
  const screen = screenFor(lens, screenRef);
  const interactive = elementsForScreen(lens, screenRef).filter((element) => element.role === 'ELEMENT');
  const untraced = interactive.filter((element) => !element.pathwayRef).map((element) => element.ref);
  return Object.freeze({
    screenRef,
    mapped: screen.mapped,
    contentProjected: screen.mapped === 'MAPPED',
    interactive: interactive.length,
    traced: interactive.length - untraced.length,
    untraced: Object.freeze(untraced),
  });
}

/* ---------- briefs ---------- */

const code = (value) => (value ? `\`${value}\`` : null);
const join = (parts, separator = ' · ') => parts.filter(Boolean).join(separator);

function sourceLine(lens, source) {
  if (!source) return null;
  const url = sourceUrl(lens, source);
  return url ? `${sourcePath(lens, source)} (${url})` : sourcePath(lens, source);
}

function elementLine(lens, element) {
  const pathway = pathwayFor(lens, element.pathwayRef);
  const intent = element.intent ? `${element.intent}${element.actionKey ? ` → ${element.actionKey}` : ''}${element.navigatesTo && element.navigatesTo !== BACK ? ` → ${element.navigatesTo}` : ''}` : null;
  return `- ${element.label} ${code(element.ref)}${element.declared ? ` — ${element.declared}` : ''}${intent ? ` — ${intent}` : ''}${pathway ? ` — pathway: ${pathway.label} (${DISPOSITION_LABELS[pathway.disposition]})` : ' — no pathway projected'}`;
}

function notesFor(lens, refs) {
  const lines = [];
  for (const ref of refs) for (const note of annotationsFor(lens, ref)) lines.push(`- ${note.text} (${ref}): ${note.detail ?? ''}`.trimEnd());
  return lines;
}

function pathwaySection(lens, pathway) {
  const lines = [`### ${pathway.label} · ${DISPOSITION_LABELS[pathway.disposition]}`, ''];
  if (pathway.summary) lines.push(pathway.summary, '');
  if (pathway.returns) lines.push(`Returns to the human: ${pathway.returns}`, '');
  for (const face of ['BEHAVIOR', 'DEPTH']) {
    const graph = faceGraph(pathway, face);
    lines.push(`${LENS_FACES[face].title} face (${LENS_FACES[face].question}):`);
    if (!graph.nodes.length) lines.push('- no deeper realization or outside-truth relationship is projected for this pathway');
    for (const node of graph.nodes) {
      const role = LENS_ROLES[node.role];
      lines.push(`- [${role.chip} ${role.label}] ${node.label} ${code(node.ref)}${node.symbol ? ` — ${code(node.symbol)}` : ''}${node.source ? ` — ${sourcePath(lens, node.source)}` : ''}`);
      if (node.summary) lines.push(`  ${node.summary}`);
    }
    lines.push('');
  }
  if (pathway.edges.length) {
    lines.push('Relationships:');
    for (const edge of pathway.edges) lines.push(`- ${edge.from} —${edge.label ? ` ${edge.label}` : ''}${edge.kind !== 'FLOW' ? ` (${edge.kind})` : ''} → ${edge.to}`);
    lines.push('');
  }
  const notes = notesFor(lens, [pathway.pathwayRef, ...pathway.nodes.map((node) => node.ref)]);
  if (notes.length) lines.push('Notes:', ...notes, '');
  return lines;
}

function headerLines(lens, lensUrl) {
  const snapshot = lens.sourceSnapshot;
  const commit = snapshot.commit ? snapshot.commit.slice(0, 7) : 'unpinned';
  return [
    `- projection: read-only Screen Lens ${code(lens.lensRef)}; current source owns behavior`,
    `- source snapshot: ${snapshot.repositoryRef ?? snapshot.repositoryUrl ?? 'unknown'} @ ${commit}${snapshot.repositoryUrl && snapshot.commit ? ` (${snapshot.repositoryUrl}/tree/${snapshot.commit})` : ''}`,
    lensUrl ? `- open in the lens: ${lensUrl}` : null,
  ].filter(Boolean);
}

function reachLines(lens, screenRef) {
  const near = screenNeighborhood(lens, screenRef);
  const label = (ref) => screenFor(lens, ref).label;
  const owner = (ref) => lens.chrome.find((entry) => entry.chromeRef === ref)?.label ?? label(ref);
  const inbound = near.inbound.map((route) => `${route.viaLabel} ${code(route.viaElementRef)} owned by ${owner(route.ownerRef)}, shown on ${route.fromScreenRefs.map(label).join(', ')}`);
  const outbound = near.outbound.map((route) => `${route.viaLabel} → ${label(route.toScreenRef)}`);
  return [
    `- reached from: ${inbound.length ? inbound.join('; ') : 'no projected route'}`,
    `- leads to: ${outbound.length ? outbound.join('; ') : 'no projected route'}`,
  ];
}

function heldLines(lens, screenRef) {
  const coverage = screenCoverage(lens, screenRef);
  const lines = [];
  if (!coverage.contentProjected) lines.push(`- ${screenFor(lens, screenRef).label} content is ${coverage.mapped === 'CHROME_ONLY' ? 'held; only shared chrome is projected' : 'not projected yet'}`);
  for (const ref of coverage.untraced) lines.push(`- ${elementFor(lens, ref).label} ${code(ref)} has no pathway yet; its deeper relationship is not currently projected`);
  const unprojected = lens.screens.filter((screen) => screen.mapped === 'HELD').map((screen) => screen.label);
  if (unprojected.length) lines.push(`- screens not projected in this lens: ${unprojected.join(', ')}`);
  for (const note of lens.sourceSnapshot.notes) lines.push(`- ${note}`);
  return lines;
}

// A paste-ready summary for a fresh human or AI: identities, roles, source
// coordinates and what is still held. It describes the lens; it is not a
// second source of truth and should be regenerated rather than edited.
export function screenBrief(lens, screenRef, { lensUrl = null } = {}) {
  const screen = screenFor(lens, screenRef);
  const coverage = screenCoverage(lens, screenRef);
  const elements = elementsForScreen(lens, screenRef);
  const controls = elements.filter((element) => element.role === 'ELEMENT');
  const pathways = [...new Map(controls.filter((element) => element.pathwayRef).map((element) => [element.pathwayRef, pathwayFor(lens, element.pathwayRef)])).values()];
  const chrome = lens.chrome.filter((entry) => elements.some((element) => element.ownerRef === entry.chromeRef));
  const lines = [
    `# Screen brief: ${screen.label}`,
    '',
    `- screen: ${code(screen.screenRef)}${screen.symbol ? ` (${code(screen.symbol)})` : ''}, ${screen.placement.toLowerCase()}, ${screen.mapped.replace('_', ' ').toLowerCase()}`,
    screen.source ? `- source: ${sourceLine(lens, screen.source)}` : null,
    ...headerLines(lens, lensUrl),
    ...reachLines(lens, screenRef),
    `- chrome here: ${chrome.length ? chrome.map((entry) => `${entry.label} (${entry.appliesTo === screen.placement ? 'applies' : 'always-visible controls only'})`).join(', ') : 'none'}`,
    `- controls traced: ${coverage.traced} of ${coverage.interactive}`,
    '',
  ].filter((line) => line !== null);
  if (screen.summary) lines.push(screen.summary, '');
  lines.push('## Controls', '');
  if (!controls.length) lines.push('- none projected');
  for (const element of controls) lines.push(elementLine(lens, element));
  lines.push('');
  if (pathways.length) {
    lines.push('## Pathways', '');
    for (const pathway of pathways) lines.push(...pathwaySection(lens, pathway));
  }
  const notes = notesFor(lens, [screen.screenRef, ...elements.map((element) => element.ref)]);
  if (notes.length) lines.push('## Notes', '', ...notes, '');
  lines.push('## Held or not projected', '', ...heldLines(lens, screenRef), '');
  return lines.join('\n');
}

export function controlBrief(lens, elementRef, { screenRef = null, lensUrl = null } = {}) {
  const element = elementFor(lens, elementRef);
  if (!element) fail(`unknown element ${elementRef}`);
  const screens = screensForElement(lens, elementRef);
  const onScreen = prefer(screens, screenRef);
  const pathway = pathwayFor(lens, element.pathwayRef);
  const impact = impactOf(lens, elementRef);
  const owner = lens.chrome.find((entry) => entry.chromeRef === element.ownerRef) ?? screenFor(lens, element.ownerRef);
  const label = (ref) => screenFor(lens, ref).label;
  const step = (ref) => findStep(lens, ref).node;
  const lines = [
    `# Control brief: ${element.label}${onScreen ? ` on ${label(onScreen)}` : ''}`,
    '',
    `- element: ${code(element.ref)} (${element.kind.toLowerCase().replace('_', ' ')})`,
    `- owner: ${owner.symbol ?? owner.label}${owner.source ? ` — ${sourceLine(lens, owner.source)}` : ''}`,
    `- container path: ${elementPath(lens, elementRef).map((entry) => entry.label).join(' › ')}`,
    `- appears on: ${screens.length ? screens.map(label).join(', ') : 'no projected screen'}`,
    element.declared ? `- declared: ${code(element.declared)}` : null,
    element.symbol ? `- symbol: ${code(element.symbol)}` : null,
    element.labelRes ? `- text resource: ${code(element.labelRes)}` : null,
    element.intent ? `- intent: ${code(element.intent)}` : null,
    element.actionKey ? `- action key: ${code(element.actionKey)}` : null,
    element.call ? `- calls: ${code(element.call)}` : null,
    element.navigatesTo ? `- travels to: ${element.navigatesTo === BACK ? 'the runtime back target' : label(element.navigatesTo)}` : null,
    element.visibleWhen ? `- visible when: ${element.visibleWhen}` : null,
    ...headerLines(lens, lensUrl),
    impact.sharesPathwayWith.length ? `- shares its pathway with: ${impact.sharesPathwayWith.map((ref) => elementFor(lens, ref).label).join(', ')}` : null,
    impact.touches.length ? `- touches underneath: ${impact.touches.map((ref) => step(ref).label).join(', ')}` : null,
    '',
  ].filter((line) => line !== null);
  if (pathway) {
    lines.push('## Pathway', '', ...pathwaySection(lens, pathway));
    lines.push(`Disposition rule: ${PATHWAY_DISPOSITIONS[pathway.disposition]}`, '');
  } else {
    lines.push(`This ${element.kind.toLowerCase().replace('_', ' ')} has no projected pathway yet. An interaction may exist, but its deeper relationship is not currently projected.`, '');
  }
  const notes = notesFor(lens, [element.ref]);
  if (notes.length) lines.push('## Notes', '', ...notes, '');
  lines.push('## Role key', '', ...Object.values(LENS_BANDS).map((band) => `- ${band.label} (${band.question}): ${Object.values(LENS_ROLES).filter((role) => role.band === band.band).map((role) => `${role.chip} ${role.label}`).join(', ')}`), '');
  return lines.join('\n');
}

// [VXG RealForever][VEXWORK][VEXBOARD][SCREEN-LENS][QUERY]
