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


test('project switching supports Product-exported and legacy experiment lenses without introducing a Product-specific renderer', () => {
  assert.match(page, /subject\.lens\.exportedLens/);
  assert.match(page, /Source\.readExportedLensCommit/);
  assert.match(page, /Catalog\.bindLensBuildSource/);
  assert.match(page, /loadBuildLens\(subject, build\)/);
  assert.match(page, /Builds and source projections/);
  assert.match(page, /function catalogSubjectForCurrentLens\(\)/, 'a legacy experiment can still inherit its catalog project identity');
  assert.match(page, /snapshot\?\.repositoryRef && subject\.repositoryRef === snapshot\.repositoryRef/);
  assert.match(page, /requestSubject \? renderBuildSwitch\(requestSubject\) : null/, 'legacy experiments show project chrome without impersonating Stable or Main');
  assert.doesNotMatch(page, /projectVexLifeProd|vexlife-prod.*adapter/i);
});

// [VXG RealForever][VEXWORK][VEXBOARD][SCREEN-LENS][UI-TEST]

test('Product-authored color mode is one shareable read-only Presentation axis', () => {
  assert.match(page, /colorModes: new Map\(\)/, 'presentation choice stays browser-local in Lens state');
  assert.match(page, /function renderColorModeSwitch\(\)/);
  assert.match(page, /view\?\.colorMode/);
  assert.match(page, /'aria-label': 'Product color mode'/);
  assert.match(page, /h\('span', \{ class: 'mode-label' \}, 'Appearance'\)/);
  assert.match(page, /function applyStaticColorMode\(doc, view\)/);
  assert.match(page, /doc\.documentElement\.removeAttribute\(colorMode\.attribute\)/, 'System removes the authored override');
  assert.match(page, /doc\.documentElement\.setAttribute\(colorMode\.attribute, option\.attributeValue\)/, 'Light\/Dark use only the Product-declared root attribute');
  assert.match(page, /function setStaticColorMode\(ref\)[\s\S]*\.current-product-view \.product-view-frame[\s\S]*applyStaticColorMode\(doc, view\)/, 'mode changes update the mounted inert Product instead of remounting it');
  assert.match(page, /next\.set\('presentation', colorMode\.ref\)/, 'an exact lived presentation is shareable');
  assert.match(page, /params\.get\('presentation'\)/, 'a shared presentation coordinate is restored on boot');
  assert.match(page, /staticViewDocument\(view\)[\s\S]*rootAttribute[\s\S]*option\.attributeValue/, 'the exact mode is present on first paint, before Product JavaScript could exist');
  assert.doesNotMatch(page, /vexlife-prod\.presentation\.theme/, 'generic VexWork never copies a Product storage key');
  assert.doesNotMatch(page, /subject\.slug[^\n]{0,120}colorMode|colorMode[^\n]{0,120}subject\.slug/i, 'presentation projection is selected from source facts, never a Product slug');
});
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
  assert.match(page, /function projectedRelationshipForAnchor\(\)/);
  assert.match(page, /graph\?\.nodes\.some\(\(node\) => node\.elementRef === state\.anchorElementRef\)/);
  assert.match(page, /const currentPathway = \(\) => Lens\.pathwayFor\(state\.lens, state\.pathwayRef\) \?\? projectedRelationshipForAnchor\(\)/);
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
  assert.match(page, /class: `xslot\$\{wide \? ' wide' : ''\}`/);
  assert.match(page, /class: `xpeek \$\{side\} kind-\$\{expression\.kind\}`/);
  assert.match(page, /renderScreenSurface\(expression, \{ interactive: false \}\)/);
  assert.match(page, /const renderScreenSurface = \(expression, options\) => \(currentScreen\(\)\.view \? renderStaticView\(expression, options\) : currentScreen\(\)\.layout \? renderWorkspace\(expression, options\) : renderPhone\(expression, options\)\)/, 'a screen without a static view or layout keeps the phone carousel');
  assert.match(page, /function wireSwipe\(surface\)/);
  assert.match(page, /Math\.abs\(dx\) > 70/);
  assert.match(page, /event\.key === 'ArrowRight' \|\| event\.key === 'ArrowLeft'/);
  assert.match(page, /@media \(max-width:900px\)[\s\S]*\.xpeek\{display:none\}/, 'phone width hides neighbour phones');
  assert.match(page, /function exposeElement\(ref\)/, 'Structure can resolve an element to the expression that exposes it');
  assert.match(page, /ondblclick: \(\) => \(element\.navigatesTo \? travel\(element\) : exposeElement\(element\.ref\)\)/, 'Structure double-click traverses to that source-derived expression');
});

