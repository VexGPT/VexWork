import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const request = JSON.parse(fs.readFileSync(path.join(here, 'MUTATION-REQUEST.json'), 'utf8'));
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
  if (result.status !== 0) throw new Error(`HOST_COMMAND_FAILED:${path.basename(exe)}:${result.status}:${result.stderr || result.stdout || ''}`);
  return (result.stdout || '').trim();
}
function stamp() { return new Date().toISOString().replace(/[-:.TZ]/g, ''); }

const gh = resolveExec(['/opt/homebrew/bin/gh','/usr/local/bin/gh'], 'gh');
const git = resolveExec(['/usr/bin/git'], 'git');
const bash = resolveExec(['/bin/bash'], 'bash');
run(gh, ['auth','status','--hostname','github.com']);

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'vexwork-e2e-generated-relay-'));
const sdkRoot = path.join(tempRoot, 'Vextreme-SDK');

try {
  run(gh, ['repo','clone',request.sdk.repository,sdkRoot,'--','--no-checkout']);
  run(git, ['-C',sdkRoot,'checkout','--detach',request.sdk.head]);
  const sdkHead = run(git, ['-C',sdkRoot,'rev-parse','HEAD']);
  const sdkTree = run(git, ['-C',sdkRoot,'rev-parse','HEAD^{tree}']);
  if (sdkHead !== request.sdk.head) throw new Error(`SDK_HEAD_MISMATCH:${sdkHead}`);
  if (sdkTree !== request.sdk.tree) throw new Error(`SDK_TREE_MISMATCH:${sdkTree}`);
  const contract = JSON.parse(fs.readFileSync(path.join(sdkRoot,'docs/private-continuity/vexrelay/current-contract.json'),'utf8'));
  if (contract.contractRef !== request.sdk.contractRef) throw new Error(`SDK_CONTRACT_MISMATCH:${contract.contractRef}`);

  const [{ buildTaskPackage }, packageBuilderModule] = await Promise.all([
    import(pathToFileURL(path.join(sdkRoot,'lib/vexrelay/package.mjs')).href),
    import(pathToFileURL(path.join(sdkRoot,'lib/vexlocalbridge/package-builder.js')).href),
  ]);
  const require = createRequire(import.meta.url);
  const packageBuilder = packageBuilderModule.default;
  const nativeVexRelay = require(path.join(sdkRoot,'lib/vexlocalbridge/vexrelay-task-archive.js'));
  const { renderMacSourceBootstrapCommand } = require(path.join(sdkRoot,'lib/vexlocalbridge/mac-source-bootstrap-command.js'));

  const {
    assertConfined,
    bindAuthoritySummaryFromEnvelope,
    createCanonicalTaskZip,
    hashFile,
    writeJson,
  } = packageBuilder;

  const nowStamp = stamp();
  const attemptRef = `attempt.vexwork.vexlife-prod-e2e.generated-consequences.${nowStamp}`;
  const packageRef = `package.vexwork.vexlife-prod-e2e.generated-consequences.${nowStamp}`;
  const formedAt = new Date();
  const expiresAt = new Date(formedAt.getTime() + 6 * 60 * 60 * 1000);
  const branch = request.candidate.branch;
  const startingHead = request.candidate.head;
  const startingTree = request.candidate.tree;
  const generated = request.candidate.generatedPaths;
  const sourcePathRecords = generated.map((p) => ({ repositoryRef:'primary', path:p }));

  const manifest = {
    schemaVersion:'vex.relay.task/v2',
    continuity:'[VXG RealForever]',
    taskRef:'task.vexwork.vexlife-prod-e2e.generated-consequences',
    attemptRef,
    requestRef:`request.vexwork.vexlife-prod-e2e.generated-consequences.${nowStamp}`,
    correlationRef:`correlation.vexwork.vexlife-prod-e2e.generated-consequences.${nowStamp}`,
    packageRef,
    original:{
      originalIntent:'Finish the VexLife-Prod E2E Project generated-discoverability edge declared by VexWork PR #317 without changing Product semantics.',
      originalGoal:'Regenerate exactly the Project Registry, canonical public Workgraph, and public workspace; prove their currentness; commit and non-force push the existing ChatGPT PR branch.',
      userProtectedIntent:'Victor performs one bounded host action and does not choose scripts, branches, generated files, or interpret receipts.',
      sourceRefs:['github.pull.vexwork.317','github.pull.vexwork.320','project.vexlife-prod.end-to-end-tests']
    },
    lane:{
      entryClass:'SAME_LANE_SUCCESSOR',
      scopeMode:'STAGE_BOUNDED',
      laneRef:'lane.vexwork.vexlife-prod-e2e.chatgpt',
      parentRootRef:'project.vexlife-prod.end-to-end-tests',
      workRef:'work.vexlife-prod.end-to-end-tests.experience-topology',
      claimRef:'github.pull.vexwork.320',
      returnRouteRef:'route.vexwork.vexlife-prod-e2e.generated-consequences-return',
      ownerRef:'actor.chatgpt.vexlife-prod-e2e-route-prototype',
      rootHubRef:'project.vexlife-prod.end-to-end-tests'
    },
    role:{
      activeRole:'CODER',
      roleRef:'role.coder.vexwork.vexlife-prod-e2e',
      instanceRef:'instance.chatgpt.vexlife-prod-e2e-route-prototype.20261118.a001',
      occupancyRef:'occupancy.vexwork.vexlife-prod-e2e.generated-consequences',
      providerBindingRef:'provider.github.vexwork',
      threadRef:'thread.vexwork.vexlife-prod-e2e.chatgpt',
      authorityEnvelopeRef:'authority-envelope.vexwork.vexlife-prod-e2e.generated-consequences'
    },
    capabilities:{platformGitHubRead:'UNAVAILABLE',platformGitHubWrite:'UNAVAILABLE'},
    execution:{
      hostProfile:'macos-victor',
      executionSurface:'MAC_ZIP_RUN_COMMAND',
      singleUseNonce:`nonce-vexwork-generated-${startingHead.slice(0,12)}-${nowStamp}`,
      duplicateAttemptMarker:`marker.${attemptRef}`,
      duplicateProtectionMode:'OUTER_RELAY_BOUND',
      formedAt:formedAt.toISOString(),
      expiresAtOrNull:expiresAt.toISOString()
    },
    workspace:{
      mode:'RUN_ROOT',
      projectRef:'project.vexlife-prod.end-to-end-tests',
      projectPath:'workspace',
      createRoot:true,
      createProjectPath:true
    },
    repositories:[{
      repositoryRef:'primary',
      mode:'CLONE_IN_WORKSPACE',
      cloneTransport:'GITHUB_GH',
      githubHostname:'github.com',
      nameWithOwner:request.candidate.repository,
      localPath:'repositories/vexwork',
      remote:'origin',
      baseBranch:request.candidate.baseBranch,
      acceptedBase:request.candidate.baseHead,
      checkoutRef:startingHead,
      expectedHead:startingHead,
      branch,
      expectedRemoteUrl:null
    }],
    authority:{
      authorityRef:'authority.vexwork.vexlife-prod-e2e.generated-consequences',
      authorityMode:'EXACT_STAGE_EFFECTS',
      grantedEffects:[
        'CHECK_AUTH','READ_REPOSITORY','CHECK_STATE','QUERY_PROVIDER',
        'RUN_LOCAL_COMMAND','CREATE_BRANCH','CREATE_COMMIT','PUSH_BRANCH','FORM_RESULT'
      ],
      conditionalEffects:[],
      consumedEffects:[],
      remainingEffects:[
        'CHECK_AUTH','READ_REPOSITORY','CHECK_STATE','QUERY_PROVIDER',
        'RUN_LOCAL_COMMAND','CREATE_BRANCH','CREATE_COMMIT','PUSH_BRANCH','FORM_RESULT'
      ],
      heldEffects:[
        'WRITE_SOURCE','CREATE_PULL_REQUEST','UPDATE_COORDINATION_METADATA',
        'APPROVE_EXACT_HEAD','MARK_READY','ORDINARY_MERGE'
      ],
      repositoryMembranes:[{repositoryRef:'primary',allowedPaths:[...generated]}],
      allowedExecutables:['node','npm','git','gh'],
      allowedEnvironment:['PATH','HOME'],
      remoteObservationOwner:'LocalRelay',
      allowMutationLoop:false,
      stopConditions:[
        'STOP_ON_UNKNOWN','STOP_ON_PATH_ESCAPE','STOP_ON_AUTH_BLOCK',
        'STOP_ON_BASE_OR_BRANCH_DRIFT','STOP_ON_PATH_OVERLAP',
        'STOP_ON_TEST_FAILURE','STOP_ON_PATH_SET_DRIFT','STOP_ON_NON_FORCE_PUSH_RACE'
      ]
    },
    source:{
      sourceSetRef:'source-set.vexwork.vexlife-prod-e2e.generated-consequences',
      sourceVersionRef:`source-version.vexwork.generated-from-${startingHead}`,
      overlapEvidenceRef:'overlap.vexwork.vexlife-prod-e2e.generated-consequences',
      activeConflictState:'NONE',
      candidateState:'FORMING',
      candidateHead:null,
      candidateTree:null,
      expectedChangedPaths:sourcePathRecords,
      intentionallyUnchangedAuthorizedPaths:[]
    },
    completionPolicy:{
      progressMode:'EXACT_STAGE_GATE',
      completionTarget:'SOURCE_PUBLICATION',
      stageGateOrNull:null,
      automaticContinuation:true,
      humanRoundTripPolicy:'IRREDUCIBLE_ONLY',
      stopOnlyOn:[
        'TERMINAL','CAGE','USER_ACTION_REQUIRED','AUTHORITY_UNAVAILABLE',
        'EVIDENCE_REJECTED','EXECUTION_SURFACE_REQUIRED','PROTECTED_DECISION_REQUIRED'
      ]
    },
    continuationPlan:{
      stateRef:'state.vexwork.vexlife-prod-e2e.generated-consequences',
      currentLifecycleState:'SOURCE_MUTATION_PENDING',
      currentGoal:'Regenerate and publish only the repository-owned discoverability consequences for the admitted E2E Project source.',
      remainingGoals:[
        'Consume exact generated-consequence publication proof.',
        'Run final exact-head SourceOwner proof while preserving unrelated baseline failures.',
        'Compare the completed independent strategy with the sibling worker only after this lane is source-complete.'
      ],
      onPass:{
        lifecycleState:'CANDIDATE_PUBLISHED',
        nextFunction:'F10.OBSERVE_REMOTE_EVIDENCE',
        nextOwner:'Operations',
        whyThisIsNext:'The exact generated consequences were locally proven and non-force published; final exact-head evidence is next.'
      },
      onFailure:{
        lifecycleState:'BLOCKED',
        nextFunction:'F11.CLASSIFY_EDGE_CAGE',
        nextOwner:'Operations',
        whyThisIsNext:'Classify the first failed generation, proof, path, or publication predicate without replaying completed effects.'
      },
      onUserActionRequired:{
        lifecycleState:'AUTHENTICATION_REQUIRED',
        nextFunction:'F08.EXECUTE_OR_HANDOFF',
        nextOwner:'Victor+Operations',
        whyThisIsNext:'Only the typed host action may resume the same semantic task after re-grounding.'
      }
    },
    policy:{
      maxOuterReturnFiles:10,
      maxSelectedSourceEntries:10,
      maxSelectedSourceBytes:5000000,
      maxDiffBytes:10000000,
      requireRacePreflightBeforeMutation:true,
      requireLocalValidationBeforePublish:true,
      requireInputPackageManifest:true,
      signoffCommit:true,
      draftPullRequest:true
    },
    operations:[
      {ref:'auth.github',op:'AUTH',action:'GITHUB_GH',repositoryRef:'primary',loginMode:'PROMPT_ONLY'},
      {ref:'read.before',op:'READ',action:'REPOSITORY_STATE',repositoryRef:'primary'},
      {ref:'check.clean',op:'CHECK',action:'CLEAN_WORKTREE',repositoryRef:'primary'},
      {ref:'check.head',op:'CHECK',action:'EXPECTED_HEAD',repositoryRef:'primary',expected:startingHead},
      {ref:'check.tree',op:'CHECK',action:'EXPECTED_TREE',repositoryRef:'primary',expected:startingTree},
      {ref:'check.remote-base',op:'CHECK',action:'REMOTE_BASE_HEAD',repositoryRef:'primary',expected:request.candidate.baseHead},
      {ref:'check.remote-branch',op:'CHECK',action:'REMOTE_BRANCH_HEAD',repositoryRef:'primary',branch,expected:startingHead},
      {ref:'check.overlap',op:'CHECK',action:'OPEN_PR_PATH_OVERLAP_CLEAR',repositoryRef:'primary',maxPullRequests:100},
      {ref:'publish.branch',op:'PUBLISH',action:'PREPARE_BRANCH',repositoryRef:'primary',branch,startPoint:startingHead},
      {ref:'run.generate',op:'RUN',action:'COMMAND',repositoryRef:'primary',command:'npm',args:['run','workspace:build'],proofClass:'TOOL',mutationClass:'SOURCE',candidateEvidence:false,acceptedExitCodes:[0],timeoutMs:600000},
      {ref:'check.membrane',op:'CHECK',action:'PATHS_WITHIN_MEMBRANE',repositoryRef:'primary'},
      {ref:'check.nonempty',op:'CHECK',action:'DIFF_NONEMPTY',repositoryRef:'primary'},
      {ref:'check.paths',op:'CHECK',action:'EXPECTED_CHANGED_PATHS_EXACT',repositoryRef:'primary'},
      {ref:'proof.erg',op:'RUN',action:'COMMAND',repositoryRef:'primary',command:'node',args:['--test','test/vexlife-prod-e2e-relationship-graph.test.mjs'],proofClass:'TEST',mutationClass:'NONE',candidateEvidence:true,acceptedExitCodes:[0],timeoutMs:600000},
      {ref:'proof.composition',op:'RUN',action:'COMMAND',repositoryRef:'primary',command:'node',args:['--test','test/workgraph-composition-source.test.mjs','test/vexwork-vexarchitecture-e2e.test.mjs'],proofClass:'TEST',mutationClass:'NONE',candidateEvidence:true,acceptedExitCodes:[0],timeoutMs:600000},
      {ref:'proof.registry-current',op:'RUN',action:'COMMAND',repositoryRef:'primary',command:'npm',args:['run','project-registry:check'],proofClass:'TEST',mutationClass:'NONE',candidateEvidence:true,acceptedExitCodes:[0],timeoutMs:600000},
      {ref:'proof.workgraph-current',op:'RUN',action:'COMMAND',repositoryRef:'primary',command:'npm',args:['run','workgraph:check'],proofClass:'TEST',mutationClass:'NONE',candidateEvidence:true,acceptedExitCodes:[0],timeoutMs:600000},
      {ref:'proof.workspace-current',op:'RUN',action:'COMMAND',repositoryRef:'primary',command:'npm',args:['run','workspace:check'],proofClass:'TEST',mutationClass:'NONE',candidateEvidence:true,acceptedExitCodes:[0],timeoutMs:600000},
      {ref:'publish.commit',op:'PUBLISH',action:'COMMIT',repositoryRef:'primary',message:'[VexLife-Prod E2E] Regenerate Project discoverability consequences',authorName:'VexGPT',authorEmail:'victor.gong@vextreme24.com'},
      {ref:'check.committed-head',op:'CHECK',action:'EXPECTED_HEAD',repositoryRef:'primary',expected:'$CANDIDATE_HEAD'},
      {ref:'check.committed-tree',op:'CHECK',action:'EXPECTED_TREE',repositoryRef:'primary',expected:'$CANDIDATE_TREE'},
      {ref:'proof.committed-erg',op:'RUN',action:'COMMAND',repositoryRef:'primary',command:'node',args:['--test','test/vexlife-prod-e2e-relationship-graph.test.mjs'],proofClass:'TEST',mutationClass:'NONE',candidateEvidence:true,acceptedExitCodes:[0],timeoutMs:600000},
      {ref:'query.review',op:'QUERY',action:'REVIEW_SNAPSHOT',repositoryRef:'primary',base:startingHead,head:'HEAD',maxFiles:10},
      {ref:'publish.push',op:'PUBLISH',action:'PUSH',repositoryRef:'primary',branch,expectedRemoteHead:startingHead},
      {ref:'respond',op:'RESPOND',action:'CANONICAL_RETURN'}
    ],
    result:{filename:'RETURN-VEXWORK-E2E-GENERATED-CONSEQUENCES.zip'}
  };

  const innerRoot = path.join(tempRoot,'inner');
  fs.mkdirSync(innerRoot,{recursive:true});
  const manifestPath = path.join(innerRoot,'task.manifest.json');
  writeJson(manifestPath, manifest);
  const innerPackage = await buildTaskPackage({
    manifestPath,
    outputDirectory:tempRoot,
    outputStem:'VEXWORK-E2E-GENERATED-CONSEQUENCES-INNER'
  });

  const innerManifest = JSON.parse(fs.readFileSync(manifestPath,'utf8'));
  const repoBinding = innerManifest.repositories.find((entry)=>entry.repositoryRef==='primary');
  if (innerManifest.workspace.createRoot !== true || innerManifest.workspace.createProjectPath !== true) throw new Error('INNER_WORKSPACE_CREATION_BINDING_INVALID');
  if (repoBinding.checkoutRef !== startingHead || repoBinding.expectedHead !== startingHead) throw new Error('INNER_STARTING_HEAD_BINDING_INVALID');
  if (JSON.stringify(innerManifest.source.expectedChangedPaths.map((x)=>x.path).sort()) !== JSON.stringify([...generated].sort())) throw new Error('INNER_GENERATED_PATH_MEMBRANE_INVALID');

  const contentRoot = path.join(tempRoot,'outer-content');
  fs.mkdirSync(contentRoot,{recursive:true});
  const authorityEnvelope = {
    authoritySchemaRef:'vextreme.effect-transaction/v1',
    semanticAdmissionRef:'github.pull.vexwork.320',
    transactionRef:`transaction.vexwork.vexlife-prod-e2e.generated-consequences.${nowStamp}`,
    transactionVersion:1,
    allowedEffectRefs:['effect.vexrelay.execute','effect.vexwork.generated-consequences.publish'],
    heldEffectRefs:['effect.approve','effect.ready','effect.merge']
  };
  const authorityPath = assertConfined(contentRoot,path.resolve(contentRoot,'authority/effect.json'),{mustExist:false});
  const payloadPath = assertConfined(contentRoot,path.resolve(contentRoot,'payload/inner-vexrelay.zip'),{mustExist:false});
  const bindingPath = assertConfined(contentRoot,path.resolve(contentRoot,'inputs/vexrelay-binding.json'),{mustExist:false});
  writeJson(authorityPath,authorityEnvelope);
  fs.mkdirSync(path.dirname(payloadPath),{recursive:true});
  fs.copyFileSync(innerPackage.outputPath,payloadPath);
  writeJson(bindingPath,nativeVexRelay.buildVexRelayArchiveBinding({
    innerManifest,
    innerArchiveSha256:innerPackage.sha256
  }));

  const outerTaskTemplate = {
    schemaVersion:'vextreme.vexlocalbridge-task-manifest/v1',
    artifactClass:'EXECUTABLE_RELAY',
    taskRef:'task.vexwork.vexlife-prod-e2e.generated-consequences.carrier',
    attemptRef:`attempt.vexwork.vexlife-prod-e2e.generated-consequences.carrier.${nowStamp}`,
    packageRef:`package.vexwork.vexlife-prod-e2e.generated-consequences.carrier.${nowStamp}`,
    requestRef:`request.vexwork.vexlife-prod-e2e.generated-consequences.carrier.${nowStamp}`,
    correlationRef:`correlation.vexwork.vexlife-prod-e2e.generated-consequences.carrier.${nowStamp}`,
    taskStorageKey:'task-vexwork-vexlife-prod-e2e-generated-consequences',
    attemptStorageKey:`attempt-${nowStamp}`,
    requestingRoleRef:'Operations[ChatGPT]',
    requestingInstanceRef:'instance.chatgpt.vexlife-prod-e2e-route-prototype.20261118.a001',
    parentOperationsRef:'project.vexlife-prod.end-to-end-tests',
    returnRouteRef:'github.pull.vexwork.320',
    hostProfileRef:'macos-victor',
    repositoryExecutionProfileRefOrNull:'profile.repository.vextreme-sdk.macos-v1',
    repositoryRefOrNull:request.candidate.repository,
    baseRefOrNull:request.candidate.baseHead,
    headRefOrNull:startingHead,
    treeRefOrNull:startingTree,
    branchRefOrNull:branch,
    claimRefOrNull:'github.pull.vexwork.320',
    exactPathRefs:[...generated],
    authorityBinding:{
      authoritySchemaRef:'vextreme.effect-transaction/v1',
      authorityEnvelopePath:'authority/effect.json',
      authorityEnvelopeSha256:'0'.repeat(64),
      semanticAdmissionRef:'stale',
      transactionRef:'stale',
      transactionVersion:1,
      allowedEffectRefs:['stale'],
      heldEffectRefs:[]
    },
    payload:{
      payloadClass:nativeVexRelay.VEXRELAY_ARCHIVE_PAYLOAD_CLASS,
      payloadRuntime:nativeVexRelay.VEXRELAY_ARCHIVE_RUNTIME,
      payloadPath:'payload/inner-vexrelay.zip',
      payloadSha256:'0'.repeat(64),
      typedArgv:[],
      immutableInputs:[{path:'inputs/vexrelay-binding.json',sha256:'0'.repeat(64)}]
    },
    executionStateAtFormation:'TASK_PREPARED',
    singleUseNonce:`nonce-carrier-generated-${startingHead.slice(0,12)}-${nowStamp}`,
    stopConditions:['stop.on.identity.drift','stop.on.auth.block','stop.on.path.drift','stop.on.test.failure','stop.on.push.race'],
    archiveDigestBinding:'FILENAME_SHA256'
  };

  outerTaskTemplate.authorityBinding.authorityEnvelopeSha256 = hashFile(authorityPath);
  outerTaskTemplate.payload.payloadSha256 = innerPackage.sha256;
  outerTaskTemplate.payload.immutableInputs[0].sha256 = hashFile(bindingPath);

  const formedOuter = createCanonicalTaskZip({
    taskTemplate:bindAuthoritySummaryFromEnvelope(outerTaskTemplate,authorityEnvelope),
    contentRoot,
    outputDirectory:downloads,
    outputStem:'VEXWORK-E2E-GENERATED-CONSEQUENCES-A001',
    ttlMs:4*60*60*1000
  });

  if (formedOuter.task.repositoryExecutionProfileRefOrNull !== 'profile.repository.vextreme-sdk.macos-v1') throw new Error('OUTER_PROFILE_BINDING_INVALID');
  console.log('VexRelay: generated-consequence manifest preflight PASS');
  console.log(`VexRelay: formed canonical mutation task ${formedOuter.finalZip}`);
  console.log(`VexRelay: task sha256 ${formedOuter.digest}`);

  const bootstrap = renderMacSourceBootstrapCommand({
    packageSha256:formedOuter.digest,
    sdkHead:request.sdk.head,
    sdkTree:request.sdk.tree
  });
  const launched = spawnSync(bash,['-lc',bootstrap],{stdio:'inherit'});
  if (launched.status !== 0) throw new Error(`VEXRELAY_GENERATED_CONSEQUENCE_BOOTSTRAP_FAILED:${launched.status}`);
  console.log('VexRelay: generated-consequence canonical RETURN formed. Upload the RETURN ZIP Finder/Terminal reveals.');
} finally {
  fs.rmSync(tempRoot,{recursive:true,force:true});
}
