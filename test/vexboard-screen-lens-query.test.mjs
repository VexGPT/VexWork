import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { normalizeScreenLens } from '../src/shared/vexboard-screen-lens.mjs';
import {
  DISPOSITION_LABELS,
  SEARCH_KINDS,
  controlBrief,
  findStep,
  impactOf,
  screenBrief,
  screenCoverage,
  screensForElement,
  searchLens,
  targetFor,
} from '../src/shared/vexboard-screen-lens-query.mjs';

const source = JSON.parse(fs.readFileSync(new URL('../projects/vexboard/examples/vexlife-debug-menu.screen-lens.json', import.meta.url), 'utf8'));
const lens = normalizeScreenLens(source);
const clone = () => JSON.parse(JSON.stringify(source));
const primary = ['screen.home', 'screen.events', 'screen.settings'];

test('steps are found by ref across pathways', () => {
  const found = findStep(lens, 'theme.store');
  assert.equal(found.pathway.pathwayRef, 'pathway.theme-mode.select');
  assert.equal(found.node.role, 'STORE');
  assert.equal(findStep(lens, 'nothing'), null);
});

test('an element appears on every screen its owner reaches, and nowhere else', () => {
  assert.deepEqual(screensForElement(lens, 'element.debug-menu'), primary, 'FAB option lives in chrome shown on primary screens');
  assert.deepEqual(screensForElement(lens, 'element.debug-menu.body.dark-mode'), ['screen.debug-menu']);
  assert.equal(screensForElement(lens, 'element.shell.back').length, lens.screens.length, 'Back is always visible');
  assert.throws(() => screensForElement(lens, 'element.nope'), /unknown element/);
});

test('targets prefer the screen the reader is already on', () => {
  assert.equal(targetFor(lens, 'ELEMENT', 'element.debug-menu', 'screen.settings').screenRef, 'screen.settings');
  assert.equal(targetFor(lens, 'ELEMENT', 'element.debug-menu', 'screen.debug-menu').screenRef, 'screen.home');
  assert.equal(targetFor(lens, 'ELEMENT', 'element.debug-menu').screenRef, 'screen.home');
  const step = targetFor(lens, 'STEP', 'nav.relationship', 'screen.events');
  assert.deepEqual(step, { screenRef: 'screen.events', elementRef: 'element.navigation.home', pathwayRef: 'pathway.shell.navigate', nodeRef: 'nav.relationship' });
  const pathway = targetFor(lens, 'PATHWAY', 'pathway.theme-mode.select');
  assert.equal(pathway.elementRef, 'element.debug-menu.body.dark-mode');
  assert.equal(pathway.nodeRef, null);
  assert.deepEqual(targetFor(lens, 'SCREEN', 'screen.gallery'), { screenRef: 'screen.gallery', elementRef: null, pathwayRef: null, nodeRef: null });
  assert.throws(() => targetFor(lens, 'SCREEN', 'screen.nope'), /unknown screen/);
  assert.throws(() => targetFor(lens, 'ELEMENT', 'element.nope'), /unknown element/);
  assert.throws(() => targetFor(lens, 'STEP', 'nope'), /unknown step/);
  assert.throws(() => targetFor(lens, 'PATHWAY', 'nope'), /unknown pathway/);
  assert.throws(() => targetFor(lens, 'NOTE', 'nope'), /unknown note/);
  assert.throws(() => targetFor(lens, 'WIDGET', 'x'), /unknown kind/);
});

test('a note targets whatever it is attached to', () => {
  assert.equal(targetFor(lens, 'NOTE', 'note.debug.composition').screenRef, 'screen.debug-menu');
  assert.equal(targetFor(lens, 'NOTE', 'note.dark-mode.doorway').elementRef, 'element.debug-menu.body.dark-mode');
  assert.equal(targetFor(lens, 'NOTE', 'note.fence.local').nodeRef, 'theme.fence');
  assert.equal(targetFor(lens, 'NOTE', 'note.reset.no-family').pathwayRef, 'pathway.log-history.clear');
  const input = clone();
  input.annotations.push({ ref: 'note.chrome', subjectRef: 'chrome.app-shell', text: 'Chrome', detail: 'On the owner itself.' });
  assert.deepEqual(targetFor(normalizeScreenLens(input), 'NOTE', 'note.chrome'), { screenRef: null, elementRef: null, pathwayRef: null, nodeRef: null });
});

