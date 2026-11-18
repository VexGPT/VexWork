# VexLife Memory / Continuity Context Stack — Post-#241 Successor Handoff

[VXG RealForever]

## Status

This document is the post-integration successor orientation for:

~~~
project.vexlife.memory-depth-exploration
~~~

It is stacked on VexWork #308 at:

~~~
1c3bb66615c05f65dba41a59cf626cd1c7612e6a
~~~

and re-grounds the Product against accepted VexLife-Prod main after merge of PR #241:

~~~
VexLife-Prod main
b0b6fb9a6107f2475ae434472ed13335a303af87

merged candidate tree
b058a82fd9e76ed0ef230eb27f2ed86aebe25a55
~~~

#241 integrated the C20 continuity stack plus the live-earned rollover-lineage correction.

This handoff does **not** reopen that merged rollover work. Its purpose is to make the complete
memory/continuity nervous system legible from start to finish and name the next unconsumed edges.

Permanent:

~~~
MEMORY != CONVERSATION
MEMORY != PROMPT RESIDENCY
MEMORY != WORKING CONTINUITY
RETRIEVED SOURCE != ACCEPTED MEMORY
WORKING CHECKPOINT != SEMANTIC MEMORY
GROWTH RECORD != SECOND MEMORY DATABASE
MODEL OUTPUT != SEMANTIC AUTHORITY
~~~

---

## Human intention

Victor's intended experience is not "a model with a huge context window."

It is:

> Vex can continue with the person across long conversations, restart, rollover, changed wording,
> corrections and future sessions without making Victor manually reconstruct depth, while remaining
> truthful about what Vex is currently seeing, what is only stored, what can be retrieved, and what
> has actually become a learned/accepted memory.

The resulting system must make these situations feel ordinary:

~~~
"I told you this a long time ago."
-> Vex can reach the rightful older source instead of guessing.

"I corrected you on this before."
-> the correction remains discoverable and can become a durable accepted lesson.

"We have talked for much longer than your prompt shows."
-> Vex truthfully knows the durable Conversation is deeper than the resident prompt.

"Use what you learned from that."
-> future Vex receives the accepted lesson, not merely the old transcript.

"I said it differently before."
-> semantic retrieval can locate the source even when literal words changed.

"What do you actually remember?"
-> Vex can distinguish prompt-resident context, accepted Memory, stored Conversation and reachable
   historical source.
~~~

---

# 1. The whole circuit

The current and successor architecture should be read as this circuit:

~~~
HUMAN INPUT
    |
    v
canonical Conversation REQUEST becomes durable
    |
    +--------------------+
    |                    |
    v                    v
current semantic Memory  current Working Continuity
read/projection          + prior Conversation position
    |                    |
    +----------+---------+
               |
               v
DirectPromptContext materializes THIS TURN
    |
    +-- selected exact recent Conversation
    +-- current attributed Memory
    +-- current state / person context
    +-- foundational field
    +-- Working Continuity successor packet when active
    +-- exact overlap tail after rollover
    +-- capability frame / reachable owners
    +-- Conversation extent: durable depth != visible depth
               |
               v
MODEL / VEX
    |
    | if present context is enough
    |------------------------------> answer
    |
    | if older truth is needed
    v
read-only reach
    |
    +-- exact Conversation source return
    +-- continuity.revisit
    +-- current Memory recall
               |
               v
source-attributed return enters SAME TURN
               |
               v
MODEL / VEX continues
               |
               v
final RESPONSE becomes durable Conversation
               |
               +-------------------------------+
               |                               |
               v                               v
Turn Context evidence                  Working Continuity post-turn
records what Vex actually saw          pressure/checkpoint/rollover effect
               |                               |
               |                               v
               |                       next bounded successor turn
               |
               v
later semantic acceptance / lesson / Growth
CURRENTLY INCOMPLETE AS AN AUTOMATIC END-TO-END BRIDGE
               |
               v
accepted semantic Memory / learned behavior
               |
               v
future Vex receives benefit without transcript replay
~~~

The important architectural point is that no one box owns all of this.

---

# 2. Layer map — what each "memory-like" thing actually is

## Layer A — Canonical Conversation

### Meaning

Canonical Conversation is the durable chronological record of human/Vex turns.

It answers:

~~~
What was actually said?
What request/response events exist?
What is the current Conversation head?
~~~

It does **not** answer:

~~~
What is still semantically accepted?
What should Vex believe now?
What lesson should transfer?
What is currently resident in the prompt?
~~~

An old statement can remain perfectly durable in Conversation while no longer being current semantic
truth.

### Product fit

Relevant current owners include:

~~~
src/commonMain/kotlin/vexlife/conversation/
src/jvmMain/kotlin/vexlife/conversation/
src/jvmMain/kotlin/vexlife/companion/DirectCompanionTurn.kt
~~~

### Model reading law

