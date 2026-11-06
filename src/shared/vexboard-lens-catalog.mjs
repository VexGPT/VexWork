// VexBoard lens catalog: which subjects VexBoard can project, and where each one's builds point.
//
// One file owns the pointers (projects/vexboard/lens/catalog.json), so a human, a script or an AI
// can answer "which commit is Stable for VexLife Android?" by reading one place.
//
// UI words: Project, Stable, Main, Commit. Data words: subject (so it does not collide with VexWork
// project.* identities), build, commit. Each subject names the repositoryRef and the VexWork
// projectRefs it relates to.

export const LENS_CATALOG_SCHEMA = 'vexboard.lens-catalog/v1';
export const STANDING_BUILDS = Object.freeze(['stable', 'main']);
export const LENS_STATUSES = Object.freeze(['GENERATED', 'NOT_BUILT']);
export const BOARD_ROLES = Object.freeze(['RELATED', 'TRIAL']);

const SHA = /^[0-9a-f]{40}$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const REF = /^[a-z][a-z0-9-]*(?:\.[a-z0-9][a-z0-9-]*)+$/;
const GITHUB_REPO = /^https:\/\/github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

function fail(message) {
  throw new TypeError(`lens catalog: ${message}`);
}
function text(value, label) {
  if (typeof value !== 'string' || !value.trim()) fail(`${label} required`);
  return value.trim();
}
function optionalText(value, label) {
  if (value === undefined || value === null) return null;
  return text(value, label);
}
function ref(value, label, prefix) {
  const out = text(value, label);
  if (!REF.test(out)) fail(`${label} must be a dotted ref`);
  if (prefix && !out.startsWith(`${prefix}.`)) fail(`${label} must start with ${prefix}.`);
  return out;
}
function relativeJson(value, label) {
  const out = text(value, label);
  if (/^[a-z]+:|^\/|\.\.|\\/i.test(out) || !out.endsWith('.json')) fail(`${label} must be a relative .json path inside the lens folder`);
  return out;
}
function list(value, label) {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) fail(`${label} must be a list`);
  return value;
}
function freeze(value) {
  if (Array.isArray(value)) { value.forEach(freeze); return Object.freeze(value); }
  if (value && typeof value === 'object') { Object.values(value).forEach(freeze); return Object.freeze(value); }
  return value;
}

export function githubRepository(url) {
  const match = GITHUB_REPO.exec(String(url ?? ''));
  if (!match) fail(`repository url must be https://github.com/<owner>/<repo>: ${url}`);
  return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
}

