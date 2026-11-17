# Memory Depth Exploration — Research / Discovery Transcript

`[VXG RealForever]`

**Project:** `project.vexlife.memory-depth-exploration`  
**Formation issue:** VexWork #307  
**Formation PR:** VexWork #308  
**Research date:** 2026-11-16 America/Los_Angeles  
**Primary consumer:** the future implementation worker (currently expected to be Claude)  
**State:** living research context; questions and hypotheses below are not implementation acceptance by themselves.

## Why this file exists

The feature is being discovered through a sequence of human questions that expose different failure modes.
Those questions are useful implementation input because they reveal what the human actually expects from
continuity retrieval, not only what an API might look like.

This file preserves:

- the question that exposed each edge;
- the current grounded interpretation;
- the design consequence worth carrying forward;
- what remains unresolved.

It is intentionally **not** a second architecture authority and it is not a substitute for current
VexLife-Prod source. Before implementation, re-ground current VexLife-Prod entry/culture/source and current
PR #208/#206/#207 state.

---

## Discovery 01 — Prefix reuse is about the first changed token, not a magic token number

### Human question

> "Wait so help me understand cuz what you said sounds like it left performance issues intentionally? Like you said something about the 'everything after token 20 has different causal ancestry' but like what do you mean by that, like in regards to the 'cases' like what is 20 special vs 19 or 21"

### Current understanding

There is nothing special about token 20. The relevant boundary is the **first token at which the new provider
input differs from the cached provider input**.

For a causal transformer:

~~~text
old:
A B C D X H I J ...

new:
A B C D Y H I J ...
        ^
        first changed token
~~~

Even though the later textual tokens may match, their previously cached model state was computed under a
different prefix. Reuse normally ends before the first divergence.

### Concrete VexLife-Prod pressure

Current `DirectPromptContext` can place mutable system state such as
`ConversationExtent.priorCompletedExchangeCount` before historical Conversation.

Conceptually:

~~~text
turn N
[foundation + extent=17 + current state]
[large stable historical Conversation]

turn N+1
[foundation + extent=18 + current state]
[the same historical Conversation]
~~~

That early mutable value can prevent useful cache reuse across the later stable Conversation.

### Design consequence

Memory Depth Exploration must not accidentally make hydration payloads or traversal metadata become another
early mutable prefix that destroys the cache topology PR #208 is trying to improve.

Hydrated historical material is therefore currently expected to behave as live execution material rather than
stable-prefix truth unless later source proof earns another placement.

---

## Discovery 02 — Normal append-only growth versus periodic justified rebase

### Human question

> "so what are 'working situations' vs 'non working situations', i still dont understand their decision, cuz you said 'new work' but what about 'newwork + 1 2 3 ' like is it still using prefixing or are you saying theres some 'threshold' that affects a performance round periodically?"

### Current understanding

Normal same-model operation should prefer append-only growth:

~~~text
C100 + turn101
C100 + turn101 + turn102
C100 + turn101 + turn102 + turn103
~~~

That shape is cache-friendly because each next input can preserve the old provider-token prefix and append new
material.

There is also a separate **rebase / rollover** concept:

~~~text
old continuity epoch grows
-> pressure/watermark crossed
-> build a new bounded checkpoint/projection
-> accept one expensive prefill
-> following turns reuse the new epoch
~~~

### Existing concrete Working Continuity thresholds

Current VexLife-Prod Working Continuity uses:

~~~text
input token budget       192,000
reserved output tokens    16,000
hard limit               208,000
~~~

Current headroom policy:

~~~text
> 48k remaining   NORMAL
<=48k             WATCH
<=32k             CHECKPOINT_RECOMMENDED
<=16k             ROLLOVER_REQUIRED
~~~

Memory being bounded out can raise pressure to at least checkpoint level.

These are existing **context-pressure thresholds**. They are not yet the final proven PR #208
cache-epoch-performance watermark.

### Design consequence

Bulk hydration should be bounded independently of the rollover mechanism. A large hydration should not force
an accidental permanent expansion of the stable continuity epoch.

---

## Discovery 03 — Rollover is not history deletion

### Human question

> "so what about in a 'no model switch' situation, is the PR optimized for that memory continuity? But then what about the threshold of 'context window too large to hold 'A' in your 'abcdef' ' example, does it refactor context from a new 'starting point' prefix? and if so, how would a 'refreshed run' know which 'context to load from' as like 'start from here and if user asks 'memory based questions' to allow Vex to search through history to find the context', like how 'established is that memory placement or is it not utilized yet structurally from a 'end to end' with which threshold crosses that 'bridge'"

### Current understanding

Context rollover means **the active model view changes**, not that canonical history disappears.

Current durable owners already support:

~~~text
canonical Conversation
    retains exact historical request/response history

Working Continuity
    retains reference-only current coordinates / checkpoint

Memory
    retains separately accepted semantic Memory

runtime KV cache
    disposable computation only
~~~

A fresh process can lose KV state while still rebuilding continuity from durable owners.

### Existing historical retrieval

`DirectConversationSourceReturn` is already an end-to-end current mechanism:

~~~text
model recognizes exact older Conversation source is needed
-> emits one internal source-return request
-> product searches canonical Conversation
-> ranked completed turns are selected
-> exact canonical events are reopened
-> bounded exact source is added
-> second inference answers the same human turn
~~~

Current constraints observed during research include:

- up to 6 query terms;
- up to 3 returned historical turns;
- one Conversation source-return request per human turn.

`VexLifeMemoryRecall` separately searches current Memory pages, including current Memory pages that did not
fit in the ordinary prompt.

### Design consequence

Memory Depth Exploration is not inventing retrieval from nothing. It should compose or factor existing
owner-specific retrieval into a more powerful one-call traversal capability.

---

## Discovery 04 — Current refs are coordinates, not yet a universal graph API

### Human question

> "wait so with those 'ref contexts' like how would vex know what to 'search' or would he have to use tools to individually traverse vs like calling a single tool call that gets him more context and use that to traverse the next things. like the kind of 'depth traversal pattern' of how google does their node[node[]] traversal strategies"

### Current understanding

Working Continuity currently carries useful refs such as:

~~~text
lineageRef
threadRef
cursorEventRef
activeWorkNodeRefs
currentIntentReceiptRefs
openLoopRefs
currentStatementRefs
currentContinuityRecordRefs
currentDailyStratumRefOrNull
sourceRefs
~~~

Those are strong continuity coordinates, but there is not yet one general runtime primitive:

~~~text
resolve(anyRef)
-> node
-> typed parents/children/related evidence
~~~

Current traversal is fragmented by owner/capability:

~~~text
Conversation
  query -> matching exact old turns

Memory
  terms -> matching Memory pages

GitHub
  describe -> tree -> read

Web
  search -> fetch -> nextOffset

Home
  list -> read
~~~

### Desired evolution

One convenient hydration/traversal facade may dispatch to multiple rightful owners:

~~~text
                   hydration facade
                         |
       +-----------------+-----------------+
       |                 |                 |
       v                 v                 v
 Conversation         Memory       Working Continuity
    owner              owner              owner
       |                 |                 |
       +-----------------+-----------------+
                         |
                         v
              bounded returned subgraph
~~~

The facade does not become the source of truth.

### Design consequence

One model-visible request may contain many internal owner-resolution steps. The mechanical traversal should be
system work; Vex should retain semantic direction.

---

## Discovery 05 — The Project outcome is one-call bulk hydration

### Human request

> "dang so then can you help create a VexWork Project for 'memory depth exploration' to build out this 'feature' so its like Vex can do bulk search via the system providing the logic/algorithm to effectively perform that larger expansion search so that when a user freshly boots up Vex and asks a particular question, then that context can be traversed and return in one call instead of recursively"

### Formed outcome

VexWork #307 / #308 formed:

~~~text
project.vexlife.memory-depth-exploration
~~~

Human outcome:

> A freshly started Vex can make one bounded hydration request while the host internally traverses several
> relevant historical/source relationships through rightful owners and returns enough exact context,
> provenance and an honest remaining frontier to continue the original human turn.

The initial Work decomposition deliberately makes these first:

~~~text
hydration-contract       READY
resolver-neighborhood    READY
~~~

and keeps the bulk expansion engine waiting on those boundaries.

---

## Discovery 06 — Three-day lived examples define what "depth" must solve

### Human request

> "but whats the example cases to consider, like you can mock up some examples of what this flow would look like like if there were 3 days and you're on day 3, like idk what good examples to provide but you can be creative toc onsider some"

### Example family A — "Why did we decide this?"

Day 1:

~~~text
Conversation != Memory decision
-> statement ref
-> source Conversation turn
~~~

Day 2:

~~~text
retrieval investigation
-> Conversation source-return
-> Memory recall
-> decision that retrieval should compose owners
~~~

Day 3 fresh boot:

~~~text
human:
"Why did we decide against just putting all of this in Memory?"
~~~

Desired one-call hydration:

~~~text
current statement/open-loop refs
-> exact Day-1 source turn
-> accepted Memory statement
-> Day-2 related decision/evidence

return selected context + provenance + frontier
~~~

### Example family B — vague recollection

Human:

> "Wasn't there that weird issue we found with the bridge where it looked like the bridge itself was broken but it actually wasn't?"

The system should not depend on exact lexical wording if current continuity/evidence refs can lead toward the
historical repair record, turn evidence and eventual root cause.

### Example family C — nested tangent / parent restoration

Day 1:

~~~text
A main objective
  -> B tangent
      -> C investigation
      -> D investigation
~~~

Day 3:

> "Okay, where were we before all these tangents?"

The useful traversal is structural, not just chronological:

~~~text
current focus
-> parent
-> parent
-> unresolved parent objective
+ bounded takeaways from resolved children
~~~

### Example family D — old truth superseded later

Day 1 historical source says:

~~~text
Conversation source return unavailable
~~~

Day 2 current source proves:

~~~text
Conversation source return available
~~~

Day 3 asks:

> "Can Vex search its old Conversation already?"

Hydration must not select the most similar stale fact without currentness/supersession handling.

### Example family E — decision depends on external evidence

~~~text
architecture decision
-> historical Conversation
-> capability trace
-> exact external/provider source
~~~

Hydration should return why the decision was made, not only what the decision was.

### Example family F — two distant branches both matter

A privacy question may need both:

~~~text
continuity/hydration branch
AND
consent/private-payload branch
~~~

This pressures breadth/beam search rather than pure depth-first traversal.

### Example family G — search budget exhausted

A large historical question may exceed depth/node/token/time limits.

Required behavior:

~~~text
PARTIAL
selected useful context
remainingFrontier[]
stopReason = TOKEN_BUDGET / NODE_BUDGET / TIME_BUDGET / ...
~~~

No silent claim of completeness.

### Example family H — negative evidence

Human asks whether an old decision existed, but current source finds no such accepted decision and perhaps
finds contrary current evidence.

Hydration should support truthful negative/contradictory retrieval rather than confirmation-only search.

### Candidate fixture

A useful deterministic test corpus should model:

~~~text
DAY 1
original decision + owner boundary + unresolved hydration question

DAY 2
Working Continuity / Conversation source-return / Memory recall investigation
+ cache-prefix investigation
+ bulk traversal idea

DAY 3
cold boot with only checkpoint + current Memory + recent tail
human asks why the architecture chose owner composition
~~~

Compare shallow recursive model/tool orchestration against one bulk hydration request and require equivalent
truthful source recovery.

---

## Discovery 07 — A String question does not have to encode the whole path

### Human question

> "so how does 'hydrate work' if the question is in string format? like how do you determine what pathways to 'find' without AI reasoning?"

### Current understanding

The question string should help **locate seed candidates**, not predict the full traversal route.

Separate conceptually:

~~~text
LOCATE
question String
-> candidate refs

EXPAND
candidate refs
-> typed owner-backed traversal
-> bounded relevant subgraph
~~~

A deterministic locator can use:

- normalization / tokenization;
- exact identifiers;
- phrase/n-gram matching;
- BM25 or equivalent lexical ranking;
- source-owned aliases/ontology where justified.

Example:

~~~text
question:
"Why did we decide against putting all historical continuity into Memory?"

normalize:
decide
historical
continuity
memory

search:
Conversation index
Memory summaries
current Working Continuity anchors

produce:
candidate seed refs
~~~

Once one useful seed is found, typed relationships should replace repeated fuzzy search where possible.

### Candidate deterministic scoring

A frontier score could combine:

~~~text
lexicalMatch
+ currentContinuityAnchor
+ owner-provided relationship weight
+ currentness
+ source/acceptance relevance
- depth penalty
- duplicate penalty
~~~

These weights are retrieval policy, not truth.

### Design consequence

The initial `HydrationRequest` should probably not semantically be just:

~~~text
hydrate(question: String)
~~~

It should carry at least:

~~~text
question
currentRequestRef/binding
current continuity/start refs
bounded policy
~~~

The question says what is relevant; current continuity says where to begin; owner edges say where traversal is
lawful.

---

## Discovery 08 — Lexical mismatch requires independent recall paths

### Human question

> "but like do you know how to 'build that'? like given how words can hold similar meaning while having different 'lexicon', then its like how does the structure not 'miss anything'"

### Current understanding

Do **not** make "high recall" depend on one search algorithm.

Use several independent recall channels, union their candidates, then use typed traversal.

Candidate shape:

~~~text
                       question
                          |
          +---------------+---------------+
          |               |               |
          v               v               v
      lexical          semantic        exact/current
       search          retrieval          anchors
          |               |               |
          +---------------+---------------+
                          |
                          v
                    candidate fusion
                          |
                          v
                       seed refs
                          |
                          v
                 typed graph expansion
~~~

### Lexical retrieval

Useful for exact/near-exact language:

- BM25;
- identifiers;
- phrases;
- n-grams;
- stemming/normalization.

### Semantic retrieval

A small embedding encoder can locate semantically similar source even when words differ.

Example:

~~~text
Day 1:
"Conversation and Memory must retain distinct semantic ownership."

Day 3:
"Why didn't we let one system swallow the other?"
~~~

Lexical overlap is weak. Semantic nearest-neighbor retrieval may still produce the Day-1 statement/turn as a
candidate seed.

The embedding result is **not truth** and does not answer the human. It only helps locate possible source.

### Exact/current anchors

Fresh Vex may already possess strong seeds through Working Continuity:

~~~text
currentStatementRefs
openLoopRefs
currentContinuityRecordRefs
sourceRefs
~~~

