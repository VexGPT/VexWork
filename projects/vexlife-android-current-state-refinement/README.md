# VexLife Android Current-State Refinement

`[VXG RealForever]`

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

Dynamic collection / large-state behavior
  -> ready for focused review

VexMaps search -> route -> navigation experience
  -> ready for separate product/design review

Conversation long-history/state growth
  -> ready for focused review

Performance diagnostics / reusable guardrails
  -> ready for focused review

VexStream 36-second startup defect
  -> remains owned by project.vexstream.mobile-library / Android issue #168
```

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
