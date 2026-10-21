import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { semanticHash } from '../src/core/semantic.mjs';
import { createWorkgraph } from '../src/core/workgraph.mjs';
import {
  WORKGRAPH_RUNTIME_WRITER_SCHEMA,
  commitWorkgraphRuntimeTransition,
  initializeWorkgraphRuntime,
  readCurrentWorkgraphRuntime,
  recoverWorkgraphRuntimeWriter,
  workgraphRuntimeAddress,
} from '../src/core/workgraph-runtime.mjs';

const registry = JSON.parse(fs.readFileSync(new URL('../blueprint/work-registry.json', import.meta.url), 'utf8'));
function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  return value;
}
const canonical = (value) => JSON.stringify(canonicalize(value));
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'vexwork-runtime-'));

function source() {
  return {
    schemaVersion: 'vexwork.workgraph/v1',
    graphRef: 'workgraph.test.runtime',
    rootWorkRefs: ['work.test.runtime'],
    items: [{
      schemaVersion: 'vexwork.work-item/v1',
      workRef: 'work.test.runtime',
      parentWorkRefOrNull: null,
      label: 'Runtime test work',
      purpose: 'Prove durable Workgraph currentness across restart without provider mutation.',
      workClass: 'TASK',
      state: 'READY',
      workDisposition: 'ACTIVE',
      priorityClass: 'NORMAL',
      dependencyRefs: [],
      repositoryRefs: [],
      sourceRefs: ['test.workgraph-runtime'],
      formationProcessRefOrNull: null,
      nextProcessRefs: [],
      authorityDisposition: 'AUTHORIZED_BOUNDED',
      effectDisposition: 'EFFECTS_BOUND',
      createdAt: '2026-10-21T05:00:00.000Z',
      updatedAt: '2026-10-21T05:00:00.000Z',
    }],
    transitions: [],
    sourceRefs: ['test.workgraph-runtime'],
    formedAt: '2026-10-21T05:00:00.000Z',
  };
}

function init(storeRoot) {
  return initializeWorkgraphRuntime({
    storeRoot,
    graph: source(),
    registry,
    instanceRef: 'instance.test.runtime.initialize',
    observedAt: '2026-10-21T05:00:01.000Z',
  });
}

function transition(graphFingerprint, overrides = {}) {
  return {
    workRef: 'work.test.runtime',
    transitionRef: 'transition.test.runtime.start',
    expectedGraphFingerprint: graphFingerprint,
    expectedState: 'READY',
    nextState: 'RUNNING',
    actorRef: 'role.test.runtime',
    sourceRefs: ['test.workgraph-runtime'],
    reason: 'runtime persistence proof',
    createdAt: '2026-10-21T05:01:00.000Z',
    ...overrides,
  };
}

function commit(storeRoot, current, overrides = {}) {
  return commitWorkgraphRuntimeTransition({
    storeRoot,
    graphRef: current.graph.graphRef,
    expectedPointerSha256: current.pointer.pointerSha256,
    transitionRequest: transition(current.graph.semanticFingerprint),
    registry,
    instanceRef: 'instance.test.runtime.transition',
    observedAt: '2026-10-21T05:01:01.000Z',
    ...overrides,
  });
}

function cleanup(storeRoot) { fs.rmSync(storeRoot, { recursive: true, force: true }); }

test('initialize + restart preserves exact current Workgraph', () => {
  const storeRoot = tmp();
  try {
    const current = init(storeRoot);
    const restarted = readCurrentWorkgraphRuntime({ storeRoot, graphRef: current.graph.graphRef, registry });
    assert.equal(current.state, 'CURRENT');
    assert.equal(current.changed, true);
    assert.equal(current.pointer.transitionCount, 0);
    assert.equal(restarted.pointer.pointerSha256, current.pointer.pointerSha256);
    assert.equal(restarted.graph.semanticFingerprint, current.graph.semanticFingerprint);
    assert.equal(restarted.effects.runtimeMutationPerformed, false);
    assert.equal(current.effects.providerMutationPerformed, false);
  } finally { cleanup(storeRoot); }
});

test('initialize reuses the exact orphan snapshot left before first CURRENT', () => {
  const storeRoot = tmp();
  try {
    const graph = createWorkgraph(source(), registry);
    const snapshots = path.join(storeRoot, 'workgraphs', workgraphRuntimeAddress(graph.graphRef), 'snapshots');
    fs.mkdirSync(snapshots, { recursive: true });
    fs.writeFileSync(path.join(snapshots, `${graph.semanticFingerprint}.json`), canonical(graph), { encoding: 'utf8', mode: 0o600 });
    const current = init(storeRoot);
    assert.equal(current.changed, true);
    assert.equal(current.graph.semanticFingerprint, graph.semanticFingerprint);
  } finally { cleanup(storeRoot); }
});

