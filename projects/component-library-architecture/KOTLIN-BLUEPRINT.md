# Kotlin Blueprint + Platform Adapter — Typed Portable Presentation Architecture

`[VXG RealForever]`

## Why this exists

The Component Library now has two useful kinds of evidence:

1. **VexLife Blueprint meaning** already owns stable component identities, purposes, slots, actions, experience patterns and platform bindings.
2. **VexLife Android** demonstrates a rich typed realization in Kotlin/Compose where containment, stable identity, intents, local presentation, navigation depth, repeated-item identity and realization relationships are recoverable from source and project cleanly into Screen Lens.

The next architectural question is not:

> How do we translate Android Kotlin into Swift?

It is:

> Can Kotlin's type system be used to author the portable component/presentation relationships once, then deterministically realize those relationships into target-native source that can compile and project itself back into Screen Lens?

The answer pursued by this design is **yes, with a strict ownership boundary**.

```text
KOTLIN AS TYPED BLUEPRINT AUTHORING
!=
ANDROID / COMPOSE AS CANONICAL PORTABLE MEANING
```

## Current authority boundary

Today:

```text
vgong24/VexLife
  canonical Product Blueprint meaning
  componentRef / purpose / slots / actions / experience / platform bindings

vgong24/VexLife-Android
  Android-native realization + evidence

VexGPT/VexWork
  Component Library work truth + architecture/projection
  NOT portable Product source authority
```

Therefore the first Kotlin Blueprint work in this Project is an **architecture/compiler design**, not a silent migration of canonical VexLife JSON into VexWork.

A later source-owning VexLife change may choose Kotlin as the accepted primary authoring representation. That migration must be explicit. Until then, Kotlin Blueprint binds and projects the already-owned VexLife identities rather than inventing a second product truth.

## This compiler pattern is already proven in VexLife-Prod

This is not a hypothetical replacement architecture.

Current accepted VexLife-Prod source already proves the core layers:

```text
src/commonMain/kotlin/vexlife/blueprint/VexUiBlueprint.kt
  VexScreenBlueprint
  VexUiElementRef
  compiler-visible stable handles + parent relationships

src/commonMain/kotlin/vexlife/web/VexWeb.kt
  sealed Identity
  sealed Binding
  sealed Node
  sealed Seam / XBoundary / YBoundary
  Depth / Placement / Presentation / Interaction
  validated Frame / Region / spatial relationships

src/commonMain/kotlin/vexlife/web/VexWebAuthoring.kt
  Kotlin DSL
  -> forms the accepted VexWeb relationship objects
  != renderer
  != generator

src/commonMain/kotlin/vexlife/web/VexWebArtifacts.kt
  accepted VexWeb Surface
  -> deterministic HTML / CSS / JS
  -> semantic manifest preserving source relationships
```

The current source has already passed the important architecture separations:

```text
KOTLIN BLUEPRINT / RELATIONSHIP SOURCE
!= COMPOSE MANIFESTATION

RELATIONAL AUTHORING
!= RENDERER

RELATIONAL AUTHORING
!= GENERATOR

GENERATED HTML/CSS/JS
!= AUTHORING SOURCE
```

The browser adapter is therefore a working reference for the target-adapter idea.

The Component Library should **generalize this accepted pattern** to reusable component architecture and additional target adapters. It should not create a parallel generic Kotlin hierarchy merely because the same relationships can be renamed.

A future iOS path can follow the same shape:

```text
accepted Kotlin Blueprint / portable relationship objects
        ↓
iOS target adapter
        ↓
SwiftUI-native source + target semantic manifest
        ↓
Swift compiler / native proof
        ↓
iOS Screen Lens projection
```

The first design question is therefore:

> Which existing VexLife-Prod relationship types can be reused directly, which component-level contracts must be added, and which relationships are genuinely target-specific?

## A3 owner topology — meaning stays local, machinery may become reusable

