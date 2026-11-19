export const RELATIONSHIP_LATTICE_SEED_SCHEMA = 'vexlife-prod.e2e-relationship-lattice-seed/v2';
export const E2E_ROUTE_MANIFEST_SCHEMA = 'vexlife-prod.e2e-route-manifest/v1';

const CURRENT_DISPOSITIONS = new Set([
  'CURRENT_MAIN',
  'CURRENT_MAIN_PLUS_ACTIVE_EVOLUTION',
  'CURRENT_MAIN_HELD_CONNECTOR',
]);

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function add(errors, condition, message) {
  if (!condition) errors.push(message);
}

function currentCoordinateMap(seed) {
  return new Map((seed.coordinates ?? []).map((coordinate) => [coordinate.coordinate, coordinate]));
}

function vexLifeProdPullNumber(ref) {
  const match = /^github\.pull\.vexlife-prod\.(\d+)$/u.exec(ref ?? '');
  return match ? match[1] : null;
}

export function validateRelationshipLatticeSeed(seed) {
  const errors = [];
  add(errors, isObject(seed), 'seed must be one object');
  if (!isObject(seed)) return Object.freeze({ ok: false, errors: Object.freeze(errors) });

  add(errors, seed.schemaVersion === RELATIONSHIP_LATTICE_SEED_SCHEMA, 'relationship lattice seed schema mismatch');
  add(errors, isObject(seed.sourceBindings), 'sourceBindings must be one object');
  add(errors, isObject(seed.currentness), 'currentness must be one object');

  if (isObject(seed.sourceBindings) && isObject(seed.currentness)) {
    add(
      errors,
      seed.sourceBindings.vexLifeProdMain === seed.currentness.vexLifeProdMain,
      'sourceBindings.vexLifeProdMain must equal currentness.vexLifeProdMain',
    );

    const merged = new Set(Object.keys(seed.currentness.mergedPressure ?? {}));
    const activeProductCandidates = new Set();
    for (const candidate of seed.sourceBindings.activeCandidates ?? []) {
      const number = vexLifeProdPullNumber(candidate.ref);
      if (!number) continue;
      activeProductCandidates.add(number);
      if (merged.has(number)) {
        errors.push(`merged VexLife-Prod PR ${candidate.ref} cannot remain in sourceBindings.activeCandidates`);
      }
    }
    for (const number of Object.keys(seed.currentness.activePressure ?? {})) {
      if (!activeProductCandidates.has(number)) {
        errors.push(`current active VexLife-Prod PR github.pull.vexlife-prod.${number} is missing from sourceBindings.activeCandidates`);
      }
    }
  }

  const coordinates = seed.coordinates ?? [];
  add(errors, Array.isArray(coordinates), 'coordinates must be an array');
  const refs = coordinates.map((coordinate) => coordinate.coordinate);
  add(errors, refs.every((ref) => typeof ref === 'string' && ref.length > 0), 'every coordinate needs one stable coordinate');
  add(errors, new Set(refs).size === refs.length, 'coordinate identities must be unique');

  for (const coordinate of coordinates) {
    if (coordinate.disposition === 'ACTIVE_CANDIDATE') {
      add(
        errors,
        typeof coordinate.sourceRef === 'string' && coordinate.sourceRef.length > 0,
        `${coordinate.coordinate} ACTIVE_CANDIDATE requires sourceRef`,
      );
    }
  }

  const byCoordinate = currentCoordinateMap(seed);
  for (const example of seed.postMapPerturbationPolicy?.sourceExamples ?? []) {
    const coordinate = byCoordinate.get(example.source);
    if (!coordinate) continue;
    if (CURRENT_DISPOSITIONS.has(coordinate.disposition) || coordinate.disposition === 'ACTIVE_CANDIDATE') {
      add(
        errors,
        example.disposition === coordinate.disposition,
        `${example.source} perturbation disposition must match coordinate disposition`,
      );
    }
  }

  const journeyRefs = (seed.journeySeeds ?? []).map((journey) => journey.journeyRef);
  add(errors, new Set(journeyRefs).size === journeyRefs.length, 'journeyRef values must be unique');
  const loopRefs = (seed.loopSeeds ?? []).map((loop) => loop.loopRef);
  add(errors, new Set(loopRefs).size === loopRefs.length, 'loopRef values must be unique');

  return Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) });
}

function requireValidSeed(seed) {
  const validation = validateRelationshipLatticeSeed(seed);
  if (!validation.ok) throw new TypeError(validation.errors.join('\n'));
  return seed;
}

function routeCoordinate(seed, ref) {
  return (seed.coordinates ?? []).find((coordinate) => coordinate.coordinate === ref) ?? null;
}

function routeSurfaceBindings(seed, coordinateRefs) {
  const refSet = new Set(coordinateRefs);
  return (seed.surfaceBindings ?? []).filter(
    (binding) => refSet.has(binding.elementRef) || (binding.currentPathwayRef && refSet.has(binding.currentPathwayRef)),
  );
}

