# VexLife Official Application — macOS Apple silicon source map + implementation handoff

`[VXG RealForever]`

Status: **PREPARED IMPLEMENTATION MAP — no Product mutation authority created here**

## Why this exists

Victor recognized the gap by comparing VexLife with mature downloadable Mac software:

```text
working local VexLife
!= official installable VexLife application

script/bootstrap + Java/service + browser
!= one human-recognizable VexLife.app

platform-specific implementation details
!= reason to fork Product meaning by platform
```

The requested next worker should be able to enter the exact current VexLife-Prod source, see where
Apple-silicon assumptions and Mac manifestation currently live, and form the smallest platform
realization boundary plus an ordinary `.dmg -> Applications -> VexLife` journey without
reconstructing this map from chat.

This handoff is source-grounded against the exact Product candidate currently under Victor's T001
lived test:

```text
repository = VexGPT/VexLife-Prod
PR         = #138
head       = ef56b26d5a323c03a8e969a642ab3296b3d50360
tree       = 62f16f9fbfb3992c29be55cfa3a551059c3931e4
```

Do **not** mutate #137/#138 while T001 depends on those exact bytes. Implementation should use the
rightful successor/source-admission path after the lived test or another explicitly admitted
disjoint branch.

## Human outcome

For the leading Apple-silicon pathway, an ordinary person should eventually experience:

```text
VexLife download page / release
-> Download VexLife for Mac — Apple silicon
-> VexLife-<version>-macOS-AppleSilicon.dmg
-> macOS verifies Developer ID / notarization trust
-> person opens DMG
-> drags VexLife.app into Applications
-> launches VexLife.app

FIRST LAUNCH
-> no ambient camera / microphone / accessibility / input-monitoring permission ceremony
-> VexLife observes this Mac + existing Home/service/model truth
-> choose language
-> use suggested ~/.vexlife or choose another Home
-> choose a model that truthfully fits this Mac
-> review exact download/storage/runtime consequence
-> Set Up VexLife
-> progress remains inside the VexLife application
-> local runtime/service becomes current
-> VexLife workspace appears inside the application
-> real Conversation

LATER
-> opening VexLife.app re-observes and offers only what is currently needed
-> update/reinstall preserves Vex Home / Conversation / Memory
-> capability permission appears only when that capability is intentionally invoked
```

The browser/VexWeb Product manifestation may remain the UI source. "Official application" does not
mean rewrite the Product as Swift. The Mac application may be a thin native host around the existing
semantic setup surface + local Product service + generated VexWeb workspace.

## Current product path — what already exists

Current #138 already has most of the **inner Product circuit**:

```text
temporary source-bound bootstrap
-> temporary native Setup.app
-> Product Entry Family / Mac adapter / Setup Card
-> Vex Home
-> selectable model
-> exact model artifact materialization
-> managed Python + mlx-lm environment
-> qualified Heretic runtime
-> private Java 21 Product service image
-> installed image in Home
-> launchd-owned service
-> loopback VexLife service
-> browser VexWeb workspace
-> Conversation / Memory / capability surfaces
```

The official-app work should preserve those earned meanings and change the **outer application /
platform realization** where current implementation topology is temporary, Mac-specific, or not
distribution-qualified.

---

# 1. Exact source map

## A. Repository / foundation entry

| Source | Current responsibility | Official-app relevance |
|---|---|---|
| `AGENTS.md` | Mac startup integrity, ordinary route vs proof route, source-currentness law | Preserve the distinction: a distributable artifact is not proven merely because packaging succeeds. |
| `docs/CULTURE.md` | semantic owner -> typed relationship -> projection -> realization -> proof | The app host/renderers consume Product meaning; they do not become semantic owners. |
| `docs/foundation/INDEX.md` | current subsystem map/status | Worker entry for every current owner below. |
| `README.md` | Product front door/history | Do not reintroduce historical repository-level ownership claims. |

## B. Current distribution/bootstrap carriage

