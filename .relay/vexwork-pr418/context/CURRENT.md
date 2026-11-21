# PR418 A2 SourceOwner companion

[VXG RealForever]

This branch carries proof context and canonical RETURN custody only. It is not Product source and is not a merge dependency.

## Exact candidate

```text
PR    #418
base  5adc12ac7983773a82955c4ef6d59fc386add75f
head  c2d7edcc8b54baf2f41e3e90b6bc369937b83824
tree  fc4e733086caa40219b3b84b6985d9731503a75d
branch VXG-112126-localization-shared-frame-prod-preview-a001
```

Human lived preview: ACCEPTED.

## Current Relay binding

```text
contractRef source.vexrelay.current-contract/v1
contractBlob b53cbac01c2deeb45fad5c32ce98e0796c04126f
sdkHead 6f8f6f50467f5df5a542713f7dc25b82db4ac8fa
sdkTree 96795640b01f1969da980f52d5a8ec136a8c44aa
recipe ExactHeadSourceOwnerProof
host macos-victor
carrier adapter.vexlocalbridge.native-vexrelay-task-archive/v1
```

## Bootstrap

```text
VEXWORK-PR418-A2-SOURCE-OWNER-BOOTSTRAP-A001--sha256-dd7d211fb5cc1e1804dcadf2212c1cae745ea6491480b5843ca89ecbb382a766.zip
sha256 dd7d211fb5cc1e1804dcadf2212c1cae745ea6491480b5843ca89ecbb382a766
bytes 20579
gitBlob 49d3eabb0359deb2a70b2d0261ff226b7260a7b5
```

The bootstrap forms the actual VexLocalBridge task on the host with the current SDK package builder and real formation clock, executes it once, and publishes only the canonical outer RETURN plus receipt to:

```text
.relay/vexwork-pr418/a001/return/
```

On PASS: consume exact RETURN, then fresh Independent Assurance. No READY or merge effect is included.
