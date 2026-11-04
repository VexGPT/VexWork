#!/usr/bin/env node
// Regenerate a Screen Lens from a VexLife-Android checkout.
//
//   node scripts/build-screen-lens.mjs --source ../VexLife-Android            write the lens
//   node scripts/build-screen-lens.mjs --source ../VexLife-Android --check    fail if it is stale
//   node scripts/build-screen-lens.mjs --fetch                                sparse-clone the pinned commit first
//   node scripts/build-screen-lens.mjs --verify                               offline: committed lens still matches
//                                                                             its adapter, overlay and generator
//
// Options: --adapter <file> --overlay <file> --out <file> --commit <sha> --report
//
// The adapter pins the repository and commit; --commit (or a checkout at another
// HEAD) re-pins it, and the new commit is written into the lens and the adapter.

import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { ADAPTER_VERSION, projectAndroidScreenLens } from '../src/core/vexboard-screen-lens-android-adapter.mjs';
import { faceGraph, normalizeScreenLens, screenMapGraph } from '../src/shared/vexboard-screen-lens.mjs';
import { layoutCollisions, layoutLensFace } from '../src/shared/vexboard-lens-layout.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_ADAPTER = 'projects/vexboard/lens/vexlife-android.lens-adapter.json';

function parseArgs(argv) {
  const args = { flags: new Set() };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith('--')) throw new Error(`unexpected argument ${arg}`);
    const key = arg.slice(2);
    if (['check', 'fetch', 'verify', 'report'].includes(key)) args.flags.add(key);
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

function readSources(adapter, source) {
  const files = new Map();
  const walk = (relative) => {
    const absolute = path.join(source, relative);
    if (!fs.existsSync(absolute)) return;
    for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
      const next = path.posix.join(relative, entry.name);
      if (entry.isDirectory()) walk(next);
      else if (entry.name.endsWith('.kt')) files.set(next, fs.readFileSync(path.join(source, next), 'utf8'));
    }
  };
  for (const entry of adapter.read) walk(rootPath(adapter, entry).replace(/\/$/, ''));
  for (const resource of adapter.stringResources ?? []) {
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

function main() {
  const args = parseArgs(process.argv.slice(2));
  const adapterFile = path.resolve(ROOT, args.adapter ?? DEFAULT_ADAPTER);
  const adapterText = fs.readFileSync(adapterFile, 'utf8');
  const adapter = JSON.parse(adapterText);
  const overlayFile = path.resolve(ROOT, args.overlay ?? adapterFile.replace(/\.lens-adapter\.json$/, '.lens-overlay.json'));
  const overlayText = fs.existsSync(overlayFile) ? fs.readFileSync(overlayFile, 'utf8') : null;
  const outFile = path.resolve(ROOT, args.out ?? adapterFile.replace(/\.lens-adapter\.json$/, '.screen-lens.json'));

  if (args.flags.has('verify')) {
    const committed = readJson(outFile);
    const expected = provenanceFor(adapter, overlayText ? JSON.parse(overlayText) : null);
    const actual = committed.provenance ?? {};
    const stale = Object.keys(expected).filter((key) => expected[key] !== actual[key]);
    normalizeScreenLens(committed);
    const problems = verifyLayouts(committed);
    if (stale.length || problems.length) {
      console.error(JSON.stringify({ state: 'STALE', stale, problems, fix: 'node scripts/build-screen-lens.mjs --fetch (or --source <checkout>)' }, null, 2));
      process.exit(1);
    }
    console.log(JSON.stringify({ state: 'PASS', lens: path.relative(ROOT, outFile), sourceCommit: actual.sourceCommit }, null, 2));
    return;
  }

  let source = args.source ? path.resolve(args.source) : null;
  let commit = args.commit ?? adapter.repository.commit;
  if (!source && args.flags.has('fetch')) source = fetchCheckout(adapter, commit);
  if (!source) throw new Error('pass --source <VexLife-Android checkout>, --fetch, or --verify');
  let observedAt = null;
  try {
    const head = git(source, 'rev-parse', 'HEAD');
    if (!args.commit) commit = head;
    else if (head !== commit) throw new Error(`checkout is at ${head}, not ${commit}`);
    observedAt = git(source, 'log', '-1', '--format=%cs', 'HEAD');
  } catch (error) {
    if (/checkout is at/.test(error.message)) throw error;
  }
  const pinned = { ...adapter, repository: { ...adapter.repository, commit } };
  const pinnedText = stable(pinned);
  const { lens, report } = projectAndroidScreenLens({ adapter: pinned, files: readSources(pinned, source), overlay: overlayText ? JSON.parse(overlayText) : null, observedAt });
  normalizeScreenLens(lens);
  const problems = verifyLayouts(lens);
  if (problems.length) throw new Error(`generated lens has layout overlaps:\n${problems.join('\n')}`);
  const output = stable({ ...lens, provenance: provenanceFor(pinned, overlayText ? JSON.parse(overlayText) : null) });
  const summary = { state: 'PASS', lens: path.relative(ROOT, outFile), sourceCommit: commit, screens: report.screens, elements: report.elements, pathways: report.pathways, familyBonds: report.bonds.length, held: report.held.length, unknownCalls: report.unknownCalls.length };

  if (args.flags.has('check')) {
    const current = fs.existsSync(outFile) ? fs.readFileSync(outFile, 'utf8') : '';
    if (current !== output || stable(adapter) !== pinnedText) {
      console.error(JSON.stringify({ ...summary, state: 'STALE', fix: 'rerun without --check and commit the result' }, null, 2));
      process.exit(1);
    }
    console.log(JSON.stringify(summary, null, 2));
    return;
  }
  fs.writeFileSync(outFile, output);
  if (stable(adapter) !== pinnedText) fs.writeFileSync(adapterFile, pinnedText);
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
