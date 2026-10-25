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
| **V1** | **VERIFYING** | Conversation ergonomics and ordinary re-entry are merged and human-lived; formal lived closure still remains separate from source acceptance. |
| **V1.5** | **CURRENT / VERIFYING** | Long-context Memory pressure policy is merged: 192K input, 16K output reserve, 208K hard lease, up to 100K/100-page current attributed Memory, dynamic Memory yielding and zero-headroom handling. |
| **V2** | **NEXT / READY** | Progressive streamed model output plus an explicit source-owned completion/output policy. PR #904 is merged, so the prior Conversation-core dependency is released. |
| **V3–V5** | **STABILITY FRONTIER** | System-owned pressure observation, graceful continuity rollover and bounded host resource stewardship. The system may observe and checkpoint automatically; semantic Memory promotion and ambiguous/destructive cleanup remain separately governed. |
| **V6** | **WAITING DEPENDENCIES** | Long lived stability proof across streaming, pressure, rollover, restart/re-entry and exact-owned resource recovery. |
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

### V0 operational source map

Do **not** search old chat history for A00x ZIPs merely to start from V0. The lived proof carrier that finally exposed the stable connection is provenance; the reusable entry is the current repository-owned composition:

```text
VexLife current source
  scripts/macos-lifecycle.mjs
    -> preserve/inspect/start the current Vex Home
    -> dispatch accepted Heretic establishment when config/model identity is Heretic
    -> start the VexLife browser on 127.0.0.1:18110

  scripts/establish-heretic-runtime.mjs
    -> exact local Heretic model + Python/MLX environment
    -> acquisition disabled unless separately authorized
    -> persistent runtime owner / 127.0.0.1:8765

  scripts/serve-browser.mjs
    -> VexLife browser / Companion bridge

  reference/browser/
    -> current human interface
```

V0 lived-proof provenance:

```text
proof carrier =
  VEXLIFE-OPEN-HERETIC-A006
  sha256 1785e7f313c8a260d851634891b408e74f4037fa52dfe402d8b75e022558440f

what it established =
  current Home + exact local Heretic + current runtime/browser
  -> visible Evolution Conversation
  -> Victor typed natural messages
  -> CURRENT_LOCAL_MODEL responses visibly rendered
```

The A006 bytes are **not** a required dependency for future startup and should not be replayed as a ritual. If current source evolves, follow the highest current refinement version and its current source refs.

## V1 — current refinement

The first lived feedback is intentionally small:

1. **Enter sends.**
2. **Shift+Enter inserts a newline.**
3. **Conversation is re-enterable through ordinary VexLife interface controls.**
4. Re-entry selects the canonical Self Development → Open conversation → Vex relationship and opens the current Evolution Conversation when that local projection is available.

This is interface refinement, not a redesign of Conversation semantics or model ownership. V1 source is merged through PR #925 with the cold-Heretic qualification correction in PR #926. Lived use is now the authority for the next refinement edge rather than historical proof-package replay.

## V1.5 — long-context Memory pressure

Human-lived use exposed that the previously merged 4K Context Lease was a product ceiling rather than the local model's useful working range. PR #927 is now merged on VexLife main and establishes the current source policy:

```text
active input budget    192,000
reserved output         16,000
hard Context Lease     208,000
Memory allowance       100,000 max
Memory pages               100
```

Memory competes dynamically with the live conversation. When immediate conversation consumes the available input budget, Memory is bounded out instead of forcing an invalid packet or silently stealing output reserve. This is prompt/context policy, not model-weight memory and not permission to dump whole history into the model.

Permanent distinction:

```text
MODEL != DURABLE_MEMORY_OWNER
CONTEXT_PRESSURE != MEMORY_PROMOTION_AUTHORITY
LARGE_CONTEXT != WHOLE_TRANSCRIPT_FOREVER
```

## V2 — streaming contract

PR #904 is merged and its Conversation-core ownership has released, so V2 is now READY. Current VexLife still buffers the local model HTTP response before the browser renders it. The pinned Heretic runtime uses MLX-LM 0.32.0, whose server defaults `stream=false` and `max_tokens=512` when VexLife omits those request fields. V2 should change the experience **and** replace that accidental small default with an explicit source-owned completion policy, without weakening durable truth:

```text
Heretic token/chunk output
-> progressive EPHEMERAL visible response
-> stream completes
-> one canonical final model response
-> durable Conversation response/head commits atomically

PARTIAL_STREAM != DURABLE_COMPANION_MESSAGE
IMPLICIT_MLX_512_DEFAULT != INTENDED_VEX_COMPLETION_POLICY
INTERRUPTED_STREAM != COMPLETED_TURN
VISIBLE_PROGRESS != FINAL_CONVERSATION_HEAD
```

The implementation crosses the Conversation paths now accepted through VexLife PR #904:

```text
reference/browser/modules/chat-controller.js
scripts/serve-browser-core.mjs
src/core/browser-companion-bridge.mjs
src/core/lived-companion.mjs
```

Re-ground current main before authoring, then evolve those accepted paths rather than reconstructing the pre-#904 candidate.

