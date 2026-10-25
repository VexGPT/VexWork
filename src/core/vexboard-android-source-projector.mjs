import { createBoardGraph, createBoardProjection } from './vexboard.mjs';
import { compileVexLifeAndroidScreenDesign } from './vexboard-android-construction.mjs';
import {
  normalizeScreenDesign,
  screenDesignAnchorRule,
  screenDesignComponentAssignment,
  screenDesignLayoutRule,
  screenDesignViewportProfile,
  screenDesignVisualDimension,
  resolveBoundedResponsiveMetric,
  resolveScreenDesignAnchorBox,
  resolveScreenDesignConstraintBox,
} from './vexboard-screen-design.mjs';

export const VEXLIFE_ANDROID_POC_SNAPSHOT_SCHEMA = 'vexlife-android.vexboard-snapshot/poc-v1';
export const VEXBOARD_ANDROID_REFERENCE_PRESENTATION_SCHEMA = 'vexboard.android-reference-presentation/v1';
export const VEXLIFE_ANDROID_ADOPTION_COVERAGE_SCHEMA =
  'vexlife-android.vexboard-adoption-coverage/poc-v1';
export const VEXBOARD_ANDROID_POC_BOARD_REFS = Object.freeze({
  EXPERIENCE: 'board.vexlife-android.home-vexstream.poc',
  DEPTH: 'board.vexlife-android.vexstream-depth.poc',
});

const REF = /^[A-Za-z0-9][A-Za-z0-9._:/-]*$/u;
const DP_TO_BOARD = 0.72;

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function stableRef(value, label) {
  assert(typeof value === 'string' && REF.test(value), `${label} must be one stable ref`);
  return value;
}

function text(value, label) {
  assert(typeof value === 'string' && value.trim(), `${label} must be non-empty text`);
  return value;
}

function refs(values, label) {
  assert(Array.isArray(values), `${label} must be an array`);
  return [...new Set(values.map((value, index) => stableRef(value, `${label}[${index}]`)))].sort();
}

function positive(value, label) {
  assert(typeof value === 'number' && Number.isFinite(value) && value > 0, `${label} must be positive`);
  return value;
}

function relativeJsonLocation(value, label) {
  assert(typeof value === 'string' && value.startsWith('./') && value.endsWith('.json'),
    `${label} must be one relative JSON location`);
  const parts = value.slice(2).split('/');
  assert(parts.length > 0 && parts.every((part) => part && part !== '.' && part !== '..'),
    `${label} must stay inside its source root`);
  assert(!value.includes('\\') && !value.includes('?') && !value.includes('#') && !value.includes('%'),
    `${label} must be a plain relative JSON location`);
  return value;
}

function normalizeAdoptionCoverage(input) {
  assert(
    input?.schemaVersion === VEXLIFE_ANDROID_ADOPTION_COVERAGE_SCHEMA,
    'VexLife Android adoption coverage schema mismatch',
  );
  assert(
    input.screenRealizationModes &&
    typeof input.screenRealizationModes === 'object' &&
    !Array.isArray(input.screenRealizationModes),
    'Android adoption screenRealizationModes required',
  );
  for (const [screenRef, mode] of Object.entries(input.screenRealizationModes)) {
    stableRef(screenRef, 'Android adoption screenRef');
    assert(
      ['GENERIC_BLUEPRINT_TREE', 'CUSTOM_NATIVE_REALIZATION', 'GENERATED_FROM_VEXBOARD_DESIGN']
        .includes(mode),
      `Android adoption realization mode unsupported: ${mode}`,
    );
  }
  assert(Array.isArray(input.identityExceptions), 'Android adoption identityExceptions required');
  const seen = new Set();
  for (const [index, entry] of input.identityExceptions.entries()) {
    stableRef(entry?.semanticRef, `Android adoption identityExceptions[${index}].semanticRef`);
    assert(!seen.has(entry.semanticRef),
      `duplicate Android adoption identity exception ${entry.semanticRef}`);
    seen.add(entry.semanticRef);
    assert(
      ['DERIVED_CUSTOM_PRESENTATION', 'DYNAMIC_DOMAIN_OCCURRENCE', 'TARGET_ONLY_DECORATION']
        .includes(entry.origin),
      `Android adoption identity origin unsupported: ${entry.origin}`,
    );
    assert(
      ['REGISTERED_STATIC', 'UNREGISTERED_STATIC', 'NOT_APPLICABLE']
        .includes(entry.staticRegistryStatus),
      `Android adoption static registry status unsupported: ${entry.staticRegistryStatus}`,
    );
    refs(entry.sourceRefs ?? [], `Android adoption identityExceptions[${index}].sourceRefs`);
  }

  assert(Array.isArray(input.findings ?? []), 'Android adoption findings must be an array');
  const findingRefs = new Set();
  for (const [index, finding] of (input.findings ?? []).entries()) {
    stableRef(finding?.findingRef, `Android adoption findings[${index}].findingRef`);
    assert(!findingRefs.has(finding.findingRef),
      `duplicate Android adoption finding ${finding.findingRef}`);
    findingRefs.add(finding.findingRef);
    stableRef(finding.ownerSemanticRef, `Android adoption findings[${index}].ownerSemanticRef`);
    if (finding.subjectSemanticRefOrNull !== undefined && finding.subjectSemanticRefOrNull !== null) {
      stableRef(
        finding.subjectSemanticRefOrNull,
        `Android adoption findings[${index}].subjectSemanticRefOrNull`,
      );
    }
    assert(
      [
        'RAW_COMPOSE_NO_SEMANTIC_REF',
        'REGISTRY_RENDER_STRUCTURE_DRIFT',
        'TARGET_LOCAL_DESIGN_MEANING',
        'EVIDENCE_PROVENANCE_GAP',
      ].includes(finding.kind),
      `Android adoption finding kind unsupported: ${finding.kind}`,
    );
    assert(typeof finding.blockingForPocAuthority === 'boolean',
      `Android adoption findings[${index}].blockingForPocAuthority required`);
    assert(
      ['IN_POC', 'IN_POC_MAPPED_TARGET_DEBT', 'OUTSIDE_POC'].includes(finding.scopeStatus),
      `Android adoption findings[${index}].scopeStatus unsupported`,
    );
    text(finding.summary, `Android adoption findings[${index}].summary`);
    refs(finding.sourceRefs ?? [], `Android adoption findings[${index}].sourceRefs`);
  }
  return structuredClone(input);
}

