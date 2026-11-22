# Component Library Architecture

`[VXG RealForever]`

## Human outcome

Create one cross-Product reusable component architecture so a human or AI does not have to rediscover established UI/infrastructure patterns by re-reading whichever Product implementation happened to come first.

The system should be able to answer:

```text
What reusable component/relationship already exists?
Where is it used?
What semantic/presentation contract does it preserve?
What states / slots / controls / constraints does it expose?
How is it realized in Kotlin/Compose, Web/JS/CSS, SwiftUI, C#/.NET, or another target?
Which realization is current / proven / platform-specific / held?
```

This is the code-language sibling of Localization Architecture:

```text
Localization Architecture
  one source-string meaning
  -> locale realizations
     EN / ES / JA / zh-Hans / ...

Component Library Architecture
  one accepted component meaning
  -> implementation realizations
     Kotlin+Compose / Web+JS+CSS / SwiftUI / C#+MAUI / ...
```

The analogy is useful, but the identities remain different:

```text
STRING != COMPONENT
TRANSLATION != CODE GENERATION
LOCALE VARIANT != PLATFORM REALIZATION
```

## Why this is not Android Widget Foundation

`project.android-widget-foundation` owns Android **home-screen App Widgets** and their platform/runtime relationship.

This Project uses **component** as the broader term for reusable Product/UI/infrastructure building blocks. It must not overload `Widget` and confuse an Android App Widget with a reusable button, modal, card, swappable region, list cell, inspector, or semantic/presentation composition.

## Why this is not Blueprint Source of Truth

`project.vexlife.blueprint-source-of-truth` already proved a crucial predecessor law:

```text
one Product/software intention
-> explicit portable semantic meaning
-> deterministic cross-language representation
-> platform-specific realization
-> parity/native proof
```

That Project is preserved predecessor evidence and explicitly says it is not fundamentally a Kotlin-to-C# translator.

Component Library Architecture consumes that law, but owns a different current outcome:

> Continuously inventory real components from current Products, deconstruct their reusable relationships, preserve where-used/currentness, and expose a browsable Gallery + realization map so future construction can reuse accepted patterns without source archaeology.

## Current architecture

The relational shape is:

```text
SOURCE COMPONENT / OCCURRENCE
        ↓ extraction
COMPONENT INVENTORY
        ↓
candidate reusable grouping
        ↓ evidence / review
PORTABLE COMPONENT BLUEPRINT
        ↓
TARGET REALIZATIONS
  Android / Compose
  Web / HTML+CSS+JS
  iOS / SwiftUI
  .NET / C#
  ...

PORTABLE COMPONENT BLUEPRINT
        ↕
where-used occurrences
  Product
  Screen
  Element / Container
  Feature
```

The portable Blueprint is not merely copied source. It retains only relationships that survive the target boundary.

## First patient zero — VexLife Android Gallery

Current VexLife Android already contains a real Gallery and reusable element substrate:

- `GalleryScreen.kt`
- `ElementsGallery.kt`
- `ElementCells.kt`
- `VexComposeCells.kt`
- `BlueprintRegistry.kt`

Current Gallery specimens include established identities/relationships such as:

- Button;
- Toggle;
- FAB;
- Text;
- Dialog;
- Modal Bottom Sheet;
- Swappable Container;
- Row / Column / Card / Scrollable Column;
- navigation/presentation relationships.

The first implementation should inventory these relationships rather than inventing a new component taxonomy from scratch.

## Current trajectory

### A0 — source map + portable-component model — COMPLETED in formation

Preserve the boundary between:

```text
source implementation
component occurrence
candidate reusable group
accepted portable component blueprint
target realization
proof
```

Durable architecture: [ARCHITECTURE.md](./ARCHITECTURE.md).

### A1 — Android Gallery / component inventory — COMPLETED

Extract current Android reusable components and occurrences into a machine-readable inventory.

The inventory should answer:

