import { createBoardGraph, createBoardProjection } from './vexboard.mjs';
import {
  VEXBOARD_SCREEN_DESIGN_SCHEMA,
  boundedResponsiveMetric,
  normalizeScreenDesign,
  resolveBoundedResponsiveMetric,
  resolveScreenDesignBox,
} from './vexboard-screen-design.mjs';

export const VEXLIFE_ANDROID_POC_SNAPSHOT_SCHEMA = 'vexlife-android.vexboard-snapshot/poc-v1';
export const VEXBOARD_ANDROID_REFERENCE_PRESENTATION_SCHEMA = 'vexboard.android-reference-presentation/v1';
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

function normalizeSnapshot(input) {
  assert(input?.schemaVersion === VEXLIFE_ANDROID_POC_SNAPSHOT_SCHEMA, 'VexLife Android snapshot schema mismatch');
  stableRef(input.snapshotRef, 'snapshotRef');
  stableRef(input.productRef, 'productRef');
  text(input.label, 'label');
  stableRef(input.sourceRevisionRef, 'sourceRevisionRef');
  refs(input.sourceRefs, 'sourceRefs');

  const profile = input.referenceProfile;
  stableRef(profile?.profileRef, 'referenceProfile.profileRef');
  for (const key of [
    'widthDp', 'heightDp', 'toolbarHeightDp', 'bottomBarHeightDp',
    'screenPaddingDp', 'containerPaddingDp', 'containerGapDp', 'listGapDp',
  ]) positive(profile?.[key], `referenceProfile.${key}`);

  stableRef(input.home?.screenRef, 'home.screenRef');
  stableRef(input.vexStream?.screenRef, 'vexStream.screenRef');
  assert(Array.isArray(input.vexStream?.states) && input.vexStream.states.length === 3,
    'VexStream POC requires exactly three library state projections');
  const stateKinds = input.vexStream.states.map((state) => state.kind).sort();
  assert(JSON.stringify(stateKinds) === JSON.stringify(['EMPTY', 'LOADED', 'LOADING']),
    'VexStream POC state kinds must be LOADING / EMPTY / LOADED');

  return structuredClone(input);
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

function presentationHint(projectionItemRef, role, variant = null) {
  return { projectionItemRef, role, variant };
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
      densityIndependent: true,
      boardScalePerDp: DP_TO_BOARD,
    }),
    items: Object.freeze(hints.map((entry) => Object.freeze({ ...entry }))),
    relationships: Object.freeze(relationshipRoutes.map((entry) => Object.freeze({ ...entry }))),
    sourceRefs: Object.freeze(refs(sourceRefs, 'presentation.sourceRefs')),
  });
}

function makeDraft({ draftRef, title, graph, projection, presentation, design = null, sourceRefs }) {
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
    sourceRefs: refs(sourceRefs, 'draft.sourceRefs'),
  });
}

function sourceUnion(snapshot, ...groups) {
  return refs([
    snapshot.snapshotRef,
    snapshot.sourceRevisionRef,
    ...snapshot.sourceRefs,
    ...groups.flat(),
  ], 'source union');
}

