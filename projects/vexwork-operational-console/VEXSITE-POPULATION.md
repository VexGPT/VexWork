# VexSite Population Adapter

`[VXG RealForever]`

## Why this boundary exists

VexWork needs to show a changing VexSite population through aggregate → scope → entity descent without copying each page into Workgraph or becoming another owner of Vextreme page, node, group, arc, or localization truth.

The adapter therefore consumes one already-generated, content-deterministic Vextreme read model and emits the existing VexWork Population Snapshot contract:

```text
Vextreme data/index.json at an exact observed source identity
-> createVextremeVexSitePopulation()
-> vexwork.entity-population-snapshot/v1
```

It does not fetch a provider, crawl HTML, write Vextreme, create Work, or issue execution authority.

## Population rule

A VexSite page entity exists when all of these are true in the same accepted `data/index.json`:

1. the slug exists in `slugMap`;
2. `departmentMap` contains exactly one row for that slug;
3. that row says `ported: true`.

This preserves Vextreme's own distinction between a current page and a curated-but-not-yet-ported node. Auto-discovered real pages remain visible because Vextreme already projects them into `slugMap` and `departmentMap`.

```text
CURRENT_PAGE_ENTITY != EVERY_CURATED_NODE
AUTO_DISCOVERED_PAGE != INVISIBLE_PAGE
POPULATION_SNAPSHOT != COPIED_PAGE_DATABASE
```

## Scope rule

The adapter projects:

```text
Vextreme VexSite pages
  -> one scope per current arc
     -> one scope per ordered arc section
  -> Unscoped pages, only when needed
```

Entities attach to leaf section scopes. Overlapping arc membership remains overlapping scope membership; aggregate and ancestor summaries de-duplicate entities through the existing Derived Attention projection.

Vextreme's section records currently have labels and order but no separate canonical section IDs. The adapter therefore uses `arc key + one-based section ordinal` as projection identity. That derived scope ref is not a new Vextreme semantic owner. A section reorder changes the provider snapshot and therefore changes the projection truth.

## Fail-closed alignment

Before emitting a Population Snapshot, the adapter requires:

- `nodeCount == slugMap size`;
- `curatedNodeCount + autoDiscoveredCount == nodeCount`;
- `arcCount == arcMap size`;
- exact `arcMap` / `arcMeta` key agreement;
- exact one-row `departmentMap` coverage for every `slugMap` entry;
- every arc-section slug to exist in `slugMap` and declare the same arc;
- every node-declared arc membership to appear exactly once in that arc's section map.

A contradiction is provider/source evidence to resolve. It is not silently normalized into a VexWork-owned truth.

## What remains separate

This adapter does **not** decide whether a page is localized, generated-current, provider-modernized, rendered correctly, or lived-proven. Those predicates belong to the next VexSite localization lens and remain defined by current Vextreme source and evidence.

It also does not promote a derived concern into Work. Existing Work references and promotion remain later, separately governed VexWork effects.

```text
ENTITY != WORK_ITEM
ENTITY_COMPLETION != WORK_STATE
PROJECTION != IMPLEMENTATION_AUTHORITY
VEXTREME_SOURCE_TRUTH != VEXWORK_LIFECYCLE_TRUTH
```

<!-- [VXG RealForever][VEXWORK][OPERATIONAL-CONSOLE][VEXSITE-POPULATION] -->
