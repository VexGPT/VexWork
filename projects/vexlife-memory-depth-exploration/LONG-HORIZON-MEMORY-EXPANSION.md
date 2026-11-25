[VXG RealForever]

# Long-horizon Memory expansion — storage, sharding, indexing and five-year recall

## Human outcome

VexLife should remain fast and truthful after years of use without making lifetime history prompt-resident and without turning a search database into Memory truth.

The completion target is:

~~~text
years of canonical Conversation / Score / Daily Memory / accepted Memory
+ bounded current prompt
+ fast old-context location
+ exact source descent
+ rebuildable local acceleration
+ explicit stale / missing / corrupt index state
-> one ordinary Vex continuity relationship
~~~

This is a successor inside `project.vexlife.memory-depth-exploration`, not a second Memory Project.

## Accepted architecture being consumed

The missing scale layer already has source-managed predecessors.

### Vex Memory

Vextreme-SDK #225 owns the long-lived semantic domain:

~~~text
memoryRef / journalEventRef
journal/event identity
core-memory + temporal journal grammar
relationship context
compression / archival boundaries
retrieval coordinates
lineage recovery
retention / tombstone / supersession
~~~

Its later architecture explicitly separates canonical source from tracking/retrieval structures and names semantic compaction with provenance descent.

### Durable semantic Memory

`vgong24/Vextreme-SDK/lib/vex-memory/durable-semantic-memory.js` defines stable Memory/revision/source relationships and correction/supersession lineage.

It is deliberately a deterministic reference contract, not a filesystem store or product Memory writer.

### Living Journal shard contract

`vgong24/Vextreme-SDK/lib/living-journal/projection.js` already recognizes:

~~~text
DAY_SHARD
CONTEXT_SHARD
RELATIONSHIP_INDEX_SHARD
SOURCE_ARTIFACT_SHARD
LANGUAGE_PROJECTION_SHARD
ANNOTATION_SHARD
SEARCH_PROJECTION_SHARD
SHARD_MANIFEST
~~~

and preserves:

~~~text
SHARD_PLACEMENT != OBJECT_IDENTITY
stable object identity survives relocation / split / compaction
missing | stale | corrupt | unknown shard currentness stays explicit
search/index candidates terminate in exact relational/source recovery
protected raw source does not become projection authority
~~~

That source is a reference projection. It intentionally leaves the storage adapter unimplemented.

### Lesson Resonance

Lesson Resonance Part 05 makes the long-horizon index boundary explicit.

Source-managed facts include stable refs, chronology, accepted typed edges, scope/limits/counterexamples and source occurrence refs.

Rebuildable indexes may include:

~~~text
tokenized lexical cues
embedding vectors
semantic-neighborhood rankings
keyword / motif weights
candidate similarity scores
graph-centrality values
search rankings
recency / access-frequency boosts
~~~

Those indexes may nominate candidates. They do not authorize semantic binding.

The dynamic long-horizon target is that retrieval cost depends primarily on candidate anchors + implicated neighborhoods + exact evidence depth, rather than total lifetime archive size.

## Current Product pressure

Current VexLife-Prod already protects model attention:

- recent Conversation walks backward from the current immutable head only until the prompt budget fills;
- Working Continuity rollover is a residency decision, not deletion;
- current Memory is a bounded attributed projection;
- `continuity.revisit` returns bounded turns/tokens and records scan cost.

But current storage/retrieval still exposes scale pressure:

- canonical Conversation events live as individual JSON files under one thread event directory;
- complete Conversation validation currently enumerates that event directory;
- current Score replay enumerates Score events;
- Context Revisit currently projects/scans canonical events and matches exact words;
- current source explicitly says there is no meaning index yet;
- epoch-directory and meaning-index work are named but held.

Therefore:

~~~text
PROMPT SCALE IS BOUNDED
!=
LIFETIME DISK / RECALL COST IS ALREADY SUBLINEAR
~~~