| Source | Current responsibility | Pressure / likely evolution |
|---|---|---|
| `build.gradle.kts` | builds self-contained darwin-arm64 private service image; archives release/bootstrap assets | Add/compose an official Mac application artifact pipeline rather than making the current private image itself the human app. |
| `packaging/private-service-image/release-contract.json` | current `darwin-arm64` private-service release names/channel | Split/compose private service payload identity from official application release identity. |
| `packaging/bootstrap/vexlife-prod-bootstrap.command.template` | downloads exact archive, hashes it, forms temporary `VexLife Prod Setup.app`, ad-hoc signs, opens it | Becomes predecessor/proof/bootstrap lineage. Ordinary public route should no longer require a script or local `osacompile`. |
| `src/jvmMain/kotlin/vexlife/packaging/VexLifeProdPrivateServiceImage.kt` | exact image observation; `Platform="darwin-arm64"`; Java 21 payload; Vision artifact binding | Keep exact source/payload verification; make target/platform identity resolve through the platform realization where appropriate. |
| `VexLifeProdPrivateServiceImageInstaller.kt` | installs exact image beneath Vex Home | Re-evaluate whether executable application/service code belongs under Home for the official path versus inside the signed app bundle. Preserve Home/data custody either way. |
| `docs/foundation/PRIVATE-SERVICE-IMAGE.md` | rationale for self-contained Java runtime without user JDK | Strong reusable foundation: the user still should not install Java. |
| `docs/foundation/PRIVATE-IMAGE-INSTALL-SETUP.md` | image install/setup ownership | Preserve effect separation if packaging topology changes. |

Current temporary setup bundle identity:

```text
VexLife Prod Setup.app
CFBundleIdentifier = com.vexlife.prod.setup
signing = ad-hoc
source SHA embedded
```

That identity is **not automatically the final public VexLife bundle identity**. The official bundle
identifier/version/update lineage must be chosen and source-placed deliberately.

## C. Portable Product entry meaning + current Mac presentation

| Source | Current responsibility | Official-app relevance |
|---|---|---|
| `src/commonMain/kotlin/vexlife/entry/VexLifeProdEntryFamily.kt` | portable entry State / Control / Effect / DisplayState | **Keep portable.** Main app should consume this rather than write a second setup decision tree. |
| `src/jvmMain/kotlin/vexlife/setup/VexLifeProdMacFrontDoor.kt` | Mac adapter: Home + host + model + service observations -> portable Entry State | Key platform seam. It should receive/resolve current Mac realization rather than directly encoding every future platform dependency. |
| `VexLifeProdMacSetupCard.kt` | native Mac card meaning from DisplayState + observed facts | Preserve as human-facing Mac projection. A new native app renderer can consume the same Card. |
| `VexLifeProdSetupElements.kt` | setup element/key relationship | Reuse. |
| `VexLifeProdSetupLanguage.kt` | language selection | Reuse. |
| `VexLifeProdSetupModel.kt` | model chooser, transient before Home / durable after Home | Reuse. |
| `packaging/private-service-image/setup/vexlife-prod-setup-window.applescript` | current AppKit manifestation; navigation + progress; opens loopback URL after CURRENT | Renderer precedent, not required final host form. Main VexLife.app should own the window/lifecycle rather than creating a temporary app. |
| `localization/strings/source/setup.json` | setup words in keyed source | Preserve. New trust/permission copy should be keyed here or the rightful earned scope, never hardcoded in renderer code. |
| `docs/foundation/SETUP-JOURNEY.md` | current semantic journey | Preserve semantic sequence and re-observation law. |
| `docs/work/claude-setup-journey/SCREENS.md` | generated screen examples | Useful manifestation oracle; some host wording reflects earlier pre-#138 profile and must not override exact current source. |

Current #138 model-selection source says host admission is now Apple silicon + enough memory for the
smallest offered model; exact `HereticMacHostProfile` is current truth. Older generated screen examples
that say "M4 Pro only" are historical/stale for that point.

## D. Host/current-state assumptions that should feed the realization resolver

