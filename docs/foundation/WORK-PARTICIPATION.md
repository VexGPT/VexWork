# Work Participation

`[VXG RealForever]`

## Human question

How can VexWork answer **who has actually worked on this, how many fresh sessions/threads have touched it, and how continuity carried across those sessions** without turning participation into WorkState, assignment, or authority?

The first live pressure came from VexWork Terrain review: a leader can see that work is RUNNING, but cannot yet tell whether one continuing worker, several fresh AI instances, another AI, or a human reviewer have carried that work over time.

The existing Workgraph cannot answer that completely. `work-transition.actorRef` records the actor that formed an accepted lifecycle transition. It is not a complete worker/session history, and many source-managed Work items legitimately have no stored transition history at all.

## Permanent distinctions

```text
WORK_PARTICIPATION != WORK_STATE
WORK_PARTICIPATION != ASSIGNMENT
WORK_PARTICIPATION != AUTHORITY
WORK_PARTICIPATION != EFFECT_AUTHORITY
TRANSITION_ACTOR != COMPLETE_WORKER_HISTORY
SESSION_COUNT != PARTICIPANT_COUNT
CONTINUITY != SESSION
PROVIDER_THREAD_ID != REQUIRED_PUBLIC_IDENTITY
```

A person or AI may participate in work without owning its lifecycle or source authority. An assignee label must never be inferred from participation.

## Identity coordinates

The portable contract separates four identities:

```text
participantRef
  who / what worker identity is this?

continuityRef
  which durable lane / trajectory is being continued?

sessionRef
  which fresh chat / thread / executor instance is this?

engagementRef
  which bounded engagement of that session with this Work item is this?
```

Example:

```text
work.vexwork.terrain.patient-zero

continuity.vexwork.flows
  session.001  participant agent.vex
  session.002  participant agent.vex
  session.003  participant agent.other
```

The Work item can therefore truthfully project:

```text
engagements       3
sessions/threads  3
participants      2
continuities      1
handoffs          2
```

without changing WorkState.

## Event ledger

`src/core/work-participation.mjs` defines:

```text
vexwork.work-participation-ledger/v1
vexwork.work-engagement-event/v1
```

Events are append-only:

```text
ENGAGED
RELEASED
```

An `ENGAGED` event binds Work identity, participant identity, durable continuity identity, fresh session identity, one engagement identity, optional predecessor engagement when this is an explicit continuation/handoff, source evidence, and timestamp.

A `RELEASED` event closes that exact engagement and must retain the same Work / participant / continuity / session identities.

Continuation may cross to a different participant, but it must remain inside the same Work item and durable continuity and must enter a **different sessionRef**.

## Fresh instances

A deployment should mint or obtain one opaque `sessionRef` per fresh execution instance/thread.

The contract does **not** require exposing a raw ChatGPT conversation ID, provider thread ID, account identifier, or other private provider coordinate.

```text
FRESH_EXECUTION_INSTANCE
-> new opaque sessionRef
-> ENGAGED event
-> task sessionCount increments

same durable lane
-> same continuityRef
```

If the same session touches several Work items, a Project/Outcome summary can count the unique session once across that selected scope while each Work item still gets its own engagement.

## Where live data belongs

Participation is higher-frequency operational state than source-managed Workgraph structure.

The initial contract is source-defined here, but real participation events should normally live in a qualified private runtime/deployment store rather than being committed to the public repository.

```text
PUBLIC VexWork
  schema + validation + projection semantics + synthetic proof

PRIVATE / QUALIFIED RUNTIME
  live engagement events
  opaque session identities
  private provider bindings when needed
```

The current Workgraph runtime is a relevant custody pattern, but Work Participation does **not** reuse the Workgraph transition ledger or CURRENT pointer by implication. A live storage adapter should be added only when the first runtime consumer establishes the right substrate.

## Projection

The portable projection can answer for one Work item or a set of descendant WorkRefs:

- engagement count;
- unique session/thread count;
- unique participant count;
- durable continuity count;
- explicit handoff count;
- active engagements;
- participant refs;
- latest event;
- per-Work engagement ordinal.

For a new Project with no engagement events:

```text
sessions = 0
participants = 0
```

No assignee is invented.

## Current Terrain boundary

Until a real participation ledger is connected, Terrain may display transition actors as **bounded lifecycle evidence only** and must label that coverage honestly.

```text
RECORDED_TRANSITION_ACTORS
!=
TOTAL_WORKER_THREAD_HISTORY
```

That is why the current Inspect view says its actor count is transition-only rather than presenting it as the requested session count.

## Held questions

This first contract does not yet define assignment/delegation semantics, workload balancing, presence/online status, billing/time accounting, productivity scores, provider-specific thread identifiers, automatic ChatGPT/AI session instrumentation, multi-host participation synchronization, or public exposure of private participant history.

Those should be earned by real consumers rather than collapsed into this first identity ledger.

<!-- [VXG RealForever][VEXWORK][FOUNDATION][WORK-PARTICIPATION] -->
