# Current lived runner — A008

`[VXG RealForever]`

A008 is the current qualified VCS-04 installed-read lived attempt.

```text
packageSha256=13010c3527ff105de4b992549e893824fa64ab744c7aa8d317ca6b8a06146f6c
SDK.main=b4d427564409989e8f839066accd17ec4c790724
VexLife.main=0fbaeb7c918ebdfc7af5389220d5bf081a906702
Android.main=30ecfe22156f6bb4b565eda990c72feff48a3866
staticQualification=ALL_PASS
```

## Immediate predecessor truth

A007 reached:
```text
ADB/device/Tailscale prerequisite = PASS
exact source = PASS
Android build/install = PASS
Android route seed/public identity = PASS
temporary bounded membership + lease = PASS
canonical temporary Family fixture = PASS
loopback private gateway = LISTENING
foreground Tailscale Serve = ATTEMPTED_NOT_ACTIVE
firstFailure = TAILSCALE_SERVE_UNAVAILABLE
reason = Serve not enabled for tailnet
```

No Funnel/public exposure and no Android gateway request occurred.

## A008 correction

```text
Serve attempted != Serve active
```

A008 only marks the network Serve effect performed after the private HTTPS gateway status route is actually reachable.

If Tailscale reports Serve disabled:
1. parse the exact private Serve enablement URL emitted by Tailscale;
2. open that page on the Mac;
3. print a human-action phase plus 15-second health heartbeats;
4. wait up to 10 minutes;
5. retry the same foreground private Serve;
6. continue automatically when private HTTPS gateway status becomes reachable.

Funnel is never configured.

## Success threshold

Do not form the full successor bundle until:
```text
L1 remote device possession
L2 remote authenticated session
L3 private bounded gateway
L4 current Home/Family authority
L5 canonical installed Conversation read
```
cross together.

<!-- [VXG RealForever][VEXWORK][TEMP-CONTINUITY][VCS04-LIVED][CURRENT-A008] -->
