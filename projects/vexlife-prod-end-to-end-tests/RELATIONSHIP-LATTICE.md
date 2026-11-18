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

## Source seed

`relationship-lattice.seed.json` contains the current pinned anchors, journey seeds, loops and active-candidate pressure. It is deliberately disposable/regenerable as Product source changes.

<!-- [VXG RealForever][VEXLIFE-PROD][E2E][RELATIONSHIP-LATTICE] -->
