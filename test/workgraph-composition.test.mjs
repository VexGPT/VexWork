import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  composeWorkgraph,
  createWorkgraphComposition,
  createWorkgraphSegment,
} from '../src/core/workgraph-composition.mjs';

const registry = JSON.parse(fs.readFileSync(new URL('../blueprint/work-registry.json', import.meta.url), 'utf8'));

const item = ({
  workRef,
  parentWorkRefOrNull = null,
  dependencyRefs = [],
  state = 'READY',
  workClass = 'TASK',
  updatedAt = '2026-10-22T07:00:00.000Z',
}) => ({
  schemaVersion: 'vexwork.work-item/v1',
  workRef,
  parentWorkRefOrNull,
  label: workRef,
  purpose: `Prove composed work identity for ${workRef}.`,
  workClass,
  state,
  workDisposition: 'ACTIVE',
  priorityClass: 'NORMAL',
  dependencyRefs,
  repositoryRefs: ['repo.vexwork'],
  sourceRefs: ['test.workgraph-composition'],
  formationProcessRefOrNull: null,
  nextProcessRefs: [],
  authorityDisposition: 'AUTHORIZED_BOUNDED',
  effectDisposition: 'EFFECTS_BOUND',
  createdAt: '2026-10-22T07:00:00.000Z',
  updatedAt,
});

const transition = ({ transitionRef, workRef, priorState, nextState, createdAt }) => ({
  schemaVersion: 'vexwork.work-transition/v1',
  transitionRef,
  workRef,
  priorState,
  nextState,
  reason: 'composition transition proof',
  actorRef: 'actor.test',
  sourceRefs: ['test.workgraph-composition'],
  createdAt,
});

function composition() {
  return {
    schemaVersion: 'vexwork.workgraph-composition/v1',
    compositionRef: 'composition.test.public',
    graphRef: 'workgraph.test.composed',
    sourceRefs: ['test.workgraph-composition'],
    formedAt: '2026-10-22T07:00:00.000Z',
  };
}

function segment({ segmentRef, items, transitions = [] }) {
  return {
    schemaVersion: 'vexwork.workgraph-segment/v1',
    segmentRef,
    graphRef: 'workgraph.test.composed',
    items,
    transitions,
    sourceRefs: [`source.${segmentRef}`],
    formedAt: '2026-10-22T07:00:00.000Z',
  };
}

test('independent work-family segments compose into one canonical Workgraph with cross-segment dependencies', () => {
  const alpha = segment({
    segmentRef: 'segment.alpha',
    items: [
      item({ workRef: 'work.alpha.outcome', workClass: 'OUTCOME' }),
      item({
        workRef: 'work.alpha.task',
        parentWorkRefOrNull: 'work.alpha.outcome',
        dependencyRefs: ['work.beta.task'],
      }),
    ],
  });
  const beta = segment({
    segmentRef: 'segment.beta',
    items: [item({ workRef: 'work.beta.task' })],
  });

  const result = composeWorkgraph({ composition: composition(), segments: [alpha, beta], registry });
  assert.equal(result.graph.items.length, 3);
  assert.deepEqual(result.graph.rootWorkRefs, ['work.alpha.outcome', 'work.beta.task']);
  assert.deepEqual(
    result.graph.items.find((candidate) => candidate.workRef === 'work.alpha.task').dependencyRefs,
    ['work.beta.task'],
  );
  assert.deepEqual(result.segmentRefs, ['segment.alpha', 'segment.beta']);
  assert.equal(result.effects, false);
  assert.equal(result.executionAuthority, 'NONE');
});

test('composition is deterministic regardless of segment input order', () => {
  const alpha = segment({
    segmentRef: 'segment.alpha',
    items: [item({ workRef: 'work.alpha.task' })],
  });
  const beta = segment({
    segmentRef: 'segment.beta',
    items: [item({ workRef: 'work.beta.task', dependencyRefs: ['work.alpha.task'] })],
  });

  const left = composeWorkgraph({ composition: composition(), segments: [alpha, beta], registry });
  const right = composeWorkgraph({ composition: composition(), segments: [beta, alpha], registry });
  assert.equal(left.graph.semanticFingerprint, right.graph.semanticFingerprint);
  assert.deepEqual(left.graph, right.graph);
});

