import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { EVIDENCE, OUTPUTS, extractorFingerprint, verify } from '../scripts/build-experience-graph.mjs';
import { renderExperienceReport } from '../src/core/experience-graph-report.mjs';
import { experienceBoardGraph } from '../src/core/experience-graph.mjs';
import { advanceBoardJourney, createBoardJourney } from '../src/shared/vexboard-journey.mjs';
import { calculateBoardJourneyPathways } from '../src/shared/vexboard-journey-pathway-analysis.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const json = (file) => JSON.parse(fs.readFileSync(path.join(ROOT, file), 'utf8'));
const PROJECT = 'projects/vexlife-prod-end-to-end-tests';

test('checked-in Experience Relationship Graph artifacts reproduce offline from the graph and current derivations', () => {
  const { problems } = verify();
  assert.deepEqual(problems, []);
  assert.deepEqual(json(OUTPUTS.graph).extractor.modules, extractorFingerprint());
});

test('the graph is pinned to re-observed VexLife-Prod main, where #251 Context Profile is now current', () => {
  const plan = json(`${PROJECT}/experience-graph/source-plan.json`);
  const graph = json(OUTPUTS.graph);
  assert.equal(graph.source.commit, plan.commit);
  assert.equal(plan.commit, 'a58777106b08bd58c167608fa0115729185ae3dd');
  const families = graph.nodes.filter((node) => node.role === 'FAMILY').map((node) => node.ref);
  assert.ok(families.includes('VexLifeContextProfileFamily'));
  assert.ok(families.includes('VexLifeVoiceInputFamily'));
  const impact = json(OUTPUTS.convergence).queries.changeImpact;
  assert.equal(impact.priorCommit, plan.priorCommit);
  assert.deepEqual(impact.familiesAdded, ['VexLifeContextProfileFamily']);
  assert.ok(impact.edgesAdded.includes('edge:CAPTURED_AT_SEND:VexLifeContextProfileStore:DirectCompanionTurn.Intent.contextProfile'));
});

test('patient-zero neighborhoods: Vision and Private clear; VoiceInput is held at its exact Screen Lens frontier', () => {
  const routes = json(OUTPUTS.routes);
  assert.deepEqual(routes.routes.filter((route) => route.status === 'CLEARED').map((route) => route.routeRef), [
    'route:VexLifePrivateModeFamily.Kept:Begin:0',
    'route:VexLifePrivateModeFamily.Private:End:0',
    'route:VexLifeVisionFamily.Engaged:Stop:0',
    'route:VexLifeVisionFamily.Held:Stop:0',
    'route:VexLifeVisionFamily.Ready:Engage:0',
  ]);
  const start = routes.routes.find((route) => route.routeRef === 'route:VexLifeVoiceInputFamily.Ready:Start:0');
  assert.equal(start.status, 'FRONTIER_DEBT');
  assert.deepEqual(start.missing.map((row) => row.predicate), ['MISSING_STABLE_ELEMENT_BINDING', 'PROJECTION_NOT_SURFACED']);
  const frontier = json(OUTPUTS.frontier);
  assert.deepEqual(frontier.debt.find((row) => row.coordinate === 'VexLifeVoiceInputFamily.Start').hints, ['element.vexlife-workspace.companion.conversation.voice-input']);
  assert.ok(frontier.debt.some((row) => row.kind === 'UNTYPED_MANIFESTATION' && row.coordinate === 'VexLifeDiagnosticsFamily.StartEnhanced'));
  assert.ok(frontier.debt.some((row) => row.kind === 'MISSING_ACT_LAW' && row.coordinate === 'VexLifeLocalAsrModelsFamily'));
  assert.equal(routes.journeys.find((journey) => journey.journeyRef === 'journey:gate:PRIVATE_MODE_ON').status, 'CLEARED');
});

test('deterministic proof: executed Family law never disagrees with the graph and is bound to it', () => {
  const evidence = json(EVIDENCE.law);
  const graph = json(OUTPUTS.graph);
  assert.equal(evidence.graphFingerprint, graph.fingerprint);
  assert.equal(evidence.runner.productSourceModified, false);
  const proof = json(OUTPUTS.lawProof);
  assert.equal(proof.current, true);
  assert.equal(proof.cellCounts.FAIL, 0);
  assert.deepEqual(proof.failures, []);
  assert.ok(proof.cellCounts.PASS >= 100, `expected at least 100 proven law cells, saw ${proof.cellCounts.PASS}`);
  const cell = (state, control) => proof.cells.find((row) => row.state === state && row.control === control);
  assert.equal(cell('VexLifeVoiceInputFamily.RequestingMicrophone', 'VexLifeVoiceInputFamily.Stop').status, 'PASS');
  assert.equal(cell('VexLifeVoiceInputFamily.Stopping', 'VexLifeVoiceInputFamily.Start').status, 'PASS');
  assert.equal(cell('VexLifeVisionFamily.Held', 'VexLifeVisionFamily.Stop').status, 'PASS');
});

