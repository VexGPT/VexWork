# Vex Process Family MetaWalk — Formation Candidate

[VXG RealForever]

## Status

This source is a **formation candidate**, not a frozen ontology.

Working names such as **VexProcessFamily**, **MetaWalk**, **process node**, **layer**, and the relationship labels below are allowed to change when pressure-testing finds a truer boundary. The durable claim in this first formation is the relationship shape, not the spelling.

This source intentionally forms the reusable process shape before Process Registry promotion, public onboarding UI, or VexRelay runtime mutation.

~~~text
SHAPE FIRST
-> WALK IT
-> PRESSURE-TEST RELATIONSHIPS
-> THEN PROMOTE THE PARTS THAT SURVIVE
~~~

## CURRENT architecture — cold-reader authority

This section defines the **exact current candidate**. Later A00x / Assurance sections preserve historical evidence about how the candidate changed; when a historical passage conflicts with this section, the historical passage is superseded and is not current schema authority.

~~~text
CURRENT MACHINE FAMILY

ProcessFamily
  schemaVersion
  familyRef
  entryNodeRef
  layers
  entryLayer
  movementClasses
  forwardMovementClasses
  nodes[]
  relationships[]

node
  nodeRef
  label

relationship
  relationshipRef
  movementClass
  fromRef
  toRef
  label
  entryPredicateRefs

ProcessFamily.State
  schemaVersion
  stateRef
  familyRef
  scopeRef
  currentNodeRef
  layer
  previousStateRefOrNull
  lastAcceptedTransitionOrNull

lastAcceptedTransitionOrNull
  transitionRef
  relationshipRefOrNull
  fromLayer
  evidenceRefs
  carriedIdentityRefs
~~~

The current candidate deliberately does **not** carry:

~~~text
Family purpose
Family / node / relationship sourceRefs
node purpose
node currentTruthRefs
node ownerRefs
node readingSourceRefs
node considerationRefs
node proofRefs
dynamic bounded-horizon runtime helpers
~~~

Those fields/helpers were removed or held because the exact candidate had no present consumer that earned them.

### Current VexBoard reality

The checked-in board:

~~~text
board.vexwork.process-family-metawalk
~~~

is registered in the existing source catalog and can be resolved/opened **when its exact board ref is supplied**.

At this exact candidate, no default landing control, portal path, or other non-test runtime entry supplies that ref.

Therefore:

~~~text
CHECKED-IN BOARD
  source-registered
  source-addressable
  source-bound to the machine Family

EXECUTABLE CONSUMPTION
  HELD
  no current default runtime route enters this board

CATALOG ADDRESSABILITY
!= EXECUTABLE CONSUMPTION
~~~

The dynamic State-bound bounded-horizon projector is also absent/held until a real State-bearing executable consumer earns it.


## Human intention

A fresh hosted assistant or future long-lived Vex should be able to enter incomplete work and recover enough truth to continue without reconstructing the entire trajectory from chat history.

It should be able to answer:

~~~text
What is the original outcome?
What accepted step got us here?
What process question is current?
What current truths does this node depend on?
What may I read and change here?
What proof completes this node?
What future detail must I deliberately not load yet?
What becomes reachable if this node succeeds?
What changed after the last material round?
~~~

The process map should also improve how work is **formed**, not merely how already-formed tasks are displayed. The map should pressure feature decomposition toward semantic owners, contracts, relationships, implementation boundaries and proof obligations before a target UI or executor invents missing meaning.

## Why this is not another Workgraph

Existing VexWork owners remain intact:

~~~text
Workgraph
  owns Work identity, containment, dependencies, lifecycle and current WorkState

Process Map
  routes recurring process questions to their rightful durable source

VexBoard
  projects semantic/process relationships for perception and construction

VexRelay / target executors
  perform admitted bounded effects and return evidence

VexProcessFamily / MetaWalk candidate
  describes how one process can be formed, traversed, deepened,
  revisited and resumed without becoming any of the owners above
~~~

Permanent:

~~~text
PROCESS_FAMILY != WORKGRAPH
PROCESS_NODE != WORK_ITEM
PROCESS_POSITION != WORKSTATE
BOARD_POSITION != AUTHORITY
KNOWN_FUTURE_NODE != CURRENT_READING_SCOPE
ADDRESSABLE != ENTERED
~~~

## The three-coordinate model

A useful current position has three independent coordinates.

### Scope

What larger outcome is being carried?

Examples:

~~~text
product trajectory
feature / outcome
repository integration
Relay proof trajectory
~~~

A scope may itself have a previous / current / next neighborhood.

### Process node

What semantic process question is current inside that scope?

Examples:

~~~text
recover intention
establish semantic ownership
establish contract
realize Connection/runtime boundary
realize target presentation
prove behavior
prove lived outcome
~~~

Process truth is graph-backed. A simple previous/current/next neighborhood is a projection of that graph, not a singly-linked-list storage law.

### Layer

Through what lens are we currently touching the process shape?

Working layer vocabulary:

This candidate uses **layer** for the pass/lens through which one process node is being resolved. That is intentionally distinct from Vextreme-SDK Process Atlas `depthClass`, which describes scale from whole journey through traceability.

~~~text
PROCESS_FAMILY_LAYER != PROCESS_ATLAS_DEPTH_CLASS
LAYER = resolution pass / lens
ATLAS depthClass = process scale / granularity
~~~

~~~text
0  FORMATION
   recover intention and form the first stable-enough shape

1  TOPOLOGY
   plot nodes, sequence, branches, recovery paths and enabling relationships

2  OWNERSHIP
   bind rightful semantic/source/currentness owners

3  CONTRACT
   bind names, inputs, outputs, relationships, membranes and consumers

4  IMPLEMENTATION
   realize the already-earned contracts in target-native source

5  FOCUSED_PROOF
   test the specific contracts and failure boundaries established above

6  LIVED_INTEGRATION
   prove the composed/lived outcome and integration currentness

7  RECONCILE_ACCEPT
   consume evidence, reconcile current truth and establish the next durable coordinate
~~~

Layer is not a mandatory universal checklist. A simple change may not earn every layer. A real feature may move backward when downstream evidence exposes an upstream gap.

~~~text
SAME NODE + DIFFERENT LAYER
!= DUPLICATE WORK
~~~

## Full topology versus active reading horizon

The durable process may know the broader route while active cognition remains narrow.

Default projection:

~~~text
ORIGINAL OUTCOME

LAST ACCEPTED NODE
        |
        v
CURRENT NODE
        |
        v
NEXT EARNABLE NODE

further route:
  identity / address may remain visible
  deep content remains unloaded
~~~

The current node receives the deep reading budget.

The next node may expose:

~~~text
identity
purpose
entry predicate
what current work must establish for it
~~~

Future nodes remain addressable but should not automatically contribute their detailed operating source to the active context.

Exception:

~~~text
CURRENT NODE CORRECTNESS
materially depends on one exact downstream contract
-> follow that exact reference only
!= preload the future phase
~~~

## Process node contract

A useful planned node should be able to answer the following questions. These are semantic requirements, not yet a wire schema.

~~~text
IDENTITY
  stable node reference

PURPOSE
  what process question is answered here?

ENTRY
  what must already be true before the node is entered?

CONSUMES
  what accepted/current truths does this node depend on?

OWNERS
  where do those truths come from?

READING SCOPE
  what source should a fresh instance load now?

AUTHORITY / EFFECT MEMBRANE
  what may happen here and what remains held?

CONSIDERATIONS
  what known pressure must survive this node?

WORK
  what is actually being established?

PROOF
  what evidence falsifies or satisfies the current claim?

EXIT
  what durable result does completion establish?

CARRIES
  which stable identities and accepted evidence may be carried forward
  as expectations / provenance without being re-invented?

