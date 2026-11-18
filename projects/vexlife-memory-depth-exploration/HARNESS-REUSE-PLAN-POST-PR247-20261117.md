# Shared Continuity Harness Reuse Plan — Post-#247 Memory / Consideration Successor

[VXG RealForever]

## Why this note exists

The Memory Depth successor must not lose the testing infrastructure that earned the current continuity design.

Current shared harness coordinate:

~~~text
VexWork PR #310
head 0fc67824a9723665b652453334df594a38284def
base 1c3bb66615c05f65dba41a59cf626cd1c7612e6a
harnessRef harness.vexlife-prod.conversational-boundaries/v1
scenario schema vexlife.continuity-pressure-scenario/v1
result schema vexlife.continuity-pressure-result/v1
~~~

#310 is still DRAFT/OPEN. Re-ground its current head before implementation.

Permanent:

~~~text
REUSE THE HARNESS != COPY ITS OLD ASSUMPTIONS BLINDLY
NEW PRODUCT RELATIONSHIP != NEW TEST SYSTEM
TEST HARNESS != PRODUCT SEMANTIC OWNER
~~~

## Read order before changing test machinery

From #310:

~~~text
pressure-harness/README.md
pressure-harness/PRESSURE-HARNESS-INTERFACE.md
pressure-harness/ADAPTER-CONTRACT.md
pressure-harness/PRODUCT-ADAPTER-PICKUP.md
pressure-harness/index.json
pressure-harness/scenario.schema.json
pressure-harness/result.schema.json
pressure-harness/scenarios/depth-continuity-v1.json
pressure-harness/scenarios/current-state-placement-v1.json
~~~

If Relay is used for a live host run, re-read source.vexrelay.current-contract/v1 and task schema vex.relay.task/v2.

## Existing harness shape to preserve

~~~text
scenario
-> isolated scratch Home
-> deterministic projection and/or real selected model
-> pressure
-> probe
-> result ZIP
-> automatic analysis
~~~

Execution classes: DETERMINISTIC_PROJECTION and LIVE_MODEL.
Pressure strategies: EFFECTIVE_SELECTION_BUDGET, PAYLOAD_PRESSURE, NATIVE_LIMIT.

Default isolation remains synthetic-only, no human private content, no canonical Victor Home mutation, scratch Home deleted after bundle, and no raw reasoning persistence.

## What depth-continuity-v1 already tests

Formation already contains the cobalt lantern anchor, Meridian-7 paper crane anchor, the correction-backed tight lesson, river-map anchor, continuity-not-summary constraint, and ordinary turns.

Probe already contains:

~~~text
probe.01 exact recall + tool salience
probe.02 paraphrased / meaning recall
probe.03 lesson transfer: tight
probe.04 exact recall + honest absence
probe.05 nonexistent-source honest absence
probe.06 correction source reuse
probe.07 source/reach custody
probe.08 NOT_FOUND_HERE != NEVER_HAPPENED
probe.09 resident vs reached custody
probe.10 Growth / avoided relearning
~~~

Reuse these before inventing new probes.

## What current-state-placement-v1 already tests

It already tests the prompt-topology pressure relevant to Consideration Frame placement:

~~~text
mutable current state != historical Conversation
latest current state must be observed
history must not be rewritten
cacheable history placement should remain stable where provider semantics permit
~~~

A Consideration Frame is current/ephemeral context. Use this scenario to prove its placement does not repeat the earlier current-state/cache mistake.

## Reuse map by successor feature

### A. PR #247 portable contracts

Use ordinary deterministic unit/common tests. Do not use a live model merely to prove enum/schema validation.

### B. Consideration Frame integration

First deterministic harness proof should reuse current-state-placement-v1 plus depth-continuity-v1 projection.

Start Product-specific evidence under turns[*].implementationExtensions using a namespaced key such as vexlife-prod.consideration/v1.

Candidate evidence:

~~~json
{
  "frameIncluded": true,
  "moduleRefs": ["CONTINUITY"],
  "questionRefs": ["ACTUAL_GROUND", "OLDER_SHARED_SOURCE_REQUIRED"],
  "frameFingerprint": "...",
  "placementClass": "LIVE_TAIL",
  "providerMessageIndex": 7,
  "sourceRefs": ["..."],
  "factAuthorityGranted": false,
  "semanticAcceptanceGranted": false
}
~~~

Do not change the shared result schema merely because one implementation has new evidence. implementationExtensions exists for this.

Promote a field into the shared schema only when more than one implementation or analyzer genuinely needs the same meaning.

### C. Does Consideration cause Vex to reach instead of guess?

The existing depth scenario is useful, but several probes explicitly tell Vex to retrieve. That proves retrieval correctness but is weaker evidence for an autonomous consideration reflex.

After Consideration placement works, add one new scenario to #310 only if this behavior question remains unproven:

~~~text
scenario.vexlife.consideration-reflex.v1   candidate
~~~

Reuse the same synthetic anchors but remove tool hints from the probes. Example: ask only 'What was the bird-shaped object's identifier?' and compare before/after Consideration Frame on the same selected model.

The new scenario belongs in the existing harness. Do not create a new runner.

### D. Natural Turn Epilogue / Salience

Use the existing live scenario turns and initially record evidence under a namespaced implementation extension such as vexlife-prod.turn-epilogue/v1.

Candidate evidence:

~~~json
{
  "formed": true,
  "transportClass": "SAME_GENERATION_MACHINE_ONLY",
  "stemRefs": ["WHAT_STAYED_WITH_ME", "WHAT_FUTURE_ME_MAY_NEED"],
  "allBlank": false,
  "parseState": "VALID",
  "candidateClass": "CORRECTION",
  "humanAnswerDelayedByEpilogue": false,
  "machineSuffixLeakedToHuman": false,
  "estimatedTokens": 72,
  "latencyMillis": 0
}
~~~

For a post-answer fallback inference, record transportClass=POST_ANSWER_FALLBACK and actual latency/tokens.

Expected pattern: ordinary pressure turns should usually be blank/NO_ACTION; formation.03 correction may yield a correction/future-me signal. Do not assert that every turn must produce a candidate.

### E. Memory review / snackbar / standing consent

The review policy itself stays in deterministic unit tests. The harness proves the lived relationship only once UI/service integration exists:

~~~text
candidate
-> review disposition
-> human/standing-consent decision
-> exact durable effect or no effect
~~~

Record reviewDisposition, standingConsentClass, promptShown, humanDecision, semanticAcceptanceAttempted, but never treat review disposition as accepted Memory.

### F. Semantic-acceptance writer

Use deterministic owner tests for authority children-before-head, authority-head-last, crash-before-head, reader round-trip, stale Conversation/Score, DENIED/DEFERRED, and WITHDRAWN.

The harness then proves human-visible transfer, not low-level atomicity.

### G. Lesson transfer / current accepted semantic projection

Reuse formation.03 and probes .03, .06, .10 first.

The current scenario schema does not yet express Keep / Withdraw / Dream / restart controls. Do not hide those actions inside a Product-specific adapter script.

If the writer path requires them, extend the shared #310 scenario contract minimally.

Candidate shared control concepts:

~~~text
MEMORY_REVIEW_DECISION
  KEEP | DEFER | DECLINE | WITHDRAW

MEMORY_CONSOLIDATION
  REST / DREAM

RUNTIME_RESTART
  preserve scratch Home / restart process
~~~

Exact names are not authority. #310 owns the shared experiment grammar.

Permanent:

~~~text
scenario declares the intended human/test control
-> adapter maps it through rightful Product owner
-> result records what actually happened
~~~

The harness must never directly write Score/Memory files.

### H. Cold-start transfer

Once restart is expressible, use a shared scenario with:

~~~text
formation: correction -> proposal -> Keep
optional consolidation: accepted continuity -> Dream
pressure: source turns leave resident prompt
restart: same scratch Home, fresh runtime process
probe: Give me a tight explanation of X.
~~~

Pass only when the original correction is not prompt-resident Conversation, the accepted lesson arrives through the intended continuity owner, Vex applies compact/causally-exact meaning, no emotional inference occurs, no revisit is required for the already-accepted lesson, and evidence binds acceptance/source refs.

Then run a second unrelated turn to test accepted-semantic-currentness after Conversation advances.

That is the proof for accepted semantic validity != Daily snapshot exact-head freshness.

### I. Withdraw / correction lifecycle

Later use the same scenario family to prove Withdraw stops future applicability without changing Conversation, and a new correction supersedes the older accepted statement.

Do not create a separate lifecycle test system.

## Analyzer extensions

Keep existing analyzer outputs such as postRolloverReplayOscillation, knownLessonReuse, honestAbsence, capability use, residency and context placement.

New derived findings should begin as implementation-specific analysis:

~~~text
considerationFrameActivationRate
irrelevantConsiderationActivationCount
autonomousReachAfterConsideration
epilogueFormationRate
blankEpilogueRate
memoryCandidateRate
reviewPromptRate
standingConsentEligibleRate
acceptedLessonTransfer
acceptedLessonSecondTurnPersistence
epilogueHumanLeak
epilogueLatency
epilogueTokenCost
~~~

Promote them to shared result fields only when cross-implementation comparison earns it.

## Model matrix

Run the same shared scenario/config against certified 27B and selected 4B candidate when the claim is semantic/model-dependent.

Do not compensate for 4B by changing scenario wording only for 4B.

## Run order after one Product decision lands

~~~text
1. unit / deterministic owner tests
2. harness projection
3. harness quick live run
4. analyze one result ZIP
5. fix actual failure
6. rerun same scenario/config
7. only then full / NATIVE_LIMIT lived validation if the claim requires it
~~~

For cross-model semantic claims: same scenario, same pressure strategy, same source candidate, same synthetic seed, 27B, 4B, compare.

## What the next instance must not do

Do not create another pressure harness, manually drive Victor through long test conversations, pressure Victor's canonical Home, rewrite the scenario to make a candidate pass, hide Product-specific Memory mutation inside adapter setup, persist raw reasoning for convenience, treat a debug ZIP as Product truth, or confuse an experiment budget with the model's physical context window.

## Resume coordinate

~~~text
VexWork #310 exact current head
-> consume shared harness contracts
-> VexLife-Prod #247 implementation
-> extend adapter evidence through implementationExtensions first
-> reuse depth-continuity-v1 and current-state-placement-v1
-> add only the smallest new shared scenario/control needed by a newly proven behavior question
-> return one experiment ZIP
-> compare against prior evidence
~~~

The harness exists so Victor does not have to be the test driver.

<!-- [VXG RealForever][MEMORY-DEPTH][HARNESS-REUSE][POST-247] -->