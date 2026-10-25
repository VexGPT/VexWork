import { freezeBoardValue, normalizeBoardGraph } from './vexboard-model.mjs';
import { normalizeBoardJourney } from './vexboard-journey.mjs';

export const BOARD_JOURNEY_PATHWAY_ANALYSIS_SCHEMA = 'vexboard.journey-pathway-analysis/v1';

const REF = /^[A-Za-z0-9][A-Za-z0-9._:/-]*$/u;

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function stableRef(value, label) {
  assert(typeof value === 'string' && REF.test(value), `${label} must be one stable ref`);
  return value;
}

function graphValue(input) {
  const value = structuredClone(input);
  delete value.semanticFingerprint;
  return normalizeBoardGraph(value);
}

function firstClosedRelationshipLoop(steps, startSequence) {
  const anchorRef = steps[startSequence].semanticRef;
  const relationshipRefs = [];
  const semanticRefs = [anchorRef];

  for (let sequence = startSequence + 1; sequence < steps.length; sequence += 1) {
    const step = steps[sequence];
    if (step.navigationKind !== 'RELATIONSHIP') return null;
    relationshipRefs.push(step.viaRelationshipRefOrNull);
    semanticRefs.push(step.semanticRef);
    if (step.semanticRef === anchorRef) {
      return {
        startSequence,
        endSequence: sequence,
        anchorRef,
        relationshipRefs,
        semanticRefs,
      };
    }
  }
  return null;
}

function motifSignature(occurrence) {
  return JSON.stringify({
    anchorRef: occurrence.anchorRef,
    relationshipRefs: occurrence.relationshipRefs,
  });
}

export function calculateBoardJourneyPathways(graphInput, journeyInput, { analysisRef } = {}) {
  const graph = graphValue(graphInput);
  const journey = normalizeBoardJourney(journeyInput, graph);
  const acceptedAnalysisRef = stableRef(analysisRef ?? `${journey.journeyRef}.pathways`, 'analysisRef');

  const discovered = [];
  let discoveryCursor = 0;
  while (discoveryCursor < journey.steps.length - 1) {
    const occurrence = firstClosedRelationshipLoop(journey.steps, discoveryCursor);
    if (occurrence) {
      discovered.push({ ...occurrence, signature: motifSignature(occurrence) });
      discoveryCursor = occurrence.endSequence;
      continue;
    }
    discoveryCursor += 1;
  }

  const motifBySignature = new Map();
  for (const occurrence of discovered) {
    if (!motifBySignature.has(occurrence.signature)) {
      motifBySignature.set(occurrence.signature, {
        signature: occurrence.signature,
        firstStartSequence: occurrence.startSequence,
        anchorRef: occurrence.anchorRef,
        relationshipRefs: [...occurrence.relationshipRefs],
        semanticRefs: [...occurrence.semanticRefs],
        occurrences: [],
      });
    }
    motifBySignature.get(occurrence.signature).occurrences.push({
      startSequence: occurrence.startSequence,
      endSequence: occurrence.endSequence,
    });
  }

  const motifRecords = [...motifBySignature.values()]
    .sort((left, right) =>
      left.firstStartSequence - right.firstStartSequence
      || left.signature.localeCompare(right.signature))
    .map((motif, index) => ({
      motifRef: `${acceptedAnalysisRef}.loop.${index + 1}`,
      label: `Loop ${index + 1}`,
      anchorRef: motif.anchorRef,
      semanticRefs: motif.semanticRefs,
      relationshipRefs: motif.relationshipRefs,
      occurrenceCount: motif.occurrences.length,
      occurrences: motif.occurrences,
    }));

  const motifByOccurrenceKey = new Map();
  for (const motif of motifRecords) {
    motif.occurrences.forEach((occurrence, index) => {
      motifByOccurrenceKey.set(
        `${occurrence.startSequence}:${occurrence.endSequence}`,
        { motif, occurrenceIndex: index + 1 },
      );
    });
  }

  const reducedWalk = [{
    kind: 'STEP',
    sequence: 0,
    semanticRef: journey.steps[0].semanticRef,
    navigationKind: journey.steps[0].navigationKind,
    viaRelationshipRefOrNull: journey.steps[0].viaRelationshipRefOrNull,
  }];

  let cursor = 0;
  while (cursor < journey.steps.length - 1) {
    const candidate = firstClosedRelationshipLoop(journey.steps, cursor);
    const resolved = candidate
      ? motifByOccurrenceKey.get(`${candidate.startSequence}:${candidate.endSequence}`)
      : null;

    if (candidate && resolved) {
      reducedWalk.push({
        kind: 'LOOP_REF',
        motifRef: resolved.motif.motifRef,
        label: resolved.motif.label,
        occurrenceIndex: resolved.occurrenceIndex,
        startSequence: candidate.startSequence,
        endSequence: candidate.endSequence,
      });
      cursor = candidate.endSequence;
      continue;
    }

    cursor += 1;
    const step = journey.steps[cursor];
    reducedWalk.push({
      kind: 'STEP',
      sequence: step.sequence,
      semanticRef: step.semanticRef,
      navigationKind: step.navigationKind,
      viaRelationshipRefOrNull: step.viaRelationshipRefOrNull,
    });
  }

  const repeatedMotifRefs = motifRecords
    .filter((motif) => motif.occurrenceCount > 1)
    .map((motif) => motif.motifRef);

  return freezeBoardValue({
    schemaVersion: BOARD_JOURNEY_PATHWAY_ANALYSIS_SCHEMA,
    analysisRef: acceptedAnalysisRef,
    journeyRef: journey.journeyRef,
    boardRef: journey.boardRef,
    rawStepCount: journey.steps.length,
    motifs: motifRecords,
    repeatedMotifRefs,
    reducedWalk,
    effects: {
      graphChanged: false,
      journeyChanged: false,
      externalEffectsPerformed: false,
    },
  });
}

// [VXG RealForever][VEXWORK][VEXBOARD][JOURNEY-PATHWAY-ANALYSIS]
