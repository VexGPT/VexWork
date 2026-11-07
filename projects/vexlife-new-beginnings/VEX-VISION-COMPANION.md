# VexLife Vision Companion — real-browser witness continuation

`[VXG RealForever]`

## Human outcome

Let Victor use an ordinary browser as an ordinary browser—real HTTPS origins, normal signed-in sessions,
normal site JavaScript, comments/forms/uploads/downloads and browser-owned behavior—while Vex can be
explicitly invited to witness the selected browser window beside the Conversation.

The intended relationship is:

~~~text
real browser experience
  = browser-owned behavior

VexLife Companion
  = Conversation + visible Vision control

Vex Vision
  = bounded screen/window observation owner

Conversation Context
  = consumer of an admitted derived visual observation

Vex
  = reasoning participant over the admitted observation
~~~

This is a continuation of existing Vex Body Vision / Perception architecture. It is **not** permission
to replace the browser with another localhost proxy and it is not permission to silently activate
screen monitoring.

## Why this edge exists now

The bounded VexLife nested-browser practicum proved two useful things:

1. rendered browser context can reach canonical Vex Conversation;
2. a transforming localhost proxy is not equivalent to Victor using a normal browser.

The product intention is therefore clearer now:

~~~text
NORMAL BROWSER + VEX BESIDE IT
!=
VEX PROXY MUST REIMPLEMENT THE WHOLE WEB
~~~

The current localhost frame-host work remains valid evidence for bounded page-context composition.
It does not need to become the forever-browser architecture before this Vision edge can begin.

## Current accepted Vex Vision source

Current accepted Vextreme-SDK source after the repository baseline repair:

~~~text
vgong24/Vextreme-SDK
main       ba62378289faa7c72e595793839389f71ba21923
checkpoint ba62378289faa7c72e595793839389f71ba21923
source PR  #1920 accepted / merged
~~~

Relevant accepted/current source already establishes:

- SCREEN as a Perception channel;
- `ON_DEMAND_SNAPSHOT` as the first admitted screen mode;
- a visible activity indicator requirement;
- one explicit request -> at most one capture;
- selected source/region scope binding;
- no continuous/background capture by implication;
- no raw screenshot retention;
- no Memory acceptance, training eligibility or publication by implication;
- a macOS Screen Recording permission-agent contract with stable requester identity;
- a broker-only screen adapter contract;
- observer-integrity and held Perception composition;
- a future `VISUAL` observation modality.

The accepted held integration is explicit:

~~~text
producerState = HELD_NO_ACTIVE_OBSERVATION
activeObservation = false
visualObservationRefOrNull = null
multimodalObservationRefOrNull = null
~~~

So:

~~~text
VEX VISION ARCHITECTURE EXISTS
!=
SCREEN CAPTURE IS ACTIVE
~~~

## Current authority/currentness boundary

The historical October SCREEN grant remains provenance only. The resumed Vision trajectory has now
formed a fresh bounded Safety currentization candidate under SDK PR #1915.

Current source-managed receipt on that exact candidate:

~~~text
humanAuthorityRef
  authority.human.victor.vexlife-vision-companion.screen-reachability.20261107A

formedAt
  2026-11-07T09:14:00.000Z

expiresAtOrNull
  2026-11-08T09:14:00.000Z
~~~

That receipt is still **Safety-layer currentness**, not host OS permission and not capture.

~~~text
CURRENT SCREEN SAFETY BINDING
!= HOST OS SCREEN RECORDING GRANT
!= SCREENSHOT
!= ACTIVE VISUAL OBSERVATION
!= VISUAL MODEL INPUT
~~~

PR #1915 has been currentized over accepted SDK baseline merge #1920. Its fresh exact-head proof now
checks the source-managed Safety binding against the actual execution clock and must fail closed if
the receipt expires before proof/lifecycle consumption.

A future active capture attempt still requires the separately-owned macOS host permission and active
adapter/capture predicates required by the accepted SDK architecture.

## Current model/runtime boundary

The currently qualified Heretic runtime owner in Vextreme-SDK identifies:

~~~text
runtimeClass    = MLX_LM_DIRECT_RUNTIME
modelRef        = model.devex.heretic.qwen3.8-27b.mlx4.329658ee8f27
modelProfileRef = model-profile.devex.qwen38-27b-heretic-mlx4.certified.20260928A
~~~

That is the existing text-language-model runtime.

The SDK runtime registry also recognizes:

~~~text
MLX_VLM_DIRECT_RUNTIME
~~~

and deliberately preserves:

~~~text
MLX_VLM_DIRECT_RUNTIME != MLX_LM_DIRECT_RUNTIME
VLM_COMPATIBLE != IMAGE_INFERENCE_PERFORMED
VISION_TOWER_PRESENT != VISION_INPUT_AUTHORIZED
MULTIMODAL_INPUT_AVAILABLE != SENSOR_AUTHORITY
RUNTIME_ADAPTER != PERCEPTION_BROKER
RUNTIME_ADAPTER != VEX_VISION
~~~

