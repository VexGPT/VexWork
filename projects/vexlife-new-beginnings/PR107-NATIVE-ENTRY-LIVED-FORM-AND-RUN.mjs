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

const PRODUCT_REPOSITORY = 'VexGPT/VexLife-Prod';
const PRODUCT_BASE = '3f91379eea2688ffa32d0f8903169cd9fc434233';
const PRODUCT_HEAD = '2d471a0e37589e1b0d9bd4eccb87e01b7938437e';
const PRODUCT_TREE = '640cf1b196400d7b54605d90c90f3a13aa0e173f';
const PRODUCT_BRANCH = 'VXG-111226-vexlife-prod-fresh-canonical-home-a001';

const CHANGED_PATHS = Object.freeze([
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
]);
const SDK_BLOB_GUARDS = Object.freeze({
  "docs/private-continuity/vexrelay/current-contract.json": "b53cbac01c2deeb45fad5c32ce98e0796c04126f",
  "lib/vexrelay/package.mjs": "bf35fb267301d8230b999ae69cc4b21180c53444",
  "lib/vexrelay/manifest.mjs": "684f2b4bfb100ef57f477815fd5256e8e901f391",
  "lib/vexrelay/constants.mjs": "bb720778cee3f3ec3b131de8f2f62ebd11a4f669",
  "lib/vexrelay/result.mjs": "c676471167343539228c7de94436daa279974298",
  "lib/vexrelay/return-consumer.mjs": "baf8e1ac72c44ae8b48f8f1491fa06941dd13331",
  "lib/vexlocalbridge/vexrelay-task-archive.js": "7efb11de42e30234c48cde2ab832ad8fb5b2ed29",
  "lib/vexlocalbridge/package-builder.js": "40dc79c2728b2f0f35b6925bd96db7583071fb34",
  "lib/vexlocalbridge/templates/RUN-VEX-TASK.command": "fa5a9c7bb3de10a30ee856452f7086e4c11eb3ea",
  "docs/private-continuity/vexlocalbridge/profiles/macos-victor-vextreme-sdk.json": "05bb84b74cb0fcf35f330ced1481c9d2fc167b3a"
});

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
      (stderr ? '\\nstderr: ' + stderr : '') +
      (stdout ? '\\nstdout: ' + stdout : '')
    );
  }
  return options.capture === false ? '' : String(result.stdout || '').trim();
}

function requireEqual(actual, expected, label) {
  if (actual !== expected) {
    fail(label + ' mismatch: ' + String(actual) + ' != ' + String(expected));
  }
}

