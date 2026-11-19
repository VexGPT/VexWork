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

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'vexwork-e2e-relay-'));
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
  const attemptRef = `attempt.vexwork.vexlife-prod-e2e.chatgpt-source-owner.${stamp}`;
  const packageRef = `package.vexwork.vexlife-prod-e2e.chatgpt-source-owner.${stamp}`;
  const nonce = `nonce-vexwork-vexlife-prod-e2e-${request.candidate.head.slice(0,12)}-${stamp}`;
  const formed = new Date();
  const innerExpires = new Date(formed.getTime() + 6 * 60 * 60 * 1000);
  const effects = ['READ_REPOSITORY','CHECK_STATE','QUERY_PROVIDER','RUN_LOCAL_COMMAND','FORM_RESULT'];
  const sourcePaths = request.candidate.changedPaths.map((p) => ({ repositoryRef:'primary', path:p }));

  const seed = {
    schemaVersion:'vex.relay.task/v2', continuity:'[VXG RealForever]',
    taskRef:'task.vexwork.vexlife-prod-e2e.chatgpt-source-owner', attemptRef,
    requestRef:'request.vexwork.vexlife-prod-e2e.chatgpt-source-owner',
    correlationRef:'correlation.vexwork.vexlife-prod-e2e.chatgpt-source-owner', packageRef,
    original:{
      originalIntent:'Prove the independent ChatGPT Experience Relationship Graph candidate exactly before blind comparison with the sibling worker.',
      originalGoal:'Run the focused ERG proof and the repository-owned deterministic review against the exact immutable candidate.',
      userProtectedIntent:'Keep Victor out of technical interpretation; one host action returns canonical evidence.',
      sourceRefs:['github.pull.vexwork.320','project.vexlife-prod.end-to-end-tests']
    },
    lane:{
      entryClass:'SAME_LANE_SUCCESSOR', scopeMode:'STAGE_BOUNDED',
      laneRef:'lane.vexwork.vexlife-prod-e2e.chatgpt', parentRootRef:'project.vexlife-prod.end-to-end-tests',
      workRef:'work.vexlife-prod.end-to-end-tests.experience-topology', claimRef:'github.pull.vexwork.320',
      returnRouteRef:'route.vexwork.vexlife-prod-e2e.chatgpt-source-owner-return',
      ownerRef:'actor.chatgpt.vexlife-prod-e2e-route-prototype', rootHubRef:'project.vexlife-prod.end-to-end-tests'
    },
    role:{
      activeRole:'CODER', roleRef:'role.coder.vexwork.vexlife-prod-e2e',
      instanceRef:'instance.chatgpt.vexlife-prod-e2e-route-prototype.20261118.a001',
      occupancyRef:'occupancy.vexwork.vexlife-prod-e2e.chatgpt-source-owner',
      providerBindingRef:'provider.github.vexwork', threadRef:'thread.vexwork.vexlife-prod-e2e.chatgpt',
      authorityEnvelopeRef:'authority-envelope.vexwork.vexlife-prod-e2e.chatgpt-source-owner'
    },
    capabilities:{platformGitHubRead:'UNAVAILABLE',platformGitHubWrite:'UNAVAILABLE'},
    execution:{
      hostProfile:'macos-victor', executionSurface:'MAC_ZIP_RUN_COMMAND', singleUseNonce:nonce,
      duplicateAttemptMarker:`marker.${attemptRef}`, duplicateProtectionMode:'OUTER_RELAY_BOUND',
      formedAt:formed.toISOString(), expiresAtOrNull:innerExpires.toISOString()
    },
    workspace:{mode:'RUN_ROOT',projectRef:'project.vexlife-prod.end-to-end-tests',projectPath:'workspace',createRoot:false,createProjectPath:false},
    repositories:[{
      repositoryRef:'primary',mode:'CLONE_IN_WORKSPACE',cloneTransport:'GIT',cloneUrl:request.candidate.cloneUrl,
      nameWithOwner:request.candidate.repository,localPath:'repositories/vexwork',remote:'origin',
      baseBranch:request.candidate.baseBranch,acceptedBase:request.candidate.baseHead,expectedHead:request.candidate.head,
      branch:request.candidate.branch,expectedRemoteUrl:null
    }],
    authority:{
      authorityRef:'authority.vexwork.vexlife-prod-e2e.chatgpt-source-owner',authorityMode:'EXACT_STAGE_EFFECTS',
      grantedEffects:[...effects],conditionalEffects:[],consumedEffects:[],remainingEffects:[...effects],
      heldEffects:['WRITE_SOURCE','CREATE_BRANCH','CREATE_COMMIT','PUSH_BRANCH','CREATE_PULL_REQUEST','APPROVE_EXACT_HEAD','MARK_READY','ORDINARY_MERGE'],
      repositoryMembranes:[{repositoryRef:'primary',allowedPaths:[...request.candidate.changedPaths]}],
      allowedExecutables:['node','npm','git','gh'],allowedEnvironment:['PATH','HOME'],remoteObservationOwner:'LocalRelay',allowMutationLoop:false,
      stopConditions:['STOP_ON_UNKNOWN','STOP_ON_PATH_ESCAPE','STOP_ON_AUTH_BLOCK','STOP_ON_TEST_FAILURE']
    },
    source:{
      sourceSetRef:'source-set.vexwork.vexlife-prod-e2e.chatgpt-source-owner',
      sourceVersionRef:`source-version.vexwork.${request.candidate.head}`,
      overlapEvidenceRef:'overlap.vexwork.vexlife-prod-e2e.chatgpt-isolated-branch',activeConflictState:'NONE',
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
    stateRef:'state.vexwork.vexlife-prod-e2e.chatgpt-source-owner',currentLifecycleState:'SOURCE_READY',
    currentGoal:'Prove the exact independent ChatGPT ERG candidate before blind strategy comparison.',
    remainingGoals:['Consume canonical proof','Run fresh comparison/convergence with the sibling worker without retroactively shaping this candidate.'],
    onPass:{
      lifecycleState:'ASSURANCE_PENDING',nextFunction:'F13.RUN_FRESH_ASSURANCE',nextOwner:'Operations',
      whyThisIsNext:'Exact SourceOwner proof is complete; independent comparison/assurance remains separate.'
    },
    resultFilename:'RETURN-VEXWORK-E2E-CHATGPT-SOURCE-OWNER.zip'
  };

  const authorityEnvelope = {
    authoritySchemaRef:'vextreme.effect-transaction/v1', semanticAdmissionRef:'github.pull.vexwork.320',
    transactionRef:`transaction.vexwork.vexlife-prod-e2e.chatgpt-source-owner.${stamp}`,transactionVersion:1,
    allowedEffectRefs:['effect.vexrelay.execute'],heldEffectRefs:['effect.approve','effect.ready','effect.merge']
  };
  const outerTaskTemplate = {
    schemaVersion:'vextreme.vexlocalbridge-task-manifest/v1',artifactClass:'EXECUTABLE_RELAY',
    taskRef:'task.vexwork.vexlife-prod-e2e.chatgpt-source-owner.carrier',
    attemptRef:`attempt.vexwork.vexlife-prod-e2e.chatgpt-source-owner.carrier.${stamp}`,
    packageRef:`package.vexwork.vexlife-prod-e2e.chatgpt-source-owner.carrier.${stamp}`,
    requestRef:'request.vexwork.vexlife-prod-e2e.chatgpt-source-owner.carrier',
    correlationRef:'correlation.vexwork.vexlife-prod-e2e.chatgpt-source-owner.carrier',
    taskStorageKey:'task-vexwork-vexlife-prod-e2e-chatgpt-source-owner',attemptStorageKey:`attempt-${stamp}`,
    requestingRoleRef:'Operations[ChatGPT]',requestingInstanceRef:'instance.chatgpt.vexlife-prod-e2e-route-prototype.20261118.a001',
    parentOperationsRef:'project.vexlife-prod.end-to-end-tests',returnRouteRef:'github.pull.vexwork.320',
    hostProfileRef:'macos-victor',repositoryExecutionProfileRefOrNull:null,repositoryRefOrNull:request.candidate.repository,
    baseRefOrNull:request.candidate.baseHead,headRefOrNull:request.candidate.head,treeRefOrNull:request.candidate.tree,
    branchRefOrNull:request.candidate.branch,claimRefOrNull:'github.pull.vexwork.320',exactPathRefs:[...request.candidate.changedPaths],
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
    outputDirectory:downloads,outputStem:'VEXWORK-E2E-CHATGPT-SOURCE-OWNER-A001',ttlMs:4*60*60*1000
  });
  const taskZip = formedCarrier.outer.finalZip;
  const digest = formedCarrier.outer.digest;
  console.log(`VexRelay: formed canonical task ${taskZip}`);
  console.log(`VexRelay: task sha256 ${digest}`);
  const bootstrap = renderMacSourceBootstrapCommand({packageSha256:digest,sdkHead:request.sdk.head,sdkTree:request.sdk.tree});
  console.log('VexRelay: executing accepted Mac source bootstrap...');
  const launched = spawnSync(bash,['-lc',bootstrap],{stdio:'inherit'});
  if (launched.status !== 0) throw new Error(`VEXRELAY_BOOTSTRAP_FAILED:${launched.status}`);
  console.log('VexRelay: canonical RETURN formed. Upload the RETURN ZIP that Finder/Terminal reveals.');
} finally {
  fs.rmSync(tempRoot,{recursive:true,force:true});
}