test('a pathway nobody uses still resolves, without a screen', () => {
  const input = clone();
  input.pathways.push({ pathwayRef: 'pathway.orphan', label: 'Orphan', disposition: 'TYPED_NAVIGATION', nodes: [{ ref: 'orphan.step', face: 'BEHAVIOR', role: 'NAVIGATION', label: 'NavigateTo(x)' }], edges: [] });
  const orphan = targetFor(normalizeScreenLens(input), 'STEP', 'orphan.step', 'screen.home');
  assert.deepEqual(orphan, { screenRef: null, elementRef: null, pathwayRef: 'pathway.orphan', nodeRef: 'orphan.step' });
});

test('search starts from any coordinate: action key, symbol, source file, label or note', () => {
  assert.deepEqual(searchLens(lens, ''), []);
  assert.deepEqual(searchLens(lens, '   '), []);
  const byKey = searchLens(lens, 'action.theme.dark-mode.toggle');
  assert.equal(byKey[0].kind, 'ELEMENT');
  assert.equal(byKey[0].ref, 'element.debug-menu.body.dark-mode');
  assert.equal(byKey[0].score, 100);
  assert.equal(byKey[0].field, 'id');
  const bySymbol = searchLens(lens, 'ThemeModeStore');
  assert.equal(bySymbol[0].ref, 'theme.store');
  assert.equal(bySymbol[0].target.nodeRef, 'theme.store');
  const byFile = searchLens(lens, 'ThemeMode.kt');
  assert.ok(byFile.length > 0 && byFile.every((result) => ['STEP', 'SCREEN', 'NOTE'].includes(result.kind)));
  assert.ok(byFile.some((result) => result.kind === 'NOTE' && result.ref === 'note.control.select-drift'), 'the drift note mentions the file');
  assert.ok(searchLens(lens, 'universal token').some((result) => result.kind === 'NOTE' && result.ref === 'note.fence.local'));
  assert.ok(searchLens(lens, 'scae').some((result) => result.kind === 'PATHWAY'));
  assert.equal(searchLens(lens, 'gallery')[0].field, 'label');
});

test('search needs every token, ranks identifiers over prose, and respects limits', () => {
  const both = searchLens(lens, 'reset log');
  assert.ok(both.length > 0);
  assert.ok(both.every((result) => `${result.label} ${result.detail} ${result.ref}`.toLowerCase().includes('reset') || result.kind === 'STEP' || result.kind === 'PATHWAY' || result.kind === 'NOTE'));
  assert.equal(searchLens(lens, 'reset zebra').length, 0);
  const ranked = searchLens(lens, 'dark');
  for (let i = 1; i < ranked.length; i += 1) assert.ok(ranked[i - 1].score >= ranked[i].score);
  assert.equal(searchLens(lens, 'e', { limit: 3 }).length, 3);
  assert.deepEqual(SEARCH_KINDS, ['ELEMENT', 'STEP', 'SCREEN', 'PATHWAY', 'NOTE']);
  const helper = searchLens(lens, 'events simulator helper');
  assert.ok(helper.some((result) => result.ref === 'element.debug-menu.body.events-simulator.helper'));
  const prose = searchLens(lens, 'supersedes an older one');
  assert.equal(prose[0].field, 'text');
});

test('impact of a control: screens, siblings on the same pathway, and what it touches underneath', () => {
  const option = impactOf(lens, 'element.debug-menu');
  assert.deepEqual(option.screenRefs, primary);
  assert.deepEqual(option.sharesPathwayWith, ['element.user-profile', 'element.gallery']);
  assert.deepEqual(option.touches, [], 'navigation touches no store');
  const dark = impactOf(lens, 'element.debug-menu.body.dark-mode');
  assert.ok(dark.touches.includes('theme.store'));
  assert.ok(dark.touches.includes('theme.prefs'));
  assert.ok(!dark.touches.includes('theme.act'), 'semantic steps are not "underneath"');
  const card = impactOf(lens, 'element.debug-menu.body.log-history');
  assert.equal(card.pathwayRef, null);
  assert.deepEqual(card.touches, []);
  assert.deepEqual(card.sharesPathwayWith, []);
});

