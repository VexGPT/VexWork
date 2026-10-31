# Prime Example 03 — Blind public-workspace planning A002

[VXG RealForever]

## Status

`PRIME_EXAMPLE`

Evaluator disposition:

~~~text
CONVERGENT_JUDGMENT
~~~

This A002 trial corrected the A001 source-leak defect and produced a locked blind plan from a genuinely
sealed pre-orientation source boundary.

## Human experiment

A fresh instance was asked to:

~~~text
read only audited generic current sources
-> perform the Pink orientation walk
-> receive the historical Work only afterward
-> treat the supplied historical VexWork ref as present truth
-> inspect only the bounded pre-solution source set
-> form an independent plan
-> challenge material recommendations
-> lock the plan
-> stop before accepted history is revealed
~~~

Historical pre-solution base:

~~~text
aacc5a9874a335a96e71e358aaa933d6f60d45e0
~~~

Sealed accepted completion:

~~~text
5c0e871c8e2e275cdeb20506ac928b4994b2758e
[VexWork] Add stable public dashboard projection
~~~

## A002 blindness audit

Unlike A001, the A002 outer handoff explicitly forbade current VexWork solution-bearing surfaces before
the historical Work was revealed.

Allowed current source included:

~~~text
current Local Vex Operations entry / posture / judgment / continuity sources
current VexWork AGENTS.md
current VexWork docs/CULTURE.md
current Pink docs/foundation/VEXWORK-ORIENTATION.md
~~~

Explicitly forbidden before the plan was locked:

~~~text
current VexWork README.md
current VexWork docs/foundation/INDEX.md
current public/workspace.json
current src/core/public-workspace.mjs
current Human UI implementation
current completed Work entries for the case
PR #195 evaluator key
later history
~~~

The allowed source set was audited for later Public Workspace coordinates.

No allowed source named:

~~~text
public/workspace.json
public-workspace
the historical accepted public-dashboard commit
the later Public Workspace implementation
~~~

Current VexWork `docs/CULTURE.md` contains generic language about human UI as a boundary, but it does not
identify the hidden solution or Public Workspace coordinate.

Therefore A002's blindness claim survives the known A001 failure mode.

## Fresh orientation result

The fresh instance synthesized the current sources as:

~~~text
human intention remains the reason for machinery
current source remains the truth owner
judgment bridges them without adding another management layer
completed valid effects should be preserved
obstacles should not become premature stop conditions
~~~

It identified both failure poles before receiving the historical Work:

~~~text
over-architecture:
  public database
  synchronization lifecycle
  freshness protocol
  UI state machine
  generic API / provider layer

under-architecture:
  raw Workgraph as public API
  Vextreme / UI becomes WorkState owner
  private runtime CURRENT published for "liveness"
  Parking Lot collapsed into Project
  attractive HTML accepted without deterministic truth proof
~~~

Its Reflection 3 converged on:

~~~text
human outcome
-> rightful existing truth owner
-> smallest missing seam
-> exact proof of that seam
-> observe
-> continue until causal obligation retires
~~~

## Locked plan — human outcome

The fresh instance understood the historical Work as:

> A human or agent should be able to visit a stable public VexWork surface and answer ordinary questions
> about active/done/waiting/blocked/verifying work, Project membership, dependencies, and parked work
> without requiring the checkout, Node, CLI, or knowledge of Workgraph internals.

It preserved:

~~~text
PUBLIC SURFACE
= read projection of VexWork truth

PUBLIC SURFACE
!= second work system
~~~

## Rightful owners preserved

The plan retained:

~~~text
Workgraph
  canonical work identity / topology / lifecycle

Project
  bounded grouping

src/core/work-board.mjs
  existing Board / Graph / Parking Lot projection semantics

board.view.json
  Board presentation ordering

source-managed source files
  public source snapshot

runtime persistence
  private/live runtime owner
  not silently published
~~~

It reused the existing projection boundary rather than teaching a public UI to interpret Workgraph.

## Proposed architecture

The locked plan proposed one versioned **Public Workspace** composition:

~~~text
source-managed Workgraph
+ Project
+ Board ViewDefinition
       |
       +-> projectWorkBoard()
       +-> projectWorkGraph()
       +-> projectParkingLot()
                |
                v
       PUBLIC WORKSPACE PROJECTION
                |
       deterministic generated JSON
          /                 \
     human reader         agent reader
~~~

The composition layer would not reimplement lifecycle, Project membership, dependency, or Parking
semantics.

The UI would remain a read-only consumer.

## Proposed source slice

The plan proposed approximately:

~~~text
docs/foundation/PUBLIC-WORKSPACE.md
src/core/public-workspace.mjs
scripts/public-workspace.mjs
public/workspace.json
public/index.html
public/workspace-reader.js
test/public-workspace.test.mjs
docs/foundation/INDEX.md
package.json
~~~

It explicitly said it would verify those paths were absent in the historical snapshot before creating
them and would not widen ownership without implementation evidence.

This differs materially from both the historical accepted source layout and later/current VexWork
layout, which is evidence against simple textual imitation.

## Proposed public contract

~~~text
vexwork.public-workspace/v1

