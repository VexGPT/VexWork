import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  componentForOccurrence,
  componentOccurrenceTarget,
  normalizeComponentInventory,
  occurrencesForComponent,
  occurrencesForSurface,
  searchComponentInventory,
} from '../src/shared/vexboard-component-inventory.mjs';
import { componentInventoryBytes } from '../scripts/build-component-inventory.mjs';

const inventoryUrl = (slug) =>
  new URL(
    '../projects/component-library-architecture/inventory/' + slug + '.main.components.json',
    import.meta.url,
  );

const inventories = Object.freeze({
  android: JSON.parse(fs.readFileSync(inventoryUrl('vexlife-android'), 'utf8')),
  prod: JSON.parse(fs.readFileSync(inventoryUrl('vexlife-prod'), 'utf8')),
  vexstream: JSON.parse(fs.readFileSync(inventoryUrl('vexstream-music'), 'utf8')),
});

const inventory = inventories.android;

test('materialized Product inventories are current from one catalog-bound Screen Lens contract', () => {
  for (const [slug, materialized] of [
    ['vexlife-android', inventories.android],
    ['vexlife-prod', inventories.prod],
    ['vexstream-music', inventories.vexstream],
  ]) {
    assert.equal(
      fs.readFileSync(inventoryUrl(slug), 'utf8'),
      componentInventoryBytes(undefined, slug, 'main'),
      slug,
    );
    assert.deepEqual(normalizeComponentInventory(materialized), materialized);
    assert.equal(materialized.subjectRef, 'subject.' + slug);
    assert.equal(materialized.buildRef, 'main');
    assert.equal(materialized.components.every((row) => row.meaningState === 'OBSERVED_SOURCE_FAMILY'), true);
    assert.equal(materialized.components.every((row) => row.portability === 'UNCLASSIFIED'), true);
  }
});

test('A2 applies the same inventory contract to materially different Products', () => {
  assert.deepEqual(inventories.vexstream.summary, {
    componentFamilyCount: 4,
    occurrenceCount: 81,
    screenCount: 1,
    chromeOccurrenceCount: 0,
    localizedOccurrenceCount: 0,
    realizedOccurrenceCount: 0,
    accessibilityProjectedOccurrenceCount: 0,
  });
  assert.deepEqual(
    inventories.vexstream.components.map((row) => [row.kind, row.occurrenceRefs.length]),
    [
      ['BUTTON', 54],
      ['FIELD', 8],
      ['FRAME', 1],
      ['REGION', 18],
    ],
  );
  assert.equal(
    inventories.vexstream.sourceSnapshot.commit,
    'a70c5292cedfec32356cb9fc34aa637808047e30',
  );

  assert.equal(inventories.prod.summary.componentFamilyCount, 9);
  assert.equal(inventories.prod.summary.occurrenceCount, 152);
  assert.equal(inventories.prod.summary.screenCount, 1);
  assert.equal(inventories.prod.summary.localizedOccurrenceCount, 105);
  assert.equal(inventories.prod.summary.realizedOccurrenceCount, 0);
  assert.equal(
    inventories.prod.sourceSnapshot.commit,
    'a0edba10c93a95dae1a16d0f915f07788c5112ba',
  );
  assert.equal(
    inventories.prod.sourceSnapshot.localizationInventoryRef,
    'localization.vexlife-prod',
  );
});

test('A1 keeps Android source families observed without prematurely declaring portable components', () => {
  assert.equal(inventory.schemaVersion, 'vexboard.component-inventory/v1');
  assert.equal(inventory.sourceSnapshot.commit, 'd857a92371555472e0303b18eadf353da2a868d6');
  assert.equal(inventory.summary.componentFamilyCount, 15);
  assert.equal(inventory.summary.occurrenceCount, 274);
  assert.equal(inventory.summary.screenCount, 13);
  assert.equal(inventory.summary.localizedOccurrenceCount, 190);
  assert.equal(inventory.summary.realizedOccurrenceCount, 121);
  assert.equal(inventory.summary.accessibilityProjectedOccurrenceCount, 0);
  assert.equal(inventory.components.every((row) => row.meaningState === 'OBSERVED_SOURCE_FAMILY'), true);
  assert.equal(inventory.components.every((row) => row.portability === 'UNCLASSIFIED'), true);
});

test('where-used pivots one inventory in both directions', () => {
  const buttons = inventory.components.find((row) => row.kind === 'BUTTON');
  assert.ok(buttons);
  assert.equal(occurrencesForComponent(inventory, buttons.componentRef).length, 137);

  const gallery = occurrencesForSurface(inventory, 'screen.gallery');
  assert.ok(gallery.length > 0);
  const first = gallery[0];
  assert.equal(componentForOccurrence(inventory, first.occurrenceRef).componentRef, first.componentRef);
  assert.deepEqual(componentOccurrenceTarget(inventory, first.occurrenceRef), {
    screenRef: 'screen.gallery',
    elementRef: first.elementRef,
  });
});

test('search spans observed family, style, source, realizer and where-used coordinates', () => {
  assert.ok(searchComponentInventory(inventory, 'button').some((row) => row.kind === 'BUTTON'));
  assert.ok(searchComponentInventory(inventory, 'screen.gallery').length > 0);
  assert.ok(searchComponentInventory(inventory, 'RaisedSurface').length > 0);
  assert.deepEqual(searchComponentInventory(inventory, ''), []);
  assert.throws(() => searchComponentInventory(inventory, 'button', { limit: 0 }), /search limit/);
});

test('materialized summary and cross-family references fail closed when corrupted', () => {
  const badSummary = structuredClone(inventory);
  badSummary.summary.occurrenceCount += 1;
  assert.throws(() => normalizeComponentInventory(badSummary), /summary disagrees/);

  const badRef = structuredClone(inventory);
  badRef.occurrences[0].componentRef = 'component.source-family.missing';
  assert.throws(() => normalizeComponentInventory(badRef), /unknown component/);
});

// [VXG RealForever][VEXWORK][COMPONENT-LIBRARY][A1-TEST]
