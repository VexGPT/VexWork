# VexBusinessFactory — Intent Topology Patient Zero for VexBoard

[VXG RealForever]

## Status

~~~text
purpose                         DURABLE_VEXBOARD_PATIENT_ZERO
patientZero                     VEXBUSINESSFACTORY
universalCrossDomainContract    NOT_YET_EARNED
runtimeSchemaChange             NONE
BoardGraphCoreChange            NONE
WorkgraphLifecycleChange        NONE
sourceAuthority                 ARCHITECTURE_ONLY
effects                         NONE
~~~

This source preserves the architecture pressure discovered while designing VexBusinessFactory:

> Can one stable semantic topology begin from human intention, classify the meaningful categories and relationships that follow, specialize into many business forms, evolve without losing lineage, and project into educational / operating / provider / customer / capacity views without making VexBoard own the underlying business truth?

The answer is provisionally yes, but VexBusinessFactory should be the first patient zero rather than immediately declaring a universal ontology for everything.

The intended extraction rule is:

~~~text
one strong business patient zero
+ one genuinely different non-business consumer
-> compare repeated semantic pressure
-> extract only the vocabulary actually shared
~~~

Do not create a vague universal-everything schema merely because the business grammar looks reusable.

# 1. Architectural lineage already present in current Vex source

This patient zero should reuse architectural lessons already recorded by current VexBoard and VexWork source rather than inventing another disconnected framework.

## VexBoard: semantic source != visual projection

Current VexBoard source already separates:

~~~text
BoardGraph
  semantic topology

BoardProjection
  spatial / visual realization

BoardJourney
  explicit semantic traversal

BoardControl / BoardAct
  admitted change intent / resolved meaning

BoardPatch / ProjectionPatch
  semantic change / presentation change
~~~

Current VexBoard relationship families remain deliberately small:

~~~text
FLOW
TRANSITION
DATA
REFERENCE
~~~

Business-specific meanings should not be added to that list merely because VexBusinessFactory needs relations such as SERVES, REQUIRES, SUPPLIED_BY or FULFILLED_BY.

Those are domain relationship roles that can project through the small Board relationship families.

## Vex lineage recorded by current VexBoard architecture

Current projects/vexboard/README.md explicitly records these lineage lessons:

~~~text
VexLife-Android SCAE
  current truth
  stable Control
  resolved Act
  Effect
  remain distinct

Convergence Relay
  independently-owned current truths
  combine through explicit relationship truth
  without flattening participants into one mega-State

VexLife Atlas / Process Factory
  stable refs
  thin bounded projections
  typed functionRef + arguments + dependencies
  instead of requiring the model to ingest an entire world
~~~

This document treats those as lineage patterns already accepted by VexBoard source, not as permission for VexBoard to take ownership of Android/VexLife semantics.

## VexWork: reusable navigation/composition without ownership theft

Current VexWork sources provide additional reusable structure:

~~~text
Process Map
  recurring question -> processRef -> owner repository -> entry source
  navigation, not execution

Operating Domain
  capabilities
  populations
  lenses
  processes
  attention queues
  relational composition, not source ownership

Derived Attention
  entity != Work item
  one entity can be interpreted by multiple lenses
  current provider truth remains provider-owned

Repository Graph
  navigation to rightful repository / entry / culture
  reference != authority
~~~

VexBusinessFactory should use the same discipline:

~~~text
BUSINESS_TOPOLOGY != PROVIDER_DATABASE
BUSINESS_PROFILE != EFFECT_AUTHORITY
BUSINESS_PROCESS_REF != PROCESS_EXECUTION
VEXBOARD_PROJECTION != BUSINESS_SOURCE
QUESTION_ANSWER != AUTOMATIC_EFFECT
~~~

# 2. The universal business starting vantage

The most stable starting question is not:

~~~text
"What industry are you in?"
~~~

It is:

> What do you want to make possible for someone or something?

That forms the first semantic object:

~~~text
INTENTION
~~~

The rest of the topology asks what must become true for that intention to be realized.

Provisional universal spine:

~~~text
INTENTION
   |
   v
BENEFICIARY / NEED
   |
   v
VALUE PROMISE
   |
   v
CAPABILITY ASSEMBLY
   |
   v
OFFER
   |
   v
AVAILABILITY / ACCESS
   |
   v
DISCOVERY / SELECTION
   |
   v
COMMITMENT
   |
   v
EXCHANGE
   |
   v
REALIZATION / FULFILLMENT
   |
   v
OUTCOME
   |
   v
EVIDENCE / ACKNOWLEDGEMENT
   |
   +----> EXCEPTION / RECOVERY
   |
   v