// A commit, branch or tag the person typed. Only names Git itself allows, nothing that could
// escape the GitHub path it is placed into.
export function validateSourceRef(value) {
  const out = String(value ?? '').trim();
  if (!out) fail('enter a commit SHA, branch or tag');
  if (out.length > 100) fail('that ref is too long');
  if (!/^[A-Za-z0-9][A-Za-z0-9._/-]*$/.test(out)) fail(`"${out}" is not a commit SHA, branch or tag name`);
  if (/\.\.|\/\/|\/$|\.lock$|^\/|@\{/.test(out)) fail(`"${out}" is not a commit SHA, branch or tag name`);
  return out;
}

// Accept a raw Git ref or a pasted GitHub commit/tree URL, but only for the selected subject's
// repository. A link to another repository must never be reinterpreted as a ref in this one.
export function sourceRefFromInput(value, expectedRepositoryUrl) {
  const input = String(value ?? '').trim();
  const match = /^https:\/\/github\.com\/([^/?#]+)\/([^/?#]+)\/(?:commit|tree)\/([^?#]+)(?:[?#].*)?$/.exec(input);
  if (!match) return validateSourceRef(input);
  const expected = githubRepository(expectedRepositoryUrl);
  const actual = { owner: match[1], repo: match[2].replace(/\.git$/, '') };
  if (actual.owner.toLowerCase() !== expected.owner.toLowerCase() || actual.repo.toLowerCase() !== expected.repo.toLowerCase()) {
    fail(`that GitHub link points at ${actual.owner}/${actual.repo}, not ${expected.owner}/${expected.repo}`);
  }
  let decoded;
  try { decoded = decodeURIComponent(match[3]); }
  catch { fail('that GitHub link contains an invalid encoded ref'); }
  return validateSourceRef(decoded);
}

function normalizeBuild(input, label) {
  const buildRef = text(input?.buildRef, `${label} buildRef`);
  if (!STANDING_BUILDS.includes(buildRef)) fail(`${label} buildRef must be one of ${STANDING_BUILDS.join(', ')}`);
  const commit = text(input.commit, `${label} commit`);
  if (!SHA.test(commit)) fail(`${label} commit must be a full 40-character SHA`);
  const since = optionalText(input.since, `${label} since`);
  if (since && !DATE.test(since)) fail(`${label} since must be YYYY-MM-DD`);
  const observedAt = optionalText(input.observedAt, `${label} observedAt`);
  if (observedAt && !DATE.test(observedAt)) fail(`${label} observedAt must be YYYY-MM-DD`);
  const branch = optionalText(input.branch, `${label} branch`);
  const evidence = list(input.evidence, `${label} evidence`).map((entry, index) => text(entry, `${label} evidence[${index}]`));
  if (buildRef === 'stable' && !since) fail(`${label} Stable needs an acceptance date`);
  if (buildRef === 'stable' && !evidence.length) fail(`${label} Stable needs acceptance evidence`);
  if (buildRef === 'main' && !branch) fail(`${label} Main needs its source branch`);
  return {
    buildRef,
    label: text(input.label, `${label} label`),
    summary: optionalText(input.summary, `${label} summary`),
    commit,
    branch,
    lens: relativeJson(input.lens, `${label} lens`),
    since,
    observedAt,
    evidence,
  };
}

function normalizeLens(input, label) {
  const status = text(input?.status, `${label} status`);
  if (!LENS_STATUSES.includes(status)) fail(`${label} status must be one of ${LENS_STATUSES.join(', ')}`);
  if (status === 'NOT_BUILT') {
    return { status, reason: text(input.reason, `${label} reason`), next: text(input.next, `${label} next`) };
  }
  const builds = list(input.builds, `${label} builds`).map((build, index) => normalizeBuild(build, `${label} builds[${index}]`));
  for (const buildRef of STANDING_BUILDS) {
    const count = builds.filter((build) => build.buildRef === buildRef).length;
    if (count !== 1) fail(`${label} needs exactly one ${buildRef} build`);
  }
  const byFile = new Map();
  for (const build of builds) {
    const other = byFile.get(build.lens);
    if (other && other.commit !== build.commit) fail(`${label} builds ${other.buildRef} and ${build.buildRef} share ${build.lens} but point at different commits`);
    byFile.set(build.lens, build);
  }
  return {
    status,
    adapter: relativeJson(input.adapter, `${label} adapter`),
    overlay: input.overlay === undefined || input.overlay === null ? null : relativeJson(input.overlay, `${label} overlay`),
    anyCommit: input.anyCommit === true,
    builds: STANDING_BUILDS.map((buildRef) => builds.find((build) => build.buildRef === buildRef)),
  };
}

function normalizeBoard(input, label) {
  const role = text(input?.role, `${label} role`);
  if (!BOARD_ROLES.includes(role)) fail(`${label} role must be one of ${BOARD_ROLES.join(', ')}`);
  return { boardRef: ref(input.boardRef, `${label} boardRef`, 'board'), label: text(input.label, `${label} label`), summary: optionalText(input.summary, `${label} summary`), role };
}

function normalizeSubject(input, index) {
  const label = `subjects[${index}]`;
  const slug = text(input?.slug, `${label} slug`);
  if (!SLUG.test(slug)) fail(`${label} slug must be lowercase words joined by hyphens`);
  const subjectRef = ref(input.subjectRef, `${label} subjectRef`, 'subject');
  if (subjectRef !== `subject.${slug}`) fail(`${label} subjectRef must be subject.${slug}`);
  const repository = input.repository ?? {};
  githubRepository(repository.url);
  return {
    subjectRef,
    slug,
    label: text(input.label, `${label} label`),
    summary: text(input.summary, `${label} summary`),
    repositoryRef: ref(input.repositoryRef, `${label} repositoryRef`, 'repo'),
    repository: { url: repository.url, defaultBranch: text(repository.defaultBranch, `${label} repository.defaultBranch`) },
    vexworkProjectRefs: list(input.vexworkProjectRefs, `${label} vexworkProjectRefs`).map((entry, i) => ref(entry, `${label} vexworkProjectRefs[${i}]`, 'project')),
    lens: normalizeLens(input.lens, `${label} lens`),
    boards: list(input.boards, `${label} boards`).map((board, i) => normalizeBoard(board, `${label} boards[${i}]`)),
  };
}

export function normalizeLensCatalog(input) {
  if (!input || input.schemaVersion !== LENS_CATALOG_SCHEMA) fail(`schemaVersion must be ${LENS_CATALOG_SCHEMA}`);
  const subjects = list(input.subjects, 'subjects').map(normalizeSubject);
  if (!subjects.length) fail('at least one subject required');
  for (const key of ['subjectRef', 'slug']) {
    const seen = new Set();
    for (const subject of subjects) {
      if (seen.has(subject[key])) fail(`duplicate ${key} ${subject[key]}`);
      seen.add(subject[key]);
    }
  }
  const defaultSubjectRef = ref(input.defaultSubjectRef, 'defaultSubjectRef', 'subject');
  const fallback = subjects.find((subject) => subject.subjectRef === defaultSubjectRef);
  if (!fallback) fail(`defaultSubjectRef ${defaultSubjectRef} is not a subject`);
  if (fallback.lens.status !== 'GENERATED') fail('defaultSubjectRef must have a generated lens');
  return freeze({
    schemaVersion: LENS_CATALOG_SCHEMA,
    catalogRef: ref(input.catalogRef, 'catalogRef', 'catalog'),
    title: text(input.title, 'title'),
    defaultSubjectRef,
    subjects,
    trials: list(input.trials, 'trials').map((board, i) => normalizeBoard(board, `trials[${i}]`)),
  });
}

export function subjectFor(catalog, key) {
  if (!key) return null;
  return catalog.subjects.find((subject) => subject.slug === key || subject.subjectRef === key) ?? null;
}

export function buildFor(subject, buildRef) {
  if (subject?.lens?.status !== 'GENERATED') return null;
  return subject.lens.builds.find((build) => build.buildRef === buildRef) ?? null;
}

export function sameCommit(subject) {
  const [stable, main] = [buildFor(subject, 'stable'), buildFor(subject, 'main')];
  return Boolean(stable && main && stable.commit === main.commit);
}

// What a lens.html URL asks for. Unknown or invalid input falls back to the default subject's
// Stable build and says why, so a mistyped link still opens something true.
export function resolveLensRequest(catalog, params) {
  const get = (key) => (typeof params?.get === 'function' ? params.get(key) : params?.[key]) ?? null;
  const legacy = get('lens');
  if (legacy) return { mode: 'LEGACY', lensPath: legacy, subject: null, build: null, commitRef: null, notice: null };
  let notice = null;
  let subject = subjectFor(catalog, get('subject'));
  if (get('subject') && !subject) notice = `No project named "${get('subject')}". Showing ${subjectFor(catalog, catalog.defaultSubjectRef).label}.`;
  subject ??= subjectFor(catalog, catalog.defaultSubjectRef);
  if (subject.lens.status !== 'GENERATED') return { mode: 'NO_LENS', subject, build: null, commitRef: null, lensPath: null, notice };
  const commit = get('commit');
  if (commit) {
    if (!subject.lens.anyCommit) notice = `${subject.label} cannot be projected at an arbitrary commit yet. Showing Stable.`;
    else {
      try {
        return { mode: 'COMMIT', subject, build: null, commitRef: sourceRefFromInput(commit, subject.repository.url), lensPath: null, notice };
      } catch (error) {
        notice = `${error.message.replace(/^lens catalog: /, '')}. Showing Stable.`;
      }
    }
  }
  const requested = get('build');
  let build = buildFor(subject, requested ?? 'stable');
  if (!build) {
    notice ??= `No build named "${requested}". Showing Stable.`;
    build = buildFor(subject, 'stable');
  }
  return { mode: 'BUILD', subject, build, commitRef: null, lensPath: build.lens, notice };
}

// lens.html?subject=…&build=… or &commit=…, plus the screen / element / faces to open at.
export function lensHref(subject, { build = null, commit = null, screen = null, element = null, left = null, right = null, base = './lens.html' } = {}) {
  const query = new URLSearchParams();
  query.set('subject', subject.slug);
  if (commit) query.set('commit', commit);
  else if (build && build !== 'stable') query.set('build', build);
  if (screen) query.set('screen', screen);
  if (element) query.set('element', element);
  if (left) query.set('left', left);
  if (right) query.set('right', right);
  return `${base}?${query}`;
}

export function boardHref(boardRef, base = './') {
  return `${base}?board=${encodeURIComponent(boardRef)}`;
}

function plainCopy(catalog) {
  return JSON.parse(JSON.stringify(catalog));
}

// Move one build pointer to a new commit. Main reuses Stable's lens file when both point at the same
// commit, so two identical builds never become two files.
export function advanceBuild(catalogInput, subjectKey, buildRef, { commit, observedAt = null, separateLens }) {
  const catalog = normalizeLensCatalog(catalogInput);
  const subject = subjectFor(catalog, subjectKey);
  if (!subject || subject.lens.status !== 'GENERATED') fail(`${subjectKey} has no generated lens`);
  if (buildRef === 'stable') fail('Stable moves only through promoteBuild');
  if (!SHA.test(String(commit))) fail('advanceBuild needs a full commit SHA');
  const next = plainCopy(catalogInput);
  const target = next.subjects.find((entry) => entry.subjectRef === subject.subjectRef);
  const stable = target.lens.builds.find((build) => build.buildRef === 'stable');
  const build = target.lens.builds.find((entry) => entry.buildRef === buildRef);
  if (!build) fail(`${subject.label} has no ${buildRef} build`);
  const previousLens = build.lens;
  build.commit = commit;
  if (observedAt) build.observedAt = observedAt;
  else delete build.observedAt;
  build.lens = commit === stable.commit ? stable.lens : relativeJson(separateLens, 'separateLens');
  normalizeLensCatalog(next);
  const stillUsed = next.subjects.some((entry) => entry.lens.builds?.some((candidate) => candidate.lens === previousLens));
  return { catalog: next, lens: build.lens, write: build.lens !== stable.lens, retire: stillUsed ? null : previousLens };
}

// Promote Main to Stable: Stable takes Main's commit, and Main then shares Stable's lens file.
export function promoteBuild(catalogInput, subjectKey, { on, evidence = [] }) {
  const catalog = normalizeLensCatalog(catalogInput);
  const subject = subjectFor(catalog, subjectKey);
  if (!subject || subject.lens.status !== 'GENERATED') fail(`${subjectKey} has no generated lens`);
  if (!DATE.test(String(on))) fail('promoteBuild needs a YYYY-MM-DD date');
  const main = buildFor(subject, 'main');
  const stable = buildFor(subject, 'stable');
  const changed = main.commit !== stable.commit;
  if (!changed) return { catalog: plainCopy(catalogInput), changed: false, copy: null, retire: null };
  const promotionEvidence = list(evidence, 'promotion evidence').map((entry, index) => text(entry, `promotion evidence[${index}]`));
  if (!promotionEvidence.length) fail('promoteBuild needs acceptance evidence when Stable moves');
  const next = plainCopy(catalogInput);
  const target = next.subjects.find((entry) => entry.subjectRef === subject.subjectRef);
  const nextStable = target.lens.builds.find((build) => build.buildRef === 'stable');
  const nextMain = target.lens.builds.find((build) => build.buildRef === 'main');
  nextStable.commit = main.commit;
  nextStable.since = on;
  nextStable.evidence = promotionEvidence;
  if (main.observedAt) nextStable.observedAt = main.observedAt;
  else delete nextStable.observedAt;
  nextMain.lens = stable.lens;
  normalizeLensCatalog(next);
  return {
    catalog: next,
    changed,
    copy: main.lens !== stable.lens ? { from: main.lens, to: stable.lens } : null,
    retire: main.lens !== stable.lens ? main.lens : null,
  };
}

// [VXG RealForever][VEXWORK][VEXBOARD][LENS-CATALOG]
