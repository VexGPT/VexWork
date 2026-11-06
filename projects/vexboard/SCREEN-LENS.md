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
                 what does this interaction mean,   what realizes that meaning, which outside truths
                 and which semantic owner decides?  participate, and how does truth return?
                 (right-click flips)
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
RUNTIME     what runs / realizes        METHOD · RESULT · EXECUTION · REALIZATION
OUTSIDE     what reality says           STORE · OBSERVATION
SUPPORT     beside the path             CHRONOLOGY · CONSTRUCTION
```

`ELEMENT` (the UI toggle) and `CONTROL` (`ThemeModeFamily.Control.Select`) are deliberately different
roles: the UI doorway and the semantic Control are different coordinates. `RESULT` names what a bound
Method lawfully returned; it is not an `OBSERVATION`. `REALIZATION` marks a source-proven concrete
realization/reconciliation boundary such as the VexStream Playback Connection; it is a Lens role, not a
new VexArchitecture owner.

Each pathway also carries an honest disposition, so the lens never implies SCAE where it was not earned:

```text
SCAE_FAMILY          source earns a semantic owner and explicit State / Control / Act / Effect / Projection relationships
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
               cross-board BoardJourney continuity; a generated subject's direct Related set stays aligned
               with that subject's catalog RELATED boards, while an adjacent project's board lives under
               that project's subject; browser Back is sufficient until lived use earns a stronger contract
    rejected  hard-coded per-product hrefs and a second Screen-Lens-specific related-board registry

D25 Revision comparison starts from generated Lens identities, not Git diff
    why       a newer repository commit can leave the projected human/architecture meaning unchanged;
              revision currentness needs to distinguish source movement from projection movement
    how       src/shared/vexboard-screen-lens-revision.mjs compares two normalized Lens projections by
              stable chrome/screen/element/pathway/annotation refs and keeps Related-board deltas separate;
              sourceRevisionChanged and projectionChanged remain independent, so current Lens understanding
              can change projected meaning even while the product-source commit stays the same
    boundary   this compares already-generated projections; it does not choose which commit is Stable,
               fetch history, promote a revision, or activate the parked full temporal/reversible horizon
    rejected  treating commit count/file diff as proof that product meaning changed

D26 Projects is the VexBoard front door; the canvas is kept, not deleted
    why       the Screen Lens is the primary VexBoard and more projects are coming (VexLife-Prod,
              VexBoard itself), so the entry has to organize projects before any board view
    how       vexboard/projects.html; a bare vexboard/ redirects there before paint, while
              ?board=, ?create=draft and ?canvas=home keep opening the canvas, so every D24 deep link
              and every sourceRef naming vexboard/index.html stays true
    rejected  moving the canvas to another file (ripples through Workgraph sourceRefs) and deleting
              the earlier boards (Related boards still open them)

D27 One catalog owns which Lens subjects VexBoard can project and where each build points
    why       "which commit is Stable?" must have one answer a human, a script and an AI read the same way
    how       projects/vexboard/lens/catalog.json (vexboard.lens-catalog/v1), validated by
              src/shared/vexboard-lens-catalog.mjs; the UI says Project, the data says subject so it never
              collides with VexWork project.* refs; each subject names its repositoryRef and projectRefs
    boundary   VexWork still owns Project/Work/lifecycle truth; the adapter's repository.commit mirrors
               Stable and lens:verify fails if they disagree

D28 Two standing builds, Stable and Main; any other commit on demand
    why       Victor asked for a constant Stable and Main pair whose pointers move deliberately, plus a
              way to open anything older or specific for debugging
    how       Stable's source pointer moves only by evidence-bearing npm run lens:promote; npm run lens:main
              moves Main to the branch head and never re-pins the adapter; Main shares Stable's lens file
              whenever both point at one commit. An accepted VexBoard projector/relationship correction may
              refine the Stable projection at the same source commit; that adds acceptance evidence and is
              PROJECTION_CHANGED, not SOURCE_COMMIT_CHANGED
    rejected  Stable following main automatically (Stable means accepted, not newest)

D29 Any commit is projected in the browser from public source, with the same adapter
    why       debugging an older or specific commit should not need a checkout, a script or a PR
    how       src/shared/vexboard-lens-commit-source.mjs resolves the ref, lists the tree once, fetches
              exactly adapterReadPlan's files from raw.githubusercontent.com, and runs the pure adapter
              with a lenient current overlay: descriptive patches apply only to refs the historical source
              exposes, while source-sensitive structural additions/removals are skipped rather than guessed
    boundary   reads only api.github.com and raw.githubusercontent.com for the catalog's repository; the
               typed ref is validated before it enters a URL; fetched Kotlin is parsed as text, never run;
               historical source is explicitly labeled as projected with current Lens understanding; no
               projection cache survives a page reload; unauthenticated GitHub allows 60 calls an hour
               and a commit costs 2, so Stable and Main (no calls) always work
    rejected  a backend or GitHub token in the page

