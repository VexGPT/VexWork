# VexBoard Projection Consolidation — Current Divergence Map

[VXG RealForever]

**Observed:** 2026-11-20

## Current coordinates

| Repository | Observed main | Projection relevance |
|---|---|---|
| VexGPT/VexWork | 21d12018d78c78f427effa752562f3a70e73010b | Project source + shared Screen Lens contract/reader |
| VexGPT/VexLife-Prod | 8dbbd3f250556fe9cc6664849be65a67e9c1fc76 | Product-native exporter/output under comparison remains current |
| vgong24/VexLife-Android | d857a92371555472e0303b18eadf353da2a868d6 | Android source consumed by bounded VexWork adapter |

VexWork main advanced after Project formation for unrelated work. The projection-core blobs inspected
for this map remain unchanged from the handoff baseline:

~~~text
src/shared/vexboard-screen-lens.mjs
  5355520c129671adf01bf8934bc5cb6f7a4e5cc4

src/shared/vexboard-screen-lens-realization.mjs
  e2c3505dd1d952809e7df9908d51b8012245d385

src/shared/vexboard-screen-lens-source-expressions.mjs
  3ed77583345d45cd90a9d820f113135d56ebe1fa

src/shared/vexboard-screen-lens-frames.mjs
  2d441c9a5d3ed17632bc651532adeebebd8f0c45

vexboard/lens.html
  fb89a1ca1baa931007706a2695eb69e84fe04707
~~~

## Classification

- SOURCE_EARNED_DIFFERENCE — current product/source meaning really differs; preserve it.
- PRODUCER_IMPLEMENTATION_DETAIL — the route into the contract differs legitimately.
- GENERIC_SHARED_BEHAVIOR — one shared VexBoard owner should carry the law.
- ACCIDENTAL_DUPLICATION — the same meaning is encoded separately because of historical evolution.

## Evidence matrix

| Concern | Android | VexLife-Prod | Classification | Direction |
|---|---|---|---|---|
| Producer | VexWork bounded source adapter | Product-native Kotlin exporter | PRODUCER_IMPLEMENTATION_DETAIL | Converge at emitted Lens, not implementation location. |
| Screen topology | many native screens | one persistent Product workspace | SOURCE_EARNED_DIFFERENCE | Preserve product topology. |
| Element identity | registered Android refs / parent hierarchy | Blueprint refs + VexWeb container placement | GENERIC_SHARED_BEHAVIOR | One ref/parent contract; derivation stays producer-local. |
| Behavior / Depth | Android pathway population + existing Android-sync depth repair | Product pathway population from Product source | GENERIC_SHARED_BEHAVIOR + PRODUCER_IMPLEMENTATION_DETAIL | Keep one role grammar; consume Android-sync repair rather than duplicating it. |
| Presence / expressions | selections, presentations, populations, conditions, examples | selections, nested presentations, branches and Product states | GENERIC_SHARED_BEHAVIOR | Same realization/expression engine. |
| Manifestation topology | compact-flow today | framed workspace today | SOURCE_EARNED_DIFFERENCE | Describe source shape; never branch on platform/product name. |
| Rendering substrate | Lens element tree | Product SOURCE_VIEW / STATIC_HTML_CSS plus structural facts | SOURCE_EARNED_DIFFERENCE | Keep substrate separate from topology. |
| Interaction/state realization | typed Android intent/presentation relationships | Product-authored SELECT / TOGGLE / SPLIT + safe DOM consequences | SOURCE_EARNED_DIFFERENCE | Share binding grammar/application law, not Product-specific mutations. |
| Localization / visuals | native resource/icon identities | Product localization keys/words + Product-authored visual markup | SOURCE_EARNED_DIFFERENCE | Preserve source ownership. |
| Overlay / containment | native sheets/dialogs/compact scroll | workspace overlay/modal/transient layers | GENERIC_SHARED_BEHAVIOR | Generic layer/container/overflow mechanics. |
| Stable/Main/currentness | explicit accepted Stable vs observed Main | same build semantics | GENERIC_SHARED_BEHAVIOR | Keep acceptance explicit; no automatic Stable promotion. |
| Proof | rich Android adapter/generic tests | Product exporter tests + separate VexWork integration tests | ACCIDENTAL_DUPLICATION | Add one producer-neutral emitted-payload conformance proof. |

## Historical evidence that shaped the classification

The important failures/corrections were architectural, not merely visual:

~~~text
Android #209
  -> one rightful owner per question
  -> presentation manifests truth; it does not own truth

Android #218
  -> Product/evidence identities remain Android-owned
  -> VexBoard consumes them read-only

VexLife-Prod #123
  -> native Product exporter
  -> same vexboard.screen-lens/v1 boundary
  -> no requirement to reuse Android adapter

VexWork #323
  -> generic Experience Graph canvas passed tests
  -> human witness rejected the product topology

VexWork #325
  -> Android and Prod become peer subjects in the same Screen Lens shell

VexLife-Prod #385 + VexWork #329
  -> Product workspace was incorrectly drawn as a phone
  -> source-authored FRAME/SEAM/REGION/HANDLE facts
  -> generic workspace rendering chosen from layout facts, not subject slug

VexLife-Prod #432 lineage
  -> relationship state
  -> effective nested state
  -> Product-authored manifestation consequences
  -> generic consequence application

VexWork #366
  -> container/scroll ownership is generic reader behavior, not a Product workaround

VexLife-Prod #437
  -> accepted recursive Product projection currentized to main
  -> broader Android/Product alignment explicitly left to this successor Project
~~~

## Architectural synthesis

Four coordinates must stay independent:

~~~text
platform / host provenance
manifestation topology
rendering substrate
presentation-state realization
~~~

Current products happen to correlate as:

~~~text
Android
  -> COMPACT_FLOW
  -> ELEMENT_TREE

Prod
  -> FRAME_WORKSPACE
  -> SOURCE_VIEW
~~~

Those correlations are not architecture identities.

The outer HostViewport is a fifth, external constraint. Width, height, safe area, pointer/touch,
keyboard and resize may alter how a manifestation fits without changing Product identity or semantic
meaning.

## First executable convergence pressure

The first reusable implementation is a conformance harness over emitted Lens payloads:

~~~text
raw producer payload
-> normalizeScreenLens
-> expressionsFor(each screen)
-> realization resolution
-> frame geometry when authored
-> shared role/reference invariants
~~~

Run the same proof over:

1. Android Main Lens;
2. accepted/current Product Lens;
3. a neutral FRAME_WORKSPACE + ELEMENT_TREE fixture with no static Product view.

The neutral fixture is intentionally not fake iOS/Windows. It exists only to prove that an admitted
shape does not require a Product/platform-name branch.

## Active coordination boundary

Open VexWork #361 currently changes the existing Screen Lens normalizer, Android adapter,
realization/expression modules, established tests, Lens JSON and global generated aggregates.

This Project therefore begins additively and does not edit those owned paths. Core contract changes
wait until the conformance evidence proves they are required and the active membrane is available.

<!-- [VXG RealForever][VEXBOARD][PROJECTION-CONSOLIDATION][CURRENT-DIVERGENCE-MAP] -->
