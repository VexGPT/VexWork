import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  admitProcessTransition,
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
  assert.equal(resolution?.sourceRefs.includes(boardPath), true);
});

test('ProcessFamily State owns scope x node x depth without becoming a world-state database', () => {
  const family = normalizeProcessFamily(familyFixture());
  const state = createProcessState(family, {
    stateRef: 'state.metawalk.001',
    scopeRef: 'work.test.outcome',
    depth: 'FORMATION',
    sourceRefs: ['source.state.metawalk.001'],
  });

  assert.equal(state.scopeRef, 'work.test.outcome');
  assert.equal(state.currentNodeRef, 'node.recover');
  assert.equal(state.depth, 'FORMATION');
  assert.deepEqual(state.transitionHistory, []);

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
    sourceRefs: ['source.state.metawalk.001'],
  });
  const horizon = projectProcessHorizon(family, state, {
    admittedRelationshipRefs: ['rel.recover-contract'],
  });

  assert.deepEqual(horizon.current.readingSourceRefs, ['source.node.recover.read-now']);
  assert.equal(horizon.nextCandidates.length, 1);
  assert.equal(horizon.nextCandidates[0].nodeRef, 'node.contract');
  assert.equal(horizon.nextCandidates[0].admitted, true);
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
    sourceRefs: ['source.state.metawalk.001'],
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
    nextStateRef: 'state.metawalk.002',
    sourceRefs: ['source.transition.metawalk.001'],
  });

  assert.equal(next.currentNodeRef, 'node.contract');
  assert.equal(next.depth, 'CONTRACT');
  assert.deepEqual(next.acceptedEvidenceRefs, ['evidence.pressure-grounded']);
  assert.deepEqual(next.carriedIdentityRefs, ['identity.work.test.outcome']);
  assert.equal(next.transitionHistory.at(-1).movementClass, 'ADVANCES');

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
    sourceRefs: ['source.state.metawalk.001'],
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
  assert.equal(next.transitionHistory.at(-1).fromNodeRef, 'node.recover');
  assert.equal(next.transitionHistory.at(-1).toNodeRef, 'node.recover');
});

test('transition admission fails closed on stale or foreign movement', () => {
  const family = normalizeProcessFamily(familyFixture());
  const state = createProcessState(family, {
    stateRef: 'state.metawalk.001',
    scopeRef: 'work.test.outcome',
    depth: 'FORMATION',
    sourceRefs: ['source.state.metawalk.001'],
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

test('horizon cannot claim an admitted next edge that is not adjacent to CURRENT', () => {
  const family = normalizeProcessFamily(familyFixture());
  const state = createProcessState(family, {
    stateRef: 'state.metawalk.001',
    scopeRef: 'work.test.outcome',
    depth: 'FORMATION',
    sourceRefs: ['source.state.metawalk.001'],
  });

  assert.throws(
    () => projectProcessHorizon(family, state, {
      admittedRelationshipRefs: ['rel.contract-implement'],
    }),
    /must leave CURRENT node/,
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
    admittedRelationshipRefs: ['rel.contract-implement'],
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
  assert.match(nextRelationship?.labelOrNull ?? '', /ADVANCES · ADMITTED/);
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
