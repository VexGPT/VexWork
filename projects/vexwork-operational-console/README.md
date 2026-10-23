# VexWork Operational Console Evolution

`[VXG RealForever]`

This Project carries the evolution from **VexWork as a durable work-navigation system** toward **VexWork as a console for work**.

The intention is not to replace the Workgraph, Project, or Work Board foundations. It is to add the missing bridge between:

```text
what exists in the world
what is currently true about it
what deserves attention under one reusable work lens
what has actually been admitted as canonical work
```

The first pressure came from VexSite Localization. Vextreme already owns a large population of pages, routes, arcs, preserved sources, localization sources, compiled runtime, page health and lived/browser evidence. Creating one VexWork task for every page would duplicate repository inventory and turn current health into ticket-maintenance ceremony.

A second pressure is intentionally different: a nontechnical human wants to start a small online business selling unique antique plates. At the beginning there may be physical items but no website, catalog, inventory system, fulfillment workflow, or AI-readable operating environment. VexWork should eventually help form and navigate that environment without becoming the commerce database itself.

These two cases bound the evolution:

```text
existing large population
  VexSite pages
  -> derive what remains without page-per-task topology

new operating environment
  antique plates
  -> form reusable capabilities/populations/attention
  -> let AI help build and maintain the digital environment
  -> keep protected physical/business actions human-aware
```

## The human outcome

The root outcome is:

> Make VexWork capable of perceiving and carrying many kinds of work through one console: intentional Projects/Outcomes, dynamic population health, operational attention, reusable processes, and promoted foreground work — without making VexWork the source database for everything work touches.

The desired experience is closer to:

```text
WHAT EXISTS?
WHAT IS TRUE ABOUT IT?
WHAT NEEDS ATTENTION UNDER THIS LENS?
WHAT HAS ACTUALLY BECOME WORK?
WHAT PROCESS / REPOSITORY OWNS THE NEXT EFFECT?
```

than:

```text
HOW MANY TICKETS DO WE HAVE?
```

## Permanent distinctions

The evolution must preserve the current VexWork foundations:

```text
ENTITY != WORK_ITEM
ENTITY_HEALTH != WORK_STATE
INCOMPLETE_ENTITY != ADMITTED_TASK
DERIVED_ATTENTION != IMPLEMENTATION_AUTHORITY

PROJECT != WORKSET_OR_POPULATION
WORK_BOARD != WORKGRAPH
PROJECTION != EFFECT_AUTHORITY

COMMERCE_PRODUCT != WORK_ITEM
ORDER != WORK_ITEM
SHIPMENT != WORK_ITEM
CUSTOMER != WORK_ITEM

REPOSITORY_OR_PROVIDER_TRUTH != VEXWORK_WORK_TRUTH
COMPLETED_WORK != ENTITY_HEALTHY_FOREVER
```

A completed remediation remains historical work truth. If the underlying entity later regresses, the dynamic lens may surface new attention without rewriting the completed Work item.

## Provisional recognition model

Names are intentionally provisional until implementation earns them.

The capability currently needs to represent something like:

```text
Population Provider
  what entities currently exist?

Entity Identity
  which thing is this?

Scope
  which subset is being considered?

Lens
  what does complete / incomplete / attention mean for this kind of work?

Evidence
  what current repository/provider facts answer those predicates?

Derived Facets
  why is an entity complete, incomplete, unknown or noteworthy?

Projection
  aggregate -> group -> entity drill-down

Promotion
  explicitly adopt one derived concern into canonical Workgraph work
```

The same entity may participate in multiple lenses:

```text
page A

Localization lens
  COMPLETE

Accessibility lens
  ATTENTION

Header modernization lens
  INCOMPLETE
```

Those results are not WorkState.

## Phase 1 — reusable derived-work foundation

The first implementation must establish the smallest reusable contract for dynamic work visibility over a population without materializing one Work item per entity.

It should be able to answer:

```text
population size
complete count
incomplete count
unknown / attention count
incomplete by reason
incomplete by scope/group
per-entity current evidence
whether canonical Work already exists for the concern
```

The feature should support:

- dynamically appearing/disappearing entities;
- multiple simultaneous lenses over the same entity identity;
- nested scopes or groups;
- unknown and not-applicable evidence without treating absence as automatic failure;
- required versus advisory predicates where the lens needs them;
- derived reason facets rather than manually maintained tags;
- explicit promotion into Workgraph when ownership/lifecycle becomes real;
- provenance from promoted work back to entity, lens and evidence;
- later entity regression without reopening historical work automatically.

The implementation should not introduce domain-specific words such as Page, SKU, Order or Credential into the generic owner unless repeated pressure earns them.

