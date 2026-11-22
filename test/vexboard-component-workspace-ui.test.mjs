import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const page = fs.readFileSync(new URL('../vexboard/components.html', import.meta.url), 'utf8');

test('A5 centers Gallery specimens and Studio composition instead of a where-used table', () => {
  assert.match(page, /Component Library/);
  assert.match(page, /Gallery/);
  assert.match(page, /Studio/);
  assert.match(page, /One real source occurrence in isolation/);
  assert.match(page, /relationship specimen · not native pixel parity/);
  assert.match(page, /Place in Studio/);
  assert.match(page, /Save blueprint/);
  assert.match(page, /Import blueprint/);
});

test('A5 specimens cycle real source occurrences and keep evidence behind the selected item', () => {
  assert.match(page, /Components\.occurrencesForComponent/);
  assert.match(page, /Source example/);
  for (const evidenceKey of ['ABOUT','WHERE_USED','REALIZATIONS','PROOF','SOURCE']) {
    assert.match(page, new RegExp("'" + evidenceKey + "'"));
  }
  assert.match(page, /human\(key\)/);
  assert.match(page, /Open full Lens/);
});

test('A5 Studio exports deterministic relationship blueprints without AI or target code generation', () => {
  assert.match(page, /vexboard-component-studio\.mjs/);
  assert.match(page, /Studio\.studioNodeFromOccurrence/);
  assert.match(page, /Studio\.createStudioBlueprint/);
  assert.match(page, /Studio\.studioBlueprintBytes/);
  assert.match(page, /AI required: No/);
  assert.match(page, /target code: A6/);
  assert.match(page, /Save is JSON, not generated target code/);
});

test('A5 local specimen interaction cannot imply Product effects', () => {
  assert.match(page, /Preview interactions are local only; no Product effect runs here/);
  assert.match(page, /Product State was not changed/);
  assert.match(page, /no Product effect was run/);
});

test('A5 checked-in browser module parses before boot', () => {
  const openTag = '<script type="module">';
  const closeTag = '</script>';
  const openIndex = page.indexOf(openTag);
  const closeIndex = page.indexOf(closeTag, openIndex);
  assert.ok(openIndex >= 0);
  assert.ok(closeIndex > openIndex);
  const moduleSource = page.slice(openIndex + openTag.length, closeIndex);
  const parseable = moduleSource
    .split('\n')
    .filter((line) => !line.trim().startsWith('import '))
    .join('\n');
  assert.doesNotThrow(() => new Function(parseable));
});

test('A5 remains local/read-only toward repositories and browser persistence', () => {
  assert.match(page, /const CATALOG_URL='\.\.\/projects\/vexboard\/lens\/catalog\.json'/);
  assert.match(page, /const INVENTORY_DIR='\.\.\/projects\/component-library-architecture\/inventory\/'/);
  assert.match(page, /const ARCHITECTURE_URL='\.\.\/projects\/component-library-architecture\/component-architecture-catalog\.json'/);
  assert.doesNotMatch(page, /api\.github\.com|raw\.githubusercontent\.com/);
  assert.doesNotMatch(page, /localStorage|sessionStorage/);
  assert.doesNotMatch(page, /method\s*:\s*['"](?:POST|PUT|PATCH|DELETE)['"]/);
});

// [VXG RealForever][VEXWORK][COMPONENT-LIBRARY][A5-GALLERY-STUDIO-UI]
