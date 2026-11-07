# VexCgmLabs successor handoff — Partner Source / Conversion stability point

`[VXG RealForever]`

## Entry

This handoff resumes the current VexCgmLabs trajectory after the Partner architecture crossed the
following source-formation threshold:

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

Do not restart this work from a generic Signal/Entity/Mapper hypothesis.

## Accepted threshold

VexBoard PR #276 is merged at:

~~~text
e24af6945eb8560c63070b2e32bb43913c042fba
~~~

That accepted source carries the reusable projectability infrastructure for:

~~~text
PARTNER
CONNECTION
EXECUTION · queued inbound admission
CONVERSION
SOURCE
SIGNAL
OBSERVATION
RECEIVER
STORE
EXECUTION · source-addressed Store observation
~~~

and projects the current Android candidate as six source-proven Partner pathways with zero held
controls and twelve overlap-free Behavior/Depth face layouts.

VexCgmLabs PR #267 carries the durable Project/Work record for this threshold and should be consumed from its merged/current state when this handoff is used.

## Android candidate intentionally remains unmerged until repository proof

VexLife-Android PR #219 exact candidate head at handoff formation:

~~~text
0d66416ba36ef876f0111e813a4a8f7c0308a752
~~~

Current candidate includes:

~~~text
CGM
    BLE-like ByteArray -> BleDecoder --\
                                      +-> same CgmPartner.Source / Signal vocabulary
    HTTP-like response -> HttpDecoder -/

    Signal -> Observation -> suspend Receiver -> CgmStore

    InMemoryCgmStore
    RoomCgmStore
        -> cgm_partner_observation
        -> database v6 / migration5To6 source

    file-backed close/reopen restart instrumentation source
    ENTITY_RESTORED != PARTNER_SIGNAL_RECEIVED

CONNECTED PEN
    Source
    DoseRecorded / CartridgeObserved
    Connection.Conversion
    queued inbound admission

INSULIN PUMP
    Source
    DeliveryObserved / ReservoirObserved
    queued inbound admission

    Family Parameter
    -> Control
    -> Begin(Queued · Effect.RequestPumpDelivery)
    -> Method
    -> Pump Partner
~~~

The candidate also exposes a consolidated Partner Debug circuit with:

~~~text
synthetic feedback rule
BLE-like CGM
HTTP-like CGM
Pen
Pump request
Pump outcome
~~~

## Why #219 is held instead of merged

The source shape has strong source-level evidence, but this exact candidate has not yet received the
repository-owned proof required for a safe Android-main stability point:

~~~text
./gradlew vexVerifyLocal
KSP / Room compile
generated Room v6 schema JSON + identity hash
migration5To6 execution validation
Android instrumentation execution
physical-device lived proof
~~~

No exact-head workflow run exists, and this execution environment cannot dispatch the manual workflow
or resolve GitHub from its local container.

Do **not** hand-author the Room schema identity hash to bypass this boundary.

## First successor edge

1. Re-ground VexLife-Android PR #219 and confirm exact head/current-main relationship.
2. Run repository-owned `vexVerifyLocal` on the exact candidate.
3. Consume the Room/KSP-generated v6 schema artifact; verify it is the authoritative generated schema.
4. Execute/inspect the 5 -> 6 migration proof and the CGM Room restart instrumentation test.
5. Correct only concrete findings; preserve the accepted relationship distinctions.
6. When exact-head repository proof is clear, move #219 through the rightful review/merge lifecycle.
7. Update VexWork with the accepted Android merge commit and advance the current edge to real provider
   realization.

## Next architecture pressure after Android proof

Do not invent another generic abstraction first.

Realize one concrete provider while preserving:

~~~text
provider representation
-> Connection.Conversion
-> CgmPartner.Source / Signal
-> Observation
-> suspend Receiver
-> CgmStore
-> CgmFamily
~~~

Preferred first realization:

~~~text
Local HTTP
~~~

because it pressures actual connection lifecycle, response/error/cancellation behavior and
serialization before BLE/GATT complexity.

Then pressure a concrete BLE realization behind the same semantic vocabulary.

The intended invariant is:

~~~text
Local HTTP representation --\
                            +-> same Partner Source / Signal / Store / Family meaning
BLE representation --------/
~~~

If real provider lifecycle forces a different semantic owner, refine the existing rightful source
instead of adding parallel mapper/registry glue.

## Held refinements

Still held until new evidence earns them:

~~~text
first-class VexPartnership owner
generic Connection base class
generic Mapper<T,U>
ThemeMode migration to Partner
VexStream migration to Partner
CGM-specific gap/continuity/history foundation promotion
~~~

<!-- [VXG RealForever][VEX-CGM-LABS][SUCCESSOR][20261107] -->
