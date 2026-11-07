import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import * as Lens from '../src/shared/vexboard-screen-lens.mjs';
import {
  normalizeScreenLensExpressionFixture,
} from '../src/shared/vexboard-screen-lens-expressions.mjs';
import {
  compareEventsExpressionFixtureSource,
  eventsExpressionSourceReadPlan,
  projectEventsExpressionSource,
} from '../src/core/vexboard-screen-lens-events-expression-source.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LENS = 'projects/vexboard/lens/vexlife-android.screen-lens.json';
const FIXTURE =
  'projects/vexboard/examples/vexlife-android-events.screen-lens-expressions.fixture.json';

function fail(message) {
  throw new Error(`screen lens Events expression source check: ${message}`);
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg !== '--source') fail(`unexpected argument ${arg}`);
    args.source = argv[++index];
  }
  if (!args.source) fail('pass --source <VexLife-Android checkout>');
  return args;
}

function readJson(relative) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relative), 'utf8'));
}

function git(cwd, ...args) {
  return execFileSync('git', ['-C', cwd, ...args], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function sourceCommitFromRef(sourceRevisionRef) {
  const match =
    /^git\.commit\.vexlife-android\.([0-9a-f]{40})$/.exec(sourceRevisionRef ?? '');
  if (!match) fail(`fixture sourceRevisionRef is not an exact Android commit: ${sourceRevisionRef}`);
  return match[1];
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const sourceRoot = path.resolve(args.source);
  const lens = Lens.normalizeScreenLens(readJson(LENS));
  const fixture = normalizeScreenLensExpressionFixture(lens, readJson(FIXTURE));
  const expectedCommit = sourceCommitFromRef(fixture.sourceRevisionRef);
  const observedCommit = git(sourceRoot, 'rev-parse', 'HEAD');

  if (observedCommit !== expectedCommit) {
    fail(`Android checkout is at ${observedCommit}, fixture requires ${expectedCommit}`);
  }
  if (git(sourceRoot, 'status', '--porcelain=v1', '-uall')) {
    fail('Android checkout must be clean');
  }

  const files = new Map();
  for (const relative of eventsExpressionSourceReadPlan()) {
    const absolute = path.join(sourceRoot, relative);
    if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) {
      fail(`required source file missing: ${relative}`);
    }
    files.set(relative, fs.readFileSync(absolute, 'utf8'));
  }

  const projection = projectEventsExpressionSource({
    lens,
    files,
    sourceRevisionRef: fixture.sourceRevisionRef,
  });
  const comparison = compareEventsExpressionFixtureSource({
    fixture,
    projection,
  });

  const result = {
    state: comparison.state,
    androidCommit: observedCommit,
    lensSourceCommit: lens.sourceSnapshot.commit,
    sourceRelationshipCount: comparison.sourceRelationshipCount,
    representativeExpressionCount: comparison.representativeExpressionCount,
    filesRead: [...files.keys()],
    findings: comparison.findings,
  };

  if (comparison.state !== 'PASS') {
    console.error(JSON.stringify(result, null, 2));
    process.exit(1);
  }
  console.log(JSON.stringify(result, null, 2));
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

// [VXG RealForever][VEXWORK][VEXBOARD][SCREEN-LENS][EVENTS][EXPRESSIONS][SOURCE][CHECK]
