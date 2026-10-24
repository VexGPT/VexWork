# VexBusinessFactory — Ambient Discovery, What's New & Contextual Relevance

[VXG RealForever]

## Purpose

This source captures a future cross-project pressure for VexLife / VexWorld / VexBusinessFactory:

> Businesses and creators should be able to publish bounded public updates such as new menu items, new events, upcoming availability, new media, new services or opportunities. A person may explore those updates directly, or their trusted model may periodically inspect permitted discovery scopes and surface only what is timely and contextually appropriate.

The design is not an infinite-scroll advertising feed.

It is a user-owned awareness layer.

Permanent:

~~~text
UPDATE != ADVERTISEMENT
MATCH != SURFACE_NOW
INTEREST != INTERRUPTION_PERMISSION
MODEL_AWARENESS != BUSINESS_ACCESS_TO_PRIVATE_CONTEXT
PRIVATE_CIRCUMSTANCE != PUBLIC_DISCOVERY_ATTRIBUTE
SUPPRESSION != DISLIKE
NOT_NOW != NEVER
~~~

## 1. Public update events

A business/creator/public presence may publish bounded update events.

Conceptual update classes:

~~~text
NEW_OFFER
UPDATED_OFFER
NEW_MENU_ITEM
LIMITED / SEASONAL_ITEM
UPCOMING_EVENT
EVENT_CHANGED
NEW_AVAILABILITY
NEW_LOCATION / POPUP
NEW_SERVICE
NEW_EXPERIENCE
NEW_CONTENT / PUBLICATION
NEW_CLASS / COURSE
COLLABORATION_OPENING
CAREER / WORK_OPENING
SUPPLIER_NEED
COMMUNITY_UPDATE
PUBLIC_NOTICE
~~~

Conceptual event shape:

~~~text
PublicUpdate
  updateRef
  presenceRef
  updateClass
  label / summary
  effectiveFrom / effectiveUntil where applicable
  locationScopeOrNull
  capability / offer / event refs
  targetRouteRef
  sourceRefs[]
  observedAt
~~~

The update points back to rightful source meaning. VexWorld/VexLife should not need to duplicate the business record.

## 2. What's New is a projection, not another source database

Possible projections:

~~~text
WHAT'S NEW
  recent eligible updates

UPCOMING
  future events / openings / availability

NEAR ME / IN SELECTED AREA
  only when location is explicitly in scope

FROM PLACES I FOLLOW
  known public presences

DISCOVER SOMETHING NEW
  new / adjacent / novel public presences

OPPORTUNITIES
  work / collaboration / supplier / learning openings
~~~

Each result should route to the exact semantic destination when possible:

~~~text
update
-> exact event / menu item / class / offer / opportunity
-> surrounding business/public presence context
~~~

not merely to a generic home page.

## 3. Relevance and appropriateness are separate predicates

A model may judge:

~~~text
RELEVANT
  this matches a current interest / intention

TIMELY
  this matters within the relevant time window

ACTIONABLE
  the user could realistically do something with it now

APPROPRIATE_TO_SURFACE
  the current human context makes interruption/helpful mention reasonable
~~~

These must not collapse.

Example:

~~~text
user enjoys tasting-menu restaurants
new restaurant event matches interest
but user has explicitly said:
  no discretionary-spending suggestions this month

result:
  RELEVANT = true
  APPROPRIATE_TO_SURFACE = false
~~~

The business does not learn why the update was suppressed.

## 4. Private context gate

Private VexLife/model context may influence presentation only within the user's chosen privacy boundary.

Possible private, user-owned presentation constraints:

~~~text
DO_NOT_INTERRUPT
NO_PURCHASE_SUGGESTIONS
BUDGET_CONSTRAINED
TRAVEL_NOT_POSSIBLE_NOW
FOCUS_MODE
GRIEF / HIGH-STRESS HOLD
HEALTH / ACCESSIBILITY CONSTRAINT
BUSY / SCHEDULE_CONSTRAINED
USER_SAID_NOT_NOW
~~~

These examples are private presentation context, not attributes that should be exported to businesses, advertisers or public discovery.

Important:

~~~text
MODEL MAY USE EXPLICIT / PERMITTED PRIVATE CONTEXT
!= 
SYSTEM MAY INFER SENSITIVE CIRCUMSTANCES FOR AD TARGETING
~~~

When a constraint is uncertain, prefer restraint or ask the user rather than inventing a sensitive circumstance.

## 5. Ambient model chore / digest

A trusted model could eventually perform a bounded recurring discovery task only when the user has opted into that behavior.

Conceptual flow:

~~~text
user authorizes discovery chore
        |
        v
query permitted update sources
        |
        v
apply discovery intent
        |
        v
apply currentness / freshness
        |
        v
apply private presentation gate
        |
        v
classify
  SURFACE_NOW
  SAVE_FOR_LATER
  MENTION_IN_RELEVANT_CONTEXT
  SUPPRESS
        |
        v
