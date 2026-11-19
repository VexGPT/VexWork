# VexLife-Prod Screen Lens — current integration intention

`[VXG RealForever]`

## Human intention

VexLife-Prod should be a **first-class peer of VexLife Android inside the existing VexBoard Screen Lens experience**.

The intended human topology is:

```text
Projects
├─ VexLife Android
│  └─ Screen Lens
│     Surface / Structure / Behavior / Depth
│
└─ VexLife Prod
   └─ Screen Lens
      Surface / Structure / Behavior / Depth

inside the Lens
VexLife Android  ⇄  VexLife Prod
through the existing project switcher
```

The goal is **not** to invent a second VexBoard viewing experience for VexLife-Prod.

A fresh instance should preserve this distinction:

```text
Experience Relationship Graph
  = source-derived relationship substrate / graph truth

VexLife-Prod Screen Lens
  = the human-facing VexBoard projection experience

generic VexBoard canvas
  != replacement for the Screen Lens
```

## Current source truth

### VexLife-Prod already owns a Screen Lens export

Observed on VexLife-Prod main at:

```text
152c323ee6c3d4a43243d0a9c9b6de2ce11f605b
```

Product-owned exporter:

```text
src/jvmMain/kotlin/vexlife/lens/VexLifeProdScreenLens.kt
```

Its own source contract says it exports the VexLife-Prod workspace into:

```text
vexboard.screen-lens/v1
```

Generated Product lens:

```text
docs/lens/vexlife-prod.screen-lens.json

schemaVersion  vexboard.screen-lens/v1
lensRef        lens.vexlife-prod
title          VexLife Prod · Screen Lens
entry screen   screen.vexlife-workspace
screens        1
elements       81
pathways       11
```

The exporter was originally introduced by Claude in VexLife-Prod commit:

```text
b27668b7eb780e269b45a27b46a52a49a00c4653
[Lens] Export the VexLife-Prod workspace as a VexBoard Screen Lens
2026-11-13
```

Claude subsequently evolved that same exporter as Product capabilities changed.

Therefore:

```text
VEXLIFE_PROD_SCREEN_LENS_EXPORT = EXISTS

VEXWORK_VEXLIFE_PROD_LENS_CATALOG_INTEGRATION
  = STALE / INCOMPLETE
```

Do not infer from VexWork's older `subject.vexlife-prod lens.status=NOT_BUILT` catalog row that the Product exporter does not exist.

### Experience Relationship Graph foundation

VexWork PR #321 is the accepted/CLEAR Experience Graph correction + proof trajectory.

Exact CLEAR coordinate:

```text
head
20d6317b9e38e3fefaeb0615fafaf1f34d4d99c5

tree
e14fa31ff5883ce31e9955b9cf316defd5afb4e3
```

The Experience Relationship Graph is intended to enrich relationship understanding, especially Behavior / Depth / route / evidence / currentness questions.

It must **not** become a parallel human-facing product that bypasses the existing Screen Lens.

The relationship should be:

```text
VexLifeProdScreenLens / Blueprint export
  -> Surface
  -> Structure

Experience Relationship Graph
+ Family law
+ Control -> Effect
+ realization
+ observation
+ projection
+ cross-owner relationships
  -> richer Behavior
  -> richer Depth
  -> inspection / currentness support
```

The exact composition mechanism still needs to be earned from current source. Do not assume every graph edge belongs directly in the Lens.

## Android preservation boundary

VexLife Android is the already-accepted patient zero and must remain stable while VexLife-Prod joins as a peer.

At the #321 basis:

```text
Android Stable
305a09eac1fabebcf2241bd207386950f41121f2

Android Main
d857a92371555472e0303b18eadf353da2a868d6
```

Stable acceptance evidence currently includes:

```text
github.pull.vexwork.230
human.victor.lived-first-draft-acceptance
github.pull.vexwork.238
```

Required invariant:

```text
ADD VEXLIFE_PROD PEER
!= REBUILD ANDROID
!= FLATTEN ANDROID CONTEXT
!= SILENTLY CHANGE ANDROID LENS MEANING
```

Shared Lens-shell changes are allowed only when both projects can truthfully consume them without regressing Android's accepted experience.

## Required VexBoard experience

The target human experience is:

### Projects

VexBoard Projects should present current first-class project choices, including:

```text
VexLife Android
VexLife Prod
```

VexLife-Prod should not appear as a "No Screen Lens yet" placeholder once the current Product export is integrated.

### Project switcher

Inside `vexboard/lens.html`, the existing project switcher should allow:

```text
VexLife Android
VexLife Prod
All projects
```

Selecting VexLife-Prod should remain inside the same Lens shell.

### Lens faces

VexLife-Prod should use the existing shared Lens language:

```text
Experience
  Surface
  Structure

Behavior
  Behavior
  Depth
```

Do not route the person to a generic VexBoard canvas merely because the Experience Graph can emit `vexboard.board-graph/v1`.

## Source ownership

Preserve the ownership split:

```text
VexLife-Prod
  owns Product meaning
  owns VexUiBlueprint
  owns VexLifeProdScreenLens export
  owns Product element/pathway/source coordinates

VexWork / VexBoard
  owns Lens catalog / build pointers
  owns the shared Screen Lens reader / UI
  owns cross-project presentation mechanics

Experience Relationship Graph
  derives current source relationships
  may deepen/query the Lens
  does not become Product authority
```

## Wrong turn explicitly rejected

