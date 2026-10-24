# VexWork Spike — candidate reusable process design

`[VXG RealForever]`

**Status:** Project-local candidate for `process.vexwork.run-spike`. Not yet registered in the Process Map.

## Human question

> We have one material uncertainty that blocks a sound decision. What is the smallest bounded investigation that can answer it, what evidence would count, and what do we do with the result?

A Spike is not "do some research" and it is not permission to test anything nearby.

```text
material question
+ exact scope / owner / authority
+ finite evidence plan
+ explicit stop boundary
        ↓
bounded investigation
        ↓
evidence + answer confidence + remaining unknowns
        ↓
decision / promoted Work / no further action
```

## Why process semantics first

VexWork already has:

```text
TASK = bounded work intended to advance an outcome
```

A Spike is a TASK whose primary advancement is **epistemic**: it reduces uncertainty or disproves an assumption. That does not yet require a fifth work class.

The reusable distinction can be projected by:

```text
workClass = TASK
formationProcessRefOrNull = process.vexwork.run-spike
```

If repeated use later shows that class-level filtering, lifecycle, policy or UI behavior cannot be represented faithfully through the process relation, that observed pressure can justify a `SPIKE` workClass evolution.

## Spike brief

A reusable Spike should bind at least:

```text
question
whyNow / decisionToUnlock
targetScope
knownFacts[]
unknowns[]
hypothesesOrCompetingExplanations[]
sourceRefs[]
authorityRefs[]
allowedVerificationModes[]
explicitlyHeldEffects[]
evidenceRequired[]
timeOrEffortBound
stopConditions[]
```

For security Spikes, target scope must distinguish source review, synthetic/isolated targets and any real environment. Credentials or secret values do not belong in the brief.

## Evidence modes

Prefer the smallest sufficient mode:

```text
READ_ONLY_SOURCE_REVIEW
CONFIGURATION_OR_DEPENDENCY_REVIEW
STATIC_OR_DETERMINISTIC_CHECK
UNIT_OR_INTEGRATION_SECURITY_TEST
SYNTHETIC_NEGATIVE_CONTROL
ISOLATED_OR_LOOPBACK_ADVERSARIAL_TEST
EXACT_AUTHORIZED_LIVED_PROOF
```

These names are design vocabulary, not runtime enums.

## Result

A Spike result should make the decision state obvious:

```text
answer = ANSWERED | PARTIAL | UNANSWERED
findings[]
evidenceRefs[]
assumptionsConfirmed[]
assumptionsRejected[]
remainingUnknowns[]
newConcerns[]
recommendedNextStep
effectsActuallyPerformed[]
```

Again, these are candidate process semantics, not a machine schema yet.

A useful `UNANSWERED` Spike is not a failure when it proves why the question cannot currently be answered and what exact evidence is missing. A Spike must never convert lack of evidence into `SATISFIED`.

## Security boundary

A security Spike defaults to defensive, bounded evidence acquisition. It does not infer authorization for:

- third-party or ambient target scanning;
- credential capture or secret retrieval;
- persistence or stealth;
- exploit deployment against real users/systems;
- destructive or availability-impacting tests;
- bypassing access controls or safety systems;
- unrelated reconnaissance.

If one of those effects is genuinely required for an authorized security exercise, its exact owner, target, effect, safeguards and evidence contract must be admitted separately. The generic Spike process never grants it.

## Adversarial Spike relationship

When a Spike comes from the attacker lens, the brief must additionally bind:

```text
attackerGoal
attackerStartingPosition
attackerCapabilities
assumptionUnderAttack
maximumAllowedBlastRadius
lowestSufficientScopeTier
```

The default is an A0/A1/A2 conceptual, synthetic or isolated investigation. Reaching an A3 real-environment exercise requires a separately current target/effect grant; the Spike process itself never upgrades scope.

See `projects/vex-security-assurance/ADVERSARIAL-LENS.md`.

## Connection to Derived Attention

```text
Security Lens predicate = UNKNOWN
-> Spike answers the missing fact
-> evidence updates the exact predicate
-> SATISFIED / UNSATISFIED / UNKNOWN / NOT_APPLICABLE

Security Lens predicate = UNSATISFIED
-> Spike only when causality/mitigation is materially uncertain
-> otherwise promote the exact concern directly to repository-owned Work
```

This prevents "Spike" from becoming ceremony in front of already-understood fixes.

## Promotion threshold

A Spike may recommend:

```text
NO_ACTION
MORE_EVIDENCE
UPDATE_LENS
CREATE_OR_CONFIRM_WORK
ROUTE_TO_RIGHTFUL_OWNER
PROTECTED_DECISION
```

The accepted promotion mechanism remains separate. A Spike result does not create Work or provider effects by itself.

<!-- [VXG RealForever][VEXWORK][SPIKE][CANDIDATE-PROCESS] -->
