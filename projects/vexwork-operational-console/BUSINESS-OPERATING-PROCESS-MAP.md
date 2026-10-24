# Business Operating Process Map Foundation

[VXG RealForever]

## Status

~~~text
source purpose                         DURABLE_PROCESS_MAP_FOUNDATION
canonical Workgraph epic              NOT_YET_ADMITTED
VexBoard visualization                HELD_UNTIL_BOARDJOURNEY_EVIDENCE_SLICE
provider selections                   EXAMPLES_NOT_MANDATES
jurisdiction-specific legal/tax truth NOT_OWNED_HERE
~~~

This source preserves the process model Victor wants available before VexBoard is mature enough to render and replay it.

It deliberately does not turn every process box into canonical Work yet. The immediate need is smaller:

> Preserve one human-readable map of what it takes to form and operate a business that sells physical, digital, food, service, or recurring offers; identify reusable subprocesses; make human-only work explicit; and identify infrastructure that should normally be connected through a specialist provider rather than rebuilt from scratch by AI.

Once VexBoard's navigable BoardJourney plus lived-evidence slice is accepted, this source can become the input to a first-class visual/process-map epic rather than requiring a fresh instance to rediscover the generic business model from the internet.

## VexBusinessFactory — provisional root identity

The broader reusable abstraction is now:

~~~text
VexBusinessFactory
~~~

It is not one business runtime, one storefront, or one giant schema. It is a **factory of business-process profiles** that composes the smallest useful operating model from the kind of value being sold, how supply is obtained, how the transaction occurs, how fulfillment happens, which specialist providers are required, and how exceptions/reconciliation work.

The root reusable process template remains:

~~~text
Business Actualization & Operations
process.business.actualization-and-operations
~~~

Relationship:

~~~text
VexBusinessFactory
  -> selects / composes one Business Profile
  -> instantiates Business Actualization & Operations
  -> activates only applicable subprocesses
  -> connects provider-owned capabilities
  -> exposes human-required actions
  -> projects readiness/checklists/journeys through VexBoard
~~~

VexEcommerce is a major reusable child process, not the whole business.

~~~text
BUSINESS != STOREFRONT
STOREFRONT != PAYMENT
PAYMENT != ORDER
ORDER != FULFILLMENT
RETURN != REFUND
~~~

## Root business map

~~~text
BUSINESS INTENTION
  What value will be created, for whom, and in what form?
        |
        v
1. BUSINESS FOUNDATION & PROVIDER SETUP
  identity / ownership / jurisdiction-dependent obligations
  bank / payout destination
  payment provider
  tax/accounting route
  domains/contact/support surfaces
  policies
  provider credentials kept in rightful private custody
        |
        v
2. OFFER CREATION & SUPPLY
  physical item / manufactured good
  digital artifact
  prepared food
  service capacity
  recurring entitlement
        |
        v
3. VEXECOMMERCE — MAKE THE OFFER BUYABLE
  catalog/menu
  public presentation
  availability/inventory/capacity
  price
  cart/selection where applicable
  checkout
  payment observation
  order acceptance
        |
        +--------------------+
        |                    |
        v                    v
4. CUSTOMER ACQUISITION      5. ORDER-TO-FULFILLMENT
  web/search/social             pick / prepare / provision
  marketplace/POS               pack / cook / perform
  restaurant ordering           ship / pickup / deliver
  referrals/campaigns           digital entitlement
        |                    |
        +----------+---------+
                   v
6. CUSTOMER CARE & REVERSE COMMERCE
  support / cancellation / return / refund / exchange / dispute
                   |
                   v
7. FINANCE & RECONCILIATION
  provider payout / fees / refunds
  inventory-order-payment-fulfillment agreement
  accounting/tax handoff
                   |
                   v
8. OPERATING IMPROVEMENT & SCALE
  analytics / automation / staffing
  additional channels / locations / fulfillment capacity
~~~

These are meaningful subprocesses with different owners and different human/provider boundaries. They compose into one business journey without being flattened into one giant record.

# 1. Business Foundation & Provider Setup

