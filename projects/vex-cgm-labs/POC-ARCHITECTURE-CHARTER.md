# VexCgmLabs — POC architecture charter

`[VXG RealForever]`

**Status: VEXCGMLABS PARTNER ARCHITECTURE STABILITY POINT**

This document records the current end-to-end architecture earned by the VexCgmLabs pressure set.
The reusable Partner grammar is no longer a speculative root: it has survived CGM, connected-pen,
insulin-pump, provider-representation, execution-ordering, persistence/restart, cross-Family
feedback and source-derived VexBoard projection pressure.

Android PR #219 is merged accepted source at `7800c17909fd03d1170ec0211a6632172c87d1af` after exact-head SourceOwner proof,
fresh Independent Assurance, generated Room-v6 source proof and a bounded connected synthetic Room-restart
proof. That closes repository acceptance for this architecture stability point; it does not claim real
Local HTTP/BLE lifecycle, physical medical-device behavior, or production medical use.

It does not grant Android mutation, BLE hardware, patient-data, cloud, security or regulatory
authority.

## Human outcome

Build one synthetic CGM sender/receiver practicum where a human can see:

```text
what the device produced
what the Connection delivered
what Android observed
what Android durably admitted
what continuity Android can prove
what is still missing / conflicting / recoverable
what semantic State is current
what the human-facing DisplayState truthfully says
```

Then replace the first Local HTTP realization with BLE while preserving equivalent CGM meaning for
equivalent device events.

The broader architecture question is:

> Can Vex prove a small reusable external-signal pattern that preserves identity, continuity,
> integrity, persistence and semantic ownership without forcing CGM, cloud services, smart devices or
> model streams into one generic super-owner?

## VexLife-Android anchors

Historical / project-formation grounding checkpoint:

```text
repo: vgong24/VexLife-Android
main: ecbb6987d1da338fa0adf7297456d3f652f04155
```

That SHA records the Android source observed when this Project/charter pressure was formed. It is not present Android currentness authority. The accepted Partner source is VexLife-Android PR #219 / merge `7800c17909fd03d1170ec0211a6632172c87d1af`, as recorded above.

Current source teaches three complementary relationships.

### ThemeMode — stable VexFamily round trip

```text
Control
-> ThemeModeFamily
-> admitted State + Save Effect
-> bound Method
-> VexExecution
-> ThemeModeStore
-> observed durable truth
-> ThemeModeFamily.observe(...)
-> State
-> DisplayState / Projection
```

Useful laws:

```text
EFFECT_REQUESTED != EFFECT_COMPLETED
STORE_OBSERVATION != NEW_SAVE_REQUEST
OLDER_PROVIDER_OBSERVATION MUST NOT OVERWRITE NEWER_ACCEPTED_MEANING
```

### VexStream Playback — provider observation and reconciliation pressure

VexStream Playback remains a useful behavior specimen but is not copied as the new foundation type
stack. Its current Connection demonstrates:

```text
provider observation
-> provider-specific interpretation
-> semantic Playback State
-> Projection
-> DisplayState
```

and its connection-local pending state demonstrates that implementation shock absorbers may exist
without becoming new domain concepts.

### Data / Repository — durable Android boundary

Current Android data law:

```text
REPOSITORY != DAO
ENTITY != DOMAIN MODEL
DATABASE WRITE != PRODUCT SEMANTIC SUCCESS
```

Room may persist domain evidence while Screens/Families consume domain repositories rather than DAOs.

## Historical refinement checkpoint

The branch previously promoted `VexSignal.Of<Meaning>`,
`VexEntity.Of<Meaning>`, and direct Room `@Embedded` composition as a starting answer.

That was useful discovery pressure. Those forms are superseded hypotheses rather than the current
architecture.

Current VexLife source and the CGM / connected-pen / insulin-pump comparisons expose two problems:

1. one free-standing `Meaning` / `CgmMeasurement` center can erase the rooted relationship that tells a
   future human or AI what owns the value and how it entered the application;
2. one Signal-to-one-Entity picture does not survive richer device vocabularies such as temperature,
   trend, meaningful history responses, sparse dose events, pump delivery observations, and command
   reconciliation.

Therefore:

