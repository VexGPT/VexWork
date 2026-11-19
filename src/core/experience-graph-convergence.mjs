// Experience Relationship Graph — graph-operations convergence subset (R1–R5).
//
// Relay is not the graph builder. After ordinary graph + routes exist:
//
//   R1  classify every independent-truth join:
//       ORDINARY_CONSUMPTION | SOURCE_PROVEN_RELAY | CANDIDATE_CONVERGENCE | UNKNOWN
//   R2–R5  run the Relay gate on each candidate graph-operations question. A question earns a Relay
//          only when independently-owned *current* truths create new relationship meaning AND a
//          current consumer needs it AND an ordinary query is insufficient. Otherwise the useful
//          answer is delivered as an ordinary query below, and no Relay machinery is formed.
//
// Ordinary queries here: route readiness, debt -> dependent routes, graph revision change impact.
//
// Pure: no file system, network or clock.

import { graphIndex } from './experience-graph.mjs';

export const EXPERIENCE_CONVERGENCE_SCHEMA = 'vexwork.experience-graph.convergence/v1';

export const JOIN_CLASSES = Object.freeze(['ORDINARY_CONSUMPTION', 'SOURCE_PROVEN_RELAY', 'CANDIDATE_CONVERGENCE', 'UNKNOWN']);
export const READINESS = Object.freeze(['READY_PARALLEL', 'READY_SERIAL', 'DEBT_BLOCKED', 'HELD', 'UNAVAILABLE']);

const compare = (left, right) => (left < right ? -1 : left > right ? 1 : 0);
const CROSS_OWNER = new Set(['CAPTURED_AT_SEND', 'CONSUMED_BY', 'CONVERGES_IN']);

function independentOwner(index, edge) {
  const from = index.nodes.get(edge.from);
  if (from.family) return from.family;
  if (from.role === 'CAPTURE') {
    const sources = (index.incoming.get(from.ref) ?? []).filter((row) => row.kind === 'CAPTURED_AT_SEND').map((row) => row.from);
    return sources.length ? sources.sort(compare).join(' + ') : from.ref;
  }
  return from.ref;
}

export function classifyJoins(graph, { relaySources = [] } = {}) {
  const index = graphIndex(graph);
  const joins = [];
  for (const node of graph.nodes) {
    const inputs = (index.incoming.get(node.ref) ?? []).filter((edge) => CROSS_OWNER.has(edge.kind));
    const owners = [...new Set(inputs.map((edge) => independentOwner(index, edge)))].sort(compare);
    if (owners.length < 2) continue;
    let classification;
    let reason;
    if (inputs.some((edge) => edge.kind === 'CONVERGES_IN')) {
      classification = 'SOURCE_PROVEN_RELAY';
      reason = 'exact source owns a convergence relationship over these inputs';
    } else if (node.role === 'OWNER' || node.role === 'CAPTURE') {
      const evidence = graph.edges.filter((edge) => edge.kind === 'PROJECTS_TO' && inputs.some((input) => input.from === edge.from));
      classification = 'ORDINARY_CONSUMPTION';
      reason = node.role === 'CAPTURE'
        ? `${node.ref} is formed by one owner read (${inputs.map((edge) => edge.detail.readVia).filter(Boolean).join(', ')}); the reading owner combines its own argument, no separate relationship owner exists`
        : `${node.ref} consumes each input as its own value into one accepted turn${evidence.length ? `; the prompt Receipt records ${evidence.length} input fields separately` : ''}; no new relationship truth is owned by a separate convergence owner`;
    } else if (node.role === 'PROJECTION' || node.role === 'RECEIPT') {
      classification = 'CANDIDATE_CONVERGENCE';
      reason = `${node.ref} combines independent truths without a source owner; investigate the rightful owner before adding machinery`;
    } else {
      classification = 'UNKNOWN';
      reason = `join at ${node.role} ${node.ref} is not classified by current source`;
    }
    joins.push({
      joinRef: `join:${node.ref}`,
      consumer: node.ref,
      consumerRole: node.role,
      inputs: inputs.map((edge) => ({ edge: edge.ref, kind: edge.kind, owner: independentOwner(index, edge), gate: edge.detail?.refusalCode ?? null })).sort((a, b) => compare(a.edge, b.edge)),
      independentOwners: owners,
      classification,
      reason,
    });
  }
  const relayInGraph = new Set(graph.nodes.map((node) => node.ref));
  return {
    joins: joins.sort((a, b) => compare(a.joinRef, b.joinRef)),
    relaySources: relaySources.map((source) => ({
      ...source,
      consumedByAnyJoin: relayInGraph.has(source.symbol),
      note: relayInGraph.has(source.symbol)
        ? 'present in the graph'
        : 'not an owner of any classified join; its name alone grants no convergence authority',
    })),
  };
}

