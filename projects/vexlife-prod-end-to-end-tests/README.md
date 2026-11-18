# VexLife-Prod End-to-End Experience Validation

`[VXG RealForever]`

## Human outcome

Keep VexLife's **human pathways stable while the code is still moving**.

The project exists so a person or fresh AI can answer:

~~~text
What can I do from this State?
What choices are actually available now?
What does each choice mean?
Which Family/owner decides it?
What other Families or current truths can that choice affect?
What crosses a Send boundary and what waits for the next turn?
What loops can the person enter and leave?
Which meaningful permutations have been proven?
What did Vex actually receive/do?
What did the human actually see afterward?
Which branch is still untested or held?
~~~

The primary unit is a **human relationship journey**, not a function, endpoint, file, or screen.

## Why this is its own VexWork Project

VexLife-Prod is still evolving rapidly. Kotlin classes, stores, service routes, renderer structure and provider adapters may change while the intended experience remains stable.

~~~text
HUMAN EXPERIENCE CONTRACT
  relatively stable

CURRENT VEXARCHITECTURE RELATIONSHIPS
  may evolve as ownership becomes clearer

CURRENT IMPLEMENTATION
  expected to change frequently
~~~

The Project keeps those layers distinct and lets proof re-bind to newer implementation without redefining the human outcome after every refactor.

## Project boundary

~~~text
VexLife-Prod
  owns Product Families / State / Control / Act / Effect / Observation / Projection

Vextreme / VexArchitecture
  owns the architecture language / accepted relationship purpose

VexBoard / Screen Lens
  read-only perception of source-owned relationships

this Project
  owns work navigation, experience-journey intent, relationship/choice coverage questions,
  and proof topology

this Project
  != Product semantic owner
  != Screen Lens truth owner
  != second State machine
  != release authority
~~~

## Architecture attractors

Before forming new mechanics, ground in the two VexArchitecture source guides:

- https://vgong24.github.io/Vextreme/pages/vexarchitecture-first-stable-body.html
- https://vgong24.github.io/Vextreme/pages/vexarchitecture-live-demonstration.html

Pinned source snapshot used for this Project:

~~~text
vgong24/Vextreme main
1a0f161b4175e83c223e57642d08501004cdb9fd

pages/vexarchitecture-first-stable-body.html
blob 328e1fdaffd59ced8f06584d28d769b90dae9a5e

pages/vexarchitecture-live-demonstration.html
blob 03e2764ec120a189467292e79132114fba1b84bd
~~~

These pages are the design attractor, not another framework to re-encode locally.

Key judgment carried into this Project:

~~~text
Family owns product / semantic meaning.
Execution owns active custody.
Outside truth stays independently owned and returns through rightful reconciliation.
Partner is earned only when an independently-owned external participant exists.
Store/provider, Relay/convergence, chronology, construction/lifetime and presentation answer different questions.
provider acknowledgement != physical outcome != durable domain truth.
implementation placement and naming are evidence to inspect, never authority by themselves.
~~~

The Live Demonstration is especially important because it shows that ThemeMode, VexStream, VexMaps and Partner do **not** become one class template. What transfers is the ability to locate human intention, semantic ownership, outside truth, execution custody, convergence, durability and presentation.

That is the posture here too: **reuse the relationship shape; preserve rightful owners; do not normalize every feature into one implementation pattern.**

## Topology layers

1. **Human intention** — what the person is trying to accomplish.
2. **Experience State + lawful Controls** — what is true now and what choices are available.
3. **Semantic owner** — the Family/owner that decides the meaning.
4. **Relationship crossing** — what current truth reaches another owner or is captured at Send.
5. **Realization / outside truth** — runtime/provider/host behavior and observations.
6. **Projection + evidence** — what the human sees and what exact evidence proves the circuit.
7. **Execution class** — source, deterministic nervous-system, isolated service, live model, lifecycle, or release proof.

## Initial source census

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

Active candidate Families / owners already relevant to future journeys:

~~~text
#251 Context Profile + Vex Context
#310 VoiceInput + Local ASR model Family
#331 spoken-language / Composer-output / reply-script relationships
~~~

The machine-readable seed is `relationship-lattice.seed.json`. It is a **pinned projection seed**, not canonical Product meaning.

## Identity and relationship rule

Use existing Product identities wherever they already uniquely name the thing, but keep architectural roles distinct.

~~~text
elementRef   = surface address
pathwayRef   = current Screen Lens path projection
Control      = typed choice within one Family
Act          = State + Control relationship law
Effect       = requested realization
Observation  = actual outside truth interpreted back to State
Projection   = human-facing consequence
~~~