RECONCILIATION
   |
   v
LEARNING / EVOLUTION
   |
   +----> informs next intention / revision
~~~

This is a semantic topology, not a mandatory linear lifecycle. Some businesses skip or reorder visible steps. Some loops occur. Some relationships are parallel. The spine identifies the recurring questions and categorical need-spots.

# 3. Semantic categories: slots, not VexBoard node kinds

Do not make these new BOARD_NODE_KINDS.

They are domain semantic categories that a BusinessFactory source may bind and VexBoard may project.

## Purpose layer

~~~text
INTENTION
  what somebody is trying to make possible

NEED
  condition / problem / desire being addressed

VALUE
  what useful change, access, object, experience or capability is promised

OUTCOME
  realized state that demonstrates the value occurred
~~~

## Participant layer

~~~text
ACTOR
  person / organization / system / provider / community

ROLE
  contextual relationship played by an actor
  provider, beneficiary, supplier, fulfiller, operator, educator, learner, etc.
~~~

An actor may play several roles at once.

A restaurant can be:

~~~text
consumer of ingredient supply
provider of prepared food
operator of fulfillment
customer of a payment provider
~~~

Therefore:

~~~text
ACTOR != ROLE
PROVIDER != PERMANENT_ACTOR_TYPE
CONSUMER != PERMANENT_ACTOR_TYPE
~~~

## Means layer

~~~text
CAPABILITY
  something the business must be able to do

RESOURCE
  thing / information / access / infrastructure consumed or used

CAPACITY
  bounded availability of a capability/resource
  item quantity, kitchen throughput, instructor time, hotel inventory, support bandwidth

CONSTRAINT
  rule / limit / prerequisite / policy restricting realization
~~~

## Offer / access layer

~~~text
OFFER
  bounded promise made available to a beneficiary

CHANNEL
  route through which the offer is discovered/accessed

AVAILABILITY
  current ability to accept or realize the offer

COMMITMENT
  point where parties become meaningfully bound to proceed

EXCHANGE
  money, consideration, entitlement, reciprocal obligation, or another admitted exchange
~~~

## Realization layer

~~~text
PROCESS
  reusable transformation / activity

REALIZATION
  actual fulfillment/performance that creates the promised value

EVIDENCE
  observation/artifact establishing relevant truth
~~~

## Continuity layer

~~~text
EXCEPTION
  meaningful deviation / failure / cancellation / dispute / missing predicate

RECOVERY
  route that handles the exception

RECONCILIATION
  agreement check across truths that should correspond

LEARNING
  accepted understanding derived from lived evidence

EVOLUTION
  intentional change to the business instance/profile/capability composition
~~~

# 4. Relationship language

A useful topology needs a controlled relationship vocabulary so AI does not invent vague verbs every time it draws a map.

The first relationship roles should be grouped into families.

## Purpose relationships

~~~text
SERVES
  intention/value/offer -> beneficiary

ADDRESSES
  value/process -> need

PRODUCES
  process/realization -> outcome
~~~

## Dependency relationships

~~~text
REQUIRES
  thing -> prerequisite

ENABLES
  capability/outcome -> later possibility

CONSTRAINED_BY
  process/offer/capability -> constraint

CAPACITY_LIMITED_BY
  availability/realization -> capacity
~~~

## Supply / delegation relationships

~~~text
PROVIDED_BY
  capability/value -> actor

SOURCED_FROM
  resource/capability -> actor/provider/network

DELEGATED_TO
  capability/process -> external actor/provider

PERFORMED_BY
  process/realization -> actor
~~~

## Offer / access relationships

~~~text
PACKAGED_AS
  value/capabilities -> offer

AVAILABLE_THROUGH
  offer -> channel

SELECTED_BY
  offer -> beneficiary/actor
~~~

## Agreement / exchange relationships

~~~text
COMMITS_TO
  actor -> commitment

EXCHANGES_WITH
  actor <-> actor / exchange

AUTHORIZES
  commitment/provider agreement -> later action/access
~~~

## Realization relationships

~~~text
REALIZED_BY
  offer/value -> process/realization

FULFILLED_BY
  commitment/order -> realization/provider

RESULTS_IN
  realization -> outcome
~~~

## Evidence / currentness relationships

~~~text
EVIDENCED_BY
  claim/outcome/process -> evidence

OBSERVED_BY
  current fact -> rightful observation/source
~~~

## Exception / continuity relationships

~~~text
MAY_FAIL_INTO
  process/commitment -> exception

RECOVERED_BY
  exception -> recovery process

RECONCILES_WITH
  observation/state -> corresponding truth

