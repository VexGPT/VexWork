#!/usr/bin/env node
// Regenerate a Screen Lens from source, and move its Stable / Main build pointers.
//
// The pointers live in projects/vexboard/lens/catalog.json. Every command below reads them there.
//
//   node scripts/build-screen-lens.mjs --verify                     offline: every build in the catalog still matches
//                                                                   its pointer, adapter, overlay and generator
//   node scripts/build-screen-lens.mjs --fetch                      regenerate Stable at its pointer
//   node scripts/build-screen-lens.mjs --build main --fetch         move Main to the newest commit on its branch
//   node scripts/build-screen-lens.mjs --build main --fetch --commit <sha|branch|tag>
//   node scripts/build-screen-lens.mjs --promote [--evidence <ref>] Stable takes Main's commit (offline)
//   node scripts/build-screen-lens.mjs --source <checkout> [--build main] [--check]
//
// Options: --subject <slug> (default: the catalog's default project), --check, --report, --on <YYYY-MM-DD>.
// Legacy single-lens use, bypassing the catalog: --adapter <file> [--overlay <file>] [--out <file>].
//
// Stable moves only by promote (or an explicit --build stable --commit). Generating Main never re-pins
// the adapter, and Main shares Stable's lens file whenever both point at the same commit.

import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { ADAPTER_VERSION, adapterReadPlan, projectAndroidScreenLens } from '../src/core/vexboard-screen-lens-android-adapter.mjs';
import { advanceBuild, buildFor, normalizeLensCatalog, promoteBuild, subjectFor } from '../src/shared/vexboard-lens-catalog.mjs';
import { faceGraph, normalizeScreenLens, screenMapGraph } from '../src/shared/vexboard-screen-lens.mjs';
import { layoutCollisions, layoutLensFace } from '../src/shared/vexboard-lens-layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LENS_DIR = 'projects/vexboard/lens';
const CATALOG = `${LENS_DIR}/catalog.json`;

function parseArgs(argv) {
  const args = { flags: new Set() };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith('--')) throw new Error(`unexpected argument ${arg}`);
    const key = arg.slice(2);
    if (['check', 'fetch', 'verify', 'report', 'promote'].includes(key)) args.flags.add(key);
    else args[key] = argv[++i];
  }
  return args;
}

const sha256 = (text) => crypto.createHash('sha256').update(text).digest('hex');
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const stable = (value) => `${JSON.stringify(value, null, 2)}\n`;
const git = (cwd, ...args) => execFileSync('git', ['-C', cwd, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

function rootPath(adapter, logical) {
  const match = /^([a-z][a-z0-9-]*):(.*)$/.exec(logical);
  return match ? `${adapter.repository.roots[match[1]]}${match[2]}` : logical;
}

function fetchCheckout(adapter, commit) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'screen-lens-'));
  git(dir, 'init', '-q');
  git(dir, 'remote', 'add', 'origin', adapter.repository.url);
  git(dir, 'config', 'core.sparseCheckout', 'true');
  fs.writeFileSync(path.join(dir, '.git', 'info', 'sparse-checkout'), `${[...adapter.read.map((entry) => `/${rootPath(adapter, entry)}`), ...(adapter.stringResources ?? []).map((resource) => `/${resource}`)].join('\n')}\n`);
  git(dir, 'fetch', '-q', '--depth', '1', 'origin', commit);
  git(dir, 'checkout', '-q', 'FETCH_HEAD');
  return dir;
}

// Same read plan the in-browser commit projection uses, so both read the same files.
function readSources(adapter, source) {
  const plan = adapterReadPlan(adapter);
  const files = new Map();
  const walk = (relative) => {
    const absolute = path.join(source, relative);
    if (!fs.existsSync(absolute)) return;
    for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
      const next = path.posix.join(relative, entry.name);
      if (entry.isDirectory()) walk(next);
      else if (plan.includes(next)) files.set(next, fs.readFileSync(path.join(source, next), 'utf8'));
    }
  };
  for (const prefix of plan.prefixes) walk(prefix.replace(/\/$/, ''));
  for (const resource of plan.resources) {
    const absolute = path.join(source, resource);
    if (fs.existsSync(absolute)) files.set(resource, fs.readFileSync(absolute, 'utf8'));
  }
  return files;
}

