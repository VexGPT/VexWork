# Full Security — VexLife complex security demonstrator

`[VXG RealForever]`

## Human question

Can VexLife deliberately demonstrate the difficult multi-boundary case so a human or AI can see how
identity, device mapping, credential custody, session, authorization, currentness, data, recovery,
release trust and evidence remain separate even when they all participate in one experience?

## Desired specimen

```text
Human principal
        |
        v
Account / membership identity
        |
        v
VexLife-Prod personal host
        |
        +-> device registry / admission truth
        |
        +-> Vex / canonical Conversation
        |
        +-> read-only VexBoard projection
        |
        +-> private connected-device gateway   [DESIRED]
                |
                +-> Android installation A
                |      deviceRef A
                |      AndroidKeyStore credential A
                |      session A
                |      current capabilities A
                |
                +-> Android installation B
                       deviceRef B
                       AndroidKeyStore credential B
                       session B
                       current capabilities B
```

The full specimen should let each layer answer one question rather than becoming a generic security
manager.

## Layer questions

```text
HUMAN / PRINCIPAL
  who is the person/account?

INSTALLATION / DEVICE
  which installed Android instance is participating?

CREDENTIAL CUSTODY
  what difficult-to-copy proof can that installation produce?

REACHABILITY
  where may the client attempt to reach the personal host?

SERVICE IDENTITY
  is the endpoint the expected host/service?

AUTHENTICATED SESSION
  has the device proved the required identity for this bounded lifetime?

AUTHORIZATION / CAPABILITY
  what may this principal/device/session do right now?

FEATURE / DOMAIN
  what does Conversation or another feature action actually mean?

LOCAL DATA
  what may persist on the phone, and under which ownership/currentness rules?

OFFLINE / RECONNECT
  what remains useful when connectivity disappears and what must be revalidated later?

RECOVERY / REVOCATION
  what happens when a phone is lost, reinstalled, replaced, restored, or explicitly revoked?

BUILD / UPDATE
  why should this installed application/update be trusted as the intended software?

EVIDENCE / OBSERVABILITY
  what proves each boundary held or failed without leaking secrets?
```

## Demonstration modes

```text
OFF
  ordinary product behavior

SYNTHETIC
  explicit fake principals/devices/sessions/capabilities
  no writes into real trust/authority stores

LIVE_OBSERVATION
  bounded read-only projection of actual current source/runtime relationships when available
  no synthetic state promoted into live authority
```

A later product design may choose different names. The durable requirement is separation between
demonstration state and authority state, not this exact flag spelling.

## Initial edge cases

```text
A. one account / one legitimate phone
B. one account / two legitimate phones
C. two accounts / one shared phone
D. unknown phone asks to join
E. known phone + expired session
F. known phone + revoked authorization
G. lost Phone A; revoke A without affecting B
H. reinstall Phone A; new credential must not silently inherit old installation trust
I. host address changes; service identity remains stable
J. credential rotation/replacement
K. offline phone resumes with stale cached authority
L. duplicate/replayed request
M. process restart preserves durable identity but not an illicit standing session
N. backup/restore does not silently clone trusted-device identity
O. application update / release identity changes
P. OS permission or storage truth changes underneath the application
```

## Current source anchors versus desired work

Current source already demonstrates pieces of this model:

```text
VexLife-Android
  AndroidKeyStore possession signer
  private Home gateway/session distinctions
  Conversation / Connected Services source

VexLife-Prod
  personal/local service
  canonical Conversation + Vex
  browser/context-aware lived baseline

VexStream Music
  nearby pairing
  remembered device credentials
  bounded producer authorization
  reconnect/revocation/data-integrity examples
```

Not current source:

```text
VexLife-Prod remotely serving this entire complex Android account/device topology
full account/device registry in VexLife-Prod
Full Security demonstration-mode implementation
all edge cases executable
Vex-guided VexBoard traversal of this exact specimen
```

Those remain project work rather than inferred completion.

## VexBoard projection

The intended board ref is:

```text
board.full-security.vexlife-complex-demonstrator
```

The board must distinguish current source anchors from desired/synthetic relationships visually and
semantically enough that a reader cannot mistake an example scenario for live authority.

<!-- [VXG RealForever][FULL-SECURITY][VEXLIFE][COMPLEX-DEMONSTRATOR] -->
