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

## Current checkpoint

The first reusable slice is terminal accepted and has been consumed by real Android proof:

```text
API target runner           = COMPLETED
VexRelay target integration = READY
device lease / wait queue   = READY
Project root                = READY · HIGH
```

Accepted runner lineage:

- SDK PR #1895 merged the reusable API-compatible target runner;
- SDK PR #1896 currentized emulator renderer selection and passed real API28 configured-AVD boot / exact target identity / task-owned cleanup;
- VexStream subsequently consumed the runner for API36 and API28 native proof.

The remaining two rows are genuine work, not stale board debt. Current SDK runner source still states that **VexRelay schema/adapter integration** and a **general cross-lane lease/wait queue** are not supported by this slice; the current Relay contract also exposes no Android proof-target integration. The runner remains `waitPolicy = NONE`.

Therefore completion of the runner releases both downstream dependencies to READY; it does not imply their implementation.

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
+-- Reusable API target runner                  TASK / COMPLETED / HIGH
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

## VexStream relationship — dependency consumed

The reusable target-runner dependency is historical for VexStream rather than a current blocker.

VexStream consumed the accepted runner for the required native API coverage:

```text
API36 physical/native proof = PASS
API28 native proof          = PASS
```

That consumption helped close the durable-device proof subtree. The reusable runner remains available
to other Android callers, while the two unfinished Android Proof Orchestration rows stay separately READY:

```text
work.android-proof-orchestration.vexrelay-integration
work.android-proof-orchestration.device-lease-queue
```

```text
RUNNER_CONSUMED_BY_VEXSTREAM
!= ANDROID_PROOF_ORCHESTRATION_PROJECT_COMPLETE

HISTORICAL_TOOL_DEPENDENCY
!= CURRENT_VEXSTREAM_BLOCKER
```

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
