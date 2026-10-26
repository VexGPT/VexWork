# VexLife Connected Services — VexBoard System Anatomy

`[VXG RealForever]`

## Status

~~~text
artifact class       LIVING SYSTEM-ANATOMY PROJECTION
truth owners         VexLife + VexLife-Android + feature owners + VexWork currentness
visual consumer      VexBoard
board mode           READ_ONLY_SOURCE
execution authority  NONE
external effects     NONE
~~~

This source explains how the VexLife Connected Services board should be read, traversed, and updated.

The board is deliberately **architecture-first**. It answers:

> What does Connected Services connect, what does each boundary mean, which source owns each meaning, what is current now, and what is still only part of the completed target?

It is not a process checklist, PR timeline, attempt ledger, or second work-state owner.

Permanent:

~~~text
CONNECTED_SERVICES_BOARD != CONNECTED_SERVICES_TRUTH_OWNER
SYSTEM_TOPOLOGY != WORKFLOW
WORK_OVERLAY != SYSTEM_IDENTITY
PROJECTION != EFFECT_AUTHORITY
CURRENT_SOURCE != COMPLETE_TARGET
LIVED_BEHAVIOR != TERMINAL_SOURCE_LIFECYCLE
~~~

## Completeness judgment

This board is **complete enough for architectural orientation and continuation**.

A fresh instance should be able to enter here and understand the stable total shape without reconstructing the program from chat history:

~~~text
feature surface / typed client
        ↓
trusted device possession
        ↓
private reachability
        ↓
bounded authenticated Home session
        ↓
Connected Services transport/correlation/currentness boundary
        ↓
rightful Home authority resolves current capability admission
        ↓
feature service
        ↓
feature semantic owner
        ↓
replaceable engine / provider / storage where applicable
~~~

The board is **not** complete enough to become a source generator, capability-lease authority, Home authority, Android mutation surface, merge/lifecycle owner, universal VexArchitecture schema, or replacement for feature-owned semantics. Those responsibilities remain source-bound.

## How to read the board

Read the default projection left to right.

### 1. Feature surfaces + typed clients

The typed client keeps feature vocabulary and feature-specific currentness. It does not mint identity, membership, capability leases, revocation truth, provider authority, or Home authority.

Current examples:

~~~text
Maps          CURRENT typed feature client
Conversation  CURRENT/LIVED TERMINAL · VCS-04 accepted-current across Android + VexWork
VexStream     CURRENT feature-owned local pairing/catalog/Range-media transport
              VCS-05 TERMINAL_ACCEPTED_CURRENT · no generic shared streaming extension earned
~~~

### 2. Shared Connected Services substrate

The shared substrate owns the repeated connection problem, not product meaning:

~~~text
trusted device possession
-> private reachability / route
-> bounded authenticated session
-> transport request correlation
-> reconnect / route refresh
-> typed transport availability / failure
~~~

Permanent distinctions:

~~~text
IDENTITY != REACHABILITY
REACHABLE != AUTHORIZED
RECONNECT != REAUTHORIZE
TRANSPORT_SUCCESS != FEATURE_SUCCESS
TRANSPORT_CORRELATION != FEATURE_RESULT_CURRENTNESS
~~~

### 3. Home authority + admitted services

Home Bridge, or another explicitly rightful future authority source, owns current trusted identity, membership, capability lease, revocation generation, and exact capability admission. Connected Services carries a request toward that authority; it does not become that authority.

The board shows current Maps and Family Conversation services plus a **TARGET** VexStream Home/Connected Services service boundary that is not current yet.

### 4. Feature semantic owners

#### Maps

~~~text
Home Maps service
-> Maps-owned place-search semantics/currentness
-> replaceable Photon + OpenStreetMap realization
~~~

Provider execution never becomes Maps semantic ownership.

#### Family Conversation

~~~text
Home Family Conversation service
-> Family/Conversation identity + membership + history + durable HUMAN append

durable Family trigger
-> separate Family Companion runtime
-> Heretic model
-> model output returns to Companion
-> Companion durably appends through Conversation owner
~~~

Permanent:

~~~text
HUMAN_MESSAGE_DELIVERY != AI_ATTENTION
MODEL_BUSY != FAMILY_CHAT_BLOCKED
MODEL_OUTPUT != CONVERSATION_AUTHORITY
~~~

The VCS-04 lived matrix L1-L11 passed and its source/currentness converged terminally: Android PR #154 merged at `9104d232086afd888700c3317ab79c2a8b87239b`, and VexWork PR #132 merged at `470570726137d0f78a90ff0945850bf29de46a41`. Conversation is therefore projected as **CURRENT/LIVED TERMINAL** rather than source-converging.

#### VexStream

VexStream already has a substantial feature-owned mobile/desktop transport and media architecture. That current feature transport remains visible because it is real source pressure, but it does **not** automatically become the Connected Services transport owner.

The completed-target relationship is:

~~~text
existing VexStream semantic/media ownership
+ accepted Connected Services shared core
+ VCS-05 streaming pressure
-> only the additional streaming contracts genuinely earned
~~~

Candidate streaming-only pressure includes longer-lived sessions, backpressure, range/media delivery, throughput, reconnect behavior, and large-payload behavior. Do not force those into Maps or Conversation merely for symmetry.

## Operations lens — off/on without forgetting

The board now includes a read-only Operations lens because runtime availability and retained truth are different engineering questions.

Permanent:

~~~text
OFFLINE != FORGOTTEN
STOP != REVOKE
RECONNECT != REAUTHORIZE
RUNTIME_AVAILABILITY != DURABLE_STATE
~~~

### Runtime availability

Processes, listeners, routes, network reachability, playback, provider/model runtimes, and other live realizations can be AVAILABLE, OFF, DEGRADED, or simply UNKNOWN at observation time.

An ordinary runtime stop must not be interpreted as deletion of durable Work/source or feature truth.

Examples:

~~~text
Heretic stopped
-> AI attention unavailable
-> durable Conversation history still belongs to Conversation

VexStream Desktop stopped / unreachable
-> Hub media unavailable
-> remembered pairing is not automatically forgotten
-> verified phone offline copies remain phone-owned

Android process stopped/restarted
-> runtime disappears temporarily
-> ordinary process death is not Android Clear Data
~~~

### Retained durable state

Durable state remains owned by its rightful source:

~~~text
Git / VexWork
  Work and source history

Family Conversation
  identity/membership/history/message-store truth

VexStream Desktop
  library/catalog source truth + remembered paired-device state

VexLife Android
  encrypted remembered VexStream pairing + offline index
  verified shared MediaStore copies where applicable
~~~

### Destructive or authority-changing actions

These are deliberately not ordinary off switches:

~~~text
VexStream Forget / Revoke
  intentionally invalidates remembered pairing

Android Clear Data
  removes app-private pairing/index state
  shared audio bytes may physically survive, but fresh-state permission/reconciliation is separate

Home membership / capability-lease revocation
  changes authority
  != network/process availability
~~~

### Monitoring posture

This board is not a live telemetry system. It does not continuously know whether a process is running, a route is reachable, a model is loaded, or a media stream is buffering.

For troubleshooting, observe the smallest relevant runtime predicate when the feature needs it:

~~~text
feature reports failure
-> producer/runtime available?
-> route/reachability current?
-> session/admission current?
-> feature service accepted request?
-> semantic owner accepted/persisted effect?
-> provider/model/media realization only if still implicated
~~~

A future VexBoard operations presentation may project live AVAILABLE / OFF / DEGRADED / UNKNOWN observations, but those must remain derived observations with exact source/currentness and must not make VexBoard the Start/Stop/Forget/Revoke authority.
## Completed-target frontier

### VCS-05 — completed streaming stress/adoption

Accepted evidence now covers the pressure that could have required a shared streaming extension:

~~~text
4 MiB local media
-> sequential Range
-> forward seek
-> backward seek
-> tail Range
-> exact bytes

terminal Android lived continuity
-> Desktop stop
-> LOCAL_ONLY playback
-> real Android process restart
-> Desktop restart
-> reconnect
-> HUB_AND_LOCAL
~~~

The architectural result is deliberately a **non-expansion**:

~~~text
Connected Services shared/control plane
    identity/session
    reachability / route currentness
    admission
    correlation
    typed availability/failure
    reconnect/recovery

VexStream-owned media/data plane
    HTTP Range
    Media3 demand/backpressure
    media identity
    playback
    download/offline state
    throughput / large-payload realization
~~~

Therefore VCS-05 did **not** earn a generic shared streaming transport, generic media-backpressure owner, or a reason to widen Maps/Conversation.

Android remote direct/relay source remains architectural pressure only. Current accepted VexStream Desktop does not provide the matching accepted remote/relay producer, so:

~~~text
REMOTE_TRANSPORT_SOURCE != REMOTE_PRODUCER_ACCEPTANCE
~~~

### VCS-06 — architecture extraction

Multiple real consumers have now accepted enough implementation/behavior to admit VCS-06 as the next extraction edge. VexWork PR #162 source-forms that READY transition; accepted-current status remains pending its generated/currentness closure. The recurring pattern should be extracted as reusable architecture only from what is actually shared. The extraction should preserve semantic owner, authority owner, transport owner, feature client, currentness owner, provider/engine boundary, and proof obligations. It should not copy one consumer's implementation and call it universal.

### VCS-07 — deployment choices

Only after the runtime boundary is stable enough should deployment realization be selected among:

~~~text
same-machine VexHome
sibling process/container
another owned machine
user-selected VPS/cloud
optional future Vextreme-managed host
~~~

Permanent:

~~~text
DEPLOYMENT_LOCATION != SEMANTIC_OWNER
CLOUD_VENDOR != HOME_AUTHORITY
SELF_HOSTED != SAME_PHYSICAL_MACHINE
~~~

## Status language on this board

