import fs from 'node:fs';
import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const SDK_REPOSITORY = 'vgong24/Vextreme-SDK';
const SDK_HEAD = '8543c7d755faba04d4c4019c02e84f992667918a';
const SDK_TREE = '6376f68279f0750ee6d3868b8472368199763064';
const CONTRACT_REF = 'source.vexrelay.current-contract/v1';

const PRODUCT_REPOSITORY = 'VexGPT/VexLife-Prod';
const PRODUCT_REPOSITORY_REF = 'vexlife-prod';
const BASE = '655e7c78cefba06a5e87afad285bb25a08632f05';
const HEAD = '938e28fff2788af9a797c97ff30ecbcc57e09848';
const TREE = '2f3e87ff6f32ce312a78c07d003121cebf8ac555';
const BRANCH = 'VXG-111626-openai-memory-depth-hydration-a001';

const CHANGED_PATHS = [
  'src/jvmMain/kotlin/vexlife/capability/VexLifeCapabilityBridge.kt',
  'src/jvmMain/kotlin/vexlife/capability/VexLifeReachDefinitions.kt',
  'src/jvmMain/kotlin/vexlife/capability/reach/VexLifeContinuityHydration.kt',
  'src/jvmMain/kotlin/vexlife/companion/DirectCompanionTurn.kt',
  'src/jvmMain/kotlin/vexlife/companion/DirectPromptContext.kt',
  'src/jvmTest/kotlin/vexlife/capability/VexLifeCapabilityAtlasTest.kt',
  'src/jvmTest/kotlin/vexlife/capability/reach/VexLifeContinuityHydrationTest.kt',
  'src/jvmTest/kotlin/vexlife/companion/DirectCompanionCapabilityTurnTest.kt',
];

function fail(message) {
  console.error(`Memory Depth proof: ${message}`);
  process.exit(1);
}

function resolveExecutable(candidates) {
  for (const candidate of candidates) {
    try {
      if (fs.statSync(candidate).isFile()) return candidate;
    } catch {}
  }
  return null;
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    encoding: 'utf8',
    stdio: options.stdio ?? 'pipe',
    cwd: options.cwd,
    env: options.env ?? process.env,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    const stderr = result.stderr?.trim();
    const stdout = result.stdout?.trim();
    throw new Error(
      `${command} ${args.join(' ')} failed (${result.status})` +
        (stderr ? `\n${stderr}` : '') +
        (stdout ? `\n${stdout}` : ''),
    );
  }
  return result.stdout?.trim() ?? '';
}

const GH = resolveExecutable(['/opt/homebrew/bin/gh', '/usr/local/bin/gh']);
const GIT = resolveExecutable(['/usr/bin/git']);
const BASH = resolveExecutable(['/bin/bash']);
const NODE = process.execPath;
if (!GH) fail('GitHub CLI is unavailable.');
if (!GIT) fail('Git is unavailable.');
if (!BASH) fail('Bash is unavailable.');

try {
  run(GH, ['auth', 'status', '--hostname', 'github.com']);
} catch {
  fail('GitHub CLI authentication is unavailable.');
}

const downloads = path.join(os.homedir(), 'Downloads');
await fsp.mkdir(downloads, { recursive: true });
const bootstrapRoot = await fsp.mkdtemp(path.join(downloads, '.memory-depth-vexrelay-sdk.'));
const sdkRoot = path.join(bootstrapRoot, 'Vextreme-SDK');

async function cleanup() {
  await fsp.rm(bootstrapRoot, { recursive: true, force: true });
}

