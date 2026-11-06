import { createBoardGraph, createBoardProjection } from './vexboard.mjs';
import { VEXBOARD_SOURCE_PROJECTION_SCHEMA } from './vexboard-source-projectors.mjs';

export const VEXLIFE_PROD_ARCHITECTURE_PROJECTOR_REF =
  'projector.vexboard.vexlife-prod-architecture/v1';

export const VEXLIFE_PROD_RUNTIME_AVAILABILITY_ARCHITECTURE_SCHEMA =
  'vexlife-prod.heretic-runtime-availability-architecture/v1';

const SOURCE_OWNER = 'VexGPT/VexLife-Prod';
const FAMILY_REF = 'family.vexlife-prod.heretic-runtime-availability';
const REF = /^[A-Za-z0-9][A-Za-z0-9._:/-]*$/u;

const ROLES = Object.freeze([
  'FAMILY',
  'STATE',
  'CONTROL',
  'EFFECT',
  'OWNER',
  'OBSERVATION',
]);

const RELATIONSHIP_CLASSES = Object.freeze([
  'RESOLVED_BY',
  'CURRENT_TRUTH_FOR',
  'FORMS_OBSERVATION',
  'ESTABLISHES_STATE',
  'ADMITS_WITHOUT_PRODUCT_EFFECT',
  'REQUESTS_IF_ACQUISITION_ALLOWED',
  'REQUESTS_IF_OBSERVATION_ONLY',
  'REALIZED_BY',
  'DELEGATES_TO_OWNER',
  'INTERPRETED_BY',
  'ADMITS_PRODUCT_QUALIFIED',
  'CONSUMES',
]);

const ROLE_ORDER = Object.freeze([
  'CONTROL',
  'FAMILY',
  'STATE',
  'EFFECT',
  'OWNER',
  'OBSERVATION',
]);

const ROLE_X = Object.freeze({
  CONTROL: 80,
  FAMILY: 360,
  STATE: 640,
  EFFECT: 920,
  OWNER: 1200,
  OBSERVATION: 1480,
});

const ROLE_LABEL = Object.freeze({
  FAMILY: 'Family',
  STATE: 'State',
  CONTROL: 'Control',
  EFFECT: 'Effect',
  OWNER: 'Owner',
  OBSERVATION: 'Observation',
});

const RELATIONSHIP_KIND = Object.freeze({
  RESOLVED_BY: 'REFERENCE',
  CURRENT_TRUTH_FOR: 'DATA',
  FORMS_OBSERVATION: 'DATA',
  ESTABLISHES_STATE: 'TRANSITION',
  ADMITS_WITHOUT_PRODUCT_EFFECT: 'TRANSITION',
  REQUESTS_IF_ACQUISITION_ALLOWED: 'FLOW',
  REQUESTS_IF_OBSERVATION_ONLY: 'FLOW',
  REALIZED_BY: 'FLOW',
  DELEGATES_TO_OWNER: 'REFERENCE',
  INTERPRETED_BY: 'FLOW',
  ADMITS_PRODUCT_QUALIFIED: 'TRANSITION',
  CONSUMES: 'REFERENCE',
});

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function stableRef(value, label) {
  assert(typeof value === 'string' && REF.test(value), `${label} must be one stable ref`);
  return value;
}

function text(value, label) {
  assert(typeof value === 'string' && value.trim(), `${label} must be non-empty text`);
  return value;
}

function refs(values, label) {
  assert(Array.isArray(values), `${label} must be an array`);
  const normalized = values.map((value, index) => stableRef(value, `${label}[${index}]`));
  assert(new Set(normalized).size === normalized.length, `${label} must be unique`);
  return [...normalized].sort();
}

function nodeKind(role) {
  return role === 'CONTROL' ? 'CONTROL' : 'REFERENCE';
}

function graphNode(node, sourceRevisionRef) {
  assert(ROLES.includes(node?.role), `unsupported VexLife-Prod architecture role ${node?.role}`);
  const nodeRef = stableRef(node.nodeRef, 'architecture nodeRef');
  const sourceRefs = refs(
    [sourceRevisionRef, ...refs(node.sourceRefs, `${nodeRef}.sourceRefs`)],
    `${nodeRef}.projectionSourceRefs`,
  );
  return {
    nodeRef,
    kind: nodeKind(node.role),
    label: `${ROLE_LABEL[node.role]} · ${text(node.label, `${nodeRef}.label`)}`,
    parentRefOrNull: null,
    detailBoardRefOrNull: null,
    sourceRefs,
  };
}

