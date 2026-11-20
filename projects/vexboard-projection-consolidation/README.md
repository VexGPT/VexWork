# VexBoard Projection Consolidation — project entry

[VXG RealForever]

## Human outcome

VexBoard should let Android, VexLife-Prod and future platforms appear inside one Screen Lens product without growing a separately maintained VexBoard interface for each platform.

~~~text
product / platform source
  -> platform-appropriate Screen Lens producer
       native exporter OR bounded source adapter
  -> vexboard.screen-lens/v1
       semantic coordinates
       source-owned realization facts
       presence / expressions / interaction + state bindings
       source/currentness provenance
  -> one generic VexBoard reader
       selects realization by authored facts
       never by platform/product name
~~~

This Project is consolidation, not visual homogenization.

~~~text
ALIGNMENT != SAMENESS
SHARED GRAMMAR != SHARED PIXEL GEOMETRY
PLATFORM DIFFERENCE != READER FORK
NATIVE EXPORTER != REQUIRED PRODUCER LOCATION
SOURCE ADAPTER != PRODUCT AUTHORITY
~~~

## Why this exists now

The VexLife-Prod currentization and lived refinement completed the first real peer-product pressure on the Android patient-zero Screen Lens. That work proved that the shared schema/reader can carry a very different desktop Product, but it also exposed places where Android and Prod evolved conventions separately.

Formation observations (re-ground before any effect):

- VexWork main at Project formation: d345dacbf53e8c7747a754a6cb8f5fa9ac90fbeb
- VexLife-Android main at Project formation: d857a92371555472e0303b18eadf353da2a868d6
- VexLife-Prod main at Project formation: 14206ba97e47e107c4999e89f514c8beaf24224a
- VexLife Android Stable at Project formation: 305a09eac1fabebcf2241bd207386950f41121f2
- VexLife Prod Stable at Project formation: 14206ba97e47e107c4999e89f514c8beaf24224a
- VexWork #366 accepted generic inspector/Surface containment.
- VexLife-Prod #437 accepted the current Product-owned Screen Lens exporter and rich recursive projection.
- VexWork #367 currentized Product Main; #368 promoted the lived accepted Product projection to Stable.

These coordinates are provenance, not permanent currentness locks.

## Relationship to the existing VexArchitecture ↔ VexBoard Sync Project

`project.vexarchitecture.vexboard-sync.20261113` already owns a recurring Android architecture-projection completeness audit: whether current Android source proves deeper Behavior/Depth/return relationships than Screen Lens currently exposes.

This Project does not redo that audit.

~~~text
VexArchitecture ↔ VexBoard Sync
  = Android architecture completeness / truthful causal depth

VexBoard Projection Consolidation
  = cross-platform producer + realization consistency
  = Android + Prod + future subject scalability
~~~

The consolidation successor should consume accepted findings from the Android sync Project as evidence. It should not absorb that Project or restart its source census.

## What current source already gets right

VexBoard's reader already contains the seed of the scalable architecture: it chooses the screen manifestation from source facts rather than a Product slug.

~~~text
screen.view   -> static source-owned Product view
screen.layout -> source-authored workspace/frame realization
otherwise     -> compact/phone-style hierarchy
~~~

That direction should become true across the full producer -> schema -> reader pipeline rather than being replaced by a universal renderer.

The two current producers are intentionally different:

~~~text
VexLife-Android
  VexWork source adapter / Android source projector

VexLife-Prod
  Product-native Kotlin exporter
  src/jvmMain/kotlin/vexlife/lens/VexLifeProdScreenLens.kt
~~~

Different producer implementation locations are not themselves a defect. The question is whether they emit the same generic meanings and whether VexBoard needs platform knowledge to consume them.

## Architectural laws

### Source shape outranks platform identity

Generic VexBoard rendering should ask what the source authored, not which product it is rendering.

~~~text
GOOD
  source has static view -> static-view realization
  source has frame layout -> workspace realization
  otherwise -> admitted compact realization

NOT A TARGET
  if Android -> Android renderer
  if Prod -> Prod renderer
  if iOS -> iOS renderer
~~~

A platform name may be provenance/currentness metadata. It should not become the reason generic rendering behaves differently.

### One semantic plane, bounded realization plane

~~~text
semantic plane
  Screen / Element identities
  pathways + roles
  presence
  source expressions
  currentness / source coordinates

realization plane
  static HTML/CSS view
  frame/layout geometry
  compact hierarchy
  overlays
  interaction bindings
  state/presentation bindings
