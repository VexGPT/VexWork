import assert from 'node:assert/strict';
import childProcess from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  ProjectPlanningRuntimeError,
  projectPlanningRuntimeAddress,
  readProjectPlanningRuntime,
  recordProjectPlanningRuntimeTransaction,
  recoverProjectPlanningRuntimeWriter,
} from '../src/core/project-planning-runtime.mjs';
import { projectPlanningContextFingerprint } from '../src/core/project-planning.mjs';
import { semanticHash } from '../src/core/semantic.mjs';
import { createProject, createWorkgraph } from '../src/core/workgraph.mjs';

const workRegistry = JSON.parse(fs.readFileSync(new URL('../blueprint/work-registry.json', import.meta.url), 'utf8'));
const planningRegistry = JSON.parse(fs.readFileSync(new URL('../blueprint/project-planning-registry.json', import.meta.url), 'utf8'));

const project = createProject({
  schemaVersion: 'vexwork.project-definition/v1', projectRef: 'project.test.planning-runtime', label: 'Planning runtime fixture',
  purpose: 'Exercise durable planning currentness.', rootWorkRefs: ['work.runtime.outcome'], repositoryRefs: ['repo.vexwork'],
  sourceRefs: ['test.project-planning-runtime'], formedAt: '2026-10-23T01:40:00.000Z',
});
const graph = createWorkgraph({
  schemaVersion: 'vexwork.workgraph/v1', graphRef: 'workgraph.test.planning-runtime', rootWorkRefs: ['work.runtime.outcome'],
  items: [
    { schemaVersion: 'vexwork.work-item/v1', workRef: 'work.runtime.outcome', parentWorkRefOrNull: null, label: 'Runtime outcome', purpose: 'Fixture.', workClass: 'OUTCOME', state: 'RUNNING', workDisposition: 'ACTIVE', priorityClass: 'HIGH', dependencyRefs: [], repositoryRefs: ['repo.vexwork'], sourceRefs: ['test.project-planning-runtime'], formationProcessRefOrNull: null, nextProcessRefs: [], authorityDisposition: 'AUTHORIZED_BOUNDED', effectDisposition: 'EFFECTS_BOUND', createdAt: '2026-10-23T01:40:00.000Z', updatedAt: '2026-10-23T01:40:00.000Z' },
    { schemaVersion: 'vexwork.work-item/v1', workRef: 'work.runtime.task', parentWorkRefOrNull: 'work.runtime.outcome', label: 'Runtime task', purpose: 'Fixture.', workClass: 'TASK', state: 'READY', workDisposition: 'ACTIVE', priorityClass: 'NORMAL', dependencyRefs: [], repositoryRefs: ['repo.vexwork'], sourceRefs: ['test.project-planning-runtime'], formationProcessRefOrNull: null, nextProcessRefs: [], authorityDisposition: 'AUTHORIZED_BOUNDED', effectDisposition: 'EFFECTS_BOUND', createdAt: '2026-10-23T01:40:00.000Z', updatedAt: '2026-10-23T01:40:00.000Z' },
  ], transitions: [], sourceRefs: ['test.project-planning-runtime'], formedAt: '2026-10-23T01:40:00.000Z',
}, workRegistry);
const viewRefs = ['view.test.board'];
const contextFingerprint = projectPlanningContextFingerprint({ project, graph, viewRefs, workRegistry });

function tempRoot() {
  return fs.realpathSync.native(fs.mkdtempSync(path.join(os.tmpdir(), 'vexwork-planning-runtime-')));
}

function transaction({ n, current = null, eventClass = 'WIP_POLICY_SET', payload = { laneRef: 'lane.work.active', limit: 2 } }) {
  return {
    schemaVersion: 'vexwork.project-planning-transaction/v1', transactionRef: `transaction.runtime.${n}`, eventRef: `event.runtime.${n}`,
    projectRef: project.projectRef, eventClass, payload, expectedContextFingerprint: contextFingerprint,
    expectedPlanningSnapshotFingerprintOrNull: current?.semanticFingerprint ?? null, actorRef: 'actor.test', sourceRefs: ['test.project-planning-runtime'],
    formedAt: `2026-10-23T01:40:${String(n).padStart(2, '0')}.000Z`,
  };
}

