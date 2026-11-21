#!/usr/bin/env node
// Build/check the Android patient-zero Localization Inventory from two truthful source projections:
//
//   Screen Lens   -> Product / Screen / Element identity + explicit R.string binding
//   strings.xml   -> exact source string identity + source/default value
//
// No second Android Kotlin element parser is introduced.
//
//   node scripts/build-localization-inventory.mjs --fetch
//   node scripts/build-localization-inventory.mjs --source <android-checkout>
//   node scripts/build-localization-inventory.mjs --fetch --check
//
// A1 intentionally does not infer semantic duplicate groups or translated locale values.

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  localizationOccurrencesCsv,
  localizationStringsCsv,
} from '../src/shared/vexboard-localization-inventory.mjs';
import {
  androidSourceStrings,
  projectAndroidLocalizationInventoryFromSourceStrings,
} from '../src/core/vexboard-localization-android.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CATALOG = 'projects/vexboard/lens/catalog.json';
const LENS_DIR = 'projects/vexboard/lens';
const OUTPUT_DIR = 'projects/localization-architecture/inventory';

function parseArgs(argv) {
  const args = { subject: 'vexlife-android', build: 'main', check: false, fetch: false, source: null };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--check') args.check = true;
    else if (arg === '--fetch') args.fetch = true;
    else if (arg === '--subject') args.subject = argv[++i];
    else if (arg === '--build') args.build = argv[++i];
    else if (arg === '--source') args.source = argv[++i];
    else throw new Error(`unexpected argument ${arg}`);
  }
  if (args.fetch && args.source) throw new Error('choose --fetch or --source, not both');
  return args;
}

const readJson = (relative) => JSON.parse(fs.readFileSync(path.join(ROOT, relative), 'utf8'));
const stable = (value) => JSON.stringify(value, null, 2) + '\n';
const git = (cwd, ...args) => execFileSync('git', ['-C', cwd, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

function subjectFor(catalog, slug) {
  const subject = catalog.subjects.find((row) => row.slug === slug || row.subjectRef === slug);
  if (!subject) throw new Error(`unknown Lens subject ${slug}`);
  return subject;
}

function buildFor(subject, buildRef) {
  const build = subject.lens?.builds?.find((row) => row.buildRef === buildRef);
  if (!build) throw new Error(`${subject.slug} has no ${buildRef} build`);
  return build;
}

function adapterFor(subject) {
  if (!subject.lens?.adapter) throw new Error(`${subject.slug} has no Android Lens adapter`);
  const adapter = readJson(path.posix.join(LENS_DIR, subject.lens.adapter));
  if (!Array.isArray(adapter.stringResources) || !adapter.stringResources.length) {
    throw new Error(`${subject.slug} adapter declares no stringResources`);
  }
  return adapter;
}

function fetchSource(subject, adapter, commit) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'localization-inventory-'));
  git(dir, 'init', '-q');
  git(dir, 'remote', 'add', 'origin', subject.repository.url);
  git(dir, 'config', 'core.sparseCheckout', 'true');
  fs.writeFileSync(
    path.join(dir, '.git', 'info', 'sparse-checkout'),
    adapter.stringResources.map((resource) => `/${resource}`).join('\n') + '\n',
  );
  git(dir, 'fetch', '-q', '--depth', '1', 'origin', commit);
  git(dir, 'checkout', '-q', 'FETCH_HEAD');
  const head = git(dir, 'rev-parse', 'HEAD');
  if (head !== commit) throw new Error(`fetched source is at ${head}, not ${commit}`);
  return dir;
}

function readSourceStrings(adapter, source) {
  return adapter.stringResources.flatMap((resource) => {
    const file = path.join(source, resource);
    if (!fs.existsSync(file)) throw new Error(`missing Android string resource ${resource}`);
    return androidSourceStrings(fs.readFileSync(file, 'utf8'), { sourcePath: resource });
  });
}

export function buildLocalizationArtifacts({
  catalog,
  subjectSlug = 'vexlife-android',
  buildRef = 'main',
  lens,
  sourceStrings,
}) {
  const subject = subjectFor(catalog, subjectSlug);
  if (subject.slug !== 'vexlife-android') {
    throw new Error('A1 only admits the VexLife Android localization producer');
  }
  const build = buildFor(subject, buildRef);
  if (lens.sourceSnapshot?.commit !== build.commit) {
    throw new Error(`${subject.slug} ${buildRef} Lens source ${lens.sourceSnapshot?.commit ?? 'missing'} disagrees with catalog ${build.commit}`);
  }
  const inventory = projectAndroidLocalizationInventoryFromSourceStrings({
    subjectRef: subject.subjectRef,
    lens,
    sourceStrings,
    sourceLocale: 'en',
    buildRef,
  });
  const base = `${subject.slug}.${buildRef}.localization`;
  return {
    inventory,
    files: {
      [`${base}.json`]: stable(inventory),
      [`${base}.occurrences.csv`]: localizationOccurrencesCsv(inventory),
      [`${base}.strings.csv`]: localizationStringsCsv(inventory),
    },
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const catalog = readJson(CATALOG);
  const subject = subjectFor(catalog, args.subject);
  const build = buildFor(subject, args.build);
  const lens = readJson(path.posix.join(LENS_DIR, build.lens));
  const adapter = adapterFor(subject);

  let source = args.source ? path.resolve(args.source) : null;
  let temporary = false;
  if (!source && args.fetch) {
    source = fetchSource(subject, adapter, build.commit);
    temporary = true;
  }
  if (!source) throw new Error('pass --fetch or --source <android-checkout>');

  if (!temporary) {
    let sourceHead;
    try {
      sourceHead = git(source, 'rev-parse', 'HEAD');
    } catch {
      throw new Error('--source must be an Android git checkout so source currentness can be proven');
    }
    if (sourceHead !== build.commit) {
      throw new Error(`Android source checkout is at ${sourceHead}, not bound ${build.commit}`);
    }
  }

  try {
    const artifacts = buildLocalizationArtifacts({
      catalog,
      subjectSlug: subject.slug,
      buildRef: args.build,
      lens,
      sourceStrings: readSourceStrings(adapter, source),
    });

    fs.mkdirSync(path.join(ROOT, OUTPUT_DIR), { recursive: true });
    const stale = [];
    for (const [name, content] of Object.entries(artifacts.files)) {
      const file = path.join(ROOT, OUTPUT_DIR, name);
      if (args.check) {
        const current = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
        if (current !== content) stale.push(path.posix.join(OUTPUT_DIR, name));
      } else {
        fs.writeFileSync(file, content);
      }
    }

    if (stale.length) {
      console.error(JSON.stringify({
        state: 'STALE',
        subject: subject.slug,
        build: args.build,
        sourceCommit: artifacts.inventory.sourceSnapshot.commit,
        stale,
        fix: 'npm run localization:build',
      }, null, 2));
      process.exitCode = 1;
      return;
    }

    console.log(JSON.stringify({
      state: 'PASS',
      mode: args.check ? 'CHECK' : 'BUILD',
      subject: subject.slug,
      build: args.build,
      sourceCommit: artifacts.inventory.sourceSnapshot.commit,
      summary: artifacts.inventory.summary,
      outputs: Object.keys(artifacts.files).map((name) => path.posix.join(OUTPUT_DIR, name)),
    }, null, 2));
  } finally {
    if (temporary && source) fs.rmSync(source, { recursive: true, force: true });
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