The cross-Product census and the existing SDK architecture converge on an important correction:

```text
SAME FIRST-PRINCIPLE RELATIONSHIP
!= SAME DOMAIN
!= SAME PRODUCT OWNER
!= AUTOMATIC SHARED TYPE
```

Therefore the Component Library does **not** need one canonical global component object that owns
Android, VexLife-Prod and VexStream meaning.

The intended topology is:

```text
Product repository
  owns:
    Product purpose / domain meaning
    local state/action relationships
    local source identity
    source-specific constraints

VexWork Component Library
  owns:
    inventory / where-used
    candidate convergence
    target-pressure evidence
    trajectory and review state

Reusable SDK machinery
  may own:
    source observation
    normalized mapping/construction machinery
    target generators/adapters
    parity/proof machinery

  only after:
    multiple real consumers require the same executable invariant

Target repository
  owns:
    target-native representation
    target-specific improvements
    native build/provider proof
```

Permanent:

```text
REUSABLE MEANING
!= SHARED EXECUTABLE TYPE EQUATION

SDK MAPPING OWNER
!= PRODUCT SEMANTIC OWNER

VEXWORK CANDIDATE LAW
!= CANONICAL PRODUCT MEANING

TARGET GENERATOR
!= TARGET REPOSITORY OWNER
```

### First A3 formation core

The current census supports a deliberately small formation set.

**Reuse/generalize existing typed relationships rather than re-model them:**

1. stable identity + parent/containment;
2. semantic control/binding identity;
3. Frame / Seam / Region / Allocation spatial relationships.

**Form new relationship contracts only where cross-Product pressure has exposed a real missing
executable invariant:**

4. Stable Repeated Items;
5. Local Selection.

Stable Repeated Items already has Android + VexLife-Prod + SwiftUI target pressure.

Local Selection already has Android + VexStream source convergence, while the current VexLife-Prod
SwiftUI leg is explicitly held until Product source owns its default/current selection relationship.

The following remain census/pressure candidates, not A3 formation commitments:

- Modal Presentation;
- Local Navigation Trail;
- Anchored Overlay;
- Context Dock;
- Action Vessel / Adaptive Action Group convergence.

## The compiler shape

```text
CANONICAL PRODUCT / COMPONENT MEANING
  stable refs
  purpose
  slots
  actions
  state/projection relationships
  localization/accessibility obligations
            │
            │ typed authoring/binding
            ▼
KOTLIN BLUEPRINT
  sealed contracts
  exhaustive relationship types
  readable nested topology
  compile-time illegal-state reduction
            │
            │ deterministic compile
            ▼
PORTABLE COMPONENT IR
  language-neutral normalized relationship graph
  no Compose / SwiftUI / DOM mechanics
            │
            ├─────────────┬─────────────┬──────────────┐
            ▼             ▼             ▼              ▼
ANDROID ADAPTER      IOS ADAPTER     WEB ADAPTER   DESKTOP ADAPTER
Compose source       SwiftUI source  HTML/CSS/JS   target-native UI
            │             │             │              │
            ▼             ▼             ▼              ▼
native compiler      Swift compiler  browser proof   native compiler
+ Android proof      + iOS proof     + web proof     + target proof
            │             │             │              │
            └─────────────┴─────────────┴──────────────┘
                              │
                              ▼
                      TARGET SCREEN LENS
                      source relationships
                      target realizations
                      currentness / proof
                              │
                              ▼
                     COMPONENT LIBRARY
                 parity / divergence / where-used
```

The reverse Screen Lens is not automatic canonical writeback. It is observation and parity evidence.

## Why Kotlin is useful here

Kotlin contributes something materially stronger than a loose configuration file:

- sealed hierarchies make the admitted relationship vocabulary exhaustive;
- data classes make immutable relationship values readable;
- nested builders make containment visually match the intended presentation tree;
- value classes make stable identities distinct from labels and raw strings;
- generic contracts can preserve slot/item types without framework coupling;
- compiler errors can reject impossible combinations before a generator runs;
- when expressions over sealed contracts make target adapters visibly incomplete when the portable vocabulary evolves.

The point is not that every target speaks Kotlin.

The point is that **one strongly typed Blueprint compiler frontend can describe relationships precisely enough that each target adapter must account for them explicitly**.

## Kotlin Blueprint vocabulary — extend accepted source, do not fork it

The first instinct would be to create a new generic hierarchy such as `VexComponent / Layout / Control / Presentation`.

Current VexLife-Prod source shows why that should **not** be the default move.

We already have compiler-visible roots:

```kotlin
VexScreenBlueprint
VexUiElementRef

VexWeb.Identity
VexWeb.Binding
VexWeb.Node
VexWeb.Seam
VexWeb.XBoundary
VexWeb.YBoundary
VexWeb.Depth
VexWeb.Placement
VexWeb.Presentation
VexWeb.Interaction

VexWebAuthoring
```

These types already encode many of the relationships this Component Library was about to rediscover.

Therefore:

```text
EXISTING ACCEPTED TYPE ANSWERS THE QUESTION
-> REUSE / GENERALIZE THE RIGHTFUL OWNER

REAL COMPONENT PRESSURE EXCEEDS IT
-> ADD THE SMALLEST NEW TYPED CONTRACT

SIMILAR NAME
-> NOT ENOUGH REASON FOR A NEW ABSTRACTION
```

A component-level Kotlin Blueprint may eventually earn new contracts for things such as:

- stable repeated-item collections;
- local navigation trails;
- anchored transient overlays;
- swappable regions;
- Context Dock composition;
- canonical VexLife component slots such as Action Vessel.

But each should either compose the accepted identity/binding/spatial vocabulary or demonstrate why a new root is required.

The key target-adapter property is exhaustiveness. When a sealed portable relationship gains a new admitted subtype, every adapter should be forced to decide how that relationship is realized or explicitly held.

## Emerging cross-Product relationship — local selection

A2 has now found the same local-selection law independently in **VexLife Android** and **VexStream
Music**, with current VexLife-Prod providing a third lived-but-not-yet-typed pressure.

This is strong enough to state the candidate relationship precisely, but not yet to accept a portable
Kotlin type.

```text
Local Selection
  subjectRef
    stable region/container whose expression is selected

  owner
    source owner of current selection

  defaultRef
    explicit initial/default child

  exhaustive
    whether the declared choices cover the owner's full admitted child set

  choices[]
    targetRef
      admitted child expression

    selectorRefs[]
      one or more stable controls that select this child

    condition / selection coordinate
      source-visible current-selection rule

    realizes[]
      optional descendants/relationships projected when this child is active

  gate?
    optional outer presence/selection predicate
```

Important laws earned by the census:

```text
SELECTED CHILD
!= FEATURE DOMAIN STATE BY DEFAULT

LOCAL SELECTION
!= APP NAVIGATION DEPTH

SELECTOR
!= SELECTED CHILD

ONE CHILD
MAY HAVE
MULTIPLE SELECTORS

EXHAUSTIVE SELECTION
!= PARTIAL / BOUNDED SELECTION

GATE
!= CHILD SELECTION
```

### Android pressure

Android Gallery already has:

```text
SwappableContainerElement
  defaultChild

swapTo(container, child)
  -> validates local peer selection
  -> no Screen navigation / Back depth
```

### VexStream pressure

VexStream independently owns the same relationship through browser/desktop-native source.

Its current Screen Lens exporter projects:

```text
presence.vexstream.discover.mode
  kind        SELECTION
  subjectRef  discover-mode-selection
  owner       DiscoverNavigation
  defaultRef  PC
  exhaustive  true
  choices
    PC       selectorRefs [discover.mode.pc]
    YouTube  selectorRefs [discover.mode.youtube]
    Explore  selectorRefs [discover.mode.explore]
```

