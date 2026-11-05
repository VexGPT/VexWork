# VexBoard — projects and builds

`[VXG RealForever]`

## Human question

> As more projects arrive (VexLife Android today, VexLife Prod next, VexBoard itself), where do I start?
> And when main moves, how do I keep a stable view and a current view side by side, and still open
> any older commit when I need to debug?

The answer has three parts.

- **One entry.** `vexboard/projects.html` lists every project, and `vexboard/` opens it.
- **One catalog.** `projects/vexboard/lens/catalog.json` records which subjects VexBoard can project or relate and where each one's
  **Stable** and **Main** builds point. It does not replace the VexWork Project Registry.
- **One header.** In the Screen Lens, a project menu and a `Stable · Main · Commit…` switch change what you
  are looking at in place.

```text
vexboard/                 -> projects.html       the front door (D26)
  project card            -> lens.html?subject=vexlife-android[&build=main | &commit=<sha>]
  related board           -> ./?board=<boardRef>  the earlier canvas, unchanged (D24)
  earlier canvas trials   -> ./?board=…  ./?create=draft  ./?canvas=home
```

## Where the pointers live

```text
projects/vexboard/lens/catalog.json        which projects, which builds, which commit each build points at
projects/vexboard/lens/<slug>.lens-adapter.json   how a project's source is read (repository.commit mirrors Stable)
projects/vexboard/lens/<slug>.screen-lens.json    Stable's generated lens (Main shares it while both point at one commit)
projects/vexboard/lens/<slug>.main.screen-lens.json   Main's own lens, only once Main has moved past Stable
```

To answer "what is Stable for VexLife Android?", read
`catalog.json → subjects[slug=vexlife-android].lens.builds[buildRef=stable].commit`. To check every
pointer against its file, run `npm run lens:verify`. Both are offline.

```text
STABLE  != NEWEST     Stable is accepted; it moves only when Main is promoted
MAIN    != ACCEPTED   Main is the newest projected commit on the default branch
COMMIT  != BUILD      any other commit is projected in your browser and never saved
```

## Moving the pointers

```bash
npm run lens:verify    # every build matches its pointer, adapter, overlay and generator
npm run lens:main      # Main -> newest commit on its branch (git ls-remote), regenerate Main
node scripts/build-screen-lens.mjs --build main --fetch --commit <sha|branch|tag>   # Main -> a chosen commit
npm run lens:promote -- --evidence github.pull.vexwork.<n>  # Stable -> Main with acceptance evidence; folds the two lens files back into one
```

A typical cycle:

```text
VexLife-Android main moves
-> npm run lens:main               Main gets its own lens file; Stable is untouched
-> open lens.html?build=main       the "N differences vs Stable" chip and panel show what changed in meaning
-> review / lived check
-> npm run lens:promote -- --evidence <acceptance-ref>
                                      Stable takes Main's commit only with acceptance evidence
-> npm run lens:verify, commit catalog + adapter + lens, open a PR
```

The workflow `.github/workflows/vexboard-screen-lens.yml` still runs only on manual dispatch and never
pushes (D22). A VexRelay host step can run the same npm scripts.

## Any commit, in the browser

`Commit…` in the lens header, and **Any commit** on the projects page, accept the same input forms: a SHA,
a branch, a tag or a pasted GitHub commit/tree link for the selected subject's repository. A link to a
different repository is rejected rather than reinterpreted as a local ref. The page then:

1. resolves the name with one GitHub API call;
2. lists the tree with a second call;
3. downloads exactly the files `adapterReadPlan` names from `raw.githubusercontent.com`;
4. runs the same pure adapter the script runs.

This is **historical source projected with the current Lens understanding**. Existing-ref labels, summaries
and notes may be applied leniently, but current overlay nodes/edge rewrites are not injected into a historical
revision unless the source-derived projection already carries the referenced structure. Skipped entries are
named in a toast and in the lens notes. The address bar pins the full resolved SHA, so a copied link or brief
reopens the same source commit.

There are limits:

- **Rate limit.** Without signing in, GitHub allows about 60 API calls an hour from one browser, and
  each new commit costs 2. Stable and Main cost nothing.
- **Older commits.** A commit older than the app structure the adapter understands fails with a plain
  explanation, and the lens falls back to Stable.
- **Public repositories only.** A private repository would need a token, which the page never asks for.

## Differences from Stable

On Main or on a commit, the header shows how the view differs from Stable. The comparison is by stable
identity (D25), with step detail (D30):

- **No projected change.** The header says "Same meaning as Stable". The commit moved, but nothing the
  lens projects changed.
- **Changes.** The header shows "N differences vs Stable", which opens a panel:
  - **Pathways.** Each changed step is listed with what it says here and what Stable says, for example
    `ThemeModeStore.Result here; Stable has VexMethod.Result`.
  - **Controls and screens.** Each is marked as differs, only here, or only in Stable.
  - **Show.** Jumps to the control and step.
  - **Copy as text.** Hands the same list to an AI as Markdown.
- **Marks on the board.** Changed controls, steps and screen chips get a dashed rose ring. It sits in the
  gap around a control and never covers one (D23).

## Adding a project

1. **Add a subject.** Add an entry to `catalog.json` with `slug`, `label`, `summary`, `repositoryRef`,
   `repository.url`, `vexworkProjectRefs` and `boards`. Without a lens, set
   `lens: { status: "NOT_BUILT", reason, next }`. It then shows on the projects page and in the project
   menu, with its live branch head and its boards.
2. **Give it a lens.** Write an adapter that produces the same `vexboard.screen-lens/v1` schema. For
   VexLife Prod, an export from its `VexUiBlueprint` is preferred over parsing text.
3. **Register its builds.** Add `lens: { status: "GENERATED", adapter, overlay, anyCommit, builds: [stable, main] }`.
4. **Verify.** `npm run lens:verify` covers the new project automatically.

`anyCommit` is true only for a project whose adapter is pure and whose source is public.

## Authority boundary

The Projects page is a human-facing entry over Lens subjects. VexWork remains the owner of Project,
Work, lifecycle and authority truth. Useful future ideas stay in their rightful architecture/Work sources;
this page does not maintain a second proposal lifecycle.

```text
LENS SUBJECT CATALOG
  -> Lens availability
  -> Stable/Main projection pointers
  -> adapter/lens realization coordinates

LENS SUBJECT CATALOG
  != VEXWORK PROJECT REGISTRY
```

<!-- [VXG RealForever][VEXWORK][VEXBOARD][PROJECTS-AND-BUILDS] -->
