# Close and succeed a VexWork Project

`[VXG RealForever]`

Process ref: `process.vexwork.close-and-succeed-project`

## Human situation

A Project was useful when formed, but the product/work evolved. Some Work is complete, some old
assumptions are no longer owed, and some still-real work now belongs to a newer scope.

Close the old Project without deleting history, pretending unfinished work was completed, or keeping
the predecessor scope open forever merely because later work grew from it.

## Process

```text
1. GROUND
   current Project + Workgraph neighborhood
   current target-repository source
   current related/successor Projects
   current provider/proof evidence only where material

2. CLASSIFY EVERY NONTERMINAL WORK ITEM
   FINISH_HERE
   CARRY_TO_EXISTING_SCOPE
   CARRY_TO_NEW_SCOPE
   RETIRE_OLD_SCOPE
   HOLD_UNKNOWN

   These are process dispositions, not new WorkState values.

3. SUCCESSOR FIRST
   create/reuse successor Work before predecessor cancellation
   successor sourceRefs include predecessor Project + Work refs
   predecessor closeout transition names successor Project + Work refs

4. CLOSE PREDECESSOR ITEMS TRUTHFULLY
   satisfied claim -> lawful verification/completion path
   moved/obsolete old scope -> CANCELLED with exact reason/successor refs
   unknown -> hold; do not force root closure

   SUPERSEDED is not a shortcut for unfinished Work.

5. CLOSE ROOT OUTCOME
   if every descendant is Done/Archive and the original human outcome was achieved:
     current root -> VERIFYING -> COMPLETED

   if the original human outcome itself was abandoned:
     CANCELLED

6. PRESERVE THE STORY
   currentize the existing Project entry source with the smallest useful successor map
   do not delete completed Work/proofs/history just to make the board look clean

7. REGENERATE + REVIEW
   source -> repository-owned Project Registry / Workgraph / workspace generation
   -> deterministic review -> merge/currentness judgment
```

## Permanent boundaries

```text
PROJECT_CLOSEOUT != DELETE_HISTORY
OPEN_OLD_WORK != DUTY_TO IMPLEMENT EVERY OLD ASSUMPTION
CANCELLED_IN_PREDECESSOR_SCOPE != SUCCESSOR_WORK CANCELLED
CARRY_FORWARD != DUPLICATE WORK
SUCCESSOR_PROJECT != CHILD PROJECT
SCOPE_CREEP != KEEP_PREDECESSOR ROOT RUNNING FOREVER
COMPLETED ROOT != EVERY LATER IDEA IMPLEMENTED
SUCCESSOR MUST EXIST BEFORE PREDECESSOR CARRY-FORWARD CANCELLATION
UNKNOWN != STALE != IRRELEVANT
```

Patient zero: `project.vexlife.new-beginnings`.

<!-- [VXG RealForever][VEXWORK][PROCESS][PROJECT-CLOSEOUT][SUCCESSION] -->
