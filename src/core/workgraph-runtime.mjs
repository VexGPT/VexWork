import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import { semanticHash } from './semantic.mjs';
import { createWorkgraph, requestTransition } from './workgraph.mjs';

export const WORKGRAPH_RUNTIME_STORE_SCHEMA = 'vexwork.workgraph-runtime-store/v1';
export const WORKGRAPH_RUNTIME_POINTER_SCHEMA = 'vexwork.workgraph-runtime-pointer/v1';
export const WORKGRAPH_RUNTIME_WRITER_SCHEMA = 'vexwork.workgraph-runtime-writer/v1';
export const WORKGRAPH_RUNTIME_CURRENTNESS_BASIS = 'RETAINED_POINTER_LINEAGE';

const REF = /^[A-Za-z0-9][A-Za-z0-9._:/-]*$/u;
const HEX64 = /^[a-f0-9]{64}$/u;
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/u;

export class WorkgraphRuntimeStoreError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'WorkgraphRuntimeStoreError';
    this.code = code;
    this.details = Object.freeze({ ...details });
  }
}

function fail(code, message, details = {}) {
  throw new WorkgraphRuntimeStoreError(code, message, details);
}

function assertRef(value, label) {
  if (typeof value !== 'string' || !REF.test(value)) fail('RUNTIME_INPUT_INVALID', `${label} must be one stable ref`);
  return value;
}

function assertTimestamp(value, label) {
  if (typeof value !== 'string' || !ISO.test(value) || new Date(value).toISOString() !== value) {
    fail('RUNTIME_INPUT_INVALID', `${label} must be canonical UTC ISO`);
  }
  return value;
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  for (const item of Object.values(value)) deepFreeze(item);
  return Object.freeze(value);
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  }
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
  if (typeof storeRoot !== 'string' || !storeRoot) fail('RUNTIME_STORE_ROOT_INVALID', 'storeRoot is required');
  const requested = path.resolve(storeRoot);
  let stat;
  try {
    stat = fs.lstatSync(requested);
  } catch (error) {
    fail('RUNTIME_STORE_ROOT_INVALID', 'storeRoot must already exist', { cause: error.message });
  }
  if (stat.isSymbolicLink() || !stat.isDirectory()) {
    fail('RUNTIME_STORE_ROOT_INVALID', 'storeRoot must be one canonical directory');
  }
  const real = fs.realpathSync.native(requested);
  if (!samePath(real, requested)) {
    fail('RUNTIME_STORE_ROOT_INVALID', 'storeRoot is not canonical', { requested, real });
  }
  return real;
}

function safePath(root, target) {
  const full = path.resolve(target);
  const relative = path.relative(root, full);
  if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    fail('RUNTIME_PATH_INVALID', 'runtime path escapes storeRoot');
  }
  if (!relative) return full;
  let cursor = root;
  for (const segment of relative.split(path.sep)) {
    cursor = path.join(cursor, segment);
    if (!fs.existsSync(cursor)) continue;
    const stat = fs.lstatSync(cursor);
    if (stat.isSymbolicLink()) fail('RUNTIME_PATH_INVALID', 'runtime path traverses a symbolic alias', { path: cursor });
    if (!samePath(fs.realpathSync.native(cursor), cursor)) {
      fail('RUNTIME_PATH_INVALID', 'runtime path traverses a non-canonical alias', { path: cursor });
    }
  }
  return full;
}

function ensureDirectory(root, dir) {
  fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
  safePath(root, dir);
  const stat = fs.lstatSync(dir);
  if (stat.isSymbolicLink() || !stat.isDirectory()) fail('RUNTIME_PATH_INVALID', 'runtime store directory is invalid', { path: dir });
}

export function workgraphRuntimeAddress(graphRef) {
  assertRef(graphRef, 'graphRef');
  return semanticHash({ schemaVersion: WORKGRAPH_RUNTIME_STORE_SCHEMA, graphRef });
}