// ---- ordinary queries -----------------------------------------------------------------------

// Law cases run anywhere (pure source law). A whole route is DEBT_BLOCKED by its frontier, HELD
// when its deeper steps need a harness this lane does not have.
export function routeReadiness(derivation, { lawProbeAvailable }) {
  const routes = derivation.routes.map((route) => {
    const deeper = route.steps.filter((step) => ['REALIZATION', 'OBSERVATION'].includes(step.step) && step.executionClass);
    let readiness;
    if (route.status === 'FRONTIER_DEBT') readiness = 'DEBT_BLOCKED';
    else if (route.status !== 'CLEARED') readiness = 'HELD';
    else if (!deeper.length) readiness = 'READY_PARALLEL';
    else readiness = deeper.some((step) => step.executionClass === 'E') ? 'READY_SERIAL' : 'HELD';
    return { routeRef: route.routeRef, status: route.status, readiness, deeperClasses: [...new Set(deeper.map((step) => step.executionClass))].sort(compare) };
  });
  const cases = derivation.cases.map((testCase) => ({
    caseRef: testCase.caseRef,
    executionClass: testCase.executionClass,
    readiness: testCase.executionClass === 'A' ? (lawProbeAvailable ? 'READY_PARALLEL' : 'UNAVAILABLE') : 'HELD',
  }));
  const count = (rows) => Object.fromEntries(READINESS.map((name) => [name, rows.filter((row) => row.readiness === name).length]));
  return { routes, cases, routeCounts: count(routes), caseCounts: count(cases) };
}

export function debtDependents(frontier, derivation) {
  return frontier.debt.map((row) => ({
    debtRef: row.ref,
    debtClass: row.debtClass,
    dependentRoutes: derivation.routes
      .filter((route) => route.missing.some((missing) => missing.coordinate === row.coordinate)
        || route.steps.some((step) => step.coordinate === row.coordinate && route.status !== 'CLEARED'))
      .map((route) => route.routeRef)
      .sort(compare),
  })).filter((row) => row.dependentRoutes.length).sort((a, b) => b.dependentRoutes.length - a.dependentRoutes.length || compare(a.debtRef, b.debtRef));
}

// Human-pathway change impact between two graph revisions: which Families / lawful cells / routes
// appeared, disappeared or changed meaning, and which proof is therefore invalid or reusable.
export function diffExperienceGraphs(prior, current, { priorRoutes, currentRoutes } = {}) {
  const edgeKey = (edge) => edge.ref;
  const edgeMeaning = (edge) => JSON.stringify({ guards: edge.guards, whenState: edge.whenState, detail: edge.kind === 'OFFERS' ? edge.detail.availability : null });
  const priorEdges = new Map(prior.edges.map((edge) => [edgeKey(edge), edge]));
  const currentEdges = new Map(current.edges.map((edge) => [edgeKey(edge), edge]));
  const lawKinds = new Set(['OFFERS', 'REQUESTS_EFFECT', 'ADMITS_STATE', 'MANIFESTS', 'CAPTURED_AT_SEND', 'CONSUMED_BY']);
  const added = [...currentEdges.keys()].filter((key) => !priorEdges.has(key) && lawKinds.has(currentEdges.get(key).kind)).sort(compare);
  const removed = [...priorEdges.keys()].filter((key) => !currentEdges.has(key) && lawKinds.has(priorEdges.get(key).kind)).sort(compare);
  const changed = [...currentEdges.keys()].filter((key) => priorEdges.has(key) && lawKinds.has(currentEdges.get(key).kind) && edgeMeaning(priorEdges.get(key)) !== edgeMeaning(currentEdges.get(key))).sort(compare);
  const families = (graph) => new Set(graph.nodes.filter((node) => node.role === 'FAMILY').map((node) => node.ref));
  const priorFamilies = families(prior);
  const currentFamilies = families(current);
  const touched = new Set([...added, ...removed, ...changed]);
  const routeImpact = (routes, side) => (routes ?? []).filter((route) => route.steps.some((step) => touched.has(step.coordinate))
    || touched.has(`edge:OFFERS:${route.steps[0].coordinate}:${route.steps[1].coordinate}`)).map((route) => ({ routeRef: route.routeRef, side }));
  return {
    priorCommit: prior.source.commit,
    currentCommit: current.source.commit,
    familiesAdded: [...currentFamilies].filter((ref) => !priorFamilies.has(ref)).sort(compare),
    familiesRemoved: [...priorFamilies].filter((ref) => !currentFamilies.has(ref)).sort(compare),
    edgesAdded: added,
    edgesRemoved: removed,
    edgesChanged: changed,
    impactedRoutes: [...routeImpact(currentRoutes, 'CURRENT'), ...routeImpact(priorRoutes, 'PRIOR')].sort((a, b) => compare(a.routeRef, b.routeRef)),
    proof: {
      invalidated: 'any probe evidence bound to the prior graph fingerprint for an impacted route',
      reusable: 'law evidence for cells whose OFFERS / REQUESTS_EFFECT / ADMITS_STATE rows are unchanged',
    },
  };
}

