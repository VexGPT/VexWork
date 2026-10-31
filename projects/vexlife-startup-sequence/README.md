# VexLife StartUp Sequence

`[VXG RealForever]`

## Human outcome

A person should be able to begin from an understandable machine state and progress toward a real local Vex Conversation without needing to know VexLife's internal dependency graph.

The startup experience should answer, at every layer:

```text
what is already present?
what is missing?
why is this exact version/profile preferred?
what will VexLife do next?
does that action need human permission?
what proved this layer worked?
if it did not work, what failed and what is the next safe route?
```

This Project preserves the **known-working sequence as the origin**, then records the joints where incomplete or experimental branches leave that sequence and where they can rejoin it.

```text
BASELINE ORIGIN != IMMORTAL COMMIT
commit / PR = provenance
sequence + owners + predicates = reusable completion path
```

## Baseline origin

Current VexLife provenance at formation:

```text
PR #969
-> merge commit b55b7e7376c1e9886d850ab50b70c232750f6add
-> ordinary Open Vex baseline restored on main
```

Observed working path on Victor's current Mac:

```text
current exact VexLife source
-> current Vex Home
-> accepted Heretic 27B materialization/runtime
-> canonical Open Vex thread writer converged
-> Browser + Companion READY
-> canonical Conversation
-> explicit Victor Send
-> durable local Heretic response
```

The baseline is **not** a claim that every machine/Python version is already supported. It is the path future branches should preserve or deliberately qualify against.

## Sequence joints

| Joint | Current owner / meaning | Baseline truth | Branch when incomplete |
| --- | --- | --- | --- |
| **J0 Source** | `setup-vexlife.command` | resolves current `main` to one exact immutable SHA for the run | source resolution/download report |
| **J1 Bootstrap tools** | Mac setup | Node 20+ is checked; Homebrew can install Node when present | managed bootstrap-dependency acquisition |
| **J2 Vex Home** | `bootstrap.mjs` | fresh Home/device/Companion lineage can be formed | identity/topology failure report |
| **J3 Host qualification** | Heretic normal-start plan | current accepted host is macOS arm64, Apple M4 Pro, >=12 GiB | experimental host qualification |
| **J4 Bootstrap Python** | Heretic establishment | exact Python **3.14.7** is the proven bootstrap identity | install isolated proven Python or opt into version qualification |
| **J5 Heretic artifacts** | Artifact Delivery | accepted ~15 GiB bundle is downloaded and exact-size/SHA verified | download/artifact failure report + safe resume/reuse |
| **J6 MLX environment** | Heretic establishment | Home-local venv + `mlx-lm==0.32.0` | environment/wheel/version qualification |
| **J7 Runtime qualification** | persistent Heretic runtime owner | health + exact model + real completion before QUALIFIED | exact cleanup + runtime qualification report |
| **J8 Writer convergence** | Lived Companion owner via Mac lifecycle | IDLE continues; exact abandoned writer may recover; active/unknown holds | writer recovery/attention route |
| **J9 Browser / Companion** | Mac lifecycle + browser bridge | loopback service and Companion reach READY | browser/runtime binding report |
| **J10 Conversation currentness** | canonical Conversation + Interface Compound owner | projection admission re-observes currentness | exact currentness input report |
| **J11 Human Send** | Conversation/Lived send owner | explicit human action appends one durable request | typed send/recovery result |
| **J12 Local response** | Heretic + Lived Companion | real model response becomes durable Vex message | inference/capability/persistence report |

A branch should preserve the last proven joint and the exact unconsumed next joint rather than restarting the whole story.

## Dependency experience

The ordinary product should prefer:

```text
observe
-> explain
-> ask
-> acquire/qualify
-> verify
-> continue
```

not:

```text
missing prerequisite
-> opaque error
-> tell human to become the installer/debugger
```

### Example: exact Python missing

The current normal path is proven with **Python 3.14.7**. If the machine has no admitted bootstrap Python, a future setup surface should explain:

```text
VexLife needs Python 3.14.7 to create its isolated local MLX environment.
That exact version is preferred because the Python + mlx-lm 0.32.0 + Heretic 27B
combination has been qualified on the known-good path.

[Recommended] Install/provide isolated Python 3.14.7 for VexLife
[Experimental] Try qualifying the newer Python already on this Mac
[Cancel]
```

The recommended path should leave the user's existing Python untouched.

## Newer Python is a qualification question, not an automatic rejection

A newer Python **may** work. Current source does not claim that it does.

Before a newer version becomes supported, the qualification branch should prove at least:

```text
candidate Python identity observed
-> isolated venv creation succeeds
-> binary-only mlx-lm 0.32.0 installation succeeds
-> environment probe binds exact executable + prefix + versions
-> Heretic runtime starts
-> health + exact model identity pass
-> bounded real completion passes
-> failure cleanup is exact
-> successful result is retained as evidence
```

Until then:

```text
NEWER != BROKEN
NEWER != SUPPORTED
NEWER = UNVERIFIED_CANDIDATE
```

The safest normal experience remains installing/reusing the exact proven interpreter side-by-side.

## Hardware beyond the proven profile

Hardware should also be classified rather than collapsed into one word:

```text
PROVEN_PROFILE
  -> normal supported path

PLAUSIBLE_UNVERIFIED_PROFILE
  -> explain that it has not been qualified
  -> offer explicit experimental qualification when safe
  -> bounded effects + exact cleanup + report

KNOWN_INCOMPATIBLE
  -> explain the incompatible requirement
  -> no model/runtime effect

UNKNOWN
  -> observe only enough to classify
  -> no invented support claim
```

An experimental path does not become release support merely because one attempt succeeds. It creates evidence that can later justify a source-owned profile/support expansion.

## Layered support report

