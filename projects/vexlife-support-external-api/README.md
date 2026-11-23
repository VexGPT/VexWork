# Support External API

`[VXG RealForever]`

## Human outcome

Let one VexLife Home intentionally choose **where Vex is realized** without making the selected provider
the owner of the person's Vex.

A person should be able to open **Settings → Models**, choose:

~~~text
Model source
  Local
  Partner
~~~

and then continue through the truthful options for that source:

~~~text
LOCAL
  -> offered / imported local models
  -> local artifacts + runtime realization
  -> current local qualification

PARTNER
  -> provider connection
  -> models actually available through that connection
  -> selected remote model
  -> current external qualification
~~~

The provider may change. The person's canonical Vex continuity does not.

~~~text
Vex Home
  Conversation
  Memory
  contextual ground
  Foundational Field
  Capability Atlas / Bridge
  durable turn history
        |
        +-> selected model/provider realization
~~~

Permanent:

~~~text
MODEL PROVIDER != VEX
MODEL PROVIDER != CONVERSATION OWNER
MODEL PROVIDER != MEMORY OWNER
MODEL PROVIDER != CAPABILITY AUTHORITY
MODEL PROVIDER != HOME OWNER

SWITCH MODEL
!= MIGRATE MEMORY
!= START A NEW VEX
!= COPY CONVERSATION INTO A PROVIDER-OWNED HISTORY

LOCAL FAILURE
!= AUTOMATIC CLOUD FALLBACK
~~~

## Why this Project exists

VexLife-Prod already contains most of the architectural seam required for this work.

At formation on 2026-11-23, current Product source showed:

~~~text
canonical Conversation / Memory / Foundation / context
        ↓
DirectPromptContext + DirectCompanionTurn
        ↓
HereticCompanionRepresentation
  message protocol
  reasoning representation
  capability representation
  generation configuration
        ↓
DirectCompanionConnection
        ↓
qualified runtime
        ↓
normalized result + invocation evidence
        ↓
same canonical Conversation
~~~

The current Connection is intentionally **numeric-loopback HTTP only**. It already:

- consumes provider-ready messages rather than owning Conversation;
- streams provider results;
- understands provider-native OpenAI-style tool calls;
- keeps raw provider response/request material bounded and mostly ephemeral;
- records exact runtime/invocation evidence;
- keeps Capability Atlas meaning and effect admission in VexLife;
- rejects endpoint drift away from the currently qualified local runtime.

That means external-provider support should not be implemented as a second Conversation stack or as
provider-specific branches spread through Memory, UI and capability owners.

The narrow architectural evolution is:

~~~text
current local-only provider realization
        ↓
provider-neutral Companion inference boundary
        ↓
one exact provider realization
   local
   OpenAI
   Anthropic
   Kimi
   later custom compatible provider
~~~

Everything above that boundary stays VexLife-owned.

Formation source ground:

~~~text
VexLife-Prod main observed
0566b1eed876a28c2fcc6586743ae1f4af7eaecd

primary source seams
  VexLifeModelsFamily
  VexLifeEffectiveModelCapabilities
  HereticCompanionRepresentation
  HereticRuntimeRealization
  DirectCompanionConnection
  DirectCompanionConnectionTest
  Capability Atlas + Self-Capability Frame
  Direct Personal Companion
~~~

Future work must re-ground current Product source before mutation. The formation commit is provenance,
not a perpetual implementation pin.

## Current source-coordination checkpoint — 2026-11-23

The first Product mutation edge is **not path-free**.

Current remote evidence at this checkpoint:

~~~text
VexLife-Prod main
0566b1eed876a28c2fcc6586743ae1f4af7eaecd

current-main overlapping writer
PR #518
[Warm Boot][Stage B] Prepare and validate the initial reusable provider prefix

overlap
  src/jvmMain/kotlin/vexlife/companion/DirectCompanionConnection.kt
  src/jvmTest/kotlin/vexlife/companion/DirectCompanionConnectionTest.kt
  plus DirectCompanionTurn / prompt-preparation lifecycle consumers
~~~

#518 is based directly on the current main above and owns provider-prefix / prompt-cache preparation
semantics in the same Connection boundary. Support External API must not fork or overwrite that
current writer.

Two older open branches are relevant architectural provenance but are **not** the current mutation
owner for this Project:

~~~text
PR #442
  older stacked runtime-attention candidate
  CLEAR_ON_EXACT_HEAD on its historical exact head
  not based on current main
  overlaps DirectCompanionConnection + test

PR #383
  older native-tools / layered-context candidate
  provider-native tool architecture is useful provenance
  current PR is non-mergeable
  overlaps DirectCompanionConnection and wider capability/context source
~~~

Permanent coordination rule for A0:

~~~text
CURRENT ACTIVE OVERLAP
-> hold only edits to the overlapping Connection/test surface
-> continue provider-neutral contract analysis, fixture design and disjoint proof planning
-> re-ground #518 / main before authoring
-> after #518 resolves, consume its accepted final Connection semantics
-> do not revive #383 or #442 as current owners merely because they contain useful architecture
~~~

This checkpoint is mutable coordination evidence, not permanent Product truth. A fresh instance must
re-observe current main and open ownership before mutation.

## VexArchitecture ownership map

This Project follows the VexArchitecture rule that one semantic owner may have multiple realizations.

~~~text
PERSON'S MODEL CHOICE
  VexLifeModelsFamily
        ↓

