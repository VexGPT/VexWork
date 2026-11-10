# VexCgmLabs

`[VXG RealForever]`

## Human outcome

Build a medical-mobile practicum around a **synthetic continuous-glucose-monitor (CGM) device** whose
device semantics can be exercised before real BLE hardware exists.

A human should be able to:

```text
choose CGM/session state
-> generate live glucose observations
-> switch mg/dL / mmol/L presentation
-> pressure trend/rate semantics
-> lose transport while acquisition continues
-> reconnect and backfill retained measurements
-> distinguish backfill from acquisition gaps
-> exhaust retention and expose irrecoverable history gaps
-> restart the synthetic device / begin a new acquisition epoch
-> observe Android currentness/reconciliation behavior
-> later swap Wi-Fi/local transport for BLE without changing CGM meaning
```

Human label:

```text
VexCgmLabs
```

## Why this is a separate Project

VexCgmLabs owns **CGM/device-domain learning pressure**.

It consumes, but does not absorb:

```text
VexArchitecture
    Family / Relay / Method / Execution / Logger ownership laws

Cloud Connectivity
    service/network/offline/currentness/distributed-operation pressure

Full Security
    device/service trust, admission, authority and evidence pressure

VexBoard
    read-only architecture / Design Trace projection
```

Permanent:

```text
CGM_DOMAIN != BLE_TRANSPORT
CGM_DOMAIN != CLOUD_SYNC
CGM_DOMAIN != SECURITY_AUTHORITY

ACQUISITION_CONTINUITY != OBSERVATION_CONTINUITY
CAPTURE_TIME != OBSERVATION_TIME
MEASUREMENT_HISTORY_COMPLETE != DATA_WAS_AVAILABLE_IN_REAL_TIME
RECOVERED_OBSERVATION != REAL_TIME_OBSERVATION
```

## Current architecture stability point

The reusable external-participant grammar is now earned across the VexCgmLabs pressure set rather
than remaining the earlier free-standing `Connection<Signal>` hypothesis.

~~~text
VexPartner<Partner>
├─ Source<Partner>
├─ Signal<Partner>
└─ Connection<Partner, Signal>
   ├─ Id<Partner>
   ├─ Conversion<Input, Partner, Signal>
   ├─ Observation<Partner, Signal>
   └─ Receiver<Partner, Signal, exact Observation>
~~~

CGM currently pressures two provider representations:

~~~text
BLE-like bytes  -> BleDecoder  --\
                              +-> same CgmPartner.Source / Glucose / Temperature
HTTP-like body -> HttpDecoder --/
                              -> Observation -> Receiver -> Store -> Family
~~~

The current Android implementation candidate demonstrates queued Connection admission,
Family-authored queued Pump Effects, Room-backed CGM Store/restart reconstruction and VexBoard
Behavior/Depth projectability. These are implementation/proof surfaces around an already-earned
Partner grammar; they are not another requirement to re-decide whether the Partner relationship
exists.

See:

~~~text
projects/vex-cgm-labs/POC-ARCHITECTURE-CHARTER.md
projects/vex-cgm-labs/SUCCESSOR-HANDOFF-20261107.md
~~~

Android Partner source is now accepted through VexLife-Android PR #219 merge
`7800c17909fd03d1170ec0211a6632172c87d1af`. Exact-head proof closed the reusable Partner foundation, generated Room v6 source,
repository checks and one bounded connected synthetic Room-restart predicate. That accepted source does
not claim real Local HTTP or BLE/GATT lifecycle, physical medical-device behavior, or production medical use.

VexBoard Partner Source/Conversion projector infrastructure is accepted through merge
`e24af6945eb8560c63070b2e32bb43913c042fba`, and source-epoch Screen Lens currentness is accepted
through VexWork PR #281 merge `776932d2a8cc27ea05b77dc2db320789138a2cdc`. Stable remains historical while Main projects
current accepted Android source.

## Current-source checkpoint

At Project formation, current VexLife-Android contains no existing CGM / glucose / backfill vocabulary
that this Project must preserve.

That is a checkpoint, not standing currentness authority. Re-ground Android before implementation.

The Project began by pressuring the smallest truthful CGM model before names were earned. The
cross-domain Partner relationship is now named and stable at this Project threshold; deeper
CGM-specific continuity/currentness vocabulary remains intentionally domain-owned until its own
implementation pressure earns exact names.

## Core architecture question

For every CGM observation ask:

> Did the sensor acquire a valid measurement, what exact acquisition session/order does it belong to,
> when was it captured, when did this consumer observe it, was it live or recovered, and what gaps in
> acquisition or observation remain current?

The central decomposition is:

```text
SENSOR ACQUISITION
    what did the CGM actually produce?

TRANSPORT OBSERVATION
    what did Android receive and when?

HISTORY RECONCILIATION
    which produced records are missing/recoverable/unrecoverable locally?

PRODUCT AVAILABILITY
    what may the UI/product truthfully represent as Current / Stale / Unavailable?
```

