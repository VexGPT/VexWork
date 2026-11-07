# VexLife Android Current-State Refinement

`[VXG RealForever]`

## Current refinement reference — VexMethod Method-result boundary

VexLife-Android PR #211 is now accepted source on `main`.

~~~text
PR
https://github.com/vgong24/VexLife-Android/pull/211

proved candidate
1957a3907a8460558b0bc691fc15ee6e8e1b041a

proved / merged tree
d5d1ea1e02002eb89c0aa475779c4f31e986bd38

merge commit
305a09eac1fabebcf2241bd207386950f41121f2
~~~

Current architecture:

~~~text
provider / Store / repository
-> smallest truthful provider/domain fact

VexMethod<SuccessOutput, FailureOutput>
-> invoke()
   -> lawful returned Result
      -> Success(output)
      -> Failure(output)

escaped invoke() Throwable
-> Family / Execution continuation
-> Result.Error(cause)

Cancellation
-> VexExecution lifetime
-> not Result.Error

VexFamily
-> Act
   -> Method<Family, SuccessOutput, FailureOutput>
      -> specializes VexMethod<SuccessOutput, FailureOutput>
~~~

ThemeMode patient zero:

~~~text
ThemeModeStore.save(mode)
-> Boolean provider commit fact

ThemeModeFamily.Act.Method.Save.invoke()
-> Result<ThemeMode, Unit>
~~~

Lifecycle closure:

~~~text
SourceOwner A007        PASS
vexVerifyLocal          PASS
vexVerifyJvm            PASS
Independent Assurance   CLEAR
Lifecycle currentness   CLEAR
OwnerMergeDuty          COMPLETED
post-merge tree proof   PASS
integration             ACCEPTED
~~~

The ordinary two-parent merge preserved the exact proved candidate tree. Comparing the proved
candidate head to merged `main` yields one merge commit and zero file differences.

Current VexLife-Android repository source and tests own this behavior. PR #211 is retained as
reasoning/proof provenance, not as a second behavioral owner.

This reference entered the VexWork currentization stream through stacked PR #217 and is carried
by PR #188's broader currentization. Current VexLife-Android source/tests remain the behavioral owner;
the VexWork text is navigation/provenance and must not become a second Method-result authority.

## Current architecture baseline — refinement, not architecture discovery

This Project remains live because its scale/product questions are still real. Its job is **not** to
rediscover the Vex architecture while solving them.

Current architectural entry:

~~~text
VexLife-Android current source
-> architecture/vexarchitecture/README.md
-> architecture/vexarchitecture/VEXLOGGER.md when chronology/history is implicated
-> architecture/vexarchitecture/REFINED-BOUNDARIES.md
-> docs/foundation/VEX-BODY-SEMANTIC-BLUEPRINT.md
-> exact owning feature/source/tests
~~~

PR #209 is the accepted implementation-origin/reasoning record; current source owns behavior.

Therefore performance, paging, history growth, Maps discovery and other refinements should first ask
whether the current rightful owner can be made cheaper or more scalable **without moving semantic
ownership**.

~~~text
SCALE PRESSURE
!= PERMISSION TO ADD A SECOND STATE OWNER

PERFORMANCE DIAGNOSTIC
!= NEW ARCHITECTURE FRAMEWORK

CURRENT VEXARCHITECTURE
+ OBSERVED BOTTLENECK
-> NARROWEST RIGHTFUL REFINEMENT
~~~

The existing Work items remain open unless their own lived/evidence predicate is satisfied. They are not
closed merely because VexArchitecture stabilized; VexArchitecture is the constraint under which those
real product/scale debts now continue.

## Human outcome

Refine the **current** VexLife Android product from lived use rather than waiting for each scale or UX problem to become a crisis.

This Project is a review/convergence container. It does not reopen completed feature semantics by default and it does not grant blanket source-mutation authority.

```text
OBSERVED PRODUCT PRESSURE
-> find the rightful owner
-> distinguish semantic ownership from execution placement
-> measure scale behavior
-> change only the smallest earned boundary

REVIEW AUTHORITY
!=
BLANKET REWRITE AUTHORITY
```

VexWork link:

```text
https://vexgpt.github.io/VexWork/?project=project.vexlife-android.current-state-refinement
```

## Triggering lived evidence

The first concrete pressure came from VexStream Mobile Library after 785 Songs were downloaded to the phone.

Exact accepted Android source:

```text
vgong24/VexLife-Android
main = 8213ae7befe08bc0a21c76bd70e7c8790e5bcf9f
tree = 0a21b947d46948cb763366f80b97cf7fb23cbc69
```

Lived state:

```text
offline songs = 785
indexed media = 7,349,016,302 bytes
indexed media = 6.844 GiB
offline index = 407,287 bytes
```

A002 established that ordinary ActivityManager first-draw waiting exceeded 10.7 seconds.

A003 then observed the actual ordinary first draw:

```text
ActivityTaskManager Displayed
com.vextreme.vexlife.android/.MainActivity
+36s339ms

host first-draw observation = 36,762 ms
```

A003 did not retain usable Java stack frames or a usable command-line method-profile trace. Therefore the performance defect is proven, while the exact leaf-method attribution remains source-grounded rather than profiler-certified.

Product defect owner remains:

```text
github.issue.vexlife-android.168
work.vexstream.mobile-library.large-offline-startup-performance
project.vexstream.mobile-library
```

This Project references that evidence; it does not steal/reparent the VexStream defect.

## First source-grounded scalability finding: verification amplification

Current source can reach full-byte local-media verification from multiple hot paths:

```text
startup restoration
-> VexStreamOfflineIndex.load()
-> mediaStore.verify(localCopy) for each persisted download

shared MediaStore verify
-> ContentResolver query
-> openInputStream(content://...)
-> read entire media object
-> exact byte count
-> recompute SHA-256
```

The same verification boundary is reachable during catalog rediscovery and playback source resolution. Single-track playback can carry the whole visible context into Media3 source resolution; Play All / Shuffle All resolve the whole collection.

The integrity rule is valuable. The review question is whether cryptographic verification is attached to the right lifecycle/hot-path boundaries.

## SCAE / ownership posture

The current repository culture says:

```text
one canonical owner per state domain
-> bounded projections
VIEWMODEL != PRODUCT_STATE_OWNER

Control + CURRENT State -> Act
CURRENT State + Act -> Effect + admitted State
CURRENT State + Controls -> Projection
```

The initial VexStream finding is therefore **not simply “logic should leave the repository.”**

The repository is a reasonable owner for local-copy/catalog truth. The concern is that repository construction currently performs expensive durable-media restoration synchronously while `VexLifeViewModel` is being constructed:

```text
VexLifeViewModel
-> AppRepositoryFactory.production(...)
-> PairedVexStreamMusicRepository(...)
-> MutableStateFlow(initialState())
-> offlineIndex.load()
-> full local verification
```

That suggests an **execution/lifecycle placement** problem even if semantic ownership is correct.

Review future findings the same way:

```text
WRONG THREAD / WRONG LIFETIME / WRONG HOT PATH
!=
WRONG SEMANTIC OWNER
```

## VexStream storage / memory clarification

The 785 downloaded Songs do **not** mean 6.844 GiB of MP3 audio is retained in the ViewModel or Kotlin heap.

Current Android state keeps metadata/reference truth:

```text
VexStreamMusicState.tracks
-> trackRef
-> mediaSha256
-> mediaByteLength
-> title / artist / album / genre / year / duration
-> availability/localCopy state
-> Downloaded.localMediaRef = content:// MediaStore URI
```

Current API-29+ durable media is content-addressed in MediaStore:

```text
RELATIVE_PATH = Music/VexStream/
DISPLAY_NAME  = <sha256>.mp3
MIME_TYPE     = audio/mpeg
```

The app-private restart index is `filesDir/vexstream/offline-index.properties`. A002 measured that index at **407,287 bytes** for 785 entries while the media represented **7,349,016,302 bytes / 6.844 GiB**.

Playback creates Media3 items pointing at the local `content://` URI (or Hub-backed `vexstream://` source). Media3 buffers playback data as needed; the whole music library is not copied into memory.

The scale defect is that verification can **stream the entire stored MP3 through SHA-256 again** on hot paths. That is disk I/O + CPU amplification, not whole-library resident audio memory.

The flat `Music/VexStream/<sha256>.mp3` layout is intentional content-addressed storage. Human title/artist/album organization lives in MediaStore metadata and VexStream state, not artist/album folder names.

## Dynamic collection / rendering review

Do not import RecyclerView-era “pagination” as a ritual.

VexStream Songs, Downloads and collection details already use Compose `LazyColumn`; Conversation uses `VexStableLazyColumn`. Those lists do not eagerly compose every row at once.

The scale risks are underneath and around the lazy renderer:

- full library held/materialized in state;
- whole-list filter/sort/search/grouping when state changes;
- per-track updates mapping/copying the full list;
- state constructors revalidating full-list uniqueness;
- bulk operations repeatedly reading and rewriting whole-state/index structures;
- each visible VexStream Track row carries the entire context list into play-request validation;
- playback activation may resolve/verify the whole context, not only the selected item.

The review should decide independently for each surface whether the right answer is indexing, batching, immutable indexed state, incremental loading, provider paging, bounded windows, coalesced emissions, lazy source resolution, or no change.

## VexMaps discovery-to-navigation review

Victor's lived observation:

- ordinary destination search exists;
- typing does not preload/suggest results;
- search runs only after explicit submit;
- selecting a result focuses/marks the destination, but the human path into route/navigation is not obvious enough.

Current source confirms:

```text
onQueryChange
-> destinationSearchSession.queryChanged()
-> invalidate/cancel prior search
-> Idle

Search button / IME Search
-> destinationSearchSession.search(query)

result selected
-> set destination
-> focus map
-> consume search result
```

