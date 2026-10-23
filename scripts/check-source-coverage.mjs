#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LCOV_PATH = path.join(ROOT, 'coverage.lcov');
const BASELINE_PATH = path.join(ROOT, 'blueprint', 'source-coverage-baseline.json');

function normalizeSourcePath(value) {
  let sourcePath = value.trim();
  if (sourcePath.startsWith('file:')) sourcePath = fileURLToPath(sourcePath);
  if (path.isAbsolute(sourcePath)) sourcePath = path.relative(ROOT, sourcePath);
  return sourcePath.split(path.sep).join('/').replace(/^\.\//u, '');
}

function isOwnedSource(sourcePath) {
  return /^src\/.+\.mjs$/u.test(sourcePath)
    || /^[^/]+-reader\.js$/u.test(sourcePath);
}

function parseLcov(text) {
  const records = [];
  let current = null;
  for (const rawLine of text.split(/\r?\n/u)) {
    const line = rawLine.trim();
    if (line.startsWith('SF:')) {
      if (current) records.push(current);
      current = {
        sourcePath: normalizeSourcePath(line.slice(3)),
        lines: { found: 0, hit: 0 },
        branches: { found: 0, hit: 0 },
        functions: { found: 0, hit: 0 },
      };
      continue;
    }
    if (!current) continue;
    if (line.startsWith('LF:')) current.lines.found = Number(line.slice(3));
    else if (line.startsWith('LH:')) current.lines.hit = Number(line.slice(3));
    else if (line.startsWith('BRF:')) current.branches.found = Number(line.slice(4));
    else if (line.startsWith('BRH:')) current.branches.hit = Number(line.slice(4));
    else if (line.startsWith('FNF:')) current.functions.found = Number(line.slice(4));
    else if (line.startsWith('FNH:')) current.functions.hit = Number(line.slice(4));
    else if (line === 'end_of_record') {
      records.push(current);
      current = null;
    }
  }
  if (current) records.push(current);
  return records;
}

function percent({ found, hit }) {
  if (found === 0) return 100;
  return Number(((hit / found) * 100).toFixed(2));
}

function add(left, right) {
  return { found: left.found + right.found, hit: left.hit + right.hit };
}

if (!fs.existsSync(LCOV_PATH)) {
  throw new Error('coverage.lcov missing; run npm run test:coverage first');
}

const records = parseLcov(fs.readFileSync(LCOV_PATH, 'utf8'))
  .filter((record) => isOwnedSource(record.sourcePath))
  .sort((left, right) => left.sourcePath.localeCompare(right.sourcePath));

if (records.length === 0) throw new Error('coverage.lcov contains no owned VexWork source entries');

const totals = records.reduce((result, record) => ({
  lines: add(result.lines, record.lines),
  branches: add(result.branches, record.branches),
  functions: add(result.functions, record.functions),
}), {
  lines: { found: 0, hit: 0 },
  branches: { found: 0, hit: 0 },
  functions: { found: 0, hit: 0 },
});

const baseline = JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf8'));
if (baseline?.schemaVersion !== 'vexwork.source-coverage-baseline/v1') {
  throw new Error('source coverage baseline schema mismatch');
}
if (JSON.stringify(baseline.sourcePolicy) !== JSON.stringify(['src/**/*.mjs', '*-reader.js'])) {
  throw new Error('source coverage baseline policy mismatch');
}

function assertFloor(label, actual, minimum, failures) {
  if (actual < minimum) failures.push(`${label} ${actual}% < floor ${minimum}%`);
}

const failures = [];
const aggregatePercents = {
  lines: percent(totals.lines),
  branches: percent(totals.branches),
  functions: percent(totals.functions),
};
assertFloor('aggregate lines', aggregatePercents.lines, baseline.minimum.lines, failures);
assertFloor('aggregate branches', aggregatePercents.branches, baseline.minimum.branches, failures);
assertFloor('aggregate functions', aggregatePercents.functions, baseline.minimum.functions, failures);

const recordByPath = new Map(records.map((record) => [record.sourcePath, record]));
for (const [sourcePath, floors] of Object.entries(baseline.criticalFiles ?? {})) {
  const record = recordByPath.get(sourcePath);
  if (!record) {
    failures.push(`critical source missing from coverage: ${sourcePath}`);
    continue;
  }
  assertFloor(`${sourcePath} lines`, percent(record.lines), floors.lines, failures);
  assertFloor(`${sourcePath} branches`, percent(record.branches), floors.branches, failures);
  assertFloor(`${sourcePath} functions`, percent(record.functions), floors.functions, failures);
}

const report = {
  schemaVersion: 'vexwork.source-coverage/v1',
  state: failures.length ? 'REGRESSION' : 'PASS',
  baselineRef: baseline.baselineRef,
  sourcePolicy: ['src/**/*.mjs', '*-reader.js'],
  fileCount: records.length,
  totals: {
    lines: { ...totals.lines, percent: aggregatePercents.lines, minimum: baseline.minimum.lines },
    branches: { ...totals.branches, percent: aggregatePercents.branches, minimum: baseline.minimum.branches },
    functions: { ...totals.functions, percent: aggregatePercents.functions, minimum: baseline.minimum.functions },
  },
  files: records.map((record) => ({
    sourcePath: record.sourcePath,
    lines: { ...record.lines, percent: percent(record.lines) },
    branches: { ...record.branches, percent: percent(record.branches) },
    functions: { ...record.functions, percent: percent(record.functions) },
  })),
  failures,
};

console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exitCode = 1;

// [VXG RealForever]