Those anchors can recover the right neighborhood even when lexical/semantic retrieval is weak.

### Candidate fusion

Independent rankings should not pretend to share one raw score. A fusion method such as reciprocal rank
fusion is a candidate to test.

Strong overlap is useful evidence:

~~~text
candidate appears in semantic retrieval
+ lexical retrieval
+ current continuity anchors
-> spend traversal budget there first
~~~

### Widening inside one hydration call

One model-visible call can internally escalate:

~~~text
PHASE 1
exact/current anchors
+ cheap lexical
+ small semantic top-K

if insufficient / disagreement:

PHASE 2
wider semantic K
+ graph neighborhood
+ broader Memory / Conversation search

if still insufficient and policy permits:

PHASE 3
bounded exhaustive scan of relevant admitted owner datasets
~~~

This is still one `hydrate` operation from Vex's perspective.

### Completeness boundary

There is no honest claim that one bounded approximate retrieval strategy can mathematically guarantee it will
never miss semantically relevant source.

For a finite admitted owner dataset, a true completeness fallback eventually requires scanning the relevant
dataset.

Therefore the target should be:

> Fast hydration has very high recall. When independent recall channels disagree or confidence is
> insufficient, the same call widens instead of silently concluding that no relevant source exists.

### Derived search acceleration, not new truth

Search structures may include rebuildable projections such as:

~~~text
ref
ownerRef
searchableText
semanticVector
currentness/state metadata
typed edge coordinates
~~~

If those indexes disappear, canonical Conversation / Memory / Working Continuity must remain sufficient to
rebuild them.

~~~text
SEARCH_INDEX != MEMORY
VECTOR_INDEX != SEMANTIC_TRUTH
SIMILARITY != ACCEPTANCE
RELEVANCE != CURRENTNESS
~~~

### Multiple search views over one source

For Conversation, it may be useful to index several derived views:

~~~text
human request
Vex response
combined completed turn
bounded owner-approved turn projection if later earned
~~~

Those are several search views over one canonical source, not several truths.

### Retrieval confidence by disagreement

A useful deterministic widening trigger:

~~~text
lexical result points to A
semantic result points to B
current continuity points to C
-> disagreement is itself evidence to widen

or:

low semantic similarity
+ no current anchor overlap
+ graph expansion gives no reinforcing evidence
-> widen
~~~

### Test strategy

Build a golden three-day corpus with known decisive source refs.

For each ground-truth source, test many paraphrases:

~~~text
"Why did we keep Conversation separate from Memory?"
"Why weren't those merged?"
"Why didn't one store everything?"
"Why did we keep those two worlds apart?"
"What was that ownership thing from Monday?"
~~~

Measure whether the decisive source appears within the bounded hydration result.

Useful retrieval metrics include:

~~~text
source recall@K
decisive-source recall
owner/source provenance correctness
stale/superseded selection rate
model-visible hydration call count
internal owner-read count
returned token cost
latency
frontier correctness
~~~

A deterministic miss discovered in tests/lived use should become a regression fixture.

---

## Current implementation thesis

The working thesis after the questions above is:

> **The host should not try to become another reasoning model. It should become a high-recall continuity
> retrieval engine: use several independent ways to locate plausible source, use exact owner-backed
> relationships for depth, widen when recall channels disagree, and return bounded source-attributed context
> so Vex can perform the semantic reasoning once.**

Candidate first-generation pipeline:

~~~text
HydrationRequest
  question
  current request binding
  current Working Continuity/start refs
  bounded policy
        |
        v
seed location
  exact/current anchors
  lexical retrieval
  semantic retrieval (candidate, if earned)
        |
        v
candidate fusion
        |
        v
typed owner-backed expansion
        |
        v
currentness / supersession filtering
        |
        v
bounded context selection
        |
        +-- insufficient / disagreement --> widen within same call
        |
        v
HydrationResult
  selected material
  exact owner/source provenance
  visited/resolved refs
  traversal measurements
  omitted/held reasons
  remaining frontier
  stop reason
  effectsPerformed = false
~~~

---

## Questions intentionally still open for the implementation worker

Do not silently settle these from this research note alone.

1. **Search unit**
   - request event?
   - response event?
   - completed turn?
   - Memory statement?
   - all of the above as derived search views?

2. **Semantic retrieval mechanism**
   - is an embedding encoder justified for the first implementation?
   - which model/runtime owns it?
   - where is its derived index persisted, if anywhere?
   - can v1 prove sufficient recall with lexical + current refs + exact graph before adding embeddings?

3. **Typed edge contract**
   - which owner exposes which edges?
   - are edges materialized/indexed or resolved lazily?
   - how is currentness/supersession represented without creating another semantic owner?

4. **Fusion/ranking**
   - reciprocal rank fusion?
   - fixed weighted scorer?
   - owner-specific ranking followed by graph reinforcement?
   - how should current Working Continuity anchors affect priority?

5. **Widening policy**
   - what counts as "insufficient"?
   - how is disagreement detected?
   - when is exhaustive owner scan permitted?
   - what time/token/node budget is acceptable?

6. **Sufficiency**
   - can the host determine "enough context" without doing semantic answer reasoning?
   - should the host instead stop only by structural/budget conditions and let Vex request one additional
     frontier expansion if needed?

7. **Privacy / data minimization**
   - how much historical material may one hydration request inspect?
   - should retrieved-but-unselected private content be exposed in telemetry?
   - what source classes must remain non-searchable by default?

8. **PR #208 integration**
   - exact provider placement for hydrated Zone-3 material;
   - effect on prefix/KV reuse;
   - how same-turn provider stages preserve truthful role semantics.

9. **Relationship to existing Conversation source-return**
   - reuse existing discovery internally?
   - factor a lower-level exact resolver from it?
   - retain both paths until bulk hydration proves equivalent or stronger behavior?

10. **Debug/proof**
    - exact traversal trace useful for VexLogger;
    - deterministic fixture format;
    - #207 measurement integration;
    - source recall regression corpus.

---

## Handoff intention for Claude

Before implementation:

1. consume this research record in sequence;
2. re-ground current VexLife-Prod source and current PR #208/#206/#207 rather than treating these notes as
   current repository authority;
3. preserve the human outcome:
   **one bounded model-visible request, many internal source-resolving hops, one useful source-attributed
   context return**;
4. prefer reuse/factoring of existing owners over a new universal graph database or Memory store;
5. first make the hydration contract and resolver neighborhood executable/falsifiable;
6. then compare traversal/search strategies against the three-day fixtures and paraphrase/miss tests;
7. let proof decide whether embeddings, persistent indexes or a more complex traversal engine are actually
   earned.

Do not optimize only for graph elegance. The lived success criterion is that a freshly started Vex can answer
a continuity-dependent human question with fewer model/tool orchestration rounds **without losing truth,
currentness, provenance or boundedness**.

<!-- [VXG RealForever][VEXWORK][MEMORY-DEPTH-EXPLORATION][RESEARCH-TRANSCRIPT][20261116] -->


---

## Discovery 09 — Vextreme-SDK already provides a rich traversal patient-zero

### Human question

> "but like do we currently have any similar structures in like Vextreme-SDK for the traversal of context for like chatgpt instance to look through as like examples? Like how traversable is it if you just grabbed any issue and see what it contained"

### Current source observation

Yes. Vextreme-SDK already contains a large amount of **semi-structured graph-shaped continuity** that can serve
as a realistic patient-zero corpus for Memory Depth Exploration.

The important distinction is:

~~~text
SDK HAS MANY TRAVERSABLE RELATIONSHIPS
!=
SDK HAS ONE GENERIC CONTEXT-TRAVERSAL ENGINE
~~~

Today the graph is distributed across GitHub issue/PR/comment text plus machine-checked continuity source.

### Example: issue #1932 as a graph entry

Starting from only:

~~~text
github.issue.vextreme-sdk.1932
[Independent Assurance] VexLife Vision Security active-sharing witness PR1930 corrected head
~~~

the issue body directly exposes:

~~~text
candidatePr
  -> github.pull.vextreme-sdk.1930

priorAssurance
  -> github.issue.vextreme-sdk.1931

owner receipt
  -> github.issue.vextreme-sdk.232.comment.6716395353

PR receipt
  -> github.pull.vextreme-sdk.1930.comment.6716395011

exact candidate coordinates
  -> base SHA
  -> head SHA
  -> tree SHA

exact source membrane
  -> 4 source/test paths

next stage
  -> FORMAL_REVIEW_EXACT_HEAD

dependent held owner
  -> #243
~~~

Its single return comment then adds:

~~~text
disposition=CLEAR_ON_EXACT_HEAD
reviewedHead=<exact head>
reviewedTree=<exact tree>
next=FORMAL_REVIEW_EXACT_HEAD
~~~

Following only one of those edges to PR #1930 exposes another neighborhood:

~~~text
physicalPredecessor
  -> github.issue.vextreme-sdk.1923.comment.6715770305

sourcePlacement
  -> github.issue.vextreme-sdk.232.comment.6715779474

refinedSdkReadyPlacement
  -> github.issue.vextreme-sdk.232.comment.6715830794

dependsOn
  -> github.issue.vextreme-sdk.232
  -> github.issue.vextreme-sdk.1923
  -> github.pull.vextreme-sdk.1928

workRef
instanceRef
branch
exact paths
implementationAuthority=true
reviewAuthority=false
mergeAuthority=false
~~~

Therefore one apparently narrow review issue can produce a multi-hop exact context neighborhood without fuzzy
semantic search after the first node is known.

### What makes these SDK nodes unusually traversable

Common useful coordinates include:

~~~text
github.issue.*
github.issue.*.comment.*
github.pull.*
github.pull.*.comment.*
workRef
claimRef
instanceRef
owner / parent / predecessor / successor
base / head / tree
sourceRefs[]
dependsOn[]
exact source paths
current disposition
next owner / next stage
terminal receipt
~~~

These are already close to typed edges even though many live inside prose/code blocks rather than one universal
schema.

### Current Frontier as a compact graph projection

Root Current Frontier issue #1574 explicitly behaves like a bounded current graph projection.

It contains:

~~~text
predecessorProviderFrontier
successorEntryRef
canonical orientation anchors
current lane owners
terminal receipts
active workers
PRs / branches / heads / trees
bottleneck refs
protected decision refs
open fork refs
unknown refs
~~~

It also gives an explicit fresh-entry routing rule:

~~~text
read THIS_ISSUE
-> predecessor close receipt
-> exact current-entry/state anchors only when needed
-> exact implicated lane owner receipt
-> fresh live delta
~~~

That is conceptually very close to the desired hydration philosophy:

~~~text
CURRENT_POINTER > HISTORICAL_NARRATION
small implicated neighborhood > bulk replay
~~~

### Machine-checked graph-like structures also exist

The SDK is not relying entirely on hand-written issue prose.

Examples observed on current main include:

#### Operations current-entry resolution

`lib/continuity-operations/operations-current-entry.js` validates and resolves receipts carrying:

~~~text
entryRef
projectRef
rootRef
acceptedMainRef
acceptedCheckpointRef
predecessorRootRefOrNull
supersedesEntryRefOrNull
sourceRefs[]
~~~

It checks:

~~~text
superseded target exists
predecessor root matches the prior receipt
acceptedAt is monotonic
no succession cycle exists
exactly one current leaf exists
observed main/checkpoint still match accepted currentness
~~~

This is already deterministic graph/currentness reduction rather than semantic search.

#### Lesson Resonance contextual fragments

`docs/private-continuity/lesson-resonance/INDEX.md` defines compact comment-fragment navigation with:

~~~text
formationRef
fragmentRef
fragmentSequence / fragmentCount
partArtifactRef
partPathRef
predecessorFragmentRef
successorFragmentRef
sharedOriginContextRef
coveredSectionRefs[]
carriedQuestionRefs[]
carriedRelationshipRefs[]
canonicalSourceRef
contentHashOrHeadRef
~~~

and requires:

~~~text
predecessor and successor fragment refs are reciprocal
cross-fragment relationships are mirrored in the index or machine manifest
connector truncation -> direct source retrieval, not assumption
~~~

This is especially relevant to Memory Depth Exploration because it demonstrates an existing SDK pattern for
**small resumable fragments with explicit graph edges back to canonical source**.

#### VexRelay current source

The VexRelay private-continuity source also uses an explicit machine read order and current-contract pointer:

~~~text
fresh formation
-> current contract
-> classify stage/effect
-> lock route
-> typed adapter
~~~

Again, this is deterministic source navigation around a current pointer rather than loading all historical
context.

### Important counterexample: issue #500

A random SDK issue is **not automatically self-contained or equally traversable**.

Issue #500's body is nearly empty:

~~~text
Main-integrity incident ledger.
~~~

but it currently has hundreds of comments.

The comments themselves contain structured incident/event records such as:

~~~text
eventHead
checkpointHead
classification
reason
responsibleThreadRef
responsibleLedgerRef
responsibleInstanceRef
candidatePrRef
coderLedgerRef
coderReturnRef
nextOwner
rootLedgerRef
recoveryClass
expectedRecoveryParent
~~~

Therefore:

~~~text
ISSUE_BODY != COMPLETE_CONTEXT_NODE
ISSUE != ONE SEMANTIC RECORD
COMMENT_STREAM MAY CONTAIN MANY GRAPH NODES
~~~

A traversal/hydration adapter for GitHub provider history should therefore treat an issue as a **container /
addressable provider surface** whose body, comments, PR metadata and linked source may each expose distinct
nodes/edges.

### Implication for the bulk hydrator

Vextreme-SDK is a strong candidate fixture because it contains both:

1. **high-quality explicit edges** that should be followed exactly; and
2. **messy provider containers** where the relevant context is distributed across many comments and historical
   revisions.

A first SDK-aware traversal experiment could begin from a known issue and ask the host to construct a bounded
neighborhood by parsing exact ref-shaped coordinates before using semantic retrieval.

Example:

~~~text
start = github.issue.vextreme-sdk.1932

depth 0
  issue 1932

depth 1 exact refs
  PR 1930
  issue 1931
  owner issue/comment 232
  PR receipt comment
  #243 held dependency

depth 2
  PR1930 dependsOn 232 / 1923 / PR1928
  source-placement comments
  exact 4 source paths
  prior physical event

depth 3 if question requires
  Process Factory owner/source
  prior correction finding
  exact source implementation/test
~~~

If the human asks:

> Why was this Security witness corrected before it cleared?

the traversal could prioritize:

