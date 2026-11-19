// Experience Relationship Graph — branch dynamics.
//
// Main's projection is the preserved basis. Each candidate build (an exact commit on a named
// branch) is projected with the same extractor and compared against main:
//
//   main graph + frontier + routes        (unchanged, checked in at generated/)
//   candidate graph + frontier + routes   (checked in at generated/builds/<buildRef>/)
//   -> per-candidate delta: route status flips, debt resolved / introduced, law edges changed
//
// A candidate never replaces main's projection here; promotion is the Product's own merge.
// Mirrors the VexBoard Lens catalog's Stable / Main build pointers, extended with candidates.
//
// Pure.

import { diffExperienceGraphs } from './experience-graph-convergence.mjs';
import { lawFingerprint } from './experience-graph.mjs';

export const BRANCHES_SCHEMA = 'vexwork.experience-graph.branches/v1';

const compare = (left, right) => (left < right ? -1 : left > right ? 1 : 0);
const BUILD_REF = /^candidate-[a-z0-9]+(?:-[a-z0-9]+)*$/;

function fail(message) {
  throw new Error(`experience graph builds: ${message}`);
}

export function normalizeBuilds(plan) {
  const builds = plan.builds ?? [];
  const seen = new Set();
  return builds.map((build, index) => {
    const label = `builds[${index}]`;
    if (!BUILD_REF.test(build.buildRef ?? '')) fail(`${label} buildRef must look like candidate-some-name`);
    if (seen.has(build.buildRef)) fail(`${label} buildRef ${build.buildRef} repeats`);
    seen.add(build.buildRef);
    if (!/^[0-9a-f]{40}$/.test(build.commit ?? '')) fail(`${label} commit must be one exact 40-hex commit`);
    if (typeof build.branch !== 'string' || !build.branch) fail(`${label} needs its source branch`);
    if (build.basis !== 'main') fail(`${label} basis must be main (the preserved projection it is compared against)`);
    if (build.basisCommit !== plan.commit) fail(`${label} basisCommit ${build.basisCommit} is not the pinned main ${plan.commit}; rebase the candidate or re-pin main`);
    return { buildRef: build.buildRef, label: build.label ?? build.buildRef, summary: build.summary ?? '', branch: build.branch, commit: build.commit, basis: 'main', basisCommit: build.basisCommit, axis: build.axis ?? null };
  });
}

function byRef(rows, key) {
  return new Map(rows.map((row) => [row[key], row]));
}

function countBy(rows, key) {
  const out = {};
  for (const row of rows) out[row[key]] = (out[row[key]] ?? 0) + 1;
  return Object.fromEntries(Object.entries(out).sort(([a], [b]) => compare(a, b)));
}

export function compareBuild(main, candidate) {
  const mainRoutes = byRef(main.routes.routes, 'routeRef');
  const candidateRoutes = byRef(candidate.routes.routes, 'routeRef');
  const flips = [];
  for (const [ref, route] of candidateRoutes) {
    const before = mainRoutes.get(ref);
    if (before && before.status !== route.status) flips.push({ routeRef: ref, from: before.status, to: route.status });
  }
  const mainDebt = byRef(main.frontier.debt, 'ref');
  const candidateDebt = byRef(candidate.frontier.debt, 'ref');
  const resolved = [...mainDebt.values()].filter((row) => !candidateDebt.has(row.ref));
  const introduced = [...candidateDebt.values()].filter((row) => !mainDebt.has(row.ref));
  const graphDelta = diffExperienceGraphs(main.graph, candidate.graph, { priorRoutes: main.routes.routes, currentRoutes: candidate.routes.routes });
  const cleared = flips.filter((row) => row.to === 'CLEARED').length;
  const regressed = flips.filter((row) => row.from === 'CLEARED').length;
  return {
    buildRef: candidate.build.buildRef,
    label: candidate.build.label,
    summary: candidate.build.summary,
    axis: candidate.build.axis,
    branch: candidate.build.branch,
    commit: candidate.build.commit,
    basisCommit: candidate.build.basisCommit,
    graphFingerprint: candidate.graph.fingerprint,
    routeCounts: { main: main.routes.counts, candidate: candidate.routes.counts },
    routeFlips: flips.sort((a, b) => compare(a.routeRef, b.routeRef)),
    routesAdded: [...candidateRoutes.keys()].filter((ref) => !mainRoutes.has(ref)).sort(compare),
    routesRemoved: [...mainRoutes.keys()].filter((ref) => !candidateRoutes.has(ref)).sort(compare),
    debt: {
      main: main.frontier.debt.length,
      candidate: candidate.frontier.debt.length,
      resolvedByKind: countBy(resolved, 'kind'),
      introducedByKind: countBy(introduced, 'kind'),
      resolved: resolved.map((row) => row.ref).sort(compare),
      introduced: introduced.map((row) => row.ref).sort(compare),
    },
    edges: { added: graphDelta.edgesAdded, removed: graphDelta.edgesRemoved, changed: graphDelta.edgesChanged },
    // Executed law proof bound to main stays valid for a candidate that leaves Family law unchanged.
    lawProofReusable: lawFingerprint(main.graph) === lawFingerprint(candidate.graph),
    familiesAdded: graphDelta.familiesAdded,
    familiesRemoved: graphDelta.familiesRemoved,
    verdict: regressed ? 'REGRESSES_MAIN' : introduced.length > resolved.length ? 'ADDS_DEBT' : cleared || resolved.length ? 'IMPROVES_MAIN' : 'NO_GRAPH_CHANGE',
  };
}

