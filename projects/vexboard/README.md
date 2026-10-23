# VexBoard — Semantic Canvas Project

`[VXG RealForever]`

## Current formation status

```text
human outcome                         APPROVED_FOR_PROJECT_FORMATION
project architecture source           CURRENT
canonical Project / Workgraph entry   CURRENT
public Projects projection            CURRENT
product implementation                NOT_STARTED
implementation authority              SEPARATE_FROM_PROJECT_FORMATION
```

This source preserves the VexBoard product intention and architecture before implementation begins. The Project is now canonically formed through `project.json`, its Work Board view, a bounded Workgraph decomposition, the Project Registry, and the generated public workspace. Product implementation remains separately authority-bound; Project formation does not silently grant repository effects.

```text
PRESERVE_THE_PROJECT_NOW
!=
PRETEND_CANONICAL_REGISTRATION_ALREADY_HAPPENED
```

## Human outcome

A person should be able to describe a website, application, process, operating system, or work journey to AI and receive a navigable visual blueprint **before** expensive implementation begins.

The blueprint should not be a pile of rectangles. It should preserve what each thing means, what it contains, what happens when it is used, which conditions alter the path, where deeper detail lives, and which current source owns projected truth.

> **VexBoard lets a human and AI design, inspect, traverse, refine, reuse, and discuss interactive systems on one scalable semantic canvas—and lets the same canvas project already-existing processes or work without becoming their second source of truth.**

The desired experience is:

```text
human intention
-> AI-authored semantic blueprint
-> spatially clear canvas
-> enter / expand / condense meaningful depth
-> walk the intended experience or process
-> discuss exact screens, nodes, controls, decisions and paths with AI
-> revise through stable references
-> hand a truthful design contract to implementation
-> later compare intended journey with observed lived journey
```

## The pressure this solves

A human may know that they want a website but not yet know:

- which screens or sections exist;
- where information belongs;
- which controls lead where;
- what conditions branch the experience;
- what reusable process sits behind one visible step;
- what a user can do next from each state;
- how the intended walk relates to implementation work.

Asking AI to begin coding immediately can spend implementation time discovering a design that should have been inspected first.

Existing visual tools prove useful individual affordances—large canvases, shapes, frames, connectors, prototype hotspots, code-authored diagrams—but the VexBoard need is one level deeper:

```text
visual object
+ stable semantic identity
+ recursive detail
+ interaction meaning
+ source provenance
+ AI-addressable change
+ traversal continuity
```

The objective is not to reproduce another product's toolbar. It is to make visual planning and process understanding a durable, executable-quality design surface for Vex.

## Product identity

**VexBoard** is the product/project name.

Its first core artifact is provisionally called a **BoardGraph**: one stable semantic model from which several visual and interactive projections can be produced.

The names below are architectural roles, not accepted schemas yet:

```text
BoardGraph
  canonical semantic topology for one board family

BoardProjection
  one visual lens, layout and expansion state over a BoardGraph

BoardJourney
  one explicit semantic walk / simulation through the board

BoardPatch
  one scoped, reviewable AI or human change to BoardGraph meaning
```

The first implementation should earn exact schema names and fields from the patient-zero proof rather than freezing every imagined property in advance.

## Permanent distinctions

```text
VEXBOARD != VEXWORK_WORK_BOARD
VEXBOARD != WORKGRAPH
VEXBOARD != PROCESS_MAP
VEXBOARD != TERRAIN_STATE
VEXBOARD != FIGMA_FILE
VEXBOARD != FREEFORM_DRAWING_ONLY

BOARD_GRAPH != CANVAS_COORDINATES
BOARD_GRAPH != ONE_VISUAL_LENS
BOARD_PROJECTION != BOARD_SOURCE
BOARD_PROJECTION != EFFECT_AUTHORITY

CAMERA_POSITION != SEMANTIC_POSITION
PAN_OR_ZOOM != PROCESS_TRAVERSAL
COLLAPSE != DELETE
INLINE_EXPANSION != ENTERED_JOURNEY_STEP

PORTAL != COPIED_SUBGRAPH
MODULE_INSTANCE != DUPLICATED_SOURCE
COPY != REUSE

SCREEN != IMAGE_OF_SCREEN
BUTTON != RECTANGLE
DECISION != DIAMOND_SHAPE
EDGE != INTERACTION_BY_APPEARANCE

SIMULATED_ACTION != REAL_EXTERNAL_EFFECT
DESIGN_APPROVAL != IMPLEMENTATION_AUTHORITY
AI_SUGGESTION != APPLIED_PATCH

PROJECTED_PROCESS != PROCESS_OWNER
PROJECTED_WORK != WORK_STATE_OWNER
SOURCE_REFERENCE != MUTATION_PERMISSION
```

