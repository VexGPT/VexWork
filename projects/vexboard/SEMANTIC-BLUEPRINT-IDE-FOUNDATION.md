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

### Design authority transition — reverse adoption is temporary

For an existing application, VexBoard may begin by reverse-adopting accepted target source. That is a
migration/bootstrap condition, not the intended permanent design authority.

The trajectory is:

~~~text
existing target implementation
-> reverse-adopt stable identity + layout + style + behavior relationships
-> reconcile until VexBoard can reproduce the accepted target design
-> explicitly accept / publish the VexBoard design revision
-> VEXBOARD DESIGN becomes the authoritative presentation / UX Blueprint
-> target adapter consumes that Blueprint
-> target-native source / renderer realizes it
-> observed target UI returns as evidence
~~~

After that transition, ordinary design evolution should flow forward:

~~~text
VexBoard accepted design
-> deterministic target mapping
-> Android ScreenBlueprint / Elements / Vex Compose / Compose realization
-> build / render
-> observed evidence
-> compare to the same VexBoard design coordinates
~~~

The target repository still owns its target-native implementation, build, runtime and proof boundaries.
It does not independently redesign an accepted VexBoard-owned Screen while claiming to remain current
to that Blueprint.

~~~text
REVERSE_ADOPTION != PERMANENT_DESIGN_AUTHORITY
TARGET_IMPLEMENTATION_OWNER != UX_DESIGN_OWNER
TARGET_RENDERER != DESIGN_SOURCE_OF_TRUTH
ACCEPTED_VEXBOARD_DESIGN -> TARGET_REALIZATION
TARGET_REALIZATION -> OBSERVED_EVIDENCE
~~~

This is the source-of-truth transition the VexStream patient zero is intended to prove.

### Constraint bias, percentages and bounded margins are design meaning

A Screen frame should not merely store one resolved `x / y / width / height` snapshot.

For responsive/adaptable UI, VexBoard needs enough portable constraint meaning to reconstruct the
surface at another compatible viewport and to form target-native layout source.

A useful pressure model is:

~~~text
parent content box
+ semantic containment / order
+ edge anchors
+ horizontal / vertical bias
+ percentage / fractional sizing
+ bounded margins / padding
+ min / max size
+ content / fill / fixed / aspect sizing
+ row / column / stack / scroll meaning
+ alignment / baseline when earned
        |
        v
resolved occurrence bounds for this viewport
~~~

Percentages are especially useful as normalized intent when the relationship really scales with the
container. Margins and touch/readability boundaries should be bounded rather than allowed to grow or
shrink without limit.

Example pressure:

~~~text
horizontal:
  START -> parent.START
  END   -> parent.END
  bias  = 0.50
  width = 100% of admitted inner width

outer margin:
  preferred = 3.88% of reference width
  min = target-admitted compact margin
  max = target-admitted spacious margin

child:
  width = 72% of parent inner width
  START anchored
  height = CONTENT
~~~

The exact numbers are design data, not universal constants. Reverse adoption may initialize them from
the accepted Android realization; once the VexBoard revision is accepted, the VexBoard constraint is
the owner and Android becomes a target mapping.

For an existing fixed Android margin such as 16dp, reverse adoption may initially admit an exact
bounded value:

~~~text
preferredPercent = 16 / 412
minDp = 16
maxDp = 16
~~~

That reproduces the current reference viewport exactly without pretending the fixed target value is
already a cross-device responsive rule. A designer can later widen the admitted bounds deliberately.

Permanent:

~~~text
AUTHORED_CONSTRAINTS -> RESOLVED_GEOMETRY
RESOLVED_GEOMETRY != AUTHORED_CONSTRAINTS

PERCENTAGE != UNBOUNDED_SCALING
REFERENCE_DP != UNIVERSAL_DP
TARGET_DP != PORTABLE_IDENTITY

VEXBOARD_SCREEN_DESIGN
  = semantic structure
  + design tokens
  + portable / target-qualified constraints
  + state-conditioned presentation

