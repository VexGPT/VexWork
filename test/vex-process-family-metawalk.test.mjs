import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  admitProcessTransition,
  availableProcessRelationships,
  createProcessState,
  normalizeProcessFamily,
  normalizeProcessState,
  projectProcessHorizon,
} from '../src/shared/vex-process-family.mjs';
import { normalizeBoardGraph, normalizeBoardProjection } from '../src/shared/vexboard-model.mjs';
import { projectProcessHorizonBoard } from '../src/shared/vexboard-process-horizon.mjs';
import { normalizeBoardSourceCatalog, resolveBoardSource } from '../src/shared/vexboard-source-resolver.mjs';

const read = (relative) => JSON.parse(fs.readFileSync(new URL('../' + relative, import.meta.url), 'utf8'));

const boardPath = 'projects/vexboard/examples/vexwork-process-family-metawalk.board.json';
const sourcePath = 'docs/process/VEX-PROCESS-FAMILY-METAWALK.md';
const familyPath = 'docs/process/VEX-PROCESS-FAMILY-METAWALK.json';

function node(nodeRef, label) {
  return {
    nodeRef,
    label,
    purpose: label + ' purpose',
    currentTruthRefs: ['truth.' + nodeRef + '.current'],
    ownerRefs: ['owner.' + nodeRef],
    readingSourceRefs: ['source.' + nodeRef + '.read-now'],
    considerationRefs: ['consideration.' + nodeRef],
    proofRefs: ['proof.' + nodeRef],
  };
}

function familyFixture() {
  return {
    schemaVersion: 'vexwork.process-family/v1',
    familyRef: 'process-family.test.metawalk',
    entryNodeRef: 'node.recover',
    layers: [
      'FORMATION',
      'TOPOLOGY',
      'OWNERSHIP',
      'CONTRACT',
      'IMPLEMENTATION',
      'FOCUSED_PROOF',
      'LIVED_INTEGRATION',
      'RECONCILE_ACCEPT',
    ],
    entryLayer: 'FORMATION',
    movementClasses: [
      'ADVANCES',
      'ENABLES',
      'REFINES',
      'SEMANTIC_GAP',
      'CONTRACT_GAP',
      'IMPLEMENTATION_DEFECT',
      'CURRENTNESS_CHANGED',
      'RECOVERS',
    ],
    forwardMovementClasses: ['ADVANCES', 'ENABLES'],
    nodes: [
      node('node.recover', 'Recover'),
      node('node.contract', 'Contract'),
      node('node.implement', 'Implement'),
      node('node.prove', 'Prove'),
    ],
    relationships: [
      {
        relationshipRef: 'rel.recover-contract',
        movementClass: 'ADVANCES',
        fromRef: 'node.recover',
        toRef: 'node.contract',
        label: 'pressure grounded',
        entryPredicateRefs: ['predicate.contract.allowed'],
      },
      {
        relationshipRef: 'rel.contract-implement',
        movementClass: 'ADVANCES',
        fromRef: 'node.contract',
        toRef: 'node.implement',
        label: 'contract accepted',
        entryPredicateRefs: ['predicate.implementation.allowed'],
      },
      {
        relationshipRef: 'rel.implement-contract-gap',
        movementClass: 'CONTRACT_GAP',
        fromRef: 'node.implement',
        toRef: 'node.contract',
        label: 'contract gap',
        entryPredicateRefs: ['predicate.contract-gap.confirmed'],
      },
      {
        relationshipRef: 'rel.implement-prove',
        movementClass: 'ADVANCES',
        fromRef: 'node.implement',
        toRef: 'node.prove',
        label: 'implementation formed',
        entryPredicateRefs: ['predicate.proof.allowed'],
      },
    ],
    sourceRefs: [sourcePath],
  };
}



test('machine MetaWalk ProcessFamily owns the full-map VexBoard semantic shape', () => {
  const family = normalizeProcessFamily(read(familyPath));
  const board = read(boardPath);
  const graph = normalizeBoardGraph(board.graph);

  assert.equal(board.derivedFromRefOrNull, family.familyRef);
  assert.equal(family.familyRef, 'process-family.vexwork.metawalk');
  assert.equal(family.nodes.length, 10);
  assert.equal(family.relationships.length, 13);

  const boardProcessRefs = graph.nodes
    .filter((entry) => ['SCENE', 'PROCESS'].includes(entry.kind))
    .map((entry) => entry.nodeRef)
    .sort();
  assert.deepEqual(
    boardProcessRefs,
    family.nodes.map((entry) => entry.nodeRef).sort(),
  );
  assert.deepEqual(
    graph.relationships.map((entry) => entry.relationshipRef).sort(),
    family.relationships.map((entry) => entry.relationshipRef).sort(),
  );
  assert.equal(
    graph.nodes.every((entry) => entry.sourceRefs.includes(familyPath)),
    true,
  );
  assert.equal(
    graph.relationships.every((entry) => entry.sourceRefs.includes(familyPath)),
    true,
  );

  const semanticNodes = new Map(
    graph.nodes
      .filter((entry) => ['SCENE', 'PROCESS'].includes(entry.kind))
      .map((entry) => [entry.nodeRef, entry]),
  );
  for (const processNode of family.nodes) {
    const projected = semanticNodes.get(processNode.nodeRef);
    assert.ok(projected, processNode.nodeRef);
    assert.equal(
      projected.label.replace(/^\d+\.\s+/, ''),
      processNode.label,
      'VexBoard presentation may number a node but may not rename its semantic meaning',
    );
  }

  const projectedRelationships = new Map(
    graph.relationships.map((entry) => [entry.relationshipRef, entry]),
  );
  for (const relationship of family.relationships) {
    const projected = projectedRelationships.get(relationship.relationshipRef);
    assert.ok(projected, relationship.relationshipRef);
    assert.equal(projected.fromRef, relationship.fromRef);
    assert.equal(projected.toRef, relationship.toRef);
    assert.equal(projected.labelOrNull, relationship.label);
    assert.equal(
      projected.kind,
      family.forwardMovementClasses.includes(relationship.movementClass) ? 'FLOW' : 'TRANSITION',
    );
  }
});

