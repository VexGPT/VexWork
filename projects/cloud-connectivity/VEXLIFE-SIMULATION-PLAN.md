# Cloud Connectivity — VexLife simulation plan

`[VXG RealForever]`

## Human question

Can VexLife demonstrate how a mobile operation remains correct when it crosses processes, networks,
cloud services, time, retries, versions and multiple devices?

## Synthetic system

The first demonstrator should not require real AWS or public network infrastructure.

```text
VexLife-Android
│
├─ product/domain operation
│
├─ local durable projection
│
└─ pending-operation / outbox boundary
        │
        │ attempt
        v
Cloud Connectivity Port
        │
        v
Synthetic Network
  online / offline / timeout / flap / latency / response loss
        │
        v
Synthetic Cloud API Ingress
  contract + version + auth envelope
        │
        v
Synthetic Domain Service
  validates current operation
  owns cloud-domain effect meaning
        │
        ├─ Structured Store
        └─ Object Store
        │
        v
Cloud Observation
        │
        v
Android Reconciliation
        │
        v
Current local projection
```

Full Security intersects at the identity/session/capability/secret/service-trust boundaries; it does
not own sync semantics.

## Important identities

The simulation must distinguish at minimum:

```text
principalRef
deviceRef
installationRef

operationRef          stable human/product operation
attemptRef            one carriage attempt
idempotencyKey        operation-scoped duplicate protection when appropriate

apiContractRef
clientVersionRef
serverVersionRef

entity/dataRef
localRevision
cloudRevision

sessionRef / authority evidence
serviceIdentityRef
route

correlation/evidence refs
```

Do not require these exact field names in implementation. Preserve the semantic distinctions.

## Core laws

```text
OPERATION_IDENTITY != ATTEMPT_IDENTITY
RETRY != NEW OPERATION
TIMEOUT != FAILURE OF DOMAIN EFFECT
TRANSPORT_SUCCESS != DURABLE_COMMIT
LOCAL_STATE != CLOUD_STATE
CACHED_STATE != CURRENT_AUTHORITY
REACHABILITY != SERVICE_IDENTITY
AUTHENTICATION != AUTHORIZATION
AUTHORIZED != SYNCHRONIZED
API_VERSION != APP_VERSION
PARSEABLE != COMPATIBLE
OBSERVABILITY != AUTHORITY
```

## Scenario set

### C01 — online happy path

```text
Android forms operation O1
-> attempt A1
-> ingress accepts
-> domain service commits
-> cloud revision advances
-> response observed
-> Android reconciles
```

### C02 — offline queue

```text
Android forms O2
-> network unavailable
-> operation remains durably pending
-> local product can show Pending rather than fabricate cloud completion
```

### C03 — reconnect flush

```text
pending O2
-> network current
-> eligible attempt
-> server currentness revalidated
-> commit / observation
-> local reconciliation
```

### C04 — request never reaches server

Attempt fails before server receipt. Retry may safely carry the same operation identity.

### C05 — server commits, response is lost

The difficult case:

```text
O5 / A1
-> server commits
-> response disappears
-> client sees timeout
-> outcome UNKNOWN locally
-> retry O5 / A2
-> server recognizes already-completed O5
-> returns existing outcome
-> no duplicate domain effect
```

### C06 — same identity, different meaning

Same operation/idempotency identity with changed payload/meaning must fail conflict rather than
overwrite history.

### C07 — token expires before queued work is sent

Queued product operation may remain pending, but a new cloud effect requires current authentication /
authorization according to Full Security policy.

### C08 — device revoked while work is queued

Queued operation identity survives as historical local intent; future effect admission must respect
current revocation. The demonstrator must not equate "was queued earlier" with standing authority.

### C09 — cloud changes while device is offline

On reconnect the app observes cloud-newer state and reconciles rather than blindly overwriting.

### C10 — local unsynced change + cloud change

Make conflict explicit. Demonstrate the product's selected merge/hold/human-resolution policy rather
than assuming universal last-write-wins.

