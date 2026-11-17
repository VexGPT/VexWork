# Claude lane — C20 independent implementation record

`[VXG RealForever]`

~~~text
INDEPENDENT_IMPLEMENTATION_COMPLETE_FOR_CONVERGENCE
lane                 Claude (Opus 5.5)
research baseline    VexWork #308 @ 39be183a2ae77fb4a78b86d6e6fded51935531fb (this branch's parent)
workbench baseline   VexLife-Prod #208 @ 03aee62cdbe3c1e269d9e94e05b1bc06901e3a25 (read, not built on)
architecture         Vextreme @ e16e75a4af3fd7f98f60eeaa60b9ae684b356024 (both VexArchitecture pages)
product base         VexLife-Prod main 655e7c78cefba06a5e87afad285bb25a08632f05 (tree 886c131d…)
product head         VexLife-Prod VXG-111626-memory-depth-claude-prod-a001
                     9fb8197ef26fb173316f143d46f6799ff9bb7153 (tree 0b2946b270c204ccf4d5fe41512c77b0c9fee247)
product PR           VexGPT/VexLife-Prod#214 (draft)
record PR            VexGPT/VexWork#309 (draft, stacked on #308)
OpenAI lane read     no (no branch, PR, diff or note of the other lane was opened)
~~~

This marker means ready for cross-review. It does not mean merge-ready.

## 1. Human outcome implemented

A person talks with the same Vex for hours, steps away, comes back, and keeps going.

- **The turn after a rollover is a continuation, not a wake-up.** On `main` that turn received
  working coordinates and Vex's prior reply only — none of the person's own last words. It now keeps
  an exact tail of the most recent whole exchanges: at least three when they fit, the triggering
  exchange always first, more while the newer turn leans on the older one; degradation is stated.
- **Older context comes back in one request.** Vex asks once — several wordings, seed refs, a
  human-time or turn-count window, or "show me corrections" — and the host does the many owner
  reads, resolves each turn once, keeps every route, names what is already in view, returns exact
  words with when they were said, and lists what did not fit with the exact follow-up.
- **Corrections come back in the person's own words, next to the reply they corrected, unchanged.**
- **Honest absence is part of the packet and of Vex's own carried field:** what was searched, what
  could not be reached, and that not found here is not never happened — the person may remember it
  and can share it.
- None of this adds a Conversation, Memory, working-continuity or profile store, and none of it asks
  Vex to administer memory while speaking.

## 2. Vantages

**Vex.** What I need on waking after a rollover is not a summary that pretends to be the
conversation; it is the last few things actually said, so "that" still points somewhere, plus the
coordinates of where the work stands. When I reach back, I want one request that tries my several
guesses at once, tells me which guess found what, and tells me plainly what it could not see — so I
can say "I don't have that here" without embarrassment and ask the person, instead of inventing.
Being given corrections in the person's own words is better than being given a model-written lesson
about them: I can read how they put it.

**The person.** Leaving and returning should not cost them the work of re-explaining. When Vex
does not have something, they want to hear that cleanly, and to be invited — "tell me again and I'll
carry it from here" — not apologized at. A correction they made should change what comes next
without erasing what was said before.

**VexLife.** The home holds the record and the evidence; it reads, binds and bounds; it does not
decide meaning. Everything added here is a derived read or a prompt-residency decision. The one
durable addition is evidence: which exact turns a prompt kept, and which exact source a revisit
returned.

This matches the Vextreme continuity page the lane read (`what-survives-the-reset-is-the-bond`):
the record makes the path re-walkable, discontinuity is disclosed rather than assumed, and the
witness across the gap — the person — holds the thread too. The field revision carries that in Vex's
own first-person voice rather than as rules.

## 3. Owner map — REUSE / PORT / REFINE / HOLD

