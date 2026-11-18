import assert from 'node:assert/strict';
import test from 'node:test';

import {
  EDGE_KINDS,
  canonicalJson,
  compileExperienceGraph,
  experienceBoardGraph,
  forwardNeighborhood,
  graphFingerprint,
  normalizeExperienceGraph,
  reverseNeighborhood,
  sourceRef,
} from '../src/core/experience-graph.mjs';
import { advanceBoardJourney, createBoardJourney, journeyChoices } from '../src/shared/vexboard-journey.mjs';
import { fixtureGraph } from './fixtures/experience-graph/graph.mjs';

const edge = (graph, ref) => graph.edges.find((row) => row.ref === ref);

test('compiled graph keeps existing coordinates, typed edges and State predicates', () => {
  const graph = fixtureGraph();
  assert.equal(graph.schemaVersion, 'vexwork.experience-relationship-graph/v1');
  assert.deepEqual(graph.source.files.map((file) => file.path), ['a.kt', 'src/commonMain/kotlin/vexlife/web/VexLifeWebRuntimeArtifacts.kt']);
  const roles = Object.fromEntries(graph.nodes.map((node) => [node.ref, node.role]));
  assert.equal(roles.VexLifeSightFamily, 'FAMILY');
  assert.equal(roles['VexLifeSightFamily.Ready'], 'STATE');
  assert.equal(roles['VexLifeSightFamily.Engage'], 'CONTROL');
  assert.equal(roles['VexLifeSightFamily.Effect.EngageScope'], 'EFFECT');
  assert.equal(roles['element.workspace.sight'], 'ELEMENT');
  assert.equal(roles['DirectCompanionTurn.Intent.contextProfile'], 'CAPTURE');
  assert.equal(roles['DirectPromptContext.Receipt.contextProfileRef'], 'RECEIPT');
  assert.equal(roles['element.workspace.region'], undefined, 'non-interactive regions are not graph elements');
  for (const row of graph.edges) assert.ok(EDGE_KINDS.includes(row.kind));

  assert.ok(edge(graph, 'edge:OFFERS:VexLifeSightFamily.Ready:VexLifeSightFamily.Engage'));
  const requested = edge(graph, 'edge:REQUESTS_EFFECT:VexLifeSightFamily.Engage:VexLifeSightFamily.Effect.EngageScope:when:Ready:0');
  assert.equal(requested.whenState, 'VexLifeSightFamily.Ready');
  const held = edge(graph, 'edge:OFFERS:VexLifeSightFamily.Held:VexLifeSightFamily.Stop');
  assert.deepEqual([held.detail.availability, held.guards], ['GUARDED', ['currentState.reason == HoldReason.ScreenSafetyNotCurrent']]);
  assert.ok(edge(graph, 'edge:ADMITS_STATE:VexLifeDictationFamily.Start:VexLifeDictationFamily.Requesting:when:Ready:0'));
  assert.deepEqual(edge(graph, 'edge:ADMITS_STATE:VexLifeStockFamily.Select:VexLifeStockFamily.State:when:State:0').detail.axisUpdates, { targeted: 'true' });
  assert.ok(edge(graph, 'edge:OFFERS:VexLifeSpeechModelsFamily.State:VexLifeSpeechModelsFamily.ControlUse'));

  assert.ok(edge(graph, 'edge:MANIFESTS:element.workspace.sight:VexLifeSightFamily.Engage'));
  assert.ok(edge(graph, 'edge:PROJECTS_TO:VexLifeSightFamily.DisplayState:element.workspace.sight'));
  assert.ok(edge(graph, 'edge:MANIFESTS:element.workspace.send:DirectCompanionTurn'));
  assert.ok(edge(graph, 'edge:REALIZED_BY:DirectCompanionTurn:DirectPromptContext'));
  assert.ok(edge(graph, 'edge:REALIZED_BY:VexLifeSightFamily.Effect.EngageScope:VexLifeProdLocalService'));
  assert.ok(edge(graph, 'edge:REALIZED_BY:VexLifeProdLocalService:VexLifeSightRuntime:VexLifeSightFamily'));
  assert.ok(edge(graph, 'edge:REALIZED_BY:VexLifeSightRuntime:fixture.sight.picker'), 'Lens partner depth extends the realization chain');
  assert.ok(edge(graph, 'edge:RETURNS_TO:VexLifeProdLocalService:VexLifeSightFamily.observe'));
  assert.ok(edge(graph, 'edge:OBSERVES_AS:VexLifeSightFamily.observe:VexLifeSightFamily.Engaged'));
  assert.equal(edge(graph, 'edge:OBSERVES_AS:VexLifeQuietConversation.state:VexLifeQuietFamily.Quiet').detail.precision, 'TYPE');
  assert.ok(edge(graph, 'edge:OBSERVES_AS:VexLifeStock:VexLifeStockFamily.State'));

  assert.ok(edge(graph, 'edge:CAPTURED_AT_SEND:VexLifeProfileStore:DirectCompanionTurn.Intent.contextProfile'));
  assert.ok(edge(graph, 'edge:CAPTURED_AT_SEND:VexLifeProdServiceContract.SendRequest.browserContext:DirectCompanionTurn.Intent.browserContext'));
  assert.ok(edge(graph, 'edge:PROJECTS_TO:DirectCompanionTurn.Intent.contextProfile:DirectPromptContext.Receipt.contextProfileRef'));
  assert.equal(edge(graph, 'edge:CONSUMED_BY:VexLifeQuietFamily.Quiet:DirectCompanionTurn:QUIET_MODE_ON').detail.refusalCode, 'QUIET_MODE_ON');
  assert.ok(edge(graph, 'edge:CONSUMED_BY:VexLifeStock.switchHeld:DirectCompanionTurn:MODEL_SWITCH_HELD'));
  assert.equal(edge(graph, 'edge:CONSUMED_BY:DirectCompanionTurn.Intent.idempotencyKey:DirectCompanionTurn').detail.role, 'IDEMPOTENCY_IDENTITY');
  assert.equal(graph.nodes.find((node) => node.ref === 'DirectCompanionTurn.Intent.contextProfile').detail.captureLaw.includes('next Send'), true);
  assert.ok(graph.edges.every((row) => row.kind !== 'CONVERGES_IN'), 'no Relay edge without a source-proven Relay owner');

  assert.deepEqual(graph.untypedControlLiterals.map((row) => row.control), ['VexLifeQuietFamily.Clear']);
  assert.deepEqual(graph.extractionDebt.map((row) => row.kind), ['MISSING_ACT_LAW']);
});

