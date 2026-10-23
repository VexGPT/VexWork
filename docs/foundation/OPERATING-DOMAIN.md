# Operating Domain foundation

`[VXG RealForever]`

## Human question

How can VexWork describe one operational environment as a reusable whole—its capabilities, populations, lenses, recurring processes and later attention queues—without turning the descriptor into another owner of provider truth, WorkState or execution authority?

The portable relationship is:

```text
rightful source owners
  capabilities
  populations
  lenses
  processes
  attention queues
        ↓
Operating Domain descriptor
        ↓
read-only composition / discoverability
        ↓
Operational Console projection
```

## Permanent distinctions

```text
OPERATING_DOMAIN != WORKGRAPH
OPERATING_DOMAIN != SOURCE_DATABASE
DOMAIN_BINDING != OWNERSHIP_TRANSFER
CAPABILITY != EFFECT_AUTHORITY
POPULATION_BINDING != ENTITY_COPY
LENS_BINDING != PROVIDER_TRUTH
PROCESS_BINDING != PROCESS_EXECUTION
ATTENTION_QUEUE_BINDING != QUEUE_IMPLEMENTATION
DOMAIN_PROJECTION != MUTATION_PERMISSION
```

The descriptor always projects:

```text
effects = false
executionAuthority = NONE
```

## Contract

`src/core/operating-domain.mjs` owns `vexwork.operating-domain/v1`.

A domain carries:

```text
domainRef
label
purpose
repositoryRefs[]

capabilities[]
  capabilityRef
  label
  ownerRepositoryRef
  sourceRefs[]

populations[]
  populationRef
  label
  ownerRepositoryRef
  entityKind
  sourceRefs[]

lenses[]
  lensRef
  label
  ownerRepositoryRef
  populationRef
  sourceRefs[]

processes[]
  processRef
  label
  ownerRepositoryRef
  sourceRefs[]

attentionQueues[]
  queueRef
  label
  ownerRepositoryRef
  sourceRefs[]

sourceRefs[]
semanticFingerprint
```

The descriptor is deliberately relational. It does not reproduce the records owned by those references.

## Fail-closed ownership rules

The first contract proves only relationships VexWork can validate truthfully:

- every `ownerRepositoryRef` must be present in the Repository Graph registry;
- every binding owner must also be included in the domain's `repositoryRefs`;
- every Lens must target a population bound by the same domain;
- every Process must exist in the Process Map and its declared owner must exactly match the Process Map owner;
- every binding ref is unique within its class;
- every binding and the domain itself carry explicit source refs;
- unknown fields are rejected rather than silently becoming authority or hidden semantics.

Capabilities, populations, lenses and attention queues may be owned outside VexWork. Stable refs plus source refs preserve navigation without copying their source databases.

## Attention queue boundary

The Operating Domain contract intentionally permits:

```text
attentionQueues = []
```

That is not an omission.

The P3 sibling work `work.vexwork.operational-console.attention-queue-contract` owns event/exception queue semantics. This contract only reserves the composition slot so later domains do not require a schema redesign.

```text
QUEUE_SLOT_EXISTS != QUEUE_SEMANTICS_ALREADY_DEFINED
```

## Patient zero

`projects/vexwork-operational-console/vexsite-operating-domain.json` is the first real descriptor.

It composes:

```text
repo.vextreme
  population.vextreme.vexsite.pages

repo.vexwork
  capability.vexwork.derived-attention
  capability.vexwork.derived-work-promotion
  lens.vextreme.vexsite.localization
  process.vexwork.promote-derived-concern

attentionQueues
  []
```

That proves the reusable boundary against the accepted VexSite P2 outcome rather than a fictional domain.

The Vextreme population remains provider-owned. The VexWork Lens remains an interpretation contract. Promotion remains explicit. The parked Closed Circuit Work remains canonical Workgraph truth only because P2 separately admitted it.

## Reuse threshold

P4 Commerce should be able to create a different descriptor using the same contract:

```text
commerce capabilities
commerce population(s)
commerce lens(es)
commerce process route(s)
later commerce attention queue(s)
```

without changing `vexwork.operating-domain/v1`.

If P4 requires new semantics rather than new bindings, that pressure should justify a contract evolution explicitly.

## Proof

`test/operating-domain.test.mjs` proves:

- live VexSite descriptor validation and projection;
- deterministic order normalization;
- unknown repository rejection;
- unbound Lens population rejection;
- Process Map owner mismatch rejection;
- duplicate binding rejection;
- hidden/extra authority-shaped fields rejected;
- empty attention queue is valid and does not imply queue implementation;
- projection remains read-only/no-authority.

<!-- [VXG RealForever][VEXWORK][FOUNDATION][OPERATING-DOMAIN] -->
