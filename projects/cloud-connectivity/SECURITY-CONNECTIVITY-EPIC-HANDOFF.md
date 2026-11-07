# Full Security + Cloud Connectivity — coordinated build handoff

[VXG RealForever]

## What this is

This is a **coordination handoff**, not a new semantic owner, Project, backend or architecture layer.

It coordinates:

~~~
project.full-security
project.cloud-connectivity
~~~

because a real connected operation needs both:

~~~
Full Security
    "who/what may be trusted or authorized to do this now?"

Cloud Connectivity
    "how does this operation remain correct across device/network/service/time/failure/version boundaries?"
~~~

Permanent:

~~~
FULL_SECURITY != CLOUD_CONNECTIVITY
AUTHORIZED_EFFECT != CORRECT_SYNC
CORRECT_SYNC != AUTHORIZED_EFFECT
SECURITY_SESSION != NETWORK_CONNECTIVITY
SERVICE_AVAILABLE != EFFECT_AUTHORIZED
~~~

Do not create a third SecurityConnectivityManager/Project merely to coordinate these truths.

## Human outcome

Build one understandable Vex system in which a human can:

1. compose a lawful service-feature request in the Cloud Connectivity Lab;
2. see current device-network and exact-service relationship truth;
3. see which principal/device/session/capability security facts admit or hold the effect;
4. dispatch the operation through the same Vex Family/Method/Execution path Android will use;
5. observe the synthetic Vex Home server/domain result;
6. exercise failure/currentness/idempotency/security cases without scope collapse;
7. see the resulting semantic projection in Android/Lab;
8. descend into VexBoard for architecture/evidence;
9. later swap the synthetic/local realization for a remote/cloud realization without rewriting the product contract.

## Current source anchors

### Full Security

Current formation candidate:

~~~
VexWork PR #256
branch vexboard/security-boundary-atlas-a001
project.full-security
~~~

Its most important first construction law is already:

~~~
canonical VexLife Home security owners first
-> safe read projection
-> synthetic security provider
-> product surfaces
-> real effects only later
~~~

Use:

~~~
projects/full-security/FOUNDATION-STARTING-MAP.md
projects/full-security/CANDIDATE-SECURITY-RELATIONSHIP-PATTERNS.md
projects/full-security/FULL-SCOPE-DASHBOARD-DESIGN.md
~~~

### Cloud Connectivity

Current formation candidate:

~~~
VexWork PR #257
branch cloud-connectivity/foundation-a001
project.cloud-connectivity
~~~

Use:

~~~
projects/cloud-connectivity/README.md
projects/cloud-connectivity/VEXSERVICE-CONNECTIVITY-AND-AUTOMATION.md
projects/cloud-connectivity/CLOUD-CONNECTIVITY-LAB.md
projects/cloud-connectivity/VEXLIFE-SIMULATION-PLAN.md
projects/cloud-connectivity/DEMONSTRATION-CHECKLIST.md
~~~

### Current VexLife — host + security substrate

Use current vgong24/VexLife as the lived/canonical substrate, not VexLife-Prod.

Current VexLife owns:

~~~
Vex Home identity/lifecycle/recovery
Home Bridge device membership
principal/device binding
revocation generation
remote authenticated session
capability lease
session authority
Heretic runtime lifecycle
browser/API process lifecycle
Companion / canonical Conversation
hosted-capability placement law
~~~

Relevant current source:

~~~
repo.vexlife:README.md
repo.vexlife:docs/VEXHOME-HOSTED-CAPABILITIES.md
repo.vexlife:docs/HOME-BRIDGE-REMOTE-AUTHENTICATED-SESSION.md
repo.vexlife:docs/HOME-BRIDGE-SESSION-AUTHORITY.md
repo.vexlife:scripts/macos-lifecycle.mjs
repo.vexlife:scripts/serve-browser.mjs
~~~

Do not use VexLife-Prod as the backend reference for this build. It is still being reconstructed and
is a later presentation/product consumer.

## Exact direct source packet

