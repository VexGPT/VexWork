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

## Inherited exemplar 1 — canonical/realization naming pressure

**Historical source state:** VexBoard PR #155 supplied this then-current candidate:

~~~text
origin.vexlife.vexstream.ConnectionStatusOrigin

android.vexlife.vexstream.ConnectionStatus
desktop.vexlife.vexstream.ConnectionStatus
web.vexlife.vexstream.ConnectionStatus
~~~

It established the important distinction that survived:

~~~text
ConnectionStatus
  = reusable semantic noun

origin / android / desktop / web
  = different canonical/realization scopes

TARGET DIFFERENCE
!= NEW SEMANTIC NOUN
~~~

At that stage the `Origin` postfix was proposed as the canonical-definition marker.

**Current VexSync refinement:** later consumer pressure applied the Absence/Duplication test to the postfix
itself and found that a reliable Origin scope already carries canonicality.

~~~text
origin.vexlife.vexstream.ConnectionStatus
android.vexlife.vexstream.ConnectionStatus
desktop.vexlife.vexstream.ConnectionStatus
web.vexlife.vexstream.ConnectionStatus
~~~

The semantic noun is now preserved 1:1. The earlier postfix form remains evidence of how the distinction
was discovered; it is not the current naming rule.

~~~text
ORIGIN POSTFIX MODEL
  = SUPERSEDED naming form

ORIGIN SCOPE
  = current canonicality carrier

SAME SEMANTIC THING
-> SAME SEMANTIC NOUN
~~~

**Reopen condition:** a required representation truly cannot preserve scope/qualification or another
explicit canonicality coordinate.

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

**Historical naming note:** this episode preserves the then-current `<SemanticNoun>Origin` postfix model
because that was the actual reasoning state when the episode occurred. The later **Origin Scope naming
correction** below supersedes the postfix form without erasing this causal step.

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
CIRCUMSTANCE / EVIDENCE
  what condition or scenario was actually observed

CONSEQUENCE / PRESSURE
  what problem, frustration, ambiguity, duplication or other unideal result followed
  and why that mattered

RESPONSE / CANDIDATE SOLUTION
  what was introduced or changed to address that pressure

RESOLUTION EVIDENCE
  what the response demonstrably fixed / improved
  and which cases or invariants remained satisfied

CONCLUSION
  minimum-complete compression of the justified claim that follows from that causal chain

SUMMARY
  orientation compression that preserves a route back to the causal chain / evidence
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

The resulting rule is:

~~~text
NO GROUNDED CIRCUMSTANCE / CONSEQUENCE
-> no established problem basis

NO RESOLUTION EVIDENCE
-> response remains candidate / proposal
-> do not call it a solved problem

NO SUPPORTING CAUSAL CHAIN
-> do not label the final statement a conclusion

MATERIAL WHY / EVIDENCE OMITTED FROM SUMMARY
-> preserve exact source / causal-example route
-> do not imply the compressed text is sufficient for every dependent decision
~~~

A worked shape using the navigation/ConvergenceRelay specimen is:

~~~text
CIRCUMSTANCE
  several callers navigated to the same destination while forwarding caller-owned params

CONSEQUENCE / PRESSURE
  the destination could see values but could not reliably trace source, ownership, sequence/currentness
  or reconstruct the same truth without rediscovering each caller

RESPONSE / CANDIDATE SOLUTION
  move semantic state into the rightful ConvergenceRelay dependency
  and keep navigation responsible for destination movement

RESOLUTION EVIDENCE
  state now has one traceable source/currentness path
  callers no longer own destination state payloads
  destination consumes the same dependency regardless of which caller initiated presentation
  debugging can follow the Relay transition instead of searching every navigateTo call

CONCLUSION
  navigation should not be the arbitrary transport/source owner for semantic state;
  state should remain behind its rightful traceable dependency, while NavigateTo owns movement

BOUNDARY
  this does not yet prove that every navigation argument is invalid;
  a future specimen may show an argument is genuinely part of destination identity

REOPEN CONDITION
  evidence shows that separating state preparation from navigation loses necessary semantic meaning
~~~

The conclusion reads as the compressed end of the causal evidence, not as a shortcut around it.

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

### New pressure — semantic design exists before visual design is specified

After the Screen-boundary reasoning, another ambiguity appeared:

~~~text
human has specified the capability / outcome
but has not specified visual form or positioning

question:
  if every Builder/target fills that gap independently,
  does design become random each time?
~~~

The proposed response was not to push layout into semantic Meaning. The current distinction is:

~~~text
Origin / product meaning
  what / why / semantic relationships

Design intent
  form / composition / positioning / responsive constraints

Target construction
  platform realization of the accepted meaning + design
~~~

When explicit design is absent, a **Default Design Intention** can resolve the design gap deterministically.

### Why a default is preferable to silent creativity

Without a default:

~~~text
same Origin meaning
-> Android Builder improvises presentation A
-> Desktop Builder improvises presentation B
-> Web Builder improvises presentation C
-> repeated generation may make different choices again
~~~

The semantic meaning may still be shared, but visual/product intention becomes target- or instance-owned
by accident.

The current response is:

~~~text
explicit design if provided
else accepted reusable default design intention
then target construction
~~~

A later explicit design may refine/replace the default without reminting unaffected semantic identities.

### Form-choice example — cardinality helps but does not fully decide

The initial suggestion was intentionally practical:

~~~text
2 states
-> Toggle

3+ values
-> Dropdown
~~~

This is useful default pressure, but the Walk exposed one necessary refinement:

~~~text
choice meaning
+ cardinality
+ visibility/comparison pressure
+ available design space
-> default form
~~~

Thus a binary on/off-like property strongly supports a Toggle. Two peer values whose names must remain
visible may later earn another two-choice form. Several values support a compact multi-option selector /
Dropdown by default, while explicit design can choose visible options when that better serves the meaning.

The important rule is deterministic reasoning rather than random form selection.

### Composition example — scalable row growth

For a Debug/Settings-like Screen with independent row-like controls and no authored layout, the current
default candidate is:

~~~text
ordered vertical flow
-> stacked rows / bounded sections
-> future children inserted into the same flow
~~~

This avoids absolute-position improvisation and gives later capabilities a predictable place to compose.

It remains a default for this class of Screen, not a universal Screen ontology.

### Scrolling example — derive mechanism from reachability

The initial instinct was "scroll by default because Screens differ."

The refined invariant is stronger:

~~~text
all admitted content must remain reachable
across supported viewport variation
unless an explicit design intentionally constrains that reachability
~~~

For vertically growing content:

~~~text
overflow possible
-> scroll-capable container by default
~~~

The scroll belongs at the rightful overflow owner:

~~~text
whole content grows -> Screen/body scroll
only subregion grows -> subregion scroll
fixed/game/canvas experience -> explicit non-scroll design may win
~~~

This avoids treating Scroll itself as the product meaning while still preventing smaller form factors from
silently hiding content.

### Why this does not move the Walk Frontier ahead of semantics

The default-design rule answers a future ambiguity about **how unspecified presentation is resolved**.

It does not authorize designing ThemeMode before the semantic child is earned.

The sequence remains:

~~~text
Screen Meaning
-> derive required child/capability
-> establish that child's semantic meaning / values / relationships
-> consume explicit design if supplied
-> otherwise resolve through Default Design Intention
-> target construction
~~~

So the current foreground frontier remains Screen Meaning. The new design-default rule is inherited when
the Walk reaches form/composition.

### Causal episode — Screen Meaning to ThemeMode canonical ownership

**Historical naming note:** the text in this episode uses `DebugMenuScreenOrigin` / `ThemeModeOrigin`
because the independent canonical boundaries were first discovered under the postfix model. The boundaries
survive; the later naming correction moves canonicality into Origin scope and restores the nouns to
`DebugMenuScreen` / `ThemeMode`.

The foreground Walk continued rather than assuming the first child.

#### Screen Meaning conclusion

~~~text
CIRCUMSTANCE
  the requested experience explicitly enters a Debug Menu

CONSEQUENCE / PRESSURE
  collapsing it into Home removes the requested separation;
  an anonymous container recreates the boundary without durable meaning;
  a stable destination is useful only if it does not absorb child state/behavior ownership

RESPONSE / CANDIDATE SOLUTION
  DebugMenuScreenOrigin

RESOLUTION EVIDENCE
  stable semantic destination
  target-independent NavigateTo
  child capabilities can be presented without becoming Screen-owned truth
  Screen survives child replacement

CONCLUSION
  DebugMenuScreenOrigin is a deliberately separate development/debug destination
  whose presentation boundary does not make it the semantic owner of its children
~~~

That conclusion derives the current required capability:

~~~text
choose the application's Light / Dark theme mode
~~~

#### ThemeMode noun pressure

~~~text
DarkMode
-> one-sided state name

Appearance
-> over-broad neighboring domain

ThemeMode
-> bounded selectable dimension
-> Light / Dark can remain peer values
~~~

#### Why ThemeModeOrigin became earned

The first pass intentionally refused to mint `ThemeModeOrigin` merely because `ThemeMode` was a useful
noun. The next pressure supplied the missing justification:

~~~text
ThemeMode is reusable/application-scoped meaning
+ several target realizations must preserve the same domain
+ values/defaults/evolution must not be independently redefined per target
-> one canonical reusable definition is required
~~~

So the refined conclusion is:

~~~text
ThemeModeOrigin
  canonical reusable definition

ThemeMode
  reusable noun retained by realizations

current ThemeMode value
  runtime/application state
  not a live value stored in Origin source
~~~

This avoids both failure modes:

~~~text
NO ORIGIN
-> each target can become an exclusive semantic owner

ORIGIN OWNS LIVE RUNTIME VALUE
-> canonical design source incorrectly becomes runtime state storage
~~~

#### Origin Eligibility inversion — "earn the opposite"

**Historical intermediate conclusion:** this step correctly discovered that canonical boundaries must be
earned, but it still expressed the result through an `Origin` postfix. The next causal episode preserves
the refinement from postfix to scope.

The `ThemeModeOrigin` discussion exposed a broader question:

> When would a meaningful noun in an application **not** have an Origin postfix?

That inversion prevents the postfix from becoming decorative.

The conclusion is not "nouns get Origin." It is:

~~~text
independently canonical reusable definition
-> Origin eligible

owned child / value / relationship / runtime occurrence /
target mechanism / realization / projection
-> no independent Origin by default
~~~

Worked edge cases:

~~~text
Screen
  DebugMenuScreenOrigin
  -> independent canonical Screen definition

state/value domain
  ThemeModeOrigin
  -> independent canonical domain

domain values
  Light / Dark
  -> owned by ThemeModeOrigin
  -> no LightOrigin / DarkOrigin

Control
  ThemeModeControl
  -> currently parent-owned by DebugMenuScreenOrigin
  -> stable identity does not force independent Origin

relationship
  Select / NavigateTo
  -> semantic verbs
  -> no Origin

runtime value
  currentThemeMode
  -> application state occurrence
  -> no Origin

semantic Process
  may earn ProcessOrigin when one portable process definition must project across targets

VexCoroutineLauncher / coroutine / Android Worker
  -> execution mechanics
  -> no Origin

database / DAO / SQL / Room
  -> storage mechanics
  -> no Origin

semantic data/domain/persistence policy
  -> may earn Origin when independently canonical

Android Service / BroadcastReceiver
  -> platform mechanisms
  -> no Origin

portable service capability / event domain / process
  -> may earn Origin under its semantic name
~~~

A value can cross the boundary only by ceasing to be "merely a value":

~~~text
value gains independent identity / fields / relationships / evolution / realizations
-> reclassify as semantic object/domain
-> rerun Origin Eligibility
~~~

This is not an exception. It is evidence that the original classification no longer describes the thing.

The ConvergenceRelay example remains intentionally conditional:

~~~text
ConvergenceRelayOrigin
  is justified only if canonical-vs-realization ownership needs to be expressed

architecture noun
  != automatic Origin
~~~

#### Origin Scope naming correction — same noun, different scope

The next pressure did not challenge the canonical boundaries themselves. It challenged where canonicality
was encoded.

~~~text
earlier model
  origin....ThemeModeOrigin
  android....ThemeMode

observation
  "origin" scope already says which coordinate is canonical

question
  what does the extra "Origin" in the class/type noun still contribute?
~~~

Absence Test:

~~~text
remove postfix

origin....ThemeMode
android....ThemeMode

lost:
  no semantic identity
  no canonicality
  no traceability
  no realization relationship
~~~

Duplication result:

~~~text
origin....ThemeModeOrigin
^^^^^^          ^^^^^^
scope           second encoding of the same canonical role
~~~

The candidate correction is therefore:

~~~text
SAME SEMANTIC THING
-> SAME SEMANTIC NOUN

origin....ThemeMode
android....ThemeMode
desktop....ThemeMode
web....ThemeMode

canonicality / realization
-> expressed by scope

scope difference
!= noun difference
~~~

This is not history rewriting. The earlier commits and causal text preserve why the postfix originally
looked useful: it made canonical-vs-realization ownership visible. The later pressure shows that once scope
is reliable, the suffix becomes redundant.

The correction also sharpens Origin Eligibility:

~~~text
old wording
  "does this noun earn an Origin postfix?"

current wording
  "does this semantic thing earn an independent canonical coordinate in Origin scope?"
~~~

Examples under the current rule:

~~~text
origin....DebugMenuScreen
android....DebugMenuScreen

origin....ThemeMode
android....ThemeMode

origin....PairingProcess
android....PairingProcess
~~~

Owned values / verbs / runtime occurrences / target mechanics still do not gain independent canonical
coordinates merely because they are named:

~~~text
Light / Dark
Select / NavigateTo
currentThemeMode
VexCoroutineLauncher
BroadcastReceiver
Room / DAO / SQLite
~~~

**Boundary:** if a local code context imports both scoped types and needs shorter names, qualify or alias
locally. Local collision does not justify permanently mutating the reusable semantic noun.

**Reopen condition:** a required transport/serialization surface cannot preserve scope or another explicit
canonicality coordinate and local qualification cannot solve the ambiguity.

#### Default Before Binary pressure

The appearance discussion then exposed another inherited Boolean bias.

~~~text
two known states
-> tempting to call them binary
-> tempting to encode one state as true and the other as false
-> tempting to call one "Primary" merely because it is conventional/default
~~~

The refined question is:

~~~text
What are the named states?
What is the default-selection policy?
Is Default a state or a policy?
Would changing the default require renaming a state?
Can a future third value be admitted without semantic migration?
~~~

Current working law:

~~~text
CONSIDER DEFAULT / INITIAL SELECTION
BEFORE BINARY REPRESENTATION

DEFAULT SELECTION
!= STATE IDENTITY

