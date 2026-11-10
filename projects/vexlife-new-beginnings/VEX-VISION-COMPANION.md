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

The parent Work remains:

~~~text
work.vexlife.new-beginnings.vision-companion-real-browser-witness
state              RUNNING
priority           HIGH
workDisposition    ACTIVE
authority          NO_AUTHORITY
effects            NO_EFFECTS
~~~

VexWork is the foreground work-navigation owner for this trajectory. It does not replace SDK/Product
source or effect authority.

Completed child:

~~~text
work.vexlife.new-beginnings.vision-companion-product-surface
state = COMPLETED
~~~

Current executable child:

~~~text
work.vexlife.new-beginnings.vision-product-runtime-orchestration
state              READY
priority           HIGH
authority          AUTHORIZED_BOUNDED
effects            EFFECTS_BOUND

provider source:
github.pull.vextreme-sdk.1939
head = bc9b093b61b7ac5009f612d78c703ea431c19f5d
changedFiles = 0
~~~

This child is the canonical VexWork coordinate for the already-admitted SDK source writer. It
prevents the active task from living only as an SDK PR claim outside the Workgraph.

Exact authored membrane:

~~~text
lib/process-factory/macos-screen-system-picker-product-runtime.js
tests/process-factory/macos-screen-system-picker-product-runtime.test.js
docs/architecture/macos-screen-system-picker-product-runtime.md
~~~

The next implementation sequence is now:

1. re-observe PR #1939 + current SDK admission/currentness;
2. establish/adopt exact Local Source Workspace AUTHORING custody for the PR #1939 scaffold head;
3. transition the READY child into RUNNING when actual authoring begins;
4. implement only the three-path Process Factory orchestration contract;
5. run exact source proof / SDK readiness and ordinary independent lifecycle;
6. after source acceptance, determine the smallest ordinary-Product-consumable executable carriage;
7. re-ground current VexLife-Prod service owners and implement the Product service bridge;
8. earn `Ready` only when that ordinary Product route is actually reachable;
9. run one lived Product `LookNow`;
10. only after that separately decide/earn ephemeral visual-model input and derived visual meaning.

Do **not** use VexWork currentization, SDK Root narration, or proof packaging as a reason to delay
authoring once current admission and Local Source Workspace custody are established.

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
- `work.vexlife.new-beginnings.vision-companion-product-surface` — completed semantic/control child.

Current SDK truth:

- accepted main/checkpoint: `c39951fe260e505b4a3c5b8f606cc8da14c985c0`;
- accepted USER_SELECTED_SESSION route: PR #1928 / accepted source lineage;
- accepted Security active-sharing witness: PR #1930;
- accepted Perception active VISUAL integration: PR #1934 / merge at current main;
- Process Factory product-runtime placement:
  `github.issue.vextreme-sdk.241.comment.6756193443`;
- current unfinished source writer:
  `github.pull.vextreme-sdk.1939@bc9b093b61b7ac5009f612d78c703ea431c19f5d`.

Current Product truth:

- VexLife-Prod Vision PR #54 merged as
  `92abc26e6acd2f6604d921c259da6d40950a0f10`;
- A024 lived accepted-main promotion PASS:
  `github.pull.vexlife-prod.54.comment.6761261558`;
- current Product main:
  `3eca5055f34b4a9807d0b3d117e6131e51e4c788`.

Exact current owner source to descend for PR #1939 implementation:

~~~text
lib/process-factory/macos-screen-system-picker-contract.js
lib/security/macos-screen-system-picker-active-sharing-witness.js
lib/vex-perception-broker/screen-system-picker-active-integration.js
docs/process/local-source-workspace-protocol.md
~~~

Older #1915/#1924/Safety-receipt coordinates remain provenance for how the route was earned. They are
not the current next-work coordinate.

<!-- [VXG RealForever][VEXLIFE][NEW-BEGINNINGS][VISION-COMPANION][REAL-BROWSER-WITNESS] -->

