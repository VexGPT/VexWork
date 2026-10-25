# VexBoard — Semantic Blueprint IDE Foundation

[VXG RealForever]

## Why this source exists

VexBoard began as a semantic canvas and now has enough real consumer pressure to make a larger reusable pattern explicit:

> VexBoard is a living semantic Blueprint IDE: one bounded visual/perceptual surface where a human and AI can understand current truth, author intended meaning, traverse scoped neighborhoods, construct target realizations, inspect source/work/process context, and compare evidence without collapsing those rightful owners into one mega-state.

This document owns that reusable architectural pattern and its worked examples.

It does not create a new universal wire schema, replace BoardGraph, replace the VexWork Workgraph,
replace repository-owned feature/process source, or transfer product/runtime authority into VexBoard.

The existing VexBoard README remains the Project entry and broad architecture source. This companion
exists so future instances do not have to reconstruct the recursive IDE pattern from scattered
examples or predecessor conversations.

## The reusable loop

~~~text
human intention / question
        |
        v
rightful semantic identity
        |
        v
bounded neighborhood + selected lens
        |
        +-> inspect current source truth
        +-> author / propose intended meaning
        +-> traverse Journey / relationships
        +-> inspect Work / Process / proof
        |
        v
published / accepted Blueprint meaning
        |
        v
target construction mapping
        |
        v
target-native realization
        |
        v
expected/reference representation
        |
        v
lived / observed evidence
        |
        v
compare / currentness / drift
        |
        +-> preserve accepted truth
        +-> form bounded next work when needed
        +-> return / continue
~~~

The same pattern should remain recognizable whether the selected semantic scale is a button, Screen,
feature, process, Project, architecture component, organization capability, or later a whole company.

~~~text
SAME_RECURSIVE_IDE_PATTERN
!= SAME_SEMANTIC_OWNER
!= SAME_NODE_KIND
!= SAME_TARGET_ADAPTER
!= ONE_MEGA_BOARD
~~~

## One identity, many lenses

A semantic coordinate may participate in several projections without being recreated for each one.

~~~text
PRODUCT
  what the feature / process / system means now

DESIGN
  intended UX / presentation / topology / constraints

CONSTRUCTION
  portable -> target mappings and target capability gaps

SOURCE
  exact repository / file / symbol / contract ownership

EVIDENCE
  expected/reference visuals, observed screenshots, proof and currentness

WORK
  VexWork lifecycle, dependencies, active changes and current attention

PROCESS
  rightful repository/work-system process for how this class of work proceeds

ARCHITECTURE
  components, interfaces, data movement, boundaries and owners

HISTORY
  accepted prior revisions, historical observations and lineage
~~~

These are bounded projections around connected stable identities, not independent truth databases.

~~~text
LENS != SOURCE_OWNER
WORK_VIEW != WORKGRAPH_OWNER
PROCESS_VIEW != PROCESS_OWNER
SOURCE_VIEW != SOURCE_OWNER
EVIDENCE_VIEW != PRODUCT_ACCEPTANCE
CONSTRUCTION_VIEW != TARGET_AUTHORITY
~~~

## Identity overlays — one coordinate, switchable view lenses

A human should not have to read the same feature three or four times merely because process, design,
evidence and construction all matter.

The preferred interaction is closer to a map changing between street, satellite and terrain views:

~~~text
one stable semantic identity / neighborhood
        |
        +-> JOURNEY view
        |     process / interaction path
        |
        +-> SCREEN / DESIGN view
        |     bounded surface frame + controls + constraints
        |
        +-> EVIDENCE view
        |     expected / reference / observed visuals aligned to the same identities
        |
        +-> CONSTRUCTION view
        |     portable intent -> target mapping -> target renderer/source
        |
        +-> SOURCE / DIAGNOSTIC view
              exact refs, relationships, ownership and proof
~~~

The user may switch the primary lens, optionally layer bounded overlays, and return without reminting
the feature or losing the selected semantic coordinate.

~~~text
IDENTITY_OVERLAY != NEW_SEMANTIC_IDENTITY
VIEW_LENS != DUPLICATED_BOARD
LENS_SWITCH != SOURCE_MUTATION
LENS_SWITCH != CAMERA_HISTORY
PALETTE_MODE != VIEW_LENS
SCREENSHOT_LAYER != BOARDGRAPH_NODE_KIND
~~~

