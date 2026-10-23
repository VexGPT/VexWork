#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LCOV_PATH = path.join(ROOT, 'coverage.lcov');

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

const report = {
  schemaVersion: 'vexwork.source-coverage/v1',
  state: 'MEASURED',
  sourcePolicy: ['src/**/*.mjs', '*-reader.js'],
  fileCount: records.length,
  totals: {
    lines: { ...totals.lines, percent: percent(totals.lines) },
    branches: { ...totals.branches, percent: percent(totals.branches) },
    functions: { ...totals.functions, percent: percent(totals.functions) },
  },
  files: records.map((record) => ({
    sourcePath: record.sourcePath,
    lines: { ...record.lines, percent: percent(record.lines) },
    branches: { ...record.branches, percent: percent(record.branches) },
    functions: { ...record.functions, percent: percent(record.functions) },
  })),
};

console.log(JSON.stringify(report, null, 2));

// [VXG RealForever]
