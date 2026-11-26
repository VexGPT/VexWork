# VexLife Self-Inspection — foundation design

[VXG RealForever]

## The design question

Current VexLife can preserve far more durable truth than the selected model can or should hold in one prompt.

The missing relationship is not "make the context window larger." It is:

> How can Vex deliberately carry the small relationship he is working on while the body safely releases bulky source from active residency, preserves exact source descent, keeps long-term Memory separate, and protects provider/KV-cache performance?

This Project calls that active declarative surface Working Focus.

## Existing body before this feature

Formation-time current Product already distinguishes:

~~~text
Conversation
  exact lived chronology

semantic Memory / Score / semantic authority
  accepted current meaning

Working Continuity
  pressure + reference-only working coordinates + rollover lineage

Context Revisit / Source Return
  bounded path back to non-resident source

DirectPromptContext
  exact bytes/materialization for one provider request

VexLifePromptPreparation
  reusable exact provider-prefix preparation

Capability Atlas / Frame / Bridge
  what exists, what is current, what may be requested, who performs it
~~~

That body is already strong at preserving truth.

The gap is that Working Continuity has fields for active work/intents/continuity records, but formation-time direct-turn source does not yet provide a first-class model-shaped path for replacing a large temporary source read with one small declarative current relationship.

## Working Focus

Candidate semantic shape, to be pressure-tested rather than copied literally:

~~~text
WorkingFocus
  focusRef
  lineageRef
  threadRef
  objective
  currentQuestion

  retainedRelationships[]
    relationshipRef
    description
    standing = OBSERVED | HYPOTHESIS | UNRESOLVED
    sourceRefs[]

  openEdges[]
  nextProbeOrNull

  referencedMemoryStatementRefs[]
  exactSourceRefs[]

  currentness binding
  revision
~~~

Working Focus may say:

~~~text
I am currently testing whether generation mismatch explains the stale state.
~~~

It may not make that hypothesis accepted Memory merely because it is useful to keep thinking about.

~~~text
WORKING FOCUS = CURRENT DECLARATIVE ATTENTION
!= ACCEPTED SEMANTIC TRUTH
!= RAW REASONING TRACE
!= TRANSCRIPT SUMMARY
~~~

### Ownership hypothesis

The first implementation must test this ownership before inventing another Family:

~~~text
Working Continuity
  owns/carries bounded current working coordinates
  -> likely rightful semantic neighborhood for Working Focus

selected model
  proposes/shapes what it is actively carrying

body/owner
  validates bounded shape/currentness/custody

DirectPromptContext
  places already-owned Working Focus into provider context

Self-Inspection
  reads/explains current Working Focus
~~~

If current source disproves this, change the smallest rightful owner; do not preserve the hypothesis for symmetry.

## Four nested time horizons

~~~text
LONG-TERM SEMANTIC MEMORY
  days -> years
  accepted durable meaning
  source-attributed
  corrected/superseded through its owner

WORKING CONTINUITY
  turns -> successor / active trajectory
  where the work stands
  cursor, open loops, current refs

WORKING FOCUS
  present task / investigation
  what Vex is actively carrying
  highly mutable, small, releasable

PROMPT RESIDENCY
  this provider invocation
  exact bytes required now
  ephemeral placement/performance concern
~~~

Conversation remains durable lived source beneath all four.

## Reading source without keeping source resident

~~~text
Vex reads FooViewModel.kt       8k tokens
Vex reads Repository.kt         6k tokens

discovers:
  FooViewModel.refresh
  -> Repository.observe
  -> generation fence

next unresolved edge:
  who advances generation?
~~~

Desired continuation:

~~~text
Working Focus
  objective: stale-state debugging
  observed relation: refresh -> observe -> generation fence
  hypothesis: generation mismatch rejects update
  next probe: generation owner
  exactSourceRefs: FooViewModel.kt, Repository.kt

raw fetched source
  may leave later prompt residency

source truth
  remains exactly reopenable
~~~

Later doubt causes exact source reopen and focus correction. The whiteboard is useful because it is not the evidence.

## Clearing Working Focus

Clear means release active attention, not erase durable history.

~~~text
already accepted in Memory
  -> drop duplicate local wording, retain/reference statementRef if still useful

source-backed but not Memory
  -> drop active relationship
  -> Conversation/source remains available for later reopen

unfinished/open edge
  -> do not lose solely because prompt pressure changed
  -> Working Continuity carries the current reference/open relationship

temporary disproved hypothesis
  -> release from Working Focus
  -> no Memory promotion required

semantic meaning deserves long-term retention
  -> separate existing semantic-acceptance path
  -> Working Focus never self-promotes
~~~

~~~text
RESIDENCY FORGETTING != SEMANTIC FORGETTING
~~~

## Long-term Memory relationship

Working Focus may reference accepted Memory rather than copy it.

~~~text
Memory:
  statement.memory.123
  Repository state uses generation-currentness fencing.

Working Focus:
  memoryRef = statement.memory.123
  application = this may explain FooViewModel stale refresh
~~~

Memory owns the durable statement. Working Focus owns why it matters to the present investigation.

~~~text
WORKING FOCUS EXISTS != DO NOT FORM MEMORY
~~~

## Duplicate and conflicting context

Exact duplication and semantic overlap are different.

