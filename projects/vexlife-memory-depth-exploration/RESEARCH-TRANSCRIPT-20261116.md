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
