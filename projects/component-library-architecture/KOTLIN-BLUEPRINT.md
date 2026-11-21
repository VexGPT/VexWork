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

## Proposed Kotlin Blueprint vocabulary

The exact API should be earned through real components, but the ownership shape can already be stated.

```kotlin
@JvmInline
value class ComponentRef(val value: String)

@JvmInline
value class ElementRef(val value: String)

@JvmInline
value class ActionRef(val value: String)

sealed interface VexComponent {
    val ref: ComponentRef
    val role: Role
    val children: List<VexComponent>
}

sealed interface Role {
    data object Content : Role
    data object Control : Role
    data object Input : Role
    data object Container : Role
    data object Collection : Role
    data object Presentation : Role
    data object Navigation : Role
}

sealed interface Layout : VexComponent {
    data class Flow(...)
    data class Row(...)
    data class Stack(...)
    data class Surface(...)
    data class Frame(...)
    data class Region(...)
}

sealed interface Control : VexComponent {
    val actionRef: ActionRef?

    data class Action(...)
    data class Selection(...)
    data class Toggle(...)
    data class Field(...)
}

sealed interface Presentation : VexComponent {
    data class Modal(...)
    data class AnchoredOverlay(...)
    data class SwappableRegion(...)
    data class ContextDock(...)
}

sealed interface Collection : VexComponent {
    data class StableRepeater<ItemRef>(...)
}

sealed interface Navigation : VexComponent {
    data class ScreenRoute(...)
    data class LocalTrail(...)
}
```

These names are illustrative architecture, not accepted source API yet.

The important part is the relationship split:

```text
WHAT THE COMPONENT MEANS
  Kotlin Blueprint contract

HOW ANDROID DRAWS IT
  Compose adapter

HOW IOS DRAWS IT
  SwiftUI adapter
```

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

The target adapter is not allowed to infer a different ownership tree merely because its UI toolkit prefers a different API shape.

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

## The first useful proof

Do not start by generating all of VexLife for iOS.

Use one component whose relationships are richer than a plain button.

Good first candidates:

1. **Action Vessel** — already canonical in VexLife and explicitly platform-adaptive.
2. **Stable Repeater** — tests identity and dynamic runtime rows.
3. **Swappable Region** — tests local selection without navigation depth.
4. **Context Dock** — tests multi-axis presentation while preserving feature ownership.

A successful first proof should establish:

```text
canonical component identity
-> Kotlin typed Blueprint
-> deterministic portable IR
-> Android adapter mapping
-> iOS SwiftUI source generation
-> Swift source parses/compiles on qualified target
-> generated target exports Screen Lens
-> Screen Lens preserves required relationships
```

It does not need a complete iOS application.

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
