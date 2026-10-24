import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  DEFAULT_CANVAS_EXTENT,
  PALETTE_MODES,
  PALETTE_PRESENTATION_CSS,
  canvasExtent,
  deriveBranchPresentation,
  nextPaletteMode,
  normalizePaletteMode,
  paletteModeLabel,
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
  assert.equal(paletteModeLabel('STANDARD'), 'Standard');
  assert.equal(paletteModeLabel('COLOR_SAFE'), 'Color safe');
  assert.equal(paletteModeLabel('HIGH_CONTRAST'), 'High contrast');
});

test('palette state is visibly projected across the browser canvas rather than only recoloring the icon', () => {
  assert.match(PALETTE_PRESENTATION_CSS, /palette-fab::after/);
  assert.match(PALETTE_PRESENTATION_CSS, /data-vexboard-palette="COLOR_SAFE"[^]*repeating-linear-gradient/);
  assert.match(PALETTE_PRESENTATION_CSS, /data-vexboard-palette="HIGH_CONTRAST"[^]*\.canvas/);

  const priorDocument = globalThis.document;
  const appended = [];
  const documentElement = { dataset: {}, append: (value) => appended.push(value) };
  globalThis.document = {
    documentElement,
    head: { append: (value) => appended.push(value) },
    createElement: () => ({ id: '', textContent: '' }),
    getElementById: (id) => appended.find((value) => value.id === id) ?? null,
  };
  try {
    assert.equal(normalizePaletteMode('COLOR_SAFE'), 'COLOR_SAFE');
    assert.equal(documentElement.dataset.vexboardPalette, 'COLOR_SAFE');
    assert.equal(appended.length, 1);
    assert.equal(nextPaletteMode('COLOR_SAFE'), 'HIGH_CONTRAST');
    assert.equal(documentElement.dataset.vexboardPalette, 'HIGH_CONTRAST');
    assert.equal(appended.length, 1, 'presentation stylesheet should be installed once');
  } finally {
    if (priorDocument === undefined) delete globalThis.document;
    else globalThis.document = priorDocument;
  }
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
