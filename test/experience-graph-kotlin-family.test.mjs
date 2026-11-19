import assert from 'node:assert/strict';
import test from 'node:test';

import { EXTRACTION_DEBT, FAMILY_CONTRACT_FORMS, readFamilyLaw } from '../src/core/experience-graph-kotlin-family.mjs';
import { DICTATION, GATEWAY, NO_ACT, QUIET, RECALL, REVIEW, RUNTIME, SIGHT, SPEECH_MODELS, STOCK, UNREADABLE } from './fixtures/experience-graph/fixtures.mjs';

const read = (text, name = 'VexLifeFixtureFamily') => readFamilyLaw({ path: `src/commonMain/kotlin/vexlife/fixture/${name}.kt`, text });
const cell = (law, state, control) => law.cells.find((row) => row.state === state && row.control === control);
const lawful = (row) => row.outcomes.filter((outcome) => outcome.kind !== 'REJECT');

test('nested when(control) -> when(currentState) reads exact lawful cells, held guard and projection', () => {
  const law = read(SIGHT, 'VexLifeSightFamily');
  assert.equal(law.family, 'VexLifeSightFamily');
  assert.equal(law.contractForm, FAMILY_CONTRACT_FORMS.VEX_FAMILY_CONTRACT);
  assert.equal(law.instance, 'VexLifeSightFamily');
  assert.deepEqual(law.types, { state: 'State', control: 'Control', effect: 'Effect' });
  assert.deepEqual(law.states.map((state) => [state.symbol, state.ref, state.refSource]), [
    ['Held', 'HELD', 'CONSTANT'], ['Ready', 'READY', 'CONSTANT'], ['Engaged', 'ENGAGED', 'CONSTANT'],
  ]);
  assert.deepEqual(law.controls.map((control) => control.ref), ['ENGAGE', 'STOP']);
  assert.deepEqual(law.effects.map((effect) => effect.symbol), ['Effect.EngageScope', 'Effect.StopScope']);

  assert.deepEqual(cell(law, 'Ready', 'Engage').outcomes, [{ kind: 'STAY', guards: [], admittedState: null, effect: 'Effect.EngageScope' }]);
  assert.deepEqual(cell(law, 'Engaged', 'Engage').outcomes, [{ kind: 'REJECT', guards: [], admittedState: null, effect: null }]);
  const held = cell(law, 'Held', 'Stop').outcomes;
  assert.equal(held.length, 2);
  assert.deepEqual(held[0], { kind: 'STAY', guards: ['currentState.reason == HoldReason.ScreenSafetyNotCurrent'], admittedState: null, effect: 'Effect.StopScope' });
  assert.deepEqual(held[1].guards, ['!(currentState.reason == HoldReason.ScreenSafetyNotCurrent)']);
  assert.equal(held[1].kind, 'REJECT');

  assert.deepEqual(law.observations.map((row) => [row.function, row.successors, row.takesCurrentState]), [['observe', ['Engaged', 'Held', 'Ready'], false]]);
  assert.deepEqual(law.observations[0].params.map((param) => param.name), ['routeReachable', 'scopeState']);
  assert.deepEqual(law.projection, [{ state: 'Held', controls: ['Stop'] }, { state: 'Ready', controls: ['Engage'] }, { state: 'Engaged', controls: ['Stop'] }]);
  assert.deepEqual(law.enums.HoldReason, ['RouteUnreachable', 'ScreenSafetyNotCurrent']);
  assert.deepEqual(law.debt, []);
});

