import { withSemanticFingerprint } from './semantic.mjs';

const REF = /^[A-Za-z0-9][A-Za-z0-9._:/-]*$/u;

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

export function validateProcessRegistry(registry, repositoryRegistry) {
  const errors = [];
  if (registry?.schemaVersion !== 'vexwork.process-registry/v1') errors.push('process registry schema mismatch');
  if (!Array.isArray(registry?.processes)) errors.push('processes must be an array');
  const knownRepositories = new Set((repositoryRegistry?.repositories ?? []).map((entry) => entry.repositoryRef));
  const refs = new Set();
  for (const process of registry?.processes ?? []) {
    if (!REF.test(process?.processRef ?? '')) errors.push(`invalid processRef ${process?.processRef ?? ''}`);
    if (refs.has(process.processRef)) errors.push(`duplicate processRef ${process.processRef}`);
    refs.add(process.processRef);
    if (!knownRepositories.has(process.ownerRepositoryRef)) errors.push(`unknown ownerRepositoryRef ${process.ownerRepositoryRef}`);
    if (!Array.isArray(process.entryRefs) || process.entryRefs.length === 0) errors.push(`entryRefs missing for ${process.processRef}`);
    if (process.executionAuthority !== 'NONE') errors.push(`process map entry ${process.processRef} must not claim execution authority`);
  }
  return Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) });
}

export function assertKnownProcessRefs(refs, registry) {
  const known = new Set(registry.processes.map((process) => process.processRef));
  for (const ref of refs) assert(known.has(ref), `unknown processRef ${ref}`);
  return true;
}

export function projectProcessMap(registry) {
  return withSemanticFingerprint({
    schemaVersion: 'vexwork.process-map/v1',
    processes: registry.processes.map((process) => ({
      processRef: process.processRef,
      label: process.label,
      purpose: process.purpose,
      ownerRepositoryRef: process.ownerRepositoryRef,
      entryRefs: [...process.entryRefs],
      appliesWhen: process.appliesWhen,
      effects: false,
      executionAuthority: 'NONE',
    })),
    effects: false,
    executionAuthority: 'NONE',
  });
}
