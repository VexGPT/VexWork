# PR403 Localization A1 — Relay companion context

`[VXG RealForever]`

This branch/PR is the durable continuity + canonical RETURN custody companion for VexWork PR #403. It is not Product source, Workgraph lifecycle truth, or a second localization authority.

## Current exact candidate

```text
PR      #403
base    9b48268876ebba4b1ad91f753d9c497916d9bb74
head    544d18d9f85a237f120d0cf5dbb9a2ffbfd06af0
tree    8652a693cf3d36d799183c4f4b7bb6681f7b7c1f
branch  VXG-112126-localization-android-inventory-a001
```

The A1 localization delta remains exactly 14 paths. The base changed only because PR #399 corrected one Screen Lens identity regression fixture.

## A003 returned evidence

Canonical outer RETURN:

```text
RETURN-vexwork-pr403-a1-source-owner-a003--sha256-60949db56f293382ff5d018d07dcfd13f6efedd302983d839ab775088f8ba305.zip
sha256=60949db56f293382ff5d018d07dcfd13f6efedd302983d839ab775088f8ba305
```

A003 proved:

```text
localization:check                           PASS
11 focused localization tests              PASS
lens:verify                                PASS
workgraph:check                            PASS
workspace:check                            PASS
npm run review                             FAIL
```

The review-floor failure was not in localization source. PR #399 had added a direct regression test for the existing Screen Lens identity normalizer using synthetic input `row / title`, while the actual source contract uses slash-delimited local paths such as `row/title` and `actions/play`.

Rightful repair:

```text
PR #399
test/vexboard-screen-lens-identity.test.mjs
row / title -> row/title

repair commit
9b48268876ebba4b1ad91f753d9c497916d9bb74
```

No Screen Lens identity implementation changed.

PR #403 was then forward-composed on the corrected A0 base:

```text
head 544d18d9f85a237f120d0cf5dbb9a2ffbfd06af0
tree 8652a693cf3d36d799183c4f4b7bb6681f7b7c1f
```

## Current proof route

SDK and Relay currentness remain unchanged:

```text
SDK head      6f8f6f50467f5df5a542713f7dc25b82db4ac8fa
SDK tree      96795640b01f1969da980f52d5a8ec136a8c44aa
contract blob b53cbac01c2deeb45fad5c32ce98e0796c04126f
contractRef   source.vexrelay.current-contract/v1
recipe        ExactHeadSourceOwnerProof
host          macos-victor
```

Fresh proof package:

```text
VEXWORK-PR403-LOCALIZATION-A1-RELAY-BOOTSTRAP-A002--sha256-b4cac1a8ab0bf34ac51596186d63a2f2a523dc98614f5a505fb19cb51ef5f08c.zip
sha256=b4cac1a8ab0bf34ac51596186d63a2f2a523dc98614f5a505fb19cb51ef5f08c
bytes=7306
```

Companion path:

```text
.relay/vexwork-pr403/context/a002/
```

On execution, canonical RETURN custody is published under:

```text
.relay/vexwork-pr403/a002/return/
```

On PASS: consume exact RETURN -> fresh Independent Assurance on exact head `544d18d9...`.

## Product trajectory after A1

Do not jump to final toolbar placement.

```text
source string
-> locations
-> select one occurrence
-> Screen Lens jump/select/highlight
-> locale preview
-> Current vs Recommended
-> Change Set reconciliation
-> duplicate/convergence pattern analysis
-> global Localization Workspace refinement
```

Draft 1 now also retains lexical/token-shape pattern evidence for later A4 analysis:

```text
LEXICAL_SIMILARITY != SEMANTIC_IDENTITY
PATTERN_DETECTED != DEFECT
UNKNOWN_INTENT != UNMAPPED
```

<!-- [VXG RealForever][VEXWORK][LOCALIZATION-ARCHITECTURE][PR403][RELAY-COMPANION][CURRENT] -->
