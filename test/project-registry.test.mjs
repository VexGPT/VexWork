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
  assert.equal(projection.projects.length, 15);
  assert.equal(projection.projects[0].projectRef, 'project.vexwork.foundation');
  assert.equal(projection.projects[0].workgraphRef, 'workgraph.vexwork.foundation');
  assert.equal(projection.projects[0].workgraphPath, 'workgraphs/public.json');
  const mobile = projection.projects.find((entry) => entry.projectRef === 'project.vexstream.mobile-library');
  assert.equal(mobile.workgraphRef, 'workgraph.vexwork.foundation');
  assert.equal(mobile.workgraphPath, 'workgraphs/public.json');
  assert.equal(mobile.agencyPolicyPathOrNull, 'projects/vexstream-mobile-library/agency.policy.json');
  const androidProof = projection.projects.find((entry) => entry.projectRef === 'project.android-proof-orchestration');
  assert.equal(androidProof.workgraphRef, 'workgraph.vexwork.foundation');
  assert.equal(androidProof.workgraphPath, 'workgraphs/public.json');
  assert.equal(androidProof.definitionPath, 'projects/android-proof-orchestration/project.json');
  assert.equal(androidProof.boardViewPath, 'projects/android-proof-orchestration/board.view.json');
  assert.equal(androidProof.agencyPolicyPathOrNull, null);
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
  const universe = projection.projects.find((entry) => entry.projectRef === 'project.vex-universe');
  assert.equal(universe.workgraphRef, 'workgraph.vexwork.foundation');
  assert.equal(universe.workgraphPath, 'workgraphs/public.json');
  assert.equal(universe.definitionPath, 'projects/vex-universe/project.json');
  assert.equal(universe.boardViewPath, 'projects/vex-universe/board.view.json');
  assert.equal(universe.agencyPolicyPathOrNull, null);
  const blueprint = projection.projects.find((entry) => entry.projectRef === 'project.vexlife.blueprint-source-of-truth');
  assert.equal(blueprint.workgraphRef, 'workgraph.vexwork.foundation');
  assert.equal(blueprint.workgraphPath, 'workgraphs/public.json');
  assert.equal(blueprint.definitionPath, 'projects/vexlife-blueprint-source-of-truth/project.json');
  assert.equal(blueprint.boardViewPath, 'projects/vexlife-blueprint-source-of-truth/board.view.json');
  assert.equal(blueprint.agencyPolicyPathOrNull, null);
  const vexsite = projection.projects.find((entry) => entry.projectRef === 'project.vextreme.vexsite-localization');
  assert.equal(vexsite.workgraphRef, 'workgraph.vexwork.foundation');
  assert.equal(vexsite.definitionPath, 'projects/vexsite-localization/project.json');
  assert.equal(vexsite.boardViewPath, 'projects/vexsite-localization/board.view.json');
  assert.equal(vexsite.agencyPolicyPathOrNull, null);
  const welcome = projection.projects.find((entry) => entry.projectRef === 'project.vexlife.welcome-wagon');
  assert.equal(welcome.workgraphRef, 'workgraph.vexwork.foundation');
  assert.equal(welcome.workgraphPath, 'workgraphs/public.json');
  assert.equal(welcome.definitionPath, 'projects/vexlife-welcome-wagon/project.json');
  assert.equal(welcome.boardViewPath, 'projects/vexlife-welcome-wagon/board.view.json');
  assert.equal(welcome.agencyPolicyPathOrNull, null);
  const refinement = projection.projects.find((entry) => entry.projectRef === 'project.vexlife-android.current-state-refinement');
  assert.equal(refinement.workgraphRef, 'workgraph.vexwork.foundation');
  assert.equal(refinement.workgraphPath, 'workgraphs/public.json');
  assert.equal(refinement.definitionPath, 'projects/vexlife-android-current-state-refinement/project.json');
  assert.equal(refinement.boardViewPath, 'projects/vexlife-android-current-state-refinement/board.view.json');
  assert.equal(refinement.agencyPolicyPathOrNull, null);
  const security = projection.projects.find((entry) => entry.projectRef === 'project.vex.security-assurance');
  assert.equal(security.workgraphRef, 'workgraph.vexwork.foundation');
  assert.equal(security.workgraphPath, 'workgraphs/public.json');
  assert.equal(security.definitionPath, 'projects/vex-security-assurance/project.json');
  assert.equal(security.boardViewPath, 'projects/vex-security-assurance/board.view.json');
  assert.equal(security.agencyPolicyPathOrNull, null);
  const widget = projection.projects.find((entry) => entry.projectRef === 'project.android-widget-foundation');
  assert.equal(widget.workgraphRef, 'workgraph.vexwork.foundation');
  assert.equal(widget.workgraphPath, 'workgraphs/public.json');
  assert.equal(widget.definitionPath, 'projects/android-widget-foundation/project.json');
  assert.equal(widget.boardViewPath, 'projects/android-widget-foundation/board.view.json');
  assert.equal(widget.agencyPolicyPathOrNull, null);
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
    ['duplicate board path', (value) => { value.projects[1].boardViewPath = value.projects[0].boardViewPath; }, /duplicate boardViewPath/],
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
