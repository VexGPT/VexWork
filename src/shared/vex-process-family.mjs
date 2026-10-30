export const PROCESS_FAMILY_SCHEMA = 'vexwork.process-family/v1';
export const PROCESS_FAMILY_STATE_SCHEMA = 'vexwork.process-family-state/v1';
export const PROCESS_HORIZON_SCHEMA = 'vexwork.process-horizon/v1';

export const PROCESS_DEPTHS = Object.freeze([
  'FORMATION',
  'TOPOLOGY',
  'OWNERSHIP',
  'CONTRACT',
  'IMPLEMENTATION',
  'FOCUSED_PROOF',
  'LIVED_INTEGRATION',
  'RECONCILE_ACCEPT',
]);

export const PROCESS_MOVEMENT_CLASSES = Object.freeze([
  'ADVANCES',
  'ENABLES',
  'REFINES',
  'CONTRACT_GAP',
  'IMPLEMENTATION_DEFECT',
  'CURRENTNESS_CHANGED',
  'RECOVERS',
  'DEPTH_REVISIT',
]);

const RELATIONSHIP_MOVEMENT_CLASSES = new Set(
  PROCESS_MOVEMENT_CLASSES.filter((value) => value !== 'DEPTH_REVISIT'),
);
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

function depth(value, label) {
  assert(PROCESS_DEPTHS.includes(value), label + ' invalid');
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
    'entryPredicateRefs',
    'currentTruthRefs',
    'ownerRefs',
    'readingSourceRefs',
    'authorityRefs',
    'considerationRefs',
    'proofRefs',
    'exitPredicateRefs',
    'heldConcernRefs',
    'sourceRefs',
  ], 'process node');

  const nodeRef = stableRef(input.nodeRef, 'process node.nodeRef');
  return {
    nodeRef,
    label: text(input.label, 'process node ' + nodeRef + '.label'),
    purpose: text(input.purpose, 'process node ' + nodeRef + '.purpose'),
    entryPredicateRefs: refs(input.entryPredicateRefs, 'process node ' + nodeRef + '.entryPredicateRefs'),
    currentTruthRefs: refs(input.currentTruthRefs, 'process node ' + nodeRef + '.currentTruthRefs'),
    ownerRefs: refs(input.ownerRefs, 'process node ' + nodeRef + '.ownerRefs', { allowEmpty: false }),
    readingSourceRefs: refs(input.readingSourceRefs, 'process node ' + nodeRef + '.readingSourceRefs', { allowEmpty: false }),
    authorityRefs: refs(input.authorityRefs, 'process node ' + nodeRef + '.authorityRefs'),
    considerationRefs: refs(input.considerationRefs, 'process node ' + nodeRef + '.considerationRefs'),
    proofRefs: refs(input.proofRefs, 'process node ' + nodeRef + '.proofRefs'),
    exitPredicateRefs: refs(input.exitPredicateRefs, 'process node ' + nodeRef + '.exitPredicateRefs'),
    heldConcernRefs: refs(input.heldConcernRefs, 'process node ' + nodeRef + '.heldConcernRefs'),
    sourceRefs: refs(input.sourceRefs, 'process node ' + nodeRef + '.sourceRefs', { allowEmpty: false }),
  };
}

function normalizeRelationship(input) {
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
  assert(
    RELATIONSHIP_MOVEMENT_CLASSES.has(input.movementClass),
    'process relationship ' + relationshipRef + '.movementClass invalid',
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
    'nodes',
    'relationships',
    'sourceRefs',
  ], 'ProcessFamily');

  assert(input.schemaVersion === PROCESS_FAMILY_SCHEMA, 'ProcessFamily schema mismatch');
  const familyRef = stableRef(input.familyRef, 'ProcessFamily.familyRef');
  assert(Array.isArray(input.nodes) && input.nodes.length > 0, 'ProcessFamily.nodes must be non-empty');
  assert(Array.isArray(input.relationships), 'ProcessFamily.relationships must be an array');

  const nodes = input.nodes.map(normalizeNode).sort((a, b) => compareCanonicalText(a.nodeRef, b.nodeRef));
  const nodeRefs = new Set(nodes.map((node) => node.nodeRef));
  assert(nodeRefs.size === nodes.length, 'ProcessFamily nodeRef must be unique');

  const entryNodeRef = stableRef(input.entryNodeRef, 'ProcessFamily.entryNodeRef');
  assert(nodeRefs.has(entryNodeRef), 'ProcessFamily entryNodeRef missing');

  const relationships = input.relationships
    .map(normalizeRelationship)
    .sort((a, b) => compareCanonicalText(a.relationshipRef, b.relationshipRef));
  assert(
    new Set(relationships.map((relationship) => relationship.relationshipRef)).size === relationships.length,
    'ProcessFamily relationshipRef must be unique',
  );

  for (const relationship of relationships) {
    assert(nodeRefs.has(relationship.fromRef), 'ProcessFamily relationship fromRef missing: ' + relationship.fromRef);
    assert(nodeRefs.has(relationship.toRef), 'ProcessFamily relationship toRef missing: ' + relationship.toRef);
  }

  return freeze({
    schemaVersion: PROCESS_FAMILY_SCHEMA,
    familyRef,
    purpose: text(input.purpose, 'ProcessFamily.purpose'),
    entryNodeRef,
    nodes,
    relationships,
    sourceRefs: refs(input.sourceRefs, 'ProcessFamily.sourceRefs', { allowEmpty: false }),
  });
}

