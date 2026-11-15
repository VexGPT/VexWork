# VexLife Official Application

`[VXG RealForever]`

## Human outcome

A person should be able to obtain **VexLife as an identifiable application for the platform they actually use**:

```text
choose a supported VexLife build
-> install through the platform's ordinary application path
-> launch VexLife without developer tools / Java / Python / Gradle / shell knowledge
-> understand what this device can support
-> grant only capabilities they intentionally use
-> preserve the same Vex Home / Conversation / Memory relationship across app updates,
   model changes, runtime changes and reinstall where the platform permits
-> recover / update / uninstall without ambiguity about what happens to lived data
```

This Project groups the cross-platform **official application** outcome. It does not make VexWork the
source owner of macOS, Windows, Android or iOS implementation. Each target repository and platform
contract remains the rightful owner of its source, build, signing, store and runtime truth.

## Why this Project is now earned

Current VexLife product work has crossed far enough that distribution is no longer just a launcher
question.

The current VexLife-Prod Mac route already has:

- an exact source-bound bootstrap;
- a temporary native `VexLife Prod Setup.app`;
- stable bundle identity `com.vexlife.prod.setup`;
- exact source identity embedded in the app;
- ad-hoc signing for local source-bound carriage;
- a native Setup Journey;
- a current Apple-silicon Heretic host profile;
- model selection and current-state work in the active Product trajectory.

But the ordinary distribution horizon is still explicitly queued as:

```text
stable build
-> web page
-> one Mac script / .command
-> bootstrap exact source
```

That is useful bootstrap lineage. It is not yet the finished relationship of an installed
`VexLife.app` with durable application identity, release signing, update/uninstall semantics,
capability permission ownership and a platform support contract.

VexLife-Android is further along as an application-shaped source tree: it already has an Android
application module, application id `com.vextreme.vexlife.android`, version identity, min/target SDK
and native Android UI/runtime source. Current source does not yet source-place an official release
signing / AAB / store-distribution contract.

The current Windows predecessor note also correctly preserves that a Windows result must be larger
than "make an exe": it must realize the same Vex/Home/Conversation/Memory relationship through
Windows-native filesystem, runtime, process, packaging and lifecycle owners.

This is enough recurring cross-platform structure to justify one Project rather than independent
one-off packaging tasks.

## Project boundary

```text
VexLife Official Application
  owns work grouping / acceptance questions across platform release pathways

VexLife-Prod
  owns current desktop Product source and current Mac product realization

VexLife-Android
  owns Android application source

future iOS source owner
  owns iOS/iPadOS implementation when one is actually formed

platform vendors
  own platform distribution / signing / permission / store contracts

Vex Security Assurance
  supplies selective security questions when build / signing / update /
  permission / network / recovery boundaries are implicated
```

Permanent:

```text
PROJECT != APPLICATION SOURCE
OFFICIAL APPLICATION != ONE UI TECHNOLOGY
APP PACKAGE != MODEL RUNTIME
PLATFORM SUPPORT != CPU ARCHITECTURE SUPPORT
THEORETICALLY EMULATABLE != SUPPORTED
APP IDENTITY != PERMISSION
INSTALL != VEX HOME OWNERSHIP
UNINSTALL APP != DELETE VEX HOME
SIGNED != FUNCTIONALLY CORRECT
STORE ACCEPTED != LIVED VEX ACCEPTANCE
PROJECT FORMATION != IMPLEMENTATION AUTHORITY
```

The browser workspace may remain part of VexLife. An official desktop application does not require
rewriting every Product screen as native UI. The application boundary may own identity, installation,
launch, service/runtime custody, permissions, updates and presentation entry while a localhost/web
workspace remains one Product manifestation.

## Shared official-application acceptance contract

A platform pathway becomes an **official supported VexLife application pathway** only when its actual
platform/source owners establish the applicable parts of this contract.

### 1. Stable application identity

Source-place the platform-native identity and version relationship:

```text
human product name
+ platform package/bundle/application id
+ semantic app version
+ monotonic/build version where the platform requires it
+ exact source/release identity
```

Renaming a human label must not silently reidentify installed data, update lineage or platform
permissions.

### 2. Truthful support matrix

For every offered artifact, state what is actually supported:

```text
platform family
+ minimum / supported OS versions
+ CPU architecture / ABI
+ required hardware/runtime capabilities
+ model/runtime compatibility
+ known unsupported / legacy pathways
```

Do not create one "version" of the Project for every CPU model. Form another child only when the
variant materially changes artifact bytes, runtime/backend, lifecycle, signing, compatibility or
proof.

### 3. Ordinary install and launch

