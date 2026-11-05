import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  BOARD_ROLES,
  CONSIDERATIONS_SCHEMA,
  LENS_CATALOG_SCHEMA,
  STANDING_BUILDS,
  advanceBuild,
  boardHref,
  buildFor,
  githubRepository,
  lensHref,
  normalizeConsiderations,
  normalizeLensCatalog,
  promoteBuild,
  resolveLensRequest,
  sameCommit,
  subjectFor,
  validateSourceRef,
} from '../src/shared/vexboard-lens-catalog.mjs';

const read = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url), 'utf8'));
const rawCatalog = read('../projects/vexboard/lens/catalog.json');
const rawConsiderations = read('../projects/vexboard/lens/considerations.json');
const clone = (value) => JSON.parse(JSON.stringify(value));
const catalog = normalizeLensCatalog(rawCatalog);
const android = subjectFor(catalog, 'vexlife-android');
const SHA_A = '305a09eac1fabebcf2241bd207386950f41121f2';
const SHA_B = '4d357c48eb5a25797513708f800e61a87e0195c0';

test('the committed catalog names every project VexBoard shows and where its builds point', () => {
  assert.equal(catalog.schemaVersion, LENS_CATALOG_SCHEMA);
  assert.deepEqual(catalog.subjects.map((subject) => subject.slug), ['vexlife-android', 'vexlife-prod', 'vexboard']);
  assert.deepEqual(STANDING_BUILDS, ['stable', 'main']);
  assert.equal(android.lens.status, 'GENERATED');
  assert.deepEqual(android.lens.builds.map((build) => build.buildRef), ['stable', 'main']);
  assert.equal(subjectFor(catalog, 'subject.vexlife-prod').lens.status, 'NOT_BUILT');
  assert.equal(subjectFor(catalog, 'nope'), null);
  assert.equal(subjectFor(catalog, null), null);
  assert.ok(Object.isFrozen(catalog.subjects[0].lens.builds));
  for (const board of [...catalog.subjects.flatMap((subject) => subject.boards), ...catalog.trials]) assert.ok(BOARD_ROLES.includes(board.role));
});

test('the Stable pointer and the adapter pin agree, and every lens file exists', () => {
  const adapter = read(`../projects/vexboard/lens/${android.lens.adapter}`);
  assert.equal(buildFor(android, 'stable').commit, adapter.repository.commit);
  for (const build of android.lens.builds) {
    const lens = read(`../projects/vexboard/lens/${build.lens}`);
    assert.equal(lens.sourceSnapshot.commit, build.commit, `${build.buildRef} lens file is generated at its pointer`);
  }
  assert.equal(sameCommit(android), buildFor(android, 'stable').commit === buildFor(android, 'main').commit);
  assert.equal(sameCommit(subjectFor(catalog, 'vexboard')), false);
  assert.equal(buildFor(subjectFor(catalog, 'vexboard'), 'stable'), null);
});

test('a lens URL resolves to a project and build, and bad input falls back to Stable with a reason', () => {
  const at = (query) => resolveLensRequest(catalog, new URLSearchParams(query));
  assert.deepEqual([at('').mode, at('').subject.slug, at('').build.buildRef, at('').notice], ['BUILD', 'vexlife-android', 'stable', null]);
  assert.equal(at('build=main').build.buildRef, 'main');
  assert.equal(at('subject=vexlife-android&commit=4d357c48').commitRef, '4d357c48');
  assert.equal(at('commit=feature/thing').mode, 'COMMIT');
  assert.match(at('build=nightly').notice, /No build named "nightly"/);
  assert.match(at('subject=nope').notice, /No project named "nope"/);
  assert.equal(at('subject=nope').subject.slug, 'vexlife-android');
  assert.equal(at('subject=vexlife-prod').mode, 'NO_LENS');
  assert.equal(at('lens=examples/x.json').mode, 'LEGACY');
  const bad = at('commit=../../etc');
  assert.equal(bad.mode, 'BUILD');
  assert.match(bad.notice, /not a commit SHA, branch or tag name\. Showing Stable\./);
  const closed = clone(rawCatalog);
  closed.subjects[0].lens.anyCommit = false;
  assert.match(resolveLensRequest(normalizeLensCatalog(closed), { commit: 'abc' }).notice, /cannot be projected at an arbitrary commit/);
  assert.equal(resolveLensRequest(catalog, {}).mode, 'BUILD', 'a plain object works as params too');
});

test('hrefs carry the project, build or commit, and where to open', () => {
  assert.equal(lensHref(android), './lens.html?subject=vexlife-android');
  assert.equal(lensHref(android, { build: 'main', screen: 'screen.home', element: 'element.home.x', left: 'STRUCTURE', right: 'DEPTH' }),
    './lens.html?subject=vexlife-android&build=main&screen=screen.home&element=element.home.x&left=STRUCTURE&right=DEPTH');
  assert.equal(lensHref(android, { build: 'main', commit: 'abc1234', base: 'lens.html' }), 'lens.html?subject=vexlife-android&commit=abc1234');
  assert.equal(boardHref('board.vexboard.self-map'), './?board=board.vexboard.self-map');
  assert.equal(boardHref('board.a.b', '../vexboard/'), '../vexboard/?board=board.a.b');
});

