# Local ASR provider qualification

[VXG RealForever]

Work: `work.vexlife.local-voice-input.provider-qualification`

## Question

Which local speech-to-text provider can VexLife own as a Product capability without depending on
browser Web Speech, while preserving local audio custody, usable dictation latency, bounded
dependencies, model/runtime currentness, cancellation, future platform reach and a truthful
distribution story?

This is provider qualification, not provider selection by familiarity.

## Current Product constraints

Current VexLife-Prod already proves:

~~~text
browser microphone permission / MediaStream     REAL
VoiceInput Family Start / Stop                  REAL
waveform                                        REAL
Composer projection                             REAL
existing Send                                   CANONICAL COMMIT
VexLogger browser chronology                    REAL

browser local SpeechRecognition                 NOT RELIABLE AS PRODUCT PROVIDER
~~~

The current Product service is Kotlin/JVM. It also owns a lower-level `ManagedPython` substrate,
while `HereticPythonEnvironment` is an exact mlx-lm environment for the LLM runtime.

Permanent qualification constraint:

~~~text
REUSE MANAGED PYTHON SUBSTRATE
!= INSTALL ASR PACKAGES INTO HERETIC MLX-LM ENVIRONMENT
~~~

If a Python ASR candidate wins, it needs its own bounded environment identity rather than mutating
the Heretic environment.

## Candidate A — sherpa-onnx

Pinned research source:

~~~text
repo       k2-fsa/sherpa-onnx
head       aa273e8029af4e0aabac7d7455a177c5b493aa34
tree       a8c80abb0fd3fb1d1f46baab488a3562756d9b27
license    Apache-2.0
~~~

Observed provider capabilities from current source:

- local ASR with both streaming and non-streaming modes;
- Java and Kotlin APIs;
- macOS ARM64 + x64;
- Windows ARM64 + x64;
- Android / iOS / Linux;
- Whisper, Zipformer, SenseVoice and other model families;
- microphone streaming examples through the Java API.

A current compact English streaming candidate already referenced by upstream examples is:

~~~text
sherpa-onnx-streaming-zipformer-en-20M-2023-02-17.tar.bz2
archive bytes = 127,887,156
~~~

Why it is currently strong for VexLife:

~~~text
Kotlin/JVM Product
-> direct Java/JNI API
-> streaming ASR is first-class
-> no Python process required for normal inference
-> cross-platform product trajectory already exists
~~~

Current JVM realization evidence is unusually close to the Product need:

~~~text
OnlineRecognizer(config)
-> createStream()
-> stream.acceptWaveform(floatSamples, 16000)
-> while recognizer.isReady(stream): recognizer.decode(stream)
-> recognizer.getResult(stream).text
-> recognizer.isEndpoint(stream)
-> recognizer.reset(stream)
~~~

The upstream Java microphone example feeds signed little-endian 16-bit mono PCM at 16 kHz in
1,600-sample / 100 ms chunks. VexLife does not need to use JavaSound microphone capture; its
current browser realization can continue to own microphone permission/capture and send the same
bounded PCM meaning to the loopback Product boundary.

This makes the first integration hypothesis:

~~~text
browser Web Audio / AudioWorklet
-> 16 kHz mono PCM chunks
-> current loopback Product service
-> sherpa-onnx OnlineStream
-> partial/final transcript observation
-> VexLifeVoiceInputFamily
-> Composer
~~~

That is a hypothesis to pressure, not a new architecture foundation.

Unresolved before selection:

- exact model artifact license/provenance for the chosen ASR checkpoint;
- actual Apple-silicon latency/accuracy with Victor-style dictation;
- native JNI library + JVM JAR packaging/signing inside the VexLife application distribution;
- whether the 20M English streaming model gives adequate dictation accuracy;
- partial-result stability and endpointing behavior;
- model/update/currentness contract.

## Candidate B — whisper.cpp

Pinned research source:

~~~text
repo       ggml-org/whisper.cpp
head       aba02defd6bb6ff5de63721c21e3456645c153e2
tree       bef40c0ab80027863d3d546c81b9b3356ccc2b32
license    MIT
release    v1.9.5 (2026-10-06)
~~~

Observed provider capabilities from current source:

- plain C/C++ implementation with a C API;
- Apple Silicon first-class via ARM NEON, Accelerate, Metal and optional Core ML;
- macOS Intel/ARM, Windows, Android, iOS, Linux and Java bindings;
- VAD support;
- real-time microphone example;
- quantization;
- no Python dependency for normal runtime.

Upstream model footprint examples:

~~~text
tiny     75 MiB disk / ~273 MB memory
base    142 MiB disk / ~388 MB memory
small   466 MiB disk / ~852 MB memory
medium  1.5 GiB disk / ~2.1 GB memory
large   2.9 GiB disk / ~3.9 GB memory
~~~

