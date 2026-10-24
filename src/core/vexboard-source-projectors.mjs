import { verifySemanticFingerprint } from './semantic.mjs';
import { projectWorkRefs } from './workgraph.mjs';
import { createBoardGraph, createBoardProjection } from './vexboard.mjs';

export const VEXBOARD_SOURCE_PROJECTION_SCHEMA = 'vexboard.source-projection/v1';
export const VEXWORK_PROJECT_PROJECTOR_REF = 'projector.vexboard.vexwork-project/v1';
export const PROCESS_ATLAS_PUBLIC_SAFE_PROJECTOR_REF = 'projector.vexboard.process-atlas-public-safe/v1';

const PROCESS_ATLAS_PUBLIC_SAFE_SCHEMA = 'vextreme.process-atlas.public-safe/v1';
const PROCESS_ATLAS_RECEIPT_SCHEMA = 'vextreme.process-atlas.projection-receipt/v1';
const REF = /^[A-Za-z0-9][A-Za-z0-9._:/-]*$/u;
const HEX64 = /^[0-9a-f]{64}$/u;

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function compareCanonicalText(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
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
  return [...new Set(values.map((value, index) => stableRef(value, `${label}[${index}]`)))].sort();
}

function boardCoordinates(boardRefInput) {
  const boardRef = stableRef(boardRefInput, 'boardRef');
  assert(boardRef.startsWith('board.'), 'boardRef must start with board.');
  const suffix = boardRef.slice(6);
  return {
    boardRef,
    graphRef: `graph.${suffix}`,
    projectionRef: `projection.${suffix}`,
  };
}

function annotationRef(sourceRef, role) {
  return stableRef(`annotation.${sourceRef}.${role}`, 'annotationRef');
}

function itemRef(semanticRef) {
  return stableRef(`item.${semanticRef}`, 'projectionItemRef');
}

function buildProjection(graph, projectionRef, layoutIntent) {
  const byRef = new Map(graph.nodes.map((node) => [node.nodeRef, node]));
  const depthMemo = new Map();

  function depth(ref, visiting = new Set()) {
    if (depthMemo.has(ref)) return depthMemo.get(ref);
    if (visiting.has(ref)) return 0;
    visiting.add(ref);
    const parent = byRef.get(ref)?.parentRefOrNull ?? null;
    const value = parent ? depth(parent, visiting) + 1 : 0;
    visiting.delete(ref);
    depthMemo.set(ref, value);
    return value;
  }

  const primary = graph.nodes
    .filter((node) => node.kind !== 'ANNOTATION')
    .sort((left, right) => depth(left.nodeRef) - depth(right.nodeRef) || compareCanonicalText(left.nodeRef, right.nodeRef));
  const annotationsByParent = new Map();
  for (const node of graph.nodes.filter((candidate) => candidate.kind === 'ANNOTATION')) {
    assert(node.parentRefOrNull !== null, `annotation ${node.nodeRef} requires one semantic parent`);
    if (!annotationsByParent.has(node.parentRefOrNull)) annotationsByParent.set(node.parentRefOrNull, []);
    annotationsByParent.get(node.parentRefOrNull).push(node.nodeRef);
  }
  for (const refsForParent of annotationsByParent.values()) refsForParent.sort(compareCanonicalText);

  const boundsByRef = new Map();
  let cursorY = 80;
  for (const node of primary) {
    const annotationCount = annotationsByParent.get(node.nodeRef)?.length ?? 0;
    const height = Math.max(132, 92 + (annotationCount * 48));
    boundsByRef.set(node.nodeRef, {
      x: 80 + (depth(node.nodeRef) * 340),
      y: cursorY,
      width: 300,
      height,
    });
    cursorY += height + 36;
  }

  const items = graph.nodes.map((node) => {
    if (node.kind === 'ANNOTATION') {
      const parent = boundsByRef.get(node.parentRefOrNull);
      assert(parent, `annotation ${node.nodeRef} parent must be one projected primary node`);
      const annotationIndex = annotationsByParent.get(node.parentRefOrNull).indexOf(node.nodeRef);
      assert(annotationIndex >= 0, `annotation ${node.nodeRef} missing from parent layout`);
      return {
        projectionItemRef: itemRef(node.nodeRef),
        semanticRef: node.nodeRef,
        shapeKind: 'TEXT',
        bounds: {
          x: parent.x + 20,
          y: parent.y + 76 + (annotationIndex * 48),
          width: 260,
          height: 40,
        },
        layer: 1,
        parentProjectionItemRefOrNull: itemRef(node.parentRefOrNull),
        visible: true,
        locked: true,
      };
    }
    return {
      projectionItemRef: itemRef(node.nodeRef),
      semanticRef: node.nodeRef,
      shapeKind: 'RECTANGLE',
      bounds: boundsByRef.get(node.nodeRef),
      layer: 0,
      parentProjectionItemRefOrNull: null,
      visible: true,
      locked: true,
    };
  });

  return createBoardProjection({
    schemaVersion: 'vexboard.board-projection/v1',
    projectionRef,
    graphRef: graph.graphRef,
    layoutIntent,
    items,
    sourceRefs: graph.sourceRefs,
  }, graph);
}