function normalizeSnapshot(input) {
  assert(input?.schemaVersion === VEXLIFE_ANDROID_POC_SNAPSHOT_SCHEMA, 'VexLife Android snapshot schema mismatch');
  stableRef(input.snapshotRef, 'snapshotRef');
  stableRef(input.productRef, 'productRef');
  text(input.label, 'label');
  stableRef(input.sourceRevisionRef, 'sourceRevisionRef');
  refs(input.sourceRefs, 'sourceRefs');
  stableRef(input.designRef, 'designRef');
  relativeJsonLocation(input.designLocation, 'designLocation');

  const profile = input.referenceProfile;
  stableRef(profile?.profileRef, 'referenceProfile.profileRef');
  for (const key of [
    'widthDp', 'heightDp', 'toolbarHeightDp', 'bottomBarHeightDp',
    'screenPaddingDp', 'containerPaddingDp', 'containerGapDp', 'listGapDp',
  ]) positive(profile?.[key], `referenceProfile.${key}`);

  stableRef(input.home?.screenRef, 'home.screenRef');
  stableRef(input.vexStream?.screenRef, 'vexStream.screenRef');
  stableRef(input.vexStream?.libraryActionsContainerRef, 'vexStream.libraryActionsContainerRef');
  assert(Array.isArray(input.vexStream?.states) && input.vexStream.states.length === 3,
    'VexStream POC requires exactly three library state projections');
  const stateKinds = input.vexStream.states.map((state) => state.kind).sort();
  assert(JSON.stringify(stateKinds) === JSON.stringify(['EMPTY', 'LOADED', 'LOADING']),
    'VexStream POC state kinds must be LOADING / EMPTY / LOADED');
  normalizeAdoptionCoverage(input.adoptionCoverage);

  return structuredClone(input);
}

export function summarizeAndroidPocAdoptionReadiness(coverageInput) {
  const coverage = normalizeAdoptionCoverage(coverageInput);
  const blockingFindings = (coverage.findings ?? []).filter(
    (finding) => finding.blockingForPocAuthority === true,
  );
  return Object.freeze({
    schemaVersion: 'vexlife-android.vexboard-adoption-readiness/poc-v1',
    status: blockingFindings.length ? 'HELD' : 'CLEAR',
    blockingFindingRefs: Object.freeze(
      blockingFindings.map((finding) => finding.findingRef).sort(),
    ),
    identityExceptionCount: coverage.identityExceptions.length,
    findingCount: (coverage.findings ?? []).length,
  });
}

export function androidPocDesignLocation(snapshotInput) {
  return normalizeSnapshot(snapshotInput).designLocation;
}

const scaled = (dp) => Math.round(dp * DP_TO_BOARD * 10) / 10;
const rect = (x, y, width, height) => ({ x, y, width, height });

function node(nodeRef, kind, label, parentRefOrNull, sourceRefs, detailBoardRefOrNull = null) {
  return {
    nodeRef: stableRef(nodeRef, 'nodeRef'),
    kind,
    label: text(label, `${nodeRef}.label`),
    parentRefOrNull,
    detailBoardRefOrNull,
    sourceRefs: refs(sourceRefs, `${nodeRef}.sourceRefs`),
  };
}

function rel(relationshipRef, kind, fromRef, toRef, labelOrNull, sourceRefs) {
  return {
    relationshipRef: stableRef(relationshipRef, 'relationshipRef'),
    kind,
    fromRef: stableRef(fromRef, `${relationshipRef}.fromRef`),
    toRef: stableRef(toRef, `${relationshipRef}.toRef`),
    labelOrNull,
    sourceRefs: refs(sourceRefs, `${relationshipRef}.sourceRefs`),
  };
}

function projectionItem(projectionItemRef, semanticRef, shapeKind, bounds, layer, parentProjectionItemRefOrNull = null) {
  return {
    projectionItemRef: stableRef(projectionItemRef, 'projectionItemRef'),
    semanticRef: stableRef(semanticRef, `${projectionItemRef}.semanticRef`),
    shapeKind,
    bounds,
    layer,
    parentProjectionItemRefOrNull,
    visible: true,
    locked: true,
  };
}

function presentationHint(
  projectionItemRef,
  role,
  variant = null,
  styleRef = null,
  typographyRef = null,
  colorRef = null,
) {
  return { projectionItemRef, role, variant, styleRef, typographyRef, colorRef };
}

function componentPresentationHint(design, projectionItemRef, semanticRef, { selected = false } = {}) {
  const assignment = screenDesignComponentAssignment(design, semanticRef);
  const styleRef = selected && assignment.selectedStyleRefOrNull
    ? assignment.selectedStyleRefOrNull
    : assignment.styleRef;
  const iconVariant = assignment.iconRefOrNull
    ? assignment.iconRefOrNull.split('.').at(-1).toUpperCase()
    : null;
  const templateRoles = {
    'component.surface': 'SURFACE',
    'component.column': 'CONTENT_COLUMN',
    'component.text': 'TEXT',
    'component.button': 'BUTTON',
    'component.icon-button': 'ICON_BUTTON',
    'component.tab': 'TAB',
    'component.fab': 'FAB',
    'component.modal-bottom-sheet': 'MODAL_SHEET',
  };
  const role = templateRoles[assignment.templateRef];
  assert(role, `Android presentation template unsupported: ${assignment.templateRef}`);

  let variant = null;
  if (assignment.templateRef === 'component.icon-button' || assignment.templateRef === 'component.fab') {
    variant = iconVariant;
  } else if (assignment.templateRef === 'component.text') {
    variant = assignment.typographyRefOrNull
      ? String(assignment.typographyRefOrNull).replace(/[A-Z]/g, (match) => '_' + match).toUpperCase()
      : null;
  } else if (assignment.templateRef === 'component.tab') {
    variant = selected ? 'SELECTED' : 'DEFAULT';
  } else if (styleRef === 'style.surface.raised') {
    variant = 'RAISED';
  } else if (styleRef === 'style.action.primary') {
    variant = 'PRIMARY';
  } else if (styleRef === 'style.action.secondary') {
    variant = 'SECONDARY';
  } else if (styleRef === 'style.action.danger') {
    variant = 'DANGER';
  } else if (styleRef === 'style.navigation') {
    variant = 'NAVIGATION';
  }

  return presentationHint(
    projectionItemRef,
    role,
    variant,
    styleRef,
    assignment.typographyRefOrNull ?? null,
    assignment.colorRefOrNull ?? null,
  );
}

function stripFingerprint(value) {
  const copy = structuredClone(value);
  delete copy.semanticFingerprint;
  return copy;
}

function makePresentation(profile, hints, sourceRefs, relationshipRoutes = []) {
  return Object.freeze({
    schemaVersion: VEXBOARD_ANDROID_REFERENCE_PRESENTATION_SCHEMA,
    profileRef: profile.profileRef,
    referenceViewport: Object.freeze({
      widthDp: profile.widthDp,
      heightDp: profile.heightDp,
      fontScale: profile.fontScale ?? 1,
      densityIndependent: true,
      boardScalePerDp: DP_TO_BOARD,
    }),
    items: Object.freeze(hints.map((entry) => Object.freeze({ ...entry }))),
    relationships: Object.freeze(relationshipRoutes.map((entry) => Object.freeze({ ...entry }))),
    sourceRefs: Object.freeze(refs(sourceRefs, 'presentation.sourceRefs')),
  });
}

function makeDraft({
  draftRef,
  title,
  graph,
  projection,
  presentation,
  design = null,
  adoptionCoverage = null,
  adoptionReadiness = null,
  sourceRefs,
}) {
  return Object.freeze({
    schemaVersion: 'vexboard.local-draft/v1',
    draftRef,
    title,
    mode: 'READ_ONLY_SOURCE',
    derivedFromRefOrNull: null,
    savedAtOrNull: null,
    graph: stripFingerprint(graph),
    projection: stripFingerprint(projection),
    presentation,
    ...(design ? { design: normalizeScreenDesign(design) } : {}),
    ...(adoptionCoverage ? { adoptionCoverage: normalizeAdoptionCoverage(adoptionCoverage) } : {}),
    ...(adoptionReadiness ? { adoptionReadiness: structuredClone(adoptionReadiness) } : {}),
    sourceRefs: refs(sourceRefs, 'draft.sourceRefs'),
  });
}

