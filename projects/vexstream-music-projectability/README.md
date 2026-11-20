# VexStream Music Projectability

[VXG RealForever]

## Human outcome

Prove that the accepted VexBoard Projection Consolidation foundation scales to a materially different
existing product without making that product VexBoard-shaped.

The first pressure is current VexStream Music Desktop V4:

~~~text
repo.vexstream-music
vgong24/VexstreamMusic
main = 2b745e0a3f5e63e05dfa0cf25b0fac729c00f0c8
~~~

The question is deliberately falsifiable:

> Can the current V4 Playback / Queue / lived-browser relationship become truthfully projectable mostly
> by preserving and completing stable identity it already owns, while the generic VexBoard reader stays
> unchanged?

## Governing posture

Read the target from its own source first:

~~~text
repo.vexstream-music:v2/README.md
repo.vexstream-music:v2/LIVED-PRODUCT-ORACLE.md
repo.vexstream-music:v2/architecture/README.md
repo.vexstream-music:v2/web/index.html
repo.vexstream-music:v2/web/app.js
~~~

Then apply:

~~~text
projects/vexboard/PROJECTING-AN-EXISTING-PROJECT.md
projects/vexboard/SCREEN-LENS.md
projects/vexboard-projection-consolidation/README.md
~~~

Permanent boundary:

~~~text
PROJECTABLE != VEXBOARD-SHAPED SOURCE
IDENTITY_ALIGNMENT != PRODUCT REDESIGN
VEXBOARD PROJECTION != VEXSTREAM SOURCE AUTHORITY
~~~

V3 lived-product geometry/screens remain VexStream's oracle where the current V4 source says so.
Question-owned V4 Playback / Queue / Library / Shell owners remain the implementation/refactor substrate.
VexBoard must not resolve tension between those sources by choosing whichever coordinate is easiest to
parse.

## Current classification

The initial live map is in:

~~~text
projects/vexstream-music-projectability/CURRENT-SOURCE-MAP.md
~~~

Current result:

~~~text
PROJECTABLE_AS_IS
  Playback semantic Family / Control / Act / Effect / State
  Queue semantic Family / Control / Act / Effect / State
  Playback + Queue provider/connection boundaries
  Player composition
  stable data-vex-control / data-vex-action / data-text-ref identities
  ShellView / data-shell-view / data-shell-panel relationships
  real event wiring into current owners

IDENTITY_ALIGNMENT
  current persistent desktop screen coordinate
  top-level Previous affordance

HELD_AMBIGUOUS
  exact replacement screenRef until current lived shell identity is earned
  producer location until the source map is complete

NOT_EARNED
  wholesale V4 refactor
  generic VexStream-specific reader fork
  new semantic Family merely for projection
~~~

## First slice

Playback + its immediate Queue / Player / browser realization is the patient zero.

Why this slice:

- it already has explicit semantic identity;
- its visible controls already carry stable product identity;
- it crosses multiple rightful owners without collapsing them;
- current browser proof already exercises the real V3-shaped V4 shell;
- it contains two useful projectability disagreements that can falsify identity-first adoption.

Do not expand to Library, Playlists, Trash, Explore or Imports merely to make the first Lens look rich.

## Producer decision is held

Do not choose a native VexStream exporter or a VexWork adapter for symmetry.

Choose only after the identity map completes:

~~~text
native exporter
  if VexStream can emit the bounded Lens from existing typed source with lower recurring burden

bounded VexWork adapter
  if exact public source already exposes enough stable relationships and native export would add
  product maintenance without owning new truth
~~~

Either producer must feed the same producer-neutral conformance seam accepted by Projection
Consolidation.

## Target-repository boundary

This VexWork Project may map and prototype projection over public source.

Any mutation in vgong24/VexstreamMusic requires its own target-repository authoring branch / PR and
must follow VexStream's own source/oracle conventions. VexWork authority does not grant VexStream
source authority.

## Fresh-instance route

Read in this order:

~~~text
projects/vexstream-music-projectability/README.md
projects/vexstream-music-projectability/CURRENT-SOURCE-MAP.md
projects/vexboard/PROJECTING-AN-EXISTING-PROJECT.md

then current target source:
  repo.vexstream-music:v2/README.md
  repo.vexstream-music:v2/LIVED-PRODUCT-ORACLE.md
  repo.vexstream-music:v2/architecture/README.md
  repo.vexstream-music:v2/web/features/playback/behavior.js
  repo.vexstream-music:v2/web/features/queue/behavior.js
  repo.vexstream-music:v2/web/features/player/composition.js
  repo.vexstream-music:v2/web/index.html
  repo.vexstream-music:v2/web/app.js
