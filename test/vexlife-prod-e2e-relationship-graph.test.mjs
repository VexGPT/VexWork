import fs from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  EXPERIENCE_RELATIONSHIP_EDGE_KINDS,
  deriveEdgeRouteManifest,
  deriveFamilyControlRouteManifest,
  deriveJourneyRouteManifest,
  formExperienceRelationshipGraph,
  projectExperienceRelationshipGraphToBoardGraph,
  validateRelationshipLatticeSeed,
} from '../projects/vexlife-prod-end-to-end-tests/relationship-graph.mjs';

const seedPath = new URL(
  '../projects/vexlife-prod-end-to-end-tests/relationship-lattice.seed.json',
  import.meta.url,
);

function readSeed() {
  return JSON.parse(fs.readFileSync(seedPath, 'utf8'));
}

test('relationship lattice seed currentness is internally consistent', () => {
  const seed = readSeed();
  const result = validateRelationshipLatticeSeed(seed);
  assert.deepEqual(result, { ok: true, errors: [] });

  assert.equal(
    seed.sourceBindings.vexlifeProdMain,
    '152c323ee6c3d4a43243d0a9c9b6de2ce11f605b',
  );
  assert.equal(
    Object.prototype.hasOwnProperty.call(seed.sourceBindings, 'vexLifeProdMain'),
    false,
    'a differently-cased second Product-main field must not exist',
  );
  assert.ok(
    seed.sourceBindings.activeCandidates.some(
      (candidate) => candidate.ref === 'github.pull.vexlife-prod.343',
    ),
  );
  assert.ok(
    !seed.sourceBindings.activeCandidates.some(
      (candidate) => candidate.ref === 'github.pull.vexlife-prod.251',
    ),
    'merged #251 must no longer remain active',
  );
  assert.equal(seed.currentness.mergedPressure['251']?.state, 'MERGED');
  assert.ok(
    !seed.sourceBindings.activeCandidates.some(
      (candidate) => ['github.pull.vexlife-prod.310', 'github.pull.vexlife-prod.331'].includes(candidate.ref),
    ),
  );

  const voice = seed.postMapPerturbationPolicy.sourceExamples.find(
    (example) => example.source === 'VexLifeVoiceInputFamily',
  );
  assert.equal(voice?.disposition, 'CURRENT_MAIN');
});

test('validator rejects stale, duplicate or contradictory currentness', () => {
  const seed = readSeed();
  seed.sourceBindings.vexlifeProdMain = '605c635ae2d034a1c4d605e829faa4813de071c3';
  seed.sourceBindings.vexLifeProdMain = seed.currentness.vexLifeProdMain;
  seed.sourceBindings.activeCandidates.push({
    ref: 'github.pull.vexlife-prod.310',
    meaning: 'stale merged candidate',
  });
  seed.sourceBindings.activeCandidates = seed.sourceBindings.activeCandidates.filter(
    (candidate) => candidate.ref !== 'github.pull.vexlife-prod.343',
  );
  const voice = seed.postMapPerturbationPolicy.sourceExamples.find(
    (example) => example.source === 'VexLifeVoiceInputFamily',
  );
  voice.disposition = 'ACTIVE_CANDIDATE';

  const result = validateRelationshipLatticeSeed(seed);
  assert.equal(result.ok, false);
  const errors = result.errors.join('\n');
  assert.match(errors, /sourceBindings\.vexlifeProdMain/);
  assert.match(errors, /differently-cased vexLifeProdMain alias/);
  assert.match(errors, /github\.pull\.vexlife-prod\.310/);
  assert.match(errors, /github\.pull\.vexlife-prod\.343/);
  assert.match(errors, /VexLifeVoiceInputFamily/);
});

