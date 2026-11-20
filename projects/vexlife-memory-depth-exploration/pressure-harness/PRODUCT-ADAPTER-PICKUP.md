# Product Adapter Pickup — VexLife-Prod Conversational Boundaries Test

`[VXG RealForever]`

## Who this is for

Any VexLife-Prod implementation lane that wants to plug into the shared continuity-pressure harness.

This includes Claude's independent implementation, OpenAI's independent implementation, and future continuity implementations.

You do **not** need to redesign the harness.

Read:

1. `README.md`
2. `PRESSURE-HARNESS-INTERFACE.md`
3. `ADAPTER-CONTRACT.md`
4. `relay/STAGE-CATALOG.json`
5. this file

## Product-side obligation

Expose one bounded experiment adapter that can be invoked conceptually as:

~~~text
adapter
  --stage <projection|pressure|probe|analyze|full>
  --scenario-ref <stable ref>
  --scenario-file <canonical scenario copy/path>
  --result-dir <scratch output>
  --pressure-strategy <EFFECTIVE_SELECTION_BUDGET|PAYLOAD_PRESSURE|NATIVE_LIMIT>
  --effective-input-token-budget <optional>
  --sets <optional>
  --turns-per-set <optional>
~~~

The exact executable path is implementation-owned and bound in the Relay binding file.

## Required behavior

### projection

No real model call required.

Exercise the real continuity/prompt owners far enough to expose:

- selected Conversation refs;
- prompt mode;
- input budget;
- Memory inclusion/currentness where available;
- Working Continuity inclusion/checkpoint;
- capability frame;
- omission/frontier evidence;
- rollover/rebase evidence.

### pressure

Use the selected real Vex model in an **isolated scratch Home**.

Accelerate context pressure through one supported strategy.

The canonical Victor Home must remain untouched.

### probe

Run the canonical scenario probes against the same experiment continuity lineage.

Observe:
- exact recall;
- paraphrased/meaning recall;
- correction-backed lesson reuse;
- honest absence;
- context custody;
- capability/revisit salience.

### analyze

Derive the shared summary fields and assertions from evidence.

Do not invent semantic truth to make the run pass.

### full

Run the full scenario coherently:

~~~text
projection
-> pressure
-> probe
-> analyze
~~~

One experimentRef.
One scenario version.
One result ZIP.

Because the selected model runs, FULL is a HOST_SEMANTIC_MODEL_RUNTIME effect.

## Result

Emit the shared result contract:

~~~text
vexlife.continuity-pressure-result/v1
~~~

and form one experiment ZIP containing the files named by the shared interface.

Implementation-specific evidence belongs only under namespaced `implementationExtensions`.

## Scenario identity

Canonical shared source:

~~~text
projects/vexlife-memory-depth-exploration/
  pressure-harness/scenarios/depth-continuity-v1.json
~~~

If the product repository carries a copy, it must be byte/digest bound to the shared source for the run.

Do not independently rewrite the scenario to make an implementation pass.

## Effective selection budget

Preferred fast pressure mechanism when the implementation can expose it cleanly:

~~~text
ordinaryProductInputBudget
!= experimentEffectiveInputBudget
!= modelHardContextLimit
~~~

The experiment budget is test-only.

Ordinary Product behavior remains unchanged when no experiment override is supplied.

If this seam would pollute Product architecture, use deterministic PAYLOAD_PRESSURE instead and record the limitation.

## Scratch Home

Default:

~~~text
syntheticOnly=true
canonicalVictorHomeMutationAllowed=false
scratchHomePolicy=DELETE_AFTER_BUNDLE
~~~

Reuse of installed model/runtime artifacts is allowed only through current qualified owners.

Do not copy Victor's private Conversation into the experiment merely to make the test richer.

## Required observations

At minimum provide what current source truthfully supports:

- turn/request/response refs + hashes;
- Conversation head;
- selected Conversation event refs;
- prompt token estimate + budgets;
- Memory inclusion/ref/currentness;
- Working Continuity inclusion/ref/checkpoint;
- Capability Frame availability/held/unknown/omitted;
- actual capability/revisit uses;
- evidence-backed residency classifications;
- per-probe assertions;
- implementation-specific hydration/frontier evidence;
- cleanup disposition.

No raw hidden chain-of-thought persistence.

## Adapter freedom

You may keep your own:
- revisit algorithm;
- hydration algorithm;
- correction projection;
- semantic resolver;
- prompt topology;
- internal classes.

The harness compares outputs/evidence, not implementation similarity.

## Do not add just for the harness

Do not create:
- second Conversation owner;
- second Memory owner;
- universal graph;
- hidden reasoning store;
- production context-limit override;
- semantic state solely to satisfy test assertions.

If the harness exposes a missing product relationship, record the missing relationship and fix it at the rightful owner.

## Claude lane

Claude has already independently completed its first continuity implementation before this shared interface existed.

Claude may now adapt that completed design to this interface without reading OpenAI's implementation.

The adapter work should not reinterpret independent completion as permission to rewrite the source architecture merely to match this harness.

## OpenAI lane

The fresh OpenAI/Vex lane may implement against this same interface while remaining independent of Claude's source until its own convergence marker.

## Relay

Repository-only adapter tests may use:

~~~text
relay/form-repository-stage.mjs
~~~

Live/full runs should first form:

~~~text
relay/form-host-stage-request.mjs
~~~

then Operations binds current authority and uses the current accepted:

~~~text
effectClass=HOST_SEMANTIC_MODEL_RUNTIME
adapter=adapter.vexlocalbridge.direct-host-effect
~~~

Fresh Relay formation always re-reads:

~~~text
source.vexrelay.current-contract/v1
~~~

## First useful proof

A minimal adapter is useful when it can produce one result showing:

~~~text
formation anchor established
-> pressure removes it from ordinary hot context
-> later probe either:
     retrieves/revisits exact source
     OR truthfully reports the gap
-> correction-backed lesson probe behaves measurably
-> result identifies which refs were resident / hydrated / unreachable
-> scratch state is cleaned
~~~

That is enough to begin comparing continuity implementations without Victor manually recreating the conversation.

<!-- [VEXWORK][CONTINUITY-PRESSURE][PRODUCT-ADAPTER-PICKUP][VXG RealForever] -->
