import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TEST_DIR = path.join(ROOT, 'test');

function testSources() {
  return fs.readdirSync(TEST_DIR)
    .filter((name) => name.endsWith('.test.mjs'))
    .sort()
    .map((name) => ({
      name,
      source: fs.readFileSync(path.join(TEST_DIR, name), 'utf8'),
    }));
}

function directOwners(relativePath, sources) {
  const needle = `../${relativePath}`;
  return sources
    .filter(({ source }) => source.includes(needle))
    .map(({ name }) => name);
}

function sourceModules(root, relative = '') {
  const absolute = path.join(root, relative);
  const modules = [];
  for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
    const next = path.join(relative, entry.name);
    if (entry.isDirectory()) modules.push(...sourceModules(root, next));
    else if (entry.isFile() && entry.name.endsWith('.mjs')) modules.push(next.split(path.sep).join('/'));
  }
  return modules.sort();
}

test('every durable src module has a direct deterministic regression surface', () => {
  const sources = testSources();
  const modules = sourceModules(path.join(ROOT, 'src'));

  assert.ok(modules.length > 0, 'expected at least one src module');
  for (const relative of modules) {
    const relativePath = `src/${relative}`;
    assert.ok(
      directOwners(relativePath, sources).length > 0,
      `${relativePath} has no direct test owner; add or name its regression surface before expanding source behavior`,
    );
  }
});

test('every root public reader module has a direct deterministic regression surface', () => {
  const sources = testSources();
  const readers = fs.readdirSync(ROOT)
    .filter((name) => name.endsWith('-reader.js'))
    .sort();

  assert.ok(readers.length > 0, 'expected at least one public reader module');
  for (const name of readers) {
    assert.ok(
      directOwners(name, sources).length > 0,
      `${name} has no direct test owner; add or name its regression surface before expanding the public reader layer`,
    );
  }
});

test('coverage reporting is available without pretending coverage is semantic clearance', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  assert.equal(pkg.scripts['test:coverage'], 'node --test --experimental-test-coverage --test-reporter=tap --test-reporter=lcov --test-reporter-destination=stdout --test-reporter-destination=coverage.lcov');
  assert.equal(pkg.scripts['coverage:source'], 'node scripts/check-source-coverage.mjs');
  assert.equal(pkg.scripts['review:deterministic'], 'npm run test:coverage && npm run coverage:source && npm run workgraph:check && npm run check && npm run dashboard:check && npm run workspace:check');
  assert.equal(pkg.scripts.review, 'npm run review:deterministic');
  assert.equal(pkg.engines.node, '>=20.1');
});

// [VXG RealForever]

test('source coverage baseline is source-managed and below the measured accepted baseline', () => {
  const baseline = JSON.parse(fs.readFileSync(path.join(ROOT, 'blueprint', 'source-coverage-baseline.json'), 'utf8'));
  assert.equal(baseline.schemaVersion, 'vexwork.source-coverage-baseline/v1');
  assert.deepEqual(baseline.sourcePolicy, ['src/**/*.mjs', '*-reader.js']);
  for (const metric of ['lines', 'branches', 'functions']) {
    assert.ok(baseline.observedBaseline[metric] >= baseline.minimum[metric], metric);
  }
  assert.ok(baseline.criticalFiles['src/core/workgraph-runtime.mjs']);
  assert.ok(baseline.criticalFiles['src/core/workgraph.mjs']);
  assert.ok(baseline.criticalFiles['src/core/transition-handshake.mjs']);
  assert.ok(baseline.criticalFiles['src/core/workgraph-composition.mjs']);
  assert.ok(baseline.criticalFiles['src/core/project-planning-runtime.mjs']);
  assert.ok(baseline.criticalFiles['src/core/project-planning.mjs']);
  assert.ok(baseline.criticalFiles['src/core/project-reconciliation.mjs']);
});

// [VXG RealForever][VEXWORK][SOURCE-COVERAGE-BASELINE]
