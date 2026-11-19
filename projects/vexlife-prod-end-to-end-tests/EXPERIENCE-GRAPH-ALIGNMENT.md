# Experience Graph Alignment — reviewer / convergence node

`[VXG RealForever]`

This is a **sibling review/coordination surface** for the VexLife-Prod Experience Relationship Graph effort. It does not own Product semantics and it does not modify Claude's candidate.

## Why this node exists

The review now spans several independent falsification slices and already has candidate-specific findings that must survive fresh-instance boundaries without making Victor reconstruct the review.

This file carries only:

- the exact review target and currentness;
- source-supported findings and their status;
- what has and has not been independently checked;
- the next review/test slices;
- successor instructions for fresh reviewer instances.

It is not a second graph, a second QA policy, a repair branch, or acceptance.

## Current review target

```text
repository      VexGPT/VexWork
project base    VXG-111826-vexlife-prod-e2e-project-a001
base commit     e2bac13de991b5e7bc5160837e695ccce81e9575

Claude branch   VXG-111826-vexlife-prod-e2e-claude-a001
review head     4aad5e0055cdc2a9fada2f1e63200c7772850a81
delta           3 commits / 56 changed files / 0 behind project base
review class    FOUNDATION / READ_ONLY falsification
```

Live currentness observed during this review:

```text
VexWork main         d70da76d9f95645ee83dc09c7cf7384b6c572cf5
VexLife-Prod main    a58777106b08bd58c167608fa0115729185ae3dd
Claude head          4aad5e0055cdc2a9fada2f1e63200c7772850a81
ChatGPT worker       no branch observed at VXG-111826-vexlife-prod-e2e-chatgpt-a001
```

The three Product experiment branches named by Claude's source plan were also re-observed at their recorded exact heads. They are **separate Product experiments**, not evidence that this VexWork candidate is accepted.

## Protected intention recovered from the two handoffs

The work is not merely "more E2E tests."

```text
human intention
-> source-owned relationships
-> normalized Experience Relationship Graph
-> pathways / routes / journeys
-> generated deterministic + lived proof
-> derived frontier / perturbation / convergence questions
-> release-readiness
-> only after enough accepted proof: durable A6 foundational context
```

Permanent boundaries being reviewed:

```text
graph != Product state machine
Effect request != observed outside success
pathway != route != journey != test case
Screen Lens != Product truth
candidate branch != current main
Relay != graph builder / scheduler / evidence ledger
missing source readability != permission to guess semantics
```

## Current disposition

**QA disposition for Claude head `4aad5e0055cdc2a9fada2f1e63200c7772850a81`: `CORRECTIONS_REQUIRED`.**

The architecture is coherent enough to enter focused adversarial testing and continued source review. It is not semantically clear yet. Three candidate-owned soundness/currentness defects are now established: unread law can become asserted REJECT truth; executed law evidence can remain `current=true` after the probe generator/plan changes; and browser Effect vocabulary carriage can be promoted to `REALIZED_BY` without proving the actual handler. The primary human report also has a smaller proof-vocabulary/counting ambiguity.

Reported green commands / coverage from the Claude candidate remain candidate evidence until independently reproduced. This node has not re-run `npm test`, `npm run experience:verify`, or the Product law probe.

### Independent-execution observation

A local checkout of the exact Claude head was attempted from this review session so the reported test suite could be reproduced independently. The current container failed before checkout with:

```text
Could not resolve host: github.com
```

No candidate command was executed and no test result was produced by that attempt.

Provider-side observation of the Claude head also exposed **no status contexts and no check runs** at review time. This is not a candidate failure; it means there is no independently observed hosted execution to substitute for the unavailable local rerun.

Held only by this execution-surface limit:
- independent reproduction of `npm test`;
- independent reproduction of `npm run experience:verify`;
- independent clean-checkout drift/currentness proof.

Source-level falsification and live repository/currentness review remain available and continued.

## Finding ERG-REV-001 — BLOCKING: unread law cells can become asserted REJECT truth

### Observed source path

`src/core/experience-graph-kotlin-family.mjs` correctly refuses unsupported `act()` source shapes:

- unsupported forms create `UNREAD_ACT_FORM` extraction debt;
- the evaluator returns no guessed lawful outcome for that cell.

`src/core/experience-graph-derivation.mjs` correctly uses cell extraction debt to mark an **existing route** `UNKNOWN`.

But the negative-case pass later generates a REJECT case for **every State × Control cell with no `OFFERS` edge**, without consulting extraction debt.

The candidate's own `UNREADABLE` fixture contains:

```text
Wait -> delegateElsewhere(currentState)
```

which becomes `UNREAD_ACT_FORM` with no `OFFERS` edge. The current tests verify that another unresolved route is `UNKNOWN`, but do not verify that unread `Wait` cells are excluded from negative REJECT generation.

### Downstream propagation

The same absence shortcut appears in `experience-graph-perturbation.mjs`:

```text
no OFFERS edge -> lawOutcome() returns REJECT
```

and `experience-graph-convergence.mjs` marks every generated class-A case `READY_PARALLEL` when the law probe is available.

So one causal defect can project as:

```text
unread source
-> false REJECT test case
-> false EXPECTED_FROM_LAW perturbation
-> falsely ready proof case
```

### Scope

The current pinned VexLife-Prod graph at `a587771...` was checked for extraction-debt kinds and presently shows only one `MISSING_ACT_LAW` availability-only Family; no current `UNREAD_ACT_FORM` / unresolved-cell row was observed.

Therefore this finding is **not evidence that today's generated Product routes are already wrong**.

It is still blocking for this reusable foundation because the source contract explicitly says unsupported shapes become debt instead of guessed outcomes.

### Correction / proof owed

The repair belongs in Claude's candidate, not this sibling node:

1. make downstream negative/perturbation derivation consume exact cell readability/debt rather than infer REJECT from edge absence;
2. add a regression over the existing `UNREADABLE` fixture proving unread cells never generate asserted reject cases or expected-from-law perturbations;
3. re-run affected graph/manifest/perturbation/readiness proof;
4. preserve a real lawful negative cell as a positive control.

## Finding ERG-REV-002 — MATERIAL: headline "law proof" reports case counts, not law-cell counts

Exact generated `law-proof.json` at the review head reports:

```text
cellCounts:
  PASS              109
  PASS_PARTIAL        0
  FAIL                0
  FIXTURE_REJECTED   21
  NOT_RUN            22

caseCounts:
  PASS              110
  PASS_PARTIAL        0
  FAIL                0
  FIXTURE_REJECTED   21
  NOT_RUN            28
```

`src/core/experience-graph-report.mjs` renders its headline as:

```text
law proof PASS 110 ... NOT_RUN 28
```

because that line reads `lawProof.caseCounts`.

The handoff correctly distinguishes cells from generated cases, but the primary human-readable graph report blurs them. A fresh reader can reasonably read "law proof" as cell-level Family-law execution and miss the actual 21 fixture-rejected + 22 not-run cells.

Correction should either name the headline **test-case proof** or display both cell and case counts explicitly. Final severity remains part of review synthesis, but this must be corrected or deliberately justified before a clean semantic disposition.

## Finding ERG-REV-003 — BLOCKING: law evidence currentness does not bind the probe that produced it

`lawEvidence()` records `probeSourceSha256`, but `compareLawEvidence()` never compares that field with the current generated probe.

The offline `experience:verify` path also:

- fingerprints the graph extractor modules, but not `experience-graph-law-probe.mjs`;
- recomputes graph-derived artifacts and `law-proof.json` from the stored evidence;
- does not regenerate/check `generated/law-probe/ExperienceLawProbeTest.kt` or `generated/law-probe/plan.json`.

The host runner is stricter **when a new probe is actually executed**: `run-experience-law-probe.mjs` regenerates the plan and refuses to run if the checked-in probe differs. That does not close offline evidence freshness.

Therefore this transition is currently possible in the contract:

```text
change probe planner / fixture semantics
-> do not rerun Product probe
-> old evidence still has same Product commit + Family-law fingerprint
-> compareLawEvidence() reports current=true
-> experience:verify can accept the old execution as current
```

This finding does not assert that the evidence at the present head was produced by a different probe. It establishes that the candidate's **future currentness predicate is incomplete**.

