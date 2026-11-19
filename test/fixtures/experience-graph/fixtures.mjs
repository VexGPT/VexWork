// Synthetic VexLife-Prod-shaped Kotlin sources for Experience Relationship Graph tests.
//
// Each Family reproduces one act() form observed in real VexLife-Prod source (pinned in
// projects/vexlife-prod-end-to-end-tests/experience-graph/source-plan.json), reduced to the smallest
// text that exercises it. They are test inputs, not Product truth.

export const SIGHT = `package vexlife.sight

import vexlife.semantic.VexFamilyContract

/** Nested when(control) -> when(currentState), Held(reason) guard, observe + display projection. */
object VexLifeSightFamily :
    VexFamilyContract<
        VexLifeSightFamily,
        VexLifeSightFamily.State,
        VexLifeSightFamily.Control,
        VexLifeSightFamily.Effect,
    >() {
    sealed interface State : VexFamilyContract.State<VexLifeSightFamily> {
        val stateRef: String
    }

    enum class HoldReason {
        /** Route missing. */
        RouteUnreachable,
        ScreenSafetyNotCurrent,
    }

    data class Held(val reason: HoldReason) : State {
        override val stateRef: String = StateHeld
    }

    data object Ready : State {
        override val stateRef: String = StateReady
    }

    data object Engaged : State {
        override val stateRef: String = StateEngaged
    }

    sealed interface Control : VexFamilyContract.Control<VexLifeSightFamily> {
        val controlRef: String
    }

    data object Engage : Control {
        override val controlRef: String = ControlEngage
    }

    data object Stop : Control {
        override val controlRef: String = ControlStop
    }

    sealed interface Effect : VexFamilyContract.Effect<VexLifeSightFamily> {
        data object EngageScope : Effect

        data object StopScope : Effect
    }

    fun observe(routeReachable: Boolean, scopeState: String?): State =
        when {
            !routeReachable -> Held(HoldReason.RouteUnreachable)
            scopeState == null -> Ready
            scopeState == "ENGAGED" -> Engaged
            else -> Held(HoldReason.ScreenSafetyNotCurrent)
        }

    override fun act(
        currentState: State,
        control: Control,
    ): Act<VexLifeSightFamily, State, Effect>? =
        when (control) {
            Engage ->
                when (currentState) {
                    Ready -> stay(Effect.EngageScope)
                    else -> null
                }

            Stop ->
                when (currentState) {
                    Engaged -> stay(Effect.StopScope)
                    // A held scope can still be released.
                    is Held ->
                        if (currentState.reason == HoldReason.ScreenSafetyNotCurrent) {
                            stay(Effect.StopScope)
                        } else {
                            null
                        }

                    else -> null
                }
        }

    override fun displayStateFor(state: State): DisplayState =
        when (state) {
            is Held -> DisplayState(primaryControlRef = ControlStop)
            Ready -> DisplayState(primaryControlRef = ControlEngage)
            Engaged -> DisplayState(primaryControlRef = ControlStop)
        }

    const val StateHeld = "HELD"
    const val StateReady = "READY"
    const val StateEngaged = "ENGAGED"
    const val ControlEngage = "ENGAGE"
    const val ControlStop = "STOP"
}
`;

