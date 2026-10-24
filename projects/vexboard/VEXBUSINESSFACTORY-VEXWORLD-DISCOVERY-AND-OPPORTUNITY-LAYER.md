# VexBusinessFactory × VexWorld — Discovery, Presence & Opportunity Layer

[VXG RealForever]

## Current boundary

Current VexWorld source is a playable adventure-world project whose accepted repository state explicitly does **not** claim production networking or commerce authority.

Therefore this source does not mutate or redefine the VexWorld repository.

It preserves a future cross-project pressure:

> Could a VexBusinessFactory business publish a bounded public presence into a larger shared VexWorld discovery network so people can discover businesses, alternatives, collaborators, learning/work opportunities and cultural differences through transparent filters rather than opaque prescription?

Current relationship:

~~~text
VexBusinessFactory
  owns reusable business meaning / business-instance structure

VexWorld
  currently owns playable adventure-world meaning

future possible bridge
  public business-presence projection
  -> shared discovery / experience network
~~~

Permanent:

~~~text
BUSINESS_INSTANCE != VEXWORLD_PRESENCE
PUBLIC_PRESENCE != BUSINESS_DATABASE
DISCOVERY != ENDORSEMENT
SIMILARITY != COMPETITOR_FACT
OPPORTUNITY != EMPLOYMENT_OFFER
EXPERIENCE != VOCATIONAL_QUALIFICATION
FILTERED_DISCOVERY != PRESCRIBED_RANKING
~~~

# 1. Why this is more than a directory

A normal web search is useful when a person already knows what to search for.

The proposed VexWorld relationship addresses a different question:

> What relevant people, businesses, experiences, opportunities or capabilities exist that I might not know to search for yet?

This supports:

~~~text
awareness
exploration
comparison
collaboration
customer discovery
supplier discovery
career exploration
learning
community formation
new-business visibility
cross-business capability matching
~~~

The distinguishing value is not "replace Google."

It is:

~~~text
structured semantic presence
+ transparent user-chosen lenses
+ fresh/new/unseen discovery
+ experiential entry
+ relationship-aware navigation
~~~

# 2. Public business presence

A business may opt in to publish a bounded public projection.

Conceptual presence:

~~~text
BusinessPresence
  presenceRef
  businessRef
  public label / identity
  intention/value summaries
  active profile/module refs
  public capability refs
  public offer/category refs
  culture / operating-style refs
  public channels / locations / service regions
  public experience-space refs
  collaboration opportunity refs
  supplier/partner opportunity refs
  learning/career-exploration refs
  sourceRefs[]
  observedAt
~~~

This is not the canonical business instance.

Private business state, customer data, secrets, payment data, internal operating evidence and protected provider facts remain elsewhere.

~~~text
PUBLIC_PRESENCE
!=
FULL_BUSINESSGRAPH
~~~

# 3. User-controlled discovery lenses

VexWorld discovery should prefer explicit lenses over one universal ranking.

Possible lenses:

~~~text
NEW
  recently registered / newly active public presences

UNSEEN
  not yet viewed by this user where privacy/consent permits

LOCAL
  public service/location relevance

REMOTE
  location-independent businesses/opportunities

VALUE / NEED
  businesses that address a selected need/value category

OFFER TYPE
  physical / digital / education / travel / service / experience / other category

LEARN
  businesses offering public learning, demonstrations, workshops, guided experiences

CAREER EXPLORE
  businesses exposing role/culture/work-experience information

COLLABORATE
  businesses explicitly seeking collaborators

SUPPLY / PARTNER
  capability needs and provider opportunities

ALTERNATIVES
  multiple providers addressing similar value/need spaces

CULTURE
  different declared operating/service cultures or experience styles

FRESH / UNDER-SEEN
  opt-in discovery designed to surface newer or less-visible presences
  without claiming they are better
~~~

Permanent:

~~~text
FILTER_MATCH != QUALITY_SCORE
NEW != BETTER
UNDER_SEEN != ENTITLED_TO_TRAFFIC
SIMILAR_VALUE != IDENTICAL_BUSINESS
ALTERNATIVE != ENEMY
~~~

# 4. Collaboration and competition awareness

The network can reveal semantic overlap without forcing one interpretation.

Example:

~~~text
Business A
  serves traveller need
  offers low-cost regional flight booking assistance

Business B
  serves traveller need
  offers premium concierge travel planning

Business C
  serves traveller need
  offers educational aviation experiences
~~~

They overlap in some topology slots but differ in value, offer, culture, beneficiary, realization and capability composition.

