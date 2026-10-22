import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const page = fs.readFileSync(new URL('../terrain.html', import.meta.url), 'utf8');
const module = fs.readFileSync(new URL('../terrain-reader.js', import.meta.url), 'utf8');

test('Terrain remains an explicit read-only VexWork projection', () => {
  assert.match(page, /VexWork/);
  assert.match(page, /Terrain Map/);
  assert.match(page, /experimental v2/i);
  assert.match(page, /./public/workspace.json/);
  assert.match(page, /executionAuthority!=='NONE'/);
  assert.doesNotMatch(page, /method:s*['"](?:POST|PUT|PATCH|DELETE)['"]/i);
});

test('Terrain uses stable perceptual bands and strata rather than radial graph navigation', () => {
  assert.match(page, /project-band/);
  assert.match(page, /preview-strip/);
  assert.match(page, /strata-list/);
  assert.match(page, /depth is level-of-detail/);
  assert.doesNotMatch(page, /Math.PI*2*index/);
  assert.doesNotMatch(page, /class="rail"/);
});

test('camera depth is presentation-only while explicit jumps keep traversal continuity', () => {
  assert.match(page, /cameraPath/);
  assert.match(page, /cameraEnter/);
  assert.match(page, /More detail revealed · semantic Journey unchanged/);
  assert.match(page, /Explicit traversal path/);
  assert.match(page, /action.terrain.search-portal/);
  assert.match(module, /DUPLICATE_EXACT_NOOP/);
  assert.match(module, /DIVERGENT_COMMAND_IDENTITY/);
  assert.match(module, /inspectHistory/);
  assert.match(module, /REVISIT/);
});

test('focused Terrain reserves explicit rows for context, siblings, focus header and child strata', () => {
  assert.match(page, /\.focus-layout\{height:100%;display:grid;grid-template-rows:auto auto auto minmax\(0,1fr\)/);
  assert.match(page, /layout\.append\(contextTrail\(\)\)/);
  assert.match(page, /layout\.append\(sib\)/);
  assert.match(page, /layout\.append\(head\)/);
  assert.match(page, /layout\.append\(list\)/);
});

test('nested scrolling retains priority over outward level-of-detail traversal', () => {
  assert.match(page, /scrollPathCanMove/);
  assert.match(page, /Outer boundary reached/);
  assert.match(page, /reveal less detail/);
});
