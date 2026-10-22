# Derived Attention foundation

`[VXG RealForever]`

## Purpose

Derived Attention is the portable VexWork boundary for answering:

> What entities currently exist, what is true about each one under a selected lens, and which facts deserve work-shaped attention — without turning every entity into a Work item or making repository/provider health into WorkState?

It sits beside Workgraph rather than inside it:

```text
repository / provider population + current evidence
-> population snapshot + Work Lens
-> per-entity completion + attention
-> later aggregate / scope / entity projection
-> explicit promotion when real Work is admitted

Workgraph
-> canonical lifecycle truth only for admitted Work
```

Permanent:

```text
ENTITY != WORK_ITEM
ENTITY_COMPLETION != WORK_STATE
DERIVED_ATTENTION != IMPLEMENTATION_AUTHORITY
POPULATION_SNAPSHOT != SOURCE_DATABASE
EXISTING_WORK_REFERENCE != AUTOMATIC_PROMOTION
```

## Why this foundation exists

VexSite already owns a large population of pages, routes, arcs, localization sources, generated runtime and lived evidence. Creating one VexWork task per page merely to answer "what remains?" would duplicate repository inventory and create ticket-maintenance ceremony.

The same pressure appears in other domains: catalog items, devices, documents, credentials, orders or shipments can exist independently from durable Work. VexWork needs one reusable observation contract before those domains earn their own adapters and processes.

## Contract objects

### Population snapshot

`vexwork.entity-population-snapshot/v1` binds one current observation of a provider-owned population:

```text
populationRef             stable population identity
snapshotRef               exact observation identity
providerRef               rightful source/provider owner
entityKind                stable kind shared by the entities
observedAt                currentness boundary
sourceRefs[]              provenance for the snapshot
scopes[]                  nested grouping identities
entities[]                stable entity identity + scope/source references
semanticFingerprint       deterministic snapshot identity
```

A new snapshot may add or remove entities. Stable `entityRef` values let later observations recognize the same entity without copying its source record into Workgraph.

Scope membership is a projection coordinate, not ownership. Scope parents must exist and the scope graph must remain acyclic.

### Work Lens

`vexwork.work-lens/v1` defines the question asked of one population:

```text
lensRef
populationRef
label / purpose
sourceRefs[]
predicates[]
  predicateRef
  requirement = REQUIRED | ADVISORY
  reasonFacetRef
  sourceRefs[]
```

A Lens owns neither the entity nor the evidence. It defines how current provider/repository truth is interpreted for one reusable work question.

The same entity may be evaluated by several lenses without identity duplication:

```text
page A
  localization lens
  accessibility lens
  header-modernization lens
```

### Entity Lens evidence

`vexwork.entity-lens-evidence/v1` binds one entity to the exact population snapshot and Work Lens fingerprints used for the observation.

Every Lens predicate must have exactly one result:

```text
SATISFIED
UNSATISFIED
UNKNOWN
NOT_APPLICABLE
```

`SATISFIED`, `UNSATISFIED`, and `NOT_APPLICABLE` require explicit evidence references. `UNKNOWN` may truthfully carry none when the required fact was not obtainable.

The exact-coverage rule prevents a producer from making a partial evidence set look complete by omitting an inconvenient predicate.

### Derived Attention

`vexwork.derived-attention/v1` is a deterministic, read-only result for one entity under one Lens.

It keeps two dimensions separate.

Required predicates determine completion:

```text
any REQUIRED UNSATISFIED  -> INCOMPLETE
else any REQUIRED UNKNOWN -> UNKNOWN
all REQUIRED N/A or none  -> NOT_APPLICABLE
otherwise                 -> COMPLETE
```

All applicable predicates determine attention:

```text
any UNSATISFIED -> ATTENTION
else any UNKNOWN -> UNKNOWN
all N/A          -> NOT_APPLICABLE
otherwise        -> CLEAR
```

This allows an advisory concern to surface attention without falsely changing required completion. It also allows a required failure to be both `INCOMPLETE` and `ATTENTION` without inventing a WorkState.

The result carries reason facets, current scope membership, and any already-known canonical Work references. It always declares:

```text
effects = false
executionAuthority = NONE
```

## Deterministic identity

Population, scope, predicate, evidence and existing-Work reference arrays are normalized by stable identity before semantic fingerprinting. Provider enumeration order therefore does not manufacture semantic drift. A stored fingerprinted object must already use that normalized order; VexWork rejects rather than silently rewriting persisted semantic identity.

Actual truth changes still change the fingerprint:

```text
entity appears / disappears
scope membership changes
predicate changes
evidence state or provenance changes
snapshot identity / observation time changes
```

A result bound to an older population or Lens fingerprint is rejected rather than silently reinterpreted.

## Ownership and privacy

The repository or provider remains owner of entity identity and current domain truth. VexWork records stable references and derived meaning; it does not become the source database by copying arbitrary records.

```text
VEXTREME page/runtime truth -> Vextreme
commerce item/order truth   -> rightful commerce owner
private customer data       -> private provider/process
Work lifecycle truth        -> Workgraph after explicit admission
```

A public projection must use public-safe references. This foundation does not authorize publishing private provider evidence or customer data.

## Localization threshold

Once this foundation is accepted, the VexSite Localization consumer may independently form its bounded population/scope adapter against:

```text
createPopulationSnapshot()
createWorkLens()
createEntityLensEvidence()
deriveEntityAttention()
```

That consumer can bind current Vextreme page/arc identity and localization evidence without waiting for the full Operational Console, commerce template, UI, or Work-promotion implementation.

The consumer still owns its exact Vextreme source descent and must not claim aggregate/lived completion until the later projection and patient-zero proof obligations are actually satisfied.

## Deliberately held from this slice

This contract does not yet own:

```text
aggregate / group / entity drill-down projection
promotion of one concern into canonical Workgraph Work
attention queues for event-shaped domains
Operating Domain templates
commerce-specific item / order / fulfillment semantics
interactive UI
provider mutation or source effects
```

Those remain separate Operational Console work items so the first reusable boundary stays small enough to understand, test and reuse.

## Proof

`test/derived-attention.test.mjs` proves:

- dynamic membership with stable entity identity;
- nested scopes and cycle rejection;
- deterministic order normalization;
- exact predicate coverage and stale-fingerprint rejection;
- required completion versus advisory attention;
- complete, incomplete, unknown and not-applicable distinctions;
- multiple lenses over the same entity population;
- explicit no-effects / no-authority output.

<!-- [VXG RealForever][VEXWORK][FOUNDATION][DERIVED-ATTENTION] -->