Do not mint `anchor.*` or `rel.*` aliases for those existing/source-addressable relationships.

One coherent map is formed by joining the coordinates into law/cross-owner rows.

~~~text
elementRef / pathwayRef / Family-Control ref
  = graph coordinate

E2E Project
  = maps intention + availability + relationships + journeys + proof onto that coordinate
~~~

Do not create a second feature-ID namespace just to make the graph queryable.

Journey IDs remain useful because a journey is a sequence across multiple coordinates.

The first explicit patient zero is the existing ContextShare element:

~~~text
element.vexlife-workspace.companion.conversation.context-share
~~~

whose current source behavior spans page-identity eligibility, context reading, optional Send capture, prompt receipt, invalidation and a fail-closed unlocated-page branch.

## The lattice, not a duplicated choice tree

The intended relationship shape is:

~~~text
Human journey
  -> current State
  -> lawful Controls
  -> chosen Control / provider choice
  -> Act / Effect or read
  -> outside realization / observation
  -> successor State
  -> cross-Family relationship
  -> projection/evidence
  -> next meaningful choice
~~~

One Product branch gets one source identity. Journeys only link to it.

~~~text
ONE BRANCH MEANING
-> ONE SOURCE-OWNED RELATIONSHIP
-> ZERO OR MORE JOURNEY COVERAGE LINKS

not

copy the same branch into every test journey
~~~

Likewise, locale/platform/model conditions are evidence configurations over one semantic journey, not new copies of the human journey.

## Android + Screen Lens source witnesses

Use current VexLife-Android as the closest concrete witness for stable IDs, semantic Screen registration, human journeys and crawler evidence.

~~~text
vgong24/VexLife-Android main
d857a92371555472e0303b18eadf353da2a868d6

architecture/elements/src/main/kotlin/com/vextreme/vexlife/android/elements/ScreenBlueprint.kt
  nested source structure -> stable element.<screen>... IDs

app/src/main/kotlin/com/vextreme/vexlife/android/screens/AppScreenBlueprint.kt
app/src/main/kotlin/com/vextreme/vexlife/android/screens/AppScreens.kt
  production Screen registration / semantic source

app/src/journeyTest/kotlin/com/vextreme/vexlife/android/testing/journey/VexJourney.kt
app/src/journeyTest/kotlin/com/vextreme/vexlife/android/testing/journey/catalog/Journeys.kt
  human-readable journey paths over stable production IDs

app/src/journeyTest/kotlin/com/vextreme/vexlife/android/testing/journey/VexJourneyCoverage.kt
  journey coverage against production registration

docs/foundation/JOURNEY-INSTRUMENTATION.md
docs/foundation/SCREEN-CRAWLER-EVIDENCE.md
app/src/journeyTest/kotlin/com/vextreme/vexlife/android/testing/crawler/VexScreenCrawlerConfig.kt
app/src/journeyTest/kotlin/com/vextreme/vexlife/android/testing/crawler/VexScreenCrawlerEvidenceIdentity.kt
app/src/androidTest/kotlin/com/vextreme/vexlife/android/testing/crawler/VexScreenCrawlerInstrumentedTest.kt
  functional journey + optional visual evidence multiplication
~~~

The important transfer is not Compose or Android instrumentation. It is:

~~~text
one stable source coordinate
-> one human-readable walk
-> one expected semantic history
-> coverage accounting
-> optional crawler evidence
~~~

That same idea now extends into the VexLife-Prod relationship graph and graph-derived E2E routes.

## Graph-derived pathways and tests

The graph is primary.

~~~text
source relationships
-> graph
-> selected pathway (branch-capable subgraph)
-> route (one concrete traversal)
-> journey (human scenario across routes)
-> generated deterministic test case
~~~

This enables edge-centered testing: select one graph edge, traverse backward to the human-visible Controls/elements and required State, then traverse forward to Effects, observations, successor State, cross-Family consequences and human Projection.

Current VexBoard already owns BoardJourney traversal, outgoing relationship choices, loop/motif analysis and Screen Lens queries. This Project should extend the source relationship input and test derivation rather than build another graph engine.


## Derive where possible; excavate only where necessary

The Project intentionally supports both directions:

~~~text
architecture complete enough
-> generate the map from source

architecture/projection incomplete
-> walk the Product once like a Roomba
-> capture candidate missing relationships
-> reconcile them back into rightful source
-> regenerate the map
~~~

The walk is never a second source of truth.

