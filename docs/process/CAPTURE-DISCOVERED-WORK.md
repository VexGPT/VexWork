# Capture discovered work

`[VXG RealForever]`

Process ref: `process.vexwork.capture-discovered-work`

## Human situation

A worker is completing one bounded outcome and notices another useful idea, defect, question, improvement, or future feature.

The discovered item is worth preserving, but it is not required to finish the current outcome.

Without an explicit process, workers tend to do one of two harmful things:

```text
expand current scope until the lane loses its completion boundary
OR
create a provider ticket and accidentally make that provider the work system
```

## Current truth

The active lane owns its current acceptance boundary.

The target repository owns the product/source meaning of any later implementation.

VexWork owns the durable work identity and relationship between those facts.

## Process

```text
1. DISCOVER
   notice adjacent useful work while completing current work

2. TEST CURRENT SCOPE
   is it required for the current accepted outcome?

   YES
     -> keep it in the current work family

   NO
     -> do not widen the current acceptance boundary

3. CAPTURE
   create/reuse one stable VexWork Work item
   preserve the ordinary human purpose
   classify the work truthfully
   set workDisposition=PARKED when intentionally deferred
   default authorityDisposition=NO_AUTHORITY
   default effectDisposition=NO_EFFECTS

4. RELATE
   preserve discovery/source/provider provenance
   bind the repositoryRefs actually implicated
   bind the formation process
   name the next repository/process route when already known

5. PROJECT
   surface through Parking Lot / search / repository-filtered views
   do not create a Project merely because the item exists

6. LATER ADOPTION
   an explicit later decision may unpark/admit/plan the item
   then descend into the target repository's own current process
   do not treat prior parking as implementation authority
```

## Worked example: Android issue #144

MassDownload / PR #142 deliberately excluded a Songs-level **Not yet downloaded** filter from its acceptance boundary. The QuantumTest lane preserved the idea as VexLife-Android issue #144 because GitHub Issues were the available durable bucket.

VexWork now models the same event as:

```text
current work
  VexStream MassDownload / PR #142

adjacent discovery
  Songs filter: Not yet downloaded

VexWork capture
  work.vexlife-android.vexstream.not-yet-downloaded-filter
  POTENTIAL
  CAPTURED
  PARKED
  NO_AUTHORITY
  NO_EFFECTS

provider provenance
  github.issue.vexlife-android.144

future route if adopted
  process.vexlife-android.feature-authoring
  -> VexLife-Android/docs/features/README.md
```

The provider issue is evidence of the historical capture. Future instances should not need to create another GitHub Issue merely to remember the item.

## Process-learning responsibility

When a worker performs a useful process that is not represented anywhere, ask:

```text
Was this a one-off local maneuver?
  -> keep it local; do not create process bureaucracy

Is this a recurring or sufficiently general work question future instances would otherwise rediscover?
  -> identify the rightful process owner
  -> source-place or extend that process there
  -> register/reference the route from VexWork when work navigation needs it
```

This is the bridge between doing work and improving how future work is done.

The system should learn the **reusable route**, not preserve private chain-of-thought or every incidental step.

## Permanent boundaries

```text
DISCOVERED_WORK != CURRENT_SCOPE_BY_DISCOVERY
CAPTURE != ADMISSION
PARK != REJECT
PARK != BLOCK
PARK != AUTHORIZE
PROVIDER_TICKET != WORK_IDENTITY
PROCESS_MAP != EXECUTION
PROCESS_REUSE != BLIND_REPLAY
```

<!-- [VXG RealForever][VEXWORK][PROCESS][CAPTURE-DISCOVERED-WORK] -->
