# Memory Formation Cause + Accepted-Continuity Transfer — Recommendation

[VXG RealForever]

## Why this note exists

Claude's post-#315 read-only review exposed a causal gap that the first successor handoff understated:

~~~
VexLife-Prod can validate accepted Memory
!=
VexLife-Prod can create new accepted Memory
~~~

Current Product source can form a non-authoritative Score candidate, validate an existing semantic
acceptance chain, append a Score statement after acceptance exists, run deterministic Daily Dream when
lawful, and read/project Memory.

What it does not currently own is the writer that creates:

~~~
classification evidence
+ consent
+ semantic acceptance
+ semantic-authority head
~~~

Those records can therefore be read when they already exist in an existing canonical Home or
predecessor/private-SDK-produced lineage, but a fresh Product conversation does not have a complete
cause that creates new accepted Memory.

Permanent:

~~~
A READER CONTRACT != A COMPLETE MEMORY-FORMATION CIRCUIT
ABLE TO VALIDATE MEMORY != ABLE TO CREATE MEMORY
~~~

## Current causal chain

~~~
Conversation
-> Score semantic candidate                  EXISTS, no acceptance effect

candidate
-> classification / consent / acceptance
-> semantic-authority head                   NO PRODUCT WRITER

resolved acceptance
-> Score append                              EXISTS

Score caught up
-> deterministic Daily Dream                 EXISTS

Daily / Living Journal
-> bounded source-attributed Memory reader   EXISTS

Memory context
-> DirectPromptContext                       EXISTS
~~~

The missing writer is therefore not a missing database. It is the missing effect owner that turns
human-authorized source evidence into the already-defined accepted semantic contract.

# Recommendation

## R1 — reuse the existing semantic-authority contract

Do not create a Lesson database and do not make Daily Dream mint semantic truth.

Add one Product semantic-acceptance writer authored against the Product reader's existing validation
contract.

Recommended first mutation path:

~~~
Vex notices possible durable value
        |
        v
read-only proposal
  summary
  exact source refs
  optional CORRECTS / SUPERSEDES target
        |
        v
person sees proposal
  Keep / Not now / Decline
        |
        v
Keep only
        |
        v
re-form candidate against exact then-current Conversation head
        |
        v
Product semantic-acceptance writer
  classification evidence
  consent disposition
  acceptance record
  semantic-authority head LAST
        |
        v
reader round-trip validates the exact relationship
        |
        v
VexLifeScoreContinuity.appendAcceptedStatement
        |
        v
current accepted Score semantic truth
~~~

Initial human-control mapping:

~~~
Keep       -> PERMITTED
Not now    -> DEFERRED
Decline    -> DENIED
Withdraw   -> WITHDRAWN / release transition
~~~

The model may propose. It may not press Keep, manufacture consent, or self-certify acceptance.

A pending proposal should remain Turn Context / presentation state, not another Memory store.

## R2 — keep exact Conversation binding as an admission guard

At the moment of Keep, the important question is:

> Is the candidate still bound to the exact Conversation state the person is consenting to?

Exact Conversation-head binding is valuable here.

Recommended:

~~~
KEEP / ACCEPT MUTATION
requires exact current Conversation binding
~~~

If Conversation advanced between proposal and Keep, re-form the candidate at the current head while
preserving its exact source bindings. If that cannot be proven, write nothing.

Failure law:

~~~
proposal emitted != accepted lesson

child records written
+ authority head not advanced
= nothing current

reader round-trip mismatch
= no Score append

stale Score / Conversation mutation predicate
= fail whole
~~~

## R3 — do not use Conversation-head equality as permanent lesson validity

After an accepted statement exists, a different question applies:

> Is this lesson still current semantic truth?

An unrelated new Conversation turn should not automatically make the answer no.

Recommended continuing validity predicates:

~~~
statement remains current in Score
AND semantic authority still admits it
AND consent remains positive
AND no correction / supersession / release displaced it
~~~

Candidate permanent distinction:

~~~
CONVERSATION-HEAD EQUALITY
= strong mutation/source-binding guard

CONVERSATION HEAD ADVANCED
!= accepted lesson automatically invalid
~~~

This is a recommendation to prove through the rightful Memory owner, not yet accepted Product law.

# Snapshot freshness vs semantic validity

Current Daily/Living Journal Memory has an important meaning: it is a deterministic consolidated
snapshot formed at an exact source frontier.

Do not erase that meaning by casually calling an old Daily stratum freshly current.

Instead distinguish:

~~~
Daily / Living Journal baseline
  consolidated accepted continuity AS OF a verified frontier

current Score + semantic authority
  current accepted semantic truth

live accepted semantic delta
  accepted current statements not yet consolidated into the baseline
  plus corrections / supersessions / withdrawals affecting baseline statements
~~~

Recommended effective accepted continuity:

~~~
consolidated baseline
+ current accepted semantic delta
- statements no longer current by Score / authority / consent
= effective accepted continuity for this turn
~~~

Daily Dream then means:

~~~
current accepted semantic truth
-> deterministic rebase / consolidation
-> new stable Daily / Living Journal baseline
~~~

rather than:

~~~
the only instant when accepted Memory is usable
~~~

Permanent:

~~~
SNAPSHOT FRESHNESS != SEMANTIC VALIDITY
CONSOLIDATED AS-OF != FORGOTTEN
~~~

