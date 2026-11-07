import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { EXAMPLE_KINDS, previewConfigurations, readSourceExamples } from '../src/core/vexboard-android-examples.mjs';
import { composableIndex, primitiveCatalog } from '../src/core/vexboard-android-realization.mjs';
import { normalizeScreenLens } from '../src/shared/vexboard-screen-lens.mjs';

const PREVIEW_ENV = `
@Preview(name = "Phone · Dark", widthDp = 412)
@Preview(name = "Compact · Large text", fontScale = 1.45f)
internal annotation class ShelfPreviews
`;
const PRIMITIVES = `
@Composable fun VexComposeScope(parentRef: String, content: @Composable () -> Unit) {}
@Composable fun <Item> VexStableLazyColumn(listRef: String, items: List<Item>, itemRef: (Item) -> String, itemContent: @Composable (Item) -> Unit) {}
`;
const SCREEN = `
object ShelfScreen : AppScreenBlueprint(screenKey = "shelf", titleRes = R.string.shelf) {
    val Shelf = scrollableColumnRef("body.shelf")
    val Options = modalBottomSheetRef("body.options")
}

@ShelfPreviews
@Composable
private fun ShelfPreview() {
    VexPreviewHost(id = "shelf-full", startScreen = ShelfScreen, repositoriesFactory = { withEntries(shelfFixture()) }, previewSetup = { open(ShelfScreen.Options) }) { context ->
        ShelfContent(runtime = context.runtime)
    }
}

@ShelfPreviews
@Composable
private fun ShelfDuplicatePreview() {
    VexPreviewHost(id = "shelf-full", startScreen = ShelfScreen) { context -> ShelfContent(runtime = context.runtime) }
}

@ShelfPreviews
@Composable
private fun ShelfRenderedPreview() {
    VexRenderedScreenPreview(ShelfScreen)
}

internal fun shelfFixture(): Fixture = Fixture()
internal fun withEntries(fixture: Fixture): AppRepositories = AppRepositories()

@Composable
internal fun ShelfPane(entries: List<Entry>) {
    VexStableLazyColumn(listRef = ShelfScreen.Shelf.elementId, items = entries, itemRef = { it.key }) { entry -> Text(entry.title) }
}
`;
const GOLDEN = `
package x.feature

/**
 * Semantic visual case: shelf.full
 *
 * Starts from the pane seam.
 */
@PreviewTest
@Preview(name = "Shelf · full", widthDp = 412)
@Composable
fun shelfFullGolden() {
    ShelfPane(entries = shelfFixture())
}

@PreviewTest
@Preview(name = "Shelf · foreign root")
@Composable
fun shelfForeignGolden() {
    VexComposeScope(parentRef = "golden.shelf") { Text("x") }
}
`;
const JOURNEY = `
object ShelfJourneys {
    val browse = vexJourney(id = "browse-shelf", title = "Browse the shelf") {
        start(ShelfScreen)
        tap(ShelfScreen.Options)
        externalCause(repository = getRepository(Repositories.shelf), causeRef = "cause.shelf.refilled") {
            refill(count = 3)
        }
        tapElementById(elementId = ShelfRefs.row("a"), behavesLike = ShelfScreen.Options)
        back()
    }
}
`;
const files = new Map([
  ['app/preview/Env.kt', PREVIEW_ENV],
  ['arch/elements/Primitives.kt', PRIMITIVES],
  ['app/feature/ShelfScreen.kt', SCREEN],
  ['golden/x/feature/ShelfGoldenTest.kt', GOLDEN],
  ['journey/ShelfJourneys.kt', JOURNEY],
]);
const knownRefs = new Set(['screen.shelf', 'element.shelf.body.shelf', 'element.shelf.body.options']);
const resolveRef = (expression) => {
  const expr = String(expression ?? '').replace(/\s*\.\s*/g, '.').replace(/\.elementId$/, '').trim();
  return { 'ShelfScreen.Shelf': 'element.shelf.body.shelf', 'ShelfScreen.Options': 'element.shelf.body.options', ShelfScreen: 'screen.shelf' }[expr] ?? null;
};
const read = () => readSourceExamples({
  files,
  listing: [
    'ref/x/feature/ShelfGoldenTestKt/shelfFullGolden_Shelf · full_0a1b2c3d_0.png',
    'ref/x/feature/ShelfGoldenTestKt/otherGolden_x_0.png',
  ],
  resolveRef,
  screenRefFor: (expression) => (String(expression).trim() === 'ShelfScreen' ? 'screen.shelf' : null),
  toSource: (path) => path,
  composables: composableIndex(files),
  primitives: primitiveCatalog(files, (path) => path.startsWith('arch/elements/')),
  knownRefs,
  isPreviewSource: (path) => path.startsWith('app/'),
  isGoldenSource: (path) => path.startsWith('golden/'),
  isJourneySource: (path) => path.startsWith('journey/'),
  referencePrefix: 'ref/',
});

test('render configurations come from the multi-preview annotation, orthogonal to the example', () => {
  assert.deepEqual(previewConfigurations(files).get('ShelfPreviews'), ['Phone · Dark', 'Compact · Large text']);
});

