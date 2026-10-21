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
});

test('unknown repository references fail closed', () => {
  assert.equal(assertKnownRepositoryRefs(['repo.vexwork', 'repo.vexlife'], registry), true);
  assert.throws(() => assertKnownRepositoryRefs(['repo.private.unregistered'], registry), /unknown repositoryRef/);
});
