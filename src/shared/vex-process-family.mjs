export const PROCESS_FAMILY_SCHEMA = 'vexwork.process-family/v1';
export const PROCESS_FAMILY_STATE_SCHEMA = 'vexwork.process-family-state/v1';
export const PROCESS_HORIZON_SCHEMA = 'vexwork.process-horizon/v1';

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

function unionRefs(values, label, options = {}) {
  return refs([...new Set(values)], label, options);
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
    'purpose',
    'currentTruthRefs',
    'ownerRefs',
    'readingSourceRefs',
    'considerationRefs',
    'proofRefs',
    'sourceRefs',
  ], 'process node');

  const nodeRef = stableRef(input.nodeRef, 'process node.nodeRef');
  return {
    nodeRef,
    label: text(input.label, 'process node ' + nodeRef + '.label'),
    purpose: text(input.purpose, 'process node ' + nodeRef + '.purpose'),
    currentTruthRefs: refs(input.currentTruthRefs, 'process node ' + nodeRef + '.currentTruthRefs'),
    ownerRefs: refs(input.ownerRefs, 'process node ' + nodeRef + '.ownerRefs', { allowEmpty: false }),
    readingSourceRefs: refs(input.readingSourceRefs, 'process node ' + nodeRef + '.readingSourceRefs', { allowEmpty: false }),
    considerationRefs: refs(input.considerationRefs, 'process node ' + nodeRef + '.considerationRefs'),
    proofRefs: refs(input.proofRefs, 'process node ' + nodeRef + '.proofRefs'),
    sourceRefs: refs(input.sourceRefs, 'process node ' + nodeRef + '.sourceRefs', { allowEmpty: false }),
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
    'sourceRefs',
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
    sourceRefs: refs(input.sourceRefs, 'process relationship ' + relationshipRef + '.sourceRefs', { allowEmpty: false }),
  };
}

export function normalizeProcessFamily(input) {
  exactKeys(input, [
    'schemaVersion',
    'familyRef',
    'purpose',
    'entryNodeRef',
    'layers',
    'entryLayer',
    'movementClasses',
    'forwardMovementClasses',
    'nodes',
    'relationships',
    'sourceRefs',
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
    purpose: text(input.purpose, 'ProcessFamily.purpose'),
    entryNodeRef,
    layers,
    entryLayer,
    movementClasses,
    forwardMovementClasses,
    nodes,
    relationships,
    sourceRefs: refs(input.sourceRefs, 'ProcessFamily.sourceRefs', { allowEmpty: false }),
  });
}