function reverseAdoptedScreenDesign(snapshot) {
  const profile = snapshot.referenceProfile;
  const metric = (referenceDp, referenceExtentDp) =>
    boundedResponsiveMetric({
      referenceDp,
      referenceExtentDp,
      minDp: referenceDp,
      maxDp: referenceDp,
    });

  const metrics = Object.freeze({
    toolbarHeight: metric(profile.toolbarHeightDp, profile.heightDp),
    bottomBarHeight: metric(profile.bottomBarHeightDp, profile.heightDp),
    screenPaddingHorizontal: metric(profile.screenPaddingDp, profile.widthDp),
    screenPaddingVertical: metric(profile.screenPaddingDp, profile.heightDp),
    containerPadding: metric(profile.containerPaddingDp, profile.widthDp),
    containerGap: metric(profile.containerGapDp, profile.widthDp),
    listGap: metric(profile.listGapDp, profile.heightDp),
  });

  const shellHorizontal = {
    size: { mode: 'FILL' },
    bias: 0.5,
  };
  const shellVertical = {
    startMargin: metrics.toolbarHeight,
    endMargin: metrics.bottomBarHeight,
    size: { mode: 'FILL' },
    bias: 0.5,
  };
  const innerHorizontal = {
    startMargin: metrics.screenPaddingHorizontal,
    endMargin: metrics.screenPaddingHorizontal,
    size: { mode: 'FILL' },
    bias: 0.5,
  };
  const innerVertical = {
    startMargin: metrics.screenPaddingVertical,
    endMargin: metrics.screenPaddingVertical,
    size: { mode: 'FILL' },
    bias: 0.5,
  };

  return Object.freeze({
    schemaVersion: VEXBOARD_SCREEN_DESIGN_SCHEMA,
    designRef: 'design.vexlife-android.home-vexstream.reverse-adopted',
    authorityState: 'REVERSE_ADOPTED_CANDIDATE',
    referenceViewport: Object.freeze({
      widthDp: profile.widthDp,
      heightDp: profile.heightDp,
    }),
    metrics,
    constraints: Object.freeze([
      Object.freeze({
        occurrenceRef: 'design-occurrence.home.shell-content',
        semanticRef: snapshot.home.screenRef,
        parentOccurrenceRefOrNull: null,
        horizontal: shellHorizontal,
        vertical: shellVertical,
      }),
      Object.freeze({
        occurrenceRef: 'design-occurrence.home.inner-content',
        semanticRef: snapshot.home.screenRef,
        parentOccurrenceRefOrNull: 'design-occurrence.home.shell-content',
        horizontal: innerHorizontal,
        vertical: innerVertical,
      }),
      Object.freeze({
        occurrenceRef: 'design-occurrence.vexstream.shell-content',
        semanticRef: snapshot.vexStream.screenRef,
        parentOccurrenceRefOrNull: null,
        horizontal: shellHorizontal,
        vertical: shellVertical,
      }),
      Object.freeze({
        occurrenceRef: 'design-occurrence.vexstream.inner-content',
        semanticRef: snapshot.vexStream.screenRef,
        parentOccurrenceRefOrNull: 'design-occurrence.vexstream.shell-content',
        horizontal: innerHorizontal,
        vertical: innerVertical,
      }),
    ]),
  });
}

function profileMetrics(profile, design) {
  const viewport = { x: 0, y: 0, width: profile.widthDp, height: profile.heightDp };
  const shell = resolveScreenDesignBox({
    parentBoundsDp: viewport,
    horizontal: design.constraints[0].horizontal,
    vertical: design.constraints[0].vertical,
  });
  const inner = resolveScreenDesignBox({
    parentBoundsDp: shell,
    horizontal: design.constraints[1].horizontal,
    vertical: design.constraints[1].vertical,
  });

  return Object.freeze({
    width: scaled(profile.widthDp),
    height: scaled(profile.heightDp),
    toolbar: scaled(resolveBoundedResponsiveMetric(design.metrics.toolbarHeight, profile.heightDp)),
    bottomBar: scaled(resolveBoundedResponsiveMetric(design.metrics.bottomBarHeight, profile.heightDp)),
    padding: scaled(resolveBoundedResponsiveMetric(design.metrics.screenPaddingHorizontal, profile.widthDp)),
    inner: scaled(resolveBoundedResponsiveMetric(design.metrics.containerPadding, profile.widthDp)),
    gap: scaled(resolveBoundedResponsiveMetric(design.metrics.containerGap, profile.widthDp)),
    listGap: scaled(resolveBoundedResponsiveMetric(design.metrics.listGap, profile.heightDp)),
    content: Object.freeze({
      x: scaled(inner.x),
      y: scaled(inner.y),
      width: scaled(inner.width),
      height: scaled(inner.height),
    }),
  });
}

function addActionNodes(nodes, section, ownerScreenRef) {
  nodes.push(node(section.ref, 'CONTAINER', section.label, ownerScreenRef, section.sourceRefs));
  for (const action of section.actions) {
    nodes.push(node(action.ref, 'CONTROL', action.label, section.ref, action.sourceRefs));
  }
}

