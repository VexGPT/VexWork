# VexBoard — Semantic Canvas Project

`[VXG RealForever]`

## Current formation status

```text
human outcome                         APPROVED_FOR_PROJECT_FORMATION
project architecture source           CURRENT
canonical Project / Workgraph entry   CURRENT
public Projects projection            CURRENT
BoardGraph                            COMPLETED
Canvas Projection                     COMPLETED
BoardJourney + simulation             COMPLETED
animated semantic traversal           ACCEPTED / PR #98 MERGED
BoardPatch                            READY / NO_AUTHORITY / NO_EFFECTS
Source Projectors                     RUNNING / AUTHORIZED_BOUNDED / EFFECTS_BOUND
VexBoard root                         DECOMPOSED
```

This source preserves the VexBoard product intention and architecture across implementation phases. The Project is canonically formed through `project.json`, its Work Board view, a bounded Workgraph decomposition, the Project Registry, and the generated public workspace. BoardGraph, Canvas Projection, BoardJourney and same-board prototype simulation are accepted implementation foundations; PR #98 adds presentation-only animated semantic focus without changing Journey truth. PR #100 currentized those completed foundations into canonical VexWork truth. PR #108 then landed the first bounded read-only Source Projectors implementation, and PR #109 currentized that broader Work item to RUNNING / AUTHORIZED_BOUNDED / EFFECTS_BOUND while keeping lived comparison, evidence presentation, federation, and broader source families unfinished. BoardPatch remains dependency-ready with NO_AUTHORITY / NO_EFFECTS. This architecture source explains that state; it does not own or advance lifecycle truth.

```text
PRESERVE_THE_PROJECT_NOW
!=
PRETEND_CANONICAL_REGISTRATION_ALREADY_HAPPENED
```

### Consumed BoardGraph implementation admission

The first bounded implementation grant is complete and remains useful as historical scope:

```text
workRef = work.vexboard.boardgraph-contract
authority = AUTHORIZED_BOUNDED
effects = EFFECTS_BOUND
state = COMPLETED

nextWorkRef = work.vexboard.canvas-projection
nextState = READY
nextAuthority = NO_AUTHORITY
nextEffects = NO_EFFECTS

initial implementation membrane
  src/shared/vexboard-model.mjs
  src/core/vexboard.mjs
  vexboard-reader.js
  vexboard/index.html
  vexboard/self-map.json
  test/vexboard.test.mjs
  test/vexboard-ui.test.mjs
  index.html
  test/public-ui.test.mjs
  projects/vexboard/README.md
  VexBoard-owned Workgraph/project projections required to keep work truth current
```

This consumed admission came from Victor's explicit instruction to begin the actual VexBoard work after
the completion-state architecture was mapped. It authorized and completed the BoardGraph/shared-Control
foundation in VexWork. Its scope does not flow into Canvas Projection, and it never granted source
authority in VexLife, Vextreme, Vextreme-Assets or other projected repositories.

```text
VEXBOARD_IMPLEMENTATION_AUTHORITY
!=
TARGET_REPOSITORY_AUTHORITY

BOARDGRAPH_COMPLETION
!=
CANVAS_IMPLEMENTATION_AUTHORITY

READY
!=
AUTHORIZED
```

## Current priority ladder — VexStream screenshot patient zero

The current foreground is no longer another abstract screenshot design exercise. The first real screenshot/evidence consumer is a bounded VexStream patient zero:

```text
CURRENT / IMMEDIATE
work.vexboard.vexstream-screenshot-pilot
-> Victor supplies a small ordered set of real VexStream Music screenshots
-> initial scenario: connect a phone to a desktop for VexStream Music use
-> VexBoard maps visible observations into proposed semantic correspondences
-> accepted process meaning remains separate from screenshot pixels
-> exercise BoardGraph + BoardProjection + BoardJourney + evidence presentation together

NEAR TERM
-> use the lived pilot to decide which screenshot/evidence behaviors actually repeat
-> test evidence-rail/sidebar as the scalable default
-> test optional canvas pinning as a projection-local convenience
-> only then stabilize reusable image-region / evidence coordinates that the pilot genuinely earns

LATER / CAPTURED
work.vexboard.later.businessfactory-guided-company-formation
-> after screenshot/evidence mapping and reusable templates are stable
-> after BusinessFactory business structure, patterns, processes and end-to-end journeys are sufficiently mapped
-> use the combined substrate as a graduation scenario:
   guide a person from zero through creating a company
   preserve user data, screenshots, documents and assets with their rightful owners
   ask for protected registration/provider actions only when genuinely human-bound
```

The VexStream pilot owns **the mapping experiment**, not VexStream product truth:

```text
VEXSTREAM_SCREENSHOT_PILOT != VEXSTREAM_PRODUCT_OWNER
SCREENSHOT != PROCESS_TRUTH
VISIBLE_REGION != SEMANTIC_IDENTITY
PROPOSED_MAPPING != ACCEPTED_MAPPING
EVIDENCE_RAIL != REQUIRED_FINAL_UI
PIN_TO_CANVAS != SEMANTIC_REPARENT
```

The current presentation hypothesis is intentionally provisional:

```text
many screenshots
-> evidence rail / inspector as ordinary scalable home

one screenshot needs spatial comparison
-> optional projection-local pin near the implicated node

pilot evidence
-> decide whether those behaviors deserve a reusable contract
```

Do not introduce a universal OCR ontology, screenshot-hotspot registry, image-specific node typology, or BusinessFactory onboarding framework merely to complete this pilot.

The eventual "start a business from the beginning" experience is strategically important, but it is **not current implementation scope or authority**. It is preserved now so future work can see the intended graduation path without pulling that complexity into the screenshot patient zero.

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

## Foundation correction — one shared human / AI board toolkit

The first proving ground should exercise the reusable **board operations themselves**, rather than
waiting until a later rich-editor phase to discover whether humans and AI can manipulate the same
canvas truth.

"AI-first" therefore does **not** mean "AI-only." The durable requirement is:

```text
human toolbar gesture ---------\
                                +-> one typed Board Control
AI board function call --------/        |
                                         v
                          resolve against CURRENT
                          BoardGraph + BoardProjection
                                         |
                                         v
                                   Board Act
                                         |
                         +---------------+---------------+
                         |                               |
                         v                               v
                    BoardPatch                    ProjectionPatch
                 semantic meaning              spatial presentation
                         |                               |
                         +---------------+---------------+
                                         v
                              validated next state
```

This follows architectural lessons already proven elsewhere in the Vex family without importing
their implementation as VexBoard ownership:

- VexLife-Android SCAE keeps **current truth, stable Control, resolved Act and Effect** distinct.
- Convergence Relay combines independently-owned current truths into explicit relationship truth
  without flattening the participants into one mega-State.
- VexLife Atlas / Process Factory uses stable refs, thin bounded projections and typed
  `functionRef + arguments + dependencies` rather than requiring the model to ingest an entire
  world before acting.

Those are lineage patterns, not VexBoard runtime dependencies. The first VexBoard implementation
must earn its own smallest vocabulary from the proving ground.

### Shared Board Control surface

The exact schema and names remain provisional, but the first toolkit should be capable of expressing
the same operation whether it originates from a toolbar, keyboard/pointer interaction, test fixture
or AI function call.

The initial operation families should cover roughly:

```text
CREATE
  create semantic object + its first projection item

ARRANGE
  move
  resize
  set layer / front / back

CONTAIN
  explicitly nest / unnest semantic meaning

CONNECT
  create or change one explicit relationship

PRESENT
  choose projection shape / frame treatment
  apply bounded visual treatment

NAVIGATE
  select / focus
  enter / return
  expand / collapse

EXCHANGE
  export deterministic board snapshot
  query a bounded board neighborhood
  reload / compare a snapshot
```

The semantic resolver decides what an operation means from current truth. A human drag and an AI
request must not bypass into different mutation models.

Permanent:

```text
BOARD_CONTROL != BOARD_ACT
BOARD_GRAPH_PATCH != PROJECTION_PATCH

MOVE_OR_RESIZE != SEMANTIC_REPARENT
VISUAL_OVERLAP != SEMANTIC_CONTAINMENT
Z_ORDER != SEMANTIC_PRIORITY
SHAPE_KIND != NODE_KIND

HUMAN_TOOLBAR_ACTION
AND AI_FUNCTION_CALL
-> SAME_CONTROL_CONTRACT
```

### Projection geometry is addressable, but it is not semantic identity

BoardProjection should intentionally carry enough spatial information for a board to round-trip and
for AI to perceive the current map:

```text
projectionItemRef
semanticRef
bounds
  x
  y
  width
  height
layer / z-order
optional parent projection/frame ref
visibility / expansion state
layout intent / constraints where earned
```

Coordinates are useful current projection truth. They are not BoardGraph identity.

One formation reference supplied from Lucidspark demonstrated why this separation matters: its CSV
projection preserved object kinds, stable shape IDs, text and explicit `Contained By` relationships,
while the exported table did not carry enough x/y/size/layer geometry to reconstruct the visible
canvas by itself. VexBoard should improve that boundary rather than copy it.

```text
EXPORTABLE_OBJECT_LEDGER
!=
FULL_FIDELITY_BOARD_SNAPSHOT
```

A VexBoard snapshot should therefore be able to preserve both:

```text
BoardGraph
  stable semantic topology

BoardProjection
  exact current spatial realization
```

and a model-facing bounded query should be able to return a small Atlas-like neighborhood around
selected refs instead of serializing the entire board into every conversation.

### First interactive proving ground

Before the authored website patient zero grows into a full prototype, establish a deliberately small
blank-canvas proof:

```text
blank scalable canvas
-> create a few primitive visual forms
-> select
-> move
-> resize
-> layer front/back
-> explicitly nest one object in a container/frame
-> connect two objects
-> export snapshot
-> reload snapshot
-> same stable refs + semantic relationships + projection geometry
```

At least one equivalent board mutation sequence should be driven through the human toolbar and
through the AI/tool-call surface and converge on the same validated meaning.

The first toolbar should expose only the toolkit families actually implemented. A useful early
grouping is:

```text
CREATE      shape / text / frame / connector
ARRANGE     move / resize / layer / explicit containment
MEANING     semantic kind / relationship / portal when earned
NAVIGATE    select / focus / enter / expand / collapse
EXCHANGE    export / import / bounded AI query
```

This is a proving ground, not a commitment to clone another product's toolbar or ship a complete
manual visual editor before the semantic contracts are understood.

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

## VexBoard naming, ontology and typologies

VexBoard needs names that stay understandable across human discussion, source projection, process maps,
target realizations and machine contracts. The durable coordinate is therefore **identity**, not whichever
name happens to be visible in one form.

The current model already carries several distinct coordinates:

```text
boardRef
  one stable board identity

nodeRef / semanticRef
  one stable semantic-object identity

relationshipRef
  one stable semantic relationship identity

projectionRef / projectionItemRef
  one projection and one situated occurrence of semantic meaning

label
  human-readable wording in this BoardGraph

kind
  compact machine discriminator / type member

shapeKind + layoutIntent + bounds + layer
  current projection form

sourceRefs
  provenance / route toward the rightful source owner
```

