# VexBoard — Durable Implementation Lessons

`[VXG RealForever]`

This source records **repeatable failure patterns actually observed while implementing VexBoard** so a fresh instance does not have to rediscover them from chat transcripts or host-terminal output.

It is intentionally narrow.

```text
THIS_FILE != VEXRELAY_PROTOCOL
THIS_FILE != VEXWORK_CULTURE
THIS_FILE != IMPLEMENTATION_AUTHORITY
THIS_FILE != A FAILURE LOG OF EVERYTHING THAT EVER HAPPENED
```

Canonical owners remain authoritative:

- VexWork culture / repository process for VexWork source meaning;
- the current VexRelay contract and validator for Relay schemas, lifecycle vocabulary, preimage enforcement, package formation, and execution semantics;
- current VexBoard source/tests for product behavior;
- provider observations for current branch / PR / commit truth.

This file exists because the same **categories** have already caused repeated human round trips. The useful lesson is therefore not the individual typo; it is the boundary that should make that typo impossible or cheap to detect.

## 1. Stable identity must not be swept by attempt rotation

Observed failure:

```text
stable implementation branch
  VXG-102326-vexboard-prototype-simulation-a001

mechanically rotated SourceOwner wrapper
  VXG-102326-vexboard-prototype-simulation-a002

result
  GitHub 404: Branch not found
```

The branch belonged to the same semantic implementation trajectory. Only the proof **attempt** changed.

Permanent distinction:

```text
STABLE_TRAJECTORY_IDENTITY != ATTEMPT_LOCAL_IDENTITY
```

Classify identifiers before forming a successor package:

```text
stable across compatible retry / role transition
  taskRef / semantic task
  workRef
  existing PR number
  existing implementation branch
  authority source
  repository / path membrane

attempt-local
  attemptRef
  requestRef
  correlationRef
  packageRef
  nonce
  attempt storage key
  RETURN filename / proof-attempt label

candidate-derived
  head SHA
  tree SHA
  blob identities

live / mutable provider observations
  current main
  PR mergeability
  review state
  open path overlap
```

Do **not** perform blind global replacements such as `A001 -> A002` across a wrapper. Rotate explicitly classified fields only.

## 2. Do not reimplement canonical Relay mechanics in a weaker wrapper

Observed failure:

```text
expected test preimage embedded as 63 hex characters
actual SHA-256                  64 hex characters
```

An outer formation wrapper duplicated a source-preimage comparison that VexRelay already owns. The same malformed digest also reached the inner WRITE template, where the canonical manifest validator would have rejected it before mutation.

Permanent distinction:

```text
WRAPPER_CURRENTNESS_GUARD != RELAY_PREIMAGE_OWNER
```

Use the current Relay manifest / recipe compiler / validator for canonical mechanics such as:

```text
WRITE expected-before identity
COPY payload identity
allowed lifecycle vocabulary
authority/effect shape
operation schema
```

The wrapper may bind carrier identity and exact remote coordinates needed to form the task, but it should not create a second weaker implementation of a contract the Relay already enforces.

If the canonical owner already rejects the malformed state, repair **formation usage** rather than inventing a new protocol rule.

## 3. Canonical enum vocabulary beats plausible near-synonyms

Observed failure:

```text
invented lifecycle state
  SOURCE_CORRECTION_PENDING

current Relay vocabulary
  CORRECTION_REQUIRED
```

The invented name sounded reasonable and was wrong. The manifest validator rejected it before task admission.

Permanent rule:

```text
PLAUSIBLE_NAME != ACCEPTED_ENUM_VALUE
```

When a schema owns a finite vocabulary, read and use that vocabulary exactly. Pre-seal qualification should validate every bound enum-like field against the same current source used by the runtime rather than relying on memory or semantic resemblance.

## 4. Template reuse can preserve stale identity or corrupt durable identity

Observed forms in this lane included:

- stale result / wrapper labels carried from an earlier PR proof;
- temp-path / package labels surviving template reuse;
- broad attempt-number replacement changing the real implementation branch;
- candidate coordinates needing explicit head/tree/blob rebinding after correction.

Template reuse is useful. **Unclassified textual substitution is not.**

Prefer:

```text
parse structured template
-> classify stable / attempt-local / candidate-derived / live fields
-> mutate exact fields
-> serialize
-> qualify final bytes
```

over:

```text
copy old wrapper
-> global search/replace
-> hope every occurrence meant the same thing
```

A final-byte audit should inspect the **sealed artifact**, not only the build directory.

## 5. Stable refs are identity; array positions are projections

Observed failure during prototype-simulation tests:

```text
prototype.interactions[0]
```

was assumed to mean one named interaction. Canonical normalization reorders by stable ref, so the positional assumption targeted a different interaction.

Permanent distinction:

```text
ARRAY_POSITION != SEMANTIC_IDENTITY
```

Tests, UI state, patches, and proof predicates should resolve semantic objects by stable ref unless ordering itself is the behavior under test.

