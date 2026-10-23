# Attention Queue foundation

`[VXG RealForever]`

## Human question

How can VexWork show current event/exception-shaped attention that deserves action without turning the queue into WorkState, an event database, a priority engine or an executor?

The portable relationship is:

```text
rightful provider / repository observation
-> current attention queue snapshot
-> deterministic queue projection
-> optional process navigation
-> optional explicit promotion into canonical Work
```

Permanent distinctions:

```text
ATTENTION_QUEUE != WORKGRAPH
QUEUE_ENTRY != WORK_ITEM
QUEUE_SNAPSHOT != EVENT_STORE
ATTENTION_STATE != WORK_STATE
QUEUE_ENTRY != EFFECT_AUTHORITY
PROCESS_REFERENCE != PROCESS_EXECUTION
EXISTING_WORK_REFERENCE != AUTOMATIC_PROMOTION
CLEAR_ATTENTION != COMPLETED_WORK
QUEUE_ORDER != BUSINESS_PRIORITY
```

The queue foundation is read-only:

```text
effects = false
executionAuthority = NONE
```

## Why this foundation exists

Derived Attention already answers population-shaped questions such as "which pages are incomplete under this lens?". Operational environments also produce event/exception-shaped attention that should not require one durable Work item per event.

Commerce is the immediate pressure:

```text
order sold
-> shipment required
-> fulfillment attention appears
-> human/provider acknowledgement arrives
-> current attention becomes CLEAR
```

The provider or domain source still owns the order, shipment, receipt and current operational truth. VexWork needs only enough structure to show the attention, explain its provenance, point to a reusable process when one exists, and relate already-admitted Work without creating it automatically.

## Contract

`src/core/attention-queue.mjs` owns:

```text
vexwork.attention-queue-snapshot/v1
vexwork.attention-queue-projection/v1
```

A current queue snapshot carries:

```text
queueRef
snapshotRef
ownerRepositoryRef
label / purpose
observedAt
sourceRefs[]
entries[]
semanticFingerprint
```

Each entry carries:

```text
attentionRef             stable identity for this attention condition
subjectRef               stable reference to the rightful domain subject
subjectKind              stable subject kind
label                     human-readable current attention
attentionState            ATTENTION | UNKNOWN | CLEAR
observedAt                exact observation time
reasonRefs[]              stable reasons/facets explaining why it is present
sourceRefs[]              navigation/provenance to the rightful owner
evidenceRefs[]            evidence for ATTENTION/CLEAR; may be empty for UNKNOWN
existingWorkRefs[]        relational references only
processRefOrNull          optional Process Map route; never execution authority
```

The snapshot also declares:

```text
effects = false
executionAuthority = NONE
```

## Current observation, not another lifecycle

The queue does not own an `OPEN -> DONE` lifecycle.

A producer supplies one current observation. The same stable `attentionRef` may appear in later snapshots with changed current truth:

```text
ATTENTION
-> CLEAR
```

`CLEAR` requires evidence and is excluded from the active `queuedEntries` projection.

`UNKNOWN` remains queued because the unresolved fact itself can require attention. It may truthfully carry no evidence when the relevant fact was not obtainable.

Absence from a later snapshot does **not** prove resolution. When closure matters, the rightful owner should provide an explicit `CLEAR` observation or another accepted source/evidence path that establishes the claim.

```text
ENTRY_MISSING != CLEAR
CLEAR != WORK_COMPLETED
```

## Evidence and currentness

`ATTENTION` and `CLEAR` require non-empty `evidenceRefs[]`.

`UNKNOWN` may use an empty evidence set.

Every entry still requires non-empty `sourceRefs[]`, and an entry observation may not be newer than the containing queue snapshot observation.

Stored semantic identity must already be canonical. Reference arrays and entries normalize by stable identity before fingerprinting; a persisted object with a valid but noncanonical fingerprint is rejected rather than silently rewritten.

## Ownership and process routing

`ownerRepositoryRef` must resolve through the Repository Graph.

An optional `processRefOrNull` must resolve through the Process Map when present. That relation means only:

> this is the reusable route that can help handle this attention.

It does not execute the process, mutate the subject/provider, acknowledge a human action, or create Work.

`existingWorkRefs[]` are also relational only. They help a consumer avoid treating known Work as invisible, but the queue does not validate, mutate or complete those Work items by implication.

Explicit promotion remains owned by `process.vexwork.promote-derived-concern` / `src/core/derived-work-promotion.mjs` or a later exact queue-to-promotion adapter that composes that existing contract.

## Projection

`projectAttentionQueue()` returns one deterministic read-only view:

```text
summary
  entryCount
  queuedCount
  stateCounts
  processRoutedCount
  existingWorkRefs[]

queuedEntries
  ATTENTION + UNKNOWN only

clearEntryRefs
  explicitly CLEAR current observations
```

The first contract deliberately does not invent urgency, due dates, assignment, ordering policy, retries, SLA, notification delivery or persistent acknowledgement history.

If a domain later needs one of those semantics, its observed need should justify a separate contract or explicit evolution rather than being smuggled into the generic queue.

## Operating Domain relationship

`vexwork.operating-domain/v1` already reserves:

```text
attentionQueues[]
  queueRef
  label
  ownerRepositoryRef
  sourceRefs[]
```

That binding remains relational:

```text
ATTENTION_QUEUE_BINDING != QUEUE_IMPLEMENTATION
```

A domain may bind a queue whose semantic implementation is owned by VexWork or by another rightful repository. The new queue foundation supplies the first portable VexWork-owned implementation contract; it does not make all domain queues VexWork-owned.

## Deliberately held from this slice

This contract does not yet own:

```text
commerce-specific order/shipment schemas
provider event ingestion
private customer/shipping data
notifications
human/device effects
queue persistence/history
priority or SLA policy
automatic Work creation
interactive UI or canvas behavior
```

Commerce P4/P5 can now pressure this generic contract with a real fulfillment queue without requiring schema invention inside the Operating Domain descriptor.

## Proof

`test/attention-queue.test.mjs` proves:

- current `ATTENTION`, `UNKNOWN` and explicit `CLEAR` semantics;
- only `ATTENTION`/`UNKNOWN` appear in active queued entries;
- deterministic ordering and canonical semantic identity;
- known repository ownership and Process Map routing;
- evidence requirements for `ATTENTION` / `CLEAR` versus truthful `UNKNOWN`;
- duplicate attention identity rejection;
- snapshot/entry observation currentness;
- hidden authority-shaped fields fail closed;
- read-only / no-execution-authority projection.

<!-- [VXG RealForever][VEXWORK][FOUNDATION][ATTENTION-QUEUE] -->