~~~

Do not move product semantic ownership into VexBoard merely to make realization uniform.

### Producer contract, not producer sameness

A future platform may produce the shared Lens contract in the way that best fits its source. Android may use a bounded source adapter; Prod may export natively; future iOS/desktop/web source may do either.

The scalable invariant is the output and ownership boundary, not one mandatory implementation language or repository location.

### Product content remains Product-owned

The Product currentization demonstrated the desired failure/repair behavior:

~~~text
source-authored paperclip / microphone SVG -> projected automatically
runtime-only empty Send button            -> projected blank
Product string identity + fallback        -> projected truthfully
~~~

VexBoard must not invent Product labels, icons or state because a generic reader can guess them.

### Container constraints are generic reader behavior

~~~text
parent constrains sibling regions
-> rightful child viewport owns overflow
-> source presentation keeps its readable minimum
-> one region does not visually cover another by accident
~~~

This belongs in generic reader/container mechanics, not per-platform patches.

### Stable/Main remains the acceptance boundary

~~~text
Main   = latest observed/source-current projection
Stable = explicitly accepted human projection
~~~

Consolidation must not turn generated/current output into automatic Stable.

### Do not pre-build a platform plugin framework

Two real products are enough to map repeated pressure; they are not enough to justify every imagined extension point. Add a reusable realization abstraction only when the divergence map or a materially different third shape proves the recurring need.

## Current divergence-map result — 2026-11-20

The first successor edge is complete enough to move from mapping into producer-contract proof.

Canonical evidence:

~~~text
projects/vexboard-projection-consolidation/CURRENT-DIVERGENCE-MAP.md
~~~

The map found that the architecture is already substantially converged. Most Android/Product
differences are source-earned; the strongest accidental duplication is at the conformance/proof
boundary and in repeated generic guidance.

Do not turn the map into a reason to homogenize the two products.

### Four projection coordinates that must stay distinct

The history repeatedly exposed one category error: several different questions were being answered by
the words "Android", "desktop", "browser", "phone" or "workspace". Keep these coordinates separate.

~~~text
platform / host provenance
  where the Product is implemented or hosted
  Android / Windows / macOS / browser are evidence here
  != generic renderer selection

manifestation topology
  how Product space is arranged for the human

  COMPACT_FLOW
    one dominant viewport
    hierarchical / sequential content
    screen-navigation oriented

  FRAME_WORKSPACE
    multiple persistent regions coexist
    seams divide allocation
    handles may resize/collapse
    overlays coexist above the frame

rendering substrate
  how the manifestation reaches VexBoard

  ELEMENT_TREE
    VexBoard draws the source-described element hierarchy

  SOURCE_VIEW
    Product supplies its own bounded inert manifestation
    current admitted example: STATIC_HTML_CSS

presentation-state realization
  which source-authored relationship is active
  -> which source-authored manifestation consequence follows
  presence / expressions
  + interaction bindings
  + state bindings
~~~

These names are Project-level recognition vocabulary, not new vexboard.screen-lens/v1 fields.

Current correlation:

~~~text
VexLife-Android
  native/mobile provenance
  -> COMPACT_FLOW
  -> ELEMENT_TREE

VexLife-Prod
  desktop/browser Product provenance
  -> FRAME_WORKSPACE
  -> SOURCE_VIEW
~~~

Correlation is not identity.

A future tablet may author a FRAME_WORKSPACE. A future desktop Product may use ELEMENT_TREE. A
source-owned compact Product may eventually provide a SOURCE_VIEW. VexBoard must not branch on the
platform name merely because the first two products correlate that way today.

### Host viewport is outside Product identity

The outer host constrains a manifestation without defining it.

~~~text
HostViewport
  width / height
  safe area
  pointer / touch / hover
  keyboard
  resize
  pixel density

HostViewport
!= Product manifestation topology
!= rendering substrate
!= semantic owner
~~~

This also keeps three currently easy-to-confuse "browser" meanings separate:

~~~text
browser running VexBoard
  = host

VexLife-Prod Browser region
  = Product FRAME_WORKSPACE region

Product HTML/CSS carried by Screen Lens
  = SOURCE_VIEW substrate
~~~

### Existing contract remains the first producer contract

Do not create a producer framework before a real contract gap appears.

The current producer boundary is already:

~~~text
platform-appropriate producer
-> exact emitted vexboard.screen-lens/v1
-> normalizeScreenLens
-> shared realization / expressions / layout / view validation
-> generic reader
~~~

