# Localization Architecture

`[VXG RealForever]`

## Human outcome

Build one durable cross-Product localization architecture that lets a human or AI move in either direction:

```text
Product / Screen / Element
        -> text slot
        -> source string identity
        -> locale variants

and

string / value / locale / semantic group
        -> where used
        -> Product / Screen / Element occurrences
```

without making an English value, a generated CSV, or VexBoard itself the owner of Product localization truth.

This Project exists because the Screen Lens trajectory has now made Android, VexLife Prod, and VexStream simultaneously inspectable, and the next pressure is localization: extract exact string relationships from each rightful Product source, normalize them into one relational read model, analyze likely duplication safely, and eventually project that model through VexBoard.

## Relationship to existing VexSite Localization

This is **not** a replacement scheduler for `project.vextreme.vexsite-localization`.

Vextreme already owns a real localization pipeline and ongoing localization capability:

```text
data/strings/source/*
  -> check
  -> compile
  -> export/import
  -> generated locale bundles
  -> runtime/page localization
```

That existing Project remains the current Vextreme localization program/history owner.

Localization Architecture owns a different question:

> How can VexBoard and VexWork understand localization relationships consistently across materially different Products and platforms without duplicating their source authority?

The existing VexSite implementation is therefore a source/patient, not something this Project reimplements.

## Current architecture

The durable relational shape is:

```text
ELEMENT
  -> TEXT BINDING / SLOT
  -> SOURCE STRING
  -> LOCALE VARIANT

SOURCE STRING
  -> OCCURRENCE(S)
  -> PRODUCT / SCREEN / ELEMENT

SOURCE STRING
  -> candidate-equivalent-to
  -> CANDIDATE GROUP
  -> optional accepted semantic group
```

Stable identity and mutable analysis remain distinct:

```text
elementRef       = stable manifestation identity
textBindingRef   = stable relationship/slot identity
sourceStringRef  = Product-owned string identity
localeVariantRef = Product-owned/localized variant identity

candidateGroup   = derived analysis; may split/reform
semanticGroup    = optional accepted convergence; never inferred from English value alone
```

The human experience may pivot by Element, String, Value, Locale, Project or semantic group, but those are indexes/views over the same relationships rather than separate truth stores.

## Current trajectory

### A0 — relational localization architecture — COMPLETED in this formation

Preserve the common relationship model, authority boundaries, projection diagrams, CSV/materialized-view meaning, and the distinction between source identity and derived grouping.

Durable source: [ARCHITECTURE.md](./ARCHITECTURE.md).

### A1 — Android patient-zero inventory — READY

Use current VexLife-Android source to prove a lossless first inventory:

```text
elementRef
+ textRole
+ sourceStringRef
+ source/default value
+ source path
```

The existing Screen Lens Android adapter already reads registered element IDs, `labelRes/textRes`, and default `strings.xml`; reuse that source-reading machinery rather than building a second Android parser.

First proof output should be machine-readable and sufficient to derive:

- element -> string occurrence inventory;
- unique source-string inventory;
- reverse string -> element where-used lookup;
- CSV exports as materialized views.

No Android source mutation is required for this first slice.

### A2 — duplicate / convergence analysis — WAITING on A1

Group source strings by normalized source value and other evidence to discover likely duplication, but keep the group derived.

Useful evidence includes:

- exact source value;
- text role;
- element/domain context;
- placeholder/format signature;
- same/different locale variants;
- Product/screen ownership.

The analyzer may suggest `LIKELY_SHARED`, `NEEDS_REVIEW`, `KEEP_SEPARATE`, or `ALREADY_SHARED`; it does not create shared semantic identity by itself.

### A3 — VexBoard localization workspace — WAITING on A2

Project the earned relational model through one VexBoard localization surface with pivots such as:

```text
ELEMENTS | STRINGS | VALUES | GROUPS | LOCALES | COVERAGE
```

Locale should become an orthogonal Screen Lens projection dimension rather than duplicated per-language pages.

## First source map

| Concern | Current source / owner |
|---|---|
| Vextreme localization source/pipeline | `repo.vextreme:docs/architecture/06-i18n.md` + `data/strings/source/*` |
| Existing VexSite localization trajectory | `project.vextreme.vexsite-localization` |
| VexWork localization reader | `src/core/experience-graph-localization.mjs` |
| Android element/string source reading | `src/core/vexboard-screen-lens-android-adapter.mjs` |
| Android element identity model | `repo.vexlife-android:architecture/elements/.../ElementModel.kt` |
| Android default string values | `repo.vexlife-android:app/src/main/res/values/strings.xml` |
| Feature/human meaning posture | `repo.vexlife-android:docs/foundation/FEATURE-EXPERIENCE-LANGUAGE.md` |
| System anatomy / where-used pressure | `github.issue.vexwork.138` |
| Shared Screen Lens Product frame | `github.pull.vexwork.393`, `github.pull.vexwork.395` |

## Permanent boundaries

```text
VALUE_EQUALITY != SEMANTIC_IDENTITY
CANDIDATE_GROUP != SOURCE_STRING
CANDIDATE_GROUP != ACCEPTED_SHARED_STRING
CSV != CANONICAL_LOCALIZATION_SOURCE
VEXBOARD != PRODUCT_LOCALIZATION_OWNER
LOCALE_PROJECTION != NEW_SCREEN
VEXSITE_LOCALIZATION_PROJECT != LOCALIZATION_ARCHITECTURE_PROJECT
```

VexBoard may inspect, group, compare, export and later propose source-owner changes. Product-native import/writeback remains a separate owner-specific effect and is not authorized by Project formation.

## Current next edge

`work.vex.localization-architecture.android-inventory`

Prove the normalized relationship contract against Android before adding a localization CMS UI or cross-Product shared-string registry.

<!-- [VXG RealForever][VEXWORK][LOCALIZATION-ARCHITECTURE] -->
