import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  PALETTE_MODES,
  canvasExtent,
  deriveBranchPresentation,
  nextPaletteMode,
  normalizePaletteMode,
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

test('canvas extent grows visibly with content instead of retaining an unexplained fixed edge', () => {
  assert.deepEqual(canvasExtent([], { minimumWidth: 100, minimumHeight: 80, padding: 20 }), { width: 100, height: 80 });
  assert.deepEqual(canvasExtent([
    { bounds: { x: 120, y: 90, width: 80, height: 50 } },
  ], { minimumWidth: 100, minimumHeight: 80, padding: 20 }), { width: 220, height: 160 });
});