test('MetaWalk dogfoods scope x node x layer against its real machine definition', () => {
  const family = normalizeProcessFamily(read(familyPath));
  let state = createProcessState(family, {
    stateRef: 'state.metawalk.dogfood.000',
    scopeRef: 'work.vextreme.architecture-convergence.vexrelay-family-circuit-convergence',
  });

  const walk = [
    ['rel.vexwork.process-family-metawalk.entry-recover', 'FORMATION'],
    ['rel.vexwork.process-family-metawalk.recover-topology', 'TOPOLOGY'],
    ['rel.vexwork.process-family-metawalk.topology-ownership', 'OWNERSHIP'],
    ['rel.vexwork.process-family-metawalk.ownership-contracts', 'CONTRACT'],
  ];
  for (let index = 0; index < walk.length; index += 1) {
    const [relationshipRef, nextLayer] = walk[index];
    state = admitProcessTransition({
      family,
      state,
      transitionRef: 'transition.metawalk.dogfood.' + String(index + 1).padStart(3, '0'),
      relationshipRefOrNull: relationshipRef,
      nextLayer,
      evidenceRefs: ['evidence.metawalk.dogfood.' + String(index + 1).padStart(3, '0')],
      carriedIdentityRefs: [],
      satisfiedPredicateRefs: family.relationships
        .find((entry) => entry.relationshipRef === relationshipRef)
        .entryPredicateRefs,
      nextStateRef: 'state.metawalk.dogfood.' + String(index + 1).padStart(3, '0'),
    });
  }

  const horizon = projectProcessHorizon(family, state, {
    satisfiedPredicateRefs: ['predicate.metawalk.relationships-explicit'],
  });
  assert.equal(state.currentNodeRef, 'node.vexwork.process-family-metawalk.contracts');
  assert.equal(state.layer, 'CONTRACT');
  assert.equal(horizon.previousAcceptedOrNull?.nodeRef, 'node.vexwork.process-family-metawalk.ownership');
  assert.equal(horizon.nextCandidates.length, 1);
  assert.equal(horizon.nextCandidates[0].nodeRef, 'node.vexwork.process-family-metawalk.proof-plan');
  assert.equal(horizon.nextCandidates[0].available, true);
  assert.equal(Object.hasOwn(horizon.nextCandidates[0], 'readingSourceRefs'), false);
});


test('MetaWalk keeps provenance at Family scope and read-now scope bounded', () => {
  const family = normalizeProcessFamily(read(familyPath));

  assert.equal(
    family.sourceRefs.includes(sourcePath),
    true,
    'formation source remains recoverable Family-level provenance',
  );
  assert.equal(
    family.nodes.every((entry) => !Object.hasOwn(entry, 'sourceRefs')),
    true,
    'machine nodes must not duplicate Family-level provenance',
  );
  assert.equal(
    family.relationships.every((entry) => !Object.hasOwn(entry, 'sourceRefs')),
    true,
    'machine relationships must not duplicate Family-level provenance',
  );
  assert.equal(
    family.nodes.every((entry) => !entry.readingSourceRefs.includes(sourcePath)),
    true,
    'current nodes must not deep-read the giant formation history by default',
  );
});

test('MetaWalk board is one valid read-only projection of the formation source', () => {
  const board = read(boardPath);
  assert.equal(board.schemaVersion, 'vexboard.local-draft/v1');
  assert.equal(board.draftRef, 'board.vexwork.process-family-metawalk');
  assert.equal(board.mode, 'READ_ONLY_SOURCE');

  const graph = normalizeBoardGraph(board.graph);
  const projection = normalizeBoardProjection(board.projection, graph);

  assert.equal(graph.graphRef, 'graph.vexwork.process-family-metawalk');
  assert.equal(projection.graphRef, graph.graphRef);
  assert.equal(graph.nodes.length, 10);
  assert.equal(graph.relationships.length, 13);
  assert.equal(projection.items.length, graph.nodes.length);

  assert.equal(
    graph.nodes.every((entry) => entry.sourceRefs.includes(sourcePath)),
    true,
    'every MetaWalk node must descend to the canonical formation source',
  );
});

test('MetaWalk preserves forward shape plus explicit causal revisit edges', () => {
  const board = read(boardPath);
  const graph = normalizeBoardGraph(board.graph);
  const relationships = new Map(graph.relationships.map((relationship) => [relationship.relationshipRef, relationship]));

  const forward = [
    'rel.vexwork.process-family-metawalk.entry-recover',
    'rel.vexwork.process-family-metawalk.recover-topology',
    'rel.vexwork.process-family-metawalk.topology-ownership',
    'rel.vexwork.process-family-metawalk.ownership-contracts',
    'rel.vexwork.process-family-metawalk.contracts-proof-plan',
    'rel.vexwork.process-family-metawalk.proof-plan-implementation',
    'rel.vexwork.process-family-metawalk.implementation-focused-proof',
    'rel.vexwork.process-family-metawalk.focused-lived',
    'rel.vexwork.process-family-metawalk.lived-reconcile',
  ];
  for (const ref of forward) assert.equal(relationships.get(ref)?.kind, 'FLOW', ref);

  assert.equal(
    relationships.get('rel.vexwork.process-family-metawalk.implementation-ownership-gap')?.labelOrNull,
    'semantic ambiguity',
  );
  assert.equal(
    relationships.get('rel.vexwork.process-family-metawalk.focused-contract-gap')?.labelOrNull,
    'contract gap',
  );
  assert.equal(
    relationships.get('rel.vexwork.process-family-metawalk.lived-implementation-defect')?.labelOrNull,
    'implementation defect',
  );
});

test('MetaWalk is discoverable through the existing VexBoard source catalog without creating a second loader', () => {
  const catalog = normalizeBoardSourceCatalog(read('projects/vexboard/examples/board-source-catalog.json'));
  const resolution = resolveBoardSource('board.vexwork.process-family-metawalk', [catalog]);

  assert.equal(resolution?.catalogRef, 'catalog.vexboard.patient-zero-examples');
  assert.equal(resolution?.location, './vexwork-process-family-metawalk.board.json');
  assert.equal(resolution?.sourceRefs.includes(sourcePath), true);
  assert.equal(resolution?.sourceRefs.includes(familyPath), true);
  assert.equal(resolution?.sourceRefs.includes(boardPath), true);
});


