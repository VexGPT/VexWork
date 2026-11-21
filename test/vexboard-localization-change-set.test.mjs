import assert from 'node:assert/strict';
import test from 'node:test';

import { createLocalizationInventory } from '../src/shared/vexboard-localization-inventory.mjs';
import {
  createLocalizationChangeSet,
  normalizeLocalizationChangeSet,
  reconcileLocalizationChangeSet,
} from '../src/shared/vexboard-localization-change-set.mjs';

function inventory({
  commit = '1'.repeat(40),
  play = 'Play',
  playJa = '再生',
  includeSettings = true,
  settingsJa = undefined,
} = {}) {
  return createLocalizationInventory({
    inventoryRef: `localization.fixture.${commit.slice(0, 7)}`,
    subjectRef: 'subject.fixture',
    buildRef: 'main',
    sourceLocale: 'en',
    sourceSnapshot: { repositoryRef: 'repo.fixture', commit },
    producer: { ref: 'producer.fixture.localization', version: 'fixture/1' },
    sourceStrings: [
      {
        sourceStringRef: 'fixture:string.play',
        sourceKey: 'play',
        sourceValue: play,
        sourcePath: 'strings.json',
        localeVariants: playJa === undefined ? {} : { ja: playJa },
      },
      ...(includeSettings ? [{
        sourceStringRef: 'fixture:string.settings',
        sourceKey: 'settings',
        sourceValue: 'Settings',
        sourcePath: 'strings.json',
        localeVariants: settingsJa === undefined ? {} : { ja: settingsJa },
      }] : []),
    ],
    occurrences: [
      {
        occurrenceRef: 'occurrence.fixture.play',
        surfaceRef: 'screen.player',
        screenRef: 'screen.player',
        elementRef: 'element.player.play',
        parentElementRef: null,
        elementKind: 'BUTTON',
        bindingRole: 'LABEL',
        textRole: null,
        sourceStringRef: 'fixture:string.play',
        sourceKey: 'play',
        sourceValue: play,
        sourcePath: 'Player.kt',
      },
      ...(includeSettings ? [{
        occurrenceRef: 'occurrence.fixture.settings',
        surfaceRef: 'screen.settings',
        screenRef: 'screen.settings',
        elementRef: 'element.settings.title',
        parentElementRef: null,
        elementKind: 'TEXT',
        bindingRole: 'TEXT',
        textRole: 'TITLE',
        sourceStringRef: 'fixture:string.settings',
        sourceKey: 'settings',
        sourceValue: 'Settings',
        sourcePath: 'Settings.kt',
      }] : []),
    ],
  });
}

function changeSet() {
  return createLocalizationChangeSet({
    changeSetRef: 'change-set.fixture.copy-review',
    inventory: inventory(),
    changes: [
      {
        changeRef: 'change.fixture.play.en',
        sourceStringRef: 'fixture:string.play',
        locale: 'en',
        expectedValue: 'Start',
        noteOrRationale: 'Use the clearer action word.',
      },
      {
        changeRef: 'change.fixture.play.ja',
        sourceStringRef: 'fixture:string.play',
        locale: 'ja',
        expectedValue: '再生する',
      },
      {
        changeRef: 'change.fixture.settings.ja',
        sourceStringRef: 'fixture:string.settings',
        locale: 'ja',
        expectedValue: '設定',
      },
    ],
  });
}

test('Change Set formation captures observed Product truth without mutating the inventory', () => {
  const source = inventory();
  const formed = createLocalizationChangeSet({
    changeSetRef: 'change-set.fixture.capture',
    inventory: source,
    changes: [
      {
        changeRef: 'change.fixture.play.en',
        sourceStringRef: 'fixture:string.play',
        locale: 'EN',
        expectedValue: 'Start',
      },
      {
        changeRef: 'change.fixture.settings.ja',
        sourceStringRef: 'fixture:string.settings',
        locale: 'ja',
        expectedValue: '設定',
      },
    ],
  });

  assert.equal(formed.schemaVersion, 'vexboard.localization-change-set/v1');
  assert.equal(formed.subjectRef, source.subjectRef);
  assert.equal(formed.observedRevision, source.sourceSnapshot.commit);
  assert.equal(formed.inventoryRef, source.inventoryRef);
  assert.deepEqual(formed.changes[0], {
    changeRef: 'change.fixture.play.en',
    sourceStringRef: 'fixture:string.play',
    locale: 'en',
    observedValueOrNull: 'Play',
    expectedValue: 'Start',
    occurrenceRefs: ['occurrence.fixture.play'],
    noteOrRationale: null,
  });
  assert.equal(formed.changes[1].observedValueOrNull, null, 'missing locale is captured as absent rather than source fallback');
  assert.equal(source.strings.find((row) => row.sourceStringRef === 'fixture:string.settings').sourceValue, 'Settings');
});

