import { normalizeBoardGraph } from '../../src/shared/vexboard-model.mjs';
import {
  advanceBoardJourney,
  createBoardJourney,
  journeyChoices,
} from '../../src/shared/vexboard-journey.mjs';

export const RELATIONSHIP_LATTICE_SEED_SCHEMA = 'vexlife-prod.e2e-relationship-lattice-seed/v2';
export const EXPERIENCE_RELATIONSHIP_GRAPH_SCHEMA = 'vexlife-prod.experience-relationship-graph/v1';
export const E2E_ROUTE_MANIFEST_SCHEMA = 'vexlife-prod.e2e-route-manifest/v1';

export const EXPERIENCE_RELATIONSHIP_EDGE_KINDS = Object.freeze([
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

const CURRENT_DISPOSITIONS = new Set([
  'CURRENT_MAIN',
  'CURRENT_MAIN_PLUS_ACTIVE_EVOLUTION',
  'CURRENT_MAIN_HELD_CONNECTOR',
]);

const STABLE_REF = /^[A-Za-z0-9][A-Za-z0-9._:/-]*$/u;

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function add(errors, condition, message) {
  if (!condition) errors.push(message);
}

function stableRefOrNull(value) {
  return typeof value === 'string' && STABLE_REF.test(value) ? value : null;
}

function sourceSymbolOrNull(value) {
  if (typeof value !== 'string') return null;
  const direct = stableRefOrNull(value);
  if (direct) return direct;
  const call = /^([A-Za-z0-9][A-Za-z0-9._:/-]*)\s*\(/u.exec(value);
  return call ? call[1] : null;
}

function currentCoordinateMap(seed) {
  return new Map((seed.coordinates ?? []).map((coordinate) => [coordinate.coordinate, coordinate]));
}

function vexLifeProdPullNumber(ref) {
  const match = /^github\.pull\.vexlife-prod\.(\d+)$/u.exec(ref ?? '');
  return match ? match[1] : null;
}

function coordinateSourceRefs(seed, ref) {
  const coordinate = currentCoordinateMap(seed).get(ref);
  if (!coordinate) return [];
  return [
    stableRefOrNull(coordinate.sourceRef),
    coordinate.sourcePath ? `repo.vexlife-prod:${coordinate.sourcePath}` : null,
  ].filter(Boolean);
}

function familySourceRefs(seed, family) {
  return coordinateSourceRefs(seed, family);
}

function relationshipContext(row) {
  return Object.freeze({
    family: row.family,
    currentState: row.currentState,
    control: row.control,
  });
}

function canonicalCrossOwnerKind(kind) {
  if (EXPERIENCE_RELATIONSHIP_EDGE_KINDS.includes(kind)) return kind;
  if (
    [
      'OBSERVES_PREREQUISITES',
      'SELECTED_RUNTIME_SHAPES_TURN',
      'ACCEPTED_MEANING_BECOMES_MEMORY_INPUT',
      'MATERIALIZES_IN_PROMPT',
      'PRIVATE_GAPS_SHAPE_PERSON_CONTEXT',
      'EDITS_COMPOSER_NOT_SEND',
      'CONFIGURES_RECOGNITION',
      'FORMS_EDITABLE_REQUEST_TEXT',
      'READ_ONLY_CONSUMPTION',
    ].includes(kind)
  ) {
    return 'CONSUMED_BY';
  }
  if (kind === 'MUTABLE_CURRENT_CAPTURE') return 'CAPTURED_AT_SEND';
  if (
    [
      'CHRONOLOGY_PROJECTION_ONLY',
      'PROJECTS_HUMAN_ALERT',
      'PROJECTS_SELECTED_SCOPE_CONTROL',
      'COMPLETED_RECEIPT_PROJECTED',
    ].includes(kind)
  ) {
    return 'PROJECTS_TO';
  }
  return null;
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
      seed.sourceBindings.vexlifeProdMain === seed.currentness.vexLifeProdMain,
      'sourceBindings.vexlifeProdMain must equal currentness.vexLifeProdMain',
    );
    add(
      errors,
      !Object.prototype.hasOwnProperty.call(seed.sourceBindings, 'vexLifeProdMain'),
      'sourceBindings must not carry a second differently-cased vexLifeProdMain alias',
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

function graphNodeRoleForCoordinate(coordinateClass) {
  if (coordinateClass === 'ELEMENT') return 'ELEMENT';
  if (coordinateClass === 'PATHWAY') return 'PATHWAY';
  if (coordinateClass === 'FAMILY_OR_SEMANTIC_OWNER') return 'FAMILY';
  if (coordinateClass === 'PROJECTION_OWNER') return 'PROJECTION';
  return 'OWNER';
}

function semanticRelationshipKey(relationship) {
  return JSON.stringify([
    relationship.kind,
    relationship.fromRef,
    relationship.toRef,
    relationship.context,
    relationship.predicate,
    relationship.disposition,
  ]);
}

export function formExperienceRelationshipGraph(seedInput) {
  const seed = requireValidSeed(seedInput);
  const nodes = new Map();
  const relationships = new Map();
  const debts = [];

  function addNode(nodeRef, role, label = nodeRef, sourceRefs = []) {
    if (!stableRefOrNull(nodeRef)) {
      debts.push(Object.freeze({
        debtClass: 'MISSING_GRAPH_COORDINATE',
        coordinateRefs: Object.freeze([String(nodeRef)]),
        detail: `graph node is not stably addressable: ${nodeRef}`,
        sourceRefs: Object.freeze(sourceRefs.filter(Boolean)),
      }));
      return null;
    }
    if (!nodes.has(nodeRef)) {
      nodes.set(nodeRef, Object.freeze({
        nodeRef,
        role,
        label,
        sourceRefs: Object.freeze([...new Set(sourceRefs.filter(Boolean))].sort()),
      }));
    }
    return nodeRef;
  }

  function addRelationship(relationship) {
    if (!EXPERIENCE_RELATIONSHIP_EDGE_KINDS.includes(relationship.kind)) {
      throw new TypeError(`unsupported experience relationship kind ${relationship.kind}`);
    }
    if (!nodes.has(relationship.fromRef) || !nodes.has(relationship.toRef)) {
      debts.push(Object.freeze({
        debtClass: 'MISSING_GRAPH_COORDINATE',
        coordinateRefs: Object.freeze([relationship.fromRef, relationship.toRef]),
        detail: `${relationship.kind} relationship endpoint is not addressable`,
        sourceRefs: Object.freeze(relationship.sourceRefs ?? []),
      }));
      return;
    }
    const normalized = Object.freeze({
      kind: relationship.kind,
      fromRef: relationship.fromRef,
      toRef: relationship.toRef,
      predicate: relationship.predicate ?? null,
      context: relationship.context ?? null,
      disposition: relationship.disposition ?? 'CURRENT_SOURCE_RELATIONSHIP',
      humanMeaning: relationship.humanMeaning ?? null,
      sourceRefs: Object.freeze([...new Set(relationship.sourceRefs ?? [])].sort()),
    });
    relationships.set(semanticRelationshipKey(normalized), normalized);
  }

  for (const coordinate of seed.coordinates ?? []) {
    addNode(
      coordinate.coordinate,
      graphNodeRoleForCoordinate(coordinate.coordinateClass),
      coordinate.humanMeaning ?? coordinate.coordinate,
      coordinateSourceRefs(seed, coordinate.coordinate),
    );
    if (coordinate.investigationNote) {
      debts.push(Object.freeze({
        debtClass: 'SCREEN_LENS_DEPTH_GAP',
        coordinateRefs: Object.freeze([coordinate.coordinate]),
        detail: coordinate.investigationNote,
        sourceRefs: Object.freeze(coordinateSourceRefs(seed, coordinate.coordinate)),
      }));
    }
  }

  for (const row of seed.familyLawRows ?? []) {
    const sources = familySourceRefs(seed, row.family);
    const stateRef = addNode(`${row.family}.State`, 'STATE', `${row.family} State`, sources);
    const controlRef = addNode(`${row.family}.Control`, 'CONTROL', `${row.family} Control`, sources);
    const effectSymbol = sourceSymbolOrNull(row.act?.effect);
    const effectRef = effectSymbol
      ? addNode(effectSymbol, 'EFFECT', row.act.effect, sources)
      : null;
    if (row.act?.effect && !effectRef) {
      debts.push(Object.freeze({
        debtClass: 'MISSING_GRAPH_COORDINATE',
        coordinateRefs: Object.freeze([row.act.effect]),
        detail: `Effect source coordinate is not stably addressable: ${row.act.effect}`,
        sourceRefs: Object.freeze(sources),
      }));
    }
    const observationSymbol = stableRefOrNull(row.observationRef) ?? sourceSymbolOrNull(row.observation);
    const observationRef = observationSymbol
      ? addNode(observationSymbol, 'OBSERVATION', row.observation, sources)
      : null;
    if (row.observation && !observationRef) {
      debts.push(Object.freeze({
        debtClass: 'MISSING_OBSERVATION_EDGE',
        coordinateRefs: Object.freeze([row.family]),
        detail: row.observation,
        sourceRefs: Object.freeze(sources),
      }));
    }
    const projectionSymbol = sourceSymbolOrNull(row.projection);
    const projectionRef = projectionSymbol
      ? addNode(projectionSymbol, 'PROJECTION', row.projection, sources)
      : null;
    if (row.projection && !projectionRef) {
      debts.push(Object.freeze({
        debtClass: 'MISSING_PROJECTION_EDGE',
        coordinateRefs: Object.freeze([row.family]),
        detail: row.projection,
        sourceRefs: Object.freeze(sources),
      }));
    }
    const realizationSources = [
      ...sources,
      row.realizationSourcePath ? `repo.vexlife-prod:${row.realizationSourcePath}` : null,
    ].filter(Boolean);
    const realizationRef = row.realizationRef
      ? addNode(row.realizationRef, 'REALIZATION', row.realizationBoundary ?? row.realizationRef, realizationSources)
      : null;
    const context = relationshipContext(row);
    const predicate = Object.freeze({
      currentState: row.currentState,
      control: row.control,
    });

    if (stateRef && controlRef) {
      addRelationship({
        kind: 'OFFERS',
        fromRef: stateRef,
        toRef: controlRef,
        predicate,
        context,
        sourceRefs: sources,
        humanMeaning: row.semanticMeaning,
      });
    }
    if (controlRef && effectRef) {
      addRelationship({
        kind: 'REQUESTS_EFFECT',
        fromRef: controlRef,
        toRef: effectRef,
        predicate,
        context,
        sourceRefs: sources,
        humanMeaning: row.semanticMeaning,
      });
    }
    if (controlRef && stateRef && row.act?.admittedState) {
      addRelationship({
        kind: 'ADMITS_STATE',
        fromRef: controlRef,
        toRef: stateRef,
        predicate: Object.freeze({ admittedState: row.act.admittedState }),
        context,
        sourceRefs: sources,
      });
    }
    if (effectRef) {
      if (realizationRef) {
        addRelationship({
          kind: 'REALIZED_BY',
          fromRef: effectRef,
          toRef: realizationRef,
          context,
          sourceRefs: realizationSources,
          humanMeaning: row.realizationBoundary,
        });
      } else {
        debts.push(Object.freeze({
          debtClass: 'MISSING_REALIZATION_EDGE',
          coordinateRefs: Object.freeze([effectRef]),
          detail: row.realizationBoundary ?? `${effectRef} has no stable realization coordinate`,
          sourceRefs: Object.freeze(sources),
        }));
      }
    }
    if (realizationRef && observationRef) {
      addRelationship({
        kind: 'RETURNS_TO',
        fromRef: realizationRef,
        toRef: observationRef,
        context,
        sourceRefs: realizationSources,
        humanMeaning: 'Outside/runtime realization returns through the Family observation boundary.',
      });
    }
    if (observationRef && stateRef) {
      addRelationship({
        kind: 'OBSERVES_AS',
        fromRef: observationRef,
        toRef: stateRef,
        predicate: Object.freeze({
          possibleObservedSuccessors: row.possibleObservedSuccessors ?? [],
        }),
        context,
        sourceRefs: sources,
      });
    }
    if (stateRef && projectionRef) {
      addRelationship({
        kind: 'PROJECTS_TO',
        fromRef: stateRef,
        toRef: projectionRef,
        context,
        sourceRefs: sources,
      });
    }
  }

  const coordinateByRef = currentCoordinateMap(seed);
  for (const binding of seed.surfaceBindings ?? []) {
    const elementSources = coordinateSourceRefs(seed, binding.elementRef);
    const elementRef = addNode(binding.elementRef, 'ELEMENT', binding.humanControlMeaning ?? binding.elementRef, elementSources);
    if (binding.currentPathwayRef) {
      addNode(
        binding.currentPathwayRef,
        'PATHWAY',
        coordinateByRef.get(binding.currentPathwayRef)?.humanMeaning ?? binding.currentPathwayRef,
        coordinateSourceRefs(seed, binding.currentPathwayRef),
      );
    }

    const semanticOwner = binding.semanticOwner;
    const semanticCoordinate = semanticOwner ? coordinateByRef.get(semanticOwner) : null;
    if (elementRef && semanticCoordinate?.coordinateClass === 'FAMILY_OR_SEMANTIC_OWNER') {
      const controlRef = addNode(
        `${semanticOwner}.Control`,
        'CONTROL',
        `${semanticOwner} Control`,
        coordinateSourceRefs(seed, semanticOwner),
      );
      if (controlRef) {
        addRelationship({
          kind: 'MANIFESTS',
          fromRef: elementRef,
          toRef: controlRef,
          sourceRefs: [...elementSources, ...coordinateSourceRefs(seed, semanticOwner)],
          humanMeaning: binding.humanControlMeaning,
        });
      }
    } else if (elementRef && binding.runtimeRelationship) {
      debts.push(Object.freeze({
        debtClass: 'MISSING_MANIFESTATION_BINDING',
        coordinateRefs: Object.freeze([binding.elementRef]),
        detail: 'stable human element exists, but its deeper runtime relationship is not bound to a source-owned Control/semantic coordinate',
        sourceRefs: Object.freeze(elementSources),
      }));
    }

    for (const stateCoordinate of binding.runtimeRelationship?.currentStateCoordinates ?? []) {
      addNode(stateCoordinate, 'STATE', stateCoordinate, elementSources);
    }
    for (const downstreamCoordinate of [
      ...(binding.runtimeRelationship?.downstreamCoordinates ?? []),
      ...(binding.downstreamCoordinates ?? []),
    ]) {
      addNode(downstreamCoordinate, 'OWNER', downstreamCoordinate, elementSources);
    }

  }

  for (const row of seed.crossOwnerRows ?? []) {
    const canonicalKind = canonicalCrossOwnerKind(row.kind);
    const fromRef = stableRefOrNull(row.from);
    const toRef = stableRefOrNull(row.to);
    const sources = [
      ...coordinateSourceRefs(seed, row.from),
      ...coordinateSourceRefs(seed, row.to),
      stableRefOrNull(row.sourceRef),
    ].filter(Boolean);

    if (!fromRef || !toRef) {
      debts.push(Object.freeze({
        debtClass: 'MISSING_GRAPH_COORDINATE',
        coordinateRefs: Object.freeze([String(row.from), String(row.to)]),
        detail: `cross-owner row ${row.kind} does not have stable endpoint coordinates`,
        sourceRefs: Object.freeze([...new Set(sources)].sort()),
      }));
      continue;
    }
    addNode(fromRef, 'OWNER', fromRef, coordinateSourceRefs(seed, row.from));
    addNode(toRef, 'OWNER', toRef, coordinateSourceRefs(seed, row.to));

    if (!canonicalKind) {
      debts.push(Object.freeze({
        debtClass: 'MISSING_SEMANTIC_EDGE',
        coordinateRefs: Object.freeze([fromRef, toRef]),
        detail: `cross-owner row ${row.kind} is not yet normalized to an Experience Relationship Graph edge without changing its meaning`,
        sourceRefs: Object.freeze([...new Set(sources)].sort()),
      }));
      continue;
    }

    addRelationship({
      kind: canonicalKind,
      fromRef,
      toRef,
      disposition: row.disposition,
      humanMeaning: row.humanMeaning,
      sourceRefs: sources,
      predicate: Object.freeze({ sourceRelationshipKind: row.kind }),
    });
  }

  return Object.freeze({
    schemaVersion: EXPERIENCE_RELATIONSHIP_GRAPH_SCHEMA,
    graphRef: seed.latticeRef,
    sourceBinding: Object.freeze({
      vexLifeProdMain: seed.currentness.vexLifeProdMain,
      observedAt: seed.currentness.observedAt,
      projectRef: seed.projectRef,
    }),
    nodes: Object.freeze([...nodes.values()].sort((a, b) => a.nodeRef.localeCompare(b.nodeRef))),
    relationships: Object.freeze([...relationships.values()].sort((a, b) =>
      semanticRelationshipKey(a).localeCompare(semanticRelationshipKey(b)))),
    debts: Object.freeze([...debts].sort((a, b) =>
      JSON.stringify(a).localeCompare(JSON.stringify(b)))),
  });
}

function boardNodeKind(role) {
  if (role === 'ELEMENT' || role === 'CONTROL') return 'CONTROL';
  if (role === 'STATE') return 'DECISION';
  if (role === 'EFFECT' || role === 'REALIZATION') return 'PROCESS';
  if (role === 'OBSERVATION') return 'ARTIFACT';
  if (role === 'FAMILY') return 'CONTAINER';
  return 'REFERENCE';
}

function boardRelationshipKind(kind) {
  if (['ADMITS_STATE', 'OBSERVES_AS'].includes(kind)) return 'TRANSITION';
  if (['CONSUMED_BY', 'CAPTURED_AT_SEND'].includes(kind)) return 'DATA';
  if (['MANIFESTS', 'PROJECTS_TO', 'CONVERGES_IN', 'DERIVES_RELATIONSHIP'].includes(kind)) return 'REFERENCE';
  return 'FLOW';
}

/**
 * Project the source-coordinate relationship tuples into the existing VexBoard traversal contract.
 *
 * BoardGraph requires a relationshipRef for navigation. The numbered refs formed below are therefore
 * projection-only traversal handles. They are never Product/ERG semantic identities: semantic meaning
 * remains the typed tuple retained in semanticsByRelationshipRef and its exact source coordinates.
 */
export function projectExperienceRelationshipGraphToBoardGraph(graphInput) {
  if (graphInput?.schemaVersion !== EXPERIENCE_RELATIONSHIP_GRAPH_SCHEMA) {
    throw new TypeError('Experience Relationship Graph schema mismatch');
  }
  const semanticsByRelationshipRef = {};
  const boardRelationships = graphInput.relationships.map((relationship, index) => {
    const relationshipRef = `${graphInput.graphRef}.board.relationship.${index + 1}`;
    semanticsByRelationshipRef[relationshipRef] = relationship;
    return {
      relationshipRef,
      kind: boardRelationshipKind(relationship.kind),
      fromRef: relationship.fromRef,
      toRef: relationship.toRef,
      labelOrNull: relationship.kind,
      sourceRefs: [...relationship.sourceRefs],
    };
  });
  const boardGraph = normalizeBoardGraph({
    schemaVersion: 'vexboard.board-graph/v1',
    graphRef: `${graphInput.graphRef}.board`,
    nodes: graphInput.nodes.map((node) => ({
      nodeRef: node.nodeRef,
      kind: boardNodeKind(node.role),
      label: node.label,
      parentRefOrNull: null,
      detailBoardRefOrNull: null,
      sourceRefs: [...node.sourceRefs],
    })),
    relationships: boardRelationships,
    sourceRefs: [
      graphInput.sourceBinding.projectRef,
    ].filter((ref) => STABLE_REF.test(ref)),
  });

  return Object.freeze({
    boardGraph,
    semanticsByRelationshipRef: Object.freeze(semanticsByRelationshipRef),
  });
}

function findFamilyLawRow(seed, family, currentStateRef, controlRef) {
  return (seed.familyLawRows ?? []).find(
    (row) =>
      row.family === family
      && row.currentState.includes(`stateRef=${currentStateRef}`)
      && row.control.includes(`controlRef=${controlRef}`),
  ) ?? null;
}

function relationshipsForContext(graph, context) {
  return graph.relationships.filter(
    (relationship) =>
      relationship.context?.family === context.family
      && relationship.context?.currentState === context.currentState
      && relationship.context?.control === context.control,
  );
}

function projectedRelationshipRef(projection, relationship) {
  const key = semanticRelationshipKey(relationship);
  for (const [relationshipRef, semantic] of Object.entries(projection.semanticsByRelationshipRef)) {
    if (semanticRelationshipKey(semantic) === key) return relationshipRef;
  }
  throw new TypeError(`projected relationship missing for ${relationship.kind}`);
}

function advanceWithBoardJourney(projection, journey, relationship) {
  const relationshipRef = projectedRelationshipRef(projection, relationship);
  const choices = journeyChoices(projection.boardGraph, journey);
  if (!choices.some((choice) => choice.relationshipRef === relationshipRef)) {
    throw new TypeError(`BoardJourney cannot traverse ${relationship.kind} from ${journey.currentRef}`);
  }
  return advanceBoardJourney(projection.boardGraph, journey, relationshipRef);
}

export function deriveFamilyControlRouteManifest(
  seedInput,
  {
    family,
    currentStateRef,
    controlRef,
    elementRef,
  },
) {
  const seed = requireValidSeed(seedInput);
  const row = findFamilyLawRow(seed, family, currentStateRef, controlRef);
  if (!row) {
    throw new TypeError(`family law row missing for ${family} ${currentStateRef} + ${controlRef}`);
  }
  const graph = formExperienceRelationshipGraph(seed);
  const projection = projectExperienceRelationshipGraphToBoardGraph(graph);
  const context = relationshipContext(row);
  const rowRelationships = relationshipsForContext(graph, context);
  const controlTypeRef = `${family}.Control`;
  const stateTypeRef = `${family}.State`;

  const manifestation = graph.relationships.find(
    (relationship) =>
      relationship.kind === 'MANIFESTS'
      && relationship.fromRef === elementRef
      && relationship.toRef === controlTypeRef,
  );
  if (!manifestation) {
    throw new TypeError(`manifestation binding missing for ${elementRef} -> ${controlTypeRef}`);
  }
  const offers = rowRelationships.find(
    (relationship) => relationship.kind === 'OFFERS'
      && relationship.fromRef === stateTypeRef
      && relationship.toRef === controlTypeRef,
  );
  const requestedEffect = rowRelationships.find(
    (relationship) => relationship.kind === 'REQUESTS_EFFECT',
  );
  if (!offers || !requestedEffect) {
    throw new TypeError('family route is missing OFFERS or REQUESTS_EFFECT');
  }

  const forwardKinds = ['REQUESTS_EFFECT', 'REALIZED_BY', 'RETURNS_TO', 'OBSERVES_AS', 'PROJECTS_TO'];
  const forward = [];
  let currentRef = controlTypeRef;
  for (const kind of forwardKinds) {
    const relationship = rowRelationships.find(
      (candidate) => candidate.kind === kind && candidate.fromRef === currentRef,
    );
    if (!relationship) break;
    forward.push(relationship);
    currentRef = relationship.toRef;
  }

  let boardJourney = createBoardJourney(projection.boardGraph, {
    journeyRef: `journey.vexlife-prod.e2e.${family}.${currentStateRef}.${controlRef}`,
    boardRef: projection.boardGraph.graphRef,
    startRef: elementRef,
  });
  boardJourney = advanceWithBoardJourney(projection, boardJourney, manifestation);
  for (const relationship of forward) {
    boardJourney = advanceWithBoardJourney(projection, boardJourney, relationship);
  }

  const routeCoordinateRefs = new Set([
    elementRef,
    stateTypeRef,
    controlTypeRef,
    ...forward.flatMap((relationship) => [relationship.fromRef, relationship.toRef]),
  ]);
  const binding = (seed.surfaceBindings ?? []).find((candidate) => candidate.elementRef === elementRef);
  const missingPredicates = [];
  if (!binding?.deterministicActionRef) missingPredicates.push('MISSING_DETERMINISTIC_TEST_ACTION');
  const relevantDebts = graph.debts.filter(
    (debt) => debt.coordinateRefs.some((ref) => routeCoordinateRefs.has(ref)),
  );
  for (const debt of relevantDebts) {
    if (!missingPredicates.includes(debt.debtClass)) missingPredicates.push(debt.debtClass);
  }

  return Object.freeze({
    schemaVersion: E2E_ROUTE_MANIFEST_SCHEMA,
    routeRef: `route.${family}.${currentStateRef}.${controlRef}`,
    sourceBinding: graph.sourceBinding,
    target: Object.freeze({
      family,
      currentStateRef,
      controlRef,
      effectRef: row.act.effect,
    }),
    routeStatus: missingPredicates.length ? 'FRONTIER_DEBT' : 'CLEARED',
    missingPredicates: Object.freeze(missingPredicates),
    preconditions: Object.freeze({
      currentState: row.currentState,
      lawfulControlRelationship: Object.freeze(offers),
    }),
    actions: Object.freeze([
      Object.freeze({
        action: 'ACTIVATE_ELEMENT',
        elementRef,
        controlRef,
        humanMeaning: binding?.humanControlMeaning ?? null,
        executionBindingRefOrNull: binding?.deterministicActionRef ?? null,
      }),
    ]),
    relationshipTraversal: Object.freeze([
      manifestation,
      ...forward,
    ]),
    boardJourney,
    expected: Object.freeze({
      admittedState: row.act.admittedState,
      effect: row.act.effect,
      observation: row.observation,
      possibleObservedSuccessors: Object.freeze([...(row.possibleObservedSuccessors ?? [])]),
      projection: row.projection,
    }),
    executionClass: 'DETERMINISTIC_NERVOUS_SYSTEM',
  });
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

export function deriveJourneyRouteManifest(seedInput, journeyRef) {
  const seed = requireValidSeed(seedInput);
  const graph = formExperienceRelationshipGraph(seed);
  const journey = (seed.journeySeeds ?? []).find((candidate) => candidate.journeyRef === journeyRef);
  if (!journey) throw new TypeError(`unknown journeyRef ${journeyRef}`);

  const coordinateRefs = [...(journey.coordinateRefs ?? [])];
  if (!coordinateRefs.length) throw new TypeError(`journey ${journeyRef} has no coordinateRefs`);
  const coordinateDetails = coordinateRefs.map((ref) => routeCoordinate(seed, ref)).filter(Boolean);
  const surfaceBindings = routeSurfaceBindings(seed, coordinateRefs);
  const routeRefs = new Set([
    ...coordinateRefs,
    ...surfaceBindings.flatMap((binding) => [
      binding.elementRef,
      binding.currentPathwayRef,
      ...(binding.runtimeRelationship?.currentStateCoordinates ?? []),
      ...(binding.runtimeRelationship?.downstreamCoordinates ?? []),
      ...(binding.downstreamCoordinates ?? []),
    ].filter(Boolean)),
  ]);

  const relationships = graph.relationships.filter(
    (relationship) => routeRefs.has(relationship.fromRef) && routeRefs.has(relationship.toRef),
  );
  const relevantDebts = graph.debts.filter(
    (debt) => debt.coordinateRefs.some((ref) => routeRefs.has(ref)),
  );
  const actions = surfaceBindings.map((binding) => Object.freeze({
    action: 'ACTIVATE_ELEMENT',
    elementRef: binding.elementRef,
    pathwayRefOrNull: binding.currentPathwayRef ?? null,
    humanMeaning: binding.humanControlMeaning ?? binding.runtimeRelationship?.humanControlMeaning ?? null,
    executionBindingRefOrNull: binding.deterministicActionRef ?? null,
  }));
  const missingPredicates = [];
  const missingCoordinates = coordinateRefs.filter((ref) => !routeCoordinate(seed, ref));
  if (missingCoordinates.length) missingPredicates.push('MISSING_GRAPH_COORDINATE');
  if (!actions.length || actions.some((action) => action.executionBindingRefOrNull === null)) {
    missingPredicates.push('MISSING_DETERMINISTIC_TEST_ACTION');
  }
  if (!relationships.length) missingPredicates.push('MISSING_RELATIONSHIP_EDGE');
  for (const debt of relevantDebts) {
    if (!missingPredicates.includes(debt.debtClass)) missingPredicates.push(debt.debtClass);
  }

  const availabilityPredicates = [
    ...new Set(coordinateDetails.flatMap((coordinate) => coordinate.availabilityPredicates ?? [])),
  ];
  const evidenceRefs = [
    ...new Set(surfaceBindings.flatMap((binding) => [
      ...(binding.runtimeRelationship?.downstreamCoordinates ?? []),
      ...(binding.downstreamCoordinates ?? []),
    ]).filter((coordinate) => /receipt/i.test(coordinate))),
  ].sort();

  return Object.freeze({
    schemaVersion: E2E_ROUTE_MANIFEST_SCHEMA,
    routeRef: `route.${journeyRef.slice('journey.'.length)}`,
    journeyRef,
    sourceBinding: graph.sourceBinding,
    humanOutcome: journey.humanOutcome,
    disposition: journey.disposition,
    routeStatus: missingPredicates.length ? 'FRONTIER_DEBT' : 'CLEARED',
    missingPredicates: Object.freeze(missingPredicates),
    coordinateRefs: Object.freeze(coordinateRefs),
    availabilityPredicates: Object.freeze(availabilityPredicates),
    actions: Object.freeze(actions),
    relationships: Object.freeze(relationships),
    expectedEvidenceRefs: Object.freeze(evidenceRefs),
    executionClass: 'DETERMINISTIC_NERVOUS_SYSTEM',
  });
}

// [VXG RealForever][VEXWORK][VEXLIFE-PROD][E2E][RELATIONSHIP-GRAPH]
