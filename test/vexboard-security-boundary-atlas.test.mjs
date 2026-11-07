import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import * as Reader from '../vexboard-reader.js';
import {
  normalizeBoardSourceCatalog,
  resolveBoardSource,
} from '../src/shared/vexboard-source-resolver.mjs';

const ROOT_PATH = new URL(
  '../projects/vexboard/examples/security-boundary-atlas.board.json',
  import.meta.url,
);
const DETAIL_PATH = new URL(
  '../projects/vexboard/examples/security-boundary-credential-custody.board.json',
  import.meta.url,
);
const CATALOG_PATH = new URL(
  '../projects/vexboard/examples/board-source-catalog.json',
  import.meta.url,
);

function readJson(url) {
  return JSON.parse(fs.readFileSync(url, 'utf8'));
}

test('Security Boundary Atlas is a valid recursive VexBoard source example', async () => {
  const root = Reader.normalizeDraft(readJson(ROOT_PATH));
  const detail = Reader.normalizeDraft(readJson(DETAIL_PATH));

  assert.equal(root.mode, 'READ_ONLY_SOURCE');
  assert.equal(detail.mode, 'READ_ONLY_SOURCE');

  const rootState = await Reader.hydrateBoardState(root.graph, root.projection);
  const detailState = await Reader.hydrateBoardState(detail.graph, detail.projection);

  const portal = rootState.graph.nodes.find(
    (candidate) => candidate.nodeRef === 'portal.security.credential-custody',
  );
  assert.equal(
    portal?.detailBoardRefOrNull,
    'board.vexboard.security-boundary-atlas.credential-custody',
  );

  const boundaryLabels = rootState.graph.nodes
    .filter((candidate) => candidate.nodeRef.startsWith('reference.security.'))
    .map((candidate) => candidate.label);
  for (const required of [
    'Identity / trust',
    'Authority / effect',
    'Secrets / sensitive data',
    'Network / provider',
    'Model / context / memory / tool',
    'Build / release / update',
    'Recovery / replay',
    'Evidence / observability',
  ]) {
    assert.ok(
      boundaryLabels.some((label) => label.startsWith(required)),
      `missing boundary family: ${required}`,
    );
  }

  const templateSteps = rootState.graph.nodes
    .filter((candidate) => candidate.nodeRef.startsWith('process.security.template.'))
    .map((candidate) => candidate.label);
  assert.equal(templateSteps.length, 6);
  assert.ok(templateSteps.some((label) => label.includes('What must NOT cross')));
  assert.ok(templateSteps.some((label) => label.includes('What evidence')));

  const platformLabels = detailState.graph.nodes
    .filter((candidate) => candidate.parentRefOrNull === 'node.credential.platforms')
    .map((candidate) => candidate.label);
  for (const platform of ['Android example', 'Apple example', 'Web example', 'Backend / cloud example', 'Firmware / device example']) {
    assert.ok(
      platformLabels.some((label) => label.startsWith(platform)),
      `missing platform realization: ${platform}`,
    );
  }

  const android = detailState.graph.nodes.find(
    (candidate) => candidate.nodeRef === 'reference.credential.android',
  );
  assert.ok(
    android.sourceRefs.includes(
      'repo.vexlife-android:app/src/main/kotlin/com/vextreme/vexlife/android/connectedservices/VexHomeDevicePossession.kt',
    ),
  );

  assert.ok(
    detailState.graph.nodes.some(
      (candidate) =>
        candidate.nodeRef === 'annotation.credential.possession-not-authority' &&
        candidate.label.includes('does not automatically grant'),
    ),
  );
});

test('Security Boundary Atlas root and detail boards resolve from the source catalog', () => {
  const catalog = normalizeBoardSourceCatalog(readJson(CATALOG_PATH));

  const root = resolveBoardSource(
    'board.vexboard.security-boundary-atlas.template',
    [catalog],
  );
  assert.equal(root?.location, './security-boundary-atlas.board.json');

  const detail = resolveBoardSource(
    'board.vexboard.security-boundary-atlas.credential-custody',
    [catalog],
  );
  assert.equal(
    detail?.location,
    './security-boundary-credential-custody.board.json',
  );
});
