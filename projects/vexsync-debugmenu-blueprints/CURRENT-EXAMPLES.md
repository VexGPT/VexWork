# VexSync DebugMenu Blueprints — Current Examples / Discovery Checkpoint

[VXG RealForever]

## Status

This is a current discovery companion, not an accepted schema, final process, canonical naming source or
completed feature example.

Its purpose is to preserve enough of the evolving reasoning that a future Victor/AI pair can continue
without turning illustrative pseudocode, guessed identifiers or missing implementation details into
architecture.

~~~text
CURRENT EXAMPLE
!= COMPLETED EXAMPLE
!= ACCEPTED SCHEMA
!= TARGET IMPLEMENTATION
!= PROOF
~~~

## How this companion is read

This file is the **causal exemplar and evolution companion** to the project README.

~~~text
README.md
  = canonical VexSync current entry / process map

CURRENT-EXAMPLES.md
  = worked examples + causal evolution + rejected alternatives + open pressure
  != an independent currentness oracle
~~~

A fresh instance starts from the README and comes here for the examples the current edge names. An older
fragment, sibling candidate or historical proposal remains useful only under its actual status.

For each material exemplar, preserve enough of this shape to stop future reconstruction:

~~~text
human pressure / original question
-> prior relevant examples already inherited
-> observed source / terrain
-> exact ambiguity exposed
-> candidates considered
-> failure / pressure that discriminated them
-> current surviving model
-> what was rejected or superseded and why
-> source/evidence coordinates
-> currentness status
-> reopen condition
-> next unresolved edge
~~~

The purpose is causal continuity, not private chain-of-thought. Preserve the externally useful reasons,
examples, counterexamples and evidence that explain why the current model exists.

## Inherited exemplar 1 — Origin postfix / same noun across target realizations

**Currentness:** `CURRENT_SIBLING_CANDIDATE_REFERENCE`.

**Source coordinate:** VexBoard PR #155,
`projects/vexboard/SEMANTIC-BLUEPRINT-IDE-FOUNDATION.md`.

**Important boundary:** PR #155 remains draft/unmerged. This is current VexBoard candidate reasoning,
not accepted VexWork-main doctrine.

The worked example is:

~~~text
origin.vexlife.vexstream.ConnectionStatusOrigin

android.vexlife.vexstream.ConnectionStatus
desktop.vexlife.vexstream.ConnectionStatus
web.vexlife.vexstream.ConnectionStatus
~~~

The reasoning carried by the example is:

~~~text
ConnectionStatus
  = reusable semantic noun

namespace/scope
  = where that definition or realization lives

Origin postfix
  = marks the canonical reusable definition when the distinction is needed

SAME ORIGIN
+ DIFFERENT TARGET
-> SAME REUSABLE SEMANTIC NAME
-> DIFFERENT REALIZATION SCOPE

TARGET DIFFERENCE
!= NEW SEMANTIC NOUN
~~~

Why this matters for later naming work:

- the target does not get to rename reusable meaning merely because its mechanics differ;
- the `Origin` postfix has a specific boundary job rather than being a decoration;
- already-clear semantic roles do not gain `Origin` merely for symmetry;
- a new specimen should test whether this pattern applies before inventing another canonical/target
  naming scheme.

**Reopen condition:** materially different consumer evidence shows that preserving the same reusable noun
across canonical definition and target realizations creates a false semantic equivalence or that the
postfix no longer identifies the rightful boundary.

## Inherited exemplar 2 — navigation -> ActId was pressure-tested and rejected

**Currentness:** `CURRENT_SIBLING_CANDIDATE_REFERENCE`.

**Source coordinate:** VexBoard PR #155 Origin/foundational-language candidate plus its preserved naming
evolution.

Earlier reasoning tried to improve semantic architecture by converting familiar navigation into an Act
identity:

~~~text
NavigateTo(Screen)
-> ActId("act...")
~~~

The article example exposed the ambiguity. A name such as:

~~~text
act.news.read-article
~~~

could mean fetch, parse, display, navigate, mark-read, or text-to-speech. Renaming it to
`request-article-view` added words without fixing the category error.

The surviving distinction is:

~~~text
ID
  identifies something

NavigateTo / Navigation.Open
  expresses a typed relationship / operation

