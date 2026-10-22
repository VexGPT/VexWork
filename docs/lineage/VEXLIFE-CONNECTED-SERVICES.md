# VexLife Connected Services lineage

`[VXG RealForever]`

This is the durable causal history behind `project.vexlife.connected-services`. Fresh instances should read the Project README first and come here only when they need to understand **why** the current state exists or recover a prior boundary.

## Program intention

Connected Services provides one reusable private connection/session boundary while keeping feature semantics, Home authority, provider engines and deployment separately owned.

```text
ONE shared connection/session substrate != ONE generic feature API
TRANSPORT != PRODUCT_MEANING
CONNECTED_SERVICE != HOME_AUTHORITY
```

## VCS-04 acceptance

```text
L1  remote device possession
L2  bounded remote authenticated session
L3  private bounded gateway
L4  current Home / Family authority
L5  canonical installed Conversation read
L6  one durable human Send exactly once
L7  separate Companion/model response
L8  model failure does not erase human append
L9  same-session Android observation
L10 real Android process restart
L11 no duplicate append/model replay
L12 current source/lifecycle evidence
```

## Durable progress — read before attempt history

### Source/read doorway

- VexLife-Android PR #149 accepted/current: installed private Family Conversation read.
- VexLife-Android PR #152 accepted/current: closed pre-challenge transport diagnostics.
- Authenticated HTTP 401 remains visible to the connection owner so current session invalidation is preserved.

### Phase 1 — completed

The early installed failure was first separated into a real network-timeout diagnostic, then into its exact tailnet causes.

```text
A013 -> session-challenge.network-timeout
A014 -> MAC_SHIELDS_UP
human -> Allow incoming connections enabled
A015 -> shieldsUp=false machine-confirmed
A016 -> route-selected Android peer unique/current
      -> Mac->Android DISCO / TSMP / ICMP PASS
      -> Android->Mac ICMP PASS
      -> private Serve TCP by IP PASS
      -> private Serve TCP by MagicDNS PASS
A017 -> temporary Serve cleanup CLOSED
```

Meaning:

```text
generic private tailnet/Serve TCP reachability = PROVEN
Phase 1 = COMPLETED
```

### Phase 2 — completed

A018 then re-entered the installed product path with a deterministic proof fixture:

```text
fresh Android process = PASS
Home doorway = PASS
Family screen = PASS
POST home.session.challenge = 200
POST home.session.establish = 200
GET  home.family.bootstrap = 200
POST home.family.conversation / READ_THREAD_HISTORY = 200
seed message visible = PASS
L1/L2/L3/L4/L5 = PASS
diagnosticRef = null
```

A019 confirmed A018's temporary Serve mapping already gone and still absent.

```text
Phase 2 = COMPLETED
```

### Phase 3 — completed

Fixture law learned in Phase 2 remained intact:

```text
temporary Family proof room != product first Family
proof seed message != product architecture
Android bootstrap is read-only
Android must not invent space/channel/thread identity
```

PR #917 corrected the one source mismatch that hid a legitimate fresh owner-only GROUP. A020 then executed the actual product owner:

```text
fresh authenticated Home
-> browser HOST lifecycle
-> hostFamily()
-> Family Space CREATED
-> initial GROUP MATERIALIZED
-> owner-only bootstrap/read CURRENT
-> installed Android L1-L5 PASS
-> empty history visible
-> no seed message
```

A020's outer SAFE_FAILURE was cleanup-only. A021 observed the exact A020 port-10000 private Serve mapping already absent, `AllowFunnel=false`, and performed no product replay or network mutation.

```text
Phase 3 = COMPLETED
```

### Phase 4 — current

The next acceptance slice is deliberately two effects rather than one disguised transaction:

```text
L6 one durable human Send exactly once
L7 separate Companion/model response
L8 model failure does not erase human append
```

Accepted Family Conversation law keeps ordinary human delivery and AI attention separate. The Family Companion runtime consumes a persisted Family trigger and owns its own queue/model/durable-response semantics. Phase 4 must preserve that separation while connecting the installed Android Send path to the current Home-owned producer.

```text
HUMAN_MESSAGE_DELIVERY != AI_ATTENTION
MODEL_BUSY != FAMILY_CHAT_BLOCKED
HUMAN_APPEND_DURABLE != MODEL_RESPONSE_SUCCEEDED
```