function storePaths(storeRoot, graphRef, { create = false } = {}) {
  const root = canonicalStoreRoot(storeRoot);
  const address = workgraphRuntimeAddress(graphRef);
  const workgraphs = safePath(root, path.join(root, 'workgraphs'));
  const graphRoot = safePath(root, path.join(workgraphs, address));
  const snapshots = safePath(root, path.join(graphRoot, 'snapshots'));
  const pointers = safePath(root, path.join(graphRoot, 'pointers'));
  const writer = safePath(root, path.join(graphRoot, 'writer.lock'));
  if (create) {
    ensureDirectory(root, workgraphs);
    ensureDirectory(root, graphRoot);
    ensureDirectory(root, snapshots);
    ensureDirectory(root, pointers);
  }
  return Object.freeze({ root, address, workgraphs, graphRoot, snapshots, pointers, writer });
}

function readCanonicalJson(root, file, code, label) {
  let raw;
  try {
    const stat = fs.lstatSync(file);
    if (stat.isSymbolicLink() || !stat.isFile()) fail(code, `${label} must be one regular file`);
    safePath(root, file);
    raw = fs.readFileSync(file, 'utf8');
  } catch (error) {
    if (error instanceof WorkgraphRuntimeStoreError) throw error;
    fail(code, `${label} could not be read`, { cause: error.message });
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    fail(code, `${label} is malformed JSON`);
  }
  if (raw !== canonicalJson(parsed)) fail(code, `${label} bytes are not canonical`);
  return parsed;
}

function writeImmutableJson(root, file, value, label = 'immutable runtime record') {
  ensureDirectory(root, path.dirname(file));
  const bytes = canonicalJson(value);
  if (fs.existsSync(file)) {
    const existing = readCanonicalJson(root, file, 'RUNTIME_IMMUTABLE_CONFLICT', label);
    if (canonicalJson(existing) !== bytes) fail('RUNTIME_IMMUTABLE_CONFLICT', `${label} exists with different bytes`);
    return false;
  }
  let fd = null;
  try {
    fd = fs.openSync(file, 'wx', 0o600);
    fs.writeFileSync(fd, bytes, 'utf8');
    fs.fsyncSync(fd);
    fs.closeSync(fd);
    fd = null;
    return true;
  } finally {
    if (fd !== null) {
      try { fs.closeSync(fd); } catch {}
    }
  }
}

function pointerRecordFile(paths, pointerSha256) {
  return safePath(paths.root, path.join(paths.pointers, `${pointerSha256}.json`));
}

function publishPointerRecordAtomic(paths, pointer) {
  ensureDirectory(paths.root, paths.pointers);
  const file = pointerRecordFile(paths, pointer.pointerSha256);
  const bytes = canonicalJson(pointer);
  if (fs.existsSync(file)) {
    const existing = readCanonicalJson(paths.root, file, 'RUNTIME_IMMUTABLE_CONFLICT', 'immutable current-pointer record');
    if (canonicalJson(existing) !== bytes) fail('RUNTIME_IMMUTABLE_CONFLICT', 'current-pointer content address exists with different bytes');
    return false;
  }
  const tmp = safePath(paths.root, path.join(paths.graphRoot, `.pointer-publish-${process.pid}-${crypto.randomUUID()}.tmp`));
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
      const existing = readCanonicalJson(paths.root, file, 'RUNTIME_IMMUTABLE_CONFLICT', 'immutable current-pointer record');
      if (canonicalJson(existing) !== bytes) fail('RUNTIME_IMMUTABLE_CONFLICT', 'current-pointer content address exists with different bytes');
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
  try {
    process.kill(pid, 0);
    return 'ACTIVE';
  } catch (error) {
    if (error?.code === 'ESRCH') return 'ABSENT';
    if (error?.code === 'EPERM') return 'ACTIVE';
    return 'UNVERIFIABLE';
  }
}