ID != EXECUTION_MECHANISM
TYPED_NAVIGATION_OPERATION != ACT_ID
PRESENTATION_OPERATION != PORTABLE_ACT
~~~

SCAE depth remains available when a real Behavior question earns it. The Play/Pause specimen is useful
because the same physical Control has materially different semantic meaning under different State. A
simple article-card -> ArticleDetail relationship does not earn an Act merely for ceremony.

**Rejected:** mandatory conversion of ordinary navigation into opaque `ActId` values.

**Reopen condition:** a later specimen demonstrates a distinct independently addressable semantic Act
whose meaning cannot be carried truthfully by the typed relationship plus its rightful behavior owner.

## Inherited exemplar 3 — this Debug Menu specimen builds on those lessons

The current Debug Menu work therefore begins with inherited pressure already available:

~~~text
Origin/realization naming has a real worked example
typed navigation has survived an ActId failure case
IDs are not automatically operations
target mechanics do not automatically become portable meaning
~~~

The job here is not to re-derive those from scratch. It is to see what the theme-selection specimen
preserves, challenges, or adds.

## Method checkpoint

The strongest method discovered so far is:

~~~text
build the meaningful thing first
-> let real pressure reveal missing language
-> name/formalize repeated patterns after evidence
~~~

The current V2/Debug Menu specimen is therefore a language laboratory, not the consumer of a
predeclared universal intent/behavior/target schema.

## Terrain before in-betweens

The earlier discussion correctly slowed the process to the endpoints:

~~~text
KNOWN START
  Home / current reference

KNOWN ENTRY AFFORDANCE
  shell FAB / developer entry clue

KNOWN DESTINATION
  Debug Menu / draft design context

UNKNOWN
  the exact semantic terrain between them
~~~

The rule was:

~~~text
lock one known coordinate
-> discover only its immediate result
-> lock that result
-> ask the next question
-> repeat
~~~

Do not fill several unknown edges at once merely because a plausible implementation exists.

## What Builder investigation grounded from current Android

The first unknown can now be answered from current accepted Android source:

~~~text
AppShell.Elements.Add
  id = element.shell.fab.add
  current behavior = toggle(FabOptions)

FabOptions
  id = element.shell.fab-options
  contains DebugMenu / Gallery / UserProfile options

AppShell.Elements.DebugMenu
  id = element.debug-menu
  current behavior =
    close(FabOptions)
    then navigateTo(DebugMenuScreen)

DebugMenuScreen
  screenId = screen.debug-menu
~~~

This is the current reference terrain.

It is not automatically the future V2 design. Its value is that the Builder learned the path from source
rather than asking Victor to know target mechanics or inventing an intermediate surface.

## Phase 1 — Feature Request

Human input:

> As a user I want to be able to switch between dark and light mode in the Debug Menu.

Current interpretation:

~~~text
WHO
  User

GOAL
  choose/change application theme mode

CONTEXT
  Debug Menu

DESIRED INTERACTION
  theme mode selection/control
  exact form still design pressure

RETURN
  application reflects the selected theme mode
~~~

This is sufficient to understand the screen-local goal.

It is not, by itself, sufficient to claim a complete start-to-destination Journey.

### Scope-sensitive completeness

~~~text
known feature meaning
+ missing dependent edge
-> preserve known meaning
-> hold only the dependent claim
~~~

Do not reject the whole feature.
Do not silently infer the missing path.

## Function-call analogy

Use this only as a thinking aid:

~~~text
request(parameters / context)
-> return
~~~

The human usually owns:
- intention;
- constraints they care about;
- expected human-visible result.

The Builder/architect owns investigation of the implementation HOW when current source can answer it.

A human should not need to know which function, repository, State owner or target dependency implements
their request.

## Phase 2 — Builder Entry

Builder receives:
- human story;
- translated intention/result;
- known terrain;
- explicit unknowns.

Then asks:

~~~text
What current identities already exist?
What source owner already owns this truth?
What current typed relationship already expresses the meaning?
What is still unknown?
Does a new identity/capability actually need to exist?
~~~

Search and source reading are evidence gathering, not semantic proof.

### Identifier discipline

Do not jump from:

~~~text
"dark mode control"
~~~

to guessed resource IDs, element IDs, Origin names or Control IDs.

Current Android already grounds:

~~~text
DebugMenuScreen.DarkMode
-> element.debug-menu.body.dark-mode
~~~

so a Builder should reuse that coordinate as reference evidence rather than invent a parallel one.

## Current dark-mode HOW discovered from source

Current Android shows:

~~~text
DebugMenuScreen.DarkMode
  -> invoke(AppActions.ToggleDarkMode)

AppActions.ToggleDarkMode
  -> action.theme.dark-mode.toggle

DebugMenuScreen appAction registration
  -> context.toggleDarkMode()

VexLifeSession
  owns darkTheme
  toggleDarkMode()
  -> darkTheme = !darkTheme
~~~

This answers the current target HOW.

It does not settle the future semantic design.

The next useful questions are now evidence-based:

~~~text
Is theme meaning truly binary?
Should Auto/System exist?
Is "toggle" merely the current Control form?
Is the intended semantic relationship better expressed as selecting a theme mode?
Does State-dependent Behavior earn SCAE depth?
What is portable meaning versus Android/session realization?
~~~

Those are the next design questions; the current Boolean is not an automatic portable law.

## Relationship-language discovery

Earlier shorthand explored OriginIntent.NavigateTo, Act.NavigateTo and UserClick.

Treat those as candidate notation, not accepted families.

The current rule is smaller:

~~~text
if the edge means NavigateTo
-> use NavigateTo

if a later edge means Present
-> use Present

if a later edge means Set / Select / Clear
-> use the smallest truthful verb

if several independent examples reveal a reusable family
-> then consider naming/formalizing that family
~~~

Do not build a universal intent system before the specimens demand it.

## IDs are earned too

Do not pre-create ActId, IntentId, EffectId, RelationshipId or ControlId merely because future systems
might reference them.

Ask:

> Does this semantic thing need to live independently and be addressed independently?

If not, a typed relationship between already-addressable coordinates may be enough.

## SCAE discovery

Do not automatically translate every interaction into State -> Control -> Act -> Effect.

Use that depth when a real Behavior question benefits from it.

For the current theme specimen, the target currently has a toggle-shaped Control and a Boolean session
State. That is evidence, not a final portable model.

The Builder should first understand the intended theme truth, then decide whether the smallest truthful
semantic relationship is direct selection/state change or a deeper Behavior/Act/Effect model.

## Illustrative registry pseudocode — still not admitted

Exploratory registry/create-new-object pseudocode represents one desired Builder capability:

~~~text
missing semantic object
+ no truthful existing coordinate
+ new independently addressable meaning required
-> form/register the smallest new coordinate
~~~

It does not establish a global registry class, constructor API, ID format or target source architecture.


## Causal episode — from existing-target reference to from-zero Origin construction

**Currentness:** `CURRENT_PROJECT_RULE` for the standard-language boundary and
`CURRENT_WORKING_MODEL` for the still-evolving construction grammar.

### Human pressure

The earlier discussion used the existing Android implementation as a useful reference, but that framing
could accidentally imply that a target must already exist before the reusable design can be formed.

The new pressure is a first-time feature:

> What if the feature has never been built anywhere yet?

The desired architecture must still let VexBoard/Origin author the reusable design first and then construct
Android from that design.

### Additional correction — target jargon leaked into the example

An earlier explanation allowed examples such as a desktop `router.open(...)` or a web-specific routing
verb to stand beside Origin `NavigateTo(...)`.

That weakens the intended language boundary because the point of the reusable vocabulary is to replace
platform-specific jargon at the semantic interface with repeatable human intention.

The corrected rule is:

~~~text
Origin
  NavigateTo(screen.debug-menu)

Android semantic boundary
  navigateTo(DebugMenuScreen)

Desktop semantic boundary
  navigateTo(DebugMenuScreen)

Web semantic boundary
  navigateTo(DebugMenuScreen)
~~~

If a target requires a platform primitive underneath:

~~~text
navigateTo(...)
  -> platform-specific navigation primitive
~~~

The primitive remains implementation detail.

~~~text
PLATFORM_PRIMITIVE
!= REUSABLE SEMANTIC VOCABULARY

TARGET DIFFERENCE
!= PERMISSION TO RENAME THE SAME INTENTION
~~~

The same pressure applies to `Select`, `Set`, `Open`, `Close` and later typed relationships that
survive independent specimens.

### From-zero feature interpretation