function normalizeTransition(input, index, family, prior) {
  exactKeys(input, [
    'transitionRef',
    'relationshipRefOrNull',
    'movementClass',
    'fromNodeRef',
    'toNodeRef',
    'fromDepth',
    'toDepth',
    'evidenceRefs',
    'carriedIdentityRefs',
  ], 'process transition ' + index);

  const transitionRef = stableRef(input.transitionRef, 'process transition ' + index + '.transitionRef');
  assert(PROCESS_MOVEMENT_CLASSES.includes(input.movementClass), 'process transition ' + index + '.movementClass invalid');
  const fromNodeRef = stableRef(input.fromNodeRef, 'process transition ' + index + '.fromNodeRef');
  const toNodeRef = stableRef(input.toNodeRef, 'process transition ' + index + '.toNodeRef');
  assert(family.nodes.some((node) => node.nodeRef === fromNodeRef), 'process transition fromNodeRef missing');
  assert(family.nodes.some((node) => node.nodeRef === toNodeRef), 'process transition toNodeRef missing');

  const relationshipRefOrNull = input.relationshipRefOrNull === null
    ? null
    : stableRef(input.relationshipRefOrNull, 'process transition ' + index + '.relationshipRefOrNull');

  if (relationshipRefOrNull === null) {
    assert(input.movementClass === 'DEPTH_REVISIT', 'relationship-free transition must be DEPTH_REVISIT');
    assert(fromNodeRef === toNodeRef, 'DEPTH_REVISIT must stay on the same process node');
  } else {
    const relationship = family.relationships.find((candidate) => candidate.relationshipRef === relationshipRefOrNull);
    assert(relationship, 'process transition relationship missing: ' + relationshipRefOrNull);
    assert(relationship.fromRef === fromNodeRef, 'process transition relationship fromRef mismatch');
    assert(relationship.toRef === toNodeRef, 'process transition relationship toRef mismatch');
    assert(relationship.movementClass === input.movementClass, 'process transition movementClass mismatch');
  }

  const fromDepth = depth(input.fromDepth, 'process transition ' + index + '.fromDepth');
  const toDepth = depth(input.toDepth, 'process transition ' + index + '.toDepth');
  assert(
    fromNodeRef !== toNodeRef || fromDepth !== toDepth,
    'process transition must change node or depth',
  );

  if (prior) {
    assert(prior.toNodeRef === fromNodeRef, 'process transition history node discontinuity');
    assert(prior.toDepth === fromDepth, 'process transition history depth discontinuity');
  }

  return {
    transitionRef,
    relationshipRefOrNull,
    movementClass: input.movementClass,
    fromNodeRef,
    toNodeRef,
    fromDepth,
    toDepth,
    evidenceRefs: refs(input.evidenceRefs, 'process transition ' + index + '.evidenceRefs', { allowEmpty: false }),
    carriedIdentityRefs: refs(
      input.carriedIdentityRefs,
      'process transition ' + index + '.carriedIdentityRefs',
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
    'depth',
    'acceptedEvidenceRefs',
    'carriedIdentityRefs',
    'transitionHistory',
    'sourceRefs',
  ], 'ProcessFamily.State');

  assert(input.schemaVersion === PROCESS_FAMILY_STATE_SCHEMA, 'ProcessFamily.State schema mismatch');
  const familyRef = stableRef(input.familyRef, 'ProcessFamily.State.familyRef');
  assert(familyRef === family.familyRef, 'ProcessFamily.State familyRef mismatch');

  assert(Array.isArray(input.transitionHistory), 'ProcessFamily.State.transitionHistory must be an array');
  const transitions = [];
  for (let index = 0; index < input.transitionHistory.length; index += 1) {
    transitions.push(normalizeTransition(
      input.transitionHistory[index],
      index,
      family,
      transitions[index - 1] ?? null,
    ));
  }
  assert(
    new Set(transitions.map((transition) => transition.transitionRef)).size === transitions.length,
    'ProcessFamily.State transitionRef must be unique',
  );

  const currentNodeRef = stableRef(input.currentNodeRef, 'ProcessFamily.State.currentNodeRef');
  assert(family.nodes.some((node) => node.nodeRef === currentNodeRef), 'ProcessFamily.State currentNodeRef missing');
  const currentDepth = depth(input.depth, 'ProcessFamily.State.depth');

  if (transitions.length === 0) {
    assert(currentNodeRef === family.entryNodeRef, 'ProcessFamily.State without history must be at entryNodeRef');
  } else {
    const last = transitions.at(-1);
    assert(last.toNodeRef === currentNodeRef, 'ProcessFamily.State currentNodeRef must match transition history');
    assert(last.toDepth === currentDepth, 'ProcessFamily.State depth must match transition history');
  }

  const acceptedEvidenceRefs = refs(
    input.acceptedEvidenceRefs,
    'ProcessFamily.State.acceptedEvidenceRefs',
  );
  const carriedIdentityRefs = refs(
    input.carriedIdentityRefs,
    'ProcessFamily.State.carriedIdentityRefs',
  );

  for (const transition of transitions) {
    for (const evidenceRef of transition.evidenceRefs) {
      assert(
        acceptedEvidenceRefs.includes(evidenceRef),
        'ProcessFamily.State transition evidence must be accepted: ' + evidenceRef,
      );
    }
    for (const identityRef of transition.carriedIdentityRefs) {
      assert(
        carriedIdentityRefs.includes(identityRef),
        'ProcessFamily.State transition identity must be carried: ' + identityRef,
      );
    }
  }

  return freeze({
    schemaVersion: PROCESS_FAMILY_STATE_SCHEMA,
    stateRef: stableRef(input.stateRef, 'ProcessFamily.State.stateRef'),
    familyRef,
    scopeRef: stableRef(input.scopeRef, 'ProcessFamily.State.scopeRef'),
    currentNodeRef,
    depth: currentDepth,
    acceptedEvidenceRefs,
    carriedIdentityRefs,
    transitionHistory: transitions,
    sourceRefs: refs(input.sourceRefs, 'ProcessFamily.State.sourceRefs', { allowEmpty: false }),
  });
}

