#!/bin/bash
set -euo pipefail

CONTINUITY='[VXG RealForever]'
SDK_REPOSITORY='vgong24/Vextreme-SDK'
SDK_HEAD='6f8f6f50467f5df5a542713f7dc25b82db4ac8fa'
SDK_TREE='96795640b01f1969da980f52d5a8ec136a8c44aa'
PRODUCT_REPOSITORY='VexGPT/VexWork'
PRODUCT_BASE='e3fd23dfff3bc98b4fca737c26e127fb21d1d800'
PRODUCT_HEAD='ca9650eb8b1f054ad09ec44abc815e8dabd7f1ea'
PRODUCT_BRANCH='VXG-112226-component-library-a5-workspace-a001'
PRODUCT_BASE_BRANCH='main'
ATTEMPT='A006'

resolve_exec() {
  local candidate
  for candidate in "$@"; do
    if [ -x "$candidate" ] && [ -f "$candidate" ]; then
      printf '%s' "$candidate"
      return 0
    fi
  done
  return 1
}

BASH_BIN="$(resolve_exec /bin/bash)" || { echo 'A006: qualified Bash unavailable.' >&2; exit 10; }
GIT_BIN="$(resolve_exec /usr/bin/git)" || { echo 'A006: qualified Git unavailable.' >&2; exit 11; }
GH_BIN="$(resolve_exec /opt/homebrew/bin/gh /usr/local/bin/gh)" || { echo 'A006: qualified GitHub CLI unavailable.' >&2; exit 12; }
NODE_BIN="$(resolve_exec /opt/homebrew/bin/node /usr/local/bin/node /usr/bin/node)" || { echo 'A006: qualified Node unavailable.' >&2; exit 13; }
MKTEMP_BIN="$(resolve_exec /usr/bin/mktemp)" || { echo 'A006: mktemp unavailable.' >&2; exit 14; }
RM_BIN="$(resolve_exec /bin/rm /usr/bin/rm)" || { echo 'A006: rm unavailable.' >&2; exit 15; }

ARCH="$(/usr/bin/uname -m)"
[ "$ARCH" = 'arm64' ] || { echo "A006: expected Apple-silicon arm64 host, observed $ARCH." >&2; exit 16; }

"$GH_BIN" auth status --hostname github.com >/dev/null 2>&1 || {
  echo 'A006: GitHub authentication is required before this proof can run.' >&2
  exit 17
}

ROOT="$("$MKTEMP_BIN" -d "$HOME/Downloads/.vexwork-pr428-component-library-source-a006.XXXXXX")"
SDK_ROOT="$ROOT/Vextreme-SDK"
FORMATION_RESULT="$ROOT/formation-result.json"
FORMATION_SCRIPT="$ROOT/form-vexwork-pr428-component-library-a006.mjs"

cleanup() {
  case "$ROOT" in
    "$HOME"/Downloads/.vexwork-pr428-component-library-source-a006.*) "$RM_BIN" -rf -- "$ROOT" ;;
    *) return 1 ;;
  esac
}
trap cleanup EXIT HUP INT TERM

echo 'A006: deriving exact immutable Product tree from pinned commit...'
PRODUCT_TREE="$("$GH_BIN" api "repos/$PRODUCT_REPOSITORY/git/commits/$PRODUCT_HEAD" --jq '.tree.sha')"
"$NODE_BIN" -e 'if(!/^[0-9a-f]{40}$/.test(process.argv[1])) process.exit(1)' "$PRODUCT_TREE" || {
  echo "A006: invalid Product tree returned for exact head: $PRODUCT_TREE" >&2
  exit 18
}

echo 'A006: acquiring exact current VexRelay/VexLocalBridge source...'
"$GH_BIN" repo clone "$SDK_REPOSITORY" "$SDK_ROOT" -- --no-checkout >/dev/null
"$GIT_BIN" -C "$SDK_ROOT" checkout --detach "$SDK_HEAD" >/dev/null

