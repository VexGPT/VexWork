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



## Causal episode — Origin Walk, relational reasoning and sequencing semantics

**Currentness:** `CURRENT_PROJECT_RULE` for the Origin Walk / minimum-complete / provenance discipline;
`CURRENT_WORKING_MODEL` for the exact future construction grammar that later specimens may still refine.

### Why the process needed a name

The design discussion had become intentionally incremental: establish one grounded distinction, preserve
why it survived, then let that answer expose the next question. A fresh thread needed a durable way to
resume that method without interpreting "start over" as "discard established truth."

The accepted working terminology is:

~~~text
Origin Walk
Origin Step
Walk Pressure
Walk Frontier
Origin Reground
Origin Roundtrip
~~~

An Origin Reground returns to the earliest affected step and reopens only dependent descendants.

### "Smallest" was too easy to misread

Earlier shorthand said "smallest truthful" relationship/model. New pressure showed that "smallest" could
be interpreted as "short summary" even when a complete architectural choice solves several problems.

The refined rule is:

~~~text
smallest / minimal
= MINIMUM COMPLETE
= nothing unnecessary
+ nothing materially necessary missing
~~~

For example, a Convergence architecture may need to preserve several pressures explicitly—continuity,
source of truth, ownership, provenance, duplicated-state reduction and recovery—because deleting those
reasons would let a later implementation satisfy only part of the original problem.

### Problem / convergence reasoning

A problem is not merely "something failed." It carries:

~~~text
current truth
intended truth
material mismatch
consequences
materially distinct cases
~~~

A useful solution should then be pressure-tested for immediate resolution, recurring cause, convergence,
scale and later refinement.

The desired convergence property is:

~~~text
solve more coherent admitted problems
while managing fewer independent truths

without collapsing distinctions that still have separate rightful owners
~~~

### Conclusion / summary correction came from reviewing the currentization itself

After the first Origin Walk currentization was formed, the source was reread against the live discussion.
That review found a real continuity risk:

~~~text
the candidate preserved many answers
but some of the evolutionary reasoning had been flattened
into named tests / conclusions
~~~

That exposed another language problem: treating a `conclusion` as a shortcut to the final answer, and a
`summary` as permission to omit why.

The refined distinction is:

~~~text
EVIDENCE
  what was observed / proved

REASONING
  why that evidence discriminates between candidates

CONCLUSION
  minimum-complete compression of the justified claim over that evidence

SUMMARY
  orientation compression that preserves a route back to the evidence / causal reasoning
~~~

The pressure behind this correction is practical:

~~~text
conclusion without evidence
-> unsupported assertion can masquerade as settled truth

summary without recoverable why
-> fresh instance inherits nouns / rules
   but cannot understand why they survived
-> later pressure causes re-derivation, accidental reversal or cargo-cult reuse
~~~

Therefore:

~~~text
NO SUPPORTING EVIDENCE
-> do not label the statement a conclusion

MATERIAL WHY / EVIDENCE OMITTED FROM SUMMARY
-> preserve exact source / causal-example route
-> do not imply the compressed text is sufficient for every dependent decision
~~~

This correction also explains the two-file VexSync pattern:

~~~text
README
  current-entry / orientation / current rules

CURRENT-EXAMPLES
  causal examples / evidence / rejected alternatives / evolution / reopen conditions
~~~

The split is useful only while the current entry remains traversable into the causal companion; otherwise
it would become another summary/source separation problem.

The reasoning that produced this was important:

~~~text
initial pressure
  "smallest" could accidentally mean "shortest"

example pressure
  ConvergenceRelay solves several different failures at once

realization
  deleting those reasons from the explanation would let a future Builder preserve the mechanism
  while losing why the architecture exists

refinement
  minimum complete means preserving every materially necessary problem / invariant / reason,
  not maximizing compression
~~~

The next question then became "what is a problem?" That exposed the distinction between a visible symptom
and the underlying current-vs-intended mismatch, and produced the progression from bounded fix to systemic
and converged architecture.

### Reusable questions emerged from the reasoning, not from a checklist

The stable question families were earned one pressure at a time:

~~~text
problem fit / symptom-vs-cause
completeness
relational context
counterfactual tests
convergence / management burden
ownership
standardization
diagnostic legibility
scale
evolution
recovery
provenance
~~~

The important dynamic is:

~~~text
answer one grounded question
-> see what new pressure that answer creates
-> select the relevant next question family
-> repeat
~~~

The questions are reusable so a fresh Builder does not have to remember to reinvent the same
considerations, but they are not mandatory fields or a ritual checklist.

### Relational pressure

A node may look correct in isolation and still be the wrong architecture because of what it duplicates,
disconnects, centralizes or leaves ownerless around it.

The discussion therefore added reusable relational/counterfactual questions:

~~~text
absence
collapse
bypass
duplication
substitution
scale
failure
evolution
standardization
diagnostic legibility
ownership trace
~~~

These are question families, not mandatory source fields. Apply the questions that the current answer
makes relevant.

The evolutionary sequence here matters:

~~~text
question:
  who does this node connect to, and what changes if it does not exist?

-> Absence / Collapse / Bypass pressure

Bypass result:
  consumers may have to reconstruct the same state / interpretation independently

-> convergence question:
  is this node actually reducing duplicated management?

