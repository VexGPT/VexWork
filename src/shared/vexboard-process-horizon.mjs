import {
  normalizeProcessFamily,
  normalizeProcessState,
  projectProcessHorizon,
} from './vex-process-family.mjs';
import {
  normalizeBoardGraph,
  normalizeBoardProjection,
} from './vexboard-model.mjs';

export const PROCESS_HORIZON_BOARD_MODE = 'READ_ONLY_SOURCE';

const REF = /^[A-Za-z0-9][A-Za-z0-9._:/-]*$/u;

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function compareCanonicalText(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function exactKeys(value, keys, label) {
  assert(isObject(value), label + ' must be one object');
  const actual = Object.keys(value).sort(compareCanonicalText);
  const expected = [...keys].sort(compareCanonicalText);
  assert(JSON.stringify(actual) === JSON.stringify(expected), label + ' schema drift');
}

function stableRef(value, label) {
  assert(typeof value === 'string' && REF.test(value), label + ' must be one stable ref');
  return value;
}

function text(value, label) {
  assert(typeof value === 'string' && value.trim(), label + ' must be non-empty text');
  return value;
}

function refs(values, label, { allowEmpty = true } = {}) {
  assert(Array.isArray(values), label + ' must be an array');
  if (!allowEmpty) assert(values.length > 0, label + ' must be non-empty');
  const result = [...new Set(values.map((value, index) => stableRef(value, label + '[' + index + ']')))];
  return result.sort(compareCanonicalText);
}

function scopeContext(input) {
  exactKeys(input, ['scopeRef', 'label', 'purpose', 'sourceRefs'], 'process horizon scope');
  return {
    scopeRef: stableRef(input.scopeRef, 'process horizon scope.scopeRef'),
    label: text(input.label, 'process horizon scope.label'),
    purpose: text(input.purpose, 'process horizon scope.purpose'),
    sourceRefs: refs(input.sourceRefs, 'process horizon scope.sourceRefs', { allowEmpty: false }),
  };
}

function slotRef(boardRef, role, index = null) {
  return index === null
    ? role + '.' + boardRef
    : role + '.' + boardRef + '.' + index;
}

function nodeSourceRefs(...groups) {
  return refs(groups.flat(), 'process horizon projected sourceRefs', { allowEmpty: false });
}

function annotationNode(nodeRef, label, parentRef, sourceRefs) {
  return {
    nodeRef,
    kind: 'ANNOTATION',
    label,
    parentRefOrNull: parentRef,
    detailBoardRefOrNull: null,
    sourceRefs,
  };
}

function projectionItem({
  projectionItemRef,
  semanticRef,
  shapeKind,
  x,
  y,
  width,
  height,
  layer = 1,
  parentProjectionItemRefOrNull = null,
}) {
  return {
    projectionItemRef,
    semanticRef,
    shapeKind,
    bounds: { x, y, width, height },
    layer,
    parentProjectionItemRefOrNull,
    visible: true,
    locked: true,
  };
}

export function projectProcessHorizonBoard({
  family: familyInput,
  state: stateInput,
  scope: scopeInput,
  boardRef: boardRefInput,
  satisfiedPredicateRefs = [],
} = {}) {
  const family = normalizeProcessFamily(familyInput);
  const state = normalizeProcessState(stateInput, family);
  const scope = scopeContext(scopeInput);
  assert(scope.scopeRef === state.scopeRef, 'process horizon scopeRef must match ProcessFamily.State scopeRef');

  const boardRef = stableRef(boardRefInput, 'process horizon boardRef');
  assert(boardRef.startsWith('board.'), 'process horizon boardRef must start with board.');

  const horizon = projectProcessHorizon(family, state, { satisfiedPredicateRefs });
  const currentEvidenceRefs = state.lastAcceptedTransitionOrNull?.evidenceRefs ?? [];
  const currentIdentityRefs = state.lastAcceptedTransitionOrNull?.carriedIdentityRefs ?? [];
  const nodes = [];
  const relationships = [];
  const items = [];

  const scopeNodeRef = slotRef(boardRef, 'reference.scope');
  const scopeAnnotationRef = slotRef(boardRef, 'annotation.scope-purpose');
  const currentNodeRef = slotRef(boardRef, 'reference.current');
  const currentAnnotationRef = slotRef(boardRef, 'annotation.current-detail');

  const scopeSources = nodeSourceRefs(scope.scopeRef, scope.sourceRefs);
  nodes.push({
    nodeRef: scopeNodeRef,
    kind: 'REFERENCE',
    label: 'OUTCOME · ' + scope.label,
    parentRefOrNull: null,
    detailBoardRefOrNull: null,
    sourceRefs: scopeSources,
  });
  nodes.push(annotationNode(
    scopeAnnotationRef,
    scope.purpose,
    scopeNodeRef,
    scopeSources,
  ));

  const currentSources = nodeSourceRefs(
    family.sourceRefs,
    state.stateRef,
    currentEvidenceRefs,
    currentIdentityRefs,
    state.previousStateRefOrNull === null ? [] : [state.previousStateRefOrNull],
    state.lastAcceptedTransitionOrNull === null ? [] : [
      state.lastAcceptedTransitionOrNull.transitionRef,
    ],
    horizon.current.nodeRef,
    horizon.current.currentTruthRefs,
    horizon.current.ownerRefs,
    horizon.current.readingSourceRefs,
    horizon.current.considerationRefs,
    horizon.current.proofRefs,
  );
  nodes.push({
    nodeRef: currentNodeRef,
    kind: 'PROCESS',
    label: 'CURRENT · ' + horizon.current.label,
    parentRefOrNull: null,
    detailBoardRefOrNull: null,
    sourceRefs: currentSources,
  });
  nodes.push(annotationNode(
    currentAnnotationRef,
    'Layer: ' + horizon.layer + ' · ' + horizon.current.purpose,
    currentNodeRef,
    currentSources,
  ));

  relationships.push({
    relationshipRef: slotRef(boardRef, 'rel.scope-current'),
    kind: 'REFERENCE',
    fromRef: scopeNodeRef,
    toRef: currentNodeRef,
    labelOrNull: 'CURRENT PROCESS',
    sourceRefs: nodeSourceRefs(scope.scopeRef, state.stateRef, family.sourceRefs),
  });

  items.push(
    projectionItem({
      projectionItemRef: slotRef(boardRef, 'item.scope'),
      semanticRef: scopeNodeRef,
      shapeKind: 'RECTANGLE',
      x: 450, y: 40, width: 440, height: 120, layer: 1,
    }),
    projectionItem({
      projectionItemRef: slotRef(boardRef, 'item.scope-purpose'),
      semanticRef: scopeAnnotationRef,
      shapeKind: 'TEXT',
      x: 470, y: 105, width: 400, height: 42, layer: 2,
      parentProjectionItemRefOrNull: slotRef(boardRef, 'item.scope'),
    }),
    projectionItem({
      projectionItemRef: slotRef(boardRef, 'item.current'),
      semanticRef: currentNodeRef,
      shapeKind: 'RECTANGLE',
      x: 500, y: 250, width: 360, height: 150, layer: 1,
    }),
    projectionItem({
      projectionItemRef: slotRef(boardRef, 'item.current-detail'),
      semanticRef: currentAnnotationRef,
      shapeKind: 'TEXT',
      x: 520, y: 325, width: 320, height: 54, layer: 2,
      parentProjectionItemRefOrNull: slotRef(boardRef, 'item.current'),
    }),
  );

  if (horizon.previousAcceptedOrNull) {
    const previous = horizon.previousAcceptedOrNull;
    const previousNodeRef = slotRef(boardRef, 'reference.previous');
    const previousAnnotationRef = slotRef(boardRef, 'annotation.previous-detail');
    const previousSources = nodeSourceRefs(
      family.sourceRefs,
      previous.stateRef,
      previous.nodeRef,
      previous.transitionRef,
      previous.evidenceRefs,
    );
    nodes.push({
      nodeRef: previousNodeRef,
      kind: 'REFERENCE',
      label: 'PREVIOUS · ' + previous.label,
      parentRefOrNull: null,
      detailBoardRefOrNull: null,
      sourceRefs: previousSources,
    });
    const previousTransitionLabel = previous.movementClass === null
      ? 'Layer ' + previous.fromLayer + ' → ' + previous.toLayer
      : previous.movementClass;
    nodes.push(annotationNode(
      previousAnnotationRef,
      'Accepted via ' + previousTransitionLabel + ' · ' + previous.transitionRef,
      previousNodeRef,
      previousSources,
    ));
    relationships.push({
      relationshipRef: slotRef(boardRef, 'rel.previous-current'),
      kind: 'FLOW',
      fromRef: previousNodeRef,
      toRef: currentNodeRef,
      labelOrNull: previousTransitionLabel,
      sourceRefs: previousSources,
    });
    items.push(
      projectionItem({
        projectionItemRef: slotRef(boardRef, 'item.previous'),
        semanticRef: previousNodeRef,
        shapeKind: 'RECTANGLE',
        x: 70, y: 265, width: 300, height: 125, layer: 1,
      }),
      projectionItem({
        projectionItemRef: slotRef(boardRef, 'item.previous-detail'),
        semanticRef: previousAnnotationRef,
        shapeKind: 'TEXT',
        x: 90, y: 330, width: 260, height: 42, layer: 2,
        parentProjectionItemRefOrNull: slotRef(boardRef, 'item.previous'),
      }),
    );
  }

  horizon.nextCandidates.forEach((candidate, index) => {
    const number = index + 1;
    const nextNodeRef = slotRef(boardRef, 'reference.next', number);
    const nextAnnotationRef = slotRef(boardRef, 'annotation.next-detail', number);
    const nextSources = nodeSourceRefs(
      family.sourceRefs,
      candidate.nodeRef,
      candidate.relationshipRef,
      candidate.entryPredicateRefs,
      candidate.missingPredicateRefs,
    );
    const availability = candidate.available ? 'AVAILABLE' : 'NOT YET AVAILABLE';

    nodes.push({
      nodeRef: nextNodeRef,
      kind: 'REFERENCE',
      label: 'NEXT · ' + candidate.label,
      parentRefOrNull: null,
      detailBoardRefOrNull: null,
      sourceRefs: nextSources,
    });
    nodes.push(annotationNode(
      nextAnnotationRef,
      availability + ' · ' + candidate.movementClass + ' · ' + candidate.purpose,
      nextNodeRef,
      nextSources,
    ));
    relationships.push({
      relationshipRef: slotRef(boardRef, 'rel.current-next', number),
      kind: 'TRANSITION',
      fromRef: currentNodeRef,
      toRef: nextNodeRef,
      labelOrNull: candidate.movementClass + ' · ' + availability,
      sourceRefs: nextSources,
    });
    const y = 190 + (index * 160);
    items.push(
      projectionItem({
        projectionItemRef: slotRef(boardRef, 'item.next', number),
        semanticRef: nextNodeRef,
        shapeKind: 'RECTANGLE',
        x: 1010, y, width: 340, height: 125, layer: 1,
      }),
      projectionItem({
        projectionItemRef: slotRef(boardRef, 'item.next-detail', number),
        semanticRef: nextAnnotationRef,
        shapeKind: 'TEXT',
        x: 1030, y: y + 65, width: 300, height: 42, layer: 2,
        parentProjectionItemRefOrNull: slotRef(boardRef, 'item.next', number),
      }),
    );
  });

  if (horizon.furtherNodeRefs.length > 0) {
    const furtherContainerRef = slotRef(boardRef, 'container.further');
    const furtherContainerItemRef = slotRef(boardRef, 'item.further');
    const furtherHeight = Math.max(150, 80 + (horizon.furtherNodeRefs.length * 72));
    nodes.push({
      nodeRef: furtherContainerRef,
      kind: 'CONTAINER',
      label: 'FURTHER ROUTE · addressable, not entered',
      parentRefOrNull: null,
      detailBoardRefOrNull: null,
      sourceRefs: nodeSourceRefs(family.sourceRefs, family.familyRef),
    });
    items.push(projectionItem({
      projectionItemRef: furtherContainerItemRef,
      semanticRef: furtherContainerRef,
      shapeKind: 'FRAME',
      x: 1450, y: 150, width: 360, height: furtherHeight, layer: 0,
    }));

    horizon.furtherNodeRefs.forEach((processNodeRef, index) => {
      const number = index + 1;
      const processNode = family.nodes.find((node) => node.nodeRef === processNodeRef);
      const furtherNodeRef = slotRef(boardRef, 'reference.further', number);
      nodes.push({
        nodeRef: furtherNodeRef,
        kind: 'REFERENCE',
        label: 'LATER · ' + processNode.label,
        parentRefOrNull: furtherContainerRef,
        detailBoardRefOrNull: null,
        sourceRefs: nodeSourceRefs(family.sourceRefs, processNode.nodeRef),
      });
      items.push(projectionItem({
        projectionItemRef: slotRef(boardRef, 'item.further', number),
        semanticRef: furtherNodeRef,
        shapeKind: 'TEXT',
        x: 1470,
        y: 205 + (index * 72),
        width: 320,
        height: 50,
        layer: 1,
        parentProjectionItemRefOrNull: furtherContainerItemRef,
      }));
    });
  }

  const graph = normalizeBoardGraph({
    schemaVersion: 'vexboard.board-graph/v1',
    graphRef: 'graph.' + boardRef.slice(6),
    nodes,
    relationships,
    sourceRefs: nodeSourceRefs(
      family.sourceRefs,
      scope.sourceRefs,
      state.stateRef,
      currentEvidenceRefs,
      currentIdentityRefs,
      family.familyRef,
      scope.scopeRef,
    ),
  });

  const projection = normalizeBoardProjection({
    schemaVersion: 'vexboard.board-projection/v1',
    projectionRef: 'projection.' + boardRef.slice(6),
    graphRef: graph.graphRef,
    layoutIntent: 'FREE_WITH_CONSTRAINTS',
    items,
    sourceRefs: graph.sourceRefs,
  }, graph);

  return {
    schemaVersion: 'vexboard.local-draft/v1',
    draftRef: boardRef,
    title: scope.label + ' · Current process horizon',
    mode: PROCESS_HORIZON_BOARD_MODE,
    derivedFromRefOrNull: state.stateRef,
    savedAtOrNull: null,
    graph,
    projection,
  };
}

// [VXG RealForever][VEXWORK][VEXPROCESSFAMILY][VEXBOARD][HORIZON]
