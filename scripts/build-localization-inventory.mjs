#!/usr/bin/env node
// Build/check normalized Localization Inventory sidecars for every supported Screen Lens subject.
//
// The shared VexBoard frame owns the Localization experience. Product-specific adapters only map
// rightful Product localization source into the shared inventory contract.
//
//   node scripts/build-localization-inventory.mjs --fetch
//   node scripts/build-localization-inventory.mjs --fetch --check
//   node scripts/build-localization-inventory.mjs --subject vexlife-prod --fetch
//   node scripts/build-localization-inventory.mjs --subject vexlife-android --source <checkout>

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
import {
  VEXLIFE_PROD_STRING_SOURCE_PATHS,
  projectVexLifeProdLocalizationInventory,
} from '../src/core/vexboard-localization-vexlife-prod.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CATALOG = 'projects/vexboard/lens/catalog.json';
const LENS_DIR = 'projects/vexboard/lens';
const OUTPUT_DIR = 'projects/localization-architecture/inventory';

function parseArgs(argv) {
  const args = { subject: null, build: 'main', check: false, fetch: false, source: null };
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
  if (args.source && !args.subject) throw new Error('--source requires one --subject because Products have separate repositories');
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

function androidSourcePaths(subject) {
  if (!subject.lens?.adapter) throw new Error(`${subject.slug} has no Android Lens adapter`);
  const adapter = readJson(path.posix.join(LENS_DIR, subject.lens.adapter));
  if (!Array.isArray(adapter.stringResources) || !adapter.stringResources.length) {
    throw new Error(`${subject.slug} adapter declares no stringResources`);
  }
  return adapter.stringResources;
}

const PRODUCERS = Object.freeze({
  'vexlife-android': Object.freeze({
    sourcePaths: androidSourcePaths,
    project({ subject, buildRef, lens, source }) {
      const sourceStrings = androidSourcePaths(subject).flatMap((resource) => {
        const file = path.join(source, resource);
        if (!fs.existsSync(file)) throw new Error(`missing Android string resource ${resource}`);
        return androidSourceStrings(fs.readFileSync(file, 'utf8'), { sourcePath: resource });
      });
      return projectAndroidLocalizationInventoryFromSourceStrings({
        subjectRef: subject.subjectRef,
        lens,
        sourceStrings,
        sourceLocale: 'en',
        buildRef,
      });
    },
  }),
  'vexlife-prod': Object.freeze({
    sourcePaths: () => [...VEXLIFE_PROD_STRING_SOURCE_PATHS],
    project({ subject, buildRef, lens, source }) {
      const sourceFiles = Object.fromEntries(VEXLIFE_PROD_STRING_SOURCE_PATHS.map((sourcePath) => {
        const file = path.join(source, sourcePath);
        if (!fs.existsSync(file)) throw new Error(`missing VexLife Prod localization source ${sourcePath}`);
        return [sourcePath, fs.readFileSync(file, 'utf8')];
      }));
      return projectVexLifeProdLocalizationInventory({
        subjectRef: subject.subjectRef,
        lens,
        sourceFiles,
        sourceLocale: 'en',
        buildRef,
      });
    },
  }),
});

function fetchSource(subject, sourcePaths, commit) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'localization-inventory-'));
  git(dir, 'init', '-q');
  git(dir, 'remote', 'add', 'origin', subject.repository.url);
  git(dir, 'config', 'core.sparseCheckout', 'true');
  fs.writeFileSync(
    path.join(dir, '.git', 'info', 'sparse-checkout'),
    sourcePaths.map((resource) => `/${resource}`).join('\n') + '\n',
  );
  git(dir, 'fetch', '-q', '--depth', '1', 'origin', commit);
  git(dir, 'checkout', '-q', 'FETCH_HEAD');
  const head = git(dir, 'rev-parse', 'HEAD');
  if (head !== commit) throw new Error(`fetched ${subject.slug} source is at ${head}, not ${commit}`);
  return dir;
}

function artifactsForInventory(subject, buildRef, inventory) {
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

export function supportedLocalizationSubjects() {
  return Object.keys(PRODUCERS);
}

export function buildLocalizationArtifacts({
  catalog,
  subjectSlug,
  buildRef = 'main',
  lens,
  source,
}) {
  const subject = subjectFor(catalog, subjectSlug);
  const producer = PRODUCERS[subject.slug];
  if (!producer) throw new Error(`${subject.slug} has no Localization source adapter yet`);
  const build = buildFor(subject, buildRef);
  if (lens.sourceSnapshot?.commit !== build.commit) {
    throw new Error(`${subject.slug} ${buildRef} Lens source ${lens.sourceSnapshot?.commit ?? 'missing'} disagrees with catalog ${build.commit}`);
  }
  const inventory = producer.project({ subject, buildRef, lens, source });
  return artifactsForInventory(subject, buildRef, inventory);
}

function sourceCheckoutFor({ args, subject, build, producer }) {
  if (args.source) {
    const source = path.resolve(args.source);
    let sourceHead;
    try { sourceHead = git(source, 'rev-parse', 'HEAD'); }
    catch { throw new Error('--source must be a git checkout so source currentness can be proven'); }
    if (sourceHead !== build.commit) {
      throw new Error(`${subject.slug} source checkout is at ${sourceHead}, not bound ${build.commit}`);
    }
    return { source, temporary: false };
  }
  if (!args.fetch) throw new Error('pass --fetch or --source <checkout>');
  return {
    source: fetchSource(subject, producer.sourcePaths(subject), build.commit),
    temporary: true,
  };
}

function buildOne({ args, catalog, subjectSlug }) {
  const subject = subjectFor(catalog, subjectSlug);
  const producer = PRODUCERS[subject.slug];
  if (!producer) throw new Error(`${subject.slug} has no Localization source adapter yet`);
  const build = buildFor(subject, args.build);
  const lens = readJson(path.posix.join(LENS_DIR, build.lens));
  const { source, temporary } = sourceCheckoutFor({ args, subject, build, producer });

  try {
    return {
      subject,
      ...buildLocalizationArtifacts({
        catalog,
        subjectSlug: subject.slug,
        buildRef: args.build,
        lens,
        source,
      }),
    };
  } finally {
    if (temporary) fs.rmSync(source, { recursive: true, force: true });
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const catalog = readJson(CATALOG);
  const subjects = args.subject ? [args.subject] : supportedLocalizationSubjects();
  const built = subjects.map((subjectSlug) => buildOne({ args, catalog, subjectSlug }));

  fs.mkdirSync(path.join(ROOT, OUTPUT_DIR), { recursive: true });
  const stale = [];
  const outputs = [];

  for (const result of built) {
    for (const [name, content] of Object.entries(result.files)) {
      const relative = path.posix.join(OUTPUT_DIR, name);
      const file = path.join(ROOT, relative);
      outputs.push(relative);
      if (args.check) {
        const current = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
        if (current !== content) stale.push(relative);
      } else {
        fs.writeFileSync(file, content);
      }
    }
  }

  if (stale.length) {
    console.error(JSON.stringify({
      state: 'STALE',
      build: args.build,
      subjects: built.map((result) => result.subject.slug),
      stale,
      fix: 'npm run localization:build',
    }, null, 2));
    process.exitCode = 1;
    return;
  }

  console.log(JSON.stringify({
    state: 'PASS',
    mode: args.check ? 'CHECK' : 'BUILD',
    build: args.build,
    subjects: built.map((result) => ({
      subject: result.subject.slug,
      sourceCommit: result.inventory.sourceSnapshot.commit,
      summary: result.inventory.summary,
    })),
    outputs,
  }, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
