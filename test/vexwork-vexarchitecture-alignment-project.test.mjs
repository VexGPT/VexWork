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
    'work.vexwork.vexarchitecture-alignment.outcome',
    'work.vexwork.vexarchitecture-alignment.project-discoverability-contract',
  ]);

  const done = projected.lanes.find((lane) => lane.laneRef === 'lane.work.done');
  assert.equal(done.cards.some((card) =>
    card.workRef === 'work.vexwork.vexarchitecture-alignment.map-current-contracts'
  ), true);

  const plannedRefs = planned.cards.map((card) => card.workRef);
  assert.equal(projected.lanes.find((lane) => lane.laneRef === 'lane.work.done').cards.some((card) => card.workRef === 'work.vexwork.vexarchitecture-alignment.generated-consequence-reconciliation'), true);
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
const newBeginningsProject = read('projects/vexlife-new-beginnings/project.json');
const newBeginningsSegment = read('workgraphs/segments/vexlife-new-beginnings.json');

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
  assert.match(discoverability.constraint, /explicit Board source must bind that same projectRef/i);
  assert.match(discoverability.constraint, /exactly one admitted canonical Workgraph relationship/i);
});


test('A0 alignment matrix covers every current VexWork foundation and isolates observed pressures', () => {
  const names = architectureContract.foundationAlignments.map((entry) => entry.foundation);
  assert.equal(new Set(names).size, names.length);
  for (const required of [
    'Workgraph',
    'Stability / regression floor',
    'Workgraph Composition',
    'Projects / Project Registry',
    'Delegated agency / Human Transition Handshake',
    'Work Board',
    'Derived Attention',
    'Derived Work Promotion',
    'Operating Domain',
    'Attention Queue',
    'Parking Lot',
    'Process Map',
    'Repository Graph',
    'Provider Relations',
    'Runtime persistence',
    'Work Participation',
    'Operating Profiles',
    'Orientation / fresh-worker judgment',
    'Planning',
    'Reconciliation',
    'Repository Integration / Merge Stewardship',
    'Human UI',
  ]) {
    assert.equal(names.includes(required), true, required);
  }

  assert.equal(
    architectureContract.foundationAlignments.find((entry) =>
      entry.foundation === 'Projects / Project Registry'
    ).alignmentState,
    'OBSERVED_GAP',
  );
  assert.equal(
    architectureContract.foundationAlignments.find((entry) =>
      entry.foundation === 'Repository Integration / Merge Stewardship'
    ).alignmentState,
    'OBSERVED_GAP',
  );
});

test('default Board projection is treated as derivable unless Project-specific view meaning is earned', () => {
  const classification = architectureContract.sourceClassifications.find((entry) =>
    entry.sourceRef === 'projects/*/board.view.json'
  );
  assert.equal(classification.classification, 'DERIVATION_CANDIDATE_WHEN_DEFAULT_ONLY');

  const relationship = architectureContract.relationships.find((entry) =>
    entry.relationshipRef === 'relationship.vexwork.project-to-default-board-view'
  );
  assert.equal(relationship.alignmentState, 'OBSERVED_GAP');
  assert.equal(relationship.workRef, 'work.vexwork.vexarchitecture-alignment.project-discoverability-contract');
  assert.match(relationship.constraint, /default Board view/i);
  assert.match(relationship.constraint, /explicit Board-view source/i);
});


test('A0 completes its map claim and releases A1 without claiming PR-wide merge readiness', () => {
  const a0 = graph.items.find((item) =>
    item.workRef === 'work.vexwork.vexarchitecture-alignment.map-current-contracts'
  );
  const a1 = graph.items.find((item) =>
    item.workRef === 'work.vexwork.vexarchitecture-alignment.project-discoverability-contract'
  );

  assert.equal(a0.state, 'COMPLETED');
  assert.equal(a1.state, 'RUNNING');
  assert.deepEqual(a1.dependencyRefs, [a0.workRef]);

  const a0Completion = graph.transitions.find((entry) =>
    entry.transitionRef === 'transition.vexwork.vexarchitecture-alignment.map-current-contracts.verifying-completed.a0-map-accepted'
  );
  assert.ok(a0Completion);
  assert.equal(a0Completion.priorState, 'VERIFYING');
  assert.equal(a0Completion.nextState, 'COMPLETED');
  assert.match(a0Completion.reason, /repository-wide green gate remains a later trajectory\/integration predicate/i);

  const a1Start = graph.transitions.find((entry) =>
    entry.transitionRef === 'transition.vexwork.vexarchitecture-alignment.project-discoverability.ready-running.a1-source-owner'
  );
  assert.ok(a1Start);
  assert.equal(a1Start.priorState, 'READY');
  assert.equal(a1Start.nextState, 'RUNNING');
  assert.match(a1Start.reason, /existing Work Board and Project Registry owners/i);
});


