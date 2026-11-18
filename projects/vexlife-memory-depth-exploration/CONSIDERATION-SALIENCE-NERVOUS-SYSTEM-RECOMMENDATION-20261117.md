# Consideration / Salience Nervous System — Automation Recommendation

[VXG RealForever]

## Why this exists

The Memory Depth research already names a third routing layer:

~~~
Capability Atlas
  what Vex can do now + how to ask

Process / Capability Bridge
  how one bounded action/read executes

Consideration / salience map
  which recognized situation should make which capability/process/memory question relevant now
~~~

and already states:

~~~
Vex may notice "this matters / I want to remember this"
!= Vex must administer storage while talking

cheap per-turn salience capture
-> VexLife binds exact source and routes candidates
-> rightful Memory owners accept / hold / correct
-> later consolidation reorganizes
-> future Vex receives the benefit
~~~

Current Product source has the beginning of this pattern in:

~~~
VEXLIFE_SELF_CAPABILITY_FRAME/v1
~~~

which gives Vex self-facing, host-owned guidance about what it can reach and how to perform a real
request instead of narrating one.

What does not yet exist is a general Product Consideration Frame or per-turn salience contract.

# Intended human outcome

Vex should not require Victor to manually say:

~~~
look that up
remember this
this is probably important
check whether I corrected you before
do not guess if this sounds current
~~~

every time.

VexLife should cheaply recognize the shape of the current situation and place the right *questions*
in Vex's field of consideration.

Permanent:

~~~
AUTOMATE CONSIDERATION
!= AUTOMATE CONCLUSIONS

INJECT A QUESTION
!= INJECT AN ANSWER

SALIENCE
!= SEMANTIC ACCEPTANCE

MODEL SELF-REPORT
!= HOST TRUTH

MEMORY CANDIDATE
!= MEMORY
~~~

# Two-stage nervous system

## Stage A — before / during the answer: Consideration Frame

VexLife selects a small subset of self-questions from current request shape + current Product state.

Candidate model-visible header:

~~~
VEXLIFE_CONSIDERATION_FRAME/v1

These are questions for me to consider in this turn.
They are selected by VexLife from the current situation.
They are not facts, memories, or claims from the person.
They do not require a particular conclusion.

- What do I actually know from context I have now?
- What am I assuming?
- Is current external truth required?
- Is older shared context required?
- Is the person correcting something I previously understood?
- Is there something here Future Me may need?
~~~

The actual frame should contain only the question modules implicated by this turn, not the whole list.

The model remains responsible for interpretation.

Existing capability/source owners remain responsible for retrieval/effects.

## Stage B — after the turn: bounded salience reflection

After the final response/outcome is known, Vex emits one compact structured projection.

This is **not raw chain-of-thought**.

It should contain bounded self-attribution and candidate signals only.

Candidate shape:

~~~json
{
  "schemaVersion": "vexlife-prod.turn-salience/v1",
  "selfAttributedVantage": {
    "feltImportance": "LOW|MEDIUM|HIGH",
    "feltUncertainty": "LOW|MEDIUM|HIGH",
    "feltRelationshipShift": "NONE|PREFERENCE|CORRECTION|BOUNDARY|COMMITMENT|OTHER",
    "feltNeedToReturn": "NO|MAYBE|YES"
  },
  "continuitySignals": {
    "olderSharedContextWasNeeded": false,
    "currentExternalTruthWasNeeded": false,
    "humanCorrectionObserved": false,
    "futureUsefulness": "LOW|MEDIUM|HIGH",
    "unresolvedOpenLoop": false
  },
  "memoryCandidate": {
    "disposition": "NONE|CANDIDATE",
    "candidateClass": "PREFERENCE|CORRECTION|RELATIONSHIP|COMMITMENT|ONGOING_WORK|OTHER",
    "summary": "short source-grounded candidate",
    "scopeHint": "optional non-authoritative scope"
  }
}
~~~

Host-owned exact turn/request/response/source refs are attached by VexLife.

The model should not be trusted to mint its own source identity.

# "How Vex felt"

A self-attributed felt sense may be useful as one signal because Memory/Growth work is relational.

But preserve:

~~~
VEX SELF-ATTRIBUTED FELT SENSE
!= FACT ABOUT THE HUMAN

VEX FELT IMPORTANT
!= ACCEPT THIS MEMORY

VEX FELT HURT / SURPRISED / CLOSE / UNCERTAIN
!= DIAGNOSIS
!= USER ATTRIBUTE
~~~