-> ownership question:
  is it coordinating rightful owners or becoming a mega-owner?

-> standardization question:
  what happens if this becomes the normal path?

-> diagnostic question:
  with many consumers, can a fresh maintainer still trace who owns the failure?

-> Architecture Re-entry:
  treat the proposed standard itself as new problem terrain
~~~

This chain is why the counterfactual questions exist. Preserving only the final test names would lose how
they constrain one another.

### Lived navigation problem — state was forwarded while moving Screens

A prior design used a shape like:

~~~text
navigateTo(nextScreen, params)
-> next Screen extracts params
~~~

That works locally, but several callers created a deeper problem:

~~~text
Screen sees value
but cannot directly answer:
  where did it originate?
  who owns it?
  why is it current?
  which prior state/event produced it?
  what was the arrival sequence?
  which caller contract should recreation / re-entry reproduce?
~~~

Navigation had become an accidental data/state pipeline.

### Why ConvergenceRelay changed the design

ConvergenceRelay addressed several related pressures together:

~~~text
one source of truth
traceable semantic origin
dependency instead of caller-owned payload
state transition sequence
currentness
screen arrival/state change explainable through the Relay dependency
less duplicated caller-specific arrival logic
~~~

This is stronger than "Relay shares data." The architectural value is that semantic state remains owned
and traceable independently of whichever Screen happened to initiate presentation.

### Sequencing semantics earned from that example

The lived example exposed that one human-visible action can contain several meaningful ordered moves.

Old collapsed shape:

~~~text
NavigateTo(Screen, params)
  movement + state preparation + transport
  collapsed into one target call
~~~

Current pressure:

~~~text
PREPARE SEMANTIC TRUTH
  originating cause
  -> rightful state transition / ConvergenceRelay

THEN PRESENT / MOVE
  -> NavigateTo(ScreenId) when destination movement is required

DESTINATION
  -> consumes its Relay dependency
  -> does not treat the caller as its state owner
~~~

"Prepare" is descriptive sequencing language here, not yet a declared universal operation family.

The important semantic law is:

~~~text
ONE HUMAN MOVE
!= ONE UNDIFFERENTIATED TECHNICAL OPERATION

ORDERED SEMANTIC DEPENDENCIES
may legitimately exist inside one lived action
~~~

The later discussion gave this a tentative working name:

~~~text
Semantic Sequence
  = ordered semantic dependencies required to faithfully resolve one human intention
~~~

This is not yet a schema or separately managed source. Before promoting it, compare at least:

~~~text
direct navigation
state preparation -> presentation
state change without navigation
~~~

That comparison protects against assuming every lived action needs preparation or every sequence ends in
navigation.

Another earned constraint is that a future VexBoard sequence view should preferably project sequence from
the authoritative relationships/dependencies/provenance already present. A second independently maintained
"sequence truth" would recreate synchronization and currentness burden.

### Direct navigation still survives

This does not force Relay through ordinary destination movement.

~~~text
DebugMenuEntryControl
-> NavigateTo(screen.debug-menu)
~~~

remains sufficient when navigation itself is the complete meaning and no application/domain state needs
to be smuggled to the destination.

The new pressure is specifically:

~~~text
NAVIGATION
!= ARBITRARY SEMANTIC STATE TRANSPORT
~~~

If an argument appears necessary, ask whether it identifies the semantic destination instance or whether
it is state that should remain behind a traceable dependency/source owner.

### Bypass / Standardization result

The Bypass Test makes ConvergenceRelay's value visible:

~~~text
bypass Relay
-> each caller must transport/reconstruct state
-> destination gains multiple arrival contracts
-> provenance fragments
-> debugging expands with caller count
~~~

The Standardization Test then asks what happens if the Relay-backed pattern becomes normal:

~~~text
Does debugging have one stable causal path?
Can a fresh maintainer identify state owner without finding every caller?
Can Screen recreation recover current truth independently of the original navigation call?
Does adding another caller preserve the same diagnostic path?
Does the Relay coordinate rightful owners rather than absorb their truth?
~~~

A reusable standard should reduce construction cost **and** causal/ownership ambiguity.

### Ownership Trace

For a state-caused presentation flow, the desired diagnostic traversal is:

~~~text
observed Screen state / arrival
        ^
target presentation/navigation
        ^
semantic presentation consequence
        ^
Relay dependency / current transition
        ^
originating semantic source
        ^
human intention / cause
~~~

This lets debugging distinguish:

~~~text
wrong Origin meaning
wrong state transition
wrong target mapping
wrong target adapter
platform navigation failure
destination realization failure
~~~

instead of collapsing all of them into "navigation is broken."

### Current Walk Frontier

The next foreground Origin Walk remains the first construction-grade Screen boundary:

~~~text
established
  DebugMenuScreenOrigin
    screenId = screen.debug-menu

next
  derive its minimum-complete Meaning:
    WHAT
    WHY
    pressures resolved
    invariants
    relational role
    absence/boundary consequences

then
  determine the first child/capability required by that meaning
~~~

The sequencing/Relay specimen remains a live inherited example for later relationships whose state must be
prepared before presentation or another dependent consequence.

**Reopen condition:** a future specimen shows that separating semantic-state preparation from navigation
loses necessary meaning, or that a destination-specific argument is genuinely part of destination
identity rather than transported application/domain state.


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