export const DICTATION = `package vexlife.dictation

import vexlife.semantic.VexFamilyContract

/** Outer when(currentState), multi-label branch, admit(State, Effect), top-level Effects. */
object VexLifeDictationFamily :
    VexFamilyContract<
        VexLifeDictationFamily,
        VexLifeDictationFamily.State,
        VexLifeDictationFamily.Control,
        VexLifeDictationFamily.Effect,
    >() {
    sealed interface State : VexFamilyContract.State<VexLifeDictationFamily> {
        val stateRef: String
    }

    data object Ready : State {
        override val stateRef: String = StateReady
    }

    data object Requesting : State {
        override val stateRef: String = StateRequesting
    }

    data object Listening : State {
        override val stateRef: String = StateListening
    }

    data object Stopping : State {
        override val stateRef: String = StateStopping
    }

    data class Failed(
        val reason: FailureReason,
    ) : State {
        override val stateRef: String = StateFailed
    }

    enum class FailureReason(val reasonRef: String) {
        Permission("PERMISSION"),
        Unknown("UNKNOWN"),
    }

    sealed interface Control : VexFamilyContract.Control<VexLifeDictationFamily> {
        val controlRef: String
    }

    data object Start : Control {
        override val controlRef: String = ControlStart
    }

    data object Stop : Control {
        override val controlRef: String = ControlStop
    }

    sealed interface Effect : VexFamilyContract.Effect<VexLifeDictationFamily> {
        val effectRef: String
    }

    data object BeginDictation : Effect {
        override val effectRef: String = EffectBeginDictation
    }

    data object EndDictation : Effect {
        override val effectRef: String = EffectEndDictation
    }

    fun observeStarted(): State = Listening

    fun observeFailure(reason: FailureReason): State = Failed(reason)

    override fun act(
        currentState: State,
        control: Control,
    ): Act<VexLifeDictationFamily, State, Effect>? =
        when (currentState) {
            Ready,
            is Failed,
            ->
                when (control) {
                    Start ->
                        admit(
                            Requesting,
                            BeginDictation,
                        )
                    Stop -> null
                }

            Requesting,
            Listening,
            ->
                when (control) {
                    Start -> null
                    Stop ->
                        admit(
                            Stopping,
                            EndDictation,
                        )
                }

            Stopping -> null
        }

    override fun displayStateFor(state: State): DisplayState =
        when (state) {
            Ready -> display(primary = Start to Text.Start)
            Requesting -> display(primary = Stop to Text.Stop)
            Listening -> display(primary = Stop to Text.Stop)
            Stopping -> display()
            is Failed -> display(primary = Start to Text.Start)
        }

    const val StateReady = "READY"
    const val StateRequesting = "REQUESTING"
    const val StateListening = "LISTENING"
    const val StateStopping = "STOPPING"
    const val StateFailed = "FAILED"
    const val ControlStart = "START"
    const val ControlStop = "STOP"
    const val EffectBeginDictation = "BEGIN_DICTATION"
    const val EffectEndDictation = "END_DICTATION"
}
`;

export const QUIET = `package vexlife.quiet

import vexlife.semantic.VexFamilyContract

/** Subject-less when with State / Control equality and type tests. */
object VexLifeQuietFamily :
    VexFamilyContract<
        VexLifeQuietFamily,
        VexLifeQuietFamily.State,
        VexLifeQuietFamily.Control,
        VexLifeQuietFamily.Effect,
    >() {
    sealed interface State : VexFamilyContract.State<VexLifeQuietFamily> {
        val stateRef: String
    }

    data object Kept : State {
        override val stateRef: String = StateKept
    }

    data class Quiet(val exchangeCount: Int) : State {
        override val stateRef: String = StateQuiet
    }

    sealed interface Control : VexFamilyContract.Control<VexLifeQuietFamily> {
        val controlRef: String
    }

    data object Begin : Control {
        override val controlRef: String = ControlBegin
    }

    data object End : Control {
        override val controlRef: String = ControlEnd
    }

    data object Clear : Control {
        override val controlRef: String = ControlClear
    }

    sealed interface Effect : VexFamilyContract.Effect<VexLifeQuietFamily> {
        data object BeginQuiet : Effect

        data object EndQuiet : Effect

        data object ClearHistory : Effect
    }

    override fun act(
        currentState: State,
        control: Control,
    ): Act<VexLifeQuietFamily, State, Effect>? =
        when {
            currentState == Kept && control == Begin -> stay(Effect.BeginQuiet)
            currentState is Quiet && control == End -> stay(Effect.EndQuiet)
            control == Clear -> stay(Effect.ClearHistory)
            else -> null
        }

    override fun displayStateFor(state: State): DisplayState =
        when (state) {
            Kept -> DisplayState(primaryControlRef = ControlBegin)
            is Quiet -> DisplayState(primaryControlRef = ControlEnd)
        }

    const val StateKept = "KEPT"
    const val StateQuiet = "QUIET"
    const val ControlBegin = "BEGIN"
    const val ControlEnd = "END"
    const val ControlClear = "CLEAR"
}
`;

