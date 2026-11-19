#!/usr/bin/env node
// Build the VexLife-Prod Experience Relationship Graph and everything derived from it.
//
//   node scripts/build-experience-graph.mjs --fetch            sparse-fetch the pinned Product commit(s), regenerate
//   node scripts/build-experience-graph.mjs --source <dir>     regenerate from an existing checkout at the pinned commit
//   node scripts/build-experience-graph.mjs --fetch --check    regenerate in memory; fail if checked-in output differs
//   node scripts/build-experience-graph.mjs --build <candidate-ref> [--source <checkout>]
//                                                              project one candidate branch build against preserved main
//   node scripts/build-experience-graph.mjs --verify           offline: derived artifacts reproduce from the checked-in
//                                                              graph, extractor blobs match, law proof recomputes
//
// The pinned source lives in projects/vexlife-prod-end-to-end-tests/experience-graph/source-plan.json.
// Product source is read only. Generated files are never hand-edited.

import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { readFamilyLaw } from '../src/core/experience-graph-kotlin-family.mjs';
import { readLensSurface, readRealizationSites, readSendBoundary, readUntypedControlLiterals } from '../src/core/experience-graph-product-wiring.mjs';
import { compileExperienceGraph, experienceBoardGraph, normalizeExperienceGraph } from '../src/core/experience-graph.mjs';
import { deriveFrontier, deriveRoutes } from '../src/core/experience-graph-derivation.mjs';
import { derivePerturbations } from '../src/core/experience-graph-perturbation.mjs';
import { deriveConvergence, diffExperienceGraphs } from '../src/core/experience-graph-convergence.mjs';
import { compareLawEvidence, indexEnums, planLawProbe } from '../src/core/experience-graph-law-probe.mjs';
import { renderExperienceReport } from '../src/core/experience-graph-report.mjs';
import { readLocalization } from '../src/core/experience-graph-localization.mjs';
import { readStringIdentity } from '../src/core/experience-graph-identity.mjs';
import { withTestSeamDebt } from '../src/core/experience-graph-derivation.mjs';
import { compareBuilds, normalizeBuilds, renderBranchReport } from '../src/core/experience-graph-branches.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = 'projects/vexlife-prod-end-to-end-tests/experience-graph';
const GENERATED = `${DIR}/generated`;
const PLAN = `${DIR}/source-plan.json`;
const EXTRACTOR_MODULES = [
  'src/core/vexboard-kotlin-source.mjs',
  'src/core/experience-graph-kotlin-family.mjs',
  'src/core/experience-graph-product-wiring.mjs',
  'src/core/experience-graph-localization.mjs',
  'src/core/experience-graph-identity.mjs',
  'src/core/experience-graph.mjs',
];

export const buildOutputs = (buildRef) => Object.freeze({
  graph: `${GENERATED}/builds/${buildRef}/experience-relationship-graph.json`,
  frontier: `${GENERATED}/builds/${buildRef}/frontier.json`,
  routes: `${GENERATED}/builds/${buildRef}/routes.json`,
});

export const OUTPUTS = Object.freeze({
  branches: `${GENERATED}/branches.json`,
  branchReport: `${GENERATED}/BRANCHES.md`,
  graph: `${GENERATED}/experience-relationship-graph.json`,
  frontier: `${GENERATED}/frontier.json`,
  routes: `${GENERATED}/routes.json`,
  perturbations: `${GENERATED}/perturbations.json`,
  convergence: `${GENERATED}/convergence.json`,
  probe: `${GENERATED}/law-probe/ExperienceLawProbeTest.kt`,
  probePlan: `${GENERATED}/law-probe/plan.json`,
  lawProof: `${GENERATED}/law-proof.json`,
  report: `${GENERATED}/EXPERIENCE-GRAPH.md`,
});
export const EVIDENCE = Object.freeze({
  law: `${DIR}/evidence/law-evidence.json`,
  perturbation: `${DIR}/evidence/perturbation-evidence.json`,
});

const readJson = (file) => JSON.parse(fs.readFileSync(path.join(ROOT, file), 'utf8'));
const stable = (value) => `${JSON.stringify(value, null, 2)}\n`;
export const gitBlobSha1 = (text) => crypto.createHash('sha1').update(`blob ${Buffer.byteLength(text)}\0`).update(text).digest('hex');
const git = (cwd, ...args) => execFileSync('git', ['-C', cwd, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1 << 28 }).trim();