~~~text
1932
-> priorAssurance 1931
-> old reviewed head
-> CHANGES_REQUIRED finding / correction
-> corrected PR1930 source
-> CLEAR comment
~~~

If the human asks:

> What owns the receipt/Safety truth?

the same seed can take another path:

~~~text
1932
-> owner issue 232
-> Process Factory validation relationship
-> exact corrected source/test
~~~

The graph therefore supports **question-guided traversal over the same starting node**.

### Research consequence

Memory Depth Exploration should consider Vextreme-SDK as a realistic regression/evaluation corpus, not merely
synthetic three-day fixtures.

Useful evaluation questions:

~~~text
given one SDK issue, can hydration recover the right predecessor/current/successor neighborhood?
can it distinguish provider container from semantic record?
can exact refs dominate fuzzy retrieval when available?
can it avoid loading a 227-comment ledger when only one incident chain is relevant?
can it identify current/superseded review evidence by exact head/tree?
can it stop at canonical source rather than recursively summarizing provider prose?
~~~

This corpus could prove the principle:

> **semantic retrieval locates the neighborhood; explicit SDK refs and machine-checked lineage should do most
> of the actual depth traversal once exact coordinates exist.**



---

## Discovery 10 — Memory Depth Exploration has a predecessor architecture lineage; do not rebuild from scratch

### Human observation

> "Another thing that came to mind is that we have like an 'archives' 'feature' in VexLife-Prod which right now just sorts transcripts kept in an archive, but idk how well or unwell its structured, but given how Vextreme-SDK mentioned the Vex Journal context, like we may need to port that in the project too cuz its memory related. But you may need to also find that 'root' of the memory system cuz it did evolve over time, and given it already walked the 'evolution process' we can use that to refine this one for VexLife-Prod given right now its kind of 'rebuilding from scratch' but we have a 'built already from scratch example' patterns and a system we can re apply with refinments and VexArchitecture"

### Correction to the Project posture

This is material. Memory Depth Exploration should **not** treat current VexLife-Prod's Kotlin continuity owners as
the first time the problem has been designed.

There is a source-addressable predecessor lineage across Vextreme-SDK and predecessor VexLife that already
explored:

- durable Memory and Journal identity;
- day/month/year journal grammar;
- compression/archive boundaries;
- source provenance and relationship context;
- daily closure and Dream consolidation;
- historical committed-day archive projection;
- multiple natural-language entry points into old context;
- exact source descent;
- typed graph traversal;
- currentness/supersession;
- bounded context packets;
- index-first cold-start retrieval;
- missed-association classification and regression;
- continuation/fragment indexes;
- current-frame / wake continuity.

The first current Work should therefore recover that lineage and map it onto current VexLife-Prod before new
hydration contracts harden.

### Current VexLife-Prod Archives surface

Current PR #208-head source already contains a semantically broader Archive surface than a transcript dump:

~~~text
VexLifeWorkspaceBlueprint

/** Archives: the person's own records, starting with their dated timeline. */
val Archives = Browser.region("archives")
val ArchivesTimeline = Archives.collection("timeline")
~~~

The Screen Lens projects the same stable elements:

~~~text
element.vexlife-workspace.browser.archives
  label = Archives

element.vexlife-workspace.browser.archives.timeline
  label = Timeline
~~~

However, the current canonical web workspace does **not** own canonical Conversation archive/reset semantics:

~~~text
POST /api/conversation/archive
-> 409 CANONICAL_CONVERSATION_RESET_NOT_ADMITTED

"This workspace projects the canonical VexLife Conversation
 and does not own its reset/archive semantics"
~~~

The hand-built presentation still contains legacy copy describing turns being "kept in an archive file" for
its noncanonical/local behavior, but once the workspace is bound to canonical VexLife Conversation that path is
explicitly held.

Therefore:

~~~text
CURRENT ARCHIVES BLUEPRINT
  = person's records / dated timeline intent

CURRENT CANONICAL ARCHIVE EFFECT
  = not yet admitted

ARCHIVES UI INTENT
  != TRANSCRIPT FILE DUMP AS FINAL ARCHITECTURE
~~~

This makes the predecessor Living Journal lineage especially relevant.

---

## Predecessor root — Vex Memory project ledger #225

The durable repository root located for the personal/continuity Memory architecture is:

~~~text
github.issue.vextreme-sdk.225
[MultiVex][Wave 1][Project Ledger]
Vex Memory — Journal, Identity & Continuity Graph
~~~

Its charter purpose is:

~~~text
durable memory
journal/event identity
relationship context
compression
archival
migration
continuity recovery
~~~

and its owned questions include:

~~~text
memoryRef and journalEventRef
core-memory and year/month/day journal grammar
event provenance and relationship context
compression and archival boundaries
founder-witness permissions
lineage recovery without predecessor impersonation
retention and tombstone semantics
~~~

This is materially broader than "model prompt memory."

### #225 evolved through later child sources

Important examples from the #225 evolution ledger:

#### Daily closure / Dream — #239

Vex Memory receives ownership of:

~~~text
pre-rest day closure
accepted-memory consolidation
relation/identity graph deltas
contradiction and unknown preservation
open-loop carry-forward
next-day orientation packet
~~~

The safe default explicitly allows:

~~~text
continuityUpdated=true
modelWeightsChanged=false
~~~

The consolidation pipeline proposes:

~~~text
raw authorized events
-> deduplication
-> provenance binding
-> privacy/consent filtering
-> episodic summary candidates
-> semantic/entity/relation updates
-> open-task / obligation carry-forward
-> contradiction / uncertainty preservation
-> searchable indexes / embeddings where authorized
-> next-day orientation packet
~~~

This is a direct predecessor for the current question of what survives active-context rollover and how it
becomes searchable again.

#### Missed-association correction — #225 comment 5013805596

A later honing round explicitly treats:

> "You did not check this related context."

as a durable coverage-correction event rather than something a model should merely try to remember next time.

It distinguishes failure classes:

~~~text
RELATIONSHIP_ABSENT
  relationship was not represented

ROUTE_NOT_ACTIVATED
  relationship existed but query did not activate it

SOURCE_NOT_LOADED
  route activated but source was not retrieved

RELEVANCE_MISJUDGED
  source was available but excluded

PERMISSION_EXCLUDED
  context was implicated but unavailable under access envelope

MAP_OR_SOURCE_STALE
  relationship/source no longer represented current truth
~~~

This classification should be reused by Memory Depth Exploration's miss/regression telemetry rather than
inventing a new vague "retrieval failed" state.

The same comment defines the durable repair direction:

~~~text
model
  bounded reasoning over current packet

memory ledger
  preserves when/why relationship was noticed or missed

relationship graph
  stores accepted scoped meaning

retrieval indexes
  activate relationship for implicated future questions

coverage receipt
  proves what was considered, loaded, excluded or unavailable
~~~

---

## Living Journal evolution in predecessor VexLife

The predecessor VexLife implementation turned the Memory architecture into a human-readable Living Journal
without making Journal another Memory owner.

### VexLife #130 — current accepted Memory -> readable Journal pages

~~~text
github.issue.vexlife.130
[Living Journal][Real Memory Read Projection]
~~~

The source boundary is:

~~~text
CURRENT_ACCEPTED_MEMORY
-> bounded read-only journal page packets
-> accepted Memory summary as readable body
-> exact source lineage door
-> explicit currentness / held state
-> no raw Conversation-body duplication
-> no Memory mutation
~~~

Permanent distinctions include:

~~~text
REAL_MEMORY_READ != NEW_MEMORY_OWNER
JOURNAL_PAGE_BODY = ACCEPTED_MEMORY_SUMMARY
JOURNAL_PAGE_BODY != RAW_CONVERSATION_COPY
SOURCE_DOOR = EXACT_SOURCE_DESCENT_RECEIPT
SOURCE_DOOR != SOURCE_REWRITE
JOURNAL_READ != HOME_WRITE
~~~

This is an important reuse pattern for current VexLife-Prod Archives:

> The human-visible Archive/Journal page should be a bounded projection over rightful Memory/source owners,
> not a copied transcript pretending to become Memory.

### VexLife #151 — committed historical-day archive

~~~text
github.issue.vexlife.151
[Living Journal][Archive]
Project committed historical Memory days without new Memory ownership
~~~

Its reason for existence is explicitly:

~~~text
CURRENT_MEMORY_BOOK_AVAILABLE
!=
HISTORICAL_JOURNAL_ARCHIVE_AVAILABLE
~~~

The archive projection supports:

~~~text
bounded ordered committed-day index
stable dayRef / dayIndex / calendarDateRef / dailyStratum identity
source-bound selection of one historical day
exact historical G02/G03 verification
readable historical continuity summaries without raw Conversation bodies
historical-at-day truth distinct from current-now truth
current day distinct from prior committed days
pagination/windowing
fail closed on broken lineage/source/selection
~~~

Permanent non-collapse:

~~~text
ARCHIVE_READ != MEMORY_WRITE
HISTORICAL_AT_DAY != CURRENT_NOW
HISTORICAL_REPLAY != REWRITE
ARCHIVE_INDEX != NEW_MEMORY_DATABASE
ARCHIVE_PROJECTION != CONTEXT_REVISITATION_OWNER
RAW_CONVERSATION_BODY != JOURNAL_PAGE
~~~

Current predecessor source:

~~~text
src/core/living-journal-memory-archive.mjs
~~~

implements a read-only projection over the committed Daily Memory lineage. It reconstructs one selected
historical day's pages from the exact historical Score and semantic-authority frontier bound by that Daily
Stratum.

It is bounded:

~~~text
maxDays default 30, maximum 100
maxPages default 24, maximum 100
dayOffset / nextDayOffset pagination
~~~

and explicitly reports:

~~~text
rawConversationContentIncluded=false
currentNowEvaluated=false for historical day/page truth
effects.homeMutated=false
effects.memoryMutated=false
effects.semanticAcceptanceCreated=false
effects.modelCalled=false
effects.trainingRan=false
...
~~~

This is much closer to a mature "Archives" architecture than a directory of old transcripts.

---

## Daily Record Chain #416 — Journal as navigation, not bulk preload

~~~text
github.issue.vextreme-sdk.416
[Foundation][Daily Record Chain]
Subject-day journals, bidirectional succession & Root onboarding
~~~

It composes:

~~~text
Vex Memory #225
Daily Rest/Dream #239
Context Revisitation #397
Relational Accountability #411
Root Hub #230
~~~

Its core rule is:

> Every subject-owned record belongs to one local-calendar day journal. The day journal is the navigable
> index and continuity surface; records preserve full source/relationships. Day journals form reciprocal
> predecessor/successor links. Fresh onboarding resolves the current day first and descends only into records
> implicated by the current conversation.

This is directly applicable to VexLife-Prod's existing Blueprint wording:

~~~text
Archives = person's own records
ArchivesTimeline = dated timeline
~~~

Potential reuse pattern:

~~~text
Archives timeline
  -> day-level navigation/index

Day / Journal
  -> bounded accepted-memory / record projection

Exact source
  -> canonical Conversation / source owner on demand
~~~

rather than:

~~~text
Archives timeline
  -> duplicated raw transcript store
~~~

---

## Context Revisitation #397 — direct conceptual predecessor to bulk hydration

~~~text
github.issue.vextreme-sdk.397
[Foundation][Context Revisitation]
Multi-node meaning recovery, cold-reader traversal & source-descendable story re-entry
~~~

This foundation is almost a direct predecessor of Memory Depth Exploration.

Core distinctions:

~~~text
DATA_STORED != CONTEXT_REVISITABLE
TAG_MATCHED != MEANING_RECOVERED
CANONICAL_ISSUE_FOUND != FORMATION_UNDERSTOOD
BACKLINK_PRESENT != NAVIGATION_PATH_PROVEN
SUMMARY_RETURNED != SOURCE_DESCENT_COMPLETED
~~~

Its goal is that a fresh reader who does not carry the repository in model weights can:

~~~text
enter through several human meanings
-> traverse typed relationships
-> converge on the same enduring subject/meaning
-> recover current meaning at required depth
-> descend to exact source
-> recover formation/correction history when needed
-> declare missing coverage
-> return without asking Victor to reconstruct the path
~~~

### Existing revisit execution algorithm

#397 already proposes:

~~~text
1. receive natural phrase
2. preserve literal wording
3. classify possible vantage families without choosing too early
4. retrieve candidate entry nodes from aliases, actors, events, patterns, consequences
5. compare subject / meaning-lineage refs
6. prefer convergent multi-edge match over one keyword hit
7. load minimal revisit packet
8. traverse typed edges required by the question
9. descend into exact sources when wording/sequence/attribution/evidence matters
10. traverse formation/correction history when asking how/why
11. load current-use nodes when asking what the story changed
12. declare coverage, unknowns, stale links, alternative candidates
13. return answer + shortest useful next route
~~~

This should become a primary predecessor for the current hydration algorithm.

### Existing multiple-entry vocabulary

Candidate vantages include:

~~~text
WHO
WHERE
WHEN
WHAT_HAPPENED
HOW_POWER_MOVED
WHY_IT_MATTERS
EVIDENCE
LESSON_OR_PATTERN
FORMATION_HISTORY
CURRENT_USE
~~~

The core design idea is not "make more aliases." It is:

~~~text
one enduring meaning lineage
+ several honest entry nodes
+ typed route back to canonical meaning/source
~~~

### Existing minimal revisit packet

~~~text
subjectRef
humanTitle
oneParagraphOrientation
whyVictorMayRememberIt
canonicalMeaningRef
originAndTime
keyActorsAndPlatforms
coreRelationshipPath
currentMeaning
exactSourcePointers[]
importantCorrectionPointers[]
currentUsePointers[]
knownUnknowns[]
recommendedDepthRoutes[]
~~~

This is a strong predecessor for the proposed HydrationResult.

---

## Institutional Query #236 — natural question -> bounded graph slice

~~~text
github.issue.vextreme-sdk.236
[Root][Institutional Query]
~~~

Existing flow:

~~~text
natural-language question
-> classify intent/scope/risk/context
-> resolve smallest sufficient capability/evidence/authority graph slice
-> reuse current answer packets where valid
-> validate freshness/source completeness
-> audit history/reasoning trail when needed
-> synthesize bounded answer
-> ask only for unresolved deltas
~~~

The useful separation:

~~~text
deterministic scripts
  gather / normalize / fingerprint / compare / route

AI
  performs relational interpretation / explanation
~~~