```text
VexSignal.Of<Meaning>      = HELD, not foundation
VexEntity.Of<Meaning>      = HELD, not foundation
Room @Embedded domain      = HELD, not current VexLife precedent
EntityForm<Domain, Entity> = HELD, not foundation
```

Do not promote another replacement abstraction merely to remove those names. First preserve the
causal sequence and let repeated Kotlin relationships emerge from several real device shapes.

## Stable causal sequence

The current reusable pressure is the end-to-end sequence itself:

```text
EXTERNAL DOMAIN REALITY
        |
        v
concrete transport representation
        |
        v
Connection receives bytes / provider representation
        |
        v
Decoder interprets that representation
        |
        v
domain-owned Signal vocabulary
        |
        v
Connection observation
    what arrived through this concrete relationship and when
        |
        v
receiver admission / reconciliation
    new / duplicate / conflict / gap / replay / other domain meaning
        |
        v
durable repository transaction
    persist only truth the receiver can actually prove
        |
        v
receiver / history truth
        |
        v
rightful semantic interpretation
        |
        v
Family State
        |
        v
DisplayState / Projection
        |
        v
Surface / human experience
```

The reverse evidence-acquisition loop re-enters the same inbound path:

```text
missing / unresolved evidence
-> lawful Connection request
-> external source
-> provider representation
-> Decoder
-> domain Signal
-> observation
-> admission
-> durability
```

Process restoration is different:

```text
Room
-> repository reconstruction
-> receiver / history truth
-> semantic State
-> Projection

RESTORATION != NEW DEVICE SIGNAL
```

## Sequences that must remain distinct

VexCgmLabs exists partly to keep these orders from collapsing:

```text
SOURCE / ACQUISITION ORDER
    what the external source actually produced

CONNECTION / DELIVERY ORDER
    what the concrete realization delivered and in what order

RECEIVER OBSERVATION ORDER
    when this Android receiver learned each occurrence

DURABLE COMMIT ORDER
    which evidence actually committed

CONTINUITY ORDER
    how far the receiver can prove the source history

SEMANTIC STATE ORDER
    what the application may truthfully conclude now

PROJECTION ORDER
    how current semantic truth is interpreted outward
```

Permanent:

```text
CONNECTION STATE != SIGNAL
SIGNAL != FAMILY STATE
SIGNAL RECEIVED != STATE CHANGED
CONNECTED != ACTIVE READING

PRODUCTION_ORDER != DELIVERY_ORDER
DELIVERY_ORDER != OBSERVATION_ORDER
SIGNAL_OBSERVED != SIGNAL_ADMITTED
SIGNAL_ADMITTED != DURABLE_COMMIT
LATEST_OBSERVED != CONTINUITY_FRONTIER
ENTITY_RESTORED != DEVICE_SIGNAL_RECEIVED
```

## Cross-domain pressure before abstraction

Do not prove reusability with one `Measurement` variable.

Pressure at least three different device shapes:

```text
CGM
    glucose
    temperature
    reported trend
    session / retention facts
    meaningful history responses
    ordered acquisition / gap pressure

CONNECTED PEN
    sparse dose events
    cartridge/device facts
    dose-history responses
    ordering only where the source contract actually guarantees it

INSULIN PUMP
    delivery observations
    reservoir/device facts
    history responses
    plus lawful outbound requests whose provider acknowledgement is not physical outcome
```

The common shape currently visible is:

```text
Connection
    receives external representation

Decoder
    external representation -> domain-owned Signal vocabulary

Signal
    what the external domain relationship told us

Observation
    how / when this receiver encountered that Signal

Receiver / admission
    what this receiver may truthfully accept or reconcile

Repository
    durable evidence boundary

Family State
    semantic conclusion over current truthful facts

Projection
    outward interpretation
```

These pressures earned a deliberately small common Kotlin root only for the relationship that
actually repeats. CGM continuity, pen sparsity, pump delivery meaning and other domain-specific
semantics remain with their rightful domain owners rather than being lifted into Partner.

Do not genericize domain nouns merely because they occupy analogous positions:

```text
MEASUREMENT != UNIVERSAL DEVICE PAYLOAD
CGM CONTINUITY FRONTIER != UNIVERSAL STREAM FRONTIER
PEN DOSE != PUMP DELIVERY
HISTORY RESPONSE != TRANSPORT BATCH
REQUESTED EFFECT != OBSERVED PHYSICAL OUTCOME
```

