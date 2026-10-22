const WORKSPACE_KIND = 'WORKSPACE';
const PROJECT_KIND = 'PROJECT';
const WORK_KIND = 'WORK';

export const TERRAIN_FRAME_SCHEMA = 'vexwork.terrain-frame/v1';
export const TERRAIN_JOURNEY_EVENT_SCHEMA = 'vexwork.terrain-journey-event/v1';

export const RELATIONSHIP = Object.freeze({
  PROJECT: 'PROJECT',
  PROJECT_ROOT: 'PROJECT_ROOT',
  CONTAINS: 'CONTAINS',
  PARENT: 'PARENT',
  DEPENDS_ON: 'DEPENDS_ON',
  DEPENDED_ON_BY: 'DEPENDED_ON_BY',
  RETURN: 'RETURN',
  REVISIT: 'REVISIT',
  SEARCH_PORTAL: 'SEARCH_PORTAL',
});

const RELATIONSHIP_ORDER = Object.freeze({
  PARENT: 0,
  PROJECT_ROOT: 1,
  CONTAINS: 2,
  DEPENDS_ON: 3,
  DEPENDED_ON_BY: 4,
  PROJECT: 5,
  RETURN: 6,
  REVISIT: 7,
  SEARCH_PORTAL: 8,
});

function freeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.values(value).forEach(freeze);
  return Object.freeze(value);
}

function clone(value) {
  return structuredClone(value);
}

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function validateWorkspace(workspace) {
  assert(workspace?.schemaVersion === 'vexwork.public-workspace/v1', 'unsupported VexWork workspace schema');
  assert(Array.isArray(workspace.projects), 'workspace projects required');
  assert(workspace.effects === false && workspace.executionAuthority === 'NONE', 'Terrain requires read-only VexWork workspace');
  return workspace;
}

export function workspaceNode() {
  return freeze({
    nodeKey: 'workspace:vexwork',
    kind: WORKSPACE_KIND,
    semanticRef: 'workspace.vexwork',
    projectRef: null,
    workRef: null,
    label: 'VexWork',
    purpose: 'Canonical work-navigation workspace',
    state: null,
    workClass: null,
    priorityClass: null,
  });
}

export function projectNode(project) {
  assert(project?.project?.projectRef, 'project entry required');
  return freeze({
    nodeKey: `project:${project.project.projectRef}`,
    kind: PROJECT_KIND,
    semanticRef: project.project.projectRef,
    projectRef: project.project.projectRef,
    workRef: null,
    label: project.project.label,
    purpose: project.project.purpose,
    state: null,
    workClass: 'PROJECT',
    priorityClass: null,
    summary: clone(project.summary),
  });
}

export function workNode(project, item) {
  assert(project?.project?.projectRef && item?.workRef, 'project and work item required');
  return freeze({
    nodeKey: `work:${project.project.projectRef}:${item.workRef}`,
    kind: WORK_KIND,
    semanticRef: item.workRef,
    projectRef: project.project.projectRef,
    workRef: item.workRef,
    label: item.label,
    purpose: item.purpose,
    state: item.state,
    workClass: item.workClass,
    priorityClass: item.priorityClass,
    workDisposition: item.workDisposition,
    updatedAt: item.updatedAt,
  });
}

function projectByRef(workspace, projectRef) {
  return workspace.projects.find((entry) => entry.project.projectRef === projectRef) || null;
}

function itemByRef(project, workRef) {
  return (project?.items || []).find((item) => item.workRef === workRef) || null;
}

export function projectContextsForWork(workspace, workRef) {
  validateWorkspace(workspace);
  return freeze(workspace.projects
    .filter((project) => itemByRef(project, workRef))
    .map((project) => project.project.projectRef)
    .sort());
}

function preferredProjectForWork(workspace, workRef, preferredProjectRef = null) {
  if (preferredProjectRef) {
    const preferred = projectByRef(workspace, preferredProjectRef);
    if (preferred && itemByRef(preferred, workRef)) return preferred;
  }
  const contexts = projectContextsForWork(workspace, workRef);
  return contexts.length ? projectByRef(workspace, contexts[0]) : null;
}

