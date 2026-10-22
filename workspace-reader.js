export const PROJECTS_VIEWS = Object.freeze(['projects', 'open']);
export const PROJECT_VIEWS = Object.freeze(['story', 'open', 'board', 'dependencies']);
export const ITEM_VIEWS = Object.freeze(['overview', 'children', 'dependencies', 'history']);

const DONE_STATES = new Set(['COMPLETED', 'CONVERGED', 'CLOSED']);
const BLOCKED_STATES = new Set(['BLOCKED', 'FAILED_RECOVERABLE']);
const OPEN_STATES = new Set(['READY', 'CONTEXT_ADMITTED', 'RUNNING', 'WAITING_TOOL', 'VERIFYING']);
const WAITING_STATES = new Set(['WAITING_DEPENDENCIES', 'WAITING_RESOURCE', 'PAUSED_AT_CHECKPOINT', 'WAITING_HUMAN', 'HELD_UNKNOWN']);
const PENDING_STATES = new Set(['CAPTURED', 'NEEDS_CLARIFICATION', 'DECOMPOSED', 'PLAN_VALIDATED']);
const ARCHIVE_STATES = new Set(['SUPERSEDED', 'CANCELLED']);

export function validateWorkspace(data) {
  if (!data || data.schemaVersion !== 'vexwork.public-workspace/v1') throw new Error('unsupported VexWork workspace schema');
  if (!Array.isArray(data.projects) || !data.parkingLot || !Array.isArray(data.parkingLot.items)) throw new Error('incomplete VexWork workspace');
  if (data.effects !== false || data.executionAuthority !== 'NONE') throw new Error('public VexWork workspace crossed its no-effects boundary');
  return data;
}

export function parseRoute(search) {
  const params = new URLSearchParams(search || '');
  const projectRef = params.get('project') || null;
  const workRef = params.get('work') || null;
  const rawView = params.get('view') || null;
  const level = workRef ? 'ITEM' : (projectRef ? 'PROJECT' : 'PROJECTS');
  const allowed = level === 'ITEM' ? ITEM_VIEWS : (level === 'PROJECT' ? PROJECT_VIEWS : PROJECTS_VIEWS);
  const fallback = level === 'ITEM' ? 'overview' : (level === 'PROJECT' ? 'story' : 'projects');
  const view = allowed.includes(rawView) ? rawView : fallback;
  return Object.freeze({ projectRef, workRef, view, level });
}

export function routeSearch(route) {
  const params = new URLSearchParams();
  if (route.projectRef) params.set('project', route.projectRef);
  if (route.workRef) params.set('work', route.workRef);
  const fallback = route.workRef ? 'overview' : (route.projectRef ? 'story' : 'projects');
  if (route.view && route.view !== fallback) params.set('view', route.view);
  const query = params.toString();
  return query ? '?' + query : '';
}

export function projectByRef(workspace, projectRef) {
  return workspace.projects.find((entry) => entry.project.projectRef === projectRef) || null;
}

function itemMap(project) {
  return new Map((project?.items || []).map((item) => [item.workRef, item]));
}

export function itemByRef(project, workRef) {
  return (project?.items || []).find((item) => item.workRef === workRef) || null;
}

export function parkingItemByRef(workspace, workRef) {
  return workspace.parkingLot.items.find((item) => item.workRef === workRef) || null;
}

export function locateItem(workspace, projectRef, workRef) {
  if (!workRef) return null;
  if (projectRef) {
    const project = projectByRef(workspace, projectRef);
    const item = itemByRef(project, workRef);
    if (item) return Object.freeze({ project, item, parked: false });
  }
  for (const project of workspace.projects) {
    const item = itemByRef(project, workRef);
    if (item) return Object.freeze({ project, item, parked: false });
  }
  const parked = parkingItemByRef(workspace, workRef);
  return parked ? Object.freeze({ project: null, item: parked, parked: true }) : null;
}

