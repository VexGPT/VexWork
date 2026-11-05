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
SCAE_FAMILY          a Family owns meaning (ThemeMode; VexStream Playback via earned Behavior-port traversal)
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

## Finding things, impact and briefs

`src/shared/vexboard-screen-lens-query.mjs` answers the questions a developer or a fresh AI asks before
touching code. The page wires it in; nothing here owns truth.

```text
SEARCH  (/ in the lens)
  start from any coordinate: action key, element ref, Kotlin symbol, file name, label or note text
  every token must match; exact identifiers rank first, then labels, then prose
  choosing a result jumps to the screen (preferring the one you are on), anchors the control,
  flips the Behavior side to the step's face and reveals it

IMPACT  (inspector)
  control  -> screens it appears on, controls sharing its pathway, what it touches underneath
              (steps in the Runtime, Outside truth and Beside-the-path bands)
  step     -> every control and screen that reaches it, plus steps in other pathways with the
              same symbol or the same source file

COVERAGE  (screen chips and inspector)
  traced = a reachable control has a pathway in this lens
  TRACED != PROVEN != CURRENT

BRIEFS  (Copy control brief / Copy screen brief)
  paste-ready Markdown for a person or an AI: identities, roles, source paths pinned to the commit,
  reach, pathways face by face, notes, and everything still held
  a brief describes the lens; regenerate it, never edit it into a second source of truth
```

## Decision record

Choices made while building, with the reason and what was rejected, so a successor does not have to
rediscover them.

