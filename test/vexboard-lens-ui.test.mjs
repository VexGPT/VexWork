import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const page = fs.readFileSync(new URL('../vexboard/lens.html', import.meta.url), 'utf8');
const board = fs.readFileSync(new URL('../vexboard/index.html', import.meta.url), 'utf8');

test('Screen Lens page consumes the shared model, layout and interaction modules', () => {
  assert.match(page, /from '\.\.\/src\/shared\/vexboard-screen-lens\.mjs'/);
  assert.match(page, /from '\.\.\/src\/shared\/vexboard-lens-layout\.mjs'/);
  assert.match(page, /from '\.\/ui\/interaction\.mjs'/);
  assert.match(page, /from '\.\/ui\/presentation\.mjs'/);
  assert.match(page, /lens\/vexlife-android\.screen-lens\.json/);
});

test('Screen Lens exposes related boards through stable VexBoard boardRef deep links', () => {
  assert.match(page, /state\.lens\.relatedBoardRefs\.length/);
  assert.match(page, /aria-label': 'Related boards'/);
  assert.match(page, /\.\/\?board=\$\{encodeURIComponent\(boardRef\)\}/);
  assert.match(page, /Opening one does not change the source meaning projected here/);
});

test('flip gestures: middle-click flips Experience, right-click flips Behavior, keys and tabs are equivalent', () => {
  assert.match(page, /event\.button === 1\) \{ event\.preventDefault\(\); flip\('EXPERIENCE'\)/);
  assert.match(page, /addEventListener\('auxclick'/, 'middle-click must not open links or autoscroll');
  assert.match(page, /addEventListener\('contextmenu', \(event\) => \{ if \(event\.shiftKey\) return; event\.preventDefault\(\); flip\('BEHAVIOR'\)/);
  assert.match(page, /event\.key === '\['\) \{ flip\('EXPERIENCE'\)/);
  assert.match(page, /event\.key === '\]'\) \{ flip\('BEHAVIOR'\)/);
  assert.match(page, /role: 'tab'/);
});

test('the hidden face of each side is inert and motion respects reduced-motion', () => {
  assert.match(page, /toggleAttribute\('inert', backActive\)/);
  assert.match(page, /toggleAttribute\('inert', !backActive\)/);
  assert.match(page, /prefers-reduced-motion:reduce/);
  assert.match(page, /backface-visibility:hidden/);
});

test('roles always carry a non-color chip and three palette modes exist', () => {
  assert.match(page, /class: `chip role-\$\{role\}`/);
  assert.match(page, /palette-color-safe/);
  assert.match(page, /palette-high-contrast/);
  assert.match(page, /Presentation\.VEXBOARD_PALETTE_STORAGE_KEY/);
});

test('the lens is read-only: no writes besides the palette preference, and lens files stay on this site', () => {
  const writes = page.match(/localStorage\.setItem\(/g) || [];
  assert.equal(writes.length, 1);
  assert.doesNotMatch(page, /sessionStorage\.setItem\(/, 'arbitrary-commit projections do not survive a reload');
  assert.match(page, /const commitLenses = new Map\(\)/);
  assert.doesNotMatch(page, /method:\s*'(POST|PUT|PATCH|DELETE)'/);
  assert.match(page, /lens must be a relative \.json path on this site/);
  assert.doesNotMatch(page, /api\.github\.com|raw\.githubusercontent\.com/, 'GitHub is reached only through the commit-source module');
});

test('the header switches project and build from the catalog, and any commit projects in the browser', () => {
  assert.match(page, /from '\.\.\/src\/shared\/vexboard-lens-catalog\.mjs'/);
  assert.match(page, /Catalog\.resolveLensRequest\(state\.catalog, params\)/);
  assert.match(page, /h\('a', \{ class: 'crumb', href: '\.\/projects\.html'/);
  assert.match(page, /aria-label': 'Projects'/);
  assert.match(page, /role: 'group', 'aria-label': 'Build'/);
  assert.match(page, /switchBuild\('stable'\)/);
  assert.match(page, /switchBuild\('main'\)/);
  assert.match(page, /import\('\.\.\/src\/core\/vexboard-screen-lens-android-adapter\.mjs'\)/, 'the adapter loads only when a commit is opened');
  assert.match(page, /project: Adapter\.projectAndroidScreenLens, readPlan: Adapter\.adapterReadPlan/);
  assert.match(page, /Catalog\.sourceRefFromInput\(rawValue, subject\.repository\.url\)/);
  assert.match(page, /next\.set\('commit', state\.commit\.sha\)/, 'a commit link pins the resolved SHA, not a moving branch');
  assert.match(page, /if \(subject && state\.request\.mode !== 'LEGACY'\)/);
  assert.match(page, /renderNoLens\(\)/);
  assert.match(page, /Historical source is projected with the current Lens understanding/);
});

test('differences from Stable use the accepted comparison and mark without covering anything', () => {
  assert.match(page, /from '\.\.\/src\/shared\/vexboard-screen-lens-revision\.mjs'/);
  assert.match(page, /Revision\.compareScreenLensRevisions\(state\.stableLens, state\.lens\)/);
  assert.doesNotMatch(page, /stableLens\.sourceSnapshot\.commit === state\.lens\.sourceSnapshot\.commit\) return null/, 'same source commit must not hide a changed current interpretation');
  assert.match(page, /!comparison\.sourceRevisionChanged && !comparison\.projectionChanged/, 'only equal source and equal projection collapse to no delta');
  assert.match(page, /Revision\.comparePathwayRevision\(/);
  assert.match(page, /\.delta-added,\.delta-changed\{outline:2px dashed var\(--delta\);outline-offset:2px\}/);
  assert.match(page, /'Same meaning as Stable'/, 'a new commit with no projection change says so');
  assert.match(page, /aria-label': 'Differences from Stable'/);
  assert.match(page, /'Mark differences on the board'/);
  assert.match(page, /'Copy as text'/);
});

test('canvas navigation reuses the shared drag threshold and edge labels use the shared placer', () => {
  assert.match(page, /Interaction\.pointerGestureFromMovement/);
  assert.match(page, /Interaction\.cameraFromPointerDrag/);
  assert.match(page, /Layout\.layoutLensFace/);
  assert.match(board, /LensLayout\.placeLabelOnRoute/);
  assert.match(board, /relationshipRoute\(a\.bounds,b\.bounds,\{offset:laneOffset\}\)/);
  assert.match(board, /href='\.\/lens\.html'/);
});

test('existing board markers sit on borders and frame titles are never covered', () => {
  assert.match(board, /\.shape\.FRAME>\.role-marker\{display:none\}/);
  assert.match(board, /\.shape:not\(\.DIAMOND\):not\(\.FRAME\)>\.kind-marker\{bottom:-7px/);
});

// [VXG RealForever][VEXWORK][VEXBOARD][SCREEN-LENS][UI-TEST]

test('search, impact, coverage and briefs are wired from the shared query module', () => {
  assert.match(page, /from '\.\.\/src\/shared\/vexboard-screen-lens-query\.mjs'/);
  assert.match(page, /Query\.searchLens\(state\.lens, searchState\.query, \{ currentScreenRef: screenRef\(\) \}\)/);
  assert.match(page, /event\.key === '\/'\) \{ event\.preventDefault\(\); document\.getElementById\('lens-search'\)\?\.focus\(\)/);
  assert.match(page, /role: 'combobox'/);
  assert.match(page, /aria-activedescendant/);
  assert.match(page, /Query\.impactOf\(state\.lens, element\.ref\)/);
  assert.match(page, /Query\.impactOf\(state\.lens, node\.ref\)/);
  assert.match(page, /Query\.screenCoverage\(state\.lens, screen\.screenRef\)/);
  assert.match(page, /Query\.controlBrief\(state\.lens, anchor/);
  assert.match(page, /Query\.screenBrief\(state\.lens, screenRef\(\)/);
  assert.match(page, /navigator\.clipboard\?\.writeText\(text\)/);
  assert.match(page, /showBriefFallback\(title, text\)/, 'blocked clipboard falls back to selectable text');
  assert.match(page, /has no projected pathway yet/);
  assert.match(page, /deeper relationship is not currently projected/);
});
// [VXG RealForever]

test('nothing the lens adds on the surface covers a control: chips, opened overlays and the bridge', () => {
  // The browser sweep in PR #221 checks all 119 traced controls; this pins the wiring that makes it hold.
  assert.match(page, /function placeSurfaceFloaters\(\)/);
  assert.match(page, /placeSurfaceFloaters\(\);\s*drawBridge\(\);/, 'floaters settle before the bridge measures');
  assert.match(page, /dataset: \{ order \}/, 'travel chips carry an ordered list of sides to try');
  assert.match(page, /chip\.className = 'travel badge'/, 'a chip with no clear side shrinks to a corner badge');
  assert.match(page, /'dialog-zone opened'/, 'dialogs render apart from bottom sheets');
  assert.match(page, /\['', 'at-top', 'at-bottom'\]/, 'a dialog moves to the band that leaves its opener visible');
  assert.match(page, /body\.scrollTop \+= cover/, 'a sheet scrolls its opener above it');
  assert.match(page, /function bridgeExit\(/);
  assert.match(page, /if \(!crosses\(from\.midY, a\.right\)\) return direct;/, 'the bridge only detours when the side exit would cross a sibling');
});
