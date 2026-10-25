# Android Widget Foundation

`[VXG RealForever]`

## Human outcome

Give VexLife Android a reusable **home-screen App Widget foundation** so product teams can expose a
small, truthful slice of current product state without rebuilding domain ownership inside a widget.

VexStream playback is the first consumer because it already has mature Playback / Queue / Repeat
Behavior families and a real Media3 playback lifetime.

## Architecture

The foundation follows the same SCAE discipline as the rest of the app:

```text
product-owned State
        |
        v
widget-specific read-only Projection
        |
        v
Glance App Widget surface

human tap
        |
        v
bounded widget callback / Android entry
        |
        v
existing product Control
-> current State resolves Act
-> Behavior selects Effect
-> existing Connection/provider realizes it
```

Permanent boundaries:

```text
APP_WIDGET != PRODUCT_STATE_OWNER
APP_WIDGET != PLAYER
WIDGET_CALLBACK != EFFECT_OWNER
GLANCE_STATE != DOMAIN_STATE
WIDGET_SNAPSHOT_CACHE != CANONICAL_TRUTH
DEEP_LINK != NAVIGATION_TRUTH
```

The platform receiver lifecycle is Android-owned. The product meaning remains feature-owned.

## Android realization choice

Use **Jetpack Glance** as the Compose-first App Widget rendering layer. Android's current platform
guidance still places App Widgets on top of AppWidgetProvider / BroadcastReceiver mechanics; Glance
wraps that lifecycle with `GlanceAppWidgetReceiver` and supports direct Activity actions,
broadcast/service actions and bounded callbacks.

Do not start long work from a widget BroadcastReceiver. Widget callbacks should remain short and
delegate longer work to the rightful owner.

## Patient zero — VexStream playback

First useful widget:

```text
+-------------------------------+
| artwork | title              |
| if any  | artist             |
|         | [prev] [play] [next]|
+-------------------------------+
```

Behavior:

- artwork/content tap -> enter the registered VexStream Screen and open its full-player sheet;
- Previous / Next -> existing Queue Controls;
- Play / Pause -> existing Playback Control;
- enabled/disabled presentation comes from current Behavior projections;
- artwork is optional and must come from canonical VexStream metadata, never Android guesswork;
- idle/unavailable playback has an explicit projection rather than stale last-known controls.

## Dependencies

The widget patient zero depends on the VexStream **full-player sheet** because artwork/content tap
needs one truthful app entry that lands in the same Now Playing presentation a listener opens from
the mini-player.

The generic widget foundation does not need to own that app-specific route. The concrete VexStream
widget owns its receiver/Activity intent and maps that entry into existing VexRuntime navigation plus
VexStream presentation truth. The full-player sheet in turn consumes the already-integrated VexStream
artwork projection seam so both player and widget can render the same optional media-art identity.

That app-entry dependency is source-satisfied on Android main: Full Player PR #175 merged the
one-sheet destination as `92e18331e59b55993dc2479f86fa8418c0dfdf3b`, and Verify feedback PR #176
merged the exact A004-proven Track-latency correction as
`b6cd02f00f2d867068f7f760027d65583b567dd7`. Full Player remains in lived **Verify**, but the
widget does not need Verify -> Done to know where its content tap enters the app.

The reusable semantic widget substrate is now **COMPLETED accepted source**. SourceOwner A003 passed
on corrected head `ce6cbbefb2abd755811e5c7a066d7dd9fe6b6eff` / tree
`fca05801c869832317a751bce90c5c40937bf8d3`, fresh Independent Assurance was clear, and PR #174
merged as `082cc4689bc9b951621727b91cdcf0a63a8bbc2e`. The merge tree exactly equals the A003-proven
candidate tree.

That removed the patient-zero widget's final construction dependency. The concrete VexStream playback widget is now **RUNNING** after accepted source integration and
first lived launcher review.

Source/integration checkpoint:

```text
Android PR #178 = MERGED
merge = 31a99c92d2c7a5e15a5e187e044dd7be19440552
merge tree = 632461cb1974086dd4872b8aeff2c3b06c522606
SourceOwner A006 = PASS
fresh Independent Assurance = CLEAR
post-merge tree = exact proven tree

post-merge native A006 =
    outer PASS
    inner PASS
    debug APK assembled
    APK installed
    MainActivity launch Status = ok
    installed VexStreamPlaybackWidgetReceiver = PASS
```

The broad connected VexStream Journey host-loss seen during device proof is **not attributed to the
widget**. A same-device differential reproduced the same Compose-host-loss signature on the accepted
pre-widget base `c5c2014733572da22cb320ec32801f10bcbedf65` and on merged widget main, while the
widget-specific native install/launch/provider proof passed.

### Lived launcher review — 2026-10-25

Victor placed the widget on the physical Android launcher and supplied three lived screenshots. The
actual image bytes are retained privately in the Local Vex evidence library rather than committed to
this public repository; this README preserves only product-relevant meaning.

Stable private evidence identities:

```text
vexstream-widget-home-lived.png
sha256=f96a84375afd3804a706f532ae95731c2d3d05641a9fe761aecee465e244a3b5

vexstream-full-player-lived.png
sha256=dac704615d19231a315dd3e0869219216858206ab4d54cce9acc99afc4d0a8e1

widget-layout-reference.png
sha256=4f8c864f69b7a89540e7ac745bb997a60115830f3260ae60adfb5e52ba060c09
```

Observed PASS:

- the widget can be placed on the launcher;
- Previous / Play-Pause / Next taps produce real playback/queue effects;
- content entry reaches the existing VexStream Full Player rather than a second navigation/player
  truth.

Observed defects / remaining completion work:

1. **Live State refresh** — controls work, but the widget text/playback projection can remain stale
   after canonical playback State changes. Under SCAE the widget must re-project the newest current
   Playback/Queue/media truth whenever it changes; a successful callback is not enough if the remote
   surface continues showing an older item/state.
2. **Control geometry / touch usability** — the current transport cluster is too small/right-heavy.
   The desired structure is a larger horizontally-resizable row with the transport Controls centered
   as the main interaction cluster and touch targets large enough for reliable launcher use. The
   private reference screenshot is geometry guidance, not product truth to copy blindly.
3. **Artwork availability** — both the launcher widget and lived Full Player can still show the
   generic music placeholder. The widget must remain a read-only artwork consumer rather than an
   artwork fetcher; the owning VexStream metadata/cache path must make current artwork available when
   the source actually has it.

The parent widget Work remains `RUNNING`; machine/native proof did not imply lived acceptance.

New bounded child Work:

```text
work.android-widget-foundation.vexstream-playback-widget.state-refresh
work.android-widget-foundation.vexstream-playback-widget.layout-usability
```

Artwork convergence is cross-cutting VexStream product Work and is tracked under:

```text
work.vexstream.mobile-library.current-artwork-availability
```

Fresh-instance completion order should be:

```text
current main / current Work truth
-> repair live widget refresh
-> repair centered/larger control geometry
-> make rightful current artwork availability converge
-> focused/source proof
-> native install proof only where the changed claim requires it
-> Victor lived launcher re-review
-> only then complete the widget Work
```

## What this Project does not own

- VexStream catalog/media identity;
- VexStream Playback / Queue / Repeat behavior;
- Media3 player lifetime;
- full-player visual/product semantics;
- artwork acquisition or provider metadata;
- generic background sync.

Those remain with their existing product/platform owners.

<!-- [VXG RealForever][ANDROID][WIDGET][SCAE][GLANCE] -->