A feature can begin entirely in reusable design space:

~~~text
human request
-> semantic nouns / values
-> Origin object boundaries
-> Controls / content
-> smallest truthful relationships
-> optional Behavior / Act / Effect only when earned
-> accepted Origin
-> target mapping
-> scaffold
-> target-native realization
-> lived evidence
-> reverse trace to Origin
~~~

Android source is therefore optional input evidence for an existing feature, not a prerequisite for
authoring a new one.

### Naming relationship

The current naming pressure is:

~~~text
DebugMenuScreenOrigin
  canonical reusable definition

DebugMenuScreen
  target realization

screen.debug-menu
  semantic Screen identity
~~~

and, if it survives the next seam:

~~~text
ThemeModeOrigin
  canonical reusable definition

ThemeMode
  target realization / reusable noun

Light
Dark
  currently earned values
~~~

The `Origin` postfix distinguishes the canonical definition without changing the reusable semantic noun.

### NavigateTo versus ActId — current decision threshold

For a first-time design, do not assume every activation creates an Act.

~~~text
DebugMenuEntryControl
-> NavigateTo(screen.debug-menu)
~~~

already says what the user intends.

An `ActId` becomes useful only when the action itself becomes independently meaningful/addressable, such
as when it is reused by several Controls, invoked without a visual Control, admitted by policy, selected
from State-dependent Behavior, observed independently, referenced by another semantic object, or mapped
through independently meaningful Effects.

This preserves the earlier navigation pressure-test while making it usable for greenfield construction.

### Template boundary

Target scaffolding may repeat established mappings:

~~~text
ScreenOrigin -> Screen scaffold
NavigateTo   -> navigateTo adapter
Select       -> selection/value adapter
Behavior     -> behavior resolver
ActId        -> Act handler when earned
Effect       -> Effect adapter when earned
~~~

But the template does not decide that a relationship is navigation, selection, Act or Effect.

~~~text
TEMPLATE
!= SEMANTIC DESIGN AUTHORITY
~~~

### Why this episode matters

This correction shifts the relationship from:

~~~text
existing target
-> infer reusable design
~~~

to the more general model:

~~~text
new feature
-> author reusable Origin design
-> construct target realization

existing feature
-> inspect target as evidence
-> reconcile / reverse-adopt into the same Origin model when appropriate
~~~

Both directions can exist, but new construction no longer depends on reverse engineering a target first.

**Reopen condition:** a future target demonstrates that preserving the standard intention vocabulary at
the target semantic boundary makes an important semantic distinction impossible to express. Platform API
preference alone is not sufficient pressure.

**Next unresolved edge:** define the smallest useful construction-grade `ScreenOrigin` / Control /
typed-relationship shape without prematurely creating a universal schema.


## Current living specimen

~~~text
HUMAN REQUEST
  choose dark/light theme from Debug Menu

CURRENT REFERENCE TERRAIN
  Home/current shell
  -> More/Add FAB
  -> FAB-options presentation
  -> Debug Menu option
  -> screen.debug-menu

CURRENT TARGET CONTROL
  element.debug-menu.body.dark-mode

CURRENT TARGET HOW
  action.theme.dark-mode.toggle
  -> VexLifeSession.toggleDarkMode()
  -> darkTheme = !darkTheme

ORIGIN / V2 DESIGN
  still being formed

NEXT QUESTION
  What is the smallest truthful theme-selection meaning we actually want to author,
  independent of accidental current Android mechanics?
~~~

## Working discipline

For each next step:

~~~text
1. perceive what is actually supplied
2. extract the smallest truthful meaning
3. lock known terrain endpoints
4. identify only the next missing edge
5. ground current identities/owners/source
6. preserve unresolved blanks
7. answer/design only that next edge
8. update the living Blueprint
9. repeat
10. after repeated pressure, recognize reusable language
~~~

The desired convergence is:

~~~text
human intention
-> living terrain
-> current truth
-> next missing semantic question
-> Builder investigation
-> smallest truthful relationship
-> repeat
~~~

not:

~~~text
idea
-> guessed IDs
-> guessed ontology
-> guessed compiler
-> multiple speculative phases
-> repair later
~~~

<!-- [VXG RealForever][VEXSYNC][CURRENT-EXAMPLES][PROCESS-DISCOVERY] -->