function validateWriterLease(value, graphRef) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail('RUNTIME_WRITER_CONFLICT', 'writer lease is invalid');
  const { leaseSha256, ...core } = value;
  if (
    value.schemaVersion !== WORKGRAPH_RUNTIME_WRITER_SCHEMA
    || value.graphRef !== graphRef
    || typeof value.instanceRef !== 'string'
    || !REF.test(value.instanceRef)
    || !Number.isSafeInteger(value.pid)
    || value.pid <= 0
    || typeof value.lockToken !== 'string'
    || !value.lockToken
    || typeof value.formedAt !== 'string'
    || !ISO.test(value.formedAt)
    || typeof leaseSha256 !== 'string'
    || !HEX64.test(leaseSha256)
    || semanticHash(core) !== leaseSha256
  ) {
    fail('RUNTIME_WRITER_CONFLICT', 'writer lease is corrupt or substituted');
  }
  return value;
}

function acquireWriter(paths, graphRef, instanceRef, observedAt) {
  assertRef(instanceRef, 'instanceRef');
  assertTimestamp(observedAt, 'observedAt');
  ensureDirectory(paths.root, paths.graphRoot);
  const core = {
    schemaVersion: WORKGRAPH_RUNTIME_WRITER_SCHEMA,
    graphRef,
    instanceRef,
    pid: process.pid,
    lockToken: crypto.randomUUID(),
    formedAt: observedAt,
  };
  const lease = Object.freeze({ ...core, leaseSha256: semanticHash(core) });
  try {
    const fd = fs.openSync(paths.writer, 'wx', 0o600);
    try {
      fs.writeFileSync(fd, canonicalJson(lease), 'utf8');
      fs.fsyncSync(fd);
    } finally {
      fs.closeSync(fd);
    }
    return Object.freeze({ token: lease.lockToken, leaseSha256: lease.leaseSha256 });
  } catch (error) {
    if (error?.code !== 'EEXIST') throw error;
    const existing = validateWriterLease(
      readCanonicalJson(paths.root, paths.writer, 'RUNTIME_WRITER_CONFLICT', 'writer lease'),
      graphRef,
    );
    const state = processState(existing.pid);
    fail(
      state === 'ABSENT' ? 'RUNTIME_WRITER_RECOVERY_REQUIRED' : 'RUNTIME_WRITER_CONFLICT',
      state === 'ABSENT' ? 'abandoned writer lease requires explicit recovery' : 'writer lease is active or unverifiable',
      { leaseSha256: existing.leaseSha256 },
    );
  }
}

function releaseWriter(paths, graphRef, lease) {
  if (!fs.existsSync(paths.writer)) return false;
  const current = validateWriterLease(
    readCanonicalJson(paths.root, paths.writer, 'RUNTIME_WRITER_CONFLICT', 'writer lease'),
    graphRef,
  );
  if (current.lockToken !== lease.token || current.leaseSha256 !== lease.leaseSha256) return false;
  fs.unlinkSync(paths.writer);
  return true;
}

function withWriter(paths, graphRef, instanceRef, observedAt, fn) {
  const lease = acquireWriter(paths, graphRef, instanceRef, observedAt);
  let result;
  let caught = null;
  try {
    result = fn();
  } catch (error) {
    caught = error;
  }
  const released = releaseWriter(paths, graphRef, lease);
  if (!released && !caught) fail('RUNTIME_WRITER_CONFLICT', 'writer lease release could not be proven');
  if (caught) throw caught;
  return result;
}

function lastTransitionRef(graph) {
  return graph.transitions.length ? graph.transitions.at(-1).transitionRef : null;
}

function sealPointer({ graph, priorPointerSha256OrNull, priorGraphSemanticFingerprintOrNull }) {
  const core = {
    schemaVersion: WORKGRAPH_RUNTIME_POINTER_SCHEMA,
    currentness: 'CURRENT',
    graphRef: graph.graphRef,
    graphSemanticFingerprint: graph.semanticFingerprint,
    graphPayloadSha256: semanticHash(graph),
    transitionCount: graph.transitions.length,
    lastTransitionRefOrNull: lastTransitionRef(graph),
    priorPointerSha256OrNull,
    priorGraphSemanticFingerprintOrNull,
  };
  return Object.freeze({ ...core, pointerSha256: semanticHash(core) });
}

