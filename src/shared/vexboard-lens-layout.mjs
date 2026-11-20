// Deterministic, overlap-free layout for one Screen Lens face.
//
// The layout answers a presentation question only: where should already-owned
// nodes, relationship routes and relationship labels sit so none of them cover
// another? It never decides semantic order, identity or containment.
//
//   rank      longest forward path, then sources pulled next to their first successor
//   order     barycenter sweeps inside each rank (stable)
//   routes    orthogonal; forward hops use gutter channels, long hops pass through
//             reserved slots, return edges travel a lane outside the content
//   labels    placed on the route where they cover no node and no other label

export const LENS_LAYOUT_DEFAULTS = Object.freeze({
  nodeWidth: 232,
  rowGap: 52,
  colGap: 36,
  laneGap: 16,
  margin: 24,
  channelSpacing: 15,
  labelCharWidth: 5.9,
  labelHeight: 16,
  labelPadding: 12,
  nodeCharWidth: 7.2,
  nodeLineHeight: 17,
  summaryCharWidth: 6.0,
  summaryLineHeight: 14,
  nodeChromeHeight: 42,
  maxLabelLines: 3,
  maxSummaryLines: 3,
});

function options(input = {}) {
  const merged = { ...LENS_LAYOUT_DEFAULTS, ...input };
  for (const [key, value] of Object.entries(merged)) {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
      throw new TypeError(`layout option ${key} must be a non-negative finite number`);
    }
  }
  return merged;
}

export function wrappedLineCount(text, charsPerLine) {
  const words = String(text ?? '').trim().split(/\s+/).filter(Boolean);
  if (!words.length) return 0;
  const width = Math.max(1, Math.floor(charsPerLine));
  let lines = 1;
  let used = 0;
  for (const word of words) {
    let remaining = word.length;
    if (used > 0 && used + 1 + remaining <= width) {
      used += 1 + remaining;
      continue;
    }
    if (used > 0) {
      lines += 1;
      used = 0;
    }
    while (remaining > width) {
      lines += 1;
      remaining -= width;
    }
    used = remaining;
  }
  return lines;
}

export function estimateNodeSize(node, optionsInput = {}) {
  const o = options(optionsInput);
  const inner = o.nodeWidth - 20;
  const labelLines = Math.min(o.maxLabelLines, Math.max(1, wrappedLineCount(node?.label, inner / o.nodeCharWidth)));
  const summaryLines = Math.min(o.maxSummaryLines, wrappedLineCount(node?.summary, inner / o.summaryCharWidth));
  const height = o.nodeChromeHeight
    + labelLines * o.nodeLineHeight
    + (summaryLines ? summaryLines * o.summaryLineHeight + 4 : 0)
    + (node?.footer ? 20 : 0);
  return Object.freeze({ width: o.nodeWidth, height, labelLines, summaryLines });
}

export function estimateLabelSize(text, optionsInput = {}) {
  const o = options(optionsInput);
  const length = String(text ?? '').length;
  if (!length) return null;
  return Object.freeze({ width: Math.ceil(length * o.labelCharWidth + o.labelPadding), height: o.labelHeight });
}

export function rectsOverlap(a, b, pad = 0) {
  return a.x < b.x + b.width + pad
    && b.x < a.x + a.width + pad
    && a.y < b.y + b.height + pad
    && b.y < a.y + a.height + pad;
}

function overlapArea(a, b) {
  const w = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);
  const h = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);
  return w > 0 && h > 0 ? w * h : 0;
}

function segmentsOf(points) {
  const segments = [];
  for (let i = 0; i < points.length - 1; i += 1) {
    const a = points[i];
    const b = points[i + 1];
    const length = Math.hypot(b.x - a.x, b.y - a.y);
    if (length < 0.5) continue;
    segments.push({ a, b, length, horizontal: Math.abs(b.y - a.y) < 0.5, index: i });
  }
  return segments;
}

