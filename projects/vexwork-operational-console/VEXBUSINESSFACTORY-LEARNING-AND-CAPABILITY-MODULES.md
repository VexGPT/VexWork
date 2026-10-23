# VexBusinessFactory — Learning Projection & Capability Modules

[VXG RealForever]

## Purpose

This companion source extends the Business Operating Process Map with two pressures that must remain first-class:

1. **education as a business profile** — courses, teachers, creators, tutoring, cohorts, memberships and student/time capacity;
2. **education as a universal projection** — every business process must teach its why, context and consequences rather than collapse into a checklist.

It also defines **selectable capability modules** for vendors, suppliers, partners and outsourced capabilities that a business may need only when it cannot or should not supply that capability itself.

## Two meanings of education

~~~text
EDUCATION_BUSINESS
  learning itself is the value being offered

EDUCATIONAL_PROCESS_VIEW
  any business process can be understood and taught
~~~

These are related but not the same.

A VexBusinessFactory operator should be able to *run* the business and also *understand* the business.

~~~text
CHECKLIST != EDUCATION
COMPLETED_STEP != UNDERSTOOD_STEP
PROCESS_MAP != EXPLANATION_BY_ITSELF
~~~

## Education business profile

Provisional profile:

~~~text
EDUCATION_CREATOR_OR_SCHOOL
~~~

Possible offer subtypes:

~~~text
SELF_PACED_COURSE
  reusable digital curriculum / video / files / exercises

LIVE_CLASS
  scheduled instructor time + finite seat capacity

COHORT
  bounded group + calendar + curriculum + instructor/support capacity

ONE_TO_ONE_TUTORING
  instructor time inventory / appointment capacity

WORKSHOP_OR_EVENT
  finite seats at a specific time/location

MEMBERSHIP
  recurring access to content/community/live sessions

FREE_EDUCATION_WITH_ADJACENT_REVENUE
  public teaching / YouTube
  -> sponsorship / membership / course / affiliate / consulting
~~~

### Student journey

~~~text
LEARNING INTENT
  |
  v
DISCOVERY / TRUST
  |
  v
COURSE / CLASS SELECTION
  |
  v
ENROLLMENT / PAYMENT if applicable
  |
  v
ONBOARDING + ACCESS
  |
  v
LEARNING DELIVERY
  content consumption and/or live teaching
  |
  v
PROGRESS / PRACTICE / ASSESSMENT
  |
  v
FEEDBACK / INSTRUCTOR SUPPORT
  |
  v
COMPLETION / OUTCOME
  |
  +--> renewal / next course / community
  |
  +--> cancellation / refund / support / remediation
~~~

### Education inventory/capacity

Education does not always have stock. Its scarce resources may be:

~~~text
INSTRUCTOR_TIME
LIVE_CLASS_SEATS
COHORT_SEATS
OFFICE_HOUR_CAPACITY
ASSIGNMENT_REVIEW_BANDWIDTH
MENTOR_CAPACITY
ROOM_OR_VENUE_CAPACITY
DIGITAL_ACCESS
  potentially non-scarce unless licensing or cohort rules bound it
~~~

Permanent:

~~~text
STUDENT != CUSTOMER_RECORD_ONLY
ENROLLMENT != LEARNING
CONTENT_ACCESS != COMPLETION
WATCHED_VIDEO != UNDERSTANDING
COURSE_COMPLETION != CREDENTIAL_AUTHORITY
INSTRUCTOR_TIME != DIGITAL_INVENTORY
FREE_PUBLIC_EDUCATION != NO_BUSINESS_MODEL
~~~

A useful education profile may compose:

~~~text
content creation
commerce
scheduling/capacity
student identity/access
learning delivery
progress/assessment
feedback/support
community
subscription/renewal
refund/cancellation
~~~

without forcing every educator into one LMS-shaped implementation.

## Selectable capability modules

A business should know a capability exists without being forced to use it.

Core question:

> Can this business supply this capability itself, or does it need an external source?

~~~text
CAPABILITY NEED
    |
    +--> SELF_SUPPLIED
    |
    +--> INTERNAL_TEAM
    |
    +--> VENDOR / CONTRACTOR
    |
    +--> PLATFORM / API PROVIDER
    |
    +--> SUPPLIER / DISTRIBUTOR / MARKETPLACE NETWORK
    |
    +--> NOT_APPLICABLE
~~~

Useful dispositions:

~~~text
REQUIRED
OPTIONAL
NOT_APPLICABLE
SELF_SUPPLIED
INTERNAL_TEAM
VENDOR_DELEGATED
PLATFORM_DELEGATED
UNKNOWN_NEEDS_DECISION
~~~

Permanent:

~~~text
OPTIONAL_CAPABILITY != UNIVERSAL_REQUIREMENT
VENDOR != EMPLOYEE
PROVIDER_CONNECTION != BUSINESS_OWNERSHIP
SELF_SUPPLIED != FREE
OUTSOURCED != NO_MANAGEMENT_REQUIRED
CAPABILITY_AVAILABLE != CAPABILITY_SELECTED
~~~

### Examples

Restaurant:

~~~text
ingredients
  self-sourced / local supplier / distributor

delivery
  own drivers / external delivery channel

accounting
  internal / external provider
~~~

Globalizing software/content company:

~~~text
translation
  internal linguists / translation vendor / localization platform

cultural review
  regional team / specialist vendor

localized customer support
  internal team / outsourced provider
~~~

Travel:

~~~text
air / lodging / car / activity inventory
  direct supplier / distributor / aggregator / GDS

traveller support
  internal / outsourced / supplier-serviced
~~~

Physical commerce:

~~~text
manufacturing
  internal / contract manufacturer

warehousing
  own storage / 3PL

shipping
  carrier network
~~~

Education:

~~~text
video/content hosting
  owned infrastructure / learning platform

teaching
  owner / employees / contract instructors

curriculum production
  internal / specialist contractor

captioning / translation / localization
  internal / vendor / platform

credentialing
  only when a rightful credentialing owner exists
~~~

The factory should expose these as **expansions** off the primary process rather than cluttering every baseline map.

## Educational projection for every process

Every meaningful VexBusinessFactory node should be capable of answering:

~~~text
PROCESS NAME
  What is this called?

PURPOSE / WHY
  Why does this process exist?
  What business problem does it solve?

CONTEXT
  Where does it sit in the end-to-end business?

WHEN IT APPLIES
  Which profiles need it?
  When is it optional or not applicable?

PREREQUISITES
  What must already be true?

INPUTS
  What resources / information / capabilities enter?

PROCESS
  What actually happens?

OUTPUTS / GUARANTEES
  What becomes true when it succeeds?

OWNERSHIP
  Human / internal team / Vex / vendor / platform / external provider?

FAILURE MODES
  What commonly goes wrong?

WHY NOT SKIP IT?
  What downstream risk or confusion appears if omitted?

EVIDENCE / READINESS
  How can a human or AI know it is really established?

NEXT CONNECTIONS
  Which processes become possible afterward?

EXAMPLE
  One concrete worked instance.

VARIANTS
  How does it differ for physical, digital, food, education, travel or service?

DEEPER REFERENCES
  Provider docs, regulations, source contracts or worked examples when material.
~~~

## VexBoard learning experience

The eventual VexBoard projection should let a person move among:

~~~text
MAP VIEW
  understand the whole business system

PROCESS LESSON
  learn one node's purpose and context

SUBPROCESS WALK
  understand the detailed steps inside it

READINESS CHECKLIST
  determine what is currently established

CAPABILITY OPTIONS
  see self-supply / vendor / provider choices

LIVED EXAMPLE
  inspect screenshots/evidence from a real or synthetic proving journey
~~~

A person should be able to ask:

~~~text
Why do I need this?
What happens if I skip it?
Who normally owns this?
Can I do it myself?
When should I outsource it?
What does "done" actually look like?
What does this unlock next?
Show me an example.
Show me the larger process again.
~~~

This learning view is part of the product value, not documentation garnish.

## Future epic effect

The VexBusinessFactory epic should explicitly include:

~~~text
Educational Process Projection
Business Profile / Readiness Checklist Projection
Selectable Capability / Vendor Network Model
Education Creator / School Profile
Lived Journey + Screenshot Evidence
Fresh-Instance Learnability Proof
~~~

Fresh-instance learnability should test both dimensions:

~~~text
CAN THE INSTANCE OPERATE THE MAP?
+
CAN THE INSTANCE EXPLAIN THE MAP?
~~~

The purpose is not to eliminate future research. Current research remains necessary when provider capabilities, regulations, pricing, contracts or other external facts materially change.

The durable map prevents repeated rediscovery of the **generic business concepts, relationships and why**.

<!-- [VXG RealForever][VEXWORK][OPERATIONAL-CONSOLE][VEXBUSINESSFACTORY][LEARNING-CAPABILITY-MODULES] -->
