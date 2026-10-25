import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { createBoardGraph, createBoardProjection } from '../src/core/vexboard.mjs';
import {
  VEXBOARD_ANDROID_POC_BOARD_REFS,
  VEXLIFE_ANDROID_POC_SNAPSHOT_SCHEMA,
  androidPocDesignLocation,
  projectVexLifeAndroidPocSnapshot,
} from '../src/core/vexboard-android-source-projector.mjs';

const snapshot = JSON.parse(fs.readFileSync(
  new URL('../projects/vexboard/examples/vexlife-android-home-vexstream.snapshot.json', import.meta.url),
  'utf8',
));
const design = JSON.parse(fs.readFileSync(
  new URL('../projects/vexboard/examples/vexlife-android-home-vexstream.design.json', import.meta.url),
  'utf8',
));

test('VexLife Android POC snapshot projects deterministically without source effects', () => {
  assert.equal(snapshot.schemaVersion, VEXLIFE_ANDROID_POC_SNAPSHOT_SCHEMA);

  const first = projectVexLifeAndroidPocSnapshot(snapshot, VEXBOARD_ANDROID_POC_BOARD_REFS.EXPERIENCE, design);
  const second = projectVexLifeAndroidPocSnapshot(snapshot, VEXBOARD_ANDROID_POC_BOARD_REFS.EXPERIENCE, design);

  assert.deepEqual(first, second);
  assert.deepEqual(first.effects, {
    sourceMutationPerformed: false,
    externalEffectsPerformed: false,
  });
  assert.equal(first.board.mode, 'READ_ONLY_SOURCE');
  assert.equal(first.board.projection.layoutIntent, 'SCREEN_FLOW');
  assert.equal(first.board.presentation.referenceViewport.widthDp, 412);
  assert.equal(first.board.presentation.referenceViewport.heightDp, 915);

  const graph = createBoardGraph(first.board.graph);
  const projection = createBoardProjection(first.board.projection, graph);
  assert.equal(graph.nodes.some((node) => node.nodeRef === 'screen.home'), true);
  assert.equal(graph.nodes.some((node) => node.nodeRef === 'screen.vexstream-music'), true);
  assert.equal(graph.nodes.some((node) => node.nodeRef === 'state.vexstream.library.loading'), true);
  assert.equal(graph.nodes.some((node) => node.nodeRef === 'state.vexstream.library.empty'), true);
  assert.equal(graph.nodes.some((node) => node.nodeRef === 'state.vexstream.library.loaded'), true);
  const libraryActionsContainer = graph.nodes.find(
    (node) => node.nodeRef === 'element.vexstream-music.body.library-actions',
  );
  assert.equal(libraryActionsContainer.kind, 'CONTAINER');
  assert.equal(
    graph.nodes.find(
      (node) => node.nodeRef === 'element.vexstream-music.body.library-actions.play-all',
    ).parentRefOrNull,
    libraryActionsContainer.nodeRef,
  );

  const screenOccurrences = projection.items.filter(
    (item) => item.semanticRef === 'screen.vexstream-music',
  );
  assert.equal(screenOccurrences.length, 4,
    'one VexStream Screen identity should have one journey anchor plus three state-specific surface occurrences');

  for (const frameRef of [
    'item.vexstream.state.loading',
    'item.vexstream.state.empty',
    'item.vexstream.state.loaded',
  ]) {
    assert.equal(
      projection.items.find((item) => item.projectionItemRef === frameRef).semanticRef,
      'screen.vexstream-music',
      'state-specific phone frames must remain projections of the same semantic Screen',
    );
  }

  const homeOpenHint = first.board.presentation.items.find(
    (entry) => entry.projectionItemRef === 'item.home.vexstream-open',
  );
  assert.equal(homeOpenHint.styleRef, 'style.action.primary');
  assert.equal(homeOpenHint.role, 'BUTTON');

  const selectedTabHint = first.board.presentation.items.find(
    (entry) => entry.projectionItemRef === 'item.vexstream.state.loaded.tab.songs',
  );
  const defaultTabHint = first.board.presentation.items.find(
    (entry) => entry.projectionItemRef === 'item.vexstream.state.loaded.tab.albums',
  );
  assert.equal(selectedTabHint.styleRef, 'style.action.primary');
  assert.equal(selectedTabHint.variant, 'SELECTED');
  assert.equal(defaultTabHint.styleRef, 'style.navigation');
  assert.equal(defaultTabHint.variant, 'DEFAULT');

  const manageOccurrences = projection.items.filter(
    (item) => item.semanticRef === 'element.vexstream-music.body.connection.manage',
  );
  assert.equal(manageOccurrences.length, 3, 'one semantic toolbar control should project into all three Screen states');

  const songsOccurrences = projection.items.filter(
    (item) => item.semanticRef === 'element.vexstream-music.body.library-tabs.songs',
  );
  assert.equal(songsOccurrences.length, 3, 'one semantic tab should have state-local projection occurrences');

  for (const frameRef of [
    'item.vexstream.state.loading',
    'item.vexstream.state.empty',
    'item.vexstream.state.loaded',
  ]) {
    const viewport = projection.items.find(
      (item) => item.projectionItemRef === `${frameRef}.tabs-viewport`,
    );
    const tabs = projection.items.filter((item) =>
      item.parentProjectionItemRefOrNull === viewport.projectionItemRef);
    assert.equal(tabs.length, 5);
    assert.equal(tabs.every((tab) =>
      tab.parentProjectionItemRefOrNull === viewport.projectionItemRef), true);
    assert.ok(
      Math.max(...tabs.map((tab) => tab.bounds.x + tab.bounds.width))
        > viewport.bounds.x + viewport.bounds.width,
      'reverse-adopted SCROLL_ROW should overflow its bounded viewport rather than squeeze all tabs',
    );
    const viewportHint = first.board.presentation.items.find(
      (entry) => entry.projectionItemRef === viewport.projectionItemRef,
    );
    assert.equal(viewportHint.role, 'SCROLL_VIEWPORT');
    assert.equal(viewportHint.variant, 'HORIZONTAL');
  }

  assert.equal(
    first.board.design.layoutRules.find(
      (rule) => rule.layoutRef === 'layout.vexstream.library-tabs',
    ).mode,
    'SCROLL_ROW',
  );

  const sheet = projection.items.find(
    (item) => item.projectionItemRef === 'item.vexstream.connection-sheet',
  );
  assert.equal(sheet.parentProjectionItemRefOrNull, 'item.vexstream.state.loaded');

  const openRoute = first.board.presentation.relationships.find(
    (route) => route.relationshipRef === 'rel.vexlife-android.vexstream.manage-connection.open',
  );
  assert.equal(
    openRoute.fromProjectionItemRef,
    'item.vexstream.state.loaded.toolbar-action.connection.manage',
    'local modal edge must originate from the stable Loaded Manage Connection occurrence',
  );
  assert.equal(openRoute.toProjectionItemRef, 'item.vexstream.connection-sheet');

  assert.ok(graph.relationships.some((relationship) =>
    relationship.fromRef === 'element.home.body.systems.vexstream-music'
      && relationship.toRef === 'screen.vexstream-music'
      && relationship.kind === 'TRANSITION'));

  const stateEdges = graph.relationships.filter(
    (relationship) => relationship.fromRef === 'screen.vexstream-music'
      && relationship.toRef.startsWith('state.vexstream.library.'),
  );
  assert.equal(stateEdges.length, 3);
  for (const stateRef of [
    'state.vexstream.library.loading',
    'state.vexstream.library.empty',
    'state.vexstream.library.loaded',
  ]) {
    assert.equal(projection.items.filter((item) => item.semanticRef === stateRef).length, 1,
      'each condition should have one visible state coordinate beside its Screen occurrence');
  }
  assert.equal(stateEdges.every((relationship) => relationship.kind === 'REFERENCE'), true,
    'state branches must not pretend to be Screen navigation');
});