The existing color/palette control is a useful interaction precedent because it already teaches that
the same Board can be presented differently without changing semantic truth. A future lens selector
may live near that surface, but palette remains a visual-accessibility preference while a lens changes
which truthful projection is emphasized.

### Screen / surface frame is the visual-design starting container

When the selected lens is Screen / Design, authoring should begin with a bounded surface rather than
placing controls directly onto an effectively infinite process canvas.

~~~text
semantic Screen identity
        +
reference / target viewport profile
        |
        v
bounded Screen frame
        |
        +-> child controls / regions
        +-> START / END / TOP / BOTTOM / BASELINE constraints
        +-> spacing / sizing / containment relationships
        |
        v
resolved visual projection
~~~

The frame answers a practical design question:

> What surface am I designing inside?

The viewport/profile may be target-specific when the design is intentionally target-specific, or may
represent a portable size/aspect class when the Blueprint is still target-neutral. Exact physical
pixels are not automatically canonical meaning.

~~~text
SCREEN_FRAME != PHYSICAL_DEVICE
VIEWPORT_PROFILE != PRODUCT_IDENTITY
REFERENCE_BOUNDS != PORTABLE_LAYOUT_INTENT
TARGET_LOGICAL_SIZE != PHYSICAL_PIXEL_SIZE
~~~

One semantic Screen may therefore be projected through more than one viewport profile without
creating multiple Screens:

~~~text
screen.vexstream-music

JOURNEY
  where this Screen participates in the phone <-> desktop experience

SCREEN / DESIGN
  phone portrait reference frame
  -> connection surface
  -> Find VexStream
  -> Confirm code
  -> layout constraints

EVIDENCE
  reference visual / observed screenshot aligned to those same semantic coordinates

CONSTRUCTION
  ScreenBlueprint / Elements -> Vex Compose / Compose

SOURCE
  exact repository / file / symbol ownership
~~~

This creates a path for screenshot comparison that does not require screenshots, source annotations
and process topology to occupy the same visual plane simultaneously.

### Default lens should follow the human question

A Board may expose several lenses while choosing one primary default for the current task.

Examples:

~~~text
"How does pairing work?"
-> JOURNEY

"How should this Android Screen be arranged?"
-> SCREEN / DESIGN

"Does the device still look like the accepted design?"
-> EVIDENCE

"Where does this control come from in source?"
-> CONSTRUCTION / SOURCE
~~~

The user can switch views without losing selected identity or BoardJourney context.

~~~text
SAME_IDENTITY
+ DIFFERENT_QUESTION
-> DIFFERENT_LENS
not
-> DUPLICATED_SEMANTIC_CONTENT
~~~

This is currently a foundation direction pressured by the VexStream patient zero. Do not yet mint one
universal lens enum, viewport schema or responsive-layout compiler merely from this example. The next
implementation should prove the smallest useful Screen-frame + lens-switch seam and let a second real
consumer determine what deserves extraction.

## Current / proposed / observed must remain visually separable

The IDE should answer:

> What actually exists now, what am I changing, and what did somebody/device really observe?

~~~text
CURRENT SOURCE
  accepted source / published Blueprint / rightful current product meaning

WORKING / PROPOSED
  draft Blueprint, candidate source, active Work, unresolved design

OBSERVED EVIDENCE
  one concrete historical or current observation

HISTORICAL
  accepted prior source/Blueprint/evidence that no longer represents current expectation

UNKNOWN
  required source/currentness binding is unavailable
~~~

A current node may be solid, a draft branch ghosted/dashed, and historical evidence visibly marked
without changing semantic identity merely to encode presentation state.

~~~text
CURRENT != COMPLETE_FOREVER
PROPOSED != CURRENT
OBSERVED != EXPECTED
HISTORICAL != INVALID
UNKNOWN != STALE
~~~

## Scoped neighborhood is the ordinary IDE workspace

VexBoard should not require the whole application, organization, or process universe to remain visible
while a person works on one bounded question.

~~~text
stable selected coordinate
+ bounded incoming/outgoing/parent/child/usage neighborhood
+ current Journey
+ source/work/process/evidence bindings
        |
        v
