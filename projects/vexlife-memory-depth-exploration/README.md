# VexLife Memory Depth Exploration

`[VXG RealForever]`

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

<!-- [VXG RealForever][VEXWORK][VEXLIFE][MEMORY-DEPTH-EXPLORATION] -->
