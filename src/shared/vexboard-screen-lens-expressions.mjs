import {
  SCREEN_LENS_SCHEMA,
  elementFor,
  faceGraph,
  pathwayFor,
  screenFor,
} from './vexboard-screen-lens.mjs';

export const SCREEN_LENS_EXPRESSION_FIXTURE_SCHEMA =
  'vexboard.screen-lens-expression-fixture/v1';
export const SCREEN_LENS_EXPRESSION_RESOLUTION_SCHEMA =
  'vexboard.screen-lens-expression-resolution/v1';

export const PROJECTABILITY_RELATIONSHIP_KINDS = Object.freeze([
  'REGISTERED',
  'REALIZED_AS',
  'SELECTS',
  'PRESENTS',
  'POPULATES',
  'CONDITIONED_BY',
  'EVIDENCED_BY',
]);

export const EXPRESSION_BASES = Object.freeze([
  'SOURCE_DEFAULT',
  'SOURCE_AXIS',
  'SOURCE_COUPLED',
  'EVIDENCE',
]);

const AXIS_KINDS = new Set([
  'SELECTS',
  'PRESENTS',
  'POPULATES',
  'CONDITIONED_BY',
]);

const BEHAVIOR_KINDS = new Set([
  'SELECTS',
  'PRESENTS',
  'CONDITIONED_BY',
]);

const DEPTH_KINDS = new Set([
  'POPULATES',
  'CONDITIONED_BY',
]);

function fail(message) {
  throw new TypeError(`screen lens expressions: ${message}`);
}

function text(value, label) {
  if (typeof value !== 'string' || !value.trim()) fail(`${label} must be a non-empty string`);
  return value;
}

function optionalText(value, label) {
  if (value === undefined || value === null) return null;
  return text(value, label);
}

function strings(values, label) {
  if (values === undefined || values === null) return [];
  if (!Array.isArray(values)) fail(`${label} must be an array`);
  const out = values.map((value, index) => text(value, `${label}[${index}]`));
  if (new Set(out).size !== out.length) fail(`${label} must not contain duplicates`);
  return out;
}

function freezeDeep(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(freezeDeep);
    Object.freeze(value);
  }
  return value;
}

function requireElement(lens, ref, label) {
  if (!elementFor(lens, ref)) fail(`${label} references unknown element ${ref}`);
  return ref;
}

function requirePathway(lens, ref, label) {
  if (!pathwayFor(lens, ref)) fail(`${label} references unknown pathway ${ref}`);
  return ref;
}

function normalizeRuntimeItem(lens, input, owner) {
  const itemRef = text(input?.itemRef, `${owner} runtime itemRef`);
  if (elementFor(lens, itemRef)) {
    fail(`${owner} runtime item ${itemRef} must not reuse static Screen Lens element identity`);
  }
  return {
    itemRef,
    label: optionalText(input.label, `${owner} runtime item ${itemRef} label`),
    realizationRef: requireElement(
      lens,
      text(input.realizationRef, `${owner} runtime item ${itemRef} realizationRef`),
      `${owner} runtime item ${itemRef}`,
    ),
    sourceRefs: strings(input.sourceRefs, `${owner} runtime item ${itemRef} sourceRefs`),
  };
}

function normalizeParticipation(lens, input, owner) {
  const elementRefs = strings(input?.elementRefs, `${owner} elementRefs`)
    .map((ref) => requireElement(lens, ref, owner));
  const pathwayRefs = strings(input?.pathwayRefs, `${owner} pathwayRefs`)
    .map((ref) => requirePathway(lens, ref, owner));
  const runtimeItems = (input?.runtimeItems ?? []).map((entry) =>
    normalizeRuntimeItem(lens, entry, owner));
  const runtimeRefs = runtimeItems.map((entry) => entry.itemRef);
  if (new Set(runtimeRefs).size !== runtimeRefs.length) {
    fail(`${owner} runtime item refs must be unique`);
  }
  return {
    elementRefs,
    pathwayRefs,
    runtimeItems,
    sourceRefs: strings(input?.sourceRefs, `${owner} sourceRefs`),
    evidenceRefs: strings(input?.evidenceRefs, `${owner} evidenceRefs`),
  };
}

