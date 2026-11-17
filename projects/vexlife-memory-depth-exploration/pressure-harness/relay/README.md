# Continuity Pressure Harness — Relay entry

`[VXG RealForever]`

## Current contract

Before forming a fresh run, bind the accepted SDK current contract:

~~~text
docs/private-continuity/vexrelay/current-contract.json
contractRef=source.vexrelay.current-contract/v1
taskSchema=vex.relay.task/v2
~~~

The current SDK owns validation, task packaging, timestamps, carrier formation, execution and canonical RETURN mechanics.

This directory owns only the harness stage semantics and shared experiment interface.

## Stage selection

~~~bash
node plan-stages.mjs --mode full
node plan-stages.mjs --mode quick
node plan-stages.mjs --mode projection
~~~

Human aliases are resolved from `../index.json`.

## Repository stages

`projection` and `analyze` are repository-local evidence work.

Use:

~~~text
effectClass = REPOSITORY_OPERATIONS
route       = adapter.vexrelay.repository/v2
taskSchema  = vex.relay.task/v2
~~~

The helper `form-repository-stage.mjs` forms and validates the inner VexRelay task using the SDK's own source.

It does not create authority.

It requires an exact binding file naming:
- current product repository/head/tree;
- exact branch;
- workspace;
- lane/role refs;
- current authority refs/effects;
- allowed command;
- product adapter command/args;
- canonical scenario digest.

## Live stages

`pressure`, `probe`, and `full` invoke the selected local model.

Use:

~~~text
effectClass = HOST_SEMANTIC_MODEL_RUNTIME
route       = adapter.vexlocalbridge.direct-host-effect
~~~

Do not hide a live-model run inside a repository-only task merely because it starts from repository source.

`form-host-stage-request.mjs` forms the source-bound semantic request descriptor for Operations/LocalBridge to carry through the current direct-host-effect adapter.

## Product adapter membrane

Each implementation may use different internals, but it should expose one harness adapter command contract.

Conceptual CLI:

~~~text
<adapter command>
  --stage <projection|pressure|probe|analyze|full>
  --scenario-ref <scenario ref>
  --scenario-file <exact canonical/copy path>
  --result-dir <scratch result dir>
  --pressure-strategy <EFFECTIVE_SELECTION_BUDGET|PAYLOAD_PRESSURE|NATIVE_LIMIT>
  --effective-input-token-budget <optional integer>
  --sets <optional integer>
  --turns-per-set <optional integer>
~~~

The binding file supplies the exact executable/args for the implementation.

The shared harness does not require Claude/OpenAI to implement the same code path.

## Full mode

`full` is one semantic experiment:

~~~text
projection
-> live pressure
-> probes
-> deterministic analysis
-> one experiment result ZIP
~~~

Because a model runtime is used, the route is `HOST_SEMANTIC_MODEL_RUNTIME`.

The deterministic sub-stages remain separately callable for cheap regression.

## Returned evidence

The product adapter should form the experiment ZIP described by the shared interface.

The outer Relay/LocalBridge return should retain or source-bind that ZIP so Operations can consume one returned artifact without asking Victor to interpret logs.

Exact carriage shape remains owned by the current SDK/Operations contract.

## Do not rebuild

If a future worker wants to "stress memory", "test the context window", "test rollover", or "run the memory test":

~~~text
read ../README.md
-> resolve stage/mode here
-> reuse canonical scenario
-> bridge implementation adapter
-> use current Relay route
~~~

Do not invent a new scenario/test harness first.
