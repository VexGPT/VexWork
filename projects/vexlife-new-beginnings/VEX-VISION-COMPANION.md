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

Current accepted Vextreme-SDK source after the SCREEN Safety currentization:

~~~text
vgong24/Vextreme-SDK
main       d738fe44612575a4ba2404368c1bfa8821d46cd3
checkpoint d738fe44612575a4ba2404368c1bfa8821d46cd3
source PR  #1915 accepted / merged
baseline   #1920 accepted / merged
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

Historical October grants and the November 7 Safety-currentization receipts remain provenance. They are
not the current foreground work boundary.

Current accepted Vextreme-SDK main/checkpoint is:

~~~text
c39951fe260e505b4a3c5b8f606cc8da14c985c0
~~~

That accepted source now contains the bounded USER_SELECTED_SESSION route, its exact receipt validation,
the canonical Security active-sharing witness, and Perception's content-absent active VISUAL observation
integration.

The unfinished work is **ordinary Product reachability**, not re-establishing those accepted source
relationships.

Permanent:

~~~text
SDK_SOURCE_ACCEPTED
!= PRODUCT_EFFECT_REACHABLE

SOURCE_ORCHESTRATION
!= LIVE_CAPTURE_AUTHORITY

CURRENT SAFETY AT RUNTIME
!= STANDING SCREEN AUTHORITY
~~~

The Process Factory product-runtime seam must resolve current Safety at the time of the attempt and
return HELD without helper launch when Safety is not current. Source implementation/proof does not
itself present the picker or perform capture.

## Current macOS user-selected system-picker route

The first real host route remains **explicit user-selected session sharing**:

~~~text
Vision LookNow
-> macOS SCContentSharingPicker
-> Victor chooses exactly one window in OS-owned UI
-> session-bound SCContentFilter
-> at most one SCScreenshotManager capture
-> exact request/session/connection-bound Process Factory receipt
-> canonical Security witness
-> canonical Perception active VISUAL observation
~~~

This route is now accepted SDK source, not a pending #1924 candidate.

Accepted current chain on SDK main:

~~~text
macOS USER_SELECTED_SESSION route       accepted
Security active-sharing witness         accepted
Perception active VISUAL integration    accepted
SDK main                                c39951fe260e505b4a3c5b8f606cc8da14c985c0
~~~

The current missing SDK edge is PR #1939:

~~~text
github.pull.vextreme-sdk.1939
branch = VXG-111026-chatgpt-vexlife-vision-product-runtime
head   = bc9b093b61b7ac5009f612d78c703ea431c19f5d
changedFiles = 0
~~~

That PR is a claim-established source-writer scaffold for the exact three-path Process Factory
orchestration contract. It does not reopen the accepted picker/capture owners and it does not yet earn
distribution, Product service wiring, or live Product capture.

Permanent:

~~~text
PRODUCT_REQUEST_ID != PROCESS_SESSION_ID
PRODUCT_REQUEST_ID != CONNECTION_ID

SCREEN_CAPTURED != ACTIVE_VISUAL_OBSERVATION
ACTIVE_VISUAL_OBSERVATION != VISUAL_MODEL_INPUT
OBSERVATION != MEMORY
MEMORY != TRAINING
~~~

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

VexCgmLabs / VexPartner has now crossed its accepted VexWork architecture threshold and materially
improves the Vision design.

~~~text
accepted architecture threshold
  VexWork PR #267 / accepted VexCgmLabs source

consumer/application evidence
  VexLife-Android PR #219
~~~

Vision consumes the accepted relationship roles without turning the CGM-specific implementation into
a universal product owner.

The important current pattern is:

~~~text
VexPartner<Partner>
├─ Source<Partner>
├─ Signal<Partner>
└─ Connection<Partner, Signal>
   ├─ Id<Partner>
   ├─ Conversion<Input, Partner, Signal>
   ├─ Observation<Partner, Signal>
   └─ Receiver<Partner, Signal, exact Observation>

