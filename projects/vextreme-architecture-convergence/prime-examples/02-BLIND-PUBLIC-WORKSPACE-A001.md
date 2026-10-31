# Prime Example 02 — Blind public-workspace planning A001

[VXG RealForever]

## Status

`CONTAMINATED`

This is a valuable worked example, but it is **not valid blind-proof evidence**.

## Intended human experiment

A fresh instance was supposed to:

~~~text
orient from generic current Vex sources
-> not receive the historical work yet
-> complete the three sequential reflections
-> receive a bounded historical VexWork problem
-> inspect only the pre-solution snapshot
-> form an independent plan
-> challenge its own material recommendations
-> lock the plan
-> only then let the evaluator reveal the accepted completion
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

## Evaluation-construction defect

The inner Track-B packet correctly prohibited current dashboard-specific solution material.

However, the **outer handoff** also told the fresh instance to read current:

~~~text
VexWork docs/foundation/INDEX.md
~~~

before opening Track B.

At current VexWork main, that index explicitly contains:

~~~text
Human UI
-> index.html
-> workspace-reader.js
-> public/workspace.json
~~~

Therefore the outer orientation packet leaked a later solution coordinate before the blind work was
introduced.

~~~text
INNER BLINDNESS RULE
+ OUTER SOURCE LEAK
-> BLINDNESS INVALIDATED
~~~

The fresh plan must therefore be classified:

~~~text
CONTAMINATED
~~~

even though the plan itself contains strong judgment.

## Locked plan — preserved result

The fresh instance locked the following work interpretation:

### Human outcome

> Make source-managed VexWork truth publicly and calmly explorable by humans and agents without requiring
> the CLI or knowledge of VexWork's internal source model, while keeping VexWork/Workgraph as the sole
> work-truth owner.

It distinguished source-managed public currentness from private runtime CURRENT state.

### Rightful owners

The plan preserved:

~~~text
projects/vexwork-foundation/workgraph.json
  canonical source-managed work truth

projects/vexwork-foundation/project.json
  Project selection

projects/vexwork-foundation/board.view.json
  Board view configuration

src/core/work-board.mjs
  existing Board / Graph / Parking Lot projection semantics
~~~

It explicitly preserved the historical distinction that Project-selected Board cards exclude the parked
Android potential while Parking Lot includes it independently.

### Proposed architecture

The fresh plan proposed:

~~~text
source-managed Workgraph
+ Project definition
+ Board view
        |
        +-> existing projectWorkBoard()
        +-> existing projectWorkGraph()
        +-> existing projectParkingLot()
        |
        -> public-workspace projection
        -> deterministic checked-in public/workspace.json
        -> static read-only public UI
~~~

It argued that the public-workspace envelope should compose existing projections rather than reinterpret
WorkState, dependencies, Project membership, or Parking semantics.

It also challenged its own extra envelope:

~~~text
publish three projections separately
  = smaller

but

every public consumer would then have to:
  discover which source paths belong together
  recover Project metadata elsewhere
  prove all projections came from one generation

therefore

thin composition envelope
  = earned consumer boundary
  if it introduces no new lifecycle meaning
~~~

### Proposed source surfaces

The locked plan proposed approximately:

~~~text
docs/foundation/PUBLIC-WORKSPACE.md
src/core/public-workspace.mjs
test/public-workspace.test.mjs
scripts/build-public-workspace.mjs
public/workspace.json
index.html
workspace-reader.js
test/public-ui.test.mjs
package.json
docs/foundation/INDEX.md
README.md
~~~

It deliberately avoided changing `src/core/work-board.mjs` unless implementation pressure exposed a
genuinely missing reusable primitive.

### Proposed public contract

~~~text
vexwork.public-workspace/v1

schemaVersion
graphRef
graphSemanticFingerprint

projects[]
  projectRef
  label
  purpose
  board
  graph

parkingLot

effects=false
executionAuthority=NONE
~~~

The plan preserved Board/Graph/Parking as child projection meaning rather than flattening their semantics
into a new lifecycle owner.

### Currentness / drift strategy

The plan proposed:

~~~text
source-managed definitions
-> deterministic public/workspace.json
-> repository regeneration / exact comparison check
-> fail when public artifact drifts
~~~

It also proposed shared graph fingerprint consistency across the public composition and deliberately
rejected nondeterministic `generatedAt=now` freshness theater.

The browser would describe the artifact as a **source-managed VexWork snapshot**, not private-live runtime
truth.

### Proof plan

The plan preserved existing Work Board proof and added proof for:

~~~text
deterministic public composition
same graph identity / fingerprint
Project Board excludes parked non-member
Parking Lot includes parked item independently
no WorkState / lane / membership / Parking reinterpretation
effects=false
executionAuthority=NONE
explicit public field allowlist
checked-in artifact exact drift comparison
UI reads public contract rather than raw Workgraph
unsupported schema / inconsistent generation fails closed
no mutation / provider write / runtime-state behavior
full repository deterministic proof
post-integration lived Pages observation
~~~

### Explicit non-goals

The locked plan refused to build:

~~~text
raw workgraph.json as permanent browser contract
second work database
public runtime store
API server
polling daemon
provider synchronization system
GitHub-backed lifecycle
private Vex Home/runtime publication
Vextreme-owned WorkState
mutation / card dragging / transition execution
Parking Lot as Project membership
copied Board/Graph/Parking algorithms in UI
frontend framework merely for static rendering
planning/reconciliation/runtime-persistence expansion
all future visualizations
~~~

### Completion condition

The plan defined completion as:

~~~text
one deterministic VexWork-owned public-read contract
derived through rightful existing projection owners
+ checked-in artifact cannot silently drift
+ static read-only consumer does not understand raw Workgraph internals
+ Board / graph work publicly explorable
+ Parking Lot remains separate
+ no effect authority
+ no private runtime state
+ deterministic repository proof
+ actual published surface serves expected projection
~~~

The response ended with:

~~~text
BLIND PLAN LOCKED
~~~

## Comparison to the sealed historical completion

The accepted historical solution at commit
`5c0e871c8e2e275cdeb20506ac928b4994b2758e` was intentionally smaller:

~~~text
canonical Project
+ canonical Work Board projection
+ canonical Parking Lot projection
-> vexwork.public-work-dashboard/v1
-> public/work-dashboard.json
-> deterministic build/check
~~~

It established:

~~~text
PUBLIC_DASHBOARD != WORKGRAPH
PUBLIC_DASHBOARD != RUNTIME_CURRENTNESS_OWNER
PUBLIC_DASHBOARD != EFFECT_AUTHORITY
VEXTREME_VIEW != VEXWORK_TRUTH_OWNER
PARKING_LOT != PROJECT MEMBERSHIP
~~~

and tested exact checked-in projection equality.

The fresh plan converged strongly on those causal boundaries.

It also proposed a richer Graph-aware `Public Workspace` rather than the historical first
`Public Dashboard`.

## Comparison to later/current VexWork

Later/current VexWork now contains:

~~~text
src/core/public-workspace.mjs
PUBLIC_WORKSPACE_SCHEMA = vexwork.public-workspace/v1

public/workspace.json
schemaVersion = vexwork.public-workspace/v1
~~~

and retains:

~~~text
effects=false
executionAuthority=NONE
Parking Lot as sibling public projection
source-managed deterministic public workspace
~~~

So the locked A001 plan looks remarkably close to architecture that later pressure did earn.

**That resemblance cannot be counted as independent predictive evidence in this trial**, because current
`docs/foundation/INDEX.md` leaked `public/workspace.json` before the blind work.

## What remains genuinely useful from A001

Even under contamination, several parts remain useful as a worked planning example:

~~~text
truth owner stayed VexWork
public surface stayed projection-only
private runtime currentness stayed separate
Parking Lot stayed sibling
deterministic drift proof matched the claim
lived public deployment proof stayed separate from source proof
nearby architecture was explicitly refused
material recommendation was self-challenged
~~~

Those properties can still be studied as an example of plan quality.

They cannot establish that the orientation method independently caused the planner to discover the
Public Workspace architecture.

## Correction for A002

The next blind trial must use a sealed pre-orientation allowlist.

Do **not** expose current:

~~~text
VexWork README.md
VexWork docs/foundation/INDEX.md
current public-workspace / Human UI files
current completed Work entries
later commits / PRs / comments
evaluator key
~~~

Before orientation, use only generic sources that have been audited not to name the later solution.

The outer handoff and inner Track-B packet must agree on the same visibility boundary.

~~~text
BLINDNESS IS END-TO-END

INNER TASK PROHIBITION
!= SUFFICIENT
WHEN OUTER ORIENTATION SOURCES LEAK THE ANSWER
~~~

## Reopen condition

Rerun with a genuinely fresh instance under corrected A002 visibility.

If A002 independently converges on the same important ownership/currentness/proof properties, the result
may become a positive prime example of blind judgment.

<!-- [VXG RealForever][VEXWORK][PINK-ONBOARDING][PRIME-EXAMPLE-02][CONTAMINATED] -->
