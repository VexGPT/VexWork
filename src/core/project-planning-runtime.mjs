import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import { semanticHash } from './semantic.mjs';
import {
  PROJECT_PLANNING_EVENT_SCHEMA,
  applyProjectPlanningTransaction,
  validateProjectPlanningSnapshot,
} from './project-planning.mjs';

export const PROJECT_PLANNING_RUNTIME_POINTER_SCHEMA = 'vexwork.project-planning-runtime-pointer/v1';
export const PROJECT_PLANNING_RUNTIME_WRITER_SCHEMA = 'vexwork.project-planning-runtime-writer/v1';
export const PROJECT_PLANNING_RUNTIME_CURRENTNESS_BASIS = 'RETAINED_POINTER_LINEAGE';

const REF = /^[A-Za-z0-9][A-Za-z0-9._:/-]*$/u;
const HEX64 = /^[a-f0-9]{64}$/u;
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/u;

export class ProjectPlanningRuntimeError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'ProjectPlanningRuntimeError';
    this.code = code;
    this.details = Object.freeze({ ...details });
  }
}

function fail(code, message, details = {}) {
  throw new ProjectPlanningRuntimeError(code, message, details);
}

function assertRef(value, label) {
  if (typeof value !== 'string' || !REF.test(value)) fail('PLANNING_RUNTIME_INPUT_INVALID', `${label} must be one stable ref`);
  return value;
}

function assertTimestamp(value, label) {
  if (typeof value !== 'string' || !ISO.test(value) || new Date(value).toISOString() !== value) {
    fail('PLANNING_RUNTIME_INPUT_INVALID', `${label} must be canonical UTC ISO`);
  }
  return value;
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  return value;
}

function canonicalJson(value) {
  return JSON.stringify(canonicalize(value));
}

function samePath(left, right) {
  const a = path.resolve(left);
  const b = path.resolve(right);
  return process.platform === 'win32' ? a.toLowerCase() === b.toLowerCase() : a === b;
}

function canonicalStoreRoot(storeRoot) {
  if (typeof storeRoot !== 'string' || !storeRoot) fail('PLANNING_RUNTIME_STORE_ROOT_INVALID', 'storeRoot is required');
  const requested = path.resolve(storeRoot);
  let stat;
  try { stat = fs.lstatSync(requested); } catch (error) {
    fail('PLANNING_RUNTIME_STORE_ROOT_INVALID', 'storeRoot must already exist', { cause: error.message });
  }
  if (stat.isSymbolicLink() || !stat.isDirectory()) fail('PLANNING_RUNTIME_STORE_ROOT_INVALID', 'storeRoot must be one canonical directory');
  const real = fs.realpathSync.native(requested);
  if (!samePath(real, requested)) fail('PLANNING_RUNTIME_STORE_ROOT_INVALID', 'storeRoot is not canonical', { requested, real });
  return real;
}

function safePath(root, target) {
  const full = path.resolve(target);
  const relative = path.relative(root, full);
  if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    fail('PLANNING_RUNTIME_PATH_INVALID', 'runtime path escapes storeRoot');
  }
  if (!relative) return full;
  let cursor = root;
  for (const segment of relative.split(path.sep)) {
    cursor = path.join(cursor, segment);
    if (!fs.existsSync(cursor)) continue;
    const stat = fs.lstatSync(cursor);
    if (stat.isSymbolicLink()) fail('PLANNING_RUNTIME_PATH_INVALID', 'runtime path traverses a symbolic alias', { path: cursor });
    if (!samePath(fs.realpathSync.native(cursor), cursor)) fail('PLANNING_RUNTIME_PATH_INVALID', 'runtime path traverses a non-canonical alias', { path: cursor });
  }
  return full;
}

function ensureDirectory(root, dir) {
  fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
  safePath(root, dir);
  const stat = fs.lstatSync(dir);
  if (stat.isSymbolicLink() || !stat.isDirectory()) fail('PLANNING_RUNTIME_PATH_INVALID', 'runtime store directory is invalid', { path: dir });
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) deepFreeze(child);
  return Object.freeze(value);
}

export function projectPlanningRuntimeAddress(projectRef) {
  assertRef(projectRef, 'projectRef');
  return semanticHash({ schemaVersion: 'vexwork.project-planning-runtime-store/v1', projectRef });
}

