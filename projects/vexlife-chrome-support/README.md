# VexLife Chrome support

[VXG RealForever]

## Human outcome

Make **VexLife usable on supported Chromebooks as a truthful local-first Product body** without teaching
Conversation, Memory, Vex Context, Families, model selection, or VexWeb a new set of Chrome-specific
semantics.

The first target to pressure is deliberately bounded:

```text
ChromeOS x86_64
-> Chrome as the human presentation
-> Crostini / Linux as the local execution substrate
-> VexLife JVM Product service
-> Heretic 4B
-> GGUF + llama.cpp CPU realization
-> canonical Home / Conversation / Memory continuity
```

A physical Chromebook remains required before the Product may claim lived Chromebook support.

## Why this became a Project

The current VexLife-Prod architecture already separates Product meaning from platform realization, so
ChromeOS is not one installer tweak and it is not a reason to fork VexLife.

The work now spans several related but distinct owners:

```text
platform / architecture observation
Heretic model -> runtime realization
runtime artifact materialization
Product service image + lifetime
Chrome <-> Crostini loopback presentation
local VoiceInput / ASR
setup / distribution / update
real-device resource + lifecycle proof
```

Future workers would otherwise reconstruct those relationships from conversation history and from the
Mac/Windows source independently. That makes one durable VexWork Project useful now.

## Formation coordinates

```text
Project
project.vexlife.chrome-support

VexWork base at formation
27e325f211752552602fee6b994676ff22d1be61

VexLife-Prod main observed at formation
7f3935aec46b2030ebbc887fa8ccbf6199c93d36

formedAt
2026-11-21T06:52:00.000Z
```

VexWork owns the work topology and continuity only. VexLife-Prod remains the Product/source owner.

## Current source facts

These are observed current-source facts at the formation coordinate above, not future support claims.

### Existing platform/runtime seam

Current VexLife-Prod already separates:

```text
VexLifePlatformRealization.Target
  exact platform + architecture

HereticRuntimeRealization
  exact (model, target)
  -> Supported(realization)
  or Unsupported
```

The consumer-facing resolver intentionally avoids `if Mac / if Windows` branches.

### ChromeOS is not represented yet

At formation, `PlatformFamily` contains:

```text
MACOS
WINDOWS
ANDROID
IOS_IPADOS
```

and `VexLifeJvmPlatformTarget` explicitly returns Unsupported for a generic Linux JVM. A future
ChromeOS realization must positively establish the Crostini/ChromeOS relationship instead of
silently treating every Linux machine as a Chromebook.

### Heretic 4B already proves cross-platform realization

Mac ARM64:

```text
Heretic 4B
-> MLX
-> mlx_lm server
```

Windows x64:

```text
same Product model label: Heretic 4B Distill
-> model-Q4_K_M.gguf
-> 2,790,000,800 bytes
-> llama.cpp b10107 CPU
-> 127.0.0.1:18080
-> ctx-size 16384
-> no GPU offload
```

Permanent:

```text
SAME PRODUCT MODEL
!= SAME MODEL FILE REPRESENTATION
!= SAME RUNTIME IMPLEMENTATION
```

The exact upstream llama.cpp generation already publishes Ubuntu x64 and ARM64 CPU builds. That makes
Linux llama.cpp a concrete candidate, not proof of Crostini compatibility or performance.

### Local VoiceInput has the same extension seam

`VexLifeLocalAsrProviderRealizationResolver` currently registers Mac ARM64 and Windows x64
whisper.cpp realizations behind one target -> realization boundary. ChromeOS should pressure that
same seam instead of adding browser-specific VoiceInput semantics.

### Product service remains platform-specific

The current private Product service image is `darwin-arm64` with bundled Java 21. Model runtime
support alone does not make a Chromebook Product; Linux/Crostini still needs its own Product
service/lifetime realization.

## Initial architecture hypothesis — not accepted Product source

```text
ChromeOS
  human/device platform identity

Crostini / Debian Linux
  execution substrate beneath that platform

Chrome
  presentation/browser mechanics

VexLife JVM service
  Product-local service realization

HereticRuntimeRealization
  selected-model + target runtime composition

llama.cpp Linux CPU
  first Heretic 4B runtime candidate

VexWeb / Conversation / Memory / Vex Context / Families
  portable Product meaning
```

Do not introduce generic `LINUX == CHROMEOS` support merely because Crostini reports Linux.
Do not claim GPU/NPU acceleration until a current ChromeOS surface actually supports and proves it.

