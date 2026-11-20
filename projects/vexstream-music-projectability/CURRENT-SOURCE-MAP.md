# VexStream Music Projectability — Current Source Map

[VXG RealForever]

**Observed:** 2026-11-20

## Exact target coordinate

~~~text
repository
  vgong24/VexstreamMusic
  repo.vexstream-music

main
  03c1fe43ea90ccdc3be7c78193b209c15f3d5102

formation baseline
  2b745e0a3f5e63e05dfa0cf25b0fac729c00f0c8
~~~

## Classification vocabulary

- PROJECTABLE_AS_IS — current source already owns stable enough meaning/identity for projection.
- IDENTITY_ALIGNMENT — meaning is coherent but one visible/addressable coordinate overclaims or drifts.
- BOUNDED_SOURCE_REFACTOR — projection would otherwise have to invent ownership.
- HELD_AMBIGUOUS — current source does not yet earn one truthful projection claim.

No bounded source refactor is currently earned.

## Playback

### Semantic owner — PROJECTABLE_AS_IS

~~~text
v2/web/features/playback/behavior.js

VexStreamPlaybackFamily = vexstream.playback

PlaybackControl.PlayPause
PlaybackAct.Play / Pause
PlaybackEffect.RequestPlay / RequestPause / RestartCurrent
PlaybackState.noMedia / media / ended
~~~

The Family resolves Control meaning from current State. Queue meaning is explicitly kept outside
Playback.

### Provider realization — PROJECTABLE_AS_IS

~~~text
v2/web/features/playback/connection.js
~~~

HTMLMediaElement remains provider truth. The Connection:

- observes provider facts;
- re-resolves Control at activation time;
- maps lawful Effects to provider work;
- keeps pending request separate from provider acknowledgement;
- republishes semantic State/presentation.

This is a strong Depth/realization source without VexBoard inventing provider ownership.

### Presentation — PROJECTABLE_AS_IS

~~~text
v2/web/features/playback/presentation.js
~~~

The presentation projects the accepted Control/Act with stable TextRef and icon identity.

## Queue

### Semantic owner — PROJECTABLE_AS_IS

~~~text
v2/web/features/queue/behavior.js

VexStreamQueueFamily = vexstream.queue

QueueControl
  Previous
  Next
  Shuffle
  Repeat
  ClearAfterCurrent
~~~

Queue owns ordering, current position, Next/Previous legality, shuffle/repeat and clear-after-current.

### Connection/presentation — PROJECTABLE_AS_IS

~~~text
v2/web/features/queue/connection.js
v2/web/features/queue/presentation.js
~~~

The current browser can project Queue controls from source-owned State/Control relationships.

## Player composition — PROJECTABLE_AS_IS as composition

~~~text
v2/web/features/player/composition.js
~~~

The source explicitly says Player composition is:

~~~text
higher composition for human listening actions
!= fifth semantic Family
!= generic command bus
~~~

Examples:

~~~text
top-level Play with no current item
  -> Queue context
  -> load current media
  -> Playback

Next
  -> QueueControl.Next
  -> load newly current media
  -> Playback realization

Previous
  -> if elapsed > threshold: restart current Playback
  -> else QueueControl.Previous when lawful
  -> else restart current at Queue start
~~~

VexBoard must preserve that composition instead of flattening every visible transport control into one
Family.

## Browser identity — mostly PROJECTABLE_AS_IS

Current real browser:

~~~text
v2/web/index.html
~~~

Already carries stable identity:

~~~text
body
  data-vex-screen="vexstream.desktop.library"
  data-shell-current-view="home"

data-shell-view
data-shell-panel
data-vex-control
data-vex-action
data-text-ref
~~~

Transport controls currently expose:

~~~text
vexstream.playback.play-pause
vexstream.queue.previous
vexstream.queue.next
vexstream.queue.shuffle
vexstream.queue.repeat
vexstream.queue.clear-after-current
~~~

Dynamic track actions already use stable action identity such as:

~~~text
vexstream.player.play-now
vexstream.player.play-next
vexstream.player.add-queue
vexstream.explore.from-track
~~~

## Real event wiring — PROJECTABLE_AS_IS

Current app source:

~~~text
v2/web/app.js
~~~

Visible controls enter actual owners:

~~~text
Play/Pause
  -> player.activatePlayPause()

Next
  -> player.next()

Previous
  -> player.previous()

Shuffle
  -> player.toggleShuffle()

Repeat
  -> player.toggleRepeat()
~~~

setControl(...) also projects current TextRef / Act identity back onto browser controls.

## Identity seam 1 — current desktop Screen coordinate

**Classification:** IDENTITY_ALIGNMENT with exact target HELD.

Current sources disagree:

~~~text
real V4 browser root
  data-vex-screen="vexstream.desktop.library"

older Playback Journey
  screenRef="vexstream.desktop.playback"

older Player Journey
  screenRef="vexstream.desktop.player-practicum"

older playback browser regression
  expects vexstream.desktop.playback
~~~

app.js does not rewrite data-vex-screen at runtime.

Current ShellNavigation instead owns changing terrain inside a persistent shell:

~~~text
home
songs
albums
artists
playlists
deleted
discover

-> data-shell-view
-> data-shell-panel
~~~

The lived-product oracle requires recognizable Library shell/navigation, fixed Now Playing, Queue,
Playlists, Deleted, Discover and System terrain while keeping Playback/Queue as independent owners.

Therefore:

~~~text
DO NOT
  let a VexBoard adapter pick library/playback/player-practicum arbitrarily

DO
  reconcile the current persistent lived-shell Screen identity with the current Journey/evidence
  coordinates at the VexStream source owner

HELD
  the exact replacement screenRef until source earns it
~~~

This is identity alignment, not a product-shell redesign.

## Identity seam 2 — top-level Previous

**Classification:** IDENTITY_ALIGNMENT.

Current DOM says:

~~~text
data-vex-control="vexstream.queue.previous"
~~~

but the click enters:

~~~text
player.previous()
~~~

and Player composition can mean:

~~~text
restart current Playback
OR
Queue Previous
OR
restart current at queue start
~~~

Therefore the top-level Previous affordance cannot truthfully claim to be QueueControl.Previous in
every state.

The correction should expose its real composition identity at the rightful source without inventing a
new semantic Family. Exact identity form is held until target-source authoring.

## Play/Pause and Next are not the same defect

Play/Pause retains an underlying PlaybackControl and Player composition adds context/load realization
when required. Its presentation explicitly carries that relationship.

Next is QueueControl.Next whose realization legitimately crosses through Player composition to load the
newly current media.

These may remain projectable as current semantic controls plus composition/realization depth unless a
later lived projection disproves that reading.

## Current proof authority

The old playback practicum regression is not current product-shell authority.

Current higher-layer evidence includes:

~~~text
v2/tests/lived-shell-browser-smoke.mjs
v2/tests/player-browser-regression.py
v2/LIVED-PRODUCT-ORACLE.md
~~~

The current player browser regression explicitly exercises the V3-shaped V4 shell, ShellNavigation
terrain, real Player/Queue state, persistence and lived control relationships.

## Producer choice

HELD until both identity seams above are resolved or explicitly bounded.

The source map currently favors a small source-derived producer over architectural refactor, but it
does not yet prove whether native export or a bounded external adapter creates less recurring burden.

## Current conclusion

~~~text
V4 ARCHITECTURE
  clean enough for projection pressure

WHOLESALE REFACTOR
  not earned

FIRST NEEDED CHANGE
  identity alignment, not composition restructuring
~~~

<!-- [VXG RealForever][VEXSTREAM-MUSIC][PROJECTABILITY][CURRENT-SOURCE-MAP] -->


## Current execution result — 2026-11-20

The two identity seams are resolved in merged VexStream source:

~~~text
PR #19
merge ab08e326b1338bfc6e14ddf8a87c2accaac7417b

