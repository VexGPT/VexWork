# VCS-04 intention and completion contract

`[VXG RealForever]`

## Human outcome

VCS-04 exists so a normal VexLife Android user can privately connect their phone to their Vex Home, enter the canonical Family Conversation owned by that Home, exchange durable conversation with the Home/Companion, and have that truth survive ordinary app/session restart without duplicate messages.

The eventual human experience should feel approximately like:

```text
open VexLife
-> Connect to Vex Home
-> guided computer/phone Connected Services setup
-> protected Tailscale login/VPN approval only when human-only
-> verify private reachability + device possession
-> establish/reuse canonical Vex Home/Family authority
-> create first Family room when this is a fresh Home
-> open Family Conversation
-> read canonical history
-> Send
-> durable human message truth
-> separate Companion response
-> restart app
-> same truth, no duplicates
```

The lived A00x scripts are **proof scaffolding**, not the desired product workflow.

```text
LIVED_HARNESS != PRODUCT_ONBOARDING
```

The simplified one-button/guided onboarding experience is separately parked in VexWork issue #6 so it can be productized after the foundation is real.

## VCS-04 acceptance matrix

Do not use L-numbers without these meanings.

```text
L1  remote device possession
    The Home proves the connecting Android device controls its accepted possession key.

L2  remote authenticated session
    Possession establishes one bounded remote session; session != standing Home authority.

L3  private bounded gateway
    Android actually reaches the private Home gateway over the admitted private route.
    Tailnet/Serve configuration alone is not enough.

L4  current Home/Family authority
    The remote session resolves current Home membership/capability and current Family authority.

L5  canonical Conversation read
    Installed Android bootstrap resolves the current canonical Family room and READ_THREAD_HISTORY
    renders durable canonical conversation truth.

L6  durable human Send exactly once
    One human Send appends canonical durable human conversation truth once.

L7  separate Companion turn / durable response
    Companion/model work is a separate effect after the human append.

L8  model failure does not erase human append
    SEND_COMPLETED remains durable even if Companion/model response fails.

L9  same-session Android observation
    Android observes the newly durable human/Companion truth in the same session.

L10 actual Android process restart
    Kill/relaunch the real app process; recomposition is not restart proof.

L11 no duplicates after restart/retry
    Retrying/restarting preserves one semantic message/effect, not duplicate truth.

L12 source/lifecycle currentness
    The accepted source and lifecycle state supporting the lived proof are current.
```

## Permanent distinctions

These are architectural meaning, not incidental harness rules:

```text
TAILSCALE_CONNECTED != VEX_HOME_MEMBERSHIP
PRIVATE_ROUTE != HOME_AUTHORITY
REMOTE_SESSION != STANDING_HOME_AUTHORITY
REACHABILITY != PAIRING

SERVE_CONFIG_ACTIVE != ANDROID_GATEWAY_TRAFFIC
SCREEN_RENDERED != CANONICAL_READ

TEMP_PROOF_ROOM != FRESH_USER_PRODUCT_ROOM
ANDROID_READ_DOORWAY != FAMILY_HOST_ESTABLISHMENT

SEND_COMPLETED = DURABLE_HUMAN_CONVERSATION_TRUTH
SEND_COMPLETED != MODEL_RESPONSE_COMPLETED
```

## Current threshold

A012 is a **successor/foundation checkpoint**, not completion.

```text
A012:
  infrastructure/setup path crossed far enough to enter real installed Family Conversation screen
  private Serve configuration active
  AllowFunnel=false
  temporary proof Family room existed
  no Android possession-challenge request reached gateway

L1-L5 = NOT_PROVEN together
L6-L11 = HELD
L12 = PASS at A012 source coordinates
```

## Required continuation order

The two post-A012 questions are separate, but they are not equal in immediate order.

### Foreground first: Android pre-challenge transport diagnosis

A012 **already had a temporary valid room**. It still failed before the Android possession challenge reached the gateway.

Therefore room creation cannot explain A012's observed failure.

```text
NEXT_FOREGROUND = diagnose Android -> private HTTPS before session challenge
```

Do not form another blind lived attempt first. Instrument/prove the Android transport/session boundary so the next run retains the exact failure.

### Then: fresh-user Family Host establishment integration

After the Android path can reach possession/session/bootstrap/history using the deterministic proof fixture, wire the real fresh-user product path through the already-accepted Family Host owner:

```text
family-host-runtime.mjs::hostFamily()
-> canonical first Family Space
-> canonical initial GROUP room
```

Then re-prove L1-L5 without relying on a harness-created Family room.

## Completion order after L1-L5

```text
prove product-established L1-L5
-> freeze read-foundation checkpoint
-> L6 durable human Send exactly once
-> L7 separate Companion response
-> L8 model-failure separation
-> L9 same-session observation
-> L10 real Android process restart
-> L11 no duplicates
-> L12 terminal source/lifecycle currentness
```

Do not jump from a screen or a green lower-layer check directly to Send/model/restart claims.

<!-- [VXG RealForever][VCS04][INTENT-AND-ACCEPTANCE] -->