~~~

Re-ground VexStream main before source effects.

<!-- [VXG RealForever][VEXBOARD][VEXSTREAM-MUSIC][PROJECTABILITY] -->


## Execution update — native producer proven

Identity alignment landed in VexStream Music PR #19 and the bounded native exporter landed in PR #20.

~~~text
VexStream main
08b88a2f7b927015335b19a351280e2865b68a50

identity
  current shell = vexstream.desktop.library
  Previous = vexstream.player.previous composition action

native export
  v2/projection/vexboard-screen-lens.mjs
  v2/projection/vexboard-screen-lens.json
~~~

The producer decision is now settled: VexStream-native export is smaller than teaching the Android-
specific VexWork source parser to understand VexStream JS semantics.

Target proof:

~~~text
28 / 28 VexStream semantic + exporter tests PASS
exact exported Lens -> accepted VexWork normalizer/expression/realization/frame seam PASS
~~~

VexWork carries the merged output as a candidate only until lived acceptance.


## First lived projection correction — relationship perception

The first VexStream raw-git candidate was technically conformant but failed the human perception
threshold.

Victor's observation:

> "it looks like a screenshot than a relatinoship graph"

The concrete failure was not SOURCE_VIEW itself. Selecting the V3-shaped V4 shell container left the
Behavior/Depth side blank because that region has no single pathwayRef, even though it contains five
mapped child relationships.

The reader now preserves the container relationship:

~~~text
selected mapped container
-> descendant mapped controls
-> distinct child pathwayRefs
-> aggregate Behavior / Depth graph
-> node selection descends to the exact child control/pathway
~~~

No synthetic Shell Family was introduced.

Revised shared proof:

~~~text
100 tests
100 PASS
0 FAIL
~~~

This correction belongs to the generic Screen Lens reader and is documented in
projects/vexboard/SCREEN-LENS.md.


## Second lived projection correction — stable control coverage

The relationship-first container view made the shell legible, then lived review exposed a second
coverage defect:

> phone and System status were visibly working Product controls but were not mapped.

The correction is source-first:

~~~text
VexStream PR #21
merge 0c5657c70ef0f886dcb23cf4478d7bf2c89660de

phone
  vexstream.phone.connection.open
  -> full Phone Connection pathway

System bell
  vexstream.system.status.open
  -> full read-only System status pathway
~~~

The native exporter now also requires every source-owned data-vex-control/data-vex-action identity in
the bounded shell to become a Lens element. Stable identities outside the admitted first-slice depth
remain selectable without a pathwayRef instead of silently disappearing as Product pixels.

Target proof:

~~~text
41 / 41 PASS
elements          16
admitted pathways  7
contained paths    7
~~~

This is now a general projectability rule in projects/vexboard/PROJECTING-AN-EXISTING-PROJECT.md.


## Audit-driven default-visible coverage closure

The projectability audit is now persistent in VexStream source:

~~~text
v2/projection/vexboard-projectability-audit.mjs
v2/projection/vexboard-projectability-audit.json
v2/tests/vexboard-projectability-audit.test.mjs
~~~

It inventories every static interactive affordance, source relationship identity, direct app.js event
binding and Screen Lens mapping before lived review.

Progress:

~~~text
initial census
131 total interactive affordances
32 default-visible
99 latent

after phone/System + source-relationship coverage
30 blockers -> 12 blockers

after behavior-neutral runtime identity alignment
12 blockers -> 0 blockers
~~~

Merged target source:

~~~text
PR #22  persistent audit
367f5523221f11bfb443809bb68f40a09d10a691

PR #23  projection-only existing source relationships
584bb31186d55860146a15eb873372fceeb8d8b3

PR #24  final default-visible runtime identity alignment
df0ffba4020b7ba7d5dff628ffabce9bf0a9163f
~~~

PR #24 changed source identity metadata/constants and generated projection artifacts; v2/web/app.js was
not changed.

Proof:

~~~text
rightful-owner + identity/export/audit tests
79 / 79 PASS

strict default-visible audit
0 blockers

current Lens
42 addressable elements
7 admitted pathways
37 addressable-held elements
~~~

The 99 latent/hidden interactives remain explicitly inventoried:

~~~text
56 LATENT_WIRED_UNIDENTIFIED
29 LATENT_UNIDENTIFIED
2  VISIBLE_DISABLED_UNIDENTIFIED
~~~

