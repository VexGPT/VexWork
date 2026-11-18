# Relationship Lattice — VexLife-Prod E2E

`[VXG RealForever]`

## Question

How do we revisit VexLife as a **choice lattice** instead of a pile of feature tests, while keeping Product source as the owner of meaning?

## Lattice model

~~~text
human intention
   |
   v
current State ---- lawful Controls
   |                    |
   +---- chosen --------+
             |
             v
        semantic Act
             |
       admitted Effect/read
             |
             v
     outside realization
             |
        Observation
             |
             v
       successor State
             |
       +-----+-------------------+
       |                         |
       v                         v
human Projection          cross-Family effect
                                 |
                                 v
                          next State / next Send
~~~

The graph is a lattice because a human choice can participate in more than one later relationship, and several independent current truths can converge at a Send boundary without becoming one owner.

## Three kinds of edge

1. **Within-owner law** — State/Control/Act/Effect relationships owned by one Family.
2. **Cross-owner relationship** — one owner's current/accepted truth is consumed by another rightful owner.
3. **Projection/evidence edge** — Screen Lens, Vex Context, diagnostics or another human view makes already-owned truth perceivable.

Do not turn category 2 or 3 into a new Family merely to draw the graph.

## Turn capture is a first-class boundary

Many important permutations depend on *when* a change happens:

~~~text
current setting before Send
-> accepted turn captures it
-> in-flight turn stays bound
-> current setting changes later
-> prior completed turn remains historical truth
-> next Send captures the new value
~~~

This is the bridge for reply language, Context Profile, current Memory availability, model/runtime identity and other mutable current relationships.

## Choice-tree discovery

For every source Family/owner, Screen Lens/Claude excavation asks:

~~~text
What States can source actually produce?
What Controls are lawful in each State?
What does an accepted Control admit?
What outside fact realizes or blocks it?
What successor State can be re-observed?
What other owner consumes the result?
What human surface projects it?
What loops return to an earlier State?
What branch is HELD/UNKNOWN instead of guessed?
~~~

## Cross-Family discovery questions

At every boundary, ask:

~~~text
Does this relationship change another Family's available Controls?
Does it only change presentation?
Does it affect the current in-flight turn or only the next turn?
Does it change durable Home truth or only browser/session state?
Does it change the request text, the Person Context, the model/runtime, Memory, or capability reach?
Can the consequence be reversed?
Can two independent settings coexist without collapsing?
~~~

## Permutation discipline

Do not generate every mathematical combination.

Generate a case when at least one is true:

- two current states materially affect one accepted human action;
- a cross-Family edge changes lawful controls or provider input;
- order matters (A then B differs from B then A);
- a loop can leak stale state;
- an in-flight/current/history boundary can be confused;
- a held/failure branch changes what the human may do;
- two representations can collapse distinct meaning (for example spoken Chinese vs Simplified/Traditional reply script).

## One coherent map: coordinates and relationship rows

The source roles are different; do not make them peer feature IDs.

~~~text
elementRef
  where a current UI manifestation can be found/clicked

pathwayRef
  a Screen Lens projection of one current interaction path

Family / State / Control / Effect source
  semantic vocabulary and law

Act
  pure relationship row:
  current State + Control -> admitted State? + Effect?

Observation
  outside/runtime truth interpreted back into actual Family State

Projection
  what the human is lawfully shown from that State
~~~

`Control` is close to human intention **inside one Family**, but it is not enough by itself: the same Control may be lawful in one State and unavailable in another.

`Effect` is what the admitted Act asks the realization layer to do. It is not proof that the world changed, and it does not always imply an immediate Family State change.

Example from current source:

~~~text
VexLifeVisionFamily

READY + ENGAGE
-> Act(
     admittedState = none,
     Effect.EngageScope
   )
-> macOS/runtime realization
-> observe(...)
-> SELECTING / ENGAGED / HELD
-> DisplayState
~~~

Memory Review makes the distinction even clearer:

~~~text
Pending(candidate) + KEEP
-> Effect.Accept(candidate)
-> no immediate admitted MemoryReview State
-> semantic-acceptance/persistence owners realize their own effects
-> later review + current Memory truth are re-observed independently
~~~

So the lattice stores **relationship rows over existing coordinates** rather than inventing `rel.*` identities.

Cross-owner edges likewise use exact source endpoints plus a relationship kind/evidence. A new ID is earned only for a genuinely new object such as a human journey or VexWork Work item.

## Reuse existing IDs; map intention onto them

Do not mint a second feature ID when Product source already has a unique coordinate.

~~~text
existing elementRef / pathwayRef / Family-Control ref
  -> human intention
  -> availability predicates
  -> owner/cross-owner relationships
  -> journeys
  -> loops
  -> proof
  -> incomplete / held / unknown edges
~~~

Example:

~~~text
element.vexlife-workspace.companion.conversation.context-share
  meaning: let this exact current page shape the next Vex turn when lawful

pathway.vexlife-prod.local.companion.conversation.context-share
  current Screen Lens projection for that control

pathway.vexlife-prod.conversation.send
  later turn path that may carry the exact included browserContext
~~~

A journey gets its own ID because it is a walk through several existing coordinates, not another name for the feature.

## Visible-but-unavailable is still part of the graph

The screenshot case is a useful patient zero:

~~~text
known page identity
-> context eligible
-> Include this page available
-> read context
-> ready / included
-> Send may carry browserContext

unexpected internal cross-origin navigation
-> exact new address not observable from this web-hosted presentation
-> stale address/context cleared
-> Current address unavailable
-> Include this page disabled
~~~

That is currently a fail-closed limitation, not automatically a defect.

The graph should keep the same existing element/pathway IDs and attach the limitation/investigation to them. If a future browser/provider route can lawfully re-observe exact page identity, the relationship mapping evolves while the existing human coordinate remains queryable.

## Graph first; pathways and tests are derived

The relationship graph is the reusable source for navigation and test generation.

~~~text
GRAPH
  all currently projectable source coordinates + typed relationships

PATHWAY
  a selected branch-capable subgraph answering one human/architecture question

ROUTE
  one concrete traversal through a pathway after State/guard choices are fixed

JOURNEY
  a human scenario that may traverse several routes over time

TEST CASE
  one route + fixture/preconditions + actions + assertions + execution class
~~~

A `pathwayRef` is therefore useful as a **derived projection handle** for VexBoard/query/navigation. It is not another semantic owner. Existing Screen Lens pathway refs can remain compatibility/read coordinates while the long-term direction is to derive their membership from the relationship graph.

### Graph nodes

Prefer existing coordinates:

~~~text
Family / owner symbol
State ref or exact State shape
Control ref
Effect source symbol
outside realization / observation coordinate
Projection coordinate
elementRef
existing provider/runtime/store coordinate
~~~

### Graph edges

Useful relationship kinds include:

~~~text
OFFERS
  State -> Control

MANIFESTS
  elementRef -> Control

REQUESTS_EFFECT
  Control -> Effect
  with required/current State predicate carried on the edge

ADMITS_STATE
  Control -> immediate admitted State
  when the Family Act actually admits one

REALIZED_BY
  Effect -> runtime/provider/owner

OBSERVES_AS
  realization/observation -> State

PROJECTS_TO
  State -> DisplayState / elementRef

CONSUMED_BY
  one owner/current truth -> another owner

CAPTURED_AT_SEND
  mutable current truth -> exact accepted-turn context

RETURNS_TO
  outside result -> rightful semantic owner
~~~

The current State predicate prevents `Control -> Effect` from pretending the Control means the same thing in every State.

### Branching pathway versus one route

Example:

~~~text
Vision pathway

READY
  -> OFFERS ENGAGE
       -> REQUESTS_EFFECT EngageScope
            -> macOS/runtime
                 -> OBSERVES_AS SELECTING
                 -> OBSERVES_AS ENGAGED
                 -> OBSERVES_AS HELD