test('design-authored child order moves stable occurrences without reminting them', () => {
  const baseline = projectVexLifeAndroidPocSnapshot(
    snapshot,
    VEXBOARD_ANDROID_POC_BOARD_REFS.EXPERIENCE,
    design,
  ).board;

  const reorderedDesign = structuredClone(design);
  reorderedDesign.authorityState = 'VEXBOARD_DESIGN_DRAFT';
  const systems = reorderedDesign.layoutRules.find(
    (rule) => rule.layoutRef === 'layout.vexlife.home.systems',
  );
  systems.childSemanticRefs = [
    'element.home.body.systems.vex-maps',
    'element.home.body.systems.family-conversation',
    'element.home.body.systems.talk-to-vex',
  ];

  const reordered = projectVexLifeAndroidPocSnapshot(
    snapshot,
    VEXBOARD_ANDROID_POC_BOARD_REFS.EXPERIENCE,
    reorderedDesign,
  ).board;

  const refs = {
    family: 'item.home.system-action.family-conversation',
    maps: 'item.home.system-action.vex-maps',
    talk: 'item.home.system-action.talk-to-vex',
  };

  const baselineByRef = new Map(
    baseline.projection.items
      .filter((item) => Object.values(refs).includes(item.projectionItemRef))
      .map((item) => [item.projectionItemRef, item]),
  );
  const reorderedByRef = new Map(
    reordered.projection.items
      .filter((item) => Object.values(refs).includes(item.projectionItemRef))
      .map((item) => [item.projectionItemRef, item]),
  );

  assert.equal(baselineByRef.get(refs.family).semanticRef, 'element.home.body.systems.family-conversation');
  assert.equal(reorderedByRef.get(refs.family).semanticRef, 'element.home.body.systems.family-conversation');
  assert.equal(baselineByRef.get(refs.maps).semanticRef, 'element.home.body.systems.vex-maps');
  assert.equal(reorderedByRef.get(refs.maps).semanticRef, 'element.home.body.systems.vex-maps');

  assert.ok(baselineByRef.get(refs.family).bounds.y < baselineByRef.get(refs.maps).bounds.y);
  assert.ok(reorderedByRef.get(refs.maps).bounds.y < reorderedByRef.get(refs.family).bounds.y);
  assert.equal(
    reordered.projection.items.find(
      (item) => item.semanticRef === 'element.home.body.systems.vex-maps',
    ).projectionItemRef,
    refs.maps,
  );
});

