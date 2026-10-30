# Vex Process Family MetaWalk — Formation Candidate

[VXG RealForever]

## Status

This source is a **formation candidate**, not a frozen ontology.

Working names such as **VexProcessFamily**, **MetaWalk**, **process node**, **depth**, and the relationship labels below are allowed to change when pressure-testing finds a truer boundary. The durable claim in this first formation is the relationship shape, not the spelling.

This source intentionally forms the reusable process shape before Process Registry promotion, public onboarding UI, or VexRelay runtime mutation.

~~~text
SHAPE FIRST
-> WALK IT
-> PRESSURE-TEST RELATIONSHIPS
-> THEN PROMOTE THE PARTS THAT SURVIVE
~~~

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

### Depth

Through what lens are we currently touching the process shape?

Working depth vocabulary:

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

Depth is not a mandatory universal checklist. A simple change may not earn every depth. A real feature may move backward when downstream evidence exposes an upstream gap.

~~~text
SAME NODE + DIFFERENT DEPTH
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

Working relationship classes:

~~~text
ADVANCES
  accepted truth makes a later node meaningfully reachable

ENABLES
  a larger scope/feature creates a capability required by another scope/feature

REFINES
  later pressure adds precision without invalidating the prior owner/truth

CONTRACT_GAP
  downstream evidence shows an upstream contract is incomplete or wrong

IMPLEMENTATION_DEFECT
  contract remains valid; target realization must be corrected

CURRENTNESS_CHANGED
  architecture remains valid; mutable external truth must be re-observed

RECOVERS
  a failed/interrupted round returns to a lawful process coordinate without replaying completed effects
~~~

Names remain candidates. The requirement is to preserve **why** traversal moved, not merely that an arrow exists.

## Revisit semantics

Iteration count alone is too lossy. Revisiting work should preserve the causal class.

### Depth revisit

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

A later proof depth may touch a node established at an earlier depth without implying that earlier work failed.

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

DEPTH

formation / topology / ownership / contract /
implementation / focused proof / lived proof / reconcile
~~~

A useful reorientation coordinate may therefore be described as:

~~~text
current scope
x current process node
x current depth
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

### Feature Walk is a depth revisit, not production reimplementation

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
+ later proof / traceability depth
!= production behavior rewrite
~~~

The process model therefore should be able to say:

~~~text
scope = ThemeMode production realization
node  = lived / installed human walk
depth = proof / traceability
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
3. **depth revisit is real** — Feature Walk proof can revisit accepted production meaning without
   re-authoring it;
4. **process decomposition should follow truth dependencies** — ThemeMode UI became simpler because
   Family and display contracts were established before the target leaf consumed them;
5. **tests are relationship-specific** — semantic Family tests, session/action routing tests,
   presentation tests, persistence tests and Journey proof each answer different questions;
6. **adjacent reusable refinement remains separately owned** even when one feature walk discovers it.

No fourth coordinate is earned by this specimen. Scope × process node × depth remains sufficient for the
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

DEPTH
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
2. scope / process-node / depth as independent coordinates;
3. graph-backed truth versus previous/current/next horizon projection;
4. the node contract required for fresh-instance continuation;
5. the difference between depth/refinement/correction/currentness revisits;
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

This candidate changes only VexWork/VexBoard architecture guidance and its read-only map/test surface.

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
