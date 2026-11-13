// Screen Lens expressions: the linear set of contexts one Screen can be seen in.
//
// The realization projection says, for one context, why each thing is or is not presented. An
// expression is one context worth looking at, derived only from relationships source already
// declares: a container showing another registered child, a closed presentation opened, a list
// with rows or with none, a feature condition taking one of its source-written choices, or a
// source-authored Preview. The Screen keeps one structure; expressions change its surface.
//
//   SOURCE        source defaults (always first)
//   EXAMPLE       a source-authored Preview / golden (source wrote this state)
//   SELECTION     runtime presentation selects another registered child
//   PRESENTATION  runtime presentation opens a closed sheet or dialog
//   POPULATION    feature data has items, or none (the count is never observed)
//   CONDITION     a feature-owned branch, case or alternative takes one choice
//
// An expression is identified by what it presents: two candidate contexts that present the same
// thing are one expression. Every face (Surface, Structure, Behavior, Depth) reads the same value:
// the Experience side draws `context`, the Behavior side draws `graph` (how the expression is
// reached, and what realizes it underneath). Nothing is stored; the list is recomputed from the lens.
//
// Pure and effect-free. Expressions never claim the current runtime instance.

import {
  NONE_CHOICE,
  emptyRealizationContext,
  examplesForScreen,
  openersOf,
  realizationOf,
  resolvePresence,
  selectionTargets,
  templateOf,
} from './vexboard-screen-lens-realization.mjs';

export const EXPRESSION_KINDS = Object.freeze({
  SOURCE: Object.freeze({ kind: 'SOURCE', label: 'Source', truth: 'SOURCE', question: 'Source defaults: default selections, closed presentations, unconditional content.' }),
  EXAMPLE: Object.freeze({ kind: 'EXAMPLE', label: 'Example', truth: 'EXAMPLE', question: 'A source-authored example sets this state beside the feature.' }),
  CUSTOM: Object.freeze({ kind: 'CUSTOM', label: 'Custom', truth: 'SCENARIO', question: 'A hand-set combination of scenario choices. Browser-local; nothing is written anywhere.' }),
  SELECTION: Object.freeze({ kind: 'SELECTION', label: 'Selection', truth: 'SCENARIO', question: 'Runtime presentation selects another registered child of a container.' }),
  PRESENTATION: Object.freeze({ kind: 'PRESENTATION', label: 'Presentation', truth: 'SCENARIO', question: 'Runtime presentation opens a sheet or dialog that is closed by default.' }),
  POPULATION: Object.freeze({ kind: 'POPULATION', label: 'Population', truth: 'SCENARIO', question: 'Feature data has items, or none. VexBoard never observes the count.' }),
  CONDITION: Object.freeze({ kind: 'CONDITION', label: 'Condition', truth: 'SCENARIO', question: 'A feature-owned condition takes one of the choices source wrote. VexBoard does not evaluate it.' }),
});
export const SOURCE_EXPRESSION_REF = 'expression:source';

const CONDITION_KINDS = new Set(['BRANCH', 'CASES', 'ALTERNATIVE']);
const GENERIC_LABELS = new Set(['sheet', 'content', 'menu', 'dialog', 'panel', 'body', 'region', 'column', 'list', 'row', 'card']);
const PRESENTED = new Set(['SOURCE', 'EXAMPLE', 'SCENARIO']);

const humanize = (symbol) => {
  const local = String(symbol ?? '').split('.').pop();
  const words = local.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[-_]+/g, ' ').trim().split(/\s+/);
  return words.map((word, i) => (i ? word.toLowerCase() : word)).join(' ');
};
const localOf = (symbol) => String(symbol ?? '').split('.').pop();

// The name a person would use: the registered label, unless it is a bare kind word ("Sheet"),
// then the source symbol that declares it ("FullPlayerSheet" → "Full player sheet").
export function expressionName(element) {
  if (!element) return null;
  if (element.symbol && GENERIC_LABELS.has(String(element.label ?? '').toLowerCase())) return humanize(element.symbol);
  return element.label ?? humanize(element.symbol);
}

function screenParts(lens, screenRef) {
  const screen = lens.screens.find((entry) => entry.screenRef === screenRef);
  if (!screen) throw new TypeError(`screen lens expressions: unknown screen ${screenRef}`);
  const elements = new Map(screen.elements.map((element) => [element.ref, element]));
  const childrenOf = (ref) => screen.elements.filter((element) => element.parentRef === ref).map((element) => element.ref);
  const presence = realizationOf(lens, screenRef)?.presence ?? [];
  const byRef = new Map(presence.map((entry) => [entry.ref, entry]));
  const choicesOf = (entry) => (entry.kind === 'SELECTION' ? selectionTargets(entry, entry.subjectRef ? childrenOf(entry.subjectRef) : []) : entry.choices);
  return { screen, elements, presence, byRef, choicesOf };
}

// One step of a context: which relationship takes which value. A step that source defaults
// already satisfy (the default child of a selection) is implicit: it names where the expression
// lives without becoming an override.
function stepFor(parts, entry, choiceIndex) {
  if (entry.kind === 'PRESENTATION') return { presenceRef: entry.ref, kind: entry.kind, value: 'OPEN', implicit: false };
  if (entry.kind === 'POPULATION') return { presenceRef: entry.ref, kind: entry.kind, value: 'ITEMS', implicit: false };
  if (entry.kind === 'SELECTION') {
    const choice = parts.choicesOf(entry)[choiceIndex];
    if (!choice || choice.kind === 'GUARD' || !choice.resolvedTargetRef) return null;
    return { presenceRef: entry.ref, kind: entry.kind, value: choice.resolvedTargetRef, choice: choiceIndex, implicit: choice.resolvedTargetRef === entry.defaultRef };
  }
  if (choiceIndex === -1 && !entry.exhaustive) return { presenceRef: entry.ref, kind: entry.kind, value: NONE_CHOICE, choice: -1, implicit: false };
  if (!entry.choices[choiceIndex]) return null;
  return { presenceRef: entry.ref, kind: entry.kind, value: String(choiceIndex), choice: choiceIndex, implicit: false };
}