function record(storeRoot, { n, current = null, expectedPointerSha256OrNull = null, eventClass, payload }) {
  return recordProjectPlanningRuntimeTransaction({
    storeRoot, project, graph, viewRefs, transaction: transaction({ n, current, eventClass, payload }), planningRegistry, workRegistry,
    expectedPointerSha256OrNull, instanceRef: `instance.test.${n}`, observedAt: `2026-10-23T01:41:${String(n).padStart(2, '0')}.000Z`,
  });
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  return value;
}

function writeLease(storeRoot, { pid, projectRef = project.projectRef, instanceRef = 'instance.recovery.fixture' }) {
  const address = projectPlanningRuntimeAddress(projectRef);
  const projectRoot = path.join(storeRoot, 'project-planning', address);
  fs.mkdirSync(projectRoot, { recursive: true });
  const core = {
    schemaVersion: 'vexwork.project-planning-runtime-writer/v1', projectRef, instanceRef, pid,
    lockToken: 'token.fixture', formedAt: '2026-10-23T01:42:00.000Z',
  };
  const lease = { ...core, leaseSha256: semanticHash(core) };
  fs.writeFileSync(path.join(projectRoot, 'writer.lock'), JSON.stringify(canonicalize(lease)), 'utf8');
  return lease;
}

test('planning runtime persists exact current snapshot across restart and advances one retained pointer lineage', () => {
  const storeRoot = tempRoot();
  try {
    assert.equal(readProjectPlanningRuntime({ storeRoot, projectRef: project.projectRef }), null);
    const first = record(storeRoot, { n: 1 });
    const restarted = readProjectPlanningRuntime({ storeRoot, projectRef: project.projectRef });
    assert.equal(restarted.pointer.pointerSha256, first.nextPointerSha256);
    assert.equal(restarted.snapshot.semanticFingerprint, first.planning.snapshot.semanticFingerprint);
    assert.equal(restarted.currentnessBasis, 'RETAINED_POINTER_LINEAGE');

    const second = record(storeRoot, { n: 2, current: restarted.snapshot, expectedPointerSha256OrNull: restarted.pointer.pointerSha256, payload: { laneRef: 'lane.work.active', limit: 3 } });
    const latest = readProjectPlanningRuntime({ storeRoot, projectRef: project.projectRef });
    assert.equal(latest.pointer.pointerSha256, second.nextPointerSha256);
    assert.equal(latest.pointer.priorPointerSha256OrNull, first.nextPointerSha256);
    assert.equal(latest.snapshot.sequence, 2);
    assert.equal(latest.snapshot.wipPolicies[0].limit, 3);
    assert.equal(second.effects.workgraphMutationPerformed, false);
    assert.equal(second.effects.providerMutationPerformed, false);
  } finally {
    fs.rmSync(storeRoot, { recursive: true, force: true });
  }
});

test('stale planning pointer is rejected before another transaction can publish current truth', () => {
  const storeRoot = tempRoot();
  try {
    const first = record(storeRoot, { n: 1 });
    assert.throws(
      () => record(storeRoot, { n: 2, current: first.planning.snapshot, expectedPointerSha256OrNull: null }),
      (error) => error instanceof ProjectPlanningRuntimeError && error.code === 'PLANNING_RUNTIME_STALE_CURRENT',
    );
    const current = readProjectPlanningRuntime({ storeRoot, projectRef: project.projectRef });
    assert.equal(current.pointer.pointerSha256, first.nextPointerSha256);
    assert.equal(current.snapshot.sequence, 1);
  } finally {
    fs.rmSync(storeRoot, { recursive: true, force: true });
  }
});

