# VexStream Mobile Library

`[VXG RealForever]`

## Human outcome

Make VexStream on Android a **durable, reusable and human-navigable mobile music library** while
keeping the accepted durable-device and one-shot MassDownload truths intact. Android now also has a
compact **Sort by / Filter by** surface plus settings-level **Download all missing songs / Remove all
downloaded songs** for the canonical Songs library. Continuous "Keep Offline" sync remains a
separately governed future policy.

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
+-- Durable Device Music Library                 OUTCOME / completed
|   +-- Durable device music storage             TASK / completed
|   +-- Existing-download rediscovery            TASK / completed
|   +-- Existing private-download migration      TASK / completed
|   +-- Clear-data durability lived proof        TASK / completed
|
+-- Contextual Download Experience               OUTCOME / decomposed
|   +-- Songs bulk download / remove all          TASK / needs human review
|
+-- Library Browse & Discovery                   OUTCOME / decomposed
|   +-- Sort / Filter library controls           TASK / needs human review
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

Both remain visible through the Parking Lot until deliberately adopted. Personal tag/station topology
is separate because its durable classification and rule ownership are different product questions;
it is not hidden inside the first Sort / Filter implementation.

## Source truth — original motivation and completed durable-device state

The Project began because verified VexStream downloads lived only under app-private
`Context.filesDir`, so Android Clear Data removed both the media and the private offline index.

That predecessor state is now historical. Accepted Android source now realizes:

```text
verified download bytes
-> app-private integrity staging
-> durable MediaStore.Audio publication
-> Music/VexStream/<lowercase-sha256>.mp3
-> exact re-opened SHA-256 + byte-length verification
-> content:// localMediaRef
```

Portable media identity is `mediaSha256 + mediaByteLength`; `trackRef` remains the current Hub
address and the MediaStore URI remains the storage address.

After Clear Data, the shared MP3 survives while app-private pairing/index state disappears. A fresh
VexLife state reacquires the platform's shared-audio read authority, establishes current catalog
identity, rediscovers the exact durable object by digest + length, rebuilds its private restart index,
and rejects a repeat download as `ALREADY_DOWNLOADED`.

Retained verified pre-MediaStore private copies migrate through the same durable publication boundary
without network redownload and are removed only after successful shared publication.

Current source owners include:

```text
VexStreamMediaStore.kt
VexStreamDeviceMediaStore.kt
VexStreamOfflineIndex.kt
PairedVexStreamMusicRepository.kt
VexStreamOfflineCopy.kt
```

Terminal evidence is Android PR #165, SDK PR #1898, the A039 physical post-Clear-Data product pass,
and A043 exact run-owned cleanup. The separate Sort / Filter lane and other Mobile Library siblings
are not implied complete by this durable-device checkpoint.

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

### ML-D2 — Durable/reusable library realization is accepted and terminal

Human requirement:

> A downloaded VexStream song should remain useful as device music after VexLife app-data clearing,
> and a fresh VexLife state should be able to rediscover and verify it instead of redownloading it.

The original Android realization was intentionally left open until source admission. Issue #157 then
bound the MediaStore design, and the completed trajectory proved the exact realization across legacy
and modern Android targets.

```text
accepted producer media = MP3 / audio/mpeg
portable identity = mediaSha256 + mediaByteLength
Android shared owner = MediaStore.Audio / Music/VexStream / <sha256>.mp3
write rule = stage -> publish -> re-open -> exact digest/length verify
post-Clear-Data read = READ_EXTERNAL_STORAGE (API 29-32) | READ_MEDIA_AUDIO (API 33+)
localMediaRef = verified content:// URI
```

Terminal evidence:

```text
A033 API28 native proof = PASS
A034 physical API36 storage / migration proof = PASS
A039 Clear Data rediscovery / no-redownload / offline playback = PASS
A043 run-owned cleanup = PASS

Android PR #165 = MERGED / tree-exact
SDK PR #1898 = MERGED / tree-exact
Android #160 / #161 / #162 = CLOSED
SDK #1897 = CLOSED
```

The bounded durable-device subtree is therefore complete:

```text
DEVICE_STORAGE_COMPLETE
REDISCOVERY_COMPLETE
PRIVATE_COPY_MIGRATION_COMPLETE
CLEAR_DATA_LIVED_PROOF_COMPLETE
```

This completion does **not** close the whole Mobile Library Project and does not adopt persistent
Keep Offline / Sync, Contextual Download work, the paused Track-menu incident, or the separate
Sort / Filter lane.

### ML-D3 — Rediscovery reconstructs truth; the private index is no longer the only memory

This requirement is now earned. After Clear Data removes app-private VexStream state, the shared
MediaStore object survives. Once current catalog identity is re-established, Android verifies the
deterministic shared row by exact digest + length, binds the resulting `content://` copy to the
current `trackRef`, rebuilds the private restart index, and rejects a repeat download as
`ALREADY_DOWNLOADED`.

A039 proved that exact sequence on the physical Samsung and then proved `LOCAL_ONLY`
`content://` playback after Desktop stop.

Source:

`repo.vexlife-android:app/src/main/kotlin/com/vextreme/vexlife/android/data/vexstream/PairedVexStreamMusicRepository.kt`

Evidence:

```text
github.issue.vexlife-android.160
github.pull.vexlife-android.165
evidence.vexstream.mobile-library.clear-data.a039.return.sha256.67e4b6ede7aab8964406894da8fdcddc216f88692e11fbd8a21ac2ae21c537b7
```

