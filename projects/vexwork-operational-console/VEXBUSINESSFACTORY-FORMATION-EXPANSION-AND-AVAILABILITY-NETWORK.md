# VexBusinessFactory — Formation, Expansion & Availability Network

[VXG RealForever]

## Purpose

This source captures two reusable BusinessFactory pressures:

1. businesses should be formed from CURRENT STATE -> DESIRED STATE rather than assuming every operator starts from zero;
2. time/location/capability-based vendors should be discoverable through a normalized availability bridge even when external providers expose very different integration surfaces.

Examples include:

~~~text
restaurant -> food truck
restaurant -> delivery
restaurant -> catering
creator -> live event
venue -> live music
event planner -> band + sound + lighting
company -> translation vendor
tourism operator -> local guide / musician / venue
racing team -> transport / fabrication / setup vendor
~~~

Permanent:

~~~text
CURRENT_STATE != GREENFIELD
BUSINESS_EXPANSION != NEW_BUSINESS_IDENTITY
CAPABILITY_ADDITION != FULL_REBUILD
VENDOR_PROFILE != LIVE_AVAILABILITY
CALENDAR_BUSY != SERVICE_UNAVAILABLE_BY_ITSELF
SEARCH_MATCH != CONFIRMED_BOOKING
QUOTE != BOOKING
AVAILABILITY != EFFECT_AUTHORITY
~~~

## 1. Formation starts from current reality and desired future

The BusinessFactory front door should first establish:

~~~text
CURRENT REALITY
  what already exists?

DESIRED EXPERIENCE / DREAM
  what does the human want this to become?

DELTA
  what meaningful capabilities / relationships / resources are missing?

SEQUENCE
  what is the smallest coherent route from here to there?
~~~

Useful question families:

~~~text
What do you want to make possible?
What already exists today?
What are you already good at / able to provide?
What physical/digital resources do you already have?
What people / partners / vendors do you already rely on?
What channels do you already use?
What are customers already able to do?
What is still manual?
What is painful or limiting?
What would the ideal end state feel like?
What would you like to add later, but not yet?
What must stay simple?
~~~

The output is a CURRENT-TO-TARGET map rather than a generic startup checklist.

Conceptually:

~~~text
CurrentBusinessState
  active modules
  active capabilities
  current providers
  current offers
  current channels
  current locations
  current capacities
  known constraints

DesiredBusinessState
  desired modules
  desired capabilities
  desired offers
  desired channels
  desired locations
  desired experience

GapMap
  missing capabilities
  provider decisions
  human actions
  dependencies
  safe expansion order
~~~

## 2. Expansion is module activation, not business replacement

Example restaurant evolution:

~~~text
RESTAURANT_PREPARED_FOOD
  dine-in

later add
  + TAKEOUT

later add
  + DELIVERY

later add
  + CATERING

later add
  + FOOD_TRUCK / MOBILE_LOCATION

later add
  + EVENTS
  + LIVE_MUSIC
  + MERCH
  + EDUCATION / COOKING CLASS
~~~

The business identity remains stable while capabilities, channels, locations, inventory, staffing and provider relationships evolve.

## 3. Food truck as an expansion profile

Food truck / mobile food introduces new pressure:

~~~text
MOBILE_LOCATION
  location changes through time

LOCATION-SPECIFIC AVAILABILITY
  menu / service may vary by place/time

MOBILE_CAPACITY
  vehicle / storage / power / cooking throughput

SUPPLY / RESTOCK
  ingredients / water / fuel / disposables

PERMITS / SITE ACCESS
  rightful local requirements / event permissions

EVENT PARTICIPATION
  private event / festival / market / office / public stop

DISCOVERY
  where is the truck now / next?
~~~

This should compose with the restaurant profile rather than become a separate unrelated ontology.

## 4. Availability is a reusable business capability

Many service businesses fundamentally sell TIME + CAPABILITY + LOCATION/COVERAGE.

Examples:

~~~text
musician
DJ
sound engineer
PA / lighting rental
photographer
translator
caterer
food truck
tutor
consultant
mechanic
guide
driver
venue
event crew
~~~

Conceptual availability observation:

~~~text
AvailabilityObservation
  providerRef
  capabilityRef
  location / serviceArea
  timeWindow
  duration / setupBuffer where applicable
  capacityRefOrNull
  equipment/resourceRefs[]
  availabilityClass
  observedAt
  sourceRefs[]
~~~

Availability is current provider truth, not a WorkState.

## 5. Availability confidence classes

External providers expose very different levels of booking truth. Normalize that difference instead of pretending everything is real-time.

~~~text
LIVE_BOOKABLE
  provider exposes exact selectable slots + booking effect

LIVE_AVAILABILITY
  provider exposes available slots, but booking occurs elsewhere

FREE_BUSY_ONLY
  provider exposes busy/free blocks without service semantics

PROVIDER_QUOTE_REQUIRED
  provider receives request and confirms availability / terms

MARKETPLACE_QUOTE_REQUIRED
  marketplace routes inquiry to matching providers

DIRECT_INQUIRY_REQUIRED
  only contact route is known

UNKNOWN
  no current availability observation
~~~

Examples in the current external ecosystem:

~~~text
Square Bookings
  supports API availability search + booking operations

Calendly
  exposes event-type availability / user busy-time APIs

Google Calendar
  exposes FreeBusy data; privacy can remain limited to busy ranges

GigSalad / The Bash
  commonly use location/category search -> quote request -> provider confirms availability -> booking
~~~

Reference documentation:

~~~text
https://developer.squareup.com/reference/square/bookings/search-availability
https://developer.calendly.com/docs/api-guides/view-event-type-and-user-calendar-availability-data
https://developers.google.com/workspace/calendar/api/v3/reference/freebusy/query
https://help.gigsalad.com/article/47-how-it-works
https://www.thebash.com/help
~~~

