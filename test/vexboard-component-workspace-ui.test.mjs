import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const page = fs.readFileSync(new URL('../vexboard/components.html', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../vexboard/ui/gallery-app.mjs', import.meta.url), 'utf8');

test('Gallery is the showroom: real source specimens in isolation, not a where-used table', () => {
  assert.match(page, /<h1>Component Library<\/h1>/u);
  assert.match(page, /import \{ boot \} from '\.\/ui\/gallery-app\.mjs'/u);
  assert.match(app, /One real source occurrence in isolation/u);
  assert.match(app, /relationship specimen · not native pixel parity/u);
  assert.match(app, /Components\.occurrencesForComponent/u);
  assert.match(app, /'aria-label': 'Source example'/u);
});

test('Gallery keeps evidence behind the selected item', () => {
  assert.match(app, /const EVIDENCE_TABS = \['ABOUT', 'WHERE_USED', 'REALIZATIONS', 'PROOF', 'SOURCE'\]/u);
  assert.match(app, /Open in Screen Lens/u);
});

test('one composer: the Gallery hands items to the Builder instead of running a second Studio', () => {
  assert.doesNotMatch(page + app, /Studio/u);
  assert.doesNotMatch(app, /vexboard-component-studio/u);
  assert.match(app, /'\.\/builder\.html\?add=' \+ encodeURIComponent\(family\.slug \+ '~' \+ row\.occurrenceRef\)/u);
  assert.match(app, /'&children=1'/u);
  assert.match(app, /Use in Builder/u);
  assert.match(app, /params\.get\('occurrence'\)/u, 'Builder can deep-link back to the Library item');
});

test('Gallery shares the Builder renderer and seam classification', () => {
  assert.match(app, /from '\.\/component-renderer\.mjs'/u);
  assert.match(app, /seamsFromSourceIntent/u);
  assert.match(app, /UI_KIND_CATEGORIES/u);
});

test('local specimen interaction cannot imply Product effects', () => {
  assert.match(app, /Preview interactions are local only; no Product effect runs here\./u);
  assert.match(app, /Product State was not changed/u);
  assert.match(app, /no Product effect was run/u);
});

test('Gallery remains local and read-only toward repositories and browser persistence', () => {
  assert.match(app, /const CATALOG_URL = '\.\.\/projects\/vexboard\/lens\/catalog\.json'/u);
  assert.match(app, /const INVENTORY_DIR = '\.\.\/projects\/component-library-architecture\/inventory\/'/u);
  assert.match(app, /const ARCHITECTURE_URL = '\.\.\/projects\/component-library-architecture\/component-architecture-catalog\.json'/u);
  for (const source of [page, app]) {
    assert.doesNotMatch(source, /api\.github\.com|raw\.githubusercontent\.com/u);
    assert.doesNotMatch(source, /localStorage|sessionStorage/u);
    assert.doesNotMatch(source, /method\s*:\s*['"](?:POST|PUT|PATCH|DELETE)['"]/u);
  }
});

// [VXG RealForever][VEXWORK][COMPONENT-LIBRARY][A5-GALLERY-UI-TEST]
