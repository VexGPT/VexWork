import {
  ENTITY_LENS_EVIDENCE_SCHEMA,
  WORK_LENS_SCHEMA,
  createEntityLensEvidence,
  createPopulationSnapshot,
  createWorkLens,
} from '../core/derived-attention.mjs';
import {
  VEXTREME_VEXSITE_POPULATION_REF,
} from './vextreme-vexsite-population.mjs';

export const VEXTREME_VEXSITE_LOCALIZATION_LENS_REF = 'lens.vextreme.vexsite.localization';
export const VEXTREME_VEXSITE_LOCALIZATION_GENERATED_PREDICATE_REF = 'predicate.vextreme.vexsite.localization.generated-currentness';
export const VEXTREME_VEXSITE_LOCALIZATION_LIVED_PREDICATE_REF = 'predicate.vextreme.vexsite.localization.lived-proof';
export const VEXTREME_VEXSITE_LOCALIZATION_MODERNIZATION_PREDICATE_REF = 'predicate.vextreme.vexsite.localization.modernization';

const PAGE_ENTITY_PREFIX = 'entity.vextreme.vexsite.page.';
const INDEX_SOURCE_REF = 'repo.vextreme:data/index.json';
const I18N_ARCHITECTURE_SOURCE_REF = 'repo.vextreme:docs/architecture/06-i18n.md';
const SCOPE_INDEX_SOURCE_REF = 'repo.vextreme:data/strings/compiled/scopes/index.json';
const LOCALE = /^[a-z][a-z0-9-]*$/u;
const CONTENT_FINGERPRINT = /^[a-f0-9]{12}$/u;
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/u;
const EVIDENCE_STATES = new Set(['SATISFIED', 'UNSATISFIED', 'UNKNOWN', 'NOT_APPLICABLE']);

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function object(value, label) {
  assert(value && typeof value === 'object' && !Array.isArray(value), `${label} must be one object`);
  return value;
}

