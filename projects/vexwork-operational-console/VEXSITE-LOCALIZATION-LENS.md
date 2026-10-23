# VexSite Localization Lens

`[VXG RealForever]`

## Human question

Given Vextreme's current page population, **which pages still lack a required target locale, and which separate currentness questions still deserve attention?**

This lens composes with the VexSite Population Adapter. It does not create page Work items and it does not make VexWork another translation, generated-artifact, browser-proof, or modernization owner.

```text
Vextreme current data/index.json
+ VexWork VexSite population snapshot
+ one explicit target-locale set
+ separately supplied currentness/lived/modernization evidence
        ↓
vexwork.work-lens/v1
+ vexwork.entity-lens-evidence/v1[]
        ↓
Derived Attention projection
        ↓
aggregate -> arc -> section -> page -> evidence
```

## Rightful source boundaries

Vextreme currently owns these facts:

```text
data/index.json.pageLanguageMap[slug].availableLangs
  partial page-local coverage/debt information

data/index.json.pageLanguageMap[slug].completeLangs
  strict page-local completed viewing modes

data/index.json.sourceOnlyScopes
  scopes intentionally excluded from translation campaigns

data/strings/compiled/scopes/index.json
  generated per-scope locale counts and source-only policy projection

docs/architecture/06-i18n.md
  semantics of availability, completeness, fallback, screenshot eligibility,
  source-only policy, and generated pipeline
```

VexWork consumes those facts. It does not recompile strings, infer translated text from HTML, or make a second localization registry.

## Why locale requirements are separate predicates

One aggregate predicate such as `all-target-locales-complete` could tell us that a page is incomplete, but it could not answer the more useful question:

> Which locales account for the remaining population debt?

The lens therefore forms one REQUIRED predicate per target locale:

```text
predicate.vextreme.vexsite.localization.locale.ar
predicate.vextreme.vexsite.localization.locale.de
...
```

with a matching reason facet:

```text
reason.vextreme.vexsite.localization.locale.ar
reason.vextreme.vexsite.localization.locale.de
...
```

That lets the existing Derived Attention projection aggregate incomplete pages by locale without adding page tasks or a localization-specific summary engine.

The target-locale set belongs to the **lens definition**, not Vextreme page identity. Different programs may legitimately inspect the same population under different language targets.

```text
PROVIDER_SUPPORTED_LANGUAGE != REQUIRED_BY_EVERY_LENS
LENS_TARGET_LOCALES != PROVIDER_LANGUAGE_REGISTRY
```

## Locale evidence rule

For an applicable page and target locale:

```text
locale in pageLanguageMap[slug].completeLangs
  -> SATISFIED

locale absent from completeLangs
  -> UNSATISFIED
```

`availableLangs` does not satisfy the predicate. Vextreme explicitly treats it as partial coverage/debt information; the user-facing finished locale surface consumes `completeLangs`.

A page whose declared content scopes are all present in `sourceOnlyScopes` projects every target-locale predicate as `NOT_APPLICABLE`, with policy evidence. It is not mislabeled as translation debt merely because only EN exists.

```text
SOURCE_ONLY != INCOMPLETE_TRANSLATION
PARTIAL_AVAILABLE != COMPLETE
EN_FALLBACK != TARGET_LOCALE_COMPLETE
```

## Separate attention dimensions

Locale coverage is REQUIRED for completion under this lens. Three additional dimensions are initially ADVISORY because they are independently evidenced and must not be guessed from `completeLangs`:

```text
generated-currentness
lived-proof
modernization
```

This produces an intentional split:

```text
completionState
  answers target-locale coverage

attentionState + reason facets
  can additionally surface generated/lived/modernization concerns
```

The adapter accepts exact evidence for those dimensions when a rightful source supplies it. Absent evidence remains `UNKNOWN`.

```text
COMPLETE_LANGS != GENERATED_CURRENTNESS_PROOF
COMPLETE_LANGS != LIVED_BROWSER_PROOF
COMPLETE_LANGS != MODERNIZATION_PROOF
UNKNOWN != FAILURE
```

A later Vextreme-owned projector may provide those evidence signals. VexWork must not manufacture them to make a dashboard look complete.

## Snapshot binding

Evidence is accepted only when the supplied Vextreme index content fingerprint matches the population snapshot identity produced by the VexSite Population Adapter.

```text
population snapshot A
+ provider index B
where A.content != B.content
-> reject
```

Every population page must also have the page-local `pageLanguageMap` surface that current `lib/build-index.js` promises. Missing provider projection is treated as a source/currentness contradiction rather than silently converted into localization debt.

## Existing Work coexistence

Evidence may carry `existingWorkRefs` for a page concern. That allows a projection to answer both:

```text
this page currently lacks fr
and
canonical Work already exists for this concern
```

without deriving WorkState from the page evidence or reopening completed historical Work automatically.

```text
DERIVED_LOCALIZATION_ATTENTION != WORK_STATE
EXISTING_WORK_REF != PAGE_LIFECYCLE
```

## First dogfood shape

The first VexSite dogfood can bind the current program's target locale set and project:

```text
VexSite Localization
-> arc / section
-> exact pages
-> COMPLETE / INCOMPLETE / NOT_APPLICABLE
-> missing by locale reason facet
-> generated / lived / modernization attention when evidence exists
-> exact page evidence
-> existing promoted Work refs when present
```

The initial implementation does not claim that every currently compiled site language is automatically a permanent business requirement. The selected target set must be explicit in the lens.

## Non-collapse

```text
PAGE != WORK_ITEM
LOCALE_MISSING != ADMITTED_TASK
PAGE_COMPLETION != WORK_STATE
SOURCE_ONLY != FAILURE
AVAILABLE_LANGS != COMPLETE_LANGS
GENERATED_CURRENTNESS != LIVED_PROOF
LIVED_PROOF != MODERNIZATION
PROJECTION != IMPLEMENTATION_AUTHORITY
VEXTREME_LOCALIZATION_TRUTH != VEXWORK_LIFECYCLE_TRUTH
```

<!-- [VXG RealForever][VEXWORK][OPERATIONAL-CONSOLE][P2][VEXSITE-LOCALIZATION-LENS] -->