function normalizeRelationship(lens, input, refs) {
  const relationshipRef = text(input?.relationshipRef, 'relationshipRef');
  if (refs.has(relationshipRef)) fail(`duplicate relationshipRef ${relationshipRef}`);
  refs.add(relationshipRef);

  const kind = text(input.kind, `${relationshipRef} kind`);
  if (!PROJECTABILITY_RELATIONSHIP_KINDS.includes(kind)) {
    fail(`${relationshipRef} has unknown relationship kind ${kind}`);
  }

  const subjectRef = text(input.subjectRef, `${relationshipRef} subjectRef`);
  const screenSubject = lens.screens.some((screen) => screen.screenRef === subjectRef);
  if (!screenSubject && !elementFor(lens, subjectRef)) {
    fail(`${relationshipRef} subjectRef ${subjectRef} is not a Screen Lens screen or element`);
  }

  const participation = normalizeParticipation(lens, input, relationshipRef);
  const values = (input.values ?? []).map((value, index) => {
    const valueRef = text(value?.valueRef, `${relationshipRef} value[${index}] valueRef`);
    const owner = `${relationshipRef} value ${valueRef}`;
    return {
      valueRef,
      label: text(value.label, `${owner} label`),
      ...normalizeParticipation(lens, value, owner),
    };
  });
  const valueRefs = values.map((value) => value.valueRef);
  if (new Set(valueRefs).size !== valueRefs.length) {
    fail(`${relationshipRef} valueRefs must be unique`);
  }

  if (AXIS_KINDS.has(kind) && !values.length) {
    fail(`${relationshipRef} ${kind} relationship requires values`);
  }
  if (!AXIS_KINDS.has(kind) && values.length) {
    fail(`${relationshipRef} ${kind} relationship must not define expression-axis values`);
  }

  const defaultValueRef = optionalText(
    input.defaultValueRef,
    `${relationshipRef} defaultValueRef`,
  );
  if (values.length && !defaultValueRef) {
    fail(`${relationshipRef} requires defaultValueRef`);
  }
  if (!values.length && defaultValueRef) {
    fail(`${relationshipRef} without values cannot define defaultValueRef`);
  }
  if (defaultValueRef && !valueRefs.includes(defaultValueRef)) {
    fail(`${relationshipRef} defaultValueRef ${defaultValueRef} is not declared`);
  }

  return {
    relationshipRef,
    kind,
    label: text(input.label, `${relationshipRef} label`),
    subjectRef,
    summary: optionalText(input.summary, `${relationshipRef} summary`),
    ...participation,
    defaultValueRef,
    values,
  };
}

function normalizeExpression(input, relationshipByRef, refs) {
  const expressionRef = text(input?.expressionRef, 'expressionRef');
  if (refs.has(expressionRef)) fail(`duplicate expressionRef ${expressionRef}`);
  refs.add(expressionRef);

  const basis = text(input.basis, `${expressionRef} basis`);
  if (!EXPRESSION_BASES.includes(basis)) fail(`${expressionRef} has unknown basis ${basis}`);

  const relationshipRefs = strings(input.relationshipRefs, `${expressionRef} relationshipRefs`);
  if (!relationshipRefs.length) fail(`${expressionRef} needs at least one relationshipRef`);
  for (const relationshipRef of relationshipRefs) {
    if (!relationshipByRef.has(relationshipRef)) {
      fail(`${expressionRef} references unknown relationship ${relationshipRef}`);
    }
  }

  const assignments = input.assignments ?? {};
  if (!assignments || typeof assignments !== 'object' || Array.isArray(assignments)) {
    fail(`${expressionRef} assignments must be an object`);
  }
  const normalizedAssignments = {};
  for (const [relationshipRef, valueRefRaw] of Object.entries(assignments)) {
    if (!relationshipRefs.includes(relationshipRef)) {
      fail(`${expressionRef} assignment ${relationshipRef} is not in relationshipRefs`);
    }
    const relationship = relationshipByRef.get(relationshipRef);
    if (!relationship.values.length) {
      fail(`${expressionRef} assignment ${relationshipRef} is not an expression axis`);
    }
    const valueRef = text(valueRefRaw, `${expressionRef} assignment ${relationshipRef}`);
    if (!relationship.values.some((value) => value.valueRef === valueRef)) {
      fail(`${expressionRef} assignment ${relationshipRef} has unknown value ${valueRef}`);
    }
    normalizedAssignments[relationshipRef] = valueRef;
  }

  return {
    expressionRef,
    label: text(input.label, `${expressionRef} label`),
    basis,
    summary: optionalText(input.summary, `${expressionRef} summary`),
    relationshipRefs,
    assignments: normalizedAssignments,
    evidenceRefs: strings(input.evidenceRefs, `${expressionRef} evidenceRefs`),
  };
}

