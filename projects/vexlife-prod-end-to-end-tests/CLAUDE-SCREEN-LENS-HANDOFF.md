# Claude handoff — Screen Lens + E2E relationship discovery

`[VXG RealForever]`

## Intention

Build out VexLife-Prod/VexArchitecture perception through the rightful VexBoard Screen Lens lane **while simultaneously discovering the human choice/state relationships needed by `project.vexlife-prod.end-to-end-tests`**.

Do not make the E2E Project a second Product or Screen Lens architecture owner.

## Enter from current sources

VexWork:

~~~text
PR #298  recurring VexArchitecture <-> VexBoard Screen Lens sync
PR #300  preserve source realization topology in Depth
PR #303  Direct Registration dependency classification
projects/vexboard/SCREEN-LENS.md
projects/vexboard/SCREEN-LENS-ADAPTER.md
projects/vexboard/SCREEN-LENS-PROJECTABILITY.md
~~~

VexLife-Prod:

~~~text
main 98a22ede8d37b3b8868eb42f4e7a9a1d612b97d0
src/jvmMain/kotlin/vexlife/lens/VexLifeProdScreenLens.kt
docs/lens/vexlife-prod.screen-lens.json
PR #343 E2E excavation
~~~

Current-main Product pressure:

~~~text
#310 VoiceInput / local ASR (merged)
#331 reply-language scripts / Composer output (merged)
~~~

Active Product pressure to read but not promote to current main:

~~~text
#251 Vex Context / Context Profiles
#343 E2E validation excavation
~~~


## First orientation: architecture attractor before implementation

Read these before reasoning about the E2E graph:

~~~text
https://vgong24.github.io/Vextreme/pages/vexarchitecture-first-stable-body.html
https://vgong24.github.io/Vextreme/pages/vexarchitecture-live-demonstration.html

pinned Vextreme main
1a0f161b4175e83c223e57642d08501004cdb9fd
~~~

Take the architecture as the attractor:

~~~text
Family owns semantic meaning
Execution owns active custody
outside truth stays outside until rightful reconciliation
Relay exists only for a new relationship across independent truths
presentation projects truth; it does not become truth
provider acknowledgement != physical outcome
implementation naming/placement is evidence, not authority
~~~

Do not convert these into another local helper framework. Follow the same questions in current source.

Then read the current Android witnesses:

~~~text
VexLife-Android main d857a92371555472e0303b18eadf353da2a868d6

architecture/elements/.../ScreenBlueprint.kt
app/src/main/.../screens/AppScreenBlueprint.kt
app/src/main/.../screens/AppScreens.kt
app/src/journeyTest/.../VexJourney.kt
app/src/journeyTest/.../catalog/Journeys.kt
app/src/journeyTest/.../VexJourneyCoverage.kt
docs/foundation/JOURNEY-INSTRUMENTATION.md
docs/foundation/SCREEN-CRAWLER-EVIDENCE.md
app/src/journeyTest/.../crawler/VexScreenCrawlerConfig.kt
app/src/androidTest/.../crawler/VexScreenCrawlerInstrumentedTest.kt
~~~

These demonstrate stable production IDs, human walk authoring, semantic coverage, and optional crawler evidence without making the test system the product owner.

## Fresh-instance orientation order

A fresh instance should not begin by inventing a new test abstraction.

Read in this order:

~~~text
1. projects/vexlife-prod-end-to-end-tests/README.md
   -> human outcome + Project boundaries

2. projects/vexlife-prod-end-to-end-tests/RELATIONSHIP-LATTICE.md
   -> graph / pathway / route / journey / test semantics
   -> derive-vs-Roomba rule

3. projects/vexlife-prod-end-to-end-tests/relationship-lattice.seed.json
   -> pinned examples / current candidate pressure
   -> navigation seed only, never Product authority

4. VexLife-Prod:
   src/commonMain/kotlin/vexlife/semantic/VexFamilyContract.kt
   -> exact State + Control -> Act(admitted State?, Effect?) law

5. concrete source examples below
   -> learn the distinctions from real Product source