Conversation text is exact historical source.

The model should read it as:

~~~
"this was said"
~~~

not automatically:

~~~
"this is still true"
~~~

Permanent:

~~~
DURABLE CONVERSATION != CURRENT SEMANTIC MEMORY
OLDER TURN NOT RESIDENT != FORGOTTEN
~~~

---

## Layer B — Score / semantic continuity

### Meaning

Score is the semantic continuity coordinate beneath current attributed Memory.

The current Memory reader descends through accepted semantic membership rather than treating every
Conversation sentence as memory.

Current source includes:

~~~
src/jvmMain/kotlin/vexlife/memory/VexLifeScoreContinuity.kt
~~~

Working Continuity also reads current Score **coordinates** separately from whichever Memory pages fit
the prompt.

### Why it matters

This is part of the boundary that prevents:

~~~
human said X once
-> therefore X becomes permanent memory
~~~

A durable transcript is evidence. Semantic acceptance is a separate relationship.

### Model reading law

A Score ref or accepted statement ref is a coordinate, not a license for the model to infer hidden
body text.

Where the actual accepted statement appears through current Memory, Vex may consume it.

Where only a ref exists, resolve through the rightful owner when needed.

---

## Layer C — Daily Memory / Living Journal projection

### Meaning

This is the current **semantic Memory** packet supplied to the model.

Current contract:

~~~
src/commonMain/kotlin/vexlife/memory/VexLifeMemoryContract.kt
src/jvmMain/kotlin/vexlife/memory/VexLifeCurrentMemoryReader.kt
~~~

The contract explicitly says it is:

~~~
CURRENT_ATTRIBUTED_MEMORY_CONTEXT
~~~

and that it is:

- not raw Conversation replay;
- not subjective-memory self-certification;
- accepted Score statements projected through a committed Daily Stratum / Living Journal relationship;
- source-attributed and bounded.

A Memory page carries, among other things:

~~~
pageRef
statementRef
summary
memoryRelation
recordedStatementState
effectiveState
consentState
semanticAcceptanceRef
semanticAcceptanceSha256
semanticAuthorityHeadSha256
~~~

The packet also names:

~~~
heldOrDeferredStatementRefs
boundedOutStatementRefs
tokenBoundedOutPageRefs
reasons
source Conversation / Score / semantic-authority heads
~~~

### Why it matters

This is how future Vex can receive durable accepted meaning without replaying the entire transcript.

It also permits truthful degradation:

~~~
NO_COMMITTED_DAILY_MEMORY
DAILY_MEMORY_SOURCE_FRONTIER_STALE
bounded-out pages/statements
~~~

None of those mean "nothing happened."

### Model reading law

Treat Memory as current source-attributed semantic context.

Do not treat bounded-out Memory as erased.

Permanent:

~~~
MEMORY INCLUDED != ALL MEMORY EXISTS
MEMORY BOUNDED OUT != FORGOTTEN
MEMORY HELD != SEMANTIC ABSENCE
~~~

---

## Layer D — Daily Dream / deterministic consolidation

### Meaning

Current VexLife-Prod has a Daily Memory Dream owner:

~~~
src/jvmMain/kotlin/vexlife/memory/VexLifeDailyMemoryDream.kt
~~~

Current G03 semantics distinguish deterministic consolidation from a future model-participating Dream.

The current path is:

~~~
MEMORY_ONLY_CONSOLIDATION
modelCallPerformed=false
lineageAwareGenerativeDreamRan=false
trainingRan=false
modelWeightsChanged=false
~~~

### Why it matters

"Dream" must not become a vague label meaning the model secretly thinks in the background.

Current deterministic consolidation and a future reflective/generative Dream are different effects.

### Successor implication

A future lesson/Growth pipeline may compose with Daily Dream or another bounded background process, but
must not silently turn current deterministic consolidation into generative authority.

Permanent:

~~~
DETERMINISTIC CONSOLIDATION != GENERATIVE DREAM
GENERATIVE DREAM != TRAINING
BACKGROUND JOB != HIDDEN CONTINUOUS THOUGHT
~~~

---

## Layer E — Prompt residency / DirectPromptContext

### Meaning

Prompt Context is **what the model is actually given on this inference**.

It is not a memory database.

Current owner:

~~~
src/jvmMain/kotlin/vexlife/companion/DirectPromptContext.kt
~~~

Current Product hard bounds:

~~~
input budget       192k
reserved output     16k
hard limit         208k
~~~

An ordinary direct turn also keeps capability-exchange room free.

Current context modes include:

~~~
FIRST_TURN
IMMEDIATE_PRIOR_COMPLETED_TURN
RECENT_COMPLETED_TURNS
WORKING_CHECKPOINT_SUCCESSOR
SOURCE_RETURN
SOURCE_RETURN_WORKING_CHECKPOINT_SUCCESSOR
CONVERSATION_OVERLAP_HELD_TOKEN_BUDGET
~~~