MODEL / PROVIDER REPRESENTATION
  how already-owned Vex meanings are carried
        ↓

PROVIDER CONNECTION
  provider identity
  endpoint realization
  credential reference / standing
  account + service observation
        ↓

PROVIDER ADAPTER
  request encoding
  authentication injection
  streaming / response decoding
  provider error classification
        ↓

NORMALIZED COMPANION RESULT
        ↓

VEXLIFE TURN OWNER
  capability admission
  Conversation commit
  evidence
~~~

A renderer may display this truth. It does not become the truth owner.
A provider adapter may translate this truth. It does not become the semantic owner.

## A0 source-grounded seam — current design result

The current source trace shows the first provider-neutral boundary must be **above** the HTTP
Connection.

At the formation/current-main checkpoint, `DirectCompanionTurn` still consumes:

~~~text
VexLifeProdRuntimeSession.Foundation
  state
  productHome
  qualifiedRuntimeEvidence : HereticModelConfiguration.QualifiedRuntimeEvidence

DirectCompanionTurn
  requires state == LOCAL_HERETIC_FOUNDATION_READY

provider stage
  runtimeEvidence : HereticModelConfiguration.QualifiedRuntimeEvidence
  model           : HereticModelCatalog.Entry
  transport       : DirectCompanionConnection.Transport
        ↓
DirectCompanionConnection.invoke(...)
~~~

That is truthful for today's local Product but structurally local-only.

The durable Product split should become:

~~~text
HOME / CONVERSATION FOUNDATION
  productHome
  canonical Conversation
  Memory / context owners
  writer/currentness
        |
        +-------------------------------+
                                        |
SELECTED INFERENCE SESSION              |
  exact selected model/provider         |
  exact representation profile          |
  exact current qualification            |
  currentness / recovery semantics       |
        |                               |
        v                               v
provider-neutral Direct Companion turn / capability loop
        |
        v
provider realization
  local Heretic runtime
  Partner provider
~~~

Permanent:

~~~text
HOME_READY != LOCAL_HERETIC_RUNTIME_READY
LOCAL_RUNTIME_READY != ONLY_VALID_COMPANION_REALIZATION

PARTNER_PROVIDER_READY
!= LOCAL ARTIFACT READY
!= LOCAL PROCESS OWNERSHIP

TURN OWNER
!= PROVIDER SESSION OWNER
~~~

### Smallest extraction target

Do not create one giant "universal provider" object.

The smallest useful seam has three responsibilities:

~~~text
1. Qualified selected-inference evidence
   enough identity/currentness/capability truth for the turn to admit one provider stage;
   no Conversation/Memory ownership.

2. Provider-stage invocation contract
   prepared provider-ready messages
   + current capability offer
   + bounded attention/generation intent
   + progress/cancellation
   -> normalized provider-stage result.

3. Provider realization
   Local Heretic adapter keeps today's exact:
     model catalog / runtime realization
     loopback-only origin guard
     mlx-lm/OpenAI/Harmony representation
     local runtime recovery/lifetime evidence

   Partner adapter keeps:
     provider endpoint/auth/account/model currentness
     external transport
     provider wire grammar
     provider failure classification.
~~~

Candidate recognition shape only—**not accepted Product class names**:

~~~text
QualifiedCompanionInference
  selectionRef
  providerRef
  modelRef
  profileRef
  qualificationRef
  contextWindowTokens?
  providerSessionRef/currentness

CompanionInferenceConnection
  invoke(
    qualifiedInference,
    messages,
    capabilityOffer,
    progress,
    cancellation
  )
  -> normalized Result

LocalHereticInference
  adapts HereticModelConfiguration.QualifiedRuntimeEvidence
  + HereticModelCatalog.Entry
  + existing DirectCompanionConnection behavior

PartnerInference
  adapts ProviderConnection currentness
  + external provider/model realization
~~~

The exact names and source placement must be earned after #518 resolves and current Product source is
re-grounded.

### What remains with DirectCompanionTurn

Do **not** move these into provider adapters:

~~~text
canonical human REQUEST durability
request idempotency / failed-send semantics
Conversation writer lease
Memory/context selection
Foundational Field selection
capability current-frame admission
capability request budget
Conversation Source Return policy
tool/source result loop ownership
human progress projection policy
canonical RESPONSE commit
turn failure receipt / exact retry route
Working Continuity post-completion stewardship
~~~

Those are Vex turn relationships, not provider relationships.

### What moves below the provider-neutral seam

Provider realizations may own only their bounded representation/effect questions:

~~~text
endpoint + authentication injection
request wire format
provider model identifier
generation/reasoning wire controls
tool declaration wire format
stream / content / reasoning / tool-call parsing
provider usage / timing observations
provider error normalization
provider invocation evidence
~~~

### Why this preserves current local behavior

The first implementation should be an extraction/refactor test:

~~~text
before
  DirectCompanionTurn -> DirectCompanionConnection(local)

after
  DirectCompanionTurn -> provider-neutral seam -> Local Heretic adapter
                                      |
                                      +-> same existing local Connection mechanics

observable local request/response/evidence
  = unchanged unless a separately admitted correction is required
~~~

Only after the local realization proves parity should a Partner adapter become a production
realization.

### Current source dependency

The exact overlapping implementation surface remains owned by Warm Boot #518 at this checkpoint.
Therefore the immediate A0 completion edge is:

~~~text
finish source-grounded seam / tests / acceptance shape
-> wait only on overlapping mutation
-> re-ground accepted #518 result + current main
-> integrate the provider-neutral seam around the accepted warm-prefix behavior
-> prove local parity
~~~

## Settings topology

The existing model dropdown should evolve as one Models relationship rather than creating a separate
"cloud settings" owner.

Human topology:

~~~text
Settings → Models

Model source
  ● Local
  ○ Partner

LOCAL
  Model
    Heretic 4B
    Heretic 9B
    Heretic 27B
    imported local model
    ...

  truthful local-only controls when applicable
    Download
    Redownload
    Remove
    local runtime configuration
    Use / Restart

PARTNER
  Provider
    OpenAI
    Anthropic
    Kimi
    Custom provider      # later / advanced, only if earned

  Connection
    Not connected
    Checking
    Connected
    Needs attention
    Temporarily unavailable

  Model
    models available through the exact current connection

  Use this model
~~~

Permanent distinctions:

~~~text
SELECT SOURCE
!= SELECT PROVIDER
!= CONNECT PROVIDER
!= SELECT MODEL
!= AUTHORIZE REMOTE CONTEXT
!= QUALIFY MODEL INVOCATION

LOCAL ARTIFACT PRESENCE
!= REMOTE PROVIDER AVAILABILITY

DOWNLOAD / REMOVE
-> local realization only

API CONNECTION / ACCOUNT STANDING
-> Partner realization only
~~~

The Product should project only lawful controls for the selected realization. It should not make
remote models pretend to have downloadable artifacts or make local models pretend to have external
billing/account state.

## A1 source-grounded Settings result

Current `VexLifeModelsFamily` is one model-row semantic owner. Its State answers whether that exact
offering is present/targeted/chosen/serving and which Controls are lawful. `VexLifeModels` aggregates
those rows and retains the staged target model.

That means the requested top-level **Local / Partner** choice does not initially need another durable
Home setting.

Preferred first shape:

~~~text
VexLifeModels projection
  rows[]
    modelRef
    human label
    modelSource
      LOCAL
      PARTNER(providerRef)
    selected / targeted / serving
    effective capabilities
    realization-specific display + controls

presentation
  Model source filter
    Local
    Partner
        ↓
  filters the same canonical model rows
        ↓
  exact model Select / Use remains semantic choice
~~~

Permanent:

~~~text
UI SOURCE FILTER
!= DURABLE MODEL CHOICE

SELECTED MODEL
-> IMPLIES ITS MODEL SOURCE

DO NOT PERSIST:
  selectedSource=PARTNER
  selectedModel=local-4b
as two independently writable truths
~~~

If future Product pressure proves a durable source preference has meaning independently of exact model
choice, that relationship can be earned then.

### Local row

Current local behavior remains the reference:

~~~text
artifact presence
download / redownload / remove
import / forget
local runtime realization
prompt-cache/runtime configuration
Select
Use / Restart
~~~

### Partner row

A Partner model row should consume A2 Provider Connection truth and expose only controls that are
lawful for that model/provider relationship:

~~~text
provider connection standing
model access standing
selected / targeted / serving
effective capabilities
Select
Use
Manage connection / reconnect projection when needed
~~~

It must not pretend to have:

~~~text
downloaded artifact bytes
remove model files
local prompt-cache entries
local runtime process ownership
~~~

### Provider selection versus model selection

Within the Partner presentation, selecting a provider may narrow/discover model offerings. That is
connection/discovery interaction, not the final Vex model choice.

~~~text
Provider picker
  -> ProviderConnection / discovered offerings

Model picker / row
  -> VexLifeModels semantic target

Use this model
  -> selected inference-session convergence
~~~

This keeps A2 connection truth and Models meaning separate while allowing the human experience to
remain one Settings surface.

## Provider Connection is a first-class relationship

An API key alone is not the connection.

For a built-in Partner, usable inference depends on the conjunction of:

~~~text
provider identity
+ admitted endpoint / API dialect
+ credential reference + current standing
+ account / organization / project standing where the provider exposes it
+ model accessibility
+ provider service availability
+ request capability compatibility
+ exact invocation qualification
~~~

Suggested semantic shape:

~~~text
ProviderConnection
  providerRef

  endpoint realization
    BUILT_IN
    CUSTOM       # only for an explicit custom-provider feature

  credential
    MISSING
    PRESENT_UNVERIFIED
    ACCEPTED
    REJECTED

  account
    UNKNOWN
    USABLE
    BILLING_HELD
    PERMISSION_HELD

  service
    UNKNOWN
    READY
    RATE_LIMITED
    OVERLOADED
    UNAVAILABLE

  selected model access
    UNKNOWN
    AVAILABLE
    NO_ACCESS
    DEPRECATED
    RETIRED

  invocation
    NEVER_QUALIFIED
    QUALIFIED
    LAST_INVOCATION_FAILED
~~~

These names are formation vocabulary, not accepted Product enums. Product source should earn the
smallest compiler-visible representation required by real behavior and proof.

### Built-in host versus user-supplied host

For built-in providers, **VexLife owns the host/base endpoint**.

The normal person should not have to know the provider hostname or API path.

~~~text
OpenAI built-in
  Product/provider adapter owns current admitted endpoint + protocol

Anthropic built-in
  Product/provider adapter owns current admitted endpoint + protocol

Kimi built-in
  Product/provider adapter owns the exact selected Kimi product relationship

