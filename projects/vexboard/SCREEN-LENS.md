# VexBoard — Screen Lens

`[VXG RealForever]`

## Human question

> How can any human or AI open one screen and see what it can do — where each control lives, what it
> means, and what it touches underneath — without opening several duplicate pages or getting lost in a
> trajectory tree?

The Screen Lens is a read-only VexBoard view that answers that question for one screen at a time and
lets the reader travel to the next screen one hop at a time.

```text
SCREEN_LENS = PROJECTION
SCREEN_LENS != SOURCE AUTHORITY
SCREEN_LENS != STATE / LIFECYCLE / EXECUTION OWNER
LENS JSON  != CANONICAL PRODUCT MEANING
```

Current source (VexLife-Android at a pinned commit) owns what the lens shows. The lens file only
projects it.

## Four faces, two sides

The "quadrants" are not a 2×2 grid. They are two sides, each with a front and a back face:

```text
                 FRONT                              BACK
EXPERIENCE       Surface                            Structure
                 what the human sees and touches    which container, id and declaration it is
                                                    (middle-click flips)

BEHAVIOR         Behavior                           Depth
                 what it means:                     what runs, persists and returns underneath:
                 Control -> Act -> Effect ->        Method -> Execution -> Store -> Observation
                 Projection (SCAE)                  (right-click flips)
```

Selecting a control on either Experience face selects its pathway on both Behavior faces. A bridge line
leaves the selected control, crosses the gutter, and enters the pathway's first step on whichever
Behavior face is showing. When a pathway returns presentation to the same control, a dashed return line
closes the loop.

Gestures (all have keyboard / tab equivalents so touch and accessibility are not second class):

```text
middle-click Experience side      flip Surface <-> Structure        key [
right-click Behavior side         flip Behavior <-> Depth           key ]
shift + right-click               native browser menu (escape hatch)
drag                              pan a graph face
scroll / ctrl|cmd + scroll        move / zoom a graph face
click a control                   select it and trace its pathway
double-click a navigating control travel (or use its Go button)
M                                 Screen map
Esc                               clear selection / close overlay
```

Inside the Behavior face, the doorway steps (declared intent, runtime dispatch, screen registration,
captured closure) are collapsed by default into a one-line strip so the SCAE core fits. They expand into
full nodes on request. Pathways that are *only* doorway (direct registrations) are never collapsed.

## Role typing: color answers "which question does this answer?"

Every node and element carries one role. Roles are grouped into bands by the VexArchitecture question
they answer. Color is presentation; every role also has a unique chip so meaning survives color-vision
differences and the high-contrast palette.

```text
EXPERIENCE  what the human meets        SCREEN · CONTAINER · CONTENT · ELEMENT · NAVIGATION
DOORWAY     how a touch reaches owner   INTENT · DISPATCH
SEMANTIC    what the owner decides      CONTROL · STATE · ACT · EFFECT · PROJECTION
RUNTIME     what work is alive          METHOD · EXECUTION
OUTSIDE     what reality says           STORE · OBSERVATION
SUPPORT     beside the path             CHRONOLOGY · CONSTRUCTION
```

`ELEMENT` (the UI toggle) and `CONTROL` (`ThemeModeFamily.Control.Select`) are deliberately different
roles: the UI doorway and the Family's semantic Control are different coordinates.

Each pathway also carries an honest disposition, so the lens never implies SCAE where it was not earned:

```text
SCAE_FAMILY          a Family owns meaning (ThemeMode)
TYPED_PRESENTATION   Open / Close / Toggle already says everything (Show log, + FAB)
TYPED_NAVIGATION     NavigateTo(ScreenId) already says everything (bottom nav, FAB options)
DIRECT_REGISTRATION  registration calls owners directly; no Family yet (Reset log, Events lab)
```

## Annotations are attached, never floating

