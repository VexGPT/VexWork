import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

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
const graph = createWorkgraph(read('workgraphs/public.json'), read('blueprint/work-registry.json'));
const processMap = projectProcessMap(read('blueprint/process-registry.json'));

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

  const currentness = first.graph.nodes.find(
    (node) => node.nodeRef === 'annotation.work.vexboard.source-projectors.currentness',
  );
  assert.equal(currentness.kind, 'ANNOTATION');
  assert.match(currentness.label, /State: READY/);
  assert.match(currentness.label, /Authority: NO_AUTHORITY/);
  assert.match(currentness.label, /Effects: NO_EFFECTS/);

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
    }],
    priorities: [{
      priorityRef: 'atlas.priority.proof',
      targetRef: 'atlas.node.proof',
      rank: 1,
      sourceRefs: ['source.synthetic.proof'],
    }],
    serialDependencies: [{
      serialDependencyRef: 'atlas.serial.question-proof',
      beforeRef: 'atlas.node.question',
      afterRef: 'atlas.node.proof',
      sourceRefs: ['source.synthetic.edge'],
    }],
    questions: [{
      questionRef: 'atlas.question.next',
      targetRef: 'atlas.node.question',
      question: 'What source owns the next decision?',
      sourceRefs: ['source.synthetic.question'],
    }],
    opportunities: [{
      opportunityRef: 'atlas.opportunity.reuse',
      targetRef: 'atlas.node.proof',
      summary: 'Reuse the exact bounded proof.',
      sourceRefs: ['source.synthetic.proof'],
    }],
    freshnessAndInvalidation: [
      { freshnessRef: 'freshness.synthetic.question', state: 'CURRENT' },
      { freshnessRef: 'freshness.synthetic.proof', state: 'UNKNOWN' },
    ],
    projectionReceipt: {
      schemaVersion: 'vextreme.process-atlas.projection-receipt/v1',
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