test('component style edit changes web presentation from VexBoard design without mutating Android adoption facts', () => {
  const baseline = projectVexLifeAndroidPocSnapshot(
    snapshot,
    VEXBOARD_ANDROID_POC_BOARD_REFS.EXPERIENCE,
    design,
  ).board;
  const changedDesign = structuredClone(design);
  changedDesign.authorityState = 'VEXBOARD_DESIGN_DRAFT';
  changedDesign.componentAssignments.find(
    (entry) => entry.semanticRef === 'element.home.body.systems.vex-maps',
  ).styleRef = 'style.action.primary';

  const changed = projectVexLifeAndroidPocSnapshot(
    snapshot,
    VEXBOARD_ANDROID_POC_BOARD_REFS.EXPERIENCE,
    changedDesign,
  ).board;

  const baselineItem = baseline.projection.items.find(
    (item) => item.semanticRef === 'element.home.body.systems.vex-maps',
  );
  const changedItem = changed.projection.items.find(
    (item) => item.semanticRef === 'element.home.body.systems.vex-maps',
  );
  assert.equal(changedItem.projectionItemRef, baselineItem.projectionItemRef);

  const baselineHint = baseline.presentation.items.find(
    (entry) => entry.projectionItemRef === baselineItem.projectionItemRef,
  );
  const changedHint = changed.presentation.items.find(
    (entry) => entry.projectionItemRef === changedItem.projectionItemRef,
  );
  assert.equal(baselineHint.styleRef, 'style.action.secondary');
  assert.equal(baselineHint.variant, 'SECONDARY');
  assert.equal(changedHint.styleRef, 'style.action.primary');
  assert.equal(changedHint.variant, 'PRIMARY');

  assert.equal(
    snapshot.home.systemsSection.actions.find(
      (entry) => entry.ref === 'element.home.body.systems.vex-maps',
    ).label,
    'VexMaps',
  );
});