```text
D1  Separate page (vexboard/lens.html) sharing modules with VexBoard
    why       the main board is one large file under many accepted contracts; regression first
    rejected  rewriting index.html around a new mode

D2  Four faces = two sides x front/back, not a 2x2 grid
    why       Victor's words; README non-goal "automatic four-quadrant / 2x2 reflow"

D3  ELEMENT (UI doorway) and CONTROL (Family Control) are different roles
    why       ThemeMode proves they are different coordinates (toggle vs Control.Select)

D4  Every pathway carries a disposition; doorway collapses only when >= 2 non-doorway steps remain
    why       never imply SCAE where the code has none; direct registrations ARE their doorway

D5  Annotations always name a subject
    why       floating annotation shapes were the main readability failure on the Theme Mode board

D6  Route ownership decides where a screen-map edge starts; destinations appear once
    why       grounded in AppShell / AppFrame isPrimary() / AppScreens primary vs shared
    rejected  nesting shared screens under each parent; drawing the whole trajectory tree

D7  Walk semantics match BoardJourney: Back pops, crumb click appends a Revisit, A -> B -> A kept
    why       one navigation law across VexBoard surfaces

D8  Layered vertical layout, return lanes outside content, bridge enters from the band above
    why       half-width panels read top to bottom; entering from above never crosses a node
    proof     layoutCollisions() == [] for every face and the screen map (tests)

D9  One label placer for the lens and the existing canvas
    why       same overlap law everywhere instead of two heuristics

D10 Hand projection pinned to one commit; refs reuse source identities; container refs derived
    why       no generator yet; never mint identity the source does not have
    marked    sourceSnapshot.notes says so in the file and in every brief

D11 Right-click flips Behavior, shift + right-click keeps the browser menu
    open      main board uses right-click for its context menu; Victor to confirm the split

D12 Search ranks identifiers over prose and prefers the current screen
    why       a developer usually pastes a key or symbol, and should not be thrown to another screen

D13 "Touches underneath" = Runtime, Outside truth and Beside-the-path bands
    why       those are what change when a control is used; semantic steps are meaning, not reach

D14 Stacked PRs: #219 stays the proven Screen Lens; this work stacks on it
    why       keep a reviewed, proven candidate separate from new scope (REPOSITORY-INTEGRATION.md)

D15 Not done here, on purpose
    Work item admission      needs authority on the Workgraph; proposed only
    Kotlin annotations       VexLife-Android owns its source meaning; proposal only
    generator + currentness  routed to the ChatGPT lane (resourcing / hooking); superseded by D16

D16 Generate the lens from source; the hand-made lens becomes a test fixture
    why       hand projection drifted within days (ThemeModeStore.Result vs VexMethod.Result)
    how       src/core/vexboard-screen-lens-android-adapter.mjs + scripts/build-screen-lens.mjs
    rejected  keeping two lenses that both claim to describe the app

D17 One template per architectural shape, not per screen
    why       VexArchitecture is fractal: every Family takes the same path, every screen uses the
              same DSL; one rule per shape covers today's 10 screens and tomorrow's
    rejected  per-screen mapping files

D18 Follow the captured closure instead of asking for an annotation
    why       ScreenActionContext.<closure> -> session lambda -> fun -> XFamily.Control.Y( is
              readable from source; annotations stay reserved for hops nothing can read

D19 Human knowledge lives in a small overlay that fails on dangling refs
    why       notes and the ThemeMode fence are real knowledge the code does not say yet;
              failing on unknown refs stops a rename from silently orphaning a note
    rule      an overlay entry is a TODO for source (KDoc or @VexLens)

D20 Read strings.xml for visible text
    why       labels from resource names read like code ("Log history show"); the real text is in
              source

D21 Currentness by provenance and regeneration, not by a second file
    why       provenance hashes (adapter, overlay, generator) + --check against a commit answer
              "is this still true?" for the whole lens; the per-node currentness contract below
              is only needed if the lens is ever served without regeneration
    proof     --fetch --check regenerates byte-identical output from a fresh clone of the pin

D22 Manual-dispatch workflow, never auto-push
    why       Victor asked for a script any instance can rerun; the repository runs no CI today, and
              writing generated output to main needs a human or Integration Steward decision

D23 Nothing the lens adds on the surface covers a control
    why       the generated lens put 119 traced controls on screen and exposed three overlaps the
              hand lens never hit: an opened dialog over its opener, the travel chip over the next
              button, the bridge through sibling controls in the same row
    how       placement is measured after layout: a dialog moves to the band that leaves its opener
              visible; a sheet scrolls its opener above it; the travel chip tries its sides in order
              and otherwise shrinks to a corner "Go" badge; the bridge drops into the gap below (or
              above) the row and runs level until it is clear of the phone
    proof     browser sweep over every traced control: 0 crossings, 0 covered controls
    rejected  hiding the chip entirely (it is the surface's only travel affordance besides
              double-click)

D24 Related boards resolve by stable boardRef, not by copying URLs into the Lens
    why       the Lens already carries relatedBoardRefs and VexBoard already owns source-catalog /
              built-in board resolution; the missing seam is human addressability, not a new link model
    how       Lens renders Related -> ./?board=<encoded boardRef>; VexBoard resolves that boardRef
              through the existing resolver and opens the source-owned BoardGraph read-only
    boundary   opening a related board does not mutate this Lens, transfer source authority, or imply
               cross-board BoardJourney continuity; browser Back is sufficient until lived use earns
               a stronger federated Journey contract
    rejected  hard-coded per-product hrefs and a second Screen-Lens-specific related-board registry
```

## Data contract

`vexboard.screen-lens/v1`. The live lens is generated (`lens/vexlife-android.screen-lens.json`, see
`SCREEN-LENS-ADAPTER.md`); the original hand-made Debug Menu lens is kept as a test fixture
(`test/fixtures/screen-lens/debug-menu.hand.screen-lens.json`).

```text
sourceSnapshot   repository url + exact commit + path roots ("app:", "arch:")
relatedBoardRefs[] stable VexBoard board identities for separate related projections
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

## Current accepted threshold and limits

The Living Screen Lens is now an accepted, deployed first-draft VexBoard surface rather than an
unintegrated candidate.

Current accepted source/projection checkpoint:

```text
VexLife-Android source pin
  305a09eac1fabebcf2241bd207386950f41121f2