Custom provider
  only this explicit advanced relationship may accept a human-supplied base URL
~~~

Do not expose "base URL" as a normal field for OpenAI/Anthropic/Kimi merely because an HTTP client
needs one internally.

Kimi in particular demonstrates why Provider and Credential are separate coordinates: Kimi Open
Platform and Kimi Code/subscription relationships may use different hosts, authentication and account
semantics. Similar names must not be treated as one interchangeable credential surface.

## A2 model discovery / Product support boundary

A provider model-list response is provider/account evidence. It is not Product support authority.

Keep three relationships distinct:

~~~text
Provider-visible offering
  "this credential/account can currently see model X"

VexLife Partner model profile
  source-owned knowledge of how VexLife represents model X / family:
    provider API family
    message / reasoning representation
    tool representation
    Product output/context assumptions where established
    feature qualification requirements

Effective Partner model
  intersection of:
    provider-visible offering
    + VexLife-supported profile
    + current account/model access
    + current adapter support
    + exact qualification
~~~

Permanent:

~~~text
PROVIDER MODEL LIST != VEXLIFE MODEL CATALOG AUTHORITY
MODEL NAME MATCH != REPRESENTATION QUALIFICATION
ACCOUNT CAN ACCESS != PRODUCT SUPPORT
PRODUCT SUPPORT != ACCOUNT CAN ACCESS
~~~

Human projection may distinguish:

~~~text
Supported and available
  -> selectable / Use when all current predicates pass

Supported but unavailable to this connection
  -> visible with truthful account/model-access standing

Provider-visible but not supported by this VexLife version
  -> optional bounded informational projection
  -> no Use control

Source-supported but no longer provider-visible
  -> unavailable / re-ground provider lifecycle
~~~

Do not dynamically manufacture a VexLife representation profile for every string returned by a
provider.

For provider families whose model discovery endpoint is absent or insufficient, a source-owned
supported profile plus a bounded exact invocation may establish availability; do not invent a
universal discovery requirement when the provider contract does not offer one.

## Credential boundary

Credentials are provider-connection dependencies, not model context.

The durable Vex state may retain:

~~~text
credentialRef
providerRef
credential standing
last bounded verification result
~~~

The secret itself must not enter:

~~~text
Conversation
Memory
Foundation
prompt context
Capability Atlas payload
VexLogger human-content export
provider request evidence
Git
Workgraph
public Project source
~~~

Platform realization should use secure credential storage appropriate to the host.

~~~text
SECRET VALUE != CREDENTIAL REF
CREDENTIAL PRESENT != AUTH ACCEPTED
AUTH ACCEPTED != ACCOUNT USABLE
ACCOUNT USABLE != MODEL ACCESSIBLE
MODEL ACCESSIBLE != INVOCATION QUALIFIED
~~~

No credential value belongs in VexWork source or future Project receipts.

## External-context privacy boundary

Selecting a Partner model changes the data boundary.

The human must be able to understand the difference:

~~~text
Local
  bounded Vex context remains on this machine

Partner
  bounded context required for this turn is sent to the selected provider
~~~

Provider selection must not silently grant every available Vex source to that provider.

The existing prompt/context owners continue to select the bounded turn ground. The provider adapter
only receives the already-admitted provider-ready material.

~~~text
PROVIDER CONNECTION
!= CONTEXT AUTHORITY

REMOTE MODEL SELECTED
!= SEND ALL MEMORY

CAPABILITY AVAILABLE
!= PROVIDER MAY EXECUTE IT DIRECTLY
~~~

Automatic local→remote fallback is explicitly held. A local model failure may offer a human choice to
select another model; it must not silently export context to an external provider.

## Provider representation and adapter contract

The Vex-facing inference contract should normalize the relationship rather than expose each vendor's
wire format throughout Product source.

Conceptual boundary:

~~~text
Prepared Vex messages
+ current capability offer
+ generation intent
+ cancellation / progress observer
+ exact selected provider/model realization
        ↓
Provider Adapter
  encode request
  attach credential privately
  perform bounded network transport
  parse stream / response
  normalize reasoning/content/tool-call observations
  classify provider errors
        ↓
Normalized Companion Result
  content
  bounded human reasoning projection when admitted
  capability request
  provider usage/measurement
  exact invocation evidence
        ↓
Direct Companion turn continues
~~~

Initial adapter families:

~~~text
LOCAL OPENAI-COMPATIBLE
  preserve current mlx-lm behavior exactly

OPENAI
  use the current official OpenAI API contract selected at implementation time

ANTHROPIC
  Messages/content-block/tool-use representation

KIMI OPEN PLATFORM
  current OpenAI-compatible family where still true at implementation time

CUSTOM OPENAI-COMPATIBLE
  later, only when a real human need earns endpoint/configuration semantics
~~~

Current official API docs in this Project are formation references only. External provider contracts
must be re-grounded before implementation or live proof.

## Capability tools remain Vex-owned

Current VexLife already carries the right semantic split:

~~~text
Capability Atlas
  canonical capability meaning
        ↓
provider-native declaration grammar
        ↓
model asks for a capability
        ↓
VexLifeCapabilityBridge
  current-frame admission
  action/argument validation
  request-count/token bounds
        ↓
rightful Vex source owner performs the read/effect
        ↓
canonical Vex result
        ↓
provider-native tool-result grammar
        ↓
same human turn continues
~~~