export function compareBuilds({ main, candidates }) {
  return {
    schemaVersion: BRANCHES_SCHEMA,
    main: { commit: main.graph.source.commit, graphFingerprint: main.graph.fingerprint, routeCounts: main.routes.counts, debt: main.frontier.debt.length },
    preserved: 'main projection at generated/ is never rewritten by a candidate build',
    candidates: candidates.map((candidate) => compareBuild(main, candidate)).sort((a, b) => compare(a.buildRef, b.buildRef)),
  };
}

const table = (header, rows) => [
  `| ${header.join(' | ')} |`,
  `|${header.map(() => '---').join('|')}|`,
  ...rows.map((row) => `| ${row.map((cell) => String(cell).replace(/\|/g, '\\|')).join(' | ')} |`),
].join('\n');

export function renderBranchReport(branches) {
  const lines = [];
  lines.push('# VexLife-Prod candidate branches against preserved main — generated');
  lines.push('');
  lines.push('`[VXG RealForever]` · generated by `scripts/build-experience-graph.mjs` · do not edit by hand');
  lines.push('');
  lines.push('~~~text');
  lines.push(`main         ${branches.main.commit}   graph ${branches.main.graphFingerprint.slice(0, 12)}`);
  lines.push(`main routes  ${Object.entries(branches.main.routeCounts).map(([status, count]) => `${status} ${count}`).join(' · ')}   debt ${branches.main.debt}`);
  lines.push(`preserved    ${branches.preserved}`);
  lines.push('~~~');
  lines.push('');
  lines.push(table(['candidate', 'axis', 'branch @ commit', 'verdict', 'routes → CLEARED', 'debt main → candidate', 'resolved', 'introduced'], branches.candidates.map((row) => [
    `\`${row.buildRef}\``,
    row.axis ?? '—',
    `\`${row.branch}\` @ \`${row.commit.slice(0, 12)}\``,
    row.verdict,
    row.routeFlips.filter((flip) => flip.to === 'CLEARED').length,
    `${row.debt.main} → ${row.debt.candidate}`,
    Object.entries(row.debt.resolvedByKind).map(([kind, count]) => `${kind} ${count}`).join(', ') || '—',
    Object.entries(row.debt.introducedByKind).map(([kind, count]) => `${kind} ${count}`).join(', ') || '—',
  ])));
  lines.push('');
  for (const row of branches.candidates) {
    lines.push(`## \`${row.buildRef}\` — ${row.label}`);
    lines.push('');
    if (row.summary) {
      lines.push(row.summary);
      lines.push('');
    }
    lines.push(`Route counts: main ${JSON.stringify(row.routeCounts.main)} → candidate ${JSON.stringify(row.routeCounts.candidate)}.`);
    lines.push('');
    if (row.routeFlips.length) {
      lines.push(table(['route', 'main', 'candidate'], row.routeFlips.map((flip) => [`\`${flip.routeRef}\``, flip.from, flip.to])));
      lines.push('');
    }
    lines.push(`Law and manifestation edges: +${row.edges.added.length} / −${row.edges.removed.length} / changed ${row.edges.changed.length}. Main's executed law proof ${row.lawProofReusable ? 'stays valid (Family law unchanged)' : 'must be re-run (Family law changed)'}.`);
    lines.push('');
  }
  lines.push('<!-- [VXG RealForever][VEXWORK][VEXLIFE-PROD][E2E][EXPERIENCE-GRAPH][BRANCHES] -->');
  return `${lines.join('\n')}\n`;
}

// [VXG RealForever][VEXWORK][VEXLIFE-PROD][E2E][EXPERIENCE-GRAPH][BRANCHES]
