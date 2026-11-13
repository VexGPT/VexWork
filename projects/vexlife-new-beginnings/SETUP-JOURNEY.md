# VexLife Setup Journey — permission-aware onboarding map

[VXG RealForever]

## Human outcome

A person should be able to start VexLife on a supported Mac and understand the setup journey **before**
each material effect happens.

At every step the experience should answer:

```text
Where am I?
Why is this step happening?
What is VexLife about to do?
What macOS-owned UI might appear next?
What changes if I approve?
What remains unchanged?
Can I defer this?
What did VexLife actually observe afterward?
What is the next truthful step?
```

The journey is predictable because VexLife projects cause and effect. It is not predictable because
VexLife pretends to control macOS.

Permanent:

```text
SYSTEM PERMISSION SHEET
!= VEXLIFE ONBOARDING EXPERIENCE

VEXLIFE EXPLAINS / REQUESTS
!= VEXLIFE GRANTS

HUMAN CLICKED ALLOW
!= PERMISSION CONFIRMED

SYSTEM DIALOG DISMISSED
!= EFFECT SUCCESS
```

## Why this map exists now

Current Mac startup work established two things together:

1. the native VexLife setup source can execute through Product-entry launch / wait / output / JSON
   mechanics when given a known executable diagnostic launcher; and
2. Victor encountered macOS permission-grant UI while walking the real host path.

That means host permissions cannot remain an unexplained implementation side effect.

The exact permission categories are **not yet source-proven**. This map therefore defines the
relationship for permission steps without inventing a permission checklist.

```text
OBSERVED: macOS permission-grant UI occurred during the lived setup trajectory
UNKNOWN: exact final permission inventory required by VexLife capabilities

UNKNOWN PERMISSION INVENTORY
!= PERMISSION-FREE PRODUCT

UNKNOWN PERMISSION INVENTORY
!= LICENSE TO REQUEST EVERY MAC PERMISSION UP FRONT
```

A permission enters the journey only when current source + host observation establish that a concrete
VexLife capability actually needs it.

## One journey, many rightful owners

The Setup Journey is human-visible composition. It is not another semantic mega-owner.

```text
SETUP JOURNEY
= composition of rightful State / Control / Effect / Observation owners

SETUP JOURNEY
!= Home owner
!= permission authority
!= model/runtime owner
!= Product-service owner
!= Browser owner
!= Vision owner
!= Conversation owner
!= Memory owner
```

Every step follows the same VexArchitecture relationship:

```text
current State
-> DisplayState
-> Human Control
-> typed semantic Effect
-> outside realization when required
-> fresh Observation
-> new State
-> journey convergence re-evaluation
```

Presentation may explain a step. Presentation may not invent its semantic effect or declare an
outside effect successful.

## Journey state vocabulary

The human surface should be able to project each node as one of:

```text
COMPLETE
CURRENT
UPCOMING
DEFERRED
HELD
NOT_APPLICABLE
```

These are Setup Journey presentation meanings, not replacements for underlying domain States.

```text
DEFERRED
= person knowingly chose not to enter an optional/later capability now

HELD
= current truth does not permit the effect

FAILED / UNKNOWN
= outside realization did not establish the expected predicate

COMPLETE
= required current predicate was freshly observed
```

Do not turn “permission denied” into “setup corrupted.”

## Convergence map