test('writer recovery requires the exact abandoned lease digest and refuses an active writer', () => {
  const storeRoot = tempRoot();
  try {
    const active = writeLease(storeRoot, { pid: process.pid });
    assert.throws(
      () => recoverProjectPlanningRuntimeWriter({ storeRoot, projectRef: project.projectRef, expectedLeaseSha256: active.leaseSha256 }),
      (error) => error instanceof ProjectPlanningRuntimeError && error.code === 'PLANNING_RUNTIME_WRITER_CONFLICT',
    );
    const writer = path.join(storeRoot, 'project-planning', projectPlanningRuntimeAddress(project.projectRef), 'writer.lock');
    fs.rmSync(writer);

    const exited = childProcess.spawnSync(process.execPath, ['-e', 'process.exit(0)']);
    assert.ok(Number.isSafeInteger(exited.pid) && exited.pid > 0);
    const abandoned = writeLease(storeRoot, { pid: exited.pid });
    assert.throws(
      () => recoverProjectPlanningRuntimeWriter({ storeRoot, projectRef: project.projectRef, expectedLeaseSha256: '0'.repeat(64) }),
      (error) => error instanceof ProjectPlanningRuntimeError && error.code === 'PLANNING_RUNTIME_STALE_RECOVERY',
    );
    const recovered = recoverProjectPlanningRuntimeWriter({ storeRoot, projectRef: project.projectRef, expectedLeaseSha256: abandoned.leaseSha256 });
    assert.equal(recovered.state, 'RECOVERED');
    assert.equal(recovered.effects.writerLeaseDeletionPerformed, true);
    assert.equal(fs.existsSync(writer), false);
    assert.equal(recoverProjectPlanningRuntimeWriter({ storeRoot, projectRef: project.projectRef, expectedLeaseSha256: abandoned.leaseSha256 }).state, 'RECOVERY_NOT_REQUIRED');
  } finally {
    fs.rmSync(storeRoot, { recursive: true, force: true });
  }
});

test('restart validates the full retained planning lineage rather than only the current tip', () => {
  const storeRoot = tempRoot();
  try {
    const first = record(storeRoot, { n: 1 });
    const current1 = readProjectPlanningRuntime({ storeRoot, projectRef: project.projectRef });
    record(storeRoot, { n: 2, current: current1.snapshot, expectedPointerSha256OrNull: current1.pointer.pointerSha256, payload: { laneRef: 'lane.work.active', limit: 4 } });
    const snapshots = path.join(storeRoot, 'project-planning', projectPlanningRuntimeAddress(project.projectRef), 'snapshots');
    fs.rmSync(path.join(snapshots, `${first.planning.snapshot.semanticFingerprint}.json`));
    assert.throws(
      () => readProjectPlanningRuntime({ storeRoot, projectRef: project.projectRef }),
      (error) => error instanceof ProjectPlanningRuntimeError && error.code === 'PLANNING_RUNTIME_SNAPSHOT_MISSING',
    );
  } finally {
    fs.rmSync(storeRoot, { recursive: true, force: true });
  }
});

test('runtime fails closed when current pointer bytes are corrupted', () => {
  const storeRoot = tempRoot();
  try {
    const first = record(storeRoot, { n: 1 });
    const pointers = path.join(storeRoot, 'project-planning', projectPlanningRuntimeAddress(project.projectRef), 'pointers');
    const file = path.join(pointers, `${first.nextPointerSha256}.json`);
    fs.writeFileSync(file, '{"corrupt":true}', 'utf8');
    assert.throws(
      () => readProjectPlanningRuntime({ storeRoot, projectRef: project.projectRef }),
      (error) => error instanceof ProjectPlanningRuntimeError && error.code === 'PLANNING_RUNTIME_POINTER_CORRUPT',
    );
  } finally {
    fs.rmSync(storeRoot, { recursive: true, force: true });
  }
});

// [VXG RealForever][VEXWORK][PROJECT-PLANNING-RUNTIME]


