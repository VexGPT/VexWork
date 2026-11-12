# Cloud Connectivity — VexService, connectivity and automation architecture

`[VXG RealForever]`

## Purpose

Record the reusable architecture pressure discovered while designing Cloud Connectivity without turning
every API, background task, retry, or service into another Family.

The central decomposition is:

```text
DEVICE RELATIONSHIP
    "what network relationship does this device currently have?"

SERVICE RELATIONSHIP
    "what relationship do we currently have to this exact intended service?"

OPERATION RELATIONSHIP
    "what does this exact Family-owned operation mean, and what happened when one realization was attempted?"
```

These scopes may change independently and must not collapse.

Permanent:

```text
DEVICE_NETWORK != SERVICE_CONNECTIVITY
SERVICE_CONNECTIVITY != OPERATION_OUTCOME
ONE_OPERATION_FAILURE != SHARED_NETWORK_FAILURE
ONE_SERVICE_FAILURE != ALL_SERVICES_FAILURE
```

## VexArchitecture baseline

Cloud Connectivity design uses the accepted stable `VexFamily` semantic grammar as its baseline:

```text
Control + exact CURRENT State
-> Family.act(...)
-> accepted Act
   -> admitted semantic State?
   -> Begin?
      -> Effect
      -> VexExecution.Approach
```

The Family owns the exact admitted semantic State value.

Outside/provider truth returns only after the rightful provider/repository/connection owner has
interpreted it into already-semantic truth:

```text
outside fact
-> rightful interpretation / currentness gate
-> Family.observe(already-semantic State)
```

Cloud Connectivity does **not** use the parallel chained relationship-builder form as the design
baseline. Existing VexStream/Maps source remains valuable pressure/evidence for requirements such as
pending-intent reconciliation, provider observation and convergence, but new Cloud Connectivity
architecture should preserve the stable `VexFamily.act(...) -> admit(State, Begin)` ownership law.

Permanent:

```text
ADMITTED_STATE = FAMILY SEMANTIC TRUTH
ADMITTED_STATE != FINAL PROVIDER OUTCOME
EFFECT_REQUESTED != EFFECT_COMPLETED
PROVIDER_OBSERVATION != FAMILY_STATE UNTIL RIGHTFULLY INTERPRETED
```

## 1. Device-level NetworkConnectivityRelay

A candidate reusable `NetworkConnectivityRelay` answers only:

> What is the current device/network relationship relevant to connected work?

It does not own feature semantics, service-specific failures, sessions, authorization, or API
operation outcomes.

Candidate relationship vocabulary, deliberately not frozen to exact Kotlin spelling:

```text
NetworkConnectivity
    Unobserved

    Available
        current network relationship is usable

    Unavailable
        current network relationship is not usable
        + typed current condition when independently known
```

Inputs may include independently owned observations such as:

```text
platform network observation
validated route observation
network transport availability
```

Output is Relay-owned relationship truth:

```text
independent observations
-> NetworkConnectivityRelay.processStates(...)
-> current NetworkConnectivity relationship
```

No Family `act(...)` is involved merely because connectivity changed.

Many consumers may observe the same device-level relationship:

```text
NetworkConnectivityRelay
        |
        +-> VexCloud service
        +-> VexStream Desktop service
        +-> Home/private service
        +-> other service relationships
```

## 2. Candidate graduated VexService component

Repeated consumers expose a second reusable question:

> What exact external service relationship does this process/session currently have available for
> Family-owned or infrastructure-owned operations?

This may justify graduating a reusable `VexService` component analogous in posture to
`VexExecution`: reusable infrastructure with a narrow responsibility, not a semantic super-owner.

Candidate meaning:

```text
VexService
= one identified long-lived external-service relationship boundary
```

A VexService may compose or expose:

```text
stable service identity
service-specific route/currentness observation
NetworkConnectivityRelay input
ServiceConnectivityRelay
protocol/API realization dependencies
provider observations
service-local automation inputs where earned
process/session lifetime integration
```

It must not become:

```text
VexService != VexFamily
VexService != VexExecution
VexService != VexLogger
VexService != principal/session/capability authority
VexService != universal API client
VexService != universal retry manager
VexService != global application state bag
```

### Graduation threshold

Do not add foundation code merely because the abstraction is attractive.

Pressure at least representative distinct consumers such as:

```text
Home/private service
VexStream Desktop
Synthetic Cloud / later remote cloud realization
```