Permanent naming law:

```text
IDENTITY != NAME
IDENTITY != LABEL
IDENTITY != TYPE
IDENTITY != ROLE
IDENTITY != FORM

RENAME != REIDENTIFY
SAME_LABEL != SAME_IDENTITY
SAME_IDENTITY -> MAY_HAVE_DIFFERENT_BOUNDARY_NAMES_AND_FORMS
```

A source owner may also have its own canonical human name, short name, aliases, code symbols,
serialized names or provider-native identifiers. VexBoard may project those when useful, but it should
not collapse them into a new VexBoard identity or infer equivalence from matching strings.

Conversely, preserving identity does not make every boundary rename harmless. A change to a persisted,
serialized, provider-native or otherwise contract-bearing name may require target-specific migration
or compatibility proof while the semantic identity remains continuous.

Conceptually:

```text
stable semantic identity
        |
        +-> source-owner canonical name
        +-> human short label
        +-> retrieval alias
        +-> implementation-local symbol
        +-> wire / serialized name
        +-> provider-native identifier
        +-> VexBoard projection label
```

These are **naming coordinates around an identity**, not peers that compete to become identity.

This aligns with the wider Vex lineage:

- Meaning-addressable architecture keeps the canonical subject identity while adding human meaning,
  short names and aliases as bounded routes;
- Semantic Assortment keeps one canonical object while occurrences, relationships and projections
  remain separately typed;
- VexLife-Android names according to the boundary rather than globally normalizing Kotlin symbols,
  semantic refs, Android resources, persisted schema names and external/wire names.

VexBoard should consume those lessons without becoming their new canonical owner.

### Ontology and typologies

The accepted wire contracts use the compact field name `kind` as a discriminator. That is useful
machine syntax, but it is too generic to be the conceptual address humans and fresh AI instances use
when the system grows.

Use this language when explaining the model:

```text
VexBoard ontology
  the conceptual families that may exist and relate

Node typology
  node.kind
  -> SCENE | CONTROL | PROCESS | DECISION | ARTIFACT |
     CONTAINER | PORTAL | REFERENCE | ANNOTATION

Relationship typology
  relationship.kind
  -> FLOW | TRANSITION | DATA | REFERENCE

Interaction typology
  interaction/action discriminator
  -> the admitted prototype interaction and simulated-action vocabulary

Projection typology
  visual form / shape + layout intent
  -> how meaning appears here, not what it means
```

So the ordinary human projection should prefer:

```text
Name / label
Stable identity
Represents / node type
Relationship family
Contextual role
Current state
Visual form
Source / owner
```

rather than asking a person to reason from a bare label such as `Kind: PROCESS`.

This is a terminology/projection boundary, **not a wire-schema migration**. The current fields remain
valid and stable until repeated implementation pressure earns an actual schema change.

```text
KIND_FIELD = MACHINE_DISCRIMINATOR
TYPOLOGY = CLASSIFICATION_DIMENSION
TYPE = ONE_MEMBER_OF_THAT_TYPOLOGY
ROLE = CONTEXTUAL_FUNCTION
STATE = WHAT_IS_CURRENTLY_TRUE
FORM = HOW_IT_APPEARS
NAME = BOUNDARY-SPECIFIC HUMAN_OR_MACHINE REPRESENTATION
IDENTITY = STABLE_COORDINATE
```

When mapping one semantic object into another platform or process projection, preserve the identity
relationship explicitly. Do not require the Android symbol, web identifier, process label and Board
label to be spelled the same in order to prove they represent the same accepted meaning.

## Federated totality — modular boards, not one mega-map

A useful “totality process map” should not mean one enormous BoardGraph that every domain and perspective must load at once.

The scalable target is:

```text
many small source-owned boards / projections
        |
        | stable boardRef + source refs
        v
board source registry / resolver
        |
        +-> resolve one requested board
        +-> resolve a PORTAL/detailBoardRef target
        +-> optionally resolve its prototype/presentation companions
        v
VexBoard
        |
        +-> render one bounded projection
        +-> preserve BoardJourney
        +-> enter another board
        +-> return without losing the explicit interaction path
```

The current `VEXBOARD_BUILTIN_BOARD_URLS` / prototype maps are a good proving-ground realization for a few local boards. They are not the long-term catalog for hundreds of reusable business, development, education, provider, architecture or operational process modules.

The repeated built-in-board and VexWork process pressure has now earned the first bounded resolver contract:

~~~text
vexboard.board-source-catalog/v1
  catalogRef
  entries[]
    boardRef
    location
    sourceRefs
  sourceRefs

vexboard.board-source-resolution/v1
  boardRef
  catalogRef
  location
  sourceRefs
~~~

A source owner may project its own `boardRef -> relative JSON location` catalog. VexBoard resolves across several such catalogs without copying them into one mega-registry:

~~~text
resolve(boardRef, [catalog A, catalog B, ...])
  zero matches -> null / unknown board
  one match    -> exact source resolution
  >1 matches   -> fail closed as ambiguous ownership
~~~

The existing `VEXBOARD_BUILTIN_BOARD_URLS` map can be projected into one catalog without changing its current reader ownership. VexWork PR #103 supplies the first distinct consumer pressure: its Form-Project board should reconnect through its own source-owned catalog when that foreign candidate currentizes, rather than teaching VexBoard to own the Process Registry.

Permanent:

~~~text
BOARD_SOURCE_CATALOG != BOARDGRAPH_TRUTH
BOARD_SOURCE_CATALOG != PROCESS_REGISTRY
BOARD_SOURCE_RESOLUTION != EFFECT_AUTHORITY
DUPLICATE_BOARD_REF_ACROSS_CATALOGS -> FAIL_CLOSED
UNKNOWN_BOARD_REF -> NULL
~~~

This first contract deliberately resolves static relative JSON locations only. Projector-backed/in-memory source descriptors, remote/provider loaders and browser UI wiring remain later extensions that must be earned by actual consumers rather than predeclared.

Permanent boundaries:

```text
TOTALITY != ONE_GIANT_BOARD
BOARD_REGISTRY != BOARDGRAPH_TRUTH
BOARD_REGISTRY != PROCESS_REGISTRY
BOARD_REGISTRY != EFFECT_AUTHORITY
PORTAL != COPIED_SUBGRAPH
PERSPECTIVE != SECOND_SOURCE_OF_TRUTH
CROSS_BOARD_JOURNEY != CAMERA_MOVEMENT
```

A future cross-board Journey should preserve a semantic coordinate that includes both the board and the node being visited, conceptually:

```text
(boardRef, semanticRef)
```

and preserve return/interaction history across portal traversal. That extends the accepted BoardJourney distinction rather than replacing it with a second traversal model.

### Parallel construction without semantic collapse

The repository already has the right pattern for parallel **work** authoring:

```text
independent Workgraph segments
-> deterministic composition
-> one canonical Workgraph
```

VexBoard should consume that pattern, not duplicate it. For visual/process construction:

```text
rightful source owner A -> board/module A
rightful source owner B -> board/module B
rightful source owner C -> board/module C
                         |
                         v
             stable refs + resolver
                         |
                         v
            traversable VexBoard world
```

BoardGraph modules/ports, source projectors and BoardPatch extraction may make those pieces reusable. VexWork remains the work/lifecycle truth owner; source-owned process registries remain their own catalogs; VexBoard provides the semantic visual/traversal substrate over them.

VexBusinessFactory is the first strong pressure test because one business world needs many actor-centered perspectives and reusable process modules. It must not become the only evidence for a universal semantic-factory contract. Preserve the existing threshold: prove the same federation/resolution model with at least one genuinely different non-business consumer—VexWork process/work projection is a natural candidate—before extracting a broader universal contract.

## Vex lineage alignment — SCAE, Atlas / Process Map, and lived topology

VexBoard should evolve by preserving the semantic questions already earned elsewhere in Vex rather
than inventing parallel vocabulary because the canvas is visually different.

These sources are **implementation references and pressure tests**, not VexBoard runtime
dependencies:

```text
VexLife-Android Behavior / SCAE
  State + Control -> Act
  State + Act -> Effect + admitted State
  independently-owned States -> Convergence -> bounded Control

VexLife-Android VexMaps topology
  semantic registration != visual composition
  local semantic owners remain independent
  relationship truth belongs to explicit convergence owners
  Process / Session owns lived currentness
  Projection / Compose presents already-resolved meaning

VexLife Atlas / Process Map lineage
  stable refs
  bounded neighborhoods / thin projections
  typed functionRef + arguments + dependencies
  source-owned process meaning
  navigable descent without ingesting the whole world

VexWork Workgraph / Process truth
  source segment owns local work family
  deterministic composition -> one canonical graph
  projections do not become lifecycle owners
```

The reusable lesson is not to mechanically copy Android classes into JavaScript. It is to preserve
the same separations when the VexBoard domain has an equivalent question.

### Board Control and Board Act remain different questions

The architecture already states:

```text
human gesture / AI function call
-> Board Control
-> resolve against CURRENT BoardGraph + BoardProjection
-> Board Act
-> bounded semantic/projection change
```

Current `vexboard.board-control/v1` compresses that first proving slice by carrying an `act`
field directly on the Control envelope. That was acceptable for proving shared human/AI mutation
plumbing, but it must not silently become the final semantic model.

Before BoardPatch authoring or a broad external tool surface depends on that compression, preserve
the stronger lineage law:

```text
BOARD_CONTROL
  stable request / affordance identity

CURRENT BOARD TRUTH
  BoardGraph + BoardProjection
  plus bounded current context where earned

BOARD_ACT
  resolved meaning of that Control now

BOARD_PATCH / PROJECTION_PATCH
  proposed or applied local change

EXTERNAL EFFECT
  separate question
  never implied by a semantic simulation or board edit
```

A compatible implementation may preserve the v1 wire shape while adding an explicit resolver or
vNext contract. The point is semantic separation, not schema churn for its own sake.

```text
CONTROL != ACT
ACT != PATCH
PATCH != EXTERNAL EFFECT
```

### Atlas / Process Map is a required non-business patient zero

The existing self-map, publish-map and clickable prototype are useful VexBoard proving fixtures, but
they do not by themselves prove that VexBoard can project a real source-owned map without becoming
its owner.

Before a universal source-projector / semantic-factory contract is declared mature, exercise at
least these distinct pressures:

```text
1. VexBusinessFactory
   domain semantic topology + perspectives + reusable modules

2. VexLife Atlas / Process Map
   source-owned stable refs + process descent + bounded neighborhoods
   + typed callable/dependency meaning

3. VexWork Process / Work projection
   lifecycle/work truth + processRefs + source backlinks
```

For the Atlas / Process Map patient zero:

