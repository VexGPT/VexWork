# Project Reconciliation foundation

`[VXG RealForever]`

## Human question

How can VexWork answer whether repository/provider/proof evidence for one Project Work item is exact and current, stale and in need of reverification, sufficient to say completion evidence is ready, or genuinely unknown—**without making provider state or proof state canonical WorkState**?

The portable relationship is:

```text
Project + Workgraph truth
        +
Project evidence relation
        +
normalized provider observation
        +
normalized proof observation
        ↓
deterministic reconciliation disposition
```

The accepted predecessor is VexLife ToCompletion P0B-B04 / PR #910. VexWork independently owns the portable evidence-join semantics; it does not require VexLife Orientation or Build Health as universal dependencies.

## Permanent distinctions

```text
PROVIDER_STATE != WORK_STATE
CHECK_SUCCESS != SEMANTIC_PROOF_BY_ITSELF
PROVIDER_TIMESTAMP != CURRENTNESS
PROVIDER_OBSERVATION != SOURCE_AUTHORITY
RECONCILIATION_DISPOSITION != TRANSITION_AUTHORITY
PR_MERGED != WORK_CLOSED
COMPLETION_EVIDENCE_READY != COMPLETED
STALE_PROOF -> REVERIFY_REQUIRED
UNKNOWN != FAILED
```

## Portable evidence types

`src/core/project-reconciliation.mjs` defines three normalized inputs.

### Project evidence relation

Binds one Project Work item to the repository/provider/candidate identity that evidence is expected to describe:

```text
projectRef
workRef
repositoryRef
providerRef
base SHA or null
candidate head/tree or null
source-tree SHA-256 or null
source refs
```

### Provider observation

Carries observed provider facts only:

```text
OPEN | MERGED | CLOSED_UNMERGED | UNKNOWN
base/head/tree
merge commit/tree
current main
merge reachable from main
checksState
observedAt
```

Provider checks remain context. A green provider check does not substitute for semantic proof.

### Proof observation

Normalizes proof without dictating which system produced it:

```text
PASSED | FAILED | UNKNOWN
CURRENT | STALE | UNKNOWN
candidate head/tree/source-tree bindings
observedAt
```

A target repository may derive this observation from its rightful Build Health, QA, local proof, CI, or another accepted proof owner.

## Reconciliation dispositions

`blueprint/project-reconciliation-registry.json` owns:

```text
CURRENT_IN_REVIEW
REVERIFY_REQUIRED
COMPLETION_EVIDENCE_READY
HELD_UNKNOWN
```

### CURRENT_IN_REVIEW

The open provider candidate and current semantic proof match the exact relation.

### REVERIFY_REQUIRED

Known evidence is stale or contradictory, including moved candidate identity, failed/stale proof, closed-unmerged provider state, wrong post-merge tree, or a merge not reachable from current main.

### COMPLETION_EVIDENCE_READY

The exact relation/proof remains current and the provider reports the exact candidate tree merged and reachable from accepted main.

This may yield an explanatory lifecycle proposal **only when** the current WorkState can lawfully transition to `COMPLETED`:

```text
transitionAuthority = NONE
```

The proposal is evidence for the rightful lifecycle owner; reconciliation does not perform the transition.

### HELD_UNKNOWN

A required provider/proof currentness fact is genuinely unknown. Only the dependent conclusion is held.

## Authority boundary

Every reconciliation result is read-only with respect to work and providers:

```text
effects = false
executionAuthority = NONE
transitionAuthority = NONE
```

References to repositories/providers/proofs are evidence routing, not mutation permission.

## Proof

Focused deterministic proof lives in:

```text
test/project-reconciliation.test.mjs
```

It must cover:

- exact open/current evidence;
- provider checks retained as non-authoritative context;
- moved candidate and stale/failed proof;
- exact merged tree + reachable main;
- wrong merge tree / unreachable merge;
- closed-unmerged versus unknown distinction;
- illegal lifecycle proposal suppression;
- foreign Project Work and mismatched evidence-owner rejection;
- stored fingerprint tamper rejection;
- zero Workgraph/provider mutation.

<!-- [VXG RealForever][VEXWORK][FOUNDATION][PROJECT-RECONCILIATION] -->