### ML-D4 — Songs settings actions reuse MassDownload / Offline Copy truth

The VexStream settings sheet now owns a whole-Songs convenience doorway, not another downloader or storage owner.

`Download all missing songs` reuses the existing exact MassDownload planner over canonical playable Songs. `Remove all downloaded songs` reuses repository removal, VexStream-owned MediaStore deletion, and offline-index persistence. Album, Artist and Playlist detail screens keep their accepted collection-level Download missing action.

PR #167 merged at `8213ae7befe08bc0a21c76bd70e7c8790e5bcf9f`; A003 passed focused/local proof plus exactly one three-song connected Journey and fresh Assurance.

`SOURCE_PROVEN_AND_MERGED != HUMAN_ACCEPTED`. VexWork therefore projects this Work as **WAITING_HUMAN** until Victor reviews the merged experience.

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


### ML-D8 — Android target orchestration remains reusable, but VexStream no longer waits on it

The storage lane originally entered `WAITING_TOOL` because the missing API-matrix proof needed a
reusable Android target route rather than another lane-local emulator script. That dependency is
historical for this completed subtree.

The required evidence was subsequently earned:

```text
API28 native storage / permission branch = PASS
physical API36 modern storage / rediscovery / migration = PASS
Clear Data physical continuation = PASS
```

The reusable orchestration work remains independently owned as:

```text
project.android-proof-orchestration
  -> work.android-proof-orchestration.api-target-runner
```

and may continue for broader callers. It is **not** a live dependency of the completed VexStream
storage card.

```text
VEXSTREAM_STORAGE_COMPLETE
!= ANDROID_PROOF_ORCHESTRATION_PROJECT_COMPLETE

HISTORICAL_TOOL_DEPENDENCY
!= CURRENT_VEXSTREAM_BLOCKER
```

Do not move the VexStream storage work back to `WAITING_TOOL` merely because the reusable
orchestration Project still has its own unfinished work.

### ML-D9 — Sort by and Filter by are one presentation surface, not one measurement

The immediate human need is one compact place to organize the music about to be played:

```text
SORT BY
    changes order
    does not change membership

FILTER BY
    changes current listening membership
    does not mutate catalog / playlist / Queue / Playback truth

SEARCH
    evaluates inside that same organized set
```

Current Android candidate PR #166 is ordinary-forwarded onto the terminal durable-device main from
PR #165. The durable-device lane changed zero paths in this feature's 16-file source membrane and
deliberately left the VexStream feature-home README to this organization lane.

Current first-slice controls:

```text
Sort
    Title / Artist / Album / Year / Duration

Filter
    Duration: Any / Less than / Greater than + positive minute threshold
    Artist: multi-select
    Genre: multi-select
    Availability: desktop-only / desktop+device / device-only
```

The duration pressure remains the proving human use case:

```text
< 10 / 30 min  -> ordinary-song variety / avoid long mixes
> 30 min / 2 h -> long-form journey / flight / focus listening
```

Unknown duration does not match an active threshold. Visible rows, row playback context, Play All
and Shuffle All consume the same filtered membership. Playlist filtering may narrow visible members
but does not rewrite canonical playlist order.

The completed durable-device substrate improves the meaning of Availability without changing this
feature's ownership: rediscovered `Downloaded` truth and verified `content://` local media can now
legitimately project as `HUB_AND_LOCAL` or `LOCAL_ONLY`, while Sort / Filter remains a read-only
presentation lens over `VexStreamTrackState.availability`.

### ML-D10 — VexStream source tags/categories remain a later mobile-projection seam

VexStream Music already owns source `tags[]` and `categories[]`. The Android mobile catalog still
does not carry them, and PR #166 does not widen into that cross-repository projection merely to ship
the first useful organization surface.

```text
SOURCE_TAGS / SOURCE_CATEGORIES
!= ANDROID_LOCAL_INVENTED_TAGS
!= USER_AUTHORED_CLASSIFICATION
```

### ML-D11 — User-authored tags and dynamic stations remain separate future Work

A future personal classification layer may drive reusable dynamic stations / smart playlists, but
that is distinct from both imported provider tags and a temporary Filter:

```text
STATIC_PLAYLIST
    explicit ordered track references

FILTER
    temporary current-view selection

STATION / SMART PLAYLIST
    durable reusable selection rule
    resolves membership from current Library truth
```

`work.vexstream.mobile-library.tag-topology-stations` remains `POTENTIAL / CAPTURED / PARKED /
NO_AUTHORITY / NO_EFFECTS`.

### ML-D12 — Sort / Filter Android source and proof are accepted; human Verify entry remains

PR #166 merged at `01432d594172829c2da22e3bddcb09c073c97c16` with exact A011 tree identity. Focused/local proof, W02 device proof, aggregate device proof, fresh Assurance and lifecycle currentness all passed.

VexWork leaves the obsolete `WAITING_TOOL` checkpoint, returns to the already-approved Active phase, and projects **WAITING_HUMAN** because the Project v1 policy protects entry into Verify.

### ML-D13 — Songs bulk management is merged/proven and waiting on lived review

PR #167 is accepted Android source. Its bounded fixture used exactly three Songs: one local plus two missing; Download all reached 3/3 local, Remove all returned to 0/3 local, and the same three catalog refs remained.

This Work item had no stored transition history, so VexWork currentizes its source-managed snapshot directly to `WAITING_HUMAN` rather than fabricating retrospective lifecycle edges.

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