| Source | Current responsibility | Platform-realization pressure |
|---|---|---|
| `src/jvmMain/kotlin/vexlife/service/VexLifeProdCurrentState.kt` | read-only human current-state projection | Currently directly calls `HereticMacHostProfile.observeCurrent()`. Candidate consumer of a resolved Host/Platform realization. |
| `src/jvmMain/kotlin/vexlife/model/heretic/runtime/HereticMacHostProfile.kt` | `darwin/arm64`, Apple M-series, memory eligibility | Correct Mac-native owner. Keep it as a Mac realization rather than copy its logic into generic Product code. |
| `src/commonMain/kotlin/vexlife/model/heretic/HereticProductIdentity.kt` | model/runtime identity | Contains Mac-specific refs today: `adapter.runtime.mlx.macos-victor.001`, `profile.repository.vexlife-prod.macos-v1`. Strong pressure to separate stable model identity from target runtime realization. |
| `HereticModelCatalog.kt` | offered models + exact model bytes + memory need | Strong reusable catalog precedent. Model availability should resolve against target/runtime compatibility rather than duplicate catalog entries just because the platform changed. |
| `HereticModelConfiguration.kt` | Home-scoped selected/bound model; qualified runtime evidence | Preserve Home/Conversation identity while runtime realization changes. |
| `HereticArtifactCatalog.kt` | exact artifact descriptors | Preserve exact identity. |
| `HereticArtifactDeliveryCatalog.kt` | artifact -> exact acquisition channel | Good example of an interface/catalog below semantic identity. |
| `HereticArtifactMaterialization.kt` | exact local materialization for selected catalog entry | Already relatively target-agnostic in shape; do not make it decide platform. |
| `DirectHttpsArtifactDelivery.kt` | resumable credential-free exact HTTPS transport | Reusable transport owner; no platform decision should leak into it. |

## E. Apple-silicon runtime realization

| Source | Current responsibility | Platform-realization pressure |
|---|---|---|
| `src/jvmMain/kotlin/vexlife/platform/python/ManagedPython.kt` | current managed Python bootstrap | Strong target-specific point: pins `uv-aarch64-apple-darwin.tar.gz`, then asks uv to install exact Python 3.14.7. |
| `HereticPythonEnvironment.kt` | venv + `mlx-lm==0.32.0` installation and probe | Current MLX realization; should sit behind the resolved runtime/backend relationship, not define all platforms. |
| `HereticPersistentRuntime.kt` | semantic persistent runtime ownership/currentness | **Keep semantic.** Its physical Platform should remain replaceable. |
| `MacHereticRuntimePlatform.kt` | process census, launchd/process substrate, port/health, MLX spawn on Mac | Excellent concrete Mac implementation behind the platform/runtime seam. |
| `HereticSetupStorage.kt` | storage requirement relationship | Reuse; target realization may contribute runtime overhead. |
| `StableVexLifeHereticRuntimeCompatibility.kt` | bounded predecessor runtime compatibility | Do not silently turn predecessor compatibility into official-app architecture. |

Current source proves model weights much more exactly than executable runtime acquisition:

- model members are pinned by exact provider revision, byte length and SHA-256;
- the uv Apple-silicon archive is also exact-byte pinned;
- Managed Python is installed by `uv python install <version>` and then version/path probed;
- `mlx-lm` is installed by `pip install --only-binary=:all: mlx-lm==0.32.0` and then version/probe
  validated.

For an official distributable application, Claude must explicitly decide whether executable runtime
components are:

```text
A. bundled / signed / notarized as part of the release realization
or
B. acquired after install under a source-managed exact distribution contract with sufficient byte /
   provenance / execution-trust proof
```

Do not silently equate a package version probe with the exact-byte release provenance currently used
for model artifacts.

## F. Background Product service

