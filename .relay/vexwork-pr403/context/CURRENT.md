# PR403 Localization A1 — Relay companion context

`[VXG RealForever]`

This branch/PR is the **durable continuity + custody companion** for the exact SourceOwner proof of VexWork PR #403. It exists so a fresh successor can recover the proof coordinates and host route from GitHub instead of rebuilding them from a predecessor chat.

It is **not** Product source, Workgraph lifecycle truth, a second localization authority, or an A1 merge prerequisite.

## Exact trajectory

```text
A0 / PR #399
  relational localization model + Draft 1 human workflow
        ↓
A1 / PR #403
  Android source string catalog + Screen Lens occurrences
        ↓
Issue #404 / this companion PR
  exact-head SourceOwner proof + canonical RETURN custody
        ↓
Fresh Independent Assurance
        ↓
A1 completion
        ↓
next useful slice
  source string -> locations -> choose occurrence -> Screen Lens jump/select/highlight
```

Do not jump from A1 directly to final toolbar redesign. Draft 1 keeps final drawer/page/toolbar placement revisable until the lived interaction earns it.

## Exact Product candidate

```text
PR      #403
base    a4a7a719723ba4604a2e20df82a1b3676e7e980f
head    4992e01bdd191fe74612f0314044d82357be7eb1
tree    26532d625923daff471190e569e04aefeb1667e0
branch  VXG-112126-localization-android-inventory-a001
```

The foundational A1 relationship is:

```text
Android strings.xml
  -> Product-owned source string IDs + source/default values

current Main Screen Lens
  -> Product / surface / Screen / Element identity
  -> explicit R.string bindings

join
  -> Localization Inventory
  -> reverse where-used
  -> deterministic JSON / CSV views
```

Permanent distinctions:

```text
SCREEN_LENS_LABEL != SOURCE_STRING_VALUE
UNMAPPED != UNUSED
VALUE_EQUALITY != SEMANTIC_IDENTITY
```

Example:

```text
R.string.fab_more = "More"     # source truth
Screen Lens label = "+"        # presentation truth
```

Expected patient-zero summary:

```text
405 source strings
190 Screen Lens text occurrences
179 mapped source string IDs
226 unmapped-by-current-projection source string IDs
6 reused mapped source string IDs
41 formatted source strings
13 Screens
14 surfaces including AppShell
```

## Current proof binding

```text
SDK head      6f8f6f50467f5df5a542713f7dc25b82db4ac8fa
SDK tree      96795640b01f1969da980f52d5a8ec136a8c44aa
contract blob b53cbac01c2deeb45fad5c32ce98e0796c04126f
contractRef   source.vexrelay.current-contract/v1
recipe        ExactHeadSourceOwnerProof
host          macos-victor
```

The runner forms the task from current accepted SDK source, executes it once, and publishes the canonical outer RETURN byte-identically into this same branch under:

```text
.relay/vexwork-pr403/a001/return/
```

The companion PR therefore becomes the durable return-custody surface for later instances.

## SourceOwner proof floor

```text
npm run localization:check
node --test \
  test/vexboard-localization-inventory.test.mjs \
  test/vexboard-localization-android.test.mjs \
  test/vexboard-localization-generated.test.mjs
npm run lens:verify
npm run workgraph:check
npm run workspace:check
npm run review
```

## Superseded package

Do **not** run the prior bootstrap ZIP with SHA-256:

```text
c0a0f684615408534e144cdfa377d72a808a4f3626cd79a947172f1e21e075c5
```

Its sealed `form-and-run.mjs` references the nonexistent carrier branch:

```text
relay/vexwork-pr403-a1-source-owner-a001
```

The actual carrier is:

```text
relay/vexwork-pr403-source-owner-a001
```

The corrected bootstrap preserved here changes only that carrier target. The old package remains historical evidence and is not edited in place.

## Current runnable bootstrap

```text
VEXWORK-PR403-LOCALIZATION-A1-RELAY-BOOTSTRAP-A001-R2--sha256-5e3197fd427e3cb912c45cf4fa868d34bb4cf807814aa8dbf7883ce3a6c7e1ff.zip
sha256=5e3197fd427e3cb912c45cf4fa868d34bb4cf807814aa8dbf7883ce3a6c7e1ff
bytes=7351
```

`RUN-FROM-COMPANION.command` decodes those exact bytes from the checked-out companion context, verifies the digest, and invokes the same bounded SourceOwner flow.

<!-- [VXG RealForever][VEXWORK][LOCALIZATION-ARCHITECTURE][PR403][RELAY-COMPANION] -->