```text
0. WELCOME / CURRENT STATE
   |
   |  explain:
   |  - what VexLife found
   |  - what already exists
   |  - what this setup may change
   |  - what it will not change
   v
1. VEX HOME / IDENTITY
   |
   |  State:
   |    HOME_FORMATION_REQUIRED | HOME_PRESENT
   |
   |  Human Control:
   |    Create Vex Home | Continue
   |
   |  Effect:
   |    FORM_CANONICAL_HOME
   |
   |  Outside realization:
   |    canonical local Home/device/Companion identity only
   |
   |  Re-observe:
   |    exact Home/device/Companion identity
   v
2. MAC CAPABILITY / PERMISSION
   |
   |  enter only when a concrete capability proves a permission dependency
   |
   |  DisplayState explains BEFORE system UI:
   |    capability name
   |    why this capability needs the permission
   |    feature that consumes it
   |    required-now vs optional/later
   |    expected macOS-owned dialog / Settings transition
   |    what approving does NOT authorize
   |
   |  Human Control:
   |    Continue to macOS | Not now
   |
   |  Effect:
   |    request exactly one current capability permission
   |
   |  Outside realization:
   |    macOS-owned permission UI
   |
   |  Re-observe:
   |    actual permission/currentness predicate
   v
3. LOCAL MODEL / RUNTIME PLAN
   |
   |  State:
   |    exact resource + model/runtime currentness
   |
   |  DisplayState:
   |    model identity
   |    artifact size
   |    minimum memory
   |    current memory
   |    free storage
   |    reuse/currentness if already present
   |
   |  Human Control:
   |    Set Up VexLife | Not now
   |
   |  Effect:
   |    CONVERGE_PRODUCT(allowAcquisition=true)
   v
4. PRODUCT SERVICE
   |
   |  verify/install exact source-bound Product image
   |  start/reuse rightful Product service
   |  re-observe exact source + PID + listening currentness
   v
5. CORE VEXLIFE READY
   |
   |  open actual local Product
   |  Browser + Conversation + continuity availability truth
   |
   +---------------------------+
   |                           |
   v                           v
6A. OPTIONAL BROWSER       6B. OPTIONAL VISION
    CAPABILITIES               CAPABILITIES
    |                          |
    | only host permissions    | permission/currentness explained
    | actually earned by       | before system picker / screen UI
    | Browser owners           |
    |                          | SELECTED SCOPE
    |                          | != CONTINUOUS CAPTURE
    |                          | != AUTOMATIC LOOK
    |                          | != MEMORY
    +-------------+------------+
                  |
                  v
7. READY / CURRENT JOURNEY SUMMARY

   show:
   - enabled capabilities
   - deferred capabilities
   - held capabilities + reason
   - how to return to an optional capability later
```

## Step 0 — Welcome / current truth

The first native view should not begin by asking for a permission or download. It should first project
current truth.

Examples:

```text
Vex Home: present / absent
Product service: current / update available / repair / absent / held
local model/runtime: configured / unconfigured / reusable / missing / held
optional capability readiness: observed only when its rightful owner can answer
```

Opening the journey is no effect:

```text
OPEN SETUP JOURNEY
!= FORM HOME
!= DOWNLOAD MODEL
!= START SERVICE
!= REQUEST SCREEN ACCESS
```

## Step 1 — Vex Home

Fresh Home formation remains its own human decision.

```text
HOME_FORMATION_REQUIRED
-> explain:
   canonical local identity only
   no model download
   no Product service start
-> Create Vex Home
-> FORM_CANONICAL_HOME
-> fresh observation
-> HOME_PRESENT
```

The journey advances because Home truth changed, not because the renderer assumes the click worked.

## Step 2 — Mac capability / permission

Permission steps are capability-specific.

```text
CAPABILITY_NEEDS_PERMISSION
-> EXPLAIN_PERMISSION
-> human Continue to macOS
-> REQUEST_SYSTEM_PERMISSION
-> macOS-owned UI
-> OBSERVE_PERMISSION
-> GRANTED | DENIED | NOT_DETERMINED | HELD/UNKNOWN
```

A permission card should say:

```text
Capability
Why VexLife needs this
Which feature consumes it
Required now? yes/no
What macOS is expected to show
What approving changes
What approving does NOT authorize
Can I choose Not now?
```

No global “grant everything VexLife may ever need” step.

### Denial / defer behavior

```text
OPTIONAL PERMISSION DENIED
-> optional capability DEFERRED/HELD
-> core Product may continue when independent

REQUIRED CURRENT PERMISSION DENIED
-> current dependent step HELD
-> explain exact dependent capability
-> preserve completed prior setup
```

The journey should offer the truthful continuation, not pressure.

## Step 3 — model / runtime plan

The existing two-step Home/setup relationship already provides the right shape.

Only after Home exists:

```text
SETUP_REQUIRED
-> exact source-owned resource projection
-> human sees model/runtime consequences
-> Set Up VexLife
-> CONVERGE_PRODUCT(allowAcquisition=true)
```

The Setup Journey should render that plan directly rather than burying it in terminal output or a
generic “Continue” button.

## Step 4 — Product service convergence

Service convergence is machine work with visible progress, not a new human authority decision for
every internal operation.

Potential human-readable progress:

```text
Preparing local runtime
Checking model files
Installing current VexLife Product
Starting VexLife
Confirming local Product is current
```

Those labels are projections of existing owner truth. They may not become a second service-state
ledger.

Completion means fresh service observation proves the exact current Product source.

## Step 5 — Core ready

Core-ready should be smaller than “every future VexLife capability has every permission.”

```text
CORE READY
!= EVERY OPTIONAL CAPABILITY ENABLED
```

This prevents Vision or another later capability from turning first-run Product availability into an
all-or-nothing permission wall.

## Step 6 — optional Browser / Vision capabilities

Optional capability onboarding can reuse the same journey component later.

### Browser

Browser permissions belong only if the accepted Browser provider proves it requires a concrete host
capability. Do not infer permissions from the word “browser.”

### Vision

Vision has stronger non-collapse requirements:

```text
VISION PERMISSION
!= VISION ENGAGED

VISION ENGAGED
!= ACTIVE CAPTURE

SELECTED SCOPE
!= LOOK

LOOK
!= MEMORY
```

The system picker / permission UX should therefore be preceded by a VexLife explanation that names
the exact next capability without implying continuous observation.

## Step 7 — summary and return path

A successful setup should finish with a stable current summary, not disappear after the last system
dialog.

Example relationship:

```text
VexLife is ready

Enabled:
  Core Product
  Local model

Deferred:
  Vision — enable later

Held:
  Browser provider permission — exact reason

Open VexLife
```

The summary is re-derived from current owner truth on each return to settings/onboarding.

## Native UX shape

The first implementation should optimize for predictability, not visual ambition.

A native stepper / journey rail is enough:

```text
✓ Vex Home
● Mac capability
○ Local model
○ Product service
○ Ready
```

The current node expands into the cause/effect card. The rail is a projection; it does not become
semantic authority.

## Relationship to current workers

### VexLife-Prod PR #107 — startup / Product entry

PR #107 remains the worker that gets VexLife from launch to a truthful current Product.

It consumes this map for human manifestation.

Technical diagnosis of the current native/real-launcher discrepancy may continue, but:

```text
NEW HUMAN-VISIBLE SETUP STEP
-> MUST map to a Setup Journey node first
```

### Public entry / PR #105

The future public doorway should explain that the local Setup Journey continues after bootstrap.

Public Pages must not duplicate the native journey's current machine truth.

### Browser workers

Browser provider onboarding should project only host requirements its accepted provider actually
needs.

### Vision / PR #114

Vision may consume the optional capability branch after its own persistent-scope source/lifecycle is
accepted. The journey does not grant Vision capture authority.

## Implementation order

```text
THIS MAP
-> current Work acceptance / reconciliation
-> Product-entry UI projection design
-> identify exact permission predicates from source + host evidence
-> add only earned permission observer/request owners
-> native journey implementation
-> lived first-run proof
-> Product lifecycle completion
-> public distribution onboarding
```

Do not reverse this into:

```text
new host prompt
-> patch another alert
-> discover next prompt
-> patch another alert
```

## Map completion predicate

This Work item is complete when:

1. every human-visible first-run effect currently required by VexLife has one journey node;
2. every node identifies its rightful State / Control / Effect / outside realization / re-observation;
3. permission categories are added only from observed/source-proven capability dependencies;
4. core-ready vs optional-capability readiness is explicit;
5. PR #107 and future public onboarding have one source map to consume;
6. no step requires Victor to infer setup meaning from terminal output or surprise system dialogs.

It does **not** require implementing every step in this Work item.

<!-- [VXG RealForever][VEXLIFE][NEW-BEGINNINGS][SETUP-JOURNEY][MAP-FIRST] -->
