import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  SCREEN_LENS_ADAPTER_SCHEMA,
  projectAndroidScreenLens,
} from '../src/core/vexboard-screen-lens-android-adapter.mjs';
import * as Lens from '../src/shared/vexboard-screen-lens.mjs';

const APP = 'app/src/main/kotlin/com/vextreme/vexlife/android/';
const PLAY_PAUSE = 'element.vexstream-music.body.player.play-pause';
const PLAYBACK = 'pathway.vexstream.playback.play-pause';

const files = new Map(Object.entries({
  [`${APP}screens/AppScreens.kt`]: `
object AppScreens {
    val primary: List<AppScreenBlueprint> = listOf()
    val shared: List<AppScreenBlueprint> = listOf(
        VexStreamMusicScreen,
    )
}`,
  [`${APP}screens/AppScreenBlueprint.kt`]: `
internal class ScreenActionContext()
`,
  [`${APP}runtime/AppActions.kt`]: `object AppActions {}`,
  [`${APP}shell/AppShell.kt`]: `object AppShell {}`,
  [`${APP}ui/Session.kt`]: `internal fun sessionMarker() = Unit`,
  [`${APP}runtime/VexRuntime.kt`]: `internal class VexRuntime`,
  [`${APP}shell/AppFrame.kt`]: `internal fun AppFrame() = Unit`,

  [`${APP}screens/shared/vexstream/VexStreamMusicScreen.kt`]: `
object VexStreamMusicScreen : AppScreenBlueprint(
    screenKey = "vexstream-music",
    titleRes = R.string.vexstream_music_title,
) {
    val TogglePlayback = buttonRef(
        id = "body.player.play-pause",
        labelRes = R.string.vexstream_music_play_pause,
        intent = localEffect(),
    )
    val LocalOnly = buttonRef(
        id = "body.local-only",
        intent = localEffect(),
    )

    override val content = layout {
        column("body") {
            column("player") {
                button(TogglePlayback)
            }
            button(LocalOnly)
        }
    }
}
`,
  [`${APP}screens/shared/vexstream/VexStreamPlayerPresentation.kt`]: `
internal fun VexStreamMiniPlayer(
    playbackExperience: VexStreamPlaybackExperience,
) {
    val handler = ElementActionHandler { element ->
        when (element) {
            VexStreamMusicScreen.TogglePlayback ->
                playbackExperience.activate(
                    VexStreamPlaybackControl.PlayPause,
                )
        }
    }
}

internal fun VexStreamFullPlayerSheet(
    playbackExperience: VexStreamPlaybackExperience,
) {
    val handler = ElementActionHandler { element ->
        when (element) {
            VexStreamMusicScreen.TogglePlayback ->
                playbackExperience.activate(
                    VexStreamPlaybackControl.PlayPause,
                )
        }
    }
}
`,
  [`${APP}vexstream/playback/VexStreamPlaybackFamily.kt`]: `
sealed interface VexStreamPlaybackFamily :
    VexBehaviorFamily<VexStreamPlaybackFamily>
`,
  [`${APP}vexstream/playback/VexStreamPlaybackState.kt`]: `
sealed interface VexStreamPlaybackState :
    VexBehaviorFamily.State<VexStreamPlaybackFamily> {
    data object NoMedia : VexStreamPlaybackState
    data class Media(val playRequested: Boolean) : VexStreamPlaybackState
    data class Ended(val restartAvailable: Boolean) : VexStreamPlaybackState
}
`,
  [`${APP}vexstream/playback/VexStreamPlaybackControl.kt`]: `
enum class VexStreamPlaybackControl :
    VexBehaviorFamily.Control<VexStreamPlaybackFamily> {
    PlayPause,
}

internal fun VexBehaviorBlueprint<
    VexStreamPlaybackFamily,
    VexStreamPlaybackState,
    VexStreamPlaybackAct,
    VexStreamPlaybackEffect
>.vexStreamPlaybackControls() =
    controls<VexStreamPlaybackControl> {
        control(
            VexStreamPlaybackControl.PlayPause,
            VexStreamPlaybackAct.Play,
            VexStreamPlaybackAct.Pause,
        )
    }
`,
  [`${APP}vexstream/playback/VexStreamPlaybackAct.kt`]: `
sealed interface VexStreamPlaybackAct :
    VexBehaviorFamily.Act<VexStreamPlaybackFamily> {
    data object Play : VexStreamPlaybackAct
    data object Pause : VexStreamPlaybackAct
}
`,
  [`${APP}vexstream/playback/VexStreamPlaybackEffect.kt`]: `
sealed interface VexStreamPlaybackEffect :
    VexBehaviorFamily.Effect<VexStreamPlaybackFamily> {
    data object RequestPlay : VexStreamPlaybackEffect
    data object RequestPause : VexStreamPlaybackEffect
    data object RestartCurrent : VexStreamPlaybackEffect
}
`,
  [`${APP}vexstream/playback/VexStreamPlaybackBehavior.kt`]: `
internal fun vexStreamPlaybackBehavior():
    VexBehaviorBlueprint<
        VexStreamPlaybackFamily,
        VexStreamPlaybackState,
        VexStreamPlaybackAct,
        VexStreamPlaybackEffect
    > =
    vexBehaviorBlueprint(
        behaviorRef = "vexstream.playback",
    ) {
        state<VexStreamPlaybackState.Media> {
            on(
                act = VexStreamPlaybackAct.Play,
                effect = VexStreamPlaybackEffect.RequestPlay,
            ).stay()
            on(
                act = VexStreamPlaybackAct.Pause,
                effect = VexStreamPlaybackEffect.RequestPause,
            ).stay()
        }
        state<VexStreamPlaybackState.Ended> {
            on(
                act = VexStreamPlaybackAct.Play,
                effect = VexStreamPlaybackEffect.RestartCurrent,
            ).stay()
        }
    }
`,
  [`${APP}vexstream/playback/VexStreamPlaybackTypes.kt`]: `
internal typealias VexStreamPlaybackConnection =
    VexPort<
        VexStreamPlaybackFamily,
        VexStreamPlaybackState,
        VexStreamPlaybackControl,
        VexStreamPlaybackAct
    >

internal typealias VexStreamPlaybackConnectionFlow =
    VexPortFlow<
        VexStreamPlaybackFamily,
        VexStreamPlaybackState,
        VexStreamPlaybackControl,
        VexStreamPlaybackAct
    >

internal typealias VexStreamPlaybackProjection =
    VexBehaviorProjection<
        VexStreamPlaybackFamily,
        VexStreamPlaybackState,
        VexStreamPlaybackControl,
        VexStreamPlaybackAct
    >
`,
  [`${APP}vexstream/playback/VexStreamPlaybackExperience.kt`]: `
internal interface VexStreamPlaybackExperience {
    val displayState: VexStreamPlaybackDisplayState
    fun activate(
        control: VexStreamPlaybackControl,
    )
}

private class CurrentVexStreamPlaybackExperience(
    override val displayState: VexStreamPlaybackDisplayState,
    private val connection: VexStreamPlaybackConnection?,
) : VexStreamPlaybackExperience {
    override fun activate(
        control: VexStreamPlaybackControl,
    ) {
        connection?.activate(
            control,
        )
    }
}
`,
  [`${APP}vexstream/playback/VexStreamPlaybackConnectionViewModel.kt`]: `
internal class VexStreamPlaybackConnectionViewModel(
    application: Application,
) {
    var connection: VexStreamPlaybackConnectionFlow? = null
    private var media3Connection: Media3VexStreamPlaybackConnection? = null

    fun connect(controller: MediaController) {
        val playbackConnection = Media3VexStreamPlaybackConnection(controller)
        media3Connection = playbackConnection
        connection = playbackConnection
    }
}
`,
  [`${APP}vexstream/playback/Media3VexStreamPlaybackConnection.kt`]: `
internal class Media3VexStreamPlaybackConnection(
    private val controller: MediaController,
) : VexStreamPlaybackConnectionFlow {
    private val behavior = vexStreamPlaybackBehavior()
    private val controls = behavior.vexStreamPlaybackControls()
    private var pending = VexStreamPlaybackPending()
    private val listener = object : Player.Listener {}

    override fun activate(
        control: VexStreamPlaybackControl,
    ) {
        val current =
            reconcileVexStreamPlaybackObservation(
                observed = controller.state,
                pending = pending,
            ).state
        val act = controls.resolve(current = current, control = control)?.act ?: return
        val relationship = behavior.resolve(current = current, act = act) ?: return
        val effect = relationship.effect
        val admitted = current.afterIntent(effect)
        publish(admitted)
        realize(effect)
        publishObserved(controller)
    }

    private fun realize(effect: VexStreamPlaybackEffect) = Unit

    private fun publishObserved(player: MediaController) {
        publish(
            reconcileVexStreamPlaybackObservation(
                observed = player.state,
                pending = pending,
            ).state,
        )
    }

    private fun publish(state: VexStreamPlaybackState) = Unit
}
`,
  [`${APP}vexstream/playback/VexStreamPlaybackPending.kt`]: `
internal data class VexStreamPlaybackPending(val playRequested: Boolean? = null)
internal data class VexStreamPlaybackReconciliation(
    val state: VexStreamPlaybackState,
    val pending: VexStreamPlaybackPending,
)

internal fun VexStreamPlaybackState.afterIntent(
    effect: VexStreamPlaybackEffect,
): VexStreamPlaybackState = this

internal fun reconcileVexStreamPlaybackObservation(
    observed: VexStreamPlaybackState,
    pending: VexStreamPlaybackPending,
): VexStreamPlaybackReconciliation =
    VexStreamPlaybackReconciliation(observed, pending)
`,
  [`${APP}vexstream/playback/VexStreamPlaybackDisplayState.kt`]: `
internal sealed interface VexStreamPlaybackDisplayState
`,
  ['app/src/main/res/values/strings.xml']: `
<resources>
  <string name="vexstream_music_title">VexStream</string>
  <string name="vexstream_music_play_pause">Play / Pause</string>
</resources>
`,
}));