The Library selection adds a new pressure:

```text
Songs child
  selectorRefs
    shell.view.songs
    library.mode.songs

Albums child
  selectorRefs
    shell.view.albums
    library.mode.albums
```

So selector identity cannot be collapsed into child identity.

The Shell selection adds another:

```text
exhaustive = false
```

meaning a bounded projected selection may truthfully expose only the relationships currently admitted
to the Lens without claiming a closed universal child set.

### Current VexLife-Prod pressure

The Product visibly has:

```text
CompanionContent
  Conversation
  Settings

default runtime view = Conversation
view switch
  Conversation <-> Settings
```

but the default/selected-child contract is still split between typed VexWeb source and browser
`state.view`.

Therefore the Component Library must **not** generate a SwiftUI enum/switch from those runtime strings
yet. That target pressure remains held until current Product source owns the relationship explicitly.

### Kotlin implication

If this survives the rest of A2, a future typed Kotlin form may look conceptually like:

```kotlin
sealed interface LocalSelection<Choice : StableRef> {
    val subjectRef: ElementRef
    val defaultRef: Choice
    val exhaustive: Boolean
    val choices: List<SelectionChoice<Choice>>
}

data class SelectionChoice<Choice : StableRef>(
    val targetRef: Choice,
    val selectorRefs: List<ElementRef>,
)
```

That is **illustrative**, not accepted source API.

The important thing is that a future compiler would consume an already-owned selection relationship.
It would not infer one from hidden/visible DOM state, Compose branches, or SwiftUI view conditionals.

## Emerging cross-Product relationship — local navigation

A2 also has two independent Product witnesses for navigation that happens **inside one already-selected
Screen/surface**.

### Android

```text
NavigationTrail<T>
  root
  path
  current
  depth
  canGoBack
  push(destination)
  goBack() -> false at root

NavigationDirection
  Forward / Backward
  changes with the same mutation that changes path
```

The explicit law is:

```text
LOCAL TRAIL
!= APP SCREEN NAVIGATION

BACK AT LOCAL ROOT
-> YIELD TO OUTER BACK OWNER
```

### VexStream

Playlists independently owns:

```text
overview
-> open(playlistID)
-> detail

detail
-> close()
-> overview

reconcile(current playlist IDs)
-> selected playlist disappeared
-> return to overview
```

That adds a law Android's generic trail did not need to express:

```text
LOCAL TARGET IDENTITY MAY DEPEND ON DURABLE FEATURE DATA

TARGET DISAPPEARS
-> RECONCILE LOCAL LOCATION

DO NOT
-> keep a dead detail route
```

### Candidate shape

A future portable contract may therefore need enough meaning to represent:

```text
LocalNavigation
  scopeRef
  rootRef
  currentRef / current target
  local depth or path
  canGoBack
  push/open
  back/close
  outer-back fallthrough
  optional target reconciliation
  optional direction projection
```

It must **not** automatically own:

- primary app navigation;
- durable feature data;
- process-death restoration;
- transition animation technology.

A target may realize this through Compose `AnimatedContent`, SwiftUI `NavigationStack`, a local
conditional/detail surface, or another native structure. Those manifestations are downstream of the
local-location relationship.

This remains an A2 candidate because no second native target has yet proved which of path/depth,
detail identity, direction and reconciliation belong in the smallest portable contract.

## Semantic action binding is not native event wiring

A portable control should bind to stable semantic meaning, not to a framework callback body.

```kotlin
Action(
    ref = component("conversation.send"),
    actionRef = action("conversation.send"),
    content = TextSlot(...),
)
```

Android may realize that as:

```kotlin
Button(onClick = { dispatcher.activate(actionRef) }) { ... }
```

iOS may realize it as:

```swift
Button {
    dispatcher.activate(actionRef)
} label: {
    ...
}
```

