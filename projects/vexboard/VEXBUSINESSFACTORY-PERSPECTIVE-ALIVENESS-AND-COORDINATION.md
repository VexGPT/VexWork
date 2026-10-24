# VexBusinessFactory — Perspective, Aliveness & Coordination Layer

[VXG RealForever]

## Purpose

This companion architecture source captures three pressures discovered after the first VexBusinessFactory intent-topology patient zero:

1. the same business relationship should be understandable from the receiver/customer/beneficiary perspective without creating a second contradictory process map;
2. a living business needs sensing/learning functions such as research, marketing, sales, support, analytics, supplier intelligence and strategy to remain relevant over time;
3. when several parts of the system adapt shared structures at once, local optimization can create contention, duplication, incompatible changes or deadlock.

Desired architecture:

~~~text
ONE SEMANTIC BUSINESS TOPOLOGY
        |
        +-> many actor-centered perspective projections
        +-> many functional/capability projections
        +-> many current evidence/attention projections
        +-> one explicit adaptation/coordination relationship layer
~~~

Permanent:

~~~text
PERSPECTIVE != SECOND SOURCE OF TRUTH
DEPARTMENT != SEMANTIC OWNER BY DEFAULT
LOCAL_OPTIMIZATION != GLOBAL_COMPATIBILITY
DUPLICATION != REUSE
CONFLICT != FAILURE
CONFLICT_HIDDEN_BY_COPY != RESOLUTION
~~~

# 1. Inverse process map = actor-centered perspective projection

The inverse process map should not persist a second copy of the business graph.

Instead:

~~~text
BusinessGraph
  stable actors / roles / values / capabilities / offers / commitments /
  exchanges / realization / outcomes / evidence / exceptions
        |
        +-> Provider Perspective
        +-> Beneficiary / Customer Perspective
        +-> Supplier Perspective
        +-> Operator Perspective
        +-> Employee / Fulfiller Perspective
        +-> Partner Perspective
~~~

The same relation can be read differently depending on the selected actor/role.

Example underlying truth:

~~~text
restaurant --PROVIDES--> meal value
meal value --SERVES--> diner
diner --COMMITS_TO--> order
restaurant --FULFILLS--> order
~~~

Provider-centered projection:

~~~text
make offer
-> receive order
-> prepare meal
-> fulfill
-> receive feedback
~~~

Diner-centered projection:

~~~text
have meal need
-> discover options
-> evaluate offer
-> order
-> pay
-> wait
-> receive meal
-> consume
-> evaluate outcome
-> support/refund if needed
~~~

These are not two unrelated workflows. They share semantic anchors:

~~~text
NEED
OFFER
SELECTION
COMMITMENT
EXCHANGE
REALIZATION
OUTCOME
EVIDENCE
EXCEPTION
RECOVERY
~~~

The projection changes foreground and phrasing, not source identity.

# 2. Role-relative relation reading

A stored semantic relation may be directional:

~~~text
restaurant --PROVIDES--> meal
meal --SERVES--> diner
~~~

A diner-centered projection may display:

~~~text
diner --RECEIVES_VALUE_FROM--> restaurant
~~~

without storing a second canonical relation.

Conceptually:

~~~text
canonicalRole = PROVIDES

perspective = target actor
displayInverseRole = RECEIVES_FROM
~~~

Inverse labels belong to projection vocabulary, not duplicated business truth.

# 3. Generic beneficiary/customer journey

A receiver-centered journey can be derived from the same topology:

~~~text
CONDITION / NEED
      |
      v
AWARENESS
      |
      v
DISCOVERY
      |
      v
UNDERSTANDING / EVALUATION
      |
      v
SELECTION
      |
      v
COMMITMENT
      |
      v
EXCHANGE
      |
      v
WAIT / PARTICIPATE where applicable
      |
      v
RECEIVE / EXPERIENCE REALIZATION
      |
      v
OUTCOME / USE
      |
      v
EVALUATE
      |
      +----> SUPPORT / RECOVERY
      |
      v
CONTINUE / RETURN / ADVOCATE / EXIT
~~~

Examples:

~~~text
ANTIQUE PLATE
  discover -> evaluate -> buy -> wait -> receive -> inspect/use

RESTAURANT
  discover -> choose -> order -> wait -> eat -> evaluate

