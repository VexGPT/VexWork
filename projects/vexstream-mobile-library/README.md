# VexStream Mobile Library

`[VXG RealForever]`

## Human outcome

Make VexStream on Android a **durable, reusable and human-navigable mobile music library**: keep
downloaded media truthful and durable, while also letting a listener narrow the current library into
the listening context they actually want. Continuous "Keep Offline" sync remains a separately
governed future policy.

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
+-- Library Filtering                            OUTCOME
|   +-- Duration-aware song filtering            TASK / decomposed / first pressure
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


### ML-D9 — Library Filtering is a human narrowing capability, not a generic engine

Duration exposed a broader missing product question:

> How can a listener narrow the VexStream library into the music that fits the present listening
> intention, while every track, collection and provider truth keeps its original owner?

Current Android source already contains multiple independent filterable truths:

```text
track metadata
  durationSeconds
  artist
  album
  genre
  year

current device/source truth
  local copy state
  HUB_ONLY / HUB_AND_LOCAL / LOCAL_ONLY / UNAVAILABLE

existing narrowing input
  Search query over human metadata
```

That is enough real pressure to earn one **Library Filtering** outcome. It is not enough pressure to
invent an app-wide filtering framework or create speculative Work items for every possible field.

The product relationship to design is:

```text
CURRENT repository-owned track truth
+ current playable truth
+ current library/collection context
+ text query when present
+ active user filters
+ existing ordering/grouping rules
        ↓
CURRENT visible listening universe
        ↓
track-row playback context
+ Play All
+ Shuffle All
```

The important questions for Android feature authoring are therefore relational:

1. **Dimension** — what accepted track/currentness fact is being narrowed?
2. **Predicate** — what does a match mean for numeric, categorical and state-valued dimensions?
3. **Unknown policy** — what happens when a value such as duration is unknown?
4. **Scope** — does the filter apply to Songs only, the whole library, Search, Downloads, or a
   collection detail?
5. **Composition** — how do several active filters combine, and how does Search compose with them?
6. **Playback context** — does tapping a visible track, Play All, and Shuffle All operate over the same
   narrowed universe the human can see?
7. **Collection truth** — when filtering inside an Album/Artist/Playlist projection, how do we narrow
   visible members without pretending the canonical collection membership changed?
8. **Lifetime** — is filter state screen-local, saveable across recomposition/navigation, or truly
   persistent? Persistence must be earned rather than assumed.
9. **Legibility** — how can the human see that filters are active, clear them, and understand a
   no-results state?
10. **Extensibility** — can a new meaningful dimension be added at the rightful projection boundary
    without another ad-hoc screen-specific predicate pile?

Candidate dimensions are **source-supported possibilities, not committed product controls**. Artist
and Album already have first-class navigation lenses, for example, so duplicating them as filters may
or may not improve the experience. Likewise Search is already a distinct human input and should
compose with filters rather than being relabeled merely for architectural symmetry.

Permanent non-collapse:

```text
LIBRARY_FILTERING != SECOND_LIBRARY
LIBRARY_FILTERING != CATALOG_TRUTH
LIBRARY_FILTERING != PLAYLIST_MEMBERSHIP_MUTATION
LIBRARY_FILTERING != SEARCH
LIBRARY_FILTERING != SORTING
LIBRARY_FILTERING != PERSISTENT_SHUFFLE_MODE
LIBRARY_FILTERING != OFFLINE_OR_SYNC_POLICY
FILTERED_PROJECTION != FILTERED_SOURCE_OF_TRUTH
```

New filter dimensions should become separate Work only when their human outcome, source pressure or
proof boundary is meaningfully distinct. The broader outcome exists so one-off predicates can
compose coherently without manufacturing a ticket for every field.

Current Work:

```text
work.vexstream.mobile-library.library-filtering
state = DECOMPOSED
next = process.vexlife-android.feature-authoring
```

### ML-D10 — Duration is the first earned Library Filtering slice

Victor's first concrete listening pressure is duration:

```text
under 10 minutes
  -> ordinary individual-song variety

under 30 minutes
  -> avoid very long mixes while keeping a broad shuffle pool

over 30 minutes / over 2 hours
  -> intentionally choose long-form journey, flight, focus, or mix listening
```

Current Android source already carries `VexStreamTrack.durationSeconds`, already renders known
duration on track rows, and already routes library-level Play All / Shuffle All through the current
track set. The first slice can therefore challenge the filtering contract without inventing new media
metadata or another playback engine.

Initial behavior to preserve:

- support both less-than and greater-than a listener-chosen duration threshold;
- clearing the duration filter restores the ordinary playable projection;
- Search composes with duration filtering;
- the visible Songs universe and library-level Play All / Shuffle All agree on the same filtered set;
- starting playback from one visible track carries the same narrowed context rather than immediately
  escaping into hidden unfiltered tracks;
- unknown duration (`durationSeconds == 0`) is not silently classified as short or long while a
  duration threshold is active;
- track refs, availability, download state and playback-source resolution remain unchanged;
- exact UI (chip, sheet, presets, custom value, or combination) stays an Android feature-authoring
  decision;
- Albums / Artists / Downloads / Playlist-detail propagation must be decided explicitly from the
  broader Library Filtering scope rather than accidentally changing collection membership.

Examples such as `< 10 min`, `< 30 min`, `> 30 min`, and `> 2 hr` express listening modes;
they do not require hard-coded presets.

```text
work.vexstream.mobile-library.duration-filter
parent = work.vexstream.mobile-library.library-filtering
state = DECOMPOSED
```

The next real edge is to source-place the smallest Android Library Filtering projection/control shape,
use duration as the first proving dimension, and then apply the Project's normal meaningful-phase
handshake before Active implementation.

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
