# VexBoard — Screen Lens projectability

`[VXG RealForever]`

## Human question

> I can see a Screen's registered controls and what they mean. Why can't I see what the Screen can
> actually become — the rows a list repeats, the sheet that is closed right now, the image that falls
> back to an icon — and why something is or is not on screen, without VexBoard learning every feature?

The Screen Lens projected one relationship about UI: **registration** (ScreenBlueprint). For a Screen
that renders custom content, the registered tree is a semantic manifest, not the visible body, so the
Surface drew it literally. VexStream's `column("track-actions")` showed as a visible column of seven
buttons, although source renders those actions inside every track row's menu.

The missing relationship is **realization**: how a registered or runtime coordinate becomes
presentation, and what decides whether it is presented. Current source already expresses it through
a handful of reusable Vex primitives and ordinary Kotlin control flow. This foundation reads that, once,
and lets every Lens face reuse it.

```text
REGISTRATION   which semantic identities exist          ScreenBlueprint (unchanged)
REALIZATION    how they become presentation, and why     this foundation
BEHAVIOR       what an interaction means                 pathways (unchanged)

PROJECTABILITY != NEW SOURCE OWNER
REALIZATION READER != FEATURE PARSER
```

## Truth categories (never collapsed)

```text
SOURCE      realized under source defaults: default selection, closed modals, unconditional content
LATENT      current source can realize it; this context does not (dashed)
DEPENDS     realization depends on feature data VexBoard has not observed (dotted, "if")
EXAMPLE     realized because a source-authored example sets it (Preview setup)
SCENARIO    realized because a browser-local scenario override sets it
HELD        known relationship that source does not let VexBoard project yet
UNTRACED    registered identity with no traced realization (a registration grouping, or an unread path)

CURRENT RUNTIME INSTANCE   never claimed: VexBoard has no live device data
PROPOSED DESIGN            stays with ScreenDesign; not part of this foundation
```

`UNTRACED` is not a defect bucket. On VexStream it is exactly the set of registration groupings
(`body.track-actions`, `body.library-actions`, `body.collection-actions`, `body.library-tabs`), which
is precisely the flattening the Surface used to draw as visible boxes.

## Presence kinds keep their owners

A shared projection classifies presence, but each relationship keeps the owner and meaning source gave
it. There is no single Boolean `visibleWhen`; the normalizer rejects one.

| Kind | Source idiom | Owner | Evaluated by VexBoard? |
|---|---|---|---|
| PRESENTATION | `if (runtime.presentation.isOpen(X))` | VexRuntime presentation state | default closed; example/scenario may open |
| SELECTION | `selected(Container) == Child`, `swappableRef(defaultChild =)` | VexRuntime presentation state | default child; example/scenario may select |
| POPULATION | `VexStableLazyColumn(listRef, items, itemRef, emptyContent) { … }`, raw `items(…)` | feature data · list mechanics | count never observed; scenario may say none / some |
| BRANCH | `if (…)`, `?.let` around realization | feature | no: expression carried verbatim |
| CASES | `when (subject) { … }` | feature | no: cases carried verbatim |
| ALTERNATIVE | `if (a) A else B` filling one slot (image ↔ fallback icon) | feature | no: scenario may choose |

Nested relationships carry a **gate** (the enclosing choice). A relationship inside an unselected
panel does not leak uncertainty outward; one inside an unknown branch becomes dependent. Independent
realization sites of the same element combine as OR.

## Readers (VexWork, pure, browser-safe)

```text
src/core/vexboard-kotlin-source.mjs        Kotlin text reading shared by the adapter and readers
src/core/vexboard-android-realization.mjs  realization reader
src/core/vexboard-android-examples.mjs     source-authored examples reader
src/shared/vexboard-screen-lens-realization.mjs
                                           normalization (fail-closed) + presence resolution
src/shared/vexboard-screen-lens-expressions.mjs
                                           expressions + their Behavior / Depth graphs
```

The realization reader recognizes only reusable vocabulary:

```text
Kotlin control flow           if / else, when, ?.let, binding chains (val, by, parameters, elvis)
VexRuntime presentation API   presentation.isOpen(X), presentation.selected(Container)
Vex presentation primitives   LEARNED from the elements module's own `fun Vex*` signatures:
                                element = …          registered element realization
                                id = "…"             local slot under the inherited Vex parent
                                parent / parentRef   VexComposeScope semantic parent
                                listRef+items+itemRef stable repeated population
                                presentationRef      anchored presentation
                                other @Composable params (headers) realized once
Compose lazy list             items(items, key) — repeated, but without list identity (held)
native boundary               AndroidView stays a named opaque boundary
```

It follows composable calls, binds parameters to call-site arguments, and records provenance chains
(`items ← parameter ← call ← local ← collectAsState ← repository/relay ← render entry`). It never
interprets an expression and never executes Kotlin.

`test/vexboard-android-realization.test.mjs` makes the handoff's architecture test executable: the
generic readers must contain no product nouns (song, track, album, artist, playlist, event,
attention, conversation, log history, map, music, profile).

## Source-authored examples: composition, not a new descriptor

Android already authors meaningful states beside each feature. The examples reader composes their
existing identities; it adds no descriptor and mints no example identity.

```text
preview:<id>   VexPreviewHost(id, startScreen, repositoriesFactory, previewSetup)
               setup (open / selectChild) is machine-readable; fixture stays typed Kotlin
golden:<case>  @PreviewTest + KDoc "Semantic visual case: <case>"; accepted reference PNG listed
               at the pinned commit (expected render, not an observed device run)
journey:<id>   vexJourney(id, title) steps; externalCause(repository, causeRef) { code } kept verbatim

related        examples that call the same fixture function (preview:vexstream-music ↔
               golden:vexstream.library.songs via vexStreamPreviewState()) — no descriptor needed
held           duplicate ids, host-derived ids, KDoc-less goldens, foreign semantic roots
```

Render configurations (`@VexScreenPreviews`: Phone Dark / Phone Light / Compact large text) are listed
beside an example, never multiplied into separate examples. Journeys are transitions, not checkpoints;
the Lens lists them but never simulates them.

## Expressions: one dimension both sides share

A Screen keeps one structure. An **expression** is one context its surface can be seen in, derived
only from relationships source already declares (`src/shared/vexboard-screen-lens-expressions.mjs`):

```text
SOURCE        source defaults (always first)
EXAMPLE       a source-authored Preview / golden (a golden shows its accepted reference render)
SELECTION     runtime presentation selects another registered child            (tab → panel)
PRESENTATION  runtime presentation opens a sheet or dialog                       (opener → sheet)
POPULATION    the list has rows (template drawn with placeholder slots) / its declared empty content
CONDITION     a feature-owned branch, case or alternative takes one source-written choice
CUSTOM        a hand-set combination (inspector buttons); still one expression
```

Order is depth first: an expression's variations follow it (a tab, then that tab with rows, then with
none). Two candidate contexts that present the same thing are one expression (the other is an alias).
A guard decided by feature data alone (a loading pane) yields none.

```text
Expression rail    above both sides: every expression of the Screen, ‹ › and n / N
Surface            a carousel of phones: the current one interactive, its neighbours the same structure
                   in the previous and next expressions (inert); swipe, ← →, or click a neighbour
Structure          the same expression: rows it presents beyond Source, rows that step aside
Behavior           with no control picked: how the expression is reached
                     control → declared intent → runtime presentation state → place      (selection / sheet)
                     feature data has items → ↻ template                                  (population)
                     if <condition> → what it presents                                    (condition)
Depth              what realizes it: realizer composables, the data binding chain ending at the owner
                   the screen is handed (Relay / Repository / Store), preview fixtures, golden renders
Bridge             from where the Surface shows the expression to the node that reaches it
Double-click       goes where a thing is exposed: a typed intent where it leads (Songs tab → Source,
                   Queue → sheet open + queue selected); a latent element to the nearest expression
                   presenting it (a row action → that list's rows)
URL                ?expression=<ref> (older ?example= links still open)
Inspector          This expression: reached by, truth, presented beyond Source, stepped aside;
                   per element "Why it is, or is not, presented" + Go to the expression that presents it
Examples overlay   inventory: examples (Show as expression), held examples, journeys (never simulated)
```

