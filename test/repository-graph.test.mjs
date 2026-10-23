import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { assertKnownRepositoryRefs, projectRepositoryGraph, validateRepositoryRegistry } from '../src/core/repository-graph.mjs';

const registry = JSON.parse(fs.readFileSync(new URL('../blueprint/repository-registry.json', import.meta.url), 'utf8'));

test('public Repository Graph is structurally valid and culture remains by reference', () => {
  const validation = validateRepositoryRegistry(registry);
  assert.equal(validation.ok, true, validation.errors.join('\n'));
  const graph = projectRepositoryGraph(registry);
  assert.equal(graph.effects, false);
  assert.equal(graph.executionAuthority, 'NONE');
  const android = graph.repositories.find((repository) => repository.repositoryRef === 'repo.vexlife-android');
  assert.deepEqual(android.cultureRefs, ['docs/CULTURE.md']);
  const music = graph.repositories.find((repository) => repository.repositoryRef === 'repo.vexstream-music');
  assert.equal(music.nameWithOwner, 'vgong24/VexstreamMusic');
  assert.deepEqual(music.entryRefs, ['README.md', 'v2/README.md', 'v2/architecture/README.md']);
  const sdk = graph.repositories.find((repository) => repository.repositoryRef === 'repo.vextreme-sdk');
  assert.equal(sdk.visibility, 'PRIVATE');
  assert.deepEqual(sdk.cultureRefs, []);
  const construction = graph.repositories.find((repository) => repository.repositoryRef === 'repo.vexlife-construction-reference');
  assert.equal(construction.visibility, 'PUBLIC');
  assert.deepEqual(construction.cultureRefs, ['docs/CULTURE.md']);
  const storefront = graph.repositories.find((repository) => repository.repositoryRef === 'repo.vexcommerce-storefront-reference');
  assert.equal(storefront.nameWithOwner, 'vgong24/VexCommerce-Storefront-Reference');
  assert.equal(storefront.visibility, 'PUBLIC');
  assert.deepEqual(storefront.entryRefs, ['README.md', 'AGENTS.md', 'storefront.json']);
  assert.deepEqual(storefront.cultureRefs, ['AGENTS.md']);
});

test('unknown repository references fail closed', () => {
  assert.equal(assertKnownRepositoryRefs(['repo.vexwork', 'repo.vexlife'], registry), true);
  assert.throws(() => assertKnownRepositoryRefs(['repo.private.unregistered'], registry), /unknown repositoryRef/);
});

test('repository registry validator exercises each fail-closed boundary', () => {
  const mutations = [
    ['schema', (value) => { value.schemaVersion = 'wrong'; }, /schema mismatch/],
    ['repositories array', (value) => { value.repositories = null; }, /repositories must be an array/],
    ['repository ref', (value) => { value.repositories[0].repositoryRef = 'bad-ref'; }, /invalid repositoryRef/],
    ['duplicate repository ref', (value) => { value.repositories.push(structuredClone(value.repositories[0])); }, /duplicate repositoryRef/],
    ['GitHub name', (value) => { const item = value.repositories.find((entry) => entry.provider === 'GITHUB'); item.nameWithOwner = 'invalid'; }, /invalid nameWithOwner/],
    ['duplicate GitHub name', (value) => {
      const github = value.repositories.filter((entry) => entry.provider === 'GITHUB');
      github[1].nameWithOwner = github[0].nameWithOwner;
    }, /duplicate nameWithOwner/],
    ['entry refs', (value) => { value.repositories[0].entryRefs = []; }, /entryRefs missing/],
    ['culture refs', (value) => { value.repositories[0].cultureRefs = null; }, /cultureRefs invalid/],
  ];
  for (const [label, mutate, pattern] of mutations) {
    const candidate = structuredClone(registry);
    mutate(candidate);
    const result = validateRepositoryRegistry(candidate);
    assert.equal(result.ok, false, label);
    assert.match(result.errors.join('\n'), pattern, label);
    assert.throws(() => projectRepositoryGraph(candidate), pattern, label);
  }
});
