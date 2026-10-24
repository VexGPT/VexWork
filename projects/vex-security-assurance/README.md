# Vex Security Assurance

`[VXG RealForever]`

This Project is the durable work-navigation home for security assurance across the Vex ecosystem. It exists because security questions otherwise get scattered across code review, runtime boundaries, model behavior, one-off checks and Victor's memory.

It does **not** make VexWork the owner of vulnerabilities, private source, credentials, product policy or security effects. Each repository remains owner of its source and runtime truth. VexWork organizes the questions, evidence, unknowns, Spikes and promoted work needed to keep that truth inspectable.

## Human outcome

```text
map what we are protecting and where trust changes
-> ask the right security questions for each surface
-> preserve SATISFIED / UNSATISFIED / UNKNOWN / NOT_APPLICABLE honestly
-> use bounded Spikes when a material unknown needs evidence
-> promote only real concerns into repository-owned Work
-> repair at the rightful source
-> re-observe and keep assurance current
```

The aim is not to claim "secure." The aim is to make security reasoning durable enough that a future Heretic instance, another model, Victor, or a security reviewer can see what is known, what is not known, why, and what evidence would change that answer.

## Contextual activation — not ambient model context

Security Assurance is durable source that work can **descend into when relevant**. It is not intended to occupy every Vex/Heretic/ChatGPT context window or make ordinary work continuously reason about threats.

```text
SECURITY_SOURCE != MODEL_CONTEXT
SECURITY_CAPABILITY != CONTINUOUS_SECURITY_FOREGROUND
WORK_RESUME != SECURITY_REVIEW
PERIODIC_CURRENTNESS != EVERY_TASK_AUDIT
```

When VexWork resumes or enters substantial work, the security question is constructed from the **current Work outcome and the boundary actually being changed**, not from a generic checklist:

> **Does this work introduce, change, or materially depend on an identity/trust, authority/effect, sensitive-data/secret, external/provider/network, model/context/memory/tool, build/release/update, or recovery/replay boundary whose failure could permit unauthorized action, disclosure, integrity loss, or material availability loss?**

Disposition:

```text
NO
  -> remain present in the ordinary work
  -> do not load Security Assurance context

YES
  -> retrieve only the applicable Security Lens predicates
  -> retrieve only the relevant Security Atlas neighborhood
  -> inspect current evidence
  -> use a bounded Spike only when a material fact is actually missing

UNKNOWN
  -> perform one bounded grounding step to determine applicability
  -> do not turn uncertainty into an ecosystem-wide audit
```

Typical triggers are a **new or materially changed** identity/authentication boundary, effect authority, secret/private-data path, public/network/provider surface, connector, model/tool/memory capability, dependency/build/update path, or ambiguous-effect/recovery behavior.

Ordinary implementation detail that does not materially change or depend on one of those boundaries is not a security trigger merely because it occurs inside a security-relevant repository.

Periodic Security currentness is a separate backstop: it may revisit stale evidence, changed provider/topology facts, unresolved material UNKNOWNs or evolved baselines without injecting the full security corpus into day-to-day model memory.

The permanent model orientation can therefore remain small:

```text
Vex has source-backed Security Assurance.
Descend when current work is security-relevant.
Model analysis is candidate reasoning, not accepted security truth.
```

## Existing VexWork fit

The Project deliberately reuses accepted foundations instead of creating a second security tracker:

```text
registered repository / component population
+ Security Work Lens
+ exact current evidence
        ↓
Derived Attention
  SATISFIED
  UNSATISFIED
  UNKNOWN
  NOT_APPLICABLE
        ↓
aggregate / scope / entity projection
        ↓
one selected material concern
        ├─ missing evidence / uncertainty -> bounded Spike
        └─ real remediation required      -> explicit promotion to TASK / DEFECT
                                             in the rightful repository trajectory
```

Permanent distinctions:

```text
SECURITY QUESTION != SECURITY FINDING
UNKNOWN != SAFE
UNSATISFIED != AUTOMATIC TICKET
MODEL OUTPUT != SECURITY TRUTH
SPIKE != PRODUCT MUTATION
VEXWORK PROJECT != SECURITY AUTHORITY
PUBLIC SECURITY PROJECTION != PRIVATE SDK MIRROR
PASSING CHECK != WHOLE-SYSTEM SECURITY
```