function validatePointer(value, graphRef) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail('RUNTIME_POINTER_CORRUPT', 'current pointer is invalid');
  const { pointerSha256, ...core } = value;
  if (
    value.schemaVersion !== WORKGRAPH_RUNTIME_POINTER_SCHEMA
    || value.currentness !== 'CURRENT'
    || value.graphRef !== graphRef
    || typeof value.graphSemanticFingerprint !== 'string'
    || !HEX64.test(value.graphSemanticFingerprint)
    || typeof value.graphPayloadSha256 !== 'string'
    || !HEX64.test(value.graphPayloadSha256)
    || !Number.isSafeInteger(value.transitionCount)
    || value.transitionCount < 0
    || (value.lastTransitionRefOrNull !== null && (typeof value.lastTransitionRefOrNull !== 'string' || !REF.test(value.lastTransitionRefOrNull)))
    || (value.priorPointerSha256OrNull !== null && (typeof value.priorPointerSha256OrNull !== 'string' || !HEX64.test(value.priorPointerSha256OrNull)))
    || (value.priorGraphSemanticFingerprintOrNull !== null && (typeof value.priorGraphSemanticFingerprintOrNull !== 'string' || !HEX64.test(value.priorGraphSemanticFingerprintOrNull)))
    || ((value.priorPointerSha256OrNull === null) !== (value.priorGraphSemanticFingerprintOrNull === null))
    || typeof pointerSha256 !== 'string'
    || !HEX64.test(pointerSha256)
    || semanticHash(core) !== pointerSha256
  ) {
    fail('RUNTIME_POINTER_CORRUPT', 'current pointer is stale, substituted, or corrupt');
  }
  return value;
}

function readPointerRecord(paths, pointerSha256, graphRef) {
  const file = pointerRecordFile(paths, pointerSha256);
  if (!fs.existsSync(file)) fail('RUNTIME_POINTER_CORRUPT', 'current pointer lineage record is missing');
  const pointer = validatePointer(
    readCanonicalJson(paths.root, file, 'RUNTIME_POINTER_CORRUPT', 'immutable current-pointer record'),
    graphRef,
  );
  if (pointer.pointerSha256 !== pointerSha256) {
    fail('RUNTIME_POINTER_CORRUPT', 'current pointer lineage record does not match its content address');
  }
  return Object.freeze({ file, pointer });
}

function pointerRecordNames(paths) {
  if (!fs.existsSync(paths.pointers)) return [];
  const names = fs.readdirSync(paths.pointers).sort();
  for (const name of names) {
    if (!/^[a-f0-9]{64}\.json$/u.test(name)) {
      fail('RUNTIME_POINTER_CORRUPT', 'pointer store contains an unexpected entry', { name });
    }
  }
  return names;
}

function resolveCurrentPointer(paths, graphRef) {
  const names = pointerRecordNames(paths);
  if (names.length === 0) fail('RUNTIME_CURRENT_UNAVAILABLE', 'current Workgraph pointer is unavailable');
  const records = names.map((name) => readPointerRecord(paths, name.slice(0, -5), graphRef));
  const bySha = new Map(records.map((record) => [record.pointer.pointerSha256, record.pointer]));
  const referencedParents = new Set();
  let roots = 0;
  for (const { pointer } of records) {
    if (pointer.priorPointerSha256OrNull === null) {
      roots += 1;
      continue;
    }
    const prior = bySha.get(pointer.priorPointerSha256OrNull);
    if (!prior) fail('RUNTIME_POINTER_CORRUPT', 'current pointer lineage predecessor is missing');
    if (prior.graphSemanticFingerprint !== pointer.priorGraphSemanticFingerprintOrNull) {
      fail('RUNTIME_POINTER_CORRUPT', 'current pointer predecessor identity does not match retained lineage');
    }
    if (prior.transitionCount + 1 !== pointer.transitionCount) {
      fail('RUNTIME_POINTER_CORRUPT', 'current pointer lineage does not represent one admitted Workgraph transition');
    }
    referencedParents.add(prior.pointerSha256);
  }
  const tips = records.map((record) => record.pointer).filter((pointer) => !referencedParents.has(pointer.pointerSha256));
  if (roots !== 1 || tips.length !== 1) {
    fail('RUNTIME_POINTER_CORRUPT', 'pointer store must contain one connected currentness lineage with one current tip', { roots, tips: tips.length });
  }
  return Object.freeze({ pointer: tips[0], recordCount: records.length });
}