bounded digest / contextual mention
~~~

The model should not behave as an over-enthusiastic notification engine.

Useful presentation styles:

~~~text
MORNING DIGEST
  'Three things changed in spaces you follow.'

CONTEXTUAL MENTION
  while discussing weekend plans:
  'The place you liked has a new Saturday event.'

QUIET SAVE
  preserve for the next time that topic becomes relevant

NO SURFACE
  interesting but currently inappropriate
~~~

## 6. Missing something should remain possible

The system should not claim omniscience.

~~~text
DISCOVERY COVERAGE != COMPLETE WORLD KNOWLEDGE
MODEL DID NOT MENTION != UPDATE DID NOT EXIST
SUPPRESSED != IRRELEVANT
~~~

A user should still be able to open What's New and inspect the broader eligible stream themselves.

## 7. Finite awareness, not compulsive feed design

Preferred early shape:

~~~text
finite digest
clear update count
time-bounded sections
explicit refresh
user-selected scopes
inspectable reasons
no hidden infinite-scroll optimization
~~~

Possible sections:

~~~text
NEW TODAY
THIS WEEK
UPCOMING
PLACES / PEOPLE I FOLLOW
NEW TO ME
OPPORTUNITIES
SAVED FOR LATER
~~~

Gameful exploration may exist as an explicit mode, but ordinary awareness should remain calm.

## 8. Model relationship awareness

The useful model behavior is relational rather than promotional.

Examples:

~~~text
user recently planned a birthday
+ followed a local restaurant
+ restaurant publishes a relevant event
-> possible timely mention

user is discussing learning guitar
+ followed venue announces beginner jam workshop
-> contextual mention

user explicitly said no spending suggestions
+ business publishes expensive event
-> suppress purchase-oriented mention

user asks 'anything new around here?'
-> temporarily broaden discovery
~~~

The model's job is to protect the user's attention while helping them notice meaningful opportunities.

## 9. Business-side update publishing

Businesses gain awareness by publishing truthful changes, not only by buying ads.

Useful business actions:

~~~text
publish new menu item
publish event
publish availability
publish class
publish collaboration opening
publish supplier need
publish new content
publish public experience
~~~

These updates become eligible for discovery based on user-selected scopes and public semantics.

Paid promotion, if later admitted, remains separately labeled and cannot overwrite the private presentation gate.

## 10. Route-aware interfaces

A mature Vex architecture could route a surfaced update directly into the relevant product surface.

Examples:

~~~text
new restaurant menu item
-> exact menu item page

upcoming concert
-> event details + availability

new class
-> class page + schedule

vendor availability
-> provider capability + time-slot route

new article/podcast
-> exact work in creator universe
~~~

The route should preserve semantic context so the user can move outward to the business / creator / ecosystem view.

## 11. Relationship to VexWorld

Conceptually:

~~~text
public BusinessFactory / creator updates
        |
        v
VexWorld public update/discovery pool
        |
        +-> user-selected filters
        +-> novelty / new / under-seen lenses
        +-> availability
        +-> exact semantic routes
        |
        v
bounded results
~~~

VexWorld does not receive private reasons for suppression or private VexLife context.

## 12. Relationship to VexLife

Possible future VexLife surface:

~~~text
What's New

Today
Upcoming
From worlds I follow
New to me
Opportunities
Saved for later
~~~

Possible model action:

~~~text
inspect permitted public updates
-> privately relate them to current user context
-> surface sparingly
~~~

This is architecture pressure only; it does not grant VexLife implementation authority or background-task capability.

## 13. Relationship to user-directed discovery

This layer composes with VEXBUSINESSFACTORY-USER-DIRECTED-DISCOVERY-AND-PROMOTION.md.

Difference:

~~~text
USER-DIRECTED DISCOVERY
  user actively asks to explore

AMBIENT DISCOVERY
  user previously opted into bounded awareness
  model may notice changes and surface them appropriately
~~~

Both use the same public update/presence semantics and keep paid sponsorship distinct.

## 14. Acceptance principles

Any future implementation should preserve:

1. What's New is derived from source-owned public updates rather than copied business databases;
2. exact semantic routes can take the user to the thing that changed;
3. relevance and appropriateness-to-surface remain separate;
4. private circumstances can suppress or defer suggestions without being disclosed to businesses;
5. sensitive circumstances are not silently inferred for advertising purposes;
6. ambient discovery requires explicit user authorization;
7. the model may save or defer relevant items rather than interrupting;
8. users can inspect a broader What's New stream even when the model did not mention an item;
9. finite calm digests are preferred over compulsive feed mechanics;
10. sponsored promotion cannot bypass user presentation/privacy constraints.

<!-- [VXG RealForever][VEXWORK][OPERATIONAL-CONSOLE][VEXBUSINESSFACTORY][AMBIENT-DISCOVERY] -->
