import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  createProjectAgencyPolicy,
  transitionHandshakeRequirement,
} from '../src/core/transition-handshake.mjs';
import {
  createWorkgraph,
} from '../src/core/workgraph.mjs';

const read = (relative) =>
  JSON.parse(
    fs.readFileSync(
      new URL(`../${relative}`, import.meta.url),
      'utf8',
    ),
  );

const registry = read('blueprint/work-registry.json');
const graph = createWorkgraph(
  read('workgraphs/public.json'),
  registry,
);
const policy = createProjectAgencyPolicy(
  read('projects/vexstream-mobile-library/agency.policy.json'),
  registry,
);

test('VexStream completion trajectory delegates routine TASK phase transitions', () => {
  assert.equal(
    policy.schemaVersion,
    'vexwork.project-agency-policy/v2',
  );

  const rediscovery =
    'work.vexstream.mobile-library.rediscovery';

  for (const [priorState, nextState] of [
    ['READY', 'RUNNING'],
    ['RUNNING', 'VERIFYING'],
    ['VERIFYING', 'COMPLETED'],
  ]) {
    assert.equal(
      transitionHandshakeRequirement({
        policy,
        priorState,
        nextState,
        registry,
        graph,
        workRef: rediscovery,
      }).required,
      false,
    );
  }
});

test('VexStream keeps human handshake for meaningful outcomes and Clear Data lived proof', () => {
  for (const workRef of [
    'work.vexstream.mobile-library.outcome',
    'work.vexstream.mobile-library.clear-data-proof',
  ]) {
    for (const [priorState, nextState] of [
      ['READY', 'RUNNING'],
      ['RUNNING', 'VERIFYING'],
      ['VERIFYING', 'COMPLETED'],
    ]) {
      assert.equal(
        transitionHandshakeRequirement({
          policy,
          priorState,
          nextState,
          registry,
          graph,
          workRef,
        }).required,
        true,
      );
    }
  }
});

test('delegation does not activate parked no-authority work', () => {
  const keepOffline =
    graph.items.find(
      (candidate) =>
        candidate.workRef ===
        'work.vexstream.mobile-library.keep-offline-sync',
    );

  assert.ok(keepOffline);
  assert.equal(
    keepOffline.authorityDisposition,
    'NO_AUTHORITY',
  );
  assert.equal(
    keepOffline.effectDisposition,
    'NO_EFFECTS',
  );
});