As VexArchitecture becomes more complete, the expected trend is:

~~~text
less manual discovery
more graph derivation
more route/test generation
~~~

A compact human-readable traversal may look like:

~~~text
<subject:user>
  -> <surface:settings>
  -> <control:reply-language>
  -> branch_routes[].select(...)
  -> <capture:next-send>
  -> <provider>
  -> <projection:Vex Context>
~~~

but every token must resolve back to the existing source graph.

## Cross-Family pressure

The interesting E2E failures are usually not inside one Family. They happen at crossings.

Examples already seeded:

- Memory Review -> semantic acceptance -> Memory provider selection -> prompt -> Vex Context.
- Models -> serving runtime -> canonical Companion turn.
- Private mode -> bounded private-gap truth -> later Person Context.
- Person reply language -> accepted Send -> Person Context -> provider -> Vex Context.
- VoiceInput -> existing Composer -> later human Send; Voice does not create a second Conversation.
- spoken microphone language != Composer output language != Vex reply language.
- Context Profile captured at Send -> fixed for that turn -> later profile change belongs to next Send.
- Diagnostics observes facts from rightful owners; it does not feed semantic authority back into them.

## Experience journeys

The first journey seed set includes:

~~~text
fresh install -> first real turn
existing Home -> restart -> next turn
15-turn Working Continuity rollover
30-turn depth/revisit
Memory Keep -> later use
historical Daily HELD -> accepted semantic Memory remains usable
model import -> use -> restart -> remove/redownload/forget
Preview update alert -> install/open -> continuity preserved
Private begin -> exchanges -> end -> ordinary Conversation resumes
Vision Engage -> selected scope -> Stop
diagnostics after a meaningful run
Context Profile A -> Send -> switch to B -> next Send
English reply -> Chinese reply -> historical receipt stays English
Chinese speech -> optional English Composer translation -> Chinese Vex reply
Windows entry -> canonical first turn (future-current)
~~~

Each journey is expected to expose State/Control availability, relationship crossings, proof class and uncovered branches.

## Permutations and loops

The lattice deliberately does **not** generate a Cartesian product of every option.

A permutation is earned only when source says the axes interact materially.

Useful axes include:

~~~text
current State
control availability
turn epoch
provider behavior
projection witness
platform
presentation locale
spoken language
Composer output
reply language/script
execution class
~~~

Examples of high-value loops:

- language change across turns while completed receipts remain immutable;
- Memory correction -> Keep -> prompt use -> later correction / Daily frontier shift;
- Private KEPT -> PRIVATE -> KEPT;
- model select -> runtime converge -> turn -> reselect;
- installed release -> newer release -> alert -> update -> current;
- Voice READY -> LISTENING -> STOPPING -> READY/failure;
- Context Profile A -> accepted turn A -> select B -> next accepted turn B.


## Fresh-instance front door

A fresh worker should orient in this order:

~~~text
README
-> RELATIONSHIP-LATTICE
-> relationship-lattice.seed.json
-> VexFamilyContract
-> Vision / MemoryReview / ContextShare source examples
-> existing VexBoard journey/query machinery
-> active candidates only after current-main semantics are grounded
~~~

The concrete examples are intentional judgment tests:
- Vision teaches Effect != observed successor State.
- Memory Review teaches cross-owner realization without Family collapse.
- ContextShare teaches stable element identity, conditional availability and fail-closed/projectability gaps.
- #251 teaches accepted-turn capture versus later current-state changes.
- Android Journey/ScreenBlueprint teaches stable production IDs + human walk authoring.
- VexBoard BoardJourney/query source teaches existing traversal mechanics.

See `CLAUDE-SCREEN-LENS-HANDOFF.md` for exact paths and the fresh-instance decision rules.

## Claude / Screen Lens relationship

Do **not** create a second Screen Lens ownership lane here.

Current VexWork already has a live recurring Screen Lens sync trajectory:

~~~text
#298  recurring VexArchitecture <-> VexBoard Screen Lens sync Project
#300  realization topology in Depth
#303  Direct Registration dependency classification
~~~

Claude's first simultaneous implementation should continue through that rightful VexBoard lane (or its current successor) and use this Project as the **experience/coverage consumer**.

For each newly discovered source branch/pathway Claude should return a bounded discovery record:

~~~text
source refs
human meaning
State(s)
lawful Controls
Act / Effect / observation / projection path
cross-Family edges
choice/loop pressure
candidate journey refs
disposition: CURRENT | ACTIVE_CANDIDATE | HELD | UNKNOWN
~~~