test('Structure keeps a real scroll boundary and viewport continuity while bridge geometry follows it', () => {
  assert.match(page, /\.structure\{flex:1;min-height:0;overflow:auto;overscroll-behavior:contain;touch-action:pan-y;/);
  assert.match(page, /const kept = \{ phone: .* structure: document\.querySelector\('\.face\[data-face="STRUCTURE"\] \.structure'\)\?\.scrollTop \?\? 0 \}/);
  assert.match(page, /if \(structure\) structure\.scrollTop = kept\.structure;/);
  assert.match(page, /function replaceStructureFacePreservingViewport\(experience\)/);
  assert.match(page, /const scrollTop = oldStructure\.querySelector\('\.structure'\)\?\.scrollTop \?\? 0;/);
  assert.match(page, /nextScroller\.scrollTop = scrollTop;/, 'mounted-Product inspection/presence refresh keeps the same Structure viewport');
  assert.match(page, /function bridgeRelationship\(\)/, 'bridge relationship identity is resolved separately from its current geometry');
  assert.match(page, /function drawBridge\(relationship = bridgeRelationship\(\)\)/);
  assert.match(page, /const scheduleBridge = \(\) => \{[\s\S]*if \(bridgeFrame\) return;[\s\S]*bridgeFrame = requestAnimationFrame\(\(\) => \{[\s\S]*bridgeFrame = 0;[\s\S]*drawBridge\(\);/, 'scroll-driven bridge observation coalesces to one continuous animation-frame update');
  assert.doesNotMatch(page, /cancelAnimationFrame\(bridgeFrame\)/, 'scroll observation does not repeatedly cancel/restart the pending bridge frame');
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

test('selected controls preview and visibly support the screen or expression they lead to before traversal', () => {
  assert.match(page, /function destinationForElement\(element\)/);
  assert.match(page, /function expressionTargetForElement\(ref\)/);
  assert.match(page, /Expressions\.expressionForControl\(state\.lens, screenRef\(\), list, ref\)/);
  assert.match(page, /Follow → \$\{destination\.title\}/);
  assert.match(page, /Show \$\{expression\.where\} · \$\{truncate\(expression\.what, 34\)\}/);
  assert.match(page, /function refreshStaticViewTravelBadge\(doc, view\)/);
  assert.match(page, /badge\.textContent = 'Go'/, 'static Product destinations use the same compact Go affordance as the Android Surface');
  assert.match(page, /badge\.addEventListener\('click',[\s\S]*destination\.go\(\)/);
  assert.match(page, /targetElement\?\.closest\('\.vexboard-lens-travel'\)\) return;/, 'the iframe inspection interceptor yields to the Lens-owned Go support control');
  assert.match(page, /data-vex-lens-has-selection/, 'static Product selection gets a VexBoard support-layer focus treatment');
  assert.match(page, /function renderStaticViewActions\(\)[\s\S]*return splitBinding \|\| toggleBinding/, 'detached Product actions remain only for spatial/toggle affordances');
  assert.doesNotMatch(page, /class: 'tool product-view-travel'/, 'destination travel is attached to the selected Product control instead of a detached corner action');
});

test('static Product support layers keep selected identity and bridge geometry visible across the iframe boundary', () => {
  assert.match(page, /function staticProductVisibleRect\(leftFace, ref\)/);
  assert.match(page, /frameBox\.left \+ nodeBox\.left/);
  assert.match(page, /function surfaceVisibleRect\(leftFace, ref\)/);
  assert.match(page, /const from = surfaceVisibleRect\(leftFace, anchorRef\)/, 'the causal bridge can originate at the selected Product control inside the iframe');
  assert.match(page, /doc\.addEventListener\('scroll', scheduleBridge, \{ capture: true, passive: true \}\)/, 'Product-local scrolling keeps bridge geometry current');
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

test('a source-owned static view is mounted generically and bound through stable Product identities', () => {
  assert.match(page, /function renderStaticView\(expression, \{ interactive \}\)/);
  assert.match(page, /function staticViewDocument\(view\)/);
  assert.match(page, /scriptPolicy must be NONE|no Product JavaScript/);
  assert.match(page, /sandbox: 'allow-same-origin'/);
  assert.doesNotMatch(page, /sandbox: 'allow-same-origin allow-scripts'/);
  assert.match(page, /doc\.addEventListener\('contextmenu',[\s\S]*flip\('EXPERIENCE'\)/, 'right-click inside a Product iframe flips the same Experience side');
  assert.match(page, /if \(event\.shiftKey\) return;/, 'Shift-right-click keeps the native browser escape hatch');
  assert.match(page, /view\.anchors\.elementAttribute/);
  assert.match(page, /view\.anchors\.structuralAttribute/);
  assert.match(page, /view\.anchors\.structuralParentAttribute/);
  assert.match(page, /staticViewNodes\(doc, view, marks\.selected, \{ includeStructuralParents: true \}\)/);
  assert.match(page, /data-vex-product-style/, 'the Product stylesheet is distinguishable from Lens inspection CSS');
  assert.match(page, /function staticViewStyleRules\(doc\)/);
  assert.match(page, /function staticViewPresentationRules\(doc, view, ref\)/);
  assert.match(page, /function applyStaticViewStateBindings\(doc, view, resolved\)/, 'Product-authored state bindings realize source-derived presentation without Product-specific VexWork logic');
  assert.match(page, /resolved\?\.presence\?\.get\(binding\.presenceRef\)/);
  assert.match(page, /operation\.op === 'SET_ATTRIBUTE'/);
  assert.match(page, /function renderStaticSplitControl\(binding\)/, 'a selected split handle gets a discoverable Product-spatial phase control');
  assert.match(page, /Browser-local spatial projection; Product state is unchanged/);
  assert.match(page, /function bindStaticSplitInteractions\(doc, view\)/);
  assert.match(page, /handle\.addEventListener\('pointermove'/, 'the real Product handle can be dragged');
  assert.match(page, /function refreshStaticSelectionInPlace\(\)/, 'selection can update the Lens around a mounted Product without recreating its iframe');
  assert.match(page, /function setStaticPresenceOutcome\(presenceRef, outcome\)/, 'source-derived Product selection/presentation changes can update the mounted Product in place');
  assert.match(page, /function bindStaticSelectInteractions\(doc, view\)/);
  assert.match(page, /select\.addEventListener\('change'/, 'native Product selects drive source-derived presence');
  assert.match(page, /function renderStaticToggleControl\(binding\)/, 'Product presentation toggles get an explicit Open/Close affordance');
  assert.match(page, /binding\.kind === 'TOGGLE' && binding\.elementRef === ref/, 'double-click can follow a Product-authored toggle relationship');
  assert.match(page, /if \(!refreshStaticSelectionInPlace\(\)\) render\(\);/, 'element selection falls back to full render only when no static Product view is mounted');
  assert.match(page, /current-product-view/, 'the interactive Product manifestation has a stable host for in-place selection updates');
  assert.match(page, /function refreshStaticViewInspectionMarks\(doc, view\)/);
  assert.match(page, /oldBehavior\.replaceWith\(renderBehaviorSide\(\)\)/);
  assert.match(page, /oldTray\.replaceWith\(renderTray\(\)\)/);
  assert.match(page, /target\.style\.setProperty\(binding\.styleProperty/, 'dragging writes only the Product-exported CSS custom property');
  assert.match(page, /function setStaticSplitPhase\(binding, phase\)[\s\S]*applyStaticSplitProjection\(doc, currentScreen\(\)\.view, binding\)/, 'split phase changes mutate the mounted Product presentation in place');
  assert.match(page, /target\.setAttribute\(binding\.collapsedAttribute, binding\.collapsedAfterValue\)/);
  assert.match(page, /target\.setAttribute\(binding\.collapsedAttribute, binding\.collapsedBeforeValue\)/);
  assert.match(page, /candidate\.node\.matches\(rule\.selector\)/, 'CSS relationships come from browser selector matching');
  assert.match(page, /declarations: rule\.style\.cssText/, 'the Product rule block stays inspectable without becoming VexBoard rendering authority');
  assert.match(page, /h\('h3', \{\}, 'Presentation rules'\)/);
  assert.match(page, /The browser, not VexBoard, applies them/);
  assert.match(page, /currentScreen\(\)\.view \? renderStaticView\(expression, options\)/);
  assert.doesNotMatch(page, /vexlife-prod[^\n]{0,100}renderStaticView|renderStaticView[^\n]{0,100}vexlife-prod/i, 'static view projection stays subject-agnostic');
});

test('a screen whose source authors a frame layout is drawn as a workspace, chosen from layout facts only', () => {
  assert.match(page, /from '\.\.\/src\/shared\/vexboard-screen-lens-frames\.mjs'/);
  assert.match(page, /function renderWorkspace\(expression, \{ interactive \}\)/);
  assert.match(page, /const geometry = Frames\.frameGeometry\(frame\)/, 'regions, seams and handles sit where the layout puts them');
  assert.doesNotMatch(page, /slug === 'vexlife-prod'|subject\.slug === ['"]vexlife/, 'no subject-name special case selects the realization');
  // Every drawn frame, region, seam, handle and overlay is a Lens element: selectable and inspectable.
  for (const marked of [/markElement\(line, elementOf\(seam\.ref\), marks\)/, /markElement\(handle, element, marks\)/, /markElement\(layer, element, marks\)/, /markElement\(node, elementOf\(frame\.ref\), marks\)/]) assert.match(page, marked);
  // Each region scrolls on its own; a band far wider than tall lays its controls along its length.
  assert.match(page, /class: `ws-scroll\$\{inline \? ' inline' : ''\}`/);
  assert.match(page, /\.main\.wide\{grid-template-columns:minmax\(0,1\.6fr\) minmax\(0,1fr\)\}/);
  assert.match(page, /\.workspace \.ws-region\{position:absolute/, 'region placement outranks the generic [data-ref] positioning');
  assert.match(page, /function spatialBlock\(element\)/, 'the inspector says where a frame, seam, region or handle sits');
  assert.match(page, /\['Touched by', element\.interactions/);
  assert.match(page, /if \(child\.element\.slot === 'Overlay'\) continue;/, 'source-authored floating presentation does not flatten into region flow');
  assert.match(page, /const isPresented = \(ref\) =>/, 'workspace overlays honor the same realization presence as the phone renderer');
  assert.match(page, /if \(!drawnChildren\.length && presence\) continue;/, 'closed structural overlay roots disappear from the Surface');
  assert.match(page, /element\.slot === 'Overlay'[\s\S]*!layoutChromeRefs\.has\(element\.ref\)[\s\S]*!withinOverlayRoot\(element\.ref\)/, 'floating content overlays remain distinct from seam chrome and surface overlay roots');
  assert.match(page, /element\.kind === 'DIALOG' \|\| element\.layer === 'MODAL'/, 'modal source presentation receives a workspace-modal realization');
  assert.doesNotMatch(page, /vexlife-prod[^\n]{0,80}ws-float|ws-float[^\n]{0,80}vexlife-prod/, 'floating presentation stays generic rather than Product-special-cased');
});


test('browser and mouse Back/Forward revisit meaningful Lens viewpoints', () => {
  assert.match(page, /LENS_HISTORY_SCHEMA = 'vexboard\.screen-lens-history\/v1'/);
  assert.match(page, /function lensHistorySnapshot\(\)/);
  assert.match(page, /walk: state\.walk/);
  assert.match(page, /selected: state\.selected/);
  assert.match(page, /realization: state\.realization/);
  assert.match(page, /colorModeRef: staticColorMode\(\)\?\.ref/);
  assert.match(page, /function markLensHistoryPoint\(\)/);
  assert.match(page, /history\.pushState\(\{ \[LENS_HISTORY_KEY\]: snapshot \}/);
  assert.match(page, /history\.replaceState\(\{ \[LENS_HISTORY_KEY\]: snapshot \}/);
  assert.match(page, /window\.addEventListener\('popstate'/);
  assert.match(page, /restoreLensHistory\(snapshot\)/);
  assert.match(page, /function selectElement\([\s\S]*markLensHistoryPoint\(\)/, 'control selection is navigable history');
  assert.match(page, /function selectNode\([\s\S]*markLensHistoryPoint\(\)/, 'pathway-step selection is navigable history');
  assert.match(page, /function setExpression\([\s\S]*markLensHistoryPoint\(\)/, 'expression traversal is navigable history');
  assert.match(page, /function setStaticPresenceOutcome\([\s\S]*markLensHistoryPoint\(\)/, 'Product selection/presentation traversal is navigable history');
  assert.match(page, /function setStaticColorMode\([\s\S]*markLensHistoryPoint\(\)/, 'presentation changes are navigable history');
  assert.match(page, /selectElement\(requested, \{ recordHistory: false \}\)/, 'opening a shared link seeds rather than duplicates history');
  assert.doesNotMatch(page, /event\.button\s*===\s*[34]/, 'mouse side buttons use normal browser History semantics rather than vendor-specific interception');
  assert.match(page, /Browser or mouse Back \/ Forward revisits the Lens choices you traversed/);
});


test('static state consequences ignore gated-off inner presentation values', () => {
  assert.match(page, /if \(outcome\?\.gate === false \|\| String\(outcome\?\.value \?\? ''\) !== binding\.value\) continue;/);
  assert.match(page, /Gated-off relationships have no manifestation consequences/);
});


test('selected identities recurse into their active projected realization relationship when no semantic pathway exists', () => {
  assert.match(page, /function projectedRelationshipForAnchor\(\)/);
  assert.match(page, /graph\?\.nodes\.some\(\(node\) => node\.elementRef === state\.anchorElementRef\)/);
  assert.match(page, /Lens\.pathwayFor\(state\.lens, state\.pathwayRef\) \?\? projectedRelationshipForAnchor\(\)/);
  assert.match(page, /Reuse that already-derived expression graph only when it actually contains the selected identity/);
});
