import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  DEFAULT_CANVAS_EXTENT,
  PALETTE_MODES,
  RELATIONSHIP_VIEW_MODES,
  canvasExtent,
  defaultRelationshipViewMode,
  deriveBranchPresentation,
  nextPaletteMode,
  normalizePaletteMode,
  normalizeRelationshipViewMode,
  relationshipRoute,
  relationshipVisibleInMode,
  roleMarker,
  semanticRole,
} from '../vexboard/ui/presentation.mjs';

const businessFactory = JSON.parse(fs.readFileSync(
  new URL('../projects/vexboard/examples/vexbusinessfactory-intent-topology.board.json', import.meta.url),
  'utf8',
));

const branchGraph = {
  nodes: [
    { nodeRef: 'node.start', kind: 'PROCESS' },
    { nodeRef: 'node.choice', kind: 'DECISION' },
    { nodeRef: 'node.a', kind: 'PROCESS' },
    { nodeRef: 'node.b', kind: 'PROCESS' },
    { nodeRef: 'node.end', kind: 'PROCESS' },
  ],
  relationships: [
    { relationshipRef: 'rel.start-choice', kind: 'FLOW', fromRef: 'node.start', toRef: 'node.choice' },
    { relationshipRef: 'rel.choice-a', kind: 'FLOW', fromRef: 'node.choice', toRef: 'node.a' },
    { relationshipRef: 'rel.choice-b', kind: 'FLOW', fromRef: 'node.choice', toRef: 'node.b' },
    { relationshipRef: 'rel.a-end', kind: 'FLOW', fromRef: 'node.a', toRef: 'node.end' },
    { relationshipRef: 'rel.b-end', kind: 'FLOW', fromRef: 'node.b', toRef: 'node.end' },
  ],
};

test('palette modes cycle without creating semantic state', () => {
  assert.deepEqual(PALETTE_MODES, ['STANDARD', 'COLOR_SAFE', 'HIGH_CONTRAST']);
  assert.equal(normalizePaletteMode('UNKNOWN'), 'STANDARD');
  assert.equal(nextPaletteMode('STANDARD'), 'COLOR_SAFE');
  assert.equal(nextPaletteMode('COLOR_SAFE'), 'HIGH_CONTRAST');
  assert.equal(nextPaletteMode('HIGH_CONTRAST'), 'STANDARD');
});

test('palette state is visibly projected across the browser canvas rather than only recoloring the icon', async () => {
  const appended = [];
  const documentRef = {
    documentElement: { append: (value) => appended.push(value) },
    head: { append: (value) => appended.push(value) },
    createElement: () => ({ id: '', textContent: '' }),
    getElementById: (id) => appended.find((value) => value.id === id) ?? null,
  };

  assert.equal(normalizePaletteMode('COLOR_SAFE'), 'COLOR_SAFE');
  assert.equal(nextPaletteMode('COLOR_SAFE'), 'HIGH_CONTRAST');
  assert.equal(appended.length, 0, 'pure palette derivation must not mutate browser state');

  const priorDocument = globalThis.document;
  globalThis.document = documentRef;
  try {
    const browserModuleUrl = new URL('../vexboard/ui/presentation.mjs?palette-browser-proof', import.meta.url);
    await import(browserModuleUrl);
    await import(browserModuleUrl);
  } finally {
    if (priorDocument === undefined) delete globalThis.document;
    else globalThis.document = priorDocument;
  }

  assert.equal(appended.length, 1, 'browser presentation stylesheet should be installed once');
  assert.equal(appended[0].id, 'vexboard-palette-presentation-v2');
  assert.match(appended[0].textContent, /palette-fab::after/);
  assert.match(appended[0].textContent, /viewport\.palette-color-safe[^]*repeating-linear-gradient/);
  assert.match(appended[0].textContent, /viewport\.palette-high-contrast[^]*\.canvas/);
});

test('semantic role derives start, choice and terminal meaning from current graph shape', () => {
  assert.equal(semanticRole(branchGraph, 'node.start'), 'BEGIN');
  assert.equal(semanticRole(branchGraph, 'node.choice'), 'DECISION');
  assert.equal(semanticRole(branchGraph, 'node.end'), 'END');
  assert.equal(roleMarker('BEGIN'), 'START');
  assert.equal(roleMarker('DECISION'), 'CHOICE');
  assert.equal(roleMarker('END'), 'END');
});

test('parallel branches receive deterministic presentation accents and merges lose exclusive branch identity', () => {
  const first = deriveBranchPresentation(branchGraph);
  const second = deriveBranchPresentation(branchGraph);
  assert.deepEqual(first, second);
  assert.equal(first.hasBranching, true);
  assert.notEqual(first.relationshipAccentByRef['rel.choice-a'], first.relationshipAccentByRef['rel.choice-b']);
  assert.equal(first.nodeAccentByRef['node.end'], null);
});

