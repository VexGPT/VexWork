import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import * as Lens from '../src/shared/vexboard-screen-lens.mjs';

const source = JSON.parse(fs.readFileSync(new URL('./fixtures/screen-lens/debug-menu.hand.screen-lens.json', import.meta.url), 'utf8'));
const lens = Lens.normalizeScreenLens(source);
const clone = () => JSON.parse(JSON.stringify(source));

test('the Debug Menu lens normalizes and stays read-only', () => {
  assert.equal(lens.schemaVersion, Lens.SCREEN_LENS_SCHEMA);
  assert.equal(lens.entryScreenRef, 'screen.debug-menu');
  assert.equal(lens.entryElementRef, 'element.debug-menu.body.dark-mode');
  assert.ok(Object.isFrozen(lens));
  assert.ok(Object.isFrozen(lens.screens[0]));
  assert.throws(() => { lens.screens.push({}); }, TypeError);
});

test('four faces pair into two sides that flip front to back', () => {
  assert.deepEqual(Object.keys(Lens.LENS_FACES), ['SURFACE', 'STRUCTURE', 'BEHAVIOR', 'DEPTH']);
  for (const face of Object.values(Lens.LENS_FACES)) {
    const other = Lens.LENS_FACES[face.flipTo];
    assert.equal(other.flipTo, face.face);
    assert.equal(other.side, face.side);
    assert.notEqual(other.depth, face.depth);
  }
  assert.match(Lens.LENS_FACES.BEHAVIOR.question, /which semantic owner decides/);
  assert.match(Lens.LENS_FACES.DEPTH.question, /which outside truths participate/);
});

test('every role belongs to a band and carries a non-color chip', () => {
  const chips = new Set();
  for (const role of Object.values(Lens.LENS_ROLES)) {
    assert.ok(Lens.LENS_BANDS[role.band], role.role);
    assert.ok(role.chip.length > 0 && role.chip.length <= 3, role.role);
    chips.add(role.chip);
  }
  assert.equal(chips.size, Object.keys(Lens.LENS_ROLES).length, 'chips are unique so color is never the only cue');
  assert.equal(Lens.roleFor('STATE').band, 'SEMANTIC');
  assert.equal(Lens.roleFor('RESULT').band, 'RUNTIME');
  assert.equal(Lens.roleFor('REALIZATION').band, 'RUNTIME');
  assert.equal(Lens.roleFor('CONNECTION').band, 'RUNTIME');
  assert.equal(Lens.roleFor('RECEIVER').band, 'RUNTIME');
  assert.equal(Lens.roleFor('PARTNER').band, 'OUTSIDE');
  assert.equal(Lens.roleFor('SIGNAL').band, 'OUTSIDE');
  assert.notEqual(Lens.roleFor('RESULT').role, Lens.roleFor('OBSERVATION').role);
  assert.throws(() => Lens.roleFor('NOPE'), /unknown role/);
});

test('validation fails closed on broken references and vocabulary', () => {
  const cases = [
    [(lensInput) => { lensInput.schemaVersion = 'x'; }, /schemaVersion/],
    [(lensInput) => { lensInput.screens = []; }, /at least one screen/],
    [(lensInput) => { lensInput.screens[0].placement = 'SIDE'; }, /placement/],
    [(lensInput) => { lensInput.screens[0].mapped = 'MAYBE'; }, /mapped/],
    [(lensInput) => { lensInput.chrome[0].appliesTo = 'ALL'; }, /appliesTo/],
    [(lensInput) => { lensInput.screens[3].elements[1].kind = 'SLIDER'; }, /unknown element kind/],
    [(lensInput) => { lensInput.screens[3].elements[1].parentRef = 'element.nowhere'; }, /is not inside/],
    [(lensInput) => { lensInput.screens[3].elements[0].parentRef = 'element.debug-menu.body.dark-mode'; lensInput.screens[3].elements[1].parentRef = 'element.debug-menu.body'; }, /cycle/],
    [(lensInput) => { lensInput.screens[3].elements[1].pathwayRef = 'pathway.nope'; }, /is not defined/],
    [(lensInput) => { lensInput.screens[3].elements[1].navigatesTo = 'screen.nope'; }, /unknown screen/],
    [(lensInput) => { lensInput.screens[3].elements[2].ref = lensInput.screens[3].elements[1].ref; }, /duplicate ref/],
    [(lensInput) => { lensInput.pathways[0].disposition = 'MAGIC'; }, /disposition/],
    [(lensInput) => { lensInput.pathways[0].nodes[0].face = 'SURFACE'; }, /face must be/],
    [(lensInput) => { lensInput.pathways[0].nodes[0].role = 'WIDGET'; }, /unknown role/],
    [(lensInput) => { lensInput.pathways[0].nodes = lensInput.pathways[0].nodes.filter((node) => node.face === 'DEPTH'); lensInput.pathways[0].edges = []; lensInput.pathways[0].returnRef = null; }, /BEHAVIOR node/],
    [(lensInput) => { lensInput.pathways[0].edges[0].to = 'lab.events'; }, /leaves the pathway/],
    [(lensInput) => { lensInput.pathways[0].edges[0].kind = 'TELEPORT'; }, /edge kind/],
    [(lensInput) => { lensInput.pathways[0].returnRef = 'lab.events'; }, /returnRef/],
    [(lensInput) => { lensInput.annotations[0].subjectRef = 'nothing'; }, /unknown subject/],
    [(lensInput) => { lensInput.entryScreenRef = 'screen.nope'; }, /entryScreenRef/],
    [(lensInput) => { lensInput.entryElementRef = 'element.nope'; }, /entryElementRef/],
    [(lensInput) => { lensInput.title = ''; }, /title/],
  ];
  for (const [mutate, pattern] of cases) {
    const input = clone();
    mutate(input);
    assert.throws(() => Lens.normalizeScreenLens(input), pattern);
  }
  assert.throws(() => Lens.normalizeScreenLens(null), /schemaVersion/);
});