Human question:

> What must exist before the offer can be sold and operated responsibly?

Possible requirements include:

~~~text
business identity / owner
jurisdiction-dependent registration or licensing when applicable
bank / payout destination
payment-provider account
tax/accounting route
public contact/support route
domain / hosting / channel accounts
return/refund policy
privacy / terms or other required policies
physical operating location when applicable
supplier / storage / production arrangements when applicable
~~~

This map must not invent jurisdiction-specific legal, licensing, tax or accounting obligations. Those facts belong to the relevant government, licensed professional, financial institution, tax/accounting system, or other rightful provider.

Permanent:

~~~text
PROCESS_CHECKLIST != LEGAL_ADVICE
AI_SUGGESTED_PROVIDER != ESTABLISHED_PROVIDER_ACCOUNT
PUBLIC_PROCESS_MAP != SECRET_CREDENTIAL_STORE
~~~

Provider establishment is itself part of the business journey:

~~~text
choose payment route
-> human establishes provider account
-> provider verification / KYC where required
-> payout destination established
-> test mode works
-> live capability deliberately enabled
~~~

Similar establishment paths may exist for banking, tax/accounting, shipping/carrier, domain/hosting, email/SMS, POS, marketplace seller accounts, and restaurant ordering/delivery channels.

# 2. Offer Creation & Supply

Human question:

> What is actually being created, owned, prepared, reserved, intermediated, or made available for sale?

The first useful abstraction is **offer/supply type**, not merely "product versus service":

~~~text
OWNED_INVENTORIED_OBJECT
  one-off antique, stocked retail good, manufactured item

PREPARED_GOOD
  restaurant meal or another item created after demand

DIGITAL_ARTIFACT
  file, software, media, course, license-delivered content

HUMAN_SERVICE_CAPACITY
  consulting, repair, appointment, professional service

RESERVATION_RIGHT
  hotel room-night, airline seat/itinerary, rental car, tour, transfer

RECURRING_ENTITLEMENT
  subscription / membership / recurring access

INTERMEDIATED_PARTNER_OFFER
  supplier-owned inventory/rate that this business is authorized to search,
  quote, refer, reserve, book, ticket, or service
~~~

Supply paths then specialize:

~~~text
PHYSICAL_ONE_OFF
  obtain -> identify -> inspect -> store -> make sellable

PHYSICAL_REPEATABLE
  design/source -> manufacture/procure -> receive -> quality -> store -> replenish

DIGITAL_GOOD
  create -> package/version -> host -> entitlement/license -> delivery route

RESTAURANT_PREPARED_FOOD
  menu item -> ingredients -> recipe/preparation -> time/location availability -> capacity

SERVICE_BOOKING
  define service -> capacity -> booking -> human service performance

TRAVEL_INTERMEDIARY
  establish supplier/distribution relationship
  -> obtain authorized inventory/rate access
  -> search live availability
  -> quote/revalidate
  -> reserve/book/ticket where authorized
  -> service/cancel/change under supplier rules
~~~

The business profile supplies this production/supply path without changing the generic commerce/transaction process.

# 3. VexEcommerce — Make the Offer Buyable

Provisional process identity:

~~~text
process.vexecommerce.offer-to-order
~~~

Core path:

~~~text
SELLABLE OFFER
      |
      v
CATALOG / MENU
      |
      v
AVAILABILITY / INVENTORY / CAPACITY
      |
      v
PUBLIC PRESENTATION
      |
      v
PRICE
      |
      v
SELECTION / CART
      |
      v
CHECKOUT
      |
      v
PAYMENT PROVIDER
      |
      v
PAYMENT OBSERVATION
      |
      v
ORDER ACCEPTANCE
      |
      v
FULFILLMENT ROUTE
~~~

Existing VexWork Commerce source already proves bounded portions:

~~~text
Commerce item observation
Managed storefront publication
Sale / fulfillment attention
Synthetic public storefront reference
~~~

The future VexEcommerce template should extend those accepted boundaries rather than create a second unrelated commerce model.

