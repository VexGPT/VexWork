import assert from 'node:assert/strict';
import test from 'node:test';

import {
  calculateBoardJourneyPathways,
  BOARD_JOURNEY_PATHWAY_ANALYSIS_SCHEMA,
} from '../src/shared/vexboard-journey-pathway-analysis.mjs';
import {
  advanceBoardJourney,
  createBoardJourney,
  revisitBoardJourney,
} from '../src/shared/vexboard-journey.mjs';
import { BOARD_GRAPH_SCHEMA } from '../src/shared/vexboard-model.mjs';

function graphInput() {
  const node = (nodeRef) => ({
    nodeRef,
    kind: 'PROCESS',
    label: nodeRef,
    parentRefOrNull: null,
    detailBoardRefOrNull: null,
    sourceRefs: [],
  });
  return {
    schemaVersion: BOARD_GRAPH_SCHEMA,
    graphRef: 'graph.journey.pathway-analysis',
    nodes: ['node.a', 'node.b', 'node.c', 'node.d'].map(node),
    relationships: [
      { relationshipRef: 'rel.a-b', kind: 'FLOW', fromRef: 'node.a', toRef: 'node.b', labelOrNull: null, sourceRefs: [] },
      { relationshipRef: 'rel.b-d', kind: 'FLOW', fromRef: 'node.b', toRef: 'node.d', labelOrNull: null, sourceRefs: [] },
      { relationshipRef: 'rel.a-c', kind: 'FLOW', fromRef: 'node.a', toRef: 'node.c', labelOrNull: null, sourceRefs: [] },
      { relationshipRef: 'rel.c-d', kind: 'FLOW', fromRef: 'node.c', toRef: 'node.d', labelOrNull: null, sourceRefs: [] },
      { relationshipRef: 'rel.d-a', kind: 'FLOW', fromRef: 'node.d', toRef: 'node.a', labelOrNull: null, sourceRefs: [] },
    ],
    sourceRefs: [],
  };
}

function repeatedLoopJourney(graph) {
  let journey = createBoardJourney(graph, {
    journeyRef: 'journey.pathway-analysis',
    boardRef: 'board.pathway-analysis',
    startRef: 'node.a',
  });
  for (const relationshipRef of [
    'rel.a-b', 'rel.b-d', 'rel.d-a',
    'rel.a-c', 'rel.c-d', 'rel.d-a',
    'rel.a-b', 'rel.b-d', 'rel.d-a',
  ]) {
    journey = advanceBoardJourney(graph, journey, relationshipRef);
  }
  return journey;
}

test('pathway analysis interns exact closed relationship motifs while preserving raw Journey evidence', () => {
  const graph = graphInput();
  const journey = repeatedLoopJourney(graph);
  const before = JSON.stringify(journey);

  const analysis = calculateBoardJourneyPathways(graph, journey);

  assert.equal(analysis.schemaVersion, BOARD_JOURNEY_PATHWAY_ANALYSIS_SCHEMA);
  assert.equal(analysis.analysisRef, 'journey.pathway-analysis.pathways');
  assert.equal(analysis.journeyRef, journey.journeyRef);
  assert.equal(analysis.boardRef, journey.boardRef);
  assert.equal(analysis.rawStepCount, 10);
  assert.equal(JSON.stringify(journey), before);
  assert.deepEqual(analysis.effects, {
    graphChanged: false,
    journeyChanged: false,
    externalEffectsPerformed: false,
  });

  assert.equal(analysis.motifs.length, 2);
  assert.deepEqual(
    analysis.motifs.map((motif) => [
      motif.label,
      motif.anchorRef,
      motif.relationshipRefs,
      motif.semanticRefs,
      motif.occurrenceCount,
      motif.occurrences,
    ]),
    [
      [
        'Loop 1',
        'node.a',
        ['rel.a-b', 'rel.b-d', 'rel.d-a'],
        ['node.a', 'node.b', 'node.d', 'node.a'],
        2,
        [
          { startSequence: 0, endSequence: 3 },
          { startSequence: 6, endSequence: 9 },
        ],
      ],
      [
        'Loop 2',
        'node.a',
        ['rel.a-c', 'rel.c-d', 'rel.d-a'],
        ['node.a', 'node.c', 'node.d', 'node.a'],
        1,
        [{ startSequence: 3, endSequence: 6 }],
      ],
    ],
  );

  assert.deepEqual(analysis.repeatedMotifRefs, ['journey.pathway-analysis.pathways.loop.1']);
  assert.deepEqual(
    analysis.reducedWalk.map((entry) => entry.kind === 'LOOP_REF'
      ? [entry.kind, entry.motifRef, entry.occurrenceIndex, entry.startSequence, entry.endSequence]
      : [entry.kind, entry.sequence, entry.semanticRef]),
    [
      ['STEP', 0, 'node.a'],
      ['LOOP_REF', 'journey.pathway-analysis.pathways.loop.1', 1, 0, 3],
      ['LOOP_REF', 'journey.pathway-analysis.pathways.loop.2', 1, 3, 6],
      ['LOOP_REF', 'journey.pathway-analysis.pathways.loop.1', 2, 6, 9],
    ],
  );
});