The CLI example accepts 16-bit WAV; the library integration does not require us to adopt the CLI
or SDL microphone capture. VexLife can keep browser audio capture and feed a bounded PCM
representation to its own provider boundary.

Why it is currently strong for VexLife:

~~~text
small native runtime
+ excellent Apple acceleration
+ broad platform support
+ Product can own audio capture separately
+ no Python/runtime service requirement
~~~

Unresolved before selection:

- whether direct Java binding is mature enough for the VexLife service contract or a bounded native
  process/FFI boundary is cleaner;
- actual latency/accuracy on current Mac with base/small variants;
- model artifact acquisition/provenance/distribution contract;
- streaming partial-transcript semantics are example-level and must be pressure-tested for Product
  dictation rather than assumed from the terminal demo.

## Candidate C — MLX Whisper

Pinned research source:

~~~text
repo       ml-explore/mlx-examples
head       796f5b53cab69a3d48a44233ce21aae889e94a08
tree       7f6a5504290884ae606679624b9cbc300ef818b5
license    MIT
~~~

Observed provider capabilities:

- Whisper inference in MLX on Apple Silicon;
- `mlx-whisper` Python package;
- Python API `mlx_whisper.transcribe(...)`;
- pre-converted Hugging Face MLX checkpoints;
- word timestamps;
- quantized model conversion;
- ordinary setup documentation assumes ffmpeg for common audio-file decoding.

Why it remains useful:

~~~text
excellent Apple-silicon fit
+ VexLife already owns ManagedPython
+ likely fast Mac-first qualification
~~~

Why it is not the automatic Product choice:

~~~text
Apple-specific
+ Python environment/process burden
+ existing Heretic venv is NOT an ASR package bucket
+ cross-platform application path would need another provider later
~~~

If selected, VexLife should form a separate ASR environment rooted in the existing ManagedPython
substrate rather than modify `HereticPythonEnvironment`.

## Candidate D — Argmax WhisperKit

Pinned research source:

~~~text
repo       argmaxinc/argmax-oss-swift
head       9f99b5cb6a907730543823ad271b82532782a899
tree       9286d36b612222fe8b368c27cd32001e291e8708
license    MIT (+ third-party notices)
release    v1.1.1 (2026-10-08)
~~~

Current source provides Apple-native Core ML Whisper, microphone streaming, model management and a
local OpenAI-compatible transcription server with streaming responses.

This is meaningful evidence for an Apple-native realization, but it currently requires a Swift/Core
ML integration boundary that VexLife-Prod does not otherwise need for this feature.

Keep as a strong Apple-native reference/candidate; do not introduce Swift solely because the
feature name matches.

## Current comparative disposition

~~~text
sherpa-onnx
  strongest direct fit to current Kotlin/JVM + streaming + cross-platform Product topology

whisper.cpp
  strongest minimal native / portable runtime and Apple acceleration candidate

MLX Whisper
  strongest bounded Mac-first experiment, weaker platform-neutral Product fit

WhisperKit
  strong Apple-native implementation, higher integration-topology cost today
~~~

No provider is selected yet.

## Customizable provider boundary

The existence of several legitimate local ASR realizations is now concrete pressure for one narrow,
provider-neutral interface/configuration boundary. It does **not** justify moving provider identity
into VoiceInput semantic State.

~~~text
VexLifeVoiceInputFamily
  Start / Stop / semantic State / transcript meaning
  DOES NOT know sherpa / whisper.cpp / MLX / WhisperKit

Settings / configuration owner
  selectedProviderRef
  selectedModelRefOrNull
  human-visible qualified choices

local-ASR realization boundary
  current qualified provider catalog
  current runtime/model capability
  selected provider/model
  one session contract

provider implementation
  sherpa-onnx OR whisper.cpp OR another qualified provider
  owns physical ASR mechanics only
~~~

The minimal provider contract should be pressured toward responsibilities equivalent to:

~~~text
provider identity / version
model identity / version
capability observation
open transcription session
accept bounded PCM samples
observe partial/final transcript
Stop / cancellation
close / release
failure/currentness observation
~~~

The exact language/type names are implementation-owned and must be earned in VexLife-Prod source.
Do not create a generic framework or manager simply because this document can list those operations.

Human configurability should route through the rightful Product Settings owner:

~~~text
human selects qualified ASR provider/model
-> Settings semantic Control
-> persisted Product configuration
-> realization resolves that provider for the next VoiceInput session
~~~

VoiceInput remains provider-agnostic:

~~~text
BeginLocalDictation(language)
-> selected qualified local-ASR realization
-> transcript observation
-> same VoiceInput Family
~~~