test('ProcessFamily owns its layer vocabulary instead of inheriting MetaWalk layers globally', () => {
  const family = normalizeProcessFamily({
    schemaVersion: 'vexwork.process-family/v1',
    familyRef: 'process-family.test.custom-layers',
    entryNodeRef: 'node.alpha',
    layers: ['DISCOVER', 'REALIZE'],
    entryLayer: 'DISCOVER',
    movementClasses: ['CONTINUES'],
    forwardMovementClasses: ['CONTINUES'],
    nodes: [
      node('node.alpha', 'Alpha'),
      node('node.beta', 'Beta'),
    ],
    relationships: [{
      relationshipRef: 'rel.alpha-beta',
      movementClass: 'CONTINUES',
      fromRef: 'node.alpha',
      toRef: 'node.beta',
      label: 'advance',
      entryPredicateRefs: [],
    }],
    sourceRefs: [sourcePath],
  });

  const start = createProcessState(family, {
    stateRef: 'state.custom-layers.001',
    scopeRef: 'work.custom-layers',
  });
  assert.equal(start.layer, 'DISCOVER');

  const next = admitProcessTransition({
    family,
    state: start,
    transitionRef: 'transition.custom-layers.001',
    relationshipRefOrNull: 'rel.alpha-beta',
    nextLayer: 'REALIZE',
    evidenceRefs: ['evidence.custom-layers.001'],
    carriedIdentityRefs: [],
    nextStateRef: 'state.custom-layers.002',
  });
  assert.equal(next.layer, 'REALIZE');

  assert.throws(
    () => admitProcessTransition({
      family,
      state: start,
      transitionRef: 'transition.custom-layers.bad',
      relationshipRefOrNull: 'rel.alpha-beta',
      nextLayer: 'IMPLEMENTATION',
      evidenceRefs: ['evidence.custom-layers.bad'],
      carriedIdentityRefs: [],
      nextStateRef: 'state.custom-layers.bad',
    }),
    /invalid for ProcessFamily/,
  );
});

test('ProcessFamily State owns scope x node x layer without becoming a world-state database', () => {
  const family = normalizeProcessFamily(familyFixture());
  const state = createProcessState(family, {
    stateRef: 'state.metawalk.001',
    scopeRef: 'work.test.outcome',
  });

  assert.equal(state.scopeRef, 'work.test.outcome');
  assert.equal(state.currentNodeRef, 'node.recover');
  assert.equal(state.layer, 'FORMATION');
  assert.equal(state.previousStateRefOrNull, null);
  assert.equal(state.lastAcceptedTransitionOrNull, null);

  const illegal = structuredClone(state);
  illegal.providerHead = 'a'.repeat(40);
  assert.throws(
    () => normalizeProcessState(illegal, family),
    /ProcessFamily\.State schema drift/,
  );
});

test('bounded horizon deep-reads CURRENT and keeps future node source detail withheld', () => {
  const family = normalizeProcessFamily(familyFixture());
  const state = createProcessState(family, {
    stateRef: 'state.metawalk.001',
    scopeRef: 'work.test.outcome',
  });
  const horizon = projectProcessHorizon(family, state, {
    satisfiedPredicateRefs: [
      'predicate.contract.allowed',
    ],
  });

  assert.deepEqual(horizon.current.readingSourceRefs, ['source.node.recover.read-now']);
  assert.equal(horizon.nextCandidates.length, 1);
  assert.equal(horizon.nextCandidates[0].nodeRef, 'node.contract');
  assert.equal(horizon.nextCandidates[0].available, true);
  assert.equal(Object.hasOwn(horizon.nextCandidates[0], 'readingSourceRefs'), false);
  assert.deepEqual(horizon.furtherNodeRefs, ['node.implement', 'node.prove']);
  assert.equal(horizon.effects, false);
  assert.equal(horizon.executionAuthority, 'NONE');
});

test('accepted transition carries evidence and identity while rotating CURRENT node', () => {
  const family = normalizeProcessFamily(familyFixture());
  const start = createProcessState(family, {
    stateRef: 'state.metawalk.001',
    scopeRef: 'work.test.outcome',
  });

  const next = admitProcessTransition({
    family,
    state: start,
    transitionRef: 'transition.metawalk.001',
    relationshipRefOrNull: 'rel.recover-contract',
    nextLayer: 'CONTRACT',
    evidenceRefs: ['evidence.pressure-grounded'],
    carriedIdentityRefs: ['identity.work.test.outcome'],
    satisfiedPredicateRefs: [
      'predicate.contract.allowed',
    ],
    nextStateRef: 'state.metawalk.002',
  });

  assert.equal(next.currentNodeRef, 'node.contract');
  assert.equal(next.layer, 'CONTRACT');
  assert.equal(Object.hasOwn(next, 'acceptedEvidenceRefs'), false);
  assert.equal(Object.hasOwn(next, 'carriedIdentityRefs'), false);
  assert.deepEqual(
    next.lastAcceptedTransitionOrNull?.evidenceRefs,
    ['evidence.pressure-grounded'],
  );
  assert.deepEqual(
    next.lastAcceptedTransitionOrNull?.carriedIdentityRefs,
    ['identity.work.test.outcome'],
  );
  assert.equal(next.previousStateRefOrNull, 'state.metawalk.001');
  assert.equal(Object.hasOwn(next.lastAcceptedTransitionOrNull, 'movementClass'), false);

  const horizon = projectProcessHorizon(family, next);
  assert.equal(horizon.previousAcceptedOrNull?.movementClass, 'ADVANCES');
  assert.equal(horizon.previousAcceptedOrNull?.stateRef, 'state.metawalk.001');
  assert.equal(horizon.previousAcceptedOrNull?.nodeRef, 'node.recover');
  assert.equal(horizon.previousAcceptedOrNull?.transitionRef, 'transition.metawalk.001');
  assert.deepEqual(horizon.previousAcceptedOrNull?.evidenceRefs, ['evidence.pressure-grounded']);
  assert.equal(horizon.current.nodeRef, 'node.contract');
});