```text
Given element/component X:
  what kind is it?
  what slots / parameters / styles / states / intents does it expose?
  where is it used?
  what source owns it?
  what Gallery/example proves it?

Given a Screen/Product occurrence:
  which reusable components participate?

Given a source implementation:
  which portable/candidate component relationship does it realize?
```

Reuse current VexLife Android element/Screen Lens source readers where possible.

Current A1 candidate now does that without changing Android production source:

```text
current Android Main Screen Lens
+ current Android Main Localization Inventory
-> vexboard.component-inventory/v1
-> 15 observed source families
-> 274 exact UI occurrences
-> where-used + containment + style/intent + localization + realization evidence
-> VexBoard Component Gallery
```

The first family projection is intentionally coarse:

```text
OBSERVED_SOURCE_FAMILY
+ portability=UNCLASSIFIED
!= accepted portable component
```

The materialized inventory lives at
`inventory/vexlife-android.main.components.json`; the deterministic builder is
`scripts/build-component-inventory.mjs`. Production refactor opportunities discovered while
organizing the source are recorded in [TECH-DEBT.md](./TECH-DEBT.md) rather than applied to Android.

### A2 — cross-Product component census — COMPLETED

A1 remains **VERIFYING** while A2 runs. This is intentional: the Android inventory source is formed
and deterministic enough to consume read-only; A1's repository-wide executable proof floor remains
independent.

### A2 inventory census

The same `vexboard.component-inventory/v1` contract now materializes every current VexBoard Lens
subject through the Lens catalog's Main coordinate:

| Product | Source families | Occurrences | Localized occurrences | Direct realizers |
| --- | ---: | ---: | ---: | ---: |
| VexLife Android | 15 | 274 | 190 | 121 |
| VexLife Prod | 9 | 152 | 123 | 0 |
| VexStream Music | 4 | 81 | 0 | 0 |

The zeros are meaningful:

- VexStream has no Component-Library Localization sidecar yet;
- VexStream and VexLife-Prod express richer current presentation/presence relationships outside
  `realization.elements`, so the inventory does not flatten those relationships into fake direct
  realizers;
- accessibility remains not projected across these inventories until a rightful source is connected.

`scripts/build-component-inventory.mjs --all` now reuses the shared Lens-catalog build binding used
by Localization. An embedded Lens commit must agree with the catalog when present; exported Lens
subjects whose source commit is intentionally omitted are bound by the catalog's exact build
coordinate.

The Source Families Gallery is Product-selectable and reads these same materialized inventories.
No Product-specific Gallery route or component parser was added.

Current A2 evidence already spans:

```text
Android
  component/Element source families
  StableLazyColumn
  Swappable/SwapTo
  Dialog / BottomSheet
  Context Dock
  NavigationTrail
  anchored overlays

current VexLife-Prod
  compiler-visible Blueprint identity
  VexWeb typed relationships
  Conversation durable item identity
  current browser presentation pressure

SwiftUI reference pressure (Product PR #506)
  adaptive action group
  stable repeated-item identity
  current full-span Frame / Seam / Region layout
```

### VexStream cross-Product pressure

VexStream Music is now a materially different A2 witness, not merely a related historical board.

Its current source independently exposes:

```text
Discover / Library / Shell
  source-owned local SELECTION
  default child
  exhaustive / bounded choice set
  selectorRefs[]
  optional gate
  current projection

Playlists
  local overview/detail navigation
  open / close / reconcile

Screen Lens layout
  one Frame
  one full Region
  zero Seams

controls
  stable source intent/pathway identities
```

The just-merged VexStream projectability work is especially useful because its Lens exporter already
projects `SELECTION` as a source relationship instead of forcing a future consumer to infer it from
DOM visibility.

This independently confirms several Android-discovered questions while adding new pressure:

```text
one target may have multiple selector controls
exhaustive selection != bounded/non-exhaustive selection
outer gate != selected child
zero-Seam Frame is still the same Frame/Region grammar
```

Current source gaps are preserved rather than guessed:

```text
Swappable Region -> HELD on compiler-visible selected/default-child contract
Modal presentation -> HELD on compiler-visible open/dismiss + modality contract
```