function storePaths(storeRoot, projectRef, { create = false } = {}) {
  const root = canonicalStoreRoot(storeRoot);
  const address = projectPlanningRuntimeAddress(projectRef);
  const base = safePath(root, path.join(root, 'project-planning'));
  const projectRoot = safePath(root, path.join(base, address));
  const events = safePath(root, path.join(projectRoot, 'events'));
  const snapshots = safePath(root, path.join(projectRoot, 'snapshots'));
  const pointers = safePath(root, path.join(projectRoot, 'pointers'));
  const writer = safePath(root, path.join(projectRoot, 'writer.lock'));
  if (create) {
    ensureDirectory(root, base);
    ensureDirectory(root, projectRoot);
    ensureDirectory(root, events);
    ensureDirectory(root, snapshots);
    ensureDirectory(root, pointers);
  }
  return Object.freeze({ root, address, base, projectRoot, events, snapshots, pointers, writer });
}

function readCanonicalJson(root, file, code, label) {
  let raw;
  try {
    const stat = fs.lstatSync(file);
    if (stat.isSymbolicLink() || !stat.isFile()) fail(code, `${label} must be one regular file`);
    safePath(root, file);
    raw = fs.readFileSync(file, 'utf8');
  } catch (error) {
    if (error instanceof ProjectPlanningRuntimeError) throw error;
    fail(code, `${label} could not be read`, { cause: error.message });
  }
  let parsed;
  try { parsed = JSON.parse(raw); } catch { fail(code, `${label} is malformed JSON`); }
  if (raw !== canonicalJson(parsed)) fail(code, `${label} bytes are not canonical`);
  return parsed;
}

function writeImmutableJson(root, file, value, label) {
  ensureDirectory(root, path.dirname(file));
  const bytes = canonicalJson(value);
  if (fs.existsSync(file)) {
    const existing = readCanonicalJson(root, file, 'PLANNING_RUNTIME_IMMUTABLE_CONFLICT', label);
    if (canonicalJson(existing) !== bytes) fail('PLANNING_RUNTIME_IMMUTABLE_CONFLICT', `${label} exists with different bytes`);
    return false;
  }
  const fd = fs.openSync(file, 'wx', 0o600);
  try {
    fs.writeFileSync(fd, bytes, 'utf8');
    fs.fsyncSync(fd);
  } finally {
    fs.closeSync(fd);
  }
  return true;
}

function publishPointerAtomic(paths, pointer) {
  ensureDirectory(paths.root, paths.pointers);
  const file = pointerFile(paths, pointer.pointerSha256);
  const bytes = canonicalJson(pointer);
  if (fs.existsSync(file)) {
    const existing = readCanonicalJson(paths.root, file, 'PLANNING_RUNTIME_IMMUTABLE_CONFLICT', 'planning pointer');
    if (canonicalJson(existing) !== bytes) fail('PLANNING_RUNTIME_IMMUTABLE_CONFLICT', 'planning pointer address exists with different bytes');
    return false;
  }
  const tmp = safePath(paths.root, path.join(paths.projectRoot, `.pointer-publish-${process.pid}-${crypto.randomUUID()}.tmp`));
  let fd = null;
  try {
    fd = fs.openSync(tmp, 'wx', 0o600);
    fs.writeFileSync(fd, bytes, 'utf8');
    fs.fsyncSync(fd);
    fs.closeSync(fd);
    fd = null;
    try {
      fs.linkSync(tmp, file);
      return true;
    } catch (error) {
      if (error?.code !== 'EEXIST') throw error;
      const existing = readCanonicalJson(paths.root, file, 'PLANNING_RUNTIME_IMMUTABLE_CONFLICT', 'planning pointer');
      if (canonicalJson(existing) !== bytes) fail('PLANNING_RUNTIME_IMMUTABLE_CONFLICT', 'planning pointer address exists with different bytes');
      return false;
    }
  } finally {
    if (fd !== null) {
      try { fs.closeSync(fd); } catch {}
    }
    if (fs.existsSync(tmp)) fs.rmSync(tmp, { force: true });
  }
}