test('every VexArchitecture law is visible through at least one concrete demonstration', () => {
  const demonstrated = new Set(
    architectureContract.demonstrations.flatMap((entry) => entry.lawRefs),
  );
  for (const law of architectureContract.laws) {
    assert.equal(demonstrated.has(law.lawRef), true, law.lawRef);
  }

  for (const demonstration of architectureContract.demonstrations) {
    assert.equal(demonstration.sourceRefs.length > 0, true, demonstration.demonstrationRef);
    assert.equal(demonstration.relationship.trim().length > 0, true, demonstration.demonstrationRef);
    assert.equal(demonstration.visibleConsequence.trim().length > 0, true, demonstration.demonstrationRef);
    assert.equal(demonstration.notThis.trim().length > 0, true, demonstration.demonstrationRef);
  }
});

test('alignment Project dogfoods visible held closure instead of prose-only future work', () => {
  const demo = architectureContract.demonstrations.find((entry) =>
    entry.demonstrationRef === 'demo.vexwork.alignment-project-dogfoods-held-proof'
  );
  assert.equal(demo.kind, 'ALIGNMENT_DOGFOOD');
  assert.equal(demo.sourceRefs.includes('workgraphs/segments/vexwork-vexarchitecture-alignment.json'), true);
  assert.equal(demo.sourceRefs.includes('github.pull.vexwork.210.comment.6576031173'), true);
  assert.match(demo.relationship, /WAITING_TOOL/);
  assert.match(demo.visibleConsequence, /A1 remains dependency-held/);
});

test('counterexamples stay distinct from accepted architecture demonstrations', () => {
  const newBeginnings = architectureContract.demonstrations.find((entry) =>
    entry.demonstrationRef === 'demo.vexwork.new-beginnings-counterexample'
  );
  const boardRestatement = architectureContract.demonstrations.find((entry) =>
    entry.demonstrationRef === 'demo.vexwork.default-board-restatement-counterexample'
  );

  assert.equal(newBeginnings.kind, 'COUNTEREXAMPLE_PRESSURE');
  assert.equal(boardRestatement.kind, 'COUNTEREXAMPLE_PRESSURE');
  assert.match(newBeginnings.notThis, /New Beginnings Work items.*invalid/i);
  assert.match(boardRestatement.notThis, /custom Project views.*unnecessary/i);
});


const foundationIndexText = fs.readFileSync(new URL('../docs/foundation/INDEX.md', import.meta.url), 'utf8');
const orientationText = fs.readFileSync(new URL('../docs/foundation/VEXWORK-ORIENTATION.md', import.meta.url), 'utf8');
const orientationHtml = fs.readFileSync(new URL('../orientation.html', import.meta.url), 'utf8');

test('ordinary VexWork orientation exposes the active alignment Project without promoting it to Foundation authority', () => {
  for (const text of [foundationIndexText, orientationText, orientationHtml]) {
    assert.match(text, /vexwork-vexarchitecture-alignment/i);
  }

  assert.match(foundationIndexText, /Current architecture evolution/i);
  assert.match(foundationIndexText, /not a replacement Foundation owner/i);
  assert.match(orientationText, /active evolution source, not accepted Foundation authority/i);
  assert.match(orientationHtml, /does not override accepted Foundation truth/i);
});