export function normalizeScreenLensExpressionFixture(lens, input) {
  if (!lens || lens.schemaVersion !== SCREEN_LENS_SCHEMA) {
    fail(`lens must be a normalized ${SCREEN_LENS_SCHEMA}`);
  }
  if (!input || input.schemaVersion !== SCREEN_LENS_EXPRESSION_FIXTURE_SCHEMA) {
    fail(`schemaVersion must be ${SCREEN_LENS_EXPRESSION_FIXTURE_SCHEMA}`);
  }

  const lensRef = text(input.lensRef, 'lensRef');
  if (lensRef !== lens.lensRef) fail(`lensRef ${lensRef} does not match ${lens.lensRef}`);

  const lensSourceCommit = optionalText(
    input.lensSourceCommit,
    'lensSourceCommit',
  );
  if (lensSourceCommit && lens.sourceSnapshot?.commit !== lensSourceCommit) {
    fail(`lensSourceCommit ${lensSourceCommit} does not match ${lens.sourceSnapshot?.commit ?? 'unbound'}`);
  }

  const screenRef = text(input.screenRef, 'screenRef');
  screenFor(lens, screenRef);

  const refs = new Set();
  const relationships = (input.relationships ?? []).map((relationship) =>
    normalizeRelationship(lens, relationship, refs));
  if (!relationships.length) fail('at least one relationship is required');
  const relationshipByRef = new Map(
    relationships.map((relationship) => [relationship.relationshipRef, relationship]),
  );

  const expressions = (input.expressions ?? []).map((expression) =>
    normalizeExpression(expression, relationshipByRef, refs));
  if (!expressions.length) fail('at least one expression is required');

  return freezeDeep({
    schemaVersion: SCREEN_LENS_EXPRESSION_FIXTURE_SCHEMA,
    fixtureRef: text(input.fixtureRef, 'fixtureRef'),
    lensRef,
    lensSourceCommit,
    screenRef,
    sourceRevisionRef: text(input.sourceRevisionRef, 'sourceRevisionRef'),
    title: text(input.title, 'title'),
    summary: optionalText(input.summary, 'summary'),
    relationships,
    expressions,
  });
}

export function expressionFor(fixture, expressionRef) {
  const found = fixture.expressions.find((expression) => expression.expressionRef === expressionRef);
  if (!found) fail(`unknown expression ${expressionRef}`);
  return found;
}

export function listScreenLensExpressions(fixture) {
  return freezeDeep(
    fixture.expressions.map((expression) => ({
      expressionRef: expression.expressionRef,
      label: expression.label,
      basis: expression.basis,
      summary: expression.summary,
    })),
  );
}

function selectedValue(relationship, expression) {
  if (!relationship.values.length) return null;
  const valueRef =
    expression.assignments[relationship.relationshipRef] ??
    relationship.defaultValueRef;
  return relationship.values.find((value) => value.valueRef === valueRef);
}

function addAll(set, values) {
  for (const value of values) set.add(value);
}