OBSERVED_HEAD="$("$GIT_BIN" -C "$SDK_ROOT" rev-parse HEAD)"
OBSERVED_TREE="$("$GIT_BIN" -C "$SDK_ROOT" rev-parse 'HEAD^{tree}')"
[ "$OBSERVED_HEAD" = "$SDK_HEAD" ] || { echo 'A006: SDK head mismatch.' >&2; exit 19; }
[ "$OBSERVED_TREE" = "$SDK_TREE" ] || { echo 'A006: SDK tree mismatch.' >&2; exit 20; }
[ -z "$("$GIT_BIN" -C "$SDK_ROOT" status --porcelain=v1 -uall)" ] || { echo 'A006: acquired SDK source is dirty.' >&2; exit 21; }

A006_SDK_ROOT="$SDK_ROOT" "$NODE_BIN" -e '
const fs=require("node:fs");
const path=require("node:path");
const root=process.env.A006_SDK_ROOT;
const contract=JSON.parse(fs.readFileSync(path.join(root,"docs/private-continuity/vexrelay/current-contract.json"),"utf8"));
if(contract.contractRef!=="source.vexrelay.current-contract/v1") process.exit(22);
const carrier=contract.acceptedAdapters.find(x=>x.adapterRef==="adapter.vexlocalbridge.native-vexrelay-task-archive/v1");
if(!carrier || carrier.state!=="TERMINAL_ACCEPTED_CURRENT") process.exit(23);
if(!contract.acceptedRecipeFamilies.includes("ExactHeadSourceOwnerProof")) process.exit(24);
'

cat > "$FORMATION_SCRIPT" <<'NODE_A006'
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const SDK_ROOT = process.env.A006_SDK_ROOT;
const OUT = process.env.A006_FORMATION_RESULT;
const TREE = process.env.A006_PRODUCT_TREE;
const DOWNLOADS = path.join(process.env.HOME, 'Downloads');

const { formVexRelayTaskArchiveCarrier } =
  await import(pathToFileURL(path.join(
    SDK_ROOT,
    'lib/vexlocalbridge/vexrelay-task-archive-carrier-formation.mjs',
  )).href);

const BASE = 'e3fd23dfff3bc98b4fca737c26e127fb21d1d800';
const HEAD = 'ca9650eb8b1f054ad09ec44abc815e8dabd7f1ea';
const BRANCH = 'VXG-112226-component-library-a5-workspace-a001';
const BASE_BRANCH = 'main';

const CHANGED_PATHS = [
  "projects/component-library-architecture/ARCHITECTURE.md",
  "projects/component-library-architecture/README.md",
  "public/workspace.json",
  "src/shared/vexboard-component-studio.mjs",
  "src/shared/vexboard-ui-blueprint.mjs",
  "test/vexboard-component-studio.test.mjs",
  "test/vexboard-component-workspace-ui.test.mjs",
  "test/vexboard-ui-builder.test.mjs",
  "vexboard/builder.html",
  "vexboard/components.html",
  "workgraphs/public.json",
  "workgraphs/segments/component-library-architecture.json",
];

if (!/^[0-9a-f]{40}$/.test(TREE)) throw new Error('A006_PRODUCT_TREE_INVALID');
if (TREE !== '1e7b9c5fbc5dbdba93fb7ca3d6af3cf001229f08') throw new Error('A006_PRODUCT_TREE_MISMATCH');

const now = new Date();
const expires = new Date(now.getTime() + 60 * 60 * 1000);