Correction / proof owed:

1. bind executed evidence to the current probe source/plan identity actually used for comparison;
2. make offline verification fail when current probe generation differs from the evidence/checked-in probe;
3. regression: change only probe-generation semantics while Product Family law stays byte-identical and prove old evidence becomes stale / verification fails;
4. preserve the intended optimization that unrelated presentation/localization changes do not invalidate Family-law evidence.

## Finding ERG-REV-004 — BLOCKING: browser Effect vocabulary carriage is promoted to `REALIZED_BY`

For browser-runtime Effects, `readRealizationSites()` treats this form as realization evidence:

```text
${jsString(Family.EffectConstant)}
```

At the current VexLife-Prod pin, the graph's two VoiceInput `REALIZED_BY` edges cite:

```text
VexLifeWebP1RuntimeArtifacts.kt:L357
VexLifeWebP1RuntimeArtifacts.kt:L358
```

Those lines only define the JavaScript vocabulary object:

```text
effect: {
  beginLocalDictation: <Family effect ref>,
  endLocalDictation: <Family effect ref>
}
```

The actual realization relationship is later, where the runtime compares `act.effectRef` with those values and calls `realizeBeginLocalDictation(...)` / `realizeEndLocalDictation(...)`.

So today's Product happens to contain the real handler, but the extractor does not prove it. If the handler branches were removed while the vocabulary object remained, the graph would continue to claim `REALIZED_BY`.

This is materially different from a cosmetic sourceRef problem: `REALIZED_BY` participates in route clearance, observation traversal, perturbation generation, and debt classification.

Correction / proof owed:

1. distinguish **effect identity carried into runtime** from **effect actually consumed/realized**;
2. source-prove the dispatch/handler relationship before emitting `REALIZED_BY`;
3. adversarial regression: a fixture that only serializes/interpolates the Effect ref must not satisfy realization;
4. positive control: the current Voice handler should still resolve to the browser realization owner, ideally with the handler coordinate as evidence.

## Review slices / successor queue

### A — extraction + Family law
Status: **active; blocking finding established**

Next:
- adversarially test unsupported `act()` forms;
- check guarded/exhaustive branch semantics;
- check observation successor extraction and projection parsing;
- prove debt cannot become semantic absence.

### C — graph + frontier + route / journey derivation
Status: **partially reviewed**

Observed:
- existing source coordinates are reused;
- route status does consume exact cell debt when a route exists;
- Family-scoped realization traversal is preserved;
- ERG-REV-001 originates at the separate negative-case pass.

Next:
- exercise route grouping/qualifiers and projection surfacing against hostile fixtures;
- inspect journey inheritance and graph change-impact invalidation.

### D — proof + perturbation + convergence
Status: **partially reviewed**

Observed:
- law evidence is source-commit + Family-law-fingerprint bound, but ERG-REV-003 shows the producing probe identity is not part of the currentness predicate;
- perturbation source-review evidence is blob-currentness bound;
- current joins remain ordinary consumption;
- Relay gate does not manufacture a Relay.

Next:
- close ERG-REV-001 propagation into perturbation/readiness;
- scrutinize proof-to-claim language and partial-fixture handling;
- investigate Voice stale-observation finding separately from reproduced runtime defect.

### B — identity + localization + projectability
Status: **source inspected; blocking realization-evidence finding established**

Observed:
- ERG-REV-004 shows browser Effect vocabulary carriage is too weak to prove `REALIZED_BY`.

Next:
- falsify dataKey anchor strength/owner selection;
- test Lens-key joins for accidental semantic equivalence;
- test DOM/string heuristics for false positives and missed typed ownership;
- verify localization completeness/script findings against exact Product source.

### E — build / generated artifacts / currentness
Status: **live pins re-observed; independent execution attempted but unavailable before checkout**

Observed:
- exact local checkout attempt could not start because this session could not resolve `github.com`; no candidate test was run;
- Claude head exposed no provider status contexts / check runs at observation time;
- source plan pins current VexLife-Prod main `a587771...`;
- Claude branch is exact 3-commit descendant of project base;
- Product experiment heads match source plan.