function sourceUnion(snapshot, design, ...groups) {
  return refs([
    snapshot.snapshotRef,
    snapshot.sourceRevisionRef,
    snapshot.designRef,
    ...snapshot.sourceRefs,
    ...(design.sourceRefs ?? []),
    ...groups.flat(),
  ], 'source union');
}

function screenDesignConstraint(design, occurrenceRef) {
  const constraint = design.constraints.find((entry) => entry.occurrenceRef === occurrenceRef);
  assert(constraint, `screen design constraint missing: ${occurrenceRef}`);
  return constraint;
}

function designForSnapshot(snapshot, designInput) {
  const design = normalizeScreenDesign(designInput);
  assert(design.designRef === snapshot.designRef, 'Android snapshot designRef mismatch');
  assert(design.referenceViewport.profileRef === snapshot.referenceProfile.profileRef,
    'Android snapshot/design profileRef mismatch');
  assert(design.referenceViewport.widthDp === snapshot.referenceProfile.widthDp,
    'Android snapshot/design reference width mismatch');
  assert(design.referenceViewport.heightDp === snapshot.referenceProfile.heightDp,
    'Android snapshot/design reference height mismatch');

  for (const occurrenceRef of [
    'design-occurrence.home.shell-content',
    'design-occurrence.home.inner-content',
    'design-occurrence.vexstream.shell-content',
    'design-occurrence.vexstream.inner-content',
  ]) screenDesignConstraint(design, occurrenceRef);

  return design;
}

function resolvedDesignMetric(design, metricRef, actualExtentDp) {
  const metric = design.metrics?.[metricRef];
  assert(metric, `screen design metric missing: ${metricRef}`);
  return resolveBoundedResponsiveMetric(metric, actualExtentDp);
}

function profileMetrics(profile, design, screenKey) {
  const viewport = { x: 0, y: 0, width: profile.widthDp, height: profile.heightDp };
  const shellConstraint = screenDesignConstraint(design, `design-occurrence.${screenKey}.shell-content`);
  const innerConstraint = screenDesignConstraint(design, `design-occurrence.${screenKey}.inner-content`);
  const shell = resolveScreenDesignConstraintBox({
    designInput: design,
    parentBoundsDp: viewport,
    constraintInput: shellConstraint,
  });
  const inner = resolveScreenDesignConstraintBox({
    designInput: design,
    parentBoundsDp: shell,
    constraintInput: innerConstraint,
  });

  const mW = (metricRef) => scaled(resolvedDesignMetric(design, metricRef, profile.widthDp));
  const mH = (metricRef) => scaled(resolvedDesignMetric(design, metricRef, profile.heightDp));
  const trackRowHeightDp =
    (resolvedDesignMetric(design, 'trackOuterPaddingVertical', profile.heightDp) * 2)
    + (resolvedDesignMetric(design, 'trackInnerPaddingVertical', profile.heightDp) * 2)
    + resolvedDesignMetric(design, 'trackArtworkSize', profile.widthDp);

  return Object.freeze({
    width: scaled(profile.widthDp),
    height: scaled(profile.heightDp),
    toolbar: mH('toolbarHeight'),
    bottomBar: mH('bottomBarHeight'),
    screenPaddingHorizontal: mW('screenPaddingHorizontal'),
    screenPaddingVertical: mH('screenPaddingVertical'),
    innerHorizontal: mW('containerPaddingHorizontal'),
    innerVertical: mH('containerPaddingVertical'),
    gapVertical: mH('containerGapVertical'),
    listGap: mH('listGapVertical'),
    homeSectionGap: mH('homeSectionGapVertical'),
    toolbarPaddingHorizontal: mW('toolbarPaddingHorizontal'),
    toolbarPaddingVertical: mH('toolbarPaddingVertical'),
    toolbarGapHorizontal: mW('toolbarGapHorizontal'),
    toolbarActionSize: mW('toolbarActionSize'),
    tabGapHorizontal: mW('tabGapHorizontal'),
    tabColumnGapVertical: mH('tabColumnGapVertical'),
    buttonMinHeight: mH('materialButtonMinHeight'),
    connectionSheetPaddingHorizontal: mW('connectionSheetPaddingHorizontal'),
    connectionSheetPaddingBottom: mH('connectionSheetPaddingBottom'),
    loadingStatusPaddingHorizontal: mW('loadingStatusPaddingHorizontal'),
    loadingStatusPaddingVertical: mH('loadingStatusPaddingVertical'),
    loadingStatusGapHorizontal: mW('loadingStatusGapHorizontal'),
    loadingProgressSize: mW('loadingProgressSize'),
    emptyMessagePadding: mW('emptyMessagePadding'),
    trackOuterPaddingHorizontal: mW('trackOuterPaddingHorizontal'),
    trackOuterPaddingVertical: mH('trackOuterPaddingVertical'),
    trackInnerPaddingHorizontal: mW('trackInnerPaddingHorizontal'),
    trackInnerPaddingVertical: mH('trackInnerPaddingVertical'),
    trackRowGapHorizontal: mW('trackRowGapHorizontal'),
    trackArtworkSize: mW('trackArtworkSize'),
    trackCopyGapVertical: mH('trackCopyGapVertical'),
    trackRowHeight: scaled(trackRowHeightDp),
    content: Object.freeze({
      x: scaled(inner.x),
      y: scaled(inner.y),
      width: scaled(inner.width),
      height: scaled(inner.height),
    }),
    contentDp: Object.freeze({
      x: inner.x,
      y: inner.y,
      width: inner.width,
      height: inner.height,
    }),
  });
}

function semanticLeaf(semanticRef) {
  const leaf = String(semanticRef).split('.').at(-1);
  return stableRef(leaf, 'semantic leaf');
}

function semanticTail(semanticRef, prefix) {
  const value = String(semanticRef);
  assert(value.startsWith(prefix), `semantic ref ${value} must start with ${prefix}`);
  return stableRef(value.slice(prefix.length), 'semantic tail');
}

function orderedDesignChildren(design, layoutRef, values, refOf) {
  const rule = screenDesignLayoutRule(design, layoutRef);
  if (!Array.isArray(rule.childSemanticRefs)) return [...values];
  const byRef = new Map(values.map((value) => [refOf(value), value]));
  assert(byRef.size === values.length, `${layoutRef} source children must have unique refs`);
  assert(rule.childSemanticRefs.length === values.length,
    `${layoutRef} design/source child count mismatch`);
  return rule.childSemanticRefs.map((childRef) => {
    const value = byRef.get(childRef);
    assert(value, `${layoutRef} design child missing from source: ${childRef}`);
    return value;
  });
}

function addActionNodes(nodes, section, ownerScreenRef) {
  nodes.push(node(section.ref, 'CONTAINER', section.label, ownerScreenRef, section.sourceRefs));
  for (const action of section.actions) {
    nodes.push(node(action.ref, 'CONTROL', action.label, section.ref, action.sourceRefs));
  }
}

