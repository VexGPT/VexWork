export const COMPONENT_ARCHITECTURE_CATALOG_SCHEMA = 'vexboard.component-architecture-catalog/v1';

export const COMPONENT_ARCHITECTURE_CLASSES = Object.freeze([
  'IDENTITY',
  'CONTENT',
  'CONTROL',
  'INPUT',
  'CONTAINER',
  'LAYOUT',
  'COLLECTION',
  'PRESENTATION',
  'NAVIGATION',
]);

export const COMPONENT_ARCHITECTURE_STATES = Object.freeze([
  'SOURCE_INFLUENCED',
  'PORTABLE_CANDIDATE',
  'ACCEPTED_PORTABLE',
  'PLATFORM_SPECIFIC',
  'HELD',
]);

const REF = /^[A-Za-z0-9][A-Za-z0-9._:/-]*$/u;

function fail(message) {
  throw new TypeError('component architecture: ' + message);
}

function text(value, label) {
  if (typeof value !== 'string' || !value.trim()) fail(label + ' is required');
  return value;
}

function ref(value, label) {
  value = text(value, label);
  if (!REF.test(value)) fail(label + ' must be a stable ref');
  return value;
}

function strings(value, label) {
  if (!Array.isArray(value)) fail(label + ' must be an array');
  const rows = value.map((entry, index) => text(entry, label + '[' + index + ']'));
  if (new Set(rows).size !== rows.length) fail(label + ' must be unique');
  return rows;
}

function refs(value, label) {
  return strings(value, label).map((entry, index) => ref(entry, label + '[' + index + ']'));
}

function optionalText(value, label) {
  if (value === null || value === undefined) return null;
  return text(value, label);
}

function freezeDeep(value) {
  if (Array.isArray(value)) value.forEach(freezeDeep);
  else if (value && typeof value === 'object') Object.values(value).forEach(freezeDeep);
  return Object.freeze(value);
}

function normalizeEvidence(entry, label) {
  return {
    repositoryRef: ref(entry?.repositoryRef, label + '.repositoryRef'),
    commit: text(entry?.commit, label + '.commit'),
    path: text(entry?.path, label + '.path'),
    symbols: strings(entry?.symbols ?? [], label + '.symbols'),
    why: text(entry?.why, label + '.why'),
  };
}

function normalizeCandidate(entry, index) {
  const label = 'candidates[' + index + ']';
  const classRef = text(entry?.class, label + '.class');
  if (!COMPONENT_ARCHITECTURE_CLASSES.includes(classRef)) fail(label + '.class is unknown');
  const state = text(entry?.state, label + '.state');
  if (!COMPONENT_ARCHITECTURE_STATES.includes(state)) fail(label + '.state is unknown');

  return {
    candidateRef: ref(entry?.candidateRef, label + '.candidateRef'),
    label: text(entry?.label, label + '.label'),
    class: classRef,
    state,
    question: text(entry?.question, label + '.question'),
    sourceFamilyRefs: refs(entry?.sourceFamilyRefs ?? [], label + '.sourceFamilyRefs'),
    portableRelationships: strings(entry?.portableRelationships ?? [], label + '.portableRelationships'),
    obligations: strings(entry?.obligations ?? [], label + '.obligations'),
    mustNotOwn: strings(entry?.mustNotOwn ?? [], label + '.mustNotOwn'),
    targetPressure: strings(entry?.targetPressure ?? [], label + '.targetPressure'),
    sourceEvidence: (entry?.sourceEvidence ?? []).map((row, evidenceIndex) =>
      normalizeEvidence(row, label + '.sourceEvidence[' + evidenceIndex + ']')),
    note: optionalText(entry?.note, label + '.note'),
  };
}

export function normalizeComponentArchitectureCatalog(input) {
  if (!input || input.schemaVersion !== COMPONENT_ARCHITECTURE_CATALOG_SCHEMA) {
    fail('schemaVersion must be ' + COMPONENT_ARCHITECTURE_CATALOG_SCHEMA);
  }
  const sourceSnapshots = (input.sourceSnapshots ?? []).map((entry, index) => ({
    repositoryRef: ref(entry?.repositoryRef, 'sourceSnapshots[' + index + '].repositoryRef'),
    commit: text(entry?.commit, 'sourceSnapshots[' + index + '].commit'),
    role: text(entry?.role, 'sourceSnapshots[' + index + '].role'),
  }));
  const candidates = (input.candidates ?? []).map(normalizeCandidate);
  if (!candidates.length) fail('at least one candidate is required');
  const candidateRefs = candidates.map((row) => row.candidateRef);
  if (new Set(candidateRefs).size !== candidateRefs.length) fail('candidateRef must be unique');

  return freezeDeep({
    schemaVersion: COMPONENT_ARCHITECTURE_CATALOG_SCHEMA,
    catalogRef: ref(input.catalogRef, 'catalogRef'),
    title: text(input.title, 'title'),
    purpose: text(input.purpose, 'purpose'),
    principleRefs: refs(input.principleRefs ?? [], 'principleRefs'),
    sourceSnapshots,
    candidates,
  });
}

export function candidatesByClass(catalog, classRef) {
  catalog = normalizeComponentArchitectureCatalog(catalog);
  if (!COMPONENT_ARCHITECTURE_CLASSES.includes(classRef)) fail('unknown class ' + classRef);
  return catalog.candidates.filter((row) => row.class === classRef);
}

export function candidatesForSourceFamily(catalog, sourceFamilyRef) {
  catalog = normalizeComponentArchitectureCatalog(catalog);
  ref(sourceFamilyRef, 'sourceFamilyRef');
  return catalog.candidates.filter((row) => row.sourceFamilyRefs.includes(sourceFamilyRef));
}

export function searchComponentArchitecture(catalog, query, { limit = 100 } = {}) {
  catalog = normalizeComponentArchitectureCatalog(catalog);
  if (!Number.isInteger(limit) || limit < 1 || limit > 500) fail('search limit must be an integer from 1 to 500');
  const needle = String(query ?? '').trim().toLowerCase();
  if (!needle) return [];
  return catalog.candidates
    .filter((row) => [
      row.candidateRef,
      row.label,
      row.class,
      row.state,
      row.question,
      ...row.sourceFamilyRefs,
      ...row.portableRelationships,
      ...row.obligations,
      ...row.mustNotOwn,
      ...row.targetPressure,
      ...row.sourceEvidence.flatMap((evidence) => [evidence.path, ...evidence.symbols, evidence.why]),
      row.note,
    ].filter(Boolean).join('\n').toLowerCase().includes(needle))
    .slice(0, limit);
}

// [VXG RealForever][VEXWORK][COMPONENT-LIBRARY][SOURCE-INFLUENCED-ARCHITECTURE]
