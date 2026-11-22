import assert from 'node:assert/strict';
import test from 'node:test';

import {
  canContainKind,
  isKnownKind,
  kindsByCategory,
  kindSpec,
  normalizeSeamKey,
  seamKeySlug,
  seamsFromSourceIntent,
  UI_CATEGORY_LABELS,
  UI_KIND_CATEGORIES,
  UI_KINDS,
  UI_LAYOUT_GROUPS,
} from '../src/shared/vexboard-ui-kinds.mjs';
import { inventories } from './fixtures/ui-builder-fixtures.mjs';

test('every kind observed in current Product inventories has a capability record', () => {
  const observed = new Set(Object.values(inventories).flatMap((inventory) => inventory.occurrences.map((row) => row.kind)));
  for (const kind of observed) {
    assert.ok(isKnownKind(kind), kind + ' should be a known kind');
    assert.ok(UI_KIND_CATEGORIES.includes(kindSpec(kind).category));
  }
  for (const category of UI_KIND_CATEGORIES) assert.ok(UI_CATEGORY_LABELS[category]);
});

test('unknown future kinds degrade to a held leaf instead of borrowing a familiar kind', () => {
  const spec = kindSpec('CAROUSEL');
  assert.equal(spec, UI_KINDS.UNKNOWN);
  assert.equal(spec.held, true);
  assert.equal(spec.container, false);
  assert.equal(isKnownKind('CAROUSEL'), false);
  assert.equal(isKnownKind('UNKNOWN'), false);
  assert.equal(kindSpec(null), UI_KINDS.UNKNOWN);
});

test('containment is a capability, not a guess: leaves hold nothing, overlays never nest, menus are typed', () => {
  assert.equal(canContainKind('BUTTON', 'TEXT'), false);
  assert.equal(canContainKind('CARD', 'BUTTON'), true);
  assert.equal(canContainKind('CARD', 'DIALOG'), false);
  assert.equal(canContainKind('GROUP', 'SHEET'), false);
  assert.equal(canContainKind('MENU', 'MENU_ITEM'), true);
  assert.equal(canContainKind('MENU', 'button'), false);
  assert.equal(canContainKind('UNKNOWN', 'TEXT'), false);
});

test('kind categories group the palette without inventing a taxonomy per Product', () => {
  const groups = kindsByCategory();
  assert.deepEqual(groups.get('ACTION'), ['BUTTON', 'FAB', 'MENU_ITEM']);
  assert.ok(groups.get('OVERLAY').includes('DIALOG'));
  assert.ok(!groups.get('OTHER').includes('UNKNOWN'));
  assert.equal(UI_LAYOUT_GROUPS.length, 4);
  assert.deepEqual(UI_LAYOUT_GROUPS.map((row) => row.container.mode), ['STACK', 'STACK', 'OVERLAY', 'FREEFORM']);
});

test('seam keys are stable lowercase dotted names', () => {
  assert.equal(seamKeySlug('AppActions.ToggleDarkMode'), 'toggle-dark-mode');
  assert.equal(normalizeSeamKey('Profile Save!'), 'profile-save');
  assert.equal(normalizeSeamKey('action.theme.dark-mode.toggle'), 'action.theme.dark-mode.toggle');
  assert.equal(normalizeSeamKey('9lives'), null);
  assert.equal(normalizeSeamKey(''), null);
  assert.equal(normalizeSeamKey(null), null);
});

test('Android invoke(ActionKey) becomes an OPEN app action keyed by the source action key', () => {
  const [seam] = seamsFromSourceIntent({
    kind: 'TOGGLE',
    intentOrNull: 'invoke(AppActions.ToggleDarkMode)',
    actionKeyOrNull: 'action.theme.dark-mode.toggle',
    callOrNull: 'toggleDarkMode()',
  });
  assert.equal(seam.kind, 'ACTION');
  assert.equal(seam.trigger, 'CHANGE');
  assert.equal(seam.key, 'action.theme.dark-mode.toggle');
  assert.equal(seam.origin, 'SOURCE');
  assert.equal(seam.source.callOrNull, 'toggleDarkMode()');
  const [bare] = seamsFromSourceIntent({ kind: 'BUTTON', intentOrNull: 'invoke(AppActions.OpenThing)' });
  assert.equal(bare.key, 'open-thing');
});

test('compound source intents split into one seam per relationship', () => {
  const seams = seamsFromSourceIntent({
    kind: 'MENU_ITEM',
    intentOrNull: 'close(FabOptions) then navigateTo(DebugMenuScreen)',
    navigatesToOrNull: 'screen.debug-menu',
  });
  assert.deepEqual(seams.map((row) => row.kind), ['PRESENTATION', 'NAVIGATION']);
  assert.equal(seams[0].verbOrNull, 'CLOSE');
  assert.equal(seams[0].targetHintOrNull, 'FabOptions');
  assert.equal(seams[1].key, 'navigate.debug-menu');
  assert.equal(seams[1].destinationOrNull, 'screen.debug-menu');
});