function experienceBoard(snapshot, design, viewportProfile) {
  const homeMetrics = profileMetrics(viewportProfile, design, 'home');
  const vexMetrics = profileMetrics(viewportProfile, design, 'vexstream');
  const graphRef = 'graph.vexlife-android.home-vexstream.poc';
  const projectionRef = 'projection.vexlife-android.home-vexstream.poc';
  const sourceRefs = sourceUnion(snapshot, design, snapshot.home.sourceRefs, snapshot.vexStream.sourceRefs);
  const nodes = [];
  const relationships = [];
  const items = [];
  const hints = [];
  let layer = 1;

  nodes.push(node(snapshot.productRef, 'CONTAINER', snapshot.label, null, sourceRefs));
  nodes.push(node(snapshot.home.screenRef, 'SCENE', snapshot.home.label, snapshot.productRef, snapshot.home.sourceRefs));
  nodes.push(node(snapshot.vexStream.screenRef, 'SCENE', snapshot.vexStream.label, snapshot.productRef, snapshot.vexStream.sourceRefs));

  addActionNodes(nodes, snapshot.home.vexStreamSection, snapshot.home.screenRef);
  addActionNodes(nodes, snapshot.home.systemsSection, snapshot.home.screenRef);

  const knownScreens = new Set([snapshot.home.screenRef, snapshot.vexStream.screenRef]);
  const externalScreens = new Set();
  for (const section of [snapshot.home.vexStreamSection, snapshot.home.systemsSection]) {
    for (const action of section.actions) {
      if (!action.targetScreenRefOrNull) continue;
      if (!knownScreens.has(action.targetScreenRefOrNull) && !externalScreens.has(action.targetScreenRefOrNull)) {
        externalScreens.add(action.targetScreenRefOrNull);
        nodes.push(node(
          action.targetScreenRefOrNull,
          'REFERENCE',
          `Destination · ${action.label}`,
          snapshot.productRef,
          action.sourceRefs,
        ));
      }
      relationships.push(rel(
        `rel.vexlife-android.${action.ref}.navigate`,
        'TRANSITION',
        action.ref,
        action.targetScreenRefOrNull,
        'Navigate',
        action.sourceRefs,
      ));
    }
  }

  const homeTitleRef = 'annotation.vexlife-android.home.toolbar-title';
  const homeStatusRef = 'annotation.vexlife-android.home.vexstream-status';
  const homeBodyRef = 'annotation.vexlife-android.home.vexstream-body';
  nodes.push(node(homeTitleRef, 'ANNOTATION', snapshot.home.label, snapshot.home.screenRef, snapshot.home.sourceRefs));
  nodes.push(node(homeStatusRef, 'ANNOTATION', snapshot.home.vexStreamSection.status, snapshot.home.vexStreamSection.ref, snapshot.home.vexStreamSection.sourceRefs));
  nodes.push(node(homeBodyRef, 'ANNOTATION', snapshot.home.vexStreamSection.body, snapshot.home.vexStreamSection.ref, snapshot.home.vexStreamSection.sourceRefs));

  const vexTitleRef = 'annotation.vexstream.toolbar-title';
  nodes.push(node(vexTitleRef, 'ANNOTATION', snapshot.vexStream.label, snapshot.vexStream.screenRef, snapshot.vexStream.sourceRefs));
  for (const action of snapshot.vexStream.toolbarActions) {
    nodes.push(node(action.ref, 'CONTROL', action.label, snapshot.vexStream.screenRef, action.sourceRefs));
  }

  nodes.push(node(snapshot.vexStream.tabsContainerRef, 'CONTAINER', 'Library tabs', snapshot.vexStream.screenRef, snapshot.vexStream.sourceRefs));
  for (const tab of snapshot.vexStream.tabs) {
    nodes.push(node(tab.ref, 'CONTROL', tab.label, snapshot.vexStream.tabsContainerRef, tab.sourceRefs));
  }

  for (const state of snapshot.vexStream.states) {
    nodes.push(node(state.stateRef, 'REFERENCE', state.label, snapshot.vexStream.screenRef, state.sourceRefs));
    relationships.push(rel(
      `rel.vexlife-android.vexstream.state.${state.kind.toLowerCase()}`,
      'REFERENCE',
      snapshot.vexStream.screenRef,
      state.stateRef,
      state.label,
      state.sourceRefs,
    ));
  }

  const loading = snapshot.vexStream.states.find((state) => state.kind === 'LOADING');
  const empty = snapshot.vexStream.states.find((state) => state.kind === 'EMPTY');
  const loaded = snapshot.vexStream.states.find((state) => state.kind === 'LOADED');
  const loadingMessageRef = 'annotation.vexstream.loading-message';
  const emptyMessageRef = 'annotation.vexstream.empty-message';
  nodes.push(node(loadingMessageRef, 'ANNOTATION', loading.message, snapshot.vexStream.screenRef, loading.sourceRefs));
  nodes.push(node(emptyMessageRef, 'ANNOTATION', empty.message, snapshot.vexStream.screenRef, empty.sourceRefs));

  for (const track of loaded.sampleTracks) {
    nodes.push(node(track.ref, 'REFERENCE', `${track.title}\n${track.subtitle}`, snapshot.vexStream.screenRef, track.sourceRefs));
  }
  nodes.push(node(
    snapshot.vexStream.libraryActionsContainerRef,
    'CONTAINER',
    'Library actions',
    snapshot.vexStream.screenRef,
    snapshot.vexStream.sourceRefs,
  ));
  for (const action of snapshot.vexStream.libraryActions) {
    nodes.push(node(
      action.ref,
      'CONTROL',
      action.label,
      snapshot.vexStream.libraryActionsContainerRef,
      action.sourceRefs,
    ));
  }

  const sheet = snapshot.vexStream.connectionSheet;
  nodes.push(node(sheet.ref, 'CONTAINER', sheet.label, snapshot.vexStream.screenRef, sheet.sourceRefs));
  nodes.push(node(
    sheet.content.ref,
    'CONTAINER',
    'Connection sheet content',
    sheet.ref,
    sheet.content.sourceRefs,
  ));
  for (const textItem of sheet.content.texts) {
    nodes.push(node(
      textItem.ref,
      'ANNOTATION',
      textItem.label,
      sheet.content.ref,
      sheet.content.sourceRefs,
    ));
  }
  for (const action of sheet.actions) {
    nodes.push(node(action.ref, 'CONTROL', action.label, sheet.ref, action.sourceRefs));
  }
  relationships.push(rel(
    'rel.vexlife-android.vexstream.manage-connection.open',
    'FLOW',
    sheet.triggerRef,
    sheet.ref,
    'OPEN',
    sheet.sourceRefs,
  ));

  const portalRef = 'portal.vexlife-android.vexstream-depth';
  nodes.push(node(
    portalRef,
    'PORTAL',
    'Under the hood · data / storage / service',
    snapshot.vexStream.screenRef,
    sourceRefs,
    VEXBOARD_ANDROID_POC_BOARD_REFS.DEPTH,
  ));
  relationships.push(rel(
    'rel.vexlife-android.vexstream.architecture-depth',
    'REFERENCE',
    snapshot.vexStream.screenRef,
    portalRef,
    'Architecture depth',
    sourceRefs,
  ));

  const productItemRef = 'item.vexlife-android.product';
  items.push(projectionItem(productItemRef, snapshot.productRef, 'FRAME', rect(24, 18, 1120, 2300), layer++));
  hints.push(presentationHint(productItemRef, 'PRODUCT_FRAME'));

  // Horizontal traversal: Home -> VexStream anchor. State alternatives branch vertically.
  const home = { x: 70, y: 820, width: homeMetrics.width, height: homeMetrics.height };
  const anchor = { x: 470, y: 1100, width: 210, height: 90 };
  const states = {
    LOADING: { x: 790, y: 60, width: vexMetrics.width, height: vexMetrics.height },
    EMPTY: { x: 790, y: 820, width: vexMetrics.width, height: vexMetrics.height },
    LOADED: { x: 790, y: 1580, width: vexMetrics.width, height: vexMetrics.height },
  };

  items.push(projectionItem('item.home.screen', snapshot.home.screenRef, 'FRAME', rect(home.x, home.y, home.width, home.height), layer++, productItemRef));
  hints.push(presentationHint('item.home.screen', 'SCREEN_FRAME', 'HOME'));
  items.push(projectionItem('item.vexstream.screen-anchor', snapshot.vexStream.screenRef, 'RECTANGLE', rect(anchor.x, anchor.y, anchor.width, anchor.height), layer++, productItemRef));
  hints.push(presentationHint('item.vexstream.screen-anchor', 'SCREEN_ANCHOR'));

  items.push(projectionItem('item.home.toolbar', homeTitleRef, 'RECTANGLE', rect(home.x, home.y, home.width, homeMetrics.toolbar), layer++, 'item.home.screen'));
  hints.push(presentationHint('item.home.toolbar', 'TOOLBAR'));

  const innerX = home.x + homeMetrics.content.x;
  const innerWidth = homeMetrics.content.width;
  let y = home.y + homeMetrics.content.y;

  const homeSections = orderedDesignChildren(
    design,
    'layout.vexlife.home.body',
    [
      { semanticRef: snapshot.home.vexStreamSection.ref, kind: 'VEXSTREAM' },
      { semanticRef: snapshot.home.systemsSection.ref, kind: 'SYSTEMS' },
    ],
    (section) => section.semanticRef,
  );

  for (const [sectionIndex, section] of homeSections.entries()) {
    if (section.kind === 'VEXSTREAM') {
      const sectionHeight = 230;
      items.push(projectionItem(
        'item.home.vexstream-section',
        snapshot.home.vexStreamSection.ref,
        'RECTANGLE',
        rect(innerX, y, innerWidth, sectionHeight),
        layer++,
        'item.home.screen',
      ));
      hints.push(componentPresentationHint(
        design,
        'item.home.vexstream-section',
        snapshot.home.vexStreamSection.ref,
      ));
      items.push(projectionItem(
        'item.home.vexstream-status',
        homeStatusRef,
        'TEXT',
        rect(
          innerX + homeMetrics.innerHorizontal,
          y + 36,
          innerWidth - homeMetrics.innerHorizontal * 2,
          58,
        ),
        layer++,
        'item.home.vexstream-section',
      ));
      hints.push(presentationHint('item.home.vexstream-status', 'TEXT', 'TITLE'));
      items.push(projectionItem(
        'item.home.vexstream-body',
        homeBodyRef,
        'TEXT',
        rect(
          innerX + homeMetrics.innerHorizontal,
          y + 103,
          innerWidth - homeMetrics.innerHorizontal * 2,
          70,
        ),
        layer++,
        'item.home.vexstream-section',
      ));
      hints.push(presentationHint('item.home.vexstream-body', 'TEXT', 'SUPPORTING'));
      const openAction = snapshot.home.vexStreamSection.actions[0];
      items.push(projectionItem(
        'item.home.vexstream-open',
        openAction.ref,
        'RECTANGLE',
        rect(
          innerX + homeMetrics.innerHorizontal,
          y + 180,
          innerWidth - homeMetrics.innerHorizontal * 2,
          homeMetrics.buttonMinHeight,
        ),
        layer++,
        'item.home.vexstream-section',
      ));
      hints.push(componentPresentationHint(design, 'item.home.vexstream-open', openAction.ref));
      y += sectionHeight;
    } else if (section.kind === 'SYSTEMS') {
      const sectionHeight = 250;
      items.push(projectionItem(
        'item.home.systems-section',
        snapshot.home.systemsSection.ref,
        'RECTANGLE',
        rect(innerX, y, innerWidth, sectionHeight),
        layer++,
        'item.home.screen',
      ));
      hints.push(componentPresentationHint(
        design,
        'item.home.systems-section',
        snapshot.home.systemsSection.ref,
      ));
      let systemY = y + homeMetrics.innerVertical;
      const systemActions = orderedDesignChildren(
        design,
        'layout.vexlife.home.systems',
        snapshot.home.systemsSection.actions,
        (action) => action.ref,
      );
      for (const action of systemActions) {
        const itemRef = `item.home.system-action.${semanticLeaf(action.ref)}`;
        items.push(projectionItem(
          itemRef,
          action.ref,
          'RECTANGLE',
          rect(
            innerX + homeMetrics.innerHorizontal,
            systemY,
            innerWidth * 0.72,
            homeMetrics.buttonMinHeight,
          ),
          layer++,
          'item.home.systems-section',
        ));
        hints.push(componentPresentationHint(design, itemRef, action.ref));
        systemY += homeMetrics.buttonMinHeight + homeMetrics.gapVertical;
      }
      y += sectionHeight;
    }
    if (sectionIndex < homeSections.length - 1) y += homeMetrics.homeSectionGap;
  }

  function addVexStreamChrome(state, frame, frameItemRef) {
    const actionItemBySemanticRef = new Map();
    const stateChipItemRef = `${frameItemRef}.condition`;
    items.push(projectionItem(stateChipItemRef, state.stateRef, 'RECTANGLE', rect(frame.x + 8, frame.y - 28, 150, 24), layer++, productItemRef));
    hints.push(presentationHint(stateChipItemRef, 'STATE_CHIP', state.kind));
    items.push(projectionItem(frameItemRef, snapshot.vexStream.screenRef, 'FRAME', rect(frame.x, frame.y, frame.width, frame.height), layer++, productItemRef));
    hints.push(presentationHint(frameItemRef, 'SCREEN_FRAME', state.kind));

    const titleItem = `${frameItemRef}.toolbar`;
    items.push(projectionItem(titleItem, vexTitleRef, 'RECTANGLE', rect(frame.x, frame.y, frame.width, vexMetrics.toolbar), layer++, frameItemRef));
    hints.push(presentationHint(titleItem, 'TOOLBAR'));

    const iconSize = vexMetrics.toolbarActionSize;
    let iconX = frame.x + frame.width - vexMetrics.toolbarPaddingHorizontal - iconSize;
    [...snapshot.vexStream.toolbarActions].reverse().forEach((action) => {
      const itemRef = `${frameItemRef}.toolbar-action.${semanticTail(
        action.ref,
        'element.vexstream-music.body.',
      )}`;
      items.push(projectionItem(itemRef, action.ref, 'RECTANGLE', rect(iconX, frame.y + vexMetrics.toolbarPaddingVertical, iconSize, iconSize), layer++, frameItemRef));
      hints.push(componentPresentationHint(design, itemRef, action.ref));
      actionItemBySemanticRef.set(action.ref, itemRef);
      iconX -= iconSize + vexMetrics.toolbarGapHorizontal;
    });

    const tabsY = frame.y + vexMetrics.content.y;
    const tabGap = vexMetrics.tabGapHorizontal;
    const tabsViewportRef = `${frameItemRef}.tabs-viewport`;
    items.push(projectionItem(
      tabsViewportRef,
      snapshot.vexStream.tabsContainerRef,
      'RECTANGLE',
      rect(frame.x + vexMetrics.content.x, tabsY, vexMetrics.content.width, vexMetrics.buttonMinHeight),
      layer++,
      frameItemRef,
    ));
    hints.push(presentationHint(tabsViewportRef, 'SCROLL_VIEWPORT', 'HORIZONTAL'));

    let tabX = frame.x + vexMetrics.content.x;
    const orderedTabs = orderedDesignChildren(
      design,
      'layout.vexstream.library-tabs',
      snapshot.vexStream.tabs,
      (tab) => tab.ref,
    );
    for (const tab of orderedTabs) {
      const itemRef = `${frameItemRef}.tab.${semanticLeaf(tab.ref)}`;
      const intrinsic = design.intrinsicSizes?.[tab.ref];
      assert(intrinsic, `screen design intrinsic size missing: ${tab.ref}`);
      items.push(projectionItem(
        itemRef,
        tab.ref,
        'RECTANGLE',
        rect(tabX, tabsY, scaled(intrinsic.widthDp), scaled(intrinsic.heightDp)),
        layer++,
        tabsViewportRef,
      ));
      const selected = tab.ref === 'element.vexstream-music.body.library-tabs.songs';
      hints.push(componentPresentationHint(design, itemRef, tab.ref, { selected }));
      tabX += scaled(intrinsic.widthDp) + tabGap;
    }
    return Object.freeze({
      contentY: tabsY + vexMetrics.buttonMinHeight + vexMetrics.listGap,
      actionItemBySemanticRef,
      tabsViewportRef,
    });
  }

  const loadingFrame = states.LOADING;
  const loadingItem = 'item.vexstream.state.loading';
  const loadingChrome = addVexStreamChrome(loading, loadingFrame, loadingItem);
  const loadingStatusHeight = vexMetrics.loadingProgressSize + (vexMetrics.loadingStatusPaddingVertical * 2);
  items.push(projectionItem(`${loadingItem}.status`, loadingMessageRef, 'RECTANGLE', rect(
    loadingFrame.x,
    loadingChrome.contentY,
    loadingFrame.width,
    loadingStatusHeight,
  ), layer++, loadingItem));
  hints.push(presentationHint(`${loadingItem}.status`, 'STATUS_ROW', 'LOADING'));

  const emptyFrame = states.EMPTY;
  const emptyItem = 'item.vexstream.state.empty';
  const emptyChrome = addVexStreamChrome(empty, emptyFrame, emptyItem);
  items.push(projectionItem(`${emptyItem}.message`, emptyMessageRef, 'TEXT', rect(
    emptyFrame.x + vexMetrics.emptyMessagePadding,
    emptyChrome.contentY + vexMetrics.emptyMessagePadding,
    emptyFrame.width - (vexMetrics.emptyMessagePadding * 2),
    vexMetrics.buttonMinHeight,
  ), layer++, emptyItem));
  hints.push(presentationHint(`${emptyItem}.message`, 'TEXT', 'EMPTY'));

  const loadedFrame = states.LOADED;
  const loadedItem = 'item.vexstream.state.loaded';
  const loadedChrome = addVexStreamChrome(loaded, loadedFrame, loadedItem);
  let loadedY = loadedChrome.contentY;
  loaded.sampleTracks.forEach((track, index) => {
    const itemRef = `${loadedItem}.track.${index}`;
    items.push(projectionItem(itemRef, track.ref, 'RECTANGLE', rect(
      loadedFrame.x + vexMetrics.trackOuterPaddingHorizontal,
      loadedY,
      loadedFrame.width - (vexMetrics.trackOuterPaddingHorizontal * 2),
      vexMetrics.trackRowHeight,
    ), layer++, loadedItem));
    hints.push(presentationHint(itemRef, 'LIST_ROW', track.variant));
    loadedY += vexMetrics.trackRowHeight + vexMetrics.listGap;
  });
  const libraryActions = orderedDesignChildren(
    design,
    'layout.vexstream.library-actions',
    snapshot.vexStream.libraryActions,
    (action) => action.ref,
  );
  const fabAnchorRule = screenDesignAnchorRule(design, 'anchor.vexstream.library-actions');
  const fabSizeDp = resolveBoundedResponsiveMetric(
    design.metrics.smallFabSize,
    viewportProfile.widthDp,
  );
  const fabGapDp = resolveBoundedResponsiveMetric(
    design.metrics.libraryFabGapVertical,
    viewportProfile.heightDp,
  );
  const fabClusterHeightDp =
    (libraryActions.length * fabSizeDp) +
    (Math.max(0, libraryActions.length - 1) * fabGapDp);
  const fabClusterDp = resolveScreenDesignAnchorBox({
    designInput: design,
    anchorRuleInput: fabAnchorRule,
    parentBoundsDp: vexMetrics.contentDp,
    widthDp: fabSizeDp,
    heightDp: fabClusterHeightDp,
  });
  const fabX = loadedFrame.x + scaled(fabClusterDp.x);
  let fabY = loadedFrame.y + scaled(fabClusterDp.y);
  for (const action of libraryActions) {
    const itemRef = `${loadedItem}.fab.${semanticLeaf(action.ref)}`;
    items.push(projectionItem(
      itemRef,
      action.ref,
      'ELLIPSE',
      rect(
        fabX,
        fabY,
        scaled(fabSizeDp),
        scaled(fabSizeDp),
      ),
      layer++,
      loadedItem,
    ));
    hints.push(componentPresentationHint(design, itemRef, action.ref));
    fabY += scaled(fabSizeDp + fabGapDp);
  }

  // Connection sheet: content-driven VexBoard design, bottom-anchored target overlay.
  const sheetLayout = screenDesignLayoutRule(design, 'layout.vexstream.connection-sheet');
  const sheetAnchor = screenDesignAnchorRule(design, 'anchor.vexstream.connection-sheet');
  const sheetMaxWidthDp = screenDesignVisualDimension(design, 'bottomSheetMaxWidthDp');
  const handleHeightDp = screenDesignVisualDimension(design, 'bottomSheetDragHandleHeightDp');
  const handleVerticalPaddingDp =
    screenDesignVisualDimension(design, 'bottomSheetDragHandleVerticalPaddingDp');
  const sheetWidthDp = Math.min(viewportProfile.widthDp, sheetMaxWidthDp);
  const sheetHorizontalPaddingDp = resolveBoundedResponsiveMetric(
    design.metrics.connectionSheetPaddingHorizontal,
    viewportProfile.widthDp,
  );
  const sheetBottomPaddingDp = resolveBoundedResponsiveMetric(
    design.metrics.connectionSheetPaddingBottom,
    viewportProfile.heightDp,
  );
  const sheetGapDp = resolveBoundedResponsiveMetric(
    design.metrics[sheetLayout.gapMetricRefOrNull],
    viewportProfile.heightDp,
  );
  const buttonHeightDp = resolveBoundedResponsiveMetric(
    design.metrics.materialButtonMinHeight,
    viewportProfile.heightDp,
  );
  const fontScale = viewportProfile.fontScale ?? 1;
  const sourceChildren = [
    ...sheet.content.texts.map((entry) => ({ ...entry, kind: 'TEXT' })),
    ...sheet.actions.map((entry) => ({ ...entry, kind: 'ACTION' })),
  ];
  const sheetChildren = orderedDesignChildren(
    design,
    'layout.vexstream.connection-sheet',
    sourceChildren,
    (entry) => entry.ref,
  );
  const childHeightDp = (entry) => {
    if (entry.kind === 'ACTION') return buttonHeightDp;
    const assignment = screenDesignComponentAssignment(design, entry.ref);
    const typographyRef = assignment.typographyRefOrNull;
    assert(typographyRef, `sheet text typography missing: ${entry.ref}`);
    const typography = design.visualTokens.typography[typographyRef];
    return Number(typography.lineHeightSp ?? typography.fontSizeSp) * fontScale;
  };
  const childHeightsDp = sheetChildren.map(childHeightDp);
  const dragHandleAreaDp = handleHeightDp + (handleVerticalPaddingDp * 2);
  const sheetContentHeightDp =
    childHeightsDp.reduce((sum, value) => sum + value, 0) +
    (Math.max(0, sheetChildren.length - 1) * sheetGapDp) +
    sheetBottomPaddingDp;
  const sheetHeightDp = dragHandleAreaDp + sheetContentHeightDp;
  const sheetDp = resolveScreenDesignAnchorBox({
    designInput: design,
    anchorRuleInput: sheetAnchor,
    parentBoundsDp: {
      x: 0,
      y: 0,
      width: viewportProfile.widthDp,
      height: viewportProfile.heightDp,
    },
    widthDp: sheetWidthDp,
    heightDp: sheetHeightDp,
  });
  const sheetBounds = rect(
    loadedFrame.x + scaled(sheetDp.x),
    loadedFrame.y + scaled(sheetDp.y),
    scaled(sheetDp.width),
    scaled(sheetDp.height),
  );
  items.push(projectionItem(
    'item.vexstream.connection-sheet',
    sheet.ref,
    'RECTANGLE',
    sheetBounds,
    layer + 50,
    loadedItem,
  ));
  hints.push(componentPresentationHint(
    design,
    'item.vexstream.connection-sheet',
    sheet.ref,
  ));

  const sheetContentItemRef = 'item.vexstream.connection-sheet.content';
  const sheetContentBounds = rect(
    sheetBounds.x + scaled(sheetHorizontalPaddingDp),
    sheetBounds.y + scaled(dragHandleAreaDp),
    sheetBounds.width - (scaled(sheetHorizontalPaddingDp) * 2),
    scaled(sheetContentHeightDp - sheetBottomPaddingDp),
  );
  items.push(projectionItem(
    sheetContentItemRef,
    sheet.content.ref,
    'RECTANGLE',
    sheetContentBounds,
    layer + 51,
    'item.vexstream.connection-sheet',
  ));
  hints.push(componentPresentationHint(
    design,
    sheetContentItemRef,
    sheet.content.ref,
  ));

  let sheetY = sheetContentBounds.y;
  sheetChildren.forEach((entry, index) => {
    const isAction = entry.kind === 'ACTION';
    const itemRef = isAction
      ? `item.vexstream.connection-sheet.action.${semanticLeaf(entry.ref)}`
      : `item.vexstream.connection-sheet.text.${semanticLeaf(entry.ref)}`;
    const heightDp = childHeightsDp[index];
    items.push(projectionItem(
      itemRef,
      entry.ref,
      isAction ? 'RECTANGLE' : 'TEXT',
      rect(
        sheetContentBounds.x,
        sheetY,
        sheetContentBounds.width,
        scaled(heightDp),
      ),
      layer + 60 + index,
      sheetContentItemRef,
    ));
    hints.push(componentPresentationHint(design, itemRef, entry.ref));
    sheetY += scaled(heightDp + sheetGapDp);
  });
  layer += 90;

  items.push(projectionItem('item.vexstream.depth-portal', portalRef, 'RECTANGLE', rect(460, 1230, 230, 80), layer++, productItemRef));
  hints.push(presentationHint('item.vexstream.depth-portal', 'DEPTH_PORTAL'));

  const graph = createBoardGraph({
    schemaVersion: 'vexboard.board-graph/v1',
    graphRef,
    nodes,
    relationships,
    sourceRefs,
  });
  const projection = createBoardProjection({
    schemaVersion: 'vexboard.board-projection/v1',
    projectionRef,
    graphRef,
    layoutIntent: 'SCREEN_FLOW',
    items,
    sourceRefs,
  }, graph);

  return makeDraft({
    draftRef: VEXBOARD_ANDROID_POC_BOARD_REFS.EXPERIENCE,
    title: 'VexLife Android · Home → VexStream · Screen / State POC',
    graph,
    projection,
    presentation: makePresentation(viewportProfile, hints, sourceRefs, [{
      relationshipRef: 'rel.vexlife-android.vexstream.manage-connection.open',
      fromProjectionItemRef: loadedChrome.actionItemBySemanticRef.get(sheet.triggerRef),
      toProjectionItemRef: 'item.vexstream.connection-sheet',
    }]),
    design,
    adoptionCoverage: snapshot.adoptionCoverage,
    adoptionReadiness: summarizeAndroidPocAdoptionReadiness(snapshot.adoptionCoverage),
    sourceRefs,
  });
}

