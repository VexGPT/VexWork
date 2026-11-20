# [VexLife Local Artifacts]

`[VXG RealForever]`

## Human outcome

Make VexLife feel like a real local AI work environment:

```text
person
  -> gives Vex files / selected local sources
  -> Vex can reach only the exact admitted material
  -> Conversation keeps the durable human/Vex thread
  -> model may be switched explicitly
  -> Vex projects only the features that the selected model/provider/runtime relationship can actually carry
```

This Project is titled **[VexLife Local Artifacts]** because the human outcome is broader than “attachments” or “model settings”: it is the bounded place where a person gives Vex material to work with, Vex reaches it, and the person chooses which local model does that work.

## Ownership boundary

VexWorks is a **VexWork Project**, not a new source-code repository.

```text
VexWork
  owns Project / Workgraph navigation

VexLife-Prod
  owns Product semantics, Families, runtime composition and presentation

Capability Atlas / owning Families
  own what Vex may reach or do

model/provider representation
  owns how already-owned meanings are represented to one selected model

[VexLife Local Artifacts] Project
  groups the outcome and sequence only
```

Permanent:

```text
VEXWORKS_PROJECT != PRODUCT_SOURCE_OWNER
MODEL_SELECTOR != MODEL_RUNTIME_OWNER
MODEL_CAPABILITY_PROJECTION != CAPABILITY_AUTHORITY
MODEL_SWITCH != CONVERSATION_SWITCH
MODEL_SWITCH != MEMORY_SWITCH
MODEL_SWITCH != ARTIFACT_REBIND
ATTACHMENT != MEMORY
LOCAL_SOURCE != ATTACHMENT
PROVIDER_NATIVE_TOOLING != VEX_CAPABILITY_AUTHORITY
```

## Current starting point

The current Local Artifacts successor work establishes the first half of this outcome:

```text
human files / folder grants
-> semantic Artifact / Local Sources Families
-> exact artifact custody
-> read-only Capability Atlas reach
-> bounded model-selected reads
-> Direct Companion
-> Working Continuity / Vex Context / Conversation
```

The current integration target remains the exact current VexLife-Prod trajectory rather than the stale predecessor branch stack. The useful product delta includes:

- Conversation Stop / cancellation;
- text, ZIP, DOCX, XLSX and PPTX attachment intake;
- exact turn-bound attachment reach;
- persistent Local Sources;
- bounded source search/read;
- direct bounded current-turn context for small readable attachments, while large/overflow files stay behind exact request-local bounded reach.

PDF, image/vision input, automatic research synthesis, semantic Memory promotion and filesystem writes remain separate until their own owners/contracts are earned.

## Stable checkpoint — 2026-11-20 01:42 Pacific

A0 remains **RUNNING**, but this is the current stable Local Artifacts checkpoint future instances should resume from rather than reconstructing the attachment design from predecessor chat.

Stable Product integration:

~~~text
VexGPT/VexLife-Prod#434
main a4dd25e472d153b1cef24f7f35132933f3d725d0
tree c86ad042177af0451fa0c35a0fdfec8bf0b745e6

proved/lived predecessor bytes
#433 head 3165b2009acc84b8da38b45f9ec5bdc261387c2b
same tree c86ad042177af0451fa0c35a0fdfec8bf0b745e6
~~~

The merge changed ancestry, not Product bytes. The A007-proved/lived tree is now the exact main tree.

Exact Mac build proof:

~~~text
TEMP RELAY #429 A007
RETURN sha256 5b3c13201a1e69042fd8fd01fb1f5bcc493c84f735c412d0c61409c02d2e8613
DMG sha256    4dfbdb6d822613a536a288b3dc0119fa3a7dcc061fe8705608bb66244a219fe3
disposition   PASS
~~~

Lived human checkpoint:

~~~text
Victor_Gong_Resume_2026.docx
-> exact file staged/bound
-> DOCX readable projection formed
-> small-file parsed content supplied directly in current-turn context
-> Vex answered from the actual resume content rather than filename/metadata inference
-> human witness: looks good
~~~

Stable input circuit:

~~~text
person provides material
-> exact immutable OriginalArtifact bytes
-> converter/adaptor forms a bounded DerivedProjection
-> exact canonical REQUEST binds artifact + projection
-> small whole readable projection fits admitted direct-context bound
   -> VEXLIFE_CURRENT_REQUEST_ARTIFACT_CONTENT/v1
   -> user-role current-state context
   -> Vex receives parsed material before answering
-> large/overflow projection
   -> metadata + exact request-local resourceRef
   -> bounded attachment reach only when more content is needed