export const REVIEW = `package vexlife.review

import vexlife.semantic.VexFamilyContract

/** Block body: narrowing preamble, payload guard, named effect, Family-owned typed ref. */
object VexLifeReviewFamily :
    VexFamilyContract<
        VexLifeReviewFamily,
        VexLifeReviewFamily.State,
        VexLifeReviewFamily.Control,
        VexLifeReviewFamily.Effect,
    >() {
    data class CandidateRef(
        val value: String,
    ) : VexFamilyContract.Parameter<VexLifeReviewFamily> {
        init {
            require(
                value.matches(
                    Regex(
                        "review\\\\.vexlife-prod\\\\.memory\\\\.[0-9a-f]{8}",
                    ),
                ),
            ) {
                "candidate ref is invalid"
            }
        }
    }

    sealed interface State : VexFamilyContract.State<VexLifeReviewFamily>

    data object Idle : State

    data class Pending(
        val candidateRef: CandidateRef,
        val summary: String,
        val candidateClass: VexLifeKindContract.CandidateClass,
    ) : State

    sealed interface Control : VexFamilyContract.Control<VexLifeReviewFamily> {
        val candidateRef: CandidateRef
    }

    data class Keep(
        override val candidateRef: CandidateRef,
    ) : Control {
        override val controlRef: String = ControlKeep
    }

    data class Decline(
        override val candidateRef: CandidateRef,
    ) : Control {
        override val controlRef: String = ControlDecline
    }

    sealed interface Effect : VexFamilyContract.Effect<VexLifeReviewFamily> {
        data class Accept(
            val candidateRef: CandidateRef,
        ) : Effect

        data class Dismiss(
            val candidateRef: CandidateRef,
        ) : Effect
    }

    override fun act(
        currentState: State,
        control: Control,
    ): Act<
        VexLifeReviewFamily,
        State,
        Effect
    >? {
        val pending =
            currentState as? Pending
                ?: return null
        if (
            pending.candidateRef !=
            control.candidateRef
        ) {
            return null
        }

        return when (
            control
        ) {
            is Keep ->
                stay(
                    effect = Effect.Accept(
                        control.candidateRef,
                    ),
                )

            is Decline ->
                stay(
                    Effect.Dismiss(
                        control.candidateRef,
                    ),
                )
        }
    }

    const val ControlKeep =
        "KEEP"
    const val ControlDecline =
        "DECLINE"
}
`;

export const KIND_CONTRACT = `package vexlife.kind

object VexLifeKindContract {
    enum class CandidateClass {
        Preference,
        Fact,
    }
}
`;

export const STOCK = `package vexlife.stock

import vexlife.semantic.VexFamilyContract

/** Axis State: local predicate, if/else, nested if, admit(copy(...)), admit(state =, effect =). */
object VexLifeStockFamily :
    VexFamilyContract<
        VexLifeStockFamily,
        VexLifeStockFamily.State,
        VexLifeStockFamily.Control,
        VexLifeStockFamily.Effect,
    >() {
    sealed interface Presence {
        data object Absent : Presence

        data object Present : Presence
    }

    data class State(
        val presence: Presence,
        val downloading: Boolean,
        val targeted: Boolean,
        val anyDownloadRunning: Boolean,
    ) : VexFamilyContract.State<VexLifeStockFamily>

    sealed interface Control : VexFamilyContract.Control<VexLifeStockFamily> {
        val controlRef: String
    }

    data object Select : Control {
        override val controlRef: String = ControlSelect
    }

    data object Download : Control {
        override val controlRef: String = ControlDownload
    }

    data object Remove : Control {
        override val controlRef: String = ControlRemove
    }

    sealed interface Effect : VexFamilyContract.Effect<VexLifeStockFamily> {
        data object Acquire : Effect

        data object RemoveArtifacts : Effect
    }

    override fun act(
        currentState: State,
        control: Control,
    ): Act<VexLifeStockFamily, State, Effect>? {
        val idle =
            !currentState.downloading &&
                !currentState.anyDownloadRunning
        return when (control) {
            Select ->
                if (
                    !currentState.targeted &&
                        idle
                ) {
                    admit(
                        currentState.copy(
                            targeted = true,
                        ),
                    )
                } else {
                    null
                }
            Download ->
                if (currentState.presence == Presence.Absent && idle)
                    stay(Effect.Acquire)
                else null
            Remove ->
                if (currentState.presence != Presence.Absent && idle) {
                    if (currentState.targeted) {
                        admit(
                            state = currentState.copy(targeted = false),
                            effect = Effect.RemoveArtifacts,
                        )
                    } else {
                        stay(Effect.RemoveArtifacts)
                    }
                } else {
                    null
                }
        }
    }

    override fun displayStateFor(state: State): DisplayState =
        when (state) {
            else -> DisplayState(primaryControlRef = ControlSelect)
        }

    const val ControlSelect = "SELECT"
    const val ControlDownload = "DOWNLOAD"
    const val ControlRemove = "REMOVE"
}
`;

