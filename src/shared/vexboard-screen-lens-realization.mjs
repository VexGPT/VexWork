// Screen Lens realization: why a registered or runtime coordinate is, or is not, presented.
//
// One source relationship, many projections. A presence relationship is read once from source
// (see src/core/vexboard-android-realization.mjs) and reused by every face:
//
//   Surface     solid / dashed / dependent / example / scenario treatments
//   Structure   presence chips beside each registered element
//   Inspector   owner, condition, openers, population chain, template, examples
//   Scenario    a bounded, browser-local override of one relationship
//
// Truth categories stay distinct:
//
//   SOURCE      realized under source defaults (default selection, closed modals, unconditional)
//   LATENT      current source can realize it; this context does not
//   DEPENDS     realization depends on feature data VexBoard has not observed
//   EXAMPLE     realized because a source-authored example sets it
//   SCENARIO    realized because a browser-local scenario override sets it
//   HELD        the relationship is known but not projectable from source
//   UNTRACED    registered, but no realization was traced from source
//
//   VexBoard never claims the CURRENT runtime instance. It has no live device data.
//
// Pure and effect-free: no storage, no network, no clock. Scenario state is a value the caller owns.

import { BOARD_CONDITION_STATES } from './vexboard-simulation.mjs';

export const PRESENCE_KINDS = Object.freeze(['PRESENTATION', 'SELECTION', 'POPULATION', 'BRANCH', 'CASES', 'ALTERNATIVE']);
export const PRESENCE_STATES = Object.freeze({
  SOURCE: Object.freeze({ state: 'SOURCE', label: 'Source default', treatment: 'solid', question: 'Realized under source defaults.' }),
  LATENT: Object.freeze({ state: 'LATENT', label: 'Latent', treatment: 'dashed', question: 'Current source can realize this; this context does not.' }),
  DEPENDS: Object.freeze({ state: 'DEPENDS', label: 'Depends on data', treatment: 'dotted', question: 'Realization depends on feature data VexBoard has not observed.' }),
  EXAMPLE: Object.freeze({ state: 'EXAMPLE', label: 'Example', treatment: 'example', question: 'Realized because a source-authored example sets it.' }),
  SCENARIO: Object.freeze({ state: 'SCENARIO', label: 'Scenario', treatment: 'scenario', question: 'Realized because a browser-local scenario override sets it.' }),
  HELD: Object.freeze({ state: 'HELD', label: 'Held', treatment: 'held', question: 'Relationship known but not projectable from source yet.' }),
  UNTRACED: Object.freeze({ state: 'UNTRACED', label: 'Untraced', treatment: 'untraced', question: 'Registered; no realization was traced from source.' }),
});
export const REALIZATION_STATUSES = Object.freeze(['BLUEPRINT', 'PROJECTED', 'PARTIAL', 'OPAQUE', 'HELD']);
export const EXAMPLE_KINDS = Object.freeze(['PREVIEW', 'GOLDEN', 'JOURNEY']);
// Three-valued condition vocabulary shared with BoardScenario: a data condition VexBoard cannot see is UNKNOWN.
export const CONDITION_STATES = BOARD_CONDITION_STATES;

function fail(message) {
  throw new TypeError(`screen lens realization: ${message}`);
}
const optional = (value) => (value === undefined || value === null || value === '' ? null : String(value));
const list = (value) => (Array.isArray(value) ? value : []);

/* ---------- normalization (fail closed on dangling refs and unknown kinds) ---------- */