const adapter = {
  schemaVersion: SCREEN_LENS_ADAPTER_SCHEMA,
  lensRef: 'lens.vexstream.behavior-port-fixture',
  title: 'VexStream Behavior Port fixture',
  entry: { screenRef: 'screen.vexstream-music', elementRef: PLAY_PAUSE },
  repository: {
    ref: 'repo.vexlife-android',
    url: 'https://github.com/vgong24/VexLife-Android',
    commit: '305a09eac1fabebcf2241bd207386950f41121f2',
    roots: { app: APP },
  },
  read: ['app:screens/', 'app:runtime/', 'app:shell/', 'app:ui/', 'app:vexstream/playback/'],
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
};

const referenceSource = JSON.parse(fs.readFileSync(new URL('../projects/vexboard/examples/vexlife-android-vexstream-playback.screen-lens.reference.json', import.meta.url), 'utf8'));
const reference = Lens.normalizeScreenLens(referenceSource);

const pathwaySignature = (pathway) => ({
  pathwayRef: pathway.pathwayRef,
  disposition: pathway.disposition,
  returnRef: pathway.returnRef,
  nodes: pathway.nodes.map((node) => ({
    ref: node.ref,
    face: node.face,
    role: node.role,
    symbol: node.symbol,
    source: node.source,
  })),
  edges: pathway.edges.map((edge) => ({
    from: edge.from,
    to: edge.to,
    kind: edge.kind,
  })),
});