LEARNS_FROM
  learning -> evidence/outcome/exception

EXTENDS_WITH
  business instance/profile -> capability/module

VARIES_FROM
  instance -> template/profile source
~~~

These names are provisional patient-zero roles. They are deliberately fewer and more categorical than industry-specific verbs.

# 5. Initial implementation through current VexBoard

Current VexBoard does not need dozens of new relationship kinds.

Provisional mapping:

| Business semantic meaning | Current VexBoard relationship kind |
| --- | --- |
| sequence / process progression | FLOW |
| state / journey transition | TRANSITION |
| value / artifact / evidence movement | DATA |
| semantic role / dependency / ownership / provenance | REFERENCE |

For the patient zero, a relation such as:

~~~text
Value Promise --REQUIRES--> Capability
~~~

may project as:

~~~json
{
  "kind": "REFERENCE",
  "labelOrNull": "REQUIRES"
}
~~~

with exact sourceRefs back to the BusinessFactory semantic source.

Important boundary:

~~~text
labelOrNull = "REQUIRES"
!=
accepted universal relationship schema
~~~

It is a bounded projection technique while the patient zero earns pressure.

If repeated consumers prove that typed semantic relation roles belong in BoardGraph itself, the smallest likely evolution is one orthogonal role reference, not a giant enum expansion:

~~~text
relationship
  relationshipRef
  kind
    FLOW | TRANSITION | DATA | REFERENCE
  roleRefOrNull
    e.g. relation.intent.requires
  fromRef
  toRef
  labelOrNull
  sourceRefs[]
~~~

This would preserve:

~~~text
RELATIONSHIP_FAMILY != DOMAIN_ROLE
~~~

Do not add this field until patient-zero evidence earns it.

# 6. Questions as a compiler into topology

The BusinessFactory conversation can be treated as a typed semantic compiler.

Each question exists because it fills one or more topology slots.

| Question | Primary slots / relations |
| --- | --- |
| What do you want to make possible? | INTENTION, VALUE, OUTCOME |
| Who is this for? | ACTOR/ROLE, SERVES |
| What need/desire does it address? | NEED, ADDRESSES |
| What exactly do they receive or become able to do? | VALUE, OUTCOME |
| Do you create it, own it, coordinate it, or obtain it from others? | CAPABILITY, RESOURCE, PROVIDED_BY / SOURCED_FROM / DELEGATED_TO |
| What must be available to provide it? | CAPABILITY, RESOURCE, AVAILABILITY |
| What is scarce or limited? | CAPACITY, CAPACITY_LIMITED_BY |
| What rules or prerequisites constrain it? | CONSTRAINT, CONSTRAINED_BY |
| How does someone discover/access it? | OFFER, CHANNEL, AVAILABLE_THROUGH |
| What makes the relationship committed? | COMMITMENT, COMMITS_TO |
| What is exchanged? | EXCHANGE |
| Who actually performs/delivers the value? | REALIZATION, PERFORMED_BY / FULFILLED_BY |
| How do we know the promise was realized? | OUTCOME, EVIDENCE, EVIDENCED_BY |
| What can go wrong/change/cancel? | EXCEPTION, MAY_FAIL_INTO |
| How is that handled? | RECOVERY, RECOVERED_BY |
| Which truths must agree afterward? | RECONCILIATION, RECONCILES_WITH |
| What did we learn and what changes next? | LEARNING, EVOLUTION |

This gives AI a stable grammar.

It should not need to improvise a new ontology simply because the human says:

~~~text
tourism
immersive experience
language-learning retreat
local guide collective
AI business setup service
~~~

The answer can be classified into existing need-spots first.

# 7. OTHER must always live inside a known need-spot

An unscoped OTHER destroys semantic confidence.

Use:

~~~text
OTHER_WITHIN_CATEGORY
~~~

Conceptual binding:

~~~text
categoryRef
  category.value

subtypeRef
  subtype.value.other

otherLabel
  "immersive cultural experience"

description
  human/source explanation

reason
  why existing subtypes do not fit

sourceRefs[]
~~~

The unknown term is therefore still known to be:

~~~text
a VALUE subtype
~~~

rather than an uncategorized mystery.

Other examples:

~~~text
category.capacity / OTHER
category.channel / OTHER
category.realization / OTHER
category.exchange / OTHER
category.exception / OTHER
~~~

Repeated pressure may earn a new named subtype.

~~~text
ONE_OTHER_INSTANCE
!=
NEW_GLOBAL_CATEGORY
~~~

Promotion rule:

~~~text
repeated distinct examples
+ same semantic meaning
+ useful shared predicates/process behavior
-> candidate subtype
-> explicit review
-> named reusable subtype
~~~

