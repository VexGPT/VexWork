# VexSync DebugMenu Blueprints — Current Examples / Discovery Checkpoint

[VXG RealForever]

## Status

This is a **current discovery companion**, not an accepted schema, final process, canonical naming source,
or completed feature example.

Its job is to preserve examples exactly far enough that a future Victor/AI pair can continue the
reasoning without accidentally promoting illustrative pseudocode, guessed identifiers, or missing
implementation details into architecture.

~~~text
CURRENT EXAMPLE
!= COMPLETED EXAMPLE
!= ACCEPTED SCHEMA
!= TARGET IMPLEMENTATION
!= PROOF
~~~

As the VexSync process is discovered, this file may be refined or superseded. The durable Project
README remains the project entry.

## Current checkpoint correction

The shorter sentence:

> As a user I want to be able to toggle/switch between dark and light mode in the Debug Menu.

is useful human-goal language, but **by itself is not the complete current example** when no prior
application foundation is assumed. A first-principles Builder still needs enough terrain to know how
the person reaches Debug Menu.

Victor's richer current example supplies additional clues such as:

~~~text
UserClick on {missing button} from Home
-> [HomeScreen](buttonid: ??)

NavigateTo <DebugMenuScreen>

clicks on { id for dark mode }

effect { calls the function }

OriginIntent.NavigateTo(DebugMenuScreen(id:???))

[DebugMenuScreen::id???]
[DebugMenuScreen::click("dark mode toggle":id???)]

[effect:
  state<lightmode>
  -> state<darkmode>
]

Result:
  "???"
~~~

This remains exploratory pseudocode, but it is the **current checkpoint** because it exposes the
start terrain, destination, unresolved identifiers, intended interaction, missing HOW, and expected
return shape.

