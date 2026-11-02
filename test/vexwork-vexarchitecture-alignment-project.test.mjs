import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { assertKnownProcessRefs } from '../src/core/process-map.mjs';
import { assertKnownRepositoryRefs } from '../src/core/repository-graph.mjs';
import { createBoardView, projectWorkBoard } from '../src/core/work-board.mjs';
import { createWorkgraphSegment } from '../src/core/workgraph-composition.mjs';
import { createProject, createWorkgraph, projectWorkRefs } from '../src/core/workgraph.mjs';

const read = (relative) => JSON.parse(fs.readFileSync(new URL('../' + relative, import.meta.url), 'utf8'));

const workRegistry = read('blueprint/work-registry.json');
const repositoryRegistry = read('blueprint/repository-registry.json');
const processRegistry = read('blueprint/process-registry.json');
const project = createProject(read('projects/vexwork-vexarchitecture-alignment/project.json'));
const view = createBoardView(read('projects/vexwork-vexarchitecture-alignment/board.view.json'), workRegistry);
const segment = createWorkgraphSegment(read('workgraphs/segments/vexwork-vexarchitecture-alignment.json'), workRegistry);

const graph = createWorkgraph({
  schemaVersion: 'vexwork.workgraph/v1',
  graphRef: segment.graphRef,
  rootWorkRefs: segment.items.filter((item) => item.parentWorkRefOrNull === null).map((item) => item.workRef),
  items: segment.items,
  transitions: segment.transitions,
  sourceRefs: segment.sourceRefs,
  formedAt: segment.formedAt,
}, workRegistry);

test('VexWork VexArchitecture Alignment project-local source is internally coherent', () => {
  assert.equal(project.projectRef, 'project.vexwork.vexarchitecture-alignment');
  assert.equal(view.projectRef, project.projectRef);
  assert.deepEqual(project.rootWorkRefs, ['work.vexwork.vexarchitecture-alignment.outcome']);
  assert.deepEqual(projectWorkRefs(project, graph), [
    'work.vexwork.vexarchitecture-alignment.end-to-end-foundation-proof',
    'work.vexwork.vexarchitecture-alignment.generated-consequence-reconciliation',
    'work.vexwork.vexarchitecture-alignment.map-current-contracts',
    'work.vexwork.vexarchitecture-alignment.outcome',
    'work.vexwork.vexarchitecture-alignment.project-discoverability-contract',
    'work.vexwork.vexarchitecture-alignment.relationship-attention-healing',
    'work.vexwork.vexarchitecture-alignment.vexboard-projection-alignment',
  ]);
});

test('alignment source points only to known repositories and registered reusable processes', () => {
  assert.equal(assertKnownRepositoryRefs(project.repositoryRefs, repositoryRegistry), true);
  for (const item of graph.items) {
    assert.equal(assertKnownRepositoryRefs(item.repositoryRefs, repositoryRegistry), true);
    if (item.formationProcessRefOrNull) {
      assert.equal(assertKnownProcessRefs([item.formationProcessRefOrNull], processRegistry), true);
    }
    assert.equal(assertKnownProcessRefs(item.nextProcessRefs, processRegistry), true);
  }
});

test('VexWork architecture work remains ahead of VexBoard projection alignment', () => {
  const projected = projectWorkBoard({ project, graph, view, registry: workRegistry });
  const active = projected.lanes.find((lane) => lane.laneRef === 'lane.work.active');
  const planned = projected.lanes.find((lane) => lane.laneRef === 'lane.work.planned');

  assert.deepEqual(active.cards.map((card) => card.workRef), [
    'work.vexwork.vexarchitecture-alignment.map-current-contracts',
    'work.vexwork.vexarchitecture-alignment.outcome',
  ]);

  const plannedRefs = planned.cards.map((card) => card.workRef);
  assert.equal(plannedRefs.includes('work.vexwork.vexarchitecture-alignment.project-discoverability-contract'), true);
  assert.equal(plannedRefs.includes('work.vexwork.vexarchitecture-alignment.vexboard-projection-alignment'), true);

  const vexboard = graph.items.find((item) => item.workRef === 'work.vexwork.vexarchitecture-alignment.vexboard-projection-alignment');
  assert.deepEqual(vexboard.dependencyRefs, ['work.vexwork.vexarchitecture-alignment.end-to-end-foundation-proof']);
});

test('patient-zero closure is a named implementation edge, not a hard-coded Project count', () => {
  const discoverability = graph.items.find((item) => item.workRef === 'work.vexwork.vexarchitecture-alignment.project-discoverability-contract');
  assert.match(discoverability.purpose, /every eligible source-managed Project resolves exactly once/i);
  assert.equal(discoverability.sourceRefs.includes('projects/vexlife-new-beginnings/project.json'), true);
  assert.equal(discoverability.sourceRefs.includes('test/project-registry.test.mjs'), true);
});


const architectureContract = read('projects/vexwork-vexarchitecture-alignment/architecture.contract.json');