They are not invisible debt. They are outside the current default-visible lived slice and must be
classified when their alternate terrain/expression enters admitted projection scope.

Do not interpret zero default blockers as full-product Stable acceptance.


## First alternate terrain — Library expressions

The terrain-aware audit made Library the first coherent alternate slice rather than treating its hidden
controls as one flat ID backlog.

Merged target source:

~~~text
VexStream PR #26
8aeedc132a7984575449dd931c786c4a3597013f
~~~

Projection shape:

~~~text
Source
  Home

Selection
  Library terrain
    Songs default
    Albums
    Artists
~~~

This uses the same vexboard.screen-lens/v1 SELECTION + stateBindings grammar already accepted for
VexLife-Prod.

~~~text
Product JavaScript  NONE
VexStream app.js    unchanged
semantic pathways   still 7
Lens elements       50
~~~

The exporter derives structural anchors only inside the inert Product copy. Browser-local expression
state controls hidden, data-shell-current-view, data-library-terrain, and Library mode aria-pressed.

Dynamic catalog rows/groups are not fabricated.

The refined audit now separates nested Library presentation owners:

~~~text
shell:library                              7
shell:library/hidden:#librarySelectionBar  9
shell:library/hidden:#songLayoutPanel      7
shell:library/hidden:#bulkDisplayEditor    9
shell:library/hidden:#libraryGroupDetail   5
artist nested states                       2
~~~

Those nested states remain separately held for later admission.


## Discover terrain expression expansion

Merged VexStream source now carries the next coherent alternate terrain:

~~~text
PR #27
a9bfca803f8c7962094625ed1244d65e1a991d39
  immediate Library expression controls identity-complete

PR #28
aa4213bf276297bef7fec51e3803b42ec4347bd5
  Shell -> Discover
  Discover -> This PC / YouTube / Explore
~~~

The admission rule is now explicit:

~~~text
expression admitted
-> controls immediately visible in that terrain are at least addressable
-> deeper nested sub-states remain separate audit debt
~~~

Current merged Lens:

~~~text
67 elements
7 semantic pathways
3 realization selections
9 static state bindings
7 expressions via the generic VexWork engine
Product JavaScript NONE
audit blockers 0
~~~

Immediate Discover coverage is complete at the terrain boundary:

~~~text
mode tabs   3 / 3
This PC     5 / 5
YouTube     3 / 3
Explore     2 / 2
~~~

The hidden YouTube Import review form remains explicitly separate nested debt. Playlists and Deleted
remain later Shell terrains.


## Playlists list/create terrain expansion

Merged VexStream source now admits the top-level Playlists terrain:

~~~text
PR #29
674e8cabf10fee335518bbc3c08080d21726e96b

Shell -> Playlists
~~~

Immediate source identity:

~~~text
vexstream.playlists.create.name
vexstream.playlists.create
~~~

The existing createPlaylist handler is unchanged.

Current merged Lens:

~~~text
70 elements
7 semantic pathways
3 realization relationships
10 static state bindings
8 expressions via the generic VexWork engine
audit blockers 0
~~~

Selected-playlist detail remains a distinct nested state:

~~~text
shell:playlists/hidden:#playlistDetail
7 interactive affordances
~~~

That nested state is the next bounded Playlist pressure rather than being silently collapsed into the
overview/create expression.


## Selected Playlist detail relationship expansion

Merged VexStream source now projects the selected Playlist detail as a nested presentation:

~~~text
PR #30
6b88dfaa570a04778addd2d85e484d4368881eb8

Playlists overview
  detail CLOSED

PlaylistNavigation.openPlaylistID != ""
  detail OPEN
~~~

The presentation does not enumerate dynamic Playlist IDs.

Fixed detail ownership:

~~~text
Back          -> PlaylistNavigation
Name/Rename   -> Playlist client
Play/Shuffle  -> Player composition
Add songs     -> Playlist target + Library selection + Shell navigation
Delete        -> Playlist client
~~~

Current merged Lens:

~~~text
79 elements
13 pathways
4 realization relationships
12 static state bindings
9 expressions
audit blockers 0
selected detail 7 / 7 MAPPED_PATHWAY
~~~

The exporter also now preserves source interaction type:

~~~text
input/select/textarea -> FIELD
button/summary        -> BUTTON
~~~

This nested-state pressure earned one generic VexWork refinement: container aggregate graphs are now
expression-aware. Hidden/latent detail pathways do not appear in the shell aggregate until the detail
expression presents them.