test('typed refs are limited to names Git allows', () => {
  for (const ok of ['305a09e', SHA_A, 'main', 'feature/screen-lens', 'v1.2.0', 'VXG-110226_a001']) assert.equal(validateSourceRef(` ${ok} `), ok);
  for (const bad of ['', '   ', '../x', 'a..b', '/abs', 'trailing/', 'x.lock', 'a//b', 'a b', 'a?b', 'a#b', 'a%2e', '-flag', 'x@{1}', 'x'.repeat(101)]) {
    assert.throws(() => validateSourceRef(bad), /lens catalog:/, JSON.stringify(bad));
  }
  assert.deepEqual(githubRepository('https://github.com/vgong24/VexLife-Android'), { owner: 'vgong24', repo: 'VexLife-Android' });
  for (const bad of ['http://github.com/a/b', 'https://gitlab.com/a/b', 'https://github.com/a', 'https://github.com/a/b/c', null]) assert.throws(() => githubRepository(bad), /repository url/);
});

test('advancing Main to Stable\'s commit shares Stable\'s file; to another commit it gets its own', () => {
  const ahead = advanceBuild(rawCatalog, 'vexlife-android', 'main', { commit: SHA_B, observedAt: '2026-11-06', separateLens: 'vexlife-android.main.screen-lens.json' });
  const aheadMain = buildFor(subjectFor(normalizeLensCatalog(ahead.catalog), 'vexlife-android'), 'main');
  assert.deepEqual([aheadMain.commit, aheadMain.lens, aheadMain.observedAt], [SHA_B, 'vexlife-android.main.screen-lens.json', '2026-11-06']);
  assert.deepEqual([ahead.lens, ahead.write, ahead.retire], ['vexlife-android.main.screen-lens.json', true, null]);
  assert.equal(buildFor(android, 'main').commit, SHA_A, 'the input catalog is not mutated');

  const back = advanceBuild(ahead.catalog, 'vexlife-android', 'main', { commit: SHA_A });
  assert.deepEqual([back.lens, back.write, back.retire], ['vexlife-android.screen-lens.json', false, 'vexlife-android.main.screen-lens.json']);

  const stable = advanceBuild(rawCatalog, 'vexlife-android', 'stable', { commit: SHA_A });
  assert.equal(stable.write, true);
  assert.throws(() => advanceBuild(rawCatalog, 'vexlife-android', 'stable', { commit: SHA_B }), /share .* different commits/);
  assert.throws(() => advanceBuild(rawCatalog, 'vexlife-android', 'main', { commit: 'abc' }), /full commit SHA/);
  assert.throws(() => advanceBuild(rawCatalog, 'vexlife-android', 'main', { commit: SHA_B }), /separateLens required/);
  assert.throws(() => advanceBuild(rawCatalog, 'vexlife-prod', 'main', { commit: SHA_B }), /no generated lens/);
});

test('promoting Main moves Stable to Main\'s commit and folds the two files back into one', () => {
  const ahead = advanceBuild(rawCatalog, 'vexlife-android', 'main', { commit: SHA_B, observedAt: '2026-11-06', separateLens: 'vexlife-android.main.screen-lens.json' }).catalog;
  const promoted = promoteBuild(ahead, 'vexlife-android', { on: '2026-11-07', evidence: ['github.pull.vexwork.999'] });
  const subject = subjectFor(normalizeLensCatalog(promoted.catalog), 'vexlife-android');
  assert.deepEqual([buildFor(subject, 'stable').commit, buildFor(subject, 'stable').since, buildFor(subject, 'stable').observedAt], [SHA_B, '2026-11-07', '2026-11-06']);
  assert.deepEqual(buildFor(subject, 'stable').evidence, ['github.pull.vexwork.999']);
  assert.equal(buildFor(subject, 'main').lens, 'vexlife-android.screen-lens.json');
  assert.deepEqual([promoted.changed, promoted.copy, promoted.retire], [true, { from: 'vexlife-android.main.screen-lens.json', to: 'vexlife-android.screen-lens.json' }, 'vexlife-android.main.screen-lens.json']);
  const noop = promoteBuild(rawCatalog, 'vexlife-android', { on: '2026-11-07' });
  assert.deepEqual([noop.changed, noop.copy, noop.retire], [false, null, null]);
  assert.throws(() => promoteBuild(rawCatalog, 'vexlife-android', { on: 'tomorrow' }), /YYYY-MM-DD/);
  assert.throws(() => promoteBuild(rawCatalog, 'vexboard', { on: '2026-11-07' }), /no generated lens/);
});