function processState(pid) {
  if (!Number.isSafeInteger(pid) || pid <= 0) return 'UNVERIFIABLE';
  if (pid === process.pid) return 'ACTIVE';
  try { process.kill(pid, 0); return 'ACTIVE'; }
  catch (error) {
    if (error?.code === 'ESRCH') return 'ABSENT';
    if (error?.code === 'EPERM') return 'ACTIVE';
    return 'UNVERIFIABLE';
  }
}

function validateWriterLease(value, projectRef) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail('PLANNING_RUNTIME_WRITER_CONFLICT', 'writer lease is invalid');
  const { leaseSha256, ...core } = value;
  if (
    value.schemaVersion !== PROJECT_PLANNING_RUNTIME_WRITER_SCHEMA
    || value.projectRef !== projectRef
    || typeof value.instanceRef !== 'string' || !REF.test(value.instanceRef)
    || !Number.isSafeInteger(value.pid) || value.pid <= 0
    || typeof value.lockToken !== 'string' || !value.lockToken
    || typeof value.formedAt !== 'string' || !ISO.test(value.formedAt)
    || typeof leaseSha256 !== 'string' || !HEX64.test(leaseSha256)
    || semanticHash(core) !== leaseSha256
  ) fail('PLANNING_RUNTIME_WRITER_CONFLICT', 'writer lease is corrupt or substituted');
  return value;
}

function acquireWriter(paths, projectRef, instanceRef, observedAt) {
  assertRef(instanceRef, 'instanceRef');
  assertTimestamp(observedAt, 'observedAt');
  ensureDirectory(paths.root, paths.projectRoot);
  const core = {
    schemaVersion: PROJECT_PLANNING_RUNTIME_WRITER_SCHEMA,
    projectRef,
    instanceRef,
    pid: process.pid,
    lockToken: crypto.randomUUID(),
    formedAt: observedAt,
  };
  const lease = Object.freeze({ ...core, leaseSha256: semanticHash(core) });
  try {
    const fd = fs.openSync(paths.writer, 'wx', 0o600);
    try { fs.writeFileSync(fd, canonicalJson(lease), 'utf8'); fs.fsyncSync(fd); }
    finally { fs.closeSync(fd); }
    return Object.freeze({ token: lease.lockToken, leaseSha256: lease.leaseSha256 });
  } catch (error) {
    if (error?.code !== 'EEXIST') throw error;
    const existing = validateWriterLease(readCanonicalJson(paths.root, paths.writer, 'PLANNING_RUNTIME_WRITER_CONFLICT', 'writer lease'), projectRef);
    const state = processState(existing.pid);
    fail(
      state === 'ABSENT' ? 'PLANNING_RUNTIME_WRITER_RECOVERY_REQUIRED' : 'PLANNING_RUNTIME_WRITER_CONFLICT',
      state === 'ABSENT' ? 'abandoned writer lease requires explicit recovery' : 'writer lease is active or unverifiable',
      { leaseSha256: existing.leaseSha256 },
    );
  }
}

function releaseWriter(paths, projectRef, lease) {
  if (!fs.existsSync(paths.writer)) return false;
  const current = validateWriterLease(readCanonicalJson(paths.root, paths.writer, 'PLANNING_RUNTIME_WRITER_CONFLICT', 'writer lease'), projectRef);
  if (current.lockToken !== lease.token || current.leaseSha256 !== lease.leaseSha256) return false;
  fs.unlinkSync(paths.writer);
  return true;
}

function withWriter(paths, projectRef, instanceRef, observedAt, fn) {
  const lease = acquireWriter(paths, projectRef, instanceRef, observedAt);
  let result;
  let caught = null;
  try { result = fn(); } catch (error) { caught = error; }
  const released = releaseWriter(paths, projectRef, lease);
  if (!released && !caught) fail('PLANNING_RUNTIME_WRITER_CONFLICT', 'writer lease release could not be proven');
  if (caught) throw caught;
  return result;
}

function eventFile(paths, event) {
  return safePath(paths.root, path.join(paths.events, `${String(event.sequence).padStart(12, '0')}-${event.semanticFingerprint}.json`));
}

function snapshotFile(paths, fingerprint) {
  return safePath(paths.root, path.join(paths.snapshots, `${fingerprint}.json`));
}

