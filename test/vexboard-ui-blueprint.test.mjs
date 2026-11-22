import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createUiBlueprint,
  defaultSeams,
  effectiveKind,
  expandBlueprint,
  migrateUiBlueprintV1,
  normalizeUiBlueprint,
  readUiBlueprint,
  sourceEvidenceFromOccurrence,
  UI_BLUEPRINT_SCHEMA,
  UI_FRACTION_DENOMINATOR,
  UI_PREVIEW_PROFILES,
  uiBlueprintBytes,
  walkResolved,
} from '../src/shared/vexboard-ui-blueprint.mjs';
import { android, architecture, inventories, prod, stream } from './fixtures/ui-builder-fixtures.mjs';

const make = (nodes, extra = {}) => createUiBlueprint({ blueprintRef: 'ui.test', label: 'Test', nodes, ...extra });
const throwsLike = (fn, pattern) => assert.throws(fn, (error) => error instanceof TypeError && pattern.test(error.message));

function actionRow() {
  return {
    definitionRef: 'component.action-row',
    label: 'Action row',
    version: 1,
    rootNodeRef: 'r',
    slots: [{ slotRef: 'extra', label: 'Extra', templateNodeRef: 'r' }],
    nodes: [
      { nodeRef: 'r', kind: 'GROUP', layout: { container: { mode: 'STACK', axis: 'HORIZONTAL' } } },
      { nodeRef: 'b', kind: 'BUTTON', parentRef: 'r', order: 0, source: android.localButton() },
    ],
  };
}

test('source evidence keeps exact occurrence, commit and portable disposition', () => {
  const source = android.darkMode();
  assert.equal(source.subjectRef, inventories.android.subjectRef);
  assert.equal(source.commit, inventories.android.sourceSnapshot.commit);
  assert.equal(source.actionKeyOrNull, 'action.theme.dark-mode.toggle');
  assert.ok(['PORTABLE_RELATIONSHIP_AVAILABLE', 'PORTABILITY_HELD', 'SOURCE_BOUND'].includes(source.portable.disposition));
  const bare = sourceEvidenceFromOccurrence({ inventory: inventories.android, occurrenceRef: inventories.android.occurrences[0].occurrenceRef, architectureCatalog: null });
  assert.equal(bare.portable.disposition, 'SOURCE_BOUND');
  throwsLike(() => sourceEvidenceFromOccurrence({ inventory: inventories.android, occurrenceRef: 'missing', architectureCatalog: architecture }), /unknown occurrence/u);
});

test('regression: Android intents produce OPEN seams even though source interactions are empty', () => {
  const intentful = inventories.android.occurrences.filter((row) => row.intent || row.actionKey);
  assert.ok(intentful.length > 100);
  assert.ok(intentful.every((row) => row.interactions.length === 0), 'fixture premise: Android projects no interactions');
  const blueprint = make([{ nodeRef: 'dark', kind: 'TOGGLE', source: android.darkMode() }]);
  assert.deepEqual(blueprint.derived.integration.actions.map((row) => row.key), ['action.theme.dark-mode.toggle']);
  assert.deepEqual(blueprint.derived.integration.actions[0].sourceActionKeys, ['action.theme.dark-mode.toggle']);
  assert.equal(blueprint.nodes[0].behavior.seams[0].binding, 'OPEN');
});

test('blueprints are non-executing, versioned and deterministic', () => {
  const blueprint = make([
    { nodeRef: 'card', kind: 'CARD', source: android.card() },
    { nodeRef: 'btn', kind: 'BUTTON', parentRef: 'card', source: android.localButton() },
  ]);
  assert.equal(blueprint.schemaVersion, UI_BLUEPRINT_SCHEMA);
  assert.equal(blueprint.aiRequired, false);
  assert.equal(blueprint.effects, false);
  assert.equal(blueprint.executionAuthority, 'NONE');
  assert.equal(blueprint.units.fractionDenominator, UI_FRACTION_DENOMINATOR);
  assert.equal(blueprint.preview.previewOnly, true);
  assert.ok(Object.isFrozen(blueprint));
  const bytes = uiBlueprintBytes(blueprint);
  assert.equal(uiBlueprintBytes(JSON.parse(bytes)), bytes);
  assert.deepEqual(blueprint.derived.sourceSnapshots, [{ repositoryRef: 'repo.vexlife-android', commit: inventories.android.sourceSnapshot.commit }]);
  assert.equal(Object.keys(UI_PREVIEW_PROFILES).length, 3);
});

test('import detects tampered derived sections, wrong units and executing envelopes', () => {
  const blueprint = JSON.parse(uiBlueprintBytes(make([{ nodeRef: 'dark', kind: 'TOGGLE', source: android.darkMode() }])));
  throwsLike(() => normalizeUiBlueprint({ ...blueprint, derived: { ...blueprint.derived, summary: { ...blueprint.derived.summary, nodeCount: 9 } } }), /derived/u);
  throwsLike(() => normalizeUiBlueprint({ ...blueprint, units: { length: 'px', fractionDenominator: 24 } }), /units/u);
  throwsLike(() => normalizeUiBlueprint({ ...blueprint, effects: true }), /non-executing/u);
  throwsLike(() => normalizeUiBlueprint({ ...blueprint, aiRequired: true }), /aiRequired/u);
  throwsLike(() => normalizeUiBlueprint({ ...blueprint, schemaVersion: 'nope' }), /schemaVersion/u);
  throwsLike(() => readUiBlueprint({ schemaVersion: 'vexboard.ui-blueprint/v9' }), /unsupported/u);
  throwsLike(() => readUiBlueprint(null), /unsupported/u);
  const ok = readUiBlueprint(blueprint);
  assert.equal(ok.migratedFrom, null);
});