const seed = {
  schemaVersion: 'vex.relay.task/v2',
  continuity: '[VXG RealForever]',
  taskRef: 'task.vexwork.pr428.component-library-a5.source-owner.gallery-builder-ui-blueprint-test-owner-repair-a006',
  attemptRef: 'attempt.vexwork.pr428.component-library-architecture.source-owner.a006.20261122',
  requestRef: 'request.vexwork.pr428.component-library-architecture.source-owner.a006.20261122',
  correlationRef: 'correlation.vexwork.pr428.component-library-architecture.source-owner.a006.20261122',
  packageRef: 'package.vexwork.pr428.component-library-architecture.source-owner.a006.20261122',
  original: {
    originalIntent:
      "Verify the exact A5 Gallery + Builder candidate after the A005 repository proof exposed two stale static UI assertions and those test-owner assumptions were corrected without changing Builder production behavior, Product/source authority, accepted portable meaning, target application semantics, or target-proof ownership.",
    originalGoal:
      'Run the VexWork repository-owned deterministic review over PR #428 exact head so the isolated specimen Gallery, relational Builder surface, vexboard.ui-blueprint/v1 contract, open callback ports, Workgraph/project projections, and existing Component foundations remain coherent before the next lived review.',
    userProtectedIntent:
      'Make the Component Library feel like a visual catalog plus UI construction environment: drag real source specimens into mobile/Windows/container previews, mix composable flow with parent constraints, preserve open callback seams for target code or AI integration, and save deterministic no-AI UI blueprints.',
    sourceRefs: [
      'github.pr.vexwork.428',
      'git.vexwork.ca9650eb8b1f054ad09ec44abc815e8dabd7f1ea',
      'git.vexwork.e3fd23dfff3bc98b4fca737c26e127fb21d1d800',
      'source.vexrelay.current-contract/v1',
    ],
  },
  lane: {
    entryClass: 'SAME_LANE_SUCCESSOR',
    scopeMode: 'STAGE_BOUNDED',
    laneRef: 'lane.vexwork.component-library-a5',
    parentRootRef: 'github.pr.vexwork.428',
    workRef: 'work.vex.component-library-architecture.gallery',
    claimRef: 'claim.vexwork.pr428.component-library-a5-deterministic-review',
    returnRouteRef: 'github.pr.vexwork.428',
    ownerRef: 'github.pr.vexwork.428',
    rootHubRef: 'github.pr.vexwork.428',
  },
  role: {
    activeRole: 'CODER',
    roleRef: 'role.coder.vexwork.pr428.a004',
    instanceRef: 'instance.vexwork.pr428.a004',
    occupancyRef: 'occupancy.vexwork.pr428.a004',
    providerBindingRef: 'provider.macos-victor.vexwork.pr428.a004',
    threadRef: 'thread.local-vex-operations.vexwork.pr428.a004',
    authorityEnvelopeRef: 'authority-envelope.vexwork.pr428.a004',
  },
  capabilities: {
    platformGitHubRead: 'AVAILABLE',
    platformGitHubWrite: 'UNAVAILABLE',
  },
  execution: {
    hostProfile: 'macos-victor',
    executionSurface: 'MAC_ZIP_RUN_COMMAND',
    singleUseNonce: 'nonce.vexwork.pr428.a006.20261122',
    duplicateAttemptMarker: 'duplicate.vexwork.pr428.a006.20261122',
    duplicateProtectionMode: 'OUTER_RELAY_BOUND',
    formedAt: now.toISOString(),
    expiresAtOrNull: expires.toISOString(),
  },
  workspace: {
    mode: 'RUN_ROOT',
    projectRef: 'project.vexwork.pr428.component-library-architecture-source-owner',
    projectPath: 'workspace',
    createRoot: true,
    createProjectPath: true,
  },
  repositories: [{
    repositoryRef: 'primary',
    mode: 'CLONE_IN_WORKSPACE',
    cloneTransport: 'GITHUB_GH',
    githubHostname: 'github.com',
    nameWithOwner: 'VexGPT/VexWork',
    localPath: 'repositories/primary',
    remote: 'origin',
    baseBranch: BASE_BRANCH,
    acceptedBase: BASE,
    checkoutRef: HEAD,
    expectedHead: HEAD,
    branch: BRANCH,
  }],
  authority: {
    authorityRef: 'authority.vexwork.pr428.component-library-architecture.source-owner.a004',
    authorityMode: 'EXACT_STAGE_EFFECTS',
    grantedEffects: [
      'CHECK_AUTH',
      'READ_REPOSITORY',
      'CHECK_STATE',
      'RUN_LOCAL_COMMAND',
      'QUERY_PROVIDER',
      'FORM_RESULT',
    ],
    conditionalEffects: [],
    consumedEffects: [],
    remainingEffects: [
      'CHECK_AUTH',
      'READ_REPOSITORY',
      'CHECK_STATE',
      'RUN_LOCAL_COMMAND',
      'QUERY_PROVIDER',
      'FORM_RESULT',
    ],
    heldEffects: [
      'WRITE_SOURCE',
      'PUSH_BRANCH',
      'CREATE_PULL_REQUEST',
      'UPDATE_COORDINATION_METADATA',
      'APPROVE_EXACT_HEAD',
      'MARK_READY',
      'ORDINARY_MERGE',
      'RELEASE_PUBLICATION',
      'PRODUCT_LAUNCH',
      'REAL_HOME_MUTATION',
      'MODEL_RUNTIME_EFFECT',
    ],
    repositoryMembranes: [{
      repositoryRef: 'primary',
      allowedPaths: CHANGED_PATHS,
    }],
    allowedExecutables: [
      '/bin/bash',
    ],
    allowedEnvironment: [
      'HOME',
      'PATH',
      'JAVA_HOME',
    ],
    remoteObservationOwner: 'Operations',
    allowMutationLoop: false,
    stopConditions: [
      'STOP_ON_UNKNOWN',
      'STOP_ON_PATH_ESCAPE',
      'STOP_ON_AUTH_BLOCK',
      'STOP_ON_TEST_FAILURE',
    ],
  },
  source: {
    sourceSetRef: 'source-set.vexwork.pr428.component-library-architecture',
    sourceVersionRef: 'git.' + HEAD,
    overlapEvidenceRef: 'github.pr.vexwork.428',
    activeConflictState: 'NONE',
    candidateState: 'EXACT',
    candidateHead: HEAD,
    candidateTree: TREE,
    expectedChangedPaths: CHANGED_PATHS.map((p) => ({
      repositoryRef: 'primary',
      path: p,
    })),
    intentionallyUnchangedAuthorizedPaths: [],
  },
  policy: {
    maxOuterReturnFiles: 10,
    maxSelectedSourceEntries: 10,
    maxSelectedSourceBytes: 5000000,
    maxDiffBytes: 10000000,
    requireRacePreflightBeforeMutation: false,
    requireLocalValidationBeforePublish: false,
    requireInputPackageManifest: false,
    signoffCommit: true,
    draftPullRequest: true,
  },
};

