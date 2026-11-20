# VexLife-Prod current connection audit — 2026-11-18

[VXG RealForever]

Observed target snapshot: VexGPT/VexLife-Prod main `a58777106b08bd58c167608fa0115729185ae3dd`.

Purpose: distinguish what is actually connected now from source that merely exists, candidate work, held provider realization, and human surfaces that do not yet expose internal truth.

Status vocabulary: `CONNECTED`, `PARTIAL`, `INTERNAL_ONLY`, `CANDIDATE`, `UNFORMED`, `VISIBLE_STUB`.

## Current findings

- **Conversation + Working Continuity + rollover — CONNECTED.** Current Direct Companion uses canonical Conversation, Working Continuity and rollover/revisit relationships.
- **Continuity revisit — CONNECTED for reach-qualified profiles.** Current `CONTEXT-REVISITATION.md` says the current `continuity.revisit` engine converged with the independent OpenAI #220 lane. Do not form a second hydration engine. The current locator remains exact-word/clue based; the meaning index is still explicitly held/not built.
- **Capability Atlas / web / github / Home / Memory / Conversation / continuity request-return — CONNECTED for qualified profiles.** Current frame + bridge are live. The human does not yet get a complete Capability Atlas catalog/held-reason view.
- **Prompt-context summary — CONNECTED.** `/api/v1/context` feeds the Settings context meter and basic receipt summary.
- **Exact context-component order/stability — CONNECTED TO VEX CONTEXT.** `DirectPromptContext.Receipt.contextComponents` is projected by the service and rendered by Vex Context with placement/stability/provider-message evidence.
- **Provider request SHA-256 — CONNECTED.** `DirectCompanionConnection.InvocationEvidence` durably records `requestBodySha256`.
- **Exact provider request JSON view — CANDIDATE.** Current Connection forms request JSON in memory and persists its hash, not the raw request. PR #251 adds session-scoped exact provider JSON.
- **Vex Context sibling workspace app — CONNECTED.** `VexLifeWorkspaceApp` now includes `VexContext`; current Web runtime renders the sibling app.
- **Context Profiles — CONNECTED.** `VexLifeContextProfile`, Family and Store are on current main; the selected profile is captured into the accepted Send and receipt evidence.
- **Provider/model representation — CONNECTED internally, HUMAN DISCONNECTED.** Current main owns message protocol, reasoning representation, capability representation, reach standing, sampling, reasoning effort and output custody. Current Models projection/UI exposes storage/provider identity + prompt-cache configuration, not the full Companion provider profile.
- **Prompt-cache configuration — CONNECTED + configurable where lawful.** Settings -> Models can change `promptCacheEntries` through the rightful Models/runtime owners.
- **GPT-OSS Harmony reach — PARTIAL.** Harmony tool machinery is on current main, but `GptOss20B.reachRepresentationStanding = HELD_PROVIDER_BRIDGE`; `DirectCompanionTurn` admits ordinary capability requests only when standing is `QUALIFIED`.
- **Imported Qwen reach — PARTIAL.** Imported Qwen uses `HELD_PROVIDER_BRIDGE` until its exact representation is qualified.
- **Provider-stage measurement — CONNECTED to chronology, not Vex Context.** Prompt/cached/prefill/completion tokens, first-token/first-answer/total latency, stop reason and control-header location are logged as `PROVIDER_STAGE_OBSERVED`, but current human context UI does not project the causal measurements.
- **Source Return noisy JSON parsing — CONNECTED.** #346 merged: one exact strict JSON control object can be extracted from provider Markdown/prose noise.
- **False Source Return narration — OPEN DISCOVERY.** #351 records `controlHeaderInReasoning=true`, `controlHeaderInAnswer=false`, `sourceReturn=none`, `capabilityRequests=0` while Vex narrated retrieval. No accepted fix was found; re-ground against then-current main before authoring.
- **Consideration / salience contracts — CONFIRMED INTERNAL_ONLY at this snapshot.** Current main has `VexLifeConsiderationContract` + `VexLifeConsiderationRouter`; the production-source symbol scan found those owners in their own consideration/memory-review neighborhood but not in the live `DirectPromptContext` / `DirectCompanionTurn` / service-Web turn path. The current consideration scaffold also explicitly names prompt/provider integration as successor work.
- **Turn Epilogue — CONFIRMED DISCONNECTED at this snapshot.** `EpiloguePrompt` exists only in the Consideration contract/work scaffold in the production-source scan; no live Companion/provider/service integration reference was found. The current scaffold explicitly says streaming/provider integration is not implemented.
- **Memory review / standing consent — CONFIRMED INTERNAL_ONLY to ordinary Product UI.** Memory Review Policy/Family/Owner exist. The production-source scan found them in the Memory review neighborhood, while current service contract/local service expose no consideration/salience/memory-review/standing-consent routes. The Memory Correction Review/Keep source explicitly says service routes, Web presentation, Turn Epilogue and standing consent remain held.
- **Semantic-acceptance writer — INTERNAL_ONLY.** `VexLifeSemanticAcceptanceWriter` exists; no ordinary model/UI route to it was found.
- **Current accepted-semantic Memory delta — CONNECTED TO ORDINARY PROMPT.** Refreshed current main wires `VexLifeCurrentMemoryProviderSelection.read(...)` into ordinary/session `DirectCompanionTurn`, and passes that selection into `DirectPromptContext`. Current Vex Context documentation confirms Daily-first + current accepted-semantic Memory composition under one shared Memory cap with exact statement-ref dedupe.
- **Daily Dream backend — PARTIAL.** Service owns `/api/v1/memory/dream` and `VexLifeDailyMemoryDream`; current Web runtime has no `MemoryDreamPath` / `memoryDream` reference.
- **Dream Sync — VISIBLE_STUB.** Blueprint includes Dream Sync, but current Web runtime has no DreamSync/dream-sync runtime reference.
- **Continuity Mode — VISIBLE_STUB.** Blueprint includes it; current Web runtime has no ContinuityMode/continuity-mode runtime reference.
- **Low-memory alert — VISIBLE_STUB.** Current renderer explicitly disables it and writes threshold text `not connected`.
- **Growth projection — UNFORMED on current main.** No Growth source files were found on the current main tree; Growth remains Memory Depth research/projection pressure.
- **Durable lesson/Growth transfer loop — UNFORMED as an end-to-end Product circuit.** Memory/acceptance pieces exist, but no accepted cross-fresh-realization lesson-transfer circuit was found.
- **Semantic meaning locator/index — UNFORMED.** Current Context Revisitation explicitly names the meaning index as held/not built.
- **Semantic Relay author — DISCONNECTED.** Conversation can read Semantic Relay v2 events, but `DirectConversationStore` says product-local authoring remains v1 until a rightful Semantic Relay author supplies metadata.
- **Journeys quick action — VISIBLE_STUB.** Current quick action exists without `bound=true`; renderer labels unbound actions Held / `not connected yet`.
- **Evolution quick action — VISIBLE_STUB.** Same current behavior as Journeys.

