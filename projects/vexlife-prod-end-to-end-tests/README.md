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
