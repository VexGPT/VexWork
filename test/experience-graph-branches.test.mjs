import assert from 'node:assert/strict';
import test from 'node:test';

import { compareBuilds, normalizeBuilds, renderBranchReport } from '../src/core/experience-graph-branches.mjs';
import { deriveFrontier, deriveRoutes } from '../src/core/experience-graph-derivation.mjs';
import { readLocalization } from '../src/core/experience-graph-localization.mjs';
import { fixtureGraph, fixtureLaws } from './fixtures/experience-graph/graph.mjs';
import { COMMIT } from './fixtures/experience-graph/fixtures.mjs';
import { CATALOG_FILES, MAIN_ANCHOR, MARKUP, TEST_ANCHOR } from './fixtures/experience-graph/localization.mjs';

const CANDIDATE = 'c'.repeat(40);
const project = (graph) => {
  const frontier = deriveFrontier(graph);
  return { graph, frontier, routes: deriveRoutes(graph, frontier) };
};

test('candidate builds are exact commits on named branches, compared against the pinned main they were cut from', () => {
  const plan = { commit: COMMIT, builds: [{ buildRef: 'candidate-keyed', branch: 'VXG-x', commit: CANDIDATE, basis: 'main', basisCommit: COMMIT }] };
  assert.equal(normalizeBuilds(plan)[0].buildRef, 'candidate-keyed');
  assert.throws(() => normalizeBuilds({ ...plan, builds: [{ ...plan.builds[0], buildRef: 'main' }] }), /candidate-some-name/);
  assert.throws(() => normalizeBuilds({ ...plan, builds: [{ ...plan.builds[0], basisCommit: CANDIDATE }] }), /not the pinned main/);
  assert.throws(() => normalizeBuilds({ ...plan, builds: [plan.builds[0], plan.builds[0]] }), /repeats/);
  assert.throws(() => normalizeBuilds({ ...plan, builds: [{ ...plan.builds[0], commit: 'abc' }] }), /exact 40-hex/);
});

test('a candidate that keys its elements flips routes to CLEARED and resolves debt without rewriting main', () => {
  const main = project(fixtureGraph());
  const localization = readLocalization({ catalogFiles: CATALOG_FILES, anchorFiles: [MAIN_ANCHOR, TEST_ANCHOR], settings: null, strings: null, selectionFiles: [], markup: MARKUP, laws: fixtureLaws(), familyFiles: [] });
  const candidateGraph = fixtureGraph({ commit: CANDIDATE, localization });
  const build = { buildRef: 'candidate-keyed', label: 'Keyed', branch: 'VXG-x', commit: CANDIDATE, basis: 'main', basisCommit: COMMIT, axis: 'IDENTITY' };
  const mainBefore = JSON.stringify(main);
  const branches = compareBuilds({ main, candidates: [{ build, ...project(candidateGraph) }] });
  assert.equal(JSON.stringify(main), mainBefore, 'main projection is preserved');
  const [row] = branches.candidates;
  assert.equal(row.commit, CANDIDATE);
  assert.ok(row.routeFlips.some((flip) => flip.routeRef.startsWith('route:VexLifeDictationFamily.Ready:Start') && flip.to === 'CLEARED'));
  assert.ok(row.debt.resolved.includes('debt:MISSING_MANIFESTATION_BINDING:VexLifeDictationFamily.Start'));
  assert.ok(row.debt.introducedByKind.LANGUAGE_INCOMPLETE >= 1, 'reading the catalog also reveals what it lacks');
  assert.ok(row.edges.added.some((edge) => edge.startsWith('edge:MANIFESTS:key:workspace.button.dictation-start')));
  assert.equal(row.lawProofReusable, true, 'unchanged Family law and probe identity keep main evidence reusable');
  assert.equal(branches.main.commit, COMMIT);
  const report = renderBranchReport(branches);
  assert.match(report, /candidate-keyed/);
  assert.match(report, /route:VexLifeDictationFamily\.Ready:Start/);
});


test('candidate law evidence reuse fails closed when probe identity changes but Family-law fingerprint does not', () => {
  const main = project(fixtureGraph());
  const candidateGraph = fixtureGraph({
    commit: CANDIDATE,
    lawProbeSourceSha256: '1'.repeat(64),
  });
  const build = {
    buildRef: 'candidate-probe-change',
    label: 'Probe change',
    branch: 'VXG-probe',
    commit: CANDIDATE,
    basis: 'main',
    basisCommit: COMMIT,
    axis: 'PROOF',
  };
  const [row] = compareBuilds({ main, candidates: [{ build, ...project(candidateGraph) }] }).candidates;
  assert.equal(row.edges.added.length, 0);
  assert.equal(row.edges.removed.length, 0);
  assert.equal(row.edges.changed.length, 0);
  assert.equal(row.lawProofReusable, false, 'semantic law equality cannot substitute for probe identity');
  assert.match(
    renderBranchReport({ schemaVersion: 'vexwork.experience-graph.branches/v1', main: { commit: COMMIT, graphFingerprint: main.graph.fingerprint, routeCounts: main.routes.counts, debt: main.frontier.debt.length }, preserved: 'main projection at generated/ is never rewritten by a candidate build', candidates: [row] }),
    /must be re-run \(Family law or probe identity changed\/unproven\)/,
  );
});
