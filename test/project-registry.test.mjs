import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { assertKnownProjectRefs, projectProjectRegistry, validateProjectRegistry } from '../src/core/project-registry.mjs';
import { verifySemanticFingerprint } from '../src/core/semantic.mjs';

const registry = JSON.parse(fs.readFileSync(new URL('../blueprint/project-registry.json', import.meta.url), 'utf8'));

test('Project Registry locates Projects without owning their WorkState', () => {
  const validation = validateProjectRegistry(registry);
  assert.equal(validation.ok, true, validation.errors.join('\n'));
  const projection = projectProjectRegistry(registry);
  assert.equal(projection.projects.length, 1);
  assert.equal(projection.projects[0].projectRef, 'project.vexwork.foundation');
  assert.equal(projection.projects[0].workgraphRef, 'workgraph.vexwork.foundation');
  assert.equal(projection.effects, false);
  assert.equal(projection.executionAuthority, 'NONE');
  assert.equal(verifySemanticFingerprint(projection), true);
});

test('Project Registry fails closed for duplicate Projects and unknown refs', () => {
  const duplicate = structuredClone(registry);
  duplicate.projects.push(structuredClone(duplicate.projects[0]));
  assert.equal(validateProjectRegistry(duplicate).ok, false);
  assert.equal(assertKnownProjectRefs(['project.vexwork.foundation'], registry), true);
  assert.throws(() => assertKnownProjectRefs(['project.unknown'], registry), /unknown projectRef/);
});
