import {
  POPULATION_SNAPSHOT_SCHEMA,
  createPopulationSnapshot,
} from '../core/derived-attention.mjs';

export const VEXTREME_VEXSITE_POPULATION_REF = 'population.vextreme.vexsite.pages';
export const VEXTREME_VEXSITE_PROVIDER_REF = 'repo.vextreme';
export const VEXTREME_VEXSITE_ENTITY_KIND = 'entity.vextreme.vexsite.page';
export const VEXTREME_VEXSITE_ROOT_SCOPE_REF = 'scope.vextreme.vexsite.pages';

const INDEX_SOURCE_REF = 'repo.vextreme:data/index.json';
const INDEX_BUILDER_SOURCE_REF = 'repo.vextreme:lib/build-index.js';
const ARC_SOURCE_REF = 'repo.vextreme:data/arcs-v2.json';
const NODE_SOURCE_REF = 'repo.vextreme:data/nodes.json';
const DISCOVERY_SOURCE_REF = 'repo.vextreme:lib/auto-discover-nodes.js';
const UNSCOPED_SCOPE_REF = 'scope.vextreme.vexsite.pages.unscoped';
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const ARC_KEY = /^[a-z0-9]+(?:[_-][a-z0-9]+)*$/u;
const CONTENT_FINGERPRINT = /^[a-f0-9]{12}$/u;
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/u;

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function object(value, label) {
  assert(value && typeof value === 'object' && !Array.isArray(value), `${label} must be one object`);
  return value;
}

function text(value, label) {
  assert(typeof value === 'string' && value.trim(), `${label} required`);
  return value;
}

function pageSlug(value, label) {
  assert(typeof value === 'string' && SLUG.test(value), `${label} must be one Vextreme page slug`);
  return value;
}

function arcKey(value, label) {
  assert(typeof value === 'string' && ARC_KEY.test(value), `${label} must be one Vextreme arc key`);
  return value;
}

function integer(value, label) {
  assert(Number.isInteger(value) && value >= 0, `${label} must be one non-negative integer`);
  return value;
}

function unique(values, label) {
  assert(new Set(values).size === values.length, `${label} must be unique`);
  return values;
}