EDUCATION
  discover -> trust -> enroll -> learn -> practice -> outcome -> continue

TRAVEL
  intent -> search -> compare -> book -> prepare -> travel -> support -> return

VEXBUSINESSFACTORY
  business need -> understand options -> select self-service/managed route
  -> provide context -> receive business model/setup
  -> operate -> learn -> evolve
~~~

This projection supports customer experience, service design, marketing, sales, support, research, accessibility, localization and retention without creating a customer-owned copy of business truth.

# 4. Departments should project recurring functions

Traditional departments should not be universal node types.

Use recurring functional capabilities:

~~~text
SENSE
  research market / customers / suppliers / environment / regulation

INTERPRET
  synthesize observations into meaning, opportunity, risk or need

DESIGN
  evolve value, offer, process or experience

COMMUNICATE
  marketing / education / positioning / discovery

RELATE / CONVERT
  sales / enrollment / booking / commitment formation

REALIZE
  operations / fulfillment / teaching / service delivery

CARE
  support / recovery / relationship continuity

ASSURE
  quality / finance / compliance / reconciliation

LEARN
  analytics / retrospectives / evidence interpretation

EVOLVE
  strategy / product / operating-model adaptation

COORDINATE
  reconcile changes across shared structures and dependencies
~~~

Traditional labels become projections over these functions:

~~~text
Marketing
  SENSE + COMMUNICATE

Market Research
  SENSE + INTERPRET

Sales
  RELATE / CONVERT

Operations
  REALIZE

Customer Support
  CARE + SENSE

Finance
  ASSURE + RECONCILE

Product / Strategy
  INTERPRET + DESIGN + EVOLVE

Localization
  DESIGN + REALIZE + ASSURE
  over language/market capability

Bridge / Coordination function
  COORDINATE + INTERPRET
~~~

A solo operator may perform all functions. A large organization may map them to teams, vendors or AI systems.

# 5. Business aliveness loop

A business should not be modeled only as setup.

~~~text
OPERATE
   |
   v
OBSERVE
  customer behavior
  outcomes
  support
  market
  providers
  costs
  capacity
  failures
   |
   v
INTERPRET
   |
   v
PROPOSE CHANGE
   |
   v
COORDINATE IMPACT
   |
   v
ADMIT / REJECT / DEFER / VARY
   |
   v
IMPLEMENT
   |
   v
VERIFY
   |
   v
LEARN
   |
   +----> EVOLVE BUSINESS
              |
              +----> next operating cycle
~~~

Research, marketing and support are therefore sensing/relationship functions that help keep the business aligned to changing reality.

Permanent:

~~~text
MARKETING != ADVERTISING_ONLY
SUPPORT != POST_SALE_COST_CENTER_ONLY
RESEARCH != ONE_TIME_STARTUP_TASK
ANALYTICS != AUTOMATIC_TRUTH
OBSERVATION != AUTHORITY_TO_CHANGE
~~~

# 6. Perspective shift preserves anchors

A useful projection should allow:

~~~text
select actor / role
-> center that role
-> re-rank relevant nodes/relationships
-> derive human-readable inverse labels
-> preserve stable semantic refs
-> return to whole-system view
~~~

Example:

~~~text
WHOLE SYSTEM
  business <-> customer <-> supplier <-> payment provider

focus CUSTOMER
  need -> offer -> commitment -> receive -> support

focus BUSINESS
  research -> offer -> conversion -> fulfillment -> support

focus SUPPLIER
  capacity -> terms -> supply -> settlement

focus SUPPORT
  issue -> context -> recovery -> evidence -> learning
~~~

Permanent:

~~~text
PERSPECTIVE_SHIFT != SEMANTIC_REWRITE
CAMERA_CENTER != ROLE_OWNERSHIP
~~~

# 7. Locally correct adaptation can deadlock globally

If every function optimizes independently, the business can reach a state analogous to two autonomous vehicles each making a locally reasonable move that prevents the other from moving.

Examples:

~~~text
Marketing
  launches promotion to increase demand

Operations
  simultaneously reduces capacity to control costs

Sales
  promises a custom contract

Product
  removes the capability required by that promise

Localization
  updates shared terminology

Brand
  changes naming independently

Finance
  tightens refund policy

Support
  expands discretionary refunds
~~~