## One semantic model, several visual lenses

The same BoardGraph should support several projections without cloning meaning.

### Experience lens

Use for websites, mobile applications, onboarding, service journeys, and interactive prototypes.

```text
screen / state
  contains controls
control interaction
  triggers transition, overlay, condition or simulated action
```

### Process lens

Use for operational flows, development processes, localization, review, release, fulfillment, or any input-process-output sequence.

```text
input artifact
-> process
-> decision / branch
-> output artifact
```

### Architecture lens

Use for systems, components, interfaces, data movement, owners, and boundaries.

### Work lens

Use to project VexWork Projects, Work items, dependencies, processes, current evidence, and references without making VexBoard another lifecycle owner.

### Atlas lens

Use to project source-managed Atlas, contract, repository, feature, or system maps into navigable visual form.

```text
SAME_BOARD_GRAPH
-> different lens / layout / visibility rules
-> same stable semantic references
```

A shape is presentation. The node's semantic kind is meaning.

## Provisional semantic vocabulary

The first patient zero should test the smallest vocabulary capable of carrying both website design and process projection.

### Node roles

```text
SCENE
  a screen, page, state, view or meaningful experience surface

CONTROL
  a button, link, field, menu item, gesture target or other affordance

PROCESS
  one transformation or reusable activity

DECISION
  one condition whose evaluated result changes the path

ARTIFACT
  an input, output, document, data object, source or evidence object

CONTAINER
  a frame, section, region, swimlane or semantic grouping

PORTAL
  an entry into deeper detail or a reusable referenced board/module

REFERENCE
  a source-owned Work item, process, repository object, contract or external entity

ANNOTATION
  explanatory material that does not silently become behavior
```

This vocabulary may narrow after implementation pressure. Do not add a new kind merely because a new shape exists.

### Relationships

Containment should be explicit through stable parent/child identity rather than inferred from pixel overlap.

The first relationship roles should cover:

```text
FLOW
  sequence between process meanings

TRANSITION
  experience/state movement

DATA
  artifact or value movement

REFERENCE
  provenance or source-owner relation
```

A relationship may carry a label, condition reference, source reference, or port binding. Presentation may render the same relationship as a straight line, curved return edge, orthogonal connector, hidden cross-link, or contextual overlay.

### Ports and interfaces

A reusable PROCESS or PORTAL may expose typed or named inputs and outputs.

```text
module interface
  inputs[]
  outputs[]
  conditions / guarantees
  detailBoardRef
```

This is how a large process becomes readable without losing its internal truth.

## Fractal depth without visual overload

VexBoard needs four different depth operations that must not collapse into one gesture.

### Enter

Move semantic focus into a referenced detail board. This appends a meaningful BoardJourney step.

### Expand inline

Reveal a node's immediate detail inside the current projection while retaining surrounding context. Expansion changes presentation, not source meaning or journey position by itself.

### Collapse

Hide detail behind its owning node or module interface. Collapse is reversible presentation state.

### Extract

Refactor selected BoardGraph meaning into a reusable module/sub-board with stable input/output ports, then replace the original inline region with a PORTAL or instance.

```text
COLLAPSE
  presentation-only compression

EXTRACT
  source-level semantic refactor
```

Extraction is the visual equivalent of turning repeated or overwhelming code into a named function. It should preserve provenance, references, incoming/outgoing meaning, and the ability to descend into the extracted implementation.

## Reuse versus copy

VexBoard should make two different user intentions explicit:

```text
COPY AS INDEPENDENT DESIGN
  new stable refs
  future edits diverge

INSTANTIATE REUSABLE MODULE
  shared module identity
  instance-local parameters / overrides only where admitted
  source changes can project to every instance
```

Copy/paste must not accidentally create hidden shared state, and reusable instances must not become silent detached copies.

## Interactive experience semantics

A CONTROL should be behavior-addressable rather than merely styled like a button.

The first interaction grammar should be conceptually equivalent to:

```text
trigger
+ optional condition
+ ordered simulated actions
+ destination / result
```

Initial triggers may include:

```text
CLICK
SUBMIT
CHANGE
ENTER
BACK
```

Initial simulated actions may include:

```text
NAVIGATE_TO_SCENE
ENTER_BOARD
FOCUS_NODE
OPEN_OVERLAY
CLOSE_OVERLAY
SET_SCENARIO_VALUE
RETURN
EMIT_SIMULATED_EVENT
```

No initial action may perform a real provider, repository, network, account, payment, publication, or physical-world effect.

```text
PROTOTYPE_INTERACTION
!=
EXECUTION_AUTHORITY
```

Conditions should reference explicit scenario values or evidence states. A diamond is one possible rendering of a DECISION; it is not the decision's source of meaning.

## Loops, returns, and non-linear paths

Real experiences are not acyclic diagrams.

VexBoard must support:

- validation failure returning to an earlier scene;
- retry loops;
- cancellation/back paths;
- shared destinations reached from multiple branches;
- re-entry into a previously visited module;
- explicit terminal and nonterminal outcomes.

Flow loops are valid. Containment cycles are not. The first module/detail contract should fail closed on accidental infinite refinement recursion.

```text
FLOW_LOOP_ALLOWED
CONTAINMENT_CYCLE_FORBIDDEN
ACCIDENTAL_PORTAL_RECURSION_FORBIDDEN
```

## Canvas and layout model

The canvas should feel spatially open like an infinite whiteboard while retaining deterministic structure.

The semantic graph must not require absolute coordinates. A BoardProjection owns layout.

### Layout intents

The first layout engine should recognize a small set of intentions rather than one universal graph algorithm:

```text
SEQUENCE
TREE
SWIMLANE
GRID
SCREEN_FLOW
SYSTEM_MAP
FREE_WITH_CONSTRAINTS
```

### Stable incremental layout

Small semantic edits should not randomly rearrange the whole board. The layout engine should prefer:

1. preserving existing anchors;
2. creating room near the affected region;
3. minimizing unrelated movement;
4. routing branches and return edges legibly;
5. expanding local depth without erasing wider context.

The user's mention of Fibonacci-like growth expresses a real design need: deeper or more important branches should receive proportionate space while the whole remains coherent. Golden-ratio or Fibonacci-inspired spacing may be a visual heuristic, but it must not become canonical topology or force every graph into a spiral.

```text
AESTHETIC_HEURISTIC != SEMANTIC_IDENTITY
```

### Visual cues

Color, shape, border, icon, line style, depth, and animation may communicate semantic roles and state, but the underlying meaning must remain readable without relying on color alone.

## Semantic navigation and the walk stack

VexBoard should reuse the navigation lesson already earned by Terrain and VexLife:

```text
SEMANTIC_POSITION != CAMERA_POSITION
JOURNEY_HISTORY != VIEWPORT_HISTORY
```

### Camera state

```text
pan
zoom
visible bounds
selected projection region
```

Camera changes do not append BoardJourney history.

### Semantic focus

```text
current board
current node / scene / module
current scenario state
current explicit interaction path
```

### BoardJourney

An explicit interaction, portal entry, return, dependency jump, search jump, or chosen revisit can append a journey step.

The right-side walk stack should show enough ordinary meaning to answer:

```text
where am I?
how did I get here?
which condition or control moved me?
what scenario values are active?
which prior coordinate can I revisit?
```

Meaningful repeats remain real history:

```text
A -> B -> A
```

The second visit to A is not discarded merely because the node was visited before.

## AI-first authoring posture

The first version should be **AI-authored and human-navigated**, not a premature full manual editor.

The user should be able to say:

```text
add a Contact button to the Home scene
when clicked, open the Contact form
if required fields are missing, remain on the form and show the error state
if valid, continue to Confirmation
```

The AI should resolve that request into stable BoardGraph changes rather than painting pixels.

### Anchored conversation

Every discussion should be able to bind to exact board, node, relationship, interaction, module, selection, or journey-step refs.

```text
"this button"
-> current selected CONTROL ref

"make this path return here"
-> current selected TRANSITION + target SCENE refs
```

This prevents the design conversation from depending on an ambiguous screenshot or the AI remembering where “that box” was.

### BoardPatch

A meaningful change should eventually be represented as one reviewable patch containing at least:

```text
human intention
board / selection precondition
added / changed / removed refs
semantic consequences
layout consequences
validation result
```

The AI should preview or summarize material consequences before applying broad structural changes. Direct human manipulation, when later added, should emit the same BoardPatch semantics rather than create a second mutation model.

### Context preservation

The active board, selected refs, current journey, and source bindings should be the context passed to AI. The AI should not need the entire historical conversation to understand the current design coordinate.

## Authoring boards and projected boards

VexBoard has two initial truth modes.

### AUTHORING

BoardGraph is the canonical design source for a new experience or process blueprint.

### SOURCE_PROJECTION

Another accepted source owns the meaning. A VexBoard adapter derives BoardGraph/projection material with exact source bindings.

Examples:

```text
VexWork Process Map
-> process projection

VexWork Workgraph / Project
-> work projection

repository Atlas
-> architecture/source projection

VexLife Android feature walk
-> intended or observed journey projection
```

A projected board must fail closed on stale or contradictory source identity rather than silently becoming a detached editable copy.

Later, an annotation/overlay layer may let users discuss a projection without mutating its owner. That should be earned separately rather than hidden inside the first source model.

## VexWork relationship

VexBoard is a **sibling VexWork Project and feature family**, not a rename of the existing Work Board or Operational Console.

### Work Board

The existing Work Board answers:

> Which admitted Work items are in which familiar planning lanes?

### Process Map

The existing Process Map answers:

> Which durable process owner/source should a worker follow?

### Terrain / Operational Console

Terrain and Operational Console explore orientation, currentness, nested work, spatial context, and project navigation.

### VexBoard

VexBoard answers:

> How can an experience, process, architecture, intended journey, or projected current system be spatially designed and traversed through stable semantic objects?

These capabilities may compose:

```text
VexWork Process Map source
-> VexBoard process projection

VexWork Project / Workgraph source
-> VexBoard work projection

VexBoard authored website design
-> implementation work formed in VexWork

VexBoard intended journey
+ observed Screencrawler journey
-> bounded design-versus-lived comparison
```

VexBoard may become the reusable visual substrate for future Operational Console and process-design experiences. It must not steal Workgraph lifecycle, Process Map ownership, Terrain continuity, or target-repository product semantics.

## Blueprint-to-implementation boundary

VexBoard should eventually compile a BoardGraph into a truthful implementation brief containing:

- intended screens/states;
- components and controls;
- interactions and conditions;
- reusable modules;
- data/artifact interfaces;
- acceptance journeys;
- explicit unknowns;
- source references;
- repository/process descent recommendations.

That brief may help AI form implementation work, but it grants no source mutation or lifecycle authority.

```text
BOARDGRAPH_COMPLETE
!=
IMPLEMENTATION_AUTHORIZED
```

## Intended versus observed journeys

A later high-value integration is:

```text
VexBoard intended experience walk
-> implementation
-> VexLife / Android Screencrawler observed walk
-> stable scene/control/checkpoint correspondence
-> differences surfaced to human + AI
```

This should compare semantic checkpoints, actions, outcomes, and visible evidence—not merely screenshot pixels.

Potential differences include:

```text
intended control absent
unexpected intermediate screen
condition routes to wrong destination
back path loses state
loop cannot exit
observed journey contains unmodeled behavior
```

The comparison is evidence. It does not silently rewrite the design or product source.

## Reusable case vocabulary

VexBoard should preserve representative scenarios as first-class design evidence without prematurely turning every example into product schema.

