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
