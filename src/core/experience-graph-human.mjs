export const HUMAN_EXPERIENCE_CONVERGENCE_SCHEMA = 'vexwork.experience-human-convergence/v1';

export const HUMAN_EXPERIENCE_STATUSES = Object.freeze([
  'CLEARED',
  'FRONTIER_DEBT',
  'HELD',
  'UNKNOWN',
]);

const CORE_EDGE_KINDS = new Set([
  'OFFERS',
  'MANIFESTS',
  'REQUESTS_EFFECT',
  'ADMITS_STATE',
  'REALIZED_BY',
  'OBSERVES_AS',
  'PROJECTS_TO',
  'CONSUMED_BY',
  'CAPTURED_AT_SEND',
  'RETURNS_TO',
  'CONVERGES_IN',
  'DERIVES_RELATIONSHIP',
]);

const FOCUS_FAMILIES = Object.freeze([
  'VexLifeVisionFamily',
  'VexLifeVoiceInputFamily',
  'VexLifeLanguageFamily',
  'VexLifeContextProfileFamily',
  'VexLifeMemoryReviewFamily',
]);

const compare = (left, right) => (left < right ? -1 : left > right ? 1 : 0);

function pushMissing(rows, predicate, coordinate, detail = null) {
  const key = `${predicate}|${coordinate ?? ''}`;
  if (rows.some((row) => `${row.predicate}|${row.coordinate ?? ''}` === key)) return;
  rows.push(Object.freeze({ predicate, coordinate: coordinate ?? null, detail }));
}

function routeCaseByRef(derivation) {
  return new Map((derivation.cases ?? []).filter((row) => row.routeRef).map((row) => [row.routeRef, row]));
}

function bindingForElements(seed, elementRefs) {
  const refs = new Set(elementRefs ?? []);
  return (seed.surfaceBindings ?? []).find((binding) => refs.has(binding.elementRef)) ?? null;
}

function experienceRoute(route, derivationCase, seed) {
  const missing = (route.missing ?? []).map((row) => Object.freeze({
    predicate: row.predicate,
    coordinate: row.coordinate ?? null,
    detail: row.detail ?? null,
  }));
  const human = (route.steps ?? []).find((step) => step.step === 'HUMAN_ACTION') ?? null;
  const binding = bindingForElements(seed, human?.elementRefs ?? []);
  if (binding && !binding.deterministicActionRef) {
    pushMissing(
      missing,
      'MISSING_DETERMINISTIC_TEST_ACTION',
      binding.elementRef,
      'A stable human element exists, but this convergence has not earned one deterministic action binding for it.',
    );
  }
  for (const deeper of derivationCase?.deeper ?? []) {
    if (deeper.status === 'HELD_NO_HARNESS_IN_LANE') {
      pushMissing(
        missing,
        'MISSING_DEEPER_EXECUTION_HARNESS',
        deeper.coordinate,
        `${deeper.step} is structurally known but not executable in this lane's proof harness.`,
      );
    }
  }

  let experienceStatus = route.status;
  if (experienceStatus === 'CLEARED' && missing.length) experienceStatus = 'FRONTIER_DEBT';
  return Object.freeze({
    routeRef: route.routeRef,
    family: route.family,
    structuralStatus: route.status,
    experienceStatus,
    missing: Object.freeze(missing),
    pathwayRef: route.pathwayRef ?? null,
  });
}

function pathBetween(graph, from, to, maxDepth = 8) {
  if (from === to) return [];
  const outgoing = new Map();
  for (const edge of graph.edges ?? []) {
    const rows = outgoing.get(edge.from) ?? [];
    rows.push(edge);
    outgoing.set(edge.from, rows);
  }
  const queue = [{ ref: from, path: [] }];
  const seen = new Set([from]);
  while (queue.length) {
    const current = queue.shift();
    if (current.path.length >= maxDepth) continue;
    for (const edge of outgoing.get(current.ref) ?? []) {
      const nextPath = [...current.path, edge.ref ?? `${edge.kind}:${edge.from}:${edge.to}`];
      if (edge.to === to) return nextPath;
      if (!seen.has(edge.to)) {
        seen.add(edge.to);
        queue.push({ ref: edge.to, path: nextPath });
      }
    }
  }
  return null;
}

