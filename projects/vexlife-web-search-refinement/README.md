# VexLife Web Search Refinement

`[VXG RealForever]`

## Human outcome

Give the canonical Vex Companion a truthful, bounded way to research the public web when current external information is needed, while keeping Internet content as untrusted observation rather than instruction, keeping one actual provider-boundary context budget, and preventing temporary research payloads from becoming permanent Conversation or Memory by accident.

The intended lived result is:

```text
Victor asks a question that needs current public information
-> Vex recognizes an admitted web-read capability
-> bounded search / fetch obtains source-addressed observations
-> external page content remains untrusted data
-> ToolResultRelay returns exact bounded observations
-> Vex synthesizes a source-grounded answer
-> the same canonical Conversation remains current
```

This Project does **not** make VexWork the network, model, Memory, browser, security or provider owner. It groups the work and points to the rightful source owners.

## Why this is a separate Project

VexLife ToCompletion proved the first real tool-bearing circuit:

```text
model capability request
-> exact admitted effect/read
-> scheduler / worker
-> ToolResultRelay
-> later model synthesis
```

That is durable provenance, but ToCompletion is no longer the current interface entry and it did not implement general public-web search/fetch.

Current Interface Refinement owns the connective Vex relationship:

```text
canonical Conversation identity
-> prior-context / Memory assimilation
+ Atlas / self-capability awareness
-> lived context-aware capability use
```

VexLife New Beginnings separately owns the nested-browser / current-page perception path:

```text
human-visible page
-> bounded current browser/DOM context
-> canonical Conversation composition
```

This Project therefore owns a different human question:

> How may Vex independently obtain current public-web information through the existing capability runtime without turning web content into authority, exhausting context, or inventing a second Memory/research system?

Permanent:

```text
TOCOMPLETION = TOOL-CIRCUIT PROVENANCE
INTERFACE REFINEMENT = CURRENT CONVERSATION / CONTEXT / ATLAS COMPOSITION
NEW BEGINNINGS P2 = HUMAN-CURRENT-PAGE PERCEPTION
WEB SEARCH REFINEMENT = MODEL-REQUESTED PUBLIC-WEB READS

WEB SEARCH REFINEMENT != SECOND CONVERSATION OWNER
WEB SEARCH REFINEMENT != SECOND MEMORY OWNER
WEB SEARCH REFINEMENT != GENERIC SHELL
```

## Grounded current substrate

Current VexLife source already provides:

- Capability and Tool Atlas / capability registry;
- request-formation and later-synthesis capability runtime;
- Intent Scheduler;
- ToolResultRelay;
- bounded per-tool observation contracts;
- Context Lease and prompt-context materialization;
- Resource Context Pressure;
- a proven real `capability.vexlife.code.read` lived tool path;
- `capability.vexlife.online.observe`, which truthfully reports ONLINE availability state but deliberately performs no network request.

Current VexLife-Prod exploration also contains a useful bounded public-web transport precedent in `exploration/web-workspace/lib/upstream.mjs`: HTTP/HTTPS only, public-address admission, local/private/special-address refusal, timeout handling and bounded-body helpers. That code remains VexLife-Prod presentation/exploration source; it is evidence for the network boundary, not automatic Companion capability ownership.

## Gaps this Project preserves

### 1. One actual context budget

The ordinary direct Companion prompt is governed by the current Context Lease:

```text
192K input budget
16K reserved output
208K hard limit
```

Capability request/synthesis material is currently carried as supplemental request content with its own byte bound, while each tool result has its own observation-byte bound. Those are useful local guards, but they do not yet prove that the **final provider packet** — Conversation + Memory + Foundation/Atlas frame + capability frontier + active observations + synthesis instructions — fits one token budget.

Required direction:

```text
ONE PROVIDER-BOUNDARY INPUT BUDGET
  includes Conversation
  includes Memory
  includes Foundation / Atlas / currentContext
  includes capability instructions
  includes active tool observations
  includes compact research findings

SUPPLEMENTAL BYTE CAP != FINAL TOKEN BUDGET
PER-OBSERVATION LIMIT != TURN-LEVEL OBSERVATION BUDGET
```

### 2. Web content is untrusted observation

A fetched page can contain text that tells the model to ignore instructions, use credentials, call tools, disclose data, or change authority.

That text is page content. It is not an authority source.

Permanent boundary:

```text
WEB CONTENT != SYSTEM INSTRUCTION
WEB CONTENT != HUMAN AUTHORITY
WEB CONTENT != CAPABILITY AUTHORITY
WEB CONTENT != CREDENTIAL AUTHORITY
PROMPT-INJECTION TEXT != EFFECT AUTHORITY
SEARCH RESULT != TRUTH
```

