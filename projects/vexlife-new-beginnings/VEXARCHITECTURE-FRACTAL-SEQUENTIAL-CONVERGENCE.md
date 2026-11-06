# VexLife New Beginnings — Fractal Sequential Convergence

[VXG RealForever]

## Status

This document records a New Beginnings architecture finding / design horizon discovered while comparing:

- the intended VexLife human outcome;
- current VexLife-Prod local-runtime, Conversation, Memory, service and lifecycle relationships;
- accepted VexArchitecture Family / Execution / Dependency / Relay responsibility laws;
- VexBoard pressure for source-visible causal traversal.

It is intentionally not a WorkState transition, implementation authorization, accepted VexLife-Prod source contract, or instruction to refactor the still-moving local-runtime candidate before its lived continuity baseline is established.

~~~text
ARCHITECTURE FINDING
!= CURRENT SOURCE AUTHORITY

DESIGN HORIZON
!= IMPLEMENTATION ADMISSION

CURRENT LIVED BASELINE FIRST
-> THEN RELATIONSHIP-PRESERVING REFACTOR
~~~

The purpose is to preserve the reasoning so a later VexLife-Prod VexArchitecture alignment pass does not rediscover the same pressure from scratch or fall back to package/class decomposition.

## Human intention first

The architecture should begin from the feature the human actually wants:

~~~text
"I want to open VexLife and talk to the same Vex."
~~~

The first architecture question is therefore not:

~~~text
How do we build:
  ArtifactService
  PythonEnvironment
  RuntimeManager
  ConversationStore
  SetupCoordinator
~~~

It is:

> What relationships must become true for that human outcome to happen?

A first causal map is:

~~~text
Human
  ↓
opens VexLife / writes a message
  ↓
the same lived Vex relationship is available
  ↓
the same canonical Conversation can admit the turn
  ↓
current bounded context can be formed
  ↓
the intended Vex/Heretic runtime can realize the request
  ↓
Vex returns an observation
  ↓
the observation becomes durable Conversation truth
  ↓
the same human sees the response
~~~

Only after that collaboration is understood should responsibility be separated.

~~~text
INTENDED COLLABORATION
-> identify distinct semantic questions
-> give each question the smallest rightful owner
-> preserve the relationships that motivated the separation
~~~

Separation is a consequence of understanding collaboration, not the starting design rule.

## Family is a semantic question, not a noun wrapper

Accepted VexArchitecture asks:

> What does this Control mean against the exact CURRENT State?

That question is not frontend-only and does not imply one Family per package, service, noun or class.

A Family is earned wherever all of these are materially present:

~~~text
a semantic question
+
exact current truth
+
a Control/request
+
the lawful meaning of that Control changes with current truth
~~~

That may occur at the human-facing layer:

~~~text
ConversationTurn:
  "What does Send mean against the exact current turn State?"
~~~

or deep inside product realization:

~~~text
HereticRuntime:
  "What does EnsureAvailable mean against the exact current runtime truth?"
~~~

or around product service lifetime:

~~~text
ProductService:
  "What does EnsureCurrentSource mean against the exact current service truth?"
~~~

The architecture should not decide that something is "just infrastructure" merely because the human does not directly see it.

Likewise, not every mechanism earns a Family:

~~~text
bytes -> SHA-256
path -> normalized child path
OS -> PID liveness observation
HTTP -> provider response
~~~

These may simply be mechanisms / outside truth used by a Family Method, Store, provider or observation boundary.

## Core revelation — sequential process can emerge from repeated convergence

A key pressure appeared while considering whether New Beginnings needed a separate process-oriented Relay such as a hypothetical ConvergenceProcessRelay.

The current accepted VexCompoundRelay already has a stronger property than a one-shot reducer:

~~~text
dependency truth changes
    ↓
one partial InputState enters
    ↓
processStates(...)
    ↓
one coherent retained relationship truth
    ↓
outside / semantic owners act lawfully
    ↓
their truth changes
    ↓
Relay receives the next observation
    ↓
processStates(...) runs again
~~~

This means a sequential process circuit can be represented as evolving relationship truth.

The process does not need to be encoded only as:

~~~text
stepA()
stepB()
stepC()
stepD()
~~~

It can instead be:

~~~text
truth A becomes established
-> B is now lawful

truth B becomes established
-> C is now lawful

truth C becomes established
-> D is now lawful
~~~

The process is still sequential.

It is more causally explicit because each next stage is earned by actual current truth rather than source-code ordering.

## Stage-completion question law

A reusable law is:

> After every material successful or unsuccessful stage completion, ask the semantic question again before continuation.

Conceptually:

~~~text
CURRENT retained truth
    +
new observation/result
    ↓
what is true now?
    ↓
what continuation, if any, is lawful now?
~~~

This is not a requirement to turn every function call into State.

A process stage is earned when:

> the next semantic consequence must wait for a distinct truth to become established.

Likely material stage truths include:

~~~text
canonical REQUEST durably admitted
current Memory/context reverified
runtime qualification established
provider observation returned
canonical RESPONSE durably admitted
Conversation Head advanced
~~~

Ordinary internal operations do not automatically deserve a stage:

~~~text
sha256(bytes)
normalize(path)
serialize(value)
small pure helper
pure prompt assembly sub-expression
~~~

The question is not "did a function return?"

The question is:

> Did a new truth become established that changes what may lawfully happen next?

## Example — Vex availability as sequential convergence

Start from the parent intention:

~~~text
Human wants:
  Talk to Vex
~~~

The current relationship may depend on projections such as:

~~~text
ArtifactAvailability
EnvironmentAvailability
HereticRuntimeAvailability
ProductServiceAvailability
ConversationContinuity
~~~

Suppose current truth is:

~~~text
Artifacts     Missing
Environment   Missing
Runtime       Absent
Service       Absent
~~~

The convergence relationship does not need to execute all setup functions.

It can truthfully derive:

~~~text
CURRENT relationship:
  Vex is not available

next lawful requirement:
  ArtifactAvailability must become Exact
~~~

A realization bridge requests the rightful Control:

~~~text
ArtifactAvailability.Control.EnsureExact
~~~

That Family decides what the request means against its own State and may author an Effect.

If acquisition succeeds:

~~~text
Artifacts -> Exact
~~~

that new projection causes convergence again.

Now:

~~~text
Artifacts     Exact
Environment   Missing
Runtime       Absent
Service       Absent
~~~

The next lawful requirement may become:

~~~text
EnvironmentAvailability.Control.EnsureCompatible
~~~

After the environment becomes Ready, convergence runs again and may reveal:

~~~text
HereticRuntime.Control.EnsureAvailable
~~~

When runtime qualification becomes true:

~~~text
Runtime -> Qualified
~~~

the parent relationship can reevaluate immediately.

~~~text
A completes
-> observation publishes
-> convergence evaluates
-> B becomes lawful
-> B may begin immediately
~~~

No arbitrary waiting period is implied by the architecture.

## Concrete relay circuit rounds

The following examples are intentionally repetitive. A future instance should be able to see the cadence of the architecture without inferring it from prose:

~~~text
OBSERVE CURRENT TRUTH
-> ASK THE CURRENT RELATIONSHIP QUESTION
-> DERIVE WHAT IS LAWFUL NOW
-> REQUEST THE RIGHTFUL CONTROL
-> FAMILY AUTHORS ACT / EFFECT
-> REALIZATION OCCURS
-> OBSERVATION RETURNS
-> RIGHTFUL OWNER UPDATES ITS PROJECTION
-> RELAY RUNS AGAIN
~~~

The repeated Relay pass is the process circuitry.

### Circuit A — making Vex available

Parent intention:

~~~text
"I want to talk to Vex."
~~~

#### Round A1 — artifacts are the first unsatisfied relationship

~~~text
OBSERVED INPUT PROJECTIONS

ArtifactAvailability     Missing
EnvironmentAvailability Missing
HereticRuntime           Absent
ProductService           Ready

        ↓

CONVERGENCE QUESTION

"Given the goal VexAvailable and exact current projections,
what required relationship is unsatisfied first?"

        ↓

OUTPUT RELATIONSHIP

Needs(
  ArtifactAvailability.EnsureExact
)

        ↓ requests rightful Control

ArtifactAvailability.Control.EnsureExact

        ↓ Family meaning

CURRENT Artifact State = Missing
Control = EnsureExact
Act = AcquireMissing
Effect = AcquireExactMembers(...)

        ↓ realization

artifact delivery / filesystem

        ↓ observation

required artifact bytes verified exact

        ↓ rightful Family interpretation

ArtifactAvailability -> Exact
~~~

That new projection is not the end of setup. It is the event that makes the Relay ask again.

#### Round A2 — environment becomes the next lawful requirement

