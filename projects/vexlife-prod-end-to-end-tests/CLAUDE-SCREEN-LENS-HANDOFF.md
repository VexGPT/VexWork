# Claude handoff — Screen Lens + E2E relationship discovery

`[VXG RealForever]`

## Intention

Build out VexLife-Prod/VexArchitecture perception through the rightful VexBoard Screen Lens lane **while simultaneously discovering the human choice/state relationships needed by `project.vexlife-prod.end-to-end-tests`**.

Do not make the E2E Project a second Product or Screen Lens architecture owner.

## Enter from current sources

VexWork:

~~~text
PR #298  recurring VexArchitecture <-> VexBoard Screen Lens sync
PR #300  preserve source realization topology in Depth
PR #303  Direct Registration dependency classification
projects/vexboard/SCREEN-LENS.md
projects/vexboard/SCREEN-LENS-ADAPTER.md
projects/vexboard/SCREEN-LENS-PROJECTABILITY.md
~~~

VexLife-Prod:

~~~text
main 605c635ae2d034a1c4d605e829faa4813de071c3
src/jvmMain/kotlin/vexlife/lens/VexLifeProdScreenLens.kt
docs/lens/vexlife-prod.screen-lens.json
PR #343 E2E excavation
~~~

Active Product pressure to read but not promote to current main:

~~~text
#251 Vex Context / Context Profiles
#310 VoiceInput / local ASR
#331 reply-language scripts / Composer output
~~~

## Two simultaneous outputs

### Output A — rightful Screen Lens evolution

Continue through the current VexBoard Screen Lens/sync ownership. Repair only relationships current source proves. Keep Surface / Structure / Behavior / Depth distinctions and fail closed on unknowns.

### Output B — E2E discovery packets

For each meaningful source pathway discovered, return:

~~~text
sourceRefs[]
existing coordinateRefs[] / exact source symbols
humanMeaning
sourceOwner / Family
State refs/shapes observed
Controls lawful by State
Act row: State + Control -> admitted State? + Effect?
outside realization
Observation -> actual successor State/currentness
cross-owner endpoint rows
projectionRefs[]
loop pressure
candidateJourneyRefs[]
disposition CURRENT | ACTIVE_CANDIDATE | HELD | UNKNOWN
~~~

These packets update the E2E lattice; they do not become Product truth. Do not mint a discovery/relationship ID merely to name a row that is already uniquely described by its source coordinates.

## First census targets

Current main Families:

~~~text
Entry
Private mode
Diagnostics
Memory
Memory Review
Models
Release Inbox
Vision
~~~

Then active candidate pressure:

~~~text
Context Profile (#251)
VoiceInput (#310)
Local ASR Models (#310)
Person reply language / spoken language / Composer output (#331)
~~~

## What to look for

Do not stop at a control-to-function mapping. Follow the relationship far enough to answer:

~~~text
State -> available Control
Control -> semantic Act / Effect
Effect -> realization / outside truth
Observation -> successor State
State/change -> another Family or turn boundary
turn boundary -> provider input
completed turn -> Vex Context / Screen Lens / human projection
~~~

Call out where a pathway is intentionally independent rather than forcing an edge.

## Existing-ID mapping rule

Do not invent a parallel feature ID when source already has a unique element/pathway/Family coordinate.

For each discovery, return the existing coordinate(s) and attach meaning:

~~~text
coordinateRefs[]
humanMeaning
availabilityPredicates[]
State / Control law
crossFamilyEdges[]
journeyRefs[]
loop pressure
proofRefs[]
currentLimitationOrHoldOrUnknown
~~~

Patient zero:

~~~text
element.vexlife-workspace.companion.conversation.context-share
pathway.vexlife-prod.local.companion.conversation.context-share
pathway.vexlife-prod.conversation.send
~~~

Current runtime behavior is deeper than the present local-only Screen Lens path:

~~~text
Product-owned navigation earns exact page identity
-> context eligibility
-> human requests page read
-> separate context frame returns normalized exact-page context
-> Include this page becomes included
-> next Send optionally carries browserContext
-> DirectPromptContext fingerprints it in the receipt
~~~

Current fail-closed branch:

~~~text
unexpected internal embedded navigation
-> new cross-origin address cannot be observed
-> clear stale page identity/context
-> show Current address unavailable
-> disable Include this page
~~~

Treat that as a current limitation to map and revisit. Also flag that the current Screen Lens classifies ContextShare only as TYPED_PRESENTATION over ContextReceipt even though runtime source proves deeper relationships. Investigate whether Product Screen Lens source/projectability should expose more; do not hand-author the missing depth in VexBoard.

## Patient-zero relationship journey

Use the language/Voice/Context case as a pressure test for the mapping:

~~~text
reply language en
-> speak/send
-> provider gets en
-> Vex Context completed turn says en

change reply language to zh-Hans
-> FOLLOW_REPLY_LANGUAGE may resolve spoken recognition to zh
-> speak Chinese
-> Composer output may stay as spoken or translate to English
-> Send
-> provider separately receives replyLanguage=zh-Hans
-> real-model behavior expects Simplified Chinese
-> Vex Context newest turn says zh-Hans
-> prior English turn still says en
~~~

Strongest permutation:

~~~text
spoken language = Chinese
Composer output = English translation
Vex reply language = Simplified Chinese
~~~

If the Lens or source map collapses those three coordinates, report the exact missing relationship rather than inventing equivalence.

## Non-duplication rules

~~~text
one Product branch meaning -> one source relationship
journeys link to it; they do not copy it

one semantic journey -> many evidence configurations
locale/platform/model variants do not become copied journeys

Screen Lens projection -> perception
!= Product authority
~~~

## Graph / pathway / route expectation

Treat the source-derived relationship graph as primary.

~~~text
PATHWAY = selected branch-capable subgraph
ROUTE   = one concrete traversal
JOURNEY = human scenario across one or more routes
~~~

Where current Screen Lens already exposes a `pathwayRef`, preserve it as a projection/query coordinate. Do not assume the pathway ref itself is semantic authority; investigate how its nodes/edges can be derived from the richer source relationship graph.

For each source relationship discovered, make it possible to answer both directions:

~~~text
REVERSE
  what source State / Control / surface element(s) can reach this edge?

FORWARD
  what Effect / realization / observation / successor State / Projection follows from it?
~~~

First test-generation deliverable should be a deterministic route manifest, not hand-written test code:

~~~text
target coordinate / edge
preconditions
human actions + elementRefs
relationship traversal
expected State/Effect/Observation
expected Projection/evidence
execution class
~~~

Then bind that manifest to existing VexLife-Prod deterministic/isolated-service runners.

## No blanket mutation grant

This handoff authorizes read/discovery and the already-admitted VexBoard Screen Lens lane only. VexLife-Prod source changes, lifecycle actions, merges, and release effects still require their rightful current lane/authority.

<!-- [VXG RealForever][CLAUDE][VEXBOARD][VEXLIFE-PROD][E2E-DISCOVERY] -->