If the human had supplied only the shorter sentence and Debug Menu did not already exist, the request
phase should return the exact missing question (for example, "from which Screen/how does the user
reach Debug Menu?") rather than silently assuming a traversable Debug Menu.

If the human supplies Home/FAB/DebugMenu clues, the Builder uses those clues to ground or create the
next required coordinates. It should not demand unrelated details such as every other FAB option
before those details are relevant.

---

# Current phase model

Only the phases below have been meaningfully pressured so far.

~~~text
PHASE 1 — FEATURE REQUEST
  understand the human request
  translate enough meaning to know the intended result
  expose missing questions without inventing answers

        ↓

PHASE 2 — BUILDER ENTRY
  consume the translated request
  ground current truth
  identify/reuse existing semantic coordinates where possible
  expose the missing HOW
  decide the smallest truthful next design question

        ↓

LATER PHASES
  intentionally not frozen here yet
~~~

Do not infer later construction/test/PR phases merely because the eventual VexSync outcome includes
them. Let the living Blueprint and real target pressure reveal those boundaries.

---

# Phase 1 — Feature Request

## Human input

Start from ordinary human experience language.

Current example:

> As a user I want to be able to toggle/switch between dark and light mode in the Debug Menu.

This sentence is **not a completed feature specification**. It gives enough meaning to identify a goal
and a destination/context, while leaving other parts unresolved.

## Function-call analogy

Treat the feature request like a semantic function call:

~~~text
request(parameters...) -> return
~~~

Where:

~~~text
parameters
  what the human actually supplied or what current truth can establish

return
  the intended human-visible/product result

implementation / HOW
  may still be unresolved
  belongs to Builder investigation when the human does not need to know it
~~~

For the current dark/light example:

~~~text
request
  actor = User
  goal = choose/change application theme mode
  context/destination = Debug Menu
  desired interaction = toggle/switch/select between theme modes

return
  the application reflects the selected theme mode
~~~

The request does **not** yet establish:

~~~text
how the user reaches Debug Menu
which exact Control already exists
which stable IDs already exist
whether a new ID is needed
which target function is called
which State owner owns theme truth
which dependency/runtime realizes the change
whether SCAE depth is required
what exact Android/Web realization exists
~~~

Those are not permission to guess.

## Request-phase output

The current working output is conceptually:

~~~text
GOAL
  human-written story
  +
  translated semantic intention/result

KNOWN
  actor
  desired outcome
  known terrain/context
  explicitly supplied controls/relationships

MISSING
  unanswered semantic questions
  unresolved coordinates
  unresolved HOW

RETURN
  what successful completion means for the human
~~~

No final machine schema is admitted yet.

### Scope-sensitive completeness

A request can be complete enough for one question and incomplete for another.

Example:

~~~text
"As a user I want to switch dark/light mode in Debug Menu."

enough to understand:
  desired Debug Menu capability

not enough to construct:
  the complete Home -> Debug Menu human Journey
~~~

Do not discard valid understanding because another dependent edge is missing.

~~~text
KNOWN MEANING
+ MISSING DEPENDENT EDGE
-> HOLD ONLY THE DEPENDENT CLAIM
~~~

---

# Phase 2 — Builder Entry

The Builder receives the human story plus the translated intention/result.

The Builder's first job is **not to invent source**. It asks:

> What do we already know, what coordinates are implied, and what current truth already maps to this
> intention?

The working language is IDE-assisted and typed, not static prose. Specific expressions such as
`UserClick(...)`, `Act.NavigateTo(...)`, or a future state-changing Act are valuable because the
authoring surface can constrain valid parameters, reveal missing IDs, offer existing coordinates, and
prevent category mistakes. Do not replace a supplied specific interaction such as Click with a vaguer
verb such as Activate merely for abstraction.

The reuse goal is that Android can realize the same settled semantic expression without another layer
or another AI having to decipher what the author meant.

## Current dark/light example — intentionally incomplete

Victor's developing pseudocode, preserved as discovery pressure:

~~~text
"UserClick on {missing button} from Home"
-> [HomeScreen](buttonid: ??)

NavigateTo <DebugMenuScreen>

clicks on { id for dark mode }

effect { calls the function }

OriginIntent.NavigateTo(DebugMenuScreen(id:???))

[DebugMenuScreen::id???]

[DebugMenuScreen::click("dark mode toggle":id???)]

[effect:
  state<lightmode>
  -> state<darkmode>
]

Result:
  "???"
~~~

This is **not accepted syntax**. Its value is the questions it exposes.

## Identifier discipline

Do not jump from:

~~~text
"dark mode control"
~~~

to:

~~~text
R.id.dark_mode_toggle
element.debug-menu.dark-mode
darkModeToggle
~~~

without grounding.

The Builder should first ask:

~~~text
Do we already have a semantic identity for this intention?
Do we already have a Screen identity for Debug Menu?
Do we already have a Home control that enters the relevant developer surface?
Does current source already own theme State?
Does a current Control / Behavior / Act / Effect family already express this?
~~~

Investigation may use intention-oriented search terms such as:

~~~text
dark
light
theme
debug
developer
appearance
mode
~~~

but textual similarity is evidence for discovery, not proof of semantic equivalence.

### Current decision rule

~~~text
existing truthful coordinate found
-> reuse / map it

no truthful coordinate found
-> ask whether a new semantic identity is actually required

new identity required
-> form the smallest rightful one from the human intention

not enough evidence
-> keep UNKNOWN / missing question visible
~~~

## Missing HOW is Builder work

A human may know:

~~~text
input:
  choose Dark mode

return:
  application becomes Dark mode
~~~

without knowing:

~~~text
which function?
through which dependency?
through which State owner?
through which runtime/system?
with which Android implementation?
~~~

That does not make the human request invalid.

It creates a Builder question:

~~~text
DESIRED RESULT KNOWN
IMPLEMENTATION HOW UNKNOWN
-> INVESTIGATE CURRENT TRUTH
~~~

Then:

~~~text
existing system already realizes the meaning?
  YES
    -> bind the Blueprint intention to that existing owner/realization

  NO
    -> determine the smallest new capability/owner/source needed
    -> do not manufacture a parallel system merely to satisfy the diagram
~~~

The Builder is responsible for returning the answer in ordinary meaning. The human does not need to
supply target architecture merely to request a feature.

---

# SCAE at Builder Entry

Do not automatically convert every interaction into:

~~~text
State -> Control -> Act -> Effect
~~~

Instead ask whether the current feature question actually needs Behavior resolution.

Current dark/light pressure suggests a causal shape, but Victor's provisional typed form must be
allowed to pressure the design directly:

~~~text
UserClick(controlId = ???)
-> Act.RotateStateFor(target = ???, values = ???)
-> Effect = ???
-> Result = ???
~~~

The exact roles, names, States, Acts, Effects, and ownership are **not settled by this example**.
Neither is `Act.RotateStateFor` rejected merely because it is provisional. The Builder asks what
typed meaning it gives the IDE, whether current truth already has an equivalent, and whether the
target can realize it without semantic reinterpretation.

Important correction from the checkpoint:

~~~text
visual Toggle/Switch form
!= Boolean-only semantic model
!= automatically one generic Toggle Act
~~~

The eventual theme model may have more than two meaningful values, for example:

~~~text
Dark
Light
Auto / System
~~~

if real product/current-source pressure earns them.

Do not freeze those example values into the feature until current truth/design intention establishes
them.

---

# Illustrative registry pseudocode — NOT admitted

Victor used an intentionally exploratory shape similar to:

~~~text
UIElementRegistry.createNewButton(...)
UIElementRegister.createNewScreen(...)
~~~

This illustrates a desired **Builder capability**:

~~~text
missing identity
+ no current truthful match
+ new semantic object actually required
-> create/register the new coordinate from the intention
~~~

It does **not** establish:

- a class named UIElementRegistry;
- a global UI registry architecture;
- a createNewButton API;
- a Screen constructor;
- an ID format;
- a target-specific resource ID;
- a final State representation.

The Blueprint should reveal which of those structures are actually needed.

---

# Current terrain checkpoint

At this point the terrain is intentionally incomplete.

~~~text
[Home]
   |
   | UserClick on {missing / not-yet-grounded control}
   v
  ???

   |
   | NavigateTo? / another relationship?
   v

[Debug Menu]
   |
   | theme-mode Control identity ???
   v
intended theme result
~~~

Known:

~~~text
starting human terrain
  Home

desired feature context
  Debug Menu

feature goal
  choose/change theme mode

human return
  application reflects chosen theme
~~~

Not yet settled:

~~~text
Home entry Control identity
intermediate developer surface, if any
Debug Menu stable identity
theme Control identity
exact relationship verbs
theme State owner
Behavior/SCAE depth
target implementation
~~~

Do not fill these blanks merely to make the diagram look complete.

---

# Working discipline

For each next step:

~~~text
1. perceive what is actually supplied
2. extract the smallest truthful meaning
3. list identifiers already required by that meaning
4. ground whether those identities/owners already exist
5. preserve unresolved blanks explicitly
6. answer only the next missing question
7. update the living Blueprint
8. let repeated pressure reveal reusable language
~~~

The goal is systematic convergence:

~~~text
meaning
-> coordinate
-> current truth
-> missing HOW
-> Builder investigation
-> next truthful relationship
~~~

not:

~~~text
idea
-> guessed IDs
-> guessed classes
-> guessed architecture
-> repair the mess later
~~~

<!-- [VXG RealForever][VEXSYNC][CURRENT-EXAMPLES][DISCOVERY-CHECKPOINT] -->
