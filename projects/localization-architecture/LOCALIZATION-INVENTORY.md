# Localization Inventory v1

`[VXG RealForever]`

## Purpose

A1 establishes the first durable localization relationship inventory from two existing rightful observations:

```text
Android Product source
  strings.xml
  -> exact source string identity + source/default value

VexBoard Screen Lens
  -> exact Product / surface / Screen / Element identity
  -> explicit R.string binding where source already exposes one

join
  -> Localization Inventory
```

This answers the first human questions without making VexBoard another localization source owner:

```text
Given an Element:
  which source string supplies its text?

Given a source string:
  where is it currently projected?

Given one occurrence:
  which Product surface / Screen / Element owns that appearance?
```

This is foundational data for later Locale Preview, Current-vs-Recommended display, Change Sets, duplicate analysis and the Localization Workspace.

## Ownership

```text
Product string source
  owns source string IDs and exact source/default values

Screen Lens producer
  owns Product / Screen / Element identity and source-shaped presentation relationships

Android localization adapter
  joins explicit R.string bindings to the exact source catalog

Localization Inventory
  normalizes source strings, occurrences, where-used indexes and materialized views
```

Permanent:

```text
LOCALIZATION_INVENTORY != PRODUCT_SOURCE
SCREEN_LENS_LABEL != SOURCE_STRING_VALUE
PRESENTATION_OVERRIDE != LOCALIZATION_SOURCE
EXACT_VALUE_EQUALITY != SEMANTIC_EQUIVALENCE
UNMAPPED != UNUSED
CSV != CANONICAL_TRUTH
```

## Why source value cannot come from the Screen Lens label

The current AppShell gives a concrete counterexample:

```text
element.shell.fab.add
  labelRes = R.string.fab_more
  source/default value = "More"
  Screen Lens presentation label = "+"
```

Both facts are useful and both are true, but they answer different questions.

Localization therefore resolves the string through the exact Android source catalog. The Screen Lens supplies where that source identity appears.

## Generic source string

Every source catalog entry is retained whether or not the current Screen Lens maps an occurrence:

```text
sourceStringRef
sourceKey
sourceValue
sourcePath
formatSignature
placeholders[]
mapped
occurrenceRefs[]
elementRefs[]
screenRefs[]
surfaceRefs[]
bindingRoles[]
```

`mapped=false` means only:

> this current localization projection has no Screen Lens occurrence for the source string.

It does **not** mean unused. A source string may belong to a notification, runtime message, Screen title, accessibility surface, or another Product relationship that the current Screen Lens does not expose yet.

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

The Android v1 producer currently earns `LABEL` and `TEXT` occurrences from explicit Screen Lens `labelRes/textRes` bindings.

Accessibility labels, placeholders, Screen-title bindings and other text slots should be added only when the current Product source/projector exposes their exact relationship truthfully. They are held gaps, not guessed from matching English text.

## Format signatures

Parameterized source copy retains a target-neutral argument signature.

Example:

```text
"%1$d of %2$d songs on this phone"

-> arg1:INT | arg2:INT
```

The inventory preserves explicit argument positions and types. An unnumbered formatter token remains sequential rather than pretending its final runtime argument identity is known.

This is a translation constraint, not semantic equivalence.

## Android Main patient zero

Exact current source:

```text
repo: vgong24/VexLife-Android
commit: d857a92371555472e0303b18eadf353da2a868d6
```

The matching VexBoard Main Screen Lens and exact `strings.xml` produce:

```text
405 source/default-locale strings
41 source strings with formatter placeholders

190 concrete Screen Lens text occurrences
179 source string IDs mapped to one or more occurrences
226 source string IDs not yet mapped by this projection
6 mapped source string IDs reused across multiple Elements

13 Screens
14 surfaces total including AppShell chrome
```

Examples:

```text
android:R.string.close
  -> 7 Element occurrences

android:R.string.back
  -> chrome.app-shell / element.shell.back
  -> screen.vexstream-music / collection Back

android:R.string.vexstream_music_search
  -> a LABEL occurrence
  -> a TEXT occurrence

android:R.string.fab_more
  -> source value "More"
  -> projected occurrence element.shell.fab.add
  -> Screen Lens presentation label "+"
```

The source catalog also already contains different source string IDs with equal English values. A1 preserves those identities separately; later duplicate/convergence analysis may inspect the evidence but cannot merge them automatically.

## Materialized views

A1 emits:

```text
projects/localization-architecture/inventory/
  vexlife-android.main.localization.json
  vexlife-android.main.localization.occurrences.csv
  vexlife-android.main.localization.strings.csv
```

The JSON is the machine relationship inventory.

The CSV files are deterministic human/tool views and remain regenerable from the same source observations.

## Currentness

The source-backed commands are:

```text
npm run localization:build
npm run localization:check
```

Both fetch the exact Android commit bound by the Lens Catalog and read the adapter-declared string resources.

The currentness law is:

```text
Lens Catalog Main commit
  ==
Screen Lens sourceSnapshot.commit
  ==
Android checkout used for strings.xml
  ==
Localization Inventory sourceSnapshot.commit
```

An explicit `--source <android-checkout>` route is also available for controlled proof, but it must be a git checkout at the exact bound commit.

## Offline deterministic regression

The generated regression test verifies that the committed inventory and CSV views remain byte-deterministic against the current Main Screen Lens and the source catalog recorded in the committed inventory.

That offline test is not a substitute for Product-source currentness.

SourceOwner proof also runs `npm run localization:check`, which re-reads the exact Android `strings.xml` from the bound Product commit.

## Held relationships after A1

A1 intentionally does not claim:

```text
translated locale variants
accessibility/string slots not yet source-addressed by the projector
Screen-title occurrence mappings not yet retained by Screen Lens
runtime/notification text occurrence mappings not currently projected
semantic duplicate convergence
Current-vs-Recommended Change Sets
Localization Inspector UI
toolbar replacement
Product source mutation
```

The full source catalog means those gaps are visible without pretending a missing occurrence means a missing source string.

## Next earned relationship

After A1 proof, the smallest human-facing successor can reuse the existing Screen Lens interaction grammar:

```text
sourceStringRef
-> occurrence list
-> select occurrence
-> jump to owning Screen
-> select/highlight exact Element
```

Locale projection and recommendation preview layer on top only after the source/occurrence relationship is trusted.

<!-- [VXG RealForever][LOCALIZATION-ARCHITECTURE][INVENTORY-V1] -->


## A2 locale observation boundary

The first contextual Inspector slice is followed by a browser-local preview-locale observation axis.

```text
PREVIEW_LOCALE
!= PRODUCT_SUPPORTED_LOCALE
!= PRODUCT_RUNTIME_SELECTED_LOCALE
```

The preview locale is an inspection coordinate. A human may ask about a locale even when Product source has not declared a translated variant.

For one source string:

```text
selected locale == sourceLocale
  -> SOURCE
  -> show the observed source value

selected locale has an observed Product-owned variant
  -> VARIANT
  -> show that exact observed value

selected locale has no observed Product-owned variant
  -> MISSING
  -> do not synthesize translation
  -> do not infer Product runtime fallback
  -> keep Product projection unchanged
```

Locale refs use a small canonical BCP-47 shape so script distinctions such as `zh-Hant` remain representable.

Current VexLife Android Main at `d857a92371555472e0303b18eadf353da2a868d6` contains only:

```text
app/src/main/res/values/strings.xml
```

No translated `values-*` string-resource directories are present in that exact Product revision. The Inspector therefore truthfully observes only source `en` today; selecting another locale is a missing-value question, not evidence that Android supports that locale.

The browser history/shareable projection may preserve selected string + preview locale + whether the Inspector is open. That state remains VexBoard projection state only.

<!-- [VXG RealForever][LOCALIZATION-ARCHITECTURE][A2][LOCALE-OBSERVATION] -->