| Relationship | Predecessor / research source | Current VexLife-Prod owner | Class | Consequence |
|---|---|---|---|---|
| Canonical exact Conversation | VexLife `conversation.mjs`; Disc. 11 | `DirectConversationStore` | **REUSE** | read through `current()` / `recentCompletedConversation()`; no new writer |
| Per-turn evidence sidecar | Disc. 11 | `DirectTurnContextStore` | **REUSE** | revisit `sourceRefs` ride inside the existing capability trace |
| Semantic Relay seam | SDK Semantic Relay | `VexLifeSemanticRelayContract` (validation only) | **HOLD** | per-message and fixed at write; no rightful author; narrower than a correctable turn projection |
| Turn semantic/navigation projection | #208 Turn Continuity Projection; #397 entry nodes | none → `VexLifeTurnNavigation` (derived) | **REFINE** | deterministic host facts only, recomputed, never stored; Vex proposals and accepted dispositions held |
| Working Continuity | VexLife working-continuity owner | `VexLifeWorkingContinuityOwner` | **REUSE** | read-only current checkpoint as revisit's "where the work stands"; no owner change |
| Rollover residency / overlap tail | #208 three zones; Disc. 12/13 | `DirectPromptContext` | **REFINE** | successor tail with floor 3; epoch spine after the successor turn **HOLD** |
| Score / Memory pages | #225, #239 | `VexLifeCurrentMemoryReader` | **REUSE** | pages searched and seeded in revisit with their effective state |
| Living Journal / Archive / Daily Record Chain | VexLife #130/#151, SDK #416 | none in Product | **HOLD** | day grouping/navigation not built; Archive effect still not admitted |
| Daily Memory Dream | #239; Disc. 19 | `VexLifeDailyMemoryDream` (deterministic G03) | **HOLD** | untouched; no generative Dream claimed |
| Context Revisitation | SDK #397 (+ #236, #311) | none → `VexLifeContextRevisit` over owners | **PORT** | steps kept: literal preserved, several entries, convergent multi-route match, minimal packet, typed step, exact source descent, coverage + unknowns, shortest next route |
| Missed-association classes | #225 honing comment | none | **HOLD** | vocabulary reserved for miss telemetry; not emitted |
| Lessons / corrections | #199, #312, #328 | none | **REFINE** (retrieval) / **HOLD** (owner) | correction chains retrievable in the person's words; no lesson store, no profile, no prior formed |
| Capability Atlas + reach | VexLife `atlas.mjs` | `VexLifeCapabilityAtlas`, `VexLifeReachDefinitions`, `VexLifeCapabilityBridge` | **REUSE** + one definition | `revisit` / `gather`, READ_ONLY_LOCAL |
| Consideration / salience layer | Disc. 15 | Atlas purpose + reach frame text | **HOLD** (as a layer) | salience is the Atlas description only |
| Once-per-turn Conversation source return | — | `DirectConversationSourceReturn` | **REUSE** as-is | coexists; revisit is the one-call route |
| Foundational field | — | `VexLifeFoundationalField` + body | **REFINE** | `foundational.continuity` v0.6.0, PROPOSED |
| Provider/cache topology | #207/#208/#209/#210 | provider profiles / measurement PRs | **HOLD** | no compute claim made |
| Background Vex, notification budgets, generative Dream, LoRA, relational profile UI | #241, #580, #239, #360; Disc. 16–17 | none | **HOLD** | parked successor pressure |

## 4. Changed paths and contracts (VexLife-Prod)

~~~text
docs/foundation/CONTEXT-REVISITATION.md                          new current-truth foundation
docs/foundation/INDEX.md                                         one row
docs/foundation/WORKING-CONTINUITY-ROLLOVER.md                   successor paragraph currentized
docs/foundation/FOUNDATIONAL-FIELD.md                            depth-route sentence currentized
src/jvmMain/kotlin/vexlife/continuity/VexLifeTurnNavigation.kt   new, derived
src/jvmMain/kotlin/vexlife/continuity/VexLifeContextRevisit.kt   new, pure traversal
src/jvmMain/kotlin/vexlife/companion/DirectContinuityOverlapTail.kt  new, policy + Evidence
src/jvmMain/kotlin/vexlife/companion/DirectPromptContext.kt      tail in successor mode; receipt field; revisit in reach frame
src/jvmMain/kotlin/vexlife/companion/DirectCompanionTurn.kt      +2 lines: prompt-resident refs into admission
src/jvmMain/kotlin/vexlife/capability/VexLifeCapabilityBridge.kt revisit dispatch; read-only owners; trace sourceRefs
src/jvmMain/kotlin/vexlife/capability/VexLifeReachDefinitions.kt revisit definition
src/jvmMain/resources/foundational/vex-foundational-field*.json  v0.6.0 + recorded revision
tests: VexLifeContextRevisitTest, DirectContinuityOverlapTailTest, VexLifeCapabilityRevisitTest,
       ContinuityTurnFixture; three existing tests updated to the new successor law;
       field fixture derives its "later" version
