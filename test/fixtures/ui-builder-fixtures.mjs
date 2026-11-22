// Shared real-source fixtures for UI Builder tests. These read the checked-in, source-derived
// component inventories rather than inventing toy occurrences.
import fs from 'node:fs';

import { normalizeComponentArchitectureCatalog } from '../../src/shared/vexboard-component-architecture.mjs';
import { normalizeComponentInventory } from '../../src/shared/vexboard-component-inventory.mjs';
import { sourceEvidenceFromOccurrence } from '../../src/shared/vexboard-ui-blueprint.mjs';

function readJson(path) {
  return JSON.parse(fs.readFileSync(new URL('../../' + path, import.meta.url), 'utf8'));
}

export const inventories = {
  android: normalizeComponentInventory(readJson('projects/component-library-architecture/inventory/vexlife-android.main.components.json')),
  prod: normalizeComponentInventory(readJson('projects/component-library-architecture/inventory/vexlife-prod.main.components.json')),
  stream: normalizeComponentInventory(readJson('projects/component-library-architecture/inventory/vexstream-music.main.components.json')),
};
export const architecture = normalizeComponentArchitectureCatalog(readJson('projects/component-library-architecture/component-architecture-catalog.json'));

export function occurrence(inventory, predicate, label = 'occurrence') {
  const row = inventory.occurrences.find(predicate);
  if (!row) throw new Error('fixture: no ' + label);
  return row;
}

export function evidence(inventory, predicate, label) {
  return sourceEvidenceFromOccurrence({
    inventory,
    occurrenceRef: occurrence(inventory, predicate, label).occurrenceRef,
    architectureCatalog: architecture,
  });
}

export const android = {
  card: () => evidence(inventories.android, (o) => o.kind === 'CARD', 'card'),
  column: () => evidence(inventories.android, (o) => o.kind === 'COLUMN', 'column'),
  row: () => evidence(inventories.android, (o) => o.kind === 'ROW', 'row'),
  darkMode: () => evidence(inventories.android, (o) => o.actionKey === 'action.theme.dark-mode.toggle', 'dark mode toggle'),
  localButton: () => evidence(inventories.android, (o) => o.kind === 'BUTTON' && o.intent === 'localEffect()', 'local effect button'),
  navButton: () => evidence(inventories.android, (o) => o.kind === 'BUTTON' && /^navigateTo\(/u.test(o.intent ?? ''), 'navigation button'),
  compoundMenuItem: () => evidence(inventories.android, (o) => o.kind === 'MENU_ITEM' && / then /u.test(o.intent ?? ''), 'compound menu item'),
  swapButton: () => evidence(inventories.android, (o) => /^swapTo\(/u.test(o.intent ?? ''), 'swap button'),
  text: () => evidence(inventories.android, (o) => o.kind === 'TEXT', 'text'),
  image: () => evidence(inventories.android, (o) => o.kind === 'IMAGE', 'image'),
  dialog: () => evidence(inventories.android, (o) => o.kind === 'DIALOG', 'dialog'),
  sheet: () => evidence(inventories.android, (o) => o.kind === 'SHEET', 'sheet'),
  menu: () => evidence(inventories.android, (o) => o.kind === 'MENU', 'menu'),
  menuItem: () => evidence(inventories.android, (o) => o.kind === 'MENU_ITEM', 'menu item'),
  conditional: () => evidence(inventories.android, (o) => o.visibleWhen && !['DIALOG', 'SHEET', 'MENU'].includes(o.kind), 'conditional element'),
  field: () => evidence(inventories.android, (o) => o.kind === 'FIELD', 'field'),
};

export const prod = {
  handle: () => evidence(inventories.prod, (o) => o.kind === 'HANDLE', 'handle'),
  seam: () => evidence(inventories.prod, (o) => o.kind === 'SEAM', 'seam'),
  capabilityButton: () => evidence(inventories.prod, (o) => /^capability /u.test(o.intent ?? ''), 'capability button'),
  externalButton: () => evidence(inventories.prod, (o) => /^external /u.test(o.intent ?? ''), 'external link'),
  localReveal: () => evidence(inventories.prod, (o) => /^local /u.test(o.intent ?? ''), 'local reveal'),
  presentationState: () => evidence(inventories.prod, (o) => /^presentation /u.test(o.intent ?? ''), 'presentation state'),
  region: () => evidence(inventories.prod, (o) => o.kind === 'REGION', 'region'),
  plainButton: () => evidence(inventories.prod, (o) => o.kind === 'BUTTON' && !o.intent && !o.actionKey, 'intent-free button'),
};

export const stream = {
  button: () => evidence(inventories.stream, (o) => o.kind === 'BUTTON' && o.intent, 'vexstream button'),
};

export function inventoriesBySubject() {
  return new Map(Object.values(inventories).map((inventory) => [inventory.subjectRef, inventory]));
}

// [VXG RealForever][VEXWORK][COMPONENT-LIBRARY][A5-UI-FIXTURES]