function depthBoard(snapshot, design, viewportProfile) {
  const adoptionReadiness = summarizeAndroidPocAdoptionReadiness(snapshot.adoptionCoverage);
  const constructionPlan = compileVexLifeAndroidScreenDesign(
    design,
    { adoptionReadiness },
  );
  const graphRef = 'graph.vexlife-android.vexstream-depth.poc';
  const projectionRef = 'projection.vexlife-android.vexstream-depth.poc';
  const sourceRefs = sourceUnion(snapshot, design, snapshot.depth.sourceRefs, snapshot.depth.desktop.sourceRefs);
  const nodes = [];
  const relationships = [];
  const items = [];
  const hints = [];
  let layer = 1;

  const designNode = {
    ref: design.designRef,
    label: `VexBoard Screen Design · ${design.authorityState}`,
    sourceRefs: design.sourceRefs ?? [],
  };
  const constructionNode = {
    ref: constructionPlan.planRef,
    label: `Android construction plan · ${constructionPlan.admission}`,
    sourceRefs: constructionPlan.sourceRefs,
  };

  const entries = [
    designNode,
    constructionNode,
    snapshot.depth.repository,
    snapshot.depth.state,
    snapshot.depth.connectionStore,
    snapshot.depth.keystore,
    snapshot.depth.offlineIndex,
    snapshot.depth.mediaStore,
    snapshot.depth.artworkStore,
    snapshot.depth.playbackService,
    snapshot.depth.roomDatabase,
    snapshot.depth.desktop,
  ];

  nodes.push(node(snapshot.vexStream.screenRef, 'SCENE', snapshot.vexStream.label, null, snapshot.vexStream.sourceRefs));
  for (const entry of entries) {
    nodes.push(node(entry.ref, 'REFERENCE', entry.label, null, entry.sourceRefs));
  }
  for (const endpoint of snapshot.depth.desktop.endpoints) {
    nodes.push(node(endpoint.ref, 'REFERENCE', endpoint.label, snapshot.depth.desktop.ref, endpoint.sourceRefs));
  }

  const R = snapshot.depth.repository.ref;
  const S = snapshot.depth.state.ref;
  const screen = snapshot.vexStream.screenRef;
  const edgeSpecs = [
    ['screen-design','REFERENCE',screen,design.designRef,'design source'],
    ['design-construction','REFERENCE',design.designRef,constructionPlan.planRef,'Android target mapping'],
    ['screen-repository','DATA',screen,R,'observes / requests'],
    ['repository-state','DATA',R,S,'StateFlow'],
    ['repository-connection','DATA',R,snapshot.depth.connectionStore.ref,'remembered pairing'],
    ['connection-keystore','REFERENCE',snapshot.depth.connectionStore.ref,snapshot.depth.keystore.ref,'encrypted token / signing key'],
    ['repository-index','DATA',R,snapshot.depth.offlineIndex.ref,'offline restoration metadata'],
    ['repository-media','DATA',R,snapshot.depth.mediaStore.ref,'verified audio'],
    ['repository-artwork','DATA',R,snapshot.depth.artworkStore.ref,'persistent artwork'],
    ['screen-playback','REFERENCE',screen,snapshot.depth.playbackService.ref,'playback lifetime'],
    ['repository-desktop','DATA',R,snapshot.depth.desktop.ref,'pinned TLS / bearer'],
  ];
  for (const [suffix, kind, fromRef, toRef, label] of edgeSpecs) {
    relationships.push(rel(`rel.vexlife-android.depth.${suffix}`, kind, fromRef, toRef, label, sourceRefs));
  }
  for (const endpoint of snapshot.depth.desktop.endpoints) {
    relationships.push(rel(
      `rel.vexlife-android.depth.desktop.${endpoint.ref.split('.').at(-1)}`,
      'REFERENCE',
      snapshot.depth.desktop.ref,
      endpoint.ref,
      'exposes',
      endpoint.sourceRefs,
    ));
  }

  items.push(projectionItem('item.depth.screen', screen, 'RECTANGLE', rect(60, 420, 240, 100), layer++));
  hints.push(presentationHint('item.depth.screen', 'ARCH_NODE', 'SCREEN'));
  items.push(projectionItem('item.depth.design', design.designRef, 'RECTANGLE', rect(360, 90, 300, 110), layer++));
  hints.push(presentationHint('item.depth.design', 'ARCH_NODE', 'DESIGN'));
  items.push(projectionItem('item.depth.construction', constructionPlan.planRef, 'RECTANGLE', rect(720, 90, 320, 110), layer++));
  hints.push(presentationHint('item.depth.construction', 'ARCH_NODE', constructionPlan.admission));
  items.push(projectionItem('item.depth.repository', R, 'RECTANGLE', rect(380, 380, 290, 170), layer++));
  hints.push(presentationHint('item.depth.repository', 'ARCH_NODE', 'REPOSITORY'));
  items.push(projectionItem('item.depth.state', S, 'RECTANGLE', rect(420, 610, 220, 105), layer++));
  hints.push(presentationHint('item.depth.state', 'ARCH_NODE', 'STATE'));

  const locals = [
    snapshot.depth.connectionStore,
    snapshot.depth.keystore,
    snapshot.depth.offlineIndex,
    snapshot.depth.mediaStore,
    snapshot.depth.artworkStore,
    snapshot.depth.playbackService,
    snapshot.depth.roomDatabase,
  ];
  locals.forEach((entry, index) => {
    const itemRef = `item.depth.local.${index}`;
    items.push(projectionItem(itemRef, entry.ref, 'RECTANGLE', rect(760, 70 + index * 125, 280, 92), layer++));
    hints.push(presentationHint(itemRef, 'ARCH_NODE', entry.variant));
  });

  items.push(projectionItem('item.depth.desktop', snapshot.depth.desktop.ref, 'FRAME', rect(1130, 150, 350, 720), layer++));
  hints.push(presentationHint('item.depth.desktop', 'ARCH_GROUP', 'DESKTOP'));
  let endpointY = 245;
  snapshot.depth.desktop.endpoints.forEach((endpoint, index) => {
    const itemRef = `item.depth.endpoint.${index}`;
    items.push(projectionItem(itemRef, endpoint.ref, 'RECTANGLE', rect(1160, endpointY, 290, 60), layer++, 'item.depth.desktop'));
    hints.push(presentationHint(itemRef, 'API_ENDPOINT', endpoint.method));
    endpointY += 78;
  });

  const graph = createBoardGraph({
    schemaVersion: 'vexboard.board-graph/v1',
    graphRef,
    nodes,
    relationships,
    sourceRefs,
  });
  const projection = createBoardProjection({
    schemaVersion: 'vexboard.board-projection/v1',
    projectionRef,
    graphRef,
    layoutIntent: 'SYSTEM_MAP',
    items,
    sourceRefs,
  }, graph);

  return makeDraft({
    draftRef: VEXBOARD_ANDROID_POC_BOARD_REFS.DEPTH,
    title: 'VexLife Android · VexStream · Data / Storage / Desktop Service Depth',
    graph,
    projection,
    presentation: makePresentation(viewportProfile, hints, sourceRefs),
    design,
    adoptionCoverage: snapshot.adoptionCoverage,
    adoptionReadiness,
    sourceRefs,
  });
}

