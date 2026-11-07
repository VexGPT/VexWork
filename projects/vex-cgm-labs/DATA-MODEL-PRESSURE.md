# VexCgmLabs — data-model pressure

`[VXG RealForever]`

## Purpose

Pressure the minimum CGM data model needed to distinguish **what the sensor produced** from **what a
consumer observed**, before production Kotlin names are frozen.

This file records semantic distinctions, not a final API.

## Governing law

```text
ACQUISITION IDENTITY
!= TRANSPORT DELIVERY
!= CONSUMER OBSERVATION
!= UI PRESENTATION
```

A transport interruption must never silently become an acquisition gap, and a recovered historical
measurement must never retroactively become a real-time observation.

## Candidate measurement identity

A robust measurement identity needs enough information to answer:

```text
which device?
which sensor/stream/acquisition incarnation?
which exact production order?
```

Candidate shape:

```text
MeasurementIdentity
    deviceRef
    streamRef / sensorSessionRef
    acquisitionEpoch
    sequence
```

The exact split between `streamRef`, `sensorSessionRef` and `acquisitionEpoch` remains held until
the first synthetic device contract proves which identities are truly distinct.

The important invariant is:

```text
(device incarnation, sequence)
-> one production-order coordinate

RESET / SENSOR REPLACEMENT
-> new incarnation
-> sequence values may restart without identity collision
```

Do not use wall-clock time as the sole sequence identity.

## Sequence versus time

These answer different questions:

```text
sequence
    exact production order
    gap detection

device monotonic time / captured ticks
    elapsed device time
    acquisition timing

capturedAt
    human/calendar mapping of acquisition time when trustworthy

observedAt
    when this consumer learned the observation
```

Permanent:

```text
SEQUENCE != TIMESTAMP
CAPTURED_AT != OBSERVED_AT
DEVICE_CLOCK != PHONE_CLOCK
```

A future device-time mapping may relate monotonic device ticks to wall-clock time, but that mapping is
not allowed to erase the underlying production order.

## Candidate measurement record

Conceptual only:

```text
CgmMeasurement
    identity
        deviceRef
        acquisitionEpoch
        sequence

    glucose
        value
        unit / canonical representation

    capturedDeviceTime
    capturedAt?
    observedAt

    provenance
        LIVE
        BACKFILL

    validity / status
    trend?
```

Do not freeze exact field names yet.

### Unit semantics

The Lab must support at least:

```text
mg/dL
mmol/L
```

but:

```text
DISPLAY UNIT != MEASUREMENT IDENTITY
UNIT CONVERSION != NEW SENSOR OBSERVATION
```

The first contract must explicitly select whether the device/source value is canonically represented
in one unit or whether the record retains an exact tagged unit. Do not permit repeated
format-conversion to introduce semantic drift.

### Trend semantics

Keep these distinct:

```text
GLUCOSE VALUE != TREND
DEVICE_REPORTED_TREND != CLIENT_DERIVED_TREND
TREND != CLINICAL INTERPRETATION
```

Candidate trend pressure:

```text
UNKNOWN
STEADY
RISING_SLOW
RISING
RISING_FAST
FALLING_SLOW
FALLING
FALLING_FAST
```

Those exact members and any rate thresholds are **not accepted universal CGM vocabulary**. A concrete
synthetic device profile must own its admitted trend contract.

A record should preserve whether a trend was:

```text
reported by device
or
derived by consumer from admitted observations
```

## Acquisition state

Separate sensor acquisition from transport.

Candidate meaning:

```text
Acquisition
    Unobserved
    Starting
    Active
    NoValidMeasurement
    Ended
    Faulted
```

Exact names remain held.

The critical distinction is:

```text
TRANSPORT LOST
does not prove
ACQUISITION STOPPED
```

## Transport state

Candidate meaning:

```text
Transport
    Unobserved
    Connected
    Interrupted
    Reconnecting
```

The eventual BLE transport may have richer discovery/pairing/service states. Those do not belong in
the transport-neutral CGM semantic model unless they change the product question.

## Observation/history continuity

The local consumer should know the contiguous frontier it has actually reconstructed.

Candidate concepts:

```text
lastContiguousSequence

observedAhead
    records observed after a gap

missingRanges
    exact unresolved sequence intervals

retention frontier
    earliestRetainedSequence
    latestProducedSequence
```

Example:

```text
observed:
    101
    102
    104
    105

then:
    lastContiguous = 102
    missing = 103
    observedAhead = 104,105

after 103 arrives:
    lastContiguous = 105
    missing = none
```

Permanent:

```text
OBSERVED_LATER_DATA != CONTIGUOUS_HISTORY
```

## Gap classification

A generic `Missing` state is too lossy.

The model must distinguish at least the semantic cases:

### Recoverable transport gap

