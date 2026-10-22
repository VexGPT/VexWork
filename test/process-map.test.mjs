import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { assertKnownProcessRefs, projectProcessMap, validateProcessRegistry } from '../src/core/process-map.mjs';

const read = (relative) => JSON.parse(fs.readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8'));
const processRegistry = read('blueprint/process-registry.json');
const repositoryRegistry = read('blueprint/repository-registry.json');

test('Process Map is source-addressable, non-executing navigation', () => {
  const validation = validateProcessRegistry(processRegistry, repositoryRegistry);
  assert.equal(validation.ok, true, validation.errors.join('\n'));
  const map = projectProcessMap(processRegistry);
  assert.equal(map.effects, false);
  assert.equal(map.executionAuthority, 'NONE');
  assert.equal(map.processes.length, 5);
  assert.equal(map.processes.some((process) => process.processRef === 'process.vexwork.capture-discovered-work'), true);
  assert.equal(map.processes.some((process) => process.processRef === 'process.vexwork.form-project'), true);
  assert.equal(map.processes.some((process) => process.processRef === 'process.vexwork.promote-derived-concern'), true);
  assert.equal(map.processes.some((process) => process.processRef === 'process.vexlife-android.feature-authoring'), true);
  assert.equal(map.processes.some((process) => process.processRef === 'process.vexwork.quality-review'), true);

  const promotion = map.processes.find((process) => process.processRef === 'process.vexwork.promote-derived-concern');
  assert.match(promotion.purpose, /without automatic ticket generation/i);
  assert.match(promotion.appliesWhen, /UNSATISFIED or UNKNOWN/);
  assert.deepEqual(promotion.entryRefs, [
    'docs/process/PROMOTE-DERIVED-CONCERN.md',
    'docs/foundation/DERIVED-ATTENTION.md',
    'docs/foundation/DERIVED-ATTENTION-PROJECTION.md',
  ]);
  assert.equal(promotion.effects, false);
  assert.equal(promotion.executionAuthority, 'NONE');
});

test('unknown process refs fail closed', () => {
  assert.equal(assertKnownProcessRefs([
    'process.vexwork.capture-discovered-work',
    'process.vexwork.promote-derived-concern',
  ], processRegistry), true);
  assert.throws(() => assertKnownProcessRefs(['process.unknown'], processRegistry), /unknown processRef/);
});