test('relationship-free layer change may deepen one semantic coordinate without reopening a prior node', () => {
  const family = normalizeProcessFamily(familyFixture());
  const start = createProcessState(family, {
    stateRef: 'state.metawalk.001',
    scopeRef: 'work.test.outcome',
  });

  const next = admitProcessTransition({
    family,
    state: start,
    transitionRef: 'transition.metawalk.layer.001',
    relationshipRefOrNull: null,
    nextLayer: 'TOPOLOGY',
    evidenceRefs: ['evidence.shape-deepened'],
    carriedIdentityRefs: [],
    nextStateRef: 'state.metawalk.002',
  });

  assert.equal(next.currentNodeRef, 'node.recover');
  assert.equal(next.layer, 'TOPOLOGY');
  assert.equal(Object.hasOwn(next.lastAcceptedTransitionOrNull, 'movementClass'), false);
  assert.equal(Object.hasOwn(next.lastAcceptedTransitionOrNull, 'fromNodeRef'), false);
  assert.equal(Object.hasOwn(next.lastAcceptedTransitionOrNull, 'toNodeRef'), false);
  assert.equal(Object.hasOwn(next.lastAcceptedTransitionOrNull, 'toLayer'), false);
  assert.equal(next.lastAcceptedTransitionOrNull?.fromLayer, 'FORMATION');

  const horizon = projectProcessHorizon(family, next);
  assert.equal(horizon.previousAcceptedOrNull?.movementClass, null);
  assert.equal(horizon.previousAcceptedOrNull?.fromLayer, 'FORMATION');
  assert.equal(horizon.previousAcceptedOrNull?.toLayer, 'TOPOLOGY');

  const forgedSemanticClass = structuredClone(next);
  forgedSemanticClass.lastAcceptedTransitionOrNull.movementClass = 'LAYER_REVISIT';
  assert.throws(
    () => normalizeProcessState(forgedSemanticClass, family),
    /process transition last schema drift/,
  );

  const board = projectProcessHorizonBoard({
    family,
    state: next,
    scope: {
      scopeRef: 'work.test.outcome',
      label: 'Layer-only movement',
      purpose: 'Render a structural layer transition without inventing one semantic movement class.',
      sourceRefs: ['work.test.outcome'],
    },
    boardRef: 'board.test.layer-only-movement',
  });
  const graph = normalizeBoardGraph(board.graph);
  const previousCurrent = graph.relationships.find((entry) =>
    entry.fromRef.includes('reference.previous') &&
    entry.toRef.includes('reference.current')
  );
  assert.equal(previousCurrent?.labelOrNull, 'Layer FORMATION → TOPOLOGY');
});

test('transition admission fails closed on stale or foreign movement', () => {
  const family = normalizeProcessFamily(familyFixture());
  const state = createProcessState(family, {
    stateRef: 'state.metawalk.001',
    scopeRef: 'work.test.outcome',
  });

  assert.throws(
    () => admitProcessTransition({
      family,
      state,
      transitionRef: 'transition.bad.foreign',
      relationshipRefOrNull: 'rel.contract-implement',
      nextLayer: 'IMPLEMENTATION',
      evidenceRefs: ['evidence.invalid'],
      carriedIdentityRefs: [],
      nextStateRef: 'state.metawalk.bad',
    }),
    /must leave CURRENT node/,
  );

  assert.throws(
    () => admitProcessTransition({
      family,
      state,
      transitionRef: 'transition.bad.class',
      relationshipRefOrNull: 'rel.recover-contract',
      movementClass: 'RECOVERS',
      nextLayer: 'CONTRACT',
      evidenceRefs: ['evidence.invalid'],
      carriedIdentityRefs: [],
      nextStateRef: 'state.metawalk.bad2',
    }),
    /process transition options schema drift/,
  );
});

test('relationship availability is derived from all required current predicates', () => {
  const family = normalizeProcessFamily(familyFixture());
  const state = createProcessState(family, {
    stateRef: 'state.metawalk.001',
    scopeRef: 'work.test.outcome',
  });

  const held = availableProcessRelationships(family, state);
  assert.equal(held.length, 1);
  assert.equal(held[0].relationshipRef, 'rel.recover-contract');
  assert.equal(held[0].available, false);
  assert.deepEqual(held[0].missingPredicateRefs, ['predicate.contract.allowed']);

  const available = availableProcessRelationships(family, state, {
    satisfiedPredicateRefs: ['predicate.contract.allowed'],
  });
  assert.equal(available[0].available, true);
  assert.deepEqual(available[0].missingPredicateRefs, []);

  assert.throws(
    () => admitProcessTransition({
      family,
      state,
      transitionRef: 'transition.unsatisfied',
      relationshipRefOrNull: 'rel.recover-contract',
      nextLayer: 'CONTRACT',
      evidenceRefs: ['evidence.not-enough'],
      carriedIdentityRefs: [],
      satisfiedPredicateRefs: [],
      nextStateRef: 'state.unsatisfied',
    }),
    /entry predicates unsatisfied: predicate\.contract\.allowed/,
  );
});


test('bounded-horizon VexBoard projection deep-reads CURRENT but withholds future reading sources', () => {
  const family = normalizeProcessFamily(familyFixture());
  const start = createProcessState(family, {
    stateRef: 'state.metawalk.001',
    scopeRef: 'work.test.outcome',
  });
  const current = admitProcessTransition({
    family,
    state: start,
    transitionRef: 'transition.metawalk.001',
    relationshipRefOrNull: 'rel.recover-contract',
    nextLayer: 'CONTRACT',
    evidenceRefs: ['evidence.pressure-grounded'],
    carriedIdentityRefs: ['identity.work.test.outcome'],
    satisfiedPredicateRefs: [
      'predicate.contract.allowed',
    ],
    nextStateRef: 'state.metawalk.002',
  });

  const board = projectProcessHorizonBoard({
    family,
    state: current,
    scope: {
      scopeRef: 'work.test.outcome',
      label: 'Test outcome',
      purpose: 'Prove a fresh instance can perceive only the bounded process neighborhood it has earned.',
      sourceRefs: ['work.test.outcome', sourcePath],
    },
    boardRef: 'board.test.process-horizon',
    satisfiedPredicateRefs: [
      'predicate.implementation.allowed',
    ],
  });

  assert.equal(board.schemaVersion, 'vexboard.local-draft/v1');
  assert.equal(board.mode, 'READ_ONLY_SOURCE');
  assert.equal(board.derivedFromRefOrNull, current.stateRef);
  const graph = normalizeBoardGraph(board.graph);
  const projection = normalizeBoardProjection(board.projection, graph);
  assert.equal(projection.graphRef, graph.graphRef);

  const currentNode = graph.nodes.find((entry) => entry.label.startsWith('CURRENT · '));
  const previousNode = graph.nodes.find((entry) => entry.label.startsWith('PREVIOUS · '));
  const nextNode = graph.nodes.find((entry) => entry.label.startsWith('NEXT · '));
  const laterNode = graph.nodes.find((entry) => entry.label.startsWith('LATER · '));

  assert.equal(currentNode?.label, 'CURRENT · Contract');
  assert.equal(currentNode?.sourceRefs.includes('source.node.contract.read-now'), true);
  assert.equal(currentNode?.sourceRefs.includes('proof.node.contract'), true);

  assert.equal(previousNode?.label, 'PREVIOUS · Recover');
  assert.equal(previousNode?.sourceRefs.includes('state.metawalk.001'), true);
  assert.equal(previousNode?.sourceRefs.includes('evidence.pressure-grounded'), true);

  assert.equal(nextNode?.label, 'NEXT · Implement');
  assert.equal(nextNode?.sourceRefs.includes('predicate.implementation.allowed'), true);
  assert.equal(nextNode?.sourceRefs.includes('source.node.implement.read-now'), false);
  assert.equal(nextNode?.sourceRefs.includes('proof.node.implement'), false);

  assert.equal(laterNode?.label, 'LATER · Prove');
  assert.equal(laterNode?.sourceRefs.includes('source.node.prove.read-now'), false);
  assert.equal(laterNode?.sourceRefs.includes('proof.node.prove'), false);

  const nextRelationship = graph.relationships.find((entry) =>
    entry.fromRef.includes('reference.current') &&
    entry.toRef.includes('reference.next')
  );
  assert.match(nextRelationship?.labelOrNull ?? '', /ADVANCES · AVAILABLE/);
});