test('regression: invalid nesting, nested overlays and leaf-in-leaf are rejected', () => {
  throwsLike(() => make([
    { nodeRef: 'a', kind: 'BUTTON', source: android.localButton() },
    { nodeRef: 'b', kind: 'TEXT', parentRef: 'a', source: android.text() },
  ]), /cannot be placed inside/u);
  throwsLike(() => make([
    { nodeRef: 'card', kind: 'CARD', source: android.card() },
    { nodeRef: 'dlg', kind: 'DIALOG', parentRef: 'card', source: android.dialog() },
  ]), /overlays attach to the surface/u);
  throwsLike(() => make([
    { nodeRef: 'menu', kind: 'MENU', source: android.menu() },
    { nodeRef: 'btn', kind: 'BUTTON', parentRef: 'menu', source: android.localButton() },
  ]), /cannot be placed inside/u);
  throwsLike(() => make([{ nodeRef: 'x', kind: 'TEXT', parentRef: 'missing', source: android.text() }]), /missing parent/u);
  throwsLike(() => make([{ nodeRef: 'x', kind: 'GROUP', parentRef: 'x' }]), /cannot parent itself/u);
  throwsLike(() => make([
    { nodeRef: 'a', kind: 'GROUP', parentRef: 'b' },
    { nodeRef: 'b', kind: 'GROUP', parentRef: 'a' },
  ]), /cycle/u);
  throwsLike(() => make([{ nodeRef: 'a', kind: 'GROUP' }, { nodeRef: 'a', kind: 'GROUP' }]), /duplicate node/u);
  throwsLike(() => make([{ nodeRef: 'bad ref', kind: 'GROUP' }]), /invalid characters/u);
});

test('regression: source evidence is immutable and authored copy lives beside it', () => {
  const source = android.localButton();
  throwsLike(() => make([{ nodeRef: 'b', kind: 'BUTTON', source, content: { text: { origin: 'SOURCE', value: 'Forged' } } }]), /observed source label/u);
  throwsLike(() => make([{ nodeRef: 'b', kind: 'TEXT', source }]), /must equal its source kind/u);
  throwsLike(() => make([{ nodeRef: 'g', kind: 'GROUP', content: { text: { value: 'x' } } }]), /without text/u);
  throwsLike(() => make([{ nodeRef: 'b', kind: 'BUTTON' }]), /source node, a layout GROUP/u);
  const blueprint = make([{ nodeRef: 'b', kind: 'BUTTON', source, content: { text: { origin: 'AUTHORED', value: 'Save profile' } } }]);
  assert.equal(blueprint.nodes[0].source.label, source.label);
  assert.deepEqual(blueprint.nodes[0].content.text, { value: 'Save profile', origin: 'AUTHORED', localization: { state: 'NEEDS_KEY', sourceStringRefs: [] } });
  const bound = make([{ nodeRef: 'b', kind: 'BUTTON', source }]);
  assert.equal(bound.nodes[0].content.text.localization.state, 'BOUND');
  const streamButton = make([{ nodeRef: 'b', kind: 'BUTTON', source: stream.button() }]);
  assert.equal(streamButton.nodes[0].content.text.localization.state, 'NOT_PROJECTED');
});