Playback Journey screenRef
Player Journey screenRef
  -> vexstream.desktop.library

fixed Previous
  -> data-vex-action="vexstream.player.previous"
  -> no unconditional QueueControl.Previous claim
~~~

Producer decision is also resolved:

~~~text
VexStream-native exporter
  v2/projection/vexboard-screen-lens.mjs
  -> v2/projection/vexboard-screen-lens.json

reason
  current JS semantic modules already own exact typed meaning
  external parsing would duplicate that meaning
  a multi-adapter plugin framework is not earned
~~~

Exporter PR #20 merged at:

~~~text
08b88a2f7b927015335b19a351280e2865b68a50
~~~

First exported Lens:

~~~text
Screen      1
elements    7
pathways    5
view        STATIC_HTML_CSS / scriptPolicy NONE
layout      FRAME
expression  Source defaults

Previous          DIRECT_REGISTRATION / Player composition
Play / Pause      SCAE_FAMILY / Playback
Next              SCAE_FAMILY / Queue
Shuffle           SCAE_FAMILY / Queue
Repeat            SCAE_FAMILY / Queue
~~~

The next dependent effect is persistent VexWork conformance + lived raw-git acceptance. No broader
VexStream feature expansion is admitted yet.


## Coverage audit result — default-visible closure

The persistent target-source audit now replaces screenshot discovery as the coverage detector.

~~~text
repo.vexstream-music:v2/projection/vexboard-projectability-audit.mjs
repo.vexstream-music:v2/projection/vexboard-projectability-audit.json
~~~

Current merged result at df0ffba4020b7ba7d5dff628ffabce9bf0a9163f:

~~~text
131 total interactives
32 default-visible
99 latent/hidden

default-visible blockers 0

MAPPED_PATHWAY       7
ADDRESSABLE_HELD    37

LATENT_WIRED_UNIDENTIFIED 56
LATENT_UNIDENTIFIED       29
VISIBLE_DISABLED_UNIDENTIFIED 2
~~~

The path to zero default-visible blockers was intentionally split:

1. Projection-only source relationships already present in the Product were exported directly.
2. Remaining runtime-wired controls received stable identity beside their rightful source owner.
3. v2/web/app.js remained unchanged.

No semantic Family was created merely to reduce the audit count. Addressable-held remains a truthful
state for controls whose deeper relationship is outside the current first-slice scope.


## Alternate-terrain proof — Library

Merged VexStream source at 8aeedc132a7984575449dd931c786c4a3597013f demonstrates that the persistent
Screen can project alternate Product terrain without adding Screens or running Product JavaScript.

~~~text
ShellNavigation source default
  Home

bounded alternate shell panel
  Library

gated Library mode selection
  Songs
  Albums
  Artists
~~~

The shared VexWork expression engine derives all four lived projection positions:
Source/Home, Library/Songs, Library/Albums, Library/Artists.

Nested selection/detail/editor states remain distinct audit terrain rather than being implicitly claimed
by the root Library expression.


## Dynamic presentation identity — current merged result

Current VexStream main now carries the first browser-native proof of the same presentation-continuity
law already exercised by Android Vex Compose, without importing Compose or creating a VexBoard-owned
runtime registry.

~~~text
PR #31
main 26a565d94a76860c4def02c6227286cd50caa531

portable mechanics
  v2/web/foundation/identity.js

Playlist identity owner
  v2/web/features/playlists/presentation.js
~~~

Identity classification:

~~~text
Playlist card
  durable playlist.id
  -> STABLE_INSTANCE

Playlist detail entry
  playlist.id + track ref + occurrence-within-playlist
  -> CURRENT_OCCURRENCE

nested presentation controls
  -> DERIVED_CHILD(parent runtime ref, local path)
~~~

`CURRENT_OCCURRENCE` is deliberate. Current Product source permits duplicate track refs and reorder but
does not own a durable Playlist-entry ID. The projection therefore does not turn current position into
durable domain truth.

The exported Lens now contains:

~~~text
79 static/addressable elements
13 semantic pathways
6 presence relationships
2 runtime population templates

