import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ADAPTER_VERSION,
  SCREEN_LENS_ADAPTER_SCHEMA,
  SCREEN_LENS_OVERLAY_SCHEMA,
  adapterReadPlan,
  applyOverlay,
  applyOverlayWithReport,
  compact,
  kdocBefore,
  matchClose,
  parseIntent,
  parseStringResources,
  projectAndroidScreenLens,
  splitArgs,
  stripComments,
  topLevelCalls,
  typedPathwayRef,
} from '../src/core/vexboard-screen-lens-android-adapter.mjs';
import { faceGraph, normalizeScreenLens, screenMapGraph } from '../src/shared/vexboard-screen-lens.mjs';
import { layoutCollisions, layoutLensFace } from '../src/shared/vexboard-lens-layout.mjs';

// A minimal synthetic app shaped like VexLife-Android. Small on purpose: it
// pins each adapter rule without copying another repository's source.
const APP = 'app/src/main/kotlin/demo/';
const files = new Map(Object.entries({
  [`${APP}screens/AppScreens.kt`]: `
object AppScreens {
    val primary: List<AppScreenBlueprint> = listOf(
        HomeScreen,
    )
    val shared: List<AppScreenBlueprint> = listOf(
        SettingsScreen,
    )
}`,
  [`${APP}screens/AppScreenBlueprint.kt`]: `
internal class ScreenActionContext(
    val repositories: AppRepositories,
    val logger: VexLogger,
    val pickWidget: () -> Unit,
    val pingOther: () -> Unit,
)`,
  [`${APP}runtime/AppActions.kt`]: `
object AppActions {
    val Pick = ActionKey("action.widget.pick")
    val Clear = ActionKey("action.log.clear")
    val Save = ActionKey("action.settings.save")
    val Ping = ActionKey("action.other.ping")
    val Nothing = ActionKey("action.nothing")
}`,
  [`${APP}shell/AppShell.kt`]: `
object AppShell {
    object Elements {
        object Root : ColumnElement("element.shell.root")
        object Toolbar : RowElement("element.shell.toolbar")
        object Back : ButtonElement(
            elementId = "element.shell.back",
            labelRes = R.string.back,
            intent = navigateBack(),
        )
        object Nav : RowElement("element.shell.nav")
        object Home : ButtonElement(
            elementId = "element.nav.home",
            labelRes = R.string.nav_home,
            intent = navigateTo(HomeScreen),
        )
        object Cluster : StackElement("element.shell.cluster")
        object Options : ColumnElement("element.shell.options")
        object Add : FabElement(
            elementId = "element.shell.add",
            intent = toggle(Options),
        )
        object Settings : FabElement(
            elementId = "element.settings",
            style = VexElementStyles.FabOption,
            intent = close(Options) then navigateTo(SettingsScreen),
        )
    }
    val blueprint = column(Elements.Root) {
        row(Elements.Toolbar) {
            button(Elements.Back)
        }
        row(Elements.Nav) {
            button(Elements.Home)
        }
        stack(Elements.Cluster) {
            column(Elements.Options) {
                fab(Elements.Settings)
            }
            fab(Elements.Add)
        }
    }
}`,
  [`${APP}ui/Session.kt`]: `
internal fun createActions() = ScreenActionContext(
    pickWidget = {
        pickWidget(
            family = widgetFamily,
            store = widgetStore,
        )
    },
    pingOther = { pingSomething() },
)

/** Picks the next widget choice from current State. */
private fun pickWidget(
    family: WidgetFamily,
    store: WidgetStore,
) {
    activateWidget(
        family = family,
        control = WidgetFamily.Control.Pick(
            WidgetFamily.Parameter.Choice(value = 1),
        ),
    )
}

private fun pingSomething() {
    println("no family here")
}

internal class WidgetFamilyProvider(
    private val store: VexDependencyProvider<WidgetStore>,
) : VexDependencyProvider<WidgetFamily>(
    dependencies = listOf(
        store,
        executionRoot,
    ),
)`,
  [`${APP}ui/Widget.kt`]: `
internal enum class Widget :
    VexFamily.State<WidgetFamily> {
    A,
    B,
}

/**
 * Smallest widget Family.
 *
 * Second paragraph is not part of the summary.
 */
@Suppress("unused")
internal class WidgetFamily(
    initialState: Widget,
) {
    sealed interface Parameter {
        data class Choice(val value: Int) : Parameter
    }
    sealed interface Control {
        data class Pick(val choice: Parameter.Choice) : Control
    }
    sealed interface Effect {
        data class Persist(val choice: Parameter.Choice) : Effect
    }
    object Act {
        sealed class Method<out S, out F> : VexFamily.Act.Method<WidgetFamily, S, F> {
            class Persist(
                private val store: WidgetStore,
                val parameter: Parameter.Choice,
            ) : Method<Widget, Unit>() {
                override suspend operator fun invoke() =
                    if (store.write(parameter.value)) VexMethod.Result.Success(output = Widget.A) else VexMethod.Result.Failure(Unit)
            }
        }
    }
    sealed interface DisplayState {
        data object A : DisplayState {
            override val presentation = WidgetPresentation.A
        }
    }
    override fun act(state: Widget, control: Control) = beginLatest(Effect.Persist(control.choice))
}

internal fun activateWidget(family: WidgetFamily, control: WidgetFamily.Control) {
    recordWidgetFact()
}

internal fun observeWidgetStore(family: WidgetFamily) {}`,
  [`${APP}ui/WidgetStore.kt`]: `
internal interface WidgetStore {
    suspend fun write(value: Int): Boolean
}

internal class PrefsWidgetStore(
    context: Context,
) : WidgetStore {
    override suspend fun write(value: Int) = true
}`,
  [`${APP}screens/primary/home/HomeScreen.kt`]: `
/** Home is where widgets are picked. */
object HomeScreen : AppScreenBlueprint(
    screenKey = "home",
    titleRes = R.string.home_title,
) {
    val Pick = toggleRef(
        id = "body.pick",
        labelRes = R.string.pick_label,
        intent = invoke(AppActions.Pick),
    )
    val Clear = buttonRef(id = "body.group.actions.clear", labelRes = R.string.clear, intent = invoke(AppActions.Clear))
    val Go = buttonRef(id = "body.group.actions.go", intent = navigateTo(SettingsScreen))
    val Sheet = modalBottomSheetRef("body.sheet")
    val Open = buttonRef(id = "body.open", intent = open(Sheet))
    val Panel = dialogRef("body.panel")
    val Swap = buttonRef(id = "body.swap", intent = close(Sheet).then(open(Panel)))
    val Ping = buttonRef(id = "body.ping", intent = invoke(AppActions.Ping))
    val Idle = buttonRef(id = "body.idle", intent = invoke(AppActions.Nothing))
    val Orphan = buttonRef(id = "body.orphan", intent = invoke(AppActions.Missing))
    val Name = textFieldRef(id = "body.name", labelRes = R.string.name)

    override val content = layout {
        scrollableColumn("body") {
            toggle(Pick)
            card("group") {
                text(
                    id = "title",
                    textRes = R.string.group_title,
                    role = TextRole.Title,
                )
                row("actions") {
                    button(Clear)
                    button(Go)
                }
            }
            // a comment with a brace { that must not confuse the reader
            button(Open)
            button(Swap)
            button(Ping)
            button(Idle)
            button(Orphan)
            textField(Name)
            customWidget(Thing)
            column(element = Missing) {}
            modalBottomSheet(Sheet) {}
            dialog(Panel) {}
        }
    }

    internal override fun appActionRegistrations(
        context: ScreenActionContext,
    ): AppActionRegistrations {
        val pick = context.pickWidget
        val ping = context.pingOther
        val logger = context.logger
        val lab = LabController(
            repository = context.repositories.things,
        )
        return AppActionRegistrations.of(
            appAction(action = AppActions.Pick, ownerRef = screenId) {
                pick()
            },
            appAction(action = AppActions.Clear, ownerRef = screenId) {
                logger.clearHistory()
                lab.reset()
            },
            appAction(action = AppActions.Ping, ownerRef = screenId) {
                ping()
            },
            appAction(action = AppActions.Nothing, ownerRef = screenId) {
                // No product effect yet.
            },
        )
    }

    @Composable
    override fun renderContent(runtime: VexRuntime, repositories: AppRepositories) {
        if (runtime.presentation.isOpen(HomeScreen.Sheet)) {
            SheetView(
                runtime = runtime,
                repository = repositories.things,
            )
        }
    }
}`,
  [`${APP}screens/shared/settings/SettingsScreen.kt`]: `
object SettingsScreen : AppScreenBlueprint(
    screenKey = "settings",
    titleRes = R.string.settings_title,
) {
    val SaveButton = buttonRef(id = "body.save", intent = invoke(AppActions.Save))
    override val content = layout {
        scrollableColumn("body") {
            button(SaveButton)
        }
    }
    internal override fun appActionRegistrations(
        context: ScreenActionContext,
    ): AppActionRegistrations =
        settingsRegistrations(context.repositories.settings)
}

internal fun settingsRegistrations(
    repository: SettingsRepository,
): AppActionRegistrations =
    AppActionRegistrations.of(
        appAction(action = AppActions.Save, ownerRef = SettingsScreen.screenId) { request ->
            repository.save(request)
        },
    )`,
  [`${APP}screens/shared/orphan/OrphanScreen.kt`]: `
object OrphanScreen : AppScreenBlueprint(screenKey = "orphan", titleRes = R.string.orphan) {}`,
  'app/src/main/res/values/strings.xml': `<resources>
    <string name="pick_label">Pick &amp; keep</string>
    <string name="home_title">Home</string>
    <string name="settings_title">Settings</string>
    <string name="group_title"><![CDATA[Group]]></string>
    <string name="nav_home">Home</string>
    <string name="back">Back</string>
    <string name="clear">Clear \\'all\\'</string>
</resources>`,
}));