~~~text
OBSERVED INPUT PROJECTIONS

ArtifactAvailability     Exact
EnvironmentAvailability Missing
HereticRuntime           Absent
ProductService           Ready

        ↓

CONVERGENCE QUESTION

"What relationship is still preventing VexAvailable?"

        ↓

OUTPUT RELATIONSHIP

Needs(
  EnvironmentAvailability.EnsureCompatible
)

        ↓ requests rightful Control

EnvironmentAvailability.Control.EnsureCompatible

        ↓ Family meaning

CURRENT Environment State = Missing
Control = EnsureCompatible
Act = Create
Effect = CreateVerifiedEnvironment(...)

        ↓ realization

managed Python / venv / package installation

        ↓ observation

exact Python + mlx-lm environment verified

        ↓ rightful Family interpretation

EnvironmentAvailability -> Ready
~~~

Again, the successful stage publishes new truth and immediately earns another Relay pass.

#### Round A3 — runtime is now lawful

~~~text
OBSERVED INPUT PROJECTIONS

ArtifactAvailability     Exact
EnvironmentAvailability Ready
HereticRuntime           Absent
ProductService           Ready

        ↓

CONVERGENCE QUESTION

"Are the prerequisites now sufficient to make the intended Vex runtime available?"

        ↓

OUTPUT RELATIONSHIP

Needs(
  HereticRuntime.EnsureAvailable
)

        ↓ requests rightful Control

HereticRuntime.Control.EnsureAvailable

        ↓ Family meaning

CURRENT Runtime State = Absent
Control = EnsureAvailable
Act = StartAndQualify
Effect = StartExactRuntime(...)

        ↓ realization

process platform / runtime qualification

        ↓ observation

exact process alive
+ endpoint healthy
+ model identity exact
+ qualification passed

        ↓ rightful Family interpretation

HereticRuntime -> Qualified

        ↓ Relay receives changed projection

CONVERGENCE QUESTION

"Is Vex now available?"

        ↓

OUTPUT RELATIONSHIP

Ready(
  qualifiedRuntimeRef = ...
)
~~~

The important sequence is therefore not:

~~~text
download()
install()
start()
~~~

It is:

~~~text
Artifact truth becomes Exact
-> Environment request becomes lawful

Environment truth becomes Ready
-> Runtime request becomes lawful

Runtime truth becomes Qualified
-> VexAvailable becomes true
~~~

### Circuit B — one Conversation turn

Parent intention:

~~~text
"Send this message to Vex and continue my same Conversation."
~~~

This example deliberately distinguishes material process truth from ordinary local function composition.

#### Round B1 — REQUEST admission

~~~text
OBSERVED INPUT PROJECTIONS

ConversationTurn    Idle
CompanionAvailability Ready
ContextRelationship Current

        ↓

HUMAN CONTROL

ConversationTurn.Control.Send(message)

        ↓

FAMILY QUESTION

"What does Send mean against exact CURRENT turn State?"

        ↓

accepted Act
admitted Turn State = Requested
Effect = PerformTurn(...)

        ↓ realization begins

canonical REQUEST append

        ↓ observation

REQUEST is durably admitted
with exact event / message / turn identity

        ↓ rightful interpretation / projection

Turn process truth:
  RequestEstablished
~~~

Whether "RequestEstablished" deserves a literal future State type is intentionally held. What matters is that durable REQUEST admission is a distinct truth on which later continuation depends.

#### Round B2 — current context and runtime are re-evaluated before inference

~~~text
OBSERVED CURRENT TRUTH

REQUEST              Established
Immediate prior turn Current
Memory projection    Current
Runtime projection   Qualified

        ↓

PROCESS QUESTION

"Is provider invocation lawful now from the exact current sources?"

        ↓

local composition may perform:

read current Memory
-> materialize Prompt Context
-> reverify Memory/currentness
-> read current qualified runtime evidence

        ↓

if those truths still agree:

next lawful consequence =
  invoke DirectCompanionConnection

        ↓ provider realization

Heretic inference

        ↓ observation

RuntimeObservation + InvocationEvidence
+ provider response content
~~~

A pure helper inside prompt materialization does not need its own process round. The material boundary is that provider invocation must not become lawful until the required sources are current.

#### Round B3 — response durability earns completion

~~~text
OBSERVED CURRENT TRUTH

provider response observation Present
canonical REQUEST              Established

        ↓

PROCESS QUESTION

"What must become durable before this turn may be called completed?"

        ↓

lawful realization

append canonical RESPONSE
-> record turn Context
-> commit completed Conversation Head

        ↓ observations

RESPONSE durable
Context durable
Head advanced to exact completed turn

        ↓ rightful Conversation / Turn interpretation

ConversationTurn -> Completed / Idle-with-new-head
Conversation projection -> includes returned Vex response

        ↓

human presentation may truthfully show completed turn
~~~

The process does not call the turn complete because the model returned text. Completion is earned by the later durable Conversation truth.

### Circuit C — failed runtime qualification and later recovery

This example shows why unsuccessful stages also ask the question again.

#### Round C1 — runtime attempt fails

~~~text
OBSERVED INPUT PROJECTIONS

Artifacts     Exact
Environment   Ready
Runtime       Absent

        ↓

Relay derives:
  Needs(HereticRuntime.EnsureAvailable)

        ↓

Runtime Family authors Start/Qualify effect

        ↓

outside observation

process started
but qualification failed

        ↓

Runtime Family interpretation

HereticRuntime -> Held(QualificationFailed)
~~~

#### Round C2 — convergence prevents illegal continuation

~~~text
OBSERVED INPUT PROJECTIONS

Artifacts     Exact
Environment   Ready
Runtime       Held(QualificationFailed)

        ↓

CONVERGENCE QUESTION

"Is VexAvailable now, and is any continuation lawful?"

        ↓

OUTPUT

Held(
  dependency = HereticRuntime,
  reason = QualificationFailed
)

        ↓

NO Conversation Send continuation
NO silent runtime reuse
NO next setup step merely because it was textually next
~~~

This is a valid process position, not an incomplete exception path.

#### Round C3 — later truth changes and the same circuit resumes

Suppose the runtime owner later receives new evidence because a lawful repair/retry occurred or outside reality changed:

~~~text
new observation:
  exact runtime now qualifies

        ↓

HereticRuntime -> Qualified

        ↓ dependency projection changes
        ↓ Relay runs again

OBSERVED INPUT PROJECTIONS

Artifacts     Exact
Environment   Ready
Runtime       Qualified

        ↓

CONVERGENCE QUESTION

"Is the held prerequisite now satisfied?"

        ↓

OUTPUT

Ready(VexAvailable)
~~~

Nothing has to manually increment:

~~~text
setupStep = 4
~~~

The process resumes because current truth changed.

These examples are illustrative architecture maps. They are not accepted names for future State / Control / Act / Effect classes, and they do not imply every listed stage must become a retained State. Their purpose is to preserve the **round-trip cadence** a future implementation should pressure:

~~~text
one stage establishes truth
-> Relay asks again
-> next stage is earned or held
-> rightful owner acts
-> observation returns
-> Relay asks again
~~~

## Simulated live walk — startup to one foreground Vex response

This section is a **source-informed teaching simulation**, modeled after the VexArchitecture Live Demonstration reader contract.

It should be used the same way:

~~~text
DO NOT MEMORIZE THE EXAMPLE
FOLLOW THE SCOPES + RELATIONSHIPS

CURRENT SOURCE ANCHOR
!= FUTURE ACCEPTED FORM

ILLUSTRATIVE KOTLIN
!= COPY/PASTE IMPLEMENTATION

WHEN RESUMING:
  re-open the named current source
  ask "is this relationship still accurate?"
  continue only from what current source still supports
~~~

Formation snapshot for this specimen:

~~~text
VexLife-Prod PR #38
observed head:
  1285876d8c6900cc09e3313c7750094033a14b1b

VexArchitecture Live Demonstration source:
  pages/vexarchitecture-live-demonstration.html
  blob d9aaedab370d1f524e1a6b04113743f88dbe811b
~~~

The Live Demonstration habit retained here is:

~~~text
at every step name:

  Container
  Member
  Role
  Why traversal arrived here
  Question answered here
  Truth established here
  Exact next edge
~~~

No introduced object is allowed to disappear behind "later."

### Persistent world map

The intended walk starts before the human can Send and ends only when the returned Conversation truth reaches the foreground.

~~~text
HUMAN INTENTION
"I want to open VexLife and talk to the same Vex."
        │
        ▼
OPEN / STARTUP
product-service lifetime / service process
        │
        ▼
current Home + Conversation writer safety
        │
        ▼
