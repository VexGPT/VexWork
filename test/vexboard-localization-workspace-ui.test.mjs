import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const workspace = fs.readFileSync(new URL('../vexboard/localization.html', import.meta.url), 'utf8');
const projects = fs.readFileSync(new URL('../vexboard/projects.html', import.meta.url), 'utf8');
const lens = fs.readFileSync(new URL('../vexboard/lens.html', import.meta.url), 'utf8');
const copy = JSON.parse(fs.readFileSync(new URL('../vexboard/localization-copy.json', import.meta.url), 'utf8'));

test('VexBoard exposes Components, Builder and Localization beside Projects', () => {
  // Siblings stay adjacent and ordered: Components -> Builder -> Localization.
  assert.match(projects, /href="\.\/components\.html">Components<\/a><a class="out" href="\.\/builder\.html"[^>]*>Builder<\/a><a class="out" href="\.\/localization\.html">Localization<\/a>/);
  assert.match(workspace, /<a class="nav" href="\.\/projects\.html">Projects<\/a><span class="spacer"><\/span><a class="nav" href="\.\/components\.html">Components<\/a><a class="nav" href="\.\/builder\.html">Builder<\/a><span class="here">Localization<\/span>/);
  assert.match(workspace, /Cross-Product projection over current Main Localization Inventories/);
});

test('global workspace consumes the same normalized inventory, convergence and Change Set contracts', () => {
  assert.match(workspace, /vexboard-localization-workspace\.mjs/);
  assert.match(workspace, /vexboard-localization-inventory\.mjs/);
  assert.match(workspace, /vexboard-localization-change-set\.mjs/);
  assert.match(workspace, /Catalog\.buildFor\(subject, 'main'\)/);
  assert.match(workspace, /Inventory\.normalizeLocalizationInventory\(raw\)/);
  assert.match(workspace, /inventory\.sourceSnapshot\.commit !== build\.commit/);
  assert.match(workspace, /Changes\.loadLocalizationChangeSetCollection\(localStorage\)/);
  assert.match(workspace, /Workspace\.projectLocalizationWorkspace/);
  assert.match(workspace, /workLocaleRefs: \[\.\.\.new Set\(\[state\.localeRef, state\.valueLocaleRef\]\.filter\(Boolean\)\)\]/);
  assert.match(workspace, /Work target · not observed in Product source/);
  assert.match(workspace, /row\.requestedChangeCount/);
  assert.doesNotMatch(workspace, /api\.github\.com|raw\.githubusercontent\.com/);
});

test('workspace exposes every earned A5 pivot and keeps missing Product inventory visible', () => {
  for (const pivot of ['ELEMENTS','STRINGS','VALUES','GROUPS','LOCALES','COVERAGE','CHANGE_SETS']) {
    assert.match(workspace, new RegExp(pivot));
  }
  assert.match(workspace, /NOT OBSERVED is explicit/);
  assert.match(workspace, /No Main localization sidecar is connected/);
  assert.match(workspace, /equal values remain evidence, not semantic identity/i);
});

test('Screen Lens Localization Inspector can carry current subject, string and locale into the global workspace', () => {
  assert.equal(copy.strings['localization.openWorkspace'], 'Open in Localization Workspace');
  assert.match(lens, /function localizationWorkspaceHref\(row\)/);
  assert.match(lens, /localization\.html/);
  assert.match(lens, /searchParams\.set\('string', row\.sourceStringRef\)/);
  assert.match(lens, /searchParams\.set\('locale'/);
  assert.match(lens, /localizationText\('localization\.openWorkspace'\)/);
});


test('workspace search copy follows the active pivot and distinguishes totals from filtered matches', () => {
  assert.match(workspace, /const searchPlaceholders = Object\.freeze/);
  assert.match(workspace, /Find source string ID, source value, visible translation, source path, or format signature/);
  assert.match(workspace, /Find element, screen, role, source string, or visible value/);
  assert.match(workspace, /Find locale code, e\.g\. es, ja, or zh-Hant/);
  assert.match(workspace, /Total rows before filters/);
  assert.match(workspace, /id: 'match-summary'/);
  assert.match(workspace, /matchSummary\(rows\)/);
});


test('STRINGS keeps source value anchored and adds one switchable locale-value comparison column', () => {
  assert.match(workspace, /Translation/);
  assert.match(workspace, /aria-label': 'Translation language'/);
  assert.match(workspace, /valueLocale/);
  assert.match(workspace, /localizationWorkspaceStringValue/);
  assert.match(workspace, /Not observed/);
  assert.match(workspace, /lang: state\.valueLocaleRef/);
  assert.match(workspace, /valueLocaleRef: state\.valueLocaleRef/);
});


test('overview error absence never leaks null text into the page', () => {
  const overviewStart = workspace.indexOf("h('section', { class: 'overview', id: 'localization-overview' }");
  const storageError = workspace.indexOf("state.storageError ? h('div', { class: 'error' }", overviewStart);
  const inventoryError = workspace.indexOf("state.unavailable.some((row) => row.state === 'ERROR') ? h('div', { class: 'error' }", overviewStart);
  const resizer = workspace.indexOf('overviewResizer()', overviewStart);

  assert.ok(overviewStart >= 0);
  assert.ok(storageError > overviewStart && storageError < resizer);
  assert.ok(inventoryError > overviewStart && inventoryError < resizer);
  assert.match(workspace, /if \(child === null \|\| child === undefined \|\| child === false\) continue;/);
});

test('overview continuously yields viewport space through one accessible vertical splitter', () => {
  assert.match(workspace, /class: 'overview-resizer'/);
  assert.match(workspace, /role: 'separator'/);
  assert.match(workspace, /aria-orientation': 'horizontal'/);
  assert.match(workspace, /pointerdown/);
  assert.match(workspace, /pointermove/);
  assert.match(workspace, /ArrowUp/);
  assert.match(workspace, /ArrowDown/);
  assert.match(workspace, /Home/);
  assert.match(workspace, /End/);
  assert.match(workspace, /--overview-height/);
  assert.match(workspace, /visibleHeight = overview\.getBoundingClientRect\(\)\.height/);
  assert.match(workspace, /max-height:max\(260px,calc\(100vh - 205px - var\(--overview-height,0px\)\)\)/);
});

test('global workspace links rows back into the existing Screen Lens selection/localization path', () => {
  assert.match(workspace, /target\.searchParams\.set\('localization', '1'\)/);
  assert.match(workspace, /target\.searchParams\.set\('string', sourceStringRef\)/);
  assert.match(workspace, /target\.searchParams\.set\('element', occurrence\.elementRef\)/);
  assert.match(workspace, /Open in Lens/);
});

// [VXG RealForever][VEXWORK][VEXBOARD][LOCALIZATION][A5-WORKSPACE-UI]