### C11 — two devices concurrently update

Device A and Device B share a principal but have separate operation/attempt identities and may observe
different starting revisions.

### C12 — five-device convergence

Pressure the same model with five devices at mixed currentness: online, offline, revoked, stale and
newly admitted.

### C13 — supported old mobile client

New server deploy preserves the admitted old API contract.

### C14 — unsupported API version

Explicit compatibility failure; do not reinterpret the payload under a different contract.

### C15 — schema evolution

Add an optional/new field or successor data model while preserving old meaning or executing an
explicit migration.

### C16 — service outage

Bounded backoff/hold; no busy retry loop.

### C17 — rate limited

Respect provider retry/currentness semantics; distinguish from auth denial.

### C18 — partial multi-step cloud failure

Demonstrate a case where one durable step succeeds and another fails. Recovery must know what actually
committed.

### C19 — large object / media transfer

Structured metadata + object bytes + integrity binding; interruption does not silently mark complete.

### C20 — pagination / continuation

Resume a multi-page read without duplicating/skipping logical items.

### C21 — app/process restart

Durable pending operations recover; ephemeral attempts/sessions do not become magically current.

### C22 — route change, stable service identity

Reachability coordinate may change while trust remains bound to the intended service identity.

### C23 — wrong service identity

Reachable endpoint with mismatched service identity is not accepted simply because the network works.

### C24 — clock skew / expiry

Use authoritative/current timing semantics for expiry rather than trusting arbitrary device wall clock
where that would change authority.

### C25 — cloud store newer than cache

Show stale cache as stale/useful according to policy, not as current cloud truth.

### C26 — client migration of local cached schema

App update can migrate local representation without claiming it changed canonical cloud meaning.

### C27 — server validation rejects product operation

Typed domain/validation error survives transport and can be rendered differently from network failure.

### C28 — observability across retry

One operation appears once with multiple attempts, outcome and reconciliation evidence.

### C29 — sensitive payload/log pressure

The operation can be debugged without putting tokens/secrets/sensitive content into ordinary logs.

### C30 — key / encryption realization change

Cloud encryption/key realization can rotate without changing domain data identity.

### C31 — backend rollout compatibility window

Client A old + Client B new operate concurrently against the same admitted server window.

### C32 — provider realization swap

Map the synthetic provider-neutral components to an AWS example without changing operation/sync
semantics.

## VexLife-Prod AppSelector experience pressure

Current source doorway:

```text
VexLifeWorkspaceBlueprint.AppSelector
-> VexLifeWebP1.AppSelector
-> retained selector:
   Browser
   "More apps aren't connected yet"
```

Desired semantic pressure:

```text
selected workspace application
├─ Browser
├─ Full Security
└─ Cloud Connectivity
```

Cloud Connectivity may eventually expose projections such as:

```text
Topology
Operations
Sync
Failures
API Compatibility
Devices
Data
Security
Scenarios
Evidence
Architecture
```

These are information domains, not prescribed UI navigation.

Useful selected-object flow:

```text
select operation O5
-> see current product meaning
-> see A1 timeout
-> see cloud commit evidence
-> see A2 retry/dedupe
-> see Android reconciliation
-> optional Why?
-> Show architecture
-> Ask Vex
```

This is the educational center of the Project.

## VexBoard pressure

VexBoard should be able to show bounded views such as:

```text
operation neighborhood
attempt timeline
sync/currentness relationship
multi-device convergence
API-version compatibility
provider-neutral cloud topology
Full Security boundary overlay
AWS example realization
```

VexBoard remains projection, not cloud state or operation authority.

## Proof ladder

```text
contract/source shape
-> deterministic synthetic unit/fixture proof
-> Android consumer integration
-> VexLife-Prod selected-app projection
-> cross-process synthetic network proof
-> optional local mock-cloud service
-> real provider realization only when separately authorized
-> lived mobile/cloud proof
```

<!-- [VXG RealForever][CLOUD-CONNECTIVITY][SIMULATION] -->
