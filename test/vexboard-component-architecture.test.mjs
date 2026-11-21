import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  candidatesByClass,
  candidatesForSourceFamily,
  normalizeComponentArchitectureCatalog,
  searchComponentArchitecture,
  targetPressuresForCandidate,
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
  assert.equal(catalog.targetPressures.length, 3);
  assert.equal(catalog.targetPressures.every((row) => row.state === 'REFERENCE_COMPATIBILITY_PASS'), true);
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

test('target pressure results preserve mapped, held and platform-specific truth separately from portable acceptance', () => {
  const repeater = targetPressuresForCandidate(catalog, 'candidate.component.stable-repeater');
  assert.equal(repeater.length, 1);
  assert.equal(repeater[0].framework, 'SwiftUI');
  assert.ok(repeater[0].relationships.some((row) => row.relationRef.endsWith('item-identity') && row.disposition === 'MAPPED'));
  assert.ok(repeater[0].relationships.some((row) => row.relationRef.endsWith('visible-item-projection') && row.disposition === 'HELD'));
  assert.ok(repeater[0].relationships.some((row) => row.relationRef.endsWith('content-type-hint') && row.disposition === 'PLATFORM_SPECIFIC'));
  assert.ok(repeater[0].proofs.some((row) => row.proofRef === 'proof.apple-swiftui-sdk' && row.state === 'OWED'));

  const frame = targetPressuresForCandidate(catalog, 'candidate.component.frame-region-layout');
  assert.equal(frame[0].commit, 'befe31789834a74f5a2738cb6d6028c01aa7553c');
  assert.ok(frame[0].relationships.some((row) => row.relationRef.endsWith('partial-multi-seam') && row.disposition === 'HELD'));

  const swappable = targetPressuresForCandidate(catalog, 'candidate.component.swappable-region');
  assert.equal(swappable[0].state, 'HELD_SOURCE_CONTRACT');
  assert.ok(swappable[0].relationships.every((row) => row.disposition === 'HELD'));
  assert.ok(swappable[0].proofs.some((row) => row.proofRef === 'proof.vexlife-prod-selection-contract' && row.state === 'HELD'));

  assert.deepEqual(targetPressuresForCandidate(catalog, 'candidate.component.context-dock'), []);
  assert.throws(() => targetPressuresForCandidate(catalog, 'candidate.component.missing'), /unknown candidate/);
});

test('architecture search finds source evidence and cross-platform pressure', () => {
  assert.ok(searchComponentArchitecture(catalog, 'SwiftUI').length > 0);
  assert.ok(searchComponentArchitecture(catalog, 'VexStableLazyColumn').some((row) => row.candidateRef === 'candidate.component.stable-repeater'));
  assert.ok(searchComponentArchitecture(catalog, 'VexStableConversationTimeline').some((row) => row.candidateRef === 'candidate.component.stable-repeater'));
  assert.ok(searchComponentArchitecture(catalog, 'Action Vessel').some((row) => row.candidateRef === 'candidate.component.action-vessel'));
  assert.ok(searchComponentArchitecture(catalog, 'SwiftUI Menu').some((row) => row.candidateRef === 'candidate.component.adaptive-action-group'));
  assert.ok(searchComponentArchitecture(catalog, 'partial-multi-seam').some((row) => row.candidateRef === 'candidate.component.frame-region-layout'));
  assert.ok(searchComponentArchitecture(catalog, 'apple-swiftui-sdk').some((row) => row.candidateRef === 'candidate.component.stable-repeater'));
  assert.deepEqual(searchComponentArchitecture(catalog, ''), []);
});

// [VXG RealForever][VEXWORK][COMPONENT-LIBRARY][ARCHITECTURE-CATALOG-TEST]