test('alignment contract preserves the whole VexArchitecture intention instead of one patient-zero pattern', () => {
  assert.equal(architectureContract.schemaVersion, 'vexwork.vexarchitecture-alignment-contract/v1');
  assert.equal(architectureContract.contractRef, 'contract.vexwork.vexarchitecture-alignment.001');

  const lawRefs = architectureContract.laws.map((law) => law.lawRef);
  assert.equal(new Set(lawRefs).size, lawRefs.length);
  for (const required of [
    'law.vexwork.rightful-semantic-owner',
    'law.vexwork.relationship-authored-once',
    'law.vexwork.identity-from-existing-structure',
    'law.vexwork.explicit-construction',
    'law.vexwork.connective-mechanics-not-meaning',
    'law.vexwork.current-history-projection-separation',
    'law.vexwork.generated-consequence',
    'law.vexwork.fail-at-rightful-boundary',
    'law.vexwork.visible-held-closure',
    'law.vexwork.proof-follows-claim',
  ]) {
    assert.equal(lawRefs.includes(required), true, required);
  }

  assert.equal(
    architectureContract.architectureSources.some((source) =>
      source.repositoryRef === 'repo.vexlife-android'
      && source.acceptedCommit === '66c866dea6a8dd78e2946da88715c4deb78c1847'
    ),
    true,
  );
  assert.equal(
    architectureContract.architectureSources.some((source) =>
      source.repositoryRef === 'repo.vexlife-prod'
      && source.acceptedCommit === '20919f21578eeff9d2e1d513a00e0cd66ecd72ea'
    ),
    true,
  );
});

test('every alignment relationship has one current owner surface and one Work migration owner', () => {
  const surfaceRefs = new Set(architectureContract.surfaces.map((surface) => surface.surfaceRef));
  const workRefs = new Set(graph.items.map((item) => item.workRef));
  const relationshipRefs = architectureContract.relationships.map((relationship) => relationship.relationshipRef);

  assert.equal(new Set(relationshipRefs).size, relationshipRefs.length);
  for (const relationship of architectureContract.relationships) {
    assert.equal(surfaceRefs.has(relationship.ownerSurfaceRef), true, relationship.relationshipRef);
    assert.equal(workRefs.has(relationship.workRef), true, relationship.relationshipRef);
    assert.equal(relationship.sourceRefs.length > 0, true, relationship.relationshipRef);
    assert.equal(relationship.consequenceRefs.length > 0, true, relationship.relationshipRef);
    assert.equal(relationship.constraint.trim().length > 0, true, relationship.relationshipRef);
    assert.equal(
      ['ACCEPTED_EXISTING', 'OBSERVED_GAP', 'TARGET_REFINEMENT'].includes(relationship.alignmentState),
      true,
      relationship.relationshipRef,
    );
  }
});

test('patient-zero discoverability gap cannot be narrowed away from the larger architecture contract', () => {
  const discoverability = architectureContract.relationships.find((relationship) =>
    relationship.relationshipRef === 'relationship.vexwork.project-source-to-discoverability'
  );
  assert.equal(discoverability.alignmentState, 'OBSERVED_GAP');
  assert.equal(discoverability.workRef, 'work.vexwork.vexarchitecture-alignment.project-discoverability-contract');
  assert.equal(discoverability.patientZeroRefs.includes('project.vexlife.new-beginnings'), true);
  assert.equal(discoverability.patientZeroRefs.includes('project.vexwork.vexarchitecture-alignment'), true);

  const generated = architectureContract.relationships.find((relationship) =>
    relationship.relationshipRef === 'relationship.vexwork.accepted-source-to-generated-consequences'
  );
  assert.equal(generated.workRef, 'work.vexwork.vexarchitecture-alignment.generated-consequence-reconciliation');

  const held = architectureContract.relationships.find((relationship) =>
    relationship.relationshipRef === 'relationship.vexwork.held-closure-to-visible-attention'
  );
  assert.equal(held.workRef, 'work.vexwork.vexarchitecture-alignment.relationship-attention-healing');

  const vexboard = architectureContract.relationships.find((relationship) =>
    relationship.relationshipRef === 'relationship.vexwork.truth-to-vexboard-projection'
  );
  assert.equal(vexboard.workRef, 'work.vexwork.vexarchitecture-alignment.vexboard-projection-alignment');
});


test('static source classification distinguishes authored meaning from derivable consequences', () => {
  const byRef = new Map(
    architectureContract.sourceClassifications.map((entry) => [entry.sourceRef, entry]),
  );

  assert.equal(byRef.get('blueprint/work-registry.json').classification, 'RIGHTFUL_SEMANTIC_SOURCE');
  assert.equal(byRef.get('blueprint/repository-registry.json').classification, 'RIGHTFUL_RELATION_SOURCE');
  assert.equal(byRef.get('blueprint/process-registry.json').classification, 'RIGHTFUL_RELATION_SOURCE');
  assert.equal(byRef.get('blueprint/project-planning-registry.json').classification, 'RIGHTFUL_SEMANTIC_SOURCE');
  assert.equal(byRef.get('blueprint/project-reconciliation-registry.json').classification, 'RIGHTFUL_SEMANTIC_SOURCE');
  assert.equal(byRef.get('workgraphs/composition.json').classification, 'RIGHTFUL_COMPOSITION_POLICY_SOURCE');

  assert.equal(byRef.get('blueprint/project-registry.json').classification, 'DERIVATION_CANDIDATE');
  assert.equal(byRef.get('workgraphs/public.json').classification, 'GENERATED_CONSEQUENCE');
  assert.equal(byRef.get('public/workspace.json').classification, 'GENERATED_CONSEQUENCE');
  assert.equal(byRef.get('public/work-dashboard.json').classification, 'GENERATED_CONSEQUENCE');

  for (const entry of architectureContract.sourceClassifications) {
    assert.equal(entry.reason.trim().length > 0, true, entry.sourceRef);
  }
});


test('A1 source census may enumerate files but cannot infer Project identity from path convention', () => {
  const discoverability = architectureContract.relationships.find((relationship) =>
    relationship.relationshipRef === 'relationship.vexwork.project-source-to-discoverability'
  );
  assert.match(discoverability.constraint, /path\/slug is not Project identity/i);
  assert.match(discoverability.constraint, /validated projectRef/i);
  assert.match(discoverability.constraint, /Board must bind that same projectRef/i);
  assert.match(discoverability.constraint, /exactly one admitted canonical Workgraph relationship/i);
});