Current canonical Work item:

```text
work.vexlife.connected-services.vcs04.phase4-send-companion = READY
```

## Recovery appendix — attempt lineage

Attempt identities are evidence/recovery history, not canonical Work items.

| Attempt | Terminal learning |
|---|---|
| A001 | Mac Tailscale was not running; no product effects. |
| A002 | Mac recovery could be automated; Android Tailscale app was missing. |
| A003 | Human Mac reconnection occurred after attempt exit; fresh attempt required. |
| A004 | Android Tailscale setup could require leaving the USB/debug workflow; replay protection worked. |
| A005 | Feedbackless waits and MagicDNS ping as a prerequisite were the wrong proof/UX. |
| A006 | First real product effects crossed; non-canonical Home path alias rejected correctly. |
| A007 | Canonical path fixed; Tailscale Serve required protected enablement. |
| A008 | Serve enablement succeeded; local MagicDNS failure was misread as enablement failure. |
| A009 | Serve/Funnel meaning corrected. |
| A010 | Stale foreground Serve could not be removed by out-of-session generic off. |
| A011 | Recovery moved to the exact foreground Serve process owner instead of broad reset. |
| A012 | Installed Family screen reached with a deterministic proof room, but no authenticated challenge reached the gateway. |
| A013 | Closed Android diagnostic surfaced session-challenge network timeout. |
| A014 | Mac Shields Up identified. |
| A015 | Shields Up machine-confirmed cleared; broad peer collection remained ambiguous. |
| A016 | Route-selected peer resolved; private Serve TCP by IP and MagicDNS passed; cleanup debt only. |
| A017 | Exact cleanup re-observation found the temporary mapping already gone; Phase 1 complete. |
| A018 | Installed deterministic-fixture L1-L5 passed; cleanup debt only. |
| A019 | Exact cleanup re-observation found the temporary mapping already gone; Phase 2 complete. |
| A020 | Real fresh browser HOST -> installed Android L1-L5 passed with owner-only empty history; cleanup debt only. |
| A021 | Exact A020 cleanup re-observation found port 10000 already absent; Phase 3 complete. |

## Manual onboarding discoveries

Humans have needed protected or app-switching actions for:

```text
Mac:
  Tailscale installed/running/authenticated
  Serve enablement
  Allow incoming connections / Shields Up

Android:
  Tailscale installation
  same-tailnet sign-in
  VPN consent
  temporary departure from USB/debug flow

Cross-device:
  return to VexLife after setup
  reconnect/re-authorize USB when needed
```

Product law:

```text
protected human action
-> machine re-observe the resulting predicate
-> continue automatically

HUMAN_CLICKED != MACHINE_CONFIRMED
```

The future onboarding idea remains parked, not silently adopted:
`work.vexlife.connected-services.guided-onboarding`.

## Lessons not to relearn

1. Visible progress matters; healthy-but-silent waits are poor lived proof.
2. Prove the claimed effect, not a proxy.
3. Attempted != active != observed != completed.
4. Recover exact owned state before replay; do not broad-reset.
5. Serve and Funnel are separate provider meanings.
6. Identity, reachability, session, membership and authority remain separate.
7. Proof fixtures do not become product architecture.
8. A read doorway does not gain mutation authority.
9. Preserve the first substantive failure and repair the smallest rightful layer.
10. Attempt disposition does not erase semantic progress already proven.
11. Cleanup truth is part of proof.
12. Rebind mutable source after unrelated movement.
13. Completion beats ceremony.

## Fresh-instance route

```text
VexWork public workspace
-> project.vexlife.connected-services
-> projects/vexlife-connected-services/README.md
-> current READY/RUNNING work item
-> this lineage only if causal history is needed
-> target repository current source for the next effect
```

Current truth:

```text
Phase 1 = COMPLETED
Phase 2 = COMPLETED
Phase 3 = COMPLETED
PR #917 source defect = COMPLETED / accepted-current
work.vexlife.connected-services.vcs04.phase3.host-to-android-l1-l5 = COMPLETED
Phase 4 = READY
work.vexlife.connected-services.vcs04.phase4-send-companion = READY
```

<!-- [VXG RealForever][VEXWORK][LINEAGE][VEXLIFE-CONNECTED-SERVICES] -->
