# A006 -> A007 exact harness repair

`[VXG RealForever]`

First substantive A006 failure:
```text
code=FAMILY_SPACE_HOME_INVALID
requested=/var/folders/.../work/lived-home
real=/private/var/folders/.../work/lived-home
```

Accepted owner law in `VexLife/src/core/family-space-store.mjs`:
```js
const real = fs.realpathSync.native(requested);
if (!samePath(real, requested)) {
  fail('FAMILY_SPACE_HOME_INVALID', 'Vex Home root is not canonical', { requested, real });
}
```

A007 does **not** weaken that law. Harness delta:
```diff
- const livedHome = path.join(workRoot,'lived-home'); mkdirp(livedHome);
+ const livedHomeRequested = path.join(workRoot,'lived-home');
+ mkdirp(livedHomeRequested);
+ const livedHome = fs.realpathSync.native(livedHomeRequested);
+ emitProgress('CHECKPOINT', {
+   homePathCanonical:'yes',
+   homePathAliasResolved:livedHome !== path.resolve(livedHomeRequested) ? 'yes' : 'no',
+ });
```

Everything else in the A006 lived proof remains semantically held:
- progress/heartbeat;
- ADB reconnect handling;
- Android Tailscale prerequisite;
- no shell-ping admission gate;
- foreground tailnet-only Serve;
- no Funnel configuration;
- actual private HTTPS route as network proof;
- Send/model/restart held.

Package:
```text
A007 sha256=ef63aa3d953b5f943e613a48d84fe81fbacc4415083ad35922e374b7913a92b8
```

<!-- [VXG RealForever][VEXWORK][TEMP-CONTINUITY][VCS04-LIVED][A006-A007-PATCH] -->
