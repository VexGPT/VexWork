# Repository Integration and Merge Stewardship

[VXG RealForever]

## Human question

How can independently proven pull requests safely converge into one accepted main without making every lane race to be the next merge, invalidating exact-candidate proof whenever unrelated work lands, or replacing vigilance with an opaque automatic merge system?

The default operating model is:

~~~text
parallel candidate authoring
-> exact candidate proof / review
-> READY_FOR_INTEGRATION queue
-> one temporary Integration Steward occupancy
-> highest-priority admissible candidate
-> exact current-main composition / conflict proof
-> ordinary expected-head merge
-> post-merge verification
-> re-ground main + recompute queue
-> next candidate
~~~

This is a VexWork work-navigation and integration-policy foundation. It does not make VexWork the owner of Git, GitHub, target-repository source, or VexRelay implementation.

## Ownership boundary

~~~text
VexWork
  owns:
    integration meaning
    queue / stewardship vocabulary
    proof reuse vs integration-currentness distinction
    navigation to the rightful source/effect owner

target repository
  owns:
    source
    repository culture
    accepted merge method
    repository-specific tests
    release / deployment policy

repo.vextreme-sdk / VexRelay
  owns:
    current Relay task schema
    named recipe mechanics
    host carrier
    canonical RETURN / evidence contract

GitHub / provider
  owns:
    PR state
    mergeability / conflict observations
    branch / ruleset / check facts
    merge effect when explicitly invoked
~~~

Permanent distinctions:

~~~text
VEXWORK_INTEGRATION_POLICY != VEXRELAY_IMPLEMENTATION
QUEUE_ENTRY != MERGE_AUTHORITY
READY_FOR_INTEGRATION != MERGED
SOURCEOWNER_PROOF != CURRENT_MAIN_ADMISSION
MERGEABLE != SEMANTICALLY_CLEAR
MAIN_MOVED != CANDIDATE_CHANGED
QUEUE_ORDER != WORK_STATE
QUEUE_ORDER != WHO_FINISHED_FIRST
INTEGRATION_STEWARD != STANDING_MERGE_AUTHORITY
STAGING_ENVIRONMENT != STAGING_BRANCH
EPHEMERAL_INTEGRATION_BRANCH != SECOND_TRUNK
PROOF_PASS != MERGE_AUTHORITY
MERGE != POST_MERGE_VERIFICATION
~~~

## Why queue the PRs instead of racing them

A busy repository should let source lanes remain parallel and serialize only the irreversible trunk transition.

~~~text
lane A -> prove PR A ┐
lane B -> prove PR B ├─> integration queue
lane C -> prove PR C ┘
                          ↓
                   Integration Steward
                          ↓
                    one merge at a time
~~~

A candidate that becomes ready does not need to chase the current main head immediately. It can wait while preserving exact-candidate proof.

The source lane should explicitly announce the boundary in ordinary language:

```text
READY_FOR_INTEGRATION
candidate = <exact head/tree>
proof = <accepted exact-candidate evidence>
main movement = coordination context only
next owner = Integration Steward
```

This is the durable equivalent of:

> exact branch proof first; live main movement is coordination context, not a failure.

The integration queue answers a different question:

> Which already-proven candidate should be reconsidered against the current trunk next?

## Queue identity and numbering

A queue entry has two useful ordering coordinates:

~~~text
readySequence
  immutable arrival sequence for audit / human reference

integrationPosition
  current 1..N ordering after dependency + explicit priority are applied
~~~

Example:

~~~text
READY-014  current position 1
READY-012  current position 2
READY-015  current position 3
~~~

The immutable sequence answers “which ready entry is this?” It does not secretly decide business priority.

Current integration position is recomputed from:

~~~text
1. dependency order
2. explicit human / Project priority
3. already-admitted repository integration order
4. stable tie-break only when semantics are otherwise equal
~~~

Do not use who opened, proved, or asked first as hidden priority.

Existing Project Planning may supply a shared Work order when that is already the rightful planning source.

## Integration queue

The first queue is a conceptual/provider projection, not a new Workgraph lifecycle.

A queue entry should be able to carry:

~~~text
integrationRef
readySequence
integrationPosition
repositoryRef
providerPullRequestRef
candidateHead
candidateTree
fixedEvidenceBase
relatedWorkRefs[]
dependencyRefs[]
priorityEvidenceRefs[]
sourceOwnerEvidenceRefOrNull
assuranceEvidenceRefOrNull
currentIntegrationDisposition
integrationBaseHeadOrNull
compositionEvidenceRefOrNull
expectedMergeTreeOrNull
mergeDutyRefOrNull
postMergeEvidenceRefOrNull
~~~