ANDROID_LAYOUT
  = one target realization of that accepted design
~~~

A long-term VexBoard Screen renderer therefore **is** a real design renderer. Avoiding a second copy of
Compose means avoiding Android framework semantics as the portable owner; it does not mean avoiding
the rendering capability required for VexBoard to be design-authoritative.

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

## Blueprint-readable system — source is an x-ray, not a prerequisite

A living Blueprint should be sufficient for a human or AI to understand the application/system
without opening implementation source merely to discover what connects to what.

Source remains exact and inspectable, but it is an appendage/provenance layer around already-legible
Blueprint meaning:

~~~text
Blueprint experience / architecture
  -> identity
  -> structure
  -> interaction meaning
  -> state / behavior
  -> dependencies
  -> data / storage / provider relationships
  -> execution / proof relationships

SOURCE / IMPLEMENTATION
  -> exact target realization of those meanings
  -> repository / file / symbol / revision
  -> target-only mechanics and diagnostics
~~~

Permanent:

~~~text
BLUEPRINT_READABLE != SOURCE_HIDDEN
SOURCE_AVAILABLE != SOURCE_REQUIRED_FOR_BASIC_COMPREHENSION
COLLAPSED_RELATIONSHIP != AMBIGUOUS_RELATIONSHIP
NOT_RENDERED_BY_DEFAULT != NONEXISTENT
EVERY_MATERIAL_CONNECTION -> ADDRESSABLE + REVEALABLE
~~~

The ordinary surface should therefore answer questions such as:

~~~text
What Screen am I on?
What is inside it?
What can I do here?
What does that action mean?
Where can it take me?
What truth/data does this surface depend on?
What behavior or convergence produces that truth?
What storage/provider/runtime owns the deeper consequence?
What evidence proves the intended result?
~~~

without requiring the reader to reverse-engineer Kotlin, JavaScript, SQL or another target language.

### Development-space grammar — forward horizontally, branch vertically, descend for architecture

The VexStream patient zero is pressuring a useful spatial grammar for **digital/product development**
views:

~~~text
X / horizontal
  forward traversal / consequence / evolution

Y / vertical
  sibling branches / alternate paths / related optional consequences

Z / depth
  architecture beneath or behind the selected semantic coordinate
  behavior / dependencies / data / storage / provider / source / proof

T / revision-currentness
  current / proposed / expected / observed / historical lineage
~~~

This may be rendered as ordinary 2D plus enter/reveal/overlay behavior. It does not require literal
perspective 3D graphics.

Example:

~~~text
Home 1.0
    -> Home 1.1
          -> VexStream Music 1.0
                 -> Library
                 -> Track Detail
                 -> Player

Settings
    -> Account
       Notifications
       Privacy
       Devices
~~~

The primary forward path reads left-to-right. Branches consume vertical space. Deeper implementation
and architecture should not be forced onto that same primary plane merely because it is connected.

This is a development/product projection grammar, not a universal process-map law. Physical,
operational, instructional and other process maps may legitimately prefer compact ROW / WRAP /
SERPENTINE or another process-specific reading order when Screens and rich surface frames are not the
primary information.

~~~text
DIGITAL_DEVELOPMENT_LAYOUT != UNIVERSAL_PROCESS_LAYOUT
PROCESS_MAP != SCREEN_FLOW_WITH_SCREENSHOTS_REMOVED
SHARED_SEMANTICS MAY HAVE DIFFERENT PROJECTION_GRAMMARS
~~~

### One Screen identity may evolve through revisions

A design evolution should normally preserve the stable Screen identity and attach revision/currentness
meaning rather than minting a new product Screen for every edit.

~~~text
screen.home

revision 1.0
  accepted design
  expected / observed evidence where available

revision 1.1
  proposed or accepted successor
  + element.home.body.vexstream.connect
~~~

This lets a designer perceive what existed, what is changing and what the expected next state is
without confusing revision with identity.

### Unresolved interactive consequence is an explicit authoring junction

When a new interactive element exists but its consequence has not yet been bound, VexBoard should be
able to show a small explicit unresolved junction such as:

~~~text
[ Connect VexStream Music ] -> [+]
~~~

The `+` means:

> this interaction identity exists, but the intended semantic consequence has not yet been selected.

Useful bounded choices may include:

~~~text
Navigate
  -> existing Screen
  -> new Screen

Present
  -> dialog
  -> bottom sheet
  -> overlay / popover

Local presentation
  -> toggle
  -> tab / swappable region
  -> open / close

Invoke
  -> existing semantic action
  -> new bounded semantic action

Platform / external
  -> Android/system surface
  -> permission / picker
  -> external intent / deep link

Background / non-UI
  -> event / receiver / callback / scheduled or service-owned intention

Custom
  -> explicit bounded meaning not covered above
~~~

This is an authoring affordance, not a new universal node enum.

Permanent:

~~~text
UNRESOLVED_CONSEQUENCE != BROKEN_SOURCE
INTERACTIVE_UI -> SHOULD_HAVE_EXPLICIT_MEANING
INTENTION != ALWAYS_UI
UI != ALWAYS_EFFECT
BACKGROUND_INPUT MAY HAVE NO IMMEDIATE_SCREEN
STATIC_UI MAY HAVE NO_ACTION
~~~

### Screen authoring should walk from intention into construction

A newly formed Screen may progressively ask only for the meaning required to construct it:

~~~text
stable Screen identity
+ human purpose
+ initial composition / reusable components
+ interaction identities and consequences
+ data/state required by the surface
+ repository / service / provider relationships when real
+ persistence/storage relationship when real
+ execution/lifetime defaults
+ proof / evidence expectations
        |
        v
target construction mapping
~~~

The author should not have to specify Android boilerplate merely to say that a network-backed list
appears on a Screen. A target adapter may infer a reasonable execution/lifetime realization, while
keeping that inference visible and overrideable:

~~~text
DEFAULTED_EXECUTION != INVISIBLE_EXECUTION

repository/network read
-> background execution by default
-> observable state / projection
-> foreground rendering

long-lived playback
-> service/runtime owner when required

Screen-local transient selection
-> local presentation lifetime by default
~~~

A default remains inspectable architecture, not hidden magic.

### Architectural depth is progressive disclosure from the selected coordinate

The ordinary Screen/design block should expose bounded depth affordances rather than dumping the whole
application underneath every surface.

For a selected `screen.vexstream-music`, the first depth reveal might show:

~~~text
Behavior
Data / Repository
Dependencies
Storage
Provider / API
Runtime / Service
Source
Proof / Evidence
~~~

Selecting Data should initially answer only what this Screen consumes:

~~~text
VexStreamMusicRepository
  state
    connectionState
    hubState
    tracks[]
    playlists[]

  findNearbyVexStream()
  refreshCatalog()
  downloadForOffline(...)
~~~

A user may then descend:

~~~text
tracks[]
-> VexStreamTrackState
-> localCopy
-> Downloaded
-> MediaStore / local asset owner
~~~

The database/table/provider totality remains reachable but does not become the default Screen view.

~~~text
SELECTED_COORDINATE
-> BOUNDED_RELEVANT_DEPTH
-> EXPLICIT EXPAND / ENTER
-> DEEPER OWNER

SCREEN_DEPENDENCY_VIEW != WHOLE_DATABASE_DUMP
FULL_SYSTEM_ADDRESSABLE != FULL_SYSTEM_SIMULTANEOUSLY_RENDERED
~~~

### Semantic action and implementation symbol remain different coordinates

Implementation functions should be referencable, but target symbol names must not become universal
product identity merely because they are convenient to display.

~~~text
action.vexstream.find-nearby
        |
        +-> Android implementation
        |     PairedVexStreamMusicRepository.findNearbyVexStream(...)
        |
        +-> future other target implementation
              target-native symbol
~~~

A source/detail view may show:

~~~text
semantic action / relationship
implementation function
parameters
output
fields actually consumed by the selected surface
repository / provider dependencies
source location + revision
~~~