test('outer when(currentState) with multi-label branches admits transient States with their Effects', () => {
  const law = read(DICTATION, 'VexLifeDictationFamily');
  assert.deepEqual(law.effects.map((effect) => [effect.symbol, effect.ref]), [['BeginDictation', 'BEGIN_DICTATION'], ['EndDictation', 'END_DICTATION']]);
  for (const origin of ['Ready', 'Failed']) {
    assert.deepEqual(lawful(cell(law, origin, 'Start')), [{ kind: 'ADMIT', guards: [], admittedState: { variant: 'Requesting', axisUpdates: {} }, effect: 'BeginDictation' }]);
  }
  for (const origin of ['Requesting', 'Listening']) {
    assert.deepEqual(lawful(cell(law, origin, 'Stop')), [{ kind: 'ADMIT', guards: [], admittedState: { variant: 'Stopping', axisUpdates: {} }, effect: 'EndDictation' }]);
    assert.equal(lawful(cell(law, origin, 'Start')).length, 0);
  }
  assert.equal(lawful(cell(law, 'Stopping', 'Start')).length, 0);
  assert.equal(lawful(cell(law, 'Stopping', 'Stop')).length, 0);
  assert.deepEqual(law.observations.map((row) => [row.function, row.successors]), [['observeStarted', ['Listening']], ['observeFailure', ['Failed']]]);
  assert.deepEqual(law.projection.find((row) => row.state === 'Requesting').controls, ['Stop']);
  assert.deepEqual(law.projection.find((row) => row.state === 'Stopping').controls, []);
  assert.deepEqual(law.enums.FailureReason, ['Permission', 'Unknown']);
});

test('subject-less when decides State / Control tests and keeps the fall-through Control lawful everywhere', () => {
  const law = read(QUIET, 'VexLifeQuietFamily');
  assert.deepEqual(lawful(cell(law, 'Kept', 'Begin'))[0].effect, 'Effect.BeginQuiet');
  assert.deepEqual(lawful(cell(law, 'Quiet', 'End'))[0].effect, 'Effect.EndQuiet');
  assert.equal(lawful(cell(law, 'Kept', 'End')).length, 0);
  assert.equal(lawful(cell(law, 'Quiet', 'Begin')).length, 0);
  for (const state of ['Kept', 'Quiet']) assert.equal(lawful(cell(law, state, 'Clear'))[0].effect, 'Effect.ClearHistory');
});

test('block bodies: narrowing preamble rejects other States, payload guard stays residual, named effect resolves', () => {
  const law = read(REVIEW, 'VexLifeReviewFamily');
  assert.deepEqual(law.states.map((state) => [state.symbol, state.refSource]), [['Idle', 'SYMBOL'], ['Pending', 'SYMBOL']]);
  assert.deepEqual(law.controls.map((control) => control.ref), ['KEEP', 'DECLINE']);
  assert.deepEqual(cell(law, 'Idle', 'Keep').outcomes, [{ kind: 'REJECT', guards: [], admittedState: null, effect: null }]);
  const keep = cell(law, 'Pending', 'Keep').outcomes;
  assert.deepEqual(keep.map((outcome) => [outcome.kind, outcome.effect, outcome.guards]), [
    ['REJECT', null, ['currentState.candidateRef != control.candidateRef']],
    ['STAY', 'Effect.Accept', ['!(currentState.candidateRef != control.candidateRef)']],
  ]);
  assert.equal(lawful(cell(law, 'Pending', 'Decline'))[0].effect, 'Effect.Dismiss');
  assert.deepEqual(law.states.find((state) => state.symbol === 'Pending').params.map((param) => param.type), ['CandidateRef', 'String', 'VexLifeKindContract.CandidateClass']);
});

test('axis States carry local predicates, nested if branches and copy(...) axis updates', () => {
  const law = read(STOCK, 'VexLifeStockFamily');
  assert.equal(law.stateShape, 'AXES');
  assert.deepEqual(law.states[0].params.map((param) => param.name), ['presence', 'downloading', 'targeted', 'anyDownloadRunning']);
  assert.deepEqual(law.enums.Presence, ['Absent', 'Present']);
  const select = cell(law, 'State', 'Select').outcomes;
  assert.equal(select[0].kind, 'ADMIT');
  assert.deepEqual(select[0].admittedState, { variant: 'State', axisUpdates: { targeted: 'true' } });
  assert.match(select[0].guards[0], /!currentState\.downloading && !currentState\.anyDownloadRunning/);
  const remove = cell(law, 'State', 'Remove').outcomes;
  assert.deepEqual(remove.map((outcome) => [outcome.kind, outcome.admittedState?.axisUpdates ?? null, outcome.effect]), [
    ['ADMIT', { targeted: 'false' }, 'Effect.RemoveArtifacts'],
    ['STAY', null, 'Effect.RemoveArtifacts'],
    ['REJECT', null, null],
  ]);
  assert.equal(cell(law, 'State', 'Download').outcomes[0].effect, 'Effect.Acquire');
  assert.deepEqual(law.projection, [{ state: 'State', controls: ['Select'] }]);
});

