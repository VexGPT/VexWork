import assert from 'node:assert/strict';
import test from 'node:test';

import {
  applyCommand,
  blueprintFromDraft,
  containerModeOf,
  createEditorState,
  emptyDraft,
  enterDefinition,
  exitDefinition,
  nodeKind,
  redo,
  replaceDesign,
  scopeNodes,
  select,
  setPreview,
  siblingsOf,
  UI_COMMAND_TYPES,
  UI_HISTORY_LIMIT,
  undo,
} from '../src/shared/vexboard-ui-document.mjs';
import { createUiBlueprint } from '../src/shared/vexboard-ui-blueprint.mjs';
import { UI_LAYOUT_GROUPS } from '../src/shared/vexboard-ui-kinds.mjs';
import { android, prod } from './fixtures/ui-builder-fixtures.mjs';

function editor() {
  let state = createEditorState();
  const run = (command, { expectOk = true } = {}) => {
    const result = applyCommand(state, command);
    assert.equal(result.ok, expectOk, command.type + ': ' + result.message);
    state = result.state;
    return result;
  };
  return { run, get state() { return state; }, set state(value) { state = value; } };
}

const node = (state, nodeRef, scope = state.scope) => scopeNodes(state.draft, scope).find((row) => row.nodeRef === nodeRef);

test('an empty editor is a valid, scrolling vertical design surface', () => {
  const state = createEditorState();
  assert.equal(state.blueprint.surface.container.mode, 'STACK');
  assert.equal(state.blueprint.nodes.length, 0);
  assert.equal(state.selection, null);
  assert.deepEqual(emptyDraft({ label: 'X' }).label, 'X');
  assert.ok(UI_COMMAND_TYPES.includes('INSERT'));
});

test('insert places source components, layout groups and source subtrees under real containment rules', () => {
  const e = editor();
  e.run({ type: 'INSERT', items: [{ source: android.card() }] });
  const card = e.state.selection;
  e.run({ type: 'INSERT', items: [{ source: android.localButton() }], parentRef: card });
  const button = e.state.selection;
  const refused = e.run({ type: 'INSERT', items: [{ source: android.text() }], parentRef: button }, { expectOk: false });
  assert.match(refused.message, /cannot be placed inside/u);
  e.run({ type: 'INSERT', items: [{ group: UI_LAYOUT_GROUPS[1] }], parentRef: card, index: 0 });
  assert.deepEqual(siblingsOf(e.state.draft, null, card).map((row) => row.kind), ['GROUP', 'BUTTON']);
  e.run({ type: 'INSERT', items: [{ source: android.column() }, { source: android.text(), parentIndex: 0 }, { source: android.localButton(), parentIndex: 0 }] });
  const column = e.state.selection;
  assert.equal(siblingsOf(e.state.draft, null, column).length, 2);
  assert.equal(applyCommand(e.state, { type: 'INSERT', items: [] }).ok, false);
  assert.equal(applyCommand(e.state, { type: 'INSERT', items: [{}] }).ok, false);
  assert.equal(applyCommand(e.state, { type: 'NOPE' }).ok, false);
});

test('overlays always attach to the surface overlay layer, even when dropped into a container', () => {
  const e = editor();
  e.run({ type: 'INSERT', items: [{ source: android.card() }] });
  const card = e.state.selection;
  e.run({ type: 'INSERT', items: [{ source: android.dialog() }], parentRef: card });
  const dialog = node(e.state, e.state.selection);
  assert.equal(dialog.parentRef, null);
  assert.equal(e.state.blueprint.derived.summary.overlayCount, 1);
  e.run({ type: 'INSERT', items: [{ source: android.sheet() }] });
  assert.deepEqual(siblingsOf(e.state.draft, null, null, null, { overlays: true }).map((row) => row.layout.depth), [0, 1]);
  e.run({ type: 'MOVE', nodeRef: dialog.nodeRef, parentRef: card });
  assert.equal(node(e.state, dialog.nodeRef).parentRef, null);
});

