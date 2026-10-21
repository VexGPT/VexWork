# A011 consumed RETURN

[VXG RealForever]

returnSha256=a40fbecb8478661596e992d4fb7d5e52efa149af268578d4a759e1b51bcfa714
packageSha256=cbe48015de98c2de5a9f37217e12011e2478cb62bf8420a84a40caccebd52896
disposition=USER_ACTION_REQUIRED
firstFailure=TAILSCALE_FOREGROUND_OWNER_UNAVAILABLE
classification=environment
duration≈2s

Exact checkpoint:
foregroundSession=e3af76c41c2acacf
httpsPort=8443
proxy=http://127.0.0.1:53148
AllowFunnel=false/absent
ownerMatchCount=0
ADB=NOT_REACHED
productEffectsStarted=false
L1-L5=NOT_PROVEN

Interpretation:

A011 correctly descended to the exact stale foreground Serve config and refused broad cleanup. Its process-discovery predicate was still too brittle:

/bin/ps -axo pid=,ppid=,etime=,command=
+ regex requires lowercase /tailscale path and full target text

On macOS, long argv may be truncated and the Tailscale app binary can surface as .../Contents/MacOS/Tailscale, so ownerMatchCount=0 does not prove the foreground session has no local CLI owner.

A012 corrects only that process-observation boundary.

This provider artifact is continuity/evidence only.

<!-- [VXG RealForever][VEXWORK][TEMP-CONTINUITY][VCS04][A011-RETURN] -->