ENGAGED
  -> OFFERS STOP
       -> REQUESTS_EFFECT StopScope
            -> runtime
                 -> OBSERVES_AS READY
                 -> OBSERVES_AS HELD
~~~

The **pathway** is the whole branch-capable subgraph. A **route** is one concrete walk, for example:

~~~text
READY -> ENGAGE -> EngageScope -> picker -> ENGAGED
~~~

or:

~~~text
READY -> ENGAGE -> EngageScope -> picker -> HELD
~~~

## Edge-centered reverse/forward test generation

Any node or edge should be selectable as a test target.

Given one target edge, derive:

~~~text
reverse traversal
  target edge
  <- prerequisite State / source truth
  <- lawful Control
  <- human-visible elementRef(s)
  <- fixture/setup coordinates needed to make that State true

forward traversal
  target edge
  -> Effect / realization
  -> observation
  -> successor State
  -> cross-owner consequences
  -> Projection / receipt / durable evidence
~~~

This lets a test generator answer:

~~~text
How can a human reach this edge?
What must be true before it is reachable?
What exact thing should be clicked/typed/selected?
What consequences should be asserted afterward?
What sibling routes branch from the same point?
What prior nodes can reach this node?
What later nodes become reachable from it?
~~~

### Example: Include this page

Select the edge:

~~~text
browser page context included
-> CAPTURED_AT_SEND
-> DirectPromptContext.BrowserContext
~~~

Reverse traversal can recover:

~~~text
eligible exact page identity
<- Product-owned navigation
<- context-share available
<- element.vexlife-workspace.companion.conversation.context-share
~~~

Forward traversal can recover:

~~~text
DirectPromptContext receipt
-> provider request contains exact browser context
-> completed turn
-> Vex Context / context receipt projection
~~~

The unlocated-page branch is another route from the same neighborhood:

~~~text
unexpected embedded navigation
-> page identity unknown
-> stale context cleared
-> ContextShare unavailable
-> Send must not carry stale browserContext
~~~

## Graph-derived deterministic tests

The desired end state is not thousands of hand-authored test methods.

~~~text
source / Screen Lens / Family extraction
-> normalized relationship graph
-> route queries
-> deterministic test-case manifests
-> parameterized test runner
-> exact result/evidence
~~~

The test generator may be dynamic while the result is deterministic: the same pinned source graph and route-selection policy must produce the same case manifest.

A generated case should contain at least:

~~~text
target node/edge coordinates
route relationship coordinates
preconditions / fixture changes
human actions + elementRefs
scripted provider behavior when needed
expected State / Control availability
expected Effects / observations
expected cross-owner consequences
expected Projection / receipts
execution class + resource claims
source fingerprint
~~~

This makes coverage graph-shaped:

~~~text
known source edges
- covered edges
- intentionally held edges
- active-candidate edges
= addressable coverage debt
~~~

and allows tests to be regenerated when implementation coordinates change while stable human journeys and semantic relationships remain recognizable.

## Existing VexBoard machinery to reuse

Current VexWork already has useful traversal primitives:

~~~text
src/shared/vexboard-journey.mjs
  BoardJourney
  journeyChoices()
  relationship traversal / back / revisit

src/shared/vexboard-journey-pathway-analysis.mjs
  loop/motif discovery over journey relationship walks

src/shared/vexboard-screen-lens-query.mjs
  read-only element/pathway/source/dependency queries
~~~

So the next implementation pressure is **richer VexLife relationship extraction + route/test derivation**, not a second graph engine.

## Source seed

`relationship-lattice.seed.json` contains the current pinned anchors, journey seeds, loops and active-candidate pressure. It is deliberately disposable/regenerable as Product source changes.

<!-- [VXG RealForever][VEXLIFE-PROD][E2E][RELATIONSHIP-LATTICE] -->