Next:
- close ERG-REV-003, then independently reproduce `experience:verify` and the deterministic floor;
- verify generated artifact drift/currentness under a clean checkout;
- judge whether four checked-in full graph/frontier/route projections are the smallest justified durable shape.

### F — repository coexistence
Status: **field grounded**

Observed:
- project base remains `e2bac13...`;
- parent PR #317 remains open/draft;
- Claude candidate has no PR;
- expected ChatGPT worker branch has not appeared;
- Product experiment branches are separate.

Next:
- preserve sibling isolation;
- compare with independent ChatGPT candidate only if/when it actually exists;
- inspect generated Project Registry / Workgraph / public workspace consequences only when this candidate approaches integration.

## Active correction / Relay sibling

The correction trajectory now lives in **VexWork PR #321**:

```text
branch
  VXG-111826-vexlife-prod-e2e-experience-graph-relay-a001

basis
  Claude reviewed head
  4aad5e0055cdc2a9fada2f1e63200c7772850a81

current currentized head
  de8b7e33450545a9ac060c80094b253b75ee9a9c
  tree fb93cc08becc7ea45b28e3f7011feeed4913428b
```

It is exactly three commits / thirteen paths ahead of Claude and remains zero behind that basis:

1. `e5f1eda68e2cf4d526570ae338afdbe19f945169` — unread law stays fail-closed rather than becoming generated REJECT truth;
2. `32b440fa59ae8399a968c0e7a143abc2ba885378` — law evidence currentness binds the probe source; report separates law-cell proof from case projection;
3. `d7bee6967250169672999f022c2a2159d1c74751` — browser `REALIZED_BY` requires actual Effect dispatch into a `realize*` handler; carriage-only fixture refuses realization.
4. `67b88aa8a4636e770902adf3fcbe51c98301a950` — repairs the over-escaped browser-handler RegExp literal discovered by Depth 04.
5. `2bef812d7ca7f7a9a947768ecaef9dd67d150475` — makes probe-currentness tests explicit after Depth 05 proved the production contract was correctly fail-closed while two older assertions were stale.
6. `ffe2a4f766429979ebe0be4ba8b82ff414a292af` — defines the missing SHA-256 helper exposed by Depth 07 before generated drift comparison could run.

Depth 04 is consumed evidence: the VexLocalBridge carrier passed and the inner exact head/tree checks passed, then the first SourceOwner test command stopped before test bodies because the browser handler RegExp could not parse. The failure was candidate-owned; no source or provider mutation occurred.

Depth 05 is consumed evidence: exact head/tree checks passed and 24/26 focused tests passed. The unread-law, perturbation and browser-realization corrections passed. The two failures were stale test assertions that expected law evidence to be current without supplying the new required current-probe identity. Production fail-closed behavior was preserved; only those assertions were corrected.

Depth 06 is consumed evidence: outer VexLocalBridge PASS; inner ExactHeadSourceOwnerProof PASS on exact head `2bef812d7ca7f7a9a947768ecaef9dd67d150475` / tree `62f11d3aa5f0ee214eb18c351c80261b22363a02`; all 26 focused tests passed and the exact 13-path review snapshot formed. No source or provider mutation occurred.

Depth 07 is consumed evidence: outer/inner Relay transport passed and exact head/tree binding passed, but the generator did **not** reach drift comparison. Its admitted observation command exited 1 with `sha256 is not defined`. The PASS task disposition therefore means the observation returned, not that currentization drift was discovered. No generated mutation is admitted from this return.

The missing helper is repaired at `ffe2a4f766429979ebe0be4ba8b82ff414a292af` (tree `5f9bd93ea7cb2736ce0938357f47554ebc55e105`) by defining the SHA-256 helper already called by the law-probe currentness path.

Depth 07B is consumed evidence: the source-owned generator reached its intended comparison and returned canonical `experience graph drift:` output at exact head `ffe2a4f766429979ebe0be4ba8b82ff414a292af` / tree `5f9bd93ea7cb2736ce0938357f47554ebc55e105`. No source/provider mutation occurred and no first substantive failure was recorded.

