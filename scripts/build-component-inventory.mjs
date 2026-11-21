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
    subject: DEFAULT_SUBJECT,
    build: DEFAULT_BUILD,
    check: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--check') args.check = true;
    else if (arg === '--subject') args.subject = argv[++index];
    else if (arg === '--build') args.build = argv[++index];
    else throw new Error('unexpected argument ' + arg);
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
  const expected = componentInventoryBytes(
    ROOT,
    args.subject,
    args.build,
  );
  const output = outputPath(
    ROOT,
    args.subject,
    args.build,
  );

  if (args.check) {
    const current = fs.existsSync(output)
      ? fs.readFileSync(output, 'utf8')
      : '';
    if (current !== expected) {
      console.error(
        'Component inventory is stale for ' +
          args.subject +
          ' ' +
          args.build +
          '; run npm run components:build -- --subject ' +
          args.subject,
      );
      process.exitCode = 1;
      return;
    }
    const inventory = JSON.parse(expected);
    console.log(
      JSON.stringify(
        {
          state: 'PASS',
          mode: 'CHECK',
          subject: args.subject,
          build: args.build,
          sourceCommit: inventory.sourceSnapshot.commit,
          summary: inventory.summary,
        },
        null,
        2,
      ),
    );
    return;
  }

  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, expected, 'utf8');
  const inventory = JSON.parse(expected);
  console.log(
    JSON.stringify(
      {
        state: 'PASS',
        mode: 'BUILD',
        subject: args.subject,
        build: args.build,
        sourceCommit: inventory.sourceSnapshot.commit,
        output: path.relative(ROOT, output).replaceAll('\\', '/'),
        summary: inventory.summary,
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
