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
