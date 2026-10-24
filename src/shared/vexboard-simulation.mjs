import { freezeBoardValue, normalizeBoardGraph } from './vexboard-model.mjs';
import { advanceBoardJourney, backBoardJourney, normalizeBoardJourney } from './vexboard-journey.mjs';

export const BOARD_PROTOTYPE_SCHEMA = 'vexboard.board-prototype/v1';
export const BOARD_SCENARIO_SCHEMA = 'vexboard.board-scenario/v1';
export const BOARD_SIMULATION_RESULT_SCHEMA = 'vexboard.board-simulation-result/v1';

export const BOARD_INTERACTION_TRIGGERS = Object.freeze([
  'CLICK',
  'SUBMIT',
  'CHANGE',
  'ENTER',
  'BACK',
]);

export const BOARD_CONDITION_OPERATORS = Object.freeze([
  'EQUALS',
  'NOT_EQUALS',
  'TRUTHY',
  'FALSY',
]);

export const BOARD_CONDITION_STATES = Object.freeze([
  'TRUE',
  'FALSE',
  'UNKNOWN',
]);

export const BOARD_SIMULATED_ACTION_KINDS = Object.freeze([
  'NAVIGATE_TO_SCENE',
  'FOCUS_NODE',
  'OPEN_OVERLAY',
  'CLOSE_OVERLAY',
  'SET_SCENARIO_VALUE',
  'RETURN',
  'EMIT_SIMULATED_EVENT',
]);

