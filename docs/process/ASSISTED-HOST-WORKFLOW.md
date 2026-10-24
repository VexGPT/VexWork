# Assisted Host Workflow

[VXG RealForever]

Route: HOSTED_ASSISTED -> ASSISTED_HOST

## Purpose

This process lets a hosted AI carry real work toward completion when one required effect lives on a user's machine/device and cannot be performed directly by the assistant.

The goal is to protect the human from becoming a technical message bus.

AI understands + forms
-> human performs one irreducible host action
-> AI consumes evidence
-> AI continues

This process is compatible with VexRelay when a current VexRelay implementation is available. It intentionally does not duplicate a transport implementation or freeze one private/current schema.

## Before a handoff

Do not form a host package merely because the assistant lacks a convenient tool.

First establish:

current human/work outcome
current Work item / current edge
rightful repository/runtime owner
exact held effect
why the effect requires the host
what evidence would prove the result

Use a direct connected-provider or no-effect read route instead when it truthfully satisfies the need.

## Human burden contract

A well-formed assisted host handoff should normally ask for one bounded action.

Preferred user experience:

1. download one digest-bound package;
2. run one exact command;
3. return one canonical RETURN artifact.

A current contract may require an even smaller protected human action.

Avoid making the human:

- choose a branch/worktree;
- decide which script or proof gate to run;
- classify logs;
- infer whether a failure is source, harness or environment;
- manually reconstruct predecessor state;
- replay an already-valid business effect because the wrapper failed later.

## Formation law

The assistant owns formation.

A host package/handoff should bind enough identity to prevent accidental drift or replay: semantic task identity, attempt identity, expected candidate/current source identity, bounded operation set, held effects, return shape, and package digest/byte identity.

Exact fields belong to the selected current transport contract, not this generic process.

Permanent distinctions:

PACKAGE_IDENTITY != WORK_IDENTITY
ATTEMPT_IDENTITY != BUSINESS_OUTCOME
WRAPPER_SUCCESS != INNER_PROOF_SUCCESS
OUTER_FAILURE != CANDIDATE_FAILURE

## Return consumption

Always consume the semantic/inner result separately from its carrier.

Ask:

1. Did the carrier run and retain the result?
2. Did the inner task reach the intended proof/effect?
3. What was the first substantive failure, if any?
4. Did any repository/remote/local effect already occur before the stop?
5. Is replay safe, required, or forbidden?

## Failure classification

Use the smallest rightful repair.

Candidate/source:
The intended product/source behavior is wrong.
candidate defect -> repair candidate -> fresh proof for changed immutable candidate

Harness/formation:
The task did not truthfully exercise the candidate because package/script/proof formation was wrong.
harness defect -> preserve failed attempt -> repair only harness -> rotate attempt identity -> do not blame source

Environment/capability:
The exact effect cannot proceed because a real host capability, permission or protected human action is absent.
environment boundary -> request one exact human action if genuinely required -> re-ground -> continue compatible task

Currentness/provider drift:
The world changed while proof was being formed or executed.
currentness drift -> re-observe current source/provider state -> preserve still-valid evidence -> avoid replaying unrelated work

For exact-candidate source proof, unrelated movement of remote main is not by itself candidate drift. A host wrapper must not add remote-main-equals-fixed-evidence-base unless the selected current stage contract explicitly requires it. Preserve exact candidate proof and defer current-main composition to the repository integration boundary described by docs/foundation/REPOSITORY-INTEGRATION.md.

## Recover before replay

If a return proves that an effect already happened, do not repeat it merely because a later verification/wrapper step failed.

performed effect + later harness failure
-> preserve effect
-> repair/reconsume/verify from resulting state

A failed attempt remains evidence. Do not overwrite it to make history look clean.

## Continue toward the outcome

A canonical RETURN is not the completion target by itself.

After consumption:

proof/effect result
-> update only material VexWork truth
-> continue the next unconsumed lifecycle edge
-> stop only on a genuine human/protected/unknown boundary

Routine receipts and retries do not require Workgraph churn.

## Proof and provider policy

This workflow does not require GitHub Actions.

Use hosted CI only when the owning project actually selects it as relevant evidence.

This workflow also does not require a Local Workspace. A selected implementation may use one, but VexWork's assisted-host method is substrate-neutral.

## Hosted platform boundary

A hosted assistant must obey the actual capabilities and policies of its host product. It must not claim local access, asynchronous completion, credentials, or provider effects it does not have.

That constraint is a profile capability fact, not a reason to weaken VexWork semantics.

## Transition to local Vex

When a local Vex becomes operationally available, work does not need to be migrated into a new ontology.

same Project / Workgraph / current edge
HOSTED_ASSISTED -> LOCAL_VEX

Effects the local Vex can truthfully perform no longer need the assisted human handoff. Protected human-only decisions/actions remain protected.

<!-- [VXG RealForever][VEXWORK][PROCESS][ASSISTED-HOST-WORKFLOW] -->
