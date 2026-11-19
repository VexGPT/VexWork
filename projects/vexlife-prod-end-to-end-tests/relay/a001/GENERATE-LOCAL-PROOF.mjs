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
function run(exe, args) {
  const result = spawnSync(exe, args, { encoding:'utf8', stdio:'pipe' });
  if (result.status !== 0) throw new Error(`HOST_COMMAND_FAILED:${path.basename(exe)}:${result.status}:${result.stderr || result.stdout || ''}`);
  return (result.stdout || '').trim();
}
function stamp() { return new Date().toISOString().replace(/[-:.TZ]/g, ''); }

const gh = resolveExec(['/opt/homebrew/bin/gh','/usr/local/bin/gh'], 'gh');
const git = resolveExec(['/usr/bin/git'], 'git');
const bash = resolveExec(['/bin/bash'], 'bash');
run(gh, ['auth','status','--hostname','github.com']);

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'vexwork-e2e-generated-local-proof-'));
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
  const attemptRef = `attempt.vexwork.vexlife-prod-e2e.generated-local-proof.${nowStamp}`;
  const packageRef = `package.vexwork.vexlife-prod-e2e.generated-local-proof.${nowStamp}`;
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
    taskRef:'task.vexwork.vexlife-prod-e2e.generated-local-proof',
    attemptRef,
    requestRef:`request.vexwork.vexlife-prod-e2e.generated-local-proof.${nowStamp}`,
    correlationRef:`correlation.vexwork.vexlife-prod-e2e.generated-local-proof.${nowStamp}`,
    packageRef,
    original:{
      originalIntent:'Finish the independent ChatGPT generated-consequence result without inspecting or overwriting overlapping sibling/provider work.',
      originalGoal:'Regenerate exactly the three repository-owned VexWork projections, prove them, commit only inside the temporary Relay clone, and return the exact local candidate diff/head/tree.',
      userProtectedIntent:'Victor performs one bounded host action; no provider mutation or sibling inspection is required.',
      sourceRefs:['github.pull.vexwork.317','github.pull.vexwork.320','project.vexlife-prod.end-to-end-tests']
    },
    lane:{
      entryClass:'SAME_LANE_SUCCESSOR',
      scopeMode:'STAGE_BOUNDED',
      laneRef:'lane.vexwork.vexlife-prod-e2e.chatgpt',
      parentRootRef:'project.vexlife-prod.end-to-end-tests',
      workRef:'work.vexlife-prod.end-to-end-tests.experience-topology',
      claimRef:'github.pull.vexwork.320',
      returnRouteRef:'route.vexwork.vexlife-prod-e2e.generated-local-proof-return',
      ownerRef:'actor.chatgpt.vexlife-prod-e2e-route-prototype',
      rootHubRef:'project.vexlife-prod.end-to-end-tests'
    },
    role:{
      activeRole:'CODER',
      roleRef:'role.coder.vexwork.vexlife-prod-e2e',
      instanceRef:'instance.chatgpt.vexlife-prod-e2e-route-prototype.20261118.a001',
      occupancyRef:'occupancy.vexwork.vexlife-prod-e2e.generated-local-proof',
      providerBindingRef:'provider.github.vexwork',
      threadRef:'thread.vexwork.vexlife-prod-e2e.chatgpt',
      authorityEnvelopeRef:'authority-envelope.vexwork.vexlife-prod-e2e.generated-local-proof'
    },
    capabilities:{platformGitHubRead:'UNAVAILABLE',platformGitHubWrite:'UNAVAILABLE'},
    execution:{
      hostProfile:'macos-victor',
      executionSurface:'MAC_ZIP_RUN_COMMAND',
      singleUseNonce:`nonce-vexwork-generated-local-${startingHead.slice(0,12)}-${nowStamp}`,
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
      authorityRef:'authority.vexwork.vexlife-prod-e2e.generated-local-proof',
      authorityMode:'EXACT_STAGE_EFFECTS',
      grantedEffects:['CHECK_AUTH','READ_REPOSITORY','CHECK_STATE','QUERY_PROVIDER','RUN_LOCAL_COMMAND','CREATE_COMMIT','FORM_RESULT'],
      conditionalEffects:[],
      consumedEffects:[],
      remainingEffects:['CHECK_AUTH','READ_REPOSITORY','CHECK_STATE','QUERY_PROVIDER','RUN_LOCAL_COMMAND','CREATE_COMMIT','FORM_RESULT'],
      heldEffects:[
        'WRITE_SOURCE','CREATE_BRANCH','PUSH_BRANCH','CREATE_PULL_REQUEST',
        'UPDATE_COORDINATION_METADATA','APPROVE_EXACT_HEAD','MARK_READY','ORDINARY_MERGE'
      ],
      repositoryMembranes:[{repositoryRef:'primary',allowedPaths:[...generated]}],
      allowedExecutables:['node','npm','git','gh'],
      allowedEnvironment:['PATH','HOME'],
      remoteObservationOwner:'LocalRelay',
      allowMutationLoop:false,
      stopConditions:['STOP_ON_UNKNOWN','STOP_ON_PATH_ESCAPE','STOP_ON_TEST_FAILURE','STOP_ON_PATH_SET_DRIFT']
    },
    source:{
      sourceSetRef:'source-set.vexwork.vexlife-prod-e2e.generated-local-proof',
      sourceVersionRef:`source-version.vexwork.generated-local-from-${startingHead}`,
      overlapEvidenceRef:'overlap.vexwork.generated-local-proof.provider-publication-held',
      activeConflictState:'NONE',
      candidateState:'FORMING',
      candidateHead:null,
      candidateTree:null,
      expectedChangedPaths:sourcePathRecords,
      intentionallyUnchangedAuthorizedPaths:[]
    },
    completionPolicy:{
      progressMode:'EXACT_STAGE_GATE',
      completionTarget:'EXACT_NAMED_GATE',
      stageGateOrNull:'LOCAL_GENERATED_CONSEQUENCE_PROOF',
      automaticContinuation:true,
      humanRoundTripPolicy:'IRREDUCIBLE_ONLY',
      stopOnlyOn:[
        'TERMINAL','CAGE','USER_ACTION_REQUIRED','AUTHORITY_UNAVAILABLE',
        'EVIDENCE_REJECTED','EXECUTION_SURFACE_REQUIRED','PROTECTED_DECISION_REQUIRED'
      ]
    },
    continuationPlan:{
      stateRef:'state.vexwork.vexlife-prod-e2e.generated-local-proof',
      currentLifecycleState:'SOURCE_READY',
      currentGoal:'Prove this lane\'s exact generated consequences locally without provider mutation.',
      remainingGoals:[
        'Consume exact local generated candidate and diff.',
        'Open blind sibling comparison only when Victor explicitly permits it.',
        'Reconcile rightful publication ownership after comparison.'
      ],
      onPass:{
        lifecycleState:'ASSURANCE_PENDING',
        nextFunction:'F13.RUN_FRESH_ASSURANCE',
        nextOwner:'Operations',
        whyThisIsNext:'The independent local generated candidate is exact; comparison/coordination remains separate from publication.'
      },
      onFailure:{
        lifecycleState:'BLOCKED',
        nextFunction:'F11.CLASSIFY_EDGE_CAGE',
        nextOwner:'Operations',
        whyThisIsNext:'Classify the exact generation/proof failure without provider mutation or sibling inspection.'
      },
      onUserActionRequired:{
        lifecycleState:'AUTHENTICATION_REQUIRED',
        nextFunction:'F08.EXECUTE_OR_HANDOFF',
        nextOwner:'Victor+Operations',
        whyThisIsNext:'Only the typed host action may resume after re-grounding.'
      }
    },
    policy:{
      maxOuterReturnFiles:10,
      maxSelectedSourceEntries:10,
      maxSelectedSourceBytes:5000000,
      maxDiffBytes:10000000,
      requireRacePreflightBeforeMutation:false,
      requireLocalValidationBeforePublish:false,
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
      {ref:'run.generate',op:'RUN',action:'COMMAND',repositoryRef:'primary',command:'npm',args:['run','workspace:build'],proofClass:'TOOL',mutationClass:'SOURCE',candidateEvidence:false,acceptedExitCodes:[0],timeoutMs:600000},
      {ref:'check.membrane',op:'CHECK',action:'PATHS_WITHIN_MEMBRANE',repositoryRef:'primary'},
      {ref:'check.nonempty',op:'CHECK',action:'DIFF_NONEMPTY',repositoryRef:'primary'},
      {ref:'check.paths',op:'CHECK',action:'EXPECTED_CHANGED_PATHS_EXACT',repositoryRef:'primary'},
      {ref:'proof.erg',op:'RUN',action:'COMMAND',repositoryRef:'primary',command:'node',args:['--test','test/vexlife-prod-e2e-relationship-graph.test.mjs'],proofClass:'TEST',mutationClass:'NONE',candidateEvidence:true,acceptedExitCodes:[0],timeoutMs:600000},
      {ref:'proof.composition',op:'RUN',action:'COMMAND',repositoryRef:'primary',command:'node',args:['--test','test/workgraph-composition-source.test.mjs','test/vexwork-vexarchitecture-e2e.test.mjs'],proofClass:'TEST',mutationClass:'NONE',candidateEvidence:true,acceptedExitCodes:[0],timeoutMs:600000},
      {ref:'proof.registry-current',op:'RUN',action:'COMMAND',repositoryRef:'primary',command:'npm',args:['run','project-registry:check'],proofClass:'TEST',mutationClass:'NONE',candidateEvidence:true,acceptedExitCodes:[0],timeoutMs:600000},
      {ref:'proof.workgraph-current',op:'RUN',action:'COMMAND',repositoryRef:'primary',command:'npm',args:['run','workgraph:check'],proofClass:'TEST',mutationClass:'NONE',candidateEvidence:true,acceptedExitCodes:[0],timeoutMs:600000},
      {ref:'proof.workspace-current',op:'RUN',action:'COMMAND',repositoryRef:'primary',command:'npm',args:['run','workspace:check'],proofClass:'TEST',mutationClass:'NONE',candidateEvidence:true,acceptedExitCodes:[0],timeoutMs:600000},
      {ref:'publish.commit-local',op:'PUBLISH',action:'COMMIT',repositoryRef:'primary',message:'[VexLife-Prod E2E] Regenerate Project discoverability consequences',authorName:'VexGPT',authorEmail:'victor.gong@vextreme24.com'},
      {ref:'check.local-candidate-head',op:'CHECK',action:'EXPECTED_HEAD',repositoryRef:'primary',expected:'$CANDIDATE_HEAD'},
      {ref:'check.local-candidate-tree',op:'CHECK',action:'EXPECTED_TREE',repositoryRef:'primary',expected:'$CANDIDATE_TREE'},
      {ref:'proof.committed-erg',op:'RUN',action:'COMMAND',repositoryRef:'primary',command:'node',args:['--test','test/vexlife-prod-e2e-relationship-graph.test.mjs'],proofClass:'TEST',mutationClass:'NONE',candidateEvidence:true,acceptedExitCodes:[0],timeoutMs:600000},
      {ref:'query.review-local',op:'QUERY',action:'REVIEW_SNAPSHOT',repositoryRef:'primary',base:startingHead,head:'HEAD',maxFiles:10},
      {ref:'respond',op:'RESPOND',action:'CANONICAL_RETURN'}
    ],
    result:{filename:'RETURN-VEXWORK-E2E-GENERATED-LOCAL-PROOF.zip'}
  };

  const innerRoot = path.join(tempRoot,'inner');
  fs.mkdirSync(innerRoot,{recursive:true});
  const manifestPath = path.join(innerRoot,'task.manifest.json');
  writeJson(manifestPath, manifest);
  const innerPackage = await buildTaskPackage({
    manifestPath,
    outputDirectory:tempRoot,
    outputStem:'VEXWORK-E2E-GENERATED-LOCAL-PROOF-INNER'
  });

  const innerManifest = JSON.parse(fs.readFileSync(manifestPath,'utf8'));
  const repoBinding = innerManifest.repositories.find((entry)=>entry.repositoryRef==='primary');
  if (repoBinding.checkoutRef !== startingHead || repoBinding.expectedHead !== startingHead) throw new Error('INNER_STARTING_HEAD_BINDING_INVALID');
  if (innerManifest.operations.some((op)=>op.action==='PUSH'||op.action==='PULL_REQUEST'||op.action==='UPDATE_PULL_REQUEST_BODY')) throw new Error('INNER_PROVIDER_MUTATION_NOT_HELD');
  if (JSON.stringify(innerManifest.source.expectedChangedPaths.map((x)=>x.path).sort()) !== JSON.stringify([...generated].sort())) throw new Error('INNER_GENERATED_PATH_MEMBRANE_INVALID');

  const contentRoot = path.join(tempRoot,'outer-content');
  fs.mkdirSync(contentRoot,{recursive:true});
  const authorityEnvelope = {
    authoritySchemaRef:'vextreme.effect-transaction/v1',
    semanticAdmissionRef:'github.pull.vexwork.320',
    transactionRef:`transaction.vexwork.vexlife-prod-e2e.generated-local-proof.${nowStamp}`,
    transactionVersion:1,
    allowedEffectRefs:['effect.vexrelay.execute','effect.vexwork.generated-consequences.local-proof'],
    heldEffectRefs:['effect.push','effect.pr-metadata','effect.approve','effect.ready','effect.merge']
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
    taskRef:'task.vexwork.vexlife-prod-e2e.generated-local-proof.carrier',
    attemptRef:`attempt.vexwork.vexlife-prod-e2e.generated-local-proof.carrier.${nowStamp}`,
    packageRef:`package.vexwork.vexlife-prod-e2e.generated-local-proof.carrier.${nowStamp}`,
    requestRef:`request.vexwork.vexlife-prod-e2e.generated-local-proof.carrier.${nowStamp}`,
    correlationRef:`correlation.vexwork.vexlife-prod-e2e.generated-local-proof.carrier.${nowStamp}`,
    taskStorageKey:'task-vexwork-vexlife-prod-e2e-generated-local-proof',
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
    singleUseNonce:`nonce-carrier-generated-local-${startingHead.slice(0,12)}-${nowStamp}`,
    stopConditions:['stop.on.identity.drift','stop.on.auth.block','stop.on.path.drift','stop.on.test.failure'],
    archiveDigestBinding:'FILENAME_SHA256'
  };

  outerTaskTemplate.authorityBinding.authorityEnvelopeSha256 = hashFile(authorityPath);
  outerTaskTemplate.payload.payloadSha256 = innerPackage.sha256;
  outerTaskTemplate.payload.immutableInputs[0].sha256 = hashFile(bindingPath);

  const formedOuter = createCanonicalTaskZip({
    taskTemplate:bindAuthoritySummaryFromEnvelope(outerTaskTemplate,authorityEnvelope),
    contentRoot,
    outputDirectory:downloads,
    outputStem:'VEXWORK-E2E-GENERATED-LOCAL-PROOF-A001',
    ttlMs:4*60*60*1000
  });

  console.log('VexRelay: local generated-consequence manifest preflight PASS');
  console.log(`VexRelay: formed canonical local-proof task ${formedOuter.finalZip}`);
  console.log(`VexRelay: task sha256 ${formedOuter.digest}`);

  const bootstrap = renderMacSourceBootstrapCommand({
    packageSha256:formedOuter.digest,
    sdkHead:request.sdk.head,
    sdkTree:request.sdk.tree
  });
  const launched = spawnSync(bash,['-lc',bootstrap],{stdio:'inherit'});
  if (launched.status !== 0) throw new Error(`VEXRELAY_GENERATED_LOCAL_PROOF_BOOTSTRAP_FAILED:${launched.status}`);
  console.log('VexRelay: generated local-proof canonical RETURN formed. Upload the RETURN ZIP Finder/Terminal reveals.');
} finally {
  fs.rmSync(tempRoot,{recursive:true,force:true});
}
