import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn, spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const TASK_REF = 'task.vexlife.connected-services.vcs04.installed-read-lived';
const ATTEMPT_REF = 'attempt.vexlife.connected-services.vcs04.installed-read-lived.a012';
const CORRELATION_REF = 'correlation.vexlife.connected-services.vcs04.installed-read-lived.a012';
const CONTINUITY = '[VXG RealForever]';
const SDK_REPO = 'vgong24/Vextreme-SDK';
const VEX_REPO = 'vgong24/VexLife';
const ANDROID_REPO = 'vgong24/VexLife-Android';
const SDK_HEAD = 'b4d427564409989e8f839066accd17ec4c790724';
const SDK_TREE = '0e7b40415cbf60ea4b998a2a2423e8c5587857c6';
const VEX_HEAD = '0fbaeb7c918ebdfc7af5389220d5bf081a906702';
const VEX_TREE = '3ab3affa774a2b97c0b27be2efb5a9506cdab0f9';
const ANDROID_HEAD = '30ecfe22156f6bb4b565eda990c72feff48a3866';
const ANDROID_TREE = '853c67b981948c7a5d4c661e5fdab2f1e14365d2';
const ANDROID_PACKAGE = 'com.vextreme.vexlife.android';
const ANDROID_TEST_RUNNER = 'com.vextreme.vexlife.android.test/androidx.test.runner.AndroidJUnitRunner';
const HOST_BRIDGE_CLASS = 'com.vextreme.vexlife.android.connectedservices.VexPrivateHomeGatewayHostBridgeTest';
const TAILSCALE_ANDROID_PACKAGE = 'com.tailscale.ipn';
const PRINCIPAL_REF = 'principal.victor';
const OTHER_PRINCIPAL_REF = 'principal.bri';
const HOME_REF = 'home.vcs04.lived';
const SPACE_REF = 'space.vcs04.lived';
const THREAD_REF = 'thread.vcs04.lived';
const CHANNEL_REF = 'channel.vcs04.lived.g2';
const COMPANION_REF = 'lineage.vex.family.vcs04.lived';
const CAPABILITY_REF = 'capability.vexlife.family-conversation';
const SEED_CONTENT = 'VCS-04 lived private route read reached canonical Family history.';

const EXPECTED_BLOBS = Object.freeze({
  sdk: Object.freeze({
    'lib/local-runtime/private-home-gateway-server.js': 'c2d8690ccb8f1b7362741dccdaa861248b87c642',
    'lib/security/home-bridge-device-possession-trust-port.js': 'ab26b63c726ac8f8d3a506c822adbfa4961df1d8',
    'lib/local-runtime/home-session-authority.js': '8603375838762d8a8eaff8e4ba0587b9dd69c96b',
    'lib/local-runtime/private-home-gateway-composition.js': '5848630abea89064df35646355ebf7881e2f7407',
  }),
  vex: Object.freeze({
    'src/core/home-bridge.mjs': 'ac22fe19347513fcea224cc083c1b5aaceda135e',
    'src/core/home-bridge-remote-authenticated-session.mjs': '0e19b10e894cd42d9766ab0556228f184bc26d0b',
    'src/core/home-bridge-session-authority.mjs': 'c85c69ec81317e31fbcef563a201043a7d5a63a9',
    'src/core/vex-core-family-session-authority.mjs': '3940f7c601eb38e27422bfc8477bc02eb4368723',
    'src/core/server-family-conversation-capability.mjs': '5acc40b0c5385a0941aa04052432599fd35fcd7c',
    'src/core/browser-family-conversation-bridge.mjs': 'c2d94e594af77f01150fd9b10f14b3d6f2c70b15',
    'src/core/family-space-store.mjs': '55531ae8724cad0e9721c91b113a07d34fc5e33f',
    'src/core/family-conversation.mjs': 'b619c57a29fc4672ad3e1237695ce529bc52118a',
    'src/core/conversation-store.mjs': 'b41629514a66b594c0f59240d741e88a6434c9a7',
  }),
  android: Object.freeze({
    'app/src/androidTest/kotlin/com/vextreme/vexlife/android/connectedservices/VexPrivateHomeGatewayHostBridgeTest.kt': 'e54098ebd2ed76e600acdb7c03b1f8ad62d4d4ad',
    'app/src/main/kotlin/com/vextreme/vexlife/android/connectedservices/VexPrivateHomeGatewayRouteStore.kt': 'fed97a3499fd80101284d621dabade5c5f1b0c62',
    'app/src/main/kotlin/com/vextreme/vexlife/android/screens/shared/conversation/VexFamilyConversationScreen.kt': '8178fd513cb135cd0f85bfdcc684a4f399ed352d',
    'app/src/main/kotlin/com/vextreme/vexlife/android/data/AppRepositories.kt': '66d7682b7dd9b7d9f1e8b56c325cc0c531db1694',
  }),
});

const packageRoot = path.resolve(process.argv[2] ?? '.');
const inputSha = process.env.VEX_INPUT_SHA256 ?? 'UNBOUND';
const home = os.homedir();
const canonicalParent = path.join(home, 'projects', 'vexlocalbridge', 'return', TASK_REF);
const resultRoot = path.join(canonicalParent, ATTEMPT_REF);
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'vcs04-installed-read-lived-a012-'));
const workRoot = path.join(tempRoot, 'work');
const commandLog = [];
const gatewayEvents = [];
const familyOperations = [];
const authorityOperations = [];
let composition = null;
let tailscaleChild = null;
let tailscalePort = null;
let tailscaleBin = null;
let tailscaleWasRunning = null;
let tailscaleConnectionBroughtUp = false;
let adb = null;
let serial = null;
let disposition = 'SAFE_FAILURE';
let exitCode = 1;
let firstFailure = null;
let startedAt = new Date().toISOString();
let completedAt = null;
let liveEvidence = {};
let cleanupEvidence = {};
let effectLedger = { homeMembershipPerformed:false, androidRoutePersisted:false, networkServePerformed:false };
let networkServeAttempted = false;
let serveEnablementPrompted = false;
let serveEnableUrl = null;
let predecessorServeRecoveryPerformed = false;
let predecessorServeRecoveryState = 'NOT_NEEDED';

let currentPhase = 'ATTEMPT_INIT';
let phaseStartedAtMs = Date.now();
let heartbeatTimer = null;
let healthState = {
  adb: 'UNKNOWN',
  macTailnet: 'UNKNOWN',
  androidTailscale: 'UNKNOWN',
  networkProof: 'NOT_STARTED',
  productEffectsStarted: false,
};

function effectSummary() {
  return [
    `route=${effectLedger.androidRoutePersisted ? 'yes' : 'no'}`,
    `membership=${effectLedger.homeMembershipPerformed ? 'yes' : 'no'}`,
    `serve=${effectLedger.networkServePerformed ? 'yes' : 'no'}`,
  ].join(',');
}
function progressLine(kind, details = {}) {
  const elapsed = Math.max(0, Math.floor((Date.now() - phaseStartedAtMs) / 1000));
  const fields = [
    'VCS04_PROGRESS',
    `kind=${kind}`,
    `phase=${currentPhase}`,
    `phaseElapsedSec=${elapsed}`,
    `adb=${healthState.adb}`,
    `macTailnet=${healthState.macTailnet}`,
    `androidTailscale=${healthState.androidTailscale}`,
    `networkProof=${healthState.networkProof}`,
    `productEffectsStarted=${healthState.productEffectsStarted ? 'true' : 'false'}`,
    `effects=${effectSummary()}`,
  ];
  for (const [key, value] of Object.entries(details)) {
    if (value === undefined || value === null || value === '') continue;
    fields.push(`${key}=${safeString(value).replace(/\s+/gu, '_').slice(0, 240)}`);
  }
  return fields.join(' ');
}
function emitProgress(kind = 'HEARTBEAT', details = {}) {
  const line = progressLine(kind, details);
  console.error(line);
  try {
    if (fs.existsSync(resultRoot)) {
      fs.appendFileSync(path.join(resultRoot, 'LIVE-PROGRESS.log'), `${new Date().toISOString()} ${line}\n`);
      writeJson(path.join(resultRoot, 'CURRENT-PHASE.json'), {
        schemaVersion: 'vexlocalbridge.vcs04-progress/v1',
        attemptRef: ATTEMPT_REF,
        observedAt: new Date().toISOString(),
        phase: currentPhase,
        phaseElapsedSec: Math.max(0, Math.floor((Date.now() - phaseStartedAtMs) / 1000)),
        health: { ...healthState },
        effects: { ...effectLedger },
      });
    }
  } catch {}
}
function setPhase(phase, details = {}) {
  currentPhase = phase;
  phaseStartedAtMs = Date.now();
  emitProgress('PHASE', details);
}
function updateHealth(patch, { emit = false } = {}) {
  Object.assign(healthState, patch);
  if (emit) emitProgress('STATE');
}
function startHeartbeat() {
  if (heartbeatTimer) return;
  heartbeatTimer = setInterval(() => emitProgress('HEARTBEAT'), 15_000);
  heartbeatTimer.unref?.();
}
function stopHeartbeat() {
  if (!heartbeatTimer) return;
  clearInterval(heartbeatTimer);
  heartbeatTimer = null;
}

function mkdirp(p) { fs.mkdirSync(p, { recursive: true }); }
function sha256File(p) { const h = crypto.createHash('sha256'); h.update(fs.readFileSync(p)); return h.digest('hex'); }
function sha256Bytes(b) { return crypto.createHash('sha256').update(b).digest('hex'); }
function safeString(v) { return String(v ?? ''); }
function writeJson(p, v) { fs.writeFileSync(p, JSON.stringify(v, null, 2) + '\n'); }
function tail(text, max = 12000) { const s = safeString(text); return s.length <= max ? s : s.slice(-max); }
function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }
function redactArg(arg) {
  const s = safeString(arg);
  if (/session\.vexlife\.home-bridge\.remote\./u.test(s)) return '<redacted-session-ref>';
  return s;
}
function resolveExecutable(candidates, probeArgs = null) {
  for (const c of candidates) {
    if (!c || !fs.existsSync(c)) continue;
    if (probeArgs) {
      const p = spawnSync(c, probeArgs, { stdio: 'ignore', timeout: 5000 });
      if ((p.status ?? 1) !== 0) continue;
    }
    return c;
  }
  return null;
}
function run(cmd, args = [], opts = {}) {
  const started = Date.now();
  const r = spawnSync(cmd, args, {
    cwd: opts.cwd,
    env: opts.env ?? process.env,
    encoding: opts.encoding === null ? null : 'utf8',
    maxBuffer: opts.maxBuffer ?? 64 * 1024 * 1024,
    timeout: opts.timeout ?? 120000,
  });
  commandLog.push({
    command: cmd,
    args: args.map(redactArg),
    cwd: opts.cwd ?? null,
    status: r.status,
    signal: r.signal ?? null,
    elapsedMs: Date.now() - started,
  });
  if (!opts.allowFailure && (r.status ?? 1) !== 0) {
    const e = new Error(`${opts.code ?? 'COMMAND_FAILED'}:${path.basename(cmd)}:${r.status ?? 'null'}:${tail(r.stderr || r.stdout, 3000)}`);
    e.code = opts.code ?? 'COMMAND_FAILED';
    e.details = { stdout: tail(r.stdout), stderr: tail(r.stderr), status: r.status };
    throw e;
  }
  return r;
}
function runBuffer(cmd, args = [], opts = {}) {
  return run(cmd, args, { ...opts, encoding: null });
}