test('ordinary graph uses the handoff edge vocabulary and projects into existing VexBoard graph machinery', () => {
  const seed = readSeed();
  const graph = formExperienceRelationshipGraph(seed);
  const projection = projectExperienceRelationshipGraphToBoardGraph(graph);

  assert.ok(graph.nodes.length > 0);
  assert.ok(graph.relationships.length > 0);
  assert.ok(
    graph.relationships.every((relationship) =>
      EXPERIENCE_RELATIONSHIP_EDGE_KINDS.includes(relationship.kind)),
  );
  assert.equal(projection.boardGraph.schemaVersion, 'vexboard.board-graph/v1');

  const visionKinds = new Set(
    graph.relationships
      .filter((relationship) =>
        relationship.context?.family === 'VexLifeVisionFamily'
        || relationship.fromRef === 'element.vexlife-workspace.companion.vision')
      .map((relationship) => relationship.kind),
  );
  for (const kind of [
    'MANIFESTS',
    'OFFERS',
    'REQUESTS_EFFECT',
    'REALIZED_BY',
    'RETURNS_TO',
    'OBSERVES_AS',
    'PROJECTS_TO',
  ]) {
    assert.ok(visionKinds.has(kind), `Vision graph should carry ${kind}`);
  }
});

test('Memory Review keeps cross-owner realization explicit instead of forming one mega-Memory owner', () => {
  const seed = readSeed();
  const graph = formExperienceRelationshipGraph(seed);

  assert.ok(
    graph.relationships.some(
      (relationship) =>
        relationship.kind === 'REALIZED_BY'
        && relationship.fromRef === 'VexLifeMemoryReviewFamily.Effect.Accept'
        && relationship.toRef === 'VexLifeMemoryReviewOwner.keep',
    ),
  );
  assert.ok(
    graph.relationships.some(
      (relationship) =>
        relationship.kind === 'RETURNS_TO'
        && relationship.fromRef === 'VexLifeMemoryReviewOwner.keep'
        && relationship.toRef === 'VexLifeMemoryReviewOwner.observe',
    ),
  );
  assert.ok(
    graph.relationships.some(
      (relationship) =>
        relationship.kind === 'OBSERVES_AS'
        && relationship.fromRef === 'VexLifeMemoryReviewOwner.observe'
        && relationship.toRef === 'VexLifeMemoryReviewFamily.State',
    ),
  );
  assert.ok(
    graph.relationships.some(
      (relationship) =>
        relationship.kind === 'CONSUMED_BY'
        && relationship.fromRef === 'VexLifeMemoryReviewOwner.keep'
        && relationship.toRef === 'VexLifeSemanticAcceptanceWriter.keepWithConversationLease',
    ),
  );
  assert.ok(
    graph.relationships.some(
      (relationship) =>
        relationship.kind === 'CONSUMED_BY'
        && relationship.fromRef === 'VexLifeSemanticAcceptanceWriter.keepWithConversationLease'
        && relationship.toRef === 'VexLifeScoreContinuity.appendAcceptedStatement',
    ),
  );
  assert.ok(
    graph.debts.some(
      (debt) =>
        debt.debtClass === 'MISSING_PROJECTION_EDGE'
        && debt.coordinateRefs.includes('VexLifeMemoryReviewFamily'),
    ),
    'the current graph should keep the unresolved human projection explicit',
  );
});

test('Context Profile capture and Vex Context projection are current-main relationships after #251 merge', () => {
  const seed = readSeed();
  const graph = formExperienceRelationshipGraph(seed);

  assert.ok(
    graph.relationships.some(
      (relationship) =>
        relationship.kind === 'CAPTURED_AT_SEND'
        && relationship.fromRef === 'VexLifeContextProfileFamily'
        && relationship.toRef === 'DirectPromptContext',
    ),
  );
  assert.ok(
    graph.relationships.some(
      (relationship) =>
        relationship.kind === 'PROJECTS_TO'
        && relationship.fromRef === 'DirectCompanionTurn'
        && relationship.toRef === 'element.vexlife-workspace.browser.vex-context',
    ),
  );

  const contextProfile = seed.coordinates.find(
    (coordinate) => coordinate.coordinate === 'VexLifeContextProfileFamily',
  );
  const vexContext = seed.coordinates.find(
    (coordinate) => coordinate.coordinate === 'element.vexlife-workspace.browser.vex-context',
  );
  assert.equal(contextProfile?.disposition, 'CURRENT_MAIN');
  assert.equal(vexContext?.disposition, 'CURRENT_MAIN');
});

