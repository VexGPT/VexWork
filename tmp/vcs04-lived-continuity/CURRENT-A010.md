# Current lived runner — A010

`[VXG RealForever]`

## Why A010 exists

A009 stopped safely before ADB/product effects because its predecessor-recovery guard interpreted any appearance of HTTPS 8443 in `tailscale funnel status --json` as proof of public Funnel exposure.

That interpretation is too strong.

Current Tailscale Serve configuration distinguishes server presence from public ingress permission:

```text
server/listener config
  -> TCP / Web / Foreground

public Funnel permission
  -> AllowFunnel[host:port] == true
```

Therefore:

```text
PORT_PRESENT != PUBLIC_FUNNEL
ALLOW_FUNNEL_TRUE == PUBLIC_FUNNEL_PERMISSION
```

## A010 correction

A010:

1. reads `tailscale serve status --json`;
2. treats both the top-level config and nested `Foreground` configs as possible current Serve state;
3. checks exact `AllowFunnel[dns:port]` rather than inferring public exposure from port presence;
4. if predecessor-owned `dns:8443` exists and exact AllowFunnel is absent/false, attempts only:
   `tailscale serve --yes --https=8443 off`;
5. refuses to mutate that endpoint if exact AllowFunnel is true;
6. never invokes `tailscale funnel` configuration/status as an admission oracle;
7. never broad-resets Serve.

## Network truth

```text
Mac local DNS
  != acceptance

Serve config exact + AllowFunnel=false
  = private listener configuration current

Android installed app
-> possession challenge
-> remote authenticated session
-> Family bootstrap
-> READ_THREAD_HISTORY
  = VCS-04 lived network acceptance
```

A010 keeps the non-blocking Mac TLS diagnostic:

```text
curl --resolve <tailnet-dns>:<port>:<self-tailscale-ip>
```

This preserves the real TLS hostname/SNI while bypassing the Mac's local MagicDNS resolver.

## Current package

```text
sha256=5ca5e69be1c8cff902795e7b024008e872211e0ae0f14970946b5e3063716f30
staticQualification=ALL_PASS
SDK.main=b4d427564409989e8f839066accd17ec4c790724
VexLife.main=0fbaeb7c918ebdfc7af5389220d5bf081a906702
Android.main=30ecfe22156f6bb4b565eda990c72feff48a3866
```

Held:
```text
L1-L5 not yet proven
Send=false
Companion/model=false
restart=false
successor bundle waits for L1-L5 crossing together
```

<!-- [VXG RealForever][VEXWORK][TEMP-CONTINUITY][VCS04-LIVED][CURRENT-A010] -->