// The written negation of one simple condition, so "none of the choices" reads as the state it
// is (`x !is Paired` → `x is Paired`). Compound conditions stay "not (…)".
export function negateCondition(condition) {
  const text = String(condition ?? '').trim();
  if (!text) return 'otherwise';
  if (/&&|\|\||\?:/.test(text)) return `not (${text})`;
  const swaps = [[/ !is /, ' is '], [/ is /, ' !is '], [/ != /, ' == '], [/ == /, ' != '], [/\.isNotEmpty\(\)$/, '.isEmpty()'], [/\.isEmpty\(\)$/, '.isNotEmpty()'], [/\.isNotBlank\(\)$/, '.isBlank()'], [/\.isBlank\(\)$/, '.isNotBlank()']];
  for (const [pattern, replacement] of swaps) if (pattern.test(text)) return text.replace(pattern, replacement);
  if (/^!\w[\w.]*$/.test(text)) return text.slice(1);
  if (/^\w[\w.]*$/.test(text)) return `!${text}`;
  return `not (${text})`;
}

// The enclosing choices an inner relationship needs, outermost first; null when a context value
// cannot reach it (a guard such as a loading pane is decided by feature data alone).
function requirementsOf(parts, entry) {
  const chain = [];
  const seen = new Set();
  let current = entry;
  while (current.gate?.presenceRef && parts.byRef.has(current.gate.presenceRef) && !seen.has(current.ref)) {
    seen.add(current.ref);
    const outer = parts.byRef.get(current.gate.presenceRef);
    const step = stepFor(parts, outer, current.gate.choice);
    if (!step) return null;
    chain.unshift(step);
    current = outer;
  }
  return chain;
}

function contextOf(steps, exampleRef = null) {
  const overrides = {};
  for (const step of steps) if (!step.implicit) overrides[step.presenceRef] = step.value;
  return Object.freeze({ exampleRef, overrides: Object.freeze(overrides) });
}

function phraseOf(parts, step) {
  const entry = parts.byRef.get(step.presenceRef);
  if (step.kind === 'SELECTION') return expressionName(parts.elements.get(step.value)) ?? localOf(step.value);
  if (step.kind === 'PRESENTATION') return 'open';
  if (step.kind === 'POPULATION') return step.value === 'EMPTY' ? 'no items' : 'rows';
  if (step.value === NONE_CHOICE) return entry?.choices.length === 1 ? `if ${negateCondition(entry.choices[0].condition)}` : `otherwise (none of ${entry?.choices.length ?? 0})`;
  const condition = entry?.choices[Number(step.value)]?.condition ?? '';
  if (!condition) return 'unnamed case';
  return condition === 'else' ? 'otherwise' : `if ${condition}`;
}

function placeOf(parts, entry) {
  if (entry.subjectRef && parts.elements.has(entry.subjectRef)) return expressionName(parts.elements.get(entry.subjectRef));
  if (entry.subjectRef?.startsWith('screen.')) return parts.screen.label;
  return entry.realizedBy ? humanize(entry.realizedBy) : parts.screen.label;
}

// Where an expression lives: the deepest registered place its chain opens or selects, else the
// subject of its own relationship.
function whereOf(parts, steps) {
  const own = steps.at(-1);
  const entry = parts.byRef.get(own.presenceRef);
  if (own.kind === 'SELECTION') return placeOf(parts, entry);
  if (own.kind === 'PRESENTATION') return placeOf(parts, entry);
  for (const step of [...steps.slice(0, -1)].reverse()) {
    if (step.kind === 'SELECTION') return phraseOf(parts, step);
    if (step.kind === 'PRESENTATION') return placeOf(parts, parts.byRef.get(step.presenceRef));
  }
  return placeOf(parts, entry);
}

const STATE_LETTER = { SOURCE: 'P', EXAMPLE: 'P', SCENARIO: 'P', LATENT: 'L', DEPENDS: 'D', UNTRACED: 'U', HELD: 'H' };
const drawablePopulation = (entry) => entry.kind === 'POPULATION' && Boolean(entry.templateRef || entry.empty.length || entry.emptyRealization === 'DECLARED');

// What a context presents: each element's presence, plus each drawable population's rows. Two
// populations that repeat the same template under the same enclosing choice draw the same thing,
// so they count once.
function signatureOf(parts, resolved) {
  const elementPart = [...resolved.elements.values()].map((entry) => STATE_LETTER[entry.state] ?? '?').join('');
  const groups = new Map();
  for (const entry of parts.presence.filter(drawablePopulation)) {
    const outcome = resolved.presence.get(entry.ref);
    const key = `${entry.templateRef ?? entry.ref}@${entry.gate?.presenceRef ?? ''}#${entry.gate?.choice ?? ''}`;
    const value = outcome?.gate === false ? '-' : outcome?.value ?? '?';
    groups.set(key, [...(groups.get(key) ?? []), value]);
  }
  const populations = [...groups.values()].map((values) => (values.includes('ITEMS') ? 'I' : values.every((value) => value === 'EMPTY') ? 'E' : values[0][0])).join('');
  return `${elementPart}|${populations}`;
}

