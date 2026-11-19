import fs from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  deriveJourneyRouteManifest,
  validateRelationshipLatticeSeed,
} from '../projects/vexlife-prod-end-to-end-tests/relationship-graph.mjs';

const seedPath = new URL(
  '../projects/vexlife-prod-end-to-end-tests/relationship-lattice.seed.json',
  import.meta.url,
);

function readSeed() {
  return JSON.parse(fs.readFileSync(seedPath, 'utf8'));
}

test('relationship lattice seed currentness is internally consistent', () => {
  const seed = readSeed();
  const result = validateRelationshipLatticeSeed(seed);
  assert.deepEqual(result, { ok: true, errors: [] });

  assert.equal(
    seed.sourceBindings.vexlifeProdMain,
    '98a22ede8d37b3b8868eb42f4e7a9a1d612b97d0',
  );
  assert.ok(
    seed.sourceBindings.activeCandidates.some(
      (candidate) => candidate.ref === 'github.pull.vexlife-prod.343',
    ),
  );
  assert.ok(
    !seed.sourceBindings.activeCandidates.some(
      (candidate) => ['github.pull.vexlife-prod.310', 'github.pull.vexlife-prod.331'].includes(candidate.ref),
    ),
  );

  const voice = seed.postMapPerturbationPolicy.sourceExamples.find(
    (example) => example.source === 'VexLifeVoiceInputFamily',
  );
  assert.equal(voice?.disposition, 'CURRENT_MAIN');
});

test('validator rejects stale or contradictory currentness instead of silently projecting it', () => {
  const seed = readSeed();
  seed.sourceBindings.vexlifeProdMain = '605c635ae2d034a1c4d605e829faa4813de071c3';
  seed.sourceBindings.activeCandidates.push({
    ref: 'github.pull.vexlife-prod.310',
    meaning: 'stale merged candidate',
  });
  seed.sourceBindings.activeCandidates = seed.sourceBindings.activeCandidates.filter(
    (candidate) => candidate.ref !== 'github.pull.vexlife-prod.343',
  );
  const voice = seed.postMapPerturbationPolicy.sourceExamples.find(
    (example) => example.source === 'VexLifeVoiceInputFamily',
  );
  voice.disposition = 'ACTIVE_CANDIDATE';

  const result = validateRelationshipLatticeSeed(seed);
  assert.equal(result.ok, false);
  const errors = result.errors.join('\n');
  assert.match(errors, /sourceBindings\.vexLifeProdMain/);
  assert.match(errors, /github\.pull\.vexlife-prod\.310/);
  assert.match(errors, /github\.pull\.vexlife-prod\.343/);
  assert.match(errors, /VexLifeVoiceInputFamily/);
});

test('ContextShare route manifests derive source coordinates and expose the unbound execution seam', () => {
  const seed = readSeed();
  const direct = deriveJourneyRouteManifest(
    seed,
    'journey.browser.context-share-direct-navigation',
  );
  const unlocated = deriveJourneyRouteManifest(
    seed,
    'journey.browser.context-share-internal-navigation-unlocated',
  );

  for (const route of [direct, unlocated]) {
    assert.equal(route.sourceBinding.vexLifeProdMain, seed.currentness.vexLifeProdMain);
    assert.equal(route.routeStatus, 'FRONTIER_DEBT');
    assert.deepEqual(route.missingPredicates, ['MISSING_DETERMINISTIC_TEST_ACTION']);
    assert.deepEqual(
      route.actions.map((action) => action.elementRef),
      [
        'element.vexlife-workspace.companion.conversation.context-share',
        'element.vexlife-workspace.companion.conversation.send',
      ],
    );
    assert.ok(
      route.actions.every((action) => action.executionBindingRefOrNull === null),
      'stable element identity is not itself a deterministic execution binding',
    );
    assert.ok(
      route.relationships.some(
        (relationship) =>
          relationship.from === 'element.vexlife-workspace.companion.conversation.context-share'
          && relationship.to === 'DirectPromptContext'
          && relationship.kind === 'OPTIONAL_CURRENT_PAGE_CONTEXT',
      ),
    );
    assert.ok(
      route.expectedEvidenceRefs.includes('DirectPromptContext.Receipt.browserContextIncluded'),
    );
  }

  assert.ok(
    unlocated.coordinateRefs.includes('pathway.vexlife-prod.conversation.send'),
    'the no-stale-context outcome must retain the Send pathway it makes a claim about',
  );

  assert.deepEqual(
    direct,
    deriveJourneyRouteManifest(seed, 'journey.browser.context-share-direct-navigation'),
    'one pinned seed and one journey selection must produce one deterministic route manifest',
  );
});

// [VXG RealForever][VEXWORK][VEXLIFE-PROD][E2E][RELATIONSHIP-GRAPH]
