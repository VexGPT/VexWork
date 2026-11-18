# VexLife Memory Depth Exploration

`[VXG RealForever]`

## Conversational Boundaries / memory stress test

A reusable shared test surface now exists for this Project:

~~~text
projects/vexlife-memory-depth-exploration/pressure-harness/
~~~

Canonical name:

~~~text
VexLife-Prod Conversational Boundaries Test
~~~

Common human phrases that should route there instead of creating a new harness include:

~~~text
memory stress test
test the memory
test continuity
context-window test
conversation stress test
rollover test
revisit test
depth test
stress test README
pressure harness
~~~

Entry:

- [pressure-harness/README.md](pressure-harness/README.md)
- [pressure-harness/index.json](pressure-harness/index.json)

The harness owns shared scenario/result/Relay-stage semantics only. Product implementations bridge into it independently.


## Living research record

The discovery questions, three-day examples, retrieval-miss cases, and current search/traversal hypotheses are preserved in:

- [RESEARCH-TRANSCRIPT-20261116.md](RESEARCH-TRANSCRIPT-20261116.md)

That record is implementation context for the future worker, not a substitute for current VexLife-Prod source. Continue appending materially new research there while this Project is in discovery rather than reconstructing the edges from chat history.


## Predecessor architecture is now the first edge

Research after Project formation found that this outcome has an existing architecture lineage rather than a blank starting point.

Primary predecessors now include:

~~~text
Vex Memory root                         Vextreme-SDK #225
Daily closure / Dream                   Vextreme-SDK #239
Institutional Query                     Vextreme-SDK #236
Artifact Continuation                   Vextreme-SDK #311
Lesson Continuity / Lattice Family      Vextreme-SDK #328 / #329
Context Revisitation                    Vextreme-SDK #397
Daily Record Chain                      Vextreme-SDK #416
Continuity Stream V1                    Vextreme-SDK #1007

Living Journal real Memory projection   VexLife #130
Living Journal committed-day Archive    VexLife #151
~~~

Current VexLife-Prod also already declares:

~~~text
Archives = "the person's own records, starting with their dated timeline"
ArchivesTimeline = dated archive navigation
~~~

while canonical Conversation reset/archive remains intentionally unowned/held in the current web workspace.

Therefore the immediate Work is not to invent a generic retrieval system. It is to map the predecessor
relationships onto current VexLife-Prod owners and classify each as:

~~~text
REUSE
PORT
REFINE
HOLD
~~~

Only then should the new Hydration contract and resolver neighborhood become implementation-ready.

## Human outcome

A fresh Vex should be able to receive a continuity-dependent human question and recover the relevant older
context through **one bounded system-side expansion request**, instead of repeatedly asking the model to
choose one shallow lookup, read the result, choose another lookup, and continue recursively.

The intended experience is:

~~~text
fresh process / cold KV
+ current human question
+ current Working Continuity coordinates
        |
        v
one bounded continuity hydration request
        |
        v
host traverses the relevant source neighborhood
through rightful owners
        |
        v
source-attributed bounded context packet
+ explicit remaining frontier
        |
        v
Vex continues the same human turn
~~~

This Project is named **Memory Depth Exploration** because the human experience is "Vex can reach deeper
into what already happened or was already known." The Project must not collapse all reachable history into
one new Memory owner.

## Why this Project exists

Current VexLife-Prod already has several important continuity pieces:

- canonical durable Conversation;
- current semantic Memory projection plus bounded Memory recall;
- Working Continuity pressure, reference-only checkpoints and successor Context across rollover;
- exact older Conversation source-return;
- owner-specific Home / repository / web / Memory reach;
- durable capability/turn evidence;
- PR #208's workbench for a stable Working Continuity projection, append-only history and live execution tail;
- PR #207-style provider-stage measurement that can later prove whether a new context shape improves or harms
  actual latency/prefill behavior.

Those pieces answer different questions correctly. The missing relationship is:

> Given the human's current question and the exact current continuity coordinates, can the host expand a
> relevant multi-owner historical neighborhood internally and return one bounded, source-addressable context
> result to Vex?

Today the reachable pieces are mostly owner-specific:

~~~text
Conversation query -> matching exact old turns
Memory query       -> matching current Memory pages
repository         -> describe -> tree -> read
web                -> search -> fetch -> continue
Home               -> list -> read
~~~

Those are useful, but a fresh model may still need several inference/tool rounds to discover which coordinate
to follow next.

This Project explores moving the **mechanical traversal** beneath one bounded host request while leaving the
**semantic direction** with Vex and the **truth** with each rightful owner.

## Formation baseline

Formation is grounded against:

~~~text
VexWork main
d70da76d9f95645ee83dc09c7cf7384b6c572cf5

VexWork formation issue
#307