```text
source-owned Atlas / process truth
-> projector
-> BoardGraph references / relationships
-> BoardProjection lens
-> BoardJourney traversal
-> exact source backlinks

VEXBOARD
!= ATLAS OWNER
!= PROCESS REGISTRY
!= PROCESS EXECUTOR
```

This gives VexBoard a genuinely different non-business consumer before generic topology vocabulary
is promoted.

### Process / Session / Journey alignment

VexMaps demonstrates another useful distinction:

```text
semantic owners
  remain complete in themselves

Process / Session
  owns one lived relationship/currentness lifetime

Projection
  presents that meaning

Journey
  records the human-semantic walk
```

Current `vexboard.board-journey/v1` is truthfully single-board and validates traversal history
against one BoardGraph. That remains a valid accepted foundation.

Federated totality should extend it rather than invent a second navigation model:

```text
current coordinate
  (boardRef, semanticRef)

ENTER_BOARD
  resolve stable boardRef
  append explicit cross-board Journey step

RETURN
  restore prior (boardRef, semanticRef)
  preserve interaction / reason / source path

camera move
  presentation only
  never a Journey step by itself
```

The current hard-coded built-in board URL table is therefore a proving fixture, not the scalable
addressability owner. The earned next seam remains a bounded board source registry/resolver.

Permanent:

```text
SEMANTIC_REGISTRATION != VISUAL_COMPOSITION
LOCAL_TRUTH_OWNER != CONVERGENCE_RELATIONSHIP_OWNER
PROCESS_SESSION != UNDERLYING_DOMAIN_OWNER
BOARD_JOURNEY != CAMERA_HISTORY
ATLAS_PROJECTION != COPIED_ATLAS_TRUTH
```

### Accepted lived substrate + successor frontier — October 24, 2026

The lived usability threshold is accepted through PRs #131 and #135.

```text
work.vexboard.usability-refinement
  COMPLETED

PR #131
  interaction-plane / click-vs-drag arbitration
  merge = 8b95e74cab6eff8d4ddf4fe069c79c441aa1c6d7

PR #135
  visible DIAMOND boundary
  Journey Back = pop
  Clear Journey
  inspector ref -> transient canvas reveal
  merge = dacc623f2217200a98c110bdb981eed7d731019d
  SourceOwner A004 = 66 / 66 focused + 371 / 371 full review PASS
  lived browser acceptance = accepted enough to solidify
```

The successor foreground is now:

```text
work.vexboard.fractal-semantic-composition-spatial-layout
  RUNNING / AUTHORIZED_BOUNDED / EFFECTS_BOUND
```

Its job is to let two real consumers — one nested UI blueprint and one reusable process blueprint —
pressure the smallest shared stable-identity, composition, layout-resolution, local-arrangement and
connector-routing seams.

This is deliberately **not** BoardPatch authorization and not a new universal schema.

```text
nested UI consumer
+ reusable process consumer
-> repeated composition/layout pressure
-> smallest shared VexBoard seam
-> deterministic nested resolution
-> stable incremental arrangement
-> connector routing
-> reusable/fractal modules
-> Vex Universe / other consumers may consume the accepted substrate
```

Current Vex Universe source remains separately owned. Its READY
`work.vex-universe.journey-evidence-patient-zero` is one future integration consumer, not VexBoard's
new lifecycle owner.

See `projects/vexboard/FRACTAL-SEMANTIC-COMPOSITION-AND-SPATIAL-LAYOUT.md` for the bounded successor contract.

## Fractal semantic identity — one thing, many forms

The deeper convergence is not UI reuse or process reuse as separate product ideas. It is the ability
for one **rightfully-owned semantic identity** to remain addressable while several bounded forms
project, traverse, realize or explain it.

Conceptually:

```text
rightful semantic identity
        |
        +-> experience / screen projection
        +-> process-map projection
        +-> architecture projection
        +-> work / source projection
        +-> nested detail board
        +-> target-platform realization
        +-> proof / observed-journey relationship
```

The projections are not new copies of the underlying meaning. When two things are genuinely different
truths, they keep different stable refs and relate explicitly rather than being forced behind one ID.

```text
SAME_SEMANTIC_THING
-> one stable identity may have many projections/forms

DIFFERENT_TRUTH_OWNERS
-> distinct stable identities + explicit relationship

VISUAL_SIMILARITY
!= SAME_IDENTITY

SAME_IDENTITY
!= SAME_PRESENTATION
!= SAME_IMPLEMENTATION_FORM
```

This is the reusable foundation that connects VexBoard's Experience, Process, Architecture, Work and
Atlas lenses without making any one lens the universal ontology.

### Process identity is fractal too

A process map should be able to use the same depth model as an experience blueprint without pretending
that a process is a Screen or that a Screen is a process.

For example:

```text
Organization
  -> Customer Operations
       -> Fulfillment
            -> Validate order
            -> PORTAL: Payment
            -> PORTAL: Delivery
  -> Engineering
       -> Release
            -> PORTAL: Quality Review
            -> PORTAL: Integration
```

Each reusable process/module can keep its own stable identity and rightful source. Another board may
reference that process, project a bounded neighborhood around it, or enter its detail without copying
the process into the caller.

The important depth coordinates remain different:

```text
TOPOLOGY
  peer/cross-domain relationships among stable identities

CONTAINMENT
  explicit parent/child meaning inside one owned structure

PORTAL / DETAIL BOARD
  descent into another reusable module or bounded board

PROJECTION
  one visual arrangement/lens over those identities

JOURNEY
  one explicit semantic traversal through those identities

SOURCE / PROCESS REF
  where the rightful meaning is owned
```

```text
TOPOLOGY != CONTAINMENT
CONTAINMENT != PORTAL
PORTAL != COPIED_SUBGRAPH
PROJECTION != SOURCE OWNERSHIP
JOURNEY != CAMERA HISTORY
```

This lets VexBoard connect an organization without requiring one organization-sized BoardGraph.
"Whole organization" is a traversable federation of bounded identities, modules and projections.

### Reuse is a relationship, not a UI feature

The same architectural pressure appears at several scales:

```text
UI
  reusable Screen / element tree / template / component

PROCESS
  reusable process module / sub-process / callable route

ARCHITECTURE
  reusable component / interface / capability

WORK
  reusable Process Map route + Work/Project relationships

SOURCE / ATLAS
  source-owned stable node + bounded neighborhood

TARGET REALIZATION
  platform-specific form of accepted portable meaning
```

These forms may reuse the same **identity / structure / relationship / projection** principles without
being required to share one giant runtime interface or one universal node enum.

VexLife-Android's Screen Blueprint / Elements / Vex Compose foundation is therefore useful realization
pressure: nested stable identity, declared parent/child placement, Row/Column/Stack composition,
inherited presentation identity and Gallery proof already exist there. VexBoard should reuse the
architectural lesson and mapping pressure rather than rebuild Compose or make Android the portable
semantic owner.

The VexLife Blueprint Source-of-Truth trajectory supplies the complementary portability law:

```text
portable semantic meaning
-> deterministic mapping
-> target-specific realization
-> construction proof
-> semantic parity proof
-> native/lived proof
-> bounded reverse observation
```

VexBoard can be a visual authoring, inspection and simulation projection over that kind of portable
meaning. It does not replace the rightful Blueprint/source owner.

```text
VEXBOARD_VISUAL_BLUEPRINT
!= PORTABLE_SEMANTIC_OWNER
!= TARGET_RUNTIME

ANDROID_REALIZATION
!= PORTABLE_SEMANTIC_OWNER

PROCESS_PROJECTION
!= PROCESS_REGISTRY

WORK_PROJECTION
!= WORKGRAPH
```

### Identity should make usages traversable

Once stable identities and explicit relationships exist, "where is this used?" should become a graph
question rather than a visual-search problem.

Conceptually:

```text
semanticRef / processRef / boardRef
        |
        +-> parents / children
        +-> incoming / outgoing relationships
        +-> template/module instances
        +-> PORTAL/detail-board references
        +-> source backlinks
        +-> Work / Project references
        +-> target realization references
        +-> Journey / proof references
```

A Context Inspector or future bounded query may project that neighborhood and let a human traverse it.
The reverse-usage relationship should be derived from the rightful source graph/catalog where possible,
not maintained as another manually synchronized registry.

This is the organizational scalability target:

```text
TOTALITY
= bounded source-owned identities
+ explicit relationships
+ reusable modules
+ source resolution
+ bounded projections
+ where-used/backlink traversal
+ Journey continuity

TOTALITY
!= one mega-map
!= one mega-state
!= one mega-owner
```

The same principle is fractal: a button, Screen, feature, reusable process, Project, architecture
component or organization domain can each be a stable coordinate at its rightful semantic scale.
What changes is the lens and the relationships around it, not the requirement to rebuild its identity
for every representation.

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

## Next-next-next proving foundation — reusable templates, inheritance and declared variance

Once relational topology can be represented and navigated, VexBoard should prove that repeated design
structure can have **one reusable source** rather than becoming copied drawing fragments.

The motivating example is a website shell:

```text
Website Foundation Template
  Header
  Navigation
  Content slot
  Footer

        |
        +-> Home Screen instance
        +-> About Screen instance
        +-> Contact Screen instance
        +-> Experimental Screen instance
```

Changing the canonical Header should update every linked instance that has not explicitly declared a
different value. The board should not require a human to hunt through every Screen and manually
repair copied headers.

The exact schema names remain provisional, but the semantic roles should distinguish:

```text
TEMPLATE SOURCE
  one canonical reusable design definition

TEMPLATE INSTANCE
  one placement/use of that source

PARAMETER / SLOT BINDING
  admitted instance-specific content without redefining the template

DECLARED VARIANCE
  one bounded intentional exception that remains linked to the source

DETACHED UNIQUE DERIVATIVE
  an intentional fork that no longer receives future source updates
```

Permanent:

```text
TEMPLATE_INSTANCE != COPIED_SUBGRAPH
INSTANCE_PARAMETER != TEMPLATE_FORK
DECLARED_VARIANCE != DETACH
DETACHED_UNIQUE != HIDDEN_STALE_COPY
```

### Propagation should be source-driven and inspectable

A template update should conceptually resolve:

```text
prior template revision
-> next template revision
-> linked instances
-> parameter bindings
-> declared variance overlays
-> compatibility / conflict check
-> next projected instances
```

The root template should maintain a reverse-addressable dependency view so human or AI can answer:

```text
where is this Header reused?
which Screens inherit it exactly?
which Screens carry declared exceptions?
which derivatives were detached?
which template update cannot currently propagate cleanly?
```

This is the same one-source-many-projections discipline used elsewhere in Vex: a reusable definition
owns its meaning; instances project/use it without becoming independent sources by accident.

### Exception is a governed variance, not a secret copy

A Screen may legitimately need a different Header.

The first human interaction may look like a right-click action such as:

```text
Declare exception...
```

The action should require a short human-readable reason before the variance becomes accepted:

```text
reason
affected semantic/property refs
expected duration or permanence when useful
optional related requirement/source ref
```

The resulting instance stays linked to the root template. Future template changes continue to
propagate outside the explicitly overridden surface.