export const GATEWAY = `package vexlife.gateway

import vexlife.semantic.VexFamilyContract

/** class + private constructor + companion instance, helper-built Effect, else -> null, stay(). */
class VexLifeGatewayFamily private constructor() :
    VexFamilyContract<
        VexLifeGatewayFamily,
        VexLifeGatewayFamily.GatewayState,
        VexLifeGatewayFamily.GatewayControl,
        VexLifeGatewayFamily.GatewayEffect,
    >() {

    sealed interface GatewayState : VexFamilyContract.State<VexLifeGatewayFamily> {
        val desiredSha: String
        val stateRef: String
    }

    data class Current(override val desiredSha: String) : GatewayState {
        override val stateRef: String = StateCurrent
    }

    data class UpdateAvailable(override val desiredSha: String) : GatewayState {
        override val stateRef: String = StateUpdate
    }

    sealed interface GatewayControl : VexFamilyContract.Control<VexLifeGatewayFamily> {
        val controlRef: String
    }

    data object OpenCurrent : GatewayControl {
        override val controlRef: String = ControlOpen
    }

    data object Converge : GatewayControl {
        override val controlRef: String = ControlConverge
    }

    data object Cancel : GatewayControl {
        override val controlRef: String = ControlCancel
    }

    sealed interface GatewayEffect : VexFamilyContract.Effect<VexLifeGatewayFamily>

    data object OpenPresentation : GatewayEffect

    data class ConvergeProduct(val desiredSha: String, val allowAcquisition: Boolean) : GatewayEffect

    private fun restartWithoutAcquisition(desiredSha: String): GatewayEffect = ConvergeProduct(desiredSha, false)

    override fun act(
        currentState: GatewayState,
        control: GatewayControl,
    ): Act<
        VexLifeGatewayFamily,
        GatewayState,
        GatewayEffect,
    >? =
        when (currentState) {
            is Current ->
                when (control) {
                    OpenCurrent -> stay(OpenPresentation)

                    Cancel -> stay()

                    else -> null
                }

            is UpdateAvailable ->
                when (control) {
                    Converge ->
                        stay(restartWithoutAcquisition(currentState.desiredSha))

                    Cancel -> stay()

                    else -> null
                }
        }

    const val StateCurrent = "CURRENT"
    const val StateUpdate = "UPDATE_AVAILABLE"
    const val ControlOpen = "OPEN_CURRENT"
    const val ControlConverge = "CONVERGE"
    const val ControlCancel = "CANCEL"

    companion object {
        val Semantics = VexLifeGatewayFamily()
    }
}
`;

export const RUNTIME = `package vexlife.runtime

import vexlife.semantic.VexFamilyContract

/** stay(effect = when (control.mode) { ... }), stay(), admit(State.X(...)), interpret* observation. */
object RuntimeAvailability :
    VexFamilyContract<
        RuntimeAvailability,
        RuntimeAvailability.State,
        RuntimeAvailability.Control,
        RuntimeAvailability.Effect,
    >() {
    enum class Mode {
        Acquire,
        ObserveOnly,
    }

    sealed interface State :
        VexFamilyContract.State<RuntimeAvailability> {
        data class Borrowable(val receiptPath: String) : State

        data object Unavailable : State

        data class Qualified(val receiptPath: String) : State
    }

    sealed interface Control :
        VexFamilyContract.Control<RuntimeAvailability> {
        data class Ensure(val mode: Mode) : Control
    }

    sealed interface Effect : VexFamilyContract.Effect<RuntimeAvailability> {
        data object EnsureOwned : Effect

        data object ObserveOwned : Effect
    }

    override fun act(
        currentState: State,
        control: Control,
    ): Act<RuntimeAvailability, State, Effect> =
        when (control) {
            is Control.Ensure ->
                when (currentState) {
                    is State.Borrowable ->
                        admit(
                            State.Qualified(
                                receiptPath = currentState.receiptPath,
                            ),
                        )

                    State.Unavailable ->
                        stay(
                            effect =
                                when (control.mode) {
                                    Mode.Acquire -> Effect.EnsureOwned

                                    Mode.ObserveOnly -> Effect.ObserveOwned
                                },
                        )

                    is State.Qualified -> stay()
                }
        }

    fun interpretQualified(receiptPath: String): State = State.Qualified(receiptPath)
}
`;

export const SPEECH_MODELS = `package vexlife.speech

/** Availability-only: offered Controls with no Act / Effect law. */
object VexLifeSpeechModelsFamily {
    const val ArtifactAbsent = "ABSENT"
    const val ArtifactPresent = "PRESENT"
    const val ControlUse = "USE_SPEECH_MODEL"
    const val ControlDownload = "DOWNLOAD_SPEECH_MODEL"

    data class State(
        val artifactState: String,
        val selected: Boolean,
        val downloading: Boolean,
    )

    fun lawfulControls(
        state: State,
    ): List<String> {
        val idle =
            !state.downloading
        return buildList {
            if (state.artifactState == ArtifactPresent && !state.selected && idle) {
                add(
                    ControlUse,
                )
            }
            if (state.artifactState == ArtifactAbsent && idle) {
                add(ControlDownload)
            }
        }
    }
}
`;