generated Lens
  10 screens
  241 elements
  44 pathways
  2 earned Family bonds
    ThemeMode
    VexStream Playback via BEHAVIOR_PORT

integration
  VexWork PR #230
  merge 0ce15927913f9cd96b04d900e89dac39e50f201f

lived browser threshold
  Victor: navigable / perceivable first-draft PASS

related-board federation/addressability
  VexWork PR #232
  merge 1a55b01f3c02b3d603fe9d6c55782b0715133fbf
```

Current limits remain:

- Visible text comes from `res/values/strings.xml`, default locale.
- VexStream Playback is the first runtime-Connection Family shape earned by source traversal; do not
  generalize that shape to Maps or another feature merely because it also has a runtime connection.
- Maps Process/Session + Relay/convergence relationships remain unprojected until their own source
  shape earns a truthful traversal.
- The older "Debug Menu / Theme Mode · Family language" board still says `Control.Toggle`; current
  `ThemeMode.kt` uses `Control.Select(Parameter.Mode)`. The lens records this as a note.
- On the existing VexBoard canvas, some routes can still pass behind a node. Labels no longer do;
  route avoidance remains a separate presentation refinement.
- The Lens is light-mode only, matching the current VexBoard presentation.
- D11's exact right-click preference remains an interaction-design question even though the overall
  deployed first-draft experience has received lived acceptance.

## Next edges

```text
DONE   Screen Lens UI, data contract, overlap-free layout             PR #219
DONE   existing canvas overlap fixes                                  PR #219
DONE   search, impact, coverage, briefs                               PR #220
DONE   generated lens: adapter, overlay, script, manual workflow      PR #221
DONE   VexStream Playback stable reference + Behavior-port traversal  PR #222 / #227
DONE   exact generated source proof + current-main composition        A004 / A006
DONE   integrated complete Screen Lens stack                          PR #230
DONE   lived first-draft browser acceptance                           human evidence
DONE   stable boardRef deep links + Related-board affordance          PR #232

DONE   second real Related-board consumer:
       board.vexlife-prod.perceivability-alignment
       accepted read-only New Beginnings / VexLife-Prod alignment Board
DONE   generated Screen Lens relates Theme Mode Origin Walk + VexLife-Prod alignment by stable boardRef

NEXT   prototype revision/currentness behind an advanced surface:
       Stable vs checked/current/custom source revision, semantic diff rather than raw Git noise
NEXT   continue canonical VexWork foreground:
       work.vexboard.vexstream-screenshot-pilot + work.vexboard.source-projectors
       align source projection with observed/lived evidence at stable semantic coordinates

PRESSURE-DRIVEN
       let Maps, VexLife-Prod and other materially different consumers earn additional relationship
       shapes before extracting one generalized architecture-relation graph

LATER  VexLife-Android exports its own projection from UIBlueprintRegistry (SCREEN-LENS-ADAPTER.md)
LATER  move overlay entries into KDoc / @VexLens once VexLife-Android admits them
LATER  observed journey: replay a VexLogger export over a pathway
LATER  crawler screenshots on the Surface face
LATER  BoardPatch / reversible authoring only after desired -> candidate -> regenerated proof is earned
```

Suggested currentness contract, kept separate so the lens file stays an immutable projection:

```text
vexboard.screen-lens-currentness/v1
  lensRef, lensCommit, checkedCommit, checkedAt
  entries[]: { ref, source, symbol, state: CURRENT | MOVED | MISSING | UNCHECKED, foundIn? }

CURRENT    source file exists at checkedCommit and contains the symbol
MOVED      the symbol exists, in a different file
MISSING    neither the file nor the symbol is found
UNCHECKED  no symbol to check

the lens overlays this as a badge per node/element; it never rewrites the lens
```

<!-- [VXG RealForever][VEXWORK][VEXBOARD][SCREEN-LENS] -->
