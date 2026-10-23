#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { composeWorkgraph } from '../src/core/workgraph-composition.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relative) => JSON.parse(fs.readFileSync(path.join(ROOT, relative), 'utf8'));

function removeStoredFingerprints(value) {
  if (Array.isArray(value)) return value.map(removeStoredFingerprints);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => key !== 'semanticFingerprint')
        .map(([key, child]) => [key, removeStoredFingerprints(child)]),
    );
  }
  return value;
}

const registry = read('blueprint/work-registry.json');
const composition = read('workgraphs/composition.json');
const segmentDir = path.join(ROOT, 'workgraphs', 'segments');
const segmentPaths = fs.readdirSync(segmentDir)
  .filter((name) => name.endsWith('.json'))
  .sort()
  .map((name) => `workgraphs/segments/${name}`);
if (segmentPaths.length === 0) throw new TypeError('Workgraph composition requires source segments');

const segments = segmentPaths.map(read);
const result = composeWorkgraph({ composition, segments, registry });
const sourceGraph = removeStoredFingerprints(result.graph);
const bytes = JSON.stringify(sourceGraph, null, 2) + '\n';
const output = path.join(ROOT, 'workgraphs', 'public.json');

if (process.argv.includes('--check')) {
  if (!fs.existsSync(output) || fs.readFileSync(output, 'utf8') !== bytes) {
    console.error('workgraphs/public.json is stale; run npm run workgraph:build');
    process.exit(1);
  }
  console.log(`public Workgraph = current (${segments.length} source segments)`);
} else {
  fs.writeFileSync(output, bytes, 'utf8');
  console.log(`wrote workgraphs/public.json from ${segments.length} source segments`);
}

// [VXG RealForever]