try {
  console.log('Memory Depth proof: acquiring exact accepted VexRelay source from GitHub...');
  run(GH, ['repo', 'clone', SDK_REPOSITORY, sdkRoot, '--', '--no-checkout'], { stdio: 'inherit' });
  run(GIT, ['-C', sdkRoot, 'checkout', '--detach', SDK_HEAD], { stdio: 'inherit' });

  const observedSdkHead = run(GIT, ['-C', sdkRoot, 'rev-parse', 'HEAD']);
  const observedSdkTree = run(GIT, ['-C', sdkRoot, 'rev-parse', 'HEAD^{tree}']);
  const sdkStatus = run(GIT, ['-C', sdkRoot, 'status', '--porcelain=v1', '-uall']);
  if (observedSdkHead !== SDK_HEAD) fail(`SDK head mismatch: ${observedSdkHead}`);
  if (observedSdkTree !== SDK_TREE) fail(`SDK tree mismatch: ${observedSdkTree}`);
  if (sdkStatus !== '') fail('acquired SDK source is dirty.');

  const contractPath = path.join(sdkRoot, 'docs/private-continuity/vexrelay/current-contract.json');
  const contract = JSON.parse(await fsp.readFile(contractPath, 'utf8'));
  if (contract.contractRef !== CONTRACT_REF) fail(`unexpected Relay contract ${contract.contractRef}`);
  if (!contract.acceptedRecipeFamilies?.includes('ExactHeadSourceOwnerProof')) {
    fail('current Relay contract does not admit ExactHeadSourceOwnerProof.');
  }

  const [{ baseManifest }, { formVexRelayTaskArchiveCarrier }] = await Promise.all([
    import(pathToFileURL(path.join(sdkRoot, 'tests/vexrelay/helpers.mjs')).href),
    import(pathToFileURL(path.join(sdkRoot, 'lib/vexlocalbridge/vexrelay-task-archive-carrier-formation.mjs')).href),
  ]);

  const nonce = crypto.randomUUID().toLowerCase();
  const stamp = Date.now();
  const effects = [
    'CHECK_AUTH',
    'READ_REPOSITORY',
    'CHECK_STATE',
    'RUN_LOCAL_COMMAND',
    'QUERY_PROVIDER',
    'FORM_RESULT',
  ];

  const seed = baseManifest({
    head: BASE,
    tree: TREE,
    role: 'CODER',
    remainingEffects: effects,
    readCapability: 'AVAILABLE',
    writeCapability: 'UNAVAILABLE',
    candidateState: 'EXACT',
    candidateHead: HEAD,
    candidateTree: TREE,
    expectedChangedPaths: CHANGED_PATHS,
    repositoryMode: 'CLONE_IN_WORKSPACE',
    repositoryRef: PRODUCT_REPOSITORY_REF,
    nameWithOwner: PRODUCT_REPOSITORY,
    localPath: 'repositories/vexlife-prod',
    cloneTransport: 'GITHUB_GH',
    githubHostname: 'github.com',
    branch: BRANCH,
    workspaceMode: 'RUN_ROOT',
    projectPath: 'workspace',
    activeConflictState: 'CONFLICT',
  });

  delete seed.operations;
  delete seed.completionPolicy;
  delete seed.continuationPlan;
  delete seed.result;

  seed.taskRef = 'task.vexlife-prod.memory-depth.openai.pr220.source-owner';
  seed.attemptRef = `attempt.vexlife-prod.memory-depth.openai.pr220.${stamp}.${nonce.slice(0, 12)}`;
  seed.requestRef = 'request.vexlife-prod.memory-depth.openai.pr220.source-owner';
  seed.correlationRef = 'correlation.vexlife-prod.memory-depth.openai.pr220';
  seed.packageRef = `package.vexlife-prod.memory-depth.openai.pr220.${stamp}.${nonce.slice(0, 12)}`;

  seed.original = {
    originalIntent:
      'Prove the independent OpenAI Memory Depth continuity-hydration implementation on its exact VexLife-Prod PR head.',
    originalGoal:
      'Compile and execute the repository-owned JVM/string proof without mutating Product source, publication, merge, or lifecycle state.',
    userProtectedIntent:
      'Preserve blind-parallel independence from Claude until OpenAI independent implementation completion is proven.',
    sourceRefs: [
      'github.pull.vexlife-prod.220',
      'github.issue.vexwork.311',
      'github.pull.vexwork.308',
      CONTRACT_REF,
    ],
  };

  seed.lane = {
    entryClass: 'SAME_LANE_SUCCESSOR',
    scopeMode: 'STAGE_BOUNDED',
    laneRef: 'lane.vexlife-prod.memory-depth.openai',
    parentRootRef: 'github.pull.vexwork.308',
    workRef: 'github.issue.vexwork.311',
    claimRef: 'claim.vexlife-prod.memory-depth.openai.pr220',
    returnRouteRef: 'github.pull.vexlife-prod.220',
    ownerRef: 'OpenAI.MemoryDepth.Coder',
    rootHubRef: 'github.pull.vexwork.308',
  };

  seed.role = {
    activeRole: 'CODER',
    roleRef: 'role.coder.vexlife-prod.memory-depth.openai',
    instanceRef: 'instance.openai.vexlife-prod.memory-depth.pr220',
    occupancyRef: 'occupancy.openai.vexlife-prod.memory-depth.pr220',
    providerBindingRef: 'provider-binding.openai.gpt-5.6-sol.memory-depth',
    threadRef: 'thread.vexlife-prod.memory-depth.openai.pr220',
    authorityEnvelopeRef: 'authority-envelope.vexlife-prod.memory-depth.openai.pr220',
  };

  seed.capabilities = {
    platformGitHubRead: 'AVAILABLE',
    platformGitHubWrite: 'UNAVAILABLE',
  };

  seed.execution.hostProfile = 'macos-victor';
  seed.execution.executionSurface = 'MAC_ZIP_RUN_COMMAND';
  seed.execution.singleUseNonce = `nonce-${stamp}-${nonce}`;
  seed.execution.duplicateAttemptMarker = 'marker.vexlife-prod.memory-depth.openai.pr220';
  seed.execution.duplicateProtectionMode = 'OUTER_RELAY_BOUND';

  seed.workspace = {
    mode: 'RUN_ROOT',
    projectRef: 'project.vexlife-prod.memory-depth.openai.pr220',
    projectPath: 'workspace',
    createRoot: true,
    createProjectPath: true,
  };

  seed.repositories[0] = {
    repositoryRef: PRODUCT_REPOSITORY_REF,
    mode: 'CLONE_IN_WORKSPACE',
    nameWithOwner: PRODUCT_REPOSITORY,
    localPath: 'repositories/vexlife-prod',
    remote: 'origin',
    baseBranch: 'main',
    acceptedBase: BASE,
    expectedHead: HEAD,
    checkoutRef: HEAD,
    branch: BRANCH,
    cloneTransport: 'GITHUB_GH',
    githubHostname: 'github.com',
  };

  seed.authority = {
    authorityRef: 'authority.vexlife-prod.memory-depth.openai.pr220.source-owner',
    authorityMode: 'EXACT_STAGE_EFFECTS',
    grantedEffects: effects,
    conditionalEffects: [],
    consumedEffects: [],
    remainingEffects: effects,
    heldEffects: [
      'WRITE_SOURCE',
      'CREATE_BRANCH',
      'CREATE_COMMIT',
      'PUSH_BRANCH',
      'CREATE_PULL_REQUEST',
      'UPDATE_COORDINATION_METADATA',
      'APPROVE_EXACT_HEAD',
      'MARK_READY',
      'ORDINARY_MERGE',
    ],
    repositoryMembranes: [
      {
        repositoryRef: PRODUCT_REPOSITORY_REF,
        allowedPaths: CHANGED_PATHS,
      },
    ],
    allowedExecutables: ['node', NODE, 'git', 'gh', 'bash', BASH],
    allowedEnvironment: [],
    remoteObservationOwner: 'Operations',
    allowMutationLoop: false,
    stopConditions: [
      'STOP_ON_UNKNOWN',
      'STOP_ON_PATH_ESCAPE',
      'STOP_ON_AUTH_BLOCK',
      'STOP_ON_TEST_FAILURE',
    ],
  };

  seed.source = {
    sourceSetRef: 'source-set.vexlife-prod.memory-depth.openai.pr220',
    sourceVersionRef: `source-version.vexlife-prod.memory-depth.openai.${HEAD}`,
    overlapEvidenceRef: 'github.issue.vexwork.311',
    activeConflictState: 'CONFLICT',
    candidateState: 'EXACT',
    candidateHead: HEAD,
    candidateTree: TREE,
    expectedChangedPaths: CHANGED_PATHS.map((p) => ({ repositoryRef: PRODUCT_REPOSITORY_REF, path: p })),
    intentionallyUnchangedAuthorizedPaths: [],
  };

  seed.policy = {
    maxOuterReturnFiles: 10,
    maxSelectedSourceEntries: 10,
    maxSelectedSourceBytes: 500000,
    maxDiffBytes: 5000000,
    requireRacePreflightBeforeMutation: false,
    requireLocalValidationBeforePublish: false,
    requireInputPackageManifest: false,
    signoffCommit: false,
    draftPullRequest: true,
  };

  const stage = {
    repositoryRef: PRODUCT_REPOSITORY_REF,
    expectedBase: BASE,
    expectedHead: HEAD,
    expectedTree: TREE,
    branch: BRANCH,
    proofCommands: [
      {
        command: BASH,
        args: [
          './gradlew',
          '-Dorg.gradle.jvmargs=-Xmx4g',
          '--offline',
          '--no-daemon',
          '--max-workers=1',
          'compileKotlinJvm',
        ],
        predicateClass: 'SOURCE_OWNER_BEHAVIOR',
        predicateRef: 'proof.vexlife-prod.memory-depth.openai.compile-jvm',
        proofClass: 'TEST',
        candidateEvidence: true,
        acceptedExitCodes: [0],
        timeoutMs: 1500000,
      },
      {
        command: BASH,
        args: [
          './gradlew',
          '-Dorg.gradle.jvmargs=-Xmx4g',
          '--offline',
          '--no-daemon',
          '--max-workers=1',
          'jvmTest',
          '--tests',
          'vexlife.capability.reach.VexLifeContinuityHydrationTest',
          '--tests',
          'vexlife.companion.DirectCompanionCapabilityTurnTest',
          '--info',
        ],
        predicateClass: 'SOURCE_OWNER_BEHAVIOR',
        predicateRef: 'proof.vexlife-prod.memory-depth.openai.focused-hydration-jvm-tests',
        proofClass: 'TEST',
        candidateEvidence: true,
        acceptedExitCodes: [0],
        timeoutMs: 1500000,
      },
      {
        command: BASH,
        args: [
          './gradlew',
          '-Dorg.gradle.jvmargs=-Xmx4g',
          '--offline',
          '--no-daemon',
          '--max-workers=1',
          'jvmTest',
          'checkVexLifeStrings',
        ],
        predicateClass: 'SOURCE_OWNER_BEHAVIOR',
        predicateRef: 'proof.vexlife-prod.memory-depth.openai.jvm-test-and-strings',
        proofClass: 'TEST',
        candidateEvidence: true,
        acceptedExitCodes: [0],
        timeoutMs: 1500000,
      },
    ],
    maxFiles: 10,
    stateRef: 'state.vexlife-prod.memory-depth.openai.host-proof',
    currentLifecycleState: 'HOSTED_EVIDENCE_PENDING',
    currentGoal:
      'Prove the exact PR #220 source-owner candidate with repository-owned JVM/string checks.',
    remainingGoals: [
      'Consume the exact canonical return.',
      'Post independent implementation completion receipt.',
      'Begin blind-parallel convergence only after the completion marker.',
    ],
    onPass: {
      lifecycleState: 'ASSURANCE_PENDING',
      nextFunction: 'F13.RUN_FRESH_ASSURANCE',
      nextOwner: 'OpenAI+Predecessor',
      whyThisIsNext:
        'Exact-head source-owner proof passed; independent completion can be recorded before blind-parallel convergence begins.',
    },
    resultFilename: 'RETURN-VEXLIFE-MEMORY-DEPTH-OPENAI-PR220-SOURCE-OWNER.zip',
  };

  const authorityEnvelope = {
    authoritySchemaRef: 'vextreme.effect-transaction/v1',
    semanticAdmissionRef: 'conversation.victor.memory-depth.continue-execute.20261117',
    transactionRef: 'transaction.vexlife-prod.memory-depth.openai.pr220.host-proof',
    transactionVersion: 1,
    allowedEffectRefs: ['effect.vexrelay.execute'],
    heldEffectRefs: [
      'effect.repository.write',
      'effect.repository.publish',
      'effect.review.approve',
      'effect.ready',
      'effect.merge',
      'effect.release',
    ],
  };

  const outerTaskTemplate = {
    schemaVersion: 'vextreme.vexlocalbridge-task-manifest/v1',
    artifactClass: 'EXECUTABLE_RELAY',
    taskRef: 'task.vexlife-prod.memory-depth.openai.pr220.vexrelay-carrier',
    attemptRef: `attempt.vexlife-prod.memory-depth.openai.pr220.carrier.${stamp}.${nonce.slice(0, 12)}`,
    packageRef: `package.vexlife-prod.memory-depth.openai.pr220.carrier.${stamp}.${nonce.slice(0, 12)}`,
    requestRef: 'request.vexlife-prod.memory-depth.openai.pr220.vexrelay-carrier',
    correlationRef: 'correlation.vexlife-prod.memory-depth.openai.pr220',
    taskStorageKey: 'task-vexlife-memory-depth-openai-pr220-source-owner',
    attemptStorageKey: `attempt-${stamp}-${nonce.slice(0, 8)}`,
    requestingRoleRef: 'OpenAI.MemoryDepth.Coder',
    requestingInstanceRef: 'instance.openai.vexlife-prod.memory-depth.pr220',
    parentOperationsRef: 'github.issue.vexwork.311',
    returnRouteRef: 'github.pull.vexlife-prod.220',
    hostProfileRef: 'macos-victor',
    repositoryExecutionProfileRefOrNull: 'profile.repository.vextreme-sdk.macos-v1',
    repositoryRefOrNull: PRODUCT_REPOSITORY,
    baseRefOrNull: BASE,
    headRefOrNull: HEAD,
    treeRefOrNull: TREE,
    branchRefOrNull: BRANCH,
    claimRefOrNull: 'claim.vexlife-prod.memory-depth.openai.pr220',
    exactPathRefs: CHANGED_PATHS,
    authorityBinding: {
      authoritySchemaRef: 'vextreme.effect-transaction/v1',
      authorityEnvelopePath: 'authority/effect.json',
      authorityEnvelopeSha256: '0'.repeat(64),
      semanticAdmissionRef: 'placeholder',
      transactionRef: 'placeholder',
      transactionVersion: 1,
      allowedEffectRefs: ['placeholder'],
      heldEffectRefs: [],
    },
    payload: {
      payloadClass: 'VEXRELAY_TASK_ARCHIVE',
      payloadRuntime: 'NATIVE_VEXRELAY',
      payloadPath: 'payload/inner-vexrelay.zip',
      payloadSha256: '0'.repeat(64),
      typedArgv: [],
      immutableInputs: [
        {
          path: 'inputs/vexrelay-binding.json',
          sha256: '0'.repeat(64),
        },
      ],
    },
    executionStateAtFormation: 'TASK_PREPARED',
    singleUseNonce: `nonce-carrier-${stamp}-${nonce}`,
    stopConditions: [
      'stop.on.identity.drift',
      'stop.on.auth.unavailable',
      'stop.on.test.failure',
      'stop.on.path.escape',
    ],
    archiveDigestBinding: 'FILENAME_SHA256',
  };

  console.log('Memory Depth proof: forming current-contract VexRelay carrier...');
  const formed = await formVexRelayTaskArchiveCarrier({
    recipe: 'ExactHeadSourceOwnerProof',
    seed,
    stage,
    outerTaskTemplate,
    authorityEnvelope,
    outputDirectory: downloads,
    outputStem: 'VEXLIFE-MEMORY-DEPTH-OPENAI-PR220-SOURCE-OWNER',
    ttlMs: 2 * 60 * 60 * 1000,
  });

  console.log(`Memory Depth proof: task package ${formed.outer.finalZip}`);
  console.log(`Memory Depth proof: task SHA-256 ${formed.outer.digest}`);
  console.log('Memory Depth proof: executing exact package through accepted Mac VexLocalBridge...');

  const runner = path.join(sdkRoot, 'lib/vexlocalbridge/templates/RUN-VEX-TASK.command');
  const child = spawnSync(BASH, [runner, formed.outer.finalZip], {
    env: {
      ...process.env,
      VEX_EXPECTED_PACKAGE_SHA256: formed.outer.digest,
    },
    stdio: 'inherit',
  });
  if (child.error) throw child.error;
  if (child.signal) throw new Error(`VEXLOCALBRIDGE_RUNNER_SIGNAL:${child.signal}`);
  if ((child.status ?? 1) !== 0) {
    throw new Error(`VEXLOCALBRIDGE_RUNNER_EXIT:${child.status}`);
  }

  console.log('Memory Depth proof: host execution terminalized. Return the revealed canonical RETURN ZIP to OpenAI.');
} finally {
  await cleanup();
}
