# VexLife Application level settings

`[VXG RealForever]`

## Human outcome

Let VexLife behave like an application that already knows it has been set up, while still giving the
person one clear place to intentionally revisit application-level choices later.

The lived trigger was simple:

```text
first run
-> onboarding
-> VexLife opens

close VexLife
-> reopen VexLife
-> onboarding starts again
```

That behavior is acceptable for the current new-new application proving path, but it should not be
silently treated as the forever application experience.

This Project records the debt without interrupting the current WebToApp release trajectory.

## The distinction that earned this Project

The existing Settings experience is primarily part of the Product/feature surface. The new question
is broader:

```text
feature setting
  -> changes one feature's behavior or presentation

application-level setting
  -> changes how the installed VexLife application enters, re-enters, selects its Home,
     resets/revisits setup, or exposes application lifecycle choices
```

Permanent pressure:

```text
APP_SETTINGS != FEATURE_SETTINGS
REOPEN != FIRST_RUN
CLOSE_PRESENTATION != QUIT_PRODUCT
CHANGE_HOME != RECREATE_HOME
RESET_ONBOARDING != DELETE_USER_DATA
UNINSTALL_APP != DELETE_HOME_OR_MEMORY
APPLICATION_PRESENTATION != PRODUCT_SEMANTIC_OWNER
```

## Observed current behavior

During the first lived macOS WebToApp run on 2026-11-19:

- the native VexLife application reached the existing Product experience;
- closing and reopening the application caused the onboarding journey to be walked again;
- the current Settings affordance remained inside the Product/feature experience rather than acting
  as an application-level control surface;
- the person recognized a future need to revisit setup/Home/application choices without making every
  ordinary reopen equivalent to first run.

This is a lived UX/application-state observation. It is **not** evidence that the current Home,
Entry Family, setup journey or container architecture is semantically wrong.

## First questions

### 1. First run versus re-entry

Determine which predicates actually mean "first run" and which should simply be re-observed on launch.

Candidate human shape:

```text
launch
-> inspect current application/Home prerequisites
-> prerequisites already satisfied
   -> enter VexLife
-> repair or human choice genuinely required
   -> show only the relevant setup/application step
```

Do not implement "skip onboarding" as a blind persisted boolean.

### 2. Application-level settings surface

A discoverable native/top-left application affordance is a candidate because application-level
settings should feel like they belong to VexLife itself, not to whichever Product feature happens to
be visible.

That placement is **not** fixed by this Project.

The source audit must first decide what actually belongs at this boundary.

### 3. Home management

Possible future application-level needs include:

- intentionally choose another existing Home;
- revisit supported Home naming/location presentation;
- inspect which Home is current;
- re-enter a setup/repair journey when the person actually asks for it.

Do not infer that changing Home means deleting, recreating or migrating Home truth.

### 4. Reset / uninstall / removal

A normal person may eventually ask:

- reset setup;
- repair VexLife;
- remove downloaded runtime/model material;
- uninstall VexLife;
- remove all VexLife-owned local data.

Those are not the same effect.

The future UI must make destructive scope explicit and preserve independently owned Home,
Conversation, Memory, settings and model files unless the person explicitly chooses the corresponding
destructive action.

## Cross-platform / reusable-container pressure

This Project should prefer one portable application-settings meaning with platform-specific
realization where possible:

```text
portable application intent
       /               \
macOS realization    Windows realization
```

The Mac menu/title-bar location and Windows application chrome do not need identical physical UI to
express the same application-level meaning.

Do not extract a universal container/settings framework before two real platform realizations earn
the shared boundary.

## Current disposition

```text
Project formed     YES
Observed debt      YES
Implementation     NOT AUTHORIZED
Current release blocker  NO

workDisposition       PARKED
authorityDisposition  NO_AUTHORITY
effectDisposition     NO_EFFECTS
```

The current WebToApp lane should continue. Return here after the release/lived application path is
stable enough that application-experience refinement is the intended foreground work.

## Grounding

- VexLife-Prod #396 — current WebToApp application shell / Product Quit trajectory.
- VexLife-Prod #400 — Mac build-delivery proof carriage.
- A008 RETURN SHA-256 `adcb59bd489d10cb6721e044723c85114c5e6984700230242896d026fea0927d`.
- Human lived observation: reopen repeats onboarding after the first successful application run.

<!-- [VXG RealForever][VEXWORK][VEXLIFE][APPLICATION-LEVEL-SETTINGS][TECH-DEBT] -->