A future `AUTO` selection policy is not assumed by this Project. If earned, it must itself have
explicit deterministic selection/currentness rules rather than silently choosing whichever provider
happens to load.

VexLogger may record stable provider/model/version refs and timing/failure facts. It must not record
raw audio or transcript content merely because multiple providers exist.

This configuration pressure is tracked explicitly as:

~~~text
work.vexlife.local-voice-input.provider-selection-contract
WAITING_DEPENDENCIES on provider qualification
~~~

## A001 qualification experiment

The first host experiment should compare **sherpa-onnx and whisper.cpp** before Product source
integration.

Why these two first:

- both can satisfy local-only operation;
- both have a credible Mac + Windows + mobile trajectory;
- one represents direct JVM/streaming integration;
- one represents the smallest native Whisper runtime;
- the comparison tests the actual architectural choice rather than two wrappers around the same
  Python topology.

Use one exact bounded audio corpus:

1. one deterministic upstream English WAV for reproducibility;
2. one Victor-spoken short dictation captured locally after the deterministic runtime proof.

Record for each candidate:

~~~text
exact source/version
exact model identity + artifact hashes/bytes
dependency/native-library bytes
cold initialization duration
first transcript duration
total real-time factor
final transcript
partial transcript behavior when supported
peak process RSS where available
Stop/cancellation behavior
network activity after artifacts are present
failure evidence
cleanup disposition
~~~

The experiment must not:

- modify the Heretic runtime environment;
- send audio to a cloud transcription service;
- persist human audio into Conversation, Memory or chronology;
- claim a model license until its exact artifact/source license is verified;
- select a Product provider solely because it won one synthetic fixture.



## A001 sherpa host result — runtime passed; 20M model not selected

Exact lived RETURN:

~~~text
RETURN sha256
adf278c5af4cb43678edb17b6d7b4f8cc3ea2edd6d8de04c45edc99d6b5d3b1e

provider source
aa273e8029af4e0aabac7d7455a177c5b493aa34

provider release
v2.0.1

model
sherpa-onnx-streaming-zipformer-en-20M-2023-02-17
~~~

Observed on Victor's Apple-silicon Mac:

~~~text
audio duration      6.625 s
model/session init  825 ms
first partial       38 ms
inference           120 ms
real-time factor    0.0181
partial updates     13
peak RSS            337,395,712 bytes
~~~

This proves the released JVM + macOS ARM64 native path is real and extremely faster than realtime on
the deterministic fixture.

The reference sentence is:

~~~text
AFTER EARLY NIGHTFALL THE YELLOW LAMPS WOULD LIGHT UP HERE AND THERE
THE SQUALID QUARTER OF THE BROTHELS
~~~

A001 returned:

~~~text
THE YELLOW LAMPS WOULD LIGHT UP HERE AND THERE
THE SQUALID QUARTER OF THE BRAFFLELS
~~~

For this one fixture only:

~~~text
3 deletions
1 substitution
4 / 18 reference-word errors ~= 22.2%
~~~

This is not a corpus WER claim. It is enough to withhold Product-default selection of this 20M
streaming model.

The exact host evidence also corrected one proof assumption:

~~~text
runner requested java_home -v 21
actual retained JVM = Temurin 17.0.20.1
~~~

Therefore A001 proves the provider under the actual Java 17 runtime used by the run. Exact
VexLife-private-image JDK-21 compatibility remains a later Product integration predicate.

Current disposition:

~~~text
sherpa JVM/native integration seam    PASS
streaming partials                    PASS
speed                                 EXCELLENT
20M model dictation quality           NOT SELECTED
provider qualification                RUNNING
~~~

Next compare a Whisper runtime/model on the same fixture, then decide whether to:
- prefer a Whisper-family provider;
- pressure a stronger sherpa streaming model;
- or retain multiple qualified choices behind the provider-selection contract.




## A002 whisper.cpp host result — exact fixture transcript; preferred next integration candidate

Exact lived RETURN:

~~~text
RETURN sha256
26a79b9d89cffb9a62d24e7140ba913859d842b288066fd8f9d85d408cccf38d

status
PASS

whisper.cpp source commit
d1be6fde11ac6e0407606b4e42fe72d34add8037

source tree
6fe2755682242a5c01aba65a22b3c0305d747841

model
ggml-base.en.bin

model bytes
147,964,211

model sha256
a03779c86df3323075f5e796cb2ce5029f00ec8869eee3fdfb897afe36c6d002
~~~

The exact same 6.625-second fixture used by sherpa A001 produced:

~~~text
After early nightfall the yellow lamps would light up here and there
the squalid quarter of the brothels.
~~~

Ignoring capitalization and punctuation, this is an exact 18/18 word match against the fixture
reference: zero substitutions, deletions or insertions.

Observed current Mac runtime:

~~~text
Apple M4 Pro / Metal
model load                   51.72 ms
Whisper internal total       1,467.14 ms
cold process wall time       4.18 s
internal-total RTF           ~0.2215
cold process-wall RTF        ~0.631
maximum resident set size    400,343,040 bytes
peak memory footprint        444,548,224 bytes
~~~

The cold process wall includes first-process Metal embedded-library initialization/compilation.
Even that cold run is faster than the 6.625-second source audio.

### Same-fixture comparison

~~~text
                         sherpa 20M             whisper.cpp base.en

final word edits         4 / 18                  0 / 18
provider timing          120 ms inference        1,467 ms internal total
max RSS                  337,395,712 B           400,343,040 B
model/archive            ~127.9 MB archive       147,964,211 B model
streaming partials       13 observed             not tested by CLI comparator
endpoint                 0 observed              not tested by CLI comparator
~~~

One fixture is not a corpus benchmark and does not establish a permanent Product default.

It is sufficient to make whisper.cpp Base English the preferred candidate for the **next direct
Product/JVM streaming pressure test**, while sherpa remains a legitimate provider family and a
larger/better sherpa model remains a possible future qualified option.

### Next relationship question

Current whisper.cpp source already exposes:

- a C API over float PCM;
- abort/progress/new-segment callbacks;
- Java/JNA bindings for `whisper_full(... float[] samples ...)`;
- `whisper_full_with_state` and related result access.

The next spike should therefore test the shortest Product-shaped route:

~~~text
JVM
-> whisper.cpp JNA/native binding
-> float PCM
-> transcript
~~~

before choosing a sidecar/service topology.

That experiment should also pressure cancellation/segment callbacks enough to decide whether
VoiceInput session custody can stay owner-local or actually earns reusable VexExecution.




## A003 direct JVM/JNA result — in-process Product topology proved

Exact recovered RETURN:

~~~text
RETURN sha256
ab5b3b8132cb2acd73b5c516734cb64be5692ba7e74f2e03133f27e5e8921c65

status
PASS_PROVIDER_CARRIER_RECOVERED
~~~

Provider evidence:

~~~text
whisper.cpp
commit d1be6fde11ac6e0407606b4e42fe72d34add8037
tree   6fe2755682242a5c01aba65a22b3c0305d747841
release v1.9.5

binding
whisper.cpp/bindings/java @ same pinned commit

JNA 5.13.0
sha256 66d4f819a062a51a1d5627bffc23fac55d1677f0e0a1feba144aabdd670a64bb
bytes 1,879,325

native libwhisper.dylib
sha256 517c632ea287a067d16406b068aca8183a2725865314ea38188bfaca0e3e26d2
~~~

Direct JVM result on the exact same 6.625-second fixture:

~~~text
JVM float PCM
-> JNA
-> libwhisper.dylib
-> Metal / Apple M4 Pro
-> transcript

initMs         4186
inferenceMs     683
wholeMs        4876
RTF            0.1031
final words    exact 18 / 18
~~~

The model/runtime used Metal and the same Base English model pinned by A002.

Carrier recovery boundary:

~~~text
provider inference            PASS
Gradle task                   BUILD SUCCESSFUL
provider-result formed        YES
single-use Gradle teardown    HELD
normal outer ZIP packaging    NOT REACHED
evidence directory            recovered without rerunning inference
~~~

Because the parent Gradle invocation never terminated, A003 does not claim terminal `time -l`
process statistics. The provider/runtime result itself is independent of that teardown defect.

Architectural consequence:

~~~text
SEPARATE SPEECH PROCESS
is NOT currently earned.

The smallest proved realization is:

browser PCM
-> existing VexLife JVM service
-> direct whisper.cpp/JNA
-> VoiceInput reconciliation
-> Composer
~~~

This does not make the JVM service the ASR semantic owner. It hosts the provider realization.

Next provider-qualification pressure should be the actual browser-audio ingress/session path,
including Stop/cancellation behavior and live transcript cadence. That pressure decides whether
owner-local ASR session custody is enough or whether VexExecution is truly earned.


## Selection threshold

Promote one candidate only when it is clear which integration burden is smaller **for the Product**,
not merely which demo command was easier.

Expected decision questions after A001:

~~~text
Does JVM-native streaming materially simplify VoiceInput enough to prefer sherpa-onnx?

Does whisper.cpp's native simplicity/portability beat the JNI/model-selection complexity?

Does either candidate require a provider abstraction beyond the existing local-ASR boundary?

What model size gives acceptable Victor-style dictation latency/accuracy?

Can the selected runtime be packaged/currentized without coupling to Heretic?
~~~

<!-- [VXG RealForever][VEXWORK][VEXLIFE][LOCAL-VOICE-INPUT][PROVIDER-QUALIFICATION] -->
