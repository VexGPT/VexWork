import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { EVIDENCE, OUTPUTS, buildOutputs, extractorFingerprint, verify } from '../scripts/build-experience-graph.mjs';
import { renderExperienceReport } from '../src/core/experience-graph-report.mjs';
import { experienceBoardGraph, lawFingerprint, normalizeExperienceGraph } from '../src/core/experience-graph.mjs';
import { advanceBoardJourney, createBoardJourney } from '../src/shared/vexboard-journey.mjs';
import { calculateBoardJourneyPathways } from '../src/shared/vexboard-journey-pathway-analysis.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const json = (file) => JSON.parse(fs.readFileSync(path.join(ROOT, file), 'utf8'));
const PROJECT = 'projects/vexlife-prod-end-to-end-tests';
const PLAN_FILE = `${PROJECT}/experience-graph/source-plan.json`;

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

test('patient-zero neighborhoods: Vision, Private, VoiceInput and Diagnostics clear once keyed elements are read as identity', () => {
  const routes = json(OUTPUTS.routes);
  assert.deepEqual(routes.routes.filter((route) => route.status === 'CLEARED').map((route) => route.routeRef), [
    'route:VexLifeDiagnosticsFamily.Recording:ClearHistory:0',
    'route:VexLifeDiagnosticsFamily.Recording:StartEnhanced:0',
    'route:VexLifeDiagnosticsFamily.RecordingEnhanced:ClearHistory:0',
    'route:VexLifeDiagnosticsFamily.RecordingEnhanced:StopEnhanced:0',
    'route:VexLifePrivateModeFamily.Kept:Begin:0',
    'route:VexLifePrivateModeFamily.Private:End:0',
    'route:VexLifeVisionFamily.Engaged:Stop:0',
    'route:VexLifeVisionFamily.Held:Stop:0',
    'route:VexLifeVisionFamily.Ready:Engage:0',
    'route:VexLifeVoiceInputFamily.Failed:Start:0',
    'route:VexLifeVoiceInputFamily.Listening:Stop:0',
    'route:VexLifeVoiceInputFamily.Ready:Start:0',
    'route:VexLifeVoiceInputFamily.RequestingMicrophone:Stop:0',
  ]);
  // VoiceInput's Lens element and its catalog key are one element: markup carries both identities.
  const start = routes.routes.find((route) => route.routeRef === 'route:VexLifeVoiceInputFamily.Ready:Start:0');
  assert.deepEqual(start.steps.find((step) => step.step === 'HUMAN_ACTION').elementRefs, [
    'element.vexlife-workspace.companion.conversation.voice-input',
    'key:workspace.button.voice-input-start',
  ]);
  const frontier = json(OUTPUTS.frontier);
  const has = (kind, coordinate) => frontier.debt.some((row) => row.kind === kind && row.coordinate === coordinate);
  assert.ok(!has('MISSING_MANIFESTATION_BINDING', 'VexLifeVoiceInputFamily.Start'));
  assert.ok(!has('PROJECTION_NOT_SURFACED', 'VexLifeProdEntryFamily.DisplayState'), 'Entry is surfaced by setup keys in the native window');
  assert.ok(has('MISSING_MANIFESTATION_BINDING', 'VexLifeProdEntryFamily.Cancel'), 'Cancel is the one Entry Control no key names');
  assert.ok(has('MISSING_ACT_LAW', 'VexLifeLocalAsrModelsFamily'));
  assert.equal(routes.journeys.find((journey) => journey.journeyRef === 'journey:gate:PRIVATE_MODE_ON').status, 'CLEARED');
  for (const journey of routes.journeys.filter((row) => row.status !== 'CLEARED')) assert.ok(journey.missing.length, `${journey.journeyRef} says what it is missing`);
});