| Source | Current responsibility | Official-app pressure |
|---|---|---|
| `VexLifeProdSetupProcess.kt` | verify image -> establish local setup -> install image -> start service | Keep orchestration semantics; outer application realization may change how executable payload/service is placed. |
| `VexLifeProdLocalSetup.kt` | Home/model/runtime convergence | Preserve. |
| `VexLifeProdMacServiceLifetime.kt` | exact Mac Product-service ownership/currentness | Preserve semantic lifetime meaning; reconsider host substrate below it. |
| `src/jvmMain/kotlin/vexlife/platform/macos/MacUserLaunchdProcess.kt` | generic Mac launchd process construction/observation/retirement | Current physical substrate uses manual plist + `launchctl bootstrap/bootout`. Official app should evaluate app-bundled `SMAppService` realization on macOS 13+ rather than assume Home-local plist machinery is the public-product endpoint. |
| `VexLifeProdServiceContract.kt` | loopback Product contract | Preserve. |
| `VexLifeProdLocalService.kt` | HTTP Product service, models/settings/vision/conversation | Preserve service semantics. It currently has another direct `HereticMacHostProfile.observeCurrent()` dependency for Models memory projection; include this in realization refactor. |
| `VexLifeProdServiceProcess.kt` | packaged service process entry | Candidate inner helper/executable, not human app identity. |

The current service label is:

```text
com.vexlife.prod.service
```

Current `MacUserLaunchdProcess` stores its plist in the Vex Home and invokes `launchctl` directly.
Apple's current macOS 13+ ServiceManagement contract provides `SMAppService` for app-bundled
LaunchAgents/LoginItems/Daemons and explicitly replaces manually installing LaunchAgent property
lists. The worker should evaluate whether the official VexLife.app should own this helper relationship
through `SMAppService`, while leaving `VexLifeProdMacServiceLifetime` as the higher semantic owner.

Provider refs to re-ground:
- https://developer.apple.com/documentation/ServiceManagement/SMAppService
- https://developer.apple.com/documentation/servicemanagement/updating-helper-executables-from-earlier-versions-of-macos

## G. Product workspace / contained application UI

| Source | Current responsibility | Official-app relevance |
|---|---|---|
| `src/commonMain/kotlin/vexlife/workspace/VexLifeWorkspaceBlueprint.kt` | stable workspace element identities | Keep. |
| `src/commonMain/kotlin/vexlife/web/VexLifeWebP1.kt` | Product web relationship | Keep. |
| `VexLifeWebP1RuntimeArtifacts.kt` | generated browser-native JS/CSS behavior | Keep as generated manifestation. |
| `VexLifeWebP1ArtifactMaterializer.kt` | generated artifact materialization | Keep. |
| `VexLifeProdBrowserContract.kt`, `VexLifeProdFrameHost.kt` | browser/frame contract and local frame host | Reuse where applicable. |
| `VexLifeProdLocalService.kt` | serves Product surface + API | Reuse. |

Today Setup opens:

```text
http://127.0.0.1:18210/
```

in the person's default browser.

Candidate official Mac manifestation:

```text
VexLife.app native host
  -> Setup window consumes existing Product Entry/Card
  -> when CURRENT
  -> app-contained WKWebView (or another earned native web host)
  -> exact local VexLife service
  -> existing generated VexWeb workspace
```

This is a manifestation decision, not a rewrite of Product semantics.

Because the current origin is an IP-address loopback HTTP URL, a WKWebView host must explicitly
re-ground the current App Transport Security rule. Apple documents `NSAllowsLocalNetworking` for
local/IP resources; use the narrowest local-only declaration required by the exact implementation.
Do not disable ATS globally just to make loopback convenient.

Provider refs:
- https://developer.apple.com/documentation/bundleresources/information-property-list/nsapptransportsecurity/nsallowslocalnetworking
- https://developer.apple.com/documentation/Security/preventing-insecure-network-connections

## H. Vision / screen relationship