function projectionResult({ projectorRef, boardRef, sourceRefs, graph, projection }) {
  return Object.freeze({
    schemaVersion: VEXBOARD_SOURCE_PROJECTION_SCHEMA,
    projectorRef,
    boardRef,
    sourceRefs: refs(sourceRefs, 'source projection sourceRefs'),
    graph,
    projection,
    effects: Object.freeze({
      sourceMutationPerformed: false,
      externalEffectsPerformed: false,
    }),
  });
}

function processReferenceNode(process) {
  const nodeRef = `reference.${process.processRef}`;
  return [
    {
      nodeRef,
      kind: 'REFERENCE',
      label: process.label,
      parentRefOrNull: null,
      detailBoardRefOrNull: null,
      sourceRefs: refs([process.processRef, ...process.entryRefs], `${nodeRef}.sourceRefs`),
    },
    {
      nodeRef: annotationRef(nodeRef, 'currentness'),
      kind: 'ANNOTATION',
      label: `Owner: ${process.ownerRepositoryRef} · Execution authority: ${process.executionAuthority}`,
      parentRefOrNull: nodeRef,
      detailBoardRefOrNull: null,
      sourceRefs: refs([process.processRef, ...process.entryRefs], `${nodeRef}.currentness.sourceRefs`),
    },
  ];
}