test('alignment contract dogfoods orientation-to-evolution discoverability', () => {
  const demo = architectureContract.demonstrations.find((entry) =>
    entry.demonstrationRef === 'demo.vexwork.orientation-discovers-active-architecture-evolution'
  );

  assert.equal(demo.kind, 'ALIGNMENT_DOGFOOD');
  assert.equal(demo.sourceRefs.includes('docs/foundation/INDEX.md'), true);
  assert.equal(demo.sourceRefs.includes('docs/foundation/VEXWORK-ORIENTATION.md'), true);
  assert.equal(demo.sourceRefs.includes('orientation.html'), true);
  assert.match(demo.visibleConsequence, /without knowing PR #210/i);
  assert.match(demo.notThis, /Foundation acceptance/i);
});


test('New Beginnings patient zero satisfies the Workgraph Segment provenance contract', () => {
  assert.deepEqual(newBeginningsSegment.sourceRefs, [
    'project.vexlife.new-beginnings',
    'projects/vexlife-new-beginnings/README.md',
  ]);
  assert.equal(newBeginningsSegment.formedAt, newBeginningsProject.formedAt);
});


test('A1 binds the source-owner implementation to existing Work Board and Project Registry owners', () => {
  const a1 = graph.items.find((item) =>
    item.workRef === 'work.vexwork.vexarchitecture-alignment.project-discoverability-contract'
  );
  assert.equal(a1.state, 'RUNNING');
  for (const ref of [
    'src/core/work-board.mjs',
    'src/core/project-registry.mjs',
    'scripts/build-public-workspace.mjs',
    'test/project-discoverability.test.mjs',
  ]) {
    assert.equal(a1.sourceRefs.includes(ref), true, ref);
  }

  const discoverability = architectureContract.relationships.find((relationship) =>
    relationship.relationshipRef === 'relationship.vexwork.project-source-to-discoverability'
  );
  assert.match(discoverability.constraint, /compatibility ordering may be partial/i);
  assert.match(discoverability.constraint, /path\/slug is not Project identity/i);

  const defaultBoard = architectureContract.relationships.find((relationship) =>
    relationship.relationshipRef === 'relationship.vexwork.project-to-default-board-view'
  );
  assert.match(defaultBoard.constraint, /derive the default Board viewRef, label and laneRefOrder/i);
  assert.match(defaultBoard.constraint, /explicit Board-view source/i);
});


test('A1 source census is an adapter over validated source rather than a new membership owner', () => {
  const a1 = graph.items.find((item) =>
    item.workRef === 'work.vexwork.vexarchitecture-alignment.project-discoverability-contract'
  );
  assert.equal(a1.sourceRefs.includes('scripts/build-project-registry.mjs'), true);
  assert.equal(a1.sourceRefs.includes('test/project-registry-source.test.mjs'), true);

  const classification = architectureContract.sourceClassifications.find((entry) =>
    entry.sourceRef === 'blueprint/project-registry.json'
  );
  assert.match(classification.reason, /v1 registryVersion historically mirrors Project count/i);
  assert.match(classification.reason, /not membership\/currentness authority/i);
});


test('A1 makes stale Project discoverability a deterministic review failure before aggregate repair', () => {
  const packageJson = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  assert.match(packageJson.scripts['review:deterministic'], /project-registry:check/);
  assert.equal(
    packageJson.scripts['review:deterministic'].indexOf('project-registry:check')
      < packageJson.scripts['review:deterministic'].indexOf('workgraph:check'),
    true,
  );
});


test('A1 completes its source contract and releases A2 after the consumed RETURN review', () => {
  const a1 = graph.items.find((item) =>
    item.workRef === 'work.vexwork.vexarchitecture-alignment.project-discoverability-contract'
  );
  const a2 = graph.items.find((item) =>
    item.workRef === 'work.vexwork.vexarchitecture-alignment.generated-consequence-reconciliation'
  );

  assert.equal(a1.state, 'COMPLETED');
  assert.equal(a2.state, 'COMPLETED');
  assert.deepEqual(a2.dependencyRefs, [a1.workRef]);

  const reopen = graph.transitions.find((entry) =>
    entry.transitionRef === 'transition.vexwork.vexarchitecture-alignment.project-discoverability.waiting-tool-running.a1-return-corrections'
  );
  assert.ok(reopen);
  assert.equal(reopen.priorState, 'WAITING_TOOL');
  assert.equal(reopen.nextState, 'RUNNING');
  assert.equal(reopen.sourceRefs.includes(
    'artifact.vexwork.vexarchitecture-alignment.a1.source-owner.outer-return.sha256.2c9c010347d8871c950e5a5c82c74e763bc46dadad8f68fce9ec2ba43a5f86d5'
  ), true);
});


test('New Beginnings outcome history uses only lawful Work transitions', () => {
  const outcomeTransitions = newBeginningsSegment.transitions.filter((entry) =>
    entry.workRef === 'work.vexlife.new-beginnings.outcome'
  );
  assert.deepEqual(
    outcomeTransitions.map((entry) => [entry.priorState, entry.nextState]),
    [
      ['PLAN_VALIDATED', 'READY'],
      ['READY', 'RUNNING'],
    ],
  );
  assert.equal(outcomeTransitions[0].createdAt, outcomeTransitions[1].createdAt);
});


test('A2 starts only after A1 source-contract review clearance', () => {
  const a1 = graph.items.find((item) =>
    item.workRef === 'work.vexwork.vexarchitecture-alignment.project-discoverability-contract'
  );
  const a2 = graph.items.find((item) =>
    item.workRef === 'work.vexwork.vexarchitecture-alignment.generated-consequence-reconciliation'
  );

  assert.equal(a1.state, 'COMPLETED');
  assert.equal(a2.state, 'COMPLETED');
  assert.deepEqual(a2.dependencyRefs, [a1.workRef]);

  const release = graph.transitions.find((entry) =>
    entry.transitionRef === 'transition.vexwork.vexarchitecture-alignment.generated-consequence.waiting-ready.a1-complete'
  );
  assert.ok(release);
  assert.equal(release.sourceRefs.includes('github.pull.vexwork.182.comment.6577339504'), true);
  assert.equal(release.sourceRefs.includes('github.pull.vexwork.193.comment.6577340172'), true);
});


const generatedProjectRegistry = read('blueprint/project-registry.json');
const generatedPublicWorkgraph = read('workgraphs/public.json');
const generatedPublicWorkspace = read('public/workspace.json');

test('A2 generated consequences make both patient-zero Projects navigable', () => {
  for (const projectRef of [
    'project.vexlife.new-beginnings',
    'project.vexwork.vexarchitecture-alignment',
  ]) {
    assert.equal(
      generatedProjectRegistry.projects.some((entry) => entry.projectRef === projectRef),
      true,
      projectRef,
    );
    assert.equal(
      generatedPublicWorkspace.projects.some((entry) => entry.project.projectRef === projectRef),
      true,
      projectRef,
    );
  }

  assert.equal(
    generatedPublicWorkgraph.items.some((item) =>
      item.workRef === 'work.vexlife.new-beginnings.outcome'
    ),
    true,
  );
  assert.equal(
    generatedPublicWorkgraph.items.some((item) =>
      item.workRef === 'work.vexwork.vexarchitecture-alignment.outcome'
    ),
    true,
  );
  assert.equal(
    generatedPublicWorkspace.parkingLot.items.some((item) =>
      item.workRef === 'work.vexlife.new-beginnings.later.settings-capability-mapping'
    ),
    true,
  );
});

test('A2 preserves generated consequence ownership instead of lane-owned aggregate authority', () => {
  const demo = architectureContract.demonstrations.find((entry) =>
    entry.demonstrationRef === 'demo.vexwork.a2-generated-consequence-convergence'
  );
  assert.equal(demo.kind, 'ALIGNMENT_DOGFOOD');
  assert.match(demo.relationship, /disposable integration snapshots/i);
  assert.match(demo.notThis, /discard another PR's Project-local semantic source/i);

  const packageJson = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  assert.equal(
    packageJson.scripts['workspace:build'],
    'npm run project-registry:build && npm run workgraph:build && node scripts/build-public-workspace.mjs',
  );
});


test('A2 completion regenerates its own lifecycle consequence before A3 starts', () => {
  const a2 = graph.items.find((item) =>
    item.workRef === 'work.vexwork.vexarchitecture-alignment.generated-consequence-reconciliation'
  );
  const a3 = graph.items.find((item) =>
    item.workRef === 'work.vexwork.vexarchitecture-alignment.relationship-attention-healing'
  );
  assert.equal(a2.state, 'COMPLETED');
  assert.equal(a3.state, 'COMPLETED');

  const generatedA2 = generatedPublicWorkgraph.items.find((item) => item.workRef === a2.workRef);
  const generatedA3 = generatedPublicWorkgraph.items.find((item) => item.workRef === a3.workRef);
  assert.equal(generatedA2.state, 'COMPLETED');
  assert.equal(generatedA3.state, 'RUNNING');

  const workspaceProject = generatedPublicWorkspace.projects.find((entry) =>
    entry.project.projectRef === 'project.vexwork.vexarchitecture-alignment'
  );
  assert.equal(
    workspaceProject.lanes.find((lane) => lane.laneRef === 'lane.work.done').workRefs.includes(a2.workRef),
    true,
  );
  assert.equal(
    workspaceProject.lanes.find((lane) => lane.laneRef === 'lane.work.active').workRefs.includes(a3.workRef),
    true,
  );
});


test('A3 reuses relationship identity inside the existing read-only Attention Queue', () => {
  const a3 = graph.items.find((item) =>
    item.workRef === 'work.vexwork.vexarchitecture-alignment.relationship-attention-healing'
  );
  assert.equal(a3.state, 'COMPLETED');
  for (const ref of [
    'src/core/attention-queue.mjs',
    'test/attention-queue.test.mjs',
    'docs/foundation/ATTENTION-QUEUE.md',
  ]) {
    assert.equal(a3.sourceRefs.includes(ref), true, ref);
  }

  const relationship = architectureContract.relationships.find((entry) =>
    entry.relationshipRef === 'relationship.vexwork.held-closure-to-visible-attention'
  );
  assert.match(relationship.constraint, /reuses relationshipRef as the stable attention identity/i);

  const demo = architectureContract.demonstrations.find((entry) =>
    entry.demonstrationRef === 'demo.vexwork.a3-relationship-attention-clears'
  );
  assert.equal(demo.kind, 'ALIGNMENT_DOGFOOD');
  assert.match(demo.visibleConsequence, /explicit current evidence produces CLEAR/i);
  assert.match(demo.notThis, /automatic source repair/i);
});


test('A3 real dogfood relationship is CLEAR after phase-boundary regeneration', () => {
  const sourceA3 = graph.items.find((item) =>
    item.workRef === 'work.vexwork.vexarchitecture-alignment.relationship-attention-healing'
  );
  const generatedA3 = generatedPublicWorkgraph.items.find((item) => item.workRef === sourceA3.workRef);
  assert.equal(sourceA3.state, 'COMPLETED');
  assert.equal(generatedA3.state, 'COMPLETED');
  assert.deepEqual(generatedA3.sourceRefs, sourceA3.sourceRefs);

  const demo = architectureContract.demonstrations.find((entry) =>
    entry.demonstrationRef === 'demo.vexwork.a3-relationship-attention-clears'
  );
  assert.match(demo.relationship, /UNSATISFIED\/ATTENTION/);
  assert.match(demo.relationship, /SATISFIED\/CLEAR/);
});

test('A4 starts only after A3 visible-held-closure proof completes', () => {
  const a3 = graph.items.find((item) =>
    item.workRef === 'work.vexwork.vexarchitecture-alignment.relationship-attention-healing'
  );
  const a4 = graph.items.find((item) =>
    item.workRef === 'work.vexwork.vexarchitecture-alignment.end-to-end-foundation-proof'
  );
  assert.equal(a3.state, 'COMPLETED');
  assert.equal(a4.state, 'RUNNING');
  assert.deepEqual(a4.dependencyRefs, [a3.workRef]);
});


test('A4 whole-circuit proof is source-placed before final repository review', () => {
  const a4 = graph.items.find((item) =>
    item.workRef === 'work.vexwork.vexarchitecture-alignment.end-to-end-foundation-proof'
  );
  assert.equal(a4.state, 'WAITING_TOOL');
  for (const ref of [
    'test/vexwork-vexarchitecture-e2e.test.mjs',
    'workspace-reader.js',
    'index.html',
  ]) {
    assert.equal(a4.sourceRefs.includes(ref), true, ref);
  }

  const demo = architectureContract.demonstrations.find((entry) =>
    entry.demonstrationRef === 'demo.vexwork.a4-whole-circuit-patient-zero'
  );
  assert.equal(demo.kind, 'ALIGNMENT_DOGFOOD');
  assert.match(demo.visibleConsequence, /cannot silently disappear/i);
  assert.match(demo.notThis, /repository-wide deterministic review/i);
});


test('A4 holds only one stabilized full repository review before A5', () => {
  const a4 = graph.items.find((item) =>
    item.workRef === 'work.vexwork.vexarchitecture-alignment.end-to-end-foundation-proof'
  );
  const a5 = graph.items.find((item) =>
    item.workRef === 'work.vexwork.vexarchitecture-alignment.vexboard-projection-alignment'
  );
  assert.equal(a4.state, 'WAITING_TOOL');
  assert.equal(a5.state, 'WAITING_DEPENDENCIES');
  assert.deepEqual(a5.dependencyRefs, [a4.workRef]);

  const hold = graph.transitions.find((entry) =>
    entry.transitionRef === 'transition.vexwork.vexarchitecture-alignment.end-to-end.running-waiting-tool.a4-stable-full-review'
  );
  assert.ok(hold);
  assert.match(hold.reason, /one stabilized full-repository .*npm run review/i);
});
