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

## A005 — current attempt

```text
packageSha256=3a51a21330cd26debd6c7349ab41dae4987e043b8688d71206a2f9e7745a0dd7
SDK.main=b4d427564409989e8f839066accd17ec4c790724
VexLife.main=0fbaeb7c918ebdfc7af5389220d5bf081a906702
VexLife.tree=3ab3affa774a2b97c0b27be2efb5a9506cdab0f9
Android.main=30ecfe22156f6bb4b565eda990c72feff48a3866
VCS04 VexLife producer blob parity across prior main advance=9/9 unchanged
state=RUNNING_OR_WAITING__NO_RETURN_OBSERVED_YET
```

A005 adds:
- explicit same-serial ADB reconnect waiting;
- missing/offline/unauthorized distinction;
- `adb reconnect offline` / `adb reconnect device` assistance;
- human-only USB debugging prompt boundary;
- Android Tailscale assisted setup preserved;
- Mac initially-running Tailscale state preserved.

Known harness weakness:
- A005 is still too quiet. Long waits/builds use captured subprocess output, so a healthy process may show no terminal activity.
- Next runner revision, if needed, should emit bounded heartbeats with phase + elapsed + ADB/tailnet state.
- A005 static qualification contains one **qualification-heuristic false negative**: the check named `noAutoThirdPartyInstall` sees the intentional VexLife APK install and reports false. This does not mean A005 auto-installs Tailscale; it does not. Correct the qualification predicate in the next formation instead of weakening the runtime.

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