export function projectVexWorkProjectSource({ project, graph, processMap, boardRef: boardRefInput }) {
  assert(processMap?.schemaVersion === 'vexwork.process-map/v1', 'VexWork Process Map schema mismatch');
  assert(verifySemanticFingerprint(processMap), 'VexWork Process Map semanticFingerprint mismatch');
  assert(processMap.effects === false && processMap.executionAuthority === 'NONE',
    'VexWork Process Map must remain effect-free and non-executing');

  const { boardRef, graphRef, projectionRef } = boardCoordinates(boardRefInput);
  const workRefs = projectWorkRefs(project, graph);
  const selected = new Set(workRefs);
  const byWorkRef = new Map(graph.items.map((item) => [item.workRef, item]));
  const byProcessRef = new Map(processMap.processes.map((process) => [process.processRef, process]));
  const nodes = [];
  const relationships = [];
  const requiredProcessRefs = new Set();
  const externalDependencies = new Set();

  for (const workRef of workRefs) {
    const item = byWorkRef.get(workRef);
    assert(item, `projected Work item missing: ${workRef}`);
    if (item.parentWorkRefOrNull) {
      assert(selected.has(item.parentWorkRefOrNull),
        `VexWork Project source projector requires project-local containment: ${workRef}`);
    }

    const sourceRefs = refs([...item.sourceRefs, 'workgraphs/public.json'], `${workRef}.sourceRefs`);
    nodes.push({
      nodeRef: item.workRef,
      kind: 'REFERENCE',
      label: item.label,
      parentRefOrNull: item.parentWorkRefOrNull,
      detailBoardRefOrNull: null,
      sourceRefs,
    });
    nodes.push({
      nodeRef: annotationRef(item.workRef, 'currentness'),
      kind: 'ANNOTATION',
      label: `State: ${item.state} · Authority: ${item.authorityDisposition} · Effects: ${item.effectDisposition}`,
      parentRefOrNull: item.workRef,
      detailBoardRefOrNull: null,
      sourceRefs,
    });

    for (const dependencyRef of item.dependencyRefs) {
      const targetRef = selected.has(dependencyRef) ? dependencyRef : `reference.${dependencyRef}`;
      if (!selected.has(dependencyRef)) externalDependencies.add(dependencyRef);
      relationships.push({
        relationshipRef: `rel.vexboard.source.${workRef}.depends-on.${targetRef}`,
        kind: 'REFERENCE',
        fromRef: workRef,
        toRef: targetRef,
        labelOrNull: 'DEPENDS_ON',
        sourceRefs: ['workgraphs/public.json'],
      });
    }
    if (item.formationProcessRefOrNull) requiredProcessRefs.add(item.formationProcessRefOrNull);
    for (const processRef of item.nextProcessRefs) requiredProcessRefs.add(processRef);
  }

  for (const dependencyRef of [...externalDependencies].sort()) {
    const item = byWorkRef.get(dependencyRef);
    assert(item, `external dependency missing from Workgraph: ${dependencyRef}`);
    const nodeRef = `reference.${dependencyRef}`;
    const sourceRefs = refs([dependencyRef, ...item.sourceRefs, 'workgraphs/public.json'], `${nodeRef}.sourceRefs`);
    nodes.push({
      nodeRef,
      kind: 'REFERENCE',
      label: `External Work · ${item.label}`,
      parentRefOrNull: null,
      detailBoardRefOrNull: null,
      sourceRefs,
    });
    nodes.push({
      nodeRef: annotationRef(nodeRef, 'currentness'),
      kind: 'ANNOTATION',
      label: `State: ${item.state} · Authority: ${item.authorityDisposition} · Effects: ${item.effectDisposition}`,
      parentRefOrNull: nodeRef,
      detailBoardRefOrNull: null,
      sourceRefs,
    });
  }

  for (const processRef of [...requiredProcessRefs].sort()) {
    const process = byProcessRef.get(processRef);
    assert(process, `projected Process Map entry missing: ${processRef}`);
    nodes.push(...processReferenceNode(process));
  }

  for (const workRef of workRefs) {
    const item = byWorkRef.get(workRef);
    if (item.formationProcessRefOrNull) {
      relationships.push({
        relationshipRef: `rel.vexboard.source.${workRef}.formed-by.${item.formationProcessRefOrNull}`,
        kind: 'REFERENCE',
        fromRef: workRef,
        toRef: `reference.${item.formationProcessRefOrNull}`,
        labelOrNull: 'FORMED_BY',
        sourceRefs: ['blueprint/process-registry.json', 'workgraphs/public.json'],
      });
    }
    for (const processRef of item.nextProcessRefs) {
      relationships.push({
        relationshipRef: `rel.vexboard.source.${workRef}.next-process.${processRef}`,
        kind: 'REFERENCE',
        fromRef: workRef,
        toRef: `reference.${processRef}`,
        labelOrNull: 'NEXT_PROCESS',
        sourceRefs: ['blueprint/process-registry.json', 'workgraphs/public.json'],
      });
    }
  }

  const boardGraph = createBoardGraph({
    schemaVersion: 'vexboard.board-graph/v1',
    graphRef,
    nodes,
    relationships,
    sourceRefs: refs([
      project.projectRef,
      ...project.sourceRefs,
      'workgraphs/public.json',
      'blueprint/process-registry.json',
    ], 'VexWork source projection graph.sourceRefs'),
  });
  const projection = buildProjection(boardGraph, projectionRef, 'TREE');

  return projectionResult({
    projectorRef: VEXWORK_PROJECT_PROJECTOR_REF,
    boardRef,
    sourceRefs: boardGraph.sourceRefs,
    graph: boardGraph,
    projection,
  });
}