An expression is a **context over all four faces**, never another face: a face would hide the Surface
exactly when the reader wants to watch it change. Its value (example + overrides) is immutable in the
page, never stored, never sent. `SCENARIO != SOURCE TRUTH`, `PLAYGROUND != RUNTIME AUTHORITY`.

Bulky in-place signals are gone: no latent dock, no ↔ swap tabs, no population cards in Source (one
compact `↻ Template for each of items` line; double-click it for its rows).

## Design structure is composable structure

A human question that shaped this: *does the composable structure imply the design structure — the
nesting, the swappable, the appended ids?* Yes. Source already states the design; the Lens draws it
from these facts and from nothing feature-specific:

```text
nesting                         CARD / ROW / COLUMN / STACK slots are the layout tree
appended Vex ids                copy.title is the address of a layer: any layer is fetchable by path
swappable / selected(...)       one child at a time (SELECTION)
if (…) { cell }                 a layer that may be absent (dotted on the row)
if (…) A else B in one slot     same place, different content (sample rows take turns: artwork / icon)
DropdownMenu(expanded = x) { }  a popup layer: folded into ▾n on the layer that opens it
role = / style = typography.X   visual hierarchy (title over supporting over label)
registered style + icon         ToolbarIcon → icon button, Navigation → chip (on when its swapTo child
                                is selected), Primary / Secondary / Danger → tones, ElementIcon glyphs
Scaffold(topBar / bottomBar /   named content regions: bottomBar docks above the navigation,
  floatingActionButton = { … }) floatingActionButton floats over the body
toolbarActions = listOf(…)      Screen-owned registered controls the shared toolbar realizes
```

The readers record only names (`region: { slot: 'bottomBar', call: 'Scaffold' }`, `popup`, `role`,
`textStyle`, element `icon` / `style`); the Lens maps a handful of well-known names to phone
regions. Values (titles, counts, artwork) are never read: a TEXT slot shows its path (`⟨title⟩`), plain
Compose `Text` without a Vex id shows as skeleton lines because it is not addressable.

Surface rules that follow from it:

```text
presented only       the Surface draws what the expression presents; latent content is another
                     expression (a picked latent element stays as a ghost)
depends folds        content behind a feature condition folds into one line:
                     [if] state.connectionState !is …Paired · Connection +3   (double-click: expose it)
placement            what a selected child realizes is drawn inside it (tabs in the Songs list);
                     a registration group whose members all land in one place goes there whole
                     (the tab row keeps its row); a feature choice that realizes one container and
                     bucket-registered controls draws them inside it (the mini player's Queue button);
                     a list with no registered identity is drawn inside its nearest registered element
otherwise            an `if` with no `else` can also not hold: that state is an expression, phrased as
                     the negation (Connection · if state.connectionState is …Paired — the connected app)
combine              Shift-click a chip to add its choices to what is shown (connected + rows); the
                     result is a custom expression both sides read like any other
```

## Partner circuits: project deeper source, not another descriptor

The Partner patient zero extends the Android source reader with one reusable relationship shape:

~~~text
VexPartner<Partner>
-> Signal<Partner>
-> Connection<Partner, Signal>
   -> Id<Partner>
   -> Decoder
   -> Observation
   -> Receiver

Receiver -> domain Store
Store Flow -> VexExecution.observe(exact source, live owner)
-> Family.observeStore(...)
-> Family State / DisplayState
~~~

The reader follows the actual custom-Screen `localEffect` call into the lab/runtime source, then follows
receiver **type + function** through wrapper layers. It does not choose a global function merely because
its name matches. That matters for source where a Screen lab and its child runtime both expose
`requestSyntheticPumpDelivery()`: the receiver coordinate is the relationship.