If they repeatedly require the same service identity + connectivity/currentness + lifetime
relationship, extract the smallest common `VexService` contract.

## 2A. Current VexLife Home as the first host substrate

Current VexLife already demonstrates a useful product/lifecycle truth:

```text
ONE HUMAN FRONT DOOR
!= ONE PROCESS
```

The current Mac route converges owned processes beneath one lifecycle entry:

```text
human setup/start
-> VexLife lifecycle owner
   -> establish/reuse Heretic runtime
      numeric loopback :8765
   -> establish/reuse VexLife browser/API process
      numeric loopback :18110
   -> wait for Companion readiness
   -> open the human interface
```

The human should not have to maintain parallel terminals merely because the product uses multiple
processes.

Current VexLife also already defines Vex Home as the durable hosting/custody boundary for hosted
capabilities:

```text
Vex Home
    core identity / lifecycle / recovery
    hosted capabilities
        Conversation
        Maps
        Stream
        future capabilities...
```

with the permanent distinction:

```text
CAPABILITY_CONTRACT != DEPLOYMENT_TOPOLOGY
```

Cloud Connectivity should consume that existing placement law rather than invent a separate synthetic
"cloud host" product.

### First realization

The first synthetic Cloud Connectivity server may live as a bounded hosted-capability module behind
the existing VexLife HTTP/server process:

```text
VexLife browser/API process
    existing UI / Companion routes
    +
    CloudConnectivityHostedCapability
        contract ingress
        synthetic domain owner
        synthetic durable state
        perturbation/fault realization
```

The browser/server process is transport/lifetime composition only:

```text
HTTP ROUTE != CLOUD DOMAIN OWNER
SERVE_BROWSER != CLOUD CONNECTIVITY SEMANTIC OWNER
```

### Deployment evolution

If later resource/lifetime/failure pressure earns a separate process, keep the same capability
contract:

```text
Stage 1
    same VexLife process
    + module boundary

Stage 2
    sibling Vex Home service process

Stage 3
    another owned host / self-hosted cloud / managed cloud realization
```

Moving between those stages must not require Android/Lab product semantics to change merely because
deployment topology changed.

Permanent:

```text
NEW CAPABILITY != NEW HUMAN-MANAGED TERMINAL
IN_PROCESS != SEMANTICALLY LOCAL-ONLY
SIBLING_PROCESS != NEW PRODUCT MEANING
REMOTE_HOST != NEW CAPABILITY CONTRACT BY DEFINITION
```

Current VexLife source anchors:

```text
repo.vexlife:README.md
repo.vexlife:docs/VEXHOME-HOSTED-CAPABILITIES.md
repo.vexlife:scripts/macos-lifecycle.mjs
repo.vexlife:scripts/serve-browser.mjs
```

## 3. Per-service ServiceConnectivityRelay

Each service relationship remains independently scoped:

```text
NetworkConnectivityRelay
        |
        +-> ServiceConnectivityRelay(service.home)
        +-> ServiceConnectivityRelay(service.vexstream.desktop)
        +-> ServiceConnectivityRelay(service.cloud.synthetic)
```

Candidate state shape, again semantic pressure rather than frozen syntax:

```text
ServiceConnectivity(serviceRef)
    Unobserved

    Available
        exact intended service identity/current route established

    Unavailable
        exact service relationship is not currently usable
        + typed service-level condition when independently known
```

A service may be unavailable while the device network remains available:

```text
NetworkConnectivity = Available

ServiceConnectivity(VexCloud) = Available
ServiceConnectivity(VexStreamDesktop) = Unavailable
```

Likewise one failed request does not automatically mutate service availability:

```text
HTTP/server validation failure for operation M1
!= VexCloud unavailable
```

Only the rightful service observer may promote repeated/request evidence into a broader current
service condition when it can truthfully support that conclusion.

## 4. Operation-level Family + Method

Product meaning remains with the exact Family.

Stable path:

```text
Family CURRENT State
+ Control
-> Family.act(...)
-> admitted semantic State?
+ Begin(Effect, Approach)
-> bind exact Family.Act.Method
-> VexExecution custody
-> Method invokes exact service/protocol realization
-> VexMethod.Result
-> rightful interpretation
-> Family.observe(...) when product semantic truth changes
```

`VexMethod` already supplies the reusable one-attempt terminal contract:

```text
Success(output)
Failure(output)
Error(cause)
```

Do not recreate:

```text
FooApiResult
FooNetworkResult
FooServiceCallResult
FooRequestExecutor
```

