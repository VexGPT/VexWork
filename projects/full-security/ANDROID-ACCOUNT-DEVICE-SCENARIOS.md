# Full Security — Android account + device scenario suite

`[VXG RealForever]`

## Human outcome

Turn the first complex-security conversation into an executable scenario suite rather than leaving the
cases as chat examples.

The suite intentionally separates:

```text
ACCOUNT IDENTITY
DEVICE / INSTALLATION IDENTITY
CREDENTIAL POSSESSION
DEVICE ADMISSION / AUTHORIZATION
SESSION CURRENTNESS
FEATURE EFFECT
```

so a successful answer to one question never silently answers the others.

## First complete circuit

### S01 — first device registration

```text
fresh Android installation A
-> account is created or authenticated
-> installation forms stable deviceRef A
-> AndroidKeyStore forms/holds credential A
-> public identity A is presented to the rightful admission owner
-> Device A becomes admitted for the account/principal
-> bounded authenticated session is formed
-> authorized feature access becomes available
```

Pass condition:

```text
ACCOUNT_VALID
+ DEVICE_A_ADMITTED
+ DEVICE_A_POSSESSION_PROVED
+ SESSION_CURRENT
+ REQUIRED_CAPABILITY_CURRENT
-> ACCESS
```

### S02 — logout does not forget the device

```text
Device A has an admitted relationship
-> human logs out
-> active session is destroyed/invalidated
-> Device A registration remains unless a separate Forget/Revoke action occurs
```

Permanent:

```text
LOGOUT != FORGET_DEVICE
SESSION_END != DEVICE_REVOCATION
```

### S03 — return login on the same admitted installation

```text
Device A logs in again
-> account authentication succeeds
-> Device A proves possession of credential A
-> Device A remains admitted
-> new session
-> no unknown-device registration screen
```

### S04 — correct account on unknown Device B

```text
fresh Android installation B
-> correct account credential
-> ACCOUNT_VALID
-> Device B identity/credential not admitted
-> ordinary protected feature access HELD
-> DEVICE_REGISTRATION_REQUIRED
```

Permanent:

```text
ACCOUNT_VALID != DEVICE_ADMITTED
```

### S05 — explicitly register Device B

```text
Device B requests registration
-> B supplies its public device identity
-> one rightful existing authority approves B
-> account/principal ↔ Device B binding becomes current
-> B retries/authenticates
-> B receives its own bounded session
```

The approving authority is intentionally not frozen yet. Candidate realizations include:

```text
existing trusted Device A
local VexLife-Prod host administrator
recovery/admin credential
another product-specific strong identity-verification path
```

The reusable requirement is:

```text
NEW_DEVICE_ADMISSION REQUIRES EXISTING RIGHTFUL AUTHORITY
```

not one universal approval UI.

### S06 — two admitted devices operate independently

```text
Account / principal
├─ Device A
│    ├─ credential A
│    └─ session A
└─ Device B
     ├─ credential B
     └─ session B
```

Pass condition:

```text
one principal
+ multiple independently identifiable installations
+ independent credentials
+ independent session currentness
-> both may be admitted without collapsing their identities
```

### S07 — revoke Device B without affecting Device A

```text
Device A admitted
Device B admitted
-> human selects Device B in Connected Devices
-> Revoke / Disconnect Device B
-> Device B admission becomes revoked
-> Device B active session is no longer sufficient for protected access
-> Device A remains admitted/current
```

Permanent:

```text
ACCOUNT_VALID != DEVICE_AUTHORIZED
DEVICE_B_REVOKED != ACCOUNT_REVOKED
DEVICE_B_REVOKED != DEVICE_A_REVOKED
```

### S08 — revoked device still knows the correct account credential

```text
Device B
-> account credential is still correct
-> possession proof still proves credential B
-> admission/authorization says REVOKED
-> protected access denied/held
```

This proves why authentication and authorization must remain separate.

### S09 — reinstall produces a new installation credential

```text
physical Phone A originally:
  installation A1
  credential A1

uninstall / reinstall
-> old application credential is unavailable to the new install
-> installation A2 forms credential A2
-> account authentication may still succeed
-> server/host does not silently treat A2 as admitted A1
-> DEVICE_REGISTRATION_REQUIRED
```

Permanent:

```text
PHYSICAL_PHONE != APP_INSTALLATION
APP_INSTALLATION_A1 != APP_INSTALLATION_A2
ACCOUNT_IDENTITY != DEVICE_CREDENTIAL_IDENTITY
```

## Next adversarial / lifecycle circuit

These are not optional trivia. They are the next scenario family after the first circuit:

### S10 — lost device

```text
Device A is lost
-> human uses another rightful authority
-> revoke A
-> A loses protected access
-> Device B remains current
```

### S11 — stolen/changed account credential

```text
account credential compromised or rotated
-> account-level recovery/rotation occurs
-> determine whether existing admitted-device sessions survive, reauthenticate, or are revoked
-> behavior must be explicit rather than inferred
```

No default policy is asserted by this Project yet.

### S12 — expired session on an otherwise admitted device

```text
Device A remains admitted
-> session expires
-> protected request cannot treat remembered device admission as a standing live session
-> reauthentication/session establishment required
```

Permanent:

```text
DEVICE_ADMITTED != SESSION_CURRENT
```

### S13 — stale offline authority

```text
phone was previously authorized
-> phone goes offline
-> authorization changes while offline
-> phone later reconnects
-> cached prior authority cannot silently override current server/host truth
```

Permanent:

```text
OFFLINE_CACHE != CURRENT_AUTHORITY
```

### S14 — credential rotation

```text
Device A credential A1 is intentionally replaced by A2
-> transition has explicit owner/currentness
-> A1 is no longer accepted after the accepted cutover
-> A2 does not become trusted merely because it is newer
```

### S15 — backup / restore

```text
application data is backed up/restored or cloned
-> ordinary restored identifiers/config do not silently recreate a trusted-device relationship
-> cryptographic/device-currentness checks decide what must be re-established
```

Permanent:

```text
RESTORED_DATA != RESTORED_TRUST
```

### S16 — replay / duplicate protected request

```text
same or stale protected request is replayed
-> currentness + idempotency/replay rules decide whether an effect is accepted, deduplicated, or rejected
-> transport repetition cannot silently duplicate a protected domain effect
```

### S17 — service identity / route change

```text
host IP / route changes
-> reachability may update
-> stable service identity must still match
-> route replacement alone cannot rebind trust
```

### S18 — process restart

```text
Android or host process restarts
-> durable device identity/admission may remain
-> ephemeral session must be reconstructed according to its own lifetime law
```

Permanent:

```text
DURABLE_DEVICE_IDENTITY != STANDING_SESSION
```

### S19 — application update trust

```text
new Android application version arrives
-> source/artifact/signing/update identity is evaluated by the rightful update mechanism
-> account/device trust is not a substitute for trusting arbitrary replacement software
```

### S20 — OS permission/storage change

```text
user/OS changes permission or storage availability
-> feature capability changes truthfully
-> security/session/device state is not fabricated to compensate
```

## Product feature pressure — Connected Devices

The scenarios earn a real Android product question:

> **Which devices are currently associated with my account/Home, what is their current relationship,
> and which one do I want to disconnect/revoke?**

Candidate Android presentation:

```text
Settings
-> Connected Devices
   -> This device
      device label
      admitted/current status
      session status where appropriate

   -> Other devices
      Phone B
      Tablet C
      ...

   -> select device
      -> inspect relationship
      -> Disconnect / Revoke
      -> explicit confirmation
```

The presentation does not own the registry or revocation truth.

```text
CONNECTED_DEVICES_SCREEN != DEVICE_REGISTRY
REVOKE_BUTTON != REVOCATION_AUTHORITY
UI_REMOVAL != SERVER/HOST REVOCATION
```

The rightful product owner must expose a typed read projection and typed revoke request. Android
renders and requests; it does not invent device membership.

## Demonstration-mode fit

The exact same UI can be useful in two distinct modes:

```text
SYNTHETIC
  fake Device A / B / C
  run S01-S20 without touching real authority

LIVE_OBSERVATION
  show real admitted devices/currentness when the rightful host exposes them
  destructive actions require their real authority path
```

A visual resemblance between the modes must never erase their source distinction.

<!-- [VXG RealForever][FULL-SECURITY][ANDROID][ACCOUNT-DEVICE-SCENARIOS] -->
