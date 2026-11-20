# VexBoard — Projecting an Existing Project

[VXG RealForever]

## Why this is the AI entry for projection work

Use this file when the human wants an existing product, repository or feature to become visible through
VexBoard rather than authoring a new BoardGraph from scratch.

The goal is not to make source look like VexBoard.

The goal is:

~~~text
existing human/product intention
-> rightful source owners and stable identities
-> smallest truthful projectability seam
-> platform-appropriate Screen Lens producer
-> vexboard.screen-lens/v1
-> shared VexBoard consumer
~~~

Start from the target repository's own entry/culture/architecture source. VexBoard is a consumer of
already-owned meaning; it is not permission to rename or restructure a product into a VexBoard-shaped
codebase.

~~~text
PROJECTABLE != VEXBOARD-SHAPED SOURCE
SOURCE_PROJECTION != SOURCE AUTHORITY
MISSING IDENTITY != MISSING ARCHITECTURE
LARGE FILE != REFACTOR REQUIREMENT
~~~

For the current multi-platform convergence model, also read:

~~~text
projects/vexboard-projection-consolidation/README.md
projects/vexboard-projection-consolidation/CURRENT-DIVERGENCE-MAP.md
test/vexboard-screen-lens-conformance.test.mjs
~~~

## 1. Choose the truth mode first

VexBoard has two different relationships with source.

~~~text
AUTHORING
  BoardGraph is the accepted design source for something being designed in VexBoard.

SOURCE_PROJECTION
  another accepted source already owns the product/process/architecture truth;
  VexBoard derives a read-only projection with exact source bindings.
~~~

An existing product such as VexLife-Android, VexLife-Prod or VexStream Music starts as
SOURCE_PROJECTION unless its rightful source explicitly adopts a generated Board/Lens artifact as a
canonical authoring contract.

Do not silently turn a projection into an editable copy.

## 2. Read the target from the inside out

A fresh AI should not begin by scraping visible buttons.

Descend through the target's own current source:

~~~text
repository entry / architecture map
-> human/product intention
-> semantic owners
-> current presentation/screen structure
-> provider/runtime boundaries
-> proof surfaces
-> exact source identities already present
~~~

Ask the same VexArchitecture questions regardless of implementation language:

~~~text
What is the human trying to do?
What is true now?
Which owner decides meaning?
What does the human touch?
What does that touch mean?
What transformation may be attempted?
What provider/runtime realizes it?
What truth returns?
What presentation manifests that truth?
What proof owns each claim?
~~~

Reuse the questions, not another product's file layout.

## 3. Classify projectability before editing source

For each projected neighborhood, classify the current source into one of these working outcomes.
These are AI/project judgment labels, not new Screen Lens schema values.

### PROJECTABLE_AS_IS

Use when stable source identity and relationships are already explicit enough for a bounded producer.

Examples of sufficient evidence may include:

- stable Screen/surface identifiers;
- stable element/control refs;
- typed semantic Family/Control/Act/Effect or an equally explicit local relationship;
- source-authored parent/container relationships;
- source-authored presentation state;
- stable journey/proof coordinates.

Action:

~~~text
write the smallest producer
-> native export OR bounded adapter
-> no product refactor
~~~

### IDENTITY_ALIGNMENT

Use when the product meaning is coherent but VexBoard cannot address it without relying on visible
words, DOM position, list order or implementation coincidence.

Typical correction:

~~~text
existing real source owner
+ stable identity beside that owner
-> same behavior
-> newly projectable relationship
~~~

Examples:

- give a real control a stable data/ref identity;
- expose an existing semantic token beside the DOM node that realizes it;
- bind a source-owned panel/sheet to the state that already opens it;
- give repeated rows their existing domain identity instead of inventing VexBoard row IDs.

This is the preferred correction when the human meaning already exists.

~~~text
IDENTITY_ALIGNMENT
!= COMPOSITE RESTRUCTURING
~~~

### BOUNDED_SOURCE_REFACTOR

Use only when the source itself collapses independently meaningful questions so completely that a
projection would otherwise guess ownership.

A refactor is earned when, for example:

- one source site owns several independently evolving semantic questions;
- the same visible action has no stable meaning outside a large conditional monolith;
- provider success and product State are indistinguishable;
- presentation and domain truth cannot be separated without inventing meaning in the adapter;
- stable identity would merely label an ambiguous relationship rather than expose a real owner.

Refactor the smallest rightful source boundary first, then project it.

Do not refactor merely because a file is large or because another projected product has more types.

### HELD_AMBIGUOUS

Use when source evidence is insufficient or contradictory.

~~~text
UNKNOWN OWNER
-> hold that dependent pathway
-> keep the rest of the subject projectable
~~~

