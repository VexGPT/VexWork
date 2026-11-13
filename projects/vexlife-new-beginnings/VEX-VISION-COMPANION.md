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
state              RUNNING
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

SDK PR #1946
open draft selected-scope Process Factory contract
exact 3-new-path candidate
SourceOwner proof = PENDING
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
Safety disposition = github.issue.vextreme-sdk.226.comment.6821018321
Process Factory placement = github.issue.vextreme-sdk.241.comment.6821025379
Operations current-entry = github.issue.vextreme-sdk.223.comment.6821036077
Root writer allocation = github.issue.vextreme-sdk.1574.comment.6821041312
writer claim = github.issue.vextreme-sdk.1574.comment.6821060489
SDK source candidate = github.pull.vextreme-sdk.1946
source authoring state = RUNNING
SourceOwner proof = PENDING
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


## Forward convergence after Main Integrity recovery — PR #1947

PR #1946's exact selected-scope source reached SourceOwner PASS, fresh Assurance CLEAR, Formal Review APPROVE, lifecycle currentness, READY and OwnerMergeDuty. Its ordinary merge was then recovered by Main Integrity because the merge commit title omitted the required `[VXG-ROOT-MERGE]` prefix.

That recovery is integration-protocol evidence, not a semantic rejection of the three source files.

Current live SDK coordinates:

~~~text
recovered main/checkpoint
552e9e88cdc8fb2509e4517f92cf21d9bcfedd31

forward PR
#1947
branch=VXG-111226-vexlife-vision-selected-scope-session-forward-a001
base=552e9e88cdc8fb2509e4517f92cf21d9bcfedd31
head=40b54c8448d13065502e20c270887b06fab78533
tree=03b07a139718b55a73b90f00fd51825906d4db85
paths=3 exact
~~~

The forward tree is byte-identical to the prior reviewed PR #1946 tree. The new commit identity still requires fresh exact-head SourceOwner / Assurance / lifecycle. No semantic redesign is implied.

Future merge duty must use an ordinary merge title beginning:

~~~text
[VXG-ROOT-MERGE]
~~~

Current next edge:

~~~text
PR1947 ExactHeadSourceOwnerProof
-> fresh Independent Assurance
-> Formal Review / lifecycle currentness
-> READY
-> OwnerMergeDuty
-> exact-head ordinary merge with [VXG-ROOT-MERGE] title
-> post-merge verification
~~~

## End-to-end Vision relationship — current design anchor

This section currentizes the foreground trajectory after the earlier PR #1947-era notes above. Where an
older resume/current-coordinate section conflicts with this one, this section owns the newer Work
navigation projection. Older sections remain provenance for how the relationship was earned.

The human outcome is not "screen capture" and it is not "make Vex multimodal" in the abstract.

It is one lived relationship:

~~~text
Victor uses an ordinary browser normally
-> Victor explicitly engages one bounded Vision relationship
-> macOS presents the system-owned picker
-> Victor selects one window/scope once
-> that scope remains visibly selected while engaged
-> scrolling/navigation changes what is currently present there
-> NO continuous frame accumulation
-> NO automatic screenshot merely because a Conversation turn exists

Victor continues talking with Vex
-> the current turn may or may not materially need vision

if vision is not materially needed:
  -> no capture
  -> Conversation continues normally

if Vex materially needs current visual evidence:
  -> Vex lawfully requests LOOK
  -> current SCREEN Safety is checked
  -> one fresh observation is made from the CURRENT selected scope
  -> the human sees brief "looking now" feedback
  -> raw pixels exist only ephemerally
  -> a bounded visual worker derives visual meaning
  -> raw pixels are discarded
  -> derived visual meaning may join this turn's canonical Conversation Context
  -> the SAME Conversation turn continues
  -> Vex responds from the newly admitted current context

what Vex says
  -> may remain ordinary canonical Conversation history

selected Vision scope
  -> remains Vision current state

durable Memory
  -> remains a separately governed/admitted relationship
~~~

The product distinction is therefore:

~~~text
PERSISTENT
  = selected Vision relationship / scope

EPHEMERAL
  = one actual current frame / physical observation

TURN_SCOPED
  = bounded derived visual meaning used by the current Conversation when admitted

DURABLE
  = only truth separately admitted by another rightful owner
~~~

Permanent:

~~~text
VISION_SCOPE_ENGAGED
!= SCREEN_CAPTURE_ACTIVE
!= MODEL_INFERENCE_ACTIVE
!= MEMORY_ACCEPTED

CONVERSATION_TURN
!= AUTOMATIC_SCREENSHOT

SCROLLING_OR_NAVIGATION_WITHIN_SCOPE
!= SCREEN_HISTORY_RETENTION

VEX_REQUESTS_LOOK
!= VEX_GRANTS_ITSELF_SCREEN_AUTHORITY

RAW_FRAME
!= CONVERSATION_HISTORY
!= MEMORY
~~~

### VexArchitecture grounding — ownership rather than a forced class template

Current design grounding:

~~~text
https://vgong24.github.io/Vextreme/pages/vexarchitecture-first-stable-body.html
https://vgong24.github.io/Vextreme/pages/vexarchitecture-live-demonstration.html
~~~

