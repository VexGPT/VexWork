# Current lived runner — A011

`[VXG RealForever]`

## Why A011 exists

A010 proved the leftover HTTPS 8443 mapping is private foreground Tailscale Serve, but six `tailscale serve --https=8443 off` attempts could not remove it.

The current Tailscale CLI/source model explains why:
- foreground Serve is owned by a WatchIPNBus session under `ServeConfig.Foreground`;
- `off` does not re-enter that existing foreground session;
- therefore the stale mapping must be recovered through the exact foreground process/session owner, not by retrying parent/background config mutation.

## A010 consumed checkpoint

```text
returnSha256=171150e42682886b1ca9136018aa34b9b4c9a9e5e5d7c48936a1d3d396cc2de8
disposition=USER_ACTION_REQUIRED
firstFailure=TAILSCALE_SERVE_UNAVAILABLE
foregroundSession=e3af76c41c2acacf
httpsPort=8443
proxy=http://127.0.0.1:53148
AllowFunnel=false/absent
A010 product effects=false
L1-L5=NOT_PROVEN
```

## A011 package

```text
wrapperSha256=cbe48015de98c2de5a9f37217e12011e2478cb62bf8420a84a40caccebd52896
SDK.main=b4d427564409989e8f839066accd17ec4c790724
VexLife.main=0fbaeb7c918ebdfc7af5389220d5bf081a906702
Android.main=30ecfe22156f6bb4b565eda990c72feff48a3866
staticQualification=ALL_PASS
```

A011 predecessor recovery:

```text
exact Foreground host:8443 entry
+ HTTPS=true
+ exact loopback proxy http://127.0.0.1:<port>
+ AllowFunnel != true
-> inspect local process table
-> require exactly one:
   tailscale serve --yes --https=8443 <exact-proxy>
-> SIGTERM exact PID only
-> wait for Foreground mapping to disappear
-> if same exact PID still owns it:
     bounded SIGKILL fallback
-> require mapping gone
-> continue ordinary lived proof
```

Failure boundaries:
- multiple foreground owners -> stop;
- unexpected/non-loopback proxy -> stop;
- `AllowFunnel=true` -> stop;
- no exact process owner -> stop;
- mapping remains after exact-owner recovery -> stop.

Explicitly absent:
```text
tailscale serve reset
broad Tailscale cleanup
Funnel mutation
--bg
Send
model
restart proof
```

## Successor threshold

A full successor bundle remains deferred until:

```text
L1 real device possession
+ L2 remote authenticated session
+ L3 private bounded gateway
+ L4 current Home/Family authority
+ L5 canonical installed Conversation read
```

<!-- [VXG RealForever][VEXWORK][TEMP-CONTINUITY][VCS04-LIVED][CURRENT-A011] -->