Apply the inventory contract to VexLife Prod, VexStream and other admitted Products.

Do not assume same-looking controls share one portable component. Group by evidence such as:

- semantic/presentation role;
- slots / children;
- stable inputs;
- state ownership;
- interaction relationship;
- layout constraints;
- accessibility/localization bindings;
- style/theme relationship;
- lifecycle/platform requirements.

### A3 — portable relationship / component Blueprint contract — COMPLETED

A3 formation does not choose one universal semantic owner.

```text
Product source
  owns Product/domain meaning

VexWork
  owns census / trajectory / candidate architecture navigation

Vextreme-SDK
  may own reusable observation / mapping / construction / proof machinery
  only when multiple real consumers earn one executable invariant

target repository
  owns target-native representation
```

The first A3 formation set is intentionally small:

```text
FOUNDATIONAL RELATIONSHIPS — reuse/generalize existing typed source where rightful
  stable identity + parent/containment
  semantic control binding
  Frame / Seam / Region / Allocation

NEW RELATIONSHIP CONTRACT CANDIDATES — formation, not acceptance
  Stable Repeated Items
  Local Selection

KEEP IN A2 EVIDENCE / HELD
  Modal presentation
  Local Navigation Trail
  Anchored Overlay
  Context Dock
  Action Vessel / Adaptive Action Group convergence
```

### A3 portable-core intersection

Target pressure has now narrowed the two new typed relationship candidates:

```text
Stable Repeated Items — portable core
  collection identity
  feature-owned item identity
  uniqueness
  caller-owned order

  current target pressure
    SwiftUI reference  -> identity/order/duplicate failure executable compatibility PASS
    Android Compose    -> reorder/duplicate PASS; PR #261 insert/remove test source-formed, Gradle execution owed
    VexStream browser -> stable playlist/trash runtime identity projected; duplicate playlist-entry continuity explicitly weaker

  target capability dispositions
    requested visibility
    visible-item projection
    scroll lock
    content-type/reuse hint

Local Selection — portable core
  subject
  admitted targets
  default/current selection
  selector -> target mapping
  choiceCoverage = EXHAUSTIVE | BOUNDED | UNKNOWN
  optional gate / realized descendants

  local selection != app navigation
```

This is intentionally the **intersection of proven relationships plus explicit target differences**,
not a union of everything one framework can do.

### Accepted portable A3 spine

A3 formation decisions are now resolved:

```text
ACCEPTED_PORTABLE
  Identity-addressed presentation tree
  Typed containment / source parent-child relationships
  Semantic control binding
  Frame / Seam / Region / Allocation
  Stable Repeated Items

HELD
  Local Selection
    -> current VexLife-Prod default/current selection is split across typed source + browser state.view
    -> production refactor explicitly deferred
```

No A3 formation remains in an ambiguous `FORMATION` state.

Each acceptance is intentionally narrower than target realization. Frame / Seam / Region illustrates the boundary:

```text
accepted portable relationship
  frame identity
  typed axis/boundary relationships
  region bounds
  relationship allocation
  source-owned depth where present
  fail-closed spatial validation

!= Apple SwiftUI native acceptance
!= universal resize/collapse realization
!= generic SwiftUI irregular-geometry implementation
```

The five formation predicates are satisfied by current evidence:

1. VexStream proves the zero-Seam / one-Region case through the same grammar;
2. VexLife-Prod #506 maps current full-span ratio Seams to SwiftUI without authored target pixels;
3. partial/multi-Seam SwiftUI geometry and seam interaction remain explicitly HELD;
4. accepted VexLife-Prod spatial tests reject cycles and invalid Seam/Region coverage;
5. accepted VexWeb artifact tests preserve Frame/Seam/Region source boundaries in the target semantic manifest.

A4 still owns native target acceptance and proof.


Frame / Seam / Region pressure now spans two materially different target shapes:

```text
VexLife-Prod -> SwiftUI
  full-span HeaderBodySeam 1:11
  full-span BrowserCompanionSeam 1:1
  -> proportional VStack / HStack mapping

VexStream browser
  one Frame
  zero Seams
  one full Region
  -> same FRAME grammar, no one-pane special type
```

Target relation disposition now includes `NOT_APPLICABLE` so a zero-Seam specimen can say
“seam interaction does not apply” rather than falsely claiming the target cannot support Seams.

The portable contract now has a stronger implementation direction from accepted VexLife-Prod evidence:

```text
canonical Product/component meaning
-> compiler-constrained Kotlin Blueprint / sealed relationship authoring
-> deterministic normalized portable IR
-> target adapters
```

Kotlin is allowed to be the strong typed authoring language. Kotlin/Compose is not thereby the
portable semantic owner.

Accepted predecessor pressure already exists in VexLife-Prod:

- `VexScreenBlueprint` + compiler-visible element handles;
- sealed `VexWeb.Identity / Binding / Node / Seam / Boundary` relationships;
- `VexWebAuthoring` as a renderer-free Kotlin DSL;
- `VexWebArtifacts` as deterministic browser-native generation + semantic manifest.

See [KOTLIN-BLUEPRINT.md](./KOTLIN-BLUEPRINT.md) and
[component-architecture-catalog.json](./component-architecture-catalog.json).

Accept the smallest language-neutral contract that survives materially different implementations.

Possible dispositions:

```text
PORTABLE
PLATFORM_SPECIFIC
CANDIDATE
HELD
UNSUPPORTED
```

Do not generalize a component merely because two source files look similar.

### A4 — target realization / adapter map — COMPLETED

A4 starts from the accepted A3 relationship spine and **derives** realization views from the existing
target-pressure records. It does not create a second target registry.

Current derived view:

~~~text
5 accepted portable relationships
-> 10 realization evidence records
   5 iOS / SwiftUI
   4 browser
   1 Android / Compose

33 mapped target relationships
11 held / unsupported target relationships
39 PASS proofs
0 OWED proofs
2 intentional HELD proofs
~~~

The Component Gallery now exposes a third view:

~~~text
Source families | Architecture | Realizations
~~~

Realizations is a proof/evidence map. It preserves each exact target source coordinate, relation
disposition and proof state. A reference compatibility PASS or source-formed mapping does **not**
become native acceptance because it appears in the Gallery.

Each target should consume accepted portable relationship objects/IR through an explicit adapter:

```text
portable relationship graph
-> Android / Compose adapter
-> Browser / VexWebArtifacts adapter
-> iOS / SwiftUI adapter
-> .NET / MAUI adapter
-> ...
```

The adapter emits target-native source plus enough semantic manifest/projection data for that target
to project itself back into Screen Lens. Native compile/proof remains separate from generated-source
parity.

For each accepted portable component, map realization variants:

```text
component.button.action
  -> android-compose
  -> web-html-css-js
  -> ios-swiftui
  -> dotnet-maui
```

Each realization retains source coordinates, version/currentness and proof.

This is not automatic source-to-source translation. A deterministic constructor/generator becomes valid only where an accepted mapping proves it.

### A5 — Component Gallery + Builder — RUNNING

The first A5 lived browser review corrected the center of gravity.

An inventory table answers:

> Where is this used?

That remains useful evidence, but it is not the primary human Gallery outcome. The Gallery should answer:

> What can I build, what is this item like by itself, how does it behave at its edges, and how can I combine it with other things without losing the relationships that make it buildable?

The current A5 direction is therefore:

```text
LIBRARY
  browse source-grounded component specimens
  -> choose one real source occurrence
  -> view it in isolation
  -> cycle real source examples / styles / conditions
  -> inspect meaning / containment / intent / localization / proof

STUDIO
  place specimens at root or inside a selected container
  -> preserve parent / sibling order / source occurrence / presentation / behavior relationships
  -> preserve portable accepted / held / source-bound disposition
  -> save / import deterministic Studio Blueprint JSON
```