export function nodeFromKey(workspace, nodeKey) {
  validateWorkspace(workspace);
  if (nodeKey === 'workspace:vexwork') return workspaceNode();
  if (nodeKey?.startsWith('project:')) return projectNode(projectByRef(workspace, nodeKey.slice('project:'.length)));
  if (nodeKey?.startsWith('work:')) {
    const body = nodeKey.slice('work:'.length);
    const split = body.indexOf(':work.');
    assert(split > 0, `invalid Terrain work nodeKey ${nodeKey}`);
    const projectRef = body.slice(0, split);
    const workRef = body.slice(split + 1);
    const project = projectByRef(workspace, projectRef);
    const item = itemByRef(project, workRef);
    assert(project && item, `unknown Terrain work nodeKey ${nodeKey}`);
    return workNode(project, item);
  }
  throw new TypeError(`unknown Terrain nodeKey ${nodeKey}`);
}

export function structuralPath(workspace, nodeKey) {
  validateWorkspace(workspace);
  const node = nodeFromKey(workspace, nodeKey);
  if (node.kind === WORKSPACE_KIND) return freeze([node]);
  const project = projectByRef(workspace, node.projectRef);
  assert(project, `missing Project ${node.projectRef}`);
  if (node.kind === PROJECT_KIND) return freeze([workspaceNode(), node]);

  const byRef = new Map(project.items.map((item) => [item.workRef, item]));
  const refs = [];
  const seen = new Set();
  let current = byRef.get(node.workRef);
  while (current) {
    assert(!seen.has(current.workRef), `containment cycle at ${current.workRef}`);
    seen.add(current.workRef);
    refs.unshift(current.workRef);
    current = current.parentWorkRefOrNull ? byRef.get(current.parentWorkRefOrNull) : null;
  }
  return freeze([
    workspaceNode(),
    projectNode(project),
    ...refs.map((workRef) => workNode(project, byRef.get(workRef))),
  ]);
}

function incomingDependencies(workspace, targetWorkRef) {
  const hits = [];
  for (const project of workspace.projects) {
    for (const item of project.items) {
      if ((item.dependencyRefs || []).includes(targetWorkRef)) hits.push({ project, item });
    }
  }
  const byKey = new Map();
  for (const hit of hits) {
    if (!byKey.has(hit.item.workRef)) byKey.set(hit.item.workRef, hit);
  }
  return [...byKey.values()].sort((a, b) => a.item.workRef.localeCompare(b.item.workRef));
}

function neighbor(target, relationshipKind, details = {}) {
  return {
    node: target,
    relationshipKinds: [relationshipKind],
    relationshipDetails: [{ relationshipKind, ...details }],
  };
}

function mergeNeighbor(map, candidate) {
  const prior = map.get(candidate.node.nodeKey);
  if (!prior) {
    map.set(candidate.node.nodeKey, candidate);
    return;
  }
  for (const kind of candidate.relationshipKinds) {
    if (!prior.relationshipKinds.includes(kind)) prior.relationshipKinds.push(kind);
  }
  prior.relationshipDetails.push(...candidate.relationshipDetails);
}

function relationshipRank(candidate) {
  return Math.min(...candidate.relationshipKinds.map((kind) => RELATIONSHIP_ORDER[kind] ?? 99));
}

function activeRank(node) {
  if (['RUNNING', 'CONTEXT_ADMITTED', 'WAITING_TOOL', 'VERIFYING'].includes(node.state)) return 0;
  if (['WAITING_HUMAN', 'BLOCKED', 'FAILED_RECOVERABLE'].includes(node.state)) return 1;
  if (node.state === 'READY') return 2;
  return 3;
}

