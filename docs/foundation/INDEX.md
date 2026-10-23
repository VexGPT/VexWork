# VexWork foundation index

`[VXG RealForever]`

This is the current architecture map. Follow the exact foundation whose question is implicated.

| Foundation | Human question | Canonical source | Proof | State |
|---|---|---|---|---|
| Workgraph | What work exists, what state is it in, and what depends on what? | `blueprint/work-registry.json`, `src/core/workgraph.mjs` | `test/workgraph.test.mjs` | FOUNDATION |
| Stability / regression floor | How do accepted VexWork contracts stay protected as new features expand the repository, and how are untested core surfaces exposed? | `docs/CULTURE.md`, `docs/process/QUALITY-REVIEW.md` | `test/stability-contract.test.mjs`, `blueprint/source-coverage-baseline.json`, `npm run review` | FOUNDATION |
| Workgraph Composition | How can independent work families author separately while still producing one validated Workgraph? | `docs/foundation/WORKGRAPH-COMPOSITION.md`, `workgraphs/composition.json`, `workgraphs/segments/`, `src/core/workgraph-composition.mjs` | `test/workgraph-composition.test.mjs`, `test/workgraph-composition-source.test.mjs`, `npm run workgraph:check` | FOUNDATION |
| Projects / Project Registry | What Projects exist and how do they select bounded work without becoming another lifecycle owner? | `blueprint/project-registry.json`, `src/core/project-registry.mjs`, `docs/foundation/PROJECTS.md` | `test/project-registry.test.mjs` | FOUNDATION |
| Delegated agency / Human Transition Handshake | How can an authorized AI manage routine work while a human explicitly acknowledges and approves meaningful phase promotions? | `src/core/transition-handshake.mjs`, `docs/foundation/HUMAN-TRANSITION-HANDSHAKE.md` | `test/transition-handshake.test.mjs` | FOUNDATION |
| Work Board | How do I see one Project in a familiar Jira/kanban-shaped view without making the view the truth owner? | `src/core/work-board.mjs` | `test/work-board.test.mjs` | FOUNDATION |
| Derived Attention | How do dynamic entity populations and current evidence become work-shaped attention, aggregate counts and scope/entity descent without becoming WorkState or implementation authority? | `docs/foundation/DERIVED-ATTENTION.md`, `docs/foundation/DERIVED-ATTENTION-PROJECTION.md`, `src/core/derived-attention.mjs`, `src/core/derived-attention-projection.mjs` | `test/derived-attention.test.mjs`, `test/derived-attention-projection.test.mjs` | FOUNDATION |
| Derived Work Promotion | How does one exact derived concern create one canonical Work item or resolve to existing Work without automatic ticket generation? | `docs/process/PROMOTE-DERIVED-CONCERN.md`, `src/core/derived-work-promotion.mjs` | `test/derived-work-promotion.test.mjs` | FOUNDATION |
| Parking Lot | How do I preserve useful deferred work without making a provider ticket or fake Project the owner? | `docs/foundation/PARKING-LOT.md`, `src/core/work-board.mjs` | `test/work-board.test.mjs` | FOUNDATION |
| Process Map | Which reusable process should a fresh worker follow for this kind of work question? | `blueprint/process-registry.json`, `src/core/process-map.mjs`, `docs/process/` | `test/process-map.test.mjs` | FOUNDATION |
| Repository Graph | Which repositories does work touch and where does each repository explain itself? | `blueprint/repository-registry.json`, `src/core/repository-graph.mjs` | `test/repository-graph.test.mjs` | FOUNDATION |
| Provider Relations | How do GitHub/Jira/etc. relate to work without becoming canonical work state? | `docs/foundation/PROVIDER-RELATIONS.md` | structural laws in `scripts/work-check.mjs` | FOUNDATION |
| Runtime persistence | Where does private/current Workgraph truth persist across restart without turning Git into the live database? | `docs/foundation/RUNTIME-PERSISTENCE.md`, `src/core/workgraph-runtime.mjs` | `test/workgraph-runtime.test.mjs` | FOUNDATION |
| Work Participation | Who has actually carried this work across fresh sessions/threads without making participation assignment or authority? | `docs/foundation/WORK-PARTICIPATION.md`, `src/core/work-participation.mjs` | `test/work-participation.test.mjs` | FOUNDATION |
| Operating Profiles | How can hosted assistants and a future local Vex carry the same work truth while using different effect routes? | `docs/foundation/OPERATING-PROFILES.md`, `docs/process/ASSISTED-HOST-WORKFLOW.md` | source review + lived assisted-host use | FOUNDATION |
| Planning | How do iterations, WIP, ordering and planning transactions persist without becoming lifecycle truth? | `blueprint/project-planning-registry.json`, `docs/foundation/PROJECT-PLANNING.md`, `src/core/project-planning.mjs`, `src/core/project-planning-runtime.mjs` | `test/project-planning.test.mjs`, `test/project-planning-runtime.test.mjs` | FOUNDATION |
| Reconciliation | How do exact provider/source/proof observations classify currentness without becoming WorkState or transition authority? | `blueprint/project-reconciliation-registry.json`, `docs/foundation/PROJECT-RECONCILIATION.md`, `src/core/project-reconciliation.mjs` | `test/project-reconciliation.test.mjs` | FOUNDATION |
| Human UI | How can a human navigate Projects, nested Outcomes/work, Board/dependencies and work-item detail without making the UI a work-state owner? | `index.html`, `workspace-reader.js`, `public/workspace.json` | `test/public-ui.test.mjs` + lived Pages proof | FOUNDATION |

`FOUNDATION` means the initial portable contract exists in this repository. It does not mean every production integration is complete.

## Descent

```text
Project discovery / formation / outcome grouping
-> PROJECTS.md
-> ../process/FORM-PROJECT.md

work topology / lifecycle
-> WORKGRAPH.md

independent work-family authoring / aggregate contention / one composed Workgraph
-> WORKGRAPH-COMPOSITION.md

dynamic entity populations / Work Lenses / current derived attention
-> DERIVED-ATTENTION.md

aggregate / scope / entity / evidence projection
-> DERIVED-ATTENTION-PROJECTION.md

one exact concern -> new or existing canonical Work
-> ../process/PROMOTE-DERIVED-CONCERN.md

delegated AI agency / human acknowledgement + approval / phase transition
-> HUMAN-TRANSITION-HANDSHAKE.md

Jira board / Work Board / kanban / cards
-> WORK-BOARD.md

parking lot / remember for later / adjacent nice-to-have
-> PARKING-LOT.md
-> ../process/CAPTURE-DISCOVERED-WORK.md

reusable work process / where should a fresh instance route?
-> PROCESS-MAP.md

runtime currentness / restart persistence / CURRENT pointer / writer recovery
-> RUNTIME-PERSISTENCE.md

worker/session participation / fresh-instance continuity / handoff counts
-> WORK-PARTICIPATION.md

iteration / WIP / shared order / planning currentness
-> PROJECT-PLANNING.md

provider + proof currentness / completion evidence / reverification
-> PROJECT-RECONCILIATION.md

hosted ChatGPT / local Vex / assisted host action / VexRelay-style handoff
-> OPERATING-PROFILES.md
-> ../process/ASSISTED-HOST-WORKFLOW.md

testing / regression / coverage / stability
-> ../process/QUALITY-REVIEW.md
-> ../CULTURE.md#regression-before-expansion

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