## VexArchitecture alignment — follow the relationship, not the database

The Builder Field Guide and Live Demonstration sharpen this design in one important way:

~~~text
implementation placement / naming
!= architecture authority

Store/provider
!= database

construction identity
!= semantic identity
~~~

The long-horizon capability therefore does **not** earn a new `LongTermMemoryFamily`,
`LongTermMemoryDatabase`, `SQLiteMemoryStore`, or universal context graph merely because the
implementation needs durable acceleration.

### Rightful questions

The existing owners continue to answer their own questions:

~~~text
Conversation
  what was actually said?

Score / accepted Memory
  what meaning is currently accepted, corrected, superseded or released?

Working Continuity
  where does active work stand?

ContextRevisit / request-bound context projection
  what bounded historical source should this turn receive?

Continuity Source Locator
  which exact canonical source coordinates are plausible candidates,
  and is the derived locator current enough to use as a locator?

DirectPromptContext
  what exact bounded material reaches this provider turn?

Vex / provider realization
  what judgment/answer follows from the admitted context?
~~~

The **Continuity Source Locator** name is architectural working language because it states the
relationship being performed without pretending to own Memory. Exact source may choose another name
only if it answers this same question more truthfully.

Concrete technology belongs below that semantic boundary:

~~~text
VexLifeContinuitySourceLocator
  portable/product-facing relationship

FileContinuitySourceLocator
SqliteContinuitySourceLocator
<future backend>
  construction/provider realizations

SQLite / file layout / JDBC / native packaging
  implementation detail
~~~

A database row ID, index row, shard placement, driver name, platform target or realization ref must
never replace the canonical Conversation eventRef, Memory ref/revision, Score ref/head, or other
rightful source identity.

### End-to-end consequence walk

Apply the Live Demonstration reading rule literally: every step names the container, member/question,
why traversal arrived there, and the exact next edge.

~~~text
L0  Product construction
    Container: VexLife platform/application construction
    Member: Continuity Source Locator provider realization
    Why here: the Product needs one locator implementation for this host/deployment
    Next: resolve the exact realization and its canonical-owner adapters

L1  Canonical owners
    Container: Conversation / Score / Daily Memory / Working Continuity
    Member: immutable objects + exact current heads/frontiers
    Why here: only rightful owners can state durable truth
    Next: expose source-addressable facts/frontier to the derived locator

L2  Derived ingestion
    Container: Continuity Source Locator realization
    Member: candidate metadata / lexical terms / typed edges / source hashes / owner frontier
    Why here: accelerate source location without copying semantic authority
    Next: atomically publish one derived generation after canonical source is already durable

L3  Current request
    Container: ContextRevisit or request-bound EvolveContext projection
    Member: bounded query + owner scopes + current request binding
    Why here: current human request needs older source
    Next: ask the locator for candidates, not answers

L4  Candidate location
    Container: Continuity Source Locator
    Member: candidate source coordinates + evidence + derived-generation standing
    Why here: avoid lifetime enumeration
    Next: reopen exact canonical source through its rightful owner

L5  Source reconciliation
    Container: rightful Conversation / Memory / Continuity owner
    Member: exact source bytes/hash + lifecycle/privacy/currentness/supersession standing
    Why here: locator evidence is not source truth
    Next: accept, currentize, hold, or reject the candidate

L6  Multi-owner fusion
    Container: existing ContextRevisit / continuation machinery
    Member: verified source nodes + typed relationships + frontier
    Why here: one turn may need several independently-owned truths
    Next: budget/group the bounded context without creating another truth owner

L7  Provider placement
    Container: DirectPromptContext / provider representation
    Member: verified bounded context packet + source refs
    Why here: this exact model turn needs usable context
    Next: provider inference

L8  Vex answer / reach
    Container: selected model/provider realization
    Member: answer and any lawful follow-up capability request
    Why here: judgment remains with Vex, not with the index
    Next: durable Conversation response + Turn Context evidence

