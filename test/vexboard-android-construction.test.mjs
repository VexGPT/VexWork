import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  VEXBOARD_ANDROID_CONSTRUCTION_PLAN_SCHEMA,
  VEXLIFE_ANDROID_TEXT_VALUE_RESOLUTION_CAPABILITY_REF,
  compileVexLifeAndroidScreenDesign,
} from '../src/core/vexboard-android-construction.mjs';

const design = JSON.parse(fs.readFileSync(
  new URL('../projects/vexboard/examples/vexlife-android-home-vexstream.design.json', import.meta.url),
  'utf8',
));

test('Android construction plan consumes VexBoard design without target effects', () => {
  const plan = compileVexLifeAndroidScreenDesign(design);

  assert.equal(plan.schemaVersion, VEXBOARD_ANDROID_CONSTRUCTION_PLAN_SCHEMA);
  assert.equal(plan.designRef, design.designRef);
  assert.equal(plan.designAuthorityState, 'REVERSE_ADOPTED_CANDIDATE');
  assert.equal(plan.admission, 'PREVIEW_ONLY_REVERSE_ADOPTION');
  assert.deepEqual(plan.effects, {
    targetSourceMutationPerformed: false,
    externalEffectsPerformed: false,
  });

  const theme = plan.mappings.find(
    (entry) => entry.mappingRef === 'mapping.android.theme.dark-colors',
  );
  assert.match(theme.targetSymbol, /DarkColors/);
  assert.ok(theme.designRefs.includes('visual.color.background'));

  const shapes = plan.mappings.find(
    (entry) => entry.mappingRef === 'mapping.android.theme.shapes',
  );
  assert.equal(shapes.referenceDpOrNull, 16);

  const explicitTypography = plan.mappings.find(
    (entry) => entry.mappingRef === 'mapping.android.theme.typography-explicit',
  );
  assert.equal(explicitTypography.referenceDpOrNull, 24);
  assert.match(explicitTypography.targetSymbol, /VexTypography/);

  const inheritedTypography = plan.mappings.find(
    (entry) => entry.mappingRef === 'mapping.android.theme.typography-material-defaults',
  );
  assert.equal(inheritedTypography.referenceDpOrNull, 22);
  assert.ok(inheritedTypography.designRefs.includes('visual.typography.titleLarge'));

  assert.equal(plan.componentMappings.length, design.componentAssignments.length);

  const homeTitle = plan.componentMappings.find(
    (entry) => entry.semanticRef === 'element.home.body.vexstream.title',
  );
  assert.equal(homeTitle.targetSymbol, 'VexText');
  assert.equal(homeTitle.identityStateOrNull, 'VEXBOARD_PROPOSED');
  assert.equal(homeTitle.originFormOrNull, 'VexTextOrigin');
  assert.deepEqual(homeTitle.contentOriginRefs, ['origin.vexlife.vexstream.message.home.title']);
  assert.equal(homeTitle.valueBindingRefOrNull, null);
  assert.deepEqual(homeTitle.targetContentRealizationRefs, [
    'android.vexlife.string.home_vexstream_music',
  ]);
  assert.equal(homeTitle.targetIdentityStrategyOrNull, 'REGISTER_TEXT_ELEMENT');
  assert.equal(homeTitle.targetValueStrategyOrNull, 'ANDROID_RESOURCE_MAPPING');
  assert.equal(homeTitle.targetCapabilityStatusOrNull, 'AVAILABLE');
  assert.equal(
    homeTitle.targetOwnerSourceRefOrNull,
    'repo.vexlife-android:app/src/main/kotlin/com/vextreme/vexlife/android/screens/primary/home/HomeScreen.kt',
  );

  const systemsTitle = plan.componentMappings.find(
    (entry) => entry.semanticRef === 'element.home.body.systems.title',
  );
  assert.equal(systemsTitle.targetSymbol, 'VexText');
  assert.equal(systemsTitle.originFormOrNull, 'VexTextOrigin');
  assert.equal(systemsTitle.targetIdentityStrategyOrNull, 'REGISTER_TEXT_ELEMENT');
  assert.equal(systemsTitle.targetValueStrategyOrNull, 'ANDROID_RESOURCE_MAPPING');

  const homeStatus = plan.componentMappings.find(
    (entry) => entry.semanticRef === 'element.home.body.vexstream.status',
  );
  assert.deepEqual(homeStatus.contentOriginRefs, [
    'origin.vexlife.vexstream.message.home.connected',
    'origin.vexlife.vexstream.message.home.offline',
  ]);
  assert.equal(homeStatus.valueBindingRefOrNull, 'binding.vexstream.home.status-message');
  assert.equal(homeStatus.targetIdentityStrategyOrNull, 'REGISTER_TEXT_ELEMENT');
  assert.equal(homeStatus.targetValueStrategyOrNull, 'RUNTIME_BOUND_VALUE');
  assert.deepEqual(homeStatus.targetContentRealizationRefs, [
    'android.vexlife.string.home_vexstream_connected',
    'android.vexlife.string.home_vexstream_offline',
  ]);
  assert.equal(
    homeStatus.targetCapabilityRefOrNull,
    VEXLIFE_ANDROID_TEXT_VALUE_RESOLUTION_CAPABILITY_REF,
  );
  assert.equal(homeStatus.targetCapabilityStatusOrNull, 'STANDARDIZATION_REQUIRED');

  const homeBody = plan.componentMappings.find(
    (entry) => entry.semanticRef === 'element.home.body.vexstream.body',
  );
  assert.equal(homeBody.valueBindingRefOrNull, 'binding.vexstream.home.body-message');
  assert.equal(homeBody.targetIdentityStrategyOrNull, 'REGISTER_TEXT_ELEMENT');
  assert.equal(homeBody.targetValueStrategyOrNull, 'RUNTIME_BOUND_VALUE');
  assert.equal(
    homeBody.targetCapabilityRefOrNull,
    VEXLIFE_ANDROID_TEXT_VALUE_RESOLUTION_CAPABILITY_REF,
  );
  assert.equal(homeBody.targetCapabilityStatusOrNull, 'STANDARDIZATION_REQUIRED');

  assert.equal(plan.targetCapabilityRequirements.length, 1);
  const textValueRequirement = plan.targetCapabilityRequirements[0];
  assert.equal(
    textValueRequirement.capabilityRef,
    VEXLIFE_ANDROID_TEXT_VALUE_RESOLUTION_CAPABILITY_REF,
  );
  assert.equal(textValueRequirement.status, 'STANDARDIZATION_REQUIRED');
  assert.deepEqual(textValueRequirement.requiredBySemanticRefs, [
    'element.home.body.vexstream.body',
    'element.home.body.vexstream.status',
  ]);
  assert.equal(textValueRequirement.proposalStatus, 'PROPOSED_NOT_IN_TARGET_SOURCE');
  assert.equal(textValueRequirement.proposedTargetShape.elementType, 'TextElement');
  assert.equal(textValueRequirement.proposedTargetShape.screenBlueprintFactory, 'textRef');
  assert.equal(textValueRequirement.proposedTargetShape.layoutPlacement, 'text');
  assert.equal(textValueRequirement.proposedTargetShape.composeCell, 'VexText(element, text?)');
  assert.equal(textValueRequirement.proposedTargetShape.invariant, 'TEXT_IDENTITY != VALUE_SOURCE');

  const homeOpen = plan.componentMappings.find(
    (entry) => entry.semanticRef === 'element.home.body.systems.vexstream-music',
  );
  assert.equal(homeOpen.templateRef, 'component.button');
  assert.equal(homeOpen.styleRef, 'style.action.primary');
  assert.equal(homeOpen.targetSymbol, 'VexButton');

  const manage = plan.componentMappings.find(
    (entry) => entry.semanticRef === 'element.vexstream-music.body.connection.manage',
  );
  assert.equal(manage.templateRef, 'component.icon-button');
  assert.equal(manage.iconRefOrNull, 'icon.settings');
  assert.equal(manage.targetSymbol, 'VexIconButton');

  const songsTab = plan.componentMappings.find(
    (entry) => entry.semanticRef === 'element.vexstream-music.body.library-tabs.songs',
  );
  assert.equal(songsTab.templateRef, 'component.tab');
  assert.equal(songsTab.styleRef, 'style.navigation');
  assert.equal(songsTab.selectedStyleRefOrNull, 'style.action.primary');
  assert.match(songsTab.targetSymbol, /VexButton/);

  const sheet = plan.componentMappings.find(
    (entry) => entry.semanticRef === 'element.vexstream-music.body.connection.menu',
  );
  assert.equal(sheet.targetSymbol, 'VexModalBottomSheet');

  const sheetContent = plan.componentMappings.find(
    (entry) => entry.semanticRef === 'element.vexstream-music.body.connection.menu.content',
  );
  assert.equal(sheetContent.targetSymbol, 'VexColumn');

  const sheetTitle = plan.componentMappings.find(
    (entry) => entry.semanticRef === 'element.vexstream-music.body.connection.menu.content.title',
  );
  assert.equal(sheetTitle.targetSymbol, 'VexText');
  assert.equal(sheetTitle.typographyRefOrNull, 'headlineSmall');
  assert.equal(sheetTitle.colorRefOrNull, 'onSurface');

  const sheetStatus = plan.componentMappings.find(
    (entry) => entry.semanticRef === 'element.vexstream-music.body.connection.menu.content.status',
  );
  assert.equal(sheetStatus.typographyRefOrNull, 'bodyLarge');
  assert.equal(sheetStatus.colorRefOrNull, 'onSurfaceVariant');

  const toolbar = plan.mappings.find(
    (entry) => entry.mappingRef === 'mapping.android.shell.toolbar-height',
  );
  assert.equal(toolbar.referenceDpOrNull, 70);
  assert.equal(toolbar.targetSymbol, 'VexLayoutTokens.ToolbarHeight');

  const tabs = plan.mappings.find(
    (entry) => entry.mappingRef === 'mapping.android.vexstream.tabs-layout',
  );
  assert.match(tabs.targetMeaning, /horizontalScroll Row/);
  assert.equal(tabs.referenceDpOrNull, 8);

  const fabAnchor = plan.mappings.find(
    (entry) => entry.mappingRef === 'mapping.android.vexstream.library-actions-anchor',
  );
  assert.equal(fabAnchor.targetSymbol, 'Scaffold.floatingActionButton');
  assert.equal(fabAnchor.referenceDpOrNull, 40);

  const fabCluster = plan.mappings.find(
    (entry) => entry.mappingRef === 'mapping.android.vexstream.library-actions-cluster',
  );
  assert.equal(fabCluster.targetSymbol, 'VexStreamLibraryFabActions');
  assert.equal(fabCluster.referenceDpOrNull, 10);

  const connectionSheet = plan.mappings.find(
    (entry) => entry.mappingRef === 'mapping.android.vexstream.connection-sheet',
  );
  assert.equal(connectionSheet.referenceDpOrNull, 640);
  assert.match(connectionSheet.targetSymbol, /VexModalBottomSheet/);
  assert.ok(connectionSheet.designRefs.includes('anchor.vexstream.connection-sheet'));
  assert.ok(connectionSheet.designRefs.includes('visual.dimension.bottomSheetDragHandleHeightDp'));

  const track = plan.mappings.find(
    (entry) => entry.mappingRef === 'mapping.android.vexstream.track-card',
  );
  assert.equal(track.referenceDpOrNull, 54);
  assert.match(track.targetSymbol, /VexStreamTrackCard/);
});