The first architecture uses **case labels** in source documentation:

```text
PRIME_CASE
  a representative scenario that exercises several core VexBoard capabilities
  and is valuable enough to shape the product around

PATIENT_ZERO_CASE
  a bounded implementation/proof scenario used to establish that a product
  threshold actually works

SOURCE_PROJECTION_CASE
  a case where another accepted source owns the meaning and VexBoard must
  project it without becoming the semantic owner

REGRESSION_CASE
  a previously observed misclassification, failure, or confusing path that
  should remain reproducible so the product can prove it no longer invites
  the same error

EDGE_CONDITION_CASE
  a scenario where superficially similar facts can lead to different valid
  outcomes and the deciding condition must remain visible
```

One case may carry several labels.

For now these labels are **architecture/documentation vocabulary**, not accepted BoardGraph schema fields. The first implementation should earn whether they become typed metadata, annotations, test fixtures, or another smaller reusable mechanism.

```text
CASE_LABEL != BOARDGRAPH_SCHEMA_FIELD_YET
EXAMPLE != ACCEPTED_PROCESS_TRUTH
REGRESSION_CASE != AUTOMATIC_POLICY
```

A useful case record should preserve enough context that a fresh instance can understand and traverse the problem without reconstructing the originating conversation:

```text
caseRef
caseLabels[]
humanSituation
questionToResolve
sourceOwners[]
observedFacts[]
decisionConditions[]
expectedJourney[]
knownWrongOrUnsafeJourney[]
completionPredicate
proofObservations[]
relatedBoardRefs[]
```

The exact storage shape remains provisional. The information is what matters.

## Prime case — Project formation under shared aggregate contention

```text
caseRef =
  case.vexboard.vexwork-project-formation-shared-aggregate-contention

caseLabels =
  PRIME_CASE
  PATIENT_ZERO_CASE
  SOURCE_PROJECTION_CASE
  REGRESSION_CASE
  EDGE_CONDITION_CASE
```

### Why this case matters

This case came from VexBoard's own formation.

The human had already supplied enough product intention, examples, architectural pressure, reusable-module expectations, open design questions, and desired patient-zero behavior to form VexBoard as a durable VexWork Project.

At the time, other live VexWork trajectories were also changing shared aggregate source:

```text
VexLife ToCompletion / PR #27
  workgraphs/public.json
  public/workspace.json
  test/workgraph.test.mjs

VexLife Blueprint SOT / PR #35
  workgraphs/public.json
  public/workspace.json
  blueprint/project-registry.json
  related aggregate tests

VexBoard formation
  needed its own project sources
  plus registration in the same aggregate surfaces
```

The VexBoard-owned architecture path itself was disjoint:

```text
projects/vexboard/README.md
```

The shared paths represented **convergence pressure**, not another lane owning VexBoard meaning.

### Source owners that must remain distinct

The correct decision requires combining several existing source owners without collapsing them:

```text
process.vexwork.form-project
  owns the reusable Project-formation route

VexWork Process Map
  owns routing to that process source
  but does not execute or import its internal semantics

Operations coordination
  owns classification of related work, active overlap,
  reconciliation conflict, and protected semantic/authority conflict

Workgraph Composition
  explains that independent work families repeatedly touching
  workgraphs/public.json is physical source contention
  and that ONE_SEMANTIC_WORKGRAPH != ONE_AUTHORED_FILE

live PR / Git state
  owns which exact paths and candidate histories currently overlap
```

VexBoard should project these owners through references and provenance. It should not rewrite their rules into a competing process owner.

### The human question

```text
Human has approved formation of VexBoard.

Other live PRs touch workgraphs/public.json,
public/workspace.json, and/or project-registry.json.

Is VexBoard Project formation blocked?
```

A flat reading of filenames can make the situation look like:

```text
same file touched
-> another writer exists
-> stop
```

That is the regression this case must expose.

### The deciding classification

The useful decision is not merely:

```text
same path?
```

It is:

```text
same path?
  -> yes

same semantic work / owner?
  -> no

foreign active ownership of VexBoard meaning?
  -> no

shared generated projection?
  -> regenerate after canonical-source reconciliation

shared authored aggregate?
  -> preserve both semantic additions through ordinary-forward reconciliation

protected semantic or authority conflict?
  -> no

therefore
  -> CONTINUE PROJECT FORMATION
  -> reconcile aggregate currentness at convergence
```

The distinction should remain visually and semantically explicit:

```text
PHYSICAL_FILE_OVERLAP
!=
SEMANTIC_OWNERSHIP_CONFLICT

RELATED_WORK_EXISTS
!=
BLOCKER

GENERATED_OUTPUT_OVERLAP
!=
MULTIPLE_OUTPUT_OWNERS

AGGREGATE_RECONCILIATION_REQUIRED
!=
PROJECT_FORMATION_BLOCKED
```

### Authored aggregate versus generated projection

This case also proves that VexBoard must expose **artifact role**, not merely filename overlap.

Current VexWork relationships include:

```text
Project definitions
+ Board views
+ Project Registry
+ canonical Workgraph
        ↓
scripts/build-public-workspace.mjs
        ↓
public/workspace.json
```

So:

```text
public/workspace.json
  generated checked-in projection
  -> reconcile canonical source
  -> regenerate

workgraphs/public.json
  current canonical authored aggregate
  -> independent semantic families may collide physically
  -> preserve both meanings during ordinary-forward reconciliation

blueprint/project-registry.json
  source-managed aggregate locator
  -> independent Project registrations may collide physically
  -> reconcile entries rather than suppress one Project
```

The longer-term Workgraph Composition direction should also be visible:

```text
work-family segment A
work-family segment B
work-family segment C
        ↓
deterministic composition
        ↓
one canonical Workgraph
        ↓
generated public workspace
```

This is a strong example of why VexBoard needs recursive depth: a worker should be able to enter `physical overlap`, then enter `generated versus authored aggregate`, then inspect the rightful source owner and return to the main decision path.

### Expected BoardJourney

A correct traversal of the case should be representable as:

```text
Form Project
-> inspect existing work / current source
-> detect shared aggregate path
-> classify relationship
-> physical overlap
-> semantic owners differ
-> no protected conflict
-> continue Project formation
-> form Project + Board + bounded Work
-> register Project
-> prove source relationships
-> ordinary-forward reconcile whichever aggregate writer merges first
```

The journey must preserve the exact branch conditions that justified continuing.

A later revisit to `shared aggregate path` remains a real BoardJourney step rather than being discarded as a duplicate node visit.

### Observed regression journey

The historical misclassification was:

```text
human outcome sufficiently formed
-> shared aggregate writers observed
-> overlap interpreted too strongly
-> only collision-free architecture README merged
-> canonical Project registration deferred
-> VexBoard absent from normal Projects discovery
```

Nothing in that observed journey changed VexBoard's product intention. The defect was the decision path.

The corrective journey was:

```text
re-read source ownership + coordination meaning
-> classify aggregate overlap as reconciliation pressure
-> form project.json
-> form board.view.json
-> add bounded work.vexboard.* decomposition
-> register project.vexboard
-> regenerate public workspace
-> prove deterministic projection
-> merge canonical formation
```

### What VexBoard should prove with this case

A source-projected board for this case should let a fresh worker answer, without reconstructing several prose documents manually:

1. **Which source owns each decision?**
2. **What fact is being classified at this node?**
3. **Which conditions actually block Project formation?**
4. **Which conditions merely require later reconciliation?**
5. **Is the overlapping artifact authored source or generated projection?**
6. **What work can continue while one convergence effect is held?**
7. **Why did the expected path continue while the historical path stopped?**
8. **What exact source references support the chosen branch?**
9. **Where can the worker enter deeper detail and return without losing the main journey?**
10. **Can the current coordinate be recovered without relying on the originating chat?**

### Prime-case acceptance observations

The case should eventually exercise the same BoardGraph through at least two projections:

```text
PROCESS LENS
  formation steps + decisions + continuation/reconciliation branches

ARCHITECTURE / SOURCE LENS
  process owner
  coordination owner
  Workgraph Composition owner
  canonical aggregate artifacts
  generated workspace artifact
  live PR/source references
```