The root/source view should expose backlinks:

```text
Header Template
  exact instances: 11
  declared variances: 2
    -> Experimental Checkout
       reason: tests compact navigation variant
    -> Kiosk Screen
       reason: no account controls in kiosk mode
```

A human or AI can enter either variance and return to the root without searching the whole board.

### Make unique is the stronger operation

A separate action such as:

```text
Make unique / detach from template...
```

should be used only when the object is intended to evolve independently.

That transition should require an explicit reason and preserve provenance:

```text
derivedFromTemplateRef
detachedFromRevision
reason
new stable refs where required
```

After detachment:

```text
future template update
-> does not silently mutate detached derivative
```

but the template/root can still point to the derivative as a known lineage relation.

This prevents "unique" from becoming the ordinary escape hatch that recreates stale Sketch/Figma
copies.

### Templates may be fractal

A whole Screen may be templated, but so may smaller reusable meaning:

```text
site shell
header
navigation group
form pattern
card
process module
decision family
onboarding step
```

A template can contain other template instances. The graph must reject accidental template
inheritance cycles and preserve explicit source lineage.

```text
TEMPLATE_REUSE_LOOP != VALID_PROCESS_FLOW_LOOP
```

### Template proving cases

Before relying on templates for real webpage blueprints, prove:

```text
one Header source -> three Screen instances
root Header edit -> all exact instances update
one parameterized instance -> source update + parameter preserved
one declared variance -> source update propagates outside variance
variance reason/backlink visible from root and instance
variance removed -> instance reconverges with source
make unique -> later root update does not alter derivative
nested template instance
cycle attempt fails closed
export/reload preserves template/instance/variance lineage
human and AI use the same template Controls
```

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

### Next proving foundation — spatial arrangement and connector routing

After primitive create/move/resize/layer/contain/connect operations are proven, the next layer should
make a board **organize itself readably without surrendering human control**.

This is not merely a beautification pass. It is a deterministic spatial reasoning layer over the
current BoardGraph + BoardProjection:

```text
semantic topology
+ projection bounds
+ containment
+ sequence / branch meaning
+ layout intent
+ current anchors / locks
        |
        v
spatial arrangement
+ obstacle map
+ connector routing
+ local collision repair
        |
        v
next BoardProjection
```

The first implementation should prefer one projection-owned **layout metric profile** rather than a
continuously drifting arithmetic average of every current node. A useful profile may be initialized
from observed content pressure, but should preserve a stable visual rhythm through bounded metrics:

```text
base unit
default node width / height
minimum readable width / height
horizontal / vertical gap
container padding
connector gutter
label padding
size classes or quantized multiples
```

This lets ordinary nodes share a coherent scale while allowing content-heavy nodes, portals and
expanded modules to occupy larger multiples without redefining the entire board's spacing every time
one object changes.

```text
CONTENT_FIT_MAY_EXPAND_NODE
!=
ONE_LARGE_NODE_REDEFINES_GLOBAL_SCALE
```

#### Position awareness and local occupancy

Every projected object should be reasoned about as a spatial participant:

```text
bounds
preferred / minimum bounds
container bounds
nearby obstacle bounds
reserved connector corridors
anchor / lock state
semantic neighbors
incoming / outgoing relationships
```

The solver should maintain a bounded spatial/occupancy index so it can answer questions such as:

```text
what occupies the region to my right?
is the vertical gap between these nodes readable?
is this connector corridor clear?
can this module expand here without displacing an unrelated region?
which nearby objects would move if I create room locally?
```

Human placement remains meaningful. Auto-layout should first preserve explicit anchors and repair the
smallest affected neighborhood rather than globally shuffling an already-understood map.

#### Connector routing is a scored spatial decision

Relationship direction remains semantic; the visible route is projection.

For one directed relationship the router should evaluate candidate source/target ports and path
shapes against the current spatial index. Conceptually:

```text
candidate port pairs
-> direct orthogonal route when clear
-> one-bend elbow when clear
-> two-bend dogleg / U-turn when clear
-> bounded local gutter expansion / node reflow
-> explicit degraded rendering only when presentation cannot currently realize a clean route
```

Candidate routes can be ranked by a deterministic cost function using pressures such as:

```text
obstacle collision               forbidden / very high cost
node or container penetration    forbidden unless semantically admitted
edge crossing                    high cost
label collision                  high cost
insufficient clearance           high cost
bend count                       moderate cost
route length                     moderate cost
departure opposite target        moderate cost
movement of unrelated anchors    high cost
preserving prior accepted route  preferred
semantic reading direction       preferred where lens supplies one
```

Exact weights should be earned from proving cases rather than frozen from prose.

A route such as:

```text
row:  [1] [2] [3] [4]
                  |
                  v
                 [5]
```

should therefore not hard-code "bottom of 4 to top of 5." It should derive candidate geometry from
the actual relative bounds and available corridors:

```text
4 bottom -> 5 top
  preferred when their horizontal overlap / gutter is clear

4 right -> route around -> 5 right
  useful when a side corridor is clearer than the vertical gap

other source/target ports
  legal when they minimize crossings, bends and obstruction
```

If no safe route exists, the preferred response is to create local room or mark the route as
visually degraded rather than silently discard direction. An arrowhead may be suppressed as a
presentation choice under extreme density only when the relationship remains explicitly directed
and inspectable through semantic identity/accessibility.

```text
ARROWHEAD_HIDDEN
!=
EDGE_DIRECTION_UNKNOWN
```

#### Connectors and nodes may negotiate space

Layout should be able to solve the reciprocal problem:

```text
nodes create corridors for edges
AND
important edges can create spacing pressure on nodes
```

For example, if a clean U-turn requires a right-side gutter, the local solver may widen the owning
container or shift a small nearby region instead of routing an unreadable line through several
objects. This should remain bounded and explainable:

```text
layoutDecision
  affectedRefs[]
  preservedAnchors[]
  chosenRoute
  rejectedCandidateReasons[]
  localMovements[]
```

That explanation can later support AI inspection, regression fixtures and human "why did this move?"
feedback without making private solver search history a permanent product artifact.

#### Fractal module expansion uses the same spatial contract

A condensed PROCESS / PORTAL may initially occupy one ordinary node-sized region:

```text
[ Step 1 ] -> [ Step 2 ] -> [ Existing Process ]
```

When expanded inline:

```text
[ Step 1 ] -> [ Step 2 ] -> [ Existing Process
                               step A -> step B
                                         |
                                         v
                                       step C ]
```

the owning region requests additional projection space. The solver should:

1. preserve the portal/module's semantic identity;
2. allocate enough local space for its child projection;
3. preserve surrounding anchors where possible;
4. reroute affected connectors;
5. avoid changing unrelated BoardGraph meaning;
6. allow collapse to recover the prior compact spatial role.

The same mechanism should work recursively. Depth changes the projection's space demand, not the
identity of the underlying process.

```text
INLINE_DEPTH_EXPANSION
-> LOCAL_SPACE_NEGOTIATION
-> CONNECTOR_REPAIR
!=
GLOBAL_BOARD_REWRITE
```

#### Spatial proving cases before richer blueprint authoring

The second proving ground should deliberately include small pathological arrangements:

```text
straight sequence
right-angle continuation
U-turn continuation
branch + merge
return loop
dense neighboring nodes
nested container
expanded portal/module
two edges competing for one corridor
human-pinned node that auto-layout must preserve
node resize that forces only local rerouting
```

Each case should prove deterministic output for the same input state, no node/edge overlap outside
explicitly admitted presentation, stable anchors where possible, and bounded movement when the map
changes incrementally.

The human should also be able to request:

```text
auto-arrange this selection
route this edge more clearly
make room for this expanded process
keep these three nodes fixed
compact this region
```

through the same shared Board Control contract used by AI.


### Next-next proving foundation — relational direction navigation

Once primitive manipulation and spatial arrangement/routing are proven, the next layer should teach
VexBoard how to **present and traverse branching relationship topology**.

This is different from connector routing:

```text
connector routing
  "how can this already-known relationship be drawn clearly?"

relational direction navigation
  "what kind of relationship fork is this,
   how many distinct paths leave it,
   which paths stay in this process,
   which paths reconverge,
   and which paths enter another map?"
```

#### Semantic shape defaults without shape-owned meaning

Some node roles should have recognizable default visual forms so a human can scan a process without
reading every label. For example, one Process-lens style might conventionally render:

```text
PROCESS     -> rounded/ordinary process block
DECISION    -> angled / diamond-like choice form
ARTIFACT    -> document/data-like form
PORTAL      -> distinctive enter-map / module form
REFERENCE   -> linked/source form
```

Those are projection defaults, not semantic definitions:

```text
DECISION
-> may default to diamond presentation

DIAMOND_SHAPE
!=
DECISION_SEMANTICS

SHAPE_OVERRIDE
!=
SEMANTIC_ROLE_CHANGE
```

The stable node/relationship refs, labels and accessibility projection must preserve meaning even
when a lens, theme or human override uses another shape.

#### A branch is topology, not a fan of anonymous arrows

A DECISION / choice point should carry stable outgoing relationship identity. Exact schema fields
remain to be earned, but the graph needs enough meaning to distinguish conceptually:

```text
choice point
  branch A -> destination A
  branch B -> destination B
  branch C -> destination C
  branch D -> destination D
```

Each branch should be independently addressable so human/AI discussion can say:

```text
"move choice C to its own process"
"rename branch B"
"these two outcomes reconverge"
"choice D leaves this process and does not return"
```

A branch label/condition belongs to the relationship meaning; the visual angle or connector port does
not.

#### Fan-out is a readability budget, not a truth limit

Large flat choice sets become hard to perceive. The first proving ground may use an **eight visible
branch readability threshold** as a deliberately provisional pressure test:

```text
visible branch count <= 8
  ordinary fan-out may remain readable

visible branch count > 8
  raise design pressure:
    can related outcomes be grouped?
    can a category/state object own a smaller sub-choice?
    should detail move behind a PORTAL?
    is a menu/list projection more truthful than a radial fan?
```

Eight is not a semantic maximum and must not reject a real process that truthfully has nine or more
outcomes.

```text
FANOUT_OVER_READABILITY_THRESHOLD
!=
INVALID_BOARDGRAPH
```

The right result may be intentional high fan-out, a condensed choice hierarchy, or extraction into a
deeper board. VexBoard should surface the pressure rather than silently rewriting the human's
meaning.

#### Branch fan-out can reshape the enclosing projection

A linear process may begin compactly:

```text
[1] -> [2] -> [3] -> [4]
                       |
                       v
                      [5] -> [6 choice]
```

When step 6 gains several meaningful outcomes, preserving those old rows at all costs is the wrong
goal. The enclosing region may reflow into a branch-readable form:

```text
[1] -> [2] -> [3]
               |
              [4] -> [5]
                       |
                    < 6 >
                  /   |   |   \
                c1    c2  c3   c4
                |     |         |
             c1a/c1b ...     enter another process
                  \   /
                 converge
```