## Partner relationship foundation

The cross-domain walk has earned a reusable source relationship in VexLife-Android PR #219 across
CGM, connected-pen, pump, execution-ordering, Room persistence, process restart and
provider-representation variation.

### Earned reusable Kotlin relationship

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

A Partner remains an independently-owned participant. Source / Target are directional roles.
Partnership remains relationship language; no VexPartnership object is required by the current proof.

### Source is earned across three Partners

CGM, connected pen and insulin pump each independently need a Partner-owned origin coordinate:

~~~text
CgmPartner.Source
ConnectedPenPartner.Source
InsulinPumpPartner.Source
~~~

Source is carried by Partner Signals and stays independent of transport. It names the external
origin/history of a statement; it is not a global Source root, not Connection.Id, and not a runtime
RelationshipId.

### Conversion is the provider boundary

The reusable relationship does not require every provider operation to be called Decoder:

~~~text
Input
-> Connection.Conversion
-> zero or more Partner Signals
~~~

Concrete realizations keep truthful provider language:

~~~text
BLE-like ByteArray
-> CgmPartner.Connection.BleDecoder -----\
                                         +-> same CgmPartner.Source / Signal vocabulary
HTTP-like response body                  /
-> CgmPartner.Connection.HttpDecoder ----

Pen bytes  -> ConnectedPenPartner.Connection.Decoder -> Pen Signals
Pump bytes -> InsulinPumpPartner.Connection.Decoder -> Pump Signals
~~~

CGM now proves equivalent source facts can arrive in materially different provider representations
while producing equal Partner Signals. Distinct Connection.Id values still preserve which provider
relationship delivered each occurrence.

Permanent:

~~~text
PROVIDER_REPRESENTATION != PARTNER_SIGNAL
TRANSPORT_REALIZATION != PARTNER_SOURCE
CONNECTION_OCCURRENCE != SIGNAL_IDENTITY
BLE_SIGNAL_MEANING == HTTP_SIGNAL_MEANING when source facts are equivalent
~~~

The synthetic lab also protects one shared Source sequence across its independent BLE/HTTP Connection
execution lanes; this is lab-source generation pressure, not a claim that production devices need an
application-owned sequence counter.

### Three semantic pressures remain distinct

~~~text
CGM
    Glucose + Temperature
    one provider delivery -> several semantic Signals
    two provider representations -> same Partner vocabulary

CONNECTED PEN
    sparse DoseRecorded + CartridgeObserved
    no imported CGM contiguous-gap assumption

INSULIN PUMP
    DeliveryObserved + ReservoirObserved
    plus Family outbound request path
~~~

Pen and Pump converge into one InsulinStore without flattening their typed Observation provenance
into a universal event envelope.

### Receiver / Store boundary earned by Room

~~~text
Connection.receive(Input)
-> Conversion
-> Signal(s)
-> Observation(s)
-> suspend Receiver.receive(exact Observation)
-> Store.commit(...)
-> durable admission complete
~~~

Receiver is suspending because truthful admission may need to await a transaction. The exact
Observation coordinate prevents persistence from down-casting a generic occurrence merely to recover
the Connection identity/provenance it already had.

Permanent:

~~~text
Partner != Family
Signal != Family State
Store != Partner
Store != Family
Store != DAO
Store != Room Entity
ENTITY != DOMAIN MODEL
~~~

### Execution sequencing

~~~text
Partner Connection.Id
    source / Observation provenance
    durable when domain meaning requires it
    != VexExecution RelationshipId

inbound Partner receipt/admission
    live Connection execution owner
    + private runtime RelationshipId
    + Queued
    -> ordered receipt / Receiver / Store Jobs

This is the queued inbound VexExecution path. The runtime RelationshipId remains private execution
coordination and does not become Connection provenance or durable Partner identity.

Store -> Family observation
    exact Store Flow source
    + live Family owner
    -> VexExecution.observe(...)

Family consequence
    accepted Family Control relationship
    + authored Begin Approach
    -> Family-derived RelationshipId
    -> Method Job(s)
~~~