Useful semantic objects include:

```text
PROCESS
  Form VexWork Project
  Reconcile aggregate currentness
  Regenerate public workspace

DECISION
  Existing Work already represents truth?
  Shared path?
  Generated or authored?
  Same semantic owner?
  Active incompatible overlap?
  Protected semantic/authority conflict?

ARTIFACT
  project.json
  board.view.json
  blueprint/project-registry.json
  workgraphs/public.json
  public/workspace.json

REFERENCE
  process.vexwork.form-project
  Process Map source
  Operations coordination source
  Workgraph Composition source
  exact live PR / commit refs

PORTAL
  enter overlap classification
  enter generated-artifact relationship
  enter Workgraph Composition detail
```

The board should make the correct path easier to perceive **without simplifying away the distinction that sometimes an overlap really is blocking**.

### Edge-condition variants

The same case family should include controlled variants so VexBoard does not teach the false opposite rule that all overlap is harmless.

```text
VARIANT A — disjoint semantic additions to one aggregate
  expected = continue + reconcile

VARIANT B — same generated projection, disjoint canonical inputs
  expected = reconcile inputs + regenerate

VARIANT C — two writers changing the same Work item's lifecycle truth
  expected = semantic/currentness conflict; do not mechanically union

VARIANT D — two writers independently redesigning the same BoardGraph contract
  expected = active semantic ownership conflict; coordinate before mutation

VARIANT E — protected authority decision differs
  expected = hold only the protected effect and route to rightful decision owner
```

This is why the case is both a `REGRESSION_CASE` and an `EDGE_CONDITION_CASE`: VexBoard must preserve the boundary between **continue** and **hold**, not merely visualize one preferred answer.

### Relation to intended-versus-observed proof

This case is also an early non-UI example of the intended-versus-observed comparison model:

```text
source-derived intended decision journey
        vs
observed worker decision journey
        ↓
semantic divergence
        ↓
human + AI can inspect the first wrong branch
```

That same comparison shape later applies to:

```text
VexBoard intended experience
        vs
Screencrawler observed product journey
```

The product therefore earns one reusable comparison concept across operational processes and user experiences.

## First foundation threshold

The first implementation should be deliberately smaller than “clone Lucidspark and Figma.”

### Patient zero A — authored website blueprint

One code-authored BoardGraph should represent a small website journey with:

- at least four SCENEs;
- semantic CONTROL nodes inside scenes;
- one conditional DECISION;
- one validation-return loop;
- one overlay or same-scene state change;
- one PORTAL into a deeper input-process-output module;
- one shared/reused module instance;
- deterministic layout;
- read-only pan/zoom/focus;
- clickable simulation;
- a right-side BoardJourney stack with revisit.

The human must be able to inspect the whole design, enter the deeper module, return, walk both branches, and identify the exact semantic ref under discussion.

### Patient zero B — projected current process

The same semantic/rendering foundation should project one existing source-owned VexWork process without copying ownership or making the projection editable as accepted process truth.

The **prime case** above is the preferred initial proof: project `process.vexwork.form-project` together with the exact referenced coordination/composition decision sources needed to answer the shared-aggregate-contention scenario truthfully.

The projection should show:

```text
process summary
-> major steps
-> deeper step detail where source supports it
-> source provenance
-> relationship to relevant Work/Project refs
```

The two patient zeros prove the essential duality:

```text
VEXBOARD_CAN_AUTHOR_NEW_MEANING
AND
VEXBOARD_CAN_PROJECT_EXISTING_MEANING
```

## First deterministic acceptance claims

The first foundation is not complete until it can establish:

1. semantic identity does not depend on canvas coordinates;
2. semantically equivalent source order converges;
3. missing/duplicate/foreign refs fail closed;
4. containment cycles fail closed;
5. valid interaction loops remain representable;
6. portal/detail descent cannot recurse accidentally forever;
7. collapse/expand preserves BoardGraph identity;
8. explicit traversal changes BoardJourney while pan/zoom does not;
9. repeated visits remain in Journey history;
10. projected boards retain exact source identity and reject stale source bindings;
11. simulation performs zero real external effects;
12. AI changes can be expressed as bounded BoardPatch meaning;
13. authored and projected boards use the same core graph/projection grammar;
14. the human can recover the current coordinate without chat-history reconstruction.