## Parallel experience evolution — VexWork Terrain Map v2

The Operational Console now also carries one parallel experience experiment: **VexWork Terrain Map**.

This does not replace Projects, Workgraph, Work Board, or the existing first-party navigator. It projects the same truth through a relational traversal model so a human or AI can remain oriented while moving through arbitrary-depth containment and cross-context relationships.

The pressure comes from three already-lived lines:

```text
Vextreme Terrain
  semantic zoom + immediate-parent outward movement
  scrollable-content priority + armed boundary traversal

VexLife
  semantic position != pixel position
  Journey inspection != travel
  deterministic no-teleport navigation
  duplicate command idempotency
  presentation/reachability != semantic ownership

VexLife Android
  Terrain / State / Traversal / Relationship / Projection / Continuity
  are distinct semantic questions that may compose fractally
```

Permanent traversal distinctions:

```text
CANONICAL_TOPOLOGY != TERRAIN_STATE
SEMANTIC_POSITION != CAMERA_POSITION
TRAVERSAL_PREDECESSOR != STRUCTURAL_PARENT
ROUTE_PLAN != PRESENCE
HISTORY_INSPECTION != TRAVEL
PRESENTATION_ADAPTATION != WORK_STATE

ROUTE_SEARCH_DEDUPLICATES_VISITS
EXECUTION_DEDUPLICATES_EXACT_COMMANDS
JOURNEY_PRESERVES_MEANINGFUL_REVISITS

A -> B -> A
  remains real Journey history
```

The first patient-zero is intentionally bounded:

```text
public/workspace.json
-> workspace / Project / nested Work terrain
-> typed containment + dependency relationships
-> structural path + actual traversal path
-> bounded local neighborhood
-> serialized/idempotent semantic movement
-> Journey inspection + explicit revisit
-> nested-scroll / semantic-boundary arbitration
-> responsive projection
```

The experiment does **not** yet establish a generic `VexTerrain` foundation. Reuse is earned only after this VexWork patient-zero and a genuinely different second consumer prove the same contract.

The currentness/flow layer is a dependency-gated successor. It will add current work, recent accepted transitions, recent completion and dependency-based newly-available work only after traversal semantics are stable; provider activity and incomplete transition-history coverage must never be presented as canonical progress.

### Lived correction — depth is perceptual, not navigational

The first browser patient-zero made one architectural mistake visible:

```text
WRONG
focus node + radial neighbors
wheel -> another semantic node
depth rail -> breadcrumb/navigation

CORRECT DIRECTION
one stable organized field
children already latent/visible inside their parent region
zoom/scroll -> more semantic level-of-detail
click/search -> optional explicit repositioning
dependency/search/back -> explicit traversal continuity when provenance matters
```

The base Terrain should optimize for calm reading before interaction:

- Projects occupy stable bands rather than orbiting a central workspace card.
- A Project band previews its next structural layer before the human descends.
- Deeper containment expands in-place while ancestors and siblings remain compressed context.
- Long purpose text is secondary; identity, state and trajectory structure lead.
- Dependency/cross-project relationships appear contextually on focus or explicit inspection rather than as permanent connector lines.
- Camera depth changes presentation only. It does not append Journey history or silently change canonical work position.
- Explicit search, dependency jumps, Back and Revisit may still use Navigation Continuity because those are real semantic jumps.

This preserves AI-readable provenance without making the human UI look like the traversal engine's internal graph.

### Live roadmap — sequence before time

The perceptual Terrain should surface concurrency before forcing a human to descend:

```text
PROJECT
  workfront A   prior -> NOW -> next
  workfront B   prior -> NOW -> next
  workfront C           REVIEW / BLOCKED
```

Vertical position means concurrent workfronts. Horizontal position means continuity through one workfront. Project height may therefore grow with meaningful concurrency, while independent fold state lets a viewer collapse Projects they are not watching.

The default Terrain answers **what is happening now**. A time lens may widen context without hiding current work:

```text
NOW
6H
24H
7D
```

Only accepted transition timestamps establish recent lifecycle movement. Snapshot `updatedAt` may be shown as weaker state-age coverage, but must not be treated as transition truth.

A sibling Roadmap presentation answers a different question:

> **How many admitted sequence steps away is later work?**

It projects:

```text
NOW | +1 | +2 | +3 | LATER / PARALLEL
```

Dependency-grounded sequence is solid. Structural or admitted later work whose exact order is not dependency-grounded is dotted.

Permanent:

```text
SEQUENCE_DISTANCE != ELAPSED_TIME
ROADMAP_STEP != DAY
ROADMAP_STEP != ETA
DEPENDENCY_PATH != CALENDAR_COMMITMENT
PROJECTED_LATER != PROMISED_ORDER
```

The first roadmap should therefore answer:

```text
what is being worked now?
what can follow it directly?
what is two or three dependency steps away?
what admitted work exists later but is not sequenced from this frontier?
```

without inventing dates.

### Measuring AI-carried work

AI-heavy work creates useful measurements, but wall-clock averages alone are misleading because work shape, provider latency, human relay, review loops and fresh-instance handoffs vary.

The more stable first measurements are:

```text
dependency / sequence depth
fresh session count
participant count
continuity handoff count
review-cycle count
accepted lifecycle transition count
human/host waiting intervals
```

Work Participation provides the identity grammar for sessions/participants/handoffs, but live runtime instrumentation is still required before those counts become real operational evidence.

If later evidence becomes dense enough, VexWork may derive empirical effort bands such as:

```text
similar TASK shape
  usually 1-2 sessions
  usually 0-1 human relay holds
  usually one review cycle
```

That remains an effort/interaction expectation, not a promised completion timestamp.

This distinction also survives the transition from Victor acting as a human relay to future Vex automation:

```text
SEQUENCE MODEL
  remains useful

AI / executor effort
  sessions + handoffs + review cycles

human relay latency
  separate waiting dimension

future Vex automation
  may reduce relay latency
  does not rewrite historical sequence truth
```

### Flows pressure — VexWork must not block the work it describes

The same lived cycle exposed a separate source-authoring pressure. Current independent drafts #19 (VexStream Mobile Library), #27 (VexLife ToCompletion) and #35 (VexLife Blueprint Source of Truth) all carry different product meaning yet each touches the same aggregate VexWork paths:

```text
workgraphs/public.json
public/workspace.json
test/workgraph.test.mjs
```

The collision is physical-source coupling, not evidence that those trajectories share one implementation owner.

Permanent direction:

```text
ONE_SEMANTIC_WORKGRAPH != ONE_AUTHORED_FILE
VEXWORK_RECONCILIATION != PRODUCT_EXECUTION_BLOCKER
UI_REFINEMENT != SHARED_WORKGRAPH_WRITE
NO_MATERIAL_WORK_CHANGE -> NO_REQUIRED_WORKGRAPH_CHURN
TRACEABILITY_LAG != LICENSE_TO_INVENT_CURRENTNESS
```

Product/source lanes should continue inside their rightful repositories when their real dependencies and authority allow it. VexWork Flows may reconcile a material checkpoint separately rather than forcing the product lane to wait on an aggregate-file conflict.

This does not yet choose a source-segmentation schema, distributed runtime, or new work-state ontology. The observed need is narrower: preserve one canonical Workgraph while allowing independent work families to author/reconcile without routine aggregate-file contention. The smallest implementation should be earned from that pressure.

The perceptual-depth Terrain correction deliberately follows this rule: it changes Terrain presentation and its focused UI proof without rewriting the shared Workgraph merely because a UI review produced feedback. Accepted Workgraph currentness may temporarily lag that branch and be reconciled as a separate VexWork Flows effect.

PR #33 has now merged the patient-zero source into accepted VexWork main. T1 therefore sits in `VERIFYING`: the remaining predicate is lived browser/trackpad/compact traversal behavior, not additional source formation.

## Phase 2 — Patient Zero: VexSite Localization

VexSite Localization is the first dogfood because it already has a meaningful repository-owned population and evidence surfaces.

Vextreme remains owner of:

- page / route / node / arc identity;
- preserved source identity;
- localization source and target coverage;
- generated/runtime currentness;
- provider-shell / header / modernization facts;
- browser and rendered proof semantics.

VexWork should consume or reference those truths through a reusable work lens.

A useful console should be able to descend:

```text
VexSite Localization
-> Conversations with God
-> provider-current relevant pages (14 in observation 87a013e / 4eaafb71685d)
-> complete / incomplete / unknown
-> incomplete by source / locale / runtime / lived proof / modernization reason
-> exact page
-> current evidence
-> existing foreground Work item, if one exists
```

without creating one Work item per provider page merely for visibility.

The first dogfood completion claim is not "every VexSite page is translated forever." It is:

> the reusable projection can truthfully answer "what remains?" from current Vextreme evidence, preserve source-owned work lineage such as God Spark / Clarity without relabeling it canonical VexWork Work, and explicitly promote one exact derived concern when durable Work is actually admitted.

## Phase 3 — Operating Domain template

After the VexSite lens proves the population model, generalize the abstraction so a domain may describe:

```text
Capabilities
  what this environment can do

Populations
  what kinds of entities exist

Attention Queues
  events/exceptions requiring action

Processes
  reusable routes for handling recurring situations

Lenses
  ways to derive completion/health/attention from current evidence
```

This is the bridge from observability to work management:

```text
observability
  "what is true?"

VexWork
  "what are we doing?"

Operational Console
  "given what is true, what work-shaped attention exists?"
  without prematurely converting all of it into Workgraph work
```

## Phase 4 — reusable commerce starter

Commerce is the second domain because it pressures both population-driven and event-driven work.

The reusable commerce starter should be able to express, without VexWork owning commerce records:

```text
Capabilities
  catalog
  storefront
  sale/order intake
  inventory state
  fulfillment attention

Populations
  sellable items
  listings
  sales/orders
  shipments/fulfillment records

Processes
  add item
  enrich item
  publish/update listing
  mark/observe sold
  prepare fulfillment
  acknowledge physical shipment

Lenses
  listing readiness
  catalog completeness
  inventory integrity
  fulfillment attention
```

### Item model pressure

The starter must not make every possible commerce field mandatory.

A minimally useful item identity may exist while richer fields remain optional.

Examples of optional domain fields include:

```text
image(s)
description
condition
dimensions
maker / provenance notes
price
listing URL
sold-at date
expected shipment date
fulfillment evidence
```

The generic framework should distinguish required identity/lifecycle fields from optional domain data.

### AI-managed site surface

The starter should prove that an AI can help build and maintain a simple public site through the environment rather than requiring the human to become a developer.

The human should be able to do something like:

```text
add this plate
-> supply / capture pictures
-> add or revise the details that are actually known
-> AI updates the managed catalog/site
-> VexWork can explain where the item is and what remains
```

The site may be generated or updated by a rightful site/storefront owner. VexWork remains the work console and routing owner, not the website/content database by implication.

## Phase 5 — Antique Plate commerce pilot

The first lived commerce pilot should begin with a deliberately small real business situation:

> A nontechnical human has antique plates and wants to sell them online.

Initial reality may be:

```text
physical items              PRESENT
website                     ABSENT
catalog                     ABSENT
inventory management        ABSENT
listing workflow            ABSENT
fulfillment workflow        ABSENT
AI-readable operating map   ABSENT
```

The pilot should establish only what is required to reach one truthful end-to-end sale/fulfillment cycle.

### Lived completion path

```text
form the operating environment
-> establish the managed public site/storefront surface
-> add one real item
-> attach/use one or more real pictures
-> add/edit the known item details
-> publish the item
-> observe or record that the item sold
-> inventory/listing state reflects SOLD
-> fulfillment attention appears
-> optionally record expected shipment date
-> human receives the exact physical-action notice
-> human performs the physical shipment / post-office handoff
-> human supplies bounded acknowledgement evidence such as a receipt/photo
-> fulfillment is acknowledged complete
-> the promoted Work item / attention is closed truthfully
```

The first pilot does **not** need to solve every commerce problem.

Payment provider selection, tax/accounting, private customer-data custody, carrier integration and other protected business concerns remain with their rightful providers/processes and are only brought into scope when required by the chosen lived route.

Shipping addresses or other customer-private data must not be copied into public VexWork source merely to make the console useful.

## Human fulfillment boundary

The terminal pilot deliberately includes a physical human action.

The console should be able to make the action simple:

```text
what item / order needs fulfillment
what provider/private reference owns the shipping destination
what physical action is required
optional expected shipment date
what evidence/acknowledgement closes the attention
```

A human may acknowledge completion with a bounded artifact such as a receipt or photo when the selected process uses that evidence.

VexWork should preserve the work/evidence relationship without pretending it physically shipped the object.

## Held expansion — multiple fulfillers / local delivery routing

A later pressure may involve multiple people fulfilling or delivering items and needing:

- assignment;
- nearby-route grouping;
- delivery sequencing;
- worker acknowledgement;
- route/provider integration.

That is intentionally **not** required for the first commerce pilot.

It is preserved as a parked potential until real use earns a routing/dispatch abstraction.

## Cross-domain completion

This Project is not complete merely because a VexSite-specific dashboard exists or one antique page can be published.

The evolution earns its cross-domain completion when the same underlying VexWork abstraction can demonstrate:

1. one large existing repository-owned population (VexSite);
2. one newly formed operating environment (commerce);
3. more than one lens over an entity population without identity duplication;
4. derived attention without task explosion;
5. explicit promotion from derived concern into canonical Work when needed;
6. current evidence changes projection without manual ticket closure;
7. historical Work completion remains distinct from future entity regression;
8. aggregate -> scope -> entity -> Work/evidence descent is human-readable;
9. no domain/provider record silently becomes canonical VexWork WorkState;
10. one lived commerce cycle reaches a truthful human physical-fulfillment acknowledgement.

At that point VexWork has demonstrated that it is no longer only a Jira/kanban-shaped work board. It is a reusable console for perceiving, selecting, navigating and carrying different classes of work.

## 2026-10-22 experience threshold and successor return

Victor has lived-reviewed the current Terrain / Roadmap / Lifecycle Workflow surfaces and accepted the design as **good enough to stop foreground experience iteration and return to the Operational Console product trajectory**.

Accepted first-party experience now includes:

```text
Terrain
  foldable variable-height Projects
  concurrent workfront rows
  Prior | Now | Next continuity
  Now / 6H / 24H / 7D recent-movement lens
  state tint + state-age evidence
  click/search traversal; wheel semantic traversal disabled
  closable Inspect
  bounded participation evidence

Roadmap
  Now | +1 | +2 | +3 | Later / parallel
  dependency-grounded solid sequence
  projected/unsequenced dotted future
  no calendar ETA invention

V1
  live Lifecycle Workflow Map projected from canonical Work Registry
  scoped human-review overlays from Project Agency Policy
  same state-tone families as the V1 board/cards
```

This is a **product threshold**, not a claim that Terrain can never evolve again. Reopen experience work only for a real regression or new consumer pressure.

The foreground returns to:

```text
P2 VexSite Localization patient-zero
  1. page population / scope
  2. localization / modernization lens
  3. patient-zero lived proof
     -> truthfully answer "what remains?"
     -> coexist with real promoted Work

P3 Operating Domain template
P4 reusable commerce starter
P5 Antique Plate lived commerce pilot
P6 cross-domain completion
```

### Bounded Workgraph currentness lag

The accepted aggregate Workgraph may still project:

```text
T1 Relational Terrain patient-zero     VERIFYING
T2 Currentness and flow Terrain layer  WAITING_DEPENDENCIES
P2 VexSite patient-zero                READY
```

That lag is known. It exists because independent drafts #27 and #35 still write the shared aggregate Workgraph/workspace paths, and VexWork Flows deliberately avoids making UI/product progress a coordination blocker.

Do not interpret the stale T1/T2 aggregate states as rejection of the lived threshold above. A future VexWork Flows reconciliation may ordinary-forward the accepted experience checkpoint when the shared aggregate edge is safe. **Do not hold P2 foreground work merely to perform that bookkeeping first.**

The next fresh instance should re-ground current VexWork main and current Vextreme/VexSite evidence, then lead the smallest P2 edge. Vextreme remains the owner of page identity, localization evidence, generated/runtime currentness, modernization facts and browser proof.

## Current trajectory

```text
P1  Derived-work projection foundation                    COMPLETED
    contract                                               COMPLETED
    aggregate / scope / entity projection                 COMPLETED
    explicit concern-to-Work promotion                    COMPLETED
P2  VexSite Localization patient-zero dogfood             COMPLETED
    page population / scope                               COMPLETED
    localization / modernization lens                     COMPLETED
    patient-zero proof                                    COMPLETED
P3  Operating Domain template                             COMPLETED
    Operating Domain contract                             COMPLETED
    operational attention queue                           COMPLETED
P4  Commerce starter template                             RUNNING
    flexible commerce item model                          COMPLETED
    AI-managed storefront/site surface                    READY
    sale / fulfillment attention                          READY
P5  Antique Plate lived commerce pilot                    WAITING_DEPENDENCIES
P6  Cross-domain completion                               WAITING_DEPENDENCIES

PARALLEL EXPERIENCE
T1  Relational Terrain patient-zero                       VERIFYING
T2  Currentness and flow Terrain layer                    WAITING_DEPENDENCIES

PARKED
  multi-person / nearby-route fulfillment optimization
```

Do not create per-page VexWork tasks for P2 or per-item VexWork tasks for P5 merely to populate a board.

## Fresh-instance entry

A fresh worker should normally descend:

```text
VexWork
-> project.vexwork.operational-console
-> this README
-> current READY / RUNNING child
-> exact foundation source/tests implicated by that child
-> target repository/provider only when its facts/effects become material
```

The Project is the durable trajectory map. It is not permission to skip target-repository culture, provider authority, protected human actions, privacy boundaries, or lived proof.

<!-- [VXG RealForever][VEXWORK][OPERATIONAL-CONSOLE][TRAJECTORY] -->