test('switching container mode converts children instead of keeping contradictory layout data', () => {
  const e = editor();
  e.run({ type: 'INSERT', items: [{ source: android.card() }] });
  const card = e.state.selection;
  e.run({ type: 'INSERT', items: [{ source: android.localButton() }], parentRef: card });
  e.run({ type: 'INSERT', items: [{ source: android.text() }], parentRef: card });
  e.run({ type: 'UPDATE_LAYOUT', nodeRef: card, patch: { container: { mode: 'FREEFORM' } } });
  assert.equal(node(e.state, card).layout.height.mode, 'FIXED');
  const kids = siblingsOf(e.state.draft, null, card);
  assert.ok(kids.every((row) => row.layout.placement?.type === 'FRACTION'));
  assert.deepEqual(kids.map((row) => row.layout.depth), [0, 1]);
  assert.ok(kids[1].layout.placement.y.start > kids[0].layout.placement.y.start, 'stacked default rows do not overlap');
  e.run({ type: 'UPDATE_LAYOUT', nodeRef: card, patch: { container: { mode: 'OVERLAY' } } });
  assert.ok(siblingsOf(e.state.draft, null, card).every((row) => row.layout.placement.type === 'ANCHOR'));
  e.run({ type: 'UPDATE_LAYOUT', nodeRef: card, patch: { container: { mode: 'STACK', axis: 'HORIZONTAL' } } });
  assert.ok(siblingsOf(e.state.draft, null, card).every((row) => row.layout.placement === null && row.layout.depth === 0));
  e.run({ type: 'UPDATE_LAYOUT', nodeRef: card, patch: { width: { mode: 'FIXED', valueOrNull: 280 }, height: { mode: 'HUG' } } });
  assert.deepEqual(node(e.state, card).layout.width, { mode: 'FIXED', valueOrNull: 280 });
  assert.equal(containerModeOf(e.state.draft, null, card), 'STACK');
  e.run({ type: 'SET_SURFACE', container: { mode: 'FREEFORM' } });
  assert.equal(node(e.state, card).layout.placement.type, 'FRACTION');
  e.run({ type: 'SET_SURFACE', container: { mode: 'STACK', axis: 'VERTICAL' } });
  assert.equal(node(e.state, card).layout.placement, null);
});

test('move reorders within a parent, reparents across parents and refuses moving into itself', () => {
  const e = editor();
  e.run({ type: 'INSERT', items: [{ source: android.column() }] });
  const column = e.state.selection;
  e.run({ type: 'INSERT', items: [{ source: android.text() }], parentRef: column });
  const text = e.state.selection;
  e.run({ type: 'INSERT', items: [{ source: android.localButton() }], parentRef: column });
  const button = e.state.selection;
  e.run({ type: 'MOVE', nodeRef: button, parentRef: column, index: 0 });
  assert.deepEqual(siblingsOf(e.state.draft, null, column).map((row) => row.nodeRef), [button, text]);
  e.run({ type: 'MOVE', nodeRef: text, parentRef: null, index: 0 });
  assert.equal(node(e.state, text).parentRef, null);
  assert.deepEqual(siblingsOf(e.state.draft, null, column).map((row) => row.order), [0]);
  const refused = e.run({ type: 'MOVE', nodeRef: column, parentRef: column }, { expectOk: false });
  assert.match(refused.message, /inside itself/u);
  e.run({ type: 'SET_SURFACE', container: { mode: 'FREEFORM' } });
  e.run({ type: 'MOVE', nodeRef: text, parentRef: null, placement: { type: 'FRACTION', x: { start: 4, end: 10 }, y: { start: 8, end: null } } });
  assert.deepEqual(node(e.state, text).layout.placement.x, { start: 4, end: 10 });
  e.run({ type: 'PLACE', nodeRef: text, placement: { type: 'FRACTION', x: { start: 5, end: 11 }, y: { start: 8, end: 12 } } });
  assert.deepEqual(node(e.state, text).layout.placement.y, { start: 8, end: 12 });
  const invalid = e.run({ type: 'PLACE', nodeRef: text, placement: { type: 'FRACTION', x: { start: 30, end: 31 }, y: { start: 0 } } }, { expectOk: false });
  assert.match(invalid.message, /^Not allowed: /u);
  assert.equal(applyCommand(e.state, { type: 'MOVE', nodeRef: 'n999' }).ok, false);
});

