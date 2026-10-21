# Process Map foundation

`[VXG RealForever]`

## Purpose

The Process Map answers:

> "When this kind of work is encountered, which durable process source should a fresh worker follow instead of reconstructing the method from chat or provider history?"

It is a navigation graph over process owners.

```text
Work item / human question
-> processRef
-> ownerRepositoryRef
-> entryRefs[]
-> rightful process source
```

It does not execute that process and does not import the target repository's process semantics into VexWork.

## Why this belongs beside Workgraph

Work identity without a recoverable route still leaves future workers asking how to handle it. Process routing without work identity loses the specific thing being advanced.

The two remain distinct:

```text
WORK_ITEM = what needs attention / what outcome or potential exists
PROCESS = reusable route for handling a recurring class of work question
```

A Work item may record:

```text
formationProcessRefOrNull
nextProcessRefs[]
```

That is enough for the first foundation to preserve how it entered the system and where a later worker should descend next.

## Ownership boundary

VexWork may own a work-system process such as `process.vexwork.capture-discovered-work`.

For an Android product feature, VexWork instead points to the Android-owned authoring process:

```text
process.vexlife-android.feature-authoring
-> repo.vexlife-android
-> docs/features/README.md
-> docs/foundation/FEATURE-EXPERIENCE-LANGUAGE.md
```

This preserves Android's own rule that a fresh feature starts from the human/product situation, current truth, real pressure, missing question, rightful home, minimum source shape and proof.

## Institutional lineage

Vextreme-SDK's process entry established the broader lesson that a recurring institutional question future work should not rediscover from chat history deserves a durable process source. VexWork applies that lesson only to its own work-navigation responsibilities and references external process owners where appropriate.

```text
PROCESS_MAP != PROCESS_OWNER_BY_REFERENCE
PROCESS_MAP != EXECUTOR
PROCESS_REF != AUTHORITY
```

<!-- [VXG RealForever][VEXWORK][FOUNDATION][PROCESS-MAP] -->
