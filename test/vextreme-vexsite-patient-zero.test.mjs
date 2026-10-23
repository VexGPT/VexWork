import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { projectDerivedAttention } from '../src/core/derived-attention-projection.mjs';
import {
  applyDerivedWorkPromotion,
  createDerivedWorkPromotionDecision,
  createDerivedWorkPromotionProposal,
} from '../src/core/derived-work-promotion.mjs';
import { createWorkgraph } from '../src/core/workgraph.mjs';
import { createVextremeVexSitePopulation } from '../src/adapters/vextreme-vexsite-population.mjs';
import {
  VEXTREME_VEXSITE_LOCALIZATION_GENERATED_PREDICATE_REF,
  VEXTREME_VEXSITE_LOCALIZATION_TIER_PREDICATE_REF,
  createVextremeVexSiteLocalizationEvidenceBatch,
  createVextremeVexSiteLocalizationLens,
  localePredicateRef,
} from '../src/adapters/vextreme-vexsite-localization.mjs';

const read = (relative) => JSON.parse(fs.readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8'));
const observation = read('projects/vexwork-operational-console/vexsite-patient-zero-observation.json');
const registry = read('blueprint/work-registry.json');
const currentGraph = createWorkgraph(read('workgraphs/public.json'), registry);

const OBSERVED_AT = '2026-10-23T02:20:00.000Z';
const TARGETS = observation.targetLocales;
const COMPLETE = observation.scopes.conversationsWithGod.completeSlugs;
const INCOMPLETE = observation.scopes.conversationsWithGod.incompleteSlugs;
const ALL = [...COMPLETE, ...INCOMPLETE];

function title(slug) {
  return slug.split('-').map((part) => part[0].toUpperCase() + part.slice(1)).join(' ');
}

function indexFixture() {
  const slugMap = Object.fromEntries(ALL.map((slug) => [slug, {
    slug,
    title: title(slug),
    arcKeys: ['convos_with_god'],
    date: '',
    vexData: {},
    viewmodel: {
      category: 'production',
      template: 'page',
      scopes: [`pages.${slug}`],
      features: ['lang'],
    },
  }]));
  const pageLanguageMap = Object.fromEntries(ALL.map((slug) => [slug, {
    availableLangs: COMPLETE.includes(slug) ? ['en', ...TARGETS] : ['en'],
    completeLangs: COMPLETE.includes(slug) ? ['en', ...TARGETS] : ['en'],
  }]));

  return {
    contentFingerprint: 'c0ffee000001',
    nodeCount: ALL.length,
    curatedNodeCount: ALL.length,
    autoDiscoveredCount: 0,
    arcCount: 1,
    supportedLangs: ['en', ...TARGETS],
    sourceOnlyScopes: [],
    slugMap,
    pageLanguageMap,
    arcMap: {
      convos_with_god: [{ label: 'Conversations with God', slugs: ALL }],
    },
    arcMeta: {
      convos_with_god: {
        title: 'Conversations with God',
        url: 'https://www.vextreme24.com/archives',
        renderMode: 'dots',
      },
    },
    departmentMap: {
      rd: {
        conversations: ALL.map((slug) => ({ slug, title: title(slug), ported: true })),
      },
    },
  };
}

function makePopulation(index = indexFixture()) {
  return createVextremeVexSitePopulation({
    index,
    observedAt: OBSERVED_AT,
    sourceRefs: [
      observation.observationRef,
      `github.commit.vextreme.${observation.providerCommit}`,
    ],
  });
}

function makeLens() {
  return createVextremeVexSiteLocalizationLens({
    targetLocales: TARGETS,
    sourceRefs: [
      observation.observationRef,
      'projects/vexwork-operational-console/VEXSITE-PATIENT-ZERO.md',
    ],
  });
}

function makeEvidence(population, lens, existingWorkRefsByEntityRef = {}) {
  return createVextremeVexSiteLocalizationEvidenceBatch({
    index: indexFixture(),
    population,
    lens,
    observedAt: OBSERVED_AT,
    generatedCurrentnessByEntityRef: {
      'entity.vextreme.vexsite.page.what-is-the-god-spark': {
        state: 'SATISFIED',
        evidenceRefs: ['github.pull.vextreme.376'],
      },
      'entity.vextreme.vexsite.page.clarity-on-christianity': {
        state: 'UNSATISFIED',
        evidenceRefs: ['github.pull.vextreme.379'],
      },
    },
    existingWorkRefsByEntityRef,
  });
}

function makeProjection(existingWorkRefsByEntityRef = {}) {
  const population = makePopulation();
  const lens = makeLens();
  const evidence = makeEvidence(population, lens, existingWorkRefsByEntityRef);
  return {
    population,
    lens,
    evidence,
    projection: projectDerivedAttention({ population, lens, evidence }),
  };
}

test('provider observation preserves the live P2 population and Conversations-with-God correction', () => {
  assert.equal(observation.providerCommit, '87a013e00fe13d43688e4c7abd1ea7ebaecca243');
  assert.equal(observation.contentFingerprint, '4eaafb71685d');
  assert.equal(observation.population.portedPageCount, 115);
  assert.equal(observation.population.completeCount, 34);
  assert.equal(observation.population.incompleteCount, 80);
  assert.equal(observation.population.notApplicableCount, 1);
  assert.deepEqual(observation.targetLocales, ['ar', 'de', 'es', 'fr', 'hi', 'ja', 'ko', 'pt', 'zh']);
  assert.equal(observation.scopes.conversationsWithGod.currentPageCount, 14);
  assert.equal(observation.scopes.conversationsWithGod.completeCount, 7);
  assert.equal(observation.scopes.conversationsWithGod.incompleteCount, 7);
  assert.equal(observation.selectedConcern.pageSlug, 'closed-circuit');
  assert.equal(observation.selectedConcern.providerAdmissionState, 'NOT_ADMITTED');
  assert.equal(observation.effects, false);
  assert.equal(observation.executionAuthority, 'NONE');
});

test('current Conversations-with-God slice answers what remains without page-per-Work topology', () => {
  const { projection } = makeProjection();

  assert.equal(projection.aggregate.entityCount, 14);
  assert.deepEqual(projection.aggregate.completionCounts, {
    COMPLETE: 7,
    INCOMPLETE: 7,
    UNKNOWN: 0,
    NOT_APPLICABLE: 0,
  });
  assert.equal(projection.aggregate.existingWorkRefs.length, 0);

  const arc = projection.scopes.find((scope) => scope.scopeRef === 'scope.vextreme.vexsite.arc.convos_with_god');
  assert.ok(arc);
  assert.equal(arc.summary.entityCount, 14);
  assert.equal(arc.summary.completionCounts.COMPLETE, 7);
  assert.equal(arc.summary.completionCounts.INCOMPLETE, 7);

  const tier = projection.aggregate.reasonFacets.find(
    (facet) => facet.reasonFacetRef === 'reason.vextreme.vexsite.localization.target-tier-completion',
  );
  assert.ok(tier);
  assert.equal(tier.entityCount, 7);
  assert.equal(tier.evidenceStateCounts.UNSATISFIED, 7);

  for (const locale of TARGETS) {
    const facet = projection.aggregate.reasonFacets.find(
      (candidate) => candidate.reasonFacetRef === `reason.vextreme.vexsite.localization.locale.${locale}`,
    );
    assert.ok(facet);
    assert.equal(facet.entityCount, 7);
    assert.equal(facet.evidenceStateCounts.UNSATISFIED, 7);
  }
});

test('locale completion and generated-currentness remain separate provider questions', () => {
  const { projection } = makeProjection();
  const godSpark = projection.entities.find((entity) => entity.entityRef.endsWith('.what-is-the-god-spark'));
  const clarity = projection.entities.find((entity) => entity.entityRef.endsWith('.clarity-on-christianity'));

  assert.equal(godSpark.completionState, 'COMPLETE');
  assert.equal(godSpark.reasonFacets.some((facet) => facet.predicateRef === VEXTREME_VEXSITE_LOCALIZATION_GENERATED_PREDICATE_REF), false);
  assert.equal(godSpark.attentionState, 'UNKNOWN');

  assert.equal(clarity.completionState, 'COMPLETE');
  const clarityGenerated = clarity.reasonFacets.find(
    (facet) => facet.predicateRef === VEXTREME_VEXSITE_LOCALIZATION_GENERATED_PREDICATE_REF,
  );
  assert.ok(clarityGenerated);
  assert.equal(clarityGenerated.evidenceState, 'UNSATISFIED');
  assert.deepEqual(clarityGenerated.evidenceRefs, ['github.pull.vextreme.379']);
  assert.equal(clarity.attentionState, 'ATTENTION');
});

test('target-tier concern promotes Closed Circuit as exactly one parked no-authority Work candidate', () => {
  const { projection } = makeProjection();
  const closed = projection.entities.find((entity) => entity.entityRef.endsWith('.closed-circuit'));
  assert.ok(closed);
  assert.equal(closed.completionState, 'INCOMPLETE');
  assert.equal(closed.existingWorkRefs.length, 0);

  const tierFacet = closed.reasonFacets.find(
    (facet) => facet.predicateRef === VEXTREME_VEXSITE_LOCALIZATION_TIER_PREDICATE_REF,
  );
  assert.ok(tierFacet);
  assert.equal(tierFacet.evidenceState, 'UNSATISFIED');

  const proposalRef = 'proposal.vexwork.operational-console.vexsite.closed-circuit.20261022a';
  const concernRef = observation.selectedConcern.concernRef;
  const formedAt = OBSERVED_AT;
  const candidateWorkItem = {
    schemaVersion: 'vexwork.work-item/v1',
    workRef: 'work.vextreme.vexsite.localization.closed-circuit.global-core',
    parentWorkRefOrNull: null,
    label: 'Localize Closed Circuit across Global Core',
    purpose: 'Preserve the current Closed Circuit Global Core localization concern as canonical Work while Vextreme retains source scheduling and implementation authority; current provider foreground remains separate dual-lineage work.',
    workClass: 'POTENTIAL',
    state: 'CAPTURED',
    workDisposition: 'PARKED',
    priorityClass: 'NORMAL',
    dependencyRefs: [],
    repositoryRefs: ['repo.vextreme'],
    sourceRefs: [
      proposalRef,
      concernRef,
      projection.populationRef,
      projection.snapshotRef,
      projection.lensRef,
      closed.entityRef,
      closed.evidenceRef,
      tierFacet.reasonFacetRef,
      tierFacet.predicateRef,
      observation.observationRef,
      'github.issue.vextreme.273',
      'github.issue-comment.vextreme.273.6311043427',
    ],
    formationProcessRefOrNull: 'process.vexwork.promote-derived-concern',
    nextProcessRefs: [],
    authorityDisposition: 'NO_AUTHORITY',
    effectDisposition: 'NO_EFFECTS',
    createdAt: formedAt,
    updatedAt: formedAt,
  };

  const proposal = createDerivedWorkPromotionProposal({
    projection,
    graph: currentGraph,
    registry,
    proposalRef,
    concernRef,
    action: 'CREATE_NEW_WORK',
    entityRef: closed.entityRef,
    reasonFacetRef: tierFacet.reasonFacetRef,
    predicateRef: tierFacet.predicateRef,
    proposedByActorRef: 'actor.local-vex-operations.operational-console',
    sourceRefs: [
      observation.observationRef,
      'projects/vexwork-operational-console/VEXSITE-PATIENT-ZERO.md',
    ],
    rationale: 'Closed Circuit is the current provider-grounded next localization source when the localization program resumes; one parked Potential preserves the concern without authorizing Vextreme source effects.',
    formedAt,
    existingWorkReview: {
      reviewedWorkRefs: [],
      duplicateDisposition: 'NO_EXISTING_WORK_REFERENCES',
      distinctionOrNull: null,
    },
    candidateWorkItemOrNull: candidateWorkItem,
    selectedExistingWorkRefOrNull: null,
  });

  const decision = createDerivedWorkPromotionDecision({
    proposal,
    projection,
    graph: currentGraph,
    registry,
    decisionRef: 'decision.vexwork.operational-console.vexsite.closed-circuit.20261022a',
    decision: 'APPROVE',
    decidedByActorRef: 'actor.local-vex-operations.operational-console',
    authorityBasisRefs: [
      'work.vexwork.operational-console.vexsite-patient-zero-proof',
      'projects/vexwork-operational-console/README.md',
    ],
    sourceRefs: [
      observation.observationRef,
      'projects/vexwork-operational-console/VEXSITE-PATIENT-ZERO.md',
    ],
    reason: 'The admitted P2 patient-zero explicitly requires one derived concern promotion; parking preserves the current concern without starting provider implementation.',
    decidedAt: formedAt,
  });

  const result = applyDerivedWorkPromotion({
    graph: currentGraph,
    registry,
    projection,
    proposal,
    decision,
  });

  assert.equal(result.state, 'WORK_CREATED');
  assert.equal(result.workRefOrNull, candidateWorkItem.workRef);
  assert.equal(result.effects.workgraphMutationRepresented, true);
  assert.equal(result.effects.providerMutationPerformed, false);

  const created = result.graph.items.find((item) => item.workRef === candidateWorkItem.workRef);
  assert.ok(created);
  assert.equal(created.state, 'CAPTURED');
  assert.equal(created.workDisposition, 'PARKED');
  assert.equal(created.authorityDisposition, 'NO_AUTHORITY');
  assert.equal(created.effectDisposition, 'NO_EFFECTS');
  assert.equal(result.graph.items.length, currentGraph.items.length + 1);

  const linked = makeProjection({
    [closed.entityRef]: [created.workRef],
  }).projection;
  const linkedClosed = linked.entities.find((entity) => entity.entityRef === closed.entityRef);
  assert.deepEqual(linkedClosed.existingWorkRefs, [created.workRef]);
  assert.equal(linked.aggregate.entitiesWithExistingWorkCount, 1);
  assert.deepEqual(linked.aggregate.existingWorkRefs, [created.workRef]);
  assert.equal(
    linked.entities.filter((entity) => entity.entityRef !== closed.entityRef)
      .every((entity) => entity.existingWorkRefs.length === 0),
    true,
  );
});

// [VXG RealForever][VEXWORK][OPERATIONAL-CONSOLE][P2][VEXSITE-PATIENT-ZERO]
