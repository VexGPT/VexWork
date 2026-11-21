import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { buildLocalizationArtifacts } from '../scripts/build-localization-inventory.mjs';
import {
  localizationValueForLocale,
  normalizeLocalizationInventory,
  sourceStringsForExactValue,
} from '../src/shared/vexboard-localization-inventory.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (relative) => JSON.parse(fs.readFileSync(path.join(ROOT, relative), 'utf8'));

test('Android Main materialized views stay byte-current with the committed source catalog + current Main Screen Lens', () => {
  const catalog = readJson('projects/vexboard/lens/catalog.json');
  const subject = catalog.subjects.find((row) => row.slug === 'vexlife-android');
  const build = subject.lens.builds.find((row) => row.buildRef === 'main');
  const lens = readJson(`projects/vexboard/lens/${build.lens}`);
  const committed = readJson('projects/localization-architecture/inventory/vexlife-android.main.localization.json');

  // Offline generated-currentness uses the committed source catalog rows. SourceOwner proof separately
  // re-reads exact strings.xml at the bound commit with localization:check --fetch.
  const sourceStrings = committed.strings.map((row) => ({
    sourceStringRef: row.sourceStringRef,
    sourceKey: row.sourceKey,
    sourceValue: row.sourceValue,
    sourcePath: row.sourcePath,
  }));

  const artifacts = buildLocalizationArtifacts({
    catalog,
    subjectSlug: 'vexlife-android',
    buildRef: 'main',
    lens,
    sourceStrings,
  });

  for (const [name, expected] of Object.entries(artifacts.files)) {
    const relative = `projects/localization-architecture/inventory/${name}`;
    assert.equal(fs.readFileSync(path.join(ROOT, relative), 'utf8'), expected, relative);
  }

  assert.deepEqual(artifacts.inventory.summary, {
    occurrenceCount: 190,
    sourceStringCount: 405,
    mappedSourceStringCount: 179,
    unmappedSourceStringCount: 226,
    reusedSourceStringCount: 6,
    formatStringCount: 41,
    screenCount: 13,
    surfaceCount: 14,
  });

  const close = artifacts.inventory.strings.find((row) => row.sourceStringRef === 'android:R.string.close');
  assert.equal(close.occurrenceRefs.length, 7);

  const more = artifacts.inventory.strings.find((row) => row.sourceStringRef === 'android:R.string.fab_more');
  assert.equal(more.sourceValue, 'More');
  assert.equal(more.occurrenceRefs.length, 1);

  assert.deepEqual(
    sourceStringsForExactValue(artifacts.inventory, 'Receive BLE-like CGM packet')
      .map((row) => row.sourceStringRef),
    [
      'android:R.string.cgm_partner_lab_receive_packet',
      'android:R.string.partners_circuit_lab_receive_cgm',
    ],
  );
});

test('VexLife Prod Main sidecar carries Product-owned translated strings through the same inventory contract', () => {
  const inventory = normalizeLocalizationInventory(
    readJson('projects/localization-architecture/inventory/vexlife-prod.main.localization.json'),
  );

  assert.equal(inventory.subjectRef, 'subject.vexlife-prod');
  assert.equal(inventory.buildRef, 'main');
  assert.equal(inventory.sourceSnapshot.commit, '7f3935aec46b2030ebbc887fa8ccbf6199c93d36');
  assert.deepEqual(inventory.summary, {
    occurrenceCount: 10,
    sourceStringCount: 372,
    mappedSourceStringCount: 10,
    unmappedSourceStringCount: 362,
    reusedSourceStringCount: 0,
    formatStringCount: 0,
    screenCount: 1,
    surfaceCount: 1,
  });

  assert.deepEqual(
    localizationValueForLocale(
      inventory,
      'vexlife-prod:workspace.button.voice-input-start',
      'es',
    ),
    {
      sourceStringRef: 'vexlife-prod:workspace.button.voice-input-start',
      localeRef: 'es',
      state: 'VARIANT',
      value: 'Iniciar dictado local',
      sourceValue: 'Start local dictation',
    },
  );

  const voice = inventory.strings.find(
    (row) => row.sourceStringRef === 'vexlife-prod:workspace.button.voice-input-start',
  );
  assert.deepEqual(
    voice.elementRefs,
    ['element.vexlife-workspace.companion.conversation.voice-input'],
  );
  assert.ok(inventory.locales.some((row) => row.localeRef === 'zh-Hans'));
  assert.ok(inventory.locales.some((row) => row.localeRef === 'zh-Hant'));
});

// [VXG RealForever][VEXWORK][VEXBOARD][LOCALIZATION][VEXLIFE-PROD-GENERATED]