test('optional fields default cleanly', () => {
  const input = clone();
  delete input.entryScreenRef;
  delete input.entryElementRef;
  delete input.sourceSnapshot;
  delete input.chrome;
  delete input.annotations;
  for (const screen of input.screens) for (const element of screen.elements || []) if (element.navigatesTo === 'BACK') delete element.navigatesTo;
  const minimal = Lens.normalizeScreenLens(input);
  assert.equal(minimal.entryScreenRef, input.screens[0].screenRef);
  assert.equal(minimal.entryElementRef, null);
  assert.deepEqual(minimal.chrome, []);
  assert.equal(Lens.sourceUrl(minimal, 'app:x.kt'), null);
  assert.equal(Lens.sourcePath(minimal, 'app:x.kt'), 'app:x.kt');
});

test('chrome applies by placement, with always-visible controls kept on other screens', () => {
  const home = Lens.elementsForScreen(lens, 'screen.home').map((element) => element.ref);
  assert.ok(home.includes('element.shell.fab.add'));
  assert.ok(home.includes('element.navigation.events'));
  const debug = Lens.elementsForScreen(lens, 'screen.debug-menu').map((element) => element.ref);
  assert.ok(!debug.includes('element.shell.fab.add'), 'FAB is only on primary screens');
  assert.ok(debug.includes('element.shell.back'));
  assert.ok(debug.includes('element.shell.toolbar'), 'ancestors of always-visible controls stay');
  assert.ok(debug.includes('element.debug-menu.body.dark-mode'));
  assert.deepEqual(Lens.chromeForScreen(lens, 'screen.debug-menu'), []);
  assert.throws(() => Lens.screenFor(lens, 'screen.nope'), /unknown screen/);
});

test('element paths and trees follow declared containment, never pixel overlap', () => {
  const path = Lens.elementPath(lens, 'element.debug-menu.body.log-history.actions.show').map((element) => element.ref);
  assert.deepEqual(path, [
    'element.debug-menu.body',
    'element.debug-menu.body.log-history',
    'element.debug-menu.body.log-history.actions',
    'element.debug-menu.body.log-history.actions.show',
  ]);
  const roots = Lens.elementTree(Lens.screenFor(lens, 'screen.debug-menu').elements);
  assert.equal(roots.length, 1);
  assert.equal(roots[0].element.ref, 'element.debug-menu.body');
  assert.throws(() => Lens.elementPath(lens, 'element.nope'), /unknown element/);
  assert.equal(Lens.elementFor(lens, 'element.nope'), null);
});

test('a control resolves to one pathway and shared pathways list every user', () => {
  const theme = Lens.pathwayForElement(lens, 'element.debug-menu.body.dark-mode');
  assert.equal(theme.pathwayRef, 'pathway.theme-mode.select');
  assert.equal(theme.disposition, 'SCAE_FAMILY');
  assert.equal(Lens.pathwayForElement(lens, 'element.debug-menu.body.log-history'), null);
  assert.equal(Lens.pathwayForElement(lens, 'element.nope'), null);
  assert.equal(Lens.pathwayFor(lens, null), null);
  assert.equal(Lens.elementsUsingPathway(lens, 'pathway.events-lab').length, 10);
  assert.equal(Lens.elementsUsingPathway(lens, 'pathway.shell.fab-route').length, 3);
});

