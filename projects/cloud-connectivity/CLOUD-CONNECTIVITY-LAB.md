# Cloud Connectivity Lab — contract workbench

`[VXG RealForever]`

## Human outcome

Provide a VexLife-facing engineering workbench for exploring, composing, validating and projecting
**accepted service-feature contracts** without requiring a real backend or treating the Lab itself as
the protocol owner.

This is not primarily a failure simulator and not a Postman clone.

The Lab is organized around:

```text
service
-> feature / operation
-> accepted contract
-> minimum lawful expression
-> richer / maximum lawful expression
-> exact outward request or lawful error expression
-> delivery / outward scope
-> validity
-> synthetic realization / later real realization
```

The same contract source should be readable by humans, AI, tests and the Lab UI.

## Core law

```text
LAB UI != CONTRACT OWNER
SESSION DRAFT != CONTRACT EVOLUTION
LAB FIELD != API FIELD BY INVENTION
VALID LOCAL EXPRESSION != AUTHORIZED REMOTE EFFECT
OUTWARD SCOPE != FEATURE PAYLOAD
```

A user may change values and include/omit already-admitted optional fields during one Lab session.

A new field, new enum member, changed range, changed conditional rule, changed request/error shape or
changed delivery scope is a **contract evolution**. It must be deliberately reviewed and reconciled
with the rightful API/domain owner and every required producer/consumer before the Lab exposes it as
valid.

For the current mobile/cloud circuit this normally means checking at least:

```text
canonical service/API contract
server ingress/domain consumer
Android producer/consumer
synthetic provider
compatibility/version policy
tests/evidence
Lab projection
```

The Lab must not make Android/server changes merely because a human typed a new field name.

## Contract source, not duplicated UI rules

The need is concrete: the Lab must know whether a field is free text, enum, bounded number, identifier,
array, conditional member, required member, versioned member or another exact contract form.

Do not solve this by hard-coding another independent copy of the protocol into HTML.

Prefer an existing standard contract representation where it can preserve the required truth, for
example:

```text
OpenAPI / JSON Schema
or
an existing code-owned schema that can be projected faithfully
```

Only add a Vex-specific contract schema if existing accepted contract sources cannot express a
required semantic distinction.

The Lab consumes a read-only contract projection such as:

```text
Service Feature Contract
    serviceRef
    featureRef
    contractRef / version
    request schema
    lawful error schemas
    field descriptions / semantic ownership
    delivery-scope schema when applicable
    compatibility metadata
```

The projection may add human/AI navigation metadata, but must not silently widen the underlying
protocol.

## Library / navigation model

The primary doorway is a service-feature library, not a collection of raw URLs:

```text
Cloud Connectivity Lab
|
+-- VexCloud
|    +-- Measurement Upload
|    +-- Conversation Append
|    +-- Global Announcement
|
+-- Log Service
|    +-- Bulk Log Upload
|
+-- VexStream Desktop
     +-- Catalog Refresh
     +-- Media Transfer
```

Selecting a feature opens its workbench.

The Lab should remain readable without menu archaeology:

```text
SERVICE / FEATURE
CONTRACT VERSION
QUESTION
MINIMUM VALID
MAXIMUM VALID
CURRENT DRAFT
REQUEST / ERROR EXPRESSION
DELIVERY SCOPE
VALIDITY
EVIDENCE / ARCHITECTURE
```

## Minimum-to-maximum valid range

For every selected feature, the Lab exposes the lawful range of representation complexity.

### Minimum valid

The smallest expression that preserves the operation's required meaning.

Example pressure:

```text
Global Announcement

minimum:
    announcementRef
    title
    body
    severity
```

### Richer / maximum valid

All currently admitted optional dimensions that may be meaningful for the selected contract version:

```text
announcementRef
title
body
severity
effectiveAt?
expiresAt?
acknowledgementRequired?
audience constraints?
compatibility/currentness coordinates?
```

"Maximum" means the richest expression admitted by the current contract. It does **not** mean every
field should normally be sent.

The user can start from minimum and add lawful fields, or start from maximum and remove optional
fields. Required fields cannot be removed.

## Field-control grammar

The field editor is generated from contract type/constraint metadata.

Examples:

```text
enum
-> select/dropdown of exact lawful members

boolean
-> bounded true/false control

bounded string
-> text/textarea + min/max length + live count

identifier/pattern
-> text input + exact pattern/format validation

integer/number
-> numeric control + min/max

array/list
-> bounded item editor + cardinality/item constraints

date/time
-> typed date/time control + explicit timing semantics

conditional field
-> appears/enables only when its contract predicate is satisfied

oneOf / variant
-> explicit variant selector with only the selected lawful branch visible
```

Permanent:

```text
ENUM != FREE TEXT
BOUNDED STRING != ARBITRARY STRING
OPTIONAL != ALWAYS LAWFUL
PARSEABLE != CONTRACT VALID
```

Clicking a field should explain:

```text
what it means
why it exists
who consumes it
whether it is required
its exact type
its valid values/range/pattern
its conditional rule
which contract/version owns the rule
whether it belongs to the minimum shape
```

The current field or whole current expression should be copyable as exact text for humans/AI.

## Request / outward-expression pager

The workbench has at least two conceptual faces:

```text
COMPOSE
    select lawful fields
    edit values
    inspect rules

OUTWARD EXPRESSION
    exact serialized request/error expression
    delivery/outward scope
    validity
    evidence
```

The second face is a projection of the first; it is not another mutable truth owner.

## Lawful error forms

A selected feature exposes only error forms admitted by its current contract.

For example, a feature might admit:

```text
ValidationError
Conflict
Unauthorized
RateLimited
ServiceUnavailable
```

Another feature may admit a different closed set.

The Lab may transform the current request context into an example of one selected lawful error form
for learning/testing, but it must not imply that every service shares one universal error schema.

Error forms should expose their own typed constraints:

```text
error kind
code enum
field ref when applicable
currentness/conflict coordinates when applicable
retry metadata when lawful
human-safe message
provider/internal evidence only when contract permits
```

Permanent:

```text
SERVICE ERROR != NETWORK ERROR
OPERATION ERROR != SERVICE UNAVAILABLE
HTTP STATUS != COMPLETE DOMAIN ERROR MEANING
```

## Delivery / outward scope

Feature payload and delivery scope remain separate contracts.

Example announcement pressure:

```text
Announcement payload
    title
    body
    severity
    ...

Delivery scope
    all eligible
    category
    exact device
```

The feature contract determines which outward scopes are lawful.

A mass announcement and an exact-device expression must not be distinguished by stuffing an
unstructured target string into the feature body.

Candidate projection:

```text
OutwardScope
    Broadcast / AllEligible
    Category(categoryRef)
    Device(deviceRef)
```

This vocabulary is **not accepted foundation yet**. The exact domain owner must pressure and own the
real scope vocabulary.

Permanent:

```text
OUTWARD_SCOPE != FEATURE_PAYLOAD
TARGET_SELECTION != AUTHORIZATION
VALID_TARGET_SHAPE != AUTHORIZED_SEND
```

## Validation gate

Before any synthetic or later real dispatch, validate:

```text
field presence
type constraints
enum membership
ranges / lengths
patterns
conditional rules
variant exclusivity
contract version
cross-field invariants
delivery-scope shape
compatibility
```

Then separately evaluate current effect authority/security when a real outward effect exists.

```text
SCHEMA_VALID
!= CURRENTLY_AUTHORIZED
!= SUCCESSFULLY_DELIVERED
```

For the first Lab, "send" should mean **dispatch to a selected synthetic realization** or stage the
exact expression for inspection.

Do not imply real device/cloud delivery until target-repository/provider authority and a real backend
exist.

## Session-local behavior

Until durable Lab storage is earned:

```text
session
    select feature
    select minimum/recommended/maximum valid shape
    edit values
    include/omit lawful optional fields
    select lawful error example
    select synthetic outward scope
    validate
    dispatch to synthetic realization
    inspect resulting observations
```

Refreshing/ending the session may discard the draft.

That is acceptable because the Lab is an engineering workbench, not canonical contract storage.

A future backend may persist:

```text
saved examples
named test cases
shared scenario fixtures
historical runs
team-reviewed contract candidates
```

but persistence is not required to prove the first circuit.

## Dynamic contract evolution

The Lab may help **propose** a field evolution, but proposal and accepted contract must remain distinct.

Possible future workflow:

```text
current contract
-> propose field / enum / rule change
-> compatibility analysis
-> affected Android/server/source surfaces
-> human/repository review
-> accepted contract change
-> producers/consumers updated
-> contract tests pass
-> Lab automatically projects the new accepted shape
```

Do not allow:

```text
type new field in Lab
-> immediately send it
-> Android/server silently expected to understand it
```

## AI-readable grammar

The same source that drives the UI should let an AI answer without clicking:

```text
Feature:
    Global Announcement

Contract:
    announcement/v2

Minimum valid:
    announcementRef
    title
    body
    severity

Field severity:
    type = enum
    allowed = [INFO, WARNING, CRITICAL]

Optional:
    acknowledgementRequired
    effectiveAt
    expiresAt

Lawful errors:
    ValidationError
    Unauthorized
    ServiceUnavailable

Lawful scopes:
    AllEligible
    Category
    Device
```

This makes the Lab a human projection over machine-readable contract truth rather than another
documentation island.

## Integration with the simulation circuit

The Lab owns composition/testing inputs, not cloud semantics.

```text
accepted Service Feature Contract
        |
        v
Cloud Connectivity Lab
    compose + validate
        |
        v
Synthetic outward scope / perturbation
        |
        v
real architecture boundaries
    Family / infrastructure operation
    VexMethod
    VexExecution
    NetworkConnectivityRelay
    ServiceConnectivityRelay
    candidate VexService
        |
        v
Synthetic API ingress / server
        |
        v
provider observation / lawful error
        |
        v
Family.observe / Relay reconciliation
        |
        v
Projection
        |
        +-> Lab result
        +-> VexBoard bounded architecture descent
        +-> Vex explanation
```

The Lab should be capable of selecting scenario conditions such as response loss, service outage or
compatibility failure, but those are **realization inputs around an accepted contract**, not the
primary organization of the product.

## Foundational acceptance criteria

The first Lab is sufficient when a human and AI can:

1. choose a service and feature from a library;
2. see the exact contract/version and owning question;
3. construct minimum and maximum lawful request shapes from one contract source;
4. inspect each field's exact type/constraints/consumer;
5. copy any field or current exact expression;
6. choose only lawful error forms for that feature;
7. choose only lawful delivery/outward scopes;
8. pass/fail a deterministic local contract validation;
9. dispatch the validated expression to a synthetic realization;
10. observe the resulting network/service/operation truth without scope collapse;
11. descend from the selected feature/run into a bounded VexBoard architecture/evidence projection;
12. propose but not silently admit protocol evolution.

If this is true, the interactive simulation circuit has a complete human/AI engineering doorway even
before durable Lab storage or a real cloud backend exists.

<!-- [VXG RealForever][CLOUD-CONNECTIVITY][LAB][CONTRACT-WORKBENCH] -->
