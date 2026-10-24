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

- artwork/content tap -> open the registered VexStream full-player destination;
- Previous / Next -> existing Queue Controls;
- Play / Pause -> existing Playback Control;
- enabled/disabled presentation comes from current Behavior projections;
- artwork is optional and must come from canonical VexStream metadata, never Android guesswork;
- idle/unavailable playback has an explicit projection rather than stale last-known controls.

## Dependencies

The widget patient zero depends on the VexStream **full-player** destination because artwork/content
tap needs one truthful external navigation target.

The full player in turn depends on the VexStream artwork projection seam so both player and widget
can consume the same optional media-art identity.

## What this Project does not own

- VexStream catalog/media identity;
- VexStream Playback / Queue / Repeat behavior;
- Media3 player lifetime;
- full-player visual/product semantics;
- artwork acquisition or provider metadata;
- generic background sync.

Those remain with their existing product/platform owners.

<!-- [VXG RealForever][ANDROID][WIDGET][SCAE][GLANCE] -->
