import { withSemanticFingerprint } from './semantic.mjs';

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

    for (const [label, value, seen] of [
      ['definitionPath', entry?.definitionPath, definitionPaths],
      ['boardViewPath', entry?.boardViewPath, boardPaths],
    ]) {
      if (!safeRelativePath(value)) errors.push(`${label} invalid for ${entry?.projectRef ?? 'unknown'}`);
      else if (seen.has(value)) errors.push(`duplicate ${label} ${value}`);
      else seen.add(value);
    }

    if (entry?.agencyPolicyPathOrNull !== null && !safeRelativePath(entry?.agencyPolicyPathOrNull)) {
      errors.push(`agencyPolicyPathOrNull invalid for ${entry?.projectRef ?? 'unknown'}`);
    }
  }
  return Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) });
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