// Scale guarantee: every generated face must lay out with no overlap.
function verifyLayouts(lens) {
  const problems = [];
  for (const pathway of lens.pathways) {
    for (const face of ['BEHAVIOR', 'DEPTH']) {
      for (const hideBands of [[], ['DOORWAY']]) {
        const graph = faceGraph(pathway, face, { hideBands });
        if (!graph.nodes.length) continue;
        const collisions = layoutCollisions(layoutLensFace({ nodes: graph.nodes.map((node) => ({ ...node, footer: true })), edges: graph.edges }));
        if (collisions.length) problems.push(`${pathway.pathwayRef} ${face}: ${collisions.length} overlaps`);
      }
    }
  }
  const map = screenMapGraph(lens);
  if (layoutCollisions(layoutLensFace({ nodes: map.nodes, edges: map.edges }, { nodeWidth: 200 })).length) problems.push('screen map overlaps');
  return problems;
}

// Hashes are taken over canonical JSON, so reformatting a file does not make the lens stale.
export function provenanceFor(adapter, overlay) {
  return { generator: ADAPTER_VERSION, adapterSha256: sha256(stable(adapter)), overlaySha256: overlay ? sha256(stable(overlay)) : null, sourceCommit: adapter.repository.commit };
}

const pinTo = (adapter, commit) => ({ ...adapter, repository: { ...adapter.repository, commit } });
const lensFile = (name) => path.join(ROOT, LENS_DIR, name);
const today = () => new Date().toISOString().slice(0, 10);

// Where this run reads and writes. Without --adapter, everything comes from the catalog.
function context(args) {
  if (args.adapter) {
    const adapterFile = path.resolve(ROOT, args.adapter);
    const overlayFile = path.resolve(ROOT, args.overlay ?? adapterFile.replace(/\.lens-adapter\.json$/, '.lens-overlay.json'));
    return { legacy: true, adapterFile, overlayFile: fs.existsSync(overlayFile) ? overlayFile : null, outFile: path.resolve(ROOT, args.out ?? adapterFile.replace(/\.lens-adapter\.json$/, '.screen-lens.json')) };
  }
  const rawCatalog = readJson(path.join(ROOT, CATALOG));
  const catalog = normalizeLensCatalog(rawCatalog);
  const subject = subjectFor(catalog, args.subject ?? catalog.defaultSubjectRef);
  if (!subject) throw new Error(`no project named ${args.subject} in ${CATALOG}`);
  if (subject.lens.status !== 'GENERATED') throw new Error(`${subject.label} has no generated lens (${subject.lens.reason})`);
  const buildRef = args.build ?? 'stable';
  if (!buildFor(subject, buildRef)) throw new Error(`${subject.label} has no ${buildRef} build`);
  return {
    legacy: false, rawCatalog, catalog, subject, buildRef,
    adapterFile: lensFile(subject.lens.adapter),
    overlayFile: subject.lens.overlay ? lensFile(subject.lens.overlay) : null,
  };
}

function verifyFile(file, adapter, overlay, commit) {
  const committed = readJson(file);
  const expected = provenanceFor(pinTo(adapter, commit), overlay);
  const actual = committed.provenance ?? {};
  const stale = Object.keys(expected).filter((key) => expected[key] !== actual[key]);
  normalizeScreenLens(committed);
  return { stale, problems: verifyLayouts(committed), sourceCommit: actual.sourceCommit };
}