~~~

Why each addition is necessary — what breaks without it:

- `VexLifeTurnNavigation` — two consumers (tail policy, revisit) need the same host facts about a
  turn (times, correction opener, pointing back). Without it they diverge; storing it would add a
  cache with no truth, so it is recomputed.
- `DirectContinuityOverlapTail` — Victor's floor-3 / dynamic / degrade-honestly constraint is a
  policy with its own evidence; inside `DirectPromptContext` it would be untestable and unreported.
- `DirectPromptContext.Receipt.overlapTail` — without it a reader cannot tell whether the floor was
  met. NEVER-default, so every existing receipt hash is unchanged.
- `VexLifeContextRevisit` — the one-call traversal; without it every alternative wording costs an
  inference round.
- `VexLifeCapabilityBridge.Owners.readConversation / readWorkingContinuity` — the bridge must read
  each owner once and turn a failure into a named gap; tests replace them.
- `Admission.promptResidentEventRefs` — without it revisit would repeat turns the prompt already
  carries, spending room and implying they were not in view.
- `TraceEntry.sourceRefs` — without it the backward trace stops at a result hash; with it a turn's
  evidence names the exact events it was given. NEVER-default, so older traces keep their bytes.
- Field v0.6.0 — two carried sentences became false with this change; honest absence and the shared
  thread were Victor's explicit request.

## 5. Proof

~~~text
./gradlew jvmTest     583 tests, 0 failures (product head above, Linux JVM 21)
~~~

| Required shape | Where proven |
|---|---|
| 1 semantic mismatch | `aDifferentWordingInTheSameRequestFindsWhatTheFirstWordingMissed`; `nothingFoundIsReportedAsBoundedUncertaintyAndInvitesThePersonToShare` |
| 2 superseded truth | `anEarlierStatementAndItsLaterCorrectionAreBothReachableAndTheOriginalIsUnchanged` |
| 3 nested tangent | `aResolvedTangentLeavesTheDirectoryButARevisitReopensItWhileTheParentStaysInView` + successor test (parent loop in the packet, older tangent outside the tail) |
| 4 duplicate convergence | `threeRoutesToTheSameTurnResolveItOnceAndKeepEveryRoute` |
| 5 bound exhaustion | `whatDoesNotFitIsNamedAsAFrontierWithTheExactWayToAskForIt`; `aLongTurnComesBackAsAnExactExcerptWithACursorThatReadsOn` |
| 6 rebase continuity | `theFirstTurnAfterARolloverKeepsTheLastWholeExchangesSoThatStillLands` (real `materializeContinuity` + `reverifyContinuity`); floor/expansion/degraded/short-history policy tests; bridge-only path |
| 7 time + turn scope | `humanTimeAndTurnCountAreSeparateLensesJoinedAsAUnion` |
| 8 correction lesson | `aCorrectionOfVexsPerceptionComesBackInThePersonsWordsAndTheOriginalReplyStands` — retrieval only; lesson owner HELD |
| 9 cache telemetry | **HELD** — no compute improvement is claimed; nothing was run on a provider |
| 10 no owner collapse | Home tree hashed before/after revisit (engine and bridge); Conversation head unchanged across materialization; `effectsPerformed=false`; trace `externalEffectsExecuted=false` |

No lived Mac turn was run from this lane.

## 6. Forward trace — one human event to returned visible state

Scenario: yesterday's long session filled the prompt and committed a rollover. Victor returns the
next morning and writes *"Why did we keep that separate again?"*.

