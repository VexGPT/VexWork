import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CommitSourceError,
  GITHUB_API,
  GITHUB_RAW,
  compareCommits,
  listRecentCommits,
  projectCommit,
  resolveCommit,
} from '../src/shared/vexboard-lens-commit-source.mjs';

const SHA = '4d357c48eb5a25797513708f800e61a87e0195c0';
const REPO = 'https://github.com/vgong24/VexLife-Android';
const adapter = { repository: { url: REPO, commit: '305a09eac1fabebcf2241bd207386950f41121f2', roots: {} } };
const commitBody = { sha: SHA, commit: { committer: { date: '2026-11-02T18:00:00Z' }, message: 'Merge pull request #210\n\nbody' } };
const tree = {
  truncated: false,
  tree: [
    { type: 'blob', path: 'app/screens/HomeScreen.kt' },
    { type: 'blob', path: 'app/screens/notes.md' },
    { type: 'tree', path: 'app/screens' },
    { type: 'blob', path: 'app/res/strings.xml' },
    { type: 'blob', path: 'other/Elsewhere.kt' },
  ],
};
const readPlan = () => ({ includes: (path) => path === 'app/res/strings.xml' || (path.startsWith('app/screens/') && path.endsWith('.kt')) });

function response(status, body, headers = {}) {
  return {
    status,
    ok: status >= 200 && status < 300,
    headers: { get: (name) => headers[name.toLowerCase()] ?? null },
    json: async () => body,
    text: async () => (typeof body === 'string' ? body : JSON.stringify(body)),
  };
}

function fakeGitHub(overrides = {}) {
  const calls = [];
  const fetch = async (url, init) => {
    calls.push({ url, init });
    if (overrides[url]) return overrides[url]();
    if (url === `${GITHUB_API}/repos/vgong24/VexLife-Android/commits/4d357c48`) return response(200, commitBody);
    if (url === `${GITHUB_API}/repos/vgong24/VexLife-Android/git/trees/${SHA}?recursive=1`) return response(200, tree);
    if (url.startsWith(`${GITHUB_RAW}/vgong24/VexLife-Android/${SHA}/`)) return response(200, `text of ${url.split(`${SHA}/`)[1]}`);
    if (url.startsWith(`${GITHUB_API}/repos/vgong24/VexLife-Android/commits?sha=main`)) return response(200, [commitBody, { sha: 'not-a-sha' }]);
    return response(404, { message: 'Not Found' });
  };
  return { fetch, calls };
}

test('a typed ref resolves to one commit through the GitHub API', async () => {
  const { fetch, calls } = fakeGitHub();
  const commit = await resolveCommit({ repositoryUrl: REPO, ref: ' 4d357c48 ', fetch });
  assert.deepEqual(commit, { sha: SHA, date: '2026-11-02T18:00:00Z', message: 'Merge pull request #210' });
  assert.equal(calls[0].init.headers.Accept, 'application/vnd.github+json');
  await assert.rejects(resolveCommit({ repositoryUrl: REPO, ref: 'missing', fetch }), (error) => error instanceof CommitSourceError && error.kind === 'NOT_FOUND' && /no commit, branch or tag named "missing"/.test(error.message));
  await assert.rejects(resolveCommit({ repositoryUrl: REPO, ref: '../x', fetch }), /not a commit SHA/);
  await assert.rejects(resolveCommit({ repositoryUrl: 'https://example.com/a/b', ref: 'main', fetch }), /repository url/);
});

test('recent commits list only real SHAs and clamp the count', async () => {
  const { fetch, calls } = fakeGitHub();
  const commits = await listRecentCommits({ repositoryUrl: REPO, branch: 'main', fetch, count: 99 });
  assert.deepEqual(commits.map((commit) => commit.sha), [SHA]);
  assert.match(calls[0].url, /per_page=30$/);
});

test('a commit is projected from exactly the planned files, pinned, and with a lenient overlay', async () => {
  const { fetch, calls } = fakeGitHub();
  const progress = [];
  let received = null;
  const project = (input) => { received = input; return { lens: { lensRef: 'lens.x' }, report: { overlayMisses: ['note.gone'] } }; };
  const overlay = { schemaVersion: 'vexboard.screen-lens-overlay/v1' };
  const result = await projectCommit({ adapter, overlay, ref: '4d357c48', fetch, project, readPlan, onProgress: (event) => progress.push(event), concurrency: 2 });
  assert.equal(result.commit.sha, SHA);
  assert.equal(result.fileCount, 2);
  assert.deepEqual(result.report.overlayMisses, ['note.gone']);
  assert.deepEqual([...received.files.keys()], ['app/res/strings.xml', 'app/screens/HomeScreen.kt']);
  assert.equal(received.files.get('app/screens/HomeScreen.kt'), 'text of app/screens/HomeScreen.kt');
  assert.equal(received.adapter.repository.commit, SHA, 'the adapter is pinned to the resolved commit');
  assert.equal(adapter.repository.commit, '305a09eac1fabebcf2241bd207386950f41121f2', 'the caller adapter is untouched');
  assert.deepEqual([received.overlay, received.overlayMode, received.observedAt], [overlay, 'LENIENT', '2026-11-02']);
  assert.deepEqual(progress.map((event) => event.phase), ['RESOLVE', 'FETCH', 'FETCH', 'FETCH', 'PROJECT']);
  assert.deepEqual(progress.at(-2), { phase: 'FETCH', done: 2, total: 2 });
  const hosts = new Set(calls.map((call) => new URL(call.url).host));
  assert.deepEqual([...hosts].sort(), ['api.github.com', 'raw.githubusercontent.com']);
});