The exact generated-currentization membrane is 19 paths: the main graph/frontier/routes/perturbations/convergence, law-probe plan, law-proof, EXPERIENCE-GRAPH report; three graph/frontier/routes files for each of the three candidate builds; and branches.json / BRANCHES.md. The generated Kotlin probe source is not in the drift set.

Depth 08 is consumed evidence: exact race/path preflight passed; the source-owned generator changed exactly the 19 paths discovered by Depth 07B; focused tests and offline verification passed; one signed-off commit was created and non-force pushed to the existing #321. The published exact candidate is `de8b7e33450545a9ac060c80094b253b75ee9a9c` / tree `fb93cc08becc7ea45b28e3f7011feeed4913428b`, independently re-observed on GitHub. Inner disposition is correctly `HOSTED_VALIDATION_PENDING`: publication is complete, semantic clearance is not self-issued.

On the published head the generated law proof reports `current=true`, `sourceCurrent=true`, `probeCurrent=true`, with matching evidence/current probe SHA-256s. The human report separates law-cell proof from executed-case counts. Route counts remain 13 CLEARED / 53 FRONTIER_DEBT / 0 HELD / 0 UNKNOWN.

The next unconsumed edge is **Depth 09: whole-candidate ExactHeadSourceOwnerProof of `de8b7e33...` against Claude basis `4aad5e0...`**, covering all Experience Graph-owned tests, offline reproducibility, and a fresh pinned-source `--fetch --check`.

## Fresh reviewer handoff rule

A successor should begin from this file plus the exact Claude review head. Do **not** restart the whole history.

If Claude's head changes:

```text
preserve findings whose implicated source is byte-identical
-> inspect exact delta
-> reopen affected findings/slices only
-> re-ground Product/source-plan pins if changed
```

If the independent ChatGPT worker branch appears:

```text
review it independently first
-> record its source/proof findings
-> only then compare architectural decisions
```

Do not merge the two candidates merely because both implement "Experience Graph."

## Victor-facing meaning

At the current checkpoint:

- Claude's direction is recognizably aligned with the intended graph-first architecture.
- The work is structured enough that **testing should begin now**, especially adversarial fail-closed tests.
- Existing green counts are useful candidate evidence but are not enough for clearance, and this reviewer has not independently reproduced them.
- The blocking issues are local to proof/derivation boundaries and look repairable; they do not imply the entire architecture should be discarded.
- No Victor technical action is required for this review node.

<!-- [VXG RealForever][VEXWORK][VEXLIFE-PROD][EXPERIENCE-GRAPH][ALIGNMENT][REVIEW] -->


## Fresh Independent Assurance finding after Depth 09

Depth 09 closed the whole-currentized SourceOwner proof on `de8b7e33450545a9ac060c80094b253b75ee9a9c`: 68/68 Experience Graph tests PASS, offline verification PASS, fresh pinned-source `--fetch --check` PASS, exact review snapshot PASS.

Fresh FOUNDATION Assurance then returned **CORRECTIONS_REQUIRED** for one new blocking finding:

### ERG-REV-005 — branch law-proof reuse must bind probe identity

`src/core/experience-graph-branches.mjs` still declared main executed law proof reusable from `lawFingerprint(main) === lawFingerprint(candidate)` alone.

That is weaker than the repaired evidence-currentness contract. A candidate can leave semantic law edges unchanged while changing fixture/probe formation, so reusable executed evidence must require both compatible Family-law identity and compatible generated probe identity.

The current three Claude Product candidate rows are not presently falsified by this gap; it is a fail-closed defect in the reusable foundation rule.

Bounded source repair is now on #321:

```text
head
  8c4572c778e5943ec7faae13200ec5033959a82d

tree
  a1783068fea0b4175cd142ba44eb2804e2d58ea9
```

Repair shape:
- graph extractor metadata carries `lawProbeSourceSha256`;
- semantic graph fingerprint still excludes extractor metadata;
- branch proof reuse requires law fingerprint + probe SHA equality;
- main offline verification binds graph metadata back to checked-in probe source;
- regression proves equal semantic law with different probe identity is not reusable.

Next unconsumed edge: **Depth 10 read-only proof + generated drift discovery**. Generated mutation remains held until the generator itself returns the exact stale path set.