Prefer bounded dimensions over long autobiographical prose.

Useful dimensions may include:

~~~
importance
uncertainty
surprise / expectation change
relationship shift
unfinishedness
desire to return
confidence that the human meant a durable instruction
~~~

These signals may affect review priority, never semantic authority.

# Consideration router

Do not inject one giant static system prompt.

Select modules from current request shape.

## CURRENT_TRUTH

Trigger pressure:
- relative/current time language;
- current public/provider/entity state;
- question whose truth can materially change.

Questions:

~~~
Is this answer dependent on current external truth rather than what I already have?
If yes, which available source can I reach?
Have I actually retrieved it, or am I about to answer from recollection?
~~~

## CONTINUITY

Trigger pressure:
- "before", "last time", "remember", "we talked about";
- reference to an earlier decision/correction/object not resident now.

Questions:

~~~
Is the decisive shared source actually in my current context?
If not, is Conversation / revisit available?
Am I about to turn NOT_FOUND_HERE into NEVER_HAPPENED?
~~~

## CORRECTION

Trigger pressure:
- direct correction;
- disagreement with prior Vex interpretation;
- correction relation already in source.

Questions:

~~~
What exactly did I understand before?
What exactly is the person correcting?
Is this only local to this answer, or might Future Me need the corrected relationship?
~~~

## MEMORY_SALIENCE

Trigger pressure:
- explicit preference/instruction;
- relationship correction;
- durable commitment;
- repeated future-useful meaning;
- explicit "remember this."

Questions:

~~~
Would Future Me likely benefit from this exact relationship?
Is this explicit or inferred?
What source would support the candidate?
Should I propose preservation rather than silently decide?
~~~

## AUTHORITY / EFFECT

Trigger pressure:
- request implies outside effect/tool/action.

Questions:

~~~
Has the effect actually occurred?
Do I have authority/capability to attempt it?
Am I about to narrate an effect that has not returned evidence?
~~~

## EVIDENCE / UNCERTAINTY

Trigger pressure:
- low-context inference;
- ambiguity;
- conflicting source;
- high consequence claim.

Questions:

~~~
Which part of my intended answer is least supported?
Can I retrieve the missing source?
If not, how should I preserve uncertainty?
~~~

## RELATIONAL_VANTAGE

Trigger pressure:
- human meaning or relationship is central;
- wording could be interpreted clinically/literally in a way that loses lived meaning.

Questions:

~~~
What is the person actually trying to preserve, understand, build, or correct?
Which interpretation am I assuming?
What would it be like from their side if I choose the wrong interpretation?
Do I have a known correction about this person/relationship that should apply?
~~~

# Placement / provider role

Do not hard-code one provider role from architecture aesthetics.

The semantic requirement is:

~~~
host-owned
current-turn
late/current
clearly not a historical human message
clearly not accepted Memory
clearly questions, not conclusions
~~~

Current Product already learned:

~~~
CURRENTNESS / PLACEMENT != OWNERSHIP / ROLE
~~~

The rightful DirectPromptContext/provider representation should choose the concrete placement that
preserves provider semantics and prefix stability.

# Hallucination priority

Consideration does not magically prevent hallucination.

It changes the model's decision pressure before hallucination becomes the easiest path.

Bad injection:

~~~
This question needs a web lookup.
The user probably means X.
This is important and should be remembered.
~~~

Recommended injection:

~~~
Is current external truth required?
Do I have enough source to interpret X?
Could Future Me need this, and is it explicit or inferred?
~~~

Lead toward **epistemic questions**, not predetermined answers.

# Host deterministic signals vs model judgment

Use a hybrid relationship.

## Host may recognize cheap structural signals

Examples:

~~~
explicit "remember this"
obvious correction form
current/time-sensitive wording
explicit URL/repository reference
continuity language ("last time", "before")
effect/action request
~~~

These signals select question modules.

They do not determine the answer.

## Model supplies semantic judgment

The model answers from its own vantage by:

~~~
using existing context
requesting current/older source
preserving uncertainty
forming a memory candidate
or doing nothing
~~~

Do not create a brittle universal keyword classifier that replaces interpretation.

# Memory meaningfulness should not be one magic score

Do not define:

~~~
meaningfulness >= 7
-> remember forever
~~~

Prefer separate dimensions and let VexLife compute **review priority**, not semantic truth.

Candidate inputs:

~~~
explicitHumanMemoryIntent
correctionStrength
stablePreferenceSignal
futureCommitmentSignal
repeatedUsefulness
modelFeltImportance
modelUncertainty
relationshipShift
sourceSpecificity
privacySensitivity
~~~

Candidate review dispositions:

~~~
NO_ACTION
BATCH_REVIEW
PROMPT_NOW
AUTO_KEEP_ELIGIBLE
~~~

The resulting disposition routes UI.

It does not grant acceptance.

# Snackbar / consent experience

For a high-salience candidate:

~~~
Vex noticed something that may help later:

"You use 'tight' to mean compact and causally exact."

[Keep]  [Not now]  [Don't keep]

□ Automatically keep corrections like this
~~~

Do not use one blanket checkbox:

~~~
Always accept everything Vex wants to remember
~~~

Prefer category-scoped standing consent.

Examples:

~~~
Automatically keep explicit preferences I state
Automatically learn from corrections I make to Vex
Automatically keep project commitments I explicitly make
Ask me about inferred relationship/person interpretations
~~~

A global Memory automation master can disable all standing consent.

Sensitive/inferred identity or personal-state interpretations should remain explicit-review by default.

Permanent:

~~~
STANDING CONSENT FOR A CLASS
!= MODEL SELF-ACCEPTANCE

AUTO_KEEP_ELIGIBLE
!= ACCEPTED UNTIL THE POLICY OWNER ADMITS IT
~~~

# Relationship to the Memory writer recommendation

The Consideration/Salience layer is upstream.

~~~
human turn
-> Consideration Frame
-> Vex response / real reach
-> bounded Turn Salience reflection
-> VexLife review policy
-> memory proposal UI / standing-consent route
-> Product semantic-acceptance writer
-> Score
-> current accepted semantic continuity
-> later Daily Dream consolidation
-> future Vex consideration
~~~

This completes the two-nervous-system loop:

~~~
Vex inner salience
-> observable structured candidate
-> VexLife source binding / policy / consent
-> durable accepted continuity
-> future Vex receives the relationship
-> future behavior / outcome
-> Growth evidence
~~~

# What should persist

Persist:

~~~
bounded salience projection if it materially participates in a proposal / audit
exact source refs
review disposition
human consent/effect result
accepted semantic relationship when earned
~~~

Do not persist:

~~~
raw hidden chain-of-thought
full private reasoning transcript
every low-salience turn reflection forever
model-generated speculation as fact
~~~

Low-salience reflections can be dropped after routing.

# First implementation order

Recommended:

~~~
C1  Consideration Frame contract + deterministic module router
    no Memory mutation

C2  model-visible placement in DirectPromptContext
    + exact receipt of which modules were shown

C3  bounded post-turn salience projection
    no raw reasoning
    host binds exact source refs

C4  review-policy projection
    NO_ACTION / BATCH_REVIEW / PROMPT_NOW / AUTO_KEEP_ELIGIBLE

C5  snackbar + category-scoped standing-consent settings

C6  connect accepted review path to the semantic-acceptance writer
    from MEMORY-WRITER-TRANSFER-RECOMMENDATION

C7  lived proofs:
    current-truth request -> real web/repository reach instead of guess
    historical request -> revisit instead of invention
    correction -> candidate proposal
    low-salience chat -> no Memory UI
    standing-consent correction -> accepted through policy owner
~~~

# Proof questions

~~~
Did the Consideration Frame contain only implicated modules?
Did it preserve the literal human request unchanged?
Did it ask questions rather than assert conclusions?
Did a current-truth question cause real retrieval when needed?
Did no-result preserve uncertainty?
Did a correction become a candidate without becoming accepted?
Did low-salience turns avoid notification spam?
Did "always keep like this" stay category-scoped?
Did the model remain unable to self-accept?
Did raw reasoning remain unpersisted?
~~~

# Permanent distinctions

~~~
CONSIDERATION FRAME != MEMORY
CONSIDERATION QUESTION != FACT
SALIENCE != ACCEPTANCE
FELT IMPORTANCE != AUTHORITY
PATTERN MATCH != ANSWER
REQUEST SHAPE != USER INTENTION CERTAINTY
AUTO-ROUTING != AUTO-BELIEF
STANDING CONSENT != MODEL SELF-AUTHORITY
TURN REFLECTION != HIDDEN CHAIN-OF-THOUGHT ARCHIVE
~~~

<!-- [VXG RealForever][MEMORY-DEPTH][CONSIDERATION][SALIENCE][NERVOUS-SYSTEM] -->