test('same VexBoard design resolves into a second viewport without reminting Screen identity', () => {
  const reference = projectVexLifeAndroidPocSnapshot(
    snapshot,
    VEXBOARD_ANDROID_POC_BOARD_REFS.EXPERIENCE,
    design,
    'profile.vexlife-android.phone.412x915',
  );
  const compact = projectVexLifeAndroidPocSnapshot(
    snapshot,
    VEXBOARD_ANDROID_POC_BOARD_REFS.EXPERIENCE,
    design,
    'profile.vexlife-android.compact.360x720-large-text',
  );

  assert.equal(reference.viewportProfileRef, 'profile.vexlife-android.phone.412x915');
  assert.equal(compact.viewportProfileRef, 'profile.vexlife-android.compact.360x720-large-text');
  assert.deepEqual(reference.board.graph, compact.board.graph);
  assert.equal(reference.board.design.designRef, compact.board.design.designRef);

  const referenceFrame = reference.board.projection.items.find(
    (item) => item.projectionItemRef === 'item.vexstream.state.loaded',
  );
  const compactFrame = compact.board.projection.items.find(
    (item) => item.projectionItemRef === 'item.vexstream.state.loaded',
  );
  assert.ok(compactFrame.bounds.width < referenceFrame.bounds.width);
  assert.ok(compactFrame.bounds.height < referenceFrame.bounds.height);
  assert.equal(compact.board.presentation.referenceViewport.widthDp, 360);
  assert.equal(compact.board.presentation.referenceViewport.heightDp, 720);

  const referenceScreens = reference.board.projection.items.filter(
    (item) => item.semanticRef === 'screen.vexstream-music',
  ).map((item) => item.projectionItemRef);
  const compactScreens = compact.board.projection.items.filter(
    (item) => item.semanticRef === 'screen.vexstream-music',
  ).map((item) => item.projectionItemRef);
  assert.deepEqual(compactScreens, referenceScreens);
});

test('VexBoard Screen design changes resolved geometry while the Android adoption snapshot stays fixed', () => {
  const baseline = projectVexLifeAndroidPocSnapshot(
    snapshot,
    VEXBOARD_ANDROID_POC_BOARD_REFS.EXPERIENCE,
    design,
  ).board;

  const changedDesign = structuredClone(design);
  changedDesign.authorityState = 'VEXBOARD_DESIGN_AUTHORITY';
  changedDesign.metrics.screenPaddingHorizontal = {
    preferredPercent: 24 / 412,
    minDp: 24,
    maxDp: 24,
    referenceDp: 24,
  };

  const changed = projectVexLifeAndroidPocSnapshot(
    snapshot,
    VEXBOARD_ANDROID_POC_BOARD_REFS.EXPERIENCE,
    changedDesign,
  ).board;

  const baselineHome = baseline.projection.items.find(
    (item) => item.projectionItemRef === 'item.home.vexstream-section',
  );
  const changedHome = changed.projection.items.find(
    (item) => item.projectionItemRef === 'item.home.vexstream-section',
  );

  assert.equal(baseline.design.authorityState, 'REVERSE_ADOPTED_CANDIDATE');
  assert.equal(changed.design.authorityState, 'VEXBOARD_DESIGN_AUTHORITY');
  assert.ok(changedHome.bounds.x > baselineHome.bounds.x);
  assert.ok(changedHome.bounds.width < baselineHome.bounds.width);
  assert.deepEqual(snapshot.referenceProfile, {
    profileRef: 'profile.vexlife-android.phone.412x915',
    widthDp: 412,
    heightDp: 915,
    toolbarHeightDp: 70,
    bottomBarHeightDp: 70,
    screenPaddingDp: 16,
    containerPaddingDp: 16,
    containerGapDp: 12,
    listGapDp: 8,
  }, 'Android adoption facts remain unchanged while VexBoard design changes');
});

