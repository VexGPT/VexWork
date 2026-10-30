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
    entryPredicateRefs: ['predicate.' + nodeRef + '.entry'],
    currentTruthRefs: ['truth.' + nodeRef + '.current'],
    ownerRefs: ['owner.' + nodeRef],
    readingSourceRefs: ['source.' + nodeRef + '.read-now'],
    authorityRefs: ['authority.' + nodeRef],
    considerationRefs: ['consideration.' + nodeRef],
    proofRefs: ['proof.' + nodeRef],
    exitPredicateRefs: ['predicate.' + nodeRef + '.exit'],
    heldConcernRefs: ['held.' + nodeRef],
    sourceRefs: ['source.' + nodeRef],
  };
}

function familyFixture() {
  return {
    schemaVersion: 'vexwork.process-family/v1',
    familyRef: 'process-family.test.metawalk',
    purpose: 'Prove the smallest current-state and bounded-horizon relationship.',
    entryNodeRef: 'node.recover',
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
        sourceRefs: ['source.relationship.recover-contract'],
      },
      {
        relationshipRef: 'rel.contract-implement',
        movementClass: 'ADVANCES',
        fromRef: 'node.contract',
        toRef: 'node.implement',
        label: 'contract accepted',
        entryPredicateRefs: ['predicate.implementation.allowed'],
        sourceRefs: ['source.relationship.contract-implement'],
      },
      {
        relationshipRef: 'rel.implement-contract-gap',
        movementClass: 'CONTRACT_GAP',
        fromRef: 'node.implement',
        toRef: 'node.contract',
        label: 'contract gap',
        entryPredicateRefs: ['predicate.contract-gap.confirmed'],
        sourceRefs: ['source.relationship.implement-contract-gap'],
      },
      {
        relationshipRef: 'rel.implement-prove',
        movementClass: 'ADVANCES',
        fromRef: 'node.implement',
        toRef: 'node.prove',
        label: 'implementation formed',
        entryPredicateRefs: ['predicate.proof.allowed'],
        sourceRefs: ['source.relationship.implement-prove'],
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
});