Use these exact links as the entry packet. They are pinned to the observed source heads at handoff
formation so the successor does not have to search for the files. Before any mutation, re-ground the
repository's current head and reopen any source that changed after these pins.

### Cloud Connectivity — VexWork PR #257

PR:
https://github.com/VexGPT/VexWork/pull/257

Pinned candidate head:
e59efe96830ba9247baa14cad28392422bbfe6cc

Read in this order:

1. Coordinated build handoff — this file
   https://github.com/VexGPT/VexWork/blob/e59efe96830ba9247baa14cad28392422bbfe6cc/projects/cloud-connectivity/SECURITY-CONNECTIVITY-EPIC-HANDOFF.md

   Why:
   owns the cross-Project sequencing, first-instance mission and integrated acceptance test.

2. Cloud Connectivity Project README
   https://github.com/VexGPT/VexWork/blob/e59efe96830ba9247baa14cad28392422bbfe6cc/projects/cloud-connectivity/README.md

   Why:
   owns Project purpose, scope, current architecture distinctions and completion direction.

3. VexService / connectivity / automation architecture
   https://github.com/VexGPT/VexWork/blob/e59efe96830ba9247baa14cad28392422bbfe6cc/projects/cloud-connectivity/VEXSERVICE-CONNECTIVITY-AND-AUTOMATION.md

   Why:
   owns the device-network / service / operation separation, candidate VexService graduation,
   Vex Home hosted-capability placement and background automation grammar.

4. Cloud Connectivity Lab
   https://github.com/VexGPT/VexWork/blob/e59efe96830ba9247baa14cad28392422bbfe6cc/projects/cloud-connectivity/CLOUD-CONNECTIVITY-LAB.md

   Why:
   owns the service-feature library, minimum-to-maximum valid contract composition, typed field
   controls, lawful error forms, outward scope, validation and contract-evolution boundary.

5. VexLife simulation plan
   https://github.com/VexGPT/VexWork/blob/e59efe96830ba9247baa14cad28392422bbfe6cc/projects/cloud-connectivity/VEXLIFE-SIMULATION-PLAN.md

   Why:
   owns C01-C37 scenario pressure and the synthetic system topology.

6. Demonstration checklist
   https://github.com/VexGPT/VexWork/blob/e59efe96830ba9247baa14cad28392422bbfe6cc/projects/cloud-connectivity/DEMONSTRATION-CHECKLIST.md

   Why:
   defines the coverage/proof envelope; use it to prevent a narrow happy-path implementation from
   being mistaken for the completed demonstrator.

7. Cloud Connectivity Workgraph
   https://github.com/VexGPT/VexWork/blob/e59efe96830ba9247baa14cad28392422bbfe6cc/workgraphs/segments/cloud-connectivity.json

   Why:
   owns current Work ordering/dependencies/state. Do not reconstruct sequencing from prose when the
   graph already states it.

### Full Security — VexWork PR #256

PR:
https://github.com/VexGPT/VexWork/pull/256

Pinned candidate head:
b83c63d8092667a1c1d1856422e02128ddac4be1

Read these exact sources:

1. Foundation starting map
   https://github.com/VexGPT/VexWork/blob/b83c63d8092667a1c1d1856422e02128ddac4be1/projects/full-security/FOUNDATION-STARTING-MAP.md

   Why:
   most important build source. It identifies canonical VexLife Home as the security owner and gives
   F0-F7 ordering. Consume this before inventing account/device/session backend state.

2. Candidate security relationship patterns
   https://github.com/VexGPT/VexWork/blob/b83c63d8092667a1c1d1856422e02128ddac4be1/projects/full-security/CANDIDATE-SECURITY-RELATIONSHIP-PATTERNS.md

   Why:
   names repeated security pressures such as Possession, Admission, Session, Capability, Revocation,
   Rebinding, Currentness Reconciliation, Integrity, Recovery and Evidence without promoting them
   into a universal SecurityManager.

