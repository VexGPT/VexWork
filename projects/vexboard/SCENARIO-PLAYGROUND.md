# VexBoard — Screen Lens Scenario Playground

[VXG RealForever]

## Status

Update (projectability work): the *source-backed* half of this idea now exists as a bounded context,
not a third face. See `SCREEN-LENS-PROJECTABILITY.md`:

~~~text
RESTORED CANDIDATE   Expressions: one context dimension over all four faces (rail + Surface carousel;
                      Behavior/Depth draw how each is reached). Each expression is an immutable
                      browser-local context over source presence relationships (open, select,
                      rows / no items, choose a source-written branch) or a source-authored example;
                      never stored
STILL PARKED          VexBoard-proposed content (Design Draft), substitution, snackbars,
                      simulated next interactions / transitions
~~~

Admitting the remaining half still needs its own Work admission and handshake.

~~~text
CAPTURED FUTURE FEATURE
!= current Screen Lens review scope
!= PR #238 acceptance requirement
!= VexLife-Android mutation authority
!= admitted implementation
~~~

This note preserves a future Screen Lens / VexBoard feature idea discovered while reviewing the current
Living Screen Lens trajectory. Its purpose is continuity: a future instance should not have to reconstruct
the intent, the already-proven source seams, or the architectural boundaries from chat.

Current name:

~~~text
Scenario Playground
~~~

The name is product-facing shorthand, not a new semantic owner.

## Human intention

Let a person stay inside the current Screen Lens neighborhood and explore:

- what a source-projected Screen looks like after a control is stimulated;
- what alternate source-backed or explicitly proposed state would make visible;
- what content could occupy an already-addressable panel/container;
- what a proposed button/text/panel/snackbar or substitution would look like inside the current bounds;
- what next interaction or consequence could follow;
- how to reset the experiment without changing source truth;
- which parts are current source, proposed design, ephemeral scenario, or observed evidence.

The ordinary interaction should feel like:

~~~text
CURRENT SCREEN
  -> select control / panel
  -> Run simulation
  -> inspect resulting Screen state
  -> change one scenario input
  -> see projection update live
  -> optionally add / remove / substitute proposed content
  -> continue the next simulated interaction
  -> Reset simulation
  -> optionally keep useful proposal as a Design Draft
~~~

The feature is exploratory and effect-free unless a later separately admitted workflow explicitly constructs
target source.

## Screen Lens relationship

The current Screen Lens has two faces on each side:

~~~text
EXPERIENCE                       MEANING

Surface                          Behavior
what the human sees/touches      what the interaction means

Structure                        Depth
where it lives / is composed     what current source/runtime truth sits underneath
~~~

Scenario Playground can pressure a third face on each side without changing the meaning of the existing
faces:

~~~text
EXPERIENCE                       MEANING

Surface                          Behavior
Structure                        Depth
Scenario                         Playground
~~~

Interpretation:

~~~text
Scenario
  what this Screen would look like under the selected interaction / state / proposal

Playground
  which bounded inputs, state choices, proposed elements or simulated consequences
  can be manipulated to change that Scenario projection
~~~

"Scenario" is not another source layer. "Playground" is not another architecture Depth.

~~~text
SCENARIO != SOURCE TRUTH
PLAYGROUND != RUNTIME AUTHORITY
SIMULATION != EXTERNAL EFFECT
~~~

## Visual continuity

A representative wide-screen composition:

~~~text
          EXPERIENCE / LEFT                     MEANING / RIGHT

  Surface  Structure  [Scenario]        Behavior  Depth  [Playground]

  +-----------------------------+       +------------------------------+
  | VexStream Music             |       | Connection scenario          |
  |                             |       | [ Connection failed       v ]|
  | Connection                  |       |                              |
  | Couldn't connect            |       | Proposed content             |
  |                             |       | + Text                       |
  | [ Retry ]                   |       | + Button                     |
  |                             |       | + Panel                      |
  | +-------------------------+ |       |                              |
  | | Couldn't connect  RETRY | |       | Presentation                 |
  | +-------------------------+ |       | [x] Snackbar                 |
  |                             |       |                              |
  +-----------------------------+       | [ Reset simulation ]         |
                                        +------------------------------+
~~~

A control can expose the next unresolved relationship directly:

~~~text
proposed Retry button
  -> no consequence bound yet

Playground:
  + set scenario value
  + open / close overlay
  + navigate
  + bind to an already-projected semantic relationship
  + leave UNBOUND
~~~

This should make an unresolved next edge visible rather than inventing one.

## Existing implementation seams already present

This feature is not a greenfield architecture.

### 1. BoardPrototype / BoardScenario already own effect-free simulation