~~~

Permanent distinctions preserved:

~~~text
EXACT HUMAN WORDS != PRODUCT ATTACHMENT CONTEXT
ORIGINAL BYTES != DERIVED PROJECTION
DERIVED PROJECTION != MODEL INTERPRETATION
SMALL ATTACHMENT != OPTIONAL TOOL HUNT
LARGE/OVERFLOW ATTACHMENT != PRELOAD EVERYTHING
ATTACHMENT != MEMORY
~~~

Current admitted converters remain:

~~~text
TEXT
ZIP
DOCX
XLSX
PPTX
~~~

Stable Product main still does **not** admit static images as model-usable request material. The current #435 candidate now recognizes exact PNG/JPEG bytes, keeps their exact OriginalArtifact bytes, and durably retains a typed StaticImageProjection while intentionally keeping the attachment HELD until one qualified visual-input realization exists. VexLife also has a separate Vision Family / selected-window runtime, whose current Product contract deliberately stops before Look/capture-to-model interpretation. Therefore image work continues from this distinction rather than collapsing static file input and live screen Vision into one owner.

Current next Product successor:

~~~text
VexGPT/VexLife-Prod#435
[VexLife Local Artifacts][DRAFT] Static image adaptation over stable artifact input

head 9df62c1851b0d2e8b8774e7228a376e9d02a282d
tree 2f36eb3efd8c5d639cae795a2eb3cd9a14da0960

static image Local Artifact
-> exact bytes
-> typed StaticImageProjection
-> qualified visual provider/runtime
-> exact REQUEST / Vex
~~~

Current seven-path candidate membrane:

~~~text
docs/work/local-artifacts-static-image/README.md
src/commonMain/kotlin/vexlife/artifact/VexLifeLocalArtifact.kt
src/jvmMain/kotlin/vexlife/artifact/VexLifeLocalArtifactReader.kt
src/jvmMain/kotlin/vexlife/artifact/VexLifeLocalArtifactStore.kt
src/jvmMain/kotlin/vexlife/artifact/VexLifeStaticImageAdaptation.kt
src/jvmMain/kotlin/vexlife/service/VexLifeProdLocalService.kt
src/jvmTest/kotlin/vexlife/artifact/VexLifeStaticImageAdaptationTest.kt
~~~

The candidate now carries the first reusable representation seam:

~~~text
RequestProjection
├─ DerivedProjection
│    readable text
└─ StaticImageProjection
     media type
     dimensions
     adapter identity

exact OriginalArtifact bytes
-> content-derived projection
-> existing projection custody
~~~

The durable RequestAttachment / request-artifacts/v1 shape remains unchanged. Existing Home sidecars therefore do not need a migration. Static images are still not allowed to become READY merely because they now have a projection.

Permanent:

~~~text
STATIC IMAGE PROJECTION != VISUAL INTERPRETATION
STATIC IMAGE ATTACHMENT != VEXLIFE VISION
DERIVED REPRESENTATION != MODEL INTERPRETATION
ATTACHMENT != MEMORY
~~~

### Architecture continuation for static image input

Current Product source establishes these owners already:

~~~text
VexLifeAttachmentDraftFamily
  owns pre-Send attachment meaning only

VexLifeAttachmentDraftRuntime
  owns active staging / cancellation / Send lease

VexLifeLocalArtifact
  owns immutable original bytes + exact derived representation identity

DirectCompanionTurn / DirectCompanionConnection
  compose current request material into the selected Companion without re-owning artifact semantics
~~~

The next image edge should therefore **not** make the Attachment Family media-specific and should not make the Product service the semantic owner. One concrete visual provider/runtime must qualify how a StaticImageProjection becomes model-usable.

Platform/runtime realization should follow the already-earned Local-ASR pattern rather than spreading target branches through semantic consumers:

~~~text
one visual provider-realization boundary
-> exact target resolver
   -> Mac realization
   -> Windows realization when qualified
   -> another platform only when a real implementation is earned
-> no nearest-platform fallback
~~~

A VexPartner relationship is **not** added merely for architectural symmetry. Partner is earned only if visual interpretation actually becomes an independently-owned external-participant relationship. Static attachment and live Vision may later share a visual-resource interpretation seam while remaining distinct source owners.

The offered Heretic 4B model remains the first concrete visual-runtime candidate because its exact pinned artifact set includes processor/preprocessor configuration, while current Product Companion carriage remains text-shaped and the existing certified mlx-lm runtime does not by itself qualify visual input. A separate visual runtime/environment relationship must be qualified before #435 may turn an image from HELD into model-usable material.