test('bounded-horizon projector rejects a scope projection that does not match current ProcessFamily State', () => {
  const family = normalizeProcessFamily(familyFixture());
  const state = createProcessState(family, {
    stateRef: 'state.metawalk.001',
    scopeRef: 'work.test.outcome',
  });

  assert.throws(
    () => projectProcessHorizonBoard({
      family,
      state,
      scope: {
        scopeRef: 'work.other.outcome',
        label: 'Wrong outcome',
        purpose: 'This must not project over a foreign process State.',
        sourceRefs: ['work.other.outcome'],
      },
      boardRef: 'board.test.process-horizon.foreign',
    }),
    /scopeRef must match ProcessFamily\.State scopeRef/,
  );
});



test('ProcessFamily rejects unearned per-node and per-relationship provenance fields', () => {
  const schema = familyFixture();

  const nodeLocal = structuredClone(schema);
  nodeLocal.nodes[0].sourceRefs = ['source.node-local'];
  assert.throws(
    () => normalizeProcessFamily(nodeLocal),
    /process node schema drift/,
  );

  const relationshipLocal = structuredClone(schema);
  relationshipLocal.relationships[0].sourceRefs = ['source.relationship-local'];
  assert.throws(
    () => normalizeProcessFamily(relationshipLocal),
    /process relationship schema drift/,
  );
});

test('ProcessFamily definition fails closed on identity, topology and movement contradictions', () => {
  const schema = familyFixture();

  const wrongSchema = structuredClone(schema);
  wrongSchema.schemaVersion = 'wrong';
  assert.throws(() => normalizeProcessFamily(wrongSchema), /ProcessFamily schema mismatch/);

  const unconsumedFamilyPurpose = structuredClone(schema);
  unconsumedFamilyPurpose.purpose = 'No current machine consumer owns this field.';
  assert.throws(
    () => normalizeProcessFamily(unconsumedFamilyPurpose),
    /ProcessFamily schema drift/,
  );

  const duplicateNode = structuredClone(schema);
  duplicateNode.nodes.push(structuredClone(duplicateNode.nodes[0]));
  assert.throws(() => normalizeProcessFamily(duplicateNode), /nodeRef must be unique/);

  const missingEntry = structuredClone(schema);
  missingEntry.entryNodeRef = 'node.missing';
  assert.throws(() => normalizeProcessFamily(missingEntry), /entryNodeRef missing/);

  const invalidMovement = structuredClone(schema);
  invalidMovement.relationships[0].movementClass = 'LAYER_REVISIT';
  assert.throws(() => normalizeProcessFamily(invalidMovement), /movementClass invalid/);

  const missingEndpoint = structuredClone(schema);
  missingEndpoint.relationships[0].toRef = 'node.missing';
  assert.throws(() => normalizeProcessFamily(missingEndpoint), /toRef missing/);

  const invalidMovementVocabulary = structuredClone(schema);
  invalidMovementVocabulary.relationships[0].movementClass = 'UNDECLARED';
  assert.throws(
    () => normalizeProcessFamily(invalidMovementVocabulary),
    /movementClass invalid for ProcessFamily/,
  );

  const invalidForwardVocabulary = structuredClone(schema);
  invalidForwardVocabulary.forwardMovementClasses = ['UNDECLARED'];
  assert.throws(
    () => normalizeProcessFamily(invalidForwardVocabulary),
    /forwardMovementClasses must belong to movementClasses/,
  );

  const familyOwnedLayerRevisitName = structuredClone(schema);
  familyOwnedLayerRevisitName.movementClasses.push('LAYER_REVISIT');
  familyOwnedLayerRevisitName.relationships[0].movementClass = 'LAYER_REVISIT';
  assert.equal(
    normalizeProcessFamily(familyOwnedLayerRevisitName).relationships
      .find((entry) => entry.relationshipRef === 'rel.recover-contract')
      ?.movementClass,
    'LAYER_REVISIT',
    'generic core must not reserve this spelling as universal semantics',
  );

  const invalidEntryLayer = structuredClone(schema);
  invalidEntryLayer.entryLayer = 'NOT_DECLARED';
  assert.throws(
    () => normalizeProcessFamily(invalidEntryLayer),
    /entryLayer must belong to layers/,
  );

  const duplicateLayer = structuredClone(schema);
  duplicateLayer.layers.push(duplicateLayer.layers[0]);
  assert.throws(
    () => normalizeProcessFamily(duplicateLayer),
    /ProcessFamily.layers must be unique/,
  );

  const orphan = structuredClone(schema);
  orphan.nodes.push(node('node.orphan', 'Orphan'));
  assert.throws(
    () => normalizeProcessFamily(orphan),
    /nodes unreachable from entryNodeRef: node\.orphan/,
  );
});

