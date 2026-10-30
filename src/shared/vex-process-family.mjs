export const PROCESS_FAMILY_SCHEMA = 'vexwork.process-family/v1';
export const PROCESS_FAMILY_STATE_SCHEMA = 'vexwork.process-family-state/v1';

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
  assert(isObject(value), label + ' must be one object');
  const actual = Object.keys(value).sort(compareCanonicalText);
  const expected = [...keys].sort(compareCanonicalText);
  assert(JSON.stringify(actual) === JSON.stringify(expected), label + ' schema drift');
}

function stableRef(value, label) {
  assert(typeof value === 'string' && REF.test(value), label + ' must be one stable ref');
  return value;
}

function text(value, label) {
  assert(typeof value === 'string' && value.trim(), label + ' must be non-empty text');
  return value;
}

function refs(values, label, { allowEmpty = true } = {}) {
  assert(Array.isArray(values), label + ' must be an array');
  if (!allowEmpty) assert(values.length > 0, label + ' must be non-empty');
  const result = values.map((value, index) => stableRef(value, label + '[' + index + ']'));
  assert(new Set(result).size === result.length, label + ' must be unique');
  return result.sort(compareCanonicalText);
}

function orderedValues(values, label, { allowEmpty = false } = {}) {
  assert(Array.isArray(values), label + ' must be an array');
  if (!allowEmpty) assert(values.length > 0, label + ' must be non-empty');
  const result = values.map((value, index) => text(value, label + '[' + index + ']'));
  assert(new Set(result).size === result.length, label + ' must be unique');
  return result;
}

function layer(value, label, family) {
  text(value, label);
  assert(family.layers.includes(value), label + ' invalid for ProcessFamily');
  return value;
}

function freeze(value, seen = new WeakSet()) {
  if (!value || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const child of Object.values(value)) freeze(child, seen);
  return Object.freeze(value);
}

function normalizeNode(input) {
  exactKeys(input, [
    'nodeRef',
    'label',
  ], 'process node');

  const nodeRef = stableRef(input.nodeRef, 'process node.nodeRef');
  return {
    nodeRef,
    label: text(input.label, 'process node ' + nodeRef + '.label'),
  };
}

function normalizeRelationship(input, movementClasses) {
  exactKeys(input, [
    'relationshipRef',
    'movementClass',
    'fromRef',
    'toRef',
    'label',
    'entryPredicateRefs',
  ], 'process relationship');

  const relationshipRef = stableRef(input.relationshipRef, 'process relationship.relationshipRef');
  text(input.movementClass, 'process relationship ' + relationshipRef + '.movementClass');
  assert(
    movementClasses.includes(input.movementClass),
    'process relationship ' + relationshipRef + '.movementClass invalid for ProcessFamily',
  );
  return {
    relationshipRef,
    movementClass: input.movementClass,
    fromRef: stableRef(input.fromRef, 'process relationship ' + relationshipRef + '.fromRef'),
    toRef: stableRef(input.toRef, 'process relationship ' + relationshipRef + '.toRef'),
    label: text(input.label, 'process relationship ' + relationshipRef + '.label'),
    entryPredicateRefs: refs(
      input.entryPredicateRefs,
      'process relationship ' + relationshipRef + '.entryPredicateRefs',
    ),
  };
}

