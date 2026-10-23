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
  assert(snapshot.lastEventRefOrNull === null || REF.test(snapshot.lastEventRefOrNull), 'snapshot lastEventRefOrNull invalid');
  assert(snapshot.lastEventFingerprintOrNull === null || HEX64.test(snapshot.lastEventFingerprintOrNull), 'snapshot lastEventFingerprintOrNull invalid');
  assert(Array.isArray(snapshot.iterations), 'snapshot iterations required');
  assert(Array.isArray(snapshot.iterationMemberships), 'snapshot iterationMemberships required');
  assert(Array.isArray(snapshot.sharedOrders), 'snapshot sharedOrders required');
  assert(Array.isArray(snapshot.wipPolicies), 'snapshot wipPolicies required');
  assert(snapshot.selectedViewRefOrNull === null || REF.test(snapshot.selectedViewRefOrNull), 'snapshot selectedViewRefOrNull invalid');
  refs(snapshot.sourceRefs, 'snapshot.sourceRefs');
  timestamp(snapshot.formedAt, 'snapshot.formedAt');
  return snapshot;
}

function currentState(snapshot, projectRef, contextFingerprint) {
  if (snapshot === null) {
    return {
      projectRef,
      contextFingerprint,
      sequence: 0,
      lastEventRefOrNull: null,
      lastEventFingerprintOrNull: null,
      iterations: [],
      iterationMemberships: [],
      sharedOrders: [],
      wipPolicies: [],
      selectedViewRefOrNull: null,
      sourceRefs: [],
    };
  }
  normalizeSnapshot(snapshot);
  assert(snapshot.projectRef === projectRef, 'planning snapshot project mismatch');
  assert(snapshot.contextFingerprint === contextFingerprint, 'planning snapshot context changed; rebase required');
  return structuredClone(snapshot);
}

function iterationByRef(state, iterationRef) {
  return state.iterations.find((item) => item.iterationRef === iterationRef) ?? null;
}

function membershipFor(state, iterationRef) {
  return state.iterationMemberships.find((item) => item.iterationRef === iterationRef)?.workRefs ?? [];
}

function upsert(list, key, value) {
  const index = list.findIndex((item) => item[key] === value[key]);
  if (index < 0) list.push(value);
  else list[index] = value;
}

function validatePayload({ transaction, state, knownWorkRefs, knownLaneRefs, knownViewRefs }) {
  const payload = transaction.payload;
  if (transaction.eventClass === 'ITERATION_DEFINED') {
    stableRef(payload.iterationRef, 'iterationRef');
    assert(typeof payload.label === 'string' && payload.label.trim(), 'iteration label required');
    timestamp(payload.startsAt, 'startsAt');
    timestamp(payload.endsAt, 'endsAt');
    assert(Date.parse(payload.endsAt) > Date.parse(payload.startsAt), 'iteration endsAt must be after startsAt');
    assert(!iterationByRef(state, payload.iterationRef), `iteration already defined: ${payload.iterationRef}`);
    return;
  }
  if (transaction.eventClass === 'ITERATION_CLOSED') {
    stableRef(payload.iterationRef, 'iterationRef');
    timestamp(payload.closedAt, 'closedAt');
    const iteration = iterationByRef(state, payload.iterationRef);
    assert(iteration, `unknown iteration ${payload.iterationRef}`);
    assert(iteration.closedAtOrNull === null, `iteration already closed: ${payload.iterationRef}`);
    return;
  }
  if (transaction.eventClass === 'ITERATION_MEMBERSHIP_SET') {
    stableRef(payload.iterationRef, 'iterationRef');
    const iteration = iterationByRef(state, payload.iterationRef);
    assert(iteration, `unknown iteration ${payload.iterationRef}`);
    assert(iteration.closedAtOrNull === null, `closed iteration membership cannot change: ${payload.iterationRef}`);
    const workRefs = refs(payload.workRefs, 'workRefs');
    assert(workRefs.every((workRef) => knownWorkRefs.has(workRef)), 'iteration membership contains work outside Project');
    return;
  }
  if (transaction.eventClass === 'SHARED_ORDER_SET') {
    stableRef(payload.scopeRef, 'scopeRef');
    const workRefs = refs(payload.workRefs, 'workRefs', { ordered: true });
    assert(workRefs.every((workRef) => knownWorkRefs.has(workRef)), 'shared order contains work outside Project');
    return;
  }
  if (transaction.eventClass === 'WIP_POLICY_SET') {
    stableRef(payload.laneRef, 'laneRef');
    assert(knownLaneRefs.has(payload.laneRef), `unknown Board lane ${payload.laneRef}`);
    assert(Number.isSafeInteger(payload.limit) && payload.limit > 0, 'WIP limit must be one positive integer');
    return;
  }
  if (transaction.eventClass === 'VIEW_SELECTED') {
    stableRef(payload.viewRef, 'viewRef');
    assert(knownViewRefs.has(payload.viewRef), `unknown Project view ${payload.viewRef}`);
    return;
  }
  throw new TypeError(`unsupported planning eventClass ${transaction.eventClass}`);
}