CURRENTLY TWO VALUES
!= BOOLEAN SEMANTICS
~~~

For current evidence, `Light` and `Dark` remain the strongest state names because they identify the
visual modes themselves. `Primary` / `Secondary` remain relative roles unless future product meaning
makes those identities real.

No product evidence in this Walk yet proves that Light is the default. If later grounded evidence does,
record `default ThemeMode = Light` separately rather than renaming Light to Primary.

#### Why Select improves evolution

This pressure also strengthens the earlier `Select` conclusion:

~~~text
Toggle
  two-state mechanic
  adding a third value changes the interaction model

Select(ThemeMode.<value>)
  explicit human choice
  adding a new admitted value extends the choice set
  without changing the semantic operation
~~~

So a target may realize a two-state selector with Toggle-like behavior today while the Origin-facing
relationship remains `Select`.

### Causal episode — default-selection ownership and current-state consequence

The next Walk pressure began with an intentionally unresolved value:

~~~text
ThemeMode
  Light
  Dark

question:
  when nobody has made an authoritative selection yet,
  who chooses the initial ThemeMode?
~~~

The current Android reference contributed one fact and one absence:

~~~text
FACT
  VexLifeSession owns darkTheme and toggleDarkMode()
  -> current theme state is not DebugMenuScreen-local

ABSENCE
  the VexSync evidence does not establish how darkTheme is initially chosen
  -> do not infer Light or Dark as the product default
~~~

#### Why default does not intrinsically belong to the domain

Counterexample pressure:

~~~text
Product A reuses ThemeMode
  -> may prefer Light initially

Product B reuses the same ThemeMode
  -> may follow environment

Product C reuses the same ThemeMode
  -> may prefer Dark initially
~~~

The values can retain identical meaning while initialization policy differs.

Therefore:

~~~text
ThemeMode
  owns domain meaning / admitted values

application/product initialization policy
  owns how an initial value is resolved

runtime application state
  owns the current resolved ThemeMode
~~~

No new policy object/schema is earned merely by making that distinction.

#### Default is not recovery

Another pressure appears when persistence exists:

~~~text
user explicitly selected Dark yesterday
app restarts
restored Dark
~~~

That value is not "the default." It is recovered user state.

~~~text
RESTORE
  preserves an authoritative prior selection

DEFAULT
  resolves absence of an authoritative selection
~~~

Collapsing the two would erase provenance and could overwrite user intent.

#### Environment-derived initialization is not automatically a state

If product policy says:

~~~text
when no prior selection exists
-> inspect environment appearance
-> resolve Light or Dark
~~~

the environment is an initialization-policy input.

That does not automatically mean:

~~~text
ThemeMode.System
~~~

exists. System becomes a ThemeMode value only if the product admits "follow system" as an independently
selectable semantic state.

#### Selection consequence

The explicit selection relationship now resolves directly:

~~~text
Select(ThemeMode.Dark)
-> current application ThemeMode = Dark
-> dependent appearance reflects Dark
~~~

No previous-state lookup is required to understand the intended result.

Idempotence pressure strengthens the distinction:

~~~text
current = Dark
Select(Dark)
-> Dark

current = Dark
Toggle()
-> Light
~~~

So Select preserves human intention even when the current state is already the requested value.

No independent Act / Effect identity is currently required for this direct explicit-value transition.

### Causal episode — ThemeMode form resolves from semantic symmetry

The design edge reused the earlier Default Design Intention rather than inventing a widget from scratch.

Initial heuristic pressure:

~~~text
two values
-> tempting default: Toggle
~~~

But the established semantics now say:

~~~text
ThemeMode.Light
ThemeMode.Dark

Select(explicit value)

Light and Dark
  = named peer values
  != off/on encoding
~~~

A conventional Dark Mode Toggle would make Dark the positive condition and Light the negative/off branch.
That would reintroduce the semantic asymmetry the Walk already removed.

Therefore the stronger current design conclusion is:

~~~text
Theme
  [ Light ] [ Dark ]

portable design intent
  visible exclusive choice group
  both peer values perceptible
  exactly one current selection perceptible
~~~

The portable design does not require a particular target widget. Android/Desktop/Web may choose a
segmented control, radio-style choice group, chips or another admitted target-native form while preserving
the same visible peer-choice meaning.

Value-set evolution pressure also favors this rule:

~~~text
add System
-> Select semantics survive
-> visible choice group may expand

many values / labels no longer fit
-> presentation may refine to compact Selector / Dropdown
-> semantic operation still remains Select
~~~

So cardinality informs form, but semantic relationship + symmetry + visibility decide the stronger default.

### Causal episode — explicit Select mapped over current Android Boolean state

**SUPERSEDED current model:** this episode preserves the intermediate adapter reasoning that was current
before the later State/Projection pressure. The explicit-selection insight survives; the Boolean adapter
does not.


The next pressure compared the established Origin-facing relationship with accepted Android observation.

~~~text
Origin-facing
  Select(ThemeMode.<value>)

Android observation
  ToggleDarkMode
  darkTheme = !darkTheme
~~~

The idempotence counterexample proves Toggle cannot directly realize Select:

~~~text
current = Dark

human intention
  Select(Dark)

Select result
  Dark

Toggle result
  Light
~~~

The minimum correction is an adapter, not an immediate storage rewrite.

~~~text
android....ThemeMode
  Light
  Dark

selectThemeMode(Light)
  -> darkTheme = false

selectThemeMode(Dark)
  -> darkTheme = true

currentThemeMode
  -> map false to Light
  -> map true to Dark
~~~

This preserves several distinctions at once:

~~~text
semantic domain
  Light / Dark

semantic operation
  Select(explicit value)

target semantic realization
  android....ThemeMode

target storage
  Boolean may remain for now

legacy target behavior
  ToggleDarkMode may remain for callers that genuinely want inversion
~~~

The adapter is deliberately idempotent and explicit. It does not require knowing the prior state to
understand the requested result.

A later new value such as System also becomes diagnostically useful pressure:

~~~text
Origin supports System
Boolean adapter does not
-> target capability gap is visible
-> target must evolve

not
-> silently collapse System into true / false
~~~

### Causal episode — State / Projection removes the Boolean bridge

After the first Android alignment candidates were formed, another question challenged the migration model:

> If Origin roundtrip is reversible, does Origin need to know the Android Boolean adapter?

The answer exposed a mistaken assumption.

~~~text
reversibility
!= every target implementation primitive is represented in Origin

reversibility
= target evidence can traverse through the target realization mapping
  back to the same semantic meaning
~~~

The current SCAE source supplied the more truthful shape:

~~~text
STATE
  current ThemeMode

CONTROLS
  Light choice
  Dark choice

PROJECTION
  current ThemeMode
  -> selected choice presentation
  -> application theme presentation
~~~

The same State drives both UI surfaces. There is no semantic need for a Boolean between them.

#### Why full SCAE is not yet earned

For explicit selection:

~~~text
Light + Select(Dark)
-> Dark

Dark + Select(Dark)
-> Dark
~~~

The requested meaning does not change with current State.

Contrast a true Toggle:

~~~text
Light + Toggle
-> Dark

Dark + Toggle
-> Light
~~~

That is state-dependent Control meaning.

Therefore the ThemeMode specimen currently earns State + Control/Request + Projection, while Act / Effect
remain unformed unless later pressure makes them independently useful.

~~~text
STATEFUL FEATURE
!= AUTOMATIC FULL SCAE

DIRECT EXPLICIT SELECTION
!= STATE-DEPENDENT TOGGLE BEHAVIOR
~~~

#### Boolean adapter correction

The first #188 commit introduced a Boolean adapter as a migration convenience.

No persisted/wire/provider compatibility requirement had been established for the Boolean itself.
Therefore the adapter failed Judgment Before Accretion:

~~~text
required correctness preserved by adapter
  none yet established

recurring burden introduced
  ThemeMode <-> Boolean mapping
  future value compatibility
  another target representation to explain/test

remove adapter
  no semantic truth lost
~~~

Android #188 was corrected by a new child commit; history was not rewritten.

#189 and #191 depended specifically on the bridge, so they were closed as SUPERSEDED while preserving
their PR/commit history.

#### Current Android default is known as target evidence

Direct source inspection also corrected an earlier evidence gap:

~~~text
VexLifeSession(
  initialDarkTheme: Boolean = true
)
~~~

Therefore:

~~~text
CURRENT_ANDROID_INITIAL_THEME = Dark
~~~

That is target history, not automatic Origin/product policy.

#### Projection is the reversible seam

The desired roundtrip no longer needs a storage adapter:

~~~text
human selects Dark
-> Select(ThemeMode.Dark)
-> current application ThemeMode = Dark

current ThemeMode
-> Android theme projection
-> observed Dark appearance

reverse:
observed Dark appearance
-> Android current ThemeMode.Dark
-> origin....ThemeMode.Dark
-> human selection cause
~~~

If some future target truly requires a Boolean persisted/wire representation, that mapping belongs to the
target realization/evidence layer. Origin still owns ThemeMode, not the encoding.

### Causal episode — target refactoring begins from Origin meaning, not legacy mechanics

The first Android realization work tested whether the current target should constrain the new semantic
model.

~~~text
legacy Android
  DarkMode Toggle
  Boolean inversion

current Origin-facing meaning
  ThemeMode.Light / ThemeMode.Dark
  Select(explicit value)
~~~

The decision is:

~~~text
CURRENT TARGET
  = observation / migration terrain

CURRENT TARGET
  != portable semantic authority
~~~

Therefore the target is refactored toward the Origin-aligned model.

The first bounded candidate, Android PR #188, deliberately avoids the active VexLifeSession claim and
establishes only:

~~~text
android....ThemeMode
  Light
  Dark

Boolean compatibility mapping
  Light <-> false
  Dark  <-> true
~~~

The mapping is exhaustive so future value growth produces a visible target capability gap.

The second candidate, Android PR #189, stacks on #188 and changes only the theme renderer:

~~~text
VexLifeTheme(themeMode: ThemeMode)
  -> aligned entry

Boolean overload
  -> temporary migration bridge
~~~

Android PR #191 then advances the same stack without touching the session owner:

~~~text
VexLifeSession.darkTheme
  -> ThemeModeBooleanAdapter
  -> VexLifeTheme(themeMode)
~~~

That makes the compatibility seam explicit at app composition while the session file remains claimed by
PR #186.

A separate sequential child of Android PR #182, Android PR #190, adds only the presentation capability
needed by the eventual peer-value Debug Menu control:

~~~text
VexElementTree
  buttonStyleOverride(ButtonElement)

current domain state
  -> current Button presentation

static Button identity / intent
  -> unchanged
~~~

No ChoiceElement or ThemeMode-specific Elements primitive is introduced.

This demonstrates a reusable migration pattern:

~~~text
semantic noun/value domain first
-> target adapter
-> target consumer moves onto semantic noun
-> state owner migrates
-> interaction/presentation migrates
-> remove legacy bridge only when no rightful consumer remains
~~~

Do not collapse this into a one-shot rewrite when live source ownership makes bounded stages safer.

Current overlap is explicit rather than ignored:

~~~text
PR #186 owns VexLifeSession.kt
-> do not mutate that file from this claim yet

PR #182 owns generic ElementModel / ScreenBlueprint / ElementCells
-> do not independently add a competing selection primitive there yet
~~~

These holds protect source ownership; they do not give those sibling PRs authority over VexSync meaning.

### Causal episode — Origin must carry the logic needed for construction

The State/Projection correction raised a further architectural question:

> If Android should eventually be generated from Blueprint, where does the actual transition/projection
> logic live?

The answer corrects an overly thin reading of "Origin meaning."

~~~text
thin Origin
  ThemeMode = Light | Dark

target developer
  decides how Select changes State
  decides how State drives presentation

result
  target becomes semantic logic author
  generation still requires reinterpretation
~~~

That violates the intended Blueprint construction model.

The stronger construction-grade form is:

~~~text
Origin
  ThemeMode domain
  current State meaning
  Select(target) relationship
  transition law
  projection laws
  design constraints
  initialization policy when earned

target
  maps those laws into native code/mechanics
~~~

The concrete ThemeMode law is deliberately simple:

~~~text
for every admitted current state S
for every admitted target value T

Select(T)
-> current ThemeMode = T
~~~

Projection then derives:

~~~text
current ThemeMode
-> selected choice presentation

current ThemeMode
-> application theme presentation
~~~

No Boolean is needed in the portable causal chain.

#### Why this still does not force full SCAE

Portable logic and SCAE depth are separate questions.

~~~text
Select(Dark)
  same meaning from Light or Dark
  -> direct explicit transition

Toggle
  meaning depends on current State
  -> State-dependent Act resolution is useful
~~~

Therefore ThemeMode must have portable executable/generative logic, while Act/Effect remain unearned until
they solve a real semantic distinction.

#### Canonical ownership correction

The canonical VexLife Blueprint repository already proves the intended architecture:

~~~text
vgong24/VexLife
  canonical portable product/software meaning

VexGPT/VexWork
  trajectory / reasoning / work truth

vgong24/VexLife-Android
  native realization + evidence
~~~

Its Play/Pause practicum carries language-neutral semantic law rows in canonical Blueprint source and then
derives/reconstructs target representations.

So VexSync #178 is not itself enough to authorize Android as semantically complete.

The next required source sequence is:

~~~text
VexSync reasoning
-> canonical ThemeMode logic in VexLife Blueprint
-> accepted canonical source
-> Android adoption / generation mapping
-> native/lived proof
-> reverse evidence
~~~

Android #188 remains useful as a target candidate, but acceptance/merge must remain held until its canonical
Origin dependency exists and is current.

### Current Walk Frontier

~~~text
established
  Origin-scoped DebugMenuScreen + Meaning
  Origin-scoped ThemeMode = Light / Dark
  Select(ThemeMode.<value>)
  application-scoped current ThemeMode
  application/product-owned initial-selection policy
  visible peer-choice Default Design Intention
  minimum Android semantic adapter:
    explicit ThemeMode <-> current Boolean mapping

held
  actual VexLife initial ThemeMode policy/value

current Android realization candidates
  PR #188 -> ThemeMode target domain + Boolean adapter
  PR #189 -> ThemeMode-aware theme renderer
  PR #191 -> app composition maps legacy session state through ThemeMode
  PR #190 -> stacked after #182; current Button style projection for peer-choice presentation

held source edge
  VexLifeSession migration -> exact file currently claimed by PR #186

composition edge
  final DebugMenu Light | Dark control needs:
    session explicit selectThemeMode(value)
    + PR #190 presentation projection
    + registered Light/Dark controls/action wiring