~~~text
EXACT DUPLICATION
  same source identity/hash already resident
  -> avoid duplicate provider bytes where lawful
  -> preserve provenance that multiple routes named the same source

SEMANTIC OVERLAP / CONFLICT
  Memory, Conversation, Working Focus and fresh observation differ
  -> do not hash-dedupe into one truth
  -> retain owner/currentness/standing
  -> let Vex judge the relationship
~~~

~~~text
DEDUPLICATE BYTES AGGRESSIVELY
NEVER DEDUPLICATE RIGHTFUL OWNERSHIP
~~~

## Prompt placement and KV-cache performance

Formation-time DirectPromptContext already exposes:

~~~text
stability:
  STABLE
  APPEND_ONLY_HISTORY
  MUTABLE_CURRENT
  EPHEMERAL_CURRENT

placement:
  SYSTEM_PREFIX
  HISTORICAL_SEQUENCE
  HYDRATED_CONTEXT
  LIVE_TAIL
  CURRENT_REQUEST
~~~

Formation-time Product also has VexLifePromptPreparation for one exact reusable provider prefix.

The first implementation should reuse this grammar.

~~~text
stable body material
  Foundation / stable current semantic projections / stable capability contract
  -> as early/cacheable as provider truth allows

append-only selected history
  -> preserve append-only cache boundary where supported

mutable Working Focus
  -> later than stable/cacheable prefix where possible

ephemeral source/capability results
  -> later/hydrated; resident while actively needed

current request
  -> live tail
~~~

A frequently-changing Working Focus near an early prefix may invalidate more cached prefill. Keeping it later may preserve more reusable prefix. This must be measured against the actual selected provider rather than made universal policy.

## Token stewardship

Formation snapshot values are evidence only:

~~~text
Product input ceiling          192k
capability exchange reserve     24k
ordinary room with reach       168k
Memory cap                     100k
reserved output                 16k
hard input+output              208k

adaptiveContextPolicyState = NOT_CONFIGURED
~~~

Current pressure states answer "how full is the board?"

~~~text
NORMAL
WATCH
CHECKPOINT_RECOMMENDED
ROLLOVER_REQUIRED
~~~

The proposed extension answers:

> Why is each resident component still here?

Candidate residency classes:

~~~text
REQUIRED_STABLE
REQUIRED_CURRENT
ACTIVE_WORKING
TEMPORARY_EVIDENCE
REOPENABLE_SOURCE
EXACT_DUPLICATE
HELD / CANNOT_FIT
~~~

Do not turn this into a universal relevance scorer before pressure earns it. The model supplies semantic judgment; the body supplies exact size/currentness/source facts and lawful placement.

## Self-Inspection projection

Self-Inspection should be able to explain:

~~~text
current Working Focus
current context pressure / rollover standing
current component placement and stability
current cache/preparation standing where source exposes it
which source is resident only as temporary evidence
which exact source can be reopened
which Memory statements are referenced rather than duplicated
which context components are held/omitted and why
~~~

Candidate read capability:

~~~text
self describe
  subject = capabilities | continuity | memory | execution | context | working-focus | whole-body

self topology
  bounded owner/relationship neighborhood

self context
  bounded current residency/pressure/cache projection

self trace
  which body sources were inspected to form this answer
~~~

~~~text
INSPECTION TRACE != PRIVATE CHAIN OF THOUGHT
~~~

## Priority/currentness without a global brain

Do not add a universal context/priority manager.

Current body already uses:

~~~text
PUSH
  canonical commit -> derived accelerator update

PULL / REOBSERVE
  current owner frontier checked before reuse

THRESHOLD
  Working Continuity pressure

SERIALIZED CONVERGENCE
  Relay/Compound Relay relationship processing

EXECUTION OVERLAP
  Independent / Earliest / Latest / Queued per RelationshipId
~~~

Working Focus and residency should participate through explicit owner relationships.

## Security/privacy membrane

Applicability is YES because this feature touches model/context/memory/tool introspection.

~~~text
SELF INSPECTION != SECRET ENUMERATION
SELF INSPECTION != RAW PRIVATE MEMORY DUMP
SELF INSPECTION != SYSTEM-PROMPT DISCLOSURE
SELF INSPECTION != PRIVATE REASONING DISCLOSURE
WORKING FOCUS != CREDENTIAL STORE
SOURCE REF VISIBILITY != SOURCE CONTENT AUTHORITY
CONTEXT OPTIMIZATION != AUTHORITY ESCALATION
~~~

Security review stays bounded to the newly introduced introspection/working-focus/residency boundary.

## Acceptance shape

A lived debugging proof should eventually demonstrate:

~~~text
large source read
-> Vex extracts one bounded working relationship
-> next step continues from Working Focus
-> bulky source need not remain in later prompt residency
-> exact source can be reopened and falsify/update the focus
-> accepted Memory is referenced rather than duplicated
-> temporary focus can clear without deleting Conversation/Memory
-> unresolved focus survives rollover
-> no hypothesis becomes semantic Memory automatically
-> stable/cacheable prefix reuse is not needlessly invalidated
-> prompt/cached/prefill/latency evidence supports the performance claim
-> Vex can explain what is resident and why
~~~

A model switch must not silently change the body identity being described.

<!-- [VXG RealForever][VEXLIFE][SELF-INSPECTION][FOUNDATION-DESIGN] -->