test('VexLife Android POC depth maps truthful storage and Desktop service ownership', () => {
  const projected = projectVexLifeAndroidPocSnapshot(snapshot, VEXBOARD_ANDROID_POC_BOARD_REFS.DEPTH, design);
  assert.deepEqual(projected.effects, {
    sourceMutationPerformed: false,
    externalEffectsPerformed: false,
  });
  assert.equal(projected.board.projection.layoutIntent, 'SYSTEM_MAP');

  const graph = createBoardGraph(projected.board.graph);
  const projection = createBoardProjection(projected.board.projection, graph);
  assert.ok(projection.items.length > 0);

  const labels = new Map(graph.nodes.map((node) => [node.nodeRef, node.label]));
  assert.match(labels.get('reference.vexstream.connection-store'), /SharedPreferences/);
  assert.match(labels.get('reference.android.keystore.vexstream'), /Android Keystore/);
  assert.match(labels.get('reference.vexstream.offline-index'), /offline index/);
  assert.match(labels.get('reference.android.mediastore.vexstream'), /MediaStore/);
  assert.match(labels.get('reference.vexlife.room-database.non-owner'), /not stored here/);

  assert.equal(graph.relationships.some(
    (relationship) => relationship.toRef === 'reference.vexlife.room-database.non-owner',
  ), false, 'Room must remain explicitly visible as a non-owner rather than a fabricated VexStream dependency');

  const endpointLabels = graph.nodes
    .filter((node) => node.parentRefOrNull === 'reference.vexstream.desktop-mobile-service')
    .map((node) => node.label);
  assert.ok(endpointLabels.includes('GET /v1/catalog'));
  assert.ok(endpointLabels.includes('GET/HEAD /v1/media/<trackRef>'));

  const experience = projectVexLifeAndroidPocSnapshot(snapshot, VEXBOARD_ANDROID_POC_BOARD_REFS.EXPERIENCE, design).board;
  const portal = experience.graph.nodes.find(
    (node) => node.nodeRef === 'portal.vexlife-android.vexstream-depth',
  );
  assert.equal(portal.detailBoardRefOrNull, VEXBOARD_ANDROID_POC_BOARD_REFS.DEPTH);
});

test('Android POC design source location fails closed before browser fetch', () => {
  assert.equal(
    androidPocDesignLocation(snapshot),
    './vexlife-android-home-vexstream.design.json',
  );

  const invalid = structuredClone(snapshot);
  invalid.designLocation = './../escape.design.json';
  assert.throws(
    () => androidPocDesignLocation(invalid),
    /stay inside its source root/,
  );
});

test('VexLife Android POC snapshot fails closed when the bounded three-state contract drifts', () => {
  const invalid = structuredClone(snapshot);
  invalid.vexStream.states = invalid.vexStream.states.slice(0, 2);
  assert.throws(
    () => projectVexLifeAndroidPocSnapshot(invalid, VEXBOARD_ANDROID_POC_BOARD_REFS.EXPERIENCE, design),
    /requires exactly three library state projections/,
  );
});

// [VXG RealForever][VEXWORK][VEXBOARD][VEXLIFE-ANDROID][SOURCE-PROJECTOR]
