import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  createStudioBlueprint,
  normalizeStudioBlueprint,
  studioBlueprintBytes,
  studioNodeFromOccurrence,
} from '../src/shared/vexboard-component-studio.mjs';

const inventory = JSON.parse(fs.readFileSync(
  new URL('../projects/component-library-architecture/inventory/vexlife-android.main.components.json', import.meta.url),
  'utf8',
));
const architecture = JSON.parse(fs.readFileSync(
  new URL('../projects/component-library-architecture/component-architecture-catalog.json', import.meta.url),
  'utf8',
));

const occurrenceFor = (kind) => {
  const family = inventory.components.find((row) => row.kind === kind);
  assert.ok(family, kind);
  return family.occurrenceRefs[0];
};

test('Studio Blueprint captures exact source occurrence relationships without requiring AI', () => {
  const node = studioNodeFromOccurrence({
    nodeRef: 'studio.node.1',
    inventory,
    occurrenceRef: occurrenceFor('BUTTON'),
    architectureCatalog: architecture,
    siblingOrder: 0,
  });
  assert.equal(node.source.subjectRef, 'subject.vexlife-android');
  assert.equal(node.source.kind, 'BUTTON');
  assert.equal(node.source.commit, inventory.sourceSnapshot.commit);
  assert.ok(node.source.occurrenceRef.startsWith('occurrence.component.'));
  assert.equal(Array.isArray(node.presentation.interactions), true);
  assert.equal(Array.isArray(node.relationships.childElementRefs), true);

  const blueprint = createStudioBlueprint({
    blueprintRef: 'studio.blueprint.test',
    label: 'Test composition',
    nodes: [node],
  });
  assert.equal(blueprint.aiRequired, false);
  assert.equal(blueprint.effects, false);
  assert.equal(blueprint.executionAuthority, 'NONE');
  assert.deepEqual(blueprint.rootNodeRefs, ['studio.node.1']);
  assert.equal(blueprint.summary.nodeCount, 1);
  assert.deepEqual(normalizeStudioBlueprint(blueprint), blueprint);
  assert.equal(studioBlueprintBytes(blueprint), JSON.stringify(blueprint, null, 2) + '\n');
});

test('Studio Blueprint preserves parent/order relationships for target construction', () => {
  const parent = studioNodeFromOccurrence({
    nodeRef: 'studio.node.1',
    inventory,
    occurrenceRef: occurrenceFor('CARD'),
    architectureCatalog: architecture,
    siblingOrder: 0,
  });
  const child = studioNodeFromOccurrence({
    nodeRef: 'studio.node.2',
    inventory,
    occurrenceRef: occurrenceFor('BUTTON'),
    architectureCatalog: architecture,
    parentNodeRefOrNull: parent.nodeRef,
    siblingOrder: 0,
  });
  const blueprint = createStudioBlueprint({
    blueprintRef: 'studio.blueprint.nested',
    label: 'Nested composition',
    nodes: [child, parent],
  });
  assert.deepEqual(blueprint.rootNodeRefs, [parent.nodeRef]);
  assert.equal(blueprint.nodes.find((node) => node.nodeRef === child.nodeRef).parentNodeRefOrNull, parent.nodeRef);
});

test('Studio Blueprint fails closed on missing parents cycles and duplicate sibling order', () => {
  const button = studioNodeFromOccurrence({
    nodeRef: 'studio.node.1',
    inventory,
    occurrenceRef: occurrenceFor('BUTTON'),
    architectureCatalog: architecture,
    siblingOrder: 0,
  });
  const missing = structuredClone(button);
  missing.nodeRef = 'studio.node.missing';
  missing.parentNodeRefOrNull = 'studio.node.unknown';
  assert.throws(
    () => createStudioBlueprint({ blueprintRef: 'studio.blueprint.bad', label: 'Bad', nodes: [missing] }),
    /missing parent/,
  );

  const one = structuredClone(button);
  one.nodeRef = 'studio.node.one';
  one.parentNodeRefOrNull = 'studio.node.two';
  const two = structuredClone(button);
  two.nodeRef = 'studio.node.two';
  two.parentNodeRefOrNull = 'studio.node.one';
  assert.throws(
    () => createStudioBlueprint({ blueprintRef: 'studio.blueprint.cycle', label: 'Cycle', nodes: [one, two] }),
    /cycle/,
  );

  const sibling = structuredClone(button);
  sibling.nodeRef = 'studio.node.2';
  assert.throws(
    () => createStudioBlueprint({ blueprintRef: 'studio.blueprint.order', label: 'Order', nodes: [button, sibling] }),
    /duplicate sibling order/,
  );
});

// [VXG RealForever][VEXWORK][COMPONENT-LIBRARY][A5-STUDIO-BLUEPRINT-TEST]