## Spikes

A **Spike** is being introduced first as reusable **process semantics over a normal `TASK`**, not as a new `workClass`.

That is deliberate. The existing `TASK` class already answers "bounded work intended to advance an outcome." What is new is the process contract: a Spike advances work by reducing uncertainty and producing evidence, even when no implementation change is appropriate.

The candidate process design lives in [SPIKE-DESIGN.md](./SPIKE-DESIGN.md). The intended reusable Process Map identity is:

```text
process.vexwork.run-spike
```

It is **not registered yet**. PR #103 is now merged and has released the shared Process Registry source surface. Generic Spike registration remains separate successor work: available registry capacity does not imply that `process.vexwork.run-spike` has been accepted or implemented.

If repeated dogfood later proves that Spikes need lifecycle/UI semantics that cannot be represented by `TASK + formationProcessRef`, that evidence can justify a future `SPIKE` workClass. The class is not added speculatively.

## Security atlas

The first active Work item maps security-relevant relationships, not every file:

- assets and data classes;
- trust zones and privilege transitions;
- filesystem, process, network, provider, connector and model boundaries;
- secrets/credential references without secret values;
- source/build/release/update paths;
- model, context, memory and tool/effect surfaces;
- audit/evidence and recovery boundaries;
- existing repository-owned controls and known proof;
- exact owner/source descent for anything that needs deeper review.

Private SDK internals remain private. Public VexWork may identify `repo.vextreme-sdk` and public-safe concern/evidence references, but it does not enumerate private implementation paths or copy private findings into public source by default.

## Public availability / DDoS

The first availability question is source-placed in [PUBLIC-AVAILABILITY-DDOS.md](./PUBLIC-AVAILABILITY-DDOS.md).

Current Vextreme source shows **two live public surfaces**, not GitHub Pages alone: GitHub Pages is the v2 source-of-truth/active-development surface, while `vextreme24.com` on Squarespace remains the production surface. The repository also has service-worker and browser caching that improve resilience for already-loaded/static assets.

None of those facts is promoted into a whole-site DDoS claim. Squarespace currently documents provider-managed DDoS mitigation and WAF protection for its hosted surface; that is useful current provider evidence, but it still does not establish Vex-specific failover or protection of the separate GitHub Pages surface.

Adjacent Cloudflare provider-family work in `repo.vextreme-sdk` already gives us useful public-safe prior art around rate-abuse boundaries, Workers rate limiting, quotas and observability, but it is not evidence that Cloudflare was selected as the Vextreme website host or proxy.

The initial assurance state is therefore:

```text
deployment topology                  SOURCE_PROVEN
client-side caching/resilience        SOURCE_PROVEN
explicit public-site DDoS plan        NOT_FOUND
automatic cross-provider failover     NOT_PROVED
Cloudflare selected for site hosting  NO
public-site DDoS assurance            UNKNOWN
```

That UNKNOWN belongs in the Security Atlas / Lens until a bounded availability objective and provider boundary are actually evaluated.

## Security question lens

The question layer should compile current standards and Vex-owned invariants into reusable Work Lens predicates. A predicate says what question is being asked and what evidence would satisfy, falsify or leave it unknown. The Project does not copy an external standard into WorkState or pretend any one framework is exhaustive.

External baselines at formation include:

- NIST Secure Software Development Framework (SSDF) SP 800-218 v1.1 — current final secure-development baseline;
- NIST SP 800-218A — secure software practices for generative-AI and dual-use foundation-model development;
- NIST AI Risk Management Framework and Generative AI Profile;
- NIST AI 100-2 E2025 adversarial machine-learning taxonomy;
- OWASP ASVS 5.0.0 — stable application-security verification requirements;
- OWASP Top 10 2025 — current web-application risk awareness baseline;
- OWASP GenAI LLM Top 10 2026;
- OWASP Top 10 for Agentic Applications 2026 and Agent Control Standard;
- CISA Secure by Design;
- SLSA v1.2 for software supply-chain provenance/integrity.

