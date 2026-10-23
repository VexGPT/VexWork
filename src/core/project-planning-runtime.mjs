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
      if (canonicalJson(ex