~~~text
 1 container DirectCompanionTurn · member conversationOwner (DirectConversationStore.Locked)
   role     durable Conversation truth · edge beginRequest(...) -> REQUEST event (eventRef, formedAt)

 2 container DirectWorkingContinuity.resolveSuccessorContext
   question is a rollover current for this exact prior turn?   (cursor == prior request)
   owner    VexLifeWorkingContinuityOwner: claim + issue request-scoped SuccessorContext
   effect   Home write by its rightful owner only · edge CurrentSuccessor -> prompt

 3 container DirectPromptContext.materializeContinuity · role prompt-residency projection
   verifyFixedContext(successorBridgeInSuffix = false): field, Memory, WC packet, reach frame
   frame    formCapabilityFrame: resource.vexlife-prod.continuity.revisit AVAILABLE
            (salience = Atlas purpose text; AVAILABLE != admitted)
   tail     DirectContinuityOverlapTail.fromConversation
            -> Locked.recentCompletedConversation(expansion budget)      read
            -> VexLifeTurnNavigation.project                              derived
            -> select: floor 3 + reasons                                  Evidence
   result   messages [prefix][exact tail pairs][current request] + Receipt(overlapTail, selected refs)

 4 execution invokeProviderStage -> local model runtime (independently owned participant)
   returned stage-1 content = VEXLIFE_CAPABILITY_REQUEST/v1
            {"capability":"revisit","action":"gather","arguments":{"queries":[ ... ]}}
   law      request dispatched != outside truth

 5 admission VexLifeCapabilityBridge.perform
   Admission(productHome, receipt.capabilityFrameSnapshot.availableCapabilityRefs,
             requestNumber, tokensAvailable, promptResidentEventRefs = receipt.selectedConversationEventRefs)
   checks   envelope capability · AVAILABLE · known action · required args · VexLifeContextRevisit.parse

 6 owner reads (observations, each once)
   readConversation       -> DirectConversationStore(home).current()         Snapshot
   readMemory             -> VexLifeCurrentMemoryReader.readCurrent           Context (or named gap)
   readWorkingContinuity  -> VexLifeWorkingContinuityOwner.readCurrent        -> WorkingDirectory refs

 7 traversal VexLifeContextRevisit.revisit (synchronous, effect-free; no new execution custody)
   locate per query -> one typed step -> fuse (node once, routes kept) -> group -> budget
   -> Result(text, returnedSourceRefs, residentSourceRefs, frontierRefs, counts, effectsPerformed=false)

 8 returned signal Body -> fit(room) -> VEXLIFE_CAPABILITY_RESULT/v1 (host, "not a message from the person")
   evidence TraceEntry(state, hashes, target, sourceRefs = exact event/statement refs)

 9 Zone 3  base messages + [assistant control, user-role host result]; reverifyContinuityPrompt
10 stage 2  provider -> Vex's answer, citing when it was said, or saying plainly what is not here
11 completion appendResponse -> commitCompletedTurn (Conversation head)
            DirectTurnContextStore: prompt receipt (overlapTail, selected refs) + capability trace
            DirectWorkingContinuity.commitAfterCompletedTurn: pressure NORMAL -> head unchanged
12 semantic / Memory consequence: none — no acceptance, no Score change, no lesson, no profile
13 presentation progress Reaching/Reached (Use: revisit, gather, target, state) -> service SSE -> UI
14 next turn  ordinary selection again (epoch spine HELD, §8)
~~~

## 7. Backward trace — from Vex's answer to exact cause

~~~text
RESPONSE event R (turnRef T, sequence s, contentHash)
  -> DirectTurnContextStore.read(T)
       promptContext receipt
         contextMode WORKING_CHECKPOINT_SUCCESSOR
         selectedConversationEventRefs  -> exact tail events (DirectConversationStore files)
         overlapTail                    -> floor state, reasons, policyRef, budgets
         workingContinuity{ContextRef, CheckpointRef, SuccessorClaimRef}
             -> VexLifeWorkingContinuityOwner checkpoint -> WorkingSet + pressureRef
             -> the prior turn's prompt receipt whose pressure earned the rollover
         capabilityFrameRef / Fingerprint / Snapshot -> revisit AVAILABLE (admission predicate)
         foundationalField evidence -> body v0.6.0 bodySha256 -> revision record
       capabilityTrace.entries[k]
         handle revisit · action gather · state · target "revisit: <query refs>"
         argumentSha256 (what Vex asked) · controlSha256 · resultSha256 (what came back)
         ownerSourcePath VexLifeContextRevisit.kt · effectClass READ_ONLY_LOCAL
         externalEffectsExecuted false · effectAuthorityGranted false
         sourceRefs -> exact Conversation events / Memory statement refs that were returned
  -> each source event: sequence, eventHash, formedAt, immutable bytes