Web may realize it as:

```js
button.addEventListener("click", () => dispatcher.activate(actionRef))
```

Those are target realizations of one relationship.

```text
BUTTON CALLBACK
!= ACTION MEANING
```

This follows the VexArchitecture presentation law:

```text
semantic State / action meaning
-> projection / presentation meaning
-> platform manifestation
```

A Switch, segmented control, menu item, voice action or another future surface may manifest one semantic relationship without redefining it.

## Nested topology should remain readable in code

Android's strongest UI lesson is not `@Composable`.

It is that nested source can make the intended containment visually obvious:

```kotlin
screen(Home) {
    flow(ref = body) {
        surface(ref = systems) {
            action(ref = familyConversation, actionRef = openFamily)
            action(ref = maps, actionRef = openMaps)
        }
    }
}
```

A portable Kotlin Blueprint should preserve that readability.

Then:

```text
source nesting
-> typed parent / slot relationship
-> normalized IR edges
-> target-native nesting
-> target Screen Lens containment
```

The **source ownership/containment relationship** must remain stable, but the target manifestation tree may legitimately differ when the platform has a stronger native composition. The adapter must make that transformation explicit: every source node keeps its identity, and the target manifest records the target role / realization rather than making a future reader reverse-engineer native syntax.

## Portable IR

The compiler boundary should produce a deterministic language-neutral graph.

Conceptual record:

```text
componentRef
kind / role
parentRef
slotRef
children
semanticActionRef
state/projection binding
presentation relationship
layout relationship
localization slots
accessibility obligations
identity rules
platform constraints
source/provenance refs
```

This is the exchange boundary used by target adapters, parity tools and the Component Library.

```text
KOTLIN AST
!= PORTABLE IR

PORTABLE IR
!= TARGET SOURCE

TARGET SOURCE
!= NATIVE PROOF
```

The Kotlin source is a strong authoring representation; the normalized IR prevents every downstream adapter from depending on Kotlin compiler internals or Android source structure.

## VexWebArtifacts is the first target-adapter reference implementation

The current browser generator already has the properties an iOS adapter needs to preserve:

```text
validated typed relationship source
-> deterministic target-native artifact generation
-> stable source identities retained in output
-> separate semantic manifest
-> generated geometry derived from relationships, not authored pixels
-> byte-determinism proof
```

Current browser output:

```text
index.html
vexweb.css
vexweb.js
vexweb-manifest.json
```

The manifest preserves relationships such as:

```text
ref
sourceParentRef
containerRef
Placement
Depth
Presentation
Interaction
Binding / Fallback
Frame / Seam / Region geometry projection
```

That semantic manifest is conceptually the bridge into Screen Lens.

For iOS, the analogous bundle may eventually be:

```text
generated Swift source
target resource/catalog source where needed
vex-ios-manifest.json
```

The exact file split should be earned by the Swift/Xcode target, not copied mechanically from the browser bundle.

## Target adapters

A target adapter must be exhaustive over the portable relationship vocabulary.

Conceptually:

```kotlin
interface VexPlatformAdapter<TargetModule> {
    val platform: PlatformRef

    fun realize(
        blueprint: PortableComponentGraph,
    ): TargetModule
}
```

An iOS adapter might map:

```text
Flow / Row           -> VStack / HStack or platform-appropriate layout
Stack                -> ZStack
Action               -> Button
Toggle               -> Toggle
Field                -> TextField / SecureField as contract requires
Modal                -> sheet / fullScreenCover / alert according to presentation contract
StableRepeater       -> ForEach with stable identity
LocalTrail           -> local NavigationStack/path realization
AnchoredOverlay      -> target-native overlay/popover realization
ContextDock          -> native pager + reveal mechanics
```

But mapping by similar class name is insufficient.

Each adapter must preserve the portable obligations:

- identity;
- containment;
- semantic action binding;
- state/projection ownership;
- local-vs-screen navigation depth;
- modality;
- repeated-item identity;
- accessibility;
- localization;
- platform constraints.

If SwiftUI cannot preserve one obligation directly, the adapter reports a target-specific disposition instead of silently approximating it.

## Native source should remain native

Generated iOS source should look like iOS source.

The goal is **not** Kotlin-shaped Swift.

```text
portable relationship
-> SwiftUI-native structure
-> Swift compiler
-> native behavior/proof
```

The generated source may be improved by the target repository where the improvement is target-native and meaning-preserving.

Target improvements do not automatically rewrite canonical Blueprint meaning.

## Screen Lens closes the loop

Every target should be able to export its own Screen Lens.

```text
Kotlin Blueprint
-> Portable IR
-> SwiftUI generation
-> compiled iOS source
-> iOS Screen Lens exporter
-> target Screen Lens
-> compare to portable IR + accepted component obligations
```

This gives us two independent witnesses:

1. what the Blueprint requested;
2. what the target source actually says it realizes.

Later native/lived proof answers the third question:

3. what actually reached the human.

```text
BLUEPRINT REQUEST
!= TARGET SOURCE PROJECTION
!= NATIVE ARRIVAL
```

That is directly consistent with VexArchitecture's presentation boundary.

## Android becomes a pressure source, not the portable owner

Existing Android source remains extremely valuable.

It has already taught us reusable relationship shapes such as:

- stable semantic element identity;
- identity inheritance through nested Compose scope;
- semantic style keys before native styling;
- typed navigation vs local presentation intents;
- swappable child regions without app navigation depth;
- modal presentation separated from semantic ownership;
- stable repeated-item identity;
- requested visibility + visible-item projection;
- anchored overlay placement around one semantic target;
- local navigation trail with one Back owner;
- Context Dock pages whose feature meaning remains feature-owned;
- target-owned modifier/presentation policy boundary.

These are **candidate architecture relationships**.

They should be pressure-tested against iOS/web/desktop before becoming universal contracts.

```text
ANDROID PROVED A USEFUL QUESTION
!=
EVERY TARGET MUST COPY ANDROID'S ANSWER
```

## Relationship to existing VexLife component Blueprint

Current VexLife already has entries such as:

```text
component.vexlife.action-vessel
  purpose
  instanceRefPattern
  slots
    trigger
    menu
    status
    resize handles
```

and platform bindings:

```text
browser  REFERENCE_IMPLEMENTED
android  CONTRACT_SCAFFOLD
ios      CONTRACT_SCAFFOLD
windows  CONTRACT_SCAFFOLD
macos    CONTRACT_SCAFFOLD
```

The Kotlin Blueprint should bind those identities rather than create parallel IDs.

For example:

```kotlin
component(
    ref = componentRef("component.vexlife.action-vessel"),
) {
    slot("slot.action-vessel.trigger") {
        action("action.vessel.expand")
    }
    slot("slot.action-vessel.menu")
    slot("slot.action-vessel.status")
    resizeHandles(...)
}
```

The compiler can then emit the normalized contract used by platform adapters.

## The first useful proof — current VexLife-Prod Quick Actions

The first target pressure is now formed in **VexLife-Prod PR #506** rather than importing the predecessor
Action Vessel directly into current Product source.

Why:

```text
current Product authority
> attractive predecessor component
```

Current source already owns:

```text
VexLifeWorkspaceBlueprint.QuickActions
├── VexSummon
├── VisionQuickAccess
├── Speech
├── Language
├── Theme
├── ReleaseAlerts
├── Support
└── QuickActionsTrigger
```

and `VexLifeWebP1` already binds those exact identities to typed current relationships.

PR #506 pressures those relationships through a bounded `reference:swiftui` adapter:

```text
current Kotlin Blueprint handles
+ current typed bindings
        ↓
SwiftUI reference generator
        ↓
VexQuickActionsReferenceView
+ vexlife.swiftui-reference-manifest/v1
```

