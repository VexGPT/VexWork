import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { createProject, createWorkgraph, childRefs, projectWorkRefs } from '../src/core/workgraph.mjs';
import { createBoardView, projectWorkBoard } from '../src/core/work-board.mjs';

const read = (relative) => JSON.parse(fs.readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8'));
const readText = (relative) => fs.readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8');
const securityReadme = readText('projects/vex-security-assurance/README.md');
const repositoryRouter = readText('AGENTS.md');
const registry = read('blueprint/work-registry.json');
const graph = createWorkgraph(read('workgraphs/public.json'), registry);
const project = createProject(read('projects/vex-security-assurance/project.json'));
const view = createBoardView(read('projects/vex-security-assurance/board.view.json'), registry);

const refs = [
  'work.vex.security-assurance.ai-agentic-security-lens',
  'work.vex.security-assurance.outcome',
  'work.vex.security-assurance.patient-zero',
  'work.vex.security-assurance.question-lens-foundation',
  'work.vex.security-assurance.security-atlas',
  'work.vex.security-assurance.software-security-lens',
  'work.vex.security-assurance.spike-process',
];

test('Vex Security Assurance forms one small evidence-and-question Project rather than a security ticket inventory', () => {
  assert.deepEqual(projectWorkRefs(project, graph), refs);
  assert.deepEqual(childRefs(graph, 'work.vex.security-assurance.outcome'), refs.filter((ref) => ref !== 'work.vex.security-assurance.outcome'));
  assert.deepEqual(project.repositoryRefs, [
    'repo.vexwork',
    'repo.vextreme',
    'repo.vextreme-sdk',
    'repo.vexlife',
    'repo.vexlife-android',
  ]);
  assert.equal(project.sourceRefs.includes('docs/foundation/DERIVED-ATTENTION.md'), true);
  assert.equal(project.sourceRefs.includes('projects/vex-security-assurance/SPIKE-DESIGN.md'), true);
  assert.equal(project.sourceRefs.includes('projects/vex-security-assurance/ADVERSARIAL-LENS.md'), true);
  assert.equal(project.sourceRefs.includes('projects/vex-security-assurance/SIMULATED-ADVERSARIAL-PATIENT-ZERO-A001.md'), true);
  assert.equal(project.sourceRefs.includes('projects/vex-security-assurance/PUBLIC-AVAILABILITY-DDOS.md'), true);
});

test('public availability and DDoS stays inside the existing atlas / software lens without inventing deployment truth', () => {
  const atlas = graph.items.find((item) => item.workRef === 'work.vex.security-assurance.security-atlas');
  const software = graph.items.find((item) => item.workRef === 'work.vex.security-assurance.software-security-lens');

  assert.match(atlas.purpose, /availability\/deployment boundaries/);
  assert.equal(atlas.sourceRefs.includes('projects/vex-security-assurance/PUBLIC-AVAILABILITY-DDOS.md'), true);
  assert.equal(atlas.sourceRefs.includes('repo.vextreme:README.md'), true);
  assert.equal(atlas.sourceRefs.includes('repo.vextreme:lib/build-sw.js'), true);

  assert.match(software.purpose, /denial-of-service\/abuse/);
  assert.match(software.purpose, /quota and cost exhaustion/);
  assert.equal(software.sourceRefs.includes('projects/vex-security-assurance/PUBLIC-AVAILABILITY-DDOS.md'), true);

  assert.equal(atlas.authorityDisposition, 'NO_AUTHORITY');
  assert.equal(atlas.effectDisposition, 'NO_EFFECTS');
  assert.equal(software.authorityDisposition, 'NO_AUTHORITY');
  assert.equal(software.effectDisposition, 'NO_EFFECTS');
});

test('AI / agentic security includes a bounded attacker perspective without granting effects', () => {
  const ai = graph.items.find((item) => item.workRef === 'work.vex.security-assurance.ai-agentic-security-lens');
  assert.match(ai.purpose, /bounded attacker-perspective/);
  assert.match(ai.purpose, /pre-convergence/);
  assert.equal(ai.sourceRefs.includes('projects/vex-security-assurance/ADVERSARIAL-LENS.md'), true);
  assert.equal(ai.sourceRefs.includes('projects/vex-security-assurance/SIMULATED-ADVERSARIAL-PATIENT-ZERO-A001.md'), true);
  assert.equal(ai.authorityDisposition, 'NO_AUTHORITY');
  assert.equal(ai.effectDisposition, 'NO_EFFECTS');
});

test('Security Spikes begin as TASK process semantics with no implied authority or effects', () => {
  const spike = graph.items.find((item) => item.workRef === 'work.vex.security-assurance.spike-process');
  assert.equal(spike.workClass, 'TASK');
  assert.equal(spike.state, 'READY');
  assert.equal(spike.authorityDisposition, 'NO_AUTHORITY');
  assert.equal(spike.effectDisposition, 'NO_EFFECTS');
  assert.equal(spike.sourceRefs.includes('github.pull.vexwork.103'), true);

  for (const ref of refs) {
    const item = graph.items.find((candidate) => candidate.workRef === ref);
    assert.equal(item.authorityDisposition, 'NO_AUTHORITY');
    assert.equal(item.effectDisposition, 'NO_EFFECTS');
  }
});

test('Security board exposes active mapping, ready lens and Spike work, and the patient-zero dependency gate', () => {
  const projected = projectWorkBoard({ project, graph, view, registry });
  const cards = (laneRef) => projected.lanes.find((lane) => lane.laneRef === laneRef).cards.map((card) => card.workRef);

  assert.deepEqual(cards('lane.work.active'), [
    'work.vex.security-assurance.security-atlas',
    'work.vex.security-assurance.outcome',
  ]);
  assert.deepEqual(cards('lane.work.ready'), [
    'work.vex.security-assurance.question-lens-foundation',
    'work.vex.security-assurance.spike-process',
  ]);
  assert.deepEqual(cards('lane.work.waiting'), []);
  assert.deepEqual(cards('lane.work.intake'), [
    'work.vex.security-assurance.ai-agentic-security-lens',
    'work.vex.security-assurance.software-security-lens',
  ]);
  assert.deepEqual(cards('lane.work.planned'), [
    'work.vex.security-assurance.patient-zero',
  ]);
});

test('Security Assurance is selectively routed from current work rather than loaded as ambient model context', () => {
  assert.match(securityReadme, /SECURITY_SOURCE != MODEL_CONTEXT/);
  assert.match(securityReadme, /WORK_RESUME != SECURITY_REVIEW/);
  assert.match(securityReadme, /do not load Security Assurance context/);
  assert.match(securityReadme, /retrieve only the applicable Security Lens predicates/);

  assert.match(repositoryRouter, /Do \*\*not\*\* load the Security Assurance corpus/);
  assert.match(repositoryRouter, /current work's meaning or changed boundary/);
  assert.match(repositoryRouter, /projects\/vex-security-assurance\/README\.md/);
});

test('released Process Registry capacity makes Spike source placement ready without claiming registration', () => {
  const spike = graph.items.find((item) => item.workRef === 'work.vex.security-assurance.spike-process');
  assert.equal(spike.state, 'READY');
  assert.match(spike.purpose, /released the Process Registry surface/);
  assert.equal(spike.sourceRefs.includes('github.pull.vexwork.103'), true);
  assert.match(securityReadme, /Generic Spike registration remains separate successor work/);
  assert.match(securityReadme, /does not imply that `process\.vexwork\.run-spike` has been accepted or implemented/);
});

// [VXG RealForever][VEXWORK][SECURITY-ASSURANCE][PROJECT]