Do not manufacture a Family, Effect, Store, screen or navigation relationship to make the Lens look
complete.

## 4. Keep four projection coordinates separate

Do not use platform names as generic rendering decisions.

~~~text
platform / host provenance
  Android / Windows / macOS / browser / other implementation-host facts

manifestation topology
  how Product space is arranged for the human
  current recognized shapes:
    COMPACT_FLOW
    FRAME_WORKSPACE

rendering substrate
  how VexBoard receives the manifestation
    ELEMENT_TREE
    SOURCE_VIEW (current admitted form: STATIC_HTML_CSS)

presentation-state realization
  presence / expressions
  + interaction bindings
  + state bindings
~~~

The outer host viewport is another constraint:

~~~text
HostViewport
  width / height / safe area / pointer / touch / keyboard / resize

HostViewport
!= Product identity
!= manifestation topology
!= rendering substrate
~~~

These names help an AI reason about current source. They are not automatically new
vexboard.screen-lens/v1 fields.

### Engagement hierarchy is part of projectability

When projecting a visual product, map not only element containment but **who owns layout, scrolling and engagement**.

~~~text
container relationship
-> placement relationship
-> local viewport relationship
-> gesture / scroll owner
-> outer continuation owner
~~~

Do not infer those from platform names or screen-width literals. A scrollable child is not automatically
the scroll owner; at passive space or a scroll boundary, continuation may lawfully belong to an ancestor.
Likewise, a paired Experience/Behavior relationship may remain semantically paired while its physical
placement changes from side-by-side to stacked.

~~~text
CAN_SCROLL != OWNS_ALL_SCROLL
INTERACTIVE != OWNS_EVERY_GESTURE
PAIRED_SEMANTIC_RELATIONSHIP != ALWAYS_SIDE_BY_SIDE_GEOMETRY
~~~

Use projects/vexboard/SCREEN-LENS.md as the reader-side reference. Target source should expose stable
container/presentation identity; it should not be refactored merely to imitate the current VexBoard DOM.

## 5. Choose the producer from the source boundary

Two producer forms are already accepted:

~~~text
bounded source adapter
  useful when source is regular and a read-only adapter can recover exact relationships

native exporter
  useful when the product already owns typed registries/blueprints and can export its own Lens
~~~

Current examples:

~~~text
VexLife-Android
  VexWork adapter
  -> vexboard.screen-lens/v1

VexLife-Prod
  Product-native Kotlin exporter
  -> vexboard.screen-lens/v1
~~~

Producer location is not architectural rank. Both must converge on the same consumer contract.

### SOURCE_VIEW interaction coverage is explicit

A source-owned static Product view may preserve the real visual shell, but visible/stable controls must
not silently remain image pixels.

For controls/actions that already have source-owned stable identity:

~~~text
source-stable interactive identity
  -> exported inert view anchor
  -> Screen Lens element

admitted deeper relationship
  -> pathwayRef

relationship outside the bounded projection
  -> element remains addressable
  -> pathway stays absent / visibly unprojected
~~~

This is especially important for SOURCE_VIEW producers because the Product can look complete even when
the relationship projection is sparse.

~~~text
VISIBLE_WORKING_CONTROL
+ SOURCE_STABLE_IDENTITY
+ NO LENS ELEMENT
= PROJECTION COVERAGE DEFECT
~~~

Do not fix this by inventing VexBoard-only IDs in the live Product. Derive generic view anchors in the
exported copy from the source-owned identity, or align the source identity at its rightful owner when it
does not yet exist.

### Run a projectability coverage census before lived review

For a Product Surface with many real controls, do not use human screenshots as the omission detector.

Before asking for lived acceptance, inventory the complete interactive source surface and correlate:

~~~text
interactive affordance
+ visible / latent presentation state
+ source-owned relationship identity
+ runtime event wiring
+ emitted Lens element
+ admitted pathway (when earned)
~~~

At minimum distinguish:

~~~text
MAPPED_PATHWAY
  addressable + deeper relationship projected

ADDRESSABLE_HELD
  addressable in the Lens
  deeper relationship deliberately outside current scope

SOURCE_RELATIONSHIP_UNMAPPED
  source already names the relationship
  producer failed to carry it

VISIBLE_WIRED_UNIDENTIFIED
  visible + real runtime behavior
  source lacks truthful projectability identity

LATENT_*
  alternate/hidden terrain is inventoried explicitly
  not silently treated as complete
~~~

For the currently admitted visible/default expression:

~~~text
SOURCE_RELATIONSHIP_UNMAPPED
or VISIBLE_WIRED_UNIDENTIFIED
or VISIBLE_UNIDENTIFIED
-> projection coverage FAIL
~~~

Do not make every missing item a semantic Family. First decide whether the correct effect is:

~~~text
projection-only export
identity alignment beside existing owner
explicit held element
bounded source refactor
~~~

VexStream Music's persistent reference implementation is:

~~~text
repo.vexstream-music:v2/projection/vexboard-projectability-audit.mjs
~~~

The audit mechanism is product-local because it knows that Product's source forms; the completeness law
is generic.

## 6. Prove emitted output through the consumer seam

Producer-specific tests prove source extraction.

They are not enough by themselves.

Every emitted Lens should then pass the same producer-neutral seam:

~~~text
raw emitted Lens
-> normalizeScreenLens
-> expressionsFor(each Screen)
-> resolvePresence
-> Behavior / Depth graph role + ref integrity
-> layout geometry when authored
-> source-view invariants when authored
-> generic reader
~~~

The Projection Consolidation conformance test is the current starting point:

~~~text
test/vexboard-screen-lens-conformance.test.mjs
~~~

Do not copy its assertions into each repository. Extend the shared conformance seam when a genuinely
shared invariant is earned.

## 7. Register the subject only after the producer boundary is truthful

Then follow projects/vexboard/PROJECTS-AND-BUILDS.md:

~~~text
Lens subject catalog entry
-> producer/export coordinates
-> Main projection
-> explicit Stable acceptance
-> any-commit only when truthful for that producer/source
~~~

~~~text
MAIN != ACCEPTED
STABLE != NEWEST
GENERATED != HUMAN-ACCEPTED
~~~

## 8. VexStream Music — next scalability pressure after Projection Consolidation

After the current Android/Product convergence refinements are source-proved and accepted, use
vgong24/VexstreamMusic as the next materially different projected-project pressure.

Re-ground live source before effects. Initial read on 2026-11-20 observed:

~~~text
repository main
2b745e0a3f5e63e05dfa0cf25b0fac729c00f0c8

V4/V2 entry
v2/README.md

architecture
v2/architecture/README.md

browser manifestation
v2/web/index.html
v2/web/app.js
~~~

The initial evidence argues against a wholesale architecture rewrite.

V4 already owns recognizable semantic neighborhoods:

~~~text
Playback
Queue
Library
Player composition
Phone
Explore / Import
Playlists
System
provider/runtime Connections
Journey / browser proof
~~~

The architecture source explicitly separates State / Control / Act / Effect questions and says stable
screen/element identity should grow from the real browser UI rather than from a second test registry.

The browser already carries partial projectability identity:

~~~text
body[data-vex-screen="vexstream.desktop.library"]

data-vex-control
  vexstream.playback.play-pause
  vexstream.queue.previous
  vexstream.queue.next
  vexstream.queue.shuffle
  vexstream.queue.repeat

data-vex-action
  selected track/player actions

data-text-ref
  stable human-text identity

data-shell-view / data-shell-panel
  current browser manifestation relationships
~~~

Playback source also already exposes explicit semantic identity through
v2/web/features/playback/behavior.js:

~~~text
VexStreamPlaybackFamily
PlaybackControl
PlaybackAct
PlaybackEffect
PlaybackState
~~~

Therefore the expected first VexStream projectability route is:

~~~text
current coherent V4 source
-> map one bounded feature slice
-> preserve existing semantic tokens
-> add only missing stable presentation/element identity at rightful source
-> bounded VexStream producer
-> shared Screen Lens conformance
-> lived VexBoard comparison
~~~

The first slice should be small enough to falsify the method. Playback is a strong candidate because it
already joins semantic identity, browser controls, provider realization and presentation. Do not decide
that permanently until current VexStream source is re-grounded after Projection Consolidation lands.

A likely first question is:

> Can VexBoard project the existing Playback/Queue/browser relationship by giving current source
> complete stable addressability, without restructuring the V4 architecture?

If yes, VexStream proves reuse through identity alignment.

If no, record the exact ambiguity that forces a bounded source refactor. Refactor only that owner.

## 9. Completion standard for a newly projected project

A projected subject is not complete merely because it appears in the project switcher.

Completion requires, at the scope actually claimed:

- source-owned semantic identity remains source-owned;
- presentation identity does not depend on displayed words or DOM/list position;
- producer output normalizes through the shared Screen Lens contract;
- generic realization is chosen by source facts, not product/platform identity;
- held/unknown relationships remain visibly held instead of guessed;
- Main/currentness is exact;
- Stable is explicit human acceptance;
- the Product remains recognizable in lived review;
- adding the subject did not create a product-specific VexBoard reader fork.

When a second or third product exposes the same missing relationship, prefer one shared consumer law.
When only one product needs a relationship, keep it source-owned.

<!-- [VXG RealForever][VEXWORK][VEXBOARD][PROJECTABILITY][SOURCE-PROJECTION] -->
