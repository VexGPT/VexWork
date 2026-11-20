#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildGraphFromCheckout } from './build-experience-graph.mjs';
import { deriveFrontier, deriveRoutes } from '../src/core/experience-graph-derivation.mjs';
import { deriveHumanExperienceConvergence, renderHumanExperienceConvergence } from '../src/core/experience-graph-human.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROJECT = 'projects/vexlife-prod-end-to-end-tests';
const PLAN = `${PROJECT}/experience-convergence/plan.json`;
const SOURCE_PLAN = `${PROJECT}/experience-graph/source-plan.json`;
const SEED = `${PROJECT}/relationship-lattice.seed.json`;

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--source' || arg === '--json') out[arg.slice(2)] = argv[++i];
    else throw new Error(`unexpected argument ${arg}`);
  }
  if (!out.source) throw new Error('usage: npm run experience:converge -- --source <VexLife-Prod checkout> [--json <output.json>]');
  return out;
}

const readJson = (relative) => JSON.parse(fs.readFileSync(path.join(ROOT, relative), 'utf8'));
const git = (cwd, ...args) => execFileSync('git', ['-C', cwd, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

function main() {
  const args = parseArgs(process.argv.slice(2));
  const source = path.resolve(args.source);
  const convergencePlan = readJson(PLAN);
  const expected = convergencePlan.productCandidate.commit;
  const head = git(source, 'rev-parse', 'HEAD');
  if (head !== expected) {
    throw new Error(`Product checkout is ${head}; convergence R1 expects ${expected} on ${convergencePlan.productCandidate.branch}`);
  }

  const sourcePlan = readJson(SOURCE_PLAN);
  const livePlan = { ...sourcePlan, commit: head, priorCommit: null, builds: [] };
  const { graph } = buildGraphFromCheckout(source, livePlan, head);
  const frontier = deriveFrontier(graph);
  const derivation = deriveRoutes(graph, frontier);
  const seed = readJson(SEED);
  const result = deriveHumanExperienceConvergence(graph, derivation, seed);

  process.stdout.write(renderHumanExperienceConvergence(result));
  if (args.json) fs.writeFileSync(path.resolve(args.json), `${JSON.stringify(result, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

// [VXG RealForever][VEXWORK][VEXLIFE-PROD][E2E][EXPERIENCE-CONVERGENCE]