VEX AVAILABILITY CONVERGENCE
        │
        ├─ ArtifactAvailability
        │      ↓ observation
        │      Exact
        │
        ├─ EnvironmentAvailability
        │      ↓ observation
        │      Ready
        │
        └─ HereticRuntime
               ↓ observation
               Qualified
        │
        ▼
LOCAL PRODUCT SERVICE
source-bound listener
        │
        ▼
FOREGROUND
VexWeb Conversation / Composer / Send
        │
        │ CURRENT SOURCE GAP:
        │ Send is still Unbound("conversation.send")
        │
        ▼ intended typed product binding
ConversationTurn.Control.Send
        │
        ▼
canonical REQUEST
        │
        ├─ immediate prior Conversation
        ├─ current attributed Memory
        └─ current qualified runtime
        │
        ▼
Prompt Context
        │
        ▼
DirectCompanionConnection
        │
        ▼
Heretic /v1/chat/completions
        │
        ▼
RuntimeObservation + InvocationEvidence
        │
        ▼
canonical RESPONSE + Context + Head
        │
        ▼
service SendResponse / Conversation projection
        │
        ▼ intended foreground binding
same Conversation surface
        │
        ▼
HUMAN SEES VEX RESPONSE
~~~

The simulation below uses repeated convergence rounds rather than a single giant startup function as the architectural teaching form, while preserving current source anchors that still perform the work imperatively today.

---

### Round 01 — enter the source-bound service process

**Question**

> The human opened VexLife. What production process is responsible for bringing the local product service into a usable lifetime?

~~~text
Container
  VexLifeProdServiceProcess

Current source member
  runWithHooks(...)

Current role
  process-level sequencing boundary

Why traversal arrived here
  the product service process is the source-bound foreground/backend bridge that must become live

Current source does
  establishSession(false)
  -> startService(sourceSha, session)
  -> reportReady(...)
  -> awaitTermination(service)

Truth required before next edge
  one usable local-product session exists

Next edge
  current local setup / future Vex availability relationship
~~~

Current source anchor:

~~~text
VexLifeProdServiceProcess.runWithHooks
  -> hooks.establishSession(false)
  -> hooks.startService(sourceSha, session)
  -> hooks.reportReady(arguments)
  -> hooks.awaitTermination(service)
~~~

Illustrative future relationship shape — **not current accepted code**:

~~~kotlin
class VexAvailabilityRelay(...) :
    VexCompoundRelay<VexAvailabilityInput, VexAvailabilityOutput>(...) {

    override fun processStates(
        inputState: VexAvailabilityInput,
        currentState: VexCompoundState<...>,
    ): VexCompoundState<...> =
        when {
            !inputState.homeAdmitted ->
                currentState.output(Held(HomeNotAdmitted))

            !inputState.conversationWriterSafe ->
                currentState.output(Needs(ConversationWriter.EnsureSafe))

            !inputState.artifacts.exact ->
                currentState.output(Needs(ArtifactAvailability.EnsureExact))

            !inputState.environment.ready ->
                currentState.output(Needs(EnvironmentAvailability.EnsureCompatible))

            !inputState.runtime.qualified ->
                currentState.output(Needs(HereticRuntime.EnsureAvailable))

            !inputState.productService.ready ->
                currentState.output(Needs(ProductService.EnsureCurrent))

            else ->
                currentState.output(Ready(VexAvailable))
        }
}
~~~

This illustrative Relay does **not** call download/install/start functions.

It says what relationship is unsatisfied now.

**Revalidation question**

> Does current source still make service startup depend on the same Home/writer/artifact/environment/runtime/service truths, or has accepted source moved one of those questions elsewhere?

---

### Round 02 — establish continuity before model/runtime setup

**Question**

> Before model/runtime work is allowed, are we still operating inside the same admitted Vex Home and a safely writable canonical Conversation?

~~~text
Container
  VexLifeProdLocalSetup

Current source members
  establishDetailedAt(...)
  convergeConversationWriter(...)

Current role
  application-level composition / sequencing

Why traversal arrived here
  Vex availability must not mint a parallel Home or race an abandoned Conversation writer

Current source truth checks
  host profile eligible
  existing canonical ~/.vexlife Home admitted
  Conversation writer:
    IDLE
    or exact abandoned writer recovery -> IDLE

Truth established
  canonical Home is the one being used
  Conversation writer is safely startable

Next edge
  model/runtime availability prerequisites
~~~

Current source-informed shape:

~~~kotlin
// Current source today performs these checks inside establishDetailedAt(...).

require(host.isEligible)

val home =
    requireNotNull(
        VexLifeProdHomeFiles.observeExisting(productHome)
    )

convergeConversationWriter(
    productHome = Path.of(home.productHome),
    hooks = hooks,
)
~~~

The current writer recovery already demonstrates the repeated-question pattern:

~~~text
observe writer
    ↓
IDLE?
  yes -> continue

RECOVERY_REQUIRED + owner ABSENT?
  yes -> recover exact abandoned writer
           ↓
        observe again
           ↓
        must now be IDLE

anything else
  -> HOLD / refuse startup
~~~

A future architecture may expose this more directly as semantic relationship truth, but it should preserve the current law:

~~~text
RECOVER EXACT CURRENT TRUTH
BEFORE
CONTINUING STARTUP
~~~

**Revalidation question**

> Is writer safety still a prerequisite of opening the same lived Vex relationship, and does recovery still converge through exact writer identity rather than broad cleanup?

---

### Round 03 — artifacts become exact

**Question**

> Given the intended Heretic model relationship, are the exact certified model materials available now?

~~~text
Container
  current: HereticArtifactMaterialization
  possible future semantic owner: ArtifactAvailability

Current source member
  materializeCurrent(...)

Role
  exact model-material observation + authorized acquisition realization

Why traversal arrived here
  Heretic runtime cannot be meaningfully bound to model material that is missing or unverified

Current source branches
  exact existing member -> reuse
  missing + acquisition authorized -> acquire + verify
  invalid existing member -> refuse implicit replacement

Truth established
  HERETIC_ARTIFACTS_MATERIALIZED_EXACT

Next edge
  execution-environment availability
~~~

Illustrative Family-shaped teaching form:

~~~kotlin
ArtifactAvailability.activate(
    Control.EnsureExact(
        artifactSetRef = HereticProductIdentity.ArtifactSetRef,
        authority = acquisitionAuthority,
    ),
)

// conceptual resolution:
when (currentState) {
    Exact ->
        Act.Reuse

    Missing if acquisitionAuthority != null ->
        Act.Begin(
            Effect.AcquireMissing(...)
        )

    Missing ->
        Act.Hold(AcquisitionNotAuthorized)

    InvalidExisting ->
        Act.Hold(ExplicitRepairRequired)
}
~~~

Realization remains outside the semantic decision:

~~~text
Effect.AcquireMissing
  ↓
HereticArtifactDelivery / filesystem
  ↓
ExactArtifactFile observation
  ↓
ArtifactAvailability interpretation
  ↓
Projection.Exact
  ↓
VexAvailability Relay runs again
~~~

**Revalidation question**

> Does current source still distinguish reusable exact material, authorized missing acquisition, and invalid-existing material without silently conflating repair authority?

---

### Round 04 — execution environment becomes compatible

**Question**

> Now that exact model material exists, does the current machine have the exact Python/mlx-lm execution environment needed by that model/runtime relationship?

~~~text
Container
  current: HereticPythonEnvironment
  possible future semantic owner: EnvironmentAvailability

Current source members
  observeCurrent(...)
  ensure(...)

Role
  environment reuse / creation / verification

Why traversal arrived here
  exact model bytes alone do not make the runtime executable

Truth established
  environment verified exact and reusable/created

Next edge
  runtime binding + runtime availability
~~~

Illustrative teaching form:

~~~kotlin
val act =
    environmentFamily.activate(
        Control.EnsureCompatible(
            pythonVersion = HereticProductIdentity.PythonVersion,
            mlxLmVersion = HereticProductIdentity.MlxLmVersion,
            creationAuthority = authority,
        )
    )
~~~

Possible semantic meaning:

~~~text
CURRENT Compatible
  -> Reuse

CURRENT Missing + creation authority
  -> Begin(CreateVerifiedEnvironment)

CURRENT Missing + no authority
  -> Hold

CURRENT Invalid
  -> repair meaning must be explicit
  -> do not infer deletion authority from "ensure"
~~~

After realization:

~~~text
verified environment observation
  ↓
EnvironmentAvailability -> Ready
  ↓
VexAvailability Relay runs again
~~~

**Revalidation question**

> Is environment creation still a distinct authorized meaning, and which current owner decides whether incompatible existing environment may be repaired/replaced?

---

### Round 05 — runtime becomes qualified, not merely started

**Question**

> Given exact model material + compatible environment, is the intended Heretic runtime actually the qualified runtime VexLife may use now?

