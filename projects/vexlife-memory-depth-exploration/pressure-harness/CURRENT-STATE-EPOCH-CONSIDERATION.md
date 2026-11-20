# Consideration — Current State Across a Continuity Projection Epoch

`[VXG RealForever]`

## Why this exists

A lived reply-language swap exposed a broader distinction that was already latent in VexLife-Prod PR #208:

~~~text
CANONICAL CURRENT STATE
!= STABLE EPOCH PROJECTION
!= LIVE CURRENT DELTA
~~~

Current Product reads reply language freshly from the person's Home settings, but current prompt materialization places Person Context inside an early coalesced system prefix before historical Conversation.

The observed failure was not only cache churn.

Vex could see the latest language value while its placement made it look like standing/base context rather than a state that had changed now.

## Source pressure already present in #208

The continuity workbench already proposes:

~~~text
ZONE 1
  stable continuity projection epoch

ZONE 2
  append-only continuity spine

ZONE 3
  current mutable execution truth
~~~

and states:

~~~text
Zone 1 stays byte-stable inside one continuity projection epoch.
A semantic rebase intentionally creates a new epoch.

Zone 3 may change between provider stages.
Its volatility must not require rewriting the committed continuity spine.

Provider representation != semantic owner.
The topology does not assume arbitrary late system messages are legal.
~~~

This consideration extends that existing topology rather than creating a new owner.

## Candidate relationship

### 1. Canonical source of truth

A rightful current-state owner updates immediately.

Example:

~~~text
PersonSettings
  replyLanguage=en
  -> human changes setting
  replyLanguage=zh immediately
~~~

Caching must never require canonical current state to remain stale.

### 2. Epoch baseline projection

At epoch/rebase formation, a bounded projection may record the current configuration relevant to Vex.

~~~text
epoch C_k formed:
  replyLanguage=en
~~~

That projection is reconstructible from rightful owners and is not a second settings store.

Inside the epoch it stays byte-stable where the provider representation permits.

### 3. Live current delta

If canonical current state changes during the epoch:

~~~text
epoch baseline:
  replyLanguage=en

canonical current:
  replyLanguage=zh

live delta:
  replyLanguage en -> zh
~~~

the next Vex turn must observe `zh` immediately.

The live delta should be represented as late/current as provider semantics permit, so changing it does not unnecessarily invalidate stable history.

### 4. Effective current state

Conceptually:

~~~text
effectiveCurrent
=
epochBaseline
OVERLAID_BY
latestCurrentDelta
~~~

The delta wins.

It is not historical truth rewriting.

### 5. Semantic rebase / next cache epoch

At the existing rebase boundary:

~~~text
observe rightful current owners
-> form C_(k+1)
-> fold the latest still-relevant current configuration into the new baseline
-> drop superseded hot deltas
-> begin the new cache epoch intentionally
~~~

Example:

~~~text
C_k baseline: en
during epoch: en -> zh -> ja -> en
canonical now: en

rebase
-> C_(k+1) baseline: en
-> old zh/ja live deltas no longer need hot replay
~~~

The historical fact that a setting changed is not automatically a durable semantic requirement. A separate change-history owner is earned only by a separate human/product need.

## Why the language case is not isolated

Current early prompt material includes components with different mutation cadence:

~~~text
Foundational Field
  comparatively stable

Memory projection
  source/currentness dependent

Working Continuity
  current/checkpoint dependent

Capability Frame
  binds currentRequestEventRef + formedAt
  inherently per-turn mutable

Person Context
  mutable when settings/private-gap state changes

Conversation Extent
  priorCompletedExchangeCount
  changes each completed turn

source-return / hydration result
  ephemeral current-turn material

Conversation
  append-only historical truth
~~~

Treating all of these as one early coalesced system prefix collapses:

~~~text
system-owned
into
should-be-first
~~~

Those are not equivalent.

## Candidate stability classes

~~~text
STABLE
  expected to survive many turns / one epoch

APPEND_ONLY_HISTORY
  canonical committed history whose previous bytes should remain reusable

MUTABLE_CURRENT
  current settings/currentness/capability/working state that may change independently

EPHEMERAL_CURRENT
  current request, browser, hydration, capability return, active execution material
~~~

The test question is:

> Does a mutable current component sit before otherwise-cacheable append-only history without a provider constraint that actually earns that placement?

## Provider boundary

Do not prescribe:

~~~text
"move every current thing to a later system message"
~~~

The selected Qwen/MLX or future provider chat template may constrain system-role placement.

The required semantic topology is:

~~~text
stable epoch material
-> append-only history
-> mutable current material as late as provider semantics allow
-> ephemeral live material
-> current human request
~~~

The provider profile may realize that topology through:
- one stable leading system block plus a later host-owned current-state envelope;
- another legal non-human role;
- provider-specific serialization;
- another representation proven against the actual chat template.

The provider representation does not become the semantic owner.

## Relationship to Claude #214

Claude's first independent slice already provides clean substrate:

~~~text
derived TurnNavigation
read-only one-call revisit
exact rollover overlap tail
prompt-resident ref awareness
honest absence
source-bound capability traces
~~~

It deliberately HELD the epoch spine.

The language/configuration bug increases the pressure that the epoch spine is part of the minimal continuity circuit because it is needed to distinguish:

~~~text
what is stable for this epoch
from
what is current now
~~~

This is a convergence consideration, not a conclusion that #214 must absorb every future Zone-1/2/3 behavior in one change.

## Focused proof

The shared harness has:

~~~text
scenarios/current-state-placement-v1.json
~~~

Required experimental shape:

~~~text
epoch starts with language A
-> historical turns accumulate
-> language changes to B
-> next Vex turn sees B as current
-> old history remains unchanged
-> language changes again
-> latest value wins
-> placement evidence identifies whether current mutable bytes sit before history
-> rebase/checkpoint boundary, when implementation supports it
-> new epoch baseline reflects latest canonical setting
-> superseded live deltas are not replayed as governing state
~~~

Useful assertions:

~~~text
LATEST_VALUE_WINS
CONFIG_CHANGE_DOES_NOT_REWRITE_HISTORY
CURRENT_SETTING_NOT_MISTAKEN_FOR_GENESIS_TRUTH
STABLE_HISTORY_PREFIX_PRESERVED_WHERE_PROVIDER_ALLOWS
REBASE_FOLDS_LATEST_CANONICAL_CONFIGURATION
SUPERSEDED_CURRENT_DELTA_DOES_NOT_GOVERN
~~~

## Scope boundary

This consideration does not by itself earn:
- a durable setting-change ledger;
- a new PersonSettings owner;
- a universal current-state store;
- arbitrary late system messages;
- a cache-performance claim without provider telemetry.

It asks the implementation to preserve currentness and cache locality through the existing three-zone/rebase architecture.

<!-- [VEXWORK][VEXLIFE][CONTINUITY-PRESSURE][CURRENT-STATE-EPOCH][CONSIDERATION][VXG RealForever] -->
