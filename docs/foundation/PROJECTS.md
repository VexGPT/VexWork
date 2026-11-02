# Projects and Project Registry

`[VXG RealForever]`

## Human question

How can VexWork hold many durable human outcomes without making a Project another work-state database or forcing one work item to belong to only one organizational view?

## Project meaning

A **Project** is a bounded grouping over one Workgraph.

```text
Workgraph
  owns Work items + lifecycle + relationships

Project
  selects rootWorkRefs[]
  -> root descendants
  -> one bounded work neighborhood

Work Board
  projects that Project into familiar lanes
```

Permanent:

```text
PROJECT != WORKGRAPH
PROJECT != REPOSITORY
PROJECT != WORK_STATE_OWNER
PROJECT_MEMBERSHIP != WORK_IDENTITY
PROJECT != EPIC
```

An epic-like human outcome is represented by `workClass=OUTCOME`. OUTCOME containment may be nested, so one Project can contain outcome -> outcome -> task/defect depth without introducing a second hierarchy.

## Overlapping Projects

Projects are views/groupings, not exclusive ownership buckets. More than one Project may select the same canonical Work item when that later solves a real cross-cutting planning/navigation question.

Do not create parent/child Project hierarchy merely to imitate another product. The Workgraph already owns containment. A broader program-like view can be another Project selecting higher roots when earned.

## Project Registry

`blueprint/project-registry.json` is the discoverability owner for source-managed Projects.

It answers:

```text
what Projects exist?
where is each Project definition?
which Workgraph identity does it project?
where is that Workgraph source?
where is its Board view?
does it have a Project Agency Policy?
```

The registry contains paths and stable refs only. It does not duplicate Project purpose, WorkState, Board cards, or Workgraph contents. Source-derived membership may generate this projection; the registry file itself does not become a second membership author.

```text
PROJECT_REGISTRY != PROJECT
PROJECT_REGISTRY != WORKGRAPH
PROJECT_REGISTRY != PLANNING_RUNTIME
```


### Source-derived discoverability

For source-managed local Projects, discoverability membership is derivable from validated Project
source. A filesystem adapter may enumerate candidate `project.json` files, but the path/slug only
locates bytes:

~~~text
candidate definition path
-> createProject(project.json)
-> projectRef from validated source
-> rootWorkRefs resolve in the exact Workgraph
-> optional explicit Board binds the same projectRef
-> discoverability entry
~~~

Permanent:

~~~text
PROJECT_PATH != PROJECT_IDENTITY
PROJECT_DIRECTORY_NAME != PROJECT_IDENTITY
COMPATIBILITY_ORDER != PROJECT_MEMBERSHIP
~~~

The registry's `boardViewPath` may be `null`. Null means the Project uses the canonical default
Work Board derived from Project identity/label plus the Work Registry's canonical lanes. A non-null
path means the Project has an explicit Board source.

A compatibility order may rank selected known ProjectRefs for presentation continuity. It is allowed
to be partial: source-managed Projects omitted from that order still enter discoverability
deterministically. A stale compatibility ref fails closed rather than silently suppressing or
resurrecting membership.

## Source placement

The first Workgraph was historically formed beneath `projects/vexwork-foundation/`. Once a second Project became real, the shared source moves to `workgraphs/public.json`.

The stable graph identity remains `workgraph.vexwork.foundation`; stable identity is not renamed merely because the physical source location becomes more truthful.

Project-local source stays under:

```text
projects/<physical-project-directory>/
  project.json         # semantic Project identity lives here
  board.view.json      # only when Project-specific Board semantics are earned
  agency.policy.json   # only when that Project has earned one
```

## Project formation

Use `process.vexwork.form-project` when a human-approved outcome has enough real structure that future workers would otherwise reconstruct grouping, decomposition, repository relationships, or execution posture from chat/provider history.

## Version/release scope

Release/version grouping is **not** source-placed by this foundation.

```text
PROJECT != RELEASE
WORK_STATE != RELEASE_MEMBERSHIP
OUTCOME != FIX_VERSION
```

When a real release target needs stable cross-Project grouping, form the smallest rightful Release Scope owner then. Do not add tags/fixVersion vocabulary before that pressure exists.

<!-- [VXG RealForever][VEXWORK][FOUNDATION][PROJECTS] -->