next
  prove/currentize the semantic + Android candidates
  then resume session ownership as #186 clears
  -> compose final DebugMenu selection surface
  -> lived Origin -> Android -> appearance -> reverse-trace roundtrip
~~~

The roundtrip may prove explicit selection independently of startup default. Any proof that begins from a
fresh/uninitialized application must first resolve the held initial-selection policy.

**Reopen conditions:** current target source materially differs from the accepted observation, Boolean
storage cannot be adapted without broader state consequences, or explicit target source already provides a
stronger ThemeMode abstraction that should be reused instead of duplicated.


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

CURRENT ORIGIN-SCOPE WORKING MODEL
  DebugMenuScreen meaning established
  ThemeMode = Light / Dark
  Select(ThemeMode.<value>)
  current ThemeMode = application-scoped runtime truth
  initial-selection owner = application/product policy
  actual initial value = OPEN

CURRENT DEFAULT DESIGN INTENTION
  Theme row
  -> visible exclusive Light | Dark choices
  -> one current selection
  -> target widget remains realization-specific

CURRENT ANDROID ALIGNMENT
  PR #188
    android....ThemeMode = Light / Dark
    Boolean adapter removed

  PR #190
    current Button style projection from domain State

  PR #189 / #191
    SUPERSEDED historical Boolean-bridge candidates

CURRENT TARGET OBSERVATION
  VexLifeSession initialDarkTheme = true
  -> current Android initializes Dark
  -> target evidence, not automatic Origin default

NEXT QUESTION
  First source the construction-grade ThemeMode transition/projection logic in the canonical VexLife Blueprint.
  Then Android may consume/generate from that accepted Origin law rather than from VexSync prose alone.
~~~


### Causal episode — Switch form exposes full SCAE + persistence currentness

The earlier explicit-value selection model was useful for rejecting the legacy Boolean adapter, but the
next design pressure started from the UI form itself.

The Debug Menu control is currently being explored as a **Switch**:

~~~text
UI
  Switch
    ref = control.debug-menu.theme-mode
~~~

A Switch implies a semantic Toggle relationship rather than an arbitrary ButtonClick:

~~~text
target click / key / accessibility activation
-> Control.ThemeModeToggle

Control.ThemeModeToggle
+ ThemeMode.Light
-> Act.SelectDark

Control.ThemeModeToggle
+ ThemeMode.Dark
-> Act.SelectLight
~~~

This restored the actual SCAE reading order from Android:

~~~text
Control
-> candidate Acts

then

Behavior
  state<...> {
    on(act, effect)
    .admit<...>()
  }
~~~

The parent `Behavior` block is the reusable law-construction pattern. It does not own current State;
it declares lawful relationships for each possible current State.

Working specimen:

~~~text
behavior(
  ref = behavior.theme-mode
) {
  state<ThemeMode.Light> {
    on(
      act = SelectDark,
      effect = PersistThemeMode
    )
    .admit<ThemeMode.Dark>()
  }

  state<ThemeMode.Dark> {
    on(
      act = SelectLight,
      effect = PersistThemeMode
    )
    .admit<ThemeMode.Light>()
  }
}
~~~

The UI lens binds to the same identities/truth:

~~~text
Switch(
  ref = control.debug-menu.theme-mode
) {
  activate
    -> Control.ThemeModeToggle

  active
    <- current ThemeMode == ThemeMode.Dark
}
~~~

No separate UI truth is invented.

### Causal episode — persistence introduces acknowledgement, observation and stale-result pressure

The Effect hole became meaningful when the selected ThemeMode was required to survive restart.

A persistence Effect must not delay the ordinary UI until storage round-trips, but it also must not
pretend durability succeeded.

~~~text
admit next ThemeMode
-> current application truth changes immediately
-> UI reflects current truth

Effect
-> persist admitted/result ThemeMode asynchronously
-> observe completion later
~~~

This exposes separate truths:

~~~text
current ThemeMode
!= durability acknowledgement/currentness
~~~

A successful completion can confirm the already-current value. A failure can require a later correction
policy. An older completion must not overwrite a newer admitted selection.

~~~text
A: Light -> Dark -> persist Dark
B: Dark  -> Light -> persist Light

B completes first
-> current Light confirmed

A completes later
-> stale
-> preserve current Light
~~~

Therefore an async result is not another Control. It is an **observation/result input** to Behavior
reconciliation.

Working distinction:

~~~text
Control-driven:
  Control + current State
  -> Act
  -> Effect
  -> immediate admitted State

Observation-driven:
  async result + current transition/current State
  -> reconcile
  -> confirm / preserve / correct
~~~

Exact reusable syntax remains OPEN.

### Causal episode — every persistence leaf must have known human visibility

Persistence was then pressured from the perspective of a future nontechnical VexWork reader.

Even when writes normally complete instantly:

~~~text
Pending
Saved
Failed
~~~

are all reachable semantic/currentness leaves and each requires an explicit presentation disposition.

~~~text
reachable leaf
-> presentation case required

presentation may be delayed/suppressed by explicit policy
!= leaf may be omitted
~~~

Example possibilities remain design choices, not current decisions:

~~~text
Pending
  -> possibly delayed reveal to avoid a brief "Saving..." flash

Saved
  -> possibly persistent or temporary confirmation

Failed
  -> visible failure + later earned recovery choices
~~~

The important current rule is totality:

~~~text
NO REACHABLE LEAF WITHOUT A KNOWN PRESENTATION DISPOSITION
~~~

That makes omissions inspectable in VexBoard/VexWork and lets a human ask what happens in every case
without needing implementation experience.

### Current Walk Frontier — after UI/SCAE/persistence pressure

~~~text
KNOWN

screen.debug-menu

ThemeMode
  Light
  Dark

control.debug-menu.theme-mode
  UI form = Switch
  semantic Control = Toggle

Control candidate Acts
  SelectDark
  SelectLight

Behavior
  reusable parent pattern for
  state<> / on(act,effect) / admit<>

Effect
  persistence of admitted/result ThemeMode

admit
  immediate semantic admission
  != persistence success

async persistence
  produces observation/result
  -> reconciliation
  -> current/same confirmation
  -> failure/correction
  -> stale-result rejection

persistence currentness leaves
  Pending
  Saved
  Failed

UI
  Switch.active <- current ThemeMode == Dark

presentation totality
  every reachable leaf has explicit disposition


OPEN

exact portable names/shapes for:
  persistence owner/repository relationship
  persistence-currentness State
  observation/result relationship
  current transition identity
  failure correction path

whether Pending/Saved/Failed become
  reusable parameterized persistence language
or
  remain specimen-local until repeated pressure

exact UI policies for each persistence leaf
~~~

Do not advance another architectural layer until this frontier is resolved enough to remain
construction-grade and human-readable.


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


### Saved checkpoint — operation-owned results, next scope questions

The async Effect notation is currently:

~~~text
effect = begin {
  operation(...)
    .results {
      Success { ... }
      Failure { ... }
      Stale { ... }
    }
}
~~~

The `.results` block belongs structurally to the operation that returns those leaves. It is exhaustive;
a reachable result case cannot disappear merely because the usual path succeeds quickly.

Existing SCAE terminators remain the immediate semantic choice:

~~~text
.stay()
  -> current semantic State stays current while the Effect runs

.admit<Next>()
  -> Next is admitted immediately; later results may confirm, preserve or correct
~~~

The Walk now pauses before another syntax decision.

Next questions:

~~~text
lifecycle scope
  what owns begun work if the initiating Screen disappears?

confirm scope
  what exact currentness/attempt/transition truth does confirm() confirm?

returned success value
  how is returned State/value made available to later semantic logic?

local variables
  no arbitrary local-variable role has yet been justified in Origin;
  important values should remain source-addressable by their semantic role
~~~

This is the resume coordinate.


## Async architecture possibilities — preserve before choosing

Asyncness alone does not choose an architecture. Current candidates are deliberately separate:

~~~text
A. DIRECT RETURNED OPERATION

Effect
  -> begin {
       operation(...)
         .results {
           Success { ... }
           Failure { ... }
         }
     }

Use when the returned operation result itself is the meaningful consequence and no longer-lived
truth owner already owns that reality.


B. STATE-OWNED ASYNC REALITY

Behavior / Effect
  -> asks a rightful owner to do work

rightful owner
  -> exposes current VexState as reality changes

Use when the async system already has a durable/current truth owner. Do not duplicate that owner's
truth as callback flags merely because the target API is asynchronous.


C. CONVERGENCE OF INDEPENDENT TRUTHS

complete VexState A ----\
                         -> ConvergenceRelay InputState
complete VexState B ----/      -> processStates()
                                -> OutputState

Use only when A and B remain independently meaningful current truths and the relationship between
them earns its own owner.

ASYNC != CONVERGENCE
ASYNC != CALLBACK FLAGS
CONVERGENCE != RESULT HANDLER
~~~

Third-party coroutine/callback/Promise mechanics may be wrapped at the target boundary. Origin should
describe the semantic ownership pattern, not import one platform's async vocabulary.

## Real Android Debug Menu baseline

Current Android main is intentionally simpler than the Origin experiment:

~~~text
DebugMenuScreen.DarkMode
  toggleRef(
    id = "body.dark-mode",
    intent = invoke(AppActions.ToggleDarkMode)
  )
        |
        v
DebugMenuScreen.appActionRegistrations()
        |
        v
context.toggleDarkMode()
        |
        v
VexLifeSession.toggleDarkMode()
        |
        v
darkTheme = !darkTheme
        |
        v
DebugMenuScreenContent(... darkTheme)
        |
        v
VexElementTree.toggleChecked
~~~

Current baseline facts:

~~~text
darkTheme
  = in-process mutable Boolean owned by VexLifeSession

current Android baseline has:
  no ThemeMode Behavior family
  no ThemeMode repository
  no persistence contract
  no ThemeMode ConvergenceRelay
  no async ThemeMode path
~~~

Therefore the Origin Walk is not documenting an already-existing target architecture. It is using the
small current Debug Menu behavior as a controlled specimen for discovering the portable architecture
that a later Android realization may adopt.

Next pressure specimen: VexStream Playback, because current source already contains admitted intent,
provider latency, observation, reconciliation, lifetime ownership and UI projection.


## VexStream Playback pressure specimen — current Android map

Current Android main has no VexStream Playback class named ConvergenceRelay.

The existing path is:

~~~text
VexStreamPlaybackExperience.activate(Control)
        |
        v
Media3VexStreamPlaybackConnection.activate(Control)
        |
        +-> currentSemanticState(Media3)
        |     observed provider State
        |     + connection-local pending intent
        |     -> reconcileVexStreamPlaybackObservation(...)
        |
        +-> Control + CURRENT State -> Act
        |
        +-> CURRENT State + Act -> Effect + admitted State kind
        |
        +-> pending.after(Effect)
        |
        +-> current.afterIntent(Effect)
        |     -> publish admitted semantic Projection immediately
        |
        +-> realize(Effect) against Media3
        |
        +-> Media3 observation
              |
              v
           reconcileVexStreamPlaybackObservation(...)
              |
              v
           publish reconciled Projection
~~~

Current source distinctions:

~~~text
VexStreamPlaybackState
  = public semantic Playback truth

VexStreamPlaybackPending
  = Connection-local implementation state
  = explicitly not a fifth Behavior concept

Media3 Player observation
  = provider truth entering the Connection

reconcileVexStreamPlaybackObservation(observed, pending)
  = preserves newer admitted intent against stale provider observation
  = clears pending when provider acknowledgement matches
  = clears/inherits pending according to terminal/provider meaning

VexStreamPlaybackDisplayState
  = downstream view classification
  = not another truth owner
~~~

The canonical VexLife portable Play/Pause contract already represents observation reconciliation as
laws with no Control, Act or Effect:

~~~text
provider observation reconciliation
  controlRefOrNull = null
  resolvedActRefOrNull = null
  effectRefOrNull = null
~~~

Therefore the next architecture question is not "add a Relay because async exists."

It is:

~~~text
Does Playback's current:
  admitted semantic intent
  + provider-observed truth
  -> reconciled semantic truth

remain best owned inside the Connection boundary,

OR

do those inputs become independently-owned complete VexStates whose relationship should be promoted
to a ConvergenceRelay?

Do not answer until the actual ownership/lifecycle/readability pressure is compared against the
existing Compound Relay pattern.
~~~

Maps is the next comparison specimen because it already contains concrete ConvergenceRelays over
independently-owned current truths.


## Future-instance use of these examples

These examples are a semantic comparison set, not a backlog of code changes.

Use them to reduce assumption when mapping one meaning across VexBoard and Android:

~~~text
1. Identify the semantic owner first.
2. Identify the current Android realization/evidence second.
3. Ask whether the portable relationship can explain that realization without target-specific jargon.
4. Ask whether VexBoard could show the same relationship without hiding ownership or causal order.
5. Only then consider a refactor or new reusable construct.
~~~

The intended comparison is:

~~~text
DEBUG MENU
  current source:
    toggle -> AppAction -> VexLifeSession.darkTheme -> UI

  purpose in this Walk:
    smallest specimen for State / Control / Act / Effect / UI-form mapping


VEXSTREAM PLAYBACK
  current source:
    Control -> Act -> Effect
    + immediate admitted intent
    + Media3 observation
    + connection-local pending/reconciliation
    -> Projection / DisplayState

  portable source:
    provider-observation law rows exist without Control / Act / Effect

  purpose in this Walk:
    determine how later reality re-enters portable meaning without pretending it is another human action


MAPS
  current source:
    independently-owned current truths
    -> Compound ConvergenceRelay InputState
    -> processStates()
    -> OutputState

  purpose in this Walk:
    determine what additional ownership pressure earns ConvergenceRelay rather than ordinary local reconciliation
~~~

Do not infer:

~~~text
all async work -> begin/results
all provider observations -> ConvergenceRelay
all status fields -> separate States
all target implementation memory -> portable semantic identity
~~~

Also do not hide meaningful differences merely to keep the three specimens visually identical.

The desired end state is an unmistakable mapping:

~~~text
same semantic relationship
  -> human-readable VexBoard projection
  -> AI-readable portable construction meaning
  -> target-native Android realization
  -> traceable source/evidence back to that relationship
~~~

A future AI should use the examples to ask fewer invented questions, not to generate more architecture.


## VexBoard ThemeMode workspace mock — bounded patient zero

This mock is an interaction/readability contract, not final pixels.

### Drawer closed — default