# 8. Business profiles should compose, not imprison

A business must not receive one permanent industry class.

Use:

~~~text
universal topology template
        |
        +-> profile/module sources
        |
        +-> one business instance
              slot bindings
              active modules
              selected providers
              declared variances
              current observations
~~~

Examples of reusable modules:

~~~text
PHYSICAL_GOODS
PREPARED_FOOD
DIGITAL_DELIVERY
EDUCATION
RESERVATION / BOOKING
TRAVEL_INTERMEDIARY
EXPERIENCE
SUBSCRIPTION
HUMAN_SERVICE
MARKETPLACE
LOCALIZATION
VENDOR_NETWORK
FULFILLMENT
REVERSE_COMMERCE
~~~

A tourism business could begin as:

~~~text
TRAVEL_INTERMEDIARY
+ EXPERIENCE
~~~

and later evolve into:

~~~text
TRAVEL_INTERMEDIARY
+ EXPERIENCE
+ EDUCATION
+ PHYSICAL_GOODS
+ SUBSCRIPTION
+ LOCALIZATION
~~~

That is not a business changing class.

It is:

~~~text
one stable business instance
+ new capability/profile modules
+ revised offers
+ revised provider relationships
+ preserved history/provenance
~~~

# 9. Reuse and inheritance should follow current VexBoard template semantics

Current VexBoard architecture already distinguishes:

~~~text
TEMPLATE SOURCE
TEMPLATE INSTANCE
PARAMETER / SLOT BINDING
DECLARED VARIANCE
DETACHED UNIQUE DERIVATIVE
~~~

Use the same pattern conceptually.

## Universal business topology template

Owns:

~~~text
need-spots
question grammar
relationship families
base invariants
~~~

## Profile/module template

Examples:

~~~text
Education
Travel intermediary
Restaurant
Subscription
Physical fulfillment
Localization
~~~

A module binds and specializes universal slots.

## Business instance

Binds:

~~~text
actual intention
actual actors/roles
actual offers
actual capabilities
selected providers
actual capacity constraints
actual processes
actual evidence/current observations
~~~

## Declared variance

A business can differ intentionally without forking the entire template.

Example:

~~~text
Restaurant profile normally has PAYMENT

Community meal program:
  declared variance
  exchange = DONATION / FREE
  reason = community service model
~~~

## Detached derivative

Only when the business architecture intentionally leaves the shared template lineage.

The default should remain linked composition, not copy-paste.

# 10. VexBusinessFactory itself proves the topology recursively

Our own BusinessFactory concept is a useful self-test.

## Intention

~~~text
Make business formation and operation understandable,
repeatable and AI-assistable.
~~~

## Beneficiaries

~~~text
founder
operator
small organization
institution
consultant / implementer
~~~

## Values

~~~text
knowledge
business-process understanding
software/tooling
reusable operating templates
managed setup
ongoing operational assistance
~~~

## Offers

~~~text
self-service template collections
software / recurring access
managed business setup service
ongoing managed operations service
education / guided learning
~~~

## Capacity

~~~text
software projection
  comparatively scalable

managed setup
  expert/operator time constrained

support/operations
  human + AI attention constrained
~~~

So the product may itself compose:

~~~text
DIGITAL
+ EDUCATION
+ SUBSCRIPTION
+ HUMAN_SERVICE
+ PROVIDER_NETWORK
~~~

The factory is therefore not a special case outside its own model.

# 11. Projection lenses from one semantic source

One BusinessFactory source should support many bounded projections.

~~~text
BUSINESSGRAPH
     |
     +-> Executive / whole-system map
     |
     +-> Educational lesson view
     |
     +-> Operating / current-attention view
     |
     +-> Provider / vendor network view
     |
     +-> Beneficiary / customer journey
     |
     +-> Capacity / bottleneck view
     |
     +-> Readiness checklist
     |
     +-> Offer / revenue model view
     |
     +-> Evolution / lineage view
~~~

These are projections/questions over the same semantic identities.

~~~text
NEW_LENS != NEW_SOURCE_DATABASE
~~~

VexWork's existing Lens / Operating Domain / Derived Attention patterns are strong lineage for this separation.

# 12. Source ownership model

A mature composition should look approximately like:

~~~text
VexBusinessFactory template source
  owns reusable semantic grammar/profile definitions
        |
        v
Business instance source
  owns selected business structure / bindings
        |
        +-----------------------+
        |                       |
        v                       v
provider/source truth       human evidence
payments                    physical actions
inventory                   approvals
travel supply               screenshots
student platform            acknowledgements
hosting/etc.
        |                       |
        +-----------+-----------+
                    v