test('text edits are authored copy; resetting returns to the observed source text', () => {
  const e = editor();
  e.run({ type: 'INSERT', items: [{ source: android.localButton() }] });
  const button = e.state.selection;
  e.run({ type: 'SET_TEXT', nodeRef: button, value: 'Save profile' });
  assert.equal(e.state.blueprint.nodes[0].content.text.origin, 'AUTHORED');
  e.run({ type: 'SET_TEXT', nodeRef: button, value: '' });
  assert.equal(e.state.blueprint.nodes[0].content.text.origin, 'SOURCE');
  e.run({ type: 'SET_TEXT', nodeRef: button, value: android.localButton().label });
  assert.equal(e.state.blueprint.nodes[0].content.text.origin, 'SOURCE');
  e.run({ type: 'INSERT', items: [{ group: UI_LAYOUT_GROUPS[0] }] });
  assert.equal(applyCommand(e.state, { type: 'SET_TEXT', nodeRef: e.state.selection, value: 'x' }).ok, false);
});

test('behavior seams: authored actions, overlay links that Builder owns, and safe removal', () => {
  const e = editor();
  e.run({ type: 'INSERT', items: [{ source: prod.plainButton() }] });
  const button = e.state.selection;
  assert.equal(node(e.state, button).behavior.seams.length, 0, 'nothing invented');
  assert.equal(applyCommand(e.state, { type: 'ADD_SEAM', nodeRef: button, seam: { kind: 'ACTION', key: '!!' } }).ok, false);
  e.run({ type: 'ADD_SEAM', nodeRef: button, seam: { kind: 'ACTION', key: 'Profile Save' } });
  assert.equal(e.state.blueprint.derived.integration.actions[0].key, 'profile-save');
  e.run({ type: 'INSERT', items: [{ source: android.dialog() }] });
  const dialog = e.state.selection;
  e.run({ type: 'ADD_SEAM', nodeRef: button, seam: { kind: 'PRESENTATION', key: 'open.confirm', verbOrNull: 'OPEN', targetNodeRefOrNull: dialog } });
  assert.equal(e.state.blueprint.derived.integration.presentation[0].binding, 'BUILDER_LOCAL');
  const [action, link] = node(e.state, button).behavior.seams;
  e.run({ type: 'SET_SEAM', nodeRef: button, seamRef: action.seamRef, patch: { key: 'profile.save', trigger: 'ACTIVATE' } });
  assert.equal(applyCommand(e.state, { type: 'SET_SEAM', nodeRef: button, seamRef: action.seamRef, patch: { key: '' } }).ok, false);
  assert.equal(applyCommand(e.state, { type: 'SET_SEAM', nodeRef: button, seamRef: 'zz', patch: {} }).ok, false);
  e.run({ type: 'SET_SEAM', nodeRef: button, seamRef: link.seamRef, patch: { verbOrNull: 'TOGGLE' } });
  e.run({ type: 'DELETE', nodeRef: dialog });
  const after = node(e.state, button).behavior.seams.find((row) => row.seamRef === link.seamRef);
  assert.equal(after.targetNodeRefOrNull, null, 'link to a deleted overlay becomes OPEN instead of dangling');
  e.run({ type: 'REMOVE_SEAM', nodeRef: button, seamRef: link.seamRef });
  assert.equal(node(e.state, button).behavior.seams.length, 1);
  e.run({ type: 'INSERT', items: [{ source: android.navButton() }] });
  const nav = node(e.state, e.state.selection);
  e.run({ type: 'SET_SEAM', nodeRef: nav.nodeRef, seamRef: nav.behavior.seams[0].seamRef, patch: { destinationOrNull: '' } });
  assert.equal(node(e.state, nav.nodeRef).behavior.seams[0].destinationOrNull, null);
});