This same lesson applies to work, nodes, relationships, interactions, steps, and other normalized collections.

## 6. Green source proof does not replace semantic Assurance

Fresh Independent Assurance found real product issues after deterministic source proof was already green, including:

- restored BoardJourney history that referenced existing objects but did not prove the recorded traversal was truthful;
- locale-sensitive relationship choice sorting that violated canonical code-point ordering;
- prototype navigation that accepted a non-`TRANSITION` relationship family.

Permanent distinction:

```text
SOURCE_OWNER_PASS != SEMANTIC_CLEARANCE
TESTS_GREEN != CONTRACT_MEANING_PROVEN
```

Keep the stages separate:

```text
implementation / local review
-> exact-head SourceOwner proof
-> fresh Independent Assurance
-> lifecycle currentness
```

When Assurance finds a deterministic defect, add the narrow regression that proves the repaired meaning rather than weakening the review boundary.

## 7. First classify the failure layer before blaming source or another lane

Several host failures happened **before repository mutation** but initially looked like SDK/source blockers.

Use the first substantive failure boundary:

```text
carrier lookup / wrapper currentness
-> formation script
-> Relay manifest validation
-> task admission
-> repository preflight
-> source WRITE
-> tests / review
-> commit / push / PR publication
-> hosted SourceOwner proof
-> Independent Assurance
-> lifecycle / merge
```

A failure at one layer does not prove a failure at the next.

Examples from this lane:

```text
63-char preimage constant
-> formation / manifest-shape problem
-> NOT another SDK lane blocking source

noncanonical lifecycle state
-> manifest validation problem
-> NOT VexWork source failure

rotated nonexistent branch
-> wrapper identity/currentness problem
-> NOT candidate regression
```

Recover from the first failure; do not replay later stages or ask Victor to wait on an unrelated lane without evidence.

## 8. Do not add a new standing rule when the rightful owner already has one

The observed preimage and lifecycle failures were already rejected by current Relay contracts.

The repair was therefore:

```text
fix our task formation
+ stop duplicating canonical mechanics
+ qualify against current canonical source
```

not:

```text
add another protocol
add another permanent checklist
add another owner
```

Before adding standing process, verify that the rightful canonical owner does not already cover the invariant. A lane-local lesson may point to the canonical owner; it should not become a shadow owner.

## 9. Minimal VexBoard carrier-formation discipline earned from these failures

This is a **lane-local reminder**, not a replacement for the current Relay contract.

Before handing Victor a new host carrier:

1. classify every identity as stable, attempt-local, candidate-derived, or live;
2. preserve stable task / PR / branch coordinates across compatible retries;
3. derive schema enums and hash-shape validation from current canonical Relay source;
4. avoid wrapper-level reimplementation of canonical WRITE/preimage semantics;
5. validate the exact inner manifest/template after substitutions, not only JavaScript/Bash syntax;
6. inspect the sealed artifact for stale executable identities and wrong branch/result coordinates;
7. if the retry is formation-only, prove candidate payload bytes are unchanged;
8. preserve the first substantive failure and continue from that boundary rather than replaying completed work.

The goal is not more ceremony. It is fewer avoidable human host round trips.

## 10. Source-definition changes can invalidate checked-in generated projections

Observed failure:

```text
projects/vexboard/project.json
  + projects/vexboard/LESSONS.md in sourceRefs[]

public/workspace.json
  remained on the prior generated projection

result
  npm run review failed at checked-in public workspace is generated-current
```

The source change itself was semantically reasonable, but `project.json` participates in the public workspace projection. Merging the source without regenerating its checked-in projection made repository main deterministically inconsistent.

Permanent distinction:

```text
SOURCE_DEFINITION_CHANGE != GENERATED_PROJECTION_CURRENTNESS
GENERATED_FILE != INDEPENDENT_SOURCE
```

Before merging a source definition that feeds a checked-in projection:

1. identify every generated consumer owned by the repository;
2. regenerate/check those consumers through their rightful generator;
3. if that generated surface is actively contested by another lane, **defer the source-definition linkage** rather than merge stale generated output;
4. do not hand-edit the generated projection merely to silence the test.

For this incident, `projects/vexboard/LESSONS.md` remains durable source, but its `project.vexboard.sourceRefs[]` linkage is deferred until the shared public-workspace projection can be regenerated without colliding with current aggregate writers.

This is a repository generated-currentness lesson, not a new VexRelay rule. VexRelay correctly surfaced the failing deterministic review and stopped before commit/push/publication.

## Current examples / lineage

These lessons were earned during the VexBoard BoardJourney and Prototype Simulation trajectory around PRs #91 and #93. The provider artifacts and RETURN packages are evidence of the individual incidents; this file preserves only the reusable categories.

If a future failure does not fit one of these categories, investigate it first. Add a new durable lesson only when repeated use or a clear reusable boundary earns it.

<!-- [VXG RealForever][VEXWORK][VEXBOARD][LESSONS] -->