test('localization and string-identity frontier name the real Product edges', () => {
  const frontier = json(OUTPUTS.frontier);
  const has = (kind, coordinate) => frontier.debt.some((row) => row.kind === kind && row.coordinate === coordinate);
  assert.ok(has('SCRIPT_COLLAPSE', 'localization:reply:zh-Hant'));
  assert.ok(has('PARTIAL_LANGUAGE_SERVED', 'VexLifeProdLocalService.handleStrings'));
  assert.ok(has('LANGUAGE_INCOMPLETE', 'localization:workspace'));
  assert.ok(has('LANGUAGE_INCOMPLETE', 'localization:release-alerts'));
  for (const family of ['VexLifeContextProfileFamily', 'VexLifeMemoryFamily', 'VexLifePrivateModeFamily', 'VexLifeVisionFamily']) {
    assert.ok(has('HARDCODED_DISPLAY_TEXT', `${family}.DisplayState`), family);
  }
  assert.ok(has('FAMILY_READS_WIRE_STRING', 'VexLifeVisionFamily'));
  assert.ok(has('DATAKEY_ANCHOR_NOT_IN_MAIN', 'dataKey:VexLifeVoiceInputFamily'));
  const shadow = frontier.debt.find((row) => row.kind === 'LITERAL_SHADOWS_CONSTANT' && /:START_ENHANCED#\d+$/.test(row.coordinate));
  assert.ok(shadow.hints.includes('VexLifeDiagnosticsFamily.ControlStartEnhanced'));
  assert.ok(frontier.debt.some((row) => row.kind === 'TYPED_REF_BYPASSED'));
  assert.ok(!frontier.debt.some((row) => row.kind === 'REFLECTION_IDENTITY'), 'reflected names only ever become evidence text');
  assert.ok(frontier.byClass.F > 0, 'law-probe test seams are class F');
});

test('branch dynamics: candidates are projected against preserved main and say what they move', () => {
  const plan = json(PLAN_FILE);
  const branches = json(OUTPUTS.branches);
  const graph = json(OUTPUTS.graph);
  assert.equal(branches.main.commit, plan.commit);
  assert.equal(branches.main.graphFingerprint, graph.fingerprint, 'main projection is the one checked in at generated/');
  const by = Object.fromEntries(branches.candidates.map((row) => [row.buildRef, row]));
  assert.deepEqual(Object.keys(by).sort(), plan.builds.map((row) => row.buildRef).sort());
  for (const row of branches.candidates) {
    assert.equal(row.basisCommit, plan.commit);
    assert.equal(row.routeFlips.filter((flip) => flip.from === 'CLEARED').length, 0, `${row.buildRef} regresses no CLEARED route`);
    assert.equal(row.lawProofReusable, true, `${row.buildRef} leaves Family law unchanged, so main's executed proof still holds`);
    assert.equal(json(buildOutputs(row.buildRef).graph).source.commit, row.commit);
  }
  const keyed = by['candidate-keyed-elements'];
  assert.equal(keyed.verdict, 'IMPROVES_MAIN');
  assert.deepEqual(keyed.debt.introduced, []);
  for (const kind of ['DATAKEY_ANCHOR_NOT_IN_MAIN', 'FAMILY_READS_WIRE_STRING', 'TYPED_REF_BYPASSED', 'LITERAL_SHADOWS_CONSTANT', 'DATAKEY_UNRESOLVED']) assert.ok(keyed.debt.resolvedByKind[kind] > 0, kind);
  const localization = by['candidate-localization'];
  assert.equal(localization.verdict, 'IMPROVES_MAIN');
  assert.deepEqual(localization.debt.resolvedByKind, { LANGUAGE_INCOMPLETE: 2, PARTIAL_LANGUAGE_SERVED: 1, SCRIPT_COLLAPSE: 1 });
  assert.equal(by['candidate-design-foundation'].verdict, 'NO_GRAPH_CHANGE', 'presentation-only: its law is held by the Product\'s own token test');
});

test('deterministic proof: executed Family law never disagrees with the graph and is bound to it', () => {
  const evidence = json(EVIDENCE.law);
  const graph = json(OUTPUTS.graph);
  assert.equal(evidence.lawFingerprint, lawFingerprint(normalizeExperienceGraph(graph)));
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