function parseArgs(argv) {
  const args = { flags: new Set() };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith('--')) throw new Error(`unexpected argument ${arg}`);
    const key = arg.slice(2);
    if (['check', 'fetch', 'verify'].includes(key)) args.flags.add(key);
    else args[key] = argv[++i];
  }
  return args;
}

function fetchCheckout(plan, commit) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'experience-graph-'));
  git(dir, 'init', '-q');
  git(dir, 'remote', 'add', 'origin', plan.url);
  git(dir, 'fetch', '-q', '--depth', '1', 'origin', commit);
  git(dir, 'checkout', '-q', 'FETCH_HEAD');
  return dir;
}

function listKotlin(checkout, roots) {
  const out = [];
  const walk = (relative) => {
    for (const entry of fs.readdirSync(path.join(checkout, relative), { withFileTypes: true })) {
      const next = `${relative}/${entry.name}`;
      if (entry.isDirectory()) walk(next);
      else if (entry.name.endsWith('.kt')) out.push(next);
    }
  };
  for (const root of roots) if (fs.existsSync(path.join(checkout, root))) walk(root);
  return out.sort();
}

function listJson(checkout, root) {
  const dir = path.join(checkout, root);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((name) => name.endsWith('.json')).sort().map((name) => `${root}/${name}`);
}

export function extractorFingerprint(root = ROOT) {
  return EXTRACTOR_MODULES.map((module) => ({ path: module, blobSha1: gitBlobSha1(fs.readFileSync(path.join(root, module), 'utf8')) }));
}