test('ProcessFamily State fails closed on foreign family, invalid layer and corrupted transition lineage', () => {
  const family = normalizeProcessFamily(familyFixture());
  const start = createProcessState(family, {
    stateRef: 'state.lineage.001',
    scopeRef: 'work.test.outcome',
  });
  const next = admitProcessTransition({
    family,
    state: start,
    transitionRef: 'transition.lineage.001',
    relationshipRefOrNull: 'rel.recover-contract',
    nextLayer: 'CONTRACT',
    evidenceRefs: ['evidence.lineage.001'],
    carriedIdentityRefs: ['identity.lineage.001'],
    satisfiedPredicateRefs: [
      'predicate.contract.allowed',
    ],
    nextStateRef: 'state.lineage.002',
  });

  const foreignFamily = structuredClone(start);
  foreignFamily.familyRef = 'process-family.other';
  assert.throws(() => normalizeProcessState(foreignFamily, family), /familyRef mismatch/);

  const invalidLayer = structuredClone(start);
  invalidLayer.layer = 'MAGICAL_LAYER';
  assert.throws(() => normalizeProcessState(invalidLayer, family), /layer invalid/);

  const badRelationshipTarget = structuredClone(next);
  badRelationshipTarget.lastAcceptedTransitionOrNull.relationshipRefOrNull = 'rel.implement-prove';
  assert.throws(
    () => normalizeProcessState(badRelationshipTarget, family),
    /currentNodeRef must match last accepted relationship target/,
  );

  const forgedEvidenceField = structuredClone(next);
  forgedEvidenceField.acceptedEvidenceRefs = ['evidence.historical'];
  assert.throws(
    () => normalizeProcessState(forgedEvidenceField, family),
    /ProcessFamily\.State schema drift/,
  );

  const forgedIdentityField = structuredClone(next);
  forgedIdentityField.carriedIdentityRefs = ['identity.historical'];
  assert.throws(
    () => normalizeProcessState(forgedIdentityField, family),
    /ProcessFamily\.State schema drift/,
  );

  const historicalSourceBag = structuredClone(next);
  historicalSourceBag.sourceRefs = ['source.historical'];
  assert.throws(
    () => normalizeProcessState(historicalSourceBag, family),
    /ProcessFamily\.State schema drift/,
  );
});


test('ProcessFamily State keeps one predecessor link and one accepted transition instead of copying full walk history', () => {
  const family = normalizeProcessFamily(familyFixture());
  const first = createProcessState(family, {
    stateRef: 'state.compact.001',
    scopeRef: 'work.test.outcome',
  });

  const second = admitProcessTransition({
    family,
    state: first,
    transitionRef: 'transition.compact.001',
    relationshipRefOrNull: 'rel.recover-contract',
    nextLayer: 'CONTRACT',
    evidenceRefs: ['evidence.compact.001'],
    carriedIdentityRefs: ['identity.stable'],
    satisfiedPredicateRefs: [
      'predicate.contract.allowed',
    ],
    nextStateRef: 'state.compact.002',
  });

  const third = admitProcessTransition({
    family,
    state: second,
    transitionRef: 'transition.compact.002',
    relationshipRefOrNull: 'rel.contract-implement',
    nextLayer: 'IMPLEMENTATION',
    evidenceRefs: ['evidence.compact.002'],
    carriedIdentityRefs: ['identity.stable'],
    satisfiedPredicateRefs: [
      'predicate.implementation.allowed',
    ],
    nextStateRef: 'state.compact.003',
  });

  assert.equal(Object.hasOwn(third, 'transitionHistory'), false);
  assert.equal(third.previousStateRefOrNull, 'state.compact.002');
  assert.equal(third.lastAcceptedTransitionOrNull?.transitionRef, 'transition.compact.002');
  assert.equal(third.lastAcceptedTransitionOrNull?.relationshipRefOrNull, 'rel.contract-implement');
  assert.equal(Object.hasOwn(third.lastAcceptedTransitionOrNull, 'fromNodeRef'), false);
  assert.equal(Object.hasOwn(third.lastAcceptedTransitionOrNull, 'toNodeRef'), false);
  assert.equal(Object.hasOwn(third.lastAcceptedTransitionOrNull, 'toLayer'), false);
  assert.equal(Object.hasOwn(third, 'acceptedEvidenceRefs'), false);
  assert.equal(Object.hasOwn(third, 'carriedIdentityRefs'), false);
  assert.deepEqual(third.lastAcceptedTransitionOrNull?.evidenceRefs, ['evidence.compact.002']);
  assert.deepEqual(third.lastAcceptedTransitionOrNull?.carriedIdentityRefs, ['identity.stable']);

  const horizon = projectProcessHorizon(family, third);
  assert.equal(horizon.previousAcceptedOrNull?.stateRef, 'state.compact.002');
  assert.equal(horizon.previousAcceptedOrNull?.nodeRef, 'node.contract');
  assert.deepEqual(horizon.previousAcceptedOrNull?.evidenceRefs, ['evidence.compact.002']);
});

test('ProcessFamily State allows explicit continuity-identity pruning at a transition boundary', () => {
  const family = normalizeProcessFamily(familyFixture());
  const start = createProcessState(family, {
    stateRef: 'state.prune.001',
    scopeRef: 'work.test.outcome',
  });
  const middle = admitProcessTransition({
    family,
    state: start,
    transitionRef: 'transition.prune.001',
    relationshipRefOrNull: 'rel.recover-contract',
    nextLayer: 'CONTRACT',
    evidenceRefs: ['evidence.prune.001'],
    carriedIdentityRefs: ['identity.keep', 'identity.retire'],
    satisfiedPredicateRefs: [
      'predicate.contract.allowed',
    ],
    nextStateRef: 'state.prune.002',
  });
  const next = admitProcessTransition({
    family,
    state: middle,
    transitionRef: 'transition.prune.002',
    relationshipRefOrNull: 'rel.contract-implement',
    nextLayer: 'IMPLEMENTATION',
    evidenceRefs: ['evidence.prune.002'],
    carriedIdentityRefs: ['identity.keep'],
    satisfiedPredicateRefs: [
      'predicate.implementation.allowed',
    ],
    nextStateRef: 'state.prune.003',
  });

  assert.equal(Object.hasOwn(next, 'carriedIdentityRefs'), false);
  assert.deepEqual(next.lastAcceptedTransitionOrNull?.carriedIdentityRefs, ['identity.keep']);
});