function presentedRefs(resolved) {
  return new Set([...resolved.elements.values()].filter((entry) => PRESENTED.has(entry.state)).map((entry) => entry.ref));
}
// What a context removes: presented under Source, latent here (a depending element is still drawn).
function hiddenRefs(resolved, sourcePresented) {
  return [...sourcePresented].filter((ref) => ['LATENT', 'HELD'].includes(resolved.elements.get(ref)?.state));
}

const contextKey = (context) => `${context?.exampleRef ?? ''}|${JSON.stringify(Object.entries(context?.overrides ?? {}).sort(([a], [b]) => a.localeCompare(b)))}`;

function candidatesFor(parts) {
  const out = [];
  for (const entry of parts.presence) {
    const base = requirementsOf(parts, entry);
    if (!base) continue;
    const push = (kind, step) => out.push({ kind, presenceRef: entry.ref, base, steps: [...base, step] });
    if (entry.kind === 'SELECTION') {
      parts.choicesOf(entry).forEach((_, index) => {
        const step = stepFor(parts, entry, index);
        if (step && !step.implicit) push('SELECTION', step);
      });
    } else if (entry.kind === 'PRESENTATION') {
      push('PRESENTATION', stepFor(parts, entry, 0));
    } else if (entry.kind === 'POPULATION') {
      const emptyDeclared = entry.empty.length > 0 || entry.emptyRealization === 'DECLARED';
      if (entry.templateRef) push('POPULATION', { presenceRef: entry.ref, kind: entry.kind, value: 'ITEMS', implicit: false });
      if (emptyDeclared) push('POPULATION', { presenceRef: entry.ref, kind: entry.kind, value: 'EMPTY', implicit: false });
    } else if (CONDITION_KINDS.has(entry.kind)) {
      entry.choices.forEach((_, index) => push('CONDITION', stepFor(parts, entry, index)));
      // An `if` with no `else` can also not hold: that state realizes none of its content.
      if (!entry.exhaustive) push('CONDITION', stepFor(parts, entry, -1));
    }
  }
  return out;
}

function exampleExpressions(lens, screenRef, parts) {
  return examplesForScreen(lens, screenRef).filter((example) => example.kind !== 'JOURNEY').map((example) => {
    const steps = [];
    // A golden that renders a registered child selects it, so its reference sits where it belongs.
    const selection = example.subjectRef ? parts.presence.find((entry) => entry.kind === 'SELECTION' && parts.choicesOf(entry).some((choice) => choice.resolvedTargetRef === example.subjectRef)) : null;
    if (selection) {
      const index = parts.choicesOf(selection).findIndex((choice) => choice.resolvedTargetRef === example.subjectRef);
      const step = stepFor(parts, selection, index);
      const base = requirementsOf(parts, selection);
      if (step && base) steps.push(...base, step);
    }
    return {
      ref: `expression:${example.ref}`,
      kind: 'EXAMPLE',
      exampleRef: example.ref,
      presenceRef: null,
      parentRef: null,
      steps: steps.map((step) => Object.freeze({ ...step, phrase: phraseOf(parts, step) })),
      context: contextOf(steps, example.ref),
      where: example.kind === 'GOLDEN' ? 'Golden' : 'Preview',
      what: example.label,
      evidence: example.evidence,
    };
  });
}

// The registered place that best shows an expression: the child it selects, the presentation it
// opens, else the deepest place its chain selects or opens, else its own subject.
function focusOf(parts, steps, reveals) {
  for (const step of [...steps].reverse()) {
    if (step.kind === 'SELECTION' && parts.elements.has(step.value)) return step.value;
    if (step.kind === 'PRESENTATION') {
      const subject = parts.byRef.get(step.presenceRef)?.subjectRef;
      if (subject && parts.elements.has(subject)) return subject;
    }
  }
  const own = steps.length ? parts.byRef.get(steps.at(-1).presenceRef) : null;
  if (own?.subjectRef && parts.elements.has(own.subjectRef)) return own.subjectRef;
  return reveals.find((ref) => !reveals.includes(parts.elements.get(ref)?.parentRef)) ?? null;
}

/**
 * Every expression of one Screen: Source first, then source-authored examples, then each
 * relationship's choices, depth first, so an expression's variations follow it (a selected tab,
 * then that tab with rows, then with none). Each has a stable ref, the context value every face
 * resolves, what it presents beyond Source (reveals), what Source presents that it does not
 * (hides), the registered place that best shows it (focusRef), its parent expression, and other
 * refs that reach the same presentation (also).
 */
