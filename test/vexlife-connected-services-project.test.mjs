import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { createProject, createWorkgraph, childRefs, projectWorkRefs } from '../src/core/workgraph.mjs';
import { createBoardView, projectParkingLot, projectWorkBoard } from '../src/core/work-board.mjs';

const read = (relative) => JSON.parse(fs.readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8'));
const registry = read('blueprint/work-registry.json');
const graph = createWorkgraph(read('workgraphs/public.json'), registry);
const project = createProject(read('projects/vexlife-connected-services/project.json'));
const view = createBoardView(read('projects/vexlife-connected-services/board.view.json'), registry);

test('Connected Services Project preserves program and VCS-04 phase topology', () => {
  const refs = projectWorkRefs(project, graph);
  assert.equal(refs.length, 17);
  assert.equal(refs.includes('work.vexlife.connected-services.outcome'), true);
  assert.equal(refs.includes('work.vexlife.connected-services.vcs04-conversation-adoption'), true);
  assert.equal(refs.includes('work.vexlife.connected-services.vcs04.phase1.private-serve-ingress'), true);
  assert.equal(refs.includes('work.vexlife.connected-services.guided-onboarding'), false);

  assert.deepEqual(childRefs(graph, 'work.vexlife.connected-services.outcome'), [
    'work.vexlife.connected-services.vcs00-maps-home-admission',
    'work.vexlife.connected-services.vcs01-consumer-comparison',
    'work.vexlife.connected-services.vcs02-shared-contract',
    'work.vexlife.connected-services.vcs03-maps-engine',
    'work.vexlife.connected-services.vcs04-conversation-adoption',
    'work.vexlife.connected-services.vcs05-stream-stress',
    'work.vexlife.connected-services.vcs06-architecture-extraction',
    'work.vexlife.connected-services.vcs07-deployment-choices',
  ]);
  assert.deepEqual(childRefs(graph, 'work.vexlife.connected-services.vcs04-conversation-adoption'), [
    'work.vexlife.connected-services.vcs04.phase1-prechallenge',
    'work.vexlife.connected-services.vcs04.phase2-fixture-l1-l5',
    'work.vexlife.connected-services.vcs04.phase3-fresh-user-family',
    'work.vexlife.connected-services.vcs04.phase4-send-companion',
    'work.vexlife.connected-services.vcs04.phase5-restart-no-duplicates',
    'work.vexlife.connected-services.vcs04.phase6-terminal-currentness',
  ]);
});

test('Connected Services Board makes completed, current and held phases visible without adopting onboarding', () => {
  const board = projectWorkBoard({ project, graph, view, registry });
  const active = board.lanes.find((lane) => lane.laneRef === 'lane.work.active');
  const planned = board.lanes.find((lane) => lane.laneRef === 'lane.work.planned');
  const done = board.lanes.find((lane) => lane.laneRef === 'lane.work.done');
  const verify = board.lanes.find((lane) => lane.laneRef === 'lane.work.verify');

  assert.equal(board.lanes.flatMap((lane) => lane.cards).length, 17);
  assert.equal(active.cards.length, 2);
  assert.equal(planned.cards.length, 7);
  assert.equal(done.cards.length, 7);
  assert.equal(active.cards.some((card) => card.workRef === 'work.vexlife.connected-services.vcs04-conversation-adoption'), true);
  assert.equal(done.cards.some((card) => card.workRef === 'work.vexlife.connected-services.vcs04.phase1.private-serve-ingress'), true);
  assert.equal(done.cards.some((card) => card.workRef === 'work.vexlife.connected-services.vcs04.phase1-prechallenge'), true);
  assert.equal(verify.cards.some((card) => card.workRef === 'work.vexlife.connected-services.vcs04.phase2-fixture-l1-l5'), true);
  assert.equal(done.cards.some((card) => card.workRef === 'work.vexlife.connected-services.vcs04.phase1.android-observability-source'), true);

  const lot = projectParkingLot({ graph, registry });
  const onboarding = lot.items.find((item) => item.workRef === 'work.vexlife.connected-services.guided-onboarding');
  assert.ok(onboarding);
  assert.equal(onboarding.workDisposition, 'PARKED');
  assert.equal(onboarding.authorityDisposition, 'NO_AUTHORITY');
  assert.equal(onboarding.effectDisposition, 'NO_EFFECTS');
});
