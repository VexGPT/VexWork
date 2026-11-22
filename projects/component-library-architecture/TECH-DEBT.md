# Component Library — Deferred Production Refactors / Tech Debt

`[VXG RealForever]`

## Why this file exists

Component Library Architecture is currently organizing and projecting existing Product truth.

Victor explicitly asked that this lane **not refactor production components yet**. Findings that could make future component extraction or reuse cleaner belong here until a later source-owning effort deliberately admits them.

This file is therefore:

```text
observed refactor opportunity
!= current production defect
!= authorization to change Android source
!= accepted portable-component design
```

The current A1 implementation stays read-only toward `vgong24/VexLife-Android`.

## TD-01 — Registered element realization is split across generic tree and modal helpers

Observed source:

- `architecture/elements/.../ElementCells.kt`
- `GalleryScreen.kt`
- Gallery modal specimen helpers

`VexElementTree` generically realizes most registered elements, while `DialogElement` and `ModalBottomSheetElement` are intentionally skipped there and realized through a separate modal path.

Why it may matter later:

- a future target-realization map may want one discoverable relationship from element kind to all valid realization surfaces;
- source readers currently need to know that modal realization is intentionally split.

Do **not** flatten this merely for inventory convenience. First prove whether the split is an Android-native responsibility or accidental duplication.

## TD-02 — ImageElement has no generic VexElementTree realization

Observed source:

```text
ElementCells.kt
  ImageElement -> Unit
```

The current Screen Lens still carries Image element identity, so A1 can inventory it honestly.

Future question:

> Should Image remain an intentionally custom/platform-specific realization, or has the generic element vocabulary earned a reusable image cell?

No production change is required for the Component Gallery to expose the current state.

## TD-03 — Gallery semantic element IDs retain historical `page.*` segments

`GalleryScreen.kt` explicitly documents that these semantic IDs are already observed/logged compatibility identities even though **Screen** is now the Kotlin/source destination vocabulary.

Examples:

```text
element.gallery.page.content
element.gallery.page.bottom-navigation.elements
```

This is intentional compatibility debt, not a naming cleanup target.

Future refactors must preserve identity/migration semantics; do not cosmetically rename these IDs.

## TD-04 — Component source identity is not yet a first-class Screen Lens field

Current Screen Lens gives the Component Library strong occurrence evidence:

- stable Element ref;
- kind;
- parent/children;
- style;
- intent/pathway;
- source Screen;
- realization `realizedBy` / `realizedIn`;
- localization linkage.

But it does not yet expose one canonical `sourceComponentRef` for every occurrence.

A1 therefore groups **observed source families by existing Element kind** and keeps portability `UNCLASSIFIED`.

Future question:

> Is a first-class source-component identity useful enough to add to the rightful Product/Screen Lens producer, or can accepted portable identity remain entirely downstream?

Do not add a field merely to make the inventory look symmetrical.

## TD-05 — Registered Element cells and custom Vex Compose cells are parallel reusable families

Observed source:

```text
ElementCells.kt
  registered Element -> native Compose cell

VexComposeCells.kt
  inherited semantic continuity for custom Compose presentation
```

Both are useful, but they answer different construction needs.

A later component census should make the relationship explicit before considering consolidation:

```text
REGISTERED_ELEMENT_REALIZATION
!= CUSTOM_COMPOSE_SEMANTIC_HELPER
```

The Component Gallery may show both as evidence/realization families without merging their production APIs.

## TD-06 — Accessibility relationships are not yet projected into the current Android Screen Lens

A1 reports:

```text
accessibility.state = NOT_PROJECTED
```

rather than inferring accessibility meaning from labels, roles, Material components, or Compose implementation.

Future work should first identify the rightful Android accessibility source/proof boundary and then decide whether Component Library consumes that projection.

Do not manufacture “accessible” status from component type alone.

## TD-07 — Component family grouping is intentionally coarse in A1

Current A1 families such as `BUTTON`, `CARD`, `SHEET`, and `TOGGLE` are **source-family pivots**, not accepted reusable semantic components.

For example:

```text
Delete button
Close button
Navigation button
Primary action button
```

may share the Android Button source family while preserving different semantic relationships.

A2/A3 should refine portable candidates from cross-Product evidence rather than refactoring Android into a taxonomy designed by this inventory.

## When these notes become actionable

Promote an item out of this file only when:

1. a concrete consumer or repeated failure makes the refactor useful;
2. the rightful repository/source owner is identified;
3. the production path is explicitly admitted;
4. compatibility/currentness impact is understood;
5. the proof surface matches the claim.

Until then, this file lets the Component Library learn from production without making production conform to the library.

<!-- [VXG RealForever][VEXWORK][COMPONENT-LIBRARY][TECH-DEBT] -->


## TD-08 — Conversation timeline has stable item identity but no shared repeater realization

Observed current VexLife-Prod source:

```text
VexLifeWorkspaceBlueprint.ConversationTimeline
  = static collection coordinate

VexLifeConversationContract
  durable messages carry messageRef / eventRef / sequence

VexLifeWebP1RuntimeArtifacts
  messageNode(message)
  -> item.dataset.eventRef

renderTimeline()
  -> surface.messages.map(messageNode)
  -> ui.timeline.replaceChildren(...nodes)

updateLiveTurn()
  -> deliberately preserves the already-mounted live waiting node
```