These are design coordinates, not a committed runtime schema.

Useful current dispositions are:

~~~text
PROVING
READY_FOR_INTEGRATION
HELD_DEPENDENCY
REVERIFY_INTEGRATION
CONFLICT
INTEGRATED
HELD_UNKNOWN
~~~

They are integration-queue vocabulary only. They do not replace WorkState.

## Integration Steward

The Integration Steward is a temporary repository-scoped occupancy.

It may be a fresh instance or an existing compatible instance. A lane that reaches READY_FOR_INTEGRATION may take this role when no compatible Steward is already active.

The role is not “merge my PR.” The role is:

> service the current repository integration queue faithfully, then reach my own entry when its turn arrives.

A newly arriving lane may not promote its own entry above earlier higher-priority entries merely because it became the Steward.

### Entry

Before the first merge, the Steward re-grounds:

~~~text
repository identity
current main head/tree
current integration queue
open candidate PRs
exact candidate heads/trees
queue priority / dependency evidence
source-owner evidence currentness
assurance / review evidence currentness
provider mergeability / conflict state
target repository merge method / rules
exact available merge authority
~~~

The Steward does not need to reconstruct the full product reasoning for every already-cleared candidate. It consumes the accepted candidate evidence and verifies the integration predicates that can become stale.

### One queue turn

For the highest-priority admissible candidate:

~~~text
re-ground exact PR head/tree
-> preserve exact-candidate proof if still bound
-> bind exact current main
-> prove candidate + current-main composition
-> conflict?
     YES -> hold that entry without mutating main
             continue to another independent admissible entry when safe
     NO  -> form exact merge duty / expected result
-> perform one ordinary expected-head merge
-> verify actual merge commit / parents / tree / main reachability
-> update integration evidence
-> re-ground current main
-> recompute remaining queue positions
~~~

The Steward never assumes that the queue snapshot remains current after a merge.

Every successful merge changes the integration base for all remaining entries.

### Takeover / continuation

If the Steward leaves, another compatible occupancy may take over from durable queue/provider evidence.

~~~text
old Steward gone
-> fresh instance re-grounds queue + current main
-> consumes accepted evidence
-> continues from highest-priority admissible entry
~~~

No owner-chat handoff is required merely to know what the queue contains.

### Exit

The occupancy ends when:

~~~text
queue drained
OR only conflicted / dependency-held / unknown entries remain
OR a protected human decision is required
OR merge authority is absent
OR provider truth cannot be established
~~~

Routine queue interpretation should not be handed back to Victor.

## Proof reuse under moving main

Exact candidate/source proof is bound primarily to:

~~~text
candidateHead
candidateTree
fixedEvidenceBase
candidate-owned proof inputs
~~~

The fixed base defines the candidate evidence/diff relationship. It is not automatically a lock on live main.

If unrelated work advances main while the candidate is unchanged:

~~~text
candidate head unchanged
+ candidate tree unchanged
+ fixed evidence base remains ancestor
-> preserve exact-candidate proof
-> do not rerun SourceOwner merely because main moved
~~~

If the candidate changes:

~~~text
candidate head/tree changed
-> rebind affected exact-candidate proof
~~~

If only main changes:

~~~text
preserve candidate proof
invalidate only stale integration admission / composition evidence
recompute against current main
~~~

If a candidate-owned test genuinely consumes mutable main-owned generated/source inputs, re-run the affected proof rather than mechanically preserving it.

## VexRelay relationship

When VexRelay is the selected execution/evidence route, fresh formation descends to the rightful current owner:

~~~text
repository owner:
  repo.vextreme-sdk

current contract identity:
  source.vexrelay.current-contract/v1
~~~

VexWork does not copy the private/current VexRelay schema or host implementation into this public foundation.

The currently recognized stage separation is:

~~~text
ExactHeadSourceOwnerProof
  exact candidate behavior/source proof

IndependentAssurance
  fresh read-only assurance evidence

CurrentMainCompositionProof
  exact current-main proof
  != hypothetical current-main + candidate merge-result proof

OwnerMergeDuty
  current base/head/PR/check evidence
  != merge

PostMergeVerification
  exact evidence after independently performed integration