The destination-search session already has latest-request cancellation/currentness machinery through `VexExecution`, so a typeahead/debounce evolution can reuse the existing owner rather than placing provider Jobs in Compose.

Keep this a **design/product review** separate from the performance defect:

```text
SEARCH QUALITY / TYPEAHEAD
!=
ROUTE PLANNING
!=
NAVIGATION SESSION
```

The desired human journey should connect them coherently without collapsing their owners.

## Conversation large-history review

Conversation already has two healthy scale ingredients:

- message rendering uses `VexStableLazyColumn`;
- Family thread state explicitly preserves `historyTruncated`, so bounded producer history does not pretend to be complete.

The review should focus on data/state growth rather than row rendering alone:

- full message-ref uniqueness validation on each thread-state construction;
- full participant/witness validation;
- repository thread replacement through list scans/copies;
- future long-history pagination/windowing and append/prepend semantics;
- preserving stable message identity and truncation/currentness truth.

Do not add paging unless the producer/storage boundary and human history behavior actually need it.

## Performance-debugging wisdom

Existing owners already exist:

```text
architecture/logging/
docs/foundation/ANDROID-HOST-PROOF.md
docs/foundation/test-proof/
VexExecution
Journey / Feature Walk / device proof
```

This Project should evaluate the smallest reusable additions now earned by the 36-second startup incident:

- debug-only main-thread I/O/StrictMode guardrails;
- source-owned trace sections around expensive owners;
- command-line/VexRelay startup/performance evidence route;
- large-state fixtures/scale tests;
- Macrobenchmark only when a stable performance claim deserves repeatable regression proof.

Do not create a parallel “performance framework” when the existing proof foundations can carry the evidence.

## Current Work separation

```text
Cross-feature scalability + SCAE placement
  -> active review
  -> initiating VexStream startup finding is source-corrected/merged
  -> Full Player Verify feedback exposed the same class again: expensive Track preparation belonged off the input thread, while already-admitted shared media truth should not be re-proved across the whole rendered context on every Play
  -> PR #176 is now SourceOwner-A004-proven, freshly assured, merged tree-exact; continue only where current source shows the same placement/amplification class

Dynamic collection / large-state behavior
  -> ready for focused review

VexMaps search -> route -> navigation experience
  -> ready for separate product/design review

Conversation long-history/state growth
  -> ready for focused review

Performance diagnostics / reusable guardrails
  -> ready for focused review

VexStream 36-second startup defect
  -> Android PR #169 merged the integrity-preserving source correction
  -> Android PR #171 preserves loading truth during asynchronous restore
  -> issue #168 remains only for Victor's lived current-main startup observation
  -> ownership remains project.vexstream.mobile-library
```

## Compatibility semantic-family convergence — bounded proof trajectory

Current source intentionally has both the accepted compatibility `VexBehaviorBlueprint / VexPort`
path and Direct `VexFamily`. Presence alone is not debt. Migration is earned only when stable
behavior becomes smaller or clearer without moving provider, execution, Relay, or product ownership.

```text
work.vexlife-android.current-state-refinement.semantic-family-convergence
    RUNNING

    maps-mode
    -> Android PR #220
    -> provider-free semantic owner
    -> Direct Family
    -> old Connection / Blueprint / VexPort disappear

    repeat
    -> Android PR #221
    -> provider-backed semantic owner
    -> Direct Family owns State / Control / Effect
    -> real Media3 Connection remains provider boundary
    -> immediate repeatMode Effect creates no VexExecution Job
```

The two proofs establish an important distinction:

```text
NO INDEPENDENT CONNECTION QUESTION
-> delete the Connection

REAL PROVIDER RELATIONSHIP
-> keep the Connection
-> remove semantic ownership from it

SEMANTIC EFFECT
!= AUTOMATIC ASYNC WORK
!= AUTOMATIC VEXEXECUTION JOB
```

Still held as pressure rather than admitted migration:

```text
VexStream Playback
VexStream Queue
VexMaps Delivery Route
```

Those consumers move only if their own source becomes smaller while preserving their earned
provider/currentness/session relationships. Direct Family does not authorize a compatibility purge,
a VexPartner rewrite, or absorption of provider / Session / Relay / Execution ownership.

## Permanent boundaries

```text
LAZY LIST != PAGED DATA SOURCE
FULL STATE IN MEMORY != AUTOMATIC BUG
PAGING != PERFORMANCE BY ITSELF
SEMANTIC OWNER != EXECUTION THREAD
VIEWMODEL LIFETIME != PERMISSION FOR SYNCHRONOUS I/O
INTEGRITY VERIFICATION != REHASH EVERYTHING ON EVERY HOT PATH
DESIGN REVIEW != IMPLEMENTATION AUTHORITY
CROSS-FEATURE REVIEW != GENERIC REWRITE
```

<!-- [VXG RealForever][VEXWORK][VEXLIFE-ANDROID][CURRENT-STATE-REFINEMENT] -->