function normalizeTransition(input, label, family) {
  exactKeys(input, [
    'transitionRef',
    'relationshipRefOrNull',
    'fromNodeRef',
    'toNodeRef',
    'fromLayer',
    'toLayer',
    'evidenceRefs',
  ], 'process transition ' + label);

  const transitionRef = stableRef(input.transitionRef, 'process transition ' + label + '.transitionRef');
  const fromNodeRef = stableRef(input.fromNodeRef, 'process transition ' + label + '.fromNodeRef');
  const toNodeRef = stableRef(input.toNodeRef, 'process transition ' + label + '.toNodeRef');
  assert(family.nodes.some((node) => node.nodeRef === fromNodeRef), 'process transition fromNodeRef missing');
  assert(family.nodes.some((node) => node.nodeRef === toNodeRef), 'process transition toNodeRef missing');

  const relationshipRefOrNull = input.relationshipRefOrNull === null
    ? null
    : stableRef(input.relationshipRefOrNull, 'process transition ' + label + '.relationshipRefOrNull');

  if (relationshipRefOrNull === null) {
    assert(fromNodeRef === toNodeRef, 'relationship-free layer transition must stay on the same process node');
  } else {
    const relationship = family.relationships.find((candidate) => candidate.relationshipRef === relationshipRefOrNull);
    assert(relationship, 'process transition relationship missing: ' + relationshipRefOrNull);
    assert(relationship.fromRef === fromNodeRef, 'process transition relationship fromRef mismatch');
    assert(relationship.toRef === toNodeRef, 'process transition relationship toRef mismatch');
  }

  const fromLayer = layer(input.fromLayer, 'process transition ' + label + '.fromLayer', family);
  const toLayer = layer(input.toLayer, 'process transition ' + label + '.toLayer', family);
  assert(
    fromNodeRef !== toNodeRef || fromLayer !== toLayer,
    'process transition must change node or layer',
  );


  return {
    transitionRef,
    relationshipRefOrNull,
    fromNodeRef,
    toNodeRef,
    fromLayer,
    toLayer,
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
    assert(
      lastAcceptedTransitionOrNull.toNodeRef === currentNodeRef,
      'ProcessFamily.State currentNodeRef must match last accepted transition',
    );
    assert(
      lastAcceptedTransitionOrNull.toLayer === currentLayer,
      'ProcessFamily.State layer must match last accepted transition',
    );
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
    fromNodeRef: currentNodeRef,
    toNodeRef,
    fromLayer: state.layer,
    toLayer: nextLayer,
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

export function availableProcessRelationships(familyInput, stateInput, {
  satisfiedPredicateRefs = [],
} = {}) {
  const family = normalizeProcessFamily(familyInput);
  const state = normalizeProcessState(stateInput, family);
  const satisfied = new Set(refs(
    satisfiedPredicateRefs,
    'process availability.satisfiedPredicateRefs',
  ));
  return freeze(family.relationships
    .filter((relationship) => relationship.fromRef === state.currentNodeRef)
    .map((relationship) => {
      const requiredPredicateRefs = requiredEntryPredicateRefs(relationship);
      const missingPredicateRefs = requiredPredicateRefs.filter((predicateRef) => !satisfied.has(predicateRef));
      return {
        relationshipRef: relationship.relationshipRef,
        movementClass: relationship.movementClass,
        fromRef: relationship.fromRef,
        toRef: relationship.toRef,
        requiredPredicateRefs,
        missingPredicateRefs,
        available: missingPredicateRefs.length === 0,
      };
    }));
}

function publicNextNode(node, relationship, availability) {
  return {
    relationshipRef: relationship.relationshipRef,
    movementClass: relationship.movementClass,
    nodeRef: node.nodeRef,
    label: node.label,
    purpose: node.purpose,
    entryPredicateRefs: availability.requiredPredicateRefs,
    missingPredicateRefs: availability.missingPredicateRefs,
    available: availability.available,
  };
}

function forwardReachableNodeRefs(family, startNodeRef) {
  const forwardMovementClasses = new Set(family.forwardMovementClasses);
  const visited = new Set([startNodeRef]);
  const queue = [startNodeRef];

  while (queue.length > 0) {
    const fromRef = queue.shift();
    for (const relationship of family.relationships) {
      if (relationship.fromRef !== fromRef) continue;
      if (!forwardMovementClasses.has(relationship.movementClass)) continue;
      if (visited.has(relationship.toRef)) continue;
      visited.add(relationship.toRef);
      queue.push(relationship.toRef);
    }
  }

  visited.delete(startNodeRef);
  return [...visited].sort(compareCanonicalText);
}

export function projectProcessHorizon(familyInput, stateInput, {
  satisfiedPredicateRefs = [],
} = {}) {
  const family = normalizeProcessFamily(familyInput);
  const state = normalizeProcessState(stateInput, family);
  const availability = availableProcessRelationships(family, state, { satisfiedPredicateRefs });
  const availabilityByRef = new Map(availability.map((entry) => [entry.relationshipRef, entry]));
  const outgoing = family.relationships.filter((relationship) => relationship.fromRef === state.currentNodeRef);

  const currentNode = family.nodes.find((node) => node.nodeRef === state.currentNodeRef);
  const last = state.lastAcceptedTransitionOrNull;
  const previousNode = last
    ? family.nodes.find((node) => node.nodeRef === last.fromNodeRef)
    : null;
  const previousRelationship = last?.relationshipRefOrNull
    ? family.relationships.find((relationship) => relationship.relationshipRef === last.relationshipRefOrNull)
    : null;

  const nextCandidates = outgoing.map((relationship) => {
    const node = family.nodes.find((candidate) => candidate.nodeRef === relationship.toRef);
    return publicNextNode(node, relationship, availabilityByRef.get(relationship.relationshipRef));
  });

  const neighborhood = new Set([
    state.currentNodeRef,
    ...(previousNode ? [previousNode.nodeRef] : []),
    ...nextCandidates.map((candidate) => candidate.nodeRef),
  ]);
  const furtherNodeRefs = forwardReachableNodeRefs(family, state.currentNodeRef)
    .filter((nodeRef) => !neighborhood.has(nodeRef));

  return freeze({
    schemaVersion: PROCESS_HORIZON_SCHEMA,
    familyRef: family.familyRef,
    scopeRef: state.scopeRef,
    stateRef: state.stateRef,
    layer: state.layer,
    previousAcceptedOrNull: previousNode && last ? {
      stateRef: state.previousStateRefOrNull,
      nodeRef: previousNode.nodeRef,
      label: previousNode.label,
      transitionRef: last.transitionRef,
      movementClass: previousRelationship?.movementClass ?? null,
      fromLayer: last.fromLayer,
      toLayer: last.toLayer,
      evidenceRefs: [...last.evidenceRefs],
    } : null,
    current: {
      nodeRef: currentNode.nodeRef,
      label: currentNode.label,
      purpose: currentNode.purpose,
      currentTruthRefs: [...currentNode.currentTruthRefs],
      ownerRefs: [...currentNode.ownerRefs],
      readingSourceRefs: [...currentNode.readingSourceRefs],
      considerationRefs: [...currentNode.considerationRefs],
      proofRefs: [...currentNode.proofRefs],
    },
    nextCandidates,
    nextAvailableRelationshipRefs: nextCandidates
      .filter((candidate) => candidate.available)
      .map((candidate) => candidate.relationshipRef),
    furtherNodeRefs,
    effects: false,
    executionAuthority: 'NONE',
  });
}

// [VXG RealForever][VEXWORK][VEXPROCESSFAMILY][CURRENT-STATE]
