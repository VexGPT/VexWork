# VexSync DebugMenu Blueprints — project entry

[VXG RealForever]

## Human outcome

Use one real Debug Menu feature request to discover a reusable feature-building process that Victor + AI
can later apply to broader VexUniverse Origin <-> target work.

The current process hypothesis is deliberately smaller than a universal compiler:

~~~text
ordinary human request
-> understand intended human result
-> preserve known meaning + unresolved questions
-> Builder grounds current terrain / identities / owners
-> add one truthful semantic relationship at a time
-> compare/map the formed meaning against current Android
-> let repeated pressure reveal reusable language and later phases
~~~

The project exists to prove that process through a real specimen. It is not a claim that the final
VexUniverse construction architecture, intent ontology, compiler, proof generator or deployment loop is
already known.

## Why Debug Menu is the first specimen

The current request is intentionally ordinary:

> As a user I want to be able to switch between dark and light mode in the Debug Menu.

It is useful because the human result is easy to understand while the implementation path exposes several
real architectural questions:

- how the user reaches Debug Menu;
- which existing semantic coordinates already represent that terrain;
- which identity belongs to the theme control;
- who owns current theme truth;
- whether the semantic relationship needs SCAE depth or a simpler typed relationship;
- how current Android realizes the meaning;
- which parts of that realization are reusable versus target-local.

The goal is not to pre-design the rest of Debug Menu.

## Current process discipline

The current discovery method is:

~~~text
meaning first
-> grounded coordinate / terrain
-> next missing question
-> current-source investigation
-> smallest truthful relationship
-> repeat

repeated independent pressure
-> candidate reusable language

pressure-tested reuse
-> later formalization
~~~

This project intentionally avoids:

~~~text
idea
-> guessed IDs
-> guessed classes
-> universal language first
-> universal target IR first
-> later repair
~~~

The current examples and unfinished reasoning live in:

~~~text
projects/vexsync-debugmenu-blueprints/CURRENT-EXAMPLES.md
~~~

That file is discovery evidence, not accepted schema.

## Phase 1 — Feature Request

The human request is treated like a semantic function boundary:

~~~text
request(parameters / context)
-> expected human-visible return
~~~

The human is responsible for the intention/result they care about, not for knowing target architecture.

For the current specimen:

~~~text
human goal
  choose/change the application theme mode from Debug Menu

expected return
  the application reflects the chosen theme mode
~~~

A request may be sufficient for one scope and incomplete for another.

~~~text
known screen-local goal
+ missing entry Journey
-> preserve the goal
-> hold only the Journey claim
~~~

Do not reject the whole request and do not fill the missing edge with plausible implementation.

## Phase 2 — Builder Entry

The Builder receives the human story plus the translated intention/result and investigates:

~~~text
what terrain is already real?
what semantic IDs already exist?
what source owner already owns the truth?
what relationship is actually missing?
what implementation HOW is already present?
what genuinely needs to be created?
~~~

The Builder should protect the human from implementation archaeology. Missing HOW is an architecture
question:

~~~text
desired result known
+ implementation HOW unknown
-> investigate current truth

existing rightful system?
  yes -> map/reuse it

no truthful owner/capability?
  -> form the smallest necessary new capability
~~~

A missing identifier does not automatically mean "mint an ID." An independently addressable identity is
formed only when the meaning actually requires one.

## Current Android reference terrain — grounded, not guessed

The current accepted Android source provides a concrete reference path:

~~~text
current Home / shell
  |
  | AppShell.Elements.Add
  | element.shell.fab.add
  | current intent: toggle(FabOptions)
  v
AppShell.Elements.FabOptions
  element.shell.fab-options
  |
  | AppShell.Elements.DebugMenu
  | element.debug-menu
  | current intent: close(FabOptions) then navigateTo(DebugMenuScreen)
  v
DebugMenuScreen
  screen.debug-menu
~~~

This answers the earlier first ??? through source investigation.

It does not mean the future Origin design must preserve every current Android implementation detail.
The reference tells Builder what exists now; the living Origin/Blueprint can later decide what meaning to
retain, change or generalize.

## Current dark-mode reference — grounded target HOW

Current Android also already has:

~~~text
DebugMenuScreen.DarkMode
  element.debug-menu.body.dark-mode
  -> invoke(AppActions.ToggleDarkMode)

AppActions.ToggleDarkMode
  action.theme.dark-mode.toggle

DebugMenuScreen action registration
  -> context.toggleDarkMode()

VexLifeSession
  darkTheme
  -> toggleDarkMode()
  -> darkTheme = !darkTheme
~~~