3. Full-scope dashboard design
   https://github.com/VexGPT/VexWork/blob/b83c63d8092667a1c1d1856422e02128ddac4be1/projects/full-security/FULL-SCOPE-DASHBOARD-DESIGN.md

   Why:
   scale pressure only. Do not start implementation here; use it to ensure the shared semantic model
   will scale after the causal body works.

4. Android account/device scenarios
   https://github.com/VexGPT/VexWork/blob/b83c63d8092667a1c1d1856422e02128ddac4be1/projects/full-security/ANDROID-ACCOUNT-DEVICE-SCENARIOS.md

   Why:
   source-backed scenario pressure for admission/session/revocation/reinstall/offline/currentness.

5. Full Security Workgraph
   https://github.com/VexGPT/VexWork/blob/b83c63d8092667a1c1d1856422e02128ddac4be1/workgraphs/segments/full-security.json

   Why:
   owns current dependency/state order for the Full Security lane.

### Current VexLife — canonical host + security substrate

Observed current main head at handoff formation:
7d59753687ff12726b0d309ee2dde028b5f89e8a

Repository:
https://github.com/vgong24/VexLife/tree/7d59753687ff12726b0d309ee2dde028b5f89e8a

Read only these implicated sources first:

1. VexLife README
   https://github.com/vgong24/VexLife/blob/7d59753687ff12726b0d309ee2dde028b5f89e8a/README.md

   Why:
   current lived startup/product topology; establishes one human front door, Home custody, runtime
   and browser/API process behavior.

2. Vex Home hosted capabilities
   https://github.com/vgong24/VexLife/blob/7d59753687ff12726b0d309ee2dde028b5f89e8a/docs/VEXHOME-HOSTED-CAPABILITIES.md

   Why:
   canonical placement law for the first Cloud Connectivity server realization:
   CAPABILITY_CONTRACT != DEPLOYMENT_TOPOLOGY.

3. Remote authenticated session
   https://github.com/vgong24/VexLife/blob/7d59753687ff12726b0d309ee2dde028b5f89e8a/docs/HOME-BRIDGE-REMOTE-AUTHENTICATED-SESSION.md

   Why:
   owns remote possession/session authentication meaning. Do not reproduce it in Cloud Connectivity.

4. Session authority
   https://github.com/vgong24/VexLife/blob/7d59753687ff12726b0d309ee2dde028b5f89e8a/docs/HOME-BRIDGE-SESSION-AUTHORITY.md

   Why:
   owns current session + membership + capability/revocation admission meaning. This is the security
   side of the first integrated operation.

5. Mac lifecycle
   https://github.com/vgong24/VexLife/blob/7d59753687ff12726b0d309ee2dde028b5f89e8a/scripts/macos-lifecycle.mjs

   Why:
   shows how one human start converges/reuses owned processes. Use it to preserve:
   NEW CAPABILITY != NEW HUMAN-MANAGED TERMINAL.

6. Browser/API process
   https://github.com/vgong24/VexLife/blob/7d59753687ff12726b0d309ee2dde028b5f89e8a/scripts/serve-browser.mjs

   Why:
   current HTTP composition surface at 127.0.0.1:18110. It may host the first bounded Cloud
   Connectivity module, but HTTP_ROUTE != CLOUD_DOMAIN_OWNER.

Do not broad-read all VexLife before starting. Descend from these sources into an implementation file
only when the exact next edge requires it.

### Current VexLife-Android — semantic/runtime architecture

Observed current main head at handoff formation:
ecbb6987d1da338fa0adf7297456d3f652f04155

Repository:
https://github.com/vgong24/VexLife-Android/tree/ecbb6987d1da338fa0adf7297456d3f652f04155

Required architecture sources:

1. Stable VexFamily
   https://github.com/vgong24/VexLife-Android/blob/ecbb6987d1da338fa0adf7297456d3f652f04155/architecture/behavior/src/main/kotlin/com/vextreme/vexlife/android/behavior/VexFamily.kt

   Why:
   Cloud Connectivity uses this grammar:
   Control + CURRENT State -> act(...) -> admitted State + Begin.