test('visibility, accessibility and depth commands keep their relationships explicit', () => {
  const e = editor();
  e.run({ type: 'INSERT', items: [{ source: android.text() }] });
  const text = e.state.selection;
  e.run({ type: 'SET_VISIBILITY', nodeRef: text, presence: 'CONDITIONAL', conditionKeyOrNull: 'Profile Loaded' });
  assert.equal(e.state.blueprint.derived.integration.conditions[0].key, 'profile-loaded');
  e.run({ type: 'SET_VISIBILITY', nodeRef: text, presence: 'ALWAYS' });
  assert.equal(applyCommand(e.state, { type: 'SET_VISIBILITY', nodeRef: text, presence: 'WHEN_OPEN' }).ok, false);
  e.run({ type: 'INSERT', items: [{ source: android.image() }] });
  const image = e.state.selection;
  e.run({ type: 'SET_ACCESSIBILITY', nodeRef: image, patch: { labelOrNull: 'Profile photo' } });
  e.run({ type: 'SET_ACCESSIBILITY', nodeRef: image, patch: { labelOrNull: '   ', decorative: true } });
  assert.deepEqual(node(e.state, image).accessibility, { labelOrNull: null, decorative: true });
  e.run({ type: 'INSERT', items: [{ group: UI_LAYOUT_GROUPS[3] }] });
  const area = e.state.selection;
  e.run({ type: 'INSERT', items: [{ source: android.text() }], parentRef: area });
  const a = e.state.selection;
  e.run({ type: 'INSERT', items: [{ source: android.localButton() }], parentRef: area });
  const b = e.state.selection;
  e.run({ type: 'INSERT', items: [{ source: android.text() }], parentRef: area });
  const c = e.state.selection;
  const depths = () => [a, b, c].map((ref) => node(e.state, ref).layout.depth);
  assert.deepEqual(depths(), [0, 1, 2]);
  e.run({ type: 'DEPTH', nodeRef: a, action: 'FRONT' });
  assert.deepEqual(depths(), [2, 0, 1]);
  e.run({ type: 'DEPTH', nodeRef: a, action: 'BACKWARD' });
  assert.deepEqual(depths(), [1, 0, 2]);
  e.run({ type: 'DEPTH', nodeRef: c, action: 'BACK' });
  assert.deepEqual(depths(), [2, 1, 0]);
  e.run({ type: 'DEPTH', nodeRef: c, action: 'FORWARD' });
  assert.deepEqual(depths(), [2, 0, 1]);
  assert.equal(applyCommand(e.state, { type: 'DEPTH', nodeRef: c, action: 'SIDEWAYS' }).ok, false);
  e.run({ type: 'DELETE', nodeRef: b });
  assert.deepEqual([a, c].map((ref) => node(e.state, ref).layout.depth), [1, 0], 'depth stays contiguous after delete');
});

test('duplicate copies a subtree with fresh identities and remaps internal overlay links', () => {
  const e = editor();
  e.run({ type: 'SET_SURFACE', container: { mode: 'FREEFORM' } });
  e.run({ type: 'INSERT', items: [{ source: android.card() }, { source: android.localButton(), parentIndex: 0 }] });
  const card = e.state.selection;
  e.run({ type: 'DUPLICATE', nodeRef: card });
  const copy = e.state.selection;
  assert.notEqual(copy, card);
  assert.equal(siblingsOf(e.state.draft, null, copy).length, 1);
  assert.equal(node(e.state, copy).layout.placement.x.start, node(e.state, card).layout.placement.x.start + 1);
});