function sortedUnique(values) {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

function locales(values) {
  assert(Array.isArray(values) && values.length > 0, 'targetLocales must be a non-empty array');
  const result = values.map((value, index) => {
    assert(typeof value === 'string' && LOCALE.test(value), `targetLocales[${index}] must be one locale ref`);
    assert(value !== 'en', 'targetLocales must not contain source locale en');
    return value;
  });
  assert(new Set(result).size === result.length, 'targetLocales must be unique');
  return result.sort((left, right) => left.localeCompare(right));
}

function exactSourceRefs(values, label = 'sourceRefs') {
  assert(Array.isArray(values) && values.length > 0, `${label} must be a non-empty array`);
  for (const [index, value] of values.entries()) {
    assert(typeof value === 'string' && value.trim(), `${label}[${index}] required`);
  }
  return sortedUnique(values);
}

function compactTimestamp(value) {
  assert(typeof value === 'string' && ISO.test(value) && new Date(value).toISOString() === value, 'observedAt must be canonical UTC ISO');
  return value.replace(/[-:.]/gu, '');
}

export function localePredicateRef(locale) {
  assert(typeof locale === 'string' && LOCALE.test(locale) && locale !== 'en', 'locale predicate requires one non-EN locale');
  return `predicate.vextreme.vexsite.localization.locale.${locale}`;
}

export function localeReasonFacetRef(locale) {
  assert(typeof locale === 'string' && LOCALE.test(locale) && locale !== 'en', 'locale reason facet requires one non-EN locale');
  return `reason.vextreme.vexsite.localization.locale.${locale}`;
}

export function createVextremeVexSiteLocalizationLens({ targetLocales, sourceRefs }) {
  const targets = locales(targetLocales);
  const refs = sortedUnique([
    ...exactSourceRefs(sourceRefs),
    INDEX_SOURCE_REF,
    I18N_ARCHITECTURE_SOURCE_REF,
    SCOPE_INDEX_SOURCE_REF,
  ]);

  return createWorkLens({
    schemaVersion: WORK_LENS_SCHEMA,
    lensRef: VEXTREME_VEXSITE_LOCALIZATION_LENS_REF,
    populationRef: VEXTREME_VEXSITE_POPULATION_REF,
    label: 'VexSite localization',
    purpose: 'Project page-local target-locale completion and separately evidenced generated, lived, and modernization attention without creating page Work items.',
    targetLocales: targets,
    sourceRefs: refs,
    predicates: [
      ...targets.map((locale) => ({
        predicateRef: localePredicateRef(locale),
        label: `${locale} locale complete`,
        requirement: 'REQUIRED',
        reasonFacetRef: localeReasonFacetRef(locale),
        sourceRefs: refs,
      })),
      {
        predicateRef: VEXTREME_VEXSITE_LOCALIZATION_GENERATED_PREDICATE_REF,
        label: 'Generated localization artifacts current',
        requirement: 'ADVISORY',
        reasonFacetRef: 'reason.vextreme.vexsite.localization.generated-currentness',
        sourceRefs: refs,
      },
      {
        predicateRef: VEXTREME_VEXSITE_LOCALIZATION_LIVED_PREDICATE_REF,
        label: 'Localized lived proof current',
        requirement: 'ADVISORY',
        reasonFacetRef: 'reason.vextreme.vexsite.localization.lived-proof',
        sourceRefs: refs,
      },
      {
        predicateRef: VEXTREME_VEXSITE_LOCALIZATION_MODERNIZATION_PREDICATE_REF,
        label: 'Localization presentation modernization current',
        requirement: 'ADVISORY',
        reasonFacetRef: 'reason.vextreme.vexsite.localization.modernization',
        sourceRefs: refs,
      },
    ],
  });
}

function normalizeSignal(input, label) {
  if (input === undefined || input === null) return { state: 'UNKNOWN', evidenceRefs: [] };
  object(input, label);
  assert(EVIDENCE_STATES.has(input.state), `${label}.state unsupported`);
  const evidenceRefs = Array.isArray(input.evidenceRefs) ? sortedUnique(input.evidenceRefs) : [];
  for (const [index, value] of evidenceRefs.entries()) {
    assert(typeof value === 'string' && value.trim(), `${label}.evidenceRefs[${index}] required`);
  }
  if (input.state === 'UNKNOWN') assert(evidenceRefs.length === 0, `${label} UNKNOWN must not claim evidenceRefs`);
  else assert(evidenceRefs.length > 0, `${label} ${input.state} requires evidenceRefs`);
  return { state: input.state, evidenceRefs };
}

function entitySlug(entityRef) {
  assert(typeof entityRef === 'string' && entityRef.startsWith(PAGE_ENTITY_PREFIX), `unexpected VexSite page entityRef ${entityRef}`);
  const slug = entityRef.slice(PAGE_ENTITY_PREFIX.length);
  assert(slug, `entityRef missing page slug ${entityRef}`);
  return slug;
}

function validateIndexForPopulation(index, population) {
  object(index, 'Vextreme index');
  assert(typeof index.contentFingerprint === 'string' && CONTENT_FINGERPRINT.test(index.contentFingerprint), 'Vextreme index contentFingerprint invalid');
  const expectedSnapshotPrefix = `snapshot.vextreme.vexsite.pages.${index.contentFingerprint}.`;
  assert(population.snapshotRef.startsWith(expectedSnapshotPrefix), 'Vextreme localization evidence index does not match population snapshot');
  const slugMap = object(index.slugMap, 'Vextreme index slugMap');
  const pageLanguageMap = object(index.pageLanguageMap, 'Vextreme index pageLanguageMap');
  assert(Array.isArray(index.sourceOnlyScopes), 'Vextreme index sourceOnlyScopes must be an array');
  return { slugMap, pageLanguageMap, sourceOnlyScopes: new Set(index.sourceOnlyScopes) };
}

function pageIsSourceOnly(node, sourceOnlyScopes) {
  const scopes = node?.viewmodel?.scopes;
  assert(Array.isArray(scopes) && scopes.length > 0, `slugMap.${node?.slug || 'unknown'}.viewmodel.scopes must be non-empty`);
  const pageScopes = scopes.filter((scope) => scope !== 'common');
  return pageScopes.length > 0 && pageScopes.every((scope) => sourceOnlyScopes.has(scope));
}

function signalForEntity(byEntityRef, entityRef, fallback, label) {
  const explicit = byEntityRef && Object.hasOwn(byEntityRef, entityRef) ? byEntityRef[entityRef] : undefined;
  return normalizeSignal(explicit ?? fallback, `${label}.${entityRef}`);
}

export function createVextremeVexSiteLocalizationEvidenceBatch({
  index,
  population,
  lens,
  observedAt,
  generatedCurrentness,
  generatedCurrentnessByEntityRef = {},
  livedProofByEntityRef = {},
  modernizationByEntityRef = {},
  existingWorkRefsByEntityRef = {},
}) {
  population = createPopulationSnapshot(population);
  lens = createWorkLens(lens);
  assert(lens.lensRef === VEXTREME_VEXSITE_LOCALIZATION_LENS_REF, 'unexpected VexSite localization lensRef');
  assert(lens.populationRef === population.populationRef, 'localization lens populationRef mismatch');
  const targets = locales(lens.targetLocales);
  const { slugMap, pageLanguageMap, sourceOnlyScopes } = validateIndexForPopulation(index, population);
  const timestamp = compactTimestamp(observedAt);

  return Object.freeze(population.entities.map((entity) => {
    const slug = entitySlug(entity.entityRef);
    const node = object(slugMap[slug], `slugMap.${slug}`);
    assert(node.slug === slug, `slugMap.${slug}.slug mismatch`);
    const coverage = object(pageLanguageMap[slug], `pageLanguageMap.${slug}`);
    assert(Array.isArray(coverage.completeLangs), `pageLanguageMap.${slug}.completeLangs must be an array`);
    const completeLangs = new Set(coverage.completeLangs);
    const sourceOnly = pageIsSourceOnly(node, sourceOnlyScopes);
    const policyEvidenceRefs = [
      `${INDEX_SOURCE_REF}/slugMap/${slug}/viewmodel/scopes`,
      `${INDEX_SOURCE_REF}/sourceOnlyScopes`,
      SCOPE_INDEX_SOURCE_REF,
    ];
    const coverageEvidenceRefs = [
      `${INDEX_SOURCE_REF}/pageLanguageMap/${slug}/completeLangs`,
      SCOPE_INDEX_SOURCE_REF,
    ];

    const generated = signalForEntity(
      generatedCurrentnessByEntityRef,
      entity.entityRef,
      generatedCurrentness,
      'generatedCurrentness',
    );
    const lived = signalForEntity(livedProofByEntityRef, entity.entityRef, undefined, 'livedProof');
    const modernization = signalForEntity(modernizationByEntityRef, entity.entityRef, undefined, 'modernization');
    const existingWorkRefs = existingWorkRefsByEntityRef[entity.entityRef] || [];
    assert(Array.isArray(existingWorkRefs), `existingWorkRefsByEntityRef.${entity.entityRef} must be an array`);

    const predicateResults = [
      ...targets.map((locale) => ({
        predicateRef: localePredicateRef(locale),
        state: sourceOnly ? 'NOT_APPLICABLE' : (completeLangs.has(locale) ? 'SATISFIED' : 'UNSATISFIED'),
        evidenceRefs: sourceOnly ? policyEvidenceRefs : coverageEvidenceRefs,
      })),
      {
        predicateRef: VEXTREME_VEXSITE_LOCALIZATION_GENERATED_PREDICATE_REF,
        state: generated.state,
        evidenceRefs: generated.evidenceRefs,
      },
      {
        predicateRef: VEXTREME_VEXSITE_LOCALIZATION_LIVED_PREDICATE_REF,
        state: lived.state,
        evidenceRefs: lived.evidenceRefs,
      },
      {
        predicateRef: VEXTREME_VEXSITE_LOCALIZATION_MODERNIZATION_PREDICATE_REF,
        state: modernization.state,
        evidenceRefs: modernization.evidenceRefs,
      },
    ];

    return createEntityLensEvidence({
      schemaVersion: ENTITY_LENS_EVIDENCE_SCHEMA,
      evidenceRef: `evidence.vextreme.vexsite.localization.${slug}.${index.contentFingerprint}.${timestamp}`,
      populationRef: population.populationRef,
      populationSemanticFingerprint: population.semanticFingerprint,
      lensRef: lens.lensRef,
      lensSemanticFingerprint: lens.semanticFingerprint,
      entityRef: entity.entityRef,
      observedAt,
      predicateResults,
      existingWorkRefs,
    }, { population, lens });
  }));
}

// [VXG RealForever]