test('entry ProcessFamily State cannot invent transition evidence, identities, or non-entry layer', () => {
  const family = normalizeProcessFamily(familyFixture());

  assert.throws(
    () => createProcessState(family, {
      stateRef: 'state.entry.bad-evidence',
      scopeRef: 'work.test.outcome',
      acceptedEvidenceRefs: ['evidence.historical'],
    }),
    /creation options schema drift/,
  );

  assert.throws(
    () => createProcessState(family, {
      stateRef: 'state.entry.bad-identity',
      scopeRef: 'work.test.outcome',
      carriedIdentityRefs: ['identity.historical'],
    }),
    /creation options schema drift/,
  );

  assert.throws(
    () => createProcessState(family, {
      stateRef: 'state.entry.bad-layer',
      scopeRef: 'work.test.outcome',
      layer: 'IMPLEMENTATION',
    }),
    /creation options schema drift/,
  );

  const valid = createProcessState(family, {
    stateRef: 'state.entry.valid',
    scopeRef: 'work.test.outcome',
  });
  assert.equal(valid.layer, family.entryLayer);
  assert.equal(Object.hasOwn(valid, 'acceptedEvidenceRefs'), false);
  assert.equal(Object.hasOwn(valid, 'carriedIdentityRefs'), false);
  assert.equal(valid.previousStateRefOrNull, null);
  assert.equal(valid.lastAcceptedTransitionOrNull, null);

  const forgedEvidence = structuredClone(valid);
  forgedEvidence.acceptedEvidenceRefs = ['evidence.historical'];
  assert.throws(
    () => normalizeProcessState(forgedEvidence, family),
    /ProcessFamily\.State schema drift/,
  );

  const forgedIdentity = structuredClone(valid);
  forgedIdentity.carriedIdentityRefs = ['identity.historical'];
  assert.throws(
    () => normalizeProcessState(forgedIdentity, family),
    /ProcessFamily\.State schema drift/,
  );

  const forgedLayer = structuredClone(valid);
  forgedLayer.layer = 'IMPLEMENTATION';
  assert.throws(
    () => normalizeProcessState(forgedLayer, family),
    /without transition must be at entryLayer/,
  );
});

test('every admitted transition must state carried identities explicitly', () => {
  const family = normalizeProcessFamily(familyFixture());
  const state = createProcessState(family, {
    stateRef: 'state.identity-explicit.001',
    scopeRef: 'work.test.outcome',
  });

  assert.throws(
    () => admitProcessTransition({
      family,
      state,
      transitionRef: 'transition.identity-explicit.001',
      relationshipRefOrNull: 'rel.recover-contract',
      nextLayer: 'CONTRACT',
      evidenceRefs: ['evidence.identity-explicit.001'],
      satisfiedPredicateRefs: [
        'predicate.contract.allowed',
      ],
      nextStateRef: 'state.identity-explicit.002',
    }),
    /carriedIdentityRefs must be an array/,
  );
});

test('ProcessFamily State creation and transition APIs reject historical source bags', () => {
  const family = normalizeProcessFamily(familyFixture());

  assert.throws(
    () => createProcessState(family, {
      stateRef: 'state.source-bag.001',
      scopeRef: 'work.test.outcome',
      sourceRefs: ['source.historical'],
    }),
    /creation options schema drift/,
  );

  const state = createProcessState(family, {
    stateRef: 'state.source-bag.002',
    scopeRef: 'work.test.outcome',
  });

  assert.throws(
    () => admitProcessTransition({
      family,
      state,
      transitionRef: 'transition.source-bag.001',
      relationshipRefOrNull: 'rel.recover-contract',
      nextLayer: 'CONTRACT',
      evidenceRefs: ['evidence.source-bag.001'],
      carriedIdentityRefs: [],
      satisfiedPredicateRefs: [
        'predicate.contract.allowed',
      ],
      nextStateRef: 'state.source-bag.003',
      sourceRefs: ['source.historical'],
    }),
    /transition options schema drift/,
  );
});

test('bounded horizon derives CURRENT source grounding from current State evidence without historical source bags', () => {
  const family = normalizeProcessFamily(familyFixture());
  const first = createProcessState(family, {
    stateRef: 'state.source-current.001',
    scopeRef: 'work.test.outcome',
  });
  const second = admitProcessTransition({
    family,
    state: first,
    transitionRef: 'transition.source-current.001',
    relationshipRefOrNull: 'rel.recover-contract',
    nextLayer: 'CONTRACT',
    evidenceRefs: ['evidence.current.001'],
    carriedIdentityRefs: ['identity.current'],
    satisfiedPredicateRefs: [
      'predicate.contract.allowed',
    ],
    nextStateRef: 'state.source-current.002',
  });
  const third = admitProcessTransition({
    family,
    state: second,
    transitionRef: 'transition.source-current.002',
    relationshipRefOrNull: 'rel.contract-implement',
    nextLayer: 'IMPLEMENTATION',
    evidenceRefs: ['evidence.current.002'],
    carriedIdentityRefs: ['identity.current'],
    satisfiedPredicateRefs: [
      'predicate.implementation.allowed',
    ],
    nextStateRef: 'state.source-current.003',
  });

  const board = projectProcessHorizonBoard({
    family,
    state: third,
    scope: {
      scopeRef: 'work.test.outcome',
      label: 'Current source grounding',
      purpose: 'Prove CURRENT source context is derived from the bounded current State.',
      sourceRefs: ['work.test.outcome'],
    },
    boardRef: 'board.test.current-source-grounding',
  });
  const graph = normalizeBoardGraph(board.graph);
  const current = graph.nodes.find((entry) => entry.label === 'CURRENT · Implement');

  assert.equal(current?.sourceRefs.includes('evidence.current.002'), true);
  assert.equal(current?.sourceRefs.includes('identity.current'), true);
  assert.equal(current?.sourceRefs.includes('evidence.current.001'), false);
  assert.equal(Object.hasOwn(third, 'sourceRefs'), false);
  assert.equal(Object.hasOwn(third, 'acceptedEvidenceRefs'), false);
  assert.deepEqual(third.lastAcceptedTransitionOrNull?.evidenceRefs, ['evidence.current.002']);
});