The layout engine should estimate the **branch envelope** required by each outgoing subgraph, then
allocate distinct branch corridors/lanes before routing the individual edges.

Useful inputs include:

```text
branch count
estimated descendant footprint
expected convergence
portal/terminal destination
preferred reading direction
existing human pins
container bounds
available whitespace
neighboring branch envelopes
```

This permits the solver to reshape the current process region while preserving unrelated outer
anchors.

```text
BRANCH_FANOUT_MAY_REFLOW_ENCLOSING_REGION
!=
GLOBAL_BOARD_REWRITE
```

#### Convergence is preserved separately from branching

Several choice paths may later meet at one stable process coordinate.

VexBoard should be able to recognize the visual/topological opportunity:

```text
choice
  -> branch A --\
  -> branch B ----> common downstream coordinate
  -> branch C --/
```

but it must not invent new semantic meaning merely because graph topology shares a descendant.

```text
COMMON_DOWNSTREAM_NODE
!=
NEW_SEMANTIC_CONVERGENCE_KIND_AUTOMATICALLY
```

When the source explicitly says branches converge, or the graph already expresses several incoming
flows into the same destination, the projection may reserve a stable visual meeting region and route
branches toward it. If convergence itself has product/process meaning, that meaning must be represented
by an earned semantic object rather than inferred from arrow geometry.

#### Some branches leave the current map

A branch does not have to remain inside the current board family.

A PORTAL-like destination can behave conceptually like changing maps in a game:

```text
current process map
  -> choose "Choice 3"
  -> ENTER destination board/module
       current board coordinate retained in BoardJourney
       destination gets its own readable projection
  -> RETURN when that route admits return
```

This avoids forcing every possible process branch onto one enormous canvas.

The branch should distinguish, in meaning, among cases such as:

```text
continue in current board
enter another board and allow return
enter another board with an explicit named return point
enter another board with no return in this process
terminal outcome
```

Exact enum/schema names remain provisional.

Entering another map is semantic traversal and should append BoardJourney. Merely expanding the same
portal inline remains projection state:

```text
ENTER_OTHER_BOARD
!=
EXPAND_PORTAL_INLINE

RETURN_TO_PRIOR_COORDINATE
!=
CAMERA_BACK
```

The visible branch destination can therefore act like a clickable doorway/button while preserving a
stable destination ref, source coordinate and return policy. A Back/Return affordance should restore
the prior semantic coordinate without requiring the user to remember where the parent map was.

#### Relational navigation proving cases

Before full prototype simulation, Phase 2C should prove at least:

```text
two-way choice
four-way choice with angled/default Decision presentation
eight-way visible fan-out
more-than-threshold fan-out producing design pressure, not invalidation

branch with uneven descendant sizes
branch where several paths reconverge
branch where one path terminates
branch where one path enters another board and returns
branch where one path enters another board and does not return

fan-out that forces enclosing-region reflow
human-pinned upstream nodes preserved during that reflow
collapse/expand of one branch subtree
deterministic export/reload of branch and portal identity
```

The same shared Board Control contract should eventually support human and AI intentions such as:

```text
add another choice
group these three choices
extract this branch into another process
make these branches reconverge here
enter this process
return to the previous map
auto-arrange this branch family
```

The proof target is not merely that the arrows look attractive. It is that branching, convergence,
cross-map traversal and return remain semantically stable while projection is free to reorganize
itself for readability.


### Visual cues

Color, shape, border, icon, line style, depth, and animation may communicate semantic roles and state, but the underlying meaning must remain readable without relying on color alone.

## Asset and image support — source identity, semantic discovery and reusable media

VexBoard should be able to use screenshots, raster images and vector assets without turning board
files into an opaque pile of embedded bytes.

Current Vextreme-Assets already establishes a useful source distinction:

```text
__assets/
  preserved authored/source dependencies
  content-addressed by stable byte identity

evidence/screenshots/
  derived screenshot evidence
  semantic coordinate + exact SHA-256 + source binding
```

VexBoard should **consume that distinction rather than overwrite it**. An authored logo/SVG and a
captured screenshot may both be visually displayable, but they do not mean the same thing.

```text
AUTHORED_ASSET != DERIVED_SCREENSHOT_EVIDENCE
MEDIA_DISPLAY != MEDIA_SOURCE_OWNERSHIP
```

The current Vextreme-Assets import manifest is intentionally provenance/byte-oriented: canonical
content path, imported path, Git blob, extension and size. It is not currently a semantic search
catalog. VexBoard therefore needs a bounded discovery layer without redefining immutable asset
identity.

### Stable media reference plus semantic catalog metadata

Conceptually, a board-visible asset binding needs two separable coordinates:

```text
source identity
  repository / source namespace
  immutable asset id or evidence coordinate
  exact content identity
  media type

discovery / design meaning
  human name
  aliases
  tags
  project / domain scope
  semantic role
  optional description / alt meaning
```

Exact ownership of broadly reusable tags should be earned from real consumers. Project-local tags may
belong to the VexBoard/project binding; cross-project canonical names may eventually belong to an
Assets-owned semantic catalog.

Do not mutate a content hash merely to give an image a better human name.

```text
SEMANTIC_ALIAS != BYTE_IDENTITY
TAG_CHANGE != NEW_ASSET_BYTES
```

### Search should work without knowing exact labels

The same gallery/query surface should serve humans and AI.

Examples:

```text
search "header"
-> reusable Headers across visible/admitted projects

search "header" + project:vexsite
-> VexSite-scoped Header assets/templates

search "onboarding screenshot"
-> screenshot evidence / guidance media

search "navigation icon" + type:svg
-> matching vector assets
```

Useful search fields may include:

```text
name
aliases
tags
semantic role
project refs
source namespace
media type
usage refs
```

A user should not need to know the exact asset hash or internal filename to discover a useful visual.

### SVGs are assets first, editable geometry only when deliberately converted

Vextreme-Assets already contains SVG source assets alongside PNG/JPG/WebP and other files. VexBoard
should render admitted SVGs as reusable vector media.

```text
SVG_ASSET
-> renderable / scalable media reference
```

It should **not** automatically explode arbitrary SVG paths into editable BoardGraph shapes. That
would confuse visual bytes with semantic board meaning.

A future explicit operation may convert selected vector geometry into board-editable primitives when
there is a real need and the conversion can preserve provenance.

```text
RENDER_SVG != IMPORT_SVG_AS_SEMANTIC_SHAPES
```

AI-authored SVGs may enter the same asset path only through the rightful asset/source admission
contract; image generation alone does not make them canonical reusable assets.

### Media need not be placed on the current board to be useful

The toolbar/library should expose an asset gallery independent of the current canvas:

```text
Asset Library
  browse
  search
  filter
  inspect provenance
  inspect usages
  insert/reference
```

An asset can exist in the library and be available to AI without occupying any current BoardProjection.

When inserted:

```text
asset source
-> stable media binding
-> projection item
-> optional semantic role / caption / alt meaning
```

The same source asset may appear in many boards or template instances without copying bytes.

### Screenshots as persistent visual guidance

Screenshots can support instructions where disappearing tooltips or prose alone are insufficient:

```text
onboarding step
  text explanation
  + referenced screenshot
  + optional highlighted/annotated region later

feature guide
  expected state screenshot
  + semantic step identity

tool instruction
  stable process step
  + visual example
```

A screenshot should retain source/provenance when known, especially when it represents a specific
product revision. A stale screenshot can then be detected as stale evidence rather than silently
remaining "the current UI."

### Asset proving cases

Before rich media becomes ordinary board content, prove:

```text
reference one PNG without embedding duplicate bytes
reference one SVG and render at multiple sizes
same asset used by several template instances
search by semantic name
search by alias/tag without exact label
project-scoped and cross-project search
distinguish authored source asset from screenshot evidence
asset library item exists without board placement
insert/remove projection without deleting source asset
source/provenance inspection
export/reload preserves exact asset bindings
missing/stale source binding fails closed or becomes explicit unresolved media
```

## Existing-system adoption — reverse project implementation into the design collection

Future Vex work should begin from VexBoard design collections before implementation, but accepted
systems already exist. VexBoard therefore needs a **reverse-adoption** path that can map current
source-owned design/implementation truth into a BoardGraph without pretending that importing it
transfers ownership.

VexLife's current Universal Blueprint is a strong patient zero because it already carries:

```text
Product
-> Screen
-> Region
-> Element
-> Action / Permission / State selector / Localization key / Terrain / Tests

stable refs
bounded Atlas descent
human + machine projections
versioned blueprint changes
target/platform adoption receipts
```

The current VexLife Presentation Graph also already preserves distinctions VexBoard needs:

```text
elementRef / screenRef are canonical identity projections
display label is not canonical identity
geometry is not semantic context
motion is not product state
localization is not identity mutation
screenshot is not semantic map
```

So VexBoard should initially **project and bind** that accepted source rather than replace it.

Conceptually:

```text
existing VexLife Blueprint / Presentation Graph
        |
        | source-bound adapter
        v
VexBoard design collection
  stable Board refs mapped to canonical VexLife refs
  source provenance retained
  current implementation / proof backlinks retained
        |
        v
future visual BoardPatch
        |
        | when authorized
        v
VexLife Blueprint change proposal
  affected refs
  impact report
  target adoption requirements
        |
        v
existing Blueprint change-propagation / platform adoption machinery
```

This permits the product direction:

```text
NEW DESIGN WORK
-> begins in VexBoard

EXISTING ACCEPTED WORK
-> reverse-adopt into VexBoard
-> verify identity/source parity
-> then continue future design from the mapped collection
```

without silently declaring:

```text
VEXBOARD_PROJECTION
=
NEW_CANONICAL_OWNER
```

An explicit later source-governance evolution may choose VexBoard published design as an upstream
authoring source for a target family, but that ownership transition must be deliberate and proven.

### Reverse-adoption proving cases

Use at least one existing VexLife Screen/Element family and one existing Vextreme page:

```text
canonical source ref
-> Board semantic ref
-> projected shape/layout
-> localization identity
-> source implementation refs
-> tests/evidence
-> live/runtime ref when current
```

Round-trip proof should establish:

```text
import/project
-> no source mutation
-> stable identity retained

Board-only layout edit
-> no target semantic mutation

authorized semantic edit
-> bounded source change proposal against rightful owner
-> affected refs / tests / localization impact visible
```

## Context Inspector — selected meaning, metadata, documentation and traversable source

VexBoard should provide a persistent side panel comparable to a design-tool inspector, but the panel
is not merely a property editor. It is the **selected semantic coordinate's bounded Atlas / source
projection**.

Selecting or right-clicking any addressable object should resolve its stable identity and show only
the sections that actually exist for that object.

A useful conceptual inspector:

```text
SELECTED
  human label
  semantic kind
  canonical ref
  current Board ref
  source/currentness state

DESIGN
  editable Board-owned properties
  projection geometry / shape
  template source / instance / variance
  asset bindings

WHERE USED
  template instances
  incoming/outgoing relationships
  parent/child refs
  screens/processes that consume it
  known derivatives / exceptions

SOURCE
  canonical owner
  repository
  source paths / exact source refs
  implementation bindings
  change impact / affected refs

LOCALIZATION
  string ref
  source-language value
  languages
  completeness/staleness
  exact source file / key
  screenshot context when available

DOCUMENTATION
  purpose / why
  owning feature/process docs
  design/decision records
  relevant architecture sources

PROOF
  tests
  behavior witnesses
  screenshots
  currentness / conformance receipts

LIVE
  live route / site / app coordinate when verified
  open current implementation
  runtime/readiness status when source supports it
```

This should be generated from pointers/backlinks, not a copied inspector database.

```text
INSPECTOR
= QUERY + HYDRATE + PROJECT

INSPECTOR
!= SECOND_SOURCE_OF_TRUTH
```

### Identity is the traversal key

The ability to right-click a visible element and ask "where is this used?" depends on stable identity.

A selected Button should be able to traverse, when those bindings exist:

```text
Board elementRef
-> reusable template/component source
-> every Board usage
-> target blueprint elementRef
-> implementation binding
-> GitHub source
-> localization stringRef
-> translated values / status
-> screenshots/evidence
-> live route
-> tests / behavior witnesses
```

Reverse traversal should work too:

```text
known source file / string ref / live route / screenshot identity
-> canonical semantic ref
-> Board coordinate(s)
```

This is especially important for adopted existing systems, because the Board can become the human
navigation surface over documentation that currently lives in several rightful repositories/files
without copying those documents into one giant monolith.

### Editable versus projected fields must be explicit

The inspector may show both editable and read-only data, but it must never make a projected source
look editable merely because it appears in a form field.

```text
BOARD_OWNED_FIELD
-> may be edited through Board Control / BoardPatch

SOURCE_PROJECTED_FIELD
-> inspect/read by default
-> edit only through an admitted owner-specific change adapter

PROOF / LIVE EVIDENCE
-> observation, never direct design mutation
```

The UI should visibly distinguish those states.

## Localization synchronization — visual text edits become source-aware change impact

A visible string should never be only anonymous text painted on a shape when the target/source has a
stable localization identity.

VexLife Blueprint already models a localization key on stable elements, while Vextreme's current
localization architecture treats the key/source registry as UI identity and generates page/language
coverage. Vextreme's identity pilot additionally preserves canonical versus observed element IDs and
builds pointer indexes rather than duplicating translation records.

VexBoard can project those relationships directly.

For an adopted/localization-bound element:

```text
visible text
+ canonical elementRef
+ stringRef
+ source-language source
+ locale projections
+ source / screenshot / usage backlinks
```

If the human edits the visible English text in VexBoard:

```text
"Continue"
-> "Continue to verification"
```

the Board should not silently change only its own display text.

Instead:

```text
Board edit intention
-> resolve canonical stringRef
-> form source-language change proposal
-> compute affected usages
-> compute translation freshness impact
-> show synchronization status
```

Conceptually the Inspector may then show:

```text
Localization synchronization

EN source        CHANGED IN DESIGN / SOURCE UPDATE PENDING
JA               STALE AGAINST NEW SOURCE
ZH               STALE AGAINST NEW SOURCE
FR               MISSING / NOT CURRENTLY COMPLETE

Used by
  Checkout / Continue
  Account Setup / Continue

[Open source string]
[View usages]
[Prepare localization update]
[Revert Board text]
```

A target that already owns hash-based translation staleness should remain the authority for the
actual stale/complete calculation; VexBoard projects that status and the proposed design delta.

```text
BOARD_TEXT_CHANGED
!=
SOURCE_STRING_UPDATED

SOURCE_STRING_UPDATED
!=
TRANSLATIONS_CURRENT

TRANSLATIONS_CURRENT
!=
LAYOUT_PROOF_CURRENT
```

### Publish readiness consumes synchronization truth

The Board publish-readiness audit should include source-binding/localization synchronization when a
published design claims a target-bound deliverable.

Warnings can include:

```text
design text changed but canonical source update not formed
source language changed but one or more required locales are stale
target element identity no longer resolves
screenshot evidence predates the intended source revision
live implementation remains on an earlier accepted blueprint revision
```

These are navigable inspector findings, not generic red badges.

A design-only Board with no target binding may legitimately publish without target localization
coverage; a target-bound release must state its actual synchronization debt.

### Better-than-screenshot-only localization workflow

The intended experience extends the useful idea behind screenshot-context localization tools:

```text
select visual element in Board / screenshot
-> resolve canonical identity
-> inspect current source-language + translations
-> inspect where used
-> inspect source implementation
-> inspect live route / screenshots
-> edit/propose one source-aware change
-> see affected translations / layouts / proofs
-> route the exact target change
```

The differentiator is not merely "translate text beside a screenshot." It is that **design identity,
source, localization, screenshots, docs, implementation and proof are traversable forms of the same
semantic coordinate**.

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

### Animated semantic traversal — let the human perceive the move

When a CONTROL, branch, portal, search result or explicit navigation action changes semantic focus,
VexBoard should not make the destination appear as an unexplained instantaneous replacement.

The navigation contract should preserve two separate truths:

```text
semantic traversal
  fromRef
  relationship/control used
  toRef
  BoardJourney step

projection transition
  camera path
  zoom / pan / emphasis
  destination centering
  optional connector/path highlight
```

The semantic move is the meaning. Animation helps the human perceive that move.

```text
SEMANTIC_TRAVERSAL != CAMERA_ANIMATION
ANIMATION_DURATION != PROCESS_DURATION
ANIMATION_INTERRUPTED != JOURNEY_HISTORY_DELETED
```

For an ordinary same-board transition:

```text
click / activate
-> resolve exact destination
-> highlight or trace the selected relationship when useful
-> smoothly pan/zoom toward destination
-> center/focus destination
-> settle with brief destination emphasis
```

For a PORTAL / change-map transition:

```text
current map + source coordinate
-> activate portal
-> visible leave/enter transition
-> destination map centers on its entry coordinate
-> prior semantic coordinate remains in BoardJourney
```

Return should likewise make the relationship perceptible instead of merely restoring unrelated camera
coordinates.

Motion must respect reduced-motion/accessibility preferences. Reduced motion may use a short
crossfade/highlight or immediate focus with explicit origin/destination cues while preserving the
same BoardJourney semantics.

The first proving cases should cover:

```text
nearby same-board move
long-distance same-board move
follow one bent connector around obstacles
branch choice -> centered destination
portal -> another board
return -> prior semantic coordinate
revisit an already-visited node
reduced-motion equivalent
user interrupts motion without corrupting semantic position
```

## Publish readiness — closed paths, known open ends and a reviewable blueprint release

Once a board can be authored, arranged, traversed, templated and enriched with media, it should be
possible to publish a **versioned design deliverable** without pretending every incomplete board is
equally ready.

Before publication, VexBoard should derive a bounded reachability/readiness projection from the
declared start coordinates.

The audit should distinguish at least conceptually:

```text
declared terminal
  intentional end of a pathway

declared portal destination
  current board intentionally hands off to another board/process

declared return
  entered process has an explicit return contract

open end
  reachable path stops without an explicit outcome

incomplete branch
  a choice/condition exists but one or more outcomes have no destination

unreachable meaning
  authored node/subgraph cannot be reached from a declared entry unless explicitly library-only

trap / non-exiting cycle
  reachable loop has no declared exit or terminal meaning

placeholder / unresolved binding
  source/template/asset/destination still intentionally unresolved
```

This is not one universal "green/red" score. Structural invalidity and design incompleteness have
different consequences.

Conceptually:

```text
BLOCK PUBLICATION
  invalid references
  illegal containment/template cycles
  missing required source identity
  structurally impossible graph
  corrupt release inputs

WARN / REQUIRE ACKNOWLEDGEMENT
  intentional open ends
  incomplete choice outcomes
  placeholders
  design TODOs
  target-specific readiness gaps

READY
  every reachable path is either
    explicitly terminal
    explicitly handed off
    explicitly returnable
    or intentionally marked open
```

A warning should be specific enough to navigate directly to the problem:

```text
Start: onboarding.start
-> Account Type
-> Business
-> Verification choice
-> "Manual review"
-> NO OUTCOME

Publish anyway?
  [Go to missing outcome]
  [Mark intentionally open]
  [Publish with known open end]
  [Cancel]
```

Publishing with acknowledged open ends must preserve those open ends as release metadata; it must not
rewrite them as complete.

### Published Board revision

A publish action should freeze one inspectable design revision:

```text
BoardGraph semantic identity
BoardProjection(s) selected for release
template/source revisions
declared variances
asset/media bindings
journey/readiness audit
known open ends / warnings
release fingerprint
```

Later editing continues in working state rather than silently mutating the already-published design.

```text
WORKING_BOARD != PUBLISHED_BOARD_REVISION
PUBLISHED_BLUEPRINT != TARGET_DEPLOYMENT
PUBLISH_WITH_WARNING != WARNING_RESOLVED
```

This allows a human to share, review, compare and approve a concrete design before any target source
is changed.

## Blueprint compilation — project one published design into a real target

After a Board revision is publishable, a separately governed **target adapter/compiler** may translate
that design into the source language of an existing product.

The important relationship is:

```text
published VexBoard design
        |
        v
target adapter
  understands target repository contracts
        |
        v
implementation plan / source candidate
        |
        v
target repository's own validation + review + lifecycle
        |
        v
real implementation
```

VexBoard does not become the target repository's source owner.

```text
BOARD_RELEASE != SOURCE_AUTHORITY
TARGET_ADAPTER != TARGET_SEMANTIC_OWNER
COMPILED_CANDIDATE != DEPLOYED_PRODUCT
DESIGN_APPROVAL != MERGE_OR_PUBLICATION_AUTHORITY
```

### Vextreme as a strong future target adapter

Current Vextreme already exposes several useful target-native contracts rather than requiring
VexBoard to invent a new website architecture:

```text
pages/{slug}.html
  concrete page surface

data/viewmodels.json + generated slug/index viewmodels
  category / template / localization scopes / feature composition

data/strings/source/**
  canonical display/localization keys

data/strings/compiled/** + pageLanguageMap
  generated locale/runtime coverage projections

Vextreme-Assets
  content-addressed authored/source assets
  + separately owned screenshot evidence

data/nodes.json / auto-discovery / content intents
  existing page discovery/placement machinery
```

A future Vextreme adapter could therefore map Board meaning conceptually:

```text
SCENE
-> page / route / viewmodel identity

templated page structure
-> target-native reusable page/component contract where one exists
-> otherwise surface a target capability gap rather than silently copy stale markup

visible text / labels
-> canonical localization keys + declared page scopes
-> never hardcoded display strings

asset binding
-> Vextreme-Assets logical/content identity

CONTROL / transition
-> target-native link/navigation/interaction

Board route / page relationship
-> target navigation/registration meaning

published design readiness
-> implementation plan inputs and explicit remaining gaps
```

