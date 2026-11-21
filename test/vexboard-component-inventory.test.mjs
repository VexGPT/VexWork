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

const path = new URL('../projects/component-library-architecture/inventory/vexlife-android.main.components.json', import.meta.url);
const inventory = JSON.parse(fs.readFileSync(path, 'utf8'));

test('materialized Android Component Inventory is current from the checked-in Lens + Localization source', () => {
  assert.equal(fs.readFileSync(path, 'utf8'), componentInventoryBytes());
  assert.deepEqual(normalizeComponentInventory(inventory), inventory);
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