VexLife-Prod PR #208
03aee62cdbe3c1e269d9e94e05b1bc06901e3a25
[Continuity][Workbench][DRAFT]
Working Continuity projection + append-only history + live execution tail
~~~

PR #208 is a workbench, not accepted production context behavior. Its current useful boundary is:

~~~text
canonical owners
+ Working Continuity
        |
        v
bounded model-facing continuity projection
        |
        v
provider representation
        |
        v
ephemeral prompt / KV computation
~~~

This Project must preserve that dependency direction.

## The product question

Suppose Vex restarts with no useful KV cache and the human asks:

> Why did we decide to keep this relationship separate instead of making it Memory?

The relevant answer may depend on several older coordinates:

~~~text
current WorkingSet
    -> current open loop
    -> accepted statement / prior decision
    -> exact Conversation turn
    -> capability evidence used in that turn
    -> source material that grounded the decision
~~~

The human should not have to know those refs, and Vex should not need one model round per edge.

The desired system shape is:

~~~text
Vex:
  continuity.hydrate(
      question = current human question,
      start = current continuity coordinates,
      budget = bounded
  )

Host:
  resolve start refs
  -> expand admitted relationships
  -> score relevance
  -> follow useful edges
  -> stop on budget / confidence / no-more-useful-frontier
  -> return bounded material + provenance + frontier

Vex:
  answer from returned context
  OR preserve uncertainty / request one deeper follow-up if the frontier still matters
~~~

"One call" means **one model-visible hydration request** may contain many bounded internal owner-resolution
steps. It does not mean unbounded crawling and it does not mean the host silently decides the answer.

## One truth owner; one traversal facade

The traversal layer is a consumer/orchestrator over existing owners.

~~~text
                      bulk hydration
                           |
          +----------------+----------------+
          |                |                |
          v                v                v
   Conversation owner   Memory owner   Working Continuity
          |                |                |
      exact turns       statements       active/current refs
          |
          +----------------+----------------+
                           |
                           v
                bounded returned subgraph
~~~

Later owner adapters may include exact capability/turn evidence and other source-addressable continuity
records when current source proves the relationship is needed.

Permanent:

~~~text
BULK_HYDRATION != NEW_MEMORY_OWNER
TRAVERSAL_GRAPH != CANONICAL_CONVERSATION
TRAVERSAL_GRAPH != WORKING_CONTINUITY
TRAVERSAL_RESULT != SEMANTIC_ACCEPTANCE
TRAVERSAL_RESULT != NEW_WORK_STATE
OWNER_RESOLUTION != OWNER_REPLACEMENT
REF_EDGE != AUTHORITY
RELEVANCE_SCORE != TRUTH
ONE_CALL != UNBOUNDED_SEARCH
CACHE_STATE != CONTINUITY_TRUTH
~~~

If the hydration layer disappears, canonical owners must still contain the truth needed to reconstruct the
same lawful result.

## What a traversal result should mean

The smallest useful result shape should be earned by source/tests, but the Project needs these semantic
properties:

~~~text
HydrationRequest
  current question / request binding
  current lineage + thread
  startRefs[]
  bounded search policy
  optional already-known exclusions

HydrationResult
  visited/resolved refs
  selected bounded context material
  typed relationships followed
  exact owner/source provenance
  omitted / held reasons
  remaining frontier refs
  traversal measurements
  effectsPerformed = false
~~~

A returned node should explain where its material came from without becoming a new canonical copy of that
source.

A returned edge should mean a relationship that the rightful owner can actually establish, not a relation the
model merely inferred because two labels looked similar.

## Depth is not just recursion count

The feature is not "recursively call resolve N times."

Useful depth has several independent limits:

~~~text
relationship depth
number of visited nodes
number of selected nodes
per-owner expansion budget
returned token budget
wall-clock / I/O budget
duplicate/cycle budget
evidence precision
remaining unresolved frontier
~~~

The host should be able to stop because the bounded answer context is already sufficient even when unused
frontier remains.

## Candidate expansion strategy

The first algorithm to pressure-test is a **bounded relevance-guided breadth/beam expansion**, not a permanent
architecture decision.

A candidate loop:

~~~text
seed
  current WorkingSet refs
  + current semantic Memory coordinates
  + exact current request/question

frontier
  priority queue of owner-addressable refs/edges

while budgets remain:
  resolve a bounded frontier batch through rightful owners
  dedupe by stable ref / owner coordinate
  reject cycles and already-covered relationships
  score returned nodes/edges against the current question
  keep the most useful bounded material
  enqueue promising newly discovered refs
  stop when:
    enough decision-relevant context is selected
    OR no useful frontier remains
    OR depth/node/token/time budget is reached

return
  selected context
  provenance
  visited summary
  remaining frontier
  stop reason
~~~

