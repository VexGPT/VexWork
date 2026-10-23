# Project Planning foundation

`[VXG RealForever]`

## Human question

How can a person or agent plan an iteration, place Project work into it, share an order or WIP policy, and preserve that planning across restart **without turning planning into another owner of WorkState**?

The portable answer is:

```text
CURRENT Project + Workgraph membership
        +
Project planning transaction
        ↓
append-only planning event
        ↓
CURRENT planning snapshot
        ↓
private planning runtime lineage
```

Planning truth remains separate from lifecycle truth.

## Permanent distinctions

```text
PROJECT_PLANNING != WORKGRAPH
ITERATION_MEMBERSHIP != WORK_STATE
SHARED_ORDER != LIFECYCLE_ORDER
WIP_POLICY != EXECUTION_AUTHORITY
BOARD_DRAG != DIRECT_MUTATION
PLANNING_EVENT != PROVIDER_EVENT
ENDS_AT_REACHED != ITERATION_CLOSED
CARRY_FORWARD != HISTORY_REWRITE
```

The accepted predecessor is VexLife ToCompletion P0B-B03 / PR #909. VexWork independently implements only the portable work-management semantics; VexLife runtime/product ownership is not imported.

## Event vocabulary

`blueprint/project-planning-registry.json` owns six initial planning event classes:

```text
ITERATION_DEFINED
ITERATION_CLOSED
ITERATION_MEMBERSHIP_SET
SHARED_ORDER_SET
WIP_POLICY_SET
VIEW_SELECTED
```

`src/core/project-planning.mjs` validates and applies those events.

Every transaction binds:

```text
projectRef
expected Project-planning context fingerprint
expected planning snapshot fingerprint or null
event identity + class + typed payload
actor/source/time
```

The context fingerprint is derived from stable Project membership plus the currently admitted Board lanes and Project view refs. A well-formed stale fingerprint is valid input but fails exact-current application.

## Iterations

An iteration is explicitly defined with a start/end interval. Time passing does not close it.

Closure is an explicit event and freezes the iteration's then-current membership into `finalWorkRefs`.

After closure:

- the frozen final membership is not rewritten;
- new membership for that closed iteration is rejected;
- unfinished Work may be placed into a later iteration without erasing history.

## Shared order, WIP and selected view

Shared order is one explicit planning order for a named scope. It does not change lifecycle or dependency truth.

WIP policy stores a positive limit for one known Work Board lane. It may be rendered or evaluated by later consumers; it does not automatically block or transition Work.

Selected view records planning preference only.

## Durable planning currentness

`src/core/project-planning-runtime.mjs` owns optional private persistence under one caller-supplied canonical store root:

```text
<storeRoot>/project-planning/<project-address>/
  events/
  snapshots/
  pointers/
  writer.lock
```

The runtime provides:

- immutable content-addressed events and snapshots;
- atomically published immutable pointer records;
- CURRENT derived from the unique retained pointer-lineage tip;
- full retained pointer/snapshot/event causal validation on read;
- one exclusive writer lease;
- exact expected-pointer CAS under the writer lease;
- explicit exact-digest abandoned-writer recovery.

```text
EXPECTED_POINTER != CURRENT_POINTER -> REJECT BEFORE MUTATION
ABANDONED_WRITER -> EXPLICIT EXACT-DIGEST RECOVERY
ACTIVE_OR_UNVERIFIABLE_WRITER -> CONFLICT
```

This runtime mutates only the selected private planning store. It never mutates Workgraph or a provider.

## Authority boundary

Planning does not grant lifecycle authority.

```text
planningMutationPerformed may be true
workgraphMutationPerformed = false
providerMutationPerformed = false
```

A future planning UI may form a separate typed Work transition request, but canonical Workgraph transition admission remains owned by Workgraph behavior / runtime and any applicable Human Transition Handshake.

## Proof

The focused deterministic proof is:

```text
test/project-planning.test.mjs
test/project-planning-runtime.test.mjs
```

It must cover at least:

- all six event classes;
- explicit close freezing membership;
- closed-iteration mutation rejection;
- foreign Work/lane/view rejection;
- exact context + snapshot currentness;
- causal event sequence/fingerprints;
- restart persistence;
- stale pointer rejection;
- full retained-lineage validation;
- active writer protection;
- exact abandoned-writer recovery;
- zero Workgraph/provider mutation.

<!-- [VXG RealForever][VEXWORK][FOUNDATION][PROJECT-PLANNING] -->
