# Parking Lot foundation

`[VXG RealForever]`

## Human meaning

A **Parking Lot** is the VexWork projection for useful work knowledge that should be preserved but is intentionally not foreground work.

It answers the ordinary sentence:

> "Keep this for later without making it part of what we are finishing now."

That sentence is different from creating a GitHub Issue and different from adding the item to a Project.

```text
PARKED != REJECTED
PARKED != BLOCKED
PARKED != PROJECT_MEMBERSHIP
PARKED != IMPLEMENTATION_AUTHORITY
PARKING_LOT != PROJECT
```

## Why this exists

VexLife-Android issue #144 is the first concrete pressure.

While MassDownload / PR #142 was being finished, a useful adjacent product idea appeared: a Songs-level **Not yet downloaded** filter. The active lane correctly kept that idea outside MassDownload acceptance, but because no cross-repository work owner existed yet, the durable parking mechanism became a GitHub Issue.

The issue body itself already carried good product reasoning:

- the human question;
- current UI observation;
- semantics to preserve;
- a deliberate non-goal boundary against MassDownload and QuantumTest;
- discovery provenance.

What was missing was a provider-independent work identity.

VexWork therefore represents that idea as:

```text
work.vexlife-android.vexstream.not-yet-downloaded-filter
  class = POTENTIAL
  state = CAPTURED
  disposition = PARKED
  authority = NO_AUTHORITY
  effects = NO_EFFECTS
  repository = repo.vexlife-android
  formed by = process.vexwork.capture-discovered-work
  next process = process.vexlife-android.feature-authoring
  provider provenance = github.issue.vexlife-android.144
```

The GitHub Issue remains useful provenance. It is no longer the conceptual owner of the idea.

## Project membership is optional

A Work item can exist before it belongs to a Project.

Projects select a bounded subgraph from the Workgraph through `rootWorkRefs[]`. The Workgraph itself may also contain unprojected work such as parked potentials.

```text
WORK_ITEM != PROJECT_MEMBERSHIP
PROJECT = BOUNDED WORKGRAPH GROUPING
WORKGRAPH = PORTABLE WORK TOPOLOGY
```

This avoids inventing fake containers such as `Parking Lot Project` merely to preserve one idea.

## Projection

The first Parking Lot projection is deliberately simple:

```text
CURRENT Workgraph
-> non-terminal items with workDisposition=PARKED
-> optional repository filter
-> deterministic Parking Lot projection
```

A later planning/runtime owner may add richer prioritization, revisit triggers, or private CURRENT persistence. The first foundation does not invent those prematurely.

## Relationship to repository feature authoring

Parking is not feature design.

When a parked Android product potential is deliberately adopted, VexWork routes the worker to Android's current feature-authoring owner:

```text
VexWork parked potential
-> explicit adoption / authority separately established
-> process.vexlife-android.feature-authoring
-> VexLife-Android docs/features/README.md
-> feature human situation / current truth / missing question
-> durable feature home when earned
-> implementation + rightful proof
```

The target repository owns feature meaning and implementation. VexWork preserves work identity, provenance, relationships, status and route.

<!-- [VXG RealForever][VEXWORK][FOUNDATION][PARKING-LOT] -->