`CLAUDE-SCREEN-LENS-HANDOFF.md` carries the exact handoff.

## Traversal debt: clear what you touch, route around what you cannot yet clear

A graph route is only **cleared** when every meaningful coordinate needed to traverse/test it is stably addressable.

~~~text
meaningful control/state/projection exists
+ no stable source coordinate / element ID / relationship coordinate exists
-> infrastructure debt
-> route is not CLEARED yet
~~~

Do not silently walk past missing identity and leave the graph dependent on prose or DOM coincidence.

At the same time, one debt edge should not force the entire Product map to stop.

Use a frontier strategy:

~~~text
1. traverse already-addressable / source-clear routes first
2. build the initial graph + traversal/test tooling from those clean routes
3. whenever traversal hits missing identity/projectability:
     mark the exact frontier coordinate
     classify the debt
     stop only that dependent route
4. continue other independent cleared routes
5. let graph validation enumerate debt frontiers
6. any fresh instance can claim one frontier and repair the rightful source
7. regenerate graph; frontier disappears when alignment is real
~~~

Important:

~~~text
DEBT FRONTIER
!= hand-maintained second backlog of feature truth
~~~

Prefer deriving debt from the graph itself:

~~~text
human-visible/control relationship with no stable elementRef
Family Control with no manifestation binding
Effect with no realization edge
realization with no observation/reconciliation edge
State with no truthful Projection
Screen Lens pathway missing source-proven depth
journey edge with no deterministic action coordinate
~~~

Those become queryable traversal debt.

### Missing ID rule

If a meaningful Product manifestation needs to be selected, asserted, revisited or used as a graph endpoint and has no stable identity, **fix the rightful production identity first**.

Do not:

~~~text
CSS-selector around it
index into children
match visible text as identity
create a test-only alias
hide the gap in a helper
~~~

unless the source relationship is genuinely dynamic and already owns a stable runtime identity scheme.

### Why cleared routes first

Starting from clean routes reduces iterative burden:

~~~text
clean source routes
-> initial graph compiler
-> reverse/forward traversal
-> debt detector becomes real
-> remaining rough edges are surfaced automatically
-> parallel workers can repair one frontier at a time
~~~

This turns tech debt from something a human must remember into something the graph can expose.

## Hard-edge build discipline

When a route is difficult to explain or test, do not immediately introduce a helper class.

First classify the missing thing:

~~~text
A. semantic law missing?
   -> rightful Family / owner source may be incomplete.

B. source law exists, but graph cannot see it?
   -> extraction / projectability gap.

C. graph sees the relationship, but no implementation realizes it?
   -> realization / adapter / provider edge.

D. realization happens, but Product cannot re-observe truth?
   -> observation / reconciliation gap.

E. Product truth exists, but human cannot perceive it?
   -> Projection / Screen Lens / Vex Context gap.

F. route is truthful, but tests cannot drive it deterministically?
   -> test seam / route-manifest / fixture gap.

G. lived behavior is intentionally unavailable?
   -> HELD / limitation; keep it addressable instead of inventing success.
~~~

Only after this classification ask whether a new abstraction is needed.

### Architecture-attractor rule

The accepted VexArchitecture/VexBoard/VexLife patterns are the default attractor. Diverge only when a concrete source pressure cannot be represented truthfully by an existing rightful owner or shared primitive.

Before adding one, answer:

~~~text
What exact repeated failure does it remove?
Who consumes it?
Which existing source could own this instead?
Does it derive truth or duplicate truth?
Will it reduce future reading/maintenance?
Can it fail closed when source is incomplete?
Does it preserve existing IDs/ownership?
If deleted, what required correctness/proof is lost?
~~~

If the last answer is "nothing required," do not add it.

Prefer, in order:

~~~text
reuse existing source relationship
-> add missing source relationship to rightful owner
-> extend existing extractor/query
-> add a small local adapter
-> only then form a shared abstraction after repeated pressure
~~~

## Worked examples for judgment

### Example 1 — Vision: Effect is a request, not success

Source: `src/commonMain/kotlin/vexlife/vision/VexLifeVisionFamily.kt`

~~~text
READY + ENGAGE
-> Act(admittedState = null, Effect = EngageScope)
-> macOS/runtime picker
-> observe(...)
-> SELECTING | ENGAGED | HELD
-> DisplayState
~~~

Use this to reject helpers that collapse semantic State, runtime realization, and observed successor truth into one manager.

### Example 2 — Memory Review: one human choice crosses owners

Source: `src/commonMain/kotlin/vexlife/memory/VexLifeMemoryReviewFamily.kt`