The target adapter should not invent a target capability merely because the Board can express it. If
the Board uses reusable template inheritance but the selected target has no equivalent source-owned
mechanism for that exact case, compilation should identify the missing target seam or deliberately
form the smallest supported target evolution—not flatten the template into hidden copies and call
that success.

### Round-trip design/runtime relationship

Once a target implementation exists, VexBoard's source-projector/lived-comparison side can close the
loop:

```text
VexBoard intended design
-> published Board revision
-> target compile / implementation candidate
-> accepted target source
-> built / lived product
-> source + journey projection back into VexBoard
-> intended vs observed comparison
```

That is the deeper meaning of VexBoard as a different form of website projection: the Board is not a
screenshot of the website and the website is not a screenshot of the Board. They are two forms tied
through stable semantic identities and an explicit target translation contract.

## AI-first authoring posture

The first version should be **AI-addressable and human-operable through one shared Board Control contract**, not a premature full manual editor. Rich natural-language authoring may remain AI-led while the same primitive operations are directly testable by a human.

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

### Whole-work perception across rightful owners

A feature should remain perceivable as one continuous development trajectory even though its truths
remain separately owned:

```text
human intention
-> VexWork formation / currentness
-> intended VexBoard design
-> feature / source home
-> implementation
-> BoardJourney / Feature Walk
-> focused + lived proof
-> completed current meaning
```

Permanent:

```text
ONE_FEATURE_TRAJECTORY
!=
ONE_SOURCE
!=
ONE_BOARD
!=
ONE_DOCUMENT

STABLE_SEMANTIC_FEATURE_COORDINATE
-> WORK_REFERENCE
-> DESIGN_REFERENCE
-> FEATURE_HOME_REFERENCE
-> IMPLEMENTATION_REFERENCE
-> JOURNEY_REFERENCE
-> PROOF_REFERENCE
```

VexBoard should compose facilities it already owns rather than invent a second lifecycle or proof
database:

```text
Work lens
  why the Work exists and where it is current

Experience / Atlas lenses
  intended human experience and source relationships

REFERENCE
  reciprocal pointers to Work, feature homes, repositories, source and proof

PORTAL
  descent into deeper design or topology without one enormous canvas

BoardJourney
  intended semantic traversal

Context Inspector
  bounded where-used, source, documentation, proof and live traversal

Source projection + lived comparison
  projected current source and observed behavior, kept distinct from intended design
```

From a completed feature coordinate, a human should be able to answer:

```text
What is this?                         -> feature home
Why did we build it?                  -> VexWork
What was intended?                    -> VexBoard
Where does it live?                   -> source / implementation
How does a human traverse it?         -> BoardJourney / Feature Walk
How do we know?                       -> focused + lived proof
What was deliberately left out?      -> sibling / parked Work
```

Reverse traversal should work from any rightful owner back toward the same stable feature coordinate.
The relationships are navigational projections; each owner keeps its own truth.

```text
INTENDED_DESIGN
!=
PROJECTED_CURRENT_SOURCE
!=
OBSERVED_LIVED_BEHAVIOR

DESIGN_COMPLETE
!=
IMPLEMENTATION_AUTHORIZED
!=
WORK_COMPLETE

IMPLEMENTATION_COMPLETE
!=
DESIGN_REASONING_DISAPPEARS

HISTORICAL_DESIGN_REASONING
!=
CURRENT_PRODUCT_OR_SOURCE_TRUTH
```

This relationship must scale down. A tiny feature should not acquire ceremonial documents or a dense
board merely because VexBoard exists. Add richer references only when real complexity, proof or
continuity pressure earns them.

The VexStream Sort / Filter library-controls feature is a useful patient-zero consumer:

```text
express its intended experience with current BoardGraph
-> link existing Work + feature home + source + journey/proof
-> observe what is awkward or impossible
-> improve the smallest reusable VexBoard relationship
-> prove that improvement against the same feature
```

Use existing stable Work/source refs first. Do not change VexWork schema or create a universal feature-
trajectory subsystem until a concrete consumer proves the present references are insufficient. This
patient zero may teach the architecture; it must not become a dependency that blocks the current
VexStream feature or VexBoard's nearer implementation frontier.

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
- one shared human/AI toolkit proving create/move/resize/layer/explicit-containment/connect;
- pan/zoom/focus;
- deterministic export/reload of BoardGraph + BoardProjection;
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

### Phase 1 — BoardGraph + shared Board Control foundation

Stable refs, node/relationship/interaction grammar, validation, semantic fingerprinting, modules/ports,
source binding, deterministic fixtures, and the first typed operation contract shared by human
tooling and AI function calls.

### Phase 2 — interactive canvas proving ground + projection

Blank scalable canvas, deterministic geometry, primitive shapes/frames/connectors,
select/move/resize/layer/explicit containment, pan/zoom/minimap, focus, deterministic export/reload,
bounded model-facing board query, and source inspectability.

### Phase 2B — spatial arrangement, routing and fractal expansion

Projection-owned layout metrics, local occupancy/spatial indexing, deterministic incremental
auto-arrangement, obstacle-aware connector routing, local space negotiation, human-pinned anchors,
inline module expansion/collapse and bounded rerouting. Human and AI invoke the same arrangement
Controls. This remains smaller than a full manual visual editor.

### Phase 2C — relational direction navigation

Semantic shape defaults, stable branch identities, branch-envelope layout, advisory fan-out
readability pressure, branch/merge visualization, cross-board PORTAL traversal, explicit
return/non-return semantics and automatic enclosing-region reflow. Prove branch topology remains
stable even when the projection reorganizes around it.

### Phase 2D — reusable templates, inheritance and variance

Canonical template sources, linked instances, parameter/slot bindings, declared variance with
required human-readable rationale, reverse usage/backlink maps, source-update propagation,
conflict visibility, nested templates and explicit make-unique/detach provenance.

### Phase 2E — asset/media library and visual guidance

External/source-bound media references, authored-asset versus screenshot-evidence distinction,
semantic names/aliases/tags, project-scoped and cross-project discovery, PNG/JPG/WebP/SVG display,
asset gallery access independent of board placement, provenance/usages, and deterministic
export/reload of media bindings.

### Phase 2F — existing-system reverse adoption

Source-bound adapters that project accepted existing design/implementation systems into VexBoard
without taking ownership. First proving candidates should include VexLife Universal Blueprint /
Presentation Graph and one Vextreme page/localization surface. Establish stable identity mapping,
source/proof backlinks and safe future BoardPatch -> rightful source-change proposal routes.

### Phase 2G — Context Inspector and documentation/source traversal

Selected-item side inspector over stable refs: design properties, where-used/backlinks, source,
localization, documentation, proof, screenshots and verified live coordinates. Use bounded
query/hydrate/project behavior rather than a copied metadata database; visually distinguish
Board-editable fields from source-projected evidence.

### Phase 2H — localization/source synchronization

Source-aware visual text editing, canonical stringRef resolution, affected-usage mapping,
translation staleness/completeness projection, screenshot/layout proof freshness and exact
synchronization warnings that feed publish readiness without making VexBoard the localization owner.

### Phase 3 — prototype simulation and BoardJourney

Clickable controls, conditions, scenario state, overlays, loops, Back/Return, right-side walk stack, and revisit.

### Phase 3A — animated semantic traversal

Relationship-aware pan/zoom/focus transitions, destination centering, portal/map-change animation,
return/revisit animation and reduced-motion equivalents that help the human perceive a semantic move
without making camera motion the source of traversal truth.

### Phase 3B — publish readiness and Board releases

Reachability/path-closure analysis, explicit terminal/open/handoff/return classification, incomplete
branch detection, unreachable/trap diagnostics, navigable warnings, acknowledged known-open releases
and immutable/versioned Board release fingerprints.

### Phase 3C — target blueprint compilation

Target-specific adapters that translate a published Board revision into a reviewable implementation
plan/source candidate while preserving the target repository's own source, localization, asset,
validation and lifecycle ownership. Vextreme is a strong future proving target because its page,
viewmodel/index, localization and Vextreme-Assets contracts are already source-addressable.

### Phase 4 — AI BoardPatch authoring

Intent-to-patch, anchored conversation, validation, minimal-movement relayout, material-change preview, undo/redo lineage, and reusable module extraction.

### Phase 5 — source projectors and lived comparison

VexWork Process/Work/Project adapters, Atlas adapters, target-source projectors,
intended-versus-observed Journey comparison, and implementation-brief output. This phase closes the
round trip by projecting accepted real source/lived behavior back against the published Board
revision rather than assuming successful compilation means the product matches the design.

### Phase 6 — advanced direct manipulation and collaboration

Richer manual editing, multi-select/align/distribute, advanced connector editing, multi-user
collaboration, comments, voting, permissions and richer media. Basic create/move/resize/layer/
contain/connect operations are intentionally proven earlier through the shared Board Control
contract rather than postponed until this horizon.

## Semantic-topology patient zero — VexBusinessFactory

VexBusinessFactory is now the first explicit pressure test for using VexBoard as a reusable semantic-topology substrate rather than a domain-specific diagrammer.

Durable source:

```text
projects/vexboard/VEXBUSINESSFACTORY-INTENT-TOPOLOGY-PATIENT-ZERO.md
projects/vexboard/examples/vexbusinessfactory-intent-topology.board.json
```

The patient zero begins from:

```text
"What do you want to make possible?"
```

and maps intention through reusable semantic need-spots such as value, actors/roles, capability, capacity, offer, availability, commitment, exchange, realization, outcome, evidence, exception/recovery, reconciliation and learning/evolution.

The design deliberately keeps two vocabularies separate:

```text
VexBoard relationship family
  FLOW | TRANSITION | DATA | REFERENCE

domain relationship role
  SERVES | REQUIRES | PROVIDED_BY | AVAILABLE_THROUGH
  COMMITS_TO | FULFILLED_BY | EVIDENCED_BY | RECOVERED_BY
  RECONCILES_WITH | EXTENDS_WITH | ...
```

Business-specific roles should initially project through current VexBoard relationship families rather than inflating the BoardGraph core enum. A future orthogonal relationship-role reference is earned only if repeated patient-zero pressure proves it belongs in BoardGraph.

The same source also preserves:

- questions as a typed compiler into semantic slots;
- OTHER only inside a known category/need-spot rather than unscoped semantic escape;
- profile/module composition instead of one permanent industry class;
- business evolution through linked template/module additions and declared variance;
- one source projected through executive, education, operations, provider, beneficiary, capacity, readiness and evolution lenses;
- VexBusinessFactory itself as a recursive self-test;
- a threshold requiring one genuinely different non-business consumer before extracting a universal semantic-factory contract.

This patient zero now also carries a perspective/aliveness/coordination companion:

~~~text
projects/vexboard/VEXBUSINESSFACTORY-PERSPECTIVE-ALIVENESS-AND-COORDINATION.md
~~~

That source preserves:

- actor-centered inverse projections over one shared semantic topology;
- customer/beneficiary journeys without duplicated business truth;
- recurring organizational functions such as SENSE / INTERPRET / DESIGN / COMMUNICATE / REALIZE / CARE / ASSURE / LEARN / EVOLVE / COORDINATE rather than fixed department requirements;
- a business aliveness loop from observation -> interpretation -> proposal -> coordination -> implementation -> verification -> learning;
- explicit compatibility classes for concurrent adaptations (DISJOINT, COMMUTATIVE, ORDER_DEPENDENT, SHARED_READ, SHARED_PARAMETERIZED, EXCLUSIVE_RESOURCE, OVERLAPPING_MUTATION, CONTRADICTORY, CYCLIC_WAIT, UNKNOWN);
- reuse/variance/detachment semantics for avoiding accidental duplicated truth;
- the requirement that conflict coordination preserve separate rightful owners instead of centralizing every domain into one mega-owner.

This patient zero also preserves a future VexWorld discovery/network pressure:

~~~text
projects/vexboard/VEXBUSINESSFACTORY-VEXWORLD-DISCOVERY-AND-OPPORTUNITY-LAYER.md
~~~

That source does **not** change current VexWorld purpose. It records a possible future bridge in which BusinessFactory publishes a bounded public business presence and VexWorld later projects opt-in discovery, learning, collaboration, supplier/customer and career-exploration opportunities through transparent user-selected lenses rather than opaque ranking.

Current VexWorld remains separately owned and currently has no production networking or commerce authority.

This is architecture/patient-zero source only. It does not grant Canvas Projection authority, mutate provider/business truth, or make VexBoard the BusinessGraph owner.

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

## Evidence companions — expected visuals, manual references and observed proof

Real processes often need visual context that is **not** BoardGraph meaning.

Examples:

~~~text
Stripe setup step
  semantic meaning:
    "Open Developers -> API keys"

  expected visual:
    placeholder describing what the human should see

  reference context:
    manually supplied Stripe screenshot / third-party walkthrough image

  observed proof:
    screenshot captured while a real person/crawler/device performs the walk
~~~

Do not add screenshot bytes, image URLs or visual-proof lifecycle to BoardGraph nodes merely because the
same process step needs visual evidence.

The first earned companion shape is:

~~~text
BoardGraph / BoardJourney
  semantic truth and traversal

BoardEvidence
  evidence slots
    stable expectation attached to one semanticRef

  evidence artifacts
    REFERENCE
      illustrative/manual/third-party visual context

    OBSERVED
      one concrete captured observation
      optionally bound to Journey + step + interaction + configuration
~~~

A slot may exist with **zero artifacts**. That is the expected-image placeholder:

~~~text
semantic step exists
+ evidence slot says what visual context is expected
+ no image captured yet
~~~

Later, multiple artifacts may bind to the same slot without changing the semantic process:

~~~text
one stable evidence slot
  -> reference screenshot
  -> manually observed screenshot
  -> crawler/device screenshot
  -> desktop/mobile/locale/accessibility variants
~~~

This follows the VexLife ScreenCrawler lesson that the semantic frame and the execution configuration are
different coordinates. Configuration/capture variants must not create a second process identity.

Permanent:

~~~text
EVIDENCE_SLOT != BOARD_NODE
IMAGE_ARTIFACT != PROCESS_TRUTH
REFERENCE_SCREENSHOT != OBSERVED_PROOF
OBSERVED_SCREENSHOT != PRODUCT_ACCEPTANCE_BY_ITSELF
PLACEHOLDER_WITHOUT_IMAGE != MISSING_PROCESS_STEP
CONFIGURATION_VARIANT != NEW_SEMANTIC_STEP
BOARD_EVIDENCE != ASSET_BINARY_STORAGE
~~~

Image bytes remain in a rightful asset/file surface. BoardEvidence carries stable asset/source refs and may
carry a content hash when bytes are available; it does not embed base64 image payloads into BoardGraph.

This companion is also the seam for later intended-versus-observed comparison:

~~~text
expected evidence slot
+ reference context
+ observed artifact(s)
-> compare / inspect
-> human or proof owner decides meaning
~~~

VexBoard presentation may later render placeholders, galleries and expected-vs-observed comparisons. That
UI should be added only after the current single-file browser surface is decomposed enough that evidence
presentation does not enlarge `vexboard/index.html` into another semantic owner.
### Presentation decomposition before evidence UI

The current browser proving surface is still concentrated in `vexboard/index.html`. That is acceptable for
the foundation that already shipped, but it should not be the growth surface for evidence, federation, richer
prototype views or additional source projectors.

The next structural presentation slice should extract existing responsibilities rather than introduce a new
framework:

~~~text
vexboard/index.html
  shell / state wiring / composition only

vexboard/ui/renderer.mjs
  canvas items / edges / projection rendering

vexboard/ui/inspector.mjs
  stable identity / source refs / bounded-neighborhood inspection

vexboard/ui/journey-panel.mjs
  BoardJourney walk / choices / return / revisit presentation

vexboard/ui/prototype-view.mjs
  prototype scenario / conditions / interaction trail presentation

vexboard/ui/evidence-panel.mjs
  expected-image placeholders / reference artifacts / observed artifacts

vexboard/ui/camera-animation.mjs
  already extracted camera movement owner

vexboard/ui/styles.css
  presentation styling
~~~

This is an incremental module split, not a React/framework migration and not a semantic rewrite.

Permanent:

~~~text
UI_MODULE_SPLIT != NEW_SEMANTIC_OWNER
EVIDENCE_PANEL != EVIDENCE_TRUTH
INSPECTOR != SOURCE_OWNER
RENDERER != BOARDGRAPH
~~~
## Current continuation

Accepted source and canonical VexWork projection are now aligned through the navigation foundation:

~~~text
BoardGraph
  PR #66 MERGED / VERIFIED
  merge = 1f19e70a397baab1f5d995bacc2358372b93563e

Canvas Projection
  PR #88 MERGED / VERIFIED
  merge = 666001854babc14b5e956d65d66f0c6432e72349

BoardJourney
  PR #91 MERGED / VERIFIED
  merge = 0a5d36632400f4ff6e7478a2fc9805bc8b9d7c8b

typed prototype simulation
  PR #93 MERGED / VERIFIED
  merge = c1c50a226bf80066a59f8d9daded9b75f0fb814e

clickable simulation + explicit interaction trail
  PR #95 MERGED / VERIFIED
  merge = 4d28fd33e271991fe0257c94acf5ebdce87a2f2b

VexBoard Workgraph currentization
  PR #100 MERGED / TREE-EXACT
  merge = ebd405561aea8bf9f48e5e6f12485bd122ebeffd

animated semantic traversal focus
  PR #98 MERGED / TREE-EXACT
  merge = 2c37fcb4e90aa45f96bc8a9e42d970a62b85b4a6

read-only Source Projectors
  PR #108 MERGED / VERIFIED
  merge = 3278edf9c39b58ef4f59be9e239875518d6c2abf

Source Projectors currentization
  PR #109 MERGED / VERIFIED
  merge = 928ee2c2e2b5d73fa1ac5c71a50c0bf4d6f40845
~~~

The accepted Workgraph therefore truthfully exposes:

~~~text
BoardGraph                 COMPLETED
Canvas Projection          COMPLETED
BoardJourney + simulation  COMPLETED

BoardPatch                 READY / NO_AUTHORITY / NO_EFFECTS
Source Projectors          RUNNING / AUTHORIZED_BOUNDED / EFFECTS_BOUND

VexBoard root              DECOMPOSED
~~~

PR #98 is a presentation enhancement inside the accepted Canvas/Journey substrate; it does not create a second lifecycle owner or imply that BoardPatch/source projection is implemented.

For the VexBusinessFactory patient zero this means:

~~~text
semantic architecture                    MATURE_ENOUGH_TO_PRESERVE
current-schema BoardGraph example        PRESENT
read-only canvas substrate               ACCEPTED
semantic BoardJourney substrate          ACCEPTED
typed/clickable simulation substrate     ACCEPTED
animated semantic focus                  ACCEPTED / PRESENTATION-ONLY
educational/perspective projections      ARCHITECTURE_SOURCE_ONLY
provider / business source adapters      NOT_YET_IMPLEMENTED
generic board source resolver            BOUNDED_STATIC_CATALOG_CONTRACT_PRESENT / PR #115
cross-board Journey coordinates          NOT_YET_IMPLEMENTED
lived screenshot evidence loop           NOT_YET_IMPLEMENTED
AI BoardPatch / business mutation         NOT_YET_IMPLEMENTED
~~~

The first implementation pressure after this architecture converges should stay read-only and source-owned. VexWork PR #103 is a useful non-business patient zero because it addresses one canonical VexWork process through the accepted BoardGraph/BoardProjection/BoardJourney contracts while deliberately keeping the current built-in resolver as a bounded proving fixture.

That patient zero must inform—but must not silently define—the scalable contract:

~~~text
VexBusinessFactory topology
+ VexLife Atlas / Process Map lineage
+ VexWork Process / Work projection
-> pressure stable boardRef resolution
-> pressure bounded neighborhoods + source backlinks
-> pressure (boardRef, semanticRef) Journey continuity
-> pressure Control + current truth -> resolved Act

!= copy source ownership into VexBoard
!= make VexBoard the process registry
!= make VexBoard the executor
~~~

The first Source Projectors slice is now accepted and active, but broader resolver/federation or semantic-factory extraction still waits for repeated consumer pressure. RUNNING / AUTHORIZED_BOUNDED / EFFECTS_BOUND names only that bounded active outcome; it does not grant BoardPatch authority, target-repository mutation, or completion of lived comparison.

The later lived usability pass also exposed one concrete interaction-pressure case: a projection item may be both draggable and semantically actionable, so pointer-down must not silently decide that the user's intent was MOVE_ITEM before click-versus-drag is resolved. Treat that as an interaction-plane / gesture-arbitration problem, not as permission to make z-order, containment or semantic kind own pointer precedence.

The broader architecture convergence is now:

~~~text
stable semantic identity
+ explicit topology / containment / portal relationships
+ bounded reusable projection
-> Experience / Process / Architecture / Work / Atlas lenses
-> optional target-specific realization
-> observed/source/proof relationships

VexLife-Android Screen Blueprint / Elements / Vex Compose
  = one proven native realization pressure

VexLife Blueprint Source of Truth
  = one proven portable mapping/parity/proof lineage

VexWork Process Map / Workgraph
  = rightful work/process navigation owners

VexBoard
  = visual authoring / projection / traversal / simulation substrate
~~~

This clarification does **not** create a new universal schema, new Android dependency, new process registry, or new implementation task by itself. The next implementation should still be earned by a bounded consumer: first repair gesture arbitration where lived use exposed it, then let UI/process consumers pressure the smallest shared identity/layout/resolution seams rather than prebuilding a giant framework.

No human host action is required to preserve this design.

<!-- [VXG RealForever][VEXWORK][VEXBOARD][PROJECT-ARCHITECTURE] -->