export function expressionsFor(lens, screenRef) {
  const parts = screenParts(lens, screenRef);
  const sourceContext = emptyRealizationContext();
  const sourceResolved = resolvePresence(lens, screenRef, sourceContext);
  const sourcePresented = presentedRefs(sourceResolved);
  const bySignature = new Map([[signatureOf(parts, sourceResolved), SOURCE_EXPRESSION_REF]]);
  const byContext = new Map([[contextKey(sourceContext), SOURCE_EXPRESSION_REF]]);
  const source = {
    ref: SOURCE_EXPRESSION_REF, kind: 'SOURCE', exampleRef: null, presenceRef: null, parentRef: null, steps: [], context: sourceContext,
    where: parts.screen.label, what: 'source defaults', reveals: [], hides: [], focusRef: null, also: [],
  };
  const all = new Map([[source.ref, source]]);
  const finish = (expression, resolved) => {
    const presented = presentedRefs(resolved);
    const reveals = [...presented].filter((ref) => !sourcePresented.has(ref));
    return { ...expression, reveals, hides: hiddenRefs(resolved, sourcePresented), focusRef: focusOf(parts, expression.steps, reveals), also: [] };
  };
  const examples = exampleExpressions(lens, screenRef, parts).map((example) => finish(example, resolvePresence(lens, screenRef, example.context)));
  for (const example of examples) all.set(example.ref, example);
  const ordered = [];
  for (const candidate of candidatesFor(parts)) {
    const context = contextOf(candidate.steps);
    const resolved = resolvePresence(lens, screenRef, context);
    const signature = signatureOf(parts, resolved);
    const own = candidate.steps.at(-1);
    const ref = `expression:${candidate.presenceRef}=${own.value}`;
    if (bySignature.has(signature)) {
      // Same presentation, another way to reach it: an alias, never a second expression.
      const first = all.get(bySignature.get(signature));
      first.also.push(ref);
      byContext.set(contextKey(context), first.ref);
      continue;
    }
    const entry = parts.byRef.get(candidate.presenceRef);
    const template = own.kind === 'POPULATION' && entry.templateRef ? templateOf(lens, screenRef, entry.templateRef) : null;
    const expression = finish({
      ref,
      kind: candidate.kind,
      exampleRef: null,
      presenceRef: candidate.presenceRef,
      parentRef: byContext.get(contextKey(contextOf(candidate.base))) ?? SOURCE_EXPRESSION_REF,
      steps: candidate.steps.map((step) => Object.freeze({ ...step, phrase: phraseOf(parts, step) })),
      context,
      where: whereOf(parts, candidate.steps),
      what: own.kind === 'POPULATION' && own.value === 'ITEMS' && template?.symbol ? `rows · ${humanize(template.symbol)}` : phraseOf(parts, own),
    }, resolved);
    bySignature.set(signature, ref);
    byContext.set(contextKey(context), ref);
    all.set(ref, expression);
    ordered.push(expression);
  }
  // Depth first from Source: children follow their parent, siblings keep source reading order.
  // At the top, what this surface looks like with other data comes first, then what runtime
  // presentation can select, then what it can open.
  const children = new Map();
  for (const expression of ordered) children.set(expression.parentRef, [...(children.get(expression.parentRef) ?? []), expression]);
  const ROOT_ORDER = { POPULATION: 0, CONDITION: 0, SELECTION: 1, PRESENTATION: 2 };
  children.set(SOURCE_EXPRESSION_REF, [...(children.get(SOURCE_EXPRESSION_REF) ?? [])].sort((a, b) => ROOT_ORDER[a.kind] - ROOT_ORDER[b.kind]));
  const out = [source, ...examples];
  const visit = (parentRef, depth) => {
    for (const expression of children.get(parentRef) ?? []) {
      out.push({ ...expression, depth });
      visit(expression.ref, depth + 1);
    }
  };
  visit(SOURCE_EXPRESSION_REF, 0);
  return Object.freeze(out.map((expression) => Object.freeze({
    ...expression,
    depth: expression.depth ?? 0,
    also: Object.freeze([...(all.get(expression.ref)?.also ?? expression.also)]),
  })));
}

export function expressionFor(expressions, ref) {
  return expressions.find((expression) => expression.ref === ref || expression.also.includes(ref)) ?? null;
}

// The expression whose context equals this one, or null for a custom (hand-set) context.
export function expressionMatching(expressions, context) {
  const wanted = contextKey(context);
  return expressions.find((expression) => contextKey(expression.context) === wanted) ?? null;
}

// Where an element is exposed: the first expression that presents it beyond Source (the one the
// Surface scrolls to on a double-click). Null when Source already presents it, or nothing does.
// Among several, the one closest to Source (fewest chosen relationships) wins; a source-authored
// example only when no relationship expression presents it.
export function expressionExposing(expressions, elementRef) {
  const revealing = expressions.filter((expression) => expression.reveals.includes(elementRef));
  const weight = (expression) => (expression.kind === 'EXAMPLE' ? 1000 : 0) + Object.keys(expression.context.overrides).length;
  return [...revealing].sort((a, b) => weight(a) - weight(b))[0] ?? null;
}

// A context set by hand (inspector scenario buttons) still has one expression: its steps are the
// overrides in source reading order, so both sides keep reading the same value.
export function customExpression(lens, screenRef, context) {
  const parts = screenParts(lens, screenRef);
  const sourcePresented = presentedRefs(resolvePresence(lens, screenRef, emptyRealizationContext()));
  const resolved = resolvePresence(lens, screenRef, context);
  const presented = presentedRefs(resolved);
  const steps = parts.presence.filter((entry) => context.overrides[entry.ref] !== undefined).map((entry) => {
    const value = context.overrides[entry.ref];
    const kind = CONDITION_KINDS.has(entry.kind) ? 'CONDITION' : entry.kind;
    const choice = entry.kind === 'SELECTION' ? parts.choicesOf(entry).findIndex((candidate) => candidate.resolvedTargetRef === value) : value === NONE_CHOICE ? -1 : Number(value);
    const step = { presenceRef: entry.ref, kind, value, choice, implicit: false };
    return Object.freeze({ ...step, phrase: kind === 'PRESENTATION' && value === 'CLOSED' ? 'closed' : phraseOf(parts, step) });
  });
  const reveals = [...presented].filter((ref) => !sourcePresented.has(ref));
  const example = context.exampleRef ? (lens.examples ?? []).find((entry) => entry.ref === context.exampleRef) : null;
  return Object.freeze({
    ref: 'expression:custom',
    kind: 'CUSTOM',
    exampleRef: context.exampleRef ?? null,
    presenceRef: steps.at(-1)?.presenceRef ?? null,
    parentRef: null,
    steps: Object.freeze(steps.filter((step) => step.phrase !== 'closed')),
    context,
    where: example ? example.label : steps.length === 1 ? whereOf(parts, steps) : parts.screen.label,
    what: steps.length ? steps.map((step) => step.phrase).join(' · ') : 'source defaults',
    reveals: Object.freeze(reveals),
    hides: Object.freeze(hiddenRefs(resolved, sourcePresented)),
    focusRef: focusOf(parts, steps, reveals),
    also: Object.freeze([]),
    depth: 0,
  });
}