const project = (inputFiles = files) => projectAndroidScreenLens({
  adapter,
  files: inputFiles,
  observedAt: '2026-11-04',
});

test('behavior-port source shape reproduces the stable Playback reference structure', () => {
  const { lens, report } = project();
  const generated = Lens.normalizeScreenLens(lens);
  const pathway = Lens.pathwayForElement(generated, PLAY_PAUSE);
  const oracle = Lens.pathwayFor(reference, PLAYBACK);

  assert.equal(pathway.pathwayRef, PLAYBACK);
  assert.deepEqual(pathwaySignature(pathway), pathwaySignature(oracle));
  assert.equal(pathway.label, oracle.label);
  assert.deepEqual(
    pathway.nodes.map((node) => [node.ref, node.label]),
    oracle.nodes.map((node) => [node.ref, node.label]),
  );
  assert.deepEqual(
    pathway.edges.map((edge) => [edge.from, edge.to, edge.label]),
    oracle.edges.map((edge) => [edge.from, edge.to, edge.label]),
  );
  assert.equal(
    pathway.nodes.find((node) => node.ref.endsWith('.doorway')).code,
    oracle.nodes.find((node) => node.ref.endsWith('.doorway')).code,
  );
  assert.deepEqual(report.bonds.filter((bond) => bond.via === 'BEHAVIOR_PORT'), [{
    elementRef: PLAY_PAUSE,
    via: 'BEHAVIOR_PORT',
    family: 'VexStreamPlaybackFamily',
    control: 'PlayPause',
  }]);
});

test('an unrelated unproven localEffect stays visible without an invented generic pathway', () => {
  const { lens } = project();
  const generated = Lens.normalizeScreenLens(lens);
  const element = Lens.elementFor(generated, 'element.vexstream-music.body.local-only');
  assert.equal(element.pathwayRef, null);
  assert.equal(generated.pathways.some((pathway) => pathway.pathwayRef === 'pathway.vexstream-music.local-effect'), false);
});

test('the behavior-port projector fails closed when the Experience no longer forwards the Control', () => {
  const broken = new Map(files);
  const path = `${APP}vexstream/playback/VexStreamPlaybackExperience.kt`;
  broken.set(path, broken.get(path).replace('connection?.activate(\n            control,\n        )', 'Unit'));

  const { lens, report } = project(broken);
  const generated = Lens.normalizeScreenLens(lens);
  const element = Lens.elementFor(generated, PLAY_PAUSE);
  assert.equal(element.pathwayRef, null);
  assert.equal(report.bonds.filter((bond) => bond.via === 'BEHAVIOR_PORT').length, 0);
});

// [VXG RealForever][VEXWORK][VEXBOARD][SCREEN-LENS][BEHAVIOR-PORT]
