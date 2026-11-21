#!/usr/bin/env node
// Build/check the Android patient-zero Localization Inventory from the accepted Screen Lens projection.
//
// The Screen Lens already owns source fetching/parsing and carries stable Product/Screen/Element identity,
// resolved default-locale text, and exact source currentness. This builder consumes that projection rather
// than creating a second Android Kotlin parser.
//
//   node scripts/build-localization-inventory.mjs
//   node scripts/build-localization-inventory.mjs --subject vexlife-android --build main
//   node scripts/build-localization-inventory.mjs --check
//
// A1 intentionally emits only explicit source-bound occurrences. Candidate semantic grouping and
// non-source locale variants are later work.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  localizationOccurrencesCsv,
  localizationStringsCsv,
} from '../src/shared/vexboard-localization-inventory.mjs';
import { projectAndroidLocalizationInventory } from '../src/core/vexboard-localization-android.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CATALOG = 'projects/vexboard/lens/catalog.json';
const LENS_DIR = 'projects/vexboard/lens';
const OUTPUT_DIR = 'projects/localization-architecture/inventory';

function parseArgs(argv) {
  const args = { subject: 'vexlife-android', build: 'main', check: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--check') args.check = true;
    else if (arg === '--subject') args.subject = argv[++i];
    else if (arg === '--build') args.build = argv[++i];
    else throw new Error(`unexpected argument ${arg}`);
  }
  return args;
}

const readJson = (relative) => JSON.parse(fs.readFileSync(path.join(ROOT, relative), 'utf8'));
const stable = (value) => JSON.stringify(value, null, 2) + '\n';

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

export function buildLocalizationArtifacts({ catalog, subjectSlug = 'vexlife-android', buildRef = 'main', lens }) {
  const subject = subjectFor(catalog, subjectSlug);
  if (subject.slug !== 'vexlife-android') {
    throw new Error('A1 only admits the VexLife Android localization producer');
  }
  const build = buildFor(subject, buildRef);
  if (lens.sourceSnapshot?.commit !== build.commit) {
    throw new Error(`${subject.slug} ${buildRef} Lens source ${lens.sourceSnapshot?.commit ?? 'missing'} disagrees with catalog ${build.commit}`);
  }
  const inventory = projectAndroidLocalizationInventory({
    subjectRef: subject.subjectRef,
    lens,
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
  const artifacts = buildLocalizationArtifacts({
    catalog,
    subjectSlug: subject.slug,
    buildRef: args.build,
    lens,
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
      fix: 'node scripts/build-localization-inventory.mjs',
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
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