function verify(args) {
  if (args.adapter) {
    const ctx = context(args);
    const adapter = readJson(ctx.adapterFile);
    const result = verifyFile(ctx.outFile, adapter, ctx.overlayFile ? readJson(ctx.overlayFile) : null, adapter.repository.commit);
    if (result.stale.length || result.problems.length) {
      console.error(JSON.stringify({ state: 'STALE', ...result, fix: 'node scripts/build-screen-lens.mjs --fetch (or --source <checkout>)' }, null, 2));
      process.exit(1);
    }
    console.log(JSON.stringify({ state: 'PASS', lens: path.relative(ROOT, ctx.outFile), sourceCommit: result.sourceCommit }, null, 2));
    return;
  }
  const catalog = normalizeLensCatalog(readJson(path.join(ROOT, CATALOG)));
  const builds = [];
  const failures = [];
  for (const subject of catalog.subjects) {
    if (subject.lens.status !== 'GENERATED' || (args.subject && subject.slug !== args.subject)) continue;
    const adapter = readJson(lensFile(subject.lens.adapter));
    const overlay = subject.lens.overlay ? readJson(lensFile(subject.lens.overlay)) : null;
    const stable = buildFor(subject, 'stable');
    if (adapter.repository.commit !== stable.commit) failures.push(`${subject.slug}: adapter pin ${adapter.repository.commit.slice(0, 7)} disagrees with Stable ${stable.commit.slice(0, 7)} in ${CATALOG}`);
    for (const build of subject.lens.builds) {
      const result = verifyFile(lensFile(build.lens), adapter, overlay, build.commit);
      const state = result.stale.length || result.problems.length ? 'STALE' : 'PASS';
      builds.push({ subject: subject.slug, build: build.buildRef, commit: build.commit, lens: `${LENS_DIR}/${build.lens}`, state, ...(state === 'PASS' ? {} : { stale: result.stale, problems: result.problems }) });
      if (state !== 'PASS') failures.push(`${subject.slug} ${build.buildRef}: ${[...result.stale.map((key) => `${key} differs`), ...result.problems].join('; ')}`);
    }
  }
  if (failures.length) {
    console.error(JSON.stringify({ state: 'STALE', builds, failures, fix: 'node scripts/build-screen-lens.mjs --fetch [--build main]' }, null, 2));
    process.exit(1);
  }
  const stable = builds.find((entry) => entry.build === 'stable');
  console.log(JSON.stringify({ state: 'PASS', lens: stable?.lens ?? null, sourceCommit: stable?.commit ?? null, builds }, null, 2));
}

function promote(args) {
  const ctx = context(args);
  const before = buildFor(ctx.subject, 'stable').commit;
  const result = promoteBuild(ctx.rawCatalog, ctx.subject.slug, { on: args.on ?? today(), evidence: args.evidence ? [args.evidence] : [] });
  if (!result.changed) {
    console.log(JSON.stringify({ state: 'PASS', promoted: false, reason: `Stable already points at Main (${before.slice(0, 7)})` }, null, 2));
    return;
  }
  const commit = buildFor(subjectFor(normalizeLensCatalog(result.catalog), ctx.subject.slug), 'stable').commit;
  if (result.copy) fs.copyFileSync(lensFile(result.copy.from), lensFile(result.copy.to));
  if (result.retire) fs.rmSync(lensFile(result.retire), { force: true });
  const adapter = readJson(ctx.adapterFile);
  fs.writeFileSync(ctx.adapterFile, stable(pinTo(adapter, commit)));
  fs.writeFileSync(path.join(ROOT, CATALOG), stable(result.catalog));
  console.log(JSON.stringify({ state: 'PASS', promoted: true, subject: ctx.subject.slug, from: before, to: commit, next: 'npm run lens:verify, then commit the catalog, adapter and lens' }, null, 2));
}