### Current proof checkpoint

#### A001 — fresh RUN_ROOT creation was not admitted

The first Mac VexRelay attempt did **not** reach Product source:

~~~text
outer RETURN
sha256 987225e8e6b6bec10122077404cc483e0f27dd5dd0cbae86bdd41c1edb081e81
PASS

retained inner VexRelay RETURN
sha256 fb5f1c6ceaa70bc9c6e13e881d9668b8f4cc00cec02daf7cef0d0a442a609f95
SAFE_FAILURE

classification harness
operation system.ground
candidateHead NONE
candidateTree NONE
testsExecuted false
review NOT_REACHED
~~~

A001 set `workspace.createRoot=false` while the native carrier intentionally begins with a fresh disposable RUN_ROOT.

#### A002 — exact Product source grounded; proof command did not launch

A002 corrected that formation defect. The exact #435 candidate was cloned and grounded:

~~~text
outer RETURN
sha256 6b20f41301b5408d93d60b88b7c2dbb91ce7f8eff14f63b963d3e860d85c3125
PASS

retained inner VexRelay RETURN
sha256 d3a80c727840cfff85b388862015d282cbf92b85cbcd32c9dbbdf78726979dbb
SAFE_FAILURE

acceptedBase
a4dd25e472d153b1cef24f7f35132933f3d725d0

candidateHead
9df62c1851b0d2e8b8774e7228a376e9d02a282d

candidateTree
2f36eb3efd8c5d639cae795a2eb3cd9a14da0960

worktree CLEAN
EXPECTED_HEAD PASS
EXPECTED_TREE PASS
changed paths exact seven-path membrane

testsExecuted false
review NOT_REACHED
~~~

The first substantive failure was:

~~~text
classification environment
operation recipe.source-owner.proof.1
code COMMAND_NOT_FOUND:./gradlew
~~~

Current Relay executor source checks whether the executable exists before it resolves the operation's repository cwd. Therefore a relative-path executable `./gradlew` cannot pass the pre-check even though the exact cloned repository contains the wrapper.

Permanent classification:

~~~text
A002 EXACT SOURCE GROUNDING PASS
!= SOURCE-OWNER PROOF PASS

RELAY COMMAND-RESOLUTION FAILURE
!= PRODUCT TEST FAILURE

PRODUCT MUTATION FOR THIS RECOVERY
= NONE
~~~

A003 rotates attempt/package identity only and preserves the exact #435 head/tree/membrane. The same repository proof is expressed through the addressable Mac executable:

~~~text
/bin/bash ./gradlew --no-daemon jvmTest checkVexLifeStrings
~~~

A003 reached the actual repository build:

~~~text
outer RETURN
sha256 5ec02aa2292d5aaacd4832923369d6dc3f99c74698d3f6838ecedf67bedeb75c

retained inner RETURN
sha256 e056a7ef93dabea6f39fde7424c7dfc7069b1921dc14ed58d3ff846e6c4fc4c9

candidate
9df62c1851b0d2e8b8774e7228a376e9d02a282d
2f36eb3efd8c5d639cae795a2eb3cd9a14da0960

worktree CLEAN
testsExecuted true
compileKotlinJvm started
review NOT_REACHED
~~~

The proof process exited 1 after the Kotlin compiler exhausted heap:

~~~text
java.lang.OutOfMemoryError: GC overhead limit exceeded
transforming VexLifeCurrentMemoryReader.readCurrentScoreAcceptance(...)
~~~

The named Memory reader is unchanged between accepted base and candidate:

~~~text
blob 99efe0fd2042efc13f4e0f3a46f9c5c8c1f81793
~~~

Relay therefore continues to hold SourceOwner completion, while the evidence does **not** establish a #435 changed-path defect. A004 preserves the exact Product candidate and retries the same proof with explicit bounded build memory and one worker:

~~~text
./gradlew --no-daemon -Dorg.gradle.jvmargs=-Xmx4g --max-workers=1 jvmTest checkVexLifeStrings
~~~

No Product mutation is required for that proof-environment recovery.

No Product SourceOwner PASS, Independent Assurance, READY transition or merge is claimed yet.

## The model-switching tail is smaller than it first appears

VexLife-Prod already has the semantic and runtime pieces that a Claude-like model picker should project:

```text
VexLifeModelsFamily
  Select
  Use -> SwitchModel
  Download / Redownload / Remove
  imported-model lifecycle

HereticModelCatalog / HereticModelOfferings
  Product models + Home-imported models

HereticRuntimeRealization
  exact model x current platform -> supported realization | unsupported

HereticCompanionRepresentation
  message protocol
  reasoning representation
  capability carriage
  reach standing
  generation / reasoning controls
```

