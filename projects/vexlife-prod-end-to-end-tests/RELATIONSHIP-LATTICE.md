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

## Source seed

`relationship-lattice.seed.json` contains the current pinned anchors, journey seeds, loops and active-candidate pressure. It is deliberately disposable/regenerable as Product source changes.

<!-- [VXG RealForever][VEXLIFE-PROD][E2E][RELATIONSHIP-LATTICE] -->
