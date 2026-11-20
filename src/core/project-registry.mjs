import { verifySemanticFingerprint, withSemanticFingerprint } from './semantic.mjs';
import { resolveWorkBoardView } from './work-board.mjs';
import { createProject, projectWorkRefs } from './workgraph.mjs';

export const PROJECT_REGISTRY_SCHEMA = 'vexwork.project-registry/v1';
export const PROJECT_REGISTRY_PROJECTION_SCHEMA = 'vexwork.project-registry-projection/v1';

const REF = /^[A-Za-z0-9][A-Za-z0-9._:/-]*$/u;

function safeRelativePath(value) {
  return typeof value === 'string'
    && value.length > 0
    && !value.startsWith('/')
    && !value.split('/').includes('..')
    && !value.includes('\\');
}

export function validateProjectRegistry(registry) {
  const errors = [];
  if (registry?.schemaVersion !== PROJECT_REGISTRY_SCHEMA) errors.push('project registry schema mismatch');
  if (typeof registry?.registryRef !== 'string' || !REF.test(registry.registryRef)) errors.push('project registryRef invalid');
  if (!Number.isSafeInteger(registry?.registryVersion) || registry.registryVersion < 1) errors.push('project registryVersion invalid');
  if (typeof registry?.purpose !== 'string' || !registry.purpose.trim()) errors.push('project registry purpose required');
  if (!Array.isArray(registry?.projects) || registry.projects.length === 0) errors.push('project registry projects required');

  const projectRefs = new Set();
  const definitionPaths = new Set();
  const boardPaths = new Set();
  for (const entry of registry?.projects ?? []) {
    if (typeof entry?.projectRef !== 'string' || !REF.test(entry.projectRef)) errors.push('projectRef invalid');
    else if (projectRefs.has(entry.projectRef)) errors.push(`duplicate projectRef ${entry.projectRef}`);
    else projectRefs.add(entry.projectRef);

    if (typeof entry?.workgraphRef !== 'string' || !REF.test(entry.workgraphRef)) errors.push(`workgraphRef invalid for ${entry?.projectRef ?? 'unknown'}`);
    if (!safeRelativePath(entry?.workgraphPath)) errors.push(`workgraphPath invalid for ${entry?.projectRef ?? 'unknown'}`);

    if (!safeRelativePath(entry?.definitionPath)) {
      errors.push(`definitionPath invalid for ${entry?.projectRef ?? 'unknown'}`);
    } else if (definitionPaths.has(entry.definitionPath)) {
      errors.push(`duplicate definitionPath ${entry.definitionPath}`);
    } else {
      definitionPaths.add(entry.definitionPath);
    }

    if (entry?.boardViewPath !== null) {
      if (!safeRelativePath(entry?.boardViewPath)) {
        errors.push(`boardViewPath invalid for ${entry?.projectRef ?? 'unknown'}`);
      } else if (boardPaths.has(entry.boardViewPath)) {
        errors.push(`duplicate boardViewPath ${entry.boardViewPath}`);
      } else {
        boardPaths.add(entry.boardViewPath);
      }
    }

    if (entry?.agencyPolicyPathOrNull !== null && !safeRelativePath(entry?.agencyPolicyPathOrNull)) {
      errors.push(`agencyPolicyPathOrNull invalid for ${entry?.projectRef ?? 'unknown'}`);
    }
  }
  return Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) });
}


function requireSourcePath(value, label, { nullable = false } = {}) {
  if (nullable && value === null) return null;
  if (!safeRelativePath(value)) throw new TypeError(`${label} must be one safe relative path`);
  return value;
}