The Pump Family authors Begin(Queued · Effect.RequestPumpDelivery); launchWith().method() consumes the
already-authored Approach and identity instead of re-deciding sequencing downstream.

### Room / restart pressure implemented

CGM owns one durable Store contract with InMemoryCgmStore and RoomCgmStore realizations:

~~~text
RoomCgmStore
-> cgm_partner_observation
~~~

Room keeps explicit Connection occurrence + Partner Source/Signal fields and reconstructs historical
Observation/Signal values without running Conversion or Receiver again.

~~~text
ENTITY_RESTORED != PARTNER_SIGNAL_RECEIVED
PROCESS_RESTART != NEW_SOURCE_HISTORY
~~~

The restart proof closes and reopens a file-backed VexLifeDatabase, reconstructs equal historical
meaning with new process-local object identity, inserts no row during restore, then continues the same
synthetic Source sequence.

### VexBoard projectability

VexBoard PR #276 is merged as accepted Partner projector infrastructure at `e24af6945eb8560c63070b2e32bb43913c042fba`.
VexWork PR #281 is also merged at `776932d2a8cc27ea05b77dc2db320789138a2cdc`, so the source-epoch Screen Lens now projects
current accepted Android Partner source through the existing Behavior / Depth pair while retaining its
historical Stable epoch.

Representative inbound Depth:

~~~text
Partner
-> Connection
-> VexExecution · Queued inbound admission
-> concrete Conversion
-> Partner Source --data--> Signal
-> Observation
-> Receiver
-> Store
-> VexExecution.observe(store::snapshots)
-> Family State
~~~

The consolidated Partners Circuit Screen now has six source-proven PARTNER_CIRCUIT controls with zero
held controls. BLE-like and HTTP-like CGM controls project different Conversion nodes but the same
CgmPartner.Source / Signal / Store / Family vocabulary. Six pathways normalize into twelve
Behavior/Depth layouts with zero detected collisions.

Stable remains pinned to its accepted historical Android epoch. Main now projects current accepted
Android source through merged PR #281; projector capability never silently promotes Stable.

### Current proof boundary / next edge

Implemented source includes Source/Conversion contracts, dual CGM provider forms, conversion
equivalence tests, distinct Connection provenance, shared synthetic Source sequence fencing, Room v6
schema declaration/migration source, restart instrumentation, queued receipt tests, and live Room
debug construction.

Accepted #219 repository proof established:

~~~text
focused VexPartner foundation proof
focused Partner / navigation / feedback proof
vexVerifyLocal + Android-test assembly
generated Room v6 schema JSON
Room v6 schema sha256 = 13ca1b607df6c732d24feb82f7c205a00600c885a8678fe3363103c357571bea
post-proof source clean
bounded connected synthetic Room-restart test = PASS
~~~

The synthetic BLE/HTTP forms prove provider-representation reuse, not real network/radio lifecycle.
Real Local HTTP and BLE/GATT lifecycle, physical medical-device behavior and deeper CGM
continuity/gap/history semantics remain later pressure.

ThemeMode / VexStream migration and a first-class Partnership owner remain held.

## Rooted source formation

Current VexLife culture requires source-readable rooted trees and explicit root-to-root boundaries.
The Partner pressure has now answered the reusable root question:

```text
CgmPartner
├─ Source
├─ Signal
└─ Connection
   ├─ Id
   ├─ concrete Conversion
   ├─ Observation
   └─ Receiver

ConnectedPenPartner
└─ same relationship grammar, sparse domain meaning

InsulinPumpPartner
└─ same relationship grammar, bidirectional Family/Partner pressure
```

A future human or AI should be able to discover ownership from these source relationships rather
than reconstructing it from package proximity, matching class names, mapper conventions or
predecessor prose.

What remains open is not the existence or root of Partner. Remaining work is concrete provider
lifecycle, CGM-specific continuity/currentness, durable scaling and any additional child that a
new recurring relationship question actually earns.

## Persistence pressure

Current VexLife-Android still owns:

```text
REPOSITORY != DAO
ENTITY != DOMAIN MODEL
DATABASE WRITE != PRODUCT SEMANTIC SUCCESS
explicit SQL schema names remain a compatibility boundary
```

