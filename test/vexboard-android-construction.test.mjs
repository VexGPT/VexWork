import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  VEXBOARD_ANDROID_CONSTRUCTION_PLAN_SCHEMA,
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

test('accepted VexBoard design becomes Android implementation eligible without changing the adoption snapshot', () => {
  const accepted = structuredClone(design);
  accepted.authorityState = 'VEXBOARD_DESIGN_AUTHORITY';

  const plan = compileVexLifeAndroidScreenDesign(accepted);

  assert.equal(plan.designAuthorityState, 'VEXBOARD_DESIGN_AUTHORITY');
  assert.equal(plan.admission, 'IMPLEMENTATION_ELIGIBLE');
  assert.equal(plan.targetRef, 'target.vexlife-android.compose');
  assert.equal(plan.mappings.length >= 14, true);
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
