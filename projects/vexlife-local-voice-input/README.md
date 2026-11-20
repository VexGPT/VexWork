# VexLife Local VoiceInput

[VXG RealForever]

## Human outcome

Make **VoiceInput a dependable local VexLife capability instead of a browser-specific speech-recognition feature**.

The person should be able to click the existing microphone, grant microphone access through the current presentation surface, speak naturally, see local transcription enter the exact existing Composer draft, edit it, stop dictation, and use the existing Send as the only Conversation commit boundary.

~~~text
human voice
-> browser/native presentation captures microphone audio
-> VexLife-owned local audio ingress
-> VexLife-owned local ASR realization
-> transcript observation
-> existing VexLifeVoiceInputFamily
-> exact existing Composer draft
-> existing Send
-> canonical Conversation
~~~

Permanent product distinctions:

~~~text
BROWSER MICROPHONE CAPTURE != BROWSER SPEECH RECOGNITION
VOICE INPUT != VEX PERCEPTION
VOICE INPUT != CONVERSATION COMMIT
LOCAL ASR != CLOUD TRANSCRIPTION
BROWSER INDEPENDENT != PER-BROWSER IMPLEMENTATION MATRIX
~~~

## Why this became a Project

The original VoiceInput work was correctly small while the intended realization was:

~~~text
browser microphone
-> browser on-device SpeechRecognition
-> Composer
~~~

Lived Brave proof changed the problem.

Current VexLife-Prod PR #231 now proves the Product can:

- render the existing microphone control;
- carry Start / Stop through VexLifeVoiceInputFamily;
- request browser microphone permission;
- receive a real microphone MediaStream;
- render waveform feedback;
- retain the exact Composer / existing Send boundary;
- report browser realization facts through the existing VexLogger.

But exact lived A002 evidence on Brave returned:

~~~text
START
-> REQUESTING_MICROPHONE
-> MICROPHONE_GRANTED
-> CHECKING_LANGUAGE
-> SpeechRecognition.available(en-US, processLocally=true)
-> unavailable
~~~

No recognition session started. The browser was not merely missing permission; the browser speech-recognition provider could not supply the required local recognizer.

That converts the remaining outcome from one adapter fix into a coherent capability spanning provider selection, local model/runtime realization, audio ingress, product integration, privacy/security evidence, and lived cross-browser proof. Future workers would otherwise reconstruct that relationship from #231 and chat/debug history, so a durable VexWork Project is now earned.

## Existing source is predecessor/current work, not the whole Project

Current VexLife-Prod work remains useful and should be preserved rather than replaced:

~~~text
PR #231
[VexLife-Prod] Complete Family-to-browser semantic circuit

current draft head
9b00a018c3745b9f332f83983eb4d729e4019829

A002 exact source/build/lived provider proof
565a3b9ad3cd9c65ba00d7117350dea7e1d76a81
~~~

#231 owns the current Product-side VoiceInput surface and semantic circuit.

This Project owns the larger **work outcome** needed to finish browser-independent local dictation. It does not make VexWork the source owner of VexLife-Prod implementation.

~~~text
PROJECT != SOURCE OWNER

#231 PRODUCT SURFACE != WHOLE LOCAL ASR PROJECT
~~~

The post-A002 #231 head also contains a small VexLogger chronology-order refinement that has not yet received the same host proof as the A002 head. Preserve that distinction during successor work.

## Target architecture to pressure

The first architecture hypothesis is deliberately small:

~~~text
VexLifeVoiceInputFamily
  owns VoiceInput semantic State / Control / Effect / DisplayState

presentation/browser
  owns concrete microphone permission + audio capture while it is the current renderer

VexLife local service
  owns the bounded local audio-ingress boundary appropriate to the Product

local ASR provider/runtime
  owns physical speech-to-text realization

returned transcript observation
  -> same VoiceInput semantic owner
  -> exact existing Composer
~~~

Do not introduce a VoiceInputManager, browser-name strategy tree, generic Speech Partner, Relay, VexExecution layer, second transcript store, or Vex Perception coupling merely to make the diagram look complete.

Each additional architectural relationship must answer a concrete question the existing owners cannot answer truthfully.

## Current provider question

No ASR implementation is selected by Project formation.

The first active engineering question is:

> Which local speech-to-text provider can VexLife actually own and qualify on the current Mac product path while preserving local-only audio custody, useful latency, language coverage, bounded dependencies, license/distribution viability, and a path that does not depend on the browser's own Web Speech backend?

Candidate families may include Whisper-class, MLX-native, whisper.cpp/ggml-style, ONNX/sherpa-style, SenseVoice/FunASR-style, or another current local provider. A name appearing here is research scope, not selection.

Selection should be earned by runnable evidence, not model familiarity.