function experienceBoard(snapshot) {
  const design = reverseAdoptedScreenDesign(snapshot);
  const p = profileMetrics(snapshot.referenceProfile, design);
  const graphRef = 'graph.vexlife-android.home-vexstream.poc';
  const projectionRef = 'projection.vexlife-android.home-vexstream.poc';
  const sourceRefs = sourceUnion(snapshot, snapshot.home.sourceRefs, snapshot.vexStream.sourceRefs);
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
  for (const action of snapshot.vexStream.libraryActions) {
    nodes.push(node(action.ref, 'CONTROL', action.label, snapshot.vexStream.screenRef, action.sourceRefs));
  }

  const sheet = snapshot.vexStream.connectionSheet;
  nodes.push(node(sheet.ref, 'CONTAINER', sheet.label, snapshot.vexStream.screenRef, sheet.sourceRefs));
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
  const home = { x: 70, y: 820, width: p.width, height: p.height };
  const anchor = { x: 470, y: 1100, width: 210, height: 90 };
  const states = {
    LOADING: { x: 790, y: 60, width: p.width, height: p.height },
    EMPTY: { x: 790, y: 820, width: p.width, height: p.height },
    LOADED: { x: 790, y: 1580, width: p.width, height: p.height },
  };

  items.push(projectionItem('item.home.screen', snapshot.home.screenRef, 'FRAME', rect(home.x, home.y, home.width, home.height), layer++, productItemRef));
  hints.push(presentationHint('item.home.screen', 'SCREEN_FRAME', 'HOME'));
  items.push(projectionItem('item.vexstream.screen-anchor', snapshot.vexStream.screenRef, 'RECTANGLE', rect(anchor.x, anchor.y, anchor.width, anchor.height), layer++, productItemRef));
  hints.push(presentationHint('item.vexstream.screen-anchor', 'SCREEN_ANCHOR'));

  items.push(projectionItem('item.home.toolbar', homeTitleRef, 'RECTANGLE', rect(home.x, home.y, home.width, p.toolbar), layer++, 'item.home.screen'));
  hints.push(presentationHint('item.home.toolbar', 'TOOLBAR'));

  const innerX = home.x + p.content.x;
  const innerWidth = p.content.width;
  let y = home.y + p.content.y;
  items.push(projectionItem('item.home.vexstream-section', snapshot.home.vexStreamSection.ref, 'RECTANGLE', rect(innerX, y, innerWidth, 230), layer++, 'item.home.screen'));
  hints.push(presentationHint('item.home.vexstream-section', 'SURFACE', 'RAISED'));
  items.push(projectionItem('item.home.vexstream-status', homeStatusRef, 'TEXT', rect(innerX + p.inner, y + 36, innerWidth - p.inner * 2, 58), layer++, 'item.home.vexstream-section'));
  hints.push(presentationHint('item.home.vexstream-status', 'TEXT', 'TITLE'));
  items.push(projectionItem('item.home.vexstream-body', homeBodyRef, 'TEXT', rect(innerX + p.inner, y + 103, innerWidth - p.inner * 2, 70), layer++, 'item.home.vexstream-section'));
  hints.push(presentationHint('item.home.vexstream-body', 'TEXT', 'SUPPORTING'));
  const openAction = snapshot.home.vexStreamSection.actions[0];
  items.push(projectionItem('item.home.vexstream-open', openAction.ref, 'RECTANGLE', rect(innerX + p.inner, y + 180, innerWidth - p.inner * 2, 38), layer++, 'item.home.vexstream-section'));
  hints.push(presentationHint('item.home.vexstream-open', 'BUTTON', 'PRIMARY'));

  y += 246;
  items.push(projectionItem('item.home.systems-section', snapshot.home.systemsSection.ref, 'RECTANGLE', rect(innerX, y, innerWidth, 250), layer++, 'item.home.screen'));
  hints.push(presentationHint('item.home.systems-section', 'SURFACE', 'RAISED'));
  let systemY = y + 52;
  snapshot.home.systemsSection.actions.forEach((action, index) => {
    const itemRef = `item.home.system-action.${index}`;
    items.push(projectionItem(itemRef, action.ref, 'RECTANGLE', rect(innerX + p.inner, systemY, innerWidth * 0.72, 40), layer++, 'item.home.systems-section'));
    hints.push(presentationHint(itemRef, 'BUTTON', 'SECONDARY'));
    systemY += 58;
  });

  function addVexStreamChrome(state, frame, frameItemRef) {
    const actionItemBySemanticRef = new Map();
    const stateChipItemRef = `${frameItemRef}.condition`;
    items.push(projectionItem(stateChipItemRef, state.stateRef, 'RECTANGLE', rect(frame.x + 8, frame.y - 28, 150, 24), layer++, productItemRef));
    hints.push(presentationHint(stateChipItemRef, 'STATE_CHIP', state.kind));
    items.push(projectionItem(frameItemRef, snapshot.vexStream.screenRef, 'FRAME', rect(frame.x, frame.y, frame.width, frame.height), layer++, productItemRef));
    hints.push(presentationHint(frameItemRef, 'SCREEN_FRAME', state.kind));

    const titleItem = `${frameItemRef}.toolbar`;
    items.push(projectionItem(titleItem, vexTitleRef, 'RECTANGLE', rect(frame.x, frame.y, frame.width, p.toolbar), layer++, frameItemRef));
    hints.push(presentationHint(titleItem, 'TOOLBAR'));

    const iconSize = 34;
    let iconX = frame.x + frame.width - p.padding - iconSize;
    [...snapshot.vexStream.toolbarActions].reverse().forEach((action, index) => {
      const itemRef = `${frameItemRef}.toolbar-action.${index}`;
      items.push(projectionItem(itemRef, action.ref, 'RECTANGLE', rect(iconX, frame.y + 8, iconSize, iconSize), layer++, frameItemRef));
      hints.push(presentationHint(itemRef, 'ICON_BUTTON', String(action.icon).toUpperCase()));
      actionItemBySemanticRef.set(action.ref, itemRef);
      iconX -= iconSize + 8;
    });

    const tabsY = frame.y + p.content.y;
    const tabGap = 5.5;
    const tabWidth = (frame.width - (p.padding * 2) - (tabGap * (snapshot.vexStream.tabs.length - 1)))
      / snapshot.vexStream.tabs.length;
    let tabX = frame.x + p.padding;
    snapshot.vexStream.tabs.forEach((tab, index) => {
      const itemRef = `${frameItemRef}.tab.${index}`;
      items.push(projectionItem(itemRef, tab.ref, 'RECTANGLE', rect(tabX, tabsY, tabWidth, 36), layer++, frameItemRef));
      hints.push(presentationHint(itemRef, 'TAB', index === 0 ? 'SELECTED' : 'DEFAULT'));
      tabX += tabWidth + tabGap;
    });
    return Object.freeze({
      contentY: tabsY + 54,
      actionItemBySemanticRef,
    });
  }

  const loadingFrame = states.LOADING;
  const loadingItem = 'item.vexstream.state.loading';
  const loadingChrome = addVexStreamChrome(loading, loadingFrame, loadingItem);
  items.push(projectionItem(`${loadingItem}.status`, loadingMessageRef, 'RECTANGLE', rect(loadingFrame.x + p.padding, loadingChrome.contentY + 24, loadingFrame.width - p.padding * 2, 64), layer++, loadingItem));
  hints.push(presentationHint(`${loadingItem}.status`, 'STATUS_ROW', 'LOADING'));

  const emptyFrame = states.EMPTY;
  const emptyItem = 'item.vexstream.state.empty';
  const emptyChrome = addVexStreamChrome(empty, emptyFrame, emptyItem);
  items.push(projectionItem(`${emptyItem}.message`, emptyMessageRef, 'TEXT', rect(emptyFrame.x + p.padding + 18, emptyChrome.contentY + 58, emptyFrame.width - p.padding * 2 - 36, 72), layer++, emptyItem));
  hints.push(presentationHint(`${emptyItem}.message`, 'TEXT', 'EMPTY'));

  const loadedFrame = states.LOADED;
  const loadedItem = 'item.vexstream.state.loaded';
  const loadedChrome = addVexStreamChrome(loaded, loadedFrame, loadedItem);
  let loadedY = loadedChrome.contentY + 8;
  loaded.sampleTracks.forEach((track, index) => {
    const itemRef = `${loadedItem}.track.${index}`;
    items.push(projectionItem(itemRef, track.ref, 'RECTANGLE', rect(loadedFrame.x + p.padding, loadedY, loadedFrame.width - p.padding * 2, 72), layer++, loadedItem));
    hints.push(presentationHint(itemRef, 'LIST_ROW', track.variant));
    loadedY += 72 + p.listGap;
  });
  snapshot.vexStream.libraryActions.forEach((action, index) => {
    const itemRef = `${loadedItem}.fab.${index}`;
    items.push(projectionItem(itemRef, action.ref, 'ELLIPSE', rect(loadedFrame.x + loadedFrame.width - 54, loadedFrame.y + loadedFrame.height - 150 + (index * 58), 42, 42), layer++, loadedItem));
    hints.push(presentationHint(itemRef, 'FAB', action.icon));
  });

  // Show the modal as an overlay occurrence of the same Screen, not a navigation destination.
  const sheetBounds = rect(loadedFrame.x + 8, loadedFrame.y + 318, loadedFrame.width - 16, loadedFrame.height - 326);
  items.push(projectionItem('item.vexstream.connection-sheet', sheet.ref, 'RECTANGLE', sheetBounds, layer + 50, loadedItem));
  hints.push(presentationHint('item.vexstream.connection-sheet', 'MODAL_SHEET'));
  let sheetY = sheetBounds.y + 46;
  sheet.actions.forEach((action, index) => {
    const itemRef = `item.vexstream.connection-sheet.action.${index}`;
    items.push(projectionItem(itemRef, action.ref, 'RECTANGLE', rect(sheetBounds.x + 16, sheetY, sheetBounds.width - 32, 38), layer + 60 + index, 'item.vexstream.connection-sheet'));
    hints.push(presentationHint(itemRef, 'BUTTON', action.variant));
    sheetY += 47;
  });
  layer += 80;

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
    presentation: makePresentation(snapshot.referenceProfile, hints, sourceRefs, [{
      relationshipRef: 'rel.vexlife-android.vexstream.manage-connection.open',
      fromProjectionItemRef: loadedChrome.actionItemBySemanticRef.get(sheet.triggerRef),
      toProjectionItemRef: 'item.vexstream.connection-sheet',
    }]),
    design,
    sourceRefs,
  });
}