// source checkout -> graph (+ the per-file inputs the probe planner needs)
export function buildGraphFromCheckout(checkout, plan, commit) {
  const read = (relative) => ({ path: relative, text: fs.readFileSync(path.join(checkout, relative), 'utf8') });
  const mainFiles = listKotlin(checkout, plan.wiringRoots).map(read);
  const familyFiles = mainFiles.filter((file) => file.path.startsWith(plan.familyRoot)
    && !file.path.endsWith('/semantic/VexFamilyContract.kt')
    && (/(?:object|class) \w+(?:\s+(?:private|internal)\s+constructor\s*\(\s*\))?\s*:\s*VexFamilyContract\s*</.test(file.text) || /fun lawfulControls\s*\(/.test(file.text)));
  const families = familyFiles.map(readFamilyLaw);
  const lensFile = read(plan.lens);
  const surface = readLensSurface(JSON.parse(lensFile.text));
  const realization = readRealizationSites({ families, files: mainFiles });
  const sendBoundary = readSendBoundary({ turnSource: read(plan.sendBoundary.turn), promptSource: read(plan.sendBoundary.prompt), serviceSource: read(plan.sendBoundary.service) });
  const untyped = readUntypedControlLiterals({ families, files: mainFiles });
  const exists = (relative) => relative && fs.existsSync(path.join(checkout, relative));
  const loc = plan.localization;
  const catalogFiles = loc ? listJson(checkout, loc.catalogRoot).map((relative) => ({ scope: path.basename(relative, '.json'), ...read(relative) })) : [];
  const testFiles = loc ? listKotlin(checkout, loc.anchorTestRoots).map(read) : [];
  const markup = exists(plan.identity?.markup) ? read(plan.identity.markup) : null;
  const runtime = exists(plan.identity?.runtime) ? read(plan.identity.runtime) : null;
  const familyPaths = new Set(familyFiles.map((file) => file.path));
  const localization = loc ? readLocalization({
    catalogFiles,
    anchorFiles: [...mainFiles, ...testFiles],
    settings: exists(loc.settings) ? read(loc.settings) : null,
    strings: exists(loc.strings) ? read(loc.strings) : null,
    selectionFiles: mainFiles,
    markup,
    laws: families,
    familyFiles,
  }) : null;
  const stringIdentity = plan.identity ? readStringIdentity({ mainFiles, familyPaths, markup, runtime, laws: families }) : null;

  const contributing = new Set([
    ...familyFiles.map((file) => file.path),
    plan.lens,
    plan.sendBoundary.turn, plan.sendBoundary.prompt, plan.sendBoundary.service,
    ...realization.realizations.map((row) => row.sourcePath),
    ...realization.returns.map((row) => row.sourcePath),
    ...untyped.map((row) => row.sourcePath),
    ...catalogFiles.map((file) => file.path),
    ...(localization ? [...localization.dataKeys.map((row) => row.anchorSourcePath), ...localization.selection.map((row) => row.sourcePath), localization.scripts?.sourcePath, loc?.strings] : []),
    ...(stringIdentity ? [markup?.path, runtime?.path, ...stringIdentity.kotlinLiterals.map((row) => row.sourcePath), ...stringIdentity.reflection.map((row) => row.sourcePath)] : []),
  ].filter((relative) => relative && exists(relative)));
  const textByPath = new Map([...mainFiles, ...testFiles, ...catalogFiles, lensFile].map((file) => [file.path, file.text]));
  const graph = compileExperienceGraph({
    source: {
      repository: plan.repository,
      commit,
      files: [...contributing].sort().map((relative) => ({ path: relative, blobSha1: gitBlobSha1(textByPath.get(relative)) })),
    },
    families,
    surface,
    realization,
    sendBoundary,
    untypedLiterals: untyped,
    localization,
    stringIdentity,
    extractor: { modules: extractorFingerprint() },
  });
  const relaySources = mainFiles
    .filter((file) => /\b(?:object|class|interface) (\w*Relay\w*)/.test(file.text))
    .map((file) => ({ symbol: /\b(?:object|class|interface) (\w*Relay\w*)/.exec(file.text)[1], sourcePath: file.path, blobSha1: gitBlobSha1(file.text) }));
  return { graph, families, mainFiles, relaySources };
}

function convergenceInputs({ lawEvidence, perturbationEvidence, priorGraph }) {
  return {
    graph: true,
    frontier: true,
    sourceCommit: true,
    hostLawProbe: Boolean(lawEvidence),
    perturbationEvidence: Boolean(perturbationEvidence),
    lawEvidence: Boolean(lawEvidence),
    manifests: true,
    priorGraph: Boolean(priorGraph),
    // Not present in this lane: claimable repair ownership, lived/host evidence, resource claims,
    // a live runtime projection, release evidence, required-journey selection.
    repairOwnership: false,
    livedEvidence: false,
    resourceClaims: false,
    hostModelAvailability: false,
    liveRuntimeProjection: false,
    requiredJourneys: false,
    releaseEvidence: false,
  };
}

// graph (+ evidence) -> every derived artifact. Offline and deterministic.
export function deriveAll(graph, { lawEvidence = null, perturbationEvidence = null, relaySources = [], changeImpact = null } = {}) {
  let frontier = deriveFrontier(graph);
  const routes = deriveRoutes(graph, frontier);
  const perturbations = derivePerturbations(graph, { evidence: perturbationEvidence });
  const convergence = deriveConvergence(graph, {
    frontier,
    derivation: routes,
    relaySources,
    inputs: convergenceInputs({ lawEvidence, perturbationEvidence, priorGraph: changeImpact }),
  });
  if (changeImpact) convergence.queries.changeImpact = changeImpact;
  const lawProof = lawEvidence ? compareLawEvidence({ graph, derivation: routes, evidence: lawEvidence }) : null;
  // Class F is known only after the probe ran; it never changes a route, so it joins the frontier last.
  if (lawProof) frontier = withTestSeamDebt(frontier, lawProof);
  const board = experienceBoardGraph(graph);
  const report = renderExperienceReport({ graph, frontier, routes, perturbations, convergence, lawProof, board });
  return { frontier, routes, perturbations, convergence, lawProof, report };
}

function writeOut(file, text, check, drift) {
  const absolute = path.join(ROOT, file);
  if (check) {
    const existing = fs.existsSync(absolute) ? fs.readFileSync(absolute, 'utf8') : null;
    if (existing !== text) drift.push(file);
    return;
  }
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, text);
}

const optionalJson = (file) => (fs.existsSync(path.join(ROOT, file)) ? readJson(file) : null);

// One candidate build: same extractor, same derivation, its own output directory.
export function projectBuild(checkout, plan, build) {
  const { graph } = buildGraphFromCheckout(checkout, plan, build.commit);
  const frontier = deriveFrontier(graph);
  return { build, graph, frontier, routes: deriveRoutes(graph, frontier) };
}

// Candidates are compared against main's graph-derived frontier (class F rows come from main's
// executed probe only and would otherwise read as "resolved" by every candidate).
export function branchProjection(mainGraph, candidates) {
  const frontier = deriveFrontier(mainGraph);
  const branches = compareBuilds({ main: { graph: mainGraph, frontier, routes: deriveRoutes(mainGraph, frontier) }, candidates });
  return { branches, report: renderBranchReport(branches) };
}

function checkedInBuild(build) {
  const files = buildOutputs(build.buildRef);
  if (!fs.existsSync(path.join(ROOT, files.graph))) return null;
  const graph = normalizeExperienceGraph(readJson(files.graph));
  if (graph.source.commit !== build.commit) return null;
  const frontier = deriveFrontier(graph);
  return { build, graph, frontier, routes: deriveRoutes(graph, frontier) };
}

