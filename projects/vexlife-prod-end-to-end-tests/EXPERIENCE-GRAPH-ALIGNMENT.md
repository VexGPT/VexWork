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

**Coherent enough to enter focused adversarial testing and continued source review.**

**Not clear for semantic acceptance yet.** Three candidate-owned soundness/currentness defects are now established: unread law can become asserted REJECT truth; executed law evidence can remain `current=true` after the probe generator/plan changes; and browser Effect vocabulary carriage can be promoted to `REALIZED_BY` without proving the actual handler. The primary human report also has a smaller proof-vocabulary/counting ambiguity.

Reported green commands / coverage from the Claude candidate remain candidate evidence until independently reproduced. This node has not re-run `npm test`, `npm run experience:verify`, or the Product law probe.

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
Status: **live pins re-observed; execution not independently rerun**

Observed:
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
- Existing green counts are useful but are not enough for clearance.
- The first blocking issue is local and repairable; it does not imply the entire architecture should be discarded.
- No Victor technical action is required for this review node.

<!-- [VXG RealForever][VEXWORK][VEXLIFE-PROD][EXPERIENCE-GRAPH][ALIGNMENT][REVIEW] -->