Do not assume direct `@Embedded` domain composition is the reusable answer. Current VexLife source
does not establish it as the existing pattern, and coupling domain properties to Room schema names
may merely trade visible mapping for hidden persistence coupling.

The durable CGM question is larger than one Entity:

```text
source / measurement evidence
+
observation evidence
+
gap / conflict / retention evidence
+
reconstructable continuity checkpoint
```

One Signal may require several durable facts in one transaction; one transport response may yield
several independent Signals; one meaningful history Signal may carry relationship meaning beyond its
member records.

First prove the semantic / receiver relationship. Then choose the smallest Room representation that
preserves it without parallel architecture.

## Surface / outside-reality symmetry — held pressure

Current VexLife source exposes a useful mirrored shape:

```text
human-facing boundary

State
-> Projection
-> Surface
-> human

human
-> Surface interaction
-> Intent / Control
-> Family
```

and:

```text
outside-reality boundary

Effect
-> bound Method
-> Store / Connection / provider
-> outside reality

outside reality
-> provider representation
-> Decoder / observation
-> semantic reconciliation
-> Family State
```

This is useful architectural pressure around a possible semantic boundary duality, but it is **not
yet a new Vex root, "Inverse Family", SemanticPort, or other accepted foundation**.

Preserve the existing stable VexFamily / Method / Execution / Projection architecture first. Use CGM,
pen and pump to determine whether the mirrored shape survives without distortion.

## Inbound circuit

```text
EXTERNAL DEVICE
    |
    v
Local HTTP / BLE realization
    |
    v
Connection carrying the domain Signal vocabulary
    |
    v
typed domain Signal
    |
    v
receiver admission / continuity / integrity interpretation
    |
    v
domain repository
    |
    v
one Room transaction when one invariant spans several writes
    |
    v
durable receiver truth
    |
    v
rightful semantic interpretation
    |
    v
Family State
    |
    v
displayStateFor(State)
    |
    v
VexFamily.Projection(State, DisplayState)
    |
    v
UI / Lab
```

The baseline circuit does not require Relay. Relay is earned only when independently-owned complete
truths must form a new relationship truth.

## Outbound circuit

When a device relationship earns lawful Controls:

```text
Surface / caller
-> Control
-> Family.act(CURRENT State, Control)
-> accepted Act
-> admitted State? + Begin(Effect)?
-> bound Family.Act.Method
-> VexExecution
-> exact Connection / Store / provider effect
-> external device / provider
-> later outside evidence
-> inbound observation circuit
```

Permanent:

```text
EFFECT_REQUESTED != PROVIDER_ACKNOWLEDGED
PROVIDER_ACKNOWLEDGED != PHYSICAL_OUTCOME
PHYSICAL_OUTCOME BECOMES SEMANTIC TRUTH ONLY THROUGH RIGHTFUL OBSERVATION / RECONCILIATION
```

This distinction is especially important for pump-like devices.

## Signal doorway

Signal answers:

> What did the external domain relationship tell us?

It is not State, not persistence, and not necessarily one scalar value.

Candidate CGM vocabulary remains under pressure:

```text
Signal carrying glucose information
Signal carrying temperature information
Signal carrying reported trend / status information
Signal carrying session / retention information
meaningful History Signal containing range / retention evidence
```

Do not freeze one Signal subtype per Parameter or one generic `Signal<F>` merely for symmetry.

When transport grouping is only delivery convenience, normalize into independent semantic Signals.
When the collection itself carries meaning, preserve that relationship before flattening.

```text
TRANSPORT_CARDINALITY != SEMANTIC_CARDINALITY
SIGNAL_RECEIVED != STATE_CHANGED
```

## Continuity recognition

Candidate receiver knowledge:

```text
source/device identity
acquisition epoch/session
continuityFrontier
latestObserved
observedAhead
missingRanges
admitted identities
integrity conflicts
rejected Signals
```

Recognition pressure:

```text
new identity
already known / duplicate
same identity + conflicting content
ahead of continuity frontier
late arrival that fills a gap
new/different epoch
invalid / rejected Signal
```

Permanent:

```text
LATEST_OBSERVED != CONTINUITY_FRONTIER
PRODUCTION_ORDER != DELIVERY_ORDER
SIGNAL_ARRIVED != SIGNAL_ADMITTED
```

