import { semanticHash, verifySemanticFingerprint, withSemanticFingerprint } from './semantic.mjs';
import { projectWorkRefs } from './workgraph.mjs';

export const PROJECT_PLANNING_REGISTRY_SCHEMA = 'vexwork.project-planning-registry/v1';
export const PROJECT_PLANNING_TRANSACTION_SCHEMA = 'vexwork.project-planning-transaction/v1';
export const PROJECT_PLANNING_EVENT_SCHEMA = 'vexwork.project-planning-event/v1';
export const PROJECT_PLANNING_SNAPSHOT_SCHEMA = 'vexwork.project-planning-snapshot/v1';
export const PROJECT_PLANNING_RESULT_SCHEMA = 'vexwork.project-planning-result/v1';

const REF = /^[A-Za-z0-9][A-Za-z0-9._:/-]*$/u;
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/u;
const HEX64 = /^[a-f0-9]{64}$/u;

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function stableRef(value, label) {
  assert(typeof value === 'string' && REF.test(value), `${label} must be one stable ref`);
  return value;
}

function timestamp(value, label) {
  assert(typeof value === 'string' && ISO.test(value) && new Date(value).toISOString() === value, `${label} must be canonical UTC ISO`);
  return value;
}

function refs(values, label, { ordered = false } = {}) {
  assert(Array.isArray(values), `${label} must be an array`);
  const accepted = values.map((value, index) => stableRef(value, `${label}[${index}]`));
  assert(new Set(accepted).size === accepted.length, `${label} must be unique`);
  return ordered ? [...accepted] : [...accepted].sort();
}

function exactKeys(value, keys, label) {
  assert(value && typeof value === 'object' && !Array.isArray(value), `${label} must be one object`);
  assert(JSON.stringify(Object.keys(value).sort()) === JSON.stringify([...keys].sort()), `${label} has unexpected fields`);
}

function storedFingerprintIfPresent(value, label) {
  if (value?.semanticFingerprint !== undefined) assert(verifySemanticFingerprint(value), `${label} semanticFingerprint mismatch`);
}

function eventDefinition(registry, eventClass) {
  const found = registry.planningEventClasses.find((candidate) => candidate.eventClass === eventClass);
  assert(found, `unsupported planning eventClass ${eventClass}`);
  return found;
}

export function validateProjectPlanningRegistry(registry) {
  const errors = [];
  if (registry?.schemaVersion !== PROJECT_PLANNING_REGISTRY_SCHEMA) errors.push('project planning registry schema mismatch');
  if (typeof registry?.registryRef !== 'string' || !REF.test(registry.registryRef ?? '')) errors.push('project planning registryRef invalid');
  if (!Number.isSafeInteger(registry?.registryVersion) || registry.registryVersion < 1) errors.push('project planning registryVersion invalid');
  if (typeof registry?.purpose !== 'string' || !registry.purpose.trim()) errors.push('project planning registry purpose required');
  if (!Array.isArray(registry?.planningEventClasses) || registry.planningEventClasses.length !== 6) errors.push('project planning event vocabulary invalid');
  const seen = new Set();
  for (const item of registry?.planningEventClasses ?? []) {
    if (typeof item?.eventClass !== 'string' || !REF.test(item.eventClass)) errors.push('project planning eventClass invalid');
    else if (seen.has(item.eventClass)) errors.push(`duplicate planning eventClass ${item.eventClass}`);
    else seen.add(item.eventClass);
    if (!Array.isArray(item?.requiredPayloadFields) || item.requiredPayloadFields.length === 0 || new Set(item.requiredPayloadFields).size !== item.requiredPayloadFields.length) {
      errors.push(`project planning event payload definition invalid for ${item?.eventClass ?? 'unknown'}`);
    }
  }
  return Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) });
}

export function projectPlanningContextFingerprint({ project, graph, viewRefs = [], workRegistry }) {
  assert(verifySemanticFingerprint(project), 'project semanticFingerprint mismatch');
  assert(verifySemanticFingerprint(graph), 'Workgraph semanticFingerprint mismatch');
  assert(workRegistry && Array.isArray(workRegistry.boardLanes), 'workRegistry board lanes required');
  const selected = projectWorkRefs(project, graph);
  const lanes = workRegistry.boardLanes.map((lane) => stableRef(lane.laneRef, 'laneRef')).sort();
  const views = refs(viewRefs, 'viewRefs');
  return semanticHash({
    schemaVersion: 'vexwork.project-planning-context/v1',
    projectRef: project.projectRef,
    workRefs: selected,
    laneRefs: lanes,
    viewRefs: views,
  });
}

export function createProjectPlanningTransaction(input, registry) {
  storedFingerprintIfPresent(input, 'project planning transaction');
  assert(input?.schemaVersion === PROJECT_PLANNING_TRANSACTION_SCHEMA, 'project planning transaction schema mismatch');
  stableRef(input.transactionRef, 'transactionRef');
  stableRef(input.eventRef, 'eventRef');
  stableRef(input.projectRef, 'projectRef');
  const definition = eventDefinition(registry, input.eventClass);
  exactKeys(input.payload, definition.requiredPayloadFields, `${input.eventClass}.payload`);
  assert(typeof input.expectedContextFingerprint === 'string' && HEX64.test(input.expectedContextFingerprint), 'expectedContextFingerprint must be lowercase SHA-256');
  assert(input.expectedPlanningSnapshotFingerprintOrNull === null || (typeof input.expectedPlanningSnapshotFingerprintOrNull === 'string' && HEX64.test(input.expectedPlanningSnapshotFingerprintOrNull)), 'expectedPlanningSnapshotFingerprintOrNull invalid');
  stableRef(input.actorRef, 'actorRef');
  const sourceRefs = refs(input.sourceRefs, 'sourceRefs');
  assert(sourceRefs.length > 0, 'sourceRefs must be non-empty');
  timestamp(input.formedAt, 'formedAt');
  return withSemanticFingerprint({
    schemaVersion: PROJECT_PLANNING_TRANSACTION_SCHEMA,
    transactionRef: input.transactionRef,
    eventRef: input.eventRef,
    projectRef: input.projectRef,
    eventClass: input.eventClass,
    payload: structuredClone(input.payload),
    expectedContextFingerprint: input.expectedContextFingerprint,
    expectedPlanningSnapshotFingerprintOrNull: input.expectedPlanningSnapshotFingerprintOrNull,
    actorRef: input.actorRef,
    sourceRefs,
    formedAt: input.formedAt,
  });
}

function normalizeSnapshot(snapshot) {
  if (snapshot === null) return null;
  assert(verifySemanticFingerprint(snapshot), 'project planning snapshot semanticFingerprint mismatch');
  assert(snapshot.schemaVersion === PROJECT_PLANNING_SNAPSHOT_SCHEMA, 'project planning snapshot schema mismatch');
  assert(snapshot.currentness === 'CURRENT', 'project planning snapshot must be CURRENT');
  stableRef(snapshot.projectRef, 'snapshot.projectRef');
  assert(typeof snapshot.contextFingerprint === 'string' && HEX64.test(snapshot.contextFingerprint), 'snapshot contextFingerprint invalid');
  assert(Number.isSafeInteger(snapshot.sequence) && snapshot.sequence >= 1, 'snapshot sequence invalid');
  assert(snapshot.lastEventRefOrNull === null || REF.test(snapshot.lastEventRefOrNull), 'snapshot lastEventRe