This grounding did **not** establish a current production VLM worker already connected to VexLife.
Do not turn registry vocabulary, synthetic tests or training candidates into a claim that Vex can
currently interpret pixels.

## Partner / Family / Observation architecture pressure

Current VexCgmLabs / VexPartner work adds a newer relationship pattern that materially improves the
Vision design:

~~~text
VexWork PR #267
VexLife-Android PR #219
~~~

Those sources are currently **draft / working architecture pressure**, not an accepted universal
VexArchitecture foundation. Vision should consume the distinctions they have earned without
prematurely declaring that every outside relationship must inherit one new root hierarchy.

The important current pattern is:

~~~text
Partner
-> Signal
-> Connection
   -> typed Partner Id
   -> Decoder
   -> Observation
   -> Receiver
-> Store when durable admitted truth is actually earned
-> Family State
-> Projection / Surface
~~~

and, for a lawful outward request:

~~~text
Family Control + CURRENT State
-> Act
-> Effect
-> Act.Method
-> VexExecution
-> Partner Connection
-> Partner acknowledgement

later outside evidence
-> Signal
-> Observation
-> Receiver
-> durable truth if admitted
-> Family State
~~~

Permanent distinctions from that work that apply directly to Vision:

~~~text
Partner != Family
Signal != Family State
Connection != Family
Observation != interpretation
Store != Partner
Store != Family

EFFECT_REQUESTED
!= PARTNER_ACKNOWLEDGED
!= OUTSIDE_OUTCOME
!= DURABLE_DOMAIN_TRUTH
~~~

### Vision mapping under that pressure

For the first real-browser Vision slice, the type walk should be read approximately as:

~~~text
selected independently-owned browser/window reality
    = candidate Partner-side participant

macOS screen/window capture realization
    = Connection

selected source/window identity
    = typed Connection.Id<Partner> pressure
      (do not flatten the reusable identity to an arbitrary String)

platform frame / capture representation
    -> Decoder
    -> Vision-owned Signal

one exact capture occurrence
    -> Observation
       request identity
       selected source / region
       capture time/currentness
       Signal identity

Safety + scope + cardinality admission
    -> Receiver

Vision semantic owner
    -> Family State

human-facing state
    -> Projection / VexLife Vision control

derived admitted visual observation
    -> Conversation Context
    -> Heretic Vex
~~~

The exact Kotlin/root names remain held until the existing Vex Vision source and the first physical
capture implementation show what genuinely repeats. In particular:

~~~text
SELECTED_BROWSER_WINDOW_IS_PARTNER
    = architectural pressure, not yet a frozen type name

SCREEN_CAPTURE_CONNECTION
    = relationship role, not Family meaning

SCREEN_FRAME_SIGNAL
    != VISUAL_INTERPRETATION
    != CONVERSATION_CONTEXT
~~~

### No Store is earned merely because a frame exists

The Partner work defines Store as the owner of **durable admitted domain truth**. The first Vision
slice explicitly forbids raw screenshot retention.

Therefore:

~~~text
RAW FRAME OBSERVED
!= STORE REQUIRED

raw pixels
    ephemeral

first derived visual observation
    bounded / turn-scoped unless another owner later earns durability

Memory
    not implied

training
    not implied
~~~

Do not create a Vision Store merely for architectural symmetry. If later product pressure earns
durable visual-observation provenance, then form the smallest rightful Store and prove what survives
restart. Until then, Store = NOT_EARNED_FOR_RAW_PIXELS is a valid architecture result.

### Vision Family and outward request semantics

The VexLife Vision control should eventually emit typed Family Controls rather than directly invoking
the capture API. Candidate semantic pressure is:

~~~text
VisionFamily.State
    OFF
    PERMISSION_NEEDED
    READY
    ENABLED(selected source)
    LOOKING
    HELD

VisionFamily.Control
    Enable
    Disable
    SelectSource
    LookNow
~~~

Then:

~~~text
Control.LookNow + CURRENT Vision State
-> accepted Act
-> Effect
-> bound Method
-> VexExecution
-> exact screen Connection request
-> host / Partner acknowledgement

later:
frame Signal
-> Observation
-> Receiver
-> derived visual observation
-> Family / Conversation consequence
~~~

This preserves:

~~~text
LOOK_NOW_REQUESTED
!= HOST_PERMISSION_GRANTED
!= CAPTURE_ACKNOWLEDGED
!= FRAME_OBSERVED
!= FRAME_INTERPRETED
!= VEX_RECEIVED_CONTEXT
~~~