test('exact edge selection preserves reverse prerequisites and forward consequences', () => {
  const seed = readSeed();
  const vision = deriveEdgeRouteManifest(seed, {
    kind: 'REQUESTS_EFFECT',
    fromRef: 'VexLifeVisionFamily.Control',
    toRef: 'VexLifeVisionFamily.Effect.EngageScope',
    context: {
      family: 'VexLifeVisionFamily',
      currentState: 'VexLifeVisionFamily.Ready (stateRef=READY)',
      control: 'VexLifeVisionFamily.Engage (controlRef=ENGAGE)',
    },
  });

  assert.deepEqual(
    vision.reverseHumanPath.map((relationship) => relationship.kind),
    ['MANIFESTS'],
  );
  assert.deepEqual(
    vision.prerequisiteRelationships.map((relationship) => relationship.predicate),
    [{
      currentState: 'VexLifeVisionFamily.Ready (stateRef=READY)',
      control: 'VexLifeVisionFamily.Engage (controlRef=ENGAGE)',
    }],
    'the selected ENGAGE edge must not inherit the sibling STOP precondition',
  );
  assert.deepEqual(
    vision.forwardConsequencePath.map((relationship) => relationship.kind),
    ['REALIZED_BY', 'RETURNS_TO', 'OBSERVES_AS', 'PROJECTS_TO'],
  );
  assert.deepEqual(
    vision.boardJourney.steps.map((step) => step.semanticRef),
    [
      'element.vexlife-workspace.companion.vision',
      'VexLifeVisionFamily.Control',
      'VexLifeVisionFamily.Effect.EngageScope',
      'VexLifeProdVisionRuntime',
      'VexLifeVisionFamily.observe',
      'VexLifeVisionFamily.State',
      'VexLifeVisionFamily.displayStateFor',
    ],
  );

  const profileCapture = deriveEdgeRouteManifest(seed, {
    kind: 'CAPTURED_AT_SEND',
    fromRef: 'VexLifeContextProfileFamily',
    toRef: 'DirectPromptContext',
  });
  assert.equal(profileCapture.boardJourney, null);
  assert.ok(profileCapture.missingPredicates.includes('MISSING_MANIFESTATION_BINDING'));
  assert.ok(profileCapture.missingPredicates.includes('MISSING_PROJECTION_EDGE'));
  assert.deepEqual(
    profileCapture.reverseHumanPath,
    [],
    'current graph truth must not invent a human path for Context Profile when no manifestation edge is yet projected',
  );
});

