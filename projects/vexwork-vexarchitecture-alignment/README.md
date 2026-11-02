# VexWork VexArchitecture Alignment

[VXG RealForever]

## Human outcome

Refactor VexWork so it scales through the relationship-constrained construction discipline already stabilized in VexLife-Android and pressure-tested again in VexLife-Prod:

~~~
human intention
-> rightful semantic owner
-> explicit source-addressable relationship
-> validator-visible consequence
-> bounded projection / realization
-> proof matching the claim
~~~

Do not copy Kotlin, Family, Frame, Seam, Region, or other product-specific nouns into VexWork.

The transferable law is smaller:

> If VexWork can derive that a relationship must exist, correctness should not depend on a later worker remembering to restate it. If the relationship cannot yet converge, the unsatisfied relationship should remain visibly owed until it does.

## Patient zero

The current failure is project.vexlife.new-beginnings.

Accepted VexWork main contains:

~~~
projects/vexlife-new-beginnings/project.json
projects/vexlife-new-beginnings/board.view.json
workgraphs/segments/vexlife-new-beginnings.json
~~~

while current aggregate truth omits it:

~~~
blueprint/project-registry.json
  -> no project.vexlife.new-beginnings

workgraphs/public.json
  -> no work.vexlife.new-beginnings.outcome

public/workspace.json
  -> no New Beginnings Project

VexWork Projects page
  -> Project not navigable
~~~

PR #199 originally held shared aggregate integration for a legitimate coordination reason. The architecture gap is that a temporary hold can become an invisible unfinished relationship.

~~~
respect another writer
-> merge rightful local source
-> lose convergence obligation
-> durable work exists
-> navigation omits it
-> Victor / successor must rediscover it
~~~

This Project exists to make that failure structurally difficult rather than culturally discouraged.

## Accepted architecture references

VexLife-Android accepted main:

~~~
66c866dea6a8dd78e2946da88715c4deb78c1847
~~~

Relevant sources:

~~~
architecture/vexarchitecture/README.md
architecture/vexarchitecture/REFINED-BOUNDARIES.md
~~~

Transferable patterns:

- one rightful semantic owner;
- active/runtime truth is not duplicated into a second ledger;
- identity derives from already-authored structure where possible;
- chronology/observability has its own owner;
- downstream projections consume truth rather than forcing projection-shaped identities into the source.

VexLife-Prod accepted main:

~~~
20919f21578eeff9d2e1d513a00e0cd66ecd72ea
~~~

Relevant sources:

~~~
docs/CULTURE.md
docs/foundation/SEMANTIC-CONTRACT-AUTHORING.md
docs/foundation/VEXWEB-SPATIAL-FOUNDATION.md
src/commonMain/kotlin/vexlife/semantic/
src/commonMain/kotlin/vexlife/blueprint/
src/commonMain/kotlin/vexlife/web/
~~~

Transferable pattern:

~~~
stable relationship
-> compiler / validator can see it

invalid relationship
-> fail where authored

generated consequence
-> derive from rightful source
-> do not hand-maintain as independent architecture

projection / renderer
-> consume existing identity
-> do not reconstruct identity from memory
~~~

VexWeb A002 is the strongest analogy:

~~~
authored Region / Seam relationship
-> resolve enough geometry to validate it
-> impossible geometry FAILS
-> renderer is not allowed to repair or guess
~~~

VexWork should apply the same discipline to its own relationships.


## Full architecture intention — not a pattern library

This alignment is not permission to cherry-pick one convenient VexArchitecture technique such as
"add a validator" while retaining the older assumption that static duplicate structures, remembered
string relationships, peer wrapper APIs and manually synchronized projections are normal.

The transferable whole property is:

~~~
meaning is authored once by the rightful owner
-> source makes the relationship explicit
-> identity already present in that relationship is carried forward
-> construction exposes only declared prerequisites
-> connective layers consume that meaning and contribute only their mechanics
-> current truth / history / projection remain separate owners
-> deterministic consequences are derived
-> invalid relationships fail where they can be proven invalid
-> temporarily held closure remains visibly owed
-> proof matches the exact claim
~~~

The Android implementation demonstrates the subtractive side of this law:

~~~
existing Family / Session owns the meaningful operation
-> do not add a peer feature execution API

semantic structure already identifies the active relationship
-> do not mint another RelationshipKey / OwnerToken / InstanceId

provider declares prerequisites explicitly
-> do not discover dependencies through ambient lookup / reflection