test('non-relationship revisit navigation remains literal and is not misclassified as a process loop', () => {
  const graph = graphInput();
  let journey = createBoardJourney(graph, {
    journeyRef: 'journey.pathway-revisit',
    boardRef: 'board.pathway-analysis',
    startRef: 'node.a',
  });
  journey = advanceBoardJourney(graph, journey, 'rel.a-b');
  journey = revisitBoardJourney(graph, journey, 0);

  const analysis = calculateBoardJourneyPathways(graph, journey, {
    analysisRef: 'analysis.pathway.revisit',
  });

  assert.deepEqual(analysis.motifs, []);
  assert.deepEqual(analysis.repeatedMotifRefs, []);
  assert.deepEqual(
    analysis.reducedWalk.map((entry) => [entry.kind, entry.semanticRef, entry.navigationKind]),
    [
      ['STEP', 'node.a', 'START'],
      ['STEP', 'node.b', 'RELATIONSHIP'],
      ['STEP', 'node.a', 'REVISIT'],
    ],
  );
});

test('motif identity follows ordered relationship refs rather than visible node sequence alone', () => {
  const graph = graphInput();
  graph.relationships.push(
    { relationshipRef: 'rel.a-b.alt', kind: 'FLOW', fromRef: 'node.a', toRef: 'node.b', labelOrNull: null, sourceRefs: [] },
  );

  let journey = createBoardJourney(graph, {
    journeyRef: 'journey.pathway.parallel',
    boardRef: 'board.pathway-analysis',
    startRef: 'node.a',
  });
  for (const relationshipRef of [
    'rel.a-b', 'rel.b-d', 'rel.d-a',
    'rel.a-b.alt', 'rel.b-d', 'rel.d-a',
  ]) {
    journey = advanceBoardJourney(graph, journey, relationshipRef);
  }

  const analysis = calculateBoardJourneyPathways(graph, journey, {
    analysisRef: 'analysis.pathway.parallel',
  });

  assert.equal(analysis.motifs.length, 2);
  assert.deepEqual(
    analysis.motifs.map((motif) => motif.semanticRefs),
    [
      ['node.a', 'node.b', 'node.d', 'node.a'],
      ['node.a', 'node.b', 'node.d', 'node.a'],
    ],
  );
  assert.notDeepEqual(
    analysis.motifs[0].relationshipRefs,
    analysis.motifs[1].relationshipRefs,
  );
  assert.deepEqual(analysis.repeatedMotifRefs, []);
});

// [VXG RealForever][VEXWORK][VEXBOARD][JOURNEY-PATHWAY-ANALYSIS][TEST]