test('a preview keeps its own id, subject, fixture provenance and presentation setup', () => {
  const { examples } = read();
  const preview = examples.find((example) => example.ref === 'preview:shelf-full');
  assert.ok(EXAMPLE_KINDS[preview.kind]);
  assert.equal(preview.subjectRef, 'screen.shelf');
  assert.equal(preview.renders, 'ShelfContent');
  assert.deepEqual(preview.fixture.functions, ['shelfFixture', 'withEntries']);
  assert.deepEqual(preview.setup.map((step) => [step.op, step.targetRef]), [['OPEN', 'element.shelf.body.options']]);
  assert.deepEqual(preview.configurations, ['Phone · Dark', 'Compact · Large text'], 'theme/device/font are configurations, not separate examples');
});

test('duplicate preview ids and host-derived ids are held, never silently canonical', () => {
  const { examples, held } = read();
  assert.equal(examples.filter((example) => example.ref === 'preview:shelf-full').length, 1);
  assert.ok(held.some((entry) => entry.ref === 'preview:shelf-full' && /duplicate/.test(entry.reason)));
  assert.ok(held.some((entry) => entry.ref === 'preview:ShelfRenderedPreview' && /derives its id inside the shared host/.test(entry.reason)));
});

test('a golden names its case in KDoc, binds to a semantic subject, and lists its accepted reference render', () => {
  const { examples } = read();
  const golden = examples.find((example) => example.ref === 'golden:shelf.full');
  assert.equal(golden.subjectRef, 'element.shelf.body.shelf');
  assert.deepEqual(golden.configurations, ['Shelf · full']);
  assert.equal(golden.evidence.length, 1, 'only the reference render for this function, never another golden');
  assert.equal(golden.evidence[0].kind, 'GOLDEN_REFERENCE');
  assert.match(golden.evidence[0].meaning, /expected, not an observed device run/);
});

test('a golden that renders a root no production coordinate shares is held with that literal', () => {
  const { examples, held } = read();
  const foreign = examples.find((example) => example.symbol === 'shelfForeignGolden');
  assert.equal(foreign.subjectRef, null);
  assert.match(foreign.subjectHeld, /"golden\.shelf"/);
  assert.ok(held.some((entry) => /no "Semantic visual case:" identity/.test(entry.reason)));
});

test('examples that call the same fixture function are related, with no descriptor', () => {
  const { examples } = read();
  const preview = examples.find((example) => example.ref === 'preview:shelf-full');
  assert.deepEqual(preview.related, [{ ref: 'golden:shelf.full', via: ['shelfFixture'] }]);
});

test('a journey is a transition: steps, external causes carried verbatim, runtime identities unresolved', () => {
  const { examples } = read();
  const journey = examples.find((example) => example.ref === 'journey:browse-shelf');
  assert.equal(journey.kind, 'JOURNEY');
  assert.equal(journey.label, 'Browse the shelf');
  assert.equal(journey.subjectRef, 'screen.shelf');
  assert.deepEqual(journey.steps.map((step) => step.op), ['start', 'tap', 'externalCause', 'tapElementById', 'back']);
  const cause = journey.steps[2];
  assert.equal(cause.target, 'cause.shelf.refilled');
  assert.equal(cause.repository, 'getRepository(Repositories.shelf)');
  assert.equal(cause.code, 'refill(count = 3)', 'the typed change stays source text; nothing is serialized or interpreted');
  assert.equal(journey.steps[3].runtimeIdentity, true);
  assert.equal(journey.steps[3].behavesLikeRef, 'element.shelf.body.options');
});

test('the committed lens catalogs source-authored examples from the real Android source', () => {
  const lens = normalizeScreenLens(JSON.parse(fs.readFileSync(new URL('../projects/vexboard/lens/vexlife-android.screen-lens.json', import.meta.url), 'utf8')));
  const byRef = new Map(lens.examples.map((example) => [example.ref, example]));
  assert.deepEqual(byRef.get('preview:debug-history-open').setup.map((step) => [step.op, step.targetRef]), [['OPEN', 'element.debug-menu.log-history.sheet']]);
  assert.deepEqual(byRef.get('preview:debug-history-open').fixture.functions, ['debugHistoryPreviewFixture']);
  assert.ok(byRef.get('preview:vexstream-music').related.some((entry) => entry.ref === 'golden:vexstream.library.songs'), 'preview and golden share one authored fixture');
  assert.equal(byRef.get('golden:vexstream.library.songs').evidence.length, 1);
  for (const ref of ['golden:conversation.family-room.baseline', 'golden:conversation.family-room.multi-human', 'golden:conversation.family-room.home-unavailable']) {
    assert.equal(byRef.get(ref).subjectRef, 'screen.family-conversation', `${ref} attaches to the production Conversation Screen`);
    assert.equal(byRef.get(ref).subjectHeld ?? null, null, `${ref} no longer carries a foreign test-only semantic root`);
  }
  assert.deepEqual(byRef.get('preview:events-attention').configurations, ['Phone · Dark', 'Phone · Light', 'Compact · Large text']);
});

// [VXG RealForever][VEXWORK][VEXBOARD][SCREEN-LENS][EXAMPLES-TEST]