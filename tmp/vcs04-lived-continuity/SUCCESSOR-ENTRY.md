# Successor entry — VCS-04 post-A012

`[VXG RealForever]`

## Start here

Read in this order:

```text
1. INTENT-AND-ACCEPTANCE.md
2. THRESHOLD-A012.md
3. END-TO-END-ROOM-PATH.md
4. A012-RETURN.md
5. SOURCE-OWNER-MAP.md
6. A012-CODE-INDEX.md
7. harness/A012/README.md
8. exact harness code only where needed
9. live target-repository entry/source for the next effect
```

You should not need predecessor chat to understand what this lane is trying to accomplish or why A012 matters.

## Human intention

The goal is not “make the A00x script pass.”

The goal is a real Connected Services Conversation experience:

```text
ordinary VexLife Android user
-> privately connect to Vex Home
-> prove device possession
-> establish bounded remote session
-> resolve current Home/Family authority
-> establish/reuse first canonical Family room
-> read canonical Conversation history
-> Send one durable human message exactly once
-> separate Companion response
-> survive real app restart with no duplicates
```

See `INTENT-AND-ACCEPTANCE.md` for the exact L1-L12 contract.

## Current truth

A012 is a **foundation successor checkpoint**, not terminal read acceptance.

It reached the real installed Family Conversation screen with an active private Serve config and a deterministic temporary proof room.

The screen reported:

```text
The current Family conversation could not be refreshed.
```

The server saw only the harness's own gateway-status probe.

It did not see Android:
```text
session challenge
session establish
Family bootstrap
READ_THREAD_HISTORY
```

Therefore the exact Android-side failure is still before the first possession-challenge request reaches the gateway.

Do not infer room absence as the cause: A012's temporary proof room existed.

## Foreground order

Two independent product questions remain, but execute them in this order.

### 1. Foreground now — diagnose Android pre-challenge transport

A012 already supplied a valid deterministic proof room.

Therefore first determine why this chain stops before the gateway:

```text
screen
-> repository
-> read client
-> Family private-gateway port
-> VexPrivateHomeGatewayConnection
-> HttpsURLConnection
-> POST /v1/home/session/challenge
```

Ground a sanitized observable failure boundary before another lived replay.

Do **not** form A013 by blindly copying A012.

### 2. Then — wire fresh-user Family Host establishment

Canonical first-room creation already exists:

```text
VexLife/src/core/family-host-runtime.mjs::hostFamily()
```

After the transport/read path is proven with the deterministic fixture, find the rightful product trigger:

```text
fresh authenticated Home
-> hostFamily()
-> initial canonical GROUP room
-> Android bootstrap/read
```

Do not let Android invent room identity and do not make bootstrap silently create a room.

## Important A012 caveat

The raw A012 failure code is:

```text
LIVED_GATEWAY_INTEGRATION_FAILED
```

Do not read that name literally.

A012's harness counted its own `GET /v1/home/gateway/status` probe in `gatewayEvents.length`, so the raw classifier could say “gateway integration” even though no Android authenticated request reached the gateway.

Use the actual route evidence, not the label.

See `A012-CODE-INDEX.md`.

## What not to do

```text
do not replay A001-A011
do not ask Victor to reconstruct this history
do not assume DNS/TLS/VPN/session cause
do not assume the missing fresh-user room caused A012
do not treat the temporary proof room as product Home state
do not jump to Send/model/restart before L1-L5
do not productize the harness as onboarding
```

## Repository descent

Use `SOURCE-OWNER-MAP.md`.

A fresh instance should not broad-search repositories merely to locate the current owners.

Re-observe live heads before mutation because A012 hashes are checkpoint coordinates, not standing currentness promises.

## Durable references

```text
VCS-04 program owner:
  vgong24/VexLife issue #899

accepted Android installed-read source:
  VexLife-Android PR #149
  TERMINAL_ACCEPTED_CURRENT at the predecessor checkpoint

temporary executable continuity:
  VexGPT/VexWork PR #7

future simplified onboarding:
  VexWork issue #6
  PARKED until foundation is ready
```

## Human boundary right now

There is **no current human action required from Victor** merely to resume this successor.

The next worker should investigate/source-place the Android diagnostic edge first.

Cross back to Victor only for a genuinely human-only device/login/consent/lived-observation step after an executable next proof is ready.

<!-- [VXG RealForever][VCS04][SUCCESSOR-ENTRY][POST-A012][REFINED] -->
