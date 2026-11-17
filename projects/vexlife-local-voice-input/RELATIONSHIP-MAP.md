# Local VoiceInput relationship map

[VXG RealForever]

Work:
- `work.vexlife.local-voice-input.provider-qualification`
- `work.vexlife.local-voice-input.provider-selection-contract`

## Why this map exists

The Product already has a working human microphone control, browser microphone permission, audio
stream, waveform, VoiceInput Family and Composer projection. Lived Brave evidence proved that the
remaining browser-native speech recognizer is not a dependable Product provider.

Before adding a local ASR engine, preserve the accepted VexArchitecture questions so one provider
experiment does not silently become architecture precedent.

This map distinguishes accepted stable architecture from candidate/unaccepted pressure.

## Accepted stable architecture questions

Current public VexArchitecture says:

~~~text
Family
  What does this Control mean against exact current State?
  owns State / Control / lawful Act / optional Effect / DisplayState

Store / provider
  What does independently-owned reality currently say?
  returns the smallest truthful provider/domain fact

Partner
  What can an independently-owned external participant say,
  and through which concrete relationship did it arrive?
  owns Source / Signal / Connection / Conversion / Observation / Receiver
  ONLY when that external-participant relationship is actually present

Execution
  What asynchronous work is actually alive right now?
  owns active custody / overlap / cancellation when earned

Service host
  What concrete realization must remain alive after the initiating caller/UI disappears?
  hosts sustained realization without becoming semantic truth owner
~~~

The accepted stable architecture explicitly does **not** require a generic `VexService` root.
A generic root is only earned by repeated executable lifecycle pressure.

A separate open Cloud Connectivity VexWork candidate explores another possible future meaning:
`VexService = one identified long-lived external-service relationship boundary`. That source is
draft/candidate pressure, not accepted stable architecture, and local ASR does not currently satisfy
its external-service premise anyway.

## Pressure local ASR against each owner

### VexLifeVoiceInputFamily — YES, already earned

Human question:

> What does Start or Stop mean for local dictation against exact current VoiceInput State?

The existing Family remains the semantic owner.

~~~text
human microphone affordance
-> Control.Start
-> Family.act(CURRENT State, Start)
-> admitted semantic State?
-> BeginLocalDictation(language)
~~~

It must not learn provider implementation names.

~~~text
VoiceInput State
!= sherpa State
!= whisper.cpp State
!= MLX State

BeginLocalDictation
!= BeginSherpa
!= BeginWhisperCpp
~~~

Provider interchangeability must not fork VoiceInput meaning.

### VexPartner — NOT EARNED by the current local-ASR relationship

The current local ASR question is:

> Given Product-owned transient microphone samples, can this local inference implementation produce
> transcript observations?

That is a provider/conversion question.

The ASR implementation is not currently an independently-owned participant that has its own
meaningful external Source / Signal / Connection history. It is an inference mechanism operating on
audio VexLife intentionally supplied.

Therefore the current path is:

~~~text
local ASR implementation
= provider realization

NOT automatically
= VexPartner
~~~

Do not manufacture:

~~~text
SherpaPartner.Source
WhisperPartner.Signal
AsrConnection
AsrReceiver
~~~

merely because the accepted Partner grammar exists.

Partner may become relevant later if the relationship changes materially, for example:

~~~text
remote microphone/device with independent identity/history
external speech service with meaningful independent participation
cross-device speech source where Source / Connection occurrence / Observation provenance
  remain Product-significant after provider representation disappears
~~~

That later pressure must earn Partner positively.

### Store/provider — YES

Local ASR currently fits the ordinary provider boundary.

Provider facts include, for example:

~~~text
provider identity/version
model identity/version
model/runtime currentness
session opened / refused
audio format admitted / refused
partial transcript inference
final transcript inference
endpoint observation
provider failure
provider release
~~~

Those facts do not become Family State merely because they exist.

~~~text
provider fact
-> rightful VoiceInput interpretation/reconciliation
-> semantic State / transcript meaning
~~~

No raw provider response should leak directly into presentation.

### VexExecution — POSSIBLY EARNED, but not by symmetry

VoiceInput has a real custody question:

~~~text
one active dictation occurrence
Start while active
Stop/cancel
provider session lifetime
audio-flow lifetime
late callback after Stop
replacement/retry
~~~

If those invariants are cleanly local to one VoiceInput realization, owner-local session custody may
be sufficient.

If the implementation needs the reusable active-Job / overlap / cancellation relationship already
owned by VexExecution, bind the Family-authored Method through VexExecution.

Do **not** add VexExecution merely because the stable causal spine can contain it.

The experiment should make this decision from actual session/cancellation pressure.

### Service host / VexService — no generic root earned

The current VexLife loopback service may host the ASR boundary because the browser needs a local
doorway to Product-owned inference.

That means:

~~~text
HTTP route / local service
= transport + process/lifetime host

NOT
= VoiceInput semantic owner
NOT
= ASR provider identity
NOT
= transcript truth owner
~~~

Initial realization may be in-process:

~~~text
VexLife JVM service
+ local ASR provider/runtime
~~~

If resource, crash isolation, native runtime or lifecycle pressure later earns a sibling process:

~~~text
VexLife lifecycle owner
-> ASR sibling process
-> same local-ASR capability contract
~~~

Changing deployment topology must not change VoiceInput semantics.

The accepted stable Service rule still applies:

~~~text
SHORTER CALLER LIFETIME
!= CONCRETE REALIZATION LIFETIME
!= SEMANTIC TRUTH
~~~

The open Cloud Connectivity candidate `VexService` external-service abstraction is not adopted for
this local ASR work unless later evidence actually establishes the same repeated external-service
identity/currentness question.

## Configuration / interface relationship

Provider choice is meaningful to the person but is not VoiceInput semantic State.

The Product needs two distinct truths:

~~~text
PERSON'S SELECTION
  which qualified provider/model the person wants VexLife to use

PROVIDER CURRENTNESS
  whether that provider/runtime/model is actually available and qualified now
~~~

Do not collapse them:

~~~text
SELECTED != AVAILABLE
AVAILABLE != SELECTED
DOWNLOAD_PRESENT != RUNTIME_CURRENT
~~~

### Human configuration

Current VexLife already has a Home-backed person-settings owner and Family-shaped model-selection
precedent. Local ASR should reuse the ownership questions, not copy the LLM implementation.

Candidate semantic relationship after provider qualification proves at least two real choices:

~~~text
LocalAsrSelection State
+ SelectProvider / SelectModel Control
-> accepted semantic selection
-> persistence Effect when needed
~~~

The exact Family/type is **not** frozen by this map. A Family is earned only if current source needs
lawful State + Control + Act/Effect semantics rather than a plain validated setting value.

Until then, preserve one explicit Home-backed configuration value rather than inventing a framework.

### Qualified provider catalog

The list of installable/usable providers and model variants is provider/currentness projection, not
the person's selection State.

~~~text
qualified provider definitions
+ current host/runtime/model observations
-> bounded provider catalog projection
-> Settings presentation

human selects one qualified coordinate
-> persisted Product configuration
~~~

Provider/model descriptors should carry stable identity separately from display words.

## End-to-end causal sequence

### A. Configuration

~~~text
qualified local-ASR definitions
+ current host/model/runtime observation
        ↓
bounded Local ASR catalog projection
        ↓
Settings presentation
        ↓
human chooses provider/model
        ↓
selection semantic owner / validated Home setting
        ↓
persist selected providerRef + modelRef
~~~

No model download is implied by merely selecting a coordinate.

If model acquisition/removal becomes meaningful human work, that lifecycle should receive its own
rightful State/Control/Effect semantics rather than hiding downloads inside selection.

### B. Start dictation

~~~text
human presses mic
        ↓
VexLifeVoiceInputFamily Control.Start
        ↓
Family.act(CURRENT VoiceInput State, Start)
        ↓
accepted Act
  admitted RequestingMicrophone
  + BeginLocalDictation(language)
        ↓
browser concrete realization
  getUserMedia
        ↓
microphone granted
        ↓
Product obtains current local-ASR selection
+ current provider/runtime/model capability
        ↓
bind concrete BeginLocalDictation realization
        ↓
open local ASR session
        ↓