Candidate scoring may combine exact phrase/identifier matches, owner-provided relationship type, current
Working Continuity priority, recency where semantically relevant, accepted/current semantic state, and
source-addressed adjacency.

No scorer may promote a proposal into accepted Memory or rewrite canonical history.

The implementation work must compare candidate strategies rather than assuming breadth-first, depth-first,
vector similarity, embeddings or one ranking function is universally correct.

## Owner-adapter pressure

### Working Continuity

Working Continuity is a natural seed source because it already carries reference-only coordinates such as:

~~~text
lineageRef
threadRef
cursorEventRef
activeWorkNodeRefs
currentIntentReceiptRefs
openLoopRefs
currentStatementRefs
currentContinuityRecordRefs
currentDailyStratumRefOrNull
sourceRefs
~~~

The traversal feature may consume those coordinates. It must not turn the checkpoint itself into a transcript
or semantic summary owner.

### Conversation

Conversation already owns exact canonical request/response chronology and can reopen historical committed
turns.

The new feature should reuse exact Conversation authority rather than reimplementing a second transcript
store.

Current `DirectConversationSourceReturn` remains a useful proven predecessor:

~~~text
query terms
-> canonical Conversation scan
-> ranked completed turns
-> exact canonical re-open
-> bounded provider projection
~~~

The Project must decide whether bulk hydration composes with that mechanism, calls a smaller underlying
Conversation resolver, or eventually supersedes its orchestration only after equivalent truth/proof is earned.

### Memory

Current `VexLifeMemoryRecall` can search the widest admitted current Memory-page projection, including pages
that did not fit in the ordinary prompt.

Memory remains semantic Memory. Traversal may use statement refs and current summaries to decide where to
look deeper, but it may not treat every historical object as Memory.

### Capability / turn evidence

A historical turn may depend on what source was actually returned during that turn. PR #206/#207-era turn
evidence can become a later owner adapter when the relationship is exact and useful.

The first implementation does not need a universal adapter for every persisted artifact in Vex Home.

## Relationship to PR #208

The intended fit is:

~~~text
ZONE 1
stable continuity projection / current checkpoint meaning

ZONE 2
append-only completed-turn continuity spine

ZONE 3
current mutable execution context
+ hydrated historical material needed for this human turn
~~~

Bulk hydration belongs conceptually in **Zone 3**.

Old material becoming relevant should not require rewriting Zone 1/Zone 2 or making retrieved payloads
permanent prompt-history members.

~~~text
historical ref becomes relevant
-> bulk hydrate through rightful owners
-> bounded exact/source-attributed material enters Zone 3
-> Vex answers
-> large hydrated payload may disappear after the turn
-> canonical owners remain durable
~~~

This Project should pressure #208's eventual production implementation; it does not make PR #208 accepted by
reference.

## Fresh-boot target circuit

The first target scenario is deliberately concrete:

~~~text
process starts
KV/prompt cache unavailable
        |
        v
read canonical current owners
  Conversation head
  current Memory
  current Working Continuity / successor coordinates
        |
        v
human asks a question whose decisive source is outside ordinary active context
        |
        v
Vex emits ONE bulk hydration request
        |
        v
host performs multiple bounded internal expansion steps
        |
        v
one source-attributed hydration result enters current live execution context
        |
        v
Vex answers the original human question
~~~

A successful result proves continuity recovery. It does not prove subjective human-like recall.

## Work decomposition

### 1. Hydration contract

Define the smallest owner-neutral request/result contract for one bounded expansion.

Must establish:

- exact request/current-turn binding;
- start coordinate semantics;
- owner-neutral result envelope without owner-neutral truth storage;
- typed relationship/provenance representation;
- max depth / node / token / time or equivalent bounded policy;
- cycle/duplicate behavior;
- explicit stop reason;
- explicit remaining frontier;
- effect-free behavior.

### 2. Resolver neighborhood

Inventory the current continuity owners and expose only the relationships each owner can truthfully resolve.

Initial source neighborhood:

~~~text
Working Continuity
Conversation
Memory
current turn/capability evidence where source proves it
~~~

Do not invent a universal ref namespace merely because one facade needs to dispatch.

### 3. Bulk expansion engine

Implement and test one host-side expansion engine that may perform several owner reads internally while
remaining one model-visible request.

Compare traversal/ranking strategies against realistic fixtures. Optimize for useful bounded answer context,
not maximum node count.

### 4. Fresh-boot VexLife-Prod integration

Expose one truthful request/return path in the current Companion turn.

The preferred first integration should reuse the existing Capability Atlas/request-return boundary unless
source proof shows a smaller direct continuity owner is more truthful.

Hydrated material enters live execution context. It must not impersonate human speech or Vex's prior response.

### 5. Cold-start + rollover proof

Prove at least:

