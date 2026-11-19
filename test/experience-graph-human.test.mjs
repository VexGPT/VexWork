import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { deriveHumanExperienceConvergence } from '../src/core/experience-graph-human.mjs';

const readJson = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url), 'utf8'));

function result() {
  const graph = readJson('../projects/vexlife-prod-end-to-end-tests/experience-graph/generated/experience-relationship-graph.json');
  const derivation = readJson('../projects/vexlife-prod-end-to-end-tests/experience-graph/generated/routes.json');
  const seed = readJson('../projects/vexlife-prod-end-to-end-tests/relationship-lattice.seed.json');
  return deriveHumanExperienceConvergence(graph, derivation, seed);
}

function candidateResult() {
  const graph = readJson('../projects/vexlife-prod-end-to-end-tests/experience-graph/generated/builds/consolidated-claude/experience-relationship-graph.json');
  const derivation = readJson('../projects/vexlife-prod-end-to-end-tests/experience-graph/generated/builds/consolidated-claude/routes.json');
  const seed = readJson('../projects/vexlife-prod-end-to-end-tests/relationship-lattice.seed.json');
  return deriveHumanExperienceConvergence(graph, derivation, seed);
}

test('structural route completeness does not overclaim end-to-end human proof', () => {
  const convergence = result();
  const vision = convergence.focusFamilies.find((row) => row.family === 'VexLifeVisionFamily');
  assert.ok(vision);
  assert.ok(vision.structural.CLEARED > 0, 'Vision should have mechanically complete source routes');
  assert.ok(vision.experience.FRONTIER_DEBT > 0, 'Vision should remain human-proof debt until its deterministic/deeper execution seam exists');

  const voice = convergence.focusFamilies.find((row) => row.family === 'VexLifeVoiceInputFamily');
  assert.ok(voice);
  assert.ok(voice.structural.CLEARED > 0, 'Voice source law is mechanically traversable');
  assert.ok(voice.experience.FRONTIER_DEBT > 0, 'Voice runtime realization still needs an executable deeper harness for an E2E claim');
});

test('human-semantic relationships supplement the extractor without becoming a second mechanical graph', () => {
  const convergence = result();
  const memoryAcceptance = convergence.relationships.find((row) => row.from === 'VexLifeMemoryReviewOwner.keep' && row.to === 'VexLifeSemanticAcceptanceWriter.keepWithConversationLease');
  assert.ok(memoryAcceptance);
  assert.equal(memoryAcceptance.coverage, 'CURATED_SOURCE_RELATIONSHIP');

  const contextShare = convergence.relationships.find((row) => row.kind === 'OPTIONAL_CURRENT_PAGE_CONTEXT');
  assert.ok(contextShare);
  assert.equal(contextShare.coverage, 'CURATED_HUMAN_RELATIONSHIP');

  const sourceReturn = convergence.relationships.find((row) => row.from === 'DirectConversationSourceReturn' && row.to === 'DirectPromptContext');
  assert.ok(sourceReturn);
  assert.equal(sourceReturn.coverage, 'CURATED_HUMAN_RELATIONSHIP');
});

test('Context Profile accepted-Send capture reuses the exact mechanically-derived source edge', () => {
  const convergence = candidateResult();
  const capture = convergence.relationships.find(
    (row) => row.kind === 'CAPTURED_AT_SEND'
      && row.from === 'VexLifeContextProfileStore'
      && row.to === 'DirectCompanionTurn.Intent.contextProfile',
  );
  assert.ok(capture);
  assert.equal(capture.coverage, 'DERIVED_EXACT');
});