const stage = {
  repositoryRef: 'primary',
  expectedBase: BASE,
  expectedHead: HEAD,
  expectedTree: TREE,
  branch: BRANCH,
  proofCommands: [
    {
      command: '/bin/bash',
      args: [
        '-c',
        [
          'set -euo pipefail',
          'NPM="$(command -v npm)"',
          '[ -n "$NPM" ]',
          '"$NPM" run review:deterministic',
        ].join('; '),
      ],
      predicateClass: 'SOURCE_OWNER_REPOSITORY',
      predicateRef: 'proof.pr428.component-library-a5.vexwork-review-deterministic',
      timeoutMs: 1800000,
    },
  ],
  maxFiles: 10,
  stateRef: 'state.vexwork.pr428.component-library-a5.source-owner.a004',
  currentLifecycleState: 'SOURCE_READY',
  currentGoal:
    'Prove the exact A5 Gallery + Builder candidate after the two A005 static UI test-owner corrections, including the relational UI Builder and UI Blueprint contract, across every repository-owned deterministic review surface.',
  remainingGoals: [
    'Consume exact deterministic PASS without promoting A5 to completion.',
    'Carry the exact Gallery + Builder candidate into human-lived specimen/composition review.',
    'Keep A6 construction packs and A7 self-projection waiting on A5 completion.',
    'Do not reopen A1-A4 portable/target proof without new contradictory evidence.',
  ],
  onPass: {
    lifecycleState: 'ASSURANCE_PENDING',
    nextFunction: 'F13.RUN_FRESH_ASSURANCE',
    nextOwner: 'IndependentAssurance',
    whyThisIsNext:
      'The exact Gallery + Builder candidate is mechanically coherent; lived specimen/composition review and fresh semantic Assurance remain separate before A5 completion/integration.',
  },
  resultFilename:
    'RETURN-VEXWORK-PR428-COMPONENT-LIBRARY-DETERMINISTIC-REVIEW-A006.zip',
};