export function normalizeScreenRealization(input, { screenRef, knownRefs }) {
  if (input === undefined || input === null) return null;
  if (typeof input !== 'object') fail(`${screenRef} realization must be an object`);
  if (!REALIZATION_STATUSES.includes(input.status)) fail(`${screenRef} realization status ${input.status} is unknown`);
  const known = (ref, label) => {
    if (ref === null || ref === undefined) return null;
    if (!knownRefs.has(ref)) fail(`${screenRef} ${label} ${ref} is not a lens ref`);
    return ref;
  };
  const templateRefs = new Set(list(input.templates).map((template) => template.ref));
  const presenceRefs = new Set();
  const presence = list(input.presence).map((entry) => {
    const ref = optional(entry?.ref);
    if (!ref) fail(`${screenRef} presence needs a ref`);
    if (presenceRefs.has(ref)) fail(`${screenRef} duplicate presence ${ref}`);
    presenceRefs.add(ref);
    if (!PRESENCE_KINDS.includes(entry.kind)) fail(`${ref} kind ${entry.kind} is unknown`);
    if (entry.templateRef && !templateRefs.has(entry.templateRef)) fail(`${ref} template ${entry.templateRef} is not declared`);
    return Object.freeze({
      ref,
      kind: entry.kind,
      subjectRef: known(entry.subjectRef, `${ref} subject`),
      owner: optional(entry.owner),
      condition: optional(entry.condition),
      subject: optional(entry.subject),
      realizedBy: optional(entry.realizedBy),
      source: optional(entry.source),
      declaredBy: optional(entry.declaredBy),
      defaultRef: known(entry.defaultRef, `${ref} default`),
      exhaustive: entry.exhaustive === true,
      realizes: Object.freeze(list(entry.realizes).map((child) => known(child, `${ref} realizes`))),
      choices: Object.freeze(list(entry.choices).map((choice) => Object.freeze({
        condition: optional(choice.condition) ?? '',
        kind: optional(choice.kind),
        targetRef: known(choice.targetRef, `${ref} choice target`),
        realizedBy: optional(choice.realizedBy),
        realizes: Object.freeze(list(choice.realizes).map((child) => known(child, `${ref} choice realizes`))),
      }))),
      list: entry.list ? Object.freeze({ ref: optional(entry.list.ref), expression: optional(entry.list.expression), identity: optional(entry.list.identity) ?? 'NONE' }) : null,
      items: optional(entry.items),
      itemKey: optional(entry.itemKey),
      contentType: optional(entry.contentType),
      provenance: Object.freeze(list(entry.provenance).map((step) => Object.freeze({ symbol: optional(step.symbol), expression: optional(step.expression) ?? '', via: optional(step.via), source: optional(step.source) }))),
      templateRef: optional(entry.templateRef),
      gate: entry.gate ? Object.freeze({ presenceRef: optional(entry.gate.presenceRef), choice: Number.isInteger(entry.gate.choice) ? entry.gate.choice : 0 }) : null,
      empty: Object.freeze(list(entry.empty).map((child) => known(child, `${ref} empty`))),
      emptyRealization: optional(entry.emptyRealization),
      held: optional(entry.held),
      region: entry.region?.slot ? Object.freeze({ slot: String(entry.region.slot), call: optional(entry.region.call) }) : null,
    });
  });
  const templates = list(input.templates).map((template) => Object.freeze({
    ref: optional(template.ref) ?? fail(`${screenRef} template needs a ref`),
    symbol: optional(template.symbol),
    source: optional(template.source),
    summary: optional(template.summary),
    instanceFormation: optional(template.instanceFormation),
    realizes: Object.freeze(list(template.realizes).map((ref) => known(ref, `${template.ref} realizes`))),
    usedBy: Object.freeze(list(template.usedBy).map((ref) => (presenceRefs.has(ref) ? ref : fail(`${template.ref} usedBy ${ref} is not a presence`)))),
    slots: Object.freeze(list(template.slots).map((slot) => Object.freeze({
      path: optional(slot.path),
      kind: optional(slot.kind) ?? 'REGION',
      primitive: optional(slot.primitive),
      realizes: known(slot.realizes, `${template.ref} slot`),
      oneOf: slot.oneOf ? Object.freeze(slot.oneOf.map((ref) => known(ref, `${template.ref} slot oneOf`))) : null,
      instanceFormation: optional(slot.instanceFormation),
      depth: Number.isInteger(slot.depth) ? slot.depth : 0,
      condition: optional(slot.condition),
      alternative: optional(slot.alternative),
      count: Number.isInteger(slot.count) ? slot.count : 1,
      primitives: slot.primitives ? Object.freeze([...slot.primitives]) : null,
      role: optional(slot.role),
      textStyle: optional(slot.textStyle),
      popup: optional(slot.popup),
    }))),
  }));
  const elements = list(input.elements).map((fact) => Object.freeze({
    ref: known(fact.ref, 'element fact'),
    presenceRefs: Object.freeze(list(fact.presenceRefs).map((ref) => (presenceRefs.has(ref) ? ref : fail(`${fact.ref} presence ${ref} is not declared`)))),
    conditionRefs: Object.freeze(list(fact.conditionRefs).map((ref) => (presenceRefs.has(ref) ? ref : fail(`${fact.ref} condition ${ref} is not declared`)))),
    realizedBy: Object.freeze(list(fact.realizedBy).map(String)),
    realizedIn: Object.freeze(list(fact.realizedIn).map((ref) => (templateRefs.has(ref) ? ref : fail(`${fact.ref} template ${ref} is not declared`)))),
  }));
  return Object.freeze({
    status: input.status,
    entry: input.entry ? Object.freeze({ symbol: optional(input.entry.symbol), source: optional(input.entry.source) }) : null,
    rendersRegisteredTree: known(input.rendersRegisteredTree, 'rendersRegisteredTree'),
    realizers: Object.freeze(list(input.realizers).map(String)),
    presence: Object.freeze(presence),
    templates: Object.freeze(templates),
    elements: Object.freeze(elements),
    opaque: Object.freeze(list(input.opaque).map((entry) => Object.freeze({ symbol: optional(entry.symbol), source: optional(entry.source), reason: optional(entry.reason) }))),
    held: Object.freeze(list(input.held).map((entry) => Object.freeze({ reason: optional(entry.reason) ?? 'held', source: optional(entry.source), symbol: optional(entry.symbol) }))),
  });
}