local IDE workspace
~~~

The larger graph remains addressable through explicit discovery:

~~~text
Reveal parent
Reveal children
Reveal callers
Reveal destinations
Where used?
Open containing feature
Open full Journey
Open architecture
Open Work
Open source
Open process
Open evidence/history
~~~

~~~text
LOCAL_AUTHORING_NEIGHBORHOOD != LOSS_OF_WIDER_GRAPH
IDE_SCOPE != WHOLE_SYSTEM_DUPLICATION
HIDDEN_FROM_CURRENT_PROJECTION != NONEXISTENT
BOUNDED_QUERY != COPIED_SUBGRAPH
~~~

## Enter / Return is a fractal navigation primitive

At any scale the user should be able to enter deeper meaning and return.

~~~text
Screen
-> enter modal / flow / detail Screen
-> Return

feature
-> enter one Journey
-> Return

process
-> enter one reusable sub-process
-> Return

architecture
-> enter one component detail board
-> Return

Project / Work
-> enter one current Work neighborhood
-> Return

organization
-> enter one capability / department / operating process
-> Return
~~~

BoardJourney records semantic traversal. Camera motion does not.

~~~text
ENTER != ZOOM
RETURN != CAMERA_BACK
BACK_FROM_BRANCH != UNDO
JOURNEY_HISTORY != VIEWPORT_HISTORY
~~~

## Design-authoritative construction

For an accepted Blueprint-authored surface, the target should realize the design rather than
independently redesign it.

~~~text
product / behavior meaning
        +
published VexBoard UX / presentation Blueprint
        |
        v
target construction adapter
        |
        v
target-native structural source
        |
        v
target renderer / framework
        |
        v
native/lived representation
~~~

For VexLife Android:

~~~text
portable/product meaning
+ published VexBoard design
-> Android construction mapping
-> VexLife Screen Blueprint / Elements
-> Vex Compose / Compose
-> native Android layout
~~~

Compose remains the renderer. It does not become a second design source merely because it owns
measured layout.

For existing source-owned products, reverse adoption occurs first:

~~~text
accepted target/source implementation
-> source projector
-> recovered stable semantics + presentation relationships
-> VexBoard source projection
-> explicit future authority transition if design ownership is later promoted
~~~

~~~text
TARGET_ADAPTER != TARGET_DESIGNER
TARGET_RENDERER != BLUEPRINT_OWNER
REVERSE_ADOPTION != AUTOMATIC_AUTHORITY_TRANSFER
VISUAL_SIMILARITY != SEMANTIC_EQUIVALENCE
~~~

## Portable layout uses constraints and relationships, not copied pixels

Preferred anchor vocabulary:

~~~text
START
END
TOP
BOTTOM
BASELINE
CENTER_HORIZONTAL
CENTER_VERTICAL
~~~

Use START / END instead of physical LEFT / RIGHT where the relationship should survive
right-to-left/localized presentation.

Examples:

~~~text
button.TOP -> explanation.BOTTOM + spacing.medium
button.START -> container.START
button.END -> container.END

title.START -> container.START
action.END -> container.END

label.BASELINE -> value.BASELINE
~~~

Container composition may carry:

~~~text
ROW
COLUMN
STACK / OVERLAY
SCROLL
FREE / anchored
~~~

Sizing may carry, when earned:

~~~text
CONTENT / WRAP
FILL
MATCH_CONSTRAINT-like available-axis behavior
FLEX / WEIGHT
MIN
MAX
ASPECT_RATIO
~~~

Spacing may carry:

~~~text
outer inset
container padding
anchor margin
sibling gap
content / label padding
reusable spacing metrics / tokens where repeated
~~~

The VexBoard canvas may solve those rules into exact x/y/width/height for interaction and display.
Those measured bounds are normally projection output.

~~~text
CANVAS_XY != PORTABLE_LAYOUT_INTENT
CANVAS_PIXEL_DISTANCE != TARGET_NATIVE_PIXEL_DISTANCE

portable constraint
-> VexBoard measured projection

same portable constraint
-> Android mapping
-> dp / Compose measurement
-> physical pixels

same portable constraint
-> web mapping
-> CSS layout
-> browser pixels
~~~

Target-specific exact metrics remain allowed when intentionally target-owned.