Receiver-admitted truth
-> Store only when durability is actually earned
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

source.screen.user-selected.current-session
    = Partner.Source
    != Connection.Id

macOS system picker / capture mechanism
    = Connection realization

SCContentFilter
    = provider/system selection input

platform frame / capture representation
    -> Connection.Conversion
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

## Product-side decision currentization — semantic/control slice accepted

The Product-side Vision semantic/control slice is no longer merely a candidate.

Accepted VexLife-Prod:

~~~text
PR #54 merged
merge/main at acceptance = 92abc26e6acd2f6604d921c259da6d40950a0f10

VexLifeVisionFamily
  State   Held | Ready | Looking
  Control LookNow
  Effect  RequestSnapshot

generated presentation
  Vision · Held
  disabled
~~~

A024 then promoted that accepted Vision main into the running Product while preserving the current
Conversation head and healthy Heretic runtime:

~~~text
github.pull.vexlife-prod.54.comment.6761261558
disposition = PASS
Vision capture = false
visual model input = false
~~~

Therefore the child Work item:

~~~text
work.vexlife.new-beginnings.vision-companion-product-surface
~~~

is complete as the **truthful semantic/control surface**.

Current VexLife-Prod main has since advanced to:

~~~text
3eca5055f34b4a9807d0b3d117e6131e51e4c788
~~~

for later Evolution/G03 work. The Vision Family remains accepted, but Product service files changed
after the Vision merge. When the later Product service bridge is earned, it must re-ground against
current Product service source rather than coding from historical PR #54 service assumptions.

Permanent:

~~~text
PRODUCT_VISION_SEMANTIC_SOURCE_ACCEPTED
!= PRODUCT_RUNTIME_BRIDGE_REACHABLE
!= SCREEN_CAPTURE_ACTIVE
!= VISUAL_MODEL_INPUT
~~~

## Current bounded product slice — persistent scope, demand-driven look

The smallest useful active experience is **not continuous screen sharing** and it is **not one screenshot on every Conversation turn**.

The persistent relationship is the selected Vision scope:

~~~text
Victor engages Vision
-> selects one browser/window scope once
-> VexLife keeps that selected scope visibly identifiable
-> ordinary scrolling/navigation changes what is currently present
-> no continuous frame accumulation is required

Conversation turn
-> current turn/context owner asks whether Vision is materially relevant
-> if not relevant: no screen capture
-> if relevant:
     request one fresh observation of the CURRENT selected scope
     -> visible looking-now pulse
     -> at most one current frame capture
     -> raw frame remains ephemeral
     -> visual worker derives one bounded visual observation
     -> derived visual meaning may join Conversation Context
     -> Vex responds
     -> raw frame is discarded
~~~

Permanent:

~~~text
VISION_SCOPE_ACTIVE
!= SCREEN_CAPTURE_ACTIVE
!= MODEL_INFERENCE_ACTIVE
!= MEMORY_ACCEPTED

CONVERSATION_TURN
!= AUTOMATIC_SCREENSHOT

SCROLLING_WITHIN_SCOPE
!= SCREEN_HISTORY_RETENTION
~~~

This preserves the human experience Victor clarified on VexWork PR #275 comment 6820602965: the
selected scope remains available to Vex, while the pixels are sampled only when the current turn
actually needs vision.

Conversation may naturally preserve what Vex **said** after looking. That does not turn the raw frame
or the Vision state machine into Conversation history, and it does not promote derived visual meaning
into durable Memory by implication.

Human-visible feedback should distinguish the layers:

~~~text
quiet persistent boundary
  = this is the currently engaged Vision scope

brief stronger pulse
  = Vex is actually obtaining the fresh current observation now
~~~

The current SDK PR #1945 transient target indicator remains useful one-shot feedback work. It does not
by itself establish the later persistent-scope product state.

A continuous frame stream remains a separately earned product/security decision. It is not required
for this conversational Vision relationship.

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

