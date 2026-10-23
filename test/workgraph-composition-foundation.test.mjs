import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { composeWorkgraph, createWorkgraphSegment } from '../src/core/workgraph-composition.mjs';
import { createProject, createWorkgraph, projectWorkRefs } from '../src/core/workgraph.mjs';

const read = (relative) => JSON.parse(fs.readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8'));
const registry = read('blueprint/work-registry.json');
const publicSource = read('workgraphs/public.json');
const foundationSource = read('workgraphs/segments/vexwork-foundation.json');
const foundationProjectSource = read('projects/vexwork-foundation/project.json');

test('Foundation source segment remains exactly compatible with the accepted Workgraph identity', () => {
  const accepted = createWorkgraph(publicSource, registry);
  const foundationSegment = createWorkgraphSegment(foundationSource, registry);
  const foundationRefs = new Set(foundationSegment.items.map((item) => item.workRef));

  const project = createProject(foundationProjectSource);
  assert.deepEqual(
    [...foundationRefs].sort(),
    projectWorkRefs(project, accepted),
  );

  const remainderItems = publicSource.items.filter((item) => !foundationRefs.has(item.workRef));
  const remainderTransitions = publicSource.transitions.filter((transition) => !foundationRefs.has(transition.workRef));

  const remainder = {
    schemaVersion: 'vexwork.workgraph-segment/v1',
    segmentRef: 'segment.vexwork.compatibility-remainder',
    graphRef: publicSource.graphRef,
    items: remainderItems,
    transitions: remainderTransitions,
    sourceRefs: ['workgraphs/public.json'],
    formedAt: publicSource.formedAt,
  };

  const result = composeWorkgraph({
    composition: {
      schemaVersion: 'vexwork.workgraph-composition/v2',
      compositionRef: 'composition.vexwork.public.shadow-foundation',
      graphRef: publicSource.graphRef,
      sourceRefs: publicSource.sourceRefs,
      compatibilityOrder: {
        itemWorkRefs: publicSource.items.map((item) => item.workRef),
        transitionRefs: publicSource.transitions.map((transition) => transition.transitionRef),
        rootWorkRefs: publicSource.rootWorkRefs,
        sourceRefs: publicSource.sourceRefs,
      },
      formedAt: publicSource.formedAt,
    },
    segments: [foundationSegment, remainder],
    registry,
  });

  assert.equal(result.graph.semanticFingerprint, accepted.semanticFingerprint);
  assert.deepEqual(result.graph, accepted);
  assert.equal(result.graph.items.length, publicSource.items.length);
  assert.equal(result.graph.transitions.length, publicSource.transitions.length);
  assert.equal(result.graph.sourceRefs.includes('workgraphs/segments/vexwork-foundation.json'), false);
});

test('Foundation source segment owns only local containment and local transitions', () => {
  const refs = new Set(foundationSource.items.map((item) => item.workRef));
  assert.equal(foundationSource.items.length, 8);
  assert.equal(foundationSource.transitions.length, 13);
  assert.equal(
    foundationSource.items.every((item) => item.parentWorkRefOrNull === null || refs.has(item.parentWorkRefOrNull)),
    true,
  );
  assert.equal(
    foundationSource.transitions.every((transition) => refs.has(transition.workRef)),
    true,
  );
});

// [VXG RealForever][VEXWORK][WORKGRAPH-COMPOSITION][FOUNDATION-PATIENT-ZERO]
