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
  assert.equal(projection.projects.length, 7);
  assert.equal(projection.projects[0].projectRef, 'project.vexwork.foundation');
  assert.equal(projection.projects[0].workgraphRef, 'workgraph.vexwork.foundation');
  assert.equal(projection.projects[0].workgraphPath, 'workgraphs/public.json');
  const mobile = projection.projects.find((entry) => entry.projectRef === 'project.vexstream.mobile-library');
  assert.equal(mobile.workgraphRef, 'workgraph.vexwork.foundation');
  assert.equal(mobile.workgraphPath, 'workgraphs/public.json');
  assert.equal(mobile.agencyPolicyPathOrNull, 'projects/vexstream-mobile-library/agency.policy.json');
  const toCompletion = projection.projects.find((entry) => entry.projectRef === 'project.vexlife.tocompletion');
  assert.equal(toCompletion.workgraphRef, 'workgraph.vexwork.foundation');
  assert.equal(toCompletion.workgraphPath, 'workgraphs/public.json');
  assert.equal(toCompletion.definitionPath, 'projects/vexlife-tocompletion/project.json');
  assert.equal(toCompletion.boardViewPath, 'projects/vexlife-tocompletion/board.view.json');
  assert.equal(toCompletion.agencyPolicyPathOrNull, null);
  const connected = projection.projects.find((entry) => entry.projectRef === 'project.vexlife.connected-services');
  assert.equal(connected.workgraphRef, 'workgraph.vexwork.foundation');
  assert.equal(connected.workgraphPath, 'workgraphs/public.json');
  assert.equal(connected.definitionPath, 'projects/vexlife-connected-services/project.json');
  assert.equal(connected.boardViewPath, 'projects/vexlife-connected-services/board.view.json');
  assert.equal(connected.agencyPolicyPathOrNull, null);
  const operational = projection.projects.find((entry) => entry.projectRef === 'project.vexwork.operational-console');
  assert.equal(operational.workgraphRef, 'workgraph.vexwork.foundation');
  assert.equal(operational.workgraphPath, 'workgraphs/public.json');
  assert.equal(operational.definitionPath, 'projects/vexwork-operational-console/project.json');
  assert.equal(operational.boardViewPath, 'projects/vexwork-operational-console/board.view.json');
  assert.equal(operational.agencyPolicyPathOrNull, null);
  const vexboard = projection.projects.find((entry) => entry.projectRef === 'project.vexboard');
  assert.equal(vexboard.workgraphRef, 'workgraph.vexwork.foundation');
  assert.equal(vexboard.definitionPath, 'projects/vexboard/project.json');
  assert.equal(vexboard.boardViewPath, 'projects/vexboard/board.view.json');
  assert.equal(vexboard.agencyPolicyPathOrNull, null);
  const blueprint = projection.projects.find((entry) => entry.projectRef === 'project.vexlife.blueprint-source-of-truth');
  assert.equal(blueprint.workgraphRef, 'workgraph.vexwork.foundation');
  assert.equal(blueprint.workgraphPath, 'workgraphs/public.json');
  assert.equal(blueprint.definitionPath, 'projects/vexlife-blueprint-source-of-truth/project.json');
  assert.equal(blueprint.boardViewPath, 'projects/vexlife-blueprint-source-of-truth/board.view.json');
  assert.equal(blueprint.agencyPolicyPathOrNull, null);
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
