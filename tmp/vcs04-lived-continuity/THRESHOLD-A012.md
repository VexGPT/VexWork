# VCS-04 foundation threshold — A012

`[VXG RealForever]`

## Why this is a successor threshold

A012 is the first lived attempt that crossed the infrastructure/setup failures far enough to launch the installed VexLife app into the real Family Conversation doorway with a current private Serve configuration.

This is a **foundation checkpoint**, not L1-L5 acceptance.

```text
SUCCESSOR_THRESHOLD = YES
L1-L5_TERMINAL_ACCEPTANCE = NO
```

## A012 exact receipt

```text
packageSha256=5f416a18f4c1d2fbc2da2987165ebee17c0c7e3fd91e3fd9fe4f3b9e8c83533e
returnSha256=1e797fda70ac935157ffa30d7aad8a06922be2099348f0b0730ecc0bf1b9b7c5
disposition=SAFE_FAILURE
firstFailure=LIVED_GATEWAY_INTEGRATION_FAILED
duration≈79s
```

Source coordinates:

```text
SDK.main=b4d427564409989e8f839066accd17ec4c790724
VexLife.main=0fbaeb7c918ebdfc7af5389220d5bf081a906702
Android.main=30ecfe22156f6bb4b565eda990c72feff48a3866
```

## What A012 actually crossed

```text
stale A008 foreground Serve owner
  -> exact PID 83970 observed
  -> SIGTERM
  -> foreground config disappeared

Mac Tailscale = RUNNING
Android ADB = DEVICE
Android Tailscale = INSTALLED_VPN_VISIBLE

exact SDK source = PASS
exact VexLife source = PASS
exact Android source = PASS

Android APK/test APK = BUILT + INSTALLED
reachability-only private Home route = PERSISTED
Android public possession identity = OBSERVED

temporary bounded Home membership = ACTIVE
temporary capability lease = BOUNDED

temporary proof Family Space = CREATED
temporary GROUP Family channel = MATERIALIZED
temporary seed message = APPENDED

private gateway = LOOPBACK LISTENING
private Tailscale Serve = CONFIG ACTIVE
AllowFunnel = false
public Funnel effect = false

installed VexLife process = LAUNCHED
Home -> Family Conversation doorway = ENTERED
Family Conversation screen = RENDERED
```

## First real failure

### Receipt-label caveat

The raw RETURN names the first failure `LIVED_GATEWAY_INTEGRATION_FAILED`.

That label is broader than the evidence warrants.

In the exact A012 harness, the failed-screen branch uses:

```text
anyGatewayRequest = gatewayEvents.length > 0
```

The harness had already generated its own successful `GET /v1/home/gateway/status` probe, so this predicate was true even though the Android app never reached the possession-challenge route.

Treat the raw code as an attempt receipt label, not as proof that Android application traffic reached the gateway.


The installed screen rendered:

```text
The current Family conversation could not be refreshed.
```

Gateway evidence contained only:

```text
GET /v1/home/gateway/status -> 200
```

It did **not** observe:

```text
home.session.challenge
home.session.establish
home.family.bootstrap
home.family.conversation / READ_THREAD_HISTORY
```

Therefore:

```text
PRIVATE_SERVE_CONFIG_ACTIVE
!=
ANDROID_PRIVATE_GATEWAY_TRAFFIC_PROVEN
```

The next transport/session boundary is between the installed Android repository call and the private gateway before the first possession challenge reaches the server.

Do not infer DNS, TLS, session, room absence, or Android repository failure without new evidence. A012 did not retain logcat/network exception detail, so the exact Android-side transport failure remains UNKNOWN.

## Acceptance

```text
L1 remote device possession = NOT_PROVEN
L2 remote authenticated session = NOT_PROVEN
L3 private bounded gateway = NOT_PROVEN as Android route
L4 current Home/Family authority = NOT_PROVEN end-to-end
L5 canonical Conversation read = NOT_PROVEN

L6-L11 = HELD
L12 source currentness = PASS for A012 coordinates
```

## Why the proof still matters

A012 converts the lane from broad environment uncertainty into two bounded questions.

1. **Installed Android transport:** why does the app fail before the possession-challenge request reaches the active private gateway?
2. **Fresh-user Family establishment:** what invokes the already-accepted Family Host runtime to create the first canonical Family Space + room?

They are separate, and the immediate order matters: diagnose **#1 first** because A012 already had a valid temporary proof room. Room creation cannot explain a failure that occurred before the first session-challenge request.

After the transport/read path works against the deterministic fixture, solve #2 and re-prove the read through real product establishment.

These questions should never be hidden inside another proof fixture.

<!-- [VXG RealForever][VEXWORK][TEMP-CONTINUITY][VCS04][THRESHOLD-A012] -->