const authorityEnvelope = {
  authoritySchemaRef: 'vextreme.effect-transaction/v1',
  semanticAdmissionRef: 'github.pr.vexwork.428',
  transactionRef: 'transaction.vexwork.pr428.component-library-architecture.source-owner.a004',
  transactionVersion: 1,
  allowedEffectRefs: ['effect.vexrelay.execute'],
  heldEffectRefs: [
    'effect.source.mutation',
    'effect.publication',
    'effect.product.launch',
    'effect.home.mutation',
    'effect.model-runtime',
    'effect.lifecycle',
    'effect.release.publication',
  ],
};

const outerTaskTemplate = {
  schemaVersion: 'vextreme.vexlocalbridge-task-manifest/v1',
  artifactClass: 'EXECUTABLE_RELAY',
  taskRef: 'task.vexwork.pr428.component-library-architecture.carrier',
  attemptRef: 'attempt.vexwork.pr428.component-library-architecture.carrier.a006.20261122',
  packageRef: 'package.vexwork.pr428.component-library-architecture.carrier.a006.20261122',
  requestRef: 'request.vexwork.pr428.component-library-architecture.carrier.a006.20261122',
  correlationRef: 'correlation.vexwork.pr428.component-library-architecture.carrier.a006.20261122',
  taskStorageKey: 'task-vexwork-pr428-component-library-architecture-carrier',
  attemptStorageKey: 'attempt-a006',
  requestingRoleRef: 'Operations[VexWork-PR428-A004]',
  requestingInstanceRef: 'instance.local-vex-operations.vexwork.pr428.a004',
  parentOperationsRef: 'github.pr.vexwork.428',
  returnRouteRef: 'github.pr.vexwork.428',
  hostProfileRef: 'macos-victor',
  repositoryExecutionProfileRefOrNull:
    'profile.repository.vextreme-sdk.macos-v1',
  repositoryRefOrNull: 'VexGPT/VexWork',
  baseRefOrNull: BASE,
  headRefOrNull: HEAD,
  treeRefOrNull: TREE,
  branchRefOrNull: BRANCH,
  claimRefOrNull: 'claim.vexwork.pr428.component-library-architecture-source-owner',
  exactPathRefs: CHANGED_PATHS,
  authorityBinding: {
    authoritySchemaRef: 'vextreme.effect-transaction/v1',
    authorityEnvelopePath: 'authority/effect.json',
    authorityEnvelopeSha256: '0'.repeat(64),
    semanticAdmissionRef: 'github.pr.vexwork.428',
    transactionRef: 'transaction.vexwork.pr428.component-library-architecture.source-owner.a004',
    transactionVersion: 1,
    allowedEffectRefs: ['effect.vexrelay.execute'],
    heldEffectRefs: [
      'effect.source.mutation',
      'effect.publication',
      'effect.product.launch',
      'effect.home.mutation',
      'effect.model-runtime',
      'effect.lifecycle',
      'effect.release.publication',
    ],
  },
  payload: {
    payloadClass: 'VEXRELAY_TASK_ARCHIVE',
    payloadRuntime: 'NATIVE_VEXRELAY',
    payloadPath: 'payload/inner-vexrelay.zip',
    payloadSha256: '0'.repeat(64),
    typedArgv: [],
    immutableInputs: [{
      path: 'inputs/vexrelay-binding.json',
      sha256: '0'.repeat(64),
    }],
  },
  executionStateAtFormation: 'TASK_PREPARED',
  singleUseNonce: 'nonce.vexwork.pr428.component-library-architecture.carrier.a006.20261122',
  stopConditions: [
    'stop.on.identity.drift',
    'stop.on.unadmitted.effect',
  ],
  archiveDigestBinding: 'FILENAME_SHA256',
};