export const RECALL = `package vexlife.recall

import vexlife.semantic.VexFamilyContract

/** Read-only Family: observation and projection, no lawful Control. */
object VexLifeRecallFamily :
    VexFamilyContract<
        VexLifeRecallFamily,
        VexLifeRecallFamily.State,
        VexLifeRecallFamily.Control,
        VexLifeRecallFamily.Effect,
    >() {
    sealed interface State : VexFamilyContract.State<VexLifeRecallFamily> {
        val stateRef: String
    }

    data class Current(val rememberedCount: Int) : State {
        override val stateRef: String = StateCurrent
    }

    data object Behind : State {
        override val stateRef: String = StateBehind
    }

    sealed interface Control : VexFamilyContract.Control<VexLifeRecallFamily>

    sealed interface Effect : VexFamilyContract.Effect<VexLifeRecallFamily>

    fun observe(readable: Boolean, rememberedCount: Int): State =
        if (readable) Current(rememberedCount) else Behind

    override fun act(
        currentState: State,
        control: Control,
    ): Act<VexLifeRecallFamily, State, Effect>? = null

    const val StateCurrent = "CURRENT"
    const val StateBehind = "BEHIND"
}
`;

export const UNREADABLE = `package vexlife.odd

import vexlife.semantic.VexFamilyContract

/** Shapes the reader must refuse to guess. */
object VexLifeOddFamily :
    VexFamilyContract<
        VexLifeOddFamily,
        VexLifeOddFamily.State,
        VexLifeOddFamily.Control,
        VexLifeOddFamily.Effect,
    >() {
    sealed interface State : VexFamilyContract.State<VexLifeOddFamily>

    data object One : State

    data object Two : State

    sealed interface Control : VexFamilyContract.Control<VexLifeOddFamily>

    data object Go : Control

    data object Wait : Control

    sealed interface Effect : VexFamilyContract.Effect<VexLifeOddFamily>

    data object Known : Effect

    override fun act(
        currentState: State,
        control: Control,
    ): Act<VexLifeOddFamily, State, Effect>? =
        when (control) {
            Go ->
                when (currentState) {
                    One -> stay(mysteryEffect(currentState))
                    Two -> admit(mysteryState(), Known)
                }
            Wait -> delegateElsewhere(currentState)
        }
}
`;

export const NO_ACT = `package vexlife.lawless

import vexlife.semantic.VexFamilyContract

object VexLifeLawlessFamily :
    VexFamilyContract<
        VexLifeLawlessFamily,
        VexLifeLawlessFamily.State,
        VexLifeLawlessFamily.Control,
        VexLifeLawlessFamily.Effect,
    >() {
    sealed interface State : VexFamilyContract.State<VexLifeLawlessFamily>

    data object Only : State

    sealed interface Control : VexFamilyContract.Control<VexLifeLawlessFamily>

    data object Poke : Control

    sealed interface Effect : VexFamilyContract.Effect<VexLifeLawlessFamily>
}
`;

export const FAMILY_SOURCES = Object.freeze([
  { path: 'src/commonMain/kotlin/vexlife/sight/VexLifeSightFamily.kt', text: SIGHT },
  { path: 'src/commonMain/kotlin/vexlife/dictation/VexLifeDictationFamily.kt', text: DICTATION },
  { path: 'src/commonMain/kotlin/vexlife/quiet/VexLifeQuietFamily.kt', text: QUIET },
  { path: 'src/commonMain/kotlin/vexlife/review/VexLifeReviewFamily.kt', text: REVIEW },
  { path: 'src/commonMain/kotlin/vexlife/stock/VexLifeStockFamily.kt', text: STOCK },
  { path: 'src/commonMain/kotlin/vexlife/gateway/VexLifeGatewayFamily.kt', text: GATEWAY },
  { path: 'src/commonMain/kotlin/vexlife/runtime/RuntimeAvailability.kt', text: RUNTIME },
  { path: 'src/commonMain/kotlin/vexlife/speech/VexLifeSpeechModelsFamily.kt', text: SPEECH_MODELS },
  { path: 'src/commonMain/kotlin/vexlife/recall/VexLifeRecallFamily.kt', text: RECALL },
]);

// ---- wiring -----------------------------------------------------------------------------------

