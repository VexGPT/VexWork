# VCS-04 lived attempt ledger

`[VXG RealForever]`

This is a temporary provider-side continuity ledger for the lived harness. It records observed checkpoints; it does not replace VCS-04 work truth or target-repository evidence.

## A001

```text
packageSha256=1f1df1b3934d6930e62f5a80731678369b34bff8294b68843a5cf38054a5a4ac
firstFailure=TAILSCALE_NOT_RUNNING
classification=environment
productEffectsPerformed=false
L1-L5=NOT_PROVEN
```

Learned:
- Mac Tailscale state must be established before product effects.
- Foreground/private Serve design remained held and unexecuted.

## A002

```text
packageSha256=256175d6ca72f9f72c3641f9bb2f100ef4155f68b9ec86302f6c0ddcec7f19a9
returnSha256=ecdf8575c69cb242c93cfafe665d9107e919c03755c1e899c2ed0540b9a43ea5
firstFailure=ANDROID_TAILSCALE_APP_MISSING
classification=environment
MacTailscaleAutoRecovery=PASS
MacOriginalStoppedStateRestore=PASS
productEffectsPerformed=false
L1-L5=NOT_PROVEN
```

Learned:
- Mac recovery can be automated.
- Phone tailnet dependency is separate.
- Official Android application id expected by the harness is `com.tailscale.ipn`.

## A003

```text
packageSha256=940f06bcf2f1d1bb29f8ac6d4411aaca881e63f04d4320cf126664c75798ab04
returnSha256=da82462e566e3834676c0e330d55af7e526bf3ba9719772ab0b2c02f1ce3928d
firstFailure=TAILSCALE_NOT_RUNNING
classification=environment
productEffectsPerformed=false
L1-L5=NOT_PROVEN
```

Observed chronology:
- A003 exited at Mac preflight before Android setup was reached.
- Mac was manually reconnected after the attempt had already exited.
- Fresh attempt required; no product effect was recoverable because none had started.

## A004

```text
packageSha256=4664a715b39acb95afb78975e35ed77017634f73730ca1f36e8cb3d3e0c36ab8
returnFormed=false
termination=USER_CTRL_C_DURING_ANDROID_TAILSCALE_SETUP_WAIT
laterRelaunch=DUPLICATE_ATTEMPT
knownProductEffectsPerformed=false
```

Observed chronology:
- official Android Tailscale setup path was reached;
- phone was temporarily unplugged to finish tailnet setup;
- the runner did not explicitly model USB disappearance/reappearance;
- operator interrupted the wait;
- the single-use attempt identity correctly rejected a second launch.

Learned:
- Android onboarding may legitimately require temporary USB disconnection.
- ADB reconnect must be an explicit prerequisite state, not an implicit assumption.

## A005 — interrupted / no RETURN

```text
packageSha256=3a51a21330cd26debd6c7349ab41dae4987e043b8688d71206a2f9e7745a0dd7
SDK.main=b4d427564409989e8f839066accd17ec4c790724
VexLife.main=0fbaeb7c918ebdfc7af5389220d5bf081a906702
VexLife.tree=3ab3affa774a2b97c0b27be2efb5a9506cdab0f9
Android.main=30ecfe22156f6bb4b565eda990c72feff48a3866
returnFormed=false
termination=USER_ENDED_FEEDBACKLESS_PRE_EFFECT_LOOP
attemptArtifactsObserved=[ATTEMPT-STARTED.txt]
adbAfterStop=R5CT50N3ZHA device SM_S908U
knownProductEffectsPerformed=false
```

A005 added explicit same-serial USB/debug reconnect handling, but two problems remained:
- long waits/builds could be healthy-but-silent;
- Android shell/MagicDNS `ping` was still used as a 20-minute prerequisite gate even though the real Connected Services claim is private HTTPS gateway traffic.

Because the only attempt artifact was `ATTEMPT-STARTED.txt`, and A005 source orders source clones before all route/membership/Serve/gateway effects, the observed interruption remained pre-effect.

## A006 — consumed SAFE_FAILURE after first real product effects

```text
packageSha256=4665251b1b4cc571ad0d4fab8602b44b6734bdbcec3574af22191c16eff3b4b8
returnSha256=287f3720e884221aec6e63fc462aed0eed5644925961fe0ac1406c63b502ca44
SDK.main=b4d427564409989e8f839066accd17ec4c790724
VexLife.main=0fbaeb7c918ebdfc7af5389220d5bf081a906702
Android.main=30ecfe22156f6bb4b565eda990c72feff48a3866
disposition=SAFE_FAILURE
firstFailure=FAMILY_SPACE_HOME_INVALID
```