test('create component replaces a subtree with an instance; instances diverge only through overrides', () => {
  const e = editor();
  e.run({ type: 'INSERT', items: [{ source: android.card() }] });
  const card = e.state.selection;
  e.run({ type: 'INSERT', items: [{ source: android.localButton() }], parentRef: card });
  const button = e.state.selection;
  e.run({ type: 'INSERT', items: [{ source: android.dialog() }] });
  const dialog = e.state.selection;
  e.run({ type: 'ADD_SEAM', nodeRef: button, seam: { kind: 'PRESENTATION', key: 'open.x', verbOrNull: 'OPEN', targetNodeRefOrNull: dialog } });
  const refused = e.run({ type: 'CREATE_DEFINITION', nodeRef: card, label: 'Profile card' }, { expectOk: false });
  assert.match(refused.message, /opens an overlay outside/u);
  e.run({ type: 'REMOVE_SEAM', nodeRef: button, seamRef: node(e.state, button).behavior.seams.at(-1).seamRef });
  e.run({ type: 'CREATE_DEFINITION', nodeRef: card, label: 'Profile card' });
  const first = e.state.selection;
  assert.equal(node(e.state, first).kind, 'INSTANCE');
  assert.equal(e.state.draft.definitions[0].definitionRef, 'component.profile-card');
  e.run({ type: 'DUPLICATE', nodeRef: first });
  const second = e.state.selection;
  const portRef = e.state.blueprint.definitions[0].ports[0].portRef;
  e.run({ type: 'SET_BINDING', nodeRef: second, portRef, key: 'profile.discard' });
  e.run({ type: 'SET_OVERRIDE', nodeRef: second, templatePath: button, value: 'Discard' });
  const keys = e.state.blueprint.derived.integration.actions.map((row) => row.key);
  assert.ok(keys.includes('profile.discard'));
  assert.equal(keys.length, 2);
  assert.equal(applyCommand(e.state, { type: 'SET_BINDING', nodeRef: second, portRef, key: '!!' }).ok, false);
  assert.equal(applyCommand(e.state, { type: 'SET_BINDING', nodeRef: card + 'x', portRef, key: 'a' }).ok, false);
  assert.equal(applyCommand(e.state, { type: 'SET_OVERRIDE', nodeRef: dialog, templatePath: button, value: 'x' }).ok, false);
  assert.equal(applyCommand(e.state, { type: 'SET_BINDING', nodeRef: dialog, portRef, key: 'a' }).ok, false);
  assert.equal(applyCommand(e.state, { type: 'ADD_SEAM', nodeRef: second, seam: { kind: 'ACTION', key: 'x' } }).ok, false);
  e.run({ type: 'SET_BINDING', nodeRef: second, portRef, key: null });
  e.run({ type: 'SET_OVERRIDE', nodeRef: second, templatePath: button, value: '' });
  assert.deepEqual(node(e.state, second).instance.textOverrides, []);
  e.run({ type: 'CREATE_DEFINITION', nodeRef: second, label: 'Profile card' });
  assert.equal(e.state.draft.definitions.at(-1).definitionRef, 'component.profile-card-2', 'names never collide; nested reuse kept');
  assert.equal(e.state.draft.definitions.at(-1).nodes[0].kind, 'INSTANCE');
  e.run({ type: 'CREATE_DEFINITION', nodeRef: dialog, label: '' });
  assert.equal(node(e.state, e.state.selection).visibility.presence, 'WHEN_OPEN');
});

