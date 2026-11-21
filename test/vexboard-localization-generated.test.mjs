import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { buildLocalizationArtifacts } from '../scripts/build-localization-inventory.mjs';
import { sourceStringsForExactValue } from '../src/shared/vexboard-localization-inventory.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (relative) => JSON.parse(fs.readFileSync(path.join(ROOT, relative), 'utf8'));

test('Android Main Localization Inventory and CSV views are exact generated consequences of the current Main Screen Lens', () => {
  const catalog = readJson('projects/vexboard/lens/catalog.json');
  const subject = catalog.subjects.find((row) => row.slug === 'vexlife-android');
  const build = subject.lens.builds.find((row) => row.buildRef === 'main');
  const lens = readJson(`projects/vexboard/lens/${build.lens}`);

  const artifacts = buildLocalizationArtifacts({
    catalog,
    subjectSlug: 'vexlife-android',
    buildRef: 'main',
    lens,
  });

  for (const [name, expected] of Object.entries(artifacts.files)) {
    const relative = `projects/localization-architecture/inventory/${name}`;
    assert.equal(fs.readFileSync(path.join(ROOT, relative), 'utf8'), expected, relative);
  }

  assert.deepEqual(artifacts.inventory.summary, {
    occurrenceCount: 190,
    sourceStringCount: 179,
    reusedSourceStringCount: 6,
    formatStringCount: 0,
    screenCount: 13,
    surfaceCount: 14,
  });

  const close = artifacts.inventory.strings.find((row) => row.sourceStringRef === 'android:R.string.close');
  assert.equal(close.occurrenceRefs.length, 7);

  assert.deepEqual(
    sourceStringsForExactValue(artifacts.inventory, 'Receive BLE-like CGM packet')
      .map((row) => row.sourceStringRef),
    [
      'android:R.string.cgm_partner_lab_receive_packet',
      'android:R.string.partners_circuit_lab_receive_cgm',
    ],
  );
});
