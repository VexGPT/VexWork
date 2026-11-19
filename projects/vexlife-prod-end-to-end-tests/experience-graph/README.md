# Experience Relationship Graph — first built infrastructure

`[VXG RealForever]`

This directory is the first working build of the graph this Project describes in
`../README.md` and `../RELATIONSHIP-LATTICE.md`. It is **work-lane infrastructure**, not the
terminal Experience Relationship Graph foundation (A6). That document is still deliberately unwritten.

~~~text
VexLife-Prod source (pinned, read only)
-> Family law reader          src/core/experience-graph-kotlin-family.mjs
-> Product wiring readers     src/core/experience-graph-product-wiring.mjs
-> keyed-text identity        src/core/experience-graph-localization.mjs  (catalog keys as elements)
-> string identity            src/core/experience-graph-identity.mjs      (copied refs, DOM ids)
-> normalized graph           src/core/experience-graph.mjs          (12 edge kinds, VexBoard projection)
-> frontier / routes / cases  src/core/experience-graph-derivation.mjs
-> post-map perturbation      src/core/experience-graph-perturbation.mjs
-> joins + Relay gate         src/core/experience-graph-convergence.mjs
-> Family-law proof           src/core/experience-graph-law-probe.mjs  (class A, executed Kotlin)
-> human report               src/core/experience-graph-report.mjs
-> candidate branches         src/core/experience-graph-branches.mjs     (against preserved main)
~~~

## Read first

`generated/EXPERIENCE-GRAPH.md` is the human view: what is CLEARED, what is debt (highest
leverage first), what Family law has been proven by execution, which perturbation questions are
answered and which stay UNKNOWN.

## Commands

~~~text
npm run experience:verify   offline: every derived artifact reproduces from the checked-in graph,
                            extractor blobs match, law proof recomputes (also runs inside npm test)
npm run experience:check    fetch the pinned commits, regenerate in memory, fail on any drift
npm run experience:build    fetch the pinned commits and regenerate generated/
npm run experience:probe -- --source <VexLife-Prod checkout at the pinned commit> [--work <dir>]
                            run the generated probe against the compiled, unmodified Product
                            (git-archive copy, probe in jvmTest only), then rebuild
node scripts/build-experience-graph.mjs --build <candidate-ref> --source <checkout at its commit>
                            project one candidate branch into generated/builds/<ref>/ and
                            recompute generated/branches.json + BRANCHES.md against main
~~~

The pinned Product commit, the prior commit used for change impact, and the read roots live in
`source-plan.json`. Moving the pin is a deliberate, reviewed change; nothing re-pins itself.

## What is source truth and what is not

~~~text
VexLife-Prod source                 meaning owner (read only here)
source-plan.json                    which exact revision is read
generated/*                         projections; regenerated, never hand-edited
evidence/law-evidence.json          executed resolve() rows, bound to the commit and the Family-law
                                    fingerprint (presentation / localization changes keep it current)
evidence/perturbation-evidence.json source-review answers, each bound to the exact Git blob read;
                                    an edited blob turns its answers into STALE_EVIDENCE
../relationship-lattice.seed.json   A0 hand seed; now cross-checked against the derived graph
~~~

## Two element-identity systems, both read

The Screen Lens names elements by `elementRef`; the localization catalog names them by key, and a
key's `dataKey` (`owner:kind:REF`) names the semantic ref it presents (VexLife-Prod
`docs/CULTURE.md`: "the key is the element"). The first build read only the Lens, so it reported
keyed manifestations as missing (the Entry DisplayState "top-leverage" row was a reader blind
spot: the native setup window is fully keyed). Keys are now graph elements: a key naming a Family
Control `MANIFESTS` it; a key naming a Family State is where its DisplayState `PROJECTS_TO`; markup
that carries both identities, or a key's `lens` namespace, joins them. Each dataKey prefix records
how strongly it is anchored (main source, test source, or only the catalog's prose).

Localization frontier (class E unless noted): `LANGUAGE_INCOMPLETE`, `PARTIAL_LANGUAGE_SERVED`,
`SCRIPT_COLLAPSE`, `HARDCODED_DISPLAY_TEXT`; class B: `DATAKEY_UNRESOLVED`,
`DATAKEY_ANCHOR_NOT_IN_MAIN`, `LENS_KEY_UNLINKED`.

## String identity outside its owner

Class B rows where an identity is a copied string instead of a relationship:
`LITERAL_SHADOWS_CONSTANT` (a compare repeats a value an owner names), `UNOWNED_WIRE_LITERAL`
(both sides repeat a wire value nobody owns), `FAMILY_READS_WIRE_STRING`, `TYPED_REF_BYPASSED`
(runtime binds by DOM id although the element carries `data-vex-ref`), `UNTYPED_INTERACTIVE`,
`REFLECTION_IDENTITY` (reflected names used as identity; evidence text is not). Literal
coordinates name the nth occurrence in a file, never a line, so unrelated edits do not churn them.

## Branch dynamics

`source-plan.json` `builds` pins candidate branches by exact commit, each cut from the pinned main.
Main's projection at `generated/` is never rewritten by a candidate; each candidate is projected
with the same extractor into `generated/builds/<ref>/` and compared in `generated/branches.json`:
route flips (a CLEARED route lost is `REGRESSES_MAIN`), debt resolved / introduced by kind, law
and manifestation edges changed, and whether main's executed law proof still holds (it does when
the Family-law fingerprint is unchanged). This mirrors the VexBoard Lens catalog's Stable / Main
build pointers; the vexlife-prod Lens subject itself still needs Victor's Stable acceptance before
it can show builds.

Class F (`TEST_SEAM_MISSING`) joins the frontier from the executed probe; it never moves a route.
Class G (held by source declaration) has no source form to read yet and is not emitted.

## Laws the code holds itself to

- Node refs are existing coordinates (Family / State / Control / Effect symbols, elementRefs,
  owner classes, exact Intent / Receipt fields). No alias namespace.
- A route is `CLEARED` only when every coordinate it needs is stably addressable. Everything else
  carries its smallest missing predicate, and debt is derived from the graph, never hand-kept.
- Effect != success: realization and observation are separate route steps with their own proof
  class. Deeper steps without a harness in this lane are `HELD_NO_HARNESS_IN_LANE`, not asserted.
- Graph topology generates perturbation questions; Family law or bound source evidence answers
  them; otherwise they stay `UNKNOWN`.
- `CONVERGES_IN` / `DERIVES_RELATIONSHIP` cannot be emitted without a source-proven Relay owner.
  Every candidate graph-operations question passes through the Relay gate; where an ordinary query
  answers it (route readiness, debt dependents, change impact) the query is the implementation.
- Traversal is Family-scoped through shared owners, so one service realizing several Families
  does not join their routes.

<!-- [VXG RealForever][VEXWORK][VEXLIFE-PROD][E2E][EXPERIENCE-GRAPH][README] -->
