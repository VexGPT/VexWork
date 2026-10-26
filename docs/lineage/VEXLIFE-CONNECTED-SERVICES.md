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

### Phase 4 — completed

A019 had already established L6 and L8. A037 closed the one remaining predicate, L7, against current accepted VexLife owner source and the exact live qualified Heretic runtime:

```text
L6 one durable human Send exactly once              PASS
L7 separate real Companion/Heretic response         PASS
L8 model failure does not erase human append        PASS
```

A037 performed exactly one real `/v1/chat/completions` request, durably persisted the canonical HUMAN request and COMPANION response, then instantiated a fresh bridge and replayed the same idempotency key. The retry recovered the completed pair with `modelCallPerformed=false`, no second HTTP model call, and exactly two canonical messages. The temporary proof Home was deleted; ordinary product Home, runtime start/stop, Memory, training and weights were untouched.

Canonical Workgraph truth:

```text
work.vexlife.connected-services.vcs04.phase4.send-failure-separation = COMPLETED
work.vexlife.connected-services.vcs04.phase4.companion-response      = COMPLETED
parent Phase 4                                                       = COMPLETED
```

Family Conversation law remains unchanged:

```text
HUMAN_MESSAGE_DELIVERY != AI_ATTENTION
MODEL_BUSY != FAMILY_CHAT_BLOCKED
HUMAN_APPEND_DURABLE != MODEL_RESPONSE_SUCCEEDED
```

### Phase 5 — completed

A022/A023 completed the restart/no-duplicate slice against the already-proven durable human append:

```text
L9  same-session Android observation       PASS
L10 real Android process restart           PASS
L11 no duplicate append/model replay       PASS
temporary private Serve cleanup            CLOSED
```

A022 proved the same canonical message survived real Android process death/relaunch with count 1 and without a second append/model replay. A023 then closed the exact temporary Serve effect without product replay.

### Phase 6 — terminal

With L1-L11 complete, foreground responsibility is source/currentness convergence rather than another lived Conversation attempt.

Exact VexLife-Android candidate:

```text
PR #154
head=2d67682af1617aab0886784dc45704804303a183
tree=9e378c9d53d98546b43564e1beec7c022d9a1db3
changed paths=12
```

The required sequence is:

```text
live Android main
+ exact PR154
-> CurrentMainCompositionProof
-> exact synthetic merge tree
-> vexVerifyLocal
-> fresh affected Assurance
-> Formal Review / READY / OwnerMergeDuty as actually required
-> ordinary expected-head merge
-> actual merge tree must equal the proven synthetic tree
-> post-merge currentness
-> VexWork / VCS-04 terminal convergence
```

A038 stopped before inner task compilation with `MANIFEST_CURRENT_LIFECYCLE_STATE`; its invalid task-local value was `INTEGRATION_CURRENTNESS_PENDING`. No candidate proof or product/provider mutation ran.

A039/A040 remain durable proof-harness history. A041 then completed the real current-main composition proof:

```text
main=6f5b2dc6cdbf284b84cb590ba5b1016af3d33939
candidate=2d67682af1617aab0886784dc45704804303a183
syntheticTree=b0c80df03471a5f79832ebd7b68845fdb91966b7
vexVerifyLocal=PASS
candidate/harness/environment/unknown findings=0/0/0/0
```

Fresh Independent Assurance returned `CLEAR_ON_EXACT_HEAD`; Formal Review returned `APPROVE_EXACT_HEAD`. Owner Merge Duty then merged PR154 as `9104d232086afd888700c3317ab79c2a8b87239b`.

Post-merge verification proved:

```text
current main = merge commit 9104d232086afd888700c3317ab79c2a8b87239b
ordered parents = 6f5b2dc6cdbf284b84cb590ba5b1016af3d33939, 2d67682af1617aab0886784dc45704804303a183
actual merge tree = b0c80df03471a5f79832ebd7b68845fdb91966b7
A041 proven tree = b0c80df03471a5f79832ebd7b68845fdb91966b7
tree match = true
commit verification = valid
```

One shared `strings.xml` blob is a valid three-way composition rather than the candidate blob verbatim; it is exactly the A041-proven composed blob and retains current-main strings plus PR154's Conversation composer strings.

PR154 is therefore `TERMINAL_ACCEPTED_CURRENT`. No further Conversation lived behavior proof is required unless future source changes invalidate the accepted evidence.

A003 regenerated the current Connected Services projections and reached the full deterministic VexWork review. The only discovered VexWork source defect was two stale tests that still expected the pre-split Project cardinality/state. After repairing those rightful tests, A003 passed the generator/review closure. Phase 6 and VCS-04 therefore complete, releasing VCS-05 to READY.
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
Phase 4 = COMPLETED
  Phase 4A durable Send + failure separation = COMPLETED
  Phase 4B separate durable Companion response (L7) = COMPLETED
Phase 5 = COMPLETED
Phase 6 = COMPLETED
PR #917 source defect = COMPLETED / accepted-current
PR #904 source/lifecycle = TERMINAL_ACCEPTED_CURRENT / custody RELEASED
PR #154 source/currentness = TERMINAL_ACCEPTED_CURRENT @ 9104d232086afd888700c3317ab79c2a8b87239b
VCS-04 = COMPLETED
VCS-05 = READY
current lived gap = NONE
```

<!-- [VXG RealForever][VEXWORK][LINEAGE][VEXLIFE-CONNECTED-SERVICES] -->