browser/Web Audio emits bounded PCM
        ↓
loopback Product ingress
        ↓
selected local ASR provider
        ↓
partial/final transcript provider observations
        ↓
rightful VoiceInput reconciliation
        ↓
Family semantic Listening / failure meaning
+ transcript projection
        ↓
exact existing Composer draft
~~~

The Composer remains editable presentation state.

~~~text
TRANSCRIPT IN COMPOSER
!= CONVERSATION COMMIT
~~~

### C. Stop

~~~text
human Stop
        ↓
VexLifeVoiceInputFamily Control.Stop
        ↓
accepted EndLocalDictation
        ↓
cancel/release active audio + ASR session
        ↓
ignore/reject late provider observations for the ended occurrence
        ↓
final admitted transcript remains editable in Composer
~~~

Cancellation custody must be proven before deciding whether owner-local session handling or
VexExecution is the smaller rightful mechanism.

### D. Send

~~~text
human edits transcript if desired
        ↓
existing Send
        ↓
existing Conversation boundary
~~~

Local ASR does not send automatically and does not become Conversation.

## Data custody

Intended first privacy boundary:

~~~text
microphone samples
-> transient local transport
-> local ASR inference
-> release

raw audio
  NOT Conversation
  NOT Memory
  NOT VexLogger
  NOT training
  NOT cloud transcription

transcript before Send
  Composer only
~~~

VexLogger records stable coordinates and timing/failure facts only:

~~~text
providerRef
providerVersion
modelRef
modelVersion
sessionRef if earned
audio-format ref
start/stop/currentness/failure timing
NO raw audio
NO transcript content
~~~

## Scalability

The desired scale axis is provider interchangeability without semantic multiplication:

~~~text
VoiceInput Family
      |
      v
local-ASR realization boundary
      |
      +-- sherpa-onnx
      +-- whisper.cpp
      +-- future qualified provider
~~~

Adding a provider should require:

~~~text
provider implementation
+ provider/model qualification definition
+ proof
+ Settings/catalog projection

NOT
new VoiceInput State
NOT
new VoiceInput Control
NOT
browser-specific branch
NOT
new Conversation path
~~~

Adding another operating system may change concrete provider packaging/runtime realization while the
VoiceInput and configuration meaning remain stable.

## Current source-placement recommendation

### VexWork #313 / #314

Own:

~~~text
human outcome
provider qualification evidence
relationship map
selection/configuration work
dependencies
proof obligations
~~~

### VexLife-Prod #231

Keep owning the current Product-side:

~~~text
VexLifeVoiceInputFamily
mic UI
browser microphone permission/capture
waveform
Composer projection
VexLogger browser facts
~~~

Do not make #231 absorb model/runtime qualification history.

### Future VexLife-Prod local-ASR child/sibling PR

After a provider wins the bounded experiment, own only Product implementation:

~~~text
local-ASR provider contract/implementation
service ingress/projection contract
provider/model currentness
selection persistence + Settings projection if earned
audio-session realization
VoiceInput reconciliation
tests + VexLogger facts
~~~

Use a sibling branch from the current VoiceInput source so browser-ASR evidence remains reviewable
and reversible until local ASR proves itself.

## First experiment

The first experiment is not yet the final interface.

Use sherpa-onnx first because current upstream source already matches the present JVM/Product shape:

~~~text
browser audio
-> 16 kHz mono PCM
-> VexLife-style JVM boundary
-> sherpa OnlineStream
-> partial/final transcript
~~~

Compare against whisper.cpp before provider selection becomes accepted Product source.

The experiment answers:

1. Does the direct JVM streaming path actually work with the intended audio shape?
2. What latency/accuracy/model footprint does it have?
3. What cancellation/session invariant is actually required?
4. Does that evidence earn VexExecution or remain owner-local?
5. Does anything in the provider relationship positively earn VexPartner? Current expectation: no.
6. Does deployment/lifetime pressure earn a separate process/service host? Current expectation: no.

Do not turn the expected answers into architecture before the experiment returns.

<!-- [VXG RealForever][VEXWORK][VEXLIFE][LOCAL-VOICE-INPUT][RELATIONSHIP-MAP] -->