~~~text
┌─────────────────────────────────────────────────────────────────────────────┐
│ Debug Menu / Theme Mode                 [Library] [Feature Context]          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                               BOARD                                         │
│                                                                             │
│     UI                                              LOGIC                    │
│                                                                             │
│  ┌─────────────┐                            ThemeMode                        │
│  │   Switch    │                            ├─ Light                         │
│  │ active=Dark │                            └─ Dark                          │
│  └──────┬──────┘                                │                            │
│         │ activate                              │                            │
│         └──── control.debug-menu.theme-mode ────┤                            │
│                                                  ▼                           │
│                                            ThemeModeToggle                   │
│                                                  │                           │
│                                             Behavior                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
~~~

The Board gets the full horizontal space by default.

### Library open — same feature, one auxiliary drawer

~~~text
┌──────────────────────────────────────────────────────┬──────────────────────┐
│ Debug Menu / Theme Mode                             │ Library          [×] │
├──────────────────────────────────────────────────────┤                      │
│                                                      │ USED HERE            │
│                     BOARD                            │                      │
│                                                      │ ThemeMode            │
│  Switch ── Control ──> ThemeModeToggle              │ Light | Dark         │
│                          │                           │                      │
│                       Behavior                       │ Theme control        │
│                                                      │                      │
│                                                      │ Theme persistence    │
│                                                      │ owner: unresolved    │
│                                                      │                      │
│                                                      │ Browse project ▸     │
└──────────────────────────────────────────────────────┴──────────────────────┘
~~~

The Library defaults to **Used here**. Wider project inventory is opt-in.

### Feature Context open — replaces Library, does not stack beside it

~~~text
┌──────────────────────────────────────────────────────┬──────────────────────┐
│ Debug Menu / Theme Mode                             │ Feature Context [×] │
├──────────────────────────────────────────────────────┤                      │
│                                                      │ Project              │
│                     BOARD                            │ VexSync DebugMenu     │
│                                                      │ Blueprints           │
│  Switch ── Control ──> ThemeModeToggle              │                      │
│                          │                           │ Current work         │
│                       Behavior                       │ ThemeMode Origin Walk │
│                                                      │                      │
│                                                      │ Current frontier    │
│                                                      │ persistence owner   │
│                                                      │ observation path    │
│                                                      │                      │
│                                                      │ Open VexWork source │
└──────────────────────────────────────────────────────┴──────────────────────┘
~~~

### Supporting-surface rule

~~~text
Inspect open
  -> Library closed
  -> Feature Context closed

Library open
  -> Inspect closed
  -> Feature Context closed

Feature Context open
  -> Inspect closed
  -> Library closed

all closed
  -> full-width Board
~~~

This avoids the failure mode:

~~~text
toolbar | library | canvas | inspector | feature context | source
~~~

where every individually useful surface makes the whole feature unreadable.

### Library truth-status example

The drawer must distinguish established meaning from work-in-progress design:

~~~text
ThemeMode
  ESTABLISHED WORKING MEANING

control.debug-menu.theme-mode
  ESTABLISHED WORKING IDENTITY

ThemeModeToggle
  CANDIDATE LANGUAGE / RELATIONSHIP

Theme persistence owner
  UNRESOLVED

ThemeMode ConvergenceRelay
  NOT ESTABLISHED
~~~

Do not make an unresolved item look like an available reusable dependency.

### VexWork relationship

Feature Context should reference, not duplicate:

~~~text
project.vexsync.debugmenu-blueprints
work.vexsync.debugmenu-blueprints.feature-intention-builder-discovery
github.pull.vexwork.178
~~~

The existing VexWork Project source projector proves the read-only direction:

~~~text
rightful VexWork truth
-> bounded VexBoard projection
-> human context/navigation

not:

VexBoard drawer
-> second copy of Work truth
~~~

### Handoff to current VexBoard implementation

Current VexBoard PR #155 already owns the renderer/Origin-IDE implementation paths needed to realize
this experience. This VexSync lane deliberately does not edit those paths concurrently.

The implementation owner should consume this specimen with the smallest change that preserves:

~~~text
full Board by default
one closable auxiliary drawer
mutually-exclusive Inspect / Library / Feature Context modes
Library defaults to Used here
Feature Context is read-only VexWork projection
unresolved Library entries remain visibly unresolved
no new universal repository/Relay ontology from this one specimen
~~~


## Current consolidated ThemeMode example

**Currentness:** `CURRENT_WORKING_MODEL`. This example is the shortest current specimen that preserves
the full ThemeMode circuit without replaying superseded persistence vocabulary.

### State

~~~text
ThemeMode
  NOT_SET
  Light
  Dark
~~~

### Durable Family boundary

~~~text
FamilyStore<ThemeMode>

  ObservableState
  Get()
  Save(State)
  Forget()
~~~

~~~text
Get()
  = immutable snapshot of stored truth

ObservableState
  = ongoing observation of the same stored truth

Save(State)
  = make State durable

Forget()
  = durable State becomes NOT_SET
~~~

### Human toggle — Act is the State + Control behavior scenario

The current model no longer creates `SelectDark` / `SelectLight` Act values. That intermediate
vocabulary repeated meaning already present in the State-scoped Control relationship.

~~~text
state<ThemeModeFamily.State.Light> {
  on(
    control = ThemeModeFamily.Control.Toggle,

    effect = begin(mode = Replaceable) {
      Save(ThemeModeFamily, ThemeModeFamily.State.Dark)
        .results {
          Success { }
          Failure { }
        }
    }
  )
  .admit<ThemeModeFamily.State.Dark>()
}

state<ThemeModeFamily.State.Dark> {
  on(
    control = ThemeModeFamily.Control.Toggle,

    effect = begin(mode = Replaceable) {
      Save(ThemeModeFamily, ThemeModeFamily.State.Light)
        .results {
          Success { }
          Failure { }
        }
    }
  )
  .admit<ThemeModeFamily.State.Light>()
}
~~~

Meaning:

~~~text
CURRENT State + Control.Toggle
-> the authored on(...) scenario is the Act
-> Effect attempts Save(...)
-> selected ThemeMode is admitted immediately
-> UI may project it immediately

Save
-> runs asynchronously
-> repeated pending ThemeMode saves share one FamilyStore lane
-> Replaceable means newer same-lane intent may replace older pending/cancellable work
~~~

A replaced episode that never began `Save` has no Save result.

### Durability-gated comparison shape

~~~text
state<CurrentState> {
  on(
    control = SomeControl,

    effect = begin(mode = Sequenced) {
      Save(SomeFamily, NextState)
        .results {
          Success {
            admit<NextState>()
          }

          Failure {
          }
        }
    }
  )
  .stay()
}
~~~

Meaning:

~~~text
stay now
-> Save later
-> Success emits a later admission
-> Failure has no later State consequence
~~~

The later `admit<State>()` is a new State emission into the State owner, not a second return from
`on(...)`.

### Store observation does not bypass Behavior

~~~text
FamilyStore.ObservableState
-> Connection / reconciliation
-> optional admit<State>()
-> CURRENT semantic State
-> Projection
-> UI
~~~

The UI never treats stored State as visible truth merely because the Store emitted it.

### NOT_SET follows System appearance

~~~text
stored preference     System appearance     effective ThemeMode

Light                 Light / Dark           Light
Dark                  Light / Dark           Dark
NOT_SET               Light                  Light
NOT_SET               Dark                   Dark
~~~

~~~text
stored override exists
-> stored override governs

stored override = NOT_SET
-> System appearance governs
~~~

The store may remain `NOT_SET` while CURRENT semantic ThemeMode is Light or Dark.

### Full causal lap

~~~text
STARTING UI
  ThemeMode.Light
  Switch / selector reflects Light
        |
        v
ThemeModeFamily.Control.Toggle
        |
        v
ThemeModeFamily.Behavior
  CURRENT State.Light + Control.Toggle
        |
        v
Act = this authored scenario
        |
        +-> admit<ThemeModeFamily.State.Dark>()
        |
        +-> begin(mode = Replaceable)
              Save(ThemeModeFamily.State.Dark)
                 |
                 +-> Success / Failure
        |
        v
FamilyStore durable truth / ObservableState
        |
        v
Connection
        |
        v
stored override + SystemAppearance
        |
        v
ThemeMode Convergence
        |
        v
effective ThemeMode
        |
        v
CURRENT semantic State
        |
        v
Projection
        |
        v
RESULT UI
~~~

### VexBoard projection consequence

Foreground:

~~~text
LEFT
  final Starting Screen
  relevant control highlighted
  final Result Screen

RIGHT
  full-height active logic path
  Control -> Behavior Act -> begin -> Save -> admit
~~~

Independent deeper terrain:

~~~text
LEFT DEPTH
  UI Blueprint / IDs / bindings / conditions

RIGHT DEPTH
  FamilyStore / ObservableState
  SystemAppearance
  bounded ThemeMode Convergence
  Connection / reconciliation
~~~

The foreground remains recognizable while either side enters depth.

<!-- [VXG RealForever][VEXSYNC][ORIGIN-WALK][THEMEMODE][CURRENT-EXAMPLE] -->


## Causal episode — the existing app-action seam is the UI -> Family handoff

**Currentness:** `CURRENT_WORKING_MODEL`.

This episode answers the first unresolved UI question from the structural-Act checkpoint:

> What is the smallest truthful UI -> Family boundary in the Android system that already exists?

### Circumstance

The real Debug Menu Toggle already crosses several established Android boundaries:

~~~text
ToggleElement
-> ElementIntent.Invoke(ActionKey)
-> VexRuntime
-> AppActionRegistrations
-> DebugMenuScreen feature-local handler
-> VexLifeSession.toggleDarkMode()
~~~

At the same time, the V2 Family proof now has:

~~~text
ThemeModeFamily.Control.Toggle
ThemeModeFamily.Behavior
~~~

That creates an apparent duplication:

~~~text
AppActions.ToggleDarkMode
vs
ThemeModeFamily.Control.Toggle
~~~

The question was whether one should replace the other.

### Current source pressure

The existing UI architecture gives each coordinate a different job.

`DebugMenuScreen.DarkMode` is the stable UI element identity. The Journey specimen addresses that
element directly.

`ActionKey` is documented as the stable application-action identifier for an effect owned outside the
cell. `AppActionRegistrations` uses it to enforce one handler owner and to prove that every registered
Screen `Invoke` has coverage.

`VexRuntime` validates/logs the element interaction before interpreting its intent. For `Invoke`, it
forms an `AppActionRequest` and dispatches through the current immutable registration snapshot.

The actual ThemeMode effect owner is still feature-local:

~~~text
DebugMenuScreen.appActionRegistrations
  AppActions.ToggleDarkMode
  -> toggleDarkMode()
~~~

So the app action is not the effect owner even today.

### Candidate A — collapse AppAction into Family Control everywhere

A tempting shape is:

~~~text
DebugMenuScreen.DarkMode
-> ThemeModeFamily.Control.Toggle
~~~

directly in the generic Element layer.

That would make the Elements / generic runtime boundary know Family Control types or require a new
generic heterogeneous Control carrier.

No current problem requires that coupling.

It would also bypass or recreate responsibilities currently supplied by:

~~~text
ActionKey identity
AppActionRegistrations one-owner validation
Invoke coverage
generic VexRuntime dispatch
~~~

So this candidate removes a small one-to-one mapping by widening a lower-level shared boundary.

It is not the minimum-complete correction.

### Candidate B — preserve both and invent a translation registry

Another possible response is:

~~~text
ActionKey
-> global ActionToFamilyControlRegistry
-> Family Control
~~~

That adds a second routing/ownership map beside `AppActionRegistrations`.

The current feature has no consumer that needs such a registry independently.

~~~text
EXISTING FEATURE-LOCAL REGISTRATION
already knows:
  which ActionKey arrived
  which feature owns it
  which narrow dependency realizes it
~~~

Adding another registry would duplicate the handoff rather than clarify it.

### Surviving model — map once at the existing feature owner

The smallest current handoff is:

~~~text
DebugMenuScreen.DarkMode
-> AppActions.ToggleDarkMode
-> DebugMenuScreen appAction registration
-> ThemeModeFamily.Control.Toggle
-> live ThemeMode activation/currentness boundary
~~~

This keeps:

~~~text
ActionKey
  as app/UI routing identity

Family.Control
  as Family semantic request
~~~

and performs the translation exactly where generic app routing reaches the ThemeMode feature owner.

No new translation framework is introduced.

### The Toggle renderer already protects the stale-render rule

The current native cell is unusually useful evidence:

~~~kotlin
Switch(
    checked = checked,
    onCheckedChange = { handler.activate(element) },
)
~~~

The newly rendered Boolean supplied by the widget callback is intentionally not forwarded.

So the existing generic UI already behaves like the Origin currentness invariant wants:

~~~text
rendered checked State
  -> presentation only

activation
  -> element identity / declared intent only
  -> later currentness read by the rightful semantic owner
~~~

This means the ThemeMode migration should preserve that property rather than introduce a new
`activate(renderedState, ...)` shape.

### What the Debug Menu actually needs to observe

Current `DebugMenuScreenContent` supplies:

~~~text
toggleChecked = DarkMode element && darkTheme
~~~

and `ToggleElement` itself explicitly does not store checked State.

Therefore the Debug Menu UI's current semantic need is only:

~~~text
CURRENT ThemeMode
-> is Dark?
-> checked Boolean
~~~

It does not yet require raw Family State as a Composable API.

A future Screen behavior that genuinely needs the semantic State may earn a richer projection. This
Toggle does not.

### Current conclusion

~~~text
UI ELEMENT
  identifies the interacted-with surface

APP ACTION KEY
  routes that surface to one app-owned effect handler

FAMILY CONTROL
  is the semantic request entering Family Behavior

FEATURE-LOCAL APP ACTION REGISTRATION
  is the existing truthful mapping seam between them

UI READ
  consumes a narrow projection

UI WRITE
  emits no rendered State snapshot

LIVE THEME OWNER
  must supply both projection currentness and activation currentness
~~~

This conclusion resolves the UI boundary without deciding the production Runtime object.

### Reopen conditions

Reopen this boundary if a real consumer proves one of these:

~~~text
the generic UI system can carry typed Family Controls directly
without losing its independent action-routing / ownership-coverage role

a non-UI producer requires a shared Control-addressing boundary
that the feature-local registration cannot represent

the Debug Menu presentation genuinely needs more than the current checked projection

the current app-action layer stops carrying an independently useful routing / ownership responsibility
~~~

Until then, do not collapse the layers for symmetry and do not add another translator.

### Next unresolved edge

~~~text
same semantic ThemeMode currentness
must feed:
  Debug Menu checked projection
  application theme projection
  activation's CURRENT State read

next question:
  what smallest session-lived owner/mechanism carries those responsibilities
  and realizes/reconciles Effects truthfully?
~~~

That is the next Runtime Origin Walk. The reference-test names remain evidence, not production answers.

