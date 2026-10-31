# Track B — Blind judgment case: make VexWork truth publicly explorable

[VXG RealForever]

## Role

You are a **fresh planner** evaluating a historical work problem.

The evaluator already knows how this work was actually completed.

You must not see that completion path before your plan is locked.

The purpose is to judge your orientation and engineering judgment, not your ability to rediscover a
known commit from repository history.

## Blindness boundary

Historical VexWork snapshot:

~~~text
aacc5a9874a335a96e71e358aaa933d6f60d45e0
~~~

Treat that commit as **the present** for this exercise.

Do not inspect:

~~~text
later VexWork commits
later VexWork PRs
current Workgraph completion entries for this work
git history after the supplied base
search results for "public dashboard" / "work-dashboard"
provider comments describing the later solution
any evaluator comparison key
~~~

If you accidentally encounter a later accepted solution, stop and declare the trial contaminated.

## Before the historical work is introduced

First orient using only generic current orientation sources that do not reveal this case's completion:

~~~text
current Local Vex Operations posture / continuity / completion sources
current VexWork AGENTS.md
current VexWork docs/CULTURE.md
current Pink orientation walk / manifesto
~~~

Do not use current VexWork sources that reveal later public/UI architecture while doing the blind case.

Explicitly forbidden before the plan is locked:

~~~text
current VexWork README.md
current VexWork docs/foundation/INDEX.md
current public/workspace.json
current src/core/public-workspace.mjs
current index.html / workspace-reader.js as Human UI evidence
current completed Work entries for this case
~~~

The current foundation index is forbidden because it now names later Human UI / `public/workspace.json`
source and therefore leaks a post-historical solution coordinate.

The **outer handoff must not add broader current VexWork sources** beyond the pre-orientation allowlist in
this file. Blindness is end-to-end; an inner "do not peek" rule does not repair an outer source leak.

Perform the sequential orientation reflections before reading the work problem below.

## Historical source you may inspect

At exact ref:

~~~text
aacc5a9874a335a96e71e358aaa933d6f60d45e0
~~~

you may inspect only these VexWork paths initially:

~~~text
README.md
AGENTS.md
docs/CULTURE.md
docs/foundation/INDEX.md
docs/foundation/WORK-BOARD.md
docs/foundation/PARKING-LOT.md
projects/vexwork-foundation/project.json
projects/vexwork-foundation/workgraph.json
projects/vexwork-foundation/board.view.json
package.json
scripts/work-status.mjs
src/core/work-board.mjs
~~~

If your plan genuinely requires one additional **same-snapshot** source file, name exactly why before
reading it. Do not broaden into repository archaeology.

## Historical human pressure

At this point VexWork already owns canonical Workgraph truth, Project grouping, Work Board projection,
and a sibling Parking Lot projection.

The CLI can emit deterministic JSON for board, graph, and parking-lot views.

A human now wants **current VexWork work to be visibly explorable from a public surface** so people and
agents do not need to run the CLI or parse VexWork's internal source model just to see the useful work.

The public consumer may live elsewhere later, but the public view must not:

~~~text
make Vextreme another WorkState owner
make the public UI an effect-authority surface
publish private runtime state merely to be useful
collapse Parking Lot into Project membership
expose an unstable internal representation as a permanent public contract without reason
~~~

The work should preserve VexWork's existing meaning:

~~~text
one work truth owner
bounded projections
human simplicity / structural depth
proof follows the claim
~~~

## Your task

Form the work plan you would execute from this historical state.

Do **not** write code.

Do **not** search for how the historical team eventually solved it.

Decide:

- what source should own the public-read meaning;
- whether the public consumer should read raw Workgraph, existing projections, a new derived projection,
  runtime state, or something else;
- what information belongs in the public contract;
- how Parking Lot should appear without becoming Project membership;
- how currentness/drift should be handled;
- what deterministic proof is needed;
- what you would deliberately not build;
- what would count as complete.

## Required locked output

Before the evaluator shows you the accepted completion path, return:

~~~text
MY UNDERSTANDING OF THE HUMAN OUTCOME

CURRENT SOURCE / OWNERS I WOULD REUSE

MY PROPOSED ARCHITECTURE

EXACT SOURCE SURFACES I WOULD CHANGE OR ADD

PUBLIC CONTRACT I WOULD EXPOSE

CURRENTNESS / DRIFT STRATEGY

PROOF PLAN

WHAT I WOULD NOT BUILD

COMPLETION CONDITION

TOP 3 RISKS / ASSUMPTIONS
~~~

End with:

~~~text
BLIND PLAN LOCKED
~~~

After that line, do not revise the plan until the evaluator explicitly reveals the accepted completion
path and asks for comparison.

<!-- [VXG RealForever][PINK-ONBOARDING][TRACK-B][BLIND-JUDGMENT] -->