export function deriveProjectSourceBundle({
  projectSource,
  explicitBoardViewSourceOrNull = null,
  definitionPath,
  boardViewPathOrNull = null,
  agencyPolicyPathOrNull = null,
  graph,
  workgraphPath,
  workRegistry,
}) {
  if (!verifySemanticFingerprint(graph)) throw new TypeError('Workgraph semanticFingerprint mismatch');
  requireSourcePath(definitionPath, 'definitionPath');
  requireSourcePath(workgraphPath, 'workgraphPath');
  requireSourcePath(boardViewPathOrNull, 'boardViewPathOrNull', { nullable: true });
  requireSourcePath(agencyPolicyPathOrNull, 'agencyPolicyPathOrNull', { nullable: true });

  const explicitBoardProvided = explicitBoardViewSourceOrNull !== null;
  if (explicitBoardProvided !== (boardViewPathOrNull !== null)) {
    throw new TypeError('explicit Board source and boardViewPathOrNull must be present or absent together');
  }

  const project = createProject(projectSource);
  const board = resolveWorkBoardView({
    project,
    explicitViewOrNull: explicitBoardViewSourceOrNull,
    registry: workRegistry,
  });
  const selectedWorkRefs = projectWorkRefs(project, graph);

  return Object.freeze({
    project,
    board,
    selectedWorkRefs,
    registryEntry: Object.freeze({
      projectRef: project.projectRef,
      workgraphRef: graph.graphRef,
      workgraphPath,
      definitionPath,
      boardViewPath: boardViewPathOrNull,
      agencyPolicyPathOrNull,
    }),
  });
}

export function deriveProjectRegistry({
  registryRef,
  registryVersion,
  purpose,
  sourceBundles,
  compatibilityOrderProjectRefs = [],
}) {
  if (!Array.isArray(sourceBundles) || sourceBundles.length === 0) {
    throw new TypeError('sourceBundles must be a non-empty array');
  }
  if (!Array.isArray(compatibilityOrderProjectRefs)
      || compatibilityOrderProjectRefs.some((value) => typeof value !== 'string')
      || new Set(compatibilityOrderProjectRefs).size !== compatibilityOrderProjectRefs.length) {
    throw new TypeError('compatibilityOrderProjectRefs must contain unique strings');
  }

  const byProjectRef = new Map();
  for (const bundle of sourceBundles) {
    const projectRef = bundle?.project?.projectRef;
    if (typeof projectRef !== 'string') throw new TypeError('source bundle project identity is required');
    if (byProjectRef.has(projectRef)) throw new TypeError(`duplicate source Project ${projectRef}`);
    byProjectRef.set(projectRef, bundle);
  }
  for (const projectRef of compatibilityOrderProjectRefs) {
    if (!byProjectRef.has(projectRef)) {
      throw new TypeError(`compatibility order references unknown projectRef ${projectRef}`);
    }
  }

  const rank = new Map(compatibilityOrderProjectRefs.map((projectRef, index) => [projectRef, index]));
  const ordered = [...sourceBundles].sort((left, right) => {
    const leftRank = rank.get(left.project.projectRef);
    const rightRank = rank.get(right.project.projectRef);
    const leftKnown = leftRank !== undefined;
    const rightKnown = rightRank !== undefined;
    if (leftKnown && rightKnown) return leftRank - rightRank;
    if (leftKnown) return -1;
    if (rightKnown) return 1;
    return left.project.formedAt.localeCompare(right.project.formedAt)
      || left.project.projectRef.localeCompare(right.project.projectRef);
  });

  const source = {
    schemaVersion: PROJECT_REGISTRY_SCHEMA,
    registryRef,
    registryVersion,
    purpose,
    projects: ordered.map((bundle) => ({ ...bundle.registryEntry })),
  };
  const validation = validateProjectRegistry(source);
  if (!validation.ok) throw new TypeError(validation.errors.join('\n'));
  return Object.freeze({
    ...source,
    projects: Object.freeze(source.projects.map((entry) => Object.freeze(entry))),
  });
}

export function assertKnownProjectRefs(projectRefs, registry) {
  const validation = validateProjectRegistry(registry);
  if (!validation.ok) throw new TypeError(validation.errors.join('\n'));
  const known = new Set(registry.projects.map((entry) => entry.projectRef));
  for (const projectRef of projectRefs) {
    if (!known.has(projectRef)) throw new TypeError(`unknown projectRef ${projectRef}`);
  }
  return true;
}

export function projectProjectRegistry(registry) {
  const validation = validateProjectRegistry(registry);
  if (!validation.ok) throw new TypeError(validation.errors.join('\n'));
  return withSemanticFingerprint({
    schemaVersion: PROJECT_REGISTRY_PROJECTION_SCHEMA,
    registryRef: registry.registryRef,
    registryVersion: registry.registryVersion,
    projects: registry.projects.map((entry) => ({ ...entry })),
    effects: false,
    executionAuthority: 'NONE',
  });
}
