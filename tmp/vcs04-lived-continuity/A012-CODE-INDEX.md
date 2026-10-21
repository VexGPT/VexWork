# A012 executable code index

`[VXG RealForever]`

Exact file:
```text
harness/A012/task.mjs
1617 lines
```

Do not reread the whole harness to answer one narrow question. Descend by responsibility.

## Responsibility map

| Lines | Responsibility | Key functions / checkpoints |
|---|---|---|
| 1-105 | imports, exact source bindings, constants, attempt/effect state | A012 repo/head/blob bindings; Home/Family fixture refs |
| 106-170 | observable progress/health | `effectSummary`, `emitProgress`, `setPhase`, heartbeat |
| 171-319 | filesystem/command/source helpers | `run`, `runAsyncCaptured`, `classify`, `cloneExact` |
| 320-666 | Android ADB + Tailscale prerequisite | device snapshots, reconnect, package/launch, `ensureAndroidTailnetPrerequisite` |
| 667-1109 | Tailscale Serve truth + foreground recovery | ServeConfig/AllowFunnel, foreground owner process discovery, exact stale A008 recovery, `establishForegroundServe` |
| 1110-1147 | installed UI observation helpers | UI dump/text wait, child stop |
| 1148-1232 | main preflight | current source heads, Tailscale, Serve occupancy, Android device |
| 1233-1269 | source clone + Android build/install + route seed | exact repo clones, APK build/install, host bridge identity |
| 1270-1305 | accepted producer imports + bounded Home authority fixture | membership + lease |
| 1306-1334 | **temporary Family proof fixture** | `createFamilySpace`, `addFamilyMember`, `createFamilyChannel`, `materializeConversationChannel`, seed message |
| 1335-1389 | VEX_CORE/Family server capability composition | authority resolver + server Family capability |
| 1390-1443 | loopback private gateway + foreground private Serve | gateway start, exact Serve config, AllowFunnel=false |
| 1445-1474 | installed app launch + Family Conversation read observation | launch, Home doorway, tap, wait for seed/error |
| 1476-1504 | success-only lived evidence assertions | required gateway routes, READ_THREAD_HISTORY evidence |
| 1505-1530 | cleanup | app stop, Serve stop, gateway close, Mac Tailscale-state restore |
| 1531-1617 | canonical RETURN formation | STATUS/EVIDENCE/CLEANUP/progress/ZIP |

## Critical fixture boundary

Lines **1306-1334** are proof scaffolding:

```text
createFamilySpace()
addFamilyMember()
createFamilyChannel()
materializeConversationChannel()
appendBrowserFamilyMessage()
```

Do not translate those direct calls into production onboarding.

The accepted production first-Family owner is:
```text
VexLife/src/core/family-host-runtime.mjs::hostFamily()
```

## Critical A012 classification caveat

Lines **1462-1470** inspect the failed UI.

A012 uses:
```js
const anyGatewayRequest = gatewayEvents.length > 0;
```

But the harness itself had already issued:
```text
GET /v1/home/gateway/status
```

Therefore the raw RETURN code:
```text
LIVED_GATEWAY_INTEGRATION_FAILED
```

does **not** prove Android traffic reached the gateway.

The semantically important evidence is:
```text
gateway completed routes = [home.gateway.status]
familyOperations = []
authorityOperations = []
session challenge = NOT OBSERVED
```

A successor must not propagate the raw failure-code label as if it meant authenticated app traffic.

## Where the next instrumentation should focus

The next executable lived runner should not be formed by copying A012 first.

The next source/proof work should make the Android boundary between:
```text
VexFamilyConversationScreen
-> repository
-> client
-> private gateway port
-> VexPrivateHomeGatewayConnection
-> HttpsVexPrivateHomeGatewayHttpTransport
```

produce enough sanitized evidence to locate the pre-challenge failure.

Once that source/diagnostic edge is grounded, A012 can be used as the proven harness baseline for the next lived run.

<!-- [VXG RealForever][VCS04][A012][CODE-INDEX] -->