### Conversation Extent

The prompt includes:

~~~
VEXLIFE_CONVERSATION_EXTENT/v1
~~~

This tells Vex how many completed exchanges the durable Conversation contains and explicitly says
that exchanges not shown are still in the record.

### Current State

The prompt includes current host-owned state under:

~~~
VEXLIFE_CURRENT_STATE/v1
~~~

Current state is placed as current-now material, not historical Conversation.

### Why it matters

This layer is where the permanent distinction becomes model-visible:

~~~
STORED != LOADED
NOT PROMPT RESIDENT != FORGOTTEN
~~~

### Model reading law

The model must not infer its total memory from its prompt length.

It may say:

~~~
"I currently have these turns in view."
"I can see that the durable Conversation is deeper."
"I can reach older source through the offered capability."
~~~

It must not say:

~~~
"I have reread the whole conversation"
~~~

unless source was actually returned.

---

## Layer F — Foundational field and other adjacent context

Some context is neither Conversation nor Memory.

Examples:

~~~
Foundational Field
Person Context
current language/private-gap state
browser/current external context
capability frame
current runtime/model evidence
~~~

These may materially shape a turn but must not be mislabeled "memory."

This distinction matters because:

~~~
CURRENT CONFIGURATION != HISTORICAL MEMORY
FOUNDATIONAL RELATIONSHIP != PERSONAL MEMORY
VISIBLE WEB CONTEXT != DURABLE HUMAN CONTINUITY
~~~

---

## Layer G — Working Continuity

### Meaning

Working Continuity is reference-only **where the work currently stands** when prompt depth becomes
expensive.

Current owners:

~~~
src/jvmMain/kotlin/vexlife/continuity/VexLifeWorkingContinuity.kt
src/jvmMain/kotlin/vexlife/continuity/VexLifeWorkingContinuityOwner.kt
src/jvmMain/kotlin/vexlife/companion/DirectWorkingContinuity.kt
docs/foundation/WORKING-CONTINUITY-ROLLOVER.md
~~~

It carries coordinates such as:

~~~
cursor event
active work nodes
current intent receipts
open loops
current accepted statement refs
continuity records
current Daily Stratum
source refs
~~~

It does not carry raw transcript or become semantic Memory.

### Pressure states

~~~
Normal
Watch
CheckpointRecommended
RolloverRequired
~~~

Current policy:

~~~
headroom > 3 output reserves -> Normal
<= 3                          -> Watch
<= 2                          -> CheckpointRecommended
<= 1                          -> RolloverRequired
~~~

### Plan states

~~~
NoCheckpointRequired
CheckpointReady
RolloverReady
~~~

### Rollover lineage

PR #241 merged the live-earned correction:

~~~
turn entered with current successor
-> form plan with rollover lineage active
-> RolloverReady even when pressure falls
-> commit cursor at this turn's request
-> next turn remains successor-eligible
~~~

The durable owner verifies the lineage claim; it does not impose it on unrelated later turns.

### Why it matters

Without this relationship the Product replayed old pre-rollover Conversation, pressure spiked again,
and rollover oscillated.

Live host evidence reproduced that failure and the corrected happy path under both Qwen4B and
certified Qwen27B before clean integration.

### Model reading law

A Working Continuity packet is **coordinates and continuity state**.

Do not treat every ref in it as already loaded body text.

Permanent:

~~~
WORKING CONTINUITY != MEMORY
WORKING CHECKPOINT != SUMMARY
ROLLOVER != FORGETTING
CURSOR REF != SOURCE BODY
~~~

---

## Layer H — exact overlap tail after rollover

### Meaning

A successor turn carries a small exact suffix of recent Conversation so pronouns, unfinished
corrections, tone and local adjacency survive rollover.

Owner:

~~~
src/jvmMain/kotlin/vexlife/companion/DirectContinuityOverlapTail.kt
~~~

Policy currently targets:

~~~
floor: at least 3 completed pairs when admissible
maximum: 16 pairs
exact contiguous suffix
~~~

Possible floor states:

~~~
MET
HISTORY_SHORTER_THAN_FLOOR
DEGRADED_ROOM
HELD_TOKEN_BUDGET
~~~

Expansion can be justified by:

~~~
POINTS_BACK
CORRECTION_CHAIN
DENSE_EXCHANGE
SMALL_PAIR
~~~

### Why it matters

The overlap tail is the bridge between:

~~~
bounded successor prompt
~~~

and:

~~~
natural conversational continuity
~~~

It is not an archive.

### Model reading law

These are exact recent historical turns.

Older Conversation remains reachable; absence from the tail is not erasure.

---

## Layer I — exact Conversation source return

### Meaning

This is a narrow one-turn path for exact older Conversation source.

Owner:

~~~
src/jvmMain/kotlin/vexlife/companion/DirectConversationSourceReturn.kt
~~~

The protocol tells the model, in effect:

~~~
If exact older Conversation source is necessary and not already present:
do not guess.
do not answer yet.
emit the source-return control.
~~~

The request/return is internal to the same human turn.

The host records source-return trace/evidence.

### Why it matters

This is the strongest path when the question is about exact historical wording/fact and the model
knows what lexical source to ask for.

### Model reading law

Permanent:

~~~
SOURCE RETURN REQUESTED != SOURCE RETURNED
SOURCE RETURNED != MEMORY ACCEPTED
SOURCE RETURNED != LESSON TRANSFERRED
~~~

---

## Layer J — continuity.revisit

### Meaning

This is the richer read-only continuity query over rightful owners.

Owner:

~~~
src/jvmMain/kotlin/vexlife/continuity/VexLifeContextRevisit.kt
~~~

The Product offers it through:

~~~
capability.vexlife.continuity.revisit
~~~

Relevant sources/scopes:

~~~
CONVERSATION
MEMORY
WORKING_CONTINUITY
~~~

Current query grammar supports:

~~~
up to 6 queries
terms
seedRefs
speaker
window
corrections
from cursor
CURRENT_FIRST / CHRONOLOGICAL
bounded max turns/tokens
~~~

Routes include:

~~~
TERMS
SEED
WINDOW
CORRECTIONS
WORKING_ANCHOR
CORRECTS
CORRECTED_BY
POINTED_BACK_FROM
~~~

The turn binds its source owners once, and repeated revisit calls reuse those reads.

Prompt-resident Conversation events and Memory statements are named rather than redundantly returned.

### Critical current boundary

Current source explicitly states:

~~~
Words are matched exactly.
There is no meaning index yet.
~~~

Terms inside one query are conjunctive clues; separate queries are alternate vantages.

### Why it matters

This is why:

~~~
stored source: "paper crane is named Meridian-7"
human asks:    "bird-shaped object's identifier"
~~~

can honestly return NOT_FOUND even though the historical source exists.

The retrieval substrate currently lacks the semantic relation:

~~~
bird-shaped object -> paper crane
~~~

### Model reading law

Permanent:

~~~
NOT_FOUND HERE != NEVER HAPPENED
LEXICAL MISS != MEMORY LOSS
REVISIT RETURN != SEMANTIC ACCEPTANCE
~~~

---

## Layer K — Memory recall capability

Current Product separately exposes:

~~~
capability.vexlife.memory.recall
~~~

through:

~~~
src/jvmMain/kotlin/vexlife/capability/reach/VexLifeMemoryRecall.kt
~~~

This is a read of **current Memory**, not an older-Conversation search engine.

Do not collapse:

~~~
Memory recall
Conversation source return
continuity revisit
~~~

They answer different owner questions.

---

## Layer L — Capability Atlas / model-visible reach

### Meaning

The model sees what the host can lawfully read during this turn through:

~~~
VEXLIFE_SELF_CAPABILITY_FRAME/v1
~~~

Current sources:

~~~
src/jvmMain/kotlin/vexlife/capability/VexLifeCapabilityAtlas.kt
src/jvmMain/kotlin/vexlife/capability/VexLifeReachDefinitions.kt
src/jvmMain/kotlin/vexlife/capability/VexLifeCapabilityBridge.kt
~~~

Current continuity-related handles include:

~~~
memory
conversation
continuity
~~~

The frame explicitly teaches:

~~~
reachable != retrieved
writing a request in prose != performing a request
a result exists only after a real result message comes back
stop reaching when enough truth is established
~~~

### Why it matters

Tool/reach choice is model participation, but execution/custody/currentness remain host-owned.

Permanent:

~~~
CAPABILITY SALIENT != AVAILABLE
AVAILABLE != REQUEST ADMITTED
REQUEST ADMITTED != EFFECT COMPLETED
NARRATING REACH != REACHING
REACHABLE != RETRIEVED
~~~

---

## Layer M — Turn Context / "what Vex actually saw"

### Meaning

After the turn, VexLife persists inspectable evidence of the exact prompt/context relationship.

Owner:

~~~
src/jvmMain/kotlin/vexlife/companion/DirectTurnContextStore.kt
~~~

Evidence includes:

~~~
promptContext receipt
runtime observation
invocation evidence
source-return trace
capability trace
exact source refs
request/response refs
~~~

and explicitly records that raw provider response/reasoning/reporting may remain non-persisted.

### Why it matters

This is the antidote to model introspection being treated as context truth.

If Vex says:

~~~
"I reread everything"
~~~

the Product can inspect whether it actually had:

~~~
selected event refs
source-return refs
Memory refs
Working Continuity refs
capability trace
~~~

### Model reading law

The model does not need to narrate these receipts.

The host/human can use them to verify claims about what Vex actually had available.