When a layer fails, the person should be able to receive one clearly named report rather than copy terminal archaeology.

The first report contract should carry only what support actually needs, for example:

```text
VexLife exact source SHA/tree identity
startup joint / stage
host platform / architecture / relevant hardware classification
observed dependency versions and dispositions
artifact/environment/runtime currentness
typed failure code + bounded failure message
cleanup disposition
last proven joint
exact next safe route
timestamp
```

Do **not** include by default:

```text
Conversation contents
raw prompts/responses
Memory contents
tokens/secrets
private credentials
unbounded filesystem listings
unnecessary private absolute paths
```

Initial delivery can be intentionally simple:

```text
Save report locally
-> human attaches it to support/email
```

A later explicit-consent upload/email route should be a separate transport concern, not authority hidden inside startup.

## Completion branches

### Immediate

- explainable startup progression and permission prompts;
- managed bootstrap dependencies, beginning with the exact Python gap;
- Python-version qualification branch;
- layered safe failure/support report.

### Dependent

- plausible-but-unproven hardware qualification;
- support-report delivery automation;
- genuinely clean supported Mac -> first local Vex Conversation acceptance.

## Adjacent but not owned here

The current local model can feel slow because the adopted read-only capability path may perform more than one inference phase for a simple turn. Visible work / reasoning presentation belongs to Interface Refinement after startup stability, but startup handoff must preserve the exact capability facts rather than denying them by assumption.

Current VexLife source explicitly recognizes a provider/model reasoning field:

```text
choices[0].message.reasoning_content
-> MODEL_EMITTED_REASONING_TRACE
-> rawState = EPHEMERAL
-> rawPersisted = false
-> humanProjection = SEALED_EXPLICIT_OPEN_ONLY
-> modelProjection = NONE
-> trainingProjection = NONE
```

Separately, capability-runtime progress frames currently carry:

```text
hiddenReasoningIncluded = false
```

That flag describes **those progress-event payloads only**. It is not evidence that the underlying model/provider has no reasoning channel.

Permanent investigation rule:

```text
PROGRESS_HAS_NO_REASONING != MODEL_REASONING_UNAVAILABLE

before denying capability:
  inspect exact model/runtime owner
  inspect exact live provider response
  distinguish PRESENT / ABSENT / UNKNOWN
  only then form the product claim
```

Current exact held predicate:

```text
Does the live Heretic turn emit non-empty reasoning_content?
= NOT YET OBSERVED
```

Do not replace that unknown with a denial, and do not invent a synthetic "reasoning" layer merely because runtime telemetry is already available. If live reasoning emission is confirmed, route its human projection through the rightful Interface / Conversation owner without conflating it with canned phase telemetry.

```text
STARTUP COMPLETION != REASONING-PROJECTION COMPLETION
RUNTIME PROGRESS != MODEL-EMITTED REASONING
SOURCE SUPPORT != LIVE EMISSION PROOF
```

Route adjacent post-start presentation work through `project.vexlife.interface-refinement`.

## Post-start completion handoff

Startup completion ends when the local Vex relationship is reliably available. It does not imply that every Companion capability or presentation refinement is complete.

The current post-start completion pressures discovered from the same lived baseline are:

```text
A. visible work + reasoning-channel currentness
   -> VexLife PR #970
   -> runtime progress is already visible and explicitly hiddenReasoningIncluded=false
   -> model-runtime-adapter separately recognizes reasoning_content as MODEL_EMITTED_REASONING_TRACE
   -> current humanProjection is SEALED_EXPLICIT_OPEN_ONLY
   -> live Heretic reasoning emission is still UNKNOWN until observed on an exact turn
   -> investigate provider/runtime truth before claiming capability absence
   -> do not substitute canned phase text or invented public reasoning for an uninvestigated model-emitted channel

B. online observation
   -> current capability.vexlife.online.observe is deliberately HELD
   -> current executor returns NO_SAFE_ONLINE_PROVIDER_BOUND
   -> bind one server-owned online provider
   -> keep provider credentials outside browser/model context
   -> return bounded source-bearing observations through the existing capability runtime

C. ordinary-turn latency
   -> current ADOPTED_READ_ONLY no-tool turn performs:
        request-formation inference
        + synthesis inference
   -> desired ordinary conversation = one inference
   -> actual capability use may still require later synthesis
   -> do not depend on unqualified MLX tool-call parsing merely to reduce inference count
```

These are not new startup owners. Route their implementation through the current VexLife Interface / Companion capability owners, with this Project retaining only the causal handoff from the proven startup baseline.

```text
STARTUP_READY
-> COMPANION_PERCEPTIBLE
-> CAPABILITY_AVAILABLE
-> ORDINARY_TURN_EFFICIENT
-> FINAL_COMPLETION_EXPERIENCE
```

The human experience target is:

```text
Victor sends
-> Vex sparkle visibly pulses
-> runtime phase/work trace is optionally inspectable
-> if the live model emits a reasoning trace and the human projection is admitted, show that distinct reasoning surface truthfully
-> if a capability is needed, the real admitted provider/tool runs
-> if no capability is needed, do not pay an unnecessary planning inference
-> final response streams and becomes the durable Conversation message
-> public work trace never becomes hidden prompt history
```

## Fresh-instance entry

```text
VexWork
-> project.vexlife.startup-sequence
-> work.vexlife.startup-sequence.outcome
-> baseline-origin = COMPLETED
-> choose the exact first incomplete joint
-> descend to VexLife source only for that joint
-> preserve the baseline path and rejoin it after the branch is qualified
```

Do not replay the PR #969 debugging history by default. It is provenance for why J8/J10 now behave as they do.

<!-- [VXG RealForever][VEXWORK][VEXLIFE-STARTUP-SEQUENCE] -->
