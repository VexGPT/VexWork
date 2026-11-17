import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const HARNESS = path.join(ROOT, 'projects/vexlife-memory-depth-exploration/pressure-harness');
const RELAY = path.join(HARNESS, 'relay');

function run(script, args = []) {
  const result = spawnSync(process.execPath, [path.join(RELAY, script), ...args], {
    cwd: ROOT,
    encoding: 'utf8',
    env: { ...process.env },
  });
  if (result.status !== 0) {
    throw new Error([
      script + ' failed',
      'stdout:',
      result.stdout,
      'stderr:',
      result.stderr,
    ].join('\n'));
  }
  return result.stdout.trim();
}

function scenarioSha() {
  return crypto
    .createHash('sha256')
    .update(fs.readFileSync(path.join(HARNESS, 'scenarios/depth-continuity-v1.json')))
    .digest('hex');
}

function binding() {
  const head = '1'.repeat(40);
  const tree = '2'.repeat(40);
  return {
    schemaVersion: 'vexwork.continuity-pressure-relay-binding/v1',
    bindingRef: 'binding.test.continuity-pressure',
    experimentRef: 'experiment.test.continuity-pressure',
    lane: {
      entryClass: 'SAME_LANE_SUCCESSOR',
      laneRef: 'lane.test.continuity-pressure',
      parentRootRef: 'root.test',
      workRef: 'work.vexlife.memory-depth-exploration.measurement',
      claimRef: 'claim.test',
      returnRouteRef: 'return.test',
      ownerRef: 'owner.test',
      rootHubRef: 'hub.test',
    },
    role: {
      activeRole: 'OPERATIONS',
      roleRef: 'role.operations.test',
      instanceRef: 'instance.test',
      occupancyRef: 'occupancy.test',
      providerBindingRef: 'provider.test',
      threadRef: 'thread.test',
      authorityEnvelopeRef: 'authority-envelope.test',
    },
    capabilities: {
      platformGitHubRead: 'AVAILABLE',
      platformGitHubWrite: 'AVAILABLE',
    },
    execution: {
      hostProfile: 'macos-victor',
      executionSurface: 'MACOS_ZIP_BASH',
      ttlMs: 60_000,
    },
    workspace: {
      mode: 'RUN_ROOT',
      projectRef: 'project.test',
      projectPath: 'continuity-pressure',
      createRoot: false,
      createProjectPath: true,
    },
    repository: {
      repositoryRef: 'primary',
      mode: 'EXISTING_PATH',
      nameWithOwner: 'VexGPT/VexLife-Prod',
      localPath: 'repositories/vexlife-prod',
      remote: 'origin',
      baseBranch: 'main',
      acceptedBase: head,
      expectedHead: head,
      expectedTree: tree,
      branch: 'test/continuity-pressure',
      expectedRemoteUrl: 'https://github.com/VexGPT/VexLife-Prod.git',
      allowedPaths: ['tools/continuity-pressure', 'build/continuity-pressure'],
    },
    authority: {
      authorityRef: 'authority.test',
      grantedEffects: ['READ_REPOSITORY', 'CHECK_STATE', 'RUN_LOCAL_COMMAND', 'FORM_RESULT'],
      heldEffects: ['WRITE_SOURCE', 'CREATE_COMMIT', 'PUSH_BRANCH', 'CREATE_PULL_REQUEST'],
      allowedExecutables: ['node'],
      allowedEnvironment: [],
    },
    source: {
      sourceSetRef: 'source-set.test',
      sourceVersionRef: 'source-version.test',
      overlapEvidenceRef: 'overlap.test',
      activeConflictState: 'NONE',
      candidateState: 'EXACT',
      candidateHead: head,
      candidateTree: tree,
    },
    adapter: {
      command: 'node',
      argsPrefix: ['tools/continuity-pressure/run.mjs'],
      scenarioPath: 'tools/continuity-pressure/scenarios/depth-continuity-v1.json',
      resultDir: 'build/continuity-pressure',
    },
    scenario: {
      scenarioRef: 'scenario.vexlife.continuity-pressure.depth-continuity.v1',
      sharedSourcePath:
        'projects/vexlife-memory-depth-exploration/pressure-harness/scenarios/depth-continuity-v1.json',
      sharedSha256: scenarioSha(),
    },
  };
}

test('project front door routes remembered aliases to the shared conversational-boundaries harness', () => {
  const projectReadme = fs.readFileSync(
    path.join(ROOT, 'projects/vexlife-memory-depth-exploration/README.md'),
    'utf8',
  );
  const index = JSON.parse(fs.readFileSync(path.join(HARNESS, 'index.json'), 'utf8'));

  assert.match(projectReadme, /Conversational Boundaries \/ memory stress test/);
  for (const alias of ['memory stress test', 'test the memory', 'stress test README', 'rollover test']) {
    assert.equal(index.aliases.includes(alias), true, alias);
  }
  assert.equal(
    index.rootEntry,
    'projects/vexlife-memory-depth-exploration/pressure-harness/README.md',
  );
});

