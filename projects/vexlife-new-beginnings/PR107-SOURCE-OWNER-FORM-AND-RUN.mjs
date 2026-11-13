import fs from 'node:fs';
import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const CONTINUITY = '[VXG RealForever]';
const SDK_REPOSITORY = 'vgong24/Vextreme-SDK';
const SDK_HEAD = '1c2c9d76114ca35f00125f0a5c93e531e3e6a746';
const SDK_TREE = '6376f68279f0750ee6d3868b8472368199763064';
const CONTRACT_REF = 'source.vexrelay.current-contract/v1';
const PRODUCT_HEAD = 'f58890f77fc4bc60b233cd3d6115976eea60c890';
const PRODUCT_TREE = '51ae9283035b3eee9d568654eb1dabf33857c3f6';
const SDK_BLOB_GUARDS = {
  "docs/private-continuity/vexrelay/current-contract.json": "b53cbac01c2deeb45fad5c32ce98e0796c04126f",
  "lib/vexrelay/recipe-compiler.mjs": "60bb10627cc008f1da92d5e415c631516ed07ec0",
  "lib/vexrelay/manifest.mjs": "684f2b4bfb100ef57f477815fd5256e8e901f391",
  "lib/vexrelay/package.mjs": "bf35fb267301d8230b999ae69cc4b21180c53444",
  "lib/vexrelay/constants.mjs": "bb720778cee3f3ec3b131de8f2f62ebd11a4f669",
  "lib/vexrelay/result.mjs": "c676471167343539228c7de94436daa279974298",
  "lib/vexrelay/return-consumer.mjs": "baf8e1ac72c44ae8b48f8f1491fa06941dd13331",
  "lib/vexlocalbridge/vexrelay-task-archive-carrier-formation.mjs": "519713b9ab6324d921de78bde69547c24c1d5fd1",
  "lib/vexlocalbridge/vexrelay-task-archive.js": "7efb11de42e30234c48cde2ab832ad8fb5b2ed29",
  "lib/vexlocalbridge/package-builder.js": "40dc79c2728b2f0f35b6925bd96db7583071fb34",
  "lib/vexlocalbridge/templates/RUN-VEX-TASK.command": "fa5a9c7bb3de10a30ee856452f7086e4c11eb3ea",
  "docs/private-continuity/vexlocalbridge/profiles/macos-victor-vextreme-sdk.json": "05bb84b74cb0fcf35f330ced1481c9d2fc167b3a"
};
const SEED_TEMPLATE = {
  "schemaVersion": "vex.relay.task/v2",
  "continuity": "[VXG RealForever]",
  "taskRef": "task.vexlife-prod.pr107.entry-realization.source-owner",
  "attemptRef": "attempt.vexlife-prod.pr107.entry-realization.source-owner.a009",
  "requestRef": "request.vexlife-prod.pr107.entry-realization.source-owner.a009",
  "correlationRef": "correlation.vexlife-prod.pr107.entry-realization.source-owner.a009",
  "packageRef": "package.vexlife-prod.pr107.entry-realization.source-owner.a009",
  "original": {
    "originalIntent": "Complete the VexLife startup/Product-entry trajectory so a human can truthfully reach one current local VexLife Product.",
    "originalGoal": "Prove the exact PR107 selected-Home/Product-entry candidate without performing Home, model, runtime, Product-service, merge, Release, Pages, or redirect effects.",
    "userProtectedIntent": "Preserve human-owned Vex Home choice, VexArchitecture ownership, two-step Home/setup consent, parallel-worker alignment, no GitHub Actions, and no Local Source Workspace route.",
    "sourceRefs": [
      "github.pull.vexlife-prod.107",
      "github.pull.vexlife-prod.107.comment.6850894747",
      "github.pull.vexlife-prod.107.comment.6851055600",
      "github.pull.vexlife-prod.107.comment.6851134103",
      "github.pull.vexlife-prod.107.comment.6851372123",
      "github.pull.vexlife-prod.107.comment.6851471470",
      "github.pull.vexwork.302"
    ]
  },
  "lane": {
    "entryClass": "SAME_LANE_ROLE_TRANSITION",
    "scopeMode": "STAGE_BOUNDED",
    "laneRef": "lane.vexlife.new-beginnings.product-entry",
    "parentRootRef": "project.vexlife.new-beginnings",
    "workRef": "work.vexlife.new-beginnings.setup-journey-map",
    "claimRef": "github.pull.vexlife-prod.107",
    "returnRouteRef": "github.pull.vexlife-prod.107",
    "ownerRef": "actor.chatgpt.fresh-canonical-home",
    "rootHubRef": "github.pull.vexwork.302"
  },
  "role": {
    "activeRole": "CODER",
    "roleRef": "role.coder.vexlife-prod.pr107.entry-realization",
    "instanceRef": "instance.chatgpt.vexlife-prod.pr107.entry-realization.20261113.a009",
    "occupancyRef": "occupancy.coder.vexlife-prod.pr107.entry-realization.20261113.a009",
    "providerBindingRef": "provider.github.vexlife-prod.pr107",
    "threadRef": "thread.vexlife-prod.pr107.entry-realization",
    "authorityEnvelopeRef": "authority-envelope.vexlife-prod.pr107.source-owner.a009"
  },
  "capabilities": {
    "platformGitHubRead": "AVAILABLE",
    "platformGitHubWrite": "UNAVAILABLE"
  },
  "execution": {
    "hostProfile": "macos-victor",
    "executionSurface": "MAC_ZIP_RUN_COMMAND",
    "singleUseNonce": "nonce-vexlife-prod-pr107-entry-realization-source-owner-a009-20261113",
    "duplicateAttemptMarker": "marker.vexlife-prod.pr107.entry-realization.source-owner.a009",
    "duplicateProtectionMode": "OUTER_RELAY_BOUND"
  },
  "workspace": {
    "mode": "RUN_ROOT",
    "projectRef": "project.vexlife.new-beginnings",
    "projectPath": "pr107-sourceowner-a009",
    "createRoot": false,
    "createProjectPath": true
  },
  "repositories": [
    {
      "repositoryRef": "primary",
      "mode": "CLONE_IN_WORKSPACE",
      "cloneTransport": "GITHUB_GH",
      "githubHostname": "github.com",
      "nameWithOwner": "VexGPT/VexLife-Prod",
      "localPath": "repo",
      "remote": "origin",
      "baseBranch": "main",
      "acceptedBase": "3f91379eea2688ffa32d0f8903169cd9fc434233",
      "checkoutRef": "f58890f77fc4bc60b233cd3d6115976eea60c890",
      "expectedHead": "f58890f77fc4bc60b233cd3d6115976eea60c890",
      "branch": "VXG-111226-vexlife-prod-fresh-canonical-home-a001",
      "expectedRemoteUrl": null
    }
  ],
  "authority": {
    "authorityRef": "authority.vexlife-prod.pr107.source-owner.a009",
    "authorityMode": "EXACT_STAGE_EFFECTS",
    "grantedEffects": [
      "CHECK_AUTH",
      "READ_REPOSITORY",
      "CHECK_STATE",
      "RUN_LOCAL_COMMAND",
      "QUERY_PROVIDER",
      "FORM_RESULT"
    ],
    "conditionalEffects": [],
    "consumedEffects": [],
    "remainingEffects": [
      "CHECK_AUTH",
      "READ_REPOSITORY",
      "CHECK_STATE",
      "RUN_LOCAL_COMMAND",
      "QUERY_PROVIDER",
      "FORM_RESULT"
    ],
    "heldEffects": [
      "APPROVE_EXACT_HEAD",
      "MARK_READY",
      "ORDINARY_MERGE",
      "POST_MERGE_VERIFY"
    ],
    "repositoryMembranes": [
      {
        "repositoryRef": "primary",
        "allowedPaths": [
          "docs/foundation/INDEX.md",
          "docs/foundation/PRIVATE-IMAGE-INSTALL-SETUP.md",
          "docs/foundation/VEXLIFE-PROD-HOME.md",
          "packaging/bootstrap/vexlife-prod-bootstrap.command.template",
          "packaging/private-service-image/setup/vexlife-prod-setup-window.applescript",
          "src/commonMain/kotlin/vexlife/entry/VexLifeProdEntryFamily.kt",
          "src/commonMain/kotlin/vexlife/home/VexLifeProdHome.kt",
          "src/commonMain/kotlin/vexlife/service/VexLifeProdServiceContract.kt",
          "src/commonTest/kotlin/vexlife/entry/VexLifeProdEntryFamilyTest.kt",
          "src/commonTest/kotlin/vexlife/home/VexLifeProdHomeTest.kt",
          "src/jvmMain/kotlin/vexlife/home/VexLifeProdHomeFiles.kt",
          "src/jvmMain/kotlin/vexlife/local/VexLifeProdLocalSetup.kt",
          "src/jvmMain/kotlin/vexlife/service/VexLifeProdCurrentState.kt",
          "src/jvmMain/kotlin/vexlife/service/VexLifeProdLocalService.kt",
          "src/jvmMain/kotlin/vexlife/service/VexLifeProdMacServiceLifetime.kt",
          "src/jvmMain/kotlin/vexlife/service/VexLifeProdServiceProcess.kt",
          "src/jvmMain/kotlin/vexlife/setup/VexLifeProdMacFrontDoor.kt",
          "src/jvmMain/kotlin/vexlife/setup/VexLifeProdSetupProcess.kt",
          "src/jvmTest/kotlin/vexlife/home/VexLifeProdHomeFilesTest.kt",
          "src/jvmTest/kotlin/vexlife/local/VexLifeProdLocalSetupTest.kt",
          "src/jvmTest/kotlin/vexlife/packaging/VexLifeProdBootstrapTemplateTest.kt",
          "src/jvmTest/kotlin/vexlife/service/VexLifeProdCurrentStateTest.kt",
          "src/jvmTest/kotlin/vexlife/service/VexLifeProdMacServiceLifetimeTest.kt",
          "src/jvmTest/kotlin/vexlife/service/VexLifeProdServiceProcessTest.kt",
          "src/jvmTest/kotlin/vexlife/setup/VexLifeProdMacFrontDoorTest.kt",
          "src/jvmTest/kotlin/vexlife/setup/VexLifeProdSetupProcessTest.kt"
        ]
      }
    ],
    "allowedExecutables": [
      "git",
      "gh",
      "node",
      "/bin/bash",
      "/usr/bin/osacompile"
    ],
    "allowedEnvironment": [],
    "remoteObservationOwner": "Operations",
    "allowMutationLoop": false,
    "stopConditions": [
      "STOP_ON_UNKNOWN",
      "STOP_ON_AUTH_BLOCK",
      "STOP_ON_TEST_FAILURE",
      "STOP_ON_PATH_ESCAPE"
    ]
  },
  "source": {
    "sourceSetRef": "source.vexlife-prod.pr107.entry-realization",
    "sourceVersionRef": "github.pull.vexlife-prod.107.head.f58890f77fc4bc60b233cd3d6115976eea60c890",
    "overlapEvidenceRef": "github.pull.vexlife-prod.107.comment.6849066558",
    "activeConflictState": "NONE",
    "candidateState": "EXACT",
    "candidateHead": "f58890f77fc4bc60b233cd3d6115976eea60c890",
    "candidateTree": "51ae9283035b3eee9d568654eb1dabf33857c3f6",
    "expectedChangedPaths": [
      {
        "repositoryRef": "primary",
        "path": "docs/foundation/INDEX.md"
      },
      {
        "repositoryRef": "primary",
        "path": "docs/foundation/PRIVATE-IMAGE-INSTALL-SETUP.md"
      },
      {
        "repositoryRef": "primary",
        "path": "docs/foundation/VEXLIFE-PROD-HOME.md"
      },
      {
        "repositoryRef": "primary",
        "path": "packaging/bootstrap/vexlife-prod-bootstrap.command.template"
      },
      {
        "repositoryRef": "primary",
        "path": "packaging/private-service-image/setup/vexlife-prod-setup-window.applescript"
      },
      {
        "repositoryRef": "primary",
        "path": "src/commonMain/kotlin/vexlife/entry/VexLifeProdEntryFamily.kt"
      },
      {
        "repositoryRef": "primary",
        "path": "src/commonMain/kotlin/vexlife/home/VexLifeProdHome.kt"
      },
      {
        "repositoryRef": "primary",
        "path": "src/commonMain/kotlin/vexlife/service/VexLifeProdServiceContract.kt"
      },
      {
        "repositoryRef": "primary",
        "path": "src/commonTest/kotlin/vexlife/entry/VexLifeProdEntryFamilyTest.kt"
      },
      {
        "repositoryRef": "primary",
        "path": "src/commonTest/kotlin/vexlife/home/VexLifeProdHomeTest.kt"
      },
      {
        "repositoryRef": "primary",
        "path": "src/jvmMain/kotlin/vexlife/home/VexLifeProdHomeFiles.kt"
      },
      {
        "repositoryRef": "primary",
        "path": "src/jvmMain/kotlin/vexlife/local/VexLifeProdLocalSetup.kt"
      },
      {
        "repositoryRef": "primary",
        "path": "src/jvmMain/kotlin/vexlife/service/VexLifeProdCurrentState.kt"
      },
      {
        "repositoryRef": "primary",
        "path": "src/jvmMain/kotlin/vexlife/service/VexLifeProdLocalService.kt"
      },
      {
        "repositoryRef": "primary",
        "path": "src/jvmMain/kotlin/vexlife/service/VexLifeProdMacServiceLifetime.kt"
      },
      {
        "repositoryRef": "primary",
        "path": "src/jvmMain/kotlin/vexlife/service/VexLifeProdServiceProcess.kt"
      },
      {
        "repositoryRef": "primary",
        "path": "src/jvmMain/kotlin/vexlife/setup/VexLifeProdMacFrontDoor.kt"
      },
      {
        "repositoryRef": "primary",
        "path": "src/jvmMain/kotlin/vexlife/setup/VexLifeProdSetupProcess.kt"
      },
      {
        "repositoryRef": "primary",
        "path": "src/jvmTest/kotlin/vexlife/home/VexLifeProdHomeFilesTest.kt"
      },
      {
        "repositoryRef": "primary",
        "path": "src/jvmTest/kotlin/vexlife/local/VexLifeProdLocalSetupTest.kt"
      },
      {
        "repositoryRef": "primary",
        "path": "src/jvmTest/kotlin/vexlife/packaging/VexLifeProdBootstrapTemplateTest.kt"
      },
      {
        "repositoryRef": "primary",
        "path": "src/jvmTest/kotlin/vexlife/service/VexLifeProdCurrentStateTest.kt"
      },
      {
        "repositoryRef": "primary",
        "path": "src/jvmTest/kotlin/vexlife/service/VexLifeProdMacServiceLifetimeTest.kt"
      },
      {
        "repositoryRef": "primary",
        "path": "src/jvmTest/kotlin/vexlife/service/VexLifeProdServiceProcessTest.kt"
      },
      {
        "repositoryRef": "primary",
        "path": "src/jvmTest/kotlin/vexlife/setup/VexLifeProdMacFrontDoorTest.kt"
      },
      {
        "repositoryRef": "primary",
        "path": "src/jvmTest/kotlin/vexlife/setup/VexLifeProdSetupProcessTest.kt"
      }
    ],
    "intentionallyUnchangedAuthorizedPaths": []
  },
  "policy": {
    "maxOuterReturnFiles": 10,
    "maxSelectedSourceEntries": 10,
    "maxSelectedSourceBytes": 500000,
    "maxDiffBytes": 5000000,
    "requireRacePreflightBeforeMutation": false,
    "requireLocalValidationBeforePublish": false,
    "requireInputPackageManifest": true,
    "signoffCommit": true,
    "draftPullRequest": true
  }
};
const STAGE = {
  "repositoryRef": "primary",
  "expectedBase": "3f91379eea2688ffa32d0f8903169cd9fc434233",
  "expectedHead": "f58890f77fc4bc60b233cd3d6115976eea60c890",
  "expectedTree": "51ae9283035b3eee9d568654eb1dabf33857c3f6",
  "branch": "VXG-111226-vexlife-prod-fresh-canonical-home-a001",
  "proofCommands": [
    {
      "command": "/bin/bash",
      "args": [
        "./gradlew",
        "--no-daemon",
        "compileKotlinJvm",
        "compileTestKotlinJvm",
        "jvmTest",
        "compileKotlinJs",
        "compileTestKotlinJs",
        "assembleVexLifeProdServiceImage"
      ],
      "predicateClass": "SOURCE_OWNER_REPOSITORY",
      "predicateRef": "predicate.vexlife-prod.pr107.source-owner.repository-proof",
      "timeoutMs": 1800000
    },
    {
      "command": "/usr/bin/osacompile",
      "args": [
        "-o",
        "../VexLife-Prod-PR107-Setup-Proof.app",
        "packaging/private-service-image/setup/vexlife-prod-setup-window.applescript"
      ],
      "predicateClass": "SOURCE_OWNER_REPOSITORY",
      "predicateRef": "predicate.vexlife-prod.pr107.source-owner.native-window-compile",
      "timeoutMs": 600000
    }
  ],
  "maxFiles": 10,
  "stateRef": "state.vexlife-prod.pr107.entry-realization.source-ready",
  "currentLifecycleState": "SOURCE_READY",
  "currentGoal": "Prove the exact PR107 selected-Home Product-entry realization candidate on the qualified Mac host without Product effects.",
  "remainingGoals": [
    "Run fresh semantic Assurance on an exact proved head.",
    "Reach lived native Product-entry proof only after source proof and semantic clearance are earned."
  ],
  "onPass": {
    "lifecycleState": "ASSURANCE_PENDING",
    "nextFunction": "F13.RUN_FRESH_ASSURANCE",
    "nextOwner": "Operations",
    "whyThisIsNext": "Exact-head SourceOwner proof is complete; semantic Assurance remains a separate gate before lifecycle effects."
  },
  "resultFilename": "RETURN-VEXLIFE-PROD-PR107-ENTRY-REALIZATION-SOURCEOWNER-A009.zip"
};
const AUTHORITY = {
  "authoritySchemaRef": "vextreme.effect-transaction/v1",
  "semanticAdmissionRef": "github.pull.vexlife-prod.107",
  "transactionRef": "transaction.vexlife-prod.pr107.entry-realization.source-owner.a009",
  "transactionVersion": 1,
  "allowedEffectRefs": [
    "effect.vexrelay.execute"
  ],
  "heldEffectRefs": [
    "effect.vexlife-prod.home",
    "effect.vexlife-prod.model-runtime",
    "effect.vexlife-prod.service",
    "effect.vexlife-prod.merge",
    "effect.vexlife-prod.release"
  ]
};
const OUTER = {
  "schemaVersion": "vextreme.vexlocalbridge-task-manifest/v1",
  "artifactClass": "EXECUTABLE_RELAY",
  "taskRef": "task.vexlife-prod.pr107.entry-realization.source-owner.carrier",
  "attemptRef": "attempt.vexlife-prod.pr107.entry-realization.source-owner.carrier.a009",
  "packageRef": "package.vexlife-prod.pr107.entry-realization.source-owner.carrier.a009",
  "requestRef": "request.vexlife-prod.pr107.entry-realization.source-owner.carrier.a009",
  "correlationRef": "correlation.vexlife-prod.pr107.entry-realization.source-owner.carrier.a009",
  "taskStorageKey": "vexlife-pr107-entry-sourceowner",
  "attemptStorageKey": "a009",
  "requestingRoleRef": "Operations[LocalVex]",
  "requestingInstanceRef": "instance.chatgpt.vexlife-prod.pr107.entry-realization.20261113.a009",
  "parentOperationsRef": "github.pull.vexlife-prod.107",
  "returnRouteRef": "github.pull.vexlife-prod.107",
  "hostProfileRef": "macos-victor",
  "repositoryExecutionProfileRefOrNull": "profile.repository.vextreme-sdk.macos-v1",
  "repositoryRefOrNull": "VexGPT/VexLife-Prod",
  "baseRefOrNull": "3f91379eea2688ffa32d0f8903169cd9fc434233",
  "headRefOrNull": "f58890f77fc4bc60b233cd3d6115976eea60c890",
  "treeRefOrNull": "51ae9283035b3eee9d568654eb1dabf33857c3f6",
  "branchRefOrNull": "VXG-111226-vexlife-prod-fresh-canonical-home-a001",
  "claimRefOrNull": "github.pull.vexlife-prod.107",
  "exactPathRefs": [
    "docs/foundation/INDEX.md",
    "docs/foundation/PRIVATE-IMAGE-INSTALL-SETUP.md",
    "docs/foundation/VEXLIFE-PROD-HOME.md",
    "packaging/bootstrap/vexlife-prod-bootstrap.command.template",
    "packaging/private-service-image/setup/vexlife-prod-setup-window.applescript",
    "src/commonMain/kotlin/vexlife/entry/VexLifeProdEntryFamily.kt",
    "src/commonMain/kotlin/vexlife/home/VexLifeProdHome.kt",
    "src/commonMain/kotlin/vexlife/service/VexLifeProdServiceContract.kt",
    "src/commonTest/kotlin/vexlife/entry/VexLifeProdEntryFamilyTest.kt",
    "src/commonTest/kotlin/vexlife/home/VexLifeProdHomeTest.kt",
    "src/jvmMain/kotlin/vexlife/home/VexLifeProdHomeFiles.kt",
    "src/jvmMain/kotlin/vexlife/local/VexLifeProdLocalSetup.kt",
    "src/jvmMain/kotlin/vexlife/service/VexLifeProdCurrentState.kt",
    "src/jvmMain/kotlin/vexlife/service/VexLifeProdLocalService.kt",
    "src/jvmMain/kotlin/vexlife/service/VexLifeProdMacServiceLifetime.kt",
    "src/jvmMain/kotlin/vexlife/service/VexLifeProdServiceProcess.kt",
    "src/jvmMain/kotlin/vexlife/setup/VexLifeProdMacFrontDoor.kt",
    "src/jvmMain/kotlin/vexlife/setup/VexLifeProdSetupProcess.kt",
    "src/jvmTest/kotlin/vexlife/home/VexLifeProdHomeFilesTest.kt",
    "src/jvmTest/kotlin/vexlife/local/VexLifeProdLocalSetupTest.kt",
    "src/jvmTest/kotlin/vexlife/packaging/VexLifeProdBootstrapTemplateTest.kt",
    "src/jvmTest/kotlin/vexlife/service/VexLifeProdCurrentStateTest.kt",
    "src/jvmTest/kotlin/vexlife/service/VexLifeProdMacServiceLifetimeTest.kt",
    "src/jvmTest/kotlin/vexlife/service/VexLifeProdServiceProcessTest.kt",
    "src/jvmTest/kotlin/vexlife/setup/VexLifeProdMacFrontDoorTest.kt",
    "src/jvmTest/kotlin/vexlife/setup/VexLifeProdSetupProcessTest.kt"
  ],
  "authorityBinding": {
    "authoritySchemaRef": "vextreme.effect-transaction/v1",
    "authorityEnvelopePath": "authority/effect.json",
    "authorityEnvelopeSha256": "0000000000000000000000000000000000000000000000000000000000000000",
    "semanticAdmissionRef": "stale",
    "transactionRef": "stale",
    "transactionVersion": 1,
    "allowedEffectRefs": [
      "stale"
    ],
    "heldEffectRefs": []
  },
  "payload": {
    "payloadClass": "VEXRELAY_TASK_ARCHIVE",
    "payloadRuntime": "NATIVE_VEXRELAY",
    "payloadPath": "payload/inner-vexrelay.zip",
    "payloadSha256": "0000000000000000000000000000000000000000000000000000000000000000",
    "typedArgv": [],
    "immutableInputs": [
      {
        "path": "inputs/vexrelay-binding.json",
        "sha256": "0000000000000000000000000000000000000000000000000000000000000000"
      }
    ]
  },
  "executionStateAtFormation": "TASK_PREPARED",
  "singleUseNonce": "nonce-vexlife-prod-pr107-entry-realization-carrier-a009-20261113",
  "stopConditions": [
    "stop.on.identity.drift"
  ],
  "archiveDigestBinding": "FILENAME_SHA256"
};