const REF = /^[A-Za-z0-9][A-Za-z0-9._:/-]*$/u;

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function compareCanonicalText(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function exactKeys(value, keys, label) {
  assert(isObject(value), `${label} must be one object`);
  const actual = Object.keys(value).sort(compareCanonicalText);
  const expected = [...keys].sort(compareCanonicalText);
  assert(JSON.stringify(actual) === JSON.stringify(expected), `${label} schema drift`);
}

function stableRef(value, label) {
  assert(typeof value === 'string' && REF.test(value), `${label} must be one stable ref`);
  return value;
}

function refs(values, label) {
  assert(Array.isArray(values), `${label} must be an array`);
  const result = values.map((value, index) => stableRef(value, `${label}[${index}]`));
  assert(new Set(result).size === result.length, `${label} must be unique`);
  return [...result].sort(compareCanonicalText);
}

function primitiveValue(value, label) {
  const valid = value === null
    || typeof value === 'string'
    || typeof value === 'boolean'
    || (typeof value === 'number' && Number.isFinite(value));
  assert(valid, `${label} must be one JSON primitive`);
  return typeof value === 'number' && Object.is(value, -0) ? 0 : value;
}

function graphValue(input) {
  const value = structuredClone(input);
  delete value.semanticFingerprint;
  return normalizeBoardGraph(value);
}

function normalizeOverlay(input) {
  exactKeys(input, ['overlayRef', 'label', 'sourceRefs'], 'prototype overlay');
  const overlayRef = stableRef(input.overlayRef, 'prototype overlay.overlayRef');
  assert(typeof input.label === 'string' && input.label.trim(), `overlay ${overlayRef} label required`);
  return {
    overlayRef,
    label: input.label,
    sourceRefs: refs(input.sourceRefs, `overlay ${overlayRef}.sourceRefs`),
  };
}

function normalizeCondition(input, label) {
  exactKeys(input, ['conditionRef', 'valueRef', 'operator', 'expectedValueOrNull'], label);
  const conditionRef = stableRef(input.conditionRef, `${label}.conditionRef`);
  const valueRef = stableRef(input.valueRef, `${label}.valueRef`);
  assert(BOARD_CONDITION_OPERATORS.includes(input.operator), `${label}.operator invalid`);
  const expectedValueOrNull = primitiveValue(input.expectedValueOrNull, `${label}.expectedValueOrNull`);
  if (['TRUTHY', 'FALSY'].includes(input.operator)) {
    assert(expectedValueOrNull === null, `${label}.${input.operator} cannot carry an expected value`);
  }
  return {
    conditionRef,
    valueRef,
    operator: input.operator,
    expectedValueOrNull,
  };
}

function normalizeAction(input, { graph, controlRef, overlayRefs }, label) {
  exactKeys(input, ['actionRef', 'kind', 'arguments'], label);
  const actionRef = stableRef(input.actionRef, `${label}.actionRef`);
  assert(BOARD_SIMULATED_ACTION_KINDS.includes(input.kind), `${label}.kind invalid`);
  assert(isObject(input.arguments), `${label}.arguments must be one object`);
  let args;

  if (input.kind === 'NAVIGATE_TO_SCENE') {
    exactKeys(input.arguments, ['relationshipRef'], `${label}.arguments`);
    const relationshipRef = stableRef(input.arguments.relationshipRef, `${label}.arguments.relationshipRef`);
    const relationship = graph.relationships.find((candidate) => candidate.relationshipRef === relationshipRef);
    assert(relationship, `${label} relationship missing: ${relationshipRef}`);
    assert(relationship.fromRef === controlRef,
      `${label} relationship ${relationshipRef} must leave control ${controlRef}`);
    assert(relationship.kind === 'TRANSITION',
      `${label} NAVIGATE_TO_SCENE relationship must be TRANSITION`);
    const target = graph.nodes.find((node) => node.nodeRef === relationship.toRef);
    assert(target?.kind === 'SCENE', `${label} NAVIGATE_TO_SCENE target must be SCENE`);
    args = { relationshipRef };
  } else if (input.kind === 'FOCUS_NODE') {
    exactKeys(input.arguments, ['semanticRef'], `${label}.arguments`);
    const semanticRef = stableRef(input.arguments.semanticRef, `${label}.arguments.semanticRef`);
    assert(graph.nodes.some((node) => node.nodeRef === semanticRef), `${label} focus node missing: ${semanticRef}`);
    args = { semanticRef };
  } else if (['OPEN_OVERLAY', 'CLOSE_OVERLAY'].includes(input.kind)) {
    exactKeys(input.arguments, ['overlayRef'], `${label}.arguments`);
    const overlayRef = stableRef(input.arguments.overlayRef, `${label}.arguments.overlayRef`);
    assert(overlayRefs.has(overlayRef), `${label} overlay missing: ${overlayRef}`);
    args = { overlayRef };
  } else if (input.kind === 'SET_SCENARIO_VALUE') {
    exactKeys(input.arguments, ['valueRef', 'value'], `${label}.arguments`);
    args = {
      valueRef: stableRef(input.arguments.valueRef, `${label}.arguments.valueRef`),
      value: primitiveValue(input.arguments.value, `${label}.arguments.value`),
    };
  } else if (input.kind === 'RETURN') {
    exactKeys(input.arguments, [], `${label}.arguments`);
    args = {};
  } else if (input.kind === 'EMIT_SIMULATED_EVENT') {
    exactKeys(input.arguments, ['eventRef'], `${label}.arguments`);
    args = { eventRef: stableRef(input.arguments.eventRef, `${label}.arguments.eventRef`) };
  }

  return { actionRef, kind: input.kind, arguments: args };
}

function normalizeInteraction(input, context, index) {
  const label = `prototype interaction ${index}`;
  exactKeys(input, ['interactionRef', 'controlRef', 'trigger', 'conditionOrNull', 'actions', 'sourceRefs'], label);
  const interactionRef = stableRef(input.interactionRef, `${label}.interactionRef`);
  const controlRef = stableRef(input.controlRef, `${label}.controlRef`);
  const control = context.graph.nodes.find((node) => node.nodeRef === controlRef);
  assert(control?.kind === 'CONTROL', `${label} controlRef must reference one CONTROL node`);
  assert(BOARD_INTERACTION_TRIGGERS.includes(input.trigger), `${label}.trigger invalid`);
  const conditionOrNull = input.conditionOrNull === null
    ? null
    : normalizeCondition(input.conditionOrNull, `${label}.conditionOrNull`);
  assert(Array.isArray(input.actions) && input.actions.length > 0, `${label}.actions must be non-empty`);
  const actions = input.actions.map((action, actionIndex) => normalizeAction(
    action,
    { ...context, controlRef },
    `${label}.actions[${actionIndex}]`,
  ));
  const traversalIndexes = actions
    .map((action, actionIndex) => ['NAVIGATE_TO_SCENE', 'RETURN'].includes(action.kind) ? actionIndex : -1)
    .filter((actionIndex) => actionIndex >= 0);
  assert(traversalIndexes.length <= 1, `${label} may contain at most one semantic traversal action`);
  if (traversalIndexes.length === 1) {
    assert(traversalIndexes[0] === actions.length - 1, `${label} semantic traversal action must be last`);
  }
  return {
    interactionRef,
    controlRef,
    trigger: input.trigger,
    conditionOrNull,
    actions,
    sourceRefs: refs(input.sourceRefs, `${label}.sourceRefs`),
  };
}

export function normalizeBoardPrototype(input, graphInput) {
  exactKeys(input, ['schemaVersion', 'prototypeRef', 'graphRef', 'interactions', 'overlays', 'sourceRefs'], 'BoardPrototype');
  assert(input.schemaVersion === BOARD_PROTOTYPE_SCHEMA, 'BoardPrototype schema mismatch');
  const graph = graphValue(graphInput);
  const prototypeRef = stableRef(input.prototypeRef, 'prototypeRef');
  const graphRef = stableRef(input.graphRef, 'prototype.graphRef');
  assert(graphRef === graph.graphRef, 'BoardPrototype graphRef mismatch');
  assert(Array.isArray(input.overlays), 'BoardPrototype overlays must be an array');
  const overlays = input.overlays.map(normalizeOverlay)
    .sort((left, right) => compareCanonicalText(left.overlayRef, right.overlayRef));
  const overlayRefs = new Set(overlays.map((overlay) => overlay.overlayRef));
  assert(overlayRefs.size === overlays.length, 'BoardPrototype overlayRef must be unique');
  assert(Array.isArray(input.interactions), 'BoardPrototype interactions must be an array');
  const interactions = input.interactions.map((interaction, index) => normalizeInteraction(
    interaction,
    { graph, overlayRefs },
    index,
  )).sort((left, right) => compareCanonicalText(left.interactionRef, right.interactionRef));
  assert(new Set(interactions.map((interaction) => interaction.interactionRef)).size === interactions.length,
    'BoardPrototype interactionRef must be unique');
  const conditionRefs = interactions
    .map((interaction) => interaction.conditionOrNull?.conditionRef)
    .filter(Boolean);
  assert(new Set(conditionRefs).size === conditionRefs.length, 'BoardPrototype conditionRef must be unique');
  const actionRefs = interactions.flatMap((interaction) => interaction.actions.map((action) => action.actionRef));
  assert(new Set(actionRefs).size === actionRefs.length, 'BoardPrototype actionRef must be unique');
  return freezeBoardValue({
    schemaVersion: BOARD_PROTOTYPE_SCHEMA,
    prototypeRef,
    graphRef,
    interactions,
    overlays,
    sourceRefs: refs(input.sourceRefs, 'BoardPrototype.sourceRefs'),
  });
}

function declaredScenarioValueRefs(prototype) {
  return new Set(prototype.interactions.flatMap((interaction) => [
    ...(interaction.conditionOrNull ? [interaction.conditionOrNull.valueRef] : []),
    ...interaction.actions
      .filter((action) => action.kind === 'SET_SCENARIO_VALUE')
      .map((action) => action.arguments.valueRef),
  ]));
}

function normalizeScenarioValue(input, index) {
  exactKeys(input, ['valueRef', 'value'], `scenario value ${index}`);
  return {
    valueRef: stableRef(input.valueRef, `scenario value ${index}.valueRef`),
    value: primitiveValue(input.value, `scenario value ${index}.value`),
  };
}

export function normalizeBoardScenario(input, prototypeInput, graphInput) {
  const prototype = normalizeBoardPrototype(prototypeInput, graphInput);
  exactKeys(input, ['schemaVersion', 'scenarioRef', 'prototypeRef', 'values', 'openOverlayRefs'], 'BoardScenario');
  assert(input.schemaVersion === BOARD_SCENARIO_SCHEMA, 'BoardScenario schema mismatch');
  const scenarioRef = stableRef(input.scenarioRef, 'scenarioRef');
  const prototypeRef = stableRef(input.prototypeRef, 'scenario.prototypeRef');
  assert(prototypeRef === prototype.prototypeRef, 'BoardScenario prototypeRef mismatch');
  assert(Array.isArray(input.values), 'BoardScenario values must be an array');
  const values = input.values.map(normalizeScenarioValue)
    .sort((left, right) => compareCanonicalText(left.valueRef, right.valueRef));
  assert(new Set(values.map((entry) => entry.valueRef)).size === values.length, 'BoardScenario valueRef must be unique');
  const declaredValues = declaredScenarioValueRefs(prototype);
  for (const entry of values) {
    assert(declaredValues.has(entry.valueRef), `BoardScenario undeclared valueRef: ${entry.valueRef}`);
  }
  const openOverlayRefs = refs(input.openOverlayRefs, 'BoardScenario.openOverlayRefs');
  const overlayRefs = new Set(prototype.overlays.map((overlay) => overlay.overlayRef));
  for (const overlayRef of openOverlayRefs) {
    assert(overlayRefs.has(overlayRef), `BoardScenario open overlay missing: ${overlayRef}`);
  }
  return freezeBoardValue({
    schemaVersion: BOARD_SCENARIO_SCHEMA,
    scenarioRef,
    prototypeRef,
    values,
    openOverlayRefs,
  });
}

export function createBoardScenario(prototypeInput, graphInput, { scenarioRef, values = [] }) {
  const prototype = normalizeBoardPrototype(prototypeInput, graphInput);
  return normalizeBoardScenario({
    schemaVersion: BOARD_SCENARIO_SCHEMA,
    scenarioRef: stableRef(scenarioRef, 'scenarioRef'),
    prototypeRef: prototype.prototypeRef,
    values,
    openOverlayRefs: [],
  }, prototype, graphInput);
}

function scenarioValue(scenario, valueRef) {
  const entry = scenario.values.find((candidate) => candidate.valueRef === valueRef);
  return entry ? { present: true, value: entry.value } : { present: false, value: null };
}

export function evaluateBoardCondition(conditionInput, scenarioInput, prototypeInput, graphInput) {
  const prototype = normalizeBoardPrototype(prototypeInput, graphInput);
  const scenario = normalizeBoardScenario(scenarioInput, prototype, graphInput);
  const condition = normalizeCondition(conditionInput, 'condition');
  const declaredCondition = prototype.interactions
    .map((interaction) => interaction.conditionOrNull)
    .find((candidate) => candidate?.conditionRef === condition.conditionRef);
  assert(declaredCondition, `condition not declared by prototype: ${condition.conditionRef}`);
  assert(JSON.stringify(condition) === JSON.stringify(declaredCondition),
    `condition does not match prototype declaration: ${condition.conditionRef}`);
  const observed = scenarioValue(scenario, condition.valueRef);
  if (!observed.present) return 'UNKNOWN';
  if (condition.operator === 'EQUALS') return Object.is(observed.value, condition.expectedValueOrNull) ? 'TRUE' : 'FALSE';
  if (condition.operator === 'NOT_EQUALS') return Object.is(observed.value, condition.expectedValueOrNull) ? 'FALSE' : 'TRUE';
  if (condition.operator === 'TRUTHY') return observed.value ? 'TRUE' : 'FALSE';
  return observed.value ? 'FALSE' : 'TRUE';
}

export function boardInteractionChoices(graphInput, prototypeInput, scenarioInput, { controlRef, trigger }) {
  const graph = graphValue(graphInput);
  const prototype = normalizeBoardPrototype(prototypeInput, graph);
  const scenario = normalizeBoardScenario(scenarioInput, prototype, graph);
  const ref = stableRef(controlRef, 'controlRef');
  const control = graph.nodes.find((node) => node.nodeRef === ref);
  assert(control?.kind === 'CONTROL', 'controlRef must reference one CONTROL node');
  assert(BOARD_INTERACTION_TRIGGERS.includes(trigger), 'trigger invalid');
  return freezeBoardValue(prototype.interactions
    .filter((interaction) => interaction.controlRef === ref && interaction.trigger === trigger)
    .map((interaction) => ({
      interactionRef: interaction.interactionRef,
      controlRef: interaction.controlRef,
      trigger: interaction.trigger,
      conditionRefOrNull: interaction.conditionOrNull?.conditionRef ?? null,
      conditionState: interaction.conditionOrNull === null
        ? 'TRUE'
        : evaluateBoardCondition(interaction.conditionOrNull, scenario, prototype, graph),
    })));
}

function nextScenario(prototype, graph, scenario, values, openOverlayRefs) {
  return normalizeBoardScenario({
    schemaVersion: BOARD_SCENARIO_SCHEMA,
    scenarioRef: scenario.scenarioRef,
    prototypeRef: scenario.prototypeRef,
    values: [...values.entries()].map(([valueRef, value]) => ({ valueRef, value })),
    openOverlayRefs: [...openOverlayRefs],
  }, prototype, graph);
}

export function applyBoardInteraction({ graph: graphInput, journey: journeyInput, prototype: prototypeInput, scenario: scenarioInput, interactionRef }) {
  const graph = graphValue(graphInput);
  const prototype = normalizeBoardPrototype(prototypeInput, graph);
  const scenario = normalizeBoardScenario(scenarioInput, prototype, graph);
  let journey = normalizeBoardJourney(journeyInput, graph);
  const ref = stableRef(interactionRef, 'interactionRef');
  const interaction = prototype.interactions.find((candidate) => candidate.interactionRef === ref);
  assert(interaction, `BoardInteraction missing: ${ref}`);
  assert(journey.currentRef === interaction.controlRef,
    `BoardInteraction ${ref} requires currentRef ${interaction.controlRef}`);
  const conditionState = interaction.conditionOrNull === null
    ? 'TRUE'
    : evaluateBoardCondition(interaction.conditionOrNull, scenario, prototype, graph);
  assert(conditionState === 'TRUE', `BoardInteraction ${ref} condition is ${conditionState}`);

  const values = new Map(scenario.values.map((entry) => [entry.valueRef, entry.value]));
  const openOverlayRefs = new Set(scenario.openOverlayRefs);
  let focusRefOrNull = null;
  const emittedEventRefs = [];

  for (const action of interaction.actions) {
    if (action.kind === 'SET_SCENARIO_VALUE') {
      values.set(action.arguments.valueRef, action.arguments.value);
    } else if (action.kind === 'OPEN_OVERLAY') {
      openOverlayRefs.add(action.arguments.overlayRef);
    } else if (action.kind === 'CLOSE_OVERLAY') {
      openOverlayRefs.delete(action.arguments.overlayRef);
    } else if (action.kind === 'FOCUS_NODE') {
      focusRefOrNull = action.arguments.semanticRef;
    } else if (action.kind === 'EMIT_SIMULATED_EVENT') {
      emittedEventRefs.push(action.arguments.eventRef);
    } else if (action.kind === 'NAVIGATE_TO_SCENE') {
      journey = advanceBoardJourney(graph, journey, action.arguments.relationshipRef);
    } else if (action.kind === 'RETURN') {
      journey = backBoardJourney(graph, journey);
    }
  }

  const next = nextScenario(prototype, graph, scenario, values, openOverlayRefs);
  return freezeBoardValue({
    schemaVersion: BOARD_SIMULATION_RESULT_SCHEMA,
    interactionRef: interaction.interactionRef,
    trigger: interaction.trigger,
    conditionState,
    journey,
    scenario: next,
    focusRefOrNull,
    emittedEventRefs,
    effects: {
      externalEffectsPerformed: false,
    },
  });
}

// [VXG RealForever][VEXWORK][VEXBOARD][PROTOTYPE-SIMULATION]