export function terrainNeighborhood(workspace, nodeKey, { limit = 12 } = {}) {
  validateWorkspace(workspace);
  assert(Number.isInteger(limit) && limit >= 1, 'Terrain neighborhood limit must be positive');
  const focus = nodeFromKey(workspace, nodeKey);
  const merged = new Map();

  if (focus.kind === WORKSPACE_KIND) {
    for (const project of workspace.projects) mergeNeighbor(merged, neighbor(projectNode(project), RELATIONSHIP.PROJECT));
  } else if (focus.kind === PROJECT_KIND) {
    const project = projectByRef(workspace, focus.projectRef);
    for (const rootRef of project.project.rootWorkRefs) {
      const item = itemByRef(project, rootRef);
      if (item) mergeNeighbor(merged, neighbor(workNode(project, item), RELATIONSHIP.PROJECT_ROOT));
    }
    mergeNeighbor(merged, neighbor(workspaceNode(), RELATIONSHIP.PARENT));
  } else {
    const project = projectByRef(workspace, focus.projectRef);
    const item = itemByRef(project, focus.workRef);
    assert(item, `missing work ${focus.workRef}`);

    if (item.parentWorkRefOrNull) {
      const parent = itemByRef(project, item.parentWorkRefOrNull);
      if (parent) mergeNeighbor(merged, neighbor(workNode(project, parent), RELATIONSHIP.PARENT));
    } else {
      mergeNeighbor(merged, neighbor(projectNode(project), RELATIONSHIP.PARENT));
    }

    for (const childRef of item.childWorkRefs || []) {
      const child = itemByRef(project, childRef);
      if (child) mergeNeighbor(merged, neighbor(workNode(project, child), RELATIONSHIP.CONTAINS));
    }

    for (const dependencyRef of item.dependencyRefs || []) {
      const targetProject = preferredProjectForWork(workspace, dependencyRef, focus.projectRef);
      const dependency = targetProject && itemByRef(targetProject, dependencyRef);
      if (!dependency) continue;
      mergeNeighbor(merged, neighbor(workNode(targetProject, dependency), RELATIONSHIP.DEPENDS_ON, {
        projectContexts: projectContextsForWork(workspace, dependencyRef),
      }));
    }

    for (const hit of incomingDependencies(workspace, focus.workRef)) {
      mergeNeighbor(merged, neighbor(workNode(hit.project, hit.item), RELATIONSHIP.DEPENDED_ON_BY, {
        projectContexts: projectContextsForWork(workspace, hit.item.workRef),
      }));
    }
  }

  const all = [...merged.values()]
    .map((candidate) => freeze({
      ...candidate,
      relationshipKinds: [...candidate.relationshipKinds].sort((a, b) => (RELATIONSHIP_ORDER[a] ?? 99) - (RELATIONSHIP_ORDER[b] ?? 99) || a.localeCompare(b)),
      relationshipDetails: candidate.relationshipDetails.map(clone),
    }))
    .sort((a, b) => relationshipRank(a) - relationshipRank(b) || activeRank(a.node) - activeRank(b.node) || a.node.nodeKey.localeCompare(b.node.nodeKey));

  return freeze({
    focus,
    neighbors: all.slice(0, limit),
    totalNeighborCount: all.length,
    hiddenNeighborCount: Math.max(0, all.length - limit),
    bounded: true,
  });
}

function adjacency(workspace, nodeKey) {
  return terrainNeighborhood(workspace, nodeKey, { limit: Number.MAX_SAFE_INTEGER }).neighbors.map((entry) => ({
    targetNodeKey: entry.node.nodeKey,
    relationshipKind: entry.relationshipKinds[0],
  }));
}

export function planTerrainRoute(workspace, fromNodeKey, toNodeKey, { maximumSteps = 128 } = {}) {
  validateWorkspace(workspace);
  nodeFromKey(workspace, fromNodeKey);
  nodeFromKey(workspace, toNodeKey);
  assert(Number.isInteger(maximumSteps) && maximumSteps >= 1, 'maximumSteps must be positive');
  if (fromNodeKey === toNodeKey) return freeze({ fromNodeKey, toNodeKey, steps: [], visitedNodeCount: 1 });

  const predecessor = new Map([[fromNodeKey, null]]);
  const queue = [fromNodeKey];
  let cursor = 0;
  while (cursor < queue.length && !predecessor.has(toNodeKey)) {
    const current = queue[cursor++];
    for (const edge of adjacency(workspace, current)) {
      if (predecessor.has(edge.targetNodeKey)) continue;
      predecessor.set(edge.targetNodeKey, { priorNodeKey: current, relationshipKind: edge.relationshipKind });
      queue.push(edge.targetNodeKey);
      if (queue.length > maximumSteps * 16) throw new Error('Terrain route search bound exceeded');
    }
  }
  if (!predecessor.has(toNodeKey)) throw new Error(`No Terrain route from ${fromNodeKey} to ${toNodeKey}`);

  const steps = [];
  let cursorKey = toNodeKey;
  while (cursorKey !== fromNodeKey) {
    const edge = predecessor.get(cursorKey);
    steps.unshift(freeze({
      fromNodeKey: edge.priorNodeKey,
      relationshipKind: edge.relationshipKind,
      toNodeKey: cursorKey,
    }));
    cursorKey = edge.priorNodeKey;
    if (steps.length > maximumSteps) throw new Error('Terrain route step limit exceeded');
  }
  return freeze({ fromNodeKey, toNodeKey, steps, visitedNodeCount: predecessor.size });
}

