# AI-managed Commerce Storefront Surface

[VXG RealForever]

## Human question

How can an AI help form and maintain a simple public storefront from current Commerce item truth without making VexWork the website database, silently publishing everything it knows, or pretending that preparing content is the same as a rightful site owner actually publishing it?

The reusable boundary is:

~~~
current Commerce item observation
-> explicit public-field / image selection
-> deterministic storefront document
-> rightful site/storefront owner performs the external effect
-> publication receipt records observed public state
~~~

Permanent distinctions:

~~~
COMMERCE_ITEM != STOREFRONT_DOCUMENT
KNOWN_ITEM_FIELD != PUBLIC_FIELD
STOREFRONT_DOCUMENT != PROVIDER_RECORD
STOREFRONT_DOCUMENT != PUBLICATION_AUTHORITY
PUBLICATION_RECEIPT != PUBLICATION_EFFECT
PUBLICATION_RECEIPT != WORK_COMPLETION
PUBLIC_URL != PROVIDER_AUTHORITY
VEXWORK != STOREFRONT_DATABASE
~~~

The document and receipt are observations/plans, not executors:

~~~
effects = false
executionAuthority = NONE
~~~

## Why this slice does not choose a repository

P4 investigated the currently accessible public repositories before inventing a site owner.

- Vextreme is the VexLife/Vextreme institutional and content-archive surface with its own page/arc/build semantics and a protected payment-activation boundary.
- VexGPT/vextreme-llc is stale 2024 application/context machinery, not a current storefront owner.
- VexWorld is an adventure-world/game runtime with a separate one-lane source contract.

None is a truthful owner for the Antique Plate storefront.

P4 therefore establishes the reusable publication boundary, not a guessed repository. The P5 lived pilot may deliberately select or form a rightful site owner and then produce a real publication receipt.

## Storefront document

src/adapters/commerce-storefront.mjs owns:

~~~
vexwork.commerce-storefront-document/v1
~~~

Formation requires:

~~~
documentRef
storefrontRef
publicFieldRefs[]
imageRefs[]
sourceRefs[]
+ one exact Commerce item observation
~~~

The output binds:

~~~
itemRef
itemSemanticFingerprint
itemObservedAt
label
availabilityState
selected public fields
selected image refs
sourceRefs[]
~~~

The document always includes the current item label and inventory-backed availability state. Optional item details are not public merely because they exist.

The first explicit public-field vocabulary is:

~~~
description
condition
dimensions
maker
provenance notes
price
~~~

A selected field must actually exist on the current Commerce item observation.

Selected image refs must be a subset of the item's current imageRefs[].

The first document deliberately never projects:

~~~
soldAt
expectedShipmentAt
fulfillmentEvidenceRefs
shipping address
customer identity
payment information
provider credentials
~~~

Those facts either are operational/private or belong to other rightful sources. They do not become public storefront content by inference.

## Publication receipt

The same adapter owns:

~~~
vexwork.commerce-storefront-publication-receipt/v1
~~~

A receipt is formed after a rightful site/storefront owner performs or observes the external publication effect.

It binds:

~~~
receiptRef
storefrontRef
documentRef
itemRef
documentSemanticFingerprint
ownerRepositoryRef
publicationState
publicUrlOrNull
observedAt
sourceRefs[]
evidenceRefs[]
~~~

States:

~~~
PUBLISHED
WITHDRAWN
UNKNOWN
~~~

PUBLISHED requires a canonical HTTPS public URL plus evidence.

WITHDRAWN requires evidence.

UNKNOWN may truthfully carry no evidence.

The owner repository must be present in the current VexWork Repository Registry. This does not make VexWork the publication owner; it prevents an unregistered repository name from silently becoming effect authority.

## Revision behavior

AI-assisted maintenance works by recomputing a storefront document from the newest accepted Commerce item observation and one explicit public selection.

Example:

~~~
item A
  description known
  price unknown
  two item image refs

selection
  publish description
  publish one image

-> document A1
~~~

Later:

~~~
item A'
  description revised
  price now known
  same itemRef

selection
  publish description
  publish price
  publish both images

-> document A2
~~~

The changed document fingerprint gives the rightful site owner an exact desired-state boundary without VexWork storing an independent mutable catalog.

## P5 realization boundary

P4 does not create a new commerce repository simply because a storefront is needed.

The Antique Plate pilot may now:

1. deliberately choose or form a rightful managed site/storefront owner;
2. register that repository in VexWork if it becomes part of the operating domain;
3. use the storefront document as the exact public-safe desired state;
4. perform the real provider/repository publication effect through that owner's own culture and authority;
5. return a publication receipt with public URL and evidence.

That is where the first actual site is established.

## What remains separate

This slice does not own:

~~~
repository creation
hosting/provider selection
DNS
payment activation
checkout/customer accounts
order ingestion
site deployment
provider credentials
private customer data
automatic publication
interactive VexBoard/canvas behavior
~~~

## Proof

test/commerce-storefront.test.mjs proves:

- a minimal item can form a storefront document with no optional public fields or pictures;
- public fields are explicit and must exist on the current item;
- pictures must be selected from current item image refs;
- operational/private item fields never appear in the storefront document;
- reference ordering does not manufacture document identity drift;
- stored/tampered documents cannot be accepted against the current item;
- publication receipts require a registered owner repository;
- published state requires HTTPS URL and evidence;
- withdrawn state requires evidence;
- unknown publication may remain evidence-free;
- publication receipt/document/item identity and currentness fail closed;
- all outputs remain read-only and carry no publication authority.

<!-- [VXG RealForever][VEXWORK][OPERATIONAL-CONSOLE][P4][COMMERCE-STOREFRONT] -->
