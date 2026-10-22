# Workgraph Composition

`[VXG RealForever]`

## Human question

How can independent work trajectories author VexWork truth without routinely colliding on one aggregate source file while VexWork still has exactly **one canonical Workgraph**?

The first live pressure was not theoretical. Independent VexStream Mobile Library, VexLife ToCompletion, VexLife Blueprint Source of Truth, Foundation, and Operational Console/Terrain work all carried different semantic meaning while repeatedly touching:

```text
workgraphs/public.json
public/workspace.json
test/workgraph.test.mjs
```

That is physical source contention, not evidence that those work trajectories need one author.

## Permanent distinction

```text
ONE_SEMANTIC_WORKGRAPH != ONE_AUTHORED_FILE
WORKGRAPH_SEGMENT != WORKGRAPH
SEGMENT_OWNERSHIP != PROJECT_MEMBERSHIP
SEGMENT != EFFECT_AUTHORITY
COMPOSED_GRAPH != SECOND_LIFECYCLE
```

A segment is an authoring membrane for one locally contained work family. Composition produces the ordinary `vexwork.workgraph/v1` value and then delegates final admission to the existing Workgraph validator.

## First contract

`src/core/workgraph-composition.mjs` defines:

```text
vexwork.workgraph-composition/v1
vexwork.workgraph-segment/v1
vexwork.workgraph-composition-result/v1
```

The relationship is:

```text
work-family segment A
work-family segment B
work-family segment C
        │
        ▼
deterministic composition
        │
        ▼
createWorkgraph(...)
        │
        ▼
ONE canonical Workgraph
```

The composition layer does not weaken Workgraph validation.

## Segment ownership rules

Each WorkRef belongs to exactly one segment.

Containment remains local to that segment:

```text
segment A
  outcome
    child task
```

A child may not name a parent owned by another segment. This keeps one contained work family from being physically split across multiple writers.

Dependencies may cross segments:

```text
segment A / task
  DEPENDS_ON
segment B / task
```

That relationship is validated only after the whole graph is composed.

Transition history stays with the segment that owns the Work item. A segment cannot append lifecycle events for another segment's WorkRef.

## Determinism

Segment input order is not semantic.

Composition therefore:

- sorts Work items by `workRef`;
- groups transition histories by `workRef` while preserving each Work item's local transition order;
- derives the exact global root set from parentless Work items;
- unions/sorts source refs;
- delegates parent/dependency existence, cycle detection, transition legality, history continuity and latest-state agreement to `createWorkgraph(...)`.

Equivalent segments supplied in different order produce the same Workgraph semantic fingerprint.

## What this does not do yet

This contract deliberately does **not** migrate `workgraphs/public.json`, change Project Registry paths, add a distributed writer, change runtime CURRENT semantics, or make generated public projections asynchronous.

Those are adoption questions.

The next earned migration should use one real work family as patient zero and prove:

```text
segment authoring
-> composition
-> exact existing Workgraph meaning
-> existing public workspace/dashboard readers
```

without forcing unrelated work-family branches to edit the same authored segment.

## Operational posture during migration

Until adoption is complete:

```text
product/source work may continue when its real authority/dependencies permit
VexWork reconciliation remains a separate Flows concern
aggregate-file contention is not a product blocker
traceability lag is explicit rather than disguised as provider truth
```

## Non-collapse

```text
SOURCE_SEGMENTATION != MULTIPLE_WORKGRAPHS
SOURCE_SEGMENTATION != MULTIPLE_CURRENT_POINTERS
SOURCE_SEGMENTATION != PROJECT_SHARDING
SOURCE_SEGMENTATION != DISTRIBUTED_LOCKING
SOURCE_SEGMENTATION != AUTOMATIC_PROVIDER_RECONCILIATION
```

<!-- [VXG RealForever][VEXWORK][FOUNDATION][WORKGRAPH-COMPOSITION] -->
