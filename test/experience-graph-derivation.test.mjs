import assert from 'node:assert/strict';
import test from 'node:test';

import { DEBT_CLASSES, ROUTE_STATUSES, deriveFrontier, deriveRoutes } from '../src/core/experience-graph-derivation.mjs';
import { normalizeExperienceGraph } from '../src/core/experience-graph.mjs';
import { readFamilyLaw } from '../src/core/experience-graph-kotlin-family.mjs';
import { fixtureGraph, fixtureLaws } from './fixtures/experience-graph/graph.mjs';
import { UNREADABLE } from './fixtures/experience-graph/fixtures.mjs';

const debtKinds = (frontier, coordinate) => frontier.debt.filter((row) => row.coordinate === coordinate).map((row) => `${row.debtClass}:${row.kind}`);

test('frontier debt is derived from the graph and classified A–F at the rightful coordinate', () => {
  const graph = fixtureGraph();
  const frontier = deriveFrontier(graph);
  assert.equal(frontier.graphFingerprint, graph.fingerprint);
  assert.deepEqual(Object.keys(DEBT_CLASSES), ['A', 'B', 'C', 'D', 'E', 'F', 'G']);

  assert.deepEqual(debtKinds(frontier, 'VexLifeSpeechModelsFamily'), ['A:MISSING_ACT_LAW', 'E:MISSING_PROJECTION']);
  assert.deepEqual(debtKinds(frontier, 'element.workspace.language'), ['A:MISSING_CONTROL_LAW']);
  assert.deepEqual(debtKinds(frontier, 'element.workspace.composer'), ['B:ELEMENT_WITHOUT_BINDING']);
  assert.deepEqual(debtKinds(frontier, 'VexLifeDictationFamily.Start'), ['B:MISSING_MANIFESTATION_BINDING']);
  assert.deepEqual(frontier.debt.find((row) => row.coordinate === 'VexLifeDictationFamily.Start').hints, ['element.workspace.dictation']);
  assert.deepEqual(debtKinds(frontier, 'VexLifeReviewFamily.Effect.Accept'), ['C:MISSING_REALIZATION']);
  assert.deepEqual(debtKinds(frontier, 'VexLifeStockFamily'), ['D:MISSING_OBSERVATION']);
  assert.deepEqual(debtKinds(frontier, 'VexLifeDictationFamily.DisplayState'), ['E:PROJECTION_NOT_SURFACED']);
  assert.deepEqual(debtKinds(frontier, 'VexLifeGatewayFamily'), ['E:MISSING_PROJECTION']);
  assert.equal(debtKinds(frontier, 'element.workspace.dictation').length, 0, 'presentation-local navigation decides nothing and owes nothing');
  assert.equal(debtKinds(frontier, 'VexLifeSightFamily.Engage').length, 0);
  assert.equal(frontier.byClass.B, frontier.debt.filter((row) => row.debtClass === 'B').length);
});

test('a Control reached only through a raw literal is UNTYPED_MANIFESTATION; unreadable act forms become extraction debt', () => {
  const laws = fixtureLaws();
  const graph = fixtureGraph();
  const quietClear = graph.edges.find((row) => row.kind === 'MANIFESTS' && row.to === 'VexLifeQuietFamily.Clear');
  assert.ok(quietClear, 'Quiet Clear is typed-bound through the Quiet pathway');
  // Remove the typed binding so only the literal remains.
  const unbound = normalizeExperienceGraph({ ...graph, edges: graph.edges.filter((row) => row !== quietClear) });
  const frontier = deriveFrontier(unbound);
  const row = frontier.debt.find((entry) => entry.coordinate === 'VexLifeQuietFamily.Clear');
  assert.equal(row.kind, 'UNTYPED_MANIFESTATION');
  assert.match(row.sourceRef, /VexLifeWebRuntimeArtifacts\.kt:L\d+$/);

  const odd = fixtureGraph({ families: [...laws, readFamilyLaw({ path: 'src/commonMain/kotlin/vexlife/odd/VexLifeOddFamily.kt', text: UNREADABLE })] });
  const oddFrontier = deriveFrontier(odd);
  assert.ok(oddFrontier.debt.some((entry) => entry.kind === 'UNRESOLVED_EFFECT' && entry.debtClass === 'B' && entry.coordinate === 'VexLifeOddFamily:One×Go'));
  const routes = deriveRoutes(odd, oddFrontier);
  assert.equal(routes.routes.find((route) => route.routeRef.startsWith('route:VexLifeOddFamily.One:Go')).status, 'UNKNOWN');
  assert.ok(!routes.cases.some((testCase) => testCase.target.control === 'VexLifeOddFamily.Wait'), 'unread Wait cells never become generated REJECT cases');
});

