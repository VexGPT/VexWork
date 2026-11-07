# VexCgmLabs successor handoff — Partner Source / Conversion stability point

`[VXG RealForever]`

## Entry

This handoff resumes the current VexCgmLabs trajectory after the Partner architecture crossed the
following reusable architecture stability point:

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

Treat this Partner relationship as the current architecture baseline for this trajectory. Do not
restart the work from a generic Signal/Entity/Mapper hypothesis, and do not mistake pending Android
repository proof/lifecycle for architectural uncertainty.

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

## Why #219 integration is held instead of merged

The Partner architecture is already earned by the cross-domain/source pressure. This exact Android
candidate still needs the repository-owned proof required for an Android-main implementation
stability point:

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

## Formed exact-head host proof

The first successor edge is already formed as a single-use **formation wrapper**. The wrapper does not
contain a stale precompiled Relay task: on Victor's Mac it acquires the exact bound current SDK source,
invokes the current source-managed `formVexRelayTaskArchiveCarrier()`, forms the current
ExactHeadSourceOwnerProof carrier, and immediately executes it.

~~~text
candidate PR
    github.pull.vexlife-android.219

candidate head
    0d66416ba36ef876f0111e813a4a8f7c0308a752

candidate tree
    b96a819f952ea7deda51cdf91d32159f623be448

changed path membrane
    33 exact paths

formation ZIP
    VEXLIFE-ANDROID-PR219-PARTNER-SOURCE-CONVERSION-ROOM-SOURCE-OWNER-A001-FORMATION--sha256-c5a874bf53b452b1170229615c1dd94bce8e17485e1c2abc7410d6b99432fd4d.zip

formation ZIP sha256
    c5a874bf53b452b1170229615c1dd94bce8e17485e1c2abc7410d6b99432fd4d

bound SDK head
    1a1495b6d42831c08a61405e682a330f223bbbcb

bound SDK tree
    851924d35441ca205a56f5c1994519921633bce0

Relay contract
    source.vexrelay.current-contract/v1

expected canonical RETURN
    RETURN-VEXLIFE-ANDROID-PR219-PARTNER-SOURCE-CONVERSION-ROOM-SOURCE-OWNER-A001.zip
~~~

Static formation qualification passed:

~~~text
bootstrap Bash syntax
formation Node syntax
JSON templates
wrapper member hashes
ZIP CRC/integrity
three proof predicates
no source payload
lifecycle effects held
device effects held
generated Room-v6 schema guard present
~~~

The three proof predicates are:

~~~text
1. focused Partner/CGM/insulin/feedback JVM proof
2. repository-owned vexVerifyLocal + :app:assembleDebugAndroidTest
3. exact head/tree/33-path + generated Room-v6 schema + clean-source guard
~~~

The third predicate emits the generated Room-v6 schema identity/SHA/base64 before checking source
cleanliness. Therefore, if KSP proves that the candidate omitted the authoritative generated v6 schema,
the SourceOwner proof fails safely and preserves enough evidence to form the smallest source correction.

Exact macOS action:

~~~bash
/bin/bash -c 'set -euo pipefail; EXPECTED="c5a874bf53b452b1170229615c1dd94bce8e17485e1c2abc7410d6b99432fd4d"; NAME="VEXLIFE-ANDROID-PR219-PARTNER-SOURCE-CONVERSION-ROOM-SOURCE-OWNER-A001-FORMATION--sha256-c5a874bf53b452b1170229615c1dd94bce8e17485e1c2abc7410d6b99432fd4d.zip"; ZIP=""; for C in "$HOME/Downloads/$NAME" "$HOME/Downloads"/*.zip; do [ -f "$C" ] || continue; [ ! -L "$C" ] || continue; H="$(/usr/bin/shasum -a 256 "$C" | /usr/bin/cut -d " " -f 1)"; if [ "$H" = "$EXPECTED" ]; then ZIP="$C"; break; fi; done; [ -n "$ZIP" ] || { echo "VexCgmLabs PR219: exact formation ZIP not found in Downloads." >&2; exit 20; }; ROOT="$(/usr/bin/mktemp -d "$HOME/Downloads/.vex-cgm-pr219-formation.XXXXXX")"; cleanup() { /bin/rm -rf -- "$ROOT"; }; trap cleanup EXIT HUP INT TERM; /usr/bin/unzip -q "$ZIP" -d "$ROOT"; WRAPPER="$ROOT/VEXLIFE-ANDROID-PR219-PARTNER-SOURCE-CONVERSION-ROOM-SOURCE-OWNER-A001-FORMATION"; [ -d "$WRAPPER" ] || exit 21; /bin/bash "$WRAPPER/bootstrap/FORM-AND-RUN-PR219.command"'
~~~

Do not rerun the same formed carrier. Return the canonical RETURN ZIP whether PASS or safe failure.

## First successor edge

1. Re-ground VexLife-Android PR #219 and confirm exact head/current-main relationship.
2. Run repository-owned `vexVerifyLocal` on the exact candidate.
3. Consume the Room/KSP-generated v6 schema artifact; verify it is the authoritative generated schema.
4. Execute/inspect the 5 -> 6 migration proof and the CGM Room restart instrumentation test.
5. Correct only concrete findings; preserve the accepted relationship distinctions.
6. When exact-head repository proof is clear, move #219 through the rightful review/merge lifecycle.
7. Update VexWork with the accepted Android merge commit and advance the current edge to real provider
   realization.

## Next implementation pressure after Android proof

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
