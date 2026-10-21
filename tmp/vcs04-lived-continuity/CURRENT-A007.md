# Current lived runner — A007

`[VXG RealForever]`

## Why A007 exists

A006 was the first attempt to cross the prior environment/harness boundary into real VCS-04 product-side lived effects.

A006 RETURN:
```text
returnSha256=287f3720e884221aec6e63fc462aed0eed5644925961fe0ac1406c63b502ca44
disposition=SAFE_FAILURE
duration≈29.5s
firstFailure=FAMILY_SPACE_HOME_INVALID
classification=candidate_or_integration
```

A006 completed:
```text
Mac Tailscale RUNNING
Android ADB DEVICE
Android Tailscale INSTALLED_VPN_VISIBLE
SDK/VexLife/Android exact source verification
Android APK + test APK build/install
host bridge instrumentation
Android reachability-only route persistence
public Android possession identity observation
bounded temporary Home membership
bounded temporary lease
```

A006 stopped before:
```text
foreground Serve
gateway traffic
remote possession proof
remote authenticated session
Family bootstrap/history
installed canonical read
```

## Exact A006 failure

The temporary Home was requested through macOS's `/var` alias:

```text
requested=/var/folders/.../work/lived-home
real=/private/var/folders/.../work/lived-home
code=FAMILY_SPACE_HOME_INVALID
```

The accepted Family Space owner deliberately requires one canonical directory and rejects aliases.

## A007 repair

A007 preserves that owner invariant. It changes only the harness Home formation:

```js
const livedHomeRequested = path.join(workRoot, 'lived-home');
mkdirp(livedHomeRequested);
const livedHome = fs.realpathSync.native(livedHomeRequested);
```

No product source is weakened or changed.

## Current A007 coordinates

```text
packageSha256=ef63aa3d953b5f943e613a48d84fe81fbacc4415083ad35922e374b7913a92b8
SDK.main=b4d427564409989e8f839066accd17ec4c790724
VexLife.main=0fbaeb7c918ebdfc7af5389220d5bf081a906702
Android.main=30ecfe22156f6bb4b565eda990c72feff48a3866
staticQualification=ALL_PASS
```

A006 heartbeat/progress reporting is preserved.

## Successor-bundle threshold

Do not form a full lane successor bundle merely because A006 reached the first product effect.

Preferred threshold:
```text
L1 remote device possession
+ L2 remote authenticated session
+ L3 private bounded gateway
+ L4 current Home/Family authority
+ L5 canonical installed Conversation read
= one coherent lived-read foundation checkpoint
```

Until that threshold crosses, PR #7 is the cheaper continuity surface.

<!-- [VXG RealForever][VEXWORK][TEMP-CONTINUITY][VCS04-LIVED][CURRENT-A007] -->
