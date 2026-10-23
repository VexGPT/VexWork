import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const page = fs.readFileSync(new URL('../terrain.html', import.meta.url), 'utf8');
const module = fs.readFileSync(new URL('../terrain-reader.js', import.meta.url), 'utf8');

test('Terrain remains an explicit read-only VexWork projection', () => {
  assert.match(page, /VexWork/);
  assert.match(page, /Terrain Map/);
  assert.match(page, /experimental v2/i);
  assert.match(page, /\.\/public\/workspace\.json/);
  assert.match(page, /executionAuthority!=='NONE'/);
  assert.doesNotMatch(page, /method:\s*['"](?:POST|PUT|PATCH|DELETE)['"]/i);
});

test('Terrain uses stable perceptual bands and strata rather than radial graph navigation', () => {
  assert.match(page, /project-band/);
  assert.match(page, /preview-strip/);
  assert.match(page, /strata-list/);
  assert.match(page, /depth is level-of-detail/);
  assert.doesNotMatch(page, /Math\.PI\*2\*index/);
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

test('semantic wheel traversal is disabled by default while its implementation remains available', () => {
  assert.match(page, /const SEMANTIC_WHEEL_TRAVERSAL_ENABLED=false/);
  assert.match(page, /function onWheel\(e\)\{\s*if\(!SEMANTIC_WHEEL_TRAVERSAL_ENABLED\)return;/);
  assert.match(page, /function cameraEnter/);
  assert.match(page, /function cameraOut/);
  assert.match(page, /wheel traversal off/);
});

test('Terrain projects continuity around current work with state color and age evidence', () => {
  assert.match(page, /function continuityWindow/);
  assert.match(page, /data\.continuity=role/);
  assert.match(page, /data\.tone=tone\(item\.state\)/);
  assert.match(page, /latest completed/);
  assert.match(page, /snapshot /);
  assert.match(page, /stateAgeText/);
  assert.match(page, /outside continuity/);
});

test('Inspect is closable and participation evidence is explicitly bounded to recorded transition actors', () => {
  assert.match(page, /classList\.remove\('open'\)/);
  assert.match(page, /Recorded lifecycle actors:/);
  assert.match(page, /Recorded actor handoffs:/);
  assert.match(page, /this is not a total worker\/thread count/);
  assert.match(page, /does not yet model total worker\/thread participation/);
});

test('Terrain workspace is a vertically scrollable Project/workfront roadmap rather than fixed-height Project bands', () => {
  assert.match(page, /project-road/);
  assert.match(page, /workfront-row/);
  assert.match(page, /projectRoadSection/);
  assert.match(page, /collapsedProjects/);
  assert.match(page, /overflow:auto/);
  assert.match(page, /Vertical = parallel work; horizontal = prior, now, next/);
});

test('Terrain time lens preserves Now while adding recent accepted movement windows', () => {
  assert.match(page, /data-hours="0">Now/);
  assert.match(page, /data-hours="6">6H/);
  assert.match(page, /data-hours="24">24H/);
  assert.match(page, /data-hours="168">7D/);
  assert.match(page, /Flow\.projectWorkfronts\(project,\{recentHours:timeLensHours/);
  assert.match(page, /recent moves/);
});

test('Roadmap presentation shows sequence distance rather than calendar ETA', () => {
  assert.match(page, /data-mode="roadmap"/);
  assert.match(page, /function renderRoadmap/);
  assert.match(page, /Flow\.projectScopeRoadmap/);
  assert.match(page, /'Now','\+1','\+2','\+3','Later \/ parallel'/);
  assert.match(page, /Solid future = dependency-grounded sequence/);
  assert.match(page, /Dotted future = admitted structural\/later work/);
  assert.match(page, /sequence, not calendar estimate/);
  assert.doesNotMatch(page, /estimated completion date|ETA:/i);
});

test('Terrain and Roadmap mode changes remain presentation state rather than semantic Journey mutations', () => {
  assert.match(page, /function setViewMode\(mode\)/);
  assert.match(page, /history\.replaceState/);
  assert.match(page, /refreshControls\(\)/);
  assert.match(page, /viewMode==='roadmap'/);
});
test('nested scrolling retains priority over outward level-of-detail traversal', () => {
  assert.match(page, /scrollPathCanMove/);
  assert.match(page, /Outer boundary reached/);
  assert.match(page, /reveal less detail/);
});