2. VexMethod
   https://github.com/vgong24/VexLife-Android/blob/ecbb6987d1da338fa0adf7297456d3f652f04155/architecture/behavior/src/main/kotlin/com/vextreme/vexlife/android/behavior/VexMethod.kt

   Why:
   reusable one-attempt Success / Failure / Error contract. Do not invent FooApiResult.

3. VexCompoundRelay
   https://github.com/vgong24/VexLife-Android/blob/ecbb6987d1da338fa0adf7297456d3f652f04155/architecture/relay/src/main/kotlin/com/vextreme/vexlife/android/relay/VexCompoundRelay.kt

   Why:
   reusable convergence substrate for independently owned current truths. It does not admit Family
   State.

When Android implementation begins, then descend to the exact current Connected Services/Home
security sources named by Full Security's foundation map rather than searching by analogy.

### VexArchitecture explanatory witness

These are explanation/witness surfaces, not source authority:

Builder Field Guide:
https://vgong24.github.io/Vextreme/pages/vexarchitecture-first-stable-body.html

Live Demonstration:
https://vgong24.github.io/Vextreme/pages/vexarchitecture-live-demonstration.html

Pinned Vextreme source head observed at handoff formation:
dac1378f95b9c77091b4a63b0ceba8705e018572

Use them to understand ownership and traversal. When wording and code differ, exact current source and
accepted owner relationships win.

## Minimum reading order for the successor

Do not make the successor read everything above before acting.

Read in this order:

~~~
1. this coordinated handoff
2. Full Security FOUNDATION-STARTING-MAP.md
3. Cloud VEXSERVICE-CONNECTIVITY-AND-AUTOMATION.md
4. Cloud CLOUD-CONNECTIVITY-LAB.md
5. current VexLife VEXHOME-HOSTED-CAPABILITIES.md
6. current VexLife remote session + session authority docs
7. current Android VexFamily.kt + VexMethod.kt + VexCompoundRelay.kt
8. exact implementation sources implicated by the first patient-zero contract
~~~

Use the Workgraphs/checklists as validation/navigation while building, not as a reason to postpone
the first executable edge.

## Shared execution model

The intended first topology is:

~~~
ONE HUMAN VEXLIFE START
        |
        v
VexLife lifecycle
        |
        +-- owned Heretic runtime
        |
        +-- owned VexLife browser/API process
                |
                +-- existing Vex / Conversation
                |
                +-- Cloud Connectivity hosted capability
                        |
                        +-- contract ingress
                        +-- synthetic domain owner
                        +-- synthetic durable state
                        +-- fault/perturbation realization
~~~

The Cloud Connectivity capability starts as a bounded module behind the existing VexLife HTTP process.

Permanent:

~~~
NEW CAPABILITY != NEW HUMAN-MANAGED TERMINAL
ONE PRODUCT != ONE PROCESS
HTTP_ROUTE != CLOUD_DOMAIN_OWNER
CAPABILITY_CONTRACT != DEPLOYMENT_TOPOLOGY
~~~

A sibling local service process is earned only if resource/lifetime/failure pressure requires it.
If earned, VexLife lifecycle should start/reconcile it; Victor should not become the process supervisor.

## End-to-end integrated operation circuit

~~~
Cloud Connectivity Lab
or Android feature
        |
        v
accepted Service Feature Contract
        |
        v
Family CURRENT State + Control
        |
        v
Family.act(...)
-> admitted semantic State
-> Begin(Effect, Approach)
        |
        v
bound Family.Act.Method
        |
        +-----------------------------+
        |                             |
        v                             v
NetworkConnectivityRelay       Full Security truths
device relationship            principal/device/session/capability
        |                             |
        v                             v
ServiceConnectivityRelay       effect admission/current authority
        |                             |
        +-------------+---------------+
                      |
                      v
             candidate VexService
                      |
                      v
        Vex Home Cloud Connectivity ingress
                      |
                      v
             synthetic domain owner
                      |
                      v
            synthetic durable state
                      |
                      v
          result / provider observation
                      |
                      v
       rightful currentness interpretation
                      |
            +---------+----------+
            |                    |
            v                    v
      Family.observe(...)      Relay input
            |                    |
            +---------+----------+
                      |
                      v
                  Projection
            /         |          \
         Android      Lab       VexBoard