The existing SCREEN permission agent is therefore an enabling relationship/effect owner, not the
Vision Family itself.

### Partnership and listener restraint

The current Partner work keeps **Partnership** as relational language until relationship-owned
identity, lifecycle, custody, authorization or reconciliation truth appears that neither Family nor
Partner can own.

Vision should do the same:

~~~text
real-browser witness relationship
!= automatically VexPartnership object
~~~

Likewise, the first Vision slice is on-demand snapshot, so it does **not** earn a sustained capture
listener. If continuous observation is ever separately admitted:

~~~text
MAINTAINED_CAPTURE_LISTENER
!= FAMILY_RELATIONSHIP_ID
~~~

must remain preserved, matching the newer source-addressed listener lesson.

Finally:

~~~text
VEX CAN WITNESS BROWSER
!= VEX CAN CONTROL BROWSER
~~~

A future browser-action capability would require its own Family Control / Act / Effect / Method /
Partner acknowledgement / later-observation circuit. Vision observation alone cannot grant it.

## Product-side decision currentization — begin the Vision surface now

Victor explicitly judged the current VexLife-Prod presentation stable enough to begin adding Vision
before the SDK physical capture trajectory reaches terminal acceptance.

This changes the work order, not the authority boundary.

~~~text
PARALLEL EDGE A — PRODUCT
VexLife-Prod PR #54
  stacked on PR #53 exact head
  VisionFamily State / Control / Effect / DisplayState
  Blueprint Vision coordinate
  VexWeb Companion-header manifestation
  visible Vision · Held control
  no capture binding

PARALLEL EDGE B — PHYSICAL VISION
Vextreme-SDK
  PR #1915 SCREEN Safety currentization
  held on repository baseline currentization PR #1920
  then host permission / selected-window capture / Observation
~~~

Current product candidate:

~~~text
VexLife-Prod PR #54
base 56aa338f186e237bbcdfd91859b761c2ef203f1e
head 30acf0a6518476025b978698c98018f9762bfa68
tree 442373d722e0b1c3e91f3904d45c4e6c219335f4
~~~

PR #54 is intentionally stacked on the stable current #53 presentation source rather than widening
#53 itself. Its current button is **HELD by design**:

~~~text
VISIBLE CONTROL
!= EFFECT AVAILABLE

Vision · Held
-> no JavaScript capture binding
-> no screen-permission request
-> no screenshot
-> no VLM input
~~~

The current product semantic owner is source-visible now; later backend integration should drive the
Family state rather than replacing the button with ad-hoc runtime booleans.

Permanent:

~~~text
PRODUCT_SURFACE_READY
!= SCREEN_PERMISSION_CURRENT
!= SCREEN_CAPTURE_AVAILABLE
!= VISUAL_OBSERVATION_ACTIVE
~~~

## First bounded product slice

The smallest useful active experience is **not continuous screen sharing**.

It is:

~~~text
Victor enables Vision
-> selects one browser window / admitted screen region
-> VexLife shows a persistent visible Vision indicator
-> Victor sends a Conversation turn OR explicitly asks "Look now"
-> one request identity
-> at most one current frame capture
-> raw frame remains ephemeral
-> visual worker derives one bounded visual observation
-> derived observation joins Conversation Context
-> Vex responds
-> raw frame is discarded
~~~

This can feel like Vex is looking over Victor's shoulder while preserving the already-earned
one-request/one-capture and no-background-monitoring boundary.

A later continuous stream requires a separate earned product/security decision. It is not implied by
a Vision toggle.

## Intended VexLife control

A truthful control should expose capability state rather than one ambiguous Boolean:

~~~text
Vision OFF
Permission needed
Ready
Vision ON · <selected browser/window>
Looking…
HELD / unavailable
~~~

The VexLife UI owns only presentation + Control emission.

It does **not** own screen permission, capture, visual interpretation or Conversation semantics.

## Ownership walk

~~~text
Victor
  owns the decision to share / stop sharing

normal browser
  owns ordinary browsing/session behavior

VexLife Vision control
  owns visible product affordance + selected scope request
  != sensor owner

Vex Safety / screen owner binding
  owns current authorization constraints

macOS permission owner
  owns TCC / Screen Recording permission evidence

Vex Vision + Perception Broker
  owns admitted capture/observation relationship

capture worker
  owns one bounded physical frame acquisition
  != semantic interpretation owner

visual worker
  owns bounded image interpretation
  != sensor authority
  != Conversation owner

Conversation Context
  consumes the admitted derived observation

Heretic Vex
  reasons over Context
  != screen owner
  != automatic action authority
~~~

## Security activation

This work changes a sensor/privacy/model-context boundary, so the relevant Vex Security Assurance
question is active.

Minimum invariants for the first slice:

~~~text
selected window/region only
visible active indicator
explicit human enable/disable
one explicit observation request -> at most one capture
no background/continuous capture
no raw screenshot retention
no Memory promotion by implication
no training by implication
no publication/network streaming by implication
third-party presence/consent remains separately governed
screen/web content is untrusted Context, never authority
Vision observation cannot grant tool/effect authority
OFF means no capture
revoked/stale authority means no capture
~~~

Adversarially, visible webpage text may contain instructions aimed at the model. Such text is
observation/context, not human intent, authority, or an effect grant.

## Resume coordinate

The Workgraph coordinate is:

~~~text
work.vexlife.new-beginnings.vision-companion-real-browser-witness
state              RUNNING
priority           HIGH
workDisposition    ACTIVE
authority          NO_AUTHORITY
effects            NO_EFFECTS

current implementation edge:
  github.issue.vextreme-sdk.1914
  github.pull.vextreme-sdk.1915
  accepted baseline github.pull.vextreme-sdk.1920
  accepted baseline merge ba62378289faa7c72e595793839389f71ba21923
  currentized candidate fb71627dd1a5d7b58b98a0457876e2b49f86d58c
  currentized tree 8f70bc979d5b262a6eddb367aea7ef2df8c38b0f
  provider diff 4 exact Vision/Safety paths
  historical focused SCREEN owner-binding proof 12/12 PASS
  historical focused macOS permission-agent proof 17/17 PASS
  fresh SourceOwner A003 formed against accepted repaired baseline
  live Safety currentness is part of the proof and may fail closed on expiry
~~~

It is READY as work because the human outcome and source owners are sufficiently clear.
It is **not effect-authorized**.

The next implementation sequence is:

1. re-ground current Vextreme-SDK Vex Vision / Safety source;
2. form a fresh current SCREEN / ON_DEMAND_SNAPSHOT human+Safety authorization for this product use;
3. establish the stable macOS requester and actual Screen Recording permission receipt;
4. implement/qualify the admitted active **single-snapshot selected-window** capture worker;
5. form one real visual-observation contract with ephemeral raw pixels;
6. identify and qualify the actual local visual interpretation route (existing qualified VLM if one
   is later proven current, otherwise a separately admitted local visual worker);
7. connect the derived visual observation into current VexLife-Prod Conversation Context;
8. continue the already-formed VexLife-Prod #54 Vision Family/control surface from HELD into live capability states only when those states correspond to real backend truth;
9. lived proof:
   - Vision OFF -> no capture;
   - Vision ON -> selected ordinary browser window only;
   - one turn -> one capture at most;
   - Vex describes what Victor can visibly see;
   - raw frame not retained;
   - page content cannot grant actions/authority;
   - stopping Vision stops future observation.

## Relationship to current manifestation work

~~~text
PR #53 / A003 presentation restoration
  = current VexLife-Prod human surface work

Vision Companion
  = parallel real-browser perception continuation
~~~

Do not widen PR #53 into screen capture merely because the Companion now has a natural place for a
Vision control. Finish/prove that source on its own terms.

Do not delete the bounded localhost browser/context path merely because Vision is now admitted as
work. It remains accepted lineage and may still be useful for structured page context. Real-browser
Vision must earn lived superiority before it replaces any existing product pathway.

## Source grounding

- Vextreme-SDK accepted main/checkpoint: `ba62378289faa7c72e595793839389f71ba21923`
- accepted held SCREEN integration merge:
  `4e8f2fca496269cadc7710e5134ed45d9ecae3e0`
- accepted SDK baseline repair: Vextreme-SDK PR #1920 / merge `ba62378289faa7c72e595793839389f71ba21923`
- current SCREEN Safety candidate: Vextreme-SDK PR #1915 / head `fb71627dd1a5d7b58b98a0457876e2b49f86d58c`
- `docs/architecture/vex-body-vision-screen-held-integration.md`
- `docs/architecture/perception-session-screen-owner-binding.md`
- `docs/architecture/macos-screen-permission-agent.md`
- `docs/architecture/perception-broker-screen-adapter.md`
- `docs/private-continuity/vex-body/vision/screen-permission/current.json`
- `docs/private-continuity/vexlocalbridge/model-runtime-adapter-registry.json`
- `lib/vexlocalbridge/mlx-persistent-runtime-owner.js`
- VexWork Security Assurance: `projects/vex-security-assurance/ADVERSARIAL-LENS.md`
- current Partner architecture pressure: VexWork PR #267 / head `8b6732fa20c8c72bf99faa0c237f580b74813adc`
- current executable Partner candidate: VexLife-Android PR #219 / head `356baa6fe4ef1577a287da48de0ce758ed793653`

<!-- [VXG RealForever][VEXLIFE][NEW-BEGINNINGS][VISION-COMPANION][REAL-BROWSER-WITNESS] -->
