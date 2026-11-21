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
  assert.equal(catalog.candidates.filter((row) => row.state === 'ACCEPTED_PORTABLE').length, 5);
  assert.equal(catalog.targetPressures.length, 14);
  assert.equal(catalog.targetPressures.filter((row) => row.state === 'REFERENCE_COMPATIBILITY_PASS').length, 6);
  assert.equal(catalog.targetPressures.filter((row) => row.state === 'SOURCE_FORMED').length, 7);
  assert.equal(catalog.targetPressures.filter((row) => row.state === 'HELD_SOURCE_CONTRACT').length, 1);
  assert.equal(catalog.candidates.filter((row) => row.formation).length, 6);
  assert.equal(catalog.candidates.filter((row) => row.formation?.state === 'ACCEPTED').length, 5);
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

test('A3 formation distinguishes reused typed laws from genuinely new relationship candidates', () => {
  const formed = catalog.candidates.filter((row) => row.formation);
  assert.equal(formed.length, 6);

  const reused = formed
    .filter((row) => row.formation.kind === 'REUSE_OR_GENERALIZE_EXISTING_TYPED_RELATIONSHIP')
    .map((row) => row.candidateRef)
    .sort();
  assert.deepEqual(reused, [
    'candidate.component.frame-region-layout',
    'candidate.component.identity-addressed-tree',
    'candidate.component.semantic-control-binding',
    'candidate.component.typed-containment',
  ]);

  const newTyped = formed
    .filter((row) => row.formation.kind === 'NEW_TYPED_RELATIONSHIP_CANDIDATE')
    .map((row) => row.candidateRef)
    .sort();
  assert.deepEqual(newTyped, [
    'candidate.component.stable-repeater',
    'candidate.component.swappable-region',
  ]);

  for (const candidate of formed) {
    assert.ok(['FORMATION', 'ACCEPTED'].includes(candidate.formation.state));
    assert.equal(candidate.formation.state === 'ACCEPTED', candidate.state === 'ACCEPTED_PORTABLE');
    assert.ok(candidate.formation.sourceOwnerRefs.length > 0);
    assert.ok(candidate.formation.portableFields.length > 0);
    assert.ok(candidate.formation.nonOwnership.length > 0);
    assert.ok(candidate.formation.targetObligations.length > 0);
    assert.ok(candidate.formation.acceptanceProofs.length > 0);
  }

    const selection = catalog.candidates.find((row) => row.candidateRef === 'candidate.component.swappable-region');
  assert.ok(selection.formation.portableFields.includes('choiceCoverage: explicit EXHAUSTIVE / BOUNDED / UNKNOWN coverage of the declared choice set'));
  assert.equal(selection.formation.portableFields.some((field) => field.startsWith('exhaustive:')), false);

assert.equal(
    catalog.candidates.find((row) => row.candidateRef === 'candidate.component.modal-presentation').formation,
    null,
  );
  assert.equal(
    catalog.candidates.find((row) => row.candidateRef === 'candidate.component.context-dock').formation,
    null,
  );

  const acceptedFrame = catalog.candidates.find((row) => row.candidateRef === 'candidate.component.frame-region-layout');
  assert.equal(acceptedFrame.state, 'ACCEPTED_PORTABLE');
  assert.equal(acceptedFrame.formation.state, 'ACCEPTED');
  assert.ok(acceptedFrame.sourceEvidence.some((row) => row.path.endsWith('VexWebSpatialScalabilityTest.kt')));
  assert.ok(acceptedFrame.sourceEvidence.some((row) => row.path.endsWith('VexWebArtifactsTest.kt')));

  const acceptedIdentity = catalog.candidates.find((row) => row.candidateRef === 'candidate.component.identity-addressed-tree');
  assert.equal(acceptedIdentity.state, 'ACCEPTED_PORTABLE');
  assert.equal(acceptedIdentity.formation.state, 'ACCEPTED');
  assert.ok(acceptedIdentity.sourceEvidence.some((row) => row.path.endsWith('BlueprintRegistryTest.kt')));

  const acceptedContainment = catalog.candidates.find((row) => row.candidateRef === 'candidate.component.typed-containment');
  assert.equal(acceptedContainment.state, 'ACCEPTED_PORTABLE');
  assert.equal(acceptedContainment.formation.state, 'ACCEPTED');
  assert.ok(acceptedContainment.sourceEvidence.some((row) => row.path.endsWith('VexLifeWorkspaceBlueprintTest.kt')));

  const acceptedControl = catalog.candidates.find((row) => row.candidateRef === 'candidate.component.semantic-control-binding');
  assert.equal(acceptedControl.state, 'ACCEPTED_PORTABLE');
  assert.equal(acceptedControl.formation.state, 'ACCEPTED');
  assert.ok(acceptedControl.sourceEvidence.some((row) => row.path.endsWith('VexLifeWebP1RuntimeArtifacts.kt')));

  const acceptedRepeater = catalog.candidates.find((row) => row.candidateRef === 'candidate.component.stable-repeater');
  assert.equal(acceptedRepeater.state, 'ACCEPTED_PORTABLE');
  assert.equal(acceptedRepeater.formation.state, 'ACCEPTED');
});

