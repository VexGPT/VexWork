# Commerce Fulfillment Attention

`[VXG RealForever]`

## Human question

How can a truthful sold-item observation become bounded fulfillment attention—and later clear only after explicit acknowledgement—without making a sale equal shipment, copying customer data into VexWork, or inventing another Work lifecycle?

The composition is:

```text
current Commerce item observation
  inventoryState = SOLD

+ current fulfillment observation
  ACTION_REQUIRED | ACKNOWLEDGED | UNKNOWN

-> Commerce fulfillment adapter

-> existing Attention Queue snapshot
  ATTENTION | CLEAR | UNKNOWN
```

Permanent distinctions:

```text
SOLD != SHIPPED
SOLD != FULFILLMENT_ACKNOWLEDGED
FULFILLMENT_STATE != WORK_STATE
FULFILLMENT_OBSERVATION != ORDER_DATABASE
FULFILLMENT_EVIDENCE != WORK_COMPLETION
EXPECTED_SHIPMENT_AT != QUEUE_PRIORITY
EXPECTED_SHIPMENT_AT != SLA
CUSTOMER_ADDRESS != PUBLIC_VEXWORK_SOURCE
ATTENTION_CLEAR != COMPLETED_WORK
```

Both the fulfillment observation and the queue projection remain:

```text
effects = false
executionAuthority = NONE
```

## Why this adapter exists

The accepted Commerce item model already owns provider/domain item truth and permits a current sold item to carry optional fields such as:

```text
soldAt
expectedShipmentAt
fulfillmentEvidenceRefs[]
```

Those fields do not themselves define fulfillment status.

The accepted Attention Queue already owns generic event/exception-shaped attention.

This adapter exists only to bridge the missing domain meaning:

> does this sold physical item currently require fulfillment action, is the fulfillment fact unknown, or has a rightful source explicitly acknowledged it?

That distinction is needed before the Antique Plate pilot can truthfully reach the human physical-shipment boundary.

## Fulfillment observation

`src/adapters/commerce-fulfillment-attention.mjs` owns:

```text
vexwork.commerce-fulfillment-observation/v1
```

Required fields:

```text
fulfillmentRef
itemRef
providerRef
fulfillmentState
observedAt
sourceRefs[]
evidenceRefs[]
```

States:

```text
ACTION_REQUIRED
ACKNOWLEDGED
UNKNOWN
```

`ACTION_REQUIRED` and `ACKNOWLEDGED` require evidence.

`UNKNOWN` may truthfully carry an empty evidence set.

The observation must refer to the same item/provider as the Commerce item observation and may not predate that item observation.

## Queue mapping

The mapping is deliberately direct:

```text
ACTION_REQUIRED -> ATTENTION
ACKNOWLEDGED    -> CLEAR
UNKNOWN         -> UNKNOWN
```

The stable `fulfillmentRef` becomes the Attention Queue entry identity.

The item remains the queue subject:

```text
subjectRef  = itemRef
subjectKind = entity.commerce.sellable-item
```

The adapter does not create Work. Existing Work references and an optional Process Map route remain relational queue fields.

## Sold-item gate

The adapter rejects any item whose current inventory state is not:

```text
SOLD
```

This is intentional.

An `AVAILABLE`, `WITHDRAWN` or `UNKNOWN` item does not earn physical-sale fulfillment attention through this route.

The adapter also refuses to treat the presence of `item.fulfillmentEvidenceRefs[]` as automatic closure. Only an explicit fulfillment observation with:

```text
fulfillmentState = ACKNOWLEDGED
+ evidenceRefs[]
```

maps to queue `CLEAR`.

That keeps evidence references and their semantic interpretation separate.

## Expected shipment date

The Commerce item model may carry `expectedShipmentAt`.

This adapter does not copy that timestamp into Attention Queue and does not turn it into ordering, priority, due-date or SLA semantics.

If later operational use demonstrates a real need for scheduling/priority, that pressure must earn its own explicit contract.

## Privacy boundary

This contract contains no:

```text
shipping address
customer identity
payment credential
provider secret
carrier credential
```

The queue can explain that fulfillment is required using public-safe stable references while the rightful private provider/process retains protected destination data.

## What remains separate

This slice does not own:

```text
order ingestion
listing/publication state
storefront mutation
payment state
carrier purchase / label generation
physical shipment execution
notification delivery
commerce persistence
automatic Work creation
interactive UI / canvas behavior
```

The independently READY AI-managed storefront/site sibling remains separate.

## Proof

`test/commerce-fulfillment-attention.test.mjs` proves:

- a SOLD item plus `ACTION_REQUIRED` produces queued `ATTENTION`;
- explicit `ACKNOWLEDGED` evidence produces `CLEAR` and leaves active queue projection;
- truthful `UNKNOWN` remains queued without invented evidence;
- non-SOLD items cannot enter this fulfillment route;
- item/provider identity and observation currentness must agree;
- non-UNKNOWN fulfillment states require evidence;
- hidden/private/authority fields fail closed;
- generic queue owner and optional process routing remain validated by existing registries;
- existing Work refs remain relational only;
- expected shipment date and item fulfillment evidence do not silently become queue closure/priority semantics.

<!-- [VXG RealForever][VEXWORK][OPERATIONAL-CONSOLE][P4][COMMERCE-FULFILLMENT-ATTENTION] -->