test('fingerprint is semantic: node / edge order and extractor identity do not move it', () => {
  const graph = fixtureGraph();
  const reordered = normalizeExperienceGraph({ ...graph, nodes: [...graph.nodes].reverse(), edges: [...graph.edges].reverse(), extractor: { modules: [] } });
  assert.equal(reordered.fingerprint, graph.fingerprint);
  assert.equal(graphFingerprint(reordered), graph.fingerprint);
  assert.equal(canonicalJson({ b: 1, a: [2, { d: 1, c: 0 }] }), '{"a":[2,{"c":0,"d":1}],"b":1}');
  assert.equal(sourceRef('src/a.kt', 4), 'repo.vexlife-prod:src/a.kt:L4');
  assert.equal(sourceRef('src/a.kt'), 'repo.vexlife-prod:src/a.kt');
});

test('normalization refuses edges that break relationship law', () => {
  const graph = fixtureGraph();
  const mutate = (fn) => {
    const copy = structuredClone(graph);
    fn(copy);
    return () => normalizeExperienceGraph(copy);
  };
  assert.throws(mutate((copy) => { copy.schemaVersion = 'x'; }), /schema mismatch/);
  assert.throws(mutate((copy) => { copy.nodes.push(copy.nodes[0]); }), /node refs must be unique/);
  assert.throws(mutate((copy) => { copy.edges.push(copy.edges[0]); }), /edge refs must be unique/);
  assert.throws(mutate((copy) => { copy.nodes[0].ref = 'bad ref'; }), /not a stable coordinate|endpoint missing/);
  assert.throws(mutate((copy) => { copy.nodes[0].role = 'WIDGET'; }), /role WIDGET unsupported/);
  assert.throws(mutate((copy) => { copy.edges[0].kind = 'LINKS'; }), /kind LINKS unsupported/);
  assert.throws(mutate((copy) => { copy.edges[0].to = 'missing'; }), /endpoint missing/);
  const offers = graph.edges.findIndex((row) => row.kind === 'OFFERS');
  assert.throws(mutate((copy) => { copy.edges[offers].from = copy.edges[offers].to; }), /must join State -> Control/);
  const manifests = graph.edges.findIndex((row) => row.kind === 'MANIFESTS');
  assert.throws(mutate((copy) => { copy.edges[manifests].from = 'VexLifeSightFamily.Ready'; }), /must leave an element/);
  const requests = graph.edges.findIndex((row) => row.kind === 'REQUESTS_EFFECT');
  assert.throws(mutate((copy) => { copy.edges[requests].whenState = null; }), /must carry its State predicate/);
  const admits = graph.edges.findIndex((row) => row.kind === 'ADMITS_STATE');
  assert.throws(mutate((copy) => { copy.edges[admits].whenState = null; }), /must carry its State predicate/);
  assert.throws(mutate((copy) => {
    copy.edges.push({ ref: 'edge:CONVERGES_IN:a:b', kind: 'CONVERGES_IN', from: 'VexLifeSightFamily', to: 'VexLifeQuietFamily', family: null, whenState: null, guards: [], sourceRef: null, detail: {} });
  }), /requires a source-proven Relay owner/);
  assert.throws(() => compileExperienceGraph({ source: { commit: 'main' }, families: [] }), /exact commit/);
});