export function segmentRects(points, thickness = 2) {
  return segmentsOf(points).map(({ a, b }) => Object.freeze({
    x: Math.min(a.x, b.x) - thickness / 2,
    y: Math.min(a.y, b.y) - thickness / 2,
    width: Math.abs(b.x - a.x) + thickness,
    height: Math.abs(b.y - a.y) + thickness,
  }));
}

const LABEL_STOPS = Object.freeze([0.5, 0.35, 0.65, 0.2, 0.8, 0.1, 0.9]);

function labelCandidates(points, size) {
  const candidates = [];
  const segments = segmentsOf(points)
    .map((segment, order) => ({ ...segment, order }))
    .sort((left, right) => right.length - left.length || left.order - right.order);
  for (const segment of segments) {
    for (const t of LABEL_STOPS) {
      const x = segment.a.x + (segment.b.x - segment.a.x) * t;
      const y = segment.a.y + (segment.b.y - segment.a.y) * t;
      const centers = segment.horizontal
        ? (segment.length >= size.width + 16
          ? [{ x, y }, { x, y: y - size.height / 2 - 4 }, { x, y: y + size.height / 2 + 4 }]
          : [{ x, y: y - size.height / 2 - 4 }, { x, y: y + size.height / 2 + 4 }])
        : [{ x: x + size.width / 2 + 6, y }, { x: x - size.width / 2 - 6, y }, { x, y }];
      for (const center of centers) {
        candidates.push(Object.freeze({
          x: Math.round(center.x - size.width / 2),
          y: Math.round(center.y - size.height / 2),
          width: size.width,
          height: size.height,
        }));
      }
    }
  }
  if (!segments.length) return candidates;
  // Last resort for tight gaps: step outward above and below the route's middle.
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const midX = (Math.min(...xs) + Math.max(...xs)) / 2;
  for (let step = 1; step <= 6; step += 1) {
    const offset = step * (size.height + 4);
    for (const y of [Math.min(...ys) - offset, Math.max(...ys) + offset]) {
      candidates.push(Object.freeze({ x: Math.round(midX - size.width / 2), y: Math.round(y - size.height / 2), width: size.width, height: size.height }));
    }
  }
  return candidates;
}

// Returns { box, collides }. `strict` obstacles are avoided first together with
// `soft` obstacles (other routes); if no candidate is clear of both, soft
// obstacles are relaxed. A placement that still touches a strict obstacle is
// reported as colliding rather than silently accepted.
export function placeLabelOnRoute(points, size, strict = [], soft = []) {
  if (!Array.isArray(points) || points.length < 2) throw new TypeError('label route needs at least two points');
  if (!size || !(size.width > 0) || !(size.height > 0)) throw new TypeError('label size must be positive');
  const candidates = labelCandidates(points, size);
  if (!candidates.length) return Object.freeze({ box: null, collides: false });
  const clear = (box, list) => !list.some((obstacle) => rectsOverlap(box, obstacle, 2));
  const tidy = candidates.find((box) => clear(box, strict) && clear(box, soft));
  if (tidy) return Object.freeze({ box: tidy, collides: false });
  const relaxed = candidates.find((box) => clear(box, strict));
  if (relaxed) return Object.freeze({ box: relaxed, collides: false });
  let best = candidates[0];
  let bestArea = Infinity;
  for (const box of candidates) {
    const area = strict.reduce((sum, obstacle) => sum + overlapArea(box, obstacle), 0);
    if (area < bestArea) {
      best = box;
      bestArea = area;
    }
  }
  return Object.freeze({ box: best, collides: true });
}

function simplify(points) {
  const out = [];
  for (const point of points) {
    const last = out[out.length - 1];
    if (last && Math.abs(last.x - point.x) < 0.5 && Math.abs(last.y - point.y) < 0.5) continue;
    out.push(Object.freeze({ x: Math.round(point.x * 10) / 10, y: Math.round(point.y * 10) / 10 }));
  }
  const reduced = [];
  for (const point of out) {
    const a = reduced[reduced.length - 2];
    const b = reduced[reduced.length - 1];
    if (a && b && ((a.x === b.x && b.x === point.x) || (a.y === b.y && b.y === point.y))) {
      reduced[reduced.length - 1] = point;
    } else {
      reduced.push(point);
    }
  }
  return Object.freeze(reduced);
}

