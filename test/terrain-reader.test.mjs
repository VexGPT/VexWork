import assert from 'node:assert/strict';
import test from 'node:test';
import {
  RELATIONSHIP,
  clusterJourney,
  createTerrainSession,
  planTerrainRoute,
  structuralPath,
  terrainNeighborhood,
} from '../terrain-reader.js';

const item = (workRef, parentWorkRefOrNull, childWorkRefs = [], dependencyRefs = [], state = 'READY') => ({
  workRef,
  label: workRef,
  purpose: workRef,
  workClass: workRef.endsWith('.root') ? 'OUTCOME' : 'TASK',
  state,
  workDisposition: 'ACTIVE',
  priorityClass: 'NORMAL',
  parentWorkRefOrNull,
  childWorkRefs,
  dependencyRefs,
  repositoryRefs: [],
  sourceRefs: [],
  formationProcessRefOrNull: null,
  nextProcessRefs: [],
  authorityDisposition: 'AUTHORIZED_BOUNDED',
  effectDisposition: 'EFFECTS_BOUND',
  createdAt: '2026-10-22T00:00:00.000Z',
  updatedAt: '2026-10-22T00:00:00.000Z',
  transitionHistory: [],
});

const project = (ref, roots, items) => ({
  project: { projectRef: ref, label: ref, purpose: ref, rootWorkRefs: roots, repositoryRefs: [], sourceRefs: [], formedAt: '2026-10-22T00:00:00.000Z' },
  graphRef: 'workgraph.demo',
  viewRef: `view.${ref}`,
  items,
  lanes: [],
  summary: { workItemCount: items.length, openWorkItemCount: items.length, outcomeCount: 1, taskCount: items.length - 1, defectCount: 0, potentialCount: 0, needsHumanCount: 0, completedCount: 0 },
  rootItems: items.filter((entry) => roots.includes(entry.workRef)),
});

const aRoot = item('work.a.root', null, ['work.a.child']);
const aChild = item('work.a.child', 'work.a.root', [], ['work.b.child'], 'RUNNING');
const bRoot = item('work.b.root', null, ['work.b.child']);
const bChild = item('work.b.child', 'work.b.root', [], ['work.a.child'], 'WAITING_HUMAN');
const workspace = {
  schemaVersion: 'vexwork.public-workspace/v1',
  projects: [project('project.a', ['work.a.root'], [aRoot, aChild]), project('project.b', ['work.b.root'], [bRoot, bChild])],
  parkingLot: { items: [] },
  effects: false,
  executionAuthority: 'NONE',
};

test('structural path and relational neighborhood stay distinct', () => {
  assert.deepEqual(structuralPath(workspace, 'work:project.a:work.a.child').map((node) => node.semanticRef), [
    'workspace.vexwork', 'project.a', 'work.a.root', 'work.a.child',
  ]);
  const neighborhood = terrainNeighborhood(workspace, 'work:project.a:work.a.child');
  const dep = neighborhood.neighbors.find((entry) => entry.node.semanticRef === 'work.b.child');
  assert.ok(dep.relationshipKinds.includes(RELATIONSHIP.DEPENDS_ON));
  assert.equal(dep.node.projectRef, 'project.b');
});

test('route planning terminates safely across cyclic dependency topology', () => {
  const route = planTerrainRoute(workspace, 'work:project.a:work.a.child', 'work:project.b:work.b.child');
  assert.ok(route.steps.length >= 1);
  assert.ok(route.visitedNodeCount <= 6);
});

test('exact command duplicate is idempotent while divergent reuse conflicts', async () => {
  const session = createTerrainSession({ workspace });
  const target = 'project:project.a';
  const first = await session.navigate(target, RELATIONSHIP.PROJECT, { commandRef: 'command.same' });
  assert.equal(first.state, 'COMMITTED');
  const duplicate = await session.navigate(target, RELATIONSHIP.PROJECT, { commandRef: 'command.same' });
  assert.equal(duplicate.state, 'DUPLICATE_EXACT_NOOP');
  const conflict = await session.navigate('project:project.b', RELATIONSHIP.PROJECT, { commandRef: 'command.same' });
  assert.equal(conflict.state, 'DIVERGENT_COMMAND_IDENTITY');
});