Current source:

~~~text
src/shared/vexboard-simulation.mjs
~~~

Already provides:

~~~text
BoardPrototype
BoardScenario
scenario values
conditions:
  EQUALS
  NOT_EQUALS
  TRUTHY
  FALSY
condition states:
  TRUE
  FALSE
  UNKNOWN
simulated actions:
  NAVIGATE_TO_SCENE
  FOCUS_NODE
  OPEN_OVERLAY
  CLOSE_OVERLAY
  SET_SCENARIO_VALUE
  RETURN
  EMIT_SIMULATED_EVENT
~~~

This is the first rightful owner to reuse.

Do not create a second simulation engine merely because Screen Lens gains a Scenario face.

### 2. ScreenDesign already knows proposed design meaning

Current source:

~~~text
src/core/vexboard-screen-design.mjs
~~~

Current authority vocabulary includes:

~~~text
REVERSE_ADOPTED_CANDIDATE
VEXBOARD_DESIGN_DRAFT
VEXBOARD_DESIGN_AUTHORITY
~~~

Current component templates already include:

~~~text
component.screen
component.surface
component.column
component.text
component.button
component.icon-button
component.tab
component.fab
component.modal-bottom-sheet
~~~

Current layout / projection support already includes:

~~~text
parentSemanticRef
componentAssignments
layoutRules
constraints
anchorRules
intrinsicSizes
viewport profiles
responsive metrics

resolveScreenDesignBox(...)
resolveScreenDesignConstraintBox(...)
resolveScreenDesignAnchorBox(...)
~~~

Therefore a proposed element can eventually be resolved relative to a real source-projected container without
making canvas x/y canonical design truth.

### 3. A narrow source + proposed composition is already proven

Current proving source:

~~~text
projects/vexboard/examples/vexlife-android-home-vexstream.design.json
projects/vexboard/examples/vexlife-android-home-vexstream.snapshot.json
src/core/vexboard-android-source-projector.mjs
~~~

The current Home / VexStream reverse-adoption POC already composes:

~~~text
source-projected parent
  element.home.body.vexstream

with VexBoard-proposed children
  element.home.body.vexstream.title
  element.home.body.vexstream.status
  element.home.body.vexstream.body

and a source-backed control
  element.home.body.systems.vexstream-music
~~~

under one VexBoard-owned layout rule.

Those proposed semantic elements currently have:

~~~text
identityState = VEXBOARD_PROPOSED
kind = TEXT
originForm = VexTextOrigin
~~~

The narrowness is important. It proves the composition relationship without yet proving generic proposed
buttons/panels.

The next consumer should generalize only what the Scenario Playground actually needs.

## Proposed-vs-source identity rule

Do not create:

~~~text
MockButton
MockPanel
MockText
MockState
MockRelationship
~~~

"Mocked" or "proposed" is a relationship to current truth, not the element's semantic kind.

Prefer:

~~~text
semantic identity / form:
  Button
  Panel
  Text
  Container
  ...

truth / authority relationship:
  SOURCE_PROJECTED
  VEXBOARD_PROPOSED
  ACCEPTED_DESIGN
  TARGET_REALIZED
  OBSERVED
~~~

A future proposed button should remain the same semantic thing if it later graduates from proposal to accepted
design to target realization.

~~~text
PROPOSED_BUTTON_ID
-> accepted design
-> target realization

not:

MockButton
-> delete / replace
-> RealButton
~~~

## Scenario and product State must remain distinct

Two cases are different.

### Existing source-owned State

Example:

~~~text
NotPaired
Searching
ConfirmCode
Paired
~~~

If source proves the State relationship, Scenario Playground may offer it as a source-backed scenario choice.

### Hypothetical design scenario

Example:

~~~text
connectionFailed = true
~~~

when no such source-owned product State currently exists.

That remains:

~~~text
VEXBOARD PROPOSED SCENARIO
~~~

not:

~~~text
VEXLIFE-ANDROID STATE
~~~

until source truth actually establishes it.

A useful UI distinction:

~~~text
SOURCE STATE
  Searching

PROPOSED SCENARIO
  Connection failure
~~~

## Proposed content inside source-backed bounds

The reusable question is:

> Given a current semantic coordinate and its available projection space, what additional or substituted
> meaning could be proposed here, under what conditions, and what would that projection look like without
> claiming the proposal is current source truth?

Example:

~~~text
source-backed Connection panel
  -> current bounds / padding / gap / layout vocabulary

Playground proposal
  + Text "VexStream couldn't be reached."
  + Button "Retry"
  + Button "Use offline library"

Scenario
  connectionFailed = true

