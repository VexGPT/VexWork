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
gitBlob=d79fac7dfd8b388034da8133e38bbdca144c2dda
carrierMode=DIRECT_GIT_BINARY_BLOB
```

Active companion path:

```text
.relay/vexwork-pr403/context/a002/VEXWORK-PR403-LOCALIZATION-A1-RELAY-BOOTSTRAP-A002--sha256-b4cac1a8ab0bf34ac51596186d63a2f2a523dc98614f5a505fb19cb51ef5f08c.zip
```

The runner verifies the checked-out ZIP's exact 7306-byte length and SHA-256 directly before extraction.

## A002 carrier incident — resolved

The first A002 companion attempt stopped at its pre-execution digest gate:

```text
expected=b4cac1a8ab0bf34ac51596186d63a2f2a523dc98614f5a505fb19cb51ef5f08c
observed=e02cf917b231cc20d3b3b21a1afc53c42bd1162fd6696be5604de118112617a2
```

Root cause was the companion representation, not the trusted ZIP:

```text
correct base64 characters = 9744
GitHub-held base64 chars  = 9743
one character missing
```

That fragile text carriage has been removed from the active path. The exact ZIP is now one Git binary blob whose Git object identity was independently recomputed from the trusted local bytes:

```text
git hash-object trusted ZIP
= d79fac7dfd8b388034da8133e38bbdca144c2dda

GitHub binary blob
= d79fac7dfd8b388034da8133e38bbdca144c2dda
```

Because the failed invocation never passed the companion digest gate:

```text
ZIP extraction          NOT_REACHED
Relay task formation    NOT_REACHED
attempt reservation     NOT_REACHED
candidate proof         NOT_REACHED
repository mutation     NOT_REACHED
```

The same A002 semantic proof remains current; this was a transport-only repair.

Detailed evidence:
`.relay/vexwork-pr403/a002/CARRIER-INCIDENT.md`

On execution, canonical RETURN custody is published under:

```text
.relay/vexwork-pr403/a002/return/
```

A004 PASS has now been consumed.

```text
outer RETURN sha256 d74dbc5db4949ee31b20d2fa3f67e5ccbb0d0a8b872475e712215591febaad8c
inner RETURN sha256 a58e7480aefd4ef8518f3a84795d935cb5c8951fe90af9d266747abca7693728

SourceOwner       PASS
Assurance         CLEAR_ON_EXACT_HEAD
Lifecycle current PASS
```

The Assurance disposition is PR #403 review 6004377971, explicitly disclosed as same-conversation role re-grounding over a fresh hosted GitHub read surface.

Current held effect is integration ordering only:

```text
PR403 A1
  waits for stacked PR399 A0 integration

!= candidate defect
!= proof replay
```

Issue #400 / `relay/vexwork-pr399-source-owner-a004` owns the one remaining exact A0 SourceOwner edge.

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
