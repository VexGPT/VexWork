# A009 → A010 harness delta

`[VXG RealForever]`

This is a temporary provider-side code-delta record for the lived harness. It is not canonical work truth and not VCS-04 product authority.

## Trigger

A009 return:

```text
returnSha256=4a9b7eacca2afbe2452afb44c1b30772c1eeffe3a5072ce83fefd47e61dd9b15
disposition=SAFE_FAILURE
firstFailure=PUBLIC_FUNNEL_EXPOSURE_DETECTED
failurePoint=Mac Tailscale predecessor-Serve recovery
ADB=NOT_REACHED
productEffectsPerformed=false
```

A009 incorrectly used:

```js
const funnel = run(tailscaleBin,['funnel','status','--json'], ...);
if (portAppears(funnelOutput, 8443)) {
  fail('PUBLIC_FUNNEL_EXPOSURE_DETECTED', ...);
}
```

The current Tailscale ServeConfig model separates server configuration from public ingress permission:

```text
TCP / Web / Foreground
  -> listener/proxy configuration

AllowFunnel[host:port] == true
  -> public Funnel permission
```

Therefore:

```text
PORT_PRESENT != PUBLIC_FUNNEL
ALLOW_FUNNEL_TRUE == PUBLIC_FUNNEL_PERMISSION
```

## A010 core code change

Foreground-aware Serve config traversal:

```js
function serveConfigs(status) {
  const parsed = status?.parsed;
  if (!parsed || typeof parsed !== 'object') return [];
  const out = [parsed];
  for (const nested of Object.values(parsed.Foreground ?? {})) {
    if (nested && typeof nested === 'object') out.push(nested);
  }
  return out;
}

function serveStatusHostPortPresent(status, dnsName, port) {
  return serveConfigs(status).some(
    (config) => Boolean(config?.Web?.[`${dnsName}:${port}`]),
  );
}

function serveStatusAllowsFunnel(status, dnsName, port) {
  const hostPort = `${dnsName}:${port}`;
  return serveConfigs(status).some(
    (config) => config?.AllowFunnel?.[hostPort] === true,
  );
}
```

Predecessor recovery now means:

```js
let status = readServeStatusJson();

if (!serveStatusHostPortPresent(status, dnsName, 8443)) {
  predecessorServeRecoveryState = 'NOT_NEEDED';
  return;
}

if (serveStatusAllowsFunnel(status, dnsName, 8443)) {
  predecessorServeRecoveryState = 'HELD_PUBLIC';
  fail(
    'PUBLIC_FUNNEL_EXPOSURE_DETECTED',
    'Exact predecessor host:8443 has AllowFunnel=true; refusing to mutate a public endpoint',
  );
}

// Exact private endpoint only:
tailscale serve --yes --https=8443 off
```

Active private listener guard now means:

```js
const serveTruthDuring = readServeStatusJson();

if (
  serveStatusAllowsFunnel(
    serveTruthDuring,
    tailStatus.dnsName,
    tailscalePort,
  )
) {
  fail(
    'PUBLIC_FUNNEL_EXPOSURE_DETECTED',
    'Exact active private Serve host:port unexpectedly has AllowFunnel=true',
  );
}
```

## Removed assumptions

A010 does **not** use:

```text
tailscale funnel status --json as an admission oracle
port presence as public-exposure truth
broad tailscale serve reset
Funnel mutation
Serve --bg
Mac MagicDNS as acceptance
```

## Preserved acceptance oracle

```text
Android installed app
-> private HTTPS gateway
-> possession challenge
-> remote authenticated session
-> Family bootstrap
-> READ_THREAD_HISTORY
-> canonical installed Conversation read
```

## A010 package

```text
sha256=5ca5e69be1c8cff902795e7b024008e872211e0ae0f14970946b5e3063716f30
staticQualification=ALL_PASS
SDK.main=b4d427564409989e8f839066accd17ec4c790724
VexLife.main=0fbaeb7c918ebdfc7af5389220d5bf081a906702
Android.main=30ecfe22156f6bb4b565eda990c72feff48a3866
```

<!-- [VXG RealForever][VEXWORK][TEMP-CONTINUITY][VCS04-LIVED][A009-A010-DELTA] -->
