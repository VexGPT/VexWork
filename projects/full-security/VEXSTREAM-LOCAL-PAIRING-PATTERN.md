# Full Security — VexStream local-pairing patient zero

`[VXG RealForever]`

## Why this is the first real specimen

VexStream Music already demonstrates a surprisingly rich device-connection boundary without needing
to invent a hypothetical application.

Current source carries:

```text
local discovery
persistent service identity
human comparison code
explicit approval / denial
per-device remembered credential
bounded bearer authorization
credential storage through Android Keystore
individual device revocation
route recovery without identity replacement
verified media transfer
offline continuation
```

## Current source walk

```text
Desktop localhost administration
  -> stays loopback-only

human chooses Connect a phone
  -> five-minute pairing window
  -> separate TLS mobile producer becomes available
  -> mDNS advertises _vexstream._tcp
  -> advertises persistent certificate fingerprint

Android Find VexStream
  -> selects one nearby producer
  -> pins exact certificate digest before pairing data
  -> reads certificate-derived six-digit code

human compares code
  -> Android requests access with deviceRef + displayName
  -> Desktop shows pending request
  -> human APPROVE or DENY

APPROVE
  -> Desktop creates random per-device bearer
  -> Desktop stores deviceRef + displayName + bearer SHA-256 + approvedAt
  -> Android stores bearer encrypted with an Android Keystore key
  -> certificate fingerprint remains the remembered Desktop identity

later request
  -> bearer resolves one remembered deviceRef
  -> only bounded /v1 catalog/media/artwork surface is admitted

media copy
  -> catalog supplies expected mediaSha256 + mediaByteLength
  -> Android receives bytes
  -> verifies exact identity/integrity
  -> only then promotes durable local-copy truth

Desktop route changes / process returns
  -> reconnect first tries remembered routes
  -> nearby discovery is bounded recovery
  -> route may change only when the exact pinned certificate matches

forget
  -> remove one remembered device
  -> later bearer request is rejected
```

## Security questions demonstrated

```text
DISCOVERY
  which nearby service can be considered?

SERVICE IDENTITY
  is this the same Desktop rather than merely the same IP address?

HUMAN BINDING
  did the human compare and accept the same certificate-derived code?

DEVICE IDENTITY
  which Android installation/deviceRef requested pairing?

CREDENTIAL CUSTODY
  who holds the raw bearer and how is it protected?

AUTHORIZATION
  which surface does the bearer actually admit?

REVOCATION
  how can one paired phone be forgotten without deleting the whole service?

CURRENTNESS / RECOVERY
  can a route change without silently rebinding identity?

DATA INTEGRITY
  did the bytes Android received match the producer's expected media identity?

OFFLINE OWNERSHIP
  what remains true when Desktop disappears?
```

## Source anchors

- `repo.vexstream-music:docs/architecture/MOBILE-BRIDGE-V1.md`
- `repo.vexstream-music:v2/desktop/mobile/service.go`
- `repo.vexstream-music:v2/desktop/mobile/pairing.go`
- `repo.vexstream-music:v2/web/features/phone/connection.js`
- `repo.vexlife-android:app/src/main/kotlin/com/vextreme/vexlife/android/data/vexstream/PairedVexStreamMusicRepository.kt`
- `repo.vexlife-android:app/src/main/kotlin/com/vextreme/vexlife/android/data/vexstream/VexStreamConnectionStore.kt`
- `repo.vexlife-android:app/src/main/kotlin/com/vextreme/vexlife/android/vexstream/README.md`

## Non-claims

```text
LOCAL VEXSTREAM PAIRING
!= VEXHOME MEMBERSHIP
!= CANONICAL HOME AUTHENTICATION
!= CANONICAL HOME AUTHORIZATION
!= OFF-HOME PRODUCER COMPLETION
```

The specimen is useful precisely because those distinctions remain visible.

<!-- [VXG RealForever][FULL-SECURITY][VEXSTREAM][PATIENT-ZERO] -->