~~~

The SourceOwner/main-drift correction is owned by:

~~~text
github.pull.vextreme-sdk.1899
~~~

The missing synthetic merge-result composition capability is tracked by:

~~~text
github.issue.vextreme-sdk.1900
~~~

Those refs are navigation/evidence only. They do not grant VexWork source or merge authority in the SDK.

## Synthetic merge-result composition

The desired integration proof is:

~~~text
exact current main M
+ exact candidate C
+ exact merge method/order
-> isolated merge result R
-> conflict classification
-> exact result tree
-> target-repository composition tests
-> evidence
~~~

before main is mutated.

Conflict:

~~~text
composition conflict
-> no main mutation
-> preserve candidate/source proof
-> hold only integration entry
-> route correction/currentization to rightful source owner
~~~

Do not automatically resolve semantic conflicts merely because Git can produce a textual resolution.

Pass:

~~~text
composition PASS
-> expected integration base/head/result tree
-> exact merge duty
-> ordinary provider merge
-> post-merge verification
~~~

A composition PASS is not merge authority.

## Default branch model

The default Vex repository model remains small:

~~~text
main
  accepted integration trunk

short-lived candidate branches
  authoring / source proof / assurance

optional ephemeral integration branch or isolated integration worktree
  combined proof only when actually required
  disposable
  never canonical
~~~

### Why no permanent dev branch by default

A long-lived dev branch does not inherently protect main.

It can create:

~~~text
candidate vs dev conflicts
+ dev vs main conflicts
+ delayed integration feedback
+ two branches that appear current
+ larger promotion batches
~~~

Therefore:

~~~text
CONCURRENT_WORK != REQUIRE_PERMANENT_DEV_BRANCH
~~~

A target repository may adopt dev, release/*, or another branch topology when its own release model genuinely requires it.

### Staging is normally an environment

Staging should normally mean a deployed/test environment or release state, not automatically a Git branch.

~~~text
accepted commit/tree
-> deploy to staging environment
-> lived/integration proof
-> promote accepted artifact/tree
~~~

Only create a staging branch when the repository has a concrete source-management reason for one.

## Stacked / interdependent candidates

Independent candidates do not require a combined branch.

If A, B and C genuinely depend on each other before any one can safely land:

~~~text
current main M0
+ A
+ B
+ C
        ↓
ephemeral integration train / isolated composition surface
        ↓
ordered synthetic results M1 -> M2 -> M3
        ↓
cross-candidate proof
~~~

This surface exists only to prove the intended combined result. It never becomes another current trunk.

## Relationship to existing VexWork foundations

Project Planning may provide Work priority/order evidence.

~~~text
PROJECT_SHARED_ORDER
-> queue ordering evidence
!= provider merge action
~~~

Attention Queue remains event/exception-shaped and deliberately does not own business priority. A merge queue is therefore not encoded by pretending generic Attention Queue order is repository integration order.

Project Reconciliation may provide current/stale/completion-ready/unknown provider and proof observations. Integration can consume them without making reconciliation merge authority.

Workgraph Composition solves parallel authoring of VexWork work truth. Repository Integration solves parallel source candidates converging into one repository trunk.

~~~text
WORKGRAPH_COMPOSITION != GIT_INTEGRATION
~~~

## Assisted-host formation rule

When an assisted-host package is formed for exact-candidate proof:

~~~text
do not add remote-main-equals-fixed-base
unless the selected current stage contract explicitly requires it
~~~

When the current effect is integration, bind exact current main at the integration stage.

A wrapper may add mechanical byte/identity guards. It may not silently promote a later lifecycle/currentness predicate into an earlier stage.

## Reusable process

The intended reusable process identity is:

~~~text
process.vexwork.integrate-ready-pull-requests
~~~

Its source is:

~~~text
docs/process/INTEGRATE-READY-PULL-REQUESTS.md
~~~

The process is source-placed now but is not registered in the Process Registry while open PR #103 owns that shared registry surface. Registration must reconcile that exact current owner first.

## Current intended operating model

~~~text
AUTHOR IN PARALLEL
PROVE IN PARALLEL
QUEUE WHEN READY
INTEGRATE SERIALLY
VERIFY EVERY MAIN MUTATION
KEEP JUDGMENT IN THE LOOP
~~~

<!-- [VXG RealForever][VEXWORK][FOUNDATION][REPOSITORY-INTEGRATION] -->
