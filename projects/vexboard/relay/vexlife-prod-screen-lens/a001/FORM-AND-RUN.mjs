import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const request = JSON.parse(fs.readFileSync(path.join(here, 'REQUEST.json'), 'utf8'));
const downloads = path.join(os.homedir(), 'Downloads');
fs.mkdirSync(downloads, { recursive: true });

function resolveExec(candidates, label) {
  for (const candidate of candidates) {
    try { if (fs.statSync(candidate).isFile()) return candidate; } catch {}
  }
  throw new Error(`HOST_EXECUTABLE_UNAVAILABLE:${label}`);
}
function run(exe, args, options = {}) {
  const result = spawnSync(exe, args, { encoding:'utf8', stdio: options.inherit ? 'inherit' : 'pipe', ...options });
  if (result.status !== 0) {
    throw new Error(`HOST_COMMAND_FAILED:${path.basename(exe)}:${result.status}:${result.stderr || result.stdout || ''}`);
  }
  return (result.stdout || '').trim();
}
function stableStamp() { return new Date().toISOString().replace(/[-:.TZ]/g, ''); }

const gh = resolveExec(['/opt/homebrew/bin/gh','/usr/local/bin/gh'], 'gh');
const git = resolveExec(['/usr/bin/git'], 'git');
const bash = resolveExec(['/bin/bash'], 'bash');
run(gh, ['auth','status','--hostname','github.com']);

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'vexwork-screen-lens-relay-'));
const sdkRoot = path.join(tempRoot, 'Vextreme-SDK');
try {
  run(gh, ['repo','clone',request.sdk.repository,sdkRoot,'--','--no-checkout']);
  run(git, ['-C',sdkRoot,'checkout','--detach',request.sdk.head]);
  const observedHead = run(git, ['-C',sdkRoot,'rev-parse','HEAD']);
  const observedTree = run(git, ['-C',sdkRoot,'rev-parse','HEAD^{tree}']);
  if (observedHead !== request.sdk.head) throw new Error(`SDK_HEAD_MISMATCH:${observedHead}`);
  if (observedTree !== request.sdk.tree) throw new Error(`SDK_TREE_MISMATCH:${observedTree}`);
  const contract = JSON.parse(fs.readFileSync(path.join(sdkRoot,'docs/private-continuity/vexrelay/current-contract.json'),'utf8'));
  if (contract.contractRef !== request.sdk.contractRef) throw new Error(`SDK_CONTRACT_MISMATCH:${contract.contractRef}`);

  const { formVexRelayTaskArchiveCarrier } = await import(pathToFileURL(path.join(sdkRoot,'lib/vexlocalbridge/vexrelay-task-archive-carrier-formation.mjs')).href);
  const require = createRequire(import.meta.url);
  const { renderMacSourceBootstrapCommand } = require(path.join(sdkRoot,'lib/vexlocalbridge/mac-source-bootstrap-command.js'));
  const nativeVexRelay = require(path.join(sdkRoot,'lib/vexlocalbridge/vexrelay-task-archive.js'));

  const stamp = stableStamp();
  const attemptRef = `attempt.vexwork.vexlife-prod-screen-lens.source-owner.${stamp}`;
  const packageRef = `package.vexwork.vexlife-prod-screen-lens.source-owner.${stamp}`;
  const nonce = `nonce-vexwork-vexlife-prod-e2e-${request.candidate.head.slice(0,12)}-${stamp}`;
  const formed = new Date();
  const innerExpires = new Date(formed.getTime() + 6 * 60 * 60 * 1000);
  const effects = ['READ_REPOSITORY','CHECK_STATE','QUERY_PROVIDER','RUN_LOCAL_COMMAND','FORM_RESULT'];
  const sourcePaths = request.candidate.changedPaths.map((p) => ({ repositoryRef:'primary', path:p }));

  const seed = {
    schemaVersion:'vex.relay.task/v2', continuity:'[VXG RealForever]',
    taskRef:'task.vexwork.vexlife-prod-screen-lens.source-owner', attemptRef,
    requestRef:'request.vexwork.vexlife-prod-screen-lens.source-owner',
    correlationRef:'correlation.vexwork.vexlife-prod-screen-lens.source-owner', packageRef,
    original:{
      originalIntent:'Make VexLife-Prod a first-class peer of VexLife Android inside the existing VexBoard Screen Lens experience.',
      originalGoal:'Prove exact VexWork PR #325 before raw-git human witness of Prod Stable/Main/Commit and Android Stable.',
      userProtectedIntent:'Projects -> Android or VexLife-Prod -> the same Screen Lens Surface/Structure/Behavior/Depth experience; no generic canvas replacement; no READY or merge before Victor witnesses the exact candidate.',
      sourceRefs:['github.pull.vexwork.321','github.pull.vexwork.325','projects/vexboard/VEXLIFE-PROD-SCREEN-LENS.md']
    },
    lane:{
      entryClass:'SAME_LANE_SUCCESSOR', scopeMode:'STAGE_BOUNDED',
      laneRef:'lane.vexwork.vexlife-prod-e2e.chatgpt', parentRootRef:'github.pull.vexwork.325',
      workRef:'github.pull.vexwork.325', claimRef:'github.pull.vexwork.325',
      returnRouteRef:'route.vexwork.vexlife-prod-screen-lens.source-owner-return',
      ownerRef:'actor.chatgpt.vexlife-prod-screen-lens', rootHubRef:'github.pull.vexwork.325'
    },
    role:{
      activeRole:'CODER', roleRef:'role.coder.vexwork.vexlife-prod-screen-lens',
      instanceRef:'instance.vexwork.vexlife-prod-screen-lens.source-owner.20261119.a001',
      occupancyRef:'occupancy.vexwork.vexlife-prod-screen-lens.source-owner',
      providerBindingRef:'provider.github.vexwork', threadRef:'thread.vexwork.vexlife-prod-screen-lens',
      authorityEnvelopeRef:'authority-envelope.vexwork.vexlife-prod-screen-lens.source-owner'
    },
    capabilities:{platformGitHubRead:'UNAVAILABLE',platformGitHubWrite:'UNAVAILABLE'},
    execution:{
      hostProfile:'macos-victor', executionSurface:'MAC_ZIP_RUN_COMMAND', singleUseNonce:nonce,
      duplicateAttemptMarker:`marker.${attemptRef}`, duplicateProtectionMode:'OUTER_RELAY_BOUND',
      formedAt:formed.toISOString(), expiresAtOrNull:innerExpires.toISOString()
    },
    workspace:{mode:'RUN_ROOT',projectRef:'github.pull.vexwork.325',projectPath:'workspace',createRoot:true,createProjectPath:true},
    repositories:[{
      repositoryRef:'primary',mode:'CLONE_IN_WORKSPACE',cloneTransport:'GIT',cloneUrl:request.candidate.cloneUrl,
      nameWithOwner:request.candidate.repository,localPath:'repositories/vexwork',remote:'origin',
      baseBranch:request.candidate.baseBranch,acceptedBase:request.candidate.baseHead,checkoutRef:request.candidate.head,expectedHead:request.candidate.head,
      branch:request.candidate.branch,expectedRemoteUrl:null
    }],
    authority:{
      authorityRef:'authority.vexwork.vexlife-prod-screen-lens.source-owner',authorityMode:'EXACT_STAGE_EFFECTS',
      grantedEffects:[...effects],conditionalEffects:[],consumedEffects:[],remainingEffects:[...effects],
      heldEffects:['WRITE_SOURCE','CREATE_BRANCH','CREATE_COMMIT','PUSH_BRANCH','CREATE_PULL_REQUEST','APPROVE_EXACT_HEAD','MARK_READY','ORDINARY_MERGE'],
      repositoryMembranes:[{repositoryRef:'primary',allowedPaths:[...request.candidate.changedPaths]}],
      allowedExecutables:['node','npm','git','gh'],allowedEnvironment:['PATH','HOME'],remoteObservationOwner:'LocalRelay',allowMutationLoop:false,
      stopConditions:['STOP_ON_UNKNOWN','STOP_ON_PATH_ESCAPE','STOP_ON_AUTH_BLOCK','STOP_ON_TEST_FAILURE']
    },
    source:{
      sourceSetRef:'source-set.vexwork.vexlife-prod-screen-lens.source-owner',
      sourceVersionRef:`source-version.vexwork.${request.candidate.head}`,
      overlapEvidenceRef:'github.pull.vexwork.325.exact-head',activeConflictState:'NONE',
      candidateState:'EXACT',candidateHead:request.candidate.head,candidateTree:request.candidate.tree,
      expectedChangedPaths:sourcePaths,intentionallyUnchangedAuthorizedPaths:[]
    },
    policy:{
      maxOuterReturnFiles:10,maxSelectedSourceEntries:10,maxSelectedSourceBytes:500000,maxDiffBytes:5000000,
      requireRacePreflightBeforeMutation:false,requireLocalValidationBeforePublish:false,requireInputPackageManifest:true,
      signoffCommit:true,draftPullRequest:true
    }
  };

  const stage = {
    repositoryRef:'primary', expectedBase:request.candidate.baseHead, expectedHead:request.candidate.head,
    expectedTree:request.candidate.tree, branch:request.candidate.branch,
    proofCommands:request.proofCommands, maxFiles:10,
    stateRef:'state.vexwork.vexlife-prod-screen-lens.source-owner',currentLifecycleState:'SOURCE_READY',
    currentGoal:'Prove exact VexWork PR #325 peer-Lens candidate before human raw-git witness.',
    remainingGoals:['Consume canonical exact-head proof.','If PASS, freeze the exact #325 head for Victor raw-git witness.','Witness VexLife-Prod Stable/Main/Commit and Android Stable before any READY or merge decision.'],
    onPass:{
      lifecycleState:'HOSTED_EVIDENCE_PENDING',nextFunction:'HUMAN_RAW_GIT_WITNESS',nextOwner:'Victor',
      whyThisIsNext:'SourceOwner proof establishes the exact candidate; Victor still owns the lived raw-git perception gate before integration.'
    },
    resultFilename:'RETURN-VEXWORK-VEXLIFE-PROD-SCREEN-LENS-SOURCE-OWNER.zip'
  };

  const authorityEnvelope = {
    authoritySchemaRef:'vextreme.effect-transaction/v1', semanticAdmissionRef:'github.pull.vexwork.325',
    transactionRef:`transaction.vexwork.vexlife-prod-screen-lens.source-owner.${stamp}`,transactionVersion:1,
    allowedEffectRefs:['effect.vexrelay.execute'],heldEffectRefs:['effect.approve','effect.ready','effect.merge']
  };
  const outerTaskTemplate = {
    schemaVersion:'vextreme.vexlocalbridge-task-manifest/v1',artifactClass:'EXECUTABLE_RELAY',
    taskRef:'task.vexwork.vexlife-prod-screen-lens.source-owner.carrier',
    attemptRef:`attempt.vexwork.vexlife-prod-screen-lens.source-owner.carrier.${stamp}`,
    packageRef:`package.vexwork.vexlife-prod-screen-lens.source-owner.carrier.${stamp}`,
    requestRef:'request.vexwork.vexlife-prod-screen-lens.source-owner.carrier',
    correlationRef:'correlation.vexwork.vexlife-prod-screen-lens.source-owner.carrier',
    taskStorageKey:'task-vexwork-vexlife-prod-e2e-chatgpt-source-owner',attemptStorageKey:`attempt-${stamp}`,
    requestingRoleRef:'Operations[VexLifeProdScreenLens]',requestingInstanceRef:'github.pull.vexwork.325',
    parentOperationsRef:'github.pull.vexwork.325',returnRouteRef:'github.pull.vexwork.325',
    hostProfileRef:'macos-victor',repositoryExecutionProfileRefOrNull:'profile.repository.vextreme-sdk.macos-v1',repositoryRefOrNull:request.candidate.repository,
    baseRefOrNull:request.candidate.baseHead,headRefOrNull:request.candidate.head,treeRefOrNull:request.candidate.tree,
    branchRefOrNull:request.candidate.branch,claimRefOrNull:'github.pull.vexwork.325',exactPathRefs:[...request.candidate.changedPaths],
    authorityBinding:{
      authoritySchemaRef:'vextreme.effect-transaction/v1',authorityEnvelopePath:'authority/effect.json',authorityEnvelopeSha256:'0'.repeat(64),
      semanticAdmissionRef:'stale',transactionRef:'stale',transactionVersion:1,allowedEffectRefs:['stale'],heldEffectRefs:[]
    },
    payload:{
      payloadClass:nativeVexRelay.VEXRELAY_ARCHIVE_PAYLOAD_CLASS,payloadRuntime:nativeVexRelay.VEXRELAY_ARCHIVE_RUNTIME,
      payloadPath:'payload/inner-vexrelay.zip',payloadSha256:'0'.repeat(64),typedArgv:[],
      immutableInputs:[{path:'inputs/vexrelay-binding.json',sha256:'0'.repeat(64)}]
    },
    executionStateAtFormation:'TASK_PREPARED',singleUseNonce:`nonce-carrier-${request.candidate.head.slice(0,12)}-${stamp}`,
    stopConditions:['stop.on.identity.drift','stop.on.auth.block','stop.on.test.failure'],archiveDigestBinding:'FILENAME_SHA256'
  };

  const formedCarrier = await formVexRelayTaskArchiveCarrier({
    recipe:request.sdk.recipe,seed,stage,outerTaskTemplate,authorityEnvelope,
    outputDirectory:downloads,outputStem:'VEXWORK-VEXLIFE-PROD-SCREEN-LENS-SOURCE-OWNER',ttlMs:4*60*60*1000
  });
  const innerManifest = formedCarrier.inner.manifest;
  const innerRepository = innerManifest.repositories?.find((entry) => entry.repositoryRef === 'primary');
  if (innerManifest.workspace?.mode !== 'RUN_ROOT'
      || innerManifest.workspace?.createRoot !== true
      || innerManifest.workspace?.createProjectPath !== true) {
    throw new Error('FORMED_INNER_RUN_ROOT_BINDING_INVALID');
  }
  if (innerRepository?.checkoutRef !== request.candidate.head
      || innerRepository?.expectedHead !== request.candidate.head
      || innerManifest.source?.candidateHead !== request.candidate.head
      || innerManifest.source?.candidateTree !== request.candidate.tree) {
    throw new Error('FORMED_INNER_CANDIDATE_BINDING_INVALID');
  }
  if (innerManifest.policy?.maxSelectedSourceEntries !== 10) {
    throw new Error(`FORMED_INNER_SOURCE_ENTRY_CAP_INVALID:${innerManifest.policy?.maxSelectedSourceEntries}`);
  }
  if (innerManifest.continuationPlan?.onPass?.lifecycleState !== 'HOSTED_EVIDENCE_PENDING'
      || innerManifest.continuationPlan?.onPass?.nextFunction !== 'HUMAN_RAW_GIT_WITNESS') {
    throw new Error('FORMED_INNER_CONTINUATION_INVALID');
  }
  if (formedCarrier.outer.task?.repositoryExecutionProfileRefOrNull !== 'profile.repository.vextreme-sdk.macos-v1') {
    throw new Error('FORMED_OUTER_REPOSITORY_EXECUTION_PROFILE_INVALID');
  }
  const expectedOperationActions = [
    'REPOSITORY_STATE',
    'EXPECTED_HEAD',
    'EXPECTED_TREE',
    'COMMAND',
    'COMMAND',
    'COMMAND',
    'REVIEW_SNAPSHOT',
    'CANONICAL_RETURN',
  ];
  const observedOperationActions = innerManifest.operations.map((operation) => operation.action);
  if (JSON.stringify(observedOperationActions) !== JSON.stringify(expectedOperationActions)) {
    throw new Error(`FORMED_INNER_OPERATION_SET_INVALID:${observedOperationActions.join(',')}`);
  }

  const review = innerManifest.operations.find((operation) => operation.action === 'REVIEW_SNAPSHOT');
  if (review?.maxFiles !== 10) throw new Error(`FORMED_INNER_REVIEW_CAP_INVALID:${review?.maxFiles}`);
  const taskZip = formedCarrier.outer.finalZip;
  const digest = formedCarrier.outer.digest;
  console.log('VexRelay: formed manifest preflight PASS');
  console.log(`VexRelay: formed canonical task ${taskZip}`);
  console.log(`VexRelay: task sha256 ${digest}`);
  console.log(`VexRelay: candidate ${request.candidate.head}`);
  const bootstrap = renderMacSourceBootstrapCommand({packageSha256:digest,sdkHead:request.sdk.head,sdkTree:request.sdk.tree});
  console.log('VexRelay: executing accepted Mac source bootstrap...');
  const launched = spawnSync(bash,['-lc',bootstrap],{stdio:'inherit'});
  if (launched.status !== 0) throw new Error(`VEXRELAY_BOOTSTRAP_FAILED:${launched.status}`);
  console.log('VexRelay: canonical RETURN formed. Upload the RETURN ZIP that Finder/Terminal reveals.');
} finally {
  fs.rmSync(tempRoot,{recursive:true,force:true});
}
