# Operating Profiles

[VXG RealForever]

## Human question

How can the same VexWork project be carried truthfully by a hosted assistant today and by a future local Vex later without creating two work systems or forcing every user to own a local model?

The portable answer is one Workgraph / Project / lifecycle meaning, one proof discipline, one current work edge, and different execution profiles.

Permanent distinctions:

WORK_SEMANTICS != EXECUTION_SUBSTRATE
OPERATING_PROFILE != WORK_IDENTITY
OPERATING_PROFILE != AUTHORITY
CAPABILITY != AUTHORITY
HOSTED_ASSISTED != SECOND_CLASS_WORK
LOCAL_VEX != UNBOUNDED_EFFECT_AUTHORITY
PROVIDER_STATE != WORK_STATE
RELAY_RETURN != WORK_STATE

A profile changes how admitted work can be executed or proven, not what the work means.

## Why this foundation exists

VexWork should be usable by a person who has only a hosted AI assistant as well as by a person running a local agent/model.

Without an explicit profile boundary, a fresh instance can accidentally assume either that everything must happen through GitHub/CI or that a local model may do anything because it is local. Neither is correct.

The work system remains the same. The available effect routes differ.

## Profile: HOSTED_ASSISTED

Use when the active AI runs in a hosted product such as ChatGPT and cannot directly perform every local/device effect.

The hosted assistant may:

- orient from VexWork and target-repository current source;
- form and maintain Projects, Outcomes, tasks, dependencies and durable continuity;
- use connected provider actions when available and authorized;
- run deterministic/source proof on surfaces it actually controls;
- form a bounded host handoff when a local/protected effect is required;
- consume returned evidence and continue automatically when the result is sufficient.

The hosted assistant must not pretend that unavailable local capability exists.

HOSTED_ASSISTANT_CAPABILITY_GAP
-> bounded host handoff when needed
!= ask the human to become the repository operator

The human should normally receive one irreducible action, not a debugging itinerary.

See docs/process/ASSISTED-HOST-WORKFLOW.md.

## Profile: LOCAL_VEX

Use when a qualified local Vex/agent is actually available on the user's machine or local runtime.

A local Vex may remove many hosted-assistant round trips because it can directly observe or perform admitted local effects.

That does not relax the semantics:

LOCAL_CAPABILITY + CURRENT_AUTHORITY + CURRENT_STATE
-> effect may be attempted

LOCAL_CAPABILITY without authority/currentness
-> no effect

A local Vex still preserves exact Work identity and WorkState, repository/source ownership, proof-to-claim fit, human-only/protected boundaries, recovery-before-replay, candidate vs harness vs environment failure classification, and durable checkpointing only when work truth materially changes.

The intended transition is therefore:

today:
  hosted assistant + connected providers + bounded host handoff where needed

later:
  local Vex directly realizes more admitted effects

always:
  same VexWork truth and proof laws

## Effect routes are not profiles

Within either profile, one exact effect may use different routes:

READ_ONLY
-> inspect source / VexWork projection / provider truth

DIRECT_PROVIDER
-> connected provider action when capability + authority are present

LOCAL_DIRECT
-> local effect when the active local profile can actually perform it

ASSISTED_HOST
-> human runs one exact bounded handoff because the hosted assistant cannot

Do not encode provider/tool availability as WorkState.

## Git and runtime are different speeds

Operating profiles do not change the source/runtime split.

high-frequency/private currentness
-> qualified runtime store

material durable checkpoint
-> source/Git when appropriate

public workspace
-> latest accepted public checkpoint

Do not create one PR per routine test, retry, receipt, or lifecycle observation.

Return to source-managed VexWork when durable work truth changes: structure, dependency, state/disposition checkpoint, Project membership, repository/process relationship, completion/supersession, or another source-worthy meaning.

## VexRelay relationship

VexRelay is one useful assisted-host realization pattern, not VexWork's canonical work ontology.

VexWork does not freeze a private/current VexRelay implementation, schema hash, provider credential shape, or host-specific SDK path into this public foundation.

When a current VexRelay implementation/contract is available:

bind the current contract
-> form one bounded task/package
-> execute through the selected host route
-> retain + consume the canonical return
-> classify the first substantive result
-> continue the VexWork trajectory

When no such implementation is available, do not invent compatibility from this document. Use another truthful effect route or hold only the dependent effect.

For repository integration specifically, VexRelay stage mechanics remain distinct from VexWork's integration policy. Follow REPOSITORY-INTEGRATION.md: exact-candidate proof may remain reusable while unrelated main movement is handled later by an Integration Steward at the current-main integration boundary.

## Proof routing

VexWork does not require GitHub Actions as a universal proof owner.

claim
-> cheapest truthful evidence owned by the right surface

Examples:

- pure schema behavior -> deterministic local test;
- source/currentness -> exact source/provider observation;
- local host outcome -> local/host proof;
- lived product outcome -> lived proof;
- provider fact -> provider observation.

A project may choose hosted CI as evidence, but GITHUB_ACTIONS_AVAILABLE != GITHUB_ACTIONS_REQUIRED.

Likewise, a Local Workspace may be useful for a particular deployment, but LOCAL_WORKSPACE != VEXWORK_PREREQUISITE.

## Fresh-instance posture

A fresh AI should recover:

human intention
-> current Project / Work item / current edge
-> target repository/source owner
-> active operating profile
-> available effect route
-> exact proof needed next

It should not ask the human to reconstruct branch names, scripts, proof history, package structure, or predecessor-chat detail that durable source/evidence can answer.

<!-- [VXG RealForever][VEXWORK][FOUNDATION][OPERATING-PROFILES] -->