Example:

```text
source produces:
003 -> 004 -> 005

receiver observes:
003 -> 005

truth:
latestObserved = 005
continuityFrontier = 003
missing = 004

later:
004 BACKFILL

truth:
continuityFrontier = 005
missing = none
```

The producer sequence never becomes 005 then 004. Receiver observation order differs from producer
order.

## Gap versus recovery

A gap is semantic continuity truth.

A recovery operation is an attempt to change what evidence is available.

```text
GAP EXISTS != RECOVERY ACTIVE
RECOVERY ATTEMPT ENDED != GAP RESOLVED
```

Candidate gap meanings:

```text
Unknown
Recoverable
AcquisitionGap
RetentionExpired
```

Candidate recovery meanings may include:

```text
Idle
Requested
InProgress
Completed
Failed
TimedOut
```

Exact names remain held.

A timeout may end an attempt. It must not erase the unresolved gap.

A gap is retired/reclassified by evidence:

```text
missing record arrives
-> close relevant gap

device/source evidence proves no measurement existed
-> AcquisitionGap

retention evidence proves produced history can no longer be recovered
-> RetentionExpired

evidence insufficient
-> remain Unknown
```

## Durable Android circuit

Android process lifetime must not become history lifetime.

```text
PROCESS_RESTART != NEW_CGM_HISTORY
```

Likely durable relationships:

```text
Measurement/Observation evidence
Gap evidence
Continuity checkpoint
```

The checkpoint is not the only truth:

```text
CHECKPOINT MUST BE RECONSTRUCTABLE FROM DURABLE ADMITTED EVIDENCE
```

Example atomic admission:

```text
persist recovered 004
+
resolve gap 004
+
advance frontier 003 -> 005
=
one Room transaction
```

If Room fails after a Signal was observed:

```text
SIGNAL OBSERVED != SIGNAL DURABLY STORED
```

A later process restart trusts committed durable evidence, not vanished in-memory optimism.

## Restart circuit

```text
Room
-> repository reconstructs committed receiver evidence
-> admitted source facts + observation provenance + gaps / checkpoint
-> receiver / history truth
-> rightful semantic State
-> Projection / DisplayState
-> UI

then

next Connection observation
-> compare against restored durable receiver truth
-> continue the same history
```

Do not synthesize a new device Signal from Room.

```text
ENTITY_RESTORED != DEVICE_SIGNAL_RECEIVED
PROCESS_RESTART != NEW_SOURCE_HISTORY
```

The restored path and live Connection path may converge on the same semantic source facts while
retaining different truthful provenance.

## Projection and DisplayState

Avoid copying measurement fields through another chain of UI models.

State owns semantic truth and may reference the canonical measurement directly.

DisplayState answers only how that exact truth should currently be treated.

Candidate pressure:

```text
Unknown
Current
Stale
Recovering
Unavailable
```

Exact names remain held.

```text
Projection
    state = exact semantic State
    displayState = classification derived from that same State
```

The UI can ask:

```text
WHAT VALUE?
    Projection.State.latestMeasurement

HOW SHOULD IT BE TREATED?
    Projection.DisplayState
```

Formatting such as mg/dL versus mmol/L is presentation of the canonical measurement, not a new
measurement identity.

## Relay boundary

Relay is not in the baseline Signal circuit merely because reconciliation exists.

```text
one domain Signal + its current history
-> ordinary bounded admission / reconciliation
```

Relay is earned when several independently-owned complete truths participate:

```text
durable CGM history -----------\
Connection current truth ------+-> possible currentness/availability relationship
monotonic time ----------------/
acquisition truth -------------/
```

If that relationship becomes real, a Compound Relay may own only the new relationship truth and may
request lawful Family Controls. It must not acquire the source truths.

## Lab visibility

The first useful Lab should show four timelines:

```text
SOURCE / ACQUISITION
CONNECTION
RECEIVER
CONTINUITY
```

and the current independent classifications beside them, for example:

```text
Connection       Available
Acquisition      Active
Reading          Current
History          Reconciling
Gap              004 Recoverable
Recovery         InProgress
```

This is intentionally more educational than one `Connected` flag.

## Scenario pressure

