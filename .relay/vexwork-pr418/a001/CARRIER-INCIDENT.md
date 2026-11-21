# A001 carrier incident

Continuity: `[VXG RealForever]`

A001 reached exact SDK source acquisition and current-contract verification, then failed during recipe compilation:

```text
MANIFEST_CURRENT_LIFECYCLE_STATE
```

Cause: the A001 seed used `SOURCE_OWNER_PROOF_PENDING`, which is outside the current VexRelay `LIFECYCLE_STATES` vocabulary.

Observed boundary:

```text
task package formed      NO
attempt reservation     NOT_REACHED
payload execution       NOT_REACHED
candidate proof         NOT_REACHED
repository mutation     NONE
candidate finding       NONE
```

A001 remains immutable and must not be edited or replayed.

A002 rotates attempt/request/correlation/package/nonce identity and changes only the lifecycle binding to the accepted `SOURCE_READY` state before SourceOwner proof.