~~~

Security answers admission/authority. Connectivity answers carriage/currentness/convergence.
Neither replaces the other.

## Build order

### Phase 0 — Re-ground current source and preserve boundaries

Before implementation mutation:

~~~
current VexLife
current VexLife-Android
Full Security PR #256
Cloud Connectivity PR #257
~~~

Re-read exact implicated repository culture/source before writes.

Do not use VexLife-Prod as backend authority.

Completion:

~~~
exact current owners known
no duplicate backend/session/service owner proposed
~~~

### Phase 1 — Shared owner/admission foundations

Do these before UI or network effects.

Full Security:

~~~
work.full-security.canonical-owner-adoption-foundation
~~~

Cloud Connectivity:

~~~
work.cloud-connectivity.system-topology
work.cloud-connectivity.network-service-connectivity-relays
~~~

Outcome:

~~~
canonical Home security owners adopted
device NetworkConnectivity question bounded
per-service connectivity question bounded
Family / VexService / Method / Execution ownership explicit
~~~

### Phase 2 — Read-only contracts/projections

Full Security:

~~~
work.full-security.device-relationship-projection-foundation
~~~

Cloud Connectivity:

~~~
work.cloud-connectivity.contract-workbench-lab
~~~

Form the first accepted service-feature contract from one source representation.

Prefer:

~~~
OpenAPI / JSON Schema / existing code-owned contract
~~~

before new Vex schema.

First Lab patient zero:

~~~
Global Announcement
~~~

because it pressures:

~~~
bounded text
enum severity
optional currentness fields
outward scope
lawful errors
UI consequence
notification convergence
~~~

At the end of Phase 2, the Lab can compose/validate exact contract expressions but performs no live
security or cloud mutation.

### Phase 3 — Synthetic providers on the same seams

Full Security:

~~~
work.full-security.synthetic-demonstration-provider-foundation
~~~

Cloud Connectivity:

~~~
work.cloud-connectivity.vexservice-candidate-foundation
work.cloud-connectivity.synthetic-cloud
~~~

Implement the Cloud Connectivity synthetic server as a **Vex Home hosted capability** behind current
VexLife lifecycle/HTTP composition.

The security synthetic provider and cloud synthetic provider remain distinct owners but are composed
for integrated scenarios.

Completion:

~~~
Lab request
-> typed validation
-> synthetic security admission
-> synthetic cloud/domain result
-> observation
-> Lab projection
~~~

with no real account/device/cloud mutation.

### Phase 4 — First integrated secured connected operation

Use one operation that needs both Projects.

Recommended first integrated path:

~~~
Global Announcement read/poll
~~~

Why first:

~~~
server/service fetch
current service relationship
session/authority read admission
Family observation
UI consequence
notification convergence
minimal mutation risk
~~~

Then add a controlled outward announcement expression only in SYNTHETIC mode.

Required proof:

~~~
network available != authority admitted
service available != authority admitted
authorized request != successful domain effect
provider result != Family State until interpreted
~~~

### Phase 5 — Android consumes the same service contract

Implement in current VexLife-Android, not a duplicate test client.

Priority:

~~~
NetworkConnectivityRelay
-> ServiceConnectivityRelay
-> candidate VexService dependency
-> one Family/Method operation
-> security projection/session/authority consumption
-> resulting Family/Projection UI
~~~

Do not begin by adding a large dashboard.

The Lab and Android should be two consumers of the same service-feature contract:

~~~
LAB CLIENT
ANDROID CLIENT
    \       /
     SAME CONTRACT
         |
         v
Vex Home hosted capability
~~~

### Phase 6 — Hard distributed-systems patient zero

Add the stronger Principal-level operation:

~~~
C05 — server commits, response lost
~~~