test('impact of a step: who reaches it, and the same symbol or file in other pathways', () => {
  const runtime = impactOf(lens, 'theme.runtime');
  assert.deepEqual(runtime.reachedFrom.map((entry) => entry.elementRef), ['element.debug-menu.body.dark-mode']);
  assert.deepEqual(runtime.sameSymbol, ['clear.runtime', 'lab.runtime']);
  assert.ok(runtime.sameSource.includes('nav.relationship'));
  const lab = impactOf(lens, 'lab.events');
  assert.equal(lab.reachedFrom.length, 10);
  assert.deepEqual(lab.screenRefs, ['screen.debug-menu']);
  const nav = impactOf(lens, 'nav.relationship');
  assert.deepEqual(nav.screenRefs, primary);
  const bare = impactOf(lens, 'log.repository');
  assert.deepEqual(bare.sameSymbol, []);
  assert.throws(() => impactOf(lens, 'screen.home'), /element or pathway step/);
});

test('coverage counts reachable controls and lists the untraced ones', () => {
  assert.deepEqual(screenCoverage(lens, 'screen.debug-menu'), { screenRef: 'screen.debug-menu', mapped: 'MAPPED', contentProjected: true, interactive: 14, traced: 14, untraced: [] });
  const home = screenCoverage(lens, 'screen.home');
  assert.equal(home.contentProjected, false);
  assert.equal(home.interactive, home.traced);
  const input = clone();
  input.screens[3].elements.push({ ref: 'element.debug-menu.body.mystery', kind: 'BUTTON', label: 'Mystery', parentRef: 'element.debug-menu.body' });
  const gap = screenCoverage(normalizeScreenLens(input), 'screen.debug-menu');
  assert.equal(gap.interactive, 15);
  assert.equal(gap.traced, 14);
  assert.deepEqual(gap.untraced, ['element.debug-menu.body.mystery']);
  assert.throws(() => screenCoverage(lens, 'screen.nope'), /unknown screen/);
});

