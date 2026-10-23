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
PUBLIC_UI_VIEW != VEXWORK_TRUTH_OWNER
```

A public consumer may render this artifact without parsing VexWork's source-managed Workgraph or becoming another work-state owner. The canonical first-party public consumer is now VexWork's own GitHub Pages surface; sibling products may link to it without sharing UI ownership.

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

### Multi-Project workspace projection

`public/workspace.json` is the richer read model for navigating VexWork as a workspace rather than equating VexWork with one Kanban board.

It is generated from the Project Registry, each registered Project + Board view, the rightful Workgraph, transition history, and global Parking Lot. It exposes Project summaries, recursive containment relationships, dependency/source/process fields, Board lane membership, and per-item transition history while remaining explicitly read-only.

```text
Project Registry
+ Project definitions
+ Workgraph containment/dependencies/transitions
+ Board views
+ Parking Lot
-> public/workspace.json
-> portfolio / Project / Outcome / work-item readers
```

The browser may derive presentation state such as the currently selected Project, Outcome, ticket tab, or semantic navigation level. It must not invent work relationships or lifecycle truth.

```text
PUBLIC_WORKSPACE != WORKGRAPH
PUBLIC_WORKSPACE != PROJECT_REGISTRY
SEMANTIC_NAVIGATION != WORK_MUTATION
ITEM_DETAIL != COMMENT_WRITER
BOARD_VIEW != PRIMARY_HOME
```

`public/work-dashboard.json` remains the small Foundation-board compatibility projection. New multi-Project readers should prefer `public/workspace.json`.

`npm run workspace:build` regenerates the workspace projection. `npm run workspace:check` fails on drift and is part of deterministic review.

### First-party web ownership

VexWork's public semantic navigator is owned by this repository and served from the same Pages origin as `public/workspace.json`.

```text
VexWork source + public checkpoint
-> VexWork Pages semantic navigator

Vextreme / VexLife
-> sibling links into VexWork
-> no shared UI ownership required
```

The navigator reuses the proven interaction grammar of semantic descent and progressive disclosure, but VexWork owns its own work-specific presentation and lifecycle vocabulary.

Permanent:

```text
PAGES_NAVIGATION != WORK_MUTATION
STATE_HISTORY != RECOVERY_ATTEMPT_LOG
VEXWORK_UI_OWNERSHIP != VEXTREME_SITE_OWNERSHIP
```

## Lifecycle Workflow Map

The Work Board color legend answers **what the current state means visually**. The Lifecycle Workflow Map answers a different question:

> **From this state, what transitions are lawful, which branches are waits/recovery/exits, and where does human review apply?**

It is a read-only projection over the same canonical owners:

```text
blueprint/work-registry.json
  lifecycleStates
  allowedTransitions
  boardLanes
        │
        ├─ Work Board colors / lanes
        └─ Lifecycle Workflow Map nodes / arrows

optional Project Agency Policy
        └─ human-review conditions over exact phase crossings
```

Permanent:

```text
LIFECYCLE_WORKFLOW_MAP != PROCESS_MAP
LIFECYCLE_WORKFLOW_MAP != SECOND_WORK_STATE_OWNER
WORKFLOW_NODE != COPIED_STATE_DEFINITION
WORKFLOW_ARROW != COPIED_TRANSITION_DEFINITION
WORKFLOW_VISUALIZATION != TRANSITION_AUTHORITY
```

The browser therefore loads the canonical Work Registry at view time. It must not carry its own lifecycle state list or arrow table.

When an exact Work item is in context, the projection may additionally use its current state, work class, work ref, and accepted transition history to highlight:

- its current state;
- lawful outgoing transitions;
- one lawful route toward the Done lane;
- wait/recovery branches;
- exact Human Transition Handshake requirements;
- proven same-phase resumes that do **not** require a new review.

Project Agency Policy v2 allows the same canonical lifecycle edge to be human-reviewed for one meaningful OUTCOME or explicitly named user-facing TASK while remaining autonomous for ordinary implementation tasks.

This is intentionally separate from the existing **Process Map**, which answers which reusable repository/process route a worker should follow.

## Views

`BOARD` is the first implemented view. The architecture keeps `GRAPH`, `TABLE`, `ROADMAP`, and `FOCUS` as projections over the same Workgraph rather than separate ledgers.

## Why the alias matters

People have learned product vocabulary from existing ecosystems. VexWork should meet the human where they are without turning someone else's product name into our architecture.

The alias is therefore a **language adapter**, not a semantic owner.

<!-- [VXG RealForever][VEXWORK][FOUNDATION][WORK-BOARD] -->