function validate(input) {
  if (!input || !Array.isArray(input.nodes) || !Array.isArray(input.edges)) {
    throw new TypeError('layout input needs nodes[] and edges[]');
  }
  const index = new Map();
  input.nodes.forEach((node, i) => {
    if (typeof node?.ref !== 'string' || !node.ref) throw new TypeError('layout node ref required');
    if (index.has(node.ref)) throw new TypeError(`duplicate layout node ${node.ref}`);
    index.set(node.ref, i);
  });
  input.edges.forEach((edge) => {
    if (!index.has(edge?.from) || !index.has(edge?.to)) {
      throw new TypeError(`layout edge ${edge?.from} -> ${edge?.to} references an unknown node`);
    }
  });
  return index;
}

function classifyReturnEdges(nodes, edges, index) {
  const outgoing = nodes.map(() => []);
  edges.forEach((edge, i) => outgoing[index.get(edge.from)].push(i));
  const state = new Array(nodes.length).fill(0);
  const back = new Set();
  for (let root = 0; root < nodes.length; root += 1) {
    if (state[root]) continue;
    const stack = [{ node: root, next: 0 }];
    state[root] = 1;
    while (stack.length) {
      const frame = stack[stack.length - 1];
      if (frame.next >= outgoing[frame.node].length) {
        state[frame.node] = 2;
        stack.pop();
        continue;
      }
      const edgeIndex = outgoing[frame.node][frame.next];
      frame.next += 1;
      const target = index.get(edges[edgeIndex].to);
      if (state[target] === 1) back.add(edgeIndex);
      else if (state[target] === 0) {
        state[target] = 1;
        stack.push({ node: target, next: 0 });
      }
    }
  }
  return back;
}

function rankNodes(nodes, forward, index) {
  const preds = nodes.map(() => []);
  const succs = nodes.map(() => []);
  for (const edge of forward) {
    const from = index.get(edge.from);
    const to = index.get(edge.to);
    preds[to].push(from);
    succs[from].push(to);
  }
  const indegree = preds.map((list) => list.length);
  const queue = [];
  indegree.forEach((value, i) => { if (value === 0) queue.push(i); });
  const order = [];
  const rank = new Array(nodes.length).fill(0);
  while (queue.length) {
    queue.sort((a, b) => a - b);
    const current = queue.shift();
    order.push(current);
    for (const next of succs[current]) {
      rank[next] = Math.max(rank[next], rank[current] + 1);
      indegree[next] -= 1;
      if (indegree[next] === 0) queue.push(next);
    }
  }
  for (const current of [...order].reverse()) {
    if (preds[current].length === 0 && succs[current].length > 0) {
      rank[current] = Math.min(...succs[current].map((next) => rank[next])) - 1;
    }
  }
  return { rank, preds, succs };
}

