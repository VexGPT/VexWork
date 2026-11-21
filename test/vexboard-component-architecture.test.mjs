import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  candidatesByClass,
  candidatesForSourceFamily,
  normalizeComponentArchitectureCatalog,
  searchComponentArchitecture,
} from '../src/shared/vexboard-component-architecture.mjs';

const catalog = normalizeComponentArchitectureCatalog(JSON.parse(fs.readFileSync(
  new URL('../projects/component-library-architecture/component-architecture-catalog.json', import.meta.url),
  'utf8',
)));

test('component architecture catalog keeps source influence distinct from portable acceptance', () => {
  assert.equal(catalog.schemaVersion, 'vexboard.component-architecture-catalog/v1');
  assert.equal(catalog.candidates.length, 12);
  assert.equal(catalog.candidates.every((row) => ['SOURCE_INFLUENCED', 'PORTABLE_CANDIDATE', 'ACCEPTED_PORTABLE', 'PLATFORM_SPECIFIC', 'HELD'].includes(row.state)), true);
  assert.equal(catalog.candidates.some((row) => row.state === 'ACCEPTED_PORTABLE'), false);
});

test('architecture candidates preserve the richer relationship layer above source widget kinds', () => {
  assert.ok(catalog.candidates.find((row) => row.candidateRef === 'candidate.component.stable-repeater'));
  assert.ok(catalog.candidates.find((row) => row.candidateRef === 'candidate.component.context-dock'));
  assert.ok(catalog.candidates.find((row) => row.candidateRef === 'candidate.component.frame-region-layout'));
  assert.ok(catalog.candidates.find((row) => row.candidateRef === 'candidate.component.action-vessel'));
  assert.ok(catalog.candidates.find((row) => row.candidateRef === 'candidate.component.adaptive-action-group'));
  assert.equal(candidatesByClass(catalog, 'PRESENTATION').length >= 4, true);
});

test('source families can point upward to architecture candidates without becoming the same identity', () => {
  const dialog = candidatesForSourceFamily(catalog, 'component.source-family.vexlife-android.dialog');
  assert.deepEqual(dialog.map((row) => row.candidateRef), ['candidate.component.modal-presentation']);

  const button = candidatesForSourceFamily(catalog, 'component.source-family.vexlife-android.button');
  assert.ok(button.some((row) => row.candidateRef === 'candidate.component.semantic-control-binding'));
  assert.equal(button.every((row) => row.candidateRef !== 'component.source-family.vexlife-android.button'), true);
});

test('architecture search finds source evidence and cross-platform pressure', () => {
  assert.ok(searchComponentArchitecture(catalog, 'SwiftUI').length > 0);
  assert.ok(searchComponentArchitecture(catalog, 'VexStableLazyColumn').some((row) => row.candidateRef === 'candidate.component.stable-repeater'));
  assert.ok(searchComponentArchitecture(catalog, 'Action Vessel').some((row) => row.candidateRef === 'candidate.component.action-vessel'));
  assert.ok(searchComponentArchitecture(catalog, 'SwiftUI Menu').some((row) => row.candidateRef === 'candidate.component.adaptive-action-group'));
  assert.deepEqual(searchComponentArchitecture(catalog, ''), []);
});

// [VXG RealForever][VEXWORK][COMPONENT-LIBRARY][ARCHITECTURE-CATALOG-TEST]
