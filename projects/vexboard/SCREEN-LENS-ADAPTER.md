# VexBoard — Screen Lens adapter

`[VXG RealForever]`

## Human question

> How does VexBoard stay current with VexLife-Android without a person or an AI re-reading Kotlin and
> hand-writing the lens every time the code changes?

The answer: generate the lens from source with one command. Keep only the knowledge the code cannot
say in a small overlay. Prove the committed lens is current.

```text
VexLife-Android source @ pinned commit
  -> adapter (src/core/vexboard-screen-lens-android-adapter.mjs)
  -> + overlay (human knowledge the code cannot say yet)
  -> projects/vexboard/lens/vexlife-android.screen-lens.json   (generated, never hand-edited)
  -> vexboard/lens.html
```

```text
GENERATED LENS != SOURCE AUTHORITY      VexLife-Android owns meaning; the lens projects it
OVERLAY        != SECOND SOURCE         small, named, and each entry should move into source
ADAPTER        != ANDROID CHANGE        reads only; nothing is written to VexLife-Android
```

## Run it

```bash
npm run lens:verify                                   # offline: committed lens matches adapter + overlay + generator
npm run lens:fetch                                    # sparse-clone the pinned commit, regenerate, write
node scripts/build-screen-lens.mjs --source ../VexLife-Android            # regenerate from a checkout
node scripts/build-screen-lens.mjs --source ../VexLife-Android --check    # fail if the committed lens is stale
node scripts/build-screen-lens.mjs --source ../VexLife-Android --commit <sha>   # re-pin to another commit
```

Every run checks the generated lens with `normalizeScreenLens` and `layoutCollisions` on every face
(with and without the doorway collapsed) and on the screen map. A projection that would overlap fails
the run instead of landing.

`.github/workflows/vexboard-screen-lens.yml` runs the same script on manual dispatch only. It checks
the committed lens against a commit, regenerates, shows the diff and uploads the result as an
artifact. It never pushes. A VexRelay host step, a fresh instance or Victor can all run the same
command. The generator itself needs no network; only `--fetch` clones.

`test/vexboard-screen-lens-generated.test.mjs` runs `--verify` inside `npm test`, so editing the
adapter or overlay without regenerating fails the suite.

## Why it can be automated: the architecture is regular

VexArchitecture makes the same questions show up in the same shapes, so one rule per shape covers
every screen.

| Source shape | What the adapter reads | Lens result |
|---|---|---|
| `AppScreens.primary` / `shared` | screen objects and placement | screens, PRIMARY / SHARED |
| `object X : AppScreenBlueprint(screenKey, titleRes)` | key, title, KDoc, `renderContent` override | screen ref, label, summary |
| `val A = toggleRef(id, labelRes, intent)` and other `*Ref` builders | declared ids, labels, intents | elements with exact ids |
| `layout { scrollableColumn("body") { card("x") { … } } }` | nesting and local ids | element tree; anonymous ids are `parent.child` |
| `res/values/strings.xml` | real text for `R.string.*` | visible labels |
| `AppShell.Elements` + `blueprint` | one chrome owner | chrome tree; slots from config |
| `AppActions.X = ActionKey("…")` | keys | action keys |
| `appAction(action = AppActions.X) { … }` anywhere | body, enclosing locals and parameters | registration step and its owners |
| `navigateTo` / `navigateBack` / `open` / `close` / `toggle` / `then` | typed intent chain | TYPED_NAVIGATION / TYPED_PRESENTATION templates |
| `isOpen(Screen.Sheet)) { View(repository = …) }` | what a sheet renders and reads | renderer step + Depth store |
| `context.closure` → `closure = { fn(…) }` → `fun fn` → `XFamily.Control.Y(` | the hop through a captured closure | Family bond (no annotation needed) |
| `XFamily`: State enum, sealed Parameter / Control / Effect / DisplayState, `object Act { class M(store: S) }`, `begin<Approach>`, `observe*Store`, `XFamilyProvider` | the Family vocabulary | one SCAE + Depth template |

