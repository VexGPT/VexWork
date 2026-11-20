#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const harnessRoot = path.resolve(here, '..');
const catalog = JSON.parse(fs.readFileSync(path.join(here, 'STAGE-CATALOG.json'), 'utf8'));

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    if (!key?.startsWith('--')) throw new Error('arguments must be --key value');
    const name = key.slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith('--')) { out[name] = next; i += 1; }
    else out[name] = true;
  }
  return out;
}
function required(args, key) {
  if (!args[key]) throw new Error('--' + key + ' is required');
  return args[key];
}
function exactHash(value, label) {
  if (!/^[0-9a-f]{40,64}$/.test(value ?? '')) throw new Error(label + ' must be exact git hash');
}
function sha256File(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}
function nonempty(value, label) {
  if (typeof value !== 'string' || !value.trim() || value.trim().toUpperCase() === 'UNKNOWN') {
    throw new Error(label + ' must be exact and nonempty');
  }
}

const args = parseArgs(process.argv.slice(2));
const sdkRoot = path.resolve(required(args, 'sdk-root'));
const bindingPath = path.resolve(required(args, 'binding'));
const stageRef = required(args, 'stage');
const outputDir = path.resolve(required(args, 'output-dir'));
const binding = JSON.parse(fs.readFileSync(bindingPath, 'utf8'));
const stage = catalog.stages[stageRef];
if (!stage) throw new Error('unknown stage: ' + stageRef);
if (stage.route !== 'adapter.vexrelay.repository/v2') {
  throw new Error('stage is not a repository VexRelay stage: ' + stageRef);
}

const contractPath = path.join(sdkRoot, 'docs/private-continuity/vexrelay/current-contract.json');
const contract = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
if (contract.contractRef !== 'source.vexrelay.current-contract/v1') throw new Error('current Relay contractRef mismatch');
if (contract.taskSchema !== 'vex.relay.task/v2') throw new Error('current Relay task schema mismatch');
const route = contract.acceptedAdapters.find((value) => value.adapterRef === 'adapter.vexrelay.repository/v2');
if (!route || route.state !== 'CURRENT') throw new Error('repository VexRelay adapter is not CURRENT');

const packageModule = await import(pathToFileURL(path.join(sdkRoot, 'lib/vexrelay/package.mjs')).href);
const { validateTaskObject, buildTaskPackage } = packageModule;

if (binding.schemaVersion !== 'vexwork.continuity-pressure-relay-binding/v1') {
  throw new Error('binding schema mismatch');
}
for (const [label, value] of [
  ['bindingRef', binding.bindingRef], ['experimentRef', binding.experimentRef],
  ['laneRef', binding.lane?.laneRef], ['workRef', binding.lane?.workRef],
  ['authorityRef', binding.authority?.authorityRef], ['repository.nameWithOwner', binding.repository?.nameWithOwner],
  ['adapter.command', binding.adapter?.command], ['adapter.scenarioPath', binding.adapter?.scenarioPath],
]) nonempty(value, label);

exactHash(binding.repository.acceptedBase, 'repository.acceptedBase');
exactHash(binding.repository.expectedHead, 'repository.expectedHead');
if (binding.repository.expectedTree) exactHash(binding.repository.expectedTree, 'repository.expectedTree');

const canonicalScenario = path.join(harnessRoot, 'scenarios', 'depth-continuity-v1.json');
const observedScenarioSha = sha256File(canonicalScenario);
if (binding.scenario.scenarioRef !== 'scenario.vexlife.continuity-pressure.depth-continuity.v1') {
  throw new Error('binding scenarioRef is not the canonical scenario');
}
if (binding.scenario.sharedSha256 !== observedScenarioSha) {
  throw new Error('binding scenario digest does not match shared canonical scenario');
}

const now = new Date();
const ttlMs = binding.execution.ttlMs;
if (!Number.isInteger(ttlMs) || ttlMs <= 0 || ttlMs > 86400000) throw new Error('execution.ttlMs invalid');
const expires = new Date(now.getTime() + ttlMs);
const suffix = crypto.randomUUID().toLowerCase();