export function createProcessState(familyInput, {
  stateRef,
  scopeRef,
  depth: initialDepth = 'FORMATION',
  acceptedEvidenceRefs = [],
  carriedIdentityRefs = [],
  sourceRefs = null,
}) {
  const family = normalizeProcessFamily(familyInput);
  return normalizeProcessState({
    schemaVersion: PROCESS_FAMILY_STATE_SCHEMA,
    stateRef,
    familyRef: family.familyRef,
    scopeRef,
    currentNodeRef: family.entryNodeRef,
    depth: initialDepth,
    acceptedEvidenceRefs,
    carriedIdentityRefs,
    transitionHistory: [],
    sourceRefs: sourceRefs === null ? [...family.sourceRefs] : sourceRefs,
  }, family);
}

export function admitProcessTransition({
  family: familyInput,
  state: stateInput,
  transitionRef,
  relationshipRefOrNull = null,
  movementClass,
  nextDepth,
  evidenceRefs,
  carriedIdentityRefs = [],
  nextStateRef,
  sourceRefs = [],
}) {
  const family = normalizeProcessFamily(familyInput);
  const state = normalizeProcessState(stateInput, family);
  const currentNodeRef = state.currentNodeRef;
  const relationship = relationshipRefOrNull === null
    ? null
    : family.relationships.find((candidate) => candidate.relationshipRef === relationshipRefOrNull);

  if (relationship) {
    assert(relationship.fromRef === currentNodeRef, 'process transition must leave CURRENT node');
    assert(relationship.movementClass === movementClass, 'process transition movementClass must match relationship');
  } else {
    assert(relationshipRefOrNull === null, 'process transition relationship missing');
    assert(movementClass === 'DEPTH_REVISIT', 'relationship-free transition must be DEPTH_REVISIT');
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
  const nextEvidence = unionRefs(
    [...state.acceptedEvidenceRefs, ...transitionEvidenceRefs],
    'ProcessFamily.State accepted evidence after transition',
  );
  const nextIdentities = unionRefs(
    [...state.carriedIdentityRefs, ...transitionIdentityRefs],
    'ProcessFamily.State carried identities after transition',
  );

  const transition = {
    transitionRef,
    relationshipRefOrNull,
    movementClass,
    fromNodeRef: currentNodeRef,
    toNodeRef,
    fromDepth: state.depth,
    toDepth: nextDepth,
    evidenceRefs: transitionEvidenceRefs,
    carriedIdentityRefs: transitionIdentityRefs,
  };

  return normalizeProcessState({
    schemaVersion: PROCESS_FAMILY_STATE_SCHEMA,
    stateRef: nextStateRef,
    familyRef: family.familyRef,
    scopeRef: state.scopeRef,
    currentNodeRef: toNodeRef,
    depth: nextDepth,
    acceptedEvidenceRefs: nextEvidence,
    carriedIdentityRefs: nextIdentities,
    transitionHistory: [...state.transitionHistory, transition],
    sourceRefs: unionRefs([...state.sourceRefs, ...sourceRefs], 'ProcessFamily.State sourceRefs after transition'),
  }, family);
}

function publicNextNode(node, relationship, admitted) {
  return {
    relationshipRef: relationship.relationshipRef,
    movementClass: relationship.movementClass,
    nodeRef: node.nodeRef,
    label: node.label,
    purpose: node.purpose,
    entryPredicateRefs: [...new Set([
      ...node.entryPredicateRefs,
      ...relationship.entryPredicateRefs,
    ])].sort(compareCanonicalText),
    admitted,
  };
}

export function projectProcessHorizon(familyInput, stateInput, {
  admittedRelationshipRefs = [],
} = {}) {
  const family = normalizeProcessFamily(familyInput);
  const state = normalizeProcessState(stateInput, family);
  const admitted = new Set(refs(admittedRelationshipRefs, 'process horizon.admittedRelationshipRefs'));
  const outgoing = family.relationships.filter((relationship) => relationship.fromRef === state.currentNodeRef);
  for (const relationshipRef of admitted) {
    assert(
      outgoing.some((relationship) => relationship.relationshipRef === relationshipRef),
      'process horizon admitted relationship must leave CURRENT node: ' + relationshipRef,
    );
  }

  const currentNode = family.nodes.find((node) => node.nodeRef === state.currentNodeRef);
  const last = state.transitionHistory.at(-1) ?? null;
  const previousNode = last
    ? family.nodes.find((node) => node.nodeRef === last.fromNodeRef)
    : null;

  const nextCandidates = outgoing.map((relationship) => {
    const node = family.nodes.find((candidate) => candidate.nodeRef === relationship.toRef);
    return publicNextNode(node, relationship, admitted.has(relationship.relationshipRef));
  });

  const neighborhood = new Set([
    state.currentNodeRef,
    ...(previousNode ? [previousNode.nodeRef] : []),
    ...nextCandidates.map((candidate) => candidate.nodeRef),
  ]);
  const furtherNodeRefs = family.nodes
    .map((node) => node.nodeRef)
    .filter((nodeRef) => !neighborhood.has(nodeRef))
    .sort(compareCanonicalText);

  return freeze({
    schemaVersion: PROCESS_HORIZON_SCHEMA,
    familyRef: family.familyRef,
    scopeRef: state.scopeRef,
    stateRef: state.stateRef,
    depth: state.depth,
    previousAcceptedOrNull: previousNode && last ? {
      nodeRef: previousNode.nodeRef,
      label: previousNode.label,
      transitionRef: last.transitionRef,
      movementClass: last.movementClass,
      evidenceRefs: [...last.evidenceRefs],
    } : null,
    current: {
      nodeRef: currentNode.nodeRef,
      label: currentNode.label,
      purpose: currentNode.purpose,
      currentTruthRefs: [...currentNode.currentTruthRefs],
      ownerRefs: [...currentNode.ownerRefs],
      readingSourceRefs: [...currentNode.readingSourceRefs],
      authorityRefs: [...currentNode.authorityRefs],
      considerationRefs: [...currentNode.considerationRefs],
      proofRefs: [...currentNode.proofRefs],
      exitPredicateRefs: [...currentNode.exitPredicateRefs],
      heldConcernRefs: [...currentNode.heldConcernRefs],
    },
    nextCandidates,
    nextAdmittedRelationshipRefs: nextCandidates
      .filter((candidate) => candidate.admitted)
      .map((candidate) => candidate.relationshipRef),
    furtherNodeRefs,
    effects: false,
    executionAuthority: 'NONE',
  });
}

// [VXG RealForever][VEXWORK][VEXPROCESSFAMILY][CURRENT-STATE]