const adapter = {
  schemaVersion: SCREEN_LENS_ADAPTER_SCHEMA,
  lensRef: 'lens.demo',
  title: 'Demo lens',
  entry: { screenRef: 'screen.home', elementRef: 'element.home.body.pick' },
  repository: { ref: 'repo.demo', url: 'https://example.test/demo', commit: '0123456789abcdef0123456789abcdef01234567', roots: { app: APP } },
  read: ['app:screens/', 'app:shell/', 'app:runtime/', 'app:ui/'],
  stringResources: ['app/src/main/res/values/strings.xml'],
  sources: {
    appScreens: 'app:screens/AppScreens.kt',
    appShell: 'app:shell/AppShell.kt',
    appActions: 'app:runtime/AppActions.kt',
    session: 'app:ui/Session.kt',
    screenActionContext: 'app:screens/AppScreenBlueprint.kt',
    runtime: 'app:runtime/VexRuntime.kt',
    frame: 'app:shell/AppFrame.kt',
  },
  chrome: {
    chromeRef: 'chrome.shell',
    label: 'Shell',
    symbol: 'AppShell',
    appliesTo: 'PRIMARY',
    summary: 'One owner.',
    slots: { 'element.shell.toolbar': 'TOP', 'element.shell.nav': 'BOTTOM', 'element.shell.cluster': 'FAB' },
    visibleWhen: { 'element.shell.nav': 'runtime.isPrimary()' },
    alwaysVisible: ['element.shell.back'],
    kinds: { 'element.shell.options': 'MENU' },
    labels: { 'element.shell.add': '+' },
  },
};