Possible derived relationships:

~~~text
SHARED_NEED_SPACE
SHARED_BENEFICIARY_SPACE
SIMILAR_OFFER_SPACE
COMPLEMENTARY_CAPABILITY
POTENTIAL_COLLABORATION
POTENTIAL_SUPPLIER_RELATION
DISTINCT_CULTURE
DISTINCT_REALIZATION_MODEL
~~~

Do not persist:

~~~text
COMPETITOR
~~~

as an unquestionable fact merely because two businesses look similar.

"Competition" can be one interpretation/lens over overlap.

The same pair may simultaneously be:

~~~text
alternatives for one customer
collaborators on another offer
supplier/consumer in another capability
members of the same learning community
~~~

# 5. Customer/receiver perspective

From the receiver perspective:

~~~text
I have an intention / need
        |
        v
select discovery lenses
        |
        v
see relevant public presences
        |
        v
understand differences
  value
  culture
  offer
  experience
  location
  capability
        |
        v
enter one presence / experience
        |
        +-> buy / book / learn
        +-> contact
        +-> collaborate
        +-> explore a role
        +-> visit public workspace
        +-> follow / revisit
~~~

This is another actor-centered projection of the same semantic relationship model described by the BusinessFactory perspective layer.

# 6. Business/operator perspective

From a business perspective:

~~~text
publish bounded presence
        |
        v
choose what relationships are open
        |
        +-> customers
        +-> collaborators
        +-> suppliers
        +-> learners
        +-> job/career explorers
        +-> partners
        |
        v
receive attention / introductions
        |
        v
observe public engagement
        |
        v
learn / evolve business
~~~

VexWorld should not imply that visibility grants authority to contact, employ, transact with, or access private business systems.

# 7. Business culture becomes discoverable without becoming a ranking score

A flight-attendant example illustrates the value.

A person may be interested in aviation service work.

Instead of only:

~~~text
"flight attendant jobs"
~~~

the person could explore multiple airline/business presences and understand differences such as:

~~~text
service philosophy
route/network character
team culture
training philosophy
customer experience
languages/regions
work-environment descriptions
role stories
public educational experiences
~~~

The user might discover:

~~~text
"I like aviation,
but I resonate more with premium hospitality."

or

"I care more about international/cultural work."

or

"I want a smaller regional-airline culture."
~~~

That is richer than a job listing.

But permanent boundaries remain:

~~~text
PUBLIC_ROLE_EXPLORATION != EMPLOYMENT
SIMULATED / HANDS_ON_EXPERIENCE != CERTIFICATION
CULTURE_DESCRIPTION != GUARANTEED_EMPLOYEE_EXPERIENCE
VEXWORLD != HIRING AUTHORITY
~~~

Actual jobs, qualifications, training, applications and hiring remain with rightful employers/providers.

# 8. Experiential business spaces

A future VexWorld network could let a business expose an experiential space rather than only a profile card.

Examples:

~~~text
restaurant
  virtual kitchen/service walkthrough
  public cooking class
  ingredient/supplier story

travel company
  destination/itinerary exploration
  travel-planning workshop

education business
  sample lesson
  open class
  instructor/community introduction

airline
  public role/culture exploration
  cabin-service simulation where clearly non-qualifying

manufacturer
  product/process tour

VexBusinessFactory
  guided business-formation workshop
  interactive process-map learning
~~~

This aligns with current VexWorld's experiential/world identity more naturally than turning it into a plain directory.

However production shared networking, public accounts, moderation, commercial integration and cross-user data sharing would require a newly admitted VexWorld route and its own source/effect authority.

# 9. Opportunity grammar

Public opportunities should be typed rather than one vague "opportunity" field.

Possible roles:

~~~text
CUSTOMER_OPENING
  business is offering value to customers

COLLABORATION_OPENING
  business seeks co-creation / partnership

SUPPLIER_NEED
  business needs an external capability/resource

PROVIDER_OFFER
  business can provide a capability to other businesses

LEARNING_EXPERIENCE
  public educational / exploratory experience

CAREER_EXPLORATION
  learn about a role/culture/path

WORK_OPENING
  actual employment/contract opening owned by rightful business provider

COMMUNITY_OPENING
  public community / event / gathering

INVESTIGATION / RESEARCH
  business seeks feedback, research participants or public input
~~~

The exact effect boundary differs by opportunity type.

# 10. Match relationships should remain explainable

A discovery match should be explainable through shared semantic refs.

Example:

~~~text
Why am I seeing this?