# 4. Customer Acquisition & Sales Channels

Potential channels:

~~~text
owned website/storefront
search
social
email
marketplace
physical POS
restaurant online ordering
kiosk
delivery platform
referral
direct link / QR
~~~

One offer may project into multiple channels while retaining one underlying item/menu/service identity.

~~~text
SALES_CHANNEL != OFFER_IDENTITY
CHANNEL_LISTING != INVENTORY_SOURCE
MARKETING_ACTIVITY != ORDER
~~~

# 5. Order-to-Fulfillment

Fulfillment depends on profile:

~~~text
PHYSICAL_SHIPMENT
  accepted order -> locate/reserve -> inspect -> pick -> pack -> label
  -> carrier handoff -> delivery

LOCAL_PICKUP
  accepted order -> prepare/reserve -> ready -> human/customer handoff

RESTAURANT
  accepted order -> kitchen/preparation -> prepare -> package/plate
  -> ready -> pickup/delivery

DIGITAL
  accepted order/payment -> entitlement
  -> provision download/account/license/access

SERVICE
  accepted booking/order -> schedule
  -> human performs service -> completion acknowledgement
~~~

Human action must be explicit:

~~~text
AUTOMATABLE_EFFECT
PROVIDER_EFFECT
HUMAN_LOCAL_ACTION
HUMAN_PHYSICAL_SHIPMENT
HUMAN_SERVICE_PERFORMANCE
HUMAN_INSPECTION
~~~

The map should make the actual human action obvious instead of hiding it behind a generic PROCESSING state.

# 6. Customer Care & Reverse Commerce

Reusable exception/reverse paths include:

~~~text
support request
cancellation
return request / eligibility
return shipment
received-return inspection
refund / partial refund
exchange / replacement
payment dispute / chargeback
damaged or lost shipment
failed digital entitlement
service complaint / remediation
~~~

Physical return example:

~~~text
return requested
-> policy/eligibility
-> approve/reject
-> instructions/label
-> item sent back
-> item received
-> HUMAN INSPECTION
-> restock / repair / discard decision
-> refund or exchange
-> inventory/order/payment reconcile
~~~

Permanent:

~~~text
RETURN != REFUND
REFUND != RETURN
EXCHANGE != REFUND
DISPUTE != ORDINARY_RETURN
RETURNED_ITEM != AUTOMATICALLY_RESTOCKABLE
~~~

# 7. Finance & Reconciliation

The generic process should detect disagreement without becoming the bank, payment processor, tax authority or accounting ledger.

Examples:

~~~text
PAID + NO_ACCEPTED_ORDER      -> ATTENTION
REFUNDED + ITEM_STILL_SOLD    -> ATTENTION
SOLD + FULFILLMENT_UNKNOWN    -> ATTENTION
RETURN_RECEIVED + NO_DECISION -> ATTENTION
PROVIDER_PAYOUT_MISSING       -> ATTENTION
~~~

# 8. Operating Improvement & Scale

Scaling pressure may introduce multiple people, locations, warehouses, channels, fulfillers, permissions, procurement, forecasting, subscription renewal/dunning, international tax/currency, fraud review, or customer-service queues.

These remain optional capabilities. A one-person seller must not inherit enterprise ceremony merely because a large retailer needs it.

# Business profiles

Provisional first profiles:

~~~text
PHYSICAL_ONE_OFF
PHYSICAL_REPEATABLE
DIGITAL_GOOD
RESTAURANT_PREPARED_FOOD
SERVICE_BOOKING
SUBSCRIPTION
TRAVEL_AGENCY_OR_OTA
~~~

Example applicability:

| Capability | Physical one-off | Digital good | Restaurant | Service | Travel |
| --- | --- | --- | --- | --- | --- |
| Offer identity | REQUIRED | REQUIRED | REQUIRED | REQUIRED | REQUIRED |
| Physical inventory/storage | REQUIRED | N/A | INGREDIENT/CAPACITY | N/A | PROVIDER_OWNED |
| Public storefront/menu/search | REQUIRED | REQUIRED | REQUIRED | OPTIONAL | REQUIRED |
| Live availability/revalidation | SIMPLE | N/A | TIME/CAPACITY | CALENDAR | REQUIRED |
| Checkout/payment | REQUIRED | REQUIRED | REQUIRED | OPTIONAL/REQUIRED | PROFILE/PROVIDER_DEPENDENT |
| Shipping | REQUIRED/LOCAL_PICKUP | N/A | DELIVERY/PICKUP | N/A | N/A |
| Digital entitlement | N/A | REQUIRED | N/A | OPTIONAL | VOUCHER/TICKET/RESERVATION |
| Human preparation | OPTIONAL | N/A | REQUIRED | N/A | N/A |
| Human service performance | N/A | N/A | N/A | REQUIRED | AGENT_SUPPORT_OPTIONAL |
| Traditional physical return | OPTIONAL | N/A | N/A | N/A | N/A |
| Cancellation/change servicing | POLICY | POLICY | POLICY | POLICY | REQUIRED |
| Refund path | REQUIRED | REQUIRED/POLICY | REQUIRED | REQUIRED/POLICY | REQUIRED/POLICY |
| Supplier/partner relationship | OPTIONAL | OPTIONAL | OPTIONAL | OPTIONAL | REQUIRED |

Checklist dispositions:

~~~text
REQUIRED
OPTIONAL
NOT_APPLICABLE
PROVIDER_DELEGATED
HUMAN_ACTION_REQUIRED
UNKNOWN_NEEDS_DECISION
~~~


# Travel business profile — reservation and partner-supply commerce

Travel is a critical pressure test because the business commonly **does not own the underlying inventory**.

A travel agency, OTA, booking portal, concierge, or travel platform may compose offers from airlines, lodging suppliers, car-rental companies, attractions, transfer providers, wholesalers, GDSs, aggregators, or direct supplier APIs.

Permanent distinctions:

~~~text
TRAVEL_OFFER != OWNED_INVENTORY
SEARCH_RESULT != BOOKABLE_AVAILABILITY
DISPLAYED_PRICE != FINAL_CONFIRMED_PRICE
RESERVATION != AIR_TICKET
BOOKING != SERVICE_FULFILLED
SUPPLIER_ORDER != VEXWORK_WORK_ITEM
CANCELLATION_REQUEST != REFUND
PARTNER_API_ACCESS != UNIVERSAL_RESELL_RIGHT
~~~

## Travel product subtypes

~~~text
AIR
  flight offers / seats / ancillaries / ticketing / exchanges

LODGING
  hotel / resort / vacation rental / room-night reservation

CAR_RENTAL
  vehicle + depot + rate + options + pickup/dropoff rules

ACTIVITY
  attraction / tour / event / destination experience

TRANSFER
  airport / point-to-point transportation

PACKAGE
  composed trip containing multiple travel products

CRUISE
  later profile pressure; supplier-specific booking/servicing complexity
~~~

The shared travel journey is approximately:

~~~text
BUSINESS / AGENCY FOUNDATION
  |
  v
SUPPLIER / DISTRIBUTION PARTNERSHIP
  contract / affiliate / accreditation / commercial access
  |
  v
AUTHORIZED CONTENT + RATE ACCESS
  |
  v
TRAVELLER SEARCH INTENT
  destination / dates / party / constraints
  |
  v
SEARCH / SHOP
  |
  v
LIVE AVAILABILITY + PRICE / RULES
  |
  v
QUOTE / REVALIDATE
  |
  v
TRAVELLER SELECTS
  |
  v
BOOK / RESERVE / ORDER
  |
  +----> PAYMENT according to provider/business model
  |
  v
CONFIRMATION / TICKET / VOUCHER / RESERVATION
  |
  v
PRE-TRAVEL SERVICING
  changes / cancellation / disruption / traveller support
  |
  v
TRAVEL SERVICE OCCURS
  airline / hotel / car / activity provider performs the real service
  |
  v
POST-TRAVEL SUPPORT + RECONCILIATION
  commission / supplier settlement / refunds / disputes / reporting
