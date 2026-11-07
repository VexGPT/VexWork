// Project a Screen Lens at any commit, in the browser, from public GitHub source.
//
// The same pure adapter the build script runs is handed in as `project`, and the same read plan
// decides which files to fetch, so a commit projected here matches what the script would generate
// (overlay entries that do not apply at that commit are skipped and listed instead of failing).
//
// Boundary: reads only from api.github.com and raw.githubusercontent.com for the repository named in
// the catalog; the typed ref is validated before it is placed in a URL; fetched Kotlin is parsed as
// text and never executed; nothing is written back anywhere; no token is used or stored.

import { githubRepository, validateSourceRef } from './vexboard-lens-catalog.mjs';

export const GITHUB_API = 'https://api.github.com';
export const GITHUB_RAW = 'https://raw.githubusercontent.com';

export class CommitSourceError extends Error {
  constructor(message, kind) {
    super(message);
    this.name = 'CommitSourceError';
    this.kind = kind;
  }
}

function clock(epochSeconds) {
  const date = new Date(Number(epochSeconds) * 1000);
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(11, 16);
}

async function getJson(fetchImpl, url, notFound) {
  let response;
  try {
    response = await fetchImpl(url, { headers: { Accept: 'application/vnd.github+json' } });
  } catch (error) {
    throw new CommitSourceError(`Could not reach GitHub (${error?.message ?? error}). Check the connection and try again.`, 'NETWORK');
  }
  if (response.status === 404 || response.status === 422) throw new CommitSourceError(notFound, 'NOT_FOUND');
  if ((response.status === 403 || response.status === 429) && response.headers?.get?.('x-ratelimit-remaining') === '0') {
    const reset = clock(response.headers.get('x-ratelimit-reset'));
    throw new CommitSourceError(`GitHub's limit for this browser is used up (60 requests an hour without signing in).${reset ? ` It resets at ${reset} UTC.` : ''} Stable and Main still work.`, 'RATE_LIMIT');
  }
  if (!response.ok) throw new CommitSourceError(`GitHub answered HTTP ${response.status} for ${url}.`, 'HTTP');
  return response.json();
}

function commitSummary(body) {
  return {
    sha: body.sha,
    date: body.commit?.committer?.date ?? body.commit?.author?.date ?? null,
    message: String(body.commit?.message ?? '').split('\n')[0],
  };
}

export async function resolveCommit({ repositoryUrl, ref, fetch: fetchImpl }) {
  const { owner, repo } = githubRepository(repositoryUrl);
  const name = validateSourceRef(ref);
  const body = await getJson(fetchImpl, `${GITHUB_API}/repos/${owner}/${repo}/commits/${encodeURIComponent(name)}`, `${repo} has no commit, branch or tag named "${name}".`);
  if (!/^[0-9a-f]{40}$/.test(String(body?.sha))) throw new CommitSourceError(`GitHub did not return a commit for "${name}".`, 'HTTP');
  return commitSummary(body);
}

export async function listRecentCommits({ repositoryUrl, branch, fetch: fetchImpl, count = 12 }) {
  const { owner, repo } = githubRepository(repositoryUrl);
  const name = validateSourceRef(branch);
  const body = await getJson(fetchImpl, `${GITHUB_API}/repos/${owner}/${repo}/commits?sha=${encodeURIComponent(name)}&per_page=${Math.max(1, Math.min(30, count))}`, `${repo} has no branch named "${name}".`);
  return (Array.isArray(body) ? body : []).filter((entry) => /^[0-9a-f]{40}$/.test(String(entry?.sha))).map(commitSummary);
}

// How far a pointer is behind a branch: { aheadBy, behindBy, status } from GitHub's compare view.
// The Projects surface may advance Main only along a forward branch relationship. A rewound, diverged
// or ambiguous branch is not "current" merely because GitHub reports zero commits ahead.
export async function compareCommits({ repositoryUrl, base, head, fetch: fetchImpl }) {
  const { owner, repo } = githubRepository(repositoryUrl);
  const from = validateSourceRef(base);
  const to = validateSourceRef(head);
  const body = await getJson(fetchImpl, `${GITHUB_API}/repos/${owner}/${repo}/compare/${encodeURIComponent(from)}...${encodeURIComponent(to)}`, `${repo} cannot compare ${from} with ${to}.`);
  const comparison = {
    aheadBy: Number(body.ahead_by ?? 0),
    behindBy: Number(body.behind_by ?? 0),
    status: String(body.status ?? 'unknown'),
  };
  if (comparison.status === 'behind') {
    throw new CommitSourceError(`The live branch is ${comparison.behindBy} commit${comparison.behindBy === 1 ? '' : 's'} behind the catalog pointer. It may have moved backward; re-ground before moving either pointer.`, 'NON_FORWARD');
  }
  if (comparison.status === 'diverged') {
    throw new CommitSourceError(`The live branch diverged from the catalog pointer (${comparison.aheadBy} ahead, ${comparison.behindBy} behind). Re-ground before moving either pointer.`, 'NON_FORWARD');
  }
  if (comparison.status !== 'ahead' && comparison.status !== 'identical') {
    throw new CommitSourceError('GitHub could not establish a forward relationship between the catalog pointer and the live branch. Re-ground before claiming either pointer is current.', 'NON_FORWARD');
  }
  return comparison;
}

