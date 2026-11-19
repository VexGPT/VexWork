import assert from 'node:assert/strict';
import test from 'node:test';

import { checkConsolidation, compareBuilds, normalizeBuilds, renderBranchReport } from '../src/core/experience-graph-branches.mjs';
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
  assert.equal(normalizeBuilds(plan)[0].kind, 'candidate');
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
  assert.equal(branches.main.commit, COMMIT);
  const report = renderBranchReport(branches);
  assert.match(report, /candidate-keyed/);
  assert.match(report, /route:VexLifeDictationFamily\.Ready:Start/);
});

const scopeBuild = (buildRef, extra = {}) => ({ buildRef, branch: `VXG-${buildRef}`, commit: CANDIDATE, basis: 'main', basisCommit: COMMIT, ...extra });

test('scopes may stack on earlier scopes; a consolidated build names the earlier scopes it merges', () => {
  const plan = {
    commit: COMMIT,
    builds: [
      scopeBuild('scope-a'),
      scopeBuild('scope-b', { stackedOn: 'scope-a' }),
      scopeBuild('scope-c'),
      scopeBuild('consolidated-all', { members: ['scope-b', 'scope-c'] }),
    ],
  };
  const builds = normalizeBuilds(plan);
  assert.deepEqual(builds.map((row) => row.kind), ['scope', 'scope', 'scope', 'consolidated']);
  assert.equal(builds[1].stackedOn, 'scope-a');
  assert.deepEqual(builds[3].members, ['scope-b', 'scope-c']);
  const replace = (index, build) => ({ ...plan, builds: plan.builds.map((row, at) => (at === index ? build : row)) });
  assert.throws(() => normalizeBuilds(replace(1, scopeBuild('scope-b', { stackedOn: 'scope-z' }))), /not an earlier scope/);
  assert.throws(() => normalizeBuilds(replace(0, scopeBuild('candidate-a', { stackedOn: 'scope-c' }))), /only a scope may be stacked/);
  assert.throws(() => normalizeBuilds(replace(3, scopeBuild('consolidated-all'))), /names the scopes it merges/);
  assert.throws(() => normalizeBuilds(replace(3, scopeBuild('consolidated-all', { members: ['scope-c', 'scope-c'] }))), /twice/);
  assert.throws(() => normalizeBuilds(replace(3, scopeBuild('consolidated-all', { members: ['consolidated-x'] }))), /not an earlier scope/);
  assert.throws(() => normalizeBuilds(replace(2, scopeBuild('scope-c', { members: ['scope-a'] }))), /only a consolidated build has members/);
});

const row = (buildRef, { kind = 'scope', stackedOn = null, members = null, resolved = [], introduced = [], cleared = [], flips = [] } = {}) => ({
  buildRef, kind, stackedOn, members, clearedRoutes: cleared, routeFlips: flips, debt: { resolved, introduced },
});

test('the consolidation check: nothing a scope fixes goes missing, nothing the scopes did not bring arrives', () => {
  const scopes = [
    row('scope-a', { resolved: ['debt:1', 'debt:2'], cleared: ['route:x'] }),
    row('scope-b', { stackedOn: 'scope-a', resolved: ['debt:1', 'debt:2', 'debt:3'], introduced: ['debt:anchor'], cleared: ['route:x', 'route:y'] }),
    row('scope-c', { resolved: ['debt:4'] }),
  ];
  const complete = row('consolidated-all', { kind: 'consolidated', members: ['scope-b', 'scope-c'], resolved: ['debt:1', 'debt:2', 'debt:3', 'debt:4', 'debt:5'], cleared: ['route:x', 'route:y'] });
  const [ok] = checkConsolidation([...scopes, complete]);
  assert.equal(ok.verdict, 'COMPLETE');
  assert.deepEqual(ok.merged, ['scope-a', 'scope-b', 'scope-c'], 'a stacked scope brings the scope beneath it');
  assert.deepEqual(ok.resolvedByMerge, ['debt:5'], 'a resolution between scopes is reported, not refused');

  const leaky = row('consolidated-all', {
    kind: 'consolidated',
    members: ['scope-b'],
    resolved: ['debt:1', 'debt:3'],
    introduced: ['debt:merge-only', 'debt:anchor'],
    cleared: ['route:x'],
    flips: [{ routeRef: 'route:z', from: 'CLEARED', to: 'FRONTIER_DEBT' }],
  });
  const [gaps] = checkConsolidation([...scopes, leaky]);
  assert.equal(gaps.verdict, 'INCOMPLETE');
  assert.deepEqual(gaps.scopesLeftOut, ['scope-c']);
  assert.deepEqual(gaps.missingResolutions, ['debt:2']);
  assert.deepEqual(gaps.missingClearedRoutes, ['route:y']);
  assert.deepEqual(gaps.introducedByMerge, ['debt:merge-only'], 'debt a scope already introduced is that scope\'s, not the merge\'s');
  assert.deepEqual(gaps.regressedRoutes, ['route:z']);
  assert.deepEqual(gaps.gaps, ['scopesLeftOut', 'missingResolutions', 'missingClearedRoutes', 'introducedByMerge', 'regressedRoutes']);
});

test('a stacked scope reports what it adds on top of its parent, and the report shows the consolidation table', () => {
  const main = project(fixtureGraph());
  const localization = readLocalization({ catalogFiles: CATALOG_FILES, anchorFiles: [MAIN_ANCHOR, TEST_ANCHOR], settings: null, strings: null, selectionFiles: [], markup: MARKUP, laws: fixtureLaws(), familyFiles: [] });
  const keyed = project(fixtureGraph({ commit: CANDIDATE, localization }));
  const builds = normalizeBuilds({
    commit: COMMIT,
    builds: [
      scopeBuild('scope-base'),
      scopeBuild('scope-keyed', { stackedOn: 'scope-base' }),
      scopeBuild('consolidated-all', { members: ['scope-keyed'] }),
    ],
  });
  const branches = compareBuilds({
    main,
    candidates: [
      { build: builds[0], ...main },
      { build: builds[1], ...keyed },
      { build: builds[2], ...keyed },
    ],
  });
  const stacked = branches.candidates.find((candidate) => candidate.buildRef === 'scope-keyed');
  assert.deepEqual(stacked.own.resolved, stacked.debt.resolved, 'the base scope changed nothing, so all of it is its own');
  assert.deepEqual(stacked.own.reopened, []);
  assert.equal(branches.consolidations[0].verdict, 'COMPLETE');
  const report = renderBranchReport(branches);
  assert.match(report, /## Consolidation `consolidated-all` — COMPLETE/);
  assert.match(report, /every resolution a scope makes is kept \| yes/);
  assert.match(report, /On top of `scope-base`: resolves \d+/);
});