6. VexBoard traversal/query primitives
   -> reuse existing graph mechanics

7. only then inspect active PRs for future-current edges
   -> ACTIVE_CANDIDATE != current main
~~~

If any summary conflicts with exact source, exact source wins within its rightful authority boundary.

## Judgment anchors: concrete source examples

These examples are deliberately chosen because each prevents a different category mistake.

### A. VexFamilyContract — the grammar

~~~text
VexLife-Prod
src/commonMain/kotlin/vexlife/semantic/VexFamilyContract.kt
~~~

Use it to remember:

~~~text
State + Control
-> Act(
     admittedState?,
     Effect?
   )

Act is pure semantic interpretation.
Effect is requested realization.
Effect != outside success.
Projection comes from State.
~~~

Do not infer execution/storage/UI ownership from the semantic contract.

### B. Vision — Effect is not successor State

~~~text
src/commonMain/kotlin/vexlife/vision/VexLifeVisionFamily.kt
~~~

Patient-zero law:

~~~text
READY + ENGAGE
-> stay(Effect.EngageScope)
-> no immediate admitted State
-> runtime / macOS picker
-> observe(...)
-> SELECTING | ENGAGED | HELD
-> DisplayState
~~~

Judgment taught:

~~~text
Control is lawful only in some States.
Effect requests realization.
Observation decides actual successor truth.
A held branch can still expose a different lawful Control.
~~~

This is the best example for generating branch-capable Family routes.

### C. Memory Review — one Family can request an Effect owned elsewhere

~~~text
src/commonMain/kotlin/vexlife/memory/VexLifeMemoryReviewFamily.kt
~~~

Patient-zero law:

~~~text
Pending(candidate) + KEEP
-> Effect.Accept(candidate)
-> MemoryReview itself does not become "ACCEPTED"
-> persistence / semantic acceptance / Score are separate owners
~~~

Judgment taught:

~~~text
same human outcome may cross several owners
without collapsing those owners into one Family.

Effect endpoint
!= eventual durable state owner.
~~~

This is the best example for cross-owner graph edges.

### D. ContextShare — stable UI coordinate + incomplete/deeper runtime relationship

Read together:

~~~text
src/commonMain/kotlin/vexlife/workspace/VexLifeWorkspaceBlueprint.kt
src/commonMain/kotlin/vexlife/web/VexLifeWebP1.kt
src/commonMain/kotlin/vexlife/web/VexLifeWebP1RuntimeArtifacts.kt
src/jvmMain/kotlin/vexlife/companion/DirectPromptContext.kt
src/jvmMain/kotlin/vexlife/lens/VexLifeProdScreenLens.kt
~~~

Stable surface coordinate:

~~~text
element.vexlife-workspace.companion.conversation.context-share
~~~

Current lived/source neighborhood:

~~~text
Product-owned navigation earns page identity
-> context becomes eligible
-> ContextShare can be activated
-> separate context-frame read
-> browserContext ready
-> includePage true/false
-> next Send may capture exact browserContext
-> DirectPromptContext receipt fingerprints it

unexpected internal embedded navigation
-> exact new address not observable
-> stale identity/context cleared
-> ContextShare unavailable
~~~

Judgment taught:

~~~text
element ID locates the human control
!= complete semantic pathway.

visible-but-unavailable
!= feature absent.

fail-closed limitation
!= automatically a defect.

Screen Lens may be source-current yet relationship-shallow.
~~~

This is the best Roomba/projectability example.

### E. Context Profile / reply language — turn capture and historical immutability

Mixed current/candidate boundary:

~~~text
current main
  VexLifePersonSettings / reply-language capture in DirectPromptContext

active candidate #251
  VexLifeContextProfileFamily
  Vex Context projection/evidence evolution
~~~

Judgment taught:

~~~text
mutable current truth
-> captured at accepted Send
-> fixed for that completed turn

later current change
-> affects NEXT TURN
-> does not rewrite LAST TURN RECEIVED
~~~

Use this to judge temporal edges and E2E history assertions.

### F. VexLife-Android ScreenBlueprint + Journey — stable coordinates and human walks