test('faces split a pathway and expose ports where it continues on the other face', () => {
  const theme = Lens.pathwayFor(lens, 'pathway.theme-mode.select');
  const behavior = Lens.faceGraph(theme, 'BEHAVIOR');
  const depth = Lens.faceGraph(theme, 'DEPTH');
  assert.equal(behavior.nodes.length + depth.nodes.length, theme.nodes.length);
  assert.deepEqual(behavior.portsOut.map((port) => [port.from, port.to, port.otherFace]), [['theme.effect', 'theme.method', 'DEPTH']]);
  assert.deepEqual(behavior.portsIn.map((port) => [port.from, port.to]), [['theme.observe', 'theme.state']]);
  assert.deepEqual(depth.portsIn.map((port) => port.to), ['theme.method']);
  assert.ok(behavior.edges.every((edge) => behavior.nodes.some((node) => node.ref === edge.from) && behavior.nodes.some((node) => node.ref === edge.to)));
  assert.equal(Lens.pathwayEntryRef(theme), 'theme.intent');
  assert.equal(Lens.pathwayEntryRef(null), null);
  assert.deepEqual(Lens.faceGraph(null, 'DEPTH').nodes, []);
  assert.throws(() => Lens.faceGraph(theme, 'SURFACE'), /BEHAVIOR or DEPTH/);
});

test('hiding the doorway band removes only doorway nodes and keeps the SCAE core', () => {
  const theme = Lens.pathwayFor(lens, 'pathway.theme-mode.select');
  const collapsed = Lens.faceGraph(theme, 'BEHAVIOR', { hideBands: ['DOORWAY'] });
  assert.deepEqual(collapsed.hidden.map((node) => node.ref), ['theme.intent', 'theme.runtime', 'theme.registration', 'theme.toggle']);
  assert.ok(collapsed.nodes.every((node) => Lens.roleFor(node.role).band !== 'DOORWAY'));
  assert.ok(collapsed.nodes.some((node) => node.role === 'CONTROL'));
  assert.ok(collapsed.edges.every((edge) => !collapsed.hidden.some((node) => node.ref === edge.from || node.ref === edge.to)));
  assert.deepEqual(collapsed.portsIn.map((port) => port.to), ['theme.state'], 'hidden nodes are not mistaken for other-face ports');
});

test('annotations attach to a subject instead of floating', () => {
  const notes = Lens.annotationsFor(lens, 'theme.fence');
  assert.equal(notes.length, 1);
  assert.match(notes[0].detail, /not a universal token pattern/);
  assert.deepEqual(Lens.annotationsFor(lens, 'nothing'), []);
});

test('source refs resolve to pinned repository blobs', () => {
  assert.equal(
    Lens.sourceUrl(lens, 'app:ui/ThemeMode.kt'),
    'https://github.com/vgong24/VexLife-Android/blob/305a09eac1fabebcf2241bd207386950f41121f2/app/src/main/kotlin/com/vextreme/vexlife/android/ui/ThemeMode.kt',
  );
  assert.equal(Lens.sourcePath(lens, 'arch:execution/x.kt'), 'architecture/execution/x.kt');
  assert.equal(Lens.sourcePath(lens, 'README.md'), 'README.md');
  assert.equal(Lens.sourceUrl(lens, null), null);
  assert.equal(Lens.sourcePath(lens, null), null);
});

test('the screen graph lists each screen once and keeps chrome routes as one owner with many origins', () => {
  const graph = Lens.screenGraph(lens);
  assert.equal(graph.screens.length, lens.screens.length);
  assert.equal(new Set(graph.screens.map((screen) => screen.screenRef)).size, lens.screens.length);
  const toDebug = graph.routes.filter((route) => route.toScreenRef === 'screen.debug-menu');
  assert.equal(toDebug.length, 1, 'one route, not one per primary screen');
  assert.deepEqual(toDebug[0].fromScreenRefs, ['screen.home', 'screen.events', 'screen.settings']);
  assert.equal(toDebug[0].ownerRef, 'chrome.app-shell');
  const debug = graph.screens.find((screen) => screen.screenRef === 'screen.debug-menu');
  assert.equal(debug.inboundRouteCount, 1);
  assert.equal(debug.inboundOriginCount, 3);
  assert.ok(!graph.routes.some((route) => route.toScreenRef === 'BACK'));
});