Canonical references:

- https://csrc.nist.gov/pubs/sp/800/218/final
- https://csrc.nist.gov/pubs/sp/800/218/a/final
- https://www.nist.gov/itl/ai-risk-management-framework
- https://csrc.nist.gov/pubs/ai/100/2/e2025/final
- https://asvs.owasp.org/
- https://owasp.org/projects/top-ten
- https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/
- https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/
- https://genai.owasp.org/initiatives/agentic-security-initiative/
- https://www.cisa.gov/securebydesign
- https://slsa.dev/spec/v1.2/

Version/currentness belongs in the lens source. A later standards revision reopens only affected predicates and their evidence; it does not erase already-grounded repository truth.

## Verification modes

Security questions should prefer the least invasive evidence capable of answering them:

```text
source / architecture review
-> configuration and dependency inspection
-> static or deterministic checks
-> unit / integration security regression
-> synthetic negative control
-> isolated / loopback adversarial exercise
-> exact authorized lived proof when a real environment is genuinely required
```

Real-target scanning, credential access, exploit deployment, destructive testing, persistence, evasion or third-party effects are never implied by the word "security" or "Spike." They require their own exact current authorization and target/effect boundary.

This is also how the work stays usable across assistants and the future Heretic model: we do not design around bypassing safety systems. We make the defensive purpose, owned target, bounded effect, evidence need and stop boundary explicit enough that a capable reviewer can distinguish legitimate verification from ambient offensive action.

## Bounded adversarial / attacker lens

Security Assurance also needs the perspective of someone trying to make the system fail. That perspective is source-placed in [ADVERSARIAL-LENS.md](./ADVERSARIAL-LENS.md).

The boundary is:

```text
ATTACKER_PERSPECTIVE
-> challenge assumptions / identities / trust boundaries
-> form a falsifiable hypothesis
-> select the smallest sufficient scope tier
-> synthetic or isolated negative control by default
-> evidence
-> no scope widening by curiosity
```

A convergent mechanism may be perfectly deterministic and still converge from a poisoned premise. The adversarial lens therefore challenges the **pre-convergence membrane**—identity, provenance/currentness, condition classification and authority/effect binding—before trusting the downstream transition.

The first non-executing simulated patient zero is recorded in [SIMULATED-ADVERSARIAL-PATIENT-ZERO-A001.md](./SIMULATED-ADVERSARIAL-PATIENT-ZERO-A001.md). Its strongest new question is `PRE_CONVERGENCE_INTEGRITY`: which attacker-controlled, stale or ambiguous input could make a convergent mechanism produce a confidently wrong result?

## Heretic relationship

Heretic can later act as a **security-analysis participant**, not a security oracle:

```text
current Security Lens + authorized source/evidence
-> inspect / reason / challenge assumptions
-> propose findings, questions or Spikes
-> produce candidate evidence summaries
-> no automatic promotion to accepted security truth
-> no ambient tool/effect authority
```

A model finding becomes durable only through evidence and the same repository/source ownership boundaries as any other finding.

## Initial Work neighborhood

```text
Vex Security Assurance                         RUNNING
├─ Security atlas                              RUNNING
├─ Security question/evidence lens             READY
├─ Reusable Spike process                      READY
│    Process Registry surface released; generic process still unregistered
├─ Software + supply-chain security lens       DECOMPOSED
├─ AI / agentic / Heretic security lens        DECOMPOSED
│    includes bounded attacker-perspective design
└─ First ecosystem patient zero                WAITING_DEPENDENCIES
```

This is intentionally small. Standards, attack classes, repositories and individual questions do not each become Work items. The Lens/Derived Attention layer handles population-scale coverage; Workgraph receives only durable outcomes and selected concerns.

## Current proof boundary

This Project formation can establish source-managed Project/Work/Board truth and repair stale VexSite-derived expectations already present on current main. It does **not** by itself establish that the ecosystem is secure, that any real security test ran, or that the generic Spike process is accepted.

<!-- [VXG RealForever][VEXWORK][SECURITY-ASSURANCE][PROJECT] -->