## Visual editing should resolve into design meaning

An IDE manipulation should prefer changing constraints/relationships rather than merely storing a new
pixel coordinate.

~~~text
human drags button to fill container width
-> propose:
   button.START -> parent.START
   button.END   -> parent.END
   width = FILL

human moves action beneath helper text
-> propose:
   action.TOP -> helper.BOTTOM + spacing.medium

human aligns two labels
-> propose:
   labelA.BASELINE -> labelB.BASELINE

human drags item to another semantic container
-> spatial move alone DOES NOT reparent
-> require explicit containment/reparent Control
~~~

AI requests follow the same principle:

~~~text
"make this button full width"
-> constraint patch

"give this section more breathing room"
-> spacing metric / gap patch

"move it 12 pixels right"
-> may be a target/projection-local request
-> do not automatically promote to portable design meaning
~~~

## Development itself is a source-projected VexBoard process

For Android, VexWork already routes to:

~~~text
process.vexlife-android.feature-authoring
-> repo.vexlife-android
-> docs/features/README.md
-> docs/foundation/FEATURE-EXPERIENCE-LANGUAGE.md
~~~

VexBoard may project that source-owned route and connect it to the selected feature/Screen/Work.

~~~text
understand current feature
-> select current semantic coordinate
-> draft intended change
-> review design constraints / behavior
-> publish or accept bounded Blueprint revision
-> construct target mapping
-> form target source candidate
-> target validation / review / lifecycle
-> build / lived proof
-> compare evidence
-> currentize accepted meaning
~~~

~~~text
DEVELOPMENT_PROCESS_BOARD != PROCESS_OWNER
VEXBOARD_IDE != REPOSITORY_LIFECYCLE
PROCESS_PROJECTION != EXECUTOR
~~~

## Worked example A — evolve a current Screen into a new flow

Human intention:

> From Settings, add a Manage Devices control. Enter a new device-management flow. Selecting a device
> should open Device Detail. Back should return to Manage Devices, then Settings.

~~~text
hidden wider application
        |
        v
[Settings] CURRENT
    |
    | + Manage Devices CONTROL
    v
[Manage Devices] DRAFT
    |
    | select device
    v
[Device Detail] DRAFT
~~~

BoardJourney:

~~~text
0 Settings
1 Manage Devices
2 Device Detail
~~~

Return:

~~~text
Device Detail
-> Manage Devices
-> Settings
~~~

A design patch may carry:

~~~text
ADD CONTROL
  ref = control.settings.manage-devices

CONSTRAINTS
  START -> settingsContent.START
  END   -> settingsContent.END
  TOP   -> accountSection.BOTTOM + spacing.large

INTERACTION
  CLICK -> scene.manage-devices

ADD SCENE
  scene.manage-devices

TRANSITION
  select-device -> scene.device-detail

RETURN
  device-detail -> manage-devices
  manage-devices -> settings
~~~

Construction may show:

~~~text
portable CONTROL
-> Android ButtonElement / intent
-> Screen Blueprint placement
-> VexButton / Compose
-> target source refs
~~~

## Worked example B — VexStream phone-to-desktop living Blueprint

~~~text
Desktop library
-> Phone Connection
-> pairing window
-> Android VexLife Home
-> VexStream Music
-> Find VexStream
-> confirm code
-> request access
-> desktop Allow / Deny
-> Android paired / library loading
-> songs visible
~~~

Conditional desktop entry:

~~~text
no remembered phone
-> opening Phone Connection may auto-start pairing

remembered phone exists
-> Connect another phone
-> same bounded pairing window
~~~

This is one add/connect-phone intention with conditional current-state presentation, not two duplicated
processes.

Source owners:

~~~text
VexStream Desktop
  desktop pairing/presentation/producer truth

VexLife Android
  Android Screen/connection/repository/presentation truth

Android OS
  system permission surface

VexBoard
  mapping / Blueprint / evidence / comparison experiment
~~~

Living Blueprint slice:

~~~text
source-owned semantic feature meaning
-> VexBoard semantic/spatial projection
-> portable design relationships
-> target construction mapping
-> target-native source
-> expected/reference render
-> observed evidence
-> derived currentness / drift
~~~

## Worked example C — operational process improvement