This allows the application to be read from the Blueprint while still providing Android-Studio-like
source descent when implementation detail matters.

### Local custom construction may graduate into reusable Gallery vocabulary

A feature may first create a custom local component:

~~~text
VexStream Track Card
  artwork
  title / artist
  action menu
~~~

If another independent consumer proves the same structural/design promise, that construction may be
promoted into a reusable Gallery/component template rather than copied.

~~~text
local custom construction
-> second real consumer
-> reusable component pressure
-> accepted Gallery / template vocabulary
-> future Screen reuse
~~~

Gallery is therefore a reusable visual/construction vocabulary, not a requirement that every local
composition become globally reusable.


## First reverse-adoption POC — Home -> VexStream stateful Screen + connection depth

The first executable Android-to-web bridge should remain deliberately bounded.

Do not begin by projecting the whole VexLife Android repository.

Use this patient-zero scope:

~~~text
VexLife Android product
  |
  v
Home Screen
  |
  | Open / Connect VexStream Music
  v
VexStream Music Screen
  |
  +-> library Loading projection
  +-> library Ready + Empty projection
  +-> library Ready + Loaded Songs projection
  |
  +-> toolbar Manage Connection
        -> Connection modal / bottom sheet
~~~

This scope is intentionally large enough to prove:

~~~text
static Screen / Element identity
+ navigation
+ same-Screen conditional state projection
+ local presentation / modal state
+ repository State
+ local persistence / storage
+ remote Desktop service contract
+ source provenance
~~~

without requiring the first adapter to understand every VexLife feature.

### Android reverse-adoption bridge before VexBoard becomes design-authoritative

For this existing-system patient zero, source-owned Android export is preferred over Kotlin parsing in
the browser:

~~~text
VexLife-Android accepted current source

AppScreens.registry
  + ScreenBlueprint / ElementPlacement
  + UIBlueprintRegistry ownership / parent / children / navigation targets
  + stable screen.* / element.* refs
  + VexModifier / Vex Compose identity continuity
  + bounded feature-specific state projection where static registry data is insufficient
  + target layout/style facts needed to recover the current design

        |
        v

deterministic neutral Android adoption snapshot

        |
        v

VexBoard reverse-adoption mapper

        |
        v

VexBoard semantic graph
+ VexBoard Screen Design constraints
+ reference projection
        |
        v

reconcile against accepted Android visual/runtime evidence
        |
        v

explicit design-authority transition
        |
        v

VexBoard accepted Screen Design
        |
        +-> VexBoard web/design renderer
        +-> Android construction adapter
              -> ScreenBlueprint / Elements / Vex Compose / Compose
~~~

The snapshot is therefore an **import/migration carrier**. It must not become a permanent second design
truth beside VexBoard.

The first snapshot format is a proving seam, not permission to canonize one universal cross-platform
UI schema.

It should carry only meaning required by the consumer, for example:

~~~text
source repository + exact revision
Screens
Elements
owner Screen
parent / child structure
semantic kind
style meaning when material
interaction intent
navigation / presentation target
source-native refs
identity-coverage status

bounded VexStream state facts needed by this POC
~~~

Permanent:

~~~text
WEB_PROJECTOR != KOTLIN_PARSER
VEXBOARD_RENDERER != COMPOSE_RUNTIME
ANDROID_SNAPSHOT != NEW_PRODUCT_TRUTH

BEFORE_AUTHORITY_TRANSITION:
ANDROID_SOURCE_OWNER -> EXPORTED_MEANING -> VEXBOARD_REVERSE_ADOPTION

AFTER_ACCEPTED_TRANSITION:
VEXBOARD_DESIGN_OWNER -> ANDROID_TARGET_ADAPTER -> ANDROID_REALIZATION
~~~

### Android adoption audit — keep the good foundation, standardize the mapping debt

The VexLife-Android patient zero does **not** require replacing the Android UI foundation.

Several existing Android seams are already the right long-term building blocks:

~~~text
UIBlueprintRegistry
  -> stable Screen / Element identity
  -> parent / child / owner Screen
  -> semantic style
  -> local/open/close/swap/navigation intent validation

VexModifier
  -> rendered semantic/test identity

VexComposeScope
  -> deterministic nested custom-Compose identity

VexElementStyles
  -> semantic style vocabulary rather than raw visual tokens

VexElementTree / Vex-owned cells
  -> target-native realization for ordinary Blueprint-rendered Screens

sourceAlignmentReport / verifySourceAlignment
  -> repository-owned convention validation

vexComposeMigrationReport
  -> existing advisory raw-Compose migration debt surface

ScreenCrawler
  -> stable scenario / Screen / semantic evidence identity + screenshot SHA
~~~

Do not replace these with a second VexBoard-specific Android framework merely because reverse adoption exposes gaps.

The observed debt is narrower: **custom Screen realization can preserve semantic identity while still keeping product-design meaning in target-only Compose source.**

The current VexStream Screen demonstrates the seam:

~~~text
ScreenBlueprint.content
  -> static semantic registration tree

renderContent()
  -> custom VexStreamLibrarySurface
  -> Scaffold / Column / Box / LazyColumn
  -> target dp values
  -> target MaterialTheme typography/color overrides
  -> state-conditioned native composition
~~~

That split is acceptable while Android owns the accepted current implementation. It becomes mapping debt once VexBoard is intended to own the Screen design.

Permanent distinction:

~~~text
RAW_COMPOSE != AUTOMATIC_DEBT

PLATFORM_NATIVE_MECHANIC
  -> may remain target-owned
  -> e.g. drag mechanics, MediaSession, native sheet physics, Android platform integration

PRODUCT_DESIGN_MEANING
  -> must become addressable upstream before VexBoard design authority
  -> e.g. component assignment, stable child order, padding/gap, anchors, viewport behavior,
     typography role, semantic style, state-conditioned visibility/presentation
~~~

#### Observed standardization seams

1. **Custom realization mode should be explicit and inspectable**

Today a custom Screen is discoverable by reading/overriding renderContent, but the registry does not carry an explicit realization-mode fact.

A future Android adoption/export seam should be able to distinguish at machine level:

~~~text
GENERIC_BLUEPRINT_TREE
CUSTOM_NATIVE_REALIZATION
GENERATED_FROM_VEXBOARD_DESIGN
~~~

without source-text heuristics.

2. **Static registry coverage and runtime-derived Vex Compose coverage are different**

UIBlueprintRegistry can enumerate registered static elements. VexComposeScope can also form deterministic nested runtime refs such as custom sheet text/content children.

Those runtime-derived refs are useful and truthful, but are not automatically enumerable through the static registry.

The export/inspection layer should report that distinction rather than pretending one set is total:

~~~text
REGISTERED_STATIC
DERIVED_CUSTOM_PRESENTATION
DYNAMIC_DOMAIN_OCCURRENCE
TARGET_ONLY_DECORATION
~~~

When a derived custom child carries product meaning that VexBoard should author later, either promote it into the authoritative design/component tree or expose it through one bounded dynamic-presentation template/manifest. Do not hand-copy its string ref into VexBoard.

3. **Target layout literals should migrate by meaning, not by blanket ban**

Current VexStream custom presentation legitimately contains direct target facts such as 8.dp, 10.dp, 12.dp, 20.dp, native Scaffold, LazyColumn, Row, and Material typography roles.

During reverse adoption these are target facts to recover.

After VexBoard accepts design authority, product-design values should be produced from the accepted VexBoard design / Android adapter. Target-only mechanics may remain local.

The existing vexComposeMigrationReport is the rightful repository-owned place to expose this debt. Do not create a parallel VexBoard linter.

4. **Static semantic tree must not be mistaken for exact rendered layout on custom Screens**

For ordinary Screens, ScreenBlueprint.content -> VexElementTree is both semantic structure and visible construction.

For a custom Screen such as VexStream, content is currently registry/action coverage while custom Compose owns the visible realization.

Therefore:

~~~text
CUSTOM_SCREEN_REGISTRY_TREE != PROVEN_PIXEL / LAYOUT TREE
~~~

Reverse adoption must reconcile both sources plus lived evidence. After design authority transitions, the intended direction becomes:

~~~text
VEXBOARD_SCREEN_DESIGN
-> ANDROID_TARGET_ADAPTER
-> ScreenBlueprint / registered identities
+ target-native custom realization where required
-> observed evidence
~~~

not two independently authored product layouts.

5. **A deterministic Android adoption exporter should replace manual source hunting**

The desired exporter is a build/tooling surface over existing owners, not a runtime dependency:

~~~text
AppScreens.registry
+ explicit realization mode
+ bounded feature state adapter
+ target-qualified presentation facts needed only for adoption
+ source revision
        |
        v
deterministic adoption snapshot
~~~

Stable ordering and exact refs should make repeated VexBoard imports diffable and cheap.

6. **ScreenCrawler should emit a durable evidence receipt, not only PNG + log text**

Current crawler evidence already has stable semantic identity and computes screenshot SHA-256.

To satisfy trustworthy VexBoard OBSERVED evidence, the capture path should eventually emit a durable machine-readable receipt alongside the PNG containing at least:

~~~text
scenarioRef
evidenceRef
screenId
semanticRefOrNull
configurationRef
sourceRef / exact source revision
capturedAt
contentSha256
artifact path / media identity
~~~

Then:

~~~text
ANDROID_SCREENCRAWLER_RECEIPT
-> BoardEvidence OBSERVED
~~~

can be admitted without guessing capture time from upload/filesystem/event timestamps.

#### Standardization posture

Extend existing Android repository-owned enforcement incrementally:

~~~text
sourceAlignmentReport / verifySourceAlignment
  -> Screen registration / preview / source conventions

vexComposeMigrationReport
  -> advisory migration debt
  -> progressively enforce only areas intentionally converged

AppBlueprintTest
  -> registry / ownership / intent / inherited identity contracts

ScreenCrawler
  -> lived evidence + durable provenance receipt

VexBoard Android adapter
  -> accepted design -> target construction mapping
~~~

Do not immediately ban every raw Compose import or move every target mechanic into VexBoard.

Escalate only repeated/product-design meaning that the VexBoard round trip proves must be shared.

~~~text
STANDARDIZE_MAPPING_SEAMS
!=
REIMPLEMENT_ANDROID_IN_VEXBOARD

VEXBOARD_OWNS_DESIGN_MEANING
ANDROID_OWNS_TARGET_REALIZATION
EACH_SIDE_EXPOSES_ENOUGH_PROOF_TO_COMPARE_THEM
~~~

### Identity coverage must be truthful

The current Android registry is already strong enough to enumerate static Screen/Element identity and
navigation relationships. VexModifier / Vex Compose can carry those refs into rendered Compose/test
tags, and feature-specific dynamic presentation may derive deterministic refs from domain identity.

That does not imply every visible Compose primitive is already a semantic element.

The bridge should report coverage rather than fabricate it:

~~~text
REGISTERED / SEMANTICALLY TAGGED
  -> automatically addressable

VISIBLE TARGET PRESENTATION WITHOUT A STABLE SEMANTIC REF
  -> explicit identity-coverage gap when the distinction matters

TARGET-ONLY LAYOUT / DECORATION
  -> may remain implementation detail
~~~

Do not require stable IDs for every Spacer, anonymous measurement wrapper or target-only rendering
detail merely to make a percentage look complete.

### Same Screen, conditional branches

The three VexStream library conditions are projections of one stable Screen identity:

~~~text
screen.vexstream-music

Loading
  libraryLoadState != READY
  and no already-known playable content is available for the ordinary library surface

Ready + Empty
  libraryLoadState = READY
  and current playable library is empty

Ready + Loaded
  libraryLoadState = READY
  and current playable library has content
~~~

These are not three Screens.

VexBoard may render them as vertical state branches from the same horizontal traversal coordinate:

~~~text
Home -> VexStream Music
             |
             +--◇ Loading
             |
             +--◇ Ready / Empty
             |
             +--◇ Ready / Loaded Songs
~~~

The exact visual symbol remains a presentation question, but the semantic distinction is permanent:

~~~text
NAVIGATION_BRANCH
  -> another semantic destination

STATE_BRANCH
  -> same semantic identity under another current predicate/projection
~~~

Avoid materializing the Cartesian product of every independent VexStream state facet into one giant
state enum. Connection, library loading, selected library surface, playback and transient presentation
may remain distinct current facts unless a real semantic question requires their combination.

### Connection modal proves local presentation + deeper architecture

The VexStream toolbar's existing Manage Connection action opens one registered modal/bottom-sheet
identity rather than navigating to another Screen.

The POC should preserve that difference:

~~~text
screen.vexstream-music
  -> element.vexstream-music.body.connection.manage
  -> OPEN
  -> registered ConnectionMenuSheet
~~~

The modal may then reveal the exact bounded controls that current State admits, such as Refresh when
the Hub is ready or Reconnect when it is not, plus offline-library management and Forget/Close
surfaces.

This proves:

~~~text
NAVIGATION != LOCAL_PRESENTATION
SCREEN != MODAL
OPEN/CLOSE != SCREEN_TRANSITION
~~~

### Data / storage / Desktop service lineage

For this POC, do not invent a generic `Database` box when the actual VexStream feature does not use
VexLife's Room database.

The current local truth is distributed across:

~~~text
VexStreamMusicRepository / VexStreamMusicState

pairing / remembered route
  -> app-private SharedPreferences
  -> Android Keystore protected token / signing identity

offline library restoration metadata
  -> app-private versioned offline index

verified audio
  -> Android MediaStore

artwork
  -> persistent app-private files

playback lifetime
  -> Media3 / MediaSessionService
~~~

The remote producer is current VexStream Desktop's bounded mobile service:

~~~text
GET       /v1/health
GET       /v1/pairing/info
POST      /v1/pairing/request
GET       /v1/pairing/status
POST      /v1/pairing/revoke-self
GET       /v1/catalog
GET/HEAD  /v1/media/<trackRef>
~~~

Catalog/media access is bounded behind the remembered/pinned pairing authorization path.

The web Blueprint should be able to descend from one visible Screen state through:

~~~text
Loaded Songs
-> VexStreamMusicState.tracks
-> VexStreamMusicRepository.refreshCatalog()
-> paired/pinned transport
-> Desktop /v1/catalog
-> sanitized track projection

Download / offline meaning
-> repository
-> Desktop /v1/media/<trackRef>
-> exact digest + length verification
-> MediaStore / offline index
~~~

That is enough depth to prove that the Blueprint can explain the real application architecture
without requiring the person to open Android or Go source to discover the connection.

The first web POC does not need to call a person's live LAN Desktop service directly from GitHub
Pages. Source/contract mapping and deterministic fixtures prove the semantic bridge; a later Local Vex
or host-qualified observation path may bind live service evidence to the same coordinates.


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

The next implementation should first align the **current source-owned VexLife-Android / VexStream
vertical system slice** into a Blueprint-readable map rather than invent another architecture layer
from prose:

~~~text
screen / element identity
-> Compose / presentation occurrence
-> semantic intent / VexRuntime
-> SCAE Behavior where present
-> Convergence Relay where present
-> repository / domain State
-> persistence / storage / provider
-> Android-native runtime / service
-> Journey / FeatureWalk / visual / device proof
~~~

The immediate visual pressure from the first lived VexStream Board is also now explicit:

~~~text
development traversal -> horizontal
branching / alternate paths -> vertical
architecture depth -> reveal / descend from the selected coordinate
source -> exact x-ray/provenance appendage, not a prerequisite for reading the application
every material relationship -> addressable even when collapsed from the current view
~~~

The Screen / Design lens should then evolve as one view of that richer current map, not as an isolated
phone mockup disconnected from behavior, data, construction and proof.

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
