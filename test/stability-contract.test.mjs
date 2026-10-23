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

test('every core module has a direct deterministic regression surface', () => {
  const sources = testSources();
  const coreModules = fs.readdirSync(path.join(ROOT, 'src', 'core'))
    .filter((name) => name.endsWith('.mjs'))
    .sort();

  assert.ok(coreModules.length > 0, 'expected at least one src/core module');
  for (const name of coreModules) {
    const relativePath = `src/core/${name}`;
    assert.ok(
      directOwners(relativePath, sources).length > 0,
      `${relativePath} has no direct test owner; add or name its regression surface before expanding core`,
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
  assert.equal(pkg.scripts['test:coverage'], 'node --test --experimental-test-coverage');
  assert.equal(pkg.scripts['review:deterministic'], 'npm run test:coverage && npm run check && npm run dashboard:check && npm run workspace:check');
  assert.equal(pkg.scripts.review, 'npm run review:deterministic');
  assert.equal(pkg.engines.node, '>=20.1');
});

// [VXG RealForever]