export function normalizeExamples(input, { knownRefs }) {
  const refs = new Set();
  return Object.freeze(list(input).map((example) => {
    const ref = optional(example?.ref) ?? fail('example needs a ref');
    if (refs.has(ref)) fail(`duplicate example ${ref}`);
    refs.add(ref);
    if (!EXAMPLE_KINDS.includes(example.kind)) fail(`${ref} kind ${example.kind} is unknown`);
    const known = (value, label) => {
      if (value === null || value === undefined) return null;
      if (!knownRefs.has(value)) fail(`${ref} ${label} ${value} is not a lens ref`);
      return value;
    };
    const step = (entry) => Object.freeze({
      op: optional(entry.op) ?? 'OTHER',
      target: optional(entry.target),
      targetRef: known(entry.targetRef, 'step target'),
      containerRef: known(entry.containerRef, 'step container'),
      behavesLikeRef: known(entry.behavesLikeRef, 'step behavesLike'),
      repository: optional(entry.repository),
      code: optional(entry.code),
      value: optional(entry.value),
      runtimeIdentity: entry.runtimeIdentity === true,
    });
    return Object.freeze({
      ref,
      kind: example.kind,
      id: optional(example.id),
      label: optional(example.label) ?? ref,
      symbol: optional(example.symbol),
      source: optional(example.source),
      summary: optional(example.summary),
      subjectRef: known(example.subjectRef, 'subject'),
      subjectHeld: optional(example.subjectHeld),
      renders: optional(example.renders),
      rendered: Object.freeze(list(example.rendered).map(String)),
      fixture: example.fixture ? Object.freeze({ expression: optional(example.fixture.expression), functions: Object.freeze(list(example.fixture.functions).map(String)) }) : null,
      setup: Object.freeze(list(example.setup).map(step)),
      steps: Object.freeze(list(example.steps).map(step)),
      configurations: Object.freeze(list(example.configurations).map(String)),
      evidence: Object.freeze(list(example.evidence).map((entry) => Object.freeze({ kind: optional(entry.kind) ?? 'EVIDENCE', path: optional(entry.path) ?? fail(`${ref} evidence needs a path`), configuration: optional(entry.configuration), meaning: optional(entry.meaning) }))),
      screens: Object.freeze(list(example.screens).map((value) => known(value, 'screen'))),
      related: Object.freeze(list(example.related).map((entry) => Object.freeze({ ref: String(entry.ref), via: Object.freeze(list(entry.via).map(String)) }))),
    });
  }).map((example, _, all) => {
    const exampleRefs = new Set(all.map((entry) => entry.ref));
    for (const related of example.related) if (!exampleRefs.has(related.ref)) fail(`${example.ref} relates to unknown example ${related.ref}`);
    return example;
  }));
}