test('screen-owned routes join the map and stay distinct from chrome routes', () => {
  const input = clone();
  input.screens[3].elements.push({ ref: 'element.debug-menu.body.open-gallery', kind: 'BUTTON', label: 'Gallery', parentRef: 'element.debug-menu.body', navigatesTo: 'screen.gallery' });
  const extended = Lens.normalizeScreenLens(input);
  const graph = Lens.screenGraph(extended);
  const fromDebug = graph.routes.filter((route) => route.ownerRef === 'screen.debug-menu');
  assert.deepEqual(fromDebug.map((route) => route.fromScreenRefs), [['screen.debug-menu']]);
  const map = Lens.screenMapGraph(extended);
  assert.ok(map.nodes.some((node) => node.ref === 'screen.debug-menu' && node.kind === 'SCREEN'));
  assert.ok(map.edges.some((edge) => edge.from === 'screen.debug-menu' && edge.to === 'screen.gallery'));
  const near = Lens.screenNeighborhood(extended, 'screen.debug-menu');
  assert.ok(near.outbound.some((route) => route.toScreenRef === 'screen.gallery'));
});

test('the screen map draws chrome once and lists unreached screens separately', () => {
  const map = Lens.screenMapGraph(lens);
  assert.equal(map.nodes.filter((node) => node.kind === 'CHROME').length, 1);
  assert.match(map.nodes.find((node) => node.kind === 'CHROME').summary, /Home, Events, Settings/);
  assert.equal(new Set(map.nodes.map((node) => node.ref)).size, map.nodes.length);
  assert.deepEqual(map.unreachable, ['screen.family-conversation', 'screen.vex-maps', 'screen.vexstream-music', 'screen.talk-to-vex']);
  assert.ok(map.edges.every((edge) => edge.from === 'chrome.app-shell'));
});

test('neighborhoods report one hop in and out', () => {
  const home = Lens.screenNeighborhood(lens, 'screen.home');
  assert.ok(home.outbound.some((route) => route.toScreenRef === 'screen.debug-menu'));
  assert.ok(!home.outbound.some((route) => route.toScreenRef === 'screen.home'), 'a screen does not route to itself');
  const debug = Lens.screenNeighborhood(lens, 'screen.debug-menu');
  assert.equal(debug.outbound.length, 0);
  assert.equal(debug.inbound.length, 1);
  assert.throws(() => Lens.screenNeighborhood(lens, 'screen.nope'), /unknown screen/);
});

test('the walk keeps real history: repeats are kept, back pops, camera never appends', () => {
  let walk = Lens.createScreenWalk(lens, 'screen.home');
  assert.equal(Lens.currentWalkScreen(walk), 'screen.home');
  walk = Lens.advanceScreenWalk(lens, walk, { toScreenRef: 'screen.debug-menu', viaElementRef: 'element.debug-menu' });
  walk = Lens.advanceScreenWalk(lens, walk, { toScreenRef: 'screen.debug-menu' });
  assert.equal(walk.steps.length, 2, 'staying on the same screen is not a new step');
  walk = Lens.advanceScreenWalk(lens, walk, { toScreenRef: 'screen.home', how: 'JUMP' });
  assert.deepEqual(walk.steps.map((step) => step.screenRef), ['screen.home', 'screen.debug-menu', 'screen.home']);
  assert.equal(Lens.walkVisitCounts(walk).get('screen.home'), 2);
  walk = Lens.revisitScreenWalk(lens, walk, 2);
  assert.deepEqual(walk.steps.at(-1), { sequence: 4, screenRef: 'screen.debug-menu', viaElementRef: null, how: 'REVISIT' });
  walk = Lens.backScreenWalk(walk);
  assert.equal(walk.steps.length, 3);
  const start = Lens.createScreenWalk(lens);
  assert.equal(Lens.backScreenWalk(start), start);
  assert.equal(Lens.currentWalkScreen(start), 'screen.debug-menu');
  assert.throws(() => Lens.advanceScreenWalk(lens, walk, { toScreenRef: 'screen.home', how: 'TELEPORT' }), /NAVIGATE, JUMP or REVISIT/);
  assert.throws(() => Lens.advanceScreenWalk(lens, walk, { toScreenRef: 'screen.home', viaElementRef: 'element.nope' }), /unknown element/);
  assert.throws(() => Lens.revisitScreenWalk(lens, walk, 99), /no step 99/);
  assert.throws(() => Lens.createScreenWalk(lens, 'screen.nope'), /unknown screen/);
});

test('every pathway node points at source and the lens is pinned to one commit', () => {
  assert.match(lens.sourceSnapshot.commit, /^[0-9a-f]{40}$/);
  for (const pathway of lens.pathways) {
    for (const node of pathway.nodes) assert.ok(node.source, `${node.ref} has no source`);
  }
  for (const screen of lens.screens) assert.ok(screen.source, `${screen.screenRef} has no source`);
});

// [VXG RealForever][VEXWORK][VEXBOARD][SCREEN-LENS][MODEL-TEST]
