# Delegated Agency and Human Transition Handshake

`[VXG RealForever]`

## Human intention

Victor does not want to become the task dispatcher for AI work.

The intended relationship is:

```text
human delegates one bounded outcome/envelope
-> AI manages routine work inside it
-> AI reaches a meaningful phase boundary
-> AI explains what became true + what comes next + what needs attention
-> human acknowledges, reviews/feedbacks, and approves or holds
-> AI confirms what it understood
-> only then does the phase transition commit
```

This is a **three-way handshake**.

```text
AI_PROPOSES
-> HUMAN_ACKNOWLEDGES_AND_APPROVES | FEEDBACK | HOLD
-> AI_CONFIRMS_INTERPRETATION
-> transition commits only when approved and still exact-current
```

## Approval meaning

```text
ACK_APPROVED != TASK_ORDER
ACK_APPROVED != NEW_AUTHORITY
ACK_APPROVED = MUTUAL AGREEMENT TO ENTER THE EXACT DESCRIBED NEXT ENVELOPE
```

The Work item must already carry `AUTHORIZED_BOUNDED`. A handshake cannot promote `NO_AUTHORITY` work into implementation.

For a phase promotion, the current item must also carry `EFFECTS_BOUND`.

## Project Agency Policy

A Project may opt into:

```text
mode=DELEGATED_WITH_TRANSITION_HANDSHAKE
routineTransitionAutonomy=WITHIN_CURRENT_PHASE
```

The policy names the canonical Board-phase crossings that require a human handshake. A configured boundary also protects entry into its destination phase from transient lanes, so Waiting / Needs Human cannot become a detour around Ready -> Active or Active -> Verify.

When exact Workgraph transition history proves the work was already inside that destination phase before a transient interruption, returning to the same phase remains routine. If that provenance is absent or points to an earlier phase, VexWork requires the protected handshake rather than silently promoting the work.

That lets routine operational movement remain autonomous:

```text
RUNNING -> WAITING_TOOL -> RUNNING
RUNNING -> FAILED_RECOVERABLE
WAITING_RESOURCE -> READY
```

when those exact lifecycle edges are lawful and already inside the delegated envelope.

A phase promotion such as:

```text
Ready -> Active
Active -> Verify
Verify -> Done
```

can require the three-way handshake.

### Review meaningful promises, not every implementation step

Project Agency Policy v2 may scope one handshake boundary to meaningful work rather than forcing every task through human review.

```json
{
  "boundaryRef": "boundary.example.verify-done",
  "fromLaneRef": "lane.work.verify",
  "toLaneRef": "lane.work.done",
  "appliesTo": {
    "workClasses": ["OUTCOME"],
    "workRefs": ["work.example.user-facing-story"]
  }
}
```

When `appliesTo` is present, the boundary applies when the current Work item matches **either** a listed `workClass` or an explicitly listed `workRef`. This supports the common pattern:

```text
implementation TASK
  deterministic/source proof complete
  -> may complete autonomously when Project policy permits

meaningful OUTCOME / explicitly reviewable user-facing TASK
  implementation is ready
  -> VERIFYING
  -> human lives/reviews the promise
  -> ACK_APPROVED -> Done
     ACK_FEEDBACK / ACK_HOLD -> transition holds
```

The v1 policy schema remains unchanged and continues to apply each configured boundary to all Project work. Scoped boundaries require `vexwork.project-agency-policy/v2`.

This is deliberately a Project stewardship choice, not a new global lifecycle state:

```text
DEV_SOURCE_COMPLETE != HUMAN_ACCEPTED
HUMAN_REVIEW_REQUIRED != EVERY_TASK_NEEDS_HUMAN_REVIEW
VERIFYING = promise/proof under review
DONE = configured completion boundary satisfied
```

The Board lane is the human phase language; WorkState remains canonical lifecycle truth.

## Exact binding

The proposal binds Project, Work item, exact observed Workgraph fingerprint, exact observed WorkState, proposed WorkState, human-facing current/next phase, what became true, next intent, attention, held boundaries, and authority-basis refs.

The human response binds the exact proposal fingerprint.

The AI confirmation binds both the exact proposal and exact response fingerprints.

A stale proposal therefore cannot authorize a changed Workgraph.

Victor does not need to see fingerprints. They exist so a natural-language “yes” cannot accidentally apply to a different proposal later.

## Human response

The first decisions are deliberately small:

```text
ACK_APPROVED
  I understand the described transition and approve continuing on that basis.

ACK_FEEDBACK
  I understand where the work is; incorporate this feedback before proceeding.

ACK_HOLD
  I understand the state; do not enter the next phase yet.
```

Natural language may resolve to these decisions at a conversational layer. Core VexWork stores/validates the typed decision; it does not own language interpretation.

## AI confirmation

The third leg is mandatory for a handshaken phase promotion.

The AI confirms what it understood, what next envelope it will operate inside, what remains held, and whether it will `COMMIT_TRANSITION` or `HOLD`.

This prevents silent interpretation drift.

## Discovery while working

A delegated Project may define a default discovered-work posture.

The first recommended posture is:

```text
POTENTIAL
PARKED
NO_AUTHORITY
NO_EFFECTS
```

That lets the AI preserve adjacent ideas without widening the active outcome.

## Non-collapse

```text
HUMAN_ACKNOWLEDGEMENT != AUTHORITY
HUMAN_APPROVAL != TASK ORDER
HANDSHAKE != PROVIDER APPROVAL
HANDSHAKE != MERGE
HANDSHAKE != RELEASE AUTHORITY
ROUTINE AUTONOMY != SCOPE EXPANSION
DISCOVERED_WORK != ADOPTED_WORK
WAITING_HUMAN != PHASE_ACKNOWLEDGEMENT
```

A Project handshake is product/work stewardship. Repository review, provider merge, publication, credentials, protected human effects, and destructive operations retain their own rightful authority boundaries.

<!-- [VXG RealForever][VEXWORK][FOUNDATION][TRANSITION-HANDSHAKE] -->
