#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createComponentInventory } from '../src/shared/vexboard-component-inventory.mjs';
import {
  bindLensBuildSource,
  buildFor,
  normalizeLensCatalog,
  subjectFor,
} from '../src/shared/vexboard-lens-catalog.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CATALOG_PATH = 'projects/vexboard/lens/catalog.json';
const LENS_DIR = 'projects/vexboard/lens';
const LOCALIZATION_DIR = 'projects/localization-architecture/inventory';
const OUTPUT_DIR = 'projects/component-library-architecture/inventory';
const DEFAULT_SUBJECT = 'vexlife-android';
const DEFAULT_BUILD = 'main';

const PRODUCERS = Object.freeze({
  'vexlife-android': Object.freeze({
    ref: 'producer.vexboard.components.android-screen-lens',
    version: 'vexlife-android-components/1',
  }),
});

const readJson = (root, relative) =>
  JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));

function parseArgs(argv) {
  const args = {
    subject: null,
    build: DEFAULT_BUILD,
    check: false,
    all: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--check') args.check = true;
    else if (arg === '--all') args.all = true;
    else if (arg === '--subject') args.subject = argv[++index];
    else if (arg === '--build') args.build = argv[++index];
    else throw new Error('unexpected argument ' + arg);
  }
  if (args.all && args.subject) {
    throw new Error('choose --all or --subject, not both');
  }
  return args;
}

function producerFor(subject) {
  return PRODUCERS[subject.slug] ?? {
    ref: 'producer.vexboard.components.screen-lens',
    version: subject.slug + '-components/1',
  };
}

function localizationInventoryFor(root, subject, buildRef) {
  const relative = path.posix.join(
    LOCALIZATION_DIR,
    subject.slug + '.' + buildRef + '.localization.json',
  );
  const file = path.join(root, relative);
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : null;
}

export function buildComponentInventory({
  root = ROOT,
  subjectSlug = DEFAULT_SUBJECT,
  buildRef = DEFAULT_BUILD,
} = {}) {
  const catalog = normalizeLensCatalog(readJson(root, CATALOG_PATH));
  const subject = subjectFor(catalog, subjectSlug);
  if (!subject) throw new TypeError('component inventory: unknown Lens subject ' + subjectSlug);

  const build = buildFor(subject, buildRef);
  if (!build) {
    throw new TypeError(
      'component inventory: ' + subject.slug + ' has no ' + buildRef + ' Lens build',
    );
  }

  const lens = readJson(root, path.posix.join(LENS_DIR, build.lens));
  if (
    lens.sourceSnapshot?.commit &&
    lens.sourceSnapshot.commit !== build.commit
  ) {
    throw new TypeError(
      'component inventory: ' +
        subject.slug +
        ' Lens embedded commit ' +
        lens.sourceSnapshot.commit +
        ' disagrees with catalog ' +
        build.commit,
    );
  }
  const boundLens = bindLensBuildSource(lens, build);
  const localizationInventory = localizationInventoryFor(
    root,
    subject,
    buildRef,
  );

  return createComponentInventory({
    inventoryRef: 'components.' + subject.slug + '.' + buildRef,
    subjectRef: subject.subjectRef,
    buildRef,
    lens: boundLens,
    localizationInventory,
    producer: producerFor(subject),
  });
}

export function buildAndroidComponentInventory(root = ROOT) {
  return buildComponentInventory({
    root,
    subjectSlug: DEFAULT_SUBJECT,
    buildRef: DEFAULT_BUILD,
  });
}

export function componentInventoryBytes(
  root = ROOT,
  subjectSlug = DEFAULT_SUBJECT,
  buildRef = DEFAULT_BUILD,
) {
  return (
    JSON.stringify(
      buildComponentInventory({
        root,
        subjectSlug,
        buildRef,
      }),
      null,
      2,
    ) + '\n'
  );
}

function outputPath(root, subjectSlug, buildRef) {
  return path.join(
    root,
    OUTPUT_DIR,
    subjectSlug + '.' + buildRef + '.components.json',
  );
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const catalog = normalizeLensCatalog(readJson(ROOT, CATALOG_PATH));
  const subjects = args.all
    ? catalog.subjects
        .filter((subject) => buildFor(subject, args.build))
        .map((subject) => subject.slug)
    : [args.subject ?? DEFAULT_SUBJECT];

  const results = subjects.map((subjectSlug) => {
    const expected = componentInventoryBytes(
      ROOT,
      subjectSlug,
      args.build,
    );
    const output = outputPath(
      ROOT,
      subjectSlug,
      args.build,
    );
    const inventory = JSON.parse(expected);
    return {
      subjectSlug,
      expected,
      output,
      inventory,
    };
  });

  const stale = [];
  fs.mkdirSync(path.join(ROOT, OUTPUT_DIR), { recursive: true });

  for (const result of results) {
    if (args.check) {
      const current = fs.existsSync(result.output)
        ? fs.readFileSync(result.output, 'utf8')
        : '';
      if (current !== result.expected) {
        stale.push(
          path.relative(ROOT, result.output).replaceAll('\\', '/'),
        );
      }
    } else {
      fs.writeFileSync(result.output, result.expected, 'utf8');
    }
  }

  if (stale.length) {
    console.error(
      JSON.stringify(
        {
          state: 'STALE',
          mode: 'CHECK',
          build: args.build,
          subjects,
          stale,
          fix: 'npm run components:build',
        },
        null,
        2,
      ),
    );
    process.exitCode = 1;
    return;
  }

  console.log(
    JSON.stringify(
      {
        state: 'PASS',
        mode: args.check ? 'CHECK' : 'BUILD',
        build: args.build,
        subjects: results.map((result) => ({
          subject: result.subjectSlug,
          sourceCommit: result.inventory.sourceSnapshot.commit,
          output: path.relative(ROOT, result.output).replaceAll('\\', '/'),
          summary: result.inventory.summary,
        })),
      },
      null,
      2,
    ),
  );
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  main();
}

// [VXG RealForever][VEXWORK][COMPONENT-LIBRARY][CATALOG-SUBJECT-BUILDER]
