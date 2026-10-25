# VexLife Interface Refinement

`[VXG RealForever]`

## Current entry

This Project begins **after VexLife successfully reached a human-lived local-model connection**.

Victor can open the local VexLife browser surface, type naturally to **Vex**, and receive real responses from the locally installed Heretic model. That lived connection is **V0**.

The rule for every fresh instance is:

```text
START_FROM_HIGHEST_CURRENT_REFINEMENT_VERSION
V0 = FIRST_PROVEN_CONNECTION / PROVENANCE ANCHOR
V0 != PERPETUAL_RESET_POINT
TOCOMPLETION = PROVENANCE_CONTEXT
TOCOMPLETION != CURRENT_INTERFACE_ENTRY
```

Descend into VexLife ToCompletion only when the latest refinement version names an exact dependency or a contradiction requires provenance.

## Version line

| Version | State | Meaning |
|---|---|---|
| **V0** | **PROVEN** | First human-lived Victor ↔ local Heretic conversation through VexLife. Connection/runtime is the stability anchor, not the surrounding placeholder UI. |
| **V1** | **CURRENT / RUNNING** | Conversation ergonomics and ordinary re-entry: Enter sends, Shift+Enter creates a newline, and the interface can return to the canonical Vex conversation without a special proof URL. |
| **V2** | **NEXT / WAITING DEPENDENCY** | Progressive streamed model output with final-only durable Conversation commit. Requires the current Conversation-core candidate in VexLife PR #904 to release/land its owned paths. |
| **Later** | **CAPTURED** | Refine Home, Terrain, nodes, menus and other interface neighborhoods from lived feedback. Current maps/screens are scaffolding, not a recovered final design. |

A later V3/V4/... becomes the entry point when it is current. Do not tell a fresh instance to reconstruct V0 just because V0 is the earliest version.

## V0 — what is actually stable

Observed lived result:

```text
VexLife browser
-> local loopback product surface
-> Conversation / Vex relationship
-> Victor types natural text
-> local Heretic performs real inference
-> Vex response appears in the interface
```

Current source anchor at formation:

```text
VexLife main = 8f1e9fd9e3f38f8dc23296257df718fca9806988
Heretic      = model.devex.heretic.qwen3.8-27b.mlx4.329658ee8f27
runtime      = local MLX / 127.0.0.1:8765
browser      = 127.0.0.1:18110
surface      = Evolution Conversation / Vex
```

The recovery packages used to reach this point are historical diagnostic/proof carriers, not the canonical product entry. Current source owners remain the macOS lifecycle, Heretic runtime establishment, browser server and Conversation source in VexLife.

## V1 — current refinement

The first lived feedback is intentionally small:

1. **Enter sends.**
2. **Shift+Enter inserts a newline.**
3. **Conversation is re-enterable through ordinary VexLife interface controls.**
4. Re-entry selects the canonical Self Development → Open conversation → Vex relationship and opens the current Evolution Conversation when that local projection is available.

This is interface refinement, not a redesign of Conversation semantics or model ownership.

## V2 — streaming contract

Current VexLife buffers the local model HTTP response before the browser renders it. V2 should change the experience without weakening durable truth:

```text
Heretic token/chunk output
-> progressive EPHEMERAL visible response
-> stream completes
-> one canonical final model response
-> durable Conversation response/head commits atomically

PARTIAL_STREAM != DURABLE_COMPANION_MESSAGE
INTERRUPTED_STREAM != COMPLETED_TURN
VISIBLE_PROGRESS != FINAL_CONVERSATION_HEAD
```

The implementation crosses paths currently owned by VexLife PR #904:

```text
reference/browser/modules/chat-controller.js
scripts/serve-browser-core.mjs
src/core/browser-companion-bridge.mjs
src/core/lived-companion.mjs
```

Do not create a competing writer. Re-ground #904 and integrate V2 after that current Conversation-core ownership releases or lands.

## Current UI posture

The existing Terrain graph, nodes, menu items and example screens are useful **scaffolding**. They prove that semantic places can be addressed and that Vex can be kept available across surfaces. They are not declared final product design.

Do not spend refinement time trying to resurrect an old hidden “correct UI” from history. Evolve from the lived connection and preserve only source/experience facts that remain useful.

## Provenance

VexLife ToCompletion remains addressable through `project.vexlife.tocompletion` and `github.issue.vexlife.866`. It carries the long path that established Heretic, restart durability, typed local effects, learning placement and productization evidence.

It is **provenance, not the default current-entry reading burden** for Interface Refinement.

<!-- [VXG RealForever][VEXLIFE][INTERFACE-REFINEMENT][V0-PROVEN][V1-CURRENT] -->