function graphRelationship(relationship, sourceRevisionRef) {
  assert(
    RELATIONSHIP_CLASSES.includes(relationship?.relationshipClass),
    `unsupported VexLife-Prod architecture relationshipClass ${relationship?.relationshipClass}`,
  );
  const relationshipRef = stableRef(relationship.relationshipRef, 'architecture relationshipRef');
  return {
    relationshipRef,
    kind: RELATIONSHIP_KIND[relationship.relationshipClass],
    fromRef: stableRef(relationship.fromRef, `${relationshipRef}.fromRef`),
    toRef: stableRef(relationship.toRef, `${relationshipRef}.toRef`),
    labelOrNull: `${relationship.relationshipClass} · ${text(
      relationship.label,
      `${relationshipRef}.label`,
    )}`,
    sourceRefs: refs(
      [sourceRevisionRef, ...refs(relationship.sourceRefs, `${relationshipRef}.sourceRefs`)],
      `${relationshipRef}.projectionSourceRefs`,
    ),
  };
}

function buildProjection(graph, projectionRef) {
  const grouped = new Map(ROLE_ORDER.map((role) => [role, []]));
  for (const node of graph.nodes) {
    const rolePrefix = node.label.split(' · ', 1)[0];
    const role = Object.entries(ROLE_LABEL).find(([, label]) => label === rolePrefix)?.[0];
    assert(role && grouped.has(role), `projected node ${node.nodeRef} lacks one supported role label`);
    grouped.get(role).push(node);
  }

  const items = [];
  for (const role of ROLE_ORDER) {
    const nodes = grouped.get(role).sort((left, right) => left.nodeRef.localeCompare(right.nodeRef));
    nodes.forEach((node, index) => {
      items.push({
        projectionItemRef: `item.${node.nodeRef}`,
        semanticRef: node.nodeRef,
        shapeKind: 'RECTANGLE',
        bounds: {
          x: ROLE_X[role],
          y: 80 + (index * 150),
          width: 240,
          height: 112,
        },
        layer: 0,
        parentProjectionItemRefOrNull: null,
        visible: true,
        locked: true,
      });
    });
  }

  return createBoardProjection({
    schemaVersion: 'vexboard.board-projection/v1',
    projectionRef,
    graphRef: graph.graphRef,
    layoutIntent: 'SYSTEM_MAP',
    items,
    sourceRefs: graph.sourceRefs,
  }, graph);
}

export function projectVexLifeProdArchitecture({
  architecture,
  sourceRevisionRef,
  boardRef,
}) {
  assert(
    architecture?.schemaVersion === VEXLIFE_PROD_RUNTIME_AVAILABILITY_ARCHITECTURE_SCHEMA,
    'VexLife-Prod architecture schema mismatch',
  );
  assert(
    architecture.projectionRef === 'architecture.vexlife-prod.heretic-runtime-availability'
      && architecture.familyRef === FAMILY_REF
      && architecture.sourceOwnerRepository === SOURCE_OWNER,
    'VexLife-Prod runtime-availability architecture identity mismatch',
  );
  assert(architecture.externalEffectsPerformed === false,
    'VexLife-Prod architecture projection must remain effect-free');
  assert(Array.isArray(architecture.nodes) && architecture.nodes.length > 0,
    'VexLife-Prod architecture nodes required');
  assert(Array.isArray(architecture.relationships),
    'VexLife-Prod architecture relationships required');

  const sourceRevision = stableRef(sourceRevisionRef, 'sourceRevisionRef');
  const board = stableRef(boardRef, 'boardRef');
  assert(board.startsWith('board.'), 'boardRef must start with board.');

  const nodes = architecture.nodes.map((node) => graphNode(node, sourceRevision));
  const nodeRefs = new Set(nodes.map((node) => node.nodeRef));
  assert(nodeRefs.size === nodes.length, 'VexLife-Prod architecture nodeRef must be unique');

  const relationships = architecture.relationships.map(
    (relationship) => graphRelationship(relationship, sourceRevision),
  );
  for (const relationship of relationships) {
    assert(nodeRefs.has(relationship.fromRef) && nodeRefs.has(relationship.toRef),
      `VexLife-Prod architecture relationship endpoint missing: ${relationship.relationshipRef}`);
  }

  const graphRef = `graph.${board.slice(6)}`;
  const projectionRef = `projection.${board.slice(6)}`;
  const graph = createBoardGraph({
    schemaVersion: 'vexboard.board-graph/v1',
    graphRef,
    nodes,
    relationships,
    sourceRefs: refs(
      [
        sourceRevision,
        architecture.projectionRef,
        architecture.familyRef,
        ...refs(architecture.sourceRefs, 'architecture.sourceRefs'),
      ],
      'VexLife-Prod architecture graph.sourceRefs',
    ),
  });
  const projection = buildProjection(graph, projectionRef);

  return Object.freeze({
    schemaVersion: VEXBOARD_SOURCE_PROJECTION_SCHEMA,
    projectorRef: VEXLIFE_PROD_ARCHITECTURE_PROJECTOR_REF,
    boardRef: board,
    sourceRefs: graph.sourceRefs,
    graph,
    projection,
    effects: Object.freeze({
      sourceMutationPerformed: false,
      externalEffectsPerformed: false,
    }),
  });
}

// [VXG RealForever][VEXWORK][VEXBOARD][VEXLIFE-PROD][ARCHITECTURE-PROJECTOR]
