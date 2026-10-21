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

The Work Board owns **projection**, not lifecycle truth. A Work Board is Project-scoped: the Project selects root Work items and their containment descendants from the larger Workgraph.

```text
CURRENT Workgraph
+ Project rootWorkRefs[]
+ Board ViewDefinition
+ lane mapping
-> bounded Work Board projection
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

`laneRefOrder` is ordering only. A valid Board view must name every registry lane exactly once. It cannot duplicate a lane or omit one to change Project membership visibility. If intentional filtering is later needed, that must be modeled as a separate projection question rather than smuggled through ordering.

## Public read projection

`public/work-dashboard.json` is the first deliberately small public read model over VexWork truth.

It composes:

```text
canonical Project
+ canonical Work Board projection
+ canonical Parking Lot projection
-> public dashboard JSON
```

The public artifact exposes only the fields needed for a human-facing dashboard: Project identity/purpose, Board lane/card meaning, Parking Lot items, simple counts, and the explicit no-effects boundary.

```text
PUBLIC_DASHBOARD != WORKGRAPH
PUBLIC_DASHBOARD != RUNTIME_CURRENTNESS_OWNER
PUBLIC_DASHBOARD != EFFECT_AUTHORITY
VEXTREME_VIEW != VEXWORK_TRUTH_OWNER
```

A public consumer such as Vextreme may render this artifact without parsing VexWork's source-managed Workgraph or becoming another work-state owner.

`npm run dashboard:build` regenerates the artifact. `npm run dashboard:check` fails when the checked-in projection drifts from current source truth, and the aggregate deterministic review includes that check.

## Non-collapse

```text
WORK_BOARD != WORKGRAPH
PROJECT_BOARD != GLOBAL_WORKGRAPH
BOARD_LANE != WORK_STATE
CARD != WORK_ITEM_SOURCE
DRAG != DIRECT_MUTATION
VIEW != EFFECT_AUTHORITY
```

A future interactive Board should emit a typed `WorkAct` / transition request bound to the exact observed Workgraph fingerprint. It must never move a card optimistically and call the local UI position canonical truth.

## Human phase transitions

Board lanes are also the first human-facing phase language for delegated Project agency.

A Project Agency Policy may require the Human Transition Handshake for selected lane crossings such as Ready -> Active, Active -> Verify, and Verify -> Done while allowing routine same-phase lifecycle movement to remain autonomous.

The Work Board still does not own the transition. See `HUMAN-TRANSITION-HANDSHAKE.md`.

```text
BOARD_PHASE != AUTHORITY
HUMAN_ACKNOWLEDGEMENT != NEW_AUTHORITY
HANDSHAKE != DRAG_TO_MUTATE
```

## Parking Lot is a sibling projection

The Parking Lot is **not** another Board lane and not a Project. It projects intentionally parked work from the larger Workgraph. See `PARKING-LOT.md`.

The first public dashboard deliberately renders Parking Lot beside the Project Board rather than forcing parked work into Project membership merely for visibility.

## Views

`BOARD` is the first implemented view. The architecture keeps `GRAPH`, `TABLE`, `ROADMAP`, and `FOCUS` as projections over the same Workgraph rather than separate ledgers.

## Why the alias matters

People have learned product vocabulary from existing ecosystems. VexWork should meet the human where they are without turning someone else's product name into our architecture.

The alias is therefore a **language adapter**, not a semantic owner.

<!-- [VXG RealForever][VEXWORK][FOUNDATION][WORK-BOARD] -->