when `VexMethod` / `VexExecution` already answer those reusable questions.

### Operation identity versus attempt occurrence

A durable operation identity is earned when retry/restart/server deduplication must recognize the same
human/product operation across attempts.

Attempt occurrence does not automatically earn another public/durable ID.

Prefer first:

```text
rightful operation identity
+ active Job while running
+ VexLogger chronology after observation
```

Only add an occurrence/attempt identifier if simultaneous/cross-process evidence proves those cannot
answer the required question.

Permanent:

```text
OPERATION_IDENTITY != ATTEMPT_OCCURRENCE
RETRY != NEW DOMAIN OPERATION
ATTEMPT_OBSERVABILITY != AUTOMATIC ATTEMPT_ID
```

## 5. Simultaneous Family/service isolation

One shared network relationship may serve many service and operation relationships simultaneously:

```text
NetworkConnectivity = Available

VexCloud = Available
    Measurement operation M1 = Failure(ValidationRejected)
    Conversation operation C1 = Success(Appended)

VexStream Desktop = Unavailable
    Media refresh cannot currently proceed
```

All are truthful at once.

Failures stay attached to the narrowest rightful relationship:

```text
device lost network
-> device/network relationship

service identity/route unavailable
-> service relationship

server rejects exact request
-> operation/Method result

device/session revoked
-> Full Security authority relationship
```

Do not widen a narrow failure merely because several layers can observe it.

## 6. Families consume Service truth without making Service a Family

A Service can be long-lived and observable without being a Family.

Typical round trip:

```text
Family Effect
-> Family.Act.Method(service = exact VexService dependency)
-> VexExecution
-> service/API realization
-> server/provider
-> validated provider/repository observation
-> rightful semantic interpretation
-> Family.observe(State)
-> Family Projection
-> UI
```

The UI should normally consume Family/relationship projections, not raw HTTP/service responses.

Permanent:

```text
JSON != FAMILY STATE
HTTP RESPONSE != PRODUCT TRUTH
SERVICE OBSERVATION != FAMILY STATE UNTIL INTERPRETED
```

## 7. Background automation

A long-lived service may perform autonomous work without a human Family Control.

Sources may include:

```text
OS scheduling observation
timer/window due
NetworkConnectivity state
ServiceConnectivity state
pending durable data
power/background eligibility
security/currentness truth where required
```

These may converge into an automation decision:

```text
schedule/window due -------\
network current ------------\
service current -------------+-> Background/Service convergence
pending durable work --------/
OS eligibility -------------/
                                   |
                                   v
                         work is currently eligible
```

A timer firing is an observation, not automatically a semantic Control:

```text
TIMER_FIRED != CONTROL
AUTOMATION_CONDITION_SATISFIED MAY REQUEST A LAWFUL CONTROL
```

### When product semantics exist

If synchronization itself has meaningful State/Controls, automation and humans should use the same
Family doorway:

```text
hidden Debug "Upload now" -----\
periodic policy says due -------+-> Control.UploadNow
                                  -> SyncFamily.act(...)
                                  -> admitted State + Begin(Effect)
```

No second hidden upload semantics.

### When no Family is earned

Pure infrastructure work may remain:

```text
durable telemetry/log source
+ automation convergence
-> VexMethod
-> VexExecution
-> VexService
-> provider
```

Do not manufacture a Family merely for symmetry.

### Android lifetime boundary

`VexApplication` may compose process-lifetime dependencies and observers.

It must not pretend an in-process coroutine survives process death. Work required to occur after
process death belongs to the rightful OS background scheduling realization, which re-enters the same
architecture through observations/controls/methods rather than creating a second semantic path.

## 8. Example A — VexLogger bulk upload

Current stable ownership stays:

```text
VexLogger
    chronological facts
        |
        v
durable LogHistory projection/source
        |
        v
Log upload synchronization
        |
        v
remote log service/database
```

Permanent:

```text
VEXLOGGER != LOG_SYNC
LOCAL_LOG_HISTORY != REMOTE_LOG_DATABASE
LOG_UPLOAD_SUCCESS != LOGGER_SUCCESS
```

A candidate implementation may compose:

```text
LogHistory durable pending records
NetworkConnectivity
Log ServiceConnectivity
schedule/OS background eligibility
        |
        v
LogUpload convergence / policy
        |
        +-> infrastructure upload directly when no product semantics are needed
        |
        +-> OR Control.UploadNow on a LogSyncFamily if human/product sync meaning is earned
```