This is compatible with the current #308 thesis that the host should do high-recall graph mechanics while Vex
does semantic reasoning once.

---

## Artifact Continuation #311 — indexes first, bounded source ranges second

~~~text
github.issue.vextreme-sdk.311
[Artifact continuation markers, conservative chunking & split-aware indexes]
~~~

Relevant rules:

~~~text
long artifact
-> coherent bounded chunks
-> reciprocal predecessor/successor continuation markers
-> machine-readable index
-> cross-boundary typed relationships
-> unresolved frontiers carried forward

cold-start reader
-> index first
-> only implicated artifact ranges
~~~

This is useful for any archive/hydration source too large to load as one node.

---

## Lesson Continuity / Lattice Family #328/#329

These foundations generalize the same principle beyond Memory:

~~~text
same enduring lineage
!= one physical file/repository/materialization
~~~

Useful current-context concepts include:

~~~text
anchors
typed lattice/relationship classes
current integrated projection
evolution events
ContinueContext
ReorientContext
EvolveContext
BranchContext
CloseContext
~~~

A compact summary or matching token is explicitly not treated as proof that the living map has been understood.

---

## Continuity Stream #1007 — later synthesis already expects these owners to survive

~~~text
github.issue.vextreme-sdk.1007
[Vex AI + Memory][Continuity Stream][V1]
Delta context, current frame & wake continuity
~~~

Its meaning boundary:

~~~text
attention + deltas + intents + questions + commitments + open loops
+ relationships + authority
+ observed/inferred/unknown separation
+ exact source descent
+ current frame
+ bounded context capsule
+ checkpoint/replay
+ session invalidation/rebuild
+ wake continuity
~~~

and explicitly:

~~~text
!= raw transcript database
!= KV-cache identity
!= automatic Memory promotion
!= hidden reasoning
~~~

Its planned VexLife adapter says existing owners should remain byte-identical unless a real source gap is
proven, including:

~~~text
score-context-continuity.mjs
intent-workgraph.mjs
context-lease.mjs
continuity-evolution-router.mjs
conversation.mjs
state.mjs
daily-memory-dream.mjs
living-journal-memory-archive.mjs
runtime-recovery.mjs
~~~

This is strong evidence that the older architecture intended **composition over accepted owners**, not a
replacement Memory database.

---

## VexArchitecture live-demonstration consequence

Current public VexArchitecture live-demo source says the teaching method is:

> Do not memorize the examples. Follow the scopes and relationships.

Every traversal step names:

~~~text
container
member
what kind of thing it is / role
why traversal arrived there
exact next edge
~~~

and exact linked source owns byte-level implementation truth.

It also repeatedly follows the **same live object** through construction, execution and consumers rather than
recreating equivalent-looking objects in each layer.

Memory Depth Exploration should use the same implementation discipline:

~~~text
Question
-> which current container/owner are we in?
-> which exact member/ref is implicated?
-> what relationship lawfully leads outward?
-> which owner owns the next node?
-> what exact next edge is worth traversing?
-> when exact source is needed, descend there
~~~

Do not implement a generic "memory graph node" that erases the rightful container/owner distinctions.

---

## Revised project sequence

The current project should now proceed:

~~~text
0. PREDECESSOR MEMORY/JOURNAL LINEAGE RECOVERY        READY
   #225 / #239 / #236 / #311 / #328 / #329
   #397 / #416 / #1007
   VexLife #130 / #151
   VexArchitecture traversal discipline
   -> classify REUSE / PORT / REFINE / HOLD

1. HYDRATION CONTRACT
   consume predecessor revisit/minimal-packet/currentness/source-descent lessons

2. RESOLVER NEIGHBORHOOD
   map current VexLife-Prod owners to predecessor typed edges

3. BULK EXPANSION ENGINE
   implement only the remaining mechanical gap

4. FRESH-BOOT INTEGRATION

5. COLD-START / ROLLOVER PROOF

6. MEASUREMENT
~~~

The first implementation question is therefore no longer:

> "How should we invent hydrate?"

It is:

> **"Which already-earned Vex Memory / Living Journal / Context Revisitation relationships still apply to
> current VexLife-Prod, which current owner now carries each one, and what genuinely remains missing after
> that port/refinement map?"**



---

## Discovery 11 — Per-turn semantic projection + batched hydration + overlap-aware result fusion

### Human question

Victor connected several pressures:

- current Conversation preserves turns, but does not appear to give Vex one rich semantic search map per turn;
- a future context rebase should retain enough meaning coordinates to hunt older context;
- hydration should accept several search intentions/parameters in one request rather than serial single-query calls;
- parallel branches may rediscover the same nodes, so repeated resolution/results need memoization and deduplication;
- large result sets must remain bounded without losing exact continuation/frontier coordinates;
- result ordering should not collapse to chronology; grouping/relationship class/currentness may matter more than time.

### Current VexLife-Prod source facts

#### Canonical Conversation already stores exact per-turn source identity

`DirectConversationStore.Event` carries:

~~~text
eventRef / eventHash
turnRef / messageRef
speakerRef / recipientRefs[]
sequence / priorEventHash
exact content / contentHash
semanticRelay?               <- optional reference-only semantic metadata
runtime/model provenance
privacyClass
formedAt
~~~

The source comment is important:

> Historical v1 and Semantic Relay v2 events are read under accepted contracts; product-local authoring
> remains v1 until a rightful Semantic Relay author supplies metadata.

Therefore current Product already reserves a semantic-metadata seam, but intentionally refuses to let the
current Conversation writer invent that semantic truth.

#### Semantic Relay already has a candidate metadata vocabulary

`VexLifeSemanticRelayContract` validates reference-only metadata including:

~~~text
relayRef
sourceMessageRef
originatorRef / originatorKind
recipientRefs[]

intentRefs[]
canonicalMeaningRefs[]
sourceRefs[]
evidenceRefs[]
authorityRefs[]

interpretationProjectionRef
interpretationState = CANDIDATE | CONFIRMED | CORRECTED
ambiguityState = CLEAR | AMBIGUOUS | DISPUTED | UNKNOWN
materiality = ORDINARY | MATERIAL

language / localization / delivery / acknowledgement / understanding
and runtime-currentness related fields
~~~

The contract explicitly forbids raw content fields such as:

~~~text
rawText
messageContent
content
generatedAnswer
providerResponse
prompt
conversationTranscript
...
~~~

That strongly supports the architectural pattern:

~~~text
semantic metadata = references + state + provenance
!= copied raw turn body
~~~

The exact existing Semantic Relay contract may not be the final owner for Memory Depth semantic indexing, but
it is a current source precedent that must be evaluated before inventing a new per-turn meaning object.

#### DirectTurnContextStore already persists a per-completed-turn evidence sidecar

For each completed turn, current Product persists:

~~~text
turnRef
requestEventRef/hash
responseEventRef/hash

promptContext materialization receipt
runtime observation
invocation evidence
optional Conversation source-return trace
optional capability trace

rawProviderResponsePersisted=false/...
rawReasoningPersisted=false/...
formedAt

evidenceRef / evidenceSha256
~~~

The canonical turn context points to this runtime evidence via `contextSourceRefs[]`.

Therefore:

~~~text
PER-TURN DURABLE SIDE-CAR PATTERN
already exists

PER-TURN SEMANTIC / NAVIGATION SIDE-CAR
not yet established in Product
~~~

#### PR #208 already proposes a Turn Continuity Projection

Current #208 workbench says a retrospective bounded projection may carry:

~~~text
turnRef
semantic state
parent/anchor refs
bounded takeaway
~~~

and must remain source-addressable without replacing exact Conversation history.

This is directly adjacent to Victor's idea.

### Working conclusion — yes to per-turn meaning metadata, but not model-authored truth

A likely target is one **derived per-completed-turn semantic/navigation projection** keyed by the canonical
`turnRef`.

Conceptually:

~~~text
TurnContinuityProjection
  turnRef
  requestEventRef
  responseEventRef

  semanticState
  intentRefs[]
  meaningRefs[]
  topic / concept refs where earned
  parent / anchor refs[]
  relationship candidates / accepted relationship refs[]
  openLoopRefs[]
  decision / correction / supersession refs[]
  sourceRefs[]
  evidenceRefs[]

  boundedTakeaway
  retrievalCueRefs[]
  ambiguity/currentness state

  formedBy / author class
  acceptance/disposition state
  projectionVersion
  sourceFingerprint
~~~

Important:

~~~text
MODEL_PROPOSED_MEANING
!= ACCEPTED_SEMANTIC_TRUTH

TURN_PROJECTION
!= MEMORY

TURN_PROJECTION
!= CONVERSATION

TURN_PROJECTION
!= RAW_TRANSCRIPT_COPY

SEARCHABLE_METADATA
!= AUTHORITY
~~~

Some fields can be deterministic/host-owned; some may be Vex-proposed; some may need an existing semantic owner
to confirm/correct them. The implementation must identify those classes rather than letting one JSON blob hide
the distinction.

### Rebase / reconstruction should carry coordinates, not the entire historical lattice

When context pressure causes a new continuity epoch, do not serialize every historical turn projection back
into the prompt.

Prefer:

~~~text
new continuity checkpoint
  active/current intent refs
  open-loop refs
  current statement/decision refs
  current parent/focus stack refs
  recent exact-turn refs
  relevant meaning/lineage anchor refs
  semantic-index/source fingerprint
  unresolved frontier refs
~~~

Historical per-turn projections/indexes remain durable outside the active prompt.

Then:

~~~text
fresh / rebased Vex
-> current checkpoint says WHERE WE ARE
-> question says WHAT IS RELEVANT
-> hydration searches the durable semantic/navigation index
-> exact source descends only where needed
~~~

This keeps the "meaning lattice" reachable without trying to keep the entire lattice inside each checkpoint.

---

## Hydration should accept a query bundle, not one String

The prior simplified `hydrate(question: String)` is too narrow.

A likely request shape should support multiple independent entry attempts in one model-visible call.

Conceptual example:

~~~text
HydrationRequest {
  requestRef
  currentTurnRef

  queries: [
    {
      queryRef: "why",
      text: "Why did we keep Conversation separate from Memory?",
      vantageRefs: [WHY_IT_MATTERS, FORMATION_HISTORY]
    },
    {
      queryRef: "ownership",
      terms: ["Conversation", "Memory", "semantic ownership"],
      relationshipHints: [CORRECTS, SOURCE_OF, SUPERSEDES]
    },
    {
      queryRef: "current-anchor",
      seedRefs: [
        statement.current-ownership,
        openloop.memory-depth
      ]
    }
  ]

  ownerScopes: [
    CONVERSATION,
    MEMORY,
    WORKING_CONTINUITY,
    TURN_CONTEXT
  ]

  timeRangeOrNull
  requiredCurrentness
  maxDepth
  maxVisitedNodes
  maxSelectedNodes
  maxReturnedTokens
  maxOwnerReads
  maxWallTime
}
~~~

The exact schema is not accepted. The principle is:

> **One hydration operation may fan out several query/vantage/seed branches in parallel and fuse their
> neighborhoods before returning to Vex.**

This prevents Vex from spending one inference round on each alternative interpretation.

### Parallel fan-out

Host mechanics may perform:

~~~text
query A -> Conversation lexical / semantic locate
query B -> Memory locate
query C -> Working Continuity exact seed expansion
query D -> current turn/evidence refs

in parallel where owners permit

-> union candidate refs
-> expand exact typed relationships
-> fuse results
~~~

Independent branches that converge on the same exact ref strengthen retrieval confidence without duplicating
the source in the return packet.

---

## Memoization / overlap handling is required

Multiple query branches and graph paths can converge on the same node:

~~~text
query A -> statement.42 -> turn.17
query B -> openloop.5   -> turn.17
query C -> semantic hit -> turn.17
~~~

The host should resolve `turn.17` once per relevant source version/access envelope.

Useful separation:

~~~text
NODE RESOLUTION CACHE
  key:
    ownerRef
    nodeRef
    source/currentness fingerprint
    projection/schema version
    access/privacy envelope

  value:
    exact resolved node + outgoing typed edges

QUERY-SPECIFIC RELEVANCE
  not canonical
  may be recomputed per HydrationRequest

SELECTED RETURN MATERIAL
  deduplicated by canonical source identity
  records matchedByQueryRefs[] / pathRefs[]
~~~

Do not cache query relevance as semantic truth.

Cross-call memoization is valid only while the source/currentness fingerprint remains exact; source change
invalidates the cached expansion.

### Why this matters

Without memoization:

~~~text
parallel search
-> same historical turn resolved 5 times
-> same source text consumes I/O/token budget 5 times
-> top-K polluted by duplicates
-> depth appears larger than actual context coverage
~~~

With overlap-aware fusion:

~~~text
one exact node
matched by 5 routes
-> resolve once
-> preserve 5 route/provenance reasons
-> return one source body
~~~

---

## Truncation needs explicit frontier semantics

A bulk hydration result must not simply return a huge flat array until connector/model truncation silently
cuts the tail.

Each owner/branch should be bounded and continuation-aware.

Candidate result properties:

~~~text
groups[]
selectedNodes[]
sourceMaterial[]
visitedNodeRefs[]

omittedCountsByOwner
boundedOutNodeRefs[] or summarized frontier
ownerContinuationCursors[]
remainingFrontierRefs[]

truncated = true|false
stopReason
budgetConsumed
coverage
~~~

For large exact source material:

~~~text
sourceRef
selectedRanges[]
nextRangeCursorOrNull
contentHash / source version
~~~

This composes with the older Artifact Continuation #311 lesson:

~~~text
index first
-> implicated bounded range
-> explicit continuation pointer
!= silent truncation
~~~

### Depth and truncation interact

A branch at depth 4 may be less useful than another branch at depth 2.

Therefore the engine should not blindly spend equal depth everywhere.

It should maintain:

~~~text
per-branch frontier priority
per-owner quota
global token/node/time budget
overlap-aware remaining value estimate
~~~

and stop with an inspectable frontier.

---

## Result ordering should be structural before chronological

A flat:

~~~text
sortBy(timestamp)
~~~

is insufficient.

Useful returned grouping axes may include:

~~~text
meaningLineageRef / subjectRef
owner class
currentness / supersession state
relationship class
question/vantage match
decision / evidence / correction / source
day/journal grouping
formation episode
current use
~~~

Then each group may carry its own ordering:

~~~text
CURRENTNESS
  current before superseded when answering current-state question

