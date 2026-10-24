import assert from 'node:assert/strict';
import test from 'node:test';

import { createBoardGraph } from '../src/core/vexboard.mjs';
import {
  BOARD_EVIDENCE_SCHEMA,
  evidenceForSemanticRef,
  normalizeBoardEvidence,
} from '../src/shared/vexboard-evidence.mjs';

const graph = createBoardGraph({
  schemaVersion: 'vexboard.board-graph/v1',
  graphRef: 'graph.vexboard.third-party-walkthrough',
  nodes: [
    {
      nodeRef: 'node.stripe.api-keys',
      kind: 'PROCESS',
      label: 'Open Stripe API keys',
      parentRefOrNull: null,
      detailBoardRefOrNull: null,
      sourceRefs: ['source.walkthrough.stripe'],
    },
    {
      nodeRef: 'node.github.pages',
      kind: 'PROCESS',
      label: 'Configure GitHub Pages',
      parentRefOrNull: null,
      detailBoardRefOrNull: null,
      sourceRefs: ['source.walkthrough.github-pages'],
    },
  ],
  relationships: [
    {
      relationshipRef: 'rel.walkthrough.stripe-github-pages',
      kind: 'FLOW',
      fromRef: 'node.stripe.api-keys',
      toRef: 'node.github.pages',
      labelOrNull: 'next',
      sourceRefs: [],
    },
  ],
  sourceRefs: ['source.walkthrough.third-party-setup'],
});

function evidenceFixture() {
  return {
    schemaVersion: BOARD_EVIDENCE_SCHEMA,
    evidenceSetRef: 'evidence-set.third-party-setup',
    boardRef: 'board.third-party-setup',
    graphRef: graph.graphRef,
    slots: [
      {
        slotRef: 'evidence-slot.stripe.api-keys',
        semanticRef: 'node.stripe.api-keys',
        expectation: 'Expected visual: Stripe Developers > API keys is visible before copying a key.',
        sourceRefs: ['source.walkthrough.stripe'],
      },
      {
        slotRef: 'evidence-slot.github.pages',
        semanticRef: 'node.github.pages',
        expectation: 'Expected visual: GitHub Pages shows the selected deployment source and published URL.',
        sourceRefs: ['source.walkthrough.github-pages'],
      },
    ],
    artifacts: [
      {
        artifactRef: 'evidence-artifact.stripe.api-keys.reference',
        slotRef: 'evidence-slot.stripe.api-keys',
        role: 'REFERENCE',
        assetRef: 'asset.screenshot.stripe.api-keys.expected',
        journeyRefOrNull: null,
        journeyStepSequenceOrNull: null,
        interactionRefOrNull: null,
        configurationRefOrNull: 'configuration.browser.desktop',
        capturedAtOrNull: null,
        contentSha256OrNull: null,
        sourceRefs: ['manual.reference.stripe.api-keys'],
      },
      {
        artifactRef: 'evidence-artifact.stripe.api-keys.observed',
        slotRef: 'evidence-slot.stripe.api-keys',
        role: 'OBSERVED',
        assetRef: 'asset.screenshot.stripe.api-keys.observed',
        journeyRefOrNull: 'journey.third-party-setup',
        journeyStepSequenceOrNull: 3,
        interactionRefOrNull: null,
        configurationRefOrNull: 'configuration.browser.desktop',
        capturedAtOrNull: '2026-10-24T05:30:00.000Z',
        contentSha256OrNull: 'a'.repeat(64),
        sourceRefs: ['manual.observation.stripe.api-keys'],
      },
    ],
    sourceRefs: ['source.walkthrough.third-party-setup'],
  };
}

test('evidence slots can exist as expected-image placeholders without any artifact', () => {
  const input = evidenceFixture();
  input.artifacts = input.artifacts.filter((artifact) => artifact.slotRef !== 'evidence-slot.github.pages');

  const accepted = normalizeBoardEvidence(input, graph);
  const pages = evidenceForSemanticRef(accepted, graph, 'node.github.pages');
  assert.equal(pages.length, 1);
  assert.equal(pages[0].slotRef, 'evidence-slot.github.pages');
  assert.match(pages[0].expectation, /Expected visual:/);
  assert.deepEqual(pages[0].artifacts, []);
});