export function resolveScreenLensExpression(lens, fixtureInput, expressionRef) {
  const fixture =
    normalizeScreenLensExpressionFixture(
      lens,
      fixtureInput,
    );
  const expression = expressionFor(fixture, expressionRef);
  const relationshipByRef = new Map(
    fixture.relationships.map((relationship) => [relationship.relationshipRef, relationship]),
  );

  const elementRefs = new Set();
  const pathwayRefs = new Set();
  const sourceRefs = new Set();
  const evidenceRefs = new Set(expression.evidenceRefs);
  const runtimeItems = new Map();
  const resolvedRelationships = [];
  const assignments = {};

  for (const relationshipRef of expression.relationshipRefs) {
    const relationship = relationshipByRef.get(relationshipRef);
    const value = selectedValue(relationship, expression);
    if (value) assignments[relationshipRef] = value.valueRef;

    addAll(elementRefs, relationship.elementRefs);
    addAll(pathwayRefs, relationship.pathwayRefs);
    addAll(sourceRefs, relationship.sourceRefs);
    addAll(evidenceRefs, relationship.evidenceRefs);

    if (value) {
      addAll(elementRefs, value.elementRefs);
      addAll(pathwayRefs, value.pathwayRefs);
      addAll(sourceRefs, value.sourceRefs);
      addAll(evidenceRefs, value.evidenceRefs);
      for (const item of value.runtimeItems) {
        if (runtimeItems.has(item.itemRef)) {
          fail(`${expressionRef} repeats runtime item ${item.itemRef}`);
        }
        runtimeItems.set(item.itemRef, item);
        addAll(sourceRefs, item.sourceRefs);
      }
    }

    resolvedRelationships.push({
      relationshipRef,
      kind: relationship.kind,
      subjectRef: relationship.subjectRef,
      valueRef: value?.valueRef ?? null,
    });
  }

  const behaviorNodeRefs = new Set();
  const depthNodeRefs = new Set();
  for (const pathwayRef of pathwayRefs) {
    const pathway = pathwayFor(lens, pathwayRef);
    addAll(
      behaviorNodeRefs,
      faceGraph(pathway, 'BEHAVIOR').nodes.map((node) => node.ref),
    );
    addAll(
      depthNodeRefs,
      faceGraph(pathway, 'DEPTH').nodes.map((node) => node.ref),
    );
  }

  const behaviorRelationshipRefs = resolvedRelationships
    .filter((relationship) => BEHAVIOR_KINDS.has(relationship.kind))
    .map((relationship) => relationship.relationshipRef);
  const depthRelationshipRefs = resolvedRelationships
    .filter((relationship) => DEPTH_KINDS.has(relationship.kind))
    .map((relationship) => relationship.relationshipRef);

  return freezeDeep({
    schemaVersion: SCREEN_LENS_EXPRESSION_RESOLUTION_SCHEMA,
    fixtureRef: fixture.fixtureRef,
    expressionRef: expression.expressionRef,
    label: expression.label,
    basis: expression.basis,
    lensRef: fixture.lensRef,
    screenRef: fixture.screenRef,
    sourceRevisionRef: fixture.sourceRevisionRef,
    assignments,
    relationships: resolvedRelationships,
    surface: {
      elementRefs: [...elementRefs],
      runtimeItems: [...runtimeItems.values()],
    },
    structure: {
      elementRefs: [...elementRefs],
      relationshipRefs: resolvedRelationships.map((relationship) => relationship.relationshipRef),
      sourceRefs: [...sourceRefs],
    },
    behavior: {
      relationshipRefs: behaviorRelationshipRefs,
      pathwayRefs: [...pathwayRefs],
      nodeRefs: [...behaviorNodeRefs],
    },
    depth: {
      relationshipRefs: depthRelationshipRefs,
      pathwayRefs: [...pathwayRefs],
      nodeRefs: [...depthNodeRefs],
      sourceRefs: [...sourceRefs],
    },
    evidenceRefs: [...evidenceRefs],
  });
}

// [VXG RealForever][VEXWORK][VEXBOARD][SCREEN-LENS][EXPRESSIONS]
