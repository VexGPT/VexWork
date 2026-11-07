# Cloud Connectivity

`[VXG RealForever]`

## Human outcome

Make mobile/cloud architecture **demonstrable through VexLife**, not a vocabulary exercise.

A human should be able to watch one operation travel across:

```text
VexLife-Android
-> local/offline state
-> network attempt
-> cloud API ingress
-> authentication + authorization boundary
-> domain service
-> durable cloud state / object storage
-> response / observation
-> Android reconciliation
```

then deliberately perturb the relationship and see why retries, idempotency, sync, API compatibility,
security, recovery and evidence exist.

Human label:

```text
Cloud Connectivity
```

## Scope

Cloud Connectivity owns the **demonstrator outcome and distributed-systems learning pressure** for:

```text
mobile/backend API contracts
data models and serialization
operation identity
transport attempts
offline-first / queued work
synchronization and currentness
retry / backoff / timeout ambiguity
idempotency / deduplication
conflict detection / resolution
multi-device convergence
API versioning / backward compatibility
service reachability / resilience
partial failure
large-object transfer / integrity
process restart / background continuation
observability / correlation / evidence
provider realization such as AWS
```

It does not become a generic cloud semantic owner.

## Relationship to Full Security

Full Security remains the owner of the reusable **security-question / security-demonstration pressure**.

Cloud Connectivity consumes those questions wherever a cloud boundary crosses:

```text
identity / authentication
authorization / capabilities
token and secret custody
sensitive data in transit / at rest
service identity
replay resistance
device/session revocation
key management
log/evidence privacy
build/release/update trust
```

Permanent:

```text
CLOUD_CONNECTIVITY != CLOUD_SECURITY_ONTOLOGY
FULL_SECURITY != DISTRIBUTED_SYSTEMS_CORRECTNESS

SECURE_REQUEST != CORRECT_SYNC
CORRECT_SYNC != AUTHORIZED_EFFECT
```

## Core architecture question

For every cloud-connected effect ask:

> What operation is the human/product trying to complete, who owns its meaning, which attempts carry it,
> what durable truth changes, and how do all participants learn the current outcome?

The central non-collapse is:

```text
OPERATION_IDENTITY != ATTEMPT_IDENTITY
```

Example:

```text
operation.sync-note.123
    attempt 1 -> timeout
    attempt 2 -> retry

The retry is not automatically a second domain operation.
```

## Current Vex anchors

The Project intends to use existing Vex systems as source-backed anchors:

```text
VexLife-Android
  mobile consumer
  local state / lifecycle
  current Connected Services security relationships
  real Android platform realization

VexLife / Home
  current principal/device/session/authority truth
  security/currentness owners where implicated

VexLife-Prod
  personal product shell
  canonical Conversation + Vex
  compiler-visible AppSelector
  future Cloud Connectivity app surface

VexStream Music
  real reconnect, bounded transport, data-integrity and offline-copy examples

Full Security
  security-boundary / device / session / revocation examples

VexBoard
  read-only architecture and scenario projection

Vex
  later explanation of admitted current scenario/context
```

## Reusable connectivity architecture

The current architecture pressure has separated three scopes that must remain independently true:

```text
DEVICE NETWORK
    NetworkConnectivityRelay

SERVICE RELATIONSHIP
    candidate VexService
    + per-service ServiceConnectivityRelay

OPERATION
    rightful VexFamily
    -> act(...)
    -> admitted semantic State + Begin
    -> bound Family.Act.Method
    -> VexExecution
    -> service/API realization
```

The detailed map, automation grammar, VexLogger upload example, announcement example and VexBoard
projection rules live in:

```text
projects/cloud-connectivity/VEXSERVICE-CONNECTIVITY-AND-AUTOMATION.md
```

Cloud Connectivity uses the accepted stable `VexFamily.act(...) -> admit(State, Begin)` ownership law
as the design baseline. VexStream and Maps remain valuable pressure/evidence, but Cloud Connectivity
does not copy the parallel chained relationship-builder form as its semantic foundation.

Permanent:

```text
DEVICE_NETWORK != SERVICE_CONNECTIVITY
SERVICE_CONNECTIVITY != OPERATION_OUTCOME
ONE_OPERATION_FAILURE != SHARED_SERVICE_FAILURE
ONE_SERVICE_FAILURE != DEVICE_NETWORK_FAILURE

SERVICE != FAMILY BY DEFAULT
AUTOMATION_OBSERVATION != CONTROL BY DEFAULT
RELAY MAY REQUEST A FAMILY CONTROL
RELAY MUST NOT ADMIT ANOTHER FAMILY'S STATE
```

## Provider-neutral first

The architecture must not be named after AWS.

Use provider-neutral relationships first:

```text
Identity Provider
API Ingress
Domain Service
Structured Durable Store
Object Store
Key Management
Observability
```

Then an AWS teaching realization may map examples such as:

```text
Identity Provider       -> Cognito
API Ingress             -> API Gateway
Structured Durable Store-> DynamoDB
Object Store            -> S3
Key Management          -> KMS
```

That mapping is an educational realization, not a claim about a current Vex or employer architecture.

## Product doorway

Current VexLife-Prod already has:

```text
VexLifeWorkspaceBlueprint.AppSelector
-> VexLifeWebP1.AppSelector
-> retained Browser-only selector
```

The retained exploration currently forces any selector change back to Browser.

Cloud Connectivity should pressure the same missing selected-application relationship as Full Security:

```text
AppSelector
-> selected workspace application
   Browser
   Full Security
   Cloud Connectivity
```

Do not implement this as DOM visibility alone. The current app selection owner/relationship must first
be grounded or earned.

## Educational experience

The primary surface should behave like a real connected-system product/diagnostic surface.

Teaching is contextual:

```text
(i)
Why?
Show operation
Show attempts
Show reconciliation
Show architecture
Ask Vex
exact source/evidence
```

Do not permanently flood the interface with tutorial prose.

## Completion direction

```text
full demonstration checklist
-> provider-neutral system topology
-> deterministic synthetic cloud
-> VexLife-Android operation/sync consumer
-> VexLife-Prod selected-app surface
-> failure + version + multi-device scenarios
-> Full Security boundary integration
-> optional AWS realization
-> VexBoard projection
-> Vex-guided explanation
-> lived Android/host/cloud proof when exact effect authority is earned
```

## Formation boundary

This Project formation does not itself authorize:

- VexLife-Android source mutation;
- VexLife-Prod source mutation;
- public network exposure;
- creation of real cloud infrastructure;
- AWS account/resource mutation;
- storage of real credentials;
- live account/device mutation;
- production data upload;
- security testing against external systems.

Target-repository and provider effects remain separately source/authority bound.

<!-- [VXG RealForever][CLOUD-CONNECTIVITY][PROJECT] -->