~~~text
VexLife-Android
architecture/elements/.../ScreenBlueprint.kt
app/src/journeyTest/.../VexJourney.kt
app/src/journeyTest/.../catalog/Journeys.kt
~~~

Judgment taught:

~~~text
nested source structure
-> stable element.<screen>.... IDs

human-readable journey
-> tap/assert by stable production element ID

journey domain/path
!= engine topology
~~~

Use this as the reference for queryable human walks without duplicating semantic IDs.

### G. VexBoard graph mechanics — do not build another traversal engine

~~~text
VexWork
src/shared/vexboard-journey.mjs
src/shared/vexboard-journey-pathway-analysis.mjs
src/shared/vexboard-screen-lens-query.mjs
~~~

Current machinery already supports:

~~~text
graph relationships
journeyChoices() outgoing edges
relationship traversal
BACK / REVISIT
loop/motif discovery
element/pathway/source lookup
"where is this?"
"what depends on this?"
~~~

Judgment taught:

~~~text
new work should enrich source-derived graph input
and derive test routes from it,
not create a second graph engine.
~~~

## Fresh-instance decision rules

When reading a feature/edge:

~~~text
1. Is the meaning already explicit in rightful source?
   YES -> derive it. Do not Roomba it for authorship.

2. Is the lived Product exposing behavior the graph cannot explain?
   YES -> bounded Roomba discovery.
          Capture evidence.
          Propose missing/wrong edge.
          Reconcile back to rightful source.

3. Is this inside one Family?
   -> model State + Control -> Act -> Effect / admitted State.

4. Does realization cross an owner boundary?
   -> preserve both endpoints.
      Do not collapse them into one Family.

5. Is there an Effect?
   -> do not claim success until observation/reconciliation proves successor truth.

6. Is there a UI element ID?
   -> use it to locate/act on the manifestation.
      Do not treat the element ID as semantic ownership.

7. Is this an active PR?
   -> map as ACTIVE_CANDIDATE.
      Do not use it as current-main release truth.

8. Is the relationship held/unknown?
   -> keep the edge addressable and fail closed.
      Do not fill the gap with a guessed route.
~~~

## First fresh-instance deliverable

Before broad implementation, return a compact orientation receipt:

~~~text
A. current source bindings actually read
B. three patient-zero graphs:
   - Vision
   - Memory Review
   - ContextShare
C. one active-candidate temporal graph:
   - reply language / Context Profile -> next Send -> Vex Context
D. VexBoard traversal primitives available for reuse
E. exact graph gaps / projection gaps discovered
F. one generated route manifest candidate
G. what was derived from source vs what required Roomba discovery
~~~

If that receipt cannot be produced from exact source, do not begin a broad crawler/test framework.

## Mission sequence

Hold this sequence while working:

~~~text
GOAL
Preserve stable human experience while VexLife-Prod implementation keeps evolving.

NEAR-GOAL
Make current VexLife-Prod relationships projectable as one source-derived graph that VexBoard can query and E2E tests can traverse.

SOLUTION ROUTE
VexArchitecture attractor
-> Android stable-ID / Journey / crawler witnesses
-> current VexBoard graph/query machinery
-> VexLife-Prod Family / Blueprint / runtime / prompt relationships
-> relationship graph
-> derived pathway
-> concrete route
-> deterministic test manifest
-> lived-model / lifecycle proof when required

TARGET MASTERY
Given any human-visible control, Family State/Control, Effect, projection or failing E2E edge:
1. locate it in source;
2. traverse backward to prerequisites and the human action;
3. traverse forward to realization, observation, successor truth and projection;
4. identify every lawful branch/loop;
5. generate the smallest truthful test route;
6. distinguish Product relationship correctness from model behavior;
7. know whether the edge is CURRENT, ACTIVE_CANDIDATE, HELD or UNKNOWN;
8. improve the source graph rather than create a parallel feature map.
~~~

## Two simultaneous outputs

### Output A — rightful Screen Lens evolution

Continue through the current VexBoard Screen Lens/sync ownership. Repair only relationships current source proves. Keep Surface / Structure / Behavior / Depth distinctions and fail closed on unknowns.

