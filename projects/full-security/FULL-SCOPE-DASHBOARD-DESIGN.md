# Full Security — full-scope experience and dashboard design

`[VXG RealForever]`

## Why this source exists

The first Full Security UI sketches were intentionally small enough to explain one account/device
relationship. That is no longer sufficient as the design envelope.

Before implementation, the product must demonstrate that the same experience can scale to:

```text
many principals / accounts
many authentication methods
many Homes / authorities when earned
many physical devices
many app installations
Android + later iOS / desktop / web consumers
many credentials
many sessions
many capabilities
many services
many routes
many software versions
many recovery / revocation histories
many evidence observations
```

without redesigning the semantic model each time a new case appears.

Permanent:

```text
FULL_SCOPE_DESIGN
!= IMPLEMENT EVERY PLATFORM NOW

SCALABLE_TO_IOS
!= CURRENT IOS IMPLEMENTATION

DASHBOARD
!= SECURITY AUTHORITY

ACCOUNT
!= ROOT OF EVERY SECURITY RELATIONSHIP
```

## Design thesis — relationship topology first

Do not make the primary source model:

```text
Account {
  phone1
  phone2
}
```

because it bakes one-to-many assumptions into a relationship that is actually many-to-many.

Use stable semantic identities and relationships:

```text
Principal
AuthenticationIdentity
Home / Authority Domain
PhysicalDevice
ApplicationInstallation
Credential
Membership
Session
Capability / Lease
Service
Route / Endpoint Identity
Local / Remote Data
Software Artifact / Release
Recovery / Revocation Event
Evidence / Observation
```

Examples of relationships:

```text
AuthenticationIdentity -> AUTHENTICATES_AS -> Principal

PhysicalDevice -> HOSTS -> ApplicationInstallation

ApplicationInstallation -> POSSESSES -> Credential

Principal + ApplicationInstallation
  -> MEMBER_OF / ADMITTED_TO -> Home

Credential
  -> PROVES_POSSESSION_FOR -> ApplicationInstallation

Session
  -> AUTHENTICATES -> Principal + ApplicationInstallation

Capability
  -> AUTHORIZES -> bounded Service / Effect

Route
  -> REACHES -> Service

ServiceIdentity
  -> IDENTIFIES -> Service independently of Route

SoftwareArtifact
  -> REALIZES -> ApplicationInstallation

Revocation
  -> INVALIDATES -> Membership / Credential / Session / Capability as applicable

Observation
  -> EVIDENCES -> any current relationship
```

The exact runtime representation is not selected here. The requirement is that the product-facing
model does not assume one account, one device type, one credential, one active session, or one
platform.

## Full topology example

The synthetic proving topology should be intentionally larger than the minimum happy path:

```text
Principal A — Victor
├─ authentication
│  ├─ VexLife local identity
│  ├─ Google identity [example provider]
│  └─ recovery identity
│
├─ Home A
│  ├─ Android Phone A
│  │  └─ installation A1
│  │     ├─ KeyStore credential A1
│  │     ├─ session A1-current
│  │     └─ Conversation + Maps capabilities
│  │
│  ├─ Android Tablet B
│  │  └─ installation B1
│  │     ├─ KeyStore credential B1
│  │     └─ no current session
│  │
│  ├─ iPhone C [synthetic platform example]
│  │  └─ installation C1
│  │     ├─ platform credential C1
│  │     └─ session C1-expired
│  │
│  ├─ Old Android Phone D
│  │  └─ installation D1
│  │     ├─ credential D1
│  │     └─ membership REVOKED
│  │
│  └─ Shared Tablet E
│     ├─ installation E1
│     └─ shared-device relationship pressure
│
└─ VexStream Desktop pairing
   ├─ Phone A paired
   └─ Tablet B paired

Principal B — Synthetic second human
└─ Shared Tablet E
   -> separate principal/device relationship
```

This topology deliberately pressures:

```text
1 principal -> many devices
many principals -> 1 shared device
1 physical device -> replacement installation
1 principal -> many authentication providers
1 installation -> zero / one / multiple bounded sessions over time
1 membership -> many capabilities
1 service -> multiple routes
route change -> stable service identity
device revoke -> preserve sibling devices
platform variation -> preserve semantic relationship
```

## Dashboard is a set of projections, not one giant table

### 1. Overview

Human question:

> Is anything requiring my attention, and what is connected to this Home?

Suggested summary:

```text
Principals             2
Devices                5
Admitted               4
Revoked                1
Current sessions       2
Pending admissions     1
Capabilities at risk   0
Recovery attention     1
```

Do not invent a generic security score. Show exact facts / attention conditions instead.

### 2. People / Principals

Shows:

```text
principal
linked authentication methods
Homes / memberships
devices associated through current membership
recovery methods/status
```

A Google identity or local login is a linked authentication identity, not the principal itself.

### 3. Devices

This is the scalable form of Connected Devices.

Rows may show:

```text
Device          Platform   Membership   Session   Access   Software   Attention
Phone A         Android    Admitted     Current   Allowed  Current    —
Tablet B        Android    Admitted     None      Eligible Current    —
iPhone C        iOS        Admitted     Expired   Held     Current    Re-auth
Old Phone D     Android    Revoked      Invalid   Denied   Old        Revoked
Shared Tab E    Android    Admitted     Current   Bounded  Current    Shared
```

The table must support filtering/sorting without making visual ordering semantic truth.

Selecting a row opens relationship detail rather than exposing every field in the table.

### 4. Device detail

Organize by relationship, not raw security jargon:

```text
Identity
  device
  platform
  current installation
  service/endpoint identity where relevant

Trust
  credential class
  possession currentness
  membership/admission

Current access
  sessions
  capabilities
  services

Connectivity
  current route
  service identity
  last observed reachability

Software
  application version
  artifact/update trust
  OS / permission status where relevant

Recovery
  sign out session
  revoke device
  rotate/re-register credential where admitted
  replacement/reinstall history

Evidence
  currentness/evidence refs
  explanatory provenance
```

Raw secret material is never a presentation requirement.

### 5. Sessions

Cross-device/session view:

```text
session
principal
installation/device
formed
expires
currentness
bounded access
revoked / expired / current
```

This makes:

```text
DEVICE_ADMITTED != SESSION_CURRENT
```

visible without forcing the user into each device.

### 6. Access / Capabilities

Shows bounded relationships:

```text
Conversation Send
Maps location
VexStream catalog
VexStream media stream
VexStream media copy
future capabilities
```

Viewable by:

```text
principal
device
installation
session
service
```

No UI should imply that a capability is universal merely because one device has it.

### 7. Services / Connections

Shows service relationships separately from people/devices:

```text
VexLife Home
VexStream Desktop
Conversation
Maps
future services
```

Each service may show:

```text
service identity
current route(s)
reachable/unreachable/unknown
which devices have relationships
which capabilities are relevant
```

This keeps:

```text
ROUTE != SERVICE IDENTITY
REACHABLE != AUTHORIZED
```

visible.

### 8. Software / Platform trust

Cross-platform view:

```text
installation
platform
app version
artifact/source identity
update state
platform credential class
OS permission/storage observations
```

This is how Android-specific and later iOS-specific realization can coexist under one semantic
security experience without pretending their APIs are identical.

### 9. Recovery

Operational relationships:

```text
pending admissions
revoked devices
lost/replacement device
credential rotation
account/authentication recovery
host-local recovery
restore/reinstall cases
```

Recovery actions remain typed effects with rightful owners; the dashboard does not own them.

### 10. History / Evidence

Do not create a surveillance-style generic event log as the first owner.

Project only bounded security-relevant evidence that already has a rightful source:

```text
device admitted
device revoked
session established/expired/revoked
credential rotated
route rebound to same service identity
software/update identity changed
recovery action completed
scenario observation
```

The view answers "why is this current?" rather than becoming the security truth owner.

### 11. Scenarios

Synthetic mode can select:

```text
S01-S20
+ later scale scenarios
```

without labeling the whole product as a demo.

The scenario surface may appear under an advanced / development / Full Security section.

### 12. Architecture

VexBoard is embedded/reachable here as the explanation surface:

```text
current selected object / relationship
-> Show architecture
-> bounded VexBoard neighborhood
```

A human can stay in the ordinary dashboard and open architecture only when needed.

## Teaching without noise

Full Security should **look like a real product**.

Teaching content is contextual:

```text
(i) icon
hover / focus / tap explanation
relationship detail
"Why?" drawer
"Show architecture"
Vex explanation
source/evidence link
```

Examples:

```text
Membership: Admitted   (i)
  "This device is registered for this principal/Home.
   It does not mean a session is currently active."

Session: None          (i)
  "The device remains admitted, but no current authenticated
   interaction session exists."

Access: Held           (i)
  "Current identity/session/capability requirements are not
   all satisfied. Reachability alone does not grant access."
```

Permanent:

```text
TEACHING != PRIMARY CONTENT
EXPLANATION != STATUS
HOVER_ONLY != REQUIRED ACCESSIBILITY PATH
```

Any hover explanation must also be focus/tap accessible.

## VexLife-Prod shell fit

Current VexLife-Prod already has a compiler-visible:

```text
AppSelector
```

and the retained UI currently presents Browser plus a disabled "More apps aren't connected yet"
option.

Therefore Full Security can be a real application selection:

```text
App
├─ Browser
└─ Full Security
```

The Full Security app can own its own internal navigation/projection without pretending the
AppSelector owns account/security semantics.

The Companion remains available beside the selected app when the product layout permits it:

```text
Full Security dashboard
            |
            | selected relationship / admitted context
            v
        Converse with Vex
```

Permanent:

```text
APP_SELECTOR != SECURITY OWNER
VISIBLE_DASHBOARD != VEX_CONTEXT
```

## Account scope

The dashboard should support one principal with multiple authentication methods:

```text
Principal Victor
├─ VexLife-local authentication identity
├─ Google OIDC identity [optional realization]
├─ passkey identity [possible later realization]
└─ recovery identity
```

and should also support several principals.

Permanent:

```text
PRINCIPAL != EMAIL
PRINCIPAL != GOOGLE ACCOUNT
AUTHENTICATION_PROVIDER != PRINCIPAL OWNER
AUTHENTICATION_METHOD != DEVICE CREDENTIAL
```

The first synthetic provider may model authentication methods without implementing real Google,
email/password, passkey or recovery providers.

## New scale scenarios beyond S01-S20

The dashboard design should remain valid for at least these additional synthetic cases:

```text
S21 — one principal / five admitted devices
S22 — mixed Android + synthetic iOS + desktop clients
S23 — one device / multiple principals
S24 — one principal / multiple authentication providers
S25 — one device with old installation revoked and replacement installation admitted
S26 — several concurrent sessions on different devices
S27 — same device has different capability sets across services
S28 — service route changes while service identity remains current
S29 — one device revoked while five sibling devices remain unaffected
S30 — pending admission exists while other devices continue normally
S31 — auth provider unavailable while an already-valid device/session relationship has its own policy
S32 — host recovery disables all remote ingress without deleting Home/Conversation truth
```

These scenarios are scope pressure. They do not claim all corresponding product effects exist today.

## Design acceptance criteria before implementation

Do not begin product implementation merely because a mockup looks good.

The full-scope design is acceptable when:

```text
1. 5+ devices require no new semantic field shape.
2. Android + synthetic iOS require no new security ontology.
3. Multiple principals and shared devices remain representable.
4. Multiple authentication providers bind to one principal without duplicating the principal.
5. Sessions/capabilities can vary independently per device/install.
6. Revoking one device preserves unrelated principals/devices.
7. Reinstall/replacement can preserve physical-device context without copying installation trust.
8. Service routes can change without changing service identity.
9. Synthetic and live observations are visibly/source-distinct.
10. Dashboard tables are projections; relationship identity survives sorting/filtering.
11. Teaching explanations are optional/contextual, not primary UI noise.
12. Every destructive control names the rightful effect owner before implementation.
13. VexBoard can explain any selected relationship without becoming its owner.
14. Vex can later explain admitted context without dashboard visibility being mistaken for prompt context.
```

## Recommended next design artifact

Before Android or VexLife-Prod implementation, pressure one synthetic dashboard fixture with:

```text
2 principals
5 physical devices
6 app installations
3 platform classes
3 authentication methods
4 current/expired sessions
mixed capability sets
1 pending admission
1 revoked device
1 replacement installation
VexStream pairing relationships
multiple service routes
software/update observations
```

If the dashboard and relationship projection can represent that specimen without schema redesign,
then narrow product implementation can begin by adding cases rather than changing the foundation.

<!-- [VXG RealForever][FULL-SECURITY][FULL-SCOPE-DASHBOARD-DESIGN] -->
