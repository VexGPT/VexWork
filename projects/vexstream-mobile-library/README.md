# VexStream Mobile Library

`[VXG RealForever]`

## Human outcome

Make VexStream on Android a **durable, reusable and human-navigable mobile music library** while
keeping the accepted durable-device and one-shot MassDownload truths intact. Android has a compact
**Sort by / Filter by** surface plus a settings-level one-shot **Download missing songs & artwork /
Remove all downloaded songs** doorway. Lived review refined that doorway so one deliberate update
refreshes current Desktop catalog truth, downloads only exact missing audio, and reconciles admitted
artwork that is missing locally without redownloading existing music. Library organization still lacks
truthful freshness discovery for newly added/downloaded music. Current playback artwork convergence
also remains active. Continuous "Keep Offline" media-membership sync remains a separately governed
future policy.

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
|   +-- Songs missing-content update / remove all TASK / verifying / merged / lived proof pending
|
+-- Library Browse & Discovery                   OUTCOME / decomposed
|   +-- Sort / Filter / Recently added controls  TASK / running / lived feedback
|
+-- Large offline-library cold-start performance DEFECT / source fix merged / lived observation pending
|
+-- Playback Surfaces                            OUTCOME / decomposed
|   +-- Now Playing artwork projection           TASK / completed / online metadata projection accepted
|   +-- Offline artwork durability               DEFECT / running
|   +-- Current-track artwork availability       DEFECT / running / post-merge lived placeholder
|   +-- Reconcile / sync missing artwork          TASK / cancelled as separate owner; absorbed above
|   +-- VexStream full player                    TASK / verifying / lived artwork feedback remains
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

The VexStream settings sheet owns one whole-Songs convenience doorway, not another downloader or
storage owner.

PR #167 established the accepted audio-only baseline: `Download all missing songs` reuses the exact
MassDownload planner over canonical playable Songs, while `Remove all downloaded songs` reuses
repository removal, VexStream-owned MediaStore deletion, and offline-index persistence. Album, Artist
and Playlist detail screens keep their accepted collection-level Download missing action.

Victor's lived review on 2026-10-26 refined the same authorized doorway instead of requesting a second
sync control. The active candidate PR #187 evolves the one-shot update to:

```text
refresh current paired Desktop catalog
-> fresh canonical playable-Songs plan
-> exact missing audio only
   already-downloaded audio -> keep / never replay
-> repository-owned artwork reconciliation
   admitted source + local cache present -> keep
   admitted source + local cache missing -> fetch/cache
   no admitted source -> ordinary placeholder
```

If every song is already local, the action still performs artwork reconciliation and makes zero audio
download calls. The button remains one-shot; it does not create durable desired-membership intent,
background convergence, or persistent Keep Offline.

PR #167 merged at `8213ae7befe08bc0a21c76bd70e7c8790e5bcf9f`; A003 passed focused/local
proof plus exactly one three-song connected Journey and fresh Assurance.

The lived-feedback refinement is now accepted Android source through PR #187:

```text
SourceOwner A003 outer RETURN
  = 98505cd4777743af508d02bd20e4c44e1faf32bfd2b779f6689214ff392abb5c

reviewed head
  = 0c6125268050ec1301d2896986a52322002922d2

reviewed / merged tree
  = aabdea09c76ef7ee46360c0210d5117f26ad80fa

merge
  = 2480ac771dfcfb20bafdc6a61da5f7081b399c56

ordered parents
  = a7301566c9131ff71d4b8ede128b3607d7fefd26
  -> 0c6125268050ec1301d2896986a52322002922d2

all seven candidate blobs
  = exact post-merge match
```

The protected Active -> Verify handshake is approved and committed. Product source is merged; the
remaining predicate is lived Android proof of the one-shot update on the real library.

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

### ML-D14 — Large offline startup source correction is merged; lived observation remains

The 785-song / 6.844-GiB device state established a real cold-start defect. A003 observed accepted
Android source taking about **36.3 seconds to first draw**. Source descent showed that persisted local
music restoration could synchronously reach full-byte SHA-256 verification across the offline
library.

