import assert from 'node:assert/strict';
import test from 'node:test';

import {
  VEXLIFE_PROD_LOCALIZATION_PRODUCER,
  VEXLIFE_PROD_STRING_SOURCE_PATHS,
  projectVexLifeProdLocalizationInventory,
  vexLifeProdLocalizationSourceCatalog,
} from '../src/core/vexboard-localization-vexlife-prod.mjs';

const sourceFiles = Object.fromEntries(VEXLIFE_PROD_STRING_SOURCE_PATHS.map((path) => [
  path,
  JSON.stringify({
    _meta: { scope: path.includes('workspace') ? 'workspace' : path.includes('setup.json') && !path.includes('windows') ? 'setup' : path.includes('release') ? 'release-alerts' : 'windows-setup' },
  }),
]));

sourceFiles['localization/strings/source/workspace.json'] = JSON.stringify({
  _meta: { scope: 'workspace' },
  'workspace.button.voice-input-start': {
    strings: {
      en: { text: 'Start local dictation' },
      es: { text: 'Iniciar dictado local' },
      zh: { text: '开始本地听写' },
      'zh-Hant': { text: '開始本機聽寫' },
    },
    surfaces: ['workspace.conversation'],
    lens: 'element.vexlife-workspace.companion.conversation.voice-input',
  },
  'workspace.button.voice-input-stop': {
    strings: {
      en: { text: 'Stop local dictation' },
      es: { text: 'Detener dictado local', _stale: true },
      ja: { text: 'ローカル音声入力を停止' },
    },
    surfaces: ['workspace.conversation'],
    lens: 'element.vexlife-workspace.companion.conversation.voice-input',
  },
  'workspace.heading.models': {
    strings: {
      en: { text: 'Models' },
      es: { text: 'Modelos' },
    },
    surfaces: ['workspace.settings'],
  },
});

const lens = {
  sourceSnapshot: {
    repositoryRef: 'repo.vexlife-prod',
    repositoryUrl: 'https://github.com/VexGPT/VexLife-Prod',
    commit: '7f3935aec46b2030ebbc887fa8ccbf6199c93d36',
  },
  chrome: [],
  screens: [{
    screenRef: 'screen.vexlife-workspace',
    source: 'common:workspace/VexLifeWorkspaceBlueprint.kt',
    elements: [{
      ref: 'element.vexlife-workspace.companion.conversation.voice-input',
      kind: 'BUTTON',
      label: 'Voice input',
      parentRef: 'element.vexlife-workspace.companion.conversation.composer',
    }],
  }],
};

test('VexLife Prod source catalog preserves Product keys, current variants, and proven Chinese script meaning', () => {
  const catalog = vexLifeProdLocalizationSourceCatalog(sourceFiles);
  assert.equal(catalog.sourceStrings.length, 3);

  const start = catalog.sourceStrings.find((row) => row.sourceKey === 'workspace.button.voice-input-start');
  assert.equal(start.sourceStringRef, 'vexlife-prod:workspace.button.voice-input-start');
  assert.equal(start.sourceValue, 'Start local dictation');
  assert.equal(start.localeVariants.es, 'Iniciar dictado local');
  assert.equal(start.localeVariants['zh-Hans'], '开始本地听写');
  assert.equal(start.localeVariants['zh-Hant'], '開始本機聽寫');
  assert.equal(Object.hasOwn(start.localeVariants, 'zh'), false);

  const stop = catalog.sourceStrings.find((row) => row.sourceKey === 'workspace.button.voice-input-stop');
  assert.equal(Object.hasOwn(stop.localeVariants, 'es'), false, 'stale Product translation is not observed as current');
  assert.equal(stop.localeVariants.ja, 'ローカル音声入力を停止');
});

test('Product-owned lens namespace maps strings into the shared Screen Lens without rebuilding Product UI semantics', () => {
  const inventory = projectVexLifeProdLocalizationInventory({
    lens,
    sourceFiles,
    buildRef: 'main',
  });

  assert.equal(inventory.inventoryRef, 'localization.vexlife-prod');
  assert.equal(inventory.subjectRef, 'subject.vexlife-prod');
  assert.equal(inventory.producer.ref, VEXLIFE_PROD_LOCALIZATION_PRODUCER.ref);
  assert.equal(inventory.summary.sourceStringCount, 3);
  assert.equal(inventory.summary.mappedSourceStringCount, 2);
  assert.equal(inventory.summary.unmappedSourceStringCount, 1);
  assert.equal(inventory.summary.occurrenceCount, 2);

  const occurrences = inventory.occurrences.filter((row) =>
    row.elementRef === 'element.vexlife-workspace.companion.conversation.voice-input');
  assert.equal(occurrences.length, 2, 'one Lens element may truthfully have state-dependent Product string identities');
  assert.deepEqual(
    occurrences.map((row) => row.sourceStringRef),
    [
      'vexlife-prod:workspace.button.voice-input-start',
      'vexlife-prod:workspace.button.voice-input-stop',
    ],
  );
});

test('locale observation remains source-faithful when one Product translation is stale', () => {
  const inventory = projectVexLifeProdLocalizationInventory({ lens, sourceFiles, buildRef: 'main' });
  const es = inventory.locales.find((row) => row.localeRef === 'es');
  assert.equal(es.completeness, 'OBSERVED_PARTIAL');
  assert.equal(es.observedStringCount, 2);
  assert.equal(es.missingStringCount, 1);
});

test('adapter fails closed when Product lens namespace points at an element absent from the exact Lens', () => {
  const broken = JSON.parse(sourceFiles['localization/strings/source/workspace.json']);
  broken['workspace.button.voice-input-start'].lens = 'element.missing';
  assert.throws(
    () => projectVexLifeProdLocalizationInventory({
      lens,
      sourceFiles: {
        ...sourceFiles,
        'localization/strings/source/workspace.json': JSON.stringify(broken),
      },
      buildRef: 'main',
    }),
    /lens ref element\.missing is absent from the exact Screen Lens/,
  );
});

test('adapter requires the complete configured Product source set rather than silently omitting a scope', () => {
  const incomplete = { ...sourceFiles };
  delete incomplete['localization/strings/source/release-alerts.json'];
  assert.throws(
    () => vexLifeProdLocalizationSourceCatalog(incomplete),
    /missing source file localization\/strings\/source\/release-alerts\.json/,
  );
});

// [VXG RealForever][VEXWORK][VEXBOARD][LOCALIZATION][VEXLIFE-PROD]