const project = (overrides = {}) => projectAndroidScreenLens({ adapter, files, observedAt: '2026-11-01', ...overrides });

test('Kotlin helpers respect strings, comments and nesting', () => {
  const text = 'call("a ) {", f(x), { y })';
  assert.equal(matchClose(text, 4), text.length - 1);
  assert.throws(() => matchClose('x', 0), /opening bracket/);
  assert.throws(() => matchClose('(', 0), /unbalanced/);
  assert.equal(stripComments('a // b\nc /* d */ e "// kept"'), 'a \nc  e "// kept"');
  assert.equal(compact('f(\n  a,\n  b,\n)'), 'f(a, b)');
  assert.deepEqual(splitArgs('id = "x", 3, intent = invoke(AppActions.K), // tail\n'), [
    { name: 'id', value: '"x"' },
    { name: null, value: '3' },
    { name: 'intent', value: 'invoke(AppActions.K)' },
  ]);
  assert.deepEqual(splitArgs('a == b').map((arg) => arg.name), [null], 'comparison is not a named argument');
  const calls = topLevelCalls('row("r") { button(B) } if (x) { y() } text(id = "t") layout { z() } "str(" ');
  assert.deepEqual(calls.map((call) => call.name), ['row', 'text', 'layout']);
  assert.equal(calls[0].body.trim(), 'button(B)');
  assert.equal(calls[2].args, '');
});

test('KDoc is found above modifiers and annotations, first paragraph only', () => {
  const text = '/**\n * First line\n * [Linked] text.\n *\n * Later.\n */\n@Suppress("x")\ninternal class X';
  assert.equal(kdocBefore(text, text.indexOf('class')), 'First line Linked text.');
  assert.equal(kdocBefore('val x = 1\nclass Y', 10), null);
  assert.equal(kdocBefore('/* not kdoc */ class Z', 15), null);
  assert.equal(kdocBefore('x */ class Z', 5), null);
  assert.equal(kdocBefore('/**\n *\n */\nclass E', 13), null);
});

test('intents parse both chaining forms', () => {
  assert.deepEqual(parseIntent('close(A) then navigateTo(B)'), [{ op: 'close', arg: 'A' }, { op: 'navigateTo', arg: 'B' }]);
  assert.deepEqual(parseIntent('close(A) .then(open(B))'), [{ op: 'close', arg: 'A' }, { op: 'open', arg: 'B' }]);
  assert.deepEqual(parseIntent('navigateBack()'), [{ op: 'navigateBack', arg: '' }]);
  assert.deepEqual(parseIntent(''), []);
  assert.deepEqual(parseIntent('somethingOdd'), [{ op: 'unknown', arg: 'somethingOdd' }]);
  const elements = typedPathwayRef('gallery', parseIntent('swapTo(container = Content, child = ElementsPanel)'));
  const appGraph = typedPathwayRef('gallery', parseIntent('swapTo(child = AppGraphPanel, container = Content)'));
  assert.notEqual(elements, appGraph);
  assert.equal(appGraph, typedPathwayRef('gallery', parseIntent('swapTo(container = Content, child = AppGraphPanel)')));
});

