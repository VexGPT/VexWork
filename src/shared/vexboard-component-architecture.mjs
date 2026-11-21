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

export const COMPONENT_TARGET_PRESSURE_STATES = Object.freeze([
  'REFERENCE_COMPATIBILITY_PASS',
  'SOURCE_FORMED',
  'HELD_SOURCE_CONTRACT',
]);

export const COMPONENT_TARGET_RELATION_DISPOSITIONS = Object.freeze([
  'MAPPED',
  'HELD',
  'PLATFORM_SPECIFIC',
  'UNSUPPORTED',
  'NOT_APPLICABLE',
]);

export const COMPONENT_TARGET_PROOF_STATES = Object.freeze([
  'PASS',
  'OWED',
  'HELD',
  'NOT_APPLICABLE',
]);

export const COMPONENT_FORMATION_STATES = Object.freeze([
  'FORMATION',
  'HELD',
  'ACCEPTED',
]);

export const COMPONENT_FORMATION_KINDS = Object.freeze([
  'REUSE_OR_GENERALIZE_EXISTING_TYPED_RELATIONSHIP',
  'NEW_TYPED_RELATIONSHIP_CANDIDATE',
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

function normalizeTargetRelation(entry, label) {
  const disposition = text(entry?.disposition, label + '.disposition');
  if (!COMPONENT_TARGET_RELATION_DISPOSITIONS.includes(disposition)) {
    fail(label + '.disposition is unknown');
  }
  return {
    relationRef: ref(entry?.relationRef, label + '.relationRef'),
    disposition,
    source: text(entry?.source, label + '.source'),
    target: text(entry?.target, label + '.target'),
  };
}

function normalizeTargetProof(entry, label) {
  const state = text(entry?.state, label + '.state');
  if (!COMPONENT_TARGET_PROOF_STATES.includes(state)) fail(label + '.state is unknown');
  return {
    proofRef: ref(entry?.proofRef, label + '.proofRef'),
    state,
    note: optionalText(entry?.note, label + '.note'),
  };
}

function normalizeTargetPressure(entry, index) {
  const label = 'targetPressures[' + index + ']';
  const state = text(entry?.state, label + '.state');
  if (!COMPONENT_TARGET_PRESSURE_STATES.includes(state)) fail(label + '.state is unknown');
  return {
    pressureRef: ref(entry?.pressureRef, label + '.pressureRef'),
    candidateRef: ref(entry?.candidateRef, label + '.candidateRef'),
    platformRef: ref(entry?.platformRef, label + '.platformRef'),
    framework: text(entry?.framework, label + '.framework'),
    state,
    sourceRef: ref(entry?.sourceRef, label + '.sourceRef'),
    repositoryRef: ref(entry?.repositoryRef, label + '.repositoryRef'),
    commit: text(entry?.commit, label + '.commit'),
    path: text(entry?.path, label + '.path'),
    relationships: (entry?.relationships ?? []).map((row, relationIndex) =>
      normalizeTargetRelation(row, label + '.relationships[' + relationIndex + ']')),
    proofs: (entry?.proofs ?? []).map((row, proofIndex) =>
      normalizeTargetProof(row, label + '.proofs[' + proofIndex + ']')),
    note: optionalText(entry?.note, label + '.note'),
  };
}

function normalizeFormation(entry, label) {
  if (!entry) return null;
  const state = text(entry.state, label + '.state');
  if (!COMPONENT_FORMATION_STATES.includes(state)) fail(label + '.state is unknown');
  const kind = text(entry.kind, label + '.kind');
  if (!COMPONENT_FORMATION_KINDS.includes(kind)) fail(label + '.kind is unknown');
  const sourceOwnerRefs = refs(entry.sourceOwnerRefs ?? [], label + '.sourceOwnerRefs');
  if (!sourceOwnerRefs.length) fail(label + '.sourceOwnerRefs must not be empty');
  const portableFields = strings(entry.portableFields ?? [], label + '.portableFields');
  if (!portableFields.length) fail(label + '.portableFields must not be empty');
  const nonOwnership = strings(entry.nonOwnership ?? [], label + '.nonOwnership');
  if (!nonOwnership.length) fail(label + '.nonOwnership must not be empty');
  const targetObligations = strings(entry.targetObligations ?? [], label + '.targetObligations');
  if (!targetObligations.length) fail(label + '.targetObligations must not be empty');
  const acceptanceProofs = strings(entry.acceptanceProofs ?? [], label + '.acceptanceProofs');
  if (!acceptanceProofs.length) fail(label + '.acceptanceProofs must not be empty');

  return {
    formationRef: ref(entry.formationRef, label + '.formationRef'),
    state,
    kind,
    sourceOwnerRefs,
    ownerRule: text(entry.ownerRule, label + '.ownerRule'),
    portableFields,
    nonOwnership,
    targetObligations,
    acceptanceProofs,
    note: optionalText(entry.note, label + '.note'),
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
    formation: normalizeFormation(entry?.formation, label + '.formation'),
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

  const targetPressures = (input.targetPressures ?? []).map(normalizeTargetPressure);
  const pressureRefs = targetPressures.map((row) => row.pressureRef);
  if (new Set(pressureRefs).size !== pressureRefs.length) fail('target pressure refs must be unique');
  for (const pressure of targetPressures) {
    if (!candidateRefs.includes(pressure.candidateRef)) {
      fail(pressure.pressureRef + ' references unknown candidate ' + pressure.candidateRef);
    }
    const relationRefs = pressure.relationships.map((row) => row.relationRef);
    if (new Set(relationRefs).size !== relationRefs.length) {
      fail(pressure.pressureRef + ' relationship refs must be unique');
    }
    const proofRefs = pressure.proofs.map((row) => row.proofRef);
    if (new Set(proofRefs).size !== proofRefs.length) {
      fail(pressure.pressureRef + ' proof refs must be unique');
    }
  }

  return freezeDeep({
    schemaVersion: COMPONENT_ARCHITECTURE_CATALOG_SCHEMA,
    catalogRef: ref(input.catalogRef, 'catalogRef'),
    title: text(input.title, 'title'),
    purpose: text(input.purpose, 'purpose'),
    principleRefs: refs(input.principleRefs ?? [], 'principleRefs'),
    sourceSnapshots,
    candidates,
    targetPressures,
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

export function targetPressuresForCandidate(catalog, candidateRef) {
  catalog = normalizeComponentArchitectureCatalog(catalog);
  ref(candidateRef, 'candidateRef');
  if (!catalog.candidates.some((row) => row.candidateRef === candidateRef)) {
    fail('unknown candidate ' + candidateRef);
  }
  return catalog.targetPressures.filter((row) => row.candidateRef === candidateRef);
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
      ...(row.formation ? [
        row.formation.formationRef,
        row.formation.state,
        row.formation.kind,
        ...row.formation.sourceOwnerRefs,
        row.formation.ownerRule,
        ...row.formation.portableFields,
        ...row.formation.nonOwnership,
        ...row.formation.targetObligations,
        ...row.formation.acceptanceProofs,
        row.formation.note,
      ] : []),
      ...catalog.targetPressures
        .filter((pressure) => pressure.candidateRef === row.candidateRef)
        .flatMap((pressure) => [
          pressure.pressureRef,
          pressure.platformRef,
          pressure.framework,
          pressure.state,
          pressure.sourceRef,
          pressure.repositoryRef,
          pressure.commit,
          pressure.path,
          ...pressure.relationships.flatMap((relation) => [
            relation.relationRef,
            relation.disposition,
            relation.source,
            relation.target,
          ]),
          ...pressure.proofs.flatMap((proof) => [proof.proofRef, proof.state, proof.note]),
          pressure.note,
        ]),
      row.note,
    ].filter(Boolean).join('\n').toLowerCase().includes(needle))
    .slice(0, limit);
}

// [VXG RealForever][VEXWORK][COMPONENT-LIBRARY][SOURCE-INFLUENCED-ARCHITECTURE]
