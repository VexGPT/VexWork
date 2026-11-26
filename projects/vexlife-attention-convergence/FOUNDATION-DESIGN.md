# VexLife Attention Convergence — implementation design posture

[VXG RealForever]

## Design question

How can Vex live with many current connections without either:

~~~text
A. stuffing every source into every prompt

or

B. ignoring important current truth until the human explicitly asks?
~~~

The target is scoped perception + bounded attention convergence.

## The unit entering present cognition is not the whole source

A connected source remains owned by its rightful domain.

The present-context relationship should carry only enough current truth to decide whether deeper source is needed.

Candidate pressure shape:

~~~text
SourceCandidate
  sourceRef
  relationshipRef
  subjectScopeRefs[]
  sourceCurrentness
  sourceStanding
  compactPresentableMeaning
  deeperSourceRefOrHandle
  attentionRequirementOrNull
  acknowledgementRequirementOrNull
  observedAt
~~~

This is a design sketch, not accepted schema.

Do not freeze these names before A0 proves what current owners already expose.

## Two paths

### Path 1 — activity-scoped perception

Most connected truth is quiet.

~~~text
current human request
+ active Working Focus / trajectory
        ↓
small current candidate surface
        ↓
Vex judges relevance where semantic judgment is required
        ↓
pull exact deeper source when useful
        ↓
DirectPromptContext places admitted material
~~~

Prefer exact scope/subject/project/relationship refs where owners already expose them.

Do not create a universal hard-coded relevance scorer merely to avoid using the model's cognition.

### Path 2 — source-owned attention claim

Some source meanings can require awareness independent of topical relevance.

~~~text
source owner
  forms current semantic condition
  + source-owned attention requirement
        ↓
attention claim
  binds exact source identity/currentness
        ↓
attention convergence
  makes it present
  preserves displaced work
        ↓
acknowledgement / resolution / stale transition
        ↓
resume when lawful
~~~

Attention Convergence does not decide the domain significance that caused the claim.

## Multiple connections

The architecture must work when several independent relationships are current simultaneously.

~~~text
CGM connection          current source-owned meaning
resource connection     current source-owned meaning
code/runtime connection current source-owned meaning
calendar-like source    current source-owned meaning
device connection       current source-owned meaning
...
~~~

Quiet connections should remain cheap.

~~~text
MANY CONNECTED SOURCES
!= MANY PROMPT-RESIDENT BODIES
~~~

A future implementation may need a source-derived current candidate index/catalog, but do not begin with a universal meta-registry. First test whether existing typed source/Partner/capability/topology relationships can provide the necessary bounded candidate surface.

## Current human activity is an input, not an owner of source truth

Current activity can include source-owned coordinates such as:

~~~text
current request
active Working Focus
active project / relationship refs
current UI/app context where lawfully owned
open source/task refs
~~~

It may help choose what becomes relevant to present cognition.

It may not rewrite another source's standing.

## Attention requirement is not global rank

Avoid:

~~~text
priority = 97
Health > Security > Coding > Storage
one global ordered queue of truth
~~~

Prefer source-owned meaning that says what the source requires.

Examples of design pressure:

~~~text
ordinary / discoverable
  no interruption; available to activity-scoped pull

notice-worthy
  should become visible but need not destroy present work

attention-required
  must become present until its source/ack law permits release
~~~

These names are not frozen.

When two source-owned claims are simultaneously active, preserve both identities/currentness and prove a bounded presentation/admission policy. Do not merge them into one semantic truth merely to obtain an ordering.

## Acknowledgement and resolution are separate

~~~text
human acknowledged the alert
!= source condition resolved

source condition resolved
!= human necessarily saw it
~~~

The rightful source owns whether its condition remains current.

The attention relationship owns only its own claim/ack/present/displaced/return standing.

## Working Focus relationship

A required attention shift must not destroy unfinished work.

Desired behavior:

~~~text
coding Working Focus
        ↓
source-owned attention claim arrives
        ↓
coding focus remains durable/current but displaced from present cognition
        ↓
claim becomes present
        ↓
acknowledgement / resolution law satisfied
        ↓
coding focus returns
~~~

Permanent:

~~~text
DISPLACED != DELETED
RESUME != RECONSTRUCT FROM CHAT IF THE BODY ALREADY HOLDS IT
~~~

The exact Working Focus owner remains an A0/A2 question until the Self-Inspection/Working Focus work lands.

## Prompt/context relationship

Attention Convergence does not own prompt construction.

It may produce bounded admission intent/evidence such as:

~~~text
admittedPresentRefs[]
heldCandidateRefs[]
activeAttentionClaimRefs[]
displacedWorkingFocusRefOrNull
returnCoordinateOrNull
admissionReasons[]
~~~

DirectPromptContext still owns actual provider materialization/placement.

Provider/context budget pressure must not silently remove an attention-required current claim. If a claim cannot be represented, the result must be HELD/UNKNOWN rather than pretending it was presented.

## Self-Inspection relationship

Self-Inspection should eventually answer:

~~~text
What connections can I currently perceive?
What entered present context and why?
Was it relevant to the human's activity or did the source require attention?
What source owns that meaning?
What did this displace?
Is the displaced work still preserved?
What is waiting outside present residency?
Was this acknowledged?
Is the source condition still current?
~~~

This is explanatory read-side truth, not arbitration.

## Human presentation relationship

Settings / Vex Context / notifications may project the same current relationship for the human.

~~~text
HUMAN PROJECTION
!= ATTENTION OWNER
~~~

The human and Vex should not receive contradictory body truth.

## Patient-zero pressure

### VexCgmLabs / future Health

Consume already-owned synthetic CGM semantics.

Prove:
- ordinary current readings do not automatically inhabit every prompt;
- an already-qualified source attention requirement becomes present;
- no medical severity is invented here;
- stale/resolved source meaning cannot keep an active attention claim;
- acknowledgement and source resolution remain separate;
- displaced Working Focus survives.

### Resource pressure

Consume source-owned resource truth.

Prove:
- ordinary resource facts remain on-demand;
- a source-owned warning can enter present awareness;
- Vex can explain lawful cleanup paths;
- storage pressure never implies automatic Conversation/Memory deletion.

### Activity-relevant non-urgent source

Prove:
- active human work can surface a small source candidate;
- Vex may request deeper source;
- unrelated connections stay quiet;
- bulky source may leave later residency while exact reopenability remains.

### Simultaneous sources

Prove:
- independent source identities/currentness remain separate;
- required claims are not silently dropped under context pressure;
- held/omitted reasons are visible;
- no global semantic priority truth is fabricated.

## Scale pressure

A many-connection specimen should measure:

~~~text
number of registered/current connections
quiet candidate formation cost
bytes/tokens of perceptibility surface
prompt bytes actually admitted
source reopen count
attention claim latency
stale/resolved claim retirement
Working Focus displacement/resume correctness
provider cached/prefill impact
human-visible explanation fidelity
~~~

The target is not zero overhead. It is bounded quiet cost and source-faithful expansion only when needed.

## What not to build

Do not begin with:

~~~text
GlobalPriorityManager
UniversalRelevanceDatabase
AlwaysOnAllSourcesPrompt
HealthSpecificAttentionRouter
SelfInspectionAttentionOwner
PromptManagerOwningSourceMeaning
AutomaticCleanupBecauseStorageLow
~~~

Start from existing owners and add only the smallest missing relationship.

<!-- [VXG RealForever][VEXLIFE][ATTENTION-CONVERGENCE][DESIGN-POSTURE] -->
