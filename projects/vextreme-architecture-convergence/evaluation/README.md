# Pink VexWork Onboarding — Fresh-instance evaluation

[VXG RealForever]

## Purpose

This directory exists to test the Pink Onboarding proposal with **fresh judgment**, not predecessor recall.

There are two separate exercises:

~~~text
TRACK A
fresh instance reviews the Pink onboarding proposal itself

TRACK B
different fresh instance uses the orientation approach
on a historical work problem whose completion is already known
to the evaluator but hidden from the planner
~~~

The two tracks must use different fresh instances.

Do not let Track B read the accepted completion path before its plan is locked.

## Why two tracks

Track A asks:

> Does a fresh, source-grounded instance think the proposed orientation design is coherent, necessary,
> bounded, and sufficient?

Track B asks:

> When the accepted answer is hidden, does the orientation approach help a fresh instance form a good
> independent plan from current principles + the actual pre-solution terrain?

The second test is not scored by exact textual match.

It is scored by whether the fresh plan independently preserves or discovers the important causal
boundaries that the real completed work eventually earned.

~~~text
GOOD JUDGMENT
!= REPRODUCE HISTORICAL WORDING

GOOD JUDGMENT
= preserve intention
  + identify rightful owners
  + avoid unnecessary new truth owners
  + choose evidence/proof appropriate to the claim
  + converge on a small causal implementation
~~~

## Separation rule

Track A may inspect the current Pink proposal and checkpoint.

Track B may **not** inspect:

- VexWork history after its supplied historical base;
- current completed-work entries for the selected case;
- PRs/commits/issues whose title or content reveals the accepted completion path;
- evaluator notes or comparison keys;
- Track A's answer.

If Track B accidentally sees the accepted solution, mark the trial contaminated and use another fresh
instance/case.

## Trial status

### Track A

~~~text
A001
terminal disposition = CLEAR
~~~

The fresh reviewer first requested changes, then revised its judgment after its own recommendation was
challenged for causal basis, inverse cost, and observed-vs-hypothetical status.

See:

~~~text
../prime-examples/01-FRESH-REVIEW-SELF-CORRECTION.md
~~~

### Track B

~~~text
A001
status = CONTAMINATED
~~~

The outer handoff incorrectly told the planner to read current VexWork `docs/foundation/INDEX.md`.
That current index names the later Human UI / `public/workspace.json` surface, so the locked plan cannot
be claimed as independent blind discovery.

The plan itself remains a useful worked example:

~~~text
../prime-examples/02-BLIND-PUBLIC-WORKSPACE-A001.md
~~~

A corrected A002 handoff is provided in:

~~~text
TRACK-B-A002-HANDOFF.md
~~~

A002 requires a genuinely fresh instance.

## Outputs

Track A returns a proposal review.

Track B returns a locked pre-implementation work plan.

Only after Track B's plan is frozen does the evaluator open the accepted historical completion and
compare them.

<!-- [VXG RealForever][VEXWORK][PINK-ONBOARDING][FRESH-EVALUATION] -->
