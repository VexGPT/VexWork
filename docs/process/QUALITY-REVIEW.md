# VexWork Quality Review

`[VXG RealForever]`

**Process ref:** `process.vexwork.quality-review`

## Purpose

A VexWork Quality Review gives a fresh QA/reviewer one repeatable way to answer:

> Does this exact candidate truthfully solve the intended work-system question, preserve its boundaries, fail safely, and carry enough evidence for the next lifecycle decision?

The review is deliberately stronger than "the tests passed" and narrower than merge authority.

```text
AUTOMATED_CHECK != QA_DISPOSITION
QA_DISPOSITION != FORMAL_REVIEW
FORMAL_REVIEW != PROVIDER_APPROVAL
PROVIDER_APPROVAL != MERGE
```

A QA reviewer is an evidence-seeking falsification role. The default posture is read-only: inspect, run admitted proof, challenge assumptions, and return findings. Do not repair the candidate while reviewing it unless a separate write role is explicitly formed.

## Why this process exists

VexWork is itself a work-management foundation. If review quality lives only in a predecessor chat, every future reviewer can accidentally ask different questions and call incomparable evidence "QA."

The recurring need is therefore source-worthy:

```text
candidate claim
-> exact review target/currentness
-> stable question set
-> cheapest truthful evidence per claim
-> adversarial / negative checks
-> explicit unknowns and non-claims
-> semantic disposition
-> structured return
```

This process composes lessons already established elsewhere without taking ownership from them:

- VexLife-Android feature authoring: human outcome, current truth, missing question, rightful source owner, proof follows claim;
- Vextreme EndToEnd: named outcome, exact participants/currentness, lived boundaries when claimed, named checkpoints, scope/non-claims;
- Vextreme independent review: review occupancy, semantic disposition, provider credential/event, and formal provider approval are distinct.

When a target repository owns a stronger review or proof process, follow that owner and treat this VexWork review as navigation/composition rather than replacement.

## Review classes

The first review classes are intentionally small:

```text
FOUNDATION
  contracts, schemas, architecture, deterministic behavior, source descent

FEATURE
  human/product behavior in one owning repository

LIVED_OUTCOME
  user/operator outcome whose claim crosses runtime/provider/device boundaries
```

`FOUNDATION` is the first VexWork dogfood class. `FEATURE` should descend into the target repository's feature process. `LIVED_OUTCOME` should descend into the institutional EndToEnd owner when the claim requires it.

## Mandatory preflight

Before substantive review, bind the exact candidate:

```text
reviewTargetRef
reviewTargetHeadRef
reviewTargetBaseRef
reviewClass
claimedOutcome
explicitNonClaims[]
requiredSourceRefs[]
requiredProofRefs[]
formalProviderApprovalRequirement = REQUIRED | NOT_REQUIRED | UNKNOWN
```

Also record the review occupancy separately from provider identity when those concepts exist.

If the target head changes during review:

```text
HEAD_CHANGED
-> do not silently carry CLEAR forward
-> preserve findings already grounded in unchanged source
-> classify which evidence remains reusable
-> re-read/re-run only the materially changed scope
-> bind the terminal review to the new exact head
```

## Review question contract

Every applicable question is answered `PASS | FAIL | HELD_UNKNOWN | NOT_APPLICABLE` with evidence. `PASS` without evidence is not a review result.

### QR-01 — Human intention

Can a fresh reviewer state the human/work outcome in ordinary language from current source, without reconstructing it from chat history?

Look for:

- one clear human question;
- why the candidate exists;
- what would be different if it succeeds.

### QR-02 — Acceptance boundary and non-claims

Is the candidate's boundary explicit, and did adjacent nice-to-haves remain outside it unless deliberately admitted?

Challenge:

- hidden scope expansion;
- "while we're here" work;
- tests or docs implying a broader promise than the source can prove.

### QR-03 — Rightful ownership