export function layoutLensFace(input, optionsInput = {}) {
  const o = options(optionsInput);
  const index = validate(input);
  const nodes = input.nodes;
  const edges = input.edges.map((edge, i) => ({ ...edge, order: i }));
  const back = classifyReturnEdges(nodes, edges, index);
  const forward = edges.filter((_, i) => !back.has(i));
  const returns = edges.filter((_, i) => back.has(i));
  const { rank } = rankNodes(nodes, forward, index);
  const rankCount = nodes.length ? Math.max(...rank) + 1 : 0;

  // items: real nodes plus pass-through slots for forward edges that skip ranks
  const items = nodes.map((node, i) => {
    const size = estimateNodeSize(node, o);
    return { key: node.ref, ref: node.ref, real: true, rank: rank[i], seed: i, width: size.width, height: size.height };
  });
  const chains = new Map();
  for (const edge of forward) {
    const from = items[index.get(edge.from)];
    const to = items[index.get(edge.to)];
    const chain = [from];
    for (let r = from.rank + 1; r < to.rank; r += 1) {
      const slot = { key: `slot:${edge.order}:${r}`, real: false, rank: r, seed: from.seed + 0.5, width: o.laneGap, height: 0 };
      items.push(slot);
      chain.push(slot);
    }
    chain.push(to);
    chains.set(edge.order, chain);
  }

  const ranks = Array.from({ length: rankCount }, () => []);
  for (const item of items) ranks[item.rank].push(item);
  ranks.forEach((row) => row.sort((a, b) => a.seed - b.seed));
  const hopsUp = new Map();
  const hopsDown = new Map();
  for (const chain of chains.values()) {
    for (let i = 0; i < chain.length - 1; i += 1) {
      const a = chain[i];
      const b = chain[i + 1];
      if (!hopsDown.has(a.key)) hopsDown.set(a.key, []);
      if (!hopsUp.has(b.key)) hopsUp.set(b.key, []);
      hopsDown.get(a.key).push(b);
      hopsUp.get(b.key).push(a);
    }
  }
  const position = new Map();
  const refreshPositions = () => ranks.forEach((row) => row.forEach((item, i) => position.set(item.key, i)));
  refreshPositions();
  const sweep = (rows, neighbours) => {
    for (const row of rows) {
      const scored = row.map((item, i) => {
        const linked = neighbours.get(item.key) || [];
        const bary = linked.length ? linked.reduce((sum, other) => sum + position.get(other.key), 0) / linked.length : i;
        return { item, bary, i };
      });
      scored.sort((a, b) => a.bary - b.bary || a.i - b.i);
      row.splice(0, row.length, ...scored.map((entry) => entry.item));
      refreshPositions();
    }
  };
  for (let pass = 0; pass < 2; pass += 1) {
    sweep(ranks.slice(1), hopsUp);
    sweep(ranks.slice(0, -1).reverse(), hopsDown);
  }

  // horizontal placement: each rank centred inside the widest rank
  const rowWidth = (row) => row.reduce((sum, item) => sum + item.width, 0) + Math.max(0, row.length - 1) * o.colGap;
  const contentWidth = Math.max(o.nodeWidth, ...ranks.map(rowWidth));
  const left = o.margin;
  for (const row of ranks) {
    let x = left + (contentWidth - rowWidth(row)) / 2;
    for (const item of row) {
      item.x = x;
      x += item.width + o.colGap;
    }
  }
  const contentRight = left + contentWidth;

  // gutter channel demand: gutter g sits above rank g; gutter rankCount sits below the last rank
  const gutterDemand = new Array(rankCount + 1).fill(0);
  const hopChannels = [];
  for (const [order, chain] of chains) {
    for (let i = 0; i < chain.length - 1; i += 1) {
      hopChannels.push({ order, a: chain[i], b: chain[i + 1], gutter: chain[i + 1].rank });
    }
  }
  const sortedReturns = [...returns].sort((a, b) => {
    const span = (edge) => rank[index.get(edge.from)] - rank[index.get(edge.to)];
    return span(a) - span(b) || a.order - b.order;
  });
  const returnTracks = sortedReturns.map((edge, lane) => ({
    edge,
    lane,
    exitGutter: rank[index.get(edge.from)] + 1,
    entryGutter: rank[index.get(edge.to)],
  }));

  // ports along node top (incoming) and bottom (outgoing), ordered by the far end
  const centerX = (item) => item.x + item.width / 2;
  const portsOut = new Map();
  const portsIn = new Map();
  const claim = (map, item, token, farX) => {
    if (!item.real) return;
    if (!map.has(item.key)) map.set(item.key, []);
    map.get(item.key).push({ token, farX });
  };
  for (const hop of hopChannels) {
    claim(portsOut, hop.a, `hop:${hop.order}:${hop.a.key}`, centerX(hop.b));
    claim(portsIn, hop.b, `hop:${hop.order}:${hop.b.key}`, centerX(hop.a));
  }
  for (const track of returnTracks) {
    const from = items[index.get(track.edge.from)];
    const to = items[index.get(track.edge.to)];
    claim(portsOut, from, `ret:${track.edge.order}`, contentRight + 1e6);
    claim(portsIn, to, `ret:${track.edge.order}`, contentRight + 1e6);
  }
  const portX = new Map();
  for (const map of [portsOut, portsIn]) {
    for (const [key, list] of map) {
      const item = items.find((candidate) => candidate.key === key);
      list.sort((a, b) => a.farX - b.farX || (a.token < b.token ? -1 : 1));
      list.forEach((port, i) => portX.set(`${map === portsOut ? 'out' : 'in'}|${port.token}`, item.x + (item.width * (i + 1)) / (list.length + 1)));
    }
  }
  const xOut = (item, token) => (item.real ? portX.get(`out|${token}`) : centerX(item));
  const xIn = (item, token) => (item.real ? portX.get(`in|${token}`) : centerX(item));

  const channelUsers = Array.from({ length: rankCount + 1 }, () => []);
  for (const hop of hopChannels) {
    const ax = xOut(hop.a, `hop:${hop.order}:${hop.a.key}`);
    const bx = xIn(hop.b, `hop:${hop.order}:${hop.b.key}`);
    hop.ax = ax;
    hop.bx = bx;
    if (Math.abs(ax - bx) > 1) channelUsers[hop.gutter].push({ kind: 'hop', hop, sortX: Math.min(ax, bx) });
  }
  for (const track of returnTracks) {
    channelUsers[track.exitGutter].push({ kind: 'exit', track, sortX: 1e6 + track.lane });
    channelUsers[track.entryGutter].push({ kind: 'entry', track, sortX: 2e6 + track.lane });
  }
  channelUsers.forEach((users, g) => { gutterDemand[g] = users.length; });

  // vertical placement
  const rowHeight = ranks.map((row) => Math.max(0, ...row.map((item) => item.height)));
  const gutterHeight = gutterDemand.map((demand, g) => {
    const needed = demand ? (demand + 1) * o.channelSpacing + o.labelHeight : 0;
    if (g === 0 || g === rankCount) return demand ? needed : 0;
    return Math.max(o.rowGap, needed);
  });
  const rowTop = [];
  let y = o.margin + gutterHeight[0];
  for (let r = 0; r < rankCount; r += 1) {
    rowTop[r] = y;
    y += rowHeight[r] + gutterHeight[r + 1];
  }
  for (const item of items) item.y = rowTop[item.rank];
  const gutterTop = (g) => (g === 0 ? o.margin : rowTop[g - 1] + rowHeight[g - 1]);
  const channelY = new Map();
  channelUsers.forEach((users, g) => {
    users.sort((a, b) => a.sortX - b.sortX);
    users.forEach((user, i) => {
      const yValue = gutterTop(g) + o.channelSpacing * (i + 1);
      channelY.set(user.kind === 'hop' ? `hop:${user.hop.order}:${user.hop.a.key}` : `${user.kind}:${user.track.edge.order}`, yValue);
    });
  });

  // routes
  const routeEdges = [];
  for (const edge of forward) {
    const chain = chains.get(edge.order);
    const points = [];
    for (let i = 0; i < chain.length - 1; i += 1) {
      const a = chain[i];
      const b = chain[i + 1];
      const token = `hop:${edge.order}:${a.key}`;
      const ax = xOut(a, token);
      const bx = xIn(b, `hop:${edge.order}:${b.key}`);
      const startY = a.real ? a.y + a.height : rowTop[a.rank] + rowHeight[a.rank];
      const endY = b.real ? b.y : rowTop[b.rank];
      points.push({ x: ax, y: startY });
      if (Math.abs(ax - bx) > 1) {
        const cy = channelY.get(token);
        points.push({ x: ax, y: cy }, { x: bx, y: cy });
      }
      points.push({ x: bx, y: endY });
    }
    routeEdges.push({ edge, route: 'FORWARD', points: simplify(points) });
  }
  for (const track of returnTracks) {
    const from = items[index.get(track.edge.from)];
    const to = items[index.get(track.edge.to)];
    const laneX = contentRight + o.laneGap * (track.lane + 1);
    const sx = xOut(from, `ret:${track.edge.order}`);
    const tx = xIn(to, `ret:${track.edge.order}`);
    const exitY = channelY.get(`exit:${track.edge.order}`);
    const entryY = channelY.get(`entry:${track.edge.order}`);
    routeEdges.push({
      edge: track.edge,
      route: 'RETURN',
      points: simplify([
        { x: sx, y: from.y + from.height },
        { x: sx, y: exitY },
        { x: laneX, y: exitY },
        { x: laneX, y: entryY },
        { x: tx, y: entryY },
        { x: tx, y: to.y },
      ]),
    });
  }
  routeEdges.sort((a, b) => a.edge.order - b.edge.order);

  // labels
  const realItems = items.filter((item) => item.real);
  const nodeRects = realItems.map((item) => ({ x: item.x, y: item.y, width: item.width, height: item.height }));
  const placed = [];
  const laidEdges = routeEdges.map((entry) => {
    const size = estimateLabelSize(entry.edge.label, o);
    let labelBox = null;
    let collides = false;
    if (size) {
      const soft = routeEdges.filter((other) => other !== entry).flatMap((other) => segmentRects(other.points));
      const result = placeLabelOnRoute(entry.points, size, [...nodeRects, ...placed], soft);
      labelBox = result.box;
      collides = result.collides;
      if (labelBox) placed.push(labelBox);
    }
    return Object.freeze({
      from: entry.edge.from,
      to: entry.edge.to,
      label: entry.edge.label ?? null,
      kind: entry.edge.kind ?? 'FLOW',
      route: entry.route,
      points: entry.points,
      labelBox,
      labelCollides: collides,
    });
  });

  const extents = [
    ...nodeRects,
    ...placed,
    ...laidEdges.flatMap((edge) => segmentRects(edge.points)),
  ];
  const width = Math.ceil(Math.max(contentRight, ...extents.map((rect) => rect.x + rect.width)) + o.margin);
  const height = Math.ceil(Math.max(o.margin, ...extents.map((rect) => rect.y + rect.height)) + o.margin);
  return Object.freeze({
    nodes: Object.freeze(realItems.map((item) => Object.freeze({
      ref: item.ref,
      x: Math.round(item.x),
      y: Math.round(item.y),
      width: item.width,
      height: item.height,
      rank: item.rank,
    }))),
    edges: Object.freeze(laidEdges),
    width,
    height,
  });
}