test('transition uses exact CURRENT CAS and survives restart', () => {
  const storeRoot = tmp();
  try {
    const initial = init(storeRoot);
    const next = commit(storeRoot, initial);
    const restarted = readCurrentWorkgraphRuntime({ storeRoot, graphRef: initial.graph.graphRef, registry });
    assert.equal(next.graph.items[0].state, 'RUNNING');
    assert.equal(next.pointer.transitionCount, 1);
    assert.equal(next.pointer.priorPointerSha256OrNull, initial.pointer.pointerSha256);
    assert.equal(restarted.pointer.pointerSha256, next.pointer.pointerSha256);
    assert.equal(restarted.graph.transitions.at(-1).transitionRef, 'transition.test.runtime.start');
    assert.equal(next.effects.providerMutationPerformed, false);
  } finally { cleanup(storeRoot); }
});

test('stale CURRENT pointer fails before another transition commits', () => {
  const storeRoot = tmp();
  try {
    const initial = init(storeRoot);
    commit(storeRoot, initial);
    assert.throws(() => commitWorkgraphRuntimeTransition({
      storeRoot,
      graphRef: initial.graph.graphRef,
      expectedPointerSha256: initial.pointer.pointerSha256,
      transitionRequest: transition(initial.graph.semanticFingerprint, {
        transitionRef: 'transition.test.runtime.stale',
        expectedState: 'RUNNING',
        nextState: 'VERIFYING',
        createdAt: '2026-10-21T05:02:00.000Z',
      }),
      registry,
      observedAt: '2026-10-21T05:02:01.000Z',
    }), (error) => error?.code === 'RUNTIME_STALE');
    assert.equal(readCurrentWorkgraphRuntime({ storeRoot, graphRef: initial.graph.graphRef, registry }).pointer.transitionCount, 1);
  } finally { cleanup(storeRoot); }
});

test('runtime delegates lifecycle legality to Workgraph semantics', () => {
  const storeRoot = tmp();
  try {
    const current = init(storeRoot);
    assert.throws(() => commit(storeRoot, current, {
      transitionRequest: transition(current.graph.semanticFingerprint, {
        transitionRef: 'transition.test.runtime.illegal',
        nextState: 'CLOSED',
      }),
    }), /transition READY -> CLOSED not allowed/);
    assert.equal(readCurrentWorkgraphRuntime({ storeRoot, graphRef: current.graph.graphRef, registry }).graph.items[0].state, 'READY');
  } finally { cleanup(storeRoot); }
});

test('abandoned writer requires exact explicit recovery', async () => {
  const storeRoot = tmp();
  try {
    const current = init(storeRoot);
    const child = spawn(process.execPath, ['-e', '']);
    const pid = child.pid;
    await new Promise((resolve, reject) => { child.once('exit', resolve); child.once('error', reject); });
    const graphRoot = path.join(storeRoot, 'workgraphs', workgraphRuntimeAddress(current.graph.graphRef));
    const lockFile = path.join(graphRoot, 'writer.lock');
    const core = {
      schemaVersion: WORKGRAPH_RUNTIME_WRITER_SCHEMA,
      graphRef: current.graph.graphRef,
      instanceRef: 'instance.test.abandoned',
      pid,
      lockToken: 'lock.test.abandoned',
      formedAt: '2026-10-21T05:03:00.000Z',
    };
    const lease = { ...core, leaseSha256: semanticHash(core) };
    fs.writeFileSync(lockFile, canonical(lease), { encoding: 'utf8', mode: 0o600 });

    assert.throws(() => commit(storeRoot, current), (error) => error?.code === 'RUNTIME_WRITER_RECOVERY_REQUIRED');
    assert.throws(() => recoverWorkgraphRuntimeWriter({
      storeRoot,
      graphRef: current.graph.graphRef,
      expectedLeaseSha256: '0'.repeat(64),
      registry,
    }), (error) => error?.code === 'RUNTIME_RECOVERY_STALE');

    const recovered = recoverWorkgraphRuntimeWriter({
      storeRoot,
      graphRef: current.graph.graphRef,
      expectedLeaseSha256: lease.leaseSha256,
      registry,
    });
    assert.equal(recovered.state, 'RECOVERED');
    assert.equal(recovered.effects.writerLeaseDeletionPerformed, true);
    assert.equal(recovered.effects.providerMutationPerformed, false);
    assert.equal(fs.existsSync(lockFile), false);
  } finally { cleanup(storeRoot); }
});
