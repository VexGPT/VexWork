# Workgraph Runtime Persistence

`[VXG RealForever]`

## Human question

How can VexWork keep **current private Workgraph truth** across process restart without turning Git commits, a provider ticket database, or a product repository into the live runtime store?

The first runtime foundation answers only that question.

```text
lawful Workgraph truth
-> immutable Workgraph snapshot
-> atomic CURRENT pointer
-> exact-current transition under one writer lease
-> restart / read-back
```

It does not own planning, provider reconciliation, UI, authentication, or deployment-specific Home semantics.

## Ownership

```text
VexWork Workgraph
  owns work identity, lifecycle and transition legality

VexWork runtime persistence
  owns portable snapshot/currentness/concurrency mechanics

caller / deployment
  chooses one private local storeRoot

Vex Home or another deployment
  may bind that storeRoot through its own adapter/custody rules
```

Permanent:

```text
WORKGRAPH_SEMANTICS != RUNTIME_STORE
RUNTIME_STORE != VEX_HOME
STORE_ROOT != HOME_IDENTITY
CURRENT_POINTER != CURRENT_FOREVER
WRITER_LEASE != WORK_AUTHORITY
SNAPSHOT_PERSISTED != PROVIDER_MUTATION
SOURCE_DEFINITION != LIVE_RUNTIME_STATE
```

The public repository therefore does not need to know a person's Home path, private Workgraph payloads, credentials, or machine-specific coordinates.

## Why Workgraph transitions are the event ledger

The Workgraph already has an append-only semantic transition history:

```text
vexwork.work-transition/v1
```

That is the rightful event source for lifecycle changes. Runtime persistence does **not** create a second "runtime event" ontology merely to describe that the same transition was written to disk.

```text
WORK_TRANSITION = semantic event
RUNTIME_SNAPSHOT = durable state containing accepted event history
CURRENT_POINTER = accepted runtime currentness
```

This keeps one semantic owner and avoids duplicated event truth.

## Portable filesystem store

`src/core/workgraph-runtime.mjs` provides a deployment-neutral local filesystem realization rooted under a caller-supplied existing canonical directory.

```text
<storeRoot>/
  workgraphs/
    <sha256(store-schema + graphRef)>/
      snapshots/
        <graph-semantic-fingerprint>.json
      pointers/
        <pointer-sha256>.json
      writer.lock
```

The adapter does not hardcode Vex Home. A private deployment may place this tree under its own canonical Home root later.

The store rejects a symbolic/aliased root or a path that escapes the supplied root.

## Immutable snapshots

Every runtime snapshot is the complete canonical Workgraph returned by `createWorkgraph(...)`.

The filename is its Workgraph semantic fingerprint. Existing content-addressed files may be replayed only when their canonical bytes are identical.

A snapshot is not current merely because it exists.

```text
SNAPSHOT_EXISTS != CURRENT
VALID_WORKGRAPH != RUNTIME_CURRENT_WORKGRAPH
```

An exact snapshot left behind before first CURRENT publication may be safely reused by a repeated initialization attempt. Unrelated orphan history with no CURRENT pointer fails closed for explicit recovery rather than being guessed current.

## CURRENT pointer

`current.json` is the one accepted runtime currentness pointer for a Workgraph identity.

It binds:

```text
graphRef
graphSemanticFingerprint
graphPayloadSha256
transitionCount
lastTransitionRefOrNull
priorPointerSha256OrNull
priorGraphSemanticFingerprintOrNull
pointerSha256
```

Every accepted pointer identity is retained as an immutable content-addressed record under `pointers/`. The pointer chain itself owns runtime currentness: **CURRENT is the unique validated tip of that retained lineage**, not a mutable file whose self-hash can declare itself current.

Publishing a new pointer record is the atomic currentness commit point. Because its content address includes its predecessor identity, replaying an older pointer is idempotent rather than a rollback, a false predecessor cannot resolve, and erasing predecessor fields creates a second lineage root that fails closed.

This gives runtime currentness verifiable retained lineage without creating another Workgraph event ledger. Workgraph transitions remain the only semantic lifecycle/event history; runtime pointers only prove which validated Workgraph snapshot succeeded which prior accepted pointer.

Read-back revalidates:

- every retained pointer's own digest and content address;
- exactly one connected pointer lineage with one root and one tip;
- the tip's addressed Workgraph through the canonical Workgraph validator;
- the full graph payload digest;
- transition count + latest transition identity;
- every named predecessor pointer resolves to its retained immutable pointer identity;
- predecessor pointer -> predecessor Workgraph identity agreement;
- exactly one admitted Workgraph transition per runtime pointer step;
- append-only transition-history prefix continuity through the retained pointer lineage.