<!-- [VXG RealForever][VEXSYNC][ORIGIN-WALK][UI-ACTION-FAMILY-CONTROL][CAUSAL-EPISODE] -->


## Causal episode — persistence pressure was useful, but not a current ThemeMode requirement

**Currentness:** `CURRENT_WORKING_MODEL`.

### Circumstance

The V2 specimen had gained a rich two-scope Effect:

~~~text
begin(mode) {
  Save(State)
    .results {
      Success { ... }
      Failure { ... }
    }
}
~~~

That pressure was useful. It taught:

~~~text
dispatch != provider success
immediate State consequence != later result consequence
Replaceable != Sequenced
Effect != Save operation
~~~

But the real Debug Menu walk then reached the current target.

### Target evidence

Current Android Theme Mode is session-local:

~~~text
VexLifeSession.darkTheme
-> app theme
-> Debug checked state

Debug action
-> VexLifeSession.toggleDarkMode()
-> same darkTheme truth changes
~~~

The session explicitly disclaims process-death restoration.

The VexSync work outcome asks for the dark/light Theme Mode Origin/Android round trip. It does not say
that persistence is required before the feature can be considered truthful.

That creates removal pressure on mandatory Save.

### Candidate A — add Store / Connection because the reference already has them

This would make the target resemble the teaching reference:

~~~text
UI
-> Connection
-> Store
-> Save
-> observed State
~~~

But the current feature has no provider/store whose truth must be observed.

The new objects would solve a problem created by the reference rather than a problem observed in the
target.

Rejected for the current feature.

### Candidate B — preserve mandatory Effect with NoOp / fake Save

This keeps the API symmetrical:

~~~text
Light + Toggle
-> NoOpEffect
-> admit Dark
~~~

or:

~~~text
Light + Toggle
-> Save(Dark)
-> admit Dark
~~~

even though there is no real Save.

Removal test:

> If the fake Effect disappears, what truth disappears?

For the current in-process Toggle:

~~~text
current State      remains
Control            remains
Act meaning        remains
admitted State     remains
UI currentness     remains
session lifetime   remains
~~~

Nothing required disappears.

Rejected.

### Surviving model — Effect is optional because reality work is optional

~~~text
Light + Toggle
-> Act
-> NO_EFFECT
-> admit Dark

Dark + Toggle
-> Act
-> NO_EFFECT
-> admit Light
~~~

The Effect-bearing durability specimen remains:

~~~text
NotSet + Toggle
-> Act
-> begin Sequenced
-> Save Dark
-> stay now
-> Success later admits Dark
~~~

So the useful earlier discovery is preserved without becoming a mandatory ceremony.

### Why this is not deleting SCAE Effect

Effect remains the answer to:

> What may reality/runtime be asked to do because of this Act?

Sometimes the truthful answer is:

~~~text
nothing outside semantic State admission
~~~

That is not another Effect value. It is the absence of an Effect.

~~~text
NO EFFECT
!= NO-OP EFFECT
!= FAILED EFFECT
~~~

### Runtime consequence

The actual target already has one live currentness owner:

~~~text
VexLifeSession
~~~

Therefore the next production walk should start by trying to **reuse** that owner:

~~~text
session current ThemeMode
-> checked projection
-> app theme projection

activate(Control)
-> session re-reads current ThemeMode
-> Family Behavior
-> admitted next ThemeMode
~~~

Do not add a Connection merely to make the source resemble the reference.

### Reopen conditions

A separate reality boundary becomes earned when a real feature requirement introduces something the
session-local truth cannot honestly carry, such as:

~~~text
durable preference Store
SystemAppearance observation
NOT_SET fallback semantics
external/provider result
async overlapping Effect episodes
cross-process restoration
another lifetime owner
~~~

Then walk that exact pressure and let the required owner emerge.

<!-- [VXG RealForever][VEXSYNC][ORIGIN-WALK][EFFECT-OPTIONAL][CAUSAL-EPISODE] -->


## Causal episode — class-only admission recreated hidden runtime work

**Currentness:** `CURRENT_WORKING_MODEL`.

### Circumstance

After removing the fake ThemeMode Save from Light/Dark Toggle, the Act looked like:

~~~text
Light + Toggle
-> Effect = none
-> admit State.Dark::class
~~~

The UI/session walk then asked a practical question:

> What exact value does VexLifeSession assign as the new current semantic State?

The Act did not contain it.

### Candidate A — let the session map State kinds back to values

~~~text
State.Dark::class -> State.Dark
State.Light::class -> State.Light
~~~

This works for patient-zero singleton objects.

But the mapping becomes false abstraction as soon as State carries flavor:

~~~text
Song(id = A, position = 10)
Song(id = B, position = 90)

both
-> Song::class
~~~

A class token destroys the difference.

The session would then need a factory/registry plus inputs the Behavior already discarded.

Rejected.

### Candidate B — borrow the Effect's Save value

The earlier reference effectively did:

~~~text
admitted State kind
+ Save(State.Dark).state
-> concrete admitted State.Dark
~~~

That works only because the old POC made every Act carry Save.

It couples semantic State admission to an Effect operation that may not exist.

Rejected.

### Surviving model — carry the State value at the semantic source

~~~text
Light + Toggle
-> Act
-> Admit(State.Dark)

Song(...) + Control
-> Act
-> Admit(Song(id, position))
~~~

No reconstruction layer is needed.

Stay remains different:

~~~text
Stay
-> current State value remains current
-> no destination value exists
~~~

Later result admission uses the same principle when the concrete later State is already known:

~~~text
Success
-> Admit(State.Dark)
~~~

Dynamic provider-result payload mapping remains open until a real result-bearing consumer earns it.

### Why this reduces runtime architecture

The session no longer needs to answer:

~~~text
How do I construct the State kind Behavior selected?
~~~

It receives the semantic value directly.

That makes the current production boundary smaller:

~~~text
read current State
-> Behavior.resolve(current, Control)
-> Act.immediateDisposition
-> Stay
   or
-> Admit(nextState)
-> publish nextState
~~~

No generic State factory.
No Family registry.
No destination decoder.

### Placement consequence

Current production Behavior precedent is feature-local under `app/`; the generic
`architecture/behavior` module owns the grammar, not ThemeMode product semantics.

The theme renderer under `ui/` owns target treatment, not semantic truth.

The session already owns app-lifetime currentness.

So the next source step is a **bounded product placement + session integration**, not another generic
foundation type.

<!-- [VXG RealForever][VEXSYNC][ORIGIN-WALK][CONCRETE-ADMISSION][CAUSAL-EPISODE] -->


---

## Origin-Walk checkpoint — live Family, required Acts, mandatory DisplayState

**Downstream Android proof head:** `711c1e49b83e4e48e3742aff4e2be99ddebabad7`

The ThemeMode walk has now pressure-corrected the V2 entrance and UI-facing ownership shape.

The current Family-rooted model is:

~~~text
Family
  State
  Control
  DisplayState
  current
  acts
  activate(Control)
~~~

### Required live Family responsibilities

~~~text
State
  semantic truth vocabulary

Control
  semantic request vocabulary

current
  one CURRENT semantic State owned by the live Family

acts
  required State + Control -> Act graph

activate(Control)
  foundational entrance
  -> Family re-reads its own CURRENT State
  -> selects the authored Act
  -> applies immediate stay/admit

DisplayState
  mandatory UI-facing ownership field
  -> foundation default = Empty(current)
  -> richer Family-scoped cases may override when earned
  -> always preserves underlying semantic State
~~~

The caller does not supply State to activation. This preserves the stale-render invariant and removes
the public `Behavior.resolve(current, control)` vocabulary from the UI/runtime-facing path.

### Act stays one causal episode

The current authoring direction keeps the whole Act inside one `on(Control) { ... }` block:

~~~text
state<Light> {
  on(Toggle) {
    admit(Dark)
  }
}

state<NotSet> {
  on(Toggle) {
    stay()

    begin(mode = Sequenced) {
      Save(Dark)
        .results {
          Success {
            admit(Dark)
          }

          Failure {
          }
        }
    }
  }
}
~~~

No new `immediate` or `realize` language is introduced.

~~~text
stay/admit at on-block root
  = immediate semantic disposition

begin(mode = Replaceable | Sequenced)
  = later-running Effect episode

Success / Failure
  = operation result branches

admit inside a result
  = later semantic State admission
~~~

### DisplayState boundary

DisplayState is required infrastructure but is not another admitted SCAE State.

~~~text
Act
-> admit(State)
-> Family.current

Family.current
-> Family.displayState
-> UI
~~~

The minimum default is:

~~~text
DisplayState.Empty(current)
~~~

A Family may expose richer Family-scoped presentation cases such as Active / Inactive / Transitioning
when pressure earns them. Those categories are not universalized from ThemeMode alone.

This keeps source ownership discoverable for fresh instances while avoiding detached feature-specific
display helper classes.

### Next Origin pressure

The next question is now intentionally provider-facing:

> When a selected Act contains begin(...) work against a third-party/rightful source of truth, what
> smallest connection/execution relationship lets that provider truth return into the same Family
> circuit without splitting causality or making the provider/store itself the semantic State owner?

Media3-backed VexStream Playback is comparison evidence because it already has a real provider truth,
connection/currentness, pending intent, and UI-facing DisplayState. It is evidence to pressure the V2
shape, not a template to copy wholesale.

<!-- [VXG RealForever][VEXSYNC][ORIGIN-WALK][LIVE-FAMILY][DISPLAY-STATE][NEXT-PROVIDER-PRESSURE] -->


---

## Origin-Walk checkpoint — Family Store, begin execution and accountant

**Downstream Android V2 proof head:** `82c249276f5ae43e91630b60d5f3b8d6c55ac34b`

The persistence pressure has now refined the live Family without introducing another feature-specific
Execution owner.

Current Family-rooted map:

~~~text
Family
  State
  Control
  DisplayState
  Store
  current
  acts
  activate(Control)
~~~

### Store remains visible from the Family

Reusable storage language is now:

~~~text
VexStore
  -> VexFamilyStore<Family, State>
       ObservableState
       Get()
       Save(State)
       Forget()

Concrete Family
  Store : VexFamilyStore<ThisFamily, State>
~~~

The two truths remain distinct:

~~~text
Family.current
  what is semantically true now

Family.Store durable State
  what has been saved for continuity
~~~

So immediate UI truth does not wait for persistence:

~~~text
admit(Dark)
-> Family.current = Dark
-> DisplayState / UI may update

begin(Replaceable) {
  Save(Dark)
}
-> background persistence continues independently
~~~

### begin is already the execution phase

No `ThemeModeExecution` / `FamilyExecution` sibling was earned.

~~~text
Act
  immediate:
    stay / admit

  execution:
    begin(mode)
      Operation
~~~

`Operation` is the generic slot under begin. It does not erase stronger domain language:

~~~text
Operation
  -> StoreOperation
       -> Save(State)
       -> future Store verbs as actually exercised

future provider Operation families
  must be earned from provider pressure
~~~

The Android realization uses the existing VexExecution foundation underneath begin. The actual suspend
callable (for persistence, `Family.Store::save`) is both the invoked operation and the source-derived
execution coordinate.

~~~text
Replaceable
  newer same-source episode replaces prior active work

Sequenced
  accepted same-source episodes retain order
~~~

Cancellation/replacement is execution lifetime, not another Save Failure result.

### Success / Failure is now executable pressure

The first Android target Store specimen uses SharedPreferences `commit()`:

~~~text
commit() == true
-> Operation Success

commit() == false
-> Operation Failure
~~~

The specimen maps Family/State source identity to SharedPreferences primitive representation at the
target edge instead of introducing a separate manually authored `theme_mode` / `dark` semantic ID
catalog.

That representation is intentionally provisional:

~~~text
SOURCE IDENTITY
-> target serialization

CURRENT PATIENT ZERO
!= permanent cross-version serialized-name guarantee
~~~

Rename/migration compatibility remains a future durability pressure.

### VexLogger is the Family accountant

The same existing VexLogger may implement the Family-facing accountant contract. A Family does not
create another logger.

It may witness:

~~~text
Control accepted
State admitted
Operation began
Operation Success
Operation Failure
~~~

This means an empty result branch remains perceptible:

~~~text
success { }
~~~

does not mean "nothing happened." It means the Operation succeeded and no additional semantic State
consequence was authored.

The logger remains observational:

~~~text
LOGGER WITNESSES ACCEPTED FACT
!= LOGGER OWNS FAMILY TRUTH
!= LOGGER FAILURE REVERSES EFFECT
~~~

### Current proof boundary

Android #192 now contains source/tests for:

~~~text
begin -> VexExecution Replaceable / Sequenced lanes
Family.Store -> real suspend Save
Save result -> Success / Failure branch
later result admission
VexLogger Family witnessing
SharedPreferences commit target specimen
Save/Get/Forget durable round trip
Family reconstruction from restored State
~~~

Repository Gradle execution and Android instrumentation execution remain pending. Real process
kill/swipe-relaunch restoration is not yet claimed.

Production ThemeMode source remains separately owned by Android PR #188 and was not silently absorbed
into this proof.

### Next pressure

First complete repository/device persistence proof. Then pressure the same shape with a rightful
third-party truth owner such as Media3:

~~~text
Family
-> Act
-> begin(mode)
-> provider Operation
-> provider result / observation
-> reconciliation or later State consequence
-> DisplayState
-> UI
~~~

The provider must not become the Family semantic State owner merely because it owns external reality.

<!-- [VXG RealForever][VEXSYNC][ORIGIN-WALK][FAMILY-STORE][BEGIN-EXECUTION][ACCOUNTANT] -->


---

## Origin-Walk stability boundary — preserve core, reopen runtime

**Downstream Android #192 head:** `8df0c66ce2ea8a9d77c7a736648a8347a002f311`

A fresh-instance review against ThemeMode plus existing VexStream, Maps and Conversation source now
distinguishes the V2 architecture that is safe to preserve from the runtime/generalization that still
needs pressure.

### Preserve as stable direction

~~~text
Family as discoverable semantic root

Family.State
Family.Control
required minimum Family.DisplayState role

Act = CURRENT State + Control scenario

concrete State admission

immediate stay/admit
vs
later result-scoped consequence

Effect may be absent

begin(mode) = semantic execution phase

Operation = structural work slot under begin

stronger verbs remain visible
  Save stays Save

one Family accountant witnesses accepted facts
  logger != truth owner

independently owned complete truths
  remain Relay / Convergence responsibilities
~~~

### Refined rather than generalized

DisplayState remains mandatory, but the common display role no longer requires every projection to
carry the full semantic State. `Empty(current)` remains the default fallback; concrete displays may
project only bounded UI meaning.

Store remains discoverable from the Family, but is split into:

~~~text
VexFamilyStore<Family>
  broad Family-visible storage/custody role

VexFamilyStateStore<Family, State>
  ThemeMode-style durable State specialization
  Get
  ObservableState
  Save(State)
  Forget
~~~

This prevents VexStream media custody, Maps artifacts, or Conversation repositories from being
reclassified as "Family State persistence" merely for API symmetry.

SharedPreferences' boolean persistence result is now `VexStoreWriteResult`, deliberately narrower
than a universal Operation-result model.

The Family accountant is an explicit dependency. Tests/previews must explicitly choose a no-op
accountant rather than receiving one silently.

### Keep OPEN until real consumer pressure

~~~text
payload-bearing Control
dynamic State transformation
external provider observation -> semantic current State
observable Family/DisplayState output for Compose
Control availability/projection
typed Operation-result payload
multi-instance Family execution identity
Sequenced lane queue/custody
provider-affine begin execution
cross-version durable identity
privacy-bounded diagnostic payload
~~~

The current live V2 Family runtime is therefore a locally-owned ThemeMode patient-zero realization of
the stable authoring language, not proof that Family is the universal current-State owner.

Playback / Select / Seek remains the preferred next pressure because it attacks provider truth,
payload Control, availability, affinity, reconciliation and UI observation together.

<!-- [VXG RealForever][VEXSYNC][ORIGIN-WALK][STABILITY-BOUNDARY] -->


---

## Origin-Walk currentness boundary

**Downstream Android #192 head:** `f3b80ef6e37d7045a296bebf3b1cc5ed1abc555f`

The Origin Walk now separates several currentness questions instead of treating currentness as one
generic runtime capability.

~~~text
PROVED FOR LOCALLY-OWNED THEMEMODE PATIENT ZERO

activation currentness
  UI sends Control only
  -> Family.activate(Control)
  -> Family re-reads CURRENT semantic State

immediate semantic currentness
  selected Act
  -> stay / admit(concrete State)


OPEN

async result currentness
  older begin/result vs newer semantic activity

externally observed currentness
  Media3 / SystemAppearance / provider / location
  -> lawful reconciliation into Family semantic truth

UI observation currentness
  Family/DisplayState changes
  -> Compose observation/recomposition

durable currentness
  Store observation/reconciliation into live Family

instance/execution currentness
  several Family instances / queued episodes
~~~

The stable reusable law is deliberately narrower:

~~~text
locally-owned semantic State
  -> activation re-reads the rightful current owner

externally-owned truth
  -> ownership + observation + reconciliation must be earned from the real provider/Relay relation
~~~

Do not close the open cases with fake Controls, generic setCurrent(...), a mandatory Connection, or a
generic observer abstraction merely for symmetry.

Playback / Select / Seek remains the preferred next pressure because it exercises several open
currentness questions together.

<!-- [VXG RealForever][VEXSYNC][ORIGIN-WALK][CURRENTNESS-BOUNDARY] -->


---

## Origin-Walk executable evolution — third Playback pressure class

**Downstream Android #192 head:** `20dd24b72fa07ea26748dc952783ea0607db995b`

The V2 Origin Walk now preserves its evolution through three deliberately different executable roles:

~~~text
1. VexBehaviorV2Test
   ThemeMode patient-zero semantics/runtime

2. VexBehaviorUiRoundTripReferenceTest
   activation-currentness / stale-render reference

3. VexBehaviorV2PlaybackOriginPressureTest
   Playback edge pressure
   NOT a confirmed V2 Playback template
~~~

The third class consumes real current Playback semantics from the app package rather than copying
provider/pending/Seek behavior into the Behavior foundation.

It preserves these pressure facts:

~~~text
provider observation
-> must reconcile with newer local intent before semantic truth changes

payload Seek
-> must carry exact media identity / queue occurrence / position
-> must re-check current provider availability

Control availability
-> derives from current semantic/provider capability
-> must not be duplicated in UI merely because activation can return null

current V2 Act graph
-> matches concrete Control values
-> exact data-class payload equality is therefore insufficient
   for arbitrary runtime Control.Seek(request) authoring
~~~

A passing pressure test means the requirement remains executable and visible. It does not mean V2
supports the richer feature yet, and it does not authorize production Playback refactoring.

A later candidate should earn a new reference layer only when these constraints can be expressed
without fake Controls, generic setCurrent(...), provider-truth theft, duplicated availability or
payload loss.

<!-- [VXG RealForever][VEXSYNC][ORIGIN-WALK][PLAYBACK-PRESSURE-REFERENCE] -->


---

## Origin-Walk threshold — runtime State + payload Control materialize the Act

**Downstream Android #192 head:** `63a1e69c7792c48d0fc102d8cf8dd8af6da06fa1`

Playback pressure has earned one reusable V2 refinement:

~~~text
actual CURRENT State value
+
actual incoming Control value
-> materialized Act
~~~

Singleton Controls keep the compact form:

~~~kotlin
on(Control.Toggle) {
  admit(State.Dark)
}
~~~

Payload Controls may now author by runtime Control shape:

~~~kotlin
on<Control.Seek>(
  whenCurrent = { current, seek ->
    current.mediaId == seek.request.mediaId &&
    current.mediaItemIndex == seek.request.mediaItemIndex &&
    current.seekAvailable
  },
) { current, seek ->
  ...
}
~~~

The dynamic Act receives both the real current State value and the real Control payload. The third
Playback pressure test also proves stale media occurrence/provider unavailability reject the same
Control through the same semantic rule.

`Family.isAvailable(Control)` derives from the same resolution law as `activate(Control)`.
Activation always re-reads CURRENT State, so an earlier availability answer never becomes authority.

An isolated Kotlin language proof compiled/executed the runtime materialization shape. Repository
Gradle/JVM proof remains pending.

Still open:

~~~text
provider observation -> semantic Family current State
pending-intent/provider reconciliation ownership
provider-affine Seek Operation
async-result staleness/generation
Compose observation
multi-instance execution identity
Sequenced lane custody
~~~

Production Playback remains unchanged.

<!-- [VXG RealForever][VEXSYNC][ORIGIN-WALK][RUNTIME-ACT-MATERIALIZATION] -->


---

## Origin-Walk pressure candidate — provider truth after reconciliation

**Downstream Android #192 head:** `f81154ecac30954d337e41edde7273da91e2e766`

The third Playback pressure class now carries two candidate refinements:

~~~text
1. actual CURRENT State + runtime payload Control
   -> materialized Act
   -> same-law availability + activation

2. provider observation
   -> provider/Connection-owned reconciliation
   -> reconciled semantic State
   -> concrete Family-specific admission method
   -> protected Family.admit(State)
~~~

The second refinement deliberately avoids a generic observation framework:

~~~text
NO fake provider Control
NO public setCurrent(...)
NO universal observe(...)
NO universal reconcile(...)
NO provider-as-Family ownership collapse
~~~

The existing Playback pending/reconciliation law remains the owner of stale provider observation versus
newer local intent. Only the already-reconciled semantic State crosses into the concrete Family
admission seam.

Still OPEN:

~~~text
concurrent admission serialization
async-result staleness/generation
provider-affine Seek Operation under begin
typed provider Operation results
Compose observation
multi-instance execution identity
Sequenced lane custody
~~~

Production Playback remains unchanged.

<!-- [VXG RealForever][VEXSYNC][ORIGIN-WALK][PROVIDER-RECONCILED-ADMISSION] -->


---

## Origin-Walk review refinement — projectability and serialized admission

**Downstream Android #192 head:** `b566b5b33de034fbdb32b152f6a4b4b9b4bc59c3`

The latest review was accepted with one important clarification.

### DisplayState removal test

The reason for the mandatory DisplayState role is not that `Empty(current)` adds semantic truth.

~~~text
remove DisplayState role
-> State still exists
-> guaranteed Family -> human/UI/VexBoard projectable-output relationship disappears
~~~

Therefore:

~~~text
mandatory DisplayState role
!= mandatory extra display truth

Empty(current)
= explicit "no richer display classification earned" projection
~~~

Future non-visual Family pressure may still challenge this, but the current rationale is
discoverability/projectability rather than duplication.

### Next live-runtime pressure

Payload Control materialization and provider-reconciled Family admission now have candidate paths.
The unresolved currentness question is narrower:

~~~text
UI activation
provider reconciliation
older async Operation result
future Store/repository observation
        |
        v
several lawful semantic-admission causes
        |
        v
what owns exact ordering/currentness?
~~~

`@Volatile` is visibility only.

No serialization mechanism is chosen yet. The next pressure should first make one real competing
admission race executable, then reject mechanisms that:
- allow stale completion to overwrite newer semantic intent;
- steal provider/repository truth ownership into Family;
- centralize unrelated feature responsibility merely to serialize State.

<!-- [VXG RealForever][VEXSYNC][ORIGIN-WALK][PROJECTABILITY][SERIALIZED-ADMISSION] -->


---

## Origin-Walk law — ecosystem-aware removal

**Downstream Android #192 head:** `4ebfc19dd498824110ceb31173e9b04a6de16ab6`

The DisplayState review clarified a reusable Origin rule:

~~~text
local information redundancy
!=
relationship redundancy
~~~

A Family participates in a larger fractal application ecosystem. Removal therefore asks not only
whether a local wrapper contains unique data, but whether deleting its role erases a designated
ownership coordinate that UI, VexBoard, widgets, diagnostics or later consumers would otherwise have
to reinvent.

For DisplayState:

~~~text
Empty(current)
  -> no extra semantic truth

DisplayState role
  -> canonical Family-owned projectable-output coordinate
~~~

`Empty(current)` is therefore a structural zero: no richer display classification has been earned,
while the location of outward/projectable meaning remains explicit.

Ecosystem-aware removal sequence:

~~~text
1. What local information disappears?
2. What relationship disappears?
3. Which larger/fractal consumers depended on it?
4. Would removal force downstream reinterpretation/reconstruction?
5. If nothing meaningful is lost anywhere in that ecosystem, remove it.
~~~

This rule does not justify preserving arbitrary wrappers. It preserves only relationships whose
removal would make ownership inferential again.

<!-- [VXG RealForever][VEXSYNC][ORIGIN-WALK][ECOSYSTEM-AWARE-REMOVAL] -->


---

## Origin-Walk pressure — StateRelay law before inheritance

**Downstream Android #192 head:** `d91ad97767d6170ec6122750da08d099cc733b40`

V1 Relay was re-read for its design reasons before treating StateRelay as foundational.

Transferable currentness law:

~~~text
incoming cause
+
exact CURRENT retained State
-> one serialized non-suspending decision
-> decide whether the cause is still lawful/current
-> derive next semantic State
-> suppress semantic no-op publication
~~~

The Playback pressure class now carries a test-only StateRelay using V1 `VexRelay.update` to prove
that an older async completion cannot overwrite a newer semantic intent when the completion must
re-evaluate itself against CURRENT State.

Do not copy the rest of V1 Relay by association:

~~~text
deepCopy / VexState
  -> defensive ownership-detachment concern

Compound InputState / OutputState
  -> independently-owned truth convergence concern

revision
  -> current-state lineage concern

dependency activation
  -> observed-Flow lifetime concern

source freshness
  -> source/provider semantic ordering concern
~~~

The next Origin decision is therefore whether Family StateRelay can specialize the existing VexRelay
contract without forcing unrelated ownership constraints. If not, find the smaller retained-current /
serialized-decision law beneath both rather than cloning locking machinery.

StateRelay remains pressure, not accepted Family standard.

<!-- [VXG RealForever][VEXSYNC][ORIGIN-WALK][STATE-RELAY-WHY] -->


---

---

## Origin-Walk refinement — arbitrary-depth State hierarchy

**Downstream Android #192 head:** `019f071a1ee2d19aa4f8116bf30f1f1873fef922`

The first nested-list pressure was superseded because feature-specific recursive `deepCopy()` still
had to know descendant structure.

The stronger pressure normalizes hierarchy by semantic identity:

~~~text
[A1[B1[C1]]], [A2[B2]]

rootRefs = [A1, A2]

nodes:
  A1 -> [B1]
  B1 -> [C1]
  C1 -> []
  A2 -> [B2]
  B2 -> []
~~~

Changing C1 replaces only C1. Ancestors/siblings survive through refs; feature code does not recursively
reconstruct A1/B1/A2/B2 merely to preserve them.

A generated 48-level chain uses the same mechanism, so nesting depth is data rather than copy syntax.

Permanent distinction:

~~~text
stable semantic ref
  -> identity / hierarchy

snapshot detachment
  -> ownership alias protection

deep copy
  != identity
~~~

The normalized tree fails on dangling refs, unreachable nodes and child cycles instead of allowing
Display to silently shorten the current hierarchy.

Independently-owned child currentness is still composed separately:

~~~text
parent hierarchy refs --------\
                               -> Compound Convergence -> bounded current output
child-owner current State ----/
~~~

No universal StateTree abstraction is admitted yet.

Isolated Kotlin proof: PASS.
Repository Gradle/JVM: PENDING.

<!-- [VXG RealForever][VEXSYNC][ORIGIN-WALK][STATE-RELAY][ARBITRARY-DEPTH] -->



---

## Origin-Walk live StateRelay placement

**Downstream Android #192 head:** `87f850a1e9a4dfbbe0c8b4a2ae4cc9ac67296be1`

The fourth Origin reference now includes an integrated test-only Family that makes StateRelay's
placement explicit:

~~~text
Family.activate(Control)
-> StateRelay.process { CURRENT ->
     Acts.resolve(CURRENT, Control)
     -> immediate State consequence
   }
-> StateRelay publishes NEXT current State
-> DisplayState derives from the same StateRelay.current
~~~

For the arbitrary-depth tree:

~~~text
RenameNode(C1)
-> CURRENT Family State
-> Act resolves inside StateRelay
-> normalized tree replaces only C1
-> hierarchy refs preserve A1/B1/A2/B2
-> DisplayState traverses NEXT
~~~

This separates:
- StateRelay: currentness/serialization;
- Acts: semantic State + Control meaning;
- normalized tree: structural identity/completeness at arbitrary depth;
- DisplayState: outward/projectable meaning.

Async/provider results must re-enter StateRelay and be evaluated against CURRENT State instead of
receiving direct write authority.

Production VexBehaviorV2Family still uses its patient-zero current field; StateRelay remains a
test-only candidate until the type/ownership fit is earned.

<!-- [VXG RealForever][VEXSYNC][ORIGIN-WALK][STATE-RELAY][LIVE-LOOP] -->


---

## Origin-Walk refinement — process-only reusable Relay skeleton

**Downstream Android #192 head:** `050c5d96ad3318bfcd5a0fdfa58250faec274254`