test('class Families with a companion instance resolve helper-built Effects and Effect-less stay()', () => {
  const law = read(GATEWAY, 'VexLifeGatewayFamily');
  assert.equal(law.instance, 'VexLifeGatewayFamily.Semantics');
  assert.deepEqual(law.types, { state: 'GatewayState', control: 'GatewayControl', effect: 'GatewayEffect' });
  assert.deepEqual(lawful(cell(law, 'Current', 'OpenCurrent'))[0].effect, 'OpenPresentation');
  assert.deepEqual(lawful(cell(law, 'UpdateAvailable', 'Converge'))[0].effect, 'ConvergeProduct');
  assert.deepEqual(lawful(cell(law, 'Current', 'Cancel')), [{ kind: 'STAY', guards: [], admittedState: null, effect: null }]);
  assert.equal(lawful(cell(law, 'Current', 'Converge')).length, 0);
  assert.equal(law.projection, null);
});

test('payload-conditional Effects become one guarded outcome per branch; nested State symbols stay qualified', () => {
  const law = read(RUNTIME, 'RuntimeAvailability');
  assert.deepEqual(law.states.map((state) => state.symbol), ['State.Borrowable', 'State.Unavailable', 'State.Qualified']);
  assert.deepEqual(lawful(cell(law, 'State.Borrowable', 'Control.Ensure')), [{ kind: 'ADMIT', guards: [], admittedState: { variant: 'State.Qualified', axisUpdates: {} }, effect: null }]);
  assert.deepEqual(cell(law, 'State.Unavailable', 'Control.Ensure').outcomes.map((outcome) => [outcome.effect, outcome.guards]), [
    ['Effect.EnsureOwned', ['control.mode == Mode.Acquire']],
    ['Effect.ObserveOwned', ['control.mode == Mode.ObserveOnly']],
  ]);
  assert.deepEqual(lawful(cell(law, 'State.Qualified', 'Control.Ensure'))[0], { kind: 'STAY', guards: [], admittedState: null, effect: null });
  assert.deepEqual(law.observations.map((row) => [row.function, row.successors]), [['interpretQualified', ['State.Qualified']]]);
});

test('availability-only Families expose guarded offers and report the missing Act law as debt', () => {
  const law = read(SPEECH_MODELS, 'VexLifeSpeechModelsFamily');
  assert.equal(law.contractForm, FAMILY_CONTRACT_FORMS.AVAILABILITY_ONLY);
  assert.equal(law.instance, undefined);
  assert.deepEqual(law.availability.map((row) => row.controlRef), ['USE_SPEECH_MODEL', 'DOWNLOAD_SPEECH_MODEL']);
  assert.match(law.availability[0].guard, /\(!state\.downloading\)/);
  assert.deepEqual(law.debt.map((row) => row.kind), [EXTRACTION_DEBT.MISSING_ACT_LAW]);
  assert.deepEqual(law.states[0].params.map((param) => param.name), ['artifactState', 'selected', 'downloading']);
});

test('read-only Families have observation and no lawful cell', () => {
  const law = read(RECALL, 'VexLifeRecallFamily');
  assert.deepEqual(law.controls, []);
  assert.deepEqual(law.cells, []);
  assert.deepEqual(law.observations[0].successors, ['Behind', 'Current']);
});