Android PR #169 now owns the accepted correction. It preserves exact first-proof integrity while
moving persisted restoration out of the UI first-draw path behind session-owned `VexExecution` /
`Dispatchers.IO`, reuses durable verification receipts for unchanged MediaStore objects, and falls
back to full SHA-256 when the receipt is missing or stale.

Retained proof includes:

```text
physical receipt/integrity instrumentation = 13 / 13 PASS
20,000 unchanged v2 entries -> zero byte-verification candidates
785 legacy receipt-free entries -> one-time byte-verification path
5,000 mixed entries -> only stale subset requires byte verification
vexVerifyLocal + Android-test assembly = PASS
fresh Independent Assurance = CLEAR_ON_EXACT_HEAD
Android PR #169 = MERGED / tree-exact
```

PR #171 separately makes the asynchronous restore truthful in presentation so Downloads does not
briefly claim a terminal empty library while durable local truth is still being restored.

The product defect is therefore **source-corrected and merged**, but issue #168 intentionally retains
one lived obligation on Victor's real phone/current library:

```text
install/run current main
-> Home should no longer wait for full offline-media hashing
-> first legacy restore may continue integrity work in background
-> subsequent receipt-backed startup remains metadata-bounded
```

Keep that lived observation under the VexStream owner. The broader
`work.vexlife-android.current-state-refinement.scalability-scae-audit` remains a separate
cross-feature review and must not keep this concrete source fix looking unresolved.

### ML-D15 — Full Player is one Now Playing sheet; Android Widget work stays cross-cutting

Victor's current listening-surface intent has two distinct homes that meet at one product entry:

```text
VexStream product experience
    -> Playback Surfaces outcome
       -> optional artwork projection (source integrated)
       -> full-height Now Playing modal sheet

Reusable Android home-screen infrastructure
    -> project.android-widget-foundation
       -> semantic App Widget substrate
       -> VexStream playback widget patient zero
```

The **full player is not another playback destination/runtime and is not a second Queue owner**.
Current Android already has a bottom mini-player plus a separate full-height Queue sheet. The next
surface should converge those presentation pieces into one YouTube-Music-like transient player:

```text
Mini Player tap
    -> open FullPlayerSheet

FullPlayerSheet / Now Playing
    optional artwork
    title + artist
    previous / play-pause / next
    shuffle + repeat
    timeline / seek
    broad horizontal swipe -> existing Queue Previous / Next

FullPlayerSheet / Queue
    reveal/swap upward or through the Queue affordance
    current queue rows + current occurrence
    queue play / reorder / clear / shuffle
    repeat projection
```

Now Playing and Queue are **presentation modes inside the same sheet**. Playback, Queue and Repeat
remain sibling semantic owners; the sheet reads their current projections and routes Controls /
typed requests back through their existing Connections. Horizontal player gestures must not become
direct Media3 commands, and Queue's vertical reorder gesture remains confined to Queue rows.

The full-player sheet is Screen-local transient presentation owned by `VexStreamMusicScreen`, so
dismiss/back returns to the VexStream library without inventing another app Screen or durable
navigation stack.

Artwork has a separate cross-repository seam. That seam is source-integrated through VexStream
Music PR #10 and VexLife Android PR #172. Victor approved the protected Ready -> Active transition,
and Android PR #175 is the live Full Player implementation candidate. SourceOwner A003 passed on
corrected exact head `105754d15674c070c7655ead8170f5065def796a` / tree
`17ffc6fd0438b2e549e3e7360906e9fc444c8306`: focused Full Player proof passed,
`vexVerifyLocal + assembleDebugAndroidTest` passed, and the complete 10-path review snapshot had
zero omissions. Fresh Assurance then rechecked the prior runtime diagnostic-identity finding and is
CLEAR on that same immutable head. Victor approved the protected Active -> Verify transition after corrected-head SourceOwner A003 PASS
and fresh Assurance CLEAR. Android PR #175 then merged as `92e18331e59b55993dc2479f86fa8418c0dfdf3b`;
its merge tree is exactly the A003-proven candidate tree
`17ffc6fd0438b2e549e3e7360906e9fc444c8306`.

Lived Verify then found one real responsiveness defect: Track activation can perform full playback
source resolution, MediaStore verification and stale-receipt SHA-256 work synchronously from the
Compose tap callback before Media3 receives the queue. PR #176 is the bounded correction: VexExecution
owns blocking preparation on IO, then hands only the Media3 mutation back to the controller's exact
application looper.

