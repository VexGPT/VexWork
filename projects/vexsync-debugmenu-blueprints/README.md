# VexSync DebugMenu Blueprints — project entry

`[VXG RealForever]`

## Human outcome

Victor + AI should be able to author one executable-quality VexLife UI design in VexBoard, preserve its
semantic identities, intentions, expected pathways and design constraints once, then use target
adapters to create or update the rightful Android source, derive the corresponding proof, form a
reviewable PR, and project the resulting target/source/evidence back into the same VexBoard
neighborhood.

The ordinary path should become:

```text
Victor + AI author once in VexBoard
        |
        v
published / accepted Origin + design meaning
        |
        v
Android construction mapping
        |
        v
create / update target-native source
        |
        +-> derive pathway / construction tests
        +-> compile / deterministic proof
        |
        v
reviewable Android PR candidate
        |
        v
reverse target/source/evidence projection
        |
        v
same semantic coordinates in VexBoard
```

Routine adapter-supported work should not require a second manual code-authoring pass merely to
translate an already-settled design into Kotlin/Compose.

## Why Debug Menu is the first VexSync patient zero

The earlier VexStream work remains valuable architecture pressure, but Debug Menu is a smaller surface
that still exercises materially different semantic depths in one Screen:

```text
Dark Mode
  stateful control / behavior pressure

Show Log History
  local presentation

Reset Log History
  application behavior
  -> runtime owner
  -> persistence
  -> repository
  -> Room DAO / entity / SQL table

Events Simulator (later extension)
  developer control
  -> feature-owned controller
  -> repository/state
  -> ordinary reactive product behavior
```

That makes Debug Menu a better first proof of the reusable construction loop without losing the
deeper VexUniverse requirement.

## Intent correction — shared live language

An earlier draft of this Project over-separated "portable VexBoard meaning" from Android
`ElementIntent` meaning. That framing was too strong and contradicted the intended authoring model:
VexBoard is developing a readable typed semantic language that Android should be able to realize
without duplicating semantic interpretation. Existing Android language is evidence and implementation
pressure; the living Blueprint determines which meanings become reusable across realms.

Likewise, the initial draft prematurely named three Debug Menu controls as the pilot. Current work is
deliberately slower: one human feature request, one grounded terrain edge, one identifier/meaning
question at a time.

## Naming checkpoint — do not regress the language

This Project is formed from the current VexBoard foundational-language refinement successor and its
current PR/source checkpoints. It must preserve those distinctions rather than reviving predecessor
names by habit.

Current working naming direction:

```text
Origin
  current reusable semantic-source vocabulary

UIRealizationProjection / UIScreenRealization / UIElementRealization
  current new target-realization projection naming in Android PR #183

UIBlueprintRegistry
  existing Android migration/source coordinate
  != precedent for new portable naming

ElementIntent
  existing Android target/runtime request union
  current evidence/reference for reusable intention language
  DO NOT pre-classify as Android-only
  DO NOT rename wholesale into a universal abstraction
  let live Blueprint pressure reveal which typed meanings should be shared across realms

typed NavigateTo / NavigateBack
  readable typed intention language that VexBoard and Android should be able to share/realize directly

typed Open / Close / selection
  candidate reusable typed intention language where the same meaning survives realms

SCAE
  applies when a real Behavior question earns State / Control / resolved Act / Effect depth
```

The user-facing Project label intentionally retains **Blueprints** because it names the authoring
experience/trajectory. It does not reverse the current `Blueprint -> Origin` naming refinement for new
canonical semantic-source types.

Exact current Android symbols such as `AppScreenBlueprint` remain real source coordinates and may
appear in SOURCE / CONSTRUCTION lenses. Their existence does not decide the reusable language either
way. Where Android already expresses the same readable semantic intention VexBoard needs, prefer
shared meaning over inventing a second translation layer.

Do not mechanically rename existing `*Ref`, `*Element`, `UIBlueprintRegistry`, `ElementIntent`, or
other accepted/migration source. Classify the responsibility first.

Also do not freeze chat shorthand such as an `Origin / Truth / Intention` trio as accepted source just
because it helped discussion. The first Work edge below exists specifically to turn the surviving
language into a source-grounded executable construction contract.

## VexBoard is the authoring hub, not merely a source browser

The desired VexBoard experience is not:

```text
design
-> "look somewhere in Android for similar code"
```

It is:

```text
one selected semantic coordinate
  -> PRODUCT / DESIGN
  -> CONSTRUCTION
  -> BEHAVIOR
  -> exact SOURCE symbol / class / method
  -> runtime owner
  -> repository / service / provider
  -> DATA entity / DAO / table / column when relevant
  -> tests / evidence
  -> Work / Process / history
```

Those are projections of rightful owners, not duplicated truth databases.

For example, the current Reset Log control should eventually be traversable from its VexBoard meaning
through the exact Android element/action registration and down through logger/persistence/repository/
Room/DAO/table semantics without GitHub archaeology.

## Construction law

The realm/target construction path should behave like a compiler for supported meaning, not a second
semantic interpreter:

```text
same accepted typed Blueprint intention
+ same target realization contract
-> deterministic target semantic/source realization
```

A settled expression such as `Act.NavigateTo(screenId = ...)` should not require another AI or target
layer to rediscover what "navigate to this Screen" meant. Target-specific mechanics may differ; the
settled semantic intention should remain readable and shared.

The adapter may create new source files or modify existing target-owned files. Source placement,
registration, resource placement and generated/test ownership belong to the adapter contract rather
than fresh AI improvisation on every run.

If a design requires a target capability that has not been standardized:

```text
VALID ORIGIN / DESIGN
+ UNSUPPORTED TARGET CAPABILITY
-> explicit capability gap
!= ad-hoc manual implementation hidden behind the compiler
```

The capability can be implemented and proven once, then reused by later designs.

## Pathways are proof input

A VexBoard pathway is not only documentation. Where it carries executable-quality expectations it may
project into more than one proof surface:

```text
one authored pathway
  +-> semantic simulation / contract proof
  +-> Android construction proof
  +-> generated target test
  +-> lived/native evidence where required
```

The generated proof must preserve the distinction between semantic equivalence, target construction
correctness, compiler/build success and lived/native/provider proof.

## Save / apply product expectation

Victor should not need to operate the underlying lifecycle machinery manually.

A future simple authoring action may advance all currently admitted steps:

```text
save / publish design
-> validate
-> resolve target capabilities
-> generate / modify source
-> derive tests
-> run deterministic proof
-> reverse-project semantics
-> form or update PR
-> expose the exact remaining lifecycle boundary
```

The UI may present this as one calm **Save & Deploy**-style action while preserving internally truthful
states such as saved, published, target candidate formed, verified, integrated and actually deployed.
A PR being opened is not itself production deployment.

## Sibling provenance

This Project does not replace its sibling trajectories:

```text
project.vexboard
  Origin IDE, design/construction/source/evidence lenses, foundational language refinement

project.vex-universe
  one explorable ecosystem; VexBoard as semantic/process projection hub without source archaeology

project.vexlife.blueprint-source-of-truth
  portable semantic meaning, deterministic forward mappings, semantic/native proof, reverse observation

project.vexlife-android.current-state-refinement
  current Android/SCAE/scale pressure and repository-owned target semantics

project.android-proof-orchestration
  reusable Android host/device proof where target-native/lived evidence is actually required
```

These are provenance and dependency context, not permission to reopen their accepted work or copy their
truth into this Project.

## Current source checkpoints carried as provenance

The supplied successor identifies these active/candidate coordinates:

```text
VexWork PR #155
  current VexBoard architecture / language-refinement branch in the supplied checkpoint

VexLife-Android PR #182
  exact-head source-proven target capability candidate
  CANDIDATE_PROVEN_PENDING_ACCEPTANCE

VexLife-Android PR #183
  stacked UIRealizationProjection candidate
  intentionally held while foundational language is refined
```

They are provenance, not automatic current-main acceptance. Any implementation effect must re-ground
the relevant repository/provider state first.

## Current discovery companion

The live examples and phase-discovery checkpoint currently live in:

~~~text
projects/vexsync-debugmenu-blueprints/CURRENT-EXAMPLES.md
~~~

Read that file as **current discovery pressure**, not accepted schema. It preserves the present
Feature Request -> Builder Entry reasoning, the intentionally incomplete dark/light-mode example,
identifier-grounding discipline, and the rule that a missing implementation HOW is Builder work
rather than permission to guess.

## Current Work edge

```text
work.vexsync.debugmenu-blueprints.origin-language-contract
```

First discover the live typed language through one feature request at a time. The current specimen is
the dark/light theme request and its Home -> developer entry -> Debug Menu terrain. Do not pre-form the
rest of Debug Menu merely because current Android already contains more controls.

The immediate work is:

```text
human request
-> translated intention + expected return
-> Builder grounds/creates required coordinates
-> typed live Blueprint path
-> only then compare/map current Android realization
```

Additional Debug Menu controls become consumers only when the living Blueprint reaches them.

VexStream remains an important harder secondary consumer after the Debug Menu compiler path proves it
is genuinely reusable rather than Debug-specific.

## Boundaries

```text
PROJECT_FORMATION != TARGET_IMPLEMENTATION_AUTHORITY
VEXBOARD_HUB != OWNER_OF_EVERY_SOURCE
SHARED_INTENTION_MEANING != TARGET_SPECIFIC_MECHANICS
ANDROID_REALIZATION SHOULD NOT REQUIRE REINTERPRETING SETTLED BLUEPRINT MEANING
GENERATED_SOURCE != ACCEPTED_SOURCE
COMPILER_PASS != SEMANTIC_EQUIVALENCE
SEMANTIC_EQUIVALENCE != LIVED_NATIVE_PROOF
PR_OPEN != DEPLOYED
SUPPORTED_ADAPTER_PATH != PERMISSION_TO GUESS UNSUPPORTED SOURCE
```

<!-- [VXG RealForever][VEXSYNC][DEBUGMENU][ORIGIN][CONSTRUCTION] -->