test('the catalog fails closed on shapes a reader could misread', () => {
  const broken = (mutate) => { const next = clone(rawCatalog); mutate(next); return () => normalizeLensCatalog(next); };
  const cases = [
    [(c) => { c.schemaVersion = 'x'; }, /schemaVersion/],
    [(c) => { c.subjects = []; }, /at least one subject/],
    [(c) => { c.subjects[1].slug = 'vexlife-android'; c.subjects[1].subjectRef = 'subject.vexlife-android'; }, /duplicate subjectRef/],
    [(c) => { c.subjects[0].slug = 'Bad Slug'; }, /slug must be/],
    [(c) => { c.subjects[0].subjectRef = 'subject.other'; }, /subjectRef must be subject\.vexlife-android/],
    [(c) => { c.subjects[0].repositoryRef = 'project.x'; }, /must start with repo\./],
    [(c) => { c.subjects[0].repository.url = 'https://example.com/a/b'; }, /repository url/],
    [(c) => { c.subjects[0].lens.status = 'MAYBE'; }, /status must be one of/],
    [(c) => { c.subjects[0].lens.builds.pop(); }, /exactly one main build/],
    [(c) => { c.subjects[0].lens.builds[1].buildRef = 'stable'; }, /exactly one stable build/],
    [(c) => { c.subjects[0].lens.builds[0].buildRef = 'nightly'; }, /buildRef must be one of/],
    [(c) => { c.subjects[0].lens.builds[0].commit = '305a09e'; }, /full 40-character SHA/],
    [(c) => { c.subjects[0].lens.builds[0].lens = '../escape.json'; }, /relative \.json path/],
    [(c) => { c.subjects[0].lens.builds[0].lens = 'https://x/a.json'; }, /relative \.json path/],
    [(c) => { c.subjects[0].lens.builds[0].since = '05/11/2026'; }, /since must be/],
    [(c) => { c.subjects[0].lens.builds[0].observedAt = 'yesterday'; }, /observedAt must be/],
    [(c) => { c.subjects[0].lens.builds[1].commit = SHA_B; }, /share .* different commits/],
    [(c) => { c.subjects[0].lens.builds[0].evidence = 'x'; }, /evidence must be a list/],
    [(c) => { c.subjects[1].lens.reason = ''; }, /reason required/],
    [(c) => { c.subjects[0].boards[0].role = 'PRIMARY'; }, /role must be one of/],
    [(c) => { c.subjects[0].boards[0].boardRef = 'lens.x.y'; }, /must start with board\./],
    [(c) => { c.defaultSubjectRef = 'subject.nope'; }, /not a subject/],
    [(c) => { c.defaultSubjectRef = 'subject.vexboard'; }, /must have a generated lens/],
    [(c) => { c.subjects[0].vexworkProjectRefs = ['repo.x']; }, /must start with project\./],
  ];
  for (const [mutate, message] of cases) assert.throws(broken(mutate), message, String(message));
  assert.throws(() => normalizeLensCatalog(null), /schemaVersion/);
  const withoutOverlay = clone(rawCatalog);
  delete withoutOverlay.subjects[0].lens.overlay;
  assert.equal(subjectFor(normalizeLensCatalog(withoutOverlay), 'vexlife-android').lens.overlay, null);
});

test('notes to consider are proposals with a threshold, never Work items', () => {
  const notes = normalizeConsiderations(rawConsiderations);
  assert.equal(notes.schemaVersion, CONSIDERATIONS_SCHEMA);
  assert.equal(notes.authority, 'PROPOSAL_ONLY');
  assert.equal(notes.captureProcess, 'process.vexwork.capture-discovered-work');
  assert.ok(notes.entries.length >= 5);
  const subjects = new Set(catalog.subjects.map((subject) => subject.subjectRef));
  for (const entry of notes.entries) {
    assert.ok(entry.threshold.length > 10, `${entry.ref} says when to discuss it`);
    assert.ok(entry.subjectRefs.every((ref) => subjects.has(ref)), `${entry.ref} names real projects`);
  }
  const broken = (mutate) => { const next = clone(rawConsiderations); mutate(next); return () => normalizeConsiderations(next); };
  assert.throws(broken((n) => { n.authority = 'WORK'; }), /PROPOSAL_ONLY/);
  assert.throws(broken((n) => { n.schemaVersion = 'x'; }), /considerations schemaVersion/);
  assert.throws(broken((n) => { n.entries[1].ref = n.entries[0].ref; }), /duplicate consideration/);
  assert.throws(broken((n) => { n.entries[0].status = 'PLANNED'; }), /status must be one of/);
  assert.throws(broken((n) => { n.entries[0].threshold = ' '; }), /threshold required/);
  assert.throws(broken((n) => { n.entries[0].ref = 'work.x.y'; }), /must start with consider\./);
  const captured = clone(rawConsiderations);
  captured.entries[0].status = 'CAPTURED';
  captured.entries[0].capturedAs = 'work.vexboard.meaning-bisect';
  assert.equal(normalizeConsiderations(captured).entries[0].capturedAs, 'work.vexboard.meaning-bisect');
});

// [VXG RealForever][VEXWORK][VEXBOARD][LENS-CATALOG][TEST]