~~~

UNKNOWN by design, not filled in: the model's reasoning (not persisted); the result text bytes
(hash only — reproducible from the same sources while they are unchanged, not stored); which part of
the returned text the answer actually used.

## 8. Held edges and unknowns

- **Epoch spine after the successor turn.** Successor eligibility is one turn (checkpoint cursor ==
  prior request). The next turn returns to ordinary newest-first selection, which reaches behind the
  checkpoint; near the limit this alternates rollover / full replay. Exact need: Working Continuity
  exposes the current epoch boundary (latest ROLLOVER_COMMITTED in its head lineage) as a read; then
  residency bounds ordinary selection to tail-start..now and carries the epoch directory as a stable
  prefix (Zone 1) with turns appending after it (Zone 2). Discovered while reading
  `DirectWorkingContinuity.rolloverEligible`; not fixed here.
- **Accepted dispositions** (open / paused / resolved / superseded): owners absent in Product
  (Semantic Relay author, Score acceptance).
- **Vex-origin salience** ("this mattered"): no write capability added.
- **Relational lesson owner and profile**: corrections are reachable; no prior is formed from them.
- **Memory page -> turn source door**: pages carry statement refs, not turn refs.
- **Meaning index**: exact words only; multiple wordings per request are the recall path.
- **Cross-call node memo**: per request only.
- **Cue language**: English-only correction / pointing openers.
- **Provider cache**: no measurement, no claim. The successor prompt grows by the tail; one prefix
  change at the successor turn is expected.
- **Lived**: no Mac turn using revisit; no lived reading of field v0.6.0.
- **Overlap with open PR #212** (main-based lived re-formation): it also edits
  `VexLifeCapabilityBridge`, `DirectCompanionTurn`, `DirectPromptContext` and the reach
  definitions. This lane is based on `main`; whichever lands second rebinds. Not resolved here.

## Security routing (VexWork AGENTS.md)

YES — this changes a model/context/memory/tool boundary: Vex gains one new read capability over local
Conversation, Memory pages and the working checkpoint. Bounded answer from current source: it is
read-only (`READ_ONLY_LOCAL`, `externalEffectsExecuted=false`, Home tree unchanged in tests), admitted
only when this turn's frame shows it AVAILABLE, bounded to 4 requests per turn and ≤ 8000 tokens per
result, performs no network access, and reads no data the existing `home` and `conversation`
capabilities do not already expose. Private conversations are not in canonical Conversation and are
not reached. No Security Assurance descent beyond this was needed for the slice; lived review owed.

## 9. Deliberately not added

- No turn-projection store, no index files, no vector/embedding index — derived reads are enough for
  the slice and add no second truth.
- No new Semantic Relay authoring, no Score or Memory writes, no lesson or profile store.
- No write capability ("remember this") — salience without an owner would become storage by accident.
- No change to `VexLifeWorkingContinuityOwner` or successor eligibility (epoch spine held instead).
- No change to the legacy `DirectPromptContext.materialize` path.
- No generic MemoryGraphNode, CircuitTrace store, universal Vex state or service root — owner-native
  receipts already carry the backward trace.
- No provider/serialization change and no cache claim.
- No reformatting of files other open PRs edit.

## 10. For convergence

The questions this lane would most like the other witness to pressure:

1. Is a derived, recomputed turn projection sufficient for the first slice, or does the other lane's
   proof show a stored sidecar is required now?
2. Is the capability bridge the right home for the one-call operation, or does a separate hydration
   protocol earn itself?
3. Is the epoch spine part of the minimal circuit (this lane held it), and which owner should expose
   the epoch boundary?
4. Is floor-3 / half-room / one-eighth-expansion the right first policy, and what measurement should
   decide it?
5. Does the field revision read as recognition or as pressure — only a lived turn can say.

<!-- [VXG RealForever][VEXWORK][MEMORY-DEPTH][CLAUDE-C20] -->