An annotation always names a subject (element, node, screen or pathway). The lens shows it as a note
count on the subject and as text in the inspector. There is no free-floating annotation shape, which is
what made the earlier Theme Mode board hard to read.

## Traversal without over-nesting

The open question was how a reader perceives a natural build of exploration instead of being shown a
whole trajectory tree. Current VexLife-Android source already answers it:

```text
AppShell (app/.../shell/AppShell.kt)
  owns toolbar, primary navigation and FAB destinations once
AppFrame (app/.../shell/AppFrame.kt)
  shows bottom navigation and the FAB cluster only when runtime.isPrimary()
AppScreens (app/.../screens/AppScreens.kt)
  primary = peer destinations, shared = destinations pushed from several primaries
VexScreenCrawler
  captures the first stable appearance of each visited Screen
```

So the lens uses two views over one deduplicated screen graph:

```text
EXPLORE (default)
  one screen at a time
  -> controls that navigate show their destination
  -> traveling appends to the walk (A -> B -> A stays real history)
  -> Back pops; clicking an earlier crumb is an explicit Revisit

SCREEN MAP (M)
  every screen appears once
  -> a route owned by chrome is one edge from that owner, with its origins listed,
     not one copy under each screen that shows it
  -> screens no projected route reaches yet are listed, not drawn as floating nodes
```

Rule: **route ownership decides where an edge starts.** Shared chrome contributes routes from one owner
node. Screen-owned controls contribute routes from their own screen. Destinations never get copied.

## Overlap-free layout

`src/shared/vexboard-lens-layout.mjs` lays out each graph face deterministically:

```text
rank     longest forward path; sources pulled next to their first successor
order    barycenter sweeps within each rank (stable)
routes   orthogonal; forward hops use gutter channels; long hops pass through reserved slots;
         return edges use a lane outside the content and re-enter from the band above the target
labels   placed where they cover no node and no other label; other routes are avoided when possible
```

`layoutCollisions(layout)` reports node/node, label/node, label/label and route-through-node overlaps.
The tests assert it is empty for every face of every pathway (with and without the doorway collapsed)
and for the screen map.

The same label placer now also places edge labels on the existing VexBoard canvas, and relationships
sharing the same endpoints get separate lanes so opposite edges are never drawn on the same line.

## Data contract

`vexboard.screen-lens/v1` (see `examples/vexlife-debug-menu.screen-lens.json`):

```text
sourceSnapshot   repository url + exact commit + path roots ("app:", "arch:")
chrome[]         shared chrome owners with appliesTo PRIMARY | SHARED and their element trees
screens[]        placement PRIMARY | SHARED, mapped MAPPED | CHROME_ONLY | HELD, element tree
pathways[]       disposition, nodes (face BEHAVIOR | DEPTH, role, label, symbol, summary, source,
                 code excerpt), edges (FLOW | DATA | RETURN | SIDE), returnRef
annotations[]    subjectRef + text + detail
```

`normalizeScreenLens` fails closed on unknown roles, faces, kinds, dispositions, broken parent or
pathway references, containment cycles, unknown navigation targets and unknown annotation subjects.

## Kotlin annotations as bondables (proposal for VexLife-Android)

VexLife-Android owns its source meaning, so this is a proposal, not a change to that repository.

The principle: **derive first, annotate only what the code cannot already say.** Most of the lens is
derivable from existing typed source today:

```text
DERIVABLE NOW (projector, no annotations)
  element tree and ids          toggleRef / buttonRef / card / row / text in Screen layouts
  declared intents              invoke(...), open(...), toggle(...), navigateTo(...)
  action keys                   AppActions.*
  registration ownership        appAction(action = ..., ownerRef = screenId) { ... }
  chrome slots and visibility   AppShell.blueprint, AppFrame runtime.isPrimary()
  primary vs shared screens     AppScreens.primary / AppScreens.shared
  Family vocabulary             sealed interface State / Control / Effect / Act.Method

NEEDS A BOND (cannot be read off the call site)
  edges through captured closures   toggleDarkMode -> toggleThemeMode(family, store, ...)
  roles a name does not reveal      the === currentness fence is STATE, not OBSERVATION
  human summaries and notes         "Semantic State updates now, while Save is only requested"
```