function writeBuild(projected, check, drift) {
  const files = buildOutputs(projected.build.buildRef);
  writeOut(files.graph, stable(projected.graph), check, drift);
  writeOut(files.frontier, stable(projected.frontier), check, drift);
  writeOut(files.routes, stable(projected.routes), check, drift);
}

function generate(args) {
  const plan = readJson(PLAN);
  const check = args.flags.has('check');
  const builds = normalizeBuilds(plan);
  if (args.build) return generateBuild(args, plan, builds, check);
  const checkout = args.source ? path.resolve(args.source) : fetchCheckout(plan, plan.commit);
  if (args.source) {
    const head = git(checkout, 'rev-parse', 'HEAD');
    if (head !== plan.commit) throw new Error(`checkout ${checkout} is at ${head}, source plan pins ${plan.commit}`);
  }
  const { graph, families, mainFiles, relaySources } = buildGraphFromCheckout(checkout, plan, plan.commit);

  let changeImpact = null;
  if (plan.priorCommit && (args.prior || args.flags.has('fetch'))) {
    const priorCheckout = args.prior ? path.resolve(args.prior) : fetchCheckout(plan, plan.priorCommit);
    const prior = buildGraphFromCheckout(priorCheckout, plan, plan.priorCommit).graph;
    const priorDerivation = deriveRoutes(prior, deriveFrontier(prior));
    changeImpact = diffExperienceGraphs(prior, graph, { priorRoutes: priorDerivation.routes, currentRoutes: deriveRoutes(graph, deriveFrontier(graph)).routes });
    changeImpact.priorGraphFingerprint = prior.fingerprint;
  } else {
    changeImpact = optionalJson(OUTPUTS.convergence)?.queries?.changeImpact ?? null;
  }

  const probe = planLawProbe({
    laws: families,
    enumIndex: indexEnums(mainFiles),
    sourceTexts: new Map(mainFiles.map((file) => [file.path, file.text])),
  });
  const lawEvidence = optionalJson(EVIDENCE.law);
  const perturbationEvidence = optionalJson(EVIDENCE.perturbation);
  const derived = deriveAll(graph, { lawEvidence, perturbationEvidence, relaySources, changeImpact });

  const drift = [];
  writeOut(OUTPUTS.graph, stable(graph), check, drift);
  writeOut(OUTPUTS.frontier, stable(derived.frontier), check, drift);
  writeOut(OUTPUTS.routes, stable(derived.routes), check, drift);
  writeOut(OUTPUTS.perturbations, stable(derived.perturbations), check, drift);
  writeOut(OUTPUTS.convergence, stable(derived.convergence), check, drift);
  writeOut(OUTPUTS.probe, probe.kotlinSource, check, drift);
  writeOut(OUTPUTS.probePlan, stable({ schemaVersion: probe.schemaVersion, graphFingerprint: graph.fingerprint, families: probe.families.map(({ family, instance, runnable, notRunnable, states, controls }) => ({ family, instance, runnable, notRunnable, states, controls })) }), check, drift);
  if (derived.lawProof) writeOut(OUTPUTS.lawProof, stable(derived.lawProof), check, drift);
  writeOut(OUTPUTS.report, derived.report, check, drift);

  const candidates = [];
  for (const build of builds) {
    const projected = args.flags.has('fetch') ? projectBuild(fetchCheckout(plan, build.commit), plan, build) : checkedInBuild(build);
    if (!projected) throw new Error(`candidate ${build.buildRef} has no projection at ${build.commit}; run --fetch or --build ${build.buildRef} --source <checkout>`);
    if (args.flags.has('fetch')) writeBuild(projected, check, drift);
    candidates.push(projected);
  }
  const { branches, report: branchReport } = branchProjection(graph, candidates);
  writeOut(OUTPUTS.branches, stable(branches), check, drift);
  writeOut(OUTPUTS.branchReport, branchReport, check, drift);
  if (check && drift.length) {
    console.error(`experience graph drift:\n${drift.map((file) => `  ${file}`).join('\n')}`);
    process.exit(1);
  }
  console.log(`${check ? 'checked' : 'wrote'} experience graph ${graph.fingerprint.slice(0, 12)} · ${graph.nodes.length} nodes · ${graph.edges.length} edges · routes ${JSON.stringify(derived.routes.counts)}`);
}

