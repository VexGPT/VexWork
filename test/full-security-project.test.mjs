import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import * as Reader from '../vexboard-reader.js';
import { normalizeBoardSourceCatalog, resolveBoardSource } from '../src/shared/vexboard-source-resolver.mjs';
import { createWorkgraphSegment } from '../src/core/workgraph-composition.mjs';
import { createProject } from '../src/core/workgraph.mjs';

const read = (relative) => JSON.parse(fs.readFileSync(new URL('../' + relative, import.meta.url), 'utf8'));
const registry = read('blueprint/work-registry.json');
const project = read('projects/full-security/project.json');
const segment = read('workgraphs/segments/full-security.json');
const catalog = normalizeBoardSourceCatalog(read('projects/vexboard/examples/board-source-catalog.json'));

const boardPaths = {
  overview: 'projects/vexboard/examples/full-security-overview.board.json',
  vexstream: 'projects/vexboard/examples/full-security-vexstream-local-pairing.board.json',
  complex: 'projects/vexboard/examples/full-security-vexlife-complex-demonstrator.board.json',
  androidScenarios: 'projects/vexboard/examples/full-security-android-account-device-scenarios.board.json',
};

test('Full Security source preserves demonstrator meaning without granting product authority', () => {
  const acceptedProject = createProject(project);
  const acceptedSegment = createWorkgraphSegment(segment, registry);

  assert.equal(acceptedProject.projectRef, 'project.full-security');
  assert.equal(acceptedProject.label, 'Full Security');
  assert.deepEqual(acceptedProject.rootWorkRefs, ['work.full-security.outcome']);

  assert.equal(
    acceptedSegment.items.every((item) =>
      item.authorityDisposition === 'NO_AUTHORITY' &&
      item.effectDisposition === 'NO_EFFECTS'
    ),
    true,
  );

  const complexWork = acceptedSegment.items.find(
    (item) => item.workRef === 'work.full-security.vexlife-complex-demonstrator',
  );
  assert.equal(complexWork?.state, 'DECOMPOSED');

  const discoverability = acceptedSegment.items.find(
    (item) => item.workRef === 'work.full-security.discoverability',
  );
  assert.equal(discoverability?.state, 'WAITING_RESOURCE');

  const scenarios = acceptedSegment.items.find(
    (item) => item.workRef === 'work.full-security.android-account-device-scenarios',
  );
  assert.equal(scenarios?.state, 'DECOMPOSED');

  const connectedDevices = acceptedSegment.items.find(
    (item) => item.workRef === 'work.full-security.android-connected-devices-feature',
  );
  assert.equal(connectedDevices?.state, 'DECOMPOSED');

  const patterns = acceptedSegment.items.find(
    (item) => item.workRef === 'work.full-security.candidate-security-relationship-patterns',
  );
  assert.equal(patterns?.state, 'RUNNING');
});

test('Full Security boards resolve and preserve real-vs-demonstrator separation', async () => {
  for (const [name, path] of Object.entries(boardPaths)) {
    const draft = Reader.normalizeDraft(read(path));
    await Reader.hydrateBoardState(draft.graph, draft.projection);
    const resolved = resolveBoardSource(draft.draftRef, [catalog]);
    assert.ok(resolved, `${name} board must resolve from the source catalog`);
  }

  const overview = Reader.normalizeDraft(read(boardPaths.overview));
  const vexstream = Reader.normalizeDraft(read(boardPaths.vexstream));
  const complex = Reader.normalizeDraft(read(boardPaths.complex));

  const overviewPortals = overview.graph.nodes
    .filter((node) => node.kind === 'PORTAL')
    .map((node) => node.detailBoardRefOrNull);
  assert.ok(overviewPortals.includes('board.vexboard.security-boundary-atlas.template'));
  assert.ok(overviewPortals.includes('board.full-security.vexstream-local-pairing'));
  assert.ok(overviewPortals.includes('board.full-security.vexlife-complex-demonstrator'));

  assert.ok(
    vexstream.graph.nodes.some((node) =>
      node.label.includes('CURRENT REAL SPECIMEN')
    ),
  );
  assert.ok(
    vexstream.graph.nodes.some((node) =>
      node.label.includes('loopback-only')
    ),
  );
  assert.ok(
    vexstream.graph.nodes.some((node) =>
      node.label.includes('Keystore-encrypted bearer')
    ),
  );
  assert.ok(
    vexstream.graph.nodes.some((node) =>
      node.label.includes('TRANSPORT SUCCESS != VERIFIED MEDIA')
    ),
  );

  assert.ok(
    complex.graph.nodes.some((node) =>
      node.label.includes('DESIRED / SYNTHETIC DEMONSTRATOR')
    ),
  );
  assert.ok(
    complex.graph.nodes.some((node) => node.nodeRef === 'reference.fs.cx.phone-a'),
  );
  assert.ok(
    complex.graph.nodes.some((node) => node.nodeRef === 'reference.fs.cx.phone-b'),
  );
  assert.ok(
    complex.graph.nodes.some((node) =>
      node.label.includes('DEMONSTRATION_STATE != AUTHORITY_STATE')
    ),
  );
  assert.ok(
    complex.graph.nodes.some((node) =>
      node.label.includes('does not remotely serve the entire topology')
    ),
  );

  const androidScenarios = Reader.normalizeDraft(read(boardPaths.androidScenarios));
  const scenarioLabels = androidScenarios.graph.nodes
    .filter((node) => node.nodeRef.startsWith('process.fs.sc.s'))
    .map((node) => node.label);
  assert.equal(scenarioLabels.length, 20);
  assert.ok(scenarioLabels.some((label) => label.startsWith('S07 · Revoke Device B')));
  assert.ok(scenarioLabels.some((label) => label.startsWith('S15 · Backup / restore')));
  assert.ok(
    androidScenarios.graph.nodes.some(
      (node) =>
        node.nodeRef === 'reference.fs.sc.connected-devices' &&
        node.label.includes('Connected Devices'),
    ),
  );
  assert.ok(
    androidScenarios.graph.nodes.some(
      (node) =>
        node.nodeRef === 'reference.fs.sc.p5' &&
        node.label.startsWith('Revocation'),
    ),
  );
});
