# VexBusinessFactory — User-Directed Discovery, Promotion & Attention

[VXG RealForever]

## Purpose

This source distinguishes several things that ordinary advertising systems often collapse together:

~~~text
DISCOVERY
  help a person find something relevant or interesting

PROMOTION
  a business intentionally seeks visibility

SPONSORED PLACEMENT
  visibility is paid for

PERSONALIZATION
  system adapts presentation using permitted user context

EXPLORATION
  user explicitly asks to go beyond the familiar
~~~

The design goal is not to make advertising more intrusive.

It is to let users intentionally invite discovery while keeping paid influence visible, bounded and separate from organic relevance.

Permanent:

~~~text
DISCOVERY != ADVERTISING
PAID != RELEVANT
RELEVANT != ENDORSED
SPONSORED != ORGANIC
USER_INTENT != PERMISSION_TO_PROFILE_EVERYTHING
PAST_INTEREST != CURRENT_DESIRE
FAMILIARITY != ALWAYS_DESIRED
NOVELTY != RANDOM_NOISE
ATTENTION != COMMODITY_OWNED_BY_ADVERTISER
~~~

## 1. Start from discovery intent

Instead of assuming a user always wants more of what they previously consumed, ask or infer only from the explicit current request what kind of exploration they want.

Provisional discovery modes:

~~~text
FAMILIAR
  more within known interests

ADJACENT
  neighboring categories / related experiences

NOVEL
  materially different from recent/familiar activity

SURPRISE_ME
  bounded serendipity within user constraints

NEW
  recently created / recently registered / newly available

UNDER_SEEN
  less-exposed eligible options without claiming they are better

LOCAL
  geographically relevant options when location is intentionally in scope

REMOTE
  location-independent possibilities

LEARN
  educational / explanatory experiences

EXPERIENCE
  things to try / visit / participate in

COLLABORATE
  people/businesses seeking collaboration

OPPORTUNITY
  career / vendor / supplier / project / community openings
~~~

Modes can compose.

Example:

~~~text
NOVEL
+ LOCAL
+ EXPERIENCE
+ UNDER_SEEN
~~~

means something very different from:

~~~text
more of what I usually click
~~~

## 2. Novelty should be explicit

A user may intentionally say:

~~~text
I'm bored of this.
Show me something fresh.
I want to try something I normally would not.
Give me a new experience.
Show me something small / new / unseen.
~~~

That should change the discovery objective.

Conceptually:

~~~text
DiscoveryIntent
  modeRefs[]
  includeCategoryRefs[]
  excludeCategoryRefs[]
  locationScopeOrNull
  timeScopeOrNull
  noveltyStrength
  familiarityLimit
  sponsoredPreference
  sourceScopeRefs[]
~~~

The exact schema is not yet admitted. The point is to make novelty a user-selected objective rather than an accidental side effect.

## 3. Private VexLife context must remain bounded

VexLife may eventually hold rich personal continuity about a person's universe.

That does not mean VexWorld or businesses should receive that private history.

Preferred relationship:

~~~text
private VexLife context
        |
        v
user explicitly initiates discovery
        |
        v
bounded DiscoveryRequest
  only the categories/preferences needed for this request
        |
        v
VexWorld / provider discovery
~~~

Permanent:

~~~text
PRIVATE_LIFE_CONTEXT != AD_TARGETING_DATABASE
DISCOVERY_REQUEST != FULL_MEMORY_EXPORT
BUSINESS_MATCH != ACCESS_TO_USER_HISTORY
MODEL_CONVERSATION != ADVERTISER_DATA
~~~

The user should be able to choose whether a request uses:

~~~text
CURRENT_REQUEST_ONLY
EXPLICIT_SAVED_PREFERENCES
SELECTED_HISTORY_SCOPE
NO_PERSONALIZATION
~~~

## 4. Current advertising practice confirms the need for explicit control

Current major advertising systems already expose some user controls, but typically remain ad-first rather than exploration-first.