REGROUND
  which mutable authority, provider, repository, candidate or runtime truths
  must be re-observed before the next dependent effect?

OUTGOING RELATIONSHIPS
  what becomes reachable on success, correction, recovery or changed currentness?
~~~

The node contract should be enough for a competent fresh instance to resume incomplete work without reading the full predecessor transcript or future implementation plan.

## Graph-backed previous / current / next

Human/AI perception may use:

~~~text
PREVIOUS -> CURRENT -> NEXT
~~~

but durable truth may contain branching, correction, recovery and convergence relationships.

Working MetaWalk movement vocabulary:

~~~text
ADVANCES
  accepted truth makes a later node meaningfully reachable

ENABLES
  a larger scope/feature creates a capability required by another scope/feature

REFINES
  later pressure adds precision without invalidating the prior owner/truth

SEMANTIC_GAP
  implementation pressure shows semantic ownership or meaning is ambiguous
  and must return to ownership before being classified as a contract defect

CONTRACT_GAP
  downstream evidence shows an upstream contract is incomplete or wrong

IMPLEMENTATION_DEFECT
  contract remains valid; target realization must be corrected

CURRENTNESS_CHANGED
  architecture remains valid; mutable external truth must be re-observed

RECOVERS
  a failed/interrupted round returns to a lawful process coordinate without replaying completed effects
~~~

These names are **owned by this ProcessFamily definition**, not by the generic ProcessFamily core. Another Family may declare a different movement vocabulary. The generic core reserves **no semantic movement name** for same-node layer movement. A relationship-free layer change is structural: `relationshipRefOrNull = null`, `movementClass = null`, same node, different Family-declared layer.

Names remain candidates. The requirement is to preserve **why** traversal moved, not merely that an arrow exists.

## Revisit semantics

Iteration count alone is too lossy. Revisiting work should preserve the causal class.

### Layer revisit

Same semantic coordinate, deeper lens.

~~~text
contract
-> implementation
-> proof
~~~

Normal progression.

### Refinement revisit

Later understanding narrows or enriches a still-valid earlier relationship.

### Correction revisit

Evidence proves an earlier contract/assumption false or insufficient.

### Currentness revisit

The architecture remains valid but the world changed.

Examples:

~~~text
main moved
branch now exists
PR state changed
provider capability changed
candidate head/tree changed
authority/current claim changed
~~~

Currentness revisit must not be mislabeled as architecture failure.

## Round completion and Compound currentness

A process round never gets to assume its predecessor snapshot remains current merely because the round completed successfully.

~~~text
PERCEIVE CURRENT STATE
-> resolve current Act
-> perform admitted Effect
-> consume evidence
-> invalidate affected observations
-> re-observe mutable truths required by the next decision
-> derive the new coherent current State
-> re-project the active horizon
-> continue
~~~

Permanent:

~~~text
PRIOR_OBSERVATION = HISTORICAL_TRUTH
PRIOR_OBSERVATION != AUTOMATICALLY_CURRENT_TRUTH

ROUND_COMPLETION != NEXT_ROUND_CURRENTNESS

EFFECT_OCCURRED
-> RECONCILE_AFFECTED_TRUTHS

OBSERVED_STATE_CHANGE
!= SAME CONSEQUENCE IN EVERY PROCESS FAMILY
~~~

For example, unrelated remote-main movement may be current provider truth while leaving an exact-head SourceOwner proof valid when its fixed base is only an evidence anchor. The later integration process owns the consequence of current main.

## The first MetaWalk

The first use of this candidate is deliberately self-referential: use the walk to form the walk.

~~~text
0. RECOVER INTENTION / PRESSURE
   Why is a reusable process shape needed?
   Which real failures or continuity burdens justify it?

1. PLOT TOPOLOGY
   Form the smallest stable-enough path, branches and feedback edges.

2. BIND OWNERSHIP
   Identify which existing owner supplies each truth.
   Do not mint a new owner for data already owned elsewhere.

3. BIND CONTRACTS / RELATIONSHIPS
   Name the relationships only after their boundaries are understood.
   Distinguish semantic input, bound Work input, live fact,
   derived invariant and carrier mechanic.

4. BIND PROOF STRATEGY
   Decide what each relationship earns us to claim and what falsifies it.
   Let node type/relationship pressure suggest the right test class.

5. REALIZE IMPLEMENTATION
   Build target-native source from exposed contracts.
   Presentation/execution machinery must not manufacture missing meaning.

6. FOCUSED PROOF
   Prove the bounded contracts, invalid states and failure/currentness boundaries.

7. LIVED / INTEGRATION PROOF
   Prove the composed human/runtime outcome and integration currentness.

8. RECONCILE / ACCEPT
   Consume evidence, classify revisits, establish accepted truth,
   rotate the active horizon and expose the newly earned next node.
~~~

Feedback examples:

~~~text
IMPLEMENTATION
  -- semantic ambiguity --> OWNERSHIP

FOCUSED_PROOF
  -- contract gap --> CONTRACTS

LIVED_PROOF
  -- implementation defect --> IMPLEMENTATION

LIVED_PROOF
  -- contract gap --> CONTRACTS

ANY MATERIAL ROUND
  -- mutable truth changed --> CURRENTNESS RECONCILIATION
~~~

This is structured iteration, not waterfall.

## How the map shapes VexWork planning

A feature should not be decomposed merely into activity nouns such as:

~~~text
make screen
add button
hook API
add tests
~~~

The MetaWalk asks instead:

~~~text
What truth must be established before a later consumer can advance without inventing meaning?
~~~

A pressure-tested feature might therefore earn Work such as:

~~~text
establish semantic ownership / Family contract
        |
        v
establish runtime Connection
        |
        v
prove currentness / provider behavior
        |
        v
realize target presentation from exposed contracts
        |
        v
prove target interaction
        |
        v
prove lived/integration outcome
~~~

These relationships may inform Workgraph dependencyRefs when the later Work genuinely cannot meaningfully advance without the earlier truth.

~~~text
PROCESS RELATIONSHIP
may explain a Work dependency

PROCESS RELATIONSHIP
!= automatic Work dependency
~~~

## How the map shapes tests

Tests should fall out of the relationship being established.

Examples:

~~~text
SEMANTIC CONTRACT
-> State / Control neighborhoods
-> unavailable/invalid relationships
-> admission behavior
-> typed identity

CONNECTION / RUNTIME
-> provider success
-> provider failure
-> stale later result
-> concurrency/lifetime
-> reconciliation into current truth

TARGET PRESENTATION
-> current State projects correctly
-> exposed Control maps exactly
-> presentation does not manufacture semantic truth

LIVED / INTEGRATION
-> end-to-end human outcome
-> current provider/source state
-> post-effect reconciliation
~~~

A later proof layer may touch a node established at an earlier layer without implying that earlier work failed.

## Fractal scope

The same bounded-horizon grammar may operate at more than one scale.

~~~text
PRODUCT / FEATURE SCALE

previous feature
CURRENT FEATURE
next feature

        contains / selects

PROCESS SCALE

previous node
CURRENT NODE
next node

        plus

LAYER

formation / topology / ownership / contract /
implementation / focused proof / lived proof / reconcile
~~~

A useful reorientation coordinate may therefore be described as:

~~~text
current scope
x current process node
x current layer
~~~

This is a conceptual coordinate, not yet a new VexWork schema.

## VexBoard relationship

VexBoard is the natural perception/construction surface for this process shape.

The Board should be able to show:

~~~text
full topology faintly enough to preserve surroundings
+
original outcome
+
last accepted node/result
+
CURRENT node emphasized
+
next earnable node + entry predicate
~~~

Deep future-node content remains source-addressable but should not be loaded merely because the node is visible.

VexBoard projects this meaning. It does not become Process, WorkState, source, authority or currentness owner.

