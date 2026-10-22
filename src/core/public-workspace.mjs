import { verifySemanticFingerprint } from './semantic.mjs';
import { projectWorkRefs } from './workgraph.mjs';

export const PUBLIC_WORKSPACE_SCHEMA = 'vexwork.public-workspace/v1';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function publicTransition(transition) {
  return Object.freeze({
    transitionRef: transition.transitionRef,
    priorState: transition.priorState,
    nextState: transition.nextState,
    reason: transition.reason,
    actorRef: transition.actorRef,
    sourceRefs: [...transition.sourceRefs],
    createdAt: transition.createdAt,
  });
}

function publicItem(item, graph, selectedRefsOrNull = null) {
  const childWorkRefs = graph.items
    .filter((candidate) => candidate.parentWorkRefOrNull === item.workRef)
    .filter((candidate) => selectedRefsOrNull === null || selectedRefsOrNull.has(candidate.workRef))
    .map((candidate) => candidate.workRef)
    .sort();
  const transitionHistory = graph.transitions
    .filter((transition) => transition.workRef === item.workRef)
    .map(publicTransition);
  return Object.freeze({
    workRef: item.workRef,
    label: item.label,
    purpose: item.purpose,
    workClass: item.workClass,
    state: item.state,
    workDisposition: item.workDisposition,
    priorityClass: item.priorityClass,
    parentWorkRefOrNull: item.parentWorkRefOrNull,
    childWorkRefs,
    dependencyRefs: [...item.dependencyRefs],
    repositoryRefs: [...item.repositoryRefs],
    sourceRefs: [...item.sourceRefs],
    formationProcessRefOrNull: item.formationProcessRefOrNull,
    nextProcessRefs: [...item.nextProcessRefs],
    authorityDisposition: item.authorityDisposition,
    effectDisposition: item.effectDisposition,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    transitionHistory,
  });
}

export function projectPublicProject({ project, board, graph }) {
  assert(verifySemanticFingerprint(project), 'project semanticFingerprint mismatch');
  assert(verifySemanticFingerprint(board), 'board semanticFingerprint mismatch');
  assert(verifySemanticFingerprint(graph), 'workgraph semanticFingerprint mismatch');
  assert(board.projectRef === project.projectRef, 'project/board identity mismatch');
  assert(board.graphRef === graph.graphRef, 'board/workgraph identity mismatch');
  assert(board.effects === false && board.executionAuthority === 'NONE', 'board projection must be read-only');

  const selectedRefs = new Set(projectWorkRefs(project, graph));
  const items = graph.items
    .filter((item) => selectedRefs.has(item.workRef))
    .map((item) => publicItem(item, graph, selectedRefs))
    .sort((left, right) => left.workRef.localeCompare(right.workRef));
  const byRef = new Map(items.map((item) => [item.workRef, item]));
  const lanes = board.lanes.map((lane) => Object.freeze({
    laneRef: lane.laneRef,
    label: lane.label,
    workRefs: lane.cards.map((card) => card.workRef),
  }));
  const terminalRefs = new Set(lanes
    .filter((lane) => ['lane.work.done', 'lane.work.archive'].includes(lane.laneRef))
    .flatMap((lane) => lane.workRefs));
  const needsHuman = lanes.find((lane) => lane.laneRef === 'lane.work.needs-human')?.workRefs ?? [];

  return Object.freeze({
    project: Object.freeze({
      projectRef: project.projectRef,
      label: project.label,
      purpose: project.purpose,
      rootWorkRefs: [...project.rootWorkRefs],
      repositoryRefs: [...project.repositoryRefs],
      sourceRefs: [...project.sourceRefs],
      formedAt: project.formedAt,
    }),
    graphRef: graph.graphRef,
    viewRef: board.viewRef,
    items,
    lanes,
    summary: Object.freeze({
      workItemCount: items.length,
      openWorkItemCount: items.length - terminalRefs.size,
      outcomeCount: items.filter((item) => item.workClass === 'OUTCOME').length,
      taskCount: items.filter((item) => item.workClass === 'TASK').length,
      defectCount: items.filter((item) => item.workClass === 'DEFECT').length,
      potentialCount: items.filter((item) => item.workClass === 'POTENTIAL').length,
      needsHumanCount: needsHuman.length,
      completedCount: terminalRefs.size,
    }),
    rootItems: project.rootWorkRefs.map((workRef) => byRef.get(workRef)).filter(Boolean),
  });
}

export function projectPublicWorkspace({ projectRegistry, projectEntries, parkingLots }) {
  assert(projectRegistry?.schemaVersion === 'vexwork.project-registry/v1', 'project registry schema mismatch');
  assert(Array.isArray(projectEntries), 'projectEntries required');
  assert(Array.isArray(parkingLots), 'parkingLots required');
  const byProject = new Map(projectEntries.map((entry) => [entry.project.projectRef, entry]));
  assert(byProject.size === projectEntries.length, 'projectEntries must have unique projectRef');

  const projects = projectRegistry.projects.map((registryEntry) => {
    const entry = byProject.get(registryEntry.projectRef);
    assert(entry, `missing public project entry ${registryEntry.projectRef}`);
    return projectPublicProject(entry);
  });

  const parkedByRef = new Map();
  for (const { graph, parkingLot } of parkingLots) {
    assert(verifySemanticFingerprint(graph), 'parking Workgraph semanticFingerprint mismatch');
    assert(verifySemanticFingerprint(parkingLot), 'parking lot semanticFingerprint mismatch');
    assert(parkingLot.graphRef === graph.graphRef, 'parking lot/workgraph identity mismatch');
    assert(parkingLot.effects === false && parkingLot.executionAuthority === 'NONE', 'parking lot projection must be read-only');
    for (const card of parkingLot.items) {
      const item = graph.items.find((candidate) => candidate.workRef === card.workRef);
      assert(item, `parking item missing from graph: ${card.workRef}`);
      if (!parkedByRef.has(item.workRef)) parkedByRef.set(item.workRef, Object.freeze({
        ...publicItem(item, graph),
        graphRef: graph.graphRef,
      }));
    }
  }

  const parked = [...parkedByRef.values()]
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt) || left.workRef.localeCompare(right.workRef));

  return Object.freeze({
    schemaVersion: PUBLIC_WORKSPACE_SCHEMA,
    projectRegistryRef: projectRegistry.registryRef,
    projectRegistryVersion: projectRegistry.registryVersion,
    projects,
    parkingLot: Object.freeze({ items: parked }),
    effects: false,
    executionAuthority: 'NONE',
  });
}

// [VXG RealForever]