L9  Chronology
    Container: VexLogger / Turn Context evidence
    Member: timings, locator generation, candidate refs, returned refs, held reasons
    Why here: explain what happened without becoming truth
    Next: future debugging/performance/currentness observation

L10 canonical continuation
    Container: Conversation owner
    Member: committed request/response and new head
    Why here: the human/Vex exchange becomes durable source
    Next: locator sees owner frontier advance

L11 semantic continuation when separately admitted
    Container: semantic acceptance / Score / Daily Memory owners
    Member: accepted correction, supersession, release/tombstone, lesson or current Memory change
    Why here: recall does not itself write Memory
    Next: locator sees semantic-owner frontier/edge changes

L12 derived catch-up / invalidation
    Container: Continuity Source Locator realization
    Member: incremental delta or rebuild from exact owner frontiers
    Why here: future recall must not expose stale/deleted/superseded material
    Next: next bounded request begins again at L3
~~~

This closes the circuit in both directions:

~~~text
source -> locate -> reopen -> context -> Vex -> canonical continuation
                                      |
                                      +-> semantic change only through rightful owner
                                                        |
                                                        v
                                              derived catch-up/invalidation
                                                        |
                                                        └-> future locate
~~~

No introduced object disappears behind "later."

### VexArchitecture role boundaries

~~~text
Family / semantic owner
  existing Conversation / Memory / feature owners keep meaning
  no new LongTermMemory Family is earned by indexing alone

Execution
  only if active cancellable/overlap custody is genuinely needed
  local lookup is not wrapped in VexExecution merely because it performs work

Store / provider
  derived locator backend is outside/derived truth
  Store does not mean database

Partner
  NOT earned for local SQLite/file/index technology
  may become relevant only if a genuinely independently-owned external participant/service
  develops Source/Signal/Connection/Observation relationships that survive pressure testing

Construction
  chooses/builds the concrete locator realization and its lifetime
  construction ref never becomes Memory identity

Chronology
  records lookup/catch-up/rebuild timing and held reasons
  never becomes current Memory

Convergence
  existing ContextRevisit/fusion may relate verified owner truths
  do not create a new Relay solely because several owners are searched

Presentation
  Vex Context / Archives / debug surfaces may explain source/retrieval standing
  presentation never becomes source or index authority
~~~

### Mac / Windows / alternative backend realization seam

Current Product source already has the correct platform precedent:

~~~text
VexLifeJvmPlatformTarget
  -> exact VexLifePlatformRealization.Target

VexLifePlatformRealization.Catalog
  -> exact target realization
  -> no nearest-target fallback

consumer Product owners
  -> receive the resolved target/realization
  -> do not scatter Mac/Windows branches
~~~

Long-horizon storage should reuse that posture.

The backend choice is **construction/deployment realization**, not ordinary user semantic state.
A normal person does not need a "database selector." A technical builder may provide another qualified
implementation at composition time.

Candidate relationship:

~~~text
ContinuitySourceLocatorProvider
  dependencies:
    canonical owner adapters
    owned-path / file-lease facilities
    platform target
    logger/diagnostic sink where earned
    backend realization

default realization catalog
  macOS arm64/x86_64 -> qualified default locator
  Windows x86_64/... -> qualified default locator

custom technical composition
  may substitute another locator realization
  only when the same contract + lifecycle/leakage proof passes
~~~

Do **not** make platform family or database engine part of semantic Memory state.

A single portable implementation may serve Mac and Windows when its runtime dependencies are truly
portable. If a backend needs target-specific native libraries, packaging, locking, encryption or file
semantics, that difference belongs inside its exact platform/construction realization.

Required interchangeability law:

~~~text
same canonical source corpus
+ same Continuity Source Locator contract
+ different qualified backend realization
->
same candidate/source identities
same lifecycle/leakage decisions
same currentization semantics
implementation-specific performance may differ
~~~

