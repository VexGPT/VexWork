# Derived Attention Projection

`[VXG RealForever]`

## Purpose

The base [Derived Attention foundation](./DERIVED-ATTENTION.md) answers one entity under one Work Lens. This projection answers the population-level navigation question:

> Across the exact current population, how many entities are complete, incomplete, unknown, not applicable, or attention-worthy—and how can a human descend through overlapping scopes to the exact entity, current evidence, reason facet, and any already-admitted Work?

```text
Population Snapshot + Work Lens + exact Evidence for every entity
-> per-entity Derived Attention
-> one unique aggregate
-> nested / overlapping scope summaries
-> exact entity and evidence rows
```

It remains read-only:

```text
PROJECTION != WORK_STATE
SCOPE_SUMMARY != ENTITY_OWNERSHIP
REASON_COUNT != IMPLEMENTATION_AUTHORITY
EXISTING_WORK_REFERENCE != AUTOMATIC_PROMOTION
```

## Contract

`vexwork.derived-attention-projection/v1` binds one exact Population Snapshot and one exact Work Lens by semantic fingerprint.

The producer supplies exactly one `vexwork.entity-lens-evidence/v1` object for every current population entity. Missing, duplicated, foreign, stale, or partially covered evidence fails closed. Facts that could not be obtained are represented explicitly through `UNKNOWN`; omission never means healthy or complete.

The projection uses `deriveEntityAttentionBatch()` so the shared Population and Lens are canonicalized once per batch while each entity still passes through the exact base Evidence and Derived Attention semantics. This avoids population-wide revalidation for every row without introducing a second derivation owner.

The projection contains:

```text
population / snapshot / provider identity
lens identity and purpose
rootScopeRefs[]
aggregate
  entityCount
  completionCounts
  attentionCounts
  evidenceObservedAtRange
  existing Work references
  reason-facet summaries
scopes[]
  parent / child scope references
  directEntityRefs[]
  entityRefs[]              inclusive of descendants, de-duplicated
  summary                   same count/facet shape as aggregate
entities[]
  stable identity / label / source refs / scope refs
  evidence identity / fingerprint / observation time
  completionState / attentionState
  reasonFacets[]
  existingWorkRefs[]
  exact Derived Attention fingerprint
```

Every output declares:

```text
effects = false
executionAuthority = NONE
```

## Aggregate truth and overlapping scopes

Scopes are navigation views, not partitions. One entity may belong to several current groups—for example one VexSite page can belong to an arc and a featured collection.

Therefore:

```text
AGGREGATE = unique current population entities
AGGREGATE != sum(scope entity counts)
```

Each scope exposes both:

- `directEntityRefs[]`: entities explicitly assigned to that scope;
- `entityRefs[]`: the unique union of direct entities and all descendant-scope entities.

An entity assigned to both a parent and a child is counted once in that parent summary. An entity assigned to unrelated scopes appears in each of those scope summaries while remaining one entity in the aggregate.

## Counts are descent indexes, not truth owners

Completion and attention counts use the closed states from the base contract. Reason-facet summaries preserve:

```text
reasonFacetRef
occurrenceCount
unique entityCount / entityRefs[]
predicateRefs[]
REQUIRED vs ADVISORY occurrence counts
UNSATISFIED vs UNKNOWN vs NOT_APPLICABLE occurrence counts
```

These counts help a human find the exact current concern. The entity row and bound evidence remain the descent target. A count does not create a task, authorize a mutation, or become another repository/provider database.

## Dynamic populations

A changed population snapshot can add or remove entities without ticket maintenance. The next projection must bind newly formed evidence to that exact new population fingerprint.

```text
population changes
-> old evidence binding is stale
-> form exact evidence for the new snapshot
-> derive a new projection fingerprint
```

Historical Work can remain completed while a later entity observation becomes incomplete or attention-worthy. The projection may point to that Work, but it does not reopen or mutate Workgraph automatically.

## Localization branch threshold

With the base contract and this projection accepted, the VexSite Localization lane can independently implement its rightful adapter:

```text
Vextreme page / node / group / arc identity
+ current localization / generated / lived evidence
-> Population Snapshot + Work Lens + Entity Lens Evidence
-> aggregate -> scope -> entity projection
```

That consumer still owns its exact Vextreme source semantics and lived patient-zero proof. VexWork supplies the reusable projection grammar; it does not decide which Vextreme facts mean localized, current, modernized, or lived-proven.

## Deliberately separate

This slice does not own:

```text
promotion of a derived concern into canonical Workgraph Work
interactive UI rendering
provider mutation or source effects
Operating Domain templates
commerce item / order / fulfillment semantics
event-shaped attention queues
Vextreme-specific population and evidence adapters
```

## Proof

`test/derived-attention-projection.test.mjs` proves:

- one unique aggregate across overlapping scope membership;
- direct and descendant scope rollups with de-duplication;
- every completion and attention state in closed counts;
- exact entity/evidence/reason/Work descent;
- reason-facet occurrence and unique-entity accounting;
- evidence-order-independent semantic identity;
- changed population membership changes projection truth;
- exact unique evidence coverage;
- truthful empty-population summaries;
- no WorkState, effects, or execution authority.

<!-- [VXG RealForever][VEXWORK][FOUNDATION][DERIVED-ATTENTION-PROJECTION] -->