function relationshipAssessment(graph, row) {
  const exact = (graph.edges ?? []).find((edge) => edge.kind === row.kind && edge.from === row.from && edge.to === row.to) ?? null;
  if (exact) {
    return Object.freeze({ ...row, coverage: 'DERIVED_EXACT', graphEdgeRef: exact.ref ?? null, graphPath: [] });
  }
  const path = pathBetween(graph, row.from, row.to);
  if (path) {
    return Object.freeze({ ...row, coverage: 'DERIVED_PATH', graphEdgeRef: null, graphPath: Object.freeze(path) });
  }
  const held = String(row.disposition ?? '').startsWith('HELD');
  return Object.freeze({
    ...row,
    coverage: held
      ? 'HELD_SOURCE_RELATIONSHIP'
      : CORE_EDGE_KINDS.has(row.kind)
        ? 'CURATED_SOURCE_RELATIONSHIP'
        : 'CURATED_HUMAN_RELATIONSHIP',
    graphEdgeRef: null,
    graphPath: null,
  });
}

function familySummary(family, routeRows) {
  const routes = routeRows.filter((route) => route.family === family);
  const count = (key, value) => routes.filter((route) => route[key] === value).length;
  return Object.freeze({
    family,
    routeCount: routes.length,
    structural: Object.freeze(Object.fromEntries(HUMAN_EXPERIENCE_STATUSES.map((status) => [status, count('structuralStatus', status)]))),
    experience: Object.freeze(Object.fromEntries(HUMAN_EXPERIENCE_STATUSES.map((status) => [status, count('experienceStatus', status)]))),
  });
}

function journeyStatus(journey, routeRows, relationships, derivation) {
  const refs = new Set(journey.coordinateRefs ?? []);
  const named = journey.journeyRef;
  let routes = [];
  if (named === 'journey.vision.engage-stop') routes = routeRows.filter((route) => route.family === 'VexLifeVisionFamily');
  else if (named === 'journey.voice.spoken-composer-reply-separation') {
    routes = routeRows.filter((route) => ['VexLifeVoiceInputFamily', 'VexLifeLanguageFamily'].includes(route.family));
  } else if (named === 'journey.context.profile-next-turn') routes = routeRows.filter((route) => route.family === 'VexLifeContextProfileFamily');
  else if (named.startsWith('journey.memory.')) routes = routeRows.filter((route) => route.family === 'VexLifeMemoryReviewFamily');
  else if (named.includes('context-share')) {
    const browserJourney = (derivation.journeys ?? []).find((row) => JSON.stringify(row).includes('browserContext')) ?? null;
    const missing = [...(browserJourney?.missing ?? [])];
    if (!missing.some((row) => row.predicate === 'MISSING_DETERMINISTIC_TEST_ACTION')) {
      missing.push({ predicate: 'MISSING_DETERMINISTIC_TEST_ACTION', coordinate: 'element.vexlife-workspace.companion.conversation.context-share' });
    }
    return Object.freeze({
      ...journey,
      status: browserJourney?.status ?? 'FRONTIER_DEBT',
      routeRefs: Object.freeze([]),
      missing: Object.freeze(missing),
      note: 'Human navigation/invalidation meaning remains curated until the Product exposes a complete typed route and deterministic browser action seam.',
    });
  } else if (named === 'journey.conversation.source-return-host-truth') {
    const sourceReturn = relationships.find((row) => row.from === 'DirectConversationSourceReturn' && row.to === 'DirectPromptContext') ?? null;
    return Object.freeze({
      ...journey,
      status: sourceReturn?.coverage === 'DERIVED_EXACT' || sourceReturn?.coverage === 'DERIVED_PATH' ? 'CLEARED' : 'FRONTIER_DEBT',
      routeRefs: Object.freeze([]),
      missing: Object.freeze(sourceReturn?.coverage?.startsWith('DERIVED') ? [] : [{ predicate: 'SOURCE_RETURN_RELATIONSHIP_NOT_MECHANICALLY_DERIVED', coordinate: 'DirectConversationSourceReturn' }]),
      note: 'Protocol availability and host lookup execution remain separate truths.',
    });
  } else if (refs.size) {
    routes = routeRows.filter((route) => (route.missing ?? []).some((row) => refs.has(row.coordinate)));
  }

  if (!routes.length) {
    return Object.freeze({ ...journey, status: 'UNKNOWN', routeRefs: Object.freeze([]), missing: Object.freeze([{ predicate: 'NO_MECHANICAL_ROUTE_SELECTED_YET', coordinate: null }]) });
  }
  const status = routes.every((route) => route.experienceStatus === 'CLEARED')
    ? 'CLEARED'
    : routes.some((route) => route.experienceStatus === 'HELD')
      ? 'HELD'
      : routes.some((route) => route.experienceStatus === 'UNKNOWN')
        ? 'UNKNOWN'
        : 'FRONTIER_DEBT';
  const missing = [];
  for (const route of routes) for (const row of route.missing) pushMissing(missing, row.predicate, row.coordinate, row.detail);
  return Object.freeze({
    ...journey,
    status,
    routeRefs: Object.freeze(routes.map((route) => route.routeRef).sort(compare)),
    missing: Object.freeze(missing.sort((a, b) => compare(`${a.predicate}|${a.coordinate}`, `${b.predicate}|${b.coordinate}`))),
  });
}

