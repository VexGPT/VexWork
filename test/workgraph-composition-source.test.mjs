import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { composeWorkgraph, createWorkgraphComposition, createWorkgraphSegment } from '../src/core/workgraph-composition.mjs';
import { createWorkgraph } from '../src/core/workgraph.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relative) => JSON.parse(fs.readFileSync(path.join(ROOT, relative), 'utf8'));
const registry = read('blueprint/work-registry.json');
const compositionSource = read('workgraphs/composition.json');
const publicSource = read('workgraphs/public.json');
const segmentPaths = fs.readdirSync(path.join(ROOT, 'workgraphs', 'segments'))
  .filter((name) => name.endsWith('.json'))
  .sort()
  .map((name) => `workgraphs/segments/${name}`);
const segments = segmentPaths.map(read);

test('source-managed segments compose to the exact checked-in canonical Workgraph', () => {
  const composition = createWorkgraphComposition(compositionSource);
  const result = composeWorkgraph({ composition, segments, registry });
  const accepted = createWorkgraph(publicSource, registry);

  assert.equal(segments.length, 9);
  assert.equal(result.graph.semanticFingerprint, accepted.semanticFingerprint);
  assert.deepEqual(result.graph, accepted);
  assert.equal(result.graph.items.length, publicSource.items.length);
  assert.equal(result.graph.transitions.length, publicSource.transitions.length);
});

test('every Work item and transition belongs to exactly one source segment', () => {
  const acceptedSegments = segments.map((segment) => createWorkgraphSegment(segment, registry));
  const workRefs = acceptedSegments.flatMap((segment) => segment.items.map((item) => item.workRef));
  const transitionRefs = acceptedSegments.flatMap((segment) => segment.transitions.map((transition) => transition.transitionRef));

  assert.equal(new Set(workRefs).size, workRefs.length);
  assert.equal(new Set(transitionRefs).size, transitionRefs.length);
  assert.deepEqual([...workRefs].sort(), publicSource.items.map((item) => item.workRef).sort());
  assert.deepEqual([...transitionRefs].sort(), publicSource.transitions.map((transition) => transition.transitionRef).sort());
});

test('segment containment is local while cross-segment dependencies remain legal composition edges', () => {
  const owner = new Map();
  for (const segment of segments) {
    for (const item of segment.items) owner.set(item.workRef, segment.segmentRef);
  }
  for (const segment of segments) {
    for (const item of segment.items) {
      if (item.parentWorkRefOrNull) assert.equal(owner.get(item.parentWorkRefOrNull), segment.segmentRef);
    }
  }
  const crossDependencies = segments.flatMap((segment) => segment.items.flatMap((item) =>
    item.dependencyRefs
      .filter((dependencyRef) => owner.get(dependencyRef) !== segment.segmentRef)
      .map((dependencyRef) => ({ from: item.workRef, to: dependencyRef })),
  ));
  assert.deepEqual(crossDependencies, [{
    from: 'work.vexwork.history.foundational-infrastructure-backfill',
    to: 'work.vexwork.visibility.public-dashboard',
  }]);
});

// [VXG RealForever][VEXWORK][WORKGRAPH-COMPOSITION][SOURCE-ADOPTION]