/* ---------- lookups ---------- */

export function realizationOf(lens, screenRef) {
  return lens.screens.find((screen) => screen.screenRef === screenRef)?.realization ?? null;
}

export function examplesForScreen(lens, screenRef) {
  const key = screenRef.replace(/^screen\./, '');
  const onScreen = (ref) => ref === screenRef || (ref ?? '').startsWith(`element.${key}.`);
  // An example whose subject is held still belongs here when the composable it renders realizes this screen.
  const realizers = new Set(realizationOf(lens, screenRef)?.realizers ?? []);
  return (lens.examples ?? []).filter((example) => onScreen(example.subjectRef) || example.screens.includes(screenRef) || (!example.subjectRef && example.rendered.some((symbol) => realizers.has(symbol))));
}

export function exampleFor(lens, exampleRef) {
  return (lens.examples ?? []).find((example) => example.ref === exampleRef) ?? null;
}

// Controls whose declared intent opens or toggles this element (the same typed intent the
// pathway projection already reads), so "opened by" needs no second relationship.
export function openersOf(lens, screenRef, elementRef) {
  const screen = lens.screens.find((entry) => entry.screenRef === screenRef);
  const target = [...(screen?.elements ?? [])].find((element) => element.ref === elementRef);
  if (!target?.symbol) return [];
  const local = target.symbol.split('.').pop();
  const pattern = new RegExp(`\\b(open|toggle)\\(\\s*(?:\\w+\\.)?${local}\\s*\\)`);
  const candidates = [...lens.chrome.flatMap((entry) => entry.elements), ...(screen?.elements ?? [])];
  return candidates.filter((element) => element.intent && pattern.test(element.intent));
}

// For a selection, an `else` choice realizes whichever registered child no other choice names.
export function selectionTargets(presence, childRefs) {
  const named = new Set(presence.choices.map((choice) => choice.targetRef).filter(Boolean));
  const remaining = childRefs.filter((ref) => !named.has(ref));
  return presence.choices.map((choice) => {
    if (choice.targetRef) return { ...choice, resolvedTargetRef: choice.targetRef, byElimination: false };
    if (choice.condition === 'else' && remaining.length === 1) return { ...choice, resolvedTargetRef: remaining[0], byElimination: true };
    return { ...choice, resolvedTargetRef: null, byElimination: false };
  });
}

/* ---------- scenario context (a plain value; the caller owns it) ---------- */

// The value a scenario gives a non-exhaustive condition to take none of its written choices.
export const NONE_CHOICE = 'NONE';

export function emptyRealizationContext() {
  return Object.freeze({ exampleRef: null, overrides: Object.freeze({}) });
}

export function withExample(context, exampleRef) {
  return Object.freeze({ ...context, exampleRef: exampleRef ?? null });
}

// Override values: PRESENTATION 'OPEN' | 'CLOSED'; SELECTION <child ref>; POPULATION 'EMPTY' | 'ITEMS';
// BRANCH / CASES / ALTERNATIVE <choice index as string>. null removes the override.
export function withOverride(context, presenceRef, value) {
  const overrides = { ...context.overrides };
  if (value === null || value === undefined) delete overrides[presenceRef];
  else overrides[presenceRef] = String(value);
  return Object.freeze({ ...context, overrides: Object.freeze(overrides) });
}

export function resetScenario(context) {
  return Object.freeze({ ...context, overrides: Object.freeze({}) });
}

/* ---------- resolution: one pass over presence, consumed by every face ---------- */

const RANK = { SOURCE: 0, EXAMPLE: 1, SCENARIO: 2 };
const strongerBy = (a, b) => (RANK[a] >= RANK[b] ? a : b);

