import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (path) => fs.readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const page = read('vexboard/builder.html');
const appSource = read('vexboard/ui/builder-app.mjs');
const canvasSource = read('vexboard/ui/builder-canvas.mjs');
const inspectorSource = read('vexboard/ui/builder-inspector.mjs');

test('Builder page is a thin shell around one browser module, adjacent to its VexBoard siblings', () => {
  assert.match(page, /<script type="module">\s*import \{ boot \} from '\.\/ui\/builder-app\.mjs';\s*boot\(\);\s*<\/script>/u);
  assert.match(page, /<a href="\.\/components\.html">Components<\/a><span class="here" aria-current="page">Builder<\/span><span class="spacer"><\/span><a href="\.\/localization\.html">Localization<\/a>/u);
  const inlineScript = page.slice(page.indexOf('<script type="module">'), page.indexOf('</script>'));
  assert.ok(inlineScript.split('\n').length < 6, 'no application logic inline in the page');
});

test('Builder states its browser-only boundary in ordinary language', () => {
  assert.match(page, /Builder runs nothing in an app\. Open reads only the file you choose; Save downloads only when you click\./u);
  assert.match(page, /Preview only\. Sizes are dp; the saved meaning is the layout settings, not these pixels\./u);
  assert.match(appSource, /Trying it: taps run Builder-local links only\. App actions are shown, not run\./u);
});

test('Builder exposes undo/redo, Try it, RTL, long-text stress, preview sizes and review handoff', () => {
  for (const id of ['undo', 'redo', 'try', 'rtl', 'stress', 'profile', 'zoom', 'new', 'open', 'save', 'review-open', 'save-brief', 'copy-brief', 'save-json', 'tab-add', 'tab-layers']) {
    assert.match(page, new RegExp('id="' + id + '"'), id);
  }
  assert.match(page, /role="status" aria-live="polite"/u);
  assert.match(page, /role="toolbar"/u);
});

test('Builder edits only through editor commands and reads files through the versioned reader', () => {
  assert.match(appSource, /Doc\.applyCommand\(app\.editor, command\)/u);
  assert.match(appSource, /Ui\.readUiBlueprint\(parsed\)/u);
  assert.match(appSource, /Ui\.uiBlueprintBytes\(app\.editor\.blueprint\)/u);
  assert.match(appSource, /Review\.constructionBrief/u);
  assert.match(inspectorSource, /apply\(\{ type: 'SET_TEXT'/u);
  assert.doesNotMatch(appSource + inspectorSource + canvasSource, /\.draft\.nodes\.push|\.draft\.nodes\[/u, 'no direct draft mutation from browser code');
});

test('Builder stays local: catalog/inventories from the same site, no repository or network writes', () => {
  assert.match(appSource, /const CATALOG_URL = '\.\.\/projects\/vexboard\/lens\/catalog\.json'/u);
  assert.match(appSource, /const INVENTORY_DIR = '\.\.\/projects\/component-library-architecture\/inventory\/'/u);
  assert.match(appSource, /inventory\.sourceSnapshot\.commit !== main\.commit/u);
  for (const source of [page, appSource, canvasSource, inspectorSource]) {
    assert.doesNotMatch(source, /api\.github\.com|raw\.githubusercontent\.com/u);
    assert.doesNotMatch(source, /method\s*:\s*['"](?:POST|PUT|PATCH|DELETE)['"]/u);
    assert.doesNotMatch(source, /sessionStorage/u);
  }
  const storageUses = appSource.match(/localStorage\.(?:getItem|setItem)\(([^,)]+)/gu) ?? [];
  assert.ok(storageUses.length >= 2);
  assert.ok(storageUses.every((use) => use.includes('DRAFT_STORAGE_KEY')), 'browser storage only holds the local draft');
});

test('absent sections are filtered before DOM replaceChildren (regression: literal "null" in panels)', () => {
  assert.match(appSource, /\]\.filter\(Boolean\)\); \/\/ DOM replaceChildren would print a literal "null"/u);
  assert.match(appSource, /\$\('inspector'\)\.replaceChildren\(\.\.\.content\.filter\(Boolean\)\)/u);
});

test('overlay previews can always be dismissed (regression: scrim trapped every click)', () => {
  assert.match(canvasSource, /class: 'scrim'[\s\S]{0,200}callbacks\.onDismissOverlays\(\)/u);
  assert.match(appSource, /onDismissOverlays: \(\) => \{/u);
});

test('browser modules import cleanly without a DOM and expose their entry points', async () => {
  const renderer = await import('../vexboard/ui/component-renderer.mjs');
  const canvas = await import('../vexboard/ui/builder-canvas.mjs');
  const inspector = await import('../vexboard/ui/builder-inspector.mjs');
  const app = await import('../vexboard/ui/builder-app.mjs');
  const gallery = await import('../vexboard/ui/gallery-app.mjs');
  assert.equal(typeof app.boot, 'function');
  assert.equal(typeof app.apply, 'function');
  assert.equal(app.DRAFT_STORAGE_KEY, 'vexboard.ui-builder.draft/v2');
  assert.equal(typeof gallery.boot, 'function');
  assert.equal(typeof inspector.renderInspector, 'function');
  assert.equal(typeof canvas.renderViewport, 'function');
  assert.match(renderer.RENDERER_CSS, /\.vx-button/u);
  assert.match(canvas.CANVAS_CSS, /\.overlay-layer/u);
});

test('shared renderer maps source style vocabulary to a small set of emphases', async () => {
  const { emphasisFor, humanize } = await import('../vexboard/ui/component-renderer.mjs');
  assert.equal(emphasisFor('PrimaryAction'), 'primary');
  assert.equal(emphasisFor('SecondaryAction'), 'secondary');
  assert.equal(emphasisFor('DangerAction'), 'danger');
  assert.equal(emphasisFor('Navigation'), 'navigation');
  assert.equal(emphasisFor('ToolbarIcon'), 'toolbar');
  assert.equal(emphasisFor('TransientFeedback'), 'transient');
  assert.equal(emphasisFor(null), 'default');
  assert.equal(humanize('MENU_ITEM'), 'Menu Item');
});

test('canvas selection maps component internals to their instance and long-text stress grows text', async () => {
  const { pseudoLocalize, selectablePath } = await import('../vexboard/ui/builder-canvas.mjs');
  assert.equal(selectablePath('n4'), 'n4');
  assert.equal(selectablePath('n4/b/c'), 'n4');
  assert.equal(selectablePath(''), null);
  const source = 'Save profile';
  const stressed = pseudoLocalize(source);
  assert.ok(stressed.length >= Math.ceil(source.length * 1.4));
  assert.match(stressed, /^⟦Såvé pröfîlé ·+⟧$/u);
});

// [VXG RealForever][VEXWORK][COMPONENT-LIBRARY][A5-UI-BUILDER-PAGE-TEST]