test('component style edit changes Android mapping while preserving target symbol identity', () => {
  const changed = structuredClone(design);
  changed.authorityState = 'VEXBOARD_DESIGN_DRAFT';
  changed.componentAssignments.find(
    (entry) => entry.semanticRef === 'element.home.body.systems.vex-maps',
  ).styleRef = 'style.action.primary';

  const baselinePlan = compileVexLifeAndroidScreenDesign(design);
  const changedPlan = compileVexLifeAndroidScreenDesign(changed);
  const baseline = baselinePlan.componentMappings.find(
    (entry) => entry.semanticRef === 'element.home.body.systems.vex-maps',
  );
  const updated = changedPlan.componentMappings.find(
    (entry) => entry.semanticRef === 'element.home.body.systems.vex-maps',
  );

  assert.equal(baseline.targetSymbol, 'VexButton');
  assert.equal(updated.targetSymbol, 'VexButton');
  assert.equal(baseline.styleRef, 'style.action.secondary');
  assert.equal(updated.styleRef, 'style.action.primary');
  assert.equal(changedPlan.admission, 'PREVIEW_ONLY_DESIGN_DRAFT');
});

test('local VexBoard design draft remains non-implementing until explicit acceptance', () => {
  const draft = structuredClone(design);
  draft.authorityState = 'VEXBOARD_DESIGN_DRAFT';
  draft.metrics.screenPaddingHorizontal = {
    preferredPercent: 24 / 412,
    minDp: 24,
    maxDp: 24,
    referenceDp: 24,
  };

  const plan = compileVexLifeAndroidScreenDesign(draft);

  assert.equal(plan.designAuthorityState, 'VEXBOARD_DESIGN_DRAFT');
  assert.equal(plan.admission, 'PREVIEW_ONLY_DESIGN_DRAFT');
  assert.deepEqual(plan.effects, {
    targetSourceMutationPerformed: false,
    externalEffectsPerformed: false,
  });
});