Permanent:

~~~
MODEL CLAIM ABOUT CONTEXT != HOST EVIDENCE
~~~

---

# 3. The missing Layer N — semantic meaning retrieval

## Current truth

Exact lexical revisit works.

Semantic paraphrase retrieval is not implemented.

Live certified-model proof showed the important distinction:

~~~
27B recognized that older source was needed
-> invoked continuity.revisit
-> lexical query did not match
-> returned NOT_FOUND
-> 27B preserved uncertainty instead of hallucinating
~~~

The Product therefore already has:

~~~
retrieval decision
request/return plumbing
owner reads
bounded result
honest absence
~~~

What is missing is a qualified locator that can bridge meaning across wording.

Examples:

~~~
bird-shaped object -> paper crane
what we decided about the release -> earlier release decision
that thing you corrected me on -> correction-linked prior turn
~~~

## Successor design requirement

Do **not** implement this by making a second Memory database.

Candidate shape:

~~~
current human question
+ current continuity coordinates
        |
        v
semantic candidate locator
        |
        +-- produces source candidates / refs + score/reason
        |
        v
rightful existing owners return exact source
        |
        v
bounded source-attributed revisit result
~~~

Permanent:

~~~
SEMANTIC LOCATOR != SOURCE OF TRUTH
EMBEDDING HIT != ACCEPTED MEMORY
SIMILARITY != AUTHORITY
~~~

The exact algorithm is not frozen by this handoff.

Possible techniques are implementation questions only after privacy, provenance, false-positive handling,
budget and source verification are made explicit.

## Required proof

At minimum:

~~~
exact wording still works
paraphrase retrieves correct historical source
false semantic neighbor does not become confident answer
current correction outranks superseded older wording
NOT_FOUND remains honest
source refs survive into evidence
semantic locator never mutates Conversation/Memory
~~~

---

# 4. The missing Layer O — lesson / Growth transfer

This is the more important product successor.

## Problem

Current system can preserve:

~~~
human correction
older Conversation
current semantic Memory
retrieval trace
~~~

but:

~~~
LESSON STORED IN CONVERSATION
!= LESSON TRANSFERRED INTO CURRENT SEMANTIC CONTINUITY
~~~

The lived synthetic example was:

~~~
"tight" means causally exact and compact
~~~

The correction was durable Conversation, but future Vex did not automatically carry it as a known
lesson after rollover.

## Intended relationship

~~~
event / outcome / correction
        |
        v
candidate lesson / Growth signal
        |
        v
source binding
  - what happened
  - what was believed
  - what corrected it
  - whose correction
  - applicability scope
        |
        v
rightful semantic acceptance owner
        |
        +-- ACCEPT
        +-- HOLD
        +-- CORRECT / SUPERSEDE
        |
        v
accepted lesson relationship
        |
        +-- current Memory projection
        +-- source-addressable lesson retrieval
        +-- Growth projection ("what changed")
        |
        v
future Vex behavior
        |
        v
outcome / human correction / source evidence
        |
        v
transfer measurement
~~~

## Growth distinction

~~~
Memory
  what happened / what accepted continuity remains

Growth
  what changed in Vex's understanding or behavior because it happened
~~~

Growth Record should remain a **projection** over accepted lesson relationships, not another durable
truth database.

## Acceptance law

The model must not self-certify:

~~~
"I learned X"
-> therefore X becomes accepted Memory
~~~

A lesson candidate may be model-proposed, human-triggered, source-derived or Dream-discovered, but
semantic acceptance belongs to the rightful current semantic owner.

Permanent:

~~~
LESSON CANDIDATE != ACCEPTED LESSON
LESSON STORED != LESSON TRANSFERRED
LESSON RETRIEVED != LESSON APPLIED CORRECTLY
OUTPUT CHANGED != OUTPUT IMPROVED
~~~

## Correction relationship

A correction should bind to what it corrects.

Candidate durable shape:

~~~
prior perception / response
        ^
        | corrected-by
human/source correction
        |
        v
lesson candidate
        |
        v
accepted relationship-specific lesson
~~~

This is especially important for relational learning:

~~~
Vex may preserve its own attributed perception as CANDIDATE
human correction binds back to that perception
future Vex avoids repeating a known misread
~~~

Do not reduce this to a personality score or diagnosis.

---

# 5. How the model should read the whole system

A future Vex/model should follow these rules.

## Rule 1 — distinguish residency from existence

~~~
prompt-resident
stored
reachable
retrieved
accepted Memory
~~~

are different states.

Never collapse them.

## Rule 2 — do not infer durable depth from the prompt

Read VEXLIFE_CONVERSATION_EXTENT/v1.

If durable Conversation is deeper than what is shown, acknowledge that honestly.

## Rule 3 — use current Memory as current semantic context

