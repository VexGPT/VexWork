#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createComponentInventory } from '../src/shared/vexboard-component-inventory.mjs';
import { buildFor, normalizeLensCatalog, subjectFor } from '../src/shared/vexboard-lens-catalog.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SUBJECT = 'vexlife-android';
const BUILD = 'main';

const readJson = (relative) => JSON.parse(fs.readFileSync(path.join(ROOT, relative), 'utf8'));

export function buildAndroidComponentInventory(root = ROOT) {
  const catalog = normalizeLensCatalog(readJson(path.relative(ROOT, path.join(root, 'projects/vexboard/lens/catalog.json'))));
  const subject = subjectFor(catalog, SUBJECT);
  if (!subject) throw new TypeError('component inventory: VexLife Android subject is missing');
  const build = buildFor(subject, BUILD);
  if (!build) throw new TypeError('component inventory: VexLife Android Main build is missing');

  const lensPath = path.join(root, 'projects', 'vexboard', 'lens', build.lens);
  const localizationPath = path.join(root, 'projects', 'localization-architecture', 'inventory', 'vexlife-android.main.localization.json');
  const lens = JSON.parse(fs.readFileSync(lensPath, 'utf8'));
  const localizationInventory = JSON.parse(fs.readFileSync(localizationPath, 'utf8'));
  if (lens.sourceSnapshot?.commit !== build.commit) {
    throw new TypeError('component inventory: Screen Lens does not match catalog Main commit');
  }

  return createComponentInventory({
    inventoryRef: 'components.vexlife-android.main',
    subjectRef: subject.subjectRef,
    buildRef: BUILD,
    lens,
    localizationInventory,
    producer: {
      ref: 'producer.vexboard.components.android-screen-lens',
      version: 'vexlife-android-components/1',
    },
  });
}

export function componentInventoryBytes(root = ROOT) {
  return JSON.stringify(buildAndroidComponentInventory(root), null, 2) + '\n';
}

function main() {
  const output = path.join(ROOT, 'projects', 'component-library-architecture', 'inventory', 'vexlife-android.main.components.json');
  const expected = componentInventoryBytes(ROOT);
  if (process.argv.includes('--check')) {
    const current = fs.existsSync(output) ? fs.readFileSync(output, 'utf8') : '';
    if (current !== expected) {
      console.error('Component inventory is stale; run npm run components:build');
      process.exitCode = 1;
      return;
    }
    console.log('Component inventory = current from Android Main Screen Lens + Localization Inventory');
    return;
  }
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, expected, 'utf8');
  console.log('wrote VexLife Android Main Component Inventory');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();

// [VXG RealForever][VEXWORK][COMPONENT-LIBRARY][A1-BUILDER]
