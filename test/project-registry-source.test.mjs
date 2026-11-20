import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  buildProjectRegistrySource,
  discoverProjectDefinitionPaths,
  projectRegistryBytes,
} from '../scripts/build-project-registry.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const current = JSON.parse(fs.readFileSync(path.join(ROOT, 'blueprint/project-registry.json'), 'utf8'));

test('repository Project census derives membership from every validated project.json source', () => {
  const definitionPaths = discoverProjectDefinitionPaths(ROOT);
  const derived = buildProjectRegistrySource(ROOT);

  assert.equal(derived.projects.length, definitionPaths.length);
  assert.equal(new Set(derived.projects.map((entry) => entry.projectRef)).size, definitionPaths.length);
  assert.equal(new Set(derived.projects.map((entry) => entry.definitionPath)).size, definitionPaths.length);
  assert.deepEqual(
    [...derived.projects.map((entry) => entry.definitionPath)].sort(),
    [...definitionPaths].sort(),
  );

  for (const entry of derived.projects) {
    const project = JSON.parse(fs.readFileSync(path.join(ROOT, entry.definitionPath), 'utf8'));
    assert.equal(entry.projectRef, project.projectRef, entry.definitionPath);
    assert.equal(entry.workgraphRef, 'workgraph.vexwork.foundation');
    assert.equal(entry.workgraphPath, 'workgraphs/public.json');
  }
});

test('v1 registryVersion follows derived population only as compatibility metadata, never a literal architecture count', () => {
  const derived = buildProjectRegistrySource(ROOT);
  assert.equal(derived.registryVersion, derived.projects.length);
  assert.equal(derived.registryVersion, discoverProjectDefinitionPaths(ROOT).length);
});

test('existing registry order is a partial compatibility preference, not source membership', () => {
  const derived = buildProjectRegistrySource(ROOT);
  const derivedRefs = derived.projects.map((entry) => entry.projectRef);
  const currentRefs = current.projects.map((entry) => entry.projectRef);

  assert.deepEqual(derivedRefs.slice(0, currentRefs.length), currentRefs);
  for (const projectRef of currentRefs) assert.equal(derivedRefs.includes(projectRef), true, projectRef);

  assert.equal(derivedRefs.includes('project.vexlife.new-beginnings'), true);
  assert.equal(derivedRefs.includes('project.vexwork.vexarchitecture-alignment'), true);
});

test('default-only Board files disappear from discoverability metadata while earned custom Board sources remain addressable', () => {
  const derived = buildProjectRegistrySource(ROOT);
  const newBeginnings = derived.projects.find((entry) => entry.projectRef === 'project.vexlife.new-beginnings');
  const alignment = derived.projects.find((entry) => entry.projectRef === 'project.vexwork.vexarchitecture-alignment');

  assert.equal(newBeginnings.boardViewPath, null);
  assert.equal(alignment.boardViewPath, null);

  const explicitEntries = derived.projects.filter((entry) => entry.boardViewPath !== null);
  for (const entry of explicitEntries) {
    assert.equal(fs.existsSync(path.join(ROOT, entry.boardViewPath)), true, entry.projectRef);
  }
});

test('generated Project Registry bytes are deterministic for the same source tree', () => {
  assert.equal(projectRegistryBytes(ROOT), projectRegistryBytes(ROOT));
});

// [VXG RealForever][VEXWORK][PROJECT-REGISTRY][SOURCE-CENSUS][TEST]
