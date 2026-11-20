# VexStream Music Projectability — Current Source Map

[VXG RealForever]

**Observed:** 2026-11-20

## Exact target coordinate

~~~text
repository
  vgong24/VexstreamMusic
  repo.vexstream-music

main
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