test('editing a component propagates to every instance with a version bump and prunes stale overrides', () => {
  const e = editor();
  e.run({ type: 'INSERT', items: [{ source: android.card() }, { source: android.localButton(), parentIndex: 0 }, { source: android.text(), parentIndex: 0 }] });
  const card = e.state.selection;
  const [button, text] = siblingsOf(e.state.draft, null, card).map((row) => row.nodeRef);
  e.run({ type: 'CREATE_DEFINITION', nodeRef: card, label: 'Tile' });
  const instance = e.state.selection;
  e.run({ type: 'SET_OVERRIDE', nodeRef: instance, templatePath: button, value: 'Go' });
  assert.equal(enterDefinition(e.state, 'component.nope').ok, false);
  e.state = enterDefinition(e.state, 'component.tile').state;
  assert.equal(e.state.scope, 'component.tile');
  assert.equal(e.state.selection, card);
  assert.equal(applyCommand(e.state, { type: 'DELETE', nodeRef: card }).ok, false, 'component keeps its root');
  assert.equal(applyCommand(e.state, { type: 'MOVE', nodeRef: button, parentRef: null }).ok, false);
  assert.equal(applyCommand(e.state, { type: 'DUPLICATE', nodeRef: card }).ok, false);
  assert.equal(applyCommand(e.state, { type: 'SET_SURFACE', container: { mode: 'FREEFORM' } }).ok, false);
  const pruned = applyCommand(e.state, { type: 'DELETE', nodeRef: button });
  assert.ok(pruned.ok);
  assert.match(pruned.message, /Cleared overrides/u);
  e.state = pruned.state;
  e.run({ type: 'INSERT', items: [{ source: android.localButton() }] });
  assert.equal(node(e.state, e.state.selection).parentRef, card, 'inserts land inside the component root');
  e.run({ type: 'SET_SLOT', templateNodeRef: card, slotRef: 'Body', label: 'Body' });
  const exit = exitDefinition(e.state);
  e.state = exit.state;
  assert.match(exit.message, /Tile updated to v2/u);
  assert.equal(e.state.scope, null);
  assert.equal(node(e.state, instance).instance.definitionVersion, 2);
  e.run({ type: 'INSERT', items: [{ source: android.text() }], parentRef: instance, slotRef: 'body' });
  assert.equal(e.state.blueprint.definitions[0].slots[0].slotRef, 'body');
  e.state = enterDefinition(e.state, 'component.tile').state;
  e.run({ type: 'SET_SLOT', templateNodeRef: card, slotRef: null });
  e.state = exitDefinition(e.state).state;
  assert.equal(siblingsOf(e.state.draft, null, instance).length, 0, 'slot children fall out when the slot is removed');
  assert.ok(scopeNodes(e.state.draft, null).some((row) => row.nodeRef !== instance && row.kind === 'TEXT'));
  assert.equal(applyCommand(e.state, { type: 'SET_SLOT', templateNodeRef: card, slotRef: 'x' }).ok, false);
  const unchanged = exitDefinition(enterDefinition(e.state, 'component.tile').state);
  assert.equal(unchanged.state.draft.definitions[0].version, 3, 'no edits, no version bump');
  assert.equal(exitDefinition(e.state).ok, true);
  assert.ok(text);
});

test('slot names stay unique within a component', () => {
  const e = editor();
  e.run({ type: 'INSERT', items: [{ source: android.card() }, { source: android.column(), parentIndex: 0 }] });
  const card = e.state.selection;
  const column = siblingsOf(e.state.draft, null, card)[0].nodeRef;
  e.run({ type: 'CREATE_DEFINITION', nodeRef: card, label: 'Shell' });
  e.state = enterDefinition(e.state, 'component.shell').state;
  e.run({ type: 'SET_SLOT', templateNodeRef: card, slotRef: 'content' });
  assert.equal(applyCommand(e.state, { type: 'SET_SLOT', templateNodeRef: column, slotRef: 'content' }).ok, false);
  e.run({ type: 'RENAME_DEFINITION', definitionRef: 'component.shell', label: 'App shell' });
  assert.equal(applyCommand(e.state, { type: 'RENAME_DEFINITION', definitionRef: 'component.shell', label: ' ' }).ok, false);
  assert.equal(applyCommand(e.state, { type: 'RENAME_DEFINITION', definitionRef: 'component.zz', label: 'x' }).ok, false);
  const again = enterDefinition(e.state, 'component.shell');
  assert.equal(again.state.scope, 'component.shell');
});