The parent Work remains:

~~~text
work.vexlife.new-beginnings.vision-companion-real-browser-witness
state              RUNNING
priority           HIGH
workDisposition    ACTIVE
authority          NO_AUTHORITY
effects            NO_EFFECTS
~~~

Completed children now include:

~~~text
work.vexlife.new-beginnings.vision-companion-product-surface
state = COMPLETED

work.vexlife.new-beginnings.vision-product-runtime-orchestration
state = COMPLETED
~~~

The PR1939-era Process Factory orchestration, recovery/currentization and darwin-arm64 carriage source
have been accepted. Product carriage/service/presentation have also advanced through VexLife-Prod
PR #77, #84, #86 and #90.

Current child:

~~~text
work.vexlife.new-beginnings.vision-scope-current-context
state              READY
priority           HIGH
authority          NO_AUTHORITY
effects            NO_EFFECTS
~~~

Human outcome:

~~~text
persistent selected Vision scope
+ no continuous frame accumulation
+ Vex chooses to look only when the current turn materially needs vision
+ one fresh current snapshot when requested
+ bounded derived visual observation
+ Conversation Context composition
+ Observation != Conversation history != durable Memory
~~~

Current external coordinates at this currentization:

~~~text
Vextreme-SDK main
55a9cd5a99eaaf9f17f7c3875b109548fdc31d81

VexLife-Prod main
37812f5717a34ec87c76667165f3c11642de0440

SDK PR #1945
open current lived-feedback correction
selected-target transient outline
SourceOwner A001 stopped in Swift proof-harness/toolchain binding
candidate defect not established
next = corrected A002 proof formation
~~~

The next implementation sequence is:

1. preserve/finish PR #1945 only as the current one-shot target-feedback correction it actually owns;
2. descend from this Work item to the current VexLife-Prod Vision Family, DirectPromptContext and SDK
   Safety / Process Factory / Perception owners;
3. source-place persistent selected-scope state without making that state mean active capture;
4. make turn/context composition request a fresh visual observation only when the current human turn
   materially benefits from vision;
5. separately earn ephemeral visual-model input / derived visual meaning;
6. compose that derived meaning into canonical Conversation Context without automatic Memory
   promotion;
7. prove the lived flow by selecting once, scrolling/changing visible content, asking a vision-relevant
   question without another picker interaction, and observing that Vex answers from the then-current
   screen.

No new Project, Vision Store, standing screen listener or continuous-capture path is earned by this
currentization.

## Source descent after persistent-scope currentization

The current accepted one-shot implementation cannot satisfy persistent selected scope merely by
changing Product state.

Current SDK mechanics are explicit:

~~~text
macos-screen-system-picker-agent.swift
  OneShotSystemPickerSession
  -> picker selection
  -> one SCScreenshotManager capture
  -> picker disabled
  -> observer removed
  -> helper process terminates

vexlife-vision-runtime
  -> one requestRef
  -> one helper execution
  -> one Product result
  -> runtime executable exits
~~~

Therefore:

~~~text
VisionFamily.State says "Engaged"
!= selected macOS scope actually remains available

PERSISTENT_SCOPE
-> requires a rightful host/session owner
~~~

The selected provider identity must not be moved into Product Conversation/Memory simply to survive the
one-shot process. The current source-owner question is routed to Process Factory:

~~~text
github.issue.vextreme-sdk.241.comment.6820899602
~~~

Proposed first responsibility is a bounded selected-scope session whose provider selection remains
host-local and which performs no capture while merely ENGAGED.

The exact Safety question is routed to:

~~~text
github.issue.vextreme-sdk.226.comment.6820900304
~~~

The intended separation is:

~~~text
scope selected / engaged
  != sensor active
  != capture active
  != active visual observation

actual LOOK
  -> fresh current SCREEN authority
  -> at most one snapshot
~~~

No continuous-ephemeral mode is requested by this product intention.

### "Vex decides to look" is a separate missing seam