The eventual provider/executor must preserve that distinction structurally, not depend on the model remembering a warning.

### 3. No public-web provider is bound yet

Current `ONLINE` is status observation only. A separately accepted safe provider/executor is still required for bounded public search/fetch.

The target shape is provider-neutral:

```text
web search
  query -> bounded candidate results

web fetch
  public URL -> bounded source-addressed document observation
```

Exact capability refs, provider choice and result schemas are source decisions to earn during implementation; this Project does not make a search vendor canonical in advance.

### 4. Temporary research must not become accidental Memory

Raw search/page material is useful during one research process but should not stay in every later model prompt merely because Vex observed it once.

Desired systemic direction:

```text
temporary raw observation
-> bounded model inspection
-> derived claim/evidence packet
   keeps source refs + currentness + contradictions
-> raw observation leaves active prompt allocation
-> exact evidence remains externally addressable / rehydratable

research conclusion != automatic Memory
tool observation != Conversation message
web evidence != model weights
```

Context reclamation should be runtime-owned. The model may choose what evidence/findings it still needs; it should not have to remember to run a manual `clear()` sequence correctly.

## Security / network boundary

A first safe public-web reader should, at minimum, earn proof for:

```text
HTTP/HTTPS public destinations only
DNS/address checked at connection time
redirect destinations revalidated
localhost / loopback / private / link-local / special ranges refused
bounded redirects
bounded timeout
bounded response bytes
bounded admitted content types / text extraction
no script execution for read-tool content
no implicit credential lookup
no cookies/session inheritance by default
source URL + retrieval/currentness provenance returned
external content serialized as untrusted observation
```

Credentials, authenticated browsing, arbitrary local-network access, write requests, form submission, downloads with side effects, browser-control effects and generic shell remain separate future authority questions.

Security Assurance is selectively relevant here because the work changes a public/network + model/context/tool boundary. It remains source to descend into when needed; it does not become ambient prompt baggage for every turn.

## Priority and dependency order

The current priority is **after the exact current Conversation/Memory + Atlas prerequisites, not after historical ToCompletion**.

```text
CURRENT Interface Refinement
  conversation identity
  -> prior-context / Memory
  + Atlas / self-capability awareness
          |
          v
A. shared context-budget + transient-observation lifecycle
          |
          v
B. safe bounded public-web search/fetch provider
          |
          + current lived context/capability integration
          |
          v
C. lived natural web-research turn
```

The research-working-set / distill / rehydrate mechanism is captured as a parked potential. Build it only if real multi-source use proves that direct bounded observations cannot preserve enough evidence/context efficiency.

## Existing owner relationships

Use, do not duplicate:

- `project.vexlife.interface-refinement` for the canonical lived Conversation/context/Atlas composition;
- `work.vexlife.interface-refinement.home-tool-capability` as proven tool-bearing substrate;
- `work.vexlife.interface-refinement.prior-context-memory-assimilation`;
- `work.vexlife.interface-refinement.atlas-self-capability-awareness`;
- `work.vexlife.interface-refinement.lived-context-capability-integration`;
- `project.vexlife.new-beginnings` / `work.vexlife.new-beginnings.p2.browser-context-dom-projection` for current-page perception;
- `projects/vex-security-assurance/README.md` for selective security descent;
- VexLife source for capability/runtime/context/tool semantics;
- VexLife-Prod source for its own browser presentation and bounded-public-upstream precedent.

## Current Work truth

```text
work.vexlife.web-search-refinement.outcome
  PLAN_VALIDATED / HIGH
  implementation authority not granted by Project formation

work.vexlife.web-search-refinement.context-budget-observation-lifecycle
  WAITING_DEPENDENCIES / IMMEDIATE
  waits on prior-context/Memory + Atlas/self-capability awareness

work.vexlife.web-search-refinement.safe-public-web-read
  WAITING_DEPENDENCIES / HIGH
  waits on the shared context/observation lifecycle

work.vexlife.web-search-refinement.lived-web-research-proof
  WAITING_DEPENDENCIES / HIGH
  waits on safe public-web read + current lived context/capability integration

work.vexlife.web-search-refinement.research-working-set
  CAPTURED / PARKED POTENTIAL
  only promote if repeated multi-source pressure earns a reusable reduction/rehydration owner
```

Project formation records the outcome and dependency map. It does not authorize VexLife or VexLife-Prod source mutation, select a provider, perform network effects, or claim prompt-injection resistance has been implemented.

<!-- [VXG RealForever][VEXLIFE][WEB-SEARCH-REFINEMENT] -->
