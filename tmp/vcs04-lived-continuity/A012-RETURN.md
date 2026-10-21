# A012 RETURN — consumed foundation checkpoint

`[VXG RealForever]`

```text
returnSha256=1e797fda70ac935157ffa30d7aad8a06922be2099348f0b0730ecc0bf1b9b7c5
attemptRef=attempt.vexlife.connected-services.vcs04.installed-read-lived.a012
disposition=SAFE_FAILURE
firstFailure=LIVED_GATEWAY_INTEGRATION_FAILED
startedAt=2026-10-21T08:07:10.307Z
completedAt=2026-10-21T08:08:28.990Z
```

## Lived progression

```text
RECOVER_A008_FOREGROUND_SERVE_OWNER
  ownerPid=83970
  proxy=http://127.0.0.1:53148
  AllowFunnel=false
  recovery=PASS_SIGTERM

PRECHECK_ANDROID_DEVICE
  adb=DEVICE

ANDROID_TAILSCALE
  INSTALLED_VPN_VISIBLE

CLONE/VERIFY
  SDK=EXACT
  VexLife=EXACT
  Android=EXACT

BUILD/INSTALL
  Android APKs=PASS

ANDROID ROUTE + IDENTITY
  route=yes
  public identity observed

HOME AUTHORITY
  temporary membership=ACTIVE
  lease=BOUNDED

FAMILY FIXTURE
  canonical temp Home path=yes
  Family Space=READY
  GROUP channel=MATERIALIZED
  seed message=APPENDED

PRIVATE GATEWAY
  loopback=LISTENING :56511

TAILSCALE SERVE
  HTTPS 8443 -> http://127.0.0.1:56511
  config=EXACT
  AllowFunnel=false
  public exposure=false

INSTALLED APP
  Home screen reached
  Family Conversation doorway tapped
  Family Conversation screen rendered
```

## Failure evidence

UI:

```text
The current Family conversation could not be refreshed.
```

Gateway events:

```text
home.gateway.status GET 200
```

Family operations:

```text
[]
```

Authority operations:

```text
[]
```

No request reached:
- session challenge;
- session establish;
- Family bootstrap;
- Family READ_THREAD_HISTORY.

Therefore the installed failure occurs **before** the first authenticated gateway route reaches the server.

A012 does not prove whether the client-side failure is DNS, TLS, VPN route, HTTP transport, repository composition, or another Android-side cause. No logcat/network exception was retained. Preserve this as UNKNOWN rather than choosing a favorite explanation.

## Cleanup

```text
Android app force-stop=ATTEMPTED
foreground Serve stop=ATTEMPTED
gateway close=PASS
temporary Home authority=DESTROYED_WITH_WORK_ROOT_AFTER_RETURN_FORMATION
Android route persistence=PRESERVED_REACHABILITY_ONLY
Mac original Tailscale running state=PRESERVED
```

The fallback `serve ... off` cleanup returned status 1 after the foreground client stop. Do not interpret that alone as a remaining live Serve effect; re-observe provider state before recovery.

## Threshold disposition

```text
A012=TERMINAL_CONSUMED_FOUNDATION_CHECKPOINT
SUCCESSOR_BUNDLE=EARNED
L1-L5=NOT_TERMINAL
NEXT=room-establishment product bridge + Android pre-challenge transport diagnosis
```

<!-- [VXG RealForever][VCS04][A012][RETURN-CONSUMED] -->