test('BusinessFactory patient zero is accepted as a complex presentation pressure fixture', () => {
  const result = deriveBranchPresentation(businessFactory.graph);
  assert.equal(Object.keys(result.nodeAccentByRef).length, businessFactory.graph.nodes.length);
  for (const relationship of businessFactory.graph.relationships.filter((entry) => ['FLOW', 'TRANSITION'].includes(entry.kind))) {
    assert.equal(Number.isInteger(result.relationshipAccentByRef[relationship.relationshipRef]), true,
      `missing branch accent for ${relationship.relationshipRef}`);
  }
  assert.equal(businessFactory.graph.nodes.length >= 18, true);
  assert.equal(businessFactory.graph.relationships.length >= 20, true);
});

test('canvas extent uses a compact content envelope while retaining deterministic minimums', () => {
  assert.deepEqual(DEFAULT_CANVAS_EXTENT, { minimumWidth: 720, minimumHeight: 480, padding: 96 });
  assert.deepEqual(canvasExtent([]), { width: 720, height: 480 });
  assert.deepEqual(canvasExtent([
    { bounds: { x: 120, y: 90, width: 80, height: 50 } },
  ]), { width: 720, height: 480 });
  assert.deepEqual(canvasExtent([
    { bounds: { x: 800, y: 620, width: 80, height: 50 } },
  ]), { width: 976, height: 766 });
});

test('canvas extent grows from all visible items regardless of creation or layer order', () => {
  const items = [
    { projectionItemRef: 'item.child', layer: 4, bounds: { x: 160, y: 140, width: 120, height: 70 } },
    { projectionItemRef: 'item.frame', layer: -1, bounds: { x: 60, y: 60, width: 600, height: 460 } },
  ];
  assert.deepEqual(canvasExtent(items), { width: 756, height: 616 });
  assert.deepEqual(canvasExtent([...items].reverse()), { width: 756, height: 616 });
});

test('BusinessFactory remains intentionally horizontal while its vertical canvas hugs authored content', () => {
  assert.deepEqual(canvasExtent(businessFactory.projection.items), { width: 3066, height: 736 });
});

test('canvas extent accepts explicit boundary policy for focused consumers', () => {
  assert.deepEqual(canvasExtent([], { minimumWidth: 100, minimumHeight: 80, padding: 20 }), { width: 100, height: 80 });
  assert.deepEqual(canvasExtent([
    { bounds: { x: 120, y: 90, width: 80, height: 50 } },
  ], { minimumWidth: 100, minimumHeight: 80, padding: 20 }), { width: 220, height: 160 });
});


test('swimlane boards default to journey relationships and hide contained control hops without deleting semantics', () => {
  const graph = {
    nodes: [
      { nodeRef: 'scene.a', kind: 'SCENE', parentRefOrNull: null },
      { nodeRef: 'control.a', kind: 'CONTROL', parentRefOrNull: 'scene.a' },
      { nodeRef: 'scene.b', kind: 'SCENE', parentRefOrNull: null },
      { nodeRef: 'annotation.a', kind: 'ANNOTATION', parentRefOrNull: null },
    ],
    relationships: [
      { relationshipRef: 'rel.internal', kind: 'FLOW', fromRef: 'scene.a', toRef: 'control.a' },
      { relationshipRef: 'rel.next', kind: 'TRANSITION', fromRef: 'control.a', toRef: 'scene.b' },
      { relationshipRef: 'rel.reference', kind: 'REFERENCE', fromRef: 'annotation.a', toRef: 'scene.b' },
    ],
  };
  assert.deepEqual(RELATIONSHIP_VIEW_MODES, ['JOURNEY', 'ALL']);
  assert.equal(defaultRelationshipViewMode('SWIMLANE'), 'JOURNEY');
  assert.equal(defaultRelationshipViewMode('SYSTEM_MAP'), 'ALL');
  assert.equal(normalizeRelationshipViewMode('bogus'), 'ALL');
  assert.equal(relationshipVisibleInMode(graph, graph.relationships[0], 'JOURNEY'), false);
  assert.equal(relationshipVisibleInMode(graph, graph.relationships[1], 'JOURNEY'), true);
  assert.equal(relationshipVisibleInMode(graph, graph.relationships[2], 'JOURNEY'), false);
  assert.equal(relationshipVisibleInMode(graph, graph.relationships[2], 'ALL'), true);
});

test('relationship routing uses edge ports and orthogonal elbows rather than center-to-center diagonals', () => {
  const vertical = relationshipRoute(
    { x: 100, y: 100, width: 200, height: 80 },
    { x: 140, y: 300, width: 200, height: 80 },
  );
  assert.deepEqual(vertical.points[0], { x: 200, y: 180 });
  assert.deepEqual(vertical.points.at(-1), { x: 240, y: 300 });
  assert.equal(vertical.points[1].y, vertical.points[2].y);

  const horizontal = relationshipRoute(
    { x: 100, y: 100, width: 100, height: 80 },
    { x: 400, y: 160, width: 100, height: 80 },
  );
  assert.deepEqual(horizontal.points[0], { x: 200, y: 140 });
  assert.deepEqual(horizontal.points.at(-1), { x: 400, y: 200 });
  assert.equal(horizontal.points[1].x, horizontal.points[2].x);
});