| Source | Current responsibility | Official-app relevance |
|---|---|---|
| `docs/foundation/VEXLIFE-VISION-COMPANION.md` | exact Vision ownership/held boundaries | Read before any Screen permission/UI work. |
| `src/commonMain/kotlin/vexlife/vision/VexLifeVisionFamily.kt` | human Vision State/Control/Effect/DisplayState | **Keep semantic.** Explicitly does not own macOS permission/capture. |
| `src/jvmMain/kotlin/vexlife/vision/VexLifeProdVisionRuntime.kt` | Product child/process bridge to selected-scope runtime | Keep bounded bridge shape. |
| `packaging/private-service-image/vision-runtime-contract.json` | current carried Vision runtime identity | **Distribution blocker:** current artifact is `LOCAL_QUALIFIED_NOT_DISTRIBUTABLE / LOCAL_ONLY_NO_RELEASE`. |
| `VexLifeProdLocalService.kt` | `/api/v1/vision`, control routes | Reuse. |
| `VexLifeWorkspaceBlueprint.kt` + `VexLifeWebP1RuntimeArtifacts.kt` | Vision quick action + Companion control | Reuse same Family projection. |

Current Product semantics are intentionally narrow:

```text
Ready
-> Engage
-> macOS system picker
-> user selects one window
-> Engaged
-> NO capture yet
-> Stop releases scope

Engaged != capture
Looking != captured
Conversation turn != automatic screenshot
visual-model input = still held
```

The current underlying accepted SDK route uses `SCContentSharingPicker` / user-selected single-window
scope. Apple recommends the system sharing picker. WWDC23 explicitly describes the Sonoma
user-selected picker path as giving permission for the selected content for that capture session,
without requiring a separate broad Screen Recording permission flow.

Therefore the official Product trust UX should **not** put "Screen Recording" into first-run setup.

Candidate future UX:

```text
person clicks Vision / Choose a Window…
-> VexLife explains:
   "Choose one window for VexLife Vision. Nothing is shared until you choose it.
    VexLife currently keeps the selected scope; Vex cannot look at it until the Look capability is
    separately available."
-> system SCContentSharingPicker
-> person chooses one window
-> Family re-observes Ready/Selecting/Engaged/Held
```

If later Product work actually admits LOOK/capture, re-ground the exact current ScreenCaptureKit
permission/usage-description contract at that point. Do not pre-authorize broad screen capture just
because the Product may later gain visual interpretation.

Current Vision runtime bytes **cannot simply be copied into the public DMG**: their source contract
explicitly says they are local-qualified and not distributable. The official Mac realization needs a
distribution-qualified build/sign/notarization route for all executable helper/runtime code or a
truthful temporary "Vision unavailable in public build" state until that predicate is met.

Provider refs:
- https://developer.apple.com/documentation/ScreenCaptureKit
- https://developer.apple.com/documentation/ScreenCaptureKit/SCContentSharingPicker
- https://developer.apple.com/videos/play/wwdc2023/10053/

## I. Speech and other current UI capabilities

Current workspace source includes a Speech quick action:

```text
Vex read-aloud
-> local macOS system voices
or
-> Kokoro browser-side natural voice
```

This is **audio output**, not microphone input. It does not earn Microphone permission.

The current generated web runtime also loads:

```text
kokoro-js @ 1.2.1 from jsDelivr
onnx-community/Kokoro-82M-v1.0-ONNX
```

That is not a macOS privacy-permission issue, but it **is** an official-app dependency/supply-chain
question. The worker should decide whether a trusted official release continues dynamic executable
module/model acquisition, pins it through an exact source-owned artifact contract, or carries it
inside the application realization.

No current Product owner was found for:

```text
camera input
microphone input
Accessibility control
Input Monitoring / global keyboard capture
notifications
full-disk access
```

Do not add those entitlements, usage descriptions or onboarding prompts speculatively.

---

# 2. Permission / trust matrix for the leading Mac path