test('shapes the reader cannot interpret become extraction debt, never guessed outcomes', () => {
  const law = read(UNREADABLE, 'VexLifeOddFamily');
  const kinds = law.debt.map((row) => `${row.kind}@${row.cell}`).sort();
  assert.deepEqual(kinds, [
    'UNREAD_ACT_FORM@One×Wait',
    'UNREAD_ACT_FORM@Two×Wait',
    'UNRESOLVED_ADMITTED_STATE@Two×Go',
    'UNRESOLVED_EFFECT@One×Go',
  ]);
  assert.equal(cell(law, 'One', 'Go').outcomes[0].effect, 'UNRESOLVED');
  assert.deepEqual(cell(law, 'One', 'Wait').outcomes, []);
  const lawless = read(NO_ACT, 'VexLifeLawlessFamily');
  assert.deepEqual(lawless.debt.map((row) => row.kind), ['MISSING_ACT_LAW']);
  assert.deepEqual(lawless.cells, []);
});

test('the reader refuses non-Kotlin, empty and Family-less input', () => {
  assert.throws(() => readFamilyLaw({ path: 'Family.java', text: 'x' }), /one Kotlin file/);
  assert.throws(() => readFamilyLaw({ path: 'Family.kt', text: '' }), /non-empty text/);
  assert.throws(() => readFamilyLaw({ path: 'Family.kt', text: 'package x\nclass Plain(val a: Int)\n' }), /declares no Family object/);
  assert.throws(() => readFamilyLaw({ path: 'Family.kt', text: 'object VexLifeBadFamily : VexFamilyContract<A, B>() {}' }), /must carry Family, State, Control, Effect/);
});

test('partial evaluation reads when(currentState) inside admit(), and a displayStateFor without a when projects every State uniformly', () => {
  const text = `package vexlife.person

object VexLifeChoiceFamily :
    VexFamilyContract<
        VexLifeChoiceFamily,
        VexLifeChoiceFamily.State,
        VexLifeChoiceFamily.Control,
        VexLifeChoiceFamily.Effect,
    >() {
    sealed interface State : VexFamilyContract.State<VexLifeChoiceFamily> {
        val stateRef: String
        val reply: String
    }

    data class Following(override val reply: String) : State {
        override val stateRef: String = StateFollowing
    }

    data class Chosen(override val reply: String, val screen: String) : State {
        override val stateRef: String = StateChosen
    }

    sealed interface Control : VexFamilyContract.Control<VexLifeChoiceFamily> {
        val controlRef: String
    }

    data class ChooseReply(val code: String) : Control {
        override val controlRef: String = ControlChooseReply
    }

    sealed interface Effect : VexFamilyContract.Effect<VexLifeChoiceFamily> {
        data object Save : Effect
    }

    data class DisplayState(val reply: String) : VexFamilyContract.DisplayState<VexLifeChoiceFamily, State>

    override fun act(currentState: State, control: Control): Act<VexLifeChoiceFamily, State, Effect>? =
        when (control) {
            is ChooseReply ->
                admit(
                    when (currentState) {
                        is Following -> Following(control.code)
                        is Chosen -> currentState.copy(reply = control.code)
                    },
                    Effect.Save,
                )
        }

    override fun displayStateFor(state: State): DisplayState = DisplayState(reply = state.reply)

    fun stateFor(reply: String): State = when (reply) { "" -> Following("en") else -> Following(reply) }

    const val StateFollowing = "FOLLOWING"
    const val StateChosen = "CHOSEN"
    const val ControlChooseReply = "CHOOSE_REPLY"
}
`;
  const law = readFamilyLaw({ path: 'src/commonMain/kotlin/vexlife/person/VexLifeChoiceFamily.kt', text });
  assert.deepEqual(law.debt, []);
  const admitted = Object.fromEntries(law.cells.map((cell) => [cell.state, cell.outcomes[0].admittedState]));
  assert.deepEqual(admitted.Following, { variant: 'Following', axisUpdates: {} });
  assert.deepEqual(admitted.Chosen, { variant: 'Chosen', axisUpdates: { reply: 'control.code' } }, 'only the reply moves');
  assert.deepEqual(law.projection, [{ state: 'Following', controls: [] }, { state: 'Chosen', controls: [] }], 'every State is projected; no per-state Controls are claimed');
});