function applyPayload(transaction, state) {
  const payload = structuredClone(transaction.payload);
  if (transaction.eventClass === 'ITERATION_DEFINED') {
    state.iterations.push({
      iterationRef: payload.iterationRef,
      label: payload.label,
      startsAt: payload.startsAt,
      endsAt: payload.endsAt,
      closedAtOrNull: null,
      finalWorkRefs: [],
    });
  } else if (transaction.eventClass === 'ITERATION_CLOSED') {
    const iteration = iterationByRef(state, payload.iterationRef);
    iteration.closedAtOrNull = payload.closedAt;
    iteration.finalWorkRefs = membershipFor(state, payload.iterationRef);
  } else if (transaction.eventClass === 'ITERATION_MEMBERSHIP_SET') {
    upsert(state.iterationMemberships, 'iterationRef', { iterationRef: payload.iterationRef, workRefs: refs(payload.workRefs, 'workRefs') });
  } else if (transaction.eventClass === 'SHARED_ORDER_SET') {
    upsert(state.sharedOrders, 'scopeRef', { scopeRef: payload.scopeRef, workRefs: refs(payload.workRefs, 'workRefs', { ordered: true }) });
  } else if (transaction.eventClass === 'WIP_POLICY_SET') {
    upsert(state.wipPolicies, 'laneRef', { laneRef: payload.laneRef, limit: payload.limit });
  } else if (transaction.eventClass === 'VIEW_SELECTED') {
    state.selectedViewRefOrNull = payload.viewRef;
  }
}

export function applyProjectPlanningTransaction({
  project,
  graph,
  viewRefs = [],
  currentSnapshotOrNull = null,
  transaction,
  planningRegistry,
  workRegistry,
}) {
  assert(verifySemanticFingerprint(project), 'project semanticFingerprint mismatch');
  assert(verifySemanticFingerprint(graph), 'Workgraph semanticFingerprint mismatch');
  transaction = createProjectPlanningTransaction(transaction, planningRegistry);
  assert(transaction.projectRef === project.projectRef, 'planning transaction project mismatch');
  const contextFingerprint = projectPlanningContextFingerprint({ project, graph, viewRefs, workRegistry });
  assert(transaction.expectedContextFingerprint === contextFingerprint, 'planning transaction context is stale');
  const current = normalizeSnapshot(currentSnapshotOrNull);
  const currentFingerprint = current?.semanticFingerprint ?? null;
  assert(transaction.expectedPlanningSnapshotFingerprintOrNull === currentFingerprint, 'planning transaction snapshot is stale');

  const state = currentState(current, project.projectRef, contextFingerprint);
  const knownWorkRefs = new Set(projectWorkRefs(project, graph));
  const knownLaneRefs = new Set(workRegistry.boardLanes.map((lane) => lane.laneRef));
  const knownViewRefs = new Set(refs(viewRefs, 'viewRefs'));
  validatePayload({ transaction, state, knownWorkRefs, knownLaneRefs, knownViewRefs });

  const sequence = state.sequence + 1;
  const event = withSemanticFingerprint({
    schemaVersion: PROJECT_PLANNING_EVENT_SCHEMA,
    eventRef: transaction.eventRef,
    transactionRef: transaction.transactionRef,
    projectRef: project.projectRef,
    sequence,
    priorEventRefOrNull: state.lastEventRefOrNull,
    priorEventFingerprintOrNull: state.lastEventFingerprintOrNull,
    eventClass: transaction.eventClass,
    payload: structuredClone(transaction.payload),
    actorRef: transaction.actorRef,
    sourceRefs: transaction.sourceRefs,
    formedAt: transaction.formedAt,
  });

  applyPayload(transaction, state);
  const sourceRefs = [...new Set([...state.sourceRefs, ...transaction.sourceRefs])].sort();
  const snapshot = withSemanticFingerprint({
    schemaVersion: PROJECT_PLANNING_SNAPSHOT_SCHEMA,
    currentness: 'CURRENT',
    projectRef: project.projectRef,
    contextFingerprint,
    sequence,
    lastEventRefOrNull: event.eventRef,
    lastEventFingerprintOrNull: event.semanticFingerprint,
    iterations: state.iterations,
    iterationMemberships: state.iterationMemberships,
    sharedOrders: state.sharedOrders,
    wipPolicies: state.wipPolicies,
    selectedViewRefOrNull: state.selectedViewRefOrNull,
    sourceRefs,
    formedAt: transaction.formedAt,
  });

  return Object.freeze({
    schemaVersion: PROJECT_PLANNING_RESULT_SCHEMA,
    state: 'ACCEPTED',
    event,
    snapshot,
    graph,
    effects: Object.freeze({
      planningMutationRepresented: true,
      workgraphMutationRepresented: false,
      providerMutationPerformed: false,
    }),
    executionAuthority: 'NONE',
  });
}

export function validateProjectPlanningSnapshot(snapshot) {
  return normalizeSnapshot(snapshot);
}

// [VXG RealForever][VEXWORK][PROJECT-PLANNING]