function pointerFile(paths, pointerSha256) {
  return safePath(paths.root, path.join(paths.pointers, `${pointerSha256}.json`));
}

function validatePointer(value, projectRef) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail('PLANNING_RUNTIME_POINTER_CORRUPT', 'planning pointer invalid');
  const { pointerSha256, ...core } = value;
  if (
    value.schemaVersion !== PROJECT_PLANNING_RUNTIME_POINTER_SCHEMA
    || value.currentness !== 'CURRENT'
    || value.projectRef !== projectRef
    || typeof value.snapshotFingerprint !== 'string' || !HEX64.test(value.snapshotFingerprint)
    || typeof value.eventFingerprint !== 'string' || !HEX64.test(value.eventFingerprint)
    || !Number.isSafeInteger(value.sequence) || value.sequence < 1
    || (value.priorPointerSha256OrNull !== null && !HEX64.test(value.priorPointerSha256OrNull))
    || (value.priorSnapshotFingerprintOrNull !== null && !HEX64.test(value.priorSnapshotFingerprintOrNull))
    || ((value.priorPointerSha256OrNull === null) !== (value.priorSnapshotFingerprintOrNull === null))
    || typeof pointerSha256 !== 'string' || !HEX64.test(pointerSha256)
    || semanticHash(core) !== pointerSha256
  ) fail('PLANNING_RUNTIME_POINTER_CORRUPT', 'planning pointer is stale, substituted, or corrupt');
  return value;
}

function readPointer(paths, sha, projectRef) {
  const file = pointerFile(paths, sha);
  if (!fs.existsSync(file)) fail('PLANNING_RUNTIME_POINTER_CORRUPT', 'planning pointer lineage record missing');
  const pointer = validatePointer(readCanonicalJson(paths.root, file, 'PLANNING_RUNTIME_POINTER_CORRUPT', 'planning pointer'), projectRef);
  if (pointer.pointerSha256 !== sha) fail('PLANNING_RUNTIME_POINTER_CORRUPT', 'planning pointer address mismatch');
  return pointer;
}

function resolveCurrentPointer(paths, projectRef) {
  if (!fs.existsSync(paths.pointers)) return null;
  const names = fs.readdirSync(paths.pointers).sort();
  if (names.length === 0) return null;
  for (const name of names) if (!/^[a-f0-9]{64}\.json$/u.test(name)) fail('PLANNING_RUNTIME_POINTER_CORRUPT', 'unexpected planning pointer entry', { name });
  const pointers = names.map((name) => readPointer(paths, name.slice(0, -5), projectRef));
  const bySha = new Map(pointers.map((pointer) => [pointer.pointerSha256, pointer]));
  const referenced = new Set();
  let roots = 0;
  for (const pointer of pointers) {
    if (pointer.priorPointerSha256OrNull === null) { roots += 1; continue; }
    const prior = bySha.get(pointer.priorPointerSha256OrNull);
    if (!prior) fail('PLANNING_RUNTIME_POINTER_CORRUPT', 'planning pointer predecessor missing');
    if (prior.snapshotFingerprint !== pointer.priorSnapshotFingerprintOrNull) fail('PLANNING_RUNTIME_POINTER_CORRUPT', 'planning predecessor snapshot mismatch');
    if (prior.sequence + 1 !== pointer.sequence) fail('PLANNING_RUNTIME_POINTER_CORRUPT', 'planning pointer sequence is discontinuous');
    referenced.add(prior.pointerSha256);
  }
  const tips = pointers.filter((pointer) => !referenced.has(pointer.pointerSha256));
  if (roots !== 1 || tips.length !== 1) fail('PLANNING_RUNTIME_POINTER_CORRUPT', 'planning pointer store must contain one connected lineage');
  return Object.freeze({ pointer: tips[0], recordCount: pointers.length });
}

function readSnapshot(paths, fingerprint) {
  const file = snapshotFile(paths, fingerprint);
  if (!fs.existsSync(file)) fail('PLANNING_RUNTIME_SNAPSHOT_MISSING', 'planning snapshot missing');
  const snapshot = validateProjectPlanningSnapshot(readCanonicalJson(paths.root, 