test('regression: one layout system — placement follows the parent container mode', () => {
  const stacked = make([
    { nodeRef: 'col', kind: 'COLUMN', source: android.column() },
    { nodeRef: 'btn', kind: 'BUTTON', parentRef: 'col', source: android.localButton() },
  ]);
  assert.equal(stacked.nodes[1].layout.placement, null);
  throwsLike(() => make([
    { nodeRef: 'col', kind: 'COLUMN', source: android.column() },
    { nodeRef: 'btn', kind: 'BUTTON', parentRef: 'col', source: android.localButton(), layout: { placement: { type: 'FRACTION', x: { start: 0, end: 4 }, y: { start: 0, end: null } } } },
  ]), /only valid inside layered or free-form/u);
  throwsLike(() => make([
    { nodeRef: 'g', kind: 'GROUP', layout: { container: { mode: 'FREEFORM' } } },
  ]), /FIXED height/u);
  const freeform = make([
    { nodeRef: 'g', kind: 'GROUP', layout: { container: { mode: 'FREEFORM' }, height: { mode: 'FIXED', valueOrNull: 320 } } },
    { nodeRef: 'btn', kind: 'BUTTON', parentRef: 'g', source: android.localButton(), layout: { placement: { type: 'FRACTION', x: { start: 2, end: 22 }, y: { start: 3, end: null } }, depth: 1 } },
    { nodeRef: 'txt', kind: 'TEXT', parentRef: 'g', order: 1, source: android.text(), layout: { placement: { type: 'FRACTION', x: { start: 2, end: null }, y: { start: 0, end: 2 } } } },
  ]);
  assert.deepEqual(freeform.nodes[1].layout.placement, { type: 'FRACTION', x: { start: 2, end: 22 }, y: { start: 3, end: null } });
  throwsLike(() => make([
    { nodeRef: 'g', kind: 'GROUP', layout: { container: { mode: 'FREEFORM' }, height: { mode: 'FIXED', valueOrNull: 320 } } },
    { nodeRef: 'btn', kind: 'BUTTON', parentRef: 'g', source: android.localButton() },
  ]), /FRACTION placement/u);
  throwsLike(() => make([
    { nodeRef: 'g', kind: 'GROUP', layout: { container: { mode: 'FREEFORM' }, height: { mode: 'FIXED', valueOrNull: 320 } } },
    { nodeRef: 'btn', kind: 'BUTTON', parentRef: 'g', source: android.localButton(), layout: { placement: { type: 'FRACTION', x: { start: 10, end: 4 }, y: { start: 0 } } } },
  ]), /greater than start/u);
  throwsLike(() => make([
    { nodeRef: 'g', kind: 'GROUP', layout: { container: { mode: 'FREEFORM' }, height: { mode: 'FIXED', valueOrNull: 320 } } },
    { nodeRef: 'btn', kind: 'BUTTON', parentRef: 'g', source: android.localButton(), layout: { placement: { type: 'FRACTION', x: { start: 24 }, y: { start: 0 } } } },
  ]), /below 24/u);
  const layered = make([
    { nodeRef: 'g', kind: 'GROUP', layout: { container: { mode: 'OVERLAY' } } },
    { nodeRef: 'btn', kind: 'BUTTON', parentRef: 'g', source: android.localButton(), layout: { placement: { type: 'ANCHOR', anchor: 'BOTTOM_END', inset: 'M' } } },
  ]);
  assert.equal(layered.nodes[1].layout.placement.anchor, 'BOTTOM_END');
  throwsLike(() => make([
    { nodeRef: 'g', kind: 'GROUP', layout: { container: { mode: 'OVERLAY' } } },
    { nodeRef: 'btn', kind: 'BUTTON', parentRef: 'g', source: android.localButton() },
  ]), /ANCHOR placement/u);
  throwsLike(() => make([{ nodeRef: 'btn', kind: 'BUTTON', source: android.localButton(), layout: { container: { mode: 'STACK' } } }]), /only valid for container/u);
  throwsLike(() => make([{ nodeRef: 'btn', kind: 'BUTTON', source: android.localButton(), layout: { width: { mode: 'FIXED' } } }]), /positive number/u);
  throwsLike(() => make([{ nodeRef: 'btn', kind: 'BUTTON', source: android.localButton(), layout: { width: { mode: 'HUG', valueOrNull: 10 } } }]), /only valid for FIXED/u);
  throwsLike(() => make([{ nodeRef: 'btn', kind: 'BUTTON', source: android.localButton(), layout: { width: { mode: 'STRETCHY' } } }]), /must be one of/u);
});

test('free-form surface makes root content fractional; preview size never becomes layout meaning', () => {
  const surface = { container: { mode: 'FREEFORM' } };
  throwsLike(() => make([{ nodeRef: 'btn', kind: 'BUTTON', source: android.localButton() }], { surface }), /FRACTION placement/u);
  const compact = make([{ nodeRef: 'btn', kind: 'BUTTON', source: android.localButton(), layout: { placement: { type: 'FRACTION', x: { start: 1, end: 12 }, y: { start: 2, end: null } } } }], { surface, preview: { profile: 'COMPACT' } });
  const expanded = make([{ nodeRef: 'btn', kind: 'BUTTON', source: android.localButton(), layout: { placement: { type: 'FRACTION', x: { start: 1, end: 12 }, y: { start: 2, end: null } } } }], { surface, preview: { profile: 'EXPANDED', direction: 'RTL' } });
  assert.deepEqual(compact.nodes, expanded.nodes);
  assert.equal(expanded.preview.direction, 'RTL');
});

test('depth is sibling-local and only exists where layering means something', () => {
  throwsLike(() => make([
    { nodeRef: 'col', kind: 'COLUMN', source: android.column() },
    { nodeRef: 'btn', kind: 'BUTTON', parentRef: 'col', source: android.localButton(), layout: { depth: 2 } },
  ]), /depth only applies/u);
  throwsLike(() => make([
    { nodeRef: 'g', kind: 'GROUP', layout: { container: { mode: 'OVERLAY' } } },
    { nodeRef: 'a', kind: 'TEXT', parentRef: 'g', order: 0, source: android.text(), layout: { placement: { type: 'ANCHOR', anchor: 'CENTER' }, depth: 0 } },
    { nodeRef: 'b', kind: 'TEXT', parentRef: 'g', order: 1, source: android.text(), layout: { placement: { type: 'ANCHOR', anchor: 'CENTER' }, depth: 0 } },
  ]), /duplicate sibling depth/u);
  throwsLike(() => make([
    { nodeRef: 'a', kind: 'TEXT', order: 0, source: android.text() },
    { nodeRef: 'b', kind: 'TEXT', order: 0, source: android.text() },
  ]), /duplicate sibling order/u);
  const overlays = make([
    { nodeRef: 'dlg', kind: 'DIALOG', source: android.dialog(), layout: { depth: 0 } },
    { nodeRef: 'sheet', kind: 'SHEET', order: 1, source: android.sheet(), layout: { depth: 1 } },
  ]);
  assert.equal(overlays.derived.summary.overlayCount, 2);
  throwsLike(() => make([{ nodeRef: 'dlg', kind: 'DIALOG', source: android.dialog(), layout: { placement: { type: 'ANCHOR', anchor: 'CENTER' } } }]), /only valid inside/u);
});

