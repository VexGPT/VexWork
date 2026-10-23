# VexStream Mobile Library

`[VXG RealForever]`

## Human outcome

Make VexStream on Android a **durable, reusable and human-navigable mobile music library**: keep
downloaded media truthful and durable, while giving the listener a compact way to **Sort by** and
**Filter by** the kinds of music they actually want to play. Continuous "Keep Offline" sync remains
a separately governed future policy.

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
+-- Library Browse & Discovery                   OUTCOME
|   +-- Sort / Filter library controls           TASK / running / Android PR #164
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

User tag topology / dynamic stations
    POTENTIAL
    CAPTURED
    PARKED
    NO_AUTHORITY
    NO_EFFECTS
```

These remain visible through the Parking Lot until deliberately adopted as product commitments.
The tag/station potential is preserved because it has a distinct durable-classification ownership
question; it is not hidden inside the first Sort / Filter implementation.

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

#### Ready decision — 2026-10-22

Android source admission and design are now durably bound by
[`VexLife-Android issue #157`](https://github.com/vgong24/VexLife-Android/issues/157).

The bounded storage realization is:

```text
accepted producer media = MP3 / audio/mpeg
portable identity = mediaSha256 + mediaByteLength
Android 10+ owner = MediaStore.Audio / Music/VexStream / <sha256>.mp3
write rule = pending -> stream + exact digest/length verification -> publish
Android 7-9 owner = MediaStore audio + WRITE_EXTERNAL_STORAGE through API 28 only
permission denial = preserve the verified private copy and fail closed
localMediaRef = content URI after successful shared publication
```

This decision does not collapse the dependent work:

```text
DEVICE_STORAGE_READY
!= REDISCOVERY_COMPLETE
!= PRIVATE_COPY_MIGRATED
!= CLEAR_DATA_LIVED_PROOF
!= PERSISTENT_KEEP_OFFLINE
```

The Ready -> Active handshake was approved by Victor on 2026-10-22 and confirmed by Local Vex Operations.
Source implementation then advanced inside the issue-157 storage membrane and retained repository-local
proof at the exact storage candidate. The remaining claim is native API-matrix proof, not more product
authoring.

The Work item is now `WAITING_TOOL` on the reusable Android API target runner in
`project.android-proof-orchestration`. Its product/source authority remains `AUTHORIZED_BOUNDED`;
rediscovery, private-copy migration, destructive Clear Data proof, persistent Keep Offline / Sync, and
Connected Services remain distinct and are not implied by this checkpoint.

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


### ML-D8 — Android target orchestration is a reusable dependency, not VexStream product scope

The storage lane exposed a cross-lane host-proof gap after product source had already stabilized:

```text
retained repository-local source proof = PASS
modern Android target = available
legacy API 24-28 target = required for permission/storage branch
reusable API-compatible AVD acquisition/lease = not yet source-placed
```

The Android Test / Proof foundation already says native storage/permission claims belong on a real
Android target and that an authorized physical device or qualified AVD may realize device proof.
Vextreme-SDK's cross-platform proof source also allows logical branches to use isolated
devices/emulators and already owns Android availability/selection in the VexStream lived coordinator.

What is missing is reusable host coordination that can accept an API requirement, select or boot a
compatible target, retain exact target identity, and clean up only task-owned emulator effects.

That work is now source-managed separately as:

```text
project.android-proof-orchestration
  -> work.android-proof-orchestration.api-target-runner
```

with source claim `github.issue.vextreme-sdk.1894`.

Therefore:

```text
VEXSTREAM_STORAGE_WAITING_TOOL
!= PRODUCT_SOURCE_FAILURE
!= ANDROID_MAIN_DRIFT
!= CONNECTED_SERVICES_COLLISION

API_TARGET_RUNNER_READY
-> resume exact-head native storage proof
-> fresh Assurance
-> PR / merge / post-merge
-> rediscovery
```

Do not re-create another lane-local emulator script while this reusable dependency is the admitted
next edge.

