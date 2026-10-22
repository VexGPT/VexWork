# Promote a Derived Concern into Work

`[VXG RealForever]`

## Human question

> One exact entity currently needs attention. Does that concern deserve a new canonical Work item, is it already represented by existing Work, should it wait, or should it be rejected?

This process is the explicit boundary between read-only Derived Attention and canonical Workgraph lifecycle truth.

```text
current Population + Work Lens + Evidence
-> Derived Attention Projection
-> select one entity + one reason facet
-> review existing Work
-> read-only promotion proposal
-> explicit approve / hold / reject decision
-> create exactly one Work OR confirm one existing Work OR no graph change
```

Permanent:

```text
DERIVED_CONCERN != WORK
ATTENTION != ADMISSION
PROMOTION_PROPOSAL != AUTHORITY
APPROVAL != PROVIDER_PUBLICATION
EXISTING_WORK_REVIEW != AUTOMATIC_DUPLICATION
SCOPE_OR_COUNT != BULK_WORK
```

## Why this process exists

Derived Attention is intentionally cheap and population-shaped. A repository may expose hundreds or thousands of entities and many current concerns. Workgraph is intentionally durable and lifecycle-shaped.

Turning every unsatisfied predicate into Work would recreate the source database as tickets, create duplicate tasks, and make transient provider observations look like lifecycle commitments. Refusing all promotion would leave real concerns unable to become owned work.

The promotion contract therefore admits **one exact concern at a time** and keeps proposal, decision, Workgraph mutation representation, and provider publication separate.

## Source contract

`src/core/derived-work-promotion.mjs` owns three versioned artifacts:

```text
vexwork.derived-work-promotion-proposal/v1
vexwork.derived-work-promotion-decision/v1
vexwork.derived-work-promotion-result/v1
```

The reusable process identity is:

```text
process.vexwork.promote-derived-concern
```

### Proposal

`createDerivedWorkPromotionProposal()` binds:

```text
one exact current Workgraph fingerprint
one exact Derived Attention Projection fingerprint
one stable concernRef
one entityRef
one Evidence identity / fingerprint / observation time
one Derived Attention fingerprint
one reasonFacetRef + predicateRef
one evidence state: UNSATISFIED or UNKNOWN
one action: CREATE_NEW_WORK or CONFIRM_EXISTING_WORK
all current existingWorkRefs and their duplicate review
one candidate Work item OR one selected existing Work item
proposer / source refs / rationale / formation time
```

The proposal is read-only:

```text
effects = false
executionAuthority = NONE
```

`NOT_APPLICABLE` is not promotable. Satisfied predicates do not appear as reason facets. A count, scope summary, or population cannot be promoted by this contract.

### Existing Work review

Every current `existingWorkRef` on the entity must be reviewed against the exact concern.

For a new Work item:

```text
no existing refs
-> duplicateDisposition = NO_EXISTING_WORK_REFERENCES

existing refs present but none represent this exact concern
-> reviewedWorkRefs exactly cover every existing ref
-> duplicateDisposition = EXISTING_WORK_REVIEWED_NOT_SAME_CONCERN
-> distinctionOrNull explains why a new Work item is not a duplicate
```

For an existing Work item:

```text
selectedExistingWorkRefOrNull is one current entity existingWorkRef
-> duplicateDisposition = EXACT_EXISTING_WORK_SELECTED
-> no candidate Work item
```

The selected/reviewed Work must exist in the exact current Workgraph. A stale or externally claimed ref is not enough.

### Candidate Work

A new candidate must already satisfy the canonical `vexwork.work-item/v1` contract and must be one bounded `POTENTIAL`, `TASK`, or `DEFECT`. It cannot begin as active execution or completed history.

Accepted initial states are:

```text
CAPTURED
NEEDS_CLARIFICATION
DECOMPOSED
PLAN_VALIDATED
WAITING_DEPENDENCIES
READY
```

The candidate must bind:

```text
formationProcessRefOrNull = process.vexwork.promote-derived-concern
createdAt = updatedAt = proposal formedAt
```

Its `sourceRefs[]` must include the promotion proposal, stable concern, population, snapshot, Lens, entity, Evidence, reason facet, and predicate refs. Exact fingerprints remain in the proposal receipt.

The proposal validates the candidate against the current Workgraph before it can be offered: parent and dependency refs must exist, roots must remain exact, and containment/dependency cycles fail closed.

### Decision

`createDerivedWorkPromotionDecision()` records one explicit:

```text
APPROVE
HOLD
REJECT
```

The decision binds the exact proposal fingerprint. `APPROVE` requires current authority-basis refs. The decision artifact itself remains read-only and grants no provider effect.

### Application result

`applyDerivedWorkPromotion()` revalidates the current Workgraph, proposal, and decision.

```text
APPROVE + CREATE_NEW_WORK
-> state = WORK_CREATED
-> exactly one canonical Work item in the next Workgraph
-> workgraphMutationRepresented = true
-> providerMutationPerformed = false

APPROVE + CONFIRM_EXISTING_WORK
-> state = EXISTING_WORK_CONFIRMED
-> Workgraph unchanged

HOLD
-> state = HELD
-> Workgraph unchanged

REJECT
-> state = REJECTED
-> Workgraph unchanged
```

The proposal is bound to one exact Workgraph fingerprint. Any graph advance requires current duplicate, parent, dependency, and authority review rather than silently applying a stale admission.

## Publication boundary

The promotion result represents canonical Workgraph meaning in memory/source data. It does **not** publish a branch, edit a provider issue, update `workgraphs/public.json`, regenerate `public/workspace.json`, or claim a live runtime write.

```text
WORKGRAPH_MUTATION_REPRESENTED != PROVIDER_MUTATION_PERFORMED
```

Persisting or publishing the next graph uses the separate rightful repository/runtime effect, exact currentness, and ownership checks. This keeps promotion reusable in public Git, local/private overlays, and future database-backed Workgraph storage.

## VexSite Localization use

The Localization adapter may derive a concern such as:

```text
entity       = one VexSite page
Lens         = localization
predicate    = generated runtime current
reason facet = generated runtime
state        = UNSATISFIED
```

It may then propose one bounded Work item with the exact Vextreme page, localization evidence, and VexWork projection provenance. Other pages remain derived observations. No page-per-ticket ceremony is created.

If the page already points to canonical Work that owns that exact concern, the process confirms the existing Work instead of duplicating it.

## What this process does not decide

This source does not decide:

```text
which Vextreme facts mean localized, generated-current, modernized, or lived-proven
whether Victor or another actor holds a protected semantic decision
which provider/runtime persists Workgraph truth
whether implementation may begin after Work admission
whether a Work item later changes state
```

Those remain with the rightful domain source, authority, Workgraph transition, and provider/runtime contracts.

## Proof

`test/derived-work-promotion.test.mjs` proves:

- proposal formation is read-only and cannot auto-create Work;
- approved current create-new adds exactly one canonical Work item;
- required entity/Lens/evidence/reason provenance is present;
- candidate parent/dependency/root/cycle validation uses canonical Workgraph rules;
- active/terminal starting states and `NOT_APPLICABLE` concerns fail closed;
- existing Work must be reviewed exactly before new Work;
- an exact existing Work can be confirmed without graph mutation;
- `APPROVE` requires authority basis;
- `HOLD` and `REJECT` preserve the current graph;
- stale graph, proposal tampering, and decision tampering fail closed;
- result evidence never claims provider mutation.

<!-- [VXG RealForever][VEXWORK][PROCESS][PROMOTE-DERIVED-CONCERN] -->
