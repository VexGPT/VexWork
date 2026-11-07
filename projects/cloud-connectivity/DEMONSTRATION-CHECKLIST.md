# Cloud Connectivity — demonstration checklist

`[VXG RealForever]`

This is a **coverage checklist**, not one implementation sequence and not a claim that every item
already exists.

## A. Operation + API contract

- [ ] One stable product/domain operation identity survives multiple transport attempts.
- [ ] Request and response schemas are explicit and validated.
- [ ] Client-authored fields cannot overwrite server-owned truth.
- [ ] Validation errors are distinguishable from transport/server failures.
- [ ] An accepted operation outcome is distinguishable from HTTP/transport success.
- [ ] Correlation/evidence can trace one operation across client and cloud without exposing secrets.

Permanent:

```text
OPERATION != HTTP REQUEST
HTTP 2XX != DOMAIN EFFECT PROOF
CLIENT PAYLOAD != SERVER AUTHORITY
```

## B. Connectivity + resilience

- [ ] Online happy path.
- [ ] Offline operation is held/queued where product semantics allow.
- [ ] Reconnect resumes eligible work.
- [ ] Network flap does not duplicate domain effects.
- [ ] Connection timeout is represented as ambiguous when the outcome is unknown.
- [ ] Retry uses bounded backoff/jitter policy rather than tight loops.
- [ ] Service unavailable is distinguishable from unauthorized/invalid work.
- [ ] Rate limiting has a bounded retry/hold path.
- [ ] Process/app restart can recover durable pending work without replaying completed work.

## C. Idempotency + ambiguous outcomes

- [ ] Request lost before reaching server.
- [ ] Server receives request and rejects it.
- [ ] Server commits operation but response is lost.
- [ ] Client retries the same operation.
- [ ] Server recognizes the same operation and does not duplicate the effect.
- [ ] Same idempotency/operation identity with changed meaning fails as conflict.
- [ ] Evidence distinguishes operation identity from attempt identity.

## D. Offline sync + currentness

- [ ] Cloud state and local state have explicit owners.
- [ ] Cached local projection can be stale without becoming authority.
- [ ] Cloud-newer/local-older reconciliation.
- [ ] Local unsynced change versus cloud-current state.
- [ ] Offline device returns after authorization/currentness changed.
- [ ] Background sync resumes after process death.
- [ ] Sync can stop/hold when preconditions are no longer current.
- [ ] Durable local data remains useful according to explicit offline policy.

Permanent:

```text
LOCAL_CACHE != CLOUD_AUTHORITY
OFFLINE_USEFUL != CURRENT_FOR_NEW_EFFECTS
SYNC != BLIND_OVERWRITE
```

## E. Multi-device convergence

- [ ] One principal with two devices.
- [ ] One principal with five devices.
- [ ] Two devices edit the same logical object.
- [ ] Concurrent non-conflicting changes can converge where semantics permit.
- [ ] Conflicting changes are detected rather than silently last-write-wins unless that is explicit policy.
- [ ] Device A can be revoked without corrupting Device B's synchronized state.
- [ ] One device may be offline while sibling devices advance cloud state.
- [ ] Reinstalled/replacement installation does not silently inherit pending-operation identity incorrectly.

## F. API versioning + backward compatibility

- [ ] Client and server advertise/resolve compatible contract versions.
- [ ] Older supported mobile client continues after a newer server deploy.
- [ ] Newer client handles older compatible server behavior where product policy permits.
- [ ] Unsupported version fails explicitly.
- [ ] Schema evolution preserves old data meaning or has a migration path.
- [ ] Removed/deprecated fields do not silently change meaning.
- [ ] Mobile rollout and backend rollout can happen independently within an admitted compatibility window.

Permanent:

```text
APP_VERSION != API_VERSION
NEW_SERVER != NEW_CLIENT REQUIRED BY DEFINITION
PARSEABLE != SEMANTICALLY COMPATIBLE
```

## G. Data transfer + storage

- [ ] Structured small-record flow.
- [ ] Large/object transfer flow.
- [ ] Content length / digest or equivalent integrity binding where useful.
- [ ] Interrupted upload/download resumes or restarts according to explicit semantics.
- [ ] Partial multi-step storage failure is represented and recoverable.
- [ ] Pagination/cursor continuation does not duplicate or skip logical data.
- [ ] Local durable copies identify what cloud/source version they represent.

## H. Security integration — consumed from Full Security

- [ ] Principal authentication boundary.
- [ ] Device/application-installation identity boundary.
- [ ] Authenticated session currentness.
- [ ] Capability/authorization for requested cloud effect.
- [ ] Token/secret custody.
- [ ] TLS/service identity.
- [ ] Sensitive data in transit.
- [ ] Sensitive data at rest.
- [ ] Replay resistance / idempotency distinction.
- [ ] Device/session revocation affects future/queued work correctly.
- [ ] Key-management boundary.
- [ ] Logs/telemetry exclude secrets and inappropriate sensitive payloads.
- [ ] Software/API update trust.
- [ ] Recovery path does not widen authority.

Cloud Connectivity demonstrates these intersections but should link to Full Security rather than fork
its security vocabulary.

## I. Cloud provider realization

Provider-neutral demonstration first:

- [ ] identity provider boundary;
- [ ] API ingress;
- [ ] domain service;
- [ ] structured durable store;
- [ ] object store;
- [ ] key-management service;
- [ ] observability/correlation.

Optional AWS mapping pressure:

- [ ] Cognito;
- [ ] API Gateway;
- [ ] DynamoDB;
- [ ] S3;
- [ ] KMS.

The Project should be understandable even if the realization is later replaced.

## J. Evidence + observability

- [ ] Each client operation has stable correlation identity.
- [ ] Each attempt is separately observable.
- [ ] Server acceptance/rejection is observable.
- [ ] Durable commit/effect evidence is distinguishable from transport response.
- [ ] Sync/currentness evidence explains why local state changed.
- [ ] Retry counts/reasons are bounded and explainable.
- [ ] Sensitive values are redacted/absent.
- [ ] VexBoard can project the causal path read-only.
- [ ] Vex can later explain an admitted scenario without becoming cloud/effect authority.

## K. Educational product experience

- [ ] VexLife-Prod AppSelector can conceptually select Cloud Connectivity.
- [ ] The experience can show local Android state and cloud state together without collapsing ownership.
- [ ] One operation can be selected and its attempts inspected.
- [ ] Failure injection is explicit/synthetic.
- [ ] Current source versus synthetic cloud state is distinguishable.
- [ ] Contextual info explains why a field/state exists.
- [ ] "Show architecture" descends to a bounded VexBoard neighborhood.
- [ ] The primary experience still looks/behaves like a real product surface rather than a tutorial.

<!-- [VXG RealForever][CLOUD-CONNECTIVITY][CHECKLIST] -->
