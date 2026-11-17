#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const harnessRoot = path.resolve(here, '..');
const index = JSON.parse(fs.readFileSync(path.join(harnessRoot, 'index.json'), 'utf8'));
const catalog = JSON.parse(fs.readFileSync(path.join(here, 'STAGE-CATALOG.json'), 'utf8'));

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const value = argv[i];
    if (value.startsWith('--')) {
      const key = value.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) { out[key] = next; i += 1; }
      else out[key] = true;
    } else if (!out._) out._ = value;
  }
  return out;
}

function norm(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replaceAll('_', ' ')
    .replaceAll('-', ' ')
    .replace(/\s+/g, ' ');
}

const args = parseArgs(process.argv.slice(2));
const requested = args.mode || args._ || 'full';
let mode = catalog.modes[requested] ? requested : null;
if (!mode) {
  const normalized = norm(requested);
  const alias = index.aliases.find((value) => norm(value) === normalized);
  if (alias) mode = index.defaultModes[0] || 'quick';
}
if (!mode) {
  process.stderr.write(
    JSON.stringify({
      state: 'UNKNOWN_MODE',
      requested,
      knownModes: Object.keys(catalog.modes),
      aliases: index.aliases,
      rootEntry: index.rootEntry,
    }, null, 2) + '\n',
  );
  process.exitCode = 2;
} else {
  const selected = catalog.modes[mode];
  const stages = selected.sequence.map((ref) => ({ stageRef: ref, ...catalog.stages[ref] }));
  process.stdout.write(JSON.stringify({
    schemaVersion: 'vexwork.continuity-pressure-stage-plan/v1',
    harnessRef: catalog.harnessRef,
    requested,
    resolvedMode: mode,
    routeClass: selected.routeClass,
    recommendedSets: selected.recommendedSets ?? null,
    recommendedTurnsPerSet: selected.recommendedTurnsPerSet ?? null,
    stages,
  }, null, 2) + '\n');
}