A custom Postgres/search/vector service is not automatically Partner. It remains a provider realization
unless an independently meaningful external-participant relationship is actually present.

## Complete performance pressure: recall path **and** ordinary turn path

The current Product bottleneck is not only historical search.

Current Conversation source still has ordinary paths that enumerate/read the full event directory and replay the
canonical chain for checks that occur while forming or committing a new turn. Current Score loading similarly
replays its event history to prove current projection.

Therefore:

~~~text
FAST OLD-CONTEXT LOOKUP
!=
FIVE-YEAR PRODUCT FAST ENOUGH

long-horizon completion requires both:

ordinary Send/currentness path
  no lifetime enumeration by default

historical recall path
  no lifetime enumeration by default
~~~

The intended refactor keeps a full-history validator as an explicit diagnostic/rebuild proof, while the live path
uses exact current heads plus a current derived identity/index generation. If that derived generation is absent,
stale, corrupt or not provably descended from the canonical head, the dependent fast path holds/rebuilds rather
than trusting stale acceleration.

The same question applies to Score/current Memory replay: a current semantic projection should eventually be
recoverable from exact current owner materialization/checkpoint evidence instead of replaying all accepted history
on every prompt merely because the history exists.

## Storage posture

### Canonical source stays file-backed

Canonical VexLife owner files remain the durable truth unless their rightful owner separately evolves its contract.

~~~text
Conversation events / heads
Score events / heads
Daily Memory strata / heads
semantic acceptance / authority
Working Continuity evidence

= canonical source-addressable truth
~~~

Do not migrate those objects into a database merely to make search convenient.

### Add one rebuildable local retrieval store

A local retrieval store is a derived projection over canonical owner state.

~~~text
canonical owner files
        |
        | observe current heads / immutable objects
        v
derived retrieval store
  stable ref -> owner coordinate
  sequence / time
  typed relationships
  shard placement/currentness
  lexical search structures
  source-version/currentness evidence
        |
        v
candidate source refs
        |
        v
exact canonical re-open + verification
        |
        v
bounded ContextRevisit / Memory result
~~~

Permanent:

~~~text
INDEX != MEMORY
DATABASE != CANONICAL CONVERSATION
CACHE LOSS != MEMORY LOSS
INDEX HIT != SOURCE VERIFIED
SIMILARITY != ACCEPTANCE
REBUILD != SOURCE REWRITE
~~~

The retrieval store must be disposable and reconstructable from canonical sources plus accepted relationship edges.

## Database / backend realization decision

The architectural identity is the Continuity Source Locator relationship, not the database engine.
No constantly running database service is required by this outcome.

The first adapter comparison should include an embedded/on-demand SQLite-class store because it can provide, in one local file:

- transactional index updates;
- stable B-tree lookup;
- full-text/lexical search;
- joins across stable refs / typed edges / shard placement;
- crash-safe currentness metadata;
- bounded query plans;
- no network listener or database daemon.

This is a candidate implementation, not a pre-selected truth owner.

Compare it against a file-only derived index on:

~~~text
cold-open latency
incremental update cost
five-year corpus lookup latency
full rebuild time
crash/interruption recovery
stale-index detection
disk overhead
privacy / retention consequences
implementation and migration burden
~~~

Choose the smallest adapter that satisfies measured Product pressure.

### Semantic/vector index

Paraphrase retrieval is separately earned.

A later derived semantic index may store embeddings or another semantic-neighborhood representation only when:

- lexical/typed-edge retrieval measurably misses relevant historical source;
- the index remains rebuildable;
- candidate similarity is never promoted to accepted meaning;
- exact source recovery and currentness verification precede use;
- deletion/tombstone/retention changes invalidate the implicated index entries;
- sensitive source duplication is bounded by the rightful privacy/storage owner.

## Physical sharding

Do not restructure canonical directories merely because a large directory feels inelegant.

First measure:

~~~text
directory enumeration cost
exact event/head lookup cost
append/commit validation cost
rebuild cost
filesystem limits
backup/recovery cost
~~~