So [VexLife Local Artifacts] does **not** need another model registry or switch semantic. The tail should make the existing relationship perceivable and capability-aware.

## Dynamic hookup for models a person adds

Current Product source already performs a conservative import inspection for public Hugging Face Qwen3 causal-text MLX/Safetensors models:

```text
provider model URL
-> pin exact provider revision
-> inspect config / tokenizer / chat template
-> reject remote-code-required or unrecognized/multimodal relationships
-> bind every admitted member by exact size + SHA-256
-> detect native Qwen tool-call grammar when present
-> form one Home-owned imported model record
-> form its Companion representation
-> resolve exact runtime support for the current platform
-> materialize only after an explicit effect
-> qualify the real runtime before ordinary use
```

That is already a real “hookup detection” path.

The general direction is therefore:

```text
MODEL SOURCE INSPECTION
  says what the model actually is / represents

RUNTIME REALIZATION
  says whether VexLife knows how to run that exact relationship here

RUNTIME QUALIFICATION
  says whether that exact serving runtime is actually healthy/current

EFFECTIVE CAPABILITY PROJECTION
  says which Product features may be shown for this selected model now
```

Do not infer features from a model name, size, marketing card or nearest architecture.

## Desired model menu experience

A Claude-like selector can stay simple at the human surface:

```text
Models
  Heretic 27B          ✓
  Heretic 9B
  Heretic 4B
  <imported model>

  Reasoning            Medium      # only when the selected representation owns such a control
  Vex reach            Available   # only when the selected representation/runtime is qualified
  Native tools         Available / Compatibility bridge
  Runtime              Ready / Needs download / Needs start / Held
```

The menu is a projection. Every row should come from existing Product State/Control/representation truth.

A model with no provider-native tool channel may still use a **qualified VexLife compatibility carriage** for Vex-owned reach. Conversely, native tool syntax does not grant file access, filesystem writes, Memory mutation or any other capability by itself.

## Work sequence

```text
A0  Local Artifacts + Local Sources convergence
    current foreground

A1  Effective model-capability projection
    derive one human-readable capability view from the selected model's exact
    Companion representation + current runtime realization/qualification

A2  Claude-like model selector
    project offered/imported models and existing Select / Use switch semantics
    without creating another model owner

A3  Imported-model relationship recognizers
    retain today's exact Qwen3 recognizer; add new architecture/provider
    recognizers only when a qualified runtime relationship actually exists

A4  Lived Local Artifacts proof
    same Conversation + same admitted files/sources
    -> switch model
    -> capability surface changes truthfully
    -> next Send uses the newly qualified serving model
    -> no attachment/source/Memory identity is silently rebound
```

A1-A4 intentionally follow A0. They should not destabilize the artifact/source semantics while those are still converging.

## Acceptance direction

The Project is successful when a normal person can:

1. add a supported file or Local Source;
2. see that it is available without the whole file being stuffed into prompt context;
3. have small readable attachments supplied directly in current-turn context, with bounded reach used only when more/large material is needed;
4. open a model selector and choose another offered/imported model;
5. see only controls/features that are truthful for that exact model/provider/runtime relationship;
6. send the next turn through the newly serving model;
7. keep the same Conversation and source/artifact identities across the switch;
8. receive a plain held/unavailable explanation when a requested model relationship is unsupported instead of Vex guessing or falling back silently.

## Current source coordinates

- `VexGPT/VexLife-Prod#434` — stable Local Artifacts integration now on Product main.
- `VexGPT/VexLife-Prod#435` — current draft static-image adaptation successor over that stable base.
- `docs/foundation/HERETIC-PRODUCT-MODEL.md`
- `src/commonMain/kotlin/vexlife/model/VexLifeModelsFamily.kt`
- `src/commonMain/kotlin/vexlife/model/heretic/HereticModelCatalog.kt`
- `src/commonMain/kotlin/vexlife/model/heretic/HereticModelImport.kt`
- `src/commonMain/kotlin/vexlife/model/heretic/HereticCompanionRepresentation.kt`
- `src/commonMain/kotlin/vexlife/model/heretic/HereticRuntimeRealization.kt`
- `src/jvmMain/kotlin/vexlife/model/heretic/HuggingFaceModelInspection.kt`

This Project carries navigation and sequence. Current VexLife-Prod source remains the authority for the exact implementation.

<!-- [VXG RealForever][VEXWORK][VEXWORKS][VEXLIFE-PROD] -->