export function normalizeProcessFamily(input) {
  exactKeys(input, [
    'schemaVersion',
    'familyRef',
    'entryNodeRef',
    'layers',
    'entryLayer',
    'movementClasses',
    'forwardMovementClasses',
    'nodes',
    'relationships',
  ], 'ProcessFamily');

  assert(input.schemaVersion === PROCESS_FAMILY_SCHEMA, 'ProcessFamily schema mismatch');
  const familyRef = stableRef(input.familyRef, 'ProcessFamily.familyRef');
  const layers = orderedValues(input.layers, 'ProcessFamily.layers');
  const entryLayer = text(input.entryLayer, 'ProcessFamily.entryLayer');
  assert(layers.includes(entryLayer), 'ProcessFamily entryLayer must belong to layers');
  const movementClasses = orderedValues(
    input.movementClasses,
    'ProcessFamily.movementClasses',
    { allowEmpty: true },
  );
  const forwardMovementClasses = orderedValues(
    input.forwardMovementClasses,
    'ProcessFamily.forwardMovementClasses',
    { allowEmpty: true },
  );
  for (const movementClass of forwardMovementClasses) {
    assert(
      movementClasses.includes(movementClass),
      'ProcessFamily forwardMovementClasses must belong to movementClasses: ' + movementClass,
    );
  }
  assert(Array.isArray(input.nodes) && input.nodes.length > 0, 'ProcessFamily.nodes must be non-empty');
  assert(Array.isArray(input.relationships), 'ProcessFamily.relationships must be an array');

  const nodes = input.nodes.map(normalizeNode).sort((a, b) => compareCanonicalText(a.nodeRef, b.nodeRef));
  const nodeRefs = new Set(nodes.map((node) => node.nodeRef));
  assert(nodeRefs.size === nodes.length, 'ProcessFamily nodeRef must be unique');

  const entryNodeRef = stableRef(input.entryNodeRef, 'ProcessFamily.entryNodeRef');
  assert(nodeRefs.has(entryNodeRef), 'ProcessFamily entryNodeRef missing');

  const relationships = input.relationships
    .map((relationship) => normalizeRelationship(relationship, movementClasses))
    .sort((a, b) => compareCanonicalText(a.relationshipRef, b.relationshipRef));
  assert(
    new Set(relationships.map((relationship) => relationship.relationshipRef)).size === relationships.length,
    'ProcessFamily relationshipRef must be unique',
  );

  for (const relationship of relationships) {
    assert(nodeRefs.has(relationship.fromRef), 'ProcessFamily relationship fromRef missing: ' + relationship.fromRef);
    assert(nodeRefs.has(relationship.toRef), 'ProcessFamily relationship toRef missing: ' + relationship.toRef);
  }

  const reachable = new Set([entryNodeRef]);
  const queue = [entryNodeRef];
  while (queue.length > 0) {
    const fromRef = queue.shift();
    for (const relationship of relationships) {
      if (relationship.fromRef !== fromRef) continue;
      if (reachable.has(relationship.toRef)) continue;
      reachable.add(relationship.toRef);
      queue.push(relationship.toRef);
    }
  }
  const unreachable = nodes
    .map((node) => node.nodeRef)
    .filter((nodeRef) => !reachable.has(nodeRef));
  assert(
    unreachable.length === 0,
    'ProcessFamily nodes unreachable from entryNodeRef: ' + unreachable.join(','),
  );

  return freeze({
    schemaVersion: PROCESS_FAMILY_SCHEMA,
    familyRef,
    entryNodeRef,
    layers,
    entryLayer,
    movementClasses,
    forwardMovementClasses,
    nodes,
    relationships,
  });
}

function normalizeTransition(input, label, family) {
  exactKeys(input, [
    'transitionRef',
    'relationshipRefOrNull',
    'fromLayer',
    'evidenceRefs',
    'carriedIdentityRefs',
  ], 'process transition ' + label);

  const transitionRef = stableRef(input.transitionRef, 'process transition ' + label + '.transitionRef');
  const relationshipRefOrNull = input.relationshipRefOrNull === null
    ? null
    : stableRef(input.relationshipRefOrNull, 'process transition ' + label + '.relationshipRefOrNull');

  if (relationshipRefOrNull !== null) {
    const relationship = family.relationships.find((candidate) => candidate.relationshipRef === relationshipRefOrNull);
    assert(relationship, 'process transition relationship missing: ' + relationshipRefOrNull);
  }

  const fromLayer = layer(input.fromLayer, 'process transition ' + label + '.fromLayer', family);

  return {
    transitionRef,
    relationshipRefOrNull,
    fromLayer,
    evidenceRefs: refs(input.evidenceRefs, 'process transition ' + label + '.evidenceRefs', { allowEmpty: false }),
    carriedIdentityRefs: refs(
      input.carriedIdentityRefs,
      'process transition ' + label + '.carriedIdentityRefs',
    ),
  };
}

