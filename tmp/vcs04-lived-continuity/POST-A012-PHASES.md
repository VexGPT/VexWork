# Post-A012 current state and next phases

[VXG RealForever]

## Current state in plain language

The foundations are no longer hypothetical.

A012 proved that this machine/phone pair can get through:

~~~text
Mac + Android Tailscale prerequisites
-> exact source build/install
-> Android route persistence
-> Android public device identity
-> bounded temporary Home authority
-> deterministic temporary Family room/message
-> loopback private gateway
-> private Tailscale Serve, AllowFunnel=false
-> installed VexLife
-> Home
-> Family Conversation screen
~~~

The first unresolved live product boundary is before Android's first possession-challenge HTTP request reaches the gateway.

This means:

~~~text
network/gateway foundation = materially real
installed authenticated read = not yet proven
fresh-user room establishment = not yet integrated into product flow
Send/Companion/restart = not started
~~~

## Phase 1 — Android transport observability

Goal:

~~~text
know exactly where the installed call chain fails before session challenge
~~~

Work:
- descend current Android source/culture;
- preserve current PR149 architecture unless evidence demands change;
- add the smallest sanitized diagnostic/evidence seam;
- distinguish endpoint construction, DNS, VPN route, TLS/SNI, HTTP transport, connection/session, and repository failures;
- do not expose secrets.

Exit predicate:

~~~text
the next lived proof can identify the exact pre-challenge failure,
or reaches /v1/home/session/challenge
~~~

Do not ask Victor to replay A012 until Phase 1 changes what the next run can learn.

## Phase 2 — deterministic-fixture L1-L5 transport/read proof

Use the existing temporary fixture only to isolate transport/read.

Target:

~~~text
Android
-> possession challenge
-> possession signature verification
-> remote authenticated session
-> Family bootstrap
-> exactly one temporary current room
-> READ_THREAD_HISTORY
-> visible seed message
~~~

Exit predicate:

~~~text
fixture-backed L1-L5 = PASS
~~~

This proves the network/session/read path, not fresh-user establishment.

## Phase 3 — real fresh-user Family establishment integration

Replace proof-only room creation with the accepted product owner:

~~~text
authenticated fresh Home
-> family-host-runtime.mjs::hostFamily()
-> canonical Family Space
-> canonical initial GROUP room
-> Android bootstrap/read
~~~

Determine the rightful product trigger; do not make Android or bootstrap own creation.

Exit predicate:

~~~text
fresh-user product route creates/reuses canonical first room
and installed Android reads it
~~~

Then re-prove L1-L5 through product establishment, not the harness fixture.

## Phase 4 — durable human Send and failure separation

After L1-L5 product proof:

~~~text
L6 human Send exactly once
-> durable Conversation append is terminal human truth

L7 separately admitted Companion/model turn
-> durable response

L8 force Companion/model failure
-> prove human append remains
~~~

Permanent:

~~~text
SEND_COMPLETED != MODEL_RESPONSE_COMPLETED
~~~

## Phase 5 — observation, restart, no duplicates

~~~text
L9 same-session Android observation
L10 kill and relaunch actual Android process
L11 retry/restart produces no duplicate append or model replay
~~~

Recomposition is not restart proof.

## Phase 6 — VCS-04 terminal currentness

Re-ground source/lifecycle and close L12 only after lived predicates are current.

Then:

~~~text
VCS-04 terminal
-> VCS-05 Stream adoption/stress
-> VCS-06 architecture extraction
-> VCS-07 deployment choices
~~~

## What is not a current phase

Do not turn these into foreground work yet:

~~~text
VexWork #6 product onboarding implementation
generic Connected Services framework
SDK template extraction
cloud deployment selection
VexStream streaming extension
~~~

They have rightful later phases.

<!-- [VXG RealForever][VCS04][POST-A012][PHASES] -->