Fail-closed laws:

~~~text
localEffect with no source-proven deeper relationship
    -> HELD

ambiguous receiver/function ownership
    -> HELD

Partner name without VexPartner<same Partner> root
    -> HELD

Connection without source-proven Decoder / Observation / Receiver
    -> HELD

Family request that cannot prove Control / Effect / bound Method / Partner Connection
    -> HELD
~~~

The Lens keeps the existing four faces. Partner is additional **Depth**, not a new face:

~~~text
Behavior
    Family semantic meaning

Depth
    Method / VexExecution
    Partner Connection / Decoder / Receiver
    Partner / Signal / Observation / Store
    source-addressed maintained listener
    return to Family State
~~~

A feedback circuit remains projectable without inventing a cross-Family descriptor:

~~~text
CgmFamily.State
-> VexExecution.observe(cgmFamily::states)
-> source-authored convergence / lab rule
-> InsulinFamily.Control
-> InsulinFamily Act / Effect
-> Method
-> Pump Partner Connection
-> Partner acknowledgement

later, separately:
Pump Partner Signal
-> Observation / Receiver
-> Store
-> InsulinFamily State
~~~

The two execution identities stay distinct in the projection:

~~~text
maintained Flow listener
    exact Flow source + live execution owner

Family consequence
    Control kind (+ typed ResourceId only when earned)
    -> RelationshipId -> Job(s)
~~~

The current Partner-depth projector is proven against a bounded non-medical fixture and can also
project the source shape of the draft VexLife-Android Partner patient zero. Stable/Main Lens source
must **not** be repinned to an unaccepted Android PR merely to display the candidate; accepted source
currentness still governs the production Lens.

## What a new feature does to become projectable

```text
1. Give each meaningful container a registered identity (ScreenBlueprint) — already the habit.
2. Repeated runtime items: VexStableLazyColumn with listRef = the registered container's elementId.
3. Custom realization stays beneath Vex parents: VexComposeScope / Vex* cells with local ids.
4. Hand registered elements to Vex* cells (element = …), or to feature composables that take one.
5. Author a few meaningful Previews beside the Screen; name goldens with "Semantic visual case:".
6. Render examples with the production semantic root of their subject.
   → No VexBoard adapter for the feature. The Lens reads the relationships.
```

## Android alignment earned by this work

Measured with the same projector over the same registration (232 elements, 60 pathways unchanged):

```text
VexStream Songs       raw LazyColumn (held)      -> VexStableLazyColumn(listRef = SongsPanel)
VexStream Downloads   raw LazyColumn (held)      -> VexStableLazyColumn(listRef = DownloadsPanel)
                      empty content: none        -> declared
VexStableLazyColumn   no header slot             -> headerContent (in-list tabs), index-accounted
goldens (4)           subject held               -> bound (SongsPanel; screen.family-conversation)
VexStream held        8                          -> 6
ScreenCrawler docs    stale JSONL/manifest text  -> matches the accepted screenshot-only delivery
VexStreamCollectionCard  raw Column { Text ×4 }  -> VexComposeScope(collectionRow) › VexColumn("copy") ›
                         (not addressable)          VexText title / subtitle / count / offline (same shape
                                                    as the track card; explicit styles keep the pixels)
```

## What stays opaque or held, on purpose

```text
native views (MapLibre AndroidView)              opaque boundary, named
plain Compose inside rows (Events Card/Text)     opaque cells, counted
fixture contents, external-cause values          typed Kotlin, carried as source text
current runtime instance                         not observable here; never claimed
collection index/detail lists, filter chips      raw lists without list identity (next consumers)
ImageElement static realization                  one static consumer (shell brand mark): not earned
dynamic ref formats (Events / Conversation)      contract-bearing; migration not earned yet
```

<!-- [VXG RealForever][VEXWORK][VEXBOARD][SCREEN-LENS][PROJECTABILITY] -->