Examples from current official sources:

~~~text
Google My Ad Center
  users can ask for more/fewer ads about selected topics/brands
  and can turn personalized ads on/off

Apple Advertising
  users can review targeting information and disable personalized ads
~~~

Reference:

~~~text
https://support.google.com/My-Ad-Center-Help/answer/12155451
https://support.apple.com/guide/iphone/control-how-apple-delivers-advertising-to-you-iphf60a6a256/ios
~~~

Vex's desired pressure is different:

~~~text
not only
  control which ads interrupt me

but
  let me explicitly ask for discovery
  and choose how familiar / novel / local / under-seen it should be
~~~

## 5. Candidate sources should remain distinguishable

A discovery result set may combine several sources:

~~~text
ORGANIC_SEMANTIC_MATCH
  public presence matches user's explicit discovery intent

NEW / UNDER_SEEN CANDIDATE
  eligible because user selected freshness/visibility lens

COMMUNITY_SIGNAL
  aggregate public/consented evidence that an experience was useful/enjoyed

EDITORIAL / CURATED
  selected by a declared curator/source

SPONSORED
  business paid for eligible exposure

PARTNER / AFFILIATE
  commercial relationship exists
~~~

These sources must not be silently flattened.

## 6. Paid promotion is a separate lane

If paid promotion exists, it should be visually and semantically explicit.

Conceptually:

~~~text
Organic discovery
  ranked / filtered by user-selected discovery intent

Sponsored discovery
  separately labeled candidate
  must still satisfy eligibility / safety / user filters
  never presented as an organic match
~~~

Possible user choices:

~~~text
SHOW_SPONSORED
SHOW_FEWER_SPONSORED
HIDE_SPONSORED_FOR_THIS_EXPLORATION
SPONSORED_ONLY_WHEN_STRONGLY_MATCHED
~~~

Permanent:

~~~text
PAY_FOR_EXPOSURE != PAY_FOR_TRUST
SPONSORED_PLACEMENT != ORGANIC_RANK
AD_BUDGET != QUALITY
BUSINESS_PAYMENT != USER_CONSENT
~~~

## 7. Explain why each result appeared

Every recommendation/discovery should be able to answer:

~~~text
Why am I seeing this?
~~~

Examples:

~~~text
You asked for:
  NOVEL + LOCAL + LIVE_MUSIC

This presence matches:
  LIVE_MUSIC capability
  local service area
  new public presence

or

You selected UNDER_SEEN restaurants.
This is a recently registered restaurant in your selected area.

or

Sponsored
  paid placement
  still matches your explicit travel-experience filter
~~~

No opaque 'recommended for you' is required when an inspectable reason can be shown.

## 8. Serendipity can be gamified without becoming compulsive advertising

VexWorld could offer user-invited exploration modes such as:

~~~text
DISCOVERY QUEST
  explore one unfamiliar category

LOCAL SURPRISE
  one nearby experience outside recent patterns

NEWCOMER TRAIL
  visit several recently-created public presences

CULTURE HOP
  sample different business/creative cultures

SKILL DABBLE
  try a short educational experience in a new domain

RANDOM WITH CONSTRAINTS
  serendipity inside explicit safety/location/time constraints
~~~

The user begins the mode.

~~~text
GAMEFUL_EXPLORATION != ATTENTION_HIJACKING
REWARD_LOOP != DARK_PATTERN
~~~

## 9. Community evidence should not become 'people like you' surveillance

The system may eventually use aggregate community evidence, but should distinguish:

~~~text
many people enjoyed this

from

people inferred to be like you enjoyed this
~~~

The first is a public/aggregate signal.
The second requires much stronger privacy and inference safeguards.

Preferred early pressure:

~~~text
semantic novelty
+ explicit user constraints
+ transparent public/aggregate evidence
~~~

rather than covert demographic/behavioral similarity profiling.

## 10. Business-side visibility options

