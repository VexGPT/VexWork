# VexWork development culture

`[VXG RealForever]`

## Intention before tracking

VexWork exists to make this question cheap to answer:

> **What are we trying to accomplish, what work exists because of that intention, how is it related, what is true now, and where do I descend next?**

A ticket system that records activity but loses intention is not enough. A graph that models everything but cannot answer an ordinary human question is not enough either.

Start from the human outcome, then preserve the structure required to carry it truthfully.

## Work is not the provider record

GitHub, Jira, a local file, a chat thread, a pull request, a CI run, and a calendar event can all carry useful work evidence. None becomes canonical work state merely because it has a timestamp or status field.

```text
WORK_ITEM != GITHUB_ISSUE
WORK_STATE != PR_STATE
WORK_STATE != CHECK_STATE
WORK_STATE != CHAT_ACTIVITY
PROVIDER_TIMESTAMP != CURRENTNESS
```

Provider systems are adapters and evidence sources around VexWork, not hidden semantic owners inside it.

## One work truth owner; bounded projections

The Workgraph owns lifecycle truth and relationships between work items. A Work item does not need Project membership to exist; Projects select bounded subgraphs from that larger truth.

Consumers derive only what they need:

```text
CURRENT Workgraph
-> Project / Parking Lot selection
-> Work Board
-> Graph
-> Table
-> Roadmap
-> Focus
-> conversational answer
```

A projection may regroup or explain work. It may not silently create another lifecycle.

```text
WORK_BOARD != WORKGRAPH
BOARD_LANE != WORK_STATE
PROJECTION != EFFECT_AUTHORITY
```

## Identity before naming; names follow the boundary

VexWork needs stable coordinates that survive wording changes, while humans and connected systems need
names that fit their own boundary. Do not make one string carry all of those jobs.

For VexWork-owned objects:

```text
stable ref
  enduring VexWork coordinate

human label
  current readable name for people

projection label / lane name
  contextual wording in one view

provider title / external name
  provider-owned wording and provenance

source/native identifier
  coordinate owned by the referenced repository/system
```

These may agree textually, but agreement is not identity.

```text
IDENTITY != HUMAN_LABEL
IDENTITY != PROVIDER_TITLE
IDENTITY != PROJECTION_LABEL

RENAME != REIDENTIFY
SAME_LABEL != SAME_OBJECT
ALIAS != CANONICAL_IDENTITY

WORK_REF
!= WORK_LABEL
!= GITHUB_ISSUE_TITLE

PROCESS_REF
!= PROCESS_DISPLAY_NAME

REPOSITORY_REF
!= REPOSITORY_LABEL
!= PROVIDER_NATIVE_ID
```

A human-facing alias may improve discoverability (for example, "Jira board" resolving to the Work
Board intention) without becoming a new namespace or truth owner.

The identity/name distinction does not make every rename cosmetic. If a name is persisted, serialized,
provider-native, externally addressed, or otherwise contract-bearing, changing that boundary name may
require an explicit compatibility/migration path even while the underlying VexWork identity remains
the same.

When another source is projected into VexWork, retain its rightful stable identifier and provenance.
Use VexWork labels to explain that coordinate rather than renaming the external thing into a new
VexWork identity. If a referenced owner changes its canonical identity, treat that as an explicit
mapping/migration question rather than silently following a matching label.

This is the VexWork-local expression of a wider Vex lesson: **identity is the coordinate; naming is
boundary-specific representation**. It does not require one universal naming schema across product
code, provider APIs, repositories, wire formats, or human UI.

## Ambient source of truth; not foreground ceremony

VexWork should make ongoing work easier, not require a worker to repeatedly announce or re-register the system while continuing an already-known lane. Once a Work identity, current state and route are established, ordinary execution can remain focused on the owning work and repository.

Return to VexWork when work truth materially changes:

```text
new adjacent work discovered
work state / disposition changes
dependency or containment changes
Project membership changes
repository relation changes
reusable process route is learned or changed
completion / supersession / cancellation becomes true
```

Reading or updating VexWork is therefore driven by a work-truth change or navigation need, not by ceremony.

```text
CONTINUING_WORK != RE_REGISTER_WORK
SOURCE_OF_TRUTH != CONSTANT_FOREGROUND_SURFACE
NO_MATERIAL_WORK_CHANGE -> NO_REQUIRED_WORKGRAPH_CHURN
```

## SCAE-shaped recognition: name the role, not only the area

VexLife-Android's Behavior foundation taught a useful recognition discipline: a semantic stem and an architectural role are different coordinates. VexWork adopts that *method* for work behavior.

```text
WorkControl + CURRENT WorkState
-> WorkAct

CURRENT WorkState + WorkAct
-> WorkEffect + admitted WorkState

CURRENT WorkState + WorkItems
-> WorkProjection
```

The roles answer different questions:

```text
WorkState     what can truthfully be true about this work now?
WorkControl   what stable human/agent affordance may be offered now?
WorkAct       what does use of that affordance mean from current truth?
WorkEffect    what transformation may be attempted?
WorkBehavior  where are lawful state/act/effect relationships defined?
WorkBoard     how is current truth projected for board-shaped understanding?
```

Do not create files merely to fill this grammar. Let real responsibility earn source placement.

## Ideas are allowed to be ideas

A human needs somewhere to say "remember this" without accidentally saying "go implement this."

VexWork therefore keeps capture separate from authority:

```text
POTENTIAL_CAPTURED != ADMITTED_IMPLEMENTATION
IDEA != FEATURE
IDEA != ROADMAP_COMMITMENT
READY_FOR_DISCUSSION != EFFECT_AUTHORITY
```

Work classes can describe the meaning of an item; authority remains separately explicit.


## Projects group work; they do not create it

A Project is a human outcome grouping over Workgraph roots. Useful work may exist before anyone chooses a Project for it.

```text
WORK_ITEM != PROJECT_MEMBERSHIP
PROJECT != WORKGRAPH
PARKING_LOT != PROJECT
```

This matters for ideas discovered while another lane is being completed. Do not invent a fake project merely to store an item. Preserve the Work identity first; group it later when a real outcome earns that relationship.

## Learn reusable process without preserving private reasoning

When work reveals a repeatable way of handling a recurring question, future workers should not have to rediscover that route from chats or provider artifacts.

Ask whether the observed process is truly reusable. If it is, identify the rightful process owner and source-place the smallest durable process there. VexWork records or references the route when work navigation needs it.

```text
ONE_OFF_MANEUVER != PROCESS_FOUNDATION
REUSABLE_PROCESS != PRIVATE_CHAIN_OF_THOUGHT
PROCESS_MAP != EXECUTOR
PROCESS_REFERENCE != PROCESS_OWNERSHIP
```

VexWork owns processes about work-system behavior itself, such as capturing adjacent discovered work. Product repositories continue to own their own feature/source processes.

## Project before repository

Projects represent human outcomes. Repositories are implementation/source locations.

One project may touch zero, one, or many repositories. One repository may participate in many projects.

```text
PROJECT != REPOSITORY
CROSS_REPO_PROJECT != MONOREPO
REPOSITORY_RELATION != SOURCE_OWNERSHIP
```

This is why VexWork owns a Repository Graph rather than storing projects inside whichever product repository first needed them.

## Cultures are federated, not consolidated

VexWork may record that a work item touches `repo.vexlife` and that VexLife's culture entry is `docs/CULTURE.md`. It does not copy that culture into VexWork and claim to supersede it.

```text
VEXWORK_CULTURE
  owns work/project/relation/projection meaning

TARGET_REPOSITORY_CULTURE
  owns that repository's source meaning and conventions

VEXWORK_REFERENCE_TO_CULTURE
  is navigation, not semantic takeover
```

When source work descends into another repository, read that repository's current front door and culture far enough to ground the exact effect.

## Navigation root, not authority root

VexWork should be a useful place to start understanding cross-repository work. It must not become a super-repository that grants source, merge, deployment, model, personal-data, or lifecycle authority in other repositories.

```text
VEXWORK = WORK_NAVIGATION_ROOT
VEXWORK != ROOT_OPERATIONS
VEXWORK != CROSS_REPO_EFFECT_AUTHORITY
```

## Source-managed definition; runtime state may live elsewhere

Stable schemas, registries, project definitions, reusable views, and portable examples belong in Git.

High-frequency or private operational state may belong in a qualified runtime store such as Vex Home or another deployment's local state.

```text
SOURCE_DEFINITION != LIVE_RUNTIME_SNAPSHOT
PUBLIC_VEXWORK != PRIVATE_INSTITUTIONAL_WORK_DATA
```

The public project must never require publishing private work merely to use the engine.

## Human simplicity; structural depth

The ordinary human should be able to say:

```text
"add this idea"
"show my Work Board"
"what changed since yesterday?"
"what is blocked?"
"what touches Android?"
```

and receive a calm answer.

The deeper graph, fingerprints, source refs, provider evidence, and repository culture links remain inspectable rather than permanently occupying the main surface.

## Regression before expansion

VexWork is allowed to grow, but accepted behavior should become cheaper to preserve as the surface area grows.

A completed foundation is not a frozen repository and it is not permission to treat every later feature as isolated. New work must preserve the contracts it depends on and the unrelated behavior it can reasonably disturb.

```text
NEW_FEATURE != PERMISSION_TO_REOPEN_ACCEPTED_BEHAVIOR
FOUNDATION_COMPLETE != TEST_SUITE_FROZEN
GREEN_TESTS != COMPLETE_PROOF
COVERAGE_PERCENT != CORRECTNESS
REGRESSION_FOUND -> REGRESSION_TEST_WHEN_DETERMINISTIC
```

Default engineering habits:

- every durable `src/core` module and public reader module has a direct deterministic test surface;
- new semantic branches exercise the intended path and the relevant stale, unknown, duplicate, cyclic, unauthorized, malformed, or fail-closed paths;
- a deterministic bug discovered in review or lived use gains a regression fixture before or with its repair;
- checked-in generated projections are regenerated or checked from their rightful source rather than hand-edited into agreement;
- changes that compose with shared Workgraph/Project truth test coexistence, not only an empty happy-path fixture;
- coverage is inspected as a blind-spot signal over durable executable source, not inflated by test-file self-coverage and not used as a substitute for assertions, semantic review, provider evidence, or lived proof;
- a numerical coverage floor is earned from an exact measured baseline and ratchets upward deliberately; the accepted baseline/floor lives in one source-managed coverage contract rather than being guessed per PR;
- do not delete, weaken, skip, or narrow a legitimate regression test merely to permit a new feature.

The reusable review route for these habits is `process.vexwork.quality-review`.

## Proof follows the claim

A validator can prove structural validity. A unit test can prove deterministic behavior. A provider observation can prove a provider fact. A repository review can prove source meaning. None becomes another merely because it is green.

<!-- [VXG RealForever][VEXWORK][CULTURE] -->
