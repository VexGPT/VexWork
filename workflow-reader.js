export const WORK_REGISTRY_SCHEMA = 'vexwork.work-registry/v1';
export const PROJECT_REGISTRY_SCHEMA = 'vexwork.project-registry/v1';

const PRIMARY_LANES = new Set([
  'lane.work.intake',
  'lane.work.planned',
  'lane.work.ready',
  'lane.work.active',
  'lane.work.verify',
  'lane.work.done',
]);
const SUPPORT_LANES = new Set([
  'lane.work.waiting',
  'lane.work.needs-human',
  'lane.work.attention',
]);
const ARCHIVE_LANES = new Set(['lane.work.archive']);

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

export function validateWorkRegistry(registry) {
  assert(registry?.schemaVersion === WORK_REGISTRY_SCHEMA, 'work registry schema mismatch');
  assert(Array.isArray(registry.lifecycleStates) && registry.lifecycleStates.length > 0, 'lifecycleStates required');
  assert(Array.isArray(registry.boardLanes) && registry.boardLanes.length > 0, 'boardLanes required');
  const states = new Set(registry.lifecycleStates);
  assert(states.size === registry.lifecycleStates.length, 'lifecycleStates must be unique');
  for (const state of registry.lifecycleStates) {
    const next = registry.allowedTransitions?.[state];
    assert(Array.isArray(next), `allowedTransitions missing for ${state}`);
    for (const candidate of next) assert(states.has(candidate), `unknown transition target ${candidate}`);
  }
  return registry;
}

export function validateProjectRegistry(registry) {
  assert(registry?.schemaVersion === PROJECT_REGISTRY_SCHEMA, 'project registry schema mismatch');
  assert(Array.isArray(registry.projects), 'project registry projects required');
  return registry;
}

export function laneForState(registry, state) {
  validateWorkRegistry(registry);
  const lanes = registry.boardLanes.filter((lane) => lane.lifecycleStates.includes(state));
  assert(lanes.length === 1, `state ${state} must map to exactly one Board lane`);
  return lanes[0];
}

export function laneRole(laneRef) {
  if (PRIMARY_LANES.has(laneRef)) return 'PRIMARY';
  if (SUPPORT_LANES.has(laneRef)) return 'SUPPORT';
  if (ARCHIVE_LANES.has(laneRef)) return 'ARCHIVE';
  return 'OTHER';
}

export function classifyTransition(registry, fromState, toState) {
  const fromLane = laneForState(registry, fromState);
  const toLane = laneForState(registry, toState);
  if (fromLane.laneRef === toLane.laneRef) return 'WITHIN_PHASE';
  if (toLane.laneRef === 'lane.work.done') return 'DONE';
  if (toLane.laneRef === 'lane.work.archive') return 'EXIT';
  if (SUPPORT_LANES.has(toLane.laneRef)) return 'EXCEPTION';
  if (SUPPORT_LANES.has(fromLane.laneRef) && PRIMARY_LANES.has(toLane.laneRef)) return 'RESUME';
  return 'FORWARD';
}

function applicability(boundary, context) {
  const appliesTo = boundary?.appliesTo;
  if (!appliesTo) return Object.freeze({ state: 'APPLIES', reason: 'all work' });
  const workClasses = appliesTo.workClasses ?? [];
  const workRefs = appliesTo.workRefs ?? [];
  const hasContext = Boolean(context?.workClass || context?.workRef);
  if (!hasContext) {
    return Object.freeze({
      state: 'CONDITIONAL',
      reason: [
        workClasses.length ? `workClass in ${workClasses.join(', ')}` : '',
        workRefs.length ? `explicit workRef (${workRefs.length})` : '',
      ].filter(Boolean).join(' or '),
    });
  }
  const matches = workClasses.includes(context?.workClass) || workRefs.includes(context?.workRef);
  return Object.freeze({
    state: matches ? 'APPLIES' : 'DOES_NOT_APPLY',
    reason: matches ? 'current work matches review scope' : 'current work is outside review scope',
  });
}

function protectedPhaseLaneRefs(policy, context) {
  return new Set((policy?.handshakeLaneTransitions ?? [])
    .filter((boundary) => applicability(boundary, context).state !== 'DOES_NOT_APPLY')
    .flatMap((boundary) => [boundary.fromLaneRef, boundary.toLaneRef]));
}

function effectivePhaseLaneFromHistory({ policy, registry, priorState, transitionHistory, context }) {
  const direct = laneForState(registry, priorState).laneRef;
  const protectedLanes = protectedPhaseLaneRefs(policy, context);
  if (protectedLanes.has(direct)) return direct;
  if (!Array.isArray(transitionHistory) || transitionHistory.length === 0) return null;

  let state = priorState;
  for (let index = transitionHistory.length - 1; index >= 0; index -= 1) {
    const transition = transitionHistory[index];
    if (transition.nextState !== state) continue;
    const priorLane = laneForState(registry, transition.priorState).laneRef;
    if (protectedLanes.has(priorLane)) return priorLane;
    state = transition.priorState;
  }
  return null;
}

