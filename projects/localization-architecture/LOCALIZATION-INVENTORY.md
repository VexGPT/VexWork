# Localization Inventory v1

`[VXG RealForever]`

## Purpose

A1 turns the existing Screen Lens source projection into the first durable localization relationship inventory.

The first human questions are intentionally small:

```text
Given an Element:
  which source string supplies its text?

Given a source string:
  where is it used?

Given one occurrence:
  which Product Screen/surface and Element own that appearance?
```

This is foundational data for later Locale Preview, Current-vs-Recommended display, Change Sets, duplicate analysis and the Localization Workspace.

## Ownership

```text
Product source
  -> Screen Lens producer
     owns Product / Screen / Element identity and source reading

Android localization adapter
  -> maps explicit Screen Lens R.string bindings into generic occurrences

Localization Inventory
  -> normalizes relationships, where-used indexes and CSV projections
```

Permanent:

```text
LOCALIZATION_INVENTORY != PRODUCT_SOURCE
SCREEN_LENS_LABEL != SHARED_STRING_ID
EXACT_VALUE_EQUALITY != SEMANTIC_EQUIVALENCE
CSV != CANONICAL_TRUTH
```

## Generic occurrence

```text
occurrenceRef
surfaceRef
screenRef | null
elementRef
parentElementRef | null
elementKind
bindingRole
textRole | null
sourceStringRef
sourceKey
sourceValue
sourcePath | null
```

The first Android producer emits `LABEL` and `TEXT` bindings. A11Y labels, placeholders and other text slots are added only when current Product source/projectors expose them truthfully.

## Source-string aggregate

The generic inventory aggregates only exact `sourceStringRef` identity:

```text
sourceStringRef
sourceKey
sourceValue
formatSignature
placeholders[]
occurrenceRefs[]
elementRefs[]
screenRefs[]
surfaceRefs[]
bindingRoles[]
```

A source string used by seven Elements remains one source string with seven occurrences.

Two different source string IDs with the same English value remain two strings.

## Format signature

Parameterized source copy retains a target-neutral argument signature.

Example:

```text
"%1$d of %2$d songs on this phone"

-> 1:INT | 2:INT
```

This does not decide translation semantics. It preserves a constraint future translators/realizations must respect.

## Android patient zero

Current source coordinate:

```text
VexLife-Android main
d857a92371555472e0303b18eadf353da2a868d6
```

The matching VexBoard Main Screen Lens already contains:

```text
261 projected Elements
190 explicit R.string-bound occurrences
179 unique bound source string IDs
0 missing current R.string resources at the observed source
6 source string IDs reused across multiple Elements
```

Examples:

```text
android:R.string.close
  -> 7 Element occurrences

android:R.string.vexstream_music_shuffle
  -> player.shuffle
  -> queue.sheet.shuffle
```

Current source also contains distinct string IDs with equal English values. That evidence is deliberately left for later duplicate/convergence analysis rather than collapsed in A1.

## Materialized views

A1 emits three generated files for Android Main:

```text
vexlife-android.main.localization.json
vexlife-android.main.localization.occurrences.csv
vexlife-android.main.localization.strings.csv
```

The JSON is the machine inventory.

The CSV files are human/tool views and are always regenerable.

## Currentness

```text
Lens Catalog Main commit
  ==
Screen Lens sourceSnapshot.commit
  ==
Localization Inventory sourceSnapshot.commit
```

The localization builder fails if those coordinates disagree.

A1 reuses Screen Lens source currentness rather than fetching/parsing a second copy of Android source.

## Next earned relationship

Once this inventory is proven, the next human-facing slice may use:

```text
sourceStringRef
-> occurrences
-> select occurrence
-> Screen Lens screen jump
-> select/highlight element
```

Locale variants and recommendation preview remain later work.

<!-- [VXG RealForever][LOCALIZATION-ARCHITECTURE][INVENTORY-V1] -->