test('detach turns an instance back into editable nodes, carrying overrides, bindings and slot children', () => {
  const e = editor();
  e.run({ type: 'INSERT', items: [{ source: android.card() }, { source: android.localButton(), parentIndex: 0 }] });
  const card = e.state.selection;
  const button = siblingsOf(e.state.draft, null, card)[0].nodeRef;
  e.run({ type: 'CREATE_DEFINITION', nodeRef: card, label: 'Tile' });
  e.state = enterDefinition(e.state, 'component.tile').state;
  e.run({ type: 'SET_SLOT', templateNodeRef: card, slotRef: 'extra' });
  e.state = exitDefinition(e.state).state;
  const tile = e.state.selection ?? e.state.draft.nodes.find((row) => row.kind === 'INSTANCE').nodeRef;
  const instanceRef = e.state.draft.nodes.find((row) => row.kind === 'INSTANCE').nodeRef;
  e.run({ type: 'INSERT', items: [{ source: android.text() }], parentRef: instanceRef, slotRef: 'extra' });
  e.run({ type: 'CREATE_DEFINITION', nodeRef: instanceRef, label: 'Outer' });
  const outer = e.state.selection;
  const portRef = e.state.blueprint.definitions.find((row) => row.definitionRef === 'component.outer').ports[0].portRef;
  e.run({ type: 'SET_BINDING', nodeRef: outer, portRef, key: 'outer.save' });
  const textPath = e.state.blueprint.definitions.find((row) => row.definitionRef === 'component.outer').texts.find((row) => row.templatePath.endsWith('/' + button)).templatePath;
  e.run({ type: 'SET_OVERRIDE', nodeRef: outer, templatePath: textPath, value: 'Outer text' });
  e.run({ type: 'DETACH', nodeRef: outer });
  const nested = e.state.draft.nodes.find((row) => row.kind === 'INSTANCE');
  assert.equal(nested.instance.definitionRef, 'component.tile');
  assert.deepEqual(nested.instance.portBindings.map((row) => row.key), ['outer.save']);
  assert.deepEqual(nested.instance.textOverrides.map((row) => row.value), ['Outer text']);
  e.run({ type: 'DETACH', nodeRef: nested.nodeRef });
  const detachedButton = e.state.draft.nodes.find((row) => row.kind === 'BUTTON');
  assert.equal(detachedButton.content.text.value, 'Outer text');
  assert.equal(detachedButton.behavior.seams[0].key, 'outer.save');
  assert.ok(e.state.draft.nodes.some((row) => row.kind === 'TEXT' && row.parentRef === detachedButton.parentRef), 'slot child moved into the host');
  assert.equal(applyCommand(e.state, { type: 'DETACH', nodeRef: detachedButton.nodeRef }).ok, false);
  assert.ok(tile);
  const stillUsed = applyCommand(createEditorState(e.state.blueprint), { type: 'DELETE_DEFINITION', definitionRef: 'component.tile' });
  assert.equal(stillUsed.ok, false, 'Outer still uses Tile in its template');
  e.run({ type: 'DELETE_DEFINITION', definitionRef: 'component.outer' });
  e.run({ type: 'DELETE_DEFINITION', definitionRef: 'component.tile' });
  assert.equal(e.state.draft.definitions.length, 0);
});

test('definitions in use cannot be deleted; unused ones can', () => {
  const e = editor();
  e.run({ type: 'INSERT', items: [{ source: android.card() }] });
  e.run({ type: 'CREATE_DEFINITION', nodeRef: e.state.selection, label: 'Tile' });
  const refused = e.run({ type: 'DELETE_DEFINITION', definitionRef: 'component.tile' }, { expectOk: false });
  assert.match(refused.message, /still placed/u);
  e.run({ type: 'DELETE', nodeRef: e.state.selection });
  e.run({ type: 'DELETE_DEFINITION', definitionRef: 'component.tile' });
  assert.equal(e.state.draft.definitions.length, 0);
});

test('undo / redo restore authored history; preview changes stay outside history', () => {
  const e = editor();
  e.run({ type: 'RENAME', label: 'Profile screen' });
  assert.equal(e.state.draft.blueprintRef, 'ui.blueprint.profile-screen');
  assert.equal(applyCommand(e.state, { type: 'RENAME', label: '' }).ok, false);
  e.run({ type: 'INSERT', items: [{ source: android.text() }] });
  const text = e.state.selection;
  e.run({ type: 'DELETE', nodeRef: text });
  assert.equal(e.state.draft.nodes.length, 0);
  e.state = undo(e.state);
  assert.equal(e.state.draft.nodes.length, 1);
  assert.equal(e.state.selection, null, 'selection only survives when the node exists');
  e.state = select(e.state, text);
  assert.equal(e.state.selection, text);
  e.state = select(e.state, 'nope');
  assert.equal(e.state.selection, null);
  e.state = redo(e.state);
  assert.equal(e.state.draft.nodes.length, 0);
  assert.equal(redo(e.state), e.state);
  const previewed = setPreview(e.state, { profile: 'EXPANDED', direction: 'RTL' });
  assert.equal(previewed.blueprint.preview.profile, 'EXPANDED');
  assert.equal(previewed.past.length, e.state.past.length);
  let fresh = createEditorState();
  assert.equal(undo(fresh), fresh);
  for (let index = 0; index < UI_HISTORY_LIMIT + 5; index += 1) fresh = applyCommand(fresh, { type: 'RENAME', label: 'Name ' + index }).state;
  assert.equal(fresh.past.length, UI_HISTORY_LIMIT);
});