SourceOwner A001 reached the exact candidate but correctly stopped on a brittle new proof assertion:
the test compared exact executor thread names even though coroutine debug mode may decorate them.
Production handoff source did not change. SourceOwner A002 then fully passed on
`fa7840b7495a8872708120edffc991026f00a612`, including both focused threading proofs, focused Track
tests, repository-local verification/Android-test assembly, and a complete five-path review snapshot.

Fresh Assurance on that A002-proven head found one real async admission regression: a second Play or
Queue action could hit VexExecution's duplicate-active source-ref guard while the first request was
still preparing and be silently dropped by the presentation caller. The bounded correction kept the
reusable handoff unchanged and made VexStream admission semantic: Play retains the latest selection
and suppresses a superseded commit; Queue preserves every admitted request in order.

SourceOwner A003 then fully passed on `40948a92d6139cc18cfb246a79c53255f6dff61c`, proving the
worker/provider handoff plus latest-Play and ordered-Queue semantics. Fresh Assurance found no
concurrency defect, but held merge because the original lived latency outcome was only partially
satisfied: playback still re-entered MediaStore verification for every shared downloaded item while
building the rendered context. That duplicated already-admitted `Downloaded` integrity truth and
could retain hundreds of receipt queries before audio begins.

The final correction consumes a shared `content://` copy directly only when its admitted digest
and byte length still match current Track identity; legacy app-private copies retain activation-time
verification. SourceOwner A004 then fully passed on exact head
`ad2f7bc6635c639acbfe92f7ceafb111772157ea` / tree
`e989326f17f48e4b4030f973ba8f5298d82bafef` across all seven changed paths. Fresh Independent
Assurance returned `CLEAR_ON_EXACT_HEAD`, and PR #176 merged as
`b6cd02f00f2d867068f7f760027d65583b567dd7`; the merge tree is exactly the A004-proven candidate
tree.

Full Player therefore remains in **Verify** with source correction, Assurance and integration
complete. Verify -> Done is held only for Victor's lived review of corrected current main; it is not
implied by source proof or merge.

### Offline artwork durability

The earlier Now Playing artwork task is now **COMPLETED** for its actual bounded claim: VexStream
Desktop projects optional admitted HTTPS `artworkUrl` metadata, Android carries it through the
sanitized catalog, and Media3 receives it for current playback.

Victor then identified a different lived gap: downloaded/local-only songs do not retain that artwork
as durable offline experience, and ordinary track rows still render the generic music placeholder even
when artwork metadata exists. That is tracked separately as
`work.vexstream.mobile-library.offline-artwork-durability`.

Current Android PR #177 is the bounded source candidate. SourceOwner A002 fully PASSed on
`b70fd90a4de27fad9eb7e450f58cff444ecdf798`, then fresh Assurance found one bounded-lifetime
scalability gap: one background run could continue serially through hundreds of cover timeouts after
connectivity degraded.

The same PR corrected that gap on head
`47d76bee1e1308df82d4caabf0afffa230e128dc` / tree
`00e516f2b03b1bae5158b6f195e569e6a24eb4aa`. Before every request it re-checks current Hub Ready,
stops after three consecutive artwork failures, and advances a rotating in-memory candidate offset
after each attempt so bad sources cannot starve later covers.

Corrected-head SourceOwner A003 fully PASSed, fresh Independent Assurance returned
`CLEAR_ON_EXACT_HEAD`, and PR #177 merged as
`c5c2014733572da22cb320ec32801f10bcbedf65`. The accepted merge tree exactly equals the A003-proven
candidate tree. Source implementation and integration are therefore complete; the Work item remains
`RUNNING` until the project-authorized Active -> Verify lifecycle transition is explicitly admitted,
and lived Android review remains separate from source proof.

Desktop-local MP3 embedded ID3/APIC art is **not** currently extracted by VexStream's filesystem
metadata owner. PR #177 therefore improves every track that already has an admitted artwork URL but
does not fabricate cover art for sources where the producer has none.

The Android home-screen widget remains deliberately outside this VexStream outcome. Its concrete
patient-zero realization should be one compact horizontal row:

```text
artwork | title / artist | previous | play-pause | next
```

Widget Controls route to the same Playback/Queue owners. Tapping artwork/content should enter the
registered VexStream Screen and open the same FullPlayerSheet. That external entry is an app/product
integration concern: the generic widget foundation owns projection/action boundaries, while the
VexStream widget owns its concrete `GlanceAppWidgetReceiver`, Activity intent, and mapping into the
existing VexRuntime navigation/presentation truth.

```text
APP_WIDGET != PLAYBACK_OWNER
FULL_PLAYER_SHEET != PLAYBACK_OWNER
FULL_PLAYER_SHEET != QUEUE_OWNER
GESTURE != EFFECT
ARTWORK_URI != MEDIA_IDENTITY
EXTERNAL_ACTIVITY_ENTRY != SECOND_NAVIGATION_TRUTH
```

## Current active defects — artwork + build continuity

### Embedded artwork producer edge

Source descent reached the current VexStream Desktop owner and resolved the first artwork question:

```text
repo.vexstream-music = vgong24/VexstreamMusic
main = 6ab8fef3e0acdf3a919fc64f9e28e3758060ec15

v2/desktop/library/filesystem/metadata.go
    parses ID3 text:
      TIT2 / TPE1 / TALB / TCON / TDRC / TYER
    does NOT parse:
      APIC embedded cover art

v2/desktop/mobile/catalog.go
    artworkUrl = projectArtworkURL(Track.ThumbnailURL)
    accepts only existing external HTTPS thumbnail URLs
```

So the lived placeholder for ordinary filesystem MP3s is currently an **upstream producer-stage
gap**, not evidence that Android never implemented artwork presentation.

Active owner:

```text
work.vexstream.mobile-library.current-artwork-availability = RUNNING
github.issue.vexstream-music.11
github.pull.vexstream-music.12
head = f2f7c17ae8fb663686073056d6b18520a106244d
tree = 8a408e315de793f06b4b9f0b943f2c829f00c81d
```

The intended repair must keep filesystem/library as metadata owner, use an authenticated/pinned
mobile artwork projection for Desktop-served embedded art, and preserve Android/widget as bounded
consumers.

### Pairing continuity through proof builds

Post-merge device A003 = **PASS**:

```text
outer RETURN = sha256:07bd56a7d0cd3a3051f6affc411731f1a63887a9266c4170e3e522fd16556a17
inner RETURN = sha256:a830542dfb9ccd655952b99ec8d1cec10a068a3cbd8dd2da4fcab4e1fbd7672a

pre-existing private pairing record = PRESENT
focused connected tests = 3 / 3 PASS
target package after proof = INSTALLED
pairing record after proof = PRESENT
pairing record byte-exact before/after = PASS
MainActivity launch Status = ok
credentials serialized into evidence = NO
```

Machine proof is complete, and Victor clarified the human boundary afterward: ordinary
data-preserving build/proof continuity is the outcome this Work owned. A true app uninstall/reinstall
still loses the app-private pairing/Keystore identity, but that is acceptable as a separate
non-blocking future concern rather than a failure of PR #180.

Therefore:

```text
work.vexstream.mobile-library.pairing-reconnect-build-continuity = COMPLETED

work.vexstream.mobile-library.pairing-continuity-after-uninstall-reinstall
    = CAPTURED / TODO / NON-BLOCKING
```

The future item must not weaken TLS pinning or pretend deleted Android Keystore identity survived.
It exists only so a deliberate cross-uninstall continuity design can be revisited later.


The reconnect defect is also now causally narrowed.

Product source already persists pairing in app-private SharedPreferences plus Android Keystore, and
`reconnectPairedVexStream()` reuses the remembered pinned certificate/token. The destructive edge
was repository proof tooling:

```text
AGP connected instrumentation default
    -> uninstall test-installed APKs after run
    -> app-private pairing + Keystore identity erased

ordinary adb install -r
    -> data-preserving reinstall
```

The repository did not bind AGP's data-preserving switch. Android PR #180 now does:

```text
android.injected.androidTest.leaveApksInstalledAfterRun=true

github.pull.vexlife-android.180
head = ec12655534a5cb0249a01f4e5c8e02e3d97cc329
tree = 6d08f6aec82fb2ecd797e1397d9c2185a658ca05

work.vexstream.mobile-library.pairing-reconnect-build-continuity = COMPLETED
```

PR #180 also makes `vexFoundationHealth` guard that invariant and documents destructive proof as an
explicitly isolated effect rather than a routine teardown.

### Uninstall/reinstall pairing continuity is deliberately backlog

Victor confirmed that after an actual Android **uninstall + reinstall**, VexLife does not retain the
previous VexStream pairing. That is consistent with the current storage boundary:

```text
uninstall
-> app-private SharedPreferences removed
-> Android Keystore aliases removed
-> remembered bearer / pinned pairing identity unavailable
```

The current experience lane does **not** treat this as a blocker. It is retained for later as:

```text
work.vexstream.mobile-library.pairing-continuity-after-uninstall-reinstall
state = CAPTURED
priority = NORMAL
authorityDisposition = AUTHORIZED_BOUNDED
effectDisposition = NO_EFFECTS
```

Do not reopen PR #180 or weaken current pairing authority to solve that future question.

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


### ML-D16 — Lived artwork availability is still incomplete across playback surfaces

The optional artwork projection and offline companion-cache source are real accepted work, but the
2026-10-25 physical launcher/full-player review still showed generic music placeholders rather than
album covers.

This does **not** mean the artwork stage was skipped. Current accepted ownership is narrower:

```text
VexStream producer metadata
    optional admitted https:// artworkUrl
        -> Android catalog
        -> Media3 current item
        -> optional app-private persisted artwork for eligible downloaded tracks
        -> playback/widget projection
```

Known source limit already documented by this Project: VexStream filesystem metadata does not yet
extract embedded MP3 ID3/APIC cover art. PR #177 also intentionally persists only artwork that already
has an admitted source URL; it does not make the widget an image fetcher or invent missing producer
metadata.

The lived screenshots therefore create a new bounded defect rather than reopening the completed
projection contract:

```text
work.vexstream.mobile-library.current-artwork-availability
```

The next worker should identify which of these is true for the observed current tracks:

1. producer emitted no artwork URL (including embedded-art extraction gap);
2. Android catalog/Media3 lost an admitted URL;
3. rightful Android artwork caching did not converge for the current item;
4. cached bytes exist but player/widget projection failed to consume them.

Repair the rightful failing owner. Preserve:

```text
WIDGET != ARTWORK_FETCHER
ARTWORK_URI != MEDIA_IDENTITY
MISSING_ARTWORK != AUDIO_INTEGRITY_FAILURE
```

Private lived image evidence is retained outside the public repository. Stable evidence identities:

```text
full-player placeholder:
sha256=dac704615d19231a315dd3e0869219216858206ab4d54cce9acc99afc4d0a8e1

launcher widget placeholder:
sha256=f96a84375afd3804a706f532ae95731c2d3d05641a9fe761aecee465e244a3b5
```

### ML-D17 — New-build reconnect continuity is an observed VexStream pairing regression

Victor reports that after newer Android builds are installed, VexLife can no longer reconnect to the
Desktop's already-existing VexStream connection.

Current source shows this pairing is **not Room/database-owned**:

```text
VexStreamConnectionStore
    app-private SharedPreferences: vexstream-mobile-connection
    exact host / port
    pinned TLS certificate SHA-256
    encrypted bearer token

Android Keystore
    AES key alias: vexstream.mobile.connection.token.v1
    device-signing alias: vexstream.mobile.device.signing.v1
```

`reconnectPairedVexStream()` already intends to reuse that remembered connection. It first tries the
remembered local/direct/relay routes; if those fail, bounded nearby discovery may update a changed LAN
host/port only when the discovered Desktop has the **same pinned certificate**.

Therefore ordinary process restart or a data-preserving app upgrade/reinstall is intended to remain
reconnectable. The current lived failure is real, but its exact cause is still **UNKNOWN**.

Leading causal boundary for the next worker:

```text
ordinary data-preserving new build
    SHOULD preserve app-private pairing + Keystore continuity

explicit app Clear Data / uninstall
    DOES NOT preserve app-private pairing/Keystore by current design

Durable Device Music Library
    separately survives Clear Data through device media rediscovery
    != pairing credential durability
```

