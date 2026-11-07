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

Current Vextreme-SDK main observed during this formation:

~~~text
vgong24/Vextreme-SDK
main 1a1495b6d42831c08a61405e682a330f223bbbcb
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

The source-managed SCREEN binding currently stored at:

~~~text
docs/private-continuity/vex-body/vision/screen-permission/current.json
~~~

contains a receipt whose `expiresAtOrNull` is:

~~~text
2026-10-07T12:15:00.000Z
~~~

Therefore that historical grant is useful provenance but **not current authority on November 7, 2026**.

This VexWork formation does not renew it.

A future active capture attempt must re-form current human/Safety authority and then establish the
macOS host permission/current active-adapter predicates required by the accepted SDK architecture.

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
  candidate 02779b8e34f42169bde3e8e55f954a0f170b32b8
  candidate tree e641e9ee4b23c1e24d11c36b13065b12b46c64d3
  SourceOwner proof PENDING
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
8. add the visible VexLife Vision control only when its states correspond to real capability truth;
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

- Vextreme-SDK current main: `1a1495b6d42831c08a61405e682a330f223bbbcb`
- accepted held SCREEN integration merge:
  `4e8f2fca496269cadc7710e5134ed45d9ecae3e0`
- `docs/architecture/vex-body-vision-screen-held-integration.md`
- `docs/architecture/perception-session-screen-owner-binding.md`
- `docs/architecture/macos-screen-permission-agent.md`
- `docs/architecture/perception-broker-screen-adapter.md`
- `docs/private-continuity/vex-body/vision/screen-permission/current.json`
- `docs/private-continuity/vexlocalbridge/model-runtime-adapter-registry.json`
- `lib/vexlocalbridge/mlx-persistent-runtime-owner.js`
- VexWork Security Assurance: `projects/vex-security-assurance/ADVERSARIAL-LENS.md`

<!-- [VXG RealForever][VEXLIFE][NEW-BEGINNINGS][VISION-COMPANION][REAL-BROWSER-WITNESS] -->