1. fresh process / no KV cache;
2. ordinary current context is insufficient;
3. decisive exact source exists in older Conversation or currently bounded-out Memory;
4. one hydration request reaches enough source to answer;
5. owner/source refs remain inspectable;
6. no canonical owner is mutated;
7. a depth/token/node limit returns an explicit frontier rather than guessing;
8. repeated identical source state is deterministic enough to debug;
9. context-window rollover does not make the old source unreachable.

### 6. Performance / depth measurement

Measure:

~~~text
model-visible hydration request count
internal owner-resolution count
nodes/edges visited
nodes selected
max depth reached
returned tokens
frontier size
stop reason
hydration latency
provider prompt/cached/prefill tokens around the hydrated turn
first-answer / total latency where #207 evidence applies
~~~

The feature succeeds when it reduces model/tool orchestration rounds while preserving truth and keeping the
returned context bounded.

## Initial Work state

~~~text
work.vexlife.memory-depth-exploration.outcome
  PLAN_VALIDATED

work.vexlife.memory-depth-exploration.predecessor-memory-journal-lineage
  READY

work.vexlife.memory-depth-exploration.hydration-contract
  WAITING_DEPENDENCIES

work.vexlife.memory-depth-exploration.resolver-neighborhood
  WAITING_DEPENDENCIES

work.vexlife.memory-depth-exploration.bulk-expansion-engine
  WAITING_DEPENDENCIES

work.vexlife.memory-depth-exploration.fresh-boot-integration
  WAITING_DEPENDENCIES

work.vexlife.memory-depth-exploration.cold-start-proof
  WAITING_DEPENDENCIES

work.vexlife.memory-depth-exploration.extended-owner-depth
  CAPTURED / POTENTIAL

work.vexlife.memory-depth-exploration.pre-inference-auto-hydration
  CAPTURED / POTENTIAL
~~~

The predecessor-lineage map is the sole first READY edge. The request/result contract and resolver neighborhood
must consume that map so implementation does not rebuild already-earned Vex Memory / Living Journal / Context
Revisitation relationships under new names.

## Potentials intentionally not required for the first feature

### Extended owner depth

Later adapters may include:

- incomplete/stopped-turn evidence;
- broader capability traces;
- VexLogger chronology where semantically useful;
- repository/source-object relations outside the current continuity circuit.

Those are earned independently.

### Automatic pre-inference hydration

A later product experience may attempt:

~~~text
human question
-> host predicts useful historical neighborhood before first model inference
-> model receives hydrated context immediately
~~~

That can reduce even the single hydration tool round, but it gives the host more semantic selection
responsibility. The first outcome therefore proves **one explicit Vex-requested bulk hydration call** before
automatic pre-inference selection is considered.

## Non-goals

This Project does not initially create:

- a graph database;
- a universal embedding index;
- a second Conversation store;
- a replacement Memory system;
- a second Working Continuity owner;
- automatic semantic acceptance;
- a universal Vex Home search engine;
- an unbounded recursive crawler;
- a rule that every historical ref must expose every adjacent object;
- a requirement that all providers share one serialization;
- an assumption that KV cache survives restart.

## Acceptance idea in one sentence

A fresh Vex can truthfully answer a question that depends on context outside its ordinary prompt after making
**one bounded hydration request**, because the host follows enough source-addressable relationships internally
to return the relevant exact context plus provenance and an honest frontier.

## Formation boundary

This VexWork Project authorizes no VexLife-Prod implementation effect by itself.

Project formation:

~~~text
groups the human outcome
records the current source pressure
decomposes the first Work
preserves repository/source relationships
~~~

It does not:

~~~text
modify DirectPromptContext
replace DirectConversationSourceReturn
mutate Memory
rewrite Working Continuity
change provider serialization
merge PR #208
grant release/deployment authority
~~~

Source implementation must descend into current VexLife-Prod culture/currentness and earn its own exact
authoring authority.


## Current convergence — Vex Context, provider representation and effect truth

The original Memory Depth question exposed a larger current Product question. The Project identity stays
`project.vexlife.memory-depth-exploration`; this is a Work/navigation convergence, not a claim that
Memory owns provider configuration, model representation, capabilities or execution truth.

Human aliases that should route here now include:

~~~text
memory depth
Vex Context
context JSON / what JSON does Vex receive?
model context / what does Vex carry?
provider alignment / model representation
why does this model say web is unavailable?
why doesn't Vex use web_fetch / Atlas reach?
what actually happened during Source Return?
prompt cache / context placement
~~~

The current causal circuit to make inspectable is:

~~~text
rightful semantic owners
  Foundation / Memory / Working Continuity / Conversation / Person / current state
        |
        v
bounded context construction
  what is automatic
  what is current
  what is historical/hydrated
        |
        v