resolved Scenario projection
  -> proposed children placed inside the panel using current design constraints
~~~

Prefer parent/anchor/layout relationships over hard-coded canvas coordinates.

~~~text
button.TOP -> explanation.BOTTOM + spacing.medium
button.START -> panel.START
button.END -> panel.END

!=
button.x = 183
button.y = 420
~~~

Solved bounds are projection output.

## Substitution

A later consumer may pressure design-view substitution:

~~~text
SOURCE
  Refresh

DESIGN DRAFT
  Refresh suppressed in this Scenario / Design view
  Retry proposed
  Cancel proposed
~~~

The source-projected element remains inspectable and unchanged.

~~~text
SOURCE TRUTH != DESIGN DRAFT
~~~

Substitution should not silently delete or rewrite source meaning.

## Snackbars and other transient presentation

Snackbars are a useful proving example.

Do not make every Snackbar a universal BoardGraph semantic node by default.

A first proving shape can be:

~~~text
simulated event
  pairing-failed

-> presentation occurrence
   snackbar:
     message = "Couldn't connect"
     optional action = Retry
~~~

Current simulation already has overlay/event vocabulary that can pressure this.

For the first slice, persistence until Dismiss / Retry / Reset is preferable to inventing a generic simulated
clock. Timing should earn representation only when a consumer actually needs it.

## Reset semantics

Two resets should remain visibly distinct:

~~~text
Reset simulation
  -> clear scenario values
  -> close simulated overlays
  -> clear simulation interaction trail
  -> return to initial Scenario state
  -> KEEP proposed Design Draft

Discard design changes
  -> remove proposed additions / substitutions
  -> return to exact source projection
~~~

A later "Keep as design draft" action can deliberately graduate a useful ephemeral proposal into browser-local
VexBoard design work.

## Likely patient zero

The VexStream connection sheet is a strong first consumer because current projection already exposes:

~~~text
element.vexstream-music.body.connection.menu
~~~

and reverse-adoption source already contains derived/custom presentation pressure around its content.

A bounded proving scenario:

~~~text
current source-backed connection sheet
+ proposed scenario: connection failure
+ proposed text
+ proposed Retry button
+ optional snackbar
+ existing layout / bounds
+ no Android source mutation
~~~

This would prove the composition without requiring generic source generation.

## VexArchitecture ownership posture

Keep these owners distinct:

~~~text
SOURCE PROJECTION
  what VexLife-Android or another source actually establishes

DESIGN DRAFT
  what VexBoard proposes

SCENARIO
  ephemeral experiment input

SCENARIO PROJECTION
  what the combined current experiment looks like

SIMULATION
  effect-free transition / condition / overlay resolution
~~~

The existing simulation engine should remain the simulation owner.

~~~text
RUN_SIMULATION
-> browser-local Scenario State
-> externalEffectsPerformed = false
~~~

Do not create a new Family merely because simulation has State / input / consequence vocabulary.

## Relationship to current Screen Lens review

This feature was captured during the independent review of the current Screen Lens currentness/history
candidate.

It is explicitly out of scope for that correction.

Do not use Scenario Playground to:

- broaden PR #238;
- excuse current projection defects;
- change Stable/Main/Commit semantics;
- change historical projection rules;
- add source mutation authority;
- make VexBoard a second VexLife-Android owner.

First finish the current Screen Lens truth/currentness correction. Scenario Playground is a future consumer of
that trustworthy substrate.

## Resume coordinate

When this work is deliberately admitted later, begin from these sources before proposing new infrastructure:

~~~text
projects/vexboard/SCREEN-LENS.md
projects/vexboard/SEMANTIC-BLUEPRINT-IDE-FOUNDATION.md
src/shared/vexboard-simulation.mjs
src/core/vexboard-screen-design.mjs
src/core/vexboard-android-source-projector.mjs
projects/vexboard/examples/vexlife-android-home-vexstream.design.json
projects/vexboard/examples/vexlife-android-home-vexstream.snapshot.json
vexboard/index.html
vexboard/lens.html

work.vexboard.boardjourney-simulation
work.vexboard.source-projectors
work.vexboard.vexstream-screenshot-pilot
~~~

Then ask the smallest consumer question:

> Can one source-backed panel render one proposed child under one explicit Scenario condition, reset cleanly,
> and preserve a visible distinction between source truth and proposed design?

If yes, let that patient zero pressure the next reusable seam.

No generalized mock framework, adapter registry, timing engine, source mutation path or new lifecycle owner is
admitted by this capture.

<!-- [VXG RealForever][VEXWORK][VEXBOARD][SCREEN-LENS][SCENARIO-PLAYGROUND] -->
