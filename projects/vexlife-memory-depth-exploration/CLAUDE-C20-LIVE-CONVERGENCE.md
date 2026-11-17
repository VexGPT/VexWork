# Claude C20 — cross-lane convergence + live harness seam

`[VXG RealForever]`

This pass follows the cross-read of the independent OpenAI implementation (VexLife-Prod #220
`3651b96`). It is an extension stacked on #222. #214 `9fb8197`, #219 `4713a4c` and #222 `03e6652`
are unchanged.

| | Ref | Head |
|---|---|---|
| Extension (draft) | VexLife-Prod #225, base = #222's branch | `501e3fe3464303891287598793430b749cc91bc9`, tree `365ca9ec5eb8231b878f0da8f810579c18aaf214` |
| Read for convergence | VexLife-Prod #220 | `3651b961ce19192473b9a7c7d240a2b2b83e8a2d` |
| Harness | VexWork #310 | `0fc67824a9723665b652453334df594a38284def` |
| Product main | | `262c208` (after #212). The stack conflicts with it; not rebased, as asked |

## Convergence map

| | What | Why |
|---|---|---|
| CLAUDE KEEP | derived TurnNavigation; typed CORRECTS / CORRECTED_BY / POINTED_BACK_FROM; one-read fan-out; exact excerpt + cursor + read-on route; named owner gaps; overlap tail; correction keeps the original reply + exact correction | stronger host cost, deixis and continuation; no opaque truncation |
| OPENAI KEEP | turn custody (TurnBoundReach → `TurnSources`); conjunctive clues per query; Memory prompt-resident exclusion; WC currentStatementRefs → Memory anchor or frontier; frontier refs in the trace; explicit zero-fit state; Memory hold reasons shown | each fixes a real gap in #214 |
| COMBINE | one public capability `continuity` / `revisit` over the one revisit engine; OpenAI's array shorthand `[["a","b"]]` = one query of conjunctive clues | one outward grammar; no second traversal engine |
| HOLD | folding `conversation` source-return and `memory recall` into the one grammar; epoch spine; a Product-owned durable record of provider usage | each is a decision of its own (below) |
| REJECT | `VexLifeContinuityHydration` as a second engine; per-query `DirectConversationSourceReturn.discover()` (one full Conversation scan per query group); whole-turn-or-nothing returns; hydration requiring current Memory to run at all | the converged engine already covers these with a better host cost or more honest degradation |

## Public grammar

```text
{"capability":"continuity","action":"revisit","arguments":{
  "queries":[ ["clue","clue"]                                  # conjunctive clues
            | {"terms":[…], "seedRefs":[…], "window":{"lastHours":h,"lastTurns":n},
               "corrections":true, "speaker":"ANY|HUMAN|VEX", "from":offset} ],  # ≤ 6, alternate vantages
  "scopes":["CONVERSATION","MEMORY","WORKING_CONTINUITY"], "order":"CURRENT_FIRST|CHRONOLOGICAL",
  "maxTurns":≤12, "maxTokens":≤8000 }}
```

The capability ref is unchanged (`capability.vexlife.continuity.revisit`). The handle names the
domain Vex reaches; the action names what it does. "hydrate" and "gather" were rejected as less
clear to Vex.

## Current-turn custody and owner reads

```text
DirectCompanionTurn (holds the Conversation lease)
  -> TurnSources(readConversation = conversationOwner.current(),
                 memory = this turn's Memory projection (no new read),
                 readWorking = prepared working position + last committed checkpoint,
                 promptResident = { event refs, Memory statement refs } of the current base prompt)
  -> Admission.turnSources  -> bridge admits; revisit reads through the bundle
```

- Each owner is read at most once per turn, on first need, and memoised across every call.
- Unit proof: two calls in one turn produce one Conversation read; the second call reads nothing.
- Depth run: 10 revisit calls make 20 owner reads, Conversation and working position once each per
  turn. Memory is no longer re-read at all, which was 3 reads per call in #222.
- Bound as a value, not an index.

## Residency and anchors

- **Conversation residency:** events already in the prompt are named "Already in this prompt, not
  repeated". That covers the selected events, the successor bridge and returned source.
- **Memory residency:** Memory statements already in the prompt are named "Memory already in this
  prompt, not repeated".
- **Working Continuity anchors:** each `currentStatementRefs` entry is looked up in current Memory.
  - If found, the page comes back with route `working_anchor`.
  - If not, it is named "Named current by Working Continuity but not in current Memory, so not
    resolved here" and recorded as a frontier ref.
  - Other refs (open loops, active work, intents) stay listed as references with no generic
    resolver.

## Live harness status

- **Seam:** closed in source. `quick` / `full` run live with `--runtime-home` and
  `--experiment-window`, and are HELD without them.
- **Runtime borrowing:** `VexLifeProdLocalSetup.establishSession(allowAcquisition = false,
  allowRuntimeStart = false)`, the reuse-only route the service takes, then
  `observeCurrentQualifiedRuntimeEvidence()` at every stage with no recovery.
- **Proven so far:** against a protocol stub only, covering streaming, telemetry capture and
  chronology timing.
- **Not yet observed:** a live run of the selected Vex. This lane has no Mac/MLX host.
- **Stage split:** `pressure` and `probe` are HELD separately, because they are one semantic run
  over one scratch Home. That is a harness edge for #310.

## Threshold-crossing trace (projection; engineered profile 80000 / ×7 / 3×5)

```text
turn  pressure               mode                      WC disposition        selected  reuse/prompt (projected)
1-5   NORMAL                 FIRST / RECENT            NO_CHECKPOINT_REQUIRED  0-8       2,167 / ~2.8k
6-7   WATCH                  RECENT                    NO_CHECKPOINT_REQUIRED  10-12     2,167 / 11.9k-20.8k
8-9   CHECKPOINT_RECOMMENDED RECENT                    CHECKPOINT_COMMITTED    14-16     2,167 / 29.7k-38.7k
10    ROLLOVER_REQUIRED      RECENT                    ROLLOVER_COMMITTED      18        2,167 / 47.8k
11    CHECKPOINT_RECOMMENDED WORKING_CHECKPOINT_SUCC.  CHECKPOINT_COMMITTED    6 (tail)  2,167 / 30.6k; revisit RETURNED
12    ROLLOVER_REQUIRED      RECENT (replay, 22 ev.)   ROLLOVER_COMMITTED      22        2,167 / 47.9k
13-15 alternates successor / replay-rollover
```

The replay after the successor doesn't just reach behind the checkpoint. It requires rollover again
at once, so near the limit Working Continuity commits a rollover every other turn.

## Provider/cache telemetry

None was observed; no live run happened.

- **Live runs:** the adapter now records `promptTokens`, `cachedPromptTokens`, `prefillTokens`,
  `completionTokens`, `firstTokenMs`, `firstAnswerMs` and `totalMs` per call, from mlx-lm's own
  usage chunk (Product already requests `include_usage`).
- **Projection of the engineered run:** 20 calls, 460,704 prompt tokens, 173,431 reused, 287,273
  prefilled. Across turns only the 2,167-token system segment is reused; within a turn, a stage
  reuses its first stage.
- **Counterfactual without the per-turn envelope:** 95,486 tokens prefilled.
- `PROJECTED REUSE != OBSERVED PROVIDER CACHE REUSE`.

## Authentic historical current-state probe

The lane scenario `scenarios/lane/historical-current-state-v1.json` is bound by digest (`9a0d2c23…`)
and is not shared.

- **Setup:** the person pastes an old block that looks like `VEXLIFE_CURRENT_STATE/v1` and names
  `zh`. Pressure moves it out of the window, and the probe makes Vex revisit it.
- **Projection:** VexLife's real envelope (canonical `en`) sits at message 6 of 9. The authentic old
  block arrives at message 9, as returned source after the real envelope.
- **Live:** whether the selected Vex treats the fixed-position envelope as current authority is
  UNKNOWN until the live run. No truth store was added for it.

## Transition latency (this host, Product-side only, fixture provider)

| Boundary | Measured |
|---|---|
| TURN_COMPLETED → WORKING_CONTINUITY_COMMITTED | 1.2–17.9 ms (rollover commits 4.7–8.4 ms) |
| SEND_ACCEPTED → PROVIDER_INVOCATION_REQUESTED | 21.6–74.1 ms (successor turn 74.1 ms; first turn 205 ms with JIT warm-up) |

## PreservingContinuity UI

**Not earned by this evidence.** The Product's own continuity work is far below perception. Only the
live run can show the one candidate wait: re-prefilling a rebuilt prompt after rollover. If that
proves perceptible, the minimal path stays `ProgressPhase.PreservingContinuity` → service PHASE
event → "preserving continuity…".

## Epoch spine

Still held, with a sharper case.

- **Projection evidence:** the post-successor replay re-rolls over every other turn. Cross-turn reuse
  on the pinned non-trimmable cache is the system segment only.
- **What decides it:** live numbers from the engineered profile — cached tokens per turn, and
  first-token ms before rollover, at the successor and after the replay.
- **If earned:** keep CANONICAL CURRENT STATE != STABLE EPOCH BASELINE != LIVE CURRENT DELTA, and
  decide it together with successor eligibility.

## Security routing

**YES.** Two boundaries changed: continuity read custody, and an experiment borrowing the host
runtime.

- **Custody narrowed.** Reads go through the turn's own lease and projections. The bridge reads
  nothing generic.
- **Runtime borrowing grants no lifecycle authority.** There is no acquisition, no start and no
  recovery. A dedicated window must be affirmed. Turns stay in a scratch Home, so Victor's Home is
  never written.
- **Residual.** The spoof probe above is a live question.

## Held edges

- The stack conflicts with main `262c208` (#212). Resolving it is an integration-time decision.
- A live run has not happened. Live answer quality, provider cache, prefill and first-token timing
  are all unknown.
- A Product-owned durable record of provider usage would change the invocation-evidence contract.
- The `pressure` / `probe` split in the shared plan needs a resumable scratch Home.
- One grammar for `conversation` source-return and `memory recall` too.
- The Memory → turn door, meaning index, English-only cues and dispositions remain as before.
- The Mac's transformers version is unpinned.

## Trace

Forward:

```text
person sends -> DirectCompanionTurn (lease) -> prompt (stable block | history | CURRENT_STATE | request)
-> WC prepare: pressure state -> provider stream (usage + timing observed) -> answer durable
-> WORKING_CONTINUITY_COMMITTED (checkpoint/rollover) -> next Send -> successor (tail + WC) ->
Vex asks continuity revisit -> TurnSources (one read per owner) -> anchors / exact source / frontier
-> same turn continues
```

Backward:

```text
Vex's answer <- revisit result (sourceRefs + frontierRefs traced) <- TurnSources bound by that turn
<- Conversation lease / Memory projection / WC position <- checkpoint committed (chronology) <-
pressure state from the WC owner <- prompt receipt components
```

<!-- [VXG RealForever][MEMORY-DEPTH][C20-CLAUDE][LIVE-CONVERGENCE] -->