test('accepted VexBoard design remains held when known Android adoption blockers remain', () => {
  const accepted = structuredClone(design);
  accepted.authorityState = 'VEXBOARD_DESIGN_AUTHORITY';
  const readiness = {
    schemaVersion: 'vexlife-android.vexboard-adoption-readiness/poc-v1',
    status: 'HELD',
    blockingFindingRefs: [
      'finding.android.home.vexstream-copy-unaddressed',
      'finding.android.vexstream.show-queue-parent-drift',
    ],
    identityExceptionCount: 5,
    findingCount: 5,
  };

  const plan = compileVexLifeAndroidScreenDesign(
    accepted,
    { adoptionReadiness: readiness },
  );

  assert.equal(plan.designAuthorityState, 'VEXBOARD_DESIGN_AUTHORITY');
  assert.equal(plan.admission, 'IMPLEMENTATION_HELD_ADOPTION_GAPS');
  assert.deepEqual(plan.adoptionReadiness, readiness);
  assert.equal(plan.effects.targetSourceMutationPerformed, false);
});

test('formed Android capability candidate remains non-admitted until proof/acceptance', () => {
  const accepted = structuredClone(design);
  accepted.authorityState = 'VEXBOARD_DESIGN_AUTHORITY';

  const plan = compileVexLifeAndroidScreenDesign(
    accepted,
    {
      targetCapabilityCandidates: [{
        capabilityRef: VEXLIFE_ANDROID_TEXT_VALUE_RESOLUTION_CAPABILITY_REF,
        candidateRef: 'github.pull.vexlife-android.182',
        candidateHeadRefOrNull:
          'git.commit.vexlife-android.6efb978584de7e4f07257094c5e9e541c17d844c',
        status: 'CANDIDATE_FORMED_PROOF_PENDING',
        sourceRefs: ['github.pull.vexlife-android.182'],
      }],
    },
  );

  assert.equal(plan.admission, 'IMPLEMENTATION_HELD_TARGET_CAPABILITIES');
  const requirement = plan.targetCapabilityRequirements[0];
  assert.equal(requirement.status, 'STANDARDIZATION_REQUIRED');
  assert.equal(requirement.proposalStatus, 'CANDIDATE_FORMED_PROOF_PENDING');
  assert.equal(requirement.candidateRefOrNull, 'github.pull.vexlife-android.182');
  assert.equal(
    requirement.candidateHeadRefOrNull,
    'git.commit.vexlife-android.6efb978584de7e4f07257094c5e9e541c17d844c',
  );
  assert.deepEqual(requirement.candidateSourceRefs, ['github.pull.vexlife-android.182']);
});