test('semantic movement rejects invented edges while explicit search remains a portal', async () => {
  const session = createTerrainSession({ workspace });
  const invented = await session.navigate('work:project.a:work.a.root', RELATIONSHIP.CONTAINS, { commandRef: 'command.invented-edge' });
  assert.equal(invented.state, 'BLOCKED_NO_VISIBLE_ROUTE');
  assert.equal(session.currentFrame().focus.nodeKey, 'workspace:vexwork');
  assert.equal(session.journey().length, 0);

  const search = await session.navigate('work:project.a:work.a.root', RELATIONSHIP.SEARCH_PORTAL, { commandRef: 'command.search-portal', actionRef: 'action.terrain.search-portal' });
  assert.equal(search.state, 'COMMITTED');
  assert.equal(session.currentFrame().focus.nodeKey, 'work:project.a:work.a.root');
});

test('back participates in the same serialized idempotent command stream', async () => {
  const session = createTerrainSession({ workspace });
  await session.navigate('project:project.a', RELATIONSHIP.PROJECT);
  await session.navigate('work:project.a:work.a.root', RELATIONSHIP.PROJECT_ROOT);
  const [first, duplicate] = await Promise.all([
    session.back({ commandRef: 'command.back.same' }),
    session.back({ commandRef: 'command.back.same' }),
  ]);
  assert.equal(first.state, 'COMMITTED');
  assert.equal(duplicate.state, 'DUPLICATE_EXACT_NOOP');
  assert.equal(session.currentFrame().focus.nodeKey, 'project:project.a');
});

test('direct revisit relation cannot manufacture history', async () => {
  const session = createTerrainSession({ workspace });
  const forged = await session.navigate('project:project.a', RELATIONSHIP.REVISIT, {
    commandRef: 'command.forged-revisit',
    actionRef: 'action.terrain.revisit',
  });
  assert.equal(forged.state, 'BLOCKED_NO_VISIBLE_ROUTE');
  assert.equal(session.journey().length, 0);
});

test('journey preserves meaningful revisits but suppresses same-current travel', async () => {
  const session = createTerrainSession({ workspace });
  await session.navigate('project:project.a', RELATIONSHIP.PROJECT);
  await session.navigate('work:project.a:work.a.root', RELATIONSHIP.PROJECT_ROOT);
  await session.navigate('project:project.a', RELATIONSHIP.PARENT);
  assert.equal(session.journey().length, 3, 'A -> B -> A remains real history');
  const already = await session.navigate('project:project.a', RELATIONSHIP.PARENT);
  assert.equal(already.state, 'ALREADY_PRESENT');
  assert.equal(session.journey().length, 3);
});

test('history inspection does not mutate current frame; explicit revisit does', async () => {
  const session = createTerrainSession({ workspace });
  await session.navigate('project:project.a', RELATIONSHIP.PROJECT);
  await session.navigate('work:project.a:work.a.root', RELATIONSHIP.PROJECT_ROOT);
  const currentBefore = session.currentFrame().focus.nodeKey;
  const inspection = session.inspectHistory(0);
  assert.equal(session.currentFrame().focus.nodeKey, currentBefore);
  assert.equal(inspection.browsingHistory, true);
  const revisit = await session.revisit(0);
  assert.equal(revisit.state, 'COMMITTED');
  assert.equal(session.currentFrame().focus.nodeKey, 'project:project.a');
  assert.equal(session.journey().at(-1).relationshipKind, RELATIONSHIP.REVISIT);
});

test('visual clustering compresses adjacent repetition without deleting journey history', () => {
  const frameA = { focus: { nodeKey: 'a' }, projectRefOrNull: null, workRefOrNull: null };
  const frameB = { focus: { nodeKey: 'b' }, projectRefOrNull: null, workRefOrNull: null };
  const events = [
    { after: frameA, relationshipKind: RELATIONSHIP.PROJECT },
    { after: frameA, relationshipKind: RELATIONSHIP.CONTAINS },
    { after: frameB, relationshipKind: RELATIONSHIP.CONTAINS },
    { after: frameA, relationshipKind: RELATIONSHIP.REVISIT },
  ];
  const clusters = clusterJourney(events);
  assert.equal(clusters.length, 3);
  assert.equal(clusters[0].count, 2);
  assert.equal(events.length, 4);
});