export function resolvePresence(lens, screenRef, context = emptyRealizationContext()) {
  const screen = lens.screens.find((entry) => entry.screenRef === screenRef);
  if (!screen) fail(`unknown screen ${screenRef}`);
  const realization = screen.realization;
  const example = context.exampleRef ? exampleFor(lens, context.exampleRef) : null;
  const elements = new Map(screen.elements.map((element) => [element.ref, element]));
  const childrenOf = (ref) => screen.elements.filter((element) => element.parentRef === ref).map((element) => element.ref);
  const outcomes = new Map(); // presenceRef -> { realizedRefs:Set, latentRefs:Set, unknownRefs:Set, by, value, why }
  const exampleOpens = new Set((example?.setup ?? []).filter((step) => step.op === 'OPEN' && step.targetRef).map((step) => step.targetRef));
  const exampleSelects = new Map((example?.setup ?? []).filter((step) => step.op === 'SELECT' && step.containerRef && step.targetRef).map((step) => [step.containerRef, step.targetRef]));

  for (const presence of realization?.presence ?? []) {
    const override = context.overrides[presence.ref];
    const outcome = { realizedRefs: new Set(), latentRefs: new Set(), unknownRefs: new Set(), by: 'SOURCE', value: null, why: '' };
    if (presence.kind === 'PRESENTATION') {
      const subject = presence.subjectRef;
      let open = false;
      if (override === 'OPEN' || override === 'CLOSED') { open = override === 'OPEN'; outcome.by = 'SCENARIO'; } else if (subject && exampleOpens.has(subject)) { open = true; outcome.by = 'EXAMPLE'; }
      outcome.value = open ? 'OPEN' : 'CLOSED';
      outcome.why = open ? (outcome.by === 'SCENARIO' ? 'Opened in this scenario.' : `Opened by ${example?.ref}.`) : outcome.by === 'SCENARIO' ? 'Closed in this scenario.' : 'Closed by default; presentation state opens it.';
      const targets = [subject, ...presence.realizes].filter(Boolean);
      for (const ref of targets) (open ? outcome.realizedRefs : outcome.latentRefs).add(ref);
    } else if (presence.kind === 'SELECTION') {
      const children = presence.subjectRef ? childrenOf(presence.subjectRef) : [];
      const choices = selectionTargets(presence, children);
      let selected = presence.defaultRef ?? null;
      if (override && children.includes(override)) { selected = override; outcome.by = 'SCENARIO'; } else if (presence.subjectRef && exampleSelects.has(presence.subjectRef)) { selected = exampleSelects.get(presence.subjectRef); outcome.by = 'EXAMPLE'; }
      outcome.value = selected;
      outcome.why = selected ? `${outcome.by === 'SOURCE' ? 'Default' : outcome.by === 'EXAMPLE' ? `Selected by ${example?.ref}` : 'Selected in this scenario'}: ${elements.get(selected)?.label ?? selected}.` : 'No default child is declared.';
      for (const child of children) (child === selected ? outcome.realizedRefs : outcome.latentRefs).add(child);
      for (const choice of choices) {
        const isSelected = choice.resolvedTargetRef && choice.resolvedTargetRef === selected;
        const guard = choice.kind === 'GUARD';
        for (const ref of choice.realizes) {
          if (guard) outcome.unknownRefs.add(ref);
          else if (choice.resolvedTargetRef) (isSelected ? outcome.realizedRefs : outcome.latentRefs).add(ref);
        }
      }
      // A ref the selected choice realizes is presented, even if other choices realize it too (shared headers).
      for (const ref of outcome.realizedRefs) { outcome.latentRefs.delete(ref); outcome.unknownRefs.delete(ref); }
      outcome.choices = choices;
    } else if (presence.kind === 'POPULATION') {
      outcome.value = override === 'EMPTY' || override === 'ITEMS' ? override : 'UNKNOWN';
      if (override) outcome.by = 'SCENARIO';
      outcome.why = override === 'EMPTY' ? 'No items in this scenario.' : override === 'ITEMS' ? 'Items present in this scenario.' : example?.fixture?.functions?.length ? `Items come from source-owned data; ${example.ref} supplies a fixture (${example.fixture.functions.join(', ')}) whose contents stay typed Kotlin.` : 'Items come from source-owned data VexBoard has not observed.';
      for (const ref of presence.empty) (override === 'EMPTY' ? outcome.realizedRefs : override === 'ITEMS' ? outcome.latentRefs : outcome.unknownRefs).add(ref);
    } else {
      // NONE: a relationship that is not exhaustive (an `if` with no `else`) can also take none of
      // its written choices, and then realizes nothing.
      const none = override === NONE_CHOICE && !presence.exhaustive;
      const index = none ? -1 : override !== undefined ? Number(override) : null;
      outcome.value = none ? NONE_CHOICE : index ?? 'UNKNOWN';
      if (index !== null) outcome.by = 'SCENARIO';
      outcome.why = none ? `Scenario takes none of the written choices: ${presence.choices.map((choice) => choice.condition).join(' / ')} does not hold.` : index !== null ? `Scenario chooses: ${presence.choices[index]?.condition ?? '?'}` : 'A feature-owned condition decides; VexBoard does not evaluate it.';
      presence.choices.forEach((choice, choiceIndex) => {
        for (const ref of choice.realizes) {
          if (index === null) outcome.unknownRefs.add(ref);
          else if (choiceIndex === index) outcome.realizedRefs.add(ref);
          else outcome.latentRefs.add(ref);
        }
      });
      // A ref realized by more than one choice is decided only if the chosen choice realizes it.
      if (index !== null) for (const ref of outcome.realizedRefs) outcome.latentRefs.delete(ref);
      // Every choice of an exhaustive relationship realizing the same ref means the ref does not
      // depend on which one the feature takes.
      if (index === null && presence.exhaustive && presence.choices.length > 1) {
        for (const ref of [...outcome.unknownRefs]) {
          if (presence.choices.every((choice) => choice.realizes.includes(ref))) { outcome.unknownRefs.delete(ref); outcome.realizedRefs.add(ref); }
        }
      }
    }
    outcomes.set(presence.ref, outcome);
  }

  // Nested relationships matter only when their enclosing choice is realized. A gate that is not
  // realized hides the inner relationship (the outer one already marks its refs latent); an unknown
  // gate turns the inner relationship's certainty into dependence.
  const byRef = new Map((realization?.presence ?? []).map((presence) => [presence.ref, presence]));
  const gateState = (presence, seen = new Set()) => {
    const gate = presence.gate;
    if (!gate?.presenceRef || seen.has(presence.ref) || !byRef.has(gate.presenceRef)) return true;
    seen.add(presence.ref);
    const outer = byRef.get(gate.presenceRef);
    const parent = gateState(outer, seen);
    if (parent === false) return false;
    const outcome = outcomes.get(outer.ref);
    let own;
    if (outer.kind === 'PRESENTATION') own = outcome.value === 'OPEN';
    else if (outer.kind === 'SELECTION') {
      const choice = outcome.choices?.[gate.choice];
      own = choice?.kind === 'GUARD' ? null : choice?.resolvedTargetRef ? choice.resolvedTargetRef === outcome.value : null;
    } else own = outcome.value === 'UNKNOWN' ? null : Number(outcome.value) === gate.choice;
    if (own === false) return false;
    return parent === null || own === null ? null : true;
  };
  // What reaching an inner relationship took: a scenario or example that opened its enclosing
  // choice is also why the inner relationship presents anything.
  const chainBy = (presence) => {
    let by = 'SOURCE';
    const seen = new Set();
    for (let at = presence; at?.gate?.presenceRef && byRef.has(at.gate.presenceRef) && !seen.has(at.ref); at = byRef.get(at.gate.presenceRef)) {
      seen.add(at.ref);
      by = strongerBy(by, outcomes.get(at.gate.presenceRef).by);
    }
    return by;
  };
  for (const presence of realization?.presence ?? []) {
    const gated = gateState(presence);
    const outcome = outcomes.get(presence.ref);
    outcome.gate = gated;
    if (gated === true) outcome.by = strongerBy(outcome.by, chainBy(presence));
    if (gated === false) { outcome.realizedRefs.clear(); outcome.latentRefs.clear(); outcome.unknownRefs.clear(); outcome.why = `${outcome.why} (not reached: its enclosing choice is not realized)`; }
    else if (gated === null && outcome.by === 'SOURCE') { for (const ref of [...outcome.realizedRefs, ...outcome.latentRefs]) outcome.unknownRefs.add(ref); outcome.realizedRefs.clear(); outcome.latentRefs.clear(); }
  }

  const facts = new Map((realization?.elements ?? []).map((fact) => [fact.ref, fact]));
  const populationFor = (templateRef) => (realization?.presence ?? []).filter((presence) => presence.kind === 'POPULATION' && presence.templateRef === templateRef);
  const rendersTree = Boolean(realization?.rendersRegisteredTree) || realization?.status === 'BLUEPRINT';
  const traced = (ref) => rendersTree || facts.has(ref) || (realization?.presence ?? []).some((presence) => presence.subjectRef === ref || presence.realizes.includes(ref) || presence.choices.some((choice) => choice.realizes.includes(ref) || choice.targetRef === ref));

  // A relationship nested inside another (through gates) is the more specific site: when both name
  // the same element, the inner one decides (a sheet realizes its panels, its selection picks one).
  const enclosing = new Map();
  const enclosingOf = (presenceRef) => {
    if (enclosing.has(presenceRef)) return enclosing.get(presenceRef);
    const set = new Set();
    enclosing.set(presenceRef, set);
    const gate = byRef.get(presenceRef)?.gate?.presenceRef;
    if (gate && byRef.has(gate)) { set.add(gate); for (const ref of enclosingOf(gate)) set.add(ref); }
    return set;
  };
  const own = new Map();
  for (const element of screen.elements) {
    let causes = [];
    for (const [presenceRef, outcome] of outcomes) {
      if (outcome.latentRefs.has(element.ref)) causes.push({ presenceRef, realized: false, by: outcome.by });
      else if (outcome.realizedRefs.has(element.ref)) causes.push({ presenceRef, realized: true, by: outcome.by });
      else if (outcome.unknownRefs.has(element.ref)) causes.push({ presenceRef, realized: null, by: outcome.by });
    }
    if (causes.length > 1) {
      const outer = new Set(causes.flatMap((cause) => [...enclosingOf(cause.presenceRef)]));
      causes = causes.filter((cause) => !outer.has(cause.presenceRef));
    }
    const fact = facts.get(element.ref);
    const perInstance = Boolean(fact?.realizedIn.length) && !(fact.realizedBy.length && !fact.realizedIn.length);
    own.set(element.ref, { causes, perInstance, templates: fact?.realizedIn ?? [], traced: traced(element.ref) });
  }

  // Ancestors gate descendants: a closed sheet's controls are latent with it.
  const resolved = new Map();
  const resolve = (ref) => {
    if (resolved.has(ref)) return resolved.get(ref);
    const element = elements.get(ref);
    const mine = own.get(ref);
    const parent = element?.parentRef ? resolve(element.parentRef) : null;
    const causes = [...mine.causes];
    let state;
    // Nesting is already expressed by gates, so causes at this level are independent realization
    // sites: the element is presented if ANY site presents it, depends if any site might, else latent.
    const realizing = causes.filter((cause) => cause.realized === true);
    let by = 'SOURCE';
    for (const cause of realizing.length ? realizing : causes) by = strongerBy(by, cause.by);
    // A per-item element exists only when its population has items.
    const populations = mine.templates.flatMap((templateRef) => populationFor(templateRef).map((presence) => outcomes.get(presence.ref))).filter((outcome) => outcome && outcome.gate !== false);
    const itemState = !mine.perInstance || !populations.length ? null
      : populations.some((outcome) => outcome.value === 'ITEMS') ? 'SCENARIO'
        : populations.every((outcome) => outcome.value === 'EMPTY') ? 'LATENT' : 'DEPENDS';
    // A registration parent gates an element only when no realization site of its own presents it:
    // a control registered under one container can be realized inside another (a sheet, a header).
    if (parent && (parent.state === 'LATENT' || parent.state === 'HELD') && !mine.perInstance && !realizing.length) state = 'LATENT';
    else if (!realizing.length && causes.some((cause) => cause.realized === null)) state = 'DEPENDS';
    else if (!realizing.length && causes.length) state = 'LATENT';
    else if (!mine.traced && !mine.perInstance && !causes.length) state = 'UNTRACED';
    else if (parent?.state === 'DEPENDS' && !mine.perInstance && !realizing.length) state = 'DEPENDS';
    else state = by === 'SCENARIO' ? 'SCENARIO' : by === 'EXAMPLE' ? 'EXAMPLE' : (parent?.state === 'EXAMPLE' || parent?.state === 'SCENARIO') ? parent.state : 'SOURCE';
    if (itemState && state !== 'LATENT') state = itemState === 'SCENARIO' ? 'SCENARIO' : itemState === 'LATENT' ? 'LATENT' : state === 'SOURCE' ? 'DEPENDS' : state;
    const entry = { ref, state, by, causes, perInstance: mine.perInstance, templates: mine.templates, populations: mine.templates.flatMap((templateRef) => populationFor(templateRef).map((presence) => presence.ref)) };
    resolved.set(ref, entry);
    return entry;
  };
  for (const element of screen.elements) resolve(element.ref);

  return Object.freeze({
    screenRef,
    context,
    example,
    presence: outcomes,
    elements: resolved,
    untracedCount: [...resolved.values()].filter((entry) => entry.state === 'UNTRACED').length,
  });
}