The latest review rejected feature-specific Relay ceremony as a scalability/readability burden.

The desired reusable Compound shape is now pressure-tested as:

~~~text
incoming partial InputState
+ retained current InputState
-> latestStateInput
-> process(latestStateInput)
-> latestStateOutput
-> generic VexCompoundState reassembly
~~~

The concrete Relay owns only:

~~~kotlin
override fun process(
    latestStateInput: InputState,
): OutputState {
    // relationship meaning only
}
~~~

Input patch/currentness mechanics belong to the InputState's reusable `latest(incoming)` contract.
The generic superclass owns current-state access and final CompoundState assembly.

This makes the causal sequence witnessable at scale:

~~~text
what arrived?
what is current now?
what does it mean?
what output follows?
what totality is retained?
~~~

Existing-source pressure is informative:
- Conversation Hybrid is already close to pure latest-input processing.
- Maps Style likely fits after selection-reset semantics move into latest-input formation.
- Events and Navigation currently use previous OutputState as reducer memory.

That last pattern is held as the next design question. If the reusable law is
`latestStateInput -> OutputState`, relationship memory should become explicit processing state rather
than making OutputState silently serve both consumer projection and hidden reducer memory.

Isolated generic Kotlin proof: PASS.
Production VexCompoundRelay remains unchanged.

<!-- [VXG RealForever][VEXSYNC][ORIGIN-WALK][PROCESS-ONLY-COMPOUND] -->


---

## Origin-Walk formalization — process -> commit -> Act -> observe

**Downstream Android #192 head:** `b2440adaea68b5e57388fdd28248dda068d72b3e`

Before changing any existing feature Relay, the fourth Origin reference now proves one complete
ownership circuit:

~~~text
partial InputState
+ retained current InputState
-> latestStateInput
-> process(latestStateInput)
-> latestStateOutput
-> COMMIT VexCompoundState
-> Act(committed OutputState)
-> rightful target owner changes its own CURRENT State
-> observe that target CURRENT truth
-> NEW partial InputState
-> process again
~~~

Executable trace:

~~~text
process:NeedsApply(Dark)
commit:NeedsApply(Dark)
act:NeedsApply(Dark)
target:Dark
process:Settled(Dark)
commit:Settled(Dark)
act:Settled(Dark)
~~~

The test verifies that Act receives an already-committed CompoundState. OutputState never feeds itself
back into process as hidden input.

Current reusable roles:

~~~text
InputState.latest(incoming)
  partial-input currentization

process(latestStateInput)
  relationship calculation only

OutputState
  current relationship consequence

Act
  reaction to already-established relationship truth

target owner
  owns the requested external/current change

observation
  returns that owner's new truth as fresh input
~~~

Existing Events / Maps / Navigation / Conversation implementations remain unchanged while this circuit
is reviewed.

Isolated Kotlin circuit proof: PASS.
Repository Gradle/JVM: PENDING.

<!-- [VXG RealForever][VEXSYNC][ORIGIN-WALK][PROCESS-COMMIT-ACT-OBSERVE] -->

---

## Origin-Walk pressure — committed Output -> Act runner

**Downstream Android #192 head:** `89e1d27c9e28d2cca5192da9bbc10d3e493b40cd`

The next causal edge has now been pressure-tested without admitting a production runner:

~~~text
COMMITTED OutputState
-> lawful Act realization
~~~

The smallest surviving distinction is **Output-changing commit** versus ordinary Compound currentness.

~~~text
Compound commit revision N
  input changed
  output unchanged
  -> current relationship truth advanced
  -> NO new Act receipt

Compound commit revision N+1
  output meaning changed
  -> one ephemeral committed-Output receipt
     identity = existing Compound revision N+1
     output = committed OutputState
  -> Act runner pressure
~~~

No second Output revision counter or event ledger is earned. The existing Compound revision already
identifies the exact commit; it becomes relevant to Act custody only when that commit changed Output
meaning.

The pressure rejects using `outputStates` as an effect queue. That surface is a current projection,
not a durable sequence of commands. A production post-commit seam, if earned, must originate at the
actual Compound commit boundary so dependency-driven `send(...)` cannot bypass it.

The execution-mode results are now sharper:

~~~text
Replaceable
  latest OUTPUT-CHANGING commit owns current reaction
  input-only revision does not stale/replay it
  newer no-op/Settled Output still supersedes and cancels obsolete reaction

Sequenced
  each accepted effect-bearing Output-changing commit keeps queue custody
  newer Output does not revoke older accepted episode
  input-only commit with the same Output does not enqueue a duplicate
~~~

Cancellation changes execution lifetime; it does not uncommit relationship truth and cannot promise
rollback of target/provider reality that already changed.

The target ownership loop remains:

~~~text
committed relationship consequence
-> Act execution
-> rightful target owner
-> target CURRENT truth
-> observation
-> NEW InputState
-> process again
~~~

The pressure fixture deliberately wraps `send(...)` only to expose the law. That wrapper is not a
production design because other dependency-driven sends could bypass it.

Current next question is therefore smaller than “which runner class?”:

~~~text
What is the smallest post-commit seam that can deliver one changed-Output commit
to its rightful Act realization
without turning current projections into an event ledger,
without duplicating Compound ownership,
and while preserving Replaceable / Sequenced custody?
~~~

No production Relay hook, Act runner, new revision type or event ledger is accepted by this
checkpoint.

Repository Gradle/JVM proof remains pending.

<!-- [VXG RealForever][VEXSYNC][ORIGIN-WALK][COMMITTED-OUTPUT-ACT-RUNNER-PRESSURE] -->

---

## Current checkpoint — typed Control relationship identity on native Family traversal

**Currentness:** `CURRENT_SIBLING_CANDIDATE_REFERENCE` from VexLife-Android PR #193 plus
`CURRENT_WORKING_MODEL` for the VexSync lesson extracted from that candidate. PR #193 remains draft and
is not accepted Android main.

Current Android review PR:

~~~text
#193
head:
7301c6ef257b53aeef79736cf388f68bee60fad6
~~~

Origin-Walk/history source remains:

~~~text
#192
head:
dd050ff81db169277a77cad4e4bd6a4f21e58d0e
~~~

The Direct Family call graph remains explicit native Kotlin:

~~~text
caller / UI
-> Family.activate(control)
-> concrete Family.act(currentState, control)
-> exhaustive when(currentState)
-> exhaustive when(control)
-> noAct / stay / admit / optional Begin
-> StateRelay / execution
~~~

The new pressure was not “invent a better relationship ID.” It was the opposite:

> How do we prevent a future Builder/AI from manufacturing another identity convention when the
> semantic owner already knows the Control?

The surviving candidate boundary is:

~~~text
VexFamily<Family, State, Control>

Control<Family>
  -> exact Family-bound Control vocabulary
  -> Control name/type is always included by the Family foundation
  -> optional ResourceId<Family> narrows repeated instances of that same Control

live Family
+ Control name/type
+ optional typed ResourceId
=
VexFamily.RelationshipId<Family>
  -> VexExecution.RelationshipId

Begin
  -> chooses Approach only

Execution
  -> coordinates the supplied RelationshipId
  -> does not invent trigger strings or arbitrary argument tuples
~~~

This removes the earlier escape hatches:

~~~text
trigger: Any                  REMOVED from the Family relationship path
vararg Any? identity pieces   REMOVED
manual ordered ID arguments   REMOVED
second Family ExecutionId     NOT REQUIRED
~~~

The important VexSync lesson is not the exact Kotlin spelling. It is the ownership rule:

~~~text
IF Control already owns the semantic coordinate
THEN relationship identity should be derived through that typed Control boundary
NOT re-authored by Builder / target / execution machinery
~~~

Control name is the default identity contribution. A typed ResourceId is optional narrowing, not a
mandatory ceremony.

~~~text
Control.Play(trackId, position)

Control name
  -> Play

typed ResourceId when earned
  -> trackId

request payload not automatically identity
  -> position
~~~

That distinction reduces AI error because the architecture leaves no ordinary Begin parameter where an
author can casually insert a random string, mutable object, reordered tuple or parallel ID scheme.

The candidate also restores the accepted `launchOnce` behavior:

~~~text
launchOnce(source)
-> second unfinished same-source invocation fails closed

launch(source)
-> each invocation is intentionally independent
~~~

So a compatibility alias no longer silently widens existing consumer concurrency.

### Why this matters to the Debug Menu Origin Walk

The ThemeMode specimen now has a stronger question than “what ID should we invent?”:

~~~text
Does this Control need identity narrower than its Control name?

NO
  -> Control name is sufficient
  -> do not mint another ResourceId

YES, because repeated instances of the same Control must coordinate separately
  -> identify the already-meaningful resource
  -> express it through typed ResourceId<Family>
~~~

For ThemeMode specifically, do not decide that `Light`, `Dark`, the Android Boolean, or a generated
string is a ResourceId merely because the seam exists. Walk the actual semantic coordination pressure.

### Current open edges

~~~text
async later-result currentness
  -> still unresolved generically

execution observation retention
  -> InstanceId-keyed terminal retention remains under review

logging module layering
  -> semantic logger ownership and module dependency shape remain separate review questions

Compound / Process
  -> still separate; no machinery invented merely to close the box

ThemeMode relationship narrowing
  -> OPEN
  -> Control name may already be sufficient
~~~

### VexSync process progress

This episode advances the Feature Request -> Builder discovery task because it demonstrates a reusable
construction rule:

~~~text
ground semantic owner
-> preserve its generic type relationship
-> make the foundation derive the safe default
-> expose only the typed narrowing seam that a real semantic distinction earns
-> remove arbitrary authoring holes
~~~

That is a concrete example of the wider VexSync objective:

~~~text
REDUCE AI INTERPRETATION SURFACE
BY
MOVING RIGHTFUL SEMANTIC CHOICES INTO TYPE-ENFORCED OWNERSHIP
~~~

The Debug Menu Origin roundtrip remains dependency-held until the Builder-discovery work is grounded
enough to author the next bounded Origin edge without guessing.

Repository Gradle/JVM proof for PR #193 exact head
`7301c6ef257b53aeef79736cf388f68bee60fad6` remains **PENDING**.

<!-- [VXG RealForever][VEXSYNC][ORIGIN-WALK][FAMILY][TYPED-CONTROL-RELATIONSHIP] -->

---

## Current correction checkpoint — exact typed Control Resource identity

**Currentness:** `CURRENT_SIBLING_CANDIDATE_REFERENCE` from VexLife-Android PR #193 exact head
`a05b67876d951d513633d04de4acf702e5ed834b`; `CURRENT_WORKING_MODEL` for the VexSync process lesson.

The previous typed-Control checkpoint survived review, but writing the actual Kotlin/test surface exposed
four implementation leaks:

~~~text
ResourceId<Family> -> String
  erased the concrete ID type

Control<Family> -> any ResourceId<Family>
  did not bind one resource-bearing Control to its exact ID type

control::class as default identity
  collapsed different enum entries to the same Control class

raw VexExecution.RelationshipId
  remained too easy to implement directly outside the semantic owner
~~~

The correction tightens the same architecture rather than replacing it:

~~~text
ResourceId<Family>
  typed marker
  no shared String/value contract

Control<Family>
  default Control kind/name identity

Control.Resource<Family, ExactId>
  ExactId : ResourceId<Family>
  concrete Control declares the exact resource ID type

RelationshipId
  live Family
  + Control type / enum entry
  + optional exact ResourceId object

VexExecution.RelationshipId
  foundation bridge only
  error-level opt-in for raw use
~~~

Example pressure:

~~~text
Play : Control.Resource<PlayerFamily, TrackId>

TrackId
  valid

AccountId
  cannot be substituted into Play's resourceId slot
  merely because both belong to PlayerFamily
~~~

The Family proof also now covers enum entries:

~~~text
Control.Play
!=
Control.Pause
~~~

even though both entries share the same enum class.

The test deliberately stopped asserting a formatted RelationshipId `toString()`. Human/debug formatting
is not architectural identity.

### Process lesson

The useful VexSync lesson sharpened again:

~~~text
GOOD TYPE BOUNDARY
!= type-looking wrapper that immediately erases the type

SAFE DEFAULT
-> preserve the semantic owner's actual type all the way through the owned boundary

TEST PRESSURE
-> ask what wrong code still compiles
-> if wrong architecture still compiles, the boundary is not finished
~~~

This is the same reduction goal, now more exact:

~~~text
REDUCE AI INTERPRETATION SURFACE
BY
MAKING THE COMPILER CARRY THE RIGHTFUL SEMANTIC DISTINCTION
~~~

The Builder-discovery work remains `RUNNING`. No new lifecycle transition is implied by this
correction; it is current evidence inside the already-active task.

Repository Gradle/JVM proof for Android PR #193 exact head `a05b67876d951d513633d04de4acf702e5ed834b` remains **PENDING**.

<!-- [VXG RealForever][VEXSYNC][ORIGIN-WALK][TYPED-CONTROL-RESOURCE-ID-CORRECTION] -->

---

## Current projection checkpoint — one Family language, four VexBoard regions

**Currentness:** `CURRENT_SIBLING_CANDIDATE_REFERENCE` from VexBoard PR #155 exact head
`06cd5344f3f6bdb5428f9d354e92705737f6a6f8`.

The typed Control / ResourceId pressure is now projected into the existing ThemeMode source board without
creating a separate Test/Proof semantic layer.

~~~text
UI / CONTROL
FAMILY / LOGIC
TYPED IDENTITY
EXECUTION
~~~

The executable test scenarios are shown inside the same language they exercise:

~~~text
Play + TrackId(A), position 10 / 99
  -> SAME relationship identity

Play + TrackId(A) / TrackId(B)
  -> DIFFERENT relationship identity

Play.resourceId : TrackId
  -> AccountId does not fit

enum Play
  != enum Pause
~~~

So the VexBoard lesson is:

~~~text
TEST
!= FIFTH ARCHITECTURE

TEST SCENARIO
= EXECUTABLE USE OF THE SAME ARCHITECTURAL LANGUAGE

SOURCE TEST
-> read-only examples / relationships
-> same Control / ResourceId / Family / Relationship vocabulary
-> human-perceivable VexBoard projection
~~~

The board remains read-only source projection. VexLife-Android owns the Kotlin candidate and test;
VexBoard owns only the visual/perceptual projection of those source-backed relationships.

Repository execution proof remains separate and pending.

<!-- [VXG RealForever][VEXSYNC][VEXBOARD][FOUR-REGION-FAMILY-LANGUAGE] -->
---

## Current round-trip checkpoint — VexBoard language -> Kotlin candidate -> mapped test

**Currentness:** `CURRENT_SIBLING_CANDIDATE_REFERENCE` from VexBoard PR #155 exact head
`24a1f1914867a7d2b96cef3dee2eef9d1a991902`.