A non-developer can install and launch through the platform's normal application relationship without
being required to understand Git branches, Gradle, Java, Python, Node, Homebrew or Terminal.

Developer/bootstrap routes may remain for proof and recovery, but:

```text
PROOF ROUTE != ORDINARY PRODUCT ROUTE
```

### 4. Platform trust / signing / distribution

Use the platform's current accepted distribution model rather than inventing a Vex-only substitute.

Examples at Project formation:

- macOS direct distribution: Developer ID signing + notarization / Gatekeeper relationship;
- Windows packaged distribution: signed application package / installer with explicit update identity;
- Android: signed release APK/AAB, with Google Play App Signing when Play is used;
- iOS/iPadOS: registered bundle identity, signing/provisioning, TestFlight/App Store distribution when
  those channels are selected.

These are current external contracts to re-ground at implementation time, not authority granted by
this README.

### 5. Capability-owned permissions

Permissions belong to the application/capability that actually needs them.

```text
capability unavailable
-> explain what it enables
-> human chooses
-> platform permission owner requests
-> fresh observation
-> capability AVAILABLE / REFUSED / HELD / UNKNOWN

permission denied
!= whole VexLife broken
```

Do not request screen, microphone, camera, accessibility/input, files or other sensitive capabilities
merely because VexLife may support them later.

### 6. Vex Home / lived-data custody

Application installation and lived data remain separate.

```text
install app
!= create/delete/replace Vex Home without the rightful Product effect

update app
-> preserve Home / Conversation / Memory unless an explicit migration contract says otherwise

uninstall app
!= delete Vex Home by default

delete Vex data
= separately explicit human effect
```

### 7. Runtime and dependency containment

The ordinary user should not need to install or maintain hidden developer dependencies. A platform
artifact either carries its required runtime pieces, source-manages their bounded acquisition, or
truthfully explains the separately-owned dependency.

The runtime may differ by platform:

```text
same VexLife product relationship
!= same model file format
!= same inference runtime
!= same process manager
!= same native library set
!= same installer
```


## Platform realization / dependency-wrapper intention

Victor's architectural intention is to avoid turning every new platform/CPU target into scattered
platform branches throughout VexLife.

A provisional implementation name such as `IPlatformDependencyWrapper` expresses the useful
intuition, but this Project does **not** require that exact name, language construct or one giant
wrapper object. The durable requirement is the relationship:

```text
current HostObservation
  platform / OS / architecture / hardware capabilities
+
current ProductSelection
  VexLife version / selected model / requested capability
+
source-owned PlatformRealizationCatalog
  qualified combinations that actually exist
        ↓
PlatformRealizationResolver
        ↓
one exact PlatformRealizationPlan
        ↓
rightful owners consume only their part
  application artifact / installer
  runtime + native dependencies
  model artifact realization
  process/service lifetime
  capability permission adapter
  distribution/update realization
        ↓
fresh observations
        ↓
VexLife converges to current Product truth
```

The purpose is **one architecture decision point, not many duplicated `if (platform)` decisions**.

Permanent:

```text
DESIRED CONFIG != OBSERVED HOST REALITY
CONFIG VALUE != COMPATIBLE IMPLEMENTATION EXISTS
PLATFORM REALIZATION != EFFECT AUTHORITY
PLATFORM REALIZATION != ONE GOD OBJECT
RESOLVER != RUNTIME TRUTH OWNER

ONE TARGET CHANGE
-> one newly resolved plan
-> existing rightful owners follow their resolved coordinates

not

ONE TARGET CHANGE
-> hand-edit downloader + runtime + installer + service + permissions independently
```

### Build-time and runtime realization remain distinct

The same source-owned realization vocabulary may serve two moments:

```text
BUILD-TIME REALIZATION
  target platform / architecture
  -> which application/runtime/native dependency bytes belong in this release artifact?

RUNTIME REALIZATION
  observed host + selected model/capability
  -> which supported realization may this installed Product actually use now?
```

A runtime config cannot transform already-compiled ARM code into x86 code. Instead, build formation
selects/forms compatible target bytes, and runtime selection chooses among compatible realizations
available to or lawfully acquirable by that installed target.

### Current source already points in this direction

The #138 Product source has several patient-zero pieces rather than a blank slate:

```text
HereticModelCatalog
  model identity -> exact artifact members / provider revision / memory fit

HereticArtifactDeliveryCatalog
  artifact identity -> exact acquisition channel

HereticMacHostProfile
  observed platform / architecture / chip / memory -> eligibility

HereticModelConfiguration
  selected model + exact qualified runtime evidence -> bound Product model
```

