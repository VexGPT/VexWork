# Current lived runner — A005

`[VXG RealForever]`

## Human-visible symptom

The current terminal may appear idle after invoking:

```text
RUN-VEXLIFE-CONNECTED-SERVICES-VCS04-INSTALLED-READ-LIVED-A005.command
```

If the shell has **not** returned a fresh prompt, that is not by itself a failure. A005 contains long phases whose subprocess output is captured for the RETURN instead of streamed continuously.

Possible silent phases include:

```text
waiting for authorized ADB device
waiting for same Android serial to reconnect
waiting for Android tailnet reachability
exact source clones/checkouts
Android Gradle build
APK/test APK install
instrumentation
UI polling
foreground Serve / gateway readiness
```

Current user-observed transcript at continuity formation:
- exact A005 wrapper command was accepted;
- no fresh shell prompt was shown after the command;
- no A005 RETURN or terminal failure receipt had been provided yet;
- therefore live state is `RUNNING_OR_WAITING__UNVERIFIED_FROM_REMOTE_CONTEXT`, not PASS and not FAIL.

## What A005 prints today

A005 emits one-time state changes for:
- no Android device visible;
- same serial missing/offline;
- USB debugging unauthorized;
- device reconnected;
- Android Tailscale setup action.

It does **not** yet emit periodic liveness heartbeats during long healthy waits/builds.

## Next harness refinement if A005 does not finish

Do not mutate/replay the single-use A005 attempt.

Form A006 with a fresh attempt identity and add a heartbeat owner such as:

```text
VCS04_HEALTH phase=<phase>
  elapsed=<duration>
  adb=<device|missing|offline|unauthorized>
  androidTailnet=<reachable|waiting|unknown>
  macTailnet=<running|not-running>
  productEffectsStarted=<true|false>
```

Suggested cadence should be bounded and readable (for example, state change immediately plus a low-frequency periodic heartbeat), not noisy command tracing.

Heartbeat principles:
- never print session bearer/token/private key;
- never infer PASS from process liveness;
- distinguish `waiting` from `stuck`;
- state whether VCS-04 product effects have begun;
- keep cleanup/result truth in the RETURN as the authoritative attempt receipt.

## Current effect boundary

Until the runner passes ADB + same-tailnet prerequisite checks, all of these remain false:

```text
Home membership mutation
foreground Serve
Android VexLife route persistence
private gateway traffic
Conversation read
Send
Companion/model effect
restart proof
```

## Source currentness bound by A005

```text
SDK.main=b4d427564409989e8f839066accd17ec4c790724
VexLife.main=0fbaeb7c918ebdfc7af5389220d5bf081a906702
VexLife.tree=3ab3affa774a2b97c0b27be2efb5a9506cdab0f9
Android.main=30ecfe22156f6bb4b565eda990c72feff48a3866
```

The VexLife main advance that caused the A005 rebind changed Heretic/browser-companion recovery paths and manifest buckets; all nine VCS-04 Home/session/Family producer blobs remained unchanged.

<!-- [VXG RealForever][VEXWORK][TEMP-CONTINUITY][VCS04-LIVED][CURRENT-A005] -->
