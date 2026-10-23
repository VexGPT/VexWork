# VexWork

`[VXG RealForever]`

VexWork is the source-managed foundation for **work itself**: projects, work items, dependencies, repository relationships, evidence links, lifecycle truth, and the bounded projections humans and agents use to understand that work.

It is intentionally not a source-code monorepo and not another provider-owned ticket database.

```text
human intention
-> VexWork Workgraph
-> optional Project / Parking Lot / other bounded projection
-> exact work neighborhood
-> target repositories and their own current culture/source
-> implementation / proof / provider evidence
```

## Human language

The canonical human-facing board name is **Work Board**.

For migration and conversational discoverability, **"Jira board"** is accepted as an alias for the intended experience: a place to see, sort, relate, plan, and move work. It is not a VexWork namespace, truth owner, dependency, or affiliation.

```text
VexWork     system / repository
Workgraph   canonical work topology + lifecycle truth
Project Registry discoverability map for source-managed Projects
Project     human outcome grouping over Workgraph roots
Work item   human name for one Workgraph node
Work Board  project board projection over Workgraph truth
Parking Lot intentionally deferred work projection
Process Map reusable route to the rightful process owner
Graph       relationship projection
Focus       bounded one-item causal neighborhood
```

A Work Board is one view of work. It is not the work state itself.

## Why this repository exists

The first Project/Workgraph/Board foundation was proven inside `vgong24/VexLife` during VexLife ToCompletion P0B. That was the right place to discover the need through a real product trajectory. It also exposed the ownership boundary:

```text
one project may cross VexLife + Vextreme + Android + other repositories
therefore no one product repository should own institution-wide work truth
```

VexWork extracts the portable work-management meaning while leaving each repository as the owner of its own source, culture, architecture, proof, and lifecycle.

See [`docs/lineage/VEXLIFE-P0B.md`](docs/lineage/VEXLIFE-P0B.md).

## Start here

Fresh humans and agents should read:

1. [`AGENTS.md`](AGENTS.md) — repository descent router;
2. [`docs/CULTURE.md`](docs/CULTURE.md) — VexWork-local intention and boundaries;
3. [`docs/foundation/INDEX.md`](docs/foundation/INDEX.md) — current foundation map;
4. only the foundation/source/tests implicated by the current question.

The root README is an entry router, not a second architecture manual.

## Current foundation

The first foundation establishes:

- one portable Workgraph that can contain work for multiple Projects plus unprojected work, with lifecycle + transition validation;
- a Project Registry that locates source-managed Projects/Board views without duplicating their work truth;
- `WorkState / WorkControl / WorkAct / WorkEffect / WorkBehavior` recognition grammar;
- Work Board as a Project-derived projection, with Board lanes kept distinct from lifecycle state;
- Project Agency Policy + Human Transition Handshake so bounded AI stewardship can automate routine work while meaningful phase promotions remain human-aware and exact-current;
- Parking Lot as a provider-independent projection for intentionally deferred work;
- a Process Map that records reusable work routes without becoming their executor or stealing target-repository process ownership;
- a Repository Graph that points to repositories and their own entry/culture sources without consolidating their cultures;
- provider references such as GitHub issues/PRs/commits as evidence/relations, never canonical work state;
- portable Workgraph runtime persistence with immutable snapshots, atomic successor-pointer publication, CURRENT derived from the unique validated tip of retained pointer lineage, exact-current CAS, serialized writers, and explicit abandoned-writer recovery under a caller-supplied private store root;
- portable Project Planning with explicit iteration definition/closure, iteration membership, shared order, WIP policy, selected view, exact-current planning transactions, and its own restart-safe private planning runtime without becoming WorkState;
- portable Project Reconciliation that joins exact Project/provider/proof evidence into `CURRENT_IN_REVIEW`, `REVERIFY_REQUIRED`, `COMPLETION_EVIDENCE_READY`, or `HELD_UNKNOWN` while retaining zero lifecycle/provider mutation authority;
- a source-managed VexWork Foundation Project that dogfoods the same contracts;
- VexLife-Android issue #144 represented as a real parked VexWork potential, with GitHub retained as provider provenance and Android feature authoring as the future route if adopted.
- Operating Profiles that keep one VexWork truth across hosted-assistant and future local-Vex execution, with an assisted-host workflow for bounded human-only/local effects rather than making GitHub Actions or a Local Workspace universal prerequisites.

## Try it

Requires a current Node.js runtime; there are no package dependencies.

```bash
npm test
npm run review
npm run check
npm run work:status -- --project projects/vexwork-foundation/project.json --graph workgraphs/public.json --view projects/vexwork-foundation/board.view.json --format board
npm run work:status -- --project projects/vexwork-foundation/project.json --graph workgraphs/public.json --format graph
npm run work:status -- --graph workgraphs/public.json --format parking-lot
```

The output is deterministic JSON suitable for people, agents, future UI surfaces, or adapters.

The first stable public read projection is checked in at `public/work-dashboard.json`. It composes the canonical VexWork Foundation Work Board and global Parking Lot without exposing the raw Workgraph as a UI contract:

```bash
npm run dashboard:build
npm run dashboard:check
```

Public consumers may render that artifact; they do not become VexWork truth owners.

## Permanent boundaries

```text
VEXWORK != ROOT_AUTHORITY
PROJECT != REPOSITORY
WORK_ITEM != PROJECT_MEMBERSHIP
PARKING_LOT != PROJECT
WORK_ITEM != GITHUB_ISSUE
GITHUB_ISSUE != CANONICAL_WORK_STATE
WORK_BOARD != WORKGRAPH
BOARD_LANE != WORK_STATE
PROVIDER_STATE != WORK_STATE
IDEA_CAPTURED != IMPLEMENTATION_AUTHORIZED
PARKED != REJECTED
PROCESS_MAP != PROCESS_EXECUTOR
REPOSITORY_GRAPH != REPOSITORY_CULTURE_OWNER
CROSS_REPO_REFERENCE != CROSS_REPO_SOURCE_AUTHORITY
```

VexWork is a **work-navigation root**, not an authority root.

## License

Apache License 2.0. See [`LICENSE`](LICENSE).

<!-- [VXG RealForever][VEXWORK][FRONT-DOOR] -->
