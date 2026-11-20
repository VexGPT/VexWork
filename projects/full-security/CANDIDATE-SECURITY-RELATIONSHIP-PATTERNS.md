# Full Security — candidate reusable security relationship patterns

`[VXG RealForever]`

## Why name patterns now

The VexStream patient zero and the Android account/device scenario suite repeat several relationship
questions. That is enough to name **candidate patterns** so VexBoard/Vex can teach them consistently.

It is not yet enough to create one universal Security Family, SecurityManager, framework, or new
VexArchitecture primitive.

```text
REPEATED QUESTION -> CANDIDATE PATTERN
CANDIDATE PATTERN != ACCEPTED UNIVERSAL ABSTRACTION
PATTERN NAME != NEW SEMANTIC OWNER
```

## P1 — Possession

Question:

> Can this actor/installation prove control of the credential associated with the claimed identity?

Shape:

```text
claimed identity
+ challenge/current context
-> credential-custody owner performs proof
-> verifier accepts/rejects possession
```

Examples:

- AndroidKeyStore device-possession signing;
- a paired VexStream bearer proving possession of the remembered per-device credential.

Permanent:

```text
POSSESSION != AUTHORIZATION
```

## P2 — Admission

Question:

> Is this identity currently allowed to join this relationship?

Shape:

```text
identity / request
+ CURRENT admission truth
+ rightful approver/authority
-> ADMIT | HOLD | DENY | REVOKED
```

Examples:

- Desktop APPROVE / DENY for a VexStream phone;
- desired VexLife Device B registration.

Permanent:

```text
IDENTIFIED != ADMITTED
ACCOUNT_VALID != DEVICE_ADMITTED
```

## P3 — Session

Question:

> Has an admitted/authenticated relationship earned a bounded current interaction lifetime?

Shape:

```text
authenticated/admitted relationship
-> bounded session
-> expiry / invalidation / reconstruction
```

Permanent:

```text
DEVICE_ADMITTED != SESSION_CURRENT
LOGOUT != DEVICE_REVOCATION
PROCESS_RESTART != STANDING_SESSION
```

## P4 — Capability

Question:

> What may this current identity/session actually do?

Shape:

```text
current identity
+ current admission
+ current session
+ requested capability
-> ALLOW bounded effect
 | HOLD / DENY
```

VexStream example:

```text
paired bearer
-> catalog/media/artwork only
!= desktop administration
```

Permanent:

```text
AUTHENTICATED != AUTHORIZED
AUTHORIZED_FOR_X != AUTHORIZED_FOR_EVERYTHING
```

## P5 — Revocation

Question:

> How is an accepted relationship withdrawn without accidentally destroying neighboring valid relationships?

Shape:

```text
target relationship identity
+ current revocation authority
-> revoke target
-> invalidate dependent current sessions/capabilities as required
-> preserve unrelated identities/relationships
```

Examples:

- forget one VexStream deviceRef;
- desired Connected Devices -> revoke Phone B while Phone A remains admitted.

Permanent:

```text
REVOKE_DEVICE_B != REVOKE_ACCOUNT
REVOKE_DEVICE_B != REVOKE_DEVICE_A
```

## P6 — Rebinding / replacement

Question:

> When an address, credential, installation, or implementation changes, which identity is continuous
> and which relationship must be re-established?

Shape:

```text
old coordinate
+ replacement candidate
+ continuity proof/currentness
-> SAME RELATIONSHIP with updated route
 | NEW IDENTITY / RE-ADMISSION REQUIRED
```

Examples:

- VexStream DHCP address change with the same pinned certificate;
- Android reinstall with a new KeyStore credential requiring new device admission;
- credential rotation.

Permanent:

```text
ROUTE_CHANGE != IDENTITY_CHANGE
NEW_INSTALLATION_CREDENTIAL != OLD_DEVICE_TRUST
```

## P7 — Currentness reconciliation

Question:

> What happens when durable remembered truth meets newer provider/server/host truth?

Shape:

```text
remembered/local state
+ current authoritative observation
-> reconcile
-> preserve, refresh, hold, revoke, or replace
```

Examples:

- reconnect to the same VexStream desktop after route change;
- offline Android returns after authorization changed;
- session expiry against durable device admission.

This is adjacent to VexArchitecture convergence/Relay, but should not automatically be called Relay.

Use Relay only when independently-owned truths genuinely produce new relationship truth. A simple
authoritative refresh or single-owner state transition may not need Relay.

```text
RECONCILIATION MAY USE RELAY
RECONCILIATION != RELAY BY DEFINITION
```

## P8 — Integrity binding

Question:

> How does the receiver know that the thing it received is the exact thing the producer meant?

Shape:

```text
expected identity/integrity binding
+ received artifact/data
-> independently verify
-> only then promote accepted local truth
```

VexStream:

```text
media SHA-256 + byte length
+ received bytes
-> verify
-> Downloaded
```

Permanent:

```text
TRANSPORT_SUCCESS != VERIFIED_EFFECT
```

## P9 — Recovery without authority widening

Question:

> How can the system recover from loss/restart/failure without silently granting more authority than
> existed before?

Shape:

```text
failure / restart / restore
+ durable admissible truth
+ current external truth
-> recover only the relationships still justified
-> reconstruct ephemeral relationships separately
```

Examples:

- process restart preserves durable device identity but not standing session;
- backup/restore does not silently clone trusted-device admission;
- VexStream reconnect updates route but not endpoint identity.

## P10 — Explanation / evidence

Question:

> What source/evidence lets a human or Vex explain why the current relationship is accepted, held, or
> denied?

Shape:

```text
stable semantic identities
+ current relationship state
+ source/evidence refs
-> read-only VexBoard projection
-> Vex-guided explanation when context is actually admitted
```

Permanent:

```text
EXPLANATION != AUTHORITY
VEXBOARD != SECURITY OWNER
```

## Relationship to VexArchitecture

These candidates fit VexArchitecture's discipline because each starts with a question and rightful
owner rather than a new layer noun.

Some may ultimately remain ordinary Family/State/Control/Effect, Store/provider, observation, or Relay
relationships.

A future extraction should ask:

```text
does an existing VexArchitecture owner already answer this?
does the same pattern repeat across materially different products/platforms?
would a shared type/contract prevent a concrete recurring failure?
who would consume the abstraction?
what burden would the new abstraction add?
```

If the existing owners are sufficient, keep the pattern as teaching/navigation vocabulary and do not
promote it into runtime architecture.

<!-- [VXG RealForever][FULL-SECURITY][CANDIDATE-RELATIONSHIP-PATTERNS] -->