test('Vision READY + ENGAGE traverses the ordinary graph through BoardJourney before becoming a test manifest', () => {
  const seed = readSeed();
  const route = deriveFamilyControlRouteManifest(seed, {
    family: 'VexLifeVisionFamily',
    currentStateRef: 'READY',
    controlRef: 'ENGAGE',
    elementRef: 'element.vexlife-workspace.companion.vision',
  });

  assert.equal(route.sourceBinding.vexLifeProdMain, seed.currentness.vexLifeProdMain);
  assert.equal(route.preconditions.currentState, 'VexLifeVisionFamily.Ready (stateRef=READY)');
  assert.equal(route.preconditions.lawfulControlRelationships.length, 1);
  assert.equal(route.preconditions.lawfulControlRelationships[0].kind, 'OFFERS');
  assert.deepEqual(
    route.preconditions.lawfulControlRelationships[0].predicate,
    {
      currentState: 'VexLifeVisionFamily.Ready (stateRef=READY)',
      control: 'VexLifeVisionFamily.Engage (controlRef=ENGAGE)',
    },
  );
  assert.equal(route.actions[0].elementRef, 'element.vexlife-workspace.companion.vision');
  assert.equal(route.target.controlRef, 'ENGAGE');

  assert.deepEqual(
    route.relationshipTraversal.map((relationship) => relationship.kind),
    [
      'MANIFESTS',
      'REQUESTS_EFFECT',
      'REALIZED_BY',
      'RETURNS_TO',
      'OBSERVES_AS',
      'PROJECTS_TO',
    ],
  );
  assert.deepEqual(
    route.boardJourney.steps.map((step) => step.semanticRef),
    [
      'element.vexlife-workspace.companion.vision',
      'VexLifeVisionFamily.Control',
      'VexLifeVisionFamily.Effect.EngageScope',
      'VexLifeProdVisionRuntime',
      'VexLifeVisionFamily.observe',
      'VexLifeVisionFamily.State',
      'VexLifeVisionFamily.displayStateFor',
    ],
  );
  assert.equal(route.expected.admittedState, null);
  assert.equal(route.expected.effect, 'VexLifeVisionFamily.Effect.EngageScope');
  assert.deepEqual(route.expected.possibleObservedSuccessors, ['SELECTING', 'ENGAGED', 'HELD']);
  assert.equal(route.routeStatus, 'FRONTIER_DEBT');
  assert.deepEqual(route.missingPredicates, ['MISSING_DETERMINISTIC_TEST_ACTION']);
});

test('ContextShare stays at the exact source/projectability frontier instead of inventing a semantic route', () => {
  const seed = readSeed();
  const direct = deriveJourneyRouteManifest(
    seed,
    'journey.browser.context-share-direct-navigation',
  );
  const unlocated = deriveJourneyRouteManifest(
    seed,
    'journey.browser.context-share-internal-navigation-unlocated',
  );

  for (const route of [direct, unlocated]) {
    assert.equal(route.sourceBinding.vexLifeProdMain, seed.currentness.vexLifeProdMain);
    assert.equal(route.routeStatus, 'FRONTIER_DEBT');
    for (const debt of [
      'MISSING_DETERMINISTIC_TEST_ACTION',
      'MISSING_RELATIONSHIP_EDGE',
      'MISSING_MANIFESTATION_BINDING',
      'SCREEN_LENS_DEPTH_GAP',
      'MISSING_SEMANTIC_EDGE',
    ]) {
      assert.ok(route.missingPredicates.includes(debt), `${route.journeyRef} should expose ${debt}`);
    }
    assert.deepEqual(
      route.actions.map((action) => action.elementRef),
      [
        'element.vexlife-workspace.companion.conversation.context-share',
        'element.vexlife-workspace.companion.conversation.send',
      ],
    );
    assert.ok(
      route.actions.every((action) => action.executionBindingRefOrNull === null),
      'stable element identity is not itself a deterministic execution binding',
    );
    assert.deepEqual(
      route.relationships,
      [],
      'the current seed must not pretend OPTIONAL_CURRENT_PAGE_CONTEXT is already a normalized semantic graph edge',
    );
    assert.ok(
      route.expectedEvidenceRefs.includes('DirectPromptContext.Receipt.browserContextIncluded'),
    );
  }

  assert.ok(
    unlocated.coordinateRefs.includes('pathway.vexlife-prod.conversation.send'),
    'the no-stale-context outcome must retain the Send pathway it makes a claim about',
  );

  assert.deepEqual(
    direct,
    deriveJourneyRouteManifest(seed, 'journey.browser.context-share-direct-navigation'),
    'one pinned seed and one journey selection must produce one deterministic route manifest',
  );
});

// [VXG RealForever][VEXWORK][VEXLIFE-PROD][E2E][RELATIONSHIP-GRAPH]