function generateBuild(args, plan, builds, check) {
  const build = builds.find((row) => row.buildRef === args.build);
  if (!build) throw new Error(`no candidate build ${args.build} in the source plan`);
  const checkout = args.source ? path.resolve(args.source) : fetchCheckout(plan, build.commit);
  if (args.source) {
    const head = git(checkout, 'rev-parse', 'HEAD');
    if (head !== build.commit) throw new Error(`checkout ${checkout} is at ${head}, ${build.buildRef} pins ${build.commit}`);
  }
  const drift = [];
  const projected = projectBuild(checkout, plan, build);
  writeBuild(projected, check, drift);
  const mainGraph = normalizeExperienceGraph(readJson(OUTPUTS.graph));
  const candidates = builds.map((row) => (row.buildRef === build.buildRef ? projected : checkedInBuild(row))).filter(Boolean);
  const { branches, report } = branchProjection(mainGraph, candidates);
  writeOut(OUTPUTS.branches, stable(branches), check, drift);
  writeOut(OUTPUTS.branchReport, report, check, drift);
  if (check && drift.length) {
    console.error(`experience graph drift:\n${drift.map((file) => `  ${file}`).join('\n')}`);
    process.exit(1);
  }
  console.log(`${check ? 'checked' : 'wrote'} candidate ${build.buildRef} ${projected.graph.fingerprint.slice(0, 12)} · routes ${JSON.stringify(projected.routes.counts)} · debt ${projected.frontier.debt.length}`);
}

export function verify() {
  const problems = [];
  const graph = normalizeExperienceGraph(readJson(OUTPUTS.graph));
  const recorded = readJson(OUTPUTS.graph);
  if (recorded.fingerprint !== graph.fingerprint) problems.push('graph fingerprint does not recompute');
  const current = extractorFingerprint();
  if (JSON.stringify(recorded.extractor?.modules) !== JSON.stringify(current)) {
    problems.push('extractor modules changed since the graph was generated; regenerate with --fetch or --source');
  }
  const convergence = readJson(OUTPUTS.convergence);
  const derived = deriveAll(graph, {
    lawEvidence: optionalJson(EVIDENCE.law),
    perturbationEvidence: optionalJson(EVIDENCE.perturbation),
    relaySources: convergence.relaySources ?? [],
    changeImpact: convergence.queries?.changeImpact ?? null,
  });
  const expect = [
    [OUTPUTS.frontier, stable(derived.frontier)],
    [OUTPUTS.routes, stable(derived.routes)],
    [OUTPUTS.perturbations, stable(derived.perturbations)],
    [OUTPUTS.convergence, stable(derived.convergence)],
    [OUTPUTS.report, derived.report],
  ];
  if (derived.lawProof) expect.push([OUTPUTS.lawProof, stable(derived.lawProof)]);
  const plan = readJson(PLAN);
  const candidates = [];
  for (const build of normalizeBuilds(plan)) {
    const files = buildOutputs(build.buildRef);
    if (!fs.existsSync(path.join(ROOT, files.graph))) {
      problems.push(`candidate ${build.buildRef} has no checked-in projection`);
      continue;
    }
    const recordedBuild = readJson(files.graph);
    const projected = checkedInBuild(build);
    if (!projected) {
      problems.push(`candidate ${build.buildRef} projection is not at its pinned commit ${build.commit}`);
      continue;
    }
    if (recordedBuild.fingerprint !== projected.graph.fingerprint) problems.push(`candidate ${build.buildRef} graph fingerprint does not recompute`);
    if (JSON.stringify(recordedBuild.extractor?.modules) !== JSON.stringify(current)) problems.push(`candidate ${build.buildRef} was projected by a different extractor; regenerate with --fetch`);
    expect.push([files.frontier, stable(projected.frontier)], [files.routes, stable(projected.routes)]);
    candidates.push(projected);
  }
  const { branches, report: branchReport } = branchProjection(graph, candidates);
  expect.push([OUTPUTS.branches, stable(branches)], [OUTPUTS.branchReport, branchReport]);
  for (const [file, text] of expect) {
    if (fs.readFileSync(path.join(ROOT, file), 'utf8') !== text) problems.push(`${file} does not reproduce from the checked-in graph`);
  }
  return { graph, derived, problems };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.flags.has('verify')) {
    const { problems } = verify();
    if (problems.length) {
      console.error(problems.map((problem) => `  ${problem}`).join('\n'));
      process.exit(1);
    }
    console.log('experience graph verified offline');
    return;
  }
  if (!args.source && !args.flags.has('fetch')) throw new Error('choose --fetch, --source <checkout> or --verify');
  generate(args);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}

// [VXG RealForever][VEXWORK][VEXLIFE-PROD][E2E][EXPERIENCE-GRAPH][BUILD]
