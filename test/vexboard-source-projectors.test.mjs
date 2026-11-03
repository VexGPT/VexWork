import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { createRelationshipAttentionQueueSnapshot } from '../src/core/attention-queue.mjs';
import { projectProcessMap } from '../src/core/process-map.mjs';
import { verifySemanticFingerprint } from '../src/core/semantic.mjs';
import { createProject, createWorkgraph } from '../src/core/workgraph.mjs';
import {
  PROCESS_ATLAS_PUBLIC_SAFE_PROJECTOR_REF,
  VEXBOARD_SOURCE_PROJECTION_SCHEMA,
  VEXWORK_PROJECT_PROJECTOR_REF,
  projectProcessAtlasPublicSafe,
  projectVexWorkProjectSource,
} from '../src/core/vexboard-source-projectors.mjs';

const read = (relative) => JSON.parse(fs.readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8'));
const project = createProject(read('projects/vexboard/project.json'));
const alignmentProject = createProject(read('projects/vexwork-vexarchitecture-alignment/project.json'));
const graph = createWorkgraph(read('workgraphs/public.json'), read('blueprint/work-registry.json'));
const repositoryRegistry = read('blueprint/repository-registry.json');
const processRegistry = read('blueprint/process-registry.json');
const processMap = projectProcessMap(processRegistry);

function relationshipAttentionSnapshot() {
  return createRelationshipAttentionQueueSnapshot({
    queueRef: 'queue.vexwork.relationship-currentness.alignment-fixture',
    snapshotRef: 'snapshot.vexwork.relationship-currentness.alignment-fixture.001',
    ownerRepositoryRef: 'repo.vexwork',
    label: 'VexArchitecture Alignment relationship currentness fixture',
    purpose: 'Expose already-owned Alignment relationship currentness to VexBoard without granting projection authority.',
    observedAt: '2026-11-03T03:25:00.000Z',
    sourceRefs: ['project.vexwork.vexarchitecture-alignment'],
    relationships: [
      {
        relationshipRef: 'relationship.vexwork.accepted-source-to-generated-consequences',
        subjectRef: 'project.vexwork.vexarchitecture-alignment',
        subjectKind: 'vexwork.project',
        label: 'Accepted source to generated consequence currentness',
        relationshipState: 'UNSATISFIED',
        observedAt: '2026-11-03T03:24:00.000Z',
        reasonRefs: ['reason.vexwork.generated-consequence.stale'],
        evidenceRefs: ['evidence.vexwork.generated-consequence.stale'],
        sourceRefs: [
          'workgraphs/segments/vexwork-vexarchitecture-alignment.json',
          'workgraphs/public.json',
        ],
        existingWorkRefs: ['work.vexwork.vexarchitecture-alignment.generated-consequence-reconciliation'],
        processRefOrNull: null,
      },
      {
        relationshipRef: 'relationship.vexwork.project-source-to-discoverability',
        subjectRef: 'project.vexwork.vexarchitecture-alignment',
        subjectKind: 'vexwork.project',
        label: 'Project source to discoverability currentness',
        relationshipState: 'SATISFIED',
        observedAt: '2026-11-03T03:24:30.000Z',
        reasonRefs: ['reason.vexwork.project-discoverability.current'],
        evidenceRefs: ['evidence.vexwork.project-discoverability.current'],
        sourceRefs: [
          'projects/vexwork-vexarchitecture-alignment/project.json',
          'blueprint/project-registry.json',
        ],
        existingWorkRefs: ['work.vexwork.vexarchitecture-alignment.project-discoverability-contract'],
        processRefOrNull: null,
      },
      {
        relationshipRef: 'relationship.vexwork.truth-to-vexboard-projection',
        subjectRef: 'project.vexwork.vexarchitecture-alignment',
        subjectKind: 'vexwork.project',
        label: 'VexWork truth to VexBoard projection currentness',
        relationshipState: 'UNKNOWN',
        observedAt: '2026-11-03T03:24:45.000Z',
        reasonRefs: ['reason.vexwork.vexboard-projection.proof-pending'],
        evidenceRefs: [],
        sourceRefs: [
          'src/core/vexboard-source-projectors.mjs',
          'test/vexboard-source-projectors.test.mjs',
        ],
        existingWorkRefs: ['work.vexwork.vexarchitecture-alignment.vexboard-projection-alignment'],
        processRefOrNull: null,
      },
    ],
  }, { repositoryRegistry, processRegistry });
}

test('VexWork Project source projector preserves source ownership and currentness without effects', () => {
  const first = projectVexWorkProjectSource({
    project,
    graph,
    processMap,
    boardRef: 'board.vexwork.project.vexboard',
  });
  const second = projectVexWorkProjectSource({
    project,
    graph,
    processMap,
    boardRef: 'board.vexwork.project.vexboard',
  });

  assert.deepEqual(first, second);
  assert.equal(first.schemaVersion, VEXBOARD_SOURCE_PROJECTION_SCHEMA);
  assert.equal(first.projectorRef, VEXWORK_PROJECT_PROJECTOR_REF);
  assert.deepEqual(first.effects, { sourceMutationPerformed: false, externalEffectsPerformed: false });
  assert.equal(verifySemanticFingerprint(first.graph), true);
  assert.equal(verifySemanticFingerprint(first.projection), true);

  const sourceProjector = first.graph.nodes.find((node) => node.nodeRef === 'work.vexboard.source-projectors');
  assert.equal(sourceProjector.kind, 'REFERENCE');
  assert.equal(sourceProjector.sourceRefs.includes('workgraphs/public.json'), true);
  assert.equal(sourceProjector.sourceRefs.includes('src/shared/vexboard-evidence.mjs'), true);
  assert.equal(sourceProjector.sourceRefs.includes('src/shared/vexboard-source-resolver.mjs'), true);

  const currentness = first.graph.nodes.find(
    (node) => node.nodeRef === 'annotation.work.vexboard.source-projectors.currentness',
  );
  assert.equal(currentness.kind, 'ANNOTATION');
  assert.match(currentness.label, /State: RUNNING/);
  assert.match(currentness.label, /Authority: AUTHORIZED_BOUNDED/);
  assert.match(currentness.label, /Effects: EFFECTS_BOUND/);

  const processNode = first.graph.nodes.find(
    (node) => node.nodeRef === 'reference.process.vexwork.form-project',
  );
  assert.equal(processNode.kind, 'REFERENCE');
  assert.equal(processNode.sourceRefs.includes('docs/process/FORM-PROJECT.md'), true);
  assert.ok(first.graph.relationships.some(
    (relationship) => relationship.fromRef === 'work.vexboard.outcome'
      && relationship.toRef === processNode.nodeRef
      && relationship.labelOrNull === 'FORMED_BY',
  ));
  assert.ok(first.graph.relationships.some(
    (relationship) => relationship.fromRef === 'work.vexboard.source-projectors'
      && relationship.toRef === 'work.vexboard.boardjourney-simulation'
      && relationship.labelOrNull === 'DEPENDS_ON',
  ));
  assert.equal(first.graph.nodes.some((node) => node.kind === 'PROCESS'), false);
});

test('VexWork Project source projector preserves Alignment relationship identity and evidence without owning currentness', () => {
  const attentionSnapshot = relationshipAttentionSnapshot();
  const projected = projectVexWorkProjectSource({
    project: alignmentProject,
    graph,
    processMap,
    attentionSnapshotOrNull: attentionSnapshot,
    boardRef: 'board.vexwork.project.vexarchitecture-alignment.relationship-currentness',
  });

  const heldRef = 'relationship.vexwork.accepted-source-to-generated-consequences';
  const heldNode = projected.graph.nodes.find((node) => node.nodeRef === heldRef);
  assert.equal(heldNode.kind, 'REFERENCE');
  assert.equal(heldNode.sourceRefs.includes('reason.vexwork.generated-consequence.stale'), true);
  assert.equal(heldNode.sourceRefs.includes('evidence.vexwork.generated-consequence.stale'), true);

  const heldCurrentness = projected.graph.nodes.find(
    (node) => node.nodeRef === `annotation.${heldRef}.currentness`,
  );
  assert.equal(heldCurrentness.kind, 'ANNOTATION');
  assert.match(heldCurrentness.label, /Attention: ATTENTION/);
  assert.match(heldCurrentness.label, /Owner: repo\.vexwork/);

  const heldReasons = projected.graph.nodes.find(
    (node) => node.nodeRef === `annotation.${heldRef}.reasons`,
  );
  assert.match(heldReasons.label, /reason\.vexwork\.generated-consequence\.stale/);

  const heldEvidence = projected.graph.nodes.find(
    (node) => node.nodeRef === `annotation.${heldRef}.evidence`,
  );
  assert.match(heldEvidence.label, /evidence\.vexwork\.generated-consequence\.stale/);

  assert.ok(projected.graph.relationships.some(
    (relationship) => relationship.fromRef === heldRef
      && relationship.toRef === 'work.vexwork.vexarchitecture-alignment.generated-consequence-reconciliation'
      && relationship.labelOrNull === 'CURRENTNESS_OF',
  ));

  const clearRef = 'relationship.vexwork.project-source-to-discoverability';
  const clearCurrentness = projected.graph.nodes.find(
    (node) => node.nodeRef === `annotation.${clearRef}.currentness`,
  );
  assert.match(clearCurrentness.label, /Attention: CLEAR/);

  const unknownRef = 'relationship.vexwork.truth-to-vexboard-projection';
  const unknownCurrentness = projected.graph.nodes.find(
    (node) => node.nodeRef === `annotation.${unknownRef}.currentness`,
  );
  assert.match(unknownCurrentness.label, /Attention: UNKNOWN/);
  assert.equal(
    projected.graph.nodes.some((node) => node.nodeRef === `annotation.${unknownRef}.evidence`),
    false,
  );

  assert.deepEqual(projected.effects, {
    sourceMutationPerformed: false,
    externalEffectsPerformed: false,
  });
  assert.equal(projected.graph.sourceRefs.includes(attentionSnapshot.snapshotRef), true);
  assert.equal(projected.graph.nodes.some((node) => node.kind === 'PROCESS'), false);
});

test('VexWork source projector rejects tampered Attention truth instead of repairing or re-evaluating it', () => {
  const tampered = structuredClone(relationshipAttentionSnapshot());
  tampered.entries[0].attentionState = 'CLEAR';

  assert.throws(
    () => projectVexWorkProjectSource({
      project: alignmentProject,
      graph,
      processMap,
      attentionSnapshotOrNull: tampered,
      boardRef: 'board.vexwork.project.vexarchitecture-alignment.tampered-attention',
    }),
    /semanticFingerprint mismatch/,
  );
});

function atlasFixture() {
  return {
    schemaVersion: 'vextreme.process-atlas.public-safe/v1',
    atlasRef: 'atlas.synthetic.vexboard-source-projector.001',
    atlasVersion: '1.0.0',
    nodes: [
      {
        nodeRef: 'atlas.node.question',
        title: 'Find the rightful source',
        state: 'SOURCE_FOUND',
        sourceRefs: ['source.synthetic.question'],
        freshnessRef: 'freshness.synthetic.question',
      },
      {
        nodeRef: 'atlas.node.proof',
        title: 'Prove the bounded effect',
        state: 'VALIDATION_ACTIVE',
        sourceRefs: ['source.synthetic.proof'],
        freshnessRef: 'freshness.synthetic.proof',
      },
    ],
    edges: [{
      edgeRef: 'atlas.edge.question-proof',
      edgeClass: 'RELATES_TO',
      fromRef: 'atlas.node.question',
      toRef: 'atlas.node.proof',
      sourceRefs: ['source.synthetic.edge'],
      freshnessRef: 'freshness.synthetic.question',
    }],
    priorities: [{
      priorityRef: 'atlas.priority.proof',
      targetRef: 'atlas.node.proof',
      rank: 1,
      sourceRefs: ['source.synthetic.proof'],
      freshnessRef: 'freshness.synthetic.proof',
    }],
    serialDependencies: [{
      serialDependencyRef: 'atlas.serial.question-proof',
      beforeRef: 'atlas.node.question',
      afterRef: 'atlas.node.proof',
      sourceRefs: ['source.synthetic.edge'],
      freshnessRef: 'freshness.synthetic.question',
    }],
    questions: [{
      questionRef: 'atlas.question.next',
      targetRef: 'atlas.node.question',
      question: 'What source owns the next decision?',
      sourceRefs: ['source.synthetic.question'],
      freshnessRef: 'freshness.synthetic.question',
    }],
    opportunities: [{
      opportunityRef: 'atlas.opportunity.reuse',
      targetRef: 'atlas.node.proof',
      summary: 'Reuse the exact bounded proof.',
      sourceRefs: ['source.synthetic.proof'],
      freshnessRef: 'freshness.synthetic.proof',
    }],
    freshnessAndInvalidation: [
      { freshnessRef: 'freshness.synthetic.question', state: 'CURRENT' },
      { freshnessRef: 'freshness.synthetic.proof', state: 'UNKNOWN' },
    ],
    projectionReceipt: {
      schemaVersion: 'vextreme.process-atlas.projection-receipt/v1',
      projectionReceiptRef: 'projection-receipt.synthetic.vexboard-source-projector.001',
      atlasRef: 'atlas.synthetic.vexboard-source-projector.001',
      contentSha256: '0'.repeat(64),
      sourceRefs: ['source.synthetic.question', 'source.synthetic.proof', 'source.synthetic.edge'],
    },
  };
}

test('Process Atlas projector consumes public-safe projection only and preserves currentness as annotation', () => {
  const projected = projectProcessAtlasPublicSafe({
    atlas: atlasFixture(),
    boardRef: 'board.process-atlas.synthetic-vexboard',
  });

  assert.equal(projected.projectorRef, PROCESS_ATLAS_PUBLIC_SAFE_PROJECTOR_REF);
  assert.deepEqual(projected.effects, { sourceMutationPerformed: false, externalEffectsPerformed: false });
  assert.equal(projected.graph.nodes.find((node) => node.nodeRef === 'atlas.node.question').kind, 'REFERENCE');
  assert.equal(projected.graph.nodes.some((node) => node.kind === 'PROCESS'), false);
  assert.equal(
    projected.graph.nodes.find((node) => node.nodeRef === 'annotation.atlas.node.question.currentness').label,
    'State: SOURCE_FOUND · Freshness: CURRENT',
  );
  assert.equal(
    projected.graph.relationships.find(
      (relationship) => relationship.relationshipRef === 'rel.vexboard.atlas.atlas.edge.question-proof',
    ).kind,
    'REFERENCE',
  );
  assert.equal(
    projected.graph.relationships.find(
      (relationship) => relationship.relationshipRef === 'rel.vexboard.atlas.serial.atlas.serial.question-proof',
    ).kind,
    'FLOW',
  );
  assert.equal(projected.graph.nodes.some(
    (node) => node.label === 'Question: What source owns the next decision?',
  ), true);
  assert.equal(projected.graph.nodes.some(
    (node) => node.label === 'Opportunity: Reuse the exact bounded proof.',
  ), true);
  assert.equal(projected.graph.nodes.some((node) => node.label === 'Priority: 1'), true);

  const proofAnnotationItems = projected.projection.items
    .filter((item) => ['annotation.atlas.node.proof.currentness',
      'annotation.atlas.opportunity.reuse.opportunity',
      'annotation.atlas.priority.proof.priority'].includes(item.semanticRef));
  assert.equal(proofAnnotationItems.length, 3);
  assert.equal(new Set(proofAnnotationItems.map((item) => item.bounds.y)).size, 3);
});

test('source projector layout ordering is canonical and Atlas freshness fails closed', () => {
  const mixed = atlasFixture();
  mixed.nodes = [
    {
      nodeRef: 'atlas.node.i',
      title: 'Lower',
      state: 'SOURCE_FOUND',
      sourceRefs: ['source.synthetic.question'],
      freshnessRef: 'freshness.synthetic.question',
    },
    {
      nodeRef: 'atlas.node.I',
      title: 'Upper',
      state: 'SOURCE_FOUND',
      sourceRefs: ['source.synthetic.question'],
      freshnessRef: 'freshness.synthetic.question',
    },
  ];
  mixed.edges = [];
  mixed.priorities = [];
  mixed.serialDependencies = [];
  mixed.questions = [];
  mixed.opportunities = [];

  const projected = projectProcessAtlasPublicSafe({
    atlas: mixed,
    boardRef: 'board.process-atlas.canonical-order',
  });
  const upper = projected.projection.items.find((item) => item.semanticRef === 'atlas.node.I');
  const lower = projected.projection.items.find((item) => item.semanticRef === 'atlas.node.i');
  assert.ok(upper.bounds.y < lower.bounds.y);

  const invalidFreshness = atlasFixture();
  invalidFreshness.freshnessAndInvalidation[0].state = '';
  assert.throws(
    () => projectProcessAtlasPublicSafe({
      atlas: invalidFreshness,
      boardRef: 'board.process-atlas.invalid-freshness',
    }),
    /must be non-empty text/,
  );
});

test('Process Atlas projector rejects private Atlas bodies, missing receipts, and dangling topology', () => {
  assert.throws(
    () => projectProcessAtlasPublicSafe({
      atlas: { ...atlasFixture(), schemaVersion: 'vextreme.process-atlas/v1' },
      boardRef: 'board.process-atlas.private',
    }),
    /accepts only vextreme\.process-atlas\.public-safe\/v1/,
  );

  const noReceipt = atlasFixture();
  delete noReceipt.projectionReceipt;
  assert.throws(
    () => projectProcessAtlasPublicSafe({ atlas: noReceipt, boardRef: 'board.process-atlas.no-receipt' }),
    /projectionReceipt required/,
  );

  const dangling = atlasFixture();
  dangling.edges[0].toRef = 'atlas.node.missing';
  assert.throws(
    () => projectProcessAtlasPublicSafe({ atlas: dangling, boardRef: 'board.process-atlas.dangling' }),
    /endpoint missing/,
  );
});

// [VXG RealForever][VEXWORK][VEXBOARD][SOURCE-PROJECTORS]
