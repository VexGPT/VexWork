import assert from 'node:assert/strict';
import test from 'node:test';

import {
  IDENTITY_KINDS, indexEnumEntries, indexFamilyVocabulary, indexStringConstants, readDomIdBindings, readKotlinLiterals,
  readReflection, readRuntimeLiterals, readStringIdentity,
} from '../src/core/experience-graph-identity.mjs';
import { deriveFrontier } from '../src/core/experience-graph-derivation.mjs';
import { fixtureGraph, fixtureLaws } from './fixtures/experience-graph/graph.mjs';
import { FAMILY_SOURCES } from './fixtures/experience-graph/fixtures.mjs';
import { MARKUP, MODES, MODES_CONSUMER, NOTE_FAMILY, RUNTIME_SOURCE } from './fixtures/experience-graph/localization.mjs';

test('string constants are owned by their enclosing object even when its header spans lines', () => {
  const constants = indexStringConstants([...FAMILY_SOURCES, MODES]);
  assert.deepEqual(constants.get('EXTEND_DEFAULT').map((row) => row.symbol), ['Modes.ExtendDefault']);
  assert.deepEqual(constants.get('LISTENING').map((row) => row.symbol), ['VexLifeDictationFamily.StateListening'], 'VexLifeDictationFamily opens its body several lines after its name');
  assert.ok(indexFamilyVocabulary(fixtureLaws()).get('START').some((row) => row.symbol === 'VexLifeDictationFamily.Start'));
  assert.deepEqual(indexEnumEntries([{ path: 'e.kt', text: 'enum class Mode { EXTEND_DEFAULT, REPLACE_DEFAULT }' }]).get('REPLACE_DEFAULT').map((row) => row.symbol), ['Mode.REPLACE_DEFAULT']);
});

test('runtime literal compares are told apart: shadowing an owned value, or a wire value nobody owns; interpolated constants are not literals', () => {
  const constants = indexStringConstants([...FAMILY_SOURCES, MODES]);
  const rows = readRuntimeLiterals({ files: [RUNTIME_SOURCE], constants, enums: indexFamilyVocabulary(fixtureLaws()) });
  assert.deepEqual(rows.map((row) => `${row.literal}:${row.owners.join(',') || '-'}`), [
    'LISTENING:VexLifeDictationFamily.Listening,VexLifeDictationFamily.StateListening',
    'REASONING_DELTA:-',
    'EXTEND_DEFAULT:Modes.ExtendDefault',
  ]);
});

test('Kotlin literals: Family law reading a wire string, and a literal shadowing a constant its file already references', () => {
  const constants = indexStringConstants([MODES]);
  const rows = readKotlinLiterals({ files: [NOTE_FAMILY, MODES_CONSUMER], constants, enums: new Map(), familyPaths: new Set([NOTE_FAMILY.path]) });
  assert.deepEqual(rows.map((row) => `${row.layer}:${row.literal}:${row.owners.join(',') || '-'}`), ['FAMILY_LAW:ENDED:-', 'KOTLIN:EXTEND_DEFAULT:Modes.ExtendDefault']);
});

test('DOM-id bindings distinguish a bypassed typed ref, an untyped interactive element and a presentation slot', () => {
  const dom = readDomIdBindings({ markup: MARKUP, runtime: RUNTIME_SOURCE });
  assert.deepEqual(dom.rows.map((row) => `${row.elementId}:${row.kind}`), ['dictation:TYPED_REF_BYPASSED', 'note-field:UNTYPED_INTERACTIVE', 'status-slot:PRESENTATION_SLOT']);
  assert.equal(dom.typedSelectors, 0);
});

test('a reflected name that only becomes error text is evidence; one returned as a key is identity', () => {
  assert.deepEqual(readReflection({ files: [MODES_CONSUMER] }).map((row) => `${row.line}:${row.use}`), ['9:EVIDENCE_TEXT', '12:REFLECTION_IDENTITY']);
});

test('string identity becomes class-B frontier at exact coordinates', () => {
  const stringIdentity = readStringIdentity({ mainFiles: [...FAMILY_SOURCES, MODES, MODES_CONSUMER, NOTE_FAMILY], familyPaths: new Set([NOTE_FAMILY.path]), markup: MARKUP, runtime: RUNTIME_SOURCE, laws: fixtureLaws() });
  const frontier = deriveFrontier(fixtureGraph({ stringIdentity }));
  const kinds = [...new Set(frontier.debt.filter((row) => IDENTITY_KINDS.includes(row.kind) || row.kind === 'UNOWNED_WIRE_LITERAL').map((row) => `${row.debtClass}:${row.kind}`))].sort();
  assert.deepEqual(kinds, ['B:FAMILY_READS_WIRE_STRING', 'B:LITERAL_SHADOWS_CONSTANT', 'B:REFLECTION_IDENTITY', 'B:TYPED_REF_BYPASSED', 'B:UNOWNED_WIRE_LITERAL', 'B:UNTYPED_INTERACTIVE']);
  const shadow = frontier.debt.find((row) => row.coordinate === 'VexLifeWebRuntime.kt:EXTEND_DEFAULT#1');
  assert.deepEqual(shadow.hints, ['Modes.ExtendDefault']);
  assert.match(frontier.debt.find((row) => row.kind === 'FAMILY_READS_WIRE_STRING').detail, /"ENDED" L14/);
});