test('reconciliation distinguishes OPEN and OPEN_TRANSLATION against unchanged source', () => {
  const result = reconcileLocalizationChangeSet(changeSet(), inventory());
  const byRef = new Map(result.changes.map((change) => [change.changeRef, change]));

  assert.equal(byRef.get('change.fixture.play.en').state, 'OPEN');
  assert.equal(byRef.get('change.fixture.play.ja').state, 'OPEN');
  assert.equal(byRef.get('change.fixture.settings.ja').state, 'OPEN_TRANSLATION');
  assert.equal(result.summary.activeCount, 3);
  assert.equal(result.summary.SATISFIED, 0);
});

test('reconciliation derives SATISFIED from fresh source instead of a manual completion flag', () => {
  const result = reconcileLocalizationChangeSet(changeSet(), inventory({
    commit: '2'.repeat(40),
    play: 'Start',
    playJa: '再生する',
    settingsJa: '設定',
  }));

  assert.deepEqual(result.changes.map((change) => change.state), ['SATISFIED', 'SATISFIED', 'SATISFIED']);
  assert.equal(result.summary.activeCount, 0);
  assert.equal(result.currentRevision, '2'.repeat(40));
});

test('reconciliation exposes DIVERGED when source moves somewhere other than expected', () => {
  const result = reconcileLocalizationChangeSet(changeSet(), inventory({
    commit: '3'.repeat(40),
    play: 'Resume',
    playJa: 'プレイ',
  }));
  const byRef = new Map(result.changes.map((change) => [change.changeRef, change]));

  assert.equal(byRef.get('change.fixture.play.en').state, 'DIVERGED');
  assert.equal(byRef.get('change.fixture.play.en').currentValueOrNull, 'Resume');
  assert.equal(byRef.get('change.fixture.play.ja').state, 'DIVERGED');
  assert.equal(byRef.get('change.fixture.settings.ja').state, 'OPEN_TRANSLATION');
});

test('reconciliation exposes SOURCE_REMOVED rather than reminting missing source identity', () => {
  const result = reconcileLocalizationChangeSet(changeSet(), inventory({
    commit: '4'.repeat(40),
    includeSettings: false,
  }));
  const removed = result.changes.find((change) => change.changeRef === 'change.fixture.settings.ja');
  assert.equal(removed.state, 'SOURCE_REMOVED');
  assert.equal(removed.currentValueOrNull, null);
});

test('Change Set rejects contradictory coordinates and occurrence refs outside the source string', () => {
  const source = inventory();
  assert.throws(() => createLocalizationChangeSet({
    changeSetRef: 'change-set.fixture.duplicate',
    inventory: source,
    changes: [
      { changeRef: 'change.a', sourceStringRef: 'fixture:string.play', locale: 'en', expectedValue: 'A' },
      { changeRef: 'change.b', sourceStringRef: 'fixture:string.play', locale: 'EN', expectedValue: 'B' },
    ],
  }), /cannot request two values/);

  assert.throws(() => createLocalizationChangeSet({
    changeSetRef: 'change-set.fixture.bad-occurrence',
    inventory: source,
    changes: [{
      changeRef: 'change.a',
      sourceStringRef: 'fixture:string.play',
      locale: 'en',
      expectedValue: 'Start',
      occurrenceRefs: ['occurrence.fixture.settings'],
    }],
  }), /is not an occurrence/);
});

test('import normalization rejects stale shape and reconciliation rejects another subject', () => {
  const formed = changeSet();
  assert.deepEqual(normalizeLocalizationChangeSet(JSON.parse(JSON.stringify(formed))), formed);

  const other = createLocalizationInventory({
    inventoryRef: 'localization.other',
    subjectRef: 'subject.other',
    sourceLocale: 'en',
    sourceSnapshot: { repositoryRef: 'repo.other', commit: '5'.repeat(40) },
    producer: { ref: 'producer.other', version: 'other/1' },
    sourceStrings: [{ sourceStringRef: 'other:string.a', sourceKey: 'a', sourceValue: 'A' }],
    occurrences: [],
  });
  assert.throws(() => reconcileLocalizationChangeSet(formed, other), /subject mismatch/);
});