template.vexstream.playlists.card
  RUNTIME_INSTANCE / STABLE_INSTANCE

template.vexstream.playlists.detail-entry
  RUNTIME_INSTANCE / CURRENT_OCCURRENCE
~~~

No live runtime Playlist IDs are present in the committed Lens. VexBoard receives formation contracts,
not a fabricated runtime snapshot.

Cross-consumer proof at the current architecture boundary:

~~~text
VexStream Product/exporter   42 / 42 PASS
VexWork shared consumer     113 / 113 PASS
Windows final-head artifact PASS
~~~

The generic Screen Lens contract now carries optional identity genealogy rather than Product-specific
reader behavior. Existing source-owned IDs remain valid as-is; the shared law is the derivation
relationship, not one required string namespace.

### Remaining trajectory

~~~text
lived acceptance          RUNNING
full-product Stable       NOT CLAIMED

remaining bounded pressure includes
  Deleted terrain
  nested Library states
  YouTube Import review
  other runtime populations when their identity/relationship enters admitted scope
~~~

Do not expand every latent row merely to exercise the new grammar. The next admitted Product state
should pressure the shared law only where a real lived relationship requires it.


## Deleted terrain + Trash runtime identity — current merged result

Current VexStream main now carries a second runtime-identity consumer under a different Product owner:

~~~text
PR #32
main 03c1fe43ea90ccdc3be7c78193b209c15f3d5102

ShellNavigation
  -> Deleted

Trash refresh
  vexstream.trash.refresh
  -> ADDRESSABLE_HELD

Trash item
  source-owned item.id
  -> RUNTIME_INSTANCE / STABLE_INSTANCE

Trash row child presentation
  selection
  restore
  purge
  -> DERIVED_CHILD
~~~

Product identity owner:

~~~text
v2/web/features/library/trash-presentation.js
~~~

The exported Lens now contains:

~~~text
81 static/addressable elements
13 semantic pathways
7 presence relationships
3 runtime population templates

Playlist card
  STABLE_INSTANCE / playlist.id

Playlist detail entry
  CURRENT_OCCURRENCE / playlist.id + entry.ref + occurrenceWithinPlaylist

Trash item
  STABLE_INSTANCE / item.id
~~~

Current audit remains blocker-free. The immediate Deleted terrain has one source-owned stable control:

~~~text
shell:deleted
  ADDRESSABLE_HELD 1

blocking []
~~~

Nested Trash states remain distinct rather than being silently claimed by top-level Deleted admission:

~~~text
trashSelectionBar
trashPurgeConfirm
purgeRecovery
~~~

Product proof:

~~~text
focused Deleted/runtime identity
  run 44771459261
  39 / 39 PASS
  Lens regeneration byte-for-byte
  audit regeneration byte-for-byte

normal Windows final-head artifact
  run 44771598394
  job 136410403078
  PASS
~~~

The updated shared-consumer predicate is now complete:

~~~text
initial generic consumer run
  44772309891
  113 PASS / 1 FAIL
  sole failure = stale VexStream element census expected 79, actual merged source 81
  new Trash generic-consumer test itself PASS

currentized generic consumer run
  44772457009
  114 / 114 PASS
  0 FAIL

exact merged-source binding
  source    03c1fe43ea90ccdc3be7c78193b209c15f3d5102
  elements  81
  pathways  13
  presence  7
  templates 3
~~~

No Product-specific Trash reader branch was added. The stale census was currentized from the prior
79-element source to the merged 81-element source and the same shared consumer passed unchanged in its
runtime identity logic.

The temporary proof workflow was removed after evidence consumption.

### Current remaining trajectory

~~~text
lived acceptance          RUNNING
full-product Stable       NOT CLAIMED

top-level Deleted terrain COMPLETED at this bounded slice

remaining bounded pressure includes
  Trash selection / permanent-delete confirmation / recovery
  nested Library states
  YouTube Import review
  other runtime populations only when their lived relationship enters admitted scope
~~~
