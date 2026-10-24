import { freezeBoardValue, normalizeBoardGraph } from './vexboard-model.mjs';

export const BOARD_JOURNEY_SCHEMA = 'vexboard.board-journey/v1';
export const BOARD_JOURNEY_NAVIGATION_KINDS = Object.freeze([
  'START',
  'RELATIONSHIP',
  'BACK',
  'REVISIT',
]);

const REF = /^[A-Za-z0-9][A-Za-z0-9._:/-]*$/u;

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function exactKeys(value, keys, label) {
  assert(isObject(value), `${label} must be one object`);
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  assert(JSON.stringify(actual) === JSON.stringify(expected), `${label} schema drift`);
}

function stableRef(value, label) {
  assert(typeof value === 'string' && REF.test(value), `${label} must be one stable ref`);
  return value;
}

function graphValue(input) {
  const value = structuredClone(input);
  delete value.semanticFingerprint;
  return normalizeBoardGraph(value);
}

function normalizeStep(input, index, nodeRefs, relationshipRefs) {
  exactKeys(input, ['sequence', 'semanticRef', 'navigationKind', 'viaRelationshipRefOrNull'], `journey step ${index}`);
  assert(Number.isInteger(input.sequence) && input.sequence === index, `journey step ${index} sequence mismatch`);
  const semanticRef = stableRef(input.semanticRef, `journey step ${index}.semanticRef`);
  assert(nodeRefs.has(semanticRef), `journey step ${index} semanticRef missing: ${semanticRef}`);
  assert(BOARD_JOURNEY_NAVIGATION_KINDS.includes(input.navigationKind), `journey step ${index} navigationKind invalid`);
  const viaRelationshipRefOrNull = input.viaRelationshipRefOrNull === null
    ? null
    : stableRef(input.viaRelationshipRefOrNull, `journey step ${index}.viaRelationshipRefOrNull`);
  if (viaRelationshipRefOrNull !== null) {
    assert(relationshipRefs.has(viaRelationshipRefOrNull), `journey step ${index} relationship missing: ${viaRelationshipRefOrNull}`);
  }
  if (index === 0) {
    assert(input.navigationKind === 'START', 'first journey step must be START');
    assert(viaRelationshipRefOrNull === null, 'first journey step cannot carry a relationship');
  } else {
    assert(input.navigationKind !== 'START', `journey step ${index} cannot restart an existing journey`);
  }
  if (input.navigationKind === 'RELATIONSHIP') {
    assert(viaRelationshipRefOrNull !== null, `journey step ${index} relationship traversal requires a relationship ref`);
  } else if (index > 0) {
    assert(viaRelationshipRefOrNull === null, `journey step ${index} ${input.navigationKind} cannot carry a relationship ref`);
  }
  return {
    sequence: input.sequence,
    semanticRef,
    navigationKind: input.navigationKind,
    viaRelationshipRefOrNull,
  };
}

export function normalizeBoardJourney(input, graphInput) {
  exactKeys(input, ['schemaVersion', 'journeyRef', 'boardRef', 'currentRef', 'steps', 'returnStack'], 'BoardJourney');
  assert(input.schemaVersion === BOARD_JOURNEY_SCHEMA, 'BoardJourney schema mismatch');
  const graph = graphValue(graphInput);
  const nodeRefs = new Set(graph.nodes.map((node) => node.nodeRef));
  const relationshipRefs = new Set(graph.relationships.map((relationship) => relationship.relationshipRef));
  const journeyRef = stableRef(input.journeyRef, 'journeyRef');
  const boardRef = stableRef(input.boardRef, 'boardRef');
  const currentRef = stableRef(input.currentRef, 'currentRef');
  assert(nodeRefs.has(currentRef), `BoardJourney currentRef missing: ${currentRef}`);
  assert(Array.isArray(input.steps) && input.steps.length > 0, 'BoardJourney steps must be non-empty');
  const steps = input.steps.map((step, index) => normalizeStep(step, index, nodeRefs, relationshipRefs));
  assert(steps.at(-1).semanticRef === currentRef, 'BoardJourney currentRef must equal the last journey step');
  assert(Array.isArray(input.returnStack), 'BoardJourney returnStack must be an array');
  const returnStack = input.returnStack.map((ref, index) => {
    const value = stableRef(ref, `BoardJourney.returnStack[${index}]`);
    assert(nodeRefs.has(value), `BoardJourney returnStack ref missing: ${value}`);
    return value;
  });

  const relationshipByRef = new Map(graph.relationships.map((relationship) => [relationship.relationshipRef, relationship]));
  const reconstructedReturnStack = [];
  for (let index = 1; index < steps.length; index += 1) {
    const prior = steps[index - 1];
    const step = steps[index];
    if (step.navigationKind === 'RELATIONSHIP') {
      const relationship = relationshipByRef.get(step.viaRelationshipRefOrNull);
      assert(relationship.fromRef === prior.semanticRef,
        `journey step ${index} relationship origin mismatch: ${relationship.fromRef} != ${prior.semanticRef}`);
      assert(relationship.toRef === step.semanticRef,
        `journey step ${index} relationship destination mismatch: ${relationship.toRef} != ${step.semanticRef}`);
      reconstructedReturnStack.push(prior.semanticRef);
    } else if (step.navigationKind === 'BACK') {
      assert(reconstructedReturnStack.length > 0, `journey step ${index} BACK has no return coordinate`);
      const expectedRef = reconstructedReturnStack.pop();
      assert(step.semanticRef === expectedRef,
        `journey step ${index} BACK target mismatch: ${step.semanticRef} != ${expectedRef}`);
    } else if (step.navigationKind === 'REVISIT') {
      assert(steps.slice(0, index).some((priorStep) => priorStep.semanticRef === step.semanticRef),
        `journey step ${index} REVISIT target was not previously visited: ${step.semanticRef}`);
      reconstructedReturnStack.push(prior.semanticRef);
    }
  }
  assert(JSON.stringify(returnStack) === JSON.stringify(reconstructedReturnStack),
    'BoardJourney returnStack does not match journey history');
  return freezeBoardValue({
    schemaVersion: BOARD_JOURNEY_SCHEMA,
    journeyRef,
    boardRef,
    currentRef,
    steps,
    returnStack,
  });
}

