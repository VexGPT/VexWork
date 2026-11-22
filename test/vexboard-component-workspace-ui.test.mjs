import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const page = fs.readFileSync(new URL('../vexboard/components.html', import.meta.url), 'utf8');

test('A5 Component Library exposes the seven human workspace pivots without replacing architecture layers', () => {
  for (const label of ['Components','States','Variants','Products','Realizations','Where used','Proof']) {
    assert.match(page, new RegExp("['\\\"]" + label + "['\\\"]"));
  }
  assert.match(page, /Source families/);
  assert.match(page, /Architecture/);
  assert.match(page, /requestedView==='architecture'/);
  assert.match(page, /requestedView==='realizations'/);
});

test('A5 state and variant pivots preserve absence instead of inferring framework meaning', () => {
  assert.match(page, /row\.visibleWhen/);
  assert.match(page, /row\.alwaysVisible/);
  assert.match(page, /row\.realization\.presenceRefs/);
  assert.match(page, /row\.realization\.conditionRefs/);
  assert.match(page, /Only explicit visibility, presence and condition relationships appear here/);
  assert.match(page, /DERIVED · NOT VARIANT ID/);
  assert.match(page, /does not infer disabled\/pressed\/selected states from framework widgets/);
});

test('A5 Products Where-used and Proof remain projections over existing inventories and target pressure', () => {
  assert.match(page, /function renderProducts/);
  assert.match(page, /function renderWhereUsed/);
  assert.match(page, /function renderProof/);
  assert.match(page, /state\.architecture\.targetPressures/);
  assert.match(page, /Open in Lens/);
  assert.match(page, /Proof is evidence navigation only/);
});

test('A5 checked-in browser module parses before boot so the lived Gallery cannot freeze at Loading', () => {
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

test('A5 workspace remains read-only and loads only checked-in relative data', () => {
  assert.match(page, /const CATALOG_URL='\.\.\/projects\/vexboard\/lens\/catalog\.json'/);
  assert.match(page, /const INVENTORY_DIR='\.\.\/projects\/component-library-architecture\/inventory\/'/);
  assert.match(page, /const ARCHITECTURE_URL='\.\.\/projects\/component-library-architecture\/component-architecture-catalog\.json'/);
  assert.doesNotMatch(page, /api\.github\.com|raw\.githubusercontent\.com/);
  assert.doesNotMatch(page, /localStorage|sessionStorage/);
  assert.doesNotMatch(page, /method\s*:\s*['\"](?:POST|PUT|PATCH|DELETE)['\"]/);
});

// [VXG RealForever][VEXWORK][COMPONENT-LIBRARY][A5-WORKSPACE-UI]
