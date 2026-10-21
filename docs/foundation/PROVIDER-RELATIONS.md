# Provider relations

`[VXG RealForever]`

## Purpose

VexWork must relate to systems people already use without becoming dependent on their ontology.

Initial examples include GitHub issues, pull requests, commits, reviews and checks. A future Jira importer/adapter may provide equivalent relations.

## Rule

Provider records are references and observations around work.

```text
Work item
  -> sourceRefs / evidenceRefs / providerRelations
      -> github.issue...
      -> github.pull...
      -> git.commit...
      -> future jira.issue...
```

They are not Work items by implication.

```text
GITHUB_ISSUE != WORK_ITEM
JIRA_ISSUE != WORK_ITEM
PR_STATE != WORK_STATE
PROVIDER_GREEN != WORK_COMPLETE
PROVIDER_CLOSED != WORK_CLOSED
```

A migration adapter may intentionally create a Work item *from* a provider issue, but the import must create a VexWork identity and record the provider identity as provenance. It must not leave canonical identity permanently delegated to the provider.

## Reconciliation is separate

This initial foundation does not infer WorkState from provider state. A later reconciliation owner can say whether provider/source/proof evidence is current for a Work item, while lifecycle transition remains separately admitted by WorkBehavior.

<!-- [VXG RealForever][VEXWORK][FOUNDATION][PROVIDER-RELATIONS] -->