Current VexLife-Prod Capability Atlas is an effect-free self-frame. It tells Vex what capability truth
is available but explicitly does not execute capabilities.

Current direct inference also records:

~~~text
nativeToolExecutionObserved = false
~~~

and DirectCompanionTurn currently materializes context before the single provider invocation.

Therefore:

~~~text
CAPABILITY_VISIBLE_TO_VEX
!= VEX_CAN_CALL_CAPABILITY_DURING_TURN
~~~

Do not implement the clarified human intention by making DirectPromptContext automatically capture a
screen on every Conversation turn. That would transfer the decision from Vex to prompt construction
and violate:

~~~text
CONVERSATION_TURN != AUTOMATIC_SCREENSHOT
~~~

After selected-scope session ownership is accepted, the next composition question is the smallest
lawful seam by which Vex may request one current visual observation during the same human turn.

Preferred judgment pressure:

~~~text
existing capability/execution seam if current source owns one
-> reuse it

otherwise
-> add the smallest Vision-specific request/observation continuation earned by this lived use

do not create a generic tool framework solely for symmetry
~~~

Whichever realization is selected must preserve:

~~~text
Vex requests LOOK
!= Vex grants itself SCREEN authority

fresh Safety still gates capture
screen content remains untrusted observation
derived visual meaning may enter Conversation Context
raw pixels do not become Conversation or Memory
Memory promotion remains separate
~~~

Current authoring boundary:

~~~text
VexWork continuity/source = CURRENTIZED on PR #275
Process Factory placement request = POSTED
Safety boundary question = POSTED
new SDK source mutation = NOT YET ADMITTED
PR #1945 one-shot target-feedback correction = separate current work
~~~

This is a source/authority hold, not an architecture unknown.

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

Foreground Work truth:

- VexWork PR #275 — existing Vision/New Beginnings Work source candidate and provider conversation;
- `work.vexlife.new-beginnings.vision-companion-real-browser-witness` — parent Work coordinate;
- `work.vexlife.new-beginnings.vision-companion-product-surface` — completed semantic/control child;
- `work.vexlife.new-beginnings.vision-product-runtime-orchestration` — completed Process Factory orchestration child;
- `work.vexlife.new-beginnings.vision-scope-current-context` — current next Work coordinate.

Current SDK truth:

- accepted main/checkpoint: `55a9cd5a99eaaf9f17f7c3875b109548fdc31d81`;
- Product runtime orchestration/recovery/carriage source accepted through PR #1939-#1942;
- SCREEN Safety currentization accepted through PR #1943/#1944;
- PR #1945 is the current one-shot selected-target feedback correction;
- PR #1945 SourceOwner A001 stopped in the Swift proof harness before candidate semantics were proven wrong;
- corrected A002 proof formation is the immediate SDK proof continuation.

Current Product truth:

- VexLife-Prod Vision semantic/control source is accepted;
- private-image carriage, local-user-selected distribution separation, Product service bridge and live
  presentation are accepted through PR #77, #84, #86 and #90;
- current Product main:
  `37812f5717a34ec87c76667165f3c11642de0440`.

Current architecture sources to descend for the new Vision-scope edge:

~~~text
VexLife-Prod
  docs/foundation/VEXLIFE-VISION-COMPANION.md
  src/commonMain/kotlin/vexlife/vision/VexLifeVisionFamily.kt
  src/jvmMain/kotlin/vexlife/companion/DirectPromptContext.kt

Vextreme-SDK
  docs/architecture/perception-session-authorization.md
  docs/architecture/macos-screen-system-picker-product-runtime.md
  lib/vex-perception-broker/screen-system-picker-active-integration.js
~~~

Older #1915/#1924/#1939-era coordinates remain provenance for how the route was earned. They are not
the current next-work coordinate.

<!-- [VXG RealForever][VEXLIFE][NEW-BEGINNINGS][VISION-COMPANION][REAL-BROWSER-WITNESS] -->

