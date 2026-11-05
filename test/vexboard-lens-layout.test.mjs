import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  LENS_LAYOUT_DEFAULTS,
  estimateLabelSize,
  estimateNodeSize,
  layoutCollisions,
  layoutLensFace,
  placeLabelOnRoute,
  rectsOverlap,
  segmentRects,
  wrappedLineCount,
} from '../src/shared/vexboard-lens-layout.mjs';
import { faceGraph, normalizeScreenLens, screenMapGraph } from '../src/shared/vexboard-screen-lens.mjs';

const lens = normalizeScreenLens(JSON.parse(fs.readFileSync(new URL('./fixtures/screen-lens/debug-menu.hand.screen-lens.json', import.meta.url), 'utf8')));

test('word wrapping counts lines deterministically, including words longer than a line', () => {
  assert.equal(wrappedLineCount('', 10), 0);
  assert.equal(wrappedLineCount('one two three', 20), 1);
  assert.equal(wrappedLineCount('one two three', 7), 2);
  assert.equal(wrappedLineCount('abcdefghijklmnopqrstuvwxyz', 10), 3);
  assert.equal(wrappedLineCount('a abcdefghijklmnopqrstuvwxyz', 10), 4);
});

test('node and label sizes grow with content and respect line caps', () => {
  const short = estimateNodeSize({ label: 'State' });
  const long = estimateNodeSize({ label: 'x '.repeat(200), summary: 'y '.repeat(400) });
  const withFooter = estimateNodeSize({ label: 'State', footer: true });
  assert.equal(short.width, LENS_LAYOUT_DEFAULTS.nodeWidth);
  assert.equal(short.labelLines, 1);
  assert.equal(long.labelLines, LENS_LAYOUT_DEFAULTS.maxLabelLines);
  assert.equal(long.summaryLines, LENS_LAYOUT_DEFAULTS.maxSummaryLines);
  assert.ok(long.height > short.height);
  assert.equal(withFooter.height, short.height + 20);
  assert.equal(estimateLabelSize(''), null);
  assert.ok(estimateLabelSize('admits').width > estimateLabelSize('a').width);
  assert.throws(() => estimateNodeSize({ label: 'x' }, { nodeWidth: -1 }), /non-negative/);
});

test('rect overlap and segment rects are exact at the boundary', () => {
  const a = { x: 0, y: 0, width: 10, height: 10 };
  assert.equal(rectsOverlap(a, { x: 10, y: 0, width: 5, height: 5 }), false);
  assert.equal(rectsOverlap(a, { x: 10, y: 0, width: 5, height: 5 }, 1), true);
  assert.equal(rectsOverlap(a, { x: 5, y: 5, width: 2, height: 2 }), true);
  const rects = segmentRects([{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 20 }], 2);
  assert.equal(rects.length, 2, 'zero-length segments are skipped');
  assert.deepEqual(rects[0], { x: -1, y: -1, width: 12, height: 2 });
});

test('label placement avoids strict obstacles, relaxes soft ones, and reports unavoidable collisions', () => {
  const route = [{ x: 0, y: 50 }, { x: 200, y: 50 }];
  const size = { width: 40, height: 16 };
  const clear = placeLabelOnRoute(route, size);
  assert.equal(clear.collides, false);
  assert.equal(clear.box.x + clear.box.width / 2, 100, 'prefers the middle of the longest segment');

  const blocker = { x: 60, y: 30, width: 80, height: 40 };
  const moved = placeLabelOnRoute(route, size, [blocker]);
  assert.equal(moved.collides, false);
  assert.equal(rectsOverlap(moved.box, blocker, 2), false);

  const softOnly = placeLabelOnRoute(route, size, [], [{ x: -500, y: -500, width: 2000, height: 2000 }]);
  assert.equal(softOnly.collides, false, 'soft obstacles never force a collision');

  const wall = { x: -500, y: -500, width: 2000, height: 2000 };
  const forced = placeLabelOnRoute(route, size, [wall]);
  assert.equal(forced.collides, true);

  assert.throws(() => placeLabelOnRoute([{ x: 0, y: 0 }], size), /two points/);
  assert.throws(() => placeLabelOnRoute(route, { width: 0, height: 4 }), /positive/);
  assert.deepEqual(placeLabelOnRoute([{ x: 1, y: 1 }, { x: 1, y: 1 }], size), { box: null, collides: false });
});

test('layout ranks a chain top to bottom and pulls sources next to their first successor', () => {
  const layout = layoutLensFace({
    nodes: [{ ref: 'a', label: 'A' }, { ref: 'b', label: 'B' }, { ref: 'c', label: 'C' }, { ref: 'side', label: 'Side input' }],
    edges: [{ from: 'a', to: 'b' }, { from: 'b', to: 'c' }, { from: 'side', to: 'c', label: 'feeds' }],
  });
  const rank = Object.fromEntries(layout.nodes.map((node) => [node.ref, node.rank]));
  assert.deepEqual(rank, { a: 0, b: 1, c: 2, side: 1 });
  const y = Object.fromEntries(layout.nodes.map((node) => [node.ref, node.y]));
  assert.ok(y.a < y.b && y.b < y.c);
  assert.equal(y.b, y.side);
  assert.deepEqual(layoutCollisions(layout), []);
});