test('one evidence slot can carry manual reference context and observed proof without changing semantic identity', () => {
  const accepted = normalizeBoardEvidence(evidenceFixture(), graph);
  const stripe = evidenceForSemanticRef(accepted, graph, 'node.stripe.api-keys');

  assert.equal(stripe.length, 1);
  assert.equal(stripe[0].slotRef, 'evidence-slot.stripe.api-keys');
  assert.equal(stripe[0].artifacts.length, 2);

  const reference = stripe[0].artifacts.find((artifact) => artifact.role === 'REFERENCE');
  const observed = stripe[0].artifacts.find((artifact) => artifact.role === 'OBSERVED');

  assert.equal(reference.assetRef, 'asset.screenshot.stripe.api-keys.expected');
  assert.equal(reference.capturedAtOrNull, null);
  assert.equal(reference.sourceRefs.includes('manual.reference.stripe.api-keys'), true);

  assert.equal(observed.assetRef, 'asset.screenshot.stripe.api-keys.observed');
  assert.equal(observed.journeyRefOrNull, 'journey.third-party-setup');
  assert.equal(observed.journeyStepSequenceOrNull, 3);
  assert.equal(observed.configurationRefOrNull, 'configuration.browser.desktop');
  assert.equal(observed.contentSha256OrNull, 'a'.repeat(64));
});

test('artifact/configuration variants do not mutate the stable expected-visual slot', () => {
  const input = evidenceFixture();
  input.artifacts.push({
    artifactRef: 'evidence-artifact.stripe.api-keys.observed.mobile',
    slotRef: 'evidence-slot.stripe.api-keys',
    role: 'OBSERVED',
    assetRef: 'asset.screenshot.stripe.api-keys.observed.mobile',
    journeyRefOrNull: 'journey.third-party-setup',
    journeyStepSequenceOrNull: 3,
    interactionRefOrNull: null,
    configurationRefOrNull: 'configuration.browser.mobile',
    capturedAtOrNull: '2026-10-24T05:31:00.000Z',
    contentSha256OrNull: 'b'.repeat(64),
    sourceRefs: ['manual.observation.stripe.api-keys.mobile'],
  });

  const stripe = evidenceForSemanticRef(input, graph, 'node.stripe.api-keys');
  assert.equal(stripe[0].slotRef, 'evidence-slot.stripe.api-keys');
  assert.equal(stripe[0].artifacts.length, 3);
  assert.deepEqual(
    stripe[0].artifacts.map((artifact) => artifact.configurationRefOrNull).sort(),
    ['configuration.browser.desktop', 'configuration.browser.desktop', 'configuration.browser.mobile'],
  );
});

test('evidence fails closed on unknown semantic/slot coordinates and malformed observed proof', () => {
  const unknownSemantic = evidenceFixture();
  unknownSemantic.slots[0].semanticRef = 'node.missing';
  assert.throws(() => normalizeBoardEvidence(unknownSemantic, graph), /semanticRef missing/);

  const unknownSlot = evidenceFixture();
  unknownSlot.artifacts[0].slotRef = 'evidence-slot.missing';
  assert.throws(() => normalizeBoardEvidence(unknownSlot, graph), /slot missing/);

  const observedWithoutTime = evidenceFixture();
  observedWithoutTime.artifacts.find((artifact) => artifact.role === 'OBSERVED').capturedAtOrNull = null;
  assert.throws(() => normalizeBoardEvidence(observedWithoutTime, graph), /requires capturedAt/);

  const badTimestamp = evidenceFixture();
  badTimestamp.artifacts.find((artifact) => artifact.role === 'OBSERVED').capturedAtOrNull = '2026-10-24T05:30:00Z';
  assert.throws(() => normalizeBoardEvidence(badTimestamp, graph), /canonical UTC ISO/);

  const badHash = evidenceFixture();
  badHash.artifacts.find((artifact) => artifact.role === 'OBSERVED').contentSha256OrNull = 'abc';
  assert.throws(() => normalizeBoardEvidence(badHash, graph), /must be sha256 or null/);

  const stepWithoutJourney = evidenceFixture();
  const observed = stepWithoutJourney.artifacts.find((artifact) => artifact.role === 'OBSERVED');
  observed.journeyRefOrNull = null;
  assert.throws(() => normalizeBoardEvidence(stepWithoutJourney, graph), /journey step requires journeyRef/);
});

// [VXG RealForever][VEXWORK][VEXBOARD][EVIDENCE]
