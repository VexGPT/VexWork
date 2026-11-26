# VexLife longevity questions -> proof map

[VXG RealForever]

## Purpose

This is a consumer-facing map from long-lived human/product questions to the proofs and source owners that already exist.

It is **not** another proof owner and must not duplicate authoritative PASS/FAIL state.

A future instance should use this file to answer:

> If a person lives with VexLife for years, which complaints are already protected by current proof, which are only partially covered, and which still require a new lived/lifetime acceptance test?

Coverage vocabulary:

~~~text
COVERED_DETERMINISTIC
  current source has focused deterministic tests for the failure class

COVERED_LIVED
  source-managed project evidence records a lived/host proof of the human outcome

PARTIAL
  important predicates are proven, but the whole human complaint is not closed

UNPROVEN_LIFETIME
  architecture exists, but year-scale/large-corpus/resource behavior remains explicitly owed

PRODUCT_GAP
  the human behavior/capability itself is not currently owned end to end
~~~

Snapshot basis:

~~~text
VexLife-Prod main observed during formation
8b6f1dd649b44184198d9d5808c77f91f90bd812

VexWork project sources
project.vexlife.memory-depth-exploration
project.vexlife.vexworks
project.vexlife.self-inspection
~~~

Refresh current source before using any status as present-day truth.

## Matrix

