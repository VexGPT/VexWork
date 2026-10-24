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
vexwork.workgraph-composition/v2
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

### Migration-compatible ordering

The accepted source-managed Workgraph predates composition and its semantic fingerprint currently preserves array order for items, roots, transitions and source refs. Reordering those arrays during source segmentation would therefore manufacture a new whole-graph fingerprint even when no work meaning changed.

Composition v2 adds an optional `compatibilityOrder`:

```json
{
  "itemWorkRefs": ["..."],
  "transitionRefs": ["..."],
  "rootWorkRefs": ["..."],
  "sourceRefs": ["..."]
}
```

Listed present refs retain the named legacy order. New refs not listed are appended in deterministic fallback order, so the compatibility map does not need to grow for ordinary future work.

For v2, `composition.sourceRefs` are the exact canonical Workgraph source refs. Segment `sourceRefs` remain composition-layer provenance and are not silently injected into Workgraph identity.

```text
SOURCE_SEGMENT_PROVENANCE != WORKGRAPH_SOURCE_REFS
FILE_SPLIT != WORKGRAPH_CURRENTNESS_CHANGE
```

v1 behavior remains unchanged and rejects `compatibilityOrder`.

## Source-authoring adoption

The shadow patient zero has now earned the ownership flip.

The canonical authored source is:

```text
workgraphs/composition.json
workgraphs/segments/*.json
```

and the checked-in aggregate is generated:

```text
source segments
        +
composition v2 compatibility order
        ↓
scripts/build-public-workgraph.mjs
        ↓
workgraphs/public.json
        ↓
public workspace / dashboard / other readers
```

`workgraphs/public.json` remains the one canonical portable Workgraph value consumed by existing readers. What changed is **where authors write**, not the semantic owner or runtime contract.

Current source-segment membership is discovered from `workgraphs/segments/*.json` and validated against the composition source. The directory plus `workgraphs/composition.json` are canonical for current membership; prose must not freeze a segment count or become a second registry.

Containment is local to one segment. Dependencies may cross segments. The first accepted cross-segment dependency is the parked historical backfill depending on the completed Foundation public dashboard.

The compatibility order preserves the exact pre-migration Workgraph semantic fingerprint. New refs omitted from the compatibility list append deterministically, so ordinary future work does not require maintaining one global ordering array.

```text
SEGMENT_AUTHORING_CURRENT
PUBLIC_WORKGRAPH_GENERATED
PUBLIC_WORKGRAPH_STILL_CANONICAL_VALUE
PROJECT_REGISTRY_PATHS_UNCHANGED
RUNTIME_CURRENTNESS_UNCHANGED
```

### Authoring rule

A lane that changes Work truth edits the segment that owns that WorkRef and then regenerates/checks the public Workgraph.

```text
edit rightful segment
-> npm run workgraph:build
-> affected tests
-> npm run review
```

A lane must not hand-edit `workgraphs/public.json` to bypass the segment owner. Generated-currentness is enforced by `npm run workgraph:check` inside the deterministic review floor.

This removes the recurring physical writer collision that motivated the foundation without inventing distributed locking or multiple Workgraphs.

## Operational posture after adoption

```text
different work-family segments
  -> may author in parallel

same segment
  -> coordinate exact semantic ownership/currentness

generated public Workgraph
  -> convergence artifact, not an authoring membrane

public workspace
  -> generated projection from canonical Project + Workgraph truth
```

Aggregate merge conflicts should now normally indicate stale generated output or source-currentness reconciliation, not a reason to serialize unrelated work families.

## Non-collapse

```text
SOURCE_SEGMENTATION != MULTIPLE_WORKGRAPHS
SOURCE_SEGMENTATION != MULTIPLE_CURRENT_POINTERS
SOURCE_SEGMENTATION != PROJECT_SHARDING
SOURCE_SEGMENTATION != DISTRIBUTED_LOCKING
SOURCE_SEGMENTATION != AUTOMATIC_PROVIDER_RECONCILIATION
```

<!-- [VXG RealForever][VEXWORK][FOUNDATION][WORKGRAPH-COMPOSITION] -->
