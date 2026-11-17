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