current observations / evidence
                    |
                    v
VexWork
  processes / operating domain / attention / admitted work
                    |
                    v
VexBoard
  semantic projection / navigation / Journey / educational views
~~~

Permanent:

~~~text
VEXBOARD != BUSINESSGRAPH_OWNER
VEXWORK != PROVIDER_DATABASE
BUSINESS_TEMPLATE != CURRENT_BUSINESS_STATE
PROFILE_BINDING != PROVIDER_AUTHORITY
QUESTIONNAIRE != EXECUTION
~~~

# 13. Patient-zero BoardGraph projection

A companion example file should use the current accepted VexBoard schema only:

~~~text
projects/vexboard/examples/vexbusinessfactory-intent-topology.board.json
~~~

It demonstrates:

- business semantic concepts projected through existing node kinds;
- business relation roles projected through current relationship families + labels;
- stable refs;
- source refs back to this architecture source;
- one visual SYSTEM_MAP projection;
- no external effects or provider truth.

It is intentionally an example/projection, not the canonical BusinessFactory semantic source schema.

# 14. Generic extraction beyond business

The user intention is broader:

> Once the pattern is concrete and understandable through VexBusinessFactory, could other factories inherit the same structural approach instead of inventing vague/random language?

Likely yes.

Candidate reusable architecture:

~~~text
INTENT
-> categorical semantic slots
-> controlled relationship roles
-> questions that populate slots
-> reusable module templates
-> instance slot bindings
-> source-owned observations
-> many projections
-> explicit traversal/journey
-> Control / Act / Effect for admitted change
~~~

But do not name or freeze a generic VexIntentFactory yet.

The threshold should be:

~~~text
VexBusinessFactory proves the pattern
+
one genuinely different non-business consumer
proves the same slots/relationships are useful
=
extract shared semantic-factory foundation
~~~

This follows Vex's existing culture of earning abstractions from repeated pressure.

# 15. Acceptance questions for the BusinessFactory patient zero

The architecture is working when a fresh AI can answer from source rather than improvisation:

1. What intention is this business trying to realize?
2. Who benefits and in which contextual role?
3. What value/outcome is promised?
4. Which capabilities/resources/capacities are required?
5. Which are self-supplied, internal, vendor/provider delegated, or unknown?
6. What offer/channel/availability model exposes the value?
7. What constitutes commitment/exchange?
8. Who performs realization/fulfillment?
9. What evidence establishes the outcome?
10. What exceptions/recovery routes exist?
11. Which truths must reconcile?
12. Which modules/profile sources are active?
13. Which variations are deliberate?
14. What has evolved over time?
15. Which terms are true named subtypes versus OTHER within an existing category?
16. Which projection should the human see for the current question?
17. Which source/provider actually owns the facts/effects shown?

The patient zero is stronger when the same grammar can express:

~~~text
antique plate seller
restaurant
teacher / course creator
travel agency / OTA
tourism experience operator
digital software/template company
VexBusinessFactory's own business model
~~~

without replacing the universal topology each time.

# 16. What should be implemented first

Do not implement every category as code immediately.

First implementation pressure should be:

~~~text
1. preserve this source
2. preserve one current-schema BoardGraph example
3. use VexBusinessFactory questions to form one synthetic business topology
4. project at least:
     whole-system map
     educational view
     readiness view
5. observe which relationship roles recur
6. only then decide whether VexBoard needs roleRefOrNull
7. prove profile composition + OTHER-within-category + one evolution case
8. later compare against a non-business consumer before generic extraction
~~~

This keeps the architecture concrete enough for AI learning while resisting premature ontology growth.

# Current exact source references

The current architecture reasoning is grounded in these accepted VexWork/VexBoard sources:

~~~text
projects/vexboard/README.md
src/shared/vexboard-model.mjs
vexboard/self-map.json

docs/foundation/PROCESS-MAP.md
docs/foundation/OPERATING-DOMAIN.md
docs/foundation/DERIVED-ATTENTION.md
docs/foundation/ATTENTION-QUEUE.md
docs/foundation/REPOSITORY-GRAPH.md

projects/vexwork-operational-console/commerce-operating-domain.json
~~~

The VexLife-Android SCAE, Convergence Relay and VexLife Atlas / Process Factory lineage named above is taken from the current accepted VexBoard architecture source, which explicitly records those lessons as lineage rather than runtime dependencies.

<!-- [VXG RealForever][VEXWORK][VEXBOARD][VEXBUSINESSFACTORY][INTENT-TOPOLOGY-PATIENT-ZERO] -->