accepted / observed fact occurs
-> Logger records chronology
-> Logger does not become the semantic owner

VexBoard / debug surface needs a human explanation
-> project existing semantic/runtime/history truth
-> do not force upstream architecture to invent display-shaped identities
~~~

VexLife-Prod demonstrates the construction side:

~~~
compiler-visible relationship
-> consumer receives the existing handle / identity
-> consumer does not reconstruct it from a string

relational spatial source
-> resolve enough consequence to validate geometry
-> invalid relationship fails
-> renderer cannot repair or guess

authoritative relationship source
-> deterministic generated artifact
-> generated artifact is not a second authoring owner
~~~

### VexWork translation

For VexWork, the default question becomes:

> Is this code/source the rightful owner of independently meaningful truth, or is it manually
> restating a relationship/consequence that can be constrained or derived from a rightful owner?

Static source is not forbidden. It is earned when it is the rightful stable owner of meaning,
policy, identity or an independently meaningful contract.

Static duplication is the problem:

~~~
RIGHTFUL STATIC SOURCE
  Workgraph lifecycle grammar
  Project definition
  repository/process definitions
  repository-owned architecture contract

DERIVED / CONSTRAINED CONSEQUENCE
  composed Workgraph
  public workspace
  discoverability projection when membership is derivable
  VexBoard/debug views

SMELL
  handwritten duplicate registry membership
  hard-coded population counts
  projection-specific IDs pushed upstream
  peer wrapper APIs that restate an existing owner
  prose-only "do this later" obligations
  consumer reconstruction of relationships from names/paths/convention
~~~

The desired architecture therefore does not merely detect forgotten synchronization. It removes
the need for that synchronization where the relationship is derivable, constrains the remaining
authoring boundary where it is not, and keeps any genuinely held closure visible.


## Current static-source classification

The alignment contract classifies today's static sources by *why they exist*, not by file extension.

~~~text
RIGHTFUL_SEMANTIC_SOURCE
  blueprint/work-registry.json
  blueprint/project-planning-registry.json
  blueprint/project-reconciliation-registry.json

RIGHTFUL_RELATION_SOURCE
  blueprint/repository-registry.json
  blueprint/process-registry.json

RIGHTFUL_COMPOSITION_POLICY_SOURCE
  workgraphs/composition.json
  (policy/currentness; segment membership stays source-derived)

DERIVATION_CANDIDATE
  blueprint/project-registry.json

GENERATED_CONSEQUENCE
  workgraphs/public.json
  public/workspace.json
  public/work-dashboard.json
~~~

This classification is intentionally asymmetric.

Repository/process membership is an admission decision across independently owned sources, so local
file discovery cannot decide it. Work/planning/reconciliation registries define portable semantic
vocabulary. Project membership has different pressure: VexWork itself owns a uniform source-managed
Project population whose definition/Board paths and stable refs are mechanically observable.

The question is therefore never "can this JSON be generated?" It is:

> Would generation preserve the same independently authored meaning, or would it erase a decision
> that has its own rightful owner?

A later implementation may refine this inventory when real pressure contradicts it; it must preserve
the classification reason rather than copying the label by precedent.

## Machine-readable alignment contract

`projects/vexwork-vexarchitecture-alignment/architecture.contract.json` is the Project-local constrained map for this refactor.

It is deliberately **not** a new universal VexWork relationship ontology. Its purpose is to keep the
whole alignment intention mechanically connected to:

- the accepted VexLife-Android / VexLife-Prod evidence;
- the current VexWork truth owners;
- each relationship being preserved or repaired;
- the Work item that owns that migration;
- the patient-zero failure/proof where applicable.

A0 maintains this contract while the architecture is being mapped. A1–A5 must move each accepted law
into the rightful production owner rather than making this Project file the permanent runtime
executor.

Fresh successors should read the contract alongside this README before narrowing the work to one
patient-zero fix.

## Existing VexWork process map

This Project reuses current process owners instead of inventing an alignment workflow.

- process.vexwork.form-project
  - forms this durable human outcome / Work topology / Board.
- process.vexwork.quality-review
  - reviews exact refactor candidates and their falsification evidence.
- process.vexwork.integrate-ready-pull-requests
  - owns serialized current-main convergence and is the natural place for post-merge deterministic consequence reconciliation.
- process.vexwork.promote-derived-concern
  - may promote one exact discrepancy only when it truly needs canonical Work; attention itself is not WorkState.