function atlasIndex(atlas) {
  assert(atlas?.schemaVersion === PROCESS_ATLAS_PUBLIC_SAFE_SCHEMA,
    'Process Atlas projector accepts only vextreme.process-atlas.public-safe/v1');
  stableRef(atlas.atlasRef, 'atlasRef');
  text(atlas.atlasVersion, 'atlasVersion');
  assert(atlas.projectionReceipt?.schemaVersion === PROCESS_ATLAS_RECEIPT_SCHEMA,
    'Process Atlas public-safe projectionReceipt required');
  assert(atlas.projectionReceipt.atlasRef === atlas.atlasRef, 'Process Atlas projectionReceipt atlasRef mismatch');
  stableRef(atlas.projectionReceipt.projectionReceiptRef, 'Process Atlas projectionReceiptRef');
  // VexBoard consumes the source owner's public-safe receipt; it does not recompute or own Atlas privacy policy.
  assert(HEX64.test(atlas.projectionReceipt.contentSha256 ?? ''),
    'Process Atlas projectionReceipt contentSha256 must be sha256');

  for (const field of [
    'nodes', 'edges', 'serialDependencies', 'questions', 'opportunities',
    'priorities', 'freshnessAndInvalidation',
  ]) assert(Array.isArray(atlas[field]), `Process Atlas ${field} must be an array`);

  const nodes = new Map(atlas.nodes.map((node) => [stableRef(node.nodeRef, 'Process Atlas nodeRef'), node]));
  assert(nodes.size === atlas.nodes.length, 'Process Atlas nodeRef must be unique');
  const freshness = new Map(atlas.freshnessAndInvalidation.map((entry) => [
    stableRef(entry.freshnessRef, 'Process Atlas freshnessRef'),
    entry,
  ]));
  assert(freshness.size === atlas.freshnessAndInvalidation.length, 'Process Atlas freshnessRef must be unique');
  for (const entry of atlas.freshnessAndInvalidation) {
    text(entry.state, `Process Atlas freshness ${entry.freshnessRef}.state`);
  }

  for (const node of atlas.nodes) {
    text(node.title, `Process Atlas node ${node.nodeRef}.title`);
    text(node.state, `Process Atlas node ${node.nodeRef}.state`);
    refs(node.sourceRefs, `Process Atlas node ${node.nodeRef}.sourceRefs`);
    assert(freshness.has(node.freshnessRef), `Process Atlas node ${node.nodeRef} freshnessRef missing`);
  }
  for (const edge of atlas.edges) {
    stableRef(edge.edgeRef, 'Process Atlas edgeRef');
    text(edge.edgeClass, `Process Atlas edge ${edge.edgeRef}.edgeClass`);
    assert(nodes.has(edge.fromRef) && nodes.has(edge.toRef), `Process Atlas edge ${edge.edgeRef} endpoint missing`);
    refs(edge.sourceRefs, `Process Atlas edge ${edge.edgeRef}.sourceRefs`);
  }
  return { nodes, freshness };
}

