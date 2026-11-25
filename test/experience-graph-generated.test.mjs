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
const PLAN_FILE = `${PROJECT}/experience-graph/source-plan.json`;
const CURRENT_PRODUCT = '66752be53be83422fdf23a438e503c1b934edd0d';
const PRIOR_PRODUCT = 'fb4ea859949f2fcba47bf55857669df37d2730ce';

test('checked-in Experience Relationship Graph artifacts reproduce offline from the current graph and derivations', () => {
  const { problems } = verify();
  assert.deepEqual(problems, []);
  assert.deepEqual(json(OUTPUTS.graph).extractor.modules, extractorFingerprint());
});

test('the live Experience Graph is pinned to exact current Product with exact prior change-impact', () => {
  const plan = json(PLAN_FILE);
  const graph = json(OUTPUTS.graph);
  const impact = json(OUTPUTS.convergence).queries.changeImpact;

  assert.equal(plan.commit, CURRENT_PRODUCT);
  assert.equal(plan.priorCommit, PRIOR_PRODUCT);
  assert.deepEqual(plan.builds, [], 'historical candidate comparisons are not live current-main projections');
  assert.equal(graph.source.commit, CURRENT_PRODUCT);
  assert.equal(impact.priorCommit, PRIOR_PRODUCT);
  assert.equal(impact.currentCommit, CURRENT_PRODUCT);
  assert.deepEqual(impact.familiesRemoved, []);
  assert.deepEqual(impact.familiesAdded, [
    'VexLifeAttachmentDraftFamily',
    'VexLifeConversationTurnFamily',
    'VexLifeLanguageFamily',
    'VexLifeLocalSourcesFamily',
  ]);
});

test('current Product structural routes expose the newly accepted Families without overclaiming every route', () => {
  const routes = json(OUTPUTS.routes);
  assert.deepEqual(routes.counts, {
    CLEARED: 27,
    FRONTIER_DEBT: 52,
    HELD: 0,
    UNKNOWN: 0,
  });

  const language = routes.routes.filter((route) => route.family === 'VexLifeLanguageFamily');
  assert.equal(language.length, 6);
  assert.ok(language.every((route) => route.status === 'CLEARED'));

  const profiles = routes.routes.filter((route) => route.family === 'VexLifeContextProfileFamily');
  assert.equal(profiles.length, 8);
  assert.ok(profiles.every((route) => route.status === 'CLEARED'));

  assert.equal(
    routes.journeys.find((journey) => journey.journeyRef === 'journey:gate:PRIVATE_MODE_ON')?.status,
    'CLEARED',
  );
  for (const journey of routes.journeys.filter((row) => row.status !== 'CLEARED')) {
    assert.ok(journey.missing.length, `${journey.journeyRef} says what remains missing`);
  }
});

test('current frontier removes resolved localization debt and keeps concrete remaining source debt explicit', () => {
  const frontier = json(OUTPUTS.frontier);
  const byKind = (kind) => frontier.debt.filter((row) => row.kind === kind);
  for (const resolved of [
    'SCRIPT_COLLAPSE',
    'PARTIAL_LANGUAGE_SERVED',
    'LANGUAGE_INCOMPLETE',
    'HARDCODED_DISPLAY_TEXT',
  ]) {
    assert.equal(byKind(resolved).length, 0, `${resolved} should not survive current Product`);
  }

  assert.ok(
    byKind('FAMILY_READS_WIRE_STRING').some((row) => row.coordinate === 'VexLifeProdEntryFamily'),
  );
  assert.ok(
    byKind('DATAKEY_ANCHOR_NOT_IN_MAIN').some((row) => row.coordinate === 'dataKey:VexLifeCapabilityBridge'),
  );
  assert.ok(byKind('TYPED_REF_BYPASSED').length > 0);
  assert.ok(byKind('TEST_SEAM_MISSING').length > 0);
  assert.equal(frontier.byClass.F, byKind('TEST_SEAM_MISSING').length);
});