A006 proved the new health/progress model worked and materially crossed the previous environment boundary:
- Mac Tailscale RUNNING;
- Android ADB DEVICE;
- Android Tailscale INSTALLED_VPN_VISIBLE;
- exact SDK/VexLife/Android sources;
- Android APK/test APK build + install;
- host bridge instrumentation;
- reachability-only Android route persisted;
- public Android possession identity observed;
- one bounded temporary Home membership + lease formed.

A006 stopped before Serve/gateway traffic because the temporary macOS Home path was `/var/folders/...` while the accepted Family owner requires its canonical `/private/var/folders/...` real path.

## A007 — consumed USER_ACTION_REQUIRED at private Serve enablement

```text
packageSha256=ef63aa3d953b5f943e613a48d84fe81fbacc4415083ad35922e374b7913a92b8
returnSha256=b2b6be3f6a034a1348a39a7a83ed709c5b2f6f7705be5a50127d05ff57ed1546
disposition=USER_ACTION_REQUIRED
firstFailure=TAILSCALE_SERVE_UNAVAILABLE
reason=TAILNET_SERVE_NOT_ENABLED
```

A007 crossed the A006 canonical-path defect:
- temporary Family fixture = READY;
- loopback private gateway = LISTENING;
- route persistence + bounded temporary membership/lease = performed;
- Tailscale foreground Serve attempt was rejected before becoming active because Serve is disabled for the tailnet;
- no Funnel/public exposure occurred;
- no Android gateway request was observed;
- L1-L5 therefore remain unproven.

A007 also exposed an evidence-accounting defect: `networkServeEffectPerformed` flipped on Serve attempt even though no active Serve listener existed. The return log proves the effect was attempted but not active.

## A008 — current qualified successor

```text
packageSha256=13010c3527ff105de4b992549e893824fa64ab744c7aa8d317ca6b8a06146f6c
SDK.main=b4d427564409989e8f839066accd17ec4c790724
VexLife.main=0fbaeb7c918ebdfc7af5389220d5bf081a906702
Android.main=30ecfe22156f6bb4b565eda990c72feff48a3866
staticQualification=ALL_PASS
```

A008:
- separates Serve attempted from Serve active;
- opens the exact private Serve enablement page if Tailscale reports that Serve is disabled;
- emits visible WAIT/HEARTBEAT state while the human completes the protected enablement;
- retries only the same foreground private Serve;
- marks `networkServeEffectPerformed=true` only after the private HTTPS gateway status route is reachable;
- never configures Funnel;
- preserves Send/model/restart holds.

## Product acceptance still held

No lived attempt above has yet established:

```text
L1 remote device possession
L2 remote authenticated session
L3 private bounded gateway
L4 current Home/Family authority
L5 canonical installed Conversation read
```

A successful future attempt must establish those before advancing to L6-L11.

<!-- [VXG RealForever][VEXWORK][TEMP-CONTINUITY][VCS04-LIVED][ATTEMPTS] -->


## A008

```text
packageSha256=13010c3527ff105de4b992549e893824fa64ab744c7aa8d317ca6b8a06146f6c
returnSha256=c3e6788a05eae14bbeb919248703584c11f331c5a6910a2b3250e1ece5da858a
disposition=USER_ACTION_REQUIRED
firstFailure=TAILSCALE_SERVE_ENABLE_REQUIRED
networkServeEffectPerformed=false
publicFunnelEffectPerformed=false
L1-L5=NOT_PROVEN
```

Important correction from the return:
- the human Serve/HTTPS enablement **did succeed**;
- Tailscale Serve log recorded `Success.`;
- later retries reported `listener already exists for port 8443`;
- every Mac curl to the MagicDNS FQDN returned status 6 (hostname could not be resolved);
- A008 therefore confused macOS local DNS resolution failure with Serve enablement failure and repeatedly launched conflicting Serve clients;
- Serve-state receipt truthfully retained `attempted=true / activeEffectPerformed=false / publicFunnelEffectPerformed=false`;
- cleanup closed the temporary gateway and preserved the Mac's originally-running Tailscale state.

## A009 — current

```text
packageSha256=ad90c1079e1386ba58bbb78eb5624340079e71ea2e85d690f6659fa86392f197
SDK.main=b4d427564409989e8f839066accd17ec4c790724
VexLife.main=0fbaeb7c918ebdfc7af5389220d5bf081a906702
Android.main=30ecfe22156f6bb4b565eda990c72feff48a3866
state=FORMED_STATIC_ALL_PASS
```

