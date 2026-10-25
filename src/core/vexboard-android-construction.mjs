import { normalizeScreenDesign } from './vexboard-screen-design.mjs';

export const VEXBOARD_ANDROID_CONSTRUCTION_PLAN_SCHEMA =
  'vexboard.android-construction-plan/poc-v1';

export const VEXLIFE_ANDROID_TARGET_REF =
  'target.vexlife-android.compose';

const REF = /^[A-Za-z0-9][A-Za-z0-9._:/-]*$/u;

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function stableRef(value, label) {
  assert(typeof value === 'string' && REF.test(value), `${label} must be one stable ref`);
  return value;
}

function metric(design, ref) {
  const value = design.metrics?.[ref];
  assert(value, `Android construction requires Screen design metric ${ref}`);
  return value;
}

function layoutRule(design, ref) {
  const value = design.layoutRules?.find((rule) => rule.layoutRef === ref);
  assert(value, `Android construction requires Screen design layout rule ${ref}`);
  return value;
}

function visualColor(design, ref) {
  const value = design.visualTokens?.colors?.[ref];
  assert(typeof value === 'string' && value, `Android construction requires visual color ${ref}`);
  return value;
}

function visualShape(design, ref) {
  const value = design.visualTokens?.shapes?.[ref];
  assert(value !== undefined && value !== null, `Android construction requires visual shape ${ref}`);
  return value;
}

function visualTypography(design, ref) {
  const value = design.visualTokens?.typography?.[ref];
  assert(value && typeof value === 'object',
    `Android construction requires visual typography ${ref}`);
  return value;
}

function mapping(mappingRef, {
  designRefs,
  targetSourceRef,
  targetSymbol,
  targetMeaning,
  referenceDpOrNull = null,
}) {
  return Object.freeze({
    mappingRef: stableRef(mappingRef, 'mappingRef'),
    designRefs: Object.freeze([...designRefs]),
    targetSourceRef,
    targetSymbol,
    targetMeaning,
    referenceDpOrNull,
  });
}

