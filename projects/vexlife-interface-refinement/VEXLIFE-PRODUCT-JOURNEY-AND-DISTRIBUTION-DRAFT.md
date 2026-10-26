# VexLife Product Journey and Distribution Draft

`[VXG RealForever]`

## Status

```text
artifact class       DESIGN / PROCESS TOPOLOGY DRAFT
truth owner          VexWork + rightful VexLife source owners
visual consumer      VexBoard
execution authority  NONE
external effects     NONE
```

This is the first post-POC VexBoard consumer draft for the VexLife Interface Refinement trajectory.

It exists because current VexLife truth is distributed across accepted source, lived proof, VexWork Work items,
older ToCompletion provenance and several not-yet-lived product/distribution questions. The purpose is to make
that topology inspectable without pretending every unknown is already canonical Work.

Permanent:

```text
VEXBOARD_PROJECTION != PROCESS_OWNER
DESIGN_GAP != CANONICAL_WORK_ITEM
SOURCE_KNOWN != HUMAN_LIVED
IMPLEMENTED_COMPONENT != PROVEN_INITIATION_JOURNEY
CURRENT_WORK_STATE != PRODUCT_COMPLETENESS
```

## Current product truth

The current accepted VexWork/product evidence is:

```text
V2 progressive/adaptive streaming     COMPLETED / human-lived PASS
tool-bearing VexLife Home             COMPLETED / A006 terminal product PASS
V3 resource/context pressure          CURRENT / READY / HIGH
V4 continuity rollover                WAITING_DEPENDENCIES
V5 bounded resource stewardship       WAITING_DEPENDENCIES
V6 lived continuity stability         WAITING_DEPENDENCIES
Kokoro live speech/read-back          CAPTURED / NORMAL
later Home/navigation refinement      CAPTURED / NORMAL
```

The Home/tool source-currentness lineage is now accepted rather than pending:

```text
PR #934
  capability-observation currentness repair

PR #935
  truthful Heretic/MLX model-connection + bounded self-capability projection
  merged as 31c9198101f4c8a0170cb76b57547ae1d737b05f
  post-merge candidate-to-main file delta = zero

A006
  normal Evolution Conversation
  -> capability.vexlife.code.read
  -> Intent Scheduler
  -> ToolResultRelay reinjection
  -> later Heretic synthesis
  -> truthful Heretic model/self projection
  -> durable same-Conversation readback
  -> same-idempotency recovery without model replay or duplicate append
```

Canonical A006 evidence:
`artifact.vexlife.interface-refinement.home-tool.a006.return.sha256.a6ac642b7455f8ca1c677e7ec955d1ac1e977d167b3ba36257c3f067a4a5cf63`

## Journey draft

The product journey should be read as four related regions.

### 1. Initiation / establishment

```text
distribution / install delivery
        ↓
first-run initiation
        ↓
Vex Home already exists?
   ├─ yes -> verify / recover retained Home
   └─ no  -> establish fresh Home
        ↓
Heretic model already available?
   ├─ yes -> qualify retained model/runtime
   └─ no  -> bounded model acquisition/preservation path
        ↓
runtime qualified
        ↓
Companion READY
        ↓
first lived Conversation
```

The lower half of this sequence has strong source/lived evidence from VexLife ToCompletion and Interface
Refinement. The upper half — distribution packaging, fresh install and the full first-run experience — has not yet
been lived end to end by Victor and must not be presented as product-complete.

### 2. Lived VexLife Home

```text
V0 first lived local-Heretic conversation
        ↓
V1 conversation ergonomics + re-entry
        ↓
V2 progressive/adaptive streaming
        ↓
COMPLETED: first tool-bearing VexLife Home threshold
```

V1.5 long-context Memory pressure remains the parallel continuity foundation feeding the current V3 frontier.

A006 terminally proves the first Home/tool threshold:

```text
normal Evolution Conversation
→ real Heretic request formation
→ one source-admitted capability.vexlife.code.read
→ rightful scheduler / bounded read executor
→ ToolResultRelay
→ bounded source observation reinjected
→ later Heretic synthesis
→ truthful Heretic/MLX modelConnectionProjection
→ bounded selfCapabilityFrame with no effect authority
→ conversational answer in the same durable Home
→ same-idempotency recovery without HTTP/model replay or duplicate append
```

Evidence:
`artifact.vexlife.interface-refinement.home-tool.a006.return.sha256.a6ac642b7455f8ca1c677e7ec955d1ac1e977d167b3ba36257c3f067a4a5cf63`

