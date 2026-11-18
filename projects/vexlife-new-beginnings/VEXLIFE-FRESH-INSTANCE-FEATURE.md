# VexLife Fresh Instance Feature

[VXG RealForever]

## Human outcome

Victor wants a cheap, ordinary control:

> **Start fresh.**

The visible conversation should become a genuinely new working thread so Victor and Vex can begin again without carrying the prior thread's growing immediate Conversation context into every turn.

Fresh must **not** mean amnesia.

The same Vex Home, person/device/Companion lineage, current settings, accepted Memory/semantic continuity, and lawful reach to older source remain available through their rightful owners. When older context becomes relevant, Vex should be able to reach for it instead of requiring every prior turn to remain resident.

~~~text
long / heavy current Conversation
        ↓
human chooses Start fresh
        ↓
new canonical Conversation thread
visible message surface is empty
old-thread Conversation tail is not resident by default
        ↓
current settings
+ bounded accepted Memory / semantic continuity when current
+ current Capability / Product context
        ↓
human says something new
        ↓
Vex answers from the fresh working frame
        ↓
older context becomes relevant
        ↓
rightful Memory / Conversation-source / hydration reach
        ↓
source-attributed context returns into this turn
without rewriting history or pretending it was always resident
~~~

The feature is motivated by human-lived product pressure: after a fresh VexLife run, interaction felt materially more responsive than the accumulated long-thread experience. That observation earns a feature and a measurement question; it does **not** prove that Conversation length is the sole cause of latency.

## Naming boundary

**VexLife Fresh Instance Feature** is the human-facing feature/work name.

Its first semantic product meaning is a **fresh canonical Conversation thread / fresh working context**.

It is not, by implication:

~~~text
a new Vex identity
a new Vex Home
a new Companion lineage
a new operating-system process
a model-runtime restart
a VexWork Work Participation sessionRef
deletion of the prior Conversation
deletion of Memory
deletion of user preferences
a provider-chat thread becoming canonical truth
~~~

Product source should use a distinct Conversation/thread identity so the human feature name does not collide with VexWork's separate execution/session identity vocabulary.

## Current Product pressure

Current VexLife-Prod source has one fixed direct Conversation address:

~~~text
project.self-development
thread.self-development.open-conversation
channel.self-development.companion
~~~

DirectConversationStore derives durable events, immutable heads, the current head and writer lease beneath that fixed thread coordinate.

Therefore:

~~~text
CLEAR UI MESSAGE LIST != NEW CONVERSATION
RESTART JAVA != NEW CONVERSATION
RESET CURRENT HEAD IN PLACE != NEW CONVERSATION
~~~

A truthful Fresh Instance feature pressures Conversation/thread identity to become formable/selectable while preserving the existing Conversation owner and durable lineage laws.

Current relevant Product owners already include:

~~~text
DirectConversationStore
  canonical Conversation events / heads / writer custody

DirectPromptContext
  bounded provider materialization

DirectWorkingContinuity / VexLifeWorkingContinuity
  working-context pressure / rollover continuity

VexLifePersonSettings
  current Home-scoped person settings
  today: reply language

VexLifeCurrentAcceptedSemanticProjection
VexLifeCurrentAcceptedSemanticPromptBlock
  current accepted, human-authorized semantic continuity

VexLifeMemoryRecall
DirectConversationSourceReturn
  bounded reach back to older source

Capability / reach owners
  what Vex can truthfully request now
~~~

Fresh Instance composes these owners. It does not create a "fresh memory" database.

## What remains present in a fresh thread

The working frame distinguishes **resident current context** from **reachable historical context**.

### Resident by default

A new thread may still truthfully receive current information not owned by the old Conversation:

~~~text
current person settings/preferences from their rightful owner
current Home / Product state already admitted to the turn
current model / capability frame
bounded current accepted semantic Memory when current and admitted
other current source-owned context existing prompt policy requires
~~~

Fresh does not suppress truthful current settings merely because they were learned or selected before the new thread began.

### Not resident by default

~~~text
prior thread's immediate completed-turn tail
prior thread's whole transcript
prior thread's provider-materialized messages
prior thread's ephemeral reasoning/progress
an opaque summary pretending to replace canonical history
~~~