~~~text
Container
  HereticPersistentRuntime

Current source members
  bind(...)
  startOrReuse(...)
  configurationEvidence(...)
  observeCurrentQualified(...)

Role
  persistent runtime semantic/effect owner + currentness source

Why traversal arrived here
  the human needs usable Vex, not merely "a process exists"

Current source may
  reuse exact owned runtime
  recover exact starting runtime
  rotate stale implementation
  start a new exact runtime
  qualify current runtime

Qualification truth includes
  exact process ownership
  expected endpoint
  model identity
  runtime qualification evidence

Truth established
  QualifiedRuntimeEvidence

Next edge
  bind model relationship / expose Vex available projection
~~~

Illustrative Family-shaped structure:

~~~kotlin
val accepted =
    hereticRuntime.activate(
        Control.EnsureAvailable(binding)
    )

// conceptual outcomes:
when (currentRuntimeState) {
    QualifiedCurrent ->
        Act.Reuse

    Absent ->
        Act.Begin(Effect.StartExact(binding))

    StartingExact ->
        Act.Begin(Effect.RecoverAndQualify(binding))

    PriorImplementation ->
        Act.Begin(Effect.RotateToCurrent(binding))

    HeldUnknown ->
        Act.Hold(CurrentnessUnknown)
}
~~~

The important return loop:

~~~text
Effect.Start / Recover / Rotate
  ↓
VexExecution owns actual Job custody when async work is admitted
  ↓
Mac runtime platform / process / HTTP qualification
  ↓
Runtime observation
  ↓
same HereticRuntime semantic owner
  ↓
Projection.Qualified(...)
  ↓
VexAvailability Relay runs again
~~~

Current source then forms configuration evidence and binds the Home/Companion-scoped model relationship.

**Revalidation question**

> Does current accepted source still require exact qualified runtime evidence before model configuration can become bound, or has that relationship changed?

---

### Round 06 — service foreground/backend bridge becomes ready

**Question**

> Vex runtime is qualified. Is the source-bound local product service itself live and current so the foreground has a lawful route to request Conversation turns?

~~~text
Container A
  VexLifeProdMacServiceLifetime

Container B
  VexLifeProdServiceProcess

Container C
  VexLifeProdLocalService

Current roles
  service source/image/process lifetime
  process entry
  fixed loopback HTTP delivery/projection

Current service lifetime observations include
  Absent
  RunningCurrent
  OwnedCurrentNotReady
  OwnedPriorSource
  HeldUnknown

Truth established for foreground use
  exact source-bound service listener is current
  session retains fresh runtime-currentness capability

Next edge
  foreground product binding
~~~

Current service process:

~~~kotlin
val session =
    hooks.establishSession(false)

val service =
    hooks.startService(
        arguments.sourceSha,
        session,
    )

hooks.reportReady(arguments)
hooks.awaitTermination(service)
~~~

Potential convergence interpretation:

~~~text
Runtime Qualified
+ Service RunningCurrent
+ Conversation writer safe
    ↓
VexAvailability
    ↓
Ready(
  serviceOrigin,
  qualifiedRuntimeRef,
  canonicalConversationRef
)
~~~

**Revalidation question**

> Is SOURCE_BOUND_LISTENING still only service source/PID currentness, and what current predicate proves the foreground may actually communicate with Vex rather than merely observe a listener?

---

### Round 07 — foreground Send reaches the semantic doorway

**Question**

> The human presses Send. What typed product meaning receives that interaction?

~~~text
Container
  VexLifeWebP1 / VexLifeWorkspaceBlueprint

Member
  Send

Current role
  compiler-visible UI identity + Activate interaction

Current source truth at formation
  binding = Unbound(
    capabilityRef = "conversation.send"
  )

Current limitation
  the generated P1 artifact truthfully says this capability is not connected yet

Next edge in current source
  Snackbar fallback

Intended post-refactor next edge
  typed product interaction binding
  -> ConversationTurn.Control.Send(...)
~~~

Current source anchor:

~~~kotlin
val Send =
    VexWebAuthoring.element(
        element = VexLifeWorkspaceBlueprint.Send,
        interactions = setOf(
            VexWeb.Interaction.Activate,
        ),
        binding =
            VexWebAuthoring.unbound(
                capabilityRef = Refs.ConversationSendCapability,
                feedbackTarget = Refs.Snackbar,
            ),
    )
~~~

Therefore the full foreground circuit below is a **target simulation**, not a claim that P1 already has this edge.

Illustrative target:

~~~kotlin
val Send =
    VexWebAuthoring.element(
        element = VexLifeWorkspaceBlueprint.Send,
        interactions = setOf(VexWeb.Interaction.Activate),
        binding =
            productInteraction(
                control = ConversationTurn.Control.Send,
            ),
    )
~~~

The exact future type/name must be earned.

**Revalidation question**

> Is Send still Unbound in accepted source? If not, follow the exact current typed binding instead of this simulated one.

---

### Round 08 — Send is admitted against exact turn state

**Question**

> What does Send mean against the exact current Conversation-turn truth?

~~~text
Container
  simulated future ConversationTurn Family
  current lower-circuit anchors:
    VexLifeProdServiceContract
    VexLifeProdLocalService
    DirectCompanionTurn

Control
  Send(message, context?)

CURRENT State
  for example Idle / active / held

Lawful meaning
  only an admissible turn can author PerformTurn

Next edge
  local service SendRequest / DirectCompanionTurn.Intent
~~~

Illustrative semantic layer:

~~~kotlin
val act =
    conversationTurn.activate(
        Control.Send(
            content = composerText,
            contextRef = currentContextRef,
        ),
    )

// conceptual:
when (currentState) {
    Idle ->
        Act(
            admittedState = Requested(turnRef),
            begin = Begin(
                Effect.PerformTurn(...)
            ),
        )

    Requested,
    Responding,
    Stopping ->
        null // another turn is not lawfully admitted
}
~~~

Current service transport already has a concrete lower doorway:

~~~text
POST /api/v1/conversation/send
  ↓
VexLifeProdServiceContract.SendRequest
  ↓
VexLifeProdLocalService
  ↓
DirectCompanionTurn.Intent
~~~

**Revalidation question**

> Which current semantic owner, if any, now owns Send admission? Do not assume a future ConversationTurn Family merely because this specimen uses it to expose the question.

---

### Round 09 — canonical REQUEST establishes the turn before inference

**Question**

> Has this turn become durable Conversation truth before any provider call is allowed?

~~~text
Container
  DirectCompanionTurn

Current member
  performWithHooks(...)

Current relationship
  Conversation writer lease
  -> immediate prior completed turn
  -> beginRequest(...)

Truth established
  canonical REQUEST event/message/turn identity exists

Next edge
  current context materialization
~~~

Current source shape:

~~~kotlin
conversation.withWriterLease(instanceRef) {
    val prior =
        immediatePriorCompletedTurn()

    val request =
        beginRequest(
            turnRef = identity.turnRef,
            requestMessageRef = identity.requestMessageRef,
            content = intent.content,
            formedAt = hooks.now(),
        )

    // only now continue toward current context
}
~~~

Potential process-circuit interpretation:

~~~text
REQUEST not durable
  -> provider invocation not lawful

REQUEST durable
  -> ask next question:
     "Is required current context established?"
~~~

**Revalidation question**

> Does accepted source still durably establish REQUEST before prompt materialization/provider invocation, and what recovery law applies if the process stops after REQUEST but before RESPONSE?

---

### Round 10 — Conversation + Memory + runtime truth make provider invocation lawful

**Question**

> From this exact REQUEST, are the prior Conversation, current attributed Memory, and current runtime still the truths Vex may use right now?

~~~text
Container
  DirectCompanionTurn + DirectPromptContext

Current source sequence
  current Memory Context
  -> materialize Prompt Context
  -> reverify immediate prior Conversation/current REQUEST/current Memory
  -> obtain fresh current qualified runtime evidence

Truth established
  provider-ready message set is source-current
  runtime evidence is current

Next edge
  DirectCompanionConnection.invoke(...)
~~~

Current source-informed code:

~~~kotlin
val memoryContext =
    hooks.currentMemoryContext(productHome)

val prompt =
    DirectPromptContext.materialize(
        prior = prior,
        currentRequest = request,
        memoryContext = memoryContext,
    )

DirectPromptContext.reverify(
    materialization = prompt,
    prior = immediatePriorCompletedTurn(),
    currentRequest = request,
    memoryContext = hooks.currentMemoryContext(productHome),
)

val runtimeEvidence =
    hooks.currentRuntimeEvidence(setup)
~~~

This is a good example of **lawful direct composition that may remain direct**.

Not every line needs a Relay round.

The stage boundary is:

~~~text
before:
  required sources have not been reverified

