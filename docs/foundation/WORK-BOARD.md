# Work Board foundation

`[VXG RealForever]`

## Name

**Work Board** is the canonical VexWork name for the familiar board-shaped work view.

The phrases **"Jira board"**, **"kanban board"**, and **"task board"** may be accepted by conversational/search surfaces as human aliases. They do not change the canonical identity.

```text
human says "Jira board"
-> resolve intention: board-shaped work management view
-> VexWork Work Board
```

## What it owns

The Work Board owns **projection**, not lifecycle truth.

```text
CURRENT Workgraph
+ Board ViewDefinition
+ lane mapping
-> Work Board projection
```

Every lifecycle state maps to exactly one default lane:

```text
Intake       CAPTURED / NEEDS_CLARIFICATION / DECOMPOSED
Planned      PLAN_VALIDATED / WAITING_DEPENDENCIES
Ready        READY
Active       CONTEXT_ADMITTED / RUNNING / WAITING_TOOL
Waiting      WAITING_RESOURCE / PAUSED_AT_CHECKPOINT
Needs Human  WAITING_HUMAN / HELD_UNKNOWN
Verify       VERIFYING
Attention    BLOCKED / FAILED_RECOVERABLE
Done         COMPLETED / CONVERGED / CLOSED
Archive      SUPERSEDED / CANCELLED
```

These lanes preserve the VexLife P0B board vocabulary for migration continuity.

## Non-collapse

```text
WORK_BOARD != WORKGRAPH
BOARD_LANE != WORK_STATE
CARD != WORK_ITEM_SOURCE
DRAG != DIRECT_MUTATION
VIEW != EFFECT_AUTHORITY
```

A future interactive Board should emit a typed `WorkAct` / transition request bound to the exact observed Workgraph fingerprint. It must never move a card optimistically and call the local UI position canonical truth.

## Views

`BOARD` is the first implemented view. The architecture keeps `GRAPH`, `TABLE`, `ROADMAP`, and `FOCUS` as projections over the same Workgraph rather than separate ledgers.

## Why the alias matters

People have learned product vocabulary from existing ecosystems. VexWork should meet the human where they are without turning someone else's product name into our architecture.

The alias is therefore a **language adapter**, not a semantic owner.

<!-- [VXG RealForever][VEXWORK][FOUNDATION][WORK-BOARD] -->