test('accepted VexBoard design remains held until required Android target capability exists', () => {
  const accepted = structuredClone(design);
  accepted.authorityState = 'VEXBOARD_DESIGN_AUTHORITY';

  const plan = compileVexLifeAndroidScreenDesign(accepted);

  assert.equal(plan.designAuthorityState, 'VEXBOARD_DESIGN_AUTHORITY');
  assert.equal(plan.admission, 'IMPLEMENTATION_HELD_TARGET_CAPABILITIES');
  assert.equal(plan.targetCapabilityRequirements[0].status, 'STANDARDIZATION_REQUIRED');
  assert.equal(plan.effects.targetSourceMutationPerformed, false);
});

test('accepted VexBoard design becomes Android implementation eligible once target capability is admitted', () => {
  const accepted = structuredClone(design);
  accepted.authorityState = 'VEXBOARD_DESIGN_AUTHORITY';

  const plan = compileVexLifeAndroidScreenDesign(
    accepted,
    { availableTargetCapabilityRefs: [VEXLIFE_ANDROID_TEXT_VALUE_RESOLUTION_CAPABILITY_REF] },
  );

  assert.equal(plan.designAuthorityState, 'VEXBOARD_DESIGN_AUTHORITY');
  assert.equal(plan.admission, 'IMPLEMENTATION_ELIGIBLE');
  assert.equal(plan.targetRef, 'target.vexlife-android.compose');
  assert.equal(plan.targetCapabilityRequirements[0].status, 'AVAILABLE');
  assert.equal(plan.mappings.length >= 16, true);
  assert.equal(plan.componentMappings.find(
    (entry) => entry.semanticRef === 'element.home.body.vexstream.status',
  ).targetCapabilityStatusOrNull, 'AVAILABLE');
});

test('Android construction fails closed when required VexBoard layout meaning is lost', () => {
  const invalid = structuredClone(design);
  invalid.layoutRules.find(
    (entry) => entry.layoutRef === 'layout.vexstream.library-tabs',
  ).mode = 'ROW';

  assert.throws(
    () => compileVexLifeAndroidScreenDesign(invalid),
    /must remain SCROLL_ROW/,
  );
});

// [VXG RealForever][VEXWORK][VEXBOARD][ANDROID-CONSTRUCTION][POC]
