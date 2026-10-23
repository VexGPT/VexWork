# VexStream Mobile Library

`[VXG RealForever]`

## Human outcome

Make downloaded VexStream music a **durable, reusable Android device library** while keeping the
already-accepted one-shot MassDownload behavior truthful and keeping continuous "Keep Offline" sync
as a separately governed future policy.

This Project is the human/navigation owner for that outcome. Product semantics remain with
VexLife-Android and VexStream Music.

## Enter the Project

A fresh worker should descend in this order:

```text
projects/vexstream-mobile-library/README.md
-> project.json
-> Work Board projection
-> exact Work item
-> its sourceRefs / repositoryRefs
-> target repository's own current entry/culture
-> exact product source / proof
```

Do not reconstruct this Project from chat history when these sources are current.

## Project shape — epic-like OUTCOMEs

VexWork does not have a separate Epic ontology. Epic-like grouping is nested `workClass=OUTCOME`.

```text
VexStream Mobile Library                         OUTCOME
|
+-- Durable Device Music Library                 OUTCOME
|   +-- Durable device music storage             TASK
|   +-- Existing-download rediscovery            TASK
|   +-- Existing private-download migration      TASK
|   +-- Clear-data durability lived proof        TASK
|
+-- Contextual Download Experience               OUTCOME
|   +-- Contextual Download Missing              TASK
|
+-- MassDownload Maturity                        OUTCOME
    +-- MassDownload product implementation      TASK / completed
    +-- MassDownload terminal EndToEnd           TASK / completed
    +-- Track-menu presentation intermittency    DEFECT / paused at checkpoint / OPEN_UNEXPLAINED
```

Adjacent but deliberately **outside current Project membership**:

```text
Persistent Keep Offline / Sync
    POTENTIAL
    CAPTURED
    PARKED
    NO_AUTHORITY
    NO_EFFECTS
```

It remains visible through the Parking Lot until Victor deliberately adopts continuous sync as a
separate product commitment.

## Current source truth that motivated the Project

Current Android production downloads are verified, digest-addressed files under app-private
`Context.filesDir`:

```text
filesDir/vexstream/media/<sha256>.media
filesDir/vexstream/offline-index.properties
```

Therefore the current product already survives ordinary process/app restart, but app-private VexStream
media is not a reusable device music library and is removed by Android Clear Data / app uninstall.

Source owners:

```text
VexStreamMediaStore.kt
VexStreamOfflineIndex.kt
PairedVexStreamMusicRepository.kt
```

The existing collection MassDownload feature is already accepted product source. Its current design
explicitly distinguishes one-shot Download missing from persistent sync.

## Requirement / design ledger

These entries preserve **why** the Work items exist. They are human audit/navigation records, not a
new VexWork Design ontology and not substitutes for target-repository design authority.

### ML-D1 — Preserve exact media identity

Durable-device storage must preserve the integrity properties already earned by the private media
store:

```text
trackRef
+ expected SHA-256
+ expected byte length
-> verified media object
```

Moving bytes to a more durable/reusable Android home must not weaken integrity or silently accept a
same-name/different-byte file.

Source:

`repo.vexlife-android:app/src/main/kotlin/com/vextreme/vexlife/android/data/vexstream/VexStreamMediaStore.kt`

### ML-D2 — Durable/reusable library is the requirement; Android realization is not frozen yet

Human requirement:

> A downloaded VexStream song should remain useful as device music after VexLife app-data clearing,
> and a fresh VexLife state should be able to rediscover and verify it instead of redownloading it.

An Android MediaStore / Music/VexStream-style realization is a candidate, **not yet a source-approved
decision**. The Android feature-authoring route owns the exact storage API, collection/path policy,
permission behavior, removal semantics, migration behavior and device-version pressure.

```text
DURABLE_DEVICE_LIBRARY_REQUIREMENT
!= PREDECIDED_MEDIASTORE_IMPLEMENTATION
```

### ML-D3 — Rediscovery must reconstruct truth; the private index cannot remain the only memory

The current offline index lives beside app-private media. The desired product must be able to rebuild
verified local-copy truth from the admitted durable media owner after fresh app state.

This is why `Existing-download rediscovery` depends on `Durable device music storage`.

Source:

`repo.vexlife-android:app/src/main/kotlin/com/vextreme/vexlife/android/data/vexstream/VexStreamOfflineIndex.kt`

### ML-D4 — Contextual Download Missing reuses MassDownload semantics

The settings-sheet quick action is another entry point into the existing one-shot download planner,
not a second downloader.

Human requirement:

- place the quick action beneath **Refresh library** in the VexStream connection/settings surface;
- make its scope follow the current music context (Songs / Album / Artist / Playlist as admitted by
  the feature design);
- show the current missing count;
- constrain wording for phone width rather than forcing long labels;
- keep exact copy/secondary-label realization as a design choice until Android feature authoring.