test('visibility: overlays appear when opened, source conditions become OPEN condition seams', () => {
  const blueprint = make([
    { nodeRef: 'dlg', kind: 'DIALOG', source: android.dialog() },
    { nodeRef: 'cond', kind: android.conditional().kind, source: android.conditional() },
  ]);
  const dialog = blueprint.nodes.find((row) => row.nodeRef === 'dlg');
  assert.equal(dialog.visibility.presence, 'WHEN_OPEN');
  const conditional = blueprint.nodes.find((row) => row.nodeRef === 'cond');
  assert.equal(conditional.visibility.presence, 'CONDITIONAL');
  assert.ok(conditional.visibility.sourceVisibleWhenOrNull);
  assert.equal(blueprint.derived.integration.conditions.length, 1);
  throwsLike(() => make([{ nodeRef: 't', kind: 'TEXT', source: android.text(), visibility: { presence: 'WHEN_OPEN' } }]), /only valid for overlays/u);
  throwsLike(() => make([{ nodeRef: 't', kind: 'TEXT', source: android.text(), visibility: { presence: 'CONDITIONAL' } }]), /conditionKeyOrNull is required/u);
  throwsLike(() => make([{ nodeRef: 't', kind: 'TEXT', source: android.text(), visibility: { presence: 'CONDITIONAL', conditionKeyOrNull: '!!' } }]), /seam key/u);
  throwsLike(() => make([{ nodeRef: 't', kind: 'TEXT', source: android.text(), visibility: { presence: 'ALWAYS', conditionKeyOrNull: 'x' } }]), /only valid for CONDITIONAL/u);
  const always = make([{ nodeRef: 't', kind: 'TEXT', source: android.text(), visibility: { presence: 'ALWAYS' } }]);
  assert.equal(always.nodes[0].visibility.presence, 'ALWAYS');
});

test('behavior seams: Builder-local overlay links vs OPEN app seams, never callback bodies', () => {
  const button = android.localButton();
  const seams = [...defaultSeams('btn', 'BUTTON', button), { seamRef: 'a1', kind: 'PRESENTATION', key: 'open.confirm', verbOrNull: 'OPEN', targetNodeRefOrNull: 'dlg' }];
  const blueprint = make([
    { nodeRef: 'btn', kind: 'BUTTON', source: button, behavior: { seams } },
    { nodeRef: 'dlg', kind: 'DIALOG', source: android.dialog() },
  ]);
  const presentation = blueprint.derived.integration.presentation;
  assert.equal(presentation.length, 1);
  assert.equal(presentation[0].binding, 'BUILDER_LOCAL');
  assert.equal(presentation[0].targetPathOrNull, 'dlg');
  assert.equal(blueprint.derived.summary.builderLocalPresentationCount, 1);
  const base = { seamRef: 'a1', key: 'x.y' };
  throwsLike(() => make([{ nodeRef: 'btn', kind: 'BUTTON', source: button, behavior: { seams: [{ ...base, kind: 'ACTION', binding: 'BOUND' }] } }]), /binding must be OPEN/u);
  throwsLike(() => make([{ nodeRef: 'btn', kind: 'BUTTON', source: button, behavior: { seams: [{ ...base, kind: 'ACTION', key: 'Not A Key' }] } }]), /lowercase dotted/u);
  throwsLike(() => make([{ nodeRef: 'btn', kind: 'BUTTON', source: button, behavior: { seams: [{ ...base, kind: 'ACTION', origin: 'SOURCE' }] } }]), /keep their source evidence/u);
  throwsLike(() => make([{ nodeRef: 'btn', kind: 'BUTTON', source: button, behavior: { seams: [{ ...base, kind: 'ACTION', source: { intent: 'x' } }] } }]), /cannot claim source/u);
  throwsLike(() => make([{ nodeRef: 'btn', kind: 'BUTTON', source: button, behavior: { seams: [{ ...base, kind: 'ACTION', destinationOrNull: 'x' }] } }]), /only valid for NAVIGATION/u);
  throwsLike(() => make([{ nodeRef: 'btn', kind: 'BUTTON', source: button, behavior: { seams: [{ ...base, kind: 'ACTION', verbOrNull: 'OPEN' }] } }]), /only valid for PRESENTATION/u);
  throwsLike(() => make([{ nodeRef: 'btn', kind: 'BUTTON', source: button, behavior: { seams: [{ ...base, kind: 'PRESENTATION', targetNodeRefOrNull: 'btn' }] } }]), /own node/u);
  throwsLike(() => make([{ nodeRef: 'btn', kind: 'BUTTON', source: button, behavior: { seams: [{ ...base, kind: 'PRESENTATION', targetNodeRefOrNull: 'gone' }] } }]), /missing node/u);
  throwsLike(() => make([
    { nodeRef: 'btn', kind: 'BUTTON', source: button, behavior: { seams: [{ ...base, kind: 'PRESENTATION', targetNodeRefOrNull: 'txt' }] } },
    { nodeRef: 'txt', kind: 'TEXT', order: 1, source: android.text() },
  ]), /only open\/close overlays/u);
  throwsLike(() => make([
    { nodeRef: 'btn', kind: 'BUTTON', source: button, behavior: { seams: [{ ...base, kind: 'PRESENTATION', verbOrNull: 'SWAP', targetNodeRefOrNull: 'dlg' }] } },
    { nodeRef: 'dlg', kind: 'DIALOG', source: android.dialog() },
  ]), /cannot be bound to an overlay/u);
  throwsLike(() => make([{ nodeRef: 'btn', kind: 'BUTTON', source: button, behavior: { seams: [{ ...base, kind: 'ACTION' }, { ...base, kind: 'ACTION' }] } }]), /duplicate seamRefs/u);
  const nav = make([{ nodeRef: 'go', kind: 'BUTTON', source: android.navButton() }, { nodeRef: 'menu', kind: 'MENU_ITEM', order: 1, source: android.compoundMenuItem() }].slice(0, 1));
  assert.equal(nav.derived.integration.navigation.length, 1);
  assert.ok(nav.derived.integration.navigation[0].destinations.length);
});