~~~

This is commerce, but fulfillment is **supplier service performance**, not the business packing a box.

## Travel provider/distribution patterns

A profile may choose one or more patterns:

~~~text
AFFILIATE / REDIRECT
  search/display locally
  -> traveller completes booking at provider
  -> referral/commission observation

SEARCH + BOOK THROUGH PARTNER API
  search / availability / price
  -> provider order/booking API
  -> post-booking servicing where authorized

GDS / TRAVEL DISTRIBUTION PLATFORM
  multi-supplier search / booking / ticketing / servicing
  -> commercial agency relationship and provider credentials

DIRECT SUPPLIER
  airline / hotel / rental / tour operator API or portal

WHITE-LABEL PLATFORM
  provider owns more of checkout/booking/servicing while business owns brand/customer journey
~~~

Current official provider examples show these are real integration patterns, not hypothetical ones:

- Booking.com Demand API supports content/search/redirect, supported in-app booking, post-booking management, and reporting across accommodations, cars and other travel services, with capability depending on partner access.
- Expedia Group Rapid provides partner APIs for lodging, cars, flights and activities and requires becoming a partner before integration.
- Sabre exposes travel-agency APIs spanning air shopping/booking, lodging and cars.
- Travelport TripServices exposes air search/price/book/ticket/change/cancel plus hotel search/book/manage.
- Amadeus offers self-service/enterprise travel APIs across flights, hotels, cars/transfers and destination experiences.
- IATA/IATAN accreditation is one industry route for recognized travel-agent/ticketing relationships; exact accreditation or seller requirements depend on location and chosen commercial model.

These providers are references, not defaults. Availability, commercial terms, accreditation, ticketing authority, payment responsibility and post-booking servicing vary by provider/product/market.

## Travel-specific human and operational complexity

Typical human/business work may include:

~~~text
choose agency / affiliate / merchant model
form supplier or distributor agreements
complete commercial/provider verification
obtain any required accreditation or seller authorization
decide who is merchant of record
define traveller-support responsibility
define cancellation/change/refund support
handle schedule changes / disruptions / exceptions
reconcile commissions / supplier settlements / refunds
maintain customer-service coverage
~~~

Typical system/provider work may include:

~~~text
content ingestion
search
live availability
rate/fare rules
price revalidation
booking/order creation
ticket/voucher/reservation issuance
provider notifications
change/cancel endpoints
reporting/reconciliation feeds
~~~

VexBusinessFactory should make these responsibilities explicit before generating a checklist.

# Provider boundary — connect rather than rebuild

One purpose of this map is to keep future AI instances from casually reinventing infrastructure that exists because it is specialized, regulated, security-sensitive, network-dependent, or operationally expensive.

Default provider-delegated classes:

~~~text
PAYMENT PROCESSING / CARD CUSTODY
  specialist payment provider
  examples: Stripe, Square, PayPal or another selected PSP

BANK / PAYOUT CUSTODY
  bank / financial provider

TAX / ACCOUNTING
  tax/accounting provider and/or qualified human professional
  jurisdiction and profile dependent

SHIPPING NETWORK
  carrier and/or shipping-label/rate provider

IDENTITY / KYC / FRAUD
  provider capability where required

EMAIL / SMS DELIVERY
  communications provider

DOMAIN / DNS / HOSTING
  infrastructure provider

MARKETPLACE / POS / RESTAURANT CHANNEL
  external channel/provider where selected
~~~

Vex may coordinate, observe, explain and route these capabilities.

It should not imply:

~~~text
AI_GENERATED_CHECKOUT == PAYMENT_PROCESSOR
AI_GENERATED_TAX_RULE == TAX_AUTHORITY
AI_GENERATED_TRACKING == CARRIER
PUBLIC_REPOSITORY == CUSTOMER_DATABASE
~~~

Named examples are references, not mandatory architecture:

- Stripe Checkout: https://stripe.com/payments/checkout
- Square restaurant menus: https://squareup.com/help/us/en/article/6424-create-menus-with-square-for-restaurants
- Shopify returns/exchanges: https://help.shopify.com/en/manual/fulfillment/managing-orders/returns

A future provider catalog may add alternatives and selection criteria. This process map remains provider-neutral.

# Human checklist projection

The eventual VexBoard experience should turn the graph into a learnable checklist for the selected business profile.

Example:

~~~text
START PHYSICAL_ONE_OFF BUSINESS

Business Foundation
  [ ] owner/business identity understood
  [ ] payout/bank route established
  [ ] payment provider established
  [ ] tax/accounting route decided
  [ ] public contact/support route established
  [ ] return/refund policy decided

Offer
  [ ] item exists
  [ ] item identity recorded
  [ ] condition/known facts recorded
  [ ] storage location known
  [ ] public images/details selected

Commerce
  [ ] storefront exists
  [ ] listing published
  [ ] checkout/payment route tested
  [ ] order-acceptance route tested

Fulfillment
  [ ] packing supplies available
  [ ] shipping/pickup method selected
  [ ] human shipment action understood
  [ ] acknowledgement/evidence route defined

Reverse commerce
  [ ] cancellation rule known
  [ ] return path known
  [ ] refund path known

Reconciliation
  [ ] order/payment/inventory/fulfillment can be compared
~~~

The checklist is a projection of process requirements, not a second source of provider truth.

# Future VexBoard epic

Provisional future epic:

~~~text
VexBusinessFactory — Business Process Map & Reusable Operating Profiles
~~~

Admit it only when VexBoard can support the human-readable process map rather than forcing this source into a flat collection of tickets.

Provisional decomposition:

~~~text
B1  VexBusinessFactory root grammar
B2  Business Profile / Checklist Projection
B3  Provider Boundary & Integration Registry
B4  VexEcommerce Core
B5  Physical Goods Profile
B6  Digital Goods Profile
B7  Restaurant / Prepared Food Profile
B8  Travel Agency / OTA Profile
B9  Customer Care / Reverse Commerce
B10 Reconciliation & Attention
B11 Lived Journey + Screenshot Evidence
B12 Fresh-Instance Learnability Proof
~~~

B4-B10 are process/domain meaning.
B11 is evidence.
B12 tests the actual reason this map exists.

# VexBoard human-readable target

Business level:

~~~text
FOUNDATION
    |
    v
CREATE / SOURCE OFFER
    |
    v
VEXECOMMERCE
    |
    +--------> CUSTOMER ACQUISITION
    |
    v
FULFILLMENT
    |
    v
CUSTOMER CARE / RETURNS
    |
    v
RECONCILIATION
    |
    v
IMPROVE / SCALE
~~~

Enter VexEcommerce:

~~~text
Offer
 -> Catalog/Menu
 -> Availability
 -> Public Presentation
 -> Selection
 -> Checkout
 -> Payment Provider
 -> Payment Observation
 -> Accepted Order
 -> Fulfillment Route
~~~

A person should be able to enter any node and see:

~~~text
why this process exists
what must already be true
what the human must do
what AI/Vex can do
what provider owns external effects
what evidence proves readiness
what can happen next
which business profiles require it
~~~

# Lived evidence expectation

When this becomes executable patient-zero work, screenshot evidence should attach only to meaningful human-visible state changes such as storefront/menu before/after, test checkout, accepted test order, fulfillment queue, return/refund state, or final reconciled state.

Low-level source/test operations belong in technical evidence rather than becoming screenshot noise.

~~~text
PROCESS_STEP != SCREENSHOT
SCREENSHOT != SOURCE_TRUTH
SCREENSHOT = OPTIONAL_LIVED_EVIDENCE_FOR_A_MEANINGFUL_STEP
~~~

# Fresh-instance entry contract

A fresh instance should be able to begin here and answer:

~~~text
1. What kind of business is this?
2. Which process profile applies?
3. Which capabilities are required?
4. Which are already established?
5. Which steps are human-only?
6. Which effects belong to external providers?
7. Which provider accounts/integrations are selected?
8. What current truth/evidence exists?
9. What is the smallest next unmet process predicate?
10. What must never be invented or placed in public source?
~~~