export function projectVexLifeAndroidPocSnapshot(
  snapshotInput,
  boardRef = VEXBOARD_ANDROID_POC_BOARD_REFS.EXPERIENCE,
  designInput = null,
  viewportProfileRefOrNull = null,
) {
  const snapshot = normalizeSnapshot(snapshotInput);
  stableRef(boardRef, 'boardRef');
  assert(designInput, 'VexLife Android POC requires one VexBoard Screen design');
  const design = designForSnapshot(snapshot, designInput);
  const viewportProfile = screenDesignViewportProfile(design, viewportProfileRefOrNull);

  let board;
  if (boardRef === VEXBOARD_ANDROID_POC_BOARD_REFS.EXPERIENCE) board = experienceBoard(snapshot, design, viewportProfile);
  else if (boardRef === VEXBOARD_ANDROID_POC_BOARD_REFS.DEPTH) board = depthBoard(snapshot, design, viewportProfile);
  else throw new TypeError(`unsupported VexLife Android POC boardRef ${boardRef}`);

  return Object.freeze({
    schemaVersion: 'vexboard.android-poc-projection/v1',
    snapshotRef: snapshot.snapshotRef,
    boardRef,
    viewportProfileRef: viewportProfile.profileRef,
    board,
    effects: Object.freeze({
      sourceMutationPerformed: false,
      externalEffectsPerformed: false,
    }),
  });
}

// [VXG RealForever][VEXWORK][VEXBOARD][VEXLIFE-ANDROID][SOURCE-PROJECTOR]