- process.multivex.operations.compile-vexrelay-stage-recipe.v1
  - used only when a concrete proof effect actually requires host carriage.

~~~
PROCESS MAP = navigation
PROCESS MAP != executor
PROCESS MAP != lifecycle
~~~

## Current architecture map

### Workgraph — already strongly aligned

~~~
workgraphs/segments/*.json
        ↓
deterministic composition
        ↓
workgraphs/public.json
~~~

Accepted law:

~~~
ONE SEMANTIC WORKGRAPH
!= ONE AUTHORED FILE

SEGMENT AUTHORING
-> GENERATED CANONICAL AGGREGATE
~~~

This is the pattern to preserve and extend.

### Work Board / public workspace — correct projection boundary

These consume Workgraph / Project truth and remain read-only.

~~~
projection != WorkState owner
projection != effect authority
~~~

### Project Reconciliation — correct derived-meaning boundary

~~~
Project + Workgraph truth
+ provider observation
+ proof observation
-> deterministic reconciliation disposition
~~~

It derives current meaning without stealing transition authority.

### Repository Integration — correct convergence owner, incomplete consequence closure

Integration already distinguishes:

~~~
candidate proof
!= current-main admission
!= merge authority
!= post-merge verification
~~~

It is the natural owner for deterministic VexWork aggregate reconciliation after accepted source movement.

### Derived Attention / Attention Queue — promising held-relationship surface

These can show a current discrepancy without automatically creating Work or mutation authority.

### Current gaps

1. Project discoverability still requires manual restatement.

~~~
projects/<slug>/project.json
projects/<slug>/board.view.json

PLUS AI / human remembers:
  blueprint/project-registry.json
~~~

2. Project Registry validates entries already present, but does not prove every eligible source-managed Project is present exactly once.

3. test/project-registry.test.mjs hard-codes the observed count 17. That proves historical circumstance, not the architectural property.

4. Generated aggregate files such as workgraphs/public.json and public/workspace.json can be claimed like ordinary lane-authored source, creating avoidable contention and stale projection debt.

5. Post-merge integration verifies Git convergence but does not yet ask the general VexWork-native question:

~~~
accepted source moved
-> which deterministic VexWork relationships / consequences became owed?
-> are they current?
~~~

6. A prose hold such as shared projection held can disappear from current structural truth.

## Target VexWork architecture blueprint

This is an English architecture map, not a mandate to create one universal Relationship framework.

### A. Author the smallest rightful source

Examples:

~~~
Project definition
Workgraph segment
Process definition
Repository definition
Planning definition
Reconciliation relation
~~~

Each source owns its meaning.

### B. Make required relationships explicit and addressable

Examples:

~~~
Project
-> root WorkRefs
-> Board view
-> Workgraph identity

Work item
-> parent
-> dependencies
-> repositories
-> process routes

Workgraph segment
-> local Work family
-> canonical composed Workgraph

source-managed Project population
-> Project discoverability projection

accepted source movement
-> deterministic generated consequences
~~~

Do not create a universal relationship schema merely to make the map symmetrical.

### C. Validate closure at the authoring boundary

For Project discoverability:

~~~
eligible source-managed Project definitions
<-> Project discoverability

exact-set closure:
  no missing Project
  no orphan registry entry
  no duplicate ProjectRef
  every definition path resolves
  every Board resolves same Project
  every root WorkRef resolves in canonical Workgraph
~~~

The count is evidence:

~~~
observedProjectCount = N
~~~

not law:

~~~
N == 17 forever
~~~

### D. Treat deterministic aggregate files as consequences

Desired direction:

~~~
project-local source
        ↓
deterministic Project census / composition
        ↓
Project Registry discoverability projection
        ↓
public workspace
~~~

alongside the already-accepted:

~~~
Workgraph segments
        ↓
public Workgraph
        ↓
public workspace
~~~

Human/AI authoring stays at semantic source. Generated aggregate files do not become competing semantic owners.

### E. Put convergence at the existing Integration Steward boundary

After accepted source movement:

~~~
post-merge re-ground
-> discover current semantic sources
-> derive required aggregate consequences
-> compare generated state
-> safe deterministic mismatch?
     YES -> regenerate / prove
     NO  -> preserve exact unsatisfied relationship
-> post-merge verification
~~~

Do not invent a permanent healer agent or second trunk merely to regenerate files.

### F. Surface blocked relationship closure through read-only attention

When deterministic convergence cannot lawfully happen yet:

~~~
relationship expected
+ current source evidence
+ missing predicate / active custody
-> current derived attention
~~~

Example:

~~~
Project source PRESENT
Project registry relation UNSATISFIED
public Workgraph consequence UNSATISFIED
workspace projection UNSATISFIED
reason = ACTIVE_SHARED_CUSTODY
~~~

When the predicate is satisfied and the consequence converges:

~~~
ATTENTION -> CLEAR
~~~

No WorkState transition or source authority is implied.

### G. VexBoard remains downstream

Only after VexWork owns and proves the relationship contracts:

~~~
VexWork truth / reconciliation / attention
-> VexBoard projection
~~~

VexBoard can make relationships perceptible. It must not become the truth/healing/lifecycle owner.

## Work phases

### A0 — map + blueprint

This Project formation owns the source-grounded owner/process map and the English target architecture.

### A1 — Project discoverability relationship contract

Use New Beginnings as the first regression patient zero.

Likely pressure:

- remove hard-coded Project count assumptions;
- exact-set Project source/discoverability validation;
- bounded source enumeration may locate candidate Project files, but folder/slug/path never becomes Project identity; validated source identity + Board kinship + exact Workgraph-root resolution must decide the relationship;
- decide whether blueprint/project-registry.json remains authored or becomes generated;
- prefer the smaller architecture that removes repeated manual membership maintenance.

### A2 — generated consequence ownership + integration reconciliation

~~~
source lane != generated aggregate owner
~~~

Move deterministic aggregate currentness to composition/integration where possible.

### A3 — unresolved relationship attention

Reuse Derived Attention / Attention Queue or the smallest compatible evolution so an owed-but-held structural relationship cannot disappear into prose.

### A4 — end-to-end foundation proof

Prove:

1. a new Project can be authored from project-local source;
2. discoverability cannot silently omit it;
3. root Work exists in canonical composed graph;
4. Board identity resolves;
5. public workspace becomes current deterministically;
6. a deliberately held consequence remains visible;
7. satisfying the held predicate clears the discrepancy;
8. no hard-coded Project count or user archaeology is needed.

Patient zeros:

~~~
project.vexlife.new-beginnings
project.vexwork.vexarchitecture-alignment
~~~

### A5 — VexBoard alignment

Only after A4, project accepted VexWork source/projection/discrepancy relationships into VexBoard.

## Current coordination boundary

This first candidate deliberately does not edit:

~~~
blueprint/project-registry.json
workgraphs/composition.json
workgraphs/public.json
public/workspace.json
~~~

Those shared surfaces currently overlap active PRs #182 and #193.

This is not permission to forget discoverability. A1/A2 carry that convergence obligation explicitly, and the target architecture should reduce this aggregate-path contention.

## Completion pressure

This Project is not complete because VexWork adopts VexArchitecture vocabulary or adds a helper.

Completion means a fresh instance can observe:

~~~
new semantic source enters VexWork
-> required relationships are mechanically discoverable
-> invalid / missing relationships fail closed
-> deterministic consequences converge at the rightful boundary
-> blocked convergence remains visibly owed
-> projections consume current truth
-> no human rediscovers a forgotten later obligation
~~~

Strongest acceptance patient zero:

> A merged Project must not be able to exist in durable source while disappearing from the VexWork Projects navigation surface without an explicit current discrepancy explaining why.

## Fresh-instance entry

~~~
1. read this README
2. read projects/vexwork-vexarchitecture-alignment/architecture.contract.json
3. read project.json + board.view.json
4. read workgraphs/segments/vexwork-vexarchitecture-alignment.json
5. identify current Work / dependency
6. descend only to the named VexWork foundation
7. use VexLife-Android / VexLife-Prod as architecture evidence, not VexWork source authority
8. implement the smallest relationship fix without narrowing away the contract's whole-system laws
9. run focused proof + npm run review when execution is available
10. use process.vexwork.quality-review
11. use process.vexwork.integrate-ready-pull-requests at integration
12. reconcile deterministic consequences after accepted source movement
13. continue until the end-to-end property is proved
~~~

Do not reconstruct this Project from the conversation that formed it.

Preserve the relationship discipline; let VexWork's own pressure determine final source shapes.

<!-- [VXG RealForever][VEXWORK][VEXARCHITECTURE-ALIGNMENT] -->