VexBoard does not yet have a first-class source-derived architecture-currentness visual vocabulary, so this consumer intentionally uses label prefixes.

~~~text
CURRENT
  accepted/current source meaning

CURRENT/LIVED
  accepted source plus material lived evidence

LIVED PASS · SOURCE CONVERGING
  behavior has been lived/proven, but the source lifecycle carrying that implementation is not terminal yet

CURRENT FEATURE-OWNED
  real current implementation that remains outside the shared Connected Services ownership boundary

RUNNING STRESS
  active proof against current source; does not by itself promote a TARGET relationship to CURRENT

TARGET
  intended completed architecture; not current source truth
~~~

A future VexBoard presentation layer may render these statuses visually, but it must derive them from rightful sources rather than storing a second hidden lifecycle.

## Traversal guidance for future instances

Start from:

~~~text
board.vexlife.connected-services.system-anatomy.current-target
~~~

Then choose the question:

~~~text
"What owns the connection?"
-> Shared Connected Services substrate

"Who authorizes this?"
-> Home authority + admitted services

"What does Maps actually own?"
-> Maps semantic neighborhood

"Why is AI separate from Send?"
-> Family Conversation neighborhood

"What did VexStream teach us?"
-> VCS-05 accepted result: keep media Range/backpressure/playback in VexStream; no generic streaming extension earned

"What is next?"
-> VCS-06 architecture extraction · READY_ACCEPTED_CURRENT; SDK source placement/current-entry reverify pending

"Where can this run eventually?"
-> completed-target deployment region

"What is actively changing right now?"
-> Work overlay / VexWork project currentness

"Why do we believe this edge is current?"
-> inspect source/evidence refs for the selected coordinate
~~~

The board should stay calm. Attempt numbers, proof-carrier failures, and routine PR churn do not belong on the primary architecture plane unless they materially change architecture currentness.

## Update rules

A future instance may update this board when one of these becomes true:

1. **A source owner changes the architecture.** Add/remove/change the exact semantic node or relationship and preserve the source ref that justifies the change.
2. **A TARGET relationship becomes accepted/current.** Promote TARGET to CURRENT only after rightful source/lifecycle evidence exists; implementation activity alone is insufficient.
3. **A current relationship becomes invalid or superseded.** Preserve causal history in the rightful lineage source, then update the board's current projection rather than keeping contradictory current edges.
4. **A feature earns a deeper neighborhood.** Split detail into another Board only when the root anatomy becomes hard to perceive. Keep the root semantic coordinate stable and point to deeper detail rather than duplicating identity.
5. **Work changes without architecture changing.** Update only the Work/currentness overlay if needed. Do not redraw the system merely because a PR number or proof attempt changed.
6. **Evidence changes without semantic topology changing.** Update evidence/currentness projection; do not remint architecture identity.

## Source precedence

When the board and source appear to disagree, source wins.

~~~text
VexLife Connected Services architecture
  -> repo.vexlife:docs/VEXLIFE-CONNECTED-SERVICES.md
  -> github.issue.vexlife.899

Home/session/authority
  -> exact VexLife Home Bridge source/docs

Android realization
  -> exact VexLife-Android connectedservices / feature-client source
  -> current accepted Android source lifecycle

Feature meaning
  -> exact Maps / Conversation / VexStream owner

Work/currentness
  -> project.vexlife.connected-services
  -> current VexWork Workgraph / accepted evidence

VexBoard
  -> projection only
~~~

## What should not be added to the root board

Do not turn the root anatomy into every HTTP endpoint, every implementation class, every proof attempt, every provider log, every Work item, every VexStream song/media row, every Conversation message, every possible cloud vendor, or one universal API/plugin ontology. Those belong behind the selected semantic coordinate or in their rightful owner.

## Relationship to active VexBoard work

This consumer deliberately does **not** edit:

~~~text
projects/vexboard/examples/board-source-catalog.json
vexboard/index.html
~~~

Active VexBoard PR #155 currently owns those shared integration surfaces.

This board may therefore exist as valid source before it is discoverable from the landing UI. After the active VexBoard integration work is serialized, the VexBoard lane may add `board.vexlife.connected-services.system-anatomy.current-target` to the source catalog and stable deep-link/discovery surface. That later UI/catalog integration does not change the board's semantic ownership.

## Coordinates

Board:

~~~text
projects/vexboard/examples/vexlife-connected-services-system-anatomy.board.json
board.vexlife.connected-services.system-anatomy.current-target
~~~

Primary architecture/currentness sources:

~~~text
github.issue.vexlife.899
repo.vexlife:docs/VEXLIFE-CONNECTED-SERVICES.md
project.vexlife.connected-services
github.pull.vexstream-music.15.comment.6408146238
github.issue.vexlife.899.comment.6408187503
github.pull.vexwork.162
~~~

<!-- [VXG RealForever][VEXWORK][VEXBOARD][VEXLIFE-CONNECTED-SERVICES][SYSTEM-ANATOMY] -->
