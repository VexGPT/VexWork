import assert from 'node:assert/strict';
import test from 'node:test';

import { readFamilyLaw } from '../src/core/experience-graph-kotlin-family.mjs';
import { readLensSurface, readRealizationSites, readSendBoundary, readUntypedControlLiterals } from '../src/core/experience-graph-product-wiring.mjs';
import { BROWSER_RUNTIME_CARRIAGE_ONLY, FAMILY_SOURCES, LENS, SEND_SOURCES, WIRING_FILES } from './fixtures/experience-graph/fixtures.mjs';

const families = FAMILY_SOURCES.map(readFamilyLaw);
const files = [...WIRING_FILES, ...FAMILY_SOURCES];

test('Screen Lens surface keeps element bindings and Family pathway depth as Product-owned coordinates', () => {
  const surface = readLensSurface(LENS);
  const sight = surface.elements.find((element) => element.elementRef === 'element.workspace.sight');
  assert.deepEqual([sight.bindingKind, sight.bindingTarget, sight.pathwayRef], ['CAPABILITY', 'sight.selected-scope', 'pathway.fixture.sight']);
  const dictation = surface.elements.find((element) => element.elementRef === 'element.workspace.dictation');
  assert.deepEqual([dictation.bindingKind, dictation.bindingTarget], ['LOCAL', 'element.workspace.composer']);
  assert.equal(surface.elements.find((element) => element.elementRef === 'element.workspace.composer').bindingKind, null);

  const sightPathway = surface.pathways.find((pathway) => pathway.pathwayRef === 'pathway.fixture.sight');
  assert.equal(sightPathway.family, 'VexLifeSightFamily');
  assert.equal(sightPathway.dispatch.symbol, 'VexLifeProdLocalService');
  assert.equal(sightPathway.dispatch.sourcePath, 'src/jvmMain/kotlin/vexlife/service/VexLifeProdLocalService.kt');
  assert.deepEqual(sightPathway.depth.map((node) => [node.role, node.symbol]), [['CONNECTION', 'VexLifeSightRuntime'], ['PARTNER', 'OS picker session']]);
  assert.equal(sightPathway.projection.symbol, 'VexLifeSightFamily.DisplayState');

  const send = surface.pathways.find((pathway) => pathway.pathwayRef === 'pathway.fixture.send');
  assert.equal(send.family, null);
  assert.equal(send.method.symbol, 'DirectCompanionTurn');
  assert.deepEqual(send.depth.map((node) => node.symbol), ['DirectPromptContext', 'LocalModelRuntime']);
  assert.equal(send.depth[1].sourcePath, null);
  assert.throws(() => readLensSurface({ schemaVersion: 'other' }), /Screen Lens schema mismatch/);
});

test('realization sites find the owning class, typed delegates and browser-runtime Effects; returns include owner State forms', () => {
  const { realizations, returns } = readRealizationSites({ families, files });
  const sight = realizations.filter((row) => row.family === 'VexLifeSightFamily');
  assert.deepEqual(sight.map((row) => [row.effect, row.owner, row.realizationClass]), [
    ['Effect.EngageScope', 'VexLifeProdLocalService', 'JVM_OWNER'],
    ['Effect.StopScope', 'VexLifeProdLocalService', 'JVM_OWNER'],
  ]);
  assert.deepEqual(sight[0].delegates, [{ receiver: 'sightRuntime', method: 'engage', type: 'VexLifeSightRuntime' }]);
  const begin = realizations.find((row) => row.family === 'VexLifeQuietFamily' && row.effect === 'Effect.BeginQuiet');
  assert.deepEqual(begin.delegates.map((row) => row.type), ['VexLifeQuietConversation'], 'library-typed locals are not delegates');
  const dictation = realizations.filter((row) => row.family === 'VexLifeDictationFamily');
  assert.deepEqual(dictation.map((row) => [row.effect, row.owner, row.realizationClass, row.handler]), [
    ['BeginDictation', 'VexLifeWebRuntimeArtifacts', 'BROWSER_RUNTIME', 'realizeBeginDictation'],
    ['EndDictation', 'VexLifeWebRuntimeArtifacts', 'BROWSER_RUNTIME', 'realizeEndDictation'],
  ]);

  const carriageOnlyFiles = [
    ...WIRING_FILES.filter((file) => file.path !== 'src/commonMain/kotlin/vexlife/web/VexLifeWebRuntimeArtifacts.kt'),
    { path: 'src/commonMain/kotlin/vexlife/web/VexLifeWebRuntimeArtifacts.kt', text: BROWSER_RUNTIME_CARRIAGE_ONLY },
    ...FAMILY_SOURCES,
  ];
  const carriedOnly = readRealizationSites({ families, files: carriageOnlyFiles }).realizations
    .filter((row) => row.family === 'VexLifeDictationFamily');
  assert.deepEqual(carriedOnly, [], 'serializing Effect refs into browser vocabulary is not realization evidence');
  assert.ok(realizations.some((row) => row.family === 'VexLifeStockFamily' && row.owner === 'VexLifeStock'));

  const forms = Object.fromEntries(returns.map((row) => [`${row.family}:${row.observation}`, row.returnForm]));
  assert.equal(forms['VexLifeSightFamily:observe'], 'FAMILY_OBSERVATION');
  assert.equal(forms['VexLifeSightFamily:VexLifeProdLocalService.observedSightState'], 'OWNER_RETURNS_STATE');
  assert.equal(forms['VexLifeQuietFamily:VexLifeQuietConversation.state'], 'OWNER_RETURNS_STATE');
  assert.equal(forms['VexLifeStockFamily:VexLifeStock:forms-state'], 'OWNER_FORMS_STATE');
  assert.equal(forms['VexLifeDictationFamily:observeStarted'], 'FAMILY_OBSERVATION');
  assert.ok(returns.every((row) => Array.isArray(row.lines) && row.lines.length >= 1));
  assert.throws(() => readRealizationSites({ families: null, files }), /needs Family law/);
});