function depthBoard(snapshot) {
  const graphRef = 'graph.vexlife-android.vexstream-depth.poc';
  const projectionRef = 'projection.vexlife-android.vexstream-depth.poc';
  const sourceRefs = sourceUnion(snapshot, snapshot.depth.sourceRefs, snapshot.depth.desktop.sourceRefs);
  const nodes = [];
  const relationships = [];
  const items = [];
  const hints = [];
  let layer = 1;

  const entries = [
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
    presentation: makePresentation(snapshot.referenceProfile, hints, sourceRefs),
    sourceRefs,
  });
}

export function projectVexLifeAndroidPocSnapshot(snapshotInput, boardRef = VEXBOARD_ANDROID_POC_BOARD_REFS.EXPERIENCE) {
  const snapshot = normalizeSnapshot(snapshotInput);
  stableRef(boardRef, 'boardRef');

  let board;
  if (boardRef === VEXBOARD_ANDROID_POC_BOARD_REFS.EXPERIENCE) board = experienceBoard(snapshot);
  else if (boardRef === VEXBOARD_ANDROID_POC_BOARD_REFS.DEPTH) board = depthBoard(snapshot);
  else throw new TypeError(`unsupported VexLife Android POC boardRef ${boardRef}`);

  return Object.freeze({
    schemaVersion: 'vexboard.android-poc-projection/v1',
    snapshotRef: snapshot.snapshotRef,
    boardRef,
    board,
    effects: Object.freeze({
      sourceMutationPerformed: false,
      externalEffectsPerformed: false,
    }),
  });
}

// [VXG RealForever][VEXWORK][VEXBOARD][VEXLIFE-ANDROID][SOURCE-PROJECTOR]