after:
  provider invocation is lawfully bound to exact current sources
~~~

**Revalidation question**

> Which inputs still require exact revalidation immediately before invocation? Has browser-context admission joined this set yet?

---

### Round 11 — provider effect returns an observation, not semantic completion

**Question**

> What did the independently owned Heretic runtime actually return?

~~~text
Container
  DirectCompanionConnection

Current member
  invoke(...)

Role
  numeric-loopback provider Connection

Input
  QualifiedRuntimeEvidence
  provider-ready messages

Effect
  POST /v1/chat/completions

Outside truth returned
  provider HTTP result / response body

Current normalized observations
  RuntimeObservation
  InvocationEvidence

Next edge
  canonical RESPONSE formation
~~~

Current source-informed shape:

~~~kotlin
val inference =
    DirectCompanionConnection.invoke(
        runtime = runtimeEvidence,
        messages = prompt.messages,
        transport = hooks.transport,
        now = hooks.now,
    )
~~~

Inside the Connection:

~~~text
qualified runtime
  ↓
admitted numeric-loopback origin
  ↓
POST /v1/chat/completions
  ↓
provider response
  ↓
RuntimeObservation
+ InvocationEvidence
~~~

Important:

~~~text
MODEL RETURNED TEXT
!= CONVERSATION TURN COMPLETED
~~~

The next question is about durable Conversation truth.

**Revalidation question**

> Does DirectCompanionConnection still own only provider transport/observation normalization, and does any newer semantic owner now interpret its observation before Conversation persistence?

---

### Round 12 — RESPONSE + Context + Head earn turn completion

**Question**

> What must become durable before the system may truthfully say the Conversation turn completed?

~~~text
Container
  DirectCompanionTurn
  DirectConversationStore
  DirectTurnContextStore

Current sequence
  appendResponse(...)
  -> contextStore.record(...)
  -> commitCompletedTurn(...)

Truth established
  canonical RESPONSE event exists
  turn Context receipt exists
  Conversation Head advances to completed turn

Current result
  state = TURN_COMPLETED

Next edge
  service response / Conversation projection
~~~

Current source-informed code:

~~~kotlin
val response =
    appendResponse(
        request = request,
        content = inference.content,
        model = inference.model,
        runtimeObservationRef =
            inference.runtimeObservation.observationRef,
        invocationEvidenceRef =
            inference.invocationEvidence.invocationRef,
        ...
    )

val context =
    contextStore.record(
        request = request,
        response = response,
        promptContext = prompt.receipt,
        runtimeObservation = inference.runtimeObservation,
        invocationEvidence = inference.invocationEvidence,
        ...
    )

val head =
    commitCompletedTurn(
        request = request,
        response = response,
        contextSha256 = context.contextSha256,
        ...
    )
~~~

Process-circuit interpretation:

~~~text
provider observation returned
  ↓
ask:
  "Has RESPONSE become durable?"

RESPONSE durable
  ↓
ask:
  "Has Context become durable?"

Context durable
  ↓
ask:
  "Has Conversation Head advanced?"

Head advanced
  ↓
Turn completion becomes lawful
~~~

Those questions need not each become a separate retained State if one atomic owner can prove the required invariant together.

**Revalidation question**

> Which durability boundaries are independently recoverable today, and which distinctions are required for crash recovery rather than merely useful for diagrams?

---

### Round 13 — service projects the completed truth toward the foreground

**Question**

> The turn is durable. What bounded product response crosses the service boundary?

~~~text
Container
  VexLifeProdLocalService

Current member
  handleSend(...)

Current source receives
  DirectCompanionTurn.Result

Current projection
  VexLifeProdServiceContract.SendResponse

Includes
  turn/message/event refs
  returned content/model
  current Conversation Head
  Context path
  bounded Prompt Context projection

Next edge
  foreground consumer
~~~

Current source shape:

~~~kotlin
val result =
    turnExecutor.perform(
        startupSetup,
        DirectCompanionTurn.Intent(
            idempotencyKey = request.idempotencyKey,
            content = request.content,
        ),
    )

respondJson(
    exchange = exchange,
    status = 200,
    value = SendResponse(
        content = result.content,
        currentConversationHeadSha256 =
            result.currentConversationHeadSha256,
        promptContext = ...,
        ...
    ),
)
~~~

Important ownership law:

~~~text
SERVICE RESPONSE
= bounded wire projection

SERVICE RESPONSE
!= Conversation owner
!= Memory owner
!= runtime owner
~~~

**Revalidation question**

> Is SendResponse still the foreground-facing turn projection, or has a newer streaming/current Conversation projection replaced this transport shape?

---

### Round 14 — returned truth reaches the same human-facing Conversation

**Question**

> How does the durable returned Conversation truth reach the surface that initiated Send?

~~~text
Container
  intended VexWeb / foreground relationship

Current source status at formation
  NOT YET CONNECTED in generated P1:
  Send remains Unbound("conversation.send")

Therefore:
  this final edge is intentionally simulated

Target meaning
  completed Conversation / turn Projection
  -> ConversationTimeline / ResponseProgress
  -> same Companion region
  -> human sees Vex response

Completed human outcome
  "I sent a message to the same Vex,
   and the returned response is now durable Conversation truth
   visible in the foreground."
~~~

Illustrative target only:

~~~kotlin
val turnProjection: ConversationTurn.Projection =
    conversationTurn.currentProjection

ConversationSurface(
    timeline = canonicalConversationProjection,
    turn = turnProjection,
    onSend = {
        conversationTurn.activate(
            Control.Send(
                content = composer.value,
                contextRef = currentContextRef,
            )
        )
    },
)
~~~

The exact renderer/binding type is deliberately unspecified.

The important round trip is:

~~~text
same human control
  ↓
semantic Control
  ↓
durable REQUEST
  ↓
current sources
  ↓
provider observation
  ↓
durable RESPONSE / Head
  ↓
semantic / Conversation projection
  ↓
same human-facing Conversation
~~~

**Revalidation question**

> Is the current generated VexWeb product now connected to the service/Conversation projection? If yes, replace this simulated final bridge with the exact current source traversal.

---

## Completed simulated output

If every relationship above is satisfied, the full process can be read as:

~~~text
OPEN VEXLIFE
  ↓
canonical Home admitted
  ↓
Conversation writer safe
  ↓
Artifacts Exact
  ↓
Environment Ready
  ↓
Heretic Runtime Qualified
  ↓
source-bound Product Service Ready
  ↓
Vex Available
  ↓
foreground Send becomes lawful
  ↓
canonical REQUEST durable
  ↓
current Conversation + Memory + runtime reverified
  ↓
Heretic provider observation
  ↓
canonical RESPONSE + Context + Head durable
  ↓
foreground consumes returned Conversation projection
  ↓
HUMAN SEES VEX RESPONSE
~~~

The sequentiality is not merely:

~~~text
1
2
3
4
5
~~~

It is:

~~~text
truth 1 established
-> question 2 becomes lawful

truth 2 established
-> question 3 becomes lawful

...

returned truth established
-> foreground projection becomes lawful
~~~

That is the reference behavior this specimen is trying to make visible.

---

## Fresh-instance accuracy walk

Before using this specimen to implement or review source, a future instance should answer these questions against the **current** repository:

1. **Is the parent human intention still accurate?**
   - open VexLife;
   - retain same lived identity/continuity;
   - talk to Vex;
   - see the returned durable Conversation.

2. **Is the current source entry still the same?**
   - service lifetime/process;
   - local setup/session;
   - local service;
   - Conversation turn.

3. **Is canonical Home still the admitted identity source?**

4. **Does Conversation-writer safety/recovery still precede turn/service use?**

5. **Are artifact exactness, environment compatibility and runtime qualification still distinct required truths?**

6. **Which of those truths now have actual Family/Relay source, and which remain procedural?**
   - do not keep this specimen's hypothetical Family names merely because they are written here.

7. **Does repeated convergence still express the process without needing a second Process Relay primitive?**
   - inspect current Relay source;
   - ask what correctness a new primitive would add.

8. **Is VexWeb Send still Unbound("conversation.send")?**
   - if no, follow the actual current binding.

9. **Does a turn still establish REQUEST before provider invocation?**

10. **Which context sources are currently admitted?**
    - immediate prior Conversation;
    - Memory;
    - browser context, if later accepted;
    - anything else newly earned.

11. **Is runtime evidence re-observed/reverified before provider invocation?**

12. **Does DirectCompanionConnection still return provider observation/evidence without becoming Conversation owner?**

13. **What exact durability boundary earns TURN_COMPLETED now?**

14. **How does returned Conversation truth currently reach the foreground?**
    - do not infer this from old VexWeb or exploration code.

15. **Can VexBoard project every material edge without inventing one?**
    - if not, determine whether source relationship is missing or projection is missing.