test('string resources decode entities, CDATA and escapes', () => {
  const strings = parseStringResources(files.get('app/src/main/res/values/strings.xml'));
  assert.equal(strings.get('pick_label'), 'Pick & keep');
  assert.equal(strings.get('group_title'), 'Group');
  assert.equal(strings.get('clear'), "Clear 'all'");
  assert.equal(parseStringResources('<string name="q">"quoted"</string>').get('q'), 'quoted');
});

test('screens, placement, labels and element ids come from source', () => {
  const { lens, report } = project();
  assert.equal(lens.schemaVersion, 'vexboard.screen-lens/v1');
  assert.deepEqual(lens.screens.map((screen) => [screen.screenRef, screen.placement, screen.label]), [['screen.home', 'PRIMARY', 'Home'], ['screen.settings', 'SHARED', 'Settings']]);
  const home = lens.screens[0];
  assert.match(home.summary, /^Home is where widgets are picked\. Renders custom content/);
  const refs = home.elements.map((element) => element.ref);
  for (const ref of ['element.home.body', 'element.home.body.pick', 'element.home.body.group', 'element.home.body.group.title', 'element.home.body.group.actions', 'element.home.body.group.actions.clear', 'element.home.body.sheet', 'element.home.body.panel', 'element.home.body.name']) assert.ok(refs.includes(ref), ref);
  const pick = home.elements.find((element) => element.ref === 'element.home.body.pick');
  assert.equal(pick.label, 'Pick & keep');
  assert.equal(pick.kind, 'TOGGLE');
  assert.equal(pick.declared, 'toggleRef(id = "body.pick")');
  assert.equal(pick.symbol, 'HomeScreen.Pick');
  assert.equal(pick.actionKey, 'action.widget.pick');
  assert.equal(home.elements.find((element) => element.ref === 'element.home.body.group.title').textRole, 'TITLE');
  assert.equal(home.elements.find((element) => element.ref === 'element.home.body.name').kind, 'FIELD');
  assert.equal(home.elements.find((element) => element.ref === 'element.home.body.sheet').visibleWhen, 'runtime.presentation.isOpen(Sheet)');
  assert.deepEqual(report.unknownCalls.map((entry) => entry.call).sort(), ['column without id', 'customWidget']);
  assert.equal(report.strings, 7);
  assert.ok(!lens.screens.some((screen) => screen.screenRef === 'screen.orphan'), 'unregistered screens are not projected');
});

test('a closure that reaches a Family becomes one SCAE + Depth template', () => {
  const { lens, report } = project();
  assert.deepEqual(report.bonds, [{ actionKey: 'action.widget.pick', closure: 'pickWidget', fn: 'pickWidget', family: 'WidgetFamily', control: 'Pick' }]);
  const pathway = lens.pathways.find((entry) => entry.pathwayRef === 'pathway.widget.pick');
  assert.equal(pathway.disposition, 'SCAE_FAMILY');
  assert.equal(pathway.summary, 'Smallest widget Family.');
  const slots = pathway.nodes.map((node) => node.ref.replace('widget.pick.', ''));
  assert.deepEqual(slots, ['intent', 'runtime', 'registration', 'closure', 'control', 'state', 'act', 'admitted', 'effect', 'display', 'method', 'launch', 'custody', 'store', 'store-impl', 'result', 'observe', 'log', 'provider']);
  const node = (slot) => pathway.nodes.find((entry) => entry.ref === `widget.pick.${slot}`);
  assert.equal(node('closure').summary, 'Picks the next widget choice from current State.');
  assert.equal(node('control').code, 'data class Pick(val choice: Parameter.Choice) : Control');
  assert.equal(node('state').symbol, 'Widget.A | B');
  assert.equal(node('effect').label, 'Begin(Effect.Persist, Latest)');
  assert.equal(node('method').label, 'Act.Method.Persist(store, parameter)');
  assert.equal(node('store').label, 'WidgetStore.write(…)');
  assert.equal(node('store-impl').label, 'PrefsWidgetStore');
  assert.equal(node('result').label, 'VexMethod.Result.Success(…)');
  assert.equal(node('result').role, 'RESULT');
  assert.equal(node('observe').role, 'OBSERVATION');
  assert.equal(node('display').label, 'DisplayState → WidgetPresentation');
  assert.equal(node('provider').label, 'WidgetFamilyProvider(store, executionRoot)');
  assert.ok(pathway.edges.some((edge) => edge.from === 'widget.pick.observe' && edge.to === 'widget.pick.state' && edge.kind === 'RETURN'));
  assert.ok(pathway.edges.some((edge) => edge.from === 'widget.pick.effect' && edge.to === 'widget.pick.method'));
  assert.equal(pathway.returnRef, 'widget.pick.display');
});

