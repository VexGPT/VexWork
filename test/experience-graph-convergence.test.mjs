import assert from 'node:assert/strict';
import test from 'node:test';

import { JOIN_CLASSES, READINESS, classifyJoins, debtDependents, deriveConvergence, diffExperienceGraphs, evaluateRelayGate, routeReadiness } from '../src/core/experience-graph-convergence.mjs';
import { deriveFrontier, deriveRoutes } from '../src/core/experience-graph-derivation.mjs';
import { normalizeExperienceGraph } from '../src/core/experience-graph.mjs';
import { fixtureGraph, fixtureLaws } from './fixtures/experience-graph/graph.mjs';
import { PRIOR_COMMIT } from './fixtures/experience-graph/fixtures.mjs';

const INPUTS = { graph: true, frontier: true, sourceCommit: true, hostLawProbe: true, perturbationEvidence: true, lawEvidence: true, manifests: true, priorGraph: true };

test('R1: the accepted turn consumes independent truths ordinarily; no Relay is invented for it', () => {
  const graph = fixtureGraph();
  const { joins, relaySources } = classifyJoins(graph, { relaySources: [{ symbol: 'VexLifeSemanticRelayContract', sourcePath: 'x.kt' }] });
  assert.ok(JOIN_CLASSES.includes(joins[0].classification));
  const turn = joins.find((join) => join.consumer === 'DirectCompanionTurn');
  assert.equal(turn.classification, 'ORDINARY_CONSUMPTION');
  assert.ok(turn.independentOwners.includes('VexLifeQuietFamily'));
  assert.ok(turn.independentOwners.includes('VexLifeProfileStore'));
  assert.ok(turn.inputs.some((input) => input.gate === 'QUIET_MODE_ON'));
  assert.match(turn.reason, /Receipt records \d+ input fields separately/);
  assert.deepEqual(relaySources, [{ symbol: 'VexLifeSemanticRelayContract', sourcePath: 'x.kt', consumedByAnyJoin: false, note: 'not an owner of any classified join; its name alone grants no convergence authority' }]);
});

test('R1: source-proven Relay, candidate projection and unclassified joins are told apart', () => {
  const graph = fixtureGraph();
  const add = (edges, nodes = []) => normalizeExperienceGraph({ ...graph, nodes: [...graph.nodes, ...nodes], edges: [...graph.edges, ...edges] });
  const edge = (kind, from, to, detail = {}) => ({ ref: `edge:${kind}:${from}:${to}`, kind, from, to, family: null, whenState: null, guards: [], sourceRef: null, detail });
  const relay = { ref: 'VexLifeReadinessRelay', role: 'OWNER', family: null, label: 'Relay', sourceRef: null, detail: {} };
  const proven = add([
    edge('CONVERGES_IN', 'VexLifeSightFamily.Ready', 'VexLifeReadinessRelay', { sourceProvenRelay: true }),
    edge('CONVERGES_IN', 'VexLifeQuietFamily.Kept', 'VexLifeReadinessRelay', { sourceProvenRelay: true }),
  ], [relay]);
  assert.equal(classifyJoins(proven).joins.find((join) => join.consumer === 'VexLifeReadinessRelay').classification, 'SOURCE_PROVEN_RELAY');

  const view = { ref: 'VexLifeCombinedView', role: 'PROJECTION', family: null, label: 'view', sourceRef: null, detail: {} };
  const candidate = add([edge('CONSUMED_BY', 'VexLifeSightFamily.Ready', 'VexLifeCombinedView'), edge('CONSUMED_BY', 'VexLifeQuietFamily.Kept', 'VexLifeCombinedView')], [view]);
  assert.equal(classifyJoins(candidate).joins.find((join) => join.consumer === 'VexLifeCombinedView').classification, 'CANDIDATE_CONVERGENCE');

  const stateJoin = add([edge('CONSUMED_BY', 'VexLifeSightFamily.Ready', 'VexLifeQuietFamily.Kept'), edge('CONSUMED_BY', 'VexLifeStockFamily.State', 'VexLifeQuietFamily.Kept')]);
  assert.equal(classifyJoins(stateJoin).joins.find((join) => join.consumer === 'VexLifeQuietFamily.Kept').classification, 'UNKNOWN');
});