| Human longevity question / complaint | Coverage | Existing proof/source | What is still owed |
| --- | --- | --- | --- |
| "Will a long conversation eventually lose the thread when context fills?" | COVERED_DETERMINISTIC for rollover mechanics; PARTIAL for future Working Focus | `VexLifeWorkingContinuityTest.pressureThresholdsPreserveStableRolloverMeaning`; `checkpointPlanIsReferenceOnlyAndDoesNotPromoteMemoryOrModelOutput`; `VexLifeWorkingContinuityOwnerTest.activeRolloverLineageAdvancesCurrentCursorEvenWhenPressureReturnsToNormal`; `DirectContinuityOverlapTailTest.theFirstTurnAfterARolloverKeepsTheLastWholeExchangesSoThatStillLands`; `ContinuityPressureAdapterTest.afterRolloverEveryLaterTurnStaysABoundedSuccessorAsPressureFalls` | Self-Inspection A2/A3 still has to prove that a model-shaped Working Focus survives source release/rollover without becoming Memory. |
| "Can an old/stale retrieval index confidently tell Vex something is absent when it is not?" | COVERED_DETERMINISTIC | `VexLifeContinuitySourceLocatorTest.currentGenerationMissCanSayMissButStaleGenerationMustRequestFallback`; `corruptOrUnsupportedLocatorNeverBecomesNotFound`; `fingerprintBindingChangeRequiresFallbackBeforeItCanBecomeCurrentMiss` | Scale/performance of the chosen long-horizon backend remains separate. |
| "If the locator/index disappears or corrupts, is my real history lost?" | COVERED_DETERMINISTIC | `deletingDerivedLocatorIsRebuildableAndNeverDeletesConversation`; long-horizon law `CACHE LOSS != MEMORY LOSS`, `INDEX != MEMORY` | Five-year rebuild duration/recovery cost is not yet proven. |
| "Will VexLife become slower after years of Conversation/Memory?" | UNPROVEN_LIFETIME | Long-horizon Memory source explicitly defines LH-6 five-year deterministic scale + recovery proof; current hot paths/locator reduce lifetime scans | The project explicitly still owes five-year corpus ordinary-turn cost, recall latency, cold-open/rebuild time, crash recovery, deletion invalidation and measured I/O/latency. Do not claim closure yet. |
| "Will the app rebuild all history every time I use it?" | PARTIAL | Locator append-only catch-up test: `appendOnlyCatchUpKeepsGenerationCurrentWithoutWholeHistoryRebuild`; current Memory hot-path/currentness work; Direct Conversation recent-history traversal is budget bounded | Long-horizon source explicitly notes remaining ordinary Conversation/Score lifetime replay pressure and makes it part of five-year completion. |
| "If Vex changes models, does he become a different Vex or lose Memory/sources?" | COVERED_LIVED in the Model Adaptation project | `project.vexlife.vexworks` A4 records lived continuity recovery and the laws `MODEL SWITCH != VEX SWITCH`, `!= CONVERSATION SWITCH`, `!= MEMORY SWITCH`, `!= ARTIFACT / LOCAL SOURCE REBIND` | Continue re-proving compatibility for materially new provider/body relationships; no new identity system is needed. |
| "Can a correction overwrite the fact that we used to believe something else?" | COVERED_DETERMINISTIC for semantic transition; PARTIAL for deep why traversal | `VexLifeSemanticAcceptanceWriterTest.sameSubjectRequiresExplicitTransitionAndExactCurrentScorePredecessor`; correction/supersession bind exact predecessor statement + acceptance hash; Score lineage preserves prior heads | A convenient bounded traversal from current meaning through several semantic predecessors to all originating Conversation/source evidence is not yet fully closed as one generic lived route. |
| "I deleted/withdrew something — can an old index still surface it?" | PARTIAL / UNPROVEN_LIFETIME | `VexLifeContinuitySourceLocatorTest.lifecycleRebuildOmitsBlockedPairsWithoutDeletingCanonicalConversation`; long-horizon LH-2/LH-6 explicitly require stale/private/superseded/tombstoned source not to leak and deletion/tombstone invalidation | Human history-delete/retention behavior itself is not a fully formed general Product capability; end-to-end deletion + every derived store/cache proof remains owed where that control is introduced. |
| "Why is my disk full after years of use?" | PRODUCT_GAP / UNPROVEN_LIFETIME | Long-horizon source names storage overhead, sharding pressure, rebuild cost, and backup/recovery as measurements; sent-resource work names future retention/space accounting | No whole-Home storage budget/GC/space-accounting acceptance proof currently closes this human complaint. Do not invent automatic deletion. |
| "Can Vex safely edit my code without overwriting somebody else's change?" | COVERED_DETERMINISTIC for current write effect | `VexLifeWorkspaceWriteTest.editRequiresExactPriorDigestAndKeepsPrivateBeforeImage`; stale expected SHA refuses; write is scoped to exact current Local Source generation | Broader coding surfaces (patch/hunk editing, multi-file transaction) require their own contracts if earned. |
| "If Vex crashes during a write, can it blindly replay and damage the file?" | COVERED_DETERMINISTIC | `VexLifeWorkspaceWriteTest.missingReceiptRecoversCompletedIntentWithoutReplayingMutation`; `completedIntentMayRecoverAfterRevocationButNewMutationCannotReplay` | Whole-Home disaster recovery/backup restoration is a larger separate question. |
| "Can I undo a completed edit Vex made?" | PRODUCT_GAP | Write owner keeps private before-image + prior/new digest for recovery | No model-facing `undo/revert` effect exists today. A future inverse effect should bind one exact completed write and require the target still equals the written digest before restoring the prior body. |
| "Can Vex run arbitrary commands on my machine?" | COVERED_DETERMINISTIC as a negative boundary | Java-test definition: no arbitrary executable, shell, package manager, ambient env or network; `VexLifeWorkspaceJavaTestTest.exactSourceCopiesReachOnlyProductSelectedSandboxRunner`; symlink escape/revocation/runtime-drift tests | Additional build/test languages should be separately qualified rather than gained by silently widening into generic shell. |
| "Can Vex test a real project?" | PARTIAL | Current main admits sandboxed Java project tests; compile/test failures return bounded useful receipts; authority is separate from read/write | Java-only bounded execution is not a general Kotlin/Gradle/Node/Python/Android build body. Each future execution family needs its own qualified envelope or an explicitly earned shared process contract. |
| "Why does Vex keep rereading huge files/classes when only one relationship matters?" | PRODUCT_GAP being designed | Local Sources/attachments are bounded and continuable; same-turn source snapshots prevent moving reads; #449 Working Focus + residency design | Working Focus/context-residency is not implemented yet. This is a central Self-Inspection A2/A3 lived proof. |
| "Will a huge attachment permanently bloat Memory/context?" | PARTIAL | Model Adaptation/Local Artifacts source keeps Attachment != Memory; small readable material may be direct context while large/overflow remains behind bounded reach | Need lived scale measurements across very large/many attachments and eventual storage-retention policy; current bounds protect one turn but do not answer whole-Home disk longevity. |
| "Can Vex tell me what is using context/cache and why it is slow?" | PARTIAL | Vex Context exposes component placement plus provider-stage prompt/cached/prefill/latency evidence; prompt-cache controls exist | #449 Self-Inspection A3/A4 still needs a coherent body-level residency explanation and Working Focus projection. |
| "Can capability growth turn into one giant unsafe agent permission?" | PARTIAL but strong architecture | Capability Atlas frame != authority; separate Workspace Effects, Checks and Runs grants; owner checks at request time; effect capabilities remain separately typed | Long-lived human comprehensibility of dozens/hundreds of capabilities has not been pressure-tested. Future expansion should qualify capabilities/owners rather than bypass grants with generic shell. |
| "If a grant/source path is removed and re-added, can stale authority come back?" | COVERED_DETERMINISTIC | Workspace Effect/Check/Run stores bind grants to exact Local Source generation; current grants require matching `sourceGrantedAt` | Human UX around why a grant became non-current may still need clearer explanation. |
| "Can Vex recover exact old words instead of trusting a summary?" | COVERED_DETERMINISTIC for exact reopen; PARTIAL for phrase-independent lifetime recall | `DirectConversationStoreTest.exactConversationReturnResolvesOnlyCurrentCommittedSourceAddresses`; Conversation source return; Context Revisit; Locator exact canonical reopen | Paraphrase/semantic candidate retrieval and five-year coverage are explicitly later Long-Horizon edges; source verification must remain final. |
| "Can old private/deleted/superseded material leak because a derived cache still has it?" | PARTIAL | Locator lifecycle binding/rebuild tests; long-horizon security membrane explicitly requires propagation and rebuildable deletion | Requires end-to-end proof for every future derived store/cache and any explicit deletion control. |
| "Can I move/restore Vex Home to another machine years later?" | PRODUCT_GAP / PARTIAL | Platform realization separates construction from semantics; Mac/Windows target work exists; canonical truth is file/source addressed | Whole-Home export/import/migration/backup-restore acceptance is not closed by the proofs above. This should not be inferred from platform portability alone. |