The first useful discovery is that **portable relationship continuity does not require literal target
tree copying**:

```text
SOURCE
QuickActions collection
├── action children
└── trigger

SWIFTUI
Menu
├── Menu actions
└── Menu label = trigger
```

The manifest therefore records both sides:

```text
source ref / parent / binding
+
target framework / component / role / binding realization
```

Current experimental target roles:

```text
QuickActions root
-> SwiftUI Menu

QuickActionsTrigger
-> MENU_LABEL
-> NATIVE_MENU_PRESENTATION

action children
-> MENU_ACTION
-> HOST_DISPATCH
```

Bounded compatibility proof on the exact candidate generator source currently shows:

```text
Kotlin generator compilation              PASS (local 1.9 compatibility harness)
deterministic generation                  PASS
generated JSON parse                      PASS
Swift 6.2.1 parse                         PASS
minimal SwiftUI API-shape typecheck       PASS
Apple SwiftUI/Xcode typecheck             OWED
repository Kotlin 2.4.20 proof            OWED
```

This does **not** make Quick Actions an accepted portable component. The catalog carries a distinct
`candidate.component.adaptive-action-group` in `SOURCE_INFLUENCED` state.

The predecessor **Action Vessel** remains a valuable later convergence target because it already owns
explicit trigger/menu/status/resize slots and platform bindings. Do not collapse it into current
Quick Actions merely because both can manifest as an action group.

The second pressure is now formed too:

```text
ConversationTimeline collection
+ durable Conversation messageRef / eventRef / sequence
        ↓
SwiftUI stable repeater reference
        ↓
Identifiable.id / ForEach / View.id

requested visible item     HELD
visible-item projection    HELD
scroll lock                HELD
content-type reuse hint    PLATFORM_SPECIFIC
```

This matters because the adapter does not need VexWeb to discover stable item identity. It composes
the Product Blueprint collection coordinate with Conversation-owned runtime identity. That is direct
evidence that a future component compiler should compose **rightful typed owners**, not force every
relationship through one universal intermediate owner.

After Quick Actions + Stable Repeater prove the construction loop, the next stronger pressures remain:

1. **Swappable Region** — local selection without navigation depth;
2. **Context Dock** — multi-axis native presentation while feature meaning remains external;
3. **Action Vessel convergence** — determine whether current Quick Actions and the predecessor
   platform-adaptive vessel share portable meaning or merely family resemblance.

A successful portable threshold eventually needs:

```text
current/canonical component meaning
-> Kotlin typed relationship source
-> deterministic portable projection
-> more than one target adapter
-> target-native source
-> target compile/proof
-> target Screen Lens
-> relationship parity / explicit divergence
```

It does not require a complete iOS application.

## Non-collapse rules

```text
KOTLIN_BLUEPRINT != ANDROID_SOURCE
KOTLIN_BLUEPRINT != COMPOSE
KOTLIN_BLUEPRINT != PORTABLE_IR
PORTABLE_IR != TARGET_SOURCE
TARGET_SOURCE != NATIVE_PROOF
SCREEN_LENS != CANONICAL_WRITEBACK
TARGET_IMPROVEMENT != AUTOMATIC_BLUEPRINT_CHANGE
PLATFORM_ADAPTER != SEMANTIC_OWNER
SOURCE_INFLUENCE != SOURCE_AUTHORITY
```

## Current next architecture edge

The Component Library should now organize two layers side by side:

```text
SOURCE FAMILIES
  what current Products already realize

ARCHITECTURE CANDIDATES
  which recurring relationships may deserve typed portable contracts
```

The Kotlin Blueprint becomes the proposed typed construction surface for the second layer.

<!-- [VXG RealForever][VEXWORK][COMPONENT-LIBRARY][KOTLIN-BLUEPRINT][PLATFORM-ADAPTER] -->
