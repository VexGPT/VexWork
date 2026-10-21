# VexWork foundation index

`[VXG RealForever]`

This is the current architecture map. Follow the exact foundation whose question is implicated.

| Foundation | Human question | Canonical source | Proof | State |
|---|---|---|---|---|
| Workgraph | What work exists, what state is it in, and what depends on what? | `blueprint/work-registry.json`, `src/core/workgraph.mjs` | `test/workgraph.test.mjs` | FOUNDATION |
| Work Board | How do I see one Project in a familiar Jira/kanban-shaped view without making the view the truth owner? | `src/core/work-board.mjs` | `test/work-board.test.mjs` | FOUNDATION |
| Parking Lot | How do I preserve useful deferred work without making a provider ticket or fake Project the owner? | `docs/foundation/PARKING-LOT.md`, `src/core/work-board.mjs` | `test/work-board.test.mjs` | FOUNDATION |
| Process Map | Which reusable process should a fresh worker follow for this kind of work question? | `blueprint/process-registry.json`, `src/core/process-map.mjs`, `docs/process/` | `test/process-map.test.mjs` | FOUNDATION |
| Repository Graph | Which repositories does work touch and where does each repository explain itself? | `blueprint/repository-registry.json`, `src/core/repository-graph.mjs` | `test/repository-graph.test.mjs` | FOUNDATION |
| Provider Relations | How do GitHub/Jira/etc. relate to work without becoming canonical work state? | `docs/foundation/PROVIDER-RELATIONS.md` | structural laws in `scripts/work-check.mjs` | FOUNDATION |
| Runtime persistence | Where do private/current high-frequency events, snapshots and CURRENT pointers live? | not yet source-placed | future owner | HELD |
| Planning | How do iterations, WIP, ordering and planning transactions persist? | lineage exists in VexLife P0B; portable owner not yet source-placed | future owner | HELD |
| Reconciliation | How do exact provider/source/proof observations attach to work currentness? | lineage exists in VexLife P0B; portable owner not yet source-placed | future owner | HELD |
| Human UI | What is the native/web Work Board experience? | no UI owner yet | future lived proof | HELD |

`FOUNDATION` means the initial portable contract exists in this repository. It does not mean every production integration is complete.

## Descent

```text
work topology / lifecycle
-> WORKGRAPH.md

Jira board / Work Board / kanban / cards
-> WORK-BOARD.md

parking lot / remember for later / adjacent nice-to-have
-> PARKING-LOT.md
-> ../process/CAPTURE-DISCOVERED-WORK.md

reusable work process / where should a fresh instance route?
-> PROCESS-MAP.md

QA / quality review / reviewer question set / review handoff
-> ../process/QUALITY-REVIEW.md
-> ../templates/QA-REVIEW-BRIEF.md
-> ../templates/QA-REVIEW-RETURN.md

cross-repository navigation / culture entry
-> REPOSITORY-GRAPH.md

GitHub issue / PR / external provider relation
-> PROVIDER-RELATIONS.md
```

## Lineage

The first useful predecessor is VexLife ToCompletion P0B #908-#912. Read `docs/lineage/VEXLIFE-P0B.md` when compatibility or migration matters. Do not use historical source as live VexWork authority.

<!-- [VXG RealForever][VEXWORK][FOUNDATION-INDEX] -->