## Why Victor's Mac is useful without becoming Chromebook proof

An actual Linux x86_64 guest/container/VM on the Mac can pressure:

```text
Linux Java runtime
Linux VexLife service composition
Linux llama.cpp binary
exact 4B GGUF
OpenAI-compatible loopback
health / model / completion qualification
artifact acquisition / hashes
process start / stop / recovery
```

It cannot prove:

```text
Crostini detection
real Chromebook RAM pressure
real Chromebook CPU throughput / thermals
ChromeOS Linux lifecycle
sleep / logout / restart behavior
ChromeOS microphone behavior
ChromeOS setup UX
final real Chrome -> Crostini Product reach
```

Permanent:

```text
MAC-HOSTED LINUX PROOF
!= CHROMEOS LIVED PROOF
```

## Resource question

No Chromebook memory floor is declared by Project formation.

Current Product evidence establishes only that the Windows 4B GGUF is about 2.79 GB on disk and the
current Windows launch profile is CPU + 16K context. Product service/browser/OS/runtime memory is
additional, and no physical Chromebook has been measured.

## Current Work neighborhood

```text
VexLife Chrome support                                      RUNNING
├─ Ground ChromeOS host envelope / first target             RUNNING / IMMEDIATE
├─ Prove Linux runtime shape from a Mac-hosted guest         READY / HIGH
├─ Add exact ChromeOS platform observation + target          WAITING_DEPENDENCIES
├─ Realize Heretic 4B through Linux llama.cpp CPU            WAITING_DEPENDENCIES
├─ Realize VexLife Product service/lifetime in Crostini      WAITING_DEPENDENCIES
├─ Prove Chrome -> Crostini VexLife loopback/presentation    WAITING_DEPENDENCIES
├─ Add ChromeOS local VoiceInput / ASR realization           WAITING_DEPENDENCIES
├─ Form setup / distribution / update experience             WAITING_DEPENDENCIES
└─ Prove complete experience on a real Chromebook            WAITING_RESOURCE
```

The physical-device edge does not block source inspection, architecture, Linux realization work or
bounded Linux proof.

## Current edge

Two pieces can advance without a Chromebook:

1. Ground the exact first ChromeOS target and positive Crostini identity boundary.
2. Exercise the Linux 4B/service/runtime shape on actual Linux bytes from Victor's Mac while keeping
   every conclusion labeled Linux-only.

## Security relevance

Selective Security Assurance becomes relevant when the work changes model/runtime artifact
acquisition/update, local process/service lifetime, browser/service loopback, microphone/audio custody,
or recovery/replay. Project formation does not trigger a broad security audit.

## Formation boundary

This Project grants no VexLife-Prod implementation, model-download, runtime, release, lifecycle,
provider or merge authority.

```text
authorityDisposition = NO_AUTHORITY
effectDisposition    = NO_EFFECTS
```

## Fresh-instance resume route

A future instance should not replay the predecessor conversation.

Read:

```text
projects/vexlife-chrome-support/README.md
-> workgraphs/segments/vexlife-chrome-support.json
-> current VexLife-Prod README / AGENTS / foundation index
-> exact current source implicated by the active Work edge
```

Then preserve completed findings, re-ground only mutable VexLife-Prod currentness, and continue the
first executable Work edge.

## Generated discoverability / integration edge

Formation authors the semantic Project source and one independent Workgraph segment:

```text
projects/vexlife-chrome-support/README.md
projects/vexlife-chrome-support/project.json
workgraphs/segments/vexlife-chrome-support.json
```

Repository-owned generated consequences remain the next integration step:

```text
npm run workspace:build
-> blueprint/project-registry.json
-> workgraphs/public.json
-> public/workspace.json

npm run review
-> inspect exact generated/source proof
-> readiness / merge judgment
```

Permanent:

```text
PROJECT SOURCE FORMED
!= GENERATED DISCOVERABILITY CURRENT
!= REVIEW PASS
!= MERGED CURRENT VEXWORK
```

## External research anchors

- ChromeOS Linux environment: https://support.google.com/chromebook/answer/9145439
- ChromeOS localhost forwarding into Crostini:
  https://www.chromium.org/chromium-os/developer-library/reference/security/port-forwarding/
- llama.cpp b10107: https://github.com/ggml-org/llama.cpp/releases/tag/b10107

<!-- [VXG RealForever][VEXWORK][VEXLIFE][CHROME-SUPPORT][PROJECT] -->