## Portable dynamic identity — Playlist runtime populations

The selected-Playlist pressure exposed the next scalability question: static controls could already be
addressed, but runtime rows still needed one formation law that did not belong to Compose, the DOM, or
VexBoard itself.

Merged VexStream source now owns that law:

~~~text
PR #31
26a565d94a76860c4def02c6227286cd50caa531

v2/web/foundation/identity.js
  portable parent/child + runtime-instance formation mechanics

v2/web/features/playlists/presentation.js
  Playlist-owned presentation identity contract
~~~

The relationship is intentionally smaller than one universal naming scheme:

~~~text
SOURCE_OWNED_STABLE_REF
  remains source-owned

RUNTIME_INSTANCE
  stable base + source-owned instance parts

DERIVED_CHILD
  established presentation parent + normalized local path

STABLE_INSTANCE
  source identity survives reorder / reprojection

CURRENT_OCCURRENCE
  truthful current occurrence only when source owns no stronger durable occurrence ID
~~~

Current VexStream pressure proves both cases:

~~~text
Playlist card
  playlist.id
  -> STABLE_INSTANCE

Playlist detail entry
  playlist.id + entry.ref + occurrenceWithinPlaylist
  -> CURRENT_OCCURRENCE

nested row/card controls
  -> DERIVED_CHILD of the runtime parent
~~~

Duplicate track refs and reorder are why Playlist entries do not overclaim durable identity. If Product
source later earns a durable per-entry ID, that stronger owner may replace the current-occurrence
coordinate without changing the Screen Lens relationship class.

The native exporter projects two POPULATION/template relationships and their formation contracts. It
does not serialize current live Playlist instances, and Product JavaScript remains excluded from the
inert SOURCE_VIEW.

Proof:

~~~text
VexStream focused Product/exporter proof
  run 44768855579
  42 / 42 PASS
  committed Lens regenerated byte-for-byte

normal Windows Product artifact on final PR head
  job 136403391941
  PASS
  executable build/qualification + embedded icon verification

generic VexWork consumer proof
  run 44769392182
  113 / 113 PASS
  Android + VexLife-Prod + VexStream + neutral subject
  no VexStream-specific reader branch
  no fabricated live .dynamic.utf8hex instance elements
~~~

The shared Screen Lens now validates optional identity genealogy when a producer claims it. Existing
source-owned stable refs need no wrapper or migration. `element.*`, `pathway.*`, `presence.*` and
Product-native identities remain different relationships; the portable law only makes derivation and
runtime occurrence continuity mechanically comparable across platforms.

Full VexStream Stable acceptance is still not claimed. `lived-acceptance` remains RUNNING; remaining
terrains and nested states continue as separate bounded product pressure rather than being collapsed
into this identity milestone.


## Deleted terrain — second runtime identity owner

The portable identity law was immediately pressured against a different Product owner instead of being
left as a Playlist-shaped abstraction.

Merged VexStream source:

~~~text
PR #32
03c1fe43ea90ccdc3be7c78193b209c15f3d5102

Shell -> Deleted

Trash refresh
  vexstream.trash.refresh
  ADDRESSABLE_HELD

Trash item
  item.id
  -> RUNTIME_INSTANCE / STABLE_INSTANCE

Trash row children
  selection
  restore
  purge
  -> DERIVED_CHILD
~~~

`v2/web/features/library/trash-presentation.js` owns the Product-side repeated-presentation identity.
The Lens projects `presence.vexstream.trash.items` + `template.vexstream.trash.item`; it does not
serialize current Trash rows.

Nested Trash states remain separate and held:

~~~text
trashSelectionBar
trashPurgeConfirm
purgeRecovery
~~~

Focused Product proof:

~~~text
run 44771459261
39 / 39 PASS
Screen Lens regenerated byte-for-byte
projectability audit regenerated byte-for-byte
existing Deleted refresh handler unchanged
~~~

Normal final-head Windows artifact proof also passed on PR #32 before merge.

This is the important scalability result:

~~~text
Playlist card -> playlist.id -> STABLE_INSTANCE
Trash row     -> item.id     -> STABLE_INSTANCE

different domain owner
different UI population
same portable Screen Lens genealogy
no Product-specific VexBoard reader branch
~~~

Full-product Stable acceptance remains held. Deleted top-level terrain is now admitted; its nested
selection/permanent-delete/recovery presentations remain separate future lived pressure.