// The expression a control's declared typed intent would bring about: swapTo(container, child)
// selects, open / toggle(X) opens; a chain needs every step. A target that is the source default
// is already satisfied. Null when the intent is not typed presentation (an Act, a navigation).
export function expressionForControl(lens, screenRef, expressions, elementRef) {
  const parts = screenParts(lens, screenRef);
  const element = [...lens.chrome.flatMap((entry) => entry.elements), ...parts.screen.elements].find((candidate) => candidate.ref === elementRef);
  if (!element?.intent) return null;
  const bySymbol = (local) => parts.screen.elements.find((candidate) => localOf(candidate.symbol) === local) ?? null;
  const targets = [];
  for (const match of element.intent.matchAll(/\bswapTo\(\s*container\s*=\s*(?:\w+\.)?(\w+)\s*,\s*child\s*=\s*(?:\w+\.)?(\w+)\s*\)/g)) {
    const container = bySymbol(match[1]);
    const child = bySymbol(match[2]);
    const selection = container ? parts.presence.find((entry) => entry.kind === 'SELECTION' && entry.subjectRef === container.ref) : null;
    if (selection && child) targets.push({ kind: 'SELECTION', presenceRef: selection.ref, value: child.ref, isDefault: selection.defaultRef === child.ref });
  }
  for (const match of element.intent.matchAll(/\b(?:open|toggle)\(\s*(?:\w+\.)?(\w+)\s*\)/g)) {
    const subject = bySymbol(match[1]);
    const presentation = subject ? parts.presence.find((entry) => entry.kind === 'PRESENTATION' && entry.subjectRef === subject.ref) : null;
    if (presentation) targets.push({ kind: 'PRESENTATION', presenceRef: presentation.ref, value: 'OPEN', isDefault: false });
  }
  if (!targets.length) return null;
  const satisfies = (expression) => targets.every((target) => {
    const override = expression.context.overrides[target.presenceRef];
    return override === target.value || (target.isDefault && override === undefined);
  });
  const fitting = expressions.filter((expression) => expression.kind !== 'EXAMPLE' && expression.kind !== 'CUSTOM' && satisfies(expression));
  return fitting.sort((a, b) => Object.keys(a.context.overrides).length - Object.keys(b.context.overrides).length)[0] ?? null;
}

/* ---------- the Behavior / Depth graph of one expression ---------- */

const nodeRef = (expression, suffix) => `${expression.ref}:${suffix}`;

function selectorsOf(lens, screenRef, parts, containerRef, childRef) {
  const container = parts.elements.get(containerRef);
  const child = parts.elements.get(childRef);
  if (!container?.symbol || !child?.symbol) return [];
  const pattern = new RegExp(`\\bswapTo\\(\\s*container\\s*=\\s*(?:\\w+\\.)?${localOf(container.symbol)}\\s*,\\s*child\\s*=\\s*(?:\\w+\\.)?${localOf(child.symbol)}\\s*\\)`);
  const candidates = [...lens.chrome.flatMap((entry) => entry.elements), ...parts.screen.elements];
  return candidates.filter((element) => element.intent && pattern.test(element.intent));
}

// The realization reader already walks nested composables. One expression chooses which of those
// source relationships are in view; only then do we retain the caller chain needed to reach them.
// This keeps topology descriptive without turning Source Depth into an every-function call graph.
function addSourceRealizationDepth(realization, expression, screenNode, sourceRealizers, { add, link }) {
  if (!realization?.entry?.symbol) return;
  const relevant = new Set([realization.entry.symbol, ...sourceRealizers].filter(Boolean));
  const edges = realization.callEdges ?? [];

  // Ancestor closure only: intermediate composables are visible when they are the source path from
  // the render entry to a realizer the current expression actually presents.
  for (let changed = true; changed;) {
    changed = false;
    for (const edge of edges) {
      if (relevant.has(edge.callee) && !relevant.has(edge.caller)) {
        relevant.add(edge.caller);
        changed = true;
      }
    }
  }

  const sourceBySymbol = new Map([[realization.entry.symbol, realization.entry.source ?? null]]);
  for (const edge of edges) {
    if (edge.callerSource && !sourceBySymbol.has(edge.caller)) sourceBySymbol.set(edge.caller, edge.callerSource);
    if (edge.calleeSource && !sourceBySymbol.has(edge.callee)) sourceBySymbol.set(edge.callee, edge.calleeSource);
  }
  const nodeFor = (symbol) => add({
    ref: nodeRef(expression, `realizer:${symbol}`),
    face: 'DEPTH',
    role: 'REALIZATION',
    label: symbol,
    symbol: symbol === realization.entry.symbol ? 'render entry' : 'source call',
    summary: symbol === realization.entry.symbol
      ? (realization.rendersRegisteredTree ? 'Renders the registered tree.' : 'Custom realization read from source.')
      : 'Source composable on the path to a realization relationship presented by this expression.',
    source: sourceBySymbol.get(symbol) ?? null,
  });

  const entryRef = nodeFor(realization.entry.symbol);
  link(screenNode, entryRef, 'realized by');
  for (const edge of edges) {
    if (!relevant.has(edge.caller) || !relevant.has(edge.callee)) continue;
    link(nodeFor(edge.caller), nodeFor(edge.callee), 'calls');
  }
}

/**
 * How an expression is reached (Behavior face) and what realizes it underneath (Depth face),
 * in the same node/edge shape as a pathway so the existing layout, ports and inspector apply.
 * Roles come from LENS_ROLES: controls are ELEMENT, declared intents INTENT, runtime presentation
 * or feature conditions STATE, realized registered places CONTAINER, composables REALIZATION,
 * data bindings PROJECTION / STORE, preview fixtures CONSTRUCTION.
 */