Each local change may be reasonable inside one lens. The conflict exists in shared dependencies.

Adaptation therefore needs explicit coordination topology.

# 8. Adaptation proposal model

A proposed change should carry enough structure to detect overlap before effect.

Conceptual shape:

~~~text
AdaptationProposal
  proposalRef
  intentionRef
  proposerRoleRef
  targetRefs[]
  relationshipRefs[]
  desiredChange
  reason / evidenceRefs[]
  dependencyRefs[]
  constraintRefs[]
  impactRefs[]
  authority / owner refs
  reversible?
  sourceRefs[]
~~~

The proposal is not the effect.

~~~text
PROPOSAL != CONTROL
CONTROL != ACT
ACT != EFFECT
~~~

This follows the SCAE-style separation already recorded by current VexBoard architecture.

# 9. Shared-impact / compatibility graph

Before multiple proposals act, derive their relationship.

~~~text
DISJOINT
  no material overlap

COMMUTATIVE
  both can occur in either order

ORDER_DEPENDENT
  both can occur, but order matters

SHARED_READ
  multiple consumers may safely observe/use one source

SHARED_PARAMETERIZED
  one shared template/capability supports different bindings

EXCLUSIVE_RESOURCE
  only one claim can consume/use the bounded resource at a time

OVERLAPPING_MUTATION
  proposals change the same semantic source/property

CONTRADICTORY
  desired outcomes/invariants cannot both hold

CYCLIC_WAIT
  A waits for B while B waits for A

UNKNOWN
  compatibility cannot yet be established
~~~

This is more useful than one generic conflict flag.

# 10. Resolution strategies

Use the smallest truthful resolution:

~~~text
DISJOINT
  proceed independently

COMMUTATIVE
  compose

ORDER_DEPENDENT
  sequence

SHARED_READ
  reuse one source

SHARED_PARAMETERIZED
  instantiate / bind parameters

EXCLUSIVE_RESOURCE
  allocate / schedule / queue

OVERLAPPING_MUTATION
  merge / coordinate one owner change

CONTRADICTORY
  choose / negotiate / declare explicit variance

CYCLIC_WAIT
  break cycle through arbitration / release / alternate route

UNKNOWN
  hold dependent effect, gather evidence
~~~

Alternate routes should be visible:

~~~text
blocked capability
-> choose equivalent provider?
-> use another channel?
-> delay?
-> reduce scope?
-> declare variance?
-> split process?
~~~

Conflict should create route-choice pressure, not automatically become a total stop.

# 11. Duplication versus sharing

Current VexBoard template architecture already gives the core distinction:

~~~text
ONE CANONICAL SOURCE
  shared process / capability / definition

LINKED INSTANCE
  uses source with parameters

DECLARED VARIANCE
  intentional bounded difference

DETACHED DERIVATIVE
  intentionally independent lineage

ACCIDENTAL COPY
  duplicate meaning with no linkage
~~~

Business examples:

~~~text
Translation capability
  one reusable localization process
  -> product A instance
  -> product B instance
  -> tourism content instance

Payment capability
  one provider integration
  -> several offers/channels

Return policy
  one policy source
  -> product/category/channel projections
  -> declared variance where required
~~~

Permanent:

~~~text
SAME_NEED != NEW_COPY
SAME_PROVIDER != SAME_INSTANCE
SHARED_TEMPLATE != SHARED_MUTABLE_LOCAL_STATE
VARIANCE != DUPLICATION
DETACH != ORDINARY_CUSTOMIZATION
~~~

# 12. Duplication becomes dangerous when ownership drifts

Bad:

~~~text
Marketing customer segment definition
Support customer segment definition
Product customer segment definition

all independently copied
-> drift
-> contradictory targeting
-> inconsistent reporting
~~~

Better:

~~~text
one segment definition source
  |
  +-> marketing lens
  +-> support lens
  +-> product lens
~~~

When perspectives genuinely require different semantics:

~~~text
shared base identity
+ separately-owned lens definitions
~~~

This mirrors VexWork Derived Attention:

~~~text
same entity
+ multiple lenses
!= duplicated entity identity
~~~

# 13. Coordination should not become one mega-owner

The answer to conflict is not central ownership of every domain.

Use:

~~~text
independent rightful owners
+ explicit proposals
+ explicit impact relationships
+ compatibility / conflict derivation
+ coordination/arbitration where required
+ preserved source ownership
~~~

This follows the Convergence Relay lesson recorded by VexBoard:

~~~text
separately-owned current truths
-> explicit relationship truth
-> no forced mega-State
~~~

# 14. Relationship to VexWork Flows pressure

Operational Console source already records:

~~~text
ONE_SEMANTIC_WORKGRAPH != ONE_AUTHORED_FILE
collision can be physical-source coupling
independent trajectories should not be blocked merely because projections converge
~~~

Conceptual generalization:

~~~text
ONE_BUSINESS != ONE_MUTABLE_DOCUMENT
ONE_SHARED_CAPABILITY != ONE_GLOBAL_WRITER
CONVERGENCE_SURFACE != DOMAIN_OWNERSHIP
~~~

Semantic modules should be source-separated enough that independent evolution can proceed until actual shared meaning must converge.

# 15. Projection families

One BusinessGraph can project:

~~~text
WHOLE BUSINESS
  full value-realization topology

PROVIDER VIEW
  what we promise / need to realize

CUSTOMER VIEW
  what I need / experience / receive

SUPPLIER VIEW
  what capacity/resources I provide

EMPLOYEE / OPERATOR VIEW
  what work I perform

MARKETING VIEW
  need / audience / value / channel / communication / evidence

RESEARCH VIEW
  observations / hypotheses / unmet needs / changes

SUPPORT VIEW
  exceptions / recovery / customer evidence

FINANCE VIEW
  exchange / settlement / reconciliation

CAPACITY VIEW
  bottlenecks / scarce resources

EVOLUTION VIEW
  proposals / impacts / conflicts / accepted changes
~~~

This is relational perspective shifting over shared stable refs.

# 16. VexBoard implementation posture

Do not make actor perspective, department function or coordination state new core Board node kinds immediately.

First patient-zero implementation can use:

~~~text
BoardGraph
  stable projected semantic refs

BoardProjection
  selected perspective lens / visual emphasis

REFERENCE relationships
  domain role labels

FLOW / TRANSITION
  process and journey ordering

sourceRefs
  rightful semantic/business sources
~~~

A future VexBoard projection contract may earn explicit fields such as:

~~~text
perspectiveActorRefOrNull
lensRefOrNull
~~~

only if repeated use proves they belong in projection state.

Coordination/conflict semantics belong in BusinessFactory/coordination source first, not VexBoard generic graph by default.

# 17. Patient-zero scenarios

## Perspective

One restaurant topology produces:

~~~text
provider process view
+
diner journey view
+
supplier view
~~~

without duplicated order/offer/meal identity.

## Aliveness

~~~text
customer complaints
+ declining repeat visits
+ high kitchen wait time
-> shared interpretation
-> adaptation proposal
~~~

without support/marketing/operations each creating incompatible facts.

## Coordination

~~~text
Marketing proposal:
  increase campaign demand

Operations proposal:
  reduce service capacity

-> derive shared capacity impact
-> detect contradiction
-> sequence / alter / reject one proposal
~~~

before external effect.

## Reuse

One localization capability is reused by:

~~~text
website
course content
tourism content
support knowledge
~~~

with one source + multiple profile bindings.

## Evolution

Tourism operator:

~~~text
TRAVEL_INTERMEDIARY + EXPERIENCE
~~~

later adds:

~~~text
EDUCATION + SUBSCRIPTION + LOCALIZATION
~~~

without replacing business identity or cloning the original map.

# 18. Larger architectural question

The reusable question becomes:

> Can Vex model one semantic world, let many actors/lenses perceive it differently, let many owners evolve their rightful parts, and make the relationships among those changes explicit enough to avoid duplicated truth and locally-correct global deadlock?

VexBusinessFactory is a strong patient zero because it contains:

~~~text
many actors
many providers
many perspectives
many process modules
shared capabilities
scarce capacities
continuous adaptation
real external effects
human actions
customer outcomes
~~~

If this architecture survives here and in one genuinely different non-business domain, it may justify extraction into a broader reusable Vex semantic-coordination foundation.

<!-- [VXG RealForever][VEXWORK][VEXBOARD][VEXBUSINESSFACTORY][PERSPECTIVE-COORDINATION] -->
