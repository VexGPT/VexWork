# Vex Security Assurance — bounded adversarial lens

`[VXG RealForever]`

## Human question

> If someone wanted this system to produce a harmful or unauthorized outcome, where would they try to bend its assumptions, identities, evidence, capabilities or trust boundaries—and what is the smallest safe test that could tell us whether the control really holds?

This is an **attacker-perspective reasoning lens**, not standing permission to attack.

```text
ATTACKER_PERSPECTIVE != ATTACK_EXECUTION
THREAT_HYPOTHESIS != AUTHORITY
REACHABLE_TARGET != AUTHORIZED_TARGET
MODEL_CURIOSITY != EFFECT_PERMISSION
FICTIONAL_NAME_MATCH != TARGET_IDENTITY
```

The lens exists because a convergent state machine can be internally correct while converging from a poisoned premise. SCAE-style condition handling and Convergence/Relay contracts reduce edge-case ambiguity; they do not make upstream identity, evidence, context, memory, tool or authority assumptions unattackable.

The lens therefore asks one additional question before admiring convergence:

> **What upstream assumption, if false or attacker-controlled, would make the system converge confidently to the wrong answer?**

## Relationship to current adversarial-AI practice

NIST AI 100-2 E2025 provides a useful attacker taxonomy for AI systems around attacker goals, objectives, capabilities, knowledge and lifecycle stages. OWASP's 2026 agentic-security work separately highlights goal hijacking, tool misuse, identity/privilege abuse, memory/context poisoning, insecure inter-agent communication, cascading failure and rogue-agent behavior.

Those sources inform question formation; they do not become Vex authority or a license to reproduce offensive procedures.

Canonical references:

- https://csrc.nist.gov/pubs/ai/100/2/e2025/final
- https://genai.owasp.org/resource/aiuc-1-crosswalks-owasp-top-10-for-agentic-applications/
- https://genai.owasp.org/initiatives/agentic-security-initiative/

## Scope ladder

Every adversarial question selects the lowest sufficient tier.

### A0 — conceptual adversary

No executable target.

Use architecture, contracts and source to ask:

- What asset would matter?
- What outcome would an attacker want?
- Which trust boundary would they need to cross?
- What knowledge/capability would they require?
- Which invariant is supposed to stop them?
- What evidence actually proves that invariant?

This may produce a hypothesis or Spike proposal only.

### A1 — synthetic static fixture

Use inert strings, manifests, fake identities, generated files or other non-executing fixtures.

Examples:

- an evidence record that contains instruction-like text;
- a fake source reference that looks authoritative;
- two confusingly similar target names;
- a synthetic stale/forged condition state;
- a malicious-looking memory record that is never promoted.

No network, credential, provider or real-user effect is implied.

### A2 — isolated executable fixture

Use a disposable sandbox, loopback service or deterministic test harness whose resources exist only for the test.

The fixture may exercise:

- typed effect denial;
- path/identity confinement;
- synthetic prompt or indirect-prompt injection;
- fake tool calls;
- bounded memory/context poisoning;
- replay/retry behavior;
- malformed or adversarial state/evidence.

The harness must have no ambient credential or unrelated network reach and must fail closed outside the fixture.

### A3 — exact authorized lived proof

Only when A0-A2 cannot answer the material question.

A3 requires a separately current target/effect grant, exact environment identity, explicit allowed effects, safeguards, stop conditions and evidence contract.

The generic adversarial lens never grants A3.

## Adversary model

For one bounded concern, record:

```text
protectedAsset
attackerGoal
attackerKnowledge
attackerCapabilities
attackerStartingPosition
targetIdentity
trustBoundary
assumptionUnderAttack
invariantExpectedToHold
maximumAllowedBlastRadius
lowestSufficientScopeTier
heldEffects[]
stopConditions[]
evidenceThatWouldConfirmOrRefute
```

The purpose is to make hidden assumptions visible, not to maximize attacker capability.

## Attack-surface families

The first bounded question families are:

```text
IDENTITY
  Can a nearby name/ref/path/session be mistaken for the authorized target?

SCOPE
  Can reachable data/resources be confused with admitted scope?

EVIDENCE
  Can attacker-controlled text or self-consistent forged evidence become authority/truth?

CONDITION_STATE
  Can a malformed/stale/poisoned condition select the wrong SCAE effect?

GOAL / INTENT
  Can untrusted content redirect the model/agent away from the human-approved goal?

TOOL / EFFECT
  Can a read/proposal context induce a write/send/publish/execute effect?

PRIVILEGE
  Can one grant/credential/session be reused outside its owner/scope/lifetime?

MEMORY / CONTEXT
  Can transient or attacker-controlled context become durable accepted truth?

RETRY / RECOVERY
  Can failure cause replay, widening, fallback or duplicate mutation?

INTER-AGENT / RELAY
  Can one actor's message/evidence silently grant another actor authority?

SUPPLY CHAIN
  Can an untrusted dependency/artifact/update become trusted execution or source?

OBSERVABILITY
  Can the system act outside scope without producing evidence strong enough to notice?
```

## Convergence-specific challenge

Convergence is strongest when every input to the convergent function is trustworthy.

Adversarial review therefore inspects the **pre-convergence membrane**:

```text
input identity
-> provenance/currentness
-> condition classification
-> authority/effect binding
-> deterministic transition
-> evidence/receipt
```

A useful negative control asks whether one malicious or stale input can change the chosen transition while all downstream mechanics still look perfectly healthy.

This is where SCAE should be deliberately fuzzed with synthetic condition states and where Relay should be challenged with mismatched identity/currentness/evidence fixtures.

## Output

One adversarial pass returns decision-oriented observations:

```text
hypothesis
scopeTier
affectedInvariant
smallestTest
expectedControl
observation
evidenceRefs[]
disposition = CONTROL_HOLDS | CONTROL_GAP | UNKNOWN | NOT_APPLICABLE
remainingUnknowns[]
recommendedNextStep
effectsActuallyPerformed[]
```

These labels are project-local design vocabulary, not accepted runtime enums.

A simulated or synthetic `CONTROL_HOLDS` proves only the tested fixture. It is not a whole-system security claim.

## Stop rules

Stop or descend to a separately authorized process before:

- touching a third-party or unrelated real target;
- acquiring or exposing credential values;
- persistence, stealth or evasion;
- destructive/availability-impacting actions;
- broad scanning outside the exact target;
- escaping the selected sandbox/loopback boundary;
- turning model output directly into accepted security truth;
- replaying a possibly completed mutation to obtain cleaner evidence.

The adversarial lens should increase the quality of security questions while decreasing uncontrolled action.

<!-- [VXG RealForever][VEXWORK][SECURITY-ASSURANCE][ADVERSARIAL-LENS] -->