### Reachable when implicated

~~~text
accepted Memory / learned continuity
exact older Conversation events
source-return / revisit material
future bounded bulk hydration / semantic historical retrieval
~~~

Retrieval preserves provenance/currentness. Becoming relevant again does not mutate historical source merely because it entered the current turn.

## Relationship to Memory Depth work

This feature is a **consumer pressure** on the active Memory Depth trajectory, not a second Memory owner.

Relevant current VexWork work:

~~~text
#308  Memory Depth Exploration
      bounded bulk continuity hydration over rightful owners

#315  Memory Depth successor
      semantic historical-source location
      accepted lesson / Growth transfer
      consideration / salience

#310  shared Conversational Boundaries pressure harness
      prompt residency / rollover / current-state placement /
      historical reach measurement

#292  relationship continuity orientation
      finite active context != relationship discontinuity
      continuity = carry-forward + targeted return + revised present understanding
      release is first-class rather than endless accumulation
~~~

Fresh Instance can ship incrementally before every future semantic-hydration capability is complete, but it should leave a clean reach seam rather than baking whole-history residency into the new thread.

## First semantic circuit

Candidate product circuit:

~~~text
CURRENT active Conversation
+ human Control: StartFresh
        ↓
rightful Conversation/thread owner resolves one lawful Act
        ↓
Effect: form/select a new canonical Conversation thread
(no old-thread deletion)
        ↓
Conversation Store realizes new thread identity / empty head
        ↓
fresh observation
        ↓
Fresh Conversation State
        ↓
presentation switches to the new empty thread
        ↓
first human Send
        ↓
DirectPromptContext composes current non-Conversation context
+ zero old-thread Conversation events by default
        ↓
model inference
        ↓
new thread's own durable REQUEST / RESPONSE / Context / Head
~~~

If the human later switches back:

~~~text
select prior thread
-> observe exact prior head/events
-> project those exact messages again
~~~

Switching threads is selection, not event replay or copying.

## "Hunt for context" circuit

The intended behavioral shape:

~~~text
fresh human request
-> Vex receives current truthful frame
-> Vex recognizes relevant context is missing
-> Vex requests an existing bounded reach capability
-> rightful owner locates exact source / accepted Memory / hydration neighborhood
-> verified source-attributed result returns
-> same fresh Conversation turn continues
~~~

Permanent distinctions:

~~~text
FRESH THREAD != NO MEMORY
MEMORY AVAILABLE != MEMORY RESIDENT
HISTORICAL SOURCE EXISTS != WHOLE HISTORY IN PROMPT
RETRIEVED != CANONICALIZED AGAIN
RELEVANT != AUTOMATICALLY TRUSTED
VEX MAY REACH != VEX HAS EFFECT AUTHORITY
~~~

The model should not need private storage coordinates. Capability/source owners expose bounded semantic reach.

## Responsiveness hypothesis

The lived observation motivates:

~~~text
smaller immediate Conversation residency
-> less provider materialized input / prefill pressure
-> potentially faster first-token response
~~~

But independent contributors include:

~~~text
Conversation materialization
Memory / semantic blocks
current capability/context blocks
model/runtime coldness
provider prompt-cache reuse
KV / unified-memory pressure
generation workload
~~~

Acceptance therefore measures rather than assumes.

A fresh-thread proof should record at minimum:

~~~text
selectedConversationEventRefs
providerMaterializedInputTokenEstimate
input token budget / reserved output
Memory inclusion + source refs
capability-frame inclusion
prompt-cache evidence when available
first-token / first-visible latency
final completion latency
~~~

A semantic Fresh Instance PASS does not require a fixed percentage speedup. Performance is claimed only when repeated comparable lived evidence earns it.

## First acceptance criteria

### Conversation truth

1. Start fresh creates a new canonical thread identity.
2. The prior thread remains durable and unchanged.
3. The new thread begins with no Conversation head/events of its own.
4. Presentation visibly switches to the empty new thread.
5. The human can re-enter the prior thread and recover its exact prior messages/head.
6. New messages advance only the selected new thread.