The relevant VexArchitecture lesson is not to copy a diagram. It is to keep each question with the
rightful owner and let repeated relationships earn reusable architecture.

~~~text
Family
  owns semantic/product meaning

Execution
  owns active custody of one admitted attempt

outside/provider/platform truth
  remains independently owned

Partner
  is available only when an independently-owned external participant genuinely earns that grammar

Store
  is earned only when durable admitted truth exists

Relay / convergence
  appears only when independently-owned truths need a new relationship truth

Presentation
  returns bounded meaning to the human
~~~

Target responsibility mapping for this Vision experience, with source status kept explicit:

~~~text
ACCEPTED CURRENT SEMANTIC OWNER
VexLifeVisionFamily
  owns the existing one-shot Vision product meaning and lawful Control -> Act / Effect relationships
  -> persistent-scope vocabulary is NOT yet accepted
  != native window identity
  != SCREEN authority
  != process lifetime
  != visual interpretation
  != Conversation
  != Memory

DESIGN TARGET / EXISTING-SEAM QUESTION
VexExecution / bound Method
  should own one admitted live realization attempt when the Product earns the LOOK continuation
  -> exact current reusable seam must be established from source before implementation
  != semantic State
  != outside truth

PR #114 CANDIDATE RESPONSIBILITY
VexLife-Prod service
  would own one long-lived carried Vision runtime child
  + transport / command correlation / bounded projection validation
  != selected-scope session owner
  != native provider owner
  != capture authority
  != LOOK semantic owner
  != visual worker
  != Conversation owner

ACCEPTED SDK RESPONSIBILITY
Vextreme-SDK Process Factory selected-scope session / host custody
  owns actual selected-scope lifecycle and native custody below Product
  -> may retain the provider/filter/host objects needed for the scope to remain available
  -> performs no capture merely because scope is ENGAGED

ACCEPTED AUTHORITY OWNER / FUTURE LOOK CONSUMER
Vex Safety / SCREEN owner binding
  owns current capture authorization/currentness
  -> actual persistent-scope LOOK must consume fresh current Safety
  -> prior ENGAGE does not mint standing capture authority

FUTURE LOOK REALIZATION
physical frame acquisition
  should own one bounded outside-world occurrence
  != visual interpretation
  != semantic State
  != Memory

FUTURE VISUAL-INTERPRETATION OWNER
visual worker
  should own bounded interpretation of one admitted frame
  != sensor authority
  != Conversation ownership
  != Memory authority

FUTURE CONVERGENCE
Conversation Context
  may converge current Conversation truth + admitted derived visual meaning for this turn
  != Vision State owner
  != automatic durable Memory

FUTURE PERSISTENT-SCOPE PRESENTATION
Presentation
  must eventually distinguish:
    quiet persistent selected-scope indication
    from
    brief stronger "Vex is looking now" indication
~~~

Do not create a Vision Store merely because a frame exists:

~~~text
RAW FRAME OBSERVED
!= STORE REQUIRED
~~~

Do not force the selected browser/window into VexPartner merely because the relationship resembles
Partner. The current architectural pressure is:

~~~text
independently-owned selected browser/window reality
-> candidate external participant

macOS selected-scope realization
-> candidate Connection-shaped relationship

one exact capture occurrence
-> candidate Observation-shaped relationship

but:
RECOGNIZABLE_PARTNER_SHAPE
!= PARTNER_TYPE_EARNED
~~~

If implementation pressure proves the reusable external-participant grammar, consume VexPartner then.
Otherwise preserve the smallest truthful Vision-owned relationship.

### Current semantic pressure — Family evolution is not yet frozen

Current accepted Product source still carries the earlier one-shot semantic Family:

~~~text
VexLifeVisionFamily

State
  Held
  Ready
  Looking

Control
  LookNow

Effect
  RequestSnapshot
~~~

The persistent-scope Product bridge does not silently redefine that Family. The eventual Family
evolution must be earned from the lived relationship and current source.

Likely semantic questions include:

~~~text
what does OFF mean?
what does READY mean when a persistent scope can be engaged?
what current truth means selecting?
what current truth means engaged?
what Control means stop sharing?
what Control means look now?
what semantic State is visible while one LOOK attempt is active?
what held state follows stale/revoked Safety or lost scope?
~~~

Candidate vocabulary such as Engaged / Selecting / Stop / Look is design pressure, not accepted source
merely because it is easy to name.

### The critical post-scope seam — Vex decides to LOOK during the same turn

Current VexLife-Prod source makes the missing relationship concrete:

~~~text
DirectPromptContext
-> materializes bounded Context before the single provider invocation

Capability Atlas frame
-> tells Vex what capability truth is available
-> grants no effect authority by itself
~~~

Therefore:

~~~text
CAPABILITY_VISIBLE_TO_VEX
!= VEX_CAN_CALL_CAPABILITY_DURING_TURN
~~~

Do not realize the human intention as:

~~~text
every human message
-> prompt construction automatically captures a screenshot
-> visual meaning is injected before Vex decides whether it needs vision
~~~