The SCAE template is the VexArchitecture path itself, so it is the same for every Family:

```text
Behavior  intent → runtime dispatch → registration → captured closure
          → Control.Y(Parameter) → act(CURRENT State, Control) → admitted State
          → Begin(Effect, Approach) → DisplayState → presentation
Depth     Act.Method.M(store, parameter) → launchWith → VexExecution custody (Approach)
          → Store.op → concrete Store → VexMethod.Result → observe*Store → back into State
beside    VexLogger facts · XFamilyProvider(dependencies)
```

A new Family reached from a control appears with no change to VexWork. So does a new screen added to
`AppScreens`, a new control, or a new registration.

## What the code cannot say yet: the overlay

`projects/vexboard/lens/vexlife-android.lens-overlay.json` holds the small set of things the source does
not express:

```text
notes            8 attached notes (the drift note, "doorway only", "beside the path", ...)
summaries        Debug Menu's screen summary, two sharper step summaries
ThemeMode extra  the === currentness fence and the VexLifeTheme render step
labels           "Choose Light / Dark" for the ThemeMode pathway
```

Rules:

- Every overlay ref must exist in the generated lens, or the run fails. A renamed step cannot leave a
  dangling note behind.
- An overlay entry is a TODO for source. When VexLife-Android admits KDoc conventions or `@VexLens`
  (see `SCREEN-LENS.md`), move the entry there and delete it here.

## What the adapter caught that hand projection missed

Hand projection was based partly on the Live Demonstration page, pinned at an older commit
(`4d357c48`). At `305a09e` the Method returns `VexMethod.Result.Success(…)`, after VexLife-Android PR
#211 bound Result to Method invocation. The generated lens shows that. The hand file still said
`ThemeModeStore.Result.Success(observedState)`. That is the drift a generator removes.

## Coverage today

At the accepted source pin `305a09eac1fabebcf2241bd207386950f41121f2`:

```text
10 screens · 241 elements · 44 pathways · 2 Family bonds · 0 held · 0 unknown layout calls

ThemeMode
  captured-closure / registration traversal

VexStream Playback
  typed BEHAVIOR_PORT traversal
  Experience.activate(Control)
  -> VexPort / VexPortFlow Family coordinates
  -> Behavior
  -> concrete Connection / provider
  -> observation / reconciliation
  -> returned projection
```

Playback is evidence that runtime-connected Families can be projected when their source shape is
explicit enough. It is **not** a generic rule that every runtime connection has the same architecture.

Maps remains intentionally unbonded by this adapter because its Process/Session + Relay/convergence
entry shape is materially different and must earn a separate traversal rather than inherit Playback's
shape by analogy.

## Extending it

```text
new layout builder in the element DSL        add it to LAYOUT_KINDS / REF_KINDS
new intent op                                nothing; typed template handles op(arg) chains
new Family reached through a closure         nothing
same earned BEHAVIOR_PORT source shape       reuse the accepted Behavior-port rule
different runtime/convergence architecture   earn a new rule from that source shape
another repository (VexLife-Prod, web)       new bounded adapter/export + same Lens consumer contract
```

## Upgrade path on the Android side

The Node adapter reads text, which is good enough because the code is regular. The stronger form is
for VexLife-Android to export its own projection from the real registry:

```text
UIBlueprintRegistry.elementsForScreen(screen)   exact element tree, no text parsing
AppScreens.appActionRegistrations(context)      exact registration ownership
KDoc on Families, Controls, Effects             summaries (most of the overlay)
@VexLens / @VexLensEdge (proposal)              only for hops the registry cannot see
```

A JVM test in VexLife-Android could write `vexlife-android.screen-lens.json` at build time. This
adapter then only checks and lays it out. That move is VexLife-Android's to make.

<!-- [VXG RealForever][VEXWORK][VEXBOARD][SCREEN-LENS][ADAPTER] -->