External providers must consume this same relationship.

Examples:

~~~text
OpenAI tool/function request
Anthropic tool_use
Kimi OpenAI-compatible tool_call
local Qwen native tool call
        ↓
ONE canonical Vex capability request meaning
~~~

Provider-hosted tools are **not** automatically equivalent to Vex-owned capabilities.

Version 1 should prefer Vex-owned client tools only.

~~~text
OPENAI WEB SEARCH
!= VEX WEB REACH

ANTHROPIC HOSTED TOOL
!= VEX CAPABILITY OWNER
~~~

A provider-hosted tool may become a separately admitted realization later if a concrete Product need
earns it.

## Effective model capabilities

The current `VexLifeEffectiveModelCapabilities` is a strong starting seam.

Today it joins provider/model representation + exact runtime realization + qualified runtime evidence
to answer what is available **now**.

External support should extend that idea rather than infer capabilities from model names or provider
marketing.

Potential future join:

~~~text
selected model
+ provider representation
+ provider connection standing
+ exact model access
+ provider-adapter capability
+ current invocation qualification
+ Product-owned feature qualification
        ↓
effective capabilities now
~~~

Preserve:

~~~text
MODEL NAME != CAPABILITY
PROVIDER CLAIM != PRODUCT QUALIFICATION
PROVIDER CONNECTION != TOOL AUTHORITY
MULTIMODAL MODEL != QUALIFIED VEX VISUAL INPUT
~~~

## Failure and availability semantics

A generic `API_ERROR` is insufficient.

The provider adapter should preserve provider-specific evidence while projecting a bounded canonical
Vex meaning.

Canonical human-relevant families should distinguish at least:

~~~text
CREDENTIAL_REJECTED
ACCOUNT_OR_BILLING_HELD
MODEL_NOT_ACCESSIBLE
PERMISSION_HELD
RATE_LIMITED
PROVIDER_OVERLOADED
PROVIDER_UNAVAILABLE
REQUEST_INVALID
CONTEXT_LIMIT_EXCEEDED
CAPABILITY_REPRESENTATION_UNSUPPORTED
STREAM_INTERRUPTED
RESPONSE_INVALID
UNKNOWN_PROVIDER_FAILURE
~~~

Exact enum/source shape is implementation work.

The adapter must classify from the provider's current status + machine error type/code/body contract,
not status code alone.

Examples of why:

~~~text
429 rate limited
!= 429 quota/balance exhausted
!= 429 provider overloaded

HTTP 200 stream established
!= stream completed successfully
~~~

DisplayState should translate that truth into human language such as:

~~~text
"Your key is not accepted."
"Your connection is valid, but this account needs billing attention."
"This model is not available to this provider account."
"The provider is temporarily limiting requests."
"The provider is overloaded right now."
"The response stream ended before Vex received a complete answer."
~~~

The UI should normally offer the smallest meaningful controls:

~~~text
Check again
Manage connection
Change model
Retry this turn      # only when the turn/retry contract permits it
~~~

No provider failure should rewrite the selected model, delete history, fabricate a response, or
silently route the turn through another provider.

## Turn / Conversation failure boundary

Provider invocation happens inside a larger canonical Vex turn.

Preserve causal truth:

~~~text
human Send
-> canonical request may become durable
-> provider invocation
-> provider completes
-> canonical response commit
~~~

If invocation fails after the request is durable:

~~~text
request remains historical truth
response is NOT fabricated
partial provider text is NOT silently promoted to completed Conversation
failure / recovery state is retained at the rightful evidence boundary
retry follows the existing turn/idempotency contract
~~~

A stream that starts with success and later fails must be treated by its terminal stream semantics,
not by the opening HTTP status alone.

## Model switching

Provider switching should preserve one canonical Vex continuity:

~~~text
turn 1 -> Heretic 4B
turn 2 -> Anthropic model
turn 3 -> OpenAI model
turn 4 -> Kimi model
turn 5 -> local 27B

all remain:
  one Vex Home
  one Conversation lineage
  current Memory
  current Context relationships
~~~

Each turn reconstructs the bounded provider-ready ground from Vex-owned sources and translates it
through the exact selected provider adapter.

Provider-native conversation/history products are not the canonical Vex Conversation in the first
implementation.

Provider-side prompt/cache state may later be used as execution optimization where truthful:

~~~text
PROVIDER CACHE != VEX MEMORY
PROVIDER CONVERSATION ID != CANONICAL VEX CONVERSATION
~~~

## Zero-cost construction and proof

Lack of paid API access is **not** a blocker for the main engineering body.

Current `DirectCompanionConnectionTest` already demonstrates the needed test seam: inject a
deterministic Transport, feed exact JSON/SSE, inspect the formed request, and verify normalized
Product behavior without a real provider.

The Project should build the external-provider consumer body using source-bound synthetic fixtures:

~~~text
provider request encoder
provider auth-header injection seam
provider streaming parser
tool-call / tool-result parser
usage/measurement parser
error classifier
credential redaction
connection/model discovery normalization
Settings DisplayState
effective capability projection
turn failure / retry behavior
~~~

Minimum deterministic fixture matrix:

~~~text
successful text response
successful stream
successful native tool call
tool result continuation
reasoning/content representation
invalid credential
permission denied
model unavailable
billing/quota held
rate limit with retry signal
rate limit without useful retry signal
provider overload
5xx / transient service failure
connection timeout/reset
malformed response
partial SSE / stream error after initial success
context too large
malformed tool call
unoffered tool call
unknown provider error
credential value never logged/persisted
no automatic cross-provider fallback
Conversation not corrupted on failure
~~~