export function createBoardJourney(graphInput, { journeyRef, boardRef, startRef }) {
  const graph = graphValue(graphInput);
  const start = stableRef(startRef, 'startRef');
  assert(graph.nodes.some((node) => node.nodeRef === start), `BoardJourney startRef missing: ${start}`);
  return normalizeBoardJourney({
    schemaVersion: BOARD_JOURNEY_SCHEMA,
    journeyRef: stableRef(journeyRef, 'journeyRef'),
    boardRef: stableRef(boardRef, 'boardRef'),
    currentRef: start,
    steps: [{
      sequence: 0,
      semanticRef: start,
      navigationKind: 'START',
      viaRelationshipRefOrNull: null,
    }],
    returnStack: [],
  }, graph);
}

export function journeyChoices(graphInput, journeyInput) {
  const graph = graphValue(graphInput);
  const journey = normalizeBoardJourney(journeyInput, graph);
  return freezeBoardValue(graph.relationships
    .filter((relationship) => relationship.fromRef === journey.currentRef)
    .sort((left, right) => left.relationshipRef.localeCompare(right.relationshipRef))
    .map((relationship) => ({
      relationshipRef: relationship.relationshipRef,
      kind: relationship.kind,
      labelOrNull: relationship.labelOrNull,
      fromRef: relationship.fromRef,
      toRef: relationship.toRef,
    })));
}

function appendStep(graph, journey, { semanticRef, navigationKind, viaRelationshipRefOrNull, returnStack }) {
  return normalizeBoardJourney({
    ...journey,
    currentRef: semanticRef,
    steps: [...journey.steps, {
      sequence: journey.steps.length,
      semanticRef,
      navigationKind,
      viaRelationshipRefOrNull,
    }],
    returnStack,
  }, graph);
}

export function advanceBoardJourney(graphInput, journeyInput, relationshipRef) {
  const graph = graphValue(graphInput);
  const journey = normalizeBoardJourney(journeyInput, graph);
  const ref = stableRef(relationshipRef, 'relationshipRef');
  const relationship = graph.relationships.find((candidate) => candidate.relationshipRef === ref);
  assert(relationship, `BoardJourney relationship missing: ${ref}`);
  assert(relationship.fromRef === journey.currentRef,
    `BoardJourney relationship ${ref} does not leave currentRef ${journey.currentRef}`);
  return appendStep(graph, journey, {
    semanticRef: relationship.toRef,
    navigationKind: 'RELATIONSHIP',
    viaRelationshipRefOrNull: relationship.relationshipRef,
    returnStack: [...journey.returnStack, journey.currentRef],
  });
}

export function backBoardJourney(graphInput, journeyInput) {
  const graph = graphValue(graphInput);
  const journey = normalizeBoardJourney(journeyInput, graph);
  assert(journey.returnStack.length > 0, 'BoardJourney return stack is empty');
  const targetRef = journey.returnStack.at(-1);
  return appendStep(graph, journey, {
    semanticRef: targetRef,
    navigationKind: 'BACK',
    viaRelationshipRefOrNull: null,
    returnStack: journey.returnStack.slice(0, -1),
  });
}

export function revisitBoardJourney(graphInput, journeyInput, sequence) {
  const graph = graphValue(graphInput);
  const journey = normalizeBoardJourney(journeyInput, graph);
  assert(Number.isInteger(sequence) && sequence >= 0 && sequence < journey.steps.length,
    `BoardJourney revisit sequence invalid: ${sequence}`);
  const targetRef = journey.steps[sequence].semanticRef;
  return appendStep(graph, journey, {
    semanticRef: targetRef,
    navigationKind: 'REVISIT',
    viaRelationshipRefOrNull: null,
    returnStack: [...journey.returnStack, journey.currentRef],
  });
}

// [VXG RealForever][VEXWORK][VEXBOARD][BOARDJOURNEY]
