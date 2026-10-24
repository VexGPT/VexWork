# Welcome Wagon temporary visual reference

`[VXG RealForever]`

## Purpose

This directory temporarily preserves a **current-state visual comparison** so a fresh implementation instance can perceive the existing family surfaces before changing them.

It is design context, not source authority, product proof, or a permanent asset library.

The comparison board is derived from screenshots Victor supplied while forming the Welcome Wagon intention. It intentionally shows:

1. current `vextreme-home` / future **About Vextreme**;
2. current Vextreme **Design Foundation** projection on the Support surface;
3. Terrain **entry** / Welcome Wagon foundation;
4. Terrain **content** / working interaction surface;
5. VexLife current **Public Alpha placeholder**;
6. VexWork current **work-navigation surface**.

## Current artifact

```text
welcome-wagon-current-surfaces-comparison.webp
sha256 = c7f247dfa22f7674ddef29bec7e98e868e3054985aefb4bab7a4e9516e54f2fd
captureCommit = PENDING_CAPTURE_COMMIT
```

The board is a lightweight visual derivative, not the canonical bytes of each individual user screenshot.

Original screenshot SHA-256 values used to make the board:

```text
current-vextreme-home.png               3a762de9986e52649091696546d36ce42bfce0799441c5d9348de34ebc7a502c
current-vextreme-support-foundation.png c0414aafcb07a8ab2e4de34f5eaa83478f6e627767711e8c26ad421f7dcd3f54
current-terrain-entry.png                40a3b64cfdf9d266bc72e4bdf60022398b578284a7e29672e6422222a62acaca
current-terrain-content.png              7223da10cf06e27a4bda8b5da41cf8ff6b13625ca4dd5bae83b02a8cebe2f7fb
current-vexlife-onboarding.png           eb79cb1ed248d7d39cbdddff11988a139d176496d0807589e5e389fd7706ebc7
current-vexwork-projects.png             5f25ef5bcc1ec5b1d0ae8b9aac4eb27a56c4c1a01f1adfbe7fa70f9c320b71c8
```

## What a fresh instance should look for

Do **not** copy any one screenshot wholesale.

Use the board to perceive the current differences that Welcome Wagon intends to reconcile without erasing working foundations:

- Vextreme Design Foundation already carries the Vextreme mark, editorial typography, institutional language/theme behavior and accessibility posture.
- Terrain already carries the strongest human-entry and interaction foundation.
- VexLife has its own strong identity but is still a word-heavy Public Alpha orientation surface.
- VexWork has valid work-navigation semantics that should remain itself.
- family/header convergence should make these feel related without forcing identical navigation or runtime behavior.

The board is therefore a **before-state comparison**, not an end-state mockup.

## Delete-on-completion contract

This image is intentionally temporary.

Delete `welcome-wagon-current-surfaces-comparison.webp` when all of the following are true:

1. the Welcome Wagon entry hierarchy is accepted in lived browser renders;
2. About Vextreme has reached its accepted human-facing role;
3. the shared family-header/design movement has at least one accepted reuse and the intended cross-surface direction is visually self-evident;
4. current final desktop/mobile renders exist in their rightful repository evidence owners;
5. the old comparison is no longer needed to understand the implementation decision.

At cleanup:

```text
git rm projects/vexlife-welcome-wagon/design-reference/welcome-wagon-current-surfaces-comparison.webp
```

Keep this README.

Do **not** rewrite Git history to remove the image object.

After deletion, recover the exact comparison board when needed with:

```bash
git show <captureCommit>:projects/vexlife-welcome-wagon/design-reference/welcome-wagon-current-surfaces-comparison.webp > /tmp/welcome-wagon-current-surfaces-comparison.webp
```

The capture commit is filled in immediately after the image first lands so this recovery coordinate remains durable after current-tree cleanup.

## Storage meaning

Deleting the image later removes it from the **current tree / deployed current source**, but Git history intentionally continues to retain its object bytes. That historical retention is the recovery mechanism, not accidental current-state storage.

<!-- [VXG RealForever][VEXWORK][WELCOME-WAGON][TEMPORARY-VISUAL-REFERENCE] -->