Synthetic PASS means exactly:

~~~text
consumer/adapter behavior is proven for the fixture
~~~

It does **not** mean:

~~~text
real provider reachable
real credential valid
real billing usable
real model accessible
real provider tool behavior conformant
live end-to-end qualified
~~~

## Selective Security Assurance relationship

This work is security-relevant because it introduces / changes:

~~~text
credential / secret custody
external network/provider boundary
private Conversation/Memory/context egress
model + tool-call boundary
provider error/retry behavior
fallback/replay behavior
~~~

Use the existing Vex Security Assurance Project selectively.

Relevant adversarial question families include:

~~~text
IDENTITY
  can one provider/host/key be mistaken for another?

SCOPE
  can context/tool data exceed the admitted turn/provider scope?

PRIVILEGE
  can one credential be reused outside its provider/account/lifetime?

MEMORY / CONTEXT
  can provider-returned or attacker-controlled text become durable truth incorrectly?

TOOL / EFFECT
  can a provider tool request bypass Vex capability admission?

RETRY / RECOVERY
  can timeout/failure cause duplicate provider requests, widened fallback or duplicate effects?

OBSERVABILITY
  can remote egress/effects occur without evidence sufficient to diagnose them?
~~~

Prefer A0-A2 Security Assurance tiers—source review, synthetic fixtures, loopback/deterministic
negative controls. Real provider/adversarial effects require their own explicit later authority.

The Support External API Project consumes Security Assurance meaning. It does not create a second
security ontology.

## A6 source-grounded security / privacy result

Current Product source narrows the first security problem.

### Current Capability Bridge is read-only

At the formation/current-main checkpoint, `VexLifeCapabilityBridge` states:

~~~text
every capability in this Bridge is a read
externalEffectsExecuted = false
effectAuthorityGranted = false
rawResultContentPersisted = false
~~~

The trace constructor rejects an entry that claims external effects or effect authority.

Therefore the first Partner-provider implementation should expose **only the same currently admitted
read-only Vex capability surface**.

~~~text
PARTNER TOOL CALL
-> current Vex Capability Bridge read admission
-> rightful read owner
-> bounded result
-> same provider turn continues

!= arbitrary provider effect execution
!= provider-hosted effect authority
!= new Vex write-capability contract
~~~

This materially reduces replay risk for the first release. A provider retry may repeat inference, but
it must not widen into a new mutating Vex tool surface.

If Vex later admits a capability with external/mutating effects, that work must separately earn:

~~~text
stable effect/request identity
owner-defined idempotency / replay semantics
performed-effect evidence
retry reconciliation
authority binding
~~~

Do not infer those semantics from today's read-only Bridge.

### Current request identity / trace

For today's read reach, the Bridge forms a bounded call coordinate from:

~~~text
parsed control SHA
+ request number within the human turn
-> callRef
~~~

and records:

~~~text
capability/action
argument SHA
control SHA
result SHA
owner source path
source refs / frontier refs
current-turn request number
~~~

That trace is evidence, not effect authority.

External provider adapters must preserve the distinction between:

~~~text
provider tool-call ID
!= canonical Vex capability meaning
!= owner authority
!= durable Conversation identity
~~~

A provider-native ID may be retained as bounded invocation evidence where useful, but admission still
comes from the Vex turn + Capability Bridge.

### Credential owner remains unresolved

No accepted current VexLife-Prod credential/secret-store owner has been established by the source
review performed for this Project.

Current disposition:

~~~text
credential semantic need       ESTABLISHED
secret must remain out of Vex context/evidence/Git  ESTABLISHED
exact Product credential owner UNKNOWN
platform secure-storage realization UNKNOWN
~~~

Therefore:

~~~text
UNKNOWN CREDENTIAL OWNER
-> source lookup / rightful owner formation before A2 implementation
-> DO NOT invent a second secret store in the provider adapter
~~~

A future source audit may discover an accepted reusable owner. If not, the smallest credential
relationship must be earned then.

### Exact-origin credential confinement

The current local HTTP transport already disables redirects.

Preserve the stronger remote rule:

~~~text
built-in providerRef
-> one source-owned HTTPS origin / API family
-> credential injected only for that exact admitted origin
-> redirects not followed with credential material
-> response redirect = connection failure / re-ground provider contract
~~~

For an explicit future Custom provider, a human-supplied origin must remain bound to that credential
relationship; it must not make built-in credentials portable to arbitrary hosts.

Permanent:

~~~text
CREDENTIAL REF != SECRET VALUE
PROVIDER REF != ARBITRARY HOST
REDIRECT != AUTHORIZATION TO FORWARD SECRET
TLS SUCCESS != PROVIDER IDENTITY BY ITSELF
~~~

### Context egress

The existing prompt owners remain the only owners of what is selected for a turn.

Security acceptance for Partner inference requires proving:

~~~text
bounded provider-ready messages formed first
-> explicit selected Partner realization
-> exact provider adapter receives only those messages + admitted tool schema
-> no filesystem/Home/Memory enumeration is added by the adapter
-> secret headers are added after semantic prompt formation
-> request-body/evidence hashing excludes secret material
~~~