### ML-D9 — Sort by and Filter by are one presentation surface, not one measurement

The product need is one presentable place to organize what the listener is about to play, not a
generic predicate engine.

```text
SORT BY
    changes order
    does not change membership

FILTER BY
    changes membership in the current visible/listening set
    does not mutate catalog or collection truth
```

Different fields use the control appropriate to their meaning:

```text
duration
    numeric threshold

genre / artist / source classification
    categorical selection

availability / local-copy state
    state selection

title / artist / album / year / duration
    stable ordering choices
```

The first accepted Android slice is intentionally smaller than every possible dimension. Draft PR
#164 currently implements Title / Artist / Album / Year / Duration sorting plus Duration, Artist,
Genre and Availability filtering. Search evaluates inside the same organized membership.

Victor's original duration pressure remains the proving human case:

```text
< 10 / 30 min  -> ordinary-song variety / avoid long mixes
> 30 min / 2 h -> long-form journey / flight / focus listening
```

Unknown duration is not silently classified short or long. The current filtered set is also the
library playback context for visible rows, row playback, Play All and Shuffle All.

### ML-D10 — VexStream already has source tags/categories; mobile propagation is a later seam

VexStream Music source already owns `library.Track.Tags` and `library.Track.Categories`, loaded from
`_vexmedia/library.jsonl` provenance metadata and preserved in the V2 browser Library projection.
The current mobile catalog / Android `VexStreamTrack` does not yet carry them.

Therefore:

```text
SOURCE_TAGS / SOURCE_CATEGORIES
!= ANDROID_LOCAL_INVENTED_TAGS
!= USER_AUTHORED_CLASSIFICATION
```

PR #164 deliberately does not widen into a VexStream Music mobile-catalog migration merely to ship
the first useful Android organization surface. Source tag/category filtering remains an explicit
extension seam.

### ML-D11 — User-authored tags and dynamic stations remain separate future Work

The current editable VexStream Library overlay owns title, artist, album and genre; it does not own
personal tags. A later design may combine imported classification with separately-owned human
classification for browsing while retaining provenance.

That can later support dynamic station/smart-playlist rules resolved against current Library truth:

```text
STATIC_PLAYLIST
    explicit ordered track references

FILTER
    temporary current-view selection

STATION / SMART PLAYLIST
    durable reusable selection rule
    resolves membership from current Library truth
```

`work.vexstream.mobile-library.tag-topology-stations` is therefore `POTENTIAL / CAPTURED / PARKED /
NO_AUTHORITY / NO_EFFECTS`.

### ML-D12 — Sort / Filter source is authored; exact Android proof is the held edge

Android source ownership is now durable:

```text
github.issue.vexlife-android.163
    bounded feature/source claim

github.pull.vexlife-android.164
    draft implementation candidate
    current feature source + focused tests + Feature Walk/Journey
```

Victor explicitly directed this lane to continue and complete the feature after the design/VexBoard
refinement. That is the protected Ready -> Active handshake for this exact bounded Work.

Current lifecycle:

```text
work.vexstream.mobile-library.library-browse-discovery
    DECOMPOSED

work.vexstream.mobile-library.sort-filter-controls
    WAITING_TOOL
```

Current completion boundary:

```text
WAITING_TOOL != PRODUCT_FAILURE
DRAFT_PR != ACCEPTED
SOURCE_AUTHORED != vexVerifyLocal_PASS
FEATURE_WALK_AUTHORED != DEVICE_JOURNEY_PASS
```

PR #164 is intentionally still draft. The exact projection source compiles and its core organization
behavior passes against minimal Kotlin domain stubs after correcting the candidate availability-owner
reference. That is supporting source evidence, not repository acceptance.

The remaining claim is exact-head Android repository/Journey execution. Direct checkout/archive
acquisition and a qualified Android host are unavailable in the current operator environment, and the
canonical VexRelay/VexLocalBridge package producer cannot be substituted with a hand-authored carrier.
The Work is therefore WAITING_TOOL on qualified host proof while the authored source remains intact.


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