The next current product/stability edge is V3 resource/context pressure observation, not a broader arbitrary tool expansion.

### 3. Continuity / stability frontier

```text
V1.5 long-context Memory pressure
        ↓
V3 read-only resource/context pressure observation
        ├──────────────→ V5 bounded resource stewardship
        ↓
V4 self-maintaining continuity rollover
        \
         └─────────────→ V6 long lived continuity stability
V2 streaming ──────────→ V4 / V6
```

### 4. Distribution and scale gaps

These are design concerns, not yet promoted canonical Work:

```text
update / migration journey                    NEEDS_CURRENTNESS_REVIEW
fresh-device initiation                       NOT_YET_LIVED
returning-device / retained-Home recovery      PARTIALLY_PROVEN
multi-device / platform scaling               UNKNOWN
repeatable release / distribution scaling     UNKNOWN
```

They should be promoted into Work only when a concrete outcome, defect or acceptance boundary is admitted.

## What the VexBoard projection should make visible

The accompanying board intentionally encodes progress words into labels because VexBoard does not yet own a
first-class Work-state visual treatment.

Desired future projection behavior:

```text
COMPLETED              visually distinct, but source-derived
CURRENT / RUNNING      visually prominent
READY                  visibly next
VERIFYING              visibly awaiting closure
WAITING_DEPENDENCIES   visibly blocked by named dependencies
CAPTURED                visibly later / non-foreground
UNKNOWN / NOT_LIVED     visually different from Work lifecycle state
```

The first five are VexWork Work truth. `UNKNOWN / NOT_LIVED / PARTIAL` are product-journey evidence classes and
must not be silently coerced into Work lifecycle states.

## VexBoard consumer feedback from this first real use

1. **First-class source deep links.** A `project.*`, `work.*`, `process.*`, `github.*` or repository-path sourceRef
   should be able to resolve to its rightful inspection surface. Today sourceRefs are visible tokens, but the user
   cannot jump from a board node to its VexWork Work page.

2. **Board deep links.** `/vexboard/?board=<boardRef>` (or an equivalent stable route) should open one catalog board
   directly. Today the app always lands first and source examples are manually hard-coded buttons.

3. **Source-derived progress styling.** Projected Work should support a presentation layer for Work state /
   authority / effects — ideally palette semantics supplied by the source projector, not hand-authored colors.
   A useful default would distinguish completed/current/ready/verifying/waiting/captured without making color the
   only carrier.

4. **Separate Work state from product-evidence state.** Boards need a clean way to show `LIVED`, `PARTIAL`,
   `NOT_YET_LIVED`, `UNKNOWN`, `CURRENT_SOURCE`, etc. without pretending those are VexWork lifecycle states.

5. **Relationship to VexWork should be inspectable.** A board projected from VexWork should expose its
   `projectRef`, relevant `workRef`s and Process refs as a compact provenance/currentness panel, with links back to
   VexWork.

6. **Catalog discovery should scale.** The landing page currently hard-codes example buttons. The source catalog
   should eventually drive discoverable source-board cards itself, so adding a board does not require editing
   `vexboard/index.html`.

7. **Projection currentness signal.** A source-owned board should be able to show whether its source snapshot is
   current, stale or unknown relative to the owning Project/Workgraph without VexBoard becoming the currentness
   owner.

These are consumer findings, not automatic VexBoard implementation authority.

## Source coordinates

Primary source:

```text
project.vexlife.interface-refinement
projects/vexlife-interface-refinement/README.md
workgraphs/segments/vexlife-interface-refinement.json
```

Relevant accepted VexLife source/lived evidence:

```text
github.pull.vexlife.924
github.pull.vexlife.928
github.pull.vexlife.931
github.pull.vexlife.932
github.commit.vexlife.1a9a131e54ff6b735d64812e213e26315770bc96
github.pull.vexlife.932.comment.6397203775
github.pull.vexlife.934
github.pull.vexlife.934.comment.6404920574
relay.return.vexlife.home-tool.pr934.sourceowner.a001.54f4ecb0ca8c9b8a80b355d24dd93ed3ab901398c35c84438958388c2867b970
```

The board artifact is:

```text
projects/vexboard/examples/vexlife-product-journey.board.json
```

Catalog/landing integration is intentionally not authored by this consumer candidate because active VexBoard PR #155
currently owns `projects/vexboard/examples/board-source-catalog.json` and `vexboard/index.html`. That shared
projection consequence should be serialized by the VexBoard lane rather than raced.