~~~text
Pending(candidate) + KEEP(candidate)
-> Effect.Accept(candidate)
-> semantic acceptance / persistence owners
-> accepted semantic Memory becomes independently observable
-> later Memory selection may consume it
~~~

Use this to reject a mega Memory workflow helper that steals review, acceptance, Score, durable Memory, and prompt meaning from separate owners.

### Example 3 — Include this page: stable UI ID, conditional route, projection gap

Source neighborhood:

~~~text
VexLifeWorkspaceBlueprint.kt
VexLifeWebP1.kt
VexLifeWebP1RuntimeArtifacts.kt
DirectPromptContext.kt
VexLifeProdScreenLens.kt
~~~

Stable surface coordinate:

~~~text
element.vexlife-workspace.companion.conversation.context-share
~~~

Route:

~~~text
Product-owned navigation earns exact page identity
-> context eligible
-> ContextShare available
-> separate page-context read
-> browserContext ready
-> includePage true
-> next Send captures browserContext
-> DirectPromptContext receipt fingerprints exact context
~~~

Alternate route:

~~~text
embedded page navigates internally
-> exact new address is not observable
-> stale identity/context cleared
-> ContextShare unavailable
-> Send must not carry stale browserContext
~~~

Do not add a BrowserContext helper that guesses the current page. Either a rightful surface re-earns exact identity or the edge remains unavailable.

### Example 4 — complex cross-fractal case: Voice + language + turn capture + Vex Context

Active candidate pressure: #251, #310, #331.

~~~text
<subject:user>
  -> spoken-language = zh
  -> composer-output = TRANSLATE_TO_ENGLISH
  -> reply-language = zh-Hans
  -> Voice START
  -> speak Chinese
  -> Composer contains English translation
  -> Send
  -> provider input contains:
       Conversation.request = English text
       PersonContext.replyLanguage = zh-Hans
  -> Vex replies in Simplified Chinese
  -> Vex Context shows what this completed turn actually received
~~~

Then change reply-language to zh-Hant. The next Send captures zh-Hant while the prior zh-Hans receipt remains unchanged.

This teaches that spoken language, editable request language, reply language, VoiceInput, Conversation, prompt capture, and Vex Context remain independent owners that can converge without earning a mega-Family.

## Reusable innovation, but only when earned

Promising fractals already suggested by current pressure:

~~~text
source relationship extractor
graph revision diff
edge-to-test manifest compiler
coverage debt query
failing-route minimizer
resource-aware shard planner
~~~

These are candidate tools, not commitments.

An innovation earns source only when it has a concrete consumer now, reuses source truth rather than copies it, removes repeated manual work, fails closed, costs less to maintain than the problem it removes, and no existing VexWork/VexBoard/VexLife primitive already answers the question.

The goal is not maximum abstraction. The goal is maximum recoverability and reuse per unit of machinery.

## Execution classes

The same journey may have several proof realizations:

~~~text
PURE / SOURCE
DETERMINISTIC NERVOUS SYSTEM
ISOLATED TEST SERVICE
LIVE MODEL / BEHAVIOR
LIVED PRODUCT LIFECYCLE
RELEASE / PUBLICATION
~~~

Deterministic proof verifies VexLife's relationship handling even when the real model would not naturally choose an interesting route. Live-model proof separately verifies interpretation/behavior.

## Current Work decomposition

~~~text
A0  Experience-contract + topology foundation               RUNNING
A1  Screen Lens choice-discovery bridge                     READY
A2  Journey / branch coverage projection                    WAITING_DEPENDENCIES
A3  Deterministic nervous-system shards                      WAITING_DEPENDENCIES
A4  Live-model + lived-lifecycle validation                  WAITING_DEPENDENCIES
A5  Release-candidate experience threshold                  WAITING_DEPENDENCIES
~~~

A1 may proceed concurrently with A0 because Screen Lens source perception and experience-contract formation answer different questions. A2 converges them.

## Completion target

The Project is successful when a release candidate can be navigated from human intention to exact source/evidence and the system can say, without hand reconstruction:

~~~text
which journeys are required now
which States / Controls / cross-Family relationships they cover
which branches are untested
which tests are deterministic versus model-behavior
which cases can run in parallel on one Mac
which lived host/release cases remain serial
what Vex actually received
what the human actually saw
and which current implementation realizes each stable experience contract
~~~

<!-- [VXG RealForever][VEXWORK][VEXLIFE-PROD][END-TO-END-TESTS][PROJECT] -->
