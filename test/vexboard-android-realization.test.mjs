import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  PRESENCE_KINDS,
  composableIndex,
  parseKotlinBlock,
  primitiveCatalog,
  realizeScreen,
  semanticRootsOf,
  stringConstants,
} from '../src/core/vexboard-android-realization.mjs';
import { normalizeScreenLens } from '../src/shared/vexboard-screen-lens.mjs';

// A miniature elements module: the reader must learn each primitive's relationship from its own
// parameter names, never from a hard-coded list.
const PRIMITIVES = `
package x.elements
@Composable fun VexText(element: TextElement, modifier: Modifier = VexModifier) {}
@Composable fun VexText(id: String, text: String, modifier: Modifier = VexModifier) {}
@Composable fun VexButton(element: ButtonElement, handler: ElementActionHandler) {}
@Composable fun VexIconButton(element: ButtonElement, handler: ElementActionHandler, semanticRef: String? = null) {}
@Composable fun VexBox(id: String, modifier: Modifier = VexModifier, content: @Composable BoxScope.() -> Unit) {}
@Composable fun VexColumn(id: String, content: @Composable ColumnScope.() -> Unit) {}
@Composable fun VexContainer(element: UIElement, content: @Composable ColumnScope.() -> Unit) {}
@Composable fun VexModalBottomSheet(element: ModalBottomSheetElement, onDismiss: () -> Unit, content: @Composable () -> Unit) {}
@Composable fun VexComposeScope(parentRef: String, content: @Composable () -> Unit) {}
@Composable fun VexIcon(icon: ElementIcon, contentDescription: String?) {}
@Composable fun <Item> VexStableLazyColumn(listRef: String, items: List<Item>, itemRef: (Item) -> String, emptyContent: @Composable LazyItemScope.() -> Unit = {}, itemContent: @Composable LazyItemScope.(Item) -> Unit) {}
@Composable fun VexElementTree(placement: ElementPlacement, registry: UIBlueprintRegistry) {}
`;

const SCREEN = `
package x.feature
object ShelfScreen : AppScreenBlueprint(screenKey = "shelf", titleRes = R.string.shelf) {
    val Shelf = scrollableColumnRef("body.shelf")
    val Other = scrollableColumnRef("body.other")
    val Content = swappableRef("body.content", defaultChild = Shelf)
    val Options = modalBottomSheetRef("body.options")
    val Open = buttonRef("body.open", labelRes = R.string.open, intent = open(Options))
    val RowAction = buttonRef("body.row-actions.act", labelRes = R.string.act, intent = localEffect())
    override val content = layout { column("body") { swappable(Content) { scrollableColumn(Shelf) {}; scrollableColumn(Other) {} }; button(Open); column("row-actions") { button(RowAction) }; modalBottomSheet(Options) {} } }

    @Composable
    internal override fun renderContent(runtime: VexRuntime, repositories: AppRepositories) {
        ShelfContent(runtime = runtime, repository = repositories.shelf)
    }
}

object ShelfRefs {
    const val Results = "element.shelf.results"
    fun row(key: String): String = "element.shelf.row.dynamic." + key
}

@Composable
internal fun ShelfContent(runtime: VexRuntime, repository: ShelfRepository) {
    val state by repository.state.collectAsState()
    val visible = state.held ?: state.entries
    val selected = runtime.presentation.selected(ShelfScreen.Content)
    when {
        state.loading -> Spinner()
        selected.elementId == ShelfScreen.Other.elementId -> OtherPane(runtime = runtime)
        else -> ShelfPane(runtime = runtime, entries = visible)
    }
    if (runtime.presentation.isOpen(ShelfScreen.Options)) {
        OptionsSheet(runtime = runtime)
    }
    state.banner?.let { banner ->
        VexText(id = "banner", text = banner)
    }
    when (state.mode) {
        Mode.A -> VexButton(element = ShelfScreen.Open, handler = runtime)
        Mode.B -> Unit
    }
    AndroidView(factory = { NativeThing(it) })
}

@Composable
internal fun ShelfPane(runtime: VexRuntime, entries: List<Entry>) {
    VexStableLazyColumn(
        listRef = ShelfScreen.Shelf.elementId,
        items = entries,
        itemRef = { it.key },
        emptyContent = { VexText(element = ShelfScreen.Open) },
    ) { entry ->
        EntryCard(runtime = runtime, entry = entry)
    }
}

@Composable
internal fun OtherPane(runtime: VexRuntime) {
    LazyColumn {
        items(items = runtime.things, key = { it.id }) { thing -> Text(thing.name) }
    }
}

@Composable
private fun EntryCard(runtime: VexRuntime, entry: Entry) {
    val rowRef = ShelfRefs.row(entry.key)
    VexComposeScope(parentRef = rowRef) {
        VexBox(id = "picture") {
            if (entry.picture != null) {
                AsyncImage(model = entry.picture)
            } else {
                VexIcon(icon = ElementIcon.Placeholder, contentDescription = null)
            }
        }
        VexColumn(id = "copy") {
            VexText(id = "title", text = entry.title)
            if (entry.note.isNotBlank()) {
                VexText(id = "note", text = entry.note)
            }
        }
        RowMenuItem(element = ShelfScreen.RowAction)
    }
}

@Composable
private fun RowMenuItem(element: ButtonElement) {
    DropdownMenuItem(text = { Text("x") }, onClick = {})
}

@Composable
private fun OptionsSheet(runtime: VexRuntime) {
    VexModalBottomSheet(element = ShelfScreen.Options, onDismiss = {}) {
        VexButton(element = ShelfScreen.Open, handler = runtime)
    }
}
`;