## What this tells us

The existing proof estate is **not weak**. It is mostly organized by the rightful subsystem rather than by the human lifetime question.

The next useful proof work should be chosen only where this map says the complaint is not already closed.

### Strongly covered now

~~~text
rollover/currentness mechanics
stale locator cannot lie
derived locator can be rebuilt without deleting Conversation
model switch preserves larger Vex continuity
semantic correction/supersession requires exact predecessor
guarded writes do not stale-overwrite
write recovery happens before replay
sandboxed Java test cannot become generic shell by accident
workspace grants are generation-bound
exact Conversation source can be reopened
~~~

### Real lifetime proof still owed

~~~text
five-year ordinary-turn + recall latency
cold-start/rebuild cost at scale
derived-store deletion/tombstone leakage under scale
storage/disk growth and retention behavior
large/many attachment storage pressure
whole-Home migration/backup/restore
capability-catalog human comprehensibility at large scale
~~~

### Product behaviors not yet owned

~~~text
Working Focus / context residency
model-facing exact revert/undo
general human history deletion/retention semantics
whole-Home storage management
broader qualified coding/build/test envelopes
complete generic semantic-why ancestry traversal
~~~

## How to use this map

Before adding a new proof:

~~~text
human complaint
-> find row here
-> descend to the rightful current owner/proof
-> determine whether the complaint is already closed
-> if partial, test only the missing predicate
-> if lifetime-unproven, extend the existing pressure harness or owner proof
-> if PRODUCT_GAP, form the behavior/owner before writing a test for an imaginary capability
~~~

Permanent:

~~~text
HUMAN LONGEVITY QUESTION
!= NEW SUBSYSTEM

PROOF MAP
!= PROOF OWNER

MISSING LIVED PROOF
!= MISSING ARCHITECTURE

CURRENT DETERMINISTIC PASS
!= FIVE-YEAR PRODUCT PASS
~~~

<!-- [VXG RealForever][VEXLIFE][LONGEVITY][PROOF-MAP][SELF-INSPECTION] -->