test('one Work item cannot be owned by more than one segment', () => {
  const duplicate = item({ workRef: 'work.shared.task' });
  assert.throws(() => composeWorkgraph({
    composition: composition(),
    segments: [
      segment({ segmentRef: 'segment.alpha', items: [duplicate] }),
      segment({ segmentRef: 'segment.beta', items: [duplicate] }),
    ],
    registry,
  }), /workRef belongs to more than one segment/);
});

test('containment stays inside one segment while dependencies may cross segments', () => {
  assert.throws(() => createWorkgraphSegment(segment({
    segmentRef: 'segment.child',
    items: [item({
      workRef: 'work.child.task',
      parentWorkRefOrNull: 'work.parent.outcome',
    })],
  }), registry), /segment containment must remain local/);
});

test('transition history stays with the segment that owns its Work item', () => {
  const source = segment({
    segmentRef: 'segment.lifecycle',
    items: [item({
      workRef: 'work.lifecycle.task',
      state: 'RUNNING',
      updatedAt: '2026-10-22T07:00:02.000Z',
    })],
    transitions: [
      transition({
        transitionRef: 'transition.lifecycle.running',
        workRef: 'work.lifecycle.task',
        priorState: 'READY',
        nextState: 'RUNNING',
        createdAt: '2026-10-22T07:00:02.000Z',
      }),
    ],
  });
  const result = composeWorkgraph({ composition: composition(), segments: [source], registry });
  assert.equal(result.graph.transitions.length, 1);
  assert.equal(result.graph.transitions[0].workRef, 'work.lifecycle.task');

  assert.throws(() => createWorkgraphSegment(segment({
    segmentRef: 'segment.foreign-transition',
    items: [item({ workRef: 'work.local.task' })],
    transitions: [
      transition({
        transitionRef: 'transition.foreign',
        workRef: 'work.somewhere-else.task',
        priorState: 'READY',
        nextState: 'RUNNING',
        createdAt: '2026-10-22T07:00:03.000Z',
      }),
    ],
  }), registry), /segment transition work must be locally owned/);
});

test('global Workgraph validation still rejects missing or cyclic cross-segment dependencies', () => {
  assert.throws(() => composeWorkgraph({
    composition: composition(),
    segments: [
      segment({
        segmentRef: 'segment.missing',
        items: [item({ workRef: 'work.missing.task', dependencyRefs: ['work.nope.task'] })],
      }),
    ],
    registry,
  }), /dependency missing/);

  assert.throws(() => composeWorkgraph({
    composition: composition(),
    segments: [
      segment({
        segmentRef: 'segment.alpha',
        items: [item({ workRef: 'work.alpha.task', dependencyRefs: ['work.beta.task'] })],
      }),
      segment({
        segmentRef: 'segment.beta',
        items: [item({ workRef: 'work.beta.task', dependencyRefs: ['work.alpha.task'] })],
      }),
    ],
    registry,
  }), /dependency cycle detected/);
});

test('stored composition and segment fingerprints fail closed when tampered', () => {
  const acceptedComposition = createWorkgraphComposition(composition());
  const acceptedSegment = createWorkgraphSegment(segment({
    segmentRef: 'segment.alpha',
    items: [item({ workRef: 'work.alpha.task' })],
  }), registry);

  assert.throws(() => createWorkgraphComposition({
    ...acceptedComposition,
    graphRef: 'workgraph.tampered',
  }), /semanticFingerprint mismatch/);

  assert.throws(() => createWorkgraphSegment({
    ...acceptedSegment,
    sourceRefs: ['source.tampered'],
  }, registry), /semanticFingerprint mismatch/);
});

// [VXG RealForever][VEXWORK][WORKGRAPH-COMPOSITION]
