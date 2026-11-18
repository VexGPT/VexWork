# Experience Relationship Graph — first built infrastructure

`[VXG RealForever]`

This directory is the first working build of the graph this Project describes in
`../README.md` and `../RELATIONSHIP-LATTICE.md`. It is **work-lane infrastructure**, not the
terminal Experience Relationship Graph foundation (A6). That document is still deliberately unwritten.

~~~text
VexLife-Prod source (pinned, read only)
-> Family law reader          src/core/experience-graph-kotlin-family.mjs
-> Product wiring readers     src/core/experience-graph-product-wiring.mjs
-> normalized graph           src/core/experience-graph.mjs          (12 edge kinds, VexBoard projection)
-> frontier / routes / cases  src/core/experience-graph-derivation.mjs
-> post-map perturbation      src/core/experience-graph-perturbation.mjs
-> joins + Relay gate         src/core/experience-graph-convergence.mjs
-> Family-law proof           src/core/experience-graph-law-probe.mjs  (class A, executed Kotlin)
-> human report               src/core/experience-graph-report.mjs
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
~~~

The pinned Product commit, the prior commit used for change impact, and the read roots live in
`source-plan.json`. Moving the pin is a deliberate, reviewed change; nothing re-pins itself.

## What is source truth and what is not

~~~text
VexLife-Prod source                 meaning owner (read only here)
source-plan.json                    which exact revision is read
generated/*                         projections; regenerated, never hand-edited
evidence/law-evidence.json          executed resolve() rows, bound to one graph fingerprint
evidence/perturbation-evidence.json source-review answers, each bound to the exact Git blob read;
                                    an edited blob turns its answers into STALE_EVIDENCE
../relationship-lattice.seed.json   A0 hand seed; now cross-checked against the derived graph
~~~

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