export const SERVICE = `package vexlife.service

import vexlife.sight.VexLifeSightFamily
import vexlife.quiet.VexLifeQuietFamily

/** Product doorway: realizes Effects, returns outside truth, builds the Send Intent. */
class VexLifeProdLocalService(
    private val home: String,
) {
    private val quietConversation = VexLifeQuietConversation(home)
    private val personSettings = VexLifePersonSettingsStore(home)
    private val profiles = VexLifeProfileStore(home)
    private val sightRuntime = VexLifeSightRuntime.open(home)
    private val stockModels: VexLifeStock = VexLifeStock(home)
    private val until = String(charArrayOf('x'))

    private fun handleSightControl(effect: VexLifeSightFamily.Effect, requestRef: String) {
        when (effect) {
            VexLifeSightFamily.Effect.EngageScope -> sightRuntime.engage(requestRef)
            VexLifeSightFamily.Effect.StopScope -> sightRuntime.stop(requestRef)
        }
        observedSightState()
    }

    private fun observedSightState(): VexLifeSightFamily.State =
        VexLifeSightFamily.observe(routeReachable = true, scopeState = null)

    private fun handleQuietControl(effect: VexLifeQuietFamily.Effect) {
        when (effect) {
            VexLifeQuietFamily.Effect.BeginQuiet -> {
                quietConversation.begin()
                until.toString()
            }
            VexLifeQuietFamily.Effect.EndQuiet -> {
                quietConversation.end()
            }
            VexLifeQuietFamily.Effect.ClearHistory -> quietConversation.clear()
        }
    }

    private fun handleSend(exchange: Exchange) {
        if (stockModels.switchHeld()) {
            respondError(
                exchange,
                409,
                "MODEL_SWITCH_HELD",
                "held",
            )
            return
        }
        if (quietConversation.state() is VexLifeQuietFamily.Quiet) {
            respondError(exchange, 409, "QUIET_MODE_ON", "not kept")
            return
        }
        if (exchange.isEmpty()) {
            return
        }
        val request = decodeRequest<SendRequest>(exchange)
        val intent =
            sendIntent(
                request,
            )
        turnExecutor.perform(intent)
    }

    private fun personContext(): DirectPromptContext.PersonContext? =
        DirectPromptContext.PersonContext(replyLanguage = personSettings.read().replyLanguage)

    private fun sendIntent(
        request: SendRequest,
    ): DirectCompanionTurn.Intent =
        DirectCompanionTurn.Intent(
            idempotencyKey = request.idempotencyKey,
            content = request.content,
            personContext = personContext(),
            contextProfile =
                profiles.readActive(),
            browserContext =
                request.browserContext
                    ?.let { DirectPromptContext.BrowserContext(pageUrl = it.pageUrl) },
        )
}
`;

export const QUIET_CONVERSATION = `package vexlife.quiet

class VexLifeQuietConversation(private val home: String) {
    fun begin() {}

    fun end() {}

    fun clear() {}

    fun state(): VexLifeQuietFamily.State = VexLifeQuietFamily.Kept
}
`;

export const STOCK_OWNER = `package vexlife.stock

class VexLifeStock(private val home: String) {
    fun realize(effect: VexLifeStockFamily.Effect) {
        when (effect) {
            is VexLifeStockFamily.Effect.Acquire -> {}
            is VexLifeStockFamily.Effect.RemoveArtifacts -> {}
        }
    }

    fun current(): Any =
        VexLifeStockFamily.State(
            presence = VexLifeStockFamily.Presence.Absent,
            downloading = false,
            targeted = false,
            anyDownloadRunning = false,
        )

    fun switchHeld(): Boolean = false
}
`;

export const BROWSER_RUNTIME = `package vexlife.web

/** Generated browser runtime: dictation is realized in JavaScript inside a Kotlin string. */
object VexLifeWebRuntimeArtifacts {
    fun runtimeJavaScript(): String {
        val startedState = VexLifeDictationFamily.observeStarted()
        val failed = VexLifeDictationFamily.observeFailure(VexLifeDictationFamily.FailureReason.Unknown)
        return """
            const dictation = {
              beginDictation: \${jsString(VexLifeDictationFamily.EffectBeginDictation)},
              endDictation: \${jsString(VexLifeDictationFamily.EffectEndDictation)},
            };
            const enhanced = display.controls.find((control) => control.controlRef === 'CLEAR');
        """
    }
}
`;

export const TURN = `package vexlife.companion

object DirectCompanionTurn {
    data class Intent(
        val idempotencyKey: String,
        val content: String,
        val browserContext: DirectPromptContext.BrowserContext? =
            null,
        /** Reply language composed by the service; see [DirectPromptContext.PersonContext]. */
        val personContext: DirectPromptContext.PersonContext? = null,
        /**
         * Profile captured by the service when this Send is accepted. It stays exact for every
         * provider stage in this turn; a later profile edit belongs to the next Send.
         */
        val contextProfile: VexLifeProfile.Effective? = null,
    )
}
`;

