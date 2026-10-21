import crypto from 'node:crypto';

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  }
  return value;
}

export function semanticHash(value) {
  return crypto.createHash('sha256').update(JSON.stringify(canonicalize(value))).digest('hex');
}

export function withSemanticFingerprint(value) {
  const core = structuredClone(value);
  delete core.semanticFingerprint;
  return Object.freeze({ ...core, semanticFingerprint: semanticHash(core) });
}

export function verifySemanticFingerprint(value) {
  if (!value || typeof value !== 'object' || typeof value.semanticFingerprint !== 'string') return false;
  const core = structuredClone(value);
  delete core.semanticFingerprint;
  return semanticHash(core) === value.semanticFingerprint;
}