~~~text
[Order accepted] CURRENT
       |
       v
[Validate inventory] CURRENT
       |
       +----------------------+
       |                      |
       v                      v
[Available]              [Exception]
       |
       v
[Ship]
~~~

Proposed:

~~~text
Validate inventory
-> reservation check DRAFT
-> fulfillment allocation DRAFT
-> Ship
~~~

The current process remains current while the proposed branch is overlaid. The rightful operational
source remains owner.

The same IDE actions apply:

~~~text
Enter branch
Return
Reveal owner
Show Work
Show evidence
Compare current/proposed
~~~

## Worked example D — architecture evolution

~~~text
[Consumer]
    |
    v
[Current service] CURRENT
    |
    v
[Provider]
~~~

Proposed:

~~~text
[Consumer]
    |
    v
[Portable capability] DRAFT
    |
    v
[Target adapter] DRAFT
    |
    v
[Provider]
~~~

Source view resolves exact modules/contracts. Work view resolves active implementation. Evidence view
may show tests/provider observations. Enter descends into adapter detail; Return restores the prior
architecture coordinate.

~~~text
ARCHITECTURE_PROJECTION != SOURCE_OWNER
ADAPTER != CAPABILITY_OWNER
PROVIDER_STATE != PORTABLE_SEMANTIC_STATE
~~~

## Worked example E — Work and Project orientation

A Project is a human-outcome grouping over canonical Workgraph truth.

~~~text
Project outcome
-> current Work
-> dependency
-> next process
-> source repository
~~~

Selecting Work can reveal:

~~~text
why this exists
current lifecycle truth
authority / effect disposition
dependencies
source refs
relevant design
implementation
proof/evidence
next process
~~~

~~~text
PROJECT != FEATURE
PROJECT != WORKGRAPH
WORK_VIEW != WORK_STATE_OWNER
~~~

## Worked example F — localization and content evolution

~~~text
Board element / screenshot
-> stable semantic identity
-> canonical stringRef
-> source-language value
-> translations
-> where used
-> current expected render
-> observed screenshots
~~~

A proposed copy edit can show:

~~~text
EN source         PROPOSED CHANGE
JA                STALE IF SOURCE ACCEPTED
ZH                STALE IF SOURCE ACCEPTED
affected Screens  3
affected evidence 5
~~~

The localization owner remains authoritative. Enter one affected Screen; Return to the source string.

## Worked example G — evidence/currentness over time

Observed at revision A:

~~~text
semanticRef = control.vexstream.find
construction mapping = android mapping A
expected render = A
observed screenshot = A
~~~

Unrelated repository commit B:

~~~text
no relevant dependency changed
-> evidence remains current
~~~

Relevant presentation mapping C changes the control:

~~~text
old screenshot
-> HISTORICAL_SOURCE
-> retained as valid historical evidence
~~~

If expected C is current and a fresh device still shows A:

~~~text
expected C
!= observed A
-> OBSERVED_DRIFT / possible regression
~~~

Currentness is derived from relevant dependency lineage, not repository age.

## Worked example H — later BusinessFactory company formation

This is a later graduation scenario, not current screenshot-pilot scope.

~~~text
intention
-> value / beneficiary
-> business model
-> capability
-> offer
-> operating process
-> evidence / assets / documents
-> protected registration/provider action
-> current company state
~~~

Enter/Return remains fractal:

~~~text
Company formation
-> Enter legal registration
-> protected human/provider action
-> Return

Company formation
-> Enter banking setup
-> protected human/provider action
-> Return

Company formation
-> Enter storefront setup
-> construct / source / evidence
-> Return
~~~

The company-wide Board need not be one mega-map.

## Worked example I — VexBoard self-hosting

~~~text
current VexBoard Inspector
-> draft Evidence comparison panel
-> add control from current Inspector
-> enter new panel flow
-> author constraint-based layout
-> construct VexWork/VexBoard web source
-> run tests / lived browser proof
-> project accepted source back
-> compare expected vs observed
-> currentize Work
~~~

~~~text
SELF_HOSTING != SELF_AUTHORITY
VEXBOARD_CAN_DESCRIBE_ITS_OWN_WORK != VEXBOARD_CAN_BYPASS_LIFECYCLE
~~~

## Reusable IDE starting procedure