Does each durable concept live with the smallest rightful owner?

Ask:

- Is one state domain accidentally owned twice?
- Is a provider record being treated as canonical work truth?
- Is VexWork stealing product/source/process ownership from another repository?
- Is a projection being treated as an effect owner?

### QR-04 — Vocabulary and discoverability

Do names communicate the human question and architectural role before implementation archaeology is required?

Aliases may aid discovery; they must not silently become canonical ontology.

### QR-05 — Model separation

Are materially different questions kept distinct?

For VexWork, explicitly test:

```text
Work item != Project membership
Project != Workgraph
Work state != Work disposition
Work Board != Workgraph
Parking Lot != Project
Provider state != Work state
Authority != lifecycle state
```

### QR-06 — Positive behavior

Does the intended happy path work for the exact candidate?

Use the cheapest truthful proof. Do not substitute a unit test for a lived boundary when the claim is lived.

### QR-07 — Negative / fail-closed behavior

Attempt the plausible wrong paths, especially stale, unknown, duplicate, cyclic, ambiguous, unauthorized, or cross-scope inputs.

A strong foundation proves not only what succeeds but what must refuse to become truth.

### QR-08 — Relationships and cross-boundary routing

Do repository, process, dependency, parent/child, provider, and provenance relationships point to the rightful owner without granting authority by reference?

### QR-09 — Fresh-instance recovery

Can a fresh human/agent enter from repository front doors and find the exact source, tests, process, and next route without predecessor-chat reconstruction?

### QR-10 — Proof-to-claim fit

Does every material claim have evidence from the owner that can actually prove it?

Classify evidence honestly:

```text
SOURCE_PROVEN
DETERMINISTIC_TESTED
PROVIDER_OBSERVED
LIVED_PROVEN
NOT_PROVED
```

Do not promote evidence classes by enthusiasm.

### QR-11 — Regression and coexistence

Did the candidate preserve existing unrelated truth and previously accepted behavior?

When coexistence matters, test the relationship rather than assuming an empty fixture.

### QR-12 — Complexity / burden

Did the candidate add only structures justified by observed or contract-required need?

Ask what breaks if a new registry, document, role, abstraction, process, or check is removed. If nothing required is lost, that addition is suspect.

### QR-13 — Process learning

Did the work reveal a recurring process future workers would otherwise rediscover?

If yes, is the smallest reusable route source-placed with the rightful owner? If no, did the candidate avoid turning a one-off maneuver into bureaucracy?

### QR-14 — Review currentness

Is the terminal review bound to the exact head/source/proof actually inspected? Are stale observations explicitly marked stale rather than carried forward?

## Evidence ladder

Use the least expensive evidence that can truthfully prove the claim, then deepen only when the claim requires it.

```text
source inspection
-> deterministic unit/foundation test
-> integration/provider observation
-> installed/runtime/lived proof
```

Examples:

```text
schema rejects unknown state
  -> focused deterministic test

Work Board omits unprojected parked item
  -> projection test + CLI observation

GitHub issue is only provenance
  -> source/contract inspection + negative mutation test if one exists

human can actually drag a card and persistence survives restart
  -> lived runtime proof; source-only test is insufficient
```

## Finding contract

Each finding must identify:

```text
findingRef
questionRef
severity = BLOCKING | NONBLOCKING
summary
expected
observed
evidenceRefs[]
requiredCorrectionOrNull
```

Prefer one causal finding over several symptoms of the same failure.

A BLOCKING finding means the candidate's stated acceptance claim cannot truthfully stand as written. A NONBLOCKING finding is useful improvement/debt that does not falsify the claimed scope.

## Semantic dispositions

Use the established semantic review vocabulary:

```text
CLEAR
CORRECTIONS_REQUIRED
BLOCKED
NONBLOCKING_FINDINGS
```

Interpretation:

```text
CLEAR
  no material review finding falsifies the claimed scope

CORRECTIONS_REQUIRED
  one or more blocking findings have a bounded candidate correction

BLOCKED
  the review cannot truthfully conclude because a required source/evidence/environment predicate is unavailable or unresolved

NONBLOCKING_FINDINGS
  claimed scope is not falsified, but useful nonblocking findings remain
```

The semantic disposition is not the GitHub review event. Record provider transport separately when used.

## Required terminal return

A completed QA review returns:

```text
REVIEW TARGET
  target ref / base / exact head / review class

OUTCOME UNDER REVIEW
  one ordinary-language sentence

QUESTION MATRIX
  QR-01 ... QR-14 = PASS | FAIL | HELD_UNKNOWN | NOT_APPLICABLE
  with evidence refs

AUTOMATED PROOF
  commands + exact result

ADVERSARIAL / MANUAL PROOF
  scenarios attempted + observations

FINDINGS
  blocking first, then nonblocking

SCOPE LEDGER
  SOURCE_PROVEN
  DETERMINISTIC_TESTED
  PROVIDER_OBSERVED
  LIVED_PROVEN
  NOT_PROVED

SEMANTIC DISPOSITION
  CLEAR | CORRECTIONS_REQUIRED | BLOCKED | NONBLOCKING_FINDINGS

PROVIDER REVIEW EVENT
  NONE | COMMENT | APPROVE | REQUEST_CHANGES
  recorded separately and only when actually performed

NEXT ROUTE
  exact correction / further proof / formal review route
```

Use `docs/templates/QA-REVIEW-BRIEF.md` to hand the role to a fresh reviewer and `docs/templates/QA-REVIEW-RETURN.md` for the return shape.

## VexWork Foundation deterministic floor

For the current repository foundation, the ergonomic automated-floor entry is:

```bash
npm run review
```

That delegates to the explicit deterministic floor:

```bash
npm run review:deterministic
```

Neither command is the semantic QA disposition; both only produce deterministic evidence for the reviewer.

Then exercise the source-managed dogfood projections:

```bash
npm run work:status -- --project projects/vexwork-foundation/project.json --graph projects/vexwork-foundation/workgraph.json --view projects/vexwork-foundation/board.view.json --format board
npm run work:status -- --graph projects/vexwork-foundation/workgraph.json --format parking-lot
npm run work:status -- --graph projects/vexwork-foundation/workgraph.json --format parking-lot --repository repo.vexlife-android
```

These commands are the deterministic floor, not the complete review.

## PR #1 worked questions

A fresh QA reviewer of VexWork PR #1 should actively try to falsify at least these claims:

```text
1. The global Workgraph contains both Project-bound and unprojected work.
2. The VexWork Foundation Project Board contains only its selected subgraph.
3. Android #144 appears in Parking Lot but not the Foundation Project Board.
4. PARKED remains a disposition, not a lifecycle state.
5. GitHub issue #144 remains provenance, not canonical Work identity.
6. Unknown repository/process refs fail closed.
7. Stale Workgraph transition requests fail closed.
8. Stored transition history rejects illegal edges, duplicate transition identities, broken chains, and current-state contradictions.
9. A correctly fingerprinted but semantically invalid Workgraph cannot bypass complete Workgraph validation through `requestTransition` or another state-changing behavior entry.
10. Containment/dependency cycles fail closed.
11. Board lane ordering is an exact unique permutation and cannot silently duplicate or suppress Project work.
12. Process Map points to Android feature authoring without taking ownership of it.
13. "Jira board" remains a human alias for Work Board rather than a dependency or namespace.
14. A fresh worker can find the above from README -> AGENTS -> Foundation/Process sources.
15. The PR does not claim live persistence, interactive UI, provider reconciliation, or a production-current Workgraph writer.
```

If any of those is false, the review should not return `CLEAR` merely because the test suite is green.

<!-- [VXG RealForever][VEXWORK][PROCESS][QUALITY-REVIEW] -->