test('a closure that reaches no Family stays a direct registration', () => {
  const { lens } = project();
  const ping = lens.pathways.find((entry) => entry.pathwayRef === 'pathway.other.ping');
  assert.equal(ping.disposition, 'DIRECT_REGISTRATION');
  const idle = lens.pathways.find((entry) => entry.pathwayRef === 'pathway.nothing');
  assert.equal(idle.summary, 'Registered, with no product effect yet.');
  assert.equal(idle.nodes.find((node) => node.ref === 'nothing.registration').summary, 'No product effect yet.');
});

test('direct registrations resolve receivers to owners, controllers and parameters', () => {
  const { lens } = project();
  const clear = lens.pathways.find((entry) => entry.pathwayRef === 'pathway.log.clear');
  assert.equal(clear.disposition, 'DIRECT_REGISTRATION');
  const node = (slot) => clear.nodes.find((entry) => entry.ref === `log.clear.${slot}`);
  assert.equal(node('owner-logger').role, 'CHRONOLOGY');
  assert.equal(node('owner-logger').label, 'VexLogger');
  assert.equal(node('calls-lab').label, 'LabController');
  assert.equal(node('dep-repositories-things').role, 'STORE');
  const save = lens.pathways.find((entry) => entry.pathwayRef === 'pathway.settings.save');
  const repo = save.nodes.find((entry) => entry.ref === 'settings.save.owner-repository');
  assert.equal(repo.label, 'SettingsRepository');
  assert.equal(repo.role, 'STORE');
  assert.equal(save.nodes.find((entry) => entry.ref === 'settings.save.registration').symbol, 'settingsRegistrations');
  assert.equal(lens.pathways.find((entry) => entry.pathwayRef === 'pathway.log.clear').nodes.find((entry) => entry.ref === 'log.clear.registration').symbol, 'HomeScreen.appActionRegistrations');
});

test('typed intents become shared navigation and presentation templates', () => {
  const { lens, report } = project();
  const home = lens.screens[0];
  const go = home.elements.find((element) => element.ref === 'element.home.body.group.actions.go');
  assert.equal(go.navigatesTo, 'screen.settings');
  assert.equal(lens.pathways.find((entry) => entry.pathwayRef === go.pathwayRef).disposition, 'TYPED_NAVIGATION');
  const open = lens.pathways.find((entry) => entry.pathwayRef === 'pathway.home.open.Sheet');
  assert.equal(open.disposition, 'TYPED_PRESENTATION');
  assert.ok(open.nodes.some((node) => node.label === 'SheetView(…)' && node.role === 'PROJECTION'));
  assert.ok(open.nodes.some((node) => node.face === 'DEPTH' && node.label === 'repositories.things'));
  assert.equal(open.returnRef, 'home.open.Sheet.renderer');
  const swap = lens.pathways.find((entry) => entry.pathwayRef === typedPathwayRef('home', parseIntent('close(Sheet).then(open(Panel))')));
  assert.deepEqual(swap.nodes.filter((node) => node.role === 'NAVIGATION').map((node) => node.label), ['Close(Sheet)', 'Open(Panel)']);
  assert.deepEqual(report.held, [{ elementRef: 'element.home.body.orphan', reason: 'no registration for AppActions.Missing' }]);
});

test('an unresolved localEffect stays held instead of becoming false typed presentation', () => {
  const variant = new Map(files);
  variant.set(`${APP}screens/primary/home/HomeScreen.kt`, files.get(`${APP}screens/primary/home/HomeScreen.kt`).replace('intent = invoke(AppActions.Ping)', 'intent = localEffect()'));
  const { lens, report } = project({ files: variant });
  const ping = lens.screens[0].elements.find((element) => element.ref === 'element.home.body.ping');
  assert.equal(ping.intent, 'localEffect()');
  assert.equal(ping.pathwayRef, undefined);
  assert.ok(report.held.some((entry) => entry.elementRef === ping.ref && /not source-proven/.test(entry.reason)));
  assert.equal(lens.pathways.some((entry) => entry.disposition === 'TYPED_PRESENTATION' && entry.nodes[0]?.label === 'localEffect()'), false);
});

test('an ambiguous Family Effect vocabulary is held rather than choosing the first syntactic match', () => {
  const variant = new Map(files);
  variant.set(`${APP}ui/Widget.kt`, files.get(`${APP}ui/Widget.kt`).replace('data class Persist(val choice: Parameter.Choice) : Effect', 'data class Persist(val choice: Parameter.Choice) : Effect\n        data class Mirror(val choice: Parameter.Choice) : Effect'));
  const { lens, report } = project({ files: variant });
  const pick = lens.screens[0].elements.find((element) => element.ref === 'element.home.body.pick');
  assert.equal(pick.pathwayRef, undefined);
  assert.ok(report.held.some((entry) => entry.elementRef === pick.ref && /ambiguous Family traversal/.test(entry.reason)));
});

