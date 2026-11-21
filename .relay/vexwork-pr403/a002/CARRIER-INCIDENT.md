# A002 carrier incident — resolved

`[VXG RealForever]`

## Observed host failure

Victor ran the companion command against carrier head `4d620992be4ef9b2b0c95d9c1f6e8a0e24d87646`.

The companion runner stopped before extraction or SourceOwner task formation:

```text
expected=b4cac1a8ab0bf34ac51596186d63a2f2a523dc98614f5a505fb19cb51ef5f08c
observed=e02cf917b231cc20d3b3b21a1afc53c42bd1162fd6696be5604de118112617a2
```

No business payload or proof task executed.

## Root cause

The trusted A002 ZIP is:

```text
bytes=7306
sha256=b4cac1a8ab0bf34ac51596186d63a2f2a523dc98614f5a505fb19cb51ef5f08c
gitBlob=d79fac7dfd8b388034da8133e38bbdca144c2dda
```

The prior companion stored that ZIP as manually transferred base64 text.

Expected canonical base64 length:

```text
9744 characters
```

GitHub-held base64 length:

```text
9743 characters
```

One base64 character was missing. Decoding therefore produced different bytes and the digest guard correctly rejected them.

This was a carrier-formation defect, not Product source, candidate, host, or user failure.

## Repair

The active companion no longer uses base64 reconstruction.

It now carries the exact 7306-byte ZIP directly as a Git binary blob:

```text
path=.relay/vexwork-pr403/context/a002/VEXWORK-PR403-LOCALIZATION-A1-RELAY-BOOTSTRAP-A002--sha256-b4cac1a8ab0bf34ac51596186d63a2f2a523dc98614f5a505fb19cb51ef5f08c.zip
gitBlob=d79fac7dfd8b388034da8133e38bbdca144c2dda
sha256=b4cac1a8ab0bf34ac51596186d63a2f2a523dc98614f5a505fb19cb51ef5f08c
bytes=7306
```

The runner verifies byte count + SHA-256 directly on the checked-out binary before extraction.

The corrupt `.zip.b64` is removed from the active context path after its failure evidence is recorded here.

## Replay / identity

The failed host action never passed the carrier digest gate, so:
- no task was formed;
- no task reservation was consumed;
- no candidate proof executed;
- no repository mutation occurred.

The semantic A002 proof and candidate remain unchanged. The repair is transport-only.

<!-- [VEXWORK][PR403][A002][CARRIER-INCIDENT][RESOLVED] -->