A009 corrections:
- Tailscale `serve status --json` is the Serve listener/proxy truth owner;
- macOS local MagicDNS resolution is not an admission predicate;
- optional Mac HTTPS diagnostic uses `curl --resolve <dns>:<port>:<tailscale-ip>` while preserving the TLS hostname;
- actual Android private-gateway route traffic remains the acceptance oracle;
- if A008 left predecessor-owned HTTPS 8443 private Serve state, A009 first verifies 8443 is not Funnel/public and attempts exact endpoint recovery only;
- one foreground Serve candidate runs at a time; no repeated listener-conflict loop;
- visible progress/heartbeat behavior remains.



## A009 — consumed SAFE_FAILURE during over-conservative Funnel guard

```text
packageSha256=ad90c1079e1386ba58bbb78eb5624340079e71ea2e85d690f6659fa86392f197
returnSha256=4a9b7eacca2afbe2452afb44c1b30772c1eeffe3a5072ce83fefd47e61dd9b15
disposition=SAFE_FAILURE
firstFailure=PUBLIC_FUNNEL_EXPOSURE_DETECTED
duration≈2s
productEffectsPerformed=false
L1-L5=NOT_PROVEN
```

A009 stopped before ADB/source clones/product effects while trying to recover A008's predecessor Serve state.

The guard was safe but semantically wrong:
- it treated "HTTPS 8443 appears in `tailscale funnel status --json`" as public exposure;
- current Tailscale Serve/Funnel status describes a shared ServeConfig;
- actual public ingress permission is represented separately by `AllowFunnel[host:port]`;
- foreground config may be nested beneath `Foreground`.

Therefore port presence alone is not Funnel truth.

## A010 — current qualified successor

```text
packageSha256=5ca5e69be1c8cff902795e7b024008e872211e0ae0f14970946b5e3063716f30
SDK.main=b4d427564409989e8f839066accd17ec4c790724
VexLife.main=0fbaeb7c918ebdfc7af5389220d5bf081a906702
Android.main=30ecfe22156f6bb4b565eda990c72feff48a3866
staticQualification=ALL_PASS
```

A010 corrections:
- parses both top-level and `Foreground` ServeConfig values;
- classifies exact public exposure only when `AllowFunnel[host:port] == true`;
- does not call `tailscale funnel status` and does not issue Funnel mutation commands;
- if exact predecessor host:8443 exists with AllowFunnel absent/false, removes only that private Serve endpoint;
- active private Serve is rejected only if the exact host:port later gains AllowFunnel=true;
- preserves forced-IP Mac HTTPS diagnostic, heartbeats, USB recovery and Android private-gateway traffic as the acceptance oracle;
- no broad Serve reset, no `--bg`, no Send/model/restart effect.



## A010 — consumed USER_ACTION_REQUIRED during foreground-owner recovery

```text
packageSha256=5ca5e69be1c8cff902795e7b024008e872211e0ae0f14970946b5e3063716f30
returnSha256=171150e42682886b1ca9136018aa34b9b4c9a9e5e5d7c48936a1d3d396cc2de8
disposition=USER_ACTION_REQUIRED
firstFailure=TAILSCALE_SERVE_UNAVAILABLE
duration≈8s
productEffectsPerformed=false
L1-L5=NOT_PROVEN
```

A010 correctly classified the stale 8443 mapping as private foreground Serve:
- exact foreground session = `e3af76c41c2acacf`;
- exact proxy = `http://127.0.0.1:53148`;
- `AllowFunnel` absent/false;
- A010 attempted `tailscale serve --https=8443 off` six times;
- each off command failed and the foreground mapping remained.

Root cause:
- the mapping lives under Tailscale's foreground WatchIPNBus session;
- `off` does not operate inside that existing foreground session;
- recovery must act on the exact foreground process/session owner, not the parent/background config.

## A011 — current qualified successor

```text
packageSha256=cbe48015de98c2de5a9f37217e12011e2478cb62bf8420a84a40caccebd52896
SDK.main=b4d427564409989e8f839066accd17ec4c790724
VexLife.main=0fbaeb7c918ebdfc7af5389220d5bf081a906702
Android.main=30ecfe22156f6bb4b565eda990c72feff48a3866
staticQualification=ALL_PASS
```

A011 recovery:
- requires exactly one foreground host:8443 entry;
- requires HTTPS=true;
- requires exact loopback proxy shape `http://127.0.0.1:<port>`;
- requires `AllowFunnel != true`;
- requires exactly one matching local `tailscale serve --yes --https=8443 <exact-proxy>` process;
- sends SIGTERM to that exact owner only;
- uses SIGKILL only as a bounded fallback if that same exact process remains;
- requires the foreground config to disappear before proceeding;
- never uses `tailscale serve reset`, broad cleanup, or Funnel mutation;
- preserves heartbeat/progress output and the Android private-HTTPS acceptance oracle.