// ---- Relay gate over the candidate graph-operations questions --------------------------------

export function evaluateRelayGate({ joins, inputs }) {
  const has = (name) => Boolean(inputs[name]);
  const question = (stage, name, required, consumer, querySufficientBecause) => {
    const missing = required.filter((input) => !has(input));
    let verdict;
    if (missing.length) verdict = 'NOT_EARNED:INPUTS_ABSENT';
    else if (!consumer) verdict = 'NOT_EARNED:NO_CURRENT_CONSUMER';
    else if (querySufficientBecause) verdict = 'NOT_EARNED:QUERY_SUFFICIENT';
    else verdict = 'EARNED';
    return {
      stage,
      question: name,
      requiredInputs: required,
      missingInputs: missing,
      currentConsumer: consumer,
      gate: {
        independentInputOwners: required.filter(has),
        newRelationshipQuestion: name,
        whyQueryInsufficient: querySufficientBecause ? `insufficiency not shown: ${querySufficientBecause}` : 'not established',
        activationOwner: verdict === 'EARNED' ? 'to be named by source' : null,
        durableTruthOutside: 'graph, frontier, manifests and probe evidence remain in their own artifacts',
        relayContractProof: verdict === 'EARNED' ? 'sibling arrival / stale / duplicate / no-op / failure release / deactivation / not-a-ledger' : null,
      },
      verdict,
    };
  };
  const ordinaryOnly = joins.joins.every((join) => join.classification !== 'SOURCE_PROVEN_RELAY');
  return {
    R1: { joins: joins.joins.length, sourceProvenRelays: joins.joins.filter((join) => join.classification === 'SOURCE_PROVEN_RELAY').length, ordinaryOnly },
    questions: [
      question('R2', 'route readiness', ['graph', 'frontier', 'sourceCommit', 'hostLawProbe'], 'law-probe case selection', 'every input is a deterministic projection of one pinned source revision plus one host check; routeReadiness() answers it'),
      question('R2', 'debt frontier', ['graph', 'frontier', 'repairOwnership'], 'fresh workers choosing a frontier', 'debtDependents() answers which routes each debt blocks'),
      question('R2', 'perturbation candidate currentness', ['graph', 'perturbationEvidence'], 'perturbation evidence review', 'evidence currentness is a blob comparison against the graph source'),
      question('R3', 'coverage / proof currentness', ['graph', 'lawEvidence', 'livedEvidence'], 'proof receipt', 'law evidence binds to one graph fingerprint; comparison is a pure query'),
      question('R3', 'execution-plan readiness', ['manifests', 'resourceClaims', 'hostModelAvailability'], null, null),
      question('R4', 'graph change impact', ['priorGraph', 'graph'], 'currentness re-observation of VexLife-Prod main', 'diffExperienceGraphs() answers it over two fixed revisions'),
      question('R4', 'VexBoard inspection', ['graph', 'lawEvidence', 'frontier', 'liveRuntimeProjection'], null, null),
      question('R5', 'release readiness', ['requiredJourneys', 'releaseEvidence', 'livedEvidence'], null, null),
    ],
  };
}

export function deriveConvergence(graph, { frontier, derivation, relaySources = [], inputs, priorGraph = null, priorDerivation = null }) {
  const joins = classifyJoins(graph, { relaySources });
  return {
    schemaVersion: EXPERIENCE_CONVERGENCE_SCHEMA,
    graphFingerprint: graph.fingerprint,
    joins: joins.joins,
    relaySources: joins.relaySources,
    gate: evaluateRelayGate({ joins, inputs }),
    queries: {
      routeReadiness: routeReadiness(derivation, { lawProbeAvailable: Boolean(inputs.hostLawProbe) }),
      debtDependents: debtDependents(frontier, derivation),
      changeImpact: priorGraph ? diffExperienceGraphs(priorGraph, graph, { priorRoutes: priorDerivation?.routes, currentRoutes: derivation.routes }) : null,
    },
  };
}

// [VXG RealForever][VEXWORK][VEXLIFE-PROD][E2E][EXPERIENCE-GRAPH][CONVERGENCE]