function sortedUnique(values) {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

function compactTimestamp(value) {
  assert(typeof value === 'string' && ISO.test(value) && new Date(value).toISOString() === value, 'observedAt must be canonical UTC ISO');
  return value.replace(/[-:.]/gu, '');
}

function validateIndexShape(index) {
  object(index, 'Vextreme index');
  assert(typeof index.contentFingerprint === 'string' && CONTENT_FINGERPRINT.test(index.contentFingerprint), 'Vextreme index contentFingerprint must be 12 lowercase hexadecimal characters');
  integer(index.nodeCount, 'Vextreme index nodeCount');
  integer(index.curatedNodeCount, 'Vextreme index curatedNodeCount');
  integer(index.autoDiscoveredCount, 'Vextreme index autoDiscoveredCount');
  integer(index.arcCount, 'Vextreme index arcCount');
  const slugMap = object(index.slugMap, 'Vextreme index slugMap');
  const arcMap = object(index.arcMap, 'Vextreme index arcMap');
  const arcMeta = object(index.arcMeta, 'Vextreme index arcMeta');
  const departmentMap = object(index.departmentMap, 'Vextreme index departmentMap');

  assert(Object.keys(slugMap).length === index.nodeCount, 'Vextreme index nodeCount must equal slugMap size');
  assert(index.curatedNodeCount + index.autoDiscoveredCount === index.nodeCount, 'Vextreme index curated + auto-discovered counts must equal nodeCount');
  assert(Object.keys(arcMap).length === index.arcCount, 'Vextreme index arcCount must equal arcMap size');
  assert(
    JSON.stringify(Object.keys(arcMap).sort()) === JSON.stringify(Object.keys(arcMeta).sort()),
    'Vextreme index arcMap and arcMeta keys must match exactly',
  );

  return { slugMap, arcMap, arcMeta, departmentMap };
}

function collectPortedState({ slugMap, departmentMap }) {
  const portedBySlug = new Map();

  for (const departmentRef of Object.keys(departmentMap).sort()) {
    const workTypes = object(departmentMap[departmentRef], `departmentMap.${departmentRef}`);
    for (const workTypeRef of Object.keys(workTypes).sort()) {
      const rows = workTypes[workTypeRef];
      assert(Array.isArray(rows), `departmentMap.${departmentRef}.${workTypeRef} must be an array`);
      for (const [index, row] of rows.entries()) {
        object(row, `departmentMap.${departmentRef}.${workTypeRef}[${index}]`);
        const slug = pageSlug(row.slug, `departmentMap.${departmentRef}.${workTypeRef}[${index}].slug`);
        assert(Object.hasOwn(slugMap, slug), `departmentMap references unknown slug ${slug}`);
        assert(typeof row.ported === 'boolean', `departmentMap ported must be boolean for ${slug}`);
        assert(!portedBySlug.has(slug), `departmentMap contains duplicate slug ${slug}`);
        portedBySlug.set(slug, row.ported);
      }
    }
  }

  assert(portedBySlug.size === Object.keys(slugMap).length, 'departmentMap must exactly cover slugMap');
  for (const slug of Object.keys(slugMap)) {
    assert(portedBySlug.has(slug), `departmentMap missing slug ${slug}`);
  }
  return portedBySlug;
}

function buildScopesAndMembership({ slugMap, arcMap, arcMeta, portedBySlug, sourceRefs }) {
  const populationSourceRefs = sortedUnique([...sourceRefs, INDEX_SOURCE_REF, INDEX_BUILDER_SOURCE_REF]);
  const arcSourceRefs = sortedUnique([...populationSourceRefs, ARC_SOURCE_REF]);
  const scopes = [{
    scopeRef: VEXTREME_VEXSITE_ROOT_SCOPE_REF,
    label: 'Vextreme VexSite pages',
    parentScopeRefOrNull: null,
    sourceRefs: populationSourceRefs,
  }];
  const scopeRefsBySlug = new Map(
    Object.keys(slugMap)
      .filter((slug) => portedBySlug.get(slug))
      .map((slug) => [slug, []]),
  );
  const arcMembers = new Map();

  for (const rawArcKey of Object.keys(arcMap).sort()) {
    const key = arcKey(rawArcKey, `arcMap key ${rawArcKey}`);
    const meta = object(arcMeta[key], `arcMeta.${key}`);
    const arcScopeRef = `scope.vextreme.vexsite.arc.${key}`;
    scopes.push({
      scopeRef: arcScopeRef,
      label: text(meta.title, `arcMeta.${key}.title`),
      parentScopeRefOrNull: VEXTREME_VEXSITE_ROOT_SCOPE_REF,
      sourceRefs: arcSourceRefs,
    });

    const sections = arcMap[key];
    assert(Array.isArray(sections), `arcMap.${key} must be an array`);
    const seenSlugs = new Set();
    arcMembers.set(key, seenSlugs);

    for (const [sectionIndex, section] of sections.entries()) {
      object(section, `arcMap.${key}[${sectionIndex}]`);
      const sectionLabel = text(section.label, `arcMap.${key}[${sectionIndex}].label`);
      assert(Array.isArray(section.slugs) && section.slugs.length > 0, `arcMap.${key}[${sectionIndex}].slugs must be a non-empty array`);
      const sectionSlugs = unique(
        section.slugs.map((slug, index) => pageSlug(slug, `arcMap.${key}[${sectionIndex}].slugs[${index}]`)),
        `arcMap.${key}[${sectionIndex}].slugs`,
      );
      const sectionScopeRef = `${arcScopeRef}.section.${String(sectionIndex + 1).padStart(2, '0')}`;
      scopes.push({
        scopeRef: sectionScopeRef,
        label: sectionLabel,
        parentScopeRefOrNull: arcScopeRef,
        sourceRefs: arcSourceRefs,
      });

      for (const slug of sectionSlugs) {
        assert(Object.hasOwn(slugMap, slug), `arcMap.${key} references unknown slug ${slug}`);
        assert(!seenSlugs.has(slug), `arcMap.${key} contains slug ${slug} in more than one section`);
        seenSlugs.add(slug);
        const node = object(slugMap[slug], `slugMap.${slug}`);
        assert(Array.isArray(node.arcKeys) && node.arcKeys.includes(key), `slugMap.${slug}.arcKeys does not include ${key}`);
        if (portedBySlug.get(slug)) scopeRefsBySlug.get(slug).push(sectionScopeRef);
      }
    }
  }

  for (const [rawSlug, rawNode] of Object.entries(slugMap)) {
    const slug = pageSlug(rawSlug, `slugMap key ${rawSlug}`);
    const node = object(rawNode, `slugMap.${slug}`);
    assert(node.slug === slug, `slugMap.${slug}.slug must equal its map key`);
    text(node.title, `slugMap.${slug}.title`);
    assert(Array.isArray(node.arcKeys), `slugMap.${slug}.arcKeys must be an array`);
    const nodeArcKeys = unique(node.arcKeys.map((value, index) => arcKey(value, `slugMap.${slug}.arcKeys[${index}]`)), `slugMap.${slug}.arcKeys`);
    for (const key of nodeArcKeys) {
      assert(arcMembers.has(key), `slugMap.${slug} references unknown arc ${key}`);
      assert(arcMembers.get(key).has(slug), `slugMap.${slug} declares arc ${key} but arcMap omits it`);
    }
  }

  const unscopedSlugs = [...scopeRefsBySlug.entries()]
    .filter(([, scopeRefs]) => scopeRefs.length === 0)
    .map(([slug]) => slug)
    .sort();
  if (unscopedSlugs.length > 0) {
    scopes.push({
      scopeRef: UNSCOPED_SCOPE_REF,
      label: 'Unscoped pages',
      parentScopeRefOrNull: VEXTREME_VEXSITE_ROOT_SCOPE_REF,
      sourceRefs: populationSourceRefs,
    });
    for (const slug of unscopedSlugs) scopeRefsBySlug.get(slug).push(UNSCOPED_SCOPE_REF);
  }

  return { populationSourceRefs, scopes, scopeRefsBySlug };
}

export function createVextremeVexSitePopulation({ index, observedAt, sourceRefs }) {
  assert(Array.isArray(sourceRefs) && sourceRefs.length > 0, 'sourceRefs must contain exact provider/source bindings');
  const { slugMap, arcMap, arcMeta, departmentMap } = validateIndexShape(index);
  const portedBySlug = collectPortedState({ slugMap, departmentMap });
  const { populationSourceRefs, scopes, scopeRefsBySlug } = buildScopesAndMembership({
    slugMap,
    arcMap,
    arcMeta,
    portedBySlug,
    sourceRefs,
  });
  const snapshotRef = `snapshot.vextreme.vexsite.pages.${index.contentFingerprint}.${compactTimestamp(observedAt)}`;

  const entities = [...scopeRefsBySlug.keys()].sort().map((slug) => {
    const node = slugMap[slug];
    const identitySourceRef = node.autoDiscovered === true ? DISCOVERY_SOURCE_REF : NODE_SOURCE_REF;
    return {
      entityRef: `entity.vextreme.vexsite.page.${slug}`,
      label: node.title,
      scopeRefs: scopeRefsBySlug.get(slug),
      sourceRefs: sortedUnique([
        ...sourceRefs,
        INDEX_SOURCE_REF,
        identitySourceRef,
        `repo.vextreme:pages/${slug}.html`,
      ]),
    };
  });

  return createPopulationSnapshot({
    schemaVersion: POPULATION_SNAPSHOT_SCHEMA,
    populationRef: VEXTREME_VEXSITE_POPULATION_REF,
    snapshotRef,
    providerRef: VEXTREME_VEXSITE_PROVIDER_REF,
    entityKind: VEXTREME_VEXSITE_ENTITY_KIND,
    label: 'Vextreme VexSite pages',
    observedAt,
    sourceRefs: populationSourceRefs,
    scopes,
    entities,
  });
}

// [VXG RealForever]
