import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (relative) =>
  JSON.parse(fs.readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8'));
const readText = (relative) =>
  fs.readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8');

const project = read('projects/vexlife-self-inspection/project.json');
const segment = read('workgraphs/segments/vexlife-self-inspection.json');
const graph = read('workgraphs/public.json');
const workspace = read('public/workspace.json');
const dashboard = read('public/work-dashboard.json');
const readme = readText('projects/vexlife-self-inspection/README.md');

const byRef = new Map(segment.items.map((item) => [item.workRef, item]));

test('Self-Inspection remains released and resumes at context residency rather than formation parking', () => {
  assert.equal(project.projectRef, 'project.vexlife.self-inspection');
  assert.match(readme, /Current disposition — released \/ active \/ gate 3\.2 source-held/);
  assert.doesNotMatch(readme, /This Project is deliberately PAUSED_AT_CHECKPOINT/);

  assert.equal(byRef.get('work.vexlife.self-inspection.outcome').state, 'RUNNING');
  assert.equal(byRef.get('work.vexlife.self-inspection.a0-current-body-inventory').state, 'COMPLETED');
  assert.equal(byRef.get('work.vexlife.self-inspection.a1-self-blueprint').state, 'PAUSED_AT_CHECKPOINT');
  assert.equal(byRef.get('work.vexlife.self-inspection.a2-working-focus').state, 'COMPLETED');
  assert.equal(byRef.get('work.vexlife.self-inspection.a3-context-residency').state, 'RUNNING');
  assert.equal(byRef.get('work.vexlife.self-inspection.a4-self-capability').state, 'WAITING_DEPENDENCIES');
});

test('released bounded authority is source-visible without widening ownership', () => {
  for (const item of segment.items) {
    assert.equal(item.workDisposition, 'ACTIVE');
    assert.equal(item.authorityDisposition, 'AUTHORIZED_BOUNDED');
    assert.equal(item.effectDisposition, 'EFFECTS_BOUND');
    assert.ok(item.sourceRefs.includes('github.pull.vexwork.449.comment.7227856833'));
  }

  assert.deepEqual(
    byRef.get('work.vexlife.self-inspection.a2-working-focus').dependencyRefs,
    ['work.vexlife.self-inspection.a0-current-body-inventory'],
  );
  assert.deepEqual(
    byRef.get('work.vexlife.self-inspection.a4-self-capability').dependencyRefs,
    ['work.vexlife.self-inspection.a3-context-residency'],
  );
});

test('public projections agree with the authored Self-Inspection segment and do not park active work', () => {
  const publicByRef = new Map(
    graph.items
      .filter((item) => item.workRef.startsWith('work.vexlife.self-inspection'))
      .map((item) => [item.workRef, item]),
  );
  assert.equal(publicByRef.size, segment.items.length);

  for (const item of segment.items) {
    const projected = publicByRef.get(item.workRef);
    assert.ok(projected, item.workRef);
    assert.equal(projected.state, item.state);
    assert.equal(projected.workDisposition, item.workDisposition);
    assert.equal(projected.authorityDisposition, item.authorityDisposition);
    assert.equal(projected.effectDisposition, item.effectDisposition);
  }

  const workspaceProject = workspace.projects.find(
    (entry) => entry.project.projectRef === 'project.vexlife.self-inspection',
  );
  assert.ok(workspaceProject);
  assert.equal(workspaceProject.items.length, segment.items.length);
  assert.equal(
    workspace.parkingLot.items.some((item) =>
      item.workRef.startsWith('work.vexlife.self-inspection')),
    false,
  );
  assert.equal(
    dashboard.parkingLot.items.some((item) =>
      item.workRef.startsWith('work.vexlife.self-inspection')),
    false,
  );
});

// [VXG RealForever][SELF-INSPECTION][CURRENTNESS]