test('VexLife Prod structure kinds and capability intents are first-class', () => {
  const blueprint = make([
    { nodeRef: 'region', kind: 'REGION', source: prod.region() },
    { nodeRef: 'seam', kind: 'SEAM', parentRef: 'region', source: prod.seam() },
    { nodeRef: 'handle', kind: 'HANDLE', parentRef: 'region', order: 1, source: prod.handle() },
    { nodeRef: 'send', kind: 'BUTTON', parentRef: 'region', order: 2, source: prod.capabilityButton() },
    { nodeRef: 'help', kind: 'BUTTON', parentRef: 'region', order: 3, source: prod.externalButton() },
    { nodeRef: 'reveal', kind: 'BUTTON', parentRef: 'region', order: 4, source: prod.localReveal() },
  ]);
  assert.equal(blueprint.derived.summary.unknownKindCount, 0);
  assert.ok(blueprint.derived.integration.presentation.some((row) => row.verb === 'RESIZE'));
  assert.ok(blueprint.derived.integration.navigation.some((row) => row.key === 'navigate.external'));
  assert.ok(blueprint.derived.integration.actions.length >= 1);
  const unknown = make([{ nodeRef: 'x', kind: 'CAROUSEL', source: { ...android.text(), kind: 'CAROUSEL' } }]);
  assert.equal(unknown.derived.summary.unknownKindCount, 1);
});

test('accessibility relationships are explicit and validated', () => {
  const blueprint = make([{ nodeRef: 'img', kind: 'IMAGE', source: android.image(), accessibility: { decorative: true } }]);
  assert.equal(blueprint.nodes[0].accessibility.decorative, true);
  throwsLike(() => make([{ nodeRef: 't', kind: 'TEXT', source: android.text(), accessibility: { decorative: true } }]), /only valid for images/u);
});

test('regression: instances are references with declared overrides, not editable stamped copies', () => {
  const blueprint = make([
    { nodeRef: 'i1', kind: 'INSTANCE', instance: { definitionRef: 'component.action-row', definitionVersion: 1, portBindings: [{ portRef: 'b/s1', key: 'profile.save' }] } },
    { nodeRef: 'i2', kind: 'INSTANCE', order: 1, instance: { definitionRef: 'component.action-row', definitionVersion: 1, textOverrides: [{ templatePath: 'b', value: 'Cancel' }] } },
    { nodeRef: 'kid', kind: 'TEXT', parentRef: 'i2', slotRef: 'extra', source: android.text() },
  ], { definitions: [actionRow()] });
  assert.equal(blueprint.nodes.filter((row) => row.kind === 'INSTANCE').length, 2);
  const definition = blueprint.definitions[0];
  assert.deepEqual(definition.ports.map((row) => row.portRef), ['b/s1']);
  assert.deepEqual(definition.texts.map((row) => row.templatePath), ['b']);
  const keys = blueprint.derived.integration.actions.map((row) => row.key).sort();
  assert.ok(keys.includes('profile.save'));
  const expanded = expandBlueprint(blueprint);
  const paths = [];
  walkResolved(expanded, (node) => paths.push(node.path + '=' + (node.text?.value ?? '')));
  assert.ok(paths.includes('i2/b=Cancel'));
  assert.ok(paths.includes('kid=' + android.text().label));
  const i2 = expanded.content.find((row) => row.path === 'i2');
  assert.equal(i2.children.at(-1).path, 'kid', 'slot child renders inside the slot host');
  assert.equal(effectiveKind(blueprint.nodes[0], blueprint.definitions), 'GROUP');
  throwsLike(() => make([{ nodeRef: 'i', kind: 'INSTANCE', instance: { definitionRef: 'component.action-row', definitionVersion: 1 }, behavior: { seams: [{ seamRef: 'x', kind: 'ACTION', key: 'a' }] } }], { definitions: [actionRow()] }), /definition ports/u);
  throwsLike(() => make([{ nodeRef: 'i', kind: 'INSTANCE', instance: { definitionRef: 'component.action-row', definitionVersion: 2 } }], { definitions: [actionRow()] }), /definition is v1/u);
  throwsLike(() => make([{ nodeRef: 'i', kind: 'INSTANCE', instance: { definitionRef: 'component.nope', definitionVersion: 1 } }], { definitions: [actionRow()] }), /missing component definition/u);
  throwsLike(() => make([{ nodeRef: 'i', kind: 'INSTANCE', instance: { definitionRef: 'component.action-row', definitionVersion: 1, textOverrides: [{ templatePath: 'r', value: 'x' }] } }], { definitions: [actionRow()] }), /unknown text/u);
  throwsLike(() => make([{ nodeRef: 'i', kind: 'INSTANCE', instance: { definitionRef: 'component.action-row', definitionVersion: 1, portBindings: [{ portRef: 'zz', key: 'a' }] } }], { definitions: [actionRow()] }), /unknown port/u);
  throwsLike(() => make([{ nodeRef: 'i', kind: 'INSTANCE', instance: { definitionRef: 'component.action-row', definitionVersion: 1, portBindings: [{ portRef: 'b/s1', key: 'a' }, { portRef: 'b/s1', key: 'b' }] } }], { definitions: [actionRow()] }), /duplicate port/u);
  throwsLike(() => make([{ nodeRef: 'i', kind: 'INSTANCE', instance: { definitionRef: 'component.action-row', definitionVersion: 1, textOverrides: [{ templatePath: 'b', value: 'a' }, { templatePath: 'b', value: 'b' }] } }], { definitions: [actionRow()] }), /duplicate text/u);
  throwsLike(() => make([{ nodeRef: 'i', kind: 'INSTANCE', instance: { definitionRef: 'component.action-row', definitionVersion: 1, portBindings: [{ portRef: 'b/s1', key: '!' }] } }], { definitions: [actionRow()] }), /seam key/u);
  throwsLike(() => make([{ nodeRef: 'i', kind: 'BUTTON', instance: { definitionRef: 'component.action-row', definitionVersion: 1 } }], { definitions: [actionRow()] }), /kind INSTANCE/u);
  throwsLike(() => make([{ nodeRef: 'i', kind: 'INSTANCE', source: android.text(), instance: { definitionRef: 'component.action-row', definitionVersion: 1 } }], { definitions: [actionRow()] }), /both a source node and an instance/u);
  throwsLike(() => make([
    { nodeRef: 'i', kind: 'INSTANCE', instance: { definitionRef: 'component.action-row', definitionVersion: 1 } },
    { nodeRef: 'kid', kind: 'TEXT', parentRef: 'i', slotRef: 'nope', source: android.text() },
  ], { definitions: [actionRow()] }), /must name a slot/u);
  throwsLike(() => make([{ nodeRef: 'kid', kind: 'TEXT', slotRef: 'x', source: android.text() }]), /requires an instance parent/u);
  throwsLike(() => make([
    { nodeRef: 'g', kind: 'GROUP' },
    { nodeRef: 'kid', kind: 'TEXT', parentRef: 'g', slotRef: 'x', source: android.text() },
  ]), /only valid inside an instance/u);
});

