import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { createBoardGraph, createBoardProjection } from '../src/core/vexboard.mjs';
import {
  VEXBOARD_ANDROID_POC_BOARD_REFS,
  VEXLIFE_ANDROID_POC_SNAPSHOT_SCHEMA,
  projectVexLifeAndroidPocSnapshot,
} from '../src/core/vexboard-android-source-projector.mjs';

const snapshot = JSON.parse(fs.readFileSync(
  new URL('../projects/vexboard/examples/vexlife-android-home-vexstream.snapshot.json', import.meta.url),
  'utf8',
));

test('VexLife Android POC snapshot projects deterministically without source effects', () => {
  assert.equal(snapshot.schemaVersion, VEXLIFE_ANDROID_POC_SNAPSHOT_SCHEMA);

  const first = projectVexLifeAndroidPocSnapshot(snapshot, VEXBOARD_ANDROID_POC_BOARD_REFS.EXPERIENCE);
  const second = projectVexLifeAndroidPocSnapshot(snapshot, VEXBOARD_ANDROID_POC_BOARD_REFS.EXPERIENCE);

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
    const frame = projection.items.find((item) => item.projectionItemRef === frameRef);
    const tabs = projection.items.filter((item) => item.projectionItemRef.startsWith(`${frameRef}.tab.`));
    assert.equal(tabs.length, 5);
    assert.equal(tabs.every((tab) =>
      tab.bounds.x >= frame.bounds.x
        && tab.bounds.x + tab.bounds.width <= frame.bounds.x + frame.bounds.width), true,
    'reference tab projection must remain inside the bounded Screen frame');
  }

  const sheet = projection.items.find(
    (item) => item.projectionItemRef === 'item.vexstream.connection-sheet',
  );
  assert.equal(sheet.parentProjectionItemRefOrNull, 'item.vexstream.state.loaded');

  const openRoute = first.board.presentation.relationships.find(
    (route) => route.relationshipRef === 'rel.vexlife-android.vexstream.manage-connection.open',
  );
  assert.ok(openRoute.fromProjectionItemRef.startsWith('item.vexstream.state.loaded.toolbar-action.'),
    'local modal edge must originate from the Loaded Screen occurrence');
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

test('VexLife Android POC depth maps truthful storage and Desktop service ownership', () => {
  const projected = projectVexLifeAndroidPocSnapshot(snapshot, VEXBOARD_ANDROID_POC_BOARD_REFS.DEPTH);
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

  const experience = projectVexLifeAndroidPocSnapshot(snapshot).board;
  const portal = experience.graph.nodes.find(
    (node) => node.nodeRef === 'portal.vexlife-android.vexstream-depth',
  );
  assert.equal(portal.detailBoardRefOrNull, VEXBOARD_ANDROID_POC_BOARD_REFS.DEPTH);
});

test('VexLife Android POC snapshot fails closed when the bounded three-state contract drifts', () => {
  const invalid = structuredClone(snapshot);
  invalid.vexStream.states = invalid.vexStream.states.slice(0, 2);
  assert.throws(
    () => projectVexLifeAndroidPocSnapshot(invalid),
    /requires exactly three library state projections/,
  );
});

// [VXG RealForever][VEXWORK][VEXBOARD][VEXLIFE-ANDROID][SOURCE-PROJECTOR]