VexWork PR #323 explored a generic VexBoard Experience Graph inspection and cleanup path.

Victor's raw-git witness rejected that product topology.

The rejected shape was:

```text
Projects
-> VexLife Prod "current source map"
-> generic VexBoard canvas
-> "Inspect what is current"
-> Experience Graph board
```

This is **not** the intended successor experience.

Useful cleanup observations from #323 may be re-evaluated individually, but #323's generic Experience Graph canvas must not be silently carried forward merely because its tests passed.

Human witness established:

```text
TEST_PASS != CORRECT_PRODUCT_TOPOLOGY
```

## Next grounded engineering edge

Before broad implementation:

1. Re-observe current VexLife-Prod main and its exported `docs/lens/vexlife-prod.screen-lens.json`.
2. Read the current VexBoard Screen Lens catalog/reader contract.
3. Determine the smallest truthful integration route for the Product-owned exported Lens:
   - how VexWork pins Stable/Main;
   - how it consumes or mirrors the Product-exported JSON;
   - how arbitrary-commit projection should work, if it is earned for Prod;
   - how the existing project switcher discovers Prod.
4. Preserve Android Stable/Main behavior unchanged unless one shared-shell change is genuinely required.
5. Reconcile the Experience Relationship Graph into Behavior/Depth only where it adds source-proven relationship depth not already present in the Product exporter.
6. Do not create another graph engine, another Screen Lens schema, or another human-facing canvas route.
7. Produce raw-git preview before any integration/merge decision.

## Browser workspace realization (composed R2 candidate, not accepted)

Lived finding (2026-11-19): the Prod Lens drew the browser workspace inside Android's phone frame.

```text
VEXWEB_FRAME_TOPOLOGY != PHONE_TOPOLOGY
OUTER_MACOS_WINDOW    != PRODUCT_IDENTITY
```

Foreground convergence:

- VexLife-Prod #387 / VXG-111926-vexlife-prod-experience-convergence-r2: Product semantic identity and VexWeb spatial truth are composed in one exporter; exact generated Product Lens commit: `479544c5c319ad796a0853125ae131d85afc9671`.
- VexWork #328 / VXG-111926-vexlife-prod-e2e-experience-convergence-r1: Experience Graph control-subset correction, peer Product Lens integration, and generic browser-workspace renderer live on one foreground branch.
- Product owns Blueprint meaning and VexWeb placement. VexWork projects; it does not become Product authority.

The Product export carries FRAME / SEAM / REGION / HANDLE layout, layers and interactions while retaining Send, Vision, Private Mode, reply-language and screen-language semantic pathways. The Browser/Companion seam remains TYPED_PRESENTATION; no Family is invented for resizing.

Stable `5b93204` and Main `152c323` predate this export, so the composed workspace is witnessed through Commit projection of Product #387. Nothing requires Product or VexWork main integration merely to perceive the candidate.

Witness checklist for the composed candidate:

1. `lens.html?subject=vexlife-prod&commit=<Product #387 head>` draws header band, Browser | seam | Companion, and overlay — not a phone;
2. reply language manifests only CHOOSE_REPLY_LANGUAGE; screen language manifests CHOOSE_SCREEN_LANGUAGE + FOLLOW_REPLY_LANGUAGE;
3. Send, Vision and Private Mode still bridge to their Behavior/Depth pathways;
4. the seam handle shows its spatial pathway and source-authored allocation;
5. Structure shows Workspace frame > Header / Body frame > Browser / Companion;
6. VexLife-Android Stable remains the accepted phone realization.

## Human witness gate

Before READY / approval / merge:

Victor must witness the exact candidate head in raw-git preview and confirm both:

1. VexLife-Prod appears as the intended first-class peer and opens in the same Screen Lens shell;
2. the existing VexLife-Android Stable experience still retains the context and behavior he recognizes as accepted.

```text
AUTOMATED_PASS != HUMAN_WITNESS
SOURCE_COMPATIBILITY != PERCEIVED_CONTINUITY
WITNESS_HEAD_A != WITNESS_HEAD_B
```

Any candidate head/tree change after Victor's acceptance invalidates that witness and requires a fresh preview.

## Fresh-instance entry

A fresh worker should enter here, then read only the implicated owners:

```text
this file
projects/vexboard/SCREEN-LENS.md
projects/vexboard/SCREEN-LENS-ADAPTER.md
projects/vexboard/lens/catalog.json

VexLife-Prod:
  src/jvmMain/kotlin/vexlife/lens/VexLifeProdScreenLens.kt
  docs/lens/vexlife-prod.screen-lens.json

VexWork Experience Graph:
  PR #321 exact accepted head/tree
  projects/vexlife-prod-end-to-end-tests/experience-graph/README.md
```

Re-observe mutable branch heads before implementing. Preserve completed proof rather than replaying it.

## Non-claims

This intention source does not claim:

- that the current VexLife-Prod exported Lens is visually final;
- that an element/pathway count, by itself, proves Product or human acceptance;
- that every Experience Graph relationship belongs in the Screen Lens;
- that VexLife-Prod Stable/Main pointers have already been admitted in VexWork;
- that #323 should merge;
- that Android must be modified;
- that this PR is READY or merge-authorized.

The work is complete only when the shared Screen Lens experience truthfully carries VexLife-Prod as a peer and Victor has witnessed the exact candidate without loss of Android continuity.

<!-- [VXG RealForever][VEXBOARD][VEXLIFE-PROD][SCREEN-LENS] -->
