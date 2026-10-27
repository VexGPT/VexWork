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
