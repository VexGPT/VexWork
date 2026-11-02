import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { assertKnownProjectRefs, projectProjectRegistry, validateProjectRegistry } from '../src/core/project-registry.mjs';
import { verifySemanticFingerprint } from '../src/core/semantic.mjs';

const registry = JSON.parse(fs.readFileSync(new URL('../blueprint/project-registry.json', import.meta.url), 'utf8'));

test('Project Registry locates current source-managed Projects without owning WorkState or default Board semantics', () => {
  const validation = validateProjectRegistry(registry);
  assert.equal(validation.ok, true, validation.errors.join('\n'));
  const projection = projectProjectRegistry(registry);

  assert.deepEqual(
    projection.projects.map((entry) => entry.projectRef),
    registry.projects.map((entry) => entry.projectRef),
  );
  assert.equal(projection.projects.every((entry) => entry.workgraphRef === 'workgraph.vexwork.foundation'), true);
  assert.equal(projection.projects.every((entry) => entry.workgraphPath === 'workgraphs/public.json'), true);

  const mobile = projection.projects.find((entry) => entry.projectRef === 'project.vexstream.mobile-library');
  assert.equal(mobile.agencyPolicyPathOrNull, 'projects/vexstream-mobile-library/agency.policy.json');

  const newBeginnings = projection.projects.find((entry) => entry.projectRef === 'project.vexlife.new-beginnings');
  const alignment = projection.projects.find((entry) => entry.projectRef === 'project.vexwork.vexarchitecture-alignment');
  assert.ok(newBeginnings);
  assert.ok(alignment);
  assert.equal(newBeginnings.definitionPath, 'projects/vexlife-new-beginnings/project.json');
  assert.equal(alignment.definitionPath, 'projects/vexwork-vexarchitecture-alignment/project.json');
  assert.equal(newBeginnings.boardViewPath, null);
  assert.equal(alignment.boardViewPath, null);

  assert.equal(
    projection.projects.filter((entry) => entry.boardViewPath !== null).every((entry) =>
      typeof entry.boardViewPath === 'string' && entry.boardViewPath.length > 0
    ),
    true,
  );
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

test('Project Registry validator exercises malformed identity and path boundaries', () => {
  const mutations = [
    ['schema', (value) => { value.schemaVersion = 'wrong'; }, /schema mismatch/],
    ['registry ref', (value) => { value.registryRef = 'bad ref'; }, /registryRef invalid/],
    ['registry version', (value) => { value.registryVersion = 0; }, /registryVersion invalid/],
    ['purpose', (value) => { value.purpose = ' '; }, /purpose required/],
    ['projects', (value) => { value.projects = []; }, /projects required/],
    ['project ref', (value) => { value.projects[0].projectRef = 'bad ref'; }, /projectRef invalid/],
    ['workgraph ref', (value) => { value.projects[0].workgraphRef = 'bad ref'; }, /workgraphRef invalid/],
    ['workgraph path', (value) => { value.projects[0].workgraphPath = '../escape.json'; }, /workgraphPath invalid/],
    ['definition path', (value) => { value.projects[0].definitionPath = '/absolute.json'; }, /definitionPath invalid/],
    ['board path', (value) => { value.projects[0].boardViewPath = '..\\escape.json'; }, /boardViewPath invalid/],
    ['agency path', (value) => { value.projects[0].agencyPolicyPathOrNull = '../escape.json'; }, /agencyPolicyPathOrNull invalid/],
    ['duplicate definition path', (value) => { value.projects[1].definitionPath = value.projects[0].definitionPath; }, /duplicate definitionPath/],
    ['duplicate board path', (value) => {
      value.projects[0].boardViewPath = 'projects/shared/board.view.json';
      value.projects[1].boardViewPath = 'projects/shared/board.view.json';
    }, /duplicate boardViewPath/],
  ];
  for (const [label, mutate, pattern] of mutations) {
    const candidate = structuredClone(registry);
    mutate(candidate);
    const result = validateProjectRegistry(candidate);
    assert.equal(result.ok, false, label);
    assert.match(result.errors.join('\n'), pattern, label);
    assert.throws(() => projectProjectRegistry(candidate), pattern, label);
  }
});

test('known-project assertion rejects an invalid registry before checking membership', () => {
  const invalid = structuredClone(registry);
  invalid.registryVersion = 0;
  assert.throws(() => assertKnownProjectRefs(['project.vexwork.foundation'], invalid), /registryVersion invalid/);
});

test('Project Registry preserves explicit custom Board paths while allowing canonical default Board derivation', () => {
  const explicit = structuredClone(registry);
  explicit.projects[0].boardViewPath = 'projects/vexwork-foundation/board.view.json';
  assert.equal(validateProjectRegistry(explicit).ok, true);
  assert.equal(projectProjectRegistry(explicit).projects[0].boardViewPath, 'projects/vexwork-foundation/board.view.json');

  explicit.projects[0].boardViewPath = null;
  assert.equal(validateProjectRegistry(explicit).ok, true);
  assert.equal(projectProjectRegistry(explicit).projects[0].boardViewPath, null);
});

// [VXG RealForever][VEXWORK][PROJECT-REGISTRY][SOURCE-DERIVED]