function assertPointerMatchesGraph(pointer, graph) {
  if (
    semanticHash(graph) !== pointer.graphPayloadSha256
    || graph.semanticFingerprint !== pointer.graphSemanticFingerprint
    || graph.transitions.length !== pointer.transitionCount
    || lastTransitionRef(graph) !== pointer.lastTransitionRefOrNull
  ) {
    fail('RUNTIME_POINTER_CORRUPT', 'current pointer and Workgraph snapshot disagree');
  }
}

function validatePointerLineage(paths, pointer, graph, registry, expectedRecordCount) {
  const seen = new Set([pointer.pointerSha256]);
  let currentPointer = pointer;
  let currentGraph = graph;
  while (currentPointer.priorPointerSha256OrNull !== null) {
    const priorRecord = readPointerRecord(paths, currentPointer.priorPointerSha256OrNull, currentPointer.graphRef);
    const priorPointer = priorRecord.pointer;
    if (seen.has(priorPointer.pointerSha256)) fail('RUNTIME_POINTER_CORRUPT', 'current pointer lineage contains a cycle');
    seen.add(priorPointer.pointerSha256);
    if (priorPointer.graphSemanticFingerprint !== currentPointer.priorGraphSemanticFingerprintOrNull) {
      fail('RUNTIME_POINTER_CORRUPT', 'current pointer predecessor identity does not match retained lineage');
    }
    if (priorPointer.transitionCount + 1 !== currentPointer.transitionCount) {
      fail('RUNTIME_POINTER_CORRUPT', 'current pointer lineage does not represent one admitted Workgraph transition');
    }
    const priorGraph = readSnapshot(paths, priorPointer.graphSemanticFingerprint, registry);
    assertPointerMatchesGraph(priorPointer, priorGraph);
    assertTransitionHistoryPrefix(priorGraph, currentGraph);
    currentPointer = priorPointer;
    currentGraph = priorGraph;
  }
  if (seen.size !== expectedRecordCount) {
    fail('RUNTIME_POINTER_CORRUPT', 'pointer store contains disconnected or unaccepted currentness lineage');
  }
}

function assertTransitionHistoryPrefix(prior, current) {
  if (prior.graphRef !== current.graphRef || prior.formedAt !== current.formedAt) {
    fail('RUNTIME_SNAPSHOT_CORRUPT', 'runtime Workgraph identity changed across current-pointer lineage');
  }
  if (prior.transitions.length > current.transitions.length) {
    fail('RUNTIME_SNAPSHOT_CORRUPT', 'runtime Workgraph transition history regressed');
  }
  for (let index = 0; index < prior.transitions.length; index += 1) {
    if (canonicalJson(prior.transitions[index]) !== canonicalJson(current.transitions[index])) {
      fail('RUNTIME_SNAPSHOT_CORRUPT', 'runtime Workgraph transition history was rewritten');
    }
  }
}

function readSnapshot(paths, fingerprint, registry) {
  const snapshotFile = safePath(paths.root, path.join(paths.snapshots, `${fingerprint}.json`));
  if (!fs.existsSync(snapshotFile)) fail('RUNTIME_SNAPSHOT_MISSING', 'current pointer references a missing Workgraph snapshot');
  const graph = createWorkgraph(
    readCanonicalJson(paths.root, snapshotFile, 'RUNTIME_SNAPSHOT_CORRUPT', 'Workgraph runtime snapshot'),
    registry,
  );
  if (graph.semanticFingerprint !== fingerprint) fail('RUNTIME_SNAPSHOT_CORRUPT', 'Workgraph snapshot fingerprint does not match its address');
  return graph;
}

