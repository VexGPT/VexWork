import { withSemanticFingerprint } from './semantic.mjs';

const REF = /^repo\.[A-Za-z0-9._/-]+$/u;

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

export function validateRepositoryRegistry(registry) {
  const errors = [];
  if (registry?.schemaVersion !== 'vexwork.repository-registry/v1') errors.push('repository registry schema mismatch');
  if (!Array.isArray(registry?.repositories)) errors.push('repositories must be an array');
  const refs = new Set();
  const names = new Set();
  for (const repository of registry?.repositories ?? []) {
    if (!REF.test(repository?.repositoryRef ?? '')) errors.push(`invalid repositoryRef ${repository?.repositoryRef ?? ''}`);
    if (refs.has(repository.repositoryRef)) errors.push(`duplicate repositoryRef ${repository.repositoryRef}`);
    refs.add(repository.repositoryRef);
    if (repository.provider === 'GITHUB') {
      if (typeof repository.nameWithOwner !== 'string' || !repository.nameWithOwner.includes('/')) errors.push(`invalid nameWithOwner for ${repository.repositoryRef}`);
      if (names.has(repository.nameWithOwner)) errors.push(`duplicate nameWithOwner ${repository.nameWithOwner}`);
      names.add(repository.nameWithOwner);
    }
    if (!Array.isArray(repository.entryRefs) || repository.entryRefs.length === 0) errors.push(`entryRefs missing for ${repository.repositoryRef}`);
    if (!Array.isArray(repository.cultureRefs)) errors.push(`cultureRefs invalid for ${repository.repositoryRef}`);
  }
  return Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) });
}

export function projectRepositoryGraph(registry) {
  const validation = validateRepositoryRegistry(registry);
  assert(validation.ok, validation.errors[0]);
  return withSemanticFingerprint({
    schemaVersion: 'vexwork.repository-graph/v1',
    repositories: registry.repositories.map((repository) => ({
      repositoryRef: repository.repositoryRef,
      label: repository.label,
      provider: repository.provider,
      nameWithOwner: repository.nameWithOwner,
      visibility: repository.visibility,
      purpose: repository.purpose,
      entryRefs: [...repository.entryRefs],
      cultureRefs: [...repository.cultureRefs],
    })),
    effects: false,
    executionAuthority: 'NONE',
  });
}

export function assertKnownRepositoryRefs(refs, registry) {
  const known = new Set(registry.repositories.map((repository) => repository.repositoryRef));
  for (const ref of refs) assert(known.has(ref), `unknown repositoryRef ${ref}`);
  return true;
}
