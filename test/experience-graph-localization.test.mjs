import assert from 'node:assert/strict';
import test from 'node:test';

import {
  chineseScript, readDataKeyAnchors, readDisplayStateText, readKeyedMarkup, readLanguageSelection, readLocalization,
  readLocalizationCatalog, readScriptMapping, resolveDataKeys,
} from '../src/core/experience-graph-localization.mjs';
import { deriveFrontier, deriveRoutes } from '../src/core/experience-graph-derivation.mjs';
import { fixtureGraph, fixtureLaws } from './fixtures/experience-graph/graph.mjs';
import {
  CATALOG_FILES, MAIN_ANCHOR, MARKUP, NOTE_FAMILY, SERVICE_STRINGS, SETTINGS, STRINGS, TEST_ANCHOR,
} from './fixtures/experience-graph/localization.mjs';

const readAll = (laws = fixtureLaws()) => readLocalization({
  catalogFiles: CATALOG_FILES,
  anchorFiles: [MAIN_ANCHOR, TEST_ANCHOR],
  settings: SETTINGS,
  strings: STRINGS,
  selectionFiles: [SERVICE_STRINGS],
  markup: MARKUP,
  laws,
  familyFiles: [],
});

test('catalog completeness counts only current translations; a stale translation leaves the language incomplete', () => {
  const catalog = readLocalizationCatalog({ scopes: CATALOG_FILES });
  const workspace = catalog.scopes.find((row) => row.scope === 'workspace');
  assert.deepEqual(workspace.languages, ['en', 'ja']);
  assert.deepEqual(workspace.completeLanguages, ['en']);
  assert.equal(workspace.missingByLanguage.ja, 2, 'the listening status has no ja and dictation-stop ja is _stale');
  assert.equal(workspace.lensKeyCount, 1);
  assert.deepEqual(workspace.dataKeyOwners, { dictation: ['VexLifeDictationFamily'] });
  assert.deepEqual(catalog.scopes.find((row) => row.scope === 'setup').completeLanguages, ['en', 'ja', 'zh']);
  assert.equal(catalog.keys.find((row) => row.key === 'workspace.button.dictation-start').line, 8);
});

test('dataKey prefixes anchor through the statement or the local collection it iterates, and say whether main or test source owns them', () => {
  const anchors = readDataKeyAnchors({ files: [MAIN_ANCHOR, TEST_ANCHOR] });
  // A sibling add(...) in the same builder lends no owner; a qualified member (`Family.HoldRefs.map`)
  // is not mistaken for a local collection.
  assert.deepEqual(anchors.map((row) => `${row.prefix}|${row.anchor}|${row.owners.join(',')}`), [
    'dictation:control|MAIN_SOURCE|VexLifeDictationFamily',
    'dictation:hold|MAIN_SOURCE|VexLifeDictationFamily',
    'dictation:reason|TEST_SOURCE|VexLifeDictationFamily',
    'dictation:state|TEST_SOURCE|VexLifeDictationFamily',
    'note:state|MAIN_SOURCE|VexLifeNoteFamily',
  ]);
});

test('resolved dataKeys reach Family Controls and States; refs the Family does not own and unanchored prefixes stay visible', () => {
  const catalog = readLocalizationCatalog({ scopes: CATALOG_FILES });
  const { keys, prefixes } = resolveDataKeys({ catalog, anchors: readDataKeyAnchors({ files: [MAIN_ANCHOR, TEST_ANCHOR] }), laws: fixtureLaws() });
  const by = Object.fromEntries(keys.map((row) => [row.key, `${row.resolution}|${row.anchor}|${row.target}`]));
  assert.equal(by['workspace.button.dictation-start'], 'FAMILY_CONTROL|MAIN_SOURCE|VexLifeDictationFamily.Start');
  assert.equal(by['workspace.status.dictation-listening'], 'FAMILY_STATE|TEST_SOURCE|VexLifeDictationFamily.Listening');
  assert.equal(by['workspace.button.ghost'], 'UNRESOLVED_REF|MAIN_SOURCE|null');
  assert.equal(by['workspace.label.reason'], 'FAMILY_DETAIL|TEST_SOURCE|null');
  assert.equal(by['workspace.label.orphan'], 'UNANCHORED|UNANCHORED|null');
  assert.deepEqual(prefixes.find((row) => row.prefix === 'dictation:state').anchors, ['TEST_SOURCE', 'CATALOG_DECLARED']);
  // A ref the Family owns as a display constant (not a State or Control) is owned, not unresolved.
  const owned = resolveDataKeys({ catalog, anchors: readDataKeyAnchors({ files: [MAIN_ANCHOR, TEST_ANCHOR] }), laws: fixtureLaws(), ownedValues: new Map([['VexLifeDictationFamily', new Set(['GHOST'])]]) });
  assert.equal(owned.keys.find((row) => row.key === 'workspace.button.ghost').resolution, 'FAMILY_DETAIL');
});

test('language selection that never consults completeness is told apart from the complete-only rule', () => {
  assert.deepEqual(readLanguageSelection({ files: [SERVICE_STRINGS] }).map((row) => `${row.function}:${row.rule}`), [
    'handleSetupStrings:COMPLETE_LANGUAGE_ONLY',
    'handleStrings:PER_KEY_ENGLISH_FALLBACK',
  ]);
});