### Output B — E2E discovery packets

For each meaningful source pathway discovered, return:

~~~text
sourceRefs[]
existing coordinateRefs[] / exact source symbols
humanMeaning
sourceOwner / Family
State refs/shapes observed
Controls lawful by State
Act row: State + Control -> admitted State? + Effect?
outside realization
Observation -> actual successor State/currentness
cross-owner endpoint rows
projectionRefs[]
loop pressure
candidateJourneyRefs[]
disposition CURRENT | ACTIVE_CANDIDATE | HELD | UNKNOWN
~~~

These packets update the E2E lattice; they do not become Product truth. Do not mint a discovery/relationship ID merely to name a row that is already uniquely described by its source coordinates.

## First census targets

Current main Families:

~~~text
Entry
Private mode
Diagnostics
Memory
Memory Review
Models
Release Inbox
Vision
~~~

Current-main pressure now includes:

~~~text
VoiceInput (merged #310)
Local ASR Models (merged #310)
Person reply language / spoken language / Composer output (merged #331)
~~~

Then active candidate pressure:

~~~text
Context Profile + Vex Context (#251)
~~~

## What to look for

Do not stop at a control-to-function mapping. Follow the relationship far enough to answer:

~~~text
State -> available Control
Control -> semantic Act / Effect
Effect -> realization / outside truth
Observation -> successor State
State/change -> another Family or turn boundary
turn boundary -> provider input
completed turn -> Vex Context / Screen Lens / human projection
~~~

Call out where a pathway is intentionally independent rather than forcing an edge.

## Existing-ID mapping rule

Do not invent a parallel feature ID when source already has a unique element/pathway/Family coordinate.

For each discovery, return the existing coordinate(s) and attach meaning:

~~~text
coordinateRefs[]
humanMeaning
availabilityPredicates[]
State / Control law
crossFamilyEdges[]
journeyRefs[]
loop pressure
proofRefs[]
currentLimitationOrHoldOrUnknown
~~~

Patient zero:

~~~text
element.vexlife-workspace.companion.conversation.context-share
pathway.vexlife-prod.local.companion.conversation.context-share
pathway.vexlife-prod.conversation.send
~~~

Current runtime behavior is deeper than the present local-only Screen Lens path:

~~~text
Product-owned navigation earns exact page identity
-> context eligibility
-> human requests page read
-> separate context frame returns normalized exact-page context
-> Include this page becomes included
-> next Send optionally carries browserContext
-> DirectPromptContext fingerprints it in the receipt
~~~

Current fail-closed branch:

~~~text
unexpected internal embedded navigation
-> new cross-origin address cannot be observed
-> clear stale page identity/context
-> show Current address unavailable
-> disable Include this page
~~~

Treat that as a current limitation to map and revisit. Also flag that the current Screen Lens classifies ContextShare only as TYPED_PRESENTATION over ContextReceipt even though runtime source proves deeper relationships. Investigate whether Product Screen Lens source/projectability should expose more; do not hand-author the missing depth in VexBoard.

## Patient-zero relationship journey

Use the language/Voice/Context case as a pressure test for the mapping:

~~~text
reply language en
-> speak/send
-> provider gets en
-> Vex Context completed turn says en

change reply language to zh-Hans
-> FOLLOW_REPLY_LANGUAGE may resolve spoken recognition to zh
-> speak Chinese
-> Composer output may stay as spoken or translate to English
-> Send
-> provider separately receives replyLanguage=zh-Hans
-> real-model behavior expects Simplified Chinese
-> Vex Context newest turn says zh-Hans
-> prior English turn still says en
~~~

Strongest permutation:

~~~text
spoken language = Chinese
Composer output = English translation
Vex reply language = Simplified Chinese
~~~

If the Lens or source map collapses those three coordinates, report the exact missing relationship rather than inventing equivalence.

## Non-duplication rules

~~~text
one Product branch meaning -> one source relationship
journeys link to it; they do not copy it

one semantic journey -> many evidence configurations
locale/platform/model variants do not become copied journeys

Screen Lens projection -> perception
!= Product authority
~~~

## Graph / pathway / route expectation

Treat the source-derived relationship graph as primary.

~~~text
PATHWAY = selected branch-capable subgraph
ROUTE   = one concrete traversal
JOURNEY = human scenario across one or more routes
~~~

Where current Screen Lens already exposes a `pathwayRef`, preserve it as a projection/query coordinate. Do not assume the pathway ref itself is semantic authority; investigate how its nodes/edges can be derived from the richer source relationship graph.

For each source relationship discovered, make it possible to answer both directions:

~~~text
REVERSE
  what source State / Control / surface element(s) can reach this edge?

FORWARD
  what Effect / realization / observation / successor State / Projection follows from it?
~~~

First test-generation deliverable should be a deterministic route manifest, not hand-written test code:

~~~text
target coordinate / edge
preconditions
human actions + elementRefs
relationship traversal
expected State/Effect/Observation
expected Projection/evidence
execution class
~~~

Then bind that manifest to existing VexLife-Prod deterministic/isolated-service runners.


## Concrete notation example

Use this only as a readable traversal/query notation. Resolve it back to current source; do not create these angle-bracket tokens as new Product IDs.

~~~text
<subject:user>
  -> <surface:settings>
  -> <control:reply-language>
  -> branch_routes[
       select(en),
       select(zh-Hans),
       select(zh-Hant)
     ]
  -> <capture:next-send>
  -> <owner:DirectPromptContext.PersonContext.replyLanguage>
  -> <provider:selected-runtime>
  -> <projection:Vex Context>
~~~

Interpretation:

~~~text
human intention
-> current State exposes a Control
-> human chooses one branch
-> lawful Act/Effect/current-setting realization
-> next accepted Send captures the result
-> provider receives it
-> completed turn records it
-> human projection shows what actually happened
~~~

Second example:

~~~text
<subject:user>
  -> <control:spoken-language=zh>
  -> <control:composer-output=TRANSLATE_TO_ENGLISH>
  -> <control:reply-language=zh-Hans>
  -> <control:voice-start>
  -> speak(...)
  -> <composer:English translation>
  -> <control:send>
  -> <provider-input>[
       Conversation.request = English,
       PersonContext.replyLanguage = zh-Hans
     ]
  -> <projection:Vex Context>
~~~

The point is not the syntax. The point is that one compact human-readable path can expand into exact source coordinates, branches, reverse prerequisites, forward consequences and generated test assertions.

## When to derive and when to excavate

### Architecture-first

If current source already expresses the relationship:

~~~text
read source
-> derive graph
-> derive route
-> run generated test
~~~

Do **not** manually click around to rediscover it.

### Roomba discovery

If the generated graph cannot explain a lived feature/state:

~~~text
walk once
-> capture exact element IDs + observations + evidence
-> propose candidate missing edge(s)
-> reverse-engineer source ownership
-> confirm/correct/reject
-> repair rightful source/projector
-> regenerate graph
~~~

The walk is discovery evidence, not semantic authority.

### Build-as-you-walk

For active new work:

~~~text
add truthful source edge
-> graph grows
-> route/test manifests grow
-> exercise edge once
-> reconcile mismatch
-> graph remains the map
~~~

The desired direction is that manual walking becomes less necessary as the architecture becomes more complete.

## Claude first prototype question

Before building a large crawler, prove this loop on one small source neighborhood:

~~~text
Family/owner source
-> graph nodes/edges
-> select one edge
-> reverse traversal to elementRef + precondition
-> forward traversal to expected Effect/State/Projection
-> emit one deterministic test manifest
-> emit one human-readable explanation
~~~

Suggested patient zeros:
1. Vision READY + ENGAGE -> EngageScope -> observed successor.
2. ContextShare available -> page read -> included -> Send browserContext.
3. reply-language change -> next Send -> Vex Context historical/current distinction.

## Traversal debt rule

As you map a route, do not normalize missing identity into a workaround.

If a meaningful control/projection/state manifestation lacks a stable ID or graph coordinate:

~~~text
stop that dependent route at FRONTIER_DEBT
identify the exact missing coordinate/predicate
repair the rightful production/source identity first
regenerate the graph
resume from the same frontier
~~~

Do not use test-only aliases, text matching, child indexes, CSS coincidence, or helper wrappers to make the route appear addressable.

### Strategic order

To reduce repeated setup cost, begin with routes that are already source-clear and addressable.

~~~text
cleared routes
-> initial relationship graph
-> traversal + test-manifest generation
-> graph validator exposes remaining debt frontiers
-> separate instances can pick up distinct frontier edges
-> each repair makes the graph more complete
~~~

A missing ID is not forgotten just because another route continues. It remains an explicit frontier returned by graph validation.

Add this to your orientation receipt:

~~~text
Traversal debt encountered:
  coordinate / route
  debt class
  rightful source that should own the repair
  whether it blocks this route only or a shared graph neighborhood
~~~

## Graph-operations Relay subset — after ordinary graph truth

Once the ordinary graph and first route manifests are grounded, run a separate Relay/convergence pass.

Do not use Relay to extract the graph.

~~~text
source -> graph
graph + other current independent truths -> optional earned Relay
~~~

Read the Android source attractor:

~~~text
VexLife-Android
architecture/relay/README.md
architecture/relay/.../VexRelay.kt
architecture/relay/.../VexCompoundRelay.kt
app/.../ui/VexLifeRelayGraph.kt
~~~

Preserve these distinctions:

~~~text
Relay owns new relationship truth
!= input truth owner

VexLifeRelayGraph projects Relay nodes
!= constructs / activates / semantically owns them

current Relay projection
!= event ledger
~~~

`VexLifeSemanticRelayContract` in VexLife-Prod is a specific conversation semantic-relay metadata validator; do not treat its name as generic convergence authority.

### Relay subset sequence

~~~text
R0 ordinary graph/routes exist

R1 inspect independent-truth joins
   classify:
     ordinary consumption
     source-proven Relay
     candidate convergence
     FRONTIER_DEBT / UNKNOWN

R2 derive earliest useful operational convergence
   route readiness
   debt frontier
   perturbation candidate currentness

R3 after deterministic proof exists
   coverage/proof currentness
   execution-plan readiness

R4 after graph revisions / lived evidence exist
   change impact
   VexBoard inspection

R5 after release evidence exists
   release-readiness convergence
~~~

Do not implement all of these. For each, first show the concrete independent inputs, the new relationship question, the current consumer, and why an ordinary query/projection is insufficient.

### Return record for any earned Relay

~~~text
relationship question
independent input owners
source coordinate(s)
why CONSUMED_BY alone is insufficient
output relationship truth
current consumer
lifetime / activation owner
projection surface
proof of sibling-arrival/currentness/no-op behavior
what durable truth remains outside the Relay
~~~

## After the base graph: generate interruption/race considerations

Do not start here. First derive the truthful ordinary route.

Then inspect that route for:

~~~text
transient States
Controls available during transient States
active Effects / executions
authored overlap Approach
mutable current truth captured at a boundary
retry/idempotency identity
owner/lifetime teardown
outside observations that can arrive later
~~~

From those, generate candidate perturbation routes.

### Patient-zero examples

**VoiceInput (current main; merged #310):**

~~~text
READY + START
-> REQUESTING_MICROPHONE

while REQUESTING_MICROPHONE:
STOP is lawful
-> STOPPING

question:
what happens if recognition-started observation arrives after STOP?
~~~

Treat the last line as an investigation question until the realization source proves its stale-result/currentness behavior.

**Models current main:**

~~~text
anyDownloadRunning / anySwitchRunning
-> idle = false
-> many Controls are not admitted
~~~

Generate busy-state Control attempts and assert no unearned Effect.

**VexExecution / Android architecture:**

~~~text
Earliest / Latest / Queued / Independent
~~~

These are already-authored overlap policies. Reuse them when the Product relationship actually carries them; do not create a second race-policy abstraction.

**Send current main:**

~~~text
sendInFlight
pending idempotency key
exact retry/reconciliation path
~~~

Generate double-Send / exact retry considerations from those existing coordinates.

### Suggested generated labels

~~~text
REENTRY
INTERRUPT
SIBLING_CONTROL
STALE_OBSERVATION
CAPTURE_RACE
TEARDOWN
ORDERING
RETRY_IDEMPOTENCY
~~~

Labels are analysis metadata only.

Add perturbation candidates to your orientation/coverage receipt only after the ordinary route is grounded.

## If you hit a hard edge: do not paper over it

Before adding a helper class, registry, second state holder, custom traversal engine or feature-specific test DSL, classify the problem:

~~~text
semantic law missing
extractor/projectability missing
realization missing
observation/reconciliation missing
human projection missing
deterministic test seam missing
intentionally held/unknown
~~~

Then repair the smallest rightful layer.

Use these four examples as judgment anchors:

~~~text
Vision
  Effect != observed successor State

Memory Review
  one human choice may cross several owners

ContextShare
  element ID != semantic route
  conditional availability
  fail-closed/projectability gaps

Voice + language + Vex Context
  independent current truths converge at Send
  current state must not rewrite historical evidence
~~~

If a new problem resembles one structurally, reuse the relationship pattern, not the feature-specific implementation.

### Example analogy test

If you find yourself proposing FooFeatureManager / FooFlowCoordinator / FooGraphRegistry / FooTestHelper, first ask whether the problem is actually one of:

~~~text
State + Control -> Effect -> realization -> Observation
current truth -> captured at Send -> immutable receipt
stable element ID -> deeper semantic owner
cross-owner Effect realization
graph extraction / projection only
~~~

If yes, use the existing architecture shape and add only the missing edge/adapter/query.

## Exploration is allowed; accretion is not automatic

You may discover a useful new fractal while tracing the graph.

Capture it first as a candidate convergence:

~~~text
observed repeated pressure
existing primitives checked
proposed structural pattern
at least one concrete consumer
what duplication/manual work it removes
what maintenance it creates
why a local solution is insufficient
~~~

Only promote it to shared source after that pressure is real.

Current promising but uncommitted candidates:

~~~text
source relationship extractor
graph revision diff
edge -> deterministic test-manifest compiler
coverage-debt query
failing-route minimizer
resource-aware shard planner
~~~

Do not implement them merely because they are elegant.

## Minimum knowledge-share receipt before broad implementation

Return:

~~~text
1. Human outcome in your own words.
2. Exact current-main source refs read.
3. Exact active-candidate refs read separately.
4. Which judgment example your edge most resembles, and why.
5. Current graph node/edge or missing relationship.
6. Whether you are deriving source or using Roomba discovery.
7. Smallest rightful layer that needs change.
8. Existing primitive you will reuse.
9. Why no helper abstraction is required; or the repeated pressure that earns one.
10. One reverse-generated route and one forward consequence chain.
11. One thing still UNKNOWN/HELD that you will not guess.
12. Candidate innovation noticed, if any, kept separate unless earned.
~~~

This receipt is not ceremony; it proves orientation before source accretes.

## Terminal successor after the E2E system is earned

Do not create a foundational `Experience Relationship Graph` document during early graph formation merely because the concept is promising.

After A5/release-threshold work has established enough accepted graph behavior and proof, the terminal successor is:

~~~text
Experience Relationship Graph
-> distill the durable pattern from accepted source/proof
-> select the then-current rightful foundation/startup locations
-> expose it in VexLife-Prod and VexWork startup context
-> point back to project.vexlife-prod.end-to-end-tests / PR lineage as provenance
~~~

Do not pin the future file path now. Re-read current repository culture/source maps when that successor becomes actionable.

The final doc should be a durable entry point, not a transcript of this Project.

## No blanket mutation grant

This handoff authorizes read/discovery and the already-admitted VexBoard Screen Lens lane only. VexLife-Prod source changes, lifecycle actions, merges, and release effects still require their rightful current lane/authority.

<!-- [VXG RealForever][CLAUDE][VEXBOARD][VEXLIFE-PROD][E2E-DISCOVERY] -->