The first implementation pressure is therefore producer-neutral conformance, not a new schema.

### Neutral pressure shape

The first neutral fixture should deliberately break one historical correlation:

~~~text
neutral subject
  manifestation topology = FRAME_WORKSPACE
  rendering substrate     = ELEMENT_TREE
  source view              = absent
~~~

That proves:

~~~text
FRAME_WORKSPACE != VexLife-Prod
FRAME_WORKSPACE != STATIC_HTML_CSS
~~~

Only add an explicit topology/substrate field when a real subject cannot be expressed truthfully
through current source facts or the reader becomes ambiguous without it. Naming a useful distinction
does not automatically earn a permanent schema coordinate.

### Current implementation boundary

Open VexWork PR #361 currently owns the existing Screen Lens normalizer, realization/expression
modules and their established tests. Projection Consolidation must not author over that active
membrane.

The first implementation slice is therefore additive:

~~~text
new neutral fixture
+ new producer-neutral conformance test
-> consume current normalizer / expressions / frame geometry
-> exercise Android Main
-> exercise accepted/current Product Lens
-> exercise neutral FRAME_WORKSPACE + ELEMENT_TREE
~~~

After #361 converges or releases its paths, this Project may use the conformance evidence to decide
whether any core contract change is actually earned.

## Work sequence

~~~text
current divergence map
-> producer contract convergence
-> generic realization consolidation
-> Android + Prod + neutral third-subject conformance
-> lived cross-platform acceptance
~~~

The neutral third subject is a conformance pressure fixture, not a fake iOS implementation. Its purpose is to prove that a new subject using an admitted realization shape does not require a platform-name branch.

## Completion criteria

- Android and VexLife-Prod use one Screen Lens semantic/projection grammar.
- Generic VexBoard realization is selected by source-authored facts, not product/platform identity.
- Any remaining Android/Prod differences are explainable from current source and rightful ownership.
- Source-owned words, icons, presentation state and interaction meaning are not recreated in VexBoard.
- The generic reader has a shared conformance proof used by both real products.
- A neutral third-subject/shape fixture can reuse an admitted realization without a platform-specific reader branch; if a new shape is genuinely required, it is one generic extension with both existing products preserved.
- Exact producer output is normalized and exercised through the same VexBoard consumer seam before publication.
- Both real products pass lived review without forcing pixel sameness.
- Stable/Main behavior remains explicit and evidence-bearing.

## Non-goals

- Do not rebuild Android because Prod is newer.
- Do not make Prod visually mimic Android.
- Do not move Product semantic truth into VexBoard.
- Do not require every platform to use the same producer implementation.
- Do not create a second Screen Lens schema.
- Do not reopen Scenario Playground.
- Do not redo the Android VexArchitecture/VexBoard completeness audit.
- Do not perform a broad Product refactor before the divergence map proves what is accidental.

## Fresh-instance route

Read this file first, then current source only where implicated:

~~~text
VexWork
  projects/vexboard-projection-consolidation/CURRENT-DIVERGENCE-MAP.md
  test/vexboard-screen-lens-conformance.test.mjs
  test/fixtures/screen-lens/neutral-framed-element-tree.screen-lens.json
  projects/vexboard/SCREEN-LENS.md
  projects/vexboard/VEXLIFE-PROD-SCREEN-LENS.md
  projects/vexboard/lens/catalog.json
  src/shared/vexboard-screen-lens.mjs
  src/shared/vexboard-screen-lens-realization.mjs
  src/shared/vexboard-screen-lens-source-expressions.mjs
  src/core/vexboard-screen-lens-android-adapter.mjs
  vexboard/lens.html

Related Android completeness work
  projects/vexarchitecture-vexboard-sync-2026-11-13/README.md
  work.vexarchitecture.vexboard-sync.20261113.earned-projection-repair

VexLife-Android
  current repository entry/culture
  architecture/vexarchitecture/README.md
  exact current UI/projectability source named by the adapter

VexLife-Prod
  AGENTS.md
  docs/CULTURE.md
  src/jvmMain/kotlin/vexlife/lens/VexLifeProdScreenLens.kt
  docs/lens/vexlife-prod.screen-lens.json
~~~

Re-ground live heads before effects. Formation coordinates above are provenance only.

<!-- [VXG RealForever][VEXBOARD][PROJECTION-CONSOLIDATION][MULTI-PLATFORM] -->