function semanticFrameKey(frame) {
  return JSON.stringify([frame.focus.nodeKey, frame.projectRefOrNull, frame.workRefOrNull]);
}

function frameFor(workspace, nodeKey, traversalPath, enteredViaOrNull = null) {
  const neighborhood = terrainNeighborhood(workspace, nodeKey);
  const structural = structuralPath(workspace, nodeKey);
  return freeze({
    schemaVersion: TERRAIN_FRAME_SCHEMA,
    focus: neighborhood.focus,
    projectRefOrNull: neighborhood.focus.projectRef,
    workRefOrNull: neighborhood.focus.workRef,
    structuralPath: structural,
    traversalPath: traversalPath.map(clone),
    enteredViaOrNull: enteredViaOrNull ? clone(enteredViaOrNull) : null,
    neighborhood,
    effects: false,
    executionAuthority: 'NONE',
  });
}

function initialTraversalPath(workspace, nodeKey) {
  const path = structuralPath(workspace, nodeKey);
  return path.map((node, index) => freeze({
    nodeKey: node.nodeKey,
    semanticRef: node.semanticRef,
    relationshipKind: index === 0 ? null : (node.kind === PROJECT_KIND ? RELATIONSHIP.PROJECT : node.kind === WORK_KIND && index === 2 ? RELATIONSHIP.PROJECT_ROOT : RELATIONSHIP.CONTAINS),
  }));
}