Smallest annotation set that covers the second list:

```kotlin
// Proposal only. Retention SOURCE: no runtime cost, read by a projector (KSP or text).
@Retention(AnnotationRetention.SOURCE)
@Target(AnnotationTarget.CLASS, AnnotationTarget.PROPERTY, AnnotationTarget.FUNCTION)
annotation class VexLens(
    val role: VexLensRole,
    val summary: String = "",
    val ref: String = "", // empty = reuse the existing identity (elementId, ActionKey, symbol)
)

@Repeatable
@Retention(AnnotationRetention.SOURCE)
@Target(AnnotationTarget.CLASS, AnnotationTarget.PROPERTY, AnnotationTarget.FUNCTION)
annotation class VexLensEdge(
    val to: String,      // the other end's existing ref or Kotlin symbol
    val label: String,
    val kind: VexLensEdgeKind = VexLensEdgeKind.FLOW,
)

@Retention(AnnotationRetention.SOURCE)
@Target(AnnotationTarget.CLASS, AnnotationTarget.PROPERTY, AnnotationTarget.FUNCTION)
annotation class VexLensNote(val text: String, val detail: String = "")
```

Example on an existing ThemeMode type:

```kotlin
@VexLens(VexLensRole.EFFECT, summary = "Inert request for outside work. A newer Save supersedes an older one.")
@VexLensEdge(to = "ThemeModeFamily.Act.Method.Save", label = "binds")
data class Save(val mode: Parameter.Mode) : Effect
```

Permanent:

```text
ANNOTATION != IDENTITY MINTING      ref defaults to the identity source already owns
ANNOTATION != BEHAVIOR              removing every @VexLens changes no runtime behavior
ANNOTATION != SECOND REGISTRY       the projector reads them; nothing dispatches through them
UNANNOTATED + NOT DERIVABLE -> HELD never guessed
```

`VexLensRole` mirrors `LENS_ROLES`. `VexLensEdgeKind` mirrors `FLOW | DATA | RETURN | SIDE`. If the
role vocabulary changes, it changes here first and the Kotlin enum follows.

## Current limits

- The Debug Menu lens is hand-projected from VexLife-Android `305a09e`. Until a projector generates it,
  treat it as a candidate projection.
- Visible text is approximated from `R.string` names; string values were not projected.
- Home, Events and Settings show chrome only; their content is held. Gallery, Profile and the other
  shared screens are listed but not projected.
- The older "Debug Menu / Theme Mode · Family language" board still says `Control.Toggle`; current
  `ThemeMode.kt` uses `Control.Select(Parameter.Mode)`. The lens records this as a note.
- On the existing VexBoard canvas, some routes can still pass behind a node (for example the activate
  edge behind the ThemeMode node). Labels no longer do; route avoidance is a separate refinement.
- The lens is light-mode only, matching VexBoard.

## Next edges

```text
1. admit the bounded Work item (suggested: work.vexboard.screen-lens under project.vexboard,
   related to project.vexsync.debugmenu-blueprints) and rebuild public projections
2. Lived Pages check at desktop and phone widths; confirm right-click flip does not fight other
   browser habits for Victor
3. Android source projector: generate this lens from the pinned commit using only the DERIVABLE NOW
   list; golden-test that it reproduces the hand projection's structure
4. Decide in VexLife-Android whether to admit @VexLens / @VexLensEdge / @VexLensNote for the
   NEEDS A BOND list
5. Second screen (VexStream Music or Settings) to pressure reuse before generalizing anything
```

<!-- [VXG RealForever][VEXWORK][VEXBOARD][SCREEN-LENS] -->