// Reports every overlap a reader would see: node/node, label/node, label/label,
// and routes that cross a node they do not start or end at.
export function layoutCollisions(layout) {
  const found = [];
  const { nodes, edges } = layout;
  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      if (rectsOverlap(nodes[i], nodes[j])) found.push({ type: 'NODE_NODE', a: nodes[i].ref, b: nodes[j].ref });
    }
  }
  const labels = edges.filter((edge) => edge.labelBox);
  for (const edge of labels) {
    for (const node of nodes) {
      if (rectsOverlap(edge.labelBox, node)) found.push({ type: 'LABEL_NODE', a: `${edge.from}->${edge.to}`, b: node.ref });
    }
  }
  for (let i = 0; i < labels.length; i += 1) {
    for (let j = i + 1; j < labels.length; j += 1) {
      if (rectsOverlap(labels[i].labelBox, labels[j].labelBox)) {
        found.push({ type: 'LABEL_LABEL', a: `${labels[i].from}->${labels[i].to}`, b: `${labels[j].from}->${labels[j].to}` });
      }
    }
  }
  for (const edge of edges) {
    for (const node of nodes) {
      if (node.ref === edge.from || node.ref === edge.to) continue;
      const inner = { x: node.x + 1, y: node.y + 1, width: node.width - 2, height: node.height - 2 };
      if (segmentRects(edge.points, 0).some((rect) => rectsOverlap(rect, inner))) {
        found.push({ type: 'ROUTE_NODE', a: `${edge.from}->${edge.to}`, b: node.ref });
      }
    }
  }
  return found;
}

// [VXG RealForever][VEXWORK][VEXBOARD][SCREEN-LENS][LAYOUT]