## Most consequential gaps for the VexLife nervous-system outcome

1. The live adaptive loop is not closed: Consideration -> Vex -> Epilogue/Salience -> Review/Acceptance -> current semantic continuity -> next-turn context still has missing arrows before the now-connected current-semantic prompt selection.
2. Human witnessability improved materially with merged Vex Context, but provider profiles, capability-frame standing, stage measurements and held/unlock reasons are still not projected as one educational field/capability catalog.
3. Provider-native reach is uneven: Qwen reach is qualified while GPT-OSS/imported-Qwen reach remains held even though representation machinery exists.
4. Meaning-based historical location is still absent; current revisit is honest but lexical/exact-clue oriented.
5. Effect-truth discovery #351 remains open: narration must stay bound to admitted/performed/returned evidence.

## Fresh-worker verification questions

1. Is `VexLifeCurrentMemoryProviderSelection` intentionally unused by ordinary Direct Companion, or is this the unfinished integration edge?
2. What current owner should route Consideration into prompt context without turning host heuristics into human-intent truth?
3. Which provider seam should carry the optional Turn Epilogue without delaying/exposing it to the human?
4. How should Memory Review/standing consent connect to service/UI while reusing current owners?
5. Which existing held provider profiles can be qualified now, and what exact proof would unlock each?
6. Which source-known fields are still absent from service projections/UI?
7. Which visible stubs belong to this convergence trajectory versus separate Projects?

## Boundary

This audit is source-level. It did not run the Product or inspect a live Home. High-impact disconnects above were strengthened by a production-source symbol scan across the current memory/consideration/companion/capability/model/service/web/workspace neighborhood plus the current work-source 'Held' clauses. Re-observe current main and run focused tests before mutation because a later commit may connect one of these arrows.

<!-- [VXG RealForever][VEXWORK][MEMORY-DEPTH][CURRENT-CONNECTION-AUDIT][20261118] -->