const effects = new Set(['READ_REPOSITORY','CHECK_STATE','RUN_LOCAL_COMMAND','FORM_RESULT']);
const operations = [];
if (binding.repository.mode === 'CLONE_IN_WORKSPACE' && binding.repository.cloneTransport === 'GITHUB_GH') {
  effects.add('CHECK_AUTH');
  operations.push({ ref: 'auth.github', op: 'AUTH', action: 'GITHUB_GH', repositoryRef: binding.repository.repositoryRef, loginMode: 'PROMPT_ONLY' });
}
operations.push(
  { ref: 'read.before', op: 'READ', action: 'REPOSITORY_STATE', repositoryRef: binding.repository.repositoryRef },
  { ref: 'check.head', op: 'CHECK', action: 'EXPECTED_HEAD', repositoryRef: binding.repository.repositoryRef, expected: binding.repository.expectedHead },
);
if (binding.repository.expectedTree) {
  operations.push({ ref: 'check.tree', op: 'CHECK', action: 'EXPECTED_TREE', repositoryRef: binding.repository.repositoryRef, expected: binding.repository.expectedTree });
}
const stageArgs = [
  ...(binding.adapter.argsPrefix ?? []),
  '--stage', stage.productAdapterStage,
  '--scenario-ref', binding.scenario.scenarioRef,
  '--scenario-file', binding.adapter.scenarioPath,
  '--result-dir', binding.adapter.resultDir,
];
operations.push({
  ref: 'run.harness',
  op: 'RUN',
  action: 'COMMAND',
  repositoryRef: binding.repository.repositoryRef,
  command: binding.adapter.command,
  args: stageArgs,
  proofClass: 'TEST',
  mutationClass: 'NONE',
  candidateEvidence: true,
  acceptedExitCodes: [0],
  timeoutMs: Number(args['timeout-ms'] ?? 1800000),
});
operations.push({ ref: 'respond', op: 'RESPOND', action: 'CANONICAL_RETURN' });

const repository = {
  repositoryRef: binding.repository.repositoryRef,
  mode: binding.repository.mode,
  nameWithOwner: binding.repository.nameWithOwner,
  localPath: binding.repository.localPath,
  remote: binding.repository.remote,
  baseBranch: binding.repository.baseBranch,
  acceptedBase: binding.repository.acceptedBase,
  expectedHead: binding.repository.expectedHead,
  branch: binding.repository.branch,
};
for (const key of ['cloneTransport','githubHostname','expectedRemoteUrl','checkoutRef']) {
  if (binding.repository[key] !== undefined) repository[key] = binding.repository[key];
}
if (repository.mode === 'CLONE_IN_WORKSPACE' && repository.checkoutRef === undefined) {
  repository.checkoutRef = binding.repository.expectedHead;
}

const granted = [...new Set(binding.authority.grantedEffects)];
for (const effect of effects) {
  if (!granted.includes(effect)) throw new Error('binding authority does not grant required effect: ' + effect);
}

const candidateState = binding.source.candidateState;
const candidateHead = candidateState === 'EXACT' ? (binding.source.candidateHead ?? binding.repository.expectedHead) : null;
const candidateTree = candidateState === 'EXACT' ? (binding.source.candidateTree ?? binding.repository.expectedTree) : null;
if (candidateState === 'EXACT') {
  exactHash(candidateHead, 'source.candidateHead');
  exactHash(candidateTree, 'source.candidateTree');
}

