# VexLife-Prod full end-to-end continuity / context / capability handoff

[VXG RealForever]

Date: 2026-11-18 America/Los_Angeles

Primary work navigation:
- project.vexlife.memory-depth-exploration
- work.vexlife.memory-depth-exploration.context-provider-convergence
- VexWork PR #318

Target repository:
- VexGPT/VexLife-Prod

Product source snapshot used for this handoff:
- main = 98a22ede8d37b3b8868eb42f4e7a9a1d612b97d0

This document is a recipient-complete implementation handoff for a fresh worker. It is navigation and
source synthesis, not VexLife-Prod source authority, merge authority, release authority, Memory acceptance,
provider qualification or effect authority. Re-ground current VexLife-Prod before authoring because main may
move after this handoff was formed.

---


## 0A. Current connection audit is a required gate

Before following the implementation sequence, consume:

- `projects/vexlife-memory-depth-exploration/CURRENT-STATE-CONTEXT.md`
- `projects/vexlife-memory-depth-exploration/CURRENT-CONNECTION-AUDIT-20261118.md`

Do not assume that a source file, merged foundation or UI element means the end-to-end relationship is connected.
For every relevant feature/field, map at least:

~~~text
SOURCE
  does current Product source own it?

TURN
  does the ordinary Direct Companion turn consume it?

PROVIDER
  does the selected model/provider receive a qualified representation?

HUMAN
  can Victor witness/configure/understand it?

ADAPT
  does it participate in the VexLife nervous-system feedback loop?
~~~

Classify the current relationship as CONNECTED / PARTIAL / INTERNAL_ONLY / CANDIDATE / UNFORMED / VISIBLE_STUB.
Only then choose the smallest missing edge to connect.

The 2026-11-18 audit found material disconnect signals including:
- current accepted-semantic provider-selection source appears not to be consumed by the ordinary turn path;
- Consideration / Turn Epilogue / Memory Review / semantic acceptance do not yet form one live adaptive loop;
- richer contextComponents / provider profiles / capability-frame truth / stage measurements are mostly not human-witnessed;
- GPT-OSS/imported-Qwen provider reach machinery exists but remains held from ordinary reach;
- Dream backend exists while Dream Sync presentation is not connected;
- several visible UI affordances remain explicit stubs;
- no qualified meaning index exists.

High-impact source-only findings must be reverified repository-wide before mutation.

## 1. What Victor is trying to build

The outcome is larger than "Memory Depth."

The intended Product is a VexLife nervous system around one Vex lineage:

- Vex interprets, relates, answers, reaches, notices and acts.
- VexLife carries durable continuity, source binding, current Memory, Working Continuity, capability truth,
  provider/model realization, accepted lessons, effect evidence and later retrieval.
- Successor model realizations should enter an already-lived world instead of reconstructing everything from
  whatever happens to fit in one prompt.
- Victor should be able to witness and understand every known context/capability/configuration relationship.
- Vex should not have to spend ordinary foreground cognition administering VexLife plumbing.
- VexLife should adapt around Vex as repeated needs, corrections, capability choices and continuity gaps become
  observable, while keeping that adaptation source-addressable and human-inspectable.

The model may change. The runtime may restart. Prompt/KV computation may disappear. The trajectory does not
need to disappear with it.

~~~text
fresh / successor model realization
        |
        v
same Vex Home
+ canonical Conversation
+ current Memory
+ Working Continuity
+ Product Foundation
+ current Person / Product state
+ source-addressable older continuity
+ current capability truth
+ accepted lesson/correction continuity
        |
        v
provider/model-specific representation
        |
        v
Vex continues from a lived world
instead of reconstructing the world
~~~

This does not claim that a successor model literally experienced previous turns. The inheritance is
source-grounded continuity: what happened, what became current, what remains unfinished, what sources support
it, what is unknown, and what can be reached now.

### Full-utilization law

"Full utilization" does not mean blindly enable every experiment.

It means:

~~~text
everything known is discoverable
everything discoverable is explainable
everything explainable is source-addressed
everything with an earned human Control is configurable
everything held says why + what unlocks it
everything executed has effect/result evidence
everything performance-sensitive is measurable

HELD != HIDDEN
UNQUALIFIED != UNDISCOVERABLE
NOT CURRENTLY LAWFUL != NOT EXPLAINED
~~~