test('traversal stays inside one Family when a shared service realizes several Families', () => {
  const graph = fixtureGraph();
  const reverse = reverseNeighborhood(graph, 'VexLifeQuietConversation', { maxDepth: 4 });
  const refs = reverse.nodes.map((node) => node.ref);
  assert.ok(refs.includes('VexLifeQuietFamily.Begin'));
  assert.ok(refs.includes('element.workspace.quiet'));
  assert.ok(!refs.some((ref) => ref.startsWith('VexLifeSightFamily.')), 'Sight shares VexLifeProdLocalService but not this route');

  const capture = 'edge:CAPTURED_AT_SEND:VexLifeProfileStore:DirectCompanionTurn.Intent.contextProfile';
  const forward = forwardNeighborhood(graph, capture, { maxDepth: 3 }).nodes.map((node) => node.ref);
  assert.ok(forward.includes('DirectPromptContext.Receipt.contextProfileRef'));
  assert.ok(forward.includes('DirectCompanionTurn'));
  const fromEngage = forwardNeighborhood(graph, 'VexLifeSightFamily.Engage', { maxDepth: 6 }).nodes.map((node) => node.ref);
  assert.ok(fromEngage.includes('fixture.sight.picker'));
  assert.ok(fromEngage.includes('VexLifeSightFamily.Engaged'));
  assert.ok(!fromEngage.includes('VexLifeQuietConversation'));
  assert.throws(() => reverseNeighborhood(graph, 'nowhere'), /unknown graph coordinate/);
  assert.throws(() => forwardNeighborhood(graph, 'nowhere'), /unknown graph coordinate/);
  assert.equal(reverseNeighborhood(graph, 'edge:OFFERS:VexLifeSightFamily.Ready:VexLifeSightFamily.Engage').target, 'edge:OFFERS:VexLifeSightFamily.Ready:VexLifeSightFamily.Engage');
});

test('VexBoard BoardJourney walks a route over the ordinary BoardGraph projection', () => {
  const graph = fixtureGraph();
  const board = experienceBoardGraph(graph);
  assert.equal(board.nodes.length, graph.nodes.length);
  assert.equal(board.relationships.length, graph.edges.length);
  assert.equal(board.nodes.find((node) => node.nodeRef === 'VexLifeSightFamily.Ready').parentRefOrNull, 'VexLifeSightFamily');
  assert.equal(board.relationships.find((row) => row.relationshipRef === 'edge:OFFERS:VexLifeSightFamily.Ready:VexLifeSightFamily.Engage').kind, 'TRANSITION');

  let journey = createBoardJourney(board, { journeyRef: 'journey.sight.engage', boardRef: 'board.experience', startRef: 'element.workspace.sight' });
  assert.ok(journeyChoices(board, journey).some((choice) => choice.relationshipRef === 'edge:MANIFESTS:element.workspace.sight:VexLifeSightFamily.Engage'));
  journey = advanceBoardJourney(board, journey, 'edge:MANIFESTS:element.workspace.sight:VexLifeSightFamily.Engage');
  journey = advanceBoardJourney(board, journey, 'edge:REQUESTS_EFFECT:VexLifeSightFamily.Engage:VexLifeSightFamily.Effect.EngageScope:when:Ready:0');
  journey = advanceBoardJourney(board, journey, 'edge:REALIZED_BY:VexLifeSightFamily.Effect.EngageScope:VexLifeProdLocalService');
  journey = advanceBoardJourney(board, journey, 'edge:RETURNS_TO:VexLifeProdLocalService:VexLifeSightFamily.observe');
  journey = advanceBoardJourney(board, journey, 'edge:OBSERVES_AS:VexLifeSightFamily.observe:VexLifeSightFamily.Engaged');
  assert.equal(journey.currentRef, 'VexLifeSightFamily.Engaged');
  assert.equal(journey.steps.length, 6);
});
