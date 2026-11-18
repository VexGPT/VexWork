#!/usr/bin/env node
// Execute the generated Family-law probe against the pinned, unmodified VexLife-Prod source.
//
//   node scripts/run-experience-law-probe.mjs --source <checkout> [--work <dir>]
//
// 1. the checkout must be at the source plan's pinned commit and the checked-in graph must be current
// 2. `git archive <commit>` materializes a throwaway Product tree (the checkout is never touched)
// 3. the generated probe is placed into that tree's jvmTest source set only
// 4. Gradle compiles the Product and runs the probe; each row is one real resolve(state, control)
// 5. rows become evidence bound to the graph fingerprint, commit and probe source hash
//
// Afterwards run `node scripts/build-experience-graph.mjs --source <checkout>` to recompute the
// law proof from the new evidence.

import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildGraphFromCheckout, EVIDENCE, OUTPUTS } from './build-experience-graph.mjs';
import { indexEnums, lawEvidence, planLawProbe } from '../src/core/experience-graph-law-probe.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PLAN = 'projects/vexlife-prod-end-to-end-tests/experience-graph/source-plan.json';
const PROBE_TEST = 'vexwork.experience.probe.ExperienceLawProbeTest';

const readJson = (file) => JSON.parse(fs.readFileSync(path.join(ROOT, file), 'utf8'));
const stable = (value) => `${JSON.stringify(value, null, 2)}\n`;

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 2) {
    if (!argv[i].startsWith('--')) throw new Error(`unexpected argument ${argv[i]}`);
    args[argv[i].slice(2)] = argv[i + 1];
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.source) throw new Error('--source <VexLife-Prod checkout> is required');
  const plan = readJson(PLAN);
  const checkout = path.resolve(args.source);
  const head = execFileSync('git', ['-C', checkout, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  if (head !== plan.commit) throw new Error(`checkout is at ${head}; source plan pins ${plan.commit}`);

  const { graph, families, mainFiles } = buildGraphFromCheckout(checkout, plan, plan.commit);
  const checkedIn = readJson(OUTPUTS.graph);
  if (checkedIn.fingerprint !== graph.fingerprint) {
    throw new Error('checked-in graph is not current for this source; run build-experience-graph.mjs first');
  }
  const probe = planLawProbe({ laws: families, enumIndex: indexEnums(mainFiles), sourceTexts: new Map(mainFiles.map((file) => [file.path, file.text])) });
  if (fs.readFileSync(path.join(ROOT, OUTPUTS.probe), 'utf8') !== probe.kotlinSource) {
    throw new Error('checked-in probe source differs from the plan; regenerate the graph first');
  }

  const work = args.work ? path.resolve(args.work) : fs.mkdtempSync(path.join(os.tmpdir(), 'experience-law-probe-'));
  fs.mkdirSync(work, { recursive: true });
  const archive = spawnSync('bash', ['-c', `git -C "${checkout}" archive ${plan.commit} | tar -x -C "${work}"`], { stdio: 'inherit' });
  if (archive.status !== 0) throw new Error('could not materialize the pinned Product tree');
  const probeDir = path.join(work, 'src/jvmTest/kotlin/vexwork/experience/probe');
  fs.mkdirSync(probeDir, { recursive: true });
  fs.writeFileSync(path.join(probeDir, 'ExperienceLawProbeTest.kt'), probe.kotlinSource);
  const output = path.join(work, 'build/experience-law-probe.jsonl');
  fs.rmSync(output, { force: true });

  const gradle = spawnSync('./gradlew', ['jvmTest', '--tests', PROBE_TEST, '--no-daemon', '--console=plain', '--rerun-tasks'], { cwd: work, stdio: 'inherit' });
  if (gradle.status !== 0) throw new Error(`Gradle probe run failed (exit ${gradle.status}) in ${work}`);
  const rows = fs.readFileSync(output, 'utf8').split('\n').filter(Boolean).map((line) => JSON.parse(line));
  const java = spawnSync('java', ['-version'], { encoding: 'utf8' });
  const evidence = lawEvidence({
    graph,
    plan: probe,
    rows,
    runner: {
      command: `./gradlew jvmTest --tests ${PROBE_TEST}`,
      gradleWrapper: /distributionUrl=.*gradle-([\d.]+)-bin/.exec(fs.readFileSync(path.join(work, 'gradle/wrapper/gradle-wrapper.properties'), 'utf8'))?.[1] ?? null,
      jvm: /version "([^"]+)"/.exec(`${java.stderr}${java.stdout}`)?.[1] ?? null,
      productSourceModified: false,
      probePlacement: 'throwaway git-archive tree, src/jvmTest only',
    },
  });
  fs.mkdirSync(path.dirname(path.join(ROOT, EVIDENCE.law)), { recursive: true });
  fs.writeFileSync(path.join(ROOT, EVIDENCE.law), stable(evidence));
  console.log(`law probe executed ${rows.length} resolve() rows across ${new Set(rows.map((row) => row.family)).size} Families -> ${EVIDENCE.law}`);
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

// [VXG RealForever][VEXWORK][VEXLIFE-PROD][E2E][EXPERIENCE-GRAPH][LAW-PROBE-RUNNER]