## 6. Search request grammar

A requester should be able to express a vendor need semantically:

~~~text
CapabilityRequest
  capability category
  date / time window
  location / service area
  duration
  participant/guest scale
  equipment needs
  venue constraints
  setup / teardown needs
  budget range optional
  style / culture / experience preferences optional
  required credentials / insurance only when materially required
~~~

Music-event example:

~~~text
need
  LIVE_MUSIC

when
  Saturday 18:00-22:00

where
  event venue / radius

capacity
  150 guests

equipment
  needs PA
  venue provides power
  no stage lighting

experience
  jazz / dinner atmosphere
~~~

The system can then search:

~~~text
native VexWorld/VexLife availability
+ connected provider APIs
+ calendar/free-busy bridges
+ marketplaces
+ public vendor registries
+ direct-contact candidates
~~~

while preserving the availability confidence class.

## 7. Equipment/resource availability is separate from human availability

A music vendor may be free while required equipment is not.

Example:

~~~text
band available
+ drummer available
+ venue available
- required PA unavailable
= EVENT CAPABILITY NOT YET REALIZABLE
~~~

Therefore availability may compose:

~~~text
PEOPLE
RESOURCES / EQUIPMENT
LOCATION
TRAVEL / SETUP TIME
CAPACITY
PROVIDER / VENUE RULES
~~~

Do not reduce the problem to one calendar.

## 8. Vendor bridge maturity ladder

External businesses can participate at different integration depths.

~~~text
LEVEL 0 — DISCOVERABLE ONLY
  public business/contact information
  Vex can route inquiry

LEVEL 1 — DECLARED PROFILE
  capability / service area / equipment / contact / ordinary hours

LEVEL 2 — CALENDAR BRIDGE
  opt-in free/busy or availability schedule

LEVEL 3 — PROVIDER CONNECTOR
  API/webhook availability observations

LEVEL 4 — BOOKING BRIDGE
  quote / reserve / book through authorized provider effect

LEVEL 5 — VEX-NATIVE PRESENCE
  BusinessFactory/VexLife-managed public presence
  explicit capability + availability projection
  VexWorld discovery integration
~~~

A vendor does not need to adopt VexLife before becoming discoverable.

## 9. Outside-the-network discovery project

A separate future project may be justified to build a provider discovery/availability adapter layer.

Possible scope:

~~~text
Vendor Discovery & Availability Bridge

inputs
  category
  location
  time
  capability constraints

sources
  public marketplace search
  provider APIs
  vendor directories
  calendar connectors
  direct business websites/contact routes
  VexWorld/VexLife native presences

outputs
  candidate providers
  match reasons
  availability class
  freshness/currentness
  next action route
~~~

This project should not scrape or republish protected/private marketplace data without lawful/authorized access. Public/provider terms remain source-specific.

## 10. How vendors usually work today

Current event-service marketplaces demonstrate that many providers are still discovered through category/location search and then contacted for quotes. GigSalad lets planners browse local talent or submit a request that is routed to matching providers; providers respond if available and interested. The Bash similarly uses vendor-type/location search and custom quote requests, and recommends comparing multiple vendors.

That suggests the first Vex bridge should support:

~~~text
FIND
-> INQUIRE
-> CONFIRM AVAILABILITY
-> COMPARE
-> BOOK THROUGH RIGHTFUL PROVIDER
~~~

not only:

~~~text
QUERY API -> INSTANT BOOK
~~~

## 11. VexLife / VexWorld native availability

A participating vendor could later publish a privacy-bounded availability surface:

~~~text
VendorPresence
  public capabilities
  service area
  public equipment/capacity
  ordinary availability policy
  exact public available slots or free/busy policy
  inquiry / quote / booking route
  sourceRefs[]
~~~

Privacy principle:

~~~text
AVAILABLE / BUSY
does not require
PUBLIC EVENT DETAILS
~~~

Google Calendar's FreeBusy model is a useful reference: a consumer can learn that time is busy without seeing event contents.

## 12. BusinessFactory front-door experience

The human formation journey can eventually look like:

~~~text
What do you want this business to become?
        |
        v
What do you already have today?
        |
        v
Which parts already work?
        |
        v
What would you like to add next?
        |
        +-> new offer?
        +-> new location?
        +-> mobile operation?
        +-> delivery?
        +-> vendor capability?
        +-> live events?
        +-> media?
        +-> education?
        +-> travel/experience?
        |
        v
What capabilities/resources does that require?
        |
        v
Can you supply them yourself?
        |
        +-> yes: bind internal capability
        |
        +-> no: search provider/vendor routes
        |
        v
Build a staged expansion map
~~~

That makes BusinessFactory useful both for:

~~~text
starting from scratch
and
growing an existing living business
~~~

## 13. Architectural result

This pressure strengthens the core model:

~~~text
BUSINESS INSTANCE
  stable identity

+ CURRENT STATE
+ DESIRED STATE
+ MODULE / CAPABILITY EXPANSION
+ PROVIDER DISCOVERY
+ AVAILABILITY OBSERVATIONS
+ ROUTE OPTIONS
+ COORDINATION / CONFLICT
+ EVIDENCE / LEARNING
~~~

The system can therefore help a person say:

~~~text
I own a restaurant now.
I want to add a food truck next.
I want live music on Fridays.
I need a sound vendor only when the venue cannot supply equipment.
I need to know who is available near this event date.
~~~

and derive the next meaningful process instead of rebuilding the business model.

<!-- [VXG RealForever][VEXWORK][OPERATIONAL-CONSOLE][VEXBUSINESSFACTORY][FORMATION-EXPANSION-AVAILABILITY] -->