test('routes are CLEARED only when every coordinate is addressable; others carry the smallest missing predicates', () => {
  const graph = fixtureGraph();
  const derived = deriveRoutes(graph, deriveFrontier(graph));
  assert.deepEqual(Object.keys(derived.counts), ROUTE_STATUSES);
  const cleared = derived.routes.filter((route) => route.status === 'CLEARED').map((route) => route.routeRef);
  assert.deepEqual(cleared, [
    'route:VexLifeQuietFamily.Kept:Begin:0',
    'route:VexLifeQuietFamily.Kept:Clear:0',
    'route:VexLifeQuietFamily.Quiet:Clear:0',
    'route:VexLifeQuietFamily.Quiet:End:0',
    'route:VexLifeSightFamily.Engaged:Stop:0',
    'route:VexLifeSightFamily.Held:Stop:0',
    'route:VexLifeSightFamily.Ready:Engage:0',
  ]);
  const engage = derived.routes.find((route) => route.routeRef === 'route:VexLifeSightFamily.Ready:Engage:0');
  assert.deepEqual(engage.steps.map((step) => step.step), ['PRECONDITION', 'HUMAN_ACTION', 'ACT', 'REALIZATION', 'OBSERVATION', 'PROJECTION']);
  assert.equal(engage.steps.find((step) => step.step === 'REALIZATION').executionClass, 'E', 'a Lens partner makes realization lived-lifecycle');
  assert.deepEqual(engage.steps.find((step) => step.step === 'OBSERVATION').successors, ['VexLifeSightFamily.Engaged', 'VexLifeSightFamily.Held', 'VexLifeSightFamily.Ready']);
  assert.equal(engage.pathwayRef, 'pathway.fixture.sight');
  assert.match(engage.explanation, /<element:element\.workspace\.sight>\n {2}-> <state:READY>\n {2}-> <control:ENGAGE>\n {2}-> <effect:EngageScope>/);

  const start = derived.routes.find((route) => route.routeRef === 'route:VexLifeDictationFamily.Ready:Start:0');
  assert.equal(start.status, 'FRONTIER_DEBT');
  assert.deepEqual(start.missing.map((row) => row.predicate), ['MISSING_STABLE_ELEMENT_BINDING', 'PROJECTION_NOT_SURFACED']);
  assert.equal(start.steps.find((step) => step.step === 'ACT').act.admittedState, 'VexLifeDictationFamily.Requesting');
  assert.equal(start.steps.find((step) => step.step === 'REALIZATION').executionClass, 'C', 'browser-runtime realization needs an isolated service');
  assert.match(start.explanation, /<element:FRONTIER_DEBT>/);

  const remove = derived.routes.filter((route) => route.routeRef.startsWith('route:VexLifeStockFamily.State:Remove:'));
  assert.equal(remove.length, 2, 'nested if branches are two routes');
  assert.deepEqual(remove[0].steps.find((step) => step.step === 'ACT').act.axisUpdates, { targeted: 'false' });
  const review = derived.routes.find((route) => route.routeRef === 'route:VexLifeReviewFamily.Pending:Keep:0');
  assert.deepEqual(review.steps[0].guards, ['!(currentState.candidateRef != control.candidateRef)']);
  assert.ok(review.missing.some((row) => row.predicate === 'MISSING_REALIZATION_EDGE'));
  const cancel = derived.routes.find((route) => route.routeRef === 'route:VexLifeGatewayFamily.Current:Cancel:0');
  assert.deepEqual(cancel.steps.find((step) => step.step === 'ACT').act, { kind: 'STAY', admittedState: null, axisUpdates: {}, effect: null });
});