When physical pressure is proven, consume the accepted shard contract:

~~~text
stable object identity
+ SHARD_MANIFEST placement
-> bounded physical partition
-> object may move/split/compact
-> inbound refs remain stable
~~~

Candidate physical partition keys may use bounded sequence/epoch ranges while DAY / CONTEXT / RELATIONSHIP / SEARCH remain logical many-to-many shard views. The exact partition rule belongs to the future storage adapter and must be proven against current owner semantics.

## Incremental currentness

The steady-state path should not rebuild lifetime history per turn.

Candidate invariant:

~~~text
stored index frontier
+ observed canonical current heads
        |
        +-- exact same frontier -> no rebuild
        |
        +-- valid descendant -> ingest only new immutable objects / affected relationships
        |
        +-- mismatch / missing / corrupt -> bounded repair or full rebuild
~~~

A derived index never makes a stale canonical object current.

## Security / privacy boundary

This work materially touches private Memory/context storage, so Security Assurance applicability is YES.

Required questions before a real Product store is accepted:

- does the index duplicate private plaintext or only derived search structures?
- are retention/tombstone/content-destruction semantics propagated exactly?
- can an old index surface deleted/withdrawn content?
- are indexes confined to the selected Vex Home/user boundary?
- is encryption-at-rest behavior explicit rather than implied?
- can index corruption or poisoning cause a confidently wrong canonical lookup?
- can the store be deleted/rebuilt without affecting canonical Memory?
- are logs/debug exports content-free where required?

Security review must stay bounded to this new storage/retrieval boundary.

## Work sequence

~~~text
LH-0  architecture convergence
      SDK Vex Memory + Living Journal + Lesson Resonance
      <-> current VexLife-Prod physical readers / revisit scans

LH-1  derived-store contract + adapter comparison
      file-only derived index vs embedded/on-demand SQLite-class store
      exact currentness / rebuild / deletion semantics

LH-2  lifecycle / leakage membrane
      stale/private/superseded/tombstoned source cannot leak through derived recall

LH-3  canonical hot path
      ordinary Conversation / Score currentness does not enumerate lifetime history by default

LH-4  lexical + typed-edge retrieval index
      replace full-history location scan with candidate source refs
      exact canonical verification before return

LH-5  semantic/paraphrase candidate index
      similarity nominates; source + relationship owners decide

LH-6  five-year deterministic scale + recovery proof
      ordinary-turn cost + recall cost
      missing/stale/corrupt index
      crash during incremental update
      rebuild
      deletion/tombstone invalidation
      cold-start recall latency / coverage

LH-7  Product adapter / model probe
      actual Product owners + deterministic fixture provider first
      then selected real model in isolated scratch Home
      no Companion UI required

LH-8  shard-manifest / physical partition adapter
      only if measured filesystem pressure earns it
~~~

Construction and real integration dependencies remain distinct. LH-1/LH-2 can be proven without pretending the final cold-start lived gate already passed.

## Five-year acceptance shape

The final claim is not “SQLite is fast.”

It is:

~~~text
large canonical lifetime history
-> ordinary turn does not enumerate lifetime history
-> old lexical/paraphrase question locates bounded candidate refs
-> canonical owner reopens exact source
-> stale/deleted/superseded content cannot leak through the index
-> bounded result reaches Vex in the same continuity circuit
-> missing index rebuilds without Memory loss
-> measured latency / I/O remain bounded enough for lived use
~~~

The exact corpus scale and latency thresholds should be established from measured baseline/product expectations rather than invented here.

## Boundary

This Project source defines work and completion predicates only.

It grants no VexLife-Prod / Vextreme-SDK implementation authority, no personal Memory migration, no Memory write, no training/model/weight effect, no release, and no deployment.

<!-- [VEXWORK][MEMORY-DEPTH][LONG-HORIZON-MEMORY][VXG RealForever] -->