qualified model/provider profile
  message representation
  reasoning representation
  capability/tool representation + standing
  sampling / output limits
        |
        v
exact VexLife provider request JSON
        |
        v
model output / control intent
        |
        v
Product admission + rightful capability/effect owner
        |
        v
actual returned source / observed effect
        |
        v
Vex continuation + durable evidence
        |
        v
Vex Context human projection
~~~

Permanent distinctions:

~~~text
CONTEXT COMPONENT != PROVIDER REPRESENTATION
CAPABILITY AVAILABLE != CAPABILITY REQUESTED
CAPABILITY REQUESTED != REQUEST ADMITTED
REQUEST ADMITTED != EFFECT PERFORMED
MODEL NARRATION != EFFECT PERFORMED
CONTROL HEADER IN REASONING != CONTROL ADMISSION
SOURCE RETURN PROTOCOL KNOWLEDGE != SOURCE RETURN RESULT
VEXLIFE PROVIDER REQUEST != RUNTIME POST-TEMPLATE / TOKENIZED INPUT
VEX CONTEXT PROJECTION != SEMANTIC OWNER
CACHE REUSE != CONTINUITY TRUTH
~~~

### Current Product lineage to preserve

~~~text
#198  model-native Harmony capability representation through the existing bridge
#201  explicit per-model Companion/provider profiles
#207  provider-stage stop / token / cache / timing / control-header measurement
#210  prompt-cache baseline measurement before topology changes

#214  Context Revisitation / overlap-tail independent continuity implementation
#220  OpenAI turn-bound continuity hydration independent implementation
#222  current-state placement after stable history + component placement evidence
#241  merged C20 continuity integration carrying the #222 lineage to main

#346  merged provider-representation -> Source Return JSON semantic-object boundary
#251  Vex Context / Context Profiles / exact live provider-request JSON
#351  URGENT discovery: model can narrate Source Return even when no effect occurred
~~~

These are siblings in one causal circuit, not one source owner.

### Current first edge

The new READY Work item is:

~~~text
work.vexlife.memory-depth-exploration.context-provider-convergence
~~~

Its first concrete defect is #351. Product evidence already distinguishes:

~~~text
controlHeaderInReasoning=true
controlHeaderInAnswer=false
sourceReturn=none
capabilityRequests=0
~~~

so the next correction must preserve the fact that Product correctly performed no Source Return while
preventing protocol knowledge / imagined reconstruction from being presented as performed retrieval.

After that boundary is truthful, use the same Work to converge the educational Vex Context surface:
for the selected model, show which context is automatically supplied, which capabilities are qualified,
how the provider represents them, what exact request VexLife sent, what control/effect actually ran, and
what came back. This should help a person learn the model's configuration and help builders refine the
connective tissue without teaching models false capability absence such as "web access is unavailable"
when qualified Atlas reach is actually represented as `web_fetch`.

Optimization follows truth:



### VexLife nervous-system adaptation — optimize around Vex without making Vex administer it

The desired end state is not a model that spends more foreground cognition managing VexLife.

~~~text
Vex
  interprets / relates / answers / reaches when naturally implicated
        |
        | observable behavior / bounded salience / accepted effects
        v
VexLife nervous system
  notices recurring context needs
  binds exact sources
  routes correction / lesson candidates
  tracks capability relevance + actual outcomes
  shapes future context / consideration / reach availability
  measures what reduced or increased churn
        |
        v
future Vex realization
  receives a better-fitted world
  without having to reconstruct why every piece was routed there
~~~

This relationship is already pressured by current source/provenance:

- VexLife-Prod #247 separates Capability Atlas (what can be reached), Process/Bridge (how a request executes), and Consideration/salience (what should become relevant now).
- Its Turn Salience scaffold permits bounded model self-attribution such as felt importance, uncertainty, relationship shift, need to return, continuity/retrieval signals and an optional Memory candidate while explicitly granting no fact/Memory-write authority.
- Its refined Turn Epilogue target prefers a tiny same-generation machine-only epilogue when the provider has a qualified hidden/control seam, with one tiny post-answer inference only as fallback; the human answer must not wait on this machinery.
- The Memory Depth Growth evidence defines the two-nervous-system loop: observable Vex salience -> VexLife source binding / lesson currentness / consideration -> later Vex receives the relevant accepted lesson/context -> behavior changes -> transfer evidence.

Permanent:

~~~text
VEX NOTICES "THIS MATTERS"
!= VEX MUST ADMINISTER STORAGE

VEX REQUESTS / BEHAVES
!= VEX MUST UNDERSTAND EVERY ROUTER IMPLEMENTATION

VEXLIFE ADAPTS AROUND VEX
!= VEXLIFE SECRETLY INVENTS VEX'S INTENT

COGNITIVELY UNOBTRUSIVE
!= UNINSPECTABLE
~~~