test('runtime public inputs and store roots fail closed', () => {
  assert.throws(
    () => projectPlanningRuntimeAddress('bad project ref!'),
    (error) => error instanceof ProjectPlanningRuntimeError && error.code === 'PLANNING_RUNTIME_INPUT_INVALID',
  );
  assert.throws(
    () => readProjectPlanningRuntime({ storeRoot: path.join(os.tmpdir(), 'vexwork-planning-runtime-definitely-missing'), projectRef: project.projectRef }),
    (error) => error instanceof ProjectPlanningRuntimeError && error.code === 'PLANNING_RUNTIME_STORE_ROOT_INVALID',
  );
  const storeRoot = tempRoot();
  try {
    assert.throws(
      () => recoverProjectPlanningRuntimeWriter({ storeRoot, projectRef: project.projectRef, expectedLeaseSha256: 'not-a-digest' }),
      (error) => error instanceof ProjectPlanningRuntimeError && error.code === 'PLANNING_RUNTIME_INPUT_INVALID',
    );
    assert.throws(
      () => recordProjectPlanningRuntimeTransaction({
        storeRoot, project, graph, viewRefs, transaction: transaction({ n: 1 }), planningRegistry, workRegistry,
        expectedPointerSha256OrNull: null, instanceRef: 'instance.invalid-time', observedAt: 'not-a-time',
      }),
      (error) => error instanceof ProjectPlanningRuntimeError && error.code === 'PLANNING_RUNTIME_INPUT_INVALID',
    );
  } finally {
    fs.rmSync(storeRoot, { recursive: true, force: true });
  }
});

test('an abandoned writer blocks ordinary planning admission until explicit recovery', () => {
  const storeRoot = tempRoot();
  try {
    const exited = childProcess.spawnSync(process.execPath, ['-e', 'process.exit(0)']);
    assert.ok(Number.isSafeInteger(exited.pid) && exited.pid > 0);
    const abandoned = writeLease(storeRoot, { pid: exited.pid });
    assert.throws(
      () => record(storeRoot, { n: 1 }),
      (error) => error instanceof ProjectPlanningRuntimeError
        && error.code === 'PLANNING_RUNTIME_WRITER_RECOVERY_REQUIRED'
        && error.details.leaseSha256 === abandoned.leaseSha256,
    );
  } finally {
    fs.rmSync(storeRoot, { recursive: true, force: true });
  }
});

test('pointer store rejects unexpected entries and retained event tampering', () => {
  const storeRoot = tempRoot();
  try {
    const first = record(storeRoot, { n: 1 });
    const root = path.join(storeRoot, 'project-planning', projectPlanningRuntimeAddress(project.projectRef));
    const pointers = path.join(root, 'pointers');
    fs.writeFileSync(path.join(pointers, 'unexpected.txt'), '{}', 'utf8');
    assert.throws(
      () => readProjectPlanningRuntime({ storeRoot, projectRef: project.projectRef }),
      (error) => error instanceof ProjectPlanningRuntimeError && error.code === 'PLANNING_RUNTIME_POINTER_CORRUPT',
    );
    fs.rmSync(path.join(pointers, 'unexpected.txt'));

    const current1 = readProjectPlanningRuntime({ storeRoot, projectRef: project.projectRef });
    record(storeRoot, {
      n: 2,
      current: current1.snapshot,
      expectedPointerSha256OrNull: current1.pointer.pointerSha256,
      payload: { laneRef: 'lane.work.active', limit: 5 },
    });

    const eventFile = path.join(root, 'events', `000000000001-${first.planning.event.semanticFingerprint}.json`);
    const event = JSON.parse(fs.readFileSync(eventFile, 'utf8'));
    event.eventRef = 'event.runtime.tampered';
    fs.writeFileSync(eventFile, JSON.stringify(canonicalize(event)), 'utf8');
    assert.throws(
      () => readProjectPlanningRuntime({ storeRoot, projectRef: project.projectRef }),
      (error) => error instanceof ProjectPlanningRuntimeError && error.code === 'PLANNING_RUNTIME_EVENT_CORRUPT',
    );
  } finally {
    fs.rmSync(storeRoot, { recursive: true, force: true });
  }
});