function readAccepted(paths, graphRef, registry) {
  const resolved = resolveCurrentPointer(paths, graphRef);
  const pointer = resolved.pointer;
  const graph = readSnapshot(paths, pointer.graphSemanticFingerprint, registry);
  assertPointerMatchesGraph(pointer, graph);
  validatePointerLineage(paths, pointer, graph, registry, resolved.recordCount);
  return deepFreeze({
    currentnessBasis: WORKGRAPH_RUNTIME_CURRENTNESS_BASIS,
    pointer: structuredClone(pointer),
    graph: structuredClone(graph),
  });
}

function persistAccepted(paths, graph, priorPointerSha256OrNull, priorGraphSemanticFingerprintOrNull, registry) {
  const snapshotFile = safePath(paths.root, path.join(paths.snapshots, `${graph.semanticFingerprint}.json`));
  writeImmutableJson(paths.root, snapshotFile, graph, 'immutable Workgraph snapshot');
  const pointer = sealPointer({ graph, priorPointerSha256OrNull, priorGraphSemanticFingerprintOrNull });
  publishPointerRecordAtomic(paths, pointer);
  const readback = readAccepted(paths, graph.graphRef, registry);
  if (readback.pointer.pointerSha256 !== pointer.pointerSha256 || readback.graph.semanticFingerprint !== graph.semanticFingerprint) {
    fail('RUNTIME_COMMIT_READBACK_INVALID', 'runtime read-back does not match the committed Workgraph');
  }
  return readback;
}

function initializationArtifacts(paths, exactGraphFingerprint) {
  const unexpected = [];
  if (fs.existsSync(paths.snapshots)) {
    const allowedSnapshot = `${exactGraphFingerprint}.json`;
    unexpected.push(...fs.readdirSync(paths.snapshots).sort().filter((name) => name !== allowedSnapshot).map((name) => `snapshots/${name}`));
  }
  return unexpected;
}

export function initializeWorkgraphRuntime({
  storeRoot,
  graph,
  registry,
  instanceRef = 'instance.vexwork.runtime.initialize',
  observedAt = new Date().toISOString(),
} = {}) {
  if (!registry || typeof registry !== 'object') fail('RUNTIME_INPUT_INVALID', 'work registry is required');
  const exactGraph = createWorkgraph(graph, registry);
  assertRef(instanceRef, 'instanceRef');
  assertTimestamp(observedAt, 'observedAt');
  const paths = storePaths(storeRoot, exactGraph.graphRef, { create: true });
  return withWriter(paths, exactGraph.graphRef, instanceRef, observedAt, () => {
    if (pointerRecordNames(paths).length > 0) {
      const current = readAccepted(paths, exactGraph.graphRef, registry);
      if (current.graph.semanticFingerprint === exactGraph.semanticFingerprint) {
        return deepFreeze({ state: 'CURRENT', changed: false, ...current, effects: { runtimeMutationPerformed: false, providerMutationPerformed: false } });
      }
      fail('RUNTIME_ALREADY_INITIALIZED', 'runtime Workgraph already has a different current snapshot');
    }
    const unexpected = initializationArtifacts(paths, exactGraph.semanticFingerprint);
    if (unexpected.length) fail('RUNTIME_RECOVERY_REQUIRED', 'unrelated immutable Workgraph history exists without a current pointer', { unexpected });
    const accepted = persistAccepted(paths, exactGraph, null, null, registry);
    return deepFreeze({ state: 'CURRENT', changed: true, ...accepted, effects: { runtimeMutationPerformed: true, providerMutationPerformed: false } });
  });
}