export function expressionGraph(lens, screenRef, expression) {
  if (!expression) return null;
  const parts = screenParts(lens, screenRef);
  const realization = realizationOf(lens, screenRef);
  const nodes = [];
  const edges = [];
  const add = (node) => { if (!nodes.some((entry) => entry.ref === node.ref)) nodes.push(Object.freeze(node)); return node.ref; };
  const link = (from, to, label = null, kind = 'FLOW') => { if (from && to && from !== to && !edges.some((edge) => edge.from === from && edge.to === to)) edges.push(Object.freeze({ from, to, label, kind })); };
  let previous = null;

  if (expression.kind === 'SOURCE') {
    // What decides this screen's form under source defaults: each runtime presentation relationship
    // a person can change (its default shown), and the feature-owned ones grouped, since VexBoard
    // does not evaluate them.
    const screenNode = add({ ref: nodeRef(expression, 'screen'), face: 'BEHAVIOR', role: 'SCREEN', label: parts.screen.label, symbol: parts.screen.symbol ?? null, summary: 'Source defaults decide every relationship below.', source: parts.screen.source ?? null });
    const outcomes = resolvePresence(lens, screenRef, expression.context).presence;
    const topLevel = parts.presence.filter((candidate) => !candidate.gate);
    for (const entry of topLevel.filter((candidate) => candidate.kind === 'SELECTION' || candidate.kind === 'PRESENTATION')) {
      const selected = entry.kind === 'SELECTION' ? parts.elements.get(outcomes.get(entry.ref)?.value) : null;
      const ref = add({ ref: nodeRef(expression, entry.ref), face: 'BEHAVIOR', role: 'STATE', label: entry.kind === 'SELECTION' ? `${placeOf(parts, entry)} shows ${expressionName(selected) ?? 'no default'}` : `${placeOf(parts, entry)} closed`, symbol: 'runtime.presentation', summary: entry.condition ?? (entry.kind === 'SELECTION' ? 'Default child; runtime presentation can select another.' : 'Closed by default; runtime presentation opens it.'), source: entry.source, presenceRef: entry.ref, elementRef: selected?.ref ?? entry.subjectRef ?? null });
      link(screenNode, ref, entry.kind === 'SELECTION' ? 'selection' : 'presentation');
    }
    const featureOwned = topLevel.filter((candidate) => candidate.kind !== 'SELECTION' && candidate.kind !== 'PRESENTATION');
    if (featureOwned.length) {
      const ref = add({ ref: nodeRef(expression, 'feature'), face: 'BEHAVIOR', role: 'STATE', label: `${featureOwned.length} feature-owned relationship${featureOwned.length === 1 ? '' : 's'} decide`, symbol: 'feature data', summary: featureOwned.map((entry) => placeOf(parts, entry)).join(', '), source: null });
      link(screenNode, ref, 'not evaluated');
    }
    const sourceRealizers = new Set();
    for (const entry of topLevel) {
      // A Source expression does not open closed presentations or choose feature-owned conditions.
      // It may, however, have a source-default runtime selection. Keep the shared realizer plus the
      // exact composable that realizes that selected child.
      if (entry.kind !== 'SELECTION') continue;
      if (entry.realizedBy) sourceRealizers.add(entry.realizedBy);
      const selectedRef = outcomes.get(entry.ref)?.value ?? null;
      const choice = parts.choicesOf(entry).find((candidate) => candidate.resolvedTargetRef === selectedRef) ?? null;
      if (choice?.realizedBy) sourceRealizers.add(choice.realizedBy);
    }
    addSourceRealizationDepth(realization, expression, screenNode, sourceRealizers, { add, link });
    return graphOf(expression, nodes, edges, `${parts.screen.label} under source defaults`);
  }

  if (expression.kind === 'EXAMPLE') {
    const example = (lens.examples ?? []).find((entry) => entry.ref === expression.exampleRef);
    const exampleNode = add({ ref: nodeRef(expression, 'example'), face: 'BEHAVIOR', role: 'SCREEN', label: example?.label ?? expression.exampleRef, symbol: example?.symbol ?? null, summary: example?.kind === 'GOLDEN' ? 'Screenshot golden: an accepted render beside the feature.' : 'Preview authored beside the feature.', source: example?.source ?? null });
    previous = exampleNode;
    for (const [index, step] of (example?.setup ?? []).entries()) {
      const ref = add({ ref: nodeRef(expression, `setup-${index}`), face: 'BEHAVIOR', role: 'NAVIGATION', label: `${step.op.toLowerCase()}(${step.target ?? ''})`, symbol: 'previewSetup', summary: 'Runtime presentation state the preview sets before rendering.', source: example.source, elementRef: step.targetRef });
      link(previous, ref, 'sets'); previous = ref;
      if (step.targetRef && parts.elements.has(step.targetRef)) {
        const target = add({ ref: nodeRef(expression, `setup-${index}-target`), face: 'BEHAVIOR', role: 'CONTAINER', label: expressionName(parts.elements.get(step.targetRef)), symbol: parts.elements.get(step.targetRef).symbol ?? null, summary: 'Presented in this example.', elementRef: step.targetRef });
        link(ref, target, 'presents'); previous = target;
      }
    }
    for (const fn of example?.fixture?.functions ?? []) {
      const ref = add({ ref: nodeRef(expression, `fixture-${fn}`), face: 'DEPTH', role: 'CONSTRUCTION', label: `${fn}()`, symbol: 'fixture', summary: 'Typed Kotlin fixture; its contents stay source text.', source: example.source });
      link(exampleNode, ref, 'repositories');
    }
    if (example?.renders) link(exampleNode, add({ ref: nodeRef(expression, 'renders'), face: 'DEPTH', role: 'REALIZATION', label: example.renders, symbol: 'renders', summary: 'The production composable this example renders.', source: example.source }), 'renders');
    for (const [index, evidence] of (example?.evidence ?? []).entries()) {
      link(exampleNode, add({ ref: nodeRef(expression, `evidence-${index}`), face: 'DEPTH', role: 'PROJECTION', label: evidence.configuration ?? 'reference render', symbol: evidence.kind, summary: evidence.meaning ?? 'Accepted reference render.', source: evidence.path }), 'expected render');
    }
    stepsGraph(lens, screenRef, parts, expression, expression.steps, { add, link, previous });
    return graphOf(expression, nodes, edges, `${example?.label ?? expression.exampleRef}`);
  }

  stepsGraph(lens, screenRef, parts, expression, expression.steps, { add, link, previous });
  return graphOf(expression, nodes, edges, `${expression.where} · ${expression.what}`);
}