export const PROMPT = `package vexlife.companion

object DirectPromptContext {
    data class Receipt internal constructor(
        val personContextIncluded: Boolean,
        val personContext: PersonContext? = null,
        val contextProfileRef: String? = null,
        val browserContextIncluded: Boolean = false,
        val unrelatedField: Int = 0,
    )

    fun receiptFor(turnContext: TurnContext, personContext: PersonContext?, browserContext: BrowserContext?): Receipt =
        Receipt(
            personContextIncluded = personContext != null,
            personContext = personContext,
            contextProfileRef = turnContext.contextProfile?.profileRef,
            browserContextIncluded = browserContext != null,
        )
}
`;

export const WIRING_FILES = Object.freeze([
  { path: 'src/jvmMain/kotlin/vexlife/service/VexLifeProdLocalService.kt', text: SERVICE },
  { path: 'src/jvmMain/kotlin/vexlife/quiet/VexLifeQuietConversation.kt', text: QUIET_CONVERSATION },
  { path: 'src/jvmMain/kotlin/vexlife/stock/VexLifeStock.kt', text: STOCK_OWNER },
  { path: 'src/commonMain/kotlin/vexlife/web/VexLifeWebRuntimeArtifacts.kt', text: BROWSER_RUNTIME },
  { path: 'src/commonMain/kotlin/vexlife/kind/VexLifeKindContract.kt', text: KIND_CONTRACT },
]);

export const SEND_SOURCES = Object.freeze({
  turnSource: { path: 'src/jvmMain/kotlin/vexlife/companion/DirectCompanionTurn.kt', text: TURN },
  promptSource: { path: 'src/jvmMain/kotlin/vexlife/companion/DirectPromptContext.kt', text: PROMPT },
  serviceSource: { path: 'src/jvmMain/kotlin/vexlife/service/VexLifeProdLocalService.kt', text: SERVICE },
});

