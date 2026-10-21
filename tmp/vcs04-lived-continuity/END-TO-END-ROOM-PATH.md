# VCS-04 end-to-end room establishment map

`[VXG RealForever]`

## The important distinction

There **is** an accepted canonical source path that creates the first Family room.

It is not the Android installed-read doorway.

### Canonical Family Host establishment

Owner:

```text
vgong24/VexLife
src/core/family-host-runtime.mjs
docs/VEX-FAMILY-HOST-ESTABLISHMENT.md
```

Accepted composition:

```text
authenticated Host authority
-> deriveFamilyEstablishmentIdentity()
   -> spaceRef
   -> familyCompanionLineageRef
   -> threadRef
   -> initialChannelRef

-> createFamilySpace()
   owner: family-space-store.mjs

-> createFamilyChannel()
   owner: family-conversation.mjs

-> materializeConversationChannel()
   owner: conversation-store.mjs

-> first canonical GROUP room exists durably in Vex Home
```

The source contract explicitly says the caller does not invent the canonical principal, space, thread, or channel identity.

Retry with the same authenticated establishment intent is designed to be idempotent.

## What Android currently does

Current Android source:

```text
VexFamilyConversationConnectedServiceClient.readSingleCurrentRoom()
-> private gateway bootstrap()
-> require bootstrap.rooms.size == 1
-> select that room
-> READ_THREAD_HISTORY
```

The doorway intentionally requires exactly one current bootstrap room.

It does **not** create a Family Space or a room.

Therefore:

```text
ANDROID_FAMILY_CONVERSATION_DOORWAY
!=
FAMILY_HOST_ESTABLISHMENT
```

## What A012 did

The lived proof needed a deterministic read fixture, so its harness directly composed the accepted lower owners:

```text
createFamilySpace()
-> addFamilyMember()
-> createFamilyChannel()
-> materializeConversationChannel()
-> appendBrowserFamilyMessage(seed)
```

That temporary fixture proved source composition and supplied an intended room/message for read testing.

But it is proof scaffolding:

```text
TEMPORARY_PROOF_ROOM
!=
FRESH_USER_PRODUCT_ESTABLISHMENT
```

The temporary Home is destroyed with the lived work root after RETURN formation.

## Missing product bridge

A true fresh-user Connected Services path still needs an admitted realization that connects:

```text
Home connected / authenticated human
-> Family Host establishment
-> first canonical Family Space + initial GROUP room
-> Android bootstrap sees current room
-> Android READ_THREAD_HISTORY
```

The rightful source owner for creating that first room already exists: `family-host-runtime.mjs`.

The missing work is the **product integration/admission path that invokes it at the right moment**, not another room schema or another conversation owner.

Do not solve this by:
- making Android invent a channelRef;
- making bootstrap silently create a room;
- making VexStream pairing own Family authority;
- hard-coding a fixture room into production;
- treating a temporary lived-test Family Space as the user's actual Vex Home.

## Current next-edge ordering

Preserve these as separate questions:

```text
A. diagnose Android -> private HTTPS gateway before session challenge
B. establish/admit fresh-user Family Host creation path
C. then prove bootstrap returns the newly-current room
D. then READ_THREAD_HISTORY + visible installed read
E. only after that move to durable Send exactly once
```

Whether A or B is executed first should be decided from current repository/product admission, but neither may be assumed away.

<!-- [VXG RealForever][VEXWORK][TEMP-CONTINUITY][VCS04][ROOM-PATH] -->