test('two reply scripts collapsing into one catalog language name the script the catalog actually holds', () => {
  assert.equal(chineseScript(['这是设置']).script, 'Hans');
  assert.equal(chineseScript(['這是設置']).script, 'Hant');
  assert.equal(chineseScript(['VexLife']).script, 'UNKNOWN');
  const catalog = readLocalization({ catalogFiles: CATALOG_FILES, anchorFiles: [], settings: SETTINGS, strings: STRINGS, selectionFiles: [], markup: null, laws: [], familyFiles: [] });
  const [collapse] = catalog.scripts.collapses;
  assert.deepEqual(collapse.replyLanguages, ['zh-Hans', 'zh-Hant']);
  assert.equal(collapse.catalogScript.script, 'Hans');
  assert.deepEqual(collapse.misserved, ['zh-Hant']);
  assert.deepEqual(collapse.legacy, { legacyCode: 'zh', canonical: 'zh-Hant' });
  assert.equal(catalog.scripts.systemLanguageDropsScript.function, 'normalizedLanguage');
  assert.deepEqual(readScriptMapping({ settings: SETTINGS, strings: null, catalogScopes: [] }).collapses[0].catalogScript.script, 'UNKNOWN');
});

test('DisplayState human text typed as String is hardcoded; VexLifeText fields and machine refs are not', () => {
  const [row] = readDisplayStateText({ laws: [{ family: 'VexLifeNoteFamily', sourcePath: NOTE_FAMILY.path }], files: [NOTE_FAMILY] });
  assert.equal(row.form, 'PARTIALLY_KEYED');
  assert.deepEqual(row.hardcodedFields, ['label', 'detail']);
  assert.deepEqual(row.keyedFields, ['status']);
});

test('markup that carries a key next to data-vex-ref joins the two element-identity systems', () => {
  const keys = readLocalizationCatalog({ scopes: CATALOG_FILES }).keys;
  assert.deepEqual(readKeyedMarkup({ ...MARKUP, keys }), [{ elementSymbol: 'Dictation', tag: 'button', keys: ['workspace.button.dictation-start'], sourcePath: MARKUP.path, line: 6 }]);
});

test('keyed elements manifest Controls and surface DisplayState in the graph; localization gaps become derived frontier', () => {
  const plain = fixtureGraph();
  const keyed = fixtureGraph({ localization: readAll() });
  const start = keyed.edges.filter((edge) => edge.kind === 'MANIFESTS' && edge.to === 'VexLifeDictationFamily.Start').map((edge) => edge.from).sort();
  assert.deepEqual(start, ['element.workspace.dictation', 'key:workspace.button.dictation-start']);
  assert.ok(keyed.edges.some((edge) => edge.kind === 'MANIFESTS' && edge.from === 'element.workspace.dictation' && edge.to === 'VexLifeDictationFamily.Stop' && edge.detail.via === 'LENS_NAMESPACE'));
  assert.ok(keyed.edges.some((edge) => edge.kind === 'PROJECTS_TO' && edge.from === 'VexLifeDictationFamily.DisplayState' && edge.to === 'key:workspace.status.dictation-listening'));

  const before = deriveFrontier(plain);
  const after = deriveFrontier(keyed);
  assert.ok(before.debt.some((row) => row.ref === 'debt:MISSING_MANIFESTATION_BINDING:VexLifeDictationFamily.Start'));
  assert.ok(!after.debt.some((row) => row.ref === 'debt:MISSING_MANIFESTATION_BINDING:VexLifeDictationFamily.Start'), 'the key is the element');
  assert.ok(!after.debt.some((row) => row.ref === 'debt:PROJECTION_NOT_SURFACED:VexLifeDictationFamily.DisplayState'));
  const kinds = Object.fromEntries(after.debt.filter((row) => ['localization:workspace', 'localization:reply:zh-Hant', 'VexLifeProdLocalService.handleStrings', 'key:workspace.button.ghost', 'key:workspace.label.orphan', 'dataKey:VexLifeDictationFamily', 'lens:screen.vexlife-workspace'].includes(row.coordinate)).map((row) => [row.coordinate, `${row.debtClass}:${row.kind}`]));
  assert.deepEqual(kinds, {
    'localization:workspace': 'E:LANGUAGE_INCOMPLETE',
    'localization:reply:zh-Hant': 'E:SCRIPT_COLLAPSE',
    'VexLifeProdLocalService.handleStrings': 'E:PARTIAL_LANGUAGE_SERVED',
    'key:workspace.button.ghost': 'B:DATAKEY_UNRESOLVED',
    'key:workspace.label.orphan': 'B:DATAKEY_UNRESOLVED',
    'dataKey:VexLifeDictationFamily': 'B:DATAKEY_ANCHOR_NOT_IN_MAIN',
    'lens:screen.vexlife-workspace': 'B:LENS_KEY_UNLINKED',
  });
  assert.match(after.debt.find((row) => row.kind === 'DATAKEY_ANCHOR_NOT_IN_MAIN').detail, /dictation:reason \(TEST_SOURCE \+ CATALOG_DECLARED\), dictation:state/);
  const routes = deriveRoutes(keyed, after);
  const ready = routes.routes.find((route) => route.routeRef.startsWith('route:VexLifeDictationFamily.Ready:Start'));
  assert.deepEqual(ready.steps.find((step) => step.step === 'HUMAN_ACTION').elementRefs, ['element.workspace.dictation', 'key:workspace.button.dictation-start']);
});
