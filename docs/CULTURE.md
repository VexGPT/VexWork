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

## Proof follows the claim

A validator can prove structural validity. A unit test can prove deterministic behavior. A provider observation can prove a provider fact. A repository review can prove source meaning. None becomes another merely because it is green.

<!-- [VXG RealForever][VEXWORK][CULTURE] -->