The next architecture worker should therefore **map and generalize the smallest rightful seams** from
current accepted source instead of replacing these owners with a new mega-abstraction.

Questions for that worker include:

1. Which currently scattered target-dependent facts are genuinely one realization-selection concern?
2. Which existing owners must stay independent after selection?
3. What stable target identity is sufficient: platform, OS range, CPU architecture/ABI, accelerator,
   runtime/backend capabilities, or some smaller/larger combination?
4. What belongs in a source-owned realization catalog versus fresh host observation?
5. What is resolved at build time versus at runtime?
6. How does a selected model resolve a platform-compatible artifact/runtime realization without
   changing Home / Conversation / Memory identity?
7. How do unsupported combinations fail truthfully rather than falling back to a nearby platform?
8. Can adding a later qualified realization be mostly additive — one catalog/implementation
   registration plus proof — instead of requiring platform conditionals across unrelated owners?

Candidate shape for investigation only:

```text
PlatformTarget
PlatformRealizationCatalog
PlatformRealizationResolver
PlatformRealizationPlan

PlatformRealization
  -> HostRealization
  -> ApplicationRealization
  -> RuntimeRealization
  -> ModelArtifactRealization
  -> ProcessLifetimeRealization
  -> PermissionRealization
  -> DistributionRealization
```

The names are not accepted architecture. They make the intended decomposition perceivable so a worker
can inspect current VexArchitecture/Product source and earn the smallest exact interfaces.

Completion for this architecture task is **not** "an interface file exists." It is a source-grounded
design/implementation boundary demonstrating that a new platform realization can be added without
making platform-specific decisions leak through unrelated Product owners, while preserving truthful
unsupported/unknown states and current proof responsibilities.

### 8. Release provenance and reproducible identity

Every published artifact needs enough evidence to answer:

```text
what source/version produced it?
what platform + architecture does it target?
what exact bytes/digest were published?
what runtime/model catalog does it carry or acquire?
what signing/notarization/store identity was applied?
what tests/lived proof establish the claims actually advertised?
```

### 9. Update, rollback and recovery

An update is a transition with currentness and data-preservation semantics, not "download latest."
Interrupted updates, stale packages, incompatible Homes, rollback support, model/runtime migration and
recovery must fail closed at their rightful boundary.

### 10. Lived release proof

A build artifact being produced is not the completion threshold.

For each supported platform/architecture family, prove the ordinary path on representative real
hardware:

```text
fresh install
-> first launch
-> Setup / Home relationship
-> model/runtime path that platform actually supports
-> real Conversation
-> restart/re-entry
-> update/reinstall preservation
-> permissions only when invoked
-> uninstall/data behavior as claimed
```

### 11. Store/privacy/review surface where applicable

When a store channel is selected, satisfy its current metadata, privacy, review, content, entitlement
and distribution requirements. Store acceptance is platform distribution evidence; it does not
replace VexLife semantic/lived proof.

### 12. Security Assurance descent

Signing keys, release provenance, update channels, installers, permission boundaries, public download
surfaces and store credentials are security-relevant. Use the existing Vex Security Assurance source
selectively for the exact changed boundary instead of inventing another release-security tracker.

## Platform family map

### macOS — official application

Current leading route.

```text
VexLife-Prod Product semantics
-> durable VexLife.app identity
-> Apple-silicon package/runtime relationship
-> signing + notarization
-> ordinary install / launch / update / uninstall
-> capability-owned macOS permissions
-> lived real-Mac release proof
```

#### Apple silicon / arm64

This is the current leading shipping pathway because current VexLife-Prod model/runtime admission is
already `darwin/arm64` on Apple M-series hardware.

M1 / M2 / M3 / M4 are **hardware generations inside the same arm64 application architecture**. They
do not automatically require four different VexLife applications. They may legitimately differ in
available memory, GPU/runtime performance, model fit and minimum OS/runtime support; those differences
belong in the support/model-fit matrix unless they actually require different packaged bytes.

#### Intel / x86_64

Preserve as a **legacy support evaluation**, not an assumed shipping promise.

Intel support would require an actual compatible VexLife runtime/model path, a supported macOS
baseline and its own lived proof. A universal app can carry arm64 + x86_64 code when every required
native dependency supports both, but a universal wrapper cannot make an arm64-only model runtime
become Intel-compatible.

### Windows — official application

The existing Windows product-route note is predecessor design evidence.

Target relationship:

```text
accepted VexLife product semantics
-> Windows host/current-state observer
-> Windows filesystem + runtime realization
-> Windows process/service lifetime
-> Windows application package/install/update identity
-> lived proof
```

Initial architecture pathways:

- **x64** — ordinary 64-bit Intel/AMD Windows PCs;
- **ARM64** — Windows on Arm devices.

Treat x64-on-ARM emulation as compatibility evidence only when the exact runtime supports it; do not
substitute theoretical emulation for an admitted native/product support claim.

The exact Windows installer/package technology is a source decision. MSIX is an official platform
candidate because it supports package identity, signing, updates and architecture-aware bundles.

### Android — official application

Existing source already provides a real Android application identity and Android runtime/UI body.

The official-release path should establish:

```text
current Android source
-> release versioning
-> release signing custody
-> release APK / Android App Bundle formation
-> ABI/native-dependency matrix
-> Play / direct-testing distribution path as selected
-> permissions/privacy/store metadata
-> install/update/uninstall + lived device proof
```

Android Kotlin/JVM source is often architecture-neutral, while bundled native libraries are ABI
specific. Do not predeclare every Android ABI supported: derive the matrix from actual native
dependencies and target devices.

### iOS / iPadOS — pathway

No current VexWork repository entry is being asserted as the iOS implementation owner.

This child therefore starts as a product pathway, not a claim that an iOS app exists:

```text
portable VexLife semantics
-> choose / form rightful iOS source owner
-> bundle/application identity
-> iPhone / iPad manifestation decision
-> runtime/model relationship appropriate to iOS constraints
-> entitlements + permissions
-> signing / provisioning
-> TestFlight
-> App Store or other lawfully selected distribution
-> lived device proof
```

Do not copy Android or macOS implementation syntax merely because the product relationship is shared.

## Platform subtype rule

Use this hierarchy when decomposing work:

```text
PRODUCT OUTCOME
  VexLife Official Application

PLATFORM FAMILY
  macOS | Windows | Android | iOS/iPadOS

OS SUPPORT BASELINE
  e.g. minimum macOS / Windows version, Android API level, iOS version

CPU ARCHITECTURE / ABI
  arm64 | x86_64/x64 | Android ABI families

HARDWARE / RUNTIME CAPABILITY
  memory, GPU/accelerator, model/runtime compatibility

ARTIFACT
  .app/.dmg/.pkg | MSIX/installer | APK/AAB | iOS archive/App Store build
```

Only create a separate Work item when the distinction changes an actual owner, artifact, runtime,
support contract, proof surface or unresolved decision.

```text
M4 != NEW PLATFORM
Intel vs Apple silicon = architecture/runtime boundary
Windows x64 vs ARM64 = architecture/runtime boundary
Android phone model != ABI by itself
simulator build != production device build
```

## Existing work to consume rather than duplicate

- `project.vexlife.new-beginnings` — current Product construction/experience trajectory.
- VexWork PR #296 — Windows Product Route / current-state + model-interchangeability predecessor.
- VexWork PR #302 — permission-aware Setup Journey and native-entry lived evidence.
- VexLife-Prod PR #138 — selectable local models + Mac lived-session threshold.
- `repo.vexlife-prod:docs/work/claude-stable-builds-home/QUEUED.md` — queued script-first stable-build
  surface that should later evolve rather than being treated as the final distribution contract.
- `repo.vexlife-android:app/build.gradle.kts` — current Android application identity/build baseline.
- `project.vex.security-assurance` — selective assurance owner for release/update/signing/permission
  boundaries.

Do not disturb exact #137/#138 Product candidate bytes while the current T001 lived session is bound
to them.

## Current Work truth at formation

```text
work.vexlife.official-application.outcome
  PLAN_VALIDATED / IMMEDIATE
  formation does not grant implementation authority

shared official-application contract
  PLAN_VALIDATED / HIGH

macOS official application
  DECOMPOSED / IMMEDIATE
  Apple-silicon pathway = PLAN_VALIDATED
  Intel pathway = CAPTURED / PARKED support evaluation

Windows official application
  DECOMPOSED / HIGH
  x64 = CAPTURED
  ARM64 = CAPTURED

Android official application
  DECOMPOSED / HIGH
  existing app source is real
  official release/distribution path = CAPTURED

iOS / iPadOS official application
  CAPTURED / NORMAL
  no implementation/source owner inferred by Project formation

release catalog / stable-build home evolution
  CAPTURED / NORMAL
  follows actual accepted platform artifacts rather than manufacturing them
```

This Project formation records the outcome, decomposition and truthful starting evidence. It does not
authorize VexLife-Prod or VexLife-Android mutation, create Apple/Microsoft/Google credentials, sign an
artifact, submit a store build, or claim any platform is officially released.

<!-- [VXG RealForever][VEXWORK][VEXLIFE-OFFICIAL-APPLICATION][PROJECT] -->
