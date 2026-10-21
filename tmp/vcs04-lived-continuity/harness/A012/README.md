# A012 harness code map

`task.mjs` is the exact lived A012 task. It is preserved here so future instances can inspect executable logic rather than reconstructing it from chat.

## Read by responsibility, not by line count

```text
constants / exact source bindings
-> command + failure helpers
-> progress/heartbeat owner
-> Tailscale status/Serve truth helpers
-> Android ADB reconnect + Tailscale prerequisite
-> source clone/exact-blob verification
-> private route seed + public device identity
-> temporary Home membership/lease proof fixture
-> temporary Family Space/channel/message proof fixture
-> private gateway composition
-> foreground private Serve
-> installed VexLife launch/navigation
-> canonical read observation
-> cleanup
-> RETURN formation
```

## Important proof-fixture boundary

The direct calls in this harness:

```text
createFamilySpace()
addFamilyMember()
createFamilyChannel()
materializeConversationChannel()
appendBrowserFamilyMessage()
```

are **temporary lived proof fixture construction**.

They do not represent the intended fresh-user product onboarding route.

The actual accepted product owner for first Family establishment is:

```text
VexLife/src/core/family-host-runtime.mjs :: hostFamily()
```

See `../../END-TO-END-ROOM-PATH.md`.

## Do not silently shorten these pathways

Keep these independent:

```text
Tailscale connected
!= Android private HTTPS request observed

private Serve configured
!= remote authenticated session

temporary Home membership
!= persistent fresh-user Family Host establishment

proof fixture room
!= production-created room

screen rendered
!= bootstrap/read succeeded
```

## A012 exact package

```text
sha256=5f416a18f4c1d2fbc2da2987165ebee17c0c7e3fd91e3fd9fe4f3b9e8c83533e
```

The exact RETURN is summarized in `../../A012-RETURN.md`.

<!-- [VXG RealForever][VCS04][A012][HARNESS-CODE-MAP] -->