export function ancestorRefs(project, workRef) {
  const byRef = itemMap(project);
  let current = byRef.get(workRef);
  const refs = [];
  const seen = new Set();
  while (current && current.parentWorkRefOrNull) {
    if (seen.has(current.parentWorkRefOrNull)) break;
    seen.add(current.parentWorkRefOrNull);
    refs.unshift(current.parentWorkRefOrNull);
    current = byRef.get(current.parentWorkRefOrNull);
  }
  return refs;
}

export function incomingDependencyRefs(project, workRef) {
  return (project?.items || [])
    .filter((item) => (item.dependencyRefs || []).includes(workRef))
    .map((item) => item.workRef)
    .sort();
}

export function childItems(project, workRef) {
  const byRef = itemMap(project);
  const item = byRef.get(workRef);
  return item ? (item.childWorkRefs || []).map((ref) => byRef.get(ref)).filter(Boolean) : [];
}

export function projectRootItems(project) {
  const byRef = itemMap(project);
  return (project?.project?.rootWorkRefs || []).map((ref) => byRef.get(ref)).filter(Boolean);
}

export function openWorkItems(project) {
  const closed = new Set(
    (project?.lanes || [])
      .filter((lane) => ['lane.work.done', 'lane.work.archive'].includes(lane.laneRef))
      .flatMap((lane) => lane.workRefs || [])
  );
  return (project?.items || []).filter((item) => !closed.has(item.workRef));
}

function topScopeRef(project, workRef) {
  const byRef = itemMap(project);
  const roots = new Set(project?.project?.rootWorkRefs || []);
  let current = byRef.get(workRef);
  if (!current) return workRef;
  if (roots.has(current.workRef)) return current.workRef;
  while (current?.parentWorkRefOrNull && !roots.has(current.parentWorkRefOrNull)) {
    const parent = byRef.get(current.parentWorkRefOrNull);
    if (!parent) break;
    current = parent;
  }
  return current?.workRef || workRef;
}

export function openWorkGroups(project) {
  const byRef = itemMap(project);
  const groups = new Map();
  for (const item of openWorkItems(project)) {
    const scopeRef = topScopeRef(project, item.workRef);
    if (!groups.has(scopeRef)) {
      groups.set(scopeRef, {
        scopeRef,
        scopeLabel: byRef.get(scopeRef)?.label || scopeRef,
        items: [],
      });
    }
    groups.get(scopeRef).items.push(item);
  }
  return Object.freeze([...groups.values()].map((group) => Object.freeze({
    ...group,
    items: Object.freeze([...group.items]),
  })));
}

export function stateTone(state) {
  if (DONE_STATES.has(state)) return 'done';
  if (BLOCKED_STATES.has(state)) return 'blocked';
  if (OPEN_STATES.has(state)) return 'open';
  if (WAITING_STATES.has(state)) return 'waiting';
  if (PENDING_STATES.has(state)) return 'pending';
  if (ARCHIVE_STATES.has(state)) return 'archive';
  return 'pending';
}

export function priorityTone(priorityClass) {
  if (priorityClass === 'IMMEDIATE') return 'immediate';
  if (priorityClass === 'HIGH') return 'high';
  if (priorityClass === 'LOW') return 'low';
  return 'normal';
}

export function searchWorkspace(workspace, query) {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return Object.freeze({ projects: [], items: [], parking: [] });
  const hit = (values) => values.some((value) => String(value || '').toLowerCase().includes(q));
  const projects = workspace.projects.filter((entry) => hit([entry.project.label, entry.project.purpose, entry.project.projectRef]));
  const items = [];
  for (const project of workspace.projects) {
    for (const item of project.items) {
      if (hit([item.label, item.purpose, item.workRef, item.state, item.workClass].concat(item.repositoryRefs || []))) {
        items.push({ projectRef: project.project.projectRef, projectLabel: project.project.label, item });
      }
    }
  }
  const parking = workspace.parkingLot.items.filter((item) =>
    hit([item.label, item.purpose, item.workRef, item.state, item.workClass].concat(item.repositoryRefs || []))
  );
  return Object.freeze({ projects, items, parking });
}

// [VXG RealForever]