`LAB-SIMULATION-PLAN.md` owns the executable scenario catalog. G01-G30 now pressure:

```text
live / loss / full recovery
true acquisition gap
retention expiry
duplicate + out-of-order
live while history incomplete
new epoch
unit/trend/currentness
unknown gap classification
same-identity conflict
invalid Signal
single vs batched equivalence
meaningful history batch
timeout + later successful recovery
no-record recovery response
moving retention frontier
interleaved live/backfill
process death and restoration
old gap surviving new epoch
connection available but Signal overdue
connection unavailable while reading remains temporarily current
cadence change
sequence vs clock disagreement
Local HTTP vs BLE semantic equivalence
Room persistence failure
```

Before promoting Signal Continuity & Integrity beyond CGM, pressure one tiny non-CGM stream fixture
with source/run identity, ordering, duplicate/conflict/gap/replay semantics.

## Searchability / source formation

The source tree itself must be a usable architecture map.

A future human or AI should be able to start from the concrete domain vocabulary and discover:

```text
what semantic root owns it
what Connection / Decoder can produce it
what receiver admits / reconciles it
what repository preserves it
what State interprets it
what Projection presents it
what verification pressures it
```

Do not rely on:

```text
matching names
package proximity
mapper conventions
parallel architecture registries
handoff prose
"everyone knows this came from BLE"
```

VexBoard should eventually project relationships already present in source and construction topology,
not require a second hand-maintained graph.

## Current Work edge

This charter advances the already-RUNNING:

```text
work.vex-cgm-labs.data-model-foundation
```

The Partner grammar itself is the stable architectural baseline for this trajectory. Accepted Android
#219 closes the bounded foundation proof rather than reopening the generic root. The next work continues
from that baseline:

```text
1. consume merged Android #219 as accepted Partner source;
2. keep source-epoch Screen Lens current through merged VexWork #281;
3. realize real Local HTTP provider lifecycle behind the same Partner vocabulary;
4. realize BLE/GATT behind the same semantic seam;
5. deepen CGM duplicate/conflict/gap/retention/currentness behavior through G01-G30;
6. keep VexBoard deriving relationships from source rather than a parallel hand-authored graph.
```

The Partner / Signal / Store / Family implementation/source predicate is satisfied, and VexWork PR
#278 merged as `e919f9a6e9f14e5a5b45bbc99e8e764b4363de15` with merge tree
`edcb85367480273408acd74f33f41e3cb645432b` exactly matching the reviewed candidate tree after
SourceOwner A012 PASS and fresh Independent Assurance with zero blocking findings. The existing Work
therefore completes its lawful `RUNNING -> VERIFYING -> COMPLETED` path. Real provider lifecycle,
deeper CGM continuity, product projection and Design Trace retain their own Work states and
dependencies.

## Remaining questions

These are genuine continuation questions. They do not make the Partner grammar provisional:

1. exact real Local HTTP lifecycle/error/cancellation/reconnect semantics;
2. exact BLE/GATT identifier and lifecycle hierarchy below the Connection seam;
3. malformed/partial provider-input evidence and whether any reusable conversion outcome is earned;
4. exact CGM acquisition/session/epoch identity beyond the current synthetic patient zero;
5. whether CGM continuity/history remains one owner or later splits by a different question;
6. durable Room representation for duplicate/conflict/gap/retention/frontier evidence and bounded range reads;
7. whether currentness/availability earns a Compound Relay from independently-owned complete truths;
8. exact CGM DisplayState classifications and freshness policy;
9. whether the Surface and outside-reality paths reveal another reusable relationship without
   creating a mirrored Family;
10. whether any new recurring Partner relationship question appears after real providers.

Continue holding structure that has not earned a different question:

```text
first-class VexPartnership owner
generic Mapper<T,U>
generic Form / Entity framework
ThemeMode migration to Partner
VexStream migration to Partner
CGM continuity/gap/history promoted globally
universal provider manager
```

Different syntax, additional domains, or longer runtime history are not by themselves evidence that
the current Partner relationship failed to scale. Add architecture only when a concrete recurring
question has no truthful owner.

<!-- [VXG RealForever][VEX-CGM-LABS][POC-ARCHITECTURE-CHARTER] -->