test('chrome is one owner with slots, menu kinds and always-visible controls', () => {
  const { lens } = project();
  const [chrome] = lens.chrome;
  assert.equal(chrome.chromeRef, 'chrome.shell');
  const byRef = Object.fromEntries(chrome.elements.map((element) => [element.ref, element]));
  assert.equal(byRef['element.shell.toolbar'].slot, 'TOP');
  assert.equal(byRef['element.shell.nav'].visibleWhen, 'runtime.isPrimary()');
  assert.equal(byRef['element.shell.options'].kind, 'MENU');
  assert.equal(byRef['element.settings'].kind, 'MENU_ITEM');
  assert.equal(byRef['element.settings'].navigatesTo, 'screen.settings');
  assert.equal(byRef['element.shell.add'].label, '+');
  assert.equal(byRef['element.shell.back'].alwaysVisible, true);
  assert.equal(byRef['element.shell.back'].navigatesTo, 'BACK');
  assert.equal(byRef['element.nav.home'].label, 'Home');
  assert.equal(byRef['element.shell.back'].parentRef, 'element.shell.toolbar');
  assert.equal(byRef['element.shell.toolbar'].parentRef, null, 'root is skipped unless includeRoot');
  const rooted = projectAndroidScreenLens({ adapter: { ...adapter, chrome: { ...adapter.chrome, includeRoot: true } }, files }).lens;
  assert.equal(rooted.chrome[0].elements.find((element) => element.ref === 'element.shell.toolbar').parentRef, 'element.shell.root');
  const toggle = lens.pathways.find((entry) => entry.pathwayRef === 'pathway.shell.toggle.Options');
  assert.equal(toggle.nodes[1].label, 'Toggle(element.shell.options)');
});

test('the generated lens is valid, laid out without overlap, and deterministic', () => {
  const { lens } = project();
  const normalized = normalizeScreenLens(lens);
  assert.equal(normalized.entryElementRef, 'element.home.body.pick');
  assert.match(lens.sourceSnapshot.notes[0], new RegExp(`Generated by ${ADAPTER_VERSION}`));
  assert.equal(lens.sourceSnapshot.observedAt, '2026-11-01');
  for (const pathway of normalized.pathways) {
    for (const face of ['BEHAVIOR', 'DEPTH']) {
      const graph = faceGraph(pathway, face);
      if (graph.nodes.length) assert.deepEqual(layoutCollisions(layoutLensFace(graph)), [], `${pathway.pathwayRef} ${face}`);
    }
  }
  const map = screenMapGraph(normalized);
  assert.deepEqual(layoutCollisions(layoutLensFace(map)), []);
  assert.deepEqual(project().lens, lens);
  const noStrings = projectAndroidScreenLens({ adapter: { ...adapter, stringResources: undefined }, files }).lens;
  assert.equal(noStrings.screens[0].elements.find((element) => element.ref === 'element.home.body.pick').label, 'Pick label');
  assert.match(noStrings.sourceSnapshot.notes[1], /string resource names/);
});

test('the overlay adds human knowledge and fails loudly on refs that do not exist', () => {
  const overlay = {
    schemaVersion: SCREEN_LENS_OVERLAY_SCHEMA,
    summary: 'Overlay summary',
    screens: { 'screen.home': { summary: 'Human summary' } },
    elements: { 'element.home.body.pick': { label: 'Pick a widget' } },
    pathways: {
      'pathway.widget.pick': {
        label: 'Pick',
        returnRef: 'widget.pick.extra',
        nodes: { 'widget.pick.control': { summary: 'Sharper.' } },
        addNodes: [{ ref: 'widget.pick.extra', face: 'DEPTH', role: 'STATE', label: 'Extra fence' }],
        removeEdges: [{ from: 'widget.pick.result', to: 'widget.pick.observe' }],
        addEdges: [{ from: 'widget.pick.result', to: 'widget.pick.extra', label: 'settle?' }, { from: 'widget.pick.extra', to: 'widget.pick.observe', label: 'admit' }],
      },
    },
    notes: [{ ref: 'note.pick', subjectRef: 'element.home.body.pick', text: 'Note', detail: 'Attached.' }],
  };
  const { lens } = project({ overlay });
  normalizeScreenLens(lens);
  assert.equal(lens.summary, 'Overlay summary');
  assert.equal(lens.screens[0].summary, 'Human summary');
  assert.equal(lens.screens[0].elements.find((element) => element.ref === 'element.home.body.pick').label, 'Pick a widget');
  const pathway = lens.pathways.find((entry) => entry.pathwayRef === 'pathway.widget.pick');
  assert.equal(pathway.label, 'Pick');
  assert.equal(pathway.nodes.find((node) => node.ref === 'widget.pick.control').summary, 'Sharper.');
  assert.ok(!pathway.edges.some((edge) => edge.from === 'widget.pick.result' && edge.to === 'widget.pick.observe'));
  assert.equal(pathway.returnRef, 'widget.pick.extra', 'STRICT applies the current accepted return coordinate');
  assert.equal(lens.annotations.length, 1);
  for (const broken of [
    { screens: { 'screen.nope': {} } },
    { elements: { 'element.nope': {} } },
    { pathways: { 'pathway.nope': {} } },
    { pathways: { 'pathway.widget.pick': { nodes: { 'widget.pick.nope': {} } } } },
  ]) {
    assert.throws(() => applyOverlay(lens, { schemaVersion: SCREEN_LENS_OVERLAY_SCHEMA, ...broken }), /does not have/);
  }
  assert.throws(() => applyOverlay(lens, { schemaVersion: 'x' }), /overlay schemaVersion/);
});

