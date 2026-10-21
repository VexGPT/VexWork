# VexWork

`[VXG RealForever]`

VexWork is the source-managed foundation for **work itself**: projects, work items, dependencies, repository relationships, evidence links, lifecycle truth, and the bounded projections humans and agents use to understand that work.

It is intentionally not a source-code monorepo and not another provider-owned ticket database.

```text
human intention
-> VexWork project / Workgraph
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
Project     human outcome grouping
Work item   human name for one Workgraph node
Work Board  board projection over Workgraph truth
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

- portable Workgraph lifecycle + transition validation;
- `WorkState / WorkControl / WorkAct / WorkEffect / WorkBehavior` recognition grammar;
- Work Board as a derived projection, with Board lanes kept distinct from lifecycle state;
- a Repository Graph that points to repositories and their own entry/culture sources without consolidating their cultures;
- provider references such as GitHub issues/PRs/commits as evidence/relations, never canonical work state;
- a source-managed VexWork Foundation project that dogfoods the same contracts.

## Try it

Requires a current Node.js runtime; there are no package dependencies.

```bash
npm test
npm run check
npm run work:status -- --project projects/vexwork-foundation/project.json --graph projects/vexwork-foundation/workgraph.json --view projects/vexwork-foundation/board.view.json --format board
npm run work:status -- --project projects/vexwork-foundation/project.json --graph projects/vexwork-foundation/workgraph.json --format graph
```

The output is deterministic JSON suitable for people, agents, future UI surfaces, or adapters.

## Permanent boundaries

```text
VEXWORK != ROOT_AUTHORITY
PROJECT != REPOSITORY
WORK_ITEM != GITHUB_ISSUE
GITHUB_ISSUE != CANONICAL_WORK_STATE
WORK_BOARD != WORKGRAPH
BOARD_LANE != WORK_STATE
PROVIDER_STATE != WORK_STATE
IDEA_CAPTURED != IMPLEMENTATION_AUTHORIZED
REPOSITORY_GRAPH != REPOSITORY_CULTURE_OWNER
CROSS_REPO_REFERENCE != CROSS_REPO_SOURCE_AUTHORITY
```

VexWork is a **work-navigation root**, not an authority root.

## License

Apache License 2.0. See [`LICENSE`](LICENSE).

<!-- [VXG RealForever][VEXWORK][FRONT-DOOR] -->