```text
CONTEXTUAL_QUICK_ACTION
-> EXISTING_MASSDOWNLOAD_PLAN
!= SECOND_DOWNLOAD_ENGINE
```

Relevant product sources:

```text
VexStreamConnectionPresentation.kt
VexStreamCollectionPresentation.kt
VexStreamOfflineCollection.kt
```

### ML-D5 — One-shot Download missing is not persistent Keep Offline

Current Android source already states:

```text
ONE_SHOT_DOWNLOAD_MISSING
!=
PERSISTENT_KEEP_OFFLINE
```

That distinction remains deliberate. Continuous convergence against changing album/artist/playlist
membership introduces different ownership: durable desired-offline intent, background/restart
behavior and membership convergence.

Source:

`repo.vexlife-android:app/src/main/kotlin/com/vextreme/vexlife/android/vexstream/offline/VexStreamOfflineDocs.kt`

### ML-D6 — MassDownload product source and terminal EndToEnd proof are different Work

MassDownload product implementation is accepted predecessor truth, and its terminal three-track
EndToEnd trajectory is now accepted/current rather than still pending.

Terminal evidence establishes:

```text
Android PR #148 = MERGED
SDK PR #1887 = MERGED / post-merge parity PASS
SDK Main Integrity = CONVERGED through PR #1887
MassDownloadDeviceReplayOwed = false
sdkReadyPhysicalReplayOwed = false
```

The Queue/Add-to-queue intermittency is **not** part of that acceptance. Android Test / Proof incident
PR #151 is now merged as the durable open incident record with:

```text
failureStatus = OPEN_UNEXPLAINED
failureRootCause = UNKNOWN
hardeningState = ACCEPTED_CURRENT

MERGED_INCIDENT_RECORD != INCIDENT_RESOLUTION
MASSDOWNLOAD_TERMINAL != QUEUE_INCIDENT_CLOSED
```

VexWork therefore keeps the Queue defect as a sibling under MassDownload Maturity rather than hiding
it beneath the completed EndToEnd item. The incident record is source/evidence; this Work item owns
the lifecycle truth.

Provider/evidence refs include Android PR #148, merged Test/Proof incident PR #151, current-source
checkpoint PR #155, and SDK PR #1887. Public VexWork references private SDK provider evidence without
publishing private repository culture.

Current-source recurrence evidence now establishes:

```text
fresh isolated evaluable Queue runs = 8
exact queue occurrence #2 PASS = 8
matching AddTrackToQueue semantic recurrence = 0

failureStatus = OPEN_UNEXPLAINED
failureRootCause = UNKNOWN
```

That is enough to stop blind active reproduction pressure, but not enough to claim a fix or external
cause. VexWork therefore moves the admitted defect from `RUNNING` to `PAUSED_AT_CHECKPOINT` in the
Waiting lane. It remains `workDisposition=ACTIVE`, `authorityDisposition=AUTHORIZED_BOUNDED`, and
`effectDisposition=NO_EFFECTS`: this is a checkpoint inside the delegated defect envelope, not
canonical Parking Lot work and not incident closure.

Resume causal execution when the accepted recurrence rule matches again or materially new evidence
creates a bounded hypothesis worth falsifying.

### ML-D7 — VexStream Music is a real repository relationship, not hidden context

MassDownload lived proof uses the real VexStream Music Desktop producer. VexWork therefore records
the public VexStream Music repository in the Repository Graph and binds it only where materially
implicated.

Product meaning remains in VexStream Music's own entry/architecture sources.

## Work-state and agency safety

This Project has:

`agency.vexstream.mobile-library.delegated-handshake`

Routine stewardship may continue **within** a current phase. Human transition handshake is required
for meaningful Board phase promotions:

```text
Ready  -> Active
Active -> Verify
Verify -> Done
```

Project formation/decomposition is not blanket implementation authority. Work-item
`authorityDisposition` and `effectDisposition` remain binding.

## Fresh-instance questions

Before changing product source, a fresh worker should be able to answer:

1. Which OUTCOME am I advancing?
2. Which exact child Work item owns this question?
3. Is another item a real dependency or merely a sibling under the same outcome?
4. Which repository owns the product semantics?
5. Which sourceRefs explain the requirement/current truth?
6. Is implementation actually authorized for this item?
7. Which processRef tells me how to enter the target repository?
8. What proof would establish the claim without silently widening it?

## Known VexWork modeling gap

This README intentionally carries design/audit synthesis because current VexWork does not yet expose
a dedicated typed Design/Decision relationship graph.

That is a VexWork foundation question, not a reason to lose current Project continuity.

Until a rightful design model exists:

```text
Workgraph
    owns work identity / containment / dependency / lifecycle

sourceRefs
    bind accepted source/evidence

Project README
    preserves human purpose + decision/non-decision synthesis

target repository
    owns actual product design/source authority
```

Do not duplicate target-repository architecture into VexWork.

<!-- [VXG RealForever][VEXWORK][PROJECT][VEXSTREAM-MOBILE-LIBRARY] -->