| Human moment | Current Product need | macOS relationship | Target UX |
|---|---|---|---|
| Download/open DMG | prove downloaded app provenance | Gatekeeper + Developer ID + notarization; **not** a TCC capability permission | macOS verifies the signed/notarized app; VexLife does not invent its own "trust me" dialog. |
| First app launch | observe Mac/Home/model/service | no privacy permission for default `~/.vexlife` route | Open directly into native VexLife Setup/current-state UI. |
| Choose default Home | user-owned `~/.vexlife` | no current privacy prompt expected by Product source | Recommend default. |
| Choose Desktop/Documents/Downloads/iCloud/external protected Home | user explicitly changes storage coordinate | Files & Folders / protected-location access may be requested/blocked | Explain **before** formation; let macOS ask when required; re-observe; allow choosing another location. |
| Register Product background helper | keep local VexLife service available under explicit app relationship | candidate `SMAppService` / Background Items relationship | Explain "VexLife runs a local background service for Conversation/model access"; keep it visible/reversible in macOS. |
| Download model/runtime | exact HTTPS artifact acquisition | network effect, not TCC privacy prompt | Show model size/source/progress; exact verification before use. |
| Open workspace | local Product UI | WKWebView/local networking declaration if selected; no broad internet permission | Stay inside VexLife.app while service remains loopback-only. |
| Vision: choose window | persistent selected scope | `SCContentSharingPicker`; explicit user selection | Ask only when Vision is invoked. Never bundle it into first-run permissions. |
| Vision: LOOK/capture | **not admitted in current Product** | future current ScreenCaptureKit contract | Keep held until exact Product/source work earns capture + visual model input. |
| Speech read-aloud | audio output only | no microphone permission | No permission prompt. |
| Camera | no current owner | none | Do not request. |
| Microphone | no current owner | none | Do not request. |
| Accessibility | no current owner | none | Do not request. |
| Input Monitoring | no current owner | none | Do not request. |

Trust is therefore not "collect every permission at install." It is:

```text
signed/notarized application identity
+ exact source/release provenance
+ bounded local service identity
+ exact runtime/model artifacts
+ permission only at the capability boundary that needs it
+ truthful refusal/held state when unavailable
```

---

# 3. Official DMG / application release boundary

The existing private image remains useful inner construction. The official application needs a new
outer release relationship.

Candidate artifact shape to pressure, not a frozen file layout:

```text
VexLife-<version>-macOS-AppleSilicon.dmg
  -> VexLife.app
       Contents/
         Info.plist
         MacOS/<native host executable>
         Resources/<icons/localization/generated app resources>
         Frameworks/... as required
         Library/LoginItems or Library/LaunchAgents/... if SMAppService realization earns it
         <signed Product service/runtime payloads that belong in the app realization>
```

The worker must source-place:

1. **stable public application identity**
   - human name;
   - bundle identifier;
   - semantic version;
   - build version;
   - source/release identity;
   - minimum supported macOS.

2. **Apple-silicon support contract**
   - current Product/runtime requires Apple silicon;
   - current MLX PyPI requirement is macOS 14+ and native Apple silicon;
   - use that as the current evidence baseline unless a stricter Product dependency requires newer.

3. **Developer ID distribution**
   - Developer ID Application signing;
   - all nested executable code signed in the correct order;
   - Hardened Runtime;
   - secure timestamp;
   - notarization with current `notarytool`/Notary API;
   - staple ticket to the distributed artifact where applicable;
   - final Gatekeeper/codesign verification on the exact DMG/app bytes.

4. **release receipt**
   - exact source SHA/tree;
   - app version/build;
   - target platform/architecture;
   - DMG/app hashes;
   - nested runtime/helper identities;
   - signing identity reference without private key material;
   - notarization result/ticket reference;
   - Product/model catalog identity;
   - tests/lived proof actually run.

Apple current refs:
- https://developer.apple.com/documentation/technologyoverviews/distribution
- https://developer.apple.com/help/account/certificates/create-developer-id-certificates
- https://developer.apple.com/documentation/security/notarizing-macos-software-before-distribution
- https://developer.apple.com/documentation/xcode/preparing-your-app-for-distribution

Private signing credentials remain outside public repository source. Source may name the credential
*role/reference*, never the private key/certificate secret material.

---

# 4. Candidate platform-realization seam in current Product source