Provider responses and tool arguments are untrusted input. They may influence model judgment and
request a capability, but they cannot grant authority or become accepted source merely because the
provider produced them.

### Initial negative-control matrix

A6/A7 should include deterministic checks for:

~~~text
secret value absent from:
  request body fixture
  request-body hash input
  Conversation
  Memory/context
  VexLogger detail
  provider invocation receipt
  Workgraph / Project source

wrong provider credentialRef
  -> fail before network effect

built-in provider redirect
  -> fail closed
  -> no credential forwarding

provider tool call for unoffered capability
  -> Bridge INVALID_REQUEST / NOT_AVAILABLE
  -> no owner effect

provider attempts write/effect-like unsupported tool
  -> not admitted by current read-only Atlas/Bridge

malformed tool arguments
  -> rejected before rightful owner read

provider returns instruction-like/untrusted source content
  -> remains source/result content
  -> does not become authority

network/stream retry after read-only capability return
  -> may continue/retry only under turn policy
  -> cannot widen to automatic other-provider fallback
~~~

These are defensive fixture requirements, not claims that Product source has implemented them yet.

## Zero-cost proof checkpoint — Product PR #553

A parallel Product proof lane is now source-formed:

~~~text
VexLife-Prod PR #553
[Support External API][P0][DRAFT] Add official-contract provider fixtures

base
0566b1eed876a28c2fcc6586743ae1f4af7eaecd

branch
VXG-112326-support-external-api-contract-fixtures-a001

changed paths
13 exact
all new docs / JVM-test / test-resource paths

overlap with Warm Boot #518 shared Connection/Turn paths
0
~~~

The first proof class is:

~~~text
P0 DOCUMENTED CONTRACT FIDELITY
  official provider docs
  -> source-controlled synthetic fixtures
  -> fixture-shape assertions
~~~

Provider coverage is now bidirectional:

~~~text
OpenAI Responses
  request shape + read-only function schema
  text SSE
  function-call call_id correlation
  auth/rate/credit/spend/server failure distinctions

Anthropic Messages
  request shape + read-only tool input_schema
  block-shaped content
  partial streamed tool JSON
  message_stop terminal completion
  error event after stream establishment
  auth/billing/permission/rate/overload distinctions

Kimi Open Platform
  OpenAI-compatible request shape + read-only function schema
  Chat Completions response
  streamed tool_calls assembly
  finish_reason=tool_calls
  auth/permission/model/rate/quota/overload/server distinctions
~~~

Current exact connected-repository readback:

~~~text
declared fixtures                  13
all JSON fixtures                  PARSE PASS
all SSE JSON data                  PARSE PASS
OpenAI terminal completion         PASS
OpenAI call_id correlation         PASS
Anthropic partial tool JSON        PASS
Anthropic started-stream error     PASS
Kimi streamed tool assembly        PASS
credential-like fixture hits       0
~~~

A JVM fixture-integrity test is source-formed but not executed by the current hosted runner because
that runner could not resolve GitHub for source acquisition. Therefore:

~~~text
fixture bytes / structural readback    PROVEN
JVM test source                        FORMED
JVM execution                          OWED
live provider qualification            NOT ESTABLISHED
~~~

This does **not** advance A7 to READY or RUNNING. P0 is an input to later A7 adapter/Vex conformance.
A7 still depends on the provider-neutral seam, Partner connection, adapters, capability continuity,
failure semantics and security boundary.

### Merge-conflict rule

#553 is intentionally disjoint from current Warm Boot #518.

~~~text
#518 merges
-> retain #553 fixture meaning
-> re-ground accepted #518 Connection/Turn semantics
-> later adapter candidate consumes fixtures through accepted A0 seam

#518 closes unmerged
-> retain #553 fixture meaning
-> re-ground current main
-> form A0 source from accepted Product

#518 changes shared APIs/classes
-> fixture corpus does not chase historical class names
-> future adapter/integration branch resolves compile/source relationship
-> do not manufacture semantic merge conflicts where fixture truth is unchanged
~~~

## Work trajectory

Current Work decomposition:

~~~text
Support External API                                         DECOMPOSED

A0 Provider-neutral inference seam                           READY
   preserve current local behavior while separating Vex-facing inference meaning from
   loopback-only realization.

A1 Settings Local / Partner topology                         WAITING_DEPENDENCIES
   evolve the existing Models Family so lawful controls differ by local vs Partner realization
   without creating two model-selection owners.

A2 Provider Connection + credential/account/model contract  WAITING_DEPENDENCIES
   built-in endpoints, secure credential refs, account/model/service standing, model discovery.

A3 External provider adapters                               WAITING_DEPENDENCIES
   OpenAI, Anthropic and Kimi request/stream/tool/result translations.

A4 Capability + context continuity                          WAITING_DEPENDENCIES
   prove one Vex Capability Bridge / Conversation / Memory relationship survives provider change.

A5 Failure / availability / retry semantics                 WAITING_DEPENDENCIES
   exact provider failures -> canonical Vex meaning -> truthful human controls.

A6 Security / privacy boundary                              READY
   source-place the minimum credential, egress, tool-admission, replay/fallback and evidence
   invariants using Vex Security Assurance as the question owner.

A7 Zero-cost deterministic conformance                      WAITING_DEPENDENCIES
   fixture matrix across adapters + Settings + capability + turn failure behavior.