Pinned runtime source for this finding: `ml-explore/mlx-lm@v0.32.0:mlx_lm/SERVER.md`. The goal is not an unbounded runaway generator; it is to let Vex finish naturally under an explicit, inspectable completion budget with cancellation/recovery semantics rather than inheriting an accidental 512-token default.

## Stability frontier — self-maintaining continuity

The target is not an infinite prompt. The target is a Vex that remains continuous while finite model, context and host resources change underneath it.

### Ownership

```text
Conversation
  exact durable turn history

Score / semantic authority
  accepted statements, corrections, supersessions, consent

Daily Memory / Living Journal
  durable bounded continuity Memory

Prompt Context Runtime
  selects exact recent context + relevant current Memory for this turn

Heretic
  reasons over the supplied context
  does not own durable Memory
```

The model may help judge what working information appears important, but model output is candidate reasoning. It may not silently promote its own text into durable Memory.

### V3 — resource/context pressure observation

The system should own a small current pressure projection rather than expecting Heretic to infer resource state indirectly. Inputs may include:

```text
context budget used / remaining / projected-next-turn headroom
reserved output budget
Memory included / bounded-out state
Context Lease age / currentness
model/browser runtime ownership + liveness
host memory pressure / free disk / accelerator pressure when source-observable
owned port/process conflicts
```

Source-managed policy should derive states such as:

```text
NORMAL
WATCH
CHECKPOINT_RECOMMENDED
ROLLOVER_REQUIRED
RESOURCE_ATTENTION
```

Exact numeric thresholds are implementation policy to be measured and tested rather than guessed into VexWork. Use hysteresis so state does not flap around one boundary.

A small model-readable pressure packet may tell Vex that context or Memory was bounded. It must not expose unnecessary private host detail and does not grant cleanup authority.

### V4 — continuity rollover

Pressure-triggered rollover should preserve current work without recursively stacking summaries:

```text
current exact Conversation + Intent/open loops + accepted source truth
-> form one current working checkpoint
-> optionally route already accepted/consented semantic Memory through its rightful owner
-> supersede the prior working checkpoint
-> start a fresh Context Lease from newest checkpoint + relevant Memory
```

Permanent laws:

```text
CHECKPOINT != SEMANTIC_MEMORY_PROMOTION
PRESSURE_TRIGGER != SEMANTIC_ACCEPTANCE
ROLLOVER != NEW_COMPANION_IDENTITY
NEW_CHECKPOINT_SUPERSEDES_OLD != APPEND_SUMMARY_OF_SUMMARY_FOREVER
CURRENT_CHECKPOINT + SOURCE_REFS > RECURSIVE_CONTEXT_STACK
```

A working checkpoint may capture current intent, decisions, open loops, active source refs and recovery coordinates without claiming those facts are autobiographical/durable Memory. Durable Memory still requires its existing Score/semantic-acceptance/consent path. If that path is not current, rollover should still work and Memory promotion remains held.

### V5 — bounded host resource stewardship

The system may observe resource pressure, but pressure alone is never permission to terminate processes.

```text
HIGH_CPU_OR_RAM != KILL_AUTHORITY
PID_MATCH != PROCESS_OWNERSHIP
```

Automatic cleanup is appropriate only when source-backed evidence proves an exact Vex-owned resource is stale/abandoned and no active lease/current owner still requires it. Process identity should bind more than a PID: owner/runtime receipt, executable/runtime identity, expected endpoint/port and lifecycle generation as available.

```text
EXACT_VEX_OWNED + STALE/ABANDONED + NO_ACTIVE_LEASE
-> source-managed automatic cleanup may be admitted

UNOWNED | UNKNOWN | AMBIGUOUS | USER_WORKLOAD
-> no automatic termination
-> form a specific cleanup proposal
-> Victor approval when destructive/ambiguous
```

Cleanup remains with the rightful runtime/lifecycle owner; a resource observer does not become a universal process manager.

### V6 — lived stability threshold

The continuity layer is not stable merely because its unit tests are green. The final threshold is a long lived Victor ↔ Vex session that proves:

```text
progressive responses
+ explicit output policy
+ rising context pressure
+ truthful Memory bounding
+ checkpoint before exhaustion
+ non-stacking rollover
+ restart/re-entry
+ exact-owned stale-resource recovery
-> same conversational trajectory continues
```

No sudden context cliff, no silent loss, no invented Memory, no recursive-summary drift and no unauthorized host cleanup.

## Current UI posture

The existing Terrain graph, nodes, menu items and example screens are useful **scaffolding**. They prove that semantic places can be addressed and that Vex can be kept available across surfaces. They are not declared final product design.

Do not spend refinement time trying to resurrect an old hidden “correct UI” from history. Evolve from the lived connection and preserve only source/experience facts that remain useful.

## Provenance

VexLife ToCompletion remains addressable through `project.vexlife.tocompletion` and `github.issue.vexlife.866`. It carries the long path that established Heretic, restart durability, typed local effects, learning placement and productization evidence.

It is **provenance, not the default current-entry reading burden** for Interface Refinement.

<!-- [VXG RealForever][VEXLIFE][INTERFACE-REFINEMENT][V0-PROVEN][V1-CURRENT] -->