export const LENS = Object.freeze({
  schemaVersion: 'vexboard.screen-lens/v1',
  lensRef: 'lens.fixture',
  screens: [{
    screenRef: 'screen.workspace',
    elements: [
      { ref: 'element.workspace.sight', kind: 'BUTTON', label: 'Sight', symbol: 'Blueprint.Sight', intent: 'capability sight.selected-scope', pathwayRef: 'pathway.fixture.sight' },
      { ref: 'element.workspace.quiet', kind: 'BUTTON', label: 'Quiet', symbol: 'Blueprint.QuietMode', intent: 'capability conversation.quiet', pathwayRef: 'pathway.fixture.quiet' },
      { ref: 'element.workspace.send', kind: 'BUTTON', label: 'Send', symbol: 'Blueprint.Send', intent: 'capability conversation.send', pathwayRef: 'pathway.fixture.send' },
      { ref: 'element.workspace.dictation', kind: 'BUTTON', label: 'Dictate', symbol: 'Blueprint.Dictation', intent: 'local element.workspace.composer', pathwayRef: 'pathway.fixture.dictation' },
      { ref: 'element.workspace.language', kind: 'BUTTON', label: 'Language', symbol: 'Blueprint.Language', intent: 'capability person.reply-language', pathwayRef: null },
      { ref: 'element.workspace.settings.clear', kind: 'BUTTON', label: 'Clear', symbol: 'Blueprint.QuietClear', intent: null, pathwayRef: null },
      { ref: 'element.workspace.composer', kind: 'FIELD', label: 'Composer', symbol: 'Blueprint.Composer', intent: null, pathwayRef: null },
      { ref: 'element.workspace.region', kind: 'REGION', label: 'Region', symbol: null, intent: null, pathwayRef: null },
    ],
  }],
  pathways: [
    {
      pathwayRef: 'pathway.fixture.sight',
      disposition: 'SCAE_FAMILY',
      returnRef: 'fixture.sight.projection',
      nodes: [
        { ref: 'fixture.sight.dispatch', face: 'BEHAVIOR', role: 'DISPATCH', label: 'POST /sight', symbol: 'VexLifeProdLocalService', source: 'jvm:service/VexLifeProdLocalService.kt' },
        { ref: 'fixture.sight.control', face: 'BEHAVIOR', role: 'CONTROL', label: 'ENGAGE · STOP', symbol: 'VexLifeSightFamily.Control', source: 'common:sight/VexLifeSightFamily.kt' },
        { ref: 'fixture.sight.effect', face: 'BEHAVIOR', role: 'EFFECT', label: 'effects', symbol: 'VexLifeSightFamily.Effect', source: 'common:sight/VexLifeSightFamily.kt' },
        { ref: 'fixture.sight.runtime', face: 'DEPTH', role: 'CONNECTION', label: 'runtime', symbol: 'VexLifeSightRuntime', source: 'jvm:sight/VexLifeSightRuntime.kt' },
        { ref: 'fixture.sight.picker', face: 'DEPTH', role: 'PARTNER', label: 'macOS picker', symbol: 'OS picker session', source: null },
        { ref: 'fixture.sight.projection', face: 'BEHAVIOR', role: 'PROJECTION', label: 'DisplayState', symbol: 'VexLifeSightFamily.DisplayState', source: 'common:sight/VexLifeSightFamily.kt' },
      ],
      edges: [
        { from: 'fixture.sight.dispatch', to: 'fixture.sight.control', kind: 'FLOW', label: null },
        { from: 'fixture.sight.control', to: 'fixture.sight.effect', kind: 'FLOW', label: null },
        { from: 'fixture.sight.effect', to: 'fixture.sight.runtime', kind: 'FLOW', label: null },
        { from: 'fixture.sight.runtime', to: 'fixture.sight.picker', kind: 'FLOW', label: null },
        { from: 'fixture.sight.picker', to: 'fixture.sight.projection', kind: 'RETURN', label: 're-observed' },
      ],
    },
    {
      pathwayRef: 'pathway.fixture.quiet',
      disposition: 'SCAE_FAMILY',
      returnRef: 'fixture.quiet.projection',
      nodes: [
        { ref: 'fixture.quiet.control', face: 'BEHAVIOR', role: 'CONTROL', label: 'BEGIN · END', symbol: 'VexLifeQuietFamily.Control', source: 'common:quiet/VexLifeQuietFamily.kt' },
        { ref: 'fixture.quiet.effect', face: 'BEHAVIOR', role: 'EFFECT', label: 'effects', symbol: 'VexLifeQuietFamily.Effect', source: 'common:quiet/VexLifeQuietFamily.kt' },
        { ref: 'fixture.quiet.session', face: 'DEPTH', role: 'EXECUTION', label: 'session', symbol: 'VexLifeQuietConversation', source: 'jvm:quiet/VexLifeQuietConversation.kt' },
        { ref: 'fixture.quiet.projection', face: 'BEHAVIOR', role: 'PROJECTION', label: 'DisplayState', symbol: 'VexLifeQuietFamily.DisplayState', source: 'common:quiet/VexLifeQuietFamily.kt' },
      ],
      edges: [
        { from: 'fixture.quiet.control', to: 'fixture.quiet.effect', kind: 'FLOW', label: null },
        { from: 'fixture.quiet.effect', to: 'fixture.quiet.session', kind: 'FLOW', label: null },
        { from: 'fixture.quiet.session', to: 'fixture.quiet.projection', kind: 'RETURN', label: null },
      ],
    },
    {
      pathwayRef: 'pathway.fixture.send',
      disposition: 'DIRECT_REGISTRATION',
      returnRef: null,
      nodes: [
        { ref: 'fixture.send.turn', face: 'DEPTH', role: 'METHOD', label: 'DirectCompanionTurn', symbol: 'DirectCompanionTurn', source: 'jvm:companion/DirectCompanionTurn.kt' },
        { ref: 'fixture.send.prompt', face: 'DEPTH', role: 'REALIZATION', label: 'prompt', symbol: 'DirectPromptContext', source: 'jvm:companion/DirectPromptContext.kt' },
        { ref: 'fixture.send.runtime', face: 'DEPTH', role: 'CONNECTION', label: 'runtime', symbol: 'LocalModelRuntime', source: null },
      ],
      edges: [
        { from: 'fixture.send.turn', to: 'fixture.send.prompt', kind: 'FLOW', label: null },
        { from: 'fixture.send.prompt', to: 'fixture.send.runtime', kind: 'FLOW', label: null },
      ],
    },
    {
      pathwayRef: 'pathway.fixture.dictation',
      disposition: 'TYPED_PRESENTATION',
      returnRef: null,
      nodes: [
        { ref: 'fixture.dictation.intent', face: 'BEHAVIOR', role: 'INTENT', label: 'Activate', symbol: 'VexWeb.Binding.LocalInteraction', source: 'common:web/VexLifeWebP1.kt' },
      ],
      edges: [],
    },
  ],
});

export const COMMIT = 'a58777106b08bd58c167608fa0115729185ae3dd';
export const PRIOR_COMMIT = '98a22ede8d37b3b8868eb42f4e7a9a1d612b97d0';

// [VXG RealForever][VEXWORK][VEXLIFE-PROD][E2E][EXPERIENCE-GRAPH][TEST-FIXTURES]