Recommended domain patient zero:

~~~
Measurement Upload
~~~

Prove:

~~~
durable operation identity
first carriage attempt
server commit
response unavailable
local outcome unknown
process restart / retry same operation
server idempotent-current result
no duplicate domain effect
Android reconciliation
VexLogger chronology
~~~

Security must remain current for the retry; an earlier admitted session/authority does not become
standing authority.

### Phase 7 — Background automation

Cloud Connectivity:

~~~
work.cloud-connectivity.background-service-automation
~~~

Pressure:

~~~
periodic VexLogger bulk upload
announcement polling
OS background scheduling
network/service convergence
~~~

When semantic controls exist:

~~~
human/debug action
+
automation condition
-> same Family Control
~~~

When no product semantic question exists, keep infrastructure work non-Family.

### Phase 8 — Multi-device + revocation/currentness convergence

Now combine:

Full Security scenario pressure:

~~~
multiple admitted devices
revocation
expired/stale session
reinstall/new credential
route change stable identity
stale offline authority
~~~

Cloud Connectivity pressure:

~~~
two/five-device cloud state
offline device
conflict/currentness
queued work after revocation
process restart
API version compatibility
~~~

This is where the two Projects should visibly interact most strongly.

### Phase 9 — Product breadth and VexBoard/Vex explanation

Only after the common contracts and synthetic end-to-end circuit work:

~~~
Android Connected Devices
Full Security dashboard
Cloud Connectivity Lab breadth
VexBoard architecture/evidence projection
Vex-guided explanation
~~~

VexLife-Prod may later become a product presentation consumer when its own source trajectory is ready.
It is not required to prove the host/server substrate.

### Phase 10 — Real effects/provider realization

Last:

~~~
LIVE_OBSERVATION
real Home admission/revocation controls
real remote Android transport
real durable server/store
real process-death/background proof
optional AWS realization
real multi-device lived proof
~~~

Each requires exact target-repository/provider authority separately.

Do not promote a successful synthetic scenario into a live-effect claim.

## First instance mission

A fresh build instance should **not** try to finish both Projects at once.

Its first bounded mission is:

~~~
1. re-ground current VexLife + Android
2. consume Full Security canonical-owner map
3. consume Cloud Connectivity VexService/Lab maps
4. form one exact shared service-feature contract:
      Global Announcement
5. implement/read-proof the minimum contract projection
6. form the Vex Home hosted-capability synthetic ingress/domain owner
7. compose synthetic security admission with that ingress
8. prove one Lab round trip:
      compose
      validate
      security admit/hold
      service/domain result
      observation
      semantic projection
9. preserve exact next edge for Android consumer implementation
~~~

Do not widen into:

~~~
AWS
real device revocation
VexLife-Prod backend work
full security dashboard
all C01-C37 scenarios
multi-device lived effects
~~~

during that first mission.

## First integrated acceptance test

Minimum useful proof:

~~~
Given:
    accepted Announcement contract
    NetworkConnectivity = Available
    Announcement ServiceConnectivity = Available
    synthetic principal/device/session/capability = admitted

When:
    Lab forms one minimum-valid Announcement poll/read request

Then:
    same contract validates
    security layer admits the request
    Vex Home hosted capability handles it
    synthetic domain owner returns one announcement observation
    Announcement Family interprets it
    Lab projects Unacknowledged announcement truth
    VexBoard source refs can explain the owner path

And:
    setting session/capability to denied holds the operation
    without changing NetworkConnectivity to unavailable
~~~

That one test proves the Security/Connectivity ownership split in executable form.

## Handoff completion

The successor instance should return with:

~~~
exact current source refs
exact contract source
implemented paths
tests/proof actually run
what remains synthetic
what remains unimplemented
one next unconsumed edge
~~~

No claim of live security/cloud authority unless exact target owners and effects were separately
authorized and observed.

<!-- [VXG RealForever][FULL-SECURITY][CLOUD-CONNECTIVITY][COORDINATED-BUILD-HANDOFF] -->