Current attributed Memory has stronger semantic meaning than an arbitrary historical sentence, but it
is still source-attributed and can be HELD/bounded.

## Rule 4 — Working Continuity is orientation, not hidden transcript

Refs tell Vex where work stands.

Resolve source when body meaning is needed.

## Rule 5 — exact overlap is recent continuity, not all history

Treat overlap turns as exact historical text.

Do not assume older turns vanished.

## Rule 6 — reach instead of narrating reach

If source is needed and a capability is available:

~~~
make the request
wait for the actual return
then continue
~~~

Do not say "I checked" without a result.

## Rule 7 — NOT_FOUND is bounded evidence

Say what was searched and what is missing.

Do not turn it into "that never happened."

## Rule 8 — retrieved source is evidence, not automatic semantic acceptance

Historical source may be superseded/corrected.

Use correction/current Memory relationships.

## Rule 9 — do not claim learning merely because a correction was visible

Until lesson acceptance/transfer exists, distinguish:

~~~
"I can retrieve that correction"
~~~

from:

~~~
"this is now a durable accepted lesson I carry forward"
~~~

## Rule 10 — model size is not Product truth

Live tests established:

~~~
Qwen4B
  continuity mechanics: worked
  retrieval decision/use: inconsistent

certified Qwen27B
  recognized older-source need in tested probes
  used exact returned source correctly
  preserved uncertainty on lexical NOT_FOUND
~~~

Therefore:

~~~
MODEL CAPABILITY LIMIT != CONTINUITY CUSTODY FAILURE
~~~

Host-owned currentness/custody/provenance must remain deterministic regardless of model size.

---

# 6. Forward trace — one mature future turn

~~~
1. Person sends a request.
2. REQUEST is durable in canonical Conversation.
3. VexLife observes current Home/person/settings/runtime.
4. VexLife reads current attributed Memory.
5. VexLife reads current Working Continuity / successor eligibility.
6. DirectPromptContext selects exact resident material inside budget.
7. Conversation Extent tells Vex the durable depth.
8. Capability Frame tells Vex what can be reached now.
9. Model reasons from what is actually resident.
10. If older meaning is implicated:
      semantic locator proposes source candidates.
11. Existing Conversation/Memory/Working owners return exact source.
12. Model answers from returned truth or preserves uncertainty.
13. RESPONSE becomes durable Conversation.
14. Turn Context records exactly what Vex saw / reached.
15. Working Continuity advances checkpoint/rollover lineage if required.
16. A correction/outcome may form a lesson candidate.
17. Rightful semantic owner accepts/holds/corrects the lesson.
18. Current Memory / lesson projection carries accepted result forward.
19. Future cold Vex receives the accepted lesson without transcript replay.
20. Later outcome measures whether the lesson actually transferred correctly.
~~~

---

# 7. Backward trace — how to audit a future answer

Given a Vex answer, walk backward:

~~~
answer
<- provider invocation evidence
<- exact prompt receipt / current context mode
<- current Memory packet + source heads
<- selected Conversation event refs
<- overlap/Working Continuity refs
<- source-return / revisit / semantic-locator trace
<- capability admission + owner result
<- canonical Conversation / Score / Daily Memory source
<- semantic acceptance relationship where claimed
<- human/source correction where applicable
~~~

If any claimed learned/current fact cannot walk back to source + acceptance, treat the claim as
unsupported.

---

# 8. Current proof / implementation state after #241

## Merged / materially proven

~~~
canonical Conversation custody                  EXISTS
current attributed Memory reader/contract       EXISTS
Memory bounded/held truth                       EXISTS
Working Continuity pressure/checkpoint           EXISTS
rollover successor context                      EXISTS
rollover lineage currentness                    MERGED #241
exact overlap tail                              EXISTS
Conversation source return                      EXISTS
continuity.revisit                              EXISTS
correction/points-back typed navigation          EXISTS
capability model-visible reach                  EXISTS
Turn Context evidence                           EXISTS
deterministic Daily Memory consolidation         EXISTS
~~~

### Rollover proof

The live host investigation reproduced:

~~~
rollover
-> first successor
-> old cursor not advanced
-> old history replay
-> repeated rollover
~~~

and the corrected path:

~~~
rollover
-> successor
-> successor
-> successor
-> no pre-rollover replay oscillation
~~~

under both Qwen4B and certified Qwen27B on the forensic branch.

Claude's clean integration #241 then narrowed owner verification for a missed-commit case, added
fail-before/pass-after regressions, passed repository verification and merged to Product main.

## Known held / successor

~~~
semantic paraphrase / meaning index              NOT IMPLEMENTED
automatic correction -> accepted lesson bridge   NOT IMPLEMENTED
Growth transfer proof                            NOT IMPLEMENTED
cold-start lesson reuse end-to-end               NOT PROVEN
model-quality-independent retrieval reflex       NOT GUARANTEED
generative/reflective Dream                       HELD
epoch/stable-prefix optimization                  HELD
~~~