project identity / purpose

source:
  graphRef
  graphSemanticFingerprint
  boardViewRef

board
  existing Work Board projection

graph
  existing bounded Project graph projection

parkingLot
  existing Parking Lot projection

effects=false
executionAuthority=NONE

semanticFingerprint
~~~

Parking Lot remained a sibling:

~~~text
publicWorkspace
  project
  board
  graph
  parkingLot
~~~

and explicitly did not become Project membership or a Board lane.

## Currentness / drift strategy

The plan defined:

~~~text
PUBLIC_CURRENT
=
deterministic projection of source-managed inputs
at the deployed VexWork source revision
~~~

It rejected:

~~~text
private runtime CURRENT
latest chat
provider timestamp
nondeterministic generatedAt freshness
~~~

It proposed exact deterministic regeneration and failure on checked-in artifact drift.

It also kept future public-live runtime publication as a separate boundary that must be earned later.

## Proof plan

The locked plan proposed proof for:

~~~text
public Board equals canonical Board projection
public Graph equals canonical Graph projection
public Parking Lot equals canonical Parking projection

parked item:
  appears in Parking Lot
  does not become Project membership

effects=false
executionAuthority=NONE

static reader has no write / transition / provider mutation route

deterministic generation

stale checked-in artifact fails drift check

public schema contains only admitted fields

existing repository tests/check remain green

rendered human surface actually exposes useful Project / Board / relationship / Parking truth
~~~

It distinguished deterministic source proof from the lived human-exploration claim.

## Explicit non-goals

The plan refused:

~~~text
second WorkState / lifecycle owner
public database
public copy of private runtime CURRENT
provider synchronization engine
Parking Lot Project / Board lane
drag/drop mutation
WorkAct / WorkEffect execution from public page
authentication machinery for a public read-only surface
generic REST server when static artifact suffices
UI-owned Workgraph semantics
raw Workgraph as public API
generic dashboard framework
cross-repository source authority in Vextreme
automatic live polling
~~~

## Recommendation self-challenge

The fresh instance explicitly identified its own largest design risk:

~~~text
Public Workspace envelope
could become another semantic owner
~~~

and bounded it by requiring:

~~~text
thin composition
+ equality against rightful projector outputs
+ no lifecycle / membership / Parking reinterpretation
~~~

It also identified public-contract compatibility debt from exposing too much raw Workgraph truth.

## Comparison to historical accepted completion

The historical accepted solution was smaller:

~~~text
Project
+ Work Board
+ Parking Lot
-> vexwork.public-work-dashboard/v1
-> deterministic public/work-dashboard.json
-> build/check drift proof
~~~

The A002 plan converged on the important accepted boundaries:

~~~text
VexWork remains truth owner
bounded public projection
Parking Lot remains sibling
public surface has no effect authority
private runtime currentness remains separate
deterministic drift proof
lived/public observation remains distinct from deterministic source proof
~~~

A002 did **not** reproduce the historical implementation exactly.

It added:

~~~text
Graph projection
Public Workspace envelope
agent + human shared contract
static public human explorer
richer source slice
~~~

That is a broader plan than the historical first completion.

## Comparison to later/current VexWork

Later/current VexWork now contains:

~~~text
src/core/public-workspace.mjs
PUBLIC_WORKSPACE_SCHEMA = vexwork.public-workspace/v1

public/workspace.json
schemaVersion = vexwork.public-workspace/v1

read-only human workspace surface
effects=false
executionAuthority=NONE
Parking Lot as sibling
~~~

A002 therefore also converged directionally with architecture that later independent pressure earned.

Because A002 passed the source-leak audit, that later resemblance is useful evidence of judgment rather
than a known solution leak.

It is still not proof that A002's exact proposed implementation would have been the best historical
first commit. The accepted historical dashboard was deliberately smaller.

## Evaluator result

~~~text
CONVERGENT_JUDGMENT

not:
  EXACT_MATCH

not:
  PROOF_OF_UNIVERSAL_METHOD

not:
  AUTOMATICALLY_BETTER_THAN_HISTORY
~~~

The useful result is that a freshly oriented instance, without the accepted solution, preserved the same
causal ownership/currentness/proof boundaries and proposed a plausible architecture that later VexWork
pressure independently approached.

## What generalizes

~~~text
orientation can support independent architecture judgment
without requiring predecessor solution theory

blindness must be end-to-end

compare causal boundaries rather than exact wording

historical accepted solution is comparison evidence
not an answer the fresh plan must imitate

later architecture may help evaluate directionality
only after the blind plan is locked
~~~

## What does not generalize

Do not infer:

~~~text
every fresh instance will reach Public Workspace
Public Workspace was the only valid historical solution
a richer plan is automatically better than the smaller accepted commit
one successful blind trial proves Pink complete
same noun = same reasoning
~~~

## Reopen condition

Repeat with materially different completed work.

Pink should not be declared generally validated until the orientation relationship survives cases with
different ownership, proof, runtime, and human-boundary pressures.

<!-- [VXG RealForever][VEXWORK][PINK-ONBOARDING][PRIME-EXAMPLE-03] -->