The Gallery does **not** manufacture pressed/disabled/selected states or target-native appearance when
source has not projected them. Local specimen clicks/toggles are browser-local preview behavior only;
they perform no Product effect.

Supporting evidence remains reachable from the selected item:

```text
Where used
Realizations
Proof
Source
```

but those are no longer the default Gallery experience.

### A5 Studio Blueprint

A5 owns a deterministic, platform-neutral composition artifact:

```text
vexboard.component-studio-blueprint/v1

node
  source occurrence identity
  parent Studio node or ROOT
  sibling order
  source presentation relationships
  intent / action / pathway / visibility relationships
  accepted portable candidate refs
  held candidate refs
  target-realization refs

aiRequired = false
effects = false
executionAuthority = NONE
```

A Studio node can remain `SOURCE_BOUND` or `PORTABILITY_HELD`. Exporting it does not pretend every
component is already cross-platform.

Permanent:

```text
GALLERY SPECIMEN != NATIVE PIXEL PARITY
LOCAL PREVIEW INTERACTION != PRODUCT EFFECT
DERIVED SOURCE SHAPE != PORTABLE VARIANT ID
STUDIO BLUEPRINT != GENERATED TARGET CODE
STUDIO BLUEPRINT != SECOND PRODUCT SEMANTIC OWNER
AI != REQUIRED CONSTRUCTION INTERPRETER
```

A6 consumes the Studio Blueprint through accepted target adapters. A5 therefore saves the
relationship-preserving construction input; A6 owns target-native source / construction packs and
their proof.

### A5 Builder view — relational UI authoring

Victor's next lived correction adds a dedicated **Builder** beside the Gallery. The Gallery remains
the showroom: see source-grounded components in isolation, cycle real examples, and inspect evidence.
The Builder is the construction surface:

```text
┌──────────────────┬────────────────────────────────────┬─────────────────────┐
│ COMPONENTS       │              PREVIEW               │ SELECTED            │
│                  │                                    │                     │
│ Search...        │  Mobile / Windows / Container      │ source identity     │
│                  │                                    │ layout              │
│ Layout           │  drag component into canvas        │ constraints         │
│ Controls         │  nest inside containers            │ open callbacks      │
│ Content          │  flow + constraint relationships   │ portability         │
│                  │                                    │                     │
├──────────────────┴────────────────────────────────────┴─────────────────────┤
│ Structure / relationship path                              Save Design      │
└────────────────────────────────────────────────────────────────────────────┘
```

The existing Studio Blueprint remains the source-grounded component-composition precursor. Builder
adds a richer, still non-executing envelope:

```text
vexboard.ui-blueprint/v1

component/source identity
+ authored containment and sibling order
+ Flow / Constraint container relationships
+ parent-relative edge constraints
+ preview profile (preview-only)
+ open callback ports

aiRequired = false
effects = false
executionAuthority = NONE
```

The callback boundary follows VexArchitecture ownership rather than embedding business code in the
design. Builder can say that a visible interaction exposes an open port such as
`callback.saveProfile`; it does not become the application's State, Effect, Store, Family, provider,
or callback implementation owner. A deterministic A6 adapter or an AI integrator may bind those open
ports inside the target application's rightful architecture while preserving the authored UI
relationships.

The first Builder preview profiles are deliberately presentation-only:

```text
Mobile     390 × 844
Windows   1280 × 800
Container  960 × 640
```

Changing the preview profile does not rewrite component meaning. It exposes how the same relational
blueprint behaves under a different available surface.

#### Lived visual correction — component kind must be perceivable

The first exact-head Builder preview proved the relationship model but exposed a presentation collapse:
Card, Column, Dialog and other container-like kinds were all projected through the same rounded
`v-box` shell. The source identity was technically present, but the human experience was effectively
"the same rectangle with another label."

A5 therefore keeps two truths separate:

```text
canonical UI Blueprint relationship
!=
Builder preview chrome
```