test('MetaWalk dogfoods scope x node x depth against its real machine definition', () => {
  const family = normalizeProcessFamily(read(familyPath));
  let state = createProcessState(family, {
    stateRef: 'state.metawalk.dogfood.000',
    scopeRef: 'work.vextreme.architecture-convergence.vexrelay-family-circuit-convergence',
    depth: 'FORMATION',
  });

  const walk = [
    ['rel.vexwork.process-family-metawalk.entry-recover', 'FORMATION'],
    ['rel.vexwork.process-family-metawalk.recover-topology', 'TOPOLOGY'],
    ['rel.vexwork.process-family-metawalk.topology-ownership', 'OWNERSHIP'],
    ['rel.vexwork.process-family-metawalk.ownership-contracts', 'CONTRACT'],
  ];
  for (let index = 0; index < walk.length; index += 1) {
    const [relationshipRef, nextDepth] = walk[index];
    state = admitProcessTransition({
      family,
      state,
      transitionRef: 'transition.metawalk.dogfood.' + String(index + 1).padStart(3, '0'),
      relationshipRefOrNull: relationshipRef,
      movementClass: 'ADVANCES',
      nextDepth,
      evidenceRefs: ['evidence.metawalk.dogfood.' + String(index + 1).padStart(3, '0')],
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
  assert.equal(state.depth, 'CONTRACT');
  assert.equal(horizon.previousAcceptedOrNull?.nodeRef, 'node.vexwork.process-family-metawalk.ownership');
  assert.equal(horizon.nextCandidates.length, 1);
  assert.equal(horizon.nextCandidates[0].nodeRef, 'node.vexwork.process-family-metawalk.proof-plan');
  assert.equal(horizon.nextCandidates[0].available, true);
  assert.equal(Object.hasOwn(horizon.nextCandidates[0], 'readingSourceRefs'), false);
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

test('ProcessFamily State owns scope x node x depth without becoming a world-state database', () => {
  const family = normalizeProcessFamily(familyFixture());
  const state = createProcessState(family, {
    stateRef: 'state.metawalk.001',
    scopeRef: 'work.test.outcome',
    depth: 'FORMATION',
  });

  assert.equal(state.scopeRef, 'work.test.outcome');
  assert.equal(state.currentNodeRef, 'node.recover');
  assert.equal(state.depth, 'FORMATION');
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
    depth: 'FORMATION',
  });
  const horizon = projectProcessHorizon(family, state, {
    satisfiedPredicateRefs: [
      'predicate.node.contract.entry',
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
    depth: 'FORMATION',
  });

  const next = admitProcessTransition({
    family,
    state: start,
    transitionRef: 'transition.metawalk.001',
    relationshipRefOrNull: 'rel.recover-contract',
    movementClass: 'ADVANCES',
    nextDepth: 'CONTRACT',
    evidenceRefs: ['evidence.pressure-grounded'],
    carriedIdentityRefs: ['identity.work.test.outcome'],
    satisfiedPredicateRefs: [
      'predicate.node.contract.entry',
      'predicate.contract.allowed',
    ],
    nextStateRef: 'state.metawalk.002',
  });

  assert.equal(next.currentNodeRef, 'node.contract');
  assert.equal(next.depth, 'CONTRACT');
  assert.deepEqual(next.acceptedEvidenceRefs, ['evidence.pressure-grounded']);
  assert.deepEqual(next.carriedIdentityRefs, ['identity.work.test.outcome']);
  assert.equal(next.previousStateRefOrNull, 'state.metawalk.001');
  assert.equal(next.lastAcceptedTransitionOrNull?.movementClass, 'ADVANCES');

  const horizon = projectProcessHorizon(family, next);
  assert.equal(horizon.previousAcceptedOrNull?.nodeRef, 'node.recover');
  assert.equal(horizon.previousAcceptedOrNull?.transitionRef, 'transition.metawalk.001');
  assert.deepEqual(horizon.previousAcceptedOrNull?.evidenceRefs, ['evidence.pressure-grounded']);
  assert.equal(horizon.current.nodeRef, 'node.contract');
});

test('depth revisit may deepen one semantic coordinate without reopening a prior node', () => {
  const family = normalizeProcessFamily(familyFixture());
  const start = createProcessState(family, {
    stateRef: 'state.metawalk.001',
    scopeRef: 'work.test.outcome',
    depth: 'FORMATION',
  });

  const next = admitProcessTransition({
    family,
    state: start,
    transitionRef: 'transition.metawalk.depth.001',
    relationshipRefOrNull: null,
    movementClass: 'DEPTH_REVISIT',
    nextDepth: 'TOPOLOGY',
    evidenceRefs: ['evidence.shape-deepened'],
    nextStateRef: 'state.metawalk.002',
  });

  assert.equal(next.currentNodeRef, 'node.recover');
  assert.equal(next.depth, 'TOPOLOGY');
  assert.equal(next.lastAcceptedTransitionOrNull?.fromNodeRef, 'node.recover');
  assert.equal(next.lastAcceptedTransitionOrNull?.toNodeRef, 'node.recover');
});

test('transition admission fails closed on stale or foreign movement', () => {
  const family = normalizeProcessFamily(familyFixture());
  const state = createProcessState(family, {
    stateRef: 'state.metawalk.001',
    scopeRef: 'work.test.outcome',
    depth: 'FORMATION',
  });

  assert.throws(
    () => admitProcessTransition({
      family,
      state,
      transitionRef: 'transition.bad.foreign',
      relationshipRefOrNull: 'rel.contract-implement',
      movementClass: 'ADVANCES',
      nextDepth: 'IMPLEMENTATION',
      evidenceRefs: ['evidence.invalid'],
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
      nextDepth: 'CONTRACT',
      evidenceRefs: ['evidence.invalid'],
      nextStateRef: 'state.metawalk.bad2',
    }),
    /movementClass must match relationship/,
  );
});

test('relationship availability is derived from all required current predicates', () => {
  const family = normalizeProcessFamily(familyFixture());
  const state = createProcessState(family, {
    stateRef: 'state.metawalk.001',
    scopeRef: 'work.test.outcome',
    depth: 'FORMATION',
  });

  const held = availableProcessRelationships(family, state);
  assert.equal(held.length, 1);
  assert.equal(held[0].relationshipRef, 'rel.recover-contract');
  assert.equal(held[0].available, false);
  assert.deepEqual(held[0].missingPredicateRefs, [
    'predicate.contract.allowed',
    'predicate.node.contract.entry',
  ]);

  const partial = availableProcessRelationships(family, state, {
    satisfiedPredicateRefs: ['predicate.contract.allowed'],
  });
  assert.equal(partial[0].available, false);
  assert.deepEqual(partial[0].missingPredicateRefs, ['predicate.node.contract.entry']);

  const available = availableProcessRelationships(family, state, {
    satisfiedPredicateRefs: [
      'predicate.contract.allowed',
      'predicate.node.contract.entry',
    ],
  });
  assert.equal(available[0].available, true);
  assert.deepEqual(available[0].missingPredicateRefs, []);

  assert.throws(
    () => admitProcessTransition({
      family,
      state,
      transitionRef: 'transition.unsatisfied',
      relationshipRefOrNull: 'rel.recover-contract',
      movementClass: 'ADVANCES',
      nextDepth: 'CONTRACT',
      evidenceRefs: ['evidence.not-enough'],
      satisfiedPredicateRefs: ['predicate.contract.allowed'],
      nextStateRef: 'state.unsatisfied',
    }),
    /entry predicates unsatisfied: predicate\.node\.contract\.entry/,
  );
});


test('bounded-horizon VexBoard projection deep-reads CURRENT but withholds future reading sources', () => {
  const family = normalizeProcessFamily(familyFixture());
  const start = createProcessState(family, {
    stateRef: 'state.metawalk.001',
    scopeRef: 'work.test.outcome',
    depth: 'FORMATION',
  });
  const current = admitProcessTransition({
    family,
    state: start,
    transitionRef: 'transition.metawalk.001',
    relationshipRefOrNull: 'rel.recover-contract',
    movementClass: 'ADVANCES',
    nextDepth: 'CONTRACT',
    evidenceRefs: ['evidence.pressure-grounded'],
    carriedIdentityRefs: ['identity.work.test.outcome'],
    satisfiedPredicateRefs: [
      'predicate.node.contract.entry',
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
      'predicate.node.implement.entry',
      'predicate.implementation.allowed',
    ],
  });

  assert.equal(board.schemaVersion, 'vexboard.local-draft/v1');
  assert.equal(board.mode, 'READ_ONLY_SOURCE');
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
  assert.equal(previousNode?.sourceRefs.includes('evidence.pressure-grounded'), true);

  assert.equal(nextNode?.label, 'NEXT · Implement');
  assert.equal(nextNode?.sourceRefs.includes('predicate.node.implement.entry'), true);
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


test('ProcessFamily definition fails closed on identity, topology and movement contradictions', () => {
  const schema = familyFixture();

  const wrongSchema = structuredClone(schema);
  wrongSchema.schemaVersion = 'wrong';
  assert.throws(() => normalizeProcessFamily(wrongSchema), /ProcessFamily schema mismatch/);

  const duplicateNode = structuredClone(schema);
  duplicateNode.nodes.push(structuredClone(duplicateNode.nodes[0]));
  assert.throws(() => normalizeProcessFamily(duplicateNode), /nodeRef must be unique/);

  const missingEntry = structuredClone(schema);
  missingEntry.entryNodeRef = 'node.missing';
  assert.throws(() => normalizeProcessFamily(missingEntry), /entryNodeRef missing/);

  const invalidMovement = structuredClone(schema);
  invalidMovement.relationships[0].movementClass = 'DEPTH_REVISIT';
  assert.throws(() => normalizeProcessFamily(invalidMovement), /movementClass invalid/);

  const missingEndpoint = structuredClone(schema);
  missingEndpoint.relationships[0].toRef = 'node.missing';
  assert.throws(() => normalizeProcessFamily(missingEndpoint), /toRef missing/);
});

test('ProcessFamily State fails closed on foreign family, invalid depth and corrupted transition lineage', () => {
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
    movementClass: 'ADVANCES',
    nextDepth: 'CONTRACT',
    evidenceRefs: ['evidence.lineage.001'],
    carriedIdentityRefs: ['identity.lineage.001'],
    satisfiedPredicateRefs: [
      'predicate.contract.allowed',
      'predicate.node.contract.entry',
    ],
    nextStateRef: 'state.lineage.002',
  });

  const foreignFamily = structuredClone(start);
  foreignFamily.familyRef = 'process-family.other';
  assert.throws(() => normalizeProcessState(foreignFamily, family), /familyRef mismatch/);

  const invalidDepth = structuredClone(start);
  invalidDepth.depth = 'MAGICAL_DEPTH';
  assert.throws(() => normalizeProcessState(invalidDepth, family), /depth invalid/);

  const badHistoryOrigin = structuredClone(next);
  badHistoryOrigin.lastAcceptedTransitionOrNull.fromNodeRef = 'node.implement';
  assert.throws(
    () => normalizeProcessState(badHistoryOrigin, family),
    /relationship fromRef mismatch/,
  );

  const missingAcceptedEvidence = structuredClone(next);
  missingAcceptedEvidence.acceptedEvidenceRefs = [];
  assert.throws(
    () => normalizeProcessState(missingAcceptedEvidence, family),
    /acceptedEvidenceRefs must exactly equal last accepted transition evidence/,
  );

  const historicalEvidenceSmuggledForward = structuredClone(next);
  historicalEvidenceSmuggledForward.acceptedEvidenceRefs.push('evidence.historical');
  assert.throws(
    () => normalizeProcessState(historicalEvidenceSmuggledForward, family),
    /acceptedEvidenceRefs must exactly equal last accepted transition evidence/,
  );

  const missingCarriedIdentity = structuredClone(next);
  missingCarriedIdentity.carriedIdentityRefs = [];
  assert.throws(
    () => normalizeProcessState(missingCarriedIdentity, family),
    /carriedIdentityRefs must exactly equal last accepted transition identities/,
  );

  const historicalIdentitySmuggledForward = structuredClone(next);
  historicalIdentitySmuggledForward.carriedIdentityRefs.push('identity.historical');
  assert.throws(
    () => normalizeProcessState(historicalIdentitySmuggledForward, family),
    /carriedIdentityRefs must exactly equal last accepted transition identities/,
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
    carriedIdentityRefs: ['identity.stable'],
  });

  const second = admitProcessTransition({
    family,
    state: first,
    transitionRef: 'transition.compact.001',
    relationshipRefOrNull: 'rel.recover-contract',
    movementClass: 'ADVANCES',
    nextDepth: 'CONTRACT',
    evidenceRefs: ['evidence.compact.001'],
    satisfiedPredicateRefs: [
      'predicate.contract.allowed',
      'predicate.node.contract.entry',
    ],
    nextStateRef: 'state.compact.002',
  });

  const third = admitProcessTransition({
    family,
    state: second,
    transitionRef: 'transition.compact.002',
    relationshipRefOrNull: 'rel.contract-implement',
    movementClass: 'ADVANCES',
    nextDepth: 'IMPLEMENTATION',
    evidenceRefs: ['evidence.compact.002'],
    satisfiedPredicateRefs: [
      'predicate.implementation.allowed',
      'predicate.node.implement.entry',
    ],
    nextStateRef: 'state.compact.003',
  });

  assert.equal(Object.hasOwn(third, 'transitionHistory'), false);
  assert.equal(third.previousStateRefOrNull, 'state.compact.002');
  assert.equal(third.lastAcceptedTransitionOrNull?.transitionRef, 'transition.compact.002');
  assert.equal(third.lastAcceptedTransitionOrNull?.fromNodeRef, 'node.contract');
  assert.equal(third.lastAcceptedTransitionOrNull?.toNodeRef, 'node.implement');
  assert.deepEqual(third.acceptedEvidenceRefs, ['evidence.compact.002']);
  assert.deepEqual(third.carriedIdentityRefs, ['identity.stable']);

  const horizon = projectProcessHorizon(family, third);
  assert.equal(horizon.previousAcceptedOrNull?.nodeRef, 'node.contract');
  assert.deepEqual(horizon.previousAcceptedOrNull?.evidenceRefs, ['evidence.compact.002']);
});

test('ProcessFamily State allows explicit continuity-identity pruning at a transition boundary', () => {
  const family = normalizeProcessFamily(familyFixture());
  const start = createProcessState(family, {
    stateRef: 'state.prune.001',
    scopeRef: 'work.test.outcome',
    carriedIdentityRefs: ['identity.keep', 'identity.retire'],
  });
  const next = admitProcessTransition({
    family,
    state: start,
    transitionRef: 'transition.prune.001',
    relationshipRefOrNull: 'rel.recover-contract',
    movementClass: 'ADVANCES',
    nextDepth: 'CONTRACT',
    evidenceRefs: ['evidence.prune.001'],
    carriedIdentityRefs: ['identity.keep'],
    satisfiedPredicateRefs: [
      'predicate.contract.allowed',
      'predicate.node.contract.entry',
    ],
    nextStateRef: 'state.prune.002',
  });

  assert.deepEqual(next.carriedIdentityRefs, ['identity.keep']);
  assert.deepEqual(next.lastAcceptedTransitionOrNull?.carriedIdentityRefs, ['identity.keep']);
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
      movementClass: 'ADVANCES',
      nextDepth: 'CONTRACT',
      evidenceRefs: ['evidence.source-bag.001'],
      satisfiedPredicateRefs: [
        'predicate.contract.allowed',
        'predicate.node.contract.entry',
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
    carriedIdentityRefs: ['identity.current'],
  });
  const second = admitProcessTransition({
    family,
    state: first,
    transitionRef: 'transition.source-current.001',
    relationshipRefOrNull: 'rel.recover-contract',
    movementClass: 'ADVANCES',
    nextDepth: 'CONTRACT',
    evidenceRefs: ['evidence.current.001'],
    satisfiedPredicateRefs: [
      'predicate.contract.allowed',
      'predicate.node.contract.entry',
    ],
    nextStateRef: 'state.source-current.002',
  });
  const third = admitProcessTransition({
    family,
    state: second,
    transitionRef: 'transition.source-current.002',
    relationshipRefOrNull: 'rel.contract-implement',
    movementClass: 'ADVANCES',
    nextDepth: 'IMPLEMENTATION',
    evidenceRefs: ['evidence.current.002'],
    satisfiedPredicateRefs: [
      'predicate.implementation.allowed',
      'predicate.node.implement.entry',
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
  assert.deepEqual(third.acceptedEvidenceRefs, ['evidence.current.002']);
});

test('transition formation rejects unknown relationships, empty evidence and no-op depth revisits', () => {
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
      movementClass: 'ADVANCES',
      nextDepth: 'CONTRACT',
      evidenceRefs: ['evidence.reject.unknown'],
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
      movementClass: 'ADVANCES',
      nextDepth: 'CONTRACT',
      evidenceRefs: [],
      satisfiedPredicateRefs: [
        'predicate.contract.allowed',
        'predicate.node.contract.entry',
      ],
      nextStateRef: 'state.reject.empty-evidence',
    }),
    /evidenceRefs must be non-empty/,
  );

  assert.throws(
    () => admitProcessTransition({
      family,
      state,
      transitionRef: 'transition.reject.noop-depth',
      relationshipRefOrNull: null,
      movementClass: 'DEPTH_REVISIT',
      nextDepth: 'FORMATION',
      evidenceRefs: ['evidence.reject.noop-depth'],
      nextStateRef: 'state.reject.noop-depth',
    }),
    /must change node or depth/,
  );
});

test('initial bounded horizon has no PREVIOUS slot and may have no FURTHER route', () => {
  const tiny = normalizeProcessFamily({
    schemaVersion: 'vexwork.process-family/v1',
    familyRef: 'process-family.test.tiny',
    purpose: 'Exercise the initial bounded horizon without previous or further process coordinates.',
    entryNodeRef: 'node.start',
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
      sourceRefs: ['source.relationship.start-finish'],
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
    'predicate.node.finish.entry',
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