A business may seek awareness through several non-equivalent routes:

~~~text
ORGANIC PRESENCE
  publish a truthful public presence and match user discovery lenses

NEWCOMER ELIGIBILITY
  become visible when users explicitly select NEW / UNDER_SEEN

OPEN OPPORTUNITY
  publish collaboration / supplier / learning / career openings

PUBLIC EXPERIENCE
  offer something a user can explore directly

SPONSORED PROMOTION
  pay for explicitly labeled eligible exposure

COMMUNITY PARTICIPATION
  build relationships / contribute value
~~~

This gives small/new businesses meaningful ways to become discoverable besides buying interruption.

## 11. Attention should be user-shaped

Traditional advertising asks:

~~~text
How do we acquire this person's attention?
~~~

Vex discovery should ask:

~~~text
What kind of attention is the user intentionally willing to give right now?
~~~

Possible attention modes:

~~~text
PURPOSEFUL_SEARCH
EXPLORATION
LEARNING
ENTERTAINMENT
LOCAL_DISCOVERY
CAREER_EXPLORATION
COLLABORATION
SHOPPING
NO_PROMOTION
~~~

This allows the same person to have very different discovery expectations in different moments.

## 12. Relationship to BusinessFactory aliveness

Businesses still need marketing / communication / research functions.

The distinction is:

~~~text
COMMUNICATE
  explain what exists / why it matters

DISCOVERY
  help relevant people find it

PROMOTION
  intentionally increase visibility

ADVERTISING
  one possible paid promotion mechanism
~~~

BusinessFactory should teach these as different functions.

## 13. Relationship to VexWorld

VexWorld is the likely future experiential discovery projection if its own project deliberately admits that route.

Conceptually:

~~~text
Business / creator public presences
        |
        v
VexWorld candidate pool
        |
        +-> user-selected discovery lens
        +-> freshness / novelty objective
        +-> public availability
        +-> opportunity type
        +-> optional sponsored candidates
        |
        v
explainable results
        |
        v
explore / learn / contact / buy / book / collaborate
~~~

VexWorld should not need to expose an opaque global score.

## 14. Relationship to vendor availability

The discovery layer can compose with the previously preserved Vendor Discovery & Availability Bridge.

Example:

~~~text
user:
  I want something new to do Saturday night.

DiscoveryIntent:
  NOVEL + LOCAL + EXPERIENCE

candidate spaces:
  live music
  food events
  classes
  tours
  community events

availability bridge:
  filter for actual Saturday availability / quote routes
~~~

Novel discovery therefore becomes actionable rather than merely inspirational.

## 15. Future project pressure

A bounded future project may eventually be justified:

~~~text
User-Directed Discovery & Promotion
~~~

Possible components:

~~~text
DiscoveryIntent
PublicPresence candidate index
explainable match reasons
novelty / freshness lenses
under-seen eligibility
availability composition
sponsored-candidate separation
user feedback / hide / more / less
privacy-bounded preference projection
serendipity / exploration journeys
~~~

Do not admit this as a Workgraph project merely from this architecture note.

## 16. Acceptance principles

Any later implementation should preserve:

1. the user can explicitly request novelty rather than receiving only familiar-interest optimization;
2. private VexLife context is not exposed to advertisers/businesses by implication;
3. paid sponsorship is always distinguishable from organic discovery;
4. every result can expose an understandable match reason;
5. users can reduce/hide sponsored candidates and change discovery modes;
6. new/under-seen businesses can be discovered through user-selected lenses without being falsely ranked as better;
7. aggregate community evidence does not silently become sensitive similarity profiling;
8. availability/currentness remains separately sourced;
9. exploration can be playful without using dark patterns to capture attention;
10. business marketing, discovery, promotion and advertising remain distinct concepts.

<!-- [VXG RealForever][VEXWORK][OPERATIONAL-CONSOLE][VEXBUSINESSFACTORY][USER-DIRECTED-DISCOVERY] -->