## Initialization

`initializeWorkgraphRuntime(...)` admits one already-valid Workgraph as the first runtime current snapshot.

If CURRENT already points to that exact Workgraph, initialization is idempotent and performs no mutation.

If CURRENT points elsewhere, initialization does not overwrite it.

```text
INITIALIZE != REPLACE_CURRENT
```

## Runtime lifecycle transition

`commitWorkgraphRuntimeTransition(...)` does not implement lifecycle rules itself.

It performs:

```text
acquire per-Workgraph writer lease
-> read + verify exact CURRENT Workgraph
-> compare expected CURRENT pointer SHA-256
-> delegate transition to requestTransition(...)
-> write immutable next Workgraph snapshot
-> atomically publish one immutable successor pointer record
-> derive CURRENT as the unique validated pointer-lineage tip
-> read back + revalidate
-> release exact writer lease
```

The canonical `requestTransition(...)` remains the lifecycle owner.

```text
RUNTIME_CAS != TRANSITION_AUTHORITY
TRANSITION_REQUEST != TRANSITION_ACCEPTED
```

A stale expected pointer fails before another writer's current Workgraph can be overwritten.

## Writer serialization and recovery

Mutation uses one exclusive `writer.lock` per Workgraph address.

The lease binds:

```text
graphRef
instanceRef
pid
lockToken
formedAt
leaseSha256
```

An active or unverifiable writer fails closed.

An abandoned writer is not automatically deleted. `recoverWorkgraphRuntimeWriter(...)` requires the exact observed lease SHA-256, proves the recorded process is absent, validates CURRENT when it exists, and then removes only that exact lease.

```text
ABANDONED_WRITER -> EXACT_LEASE_RECOVERY
ACTIVE_WRITER -> CONFLICT
UNVERIFIABLE_WRITER -> CONFLICT
STALE_RECOVERY_DIGEST -> REJECT
```

Recovery is a real local runtime mutation. It is not provider mutation and it does not grant Workgraph transition authority.

## Crash / replay boundary

Pointer-record publication is the last authoritative step.

A crash after writing an immutable next snapshot but before publishing its successor pointer leaves the prior pointer-lineage tip authoritative. The orphan snapshot may be reused by an exact retry; its mere existence never advances currentness.

A crash after the immutable successor pointer is atomically published may lose the caller's return value, but a fresh read derives that successor as the unique lineage tip and recovers the accepted current Workgraph.

This source does not claim power-loss durability beyond the filesystem guarantees exercised by the adapter. A deployment that requires stronger device/filesystem guarantees may wrap or replace the portable adapter while preserving the same VexWork semantics.

## Public/private boundary

The implementation and synthetic tests are public-safe. Real Workgraph data can remain private because the store root is supplied at runtime and no live data is committed to this repository.

```text
PUBLIC_VEXWORK
  schemas + semantics + portable adapter + synthetic tests

PRIVATE_DEPLOYMENT
  storeRoot + live Workgraphs + local process state
```

No network listener, GitHub mutation, external provider write, credentials, Home mutation, or remote synchronization occurs merely because this adapter is used.

## Proof

Focused source proof lives in `test/workgraph-runtime.test.mjs` and covers:

- initialization and restart/read-back;
- exact orphan-snapshot replay before first CURRENT;
- exact-current lifecycle transition persistence;
- immutable pointer-lineage currentness with one validated tip;
- replayed-old-pointer, falsified predecessor identity, and lineage-erased Workgraph substitution rejection;
- stale CURRENT-pointer rejection;
- lifecycle legality delegated to Workgraph semantics;
- abandoned writer hold + stale recovery rejection + exact recovery.

Repository-wide `npm run review` remains the aggregate deterministic floor.

## Explicit holds

This foundation does **not** yet provide:

```text
conversational / automatic Work capture writer
non-transition Workgraph structural mutation API
Project planning / WIP / ordering runtime
provider/source/proof reconciliation writer
native/web Board mutation UI
multi-host distributed locking
remote store protocol
Vex Home deployment binding
production migration from VexLife's current runtime writer
```

Those are later questions. The next runtime work should only add one when a real consumer requires it.

## Lineage

VexLife P0B proved the need for immutable Workgraph snapshots, one CURRENT pointer, serialized transition writes and explicit abandoned-writer recovery. LocalVex independently demonstrates the private-Home custody pattern of content-addressed records + atomic current pointers + fail-closed writer recovery.

VexWork adopts the portable work-runtime meaning independently under Apache-2.0; it does not copy product/private implementation source or make either predecessor the live VexWork authority.

<!-- [VXG RealForever][VEXWORK][RUNTIME-PERSISTENCE] -->