function stepsGraph(lens, screenRef, parts, expression, steps, { add, link, previous: start }) {
  let previous = start;
  for (const step of steps) {
    const entry = parts.byRef.get(step.presenceRef);
    if (!entry) continue;
    const key = entry.ref;
    if (step.kind === 'PRESENTATION') {
      const subject = parts.elements.get(entry.subjectRef);
      const openers = subject ? openersOf(lens, screenRef, subject.ref).slice(0, 3) : [];
      const stateRef = add({ ref: nodeRef(expression, key), face: 'BEHAVIOR', role: 'STATE', label: entry.condition ?? `presentation.isOpen(${localOf(subject?.symbol)})`, symbol: 'runtime.presentation', summary: 'VexRuntime presentation state. Closed by default; opened here.', source: entry.source, presenceRef: entry.ref });
      if (openers.length) for (const [index, opener] of openers.entries()) {
        const control = add({ ref: nodeRef(expression, `${key}:opener-${index}`), face: 'BEHAVIOR', role: 'ELEMENT', label: opener.label, symbol: opener.symbol ?? null, summary: opener.intent, elementRef: opener.ref });
        const intent = add({ ref: nodeRef(expression, `${key}:intent-${index}`), face: 'BEHAVIOR', role: 'INTENT', label: opener.intent, symbol: 'ElementIntent', summary: 'Declared on the control.' });
        link(previous, control, 'inside'); link(control, intent, 'tap'); link(intent, stateRef, 'open');
      } else link(previous, stateRef, 'inside');
      const place = add({ ref: nodeRef(expression, `${key}:subject`), face: 'BEHAVIOR', role: 'CONTAINER', label: expressionName(subject) ?? placeOf(parts, entry), symbol: subject?.symbol ?? null, summary: subject?.declared ?? null, elementRef: subject?.ref ?? null });
      link(stateRef, place, 'presents');
      if (entry.realizedBy) link(place, add({ ref: nodeRef(expression, `realizer:${entry.realizedBy}`), face: 'DEPTH', role: 'REALIZATION', label: entry.realizedBy, symbol: 'realized by', summary: 'Composable that realizes it.', source: entry.source }), 'realized by');
      previous = place;
    } else if (step.kind === 'SELECTION') {
      const container = parts.elements.get(entry.subjectRef);
      const child = parts.elements.get(step.value);
      const choice = parts.choicesOf(entry)[step.choice] ?? null;
      const selectors = selectorsOf(lens, screenRef, parts, entry.subjectRef, step.value).slice(0, 2);
      const stateRef = add({ ref: nodeRef(expression, key), face: 'BEHAVIOR', role: 'STATE', label: `selected(${localOf(container?.symbol)}) == ${localOf(child?.symbol)}`, symbol: 'runtime.presentation', summary: step.implicit ? `Source default of ${expressionName(container)}.` : `VexRuntime presentation state. Default: ${expressionName(parts.elements.get(entry.defaultRef)) ?? 'none'}.`, source: entry.source, presenceRef: entry.ref });
      if (selectors.length && !step.implicit) for (const [index, selector] of selectors.entries()) {
        const control = add({ ref: nodeRef(expression, `${key}:selector-${index}`), face: 'BEHAVIOR', role: 'ELEMENT', label: selector.label, symbol: selector.symbol ?? null, summary: selector.intent, elementRef: selector.ref });
        const intent = add({ ref: nodeRef(expression, `${key}:intent-${index}`), face: 'BEHAVIOR', role: 'INTENT', label: selector.intent, symbol: 'ElementIntent', summary: 'Declared on the control.' });
        link(previous, control, 'inside'); link(control, intent, 'tap'); link(intent, stateRef, 'swap');
      } else link(previous, stateRef, 'inside');
      const place = add({ ref: nodeRef(expression, `${key}:child`), face: 'BEHAVIOR', role: 'CONTAINER', label: expressionName(child) ?? step.value, symbol: child?.symbol ?? null, summary: child?.declared ?? null, elementRef: child?.ref ?? null });
      link(stateRef, place, 'presents');
      if (choice?.realizedBy) link(place, add({ ref: nodeRef(expression, `realizer:${choice.realizedBy}`), face: 'DEPTH', role: 'REALIZATION', label: choice.realizedBy, symbol: 'realized by', summary: choice.byElimination ? 'Realizes the child no other choice names (else).' : 'Composable that realizes it.', source: entry.source }), 'realized by');
      previous = place;
    } else if (step.kind === 'POPULATION') {
      const template = entry.templateRef ? templateOf(lens, screenRef, entry.templateRef) : null;
      const stateRef = add({ ref: nodeRef(expression, key), face: 'BEHAVIOR', role: 'STATE', label: step.value === 'EMPTY' ? `${entry.items ?? 'items'} is empty` : `${entry.items ?? 'items'} has items`, symbol: 'feature data', summary: 'Chosen here. VexBoard never observes the count.', source: entry.source, presenceRef: entry.ref });
      link(previous, stateRef, 'inside');
      const place = add({ ref: nodeRef(expression, `${key}:rows`), face: 'BEHAVIOR', role: 'CONTAINER', label: step.value === 'EMPTY' ? 'empty content' : `↻ ${template?.symbol ?? 'item'}`, symbol: entry.list?.identity === 'REGISTERED' ? 'listRef' : entry.list?.identity === 'RUNTIME' ? 'runtime list' : 'no list identity', summary: step.value === 'EMPTY' ? (entry.emptyRealization === 'DECLARED' ? "The list's declared empty content." : 'No empty content is declared to the list.') : template?.summary ?? 'One row template, repeated per item.', elementRef: entry.subjectRef && parts.elements.has(entry.subjectRef) ? entry.subjectRef : null });
      link(stateRef, place, step.value === 'EMPTY' ? 'shows' : 'repeats');
      // Depth: the data binding chain source declares, nearest first, ending at its owner.
      let below = place;
      const chain = entry.provenance.slice(0, 6);
      chain.forEach((binding, index) => {
        // The owner a composable is handed (a Relay, Repository or Store parameter) is outside truth;
        // every binding between it and the list is a projection of it.
        const owner = binding.via === 'parameter' && /:\s*[\w.]*(Relay|Repository|Store)\w*\b/.test(binding.expression);
        const ref = add({ ref: nodeRef(expression, `${key}:binding-${index}`), face: 'DEPTH', role: owner ? 'STORE' : 'PROJECTION', label: binding.symbol ?? binding.expression, symbol: binding.via, summary: binding.expression, source: binding.source });
        link(below, ref, index ? binding.via : 'items ←'); below = ref;
      });
      if (entry.realizedBy) link(place, add({ ref: nodeRef(expression, `realizer:${entry.realizedBy}`), face: 'DEPTH', role: 'REALIZATION', label: entry.realizedBy, symbol: 'realized by', summary: entry.held ?? 'Composable that repeats the template.', source: entry.source }), 'realized by');
      previous = place;
    } else {
      const choice = entry.choices[Number(step.value)];
      const stateRef = add({ ref: nodeRef(expression, key), face: 'BEHAVIOR', role: 'STATE', label: step.phrase ?? phraseOf(parts, step), symbol: entry.kind === 'CASES' ? `when (${entry.subject ?? '…'})` : entry.kind.toLowerCase(), summary: 'Feature-owned condition, chosen here. VexBoard does not evaluate it.', source: entry.source, presenceRef: entry.ref });
      link(previous, stateRef, 'inside');
      const realized = (choice?.realizes ?? []).filter((ref) => parts.elements.has(ref));
      const top = realized.filter((ref) => !realized.includes(parts.elements.get(ref).parentRef)).slice(0, 3);
      let last = stateRef;
      for (const ref of top) {
        const element = parts.elements.get(ref);
        last = add({ ref: nodeRef(expression, `${key}:realizes-${ref}`), face: 'BEHAVIOR', role: element.kind === 'TEXT' || element.kind === 'IMAGE' ? 'CONTENT' : ['COLUMN', 'ROW', 'STACK', 'CARD', 'REGION', 'MENU', 'SHEET', 'DIALOG'].includes(element.kind) ? 'CONTAINER' : 'ELEMENT', label: expressionName(element), symbol: element.symbol ?? null, summary: element.declared ?? null, elementRef: ref });
        link(stateRef, last, 'presents');
      }
      if (realized.length > top.length) {
        last = add({ ref: nodeRef(expression, `${key}:more`), face: 'BEHAVIOR', role: 'CONTENT', label: `${realized.length} registered elements`, symbol: null, summary: realized.map((ref) => expressionName(parts.elements.get(ref))).join(', ') });
        link(stateRef, last, 'presents');
      }
      if (choice?.realizedBy) link(stateRef, add({ ref: nodeRef(expression, `realizer:${choice.realizedBy}`), face: 'DEPTH', role: 'REALIZATION', label: choice.realizedBy, symbol: 'realized by', summary: 'Composable this choice renders.', source: entry.source }), 'realized by');
      if (step.value === NONE_CHOICE) {
        // Taking none of the written choices is a state too: what each choice would show steps aside.
        const aside = [...new Set(entry.choices.flatMap((candidate) => candidate.realizes))].filter((ref) => parts.elements.has(ref));
        last = add({ ref: nodeRef(expression, `${key}:none`), face: 'BEHAVIOR', role: 'CONTENT', label: aside.length ? `nothing of ${aside.length} registered element${aside.length === 1 ? '' : 's'}` : 'nothing', symbol: 'none of the choices', summary: aside.map((ref) => expressionName(parts.elements.get(ref))).join(', ') || null });
        link(stateRef, last, 'presents');
      }
      previous = top.length === 1 && realized.length === 1 ? last : stateRef;
    }
  }
  return previous;
}

function graphOf(expression, nodes, edges, label) {
  return Object.freeze({
    pathwayRef: expression.ref,
    expressionRef: expression.ref,
    label,
    disposition: 'EXPRESSION',
    summary: EXPRESSION_KINDS[expression.kind].question,
    returns: expression.reveals.length ? `${expression.reveals.length} registered element${expression.reveals.length === 1 ? '' : 's'} presented beyond Source` : null,
    nodes: Object.freeze(nodes),
    edges: Object.freeze(edges),
  });
}

// [VXG RealForever][VEXWORK][VEXBOARD][SCREEN-LENS][EXPRESSIONS]