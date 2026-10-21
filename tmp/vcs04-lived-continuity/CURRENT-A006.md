# Current lived runner — A006

`[VXG RealForever]`

A006 replaces the interrupted A005 attempt.

## Why A005 was retired

The operator intentionally ended A005 because a running process without progress feedback was not trustworthy. Read-only diagnostics after termination showed:

```text
attempt files:
  ATTEMPT-STARTED.txt only

ADB:
  R5CT50N3ZHA device SM_S908U
```

A005 source ordering proves the observed run had not yet reached source clones, Android route seeding, Home membership, foreground Serve, gateway traffic or Conversation effects.

## A006 health contract

A006 emits immediate phase transitions plus a 15-second heartbeat:

```text
VCS04_PROGRESS
  kind=PHASE | HEARTBEAT | STATE | CHECKPOINT | COMPLETE
  phase=<current phase>
  phaseElapsedSec=<seconds>
  adb=<DEVICE|MISSING|OFFLINE|UNAUTHORIZED|UNKNOWN>
  macTailnet=<RUNNING|...>
  androidTailscale=<INSTALLED|INSTALLED_VPN_VISIBLE|MISSING|UNKNOWN>
  networkProof=<NOT_STARTED|DEFERRED_TO_PRIVATE_HTTPS_GATEWAY|PRIVATE_HTTPS_GATEWAY_ACTIVE>
  productEffectsStarted=<true|false>
  effects=route=<yes/no>,membership=<yes/no>,serve=<yes/no>
```

The same state is written to:

```text
LIVE-PROGRESS.log
CURRENT-PHASE.json
```

inside the canonical attempt directory.

## Reachability correction

A006 no longer waits for `adb shell ping <MagicDNS>` as an admission oracle.

```text
ADB authorized
+ Tailscale Android package present
-> proceed to bounded lived effects
-> installed VexLife performs:
   possession challenge/signature
   remote authenticated session
   Family bootstrap
   READ_THREAD_HISTORY
-> completed private HTTPS routes become the real reachability proof
```

If the installed Screen reports route/read unavailable **before any gateway request is observed**, the attempt records `ANDROID_TAILNET_ROUTE_UNREACHABLE` as the environment checkpoint.

## Current exact coordinates

```text
packageSha256=4665251b1b4cc571ad0d4fab8602b44b6734bdbcec3574af22191c16eff3b4b8
SDK.main=b4d427564409989e8f839066accd17ec4c790724
VexLife.main=0fbaeb7c918ebdfc7af5389220d5bf081a906702
Android.main=30ecfe22156f6bb4b565eda990c72feff48a3866
staticQualification=ALL_PASS
```

## Held acceptance

A006 still does not pre-claim L1-L5. It must produce a PASS RETURN with actual route evidence first. L6-L11 remain held even after a successful installed read.

<!-- [VXG RealForever][VEXWORK][TEMP-CONTINUITY][VCS04-LIVED][CURRENT-A006] -->