async function inBatches(items, size, task) {
  const results = new Array(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const index = next;
      next += 1;
      results[index] = await task(items[index], index);
    }
  };
  await Promise.all(Array.from({ length: Math.min(size, items.length) }, worker));
  return results;
}

// `resolved` (from resolveCommit) skips the lookup when the caller already resolved the ref.
export async function projectCommit({ adapter, overlay = null, ref, resolved = null, fetch: fetchImpl, project, readPlan, onProgress = () => {}, concurrency = 8 }) {
  if (typeof project !== 'function' || typeof readPlan !== 'function') throw new TypeError('projectCommit needs the adapter project and readPlan functions');
  const repositoryUrl = adapter?.repository?.url;
  const { owner, repo } = githubRepository(repositoryUrl);
  onProgress({ phase: 'RESOLVE', done: 0, total: 0 });
  const commit = resolved && /^[0-9a-f]{40}$/.test(String(resolved.sha)) ? resolved : await resolveCommit({ repositoryUrl, ref, fetch: fetchImpl });
  const tree = await getJson(fetchImpl, `${GITHUB_API}/repos/${owner}/${repo}/git/trees/${commit.sha}?recursive=1`, `GitHub has no file tree for ${commit.sha.slice(0, 7)}.`);
  if (tree.truncated) throw new CommitSourceError(`${repo}'s file tree at ${commit.sha.slice(0, 7)} is too large for GitHub to list in one request.`, 'TREE_TRUNCATED');
  const plan = readPlan(adapter);
  const paths = (tree.tree ?? []).filter((entry) => entry.type === 'blob' && plan.includes(entry.path)).map((entry) => entry.path).sort();
  if (!paths.length) throw new CommitSourceError(`None of the folders this lens reads exist at ${commit.sha.slice(0, 7)}. The commit is probably older than the app structure the adapter understands.`, 'SHAPE');
  let done = 0;
  onProgress({ phase: 'FETCH', done, total: paths.length });
  const texts = await inBatches(paths, concurrency, async (path) => {
    let response;
    try {
      response = await fetchImpl(`${GITHUB_RAW}/${owner}/${repo}/${commit.sha}/${path.split('/').map(encodeURIComponent).join('/')}`);
    } catch (error) {
      throw new CommitSourceError(`Could not download ${path} (${error?.message ?? error}).`, 'NETWORK');
    }
    if (!response.ok) throw new CommitSourceError(`Could not download ${path} (HTTP ${response.status}).`, 'HTTP');
    const body = await response.text();
    done += 1;
    onProgress({ phase: 'FETCH', done, total: paths.length });
    return body;
  });
  const files = new Map(paths.map((path, index) => [path, texts[index]]));
  // Listed evidence paths (for example golden reference renders): existence only, never downloaded.
  const listing = typeof plan.lists === 'function' ? (tree.tree ?? []).filter((entry) => entry.type === 'blob' && plan.lists(entry.path)).map((entry) => entry.path).sort() : [];
  onProgress({ phase: 'PROJECT', done: paths.length, total: paths.length });
  const pinned = { ...adapter, repository: { ...adapter.repository, commit: commit.sha } };
  let projected;
  try {
    projected = project({ adapter: pinned, files, listing, overlay, observedAt: commit.date ? commit.date.slice(0, 10) : null, overlayMode: 'LENIENT' });
  } catch (error) {
    throw new CommitSourceError(`The adapter could not read ${commit.sha.slice(0, 7)}: ${error?.message ?? error}. This commit's source shape is probably older or newer than the adapter understands.`, 'SHAPE');
  }
  return { lens: projected.lens, report: projected.report, commit, fileCount: paths.length };
}

// [VXG RealForever][VEXWORK][VEXBOARD][LENS-COMMIT-SOURCE]