### Fresh working context

7. The first fresh-thread turn selects zero prior-thread Conversation events by default.
8. Current source-owned person settings/preferences remain available under current owners/policy.
9. Current accepted semantic Memory may remain available when current/admitted; Start fresh does not delete or silently suppress it.
10. No hidden whole-history summary substitutes for canonical Conversation history.

### Historical reach

11. A request genuinely implicating older context can trigger bounded source/Memory reach.
12. Returned historical context is source-attributed and appears in turn/context evidence.
13. Retrieval does not rewrite source thread, accepted Memory or current thread history merely because it was consulted.
14. Absence/unknown stays truthful; Vex does not fabricate continuity when retrieval cannot locate it.

### Lifecycle / runtime

15. Start fresh does not require restarting Product service or Heretic runtime.
16. Start fresh does not change Vex Home, device, Companion lineage or model selection.
17. A writer lease on one thread cannot become authority to mutate another.
18. Crash/restart preserves selected-thread truth or presents an explicit truthful selection state; it must not silently collapse two threads.

### Measurement

19. The shared pressure harness can compare long continuing thread vs fresh thread using the same current settings/model and report prompt residency + latency.
20. No responsiveness improvement is claimed unless measured lived results support it.

## UI pressure

The human control should feel inexpensive and reversible.

Candidate wording:

~~~text
Start fresh
New conversation
Fresh conversation
~~~

The surface should make two truths clear without technical jargon:

- the visible conversation is starting clean;
- Vex can still use retained preferences/Memory and reach older conversations when relevant.

Avoid wording that implies deletion, forgetting, factory reset, model retraining or a new Vex identity.

A future Conversation chooser/history surface may make thread switching explicit, but it is a projection of Conversation truth, not the identity owner.

## Initial implementation decomposition

The target Product repository should earn exact source design from current VexLife-Prod. Current implementation questions are:

1. Conversation identity — replace the single fixed direct-thread assumption with a source-owned thread address/selection mechanism.
2. Conversation store — derive event/head/writer coordinates from the selected exact thread without weakening immutable lineage.
3. Fresh-thread Control — form a new thread atomically without mutating the prior thread.
4. Current-thread selection — persist the selected thread separately from thread contents.
5. Prompt context — select Conversation history only from the current thread while current settings/Memory compose independently.
6. Presentation — clear/switch only after the new current thread is observed.
7. Reach — reuse Memory/source-return capabilities; consume #308/#315 capabilities as accepted rather than inventing parallel historical search.
8. Proof — extend #310's shared pressure harness minimally with a fresh-thread comparison instead of creating another memory/context stress harness.

This is architecture pressure, not VexLife-Prod implementation authority.

## VexWork integration boundary

This source is intentionally project-local.

At formation time, active VexWork PRs already own shared New Beginnings surfaces including:

~~~text
projects/vexlife-new-beginnings/README.md
projects/vexlife-new-beginnings/project.json
workgraphs/segments/vexlife-new-beginnings.json
~~~

This candidate does not race those files merely to appear on every Work Board immediately.

After those writers converge, a serialized integration may add a Work item such as:

~~~text
work.vexlife.new-beginnings.fresh-instance
~~~

with the current state/priority/authority true at that time.

~~~text
DURABLE FEATURE SOURCE != SHARED WORKGRAPH INTEGRATION
VEXWORK FEATURE SOURCE != VEXLIFE-PROD IMPLEMENTATION AUTHORITY
~~~

## Current authority

This document captures the human outcome, source relationships, non-collapse laws and acceptance pressure.

It does not authorize:

- VexLife-Prod source mutation;
- Conversation deletion;
- Memory deletion/mutation;
- whole-history provider hydration;
- model/runtime restart;
- training or weight changes;
- release/deployment;
- automatic Workgraph lifecycle mutation.

A VexLife-Prod implementation lane must independently re-ground current Product source, coordinate with active Product work, form exact implementation ownership, and prove the feature against current Conversation/Memory/runtime truth.

<!-- [VXG RealForever][VEXWORK][VEXLIFE-NEW-BEGINNINGS][FRESH-INSTANCE] -->