A future instance facing a new category should begin with:

1. What is the human intention?
2. What stable semantic coordinate currently owns the meaning?
3. Which source owner is authoritative now?
4. What bounded neighborhood is sufficient?
5. Which lens is needed?
6. Is this inspection, source projection, authoring, or proposed evolution?
7. What relationships/constraints should remain true rather than what pixels happen to be visible?
8. Which target adapter/renderer realizes the accepted design, if any?
9. What evidence/proof would establish the claim?
10. Where should Enter/Return preserve continuity?

~~~text
INTENTION
-> IDENTITY
-> OWNER
-> BOUNDED NEIGHBORHOOD
-> LENS
-> CURRENT / PROPOSED / OBSERVED DISTINCTION
-> ACTION
-> CONSTRUCTION / SOURCE / PROOF WHEN IMPLICATED
-> RETURN / CONTINUE
~~~

This is the reusable IDE starting point.

## What should not become universal merely because it appears here

Do not prematurely make these universal contracts:

- one Feature ontology for every repository;
- one layout schema covering every framework;
- one screenshot-hotspot registry;
- one OCR/computer-vision ontology;
- one generic target compiler;
- one process lifecycle inside VexBoard;
- one mega-map containing every system;
- one global freshness state stored on every artifact;
- one node enum for every business/architecture/domain concept;
- one design-token system before multiple targets earn it.

~~~text
REPEATED_PRESSURE -> POSSIBLE_SHARED_CONTRACT
ONE_GOOD_EXAMPLE != UNIVERSAL_SCHEMA
~~~

## What new primitives are being pressured now

The VexStream patient zero and Android construction source currently pressure:

1. a portable presentation-constraint seam between semantic Blueprint and target construction;
2. source-bound feature/Screen projection into a living Board;
3. expected/reference render + observed BoardEvidence comparison;
4. derived evidence currentness from relevant semantic/construction lineage;
5. evidence-rail / inspector presentation;
6. explicit target adapters before generic compiler extraction;
7. scoped IDE neighborhood projection around a current semantic coordinate.

Each should be implemented at the smallest rightful boundary and extracted only after repeated consumers.

## Relationship to existing VexBoard foundations

~~~text
BoardGraph
  stable semantic identity/topology

BoardProjection
  one visual occurrence/layout realization

projection composition
  local ROW/COLUMN/STACK/FREE arrangement and current spatial constraints

BoardJourney
  semantic traversal / Enter / Return / revisit

BoardEvidence
  expectation slots + REFERENCE / OBSERVED artifacts

source resolver / source projectors
  rightful source addressability and read-only projection

Context Inspector
  bounded selected-identity hydration

BoardPatch
  future reviewable human/AI design mutation

VexWork
  Work / Project / Process currentness and navigation

VexLife Blueprint Source of Truth
  portable meaning -> deterministic mapping -> target realization -> matched proof lineage
~~~

## Current patient zero and resume coordinate

~~~text
work.vexboard.vexstream-screenshot-pilot
RUNNING / IMMEDIATE
AUTHORIZED_BOUNDED / EFFECTS_BOUND
~~~

Inputs now exist:

~~~text
real cross-device screenshots
current VexStream Desktop source
current VexLife Android source
accepted VexLife Blueprint Source-of-Truth construction lineage
accepted VexBoard Graph / Projection / Journey / Evidence / composition substrate
~~~

The next implementation should prove the vertical living-Blueprint slice rather than invent another
architecture layer from prose.

## Completion shape for the reusable IDE foundation

A useful lived threshold includes:

~~~text
software feature evolution
+ source-projected development process
+ non-UI process or architecture consumer
+ living source/evidence comparison
+ scoped Enter/Return neighborhood traversal
+ constructible presentation constraints on at least one target
+ second target/domain pressure before universalizing the contract
~~~

The goal is not that every category becomes identical.

The goal is that a fresh human or AI can enter an unfamiliar category and recognize the same
trustworthy posture:

> find the identity, see the rightful truth, work locally, preserve the wider graph, construct where
> appropriate, prove what happened, and return without losing context.

<!-- [VXG RealForever][VEXWORK][VEXBOARD][SEMANTIC-BLUEPRINT-IDE][FOUNDATION] -->
