import { freezeBoardValue, normalizeBoardGraph } from './vexboard-model.mjs';

export const BOARD_EVIDENCE_SCHEMA = 'vexboard.board-evidence/v1';
export const BOARD_EVIDENCE_ARTIFACT_ROLES = Object.freeze([
  'REFERENCE',
  'OBSERVED',
]);

const REF = /^[A-Za-z0-9][A-Za-z0-9._:/-]*$/u;
const HEX64 = /^[0-9a-f]{64}$/u;
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/u;

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function compareCanonicalText(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function exactKeys(value, keys, label) {
  assert(isObject(value), `${label} must be one object`);
  const actual = Object.keys(value).sort(compareCanonicalText);
  const expected = [...keys].sort(compareCanonicalText);
  assert(JSON.stringify(actual) === JSON.stringify(expected), `${label} schema drift`);
}

function stableRef(value, label) {
  assert(typeof value === 'string' && REF.test(value), `${label} must be one stable ref`);
  return value;
}

function optionalRef(value, label) {
  return value === null ? null : stableRef(value, label);
}

function refs(values, label) {
  assert(Array.isArray(values), `${label} must be an array`);
  const accepted = values.map((value, index) => stableRef(value, `${label}[${index}]`));
  assert(new Set(accepted).size === accepted.length, `${label} must be unique`);
  return accepted.sort(compareCanonicalText);
}

function canonicalTimestampOrNull(value, label) {
  if (value === null) return null;
  assert(typeof value === 'string' && ISO.test(value) && new Date(value).toISOString() === value,
    `${label} must be canonical UTC ISO or null`);
  return value;
}

function sha256OrNull(value, label) {
  if (value === null) return null;
  assert(typeof value === 'string' && HEX64.test(value), `${label} must be sha256 or null`);
  return value;
}

function normalizeSlot(input, nodeRefs) {
  exactKeys(input, ['slotRef', 'semanticRef', 'expectation', 'sourceRefs'], 'evidence slot');
  const slotRef = stableRef(input.slotRef, 'evidence slot.slotRef');
  const semanticRef = stableRef(input.semanticRef, `evidence slot ${slotRef}.semanticRef`);
  assert(nodeRefs.has(semanticRef), `evidence slot ${slotRef} semanticRef missing: ${semanticRef}`);
  assert(typeof input.expectation === 'string' && input.expectation.trim(),
    `evidence slot ${slotRef}.expectation required`);
  return {
    slotRef,
    semanticRef,
    expectation: input.expectation,
    sourceRefs: refs(input.sourceRefs, `evidence slot ${slotRef}.sourceRefs`),
  };
}

function normalizeArtifact(input, slotRefs) {
  exactKeys(input, [
    'artifactRef',
    'slotRef',
    'role',
    'assetRef',
    'journeyRefOrNull',
    'journeyStepSequenceOrNull',
    'interactionRefOrNull',
    'configurationRefOrNull',
    'capturedAtOrNull',
    'contentSha256OrNull',
    'sourceRefs',
  ], 'evidence artifact');

  const artifactRef = stableRef(input.artifactRef, 'evidence artifact.artifactRef');
  const slotRef = stableRef(input.slotRef, `evidence artifact ${artifactRef}.slotRef`);
  assert(slotRefs.has(slotRef), `evidence artifact ${artifactRef} slot missing: ${slotRef}`);
  assert(BOARD_EVIDENCE_ARTIFACT_ROLES.includes(input.role),
    `evidence artifact ${artifactRef}.role invalid`);

  const journeyRefOrNull = optionalRef(input.journeyRefOrNull, `evidence artifact ${artifactRef}.journeyRefOrNull`);
  const journeyStepSequenceOrNull = input.journeyStepSequenceOrNull;
  assert(journeyStepSequenceOrNull === null
    || (Number.isInteger(journeyStepSequenceOrNull) && journeyStepSequenceOrNull >= 0),
  `evidence artifact ${artifactRef}.journeyStepSequenceOrNull invalid`);
  assert(journeyRefOrNull !== null || journeyStepSequenceOrNull === null,
    `evidence artifact ${artifactRef} journey step requires journeyRef`);

  const capturedAtOrNull = canonicalTimestampOrNull(
    input.capturedAtOrNull,
    `evidence artifact ${artifactRef}.capturedAtOrNull`,
  );
  if (input.role === 'OBSERVED') {
    assert(capturedAtOrNull !== null, `observed evidence artifact ${artifactRef} requires capturedAt`);
  }

  return {
    artifactRef,
    slotRef,
    role: input.role,
    assetRef: stableRef(input.assetRef, `evidence artifact ${artifactRef}.assetRef`),
    journeyRefOrNull,
    journeyStepSequenceOrNull,
    interactionRefOrNull: optionalRef(
      input.interactionRefOrNull,
      `evidence artifact ${artifactRef}.interactionRefOrNull`,
    ),
    configurationRefOrNull: optionalRef(
      input.configurationRefOrNull,
      `evidence artifact ${artifactRef}.configurationRefOrNull`,
    ),
    capturedAtOrNull,
    contentSha256OrNull: sha256OrNull(
      input.contentSha256OrNull,
      `evidence artifact ${artifactRef}.contentSha256OrNull`,
    ),
    sourceRefs: refs(input.sourceRefs, `evidence artifact ${artifactRef}.sourceRefs`),
  };
}

function graphValue(input) {
  const value = structuredClone(input);
  delete value.semanticFingerprint;
  return normalizeBoardGraph(value);
}

export function normalizeBoardEvidence(input, graphInput) {
  exactKeys(input, [
    'schemaVersion',
    'evidenceSetRef',
    'boardRef',
    'graphRef',
    'slots',
    'artifacts',
    'sourceRefs',
  ], 'BoardEvidence');

  assert(input.schemaVersion === BOARD_EVIDENCE_SCHEMA, 'BoardEvidence schema mismatch');
  const graph = graphValue(graphInput);
  const graphRef = stableRef(input.graphRef, 'BoardEvidence.graphRef');
  assert(graphRef === graph.graphRef, 'BoardEvidence graphRef mismatch');

  assert(Array.isArray(input.slots), 'BoardEvidence.slots must be an array');
  const nodeRefs = new Set(graph.nodes.map((node) => node.nodeRef));
  const slots = input.slots
    .map((slot) => normalizeSlot(slot, nodeRefs))
    .sort((left, right) => compareCanonicalText(left.slotRef, right.slotRef));
  const slotRefs = new Set(slots.map((slot) => slot.slotRef));
  assert(slotRefs.size === slots.length, 'BoardEvidence slotRef must be unique');

  assert(Array.isArray(input.artifacts), 'BoardEvidence.artifacts must be an array');
  const artifacts = input.artifacts
    .map((artifact) => normalizeArtifact(artifact, slotRefs))
    .sort((left, right) => compareCanonicalText(left.artifactRef, right.artifactRef));
  assert(new Set(artifacts.map((artifact) => artifact.artifactRef)).size === artifacts.length,
    'BoardEvidence artifactRef must be unique');

  return freezeBoardValue({
    schemaVersion: BOARD_EVIDENCE_SCHEMA,
    evidenceSetRef: stableRef(input.evidenceSetRef, 'BoardEvidence.evidenceSetRef'),
    boardRef: stableRef(input.boardRef, 'BoardEvidence.boardRef'),
    graphRef,
    slots,
    artifacts,
    sourceRefs: refs(input.sourceRefs, 'BoardEvidence.sourceRefs'),
  });
}

export function evidenceForSemanticRef(evidenceInput, graphInput, semanticRefInput) {
  const graph = graphValue(graphInput);
  const evidence = normalizeBoardEvidence(evidenceInput, graph);
  const semanticRef = stableRef(semanticRefInput, 'semanticRef');
  assert(graph.nodes.some((node) => node.nodeRef === semanticRef),
    `semanticRef missing: ${semanticRef}`);
  const slots = evidence.slots.filter((slot) => slot.semanticRef === semanticRef);
  return freezeBoardValue(slots.map((slot) => ({
    ...slot,
    artifacts: evidence.artifacts.filter((artifact) => artifact.slotRef === slot.slotRef),
  })));
}

// [VXG RealForever][VEXWORK][VEXBOARD][EVIDENCE]