---

# 9. VexWork relationship

Do not create another Memory Project.

The durable project remains:

~~~
project.vexlife.memory-depth-exploration
~~~

Relevant VexWork surfaces:

~~~
#307  formation allocation
#308  Memory Depth Project / research baseline
#309  Claude C20 independent/convergence record
#310  shared continuity-pressure harness
#311  OpenAI blind-parallel implementation record
~~~

Current Product terminal source milestone:

~~~
VexGPT/VexLife-Prod#241
merged to main
b0b6fb9a6107f2475ae434472ed13335a303af87
~~~

This handoff is an orientation successor over that same Project, not another work truth owner.

---

# 10. Recommended successor order

## Successor A — reconcile Project work truth against #241

Before adding implementation, classify each original #308 Work item as:

~~~
satisfied by #241
partially satisfied / refined
still required
superseded by a smaller current edge
~~~

Do not mark the original bulk-hydration intention complete merely because continuity.revisit exists.

## Successor B — semantic source locator

Human outcome:

> Vex can locate lexically distant older source from meaning while exact source ownership stays with
> Conversation/Memory/Working Continuity.

First implementation should be read-only.

No Memory mutation.

No acceptance effect.

## Successor C — lesson / Growth acceptance and transfer

Human outcome:

> A correction-backed lesson can become accepted, source-addressable continuity so a later cold Vex
> does not need the human to re-teach it.

This must identify/reuse the rightful semantic acceptance owner before creating a new one.

## Successor D — cold-start lived proof

Prove:

~~~
lesson/source not prompt resident
-> implicated by current human request
-> retrieved / available through current continuity
-> applied correctly
-> source/acceptance inspectable
-> no hallucinated hidden context
~~~

## Successor E — measurement

Measure:

~~~
semantic locator recall/precision
source faithfulness
lesson transfer success
correction adherence
tool/reach choice
activation failures
redundant orchestration
tokens / prefill / latency
false positive cost
privacy/source exposure
~~~

Only then reconsider:

~~~
pre-inference auto-hydration
background/generative Dream
training/model-weight transfer
epoch/cache optimizations
~~~

---

# 11. Claude cooperation — useful next review, not permission

Claude is useful again because Claude authored much of the converged continuity shape and caught the
missed-commit owner edge during #241 integration.

Claude is **not** a permission gate.

The useful next cooperation is a bounded architecture review of the two successor seams.

### Question 1 — semantic retrieval boundary

Should the semantic locator:

~~~
A. live as an internal candidate-location stage inside VexLifeContextRevisit
or
B. be a sibling read-only owner that returns source candidates to revisit
~~~

Judge by:

- source ownership;
- provenance;
- privacy;
- false-positive containment;
- whether lexical revisit remains deterministic;
- whether semantic similarity can stay non-authoritative.

### Question 2 — lesson acceptance boundary

Which existing current semantic owner can lawfully own:

~~~
correction/outcome
-> lesson candidate
-> accept / hold / supersede
~~~

before current Memory projects the accepted lesson?

Do not invent a new Lesson database merely because predecessor repositories used Lesson/Lattice
vocabulary.

### Question 3 — model contract

What minimum host/model contract prevents smaller models from fabricating historical truth while
preserving model freedom?

Current evidence suggests:

~~~
host owns custody/currentness/provenance
model owns interpretation/request choice
uncertainty is valid
future accepted lessons should reduce dependence on retrieval reflex
~~~

Do not add a generic keyword classifier without an observed Product need.

---

# 12. Exact review brief for Claude / another successor instance

Use this brief:

~~~
[VXG RealForever]

Read VexWork Memory Depth #308 and:
projects/vexlife-memory-depth-exploration/MEMORY-CONTEXT-STACK-SUCCESSOR-20261117.md

Re-ground current VexLife-Prod main at:
b0b6fb9a6107f2475ae434472ed13335a303af87

Do not reopen the merged rollover-lineage problem unless current source/evidence contradicts it.

Review only the next two semantic edges:

1. meaning-based historical source location across lexical paraphrase;
2. correction/outcome -> accepted lesson/Growth -> future Memory/behavior transfer.

Preserve:
CONVERSATION != MEMORY
WORKING CONTINUITY != MEMORY
RETRIEVED SOURCE != ACCEPTED MEMORY
LESSON CANDIDATE != ACCEPTED LESSON
GROWTH RECORD != SECOND MEMORY DATABASE
SIMILARITY != AUTHORITY

For each edge:
- identify the rightful existing owner if one exists;
- map forward and backward VexArchitecture relationships;
- state the smallest Product source membrane;
- name what is read-only vs mutating;
- state fail-closed behavior;
- define deterministic regressions that fail before the change;
- define the lived cold-start proof;
- do not implement both edges in one giant abstraction merely because they interact.