export function projectProcessAtlasPublicSafe({ atlas, boardRef: boardRefInput }) {
  const accepted = atlasIndex(atlas);
  const { boardRef, graphRef, projectionRef } = boardCoordinates(boardRefInput);
  const nodes = [];
  const relationships = [];

  for (const node of atlas.nodes) {
    const sourceRefs = refs([...node.sourceRefs, node.freshnessRef], `${node.nodeRef}.sourceRefs`);
    nodes.push({
      nodeRef: node.nodeRef,
      kind: 'REFERENCE',
      label: node.title,
      parentRefOrNull: null,
      detailBoardRefOrNull: null,
      sourceRefs,
    });
    nodes.push({
      nodeRef: annotationRef(node.nodeRef, 'currentness'),
      kind: 'ANNOTATION',
      label: `State: ${node.state} · Freshness: ${accepted.freshness.get(node.freshnessRef).state}`,
      parentRefOrNull: node.nodeRef,
      detailBoardRefOrNull: null,
      sourceRefs,
    });
  }

  for (const edge of atlas.edges) {
    relationships.push({
      relationshipRef: `rel.vexboard.atlas.${edge.edgeRef}`,
      kind: 'REFERENCE',
      fromRef: edge.fromRef,
      toRef: edge.toRef,
      labelOrNull: edge.edgeClass,
      sourceRefs: refs([...edge.sourceRefs, edge.freshnessRef], `${edge.edgeRef}.sourceRefs`),
    });
  }

  for (const dependency of atlas.serialDependencies) {
    stableRef(dependency.serialDependencyRef, 'Process Atlas serialDependencyRef');
    assert(accepted.nodes.has(dependency.beforeRef) && accepted.nodes.has(dependency.afterRef),
      `Process Atlas serial dependency ${dependency.serialDependencyRef} endpoint missing`);
    relationships.push({
      relationshipRef: `rel.vexboard.atlas.serial.${dependency.serialDependencyRef}`,
      kind: 'FLOW',
      fromRef: dependency.beforeRef,
      toRef: dependency.afterRef,
      labelOrNull: 'SERIAL_DEPENDENCY',
      sourceRefs: refs([...dependency.sourceRefs, dependency.freshnessRef], `${dependency.serialDependencyRef}.sourceRefs`),
    });
  }

  for (const [field, refKey, textKey, prefix] of [
    ['questions', 'questionRef', 'question', 'Question'],
    ['opportunities', 'opportunityRef', 'summary', 'Opportunity'],
  ]) {
    for (const entry of atlas[field]) {
      stableRef(entry[refKey], `Process Atlas ${refKey}`);
      assert(accepted.nodes.has(entry.targetRef), `Process Atlas ${refKey} targetRef missing`);
      nodes.push({
        nodeRef: annotationRef(entry[refKey], field === 'questions' ? 'question' : 'opportunity'),
        kind: 'ANNOTATION',
        label: `${prefix}: ${text(entry[textKey], `Process Atlas ${refKey}.${textKey}`)}`,
        parentRefOrNull: entry.targetRef,
        detailBoardRefOrNull: null,
        sourceRefs: refs([...entry.sourceRefs, entry.freshnessRef], `Process Atlas ${refKey}.sourceRefs`),
      });
    }
  }

  for (const priority of atlas.priorities) {
    stableRef(priority.priorityRef, 'Process Atlas priorityRef');
    assert(accepted.nodes.has(priority.targetRef), `Process Atlas priority ${priority.priorityRef} targetRef missing`);
    assert(Number.isInteger(priority.rank) && priority.rank >= 1,
      `Process Atlas priority ${priority.priorityRef} rank invalid`);
    nodes.push({
      nodeRef: annotationRef(priority.priorityRef, 'priority'),
      kind: 'ANNOTATION',
      label: `Priority: ${priority.rank}`,
      parentRefOrNull: priority.targetRef,
      detailBoardRefOrNull: null,
      sourceRefs: refs([...priority.sourceRefs, priority.freshnessRef], `Process Atlas priority ${priority.priorityRef}.sourceRefs`),
    });
  }

  const sourceRefs = refs([
    atlas.atlasRef,
    atlas.projectionReceipt.projectionReceiptRef,
    ...(atlas.projectionReceipt.sourceRefs ?? []),
  ], 'Process Atlas source projection graph.sourceRefs');
  const boardGraph = createBoardGraph({
    schemaVersion: 'vexboard.board-graph/v1',
    graphRef,
    nodes,
    relationships,
    sourceRefs,
  });
  const projection = buildProjection(boardGraph, projectionRef, 'SYSTEM_MAP');

  return projectionResult({
    projectorRef: PROCESS_ATLAS_PUBLIC_SAFE_PROJECTOR_REF,
    boardRef,
    sourceRefs,
    graph: boardGraph,
    projection,
  });
}

// [VXG RealForever][VEXWORK][VEXBOARD][SOURCE-PROJECTORS]