// Every population whose list is bound to this registered container, directly or through the
// selection choice whose realizer also realizes the population (placement by realizer is flagged).
export function populationsAt(lens, screenRef, elementRef) {
  const realization = realizationOf(lens, screenRef);
  if (!realization) return [];
  const direct = realization.presence.filter((presence) => presence.kind === 'POPULATION' && presence.subjectRef === elementRef && presence.list?.identity === 'REGISTERED');
  const screen = lens.screens.find((entry) => entry.screenRef === screenRef);
  const parentRef = screen.elements.find((element) => element.ref === elementRef)?.parentRef ?? null;
  const placed = [];
  for (const selection of realization.presence.filter((presence) => presence.kind === 'SELECTION' && presence.subjectRef === parentRef)) {
    const children = screen.elements.filter((element) => element.parentRef === parentRef).map((element) => element.ref);
    for (const choice of selectionTargets(selection, children)) {
      if (choice.resolvedTargetRef !== elementRef || !choice.realizedBy) continue;
      for (const presence of realization.presence) {
        if (presence.kind !== 'POPULATION' || presence.realizedBy !== choice.realizedBy || direct.includes(presence)) continue;
        placed.push({ presence, placement: choice.byElimination ? 'REALIZER_BY_ELIMINATION' : 'REALIZER' });
      }
    }
  }
  // A list without registered identity, realized inside this registered element's own realization
  // (its nearest registered ancestor in source), is drawn here too.
  const lexical = realization.presence.filter((presence) => presence.kind === 'POPULATION' && presence.subjectRef === elementRef && !direct.includes(presence) && !placed.some((entry) => entry.presence === presence));
  return [...direct.map((presence) => ({ presence, placement: 'LIST_IDENTITY' })), ...placed, ...lexical.map((presence) => ({ presence, placement: 'WITHIN' }))];
}

export function templateOf(lens, screenRef, templateRef) {
  return realizationOf(lens, screenRef)?.templates.find((template) => template.ref === templateRef) ?? null;
}

// GitHub serves a file at an exact commit through the repository's own /raw/ route.
export function evidenceUrl(lens, path) {
  const base = lens.sourceSnapshot.repositoryUrl;
  const commit = lens.sourceSnapshot.commit;
  if (!base || !commit || !path) return null;
  return `${base.replace(/\/$/, '')}/raw/${commit}/${path.split('/').map(encodeURIComponent).join('/')}`;
}

// [VXG RealForever][VEXWORK][VEXBOARD][SCREEN-LENS][REALIZATION-PROJECTION]