test('a pointer can be compared with its branch', async () => {
  const url = `${GITHUB_API}/repos/vgong24/VexLife-Android/compare/${SHA}...main`;
  const { fetch } = fakeGitHub({ [url]: () => response(200, { ahead_by: 3, behind_by: 0, status: 'ahead' }) });
  assert.deepEqual(await compareCommits({ repositoryUrl: REPO, base: SHA, head: 'main', fetch }), { aheadBy: 3, behindBy: 0, status: 'ahead' });
  const empty = fakeGitHub({ [url]: () => response(200, {}) });
  assert.deepEqual(await compareCommits({ repositoryUrl: REPO, base: SHA, head: 'main', fetch: empty.fetch }), { aheadBy: 0, behindBy: 0, status: 'unknown' });
  await assert.rejects(compareCommits({ repositoryUrl: REPO, base: SHA, head: 'gone', fetch }), /cannot compare/);
  await assert.rejects(compareCommits({ repositoryUrl: REPO, base: '..', head: 'main', fetch }), /not a commit SHA/);
});

test('an already-resolved commit skips the lookup', async () => {
  const { fetch, calls } = fakeGitHub();
  const result = await projectCommit({ adapter, ref: 'ignored', resolved: { sha: SHA, date: null, message: 'm' }, fetch, project: (input) => ({ lens: { observedAt: input.observedAt }, report: {} }), readPlan });
  assert.equal(result.lens.observedAt, null);
  assert.ok(!calls.some((call) => call.url.includes('/commits/')), 'no commit lookup');
});

test('GitHub failures become plain explanations a person can act on', async () => {
  const project = () => ({ lens: {}, report: {} });
  const attempt = (overrides, extra = {}) => projectCommit({ adapter, ref: '4d357c48', fetch: fakeGitHub(overrides).fetch, project, readPlan, ...extra });
  const commitUrl = `${GITHUB_API}/repos/vgong24/VexLife-Android/commits/4d357c48`;
  const treeUrl = `${GITHUB_API}/repos/vgong24/VexLife-Android/git/trees/${SHA}?recursive=1`;
  await assert.rejects(attempt({ [commitUrl]: () => response(403, {}, { 'x-ratelimit-remaining': '0', 'x-ratelimit-reset': '1793780400' }) }), (error) => error.kind === 'RATE_LIMIT' && /60 requests an hour/.test(error.message) && /resets at \d\d:\d\d UTC/.test(error.message));
  await assert.rejects(attempt({ [commitUrl]: () => response(403, {}, { 'x-ratelimit-remaining': '12' }) }), (error) => error.kind === 'HTTP' && /HTTP 403/.test(error.message));
  await assert.rejects(attempt({ [commitUrl]: () => { throw new Error('offline'); } }), (error) => error.kind === 'NETWORK' && /offline/.test(error.message));
  await assert.rejects(attempt({ [commitUrl]: () => response(200, { sha: 'nope' }) }), /did not return a commit/);
  await assert.rejects(attempt({ [treeUrl]: () => response(200, { truncated: true, tree: [] }) }), (error) => error.kind === 'TREE_TRUNCATED');
  await assert.rejects(attempt({ [treeUrl]: () => response(200, { tree: [{ type: 'blob', path: 'README.md' }] }) }), (error) => error.kind === 'SHAPE' && /older than the app structure/.test(error.message));
  await assert.rejects(attempt({ [`${GITHUB_RAW}/vgong24/VexLife-Android/${SHA}/app/screens/HomeScreen.kt`]: () => response(500, '') }), /Could not download app\/screens\/HomeScreen\.kt \(HTTP 500\)/);
  await assert.rejects(attempt({ [`${GITHUB_RAW}/vgong24/VexLife-Android/${SHA}/app/res/strings.xml`]: () => { throw new Error('reset'); } }), (error) => error.kind === 'NETWORK');
  await assert.rejects(attempt({}, { project: () => { throw new Error('adapter source app:screens/AppScreens.kt missing'); } }), (error) => error.kind === 'SHAPE' && /could not read 4d357c4: adapter source/.test(error.message));
  await assert.rejects(projectCommit({ adapter, ref: 'x', fetch: async () => response(200, {}) }), /needs the adapter project and readPlan/);
});

// [VXG RealForever][VEXWORK][VEXBOARD][LENS-COMMIT-SOURCE][TEST]
