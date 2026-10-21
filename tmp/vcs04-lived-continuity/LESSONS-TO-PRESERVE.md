# Lessons to preserve — do not relearn A001-A012

[VXG RealForever]

These are the reusable lessons earned by the lived campaign. They are not a replay checklist and not generic bureaucracy.

## 1. Observable progress is part of a trustworthy human proof

A live PID is not progress.

A004/A005 showed that a process can be alive while looping uselessly.

Preserve:

~~~text
long human-facing proof
-> explicit phase changes
-> bounded heartbeat
-> elapsed time
-> current prerequisite state
-> whether product effects have started
~~~

Do not ask a human to trust a feedbackless wait.

## 2. Prove the effect you actually claim; do not substitute a proxy

Failed proxies from this trajectory:

~~~text
Android shell ping
!= private HTTPS gateway reachability

Mac MagicDNS resolution
!= Tailscale Serve enablement

PID exists
!= useful progress

Serve process attempted
!= Serve active

Serve port present
!= public Funnel exposure

screen rendered
!= canonical Conversation read

generic unavailable UI
!= exact transport failure
~~~

Use the closest rightful truth owner:
- Serve config for Serve;
- AllowFunnel[host:port] for public exposure;
- actual Android gateway requests for private transport;
- canonical Conversation history for read success.

## 3. Attempted effect and completed effect are different evidence

A007 incorrectly flipped the Serve-effect boolean on process spawn.

Preserve separate states such as:

~~~text
attempted
active
observed by consumer
completed
cleaned up
~~~

Do not infer one from another.

## 4. Human protected actions need a machine-observed resume predicate

Tailscale login/Serve enablement was human-only.

A008 taught:

~~~text
human clicked/completed browser action
!= runner has recognized the resulting machine state
~~~

After a protected action, observe the real provider state and resume from that—not from time elapsed or a repeated command.

## 5. Recover before replay

A008 left a foreground Serve session.

Later attempts learned the rightful recovery chain:

~~~text
observe exact Foreground ServeConfig
-> verify exact host/port/proxy
-> verify AllowFunnel != true
-> identify exact foreground owner process
-> terminate that exact owner
-> require config disappearance
-> continue
~~~

Do not broad-reset state simply because cleanup is inconvenient.

## 6. Exact provider semantics matter

Tailscale lessons:

~~~text
Serve/Funnel share ServeConfig representation
port presence != Funnel
AllowFunnel[host:port] == true is public-ingress truth

foreground Serve
-> owned by WatchIPNBus session
-> serve-off outside that session is not the same owner

macOS process discovery
-> use untruncated argv when exact ownership depends on the full command
~~~

Do not generalize from command names without reading the provider's actual ownership model.

## 7. Filesystem canonicality is an invariant, not a nuisance

A006 hit:

~~~text
/var/folders/...
!= canonical /private/var/folders/...
~~~

The Family owner correctly rejected the alias.

Fix the harness by canonicalizing the temporary root; do not weaken the Family invariant.

## 8. Identity, reachability, session and authority must stay separate

Permanent:

~~~text
TAILSCALE_CONNECTED != VEX_HOME_MEMBERSHIP
REACHABILITY != PAIRING
REMOTE_SESSION != HOME_AUTHORITY
PRIVATE_ROUTE != FAMILY_AUTHORITY
~~~

A route may persist while Home authority is destroyed.

Do not store bearer/session/membership authority in the Android route store.

## 9. Proof fixture is not product architecture

A012's temporary:

~~~text
Family Space
GROUP channel
seed message
~~~

exists only to isolate the read path.

The real first-room product owner is hostFamily().

Do not promote fixture construction into Android production code or onboarding.

## 10. A failure label can be wrong even when the evidence is useful

A012's raw:

~~~text
LIVED_GATEWAY_INTEGRATION_FAILED
~~~

was caused by a classifier that counted the harness's own /gateway/status probe.

Preserve:

~~~text
receipt label
!= semantic interpretation
~~~

Always inspect the underlying route/effect evidence before deriving the next edge.

## 11. Retain the diagnostic that would distinguish the next hypotheses

A012 collapsed Android refresh failure to a generic unavailable screen and retained no transport exception/logcat.

That means the next worker cannot distinguish:

~~~text
DNS
TLS/SNI
VPN route
HTTP transport
endpoint
session call path
repository composition
~~~

without another source/proof change.

Before replaying a lived proof, ask:

If it fails again, will the return tell us where?

If not, improve observability first.

## 12. Source currentness can advance without invalidating the semantic producer

Before A005, VexLife main advanced for unrelated Heretic/browser-companion work.

The correct response was:

~~~text
compare changed paths
+ verify all implicated VCS-04 producer blobs unchanged
-> rebind to current main
~~~

Do not blindly replay proof because a head changed, and do not blindly assume a head change is harmless.

## 13. Single-use attempt identity protects evidence

When an attempt is interrupted, do not erase LocalBridge custody or pretend a rerun is the same attempt.

~~~text
interrupted A00x
-> preserve its observed checkpoint
-> fresh attempt identity
~~~

DUPLICATE_ATTEMPT is evidence protection, not an obstacle to bypass.

## 14. Cleanup truth matters

A proof can fail after creating temporary effects.

Retain exact cleanup state:
- Android app stop;
- foreground Serve stop;
- gateway close;
- temporary Home destruction;
- Mac Tailscale original-state preservation;
- reachability-only Android route persistence.

Do not start a successor by assuming cleanup succeeded or failed; re-observe only the effect that matters.

## 15. The human should not become the test harness operator

Victor should not have to:
- interpret ADB;
- know package IDs;
- reason about MagicDNS;
- diagnose foreground Serve sessions;
- choose recovery commands;
- infer whether a silent process is healthy.

Those discoveries are inputs to the future guided product experience, not permanent human duties.

## 16. Do not extract architecture before real consumers earn it

Connected Services exists because Maps, Conversation and VexStream share real pressure.

Preserve the program order:

~~~text
real consumers
-> compare
-> minimum shared boundary
-> second/third real adoption
-> streaming stress
-> only then architecture extraction
~~~

Do not create a giant generic ApiManager, plugin framework, or streaming contract merely because it is imaginable.

## 17. Completion beats ceremony

PRs, proofs, source acceptance, Tailscale connectivity and rendered screens are checkpoints.

The human outcome is the outcome.

For VCS-04 that means the full L1-L12 lived contract.

For the parent Connected Services program, VCS-04 terminal is still followed by VCS-05, VCS-06 and VCS-07.

<!-- [VXG RealForever][VCS04][LESSONS-TO-PRESERVE] -->
