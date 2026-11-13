import fs from 'node:fs';
import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const CONTINUITY = '[VXG RealForever]';

const SDK_REPOSITORY = 'vgong24/Vextreme-SDK';
const SDK_HEAD = '1c2c9d76114ca35f00125f0a5c93e531e3e6a746';
const SDK_TREE = '6376f68279f0750ee6d3868b8472368199763064';
const CONTRACT_REF = 'source.vexrelay.current-contract/v1';

const PRODUCT_REPOSITORY = 'VexGPT/VexLife-Prod';
const PRODUCT_CLONE_URL = 'https://github.com/VexGPT/VexLife-Prod.git';
const PRODUCT_BASE = '3128a54ea3141ddc1c8aa494b1d4674f21885d7c';
const PRODUCT_HEAD = '47e00b95459c372c9bbbdfc4aaf5631edc40963f';
const PRODUCT_TREE = '82fb2d80c441b82c71ce256e8724e4597e84f278';
const PRODUCT_BRANCH = 'VXG-111326-vexlife-prod-score-working-continuity-reconnection-a001';
const PRODUCT_PR = 116;

const ISSUE_REF = 'github.issue.vexlife-prod.61';
const WORK_REF = 'work.vexlife.new-beginnings.relationship-continuity-score-reconnection';
const VEXWORK_ADMISSION_REF = 'github.pull.vexwork.299';

const CHANGED_PATHS = Object.freeze([
  'docs/foundation/WORKING-CONTINUITY-ROLLOVER.md',
  'src/jvmMain/kotlin/vexlife/memory/VexLifeCurrentMemoryReader.kt',
  'src/jvmMain/kotlin/vexlife/companion/DirectWorkingContinuity.kt',
  'src/jvmTest/kotlin/vexlife/memory/VexLifeCurrentMemoryReaderTest.kt',
  'src/jvmTest/kotlin/vexlife/companion/DirectWorkingContinuityTest.kt',
  'src/jvmTest/kotlin/vexlife/companion/DirectCompanionTurnTest.kt',
]);

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
  if (actual !== expected) {
    fail(label + ' mismatch: ' + String(actual) + ' != ' + String(expected));
  }
}

function requireExactSet(actual, expected, label) {
  const a = [...actual].sort();
  const e = [...expected].sort();
  requireEqual(JSON.stringify(a), JSON.stringify(e), label);
}