function sameCommandInput(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

export function createTerrainSession({ workspace, initialNodeKey = 'workspace:vexwork' }) {
  validateWorkspace(workspace);
  nodeFromKey(workspace, initialNodeKey);
  let current = frameFor(workspace, initialNodeKey, initialTraversalPath(workspace, initialNodeKey));
  const journey = [];
  const commandLedger = new Map();
  const backStack = [];
  let queueTail = Promise.resolve();
  let sequence = 0;

  function appendJourney(before, after, actionRef, relationshipKind, commandRef) {
    const eventCore = {
      schemaVersion: TERRAIN_JOURNEY_EVENT_SCHEMA,
      sequence: journey.length + 1,
      actionRef,
      relationshipKind,
      commandRef,
      before: clone(before),
      after: clone(after),
    };
    const last = journey.at(-1);
    if (last && last.actionRef === eventCore.actionRef && last.relationshipKind === eventCore.relationshipKind && semanticFrameKey(last.before) === semanticFrameKey(eventCore.before) && semanticFrameKey(last.after) === semanticFrameKey(eventCore.after)) {
      return last;
    }
    const event = freeze(eventCore);
    journey.push(event);
    return event;
  }

  function traversalPathFor(targetNodeKey, relationshipKind) {
    if (relationshipKind === RELATIONSHIP.RETURN) {
      const next = current.traversalPath.slice(0, -1);
      if (next.length && next.at(-1).nodeKey === targetNodeKey) return next;
    }
    return [...current.traversalPath, freeze({
      nodeKey: targetNodeKey,
      semanticRef: nodeFromKey(workspace, targetNodeKey).semanticRef,
      relationshipKind,
    })];
  }

  async function execute({ targetNodeKey, relationshipKind, commandRef, actionRef = 'action.terrain.navigate' }) {
    nodeFromKey(workspace, targetNodeKey);
    assert(typeof commandRef === 'string' && commandRef, 'commandRef required');
    assert(Object.values(RELATIONSHIP).includes(relationshipKind), `unsupported relationship ${relationshipKind}`);
    const input = { targetNodeKey, relationshipKind, actionRef };
    const prior = commandLedger.get(commandRef);
    if (prior) {
      if (!sameCommandInput(prior.input, input)) return freeze({ state: 'DIVERGENT_COMMAND_IDENTITY', commandRef, frame: clone(current) });
      return freeze({ state: 'DUPLICATE_EXACT_NOOP', commandRef, frame: clone(current), event: prior.event ? clone(prior.event) : null });
    }
    if (targetNodeKey === current.focus.nodeKey) {
      const result = freeze({ state: 'ALREADY_PRESENT', commandRef, frame: clone(current), event: null });
      commandLedger.set(commandRef, { input, result, event: null });
      return result;
    }

    const before = current;
    backStack.push(before);
    if (backStack.length > 64) backStack.shift();
    const enteredVia = freeze({ fromNodeKey: before.focus.nodeKey, relationshipKind, actionRef });
    current = frameFor(workspace, targetNodeKey, traversalPathFor(targetNodeKey, relationshipKind), enteredVia);
    const event = appendJourney(before, current, actionRef, relationshipKind, commandRef);
    const result = freeze({ state: 'COMMITTED', commandRef, frame: clone(current), event: clone(event) });
    commandLedger.set(commandRef, { input, result, event });
    return result;
  }

  function enqueue(request) {
    const operation = () => execute(request);
    const next = queueTail.then(operation, operation);
    queueTail = next.catch(() => undefined);
    return next;
  }

  return freeze({
    currentFrame: () => clone(current),
    journey: () => journey.map(clone),
    recentJourney: (limit = 12) => journey.slice(-limit).map(clone),
    inspectHistory(index) {
      assert(Number.isInteger(index) && index >= 0 && index < journey.length, 'history index out of range');
      return freeze({
        browsingHistory: semanticFrameKey(journey[index].after) !== semanticFrameKey(current),
        currentFrame: clone(current),
        inspectedFrame: clone(journey[index].after),
        event: clone(journey[index]),
      });
    },
    navigate(targetNodeKey, relationshipKind, { commandRef = null, actionRef = 'action.terrain.navigate' } = {}) {
      sequence += 1;
      return enqueue({
        targetNodeKey,
        relationshipKind,
        actionRef,
        commandRef: commandRef || `command.terrain.${sequence}`,
      });
    },
    async back({ commandRef = null } = {}) {
      if (!backStack.length) return freeze({ state: 'BACK_STACK_EMPTY', frame: clone(current), event: null });
      const target = backStack.pop();
      sequence += 1;
      const before = current;
      const path = current.traversalPath.slice(0, -1);
      current = frameFor(workspace, target.focus.nodeKey, path.length ? path : initialTraversalPath(workspace, target.focus.nodeKey), {
        fromNodeKey: before.focus.nodeKey,
        relationshipKind: RELATIONSHIP.RETURN,
        actionRef: 'action.terrain.return',
      });
      const effectiveCommandRef = commandRef || `command.terrain.${sequence}`;
      const event = appendJourney(before, current, 'action.terrain.return', RELATIONSHIP.RETURN, effectiveCommandRef);
      return freeze({ state: 'COMMITTED', commandRef: effectiveCommandRef, frame: clone(current), event: clone(event) });
    },
    async revisit(index, { commandRef = null } = {}) {
      assert(Number.isInteger(index) && index >= 0 && index < journey.length, 'history index out of range');
      const target = journey[index].after.focus.nodeKey;
      if (target === current.focus.nodeKey) return freeze({ state: 'ALREADY_PRESENT', frame: clone(current), event: null });
      return this.navigate(target, RELATIONSHIP.REVISIT, { commandRef, actionRef: 'action.terrain.revisit' });
    },
  });
}

export function clusterJourney(events, { limit = 8 } = {}) {
  assert(Array.isArray(events), 'events required');
  const clusters = [];
  for (const [index, event] of events.entries()) {
    const key = semanticFrameKey(event.after);
    const last = clusters.at(-1);
    if (last?.key === key) {
      last.endIndex = index;
      last.count += 1;
      if (!last.relationshipKinds.includes(event.relationshipKind)) last.relationshipKinds.push(event.relationshipKind);
    } else {
      clusters.push({
        key,
        startIndex: index,
        endIndex: index,
        count: 1,
        frame: clone(event.after),
        relationshipKinds: [event.relationshipKind],
      });
    }
  }
  return freeze(clusters.slice(-limit));
}

// [VXG RealForever][VEXWORK][TERRAIN][RELATIONAL-TRAVERSAL]