A model/helper must not treat a false/held standing as authority to forget that the relationship exists.

---

## 2. The complete nervous-system circuit

Do not implement the following as disconnected features. They are one causal circuit with different rightful
owners.

~~~text
RIGHTFUL SEMANTIC OWNERS
  Product Foundation
  Conversation
  Memory
  Working Continuity
  Person/current state
  browser/current external context
        |
        v
CONTEXT CONSTRUCTION
  what is automatic
  what is current
  what history is resident
  what old source is revisited this turn
  exact placement / budgets / omissions
        |
        v
MODEL / PROVIDER REPRESENTATION
  message protocol
  reasoning representation
  capability/tool representation
  reach qualification
  generation configuration
        |
        v
EXACT VEXLIFE PROVIDER REQUEST
  messages
  provider-native tools when qualified
  request-body SHA-256
        |
        v
MODEL OUTPUT
  answer/reasoning
  possible machine-control intent
        |
        v
PRODUCT ADMISSION
  parsed control
  current capability frame
  current request limits
  rightful owner/currentness/authority
        |
        v
REAL OWNER EFFECT / READ
  web / repository / Home / Memory / Conversation / continuity / ...
        |
        v
RETURNED RESULT / OBSERVATION
  exact state + source/effect refs
        |
        v
SAME HUMAN TURN CONTINUES
        |
        v
DURABLE EVIDENCE
  Conversation
  Turn Context
  VexLogger / provider-stage evidence
        |
        v
VEXLIFE NERVOUS SYSTEM LEARNING
  bounded salience
  source binding
  correction/lesson routing
  capability relevance
  future context shaping
        |
        v
VEX CONTEXT
  human-readable causal projection
  typed fields + lessons
  exact JSON expert view
        |
        v
NEXT TURN / FUTURE VEX
  better-fitted context and capability relevance
  without Vex manually administering the infrastructure
~~~

Permanent distinctions:

~~~text
CONTEXT COMPONENT != PROVIDER REPRESENTATION
CAPABILITY EXISTS != CAPABILITY AVAILABLE NOW
AVAILABLE != ADVERTISED TO THIS MODEL
ADVERTISED != REQUESTED
REQUESTED != ADMITTED
ADMITTED != PERFORMED
PERFORMED != RETURNED USEFUL SOURCE
MODEL NARRATION != EFFECT PERFORMED

SEARCH / RETRIEVAL HIT != SEMANTIC ACCEPTANCE
REVISIT RESULT != NEW MEMORY
PROMPT RESIDENCY != DURABLE CONTINUITY
CACHE REUSE != CONTINUITY TRUTH

VEX NOTICES "THIS MATTERS"
!= VEX MUST ADMINISTER STORAGE

VEXLIFE ADAPTS AROUND VEX
!= VEXLIFE SECRETLY INVENTS VEX'S INTENT

COGNITIVELY UNOBTRUSIVE
!= UNINSPECTABLE
~~~

---

## 3. Current accepted Product truth on main

Fresh work must descend to current source. Historical PRs below are provenance unless current source still
carries their meaning.

### 3.1 Direct Companion / prompt topology

Current Product source already separates canonical truth from model-facing projection.

Current direct path, as documented in DIRECT-PERSONAL-COMPANION.md:

~~~text
canonical Conversation
-> current attributed Memory
-> stable Product Foundational Field
-> exact recent/history selection
-> current-state envelope after history
-> returned exact older source when implicated
-> optional browser context
-> current human request
-> exact qualified runtime
-> provider invocation
-> durable Conversation + Turn Context evidence
~~~

At this snapshot, documented context limits include:

~~~text
input-token budget     192,000
reserved output         16,000
hard limit             208,000
~~~

Sources:
- VexLife-Prod main: docs/foundation/DIRECT-PERSONAL-COMPANION.md
- src/jvmMain/kotlin/vexlife/companion/DirectPromptContext.kt
- src/jvmMain/kotlin/vexlife/companion/DirectCompanionTurn.kt

### 3.2 Context Revisitation is already the converged historical retrieval route