function fail(message) {
  throw new Error(message);
}
function resolveExecutable(candidates, label) {
  for (const candidate of candidates) {
    try {
      fs.accessSync(candidate, fs.constants.X_OK);
      return candidate;
    } catch {}
  }
  fail(label + ' unavailable');
}
function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    env: options.env || process.env,
    shell: false,
    encoding: 'utf8',
    stdio: options.capture === false ? 'inherit' : ['ignore', 'pipe', 'pipe'],
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    const stderr = options.capture === false ? '' : String(result.stderr || '').trim();
    const stdout = options.capture === false ? '' : String(result.stdout || '').trim();
    fail(
      'command failed (' + result.status + '): ' + command + ' ' + args.join(' ') +
      (stderr ? '\nstderr: ' + stderr : '') +
      (stdout ? '\nstdout: ' + stdout : '')
    );
  }
  return options.capture === false ? '' : String(result.stdout || '').trim();
}
function requireEqual(actual, expected, label) {
  if (actual !== expected) fail(label + ' mismatch: ' + String(actual) + ' != ' + String(expected));
}
function sha256File(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

async function main() {
  console.log(CONTINUITY);
  console.log('PR107 SourceOwner A009: grounding exact current SDK source...');

  const downloads = path.join(os.homedir(), 'Downloads');
  await fsp.mkdir(downloads, { recursive: true });

  const git = resolveExecutable(['/usr/bin/git'], 'qualified git');
  const gh = resolveExecutable(['/opt/homebrew/bin/gh', '/usr/local/bin/gh'], 'qualified gh');
  const bash = resolveExecutable(['/bin/bash'], 'qualified bash');

  run(gh, ['auth', 'status', '--hostname', 'github.com'], { capture: false });

  const root = await fsp.mkdtemp(path.join(downloads, '.vex-pr107-source-owner-a009-'));
  const sdkRoot = path.join(root, 'Vextreme-SDK');

  try {
    run(gh, ['repo', 'clone', SDK_REPOSITORY, sdkRoot, '--', '--no-checkout'], { capture: false });
    run(git, ['-C', sdkRoot, 'checkout', '--detach', SDK_HEAD]);

    requireEqual(run(git, ['-C', sdkRoot, 'rev-parse', 'HEAD']), SDK_HEAD, 'SDK HEAD');
    requireEqual(run(git, ['-C', sdkRoot, 'rev-parse', 'HEAD^{tree}']), SDK_TREE, 'SDK tree');
    requireEqual(run(git, ['-C', sdkRoot, 'status', '--porcelain=v1', '-uall']), '', 'SDK clean source');

    for (const [p, expected] of Object.entries(SDK_BLOB_GUARDS)) {
      requireEqual(run(git, ['-C', sdkRoot, 'rev-parse', 'HEAD:' + p]), expected, 'SDK blob ' + p);
    }

    const contract = JSON.parse(
      await fsp.readFile(
        path.join(sdkRoot, 'docs/private-continuity/vexrelay/current-contract.json'),
        'utf8',
      ),
    );
    requireEqual(contract.contractRef, CONTRACT_REF, 'Relay contractRef');

    const recipeModule = await import(
      pathToFileURL(path.join(sdkRoot, 'lib/vexrelay/recipe-compiler.mjs')).href
    );
    const carrierModule = await import(
      pathToFileURL(path.join(sdkRoot, 'lib/vexlocalbridge/vexrelay-task-archive-carrier-formation.mjs')).href
    );

    const seed = structuredClone(SEED_TEMPLATE);
    const now = new Date();
    seed.execution.formedAt = now.toISOString();
    seed.execution.expiresAtOrNull = new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString();

    const preflight = recipeModule.compileRelayRecipe({
      recipe: 'ExactHeadSourceOwnerProof',
      seed,
      stage: structuredClone(STAGE),
    });

    requireEqual(preflight.source.candidateHead, PRODUCT_HEAD, 'preflight candidate head');
    requireEqual(preflight.source.candidateTree, PRODUCT_TREE, 'preflight candidate tree');
    requireEqual(preflight.repositories[0].checkoutRef, PRODUCT_HEAD, 'preflight checkoutRef');
    requireEqual(preflight.completionPolicy.stageGateOrNull, 'EXACT_HEAD_SOURCE_OWNER_PROOF', 'preflight gate');

    console.log('PR107 SourceOwner A009: forming current-contract native carrier...');
    const formed = await carrierModule.formVexRelayTaskArchiveCarrier({
      recipe: 'ExactHeadSourceOwnerProof',
      seed,
      stage: structuredClone(STAGE),
      outerTaskTemplate: structuredClone(OUTER),
      authorityEnvelope: structuredClone(AUTHORITY),
      outputDirectory: downloads,
      outputStem: 'VEXLIFE-PROD-PR107-ENTRY-REALIZATION-SOURCEOWNER-A009',
      ttlMs: 8 * 60 * 60 * 1000,
    });

    requireEqual(formed.outer.formationEvidence.finalByteQualification, 'PASS', 'outer final-byte qualification');
    requireEqual(formed.inner.manifest.source.candidateHead, PRODUCT_HEAD, 'formed inner head');
    requireEqual(formed.inner.manifest.source.candidateTree, PRODUCT_TREE, 'formed inner tree');
    requireEqual(sha256File(formed.outer.finalZip), formed.outer.digest, 'formed outer digest');

    console.log('PR107 SourceOwner A009: formed exact task ' + formed.outer.finalZip);
    console.log('PR107 SourceOwner A009: task sha256=' + formed.outer.digest);

    const runner = path.join(sdkRoot, 'lib/vexlocalbridge/templates/RUN-VEX-TASK.command');
    const before = sha256File(formed.outer.finalZip);
    const result = spawnSync(bash, [runner, formed.outer.finalZip], {
      stdio: 'inherit',
      shell: false,
      env: process.env,
    });
    const after = sha256File(formed.outer.finalZip);
    requireEqual(after, before, 'outer task bytes after execution');

    if (result.error) throw result.error;
    console.log('PR107 SourceOwner A009: VexLocalBridge exit=' + String(result.status));
    console.log('PR107 SourceOwner A009: upload the canonical RETURN ZIP revealed by VexLocalBridge.');
    process.exitCode = result.status ?? 1;
  } finally {
    await fsp.rm(root, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error('\nPR107 SourceOwner A009 failed:\n' + (error?.stack || error));
  process.exitCode = 1;
});