Do not solve this by weakening TLS pinning, silently accepting a different Desktop credential, or
pretending the durable media library owns pairing.

New Work:

```text
work.vexstream.mobile-library.pairing-reconnect-build-continuity
```

Fresh-instance diagnosis should capture exact before/after facts around one new-build installation:

- whether `vexstream-mobile-connection` preferences still exist;
- whether the encrypted token can still be decrypted with the existing Keystore key;
- whether the app package/signing/applicationId stayed continuity-compatible;
- whether the build/test installation path cleared/uninstalled application data;
- whether the Desktop still accepts the remembered token and pinned certificate;
- whether fallback discovery sees the same certificate and only needs a host/port reroute.

Then repair the smallest rightful owner. If the destructive behavior belongs to proof/install tooling,
keep product pairing semantics intact and isolate proof builds from Victor's lived pairing rather than
teaching the product to recover from an unauthorized credential reset.

### ML-D18 — Freshness discovery is required; catalog-added and device-downloaded are different clocks

Victor's lived review exposed a concrete navigation failure: after downloading new songs, there is no
obvious way to find the fresh material again. The accepted Sort / Filter surface therefore returns
from human review to active refinement.

The word **Recently added** must not hide two distinct truths:

```text
ADDED_TO_VEXSTREAM_CATALOG
    producer/library chronology
    VexStream Desktop already owns Track.AddedAt

DOWNLOADED_TO_THIS_ANDROID_DEVICE
    local-copy chronology
    Android currently carries verified copy identity, but no equivalent VexStreamTrack/offline-index
    timestamp in the mobile contract
```

Current Desktop `Track.AddedAt` is not projected by `v2/desktop/mobile/catalog.go`, and current
Android `VexStreamTrack` / `VexStreamOfflineIndex` do not carry either freshness clock. So this is
not truthfully a UI-only dropdown addition.

The refinement should expose the human question explicitly—at minimum a way to find newly added music
and newly downloaded/on-device music without conflating the clocks. Sort, Filter, Search, row playback,
Play All and Shuffle All must continue to consume one coherent organized membership.

Work:

```text
work.vexstream.mobile-library.sort-filter-controls
  WAITING_HUMAN -> RUNNING
  label -> Sort / Filter / Recently added library controls
```

### ML-D19 — Missing-artwork reconciliation is not persistent Keep Offline sync

The embedded-artwork producer and Android consumer are accepted source, yet lived playback can still
show placeholder artwork. The earlier decomposition therefore captured a separate
`work.vexstream.mobile-library.missing-artwork-reconciliation` item with no implementation authority.

Victor's 2026-10-26 lived feedback resolved the product shape more simply: the existing settings-level
missing-song action should also reconcile missing admitted artwork. A second button/lifecycle owner
would add ceremony without adding a distinct human capability.

```text
ONE_SHOT_MISSING_CONTENT_UPDATE
    refresh current Desktop catalog

    audio
      currently missing exact media -> download
      already downloaded -> keep

    artwork
      known source + local cache present -> keep
      known source + local cache missing -> fetch/cache
      no admitted source -> ordinary placeholder

    never redownload audio because artwork is absent
    never make widget/full-player a fetch owner

PERSISTENT_KEEP_OFFLINE_SYNC
    continuously mirror durable desired media membership as producer membership changes
```

VexWork therefore returns
`work.vexstream.mobile-library.contextual-download-missing` from `WAITING_HUMAN` to `RUNNING`
inside its already-authorized bounded envelope and moves the separate artwork-reconciliation identity
from `DECOMPOSED` to `CANCELLED`. The cancellation removes a duplicate implementation owner; it
does **not** cancel the artwork requirement.

Accepted Android source:

```text
github.pull.vexlife-android.187
github.commit.vexlife-android.2480ac771dfcfb20bafdc6a61da5f7081b399c56
work owner = work.vexstream.mobile-library.contextual-download-missing
state = VERIFYING
remaining = lived phone proof
```

Current-track Media3 metadata convergence remains separately owned by
`work.vexstream.mobile-library.current-artwork-availability` / Android PR #186.