test('transition formation rejects unknown relationships, empty evidence and no-op relationship-free layer changes', () => {
  const family = normalizeProcessFamily(familyFixture());
  const state = createProcessState(family, {
    stateRef: 'state.reject.001',
    scopeRef: 'work.test.outcome',
  });

  assert.throws(
    () => admitProcessTransition({
      family,
      state,
      transitionRef: 'transition.reject.unknown',
      relationshipRefOrNull: 'rel.unknown',
      nextLayer: 'CONTRACT',
      evidenceRefs: ['evidence.reject.unknown'],
      carriedIdentityRefs: [],
      nextStateRef: 'state.reject.unknown',
    }),
    /relationship missing/,
  );

  assert.throws(
    () => admitProcessTransition({
      family,
      state,
      transitionRef: 'transition.reject.empty-evidence',
      relationshipRefOrNull: 'rel.recover-contract',
      nextLayer: 'CONTRACT',
      evidenceRefs: [],
      carriedIdentityRefs: [],
      satisfiedPredicateRefs: [
        'predicate.contract.allowed',
      ],
      nextStateRef: 'state.reject.empty-evidence',
    }),
    /evidenceRefs must be non-empty/,
  );

  assert.throws(
    () => admitProcessTransition({
      family,
      state,
      transitionRef: 'transition.reject.noop-layer',
      relationshipRefOrNull: null,
      nextLayer: 'FORMATION',
      evidenceRefs: ['evidence.reject.noop-layer'],
      carriedIdentityRefs: [],
      nextStateRef: 'state.reject.noop-layer',
    }),
    /relationship-free layer transition must change layer/,
  );
});


test('FURTHER route contains only forward-reachable process nodes, not completed history or feedback-only branches', () => {
  const family = normalizeProcessFamily(familyFixture());
  const start = createProcessState(family, {
    stateRef: 'state.forward.001',
    scopeRef: 'work.test.outcome',
  });
  const contract = admitProcessTransition({
    family,
    state: start,
    transitionRef: 'transition.forward.001',
    relationshipRefOrNull: 'rel.recover-contract',
    nextLayer: 'CONTRACT',
    evidenceRefs: ['evidence.forward.001'],
    carriedIdentityRefs: [],
    satisfiedPredicateRefs: [
      'predicate.contract.allowed',
    ],
    nextStateRef: 'state.forward.002',
  });
  const implementation = admitProcessTransition({
    family,
    state: contract,
    transitionRef: 'transition.forward.002',
    relationshipRefOrNull: 'rel.contract-implement',
    nextLayer: 'IMPLEMENTATION',
    evidenceRefs: ['evidence.forward.002'],
    carriedIdentityRefs: [],
    satisfiedPredicateRefs: [
      'predicate.implementation.allowed',
    ],
    nextStateRef: 'state.forward.003',
  });

  const horizon = projectProcessHorizon(family, implementation);
  assert.deepEqual(
    horizon.nextCandidates.map((entry) => entry.nodeRef).sort(),
    ['node.contract', 'node.prove'],
  );
  assert.deepEqual(horizon.furtherNodeRefs, []);

  const board = projectProcessHorizonBoard({
    family,
    state: implementation,
    scope: {
      scopeRef: 'work.test.outcome',
      label: 'Forward route',
      purpose: 'Do not relabel completed or feedback-only topology as future route.',
      sourceRefs: ['work.test.outcome'],
    },
    boardRef: 'board.test.forward-route',
  });
  const graph = normalizeBoardGraph(board.graph);

  assert.equal(
    graph.nodes.some((entry) => entry.label === 'LATER · Recover'),
    false,
  );
  assert.equal(
    graph.nodes.some((entry) => entry.label === 'LATER · Contract'),
    false,
  );
});

test('initial bounded horizon has no PREVIOUS slot and may have no FURTHER route', () => {
  const tiny = normalizeProcessFamily({
    schemaVersion: 'vexwork.process-family/v1',
    familyRef: 'process-family.test.tiny',
    entryNodeRef: 'node.start',
    layers: ['START', 'DONE'],
    entryLayer: 'START',
    movementClasses: ['ADVANCES'],
    forwardMovementClasses: ['ADVANCES'],
    nodes: [
      node('node.start', 'Start'),
      node('node.finish', 'Finish'),
    ],
    relationships: [{
      relationshipRef: 'rel.start-finish',
      movementClass: 'ADVANCES',
      fromRef: 'node.start',
      toRef: 'node.finish',
      label: 'finish when earned',
      entryPredicateRefs: ['predicate.finish.allowed'],
    }],
    sourceRefs: [sourcePath],
  });
  const state = createProcessState(tiny, {
    stateRef: 'state.tiny.001',
    scopeRef: 'work.tiny.outcome',
  });

  const horizon = projectProcessHorizon(tiny, state);
  assert.equal(horizon.previousAcceptedOrNull, null);
  assert.deepEqual(horizon.furtherNodeRefs, []);
  assert.equal(horizon.nextCandidates[0].available, false);
  assert.deepEqual(horizon.nextCandidates[0].missingPredicateRefs, [
    'predicate.finish.allowed',
  ]);

  const board = projectProcessHorizonBoard({
    family: tiny,
    state,
    scope: {
      scopeRef: 'work.tiny.outcome',
      label: 'Tiny outcome',
      purpose: 'Prove the initial horizon omits PREVIOUS and FURTHER when neither exists.',
      sourceRefs: ['work.tiny.outcome'],
    },
    boardRef: 'board.test.tiny-horizon',
  });
  const graph = normalizeBoardGraph(board.graph);
  assert.equal(board.derivedFromRefOrNull, state.stateRef);
  assert.equal(graph.nodes.some((entry) => entry.label.startsWith('PREVIOUS · ')), false);
  assert.equal(graph.nodes.some((entry) => entry.label.startsWith('FURTHER ROUTE · ')), false);
  assert.equal(graph.nodes.some((entry) => entry.label === 'NEXT · Finish'), true);

  assert.throws(
    () => projectProcessHorizonBoard({
      family: tiny,
      state,
      scope: {
        scopeRef: 'work.tiny.outcome',
        label: 'Tiny outcome',
        purpose: 'Invalid board identity should fail before projection.',
        sourceRefs: ['work.tiny.outcome'],
      },
      boardRef: 'bad board ref',
    }),
    /stable ref|must start with board/,
  );
});