test('historical candidate branch comparisons are absent from the live current-main projection', () => {
  const plan = json(PLAN_FILE);
  const branches = json(OUTPUTS.branches);
  const graph = json(OUTPUTS.graph);

  assert.deepEqual(plan.builds, []);
  assert.equal(branches.main.commit, CURRENT_PRODUCT);
  assert.equal(branches.main.graphFingerprint, graph.fingerprint);
  assert.deepEqual(branches.candidates, []);
  assert.deepEqual(branches.consolidations, []);
});

test('historical executable/source-review evidence stays explicit when it is no longer current', () => {
  const plan = json(PLAN_FILE);
  const lawEvidence = json(EVIDENCE.law);
  const lawProof = json(OUTPUTS.lawProof);
  const perturbations = json(OUTPUTS.perturbations);

  assert.equal(lawEvidence.source.commit, PRIOR_PRODUCT);
  assert.equal(plan.commit, CURRENT_PRODUCT);
  assert.equal(lawProof.current, false, 'old law execution must not impersonate current Product proof');

  assert.ok(
    perturbations.answers.STALE_EVIDENCE > 0,
    'source-review evidence whose bound Product blob changed must become stale',
  );
  assert.equal(
    perturbations.answers.ANSWERED_BY_EVIDENCE,
    0,
    'no old source-review answer remains current after its bound runtime blob changed',
  );
});

test('current graph convergence keeps release readiness unearned until A5 supplies current proof inputs', () => {
  const convergence = json(OUTPUTS.convergence);
  assert.ok(convergence.gate.questions.every((row) => row.verdict.startsWith('NOT_EARNED')));

  const release = convergence.gate.questions.find((row) => row.question === 'release readiness');
  assert.ok(release);
  assert.equal(release.stage, 'R5');
  assert.equal(release.verdict, 'NOT_EARNED:INPUTS_ABSENT');
  assert.ok(release.missingInputs.includes('requiredJourneys'));
  assert.ok(release.missingInputs.includes('releaseEvidence'));
  assert.ok(release.missingInputs.includes('livedEvidence'));
});

test('VexBoard traversal still walks the real Vision route on current main', () => {
  const graph = json(OUTPUTS.graph);
  const board = experienceBoardGraph(graph);
  let journey = createBoardJourney(board, {
    journeyRef: 'journey.vision.loop',
    boardRef: 'board.experience',
    startRef: 'VexLifeVisionFamily.Ready',
  });
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
  ]) {
    journey = advanceBoardJourney(board, journey, ref);
  }
  assert.equal(journey.currentRef, 'VexLifeVisionFamily.Ready');
  const analysis = calculateBoardJourneyPathways(board, journey);
  assert.equal(analysis.motifs.length, 1);
  assert.equal(analysis.motifs[0].anchorRef, 'VexLifeVisionFamily.Ready');
});

test('the current human seed resolves every current-main Family coordinate against the current graph', () => {
  const seed = json(`${PROJECT}/relationship-lattice.seed.json`);
  const graph = json(OUTPUTS.graph);
  const refs = new Set(graph.nodes.map((node) => node.ref));
  const currentDispositions = new Set([
    'CURRENT_MAIN',
    'CURRENT_MAIN_PLUS_ACTIVE_EVOLUTION',
    'CURRENT_MAIN_HELD_CONNECTOR',
  ]);

  for (const coordinate of seed.coordinates.filter(
    (row) => row.coordinateClass === 'FAMILY_OR_SEMANTIC_OWNER'
      && currentDispositions.has(row.disposition),
  )) {
    assert.ok(refs.has(coordinate.coordinate), `${coordinate.coordinate} is present in current Product graph`);
  }
  assert.ok(refs.has('VexLifeLanguageFamily'));
  assert.ok(graph.edges.some(
    (edge) => edge.ref === 'edge:REQUESTS_EFFECT:VexLifeMemoryReviewFamily.Keep:VexLifeMemoryReviewFamily.Effect.Accept:when:Pending:0',
  ));
  assert.ok(refs.has('element.vexlife-workspace.companion.conversation.context-share'));
});

test('the generated report summarizes the current graph and names proof/frontier boundaries', () => {
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
  assert.match(report, /route:VexLifeLanguageFamily\.FollowingReplies:ChooseReplyLanguage:1/);
  assert.match(report, /## Frontier debt — highest leverage first/);
  assert.match(report, /law proof/);
});