test('adapter config and inputs fail closed', () => {
  assert.throws(() => projectAndroidScreenLens({ adapter: { ...adapter, schemaVersion: 'x' }, files }), /adapter schemaVersion/);
  assert.throws(() => projectAndroidScreenLens({ adapter: { ...adapter, title: '' }, files }), /adapter title/);
  assert.throws(() => projectAndroidScreenLens({ adapter: { ...adapter, repository: { url: 'x' } }, files }), /repository/);
  assert.throws(() => projectAndroidScreenLens({ adapter: { ...adapter, sources: { ...adapter.sources, session: undefined } }, files }), /sources\.session/);
  assert.throws(() => projectAndroidScreenLens({ adapter, files: {} }), /Map/);
  assert.throws(() => projectAndroidScreenLens({ adapter: { ...adapter, sources: { ...adapter.sources, appActions: 'nope:x.kt' } }, files }), /unknown root nope/);
  assert.throws(() => projectAndroidScreenLens({ adapter: { ...adapter, sources: { ...adapter.sources, appActions: 'app:missing.kt' } }, files }), /missing source/);
  const noChrome = projectAndroidScreenLens({ adapter: { ...adapter, chrome: undefined, entry: undefined }, files }).lens;
  assert.deepEqual(noChrome.chrome, []);
  assert.equal(noChrome.entryScreenRef, 'screen.home');
});

// [VXG RealForever][VEXWORK][VEXBOARD][SCREEN-LENS][ANDROID-ADAPTER-TEST]

test('lenient overlay skips entries an older commit lacks, lists them, and still normalizes', () => {
  const overlay = {
    schemaVersion: SCREEN_LENS_OVERLAY_SCHEMA,
    screens: { 'screen.home': { summary: 'Kept' }, 'screen.gone': { summary: 'Skipped' } },
    elements: { 'element.gone': { label: 'Skipped' } },
    pathways: {
      'pathway.gone': { label: 'Skipped' },
      'pathway.widget.pick': {
        nodes: { 'widget.pick.gone': { summary: 'Skipped' } },
        addEdges: [{ from: 'widget.pick.control', to: 'widget.pick.nowhere', label: 'dangling' }],
      },
    },
    notes: [
      { ref: 'note.kept', subjectRef: 'element.home.body.pick', text: 'Kept' },
      { ref: 'note.orphan', subjectRef: 'element.gone', text: 'Skipped' },
    ],
  };
  const { lens, report } = project({ overlay, overlayMode: 'LENIENT' });
  normalizeScreenLens(lens);
  assert.equal(lens.screens[0].summary, 'Kept');
  assert.deepEqual(lens.annotations.map((note) => note.ref), ['note.kept']);
  assert.deepEqual(report.overlayMisses, ['screen.gone', 'element.gone', 'pathway.gone', 'widget.pick.gone', 'structural-add:widget.pick.control->widget.pick.nowhere', 'note.orphan']);
  assert.match(lens.sourceSnapshot.notes.at(-1), /^6 overlay entries do not apply at this commit and were skipped: screen\.gone/);
  assert.throws(() => project({ overlay, overlayMode: 'STRICT' }), /does not have/);
  assert.throws(() => project({ overlay, overlayMode: 'MAYBE' }), /overlayMode/);
  const one = applyOverlayWithReport(lens, { schemaVersion: SCREEN_LENS_OVERLAY_SCHEMA, screens: { 'screen.gone': {} } }, { strict: false });
  assert.deepEqual(one.misses, ['screen.gone']);
  assert.match(one.lens.sourceSnapshot.notes.at(-1), /^1 overlay entry does not apply at this commit and was skipped/);
  assert.deepEqual(project({ overlay: null }).report.overlayMisses, []);
});

