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

test('the Lens binds accepted expression fixtures by current Screen across navigation', () => {
  assert.match(page, /const EXPRESSION_FIXTURE_URLS = Object\.freeze\(\{/);
  assert.match(page, /'screen\.vexstream-music': '\.\.\/projects\/vexboard\/examples\/vexlife-android-vexstream\.screen-lens-expressions\.fixture\.json'/);
  assert.match(page, /'screen\.events': '\.\.\/projects\/vexboard\/examples\/vexlife-android-events\.screen-lens-expressions\.fixture\.json'/);
  assert.match(page, /function bindExpressionsForCurrentScreen\(\{ requestedRef = state\.expressionRef \} = \{\}\)/);
  assert.match(page, /const source = expressionFixtureSources\.get\(screenRef\(\)\) \?\? null/);
  assert.match(page, /source\.lensRef !== state\.lens\.lensRef \|\| source\.lensSourceCommit !== state\.lens\.sourceSnapshot\.commit\) return/);
  assert.match(page, /function travel\([\s\S]*?bindExpressionsForCurrentScreen\(\{ requestedRef: null \}\);\s*resetScreenSelection\(\)/);
  assert.match(page, /function jumpTo\([\s\S]*?bindExpressionsForCurrentScreen\(\{ requestedRef: null \}\);\s*resetScreenSelection\(\)/);
  assert.match(page, /const changesScreen = Boolean\(target\.screenRef && target\.screenRef !== screenRef\(\)\)/);
  assert.match(page, /if \(changesScreen\)[\s\S]*?bindExpressionsForCurrentScreen\(\{ requestedRef: null \}\)/);
  assert.match(page, /Lens\.backScreenWalk\(state\.walk\); bindExpressionsForCurrentScreen\(\{ requestedRef: null \}\); resetScreenSelection\(\)/);
  assert.match(page, /Lens\.revisitScreenWalk\([\s\S]*?bindExpressionsForCurrentScreen\(\{ requestedRef: null \}\); resetScreenSelection\(\)/);
  assert.match(page, /bindExpressionsForCurrentScreen\(\{ requestedRef: requestedExpression \}\);\s*if \(expressionAvailable\(\)\) setExpression/, 'direct screen entry binds its own fixture before expression activation');
});

test('source-backed expressions are a top-level Lens dimension shared by all four faces', () => {
  assert.match(page, /from '\.\.\/src\/shared\/vexboard-screen-lens-expressions\.mjs'/);
  assert.match(page, /vexlife-android-vexstream\.screen-lens-expressions\.fixture\.json/);
  assert.match(page, /Expressions\.normalizeScreenLensExpressionFixture\(state\.lens, source\)/);
  assert.match(page, /Expressions\.resolveScreenLensExpression\(state\.lens, state\.expressionFixture, expressionRef\)/);
  assert.match(page, /grid-template-rows:auto auto auto minmax\(0,1fr\) auto/, 'Expressions owns its own top-level Lens row');
  assert.match(page, /const main = h\('main', \{ class: 'main' \}, renderExperienceSide\(\), renderBehaviorSide\(\)\)/);
  assert.match(page, /const expressionRail = renderExpressionRail\(\);\s*if \(expressionRail\) root\.append\(expressionRail\);\s*root\.append\(main, renderTray\(\)\)/);
  assert.match(page, /aria-label': `Expressions of \$\{currentScreen\(\)\.label\}`/);
  assert.match(page, /'Previous expression'/);
  assert.match(page, /'Next expression'/);
  assert.match(page, /state\.pathwayRef = pathwayRef/, 'expression pathways still reuse the existing Behavior\/Depth pathway owner');
  assert.match(page, /class: 'xstruct'/, 'Structure receives the same expression context');
  assert.match(page, /class: 'xgraph-context'/, 'Behavior and Depth receive the same expression context');
  assert.match(page, /aria-label': 'Expression pathways'/, 'pathway choice is local to the graph side rather than cluttering the rail');
  assert.match(page, /next\.set\('expression', state\.expressionRef\)/, 'expression coordinates remain shareable without becoming stored app state');
  assert.doesNotMatch(page, /localStorage\.setItem\([^)]*expression/i);
  assert.doesNotMatch(page, /BoardScenario|scenario state/i, 'the read-only expression experience does not import Scenario ownership');
});

test('Surface restores the expression carousel instead of treating the rail as a dashboard card', () => {
  assert.match(page, /function renderPhone\(expressionRef = state\.expressionRef/);
  assert.match(page, /class: 'xslot'/, 'the active expression owns the centered phone');
  assert.match(page, /class: `xpeek \$\{side\}`/, 'adjacent expressions render as inert phone peeks');
  assert.match(page, /renderPhone\(entry\.expressionRef, \{ interactive: false \}\)/);
  assert.match(page, /phone\.inert = true/);
  assert.match(page, /function wireExpressionSwipe\(surface\)/);
  assert.match(page, /Math\.abs\(dx\) > 70/);
  assert.match(page, /event\.key === 'ArrowLeft'/);
  assert.match(page, /event\.key === 'ArrowRight'/);
  assert.match(page, /@media \(max-width:900px\)[\s\S]*\.xchip\{display:none\}[\s\S]*\.xchip\[aria-pressed="true"\]\{display:inline-flex/, 'phone width collapses the rail to the active expression instead of wrapping every chip');
  assert.match(page, /@media \(max-width:900px\)[\s\S]*\.xpeek\{display:none\}/, 'phone width hides neighbours rather than creating horizontal page scroll');
  assert.match(page, /Double-click to show expression:/, 'an element can jump to an expression that exposes it');
});

test('expression participation stays additive even while the carousel makes the active context perceptually dominant', () => {
  assert.match(page, /else if \(resolution && element\.ownerRef === screenRef\(\)\) node\.classList\.add\('x-unclaimed'\)/);
  assert.match(page, /\.x-unclaimed\{opacity:\.34;filter:saturate\(\.55\)\}/);
  assert.doesNotMatch(page, /filter\([^\n]*expressionElementParticipates/, 'the registered Screen tree is never filtered into a second visibility owner');
  assert.match(page, /source\.lensSourceCommit !== state\.lens\.sourceSnapshot\.commit\) return;/, 'the fixture fails closed on a different Lens source snapshot');
  assert.match(page, /runtime identity, not a static Screen element/);
});

test('screen-level arrival activates the selected expression across Behavior and Depth without overriding explicit targets', () => {
  assert.match(page, /function resetScreenSelection\(\{ preferExpression = true \} = \{\}\)/);
  assert.match(page, /preferExpression && expressionAvailable\(\) && state\.expressionRef/);
  assert.match(page, /setExpression\(state\.expressionRef, \{ renderNow: false \}\)/);
  assert.match(page, /function travel\([\s\S]*?resetScreenSelection\(\);[\s\S]*?render\(\);/);
  assert.match(page, /function jumpTo\([\s\S]*?resetScreenSelection\(\);[\s\S]*?state\.overlay = null;/);
  assert.match(page, /Lens\.backScreenWalk\(state\.walk\); resetScreenSelection\(\); render\(\);/);
  assert.match(page, /Lens\.revisitScreenWalk\(state\.lens, state\.walk, step\.sequence\); resetScreenSelection\(\); render\(\);/);
  assert.match(page, /const explicitTarget = Boolean\(target\.elementRef \|\| target\.pathwayRef \|\| target\.nodeRef\)/);
  assert.match(page, /if \(!explicitTarget\) resetScreenSelection\(\)/, 'screen-only search results use expression context, while explicit control/pathway results retain their own coordinate');
  assert.match(page, /await bindExpressionsForLens\(\{ requestedRef: requestedExpression \}\);\s*if \(expressionAvailable\(\)\) setExpression\(state\.expressionRef, \{ renderNow: false \}\);/, 'direct screen entry activates the expression pathway even without an explicit expression query parameter');
});

test('changing expressions focuses Behavior and Depth from explicit relationship order, not JSON assignment key order', () => {
  assert.match(page, /function preferredExpressionPathway\(expressionRef\)/);
  assert.match(page, /expression\.relationshipRefs\s*\.filter\(\(relationshipRef\) => Object\.hasOwn\(expression\.assignments, relationshipRef\)\)\s*\.reverse\(\)/);
  assert.doesNotMatch(page, /Object\.entries\(expression\.assignments\)/, 'JSON object key insertion order is not a semantic priority contract');
  assert.match(page, /const valueRef = expression\.assignments\[relationshipRef\]/);
  assert.match(page, /const pathwayRef = value\?\.pathwayRefs\?\.\[0\] \?\? null/);
  assert.match(page, /const changedExpression = state\.expressionRef !== expressionRef/);
  assert.match(page, /const preserveCurrent = !changedExpression && paths\.includes\(state\.expressionPathwayRef\)/, 'a user-selected pathway is preserved only while staying within the same expression');
  assert.match(page, /preserveCurrent \? state\.expressionPathwayRef : preferredExpressionPathway\(expressionRef\)/);
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