const formed = await formVexRelayTaskArchiveCarrier({
  recipe: 'ExactHeadSourceOwnerProof',
  seed,
  stage,
  outerTaskTemplate,
  authorityEnvelope,
  outputDirectory: DOWNLOADS,
  outputStem:
    'VEXWORK-PR428-COMPONENT-LIBRARY-DETERMINISTIC-REVIEW-A006',
  ttlMs: 60 * 60 * 1000,
});

fs.writeFileSync(
  OUT,
  JSON.stringify({
    outerZip: formed.outer.finalZip,
    outerSha256: formed.outer.digest,
    innerSha256: formed.inner.sha256,
    taskRef: formed.inner.manifest.taskRef,
    attemptRef: formed.inner.manifest.attemptRef,
    candidateHead: formed.inner.manifest.source.candidateHead,
    candidateTree: formed.inner.manifest.source.candidateTree,
    activeConflictState: formed.inner.manifest.source.activeConflictState,
    qualification: formed.outer.formationEvidence,
  }, null, 2) + '\n',
);
NODE_A006

echo 'A006: checking generated formation module syntax...'
"$NODE_BIN" --check "$FORMATION_SCRIPT"

echo 'A006: forming exact task/carrier...'
A006_SDK_ROOT="$SDK_ROOT" A006_FORMATION_RESULT="$FORMATION_RESULT" A006_PRODUCT_TREE="$PRODUCT_TREE" "$NODE_BIN" "$FORMATION_SCRIPT"

PACKAGE="$("$NODE_BIN" -e 'const fs=require("node:fs");const x=JSON.parse(fs.readFileSync(process.argv[1],"utf8"));process.stdout.write(x.outerZip)' "$FORMATION_RESULT")"
EXPECTED="$("$NODE_BIN" -e 'const fs=require("node:fs");const x=JSON.parse(fs.readFileSync(process.argv[1],"utf8"));process.stdout.write(x.outerSha256)' "$FORMATION_RESULT")"

[ -f "$PACKAGE" ] || { echo 'A006: formed package is missing.' >&2; exit 25; }
OBSERVED="$(/usr/bin/shasum -a 256 "$PACKAGE" | /usr/bin/cut -d ' ' -f 1)"
[ "$OBSERVED" = "$EXPECTED" ] || { echo 'A006: formed package digest mismatch.' >&2; exit 26; }

echo "A006: Product head $PRODUCT_HEAD"
echo "A006: Product tree $PRODUCT_TREE"
echo "A006: formed exact package $PACKAGE"
echo "A006: package sha256 $EXPECTED"
echo 'A006: entering current native VexRelay/VexLocalBridge carrier...'

set +e
VEX_EXPECTED_PACKAGE_SHA256="$EXPECTED" "$BASH_BIN" "$SDK_ROOT/lib/vexlocalbridge/templates/RUN-VEX-TASK.command" "$PACKAGE"
STATUS=$?
set -e

echo "A006: carrier exit $STATUS"
echo 'A006: if a canonical RETURN was formed, upload the exact RETURN ZIP revealed by VexLocalBridge.'
exit "$STATUS"