test('target pressure results preserve mapped, held and platform-specific truth separately from portable acceptance', () => {
  const identity = targetPressuresForCandidate(catalog, 'candidate.component.identity-addressed-tree');
  assert.equal(identity.length, 2);
  const identityWeb = identity.find((row) => row.platformRef === 'platform.browser');
  const identitySwift = identity.find((row) => row.platformRef === 'platform.ios');
  assert.ok(identityWeb.relationships.some((row) => row.relationRef.endsWith('stable-ref') && row.disposition === 'MAPPED'));
  assert.ok(identityWeb.relationships.some((row) => row.relationRef.endsWith('target-hook') && row.disposition === 'PLATFORM_SPECIFIC'));
  assert.ok(identitySwift.relationships.some((row) => row.relationRef.endsWith('source-parent') && row.disposition === 'MAPPED'));
  assert.ok(identitySwift.proofs.some((row) => row.proofRef === 'proof.apple-swiftui-sdk' && row.state === 'OWED'));

  const containment = targetPressuresForCandidate(catalog, 'candidate.component.typed-containment');
  assert.equal(containment.length, 1);
  assert.ok(containment[0].relationships.some((row) => row.relationRef.endsWith('source-parentage') && row.disposition === 'MAPPED'));
  assert.ok(containment[0].relationships.some((row) => row.relationRef.endsWith('nonliteral-target-tree') && row.disposition === 'MAPPED'));
  assert.ok(containment[0].relationships.some((row) => row.relationRef.endsWith('slot-identity') && row.disposition === 'NOT_APPLICABLE'));

  const control = targetPressuresForCandidate(catalog, 'candidate.component.semantic-control-binding');
  assert.equal(control.length, 2);
  const controlWeb = control.find((row) => row.platformRef === 'platform.browser');
  const controlSwift = control.find((row) => row.platformRef === 'platform.ios');
  assert.ok(controlWeb.relationships.some((row) => row.relationRef.endsWith('presentation-form') && row.disposition === 'MAPPED'));
  assert.ok(controlWeb.relationships.some((row) => row.relationRef.endsWith('callback-identity') && row.disposition === 'PLATFORM_SPECIFIC'));
  assert.ok(controlSwift.relationships.some((row) => row.relationRef.endsWith('unknown-binding') && row.disposition === 'HELD'));
  assert.ok(controlSwift.proofs.some((row) => row.proofRef === 'proof.swift-unknown-binding-negative' && row.state === 'PASS'));
  assert.ok(controlSwift.proofs.some((row) => row.proofRef === 'proof.repository-kotlin-2.4.20' && row.state === 'OWED'));

  const repeater = targetPressuresForCandidate(catalog, 'candidate.component.stable-repeater');
  const repeaterSwift = repeater.find((row) => row.platformRef === 'platform.ios');
  const repeaterAndroid = repeater.find((row) => row.platformRef === 'platform.android');
  const repeaterWeb = repeater.find((row) => row.repositoryRef === 'repo.vexstream-music');
  assert.equal(repeater.length, 3);
  assert.equal(repeaterSwift.framework, 'SwiftUI');
  assert.equal(repeaterAndroid.state, 'SOURCE_FORMED');
  assert.ok(repeaterSwift.relationships.some((row) => row.relationRef.endsWith('item-identity') && row.disposition === 'MAPPED'));
  assert.ok(repeaterSwift.relationships.some((row) => row.relationRef.endsWith('visible-item-projection') && row.disposition === 'HELD'));
  assert.ok(repeaterSwift.relationships.some((row) => row.relationRef.endsWith('content-type-hint') && row.disposition === 'PLATFORM_SPECIFIC'));
  assert.ok(repeaterSwift.proofs.some((row) => row.proofRef === 'proof.apple-swiftui-sdk' && row.state === 'OWED'));
  assert.ok(repeaterAndroid.relationships.some((row) => row.relationRef.endsWith('visible-item-projection') && row.disposition === 'MAPPED'));
  assert.ok(repeaterAndroid.relationships.some((row) => row.relationRef.endsWith('scroll-lock') && row.disposition === 'MAPPED'));
  assert.ok(repeaterAndroid.proofs.some((row) => row.proofRef === 'proof.android-insert-remove-source-formed' && row.state === 'PASS'));
  assert.ok(repeaterAndroid.proofs.some((row) => row.proofRef === 'proof.android-insert-remove-identity' && row.state === 'OWED' && row.note.includes('PR #261')));
  assert.equal(repeaterWeb.state, 'SOURCE_FORMED');
  assert.ok(repeaterWeb.relationships.some((row) => row.relationRef.endsWith('item-identity') && row.disposition === 'MAPPED'));
  assert.ok(repeaterWeb.relationships.some((row) => row.relationRef.endsWith('duplicate-failure') && row.disposition === 'HELD'));
  assert.ok(repeaterWeb.relationships.some((row) => row.relationRef.endsWith('visible-item-projection') && row.disposition === 'UNSUPPORTED'));
  assert.ok(repeaterWeb.proofs.some((row) => row.proofRef === 'proof.vexstream-population-projectability' && row.state === 'PASS'));
  assert.ok(repeaterWeb.proofs.some((row) => row.proofRef === 'proof.vexstream-durable-item-mutation' && row.state === 'PASS' && row.note.includes('136a3c8863e19f8c0c4d4b4c878cf61d774d9255')));

  const frame = targetPressuresForCandidate(catalog, 'candidate.component.frame-region-layout');
  assert.equal(frame.length, 2);
  const frameSwift = frame.find((row) => row.platformRef === 'platform.ios');
  const frameWeb = frame.find((row) => row.repositoryRef === 'repo.vexstream-music');
  assert.equal(frameSwift.commit, 'befe31789834a74f5a2738cb6d6028c01aa7553c');
  assert.ok(frameSwift.relationships.some((row) => row.relationRef.endsWith('partial-multi-seam') && row.disposition === 'HELD'));
  assert.ok(frameWeb.relationships.some((row) => row.relationRef.endsWith('zero-seam-frame') && row.disposition === 'MAPPED'));
  assert.ok(frameWeb.relationships.some((row) => row.relationRef.endsWith('seam-resize-collapse') && row.disposition === 'NOT_APPLICABLE'));
  assert.ok(frameWeb.proofs.some((row) => row.proofRef === 'proof.vexstream-zero-seam-frame' && row.state === 'PASS'));

  const swappable = targetPressuresForCandidate(catalog, 'candidate.component.swappable-region');
  assert.equal(swappable.length, 3);
  const swappableSwift = swappable.find((row) => row.platformRef === 'platform.ios');
  const swappableAndroid = swappable.find((row) => row.platformRef === 'platform.android');
  const swappableWeb = swappable.find((row) => row.platformRef === 'platform.browser');
  assert.equal(swappableSwift.state, 'HELD_SOURCE_CONTRACT');
  assert.ok(swappableSwift.relationships.every((row) => row.disposition === 'HELD'));
  assert.ok(swappableSwift.proofs.some((row) => row.proofRef === 'proof.vexlife-prod-selection-contract' && row.state === 'HELD'));
  assert.equal(swappableAndroid.state, 'SOURCE_FORMED');
  assert.ok(swappableAndroid.relationships.some((row) => row.relationRef.endsWith('default-child') && row.disposition === 'MAPPED'));
  assert.ok(swappableAndroid.relationships.some((row) => row.relationRef.endsWith('choice-coverage') && row.disposition === 'HELD' && row.target.includes('UNKNOWN')));
  assert.equal(swappableWeb.state, 'SOURCE_FORMED');
  assert.ok(swappableWeb.relationships.some((row) => row.relationRef.endsWith('choice-coverage') && row.disposition === 'MAPPED' && row.target.includes('EXHAUSTIVE')));
  assert.ok(swappableWeb.relationships.some((row) => row.relationRef.endsWith('many-to-one-selectors') && row.disposition === 'MAPPED'));
  assert.ok(swappableWeb.proofs.some((row) => row.proofRef === 'proof.vexstream-lens-self-currentness' && row.state === 'HELD'));

  assert.deepEqual(targetPressuresForCandidate(catalog, 'candidate.component.context-dock'), []);
  assert.throws(() => targetPressuresForCandidate(catalog, 'candidate.component.missing'), /unknown candidate/);
});

