# Repository Graph foundation

`[VXG RealForever]`

## Purpose

The Repository Graph lets VexWork answer:

> Which source repositories can this work descend into, and where does each repository explain itself?

It is navigation metadata, not source authority.

```text
Work item
-> repositoryRefs[]
-> Repository Graph entry
-> provider location
-> repository entry/culture refs
-> target repository current source
```

## What an entry may carry

The initial public registry carries only public/source-safe facts:

```text
repositoryRef
label
provider
nameWithOwner
visibility
purpose
entryRefs[]
cultureRefs[]
```

A public VexWork registry must not leak private project/work/source detail. Private deployments may compose additional private repository entries outside the public distribution.

## Cultures remain owned by repositories

VexWork stores navigation references such as:

```text
repo.vexlife
  entry: AGENTS.md
  culture: docs/CULTURE.md
```

It does not copy the content and does not claim VexLife's conventions apply to Android, Vextreme, or VexWork.

```text
REPOSITORY_GRAPH != REPOSITORY_CULTURE
CULTURE_REF != CULTURE_COPY
REFERENCE != AUTHORITY
```

## Cross-repository work

A Project can reference multiple repositories directly or through its Work items. This is how VexWork becomes a work-navigation root without becoming a monorepo.

```text
Project
  -> Work item A -> repo.vexlife
  -> Work item B -> repo.vexlife-android
  -> Work item C -> repo.vextreme
```

Each source mutation still follows the target repository's own current owner, culture, claims, tests, and lifecycle.

<!-- [VXG RealForever][VEXWORK][FOUNDATION][REPOSITORY-GRAPH] -->