Do not begin with a new mega-class and move every Mac file behind it.

First map where portable Product code currently **chooses** Mac-specific implementations.

Current pressure points visible on #138:

```text
VexLifeProdCurrentState
  -> directly HereticMacHostProfile

VexLifeProdLocalService Models projection
  -> directly HereticMacHostProfile

VexLifeProdMacFrontDoor
  -> Mac host observation + Mac service lifetime

VexLifeProdSetupProcess
  -> VexLifeProdMacServiceLifetime

VexLifeProdLocalSetup
  -> current Heretic model/materialization
  -> ManagedPython
  -> HereticPythonEnvironment
  -> MacHereticRuntimePlatform / persistent runtime relationship

HereticProductIdentity
  -> Mac-specific runtimeAdapterRef / hostExecutionProfileRef

ManagedPython
  -> uv macOS arm64 artifact

PrivateServiceImage
  -> darwin-arm64 package identity

Vision runtime contract
  -> darwin-arm64 local-only artifact
```

The source-grounded target relationship remains:

```text
HostObservation
  + ProductSelection
  + source-owned qualified PlatformRealizationCatalog
        ↓
PlatformRealizationResolver
        ↓
PlatformRealizationPlan
        ↓
existing rightful owners consume only their coordinate
```

Possible responsibilities — **candidate names only**:

```text
PlatformTarget
  osFamily
  osVersion
  architecture
  accelerator/capability facts only when they affect realization

PlatformRealization
  hostProfile
  applicationArtifactProfile
  serviceLifetimeAdapter
  modelRuntimeAdapter
  managedRuntimeArtifactSet
  permissionAdapter
  distributionProfile

PlatformRealizationResolver
  HostObservation + desired Product/model relationship
  -> exact supported realization or truthful UNSUPPORTED/HELD/UNKNOWN
```

The resolver must not own process liveness, artifact bytes on disk, model selection, permission
authority or service lifecycle. It selects the already-source-owned implementation relationship;
those owners still observe and act.

Acceptance pressure:

```text
adding a later qualified target realization
-> register/implement the new target relationship
-> prove it
-> existing Product flows resolve it

not
-> edit every downloader/runtime/setup/service/UI branch
```

---

# 5. Proposed end-to-end Apple-silicon implementation sequence for Claude

This is an engineering sequence, not an authority grant.

## A. Freeze and map before mutation

- keep #138 T001 bytes untouched;
- use this map against exact #138;
- descend through current VexLife-Prod repository entry/culture;
- identify current open claims/PR overlap before authoring;
- form the rightful successor branch/work owner.

## B. Form the smallest platform-realization contract

- extract **selection** of host/runtime/distribution implementations, not their internal truth;
- introduce Apple-silicon realization using existing:
  - `HereticMacHostProfile`;
  - `MacHereticRuntimePlatform`;
  - `MacUserLaunchdProcess` or accepted successor substrate;
  - current Mac Setup Card;
  - existing model/artifact owners;
- migrate the two direct `HereticMacHostProfile` consumers first as a useful discriminator;
- keep unsupported target combinations explicit.

## C. Form the durable VexLife.app host

Prefer reusing current Product semantic/presentation source:

```text
VexLife.app
-> native lifecycle / application identity
-> Setup presentation consumes existing Product Entry/Card
-> current-state re-observation
-> local Product service lifecycle
-> contained generated VexWeb workspace when CURRENT
```

Do not rewrite Conversation/Settings/Vision/Models semantics into Swift.

The exact native technology/source placement must be earned from repository culture and build
constraints; WKWebView is a strong manifestation candidate because the current Product already owns a
generated VexWeb workspace.

## D. Replace public bootstrap ceremony with app release formation

- keep the current bootstrap as proof/recovery lineage if useful;
- produce source-bound `.app`;
- form DMG;
- support development/ad-hoc local formation separately from real release signing;
- release mode uses Developer ID + Hardened Runtime + notarization;
- never require release secrets for ordinary unit/source tests.