async function main() {
  console.log(CONTINUITY);
  console.log('PR116 SourceOwner: grounding exact current SDK source...');

  const downloads = path.join(os.homedir(), 'Downloads');
  await fsp.mkdir(downloads, { recursive: true });

  const git = resolveExecutable(['/usr/bin/git'], 'qualified git');
  const gh = resolveExecutable(['/opt/homebrew/bin/gh', '/usr/local/bin/gh'], 'qualified gh');
  const bash = resolveExecutable(['/bin/bash'], 'qualified bash');

  run(gh, ['auth', 'status', '--hostname', 'github.com'], { capture: false });

  const bootstrapRoot = await fsp.mkdtemp(path.join(downloads, '.vex-pr116-so-a001-'));
  const sdkRoot = path.join(bootstrapRoot, 'Vextreme-SDK');

  try {
    run(gh, ['repo', 'clone', SDK_REPOSITORY, sdkRoot, '--', '--no-checkout'], { capture: false });
    run(git, ['-C', sdkRoot, 'checkout', '--detach', SDK_HEAD]);

    requireEqual(run(git, ['-C', sdkRoot, 'rev-parse', 'HEAD']), SDK_HEAD, 'SDK HEAD');
    requireEqual(run(git, ['-C', sdkRoot, 'rev-parse', 'HEAD^{tree}']), SDK_TREE, 'SDK tree');
    requireEqual(run(git, ['-C', sdkRoot, 'status', '--porcelain']), '', 'SDK clean source');

    const contract = JSON.parse(
      await fsp.readFile(
        path.join(sdkRoot, 'docs/private-continuity/vexrelay/current-contract.json'),
        'utf8',
      ),
    );
    requireEqual(contract.contractRef, CONTRACT_REF, 'Relay contractRef');
    if (!contract.acceptedRecipeFamilies || !contract.acceptedRecipeFamilies.includes('ExactHeadSourceOwnerProof')) {
      fail('ExactHeadSourceOwnerProof is not current');
    }

    const helpers = await import(pathToFileURL(path.join(sdkRoot, 'tests/vexrelay/helpers.mjs')).href);
    const recipeModule = await import(pathToFileURL(path.join(sdkRoot, 'lib/vexrelay/recipe-compiler.mjs')).href);
    const carrierModule = await import(
      pathToFileURL(path.join(sdkRoot, 'lib/vexlocalbridge/vexrelay-task-archive-carrier-formation.mjs')).href
    );
    const nativeModule = await import(
      pathToFileURL(path.join(sdkRoot, 'lib/vexlocalbridge/vexrelay-task-archive.js')).href
    );

    const baseManifest = helpers.baseManifest;
    const compileRelayRecipe = recipeModule.compileRelayRecipe;
    const recipeContract = recipeModule.recipeContract;
    const formVexRelayTaskArchiveCarrier = carrierModule.formVexRelayTaskArchiveCarrier;
    const nativeVexRelay = nativeModule.default;

    const effects = [
      'CHECK_AUTH',
      'READ_REPOSITORY',
      'CHECK_STATE',
      'QUERY_PROVIDER',
      'RUN_LOCAL_COMMAND',
      'FORM_RESULT',
    ];

    const now = new Date();
    const seed = baseManifest({
      head: PRODUCT_BASE,
      tree: PRODUCT_TREE,
      role: 'CODER',
      remainingEffects: effects,
      readCapability: 'AVAILABLE',
      writeCapability: 'UNAVAILABLE',
      candidateState: 'EXACT',
      candidateHead: PRODUCT_HEAD,
      candidateTree: PRODUCT_TREE,
      repositoryMode: 'CLONE_IN_WORKSPACE',
      repositoryRef: 'primary',
      nameWithOwner: PRODUCT_REPOSITORY,
      localPath: 'vexlife-prod',
      cloneTransport: 'GITHUB_GH',
      githubHostname: 'github.com',
      branch: PRODUCT_BRANCH,
      workspaceMode: 'RUN_ROOT',
      projectPath: 'vexlife-prod-pr116-source-owner',
      expectedChangedPaths: CHANGED_PATHS,
      activeConflictState: 'NONE',
      onPassState: 'ASSURANCE_PENDING',
      onPassFunction: 'F13.RUN_FRESH_ASSURANCE',
    });

    seed.taskRef = 'task.vexlife-prod.pr116.source-owner-proof';
    seed.attemptRef = 'attempt.vexlife-prod.pr116.source-owner-proof.a002';
    seed.requestRef = 'request.vexlife-prod.pr116.source-owner-proof.a002';
    seed.correlationRef = 'correlation.vexlife-prod.pr116.source-owner-proof.a002';
    seed.packageRef = 'package.vexlife-prod.pr116.source-owner-proof.a002';

    seed.original = {
      originalIntent: 'Prove the exact bounded Score-to-WorkingContinuity producer restoration without widening semantic ownership.',
      originalGoal: 'Establish SourceOwner proof for VexLife-Prod PR #116 on the exact immutable candidate.',
      userProtectedIntent: 'Restore existing rightful architecture; do not invent a new continuity owner or broaden effects.',
      sourceRefs: [ISSUE_REF, VEXWORK_ADMISSION_REF, 'github.pull.vexlife-prod.116'],
    };

    seed.lane = {
      ...seed.lane,
      entryClass: 'FOUNDATION_DELTA',
      scopeMode: 'STAGE_BOUNDED',
      laneRef: 'lane.vexlife-prod.pr116.source-owner-proof',
      parentRootRef: ISSUE_REF,
      workRef: WORK_REF,
      claimRef: 'github.pull.vexlife-prod.116',
      returnRouteRef: ISSUE_REF,
      ownerRef: 'owner.vexlife-prod.relationship-continuity',
      rootHubRef: 'hub.vexlife-prod.relationship-continuity',
    };

    seed.role = {
      ...seed.role,
      activeRole: 'CODER',
      roleRef: 'role.coder.vexlife-prod.pr116',
      instanceRef: 'instance.chatgpt.relationship-continuity.20261113.a001',
      occupancyRef: 'occupancy.vexlife-prod.pr116.source-owner.a002',
      providerBindingRef: 'provider.github.vexlife-prod.pr116',
      threadRef: 'thread.vexlife-prod.relationship-continuity',
      authorityEnvelopeRef: 'authority-envelope.vexlife-prod.pr116.source-owner.a002',
    };

    seed.execution = {
      ...seed.execution,
      hostProfile: 'macos-victor',
      executionSurface: 'MAC_ZIP_RUN_COMMAND',
      singleUseNonce: 'nonce-vexlife-prod-pr116-source-owner-proof-a002',
      duplicateAttemptMarker: 'marker.vexlife-prod-pr116-source-owner-proof-a001',
      duplicateProtectionMode: 'OUTER_RELAY_BOUND',
      formedAt: now.toISOString(),
      expiresAtOrNull: new Date(now.getTime() + 30 * 60 * 1000).toISOString(),
    };

    seed.workspace = {
      ...seed.workspace,
      mode: 'RUN_ROOT',
      projectRef: 'project.vexlife.new-beginnings',
      projectPath: 'vexlife-prod-pr116-source-owner',
      createRoot: false,
      createProjectPath: false,
    };

    Object.assign(seed.repositories[0], {
      repositoryRef: 'primary',
      mode: 'CLONE_IN_WORKSPACE',
      nameWithOwner: PRODUCT_REPOSITORY,
      localPath: 'vexlife-prod',
      remote: 'origin',
      baseBranch: 'main',
      acceptedBase: PRODUCT_BASE,
      checkoutRef: PRODUCT_HEAD,
      expectedHead: PRODUCT_HEAD,
      branch: PRODUCT_BRANCH,
      cloneTransport: 'GITHUB_GH',
      cloneUrl: PRODUCT_CLONE_URL,
      githubHostname: 'github.com',
      expectedRemoteUrl: null,
    });

    seed.authority = {
      ...seed.authority,
      authorityRef: 'authority.vexlife-prod.pr116.source-owner.a001',
      authorityMode: 'EXACT_STAGE_EFFECTS',
      grantedEffects: [...effects],
      conditionalEffects: [],
      consumedEffects: [],
      remainingEffects: [...effects],
      heldEffects: ['APPROVE_EXACT_HEAD', 'MARK_READY', 'ORDINARY_MERGE', 'PUSH_BRANCH', 'WRITE_SOURCE'],
      repositoryMembranes: [{ repositoryRef: 'primary', allowedPaths: [...CHANGED_PATHS] }],
      allowedExecutables: [...new Set([...(seed.authority.allowedExecutables || []), 'bash'])],
      allowedEnvironment: [...(seed.authority.allowedEnvironment || [])],
      remoteObservationOwner: 'LocalRelay',
      allowMutationLoop: false,
      stopConditions: ['STOP_ON_UNKNOWN', 'STOP_ON_PATH_ESCAPE', 'STOP_ON_AUTH_BLOCK', 'STOP_ON_TEST_FAILURE'],
    };

    seed.source = {
      ...seed.source,
      sourceSetRef: 'source-set.vexlife-prod.pr116.score-working-continuity',
      sourceVersionRef: 'source-version.vexlife-prod.pr116.47e00b95',
      overlapEvidenceRef: 'github.pull.vexlife-prod.116',
      activeConflictState: 'NONE',
      candidateState: 'EXACT',
      candidateHead: PRODUCT_HEAD,
      candidateTree: PRODUCT_TREE,
      expectedChangedPaths: CHANGED_PATHS.map((entry) => ({ repositoryRef: 'primary', path: entry })),
      intentionallyUnchangedAuthorizedPaths: [],
    };

    delete seed.operations;
    delete seed.completionPolicy;
    delete seed.continuationPlan;
    delete seed.result;

    const stage = {
      repositoryRef: 'primary',
      expectedBase: PRODUCT_BASE,
      expectedHead: PRODUCT_HEAD,
      expectedTree: PRODUCT_TREE,
      branch: PRODUCT_BRANCH,
      pullRequestNumber: PRODUCT_PR,
      proofCommands: [{
        command: 'bash',
        args: ['./gradlew', 'jvmTest', '--offline', '--no-daemon', '--stacktrace'],
        proofClass: 'TEST',
        candidateEvidence: true,
        predicateClass: 'SOURCE_OWNER_BEHAVIOR',
        predicateRef: 'predicate.vexlife-prod.pr116.full-jvm-source-owner',
        acceptedExitCodes: [0],
        timeoutMs: 600000,
      }],
      maxFiles: 10,
      stateRef: 'state.vexlife-prod.pr116.source-owner.a002',
      currentLifecycleState: 'SOURCE_READY',
      currentGoal: 'Prove the exact PR #116 Score-to-WorkingContinuity restoration candidate.',
      remainingGoals: [
        'Run fresh semantic Assurance on the exact proven candidate.',
        'Reconcile integration currentness only after proof.',
      ],
      onPass: {
        lifecycleState: 'ASSURANCE_PENDING',
        nextFunction: 'F13.RUN_FRESH_ASSURANCE',
        nextOwner: 'Operations',
        whyThisIsNext: 'Exact SourceOwner/full-JVM proof is complete; semantic Assurance remains a separate effect.',
      },
      resultFilename: 'RETURN-VEXLIFE-PR116-SOURCE-OWNER-PROOF-A002.zip',
    };

    const recipe = recipeContract('ExactHeadSourceOwnerProof');
    requireEqual(recipe.role, 'CODER', 'SourceOwner role');
    requireEqual(recipe.gate, 'EXACT_HEAD_SOURCE_OWNER_PROOF', 'SourceOwner gate');
    if (!recipe.scopes.includes('STAGE_BOUNDED')) fail('SourceOwner STAGE_BOUNDED scope missing');
    requireEqual(recipe.currentnessPolicy.fixedBaseMeaning, 'EVIDENCE_DIFF_ANCHOR', 'fixed-base meaning');
    requireEqual(
      recipe.currentnessPolicy.remoteMainEqualityRequiredBeforeExecution,
      false,
      'remote-main equality policy',
    );

    const compiled = compileRelayRecipe({
      recipe: 'ExactHeadSourceOwnerProof',
      seed,
      stage,
    });

    requireEqual(compiled.role.activeRole, 'CODER', 'compiled role');
    requireEqual(compiled.lane.scopeMode, 'STAGE_BOUNDED', 'compiled scope');
    requireEqual(
      compiled.completionPolicy.stageGateOrNull,
      'EXACT_HEAD_SOURCE_OWNER_PROOF',
      'compiled gate',
    );
    requireExactSet(
      compiled.source.expectedChangedPaths.map((entry) => entry.path),
      CHANGED_PATHS,
      'compiled changed paths',
    );
    requireEqual(compiled.source.candidateHead, PRODUCT_HEAD, 'compiled candidate head');
    requireEqual(compiled.source.candidateTree, PRODUCT_TREE, 'compiled candidate tree');

    const compiledRepo = compiled.repositories.find((entry) => entry.repositoryRef === 'primary');
    requireEqual(compiledRepo.acceptedBase, PRODUCT_BASE, 'compiled fixed base');
    requireEqual(compiledRepo.checkoutRef, PRODUCT_HEAD, 'compiled checkoutRef');
    requireEqual(compiledRepo.expectedHead, PRODUCT_HEAD, 'compiled repository expectedHead');
    requireEqual(compiledRepo.branch, PRODUCT_BRANCH, 'compiled branch');
    requireEqual(compiledRepo.mode, 'CLONE_IN_WORKSPACE', 'compiled repository mode');
    requireEqual(compiledRepo.cloneTransport, 'GITHUB_GH', 'compiled clone transport');

    const actions = compiled.operations.map((operation) => operation.action);
    requireEqual(
      JSON.stringify(actions),
      JSON.stringify([
        'GITHUB_GH',
        'REPOSITORY_STATE',
        'EXPECTED_HEAD',
        'EXPECTED_TREE',
        'COMMAND',
        'REVIEW_SNAPSHOT',
        'CANONICAL_RETURN',
      ]),
      'compiled SourceOwner operation sequence',
    );

    if (compiled.operations.some((operation) => ['WRITE', 'PUBLISH', 'LISTEN', 'LOOP'].includes(operation.op))) {
      fail('compiled task contains forbidden mutating/lifecycle operation');
    }

    const proofSeed = stage.proofCommands[0];
    requireEqual(proofSeed.predicateClass, 'SOURCE_OWNER_BEHAVIOR', 'proof seed predicate class');
    requireEqual(
      proofSeed.predicateRef,
      'predicate.vexlife-prod.pr116.full-jvm-source-owner',
      'proof seed predicate ref',
    );

    const proofOperation = compiled.operations.find((operation) => operation.action === 'COMMAND');
    requireEqual(proofOperation.command, 'bash', 'proof command');
    requireEqual(
      JSON.stringify(proofOperation.args),
      JSON.stringify(['./gradlew', 'jvmTest', '--offline', '--no-daemon', '--stacktrace']),
      'proof args',
    );
    requireEqual(proofOperation.proofClass, 'TEST', 'proof class');
    requireEqual(proofOperation.mutationClass, 'NONE', 'proof mutation class');
    requireEqual(proofOperation.candidateEvidence, true, 'proof candidate evidence');
    requireEqual(proofOperation.timeoutMs, 600000, 'proof timeout');

    const authorityEnvelope = {
      authoritySchemaRef: 'vextreme.effect-transaction/v1',
      semanticAdmissionRef: VEXWORK_ADMISSION_REF,
      transactionRef: 'transaction.vexlife-prod.pr116.source-owner-proof.a002',
      transactionVersion: 1,
      allowedEffectRefs: ['effect.vexrelay.execute'],
      heldEffectRefs: ['effect.merge', 'effect.mark-ready', 'effect.approve', 'effect.publish'],
    };

    const outerTaskTemplate = {
      schemaVersion: 'vextreme.vexlocalbridge-task-manifest/v1',
      artifactClass: 'EXECUTABLE_RELAY',
      taskRef: 'task.vexlife-prod.pr116.source-owner-proof.carrier',
      attemptRef: 'attempt.vexlife-prod.pr116.source-owner-proof.carrier.a002',
      packageRef: 'package.vexlife-prod.pr116.source-owner-proof.carrier.a002',
      requestRef: 'request.vexlife-prod.pr116.source-owner-proof.carrier.a002',
      correlationRef: 'correlation.vexlife-prod.pr116.source-owner-proof.carrier.a002',
      taskStorageKey: 'task-vexlife-prod-pr116-source-owner-proof',
      attemptStorageKey: 'attempt-a001',
      requestingRoleRef: 'Operations[RelationshipContinuity]',
      requestingInstanceRef: 'instance.chatgpt.relationship-continuity.20261113.a001',
      parentOperationsRef: ISSUE_REF,
      returnRouteRef: ISSUE_REF,
      hostProfileRef: 'macos-victor',
      repositoryExecutionProfileRefOrNull: 'profile.repository.vextreme-sdk.macos-v1',
      repositoryRefOrNull: SDK_REPOSITORY,
      baseRefOrNull: SDK_HEAD,
      headRefOrNull: SDK_HEAD,
      treeRefOrNull: SDK_TREE,
      branchRefOrNull: 'main',
      claimRefOrNull: 'github.pull.vexlife-prod.116',
      exactPathRefs: [],
      authorityBinding: {
        authoritySchemaRef: 'vextreme.effect-transaction/v1',
        authorityEnvelopePath: 'authority/effect.json',
        authorityEnvelopeSha256: '0'.repeat(64),
        semanticAdmissionRef: authorityEnvelope.semanticAdmissionRef,
        transactionRef: authorityEnvelope.transactionRef,
        transactionVersion: authorityEnvelope.transactionVersion,
        allowedEffectRefs: [...authorityEnvelope.allowedEffectRefs],
        heldEffectRefs: [...authorityEnvelope.heldEffectRefs],
      },
      payload: {
        payloadClass: nativeVexRelay.VEXRELAY_ARCHIVE_PAYLOAD_CLASS,
        payloadRuntime: nativeVexRelay.VEXRELAY_ARCHIVE_RUNTIME,
        payloadPath: 'payload/inner-vexrelay.zip',
        payloadSha256: '0'.repeat(64),
        typedArgv: [],
        immutableInputs: [{
          path: 'inputs/vexrelay-binding.json',
          sha256: '0'.repeat(64),
        }],
      },
      executionStateAtFormation: 'TASK_PREPARED',
      singleUseNonce: 'nonce-vexlife-prod-pr116-source-owner-proof-carrier-a002',
      stopConditions: ['stop.on.identity.drift', 'stop.on.auth.block', 'stop.on.test.failure'],
      archiveDigestBinding: 'FILENAME_SHA256',
    };

    console.log('PR116 SourceOwner: forming current-contract native carrier...');
    const formed = await formVexRelayTaskArchiveCarrier({
      recipe: 'ExactHeadSourceOwnerProof',
      seed,
      stage,
      outerTaskTemplate,
      authorityEnvelope,
      outputDirectory: downloads,
      outputStem: 'Vex-PR116-SO-A002',
      ttlMs: 30 * 60 * 1000,
    });

    requireEqual(
      JSON.stringify(formed.inner.manifest),
      JSON.stringify(compiled),
      'producer/compiler parity',
    );
    requireEqual(
      formed.outer.formationEvidence.finalByteQualification,
      'PASS',
      'outer final-byte qualification',
    );

    const expectedSuffix = '--sha256-' + formed.outer.digest + '.zip';
    if (!path.basename(formed.outer.finalZip).endsWith(expectedSuffix)) {
      fail('outer ZIP filename/digest binding mismatch');
    }

    console.log('PR116 SourceOwner carrier: ' + formed.outer.finalZip);
    console.log('PR116 SourceOwner carrier sha256: ' + formed.outer.digest);
    console.log('PR116 SourceOwner: executing exact carrier...');

    const runCommand = path.join(
      sdkRoot,
      'lib/vexlocalbridge/templates/RUN-VEX-TASK.command',
    );
    const execution = spawnSync(
      bash,
      [runCommand, formed.outer.finalZip],
      {
        env: {
          ...process.env,
          VEX_EXPECTED_PACKAGE_SHA256: formed.outer.digest,
        },
        shell: false,
        stdio: 'inherit',
      },
    );
    if (execution.error) throw execution.error;
    if (execution.status !== 0) {
      fail('VexLocalBridge carrier execution failed with exit ' + execution.status);
    }

    const capsuleRoot = formed.outer.finalZip.replace(
      /\.zip$/u,
      '-run-' + formed.outer.digest.slice(0, 16),
    );
    console.log('PR116 SourceOwner exact capsule: ' + capsuleRoot);
    console.log('PR116 SourceOwner returned terminal success. Finder should reveal the canonical RETURN ZIP.');
  } finally {
    await fsp.rm(bootstrapRoot, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error('PR116 SourceOwner failed: ' + (error && error.stack ? error.stack : String(error)));
  process.exitCode = 1;
});