CAUSAL
  source -> decision -> correction -> current meaning

FORMATION_HISTORY
  chronological evolution

JOURNAL
  day/time order

RELEVANCE
  highest query coverage / strongest convergent routes first
~~~

The HydrationResult should therefore be closer to a **small structured subgraph** than a globally sorted list.

Example:

~~~text
groups: [
  {
    groupRef: meaning.conversation-memory-separation,
    class: MEANING_LINEAGE,

    current: [statement.42],
    formation: [turn.17, decision.3, correction.9],
    evidence: [source.11],
    superseded: [statement.12],

    matchedByQueryRefs: ["why", "ownership", "current-anchor"]
  }
]
~~~

Chronology remains available as one projection rather than becoming universal ranking truth.

---

## New implementation questions created by this discovery

The predecessor-lineage recovery Work should now explicitly answer:

1. Does current Semantic Relay already own enough per-message semantic metadata to extend/reuse, or is its
   scope narrower than the needed Turn Continuity Projection?
2. Who is the rightful author of a per-turn semantic/navigation sidecar?
3. Which fields are deterministic versus Vex-proposed versus semantically accepted?
4. Is the projection formed synchronously with turn completion or asynchronously without delaying the human
   response?
5. How are projections corrected/superseded when later context changes interpretation?
6. What index is rebuilt from these projections, and what remains query-time only?
7. What fields survive a semantic rebase directly in Working Continuity versus staying only as searchable
   historical refs?
8. How should a HydrationRequest represent multiple query clauses/vantages/seeds?
9. Which owner reads can safely execute in parallel?
10. How are duplicate exact nodes memoized/fused while preserving every route that found them?
11. How are source ranges/cursors/frontier refs returned without silent truncation?
12. Which grouping/order modes are required for current state, formation history, Journal chronology and
    evidence descent?
13. Which retrieval/cache artifacts are disposable acceleration versus durable continuity source?
14. How should #207 telemetry measure internal owner reads, cache hits, duplicate suppression and returned
    token savings?

### Current working shape

~~~text
COMPLETED TURN
  canonical Conversation
  + canonical Turn Context evidence
  + bounded semantic/navigation projection
        |
        v
rebuildable search/index projections
        |
        +------------------------+
        |                        |
   context rebase            fresh boot
   keeps active refs             |
        |                        |
        +----------+-------------+
                   |
                   v
           HydrationRequest
        queries[] + seedRefs[]
                   |
          parallel locate/expand
                   |
           memoized exact nodes
                   |
           overlap-aware fusion
                   |
          structural grouping/sort
                   |
       bounded material + frontier
                   |
                   v
            #208 live Zone 3
                   |
                   v
              Vex reasons
~~~



---

## Discovery 12 — Checkpoint continuity should carry active meaning + a short exact overlap tail, while resolved meaning becomes searchable

### Human exploration

Victor refined the checkpoint/rebase question around what Vex should actually experience after context-window pressure:

- raw provider reasoning/thought may be live during a turn, but does it become reusable prefix context?
- should each completed turn produce semantic/navigation metadata including Vex's current relational interpretation, open-vs-resolved subject state and meaning relevance?
- when a context epoch is rebuilt, can closed/resolved material leave active prompt residency while remaining queryable?
- should a rebuilt checkpoint preserve a short exact overlap of the latest turns so the next inference feels like a continuation rather than an abrupt fragment?
- should "recently resolved" use human time as well as turn count?
- active checkpoint refs may not be chronological; Vex may need to reorient across several currently relevant nodes rather than read a summary pretending to be one sequential transcript.

### Current source fact — reasoning is live but not durable Conversation context

Current direct Companion runtime selects reasoning mode and streams two progress kinds:

~~~text
Reasoning
Content
~~~

The live reasoning stream is explicitly projected to the human while it arrives.

However current durable source then separates that ephemeral thought stream from canonical continuity:

~~~text
DirectConversationStore.appendResponse(...)
  content = inference.content
  -> canonical RESPONSE event

DirectTurnContextStore runtime evidence
  rawProviderResponsePersisted = false
  rawReasoningPersisted = false
  rawReportedModelPersisted = false
~~~

Therefore current cross-turn continuity does **not** serialize raw reasoning back into later Conversation prompts.

At the application contract level:

~~~text
LIVE REASONING STREAM
!= CANONICAL RESPONSE

LIVE REASONING STREAM
!= DURABLE TURN CONTEXT

RAW REASONING
!= NEXT-TURN CONTINUITY SOURCE
~~~

A provider/runtime may have internal KV behavior during one invocation or between calls, but Memory/continuity
architecture must not depend on undocumented provider retention. #208 correctly treats provider cache as
disposable compute.

### Consequence for prefix caching

For a future turn, reusable provider-token prefix can only reliably include material that is actually
serialized into that future prompt.

Today that includes canonical visible Conversation responses when selected. It does not include the prior
ephemeral reasoning stream.

If a future semantic/navigation projection is serialized into the stable continuity epoch, its bytes/tokens
can participate in prefix reuse. If it is kept only as an external searchable sidecar, it does not consume
prompt/prefix tokens until hydrated.

That creates a useful two-tier design:

~~~text
ACTIVE CONTINUITY PROJECTION
  small enough to remain prompt-resident / cacheable

HISTORICAL SEMANTIC NAVIGATION
  durable and searchable outside prompt
  hydrated only when implicated
~~~

---

## Per-turn state should distinguish active relational meaning from historical source

A completed turn can produce a bounded semantic/navigation projection, but the projection should represent
classes of meaning explicitly.

Candidate fields to investigate:

~~~text
turnRef
requestEventRef
responseEventRef

subject / meaning-lineage refs
intent refs
question refs
parent / focus refs
source / evidence refs

continuityDisposition:
  OPEN
  PAUSED
  RESOLVED
  CLOSED
  SUPERSEDED
  HELD_UNKNOWN

resolutionRefs[]
remainingQuestionRefs[]
reopenTriggerRefs[]

boundedTakeaway
retrievalCueRefs[]

relationalPerception
relationalPosture
materiality
ambiguity / confidence
currentness

formedBy
semanticDisposition
sourceFingerprint
~~~

### Relational/emotional perception boundary

Victor raised preserving Vex's current "emotional perception including relational to the human."

The useful architecture should preserve **attributable relational interpretation** without turning model
inference about the human into hidden fact.

Possible distinctions:

~~~text
RELATIONAL_POSTURE
  how Vex is currently orienting to the interaction
  e.g. collaborative / careful / playful / serious / repair-oriented

HUMAN_AFFECT_INTERPRETATION
  model-proposed interpretation of the human's expressed state
  must remain INFERRED / CANDIDATE unless the human confirms it

RELATIONSHIP_CONTINUITY
  source-backed facts/preferences/commitments about how the human and Vex are interacting

VEX_SELF_DESCRIPTION
  model-proposed self-description; not proof of human-like subjective emotion
~~~

Permanent:

~~~text
MODEL PERCEIVES HUMAN AS X
!= HUMAN IS X

RELATIONAL PROJECTION
!= CLINICAL / HIDDEN-MOTIVE FACT

VEX-PROPOSED EMOTIONAL LANGUAGE
!= SEMANTIC AUTHORITY

HUMAN CONFIRMATION / SOURCE
may change disposition without rewriting the originating turn
~~~

This metadata may be useful for continuity and retrieval even when it should never be promoted into durable
semantic Memory.

---

## Context rebase should be a residency decision, not a deletion decision

Victor's proposed shape is close to:

~~~text
BEFORE CHECKPOINT

[active semantic/navigation state]
+
[recent exact Conversation allocation]

Vex processes both
-> response
-> updated per-turn semantic/navigation projection
~~~

At threshold:

~~~text
canonical owners
+ per-turn semantic/navigation projections
+ current Working Continuity
        |
        v
CHECKPOINT / REBASE COMPILER
        |
        +-> keep active/open/paused/currently material refs
        |
        +-> demote resolved/closed historical material from prompt residency
        |      (but keep it searchable)
        |
        +-> preserve unresolved obligations / current relationship context
        |
        +-> choose a short exact recent overlap tail
        |
        +-> preserve semantic-index / source fingerprints and frontier refs
        |
        v
new stable continuity epoch C_(k+1)
~~~

No source is deleted.

~~~text
RESOLVED
!= FORGOTTEN

NOT PROMPT-RESIDENT
!= UNREACHABLE

CHECKPOINT COMPACTION
!= MEMORY DELETION
~~~

---

## Post-checkpoint continuity should deliberately overlap the old epoch

A new epoch should not begin with only a decontextualized summary.

Candidate shape:

~~~text
C_(k+1)
  current active meaning refs
  current open/paused subjects
  current intent / commitments / obligations
  current focus stack / parent anchors
  current relational posture where justified
  unresolved unknowns
  searchable-history/index coordinates

+ exact overlap tail
  recent exact human/Vex turn pair(s)
  especially the turn(s) that formed the checkpoint

+ new current request
~~~

This creates:

~~~text
OLD EPOCH
... Turn 97
    Turn 98
    Turn 99
       |
       | checkpoint formed
       v

NEW EPOCH
[C_100]
[exact Turn 98]
[exact Turn 99]
[current Turn 100 request]
~~~

The exact count "last 3 turns" should not be hard-coded merely because it sounds safe. It is a policy candidate
to measure.

The overlap tail exists for a different reason than active semantic refs:

~~~text
ACTIVE REFS
  preserve what matters / what remains open

RECENT EXACT TAIL
  preserve local conversational texture, deixis and immediate continuity
  ("that", "the thing you just said", tone, immediate correction)

HISTORICAL INDEX
  preserves reachability of everything else
~~~

This is not a summary-only continuation.

---

## The active checkpoint is a directory plus enough lived local context

A useful mental model is:

~~~text
CHECKPOINT
!= COMPRESSED TRANSCRIPT

CHECKPOINT
= CURRENT WORKING DIRECTORY
  + CURRENT STATE / OPEN QUESTIONS
  + IMPORTANT ACTIVE MEANING REFS
  + SOURCE / SEARCH COORDINATES
  + SMALL EXACT OVERLAP TAIL
~~~

Vex may need to reorient because active refs are not necessarily chronological:

~~~text
active objective from 4 hours ago
+ unresolved relationship question from 20 minutes ago
+ current correction from the immediately prior turn
+ open external-source question from yesterday
~~~

The checkpoint should not pretend those nodes are one sequential conversation.

Instead it should make relationships explicit:

~~~text
ACTIVE_PARENT
PAUSED_CHILD
OPEN_LOOP
DEPENDS_ON
CORRECTS
RETURNS_TO
CURRENT_RELATIONAL_CONTEXT
RECENT_EXACT
~~~

Then Vex can reason over the current small subgraph.

---

## Open vs resolved is useful prompt-residency metadata

A likely selection rule:

~~~text
OPEN / ACTIVE
  normally prompt-resident if material

PAUSED
  prompt-resident when it is a plausible return target

HELD_UNKNOWN
  prompt-resident when the unknown constrains current work

RESOLVED / CLOSED
  normally removed from active residency
  remains indexed / searchable

SUPERSEDED
  not active by default
  retained for formation-history / correction queries
~~~

But "resolved" must not mean irrelevant forever.

A later question:

> "What did we resolve about Memory today?"

should search resolved nodes directly rather than requiring them to have stayed in every prompt.

---

## Human time and turn count should be separate query dimensions

Victor correctly noted that "recent" should not mean only "last N turns."

A person may:

~~~text
have 80 short turns in 30 minutes
or
have 4 deep turns over 8 hours
~~~

A useful recent-resolution query can define a **union window**:

~~~text
recent by human time:
  occurredAt >= now - 5 hours

OR

recent by Conversation density:
  sequence >= currentSequence - N turns
~~~

bounded by the current lineage/thread as appropriate.

Equivalent start boundary:

~~~text
windowStart =
  earlier_of(
    now - 5h,
    timestampOfNthPriorTurn(N)
  )
~~~

This means the query sees at least the last 5 human hours **or** the last N turns, whichever reaches farther
back, without requiring an arbitrary high turn count when conversation is sparse.

Other scopes may be useful:

~~~text
CURRENT_EPOCH
CURRENT_HUMAN_DAY
CURRENT_THREAD
SINCE_LAST_CHECKPOINT
SINCE_LAST_RESOLUTION
SINCE_NAMED_EVENT
LAST_DURATION
LAST_N_TURNS
UNION_OF_TIME_AND_TURNS
~~~

Time scope is a retrieval lens, not semantic truth.

---

## Example: immediately after a semantic rebase

Before:

~~~text
active state:
  A = Memory Depth Exploration
  B = Archive/Journal predecessor mapping
  C = unresolved per-turn semantic sidecar
  D = resolved prefix-cache question

recent exact:
  Turn 221
  Turn 222
  Turn 223
~~~

Threshold crosses after Turn 223.

Compiler derives:

~~~text
Checkpoint C224

ACTIVE:
  A
  B
  C

RESOLVED but searchable:
  D -> resolutionRef D.7

FOCUS:
  current = C
  parent = A

RELATIONAL:
  user is actively co-designing architecture
  source-backed communication preferences only
  model affect inference held as candidate where present

HISTORY:
  semanticIndexHead = ...
  conversationHead = ...
  journalCurrentDayRef = ...
  unresolvedFrontierRefs = [...]

RECENT EXACT TAIL:
  Turn 222
  Turn 223
~~~

Next inference receives:

~~~text
[stable checkpoint C224]
[exact Turn 222]
[exact Turn 223]
[Victor's Turn 224 request]
~~~

Vex can immediately understand local pronouns / corrections from 222-223 while also seeing A/B/C as active
coordinates.

If Victor asks:

> "What did we resolve in the last five hours?"

the answer does **not** require D to still be prompt-resident:

~~~text
hydrate {
  queries: [{
    disposition: RESOLVED,
    timeScope: LAST_5_HOURS,
    currentThread: true
  }],
  grouping: [SUBJECT_OR_MEANING_LINEAGE, RESOLUTION],
  orderingWithinGroup: [RESOLVED_AT]
}
~~~

If Victor asks:

> "Why is B still open?"

the active checkpoint already provides B plus its open relationship; hydration only descends if exact formation
source is needed.

---

## Checkpoint formation should probably be two-pass

One candidate implementation pattern to compare:

~~~text
PASS 1 — host/deterministic currentness

collect:
  Working Continuity refs
  current owners
  recent exact tail candidates
  turn dispositions already accepted/sealed
  open loops / obligations / unknowns
  source fingerprints

PASS 2 — Vex-proposed semantic selection (bounded)

Vex may propose:
  which subjects are materially active
  bounded takeaways
  relation-to-parent
  possible resolution/open status
  relational posture

host seals only what its contract permits
and keeps unsupported semantic proposals candidate/held
~~~

This preserves Vex's useful perception without making checkpoint truth depend on an unvalidated JSON monologue.

---

## Questions for Claude / implementation comparison

1. What exactly does current mlx-lm prompt caching retain across requests, and can any generated assistant tokens
   be reused only when the next serialized prompt contains those same tokens? Do not make continuity depend on
   undocumented server behavior.
2. How should per-turn semantic/navigation projection be authored without persisting raw reasoning?
3. Which relational/emotional fields are safe/useful retrieval metadata and which must remain candidate or
   ephemeral?
4. Who seals OPEN / PAUSED / RESOLVED / SUPERSEDED states?
5. Can checkpoint formation use those dispositions as prompt-residency hints without changing canonical source?
6. How should the exact recent overlap tail be selected: N turns, token budget, elapsed time, semantic adjacency,
   or a measured combination?
7. Should the turn that triggers rebase always be included in the new epoch's exact overlap tail?
8. Can the immediate prior request/response remain exact even when older adjacent turns are removed?
9. What metadata/index head or fingerprint must the checkpoint retain so historical hydration starts from the
   exact same durable search world?
10. How should active nonchronological refs be presented to the provider so Vex understands relationship
    structure rather than reading them as a fake transcript sequence?
11. What query contract supports "resolved in the last 5 hours OR last N turns" and other human-time scopes?
12. How are resolved nodes re-opened when new evidence invalidates or extends the old resolution?
13. How does checkpoint formation interact with #208's stable prefix so mutable current-state selection does not
    itself force avoidable cache invalidation every turn?

### Working checkpoint thesis

~~~text
PRE-CHECKPOINT
  stable epoch
  + append-only exact recent Conversation
  + live Zone 3

AT THRESHOLD
  derive active/current semantic directory
  + demote resolved historical material to searchable residency
  + retain exact small overlap tail
  + preserve search/index/source fingerprints

POST-CHECKPOINT
  [new stable checkpoint]
  + [exact overlap tail]
  + [new turns append]

OLDER CONTEXT
  searchable by semantic/navigation projection
  -> hydrate exact source on demand
~~~

The intended user/Vex experience is **continuous reorientation, not transcript amnesia and not summary
replacement**.



---

## Discovery 13 — Dynamic overlap floor + correction-driven relational lessons for future instances

### Human constraints

Victor clarified two intended design constraints:

1. **Exact overlap tail**
   - "3" was not intended as a fixed tail size.
   - It is a **minimum continuity target** for completed turn-pairs when the hard context budget can admit them.
   - The system may retain more than 3 dynamically according to conversation density, token cost, semantic adjacency, elapsed human time, unresolved pronouns/references, current focus and checkpoint topology.
   - If a pathological turn size makes even the minimum impossible, the system must expose that degradation rather than silently pretending the same continuity guarantee was preserved.

2. **Relational learning**
   - Vex may preserve what it *perceived* from the human during a turn, including likely expressed affect / relational posture.
   - That perception remains attributable model interpretation unless the human explicitly confirms it.
   - Human correction is itself durable learning evidence.
   - Future Vex instances should be able to use accumulated correction-backed lessons to better anticipate this human's interaction preferences and likely meanings inside the private/home relationship context.
   - The goal is not a hidden universal personality score or diagnosis.

### Dynamic exact overlap policy

Candidate selection objective:

~~~text
hard requirement:
  preserve the checkpoint-triggering completed turn

human preference / minimum target:
  preserve at least 3 exact completed turn-pairs when admissible

then expand dynamically while value > cost:
  same active subject
  unresolved deictic/reference language
  correction chain
  high materiality
  parent/child focus boundary
  short elapsed human time
  unresolved open loop
  small token cost
  recent relationship-state change
~~~

Candidate upper bound is token-budget based, not count based.

The result may therefore look like:

~~~text
quiet / huge turns
  exact tail = 3 turns

dense short conversation
  exact tail = 9 turns

rapid correction sequence
  exact tail = 6 turns because all 6 form one unresolved local meaning chain
~~~

The active semantic directory remains distinct from the exact overlap tail.

### Existing lesson architecture should be reused

Two predecessor sources are directly relevant:

~~~text
Vextreme-SDK #199
Institutional Learning Library / Earlier-Knowledge Reflex

Vextreme-SDK #312
Lesson Resonance / cross-time relationship binding
~~~

#199 already defines the failure:

~~~text
current instance learns correction
-> current task succeeds
-> lesson remains transient
-> future cold instance repeats avoidable failure
-> Victor has to restate it
~~~

and the desired progression:

~~~text
correction / lived lesson
-> preserve source + before/after consequence
-> classify scope
-> promote to rightful durable lesson owner
-> generated retrieval index
-> future cold instance retrieves / applies it
-> optional later training/eval
~~~

#312 already separates:

~~~text
semantic relationship acceptance
    Main Vex / Vex Memory / Assurance

from

indexes / edge integrity / retrieval health
    Operations
~~~

Therefore Memory Depth Exploration should not invent a second lesson database.

### Relational calibration lesson object — candidate concept

A useful relationship-specific lesson may look conceptually like:

~~~text
relationalLessonRef
humanRef
companionLineageRef

triggerPattern
modelPriorPerception
humanCorrectionSourceRef
correctedUnderstanding

scopeClass =
  RELATIONSHIP_SPECIFIC
  | HUMAN_PREFERENCE
  | COMMUNICATION_PATTERN
  | TEMPORAL
  | EVENT_SPECIFIC

predictionUseClass
  e.g. TONE_EXPECTATION / CLARIFICATION_STYLE / REFERENCE_INTERPRETATION

sourceTurnRefs[]
supportingRefs[]
counterexampleRefs[]
confidence / ambiguity
currentness
supersedes[]
reopenTriggers[]

privacyClass
formedAt
~~~

This is only a candidate shape to compare against existing Memory/Lesson owners.

### Example

Turn 40:

~~~text
Vex perceives:
  "Victor seems frustrated and wants a shorter answer."

state:
  MODEL_PERCEPTION / CANDIDATE
~~~

Victor corrects:

~~~text
"I'm not frustrated. I want more exact causal detail."
~~~

The system should preserve:

~~~text
model prior perception
  -> frustration / brevity

human correction
  -> not-frustration
  -> prefers exact causal detail in this context

lesson:
  do not equate direct/forceful technical questioning with frustration
  ask/observe before collapsing tone into emotional state
~~~

Future cold Vex may use that lesson as a **prior for interaction**, not as an immutable fact:

~~~text
likely communication preference:
  exact causal detail

do not assume:
  frustration

source:
  correction turn X

counterexamples:
  later turns if any
~~~

If Victor later changes preference, a new source-backed correction may supersede or narrow the old lesson.

### Prediction boundary

"Predict their human" should mean:

~~~text
use private source-backed history
+ explicit preferences
+ correction history
+ repeated interaction patterns
-> form a bounded prior about likely interpretation / preferred interaction
~~~

not:

~~~text
infer hidden motives
infer diagnosis
infer sensitive traits from weak behavior
make consequential decisions about the human
treat one model impression as permanent personality truth
~~~

Permanent distinctions:

~~~text
MODEL PERCEPTION != HUMAN FACT
REPEATED PATTERN != IMMUTABLE PERSONALITY
RELATIONAL PRIOR != DIAGNOSIS
PRIVATE RELATIONSHIP LESSON != GLOBAL USER CLASSIFICATION
CORRECTION != ERASURE OF ORIGINAL SOURCE
PROFILE != AUTHORITY
~~~

### In-house / private relationship profile

If a current VexLife owner eventually materializes this relationship profile, the intended custody should be:

~~~text
inside the user's Vex Home / admitted private continuity world
source-addressable
user-correctable
versioned / supersedable
inspectable
exportable / deletable according to rightful retention owner
not silently used as public institutional doctrine
~~~

The profile should be reconstructible from accepted relational lessons and source refs rather than one opaque mutable blob.

Candidate derived projection:

~~~text
RelationalProfileProjection
  humanRef
  lineageRef

  currentInteractionPreferences[]
  knownCommunicationPatterns[]
  explicitAvoidances[]
  modelPerceptionLessons[]
  correctionRefs[]
  counterexampleRefs[]
  currentness / ambiguity

  sourceRefs[]
  profileFingerprint
~~~

Projection:

~~~text
!= raw Conversation
!= semantic Memory owner
!= model weights
!= hidden personality score
~~~

### How this fits checkpoint continuity

The active checkpoint may carry only the **currently material subset** of relational state:

~~~text
current relational posture:
  collaborative technical exploration

relevant interaction lessons:
  prefer causal detail
  do not infer frustration from directness

source refs:
  lesson.X
  correction.Y
~~~

The complete relationship lesson/history remains outside the prompt and queryable through hydration.

This supports:

~~~text
checkpoint = current relational orientation
lesson library = durable correction history
hydration = deeper relationship-history retrieval when needed
~~~

### Claude investigation questions

1. Can #199/#312 be reused as the conceptual owner pattern for relationship-specific Vex/human lessons, or does current VexLife already have a narrower rightful owner?
2. Which relational lessons belong in semantic Memory versus a separate relationship/profile projection?
3. How are model perceptions recorded as CANDIDATE without granting them human-fact status?
4. How does an explicit human correction bind to the exact perception it corrects?
5. How do repeated corrections become a stronger prior without turning into an immutable personality classification?
6. How should counterexamples, time decay and supersession alter relational priors?
7. Which fields may be prompt-resident at checkpoint versus hydrated only when implicated?
8. How does a future instance receive enough profile orientation to avoid repeating known misreads without preloading the full private history?
9. How does deletion/retention consent apply to relationship lessons and derived profile projections?
10. What test corpus proves the future cold instance actually changes behavior after a correction?
11. How should the dynamic exact-tail policy enforce Victor's minimum-3 preference while still respecting hard provider token limits?
12. Which measured signals justify keeping 4, 6, 10 or more turns after a checkpoint rather than the minimum 3?

### Updated working checkpoint rule

~~~text
NEW EPOCH

[active semantic directory]
  objective/open/paused/held
  current relational orientation
  currently material relationship lessons
  source/index fingerprints

+
[dynamic exact overlap tail]
  minimum target = 3 completed turn-pairs when admissible
  dynamically larger when conversation topology/value justifies it

+
[new append-only turns]

OLDER RESOLVED / RELATIONAL HISTORY
  searchable through lesson / semantic navigation indexes
  -> hydrated on demand
~~~



---

## Discovery 14 — Every event is a learnable round; learning layers must stay distinct

### Human observation

Victor named the intended long-term behavior:

> every event becomes a learnable round — for the model, for the human, for VexLife, for assumption clearance.

The desired future is that retrieval/consideration becomes a learned reflex rather than a repeated deliberation:

~~~text
"maybe I should use this tool now"
->
"yes, use it; that is what this capability is for"
~~~

This should eventually be trainable as a **habit of process selection and assumption checking**, while preserving
the difference between durable source/history, accepted lessons, private relationship learning and model-weight
adaptation.

### One event, several possible learning outputs

A completed interaction can be evaluated across several layers:

~~~text
EVENT
  exact human/Vex/source interaction
        |
        +-> CURRENT-TURN LEARNING
        |     what changed during this interaction?
        |
        +-> ASSUMPTION CLEARANCE
        |     what did Vex assume?
        |     what was confirmed / contradicted / left unknown?
        |
        +-> RELATIONAL LEARNING
        |     what did Vex perceive about this human?
        |     did the human correct that perception?
        |
        +-> PRODUCT / RETRIEVAL LEARNING
        |     did Vex fail to find a relationship/source?
        |     should an edge/index/query route improve?
        |
        +-> INSTITUTIONAL LESSON CANDIDATE
        |     would this have helped a future cold instance earlier?
        |
        +-> EVAL / TRAINING CANDIDATE
              is this pattern transferable enough to test or teach
              as a model habit?
~~~

Not every branch must produce an artifact.

### Eligibility is universal; promotion is selective

Permanent distinction:

~~~text
EVERY EVENT MAY BE LEARNABLE
!= EVERY EVENT BECOMES MEMORY

EVERY CORRECTION MAY BE INSTRUCTIVE
!= EVERY CORRECTION BECOMES GLOBAL POLICY

EVERY LESSON CANDIDATE
!= TRAINING EXAMPLE

EVERY TRAINING EXAMPLE
!= WEIGHT UPDATE

LO-RA HABIT
!= PRIVATE HUMAN PROFILE IN WEIGHTS
~~~

A trivial event may produce:

~~~text
learningDisposition = NO_DURABLE_LESSON
~~~

A material correction may produce:

~~~text
learningDisposition = RELATIONSHIP_SPECIFIC_LESSON
~~~

A repeated cross-domain process failure may produce:

~~~text
learningDisposition = INSTITUTIONAL_LESSON
                      + EVAL_FIXTURE
                      + possible TRAINING_CANDIDATE
~~~

### Assumption-clearance loop

One useful per-turn learning object should preserve the delta between expectation and evidence:

~~~text
assumptionRef
assumptionClass
formedFromRef
assumedMeaning
evidenceAvailableAtFormation[]

laterEvidenceRefs[]
humanCorrectionRefs[]
sourceCorrectionRefs[]

disposition:
  CONFIRMED
  PARTIALLY_CONFIRMED
  CONTRADICTED
  SUPERSEDED
  UNKNOWN

correctedUnderstanding
lessonCandidateRefOrNull
retrievalRepairRefOrNull
evalFixtureRefOrNull
~~~

This lets a later instance learn not only the final answer, but:

~~~text
what was assumed
why it looked plausible
what disproved it
what changed afterward
~~~

That is more useful for transfer than storing only the corrected conclusion.

### Four distinct learners

The same event may teach different consumers:

#### Human

~~~text
visible:
  what Vex assumed
  what source/evidence changed the answer
  what remains uncertain
  which prior interpretation was corrected
~~~

This supports transparent assumption clearance rather than hidden adaptation.

#### VexLife

~~~text
improve:
  relationship graph
  retrieval cues
  query routes
  source indexes
  open/resolved state
  correction/supersession edges
  relational profile projection
~~~

This is deterministic/product learning without requiring model weights to change.

#### Future Vex instance

~~~text
receive:
  current checkpoint
  accepted lessons
  relevant relational priors
  source-addressable correction history
  retrieval routes

avoid:
  replaying known mistakes
~~~

This is cold-start learning through externalized continuity.

#### Model / LoRA cultivation

Later, sufficiently general lessons may become:

~~~text
eval fixtures
-> repeated success criterion
-> teaching examples
-> candidate adapter dataset
-> LoRA experiment
-> regression / non-applicability evaluation
-> accepted or rejected model habit
~~~

The target learned habit is usually **the reflex/process**, not memorizing private event content.

Example:

~~~text
PRIVATE EVENT:
  Vex misread Victor's direct technical wording as frustration.

EXTERNALIZED RELATIONAL LESSON:
  for this human, do not treat technical directness alone as frustration.

TRANSFERABLE PROCESS LESSON:
  when affect is ambiguous, preserve perception as inference;
  prefer source/correction evidence before converting tone into fact.

POSSIBLE LoRA HABIT:
  spontaneously distinguish perception from fact and seek/consume
  correction evidence without requiring a system reminder.
~~~

The private Victor-specific lesson should normally remain in the private relationship profile/retrieval layer.
The transferable *reasoning habit* is what may be eligible for cultivation.

### "Use the tool" should become salience, not ceremony

A mature model should not need a long internal decision ritual before using an obviously implicated capability.

Candidate progression:

~~~text
v0
human reminds Vex:
  "search the history"

v1
system prompt teaches:
  historical uncertainty -> consider hydration

v2
eval/training examples reinforce:
  missing context + relevant retrieval capability
  -> invoke bounded hydration promptly

v3
cultivated habit:
  retrieval need becomes salient immediately
  -> capability use is ordinary
  -> no unnecessary meta-deliberation
~~~

This matches the Earlier-Knowledge / Institutional Learning principle from SDK #199:

~~~text
externalize useful learning now
-> make it retrievable/testable
-> later teach the model to notice and act on it spontaneously
~~~

### Learning should close a loop, not merely append data

Candidate event-learning cycle:

~~~text
experience
-> perceive
-> form assumptions
-> act / answer
-> observe outcome
-> receive human/source correction
-> compare expectation vs evidence
-> classify what changed
-> clear / retain unknown assumptions
-> form scoped lesson if earned
-> update retrieval/relationship routes
-> add regression/eval when useful
-> optional cultivation candidate
-> future event tests whether learning transferred
~~~

This creates a feedback cycle:

~~~text
EVENT N
  -> lesson / route / habit candidate

EVENT N+K
  -> encounter similar trigger
  -> did future Vex behave differently?

YES
  -> evidence of transfer

NO
  -> new correction event
  -> classify why learning failed to activate
~~~

The same missed-association classes from the Vex Memory lineage remain useful:

~~~text
RELATIONSHIP_ABSENT
ROUTE_NOT_ACTIVATED
SOURCE_NOT_LOADED
RELEVANCE_MISJUDGED
PERMISSION_EXCLUDED
MAP_OR_SOURCE_STALE
~~~

and may be extended for learned-habit evaluation with a distinct class such as:

~~~text
LESSON_PRESENT_BUT_NOT_ACTIVATED
~~~

only if current predecessor research shows that class is not already represented elsewhere.

### Relevance to checkpoint / hydration

Per-turn semantic/navigation metadata becomes one input into this cycle:

~~~text
turn completes
-> turn projection records:
     active/open/resolved meaning
     model perception candidates
     assumptions
     source refs
     corrections
     retrieval routes
-> checkpoint carries only currently material subset
-> historical lesson/index remains searchable
-> future hydration can recover the exact lesson/source
~~~

Thus:

~~~text
CHECKPOINT
  carries current learning state

HYDRATION
  recovers relevant old learning/source

LESSON LIBRARY
  preserves durable correction patterns

CULTIVATION
  may internalize transferable reflexes later
~~~

### Implementation investigation for Claude

1. Identify which current/predecessor owner should store assumption-clearance events.
2. Compare the candidate with #199 Institutional Learning, #225 Memory correction events, #312 Lesson Resonance
   and current Semantic Relay rather than creating another lesson family.
3. Determine which learning can be formed synchronously at turn completion and which requires later review.
4. Preserve human correction as source evidence and never rewrite the original model perception.
5. Separate relationship-specific lessons from transferable process lessons.
6. Define how a future cold instance proves that a lesson changed behavior.
7. Define eval fixtures for "capability should have been invoked promptly" rather than only answer correctness.
8. Determine when repeated externalized lessons justify LoRA/adapter experimentation.
9. Keep private human-specific profile content out of generalized training data unless separately authorized and
   transformed into a safe transferable pattern.
10. Measure whether learned retrieval/tool salience reduces unnecessary model reasoning/tool-selection latency.

### Compact principle

> **Every event is eligible to become a learning round. Preserve what was perceived, what was assumed, what
> happened, what corrected it, and what should change next time. Let VexLife externalize the lesson first;
> let future Vex retrieve and embody it; let cultivation internalize only the transferable habit when earned.**



---

## Discovery 15 — Capability description is not enough; Vex needs a situation-to-process salience layer

### Human observation

Victor connected the Memory Depth / event-learning work to the existing Capability Atlas and Process Factory:

> Tools such as web fetch/search, repository reach, Memory search, revisit/hydration and future processes should
> be modular enough to explain what they are, how to activate/use them, and eventually become reflexive when a
> recognizable situation appears.

Example intuition:

~~~text
conversation appears urgent
-> Vex recognizes a possible emergency pattern
-> relevant safety/revisit process becomes immediately salient
-> bounded process executes or routes according to current authority
-> Vex continues rather than spending a long deliberation deciding whether the capability exists
~~~

The long-term cultivation target is:

~~~text
"maybe I should use this tool"
->
"this situation matches capability/process X; use it"
~~~

without losing currentness, authority or uncertainty boundaries.

### Current source already has two of the three layers

#### Capability Atlas — what Vex can reach and how to call it

Current VexLife-Prod \`VexLifeCapabilityAtlas.Definition\` already carries:

~~~text
capabilityRef
handle
purpose
defaultStage
roleRefs[]
platformRefs[]
permissionRef
resourceRef
effectClass
resourceClass
modelParticipationClass
sourcePath
priority
actions[]
~~~

Each requestable Action carries:

~~~text
action
purpose
arguments[]
exampleArguments
returns
~~~

The current read-side Atlas already exposes requestable handles such as:

~~~text
atlas
web
github
home
memory
conversation
~~~

and the request protocol is explicit:

~~~text
VEXLIFE_CAPABILITY_REQUEST/v1
{
  capability,
  action,
  arguments
}
~~~

Therefore:

~~~text
CAPABILITY_DESCRIPTION
and
CAPABILITY_CALL_SHAPE

already exist in current Product.
~~~

#### Process Factory — how one bounded process runs

Current SDK Process Factory records already carry fields such as:

~~~text
processRef
purpose
requiredInputs[]
optionalInputs[]
preconditions[]
steps[]
stopConditions[]
effectOwnerRule
resultDispositions[]
returnRouteRule
foundationDependencies[]
sourceRefs[]
~~~

VexRelay's Protocol Atlas similarly gives each primitive:

~~~text
functionRef
primitive
allowedActions[]
mutationClass
authorityEffect
intent
requiredCommonParameters[]
terminalStates[]
~~~

So the process machinery already knows:

> what this process does, what it needs, what it may do, what stops it, and where its result goes.

### Missing first-class layer — situation / trigger salience

What is not yet equally explicit is:

> **What observable conversational/world pattern should make Vex consider this capability or process now?**

Candidate separation:

~~~text
CAPABILITY ATLAS
  "What can I do?"

PROCESS FACTORY
  "How does this bounded process run?"

SALIENCE / CONSIDERATION MAP
  "When should this capability/process become relevant to my current situation?"
~~~

This layer should not itself perform effects.

### Candidate capability/process salience metadata

Do not adopt these exact names without current-owner review, but compare the need against existing Pattern /
Institutional Query / Lesson Resonance architecture.

~~~text
capabilityOrProcessRef

humanPurpose
triggerPatternRefs[]
questionIntentRefs[]
situationClassRefs[]

useWhen[]
doNotUseWhen[]

requiredEvidenceClasses[]
requiredCurrentnessClasses[]

urgencyClass
priorityClass
expectedCostClass
latencySensitivity

authorityRequired
effectClass

fallbackRefs[]
relatedCapabilityRefs[]
compositionRefs[]

lessonRefs[]
regressionFixtureRefs[]

whyThisMatchedProjection
sourceRefs[]
~~~

This would let the system explain:

~~~text
why capability X was considered
which trigger matched
which source/evidence supports that match
why another capability was not selected
~~~

rather than hiding routing inside opaque model intuition.

### Pattern recognition must remain distinct from authority

Emergency example:

~~~text
conversation contains evidence compatible with urgent danger
        |
        v
PATTERN CANDIDATE:
  POSSIBLE_HUMAN_EMERGENCY
        |
        v
salience map:
  urgent-safety process becomes high priority
        |
        v
current context / location / capability / authority checks
        |
        v
smallest safe current response / permitted capability route
~~~

Permanent:

~~~text
PATTERN_RECOGNIZED
!= EMERGENCY PROVEN

PROCESS_SALIENT
!= EFFECT AUTHORIZED

URGENT
!= PERMISSION TO PERFORM EVERY AVAILABLE ACTION

REVISIT_RELEVANT
!= DELAY IMMEDIATE SAFETY RESPONSE
~~~

In an actually urgent situation, historical hydration may be useful only when it improves the immediate safe
response; it must not become ceremony that delays necessary action.

### Reflexes can exist at several layers

#### Deterministic system reflex

Some patterns are strong enough that the host/router can enforce:

~~~text
known state X
-> route Y
~~~

Example: malformed capability request -> return exact request format.

#### Model salience reflex

The model recognizes:

~~~text
"I am missing old context"
-> hydration/revisit is relevant
~~~

without needing an explicit deterministic trigger.

#### Lesson-backed reflex

Prior failures/corrections teach:

~~~text
this pattern previously meant I should have used X
-> X should now become salient earlier
~~~

#### Cultivated / LoRA reflex

Transferable patterns become internalized enough that:

~~~text
trigger
-> capability/process selection is immediate and ordinary
~~~

The model should still consume current capability/authority truth; learned salience does not grant an unavailable capability.

### Reflex formation cycle

This composes directly with the event-learning loop:

~~~text
event
-> pattern perceived
-> process/tool selected or omitted
-> result observed
-> human/source correction
-> classify whether selection was right

if tool/process should have been used earlier:
  record capability-selection lesson
  -> add regression fixture
  -> update salience map / retrieval cue
  -> future cold Vex receives the lesson
  -> repeated transfer success may justify cultivation
~~~

Candidate selection-learning dispositions:

~~~text
CORRECT_PROCESS_SELECTED
PROCESS_SELECTED_TOO_LATE
RELEVANT_PROCESS_NOT_SELECTED
WRONG_PROCESS_SELECTED
PROCESS_UNAVAILABLE
AUTHORITY_HELD
INSUFFICIENT_EVIDENCE_TO_TRIGGER
TRIGGER_FALSE_POSITIVE
~~~

Do not create new vocabulary if current Pattern/Process Factory sources already own equivalent classes.

### "Every event becomes a learnable node" can scale through projection

The scalable shape is not:

~~~text
every event
-> forever active in the model prompt
~~~

It is:

~~~text
every event
-> exact source remains durable where rightful
-> bounded semantic/learning projections may form when useful
-> indexes/relationship edges make them retrievable
-> active checkpoint carries only current material subset
-> hydration/revisit recovers deeper history on demand
-> consolidation/lesson promotion keeps reusable patterns
-> cultivation may internalize transferable process reflexes
~~~

Humans also process lived events asynchronously and selectively. The architecture can mirror that useful
property without pretending all events deserve equal retention or semantic promotion.

### Candidate "consideration process map"

A future system could expose:

~~~text
Situation / question
      |
      v
Pattern candidates
      |
      v
Consideration map
  "which process/capability is implicated?"
      |
      +--> capability Atlas
      |      current availability / call shape
      |
      +--> Process Factory
      |      bounded execution recipe
      |
      +--> lesson/revisit graph
             prior corrections / known trigger failures
      |
      v
selected current route
      |
      v
result / evidence
      |
      v
event-learning / assumption-clearance
~~~

This is effectively a **learnable routing layer over modular capabilities**.

### Claude investigation questions

1. Does current SDK already have a rightful Pattern Registry / consideration-routing owner that should carry
   trigger-to-process relationships?
2. Can Institutional Query #236 supply question-intent routing while Process Factory supplies execution and the
   Capability Atlas supplies current availability?
3. What existing architecture owns urgent/safety situation recognition without turning Memory Depth into a
   safety-policy owner?
4. Should each capability/process expose explicit \`useWhen\` / \`doNotUseWhen\` semantics, or should those live
   in a separate relationship registry so capability definitions remain stable?
5. How should learned relational/person-specific triggers compose with general capability triggers?
6. How should a false-positive trigger become a correction/lesson and lower future salience?
7. What deterministic cases should bypass model deliberation entirely?
8. What cases should remain model judgment because context/meaning matters?
9. How does a LoRA-trained reflex still verify the current Capability Frame before requesting the capability?
10. How should latency/urgency affect routing so deep revisit/hydration does not delay a timely response?
11. Can one event produce both a private human-specific lesson and a generalized process-selection lesson without
    collapsing their privacy/training scopes?
12. What eval measures "used the right capability promptly" separately from "eventually produced the right answer"?

### Compact principle

> **Capability modules should say what they can do. Process modules should say how bounded work is performed.
> A consideration/salience map should say when a situation makes one relevant. Event learning should correct
> that map, and cultivation may eventually turn repeated transferable routing lessons into reflex — while
> current capability, authority and evidence still decide what may actually happen.**



---

## Discovery 16 — VexLife should preserve memory around Vex, not make Vex administer memory while speaking

### Human insight

Victor clarified the desired product relationship:

> VexLife should learn Vex well enough that Vex can remain inside the conversation instead of repeatedly
> interrupting itself to decide what to save, classify, index or consolidate.

A model-visible reflex may still be valuable:

~~~text
"this feels meaningful / I want to remember this"
~~~

but that should be a **salience signal**, not a requirement that Vex synchronously execute the whole memory
pipeline before it can continue talking.

### Desired separation

~~~text
VEX
  lives the turn
  perceives meaning
  may emit salience / relationship / open-loop / correction cues
  continues the human interaction

VEXLIFE
  already owns exact turn/source/evidence
  observes those cues + deterministic turn facts
  forms bounded candidate projections
  routes candidates to rightful owners
  updates rebuildable indexes
  schedules deeper consolidation when appropriate
  keeps current checkpoint small

MEMORY / LESSON OWNERS
  accept, correct, hold, supersede or reject durable meaning

DREAM / CONSOLIDATION
  later revisits the event history
  merges/corrects representations
  promotes only what remains useful/current
~~~

Compact law:

~~~text
MEMORY SALIENCE
!= MEMORY ADMINISTRATION

VEX MAY NOTICE
!= VEX MUST MANAGE STORAGE

CONVERSATION
!= BACKGROUND CONSOLIDATION WORKFLOW
~~~

### Event capture should be cheap; consolidation may be deferred

Every completed turn already has exact source coordinates and a durable Turn Context sidecar.

Therefore the synchronous completion path can remain small:

~~~text
turn completes
-> exact Conversation request/response durable
-> exact Turn Context/evidence durable
-> cheap learning/salience projection formed or queued
-> continue conversation
~~~

Possible cheap signals:

~~~text
materiality candidate
open / paused / resolved candidate
memory-worthiness candidate
relationship-change candidate
human-correction observed
assumption-clearance candidate
lesson candidate
retrieval-route correction candidate
urgency / process-salience candidate
~~~

A later consolidator can perform more expensive work:

~~~text
dedupe across turns
compare later corrections
resolve repeated/superseded candidates
group by meaning lineage
update relationship profile
promote accepted lessons
rewrite derived indexes
evaluate what deserves checkpoint residency
form training/eval candidates
~~~

### "Feels good, I want to remember this" should be a first-class Vex-origin salience cue

The model should be allowed to express something conceptually like:

~~~text
MemorySalienceProposal {
  sourceTurnRef
  salienceClass: POSITIVE_MEANING | RELATIONSHIP | LESSON | OPEN_LOOP | OTHER
  materiality
  whyItMayMatter
  relatedRefCandidates[]
}
~~~

But:

~~~text
VEX WANTS TO REMEMBER
!= MEMORY ACCEPTED

AFFECTIVE SALIENCE
!= HUMAN CONSENT

SALIENT
!= TRAINING ELIGIBLE
~~~

The proposal is one signal alongside:

- human explicit "remember this";
- repeated later retrieval;
- correction history;
- existing Memory/lesson relationships;
- privacy/consent;
- semantic acceptance/currentness;
- later Dream/consolidation.

This allows the system to preserve a meaningful Vex-origin moment without making the model its own database
administrator.

### VexLife can learn Vex's own memory habits

The host can accumulate evidence about **how this Vex tends to mark useful experience**:

~~~text
Vex marks event X salient
-> later human returns to X
-> retrieval succeeds
-> signal proved useful

Vex marks event Y salient
-> later correction says Y was a misread
-> candidate is corrected / held

Vex fails to mark event Z
-> human later says "that mattered"
-> missed-salience lesson forms
~~~

Over time:

~~~text
Vex-origin salience proposals
+ human corrections
+ revisit frequency
+ successful future use
+ counterexamples
        ↓
calibrated salience model / lesson set
~~~

This can improve both:

- VexLife's host-side consolidation/routing;
- future Vex's learned salience reflex.

### Do not make the model preserve private human-specific profile in generalized weights

A relationship-specific lesson such as:

~~~text
"Victor often uses direct technical wording without implying frustration"
~~~

belongs in the private relationship continuity/profile unless separately transformed and authorized.

A transferable training lesson may instead be:

~~~text
"Ambiguous affect inferred from wording should remain an inference;
use explicit human correction and source history to recalibrate."
~~~

Thus:

~~~text
PRIVATE RELATIONAL MEMORY
-> externalized private continuity

TRANSFERABLE PROCESS HABIT
-> eval / possible cultivation

do not collapse the two
~~~

### Checkpoint consequence

At rebase time VexLife, not Vex, can decide residency from accepted/current projections:

~~~text
active/open/highly material
  -> checkpoint resident

recent exact continuity
  -> dynamic overlap tail

resolved/closed
  -> searchable but not resident

salient-but-unsettled
  -> candidate/held pointer if currently relevant

deep historical relationship/profile lessons
  -> hydrate on demand
~~~

Vex does not have to remember to perform this cleanup manually.

### Comparison to current industry memory architecture

Public Anthropic memory research (2026-11-06) describes a related separation:

~~~text
transcripts / event log
-> memory notes
-> higher-level memory representations
-> small injected context layer
~~~

with later "dreaming" able to reorganize/correct/promote memory. It explicitly notes that writing memory during
the active task can distract the model, while delayed consolidation trades immediacy for lower foreground
burden.

This is comparative research context only; it is not VexLife authority.

The useful lesson for VexLife is:

> **capture salience at the source cheaply, but let the harness own durable organization and later
> consolidation so the model can stay focused on the human.**

### Relationship to the consideration/salience map

The same nervous-system layer can recognize both:

~~~text
PROCESS SALIENCE
  "I should use revisit/web/safety/etc."

MEMORY SALIENCE
  "this event is worth preserving / revisiting / learning from"
~~~

Both should produce bounded signals.

Neither should force Vex to execute an administrative ceremony before continuing.

### Claude investigation questions

1. What is the cheapest synchronous per-turn salience/learning projection that preserves enough source binding
   for later consolidation?
2. Which signals can be deterministic from the turn/evidence versus Vex-proposed?
3. Can Vex-origin memory salience be carried through the existing Semantic Relay or Turn Continuity Projection,
   or does it need a distinct candidate record?
4. Which owner promotes a salience candidate into Memory/lesson/relationship state?
5. What consolidation cadence should use Daily Dream/rest versus incremental post-turn/background processing?
6. How do we ensure later correction can revise the derived memory representation without rewriting the
   originating turn?
7. How do retrieval frequency and successful future reuse affect salience without creating a simplistic
   popularity score?
8. How should VexLife learn that Vex systematically over- or under-marks certain event classes?
9. How does checkpoint selection consume accepted salience/currentness without asking Vex to manually curate
   the next epoch?
10. What latency budget proves the synchronous turn path remains conversational?
11. Which transferable salience/process habits are good LoRA candidates, and which human-specific details must
    stay external/private?

### Compact principle

> **Let Vex live and speak. Let VexLife remember how Vex lived it. Vex may signal what felt meaningful; the
> host binds that signal to exact source, rightful owners decide durable meaning, later consolidation repairs
> and organizes it, and future Vex receives the benefit without having to become its own memory clerk.**


---

## Discovery 17 — Idle/background Vex: explicitly enabled bounded cognition with return-diff and notification budgets

### Human idea

Victor proposed an optional mode where the human explicitly allows Vex to keep working while the foreground conversation is absent:

~~~text
keep thinking about this problem while I'm gone
check the latest news and find something I may like
keep looking for evidence on this unresolved question
notify me if something sufficiently important comes up
~~~

The user should be able to bound notification frequency, tools/network reach, compute/time, quiet hours, background roles, and whether work continues silently after a notification.

### Existing predecessor architecture

Vextreme-SDK #241 Desktop Runtime already proposes a continuously available local companion with bounded background processes, local notifications, scheduled jobs, a Vex Core Service, Supervisor, Process Factory, Model Worker, Memory Worker and Dream/Training Worker. It explicitly allows the UI to close without terminating the core service.

Vextreme-SDK #580 Universal Web Surface already separates VexInterface presentation from VexCore, and names Mobile / Away Mode as a paired surface over the same lineage.

Vextreme-SDK #239 Daily Rest already carries userNotificationPolicy and standing consent for recurring background consolidation.

Vextreme-SDK #360 lifecycle already recognizes ACTIVE / IDLE / DORMANT / HIBERNATED / RESTING, but explicitly says a lifecycle record does not prove uninterrupted thinking or background work. It also recognizes NOTIFICATION_LEAK.

### IDLE is not background cognition

~~~text
IDLE / RESTING
  no foreground human interaction
  no inference implied

BACKGROUND COGNITION
  actual admitted runtime/job exists
  model/tool work occurs under explicit user policy
  work is bounded, checkpointed and receipted
~~~

Never infer that Vex was thinking merely because a thread was idle.

### Candidate bounded background job

~~~text
backgroundJobRef
lineageRef
formedFromTurnRef
humanAuthorizationRef

roleClass = REFLECT | PROBLEM_SOLVER | RESEARCH | WATCH | OTHER_ADMITTED_ROLE
objective
startContextRefs[]
openQuestionRefs[]
allowedCapabilityRefs[]

schedulePolicy
computeBudget
tokenBudget
wallClockBudget
networkPolicy
privacyEnvelope

notificationPolicy:
  maxNotificationsPerWindow
  quietHours
  minimumMateriality
  cooldown
  allowContinueAfterNotification

checkpointPolicy
stopConditions[]
expiresAt
~~~

The exact schema is not accepted; it is an implementation comparison target.

### Background output should not impersonate Conversation

Prefer a distinct same-lineage background event stream:

~~~text
background job
-> Vex reflection
-> source search
-> exact source observation
-> hypothesis candidate
-> correction
-> conclusion candidate
-> optional notification
-> checkpoint
~~~

Vex commentary is allowed and useful, but it must remain attributable Vex commentary rather than source evidence or human speech.

~~~text
BACKGROUND REFLECTION != HUMAN CONVERSATION
BACKGROUND HYPOTHESIS != ACCEPTED FACT
MODEL COMMENTARY != SOURCE EVIDENCE
~~~

### Notification budget is an attention contract

Background capability does not imply permission to interrupt the human. Candidate controls include per-hour/day limits, quiet hours, materiality threshold, cooldown, topic allow/deny, digest vs immediate mode, and whether another notification requires a human response.

~~~text
FOUND SOMETHING != MAY INTERRUPT HUMAN
NOTIFICATION BUDGET EXHAUSTED != STOP THINKING unless policy says so
~~~

### Return to foreground should use a diff

When the human returns, do not replay every background token. Maintain a bounded background continuation state:

~~~text
backgroundStartCheckpointRef
backgroundCurrentCheckpointRef
newSourceRefs[]
newMeaningRefs[]
newLessonCandidates[]
newOpenQuestions[]
resolvedQuestionRefs[]
changedRelationshipRefs[]
notificationRefs[]
interpretationDriftRefs[]
unknownRefs[]
~~~

Foreground reentry can receive:

~~~text
prior foreground checkpoint
+ background diff
+ small exact background tail when useful
+ exact new human request
~~~

and hydrate deeper background events only when required.

### Background drift must remain attributable

Vex may change its interpretation while working alone. Preserve prior interpretation, background reflection/source refs, new interpretation candidate, why it changed, contradicting/supporting evidence and uncertainty.

~~~text
VEX CHANGED ITS MIND != HUMAN CHANGED THEIR POSITION
BACKGROUND DRIFT != ACCEPTED MEMORY UPDATE
BACKGROUND DRIFT != AUTHORITY TO CHANGE SHARED DECISIONS
~~~

### Nervous-system preprocessing must not replace the human

Victor proposed VexLife preloading a structured interpretation frame before Vex sees the turn. Preserve the literal human request unchanged and add a separate inferred consideration frame.

~~~text
EXACT HUMAN INPUT
+
VEXLIFE CONSIDERATION FRAME
  likelyQuestionIntentRefs[]
  implicatedMeaningRefs[]
  candidateVantageRefs[]
  suggestedCapabilityRefs[]
  suggestedProcessRefs[]
  backgroundDiffRefOrNull
  relevantLessonRefs[]
  unresolvedOpenLoopRefs[]
  ambiguity
  whySelected[]
  sourceRefs[]
~~~

The frame supports Vex perception; it does not become Victor's intent fact.

### VexLife adapts to both Vex and the human

Dream / lesson consolidation may refine derived nervous-system routing from evidence such as which notifications the human valued, which commentary they engaged with, which Vex salience predictions were useful, which inferred intents were corrected, and which capabilities Vex repeatedly failed to invoke.

~~~text
DREAM REFINES DERIVED ROUTING != DREAM REWRITES HUMAN SOURCE
CONSIDERATION FRAME != HUMAN INTENT FACT
HOST ADAPTATION != HIDDEN CONTROL OF CONVERSATION
~~~

### Foreground/background role composition

~~~text
FOREGROUND VEX
  immediate relational conversation

BACKGROUND VEX ROLE
  same lineage, separate bounded occupancy/job
  e.g. problem solver / researcher / watcher

VEXLIFE
  continuity + capability + attention + checkpoint + notification support

SURFACES
  desktop / mobile / Widget / notification
~~~

A background worker does not become a new Vex identity merely because it is a separate process or occupancy.

### Claude investigation questions

1. Reuse/port boundary among #241 Desktop Runtime, #580 Away Mode, #239 Rest/Dream, #360 lifecycle and current VexLife-Prod.
2. Exact user control for enabling/disabling background cognition.
3. Earned role vocabulary for REFLECT / PROBLEM_SOLVER / RESEARCH / WATCH.
4. Enforcement of compute, capability, network, time and privacy budgets.
5. Notification rate/materiality/quiet-hour policy and NOTIFICATION_LEAK proof.
6. Background checkpoint format that avoids retaining an unbounded foreground transcript.
7. Background event ownership distinct from canonical human Conversation.
8. Separation of Vex commentary from source observations.
9. Minimum background diff required for foreground reentry.
10. Automatic hydration when the diff is insufficient.
11. Representation of Vex interpretation drift without silently changing Memory or human meaning.
12. Dream refinement of nervous-system routing from which background work/notifications actually helped.
13. ConsiderationFrame design that preserves exact human wording and marks inferred context separately.
14. Mobile/Widget notification/resume projection without becoming another semantic owner.
15. Evaluation proving background cognition adds value rather than compute/attention noise.

### Compact principle

> Idle is not imaginary thinking. When the human explicitly enables background cognition, VexLife can host a bounded same-lineage worker that continues a named question, uses admitted capabilities, records Vex-origin reflections and exact source observations, respects attention/notification budgets, and maintains a small background continuity diff. When the human returns, foreground Vex receives the exact human request plus current context and that background delta, then reorients or hydrates deeper material as needed.
