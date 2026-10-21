# Connected Services — end goal and program trajectory

[VXG RealForever]

## Three levels of "done"

A successor must distinguish these three outcomes.

### 1. VCS-04 done — Conversation adoption is lived and durable

The Android Conversation path is complete when the full VCS-04 L1-L12 contract is proven:

~~~text
private device possession
-> bounded remote session
-> private gateway
-> current Home/Family authority
-> canonical installed read
-> durable human Send exactly once
-> separate Companion response
-> model-failure separation
-> same-session observation
-> real Android process restart
-> no duplicates/replay
-> current source/lifecycle evidence
~~~

This is the current foreground.

### 2. Connected Services program done — multiple real capabilities prove the shared boundary

Parent program owner:

~~~text
vgong24/VexLife issue #899
[VexLife Connected Services][Convergence]
~~~

Human architectural intention from #899:

Establish the reusable connected-services boundary through which VexLife surfaces can lawfully reach remote/Home capabilities while each feature keeps its rightful semantic owner.

The goal is not a generic API framework and not "make everything HTTP."

~~~text
ONE shared connection/session substrate
!=
ONE generic API abstraction for every feature
~~~

Current roadmap:

~~~text
VCS-00  Maps C1 Home-routed admission
         COMPLETE / terminal accepted

VCS-01  three-consumer comparison
         COMPLETE
         Maps + Conversation + VexStream

VCS-02  minimum shared Connected Services contract
         COMPLETE

VCS-03  Maps engine realization / Photon practicum
         COMPLETE / terminal accepted

VCS-04  Conversation adoption
         CURRENT FOREGROUND
         A012 = foundation successor checkpoint, not terminal

VCS-05  VexStream adoption / stress test
         FUTURE AFTER VCS-04
         asks whether long-lived/range/media/backpressure concerns
         deserve a separate streaming extension

VCS-06  VexArchitecture extraction
         FUTURE AFTER MULTIPLE REAL CONSUMERS
         extract stable recurring pattern, likely into Vextreme-SDK
         preserve questions/ownership/proof obligations, not copied code

VCS-07  deployment choices
         FUTURE AFTER RUNTIME CONTRACT IS STABLE
         same machine / sibling process-container / another owned machine /
         user-selected VPS-cloud / possible future managed host
~~~

Permanent program law:

~~~text
VCS04_TERMINAL != CONNECTED_SERVICES_PROGRAM_TERMINAL
CONNECTED_SERVICE != FEATURE_SEMANTIC_OWNER
CONNECTED_SERVICE != HOME_AUTHORITY
CONNECTED_SERVICE != PROVIDER_ENGINE
CONNECTED_SERVICE != DEPLOYMENT_LOCATION
TRANSPORT != PRODUCT_MEANING
~~~

### 3. Product experience done — normal humans no longer operate the harness

The lived scripts exist to discover/prove architecture.

The desired product experience is approximately:

~~~text
open VexLife
-> tap Connect to Vex Home / Connected Services
-> connect phone/computer as needed
-> app/helper handles setup mechanics
-> human performs only protected login/consent/VPN prompts
-> system verifies actual private Home truth
-> fresh Home establishes canonical Family room
-> Conversation opens
~~~

The productization/onboarding work is parked in:

~~~text
VexGPT/VexWork issue #6
~~~

Do not implement that by embedding the A00x proof harness wholesale into the product.

~~~text
PROOF_HARNESS != PRODUCT_SETUP
~~~

## Why VCS-05 matters before VCS-06

Maps and Conversation are request/response-shaped consumers.

VexStream adds different pressure:

~~~text
session longevity
backpressure
range/media delivery
playback/connection state
reconnect
throughput
large payload behavior
~~~

Do not force those concerns into the common request/response substrate merely to make one abstraction symmetrical.

VCS-05 determines what is truly shared and what should remain a streaming-specific extension.

Only after that evidence exists should VCS-06 extract a reusable VexArchitecture.

## Whole trajectory in one line

~~~text
Maps proves first shared pressure
-> Conversation proves authenticated durable semantic use
-> Stream stress-tests long-lived transport
-> architecture is extracted only from repeated truth
-> deployment choices remain realization, never semantic ownership
-> product onboarding makes the proven path ordinary for humans
~~~

<!-- [VXG RealForever][CONNECTED-SERVICES][PROGRAM-TRAJECTORY] -->