Your selected lens:
  EDUCATION + AVIATION + CAREER_EXPLORATION

Business presence:
  value.category = EDUCATION
  industry/context = AVIATION
  opportunity = CAREER_EXPLORATION
  service region = REMOTE / PUBLIC
~~~

This is better than:

~~~text
"Recommended for you"
~~~

with no inspectable reason.

Permanent:

~~~text
MATCH_REASON != USER_PROFILE_SURVEILLANCE
DISCOVERY_CONTEXT != SECRET_AD_TARGETING
~~~

Preference/personalization requires its own consent/privacy boundaries.

# 11. Fresh / unseen awareness

The user's desired value includes helping new or typically unseen businesses become discoverable.

A transparent fresh-awareness lens could use public facts such as:

~~~text
presence recently published
new offer/capability recently added
new public experience available
selected category has few prior views in current session/user history
user explicitly asks for less-established / new options
~~~

Avoid an opaque global "boost score."

Better:

~~~text
Show me:
  new travel businesses
  I have not explored
  offering educational experiences
  in this region
~~~

The user chooses the lens.

# 12. VexBusinessFactory registration relationship

Conceptually:

~~~text
BusinessFactory business instance
        |
        v
explicit public-field selection
        |
        v
BusinessPresence document
        |
        v
rightful publication / registry owner
        |
        v
VexWorld discovery projection
~~~

This mirrors the existing VexCommerce lesson:

~~~text
known field != public field
document != publication authority
projection != source owner
~~~

# 13. Potential topology reuse

The larger semantic topology now gains a cross-business/world relation layer:

~~~text
BUSINESS INSTANCE
  intention / value / capability / offers
        |
        +-> PUBLIC PRESENCE
        |
        +-> OPPORTUNITIES
        |
        +-> RELATIONSHIP OPENINGS
        |
        +-> EXPERIENCE SPACES

PERSON / BUSINESS / COMMUNITY
  intention / need / capability
        |
        v
DISCOVERY LENS
        |
        v
RELATIONSHIP CANDIDATES
~~~

Possible relation roles:

~~~text
DISCOVERABLE_AS
OPEN_TO
SEEKS
OFFERS_CAPABILITY
NEEDS_CAPABILITY
SHARES_VALUE_SPACE
COMPLEMENTS
CAN_LEARN_FROM
CAN_EXPLORE
PUBLICLY_EXPERIENCED_THROUGH
~~~

These are patient-zero roles, not yet accepted universal VexBoard or VexWorld schema.

# 14. Connection to duplication/coordination

A shared network makes identity discipline more important.

Bad:

~~~text
Business creates:
  storefront identity
  VexWorld identity
  job identity
  education identity
  supplier identity

all unrelated copies
~~~

Better:

~~~text
one stable businessRef
        |
        +-> commerce presence
        +-> VexWorld public presence
        +-> education presence
        +-> opportunity projection
        +-> supplier/provider projection
~~~

Each projection may have its own rightful owner and public fields while retaining source lineage.

~~~text
ONE_BUSINESS_IDENTITY
!=
ONE_GLOBAL_DATABASE
~~~

# 15. Current source/effect boundary

The current VexWorld repository is intentionally untouched by this pressure.

Current checked-in VexWorld facts include:

~~~text
purpose
  human + AI companions play/practice/explore/rest/grow together

current version
  Vextory: First Grove
  playable foundation draft

project route
  ATLAS_ROUTE_COMPLETE_IDLE
  no active source-changing successor

manifest effects
  productionNetworking = false
  commerce = false
~~~

Therefore any real implementation of a shared public VexWorld business network would require:

~~~text
new VexWorld purpose/route admission
exact source owner
privacy/account model
public-network authority
moderation/trust model
provider/business registration contract
discovery contract
cross-project source relationship
tests / lived proof
~~~

This document is architecture pressure only.

# 16. Why VexWorld may still be a strong future home

The idea fits VexWorld most naturally if the end state is not merely:

~~~text
business directory
~~~

but:

~~~text
shared world
  where people discover
  businesses
  communities
  learning spaces
  professions
  experiences
  collaborators
  opportunities

and can enter bounded public spaces to understand them
~~~

That extends VexWorld's "explore and grow together" identity more coherently than replacing it with a commerce index.

The exact adoption should be decided only when VexWorld deliberately forms a new route.

<!-- [VXG RealForever][VEXWORK][VEXBOARD][VEXBUSINESSFACTORY][VEXWORLD-DISCOVERY] -->