test('lenient historical overlay applies descriptive fields but skips source-sensitive fields on existing refs', () => {
  const base = project().lens;
  const home = base.screens.find((screen) => screen.screenRef === 'screen.home');
  const element = home.elements[0];
  const pathway = base.pathways.find((entry) => entry.pathwayRef === element.pathwayRef) ?? base.pathways[0];
  const node = pathway.nodes[0];

  const overlay = {
    schemaVersion: SCREEN_LENS_OVERLAY_SCHEMA,
    screens: {
      'screen.home': {
        summary: 'Current descriptive screen summary.',
        elements: [],
      },
    },
    elements: {
      [element.ref]: {
        label: 'Current descriptive element label.',
        pathwayRef: 'pathway.future',
      },
    },
    pathways: {
      [pathway.pathwayRef]: {
        label: 'Current descriptive pathway label.',
        disposition: 'DIRECT_REGISTRATION',
        nodes: {
          [node.ref]: {
            summary: 'Current descriptive node summary.',
            role: 'STATE',
          },
        },
      },
    },
  };

  const { lens, misses } = applyOverlayWithReport(base, overlay, { strict: false });
  normalizeScreenLens(lens);

  const nextHome = lens.screens.find((screen) => screen.screenRef === 'screen.home');
  const nextElement = nextHome.elements.find((candidate) => candidate.ref === element.ref);
  const nextPathway = lens.pathways.find((candidate) => candidate.pathwayRef === pathway.pathwayRef);
  const nextNode = nextPathway.nodes.find((candidate) => candidate.ref === node.ref);

  assert.equal(nextHome.summary, 'Current descriptive screen summary.');
  assert.equal(nextHome.elements.length, home.elements.length, 'historical screen structure is source-owned');
  assert.equal(nextElement.label, 'Current descriptive element label.');
  assert.equal(nextElement.pathwayRef, element.pathwayRef, 'historical element linkage is source-owned');
  assert.equal(nextPathway.label, 'Current descriptive pathway label.');
  assert.equal(nextPathway.disposition, pathway.disposition, 'historical pathway disposition is source-owned');
  assert.equal(nextNode.summary, 'Current descriptive node summary.');
  assert.equal(nextNode.role, node.role, 'historical node role is source-owned');

  assert.ok(misses.includes('structural-field:screen.home.elements'));
  assert.ok(misses.includes(`structural-field:${element.ref}.pathwayRef`));
  assert.ok(misses.includes(`structural-field:${pathway.pathwayRef}.disposition`));
  assert.ok(misses.includes(`structural-field:${node.ref}.role`));
});

test('the read plan names exactly the files the adapter reads', () => {
  const plan = adapterReadPlan(adapter);
  assert.ok(plan.prefixes.every((prefix) => prefix.endsWith('/')));
  for (const path of files.keys()) assert.equal(plan.includes(path), true, path);
  assert.equal(plan.includes(`${APP}screens/README.md`), false, 'only Kotlin under a read prefix');
  assert.equal(plan.includes('app/src/main/kotlin/elsewhere/Thing.kt'), false);
  assert.throws(() => adapterReadPlan({ ...adapter, read: ['nope:screens/'] }), /root nope/);
  assert.deepEqual(adapterReadPlan({ ...adapter, read: ['plain/path'] }).prefixes, ['plain/path/']);
});


test('lenient historical overlay never injects current structural nodes or edge rewrites', () => {
  const base = project().lens;
  const overlay = {
    schemaVersion: SCREEN_LENS_OVERLAY_SCHEMA,
    pathways: {
      'pathway.widget.pick': {
        label: 'Current interpretation label',
        returnRef: 'widget.pick.future',
        nodes: { 'widget.pick.control': { summary: 'Current descriptive interpretation.' } },
        addNodes: [{ ref: 'widget.pick.future', face: 'BEHAVIOR', role: 'PROJECTION', label: 'Future source construct' }],
        removeEdges: [{ from: 'widget.pick.intent', to: 'widget.pick.runtime' }],
        addEdges: [{ from: 'widget.pick.display', to: 'widget.pick.future', label: 'future' }],
      },
    },
    notes: [{ ref: 'note.future', subjectRef: 'widget.pick.future', text: 'Future note' }],
  };
  const { lens, misses } = applyOverlayWithReport(base, overlay, { strict: false });
  const pathway = lens.pathways.find((entry) => entry.pathwayRef === 'pathway.widget.pick');
  assert.equal(pathway.label, 'Current interpretation label');
  assert.equal(pathway.nodes.find((node) => node.ref === 'widget.pick.control').summary, 'Current descriptive interpretation.');
  assert.equal(pathway.nodes.some((node) => node.ref === 'widget.pick.future'), false);
  assert.ok(pathway.edges.some((edge) => edge.from === 'widget.pick.intent' && edge.to === 'widget.pick.runtime'));
  assert.equal(pathway.edges.some((edge) => edge.to === 'widget.pick.future'), false);
  assert.notEqual(pathway.returnRef, 'widget.pick.future');
  assert.ok(misses.includes('structural-node:widget.pick.future'));
  assert.ok(misses.includes('structural-remove:widget.pick.intent->widget.pick.runtime'));
  assert.ok(misses.includes('structural-add:widget.pick.display->widget.pick.future'));
  assert.ok(misses.includes('note.future'));
  normalizeScreenLens(lens);
});
