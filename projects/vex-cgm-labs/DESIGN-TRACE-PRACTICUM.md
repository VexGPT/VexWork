# VexCgmLabs — Design Trace practicum

[VXG RealForever]

## Purpose

Use VexCgmLabs as a patient zero for a source-backed regulated-software traceability pattern without
creating a second requirements-management system or claiming regulatory compliance.

The intended relationship is:

~~~
upstream requirement / risk-control reference
-> Vex implementation pattern
-> actual source owner / usage
-> verification source
-> observed evidence
~~~

VexBoard is a projection of these relationships, not their authority owner.

## Upstream requirement boundary

In a real regulated organization, product/system/medical/quality requirements will normally already
have authoritative identities in an external or controlled requirements source.

Vex should retain only enough stable reference/currentness information to connect implementation to
that owner.

Permanent:

~~~
VEX_REQUIREMENT_REF != REQUIREMENT AUTHORITY
VEXBOARD != TRACEABILITY AUTHORITY
IMPLEMENTATION_PATTERN != PRODUCT STATE OWNER
TEST PASS != REQUIREMENT VALIDATION BY ITSELF
~~~

## Candidate practicum inputs

The following are synthetic VexCgmLabs design inputs for learning/architecture pressure only.

### REQ-CGM-CONTINUITY-001

A recoverable transport interruption must remain distinguishable from an interval in which no valid
measurement was acquired.

Candidate pattern:

~~~
pattern.cgm.acquisition-observation-separation
~~~

### REQ-CGM-PROVENANCE-002

A retrospectively recovered measurement must remain distinguishable from a measurement observed live.

Candidate pattern:

~~~
pattern.cgm.observation-provenance
~~~

### REQ-CGM-CURRENTNESS-003

A last-known measurement must not remain represented as Current after its admitted freshness evidence
expires.

Candidate pattern:

~~~
pattern.currentness.stale-observation-protection
~~~

### REQ-CGM-EPOCH-004

A new acquisition epoch must not be merged into prior sequence continuity solely because sequence
values overlap.

Candidate pattern:

~~~
pattern.stream.epoch-sequence-identity
~~~

### REQ-CGM-UNIT-005

Changing display units must not create a new measurement or alter measurement identity/provenance.

Candidate pattern:

~~~
pattern.measurement.presentation-unit-projection
~~~

These pattern refs are candidates. Promote a reusable pattern only after repeated source consumers
prove it is more than a one-feature implementation detail.

## Source binding direction

A mature Android source owner may eventually carry a small source-visible binding such as KDoc or an
earned annotation.

Conceptually:

~~~
source owner:
    CgmHistoryReconciler

pattern refs:
    pattern.cgm.acquisition-observation-separation
    pattern.stream.epoch-sequence-identity

requirement refs:
    REQ-CGM-CONTINUITY-001
    REQ-CGM-EPOCH-004
~~~

The source binding says:

> this owner realizes these design obligations

It does not redefine the requirement.

Do not annotate every helper/DTO. Bind the smallest meaningful semantic/realization owner that
actually satisfies the obligation.

## Verification binding direction

Verification source should identify the exact requirement/pattern it proves.

Conceptually:

~~~
G02 transport-loss-full-backfill test
    verifies:
        REQ-CGM-CONTINUITY-001
        REQ-CGM-PROVENANCE-002

G03 acquisition-gap test
    verifies:
        REQ-CGM-CONTINUITY-001

G07 new-epoch test
    verifies:
        REQ-CGM-EPOCH-004

G10 stale-currentness test
    verifies:
        REQ-CGM-CURRENTNESS-003
~~~

Useful verification meaning includes:

~~~
expected changed relationships
expected held relationships
expected unaffected relationships
~~~

For example, a transport interruption may change observation continuity without changing the
synthetic sensor's acquisition state.

## Projection goal

VexBoard should eventually be able to project four related questions over the same source:

~~~
BEHAVIOR
    what happens?

DEPTH
    what realizes it?

DESIGN TRACE
    why must this behavior exist?
    which requirement/control/pattern does it serve?

VERIFICATION
    what source/evidence proves the obligation?
~~~

Example:

~~~
REQ-CGM-CONTINUITY-001
        |
        v
pattern.cgm.acquisition-observation-separation
        |
        +-> CgmHistoryReconciler
        +-> CgmMeasurementAvailability
        |
        v
G02 / G03 verification
        |
        v
exact-source evidence
~~~

## Change-impact pressure

A requirement or pattern change should make affected bindings discoverable:

~~~
requirement changed
-> pattern(s)
-> implementation owner(s)
-> verification source(s)
-> current evidence
~~~

This is a map, not another work-management ceremony.

## Acceptance threshold

The common Design Trace mechanism is earned only if at least several distinct Vex examples can use the
same small relationship grammar without losing meaning.

Candidate pressure surfaces:

~~~
VexCgmLabs
    acquisition vs observation continuity

Cloud Connectivity C05
    ambiguous remote outcome / idempotent reconciliation

Full Security
    revoked-device protected-operation denial

existing Vex currentness specimen
    stale observation cannot overwrite newer accepted truth
~~~

If these need substantially different relationship models, do not force them into one generic
regulatory abstraction.

<!-- [VXG RealForever][VEX-CGM-LABS][DESIGN-TRACE] -->
