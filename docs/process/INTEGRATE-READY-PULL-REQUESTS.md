# Integrate Ready Pull Requests

[VXG RealForever]

Intended process ref: process.vexwork.integrate-ready-pull-requests

Registration state: SOURCE_PLACED_NOT_REGISTERED

Reason registration is held: open VexWork PR #103 currently owns the shared Process Registry source surface.

## Purpose

Carry a repository-scoped queue of already-proven pull requests through one vigilant, serialized integration session without making ordinary source lanes chase a moving main.

## Entry

Use this process when at least one exact PR has reached READY_FOR_INTEGRATION and the repository has an authorized Integration Steward occupancy.

A source lane hands off by preserving the exact candidate identity and accepted evidence, not by rebasing merely to follow current main:

```text
READY_FOR_INTEGRATION
providerPullRequestRef=<PR>
candidateHead=<exact head>
candidateTree=<exact tree>
fixedEvidenceBase=<evidence anchor>
acceptedEvidenceRefs=[...]
mainMovementDisposition=COORDINATION_CONTEXT_ONLY
```

The Integration Steward, not the source lane, owns the fresh current-main binding for the merge turn.

A lane that itself becomes ready may take the Steward role when no compatible Steward is active, but it inherits the existing queue and may not skip higher-priority admissible entries merely to merge its own PR.

## Queue turn

~~~text
read current queue
-> apply dependency + explicit priority
-> select highest-priority admissible entry
-> re-ground PR head/tree + accepted proof/review evidence
-> re-ground current main
-> perform current-main composition/conflict proof
-> conflict?
     hold entry; no main mutation
     continue another independent entry if safe
-> pass?
     bind exact merge duty
     perform one ordinary expected-head merge
     post-merge verify exact commit/parents/tree/reachability
-> re-ground main
-> recompute queue
-> repeat
~~~

## What the Steward may reuse

If candidate head/tree and fixed evidence-base relation remain intact, exact candidate/source proof survives unrelated movement of main.

Only integration-currentness/composition evidence is refreshed per queue turn.

## What the Steward must still know

The Steward does not need to rediscover the product implementation of every already-cleared candidate.

It must know enough to verify:

- exact candidate identity;
- accepted proof/review evidence refs;
- dependencies and priority source;
- exact current-main identity;
- target-repository merge method/rules;
- composition/conflict evidence;
- expected merge result;
- available merge authority;
- post-merge verification result.

## Stop / hold

Stop or hold the affected entry when:

- candidate identity moved;
- required proof/review is stale or missing;
- dependency is not integrated;
- composition conflicts;
- provider mergeability/currentness is unknown;
- merge authority is absent;
- protected human decision is required.

A conflict in one entry does not automatically block another independent, higher-or-lower queue entry whose dependencies remain satisfied.

## Completion

The Steward session is complete when the queue is drained or no admissible entry remains.

No permanent Steward identity is required.

<!-- [VXG RealForever][VEXWORK][PROCESS][INTEGRATE-READY-PULL-REQUESTS] -->
