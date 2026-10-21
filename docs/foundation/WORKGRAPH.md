# Workgraph foundation

`[VXG RealForever]`

## Purpose

The Workgraph is the canonical portable representation of work relationships and lifecycle truth in VexWork. It is not owned by one Project; Projects select bounded subgraphs from it.

It answers:

```text
WHAT WORK EXISTS ACROSS PROJECTS AND REPOSITORIES?
  Workgraph root work items + descendants

WHAT ARE WE TRYING TO DO IN ONE PROJECT?
  Project rootWorkRefs[] -> bounded Workgraph subgraph

WHAT WORK EXISTS?
  Work items

WHAT KIND OF WORK IS THIS?
  workClass

WHAT DEPENDS ON WHAT?
  dependencyRefs

WHAT CONTAINS WHAT?
  parentWorkRefOrNull + child relationships derived from it

WHICH REPOSITORIES DOES IT TOUCH?
  repositoryRefs

HOW DID THIS WORK ENTER / WHERE SHOULD IT ROUTE NEXT?
  formationProcessRefOrNull + nextProcessRefs[]

IS IT INTENTIONALLY DEFERRED?
  workDisposition = ACTIVE | PARKED

WHAT IS TRUE NOW?
  WorkState + accepted transition history

WHAT EVIDENCE / SOURCE EXPLAINS IT?
  sourceRefs
```

## Portable lineage

VexLife's Intent Workgraph established a 21-state lifecycle while solving a real product trajectory. VexWork retains those state names initially so existing VexLife Project/Board work can migrate without translating away meaningful distinctions.

VexWork does **not** copy VexLife's intent/runtime/effect authority contracts wholesale. The portable Workgraph is narrower: work identity, relationships, lifecycle, work disposition, explicit authority/effect disposition, repositories, process routes, sources, and transitions. VexWork also removes the predecessor assumption that one Workgraph must equal one Project.

## Work behavior grammar

The recognition grammar is:

```text
WorkControl + CURRENT WorkState
-> WorkAct

CURRENT WorkState + WorkAct
-> WorkEffect + admitted WorkState
```

The initial implementation exposes transition behavior rather than a full effect executor.

```text
REQUEST_TRANSITION
-> validate current state
-> validate allowed next state
-> form immutable transition
-> derive next Workgraph
```

Provider mutations, repository writes, deployment, model effects, and other external effects remain outside this foundation.


Stored transition history is part of lifecycle truth, not decorative provenance. Loading a Workgraph therefore fails closed when:

```text
transitionRef is reused
priorState -> nextState is not an allowed lifecycle edge
one Work item's stored transition chain is discontinuous
latest stored nextState disagrees with the Work item's current state
```

A Work item may legitimately have no stored transition history in a source-managed snapshot. Once history is present for that Work item, the stored chain must be internally lawful and converge on current WorkState.

Any behavior that derives new Workgraph lifecycle truth must first admit the complete supplied Workgraph through the same semantic validation boundary. A valid `semanticFingerprint` proves value identity; it does not substitute for lifecycle, relationship, or history validation.

```text
SEMANTIC_FINGERPRINT_VALID != WORKGRAPH_SEMANTICALLY_VALID
STATE_CHANGE_ENTRY -> COMPLETE_WORKGRAPH_VALIDATION -> EXACT_CURRENT_CHECKS -> DERIVE_NEXT_TRUTH
```

## Work classes

The initial registry uses a deliberately small set:

```text
POTENTIAL  remembered possibility; no implementation authority by implication
OUTCOME    human outcome / milestone-like result
TASK       bounded work intended to advance an outcome
DEFECT     observed undesired behavior requiring investigation/repair
```

New classes should be added only when they answer a recurring question not represented by the existing set.

## Project membership and parking are separate

A Work item may exist without being in any Project. `PARKED` is an intentional work disposition, not a lifecycle terminal state.

```text
WORK_ITEM != PROJECT_MEMBERSHIP
WORK_DISPOSITION != WORK_STATE
PARKED != REJECTED
PARKED != BLOCKED
PARKED != AUTHORITY
```

## State and authority are separate

A work item can be `READY` while lacking implementation authority. A captured potential can be durable while granting no effects.

```text
WORK_STATE != AUTHORITY
WORK_CLASS != AUTHORITY
ASSIGNMENT != AUTHORITY
BOARD_POSITION != AUTHORITY
```

The initial portable dispositions are:

```text
NO_AUTHORITY | AUTHORIZED_BOUNDED | DENIED | HELD_UNKNOWN
NO_EFFECTS | EFFECTS_BOUND | DENIED | HELD_UNKNOWN
```

## Semantic identity

VexWork uses deterministic SHA-256 semantic fingerprints over canonical JSON values. The fingerprint is evidence of object identity, not a signer identity and not external currentness.

## Currentness

This first foundation validates source-managed Workgraphs in memory. A runtime snapshot/CURRENT-pointer owner is intentionally held rather than improvised into Git commits.

```text
VALID_WORKGRAPH != RUNTIME_CURRENT_WORKGRAPH
SOURCE_FILE_NEWER != STRONGER_TRUTH
```

<!-- [VXG RealForever][VEXWORK][FOUNDATION][WORKGRAPH] -->