Do not collapse those into one `Connected` flag.

## Transport-neutral device seam

The first realization should use an easy local transport such as Wi-Fi / local HTTP or a bounded
streaming channel.

Current relationship:

```text
Synthetic CGM device
        |
        +-> Local HTTP realization first
        |
        +-> BLE realization later
        |
        v
CgmPartner.Connection<Input>
        |
        v
Connection.Conversion<Input, CgmPartner, CgmPartner.Signal>
        |
        v
CgmPartner.Source / Signal
        |
        v
Connection.Observation
        |
        v
suspend Connection.Receiver
        |
        v
CgmStore
        |
        v
CgmFamily
        |
        v
Projection / DisplayState
```

The earlier `CgmReader` and pre-Partner connection forms were useful discovery steps. They are no
longer the current architecture. Provider realization may change between Local
HTTP, BLE or another concrete transport while the Partner Source/Signal vocabulary and downstream
Store/Family meaning remain stable.

Permanent pressure:

```text
CONNECTION STATE != SIGNAL
SIGNAL != FAMILY STATE
FAMILY STATE != DISPLAY STATE

CONNECTED != ACTIVE READING
SIGNAL RECEIVED != STATE CHANGED
SIGNAL OBSERVED != SIGNAL DURABLY STORED

CONNECTION FORM CHANGED
!= CGM SIGNAL MEANING CHANGED
!= CGM SEMANTIC RESULT CHANGED
```

The Connection owns communication mechanics and protocol decoding only far enough to emit admitted
CGM Signals. It must not become CGM semantic State, UI currentness, cloud synchronization, security
authority or a universal device manager.

## Data-model pressure

The Project will pressure at least these distinctions:

```text
deviceRef
stream/session/acquisition epoch
sequence / production order
captured device time
observed consumer time
glucose value + unit semantics
trend + trend source
measurement validity/status
LIVE vs BACKFILL provenance
retention frontier
transport gap
acquisition gap
retention-expired gap
unknown/unclassified gap
device restart / new epoch
```

See:

```text
projects/vex-cgm-labs/DATA-MODEL-PRESSURE.md
```

## Simulation patient zeros

The first Lab should prove the same semantic model across conditions such as:

```text
G01 normal live stream
G02 transport loss, acquisition continues, full backfill
G03 transport loss, acquisition stops, true acquisition gap
G04 transport loss, retention expires before reconnect
G05 out-of-order and duplicate observations
G06 reconnect while live data resumes before backfill finishes
G07 device restart / new acquisition epoch
G08 display unit switch without measurement identity change
G09 device-reported trend versus client-derived trend
G10 stale last-known value cannot remain Current
```

See:

```text
projects/vex-cgm-labs/LAB-SIMULATION-PLAN.md
```

## Medical design-trace practicum

VexCgmLabs is also a pressure surface for the proposed source-backed Design Trace pattern:

```text
upstream requirement / risk-control ref
-> Vex implementation pattern
-> actual source owner
-> verification source
-> observed evidence
```

The first traceability candidates should be earned from real CGM requirements such as:

```text
transport interruption with recoverable history
!= acquisition gap

backfilled measurement
!= measurement available in real time

stale measurement
must not remain projected as Current

new acquisition epoch
must not be merged into prior sequence continuity
```

Do not claim FDA / IEC / ISO compliance from this Project. It is a regulated-software design-control
practicum, not certification.

## Cross-repo realization direction

```text
VexWork
    Project / scenarios / traceability navigation

VexLife-Android
    eventual CGM semantic owners + reader/transport seams + product projection

VexLife / Vex Home
    optional synthetic device host / service lifecycle if later useful

Cloud Connectivity
    later upload/sync of CGM history

Full Security
    later device/service trust + protected outward effects

VexBoard
    Behavior / Depth / Design Trace / Verification projection
```

## Completion direction

```text
data-model pressure
-> synthetic device contract
-> CGM Lab state/control surface
-> Wi-Fi/local transport realization
-> Android transport-neutral reader seam
-> acquisition/observation reconciliation
-> truthful Android projection
-> Design Trace bindings + verification
-> BLE realization behind the same semantic seam
-> Cloud Connectivity / Full Security integration
-> lived device/mobile proof when hardware exists
```

## Formation boundary

This Project does not itself authorize:

- VexLife-Android source mutation;
- medical-device claims or clinical interpretation;
- real CGM hardware access;
- real BLE device control;
- storage/upload of real patient data;
- cloud/provider effects;
- production medical use;
- regulatory/compliance claims.

All target-repository, hardware, security and provider effects remain separately source/authority
bound.

<!-- [VXG RealForever][VEX-CGM-LABS][PROJECT] -->