test('test manifests are deterministic, include effect-free rejection cases and keep deeper steps HELD', () => {
  const graph = fixtureGraph();
  const first = deriveRoutes(graph, deriveFrontier(graph));
  const second = deriveRoutes(graph, deriveFrontier(graph));
  assert.equal(first.manifestFingerprint, second.manifestFingerprint);
  const engage = first.cases.find((row) => row.caseRef === 'case:VexLifeSightFamily.Ready:Engage:0');
  assert.deepEqual(engage.expect, { act: { kind: 'STAY', admittedState: null, axisUpdates: {}, effect: 'VexLifeSightFamily.Effect.EngageScope' }, effectFree: false });
  assert.deepEqual(engage.actions, [{ control: 'VexLifeSightFamily.Engage', elementRefs: ['element.workspace.sight'] }]);
  assert.deepEqual(engage.deeper.map((row) => [row.step, row.status]), [
    ['REALIZATION', 'HELD_NO_HARNESS_IN_LANE'],
    ['OBSERVATION', 'HELD_NO_HARNESS_IN_LANE'],
    ['PROJECTION', 'ASSERTABLE_FROM_SOURCE'],
  ]);
  const reject = first.cases.find((row) => row.caseRef === 'case:reject:VexLifeDictationFamily.Stopping:Start');
  assert.deepEqual(reject.expect, { act: { kind: 'REJECT', admittedState: null, effect: null }, effectFree: true });
  assert.ok(!first.cases.some((row) => row.caseRef.startsWith('case:reject:VexLifeSpeechModelsFamily')), 'availability-only Families have no act() to refuse');
  assert.equal(first.cases.filter((row) => row.caseRef.startsWith('case:reject:')).length, first.cases.length - first.routes.length);
  assert.deepEqual(first.pathways.map((row) => row.family).slice(0, 2), ['RuntimeAvailability', 'VexLifeDictationFamily']);
});

test('journeys are joined only where the graph joins them: Send capture and Send admission gates', () => {
  const graph = fixtureGraph();
  const derived = deriveRoutes(graph, deriveFrontier(graph));
  const byRef = Object.fromEntries(derived.journeys.map((journey) => [journey.journeyRef, journey]));
  const gate = byRef['journey:gate:QUIET_MODE_ON'];
  assert.equal(gate.shape, 'CURRENT_STATE_GATES_SEND_ADMISSION');
  assert.equal(gate.status, 'CLEARED');
  assert.ok(gate.feedingRoutes.includes('route:VexLifeQuietFamily.Kept:Begin:0'));
  assert.equal(byRef['journey:gate:MODEL_SWITCH_HELD'].status, 'UNKNOWN');
  const profile = byRef['journey:capture:contextProfile:VexLifeProfileStore'];
  assert.equal(profile.shape, 'MUTABLE_CURRENT_TRUTH_CAPTURED_AT_SEND');
  assert.deepEqual(profile.receiptEvidence, ['DirectPromptContext.Receipt.contextProfileRef']);
  assert.deepEqual(profile.sendManifestation, ['element.workspace.send']);
  assert.match(profile.captureLaw, /next Send/);
  assert.deepEqual(profile.missing, [{ predicate: 'NO_FAMILY_ROUTE_REALIZES_CURRENT_TRUTH', coordinate: 'VexLifeProfileStore' }]);
});

test('a Family route that realizes into captured current truth feeds the Send journey', () => {
  const graph = fixtureGraph();
  // Model the Context Profile shape: the Quiet Family's realization delegates into the store the Send captures.
  const extra = {
    ref: 'edge:REALIZED_BY:VexLifeProdLocalService:VexLifeProfileStore:VexLifeQuietFamily',
    kind: 'REALIZED_BY', from: 'VexLifeProdLocalService', to: 'VexLifeProfileStore', family: 'VexLifeQuietFamily',
    whenState: null, guards: [], sourceRef: null, detail: {},
  };
  const joined = normalizeExperienceGraph({ ...graph, edges: [...graph.edges, extra] });
  const derived = deriveRoutes(joined, deriveFrontier(joined));
  const profile = derived.journeys.find((journey) => journey.journeyRef === 'journey:capture:contextProfile:VexLifeProfileStore');
  assert.ok(profile.feedingRoutes.includes('route:VexLifeQuietFamily.Kept:Begin:0'));
  assert.equal(profile.status, 'CLEARED');
  assert.deepEqual(profile.missing, []);
});