export function readCurrentWorkgraphRuntime({ storeRoot, graphRef, registry } = {}) {
  assertRef(graphRef, 'graphRef');
  if (!registry || typeof registry !== 'object') fail('RUNTIME_INPUT_INVALID', 'work registry is required');
  const paths = storePaths(storeRoot, graphRef, { create: false });
  const current = readAccepted(paths, graphRef, registry);
  return deepFreeze({ state: 'CURRENT', ...current, effects: { runtimeMutationPerformed: false, providerMutationPerformed: false } });
}

export function commitWorkgraphRuntimeTransition({
  storeRoot,
  graphRef,
  expectedPointerSha256,
  transitionRequest,
  registry,
  instanceRef = 'instance.vexwork.runtime.transition',
  observedAt = new Date().toISOString(),
} = {}) {
  assertRef(graphRef, 'graphRef');
  assertRef(instanceRef, 'instanceRef');
  assertTimestamp(observedAt, 'observedAt');
  if (typeof expectedPointerSha256 !== 'string' || !HEX64.test(expectedPointerSha256)) {
    fail('RUNTIME_INPUT_INVALID', 'expectedPointerSha256 must be lowercase SHA-256');
  }
  if (!registry || typeof registry !== 'object') fail('RUNTIME_INPUT_INVALID', 'work registry is required');
  const paths = storePaths(storeRoot, graphRef, { create: false });
  return withWriter(paths, graphRef, instanceRef, observedAt, () => {
    const current = readAccepted(paths, graphRef, registry);
    if (current.pointer.pointerSha256 !== expectedPointerSha256) {
      fail('RUNTIME_STALE', 'current Workgraph pointer changed before transition admission', {
        expectedPointerSha256,
        observedPointerSha256: current.pointer.pointerSha256,
      });
    }
    const transitionResult = requestTransition(current.graph, transitionRequest, registry);
    const nextGraph = transitionResult.graph;
    const accepted = persistAccepted(
      paths,
      nextGraph,
      current.pointer.pointerSha256,
      current.graph.semanticFingerprint,
      registry,
    );
    return deepFreeze({
      state: 'CURRENT',
      changed: true,
      ...accepted,
      transition: structuredClone(transitionResult.transition),
      priorPointerSha256: current.pointer.pointerSha256,
      effects: { runtimeMutationPerformed: true, workgraphMutationPerformed: true, providerMutationPerformed: false },
    });
  });
}

export function recoverWorkgraphRuntimeWriter({ storeRoot, graphRef, expectedLeaseSha256, registry } = {}) {
  assertRef(graphRef, 'graphRef');
  if (typeof expectedLeaseSha256 !== 'string' || !HEX64.test(expectedLeaseSha256)) {
    fail('RUNTIME_INPUT_INVALID', 'expectedLeaseSha256 must be lowercase SHA-256');
  }
  if (!registry || typeof registry !== 'object') fail('RUNTIME_INPUT_INVALID', 'work registry is required');
  const paths = storePaths(storeRoot, graphRef, { create: false });
  if (!fs.existsSync(paths.writer)) {
    return deepFreeze({ state: 'RECOVERY_NOT_REQUIRED', recovered: false, graphRef, effects: { runtimeMutationPerformed: false, writerLeaseDeletionPerformed: false, providerMutationPerformed: false } });
  }
  const lease = validateWriterLease(
    readCanonicalJson(paths.root, paths.writer, 'RUNTIME_WRITER_CONFLICT', 'writer lease'),
    graphRef,
  );
  if (lease.leaseSha256 !== expectedLeaseSha256) fail('RUNTIME_RECOVERY_STALE', 'writer recovery lease identity is stale');
  const state = processState(lease.pid);
  if (state !== 'ABSENT') fail('RUNTIME_WRITER_CONFLICT', 'writer lease is active or unverifiable');
  if (pointerRecordNames(paths).length > 0) readAccepted(paths, graphRef, registry);
  fs.unlinkSync(paths.writer);
  return deepFreeze({ state: 'RECOVERED', recovered: true, graphRef, recoveredLeaseSha256: lease.leaseSha256, effects: { runtimeMutationPerformed: true, writerLeaseDeletionPerformed: true, providerMutationPerformed: false } });
}