test('the screen brief carries identities, reach, every pathway, notes and what is held', () => {
  const brief = screenBrief(lens, 'screen.debug-menu', { lensUrl: 'https://example.test/lens' });
  assert.match(brief, /^# Screen brief: Debug Menu/);
  assert.match(brief, /`screen\.debug-menu`/);
  assert.match(brief, /source snapshot: repo\.vexlife-android @ 305a09e/);
  assert.match(brief, /open in the lens: https:\/\/example\.test\/lens/);
  assert.match(brief, /reached from: Debug Menu `element\.debug-menu` owned by AppShell, shown on Home, Events, Settings/);
  assert.match(brief, /controls traced: 14 of 14/);
  assert.match(brief, /chrome here: AppShell \(always-visible controls only\)/);
  assert.match(brief, /### Choose Light \/ Dark · SCAE Family/);
  assert.match(brief, /\[STO Store \/ repository\] ThemeModeStore\.save\(mode\)/);
  assert.match(brief, /theme\.observe — interpreted \(RETURN\) → theme\.state/);
  assert.match(brief, /Doorway only/);
  assert.match(brief, /screens not projected in this lens: Gallery/);
  assert.equal((brief.match(/### Events simulator controls/g) || []).length, 1, 'a shared pathway is described once');
  assert.doesNotMatch(screenBrief(lens, 'screen.debug-menu'), /open in the lens/);
});

test('briefs for held and chrome-only screens say what is missing instead of inventing it', () => {
  const home = screenBrief(lens, 'screen.home');
  assert.match(home, /Home content is held; only shared chrome is projected/);
  assert.match(home, /chrome here: AppShell \(applies\)/);
  assert.match(home, /leads to: .*Debug Menu → Debug Menu/);
  const gallery = screenBrief(lens, 'screen.gallery');
  assert.match(gallery, /Gallery content is not projected yet/);
  const input = clone();
  input.screens[3].elements.push({ ref: 'element.debug-menu.body.mystery', kind: 'BUTTON', label: 'Mystery', parentRef: 'element.debug-menu.body' });
  input.chrome = [];
  input.annotations = input.annotations.filter((note) => !note.subjectRef.startsWith('element.shell'));
  const gap = screenBrief(normalizeScreenLens(input), 'screen.debug-menu');
  assert.match(gap, /Mystery `element\.debug-menu\.body\.mystery` has no pathway yet/);
  assert.match(gap, /Mystery `element\.debug-menu\.body\.mystery` — no pathway projected/);
  assert.match(gap, /chrome here: none/);
  assert.match(gap, /reached from: no projected route/);
  const bare = clone();
  bare.screens = [{ screenRef: 'screen.only', label: 'Only', placement: 'SHARED', mapped: 'MAPPED', elements: [] }];
  bare.pathways = [];
  bare.annotations = [];
  bare.chrome = [];
  bare.entryScreenRef = 'screen.only';
  delete bare.entryElementRef;
  bare.sourceSnapshot = { notes: [] };
  const empty = screenBrief(normalizeScreenLens(bare), 'screen.only');
  assert.match(empty, /- none projected/);
  assert.match(empty, /source snapshot: unknown @ unpinned/);
  assert.doesNotMatch(empty, /## Pathways/);
});

test('the control brief explains one control end to end', () => {
  const dark = controlBrief(lens, 'element.debug-menu.body.dark-mode', { lensUrl: 'https://example.test/lens' });
  assert.match(dark, /^# Control brief: Dark mode on Debug Menu/);
  assert.match(dark, /container path: body › Dark mode/);
  assert.match(dark, /action key: `action\.theme\.dark-mode\.toggle`/);
  assert.match(dark, /touches underneath: .*ThemeModeStore\.save\(mode\)/);
  assert.match(dark, /Disposition rule: A Family owns meaning/);
  assert.match(dark, /## Role key/);
  assert.match(dark, /open in the lens/);
  const option = controlBrief(lens, 'element.debug-menu', { screenRef: 'screen.settings' });
  assert.match(option, /on Settings/);
  assert.match(option, /appears on: Home, Events, Settings/);
  assert.match(option, /travels to: Debug Menu/);
  assert.match(option, /shares its pathway with: Profile, Gallery/);
  assert.match(option, /Depth face .*\n- nothing underneath/);
  assert.match(controlBrief(lens, 'element.shell.back'), /travels to: the runtime back target/);
  const card = controlBrief(lens, 'element.debug-menu.body.log-history');
  assert.match(card, /This card carries no behavior in the lens\./);
  assert.match(controlBrief(lens, 'element.debug-menu.body.events-simulator.actions.start'), /calls: `syntheticEvents\.start\(\)`/);
  assert.match(controlBrief(lens, 'element.debug-menu.log-history.sheet'), /visible when: runtime\.presentation\.isOpen\(LogSheet\)/);
  assert.throws(() => controlBrief(lens, 'element.nope'), /unknown element/);
  assert.equal(DISPOSITION_LABELS.SCAE_FAMILY, 'SCAE Family');
});

test('the control brief handles chrome owners without a source path and controls on no screen', () => {
  const input = clone();
  delete input.chrome[0].source;
  input.chrome[0].appliesTo = 'SHARED';
  input.screens = input.screens.filter((screen) => screen.placement === 'PRIMARY' || screen.screenRef === 'screen.debug-menu');
  for (const screen of input.screens) screen.placement = 'PRIMARY';
  input.entryScreenRef = 'screen.home';
  input.chrome[0].elements = input.chrome[0].elements.filter((element) => !element.navigatesTo || element.navigatesTo === 'BACK' || input.screens.some((screen) => screen.screenRef === element.navigatesTo));
  const altered = normalizeScreenLens(input);
  const brief = controlBrief(altered, 'element.shell.fab.add');
  assert.match(brief, /appears on: no projected screen/);
  assert.match(brief, /owner: AppShell\n/);
});

// [VXG RealForever][VEXWORK][VEXBOARD][SCREEN-LENS][QUERY-TEST]
