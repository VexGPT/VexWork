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

### QR-13A — Worked example: A022 -> A024, when a lived retry chain must become a source regression

Use this incident as a concrete pattern, not as VexLife-specific ceremony. The important question is **when a fresh worker should stop repeating a host/lived attempt and descend to the owning source**.

#### Starting truth

The ordinary Heretic fresh-Home proof had already finished its large artifact prerequisite:

```text
11 / 11 model members exact
15,153,242,506 bytes exact
missing = 0
invalid = 0
```

A022 therefore had a narrow job:

```text
exact local model
-> Python 3.14.7 + mlx-lm 0.32.0 environment
-> Heretic runtime qualification
```

A022 failed during environment realization. Its outer result surfaced only:

```text
HERETIC_ENVIRONMENT_REALIZATION_FAILED
```

A tempting but wrong continuation would have been:

```text
retry A022
increase timeout
re-download the model
reinstall Python blindly
blame pip/network without discrimination
```

None of those actions followed from the evidence.

#### First discriminator: separate harness observation loss from product failure

A022's child emitted an owner error in this shape:

```text
[VexLife A022] environment failed: <OWNER_CODE>
```

The parent sanitizer searched for:

```text
A022 environment failed: <OWNER_CODE>
```

The extra `] ` meant the exact owner code was lost and the outer carrier fell back to a generic failure.

That is a **harness observation-loss defect**, but it does not explain why the environment owner failed.

The next attempt therefore repaired error transport *and* added a discriminating diagnostic instead of assuming the harness defect was the product defect.

#### Second discriminator: prove or eliminate the external prerequisite

A023 created one task-owned temporary Python environment and performed a binary-only dry-run of the exact dependency request before mutating the retained fresh Home.

Observed:

```text
bootstrap Python = 3.14.7
pip dependency resolution = PASS
mlx-lm = 0.32.0
mlx = 0.32.4
dependency resolver exit = 0
```

Then the accepted VexLife environment owner still failed, now with the exact owner code:

```text
HERETIC_ENVIRONMENT_PROBE_FAILED
```

At this point, repeating the host attempt would no longer be evidence-seeking. The external prerequisite had passed; the failure was reproducibly inside the owning source path.

#### Exact source cause

Current VexLife source formed the post-install Python probe from separate statements:

```javascript
const script = [
  'import importlib.metadata as md,json,sys',
  'import mlx_lm',
  'import mlx_lm.server',
  'print(...)'
].join('');
```

Those fragments do not contain separators. The generated `python -c` program therefore collapsed statement boundaries into a shape like:

```text
import importlib.metadata as md,json,sysimport mlx_lmimport mlx_lm.serverprint(...)
```

That is invalid Python syntax.

The smallest rightful repair was:

```javascript
].join('\n');
```

No model identity, Python version, package version, runtime owner, Home semantics, or Browser behavior needed redesign.

#### Regression shape

The regression did **not** merely assert that the source text contains `join('\n')`.

It injected the environment owner's command runner, captured the actual program passed as the Python `-c` argument, and asserted both the intended statement boundaries and the exact historical failure shape:

```javascript
assert.match(
  observedProgram,
  /import importlib\.metadata as md,json,sys\nimport mlx_lm\nimport mlx_lm\.server\nprint/
);
assert.doesNotMatch(observedProgram, /sysimport mlx_lm/);
```

That matters because the bug lived in the **generated program**, not merely in one source token. A future refactor can change how the string is built while the regression still protects the actual contract.

#### Resume coordinate

The source correction became a bounded candidate rather than another host retry:

```text
source owner:
  src/core/heretic-runtime-establishment.mjs

regression:
  test/heretic-runtime-establishment.test.mjs

generated closure:
  exact Source Manifest buckets only

then:
  focused proof
  -> whole-repository proof
  -> exact-head SourceOwner
  -> Independent Assurance
  -> lifecycle / merge / postmerge
  -> resume the preserved fresh Home
```

The already-proven 15.15 GB model set remains reusable. Source correction does not authorize reacquiring it merely to gain confidence.

#### Reusable decision rule

When a lived/host attempt fails, use this order:

```text
1. Did the attempt create durable state?
   YES -> recover/read current state before replay.

2. Is the reported error exact?
   NO -> repair observation transport without calling that the product fix.

3. Can one bounded diagnostic separate external prerequisite failure from owner-source failure?
   YES -> run that discriminator once.

4. Did the prerequisite pass while the same owner path still fail deterministically?
   YES -> stop host retries and descend to owner source.

5. Can the defect be reproduced from source/generated input?
   YES -> form the smallest source correction plus a regression against the real generated artifact/command/input.

6. After source acceptance, where do we resume?
   -> from the preserved host state, not from the beginning.
```

This example is preserved in VexLife ToCompletion lineage through issue #866's A022/A023/A024 checkpoints and the A024 environment-probe correction candidate. Future workers should use the sequence to recognize the **shape of the problem**, not copy its attempt numbers mechanically.

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

## Merge-ready handoff

A terminal exact-candidate review does not need to keep chasing live `main`.

When the exact candidate is clear and every candidate-owned proof/review predicate required by the owning repository is satisfied:

```text
exact candidate head/tree stable
+ required SourceOwner / QA / assurance evidence current
+ no candidate-owned blocking finding
-> READY_FOR_INTEGRATION
```

The review return should preserve:

```text
providerPullRequestRef
candidateHead
candidateTree
fixedEvidenceBase
sourceOwnerEvidenceRefOrNull
review / assurance evidence refs
dependency / priority evidence refs
explicit non-claims
```

Then route to:

```text
docs/foundation/REPOSITORY-INTEGRATION.md
docs/process/INTEGRATE-READY-PULL-REQUESTS.md
```

Do **not** reinterpret unrelated `main` movement as a failed candidate review.

```text
MAIN_MOVED
+ CANDIDATE_UNCHANGED
-> preserve exact-candidate review/proof
-> invalidate only stale integration-currentness/composition evidence
-> Integration Steward rebinds current main at the candidate's queue turn
```

If the candidate head/tree changes, re-evaluate only the materially affected candidate proof/review.

If a candidate-owned test actually consumes mutable source generated from current `main`, re-run that affected proof instead of mechanically carrying it forward.

```text
READY_FOR_INTEGRATION != MERGE_AUTHORITY
QA_CLEAR != ORDINARY_MERGE
```

## Stability and coverage contract

The deterministic suite is the first regression floor, not the whole meaning of quality.

VexWork currently separates four questions:

```text
DIRECT_TEST_OWNERSHIP
  does every durable core/public reader module have an explicit regression surface?

BEHAVIORAL_REGRESSION
  do focused tests exercise the intended behavior and the material fail-closed branches?

COVERAGE_VISIBILITY
  which executable lines/branches/functions were actually reached by the suite?

CLAIM_FIT
  does the available evidence class prove the product/foundation claim being made?
```

The repository enforces direct test ownership through:

```text
test/stability-contract.test.mjs
```

It requires every current `src/core/*.mjs` module and root `*-reader.js` public reader to be named by at least one deterministic test surface. This is intentionally weaker than code coverage and stronger than relying on convention alone.

Coverage is observable through:

```bash
npm run test:coverage
npm run coverage:source
```

Node 20's built-in aggregate includes the test files themselves, so VexWork does **not** use the headline all-files percentage as its source baseline. The LCOV projection is filtered by the repository-owned checker to:

```text
src/**/*.mjs
*-reader.js
```

That keeps the baseline about durable executable VexWork source rather than test-code self-coverage.

The ordinary review floor runs that coverage-enabled test execution once before the remaining deterministic checks:

```text
npm run review
-> npm run review:deterministic
-> npm run test:coverage
-> npm run coverage:source
-> npm run check
-> npm run dashboard:check
-> npm run workspace:check
```

The repository runtime floor is Node >=20.1 because that is the first Node 20 release where the built-in test coverage mode can be used with the command-line test runner.

The coverage report is diagnostic evidence. It does not create semantic clearance:

```text
LINE_EXECUTED != ASSERTION_PROVED
HIGH_COVERAGE != CORRECT_BEHAVIOR
COVERAGE_REPORT != QA_DISPOSITION
```

### Change-class expectations

For executable changes, apply the smallest relevant proof:

```text
core contract / state behavior
  -> focused positive tests
  -> relevant negative / stale / fail-closed tests
  -> inspect coverage of the touched responsibility

public reader / UI behavior
  -> deterministic reader/UI regression
  -> lived proof when the claim is actually visual or interactive

generated checked-in projection
  -> owning source tests
  -> generated-currentness check

deterministic defect repair
  -> regression fixture that fails for the defect
  -> repair
  -> affected broader proof

shared composition / aggregate behavior
  -> coexistence fixture preserving unrelated accepted truth
```

### Coverage-floor posture

Do not choose an arbitrary repository-wide percentage before measuring the exact accepted suite and understanding which source classes belong in the denominator.

The first maturity step is therefore:

```text
MEASURE exact candidate
-> identify meaningful uncovered responsibilities
-> add missing behavioral tests where warranted
-> record an accepted baseline
-> introduce a non-regression floor
-> ratchet deliberately as coverage improves
```

The first accepted source-only baseline is now measured on the exact Node 20.18.1 Foundation suite:

```text
lines      96.73%
branches   84.73%
functions  96.71%
```

The first non-regression floor is intentionally just below that earned baseline:

```text
lines      >= 96%
branches   >= 84%
functions  >= 96%
```

Critical lifecycle/currentness modules also carry file-local floors in `blueprint/source-coverage-baseline.json`, so broad easy-to-cover code cannot compensate for a regression in Workgraph persistence, lifecycle admission, transition handshakes, or composition.

The floor is a ratchet, not a target. Changes should not lower it without an explicit reviewed reason, and meaningful new tests should raise the accepted baseline/floor when the repository has earned the increase.

## Accepted execution carrier

The deterministic review command is repository-owned source, but **GitHub Actions is not the accepted default proof carrier for VexWork work in Local Vex Operations**.

For an exact repository candidate that requires host execution, use the current VexRelay contract and its named recipe family:

```text
source.vexrelay.current-contract/v1
-> adapter.vexrelay.repository/v2
-> ExactHeadSourceOwnerProof
-> canonical ten-member RETURN
-> independent consumption
```

Use `IndependentAssurance` when the lifecycle stage requires a separate read-only assurance role.

```text
npm run review
  = repository deterministic proof command

VexRelay
  = admitted execution/evidence carrier

GITHUB_ACTIONS
  != DEFAULT_VEXWORK_PROOF_ROUTE
```

If another repository explicitly requires a hosted GitHub check, that is a separate owner-specific predicate. Do not relabel Relay/local host proof as hosted Actions proof.

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
npm run work:status -- --project projects/vexwork-foundation/project.json --graph workgraphs/public.json --view projects/vexwork-foundation/board.view.json --format board
npm run work:status -- --graph workgraphs/public.json --format parking-lot
npm run work:status -- --graph workgraphs/public.json --format parking-lot --repository repo.vexlife-android
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
