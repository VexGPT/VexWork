# A002 carrier incident

Continuity: `[VXG RealForever]`

A002 acquired exact SDK source and verified the authenticated `gh` session, then used anonymous HTTPS `git ls-remote` to probe the private VexWork candidate branch. That probe returned no SHA:

```text
CANDIDATE_BRANCH_HEAD_MOVED::<expected-head>
```

No Relay recipe compilation, outer task formation, attempt reservation, or candidate proof occurred.

A003 preserves the exact candidate and proof semantics while correcting repository acquisition to the current authenticated GitHub route:
- bootstrap candidate preflight via `gh api`;
- inner `cloneTransport=GITHUB_GH`;
- explicit `CHECK_AUTH` grant for the compiler-inserted auth operation.
