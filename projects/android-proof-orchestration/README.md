# Android Proof Orchestration

`[VXG RealForever]`

## Human outcome

Make Android-native proof **reusable and low-context across lanes**.

A feature worker should be able to say:

```text
prove this exact candidate
on Android API 24-28

or

prove this exact candidate
on Android API 29+
```

without rewriting ADB discovery, emulator boot, target selection, cleanup, or contention logic.

This Project groups that cross-lane outcome. Android product/proof semantics remain owned by
VexLife-Android; reusable host/device coordination remains owned by Vextreme-SDK / VexLocalBridge.

## Why this Project exists now

VexStream durable-device storage exposed repeated pressure while proving one exact source candidate:

- repository-local source proof passed and remained stable;
- the modern MediaStore branch had a real API 36 physical target and an API 36 AVD;
- the legacy permission/storage branch required API 24-28;
- lane-local Relay packages repeatedly had to rediscover device inventory, AVD availability, boot,
  cleanup and API coverage;
- some of that bespoke harness work failed independently of product source.

The existing foundations already say:

```text
eligible physical target
OR
already-configured qualified AVD
-> Android host proof

logical branches may use isolated devices/emulators
host coordinator owns Android availability/selection
```

The current VexStream coordinator also has exact/ambiguous device selection, but no generic
API-compatible AVD acquisition/lease foundation.

That is enough recurring pressure to source-place the reusable work instead of keeping the knowledge
in chat or another one-off Relay shell.

## Project shape

```text
Android Proof Orchestration                     OUTCOME
|
+-- Reusable API target runner                  TASK / READY / HIGH
|
+-- VexRelay Android target integration         TASK / waits on runner / HIGH
|
+-- Android device lease and wait queue         TASK / waits on runner / NORMAL
```

### First priority — reusable API target runner

The first deliverable is intentionally small enough to unblock VexStream.

Input should express a target requirement rather than a particular phone:

```text
apiExact
OR
apiMin + apiMax

proof command + args
```

The runner should then:

1. inventory connected ADB targets;
2. distinguish physical devices from emulators;
3. inspect configured AVD/API/ABI identity without booting everything merely to classify it;
4. select one compatible unambiguous target;
5. prefer an isolated compatible AVD when that avoids contention;
6. boot one already-configured compatible AVD when required;
7. never wipe or replace/save snapshots merely for routine proof;
8. emit exact serial/model/API/transport/AVD identity;
9. execute the repository-owned proof command;
10. stop only an emulator started by this task.

Missing Android SDK system images remain one explicit prerequisite; the runner does not silently
install packages or accept SDK licences.

### Second priority — VexRelay integration

Once target acquisition is stable:

```text
VexRelay Android proof request
+ target capability
-> reusable target coordinator
-> exact selected serial
-> repository-owned proof
-> canonical RETURN evidence
```

This removes bespoke target-discovery shell from each feature lane.

### Third priority — device lease / wait queue

Concurrent-lane coordination is real but should not delay VexStream storage completion.

The intended later behavior is:

```text
compatible free isolated AVD
  -> assign immediately

shared physical target already in use
  -> prefer compatible AVD
  -> otherwise bounded wait / queue

task-started emulator
  -> task-owned release

pre-existing physical device / emulator
  -> never stop merely because this task used it
```

This is the layer that can eventually let Connected Services, VexStream, ToCompletion and future
Android work coexist without racing one Compose/device surface.

## Current VexStream relationship

`work.vexstream.mobile-library.device-storage` has already implemented its product source and
retains repository-local proof. Its remaining native API-matrix proof now depends on:

```text
work.android-proof-orchestration.api-target-runner
```

VexStream therefore waits on the reusable tool rather than accumulating more one-off emulator scripts.

```text
WAITING_TOOL != PRODUCT_SOURCE_FAILURE
WAITING_TOOL != ANDROID_MAIN_DRIFT
FOUNDATION_DEPENDENCY != CONNECTED_SERVICES_COLLISION
```

Once the API target runner can realize the legacy API target, VexStream should consume it immediately,
finish exact-head device proof, and return to Assurance -> PR/merge -> post-merge -> rediscovery.

## Ownership boundaries

```text
VEXWORK PROJECT
  = navigation / priority / dependency

VEXLIFE-ANDROID
  = native product + proof semantics

VEXTREME-SDK / VEXLOCALBRIDGE
  = reusable host/device coordination

ANDROID TARGET
  != SOURCE AUTHORITY

EMULATOR BOOT
  != SDK PACKAGE INSTALL

DEVICE LEASE
  != PRODUCT SEMANTICS
```

Source claim: `vgong24/Vextreme-SDK#1894`.

<!-- [VXG RealForever][VEXWORK][PROJECT][ANDROID-PROOF-ORCHESTRATION] -->