That would move the decision from Vex/semantic execution into prompt construction and violate:

~~~text
CONVERSATION_TURN
!= AUTOMATIC_SCREENSHOT
~~~

Current implementation-design pressure is instead:

~~~text
human request
-> ordinary bounded Conversation context / initial reasoning
-> Vex determines that current visual evidence is materially needed
-> lawful Vision LOOK Control / Act / Effect
-> bound Vision Method
-> VexExecution owns the attempt
-> Product persistent Vision service
-> accepted selected-scope owner
-> fresh current SCREEN Safety
-> at most one current frame
-> bounded visual interpretation
-> derived visual meaning
-> canonical Conversation Context convergence
-> same turn resumes / continues
-> final Vex response
~~~

First search for an already-accepted execution/continuation seam that truthfully owns this relationship.
If none exists, add the smallest Vision-specific continuation earned by this experience.

Do not create a generic tool framework solely because this resembles model tool use.

~~~text
ONE VISION-SPECIFIC EARNED CONTINUATION
!= GENERIC AGENT TOOL FRAMEWORK REQUIRED
~~~

#### Concrete current-source precedent — one bounded same-turn continuation already exists

Fresh Product-source descent found an existing current pattern in `DirectCompanionTurn` /
`DirectConversationSourceReturn`:

~~~text
initial prompt
-> source-return protocol is available as one typed internal control
-> first local-model inference

if the model answers normally:
  -> complete the turn normally

if the model emits the exact source-return control:
  -> do not expose that control as the human answer
  -> deterministically discover/re-open exact canonical Conversation source
  -> rematerialize the prompt with the returned source
  -> disable another source-return request
  -> perform one final provider inference
  -> persist only the final human-facing response + bounded source-return trace
~~~

Current source explicitly bounds this relationship:

~~~text
one internal source-return request per human turn
effectAuthorityGranted = false
effectsPerformed = false
returned source != Memory
returned source != semantic acceptance
final inference cannot request source again
~~~

This is strong implementation evidence for the **shape** of same-turn Vision continuation:

~~~text
MODEL_REQUESTS_MORE_CURRENT_CONTEXT
-> Product intercepts one exact internal control
-> rightful owner obtains the missing context
-> Product rematerializes exact current prompt/context
-> one final inference answers the same human turn
~~~

But the ownership difference is material:

~~~text
CONVERSATION_SOURCE_RETURN
= read-only canonical source acquisition
= no effect authority

VISION_LOOK
= real sensor/effect request
= requires current semantic admission + current SCREEN authority + physical observation
~~~

Therefore do **not** copy `DirectConversationSourceReturn` and call Vision read-only context.

The likely smallest Product design is:

~~~text
Capability Atlas
-> may describe current Vision LOOK requestability/held state
-> still grants no effect authority

initial provider stage
-> may emit one exact Vision LOOK internal request when current vision is materially needed

DirectCompanionTurn
-> recognizes the internal request
-> does NOT capture directly
-> routes it to the rightful Vision semantic/effect realization

Vision semantic owner
-> resolves the request against exact current Vision State

Vision effect realization
-> re-observes current selected scope
-> re-observes fresh SCREEN Safety
-> performs at most one admitted LOOK
-> returns bounded derived visual context or one truthful held/failure result

DirectCompanionTurn
-> rematerializes the current prompt with the bounded Vision return
-> disables repeat Vision LOOK for the final stage
-> performs one final inference
-> commits one canonical human/Vex turn
~~~

Current VexLife-Prod source has **no `VexExecution` implementation**. Its portable
`VexFamilyContract` deliberately owns semantic `Act` / `Effect` meaning and explicitly owns no
execution machinery.

Therefore:

~~~text
VEXARCHITECTURE_EXECUTION_LAW
= useful design constraint

CURRENT_PRODUCT_VEXEXECUTION_CLASS
= ABSENT

ABSENT_VEXEXECUTION_CLASS
!= PORT_ANDROID_VEXEXECUTION_BY_DEFAULT
~~~

The implementation should first pressure the existing `DirectCompanionTurn` continuation owner and
the exact Vision effect owner. A Product-local execution abstraction is earned only if a repeated
custody/overlap/failure question appears that those current owners cannot truthfully answer.

One new design question is now explicit:

~~~text
current source already permits one Conversation source-return continuation

Vision adds a second possible internal continuation kind

QUESTION:
  does one human turn admit only one internal continuation total,
  or can independently bounded source-return + Vision LOOK both occur?

DO NOT ANSWER BY GENERIC TOOL LOOP.
Ground the smallest truthful arbitration from lived/product pressure.
~~~

The first Vision implementation should fail closed on ambiguous/multiple internal controls rather than
silently executing more effects than one bounded turn admitted.

### Source-derived implementation decomposition after end-to-end review

Fresh source descent across the accepted SDK selected-scope owners and current Product Conversation
owners makes the remaining implementation boundaries more concrete.

This is a design decomposition, not a claim that the later source slices are already admitted.

#### 1. Accepted selected-scope session already owns LOOK intent semantics

Accepted SDK source:

~~~text
lib/process-factory/macos-screen-selected-scope-session.js
~~~

already exports:

~~~text
requestMacosScreenSelectedScopeLook(...)
completeMacosScreenSelectedScopeLook(...)
~~~

and owns:

~~~text
ENGAGED
+ requestRef
+ fresh current SCREEN Safety
-> LOOKING
-> bind transient current Safety refs

LOOKING
+ matching requestRef
+ fresh current SCREEN Safety
-> ENGAGED
-> clear transient LOOK binding
~~~

The Product-safe projection already distinguishes:

~~~text
LOOKING
lookingIndicatorRequired=true
lookRequestRefOrNull=<exact current LOOK>
fresh LOOK Safety refs

while still:
screenCaptureAuthorized=false
captureExecutionAuthorized=false
requestReplayProtectionEstablished=false
captureExecutionRequiresSingleUseEffectReservation=true
~~~

Therefore the next native LOOK slice must consume this accepted state owner rather than inventing a
second LOOK state machine.

#### 2. Persistent native host currently has no LOOK/capture command surface

Accepted current host source:

~~~text
lib/process-factory/macos-screen-selected-scope-host-custody.js
lib/process-factory/macos-screen-selected-scope-agent.swift
~~~

currently proves the non-capturing persistent relationship:

~~~text
Node custody child stdio = ['ignore', 'pipe', 'pipe']
native helper receives no stdin commands
native helper contains no SCScreenshotManager
native helper retains:
  SCContentFilter
  one unstarted SCStream

SCStream.startCapture = forbidden in this slice
raw pixel access = absent
~~~

The Product-facing Process Factory runtime also intentionally admits only:

~~~text
ENGAGE
PROJECT
RECONCILE
STOP
SHUTDOWN
~~~

and explicitly rejects LOOK.

Therefore:

~~~text
SESSION_LOOK_SEMANTICS_ACCEPTED
!= PERSISTENT_NATIVE_LOOK_REALIZATION_EXISTS
~~~

The smallest later SDK source question is not "how does Product capture a screen?" It is:

> How does Process Factory bind one already-admitted LOOKING request to the retained native selected
> scope, consume the rightful single-use capture reservation, perform at most one current snapshot,
> and settle the existing session back to ENGAGED without exporting native provider identity upward?

Likely implementation pressure:

~~~text
host custody
-> gain one bounded LOOK operation

native selected-scope helper
-> gain one exact bounded inbound LOOK command channel
-> reuse retained SCContentFilter
-> SCScreenshotManager.captureImage(...)
-> no picker replay
-> no SCStream.startCapture
-> emit one request-bound result/evidence
~~~

The exact command/pipe schema and effect-reservation binding remain to be source-placed before mutation.

Do not infer that the generic continuity effect-transaction implementation is automatically the
rightful SCREEN replay owner merely because both use "effect reservation" language. Bind the exact
existing single-use effect owner or form the smallest supported Vision-specific placement from live
source.

#### 3. The accepted one-shot capture route does not contain a hidden raw-image/VLM pipeline

The accepted one-shot system-picker helper:

~~~text
lib/process-factory/macos-screen-system-picker-agent.swift
~~~

does currently use:

~~~text
SCScreenshotManager.captureImage(...)
~~~

but then only:

~~~text
CGImage provider bytes
-> SHA-256 + dimensions
-> content-absent capture receipt
-> bytes discarded
~~~

It does not base64-encode, write, retain or pass image bytes upward.

The accepted Perception integration then forms only:

~~~text
content-absent VISUAL observation identity
+ frame digest/dimensions
+ exact Security witness
~~~

while preserving:

~~~text
rawBytesIncluded=false
rawRetentionAllowed=false
visualModelInputAuthorized=false
memoryAccepted=false
~~~

Therefore:

~~~text
SCREEN_CAPTURE_PATH_EXISTS
!= VISUAL_INTERPRETATION_PATH_EXISTS
~~~

The persistent LOOK executor may reuse the accepted one-shot capture behavior/invariants where they
still fit, but visual-model input is a separate earned boundary.

#### 4. VLM vocabulary exists; a current image-inference worker does not

Current SDK VexLocalBridge registry recognizes:

~~~text
MLX_VLM_DIRECT_RUNTIME
~~~

and explicitly preserves:

~~~text
MLX_VLM_DIRECT_RUNTIME != MLX_LM_DIRECT_RUNTIME
VLM_COMPATIBLE != IMAGE_INFERENCE_PERFORMED
VISION_TOWER_PRESENT != VISION_INPUT_AUTHORIZED
MULTIMODAL_INPUT_AVAILABLE != SENSOR_AUTHORITY
RUNTIME_ADAPTER != PERCEPTION_BROKER
RUNTIME_ADAPTER != VEX_VISION
~~~

The current generic RuntimeAdapter source is a reference/qualification gate with effect authority
false. It is not a current qualified Product visual worker and it does not define a live raw-image
transport.

Therefore the visual-interpreter slice must separately establish:

~~~text
one exact VLM/model profile + artifact custody
one qualified local visual runtime
one bounded image-input contract
one bounded derived-meaning output contract

while preserving:
capture authority remains elsewhere
raw bytes are not persisted
raw bytes do not enter Product Conversation
raw bytes do not become Memory
training/publication remain false
~~~

