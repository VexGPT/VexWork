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

test('flip gestures: right-click flips either side, Shift preserves the browser menu, keys and tabs are equivalent', () => {
  assert.match(page, /addEventListener\('contextmenu', \(event\) => \{ if \(event\.shiftKey\) return; event\.preventDefault\(\); flip\(side\); \}\)/);
  assert.doesNotMatch(page, /event\.button === 1/, 'middle-click is no longer a Screen Lens flip gesture');
  assert.doesNotMatch(page, /addEventListener\('auxclick'/);
  assert.match(page, /event\.key === '\['\) \{ flip\('EXPERIENCE'\)/);
  assert.match(page, /event\.key === '\]'\) \{ flip\('BEHAVIOR'\)/);
  assert.match(page, /role: 'tab'/);
});

test('graph wheel zooms at the pointer while drag remains the pan gesture', () => {
  assert.match(page, /addEventListener\('wheel'/);
  assert.match(page, /const delta = Math\.abs\(event\.deltaY\) >= Math\.abs\(event\.deltaX\) \? event\.deltaY : event\.deltaX/);
  assert.match(page, /zoomFace\(face, Math\.exp\(-delta \* 0\.0022\), \{ x: event\.clientX - rect\.left, y: event\.clientY - rect\.top \}\)/);
  assert.doesNotMatch(page, /camera\.x - dx/);
  assert.match(page, /Drag to pan\. Scroll to zoom at the pointer/);
});

test('graph cards reserve and expose up to three title and summary lines', () => {
  assert.match(page, /\.lnode \.lbl\{[^}]*-webkit-line-clamp:3/);
  assert.match(page, /\.lnode \.sum\{[^}]*-webkit-line-clamp:3/);
  assert.match(page, /\.lnode \.lbl\{[^}]*flex-shrink:0/);
  assert.match(page, /\.lnode \.sum\{[^}]*flex-shrink:0/);
  assert.match(page, /class: 'lbl', title: node\.label/);
  assert.match(page, /class: 'sum', title: node\.summary/);
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
  assert.match(page, /role-RESULT/);
  assert.match(page, /role-REALIZATION/);
  assert.match(page, /role-CONNECTION/);
  assert.match(page, /role-CONVERSION/);
  assert.match(page, /role-DECODER/);
  assert.match(page, /role-RECEIVER/);
  assert.match(page, /role-PARTNER/);
  assert.match(page, /role-SOURCE/);
  assert.match(page, /role-SIGNAL/);
  assert.match(page, /PARTNER_CIRCUIT: 'Partner circuit'/);
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

test('the Lens derives expressions from source realization for every Screen', () => {
  assert.match(page, /from '\.\.\/src\/shared\/vexboard-screen-lens-realization\.mjs'/);
  assert.match(page, /from '\.\.\/src\/shared\/vexboard-screen-lens-source-expressions\.mjs'/);
  assert.match(page, /Expressions\.expressionsFor\(state\.lens, screenRef\(\)\)/);
  assert.match(page, /Realization\.emptyRealizationContext\(\)/);
  assert.match(page, /const currentPathway = \(\) => Lens\.pathwayFor\(state\.lens, state\.pathwayRef\) \?\? \(state\.anchorElementRef \? null : expressionPathway\(\)\)/);
  assert.doesNotMatch(page, /EXPRESSION_FIXTURE_URLS|expressionFixtureSources|normalizeScreenLensExpressionFixture|bindExpressionsForCurrentScreen/);
});

test('source-derived expressions are an unconditional top-level Lens dimension', () => {
  assert.match(page, /grid-template-rows:auto auto auto minmax\(0,1fr\) auto/, 'the expression rail owns one top-level row');
  assert.match(page, /root\.append\(renderBar\(\), renderAtlas\(\), renderExpressionRail\(\), main, renderTray\(\)\)/, 'every Screen receives a source expression rail, so main never falls into an auto row');
  assert.doesNotMatch(page, /const expressionRail = renderExpressionRail\(\);\s*if \(expressionRail\)/, 'the rail is not conditional on a two-Screen fixture registry');
  assert.match(page, /function renderPhone\(expression, \{ interactive \}\)/);
  assert.match(page, /function renderStructure\(\)[\s\S]*const expression = activeExpression\(\)/);
  assert.match(page, /pathway\.disposition === 'EXPRESSION'/, 'Behavior and Depth read the same expression relationship');
  assert.match(page, /next\.set\('expression', expression\.ref\)/, 'shareable expression coordinates remain URL state, not product State');
  assert.doesNotMatch(page, /localStorage\.setItem\([^)]*expression/i);
});

test('Surface realizes source-authored presentation rather than flattening it into inventory rows', () => {
  assert.match(page, /function presenceFor\(context\)/);
  assert.match(page, /Realization\.resolvePresence\(state\.lens, screenRef\(\), context\)/);
  assert.match(page, /function renderPopulation\(/);
  assert.match(page, /function renderTemplateItem\(/);
  assert.match(page, /class: 'region-fab'/);
  assert.match(page, /class: 'dep-stub'/);
  assert.match(page, /class: 't-card'/);
  assert.match(page, /Examples & journeys/);
  assert.match(page, /screen\.elements\.filter\(\(element\) => element\.slot === 'TOOLBAR'\)/);
});

test('expression carousel preserves the lived desktop and phone-width interaction shape', () => {
  assert.match(page, /class: 'xslot'/);
  assert.match(page, /class: `xpeek \$\{side\} kind-\$\{expression\.kind\}`/);
  assert.match(page, /renderPhone\(expression, \{ interactive: false \}\)/);
  assert.match(page, /function wireSwipe\(surface\)/);
  assert.match(page, /Math\.abs\(dx\) > 70/);
  assert.match(page, /event\.key === 'ArrowRight' \|\| event\.key === 'ArrowLeft'/);
  assert.match(page, /@media \(max-width:900px\)[\s\S]*\.xpeek\{display:none\}/, 'phone width hides neighbour phones');
  assert.match(page, /function exposeElement\(ref\)/, 'Structure can resolve an element to the expression that exposes it');
  assert.match(page, /ondblclick: \(\) => \(element\.navigatesTo \? travel\(element\) : exposeElement\(element\.ref\)\)/, 'Structure double-click traverses to that source-derived expression');
});

test('expression stepping animates the whole three-card carousel handoff instead of teleporting neighbours', () => {
  assert.match(page, /--x-shift:356px/);
  assert.match(page, /@keyframes x-center-from-next/);
  assert.match(page, /@keyframes x-center-to-prev/);
  assert.match(page, /@keyframes x-center-to-next/);
  assert.match(page, /@keyframes x-outer-from-next/);
  assert.match(page, /@keyframes x-outer-from-prev/);
  assert.match(page, /\.xstage\.enter-next \.xpeek\.prev\{animation:x-center-to-prev/);
  assert.match(page, /\.xstage\.enter-prev \.xpeek\.next\{animation:x-center-to-next/);
  assert.match(page, /prefers-reduced-motion:reduce\)[\s\S]*\.xstage \.xpeek/);
  assert.doesNotMatch(page, /translateX\(64px\)/, 'the old center-only nudge is gone');
});

test('screen travel resets presentation context without inventing cross-Screen State', () => {
  assert.match(page, /function travel\([\s\S]*state\.realization = Realization\.emptyRealizationContext\(\);[\s\S]*render\(\);/);
  assert.match(page, /function jumpTo\([\s\S]*state\.realization = Realization\.emptyRealizationContext\(\);[\s\S]*render\(\);/);
  assert.match(page, /const requestedExpression = params\.get\('expression'\) \?\? \(params\.get\('example'\) \? `expression:\$\{params\.get\('example'\)\}` : null\)/);
  assert.match(page, /Expressions\.expressionFor\(Expressions\.expressionsFor\(state\.lens, screenRef\(\)\), requestedExpression\)/);
});

// [VXG RealForever]


test('lived usability gives the inspector a resizable attention boundary and makes expressions searchable', () => {
  assert.match(page, /trayHeight: Math\.round\(Math\.min\(280, Math\.max\(180, window\.innerHeight \* 0\.24\)\)\)/);
  assert.match(page, /function wireTrayResize\(handle, tray\)/);
  assert.match(page, /role: 'separator'/);
  assert.match(page, /'aria-label': 'Resize inspector'/);
  assert.match(page, /drag\.height \+ drag\.y - event\.clientY/);
  assert.match(page, /event\.key === 'ArrowUp'/);
  assert.match(page, /event\.key === 'ArrowDown'/);
  assert.doesNotMatch(page, /trayCollapsed|Details ▴|Details ▾/, 'the inspector is resized rather than opened or closed');
  assert.match(page, /function renderExpressionFinder\(list\)/);
  assert.match(page, /placeholder: 'Find expression…'/);
  assert.match(page, /function expressionSearchText\(expression\)/);
  assert.match(page, /renderExpressionFinder\(list\)/);
});

test('selected controls preview the screen or expression they lead to before traversal', () => {
  assert.match(page, /function destinationForElement\(element\)/);
  assert.match(page, /function expressionTargetForElement\(ref\)/);
  assert.match(page, /Expressions\.expressionForControl\(state\.lens, screenRef\(\), list, ref\)/);
  assert.match(page, /Follow → \$\{destination\.title\}/);
  assert.match(page, /Show \$\{expression\.where\} · \$\{truncate\(expression\.what, 34\)\}/);
  assert.match(page, /destination\.go\(\)/);
});

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