test('undo across component editing never strands the editor in a deleted scope', () => {
  const e = editor();
  e.run({ type: 'INSERT', items: [{ source: android.card() }] });
  e.run({ type: 'CREATE_DEFINITION', nodeRef: e.state.selection, label: 'Tile' });
  e.state = enterDefinition(e.state, 'component.tile').state;
  e.state = undo(e.state);
  assert.equal(e.state.scope, null);
  e.state = redo(e.state);
  assert.equal(e.state.draft.definitions.length, 1);
});

test('rebinding source evidence is explicit and preserves authored meaning', () => {
  const e = editor();
  e.run({ type: 'INSERT', items: [{ source: android.darkMode() }] });
  const toggle = e.state.selection;
  const seam = node(e.state, toggle).behavior.seams[0];
  e.run({ type: 'SET_SEAM', nodeRef: toggle, seamRef: seam.seamRef, patch: { key: 'theme.toggle' } });
  e.run({ type: 'SET_TEXT', nodeRef: toggle, value: 'Night mode' });
  const moved = { ...android.darkMode(), commit: 'f'.repeat(40) };
  e.run({ type: 'REBIND_SOURCE', nodeRef: toggle, source: moved });
  const after = node(e.state, toggle);
  assert.equal(after.source.commit, 'f'.repeat(40));
  assert.equal(after.behavior.seams[0].key, 'theme.toggle');
  assert.equal(after.content.text.value, 'Night mode');
  assert.equal(applyCommand(e.state, { type: 'REBIND_SOURCE', nodeRef: toggle, source: android.text() }).ok, false);
  assert.equal(applyCommand(e.state, { type: 'REBIND_SOURCE', nodeRef: toggle, source: { ...moved, kind: 'BUTTON' } }).ok, false);
  e.run({ type: 'SET_TEXT', nodeRef: toggle, value: '' });
  e.run({ type: 'REBIND_SOURCE', nodeRef: toggle, source: android.darkMode() });
  assert.equal(node(e.state, toggle).content.text.origin, 'SOURCE');
  e.run({ type: 'INSERT', items: [{ group: UI_LAYOUT_GROUPS[0] }] });
  assert.equal(applyCommand(e.state, { type: 'REBIND_SOURCE', nodeRef: e.state.selection, source: moved }).ok, false);
});

test('opening a design replaces the document but keeps it undoable; nodeKind resolves instances', () => {
  const e = editor();
  e.run({ type: 'INSERT', items: [{ source: android.card() }] });
  e.run({ type: 'CREATE_DEFINITION', nodeRef: e.state.selection, label: 'Tile' });
  assert.equal(nodeKind(e.state.draft, node(e.state, e.state.selection)), 'CARD');
  const other = createUiBlueprint({ blueprintRef: 'ui.blueprint.other', label: 'Other', nodes: [] });
  const replaced = replaceDesign(e.state, other);
  assert.equal(replaced.draft.label, 'Other');
  assert.equal(undo(replaced).draft.nodes.length, 1);
  assert.deepEqual(blueprintFromDraft(replaced.draft).nodes, []);
  assert.throws(() => scopeNodes(replaced.draft, 'component.gone'), /no longer exists/u);
  assert.equal(containerModeOf(replaced.draft, null, 'missing'), null);
});

// [VXG RealForever][VEXWORK][COMPONENT-LIBRARY][A5-UI-DOCUMENT-TEST]
