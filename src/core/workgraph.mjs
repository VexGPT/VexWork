import { semanticHash, verifySemanticFingerprint, withSemanticFingerprint } from './semantic.mjs';

export const WORKGRAPH_SCHEMA = 'vexwork.workgraph/v1';
export const PROJECT_SCHEMA = 'vexwork.project-definition/v1';
export const WORK_ITEM_SCHEMA = 'vexwork.work-item/v1';
export const TRANSITION_SCHEMA = 'vexwork.work-transition/v1';

const REF = /^[A-Za-z0-9][A-Za-z0-9._:/-]*$/u;
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/u;

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function stableRef(value, label) {
  assert(typeof value === 'string' && REF.test(value), `${label} must be one stable ref`);
  return value;
}

function refs(values, label) {
  assert(Array.isArray(values), `${label} must be an array`);
  const result = values.map((value, index) => stableRef(value, `${label}[${index}]`));
  assert(new Set(result).size === result.length, `${label} must be unique`);
  return result;
}

function timestamp(value, label) {
  assert(typeof value === 'string' && ISO.test(value) && new Date(value).toISOString() === value, `${label} must be canonical UTC ISO`);
  return value;
}

function assertAcyclic(items, edgesFor, label) {
  const byRef = new Map(items.map((item) => [item.workRef, item]));
  const visiting = new Set();
  const visited = new Set();
  const visit = (workRef) => {
    if (visiting.has(workRef)) throw new TypeError(`${label} cycle detected at ${workRef}`);
    if (visited.has(workRef)) return;
    visiting.add(workRef);
    for (const next of edgesFor(byRef.get(workRef))) visit(next);
    visiting.delete(workRef);
    visited.add(workRef);
  };
  for (const workRef of byRef.keys()) visit(workRef);
}

export function validateRegistry(registry) {
  const errors = [];
  const states = registry?.lifecycleStates ?? [];
  const stateSet = new Set(states);
  if (!Array.isArray(states) || states.length === 0 || stateSet.size !== states.length) errors.push('lifecycleStates invalid');
  for (const state of states) {
    const next = registry?.allowedTransitions?.[state];
    if (!Array.isArray(next)) errors.push(`allowedTransitions missing for ${state}`);
    else for (const candidate of next) if (!stateSet.has(candidate)) errors.push(`unknown transition target ${candidate}`);
  }
  const laneStates = [];
  for (const lane of registry?.boardLanes ?? []) {
    if (!REF.test(lane?.laneRef ?? '')) errors.push('invalid board lane ref');
    if (!Array.isArray(lane?.lifecycleStates) || lane.lifecycleStates.length === 0) errors.push(`board lane ${lane?.laneRef ?? ''} has no states`);
    laneStates.push(...(lane?.lifecycleStates ?? []));
  }
  if (laneStates.length !== states.length || new Set(laneStates).size !== stateSet.size || laneStates.some((state) => !stateSet.has(state))) {
    errors.push('board lane coverage must exactly equal lifecycleStates');
  }
  return Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) });
}

export function createProject(input) {
  assert(input?.schemaVersion === PROJECT_SCHEMA, 'project schema mismatch');
  stableRef(input.projectRef, 'projectRef');
  assert(typeof input.label === 'string' && input.label.trim(), 'project label required');
  assert(typeof input.purpose === 'string' && input.purpose.trim(), 'project purpose required');
  refs(input.rootWorkRefs, 'rootWorkRefs');
  refs(input.repositoryRefs, 'repositoryRefs');
  refs(input.sourceRefs, 'sourceRefs');
  timestamp(input.formedAt, 'formedAt');
  return withSemanticFingerprint(input);
}

export function createWorkItem(input, registry) {
  assert(input?.schemaVersion === WORK_ITEM_SCHEMA, 'work item schema mismatch');
  stableRef(input.workRef, 'workRef');
  stableRef(input.projectRef, 'projectRef');
  if (input.parentWorkRefOrNull !== null) stableRef(input.parentWorkRefOrNull, 'parentWorkRefOrNull');
  assert(typeof input.label === 'string' && input.label.trim(), 'work label required');
  assert(typeof input.purpose === 'string' && input.purpose.trim(), 'work purpose required');
  assert(registry.workClasses.includes(input.workClass), `unsupported workClass ${input.workClass}`);
  assert(registry.lifecycleStates.includes(input.state), `unsupported state ${input.state}`);
  assert(registry.priorityClasses.includes(input.priorityClass), `unsupported priority ${input.priorityClass}`);
  assert(registry.authorityDispositions.includes(input.authorityDisposition), 'unsupported authorityDisposition');
  assert(registry.effectDispositions.includes(input.effectDisposition), 'unsupported effectDisposition');
  refs(input.dependencyRefs, 'dependencyRefs');
  refs(input.repositoryRefs, 'repositoryRefs');
  refs(input.sourceRefs, 'sourceRefs');
  timestamp(input.createdAt, 'createdAt');
  timestamp(input.updatedAt, 'updatedAt');
  return withSemanticFingerprint(input);
}

