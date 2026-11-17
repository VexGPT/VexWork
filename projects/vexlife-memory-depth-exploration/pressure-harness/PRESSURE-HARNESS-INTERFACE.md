# Continuity Pressure Harness — Shared Interface

`[VXG RealForever]`

## Why this exists

Manual long-thread testing is expensive in human attention, model time and local storage.

The harness exists to make continuity pressure **repeatable, bounded and analyzable**:

~~~text
scenario
-> isolated experiment run
-> 10–20 turn configurable sets
-> accelerated context pressure
-> exact per-turn observations
-> one analysis ZIP
-> compare implementations / regressions
~~~

This source defines the **shared experiment membrane**, not a VexLife semantic owner and not one implementation.

Claude and OpenAI may implement different continuity internals while emitting the same result contract.

## Human outcome

Victor should be able to run one bounded experiment and return one ZIP instead of:

~~~text
chat for hours
watch context manually
inspect logs by hand
guess which layer changed
repeat the whole session after every fix
~~~

## Core non-collapse

~~~text
TEST HARNESS != PRODUCT SEMANTIC OWNER
PRESSURE BUDGET != MODEL PHYSICAL CONTEXT WINDOW
SYNTHETIC TURN != HUMAN MEMORY
OBSERVATION != INTERPRETATION
HARNESS ASSERTION != PRODUCT AUTHORITY
DEBUG ZIP != CANONICAL VEX HOME
~~~

## Two execution classes

### DETERMINISTIC_PROJECTION

No model call required.

Use current Conversation / prompt / Working Continuity / hydration owners with deterministic provider fixtures.

Purpose:
- cheap PR regression;
- boundary selection;
- rollover/rebase;
- context residency;
- retrieval/frontier;
- no semantic-owner mutation.

### LIVE_MODEL

Use the real selected Vex model against an isolated experiment Home.

Purpose:
- verify what Vex actually receives;
- observe capability/tool salience;
- observe revisit/hydration behavior;
- compare response quality;
- prove lesson transfer / honest absence.

The experiment Home must not be Victor's canonical Home.

## Pressure strategies

Adapters declare which strategies they support.

### EFFECTIVE_SELECTION_BUDGET — preferred when supported

Use the real model and provider limits, but give continuity selection a smaller explicit experiment-only input budget.

Example:

~~~text
real model hard limit = 208k
ordinary product input budget = 192k

experiment selection budget = 12k / 24k / 48k
~~~

The result MUST record both the real product/model limits and the experiment pressure budget.

This accelerates continuity selection/rollover without pretending the model physically has a smaller context window.

The pressure parameter must remain experiment/test-only; it must not silently become ordinary product topology.

### PAYLOAD_PRESSURE — compatibility fallback

Generate deterministic synthetic payload inside experiment prompts to fill context quickly.

Use when the implementation does not expose an experiment-only budget seam.

Payload must be:
- synthetic;
- deterministic from a seed;
- reconstruction-friendly;
- clearly separated from the semantic probe text.

### NATIVE_LIMIT

Use ordinary product budgets and natural turns.
Useful for final lived validation, not the default fast loop.

## Isolation

Default:

~~~text
scratchHomePolicy = DELETE_AFTER_BUNDLE
humanPrivateContentIncluded = false
syntheticScenarioOnly = true
~~~

A live run may reuse already-installed model/runtime artifacts, but its Conversation/Home state belongs to the experiment.

Do not pollute Victor's canonical Conversation with pressure turns.

## Adapter boundary

Implementations bridge into the harness through four conceptual operations:

~~~text
prepare(config) -> run session
send(session, turn input) -> TurnObservation
finish(session) -> final adapter observations
cleanup(session) -> scratch state disposition
~~~

The exact in-repo call shape is implementation-owned.

The shared obligation is the result schema.

## TurnObservation minimum

Each model-visible turn should make available, when current source can truthfully provide it:

~~~text
turn identity
set / ordinal
request + response hashes
visible response text (synthetic experiment only)
current Conversation head
prior completed exchange count

prompt context mode
selected Conversation event refs
provider materialized input token estimate
ordinary product input/hard limits
experiment pressure budget / strategy

Memory:
  available/currentness if known
  included?
  context ref if present

Working Continuity:
  included?
  context/checkpoint ref if present

Capability Frame:
  included?
  available/held/unknown/omitted refs

Capability/reach uses:
  handle
  action
  target
  returned state

Historical retrieval:
  route ref
  state
  source refs
  omitted/frontier refs
  implementation extensions when needed

context residency classification
assertion outcomes
~~~

Raw hidden chain-of-thought is excluded.

## Context residency map

For every source event/lesson/ref the harness knows about, classify only from evidence:

~~~text
PROMPT_RESIDENT
HYDRATED_THIS_TURN
DURABLE_REACHABLE
OMITTED_BUDGET
HELD_UNAVAILABLE
UNKNOWN
~~~

Never infer:

~~~text
NOT_PROMPT_RESIDENT -> FORGOTTEN
NOT_FOUND -> NEVER_HAPPENED
~~~


## Mutable current-state placement

The language-setting bug exposed a general prompt-topology invariant:

~~~text
CURRENTNESS / PLACEMENT
!= OWNERSHIP / ROLE
~~~

A value may rightly belong to a system/current-state owner and still be placed badly for both semantics and cache reuse.

Observed pressure:

~~~text
fresh current setting
-> serialized in early system prefix
-> historical Conversation comes afterward

therefore:
  model may perceive the setting as if it belonged to the oldest/base context
  AND
  one small setting change invalidates every cacheable byte after it
~~~

Permanent test question:

> Does a mutable current value appear before otherwise cacheable append-only history without a provider constraint that earns that placement?

Candidate placement classes:

~~~text
STABLE
  foundational/policy material expected to survive many turns

APPEND_ONLY_HISTORY
  canonical exact history that should preserve reusable prefix bytes

MUTABLE_CURRENT
  settings/currentness/capability/configuration that may change independently

EPHEMERAL_CURRENT
  current request/browser/hydration/live execution material
~~~

Desired topology is not a blind rule that "all current state must be last."

It is:

~~~text
stable long-lived context
-> cacheable append-only history
-> mutable current state as late as provider semantics allow
-> ephemeral live tail
-> exact current human request
~~~

If the provider requires one system block first, the implementation must prove how current mutable state remains current without forcing it ahead of all cacheable history. A different role/envelope may be needed; the harness does not prescribe the Product representation.

Focused scenario:

~~~text
scenarios/current-state-placement-v1.json
~~~

It changes reply language mid-run and checks:
- latest configuration is observed;
- prior history is not rewritten;
- stable historical prefix survives the configuration change where possible;
- mutable-current-before-history placement is surfaced explicitly.


## Suggested fast experiment shape

Default fixture: three sets of ten turns.

~~~text
SET A — FORMATION
  establish exact anchor facts
  establish one explicit correction / lesson
  establish one ambiguous relational reference

SET B — PRESSURE
  deterministic distractor payload
  ordinary follow-up conversation
  force old anchor outside hot context

SET C — PROBE
  exact-word recall
  paraphrased/meaning recall
  correction-backed lesson application
  honest-absence probe
  tool/revisit salience probe
~~~

The config may choose 2 or 3 sets and 10 or 20 turns per set.

## Automatic analysis

A result analyzer should derive, without inventing semantic truth:

~~~text
firstPressureTurn
firstConversationOmissionTurn
firstWorkingRolloverTurn
firstHydrationTurn

selectedConversationCountByTurn
residentEventRefsByTurn
hydratedEventRefsByTurn
omittedEventRefsByTurn

contextSelectionChurn
postRolloverReplayOscillation
providerMessageSetChurn

capabilityUseCounts
firstRelevantCapabilityTurn
irrelevantCapabilityCount
sourceReturn/revisitCount

knownLessonReuse
repeatedKnownCorrection
honestAbsence
lessonActivationFailure

response source-faithfulness / fixture assertions
~~~

If provider cache telemetry exists, also correlate:
- prompt tokens;
- cached prompt tokens;
- prefill tokens;
- first token latency;
- total latency.

No performance claim is allowed when those measurements are unavailable.

## Oscillation detector

One important current risk:

~~~text
rollover turn:
  bounded successor context

next turn:
  full old Conversation replay
~~~

The analyzer should flag:

~~~text
POST_ROLLOVER_REPLAY_OSCILLATION
~~~

when the prompt-resident historical set jumps back across the pre-rollover boundary without a source/hydration reason.

## Result ZIP

Canonical experiment carrier:

~~~text
manifest.json
config.json
scenario.json
turns.jsonl
context-residency.jsonl
capability-uses.jsonl
assertions.json
summary.json
implementation/adapter-report.json
diagnostics/product-diagnostics.zip   (optional)
~~~

The ZIP is analysis evidence, not a new Home or Memory owner.

## Comparison

Two implementations are comparable when they run:
- same scenario version;
- same pressure strategy/budget;
- same model/runtime where live;
- same synthetic payload seed;
- same assertion set.

Compare behavior and causal evidence, not source-code similarity.

## Success criterion

The harness earns permanence if it makes this loop cheap:

~~~text
change continuity implementation
-> run bounded experiment
-> inspect one ZIP / summary
-> know which layer changed
-> compare against prior run
-> fix
-> rerun
~~~

without Victor manually rebuilding the conversation.