test('mechanical connectivity does not impersonate a curated semantic relationship', () => {
  const graph = {
    source: { repository: 'VexGPT/VexLife-Prod', commit: 'a'.repeat(40) },
    edges: [
      { ref: 'edge:1', kind: 'CONSUMED_BY', from: 'HumanOwner', to: 'MiddleOwner' },
      { ref: 'edge:2', kind: 'PROJECTS_TO', from: 'MiddleOwner', to: 'PromptOwner' },
    ],
  };
  const derivation = { routes: [], cases: [], journeys: [] };
  const seed = {
    projectRef: 'project.vexlife-prod.end-to-end-tests',
    currentness: { vexLifeProdMain: 'b'.repeat(40) },
    sourceBindings: {},
    surfaceBindings: [],
    journeySeeds: [],
    loopSeeds: [],
    crossOwnerRows: [{
      from: 'HumanOwner',
      to: 'PromptOwner',
      kind: 'SOURCE_RETURN_RESULT_MATERIALIZES_IN_PROMPT',
      disposition: 'CURRENT_SOURCE_RELATIONSHIP',
      humanMeaning: 'A human-semantic relationship that is not mechanically derived by the two incidental edges.',
    }],
  };
  const convergence = deriveHumanExperienceConvergence(graph, derivation, seed);
  assert.equal(convergence.relationships[0].coverage, 'CURATED_HUMAN_RELATIONSHIP');
  assert.deepEqual(convergence.relationships[0].graphPath, ['edge:1', 'edge:2']);
});

test('candidate Language Family is mechanically present in Claude consolidated topology but not human-E2E cleared', () => {
  const oldMain = result();
  const before = oldMain.journeys.find((row) => row.journeyRef === 'journey.language.reply-screen-independence');
  assert.ok(before);
  assert.equal(before.status, 'UNKNOWN');

  const convergence = candidateResult();
  const languageFamily = convergence.focusFamilies.find((row) => row.family === 'VexLifeLanguageFamily');
  assert.ok(languageFamily);
  assert.equal(languageFamily.structural.CLEARED, 6);
  assert.equal(languageFamily.routeCount, 6);
  assert.equal(languageFamily.experience.CLEARED, 0);
  assert.equal(languageFamily.experience.FRONTIER_DEBT, 6);

  const language = convergence.journeys.find((row) => row.journeyRef === 'journey.language.reply-screen-independence');
  assert.ok(language);
  assert.equal(language.status, 'FRONTIER_DEBT');
  assert.ok(language.missing.some((row) => row.predicate === 'MISSING_DETERMINISTIC_TEST_ACTION'));
});

test('language routes stay scoped to the human journey they mean', () => {
  const convergence = candidateResult();

  const replyHistory = convergence.journeys.find((row) => row.journeyRef === 'journey.language.reply-switch-history');
  assert.ok(replyHistory);
  assert.equal(replyHistory.routeRefs.length, 2);
  assert.ok(replyHistory.routeRefs.every((ref) => ref.includes(':ChooseReplyLanguage:')));

  const independence = convergence.journeys.find((row) => row.journeyRef === 'journey.language.reply-screen-independence');
  assert.ok(independence);
  assert.equal(independence.routeRefs.length, 6);

  const voice = convergence.journeys.find((row) => row.journeyRef === 'journey.voice.spoken-composer-reply-separation');
  assert.ok(voice);
  const languageRoutes = voice.routeRefs.filter((ref) => ref.startsWith('route:VexLifeLanguageFamily.'));
  assert.equal(languageRoutes.length, 2);
  assert.ok(languageRoutes.every((ref) => ref.includes(':ChooseReplyLanguage:')));
});

test('current human journeys preserve Product truth that the old source pin could not mechanically derive', () => {
  const convergence = result();
  const sourceReturn = convergence.journeys.find((row) => row.journeyRef === 'journey.conversation.source-return-host-truth');
  assert.ok(sourceReturn);
  assert.equal(sourceReturn.status, 'FRONTIER_DEBT');
  assert.ok(sourceReturn.missing.some((row) => row.predicate === 'SOURCE_RETURN_RELATIONSHIP_NOT_MECHANICALLY_DERIVED'));

  const contextShare = convergence.journeys.find((row) => row.journeyRef === 'journey.browser.context-share-navigation-invalidation');
  assert.ok(contextShare);
  assert.equal(contextShare.status, 'FRONTIER_DEBT');
});

// [VXG RealForever][VEXWORK][VEXLIFE-PROD][E2E][EXPERIENCE-CONVERGENCE]