The ThemeMode board now demonstrates more than source reflection.

~~~text
real current Android feature
  DebugMenuScreen / AppActions / VexLifeSession
  -> read-only VexBoard source projection

typed Family language
  Control<Family>
  Control.Resource<Family, ExactId>
  RelationshipId
  Begin -> Approach
  -> visible four-region VexBoard projection

familyKotlin sidecar
  -> pure compileFamilyKotlin(...)
  -> Kotlin Family construction candidate
  -> mapped Kotlin test candidate
~~~

The key pressure is editable in a local VexBoard draft:

~~~text
Play -> TrackId
  -> generated Play.resourceId : TrackId
  -> mapped exact-type test expects TrackId

change the same VexBoard binding to:

Play -> AccountId
  -> generated Play.resourceId : AccountId
  -> mapped exact-type test expects AccountId
~~~

So the test is not a separate representation of the architecture. It is generated from / mapped to
the same typed language that the human sees and changes.

~~~text
TEST LANGUAGE
= executable pressure over the same semantic coordinate

VEXBOARD EDIT
-> changes Kotlin construction candidate
-> changes mapped Kotlin test candidate
~~~

The current compiler is effect-free:

~~~text
externalEffectsPerformed = false

VexBoard candidate generation
!= Android source mutation
~~~

Actual target-source publication remains a separately admitted Android effect. This preserves source
ownership while proving that VexBoard can become a construction surface rather than only a visual mirror.

The current product still has no production `ThemeModeFamily`; the real current feature remains
`VexLifeSession.darkTheme` / Debug Menu routing. The typed Family round-trip uses the actual PR #193
`ResourceIdentityFamily` / `EnumControlFamily` executable test specimen until product integration is
separately earned.

Focused execution of the checked-in pure compiler confirmed the current TrackId binding and an edited
AccountId binding both update Family and mapped-test Kotlin together with zero external effects.

Repository-wide VexWork test execution remains separate.

<!-- [VXG RealForever][VEXSYNC][VEXBOARD][FAMILY-KOTLIN-ROUNDTRIP] -->
---

## Current lived-map checkpoint — flat first draft merged, human inspection pending

VexBoard PR #155 has now been squash-merged to current VexWork main:

~~~text
0d55e3aa83b7972cc83ef9fe2a7266311932a7c8
~~~

The merged slice is intentionally the **flat four-region first draft**:

~~~text
UI / CONTROL
FAMILY / LOGIC
TYPED IDENTITY
EXECUTION
~~~

The ThemeMode source board also carries the effect-free Family Kotlin construction preview and mapped
Kotlin test candidate. No depth-dimensional / recursive expansion behavior was added as part of this
merge step.

Current proof boundary:

~~~text
source merged to main        YES
flat map present             YES
Kotlin drawer present        YES
human lived inspection       PENDING
depth-dimensional evolution  HELD
~~~

The next edge is Victor's lived browser read of the flat map. Do not infer that a successful merge
means the perceptual layout is accepted.

<!-- [VXG RealForever][VEXSYNC][VEXBOARD][FLAT-FIRST-DRAFT-MERGED] -->

---

## Foundation baseline — next big sync is VexSync ↔ VexBoard self-application

The current trajectory has crossed a useful threshold. The Direct Family / typed Control identity work,
the mapped Kotlin test language, and the first VexBoard Kotlin-construction seam are now treated as one
foundation baseline rather than a collection of local experiments.

~~~text
VexSync
  work.vexsync.debugmenu-blueprints.vexboard-architecture-convergence
  -> owns the semantic/process convergence trajectory

VexBoard
  work.vexboard.vexsync-architecture-convergence
  -> owns VexBoard implementation/source evolution

VexLife-Android
  PR #193
  -> owns the Direct Family / typed identity candidate and Kotlin proof source
~~~

VexSync does **not** become VexBoard's parent Project.

~~~text
CROSS-PROJECT CONVERGENCE
!= PROJECT HIERARCHY
!= SOURCE OWNERSHIP TRANSFER
~~~

The next-big-sync order is now:

~~~text
1. recover the currently blank VexBoard browser surface
2. make VexBoard itself visibly reflect the trusted architecture
3. keep the first self-application flat/readable before adding depth
4. preserve one language across:
     semantic map
     -> Kotlin construction candidate
     -> mapped Kotlin test
5. use that self-application to pressure the next reusable VexSync construction contract
~~~

The prior Feature Request -> Builder discovery remains RUNNING as supporting source, but it is no longer
the sole immediate foreground. The new VexBoard convergence work is the immediate trajectory.

VexBoard implementation work is formed on draft PR #184.

<!-- [VXG RealForever][VEXSYNC][VEXBOARD-CONVERGENCE][FOUNDATION-BASELINE] -->



---

## Accepted Family -> ThemeMode patient zero -> full-walk confidence

The foundation state has materially advanced beyond the earlier candidate checkpoints.

### Android Family Circuit is accepted source

~~~text
VexLife-Android PR #193
candidate head  07f2e00ffa222258b37d1c87aefa0a64262a0b79
merge/main      3c899e656d90487abcff06df7b087a42c4a68523
tree            c64eb160fc4c1c3c28c7aaf4d45b6b76e80229bf

SourceOwner A006        PASS / vexVerifyJvm
Independent Assurance  CLEAR_ON_EXACT_HEAD
post-merge tree         exact candidate tree
~~~

Family / State / Control / ResourceId / RelationshipId / Act / Begin / Approach is therefore an
accepted Android foundation, not a draft VexSync hypothesis.

### VexBoard convergence crossed its lived gate

VexBoard PR #184 is merged and its deployed blank-screen recovery + flat architecture self-application
were lived-accepted by Victor. The source/projection convergence task is complete.

The separate navigation-first usability refinement, VexWork PR #186, also merged with exact-head source
proof and post-merge verification. Its remaining predicate is only Victor's lived interaction acceptance
of the new drag/click/right-click language; that does not reopen #184 or block independent Android work.

### ThemeMode now consumes the accepted Family source

The existing Android ThemeMode lane was resumed rather than replaced:

~~~text
VexLife-Android PR #188
head  62b919997b15479a234c4688af663e9aec4e0573
tree  c990db110fddaf33e8d87e71c8b91fde49d55a34
base  accepted main 3c899e656d90487abcff06df7b087a42c4a68523
paths 2 exact
~~~

Its current source establishes the smallest patient-zero circuit:

~~~text
ThemeMode
  NotSet
  Light
  Dark

ThemeModeFamily.Control.Toggle

Light + Toggle -> admit Dark
Dark  + Toggle -> admit Light
NotSet + Toggle -> noAct
~~~

No ResourceId is invented because Control kind already supplies sufficient relationship identity.
No SystemAppearance/default policy is invented for NotSet.

Repository Gradle/JVM proof for this new #188 head remains PENDING; source inspection is not promoted to
execution PASS.

### The missing production seam is now exact

Current accepted Android main still routes:

~~~text
DebugMenuScreen.DarkMode
-> AppActions.ToggleDarkMode
-> VexLifeSession.toggleDarkMode()
-> Boolean darkTheme
-> VexLifeTheme
~~~

So the product does not yet execute the Family circuit.

The exact state-owner path is currently claimed by the separate live Android VexStream Artwork PR #186:

~~~text
app/src/main/kotlin/com/vextreme/vexlife/android/ui/VexLifeSession.kt
~~~

VexSync does not take or work around that source ownership. PR #188 therefore advances the disjoint
semantic source/test slice while real session integration remains held on that exact path.

### Full walk with confidence — one traceable chain, existing owners preserved

The Test / Feature Walk / Journey / ScreenCrawler foundations already have the right separation. The
next round-trip should make them trace the **same real runtime relationship**, not become another semantic
system:

~~~text
Feature Walk
  whole Theme Mode human outcome / held and satisfied checkpoints
        |
        v
Journey
  Home -> Debug Menu -> DarkMode human interaction
        |
        v
UI semantic identity
  DebugMenuScreen.DarkMode
  AppActions.ToggleDarkMode
        |
        v
ThemeModeFamily
  CURRENT State + Control.Toggle
  -> Act
  -> admit Light / Dark
        |
        v
Execution / VexLogger
  only where the authored relationship actually uses them
        |
        v
ScreenCrawler
  rendered evidence from the same Journey coordinate
~~~

Permanent:

~~~text
FEATURE WALK != JOURNEY
JOURNEY != FAMILY
FAMILY != EXECUTION
SCREENCRAWLER != SEMANTIC ORACLE
TEST != FIFTH ARCHITECTURE
~~~

Feature Walk may truthfully expose a held checkpoint before production integration. Journey and
ScreenCrawler must not pretend the Family path executed until the Debug Menu action actually enters
ThemeModeFamily.

The next implementation edge is therefore narrow: #188 exact-head SourceOwner proof and fresh Assurance
are complete. When the VexLifeSession claim is released, integrate the real action/state owner; then bind
the ThemeMode Feature Walk / dedicated Journey / focused proof backlinks so ScreenCrawler inherits that
walk rather than inventing one.

<!-- [VXG RealForever][VEXSYNC][FAMILY-ACCEPTED][THEME-FULL-WALK-CONFIDENCE] -->


---

## Current strategy — Android realization first; VexBoard projects accepted reality

The current foreground is **not** general Android cleanup and is **not** another VexBoard architecture
push.

~~~text
IMMEDIATE
  Android ThemeMode production realization
  -> PR #188 semantic source is PROVED + CLEAR
  -> next dependency is release/integration of the real VexLifeSession path

PARALLEL / INDEPENDENT
  VexStream Artwork PR #186
  -> retains VexLifeSession.kt until its own lifecycle releases that path

  VexBoard navigation-first lived interaction check
  -> separate usability evidence
  -> does not reopen completed architecture convergence

AFTER #188 PROOF + VexLifeSession PATH RELEASE
  wire DebugMenu Toggle into ThemeModeFamily
  -> prove the real runtime path
  -> bind Feature Walk / Journey / focused backlinks
  -> let ScreenCrawler consume that same Journey

THEN
  VexBoard projects the accepted real walk
  -> observe repeated friction
  -> only then extract broader reusable VexSync machinery
~~~

Android work is therefore **feature realization**, not repository cleanup. Existing stale docs or
unrelated Android debt are corrected only when they block the current claim, misstate the source being
consumed, or become part of the exact causal path.

VexBoard is currently a projection/pressure surface for this trajectory, not the source owner of the
next semantic implementation.

<!-- [VXG RealForever][VEXSYNC][CURRENT-STRATEGY][ANDROID-FIRST-REALIZATION] -->


## Portability pressure — Apply All

The target outcome is simple: once a feature walk is accepted, another supported target should be able
to realize the same semantic requirements through its own rightful owners with an Apply All operation.
This means applying the accepted relationships and their matching proof/evidence coordinates; it does
not mean copying Android source files.

ThemeMode is the patient-zero specimen that will tell us which coordinates are actually portable.

<!-- [VXG RealForever][VEXSYNC][APPLY-ALL-PORTABILITY] -->


---

## VexArchitecture refinement candidate — Walk Trace Grammar

ThemeMode SourceOwner A001 + fresh Assurance now provide one clean pressure-tested specimen for a common
cross-layer language without collapsing the existing owners.

~~~text
Feature Walk
  Feature -> Walk -> Case -> Checkpoint -> optional Hold

Journey
  Case -> ordered Step
  Step kind = human action | external cause | observation
  Step carries the stable semantic ref it acts on / observes

Expected Walk
  interprets the authored Journey into expected semantic history
  != production runtime

Production semantic owners
  UI intent / AppAction
  -> Family: CURRENT State + Control -> Act
  -> optional Begin / Execution
  -> resulting State / rendered projection

Observation
  runtime/logger/Journey observer records what actually occurred

Evidence
  focused proof or ScreenCrawler attaches proof to the same Case/Checkpoint/Step coordinate

Stage Return
  proof gate disposition + evidence refs + exact next continuation edge
~~~

The reusable idea is therefore a **trace grammar**, not a new universal Walk executor.

Candidate shared nouns:

~~~text
Scenario / Case
Checkpoint
Step
StepKind
SemanticRef
OwnerRef
Before / After
Relationship
Effect
Observation
EvidenceRef
Disposition
Continuation
~~~

Each existing owner keeps its own behavior and truth:
- Feature Walk owns completion/checkpoint meaning.
- Journey owns the human interaction sequence.
- Family owns State + Control relationship meaning.
- Execution owns effect occurrence/lifetime.
- Logger/observer owns runtime observation.
- ScreenCrawler owns rendered evidence.
- Relay/host proof owns proof-operation receipts and continuation.

A future shared type is earned only if ThemeMode's complete production walk and at least one second
feature repeat the same coordinate pressure. Until then this is a language/projection contract, not a
new Vex root or runtime framework.

This candidate directly supports Apply All: porting should traverse the accepted semantic coordinates,
resolve each target's rightful owner, realize the supported relationship/effect, and bind proof/evidence
back to the same walk coordinates.

<!-- [VXG RealForever][VEXSYNC][WALK-TRACE-GRAMMAR][CANDIDATE] -->


---

## Intent bounds survive messy names

The accepted Family source and high-confidence tests expose an important VexArchitecture law:

~~~text
NAME MAY IDENTIFY A COORDINATE
!=
NAME OWNS THE MEANING
~~~

Current Family relationship identity is bounded by:

~~~text
live Family instance
+ typed Control kind
+ optional typed ResourceId
~~~

For enum Controls, the enum entry name distinguishes sibling Control kinds. For sealed/data Controls,
the concrete Control type supplies the kind. Arbitrary Control payload is intentionally excluded unless
a typed ResourceId explicitly earns narrower identity.

Behavior is authored somewhere else:

~~~text
CURRENT State
+ typed Control
-> exhaustive act(...)
-> one lawful Act or noAct()
~~~

Therefore a poor label, awkward class name, UI wording change, or noisy payload cannot silently expand
the behavior beyond the relationship that the Family actually authors. Names are navigation/coordinate
material; semantic authority remains in the typed owner and exhaustive relationship.

This is a useful portability invariant for Apply All and the Walk Trace Grammar:

~~~text
human intent
-> stable semantic coordinate
-> rightful typed owner
-> bounded relationship
-> admitted effect
-> evidence

display/source naming quality
  may improve readability
  but is not allowed to become behavioral authority
~~~

No new naming framework is earned here. The current work is to preserve this invariant through the
ThemeMode full production walk and then pressure it against a materially different second feature.

<!-- [VXG RealForever][VEXSYNC][INTENT-BOUNDS][NAME-NON-AUTHORITY] -->