export function normalizeProcessState(input, familyInput) {
  const family = normalizeProcessFamily(familyInput);
  exactKeys(input, [
    'schemaVersion',
    'stateRef',
    'familyRef',
    'scopeRef',
    'currentNodeRef',
    'layer',
    'previousStateRefOrNull',
    'lastAcceptedTransitionOrNull',
  ], 'ProcessFamily.State');

  assert(input.schemaVersion === PROCESS_FAMILY_STATE_SCHEMA, 'ProcessFamily.State schema mismatch');
  const stateRef = stableRef(input.stateRef, 'ProcessFamily.State.stateRef');
  const familyRef = stableRef(input.familyRef, 'ProcessFamily.State.familyRef');
  assert(familyRef === family.familyRef, 'ProcessFamily.State familyRef mismatch');

  const previousStateRefOrNull = input.previousStateRefOrNull === null
    ? null
    : stableRef(input.previousStateRefOrNull, 'ProcessFamily.State.previousStateRefOrNull');
  if (previousStateRefOrNull !== null) {
    assert(previousStateRefOrNull !== stateRef, 'ProcessFamily.State cannot point to itself as previous State');
  }

  const lastAcceptedTransitionOrNull = input.lastAcceptedTransitionOrNull === null
    ? null
    : normalizeTransition(input.lastAcceptedTransitionOrNull, 'last', family);

  const currentNodeRef = stableRef(input.currentNodeRef, 'ProcessFamily.State.currentNodeRef');
  assert(family.nodes.some((node) => node.nodeRef === currentNodeRef), 'ProcessFamily.State currentNodeRef missing');
  const currentLayer = layer(input.layer, 'ProcessFamily.State.layer', family);

  if (lastAcceptedTransitionOrNull === null) {
    assert(previousStateRefOrNull === null, 'ProcessFamily.State without transition must not claim a previous State');
    assert(currentNodeRef === family.entryNodeRef, 'ProcessFamily.State without transition must be at entryNodeRef');
    assert(currentLayer === family.entryLayer, 'ProcessFamily.State without transition must be at entryLayer');
  } else {
    assert(previousStateRefOrNull !== null, 'ProcessFamily.State transition requires previousStateRefOrNull');
    if (lastAcceptedTransitionOrNull.relationshipRefOrNull === null) {
      assert(
        lastAcceptedTransitionOrNull.fromLayer !== currentLayer,
        'relationship-free layer transition must change layer',
      );
    } else {
      const acceptedRelationship = family.relationships.find(
        (relationship) => relationship.relationshipRef === lastAcceptedTransitionOrNull.relationshipRefOrNull,
      );
      assert(
        acceptedRelationship?.toRef === currentNodeRef,
        'ProcessFamily.State currentNodeRef must match last accepted relationship target',
      );
    }
  }

  return freeze({
    schemaVersion: PROCESS_FAMILY_STATE_SCHEMA,
    stateRef,
    familyRef,
    scopeRef: stableRef(input.scopeRef, 'ProcessFamily.State.scopeRef'),
    currentNodeRef,
    layer: currentLayer,
    previousStateRefOrNull,
    lastAcceptedTransitionOrNull,
  });
}

export function createProcessState(familyInput, {
  stateRef,
  scopeRef,
  ...unknown
} = {}) {
  assert(Object.keys(unknown).length === 0, 'ProcessFamily.State creation options schema drift');
  const family = normalizeProcessFamily(familyInput);
  return normalizeProcessState({
    schemaVersion: PROCESS_FAMILY_STATE_SCHEMA,
    stateRef,
    familyRef: family.familyRef,
    scopeRef,
    currentNodeRef: family.entryNodeRef,
    layer: family.entryLayer,
    previousStateRefOrNull: null,
    lastAcceptedTransitionOrNull: null,
  }, family);
}

export function admitProcessTransition({
  family: familyInput,
  state: stateInput,
  transitionRef,
  relationshipRefOrNull = null,
  nextLayer,
  evidenceRefs,
  carriedIdentityRefs,
  satisfiedPredicateRefs = [],
  nextStateRef,
  ...unknown
} = {}) {
  assert(Object.keys(unknown).length === 0, 'process transition options schema drift');
  const family = normalizeProcessFamily(familyInput);
  const state = normalizeProcessState(stateInput, family);
  const currentNodeRef = state.currentNodeRef;
  const relationship = relationshipRefOrNull === null
    ? null
    : family.relationships.find((candidate) => candidate.relationshipRef === relationshipRefOrNull);

  if (relationship) {
    assert(relationship.fromRef === currentNodeRef, 'process transition must leave CURRENT node');
    const requiredPredicateRefs = requiredEntryPredicateRefs(relationship);
    const satisfied = new Set(refs(
      satisfiedPredicateRefs,
      'process transition satisfiedPredicateRefs',
    ));
    const missing = requiredPredicateRefs.filter((predicateRef) => !satisfied.has(predicateRef));
    assert(
      missing.length === 0,
      'process transition entry predicates unsatisfied: ' + missing.join(','),
    );
  } else {
    assert(relationshipRefOrNull === null, 'process transition relationship missing');
  }

  const toNodeRef = relationship ? relationship.toRef : currentNodeRef;
  const transitionEvidenceRefs = refs(
    evidenceRefs,
    'process transition evidenceRefs',
    { allowEmpty: false },
  );
  const transitionIdentityRefs = refs(
    carriedIdentityRefs,
    'process transition carriedIdentityRefs',
  );
  const transition = {
    transitionRef,
    relationshipRefOrNull,
    fromLayer: state.layer,
    evidenceRefs: transitionEvidenceRefs,
    carriedIdentityRefs: transitionIdentityRefs,
  };

  return normalizeProcessState({
    schemaVersion: PROCESS_FAMILY_STATE_SCHEMA,
    stateRef: nextStateRef,
    familyRef: family.familyRef,
    scopeRef: state.scopeRef,
    currentNodeRef: toNodeRef,
    layer: nextLayer,
    previousStateRefOrNull: state.stateRef,
    lastAcceptedTransitionOrNull: transition,
  }, family);
}

function requiredEntryPredicateRefs(relationship) {
  return [...relationship.entryPredicateRefs];
}


// [VXG RealForever][VEXWORK][VEXPROCESSFAMILY][CURRENT-STATE]