test('nested reuse is preserved: outer placements may rebind nested ports and texts', () => {
  const wrapper = {
    definitionRef: 'component.wrapper',
    label: 'Wrapper',
    version: 3,
    rootNodeRef: 'w',
    nodes: [
      { nodeRef: 'w', kind: 'CARD', source: android.card() },
      { nodeRef: 'inner', kind: 'INSTANCE', parentRef: 'w', instance: { definitionRef: 'component.action-row', definitionVersion: 1, portBindings: [{ portRef: 'b/s1', key: 'inner.default' }], textOverrides: [{ templatePath: 'b', value: 'Inner' }] } },
    ],
  };
  const blueprint = make([
    { nodeRef: 'plain', kind: 'INSTANCE', instance: { definitionRef: 'component.wrapper', definitionVersion: 3 } },
    { nodeRef: 'rebound', kind: 'INSTANCE', order: 1, instance: { definitionRef: 'component.wrapper', definitionVersion: 3, portBindings: [{ portRef: 'inner/b/s1', key: 'outer.go' }], textOverrides: [{ templatePath: 'inner/b', value: 'Outer' }] } },
  ], { definitions: [wrapper, actionRow()] });
  const definition = blueprint.definitions.find((row) => row.definitionRef === 'component.wrapper');
  assert.deepEqual(definition.dependsOn, ['component.action-row']);
  assert.deepEqual(definition.ports.map((row) => row.portRef + '=' + row.defaultKey), ['inner/b/s1=inner.default']);
  const actions = Object.fromEntries(blueprint.derived.integration.actions.map((row) => [row.key, row.uses.map((use) => use.path)]));
  assert.deepEqual(actions['inner.default'], ['plain/inner/b']);
  assert.deepEqual(actions['outer.go'], ['rebound/inner/b']);
  const texts = [];
  walkResolved(expandBlueprint(blueprint), (node) => { if (node.text) texts.push(node.path + '=' + node.text.value); });
  assert.ok(texts.includes('plain/inner/b=Inner'));
  assert.ok(texts.includes('rebound/inner/b=Outer'));
});

