# Current lived runner — A009

`[VXG RealForever]`

## Why A009 exists

A008's human Serve enablement succeeded, but its post-enable probe used ordinary macOS DNS resolution for the tailnet FQDN.

Observed A008 facts:

```text
Tailscale Serve log:
  Success.
  listener already exists for port 8443

Mac curl:
  exit=6
  meaning=host name could not be resolved

A008 interpretation:
  WRONG -> Serve still not enabled

Actual interpretation:
  Serve capability/listener was established,
  but the Mac resolver could not resolve its own tailnet FQDN.
```

## A009 truth model

```text
Tailscale serve status --json
  = local Serve listener/proxy configuration truth

Mac DNS resolution
  != Serve enablement truth
  != VCS-04 acceptance

curl --resolve <tailnet-dns>:<https-port>:<self-tailscale-ip>
  = non-blocking local TLS/HTTPS diagnostic

Android installed app
-> private HTTPS gateway
-> possession challenge
-> remote session
-> bootstrap
-> READ_THREAD_HISTORY
  = lived network acceptance
```

## Predecessor recovery

A008 selected HTTPS 8443 only after observing it free at admission. If A009 finds 8443 still present:

1. verify 8443 is not represented in Funnel/public state;
2. attempt exact `tailscale serve --https=8443 off`;
3. verify the endpoint disappeared;
4. never use broad `serve reset`.

If Funnel unexpectedly owns 8443, A009 stops rather than mutating it.

## Runtime health

A009 preserves the A006+ health surface:

```text
VCS04_PROGRESS kind=PHASE ...
VCS04_PROGRESS kind=HEARTBEAT ...
LIVE-PROGRESS.log
CURRENT-PHASE.json
```

Expected healthy advance after private Serve config:

```text
privateServe=CONFIG_ACTIVE
networkProof=PRIVATE_SERVE_CONFIG_ACTIVE_AWAIT_ANDROID_TRAFFIC

then, only after real installed-app requests:
networkProof=PRIVATE_HTTPS_GATEWAY_TRAFFIC_OBSERVED
```

## Current package

```text
sha256=ad90c1079e1386ba58bbb78eb5624340079e71ea2e85d690f6659fa86392f197
staticQualification=ALL_PASS
Serve --bg=false
Funnel configuration=false
Send=false
model=false
restart=false
```

<!-- [VXG RealForever][VEXWORK][TEMP-CONTINUITY][VCS04-LIVED][CURRENT-A009] -->