```text
sensor produced records
consumer missed them live
device still retains them
-> backfill can recover the record history
```

### Acquisition gap

```text
sensor did not produce a valid measurement
-> no actual measurement exists to backfill
```

### Retention-expired gap

```text
sensor produced records
consumer missed them
device no longer retains them
-> exact historical measurements are unrecoverable
```

### Unknown gap

```text
consumer currently lacks enough evidence
to classify whether the missing interval is recoverable / acquisition-empty / expired
```

Permanent:

```text
DETECTABLE_GAP != RECOVERABLE_GAP
RECOVERABLE_GAP != ACQUISITION_GAP
NO_DATA != ZERO_VALUE
ESTIMATED_VALUE != SENSOR_MEASUREMENT
```

## Backfill semantics

Backfill reconciles **observation history**, not acquisition history.

Example:

```text
acquisition:
    500 501 502 503 504 505

phone observed live:
    500
    [transport gap]
    505

after reconciliation:
    501..504 arrive as BACKFILL
```

Afterward:

```text
measurement history may be complete

while

real-time availability history remains incomplete
```

Permanent:

```text
MEASUREMENT_HISTORY_COMPLETE
!=
MEASUREMENT_WAS_AVAILABLE_FOR_REAL_TIME_DECISION
```

The system must preserve enough chronology to answer both.

## Current measurement availability

A last-known value is not automatically current.

Candidate derived relationship:

```text
latest valid measurement
+ acquisition truth
+ transport truth
+ freshness/currentness policy
+ reconciliation truth
-> MeasurementAvailability
```

Possible meanings under pressure:

```text
Current
Stale
Unavailable
Unknown
```

Do not freeze names yet.

Required law:

```text
LAST_KNOWN_VALUE != CURRENT_VALUE
CONNECTED != MEASUREMENT_CURRENT
```

## Candidate Connection / Signal seam

The earlier `CgmReader` vocabulary was useful pressure, but the current leading relationship is
smaller and more reusable:

```text
Connection<Signal>
```

For CGM:

```text
BleCgmConnection
LocalHttpCgmConnection
        |
        v
Connection<CgmDeviceFamily.Signal>
```

The Connection answers only:

> What communication relationship exists, and what typed CGM Signal arrived through this concrete
> realization?

The Signal answers:

> What did the external CGM device tell us?

Signal is not State.

```text
CONNECTION STATE != SIGNAL
SIGNAL != FAMILY STATE
SIGNAL RECEIVED != STATE CHANGED
```

Candidate CGM-local Signal vocabulary remains under pressure:

```text
Signal.Measurement(CgmMeasurement)
Signal.Status(...)
Signal.Session(...)
Signal.History(...)
```

A transport batch is not automatically a semantic batch. When grouping is only delivery
convenience, normalize it into independent Signals. When the collection itself carries meaning,
preserve it as one meaningful Signal such as History with requested/retained range evidence.

```text
TRANSPORT CARDINALITY != SEMANTIC CARDINALITY
DELIVERY ORDER != PRODUCTION ORDER
```

The concrete Connection may understand BLE characteristics, HTTP JSON or other protocol mechanics.
The Family and durable history must not.

## Relationship shape under pressure

Do not center the architecture on one free-standing `CgmMeasurement` merely because glucose was the
first example.

The CGM source can communicate several different semantic shapes:

```text
glucose information
temperature information
reported trend / status
session / acquisition facts
retention frontier
meaningful history responses
```

Some may be attributes of one source-produced record; some may be independent facts; some collections
carry relationship meaning beyond their members. The synthetic device contract must decide that from
source semantics rather than from a generic payload preference.

Permanent distinctions remain:

```text
ACQUISITION IDENTITY
!= TRANSPORT DELIVERY
!= CONSUMER OBSERVATION
!= DURABLE COMMIT
!= CURRENT SEMANTIC STATE
!= UI PRESENTATION
```

and:

```text
SOURCE FACT IDENTITY != OBSERVATION OCCURRENCE
TRANSPORT BATCH != MEANINGFUL HISTORY COLLECTION
RESTORED DURABLE FACT != NEW DEVICE SIGNAL
```

### Cross-domain falsification pressure

Before extracting a reusable Signal / Entity / receiver foundation, compare at least:

```text
CGM
    ordered glucose acquisition
    temperature / trend / retention facts
    meaningful backfill/history ranges
    continuity / gap pressure

CONNECTED PEN
    sparse dose events
    cartridge/device facts
    history replay
    no assumed contiguous gap unless the source contract proves one

INSULIN PUMP
    delivery observations
    reservoir/device facts
    history replay
    outbound requested effects whose acknowledgement is not physical delivery
```

The architecture succeeds when the repeated *relationship mechanics* remain stable while these domain
vocabularies differ.

### Current Kotlin pressure

