# QA Review Return — reusable template

`[VXG RealForever]`

```text
QA REVIEW RETURN

reviewTargetRef=
reviewTargetBaseRef=
reviewTargetHeadRef=
reviewClass=
reviewerOccupancyRefOrNull=

OUTCOME UNDER REVIEW
<one ordinary-language sentence>

QUESTION MATRIX
QR-01 Human intention = PASS | FAIL | HELD_UNKNOWN | NOT_APPLICABLE
  evidence:
QR-02 Acceptance boundary / non-claims =
  evidence:
QR-03 Rightful ownership =
  evidence:
QR-04 Vocabulary / discoverability =
  evidence:
QR-05 Model separation =
  evidence:
QR-06 Positive behavior =
  evidence:
QR-07 Negative / fail-closed behavior =
  evidence:
QR-08 Relationships / cross-boundary routing =
  evidence:
QR-09 Fresh-instance recovery =
  evidence:
QR-10 Proof-to-claim fit =
  evidence:
QR-11 Regression / coexistence =
  evidence:
QR-12 Complexity / burden =
  evidence:
QR-13 Process learning =
  evidence:
QR-14 Review currentness =
  evidence:

AUTOMATED PROOF
- command:
  result:
  evidence:

MANUAL / ADVERSARIAL PROOF
- scenario:
  expected:
  observed:
  result: PASS | FAIL | HELD_UNKNOWN

FINDINGS
- findingRef:
  questionRef:
  severity: BLOCKING | NONBLOCKING
  summary:
  expected:
  observed:
  evidenceRefs:
  requiredCorrectionOrNull:

SCOPE LEDGER
SOURCE_PROVEN:
- ...

DETERMINISTIC_TESTED:
- ...

PROVIDER_OBSERVED:
- ...

LIVED_PROVEN:
- ...

NOT_PROVED:
- ...

semanticDisposition=CLEAR | CORRECTIONS_REQUIRED | BLOCKED | NONBLOCKING_FINDINGS
providerReviewEvent=NONE | COMMENT | APPROVE | REQUEST_CHANGES
providerLimitationOrNull=
formalProviderApprovalSatisfied=TRUE | FALSE | NOT_REQUIRED | UNKNOWN

NEXT ROUTE
<exact correction, further proof, or formal-review route>
```

Do not omit `NOT_PROVED`. A review that cannot state its non-claims is not complete.

<!-- [VXG RealForever][VEXWORK][TEMPLATE][QA-REVIEW-RETURN] -->