test('return edges travel a lane outside the content and skip edges pass through reserved slots', () => {
  const layout = layoutLensFace({
    nodes: ['a', 'b', 'c', 'd'].map((ref) => ({ ref, label: ref.toUpperCase() })),
    edges: [
      { from: 'a', to: 'b', label: 'next' },
      { from: 'b', to: 'c', label: 'next' },
      { from: 'c', to: 'd', label: 'next' },
      { from: 'a', to: 'd', label: 'skips' },
      { from: 'd', to: 'a', label: 'returns', kind: 'RETURN' },
    ],
  });
  const ret = layout.edges.find((edge) => edge.from === 'd' && edge.to === 'a');
  assert.equal(ret.route, 'RETURN');
  const contentRight = Math.max(...layout.nodes.map((node) => node.x + node.width));
  assert.ok(Math.max(...ret.points.map((point) => point.x)) > contentRight, 'return lane sits right of every node');
  const skip = layout.edges.find((edge) => edge.from === 'a' && edge.to === 'd');
  assert.equal(skip.route, 'FORWARD');
  assert.deepEqual(layoutCollisions(layout), []);
  assert.ok(layout.width >= Math.max(...ret.points.map((point) => point.x)));
});

test('self loops and empty faces do not crash and stay collision free', () => {
  const loop = layoutLensFace({ nodes: [{ ref: 'a', label: 'A' }], edges: [{ from: 'a', to: 'a', label: 'again' }] });
  assert.equal(loop.edges[0].route, 'RETURN');
  assert.deepEqual(layoutCollisions(loop), []);
  const empty = layoutLensFace({ nodes: [], edges: [] });
  assert.deepEqual(empty.nodes, []);
  assert.ok(empty.width > 0 && empty.height > 0);
});

test('layout input is validated', () => {
  assert.throws(() => layoutLensFace(null), /nodes\[\] and edges\[\]/);
  assert.throws(() => layoutLensFace({ nodes: [{ ref: '' }], edges: [] }), /ref required/);
  assert.throws(() => layoutLensFace({ nodes: [{ ref: 'a' }, { ref: 'a' }], edges: [] }), /duplicate/);
  assert.throws(() => layoutLensFace({ nodes: [{ ref: 'a' }], edges: [{ from: 'a', to: 'z' }] }), /unknown node/);
});

test('layout is deterministic for the same input', () => {
  const pathway = lens.pathways.find((entry) => entry.pathwayRef === 'pathway.theme-mode.select');
  const graph = faceGraph(pathway, 'DEPTH');
  assert.deepEqual(layoutLensFace(graph), layoutLensFace(graph));
});

test('every face of every projected pathway lays out with no node, label or route overlap', () => {
  for (const pathway of lens.pathways) {
    for (const face of ['BEHAVIOR', 'DEPTH']) {
      for (const hideBands of [[], ['DOORWAY']]) {
        const graph = faceGraph(pathway, face, { hideBands });
        if (!graph.nodes.length) continue;
        const layout = layoutLensFace({ nodes: graph.nodes.map((node) => ({ ...node, footer: true })), edges: graph.edges });
        assert.deepEqual(layoutCollisions(layout), [], `${pathway.pathwayRef} ${face} ${hideBands}`);
        assert.ok(layout.edges.every((edge) => !edge.labelCollides), `${pathway.pathwayRef} ${face} label collision`);
      }
    }
  }
});

test('the screen map lays out with no overlap', () => {
  const map = screenMapGraph(lens);
  const layout = layoutLensFace({ nodes: map.nodes, edges: map.edges }, { nodeWidth: 200 });
  assert.deepEqual(layoutCollisions(layout), []);
});

test('collision detection reports each overlap kind', () => {
  const found = layoutCollisions({
    nodes: [{ ref: 'a', x: 0, y: 0, width: 50, height: 50 }, { ref: 'b', x: 20, y: 20, width: 50, height: 50 }, { ref: 'c', x: 200, y: 0, width: 50, height: 50 }],
    edges: [
      { from: 'c', to: 'c', points: [{ x: 0, y: 25 }, { x: 300, y: 25 }], labelBox: { x: 10, y: 10, width: 20, height: 10 } },
      { from: 'c', to: 'c', points: [{ x: 210, y: 0 }, { x: 210, y: 10 }], labelBox: { x: 12, y: 12, width: 20, height: 10 } },
    ],
  });
  const types = new Set(found.map((entry) => entry.type));
  for (const type of ['NODE_NODE', 'LABEL_NODE', 'LABEL_LABEL', 'ROUTE_NODE']) assert.ok(types.has(type), type);
});

// [VXG RealForever][VEXWORK][VEXBOARD][SCREEN-LENS][LAYOUT-TEST]

test('a label too wide for a tight gap steps outward instead of covering either neighbour', () => {
  const left = { x: 0, y: 0, width: 100, height: 100 };
  const right = { x: 120, y: 0, width: 100, height: 100 };
  const route = [{ x: 100, y: 50 }, { x: 120, y: 50 }];
  const placed = placeLabelOnRoute(route, { width: 70, height: 12 }, [left, right]);
  assert.equal(placed.collides, false);
  assert.equal(rectsOverlap(placed.box, left), false);
  assert.equal(rectsOverlap(placed.box, right), false);
});