The exact ephemeral byte transport is intentionally not frozen here. The rightful implementation must
keep native/provider identity below Process Factory and must not route raw pixels through Product merely
because Product owns Conversation.

#### 5. Product same-turn continuation can reuse an existing orchestration shape without inheriting read-only authority

Current Product already owns one bounded same-turn source-return continuation in
`DirectCompanionTurn`.

Current `DirectCompanionTurn.Hooks` also already injects turn-local currentness/effect dependencies
such as model transport, current runtime evidence, current Memory and time.

Current PR #114 Product construction separately owns the persistent `VisionRuntime` lifetime in
`VexLifeProdLocalService`.

That creates a natural dependency direction:

~~~text
VexLifeProdLocalService
  owns persistent VisionRuntime lifetime
  -> supplies one bounded Vision continuation dependency to DirectCompanionTurn

DirectCompanionTurn
  owns same-turn orchestration
  -> never discovers/owns the service runtime itself
~~~

A future Product continuation can therefore be shaped as:

~~~text
before initial provider stage:
  service-owned Vision dependency projects current scope truth
  -> bounded capability fact enters DirectPromptContext / Capability Atlas

Capability Atlas:
  capability.vexlife.vision.look-current   # candidate identity, not accepted source
  canonicalStage = REQUESTABLE             # candidate stage
  effectAuthorityGranted = false

initial model inference:
  may answer normally
  OR emit one exact internal "current visual context needed" control

internal control:
  contains no native/provider/window identity
  contains no SCREEN authorization
  contains no effect reservation
  does not itself mint effect authority

DirectCompanionTurn:
  recognizes the internal request
  mints/binds the Product-side request identity to this exact turn
  -> asks the Vision semantic/effect owner to admit/realize it

Vision owner:
  exact current semantic State
  + request
  -> lawful Effect or truthful held result

effect realization:
  accepted persistent selected scope
  + fresh SCREEN Safety
  + single-use capture reservation
  -> at most one current snapshot
  -> bounded visual interpretation
  -> bounded derived visual meaning / provenance

DirectCompanionTurn:
  rematerializes final prompt with bounded derived visual context
  -> disables repeat LOOK request
  -> one final provider inference
  -> one canonical human/Vex Conversation turn
~~~

The candidate Capability Atlas identity/stage above is design pressure, not yet source. The important
law is:

~~~text
MODEL_CAN_KNOW_LOOK_IS_REQUESTABLE
!= MODEL_HAS_CAPTURE_AUTHORITY
~~~

#### 6. Turn evidence should preserve provenance without silently persisting visual content

Current `DirectTurnContextStore` persists:

~~~text
final prompt materialization receipt
runtime observation / invocation evidence
bounded sourceReturnTrace when used
raw provider response = not persisted
raw reasoning = not persisted
~~~

A future Vision continuation can follow that evidence shape without copying SourceReturn semantics:

~~~text
visionLookTrace candidate:
  turn-bound Product LOOK request identity
  scopeSessionRef or bounded source identity only if Product-safe
  capture/visualObservation refs
  frame digest + dimensions when already accepted metadata
  derived-meaning hash / result ref
  visual runtime/model profile refs
  rawBytesPersisted=false
  rawFileWritten=false
  memoryAccepted=false
  trainingEligible=false
~~~

The actual raw frame must never be serialized into Conversation Context merely to prove that it was
used.

Whether the derived visual text itself should remain transient with only its hash/provenance in
canonical turn Context, or whether an exact bounded derived-meaning object should be retained as
turn-scoped Context, remains an explicit design decision for the visual-worker/Conversation boundary.

~~~text
TURN_CONTEXT_PROVENANCE
!= DURABLE_MEMORY
~~~

#### 7. Internal-continuation arbitration — bounded first slice

Current Product already permits one source-return continuation. Vision introduces a second possible
continuation class.

The smallest initial rule should remain fail-closed:

~~~text
one initial provider stage
-> zero OR one recognized internal continuation request total
-> one bounded realization
-> one final provider stage
-> no continuation request admitted from the final stage
~~~

So the first Vision continuation should not silently execute SourceReturn + Vision LOOK in an
unbounded sequence during one human turn.

This is a bounded first-slice choice, not a permanent claim that a future turn can never need both.
If lived product pressure proves that source-return + visual observation must compose in one turn,
form the smallest explicit combined-enrichment rule then.

Do not answer that future pressure by introducing an open-ended generic tool loop.

#### 8. Source order implied by the ownership graph

The implementation order that now follows from current source is:

~~~text
CURRENT FOREGROUND
recover/rebuild exact persistent local artifact
-> PR #114 exact-head SourceOwner
-> Assurance / lifecycle / integration
-> install running Product carrying persistent selected-scope runtime
-> substrate lived engage/select-once/project/stop proof

NEXT PRODUCT SCOPE SEMANTIC / PRESENTATION SLICE
accepted persistent Product service projection
-> evolve VexLifeVisionFamily from one-shot reachability to human persistent-scope meaning
-> interpret Product-safe SDK projection instead of copying native lifecycle
-> human Engage / Stop controls
-> quiet truthful persistent selected-scope indicator
-> LOOK remains held from execution until the later effect slice
-> lived human select-once / browse / stop proof through ordinary Product presentation
-> no capture merely from this slice

