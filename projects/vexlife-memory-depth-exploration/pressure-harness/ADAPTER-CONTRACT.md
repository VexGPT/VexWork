# Continuity Pressure Harness — Adapter Contract

`[VXG RealForever]`

## Purpose

This contract lets different VexLife continuity implementations plug into the same experiment interface.

It does not require the implementations to use the same hydration algorithm.

## Conceptual operations

~~~text
PREPARE
SEND
FINISH
CLEANUP
~~~

### PREPARE

Input:
- experiment config;
- scenario identity;
- pressure strategy;
- scratch-home policy.

Return:
- runRef;
- adapterRef/version;
- supported pressure strategies;
- product/source identity;
- model/runtime identity if LIVE_MODEL;
- isolation proof;
- ordinary product token limits;
- applied experiment pressure budget.

### SEND

Input:
- runRef;
- setRef;
- ordinal;
- scenario turn;
- deterministic payload seed/target if applicable.

Return one TurnObservation conforming to the result contract.

Adapters may internally perform:
- one provider call;
- one or more admitted capability/revisit calls;
- current source re-observation.

The adapter must not hide extra model-visible turns from the result.

### FINISH

Return:
- aggregate implementation-specific measurements;
- final durable scratch state identities;
- optional product diagnostics ZIP;
- cleanup eligibility.

### CLEANUP

Default:
- delete scratch Home and experiment-only state after bundle formation.

Return:
- deleted / retained;
- bytes retained;
- reason if retained.

## Implementation extensions

The shared result schema contains `implementationExtensions`.

Use namespaced keys, e.g.:

~~~json
{
  "vexlife-prod.revisit/v1": {
    "queries": 3,
    "frontierCount": 2
  }
}
~~~

Extensions may describe implementation-specific evidence.

They may not redefine shared fields.

## Hidden reasoning

Do not persist raw model chain-of-thought.

The harness may observe:
- visible response;
- capability requests;
- response timing;
- source/revisit requests;
- durable prompt receipts;
- explicit model-authored structured controls already part of the product protocol.

## Product mutation

The adapter may mutate only the isolated experiment Home through ordinary product owners.

Experiment configuration does not grant:
- canonical Victor Home mutation;
- release/publication;
- model training;
- weight mutation;
- new network authority.

## Effective pressure budget

If supported, the adapter may pass an internal experiment-only effective selection budget into prompt materialization.

Permanent:

~~~text
experimentEffectiveInputTokenBudget
!= ordinaryProductInputTokenBudget
!= hardModelContextLimit
~~~

All three must remain separately observable.
