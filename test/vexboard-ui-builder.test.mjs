import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  UI_BLUEPRINT_SCHEMA,
  UI_PREVIEW_PROFILES,
  createUiBlueprint,
  normalizeUiBlueprint,
  uiBlueprintBytes,
  uiNodeFromOccurrence,
} from '../src/shared/vexboard-ui-blueprint.mjs';

const inventory = JSON.parse(fs.readFileSync(
  new URL('../projects/component-library-architecture/inventory/vexlife-android.main.components.json', import.meta.url),
  'utf8',
));
const architecture = JSON.parse(fs.readFileSync(
  new URL('../projects/component-library-architecture/component-architecture-catalog.json', import.meta.url),
  'utf8',
));
const page = fs.readFileSync(new URL('../vexboard/builder.html', import.meta.url), 'utf8');

function occurrenceFor(kind) {
  const row = inventory.occurrences.find((item) => item.kind === kind);
  assert.ok(row, 'expected occurrence for ' + kind);
  return row.occurrenceRef;
}

test('UI Blueprint preserves source-grounded component meaning while adding Builder relationships', () => {
  const node = structuredClone(uiNodeFromOccurrence({
    nodeRef: 'ui.node.1',
    inventory,
    occurrenceRef: occurrenceFor('BUTTON'),
    architectureCatalog: architecture,
  }));
  node.authoring.layout.containerMode = 'CONSTRAINT';
  node.authoring.layout.width = { mode: 'FILL', valueOrNull: null };
  node.authoring.callbackPorts = [{
    portRef: 'callback.saveProfile',
    eventRef: 'CLICK',
    sourceIntentOrNull: node.relationships.intentOrNull,
    bindingState: 'OPEN',
  }];

  const blueprint = createUiBlueprint({
    blueprintRef: 'ui.blueprint.test',
    label: 'Test UI',
    preview: { profile: 'WINDOWS' },
    nodes: [node],
  });

  assert.equal(blueprint.schemaVersion, UI_BLUEPRINT_SCHEMA);
  assert.equal(blueprint.aiRequired, false);
  assert.equal(blueprint.effects, false);
  assert.equal(blueprint.executionAuthority, 'NONE');
  assert.equal(blueprint.preview.profile, 'WINDOWS');
  assert.equal(blueprint.preview.previewOnly, true);
  assert.equal(blueprint.nodes[0].source.occurrenceRef, node.source.occurrenceRef);
  assert.equal(blueprint.nodes[0].authoring.layout.containerMode, 'CONSTRAINT');
  assert.equal(blueprint.integration.bindingMode, 'OPEN_PORTS');
  assert.equal(blueprint.integration.openCallbackPorts[0].portRef, 'callback.saveProfile');
  assert.equal(blueprint.integration.openCallbackPorts[0].bindingState, 'OPEN');
  assert.deepEqual(normalizeUiBlueprint(blueprint), blueprint);
  assert.equal(uiBlueprintBytes(blueprint), JSON.stringify(blueprint, null, 2) + '\n');
});

test('UI Blueprint supports parent-relative constraints without turning preview pixels into meaning', () => {
  const parent = structuredClone(uiNodeFromOccurrence({
    nodeRef: 'ui.node.1',
    inventory,
    occurrenceRef: occurrenceFor('CARD'),
    architectureCatalog: architecture,
  }));
  parent.authoring.layout.containerMode = 'CONSTRAINT';

  const child = structuredClone(uiNodeFromOccurrence({
    nodeRef: 'ui.node.2',
    inventory,
    occurrenceRef: occurrenceFor('BUTTON'),
    architectureCatalog: architecture,
    parentNodeRefOrNull: parent.nodeRef,
  }));
  child.authoring.layout.constraints = [
    { edge: 'START', targetNodeRefOrParent: 'PARENT', targetEdge: 'START', offset: 16 },
    { edge: 'END', targetNodeRefOrParent: 'PARENT', targetEdge: 'END', offset: 16 },
    { edge: 'BOTTOM', targetNodeRefOrParent: 'PARENT', targetEdge: 'BOTTOM', offset: 24 },
  ];

  const blueprint = createUiBlueprint({
    blueprintRef: 'ui.blueprint.constraints',
    label: 'Constraint UI',
    preview: { profile: 'MOBILE' },
    nodes: [parent, child],
  });

  assert.deepEqual(blueprint.rootNodeRefs, ['ui.node.1']);
  assert.equal(blueprint.summary.constrainedNodeCount, 1);
  assert.equal(blueprint.summary.constraintContainerCount, 1);
  assert.equal(blueprint.nodes[1].authoring.layout.constraints[2].edge, 'BOTTOM');
  assert.equal(blueprint.preview.width, 390);
  assert.equal(blueprint.preview.height, 844);
});

test('Builder surface is a visual toolbox + preview + relationship inspector with source-owned preview profiles', () => {
  assert.match(page, /UI Builder/);
  assert.match(page, /Components/);
  assert.match(page, /Preview surface/);
  assert.match(page, /Selected/);
  assert.match(page, /draggable/);
  assert.match(page, /Flow \+ Constraint/);
  assert.match(page, /function containerVisual/);
  for (const visualClass of ['v-card','v-column','v-row','v-stack','v-dialog','v-sheet','v-region','v-menu']) {
    assert.match(page, new RegExp(visualClass));
  }
  assert.doesNotMatch(page, /CONTAINER_KINDS\.has\(kind\)\)return h\('div',\{class:'v-box'\}/);
  assert.match(page, /node-tag/);
  assert.match(page, /Ui\.UI_PREVIEW_PROFILES/);
  assert.deepEqual(
    Object.fromEntries(Object.entries(UI_PREVIEW_PROFILES).map(([key, value]) => [key, value.label])),
    { MOBILE: 'Mobile', WINDOWS: 'Windows', CONTAINER: 'Container' },
  );
  assert.match(page, /Save Design/);
  assert.match(page, /OPEN · target app \/ AI binds implementation/);
  assert.match(page, /vexboard-ui-blueprint\.mjs/);
  assert.match(page, /Builder owns UI relationships only/);
});

test('Builder toolbox previews preserve distinct component silhouettes', () => {
  for (const silhouette of ['thumb-card','thumb-column','thumb-row','thumb-stack','thumb-dialog','thumb-sheet','thumb-region','thumb-menu']) {
    assert.match(page, new RegExp(silhouette));
  }
  assert.match(page, /function thumb\(row\)/);
});

// [VXG RealForever][VEXWORK][COMPONENT-LIBRARY][A5-UI-BUILDER-TEST]