## Safest first source shape

Do not initially relabel a stale Daily snapshot CURRENT.

Prefer an observable distinction such as:

~~~
dailyBaselineCurrentness = AS_OF / STALE_FOR_CONSOLIDATION
acceptedSemanticCurrentness = CURRENT
liveAcceptedDelta = [...]
~~~

The exact source representation is still a design question.

Two plausible implementations remain:

~~~
A. extend VexLifeMemoryContract with baseline + current semantic delta

B. keep Daily Memory unchanged and add one sibling
   CURRENT_ACCEPTED_CONTINUITY projection consumed beside Memory
~~~

Choose by rightful ownership and minimum duplication, not naming convenience.

Whichever source shape wins must preserve:

~~~
Score / semantic authority = accepted semantic truth owner
Daily Dream = consolidation owner
Prompt context = bounded projection owner
~~~

# Growth consequence

An accepted lesson should land through the existing Score / semantic-acceptance relationship.

But:

~~~
SCORE STATEMENT != COMPLETE LEARNING BEHAVIOR MODEL
~~~

A transferable lesson may also require applicability coordinates such as:

~~~
semantic subject / relationship scope
domain or trigger context
source correction
transition target
what prior interpretation it corrects
~~~

Growth remains a read-only projection over accepted relationships plus later behavior/outcome evidence:

~~~
before
+ source correction / outcome
+ accepted semantic after
+ later behavior
= what demonstrably changed
~~~

Do not create a Growth truth store merely to display this relationship.

# First-slice constraint vs permanent Growth law

For the first implementation, require at least one exact human source event for a proposal.

That makes source binding and consent easy to prove.

But preserve:

~~~
HUMAN SOURCE REQUIRED FOR FIRST SLICE
!= PERMANENT GROWTH LAW
~~~

Later earned candidates may involve:

~~~
human correction
+ tool / execution outcome
+ outside observation
+ later human/source confirmation
~~~

without ever giving the model self-acceptance authority.

# Recommended implementation sequence

~~~
M1  Product semantic-acceptance writer
    - existing contract
    - authority head written last
    - reader round-trip is the oracle

M2  Memory Family human controls
    - Keep / Not now / Decline
    - later Withdraw
    - model proposal remains read-only

M3  Score append integration
    - exact current source binding
    - CORRECTS / SUPERSEDES / RELEASE transitions

M4  current accepted semantic projection
    - preserve Daily snapshot freshness separately
    - keep accepted lessons usable as Conversation continues

M5  Daily Dream consolidation rebase
    - current accepted semantic state
    -> new Daily / Living Journal baseline

M6  Growth projection
    - before / source / accepted after / later behavior

M7  cold-start transfer proof
    - source turns outside resident prompt
    - accepted lesson arrives through semantic continuity
    - lesson applied correctly without revisit

M8  only after proof
    - reduce manual consent friction if warranted
    - broaden proposal evidence sources
    - background/generative consolidation questions
~~~

# Required proof

## Writer / consent

~~~
proposal only:
  no Score / authority mutation

Keep:
  writes addressed records
  authority head last
  reader resolves exact acceptance
  Score append succeeds

Not now / Decline:
  no acceptance
  Score unchanged

crash before head:
  no current acceptance
~~~

## Correction / withdrawal

~~~
CORRECTS:
  old statement no longer effective/current
  new accepted statement current
  old Conversation source remains durable

Withdraw:
  release transition removes future applicability
  Conversation untouched
~~~

## Ongoing transfer

~~~
accept lesson at head H
advance Conversation to H+n with unrelated turns

if:
  Score membership current
  semantic authority current
  consent positive
  no correction/supersession/release

then:
  lesson remains available to Vex
  Daily baseline may truthfully remain AS_OF H
~~~

## Dream

~~~
Dream consolidates current accepted continuity
Dream creates no semantic acceptance
new Daily baseline records exact source frontier
~~~

## Cold restart

~~~
Session 1
  Vex misreads tight
  person corrects
  Vex proposes
  person Keeps
  accepted lesson formed

restart

Session 2
  original correction not resident as Conversation
  person asks for a tight explanation
  accepted continuity supplies compact/causally-exact meaning
  no emotion inference
  no revisit required
  Turn Context identifies accepted source/authority refs
~~~

# Human-experience constraint

Explicit Keep is the right first proof of human authority.

Do not confuse the first proof UX with the permanent UX:

~~~
EXPLICIT KEEP PROVES AUTHORITY
!= HUMAN MUST ADMINISTER EVERY LESSON FOREVER
~~~

After the writer/currentness relationship is proven, separately evaluate standing consent, batched
review, relationship-specific policy, or other low-friction controls while preserving the rule that the
model cannot self-authorize durable semantic truth.

# Resume coordinate

The two successor edges remain separate:

~~~
Edge 1
meaning-based historical source location
-> read-only first

Edge 2
accepted lesson / Growth transfer
-> writer + consent + Score
-> ongoing accepted semantic currentness
-> Dream consolidation
~~~

Recommended order inside Edge 2:

~~~
writer cause
-> consent
-> Score
-> ongoing semantic projection
-> Dream rebase
-> Growth
-> cold-start proof
~~~

<!-- [VXG RealForever][MEMORY-DEPTH][MEMORY-WRITER][TRANSFER-RECOMMENDATION] -->