test('Relay gate: every candidate question names its inputs, consumer and verdict; none is earned by default', () => {
  const graph = fixtureGraph();
  const gate = evaluateRelayGate({ joins: classifyJoins(graph), inputs: INPUTS });
  assert.equal(gate.R1.ordinaryOnly, true);
  assert.equal(gate.R1.sourceProvenRelays, 0);
  const verdicts = Object.fromEntries(gate.questions.map((row) => [row.question, row.verdict]));
  assert.deepEqual(verdicts, {
    'route readiness': 'NOT_EARNED:QUERY_SUFFICIENT',
    'debt frontier': 'NOT_EARNED:INPUTS_ABSENT',
    'perturbation candidate currentness': 'NOT_EARNED:QUERY_SUFFICIENT',
    'coverage / proof currentness': 'NOT_EARNED:INPUTS_ABSENT',
    'execution-plan readiness': 'NOT_EARNED:INPUTS_ABSENT',
    'graph change impact': 'NOT_EARNED:QUERY_SUFFICIENT',
    'VexBoard inspection': 'NOT_EARNED:INPUTS_ABSENT',
    'release readiness': 'NOT_EARNED:INPUTS_ABSENT',
  });
  assert.deepEqual(gate.questions.map((row) => row.stage), ['R2', 'R2', 'R2', 'R3', 'R3', 'R4', 'R4', 'R5']);
  const all = Object.fromEntries(['repairOwnership', 'livedEvidence', 'resourceClaims', 'hostModelAvailability', 'liveRuntimeProjection', 'requiredJourneys', 'releaseEvidence'].map((key) => [key, true]));
  const full = evaluateRelayGate({ joins: classifyJoins(graph), inputs: { ...INPUTS, ...all } });
  assert.equal(full.questions.find((row) => row.question === 'execution-plan readiness').verdict, 'NOT_EARNED:NO_CURRENT_CONSUMER');
  assert.equal(full.questions.find((row) => row.question === 'debt frontier').verdict, 'NOT_EARNED:QUERY_SUFFICIENT');
});

test('ordinary queries: route readiness, debt -> dependent routes, graph revision change impact', () => {
  const graph = fixtureGraph();
  const frontier = deriveFrontier(graph);
  const derivation = deriveRoutes(graph, frontier);
  const readiness = routeReadiness(derivation, { lawProbeAvailable: true });
  assert.deepEqual(Object.keys(readiness.routeCounts), READINESS);
  const byRoute = Object.fromEntries(readiness.routes.map((row) => [row.routeRef, row.readiness]));
  assert.equal(byRoute['route:VexLifeSightFamily.Ready:Engage:0'], 'READY_SERIAL', 'a lived partner step runs serially');
  assert.equal(byRoute['route:VexLifeQuietFamily.Kept:Begin:0'], 'HELD', 'deterministic service harness is not in this lane');
  assert.equal(byRoute['route:VexLifeDictationFamily.Ready:Start:0'], 'DEBT_BLOCKED');
  assert.equal(readiness.caseCounts.READY_PARALLEL, derivation.cases.length);
  assert.equal(routeReadiness(derivation, { lawProbeAvailable: false }).caseCounts.UNAVAILABLE, derivation.cases.length);

  const dependents = debtDependents(frontier, derivation);
  assert.ok(dependents[0].dependentRoutes.length >= dependents.at(-1).dependentRoutes.length);
  assert.ok(dependents.some((row) => row.debtRef === 'debt:MISSING_MANIFESTATION_BINDING:VexLifeDictationFamily.Start'));

  const prior = fixtureGraph({ commit: PRIOR_COMMIT, families: fixtureLaws().filter((law) => law.family !== 'VexLifeQuietFamily') });
  const priorDerivation = deriveRoutes(prior, deriveFrontier(prior));
  const impact = diffExperienceGraphs(prior, graph, { priorRoutes: priorDerivation.routes, currentRoutes: derivation.routes });
  assert.deepEqual(impact.familiesAdded, ['VexLifeQuietFamily']);
  assert.deepEqual(impact.familiesRemoved, []);
  assert.ok(impact.edgesAdded.includes('edge:OFFERS:VexLifeQuietFamily.Kept:VexLifeQuietFamily.Begin'));
  assert.ok(impact.impactedRoutes.some((row) => row.routeRef === 'route:VexLifeQuietFamily.Kept:Begin:0' && row.side === 'CURRENT'));
  const reverse = diffExperienceGraphs(graph, prior);
  assert.deepEqual(reverse.familiesRemoved, ['VexLifeQuietFamily']);
  assert.deepEqual(reverse.impactedRoutes, []);

  const changed = normalizeExperienceGraph({ ...graph, edges: graph.edges.map((edge) => (edge.ref === 'edge:OFFERS:VexLifeSightFamily.Ready:VexLifeSightFamily.Engage' ? { ...edge, guards: ['x'] } : edge)) });
  assert.deepEqual(diffExperienceGraphs(graph, changed).edgesChanged, ['edge:OFFERS:VexLifeSightFamily.Ready:VexLifeSightFamily.Engage']);
});

test('deriveConvergence assembles joins, gate and queries without forming a Relay', () => {
  const graph = fixtureGraph();
  const frontier = deriveFrontier(graph);
  const derivation = deriveRoutes(graph, frontier);
  const result = deriveConvergence(graph, { frontier, derivation, inputs: INPUTS });
  assert.equal(result.graphFingerprint, graph.fingerprint);
  assert.equal(result.queries.changeImpact, null);
  assert.ok(result.gate.questions.every((row) => row.verdict.startsWith('NOT_EARNED')));
  const withPrior = deriveConvergence(graph, { frontier, derivation, inputs: INPUTS, priorGraph: graph, priorDerivation: derivation });
  assert.deepEqual(withPrior.queries.changeImpact.edgesAdded, []);
});