Current VexLife culture favors rooted semantic trees and explicit cross-root relationships.

Therefore the implementation experiment should pressure whether Kotlin can make it mechanically
obvious:

```text
which semantic root owns a domain value / Signal vocabulary
which Connection / Decoder can produce that vocabulary
which receiver admits / reconciles it
which repository preserves it
which Family State interprets it
```

without introducing parallel mapper registries or free-standing peer types whose relationship must be
reconstructed from naming.

The following remain **held hypotheses**, not accepted foundation:

```text
VexSignal.Of<Meaning>
VexEntity.Of<Meaning>
EntityForm<Domain, Entity>
Signal<F>
one universal Form marker
```

### Persistence pressure

Current VexLife-Android law remains:

```text
REPOSITORY != DAO
ENTITY != DOMAIN MODEL
DATABASE_WRITE != PRODUCT SEMANTIC SUCCESS
```

Do not assume Room `@Embedded` domain composition is the reusable answer. Current VexLife source
uses explicit SQL compatibility names and does not establish direct embedded domain objects as its
existing pattern.

The durable CGM truth may require several related physical representations:

```text
source / measurement evidence
observation provenance
gap / conflict / retention evidence
reconstructable continuity checkpoint
```

One admitted Signal may update several of these in one transaction. A meaningful History Signal may
produce many durable rows while preserving request / retention range evidence.

The goal is not "one Signal -> one Entity." The goal is that durable representation does not create a
second semantic identity or erase how the receiver came to know the fact.

## Signal continuity and integrity

The receiver needs durable knowledge of how far its understanding is proven continuous.

Candidate relationship:

```text
currentEpoch
continuityFrontier
latestObserved
observedAhead
missingRanges
admitted identities
integrity conflicts
rejected Signals
```

Permanent:

```text
LATEST_OBSERVED != CONTINUITY_FRONTIER
SIGNAL_ARRIVED != SIGNAL_ADMITTED
SAME_IDENTITY + SAME_CONTENT -> DUPLICATE / NO NEW FACT
SAME_IDENTITY + DIFFERENT_CONTENT -> INTEGRITY_CONFLICT
```

A gap and a recovery attempt are independent truths:

```text
GAP EXISTS != RECOVERY ACTIVE
RECOVERY ATTEMPT ENDED != GAP RESOLVED
```

A gap is retired or reclassified by evidence, not merely because a request timed out.

Candidate gap meanings remain:

```text
Unknown
Recoverable
AcquisitionGap
RetentionExpired
```

## Data-store pressure

Android process lifetime must not become CGM history lifetime.

```text
PROCESS_RESTART != NEW_CGM_HISTORY
IN_MEMORY_STATE != DURABLE_RECEIVER_TRUTH
```

Current VexLife-Android data law remains the baseline:

```text
REPOSITORY != DAO
ENTITY != DOMAIN MODEL
```

The likely Room shape is deliberately pressure, not frozen schema:

```text
admitted measurements / observations
+
unresolved or classified continuity gaps
+
small reconstructable continuity checkpoint
```

The durable store should support at least:

```text
identity uniqueness
ordered range reads
contiguous-frontier reconstruction
LIVE/BACKFILL observation provenance
capturedAt / observedAt separation
gap records / classifications
device/session epoch boundaries
same-identity conflict detection
no duplicate insertion on replay
reconstruction after Android process death
```

The checkpoint is an optimization/current coordinate, not the only truth:

```text
CHECKPOINT
MUST BE RECONSTRUCTABLE
FROM DURABLE ADMITTED EVIDENCE
```

When admitting one Signal requires several Room changes to preserve one invariant, perform them as
one database transaction. For example:

```text
persist missing measurement 004
+
resolve gap 004
+
advance continuity frontier 003 -> 005
=
one atomic local effect
```

A valid Signal observed before a failed Room transaction does not silently advance durable
continuity.

```text
SIGNAL OBSERVED != SIGNAL DURABLY STORED
```

Do not create a generic database abstraction merely to host this model. Use a CGM-domain repository and the smallest Room schema that preserves the admitted evidence, observation provenance, continuity invariants and restart reconstruction proven by the scenarios. Extract reusable persistence mechanics only after repeated consumers demonstrate the same relationship.

## First model acceptance criteria

Do not graduate the data model until one representation survives all of:

1. uninterrupted live stream;
2. transport loss with full backfill;
3. transport loss with true acquisition gap;
4. transport loss with retention expiry;
5. duplicate records;
6. out-of-order records;
7. device restart / new epoch;
8. live stream current while historical backfill is incomplete;
9. mg/dL / mmol/L presentation change without measurement identity change;
10. device-reported versus client-derived trend distinction;
11. stale last-known measurement cannot remain Current.

<!-- [VXG RealForever][VEX-CGM-LABS][DATA-MODEL] -->