export function deriveHumanExperienceConvergence(graph, derivation, seed) {
  if (!graph || !Array.isArray(graph.edges)) throw new TypeError('human convergence requires one Experience Relationship Graph');
  if (!derivation || !Array.isArray(derivation.routes)) throw new TypeError('human convergence requires route derivation');
  if (!seed || !Array.isArray(seed.journeySeeds) || !Array.isArray(seed.crossOwnerRows)) throw new TypeError('human convergence requires the relationship lattice seed');

  const cases = routeCaseByRef(derivation);
  const routeRows = derivation.routes.map((route) => experienceRoute(route, cases.get(route.routeRef), seed));
  const relationships = seed.crossOwnerRows.map((row) => relationshipAssessment(graph, row));
  const journeys = seed.journeySeeds.map((journey) => journeyStatus(journey, routeRows, relationships, derivation));
  const focusFamilies = FOCUS_FAMILIES.map((family) => familySummary(family, routeRows)).filter((row) => row.routeCount > 0);
  const relationshipCounts = {};
  for (const row of relationships) relationshipCounts[row.coverage] = (relationshipCounts[row.coverage] ?? 0) + 1;

  return Object.freeze({
    schemaVersion: HUMAN_EXPERIENCE_CONVERGENCE_SCHEMA,
    productSource: graph.source ?? null,
    humanSeed: Object.freeze({
      projectRef: seed.projectRef ?? null,
      observedMain: seed.currentness?.vexLifeProdMain ?? null,
      experienceCandidate: seed.sourceBindings?.experienceCandidate ?? null,
    }),
    routeSemantics: Object.freeze({
      structural: 'Can the source topology form the route?',
      experience: 'Can this lane execute and prove the human route end to end without inventing a seam?',
    }),
    routes: Object.freeze(routeRows),
    focusFamilies: Object.freeze(focusFamilies),
    relationships: Object.freeze(relationships),
    relationshipCounts: Object.freeze(relationshipCounts),
    journeys: Object.freeze(journeys),
    loops: Object.freeze([...(seed.loopSeeds ?? [])]),
  });
}

export function renderHumanExperienceConvergence(result) {
  const lines = [];
  lines.push('VexLife-Prod Experience Graph convergence');
  lines.push(`Product: ${result.productSource?.commit ?? 'unknown'}`);
  lines.push('');
  lines.push('What the two statuses mean:');
  lines.push('  structural = source relationships can be drawn truthfully');
  lines.push('  experience = a human can actually run/prove the route in this lane');
  lines.push('');
  lines.push('Focus families:');
  for (const row of result.focusFamilies) {
    lines.push(`  ${row.family}: structural CLEARED ${row.structural.CLEARED}/${row.routeCount}; experience CLEARED ${row.experience.CLEARED}/${row.routeCount}; experience debt ${row.experience.FRONTIER_DEBT}`);
  }
  lines.push('');
  lines.push('Human journeys:');
  for (const journey of result.journeys.filter((row) => row.status !== 'UNKNOWN')) {
    lines.push(`  ${journey.status.padEnd(13)} ${journey.journeyRef}`);
    for (const missing of (journey.missing ?? []).slice(0, 3)) lines.push(`    - ${missing.predicate}${missing.coordinate ? ` @ ${missing.coordinate}` : ''}`);
  }
  lines.push('');
  lines.push('Curated relationship coverage:');
  for (const [kind, count] of Object.entries(result.relationshipCounts).sort(([a], [b]) => compare(a, b))) lines.push(`  ${kind}: ${count}`);
  return `${lines.join('\n')}\n`;
}

// [VXG RealForever][VEXWORK][VEXLIFE-PROD][E2E][EXPERIENCE-CONVERGENCE]
