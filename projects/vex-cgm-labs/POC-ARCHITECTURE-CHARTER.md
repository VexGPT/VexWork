# VexCgmLabs — POC architecture charter

`[VXG RealForever]`

**Status: WORKING POC CHARTER — NOT ACCEPTED VEXARCHITECTURE FOUNDATION**

This document records the current end-to-end design structure earned by VexCgmLabs discussion and
current-source grounding. It is intended to start the existing VexCgmLabs data-model foundation work
without freezing names that the first implementation has not yet earned.

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

## Current VexLife-Android anchors

Grounding checkpoint:

```text
repo: vgong24/VexLife-Android
main: ecbb6987d1da338fa0adf7297456d3f652f04155
```

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

## Current refinement checkpoint

The current branch previously promoted `VexSignal.Of<Meaning>`,
`VexEntity.Of<Meaning>`, and direct Room `@Embedded` composition as a starting answer.

That was useful pressure, but it is **not settled architecture**.

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

These are **roles under pressure**, not yet a required common Kotlin root hierarchy.

Do not genericize domain nouns merely because they occupy analogous positions:

```text
MEASUREMENT != UNIVERSAL DEVICE PAYLOAD
CGM CONTINUITY FRONTIER != UNIVERSAL STREAM FRONTIER
PEN DOSE != PUMP DELIVERY
HISTORY RESPONSE != TRANSPORT BATCH
REQUESTED EFFECT != OBSERVED PHYSICAL OUTCOME
```

## Partner relationship foundation

The cross-domain walk now has a source candidate in VexLife-Android PR #219 that has survived CGM,
connected-pen, pump, execution-ordering, Room persistence, process restart, and provider-representation
variation.

### Current reusable Kotlin candidate

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

CGM owns one durable Store contract with InMemoryCgmStore and RoomCgmStore realizations. Room keeps
explicit Connection occurrence + Partner Source/Signal fields and reconstructs historical
Observation/Signal values without running Conversion or Receiver again.

~~~text
ENTITY_RESTORED != PARTNER_SIGNAL_RECEIVED
PROCESS_RESTART != NEW_SOURCE_HISTORY
~~~

The restart proof closes and reopens a file-backed VexLifeDatabase, reconstructs equal historical
meaning with new process-local object identity, inserts no row during restore, then continues the same
synthetic Source sequence.

### VexBoard projectability

VexBoard PR #276 is now merged as accepted projector infrastructure at `e24af6945eb8560c63070b2e32bb43913c042fba`. That accepted infrastructure projects the current draft Android source through the existing Behavior / Depth pair.

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

Stable/Main VexBoard remains pinned to accepted Android source; accepted projector capability does not repin the Lens to draft Android #219.

### Current proof boundary / next edge

Implemented source includes Source/Conversion contracts, dual CGM provider forms, conversion
equivalence tests, distinct Connection provenance, shared synthetic Source sequence fencing, Room v6
schema declaration/migration source, restart instrumentation, queued receipt tests, and live Room
debug construction.

Still pending repository-owned execution proof:

~~~text
Gradle/KSP compile
generated Room v6 schema JSON + identity hash
migration5To6 execution validation
Android instrumentation execution
repository-wide unit/source-alignment checks
physical-device Screen proof
~~~

The synthetic BLE/HTTP forms prove provider-representation reuse, not real network/radio lifecycle.
After exact repository proof, the next architecture pressure is a concrete Local HTTP and/or BLE
provider realization, followed by deeper CGM continuity/gap/history semantics.

ThemeMode / VexStream migration and a first-class Partnership owner remain held.

## Rooted source formation

Current VexLife culture requires source-readable rooted trees and explicit root-to-root boundaries.

For CGM, source should eventually make it locally obvious that:

```text
CGM semantic vocabulary
    has one rightful semantic root

Connection / Decoder
    remain communication mechanics

receiver / durable evidence
    remain receiver / repository truth

Family
    does not absorb transport, Room, execution or provider mechanics
```

A future human or AI should not have to infer ownership from package proximity, matching class names,
mapper conventions, or predecessor prose.

The exact Kotlin choice remains held:

```text
nested domain Signal vocabulary?
Family-bound generic relation?
feature-local typealias over a reusable Connection role?
another smaller relationship?
```

Choose only after the CGM / pen / pump shapes show which relationship actually repeats.

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

The current edge is no longer "choose the final generic Signal / Entity syntax."

It is:

```text
1. preserve the stable end-to-end causal sequence;
2. model concrete CGM Signal shapes beyond one Measurement variable;
3. pressure the same sequence with connected-pen and insulin-pump shapes;
4. identify the smallest repeated Connection / Decoder / observation relationship;
5. prove receiver admission + durable restart without provenance loss;
6. only then extract reusable Kotlin structure;
7. ensure VexBoard can recover the resulting relationships from source / construction topology.
```

No lifecycle state is promoted merely because this refinement is recorded.

Target-repository mutation remains separately authority-bound.

## Held questions

Do not freeze these before implementation pressure answers them:

1. exact Kotlin name/root for the reusable Connection relationship;
2. how domain Signal vocabulary is rooted / compiler-bound without making Family own transport;
3. whether Decoder is a child role of Connection or remains concrete until a second implementation proves it;
4. whether one provider representation decodes to zero / one / many semantic Signals and how meaningful collections remain intact;
5. exact CGM acquisition/session/epoch identity;
6. whether continuity/history remains one CGM owner or later splits by question;
7. exact Room schema and checkpoint strategy;
8. which receiver / admission mechanics actually repeat across CGM, connected pen and pump;
9. whether currentness/availability earns a Compound Relay;
10. exact BLE identifier hierarchy below the Connection seam;
11. exact names of DisplayState classifications;
12. whether the Surface and outside-reality paths exhibit a reusable semantic duality without creating a second semantic owner;
13. which relationships VexBoard can derive directly from Kotlin nesting, generic bounds and dependency construction.

Do not promote `VexSignal.Of`, `VexEntity.Of`, `EntityForm`, `Signal<F>`,
`VexReceiver`, `SemanticPort`, or an "Inverse Family" merely because the diagram looks symmetric.

<!-- [VXG RealForever][VEX-CGM-LABS][POC-ARCHITECTURE-CHARTER] -->
