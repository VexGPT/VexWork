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
// Build kinds (from the buildRef prefix):
//   candidate-*     an exploratory branch
//   scope-*         one reviewable scope cut from main, optionally stacked on another scope
//   consolidated-*  one branch that merges named scopes; checked so that nothing a scope fixes
//                   goes missing, and nothing the scopes did not bring arrives with the merge
//
// Pure.

import { diffExperienceGraphs } from './experience-graph-convergence.mjs';
import { lawFingerprint } from './experience-graph.mjs';

export const BRANCHES_SCHEMA = 'vexwork.experience-graph.branches/v1';

const compare = (left, right) => (left < right ? -1 : left > right ? 1 : 0);
const BUILD_REF = /^(candidate|scope|consolidated)-[a-z0-9]+(?:-[a-z0-9]+)*$/;

function fail(message) {
  throw new Error(`experience graph builds: ${message}`);
}

export function normalizeBuilds(plan) {
  const builds = plan.builds ?? [];
  const seen = new Map();
  return builds.map((build, index) => {
    const label = `builds[${index}]`;
    const kind = BUILD_REF.exec(build.buildRef ?? '')?.[1];
    if (!kind) fail(`${label} buildRef must look like candidate-some-name, scope-some-name or consolidated-some-name`);
    if (seen.has(build.buildRef)) fail(`${label} buildRef ${build.buildRef} repeats`);
    if (!/^[0-9a-f]{40}$/.test(build.commit ?? '')) fail(`${label} commit must be one exact 40-hex commit`);
    if (typeof build.branch !== 'string' || !build.branch) fail(`${label} needs its source branch`);
    if (build.basis !== 'main') fail(`${label} basis must be main (the preserved projection it is compared against)`);
    if (build.basisCommit !== plan.commit) fail(`${label} basisCommit ${build.basisCommit} is not the pinned main ${plan.commit}; rebase the candidate or re-pin main`);
    const stackedOn = build.stackedOn ?? null;
    if (stackedOn !== null) {
      if (kind !== 'scope') fail(`${label} only a scope may be stacked`);
      if (seen.get(stackedOn) !== 'scope') fail(`${label} is stacked on ${stackedOn}, which is not an earlier scope`);
    }
    const members = build.members ?? null;
    if (kind === 'consolidated') {
      if (!Array.isArray(members) || !members.length) fail(`${label} names the scopes it merges in members`);
      for (const member of members) if (seen.get(member) !== 'scope') fail(`${label} member ${member} is not an earlier scope`);
      if (new Set(members).size !== members.length) fail(`${label} names a member twice`);
    } else if (members !== null) {
      fail(`${label} only a consolidated build has members`);
    }
    seen.set(build.buildRef, kind);
    return {
      buildRef: build.buildRef,
      kind,
      label: build.label ?? build.buildRef,
      summary: build.summary ?? '',
      branch: build.branch,
      commit: build.commit,
      basis: 'main',
      basisCommit: build.basisCommit,
      axis: build.axis ?? null,
      stackedOn,
      members,
    };
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
  // Every route this build has CLEARED that main has not: flipped, or new with its Family.
  const clearedRoutes = [...candidateRoutes.values()]
    .filter((route) => route.status === 'CLEARED' && mainRoutes.get(route.routeRef)?.status !== 'CLEARED')
    .map((route) => route.routeRef)
    .sort(compare);
  const regressed = flips.filter((row) => row.from === 'CLEARED').length;
  return {
    buildRef: candidate.build.buildRef,
    kind: candidate.build.kind ?? 'candidate',
    stackedOn: candidate.build.stackedOn ?? null,
    members: candidate.build.members ?? null,
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
    clearedRoutes,
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

// What a stacked scope adds on top of the scope it is stacked on: the delta a reviewer of that
// PR actually reads.
function ownDelta(parent, row) {
  const parentResolved = new Set(parent.debt.resolved);
  const parentIntroduced = new Set(parent.debt.introduced);
  const parentCleared = new Set(parent.clearedRoutes);
  return {
    resolved: row.debt.resolved.filter((ref) => !parentResolved.has(ref)),
    introduced: row.debt.introduced.filter((ref) => !parentIntroduced.has(ref)),
    reopened: parent.debt.resolved.filter((ref) => !row.debt.resolved.includes(ref)),
    cleared: row.clearedRoutes.filter((ref) => !parentCleared.has(ref)),
  };
}

// A scope brings everything on the stack beneath it.
function withStack(byBuild, ref) {
  const refs = [];
  for (let at = byBuild.get(ref); at; at = at.stackedOn ? byBuild.get(at.stackedOn) : null) refs.push(at.buildRef);
  return refs;
}

const union = (rows, pick) => new Set(rows.flatMap(pick));

/**
 * The consolidation check. A consolidated build is COMPLETE when:
 * - every scope is merged (named, or beneath a named scope on its stack);
 * - every debt row a scope resolves is resolved in the consolidated build;
 * - every route a scope clears is cleared in the consolidated build;
 * - the merge introduces no debt that no scope introduced, and regresses no CLEARED route.
 * Debt the merge resolves on its own (a resolution between scopes) is reported, not refused.
 */
export function checkConsolidation(rows) {
  const byBuild = new Map(rows.map((row) => [row.buildRef, row]));
  const scopes = rows.filter((row) => row.kind === 'scope').map((row) => row.buildRef);
  return rows.filter((row) => row.kind === 'consolidated').map((row) => {
    const merged = [...new Set(row.members.flatMap((member) => withStack(byBuild, member)))].sort(compare);
    const memberRows = merged.map((ref) => byBuild.get(ref));
    const resolvedByScopes = union(memberRows, (member) => member.debt.resolved);
    const introducedByScopes = union(memberRows, (member) => member.debt.introduced);
    const clearedByScopes = union(memberRows, (member) => member.clearedRoutes);
    const resolved = new Set(row.debt.resolved);
    const cleared = new Set(row.clearedRoutes);
    const result = {
      buildRef: row.buildRef,
      members: row.members,
      merged,
      scopesLeftOut: scopes.filter((ref) => !merged.includes(ref)),
      missingResolutions: [...resolvedByScopes].filter((ref) => !resolved.has(ref)).sort(compare),
      missingClearedRoutes: [...clearedByScopes].filter((ref) => !cleared.has(ref)).sort(compare),
      introducedByMerge: row.debt.introduced.filter((ref) => !introducedByScopes.has(ref)),
      resolvedByMerge: row.debt.resolved.filter((ref) => !resolvedByScopes.has(ref)),
      regressedRoutes: row.routeFlips.filter((flip) => flip.from === 'CLEARED').map((flip) => flip.routeRef),
      counts: { resolved: row.debt.resolved.length, resolvedByScopes: resolvedByScopes.size, cleared: row.clearedRoutes.length, clearedByScopes: clearedByScopes.size },
    };
    const gaps = ['scopesLeftOut', 'missingResolutions', 'missingClearedRoutes', 'introducedByMerge', 'regressedRoutes'].filter((key) => result[key].length);
    return { ...result, gaps, verdict: gaps.length ? 'INCOMPLETE' : 'COMPLETE' };
  });
}

export function compareBuilds({ main, candidates }) {
  const rows = candidates.map((candidate) => compareBuild(main, candidate));
  const byBuild = new Map(rows.map((row) => [row.buildRef, row]));
  for (const row of rows) if (row.stackedOn && byBuild.has(row.stackedOn)) row.own = ownDelta(byBuild.get(row.stackedOn), row);
  return {
    schemaVersion: BRANCHES_SCHEMA,
    main: { commit: main.graph.source.commit, graphFingerprint: main.graph.fingerprint, routeCounts: main.routes.counts, debt: main.frontier.debt.length },
    preserved: 'main projection at generated/ is never rewritten by any build',
    candidates: rows.sort((a, b) => compare(a.buildRef, b.buildRef)),
    consolidations: checkConsolidation(rows),
  };
}

const table = (header, rows) => [
  `| ${header.join(' | ')} |`,
  `|${header.map(() => '---').join('|')}|`,
  ...rows.map((row) => `| ${row.map((cell) => String(cell).replace(/\|/g, '\\|')).join(' | ')} |`),
].join('\n');

const list = (refs) => (refs.length ? refs.map((ref) => `\`${ref}\``).join(', ') : 'none');

export function renderBranchReport(branches) {
  const lines = [];
  lines.push('# VexLife-Prod branches against preserved main — generated');
  lines.push('');
  lines.push('`[VXG RealForever]` · generated by `scripts/build-experience-graph.mjs` · do not edit by hand');
  lines.push('');
  lines.push('~~~text');
  lines.push(`main         ${branches.main.commit}   graph ${branches.main.graphFingerprint.slice(0, 12)}`);
  lines.push(`main routes  ${Object.entries(branches.main.routeCounts).map(([status, count]) => `${status} ${count}`).join(' · ')}   debt ${branches.main.debt}`);
  lines.push(`preserved    ${branches.preserved}`);
  lines.push('~~~');
  lines.push('');
  lines.push(table(['build', 'kind', 'axis', 'stacked on', 'branch @ commit', 'verdict', 'routes → CLEARED', 'debt main → build', 'resolved', 'introduced'], branches.candidates.map((row) => [
    `\`${row.buildRef}\``,
    row.kind,
    row.axis ?? '—',
    row.stackedOn ? `\`${row.stackedOn}\`` : '—',
    `\`${row.branch}\` @ \`${row.commit.slice(0, 12)}\``,
    row.verdict,
    row.clearedRoutes.length,
    `${row.debt.main} → ${row.debt.candidate}`,
    Object.entries(row.debt.resolvedByKind).map(([kind, count]) => `${kind} ${count}`).join(', ') || '—',
    Object.entries(row.debt.introducedByKind).map(([kind, count]) => `${kind} ${count}`).join(', ') || '—',
  ])));
  lines.push('');
  for (const check of branches.consolidations ?? []) {
    lines.push(`## Consolidation \`${check.buildRef}\` — ${check.verdict}`);
    lines.push('');
    const beneath = check.merged.filter((ref) => !check.members.includes(ref));
    lines.push(`Merges, in order: ${list(check.members)}${beneath.length ? `; stacked beneath them and merged with them: ${list(beneath)}` : ''}.`);
    lines.push('');
    lines.push(table(['check', 'holds', 'detail'], [
      ['every scope merged', !check.scopesLeftOut.length, `left out: ${list(check.scopesLeftOut)}`],
      ['every resolution a scope makes is kept', !check.missingResolutions.length, `${check.counts.resolved} resolved here; ${check.counts.resolvedByScopes} by the scopes; missing: ${list(check.missingResolutions)}`],
      ['every route a scope clears stays cleared', !check.missingClearedRoutes.length, `${check.counts.cleared} cleared here; ${check.counts.clearedByScopes} by the scopes; missing: ${list(check.missingClearedRoutes)}`],
      ['the merge brings no debt of its own', !check.introducedByMerge.length, `introduced by the merge: ${list(check.introducedByMerge)}`],
      ['no CLEARED route regresses', !check.regressedRoutes.length, `regressed: ${list(check.regressedRoutes)}`],
    ].map(([name, holds, detail]) => [name, holds ? 'yes' : '**no**', detail])));
    lines.push('');
    if (check.resolvedByMerge.length) {
      lines.push(`Resolved by the merge itself (a resolution between scopes): ${list(check.resolvedByMerge)}.`);
      lines.push('');
    }
  }
  for (const row of branches.candidates) {
    lines.push(`## \`${row.buildRef}\` — ${row.label}`);
    lines.push('');
    if (row.summary) {
      lines.push(row.summary);
      lines.push('');
    }
    lines.push(`Route counts: main ${JSON.stringify(row.routeCounts.main)} → build ${JSON.stringify(row.routeCounts.candidate)}.`);
    lines.push('');
    if (row.own) {
      lines.push(`On top of \`${row.stackedOn}\`: resolves ${row.own.resolved.length}, introduces ${row.own.introduced.length}, reopens ${row.own.reopened.length}, clears ${row.own.cleared.length} more route(s).`);
      lines.push('');
    }
    if (row.routeFlips.length) {
      lines.push(table(['route', 'main', 'build'], row.routeFlips.map((flip) => [`\`${flip.routeRef}\``, flip.from, flip.to])));
      lines.push('');
    }
    lines.push(`Law and manifestation edges: +${row.edges.added.length} / −${row.edges.removed.length} / changed ${row.edges.changed.length}. Main's executed law proof ${row.lawProofReusable ? 'stays valid (Family law unchanged)' : 'must be re-run (Family law changed)'}.`);
    lines.push('');
  }
  lines.push('<!-- [VXG RealForever][VEXWORK][VEXLIFE-PROD][E2E][EXPERIENCE-GRAPH][BRANCHES] -->');
  return `${lines.join('\n')}\n`;
}

// [VXG RealForever][VEXWORK][VEXLIFE-PROD][E2E][EXPERIENCE-GRAPH][BRANCHES]