const files = new Map([
  ['arch/elements/Primitives.kt', PRIMITIVES],
  ['app/feature/ShelfScreen.kt', SCREEN],
]);
const knownRefs = new Set([
  'screen.shelf', 'element.shelf.body', 'element.shelf.body.shelf', 'element.shelf.body.other', 'element.shelf.body.content',
  'element.shelf.body.options', 'element.shelf.body.open', 'element.shelf.body.row-actions', 'element.shelf.body.row-actions.act',
]);
const ids = { Shelf: 'body.shelf', Other: 'body.other', Content: 'body.content', Options: 'body.options', Open: 'body.open', RowAction: 'body.row-actions.act' };
const resolveRef = (expression) => {
  const expr = String(expression ?? '').replace(/\s*\.\s*/g, '.').replace(/\.elementId$/, '').trim();
  const match = /^ShelfScreen\.(\w+)$/.exec(expr);
  if (match && ids[match[1]]) return `element.shelf.${ids[match[1]]}`;
  if (expr === 'ShelfScreen') return 'screen.shelf';
  return null;
};
const composables = composableIndex(files);
const primitives = primitiveCatalog(files, (path) => path.startsWith('arch/elements/'));
const realize = () => realizeScreen({
  screen: { object: 'ShelfScreen', screenKey: 'shelf', path: 'app/feature/ShelfScreen.kt', customRender: true, source: 'app:feature/ShelfScreen.kt' },
  files, composables, primitives, resolveRef, toSource: (path) => path, knownRefs, constants: stringConstants(files),
});

test('realization preserves source-owned composable call topology without interpreting architecture', () => {
  const realization = realize();
  const pairs = realization.callEdges.map((edge) => [edge.caller, edge.callee]);
  assert.ok(pairs.some(([caller, callee]) => caller === 'ShelfContent' && callee === 'ShelfPane'));
  assert.ok(pairs.some(([caller, callee]) => caller === 'ShelfPane' && callee === 'EntryCard'));
  assert.ok(pairs.some(([caller, callee]) => caller === 'EntryCard' && callee === 'RowMenuItem'));
  assert.ok(realization.callEdges.every((edge) => realization.calls.includes(edge.caller) && realization.calls.includes(edge.callee)));
});

test('primitive relationships are learned from the primitives own parameter names', () => {
  const relationship = (name) => primitives.get(name).map((signature) => signature.relationship).sort().join('/');
  assert.equal(relationship('VexStableLazyColumn'), 'REPEAT');
  assert.equal(relationship('VexComposeScope'), 'SCOPE');
  assert.equal(relationship('VexText'), 'ELEMENT/LOCAL');
  assert.equal(relationship('VexBox'), 'LOCAL');
  assert.equal(relationship('VexContainer'), 'ELEMENT');
  assert.equal(relationship('VexElementTree'), 'TREE');
  assert.equal(relationship('VexIcon'), 'OTHER');
});

test('statements: if / else-if / else, when with and without subject, ?.let and bindings', () => {
  const nodes = parseKotlinBlock(`
    val a = b ?: c
    val d by remember { mutableStateOf(1) }
    if (x) { A() } else if (y) B() else { C() }
    when (mode) { M.A -> D(); M.B -> { E() } }
    when { p -> F(); else -> G() }
    value?.let { v -> H(v) }
    Outer(text = { Inner() }) { Trailing() }
  `);
  assert.deepEqual(nodes.map((node) => node.type), ['BIND', 'BIND', 'BRANCH', 'BRANCH', 'BRANCH', 'BRANCH', 'CALL']);
  assert.equal(nodes[0].expr, 'b ?: c');
  assert.equal(nodes[1].delegated, true);
  assert.deepEqual(nodes[2].alternatives.map((alt) => alt.condition), ['x', 'y', 'else']);
  assert.equal(nodes[3].form, 'WHEN_SUBJECT');
  assert.equal(nodes[4].alternatives.at(-1).condition, 'else');
  assert.equal(nodes[5].form, 'LET');
  assert.equal(nodes[5].param, 'v');
  assert.equal(nodes[6].name, 'Outer');
});