function routeRelationships(seed, coordinateRefs, surfaceBindings) {
  const refSet = new Set(coordinateRefs);
  for (const binding of surfaceBindings) {
    refSet.add(binding.elementRef);
    if (binding.currentPathwayRef) refSet.add(binding.currentPathwayRef);
    for (const downstream of binding.runtimeRelationship?.downstreamCoordinates ?? []) refSet.add(downstream);
  }
  return (seed.crossOwnerRows ?? []).filter(
    (relationship) => refSet.has(relationship.from) || refSet.has(relationship.to),
  );
}

function routeActions(surfaceBindings) {
  return surfaceBindings.map((binding) => Object.freeze({
    action: 'ACTIVATE_ELEMENT',
    elementRef: binding.elementRef,
    pathwayRefOrNull: binding.currentPathwayRef ?? null,
    humanMeaning: binding.humanControlMeaning ?? binding.runtimeRelationship?.humanControlMeaning ?? null,
    executionBindingRefOrNull: binding.deterministicActionRef ?? null,
  }));
}

function routeEvidence(surfaceBindings) {
  const evidence = [];
  for (const binding of surfaceBindings) {
    for (const coordinate of binding.runtimeRelationship?.downstreamCoordinates ?? []) {
      if (coordinate.includes('Receipt') || coordinate.includes('receipt')) evidence.push(coordinate);
    }
  }
  return [...new Set(evidence)].sort();
}

export function deriveJourneyRouteManifest(seedInput, journeyRef) {
  const seed = requireValidSeed(seedInput);
  const journey = (seed.journeySeeds ?? []).find((candidate) => candidate.journeyRef === journeyRef);
  if (!journey) throw new TypeError(`unknown journeyRef ${journeyRef}`);

  const coordinateRefs = [...(journey.coordinateRefs ?? [])];
  if (!coordinateRefs.length) throw new TypeError(`journey ${journeyRef} has no coordinateRefs`);
  const coordinateDetails = coordinateRefs.map((ref) => routeCoordinate(seed, ref)).filter(Boolean);
  const surfaceBindings = routeSurfaceBindings(seed, coordinateRefs);
  const relationships = routeRelationships(seed, coordinateRefs, surfaceBindings);

  const missingCoordinates = coordinateRefs.filter((ref) => !routeCoordinate(seed, ref));
  const actions = routeActions(surfaceBindings);
  const evidenceRefs = routeEvidence(surfaceBindings);
  const missingPredicates = [];
  if (missingCoordinates.length) missingPredicates.push('MISSING_GRAPH_COORDINATE');
  if (!actions.length || actions.some((action) => action.executionBindingRefOrNull === null)) {
    missingPredicates.push('MISSING_DETERMINISTIC_TEST_ACTION');
  }
  if (!relationships.length) missingPredicates.push('MISSING_RELATIONSHIP_EDGE');
  const routeStatus = missingPredicates.length ? 'FRONTIER_DEBT' : 'CLEARED';

  const availabilityPredicates = [
    ...new Set(coordinateDetails.flatMap((coordinate) => coordinate.availabilityPredicates ?? [])),
  ];
  const downstreamCoordinates = [
    ...new Set(surfaceBindings.flatMap((binding) => binding.runtimeRelationship?.downstreamCoordinates ?? [])),
  ].sort();

  return Object.freeze({
    schemaVersion: E2E_ROUTE_MANIFEST_SCHEMA,
    routeRef: `route.${journeyRef.slice('journey.'.length)}`,
    journeyRef,
    sourceBinding: Object.freeze({
      vexLifeProdMain: seed.currentness.vexLifeProdMain,
      observedAt: seed.currentness.observedAt,
      latticeRef: seed.latticeRef,
    }),
    humanOutcome: journey.humanOutcome,
    disposition: journey.disposition,
    routeStatus,
    missingPredicates: Object.freeze(missingPredicates),
    coordinateRefs: Object.freeze(coordinateRefs),
    availabilityPredicates: Object.freeze(availabilityPredicates),
    actions: Object.freeze(actions),
    relationships: Object.freeze(
      relationships.map((relationship) => Object.freeze({
        from: relationship.from,
        to: relationship.to,
        kind: relationship.kind,
        disposition: relationship.disposition,
        humanMeaning: relationship.humanMeaning,
      })),
    ),
    downstreamCoordinates: Object.freeze(downstreamCoordinates),
    expectedEvidenceRefs: Object.freeze(evidenceRefs),
    executionClass: 'DETERMINISTIC_NERVOUS_SYSTEM',
  });
}

// [VXG RealForever][VEXWORK][VEXLIFE-PROD][E2E][RELATIONSHIP-GRAPH]