test('definition graph fails closed on cycles, missing references, extra roots and bad slots', () => {
  const selfRef = { definitionRef: 'component.loop', label: 'Loop', version: 1, rootNodeRef: 'r', nodes: [
    { nodeRef: 'r', kind: 'GROUP' },
    { nodeRef: 'x', kind: 'INSTANCE', parentRef: 'r', instance: { definitionRef: 'component.loop', definitionVersion: 1 } },
  ] };
  throwsLike(() => make([], { definitions: [selfRef] }), /definition cycle/u);
  const dangling = { definitionRef: 'component.d', label: 'D', version: 1, rootNodeRef: 'r', nodes: [
    { nodeRef: 'r', kind: 'GROUP' },
    { nodeRef: 'x', kind: 'INSTANCE', parentRef: 'r', instance: { definitionRef: 'component.gone', definitionVersion: 1 } },
  ] };
  throwsLike(() => make([], { definitions: [dangling] }), /missing component definition/u);
  throwsLike(() => make([], { definitions: [actionRow(), actionRow()] }), /duplicate component definition/u);
  throwsLike(() => make([], { definitions: [{ ...actionRow(), version: 0 }] }), /start at 1/u);
  throwsLike(() => make([], { definitions: [{ ...actionRow(), rootNodeRef: 'b' }] }), /rootNodeRef/u);
  throwsLike(() => make([], { definitions: [{ ...actionRow(), nodes: [...actionRow().nodes, { nodeRef: 'extra', kind: 'GROUP', order: 1 }] }] }), /exactly one root/u);
  throwsLike(() => make([], { definitions: [{ ...actionRow(), slots: [{ slotRef: 's', templateNodeRef: 'b' }] }] }), /container template node/u);
  throwsLike(() => make([], { definitions: [{ ...actionRow(), slots: [{ slotRef: 's', templateNodeRef: 'zz' }] }] }), /missing node/u);
  throwsLike(() => make([], { definitions: [{ ...actionRow(), slots: [{ slotRef: 's', templateNodeRef: 'r' }, { slotRef: 's', templateNodeRef: 'r' }] }] }), /duplicate slotRef/u);
  throwsLike(() => make([], { definitions: [{ ...actionRow(), slots: [{ slotRef: 's', templateNodeRef: 'r' }, { slotRef: 't', templateNodeRef: 'r' }] }] }), /only one slot/u);
  throwsLike(() => make([], { definitions: [{ ...actionRow(), nodes: [{ ...actionRow().nodes[0], layout: { ...actionRow().nodes[0].layout, depth: 2 } }, actionRow().nodes[1]] }] }), /root depth/u);
  throwsLike(() => make([], { definitions: 'nope' }), /definitions must be an array/u);
});

test('reusable overlays are placed on the surface overlay layer', () => {
  const confirm = { definitionRef: 'component.confirm', label: 'Confirm', version: 1, rootNodeRef: 'd', nodes: [
    { nodeRef: 'd', kind: 'DIALOG', source: android.dialog() },
    { nodeRef: 't', kind: 'TEXT', parentRef: 'd', source: android.text() },
  ] };
  const blueprint = make([{ nodeRef: 'c', kind: 'INSTANCE', instance: { definitionRef: 'component.confirm', definitionVersion: 1 } }], { definitions: [confirm] });
  assert.equal(blueprint.nodes[0].visibility.presence, 'WHEN_OPEN');
  assert.equal(expandBlueprint(blueprint).overlays.length, 1);
  throwsLike(() => make([
    { nodeRef: 'g', kind: 'GROUP' },
    { nodeRef: 'c', kind: 'INSTANCE', parentRef: 'g', instance: { definitionRef: 'component.confirm', definitionVersion: 1 } },
  ], { definitions: [confirm] }), /overlays attach/u);
});

