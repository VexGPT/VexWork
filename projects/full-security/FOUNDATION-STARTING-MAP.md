# Full Security — foundation starting map

`[VXG RealForever]`

## Why this exists

Full Security now has enough scenarios to implement, but the product foundations needed to make those
scenarios truthful are not all present as one connected product experience.

A fresh instance should **not** begin by drawing an Accounts screen, adding a generic SecurityManager,
or opening VexLife-Prod to the network.

Begin by asking:

> Which required truth already has a canonical owner, which projection/control is missing, and which
> product surface should consume it?

The current answer is smaller than the original complex sketch because canonical VexLife already owns
several of the hard security relationships.

## Formation currentness checkpoint

Observed current source at this foundation-map formation:

```text
VexWork            dd03cabfb181cdbbe0232d292c2d12b13c8621f3
VexLife            7d59753687ff12726b0d309ee2dde028b5f89e8a
VexLife-Android    305a09eac1fabebcf2241bd207386950f41121f2
VexLife-Prod       a9ece71079b8cc6fdd0610debac679d42ef2e187
VexStream Music    7b442351047a698611b0bd11079bb38f69c9ab94
```

These hashes are a checkpoint, not standing currentness authority. Re-ground the exact implicated
repository before source mutation.

## Current owner map

### Canonical VexLife Home already owns more than the demonstrator needs to invent

Current VexLife source already establishes:

```text
remote device possession
+ principal-bound Home Bridge device membership
+ current revocation generation
-> short-lived remote authenticated session

authenticated session
+ same current principal/device membership
+ active capability lease
+ same current revocation generation
+ accepted request admission
-> bounded current session-authority tuple
```

Relevant current owner sources:

```text
repo.vexlife:docs/HOME-BRIDGE-REMOTE-AUTHENTICATED-SESSION.md
repo.vexlife:docs/HOME-BRIDGE-SESSION-AUTHORITY.md
repo.vexlife:src/core/home-bridge-remote-authenticated-session.mjs
repo.vexlife:src/core/home-bridge-session-authority.mjs
```

The current membership shape already carries meaning equivalent to:

```text
membershipRef
homeNodeRef
principalRef
deviceRef
devicePublicKey
capabilityRefs[]
approvedBy
approvedAt
revocationGeneration
state
membershipHash
```

and the current authority path preserves:

```text
SESSION_AUTHENTICATION != HOME_AUTHORIZATION
DEVICE_MEMBERSHIP != HUMAN_PRINCIPAL
SESSION_HANDLE != AUTHORITY
PAIRING_HISTORY != CURRENT_SESSION
```

Therefore:

```text
FULL_SECURITY_DEVICE_REGISTRY
should begin as a projection/consumer of canonical Home membership truth

NOT

a new independent VexLife-Prod account/device database
```

### VexLife-Android already owns device-side possession + session realization

Current Android source already has:

```text
stable local deviceRef candidate
+ AndroidKeyStore P-256 signing credential
-> device public identity + possession proof

runtime-selected private HTTPS Home route
+ possession proof
-> memory-only remote authenticated session
```

The challenge/session source already consumes:

```text
principalRef
deviceRef
membershipRef
membershipHash
revocationGeneration
devicePublicKeyFingerprintRef
```

and explicitly rejects treating possession/session as Home authorization.

Relevant current source:

```text
repo.vexlife-android:app/src/main/kotlin/com/vextreme/vexlife/android/connectedservices/VexHomeDevicePossession.kt
repo.vexlife-android:app/src/main/kotlin/com/vextreme/vexlife/android/connectedservices/VexPrivateHomeGatewayConnection.kt
```

### VexLife-Prod already owns a personal local Vex surface, not remote-device security

Current VexLife-Prod has:

```text
canonical Home/Conversation compatibility
local product service
canonical Conversation + Vex
browser/context-aware product work
```

Its retained exploration server is loopback-only.

Therefore:

```text
VEXLIFE_PROD_LOCAL_PRODUCT_SERVICE
!= FULL_SECURITY_REMOTE_DEVICE_GATEWAY
```

The Full Security project should not widen the existing local presentation/service merely because a
mobile demonstrator needs a server-shaped boundary.

### VexStream Music remains the real pairing/revocation/integrity patient zero

It supplies the first lived source example for:

```text
discovery
service identity
human comparison
device admission
per-device credential
bounded authorization
reconnect
selective revoke
integrity verification
offline continuity
```

Use it as pattern evidence, not as the canonical Home security owner.

## Foundation diagram

```text
                            CURRENT SOURCE OWNERS
┌───────────────────────────────────────────────────────────────────────────────┐
│                                                                               │
│  VexLife Home              VexLife Android            VexLife-Prod           │
│  ────────────              ───────────────             ────────────           │
│  principal/device          deviceRef                   personal local service │
│  membership                AndroidKeyStore             Conversation + Vex     │
│  capability lease          possession proof            browser/context        │
│  revocation generation     private gateway session                            │
│  session authority                                                            │
│                                                                               │
│                    VexStream Music                                             │
│                    real pairing/revoke/integrity specimen                      │
└───────────────────────────────┬───────────────────────────────────────────────┘
                                │ consume / project / pressure
                                v
                       FULL SECURITY FOUNDATIONS
┌───────────────────────────────────────────────────────────────────────────────┐
│ F0 canonical-owner adoption                                                   │
│       do not duplicate Home membership/session/authority                      │
│                                                                               │
│ F1 principal/account demonstration boundary                                   │
│       human-facing "account" -> authenticated principalRef                     │
│       account mechanism remains replaceable                                   │
│                                                                               │
│ F2 device-relationship read projection                                        │
│       current device memberships + safe status, no secret material            │
│                                                                               │
│ F3 device admission + revocation controls                                     │
│       register / approve / deny / revoke / session logout remain distinct     │
│                                                                               │
│ F4 synthetic demonstration provider                                           │
│       OFF / SYNTHETIC / LIVE_OBSERVATION never share authority state          │
│                                                                               │
│ F5 host-local recovery boundary                                               │
│       local operator can disable/recover remote-device relationships          │
│                                                                               │
│ F6 deterministic scenario harness                                             │
│       S01-S20 over the same contracts                                          │
│                                                                               │
│ F7 source/evidence projection                                                  │
│       VexBoard + later Vex guidance                                            │
└───────────────────────────────┬───────────────────────────────────────────────┘
                                │
                                v
                         PRODUCT SURFACES
┌───────────────────────────────────────────────────────────────────────────────┐
│                                                                               │
│  Android Settings                VexLife-Prod Full Security Console           │
│  ────────────────                ───────────────────────────────────           │
│  Connected Devices              synthetic/live-observation selector           │
│  This device                    principal/account specimen                    │
│  Other devices                  device memberships                            │
│  session/access status          sessions/capabilities                         │
│  Sign out                       recovery/admin controls                       │
│  Revoke device                  scenario controls in SYNTHETIC only           │
│                                                                               │
│  VexBoard                                                                    │
│  architecture + scenario explanation / exact source descent                   │
└───────────────────────────────┬───────────────────────────────────────────────┘
                                │
                                v
                               PROOF
                     contract -> source -> fixture
                     -> cross-process integration
                     -> real Android/host proof
                     -> lived human acceptance
```

## F0 — canonical-owner adoption

### Question

Which Full Security meanings already have an accepted owner?

### Recommendation

Treat canonical Home Bridge source as the first backend semantic owner for:

```text
principal/device membership
device public-key binding
capability membership
revocation generation
authenticated remote session
current session authority
```

Do not form:

```text
FullSecurityAccountDatabase
FullSecurityDeviceRegistry
FullSecuritySessionManager
```

unless a missing question is proven after adapting the current owners.

### Completion evidence

One source map / adapter design can show every Full Security relationship as:

```text
REUSE EXISTING OWNER
or
GAP — NEW OWNER REQUIRED
```

No ambiguous middle state.

## F1 — principal/account demonstration boundary

### Human question

How do we demonstrate account-oriented Android security without making VexLife itself require a SaaS
account?

### Suggested meaning

Keep:

```text
VexLife human identity
-> canonical principalRef
```

and make **Account** a demonstrator/presentation boundary:

```text
account authentication mechanism
-> proves one principalRef
```

The mechanism may later be password, passkey, recovery credential or another accepted design. Do not
freeze it merely to build the first screen.

Permanent:

```text
ACCOUNT != PRINCIPAL
ACCOUNT_CREDENTIAL != DEVICE_CREDENTIAL
ACCOUNT_AUTHENTICATION != DEVICE_ADMISSION
VEXLIFE != REQUIRES CLOUD ACCOUNT
```