export function compileVexLifeAndroidScreenDesign(
  designInput,
  {
    planRef = 'plan.vexlife-android.home-vexstream.screen-design.poc',
  } = {},
) {
  const design = normalizeScreenDesign(designInput);
  stableRef(planRef, 'planRef');

  for (const colorRef of [
    'background', 'onBackground', 'surface', 'onSurface', 'surfaceContainer',
    'surfaceContainerLow', 'surfaceContainerHigh', 'outline', 'outlineVariant',
    'primary', 'onPrimary', 'primaryContainer', 'onPrimaryContainer',
    'secondary', 'onSecondary', 'secondaryContainer', 'onSecondaryContainer',
    'tertiary', 'errorContainer', 'onErrorContainer',
  ]) visualColor(design, colorRef);
  for (const shapeRef of [
    'mediumRadiusDp', 'largeRadiusDp', 'extraLargeRadiusDp', 'fullRadius',
  ]) visualShape(design, shapeRef);
  for (const typographyRef of [
    'headlineLarge', 'headlineMedium', 'headlineSmall',
    'titleLarge', 'titleMedium', 'bodyLarge', 'bodyMedium',
    'labelLarge', 'labelSmall',
  ]) visualTypography(design, typographyRef);

  const tabs = layoutRule(design, 'layout.vexstream.library-tabs');
  const songs = layoutRule(design, 'layout.vexstream.songs');
  const connectionSheet = layoutRule(design, 'layout.vexstream.connection-sheet');

  assert(tabs.mode === 'SCROLL_ROW',
    'VexStream library tabs must remain SCROLL_ROW for Android construction');
  assert(songs.mode === 'SCROLL_COLUMN',
    'VexStream songs must remain SCROLL_COLUMN for Android construction');
  assert(connectionSheet.mode === 'COLUMN',
    'VexStream connection sheet must remain COLUMN for Android construction');

  const mappings = [
    mapping('mapping.android.theme.dark-colors', {
      designRefs: [
        'visual.color.background',
        'visual.color.onBackground',
        'visual.color.surface',
        'visual.color.onSurface',
        'visual.color.surfaceContainer',
        'visual.color.surfaceContainerHigh',
        'visual.color.outline',
        'visual.color.outlineVariant',
        'visual.color.primary',
        'visual.color.onPrimary',
        'visual.color.secondary',
        'visual.color.onSecondary',
        'visual.color.tertiary',
      ],
      targetSourceRef:
        'repo.vexlife-android:app/src/main/kotlin/com/vextreme/vexlife/android/ui/VexLifeTheme.kt',
      targetSymbol: 'DarkColors',
      targetMeaning: 'explicit VexLife dark color scheme',
      referenceDpOrNull: null,
    }),
    mapping('mapping.android.theme.material-default-colors', {
      designRefs: [
        'visual.color.primaryContainer',
        'visual.color.onPrimaryContainer',
        'visual.color.secondaryContainer',
        'visual.color.onSecondaryContainer',
        'visual.color.errorContainer',
        'visual.color.onErrorContainer',
        'visual.color.surfaceContainerLow',
      ],
      targetSourceRef:
        'repo.vexlife-android:app/src/main/kotlin/com/vextreme/vexlife/android/ui/VexLifeTheme.kt',
      targetSymbol: 'DarkColors inherited Material3 roles',
      targetMeaning:
        'pin inherited Material3 roles explicitly if VexBoard design diverges from dependency defaults',
      referenceDpOrNull: null,
    }),
    mapping('mapping.android.theme.shapes', {
      designRefs: [
        'visual.shape.mediumRadiusDp',
        'visual.shape.largeRadiusDp',
        'visual.shape.extraLargeRadiusDp',
        'visual.shape.fullRadius',
      ],
      targetSourceRef:
        'repo.vexlife-android:app/src/main/kotlin/com/vextreme/vexlife/android/ui/VexLifeTheme.kt',
      targetSymbol: 'MaterialTheme shapes / component shape mappings',
      targetMeaning:
        'VexBoard-owned component corner geometry',
      referenceDpOrNull: Number(visualShape(design, 'largeRadiusDp')),
    }),
    mapping('mapping.android.theme.typography-explicit', {
      designRefs: [
        'visual.typography.headlineLarge',
        'visual.typography.headlineMedium',
        'visual.typography.labelSmall',
      ],
      targetSourceRef:
        'repo.vexlife-android:app/src/main/kotlin/com/vextreme/vexlife/android/ui/VexLifeTheme.kt',
      targetSymbol: 'VexTypography explicit overrides',
      targetMeaning: 'VexLife-authored typography roles',
      referenceDpOrNull: Number(visualTypography(design, 'headlineMedium').fontSizeSp),
    }),
    mapping('mapping.android.theme.typography-material-defaults', {
      designRefs: [
        'visual.typography.headlineSmall',
        'visual.typography.titleLarge',
        'visual.typography.titleMedium',
        'visual.typography.bodyLarge',
        'visual.typography.bodyMedium',
        'visual.typography.labelLarge',
      ],
      targetSourceRef:
        'repo.vexlife-android:app/src/main/kotlin/com/vextreme/vexlife/android/ui/VexLifeTheme.kt',
      targetSymbol: 'VexTypography inherited Material3 roles',
      targetMeaning:
        'pin inherited Material3 typography explicitly if VexBoard design diverges from dependency defaults',
      referenceDpOrNull: Number(visualTypography(design, 'titleLarge').fontSizeSp),
    }),
    mapping('mapping.android.shell.toolbar-height', {
      designRefs: ['metric.toolbarHeight'],
      targetSourceRef:
        'repo.vexlife-android:app/src/main/kotlin/com/vextreme/vexlife/android/ui/VexLifeTheme.kt',
      targetSymbol: 'VexLayoutTokens.ToolbarHeight',
      targetMeaning: 'toolbar height',
      referenceDpOrNull: metric(design, 'toolbarHeight').referenceDp,
    }),
    mapping('mapping.android.shell.bottom-bar-height', {
      designRefs: ['metric.bottomBarHeight'],
      targetSourceRef:
        'repo.vexlife-android:app/src/main/kotlin/com/vextreme/vexlife/android/ui/VexLifeTheme.kt',
      targetSymbol: 'VexLayoutTokens.BottomBarHeight',
      targetMeaning: 'primary bottom-navigation height',
      referenceDpOrNull: metric(design, 'bottomBarHeight').referenceDp,
    }),
    mapping('mapping.android.home.body-padding', {
      designRefs: [
        'design-occurrence.home.inner-content',
        'metric.screenPaddingHorizontal',
        'metric.screenPaddingVertical',
      ],
      targetSourceRef:
        'repo.vexlife-android:app/src/main/kotlin/com/vextreme/vexlife/android/screens/primary/home/HomeScreen.kt',
      targetSymbol: 'HomeScreenContent Modifier.padding',
      targetMeaning: 'Home body bounded inset',
      referenceDpOrNull: metric(design, 'screenPaddingHorizontal').referenceDp,
    }),
    mapping('mapping.android.vex-container.inner-padding', {
      designRefs: [
        'metric.containerPaddingHorizontal',
        'metric.containerPaddingVertical',
      ],
      targetSourceRef:
        'repo.vexlife-android:architecture/elements/src/main/kotlin/com/vextreme/vexlife/android/elements/ElementCells.kt',
      targetSymbol: 'VexContainer Column.padding',
      targetMeaning: 'reusable container inner padding',
      referenceDpOrNull: metric(design, 'containerPaddingHorizontal').referenceDp,
    }),
    mapping('mapping.android.vex-container.child-gap', {
      designRefs: ['metric.containerGapVertical'],
      targetSourceRef:
        'repo.vexlife-android:architecture/elements/src/main/kotlin/com/vextreme/vexlife/android/elements/ElementCells.kt',
      targetSymbol: 'VexContainer Arrangement.spacedBy',
      targetMeaning: 'reusable container vertical child gap',
      referenceDpOrNull: metric(design, 'containerGapVertical').referenceDp,
    }),
    mapping('mapping.android.vexstream.tabs-layout', {
      designRefs: [tabs.layoutRef, `metric.${tabs.gapMetricRefOrNull}`],
      targetSourceRef:
        'repo.vexlife-android:app/src/main/kotlin/com/vextreme/vexlife/android/screens/shared/vexstream/VexStreamLibraryPresentation.kt',
      targetSymbol: 'VexStreamLibraryTabs',
      targetMeaning: 'horizontalScroll Row + spacedBy gap',
      referenceDpOrNull: metric(design, tabs.gapMetricRefOrNull).referenceDp,
    }),
    mapping('mapping.android.vexstream.songs-layout', {
      designRefs: [songs.layoutRef, `metric.${songs.gapMetricRefOrNull}`],
      targetSourceRef:
        'repo.vexlife-android:app/src/main/kotlin/com/vextreme/vexlife/android/screens/shared/vexstream/VexStreamLibraryPresentation.kt',
      targetSymbol: 'VexStreamSongsPane LazyColumn',
      targetMeaning: 'scrolling song list + vertical item gap',
      referenceDpOrNull: metric(design, songs.gapMetricRefOrNull).referenceDp,
    }),
    mapping('mapping.android.vexstream.track-card', {
      designRefs: [
        'metric.trackOuterPaddingHorizontal',
        'metric.trackOuterPaddingVertical',
        'metric.trackInnerPaddingHorizontal',
        'metric.trackInnerPaddingVertical',
        'metric.trackRowGapHorizontal',
        'metric.trackArtworkSize',
        'metric.trackCopyGapVertical',
      ],
      targetSourceRef:
        'repo.vexlife-android:app/src/main/kotlin/com/vextreme/vexlife/android/screens/shared/vexstream/VexStreamTrackPresentation.kt',
      targetSymbol: 'VexStreamTrackCard',
      targetMeaning: 'track card padding / artwork / row and copy gaps',
      referenceDpOrNull: metric(design, 'trackArtworkSize').referenceDp,
    }),
    mapping('mapping.android.vexstream.connection-sheet', {
      designRefs: [
        connectionSheet.layoutRef,
        'metric.connectionSheetPaddingHorizontal',
        'metric.connectionSheetPaddingBottom',
        `metric.${connectionSheet.gapMetricRefOrNull}`,
      ],
      targetSourceRef:
        'repo.vexlife-android:app/src/main/kotlin/com/vextreme/vexlife/android/screens/shared/vexstream/VexStreamConnectionPresentation.kt',
      targetSymbol: 'VexStreamConnectionMenuSheet',
      targetMeaning: 'modal sheet content column padding + vertical gap',
      referenceDpOrNull: metric(design, 'connectionSheetPaddingHorizontal').referenceDp,
    }),
  ];

  return Object.freeze({
    schemaVersion: VEXBOARD_ANDROID_CONSTRUCTION_PLAN_SCHEMA,
    planRef,
    designRef: design.designRef,
    designAuthorityState: design.authorityState,
    targetRef: VEXLIFE_ANDROID_TARGET_REF,
    targetProfileRef: design.referenceViewport.profileRef,
    admission:
      design.authorityState === 'VEXBOARD_DESIGN_AUTHORITY'
        ? 'IMPLEMENTATION_ELIGIBLE'
        : design.authorityState === 'VEXBOARD_DESIGN_DRAFT'
          ? 'PREVIEW_ONLY_DESIGN_DRAFT'
          : 'PREVIEW_ONLY_REVERSE_ADOPTION',
    mappings: Object.freeze(mappings),
    sourceRefs: Object.freeze([...(design.sourceRefs ?? [])]),
    effects: Object.freeze({
      targetSourceMutationPerformed: false,
      externalEffectsPerformed: false,
    }),
  });
}

// [VXG RealForever][VEXWORK][VEXBOARD][ANDROID-CONSTRUCTION][POC]