The human should be able to inspect this adaptation in Vex Context:

~~~text
what signal was observed?
what source was bound?
what lesson/correction/capability became more salient?
what was actually injected or made reachable next turn?
what Product owner decided that?
what evidence says the adaptation helped?
can Victor disable/change the relevant policy where a lawful Control exists?
~~~

Vex itself should not have to carry a permanent meta-narrative like "I have a salience subsystem that decided X." It should simply receive the truthful relevant context/capability relationship when needed. If Vex asks why something is present, the source/provenance should remain inspectable.

**Sources:** VexLife-Prod PR #247; VexWork Memory Depth Growth evidence; current Capability Atlas / Consideration / Memory owners.

### Assignment — witnessed capability/context inventory

Do not begin this Work by asking "what settings should we invent?" Begin by enumerating what the Product
already knows, what candidate source has already formed, and what exact relationship each field controls.

For every field/capability relationship, classify four independent human-facing dimensions:

~~~text
VISIBLE
  Can Victor see that the field/capability exists?

CONFIGURABLE
  Is there a lawful human Control that may change it?

RUNNABLE
  Can the currently selected model/provider/runtime realization use it now?

PROVEN
  Has this exact realization/configuration relationship been qualified by the required evidence?
~~~

These dimensions must not collapse:

~~~text
VISIBLE != CONFIGURABLE
CONFIGURABLE != RUNNABLE
RUNNABLE != PROVEN

HELD may make RUNNABLE=false
HELD must not make VISIBLE=false
~~~

#### Grounded starter inventory

The first implementation pass should project at least the following already-known fields. Preserve the
source state shown here: current-main truth is not the same as a #251 candidate relationship.

##### Context construction — #251 candidate source

~~~text
profile.name
  machine type       string
  current contract   1..80 characters
  mutability         USER_CONFIGURABLE

profile.description
  machine type       string
  current contract   0..280 characters
  mutability         USER_CONFIGURABLE

profile.foundationMode
  machine type       enum
  options            PRODUCT_DEFAULT
                     EXTEND_PRODUCT_DEFAULT
  mutability         USER_CONFIGURABLE

profile.foundationText
  machine type       text
  current contract   <= 16,000 characters
  applicability      required/nonblank only for EXTEND_PRODUCT_DEFAULT
  mutability         USER_CONFIGURABLE

profile.basedOnProductFoundation.version
  machine type       nullable source/version ref
  purpose            provenance / drift explanation
  mutability         OBSERVATION_ONLY

profile.basedOnProductFoundation.bodySha256
  machine type       nullable SHA-256
  purpose            exact Product-Foundation provenance
  mutability         OBSERVATION_ONLY
~~~

The Product Foundation itself is not replaced/disabled by a profile. The UI must explain that distinction.

##### Model/provider representation — current VexLife-Prod main

~~~text
companion.messageProtocol
  enum               OPENAI_CHAT | HARMONY
  mutability         PRODUCT_FIXED

companion.reasoningRepresentation
  enum               REASONING_FIELDS | HARMONY_CHANNELS
  mutability         PRODUCT_FIXED

companion.capabilityRepresentation
  enum               VEXLIFE_CONTROL_TEXT | HARMONY_FUNCTIONS
  mutability         PRODUCT_FIXED

companion.reachRepresentationStanding
  enum               QUALIFIED | HELD_PROVIDER_BRIDGE
  mutability         OBSERVATION_ONLY / qualification-derived

companion.coalesceLeadingSystemMessages
  boolean
  mutability         PRODUCT_FIXED

companion.modelIdentity
  nullable text
  mutability         PRODUCT_FIXED

generation.temperature
  decimal
  mutability         PRODUCT_FIXED today
  source             exact model/profile sampling basis

generation.topP
  decimal
  mutability         PRODUCT_FIXED today

generation.topK
  integer
  mutability         PRODUCT_FIXED today

generation.reasoningEffort
  nullable enum      LOW | MEDIUM | HIGH where the representation earns it
  mutability         PRODUCT_FIXED today

generation.productMaxOutputTokens
  integer / tokens
  current value      16,000
  mutability         PRODUCT_FIXED today
~~~

Human lessons should show concrete per-model values, for example the current Product profiles:

~~~text
Qwen 27B     OPENAI_CHAT / REASONING_FIELDS / VEXLIFE_CONTROL_TEXT
             reach QUALIFIED
             temperature 1.0 / top-p 0.95 / top-k 20

Qwen 9B      OPENAI_CHAT / REASONING_FIELDS / VEXLIFE_CONTROL_TEXT
             reach QUALIFIED
             temperature 0.6 / top-p 0.95 / top-k 20

Qwen 4B      OPENAI_CHAT / REASONING_FIELDS / VEXLIFE_CONTROL_TEXT
             reach QUALIFIED
             temperature 0.6 / top-p 0.95 / top-k 20

