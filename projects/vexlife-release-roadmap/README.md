# VexLife Release Roadmap

`[VXG RealForever]`

## Human outcome

Make the VexLife timeline understandable at a glance:

```text
What should we care about now?
What is already done?
What is incomplete?
What is waiting on a real resource/capability?
What is later rather than forgotten?
```

This Project does **not** invent release dates. VexWork already owns the useful distinctions:

```text
WorkState      = what is true now
priorityClass  = relative attention
dependencyRefs = what cannot meaningfully advance without what
Project/Board  = one bounded human projection
```

Roadmap presentation should reuse those truths rather than creating a second status/timeline database.

## Relationship currentness companion

Cross-Project audit continuity is preserved in:

```text
projects/vexlife-release-roadmap/RELATIONSHIP-CURRENTNESS-COMPANION.md
```

It is a causal/resume projection only. The Workgraph remains lifecycle truth; target repositories remain source/runtime/proof owners. Use the companion to avoid broad portfolio rereading, then descend only into the exact implicated Project.

## Current roadmap

| Horizon | Work | State | Priority | Meaning |
|---|---|---|---|---|
| **Now** | Web/local VexLife v1 | `READY` | `IMMEDIATE` | The browser/local Product experience is the ordinary-human release direction. |
| **Done** | Native Mac container technical proof | `COMPLETED` | `HIGH` | The container/application architecture, DMG formation and lived trust boundary were proven far enough for the current purpose. |
| **Later / held** | Trusted native VexLife v2 | `WAITING_RESOURCE` | `NORMAL` | Resume convenient downloaded desktop distribution when legitimate Developer ID/notarization capability is available. |

This is ordering intent, **not a promised calendar**.

```text
PRIORITY != WORK_STATE
WAITING_RESOURCE != FAILED
COMPLETED_TECHNICAL_PROOF != SHIPPABLE_NATIVE_DISTRIBUTION
WEB_V1 != ABANDON_NATIVE_ARCHITECTURE
NATIVE_V2 != REWRITE_PRODUCT
ROADMAP != RELEASE_DATE_PROMISE
```

## Why the release direction changed

The native WebToApp work succeeded at the application/container level, then lived downloaded-artifact testing exposed the real distribution boundary.

A008 had already:

- formed and verified the Mac application + DMG;
- sealed the nested Product application;
- sealed the outer application;
- discovered and individually ad-hoc signed 40 embedded Mach-O items;
- retained the truthful release state `AD_HOC_SIGNATURE_NO_DEVELOPER_ID_NO_NOTARIZATION`.

The lived result still descended through Gatekeeper:

```text
VexLife starts
-> java blocked
-> Privacy & Security approval required
-> service cannot become source/PID-current while approval is held
-> libjli.dylib independently blocked
-> more internal approval depth is possible
```

That is not an ordinary-user release experience.

The conclusion is therefore:

```text
native application architecture = preserved / useful / proven
ad-hoc downloaded consumer distribution = not the v1 front door
trusted native distribution = future v2 capability
```

## v1 — web/local VexLife

The immediate product direction is the already-working web/local relationship:

```text
VexLife home / GitHub Pages
-> truthful setup/open path
-> browser presentation
-> local VexLife Product / Home / model/runtime
```

The exact release/site presentation still belongs to VexLife-Prod. This Project only records the roadmap/priority distinction.

A web presentation is not permission to download and launch arbitrary unsigned native helpers through a different route. Platform trust still applies wherever native executable material is introduced.

## v2 — trusted native VexLife

The native application work is **not thrown away**. It becomes the starting point for a later trusted distribution experience.

The missing predicate is not another ad-hoc signing experiment. The successor should be formed when legitimate distribution capability exists and should include, as actually required by the selected platform:

- rightful nested executable/code placement;
- Developer ID Application signing on macOS;
- Hardened Runtime + exact entitlements;
- secure timestamps;
- inside-out nested signing;
- Apple notarization and stapled ticket;
- a freshly downloaded lived first-run proof;
- later Windows parity through its own rightful signing/runtime boundary rather than assuming macOS mechanics transfer unchanged.

Funding or product income may make that investment sensible, but **revenue is not itself the technical dependency**. The actual work predicate is access to and stewardship of the required distribution-trust capability.

## Adjacent application-experience debt

Application-level settings/re-entry is separately owned by:

```text
VexWork #332
project.vexlife.application-level-settings
```

That Project preserves reopen != first run, application settings != feature settings, Home-management questions, and reset/uninstall semantics. It is deliberately not folded into this release roadmap.

## VexWork presentation rule

A person reading VexWork should not need to infer roadmap state from issue age or PR activity.

The portfolio Roadmap view should project:

```text
canonical Work Board lifecycle lanes
+ each Work item's source-owned priorityClass
+ Project identity
-> portfolio roadmap / queue view
```

Done/Archive remain visible. Waiting is not treated as failure. Priority remains visually separate from lifecycle state.

<!-- [VXG RealForever][VEXWORK][VEXLIFE][RELEASE-ROADMAP] -->
