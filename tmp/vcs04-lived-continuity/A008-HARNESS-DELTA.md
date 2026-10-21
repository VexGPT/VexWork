# A008 harness delta

`[VXG RealForever]`

This file records the reusable delta rather than private runtime evidence.

## Predecessor defect

A007 set `networkServeEffectPerformed=true` immediately after spawning the foreground Serve process. Tailscale then rejected the command because Serve was disabled for the tailnet.

Therefore:
```text
PROCESS_SPAWNED != NETWORK_EFFECT_ACTIVE
SERVE_ATTEMPTED != SERVE_ACTIVE
```

## A008 implementation shape

```text
spawn foreground private Serve
-> probe private HTTPS gateway status
-> if ACTIVE:
     mark Serve effect true
     continue
-> if Tailscale reports Serve disabled:
     parse exact enablement URL
     open browser page
     wait visibly with heartbeat
     retry same private Serve
     only mark effect true after HTTPS status route is reachable
-> otherwise fail closed
```

Return evidence gains one bounded `SERVE-STATE.json` projection:
```text
attempted
activeEffectPerformed
enablementPrompted
enableUrlObserved
publicFunnelEffectPerformed=false
```

No user-specific runtime identity, session credential, private key, or enablement URL is stored in this temporary PR.

<!-- [VXG RealForever][VEXWORK][TEMP-CONTINUITY][VCS04-LIVED][A008-DELTA] -->