The preview may use distinct presentation silhouettes to help a human recognize the source-grounded
kind, but it must not invent Product semantics or make preview pixels canonical. Card, Column, Row,
Stack, Dialog, Sheet, Region/Frame and Menu now receive different visual shells; leaf controls keep
their own Button/FAB/Menu Item/Field/Toggle/Text/Image expressions. Node ids and layout mode move out
of the foreground composition and appear only as selection affordance / inspector information.

The library toolbox uses the same distinction. A source family is no longer represented by a generic
dashed box merely because its kind can contain children.

#### VexBoard placement / hosted-browser boundary

Builder follows the existing Localization adjacency instead of inventing a separate application shell:

```text
VexBoard / Projects
  Components
  Builder
  Localization
  VexWork
```

`vexboard/projects.html` is the VexBoard front door. Builder therefore lives as
`vexboard/builder.html` beside `vexboard/localization.html` and
`vexboard/components.html`. On a normal hosted VexBoard deployment, opening Builder is ordinary
same-site browser navigation.

The localhost server used during exact-PR lived review is preview harness only. It is not part of the
Builder product contract.

#### Spatial authoring — Lucid-like manipulation without pixel-owned meaning

Lived review exposed that placement was still one-way: a component could be dropped but not directly
moved or resized. Builder therefore gives the preview root and every Constraint container a
parent-relative **24 × 24 ratio grid**.

```text
drag node
  -> columnStart / rowStart

resize edge / corner
  -> columnSpan / rowSpan

saved relationship
  -> GRID_RATIO relative to parent
  -> not viewport x/y pixels
```

Flow stays compositional. A Flow child is ordered by its parent rather than pretending to own
independent spatial coordinates. Switching a container to Constraint activates ratio-grid placement
for its children.

#### Reusable dynamic components — definition != instance

A Builder element is not terminal merely because it came from a source component family. Any
source-grounded subtree can be captured as a reusable UI component definition:

```text
source-grounded nodes
  -> reusable component definition
       stable definitionRef
       one template root
       source snapshots
       exposed open callback ports
  -> reusable component instance
       instanceRef
       definitionRef
       templateNodeRef per expanded node
       instance-qualified callback ports
       independent parent placement
```

The left library therefore has two sources:

```text
Source components
  observed Product-backed building blocks

Reusable
  user-authored relationship fragments built from those source-grounded blocks
```

A reusable definition remains non-executing and does not become Product State/business meaning.
Instances can be positioned and integrated independently while retaining their definition
provenance. In the first A5 version, saving an already-instanced subtree deliberately flattens its
nested instance provenance back to the underlying source-grounded nodes; recursive component
package/dependency semantics are not invented merely for convenience.

```text
REUSE
!= COPY/PASTE PIXELS

COMPONENT DEFINITION
!= PRODUCT SEMANTIC OWNER

COMPONENT INSTANCE PORT
!= CALLBACK IMPLEMENTATION
```

Human-facing boundary:

```text
open Builder
  -> browser loads hosted HTML / modules / source projections
  -> no local shell/server launch
  -> no app/repository mutation

click Import
  -> browser file picker
  -> only the user-selected blueprint is read

click Save Design
  -> browser download
  -> deterministic UI Blueprint bytes
```

### A6 — construction/export packs — WAITING on A4+A5

Consume an accepted A5 Studio Blueprint through target adapters to produce target-bound construction/reference artifacts without fresh source archaeology or AI reinterpretation.

Possible outputs:

```text
component blueprint JSON
target realization mapping
reference code/sample
construction brief
parity/proof expectations
```

Generated code never becomes canonical semantic meaning merely because it compiles.

### A7 — self-projection / dogfood — WAITING on A5

The Component Library/Gallery is itself a Vextreme Product and should obey the same rules:

- stable Screen / Element identities;
- localization bindings;
- projectable Screen Lens relationships;
- reusable components from its own library where appropriate;
- its own component occurrences visible in where-used;
- no privileged admin exception.

## Relationship to Localization Architecture

These sibling Projects should share machinery where the question is truly the same:

```text
stable source identity
occurrence / where-used
derived candidate groups
accepted convergence
variant/realization axes
currentness
projection
change intent / reconciliation
export/import
self-dogfooding
```