test('full stage plan preserves effect-class routing and does not flatten live model work into repository operations', () => {
  const plan = JSON.parse(run('plan-stages.mjs', ['--mode', 'full']));
  assert.equal(plan.resolvedMode, 'full');
  assert.equal(plan.routeClass, 'HOST_SEMANTIC_MODEL_RUNTIME');
  assert.deepEqual(
    plan.stages.map((stage) => stage.stageRef),
    ['projection', 'pressure', 'probe', 'analyze'],
  );
  assert.equal(plan.stages[0].route, 'adapter.vexrelay.repository/v2');
  assert.equal(plan.stages[1].route, 'adapter.vexlocalbridge.direct-host-effect');
  assert.equal(plan.stages[2].route, 'adapter.vexlocalbridge.direct-host-effect');
  assert.equal(plan.stages[3].route, 'adapter.vexrelay.repository/v2');
});

test('human memory-stress alias resolves to the reusable quick mode instead of forming a new test', () => {
  const plan = JSON.parse(run('plan-stages.mjs', ['--mode', 'memory stress test']));
  assert.equal(plan.resolvedMode, 'quick');
  assert.deepEqual(plan.stages.map((stage) => stage.stageRef), ['pressure', 'probe', 'analyze']);
});

test('host-stage request binds live-model effect, scratch isolation and shared result contract', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'vexwork-continuity-pressure-host-'));
  try {
    const input = path.join(root, 'binding.json');
    const output = path.join(root, 'request.json');
    fs.writeFileSync(input, JSON.stringify(binding(), null, 2));

    run('form-host-stage-request.mjs', [
      '--mode', 'full',
      '--binding', input,
      '--output', output,
    ]);

    const request = JSON.parse(fs.readFileSync(output, 'utf8'));
    assert.equal(request.effectClass, 'HOST_SEMANTIC_MODEL_RUNTIME');
    assert.equal(request.selectedAdapter, 'adapter.vexlocalbridge.direct-host-effect');
    assert.equal(request.privacy.canonicalVictorHomeMutationAllowed, false);
    assert.equal(request.privacy.rawReasoningPersistenceAllowed, false);
    assert.equal(request.privacy.scratchHomePolicy, 'DELETE_AFTER_BUNDLE');
    assert.equal(request.resultContract.schemaVersion, 'vexlife.continuity-pressure-result/v1');
    assert.equal(request.resultContract.oneExperimentZipRequired, true);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('repository-stage former rebinds current Relay contract and forms only read/check/run/respond operations', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'vexwork-continuity-pressure-relay-'));
  try {
    const sdk = path.join(root, 'sdk');
    const contractPath = path.join(sdk, 'docs/private-continuity/vexrelay/current-contract.json');
    const packagePath = path.join(sdk, 'lib/vexrelay/package.mjs');
    fs.mkdirSync(path.dirname(contractPath), { recursive: true });
    fs.mkdirSync(path.dirname(packagePath), { recursive: true });
    fs.writeFileSync(
      contractPath,
      JSON.stringify({
        contractRef: 'source.vexrelay.current-contract/v1',
        taskSchema: 'vex.relay.task/v2',
        acceptedAdapters: [
          { adapterRef: 'adapter.vexrelay.repository/v2', state: 'CURRENT' },
        ],
      }),
    );
    fs.writeFileSync(
      packagePath,
      [
        "import fs from 'node:fs';",
        "import path from 'node:path';",
        "export function validateTaskObject(value) {",
        "  if (value.schemaVersion !== 'vex.relay.task/v2') throw new Error('bad schema');",
        "  if (value.operations.at(-1)?.op !== 'RESPOND') throw new Error('missing respond');",
        "  return { manifest: value };",
        "}",
        "export async function buildTaskPackage({ manifestPath, outputDirectory, outputStem }) {",
        "  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));",
        "  fs.mkdirSync(outputDirectory, { recursive: true });",
        "  const outputPath = path.join(outputDirectory, outputStem + '--sha256-' + 'a'.repeat(64) + '.zip');",
        "  fs.writeFileSync(outputPath, 'fixture');",
        "  return { outputPath, sha256: 'a'.repeat(64), taskRef: manifest.taskRef, attemptRef: manifest.attemptRef, packageRef: manifest.packageRef };",
        "}",
        "",
      ].join('\n'),
    );

    const input = path.join(root, 'binding.json');
    const output = path.join(root, 'out');
    fs.writeFileSync(input, JSON.stringify(binding(), null, 2));

    const formation = JSON.parse(run('form-repository-stage.mjs', [
      '--sdk-root', sdk,
      '--binding', input,
      '--stage', 'projection',
      '--output-dir', output,
    ]));

    assert.equal(formation.currentContractRef, 'source.vexrelay.current-contract/v1');
    assert.equal(formation.taskSchema, 'vex.relay.task/v2');
    assert.equal(formation.adapterRef, 'adapter.vexrelay.repository/v2');
    assert.equal(formation.scenarioSha256, scenarioSha());

    const manifest = JSON.parse(
      fs.readFileSync(path.join(output, 'task.projection.manifest.json'), 'utf8'),
    );
    assert.deepEqual(
      manifest.operations.map((operation) => operation.op),
      ['READ', 'CHECK', 'CHECK', 'RUN', 'RESPOND'],
    );
    assert.equal(manifest.operations.some((operation) => operation.op === 'WRITE'), false);
    assert.equal(manifest.operations.some((operation) => operation.op === 'PUBLISH'), false);
    assert.equal(manifest.operations.find((operation) => operation.op === 'RUN').mutationClass, 'NONE');
    assert.equal(
      manifest.completionPolicy.stageGateOrNull,
      'CONTINUITY_PRESSURE_PROJECTION_COMPLETE',
    );
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

// [VXG RealForever][VEXWORK][CONTINUITY-PRESSURE][HARNESS-INTERFACE]
