# VexCgmLabs — synthetic device Lab plan

[VXG RealForever]

## Human question

Can we demonstrate CGM/mobile correctness before real BLE hardware exists by keeping device semantics
stable while the first transport is easy to control?

## Lab topology

~~~
VexCgmLabs UI / fixture controls
        |
        v
Synthetic CGM Device
    acquisition owner
    sequence/epoch owner
    retained-history buffer
    trend/device-state profile
        |
        v
Wi-Fi / local HTTP or streaming realization
        |
        v
candidate CgmReader seam
        |
        v
Android-side transport-neutral observations
        |
        +-> acquisition/observation reconciliation
        +-> current measurement availability
        +-> local history
        +-> Family / Relay product meaning
        |
        v
Android / Lab projection
~~~

Later:

~~~
Synthetic Wi-Fi realization
        ↓ replace transport only
BLE realization
~~~

Required:

~~~
TRANSPORT_CHANGED
-> CGM_SEMANTIC_RESULT_UNCHANGED
~~~

for equivalent device events.

## Lab controls

The Lab should control **source/device truth**, not directly mutate Android product State.

### Sensor / acquisition

~~~
start session
end session
new acquisition epoch
acquisition active
acquisition produces no valid measurement
acquisition fault
generate next measurement
set source glucose
set source trend/rate behavior
~~~

### Transport

~~~
connected
signal/transport lost
restore transport
delay delivery
duplicate delivery
out-of-order delivery
resume live delivery before backfill completes
~~~

### Retained history

~~~
retention capacity
earliest retained sequence
expire old retained records
backfill available
backfill unavailable
partial replay
~~~

### Presentation pressure

~~~
display unit:
    mg/dL
    mmol/L

trend:
    device reported
    consumer derived
    unavailable / unknown
~~~

The Lab should not encode clinical treatment advice or universal glucose thresholds.

## Four timelines are first-class

The Lab should make the distinction visible rather than requiring an engineer to explain it.

```text
SOURCE / ACQUISITION
    what the synthetic CGM actually produced

CONNECTION
    what the concrete realization delivered, delayed, lost, duplicated or replayed

RECEIVER
    what Android actually observed and admitted

CONTINUITY
    what Android can currently prove as continuous, missing, conflicting or unrecoverable
```

Example:

```text
SOURCE
003 ---- 004 ---- 005 ---- 006

CONNECTION
003 ---- X ----- 005 ---- 006
               /
        004 BACKFILL later

RECEIVER
003 ---- 005 ---- 006 ---- 004

CONTINUITY
frontier 003
missing 004
observed ahead 005,006
then frontier 006 after 004 is admitted
```

The final historical series may be complete while the real-time observation history remains
incomplete.

Permanent:

```text
PRODUCTION_ORDER != DELIVERY_ORDER
DELIVERY_ORDER != OBSERVATION_ORDER
LATEST_OBSERVED != CONTINUITY_FRONTIER
```

## Scenario suite

### G01 — uninterrupted live stream

~~~
epoch E1
101 LIVE
102 LIVE
103 LIVE
~~~

Expected:

~~~
contiguous history
no unresolved gap
measurement availability current when freshness permits
~~~

### G02 — transport loss, acquisition continues, full backfill

~~~
101 LIVE
102 LIVE
transport lost
sensor produces 103,104,105
transport restored
106 LIVE
103..105 BACKFILL
~~~

Pressure both replay orders:

~~~
backfill before live resume
live resume before backfill completes
~~~

Expected:

~~~
all source measurements retained
103..105 provenance = BACKFILL
historical continuity eventually restored
real-time observation gap remains evidenced
~~~

### G03 — transport loss and acquisition stops

~~~
101 LIVE
102 LIVE
transport lost
acquisition produces no valid measurements
transport restored
103 LIVE
~~~

Expected:

~~~
missing interval classified as acquisition gap
no fabricated measurements
no backfill invented
~~~

### G04 — produced data ages out before reconnect

~~~
101 LIVE
102 LIVE
transport lost
sensor produces 103..200
retention later contains only 151..200
transport restored
~~~

Expected:

~~~
103..150 explicitly retention-expired / unrecoverable
151..200 may backfill
history never claims complete through unrecoverable range
~~~

### G05 — duplicate + out-of-order delivery

Delivery:

~~~
101
102
104
104 duplicate
105
103 late
~~~

Expected:

~~~
duplicate does not create a second measurement
contiguous frontier remains 102 until 103 arrives
after 103, frontier advances through 105
~~~

### G06 — live current while backfill is still incomplete

~~~
transport restored
110 LIVE
history still missing 106..109
backfill begins
~~~

Expected:

~~~
current live availability may be Current
while historical reconciliation remains incomplete
~~~

Permanent:

~~~
CURRENT_LIVE_MEASUREMENT
!= COMPLETE_HISTORY
~~~

### G07 — device restart / new epoch

~~~
epoch E1 sequence 900..950
device restart
epoch E2 sequence 1..10
~~~

Expected:

~~~
E2:1 is not duplicate of E1:1
continuity does not bridge epochs by sequence number alone
~~~

### G08 — display unit switch

Same measurement identity:

~~~
display mg/dL
-> display mmol/L
-> display mg/dL
~~~

Expected:

~~~
no new measurement identity
no new acquisition event
no provenance change
no repeated conversion drift
~~~

### G09 — trend provenance

Pressure:

~~~
device reports trend
consumer derives trend
device trend absent
reported and derived disagree
~~~

Expected:

~~~
trend source remains explicit
consumer does not silently relabel derived trend as device-reported
~~~

### G10 — stale last-known value

~~~
last valid measurement 112
no new valid measurement beyond admitted freshness interval
~~~

Expected:

~~~
last-known value may remain displayable according to product policy
but cannot remain semantically Current
~~~

### G11 — unclassified gap becomes classified later

~~~
transport interrupted
consumer initially knows only that observations are missing
reconnect metadata later proves acquisition continued + retention available
~~~

Expected:

~~~
UnknownGap
-> Recoverable transport gap
-> Backfilling
-> Reconciled
~~~

The exact state names remain implementation pressure, not frozen vocabulary.

### G12 — exact duplicate

```text
source produces 003
receiver observes 003
receiver observes identical 003 again
```

Expected:

```text
one admitted measurement
no second semantic occurrence
no false continuity movement
```

### G13 — same identity, conflicting content

```text
E1:003 = value A
later E1:003 = value B
```

Expected:

```text
do not silently replace
do not admit as a second measurement
surface an integrity conflict
```

### G14 — invalid Signal between valid Signals

```text
003 valid
004 arrives but cannot be lawfully admitted
005 valid
```

Expected:

```text
latest observed may reach 005
continuity frontier does not silently pass unresolved 004
SIGNAL_ARRIVED != SIGNAL_ADMITTED
```

### G15 — individual versus transport-batched equivalence

Run the same source history as individual deliveries and as one transport batch.

Expected:

```text
when grouping is transport-only,
semantic result is equivalent
```

### G16 — meaningful history collection

```text
request 003..008
device retention begins at 005
history returns 005..008
```

Expected:

```text
005..008 may be admitted
003..004 absence remains meaningful evidence
the collection is not flattened before its range meaning is interpreted
```

### G17 — recovery attempt times out

Expected:

```text
Recovery attempt = timed out
Gap still exists
```

### G18 — later recovery attempt succeeds

Expected:

```text
same gap may survive multiple attempts
recovered identity is admitted once
continuity closes only when evidence arrives
```

### G19 — recovery completes with no matching records

Expected:

```text
do not fabricate history completion
do not automatically classify acquisition gap
reclassify only as far as evidence supports
```

### G20 — retention frontier moves during recovery

Expected:

```text
previously recoverable prefix may become retention-expired
remaining range may still recover

RECOVERABLE_NOW != GUARANTEED_RECOVERABLE_LATER
```

### G21 — live resumes before historical recovery

```text
003 LIVE
004,005 missed
006 LIVE
004,005 BACKFILL later
```

Expected intermediate truth:

```text
latest observed = 006
continuity frontier = 003
missing = 004..005
latest live measurement may still be Current
```