export function createWorkgraph(input, registry) {
  assert(input?.schemaVersion === WORKGRAPH_SCHEMA, 'workgraph schema mismatch');
  stableRef(input.graphRef, 'graphRef');
  stableRef(input.projectRef, 'projectRef');
  refs(input.rootWorkRefs, 'rootWorkRefs');
  refs(input.sourceRefs, 'sourceRefs');
  timestamp(input.formedAt, 'formedAt');
  assert(Array.isArray(input.items) && input.items.length > 0, 'workgraph items required');
  assert(Array.isArray(input.transitions), 'workgraph transitions must be an array');

  const items = input.items.map((item) => verifySemanticFingerprint(item) ? item : createWorkItem(item, registry));
  const byRef = new Map(items.map((item) => [item.workRef, item]));
  assert(byRef.size === items.length, 'workRef must be unique');
  for (const item of items) {
    assert(item.projectRef === input.projectRef, `${item.workRef} project mismatch`);
    if (item.parentWorkRefOrNull !== null) assert(byRef.has(item.parentWorkRefOrNull), `${item.workRef} parent missing`);
    for (const dep of item.dependencyRefs) assert(byRef.has(dep), `${item.workRef} dependency missing: ${dep}`);
  }
  for (const rootRef of input.rootWorkRefs) assert(byRef.has(rootRef), `rootWorkRef missing: ${rootRef}`);
  assertAcyclic(items, (item) => item.parentWorkRefOrNull === null ? [] : [item.parentWorkRefOrNull], 'containment');
  assertAcyclic(items, (item) => item.dependencyRefs, 'dependency');
  const transitions = input.transitions.map((transition) => {
    assert(transition.schemaVersion === TRANSITION_SCHEMA, 'transition schema mismatch');
    stableRef(transition.transitionRef, 'transitionRef');
    stableRef(transition.workRef, 'transition.workRef');
    assert(byRef.has(transition.workRef), `transition work missing: ${transition.workRef}`);
    assert(registry.lifecycleStates.includes(transition.priorState), 'transition priorState unsupported');
    assert(registry.lifecycleStates.includes(transition.nextState), 'transition nextState unsupported');
    stableRef(transition.actorRef, 'transition.actorRef');
    refs(transition.sourceRefs, 'transition.sourceRefs');
    timestamp(transition.createdAt, 'transition.createdAt');
    return verifySemanticFingerprint(transition) ? transition : withSemanticFingerprint(transition);
  });
  return withSemanticFingerprint({ ...input, items, transitions });
}

export function requestTransition(graph, request, registry) {
  assert(verifySemanticFingerprint(graph), 'current Workgraph semanticFingerprint mismatch');
  stableRef(request.workRef, 'request.workRef');
  stableRef(request.transitionRef, 'request.transitionRef');
  stableRef(request.actorRef, 'request.actorRef');
  refs(request.sourceRefs, 'request.sourceRefs');
  timestamp(request.createdAt, 'request.createdAt');
  assert(request.expectedGraphFingerprint === graph.semanticFingerprint, 'stale Workgraph observation');

  const index = graph.items.findIndex((item) => item.workRef === request.workRef);
  assert(index >= 0, `unknown workRef ${request.workRef}`);
  const current = graph.items[index];
  assert(request.expectedState === current.state, 'stale WorkState observation');
  assert((registry.allowedTransitions[current.state] ?? []).includes(request.nextState), `transition ${current.state} -> ${request.nextState} not allowed`);

  const transition = withSemanticFingerprint({
    schemaVersion: TRANSITION_SCHEMA,
    transitionRef: request.transitionRef,
    workRef: request.workRef,
    priorState: current.state,
    nextState: request.nextState,
    reason: request.reason,
    actorRef: request.actorRef,
    sourceRefs: request.sourceRefs,
    createdAt: request.createdAt,
  });

  const nextItem = withSemanticFingerprint({
    ...current,
    state: request.nextState,
    updatedAt: request.createdAt,
  });
  const items = [...graph.items];
  items[index] = nextItem;
  const nextGraphCore = {
    ...graph,
    items,
    transitions: [...graph.transitions, transition],
  };
  delete nextGraphCore.semanticFingerprint;
  const nextGraph = withSemanticFingerprint(nextGraphCore);
  return Object.freeze({
    schemaVersion: 'vexwork.work-transition-result/v1',
    state: 'ACCEPTED',
    priorGraphFingerprint: graph.semanticFingerprint,
    nextGraphFingerprint: nextGraph.semanticFingerprint,
    transition,
    graph: nextGraph,
    effects: Object.freeze({ workgraphMutationRepresented: true, providerMutationPerformed: false }),
  });
}

export function childRefs(graph, workRef) {
  return graph.items.filter((item) => item.parentWorkRefOrNull === workRef).map((item) => item.workRef).sort();
}

export function graphFingerprintWithoutStoredValue(graph) {
  const core = structuredClone(graph);
  delete core.semanticFingerprint;
  return semanticHash(core);
}