NEXT SDK LOOK EFFECT SLICE
accepted session LOOK semantics
-> persistent native LOOK/capture realization
-> exact single-use capture reservation/replay boundary
-> no picker replay
-> content-absent capture/Perception proof
-> actual LOOK indicator truth becomes available to Product

NEXT VISUAL SLICE
qualified VLM/visual worker
-> ephemeral frame input
-> bounded derived visual meaning
-> no raw persistence

NEXT PRODUCT CONVERSATION / LOOK PRESENTATION SLICE
Capability Atlas requestability
+ DirectCompanionTurn bounded internal Vision request
+ injected service-owned Vision continuation
+ final prompt rematerialization
+ one final inference
+ bounded visionLookTrace
+ brief active LOOK indicator distinct from quiet engaged-scope indicator

LIVED END-TO-END
select once through ordinary Product UI
-> browse/scroll
-> ask something visually dependent
-> Vex chooses LOOK
-> one current snapshot without picker replay
-> bounded interpretation
-> same turn continues
-> answer reflects what is currently visible
~~~

This order is causal rather than ceremonial. Independent design/source work may continue while a
physical proof predicate is held, but no later layer may pretend an earlier effect exists.

### Candidate Product semantic/continuation shape after source review

The following is now grounded enough to constrain implementation, but remains a candidate until the
persistent-scope Product slice is accepted/lived and the exact source membrane is admitted.

#### Human-facing Family should interpret SDK truth, not clone it

The accepted SDK session owns physical states:

~~~text
HELD
SELECTING
ENGAGED
LOOKING
ENDED
~~~

and terminal reasons:

~~~text
HUMAN_DISENGAGED
SOURCE_LOST
HOST_OWNER_LOST
EXPLICIT_STOP
~~~

Product semantic meaning should not expose that list merely because it exists.

A smaller candidate human-facing Family is:

~~~text
State
  Held       # Product/Vision cannot truthfully offer the requested relationship
  Ready      # Vision route exists; no current selected scope
  Selecting  # explicit human system-picker selection is in progress
  Engaged    # one selected scope is available; no capture active
  Looking    # one admitted current LOOK is in progress

Control
  Engage
  Stop
  LookNow

Effect
  RequestEngage
  RequestStop
  RequestSnapshot
~~~

Candidate pure transitions:

~~~text
Ready + Engage
-> Selecting + RequestEngage

Engaged + LookNow
-> Looking + RequestSnapshot

Selecting / Engaged / Looking + Stop
-> stay(current semantic State) + RequestStop
-> do not claim stopped until outside truth returns

Held + LookNow
Ready + LookNow
Selecting + LookNow
Looking + LookNow
-> not admitted
~~~

Outside SDK projection must then be interpreted back into Product semantic State.

Grounded mapping pressure:

~~~text
route unavailable / Safety-held relationship
-> Held

route reachable + no selected session
-> Ready

SDK SELECTING
-> Selecting

SDK ENGAGED
-> Engaged

SDK LOOKING
-> Looking

SDK HELD with no material hold reason after human picker cancellation
-> likely Ready, not Product Held

SDK HELD with SAFETY_NOT_CURRENT
-> Held

SDK ENDED
-> interpret endReason; do not expose ENDED merely because the SDK uses it
~~~

The exact `ENDED` reason mapping remains held until Product/lived behavior establishes whether
SOURCE_LOST / HOST_OWNER_LOST should present as Ready-with-reselect or Held-with-recovery.

Permanent:

~~~text
PRODUCT_FAMILY_STATE
!= SDK_SESSION_STATE_ENUM

FAMILY_INTERPRETS_OUTSIDE_TRUTH
!= FAMILY_OWNS_NATIVE_LIFECYCLE
~~~

#### Model LOOK control should request visual context, not author effect identity

The existing source-return grammar establishes a useful bounded form:

~~~text
exact internal header
+ one exact JSON object
+ no surrounding prose
~~~

A candidate Vision equivalent may use:

~~~text
VEXLIFE_VISION_LOOK_REQUEST/v1
{"schemaVersion":"vexlife-prod.vision-look-request/v1","focus":"<bounded visual fact needed>"}
~~~

This exact spelling/schema is **not yet accepted source**. The invariant is more important than the
name.

The model-authored request may carry only bounded interpretive intent such as `focus`.

It must not carry:

~~~text
requestRef
scopeSessionRef
native/provider/window identity
SCREEN authorization/binding/fingerprint
effect reservation
capture count
VLM/runtime selection authority
Memory/training/publication authority
~~~

Product/owner code mints and binds the exact effect request identity after the internal request is
semantically admitted.

~~~text
MODEL_REQUESTS_CURRENT_VISUAL_CONTEXT
!= MODEL_AUTHORS_CAPTURE_AUTHORITY
~~~

#### Capability framing should expose requestability, not authority

Current Capability Atlas already owns the vocabulary:

~~~text
DISCOVERABLE
EXPLAINABLE
REQUESTABLE
ADMITTED
EXECUTABLE
COMPLETED
~~~

and every current frame preserves:

~~~text
effectAuthorityGranted=false
~~~

That makes `REQUESTABLE` the current design pressure for a future current-scope LOOK capability.

A candidate capability would be available only when the service-owned current Vision projection proves
one engaged selected scope and no conflicting LOOK is already active.

No current SCREEN authorization should be treated as durable capability authority. Actual LOOK still
re-resolves fresh Safety after the model requests it.

Likely direction:

~~~text
service-owned current Vision projection
-> turn-local bounded resource fact

Capability Atlas
-> model can know current LOOK is REQUESTABLE / HELD / UNAVAILABLE
-> effectAuthorityGranted remains false
~~~

The current `DirectPromptContext` hardcodes `DirectTurnCapabilityRefs` and its resource facts.
Therefore Vision requestability requires an explicit bounded input to prompt materialization; prompt
code must not discover or own `VisionRuntime` itself.

#### Final visual context should remain untrusted turn input

A successful visual worker should return one bounded derived context, not raw image bytes.

Candidate final-prompt relationship:

~~~text
ephemeral raw frame
-> visual worker
-> bounded derived visual meaning
-> raw frame destroyed

DirectPromptContext
-> materializes a bounded visual-context message
-> derived visible text is marked untrusted reference data
-> current human request remains the human intention being answered
-> final local-model inference
~~~

The visual-context message should not receive instruction authority merely because Product formed it.
Visible webpage/application text remains data.

The prompt receipt may retain refs, hashes, character counts and runtime/model provenance without
retaining raw pixels.

#### Effect evidence must survive a post-capture turn failure

Current direct Conversation failure law is:

~~~text
failed send attempt
-> retrySameSendAttemptAllowed=false
-> same failed attempt is not automatically replayed
-> human/owner must form a new send attempt through the exact recovery route
~~~

Vision must preserve that law.

But LOOK is a real effect. Therefore after a capture/visual observation occurs and before final
provider inference, enough **content-absent durable effect evidence** must exist that a crash cannot
make the system later claim no LOOK occurred.

Required recovery truth:

~~~text
LOOK_REQUESTED
!= CAPTURE_PERFORMED
!= VISUAL_INTERPRETATION_PERFORMED
!= FINAL_CONVERSATION_RESPONSE_COMMITTED
~~~

If capture succeeds and final inference later fails:

~~~text
same send attempt
-> NOT replayed
-> NOT automatically recaptured

durable evidence
-> still proves whether capture occurred
-> contains no raw pixels
-> does not become Memory

new human send attempt
-> is a new turn/effect decision
-> may independently request a new current LOOK
~~~

The exact durable owner should preferably be the rightful capture/effect-reservation owner or a
turn-bound reference to its accepted receipt. Do not create a second Product effect ledger merely to
make Conversation recovery convenient.

A completed turn may then persist only a bounded Vision trace/reference alongside existing prompt/runtime
evidence:

~~~text
turnRef
Product LOOK request ref
capture/effect receipt ref
content-absent visualObservationRef
frame digest + dimensions if already admitted metadata
visual runtime/model profile refs
derived-context hash/ref
rawBytesPersisted=false
rawFileWritten=false
memoryAccepted=false
trainingEligible=false
~~~

Exact fields remain downstream of the accepted capture/effect and visual-worker contracts.

#### Two internal controls earn bounded arbitration, not a generic tool framework

Once SourceReturn and Vision LOOK both exist, `DirectCompanionTurn` will have two known internal
continuation classes.

That earns a small typed arbitration question:

~~~text
initial provider output
-> ordinary human answer
OR
-> one exact SourceReturn request
OR
-> one exact Vision LOOK request
~~~

It does not yet earn arbitrary tool registration, recursion or multiple effect loops.

The current `SourceReturnProgressGate` responsibility also becomes a repeated relationship:

~~~text
internal control content
!= human-visible streamed answer
~~~

A bounded refactor may generalize only that responsibility to the exact admitted internal headers.

First-slice law remains:

~~~text
one initial provider stage
-> at most one admitted internal continuation total
-> one bounded continuation realization
-> one final provider stage
-> final stage cannot request another continuation
~~~

<!-- [VXG RealForever][VEXLIFE][VISION][CANDIDATE-SEMANTIC-CONTINUATION-SHAPE][20261113] -->

### Security boundary carried by the design

This end-to-end experience keeps the existing Security activation above and makes its current boundary
explicit:

~~~text
selected scope only
explicit human engage/stop
visible persistent scope indicator
visible actual-look indicator
fresh Safety at LOOK
one LOOK -> at most one capture
no background/continuous capture by implication
screen/web content = untrusted observation/context
screen/web content != human instruction/authority
raw pixels ephemeral
no Memory/training/publication by implication
Vision observation cannot grant tool/effect authority
~~~

Security Assurance remains selective source descent; this Work source records the product invariants,
not a claim that every implementation predicate has already been proven.

## Current implementation frontier — persistent Product scope bridge

Accepted SDK dependency:

~~~text
Vextreme-SDK PR #1953
merge = 1c2c9d76114ca35f00125f0a5c93e531e3e6a746
tree  = 6376f68279f0750ee6d3868b8472368199763064

accepted relationship:
one long-lived Product-facing selected-scope runtime
-> ENGAGE / PROJECT / RECONCILE / STOP / SHUTDOWN
-> selected-scope custody remains below Product
-> LOOK/capture remains absent
~~~

Persistent local artifact Build A002 previously qualified:

~~~text
archive =
vexlife-vision-runtime-darwin-arm64-node-v26.8.1-sdk-1c2c9d76.tar.xz

archiveSha256 =
8182d4582a11e893b0770cc9ad72c12fab35e54349177232f6100da11d7037d3

manifestSha256 =
0460f8aa6b2a9d75e50c58ec50197b42a9d1c90b78bef92db0cc76386d645bfb

runtimeSha256 =
77abb23df39e81bf7fa0d263ac4df9730f024996ab60c627aa7ddda67287e848

helperSha256 =
d5ccf8886311c8b592d36829044660c8baa00b6134e7d3da7e4278b8f0707ecf

truthClass = LOCAL_QUALIFIED_NOT_DISTRIBUTABLE
releaseDisposition = LOCAL_ONLY_NO_RELEASE
~~~

Current Product candidate:

~~~text
VexLife-Prod PR #114

branch =
VXG-111326-vexlife-prod-vision-persistent-scope-service-a001

current corrected head =
1ae6b6e4d02ab824f438a3046afb256ca663c032

current corrected tree =
fec9966437ddfc774967736f3761a8bb461c1a94
~~~

PR #114's source responsibility is deliberately smaller than the whole feature:

~~~text
one Product service lifetime
-> one persistent Vision runtime child

GET /api/v1/vision/scope
-> PROJECT

POST /api/v1/vision/scope/engage
-> ENGAGE

POST /api/v1/vision/scope/stop
-> STOP

service close
-> SHUTDOWN

legacy /api/v1/vision/look-now
-> remains HELD for the persistent protocol
~~~

A003 reached real Product proof and executed the JVM suite. It found one test-oracle defect rather than
a disproven runtime relationship. The correction is now on PR #114 at the current head above.

A004 and A005 did not form SourceOwner attempts because the already-qualified persistent artifact bytes
were no longer present on Victor's Mac. That is local artifact custody loss, not Product candidate
failure.

Current exact resume coordinate:

~~~text
accepted SDK source/runtime
+ previously established artifact qualification identity
+ missing local persistent artifact bytes
        ↓
recover/rebuild the persistent local-only artifact from accepted SDK source
        ↓
qualify the fresh artifact truthfully
        ↓
resume exact-head PR #114 SourceOwner proof
        ↓
fresh Assurance / lifecycle / integration if proof clears
        ↓
build/install Product image carrying the persistent artifact
        ↓
lived select-once persistent-scope proof
        ↓
THEN earn same-turn LOOK / visual interpretation / Conversation Context
~~~

Do not respond to the missing artifact by forming endless new PR #114 proof wrappers. Recover the
required artifact predicate first.

### Lived completion target for the persistent-scope slice

The persistent-scope slice is not complete merely because PR #114 merges.

Its lived completion target is:

~~~text
running Product carries exact persistent artifact
-> Victor explicitly engages Vision
-> macOS picker appears once
-> Victor selects one window
-> scope becomes ENGAGED
-> visible persistent scope indication is truthful
-> no capture occurs merely from ENGAGED
-> Victor scrolls/navigates so visible content changes
-> PROJECT still reports the same lawful engaged relationship
-> STOP releases the scope
-> Product runtime child remains/terminates according to the accepted Product lifetime
-> no raw-frame / model / Memory effect is implied by this proof
~~~

Only after that relationship is lived-current should the next implementation frontier consume it:

~~~text
Vex decides LOOK is materially needed
-> one fresh current frame
-> bounded visual interpretation
-> same-turn Conversation Context convergence
~~~

### Current design confidence / held unknowns

The following are grounded strongly enough to guide implementation:

~~~text
persistent scope != continuous capture
scope selection != capture authorization
Vex decides whether LOOK is materially useful
LOOK must be current-Safety-gated
one LOOK -> at most one current observation
raw pixels remain ephemeral
derived visual meaning may be turn-scoped Conversation Context
Vision State != Conversation history != Memory
Product service != selected-scope owner
visual worker != sensor authority
presentation must distinguish engaged from actively looking
~~~

The following remain intentionally unresolved until source/implementation pressure earns them:

~~~text
final persistent-scope VexLifeVisionFamily vocabulary
exact same-turn Vex LOOK continuation owner/API
whether the selected browser/window should become a VexPartner realization
exact visual-model worker/runtime
exact derived-visual-observation contract
exact Conversation Context convergence representation
whether any durable Vision Store is ever earned
~~~

These held questions are design frontiers, not permission to collapse back to automatic screenshots or
continuous capture.

<!-- [VXG RealForever][VEXLIFE][VISION][END-TO-END-CURRENT-DESIGN-ANCHOR][20261113] -->