test('raw controlRef literals in generated presentation are evidence for a frontier, never edges', () => {
  const rows = readUntypedControlLiterals({ families, files });
  assert.deepEqual(rows.map((row) => [row.family, row.controlRef, row.sourcePath]), [
    ['VexLifeQuietFamily', 'CLEAR', 'src/commonMain/kotlin/vexlife/web/VexLifeWebRuntimeArtifacts.kt'],
  ]);
});

test('the accepted-Send boundary reads Intent capture law, current-truth sources, admission gates and Receipt evidence', () => {
  const send = readSendBoundary(SEND_SOURCES);
  assert.deepEqual(send.intentFields.map((field) => field.name), ['browserContext', 'personContext', 'contextProfile']);
  assert.equal(send.idempotency.name, 'idempotencyKey');
  assert.match(send.intentFields.find((field) => field.name === 'contextProfile').doc, /later profile edit belongs to the next Send/);
  assert.equal(send.intentFields.find((field) => field.name === 'browserContext').doc, null);
  assert.match(send.intentFields.find((field) => field.name === 'personContext').doc, /see DirectPromptContext\.PersonContext/);

  const byField = Object.fromEntries(send.captures.map((capture) => [capture.field, capture.sources]));
  assert.deepEqual(byField.personContext, [{ receiver: 'personSettings', method: 'read', ownerType: 'VexLifePersonSettingsStore', via: 'personContext' }]);
  assert.deepEqual(byField.contextProfile, [{ receiver: 'profiles', method: 'readActive', ownerType: 'VexLifeProfileStore' }]);
  assert.deepEqual(byField.browserContext, [{ receiver: 'request', method: 'browserContext', ownerType: 'PRESENTATION_REQUEST' }]);

  assert.deepEqual(send.gates.map((gate) => [gate.refusalCode, gate.family, gate.state, gate.receiverType, gate.receiverMethod]), [
    ['MODEL_SWITCH_HELD', null, null, 'VexLifeStock', 'switchHeld'],
    ['QUIET_MODE_ON', 'VexLifeQuietFamily', 'Quiet', 'VexLifeQuietConversation', 'state'],
  ]);
  assert.deepEqual(send.receipt.map((row) => [row.field, row.receiptField]).sort(), [
    ['browserContext', 'browserContextIncluded'],
    ['contextProfile', 'contextProfileRef'],
    ['personContext', 'personContext'],
    ['personContext', 'personContextIncluded'],
  ]);
  assert.throws(() => readSendBoundary({ ...SEND_SOURCES, promptSource: null }), /promptSource must be one source file/);
});

test('a service without a sendIntent builder yields an empty but well-formed boundary', () => {
  const send = readSendBoundary({ ...SEND_SOURCES, serviceSource: { path: 'Empty.kt', text: 'class Empty {}' } });
  assert.deepEqual(send.captures, []);
  assert.deepEqual(send.gates, []);
  assert.deepEqual(send.receipt, []);
});