export function reviewRequirementForTransition(policy, registry, {
  fromState,
  toState,
  workClass = null,
  workRef = null,
  transitionHistory = [],
} = {}) {
  if (!policy) return Object.freeze({ mode: 'NONE', boundaryRefOrNull: null, reason: 'No Project Agency Policy is configured.' });

  const fromLane = laneForState(registry, fromState);
  const toLane = laneForState(registry, toState);
  const context = { workClass, workRef };

  const exact = (policy.handshakeLaneTransitions ?? []).find((boundary) => {
    if (boundary.fromLaneRef !== fromLane.laneRef || boundary.toLaneRef !== toLane.laneRef) return false;
    return applicability(boundary, context).state !== 'DOES_NOT_APPLY';
  }) ?? null;

  if (exact) {
    const applies = applicability(exact, context);
    return Object.freeze({
      mode: applies.state === 'CONDITIONAL' ? 'CONDITIONAL' : 'REQUIRED',
      boundaryRefOrNull: exact.boundaryRef,
      reason: applies.state === 'CONDITIONAL'
        ? `Human review applies if ${applies.reason}.`
        : 'Human acknowledgement and approval is required before this phase crossing.',
    });
  }

  if (fromLane.laneRef !== toLane.laneRef) {
    const protectedTarget = (policy.handshakeLaneTransitions ?? []).find((boundary) => {
      if (boundary.toLaneRef !== toLane.laneRef) return false;
      return applicability(boundary, context).state !== 'DOES_NOT_APPLY';
    }) ?? null;
    if (protectedTarget) {
      const effectiveLane = effectivePhaseLaneFromHistory({
        policy,
        registry,
        priorState: fromState,
        transitionHistory,
        context,
      });
      if (effectiveLane === toLane.laneRef) {
        return Object.freeze({
          mode: 'NONE',
          boundaryRefOrNull: null,
          reason: 'Exact transition history proves this is a same-phase resume into an already-entered protected phase.',
        });
      }
      const applies = applicability(protectedTarget, context);
      return Object.freeze({
        mode: applies.state === 'CONDITIONAL' ? 'CONDITIONAL_PROTECTED_TARGET' : 'PROTECTED_TARGET',
        boundaryRefOrNull: protectedTarget.boundaryRef,
        reason: applies.state === 'CONDITIONAL'
          ? `Entry into this protected phase requires review if ${applies.reason}; proven same-phase resume may remain autonomous.`
          : 'Entry into this protected phase requires review because no exact same-phase resume provenance was found.',
      });
    }
  }

  return Object.freeze({ mode: 'NONE', boundaryRefOrNull: null, reason: 'No human transition boundary applies to this edge.' });
}

export function policyScopeSummary(boundary) {
  if (!boundary?.appliesTo) return 'All Project work';
  const parts = [];
  if (boundary.appliesTo.workClasses?.length) parts.push(boundary.appliesTo.workClasses.join(' / '));
  if (boundary.appliesTo.workRefs?.length) parts.push(`${boundary.appliesTo.workRefs.length} explicit work ref${boundary.appliesTo.workRefs.length === 1 ? '' : 's'}`);
  return parts.join(' or ') || 'No work selected';
}

export function shortestRouteToDone(registry, startState) {
  validateWorkRegistry(registry);
  assert(registry.lifecycleStates.includes(startState), `unknown start state ${startState}`);
  const doneStates = new Set((registry.boardLanes.find((lane) => lane.laneRef === 'lane.work.done')?.lifecycleStates) ?? []);
  if (doneStates.has(startState)) return Object.freeze([startState]);

  const queue = [[startState]];
  const visited = new Set([startState]);
  while (queue.length) {
    const path = queue.shift();
    const current = path.at(-1);
    for (const next of registry.allowedTransitions[current] ?? []) {
      if (visited.has(next)) continue;
      const nextPath = [...path, next];
      if (doneStates.has(next)) return Object.freeze(nextPath);
      visited.add(next);
      queue.push(nextPath);
    }
  }
  return Object.freeze([]);
}

export function projectLifecycleWorkflow(registry, {
  policy = null,
  currentState = null,
  workClass = null,
  workRef = null,
  transitionHistory = [],
} = {}) {
  validateWorkRegistry(registry);
  const context = { workClass, workRef };
  const lanes = registry.boardLanes.map((lane) => Object.freeze({
    laneRef: lane.laneRef,
    label: lane.label,
    role: laneRole(lane.laneRef),
    states: Object.freeze([...lane.lifecycleStates]),
  }));

  const edges = [];
  for (const fromState of registry.lifecycleStates) {
    for (const toState of registry.allowedTransitions[fromState] ?? []) {
      edges.push(Object.freeze({
        fromState,
        toState,
        fromLaneRef: laneForState(registry, fromState).laneRef,
        toLaneRef: laneForState(registry, toState).laneRef,
        kind: classifyTransition(registry, fromState, toState),
        review: reviewRequirementForTransition(policy, registry, {
          fromState,
          toState,
          ...context,
          transitionHistory: fromState === currentState ? transitionHistory : [],
        }),
      }));
    }
  }

  const outgoing = currentState
    ? edges.filter((edge) => edge.fromState === currentState)
    : [];
  const routeToDone = currentState ? shortestRouteToDone(registry, currentState) : [];

  return Object.freeze({
    schemaVersion: 'vexwork.lifecycle-workflow-projection/v1',
    currentState,
    workClass,
    workRef,
    lanes: Object.freeze(lanes),
    edges: Object.freeze(edges),
    outgoing: Object.freeze(outgoing),
    routeToDone,
    policy: policy ? Object.freeze({
      schemaVersion: policy.schemaVersion,
      policyRef: policy.policyRef,
      projectRef: policy.projectRef,
      boundaries: Object.freeze((policy.handshakeLaneTransitions ?? []).map((boundary) => Object.freeze({
        boundaryRef: boundary.boundaryRef,
        fromLaneRef: boundary.fromLaneRef,
        toLaneRef: boundary.toLaneRef,
        scope: policyScopeSummary(boundary),
      }))),
    }) : null,
    effects: false,
    executionAuthority: 'NONE',
  });
}

// [VXG RealForever][VEXWORK][LIFECYCLE-WORKFLOW-PROJECTION]
