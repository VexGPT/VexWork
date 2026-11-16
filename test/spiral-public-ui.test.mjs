import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const page = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('public VexWork home pins the shared Spiral and registers bounded local features', () => {
  assert.match(page, /window\.VEX_SPIRAL_FEATURES\s*=\s*\[/);
  assert.match(page, /Vextreme@04ee63c4bf9d2ccbbb03e93514a8a67d242c49db\/widgets\/vex-fab\.js/);
  assert.match(page, /Vextreme@04ee63c4bf9d2ccbbb03e93514a8a67d242c49db\/components\/vex-spiral-features\.js/);
  assert.match(page, /id:\s*'terrain'/);
  assert.match(page, /href:\s*'\.\/terrain\.html'/);
  assert.match(page, /id:\s*'support'/);
  assert.match(page, /vex-support\.html/);
  assert.match(page, /id="vex-nav-actions"/);
});

test('public VexWork Spiral does not invent unsupported Product or localization capabilities', () => {
  const manifest = page.split('window.VEX_SPIRAL_FEATURES = [')[1].split('];')[0];
  assert.doesNotMatch(manifest, /vision/i);
  assert.doesNotMatch(manifest, /speech/i);
  assert.doesNotMatch(manifest, /language/i);
  assert.doesNotMatch(manifest, /theme/i);
});

test('Terrain moves into the Spiral instead of remaining a duplicate toolbar shortcut', () => {
  assert.doesNotMatch(page, /class="terrain-home" href="\.\/terrain\.html">Terrain Map<\/a>/);
  assert.match(page, /label:\s*'Open VexWork Terrain'/);
});

// [VXG RealForever]