function runAsyncCaptured(cmd, args = [], opts = {}) {
  return new Promise((resolve, reject) => {
    const started = Date.now();
    const child = spawn(cmd, args, {
      cwd: opts.cwd,
      env: opts.env ?? process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    const stdout = [];
    const stderr = [];
    let timedOut = false;
    const maxBuffer = opts.maxBuffer ?? 96 * 1024 * 1024;
    let bytes = 0;
    const collect = (bucket, chunk) => {
      const b = Buffer.from(chunk);
      bytes += b.length;
      if (bytes <= maxBuffer) bucket.push(b);
    };
    child.stdout.on('data', (chunk) => collect(stdout, chunk));
    child.stderr.on('data', (chunk) => collect(stderr, chunk));
    const timer = setTimeout(() => {
      timedOut = true;
      try { child.kill('SIGTERM'); } catch {}
      setTimeout(() => { try { child.kill('SIGKILL'); } catch {} }, 3000).unref?.();
    }, opts.timeout ?? 120000);
    timer.unref?.();

    child.on('error', (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on('close', (code, signal) => {
      clearTimeout(timer);
      const out = Buffer.concat(stdout).toString('utf8');
      const err = Buffer.concat(stderr).toString('utf8');
      commandLog.push({
        command: cmd,
        args: args.map(redactArg),
        cwd: opts.cwd ?? null,
        status: code,
        signal: signal ?? null,
        elapsedMs: Date.now() - started,
      });
      if (timedOut) {
        const e = new Error(`${opts.code ?? 'COMMAND_TIMEOUT'}:${path.basename(cmd)}:timeout:${tail(err || out, 3000)}`);
        e.code = opts.code ?? 'COMMAND_TIMEOUT';
        e.details = { stdout: tail(out), stderr: tail(err), status: code, timedOut: true };
        reject(e);
        return;
      }
      if (!opts.allowFailure && (code ?? 1) !== 0) {
        const e = new Error(`${opts.code ?? 'COMMAND_FAILED'}:${path.basename(cmd)}:${code ?? 'null'}:${tail(err || out, 3000)}`);
        e.code = opts.code ?? 'COMMAND_FAILED';
        e.details = { stdout: tail(out), stderr: tail(err), status: code };
        reject(e);
        return;
      }
      resolve({ status: code, signal, stdout: out, stderr: err });
    });
  });
}
function git(repoDir, args, opts = {}) { return run('/usr/bin/git', ['-C', repoDir, ...args], opts).stdout.trim(); }
function classify(error) {
  const code = error?.code ?? 'UNKNOWN_FAILURE';
  const environmentCodes = new Set([
    'GITHUB_AUTH_UNAVAILABLE','ANDROID_SDK_UNAVAILABLE','ADB_UNAVAILABLE','ANDROID_DEVICE_COUNT_INVALID',
    'ANDROID_TAILSCALE_APP_MISSING','ANDROID_TAILSCALE_SETUP_REQUIRED','ANDROID_USB_RECONNECT_REQUIRED','TAILSCALE_CLI_UNAVAILABLE','TAILSCALE_NOT_RUNNING','TAILSCALE_LOGIN_REQUIRED',
    'TAILSCALE_HTTPS_PORT_UNAVAILABLE','TAILSCALE_SERVE_UNAVAILABLE','TAILSCALE_SERVE_ENABLE_REQUIRED','TAILSCALE_FOREGROUND_OWNER_UNAVAILABLE','ANDROID_UI_NOT_READY_OR_LOCKED',
    'ANDROID_TAILNET_ROUTE_UNREACHABLE'
  ]);
  return environmentCodes.has(code) ? 'environment' : 'candidate_or_integration';
}
function fail(code, message, details = null) {
  const e = new Error(message ?? code); e.code = code; e.details = details; throw e;
}

async function importMjs(root, rel) {
  return import(pathToFileURL(path.join(root, rel)).href + `?v=${Date.now()}`);
}
function exactRemoteMain(gh, repo, expected) {
  const r = run(gh, ['api', `repos/${repo}/git/ref/heads/main`, '--jq', '.object.sha'], { code: 'PROVIDER_CURRENTNESS_UNAVAILABLE' });
  const observed = r.stdout.trim();
  if (observed !== expected) fail('PROVIDER_MAIN_MOVED', `${repo} main moved: ${observed} != ${expected}`, { repo, expected, observed });
  return observed;
}
function cloneExact(gh, repo, expectedHead, expectedTree, dest, blobs) {
  run(gh, ['repo', 'clone', repo, dest, '--', '--no-checkout'], { code: 'REPOSITORY_CLONE_FAILED', timeout: 180000 });
  run('/usr/bin/git', ['-C', dest, 'checkout', '--detach', expectedHead], { code: 'REPOSITORY_CHECKOUT_FAILED', timeout: 60000 });
  const head = git(dest, ['rev-parse', 'HEAD']);
  const tree = git(dest, ['rev-parse', 'HEAD^{tree}']);
  if (head !== expectedHead || tree !== expectedTree) fail('REPOSITORY_IDENTITY_MISMATCH', `${repo} exact checkout mismatch`, { head, tree, expectedHead, expectedTree });
  for (const [rel, expected] of Object.entries(blobs)) {
    const observed = git(dest, ['rev-parse', `HEAD:${rel}`]);
    if (observed !== expected) fail('SOURCE_BLOB_MISMATCH', `${repo}:${rel}`, { rel, expected, observed });
  }
  if (git(dest, ['status', '--porcelain=v1', '-uall']) !== '') fail('REPOSITORY_WORKTREE_DIRTY', `${repo} exact checkout is dirty`);
}
function findAndroidSdk() {
  const candidates = [path.join(home, 'Library', 'Android', 'sdk'), '/opt/homebrew/share/android-commandlinetools'];
  return candidates.find((p) => fs.existsSync(path.join(p, 'platform-tools', 'adb')) && fs.existsSync(path.join(p, 'platforms'))) ?? null;
}
function parseDevices(text) {
  return text.split(/\r?\n/u).slice(1).map((line) => line.trim()).filter(Boolean).filter((line) => /\sdevice(?:\s|$)/u.test(line)).map((line) => ({ serial: line.split(/\s+/u)[0], line }));
}

function parseAllAdbDevices(text) {
  return text
    .split(/\r?\n/u)
    .slice(1)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(/\s+/u);
      return {
        serial: parts[0] ?? '',
        state: parts[1] ?? '',
        line,
      };
    });
}
function adbDeviceSnapshot(adbPath, env) {
  run(adbPath, ['start-server'], { env, allowFailure:true, timeout:10000 });
  const result = run(adbPath, ['devices','-l'], { env, allowFailure:true, timeout:10000 });
  return {
    status: result.status,
    stdout: safeString(result.stdout),
    stderr: safeString(result.stderr),
    devices: parseAllAdbDevices(safeString(result.stdout)),
  };
}
function adbDeviceState(adbPath, serial, env) {
  const snapshot = adbDeviceSnapshot(adbPath, env);
  const exact = snapshot.devices.find((device) => device.serial === serial) ?? null;
  return {
    snapshot,
    exact,
    ready: exact?.state === 'device',
    unauthorized: exact?.state === 'unauthorized',
    offline: exact?.state === 'offline',
    missing: exact === null,
  };
}
async function waitForAdbReconnect(adbPath, serial, env, {
  timeoutMs = 20 * 60 * 1000,
  reason = 'USB/debug reconnection',
} = {}) {
  const started = Date.now();
  let announcedMissing = false;
  let announcedUnauthorized = false;
  let lastReconnectAttempt = 0;

  while (Date.now() - started < timeoutMs) {
    const state = adbDeviceState(adbPath, serial, env);
    updateHealth({ adb: state.ready ? 'DEVICE' : state.unauthorized ? 'UNAUTHORIZED' : state.offline ? 'OFFLINE' : 'MISSING' });
    if (state.ready) {
      if (announcedMissing || announcedUnauthorized) {
        console.error(`VCS04_PHONE_RECONNECTED: ${serial} is authorized in ADB device state; resuming ${reason}.`);
      }
      updateHealth({ adb: 'DEVICE' }, { emit: true });
      return {
        state: 'DEVICE_READY',
        serial,
        elapsedMs: Date.now() - started,
        line: state.exact.line,
      };
    }

    if (state.unauthorized) {
      if (!announcedUnauthorized) {
        announcedUnauthorized = true;
        console.error(
          `VCS04_PHONE_ACTION: ${serial} is reconnected but Android USB debugging is not authorized. ` +
          'Keep the phone unlocked and approve the USB debugging prompt. VCS-04 product effects remain held.',
        );
      }
    } else if (state.missing || state.offline) {
      if (!announcedMissing) {
        announcedMissing = true;
        console.error(
          `VCS04_PHONE_ACTION: waiting for the same Android device (${serial}) to reconnect over USB/debug. ` +
          'Reconnect the cable, keep the phone unlocked, and leave this command running. VCS-04 product effects remain held.',
        );
      }
      if (Date.now() - lastReconnectAttempt > 5000) {
        run(adbPath, ['reconnect', 'offline'], { env, allowFailure:true, timeout:10000 });
        run(adbPath, ['reconnect', 'device'], { env, allowFailure:true, timeout:10000 });
        lastReconnectAttempt = Date.now();
      }
    }

    await sleep(1000);
  }

  fail(
    'ANDROID_USB_RECONNECT_REQUIRED',
    `Android device ${serial} did not return to authorized ADB device state while waiting for ${reason}; VCS-04 effects remain held`,
  );
}
function parseIdentity(text) {
  const match = text.match(/INSTRUMENTATION_STATUS: vexPrivateHomePublicIdentity=(\{[^\r\n]+\})/u);
  if (!match) fail('HOST_BRIDGE_PUBLIC_IDENTITY_MISSING', 'Host bridge did not return public Android identity');
  const value = JSON.parse(match[1]);
  for (const key of ['deviceRef','devicePublicKeyBase64Url','devicePublicKeyFingerprintRef']) {
    if (typeof value[key] !== 'string' || value[key].length === 0) fail('HOST_BRIDGE_PUBLIC_IDENTITY_INVALID', `missing ${key}`);
  }
  const fingerprint = 'fingerprint.sha256.' + crypto.createHash('sha256').update(Buffer.from(value.devicePublicKeyBase64Url, 'base64url')).digest('hex');
  if (fingerprint !== value.devicePublicKeyFingerprintRef) fail('HOST_BRIDGE_PUBLIC_IDENTITY_FINGERPRINT_MISMATCH', 'public SPKI fingerprint mismatch');
  return value;
}
function inspectTailnetStatus(text) {
  let value = null;
  try { value = JSON.parse(text); } catch {}
  const dns = safeString(value?.Self?.DNSName).replace(/\.$/u, '');
  const tailscaleIps = Array.isArray(value?.Self?.TailscaleIPs) ? value.Self.TailscaleIPs : [];
  const ipv4 = tailscaleIps.find((candidate) => /^\d{1,3}(?:\.\d{1,3}){3}$/u.test(safeString(candidate))) ?? null;
  return {
    value,
    dnsName: dns,
    tailscaleIpv4: ipv4,
    backendState: safeString(value?.BackendState),
    running: value?.BackendState === 'Running' && dns.length > 0 && Boolean(ipv4),
  };
}
function readTailnetStatus() {
  const status = run(tailscaleBin, ['status','--json'], {
    allowFailure:true,
    timeout:15000,
  });
  const inspected = inspectTailnetStatus(safeString(status.stdout));
  return {
    ...inspected,
    commandStatus: status.status,
    stdout: safeString(status.stdout),
    stderr: safeString(status.stderr),
  };
}
async function ensureTailnetRunning() {
  const initial = readTailnetStatus();
  tailscaleWasRunning = initial.running;
  updateHealth({ macTailnet: initial.running ? 'RUNNING' : (initial.backendState || 'NOT_RUNNING') }, { emit: true });
  if (initial.running) return { dnsName: initial.dnsName, tailscaleIpv4: initial.tailscaleIpv4, backendState: initial.backendState, autoRecoveryPerformed:false };

  if (fs.existsSync('/Applications/Tailscale.app')) {
    run('/usr/bin/open', ['-a','Tailscale'], { allowFailure:true, timeout:10000 });
    await sleep(1500);
    const launched = readTailnetStatus();
    if (launched.running) {
      tailscaleConnectionBroughtUp = true;
      updateHealth({ macTailnet: 'RUNNING' }, { emit: true });
      return { dnsName: launched.dnsName, tailscaleIpv4: launched.tailscaleIpv4, backendState: launched.backendState, autoRecoveryPerformed:true };
    }
  }

  const up = run(tailscaleBin, ['up','--timeout=20s'], {
    allowFailure:true,
    timeout:30000,
  });
  const after = readTailnetStatus();
  if (after.running) {
    tailscaleConnectionBroughtUp = true;
    updateHealth({ macTailnet: 'RUNNING' }, { emit: true });
    return { dnsName: after.dnsName, tailscaleIpv4: after.tailscaleIpv4, backendState: after.backendState, autoRecoveryPerformed:true };
  }

  const evidence = [
    `initialBackendState=${initial.backendState || 'UNKNOWN'}`,
    `afterBackendState=${after.backendState || 'UNKNOWN'}`,
    safeString(up.stdout),
    safeString(up.stderr),
    safeString(after.stdout),
    safeString(after.stderr),
  ].join('\n');
  const loginRequired = /https?:\/\/login\.tailscale\.com|NeedsLogin|LoggedOut|needs login|authenticate/i.test(evidence);
  if (loginRequired) {
    fail(
      'TAILSCALE_LOGIN_REQUIRED',
      'Tailscale is installed but this Mac requires interactive authentication before the lived proof can continue',
      { evidence: tail(evidence, 4000) },
    );
  }
  fail(
    'TAILSCALE_NOT_RUNNING',
    'Tailscale backend could not be brought to Running automatically',
    { evidence: tail(evidence, 4000) },
  );
}
function androidPackageInstalled(adbPath, deviceSerial, env, packageName) {
  const state = adbDeviceState(adbPath, deviceSerial, env);
  if (!state.ready) return false;
  const result = run(
    adbPath,
    ['-s', deviceSerial, 'shell', 'pm', 'path', packageName],
    { env, allowFailure:true, timeout:10000 },
  );
  return (result.status ?? 1) === 0 && safeString(result.stdout).includes('package:');
}
function openOfficialAndroidTailscaleListing(adbPath, deviceSerial, env) {
  const market = run(
    adbPath,
    ['-s',deviceSerial,'shell','am','start','-a','android.intent.action.VIEW',
      '-d',`market://details?id=${TAILSCALE_ANDROID_PACKAGE}`],
    { env, allowFailure:true, timeout:10000 },
  );
  if ((market.status ?? 1) === 0) return 'MARKET';
  run(
    adbPath,
    ['-s',deviceSerial,'shell','am','start','-a','android.intent.action.VIEW',
      '-d',`https://play.google.com/store/apps/details?id=${TAILSCALE_ANDROID_PACKAGE}`],
    { env, allowFailure:true, timeout:10000 },
  );
  return 'HTTPS';
}
function launchAndroidTailscale(adbPath, deviceSerial, env) {
  const direct = run(
    adbPath,
    ['-s',deviceSerial,'shell','am','start','-n',
      `${TAILSCALE_ANDROID_PACKAGE}/com.tailscale.ipn.MainActivity`],
    { env, allowFailure:true, timeout:10000 },
  );
  if ((direct.status ?? 1) !== 0) {
    run(
      adbPath,
      ['-s',deviceSerial,'shell','monkey','-p',TAILSCALE_ANDROID_PACKAGE,
        '-c','android.intent.category.LAUNCHER','1'],
      { env, allowFailure:true, timeout:10000 },
    );
  }
  run(
    adbPath,
    ['-s',deviceSerial,'shell','am','broadcast','-a','com.tailscale.ipn.CONNECT_VPN',
      '-p',TAILSCALE_ANDROID_PACKAGE],
    { env, allowFailure:true, timeout:10000 },
  );
}
function androidTailnetDiagnostic(adbPath, deviceSerial, env) {
  const connectivity = run(
    adbPath,
    ['-s',deviceSerial,'shell','dumpsys','connectivity'],
    { env, allowFailure:true, timeout:15000 },
  );
  const text = safeString(connectivity.stdout) + safeString(connectivity.stderr);
  const tailscaleMentioned = /com\.tailscale\.ipn|tailscale/iu.test(text);
  return {
    tailscaleMentioned,
    diagnosticSha256: crypto.createHash('sha256').update(text).digest('hex'),
  };
}
async function ensureAndroidTailnetPrerequisite(adbPath, deviceSerial, env, dnsName) {
  let assistedSetup = false;

  setPhase('ANDROID_ADB_READY');
  await waitForAdbReconnect(
    adbPath,
    deviceSerial,
    env,
    { reason:'Android Tailscale prerequisite check' },
  );

  setPhase('ANDROID_TAILSCALE_PACKAGE_CHECK');
  if (!androidPackageInstalled(adbPath, deviceSerial, env, TAILSCALE_ANDROID_PACKAGE)) {
    assistedSetup = true;
    updateHealth({ androidTailscale: 'MISSING' }, { emit: true });
    const storeRoute = openOfficialAndroidTailscaleListing(adbPath, deviceSerial, env);
    console.error(
      'VCS04_PHONE_ACTION: The official Tailscale listing is open on the connected Android device. ' +
      'Install Tailscale, open it, sign in to the same tailnet, and approve the VPN prompt if Android asks. ' +
      'You may disconnect USB temporarily if Android setup requires it; reconnect the same phone afterward and leave this command running. ' +
      'No VCS-04 Home/network/product effect has started.',
    );
    fs.writeFileSync(
      path.join(resultRoot, 'PHONE-ACTION.txt'),
      [
        'Install the official Tailscale Android app opened by this proof.',
        'Sign in to the same tailnet as the Mac.',
        'Approve the Android VPN prompt if shown.',
        'USB may be disconnected temporarily while completing Android setup.',
        'Reconnect the same phone afterward; this proof explicitly waits for ADB to return.',
        'The proof remains before all VCS-04 product effects until ADB is authorized and the Tailscale package is present.',
        'Private HTTPS gateway traffic—not shell ping—is the actual reachability proof.',
        `storeRoute=${storeRoute}`,
        `package=${TAILSCALE_ANDROID_PACKAGE}`,
        `macTailnetDns=${dnsName}`,
        '',
      ].join('\n'),
    );

    setPhase('WAIT_ANDROID_TAILSCALE_INSTALL');
    const installDeadline = Date.now() + 20 * 60 * 1000;
    while (Date.now() < installDeadline) {
      const state = adbDeviceState(adbPath, deviceSerial, env);
      updateHealth({ adb: state.ready ? 'DEVICE' : state.unauthorized ? 'UNAUTHORIZED' : state.offline ? 'OFFLINE' : 'MISSING' });
      if (!state.ready) {
        await waitForAdbReconnect(
          adbPath,
          deviceSerial,
          env,
          {
            timeoutMs: Math.max(1000, installDeadline - Date.now()),
            reason:'Tailscale installation completion',
          },
        );
      }
      if (androidPackageInstalled(adbPath, deviceSerial, env, TAILSCALE_ANDROID_PACKAGE)) break;
      await sleep(1000);
    }
    if (!androidPackageInstalled(adbPath, deviceSerial, env, TAILSCALE_ANDROID_PACKAGE)) {
      fail(
        'ANDROID_TAILSCALE_SETUP_REQUIRED',
        'Tailscale Android installation was not completed during this attempt; VCS-04 effects remain unstarted',
      );
    }
  }

  updateHealth({ androidTailscale: 'INSTALLED' }, { emit: true });
  setPhase('ANDROID_TAILSCALE_LAUNCH');
  await waitForAdbReconnect(
    adbPath,
    deviceSerial,
    env,
    { reason:'Android Tailscale launch' },
  );
  launchAndroidTailscale(adbPath, deviceSerial, env);
  await sleep(1500);
  const diagnostic = androidTailnetDiagnostic(adbPath, deviceSerial, env);
  updateHealth({
    androidTailscale: diagnostic.tailscaleMentioned ? 'INSTALLED_VPN_VISIBLE' : 'INSTALLED',
    networkProof: 'DEFERRED_TO_PRIVATE_HTTPS_GATEWAY',
  }, { emit: true });

  emitProgress('CHECKPOINT', {
    note: 'Android_shell_ping_not_used_as_gate',
    actualReachabilityProof: 'private_https_gateway_routes',
  });

  return {
    packageInstalled: true,
    assistedSetup,
    adbReconnectAware: true,
    shellPingGateUsed: false,
    reachabilityProof: 'DEFERRED_TO_PRIVATE_HTTPS_GATEWAY',
    connectivityDiagnosticSha256: diagnostic.diagnosticSha256,
  };
}

function serveEnableUrlFromLog(text) {
  const match = safeString(text).match(/https:\/\/login\.tailscale\.com\/f\/serve\?node=[A-Za-z0-9_-]+/u);
  return match ? match[0] : null;
}
function readServeLog(serveLogPath) {
  try { return fs.readFileSync(serveLogPath, 'utf8'); } catch { return ''; }
}
function readServeStatusJson() {
  const result = run(
    tailscaleBin,
    ['serve','status','--json'],
    {allowFailure:true,timeout:10000},
  );
  let parsed = null;
  try { parsed = JSON.parse(safeString(result.stdout)); } catch {}
  return {
    status: result.status,
    stdout: safeString(result.stdout),
    stderr: safeString(result.stderr),
    parsed,
  };
}
function serveConfigs(status) {
  const parsed = status?.parsed;
  if (!parsed || typeof parsed !== 'object') return [];
  const out = [parsed];
  for (const nested of Object.values(parsed.Foreground ?? {})) {
    if (nested && typeof nested === 'object') out.push(nested);
  }
  return out;
}
function serveConfigHostPort(config, dnsName, port) {
  return config?.Web?.[`${dnsName}:${port}`] ?? null;
}
function serveStatusHostPortPresent(status, dnsName, port) {
  return serveConfigs(status).some((config) => Boolean(serveConfigHostPort(config, dnsName, port)));
}
function serveStatusOwnsExactProxy(status, dnsName, port, target) {
  return serveConfigs(status).some((config) => {
    const tcp = config?.TCP?.[String(port)];
    if (!tcp || tcp.HTTPS !== true) return false;
    const entry = serveConfigHostPort(config, dnsName, port);
    return entry?.Handlers?.['/']?.Proxy === target;
  });
}
function serveStatusPortPresent(status, port) {
  const configs = serveConfigs(status);
  if (configs.length === 0) {
    return portAppears(`${status?.stdout ?? ''}\n${status?.stderr ?? ''}`, port);
  }
  return configs.some((config) => (
    Boolean(config?.TCP?.[String(port)])
    || Object.keys(config?.Web ?? {}).some((key) => key.endsWith(`:${port}`))
  ));
}
function serveStatusAllowsFunnel(status, dnsName, port) {
  const hostPort = `${dnsName}:${port}`;
  return serveConfigs(status).some((config) => config?.AllowFunnel?.[hostPort] === true);
}
function spawnForegroundServe(serveLogPath, localPort) {
  const fd = fs.openSync(serveLogPath, 'a');
  try {
    return spawn(
      tailscaleBin,
      ['serve','--yes',`--https=${tailscalePort}`,`http://127.0.0.1:${localPort}`],
      { stdio:['ignore',fd,fd] },
    );
  } finally {
    fs.closeSync(fd);
  }
}
function curlPrivateServeStatus({statusUrl,dnsName,tailscaleIpv4}) {
  const forced = `${dnsName}:${tailscalePort}:${tailscaleIpv4}`;
  const result = run(
    '/usr/bin/curl',
    [
      '--fail','--silent','--show-error',
      '--max-time','3',
      '--resolve',forced,
      statusUrl,
    ],
    {allowFailure:true,timeout:6000},
  );
  let body = null;
  if ((result.status ?? 1) === 0) {
    try { body = JSON.parse(safeString(result.stdout)); } catch {}
  }
  return {
    status: result.status,
    stdout: safeString(result.stdout),
    stderr: safeString(result.stderr),
    body,
  };
}
function foregroundEntriesForHostPort(status, dnsName, port) {
  const parsed = status?.parsed;
  if (!parsed || typeof parsed !== 'object') return [];
  const out = [];
  for (const [sessionId, config] of Object.entries(parsed.Foreground ?? {})) {
    if (!config || typeof config !== 'object') continue;
    const hostPort = `${dnsName}:${port}`;
    const entry = config?.Web?.[hostPort];
    const tcp = config?.TCP?.[String(port)];
    if (!entry || !tcp) continue;
    out.push({
      sessionId,
      config,
      proxy: entry?.Handlers?.['/']?.Proxy ?? null,
      https: tcp?.HTTPS === true,
      allowFunnel: config?.AllowFunnel?.[hostPort] === true,
    });
  }
  return out;
}
function shellArgTokens(command) {
  // The A008 Serve command contains no whitespace-bearing arguments; preserve a simple bounded parser
  // rather than introducing shell interpretation. This is process observation only.
  return safeString(command)
    .trim()
    .split(/\s+/u)
    .filter(Boolean);
}
function tailscaleProcessCandidates() {
  const ps = run(
    '/bin/ps',
    ['-ww','-axo','pid=,ppid=,etime=,args='],
    {allowFailure:true,timeout:10000},
  );
  const candidates = [];
  for (const line of safeString(ps.stdout).split(/\r?\n/u)) {
    const match = line.match(/^\s*(\d+)\s+(\d+)\s+(\S+)\s+(.+)$/u);
    if (!match) continue;
    const command = match[4].trim();
    const tokens = shellArgTokens(command);
    if (tokens.length === 0) continue;
    const executableBase = path.basename(tokens[0]).toLowerCase();
    const looksLikeTailscaleCli =
      executableBase === 'tailscale'
      || /\/Contents\/MacOS\/Tailscale$/u.test(tokens[0]);
    if (!looksLikeTailscaleCli) continue;
    candidates.push({
      pid:Number(match[1]),
      ppid:Number(match[2]),
      elapsed:match[3],
      executable:tokens[0],
      args:tokens.slice(1),
      line:line.trim(),
    });
  }
  return {
    psStatus:ps.status,
    candidates,
  };
}
function exactForegroundServeProcesses({port,target}) {
  const observed = tailscaleProcessCandidates();
  const portArg = `--https=${port}`;
  const matches = observed.candidates.filter((candidate) => {
    const args = candidate.args;
    return args.includes('serve')
      && args.includes('--yes')
      && args.includes(portArg)
      && args.includes(target)
      && !args.includes('--bg')
      && !args.includes('funnel');
  });
  return {
    psStatus:observed.psStatus,
    candidates:observed.candidates,
    matches,
  };
}
function pidAlive(pid) {
  if (!Number.isSafeInteger(pid) || pid <= 1) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}
async function waitForForegroundMappingGone(dnsName, port, timeoutMs = 10000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const status = readServeStatusJson();
    if (foregroundEntriesForHostPort(status, dnsName, port).length === 0) {
      return true;
    }
    await sleep(500);
  }
  return false;
}
async function recoverA008ServeIfPresent(dnsName) {
  let status = readServeStatusJson();
  const entries = foregroundEntriesForHostPort(status, dnsName, 8443);

  if (entries.length === 0) {
    predecessorServeRecoveryState = 'NOT_NEEDED';
    return;
  }
  if (entries.length !== 1) {
    predecessorServeRecoveryState = 'HELD_AMBIGUOUS_FOREGROUND';
    fail(
      'TAILSCALE_SERVE_UNAVAILABLE',
      'Predecessor recovery found multiple foreground Serve owners for exact host:8443; refusing ambiguous cleanup',
      {entryCount:entries.length},
    );
  }

  const entry = entries[0];
  if (
    entry.https !== true
    || typeof entry.proxy !== 'string'
    || !/^http:\/\/127\.0\.0\.1:\d{1,5}$/u.test(entry.proxy)
  ) {
    predecessorServeRecoveryState = 'HELD_UNEXPECTED_FOREGROUND';
    fail(
      'TAILSCALE_SERVE_UNAVAILABLE',
      'Exact predecessor foreground Serve entry does not match the expected HTTPS-to-loopback shape',
      {sessionId:entry.sessionId,proxy:entry.proxy,https:entry.https},
    );
  }
  if (entry.allowFunnel === true) {
    predecessorServeRecoveryState = 'HELD_PUBLIC';
    fail(
      'PUBLIC_FUNNEL_EXPOSURE_DETECTED',
      'Exact predecessor foreground host:8443 has AllowFunnel=true; refusing to terminate its owner process',
    );
  }

  const owners = exactForegroundServeProcesses({
    port:8443,
    target:entry.proxy,
  });
  if (owners.matches.length !== 1) {
    predecessorServeRecoveryState = 'HELD_OWNER_NOT_EXACT';
    fail(
      'TAILSCALE_FOREGROUND_OWNER_UNAVAILABLE',
      'Could not identify exactly one foreground tailscale serve process owning the predecessor host:8443 mapping',
      {
        sessionId:entry.sessionId,
        proxy:entry.proxy,
        ownerMatchCount:owners.matches.length,
        tailscaleProcessCandidateCount:owners.candidates.length,
        tailscaleProcessCandidates:owners.candidates.slice(0,20).map((candidate) => ({
          pid:candidate.pid,
          ppid:candidate.ppid,
          elapsed:candidate.elapsed,
          executable:candidate.executable,
          args:candidate.args,
        })),
      },
    );
  }

  const owner = owners.matches[0];
  setPhase('RECOVER_A008_FOREGROUND_SERVE_OWNER');
  emitProgress('CHECKPOINT', {
    predecessor:'A008',
    foregroundSession:entry.sessionId,
    proxyTarget:entry.proxy,
    ownerPid:owner.pid,
    ownerElapsed:owner.elapsed,
    allowFunnel:'false',
  });

  try {
    process.kill(owner.pid, 'SIGTERM');
  } catch (error) {
    predecessorServeRecoveryState = 'HELD_SIGTERM_FAILED';
    fail(
      'TAILSCALE_FOREGROUND_OWNER_UNAVAILABLE',
      'Exact predecessor Serve owner could not be sent SIGTERM',
      {ownerPid:owner.pid,error:error?.message ?? String(error)},
    );
  }

  if (await waitForForegroundMappingGone(dnsName, 8443, 7000)) {
    predecessorServeRecoveryPerformed = true;
    predecessorServeRecoveryState = 'RECOVERED_SIGTERM';
    emitProgress('CHECKPOINT', {
      predecessor:'A008',
      recovery:'PASS_SIGTERM',
      ownerPid:owner.pid,
    });
    return;
  }

  const stillExact = exactForegroundServeProcesses({
    port:8443,
    target:entry.proxy,
  }).matches.filter((candidate) => candidate.pid === owner.pid);

  if (stillExact.length === 1 && pidAlive(owner.pid)) {
    try {
      process.kill(owner.pid, 'SIGKILL');
    } catch (error) {
      predecessorServeRecoveryState = 'HELD_SIGKILL_FAILED';
      fail(
        'TAILSCALE_FOREGROUND_OWNER_UNAVAILABLE',
        'Exact predecessor Serve owner remained after SIGTERM and could not be sent SIGKILL',
        {ownerPid:owner.pid,error:error?.message ?? String(error)},
      );
    }
    if (await waitForForegroundMappingGone(dnsName, 8443, 5000)) {
      predecessorServeRecoveryPerformed = true;
      predecessorServeRecoveryState = 'RECOVERED_SIGKILL';
      emitProgress('CHECKPOINT', {
        predecessor:'A008',
        recovery:'PASS_SIGKILL',
        ownerPid:owner.pid,
      });
      return;
    }
  }

  predecessorServeRecoveryState = 'HELD_FOREGROUND_CONFIG_REMAINS';
  fail(
    'TAILSCALE_SERVE_UNAVAILABLE',
    'Exact predecessor foreground Serve config remained after bounded owner-process recovery',
    {
      sessionId:entry.sessionId,
      proxy:entry.proxy,
      ownerPid:owner.pid,
      ownerAlive:pidAlive(owner.pid),
      serveStatus:tail(readServeStatusJson().stdout || readServeStatusJson().stderr, 4000),
    },
  );
}
async function waitForExactServeConfig({dnsName,target,serveLogPath,timeoutMs = 20000}) {
  const deadline = Date.now() + timeoutMs;
  let lastStatus = null;
  while (Date.now() < deadline) {
    lastStatus = readServeStatusJson();    if (serveStatusOwnsExactProxy(lastStatus, dnsName, tailscalePort, target)) {
      return {state:'CONFIGURED',status:lastStatus};
    }
    const logText = readServeLog(serveLogPath);
    const enableUrl = serveEnableUrlFromLog(logText);
    if (enableUrl) return {state:'ENABLE_REQUIRED',enableUrl,logText,status:lastStatus};
    if (tailscaleChild?.exitCode !== null) {
      return {state:'EXITED',exitCode:tailscaleChild.exitCode,logText,status:lastStatus};
    }
    await sleep(700);
  }
  return {state:'TIMEOUT',logText:readServeLog(serveLogPath),status:lastStatus};
}
async function establishForegroundServe({serveLogPath,statusUrl,localPort,dnsName,tailscaleIpv4}) {
  networkServeAttempted = true;
  const target = `http://127.0.0.1:${localPort}`;
  setPhase('START_FOREGROUND_TAILSCALE_SERVE');
  tailscaleChild = spawnForegroundServe(serveLogPath, localPort);

  let result = await waitForExactServeConfig({dnsName,target,serveLogPath});
  if (result.state === 'ENABLE_REQUIRED') {
    serveEnableUrl = result.enableUrl;
    serveEnablementPrompted = true;
    await stopChild(tailscaleChild);
    tailscaleChild = null;

    setPhase('WAIT_TAILSCALE_SERVE_ENABLE');
    updateHealth({networkProof:'WAITING_FOR_TAILSCALE_SERVE_ENABLE'}, {emit:true});
    console.error(
      'VCS04_HUMAN_ACTION: private Tailscale Serve needs tailnet HTTPS enablement. ' +
      'The enablement page is opening on the Mac. Complete the browser action, then leave A009 running. ' +
      'A009 will start one private foreground listener after the capability becomes available; Funnel is not configured.',
    );
    try { run('/usr/bin/open', [serveEnableUrl], {allowFailure:true,timeout:10000}); } catch {}

    const deadline = Date.now() + 10 * 60 * 1000;
    let retry = 0;
    while (Date.now() < deadline) {
      retry += 1;
      emitProgress('WAITING', {
        prerequisite:'tailscale_serve_enable',
        retry,
        serveActive:'false',
      });
      await sleep(3000);

      fs.writeFileSync(serveLogPath, '');
      tailscaleChild = spawnForegroundServe(serveLogPath, localPort);
      result = await waitForExactServeConfig({
        dnsName,target,serveLogPath,timeoutMs:12000,
      });

      if (result.state === 'CONFIGURED') break;

      if (tailscaleChild) {
        await stopChild(tailscaleChild);
        tailscaleChild = null;
      }
      if (result.state !== 'ENABLE_REQUIRED') {
        fail(
          'TAILSCALE_SERVE_UNAVAILABLE',
          'Serve enablement changed, but the exact private proxy configuration did not become current',
          {
            serveState:result.state,
            serveLog:tail(result.logText ?? ''),
            serveStatus:tail(result.status?.stdout ?? result.status?.stderr ?? ''),
          },
        );
      }
    }
    if (result.state !== 'CONFIGURED') {
      fail(
        'TAILSCALE_SERVE_ENABLE_REQUIRED',
        'Tailscale Serve was not enabled during the bounded wait; no exact private Serve proxy was established',
      );
    }
  } else if (result.state !== 'CONFIGURED') {
    fail(
      'TAILSCALE_SERVE_UNAVAILABLE',
      'Foreground private Serve did not establish the exact expected proxy configuration',
      {
        serveState:result.state,
        serveLog:tail(result.logText ?? ''),
        serveStatus:tail(result.status?.stdout ?? result.status?.stderr ?? ''),
      },
    );
  }

  emitProgress('CHECKPOINT', {
    privateServeConfig:'EXACT',
    httpsPort:tailscalePort,
    target,
  });

  const forcedProbe = curlPrivateServeStatus({statusUrl,dnsName,tailscaleIpv4});
  emitProgress('CHECKPOINT', {
    macForcedIpHttpsProbe:forcedProbe.body ? 'PASS' : 'NON_BLOCKING_FAILURE',
    curlStatus:forcedProbe.status,
    acceptanceOracle:'Android_private_gateway_routes',
  });

  return {
    serveStatus:readServeStatusJson(),
    forcedProbe,
  };
}
function portAppears(text, port) {
  return new RegExp(`(^|[^0-9])${port}([^0-9]|$)`, 'u').test(safeString(text));
}
function uiNodeByText(xml, expectedText) {
  const tags = xml.match(/<node\b[^>]*>/gu) ?? [];
  for (const tag of tags) {
    const text = tag.match(/\btext="([^"]*)"/u)?.[1] ?? '';
    if (text !== expectedText) continue;
    const b = tag.match(/\bbounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"/u);
    if (!b) continue;
    return { x1:+b[1], y1:+b[2], x2:+b[3], y2:+b[4], tag };
  }
  return null;
}
function dumpUi(adbPath, deviceSerial, resultFile) {
  run(adbPath, ['-s', deviceSerial, 'shell', 'uiautomator', 'dump', '/sdcard/vex-vcs04-ui.xml'], { code:'ANDROID_UI_DUMP_FAILED', timeout:20000 });
  const xml = run(adbPath, ['-s', deviceSerial, 'exec-out', 'cat', '/sdcard/vex-vcs04-ui.xml'], { code:'ANDROID_UI_READ_FAILED', timeout:10000 }).stdout;
  fs.writeFileSync(resultFile, xml);
  return xml;
}
async function waitForUiText(adbPath, deviceSerial, text, resultFile, timeoutMs = 30000) {
  const start = Date.now();
  let last = '';
  while (Date.now() - start < timeoutMs) {
    try {
      last = dumpUi(adbPath, deviceSerial, resultFile);
      const found = uiNodeByText(last, text);
      if (found) return { found, xml:last };
    } catch {}
    await sleep(900);
  }
  return { found:null, xml:last };
}
async function stopChild(child) {
  if (!child || child.exitCode !== null) return;
  child.kill('SIGINT');
  for (let i=0;i<20 && child.exitCode===null;i++) await sleep(100);
  if (child.exitCode===null) child.kill('SIGTERM');
  for (let i=0;i<20 && child.exitCode===null;i++) await sleep(100);
}

async function main() {
  mkdirp(canonicalParent);
  try { fs.mkdirSync(resultRoot); }
  catch (error) {
    if (error?.code === 'EEXIST') {
      console.error(`DUPLICATE_ATTEMPT:${resultRoot}`);
      process.exit(73);
    }
    throw error;
  }
  fs.writeFileSync(path.join(resultRoot, 'ATTEMPT-STARTED.txt'), `${startedAt}\n`);
  mkdirp(workRoot);
  const logsRoot = path.join(resultRoot, 'logs'); mkdirp(logsRoot);

  const gh = resolveExecutable(['/opt/homebrew/bin/gh','/usr/local/bin/gh','/usr/bin/gh'], ['--version']);
  if (!gh) fail('GITHUB_AUTH_UNAVAILABLE', 'GitHub CLI is unavailable');
  const auth = run(gh, ['auth','status','--hostname','github.com'], { allowFailure:true, timeout:10000 });
  if ((auth.status ?? 1) !== 0) fail('GITHUB_AUTH_UNAVAILABLE', 'GitHub authentication unavailable', { stderr:tail(auth.stderr) });
  exactRemoteMain(gh, SDK_REPO, SDK_HEAD);
  exactRemoteMain(gh, VEX_REPO, VEX_HEAD);
  exactRemoteMain(gh, ANDROID_REPO, ANDROID_HEAD);

  setPhase('PRECHECK_MAC_TAILSCALE');
  tailscaleBin = resolveExecutable([
    '/opt/homebrew/bin/tailscale','/usr/local/bin/tailscale','/usr/bin/tailscale',
    '/Applications/Tailscale.app/Contents/MacOS/tailscale','/Applications/Tailscale.app/Contents/MacOS/Tailscale'
  ], ['version']);
  if (!tailscaleBin) fail('TAILSCALE_CLI_UNAVAILABLE', 'Tailscale CLI is unavailable on the Mac host');
  const tailscaleVersion = run(tailscaleBin, ['version'], { code:'TAILSCALE_CLI_UNAVAILABLE' }).stdout.trim();
  const versionMatch = tailscaleVersion.match(/(\d+)\.(\d+)/u);
  if (!versionMatch || +versionMatch[1] < 1 || (+versionMatch[1] === 1 && +versionMatch[2] < 52)) {
    fail('TAILSCALE_CLI_UNAVAILABLE', `Tailscale CLI is too old for current Serve syntax: ${tailscaleVersion}`);
  }
  const tailStatus = await ensureTailnetRunning();
  await recoverA008ServeIfPresent(tailStatus.dnsName);
  const serveStatusBefore = readServeStatusJson();
  const serveConfigBefore = run(tailscaleBin, ['serve','get-config','--all'], { allowFailure:true, timeout:10000 });
  for (const candidate of [8443,10000]) {
    if (
      !serveStatusPortPresent(serveStatusBefore, candidate)
      && !portAppears(`${serveConfigBefore.stdout}\n${serveConfigBefore.stderr}`, candidate)
    ) {
      tailscalePort = candidate;
      break;
    }
  }
  if (!tailscalePort) fail('TAILSCALE_HTTPS_PORT_UNAVAILABLE', 'Tailscale Serve ports 8443 and 10000 are already represented in current Serve configuration');
  const origin = `https://${tailStatus.dnsName}:${tailscalePort}`;

  setPhase('PRECHECK_ANDROID_DEVICE');
  const androidSdk = findAndroidSdk();
  if (!androidSdk) fail('ANDROID_SDK_UNAVAILABLE', 'Android SDK/platform-tools unavailable');
  adb = path.join(androidSdk, 'platform-tools', 'adb');
  const javaHomeProbe = fs.existsSync('/usr/libexec/java_home') ? run('/usr/libexec/java_home', [], { allowFailure:true }) : null;
  const env = { ...process.env, ANDROID_HOME:androidSdk, ANDROID_SDK_ROOT:androidSdk };
  if (javaHomeProbe && (javaHomeProbe.status ?? 1) === 0) env.JAVA_HOME = javaHomeProbe.stdout.trim();
  env.PATH = `${path.join(androidSdk,'platform-tools')}:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:${process.env.PATH ?? ''}`;
  let devices = parseDevices(run(adb, ['devices','-l'], { env, code:'ADB_UNAVAILABLE' }).stdout);
  if (devices.length === 0) {
    console.error(
      'VCS04_PHONE_ACTION: no authorized Android device is currently visible to ADB. ' +
      'Connect the intended phone over USB, keep it unlocked, and approve USB debugging if Android asks. This command will wait.',
    );
    const anyDeadline = Date.now() + 20 * 60 * 1000;
    while (Date.now() < anyDeadline) {
      run(adb, ['start-server'], { env, allowFailure:true, timeout:10000 });
      devices = parseDevices(run(adb, ['devices','-l'], { env, allowFailure:true, timeout:10000 }).stdout);
      if (devices.length > 0) break;
      await sleep(1000);
    }
  }
  if (devices.length !== 1) fail('ANDROID_DEVICE_COUNT_INVALID', `Expected exactly one authorized Android device, observed ${devices.length}`, { devices });
  serial = devices[0].serial;
  await waitForAdbReconnect(adb, serial, env, { reason:'initial device selection' });
  const androidTailnet = await ensureAndroidTailnetPrerequisite(
    adb,
    serial,
    env,
    tailStatus.dnsName,
  );

  const sdkDir = path.join(workRoot, 'Vextreme-SDK');
  const vexDir = path.join(workRoot, 'VexLife');
  const androidDir = path.join(workRoot, 'VexLife-Android');

  setPhase('CLONE_SDK');
  cloneExact(gh, SDK_REPO, SDK_HEAD, SDK_TREE, sdkDir, EXPECTED_BLOBS.sdk);
  emitProgress('CHECKPOINT', { repo:'SDK', state:'EXACT' });

  setPhase('CLONE_VEXLIFE');
  cloneExact(gh, VEX_REPO, VEX_HEAD, VEX_TREE, vexDir, EXPECTED_BLOBS.vex);
  emitProgress('CHECKPOINT', { repo:'VexLife', state:'EXACT' });

  setPhase('CLONE_ANDROID');
  cloneExact(gh, ANDROID_REPO, ANDROID_HEAD, ANDROID_TREE, androidDir, EXPECTED_BLOBS.android);
  emitProgress('CHECKPOINT', { repo:'Android', state:'EXACT' });

  setPhase('BUILD_ANDROID_APKS');
  const gradle = await runAsyncCaptured(path.join(androidDir,'gradlew'), ['--no-daemon','--no-configuration-cache','--console=plain',':app:assembleDebug',':app:assembleDebugAndroidTest'], { cwd:androidDir, env, code:'ANDROID_LIVED_BUILD_FAILED', timeout:720000, maxBuffer:96*1024*1024 });
  fs.writeFileSync(path.join(logsRoot,'android-build.log'), safeString(gradle.stdout)+safeString(gradle.stderr));
  const mainApk = path.join(androidDir,'app','build','outputs','apk','debug','app-debug.apk');
  const testApk = path.join(androidDir,'app','build','outputs','apk','androidTest','debug','app-debug-androidTest.apk');
  if (!fs.existsSync(mainApk) || !fs.existsSync(testApk)) fail('ANDROID_APK_MISSING', 'Expected debug/test APKs were not formed');
  setPhase('INSTALL_ANDROID_APKS');
  run(adb, ['-s',serial,'install','-r','-g',mainApk], { env, code:'ANDROID_APP_INSTALL_FAILED', timeout:120000 });
  run(adb, ['-s',serial,'install','-r','-g',testApk], { env, code:'ANDROID_TEST_APK_INSTALL_FAILED', timeout:120000 });

  updateHealth({ productEffectsStarted: true });
  setPhase('SEED_ANDROID_PRIVATE_ROUTE_AND_READ_PUBLIC_IDENTITY');
  run(adb, ['-s',serial,'shell','am','force-stop',ANDROID_PACKAGE], { env, allowFailure:true });
  const bridge = await runAsyncCaptured(adb, ['-s',serial,'shell','am','instrument','-w','-r',
    '-e','vexPrivateHomeHostBridge','1',
    '-e','vexPrivateHomeHttpsOrigin',origin,
    '-e','class',HOST_BRIDGE_CLASS,
    ANDROID_TEST_RUNNER], { env, code:'ANDROID_HOST_BRIDGE_FAILED', timeout:120000, maxBuffer:16*1024*1024 });
  const bridgeText = safeString(bridge.stdout)+safeString(bridge.stderr);
  fs.writeFileSync(path.join(logsRoot,'android-host-bridge.log'), bridgeText);
  if (!/INSTRUMENTATION_CODE:\s*-1/u.test(bridgeText) || /FAILURES!!!|INSTRUMENTATION_FAILED/u.test(bridgeText)) fail('ANDROID_HOST_BRIDGE_FAILED', 'Host bridge instrumentation did not complete successfully', { bridge:tail(bridgeText) });
  const identity = parseIdentity(bridgeText);
  effectLedger.androidRoutePersisted = true;

  emitProgress('CHECKPOINT', { androidRouteSeeded:'yes', publicIdentity:'observed' });
  const sdkRequire = createRequire(path.join(sdkDir,'package.json'));
  const { createPrivateHomeGatewayServer } = sdkRequire(path.join(sdkDir,'lib/local-runtime/private-home-gateway-server.js'));
  const trustPort = sdkRequire(path.join(sdkDir,'lib/security/home-bridge-device-possession-trust-port.js'));
  const { resolveHomeSessionAuthority } = sdkRequire(path.join(sdkDir,'lib/local-runtime/home-session-authority.js'));
  const { createPrivateHomeGatewayComposition } = sdkRequire(path.join(sdkDir,'lib/local-runtime/private-home-gateway-composition.js'));
  const homeBridge = await importMjs(vexDir,'src/core/home-bridge.mjs');
  const remoteSessionModule = await importMjs(vexDir,'src/core/home-bridge-remote-authenticated-session.mjs');
  const familySpace = await importMjs(vexDir,'src/core/family-space-store.mjs');
  const familyConversation = await importMjs(vexDir,'src/core/family-conversation.mjs');
  const conversationStore = await importMjs(vexDir,'src/core/conversation-store.mjs');
  const browserBridge = await importMjs(vexDir,'src/core/browser-family-conversation-bridge.mjs');
  const serverCapabilityModule = await importMjs(vexDir,'src/core/server-family-conversation-capability.mjs');
  const familyAuthorityModule = await importMjs(vexDir,'src/core/vex-core-family-session-authority.mjs');

  setPhase('FORM_BOUNDED_HOME_MEMBERSHIP');
  const now0 = Date.now();
  const iso = (offset) => new Date(now0 + offset).toISOString();
  const offer = homeBridge.createPairingOffer({
    pairingRef:'pairing.vcs04.lived.a012', homeNodeRef:HOME_REF, homePublicKey:'home-public-key.vcs04.lived',
    oneTimeNonceHash:crypto.createHash('sha256').update('vcs04-lived-a012').digest('hex'), humanFingerprint:'fingerprint.vcs04.lived.a012',
    requestedCapabilityRefs:[CAPABILITY_REF], expiresAt:iso(30*60*1000)
  });
  const paired = homeBridge.approvePairing({
    offer, principalRef:PRINCIPAL_REF, deviceRef:identity.deviceRef, devicePublicKey:identity.devicePublicKeyBase64Url,
    approvedCapabilityRefs:[CAPABILITY_REF], approvedBy:PRINCIPAL_REF, approvedAt:iso(1000), expectedFingerprint:'fingerprint.vcs04.lived.a012'
  });
  if (paired.state !== 'PAIRED') fail('HOME_MEMBERSHIP_FORMATION_FAILED', `Pairing state ${paired.state}`);
  effectLedger.homeMembershipPerformed = true;
  const membership = paired.membership;
  if (membership.principalRef !== PRINCIPAL_REF || membership.deviceRef !== identity.deviceRef || membership.state !== 'ACTIVE') fail('HOME_MEMBERSHIP_FORMATION_FAILED', 'Membership identity mismatch');
  const lease = homeBridge.issueCapabilityLease({
    leaseRef:'lease.vcs04.lived.a012', membership, requestedCapabilityRefs:[CAPABILITY_REF], projectRefs:['project.vexlife.connected-services'],
    issuedAt:iso(2000), expiresAt:iso(20*60*1000), revocationGeneration:membership.revocationGeneration
  });

  emitProgress('CHECKPOINT', { homeMembership:'ACTIVE', lease:'BOUNDED' });
  setPhase('FORM_TEMPORARY_FAMILY_FIXTURE');
  const livedHomeRequested = path.join(workRoot,'lived-home');
  mkdirp(livedHomeRequested);
  const livedHome = fs.realpathSync.native(livedHomeRequested);
  emitProgress('CHECKPOINT', {
    homePathCanonical:'yes',
    homePathAliasResolved:livedHome !== path.resolve(livedHomeRequested) ? 'yes' : 'no',
  });
  let familyRecord = familySpace.createFamilySpace({
    home:livedHome, spaceRef:SPACE_REF, ownerPrincipalRef:PRINCIPAL_REF, ownerPrincipalBindingRef:'principal-binding.victor',
    familyCompanionLineageRef:COMPANION_REF, observedAt:iso(3000), instanceRef:'instance.vcs04.lived.family-create'
  }).record;
  familyRecord = familySpace.addFamilyMember({
    home:livedHome, spaceRef:SPACE_REF, actorPrincipalRef:PRINCIPAL_REF, principalRef:OTHER_PRINCIPAL_REF,
    principalBindingRef:'principal-binding.bri', expectedRevision:familyRecord.revision, expectedMembershipGeneration:familyRecord.membershipGeneration,
    observedAt:iso(4000), instanceRef:'instance.vcs04.lived.add-bri'
  }).record;
  const channel = familyConversation.createFamilyChannel({
    channelRef:CHANNEL_REF, threadRef:THREAD_REF, kind:'GROUP', familySpaceRecord:familyRecord,
    labelStringRef:'label.vcs04.lived.family', createdAt:iso(5000)
  });
  const materialized = conversationStore.materializeConversationChannel({ home:livedHome, channel, instanceRef:'instance.vcs04.lived.channel', observedAt:iso(5000) });
  if (!['MATERIALIZED','CURRENT','IDEMPOTENT_CURRENT'].includes(materialized.state)) fail('FAMILY_CHANNEL_MATERIALIZATION_FAILED', `state=${materialized.state}`);
  const seeded = browserBridge.appendBrowserFamilyMessage({
    home:livedHome,
    intent:{spaceRef:SPACE_REF,channelRef:CHANNEL_REF,content:SEED_CONTENT,expectedMembershipGeneration:familyRecord.membershipGeneration,idempotencyKey:'vcs04-lived-read-seed-a012'},
    channel, membership, lease, currentRevocationGeneration:membership.revocationGeneration, now:iso(6000), instanceRef:'instance.vcs04.lived.seed-message'
  });
  if (!['APPENDED','IDEMPOTENT_CURRENT'].includes(seeded.state) || seeded.message?.content !== SEED_CONTENT) fail('FAMILY_SEED_MESSAGE_FAILED', `state=${seeded.state}`);

  const remoteSessionOwner = remoteSessionModule.createHomeBridgeRemoteAuthenticatedSessionOwner({
    homeRef:HOME_REF, deviceRef:identity.deviceRef, principalRef:PRINCIPAL_REF,
    ownerSourceReceiptRefs:['receipt.vcs04.remote-session-owner.current']
  });
  const resolveVexCoreAuthority = async (context) => {
    const authenticatedSession = remoteSessionOwner.resolve({ sessionRef: context.request.sessionRef });
    const security717 = {
      homeRef:HOME_REF, deviceRef:identity.deviceRef, membershipRef:membership.membershipRef,
      authenticationReceiptRef:'receipt.vcs04.security.authentication.current', authorizationReceiptRef:'receipt.vcs04.security.authorization.current',
      leaseRef:lease.leaseRef, leaseExpiresAt:lease.expiresAt, accessState:'LEASE_ACTIVE', currentRevocationGeneration:membership.revocationGeneration,
      effectiveCapabilityRefs:[CAPABILITY_REF], standingHomeAuthority:false,
      sourceReceiptRefs:['receipt.vcs04.security717.current'], currentnessRefs:['currentness.vcs04.security717.current']
    };
    const safetyReadback = {
      stateDigest:'digest.vcs04.safety.current', sequence:1, evaluationRef:'evaluation.vcs04.safety.current',
      homeRef:HOME_REF, deviceRef:identity.deviceRef, recoveryState:'NOT_NEEDED',
      sourceReceiptRefs:['receipt.vcs04.safety.current'], currentnessRefs:['currentness.vcs04.safety.current']
    };
    return resolveHomeSessionAuthority({
      authenticatedSession, security717, safetyReadback, homeBridgeMembership:membership, homeBridgeLease:lease,
      currentRevocationGeneration:membership.revocationGeneration, now:new Date().toISOString(), requiredCapabilityRefs:[CAPABILITY_REF]
    });
  };
  const acceptedFamilyResolver = familyAuthorityModule.createVexCoreFamilySessionAuthorityResolver({ resolveVexCoreAuthority });
  const resolveFamilyAuthority = async (input) => { authorityOperations.push({operation:input.operation,target:input.target}); return acceptedFamilyResolver(input); };

  const actualFamilyCapability = serverCapabilityModule.createServerFamilyConversationCapability({
    home:livedHome, nowProvider:()=>new Date().toISOString(), instanceRef:'instance.vcs04.lived.server-family',
    appendFamilyMessage:browserBridge.appendBrowserFamilyMessage,
    readFamilyConversation:browserBridge.readBrowserFamilyConversation,
    readFamilyThreadHistory:browserBridge.readBrowserFamilyThreadHistory,
    listFamilyChannels:browserBridge.listBrowserFamilyChannels,
    readChannelBinding:conversationStore.readConversationChannelBinding,
    listChannelBindings:conversationStore.listConversationChannelBindings
  });
  const serverFamilyConversationCapability = {
    bootstrap(input) { familyOperations.push({kind:'BOOTSTRAP'}); return actualFamilyCapability.bootstrap(input); },
    perform(input) { familyOperations.push({kind:'PERFORM',operation:input.operation}); return actualFamilyCapability.perform(input); }
  };

  const binding = (repositoryRef, acceptedCommit, sourcePath, contentSha, suffix) => ({
    repositoryRef, acceptedCommit, sourcePath, contentSha, currentnessRef:`currentness.vcs04.lived.${suffix}`
  });
  const sourceBindings = {
    gatewayServer:binding(SDK_REPO,SDK_HEAD,'lib/local-runtime/private-home-gateway-server.js',EXPECTED_BLOBS.sdk['lib/local-runtime/private-home-gateway-server.js'],'gateway-server'),
    devicePossessionTrustPort:binding(SDK_REPO,SDK_HEAD,'lib/security/home-bridge-device-possession-trust-port.js',EXPECTED_BLOBS.sdk['lib/security/home-bridge-device-possession-trust-port.js'],'device-possession'),
    homeBridgeMembershipContract:binding(VEX_REPO,VEX_HEAD,'src/core/home-bridge.mjs',EXPECTED_BLOBS.vex['src/core/home-bridge.mjs'],'home-bridge'),
    remoteAuthenticatedSessionOwner:binding(VEX_REPO,VEX_HEAD,'src/core/home-bridge-remote-authenticated-session.mjs',EXPECTED_BLOBS.vex['src/core/home-bridge-remote-authenticated-session.mjs'],'remote-session'),
    homeBridgeSessionAuthority:binding(VEX_REPO,VEX_HEAD,'src/core/home-bridge-session-authority.mjs',EXPECTED_BLOBS.vex['src/core/home-bridge-session-authority.mjs'],'home-session-authority'),
    vexCoreHomeSessionAuthority:binding(SDK_REPO,SDK_HEAD,'lib/local-runtime/home-session-authority.js',EXPECTED_BLOBS.sdk['lib/local-runtime/home-session-authority.js'],'vex-core-home-authority'),
    familyAuthorityResolver:binding(VEX_REPO,VEX_HEAD,'src/core/vex-core-family-session-authority.mjs',EXPECTED_BLOBS.vex['src/core/vex-core-family-session-authority.mjs'],'family-authority'),
    serverFamilyConversationCapability:binding(VEX_REPO,VEX_HEAD,'src/core/server-family-conversation-capability.mjs',EXPECTED_BLOBS.vex['src/core/server-family-conversation-capability.mjs'],'family-capability')
  };
  emitProgress('CHECKPOINT', { familyFixture:'READY', seedMessage:'DURABLE_TEMP_HOME' });
  setPhase('FORM_PRIVATE_GATEWAY_COMPOSITION');
  composition = createPrivateHomeGatewayComposition({
    gatewayServerFactory:({handlers,limits,logger})=>createPrivateHomeGatewayServer({handlers,limits,logger}),
    devicePossessionTrustPort:trustPort, remoteAuthenticatedSessionOwner:remoteSessionOwner,
    resolveDeviceMembership:async ({deviceRef})=>{
      if (deviceRef !== identity.deviceRef) fail('HOME_MEMBERSHIP_IDENTITY_MISMATCH','Gateway requested another deviceRef');
      return {state:'CURRENT',value:membership,sourceReceiptRefs:['receipt.vcs04.membership.current'],currentnessRefs:['currentness.vcs04.membership.current']};
    },
    resolveFamilyAuthority, serverFamilyConversationCapability, sourceBindings,
    gatewayLogger:(event)=>gatewayEvents.push(event)
  });
  const listening = await composition.start({port:0});
  emitProgress('CHECKPOINT', { gateway:'LOOPBACK_LISTENING', port:listening.port });
  if (listening.publicExposure !== false || listening.standingHomeAuthority !== false || listening.host !== '127.0.0.1') fail('GATEWAY_BOUNDARY_VIOLATION','Gateway did not start loopback/private');

  const serveLogPath = path.join(logsRoot,'tailscale-serve.log');
  fs.writeFileSync(serveLogPath, '');
  const statusUrl = `${origin}/v1/home/gateway/status`;
  const serveResult = await establishForegroundServe({
    serveLogPath,
    statusUrl,
    localPort:listening.port,
    dnsName:tailStatus.dnsName,
    tailscaleIpv4:tailStatus.tailscaleIpv4,
  });
  if (!serveStatusOwnsExactProxy(
    serveResult.serveStatus,
    tailStatus.dnsName,
    tailscalePort,
    `http://127.0.0.1:${listening.port}`,
  )) {
    fail(
      'TAILSCALE_SERVE_UNAVAILABLE',
      'Serve configuration was not exact at the point Android traffic was admitted',
    );
  }
  effectLedger.networkServePerformed = true;
  updateHealth({ networkProof:'PRIVATE_SERVE_CONFIG_ACTIVE_AWAIT_ANDROID_TRAFFIC' }, { emit: true });
  emitProgress('CHECKPOINT', {
    privateServe:'CONFIG_ACTIVE',
    publicExposure:'false',
    acceptanceOracle:'Android_private_gateway_routes',
  });
  const serveTruthDuring = readServeStatusJson();
  if (serveStatusAllowsFunnel(serveTruthDuring, tailStatus.dnsName, tailscalePort)) {
    fail(
      'PUBLIC_FUNNEL_EXPOSURE_DETECTED',
      'Exact active private Serve host:port unexpectedly has AllowFunnel=true',
    );
  }
  emitProgress('CHECKPOINT', {
    allowFunnel:'false',
    publicExposure:'false',
  });

  run(adb,['-s',serial,'shell','input','keyevent','KEYCODE_WAKEUP'],{env,allowFailure:true});
  run(adb,['-s',serial,'shell','wm','dismiss-keyguard'],{env,allowFailure:true});
  run(adb,['-s',serial,'shell','am','force-stop',ANDROID_PACKAGE],{env,allowFailure:true});
  const started = run(adb,['-s',serial,'shell','am','start','-W','-n',`${ANDROID_PACKAGE}/.MainActivity`],{env,code:'ANDROID_APP_LAUNCH_FAILED',timeout:30000});
  fs.writeFileSync(path.join(logsRoot,'android-app-start.log'),safeString(started.stdout)+safeString(started.stderr));

  setPhase('WAIT_HOME_SCREEN');
  const homeUiPath = path.join(resultRoot,'ANDROID-HOME-UI.xml');
  const homeSeen = await waitForUiText(adb,serial,'Family Conversation',homeUiPath,20000);
  if (!homeSeen.found) fail('ANDROID_UI_NOT_READY_OR_LOCKED','Family Conversation Home doorway was not visible; device may be locked or UI not ready',{ui:tail(homeSeen.xml,5000)});
  const tapX = Math.floor((homeSeen.found.x1+homeSeen.found.x2)/2), tapY = Math.floor((homeSeen.found.y1+homeSeen.found.y2)/2);
  run(adb,['-s',serial,'shell','input','tap',String(tapX),String(tapY)],{env,code:'ANDROID_UI_TAP_FAILED'});

  setPhase('WAIT_CANONICAL_FAMILY_READ');
  const finalUiPath = path.join(resultRoot,'ANDROID-FAMILY-CONVERSATION-UI.xml');
  const messageSeen = await waitForUiText(adb,serial,SEED_CONTENT,finalUiPath,35000);
  const finalXml = messageSeen.xml;
  if (!messageSeen.found) {
    const routeUnavailable = finalXml.includes('Private Home connection is not available yet.');
    const readUnavailable = finalXml.includes('The current Family conversation could not be refreshed.');
    if (routeUnavailable || readUnavailable) {
      const anyGatewayRequest = gatewayEvents.length > 0;
      if (!anyGatewayRequest) {
        fail('ANDROID_TAILNET_ROUTE_UNREACHABLE','Installed Family Conversation Screen reported private route/read unavailable before any gateway request was observed',{routeUnavailable,readUnavailable,ui:tail(finalXml,8000),gatewayEvents,familyOperations,authorityOperations});
      }
      fail('LIVED_GATEWAY_INTEGRATION_FAILED','Installed Family Conversation Screen reported unavailable after the gateway observed traffic',{routeUnavailable,readUnavailable,ui:tail(finalXml,8000),gatewayEvents,familyOperations,authorityOperations});
    }
    fail('INSTALLED_CANONICAL_READ_NOT_OBSERVED','Canonical seed message was not visible in installed Family Conversation Screen',{ui:tail(finalXml,8000),gatewayEvents,familyOperations,authorityOperations});
  }
  if (!finalXml.includes('Family Conversation')) fail('INSTALLED_CONVERSATION_SCREEN_NOT_OBSERVED','Family Conversation title absent from final UI');

  const screenshot = runBuffer(adb,['-s',serial,'exec-out','screencap','-p'],{env,code:'ANDROID_SCREENSHOT_FAILED',timeout:15000});
  const screenshotPath=path.join(resultRoot,'ANDROID-FAMILY-CONVERSATION.png'); fs.writeFileSync(screenshotPath,screenshot.stdout);
  const observedRoutes = gatewayEvents.filter((e)=>e.event==='request-completed').map((e)=>e.routeRef);
  for (const expected of ['home.session.challenge','home.session.establish','home.family.bootstrap','home.family.conversation']) {
    if (!observedRoutes.includes(expected)) fail('GATEWAY_ROUTE_EVIDENCE_INCOMPLETE',`Missing completed route ${expected}`,{observedRoutes,gatewayEvents});
  }
  updateHealth({ networkProof:'PRIVATE_HTTPS_GATEWAY_TRAFFIC_OBSERVED' }, { emit:true });
  emitProgress('CHECKPOINT', {
    privateGatewayTraffic:'OBSERVED',
    routeCount:observedRoutes.length,
  });
  if (!familyOperations.some((x)=>x.operation==='READ_THREAD_HISTORY')) fail('FAMILY_HISTORY_OPERATION_NOT_OBSERVED','READ_THREAD_HISTORY not observed', {familyOperations});
  if (!authorityOperations.some((x)=>x.operation==='READ_THREAD_HISTORY')) fail('FAMILY_AUTHORITY_OPERATION_NOT_OBSERVED','Family authority resolver did not observe READ_THREAD_HISTORY',{authorityOperations});
  const remoteStatus=remoteSessionOwner.status();
  if (remoteStatus.currentSessionCount < 1) fail('REMOTE_SESSION_NOT_CURRENT','Remote authenticated session was not current after installed read',remoteStatus);

  setPhase('VERIFY_LIVED_EVIDENCE');
  liveEvidence = {
    sourceCurrentness:{sdk:{head:SDK_HEAD,tree:SDK_TREE},vexlife:{head:VEX_HEAD,tree:VEX_TREE},android:{head:ANDROID_HEAD,tree:ANDROID_TREE}},
    tailscale:{version:tailscaleVersion,dnsName:tailStatus.dnsName,httpsPort:tailscalePort,origin,serveMode:'FOREGROUND_TAILNET_ONLY',funnelPortObserved:false,autoRecoveryPerformed:tailStatus.autoRecoveryPerformed===true,initiallyRunning:tailscaleWasRunning===true,androidPackageInstalled:androidTailnet.packageInstalled===true,androidAssistedSetup:androidTailnet.assistedSetup===true,adbReconnectAware:androidTailnet.adbReconnectAware===true,shellPingGateUsed:false,reachabilityProof:androidTailnet.reachabilityProof,connectivityDiagnosticSha256:androidTailnet.connectivityDiagnosticSha256},
    android:{serial,deviceLine:devices[0].line,publicIdentity:{deviceRef:identity.deviceRef,devicePublicKeyFingerprintRef:identity.devicePublicKeyFingerprintRef,publicKeySha256:crypto.createHash('sha256').update(Buffer.from(identity.devicePublicKeyBase64Url,'base64url')).digest('hex')},freshProcessLaunch:true,homeDoorwayObserved:true,familyScreenObserved:true,seedMessageObserved:true},
    homeAuthority:{homeRef:HOME_REF,principalRef:PRINCIPAL_REF,membershipRef:membership.membershipRef,membershipHash:membership.membershipHash,leaseRef:lease.leaseRef,revocationGeneration:membership.revocationGeneration,standingHomeAuthority:false},
    family:{spaceRef:SPACE_REF,threadRef:THREAD_REF,channelRef:CHANNEL_REF,membershipGeneration:familyRecord.membershipGeneration,seedMessageRef:seeded.message.messageRef,seedContentSha256:sha256Bytes(Buffer.from(SEED_CONTENT,'utf8'))},
    gateway:{listening,completedRouteRefs:observedRoutes,events:gatewayEvents,familyOperations,authorityOperations,remoteSessionStatus:remoteStatus},
    checkpoints:{L1_remoteDevicePossession:true,L2_remoteAuthenticatedSession:true,L3_privateBoundedGateway:true,L4_currentHomeFamilyAuthority:true,L5_canonicalConversationRead:true,L6_durableHumanSend:false,L7_companionTurn:false,L8_failureSeparation:false,L9_sameSessionAndroidObservation:false,L10_actualAndroidRestart:false,L11_noDuplicates:false,L12_sourceLifecycleCurrent:true}
  };
  disposition='PASS'; exitCode=0;
}

async function cleanup() {
  setPhase('CLEANUP');
  const events=[];
  try { if (adb && serial) run(adb,['-s',serial,'shell','am','force-stop',ANDROID_PACKAGE],{allowFailure:true,timeout:10000}); events.push({effect:'android-app-force-stop',state:'ATTEMPTED'}); } catch(e){events.push({effect:'android-app-force-stop',state:'FAILED',error:e.message});}
  try { if (tailscaleChild) await stopChild(tailscaleChild); events.push({effect:'tailscale-serve-foreground-stop',state:'ATTEMPTED'}); } catch(e){events.push({effect:'tailscale-serve-foreground-stop',state:'FAILED',error:e.message});}
  try {
    if (tailscaleBin && tailscalePort) {
      const status=run(tailscaleBin,['serve','status','--json'],{allowFailure:true,timeout:10000});
      if (portAppears(safeString(status.stdout)+safeString(status.stderr),tailscalePort)) {
        const off=run(tailscaleBin,['serve','--yes',`--https=${tailscalePort}`,'off'],{allowFailure:true,timeout:15000});
        events.push({effect:'tailscale-serve-exact-port-off-fallback',state:(off.status??1)===0?'PASS':'FAILED',status:off.status});
      } else events.push({effect:'tailscale-serve-exact-port-off-fallback',state:'NOT_NEEDED'});
    }
  } catch(e){events.push({effect:'tailscale-serve-exact-port-off-fallback',state:'FAILED',error:e.message});}
  try { if (composition) await composition.close(); events.push({effect:'gateway-close',state:'PASS'}); } catch(e){events.push({effect:'gateway-close',state:'FAILED',error:e.message});}
  try {
    if (tailscaleBin && tailscaleConnectionBroughtUp && tailscaleWasRunning === false) {
      const down = run(tailscaleBin, ['down'], { allowFailure:true, timeout:20000 });
      events.push({effect:'tailscale-original-stopped-state-restore',state:(down.status??1)===0?'PASS':'FAILED',status:down.status});
    } else {
      events.push({effect:'tailscale-original-stopped-state-restore',state:'NOT_NEEDED'});
    }
  } catch(e){events.push({effect:'tailscale-original-stopped-state-restore',state:'FAILED',error:e.message});}
  cleanupEvidence={events,androidRoutePersistence:'PRESERVED_REACHABILITY_ONLY',temporaryHomeAuthority:'DESTROYED_WITH_WORK_ROOT_AFTER_RETURN_FORMATION',tailscaleOriginalRunningState:tailscaleWasRunning,tailscaleAutoRecoveryPerformed:tailscaleConnectionBroughtUp};
}

function formReturnZip() {
  setPhase('RETURN_FORMATION');
  completedAt = new Date().toISOString();
  const status = {
    schemaVersion:'vexlocalbridge.vcs04-installed-read-lived-return/v1', continuity:CONTINUITY,
    taskRef:TASK_REF,attemptRef:ATTEMPT_REF,correlationRef:CORRELATION_REF,startedAt,completedAt,disposition,exitCode,
    firstSubstantiveFailure:firstFailure,sourceMutationPerformed:false,remoteRepositoryMutationPerformed:false,
    homeMembershipMutationPerformed:effectLedger.homeMembershipPerformed,networkServeEffectPerformed:effectLedger.networkServePerformed,
    publicFunnelEffectPerformed:false,androidRoutePersistencePerformed:effectLedger.androidRoutePersisted,
    sendEffectPerformed:false,modelEffectPerformed:false,restartProofPerformed:false,
    inputPackageSha256:inputSha,
  };
  writeJson(path.join(resultRoot,'STATUS.json'),status);
  writeJson(path.join(resultRoot,'SERVE-STATE.json'),{
    schemaVersion:'vexlocalbridge.vcs04-serve-state/v1',
    attempted:networkServeAttempted,
    activeEffectPerformed:effectLedger.networkServePerformed,
    enablementPrompted:serveEnablementPrompted,
    enableUrlObserved:Boolean(serveEnableUrl),
    publicFunnelEffectPerformed:false,
    predecessorForegroundServeRecoveryPerformed:predecessorServeRecoveryPerformed,
    predecessorForegroundServeRecoveryState:predecessorServeRecoveryState,
    publicExposureTruth:'ServeConfig.AllowFunnel exact host:port',
  });
  writeJson(path.join(resultRoot,'EVIDENCE.json'),liveEvidence);
  writeJson(path.join(resultRoot,'CLEANUP.json'),cleanupEvidence);
  writeJson(path.join(resultRoot,'COMMANDS.json'),commandLog);
  const summary = [
    `continuity=${CONTINUITY}`,`taskRef=${TASK_REF}`,`attemptRef=${ATTEMPT_REF}`,`disposition=${disposition}`,
    `Android.main=${ANDROID_HEAD}`,`VexLife.main=${VEX_HEAD}`,`SDK.main=${SDK_HEAD}`,
    `L1_remoteDevicePossession=${liveEvidence?.checkpoints?.L1_remoteDevicePossession===true?'PASS':'NOT_PROVEN'}`,
    `L2_remoteAuthenticatedSession=${liveEvidence?.checkpoints?.L2_remoteAuthenticatedSession===true?'PASS':'NOT_PROVEN'}`,
    `L3_privateBoundedGateway=${liveEvidence?.checkpoints?.L3_privateBoundedGateway===true?'PASS':'NOT_PROVEN'}`,
    `L4_currentHomeFamilyAuthority=${liveEvidence?.checkpoints?.L4_currentHomeFamilyAuthority===true?'PASS':'NOT_PROVEN'}`,
    `L5_canonicalConversationRead=${liveEvidence?.checkpoints?.L5_canonicalConversationRead===true?'PASS':'NOT_PROVEN'}`,
    `firstFailure=${firstFailure?.code??'NONE'}`,
    `publicFunnelEffectPerformed=false`,`sendEffectPerformed=false`,`modelEffectPerformed=false`,`restartProofPerformed=false`,
  ].join('\n')+'\n';
  fs.writeFileSync(path.join(resultRoot,'SUMMARY.txt'),summary);
  const files = [];
  function inventory(dir, prefix='') {
    for (const name of fs.readdirSync(dir).sort()) {
      const rel = prefix ? `${prefix}/${name}` : name;
      if (rel === 'RETURN-MANIFEST.json') continue;
      const full = path.join(dir, name);
      const st = fs.statSync(full);
      if (st.isDirectory()) inventory(full, rel);
      else if (st.isFile()) files.push({path:rel,bytes:st.size,sha256:sha256File(full)});
    }
  }
  inventory(resultRoot);
  writeJson(path.join(resultRoot,'RETURN-MANIFEST.json'),{
    schemaVersion:'vexlocalbridge.return-manifest/v1',continuity:CONTINUITY,taskRef:TASK_REF,attemptRef:ATTEMPT_REF,correlationRef:CORRELATION_REF,
    disposition,inputPackageSha256:inputSha,memberCountExcludingManifest:files.length,files
  });
  const baseName=`RETURN-vexlife-connected-services-vcs04-installed-read-lived-a012`;
  const tempZip=path.join(canonicalParent,`${baseName}.forming.zip`);
  if (fs.existsSync(tempZip)) fs.rmSync(tempZip,{force:true});
  run('/usr/bin/zip',['-q','-r',tempZip,'.'],{cwd:resultRoot,code:'RETURN_ZIP_FORMATION_FAILED',timeout:60000});
  const digest=sha256File(tempZip);
  const finalZip=path.join(canonicalParent,`${baseName}--sha256-${digest}.zip`);
  fs.renameSync(tempZip,finalZip);
  emitProgress('COMPLETE', { disposition, returnSha256:digest });
  stopHeartbeat();
  return {finalZip,digest};
}

try {
  await main();
} catch (error) {
  const classification=classify(error);
  firstFailure={code:error?.code??'UNKNOWN_FAILURE',classification,message:error?.message??String(error),details:error?.details??null};
  disposition = classification==='environment' ? 'USER_ACTION_REQUIRED' : 'SAFE_FAILURE';
  exitCode = classification==='environment' ? 64 : 69;
} finally {
  await cleanup();
  try {
    const formed=formReturnZip();
    console.log(JSON.stringify({state:'RETURN_FORMED',disposition,exitCode,returnZip:formed.finalZip,returnSha256:formed.digest,firstFailure},null,2));
    try { run('/usr/bin/open',['-R',formed.finalZip],{allowFailure:true,timeout:10000}); } catch {}
  } catch (zipError) {
    console.error(`RETURN_FORMATION_FAILED:${zipError.message}`);
    process.exit(91);
  }
  fs.rmSync(tempRoot,{recursive:true,force:true});
  process.exit(exitCode);
}