## Security / privacy relevance

This Project is security-relevant because it introduces or changes:

~~~text
microphone audio = sensitive transient data
local loopback audio transport
model/runtime dependencies
model artifact acquisition/update
temporary audio buffering/retention
process boundaries
debug/chronology evidence
~~~

Use the existing Vex Security Assurance Project selectively for the applicable sensitive-data, local-provider, dependency/update and recovery questions.

Do **not** turn this into an ambient whole-ecosystem security audit.

Initial intended privacy law:

~~~text
RAW AUDIO
-> local-only realization
-> minimum necessary transient custody
-> no Conversation persistence
-> no Memory persistence
-> no VexLogger content
-> no training
-> no cloud transcription
~~~

The exact buffer/retention contract remains implementation work rather than a claim formed here.

## Current Work neighborhood

~~~text
VexLife Local VoiceInput                                      RUNNING
├─ Preserve current VoiceInput product surface                RUNNING
├─ Select and qualify a local ASR provider                    READY / IMMEDIATE
├─ Define local audio-ingress + transcription contract        WAITING_DEPENDENCIES
├─ Realize the local ASR runtime                              WAITING_DEPENDENCIES
├─ Rebind VoiceInput from browser ASR to local ASR            WAITING_DEPENDENCIES
├─ Prove privacy / security / recovery boundaries             WAITING_DEPENDENCIES
└─ Prove lived browser-independent local dictation            WAITING_DEPENDENCIES
~~~

Containment means these pieces belong under the outcome. Dependencies below describe actual prerequisite relationships; containment is not an execution-order substitute.

## First active edge

The immediate edge is **provider qualification**, not another UI refactor.

Pressure candidates against at least:

~~~text
runs locally on current Apple-silicon Mac path
no cloud transcription required
license allows intended Product use/distribution
model artifact size and acquisition are explicit
runtime/dependency footprint is bounded
input audio format is clear
final transcript support is real
streaming / partial transcript behavior is observed, not assumed
English baseline works
language expansion path is understood
latency is usable for dictation
cancellation / Stop is realizable
failure is observable through existing VexLogger
model/runtime can be versioned and qualified
browser supplies audio only; browser ASR is unnecessary
~~~

Do not freeze streaming, model family, runtime technology, or repository placement before the candidate evidence earns them.

## Formation boundary

Project formation grants no VexLife-Prod, Vextreme-SDK, model-download, runtime, release, or merge authority.

All Project Work currently uses:

~~~text
authorityDisposition = NO_AUTHORITY
effectDisposition    = NO_EFFECTS
~~~

Exact implementation admission remains target-repository/source-bound.

## Discoverability boundary

Several current open VexWork PRs touch shared Project Registry / composed public Workgraph projection surfaces.

This formation therefore follows current repository precedent and authors **Project-local source plus one independent Workgraph segment only**:

~~~text
projects/vexlife-local-voice-input/README.md
projects/vexlife-local-voice-input/project.json
workgraphs/segments/vexlife-local-voice-input.json
~~~

It does not race shared generated/aggregate ownership by hand-editing:

~~~text
blueprint/project-registry.json
workgraphs/public.json
public/workspace.json
~~~

Project discoverability/currentization remains a separate integration predicate after shared custody is available.

<!-- [VXG RealForever][VEXWORK][VEXLIFE][LOCAL-VOICE-INPUT][PROJECT] -->

## Currentization — accepted browser-independent Local VoiceInput

The formation-era provider research has completed its intended Product outcome.

Accepted current lineage:

~~~text
VexLife-Prod #310
-> current-main progressive local dictation
-> exact whisper.cpp provider/model selection
-> bounded local PCM/WAV ingress
-> persistent local provider
-> editable Composer
-> separate Send

VexLife-Prod #338
-> Mac bundled whisper.cpp realization
-> Windows Home-materialized whisper.cpp realization
-> final Mac + Windows lived VoiceInput
-> exact-head Assurance / lifecycle / merge / post-merge verification
~~~

Current Product law:

~~~text
browser microphone custody
-> Product-local PCM/WAV ingress
-> selected VexLife local-ASR realization
-> local whisper.cpp inference
-> editable Composer
-> separate human Send

raw audio
-> request-scoped memory only

Local-ASR chronology
-> provider/model/language/pass/timing/failure coordinates
-> no transcript/audio content

browser SpeechRecognition
-> not the Product ASR provider
~~~

Therefore the original Project outcome and all eight child Works are COMPLETED.
Later language, translation, model-management, Web restoration or provider evolution is successor work,
not a reason to keep the browser-independent Local VoiceInput foundation open.

<!-- [VXG RealForever][VEXLIFE-LOCAL-VOICE-INPUT][CURRENTIZED][COMPLETED] -->
