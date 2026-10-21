# VCS-04 source-owner map — post-A012

`[VXG RealForever]`

This map exists so a fresh successor does not search broadly just to find the current owners.

Re-observe live heads before source mutation. The hashes below are the exact A012 coordinates, not a promise that main has not advanced.

## A012 source coordinates

```text
Vextreme-SDK.main = b4d427564409989e8f839066accd17ec4c790724
VexLife.main      = 0fbaeb7c918ebdfc7af5389220d5bf081a906702
VexLife-Android   = 30ecfe22156f6bb4b565eda990c72feff48a3866
```

## Edge A — installed Android fails before possession challenge reaches gateway

Repository:
```text
vgong24/VexLife-Android
```

Fresh-entry route:
```text
AGENTS.md
-> docs/CULTURE.md
-> docs/foundation/INDEX.md
-> exact Connected Services / Conversation source + tests
```

Primary source descent:

```text
app/src/main/kotlin/com/vextreme/vexlife/android/data/AppRepositories.kt
  production composition:
  persisted route
  -> HTTPS transport
  -> private gateway connection/session
  -> Family Conversation port/client/repository

app/src/main/kotlin/com/vextreme/vexlife/android/connectedservices/
  VexPrivateHomeGatewayRouteStore.kt
    reachability-only endpoint persistence

  VexPrivateHomeGatewayConnection.kt
    HttpsVexPrivateHomeGatewayHttpTransport
    VexPrivateHomeGatewayConnection
    session challenge + possession signature + establish session
    FIRST IMPORTANT NETWORK BOUNDARY

app/src/main/kotlin/com/vextreme/vexlife/android/conversation/
  VexFamilyConversationPrivateGatewayPort.kt
    /v1/home/family/bootstrap
    /v1/home/family/conversation
    READ_THREAD_HISTORY wire vocabulary

  VexFamilyConversationConnectedServiceClient.kt
    bootstrap -> exactly one current room -> history

  VexFamilyConversationConnectedServiceRepository.kt
    current Android read projection

app/src/main/kotlin/com/vextreme/vexlife/android/screens/shared/conversation/
  VexFamilyConversationScreen.kt
    current screen catches refresh failure and collapses it to one generic unavailable state
```

Relevant existing tests live beside these packages, including:
```text
app/src/test/.../VexFamilyConversationConnectedServiceClientTest.kt
app/src/test/.../VexFamilyConversationConnectedServiceRepositoryTest.kt
```

### Immediate diagnostic question

A012's call chain should be:

```text
Family Conversation Screen
-> repository.refreshSingleCurrentRoom()
-> client.readSingleCurrentRoom()
-> port.bootstrap()
-> gateway.authenticatedGetJson()
-> currentSession()
-> establishSession()
-> transport POST /v1/home/session/challenge
```

The server did not observe that POST.

The next source/proof change should preserve a **sanitized exact failure boundary** somewhere in this chain without leaking:
- bearer session refs;
- possession signatures;
- private keys;
- secret capability material.

Do not guess DNS/TLS/VPN/endpoint/session cause first.

## Edge B — real fresh-user first Family room

Repository:
```text
vgong24/VexLife
```

Fresh-entry route:
```text
AGENTS.md
-> npm run orient
-> read receipt.requiredSources
-> exact implicated Family Host source/docs/tests
```

Canonical owner:
```text
docs/VEX-FAMILY-HOST-ESTABLISHMENT.md
src/core/family-host-runtime.mjs
test/vex-family-host-runtime.test.mjs
```

Accepted owner composition:
```text
hostFamily()
-> deriveFamilyEstablishmentIdentity()
-> createFamilySpace()
   src/core/family-space-store.mjs
-> createFamilyChannel()
   src/core/family-conversation.mjs
-> materializeConversationChannel()
   src/core/conversation-store.mjs
-> durable initial GROUP room
```

Current read/bootstrap server owner:
```text
src/core/server-family-conversation-capability.mjs
test/server-family-conversation-capability.test.mjs
```

The bootstrap enumerates durable channel bindings and returns visible current GROUP rooms. It does not establish the first room.

Therefore the missing product integration is:

```text
authenticated fresh Home
-> rightful invocation of hostFamily()
-> then bootstrap/read
```

Do not create another Family/Conversation semantic owner to fill this gap.

## Shared private gateway producer source

Only descend here if Edge A evidence implicates server/gateway behavior rather than Android transport:

```text
vgong24/Vextreme-SDK

lib/local-runtime/private-home-gateway-server.js
lib/security/home-bridge-device-possession-trust-port.js
lib/local-runtime/home-session-authority.js
lib/local-runtime/private-home-gateway-composition.js
```

A012 proved the loopback gateway and private Serve configuration could become active; do not reopen these owners merely because they participate in the graph.

## Accepted Android source checkpoint

```text
VexLife-Android PR #149
[T Conversation][VCS-04] installed private Home read integration
TERMINAL_ACCEPTED_CURRENT at A012 predecessor source coordinates
```

Re-observe provider/source currentness before relying on that status for a new effect.

<!-- [VXG RealForever][VCS04][SOURCE-OWNER-MAP] -->
