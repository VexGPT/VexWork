# Current lived runner — A012

[VXG RealForever]

Purpose: exact recovery of the stale A008 foreground Tailscale Serve owner, then continuation of VCS-04 installed-read proof.

Source coordinates:
SDK.main=b4d427564409989e8f839066accd17ec4c790724
VexLife.main=0fbaeb7c918ebdfc7af5389220d5bf081a906702
Android.main=30ecfe22156f6bb4b565eda990c72feff48a3866

Package:
sha256=5f416a18f4c1d2fbc2da2987165ebee17c0c7e3fd91e3fd9fe4f3b9e8c83533e
staticQualification=ALL_PASS

Predecessor A011:
returnSha256=a40fbecb8478661596e992d4fb7d5e52efa149af268578d4a759e1b51bcfa714
firstFailure=TAILSCALE_FOREGROUND_OWNER_UNAVAILABLE
foregroundSession=e3af76c41c2acacf
httpsPort=8443
proxy=http://127.0.0.1:53148
ownerMatchCount=0
productEffectsPerformed=false

A012 correction:
- use ps -ww -axo pid=,ppid=,etime=,args=;
- parse complete argv rather than one lowercase-path regex;
- accept executable basename tailscale or macOS .../Contents/MacOS/Tailscale;
- require serve, --yes, exact --https=8443, exact loopback proxy;
- reject --bg and funnel;
- exactly one owner required;
- retain bounded candidate process diagnostics on mismatch;
- SIGTERM exact owner first; same-PID SIGKILL only as bounded fallback;
- no Serve reset; no Funnel mutation.

Acceptance remains:
L1-L5 must cross together before successor bundle formation.

This PR surface is temporary continuity/evidence only.

<!-- [VXG RealForever][VEXWORK][TEMP-CONTINUITY][VCS04][CURRENT-A012] -->