test('local effects, back navigation, external links, local reveals and capability intents classify honestly', () => {
  const local = seamsFromSourceIntent({ kind: 'BUTTON', intentOrNull: 'localEffect()', pathwayRefOrNull: 'pathway.cgm.receive' })[0];
  assert.deepEqual([local.kind, local.key], ['ACTION', 'cgm.receive']);
  const localFromElement = seamsFromSourceIntent({ kind: 'BUTTON', intentOrNull: 'localEffect()', elementRef: 'element.lab.go' })[0];
  assert.equal(localFromElement.key, 'lab.go');
  const localFallback = seamsFromSourceIntent({ kind: 'BUTTON', intentOrNull: 'localEffect()' })[0];
  assert.equal(localFallback.key, 'local-effect');
  const back = seamsFromSourceIntent({ kind: 'BUTTON', intentOrNull: 'navigateBack()' })[0];
  assert.deepEqual([back.kind, back.destinationOrNull], ['NAVIGATION', 'BACK']);
  const external = seamsFromSourceIntent({ kind: 'BUTTON', intentOrNull: 'external https://example.test/help' })[0];
  assert.deepEqual([external.kind, external.destinationOrNull], ['NAVIGATION', 'https://example.test/help']);
  const reveal = seamsFromSourceIntent({ kind: 'BUTTON', intentOrNull: 'local element.workspace.companion' })[0];
  assert.deepEqual([reveal.kind, reveal.verbOrNull], ['PRESENTATION', 'REVEAL']);
  const capability = seamsFromSourceIntent({ kind: 'BUTTON', intentOrNull: 'capability conversation.send', interactions: ['ACTIVATE'] })[0];
  assert.deepEqual([capability.kind, capability.key], ['ACTION', 'conversation.send']);
  const presentationState = seamsFromSourceIntent({ kind: 'BUTTON', intentOrNull: 'presentation color-mode.toggle' })[0];
  assert.equal(presentationState.kind, 'ACTION', 'app-owned presentation State stays an OPEN app action');
  const swap = seamsFromSourceIntent({ kind: 'BUTTON', intentOrNull: 'swapTo(Library)' })[0];
  assert.deepEqual([swap.kind, swap.verbOrNull], ['PRESENTATION', 'SWAP']);
  const stream = seamsFromSourceIntent({ kind: 'BUTTON', intentOrNull: 'vexstream.queue.next', interactions: ['ACTIVATE'] })[0];
  assert.deepEqual([stream.kind, stream.key], ['ACTION', 'vexstream.queue.next']);
  const odd = seamsFromSourceIntent({ kind: 'BUTTON', intentOrNull: '???', actionKeyOrNull: 'thing.do' })[0];
  assert.equal(odd.key, 'thing.do');
  const oddest = seamsFromSourceIntent({ kind: 'BUTTON', intentOrNull: '???' })[0];
  assert.equal(oddest.key, 'action');
});

test('no seam is invented without source intent, and spatial handles stay UI-local', () => {
  assert.deepEqual(seamsFromSourceIntent({ kind: 'BUTTON' }), []);
  assert.deepEqual(seamsFromSourceIntent(), []);
  const keyOnly = seamsFromSourceIntent({ kind: 'BUTTON', actionKeyOrNull: 'action.save' });
  assert.equal(keyOnly.length, 1);
  assert.equal(keyOnly[0].key, 'action.save');
  const handle = seamsFromSourceIntent({ kind: 'HANDLE', elementRef: 'element.seam.handle', interactions: ['RESIZE', 'COLLAPSE_BEFORE', 'COLLAPSE_AFTER'] });
  assert.deepEqual(handle.map((row) => row.verbOrNull), ['RESIZE', 'COLLAPSE', 'COLLAPSE']);
  assert.ok(handle.every((row) => row.kind === 'PRESENTATION'));
  const handleFallback = seamsFromSourceIntent({ kind: 'HANDLE', interactions: ['RESIZE'] });
  assert.equal(handleFallback[0].key, 'resize.handle');
  const unknownTrigger = seamsFromSourceIntent({ kind: 'CAROUSEL', intentOrNull: 'vexstream.x.y', interactions: ['SWIPE'] });
  assert.equal(unknownTrigger[0].trigger, 'ACTIVATE');
});

// [VXG RealForever][VEXWORK][COMPONENT-LIBRARY][A5-UI-KINDS-TEST]