But they should not share a universal content schema merely for symmetry.

Localization axis:

```text
sourceStringRef -> localeVariantRef
```

Component axis:

```text
portableComponentRef -> targetRealizationRef
```

### First target-pressure experiment — SwiftUI Quick Actions

VexLife-Prod PR #506 now carries the first bounded second-target experiment:

```text
current VexLife-Prod Quick Actions relationships
-> reference:swiftui
-> generated SwiftUI-native source
-> reverse-projection semantic manifest
```

The candidate remains deliberately non-production and non-portable:

```text
SOURCE_INFLUENCED
!= ACCEPTED_PORTABLE

Swift parse / API-shape proof
!= Apple SwiftUI / Xcode native proof
```

The first earned platform-adapter law is that a target does not need to copy the source tree literally:

```text
source collection + trigger
-> SwiftUI Menu + Menu label
```

provided stable source identities remain intact and the target manifest explicitly records the target
role / realization mapping.

The Component Gallery carries this as
`candidate.component.adaptive-action-group`, kept distinct from predecessor Action Vessel until
cross-Product evidence earns convergence.

### Architecture candidates — source influence before acceptance

The Component Gallery now has two explicit layers:

```text
Source families
  exact current Product realization / where-used

Architecture candidates
  recurring relationships that may deserve typed portable contracts
```

Current candidates include identity-addressed trees, semantic control binding, typed containment,
swappable regions, modal presentation, stable repeaters, anchored overlays, local navigation trails,
Context Dock, Frame/Seam/Region layout and the canonical VexLife Action Vessel.

Five candidates are now accepted portable at A3; Local Selection is explicitly held. The remaining architecture candidates stay source-influenced/evidence until future pressure earns formation.

## Permanent boundaries

```text
SOURCE_CODE != PORTABLE_COMPONENT_MEANING
VISUAL_SIMILARITY != SAME_COMPONENT
CODE_LANGUAGE != PRODUCT_SEMANTICS
COMPILES != PARITY
REFERENCE_SAMPLE != CANONICAL_SOURCE
PORTABLE_COMPONENT != UNIVERSAL_COMPONENT
PLATFORM_SPECIFIC != FAILURE
GALLERY != SOURCE_AUTHORITY
VEXWORK_PROJECT != IMPLEMENTATION_AUTHORITY
```

### Stable Repeater Android mutation closure

VexLife-Android PR #261 now carries the one missing source-side Android mutation case:

```text
initial  event.a / event.b
insert   event.a / event.c / event.b
remove   event.c / event.b
```

It changes **test source only** and preserves existing item refs across insertion/removal. A bounded
local execution of the exact current helper semantics passes insert/remove/reorder/duplicate pressure.

Permanent distinction:

```text
PR #261 SOURCE-FORMED
+ compatibility PASS
!= repository Gradle/JVM PASS
```

The target-pressure record therefore keeps `proof.android-insert-remove-identity = OWED` until the
repository-owned execution runs.

## Current next edge

work.vex.component-library-architecture.gallery — **RUNNING**

A3 is terminal:

~~~text
5 ACCEPTED_PORTABLE
1 HELD Local Selection
0 unresolved formations
~~~

A4 now organizes the target side without duplicating authority:

~~~text
accepted portable relationship
+ existing target-pressure record
-> derived realization evidence
-> exact source / mapping / proof / debt
~~~

A4 target proof is now closed over the accepted five relationships:

- VexLife-Prod #506 SwiftUI realization: exact-head SourceOwner PASS + fresh Assurance CLEAR;
- VexLife-Android #261 Stable Repeater realization: exact-head SourceOwner PASS + fresh Assurance CLEAR;
- VexStream: two Lens self-currentness proofs remain intentionally HELD because VexBoard binds exact currentness externally;
- Local Selection remains outside A4 because its A3 relationship is intentionally HELD.

Continue with A5 as the human Component Library workspace. Do not reopen portable taxonomy or target proof merely because A5 now consumes the proven map.
