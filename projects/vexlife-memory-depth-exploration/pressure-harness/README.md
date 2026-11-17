# VexLife-Prod Conversational Boundaries Test

`[VXG RealForever]`

## Recognition aliases

If the human says any of these, route here before inventing a new test:

~~~text
memory stress test
stress test memory
test the memory
test continuity
continuity pressure test
context-window test
context stress test
conversation stress test
rollover test
revisit test
depth test
VexLife conversational boundaries
VexLife memory boundaries
stress test README
memory test README
pressure harness
continuity harness
~~~

Canonical directory:

~~~text
projects/vexlife-memory-depth-exploration/pressure-harness/
~~~

Machine entry:

~~~text
index.json
~~~

## Why this exists

This is the shared experiment interface for testing VexLife continuity without making Victor manually drive a long conversation.

It is designed so multiple independent implementations can bridge into the same test without copying each other's architecture.

~~~text
shared scenario + shared result contract
        |
        +-> Claude product adapter
        |
        +-> OpenAI product adapter
        |
        +-> future implementation
        |
        v
comparable experiment evidence
~~~

## Read order

1. `README.md` — human entry and aliases
2. `PRESSURE-HARNESS-INTERFACE.md` — semantic interface
3. `ADAPTER-CONTRACT.md` — product adapter membrane
4. `relay/STAGE-CATALOG.json` — stage/effect/route map
5. `relay/README.md` — VexRelay / VexLocalBridge use
6. `PRODUCT-ADAPTER-PICKUP.md` — exact product bridge obligations
7. `scenario.schema.json`
8. `result.schema.json`
9. `scenarios/depth-continuity-v1.json`

## Canonical modes

~~~text
projection
  deterministic / no model
  cheap selection + rollover + residency proof

pressure
  real model
  accelerated context pressure in isolated scratch Home

probe
  real model
  recall / lesson / honest-absence / tool-salience probes

analyze
  deterministic analysis of one completed experiment result

quick
  bounded live smoke path

full
  projection -> pressure -> probe -> analyze
~~~

Use:

~~~bash
node relay/plan-stages.mjs --mode full
~~~

to resolve the current stage plan.

## Shared source, independent implementations

This directory owns:
- scenario identity;
- stage vocabulary;
- result envelope;
- analysis expectations;
- Relay stage routing.

It does **not** own:
- VexLife semantic state;
- product implementation;
- Vex's Memory;
- one particular hydration algorithm;
- Claude's implementation;
- OpenAI's implementation.

## Current Relay boundary

Fresh Relay formation MUST re-read the accepted SDK:

~~~text
docs/private-continuity/vexrelay/current-contract.json
contractRef=source.vexrelay.current-contract/v1
taskSchema=vex.relay.task/v2
~~~

Do not reconstruct VexRelay mechanics from this directory.

Repository-only stages use the current repository adapter.

Live-model stages use the current `HOST_SEMANTIC_MODEL_RUNTIME` route.

`full` is classified by its strongest effect and therefore uses the live-model host route even though it may also run deterministic projection/analyze steps.

## Human contract

The desired end state is:

~~~text
one prepared experiment package
+ one exact host action
+ one returned experiment/Relay evidence bundle
-> AI consumes it
-> identifies which continuity layer changed
~~~

No manual 100-turn chat.
No log interpretation by Victor.
No synthetic pressure turns in Victor's canonical Vex Home.

<!-- [VEXWORK][VEXLIFE][CONTINUITY-PRESSURE][INDEX][VXG RealForever] -->