test('portable candidate and formation acceptance fail closed when they disagree', () => {
  const splitCandidate = structuredClone(catalog);
  const frame = splitCandidate.candidates.find((row) => row.candidateRef === 'candidate.component.frame-region-layout');
  frame.state = 'PORTABLE_CANDIDATE';
  assert.throws(
    () => normalizeComponentArchitectureCatalog(splitCandidate),
    /portable acceptance must agree with formation acceptance/,
  );

  const splitFormation = structuredClone(catalog);
  const frameFormation = splitFormation.candidates.find((row) => row.candidateRef === 'candidate.component.frame-region-layout');
  frameFormation.formation.state = 'FORMATION';
  assert.throws(
    () => normalizeComponentArchitectureCatalog(splitFormation),
    /portable acceptance must agree with formation acceptance/,
  );
});

test('architecture search finds source evidence and cross-platform pressure', () => {
  assert.ok(searchComponentArchitecture(catalog, 'SwiftUI').length > 0);
  assert.ok(searchComponentArchitecture(catalog, 'VexStableLazyColumn').some((row) => row.candidateRef === 'candidate.component.stable-repeater'));
  assert.ok(searchComponentArchitecture(catalog, 'VexStableConversationTimeline').some((row) => row.candidateRef === 'candidate.component.stable-repeater'));
  assert.ok(searchComponentArchitecture(catalog, 'Action Vessel').some((row) => row.candidateRef === 'candidate.component.action-vessel'));
  assert.ok(searchComponentArchitecture(catalog, 'SwiftUI Menu').some((row) => row.candidateRef === 'candidate.component.adaptive-action-group'));
  assert.ok(searchComponentArchitecture(catalog, 'partial-multi-seam').some((row) => row.candidateRef === 'candidate.component.frame-region-layout'));
  assert.ok(searchComponentArchitecture(catalog, 'apple-swiftui-sdk').some((row) => row.candidateRef === 'candidate.component.stable-repeater'));
  assert.ok(searchComponentArchitecture(catalog, 'NEW_TYPED_RELATIONSHIP_CANDIDATE').some((row) => row.candidateRef === 'candidate.component.stable-repeater'));
  assert.ok(searchComponentArchitecture(catalog, 'many selectors').some((row) => row.candidateRef === 'candidate.component.swappable-region') || searchComponentArchitecture(catalog, 'multiple selectors').some((row) => row.candidateRef === 'candidate.component.swappable-region'));
  assert.deepEqual(searchComponentArchitecture(catalog, ''), []);
});

// [VXG RealForever][VEXWORK][COMPONENT-LIBRARY][ARCHITECTURE-CATALOG-TEST]
