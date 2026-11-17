# Claude C20 — clean integration on main + live-earned rollover lineage

`[VXG RealForever]`

This pass follows the live host-proof investigation (VexLife-Prod #226, stacked on #225). #226 is
forensic evidence. It is not a merge candidate. This pass builds the clean candidate from current
main.

| | Ref | Head |
|---|---|---|
| Integration candidate (draft) | VexLife-Prod #241, base = `main` | `d408a84cc2ab6a79874bead461fc74d1bc2eaca9`, tree `b058a82fd9e76ed0ef230eb27f2ed86aebe25a55` |
| Product main | | `d0cba51` (#212, #228) |
| Continuity stack, merged unchanged | #225 (and #214 `9fb8197`, #219 `4713a4c`, #222 `03e6652`) | `501e3fe` |
| Live host proof, forensic | #226 | `dec6a78` |
| Harness | VexWork #310 | `0fc67824` |

## What came from where

```text
main d0cba51
  + merge #225 501e3fe            continuity architecture; every proved head is an ancestor
                                  conflicts resolved toward main's names (#212)
  + 6 cherry-picks from #226      identical patch-ids: lineage in the plan, the effect owner,
                                  the regressions, and the SOURCE_RETURN_THIS_TURN harness correction
  + owner verifies the lineage    not imposed (below)
  + regression 3 in the turn loop
  + live telemetry from the Product's PROVIDER_STAGE_OBSERVED
  + formatting, docs
```

Not carried from #226: the runtime/provider overlays. Main already owns the persistent-runtime
launch contract and the model-specific companion representation / Qwen sampling profiles. Not
added: semantic/embedding search or Memory lesson transfer.

## The hole and the law

```text
ROLLOVER_COMMITTED -> successor -> pressure falls -> NO_CHECKPOINT_REQUIRED
-> cursor not advanced -> next turn not rollover-eligible -> RECENT_COMPLETED_TURNS
-> replay -> rollover again                                   (oscillation, seen live on 4B and 27B)

successor turn -> plan RolloverReady at any pressure (WORKING_ROLLOVER_LINEAGE_ACTIVE)
-> ROLLOVER_COMMITTED at its own request -> next turn enters as a successor again
```

## One correction to the live-earned delta

#226's effect owner re-derived every plan with the lineage whenever the head was a rollover. A turn
enters as a successor only when the head's cursor is its prior request, so after a missed post-turn
commit later turns plan on pressure alone. The imposing owner refuses each of those commits, and
Working Continuity on that thread can never commit again. Two existing Product tests fail at
`dec6a78` for this reason. The owner now re-derives the lineage only where the plan claims it **and**
its own current receipt supports it. Successor behaviour is unchanged.

- `supersedingCurrentCheckpointMakesPriorIssuedSuccessorContextNonCurrent`: a real owner-contract
  failure. It is fixed by the owner change.
- `failedWorkingSuccessorDoesNotBlockFreshRequestScopedSuccessorAttempt`: the recovered successor now
  supersedes its own Context, as it should. The test now reads that Context from the turn's receipt
  and asserts that the lineage advanced.

## Proof

| Regression | Before → after |
|---|---|
| 1. Successor turn is rollover-ready at its own request (`DirectWorkingContinuityTest`) | from #226; passes |
| 2. The owner advances an active lineage under low pressure (`VexLifeWorkingContinuityOwnerTest`) | from #226; passes |
| 3. Every later turn stays a bounded successor (`ContinuityPressureAdapterTest`, engineered profile in the real turn loop) | fails at `ecc5415`; passes |
| A turn that did not enter as a successor still commits after a rollover | fails with #226's owner; passes |

- Repository-owned verification at the head: `jvmTest` passes, 630 tests with 0 failures.
  `checkVexLifeStrings` is current, and the CI script checks and Pages formation pass. The Mac
  packaging step was not run, since it needs macOS.
- Focused projection proof at the head:
  - Engineered profile: rollover at 10, then successors 11–15, with pressure back to WATCH and
    NORMAL.
  - Depth 52k: rollover at 17, then successors 18–30. No oscillation in either; at #225 it was turns
    12/14 and 19…29.
  - Placement and the lane scenario are unchanged.
  - All four results validate against the #310 result schema.

## Held edges

- **meridian-7 is now an honest FAIL.** Its PASS at #225 was resident on a replay turn. Revisit
  matches exact words only, which is the same boundary the live 27B run showed.
- **The candidate was not run live.** The live lineage evidence is #226's.
- **The overlap tail slides each turn,** so a successor's history prefix is not preserved call to
  call. An epoch directory as a stable prefix stays held.

Draft. Not for merge or READY on this alone.

<!-- [VXG RealForever][MEMORY-DEPTH][C20-CLAUDE][ROLLOVER-INTEGRATION] -->