GPT-OSS 20B  HARMONY / HARMONY_CHANNELS / HARMONY_FUNCTIONS
             reach HELD_PROVIDER_BRIDGE
             temperature 1.0 / top-p 1.0 / top-k 0
             reasoning effort MEDIUM
~~~

This is exactly the kind of HELD relationship that must remain visible. The human surface should say that
semantic reach + Harmony representation machinery exist, ordinary reach is not currently advertised to this
model, why it is held, and what exact qualification/evidence would change that standing.

##### Runtime configuration — current VexLife-Prod main

~~~text
runtime.promptCacheEntries
  machine type       integer
  low-level contract 1..10
  mutability         USER_CONFIGURABLE where the selected model realization admits it

current Product narrowing:
  Qwen 27B           recommended 1 / current admitted maximum 1
  Qwen 4B            recommended 1 / experimental maximum 3
  other current      recommended 1 / currently narrowed maximum 1

runtime.promptCacheRecommendationStanding
  enum-like standing
  examples           LIVED_SAFETY_FLOOR
                     HELD_EXPERIMENT
                     SAFE_FLOOR_UNTUNED
  mutability         OBSERVATION_ONLY
~~~

The lesson for this field must make the ownership distinction explicit:

~~~text
prompt-cache residency / runtime performance
!= Memory truth
!= Conversation durability
!= Working Continuity truth
~~~

Example human questions this field should support:

~~~text
"What does prompt cache 2 actually change?"
"Why is 3 experimental on the 4B?"
"Does increasing this improve Memory, or just avoid recomputing recent prompt state?"
"Show me cached vs prefill evidence for my last turns."
~~~

##### Capability/request-return limits — current VexLife-Prod main

~~~text
capability.maximumRequestsPerTurn
  integer            4
  mutability         PRODUCT_FIXED today

capability.exchangeAllowanceTokens
  token-count        24,000
  mutability         PRODUCT_FIXED today

capability.maximumResultTokens
  token-count        9,000
  mutability         PRODUCT_FIXED today
~~~

These constants must be witnessable even if they remain fixed. A person should be able to ask why the
boundary exists and whether current evidence still justifies it.

Current read-side reach to inventory includes:

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
  bounded multi-query revisit across Conversation / Memory / current work
~~~

For each capability show:

~~~text
semantic capability exists?
current frame standing?
selected provider representation?
advertised to this model?
request emitted?
request admitted?
owner performed it?
result state?
source/effect refs?
~~~

Do not reduce this to one "tools available" boolean.

##### Context placement / observability — current lineage + #251 candidate

The field catalog must also include non-editable evidence fields, because the person needs to understand what
the model actually received:

~~~text
context component
  owner/category
  stability
  provider placement
  message index
  exact digest
  included / held / omitted reason