The specimen survives only while those answers survive current source.

~~~text
REFERENCE EXAMPLE
-> asks better questions

REFERENCE EXAMPLE
!= FUTURE INSTANCE AUTHORITY

CURRENT SOURCE
-> decides whether each relationship remains true
~~~


## Failure is a process result, not an exception to the architecture

Suppose:

~~~text
Artifacts     Exact
Environment   Ready
Runtime       Starting
~~~

Runtime qualification fails.

The runtime owner interprets the observation and exposes truthful State / Projection, for example:

~~~text
Runtime       Held(QualificationFailed)
~~~

The convergence relationship runs again:

~~~text
Artifacts     Exact
Environment   Ready
Runtime       Held
~~~

and derives:

~~~text
Vex availability = Held

next lawful continuation:
  none, until the held runtime condition changes
~~~

There is no need for a procedural pipeline to remember to abort a later step.

The unsatisfied prerequisite makes later consequences unlawful.

This is valuable for debugging because the system can explain:

~~~text
goal
-> current process position
-> last established truth
-> current hold/failure
-> why the next stage is not lawful
~~~

## Restart / recovery becomes observation-first

An imperative setup sequence may restart with:

~~~text
Which source-code step were we on?
~~~

A relationship-driven process can instead re-observe:

~~~text
Artifacts     Exact
Environment   Ready
Runtime       process alive but not qualified
~~~

and derive the same next lawful relationship again:

~~~text
recover / qualify the current runtime
~~~

The world tells the architecture where the process is.

Persist a separate process coordinate only when required semantic truth cannot be recovered from rightful sources.

~~~text
RECOVER CURRENT TRUTH
BEFORE
REPLAYING PROCEDURAL STEPS
~~~

## Example — direct Companion turn as process circuitry

The current direct Companion path is an important continuity baseline and should not be exploded merely for architectural aesthetics.

Its causal body is approximately:

~~~text
begin canonical REQUEST
-> obtain immediate prior Conversation
-> obtain current attributed Memory
-> materialize Prompt Context
-> reverify Memory/currentness
-> obtain current qualified runtime evidence
-> invoke DirectCompanionConnection
-> append canonical RESPONSE
-> record turn Context
-> commit completed Conversation Head
~~~

A future VexArchitecture alignment pass should ask which are lawful in-process composition and which are material stage truths that determine continuation.

Investigation map:

~~~text
Human Send
    ↓
ConversationTurn.Control.Send
    ↓
CURRENT Turn State
    ↓
accepted Act
    ↓
Effect.PerformTurn

        ↓

REQUEST durably established?
    ├─ no  -> interpret failure/hold
    └─ yes
          ↓

required current context established?
    ├─ no  -> hold/fail through rightful owner
    └─ yes
          ↓

Vex runtime still qualified?
    ├─ no  -> request/reconcile availability
    └─ yes
          ↓

provider observation returned?
    ├─ no  -> waiting/failed according to real observation
    └─ yes
          ↓

RESPONSE + Context durably established?
    ├─ no  -> recovery/failure meaning
    └─ yes
          ↓

Conversation Head advanced?
    ├─ no  -> recovery/hold
    └─ yes -> Turn Completed
~~~

These labels are architecture questions, not accepted future State names.

The refactor should not manufacture stage types unless the product actually needs those distinctions to preserve meaning, recovery, concurrency, user projection or lawful continuation.

## Repeated convergence may remove the need for a separate Process Relay

A new ConvergenceProcessRelay was considered because process coordination appears different from state convergence.

This finding changes that default.

If the existing convergence relationship can retain enough current input/output meaning to express:

~~~text
Ready(...)
Needs(...)
WaitingFor(...)
Held(...)
Complete(...)
~~~

and each changed dependency naturally triggers reevaluation, then the existing Relay grammar may already represent sequential process position without another framework noun.

A new process-specific Relay should be added only if required behavior cannot be represented truthfully through:

~~~text
current dependency projections
+
retained convergence truth
+
rightful Family Controls
+
VexExecution active-work custody
+
outside observations
~~~

~~~text
NEW PROCESS NOUN
!= AUTOMATIC IMPROVEMENT

REPEATED CONVERGENCE
MAY ALREADY BE
SEQUENTIAL PROCESS CIRCUITRY
~~~

## Relationship boundaries remain distinct

The convergence loop does not erase VexArchitecture responsibility boundaries.

~~~text
CONVERGENCE RELATIONSHIP
  answers:
    what does combined current truth mean now?
    what required relationship is unsatisfied?

        ↓ requests rightful Control

FAMILY
  answers:
    what does this Control mean against exact current State?

        ↓ authors Act / optional Effect

METHOD / REALIZATION
  binds requested consequence to real work

        ↓

VEXEXECUTION
  owns:
    actual asynchronous Job custody
    overlap / cancellation

        ↓

STORE / PROVIDER / PLATFORM
  owns independently changing outside truth

        ↓ observation

RIGHTFUL FAMILY
  interprets what the observation means

        ↓ Projection

CONVERGENCE RELATIONSHIP
  evaluates again
~~~

Relay/convergence must not directly steal another Family Effect merely to move the process forward.

Prefer:

~~~text
Relay / convergence
-> request rightful Control
-> Family authors meaning
-> Effect realizes elsewhere
~~~

## Construction is related but not the same question

VexDependencyFactory already performs another kind of graph traversal:

~~~text
requested construction root
-> declared prerequisites
-> build prerequisites first
-> construct requested Value
-> memoize at the owning lifetime
~~~

This is construction ordering, not live semantic process convergence.

Useful distinction:

~~~text
VexDependencyFactory
  "What must be constructed first?"

VexCompoundRelay
  "What relationship truth follows from these current truths?"

Family
  "What does this Control mean against exact current State?"

VexExecution
  "What admitted asynchronous work is actually alive?"

Store/provider/platform
  "What does outside reality currently say?"
~~~

Future architecture should compose these questions rather than collapse them into one orchestration manager.

## Source references remain reusable across different behavior

A stable source reference identifies which truth is being discussed.

It must not absorb the behavior of one consumer.

Canonical Conversation / Memory source coordinates may participate in:

~~~text
startup continuity
communication / prompt context
Dream readiness / synchronization
human-requested Memory erasure
VexBoard causal explanation
~~~

without becoming one giant object with behavior such as:

~~~text
memory.startup()
memory.onMessage()
memory.dream()
memory.erase()
memory.sync()
~~~

Prefer:

~~~text
ONE RIGHTFUL SOURCE TRUTH
+
MANY EXPLICIT RELATIONSHIPS TO THAT TRUTH
~~~

Keep distinct:

~~~text
sourceRef
  which source truth?

owner
  who can interpret/change it?

relationship
  why is this feature using it?

projection
  which bounded meaning is consumed?

Control
  what meaning/change is requested?

Effect
  what outside consequence was lawfully authored?
~~~

The same ConversationHeadRef may support:

~~~text
Prompt Context selection
Memory provenance
Dream frontier comparison
startup continuity
VexBoard explanation
~~~

Same source identity; different relationships.

## Fractal depth — Depth becomes the next feature Surface

For Send:

~~~text
Surface  = Send UI
Behavior = Conversation semantic meaning
Depth    = Companion / runtime
~~~

Select Runtime:

~~~text
Surface  = runtime availability projection
Behavior = Ensure / Start / Reuse / Stop meaning
Depth    = artifacts / environment / process / qualification
~~~

Select Artifact Availability:

~~~text
Surface  = exact artifact-set projection
Behavior = EnsureExact / Reuse / Acquire / Hold meaning
Depth    = provider + filesystem + bytes
~~~

Depth is not necessarily a separate architectural species.

> Depth is what is visible before asking the next feature-level semantic question.

When a deeper relationship has State-sensitive meaning, it becomes another complete VexArchitecture body.

The recursion stops naturally when the next object is only mechanism / outside truth and no further semantic question exists.

## VexBoard implication — project process position, not only call depth

A source-owned VexBoard projection should eventually explain a process in semantic terms:

~~~text
Goal:
  VexAvailable

Current truth:
  Artifacts     Exact
  Environment   Ready
  Runtime       Starting
  Service       Ready

Current process position:
  WAITING FOR RUNTIME QUALIFICATION

Already satisfied:
  exact artifact relationship
  compatible environment relationship

Not yet lawful:
  Companion turn
~~~

For a turn:

~~~text
Goal:
  Complete Conversation turn

Established:
  canonical REQUEST
  current Memory/context
  qualified runtime

Current:
  awaiting provider observation

Not yet lawful:
  commit final RESPONSE / Head
~~~

VexBoard should answer:

~~~text
why am I here?
what truth has been established?
what truth failed or is held?
what question is being asked now?
what continuation becomes lawful next?
which source/owner supports each claim?
~~~

This makes the Lens a causal architecture navigator rather than a class/call graph.

## After the source refactor — revisit VexBoard maturity from real projection pressure

The VexBoard question should be revisited **after** one lived VexLife-Prod circuit has been refactored into source-visible VexArchitecture relationships and can emit a real architecture projection.

This is not because VexBoard is conceptually unrelated until then. The opposite is true:

~~~text
VexArchitecture
  authors traversable causal relationships

VexBoard
  is a natural read-side for those relationships
~~~

The reason to wait before changing the Lens schema is narrower:

> **Do not invent projection vocabulary for relationships the product source has not actually earned yet.**

The refactor should first produce real pressure. Then VexBoard maturity can be judged by concrete questions.

### Maturity question 1 — can current Lens roles represent the causal body without losing meaning?

Current Screen Lens already recognizes roles such as:

~~~text
INTENT
CONTROL
STATE
ACT
EFFECT
METHOD
EXECUTION
STORE
OBSERVATION
PROJECTION
CONSTRUCTION
CHRONOLOGY
~~~

That is already close to the VexArchitecture body.

Example source relationship:

~~~text
HereticRuntime

Control.EnsureAvailable
+ State.Absent
    ↓
Act.StartAndQualify
    ↓
Effect.StartExactRuntime
    ↓
Method
    ↓
Execution
    ↓
platform/provider
    ↓
Observation
    ↓
State.Qualified
    ↓
Projection.Ready
~~~

If a source-owned VexLife-Prod exporter can emit this faithfully into the current Lens schema, **do not add new node roles merely because the product is deeper than a screen**.

Why:

~~~text
DEPTH OF FEATURE
!= NEW ARCHITECTURAL SPECIES
~~~

A runtime feature can use the same semantic grammar as a human-facing feature.

Evidence for maturity would be:

~~~text
current schema
+ source-owned export
-> complete traversal
-> no invented edge
-> no lost owner distinction
~~~

### Maturity question 2 — does the Lens need richer relationship verbs, not richer nouns?

A more likely pressure is not missing node types, but missing **edge meaning**.

Consider:

~~~text
VexAvailability
    ├─ reads ArtifactAvailability.Projection
    ├─ reads EnvironmentAvailability.Projection
    └─ reads HereticRuntime.Projection
~~~

and then:

~~~text
VexAvailability
    ↓ requests Control
ArtifactAvailability.Control.EnsureExact
~~~

Those two edges do very different things.

If both become a generic:

~~~text
depends-on
~~~

VexBoard loses important architecture.

Possible relationship meanings that real source may pressure:

~~~text
READS_PROJECTION
REQUESTS_CONTROL
REFERENCES_SOURCE
CONVERGES_WITH
REALIZES_EFFECT
OBSERVES
PROJECTS
CONSTRUCTS
~~~

Why this matters:

~~~text
"uses X"
does not tell a human whether:

  X owns truth being observed,
  X is being asked to change,
  X merely realizes already-authored work,
  or X is one contributor to new convergence truth.
~~~

Do not add these exact names merely because this document suggests them.

After export exists, ask:

> Can the current Lens already preserve those distinctions through existing pathway/role data?

If yes, keep it.

If no, the missing relationship distinction is now evidenced by real source rather than architecture speculation.

### Maturity question 3 — can VexBoard show process position without becoming the process owner?

Repeated convergence gives the architecture a meaningful current position:

~~~text
Goal:
  VexAvailable

Current:
  Artifacts   Exact
  Environment Ready
  Runtime     Starting

Waiting for:
  runtime qualification

Not yet lawful:
  Conversation Send
~~~

VexBoard should be able to **explain** this.

It must not become the thing deciding what runs next.

Why:

~~~text
PRODUCT / RELAY
  owns current convergence meaning

VEXBOARD
  projects that meaning

VEXBOARD
  != workflow engine
  != process scheduler
~~~

The maturity question is therefore:

> Can the source-owned projection express the current convergence output, satisfied prerequisites, hold reason and next-lawful relationship as read-only meaning?

If yes, VexBoard can show process circuitry.

If doing so would require VexBoard to recompute the decision from raw source States, the product projection is probably still too weak.

### Maturity question 4 — can one stable source truth participate in several feature paths without being duplicated?

Example:

~~~text
ConversationHeadRef
    ├─ Prompt Context selection
    ├─ Memory provenance
    ├─ Dream frontier comparison
    ├─ startup continuity
    └─ VexBoard causal explanation
~~~

VexBoard should represent:

~~~text
ONE source identity
+
SEVERAL relationships
~~~

not:

~~~text
five copied "Conversation Head" nodes
that accidentally appear to own separate truth
~~~

Why:

A major purpose of the New Beginnings architecture is reusable source truth with behavior owned by the relationship consuming it.

The maturity question is:

> Can the Lens retain stable source identity while showing different relationship meanings around it?

If not, VexBoard may need a better identity/edge representation before this architecture is truly perceivable.

### Maturity question 5 — can the graph recenter fractally?

From Send:

~~~text
Surface:
  Send UI

Behavior:
  ConversationTurn

Depth:
  HereticRuntime
~~~

Select HereticRuntime:

~~~text
Surface:
  Ready / Starting / Held projection

Behavior:
  Ensure / Start / Reuse / Stop

Depth:
  Artifacts / Environment / Process / Qualification
~~~

Select ArtifactAvailability:

~~~text
Surface:
  Exact / Missing / Held

Behavior:
  EnsureExact / Reuse / Acquire / Hold

Depth:
  provider / filesystem / bytes
~~~

The maturity question is:

> Can VexBoard recenter the same stable node and reveal its own causal neighborhood without switching to an unrelated "infrastructure graph" ontology?

Why:

That is the practical proof that VexArchitecture depth is **relative/fractal**, not a fixed frontend/backend stack.

A mature Lens should let:

~~~text
parent Depth node
-> become selected center
-> expose its own Surface / Behavior / Depth relationships
~~~

without losing the upward reason:

~~~text
"Why am I here?"

ArtifactAvailability
  exists in this walk because
  HereticRuntime requires it because
  VexAvailability requires runtime because
  Conversation Send requires Vex.
~~~

### Maturity question 6 — can held, unknown and not-yet-connected truth stay visible?

Example current source:

~~~text
VexLifeWebP1.Send
-> Unbound("conversation.send")
~~~

VexBoard must not close that edge simply because the lower service path exists.

Likewise:

~~~text
Runtime Held(QualificationFailed)
~~~

must not be projected as:

~~~text
Runtime -> Ready
~~~

because another nearby source file contains a successful startup path.

Why:

~~~text
MAPPABILITY
!= GRAPH COMPLETENESS AT ANY COST

TRUTHFUL OPEN EDGE
> INVENTED CLOSED CIRCUIT
~~~

The maturity question is:

> Can the Lens express UNBOUND / HELD / UNKNOWN relationships as first-class visible states without treating them as adapter failure?

This is essential if VexBoard is going to be useful for debugging architecture rather than merely drawing happy paths.

### Maturity question 7 — can every material arrow point back to a source-owned relationship?

A useful post-refactor proof is:

Pick any important VexBoard edge and ask:

~~~text
Where did this arrow come from?
~~~

For example:

~~~text
ArtifactAvailability.Exact
-> EnvironmentAvailability.EnsureCompatible becomes lawful
~~~

The answer should be an actual source-owned convergence relationship.

Not:

~~~text
"The adapter knows setup normally works this way."
~~~

Likewise:

~~~text
Send
-> ConversationTurn.Control.Send
~~~

must come from the actual product binding.

Why:

VexBoard should project architecture, not author missing architecture.

A mature source projection therefore carries enough provenance to answer:

~~~text
node/edge
-> source owner
-> stable ref
-> exact source coordinate/revision
~~~

### Maturity question 8 — can projection stay generated/read-only while product source remains authoritative?

The desired direction is:

~~~text
VexLife-Prod source
    ↓
source-owned bounded architecture exports
    ↓
generated architecture snapshot
    ↓
VexBoard adapter
    ↓
VexBoard
~~~

Not:

~~~text
VexBoard parser
    ↓
reads arbitrary Kotlin proximity
    ↓
guesses relationships
    ↓
becomes a second architecture author
~~~

Why:

The architecture should be correct even if VexBoard does not exist.

VexBoard's job is to make that architecture perceivable.

The maturity question is:

> Can the adapter remain boring?

A healthy result is that most semantic intelligence lives in the product's compiler/source-visible relationships, while VexBoard mostly validates schema/currentness/provenance and renders.

### What would justify changing the Lens schema?

After the refactor and first real export, change the Lens only when one of these becomes concrete:

~~~text
a real relationship cannot be represented
without losing semantic meaning

a stable source identity cannot be reused
without duplication or ambiguity

a held/currentness/process-position truth
cannot be projected without adapter inference

fractal recentering loses causality/provenance

an important arrow cannot remain source-addressable
~~~

Then the schema change has a consumer and a demonstrated failure.

Until then:

~~~text
VEXARCHITECTURE REFACTOR
-> REAL SOURCE EXPORT
-> VEXBOARD PRESSURE TEST
-> ONLY THEN
   decide whether Lens vocabulary must mature
~~~

This is not a reason to doubt VexBoard compatibility.

It is a way to let the **actual traversable VexArchitecture body specify what the read-side needs**.


## Post-baseline New Beginnings refactor horizon

Do not mix this refactor into the still-moving continuity/local-runtime proof merely to improve architecture aesthetics.

Preferred order after the current lived baseline reaches accepted source:

### A. Preserve one whole working human circuit

~~~text
human Send
-> canonical RESPONSE
-> reload/continuity remains true
~~~

### B. Map intention and material stage questions before editing code

For each edge ask:

~~~text
WHY must this relationship exist?
WHO owns current truth?
WHAT Control/request exists here?
DOES its meaning depend on current State?
WHAT distinct truth must be established before continuation?
WHAT Observation returns?
WHERE is that observation interpreted?
~~~

### C. Reveal latent Families only where earned

Possible investigation areas:

~~~text
Conversation turn
Heretic runtime availability/currentness
product-service currentness/lifetime
artifact availability
execution-environment availability
browser context
Dream readiness / Memory relationships
~~~

These are questions to investigate, not required class names.

### D. Preserve lawful direct composition

Do not convert every call in DirectCompanionTurn, setup, runtime or stores into a Family/Relay stage.

Keep a direct call when it transports already-decided truth and no material semantic continuation question exists.

### E. Use repeated convergence for process circuitry before inventing another framework

Prove whether existing Compound Relay semantics can express:

~~~text
Needs
Waiting
Held
Ready
Complete
~~~

over current projections.

Only add another primitive if a concrete correctness need remains unsatisfied.

### F. Source-own architecture projection

Once real relationships are compiler/source visible, compose read-only projections from rightful owners.

~~~text
PRODUCT SOURCE
-> generated architecture projection
-> bounded VexBoard adapter
-> Lens
~~~

The adapter must not invent missing relationships.

## Exposure through expression — when the long form is signal and when it is bloat

A useful pressure behind this architecture is the ordinary programming pattern:

~~~kotlin
val artifacts = materializeArtifacts()
val environment = ensureEnvironment(artifacts)
val runtime = startRuntime(environment)
val result = invoke(runtime)
~~~

This form is attractive because causality is visually compact:

~~~text
return from A
-> argument to B
-> return from B
-> argument to C
~~~

There is nothing inherently wrong with that form.

The architecture question is:

> **What meaning is lost when the intermediate result exists only as a local value passed to the next line?**

If the answer is "nothing important," keep the short form.

For example:

~~~kotlin
val digest = sha256(bytes)
val normalized = normalize(path)
val payload = encode(request)
~~~

Expanding those into architectural State/Control/Relay stages would usually be bloat.

But if an intermediate result answers questions such as:

~~~text
Is this truth independently current?
Can it fail or become held without the parent failing identically?
Must another owner interpret it?
Can another feature consume the same truth?
Must restart/recovery rediscover it?
Does authorization change what may happen next?
Would a human/debugger need to know why continuation stopped here?
Does the next stage become lawful only after this truth is established?
~~~

then hiding it inside:

~~~kotlin
val result = functionWithReturn()
~~~

may be a compression of architecture, not merely a compression of syntax.

The longer VexArchitecture form exposes that hidden semantic boundary:

~~~text
CURRENT truth
+
Control / required relationship
        ↓
Act / Effect
        ↓
realization
        ↓
Observation
        ↓
interpreted new truth
        ↓
next relationship becomes lawful
~~~

This can feel more verbose because it makes the previously implicit question addressable.

The benefit is not "more code."

The benefit is that somebody can now ask:

~~~text
What is true?
Why are we here?
What failed?
Who owns this truth?
What is waiting?
What becomes lawful next?
What source proves that?
Can this same truth be reused somewhere else?
~~~

and source has an answer.

### The long conceptual form does not require permanently verbose syntax

A mature architecture may eventually provide concise authoring ergonomics while preserving the expanded relationships in compiler/source-visible form.

Conceptually, a future authoring surface might allow something compact like:

~~~kotlin
// illustrative only — not an accepted API

converge(VexAvailable) {
    require(
        ArtifactAvailability,
        Control.EnsureExact,
    )
    require(
        EnvironmentAvailability,
        Control.EnsureCompatible,
    )
    require(
        HereticRuntime,
        Control.EnsureAvailable,
    )
}
~~~

while the underlying architecture still exposes:

~~~text
which projection was read
which Control was requested
which owner interpreted it
which Effect was authored
which Observation returned
which next relationship became lawful
~~~

The target is therefore not:

~~~text
VERBOSE SOURCE = GOOD ARCHITECTURE
~~~

It is:

~~~text
SEMANTIC RELATIONSHIPS MUST REMAIN INSPECTABLE

syntax may become shorter
only if that shortening does not erase the questions
~~~

A useful rule:

> **Compress syntax after the relationship is understood; do not compress away the relationship before it has been understood.**

This is another reason New Beginnings should pressure the architecture with real product circuits before inventing a generalized convenience API.

### Shortcut versus compression

The distinction to preserve is:

~~~text
SHORTCUT
  removes an architectural distinction
  because it is inconvenient to express

COMPRESSION
  preserves the distinction
  while giving the author a smaller lawful syntax
~~~

For example:

~~~text
artifact result
-> environment result
-> runtime result
~~~

may be perfectly good ordinary composition if those values are only local implementation details.

But if they are actually:

~~~text
ArtifactAvailability.Exact
-> makes EnvironmentAvailability.EnsureCompatible lawful

EnvironmentAvailability.Ready
-> makes HereticRuntime.EnsureAvailable lawful

HereticRuntime.Qualified
-> makes VexAvailable true
~~~

then those are not merely return values.

They are semantic relationships worth exposing even if a later SDK makes their authoring concise.

## Anti-patterns this finding is intended to prevent

### Build silos first, reconnect later

~~~text
ArtifactService
PythonService
RuntimeService
ConversationService
MemoryService
SetupCoordinator
~~~

without first mapping why these owners collaborate.

### Giant setup coordinator

~~~text
setup:
  materialize
  install
  start
  qualify
  connect
~~~

where line order silently owns process semantics.

### Every function becomes a stage

That creates ceremony without preserving additional truth.

### Relay steals child Effects

Convergence may request a child Control; it should not bypass the Family that decides what the request means.

### Source identity becomes workflow identity

MemoryRef, ConversationHeadRef, runtime receipt and artifact refs may be reused by many relationships.

### Add a Process Relay before proving existing Relay is insufficient

The smallest architecture that preserves correctness wins.

## Review heuristic for future implementation

For every candidate stage:

1. What human/parent intention caused descent here?
2. What semantic question is being answered at this depth?
3. Which exact current truth determines the answer?
4. Who already owns that truth?
5. Does the Control mean something different under different current truth?
6. If yes, has a Family been earned?
7. If accepted meaning requests work, what inert Effect is authored?
8. What outside observation proves the stage succeeded or failed?
9. Who interprets that observation?
10. What new truth is established?
11. Does that new truth make another stage lawful?
12. Can restart/recovery derive the same process position from current truth instead of replaying?
13. Can VexBoard explain why this node exists in the original human-intention chain without inventing an edge?

## Compact law

~~~text
HUMAN INTENTION
-> REQUIRED RELATIONSHIP
-> SEMANTIC QUESTION
-> CURRENT TRUTH + CONTROL
-> ACT
-> EFFECT, when outside work is required
-> REALIZATION / EXECUTION
-> OUTSIDE OBSERVATION
-> RIGHTFUL INTERPRETATION
-> NEW TRUTH
-> CONVERGENCE RE-EVALUATION
-> NEXT LAWFUL RELATIONSHIP
-> ...
-> HUMAN OUTCOME
~~~

The process advances because truth advances.

Sequentiality is causal, not merely textual.

Failure and hold are first-class process positions.

Recovery begins by observing current truth rather than replaying old source-code steps.

This shape is intended to keep VexArchitecture consistent from the human-facing application through New Beginnings depth without adding a second process architecture unless one is actually earned.

<!-- [VXG RealForever][VEXLIFE-NEW-BEGINNINGS][VEXARCHITECTURE][FRACTAL-SEQUENTIAL-CONVERGENCE] -->
