# Commerce Item Model

`[VXG RealForever]`

## Human question

How can the reusable Commerce starter recognize one sellable physical item, its current inventory state, and whatever useful details are actually known **without making VexWork the catalog database or requiring every possible commerce field?**

The bounded relationship is:

```text
rightful commerce provider / source
-> current commerce item observation
-> existing VexWork Population Snapshot projection
-> later listing-readiness / inventory / fulfillment lenses
-> later storefront and fulfillment effects through their rightful owners
```

Permanent distinctions:

```text
COMMERCE_ITEM != WORK_ITEM
COMMERCE_ITEM_OBSERVATION != COMMERCE_DATABASE
INVENTORY_STATE != WORK_STATE
INVENTORY_STATE != LISTING_STATE
ITEM_DETAILS != REQUIRED_IDENTITY
LISTING_URL != PUBLICATION_AUTHORITY
FULFILLMENT_EVIDENCE_REF != PHYSICAL_SHIPMENT
POPULATION_PROJECTION != ITEM_MUTATION
```

The adapter is read-only:

```text
effects = false
executionAuthority = NONE
```

## Why this slice is small

P4 needs a second domain that pressures the accepted Population / Lens / Operating Domain contracts differently from VexSite.

The first pressure is not storefront publication or order ingestion. It is simpler:

> a physical item may exist and be worth tracking even when pictures, description, dimensions, maker, price, listing URL, sale time, shipment date, and fulfillment evidence are not known yet.

That means the item model must have a genuinely small required core and optional enrichment rather than a giant mandatory record.

## Required current observation

`src/adapters/commerce-item-model.mjs` owns:

```text
vexwork.commerce-item-observation/v1
```

A current item observation requires only:

```text
itemRef
providerRef
label
inventoryState
observedAt
sourceRefs[]
```

The inventory vocabulary is deliberately bounded:

```text
AVAILABLE
SOLD
WITHDRAWN
UNKNOWN
```

This is provider/domain truth, not a VexWork lifecycle.

`AVAILABLE` does not mean a public listing exists.
`SOLD` does not mean fulfillment is complete.
`WITHDRAWN` does not imply historical Work completion.
`UNKNOWN` preserves uncertainty instead of manufacturing a state.

## Optional enrichment

The first contract permits these fields to be absent entirely:

```text
description
condition
dimensions
maker
provenanceNotes
price
imageRefs[]
listingUrl
soldAt
expectedShipmentAt
fulfillmentEvidenceRefs[]
```

Price is represented without binary floating-point ambiguity:

```text
price
  amountMinor
  currency
```

Images and fulfillment evidence are references, not copied binary artifacts. A listing URL is navigation/provenance only and grants no publication effect.

Sold-time, expected-shipment, and fulfillment-evidence fields are accepted only when the current inventory state is `SOLD`. None of them is required merely because an item is sold.

The model deliberately contains no shipping address, customer record, payment credential, tax/accounting record, or provider secret.

## Population adapter

`createCommerceItemPopulation()` translates a set of accepted item observations into the already-owned:

```text
vexwork.entity-population-snapshot/v1
```

It does not invent a second catalog collection schema.

The projection keeps:

```text
entityRef = itemRef
entityKind = entity.commerce.sellable-item
providerRef = rightful commerce provider
```

and starts with no synthetic grouping scopes. Real category/location/grouping pressure can earn scopes later.

The adapter requires all items in one population observation to belong to the same provider, rejects duplicate item identity, and rejects an item observation newer than the population observation.

## What stays separate

This slice does **not** own:

```text
listing/publication state
storefront mutation
order or sale-event ingestion
customer/private shipping data
payment state
fulfillment queue semantics
shipment execution
notification delivery
commerce persistence
automatic Work creation
interactive UI / canvas behavior
```

The next P4 slices may compose this item model with:

- a listing-readiness Lens;
- an AI-managed storefront/site surface;
- the accepted Attention Queue for sale/fulfillment attention.

Those later slices should pressure this contract rather than being preloaded into it.

## Proof

`test/commerce-item-model.test.mjs` proves:

- minimum identity/state works without optional enrichment;
- optional fields are genuinely optional and canonical when present;
- provider-owned item observations remain read-only/no-authority;
- stable reference arrays normalize before fingerprinting;
- hidden/unknown authority or private-data-shaped fields fail closed;
- sold-only enrichment cannot contradict current inventory state;
- population projection reuses the generic Population Snapshot contract;
- mixed providers, duplicate item identity, and observation-time contradictions fail closed.

<!-- [VXG RealForever][VEXWORK][OPERATIONAL-CONSOLE][P4][COMMERCE-ITEM-MODEL] -->