## Phased horizons

These are product horizons, not calendar promises or implementation authority.

### Phase 0 — architecture and Project formation

This document, canonical Project registration, bounded Work decomposition, and first-source placement.

### Phase 1 — BoardGraph foundation

Stable refs, node/relationship/interaction grammar, validation, semantic fingerprinting, modules/ports, source binding, and deterministic fixtures.

### Phase 2 — read-only canvas projection

Deterministic layout, shapes/frames/connectors, pan/zoom/minimap, focus, inline expansion, portal entry, and source inspectability.

### Phase 3 — prototype simulation and BoardJourney

Clickable controls, conditions, scenario state, overlays, loops, Back/Return, right-side walk stack, and revisit.

### Phase 4 — AI BoardPatch authoring

Intent-to-patch, anchored conversation, validation, minimal-movement relayout, material-change preview, undo/redo lineage, and reusable module extraction.

### Phase 5 — source projectors and lived comparison

VexWork Process/Work/Project adapters, Atlas adapters, intended-versus-observed Journey comparison, and implementation-brief output.

### Phase 6 — direct manipulation and collaboration

Manual drag/resize/connect/edit, multi-user collaboration, comments, voting, permissions, and richer media only after the AI-first semantic foundation proves that direct manipulation can preserve the same source rules.

## Deliberately held

The first foundation does not require:

- full Lucidspark feature parity;
- full Figma visual-design fidelity;
- arbitrary freehand drawing;
- real-time multiplayer editing;
- direct source-code generation;
- repository mutation from a simulated action;
- production provider integrations;
- payments, credentials, private customer data, or physical effects;
- 3D spatial rendering;
- generic plugin marketplace;
- every possible UML/BPMN notation;
- a universal layout algorithm;
- mobile/native editors;
- automatic acceptance of AI changes.

These may be earned from real use after the core model exists.

## Priority relationship to current Operational Console work

The existing VexSite population/scope candidate remains valid and should not be discarded. It is data/source interpretation, not an interactive canvas implementation.

The priority decision is:

```text
preserve and lifecycle the existing bounded P2 candidate

then

VexBoard semantic-canvas foundation
  should precede new bespoke interactive Operational Console,
  process-designer, or large visual-map UI work that would otherwise
  invent a second canvas/navigation/interaction substrate
```

P2 data/lens semantics may continue when genuinely disjoint. VexBoard is not a fabricated dependency on source interpretation. It is the higher-leverage candidate foundation for the next interactive visual experience.

## Canonical Project formation shape

When aggregate reconciliation is available, the smallest expected canonical Project shape is:

```text
projectRef = project.vexboard
label = VexBoard Semantic Canvas
rootWorkRef = work.vexboard.outcome
repositoryRefs = [repo.vexwork]
```

Initial Workgraph decomposition should remain bounded, approximately:

```text
VexBoard Semantic Canvas                         OUTCOME
  Project architecture and foundation boundary  TASK / completed by this source
  BoardGraph semantic contract                  TASK
  Read-only canvas and recursive navigation     TASK
  Prototype simulation and BoardJourney         TASK
  AI BoardPatch authoring                        TASK
  Source projectors and lived comparison         OUTCOME or later TASK family
```

Exact Work states, dependencies, authority/effect dispositions, transition history, and Project registration must be formed from live source at reconciliation time rather than copied from this architecture sketch.

## Current continuation

```text
architecture source                         CURRENT
canonical Project + Workgraph + Board       CURRENT
public Projects projection                  CURRENT
prime Project-formation regression case     SOURCE-PLACED

next product frontier
-> BoardGraph semantic contract
-> use authored website patient zero + prime source-projection case
   to earn the smallest reusable graph/schema vocabulary
-> keep case labels provisional until implementation proves the right storage shape
-> separately establish implementation authority and source membrane before mutation
```

No human host action is required to preserve this design.

<!-- [VXG RealForever][VEXWORK][VEXBOARD][PROJECT-ARCHITECTURE] -->