## E. Make background service an application-owned relationship

Investigate `SMAppService` for the official app's bundled helper/service.

Acceptance:
- Product service is still loopback-only/currently source-bound;
- current service lifetime semantics survive;
- enable/disable/update is app-owned and user-visible;
- no orphaned old Home-local launchd job after migration;
- migration/recovery from an already-installed current Product is explicit.

## F. Close executable-runtime trust

Before calling the DMG an official release:
- inventory every executable/native component that runs;
- distinguish model weights/data from executable runtime;
- decide bundle-vs-exact-acquire for managed Python, MLX/mlx-lm and Speech/Vision helpers;
- preserve exact provenance and current qualification;
- do not make network package-manager resolution an invisible second release channel.

## G. Implement capability-on-demand trust UX

First launch:
- no screen/camera/mic/accessibility/input-monitoring prompt;
- explain protected Home locations only if selected;
- background helper relationship only when actually established.

Vision:
- existing Vision button remains the human entry;
- explain the scope;
- system picker;
- re-observe;
- no automatic screenshot/capture/model input.

No permission should be requested because "VexLife may use this someday."

## H. Contain the workspace

- when Product reaches CURRENT, show the existing VexWeb product inside the app;
- use only the narrow local networking/App Transport Security exception actually needed;
- preserve current browser/context distinctions;
- browser web reach remains a Product capability, not an app permission shortcut.

## I. Prove the actual human route

Synthetic/source proof is insufficient for "official application."

Lived Apple-silicon sequence should include at least:

```text
fresh Mac/user test context
-> download exact DMG
-> Gatekeeper normal first-open experience
-> drag to Applications
-> open VexLife.app
-> no ambient TCC permission prompts
-> choose default Home
-> select smallest fitting model for bounded first proof
-> download / runtime preparation
-> Product CURRENT
-> contained Vex workspace
-> real Conversation
-> quit/reopen VexLife.app
-> same Home / Conversation current
-> restart Mac
-> reopen / service recovery current
-> invoke Vision
-> system picker only at Vision boundary
-> Stop releases scope
-> update to a newer exact app build
-> Home / Conversation / Memory preserved
-> reinstall same/newer build
-> data behavior matches claim
```

Also test:
- protected custom Home;
- insufficient storage;
- interrupted model download;
- damaged model file;
- stale prior Product service;
- permission/refusal path for Vision;
- release with Vision unavailable if distribution-qualified helper is not yet ready.

---

# 6. Explicit non-goals for the first official Mac slice

Do **not** widen this slice into:

- Intel support;
- Windows implementation;
- iOS implementation;
- microphone/camera;
- global keyboard monitoring;
- Accessibility control;
- arbitrary screen recording;
- automatic screen capture on Conversation turns;
- visual-model LOOK unless separately admitted;
- App Store release unless selected separately;
- generic auto-updater before one truthful manual/current update relationship is proven;
- rewriting the VexWeb Product UI in native code;
- replacing Vex Home with app-container storage merely because a Mac app now exists.

---

# 7. Acceptance statement

The first Apple-silicon Official Application threshold is reached only when this is true:

```text
one exact VexLife.app / DMG
+ stable platform application identity
+ Apple-silicon/macOS support contract
+ trusted signing/notarization
+ contained/non-developer install route
+ existing Product Entry semantics
+ exact runtime/model realization
+ application-owned local service relationship
+ capability-on-demand permission behavior
+ contained Vex workspace
+ Home / Conversation / Memory preservation
+ lived install / restart / update proof
= official Mac application candidate

artifact built
!= official

notarized
!= semantically correct

setup works once
!= lifecycle complete

permission granted
!= capability result

Vision scope engaged
!= Vex looked at screen
```

This map should be currentized when the exact Product candidate changes materially; it is not a
second source owner for VexLife-Prod implementation.

<!-- [VXG RealForever][VEXWORK][VEXLIFE-OFFICIAL-APPLICATION][MACOS-APPLE-SILICON][HANDOFF] -->