### First synthetic contract pressure

The scenario provider needs only enough meaning to distinguish:

```text
ACCOUNT_UNAUTHENTICATED
ACCOUNT_AUTHENTICATED(principalRef)
ACCOUNT_AUTHENTICATION_FAILED
```

before device membership is consulted.

## F2 — device-relationship read projection

### Human question

What should Android / the host be allowed to show about connected/admitted devices?

### Suggested safe projection

A consumer-facing projection can carry meaning such as:

```text
deviceRef
presentation label              # separately owned/display-safe
membershipRef
membershipState
approvedAt
thisDevice
reachabilityState?              # only when actually observed
sessionState?                   # CURRENT / NONE / EXPIRED / UNKNOWN
capabilitySummary[]
revocationGeneration
source/currentness refs
```

It should not expose:

```text
private key
raw device public-key material unless a real UI needs it
session handle
bearer token
credential secret
Home filesystem path
raw capability lease credential
unbounded audit/private source
```

This projection becomes the common read seam for:

```text
Android Connected Devices
VexLife-Prod Full Security Console
VexBoard LIVE_OBSERVATION
Vex explanation
```

That repeated consumer pressure is what may justify a portable projection contract.

## F3 — device admission + revocation controls

### Human questions

```text
Can this new device join?
Can I remove this one device?
Can I merely sign this device out?
```

Keep three controls distinct:

```text
Register / RequestDeviceAdmission
RevokeDevice
Logout / EndSession
```

Candidate relationship:

```text
current membership projection
+ Control.RevokeDevice(deviceRef)
-> validate current revocation authority
-> mutate rightful Home membership/revocation owner
-> invalidate dependent authority/session as its contract requires
-> observe new membership/currentness
-> projection updates
```

Permanent:

```text
REVOKE_DEVICE != LOGOUT
REVOKE_DEVICE_B != REVOKE_ACCOUNT
UI_REMOVAL != REVOCATION
ANDROID != MEMBERSHIP AUTHORITY
```

Before implementation, inspect whether current VexLife already exposes the needed membership/revocation
effect. Reuse it when present; add only the missing typed consumer doorway.

## F4 — synthetic demonstration provider

### Why it should come before real multi-device product effects

S01-S20 do not require twenty destructive live-device manipulations to prove the semantics.

Create one **separate synthetic provider** behind the same product-facing read/control vocabulary:

```text
OFF
  no demonstration state

SYNTHETIC
  deterministic fake principals/devices/sessions/capabilities
  scenario reset/advance allowed
  no real trust-store mutation

LIVE_OBSERVATION
  read current owner truth
  synthetic mutation controls absent
```

Permanent:

```text
SYNTHETIC_PROVIDER != PRODUCTION_PROVIDER
SYNTHETIC_RESET != ACCOUNT RESET
SYNTHETIC_REVOKE != LIVE REVOKE
DEMO_MODE_SWITCH != AUTHORITY GRANT
```

This lets Android UI and VexBoard mature before risking a real remote VexLife-Prod pathway.

## F5 — host-local recovery / break-glass boundary

### Human question

If account/device policy becomes unusable, how does the owner of the physical VexLife host recover
without editing GitHub or trusting the broken remote path?

### Suggestion

Preserve a **host-local operational recovery** boundary separate from source control:

```text
physical/local host presence
-> explicit administrative recovery doorway
-> observe current remote-device security state
-> disable remote-device ingress and/or revoke selected/all remote device relationships
-> preserve canonical Home/Vex data unless the selected recovery action explicitly changes it
```

Do not make GitHub merge/push the ordinary emergency control.

```text
SOURCE CHANGE
!= OPERATIONAL RECOVERY

GITHUB AUTHORITY
!= LOCAL HOME SECURITY AUTHORITY
```

The exact host-authentication mechanism is not selected here. OS-user authentication may become one
candidate when implementation pressure reaches the host, but it should be earned from that platform's
current source/UX rather than assumed now.

## F6 — deterministic scenario harness

The scenario harness should execute S01-S20 against the synthetic provider using stable scenario refs.

Suggested first fixture API conceptually:

```text
selectScenario(S07)
-> fixture state:
   principal Victor
   Device A ADMITTED
   Device B ADMITTED
   session A CURRENT
   session B CURRENT

RevokeDevice(B)
-> Device B REVOKED
-> B session/authority no longer accepted
-> Device A unchanged
```

The scenario harness is a reconstruction fixture, not a second runtime implementation.

Useful proof dimensions:

```text
initial state
human/control action
expected owner effect
expected resulting state
explicit unaffected relationships
expected denial/held branch
evidence refs
```

## F7 — source/evidence projection + Vex guidance

VexBoard should project each example with a visible provenance class:

```text
CURRENT_SOURCE
SYNTHETIC_SCENARIO
DESIRED_NOT_IMPLEMENTED
HISTORICAL_EVIDENCE
```

Then later:

```text
Vex receives admitted current board/source context
-> identifies boundary/pattern
-> points to the scenario
-> explains owner / crossing / denial / currentness / proof
```

Permanent:

```text
VISIBLE_BOARD != VEX_CONTEXT
SYNTHETIC_EXAMPLE != PRODUCT_TRUTH
VEX_EXPLANATION != AUTHORITY
```

## First product surface suggestions

### Android — Connected Devices

Do not design the first version as an Accounts dashboard.

Start from the relationship Android can actually operate:

```text
Settings
-> Connected Devices

This device
  label
  membership: Admitted / Revoked / Unknown
  session: Current / None / Expired / Unknown
  access: Allowed / Held / Denied
  [Sign out]

Other devices
  Device B
    membership
    last/current evidence where rightful
    [Revoke device]
```

If account authentication is in SYNTHETIC mode, a separate demonstrator entry can show:

```text
Sign in as synthetic account
Create synthetic account
```

without pretending those controls are canonical VexLife identity.

### VexLife-Prod — Full Security Console

The host-side demonstrator can be more explicit because it is the teaching surface:

```text
Full Security
├─ Mode
│   OFF / SYNTHETIC / LIVE_OBSERVATION
│
├─ Principal
│   current synthetic/authenticated principal
│
├─ Devices
│   memberships + currentness
│
├─ Sessions
│   current/expired/revoked projections
│
├─ Capabilities
│   bounded current access
│
├─ Scenarios
│   S01-S20 when SYNTHETIC
│
└─ Recovery
    host-local controls when/if real remote-device ingress is admitted
```

This console is a projection/control surface. It does not become the Home security owner.

## Suggested construction order

```text
1. F0 canonical-owner adoption map
   ↓
2. F2 device-relationship read projection
   ↓
3. F4 synthetic provider
   ↓
4. Android Connected Devices read-only UI
   + VexLife-Prod Full Security Console read-only UI
   ↓
5. S01-S20 deterministic fixture proof
   ↓
6. F3 typed admission / logout / revoke controls in SYNTHETIC
   ↓
7. real Home consumer adapter for LIVE_OBSERVATION
   ↓
8. real revoke/admission effect only after exact current Home owner/effect route is grounded
   ↓
9. private remote-device product transport if still needed
   ↓
10. lived Android + host multi-device proof
   ↓
11. VexBoard current projection + Vex-guided explanation
```

Why this order:

```text
we can learn the UI + scenarios
before widening network exposure

we can prove read semantics
before granting mutation

we can reuse canonical Home owners
before creating new backend state

we can make synthetic complexity useful
without allowing synthetic state to touch real authority
```

## Fresh-instance entry

A fresh instance starting implementation should:

```text
1. read projects/full-security/README.md
2. read this foundation map
3. read ANDROID-ACCOUNT-DEVICE-SCENARIOS.md
4. read CANDIDATE-SECURITY-RELATIONSHIP-PATTERNS.md
5. re-ground the exact current heads for the implicated target repository
6. for backend/device semantics, read current VexLife Home Bridge owners before adding new state
7. for Android UI, read current VexLife-Android culture + Settings + Connected Services owners
8. implement only the next foundation edge, not the whole diagram
9. preserve CURRENT_SOURCE / SYNTHETIC / DESIRED distinctions in proof and VexBoard
```

Default next engineering edge after source acceptance:

```text
F0 canonical-owner adoption
-> F2 device-relationship read projection design
-> F4 synthetic provider

before account UI or real remote-device mutation
```

<!-- [VXG RealForever][FULL-SECURITY][FOUNDATION-STARTING-MAP] -->