test('an if/else binding expression is read whole, across the else', () => {
  const [binding] = parseKotlinBlock(`val action = if (!shown) {
        null
    } else {
        when (copy) { Done -> Remove; else -> Add }
    }
    Next()`);
  assert.match(binding.expr, /else \{ when/);
});

test('a newline still ends a when arm inside a named lambda argument', () => {
  // Compacting the argument would read `Unit is Mode.Busy` as one infix expression.
  const [call] = parseKotlinBlock(`Scaffold(bottomBar = {
        when (mode) {
            is Mode.Idle,
            is Mode.Off ->
                Unit

            is Mode.Busy -> { Bar() }
        }
    }) { Body() }`);
  const arg = call.args.find((entry) => entry.name === 'bottomBar');
  const [cases] = parseKotlinBlock(arg.raw.trim().slice(1, -1));
  assert.deepEqual(cases.alternatives.map((alt) => alt.condition), ['is Mode.Idle, is Mode.Off', 'is Mode.Busy']);
});

test('?.let inside a nested lambda is not mistaken for a statement-level let', () => {
  const nodes = parseKotlinBlock('Scope(parent = p) { label?.takeIf(String::isNotBlank)?.let { Text(it) } }');
  assert.equal(nodes[0].type, 'CALL');
  assert.equal(nodes[0].name, 'Scope');
});

test('presence: presentation, selection with elimination, population, branch, cases and opaque native view', () => {
  const realization = realize();
  const kinds = realization.presence.map((entry) => entry.kind);
  for (const kind of kinds) assert.ok(PRESENCE_KINDS[kind], `${kind} is a declared presence kind`);

  const open = realization.presence.find((entry) => entry.kind === 'PRESENTATION');
  assert.equal(open.subjectRef, 'element.shelf.body.options');
  assert.equal(open.owner, 'runtime.presentation');
  assert.equal(open.realizedBy, 'OptionsSheet');
  assert.match(open.condition, /presentation\.isOpen\(ShelfScreen\.Options\)/);

  const selection = realization.presence.find((entry) => entry.kind === 'SELECTION');
  assert.equal(selection.subjectRef, 'element.shelf.body.content');
  assert.deepEqual(selection.choices.map((choice) => choice.kind), ['GUARD', 'SELECTION', 'OTHERWISE']);
  assert.equal(selection.choices[1].targetRef, 'element.shelf.body.other');
  assert.equal(selection.choices[2].realizedBy, 'ShelfPane');

  const registered = realization.presence.find((entry) => entry.kind === 'POPULATION' && entry.list.identity === 'REGISTERED');
  assert.equal(registered.subjectRef, 'element.shelf.body.shelf');
  assert.equal(registered.owner, 'VexStableLazyColumn');
  assert.equal(registered.emptyRealization, 'DECLARED');
  assert.deepEqual(registered.empty, ['element.shelf.body.open']);
  assert.equal(registered.held, null);
  // items <- entries param <- call site <- local elvis: the fallback names where truth comes from.
  // items <- entries param <- call site <- local elvis <- delegated state <- repository param <- the
  // render entry's own repositories parameter: the chain ends at the Screen's render boundary.
  assert.deepEqual(registered.provenance.map((step) => step.via), ['parameter', 'call', '=', 'by', 'parameter', 'call', 'parameter']);
  assert.match(registered.provenance[2].expression, /state\.held \?: state\.entries/);
  assert.match(registered.provenance[3].expression, /repository\.state\.collectAsState\(\)/);
  assert.match(registered.provenance[5].expression, /repository = repositories\.shelf/);
  assert.match(registered.provenance[6].expression, /^repositories: AppRepositories$/);

  const raw = realization.presence.find((entry) => entry.kind === 'POPULATION' && entry.list.identity === 'NONE');
  assert.match(raw.held, /raw lazy list without stable list identity/);
  assert.ok(realization.held.some((entry) => /raw lazy list/.test(entry.reason)));

  const cases = realization.presence.find((entry) => entry.kind === 'CASES');
  assert.equal(cases.subject, 'state.mode');
  assert.deepEqual(cases.choices.map((choice) => choice.condition), ['Mode.A', 'Mode.B']);

  assert.deepEqual(realization.opaque.map((entry) => entry.symbol), ['AndroidView']);
  assert.equal(realization.status, 'PARTIAL');
});

test('template: runtime instance identity, local slots, alternatives, conditions and per-instance registered actions', () => {
  const realization = realize();
  const template = realization.templates.find((entry) => entry.symbol === 'EntryCard');
  assert.ok(template);
  assert.equal(template.instanceFormation, 'ShelfRefs.row(entry.key)');
  const paths = template.slots.map((slot) => slot.path ?? slot.primitive);
  assert.deepEqual(paths.slice(0, 3), ['picture', 'AsyncImage', 'VexIcon(ElementIcon.Placeholder)']);
  assert.deepEqual(template.slots.filter((slot) => slot.alternative).map((slot) => slot.alternative), ['1/2', '2/2']);
  assert.equal(template.slots.find((slot) => slot.path === 'copy.note').condition, 'entry.note.isNotBlank()');
  assert.equal(template.slots.find((slot) => slot.primitive === 'RowMenuItem').realizes, 'element.shelf.body.row-actions.act');
  assert.deepEqual(template.realizes, ['element.shelf.body.row-actions.act']);

  const fact = realization.elements.find((entry) => entry.ref === 'element.shelf.body.row-actions.act');
  assert.deepEqual(fact.realizedIn, [template.ref], 'registered row action is realized inside each instance, not as a visible column');
});

test('runtime list identity from a string constant stays a runtime coordinate, not a registered element', () => {
  assert.equal(stringConstants(files).get('ShelfRefs.Results'), 'element.shelf.results');
});

test('a rendered example binds to its outermost semantic root, or reports a foreign literal root', () => {
  const golden = `
    @Composable fun goldenA() { Theme { ShelfPane(runtime = r, entries = fixture()) } }
    @Composable fun goldenB() { VexComposeScope(parentRef = "golden.shelf") { VexText(id = "t", text = "x") } }
    @Composable fun Theme(content: @Composable () -> Unit) { content() }`;
  const goldenFiles = new Map([...files, ['golden/Golden.kt', golden]]);
  const index = composableIndex(goldenFiles);
  const roots = (symbol) => semanticRootsOf({ body: index.get(symbol)[0].body, path: 'golden/Golden.kt', symbol, composables: index, primitives, resolveRef, toSource: (path) => path, knownRefs });
  assert.deepEqual(roots('goldenA').known, ['element.shelf.body.shelf']);
  assert.deepEqual(roots('goldenB').known, []);
  assert.deepEqual(roots('goldenB').foreign, ['"golden.shelf"']);
});

test('architecture law: the generic realization and example readers carry no product vocabulary', () => {
  // The handoff's architecture test made executable: feature nouns belong to feature source.
  for (const relative of ['../src/core/vexboard-android-realization.mjs', '../src/core/vexboard-android-examples.mjs', '../src/core/vexboard-kotlin-source.mjs', '../src/shared/vexboard-screen-lens-realization.mjs', '../src/shared/vexboard-screen-lens-source-expressions.mjs']) {
    const source = fs.readFileSync(new URL(relative, import.meta.url), 'utf8')
      // language vocabulary that merely spells like a product noun: JS Map / Array#map and Kotlin's map()
      .replace(/\bnew Map\b|\.map\(|\bMap\b|\bflatMap\b|forEach\|forEachIndexed\|map\|onEach/g, '')
      .replace(/\bfail\(message\)|function fail\(message\)|\$\{message\}/g, '');
    for (const noun of ['song', 'track', 'album', 'artist', 'playlist', 'event', 'attention', 'conversation', 'log history', 'map', 'music', 'vexstream', 'profile']) {
      assert.doesNotMatch(source, new RegExp(`\\b${noun}s?\\b`, 'i'), `${relative} must not know the product noun "${noun}"`);
    }
  }
});

test('the committed lens projects the three architecture cases and the native boundary through the same reader', () => {
  const lens = normalizeScreenLens(JSON.parse(fs.readFileSync(new URL('../projects/vexboard/lens/vexlife-android.screen-lens.json', import.meta.url), 'utf8')));
  const realizationOf = (screenRef) => lens.screens.find((screen) => screen.screenRef === screenRef).realization;

  // Case 1 — repository projection, repeated runtime rows, image fallback.
  const library = realizationOf('screen.vexstream-music');
  const card = library.templates.find((template) => /TrackCard$/.test(template.symbol ?? ''));
  assert.ok(card, 'the repeated row template is read from source');
  assert.match(card.instanceFormation, /PresentationRefs\.trackRow\(/);
  assert.deepEqual(card.slots.filter((slot) => slot.alternative).map((slot) => slot.primitive), ['AsyncImage', 'VexIcon(ElementIcon.Music)']);
  const population = library.presence.find((entry) => entry.kind === 'POPULATION' && entry.realizedBy === 'VexStreamSongsPane');
  assert.ok(population.provenance.some((step) => /playableTracks/.test(step.expression)));

  // Case 2 — Convergence Relay output, repeated rows bound to a registered list, anchored overlay.
  const feed = realizationOf('screen.events');
  const feedPopulation = feed.presence.find((entry) => entry.kind === 'POPULATION');
  assert.equal(feedPopulation.list.identity, 'REGISTERED');
  assert.ok(feedPopulation.provenance.some((step) => /outputStates/.test(step.expression)));
  assert.ok(feed.templates[0].slots.some((slot) => slot.kind === 'OVERLAY' && slot.condition));

  // Case 3 — fixture-backed source data in a modal bottom sheet.
  const debug = realizationOf('screen.debug-menu');
  assert.ok(debug.presence.some((entry) => entry.kind === 'PRESENTATION' && entry.realizedBy === 'LogHistorySheet'));

  // Negative pressure — the native map view stays an opaque, named boundary.
  assert.deepEqual(realizationOf('screen.vex-maps').opaque.map((entry) => entry.symbol), ['AndroidView']);

  // A screen whose body IS the registered tree says so.
  assert.equal(realizationOf('screen.user-profile').rendersRegisteredTree, 'element.user-profile.body');
});

test('design facts source already states: named content regions, popup layers, text roles and typography', () => {
  const lens = normalizeScreenLens(JSON.parse(fs.readFileSync(new URL('../projects/vexboard/lens/vexlife-android.screen-lens.json', import.meta.url), 'utf8')));
  const screen = lens.screens.find((entry) => entry.screenRef === 'screen.vexstream-music');
  const presence = (suffix) => screen.realization.presence.find((entry) => entry.ref.endsWith(suffix));
  // Scaffold(bottomBar = { when (…) { … VexStreamMiniPlayer } }, floatingActionButton = { if (…) { … } })
  assert.deepEqual(presence('library-surface-cases').region, { slot: 'bottomBar', call: 'Scaffold' });
  assert.deepEqual(presence('library-surface-branch').region, { slot: 'floatingActionButton', call: 'Scaffold' });
  assert.equal(presence('library-selection').region, null, 'the body content is in no named region');
  const card = screen.realization.templates.find((template) => template.symbol === 'VexStreamTrackCard');
  const slot = (path) => card.slots.find((entry) => entry.path === path);
  assert.equal(slot('copy.title').textStyle, 'titleMedium');
  assert.equal(slot('copy.secondary').role, 'Supporting');
  assert.equal(slot('copy.status').role, 'Label');
  // DropdownMenu(expanded = menuExpanded) { five menu items }: a popup layer, not five more row cells.
  const popups = card.slots.filter((entry) => entry.popup);
  assert.equal(popups.length, 5);
  assert.ok(popups.every((entry) => entry.popup === 'menuExpanded'));
  assert.equal(slot('menu').popup, null);
});

test('toolbar actions are Screen-owned registered elements with their declared style and icon', () => {
  const lens = normalizeScreenLens(JSON.parse(fs.readFileSync(new URL('../projects/vexboard/lens/vexlife-android.screen-lens.json', import.meta.url), 'utf8')));
  const screen = lens.screens.find((entry) => entry.screenRef === 'screen.vexstream-music');
  const toolbar = screen.elements.filter((element) => element.slot === 'TOOLBAR');
  assert.deepEqual(toolbar.map((element) => [element.ref.replace('element.vexstream-music.', ''), element.icon, element.style, element.parentRef]), [
    ['body.library.search.open', 'Search', 'ToolbarIcon', null],
    ['body.library.organization.open', 'Menu', 'ToolbarIcon', null],
    ['body.connection.manage', 'Settings', 'ToolbarIcon', null],
  ]);
  assert.ok(toolbar.every((element) => element.pathwayRef), 'their typed intents are pathways like any other control');
  const play = screen.elements.find((element) => element.ref === 'element.vexstream-music.body.track-actions.play');
  assert.deepEqual([play.icon, play.style], ['Play', 'PrimaryAction']);
});

// [VXG RealForever][VEXWORK][VEXBOARD][SCREEN-LENS][REALIZATION-TEST]