D30 Differences from Stable reuse D25 and stay readable at step level
    why       "1 pathway differs" is only useful if you can see which step and what it says now
    how       comparePathwayRevision adds step and relationship detail; the lens shows a chip, a
              Differences panel with Show links, and dashed rose rings on changed controls, steps and
              screen chips; a newer source commit with no projected change says "Same meaning as Stable"
    boundary   rings are outlines in the gap around a control (D23 holds); Copy as text hands the same
               differences to an AI as Markdown

D31 Projects does not own a proposal lifecycle
    why       useful future ideas already have rightful architecture/Work placement; a standing proposal registry
              would create another status surface for every future instance to maintain
    how       keep pressure-backed future seams in the owning docs and capture real Work through VexWork only
    boundary   removing the proposal subsystem does not discard provenance or authorize implementation

D32 Unproven localEffect is held, not projected as generic presentation
    why       a declared interaction does not prove its deeper semantic/runtime relationship
    how       keep the element and intent, omit pathwayRef, and report the held relationship
    boundary   no-pathway means "not currently projected", not "no behavior exists"

D33 Typed implementation-template reuse does not collapse semantic pathway instances
    why       SwapTo(Content, ElementsPanel) and SwapTo(Content, AppGraphPanel) share an API shape but not meaning
    how       typed pathway identity includes stable operation operands; named-argument order is normalized
    boundary   controls share one pathway only when they express the same semantic relationship

D34 Generated provenance binds projector implementation bytes
    why       a projector behavior change can alter meaning even when adapter config/version strings do not move
    how       provenance records the projector Git-blob SHA-1 and lens:verify recomputes it from source bytes
    boundary   provenance proves generator currentness, not semantic acceptance

D35 Method Result and independent Store observation remain distinct
    why       ThemeMode reconciles Method Success output directly while store.states is observed through a separate source
    how       the ThemeMode overlay names those two exact paths without generalizing a universal Result ontology
    boundary   ambiguous generic Family Effect/Method selection is held rather than choosing index 0

D36 Ordinary Main movement is forward-only
    why       currentness cannot call a rewound/diverged branch "new Main"
    how       lens:main proves the existing Main commit is an ancestor of the configured live branch before advancing
    boundary   an explicit --commit expert/recovery route remains separate from normal branch following
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

## Accepted baseline, completed currentness foundation and limits

The Living Screen Lens has an accepted, deployed first-draft baseline and an accepted completed
currentness/projection-truth foundation. PR #238 integrated the later completion correction, its actual
merge tree matched the pre-merge synthetic composition exactly, GitHub Pages deployed that merge, and
Victor's hosted historical-commit / Differences-from-Stable browser proof closed the remaining lived
edge. PR #250 then currentized the durable Screen Lens Work coordinate to COMPLETED.

Accepted first-draft source/projection checkpoint:

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

Accepted PR #238 currentness/projection-truth foundation:

```text
same VexLife-Android source pin
  305a09eac1fabebcf2241bd207386950f41121f2

generated Lens
  10 screens
  241 elements
  56 source-earned pathways
  67 visible localEffect() controls intentionally have no deeper projected pathway
  2 earned semantic relationship shapes
    ThemeMode captured-Family traversal
    VexStream Playback typed BEHAVIOR_PORT traversal

truth boundary
  VexMethod.Result != independent Store observation
  concrete Connection realization != doorway dispatch
  unresolved relationship != invented generic presentation

integration + lived closure
  VexWork PR #238 -> merge cbfce46235b628635774c0d3c849fcfe5d8dd236
  Pages deployment -> PASS
  historical Commit 4d357c4 vs Stable 305a09e -> 2 differences rendered in deployed browser
  VexWork PR #250 -> work.vexboard.screen-lens-currentness COMPLETED
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
HISTORY accepted PR #235 threshold related Theme Mode Origin Walk + VexLife-Prod alignment
CURRENT Projects/Builds refinement homes the adjacent alignment under VexLife Prod; Android direct
        Related is Theme Mode Origin Walk + VexStream Playback VexArchitecture + the active
        VexStream phone ↔ desktop Living Blueprint patient zero. The living Blueprint is no longer
        grouped under earlier canvas trials; its separate construction-evidence board remains provenance.

DONE   stable-ref Screen Lens revision comparison
       source commit movement != projection movement
       historical commit projection + Differences from Stable

DONE   projects entry, Lens-subject catalog, Stable/Main pointers, any-commit projection,
       Differences from Stable                                         PR #237 / #238
DONE   currentness/projection-truth completion + hosted lived proof     PR #238
DONE   durable Screen Lens Work closure                                PR #250

WAKE   first real Main move only when VexLife-Android main advances beyond Stable:
       npm run lens:main -> review Differences -> npm run lens:promote with acceptance evidence
       Current observation: live main == Stable == 305a09eac1fabebcf2241bd207386950f41121f2; no action now.

ACTIVE broader canonical VexWork foreground (not unfinished Screen Lens completion):
       work.vexboard.vexstream-screenshot-pilot + work.vexboard.source-projectors
       align accepted source projection with observed/lived evidence at stable semantic coordinates

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