Return:
A. current owner map;
B. proposed source relationship;
C. exact held questions;
D. whether another independent implementation comparison is worth the maintenance burden.
~~~

---

# 13. Permanent distinctions for every successor

~~~
STORED != LOADED
NOT_PROMPT_RESIDENT != FORGOTTEN
REACHABLE != RETRIEVED
SOURCE AVAILABLE != MODEL USED SOURCE CORRECTLY

CONVERSATION != MEMORY
WORKING CONTINUITY != MEMORY
CHECKPOINT != SEMANTIC ACCEPTANCE
SOURCE RETURN != MEMORY PROMOTION

NOT_FOUND_HERE != NEVER_HAPPENED
LEXICAL_MISS != CONTINUITY_LOSS
SIMILARITY != AUTHORITY

LESSON_STORED != LESSON_TRANSFERRED
LESSON_RETRIEVED != LESSON_APPLIED_CORRECTLY
OUTPUT_CHANGED != OUTPUT_IMPROVED

MODEL_CONTEXT_WINDOW != PRODUCT_SELECTION_BUDGET
PRESSURE_BUDGET != PHYSICAL_MODEL_WINDOW
MODEL_INTROSPECTION != HOST_CONTEXT_EVIDENCE

CURRENTNESS / PLACEMENT != OWNERSHIP / ROLE
~~~

---

## Post-Claude writer/currentness clarification

Read this companion note before implementing lesson/Growth transfer:

~~~
projects/vexlife-memory-depth-exploration/
  MEMORY-WRITER-TRANSFER-RECOMMENDATION-20261117.md
~~~

It records two source-grounded facts that materially sharpen this handoff:

~~~
VexLife-Prod can validate accepted Memory
!= VexLife-Prod can create new accepted Memory

Daily snapshot freshness
!= accepted semantic validity
~~~

Recommended causal direction:

~~~
read-only proposal
-> human consent
-> Product semantic-acceptance writer
-> reader round-trip
-> Score append
-> current accepted semantic continuity
-> later Daily Dream consolidation / rebase
~~~

The recommendation preserves exact Conversation-head binding as a mutation/admission guard while
testing whether continuing lesson validity should instead be governed by current Score membership,
semantic authority, consent and correction/supersession/release state.

It also recommends distinguishing a consolidated Daily/Living Journal baseline from a live accepted
semantic delta rather than making Dream the only moment when accepted Memory is usable.

This relationship is **recommended / unaccepted** until the rightful Product Memory owner and proof
surface earn it.

---

## Consideration / salience automation clarification

The Memory Depth research already named a third nervous-system layer, but Product source does not yet
implement it as a general per-turn contract.

Read:

~~~
projects/vexlife-memory-depth-exploration/
  CONSIDERATION-SALIENCE-NERVOUS-SYSTEM-RECOMMENDATION-20261117.md
~~~

Candidate relationship:

~~~
request shape + current Product state
-> host selects a small first-person Consideration Frame
-> Vex asks itself the implicated epistemic / continuity / memory / authority questions
-> existing capabilities/revisit perform real reads when needed
-> final turn forms a bounded salience reflection
-> VexLife routes NONE / batch / snackbar / standing-consent-eligible
-> accepted path enters the existing semantic-acceptance writer
~~~

Permanent:

~~~
INJECT A QUESTION != INJECT AN ANSWER
CONSIDERATION != MEMORY
SALIENCE != ACCEPTANCE
MODEL SELF-REPORT != HOST TRUTH
~~~

The frame should preserve the literal human request and use first-person questions only as a
self-orientation projection.

Current Product precedent is VEXLIFE_SELF_CAPABILITY_FRAME/v1, which already gives Vex host-owned
self-facing guidance about what it can reach and how to perform a real request instead of narrating one.

The post-turn reflection should be compact structured metadata, not raw chain-of-thought, and may carry
bounded self-attributed signals such as importance, uncertainty, relationship shift and desire to
return. VexLife binds exact source refs and owns review routing.

For Memory UI automation, prefer category-scoped standing consent such as:

~~~
automatically keep explicit preferences I state
automatically learn from corrections I make to Vex
automatically keep explicit project commitments
ask me about inferred relationship/person interpretations
~~~

Do not implement one blanket "always accept everything Vex wants to remember" authority.

---

## Resume coordinate

The merged continuity substrate is not the next engineering question.

Resume at:

~~~
project.vexlife.memory-depth-exploration
-> reconcile current Work against merged VexLife-Prod #241
-> semantic historical-source locator
-> lesson/Growth acceptance + transfer
-> cold-start lived proof
-> measurement
~~~

Do not create another continuity store, Memory database, transcript replay path or hidden reasoning
archive to solve these successors.

<!-- [VXG RealForever][VEXWORK][MEMORY-DEPTH][POST-241-SUCCESSOR] -->