test('v1 blueprints migrate to v2 with explicit notes instead of silent reinterpretation', () => {
  const v1Node = (nodeRef, source, extra = {}) => ({
    nodeRef,
    parentNodeRefOrNull: null,
    siblingOrder: 0,
    source: { subjectRef: source.subjectRef, buildRef: source.buildRef, repositoryRef: source.repositoryRef, commit: source.commit, componentRef: source.componentRef, occurrenceRef: source.occurrenceRef, screenRefOrNull: source.screenRefOrNull, surfaceRef: source.surfaceRef, elementRef: source.elementRef, kind: source.kind, label: source.label, sourcePathOrNull: source.sourcePathOrNull },
    presentation: { styleOrNull: null, slotOrNull: null, layerOrNull: null, textRoleOrNull: null, iconOrNull: null, interactions: [], localizationSourceStringRefs: source.localizationSourceStringRefs, accessibilityState: 'NOT_PROJECTED' },
    relationships: { semanticRole: source.semanticRole, intentOrNull: source.intentOrNull, actionKeyOrNull: source.actionKeyOrNull, callOrNull: source.callOrNull, pathwayRefOrNull: source.pathwayRefOrNull, navigatesToOrNull: source.navigatesToOrNull, visibleWhenOrNull: source.visibleWhenOrNull, alwaysVisible: false, presenceRefs: [], conditionRefs: [] },
    portable: source.portable,
    authoring: { layout: { containerMode: 'FLOW', flowDirection: 'VERTICAL', width: { mode: 'WRAP' }, height: { mode: 'WRAP' }, constraints: [], gridPlacement: { mode: 'GRID_RATIO', columnStart: 2, rowStart: 3, columnSpan: 12, rowSpan: 3 }, depthOrder: 0 }, callbackPorts: [], componentInstance: null },
    ...extra,
  });
  const card = v1Node('ui.node.1', android.card(), {});
  card.authoring.layout.containerMode = 'CONSTRAINT';
  const btn = v1Node('ui.node.2', android.localButton(), { parentNodeRefOrNull: 'ui.node.1' });
  btn.authoring.layout.constraints = [{ edge: 'START', targetNodeRefOrParent: 'PARENT', targetEdge: 'START', offset: 16 }];
  btn.authoring.callbackPorts = [{ portRef: 'callback.save-profile', eventRef: 'ACTIVATE', bindingState: 'OPEN' }];
  const dialog = v1Node('ui.node.3', android.dialog(), { parentNodeRefOrNull: 'ui.node.1', siblingOrder: 1 });
  const leafKid = v1Node('ui.node.4', android.text(), { parentNodeRefOrNull: 'ui.node.2' });
  const row = v1Node('ui.node.9', android.row(), { siblingOrder: 2 });
  row.authoring.layout.flowDirection = 'HORIZONTAL';
  row.authoring.layout.width = { mode: 'FIXED', valueOrNull: 200 };
  const stack = v1Node('ui.node.10', android.card(), { siblingOrder: 3 });
  stack.authoring.layout.flowDirection = 'OVERLAY';
  const stackKid = v1Node('ui.node.11', android.text(), { parentNodeRefOrNull: 'ui.node.10' });
  stackKid.authoring.layout.width = { mode: 'FILL' };
  const definitionTemplate = [v1Node('t.root', android.card()), v1Node('t.btn', android.localButton(), { parentNodeRefOrNull: 't.root' })];
  const instance = (nodeRef, templateNodeRef, parent, instanceRef) => {
    const source = templateNodeRef === 't.root' ? android.card() : android.localButton();
    const node = v1Node(nodeRef, source, { parentNodeRefOrNull: parent, siblingOrder: templateNodeRef === 't.root' ? 4 : 0 });
    node.authoring.componentInstance = { definitionRef: 'component.local.card.1', instanceRef, templateNodeRef };
    return node;
  };
  const intact = [instance('ui.node.5', 't.root', null, 'instance.local.1'), instance('ui.node.6', 't.btn', 'ui.node.5', 'instance.local.1')];
  const drifted = [instance('ui.node.7', 't.root', null, 'instance.local.2')];
  drifted[0].siblingOrder = 5;
  const intruder = v1Node('ui.node.12', android.text(), { parentNodeRefOrNull: 'ui.node.6' });
  const v1 = {
    schemaVersion: 'vexboard.ui-blueprint/v1',
    blueprintRef: 'ui.blueprint.legacy',
    label: 'Legacy',
    preview: { profile: 'WINDOWS' },
    nodes: [card, btn, dialog, leafKid, row, stack, stackKid, ...intact, ...drifted, intruder],
    componentDefinitions: [{ definitionRef: 'component.local.card.1', label: 'Card reusable', nodes: definitionTemplate }],
  };
  const { blueprint, migratedFrom, notes } = readUiBlueprint(v1);
  assert.equal(migratedFrom, 'vexboard.ui-blueprint/v1');
  assert.equal(blueprint.schemaVersion, UI_BLUEPRINT_SCHEMA);
  assert.equal(blueprint.surface.container.mode, 'FREEFORM');
  assert.equal(blueprint.preview.profile, 'EXPANDED');
  const byRef = Object.fromEntries(blueprint.nodes.map((row) => [row.nodeRef, row]));
  assert.equal(byRef['ui.node.1'].layout.container.mode, 'FREEFORM');
  assert.equal(byRef['ui.node.1'].layout.height.mode, 'FIXED');
  assert.deepEqual(byRef['ui.node.2'].layout.placement, { type: 'FRACTION', x: { start: 2, end: 14 }, y: { start: 3, end: 6 } });
  assert.equal(byRef['ui.node.2'].behavior.seams[0].key, 'save-profile');
  assert.equal(byRef['ui.node.3'].parentRef, null, 'nested dialog moved to the overlay layer');
  assert.equal(byRef['ui.node.4'].parentRef, null, 'leaf child of a leaf moved to the surface');
  assert.equal(byRef['ui.node.9'].layout.container.axis, 'HORIZONTAL');
  assert.deepEqual(byRef['ui.node.9'].layout.width, { mode: 'FIXED', valueOrNull: 200 });
  assert.equal(byRef['ui.node.10'].layout.container.mode, 'OVERLAY');
  assert.equal(byRef['ui.node.11'].layout.placement.type, 'ANCHOR');
  assert.equal(byRef['ui.node.5'].kind, 'INSTANCE');
  assert.equal(byRef['ui.node.6'], undefined, 'intact instance internals collapse into the instance');
  assert.equal(byRef['ui.node.7'].kind, 'CARD', 'drifted instance detached');
  assert.equal(byRef['ui.node.12'].parentRef, null, 'node added inside an instance moves out');
  assert.ok(notes.some((note) => /pixel edge constraints dropped/u.test(note)));
  assert.ok(notes.some((note) => /overlay layer/u.test(note)));
  assert.ok(notes.some((note) => /detached/u.test(note)));
  assert.ok(notes.some((note) => /cannot be edited structurally/u.test(note)));
  assert.equal(blueprint.definitions[0].version, 1);
  throwsLike(() => migrateUiBlueprintV1({ schemaVersion: 'x' }), /migration expects/u);
  throwsLike(() => migrateUiBlueprintV1({ ...v1, componentDefinitions: [{ definitionRef: 'component.bad', label: 'Bad', nodes: [] }] }), /exactly one root/u);
  const minimal = migrateUiBlueprintV1({ schemaVersion: 'vexboard.ui-blueprint/v1', blueprintRef: 'ui.blueprint.min', label: 'Min', preview: { profile: 'CONTAINER' }, nodes: [] });
  assert.equal(minimal.blueprint.preview.profile, 'MEDIUM');
});

// [VXG RealForever][VEXWORK][COMPONENT-LIBRARY][A5-UI-BLUEPRINT-V2-TEST]