const stageGate = 'CONTINUITY_PRESSURE_' + stageRef.toUpperCase().replaceAll('-', '_') + '_COMPLETE';
const manifest = {
  schemaVersion: 'vex.relay.task/v2',
  continuity: '[VXG RealForever]',
  taskRef: 'task.continuity-pressure.' + stageRef + '.' + suffix,
  attemptRef: 'attempt.continuity-pressure.' + suffix,
  requestRef: 'request.continuity-pressure.' + suffix,
  correlationRef: 'correlation.' + binding.experimentRef + '.' + stageRef,
  packageRef: 'package.continuity-pressure.' + suffix,
  original: {
    originalIntent: 'Run the shared VexLife-Prod Conversational Boundaries Test without rebuilding the scenario.',
    originalGoal: 'Execute the exact ' + stageRef + ' stage and return source-bound bounded experiment evidence.',
    userProtectedIntent: 'Do not mutate Victor canonical Vex Home or require Victor to interpret technical logs.',
    sourceRefs: [
      'project.vexlife.memory-depth-exploration',
      'harness.vexlife-prod.conversational-boundaries/v1',
      binding.scenario.scenarioRef,
      binding.bindingRef,
    ],
  },
  lane: {
    entryClass: binding.lane.entryClass,
    scopeMode: 'STAGE_BOUNDED',
    laneRef: binding.lane.laneRef,
    parentRootRef: binding.lane.parentRootRef,
    workRef: binding.lane.workRef,
    claimRef: binding.lane.claimRef,
    returnRouteRef: binding.lane.returnRouteRef,
    ownerRef: binding.lane.ownerRef,
    rootHubRef: binding.lane.rootHubRef,
  },
  role: binding.role,
  capabilities: binding.capabilities,
  execution: {
    hostProfile: binding.execution.hostProfile,
    executionSurface: binding.execution.executionSurface,
    singleUseNonce: 'nonce-' + suffix.replaceAll('-', ''),
    duplicateAttemptMarker: 'marker.continuity-pressure.' + suffix,
    duplicateProtectionMode: 'OUTER_RELAY_BOUND',
    formedAt: now.toISOString(),
    expiresAtOrNull: expires.toISOString(),
  },
  workspace: binding.workspace,
  repositories: [repository],
  authority: {
    authorityRef: binding.authority.authorityRef,
    authorityMode: 'EXACT_STAGE_EFFECTS',
    grantedEffects: granted,
    conditionalEffects: [],
    consumedEffects: [],
    remainingEffects: [...effects],
    heldEffects: binding.authority.heldEffects,
    repositoryMembranes: [{ repositoryRef: binding.repository.repositoryRef, allowedPaths: binding.repository.allowedPaths }],
    allowedExecutables: binding.authority.allowedExecutables,
    allowedEnvironment: binding.authority.allowedEnvironment,
    remoteObservationOwner: 'Operations',
    allowMutationLoop: false,
    stopConditions: ['STOP_ON_UNKNOWN','STOP_ON_AUTH_BLOCK','STOP_ON_TEST_FAILURE','STOP_ON_PATH_ESCAPE'],
  },
  source: {
    sourceSetRef: binding.source.sourceSetRef,
    sourceVersionRef: binding.source.sourceVersionRef,
    overlapEvidenceRef: binding.source.overlapEvidenceRef,
    activeConflictState: binding.source.activeConflictState,
    candidateState,
    candidateHead,
    candidateTree,
    expectedChangedPaths: [],
    intentionallyUnchangedAuthorizedPaths: [],
  },
  completionPolicy: {
    progressMode: 'EXACT_STAGE_GATE',
    completionTarget: 'EXACT_NAMED_GATE',
    stageGateOrNull: stageGate,
    automaticContinuation: true,
    humanRoundTripPolicy: 'IRREDUCIBLE_ONLY',
    stopOnlyOn: ['TERMINAL','CAGE','USER_ACTION_REQUIRED','AUTHORITY_UNAVAILABLE','EVIDENCE_REJECTED','EXECUTION_SURFACE_REQUIRED','PROTECTED_DECISION_REQUIRED','STAGE_GATE_REACHED'],
  },
  continuationPlan: {
    stateRef: 'state.continuity-pressure.' + stageRef + '.before',
    currentLifecycleState: 'GROUNDED',
    currentGoal: 'Run the shared continuity-pressure stage.',
    remainingGoals: ['Consume the canonical return and compare the experiment result.'],
    onPass: { lifecycleState: 'GROUNDED', nextFunction: 'F09.CONSUME_RETURN', nextOwner: 'Operations', whyThisIsNext: 'The stage evidence exists and must be consumed before any later stage is interpreted.' },
    onFailure: { lifecycleState: 'BLOCKED', nextFunction: 'F11.CLASSIFY_EDGE_CAGE', nextOwner: 'Operations', whyThisIsNext: 'Classify the first substantive harness/product/environment failure without replay.' },
    onUserActionRequired: { lifecycleState: 'AUTHENTICATION_REQUIRED', nextFunction: 'F08.EXECUTE_OR_HANDOFF', nextOwner: 'Victor+Operations', whyThisIsNext: 'The current accepted host action is required before this exact stage can run.' },
  },
  policy: {
    maxOuterReturnFiles: 10,
    maxSelectedSourceEntries: 10,
    maxSelectedSourceBytes: 500000,
    maxDiffBytes: 5000000,
    requireRacePreflightBeforeMutation: false,
    requireLocalValidationBeforePublish: false,
    requireInputPackageManifest: true,
    signoffCommit: true,
    draftPullRequest: true,
  },
  operations,
  result: { filename: 'RETURN-CONTINUITY-PRESSURE-' + stageRef + '.zip' },
};

validateTaskObject(manifest);
fs.mkdirSync(outputDir, { recursive: true });
const manifestPath = path.join(outputDir, 'task.' + stageRef + '.manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
const formed = await buildTaskPackage({
  manifestPath,
  outputDirectory: outputDir,
  outputStem: 'VexRelay-ContinuityPressure-' + stageRef,
});
const formation = {
  schemaVersion: 'vexwork.continuity-pressure-relay-formation/v1',
  stageRef,
  experimentRef: binding.experimentRef,
  currentContractRef: contract.contractRef,
  taskSchema: contract.taskSchema,
  adapterRef: route.adapterRef,
  scenarioRef: binding.scenario.scenarioRef,
  scenarioSha256: observedScenarioSha,
  manifestPath,
  packagePath: formed.outputPath,
  packageSha256: formed.sha256,
  taskRef: formed.taskRef,
  attemptRef: formed.attemptRef,
};
const formationPath = path.join(outputDir, 'formation.' + stageRef + '.json');
fs.writeFileSync(formationPath, JSON.stringify(formation, null, 2) + '\n');
process.stdout.write(JSON.stringify(formation, null, 2) + '\n');