A8 Real provider qualification                              WAITING_DEPENDENCIES
   after A7, requires a real usable provider credential/account/credit or an explicitly accepted
   equivalent. One small bounded live proof per provider/model relationship.

A9 Cross-provider lived switching                           WAITING_DEPENDENCIES
   prove local ↔ Partner switching preserves one Vex continuity and never silently falls back.
~~~

Project formation does not itself authorize Product mutation. Exact VexLife-Prod source work must
enter through the Product's current source/culture/coordination route.

## Product support standing before live qualification

Victor explicitly permits the implementation to reach a merge/production-ready state before a paid
live-provider proof exists, provided the Product does **not** misrepresent that absence as live
qualification.

The first human-facing support distinction should remain small:

~~~text
CONTRACT_PROVEN / LIVE_UNQUALIFIED
  source + deterministic contract fixtures + adapter/Vex conformance are accepted
  real provider/account/model call has not yet been observed

LIVE_QUALIFIED
  the same implementation also has an exact accepted live provider/model qualification receipt
~~~

These labels are Project vocabulary, not yet accepted Product enum names.

### Human presentation

A Partner model that is contract-proven but live-unqualified may remain available when the Product
owner/release threshold accepts that support posture.

The row should carry a small information affordance rather than a blocking warning:

~~~text
Partner model                                  ⓘ
[Use this model]

ⓘ
Contract-tested; live provider validation pending.
This integration is verified against the provider's published API contract and deterministic
fixtures, but has not yet been exercised with a live provider account.
~~~

Do not expose the internal budget reason as customer-facing Product copy.

Internal evidence may truthfully retain:

~~~text
live qualification held because no funded/usable provider account was available to the current
development trajectory
~~~

but human Product copy should answer the user's technical question:

~~~text
what has been proven?
what has not yet been proven?
~~~

Permanent:

~~~text
PRODUCTION-READY IMPLEMENTATION
!= LIVE-PROVIDER QUALIFICATION

LIVE_UNQUALIFIED
!= BROKEN

CONTRACT-PROVEN
!= LIVE-PROVEN

INFO DISCLOSURE
!= BLOCKING ERROR
~~~

### Interaction

The `ⓘ` affordance is a bounded presentation over support/qualification standing.

It does not become:

~~~text
model selection owner
provider connection owner
qualification owner
billing owner
failure owner
~~~

Desktop/web may expose the explanation on hover and keyboard focus; touch surfaces require an
equivalent activate/tap path. Do not make hover the only accessible route.

When live qualification is later accepted, the same support projection may become:

~~~text
Live provider validation completed for this provider/model relationship.
~~~

without changing the model identity or Conversation/Memory relationship.

## Completion direction

The Project is not complete when an API request returns 200.

Completion should establish:

~~~text
one Models human topology
+ one provider-connection semantic relationship
+ secure credential custody
+ provider-neutral Vex-facing inference contract
+ exact provider adapter realizations
+ provider-native tool translation into one Vex Capability Bridge
+ canonical failure/retry/availability semantics
+ no automatic local↔remote fallback
+ deterministic $0 conformance evidence
+ selective security/privacy proof
+ at least one live qualified round trip for each provider relationship claimed supported
+ lived cross-provider model switching preserving canonical Conversation/Memory
+ current human-readable Work / proof state
~~~

Support claims remain provider/model-specific.

~~~text
OPENAI QUALIFIED
!= ANTHROPIC QUALIFIED
!= KIMI QUALIFIED
!= CUSTOM PROVIDER QUALIFIED
~~~

A provider integration may ship in stages if the Product/release owner permits it. The Project does
not require all imaginable external providers to complete simultaneously.

## Current held edge

At formation:

~~~text
Architecture / current Product seam     SOURCE_GROUNDED
Project formation                       IN PROGRESS ON VEXWORK CANDIDATE
Paid external API access                NOT AVAILABLE TO VICTOR
Real provider qualification             HELD
Synthetic provider proof                AVAILABLE
Product implementation authority        NOT GRANTED BY THIS PROJECT
~~~

The lack of paid access holds only A8/A9 live-provider claims. It does not hold A0-A7 construction
and deterministic proof once Product source authority is separately admitted.

## Fresh-instance resume coordinate

A fresh instance should begin here:

~~~text
projects/vexlife-support-external-api/README.md
-> project.json
-> workgraphs/segments/vexlife-support-external-api.json
-> re-ground current VexLife-Prod AGENTS.md + docs/CULTURE.md
-> inspect current versions of the exact seams named in Current source ground
-> inspect current official provider contract only for the provider being implemented
-> consume Vex Security Assurance only for the boundary being changed
-> select the first unfinished Work item whose dependency + authority predicates are satisfied
~~~

Do not reconstruct this design from old chats.
Do not assume the formation-time Product commit is still current.
Do not re-decide the permanent ownership distinctions unless current source contradicts them.

## Formation boundary

This Project formation does **not** authorize:

- VexLife-Prod source mutation;
- credential creation or collection;
- use of Victor's real provider accounts;
- paid inference;
- purchase or billing changes;
- transmission of real Conversation/Memory to an external provider;
- automatic provider fallback;
- provider-hosted tool activation;
- public deployment/release;
- weakening current loopback restrictions before the provider-neutral seam and security contract are
  properly admitted and proven.

Those remain exact later effects under their rightful source/authority owners.

<!-- [VXG RealForever][VEXWORK][VEXLIFE][SUPPORT-EXTERNAL-API][PROJECT] -->