A hidden/internal Debug surface or long-press may request the same `Control.UploadNow` used by
automation. The debug affordance is not a second upload implementation.

## 9. Example B — global announcements

A service may poll independently:

```text
Announcement VexService
+ periodic/OS scheduling
+ NetworkConnectivity
+ ServiceConnectivity
        |
        v
fetch announcements
        |
        v
validated provider/repository observation
```

Product meaning may then belong to an Announcement Family:

```text
provider announcement observation
-> semantic interpretation
-> AnnouncementFamily.observe(
       None
       or Unacknowledged(...)
       or Acknowledged(...)
   )
-> Projection
-> UI
```

The Service does not decide presentation.

Notification behavior is another relationship question:

```text
Announcement semantic truth --------\
notification permission -------------\
visible foreground surface -----------+-> Notification attention/convergence
user notification preference --------/
                                        |
                                        v
                              notify now / do not notify
```

Permanent:

```text
ANNOUNCEMENT_EXISTS != NOTIFICATION_SHOULD_FIRE
SERVICE_FETCH != UI SEMANTIC STATE
```

## 10. Reusable map

```text
VexApplication / process composition
|
+-- NetworkConnectivityRelay
|
+-- VexService(service A)
|    +-- ServiceConnectivityRelay(A)
|    +-- protocol/provider realization
|    +-- service-local observers / automation inputs when earned
|
+-- VexService(service B)
|    +-- ServiceConnectivityRelay(B)
|    +-- protocol/provider realization
|
+-- Family A
|    +-- State / Control
|    +-- act(...)
|    +-- admitted State + Begin
|    +-- Act.Method(service A)
|
+-- Family B
|    +-- State / Control
|    +-- act(...)
|    +-- admitted State + Begin
|    +-- Act.Method(service A or B)
|
+-- VexExecutionRoot
|
+-- VexLogger
```

Runtime round trip:

```text
outside observations
-> Network / Service Relays
-> relationship truth

human or automation
-> rightful Family Control when semantic meaning exists
-> Family.act(...)
-> admitted State + Begin
-> bound Family.Method
-> VexExecution
-> VexService/API
-> provider/server
-> observation
-> rightful interpretation
-> Family.observe / Relay input
-> Projection
-> UI / next convergence
```

## 11. VexBoard projection grammar

VexBoard should distinguish the type of edge it is showing.

### Authored Family relationship

```text
CURRENT State
+ Control
-> Act
-> admitted State
+ Begin(Effect, Approach)
```

This is lawful semantic behavior.

### Relay convergence

```text
independently-owned current truths
-> Relay.processStates(...)
-> derived relationship truth
```

This is not a Family transition.

### Method realization

```text
accepted Act
-> bound Method
-> VexExecution
-> VexService/provider
-> VexMethod.Result
```

This is realization, not semantic admission.

### Observation return

```text
provider fact
-> currentness/validation
-> already-semantic observation
-> Family.observe(...)
```

### Fractal board descent

```text
Cloud Connectivity system anatomy
    |
    +-> device network board
    |
    +-> service relationship board
    |      +-> service A
    |      +-> service B
    |
    +-> operation board
    |      +-> Family State / Control / Act / Effect
    |      +-> Method / Execution / Result
    |
    +-> automation board
    |
    +-> security overlay
    |
    +-> API membrane
           |
           +-> server architecture portal
```

Do not render every relationship on one mega-canvas.

## 12. Architecture pressure / acceptance criteria

Before graduating `VexService` or a generic service-connectivity contract, prove that the same small
contract survives:

1. multiple Families using one service simultaneously;
2. one network feeding multiple services with independent availability;
3. one service failure without poisoning sibling service/network truth;
4. one operation failure without poisoning shared service truth;
5. autonomous service work with no Family when no product semantics exist;
6. Family-triggered work and automated work sharing one semantic Control where semantics do exist;
7. process-lifetime composition plus OS-owned background resumption;
8. VexLogger upload without moving remote-sync ownership into VexLogger;
9. announcement polling whose provider truth becomes UI only after Family interpretation;
10. VexBoard projection that visibly distinguishes Family behavior, Relay convergence, Method
    realization, provider observation and chronology.

If removing the candidate VexService abstraction loses no required correctness/reuse after these
consumers are implemented, do not graduate it.

<!-- [VXG RealForever][CLOUD-CONNECTIVITY][VEXSERVICE][CONNECTIVITY][AUTOMATION] -->