It should not need to search the internet merely to rediscover the generic business lifecycle.

Fresh external research remains appropriate when provider selection, current pricing/features, jurisdiction-specific requirements, a changed API/contract, or a genuinely new business profile makes current external truth material.

# Acceptance threshold

The future epic earns completion when:

1. one root topology connects foundation, offer creation, commerce, fulfillment, customer care and reconciliation;
2. VexEcommerce is reusable as a child process rather than the whole business;
3. physical, digital, restaurant and travel profiles reuse the same core without corrupting distinct supply/fulfillment/servicing semantics;
4. a profile produces a human-readable readiness checklist with REQUIRED / OPTIONAL / N/A / provider / human distinctions;
5. provider-delegated infrastructure is explicit and private/provider truth remains outside public process source;
6. human-only physical/service actions are first-class boundaries;
7. return/refund/exchange/dispute are modeled separately from the happy path;
8. evidence can surface attention without manufacturing Work or provider facts;
9. VexBoard can render and traverse the map at business and subprocess depth;
10. at least one lived patient zero carries screenshot-backed meaningful journey steps;
11. a fresh instance can continue the business trajectory without reconstructing the generic model from web research.

# Current lineage

Current accepted Operational Console lineage already contributes:

~~~text
P3 Operating Domain template
P4 reusable Commerce starter
  Commerce item model
  managed storefront publication
  sale / fulfillment attention
P5 Antique Plate pilot
~~~

This source broadens the learning:

~~~text
VexWork Operational Console Commerce
        |
        v
VexEcommerce reusable subprocess
        |
        v
Business Actualization & Operations root map
~~~

The Antique Plate path remains a useful physical-goods patient zero.
A synthetic fixture is acceptable for template proving when explicitly marked synthetic.
Restaurant, digital-good and travel-agency/OTA profiles are deliberately different follow-up pressure tests.

# Companion VexBusinessFactory pressure sources

This root map remains the entry point. Descend to these bounded companion sources when the relevant pressure is material:

~~~text
VEXBUSINESSFACTORY-LEARNING-AND-CAPABILITY-MODULES.md
  education business + process teaching + selectable vendors/providers

VEXBUSINESSFACTORY-MEDIA-EXPRESSION-AND-CREATOR-PROFILE.md
  expression/publication/creative-universe profile without mandatory commerce

VEXBUSINESSFACTORY-MOTORSPORT-AND-INDUSTRY-ECOSYSTEM-PROFILE.md
  multi-party industry ecosystems, sponsorship, suppliers, governance, community

VEXBUSINESSFACTORY-FORMATION-EXPANSION-AND-AVAILABILITY-NETWORK.md
  current state -> desired state, staged expansion, vendor/time/location/equipment availability

VEXBUSINESSFACTORY-USER-DIRECTED-DISCOVERY-AND-PROMOTION.md
  user-invited discovery, novelty/freshness, transparent promotion, sponsored separation

VEXBUSINESSFACTORY-AMBIENT-DISCOVERY-AND-WHATS-NEW.md
  source-owned public updates, calm What's New projection, model-mediated contextual awareness
~~~

Related VexBoard semantic-topology/perspective/discovery patient-zero work is preserved separately in VexBoard draft PR #92 so BusinessFactory meaning does not become VexBoard-owned by implication.

# Held work

Do not yet:

~~~text
create one Work item for every process box
invent legal/tax obligations
choose Stripe/Square/Shopify as universal mandatory providers
copy payment/customer secrets into public Vex source
pretend provider account creation is automated when human verification is required
build a new payment processor
make VexBoard the provider/source-of-truth for commerce records
~~~

The next materialization is the VexBoard-backed process-map epic after the required BoardJourney/evidence substrate is stable enough to carry it.

<!-- [VXG RealForever][VEXWORK][OPERATIONAL-CONSOLE][BUSINESS-PROCESS-MAP-FOUNDATION] -->