### G22 — live and history interleave

```text
006 LIVE
004 BACKFILL
007 LIVE
005 BACKFILL
008 LIVE
```

Expected:

```text
continuity advances deterministically from source identity/order
arrival path does not redefine production order
LIVE/BACKFILL provenance remains visible
```

### G23 — Android process death with incomplete continuity

Before death:

```text
frontier = 003
missing = 004
observed ahead = 005
```

After restart:

```text
Room-backed admitted evidence reconstructs the same unresolved continuity
005 does not become complete-through-005 merely because memory restarted
```

### G24 — new source epoch while prior gap remains unresolved

Expected:

```text
E2 does not close E1 gaps
sequence reuse across epochs does not collide
```

### G25 — Connection available, expected Signal overdue

Expected:

```text
Connection may remain Available
Signal continuity/currentness becomes overdue
do not invent acquisition failure
```

### G26 — Connection unavailable, reading remains temporarily current

Expected:

```text
Connection = Unavailable
latest measurement may remain Current until freshness evidence expires
then Current -> Stale
```

### G27 — lawful source cadence changes

Expected:

```text
receiver expectation follows admitted source/session truth
old timing policy does not fabricate signal loss
```

### G28 — captured clock ordering disagrees with production ordering

Expected:

```text
do not reorder source occurrences solely by wall-clock time
SEQUENCE != TIMESTAMP
```

### G29 — same source scenario over Local HTTP and BLE

Expected:

```text
equivalent device events
-> equivalent Cgm Signals
-> equivalent durable continuity/integrity result
-> equivalent CGM semantic result

connection-specific diagnostics may differ
```

### G30 — valid Signal observed, local persistence fails

Expected:

```text
observation is known
durable continuity does not falsely advance
process restart trusts only committed durable evidence
storage degradation remains explicit/recoverable
```


## Synthetic protocol shape

Do not freeze route names before implementation, but the synthetic device needs equivalent operations
for:

~~~
observe current device/session metadata
subscribe/stream current observations
read retained-history frontier
read/replay an exact sequence range
apply synthetic-only Lab controls
~~~

Synthetic control endpoints are **Lab authority only** and must not be confused with a future real CGM
device contract.

~~~
SYNTHETIC_CONTROL_API != REAL_CGM_PROTOCOL
~~~

The consumer-facing observation/history seam should be the part designed for eventual BLE
substitution.

## Android realization pressure

The Android consumer should not receive:

~~~
"signalLost = true"
"scenario = G02"
"backfillButtonPressed"
~~~

as product semantic truth.

It should receive ordinary device observations:

~~~
transport state
device/session metadata
measurements
retention frontier
history replay results
device-reported statuses
~~~

and independently derive the truthful product relationships.

## Design Trace patient-zero requirements

Candidate upstream requirements for the practicum:

~~~
REQ-CGM-CONTINUITY-001
The mobile product shall distinguish a recoverable transport interruption from an interval in which
no valid measurement was acquired.

REQ-CGM-PROVENANCE-002
A retrospectively recovered measurement shall remain distinguishable from a measurement observed live.

REQ-CGM-CURRENTNESS-003
A last-known measurement shall not remain represented as Current after freshness evidence expires.

REQ-CGM-EPOCH-004
Measurements from a new acquisition epoch shall not be merged into prior sequence continuity solely
because their sequence values overlap.

REQ-CGM-UNIT-005
Changing display units shall not create a new measurement or alter measurement identity/provenance.
~~~

These are **VexCgmLabs practicum inputs**, not claims that they came from an actual manufacturer's
regulated requirements.

## Completion threshold

The Lab layer is mature enough for BLE pressure when:

~~~
one data model
+ one transport-neutral reader seam
+ one reconciliation model
+ one currentness projection
~~~

passes G01-G30 over the local synthetic realization without scenario-specific branches leaking into
product semantics. Before graduating Signal Continuity & Integrity as a reusable foundation, also
pressure one tiny non-CGM stream fixture so glucose/BLE vocabulary cannot accidentally become the
generic contract.

<!-- [VXG RealForever][VEX-CGM-LABS][LAB] -->