That is current target truth, not automatically the final portable model.

The Builder can now ask the meaningful design questions from evidence:

- Is the desired product meaning simply binary dark/light selection?
- Should the future design support Auto/System?
- Is the relationship best represented directly as selecting theme mode?
- Does current/future State make a distinct Act/Effect model useful?
- Which part belongs to Origin meaning and which part remains Android/session realization?

Do not answer those questions merely because the current target uses a Boolean and a function named
toggleDarkMode.

## Reusable semantic language — let it emerge

The current Android ElementIntent union and the discussion shorthand OriginIntent are both evidence, not
the final family name.

If the next truthful edge means:

~~~text
NavigateTo(screen.debug-menu)
~~~

use that meaning directly.

Do not require a parent family or new identity until repeated consumers show that it answers a real
independent question.

The current architectural pressure is:

~~~text
portable/reusable meaning should not be independently reinterpreted by every target

AND

portable meaning should not be over-modeled before a real consumer earns the abstraction
~~~

Android may realize a settled NavigateTo relationship through its target-native navigation owner;
VexBoard may show the same relationship as a typed edge; Web/Desktop may realize it differently.

Same meaning, different realization.

## SCAE

Use State / Control / Act / Effect when the feature actually contains a Behavior question that benefits
from those distinctions.

Accepted VexLife behavior evidence already shows that resolved Act/Effect can be absent. Therefore:

~~~text
interaction exists
!= Act is mandatory
~~~

For dark/light mode, Builder should inspect the real current/future theme meaning before choosing a
direct relationship versus deeper SCAE representation.

## IDs, URI and source coordinates

The sibling VexBoard foundational-language work currently pressures ID / URI / Key distinctions, but this
project does not bulk-rename existing source.

For this specimen, use existing semantic identities when grounded by source. Create a new identity only
when the living design creates a semantic thing that needs independent addressability.

Relationship identity is also earned; NavigateTo between two already-addressable coordinates does not
automatically need its own relationship ID.

## Current Work edges

Immediate:

~~~text
work.vexsync.debugmenu-blueprints.feature-intention-builder-discovery
~~~

This owns discovery of the Feature Request -> Builder process through this one specimen.

Next:

~~~text
work.vexsync.debugmenu-blueprints.debugmenu-origin-roundtrip
~~~

This will use the sufficiently grounded specimen to prove the first bounded Origin <-> current-Android
semantic/source round trip.

No generic construction compiler, generated-test framework, one-action Save/Deploy path or universal
intent schema is admitted as current Work yet. Those may be earned later if the specimen exposes real
pressure.

## Why this matters to VexUniverse

The intended scalable lesson is not "Debug Menu architecture."

It is the process:

~~~text
human intention
-> living semantic terrain
-> current-source grounding
-> unresolved gap
-> Builder investigation
-> next truthful relationship
-> target mapping/realization
-> evidence
~~~

If that process survives materially different consumers, VexBoard/VexSync can use it as a foundation for
building VexUniverse Origins and target relationships without source archaeology or target-specific
semantic reinvention.

## Sibling provenance

Relevant sibling trajectories remain context/evidence:

- project.vexboard — Origin IDE / foundational language / projections.
- project.vex-universe — wider ecosystem relationship pressure.
- project.vexlife.blueprint-source-of-truth — portable meaning / construction lineage.
- project.vexlife-android.current-state-refinement — current Android semantic/repository pressure.
- Android PR #182 — proven target text-value capability candidate, pending acceptance.
- Android PR #183 — current realization-projection candidate, held while foundational language evolves.

They do not become automatically accepted by this Project.

## Refactorability

The names, phases and examples in this Project are current discovery language.

Future consumers should change them when they expose a simpler or more truthful boundary. Preserve the
human intention, source evidence, lineage and distinctions; do not preserve a proposed noun merely
because this first specimen used it.

## Boundaries

~~~text
PROJECT_FORMATION != TARGET_IMPLEMENTATION_AUTHORITY
CURRENT_ANDROID_REFERENCE != FUTURE_ORIGIN_DESIGN
CURRENT_EXAMPLE != ACCEPTED_SCHEMA
MISSING_HOW != PERMISSION_TO_GUESS
PORTABLE_MEANING != TARGET_MECHANICS
REPEATED_PRESSURE -> MAY_EARN_REUSABLE_LANGUAGE
ONE_SPECIMEN != UNIVERSAL_FRAMEWORK
~~~

<!-- [VXG RealForever][VEXSYNC][DEBUGMENU][PROCESS-DISCOVERY][ORIGIN-ANDROID] -->