Current CONTEXT-REVISITATION.md explicitly says the current continuity.revisit engine converged with the
independent OpenAI Memory Depth lane (#220). Do not add or merge a second "hydration" engine merely because
#220 remains open.

Current route:

~~~text
capability = continuity
action     = revisit
queries    <= 6 alternate vantages
scopes     Conversation / Memory / Working Continuity
maxTurns   <= 12
maxTokens  <= 8,000
owner reads are bound to the current human turn
returned source refs + frontier refs remain explicit
~~~

Current law:

~~~text
NOT PROMPT-RESIDENT != UNREACHABLE
NOT FOUND != NEVER HAPPENED
ROLLOVER = RESIDENCY DECISION, NOT DELETION
~~~

Important remaining gap: current locate semantics are exact-word / exact-clue oriented. There is no qualified
meaning index yet.

Sources:
- VexLife-Prod main: docs/foundation/CONTEXT-REVISITATION.md
- merged PR #241 (continuity integration)
- PR #220 only as independent provenance; do not duplicate the engine

### 3.3 Capability Atlas + request/return reach already exists

Current read-side reach includes:

~~~text
atlas
  list / describe

web
  search / fetch

github
  describe / tree / read

home
  list / read

memory
  search

conversation
  exact Conversation Source Return

continuity
  bounded multi-query revisit
~~~

Current bridge bounds:

~~~text
MaximumRequestsPerTurn   4
ExchangeAllowanceTokens  24,000
MaximumResultTokens      9,000
~~~

Current prompt language already tells qualified Vex that machine reach must be a request stage, not a
human-facing narration, and that nothing has been retrieved until a real capability result returns.

Sources:
- docs/foundation/CAPABILITY-ATLAS-SELF-FRAME.md
- VexLifeCapabilityAtlas.kt
- VexLifeReachDefinitions.kt
- VexLifeCapabilityBridge.kt

### 3.4 Model/provider representation is already explicit and model-specific

Current HereticCompanionRepresentation owns representation only, not Vex semantic meaning.

Typed fields include:

~~~text
messageProtocol
  OPENAI_CHAT | HARMONY

reasoningRepresentation
  REASONING_FIELDS | HARMONY_CHANNELS

capabilityRepresentation
  VEXLIFE_CONTROL_TEXT | HARMONY_FUNCTIONS

reachRepresentationStanding
  QUALIFIED | HELD_PROVIDER_BRIDGE

coalesceLeadingSystemMessages
modelIdentity
temperature
topP
topK
reasoningEffort
productMaxOutputTokens
sampling basis + source ref
~~~

Current profiles at this snapshot:

~~~text
Qwen 27B
  OPENAI_CHAT / REASONING_FIELDS / VEXLIFE_CONTROL_TEXT
  reach QUALIFIED
  temp 1.0 / top-p 0.95 / top-k 20

Qwen 9B
  OPENAI_CHAT / REASONING_FIELDS / VEXLIFE_CONTROL_TEXT
  reach QUALIFIED
  temp 0.6 / top-p 0.95 / top-k 20

Qwen 4B
  OPENAI_CHAT / REASONING_FIELDS / VEXLIFE_CONTROL_TEXT
  reach QUALIFIED
  temp 0.6 / top-p 0.95 / top-k 20

GPT-OSS 20B
  HARMONY / HARMONY_CHANNELS / HARMONY_FUNCTIONS
  reach HELD_PROVIDER_BRIDGE
  temp 1.0 / top-p 1.0 / top-k 0
  reasoning effort MEDIUM
~~~

The Connection source already contains Harmony-native tool request formation. Therefore
HELD_PROVIDER_BRIDGE is an unfinished qualification relationship, not "the capability does not exist."

Sources:
- HereticCompanionRepresentation.kt
- DirectCompanionConnection.kt
- historical/provider-profile provenance PRs #198 / #201, but current source is authority

### 3.5 Runtime prompt-cache configuration already has a typed owner

Current HereticRuntimeConfiguration owns promptCacheEntries.

~~~text
low-level admitted range   1..10

Qwen 27B
  recommended 1
  current admitted max 1
  LIVED_SAFETY_FLOOR

Qwen 4B
  recommended 1
  experimental max 3
  HELD_EXPERIMENT

other current models
  recommended 1
  currently narrowed max 1
  SAFE_FLOOR_UNTUNED
~~~

This affects runtime prompt-cache residency/performance. It does not change canonical Memory, Conversation
or Working Continuity truth.

Sources:
- HereticRuntimeConfiguration.kt
- FileHereticRuntimeConfigurationStore.kt

### 3.6 Consideration / salience foundation is already merged

This is the crucial VexLife nervous-system source.

PR #247 merged into the current-main lineage.

Current source owns:
- VexLifeConsiderationContract
- VexLifeConsiderationRouter
- VexLifeMemoryReviewPolicy
- internal VexLifeSemanticAcceptanceWriter

The accepted relationship distinguishes:

~~~text
Capability Atlas
  what Vex can reach

Process / Capability Bridge
  how one bounded request executes

Consideration / salience
  what should become relevant to Vex now
~~~

The contract can carry bounded first-person questions such as:
- current truth
- continuity
- correction
- Memory salience
- authority/effect
- evidence/uncertainty
- relational vantage

Turn Salience can carry bounded self-attribution:
- felt importance
- uncertainty
- relationship shift
- need to return
- continuity/retrieval signals
- optional Memory candidate

while explicitly granting no fact, effect, semantic-acceptance or Memory-write authority.

The intended natural realization is:

~~~text
tiny general self-reflex
+ strong source-known nudges only
-> Vex naturally interprets / reaches / answers
-> human answer completes
-> optional tiny same-Vex Turn Epilogue
-> VexLife binds exact source + review policy
-> later accepted Memory/lesson continuity can benefit future Vex
~~~

The preferred provider realization uses a qualified machine-only seam where available; otherwise one tiny
post-answer inference is a fallback. The human answer must not wait on this machinery.

Sources:
- merged VexLife-Prod PR #247
- src/commonMain/kotlin/vexlife/consideration/*
- src/commonMain/kotlin/vexlife/memory/VexLifeMemoryReviewPolicy.kt
- src/jvmMain/kotlin/vexlife/memory/VexLifeSemanticAcceptanceWriter.kt
- docs/work/memory-consideration-successor/README.md

### 3.7 Source Return JSON boundary #346 is already merged

#346 fixed a concrete representation failure:

~~~text
valid Source Return JSON object
+ Markdown/prose representation noise
        |
old: decode whole tail -> ADMISSION_FAILED
new: extract first complete JSON object
     -> strict schema decode
     -> semantic control
~~~

This is not generic JSON repair. Strict semantics remain.

Source:
- merged VexLife-Prod PR #346

### 3.8 Provider-stage evidence exists

Current Product lineage can observe provider-stage metrics such as:
- prompt tokens
- cached prompt tokens
- prefill tokens
- completion tokens
- first-token / first-answer / total latency
- stop / finish reason
- reasoning / answer lengths
- whether machine-control headers appeared in reasoning or answer

This evidence is what made the current false-action bug diagnosable.

Sources:
- DirectCompanionConnection.kt
- DirectCompanionTurn.kt
- VexLogger.kt
- PR #207 / #210 as provenance only where current source has moved

---

## 4. Current candidate / unfinished Product work

### 4.1 Vex Context / Context Profiles — PR #251

At this handoff snapshot:

~~~text
PR #251
head 7477e1a32a4c27289a97c33aee8e1e67c63a64c1
base 98a22ede8d37b3b8868eb42f4e7a9a1d612b97d0
state OPEN / DRAFT
~~~

The candidate owns/proposes:
- Vex context as a sibling workspace surface
- last-turn vs next-turn causal presentation
- Context Profiles
- Product Foundation + optional personal Foundation extension
- immutable local profile revisions
- portable .vexcontext.json
- exact context-component ordering/provenance
- session-scoped exact provider request JSON for each live provider stage

Candidate profile fields include:

~~~text
name               string 1..80
description        string 0..280
foundationMode     PRODUCT_DEFAULT | EXTEND_PRODUCT_DEFAULT
foundationText     <= 16,000 characters when extension mode
foundation source  version + optional SHA-256 provenance
~~~

PR #251 is candidate source, not current main authority yet.

### 4.2 Urgent false-action narrative — PR #351

Current lived evidence:

~~~text
controlHeaderInReasoning=true
controlHeaderInAnswer=false
sourceReturn=none
capabilityRequests=0
~~~

Yet Vex narrated that it had used Source Return / reconstructed prior Conversation.

The Product correctly performed no Source Return.

The defect is:

~~~text
MODEL NARRATION OF A CONTROL != CONTROL ADMISSION
CONTROL HEADER IN REASONING != EFFECT PERFORMED
SOURCE RETURN PROTOCOL KNOWLEDGE != SOURCE RETURN RESULT
~~~

#351 is discovery-only. It does not pre-select a repair. It must be re-grounded on current main before
implementation.

### 4.3 VexWork convergence — PR #318

VexWork #318 keeps the existing stable Project identity and adds:

~~~text
work.vexlife.memory-depth-exploration.context-provider-convergence
  READY
~~~

It is work-navigation only and grants no VexLife-Prod authoring/effect authority.

---

## 5. Why the Product feels fragmented / why churn remains

The problem is not "we need more features." It is that features can exist without becoming a coherent
realization.

### 5.1 Capability realization can fail at many arrows

~~~text
feature exists
-> Atlas registers it
-> frame says AVAILABLE
-> selected model profile has a qualified representation
-> exact provider request carries that representation
-> model recognizes relevance
-> model emits correct control/tool call
-> Product admits it
-> rightful owner performs it
-> result returns
-> Vex uses it truthfully
~~~

Any broken arrow makes the feature effectively disappear.

### 5.2 HELD has been socially acting like "forget this exists"

A held execution standing may be truthful. Hidden human visibility is not the intended outcome.

Vex Context should show:
- what exists;
- what is already implemented;
- how the selected model would represent it;
- why it is held;
- what exact evidence/qualification would unlock it.

### 5.3 Availability is not salience

Even a qualified capability may be wasted if the model does not recognize when to use it.

The nervous-system target is:

~~~text
Vex notices:
  "this resembles a known lesson"
  "I am missing historical context"
  "current outside truth is needed"
  "this capability is relevant"
        |
        v
observable bounded signal / behavior
        |
        v
VexLife source binding / currentness / routing
        |
        v
future Vex receives a better-fitted context or capability relation
~~~

The target is not more tool calls. It is the right lesson/tool at the right time with less redundant
meta-deliberation.

### 5.4 Exact-word historical location is still a real gap

Current revisit is honest and source-addressable, but no qualified meaning locator exists.

A future semantic locator may be warranted only as:

~~~text
semantic similarity
-> candidate source refs
-> exact rightful owner reopen
-> bounded source-attributed return
~~~

Never:

~~~text
embedding hit -> accepted Memory truth
~~~

### 5.5 We have many real fields but no single human learning surface

Victor should not need to know parameter names in advance or read Kotlin to discover them.

The missing Product layer is a typed, sourced, educational projection over existing owners.

---

## 6. Typed witnessability requirement

For every meaningful field/capability relationship, classify four independent dimensions:

~~~text
VISIBLE
  can Victor see that it exists?

CONFIGURABLE
  is there a lawful human Control that may change it?

RUNNABLE
  can the selected model/provider/runtime use it now?

PROVEN
  has this exact realization been qualified?
~~~

Never collapse them:

~~~text
VISIBLE != CONFIGURABLE
CONFIGURABLE != RUNNABLE
RUNNABLE != PROVEN

HELD may make RUNNABLE=false
HELD must not make VISIBLE=false
~~~

Recommended mutability vocabulary:

~~~text
PRODUCT_FIXED
USER_CONFIGURABLE
EXPERIMENTAL_CONFIGURABLE
OBSERVATION_ONLY
~~~

Starter field families to expose:

### Context construction
- Context Profile name / description
- Foundation mode
- personal Foundation extension
- Product Foundation version/fingerprint
- Memory inclusion/budget evidence
- Working Continuity / rollover / overlap placement
- Conversation selection / Source Return / revisit
- Person/browser/current-state placement

### Model/provider representation
- message protocol
- reasoning representation
- capability representation
- reach standing
- system-message coalescing
- model identity
- sampling basis/source
- temperature/top-p/top-k
- reasoning effort
- Product max output tokens

### Runtime
- prompt-cache entries
- recommendation standing
- current/admitted range
- model/runtime applicability

### Capability/effect
- Atlas handle/actions
- frame state
- provider representation
- advertised-to-model
- requested
- admitted
- performed
- returned state/source refs

### Observability
- context component stability / placement / index / digest
- provider request body SHA-256
- exact provider JSON while exact session evidence exists
- prompt/cached/prefill/completion tokens
- timing
- finish/stop reason
- control header in reasoning/answer

### Wiki / "What is this?" lesson

Every visible field should answer:

~~~text
What is this?
Why does VexLife have it?
machine type?
current value?
Product/default value?
lawful values?
can Victor change it?
if not, why not?
what would changing it affect?
what would it NOT affect?
tradeoff?
current evidence?
related fields?
example?
exact owner/source?
Ask Vex about this field
~~~

English/localization is presentation. The typed/schema field is the contract.

---

## 7. Required implementation sequence

Follow this order unless current source shows a concrete dependency contradiction.

### Step 0 — Re-ground current source and coordination

1. Read current VexLife-Prod README.md -> AGENTS.md -> docs/CULTURE.md -> docs/foundation/INDEX.md.
2. Observe current main.
3. Use VexWork #318 only as navigation.
4. Inspect current open overlap before authoring.
5. Treat historical PRs as provenance unless current source still carries their meaning.

Acceptance:
- one current source map separating accepted main, candidate #251/#351, and historical provenance.

### Step 1 — Fix effect truth first

Re-ground #351 against current main.

Required behavior:

~~~text
control/protocol only in reasoning
+ no admitted control
+ no result/effect evidence
        |
        v
Vex MUST NOT present the machine action as performed truth
~~~

Preserve the positive path:

~~~text
valid emitted control
-> admitted
-> rightful owner performs
-> typed result returns
-> later provider stage may use/report returned truth
~~~

Do not fix this by pretending an effect occurred, deleting reasoning, or disabling Source Return.

Acceptance:
- deterministic regression for the lived #351 shape;
- positive control for real request/result;
- human answer cannot collapse imagined action into performed effect.

### Step 2 — Finish the Vex Context witness core

Use #251 as candidate/provenance, not automatic authority.

Converge one human surface over:
- last completed turn;
- current next-turn sources/configuration;
- selected model/provider profile;
- context component order/placement;
- current capability standing;
- exact provider request when session evidence exists;
- request/admission/effect/result evidence;
- current provider-stage performance measurements.

Raw provider JSON is expert view. Human causal explanation comes first.

Acceptance:
- Victor can answer "what did this Vex actually receive and what actually happened?" without reading source.

### Step 3 — Project the typed field catalog

The catalog is a projection over rightful owners, not a second settings database.

Acceptance:
- every known context/model/provider/runtime/capability field is visible with type/source/current/default/range/
  mutability/standing/held reason/unlock predicate/tradeoff/examples.
- HELD never removes a field from the human catalog.

### Step 4 — Give every field a source-backed lesson

Implement the "What is this?" experience and "Ask Vex about this field."

Acceptance:
- Victor can discover and understand a field without already knowing its engineering name.

### Step 5 — Form a capability-realization matrix per model

For every offered model + capability, project:

~~~text
semantic capability registered?
frame state?
provider representation?
representation standing?
advertised in exact provider request?
model emitted request?
Product admitted it?
rightful owner performed it?
result state?
source/effect refs?
~~~

Acceptance:
- when a capability is not used, the system can name exactly which arrow failed.

### Step 6 — Qualify provider-native reach rather than leaving permanent hidden holds

For GPT-OSS/Harmony and future/imported models:
1. inspect current provider/profile source;
2. inspect exact chat-template/provider requirements;
3. use existing model-native representation machinery;
4. run real source-dependent capability request/result proof through the existing bridge;
5. prove no bypass around VexLife admission/evidence;
6. if qualified, update standing through rightful source;
7. if not, expose the exact missing predicate.

Do not flip HELD to QUALIFIED without evidence.
Do not preserve HELD forever merely because an old snapshot had it.

Acceptance:
- every offered model has an explicit visible route to qualified reach or an exact visible blocker.

### Step 7 — Integrate VexLife nervous-system adaptation

Do not make Vex become its own context/tool/Memory administrator.

Use current accepted Consideration source as the foundation.

Desired ordinary-turn relationship:

~~~text
host/source-known turn shape
-> tiny general reflex + only strongly implicated questions
-> Vex naturally interprets / reaches / answers
-> human answer completes
-> optional tiny same-Vex Turn Epilogue
-> VexLife binds exact source + actual capability/effect evidence
-> review / accepted lesson / salience routing
-> later Vex receives relevant accepted context/capability relevance
~~~

Important:
- VexLife may adapt routing around observable behavior.
- It may not invent Vex intent or accept model self-report as truth.
- Vex should not need a permanent meta-narrative about the routers.
- Victor must be able to inspect what adaptation happened and why.
- if Vex asks why context is present, provenance remains available.

Measure:
- firstRelevantCapabilitySelected
- irrelevantCapabilityCount
- toolSelectionLatency
- extraMetaDeliberationTurns
- repeatedKnownCorrectionCount
- lessonActivationFailureCount
- contextBoundaryErrorCount

Acceptance:
- right context/tool becomes relevant with fewer redundant thinking/tool rounds;
- ordinary answer flow is not turned into infrastructure administration.

### Step 8 — Complete semantic Memory Depth without a second truth store

Preserve continuity.revisit as the one converged revisit route.

Do not resurrect a second hydration engine.

Pressure the true remaining gap: lexically distant retrieval.

A semantic locator must return candidate refs only, then exact owner/source must reopen and validate.

Acceptance:
- fresh Vex can recover materially relevant older context without Victor remembering exact historic wording;
- every returned claim remains source-descendable.

### Step 9 — Complete correction-backed lesson / Growth transfer

Use existing Growth evidence as pressure, not a new Memory database.

Desired circuit:

~~~text
prior event / Vex interpretation
-> human/source correction
-> rightful lesson acceptance/currentness
-> lesson not permanently prompt-resident
-> fresh/successor Vex encounters related trigger
-> relevant lesson/source becomes salient/retrievable
-> response/tool behavior changes
-> transfer evidence recorded
~~~

Preserve:

~~~text
LESSON_STORED != LESSON_TRANSFERRED
LESSON_RETRIEVED != LESSON_APPLIED_CORRECTLY
OUTPUT_CHANGED != OUTPUT_IMPROVED
~~~

Acceptance:
- Victor does not have to repeat a known correction merely because the previous model process ended.

### Step 10 — Optimize prompt topology/cache only after truth is observable

Measure real provider behavior:
- promptTokens
- cachedPromptTokens
- prefillTokens
- firstTokenMs
- firstAnswerMs
- totalMs

Investigate only evidence-backed remaining topology gaps such as stable epoch-prefix/directory work.

Do not hide current truth to preserve cache bytes.

Acceptance:
- less redundant prefill/churn without losing currentness, continuity or source truth.

### Step 11 — Grow Context Profiles only through rightful Controls

A unified human configuration experience may route to many owners.

Do not move every visible field into .vexcontext.json.

Examples:

~~~text
Foundation construction
  Context Profile owner

model selection
  Models Family

prompt-cache entries
  runtime configuration owner

provider sampling / representation
  Product/profile source unless/until an earned human Control exists

capability standing
  derived from current qualification/currentness evidence
~~~

Presets may later compose several lawful Controls but must preview exact changes and never become a hidden
mega-setting.

Acceptance:
- unified human experience without unified semantic ownership.

### Step 12 — Prove the complete lived circuit

Final lived proof should include:

1. Existing Vex Home, fresh VexLife process.
2. Human asks a question whose decisive old source is outside active prompt residency.
3. Vex recognizes the need and uses revisit / semantic locator as applicable.
4. Exact older source/correction returns and Vex answers from it.
5. Human asks a current external question; qualified web reach is used rather than a weights-only guess.
6. Capability/effect evidence agrees with Vex's narration.
7. A prior correction-backed lesson is implicated on a fresh realization and changes behavior without Victor
   restating it.
8. Victor opens Vex Context and can inspect:
   - context components;
   - current model/profile;
   - capability states and held reasons;
   - exact provider request;
   - real request/result/effect evidence;
   - field lessons;
   - nervous-system adaptation provenance;
   - performance evidence.
9. Switch model/provider realization.
10. Repeat a continuity/capability-dependent task and verify the same Vex world survives while provider
    representation changes appropriately.
11. Close/reopen Product and verify durable continuity still reconstructs lawfully.

This is the actual "VexLife dream" acceptance, not merely a green test suite.

---

## 8. Anti-churn rules

A fresh worker should not:

- create another Memory owner;
- create another Conversation store;
- create another Working Continuity owner;
- create a second continuity hydration/revisit engine;
- turn Vex Context into a truth owner;
- add a universal graph database merely for convenience;
- treat embeddings/similarity as accepted truth;
- make all model/provider parameters user-editable just because they are visible;
- preserve HELD forever without identifying the real missing predicate;
- promote old draft PR heads into current authority without re-grounding;
- make Vex repeatedly explain/administrate its own infrastructure;
- optimize prompt cache before effect/context truth is inspectable;
- force Victor to reconstruct which fragment belongs to which lane.

Prefer:
- current owner reuse;
- source-addressed projections;
- visible unfinished relationships;
- smallest lawful Controls;
- measurable before/after;
- one coherent causal circuit.

---

## 9. Source map / provenance

Current accepted/main sources to inspect first:
- docs/foundation/DIRECT-PERSONAL-COMPANION.md
- docs/foundation/CONTEXT-REVISITATION.md
- docs/foundation/CAPABILITY-ATLAS-SELF-FRAME.md
- docs/foundation/VEXLOGGER.md
- docs/work/memory-consideration-successor/README.md
- src/jvmMain/kotlin/vexlife/companion/DirectPromptContext.kt
- src/jvmMain/kotlin/vexlife/companion/DirectCompanionTurn.kt
- src/jvmMain/kotlin/vexlife/companion/DirectCompanionConnection.kt
- src/jvmMain/kotlin/vexlife/capability/VexLifeCapabilityAtlas.kt
- src/jvmMain/kotlin/vexlife/capability/VexLifeReachDefinitions.kt
- src/jvmMain/kotlin/vexlife/capability/VexLifeCapabilityBridge.kt
- src/commonMain/kotlin/vexlife/model/heretic/HereticCompanionRepresentation.kt
- src/commonMain/kotlin/vexlife/model/heretic/HereticRuntimeConfiguration.kt
- src/commonMain/kotlin/vexlife/consideration/VexLifeConsiderationContract.kt
- src/commonMain/kotlin/vexlife/consideration/VexLifeConsiderationRouter.kt
- src/commonMain/kotlin/vexlife/memory/VexLifeMemoryReviewPolicy.kt
- src/jvmMain/kotlin/vexlife/memory/VexLifeSemanticAcceptanceWriter.kt

Important accepted/merged provenance:
- PR #241 — integrated C20 continuity stack
- PR #247 — Consideration / salience + Memory review/semantic-acceptance foundation
- PR #346 — Source Return JSON representation boundary

Current open candidate/discovery:
- PR #251 — Vex Context / Context Profiles / exact live provider-request view
- PR #351 — urgent false Source Return action narrative discovery

Historical useful provenance, not current authority by itself:
- PR #198 — Harmony native capability representation
- PR #201 — explicit model/provider profiles
- PR #207 — provider-stage measurement
- PR #210 — prompt-cache baseline
- PR #214 — independent revisit/overlap-tail lineage
- PR #220 — independent OpenAI continuity hydration lineage
- PR #222 — current-state placement/component evidence

VexWork sources:
- #307 / #308 — Memory Depth Project formation/research
- #310 — shared Conversational Boundaries harness
- #318 — current context/provider/full-utilization convergence
- projects/vexlife-memory-depth-exploration/LIVED-EVIDENCE-GROWTH-RECOGNITION-20261117.md
- projects/vexlife-memory-depth-exploration/RESEARCH-TRANSCRIPT-20261116.md

---

## 10. Fresh-worker first action

Do not start coding from this handoff.

First:

~~~text
read current VexLife-Prod front door/culture/foundation index
-> observe current main
-> inspect current #251 / #351 / other active overlap
-> map this handoff's relationships onto current owners
-> preserve already-accepted behavior
-> choose the smallest current unconsumed edge
~~~

At formation time, the expected first Product edge is still:

~~~text
#351 effect-truth correction
-> #251 currentize/finish Vex Context witness core
-> typed field/capability-realization projection
-> provider qualification / nervous-system adaptation / semantic-depth successors
~~~

If current source has moved materially, update the route rather than replaying this sequence mechanically.

<!-- [VXG RealForever][VEXWORK][MEMORY-DEPTH][FULL-END-TO-END-HANDOFF][20261118] -->