This is not presently classified as a Product defect. The browser renderer restores timeline/reasoning
viewports and deliberately avoids replacing the active streaming node.

Why it matters to Component Library:

- Android independently earned `VexStableLazyColumn` because dynamic rows need stable semantic keys,
  requested visibility and visible-item projection without making list position identity;
- current Product Conversation already owns stable durable message identity;
- the browser needs special care when replacing a mounted live row would destroy an actively used
  presentation surface;
- SwiftUI naturally wants `ForEach/List` items to have stable identity as well.

This is concrete cross-platform pressure for a **stable repeated-item presentation contract** whose
mechanics may become reusable while Conversation continues to own message meaning, chronology,
ordering and persistence.

Do not refactor the current browser timeline from this lane.

Before any Product refactor, prove the portable question on a bounded reference target and preserve:

```text
feature-owned item identity
!= list index

collection mechanics
!= item semantic owner

visible-item projection
!= canonical collection truth

live mounted presentation continuity
!= durable Conversation identity
```



## TD-09 — Companion local view selection is not one compiler-visible contract

Observed current VexLife-Prod:

```text
VexLifeWebP1.CompanionContent
  children = Conversation, Settings

VexLifeWebP1.CompanionViewSwitch
  LocalInteraction(Settings)

browser runtime
  state.view = 'conversation'        // default
  click viewSwitch
    conversation <-> settings
  renderCompanionHead
    conversation.hidden = settings
    settings.hidden = !settings
```

The lived relationship is clear:

```text
one local presentation region
-> exactly one selected child
-> default Conversation
-> local Settings/Conversation swap
-> no app-navigation depth
```

But that relationship is not yet one compiler-visible current Product contract.

Android independently has a typed Swappable/SwapTo relationship. A SwiftUI adapter would naturally
want an enum/switch or equivalent target-native local selection.

This is **not authorization to refactor the current browser implementation**. The Component Library
should hold target generation here until the rightful Product source can express:

```text
container identity
admitted child identities
default child
selected child / local selection input
swap relationship
navigation depth = NONE
```

Permanent:

```text
LIVED LOCAL SWAP
!= TARGET ADAPTER PERMISSION TO INFER SOURCE CONTRACT

BROWSER state.view
!= PORTABLE COMPONENT AUTHORITY

LOCAL PRESENTATION SELECTION
!= APP NAVIGATION
```



## TD-10 — Context Inspector modal open/dismiss is split between typed source and browser runtime

Observed current VexLife-Prod:

```text
typed VexWeb source
  ContextInspector
    depth = Modal
  ContextInspectorClose
    stable Blueprint child identity

browser runtime
  ContextReceiptView click
    -> openCurrentContext()
    -> showInspector(...)
    -> inspector.showModal()

  ContextInspectorClose click
    -> inspector.close()
```

The Product therefore already has truthful modal **identity/depth** and a lived browser-native modal
realization, but the opener/dismiss relationship is not one compiler-visible presentation contract.

Android independently distinguishes:

```text
DialogElement
ModalBottomSheetElement
open(element)
close(element)
```

Do not infer from that that every platform must preserve Android's exact modal classes.

Before a SwiftUI adapter generates `.sheet`, `.alert`, `.popover` or another modality, the rightful
Product source should make the smaller invariant explicit:

```text
modal identity
open relationship
dismiss relationship
modal content ownership
whether exact modality is required Product meaning or target choice
```

Permanent:

```text
MODAL DEPTH
!= COMPLETE MODAL INTERACTION CONTRACT

HTML dialog.showModal()
!= PORTABLE MODAL AUTHORITY

ANDROID DIALOG / BOTTOM SHEET DISTINCTION
!= AUTOMATIC UNIVERSAL TAXONOMY
```

No current browser or Android modal implementation is changed by this note.



## TD-11 — VexStream Screen Lens is source-owned but not self-pinned to its repository commit

Observed current VexStream Music main:

```text
repository head
  a70c5292cedfec32356cb9fc34aa637808047e30

v2/projection/vexboard-screen-lens.json
  sourceSnapshot.repositoryRef = repo.vexstream-music
  sourceSnapshot.roots.v2      = v2/
  sourceSnapshot.commit        = null
  sourceSnapshot.observedAt    = null
```

The Lens is still useful source-owned projection evidence, but it does not independently prove which
repository revision produced its checked-in bytes.

For the current Component Library census, VexWork binds the observation to the exact GitHub
repository head used during inspection. That external binding is evidence, not a repair of VexStream.

Why it matters later:

- a cross-Product inventory should be able to reject stale source projections automatically;
- target realization parity needs exact source/target revision coordinates;
- a future VexStream regeneration can make the Lens self-current without changing UI/Product
  semantics.

Do not mutate VexStream from this Component Library lane merely to make the census prettier.

```text
SOURCE-OWNED LENS
!= SELF-PINNED CURRENTNESS

EXTERNAL EXACT-HEAD BINDING
!= LENS REPAIR
```

