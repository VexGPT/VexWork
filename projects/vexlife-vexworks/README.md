# VexWorks

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

This Project is named **VexWorks** because the human outcome is broader than “attachments” or “model settings”: it is the bounded place where a person gives Vex material to work with, Vex reaches it, and the person chooses which local model does that work.

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

VexWorks Project
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
- manifest-first context use so large files are not dumped into every prompt.

PDF, image/vision input, automatic research synthesis, semantic Memory promotion and filesystem writes remain separate until their own owners/contracts are earned.

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

So VexWorks does **not** need another model registry or switch semantic. The tail should make the existing relationship perceivable and capability-aware.

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

A4  Lived VexWorks proof
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
3. ask Vex to reach the bounded material;
4. open a model selector and choose another offered/imported model;
5. see only controls/features that are truthful for that exact model/provider/runtime relationship;
6. send the next turn through the newly serving model;
7. keep the same Conversation and source/artifact identities across the switch;
8. receive a plain held/unavailable explanation when a requested model relationship is unsupported instead of Vex guessing or falling back silently.

## Current source coordinates

- `VexGPT/VexLife-Prod#402` — current Product successor trajectory used for present-source grounding.
- `docs/foundation/HERETIC-PRODUCT-MODEL.md`
- `src/commonMain/kotlin/vexlife/model/VexLifeModelsFamily.kt`
- `src/commonMain/kotlin/vexlife/model/heretic/HereticModelCatalog.kt`
- `src/commonMain/kotlin/vexlife/model/heretic/HereticModelImport.kt`
- `src/commonMain/kotlin/vexlife/model/heretic/HereticCompanionRepresentation.kt`
- `src/commonMain/kotlin/vexlife/model/heretic/HereticRuntimeRealization.kt`
- `src/jvmMain/kotlin/vexlife/model/heretic/HuggingFaceModelInspection.kt`

This Project carries navigation and sequence. Current VexLife-Prod source remains the authority for the exact implementation.

<!-- [VXG RealForever][VEXWORK][VEXWORKS][VEXLIFE-PROD] -->