function remoteHead(url, branch) {
  const line = execFileSync('git', ['ls-remote', url, `refs/heads/${branch}`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim().split('\n')[0];
  const sha = line?.split(/\s+/)[0];
  if (!/^[0-9a-f]{40}$/.test(sha ?? '')) throw new Error(`could not read ${branch} from ${url}`);
  return sha;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.flags.has('verify')) return verify(args);
  if (args.flags.has('promote')) return promote(args);

  const ctx = context(args);
  const adapterText = fs.readFileSync(ctx.adapterFile, 'utf8');
  const adapter = JSON.parse(adapterText);
  const overlay = ctx.overlayFile ? readJson(ctx.overlayFile) : null;
  const build = ctx.legacy ? null : buildFor(ctx.subject, ctx.buildRef);
  const moving = Boolean(build && build.buildRef !== 'stable' && !args.commit && !args.flags.has('check') && !args.source);

  let commit = args.commit ?? (moving ? remoteHead(adapter.repository.url, build.branch ?? ctx.subject.repository.defaultBranch) : (build?.commit ?? adapter.repository.commit));
  let source = args.source ? path.resolve(args.source) : null;
  if (!source && args.flags.has('fetch')) source = fetchCheckout(adapter, commit);
  if (!source) throw new Error('pass --source <checkout>, --fetch, --verify or --promote');
  let observedAt = null;
  let head = null;
  try {
    head = git(source, 'rev-parse', 'HEAD');
    observedAt = git(source, 'log', '-1', '--format=%cs', 'HEAD');
  } catch {
    head = null; // not a git checkout: the commit must come from --commit or the pointer
  }
  if (head) {
    // A fetched checkout is exactly what was asked for. A given checkout must match --commit.
    const matches = (asked) => head === asked || head.startsWith(asked) || (() => { try { return git(source, 'rev-parse', `${asked}^{commit}`) === head; } catch { return false; } })();
    if (args.commit && !args.flags.has('fetch') && !matches(args.commit)) throw new Error(`checkout is at ${head}, not ${args.commit}`);
    commit = head;
  }
  if (!/^[0-9a-f]{40}$/.test(commit)) throw new Error(`could not resolve ${commit} to a full commit SHA`);

  const pinned = pinTo(adapter, commit);
  const { lens, report } = projectAndroidScreenLens({ adapter: pinned, files: readSources(pinned, source), overlay, observedAt });
  normalizeScreenLens(lens);
  const problems = verifyLayouts(lens);
  if (problems.length) throw new Error(`generated lens has layout overlaps:\n${problems.join('\n')}`);
  const output = stable({ ...lens, provenance: provenanceFor(pinned, overlay) });

  // Decide which file this build writes and how the pointers move.
  let outFile = ctx.outFile;
  let nextCatalog = null;
  let retire = null;
  let shared = false;
  const repinAdapter = ctx.legacy || build.buildRef === 'stable';
  if (!ctx.legacy) {
    const moved = advanceBuild(ctx.rawCatalog, ctx.subject.slug, build.buildRef, { commit, observedAt, separateLens: `${ctx.subject.slug}.${build.buildRef}.screen-lens.json` });
    outFile = lensFile(moved.lens);
    shared = !moved.write;
    retire = moved.retire;
    nextCatalog = stable(moved.catalog);
  }
  const summary = { state: 'PASS', subject: ctx.subject?.slug ?? null, build: build?.buildRef ?? null, lens: path.relative(ROOT, outFile), sourceCommit: commit, sharesStable: shared, screens: report.screens, elements: report.elements, pathways: report.pathways, familyBonds: report.bonds.length, held: report.held.length, unknownCalls: report.unknownCalls.length };
  const current = fs.existsSync(outFile) ? fs.readFileSync(outFile, 'utf8') : '';
  const catalogText = ctx.legacy ? null : fs.readFileSync(path.join(ROOT, CATALOG), 'utf8');
  const adapterChanged = repinAdapter && stable(adapter) !== stable(pinned);

  if (args.flags.has('check')) {
    const catalogChanged = !ctx.legacy && stable(JSON.parse(catalogText)) !== nextCatalog;
    if (current !== output || adapterChanged || catalogChanged) {
      console.error(JSON.stringify({ ...summary, state: 'STALE', fix: 'rerun without --check and commit the result' }, null, 2));
      process.exit(1);
    }
    console.log(JSON.stringify(summary, null, 2));
    return;
  }
  if (shared && current !== output) throw new Error(`Main points at Stable's commit but Stable's lens is stale. Regenerate Stable first: node scripts/build-screen-lens.mjs --fetch`);
  if (!shared) fs.writeFileSync(outFile, output);
  if (retire) fs.rmSync(lensFile(retire), { force: true });
  if (adapterChanged) fs.writeFileSync(ctx.adapterFile, stable(pinned));
  if (nextCatalog && nextCatalog !== stable(JSON.parse(catalogText))) fs.writeFileSync(path.join(ROOT, CATALOG), nextCatalog);
  console.log(JSON.stringify(args.flags.has('report') ? { ...summary, report } : summary, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

// [VXG RealForever][VEXWORK][VEXBOARD][SCREEN-LENS][BUILD]