test('post-map answers stay bound: VoiceInput stale observations are answered by current source-review evidence', () => {
  const perturbations = json(OUTPUTS.perturbations);
  const answered = perturbations.questions.filter((row) => row.answerState === 'ANSWERED_BY_EVIDENCE').map((row) => row.perturbationRef);
  assert.ok(answered.includes('perturbation:STALE_OBSERVATION:VexLifeVoiceInputFamily:RequestingMicrophone:Stop:observeRecognitionStarted:Listening'));
  assert.equal(perturbations.answers.STALE_EVIDENCE, 0);
  const failure = perturbations.questions.find((row) => row.perturbationRef.endsWith(':observeFailure:Failed'));
  assert.match(failure.expected, /PARTIALLY FENCED/);
  const convergence = json(OUTPUTS.convergence);
  assert.ok(convergence.gate.questions.every((row) => row.verdict.startsWith('NOT_EARNED')));
  assert.ok(convergence.joins.every((join) => join.classification === 'ORDINARY_CONSUMPTION'));
  assert.ok(convergence.relaySources.some((row) => row.symbol === 'VexLifeSemanticRelayContract' && row.consumedByAnyJoin === false));
});

test('VexBoard traversal walks the real Vision route; pathway analysis finds the Engage -> Stop loop', () => {
  const graph = json(OUTPUTS.graph);
  const board = experienceBoardGraph(graph);
  let journey = createBoardJourney(board, { journeyRef: 'journey.vision.loop', boardRef: 'board.experience', startRef: 'VexLifeVisionFamily.Ready' });
  for (const ref of [
    'edge:OFFERS:VexLifeVisionFamily.Ready:VexLifeVisionFamily.Engage',
    'edge:REQUESTS_EFFECT:VexLifeVisionFamily.Engage:VexLifeVisionFamily.Effect.EngageScope:when:Ready:0',
    'edge:REALIZED_BY:VexLifeVisionFamily.Effect.EngageScope:VexLifeProdLocalService',
    'edge:RETURNS_TO:VexLifeProdLocalService:VexLifeVisionFamily.observe',
    'edge:OBSERVES_AS:VexLifeVisionFamily.observe:VexLifeVisionFamily.Engaged',
    'edge:OFFERS:VexLifeVisionFamily.Engaged:VexLifeVisionFamily.Stop',
    'edge:REQUESTS_EFFECT:VexLifeVisionFamily.Stop:VexLifeVisionFamily.Effect.StopScope:when:Engaged:0',
    'edge:REALIZED_BY:VexLifeVisionFamily.Effect.StopScope:VexLifeProdLocalService',
    'edge:RETURNS_TO:VexLifeProdLocalService:VexLifeVisionFamily.observe',
    'edge:OBSERVES_AS:VexLifeVisionFamily.observe:VexLifeVisionFamily.Ready',
  ]) journey = advanceBoardJourney(board, journey, ref);
  assert.equal(journey.currentRef, 'VexLifeVisionFamily.Ready');
  const analysis = calculateBoardJourneyPathways(board, journey);
  assert.equal(analysis.motifs.length, 1);
  assert.equal(analysis.motifs[0].anchorRef, 'VexLifeVisionFamily.Ready');
});

test('the hand-authored seed lattice is now checkable against the derived graph', () => {
  const seed = json(`${PROJECT}/relationship-lattice.seed.json`);
  const graph = json(OUTPUTS.graph);
  const refs = new Set(graph.nodes.map((node) => node.ref));
  const edges = new Set(graph.edges.map((edge) => edge.ref));
  for (const coordinate of seed.coordinates.filter((row) => row.coordinateClass === 'FAMILY_OR_SEMANTIC_OWNER')) {
    assert.ok(refs.has(coordinate.coordinate), `${coordinate.coordinate} from the seed is a derived Family`);
  }
  assert.ok(edges.has('edge:REQUESTS_EFFECT:VexLifeVisionFamily.Engage:VexLifeVisionFamily.Effect.EngageScope:when:Ready:0'));
  assert.ok(edges.has('edge:REQUESTS_EFFECT:VexLifeVisionFamily.Stop:VexLifeVisionFamily.Effect.StopScope:when:Engaged:0'));
  assert.ok(edges.has('edge:REQUESTS_EFFECT:VexLifeMemoryReviewFamily.Keep:VexLifeMemoryReviewFamily.Effect.Accept:when:Pending:0'));
  assert.ok(refs.has('element.vexlife-workspace.companion.conversation.context-share'));
});

test('the generated report summarizes the graph and names its proof and frontier', () => {
  const graph = json(OUTPUTS.graph);
  const report = renderExperienceReport({
    graph,
    frontier: json(OUTPUTS.frontier),
    routes: json(OUTPUTS.routes),
    perturbations: json(OUTPUTS.perturbations),
    convergence: json(OUTPUTS.convergence),
    lawProof: json(OUTPUTS.lawProof),
    board: experienceBoardGraph(graph),
  });
  assert.equal(report, fs.readFileSync(path.join(ROOT, OUTPUTS.report), 'utf8'));
  assert.match(report, /## Cleared routes/);
  assert.match(report, /route:VexLifeVisionFamily\.Ready:Engage:0/);
  assert.match(report, /## Frontier debt — highest leverage first/);
  assert.match(report, /law proof {4}PASS \d+/);
  const without = renderExperienceReport({
    graph,
    frontier: json(OUTPUTS.frontier),
    routes: json(OUTPUTS.routes),
    perturbations: json(OUTPUTS.perturbations),
    convergence: json(OUTPUTS.convergence),
    lawProof: null,
    board: experienceBoardGraph(graph),
  });
  assert.match(without, /\| not run \|/);
  assert.ok(!without.includes('## Law-proof failures'));
});