## VexRelay patient zero

VexRelay is the first major pressure test because its current runtime is strict and fail-closed while too much authoring meaning can still be reconstructed from manuals or low-level fields.

The audit is broader than one maxFiles specimen.

For each recipe/process decision:

~~~text
What question is being answered?
Who owns the answer?
What current truth does it depend on?
What relationship binds those truths?
What is genuinely selectable?
What is derived?
What must be observed live?
What is carrier/runtime plumbing?
What consumes the value?
What physical consequence changes?
What wrong-but-plausible interpretation remains possible?
Can that interpretation be removed or made structurally invalid?
~~~

Every exposed value should eventually be classifiable as one of:

~~~text
SEMANTIC_INPUT
BOUND_WORK_INPUT
LIVE_OBSERVED_FACT
DERIVED_INVARIANT
CARRIER_MECHANIC
~~~

Desired progression:

~~~text
lesson in prose
-> understood invariant / relationship
-> rightful owner identified
-> compiler/type/adapter derives what it owns
-> strict validator remains defense in depth
-> prose shrinks to explanation
~~~

## First pressure walk — VexRelay SourceOwner to Assurance to integration currentness

The first real pressure walk uses the current Vextreme-SDK Relay contract at source head
\`9be6c8c3c169e8b98b04c7821b300f84cb8342de\`.

This is not a new Relay specification. It is a cold read of the accepted SDK relationship through the MetaWalk.

### Node A — ExactHeadSourceOwnerProof

~~~text
PURPOSE
  Does this exact immutable candidate satisfy the source owner's
  bounded behavior / browser / repository proof contract?

OWNER / ROLE
  CODER
  STAGE_BOUNDED

ENTRY / EXPECTED IDENTITIES
  repositoryRef
  exact candidate head
  exact candidate tree
  fixed evidence/diff base
  source-owner proof predicates

CURRENTNESS LAW
  fixed base = EVIDENCE_DIFF_ANCHOR
  fixed base != live-main lock

  required candidate relations:
    exact head unchanged
    exact tree unchanged
    fixed base remains ancestor

  remote main advances:
    SourceOwner proof may continue

PROOF EFFECT
  read repository state
  prove expected head/tree
  run only source-owner predicate classes
  form bounded review projection
  form canonical RETURN

EXIT
  exact SourceOwner evidence exists for the exact candidate

NOT EXIT
  Independent Assurance CLEAR
  lifecycle currentness
  approval / READY / merge
~~~

This node validates the MetaWalk rule that **one node should contain only the proof classes owned by its
semantic question**. The current recipe compiler rejects later-stage predicate classes before task
formation.

### Node boundary — what survives the transition?

A SourceOwner PASS does not mean the next node inherits all observations from that attempt.

The current SDK already carries three different kinds of meaning that the MetaWalk should keep distinct:

~~~text
PRESERVE STABLE IDENTITY / EXPECTATION
  Work / lane / source identity
  exact candidate identity as the candidate being reasoned about
  accepted source-owner evidence references

CARRY ACCEPTED EVIDENCE
  canonical RETURN
  exact SourceOwner PASS evidence
  transition / proof provenance

REGROUND MUTABLE CURRENTNESS
  current authority before another effect
  provider branch / PR truth required by the next node
  repository/provider observations whose truth may have changed
  current integration base when integration currentness becomes material
~~~

The candidate head can therefore survive as **the expected candidate identity** while the next node
still re-observes whether the provider/repository currently presents that identity.

~~~text
EXPECTED_IDENTITY
!=
LIVE_OBSERVATION
~~~

This distinction is stronger than treating all forward state as either disposable or automatically current.

### Node B — IndependentAssurance

~~~text
PURPOSE
  Form a fresh read-only remote review projection of the exact candidate.

OWNER / ROLE
  INDEPENDENT_ASSURANCE
  READ_ONLY

ENTRY
  exact candidate expectation from accepted SourceOwner work
  exact review base for this assurance question
  branch/provider coordinate
  fresh assurance occupancy / authority

CURRENT WORK
  authenticate provider capability
  query remote review snapshot for exact base/head/branch
  form canonical RETURN

EXIT
  independent assurance evidence exists

NOT EXIT
  semantic CLEAR issued by the Relay recipe itself
~~~

The SDK explicitly says IndependentAssurance forms evidence but does not self-issue semantic clearance.
That distinction maps cleanly to:

~~~text
PROCESS NODE EFFECT
!=
LATER OWNER'S INTERPRETATION / ADMISSION OF THAT EVIDENCE
~~~

### Node C — integration currentness / OwnerMergeDuty

SourceOwner's fixed base does not silently become current integration main.

~~~text
SOURCE OWNER
  fixed base = evidence anchor

OWNER MERGE DUTY
  current integration base/head relationship becomes material here
  remote base head is checked here
  remote branch head is checked here
  PR + provider checks are observed here
~~~

Therefore:

~~~text
REMOTE MAIN CHANGED DURING SOURCE OWNER
!= SOURCE OWNER FAILURE

REMOTE MAIN CURRENTNESS
-> becomes a dependent truth of the later integration node
~~~

This is a concrete example of the Compound-currentness law:

~~~text
same observed fact changed
+ different current process node
= different semantic consequence
~~~

### First input-ownership observations

The walk also confirms that the recipe compiler already contains a mixture of input classes:

~~~text
recipe family
  semantic process selection

repositoryRef / exact candidate coordinates / branch / PR coordinate
  bound Work / expected identity plus live-currentness obligations

proofCommands + predicate classes
  repository/source-owner proof contract

AUTH insertion for GitHub-GH clone
  derived from repository acquisition mode

operation sequence + stage gate + canonical RESPOND
  compiler-owned invariant

task/RETURN packaging and carrier identity
  runtime / carrier mechanic

maxFiles
  currently exposed stage knob
  but physically bounds selected review-source projection
  -> strong DERIVED_INVARIANT candidate for further pressure
~~~

The important finding is broader than \`maxFiles\`: **every exposed value should declare whether it is a
semantic choice, an expected/bound identity, a live observation obligation, a compiler-owned invariant,
or carrier plumbing.**

### MetaWalk refinement earned by this pressure

The node contract now needs both:

~~~text
CARRIES
  stable identities + accepted evidence that remain meaningful across the transition

REGROUND
  mutable truths that must be observed again before the next dependent effect
~~~

This refinement is earned by current SDK behavior rather than invented for aesthetic symmetry.

It also sharpens the bounded reading horizon:

~~~text
while SourceOwner is CURRENT:
  deep-read SourceOwner contract
  know Assurance identity / purpose / entry predicate
  do not preload OwnerMerge mechanics

after SourceOwner exit + reconciliation:
  compress SourceOwner to accepted evidence
  re-ground Assurance-required provider truth
  rotate CURRENT to Assurance
  expose the next earnable lifecycle/currentness node
~~~

## Second pressure walk — ThemeMode feature evolution

The second pressure walk uses accepted VexLife-Android source rather than a hypothetical feature plan.

Relevant accepted progression:

~~~text
PR #188
  ThemeMode production realization
  -> Direct Family Select semantics
  -> Family-owned DisplayState
  -> VexThemePresentation
  -> one VexLifeTheme boundary
  -> inherited target presentation

PR #202
  ThemeMode durability
  -> same ThemeModeFamily semantic owner
  -> Store relationship
  -> explicit selection saves durable Light/Dark
  -> new process observes stored value through the same StateRelay boundary

PR #195
  ThemeMode Feature Walk
  -> dedicated installed Journey
  -> proof/traceability over accepted production behavior
  -> no new ThemeMode semantic state or production owner

PR #194
  Journey observation reuse
  -> adjacent shared evidence-coordinate refinement
  -> removes same-walk retranscription
  -> no ThemeMode production behavior change
~~~

This trajectory validates the three-coordinate model and adds one important non-collapse.

### Production realization scope

PR #188 can be read as a feature-scope walk:

~~~text
INTENTION
  existing Debug Menu theme control should execute accepted ThemeMode meaning

SEMANTIC OWNERSHIP / CONTRACT
  ThemeMode = NotSet | Light | Dark
  ThemeModeFamily.Control.Select(mode)
  NotSet is unresolved State, not a selectable mode
  current two-value target form != Boolean semantic contract

DISPLAY CONTRACT
  ThemeMode current State
  -> ThemeModeFamily.DisplayState
  -> VexThemePresentation

TARGET REALIZATION
  VexLifeApp
  -> VexLifeTheme(themeModeFamily)
  -> inherited presentation continuity

LEAF UI
  Debug Menu chooses which registered Control receives current presentation
  UI does not decide what Dark / Light means

FOCUSED PROOF
  ThemeModeTest
  VexLifeSessionTest
  VexMapsAppearancePreferenceTest

SOURCE OWNER / ASSURANCE / INTEGRATION
  exact candidate proof remains distinct from later acceptance
~~~

This is the process-shaping benefit the MetaWalk is intended to preserve:

~~~text
semantic contract first
-> expose target-consumable relationship
-> realize UI from that relationship
-> test the semantic and target seams separately
~~~

### Durability is a new scope that reuses the same owner

PR #202 touches ThemeModeFamily again, but the human outcome is different:

~~~text
production presentation scope
  "ThemeMode means and renders correctly now"

durability scope
  "an explicit ThemeMode selection survives process recreation"
~~~

The durability scope earns a new relationship:

~~~text
Control.Select(Light|Dark)
-> CURRENT semantic State admission
-> Store Save

new process
-> Store observation
-> same Family StateRelay currentness boundary
-> restored CURRENT ThemeMode
~~~

The existing Family remains the rightful semantic owner. Reusing it does not mean the production-realization
node was incomplete or failed.

Permanent candidate distinction:

~~~text
SAME SEMANTIC OWNER TOUCHED UNDER NEW SCOPE
!= SAME PROCESS NODE REOPENED
~~~

This validates **scope** as a real coordinate rather than decorative grouping.

It also validates the working \`ENABLES\` relationship at a larger scale:

~~~text
accepted ThemeMode semantic/production foundation
-- ENABLES -->
ThemeMode durability
~~~

The later scope may descend into some of the same reusable process-node kinds while carrying a different
human intention and proof contract.

### Feature Walk is a layer revisit, not production reimplementation

PR #195 adds a dedicated installed Journey and completion/checkpoint traceability after production source
is accepted.

~~~text
accepted production behavior
-> Journey path
-> Feature-Walk binding
-> proof backlinks to existing focused tests
~~~

The PR explicitly does not become ThemeMode semantic State, Debug Menu runtime ownership, or a production
feature registry.

That is a clean example of:

~~~text
same feature scope
+ later proof / traceability layer
!= production behavior rewrite
~~~

The process model therefore should be able to say:

~~~text
scope = ThemeMode production realization
node  = lived / installed human walk
layer = proof / traceability
~~~

while keeping the already-accepted semantic and implementation nodes compressed into prior accepted
results.

### Adjacent refinement should not be swallowed by the feature scope

PR #194 removes retranscription between Journey observation and ScreenCrawler evidence:

~~~text
Journey execution
-> VexJourneyStepObservation
-> ScreenCrawler evidence identity
~~~

It preserves both owners and changes only the carriage of an already-formed coordinate.

The pressure here is related to the ThemeMode walk but the source change belongs to a reusable Journey /
ScreenCrawler relationship. It should not automatically become a ThemeMode child node merely because
ThemeMode exposed the pressure.

This validates another planning distinction:

~~~text
WORK DISCOVERED WHILE WALKING A SCOPE
!= WORK OWNED BY THAT SCOPE
~~~

The Workgraph / discovered-work posture remains the right place to preserve such adjacent work without
widening the active feature.

### MetaWalk refinement earned by this pressure

The second walk confirms:

1. **scope identity is operationally meaningful** — it separates a new outcome using the same semantic
   owner from a correction/reopen of an old process node;
2. **ENABLES can exist at feature/scope scale** without implying parent/child Work identity;
3. **layer revisit is real** — Feature Walk proof can revisit accepted production meaning without
   re-authoring it;
4. **process decomposition should follow truth dependencies** — ThemeMode UI became simpler because
   Family and display contracts were established before the target leaf consumed them;
5. **tests are relationship-specific** — semantic Family tests, session/action routing tests,
   presentation tests, persistence tests and Journey proof each answer different questions;
6. **adjacent reusable refinement remains separately owned** even when one feature walk discovers it.

No fourth coordinate is earned by this specimen. Scope × process node × layer remains sufficient for the
observed ThemeMode evolution.

## Projection pressure — reuse BoardJourney without making it process truth

Current VexBoard already has a useful traversal owner:

~~~text
BoardJourney
  currentRef
  steps[]
  returnStack[]
  journeyChoices(...)
  advance / back / revisit
~~~

That is enough to support the **perception/navigation** side of a bounded process horizon.

It does **not** earn BoardJourney as the durable owner of process currentness.

~~~text
PROCESS CURRENT COORDINATE
  derives from rightful Work / process / evidence currentness

BOARDJOURNEY currentRef
  says what semantic board coordinate the current browser/session is traversing

PROCESS_CURRENT
!= BOARDJOURNEY_CURRENTREF
~~~

A human or AI may inspect a future node, go Back, or Revisit an earlier node without thereby moving the
actual Work/process lifecycle.

The useful composition is therefore:

~~~text
rightful current process coordinate
        +
ProcessFamily / BoardGraph topology
        |
        v
bounded process-horizon projection
        |
        +-> emphasize actual CURRENT node
        +-> show prior accepted result
        +-> show next earnable node / choices
        |
        v
BoardJourney may navigate the projected graph for inspection
without changing process truth
~~~

This preserves VexBoard's existing ownership boundary while reusing its accepted Journey mechanics.

The first implementation should therefore resist creating a second durable "current process position"
inside VexBoard. If a reusable horizon projector is later earned, it should consume current process truth
as input and remain read-only/effect-free.

## Current-process ownership seam — next earned contract

Pressure from the bounded-horizon projection exposes one unresolved owner that must be settled before UI code:

~~~text
Who owns the durable fact:
  "this process has earned scope S, node N, at layer L"?
~~~

Current owners do not answer that generic question:

~~~text
Workgraph
  owns Work lifecycle / containment / dependency truth
  != generic internal process-node position

Process Map
  owns reusable route discovery
  != current process state

VexBoard BoardJourney
  owns browser/session semantic traversal
  != durable process currentness

VexRelay forward-state
  owns Relay continuation state
  != generic process-family state
~~~

Therefore a bounded-horizon projector cannot safely mint its own current coordinate.

### Working owner hypothesis

The strongest current hypothesis follows the existing Family discipline:

~~~text
VexProcessFamily
  reusable process meaning / graph

VexProcessFamily.State          # working name
  current scope
  current node
  current layer
  previous State reference + last accepted transition/evidence required for continuity

incoming current observations
  Work / repository / provider / runtime / authority truth
  remain owned by their existing sources

VexBoard
  read-only projection of ProcessFamily meaning + supplied current State
~~~

This is a hypothesis to pressure-test, not a new schema in this PR.

The State should avoid copying mutable provider/source truth merely to make itself self-contained. It may
carry **references/expectations** needed for continuity while the next dependent Act re-observes live truth.

~~~text
PROCESS STATE
!= WORLD STATE DATABASE
~~~

### Name-ontology finding

Do not casually use \`ProcessInstance\` for this concept.

Current Vextreme-SDK source already uses \`processInstanceRef\` for concrete runtime process identity in
host/practicum execution. Reusing that spelling for a semantic process walk would create a cold-read
collision between:

~~~text
runtime OS/process identity
and
semantic process-family occupancy/currentness
~~~

Working vocabulary should therefore prefer Family/State or Walk/State language until a truer noun is
earned.

### Consequence for the next implementation node

The next node is **not yet "build the horizon UI."**

First establish the minimum current-process State contract well enough to answer:

1. which coordinate is durable versus merely projected;
2. what transition/evidence earns movement;
3. which accepted identities/evidence are carried;
4. which mutable truths are explicitly re-grounded;
5. how correction/refinement/currentness revisits change the coordinate;
6. how Workgraph currentness and ProcessFamily currentness refer to each other without becoming one owner;
7. how BoardJourney may inspect/revisit without mutating real process State.

Only then should a read-only bounded-horizon projector consume that State.

## Minimum current Process State — Family / Compound pressure

The accepted Family Circuit and Compound Relay foundations sharpen the working State hypothesis without
settling the exact future implementation composition.

### Direct Family law that carries

Current Direct Family establishes:

~~~text
incoming Family-owned cause
+ exact CURRENT semantic State
-> one serialized decision
-> next CURRENT semantic State
~~~

Already-reconciled outside truth does not become a fake Control. A rightful source/Connection reconciles
that truth and re-enters the Family's single StateRelay boundary.

For a future process family, the equivalent semantic requirement is:

~~~text
current process-owned truth
+ one admitted process cause
-> one process-owned transition decision
-> one next current process truth
~~~

The process owner must not derive its current node from a UI cursor, a stale predecessor snapshot, or an
executor's incidental fields.

### Compound law that carries

Current VexCompoundRelay establishes:

~~~text
independently observed inputs
+ exact CURRENT retained Compound State
-> one serialized processStates(...)
-> complete next InputState + OutputState relationship
-> one current-State commit
~~~

This is directly relevant because process movement may depend on independently owned truths such as:

~~~text
Work state
candidate/source identity
proof evidence
authority
provider currentness
runtime currentness
human decision / protected predicate
~~~

Those truths should not be copied wholesale into ProcessFamily State merely so one object "has everything."

### Minimum process-owned State meaning

The minimum current hypothesis is:

~~~text
ProcessFamily State
  current scope coordinate
  current process-node coordinate
  current layer
  last accepted transition / causal provenance
  accepted evidence references required to explain why this coordinate is earned
  carried stable identity references required for continuation

does NOT own
  live provider head
  live branch / PR state
  live authority snapshot
  repository currentness
  runtime/provider facts owned elsewhere
~~~

The exact field names and representation remain open.

Previous/current/next projection should be **derived** from:

~~~text
ProcessFamily definition / graph
+ CURRENT ProcessFamily State
+ current observations needed to evaluate reachable relationships
~~~

rather than storing "previous" and "next" as mutable linked-list pointers.

### Reconciliation boundary

A material round should conceptually look like:

~~~text
rightful external owners
-> fresh observations

fresh observations
+ CURRENT process-owned State
+ process graph / transition contract
-> reconcile

reconcile
-> either stay at current coordinate
-> or admit one next process State
-> or classify correction / recovery / currentness revisit
~~~

This resembles Compound current-State processing, while the semantic owner/transition discipline resembles
Direct Family.

The accepted architecture currently leaves exact future Family + Relay Single/Compound composition open.
This MetaWalk should preserve that openness:

~~~text
SEMANTIC PROCESS FAMILY MEANING
!= REQUIRED DIRECT-FAMILY IMPLEMENTATION

SEMANTIC PROCESS FAMILY MEANING
!= REQUIRED COMPOUND-RELAY IMPLEMENTATION
~~~

A later implementation should choose the smallest composition that preserves both laws.

### What should not be stored

The pressure walks reject several tempting conveniences:

~~~text
do not store full future-node content in current State
do not store BoardJourney cursor as process truth
do not copy live provider facts into durable State without ownership
do not store nextNode as truth when it can be derived from graph + current conditions
do not use iteration counters as semantic progression
do not use ProcessInstance naming where runtime processInstanceRef already means something else
~~~

This is enough to define the input contract for a future bounded-horizon projector without yet defining
that projector's wire schema.

## Pre-assurance continuity correction — current State must stay bounded

A002 repository proof passed, but a fresh builder-side semantic audit found one continuity defect before Independent Assurance:

~~~text
current implementation:
  every ProcessFamily.State copied transitionHistory from process entry

long-lived consequence:
  current State grows with every process movement
  fresh continuation implicitly carries the whole walk

intended architecture:
  CURRENT State stays bounded
  historical lineage remains recoverable by predecessor State references
~~~

This is a contract defect, not a repository-proof failure. A002 remains valid evidence for the exact pre-correction candidate; changing the State model creates a new immutable candidate that requires fresh affected proof.

The corrected current-State shape is:

~~~text
ProcessFamily.State
  stateRef
  familyRef
  scopeRef
  currentNodeRef
  layer
  previousStateRefOrNull
  lastAcceptedTransitionOrNull

lastAcceptedTransitionOrNull, when present:
  transitionRef
  relationshipRefOrNull
  fromLayer
  evidenceRefs
  carriedIdentityRefs
~~~

The State does **not** duplicate transition evidence/identity fields and owns no cumulative source/provenance bag.

Current evidence / identity provenance is:

~~~text
State.lastAcceptedTransitionOrNull?.evidenceRefs
State.lastAcceptedTransitionOrNull?.carriedIdentityRefs
~~~

Current movement semantics and node endpoints are derived from the Family relationship when `relationshipRefOrNull` is present. Current `toLayer` is `State.layer`.

Transition formation therefore behaves as:

~~~text
State N
+ admitted relationship / layer revisit
+ transition evidence
-> State N+1

where:
  State N+1.previousStateRefOrNull = State N.stateRef
  State N+1.lastAcceptedTransitionOrNull = compact accepted transition N -> N+1

  transition.evidenceRefs = current transition evidence
  transition.carriedIdentityRefs = current continuity identities
  transition.fromLayer = State N.layer

  relationship-backed:
    transition.relationshipRefOrNull -> Family relationship
    Family relationship owns movement class + node endpoints

  relationship-free layer change:
    transition.relationshipRefOrNull = null
    prior/current node is the same State coordinate
    State N+1.layer supplies toLayer

  older accepted history remains reachable through predecessor snapshots
~~~

Permanent:

~~~text
CURRENT_STATE != FULL_PROCESS_HISTORY
PREDECESSOR_LINEAGE != COPIED_HISTORY_ARRAY
COMPLETED_TRANSITION_EVIDENCE != PERMANENT_FOREGROUND_CONTEXT
~~~

This aligns the semantic State contract with VexWork's existing runtime persistence model:

~~~text
immutable State snapshots
-> predecessor/successor lineage
-> CURRENT points to validated tip
-> exact-current transition
~~~
## Historical Assurance checkpoint — bounded provenance correction (superseded)

Fresh Independent Assurance on exact head `95506489c3856ef416eeb6b9fc896669efd746d0` found intermediate State/projection defects involving accumulated `State.sourceRefs` and duplicated State evidence fields.

Those findings were valid for that historical candidate.

The later de-dup / consumer-reality corrections superseded the intermediate representation entirely:

~~~text
CURRENT State
  has no sourceRefs
  has no acceptedEvidenceRefs
  has no carriedIdentityRefs

current transition evidence / identities
  live once on lastAcceptedTransitionOrNull

dynamic bounded-horizon projector
  absent / held

ProcessFamily machine
  has no sourceRefs at Family / node / relationship scope
~~~

Historical references below to accumulated State source bags, duplicated State evidence fields, or dynamic CURRENT provenance derivation describe earlier candidates only.

Permanent current law:

~~~text
CURRENT_STATE != FULL_PROCESS_HISTORY
CURRENT_TRANSITION_PROVENANCE = LAST_ACCEPTED_TRANSITION_ONLY
HISTORICAL_CANDIDATE_SHAPE != CURRENT_SCHEMA
~~~

## Fresh Assurance CHANGES_REQUESTED — entry layer + movement-name closure

Fresh Independent Assurance on exact head `8341a6ace9e334417d44cdd58d13d4300e4e5d55` returned two valid findings:

1. raw `normalizeProcessState(...)` accepted a transitionless entry State whose node was the Family entry node but whose layer was any other declared Family layer;
2. the generic core still reserved and serialized the universal semantic name `LAYER_REVISIT` for relationship-free same-node layer movement.

Both findings are accepted and corrected structurally.

### Transitionless entry State

~~~text
lastAcceptedTransitionOrNull = null
-> previousStateRefOrNull = null
-> currentNodeRef = family.entryNodeRef
-> layer = family.entryLayer
-> no transition evidence/identity fields exist on State
~~~

The invariant is enforced by exported `normalizeProcessState(...)`, not only by `createProcessState(...)`, so a caller cannot forge a valid CURRENT entry State at a later Family layer.

### Relationship-free layer movement

~~~text
relationship-backed transition
  relationshipRefOrNull = <relationship>
  Family relationship owns:
    movementClass
    fromRef
    toRef

relationship-free same-node layer transition
  relationshipRefOrNull = null
  transition carries:
    fromLayer
  State supplies:
    currentNodeRef  # same semantic node
    layer           # toLayer
  no transition movementClass field is serialized
~~~

The core therefore owns the **structural mechanism** without owning one semantic movement name. If a Family independently wants the spelling `LAYER_REVISIT` for an ordinary declared relationship, that spelling is Family-owned and valid.

VexBoard renders a relationship-free layer transition from the structural coordinates, e.g. `Layer FORMATION → TOPOLOGY`, rather than inventing or serializing a semantic class.

Permanent:

~~~text
ENTRY_STATE = ENTRY_NODE + ENTRY_LAYER + EMPTY_TRANSITION_PROVENANCE
STRUCTURAL_LAYER_CHANGE != UNIVERSAL_MOVEMENT_ONTOLOGY
NULL_RELATIONSHIP_REF + SAME_NODE + CHANGED_LAYER = STRUCTURAL_LAYER_CHANGE
~~~
## Foundational helper audit — reject unearned semantics before acceptance

After the first Assurance rounds, the candidate was re-audited with a stricter question:

> Is each helper merely validating/projecting meaning declared by a rightful source, or is it quietly inventing reusable ontology because it is convenient?

That audit deliberately removed or corrected several things that had passed earlier tests.

### Entry State cannot invent continuity

~~~text
createProcessState(...)
  accepts:
    stateRef
    scopeRef

  derives:
    currentNodeRef = family.entryNodeRef
    layer = family.entryLayer

  requires:
    previousStateRefOrNull = null
    lastAcceptedTransitionOrNull = null

  therefore has no current transition evidence/identity provenance
~~~

Entry transition evidence, carried transition identities, and non-entry layer selection are not caller-authored options.

Every later transition must state its `carriedIdentityRefs` explicitly. The transition helper does not silently preserve old identities when the caller omits them.

### Family-owned vocabulary, not generic-core ontology

The generic ProcessFamily core does **not** own this MetaWalk's layer or relationship vocabulary.

Each Family declares:

~~~text
layers[]
entryLayer

movementClasses[]
forwardMovementClasses[]
~~~

For this MetaWalk:

~~~text
layers
  FORMATION
  TOPOLOGY
  OWNERSHIP
  CONTRACT
  IMPLEMENTATION
  FOCUSED_PROOF
  LIVED_INTEGRATION
  RECONCILE_ACCEPT

forward movement
  ADVANCES
  ENABLES
~~~

A relationship-free same-node layer change carries **no transition movement-class field at all**. The core derives its structural meaning from `relationshipRefOrNull = null`, the current node, and a changed Family-declared layer.

Permanent:

~~~text
PROCESS_FAMILY_LAYER != PROCESS_ATLAS_DEPTH_CLASS
ONE FAMILY'S MOVEMENT NAMES != UNIVERSAL PROCESS ONTOLOGY
~~~

### Current transition provenance is serialized once

An earlier intermediate State duplicated `acceptedEvidenceRefs` and `carriedIdentityRefs` from `lastAcceptedTransitionOrNull` and then needed equality guards to keep the two copies aligned.

Those duplicate State fields were removed.

~~~text
CURRENT evidence
  = lastAcceptedTransitionOrNull?.evidenceRefs

CURRENT carried identities
  = lastAcceptedTransitionOrNull?.carriedIdentityRefs

movement class
  = Family relationship selected by relationshipRefOrNull

transition node endpoints
  = Family relationship endpoints when relationship-backed
  = currentNodeRef when relationship-free same-node layer movement

toLayer
  = current State.layer
~~~

Only `fromLayer` remains on the compact transition because it is predecessor-side information that cannot be recovered from the current State without loading the predecessor snapshot.

~~~text
DERIVABLE CURRENT SEMANTICS != DUPLICATED TRANSITION/STATE FIELDS
~~~
### Current machine node schema is intentionally minimal

Earlier candidates promoted several conceptual/current-reading questions into mandatory node fields.

After the dynamic horizon runtime was held, those fields no longer had a present consumer and were removed.

The current node schema is exactly:

~~~text
nodeRef
label
~~~

Removed/held node metadata includes:

~~~text
purpose
currentTruthRefs
ownerRefs
readingSourceRefs
considerationRefs
proofRefs
entryPredicateRefs          # relationship owns movement admission instead
authorityRefs
exitPredicateRefs
heldConcernRefs
sourceRefs
~~~

The broader prose questions remain useful **design questions**, but they are not frozen into the current machine wire schema without a consumer.

~~~text
USEFUL QUESTION
!= EARNED MACHINE FIELD
~~~

### Fresh Assurance CHANGES_REQUESTED — provenance construction + consumer reality

Fresh Independent Assurance on exact head `125aa59eadab14ea90bbaf23523439c54ad98bf4` returned three valid findings:

1. the dynamic projector's provenance de-dup helper could conceal repeated semantic inputs before VexBoard's duplicate-ref invariant saw them;
2. the exported dynamic bounded-horizon projector had no real non-test executable consumer;
3. this canonical document's readability-audit section itself contained literal `\\n` escape text instead of real Markdown structure.

The correction chooses the smaller architecture:

~~~text
unconsumed dynamic projector
-> remove / hold

projector-only provenance builder
-> removed with projector

orphaned core horizon runtime
-> remove / hold

canonical readability record
-> restore real Markdown structure
~~~

No replacement projector or fake consumer is introduced.

### Readability / perception audit after A008

After A008 SourceOwner proof, the builder performed one read-only fresh-instance audit before Assurance, specifically to catch code that passes but tells the wrong ownership story.

That audit first removed three unconsumed horizon fields:

~~~text
nextAvailableRelationshipRefs
  duplicated nextCandidates[].available

effects = false
executionAuthority = NONE
  had no consumer
  incorrectly suggested the read-only horizon was an effect/authority owner
~~~

Fresh Independent Assurance then established the stronger boundary: the dynamic bounded-horizon VexBoard projector itself had no real non-test executable consumer.

Therefore the current candidate does **not** retain that projector merely because it was already written and tested.

~~~text
TEST-ONLY CONSUMER
!= EARNED RUNTIME CONSUMER

UNCONSUMED RUNTIME HELPER
-> HOLD / REMOVE
~~~

The dynamic projector and the core horizon-only runtime helpers are held until a real State-bearing consumer exists.

### Dead helper + unconsumed Family purpose were removed

Fresh Independent Assurance on exact head `72f28bacf122e5ca8fe8dbb73a16089fac6b4a1a` found two additional pieces of unearned generic surface:

1. internal `unionRefs(...)` had no call site;
2. top-level `ProcessFamily.purpose` was mandatory but had no current semantic or projection consumer.

Both are removed.

~~~text
dead unexported helper + no caller
-> delete helper

top-level machine field + no consumer
-> delete field from vexwork.process-family/v1 candidate
-> reject reintroduction as schema drift
~~~

The later consumer-reality audit removed node `purpose` as well after the dynamic horizon runtime was held and no present consumer remained.

The overall human/process outcome and node explanations remain available from Work/project/canonical prose and the checked-in board labels rather than being duplicated into unconsumed generic machine fields.

~~~text
HUMAN / WORK OUTCOME
!= UNUSED GENERIC MACHINE FIELD

NODE LABEL
  current semantic projection identity

NODE PURPOSE
  held until a real consumer earns it
~~~
### Historical provenance intermediate — superseded

An intermediate correction moved duplicated node/relationship provenance to `ProcessFamily.sourceRefs`.

That was valid pressure at the time, but the only real consumer of Family-level source provenance was the dynamic horizon projector.

Once that runtime was held, Family-level `sourceRefs` also became unconsumed and was removed.

Current machine contract:

~~~text
ProcessFamily
  no sourceRefs

node
  no sourceRefs

relationship
  no sourceRefs
~~~

VexBoard graph `sourceRefs` remain valid **VexBoard projection provenance**. They are owned by the board artifact/model and are not shadow ProcessFamily machine fields.

The conceptual bounded-reading law also remains design pressure, but the current machine node has no `readingSourceRefs` field until a real reading-scope consumer exists.

~~~text
PROCESS_FAMILY_MACHINE_PROVENANCE_FIELD
  absent

VEXBOARD_PROJECTION_PROVENANCE
  current in checked-in board artifact

BOUNDED READ-NOW CONTRACT
  held until consumer exists
~~~

### Historical projector lesson — FURTHER route semantics (runtime held)

The removed dynamic projector originally treated every node outside PREVIOUS/CURRENT/NEXT as "further", which could relabel completed history as future.

The corrected design lesson, retained for any future consumer, is:

~~~text
FURTHER
= reachable from CURRENT through Family-declared forwardMovementClasses
  minus PREVIOUS / CURRENT / direct NEXT

feedback / correction relationships
= visible as direct alternatives when adjacent
!= farther-forward route

completed earlier nodes
!= future simply because they are not in the local three-slot neighborhood
~~~

### Process topology must be reachable

Every ProcessFamily node must be reachable from `entryNodeRef` through declared relationships.

An orphan node is invalid rather than a hidden future destination with no lawful route.

### VexBoard projection does not own currentness

The checked-in full-map board is a **source-bound, source-registered projection artifact**.

It declares:

~~~text
derivedFromRefOrNull = process-family.vexwork.metawalk
~~~

and focused source proof checks semantic node labels, relationship endpoints, relationship labels, and forward-vs-correction projection kind against the machine Family.

However, at this exact candidate the ordinary VexBoard runtime has no default entry path that supplies:

~~~text
board.vexwork.process-family-metawalk
~~~

The generic catalog loader can open it if that exact ref is supplied, but catalog registration alone does not establish executable consumption.

~~~text
SOURCE-REGISTERED / ADDRESSABLE
!= CURRENT EXECUTABLE CONSUMER
~~~

Therefore executable consumption of this board is **held**, just like the removed dynamic horizon runtime. No UI route is invented merely to justify the artifact.

VexBoard remains projection/perception and never becomes the ProcessFamily current-State owner.

### Cross-snapshot lineage validation is deliberately held

A single current State can validate:

~~~text
its own shape
its predecessor State ref shape
its last transition shape
its current node/layer
its exact current evidence/identity set
~~~

It cannot prove, without reading the predecessor snapshot, that:

~~~text
current.previousStateRefOrNull == actual previous.stateRef
current.lastAcceptedTransition.fromLayer == actual previous.layer

if current.lastAcceptedTransition.relationshipRefOrNull != null:
  Family relationship.fromRef == actual previous.currentNodeRef

if relationshipRefOrNull == null:
  current.currentNodeRef == actual previous.currentNodeRef
~~~

No persistent ProcessFamily runtime consumes that pair yet.

Therefore this formation does **not** add a speculative generic successor-store/lineage helper merely because one might be useful later. When a persistent runtime is earned, that consumer must validate predecessor/current continuity using both exact snapshots and the accepted runtime-persistence law.

~~~text
LOCAL STATE VALIDATION != WHOLE LINEAGE PROOF
NO CURRENT CONSUMER != LICENSE TO MINT UNUSED FOUNDATION
~~~

## Historical evidence versus current schema

The A00x / Assurance sections below preserve the causal record of defects found and corrected.

They are **not cumulative schema law**.

~~~text
CURRENT architecture section
  owns current candidate truth

historical A00x section
  owns evidence about that historical candidate only

historical field/runtime mention
  != current field/runtime existence
~~~

A cold reader should not need to reconstruct commit chronology to know what exists now.

## Machine-readable source / live-state persistence boundary

The first pressure walks have now earned a small machine-readable ProcessFamily source:

~~~text
docs/process/VEX-PROCESS-FAMILY-METAWALK.json
  schema = vexwork.process-family/v1
  familyRef = process-family.vexwork.metawalk
  nodes = 10
  relationships = 13
  layers = Family-owned
  movementClasses = Family-owned
  forwardMovementClasses = Family-owned
~~~

The source contract is implemented by:

~~~text
src/shared/vex-process-family.mjs

normalizeProcessFamily(...)
normalizeProcessState(...)
createProcessState(...)
admitProcessTransition(...)
~~~

The current State contract owns only:

~~~text
stateRef
familyRef
scopeRef
currentNodeRef
layer
previousStateRefOrNull
lastAcceptedTransitionOrNull
~~~

`lastAcceptedTransitionOrNull` owns the current transition evidence/identity provenance once.

It does **not** duplicate evidence/identity bags and does not own a cumulative source/provenance bag.

The current machine Family also owns no generic `sourceRefs` or read-now metadata fields. Projection provenance remains in the checked-in VexBoard artifact; dynamic current-reading grounding remains held until a real consumer earns that contract.

Exact-key validation intentionally rejects ad-hoc provider/repository fields. Mutable world truth remains owned by its rightful source and is re-grounded before a dependent next effect.

The machine definition is the semantic owner of the MetaWalk topology. The checked-in VexBoard full-map artifact declares:

~~~text
derivedFromRefOrNull = process-family.vexwork.metawalk
~~~

and its VexBoard-owned sourceRefs descend to the machine definition. This establishes source binding, not current runtime consumption.

~~~text
PROCESS FAMILY DEFINITION
-> VEXBOARD FULL-MAP PROJECTION

not

BOARD DRAWING
-> IMPLICIT PROCESS LAW
~~~

### Dynamic bounded horizon is held until a real consumer exists

An earlier candidate formed:

~~~text
src/shared/vexboard-process-horizon.mjs
projectProcessHorizonBoard(...)
projectProcessHorizon(...)
availableProcessRelationships(...)
~~~

Fresh Independent Assurance found that the exported dynamic projector had **no non-test executable consumer** at the exact candidate tree. The discoverable VexBoard surface consumed the checked-in static board instead.

Because tests alone do not earn runtime architecture, the current candidate removes/holds that dynamic path.

~~~text
CURRENT
  ProcessFamily definition / State / transition core
  checked-in VexBoard full-map projection
  source-catalog discovery

HELD
  State -> bounded VexBoard horizon runtime
  outgoing-availability projection helper
  future-only FURTHER projection runtime
~~~

The conceptual bounded-reading law remains valid design pressure:

~~~text
CURRENT may deep-read earned context
FUTURE remains addressable without automatic deep-reading
~~~

But no runtime helper is claimed until a real consumer needs that contract.

### Focused semantic proof checkpoint

After removing the unconsumed horizon runtime, the surviving exact focused suite is:

~~~text
exact test file logic          20 / 20 PASS
machine ProcessFamily          PASS
scope x node x layer walk      PASS
transition admission           FAIL-CLOSED
Family-local vocabulary        PASS
compact State lineage          PASS
full-map Family lineage        PASS
source-catalog addressability  PASS
object-local provenance        REJECTED
unused Family purpose          REJECTED
~~~

The reduction from 27 tests to 20 is intentional. Seven tests existed only to exercise the now-held dynamic horizon runtime. They were removed rather than retained as self-justifying coverage.

~~~text
FEWER TESTS + SMALLER CURRENT SURFACE
> MORE TESTS PROTECTING UNUSED RUNTIME CODE
~~~

### Repository-integration pressure

The candidate has now been checked against VexWork's deterministic repository floor shape.

~~~text
package.json
  npm test   = node --test
  npm review = test coverage
               + source-coverage floor
               + Workgraph checks
               + foundation check
               + dashboard/workspace generated-currentness checks
~~~

The focused test is therefore automatically part of ordinary Node test discovery; no custom test runner or hidden script is required.

The remaining new shared ProcessFamily module is inside the accepted source-coverage policy:

~~~text
sourcePolicy = src/**/*.mjs + *-reader.js

minimum aggregate coverage:
  lines      96%
  branches   84%
  functions  96%
~~~

Because the accepted branch floor has little headroom, the focused suite was expanded only around real fail-closed architecture boundaries rather than synthetic percentage padding:

~~~text
20 / 20 exact-test logic PASS

current boundaries exercised:
  invalid Family schema
  duplicate / missing topology identity
  invalid movement class
  foreign Family State
  invalid layer
  corrupted transition provenance
  unknown relationship
  empty transition evidence
  no-op relationship-free layer change
  object-local provenance reintroduction
  unconsumed Family-purpose reintroduction
~~~

Coverage **percentage** remains a repository-runtime predicate. The connected V8 proof establishes the exact test logic, not Node's LCOV accounting.

~~~text
TEST DISCOVERY SHAPE          = CLEAR
SOURCE COVERAGE APPLICABILITY = CLEAR
CONNECTED V8 TEST LOGIC       = 20 / 20 PASS
NODE LCOV / AGGREGATE FLOOR   = REQUIRES FRESH CURRENT-HEAD SOURCEOWNER
FULL npm run review           = REQUIRES FRESH CURRENT-HEAD SOURCEOWNER
~~~

Browser/runtime integration for a dynamic bounded horizon is intentionally **not claimed** because that runtime is held. The current VexBoard surface remains the checked-in board discovered through the existing source catalog.

The shared VexBoard source-catalog path has no other open-PR claim at this checkpoint. PR #187 remains separate on Process Registry / Process Map tests only.
### Source definition versus live current State

VexWork's accepted runtime-persistence law already establishes the right storage distinction:

~~~text
SOURCE_DEFINITION != LIVE_RUNTIME_STATE
~~~

Therefore this formation does not commit a live ProcessFamily State file and pretend Git is a high-frequency runtime store.

Current position semantics are public-safe source. A future persistent consumer may earn a private runtime realization analogous to VexWork's existing pattern:

~~~text
lawful ProcessFamily State
-> immutable snapshot
-> retained successor-pointer lineage
-> CURRENT = validated tip
-> exact-current transition
-> restart / read-back
~~~

That runtime is held until a real consumer requires persistence. The current in-memory semantic core is enough to pressure the State and projection contracts without manufacturing storage ceremony.

Permanent:

~~~text
PROCESS_FAMILY_DEFINITION != LIVE_PROCESS_STATE
PROCESS_STATE_SEMANTICS != RUNTIME_STORE
VEXBOARD_PROJECTION != CURRENT_POINTER
GIT_COMMIT != HIGH_FREQUENCY_PROCESS_CURRENTNESS
~~~

### Process Factory / Process Atlas non-collapse

Current Vextreme-SDK pressure also confirms that this source is not replacing existing process infrastructure.

~~~text
SDK Process Factory
  machine-readable purpose / inputs / preconditions / steps /
  stop conditions / result / next-route law
  -> exact executable or operational process definition

SDK Process Atlas
  nodes / edges / depth classes / local process states /
  freshness / lenses / sources / evidence
  -> atlas and projection semantics

VexProcessFamily candidate
  reusable semantic process traversal + one current process coordinate
  -> generic scope x node x layer movement
~~~

Process Factory's current repository task already says its next route is consumed only after RETURN verification and live re-grounding, reinforcing rather than replacing the ProcessFamily currentness law.
## Fresh-instance resume packet

A future projection should be able to give a fresh instance only the bounded packet needed now:

~~~text
ORIGINAL OUTCOME

SCOPE POSITION
  previous / current / next scope when meaningful

PROCESS POSITION
  previous accepted node/result
  CURRENT node
  next earnable node + entry predicate

LAYER
  current lens

CURRENT QUESTION

CURRENT TRUTHS
  only those needed for this node

READ NOW
  bounded sourceRefs

AUTHORITY / EFFECT MEMBRANE

CURRENT PROOF CONTRACT

DO NOT SOLVE YET

LAST ACCEPTED EVIDENCE

NEXT IF SATISFIED
~~~

Historical reasoning and deeper future source remain recoverable rather than permanently foregrounded.

## First formation acceptance

This first source is useful if a cold reader can correctly recover:

1. why Process Family meaning is distinct from Workgraph, Process Map, VexBoard and executors;
2. scope / process-node / layer as independent coordinates;
3. graph-backed truth versus previous/current/next horizon projection;
4. the node contract required for fresh-instance continuation;
5. the difference between layer/refinement/correction/currentness revisits;
6. round-completion reconciliation before the next Act;
7. how process relationships can pressure Work decomposition and test selection;
8. why future nodes remain addressable without automatically becoming reading scope;
9. how VexBoard can project the walk without owning currentness;
10. why VexRelay is a patient zero rather than the owner of the generic process model.

## Next earned walk

Do **not** promote this candidate into a universal schema merely because the first map is readable.

Next pressure should walk the shape against:

~~~text
A. one real VexRelay recipe trajectory
   especially exact-head SourceOwner -> Assurance -> integration currentness

B. one real implementation feature trajectory
   semantic contract -> Connection/runtime -> presentation -> proof
~~~

Use those walks to discover:

~~~text
which node fields are actually reusable
which relationship kinds survive
which names cold-read correctly
which currentness transitions need machine structure
which parts belong only in projection
~~~

Only after that pressure should Process Registry promotion, the pink VexWork Onboarding projection, or a stronger machine-readable ProcessFamily schema be considered earned.

## Current formation boundary

This candidate changes only the ProcessFamily machine contract, architecture guidance, the checked-in source-addressable VexBoard map/catalog entry, and their focused tests. Dynamic effect-free horizon projection code is not current candidate surface.

It does not mutate:

~~~text
Vextreme-SDK Relay runtime
VexLife-Android Family Circuit
Vextreme product source
Workgraph lifecycle
Process Registry
public VexWork onboarding UI
~~~

The current Process Registry remains separately occupied by VexWork PR #187. This formation therefore does not widen or collide with that active source membrane.

<!-- [VXG RealForever][VEXWORK][VEXPROCESSFAMILY][METAWALK][FORMATION] -->