function hashFile(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function shellQuote(value) {
  return "'" + String(value).replaceAll("'", "'\\''") + "'";
}

async function main() {
  console.log(CONTINUITY);

  const downloads = path.join(os.homedir(), 'Downloads');
  await fsp.mkdir(downloads, { recursive: true });

  const proofHome = path.join(downloads, '.vexlife-pr107-selected-home-proof-a004');
  const realDefaultHome = path.join(os.homedir(), '.vexlife');

  if (proofHome === realDefaultHome) {
    fail('proof Home unexpectedly equals real default Home');
  }
  if (fs.existsSync(proofHome)) {
    fail(
      'disposable proof Home already exists; preserve it for diagnosis or remove it intentionally before retry: ' +
      proofHome
    );
  }

  const git = resolveExecutable(['/usr/bin/git'], 'qualified git');
  const gh = resolveExecutable(['/opt/homebrew/bin/gh', '/usr/local/bin/gh'], 'qualified gh');
  const node = resolveExecutable(['/opt/homebrew/bin/node', '/usr/local/bin/node', '/usr/bin/node'], 'qualified node');
  const bash = resolveExecutable(['/bin/bash'], 'qualified bash');

  run(gh, ['auth', 'status', '--hostname', 'github.com'], { capture: false });

  const bootstrapRoot = await fsp.mkdtemp(path.join(downloads, '.vex-pr107-native-lived-a004-sdk-'));
  const sdkRoot = path.join(bootstrapRoot, 'Vextreme-SDK');

  try {
    console.log('PR107 Native Lived A004: grounding exact SDK...');
    run(gh, ['repo', 'clone', SDK_REPOSITORY, sdkRoot, '--', '--no-checkout'], { capture: false });
    run(git, ['-C', sdkRoot, 'checkout', '--detach', SDK_HEAD]);

    requireEqual(run(git, ['-C', sdkRoot, 'rev-parse', 'HEAD']), SDK_HEAD, 'SDK HEAD');
    requireEqual(run(git, ['-C', sdkRoot, 'rev-parse', 'HEAD^{tree}']), SDK_TREE, 'SDK tree');
    requireEqual(run(git, ['-C', sdkRoot, 'status', '--porcelain=v1', '-uall']), '', 'SDK clean source');

    for (const [relative, expected] of Object.entries(SDK_BLOB_GUARDS)) {
      requireEqual(
        run(git, ['-C', sdkRoot, 'rev-parse', 'HEAD:' + relative]),
        expected,
        'SDK blob ' + relative,
      );
    }

    const contract = JSON.parse(
      await fsp.readFile(
        path.join(sdkRoot, 'docs/private-continuity/vexrelay/current-contract.json'),
        'utf8',
      ),
    );
    requireEqual(contract.contractRef, CONTRACT_REF, 'Relay contractRef');

    const helpers = await import(
      pathToFileURL(path.join(sdkRoot, 'tests/vexrelay/helpers.mjs')).href
    );
    const packageModule = await import(
      pathToFileURL(path.join(sdkRoot, 'lib/vexrelay/package.mjs')).href
    );
    const packageBuilder = (
      await import(pathToFileURL(path.join(sdkRoot, 'lib/vexlocalbridge/package-builder.js')).href)
    ).default;
    const nativeVexRelay = (
      await import(pathToFileURL(path.join(sdkRoot, 'lib/vexlocalbridge/vexrelay-task-archive.js')).href)
    ).default;

    const {
      assertConfined,
      bindAuthoritySummaryFromEnvelope,
      createCanonicalTaskZip,
      writeJson,
    } = packageBuilder;
    const {
      buildVexRelayArchiveBinding,
      requireVexRelayArchiveCarrierTaskShape,
    } = nativeVexRelay;

    const proofDir = 'build/pr107-native-entry-lived-a004';
    const appRel = proofDir + '/VexLife Prod Setup.app';
    const infoRel = appRel + '/Contents/Info.plist';
    const imageRel = 'build/vexlife-prod-service-image/images/' + PRODUCT_HEAD;
    const setupWindowRel = imageRel + '/setup/vexlife-prod-setup-window.applescript';

    const prepareScript = `
const fs=require('fs');
const path=require('path');
const repo=process.cwd();
const HEAD=process.argv[1];
const PROOF_HOME=process.argv[2];
const proof=path.join(repo,'build','pr107-native-entry-lived-a004');
const image=path.join(repo,'build','vexlife-prod-service-image','images',HEAD);

if (fs.existsSync(PROOF_HOME)) {
  throw new Error('DISPOSABLE_PROOF_HOME_ALREADY_EXISTS:' + PROOF_HOME);
}

fs.rmSync(proof,{recursive:true,force:true});
fs.mkdirSync(proof,{recursive:true});

const manifestPath=path.join(image,'service-image.json');
if(!fs.existsSync(manifestPath)) throw new Error('PRIVATE_IMAGE_MANIFEST_MISSING');
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
if(manifest.sourceSha!==HEAD) throw new Error('PRIVATE_IMAGE_SOURCE_MISMATCH:' + manifest.sourceSha + ':' + HEAD);

const javaPath=path.join(image,'runtime','bin','java');
const jarPath=path.join(image,'lib','vexlife-prod.jar');
const setupWindow=path.join(image,'setup','vexlife-prod-setup-window.applescript');
for(const p of [javaPath,jarPath,setupWindow]) {
  if(!fs.existsSync(p)) throw new Error('PRIVATE_IMAGE_MEMBER_MISSING:' + p);
}

const safeUserHome=path.join(proof,'safe-user-home');
fs.mkdirSync(safeUserHome,{recursive:true});
const log=path.join(proof,'guard-invocations.tsv');
const count=path.join(proof,'guard-count.txt');
const guard=path.join(proof,'setup-guard.command');
const q=(s)=>"'" + String(s).replaceAll("'","'\\\\''") + "'";

const guardScript=`#!/bin/bash
set -euo pipefail
IMAGE_ROOT=${q(image)}
JAVA=${q(javaPath)}
SAFE_USER_HOME=${q(safeUserHome)}
PROOF_HOME=${q(PROOF_HOME)}
LOG=${q(log)}
COUNT_FILE=${q(count)}
HEAD=${q(HEAD)}

if [ ! -f "$COUNT_FILE" ]; then printf '%s\\n' 0 > "$COUNT_FILE"; fi
N="$(cat "$COUNT_FILE")"
N="$((N + 1))"
printf '%s\\n' "$N" > "$COUNT_FILE"

KIND=""
if [ "$#" -eq 5 ] &&
   [ "$1" = "--inspect-front-door" ] &&
   [ "$2" = "--home" ] &&
   [ "$3" = "$PROOF_HOME" ] &&
   [ "$4" = "--expected-source-sha" ] &&
   [ "$5" = "$HEAD" ]; then
  KIND="INSPECT"
elif [ "$#" -eq 6 ] &&
     [ "$1" = "--activate-front-door-control" ] &&
     [ "$2" = "FORM_HOME" ] &&
     [ "$3" = "--home" ] &&
     [ "$4" = "$PROOF_HOME" ] &&
     [ "$5" = "--expected-source-sha" ] &&
     [ "$6" = "$HEAD" ]; then
  KIND="FORM_HOME"
elif [ "$#" -ge 2 ] && [ "$1" = "--activate-front-door-control" ]; then
  printf 'BLOCKED\\t%s' "$2" >> "$LOG"
  for A in "$@"; do printf '\\t%s' "$A" >> "$LOG"; done
  printf '\\n' >> "$LOG"
  printf '%s\\n' "PR107 lived-proof guard blocked Product-entry control: $2" >&2
  exit 41
else
  printf 'UNEXPECTED' >> "$LOG"
  for A in "$@"; do printf '\\t%s' "$A" >> "$LOG"; done
  printf '\\n' >> "$LOG"
  printf '%s\\n' "PR107 lived-proof guard rejected unexpected setup invocation." >&2
  exit 42
fi

printf '%s' "$KIND" >> "$LOG"
for A in "$@"; do printf '\\t%s' "$A" >> "$LOG"; done
printf '\\n' >> "$LOG"

ERR=${q(path.join(proof,'java-stderr.tmp'))}
set +e
OUT="$("$JAVA" -Duser.home="$SAFE_USER_HOME" -cp "$IMAGE_ROOT/lib/*" vexlife.setup.VexLifeProdSetupProcessKt "$@" 2>"$ERR")"
STATUS=$?
set -e

if [ "$STATUS" -ne 0 ]; then
  cat "$ERR" >&2 || true
  exit "$STATUS"
fi

printf '%s\\n' "$OUT" > ${q(path.join(proof,'invocation-'))}"$N".json
printf '%s\\n' "$OUT"
`;

fs.writeFileSync(guard,guardScript,{mode:0o755});
fs.chmodSync(guard,0o755);
fs.writeFileSync(
  path.join(proof,'proof-config.json'),
  JSON.stringify({
    schemaVersion:'vexlife-prod.pr107.native-entry-lived-selected-home-config/v1',
    head:HEAD,
    image,
    guard,
    safeUserHome,
    proofHome:PROOF_HOME,
    log
  },null,2)+'\\n'
);

console.log(JSON.stringify({
  state:'PASS',
  head:HEAD,
  proofHome:PROOF_HOME,
  image,
  guard
},null,2));
`;

    const bindLauncherScript = `set -euo pipefail
PLIST="$PWD/${infoRel}"
GUARD="$PWD/${proofDir}/setup-guard.command"
[ -f "$PLIST" ] || { echo "INFO_PLIST_MISSING" >&2; exit 31; }
[ -x "$GUARD" ] || { echo "GUARD_MISSING_OR_NOT_EXECUTABLE" >&2; exit 32; }
/usr/bin/plutil -insert VexLifeProdSetupLauncher -string "$GUARD" "$PLIST"
OBSERVED="$(/usr/bin/plutil -extract VexLifeProdSetupLauncher raw -o - "$PLIST")"
[ "$OBSERVED" = "$GUARD" ] || {
  printf "%s\\n" "SETUP_LAUNCHER_PLIST_READBACK_MISMATCH:$OBSERVED:$GUARD" >&2
  exit 33
}
printf "%s\\n" "VEXLIFE_PROD_SETUP_LAUNCHER_BOUND=$OBSERVED"
`;

    const verifyScript = `
const fs=require('fs');
const path=require('path');
const repo=process.cwd();
const HEAD=process.argv[1];
const PROOF_HOME=process.argv[2];
const proof=path.join(repo,'build','pr107-native-entry-lived-a004');
const logPath=path.join(proof,'guard-invocations.tsv');

if(!fs.existsSync(logPath)) throw new Error('GUARD_INVOCATION_LOG_MISSING');

const lines=fs.readFileSync(logPath,'utf8').trim().split(/\\r?\\n/).filter(Boolean);
if(lines.some(x=>x.startsWith('BLOCKED\\t'))) {
  throw new Error('ACQUISITION_OR_OTHER_CONTROL_WAS_ATTEMPTED:' + lines.find(x=>x.startsWith('BLOCKED\\t')));
}
if(lines.some(x=>x.startsWith('UNEXPECTED'))) {
  throw new Error('UNEXPECTED_SETUP_INVOCATION:' + lines.find(x=>x.startsWith('UNEXPECTED')));
}
if(lines.length!==3) {
  throw new Error('EXPECTED_THREE_PRODUCT_INVOCATIONS:' + lines.length + ':' + JSON.stringify(lines));
}

const fields=lines.map(x=>x.split('\\t'));
const expected=[
  ['INSPECT','--inspect-front-door','--home',PROOF_HOME,'--expected-source-sha',HEAD],
  ['FORM_HOME','--activate-front-door-control','FORM_HOME','--home',PROOF_HOME,'--expected-source-sha',HEAD],
  ['INSPECT','--inspect-front-door','--home',PROOF_HOME,'--expected-source-sha',HEAD],
];

for(let i=0;i<expected.length;i++){
  if(JSON.stringify(fields[i])!==JSON.stringify(expected[i])) {
    throw new Error('INVOCATION_SEQUENCE_MISMATCH:'+(i+1)+':' + JSON.stringify(fields[i]));
  }
}

const readInvocation=(n)=>JSON.parse(fs.readFileSync(path.join(proof,'invocation-'+n+'.json'),'utf8'));
const first=readInvocation(1);
const activation=readInvocation(2);
const second=readInvocation(3);

if(first.currentState?.homePath!==PROOF_HOME) {
  throw new Error('FIRST_INSPECTION_HOME_PATH_MISMATCH:' + first.currentState?.homePath);
}
if(first.semanticStateRef!=='HOME_FORMATION_REQUIRED') {
  throw new Error('FIRST_STATE_NOT_HOME_FORMATION_REQUIRED:' + first.semanticStateRef);
}
if(first.displayState?.primaryControlRef!=='FORM_HOME') {
  throw new Error('FIRST_CONTROL_NOT_FORM_HOME:' + first.displayState?.primaryControlRef);
}
if(first.currentState?.homeDisposition!=='ABSENT_CANONICAL_VEXLIFE_HOME') {
  throw new Error('FIRST_HOME_DISPOSITION_INVALID:' + first.currentState?.homeDisposition);
}
if(first.currentState?.homeRef!==null ||
   first.currentState?.deviceRef!==null ||
   first.currentState?.companionLineageRef!==null) {
  throw new Error('FIRST_INSPECTION_INVENTED_HOME_IDENTITY');
}
if(first.effectsPerformed!==false) throw new Error('FIRST_INSPECTION_PERFORMED_EFFECT');

if(activation.manifestationRef!=='REFRESH_ENTRY') {
  throw new Error('ACTIVATION_NOT_REFRESH_ENTRY:' + activation.manifestationRef);
}
if(!['SETUP_REQUIRED','HOLD_UNKNOWN'].includes(activation.semanticStateRef)) {
  throw new Error('ACTIVATION_REOBSERVED_UNEXPECTED_STATE:' + activation.semanticStateRef);
}

if(second.currentState?.homePath!==PROOF_HOME) {
  throw new Error('SECOND_INSPECTION_HOME_PATH_MISMATCH:' + second.currentState?.homePath);
}
if(second.currentState?.homeDisposition!=='EXISTING_CANONICAL_HOME') {
  throw new Error('SECOND_HOME_DISPOSITION_INVALID:' + second.currentState?.homeDisposition);
}
if(second.semanticStateRef!==activation.semanticStateRef) {
  throw new Error('POST_EFFECT_STATE_DRIFT:' + second.semanticStateRef + ':' + activation.semanticStateRef);
}
if(second.effectsPerformed!==false) throw new Error('SECOND_INSPECTION_PERFORMED_EFFECT');

let setupPlan=null;
if(second.semanticStateRef==='SETUP_REQUIRED'){
  if(second.displayState?.primaryControlRef!=='SET_UP') {
    throw new Error('SECOND_CONTROL_NOT_SET_UP:' + second.displayState?.primaryControlRef);
  }
  if(second.displayState?.primaryLabel!=='Set Up VexLife') {
    throw new Error('SECOND_LABEL_INVALID:' + second.displayState?.primaryLabel);
  }
  if(!second.setupPlan) throw new Error('SECOND_SETUP_PLAN_MISSING');
  if(second.setupPlan.acquisitionDisposition!=='MAY_ACQUIRE_MISSING_MODEL_AND_RUNTIME_PREREQUISITES') {
    throw new Error('SETUP_PLAN_ACQUISITION_DISPOSITION_INVALID:' + second.setupPlan.acquisitionDisposition);
  }
  if(!(second.setupPlan.modelArtifactTotalBytes>0) ||
     !(second.setupPlan.modelMinimumMemoryBytes>0)) {
    throw new Error('SETUP_PLAN_RESOURCE_REQUIREMENTS_INVALID');
  }
  if(second.setupPlan.effectsPerformed!==false) {
    throw new Error('SETUP_PLAN_PERFORMED_EFFECT');
  }
  setupPlan={
    modelRef:second.setupPlan.modelRef,
    modelArtifactTotalBytes:second.setupPlan.modelArtifactTotalBytes,
    modelMinimumMemoryBytes:second.setupPlan.modelMinimumMemoryBytes,
    currentTotalMemoryBytes:second.setupPlan.currentTotalMemoryBytes,
    currentFreeStorageBytes:second.setupPlan.currentFreeStorageBytes,
    acquisitionDisposition:second.setupPlan.acquisitionDisposition,
  };
} else {
  if(second.displayState?.primaryControlRef!==null ||
     second.displayState?.primaryLabel!==null) {
    throw new Error('HELD_STATE_EXPOSED_EFFECT_CONTROL');
  }
  if(second.setupPlan!==null) {
    throw new Error('HELD_STATE_EXPOSED_SETUP_PLAN');
  }
}

if(!fs.existsSync(PROOF_HOME)) throw new Error('DISPOSABLE_SELECTED_HOME_MISSING');

const files=[];
function walk(dir){
  for(const ent of fs.readdirSync(dir,{withFileTypes:true})){
    const p=path.join(dir,ent.name);
    if(ent.isDirectory()) walk(p);
    else if(ent.isFile()) files.push(path.relative(PROOF_HOME,p).split(path.sep).join('/'));
    else throw new Error('UNSUPPORTED_HOME_ENTRY:' + p);
  }
}
walk(PROOF_HOME);
files.sort();

const requiredStatic=[
  'config/home.json',
  'config/model.json',
  'recovery/bootstrap-receipt.json',
  'runtime/vexlife-prod/model-binding.json'
];
for(const required of requiredStatic) {
  if(!files.includes(required)) throw new Error('HOME_FILE_MISSING:' + required);
}
const deviceFiles=files.filter(x=>x.startsWith('devices/')&&x.endsWith('.json'));
if(deviceFiles.length!==1) throw new Error('DEVICE_FILE_COUNT:' + deviceFiles.length);
if(files.length!==5) {
  throw new Error('DISPOSABLE_HOME_FILE_COUNT:' + files.length + ':' + JSON.stringify(files));
}

for(const forbidden of ['models/','runtime/heretic/','runtime/product-service/']){
  if(files.some(x=>x.startsWith(forbidden)) || fs.existsSync(path.join(PROOF_HOME,forbidden))){
    throw new Error('FORBIDDEN_ACQUISITION_STATE_PRESENT:' + forbidden);
  }
}

const realDefault=path.join(require('os').homedir(),'.vexlife');
if(path.normalize(PROOF_HOME)===path.normalize(realDefault)) {
  throw new Error('PROOF_HOME_EQUALS_REAL_DEFAULT_HOME');
}

const summary={
  schemaVersion:'vexlife-prod.pr107.native-entry-lived-selected-home/v1',
  state:'PASS',
  head:HEAD,
  selectedHome:PROOF_HOME,
  defaultHomeWasNotUsed:true,
  invocationSequence:fields.map(x=>x[0]),
  firstState:first.semanticStateRef,
  activationManifestation:activation.manifestationRef,
  reobservedState:second.semanticStateRef,
  setupPlan,
  disposableHomeFiles:files,
  acquisitionAttempted:false,
  productServiceStateFormed:false,
};

fs.writeFileSync(path.join(proof,'lived-result.json'),JSON.stringify(summary,null,2)+'\\n');
console.log(JSON.stringify(summary,null,2));
`;

    const effects = [
      'CHECK_AUTH',
      'READ_REPOSITORY',
      'CHECK_STATE',
      'RUN_LOCAL_COMMAND',
      'FORM_RESULT',
    ];

    const task = helpers.baseManifest({
      head: PRODUCT_BASE,
      tree: PRODUCT_TREE,
      role: 'OPERATIONS',
      remainingEffects: effects,
      readCapability: 'AVAILABLE',
      writeCapability: 'UNAVAILABLE',
      candidateState: 'EXACT',
      candidateHead: PRODUCT_HEAD,
      candidateTree: PRODUCT_TREE,
      repositoryMode: 'CLONE_IN_WORKSPACE',
      repositoryRef: 'primary',
      nameWithOwner: PRODUCT_REPOSITORY,
      localPath: 'repo',
      cloneTransport: 'GITHUB_GH',
      githubHostname: 'github.com',
      branch: PRODUCT_BRANCH,
      workspaceMode: 'RUN_ROOT',
      projectPath: 'pr107-native-entry-lived-a004',
      expectedChangedPaths: CHANGED_PATHS,
      activeConflictState: 'NONE',
      onPassState: 'LIFECYCLE_EFFECT_PENDING',
      onPassFunction: 'F14.CONSUME_ONE_TIME_LIFECYCLE_AUTHORITY',
    });

    const now = new Date();

    task.taskRef = 'task.vexlife-prod.pr107.native-entry-lived';
    task.attemptRef = 'attempt.vexlife-prod.pr107.native-entry-lived.a004';
    task.requestRef = 'request.vexlife-prod.pr107.native-entry-lived.a004';
    task.correlationRef = 'correlation.vexlife-prod.pr107.native-entry-lived.a004';
    task.packageRef = 'package.vexlife-prod.pr107.native-entry-lived.a004';

    task.original = {
      originalIntent:
        'Complete the VexLife startup/Product-entry trajectory through a truthful human-selected Home journey.',
      originalGoal:
        'Prove the actual native Product-entry chooser, non-default selected Home formation, post-effect re-observation and no-acquisition boundary.',
      userProtectedIntent:
        'Never target the real ~/.vexlife during proof; preserve human Home choice; block model/runtime acquisition and Product service effects.',
      sourceRefs: [
        'github.pull.vexlife-prod.107',
        'github.pull.vexlife-prod.107.comment.6851582355',
        'github.pull.vexwork.302',
        'projects/vexlife-new-beginnings/SETUP-JOURNEY.md',
      ],
    };

    task.lane = {
      ...task.lane,
      entryClass: 'SAME_LANE_ROLE_TRANSITION',
      scopeMode: 'STAGE_BOUNDED',
      laneRef: 'lane.vexlife.new-beginnings.product-entry',
      parentRootRef: 'project.vexlife.new-beginnings',
      workRef: 'work.vexlife.new-beginnings.setup-journey-map',
      claimRef: 'github.pull.vexlife-prod.107',
      returnRouteRef: 'github.pull.vexlife-prod.107',
      ownerRef: 'Operations',
      rootHubRef: 'github.pull.vexwork.302',
    };

    task.role = {
      ...task.role,
      activeRole: 'OPERATIONS',
      roleRef: 'role.operations.vexlife-prod.pr107.native-entry-lived',
      instanceRef: 'instance.chatgpt.vexlife-prod.pr107.native-entry-lived.20261113.a004',
      occupancyRef: 'occupancy.operations.vexlife-prod.pr107.native-entry-lived.20261113.a004',
      providerBindingRef: 'provider.github.vexlife-prod.pr107',
      threadRef: 'thread.vexlife-prod.pr107.native-entry-lived',
      authorityEnvelopeRef: 'authority-envelope.vexlife-prod.pr107.native-entry-lived.a004',
    };

    task.execution = {
      ...task.execution,
      hostProfile: 'macos-victor',
      executionSurface: 'MAC_ZIP_RUN_COMMAND',
      singleUseNonce: 'nonce-vexlife-prod-pr107-native-entry-lived-a004-20261113',
      duplicateAttemptMarker: 'marker.vexlife-prod.pr107.native-entry-lived.a004',
      duplicateProtectionMode: 'OUTER_RELAY_BOUND',
      formedAt: now.toISOString(),
      expiresAtOrNull: new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString(),
    };

    task.workspace = {
      ...task.workspace,
      mode: 'RUN_ROOT',
      projectRef: 'project.vexlife.new-beginnings',
      projectPath: 'pr107-native-entry-lived-a004',
      createRoot: false,
      createProjectPath: true,
    };

    Object.assign(task.repositories[0], {
      repositoryRef: 'primary',
      mode: 'CLONE_IN_WORKSPACE',
      nameWithOwner: PRODUCT_REPOSITORY,
      localPath: 'repo',
      remote: 'origin',
      baseBranch: 'main',
      acceptedBase: PRODUCT_BASE,
      checkoutRef: PRODUCT_HEAD,
      expectedHead: PRODUCT_HEAD,
      branch: PRODUCT_BRANCH,
      cloneTransport: 'GITHUB_GH',
      githubHostname: 'github.com',
      expectedRemoteUrl: null,
    });

    task.authority = {
      ...task.authority,
      authorityRef: 'authority.vexlife-prod.pr107.native-entry-lived.a004',
      authorityMode: 'EXACT_STAGE_EFFECTS',
      grantedEffects: [...effects],
      conditionalEffects: [],
      consumedEffects: [],
      remainingEffects: [...effects],
      heldEffects: [
        'APPROVE_EXACT_HEAD',
        'MARK_READY',
        'ORDINARY_MERGE',
        'POST_MERGE_VERIFY',
      ],
      repositoryMembranes: [{
        repositoryRef: 'primary',
        allowedPaths: [...CHANGED_PATHS],
      }],
      allowedExecutables: [
        'git',
        'gh',
        'node',
        '/bin/bash',
        '/usr/bin/osacompile',
        '/usr/bin/plutil',
        '/usr/bin/codesign',
        '/usr/bin/open',
      ],
      allowedEnvironment: [],
      remoteObservationOwner: 'Operations',
      allowMutationLoop: false,
      stopConditions: [
        'STOP_ON_UNKNOWN',
        'STOP_ON_AUTH_BLOCK',
        'STOP_ON_TEST_FAILURE',
        'STOP_ON_PATH_ESCAPE',
      ],
    };

    task.source = {
      ...task.source,
      sourceSetRef: 'source.vexlife-prod.pr107.entry-realization',
      sourceVersionRef: 'github.pull.vexlife-prod.107.head.' + PRODUCT_HEAD,
      overlapEvidenceRef: 'github.pull.vexlife-prod.107.comment.6849066558',
      activeConflictState: 'NONE',
      candidateState: 'EXACT',
      candidateHead: PRODUCT_HEAD,
      candidateTree: PRODUCT_TREE,
      expectedChangedPaths: CHANGED_PATHS.map((entry) => ({
        repositoryRef: 'primary',
        path: entry,
      })),
      intentionallyUnchangedAuthorizedPaths: [],
    };

    task.completionPolicy = {
      progressMode: 'EXACT_STAGE_GATE',
      completionTarget: 'EXACT_NAMED_GATE',
      stageGateOrNull: 'LIVED_SELECTED_HOME_NATIVE_ENTRY_PROOF',
      automaticContinuation: true,
      humanRoundTripPolicy: 'IRREDUCIBLE_ONLY',
      stopOnlyOn: [
        'TERMINAL',
        'CAGE',
        'USER_ACTION_REQUIRED',
        'AUTHORITY_UNAVAILABLE',
        'EVIDENCE_REJECTED',
        'EXECUTION_SURFACE_REQUIRED',
        'PROTECTED_DECISION_REQUIRED',
      ],
    };

    task.continuationPlan = {
      stateRef: 'state.vexlife-prod.pr107.clear-on-exact-head',
      currentLifecycleState: 'CLEAR_ON_EXACT_HEAD',
      currentGoal:
        'Prove the actual native human-selected Home journey and post-effect re-observation without acquisition.',
      remainingGoals: [
        'Consume exact lifecycle/currentness authority only after lived selected-Home startup proof passes.',
        'Reconcile the shared ServiceContract with parallel Vision before any merge.',
      ],
      onPass: {
        lifecycleState: 'LIFECYCLE_EFFECT_PENDING',
        nextFunction: 'F14.CONSUME_ONE_TIME_LIFECYCLE_AUTHORITY',
        nextOwner: 'Operations',
        whyThisIsNext:
          'Source proof and semantic Assurance are clear and the lived selected-Home native entry is proved.',
      },
      onFailure: {
        lifecycleState: 'BLOCKED',
        nextFunction: 'F11.CLASSIFY_EDGE_CAGE',
        nextOwner: 'Operations',
        whyThisIsNext:
          'Classify the first lived selected-Home failure without widening model/runtime/service effects.',
      },
      onUserActionRequired: {
        lifecycleState: 'AUTHENTICATION_REQUIRED',
        nextFunction: 'F08.EXECUTE_OR_HANDOFF',
        nextOwner: 'Victor+Operations',
        whyThisIsNext:
          'Only an actual protected host/authentication boundary may require a fresh compatible host attempt.',
      },
    };

    task.policy = {
      maxOuterReturnFiles: 10,
      maxSelectedSourceEntries: 10,
      maxSelectedSourceBytes: 500000,
      maxDiffBytes: 5000000,
      requireRacePreflightBeforeMutation: false,
      requireLocalValidationBeforePublish: false,
      requireInputPackageManifest: true,
      signoffCommit: true,
      draftPullRequest: true,
    };

    task.operations = [
      {
        ref: 'lived.auth',
        op: 'AUTH',
        action: 'GITHUB_GH',
        repositoryRef: 'primary',
        loginMode: 'PROMPT_ONLY',
      },
      {
        ref: 'lived.read-state',
        op: 'READ',
        action: 'REPOSITORY_STATE',
        repositoryRef: 'primary',
      },
      {
        ref: 'lived.expected-head',
        op: 'CHECK',
        action: 'EXPECTED_HEAD',
        repositoryRef: 'primary',
        expected: PRODUCT_HEAD,
      },
      {
        ref: 'lived.expected-tree',
        op: 'CHECK',
        action: 'EXPECTED_TREE',
        repositoryRef: 'primary',
        expected: PRODUCT_TREE,
      },
      {
        ref: 'lived.assemble-image',
        op: 'RUN',
        action: 'COMMAND',
        repositoryRef: 'primary',
        command: '/bin/bash',
        args: ['./gradlew', '--no-daemon', 'assembleVexLifeProdServiceImage'],
        proofClass: 'TEST',
        mutationClass: 'NONE',
        candidateEvidence: true,
        acceptedExitCodes: [0],
        timeoutMs: 1800000,
      },
      {
        ref: 'lived.prepare-guard',
        op: 'RUN',
        action: 'COMMAND',
        repositoryRef: 'primary',
        command: 'node',
        args: ['-e', prepareScript, PRODUCT_HEAD, proofHome],
        proofClass: 'TOOL',
        mutationClass: 'NONE',
        candidateEvidence: false,
        acceptedExitCodes: [0],
        timeoutMs: 120000,
      },
      {
        ref: 'lived.osacompile',
        op: 'RUN',
        action: 'COMMAND',
        repositoryRef: 'primary',
        command: '/usr/bin/osacompile',
        args: ['-o', appRel, setupWindowRel],
        proofClass: 'TEST',
        mutationClass: 'NONE',
        candidateEvidence: true,
        acceptedExitCodes: [0],
        timeoutMs: 600000,
      },
      {
        ref: 'lived.plist-id',
        op: 'RUN',
        action: 'COMMAND',
        repositoryRef: 'primary',
        command: '/usr/bin/plutil',
        args: ['-replace', 'CFBundleIdentifier', '-string', 'com.vexlife.prod.setup', infoRel],
        proofClass: 'TOOL',
        mutationClass: 'NONE',
        candidateEvidence: false,
        acceptedExitCodes: [0],
        timeoutMs: 120000,
      },
      {
        ref: 'lived.plist-singleton',
        op: 'RUN',
        action: 'COMMAND',
        repositoryRef: 'primary',
        command: '/usr/bin/plutil',
        args: ['-insert', 'LSMultipleInstancesProhibited', '-bool', 'YES', infoRel],
        proofClass: 'TOOL',
        mutationClass: 'NONE',
        candidateEvidence: false,
        acceptedExitCodes: [0],
        timeoutMs: 120000,
      },
      {
        ref: 'lived.plist-source',
        op: 'RUN',
        action: 'COMMAND',
        repositoryRef: 'primary',
        command: '/usr/bin/plutil',
        args: ['-insert', 'VexLifeProdExpectedSourceSha', '-string', PRODUCT_HEAD, infoRel],
        proofClass: 'TOOL',
        mutationClass: 'NONE',
        candidateEvidence: false,
        acceptedExitCodes: [0],
        timeoutMs: 120000,
      },
      {
        ref: 'lived.plist-launcher',
        op: 'RUN',
        action: 'COMMAND',
        repositoryRef: 'primary',
        command: '/bin/bash',
        args: ['-c', bindLauncherScript],
        proofClass: 'TOOL',
        mutationClass: 'NONE',
        candidateEvidence: false,
        acceptedExitCodes: [0],
        timeoutMs: 120000,
      },
      {
        ref: 'lived.codesign',
        op: 'RUN',
        action: 'COMMAND',
        repositoryRef: 'primary',
        command: '/usr/bin/codesign',
        args: ['--force', '--sign', '-', appRel],
        proofClass: 'TEST',
        mutationClass: 'NONE',
        candidateEvidence: true,
        acceptedExitCodes: [0],
        timeoutMs: 120000,
      },
      {
        ref: 'lived.codesign-verify',
        op: 'RUN',
        action: 'COMMAND',
        repositoryRef: 'primary',
        command: '/usr/bin/codesign',
        args: ['--verify', '--strict', appRel],
        proofClass: 'TEST',
        mutationClass: 'NONE',
        candidateEvidence: true,
        acceptedExitCodes: [0],
        timeoutMs: 120000,
      },
      {
        ref: 'lived.open-native-window',
        op: 'RUN',
        action: 'COMMAND',
        repositoryRef: 'primary',
        command: '/usr/bin/open',
        args: ['-W', appRel],
        proofClass: 'TEST',
        mutationClass: 'NONE',
        candidateEvidence: true,
        acceptedExitCodes: [0],
        timeoutMs: 600000,
      },
      {
        ref: 'lived.verify-native-circuit',
        op: 'RUN',
        action: 'COMMAND',
        repositoryRef: 'primary',
        command: 'node',
        args: ['-e', verifyScript, PRODUCT_HEAD, proofHome],
        proofClass: 'TEST',
        mutationClass: 'NONE',
        candidateEvidence: true,
        acceptedExitCodes: [0],
        timeoutMs: 120000,
      },
      {
        ref: 'lived.respond',
        op: 'RESPOND',
        action: 'CANONICAL_RETURN',
      },
    ];

    task.result = {
      filename: 'RETURN-VEXLIFE-PROD-PR107-NATIVE-ENTRY-LIVED-A004.zip',
    };

    const validated = packageModule.validateTaskObject(task).manifest;

    requireEqual(validated.source.candidateHead, PRODUCT_HEAD, 'validated candidate head');
    requireEqual(validated.source.candidateTree, PRODUCT_TREE, 'validated candidate tree');
    requireEqual(
      validated.completionPolicy.stageGateOrNull,
      'LIVED_SELECTED_HOME_NATIVE_ENTRY_PROOF',
      'validated lived gate',
    );

    const authorityEnvelope = {
      authoritySchemaRef: 'vextreme.effect-transaction/v1',
      semanticAdmissionRef: 'github.pull.vexlife-prod.107',
      transactionRef: 'transaction.vexlife-prod.pr107.native-entry-lived.a004',
      transactionVersion: 1,
      allowedEffectRefs: ['effect.vexrelay.execute'],
      heldEffectRefs: [
        'effect.vexlife-prod.model-runtime',
        'effect.vexlife-prod.service',
        'effect.vexlife-prod.merge',
        'effect.vexlife-prod.release',
      ],
    };

    const outerTaskTemplate = {
      schemaVersion: 'vextreme.vexlocalbridge-task-manifest/v1',
      artifactClass: 'EXECUTABLE_RELAY',
      taskRef: 'task.vexlife-prod.pr107.native-entry-lived.carrier',
      attemptRef: 'attempt.vexlife-prod.pr107.native-entry-lived.carrier.a004',
      packageRef: 'package.vexlife-prod.pr107.native-entry-lived.carrier.a004',
      requestRef: 'request.vexlife-prod.pr107.native-entry-lived.carrier.a004',
      correlationRef: 'correlation.vexlife-prod.pr107.native-entry-lived.carrier.a004',
      taskStorageKey: 'vexlife-pr107-native-entry-lived',
      attemptStorageKey: 'a004',
      requestingRoleRef: 'Operations[LocalVex]',
      requestingInstanceRef: 'instance.chatgpt.vexlife-prod.pr107.native-entry-lived.20261113.a004',
      parentOperationsRef: 'github.pull.vexlife-prod.107',
      returnRouteRef: 'github.pull.vexlife-prod.107',
      hostProfileRef: 'macos-victor',
      repositoryExecutionProfileRefOrNull: 'profile.repository.vextreme-sdk.macos-v1',
      repositoryRefOrNull: PRODUCT_REPOSITORY,
      baseRefOrNull: PRODUCT_BASE,
      headRefOrNull: PRODUCT_HEAD,
      treeRefOrNull: PRODUCT_TREE,
      branchRefOrNull: PRODUCT_BRANCH,
      claimRefOrNull: 'github.pull.vexlife-prod.107',
      exactPathRefs: [...CHANGED_PATHS],
      authorityBinding: {
        authoritySchemaRef: 'vextreme.effect-transaction/v1',
        authorityEnvelopePath: 'authority/effect.json',
        authorityEnvelopeSha256: '0'.repeat(64),
        semanticAdmissionRef: 'stale',
        transactionRef: 'stale',
        transactionVersion: 1,
        allowedEffectRefs: ['stale'],
        heldEffectRefs: [],
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
      singleUseNonce: 'nonce-vexlife-prod-pr107-native-entry-lived-carrier-a004-20261113',
      stopConditions: ['stop.on.identity.drift'],
      archiveDigestBinding: 'FILENAME_SHA256',
    };

    const work = await fsp.mkdtemp(path.join(os.tmpdir(), 'pr107-native-entry-lived-a004-carrier-'));

    try {
      const innerRoot = path.join(work, 'inner');
      await fsp.mkdir(innerRoot, { recursive: true });
      const manifestPath = path.join(innerRoot, 'task.manifest.json');
      packageBuilder.writeJson(manifestPath, validated);

      const innerPackage = await packageModule.buildTaskPackage({
        manifestPath,
        outputDirectory: work,
        outputStem: 'VEXLIFE-PROD-PR107-NATIVE-ENTRY-LIVED-A004-INNER',
      });

      const contentRoot = path.join(work, 'outer-content');
      await fsp.mkdir(contentRoot, { recursive: true });

      const carrierShape = requireVexRelayArchiveCarrierTaskShape(outerTaskTemplate);
      const authorityPath = assertConfined(
        contentRoot,
        path.resolve(contentRoot, outerTaskTemplate.authorityBinding.authorityEnvelopePath),
        { mustExist: false },
      );
      const payloadPath = assertConfined(
        contentRoot,
        path.resolve(contentRoot, carrierShape.payloadPath),
        { mustExist: false },
      );
      const bindingPath = assertConfined(
        contentRoot,
        path.resolve(contentRoot, carrierShape.bindingPath),
        { mustExist: false },
      );

      packageBuilder.writeJson(authorityPath, authorityEnvelope);
      await fsp.mkdir(path.dirname(payloadPath), { recursive: true });
      await fsp.copyFile(innerPackage.outputPath, payloadPath);
      packageBuilder.writeJson(
        bindingPath,
        buildVexRelayArchiveBinding({
          innerManifest: validated,
          innerArchiveSha256: innerPackage.sha256,
        }),
      );

      const outer = structuredClone(outerTaskTemplate);
      outer.authorityBinding.authorityEnvelopeSha256 = packageBuilder.hashFile(authorityPath);
      outer.payload.payloadSha256 = innerPackage.sha256;
      outer.payload.immutableInputs[0].sha256 = packageBuilder.hashFile(bindingPath);

      const formedOuter = createCanonicalTaskZip({
        taskTemplate: bindAuthoritySummaryFromEnvelope(outer, authorityEnvelope),
        contentRoot,
        outputDirectory: downloads,
        outputStem: 'VEXLIFE-PROD-PR107-NATIVE-ENTRY-LIVED-A004',
        ttlMs: 8 * 60 * 60 * 1000,
      });

      requireEqual(
        formedOuter.formationEvidence.finalByteQualification,
        'PASS',
        'outer final-byte qualification',
      );
      requireEqual(hashFile(formedOuter.finalZip), formedOuter.digest, 'outer digest');

      console.log('');
      console.log('PR107 Native Lived A004 is ready.');
      console.log('');
      console.log('WHEN THE "Choose your Vex Home" WINDOW APPEARS:');
      console.log('1. Replace the prefilled ~/.vexlife path with EXACTLY:');
      console.log('');
      console.log('   ' + proofHome);
      console.log('');
      console.log('2. Click Continue.');
      console.log('3. Click "Create Vex Home".');
      console.log('4. If "Set Up VexLife" appears, click Cancel.');
      console.log('   If a held-state message appears instead, click Close/OK.');
      console.log('');
      console.log('Safety: the proof guard refuses any Home path other than the one printed above,');
      console.log('so your real ~/.vexlife cannot be touched by this proof.');
      console.log('');

      const runner = path.join(sdkRoot, 'lib/vexlocalbridge/templates/RUN-VEX-TASK.command');
      const before = hashFile(formedOuter.finalZip);

      const result = spawnSync(bash, [runner, formedOuter.finalZip], {
        stdio: 'inherit',
        shell: false,
        env: process.env,
      });

      const after = hashFile(formedOuter.finalZip);
      requireEqual(after, before, 'outer task bytes after execution');

      if (result.error) throw result.error;

      console.log('PR107 Native Lived A004: VexLocalBridge exit=' + String(result.status));
      console.log('Upload the canonical RETURN ZIP revealed by VexLocalBridge.');

      process.exitCode = result.status ?? 1;
    } finally {
      await fsp.rm(work, { recursive: true, force: true });
    }
  } finally {
    await fsp.rm(bootstrapRoot, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error('\nPR107 Native Lived A004 failed:\n' + (error?.stack || error));
  process.exitCode = 1;
});