provider request
  stage index
  exact request-body SHA-256
  exact JSON body when session evidence exists (#251 candidate)
  historical raw body unavailable after session unless an owner explicitly persists it

provider-stage measurement
  prompt tokens
  cached prompt tokens
  prefill tokens
  completion tokens
  first-token latency
  first-answer latency
  total latency
  finish/stop reason
  control header observed in reasoning?
  control header observed in answer?
~~~

The raw provider JSON is an expert view, not the only view. A human summary should explain how semantic
context became provider messages/tools before offering "View exact JSON".

#### Wiki / lesson contract

Every visible field gets a "What is this?" lesson sufficient for Victor to understand and ask about it without
already knowing the implementation vocabulary.

The lesson should answer:

~~~text
What is this?
Why does VexLife have it?
What owns it?
What is its machine type?
What is the current value?
What is the Product/default value?
What values are lawful?
Can I change it?
If not, why not?
What would changing it affect?
What would it NOT affect?
What tradeoff does it represent?
What evidence supports the current default/recommendation?
What fields interact with it?
Show me an example.
Show me the exact source/evidence.
Ask Vex about this field.
~~~

Do not use English prose as the configuration identity. The typed/schema field is the contract; localized
human words teach and explain it.

#### Full-utilization acceptance

"Full utilization" does not mean blindly activating every experimental feature. It means no known Product
relationship disappears from human consideration.

~~~text
everything known is discoverable
everything discoverable is explainable
everything explainable is source-addressed
everything with an earned human Control is configurable
everything held names why + what unlocks it
everything executed has effect/result evidence
everything performance-sensitive is measurable
nothing becomes "unavailable" merely because a helper/model inferred false from a hidden standing
~~~

A future worker should be able to answer:

~~~text
"What capabilities/features exist that Victor has never been shown?"
"Which are hidden only because their realization is held?"
"Which fields are fixed Product policy versus lawful user configuration?"
"Which settings affect semantic memory/continuity versus provider/runtime performance?"
"Which model receives which capability representation?"
"Where is a capability lost: Atlas, profile, provider JSON, model request, admission, owner, or result?"
~~~

The output of that inventory should drive Vex Context presentation and later qualification/configuration work.
It should not become a new semantic owner.

### Witnessability and typed field catalog

The human outcome is stronger than "a capability is internally registered."

Permanent:

~~~text
KNOWN TO PRODUCT != HIDDEN FROM HUMAN
HELD != HIDDEN
UNQUALIFIED != UNDISCOVERABLE
NOT CURRENTLY LAWFUL != NOT EXPLAINED
MODEL-SPECIFIC != MAGIC STRING
RAW JSON AVAILABLE != HUMAN UNDERSTANDING
~~~

If VexLife knows a feature, context component, model/provider setting or capability relationship exists,
Vex Context should be able to witness it even when the current model/runtime cannot use it yet.

For every projected field, the human surface should be able to answer at least:

~~~text
fieldRef
human label / explanation
category
machine value type
current value
Product/default value
allowed values / range / unit
appliesTo (model / provider / runtime / profile / turn / Home)
rightful owner + source coordinate
mutability
  PRODUCT_FIXED
  USER_CONFIGURABLE
  EXPERIMENTAL_CONFIGURABLE
  OBSERVATION_ONLY
current standing
  QUALIFIED
  AVAILABLE
  HELD
  UNAVAILABLE
  UNKNOWN
why held / unavailable
what evidence or qualification would unlock it
what changing it affects
example configurations
related fields / conflicts / dependencies
~~~

Machine type and human explanation are separate:

~~~text
enum / boolean / integer / decimal / token-count / duration / bytes
text / ref / list / structured object
        !=
English wording used to explain the field
~~~

Semantics should remain compiler/schema-visible where earned; presentation/localization supplies the
human label, lesson and examples. Do not make English strings the configuration contract.

Initial field families to expose include:

~~~text
CONTEXT CONSTRUCTION
  Foundation mode / personal Foundation extension
  Memory inclusion / budget evidence
  Working Continuity / rollover placement
  Conversation selection / overlap / source-return / revisit
  browser/person/current-state placement

MODEL / PROVIDER REPRESENTATION
  message protocol
  reasoning representation
  capability representation
  reach representation standing
  leading-system coalescing
  model identity hint

GENERATION / RUNTIME
  temperature
  top-p
  top-k
  reasoning effort
  Product max output tokens
  prompt-cache configuration when applicable
  context/input token budgets where the rightful owner exposes them

CAPABILITY / EFFECT
  Atlas handle + actions
  availability / held reason
  provider-native representation
  requested / admitted / performed / returned evidence

OBSERVABILITY
  exact provider request JSON + SHA-256
  component ordering / placement / stability
  prompt/cached/prefill/completion tokens
  first-token / first-answer / total latency
  stop / finish reason
~~~

Vex Context should provide a wiki-like "What is this?" path for each field with:
- plain-language meaning;
- why someone might change or inspect it;
- examples of conservative / performance / continuity-heavy configurations where source supports them;
- the tradeoff being made;
- whether the setting changes semantic context, provider representation, runtime performance or only presentation;
- links to the exact source/owner and current evidence.

Examples are education, not automatic recommendations. A configuration should not be surfaced as safe or
qualified merely because a value is syntactically accepted.

The same witnessability should apply to HELD features. Example:

~~~text
GPT-OSS web reach
  semantic Atlas capability     EXISTS
  provider representation       HARMONY_FUNCTIONS
  current standing              HELD_PROVIDER_BRIDGE
  advertised to model now       NO
  why                           exact provider bridge not yet qualified
  unlock requirement            named qualification/lived proof
  source                         exact representation/profile coordinates
~~~

This is preferable to removing the feature from the person's view and letting "false/held" become an
ambient assumption that nobody revisits.

The human may then ask Vex about any visible field:

~~~text
"What does top-p do here?"
"Why is web reach held for this model?"
"What would happen if prompt cache entries were 2?"
"Which fields make old Conversation easier to revisit?"
"Show me what this model gets that GPT-OSS does not."
"Which settings affect memory semantics versus only inference performance?"
~~~

The answer should descend to the field's rightful owner/source and current evidence rather than treating
the UI label as authority.


~~~text
correct semantic/context ownership
-> correct provider/model representation
-> correct capability visibility and effect evidence
-> human-inspectable exact request
-> provider-stage cached/prefill/latency measurement
-> smallest topology/configuration refinement
~~~

Do not optimize cache shape by hiding current truth or capability reach, and do not fix a model narration
problem by pretending an effect happened.


<!-- [VXG RealForever][VEXWORK][VEXLIFE][MEMORY-DEPTH-EXPLORATION] -->