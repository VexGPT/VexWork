// Experience Relationship Graph — the Product's keyed-text layer read as element identity.
//
// VexLife-Prod law (docs/CULTURE.md "Words are keyed; the key is the element"): a Family's
// DisplayState names text by key, the key is the element's identity at every layer, and its
// `dataKey` (`owner:kind:REF`) maps it to the semantic ref it presents. The Screen Lens is a second
// element-identity system; this module reads the first one so the graph stops reporting keyed
// manifestations as missing, and so localization gaps become derived frontier rather than notes.
//
// catalog source (localization/strings/source/*.json)
// + dataKey prefix anchors (main source, test source, or the catalog's own prose declaration)
// + language selection / script mapping / DisplayState text typing read from Kotlin
// -> resolved keys, language completeness, and localization frontier inputs
//
// Pure: callers pass file text; no file system, network or clock.

export const LOCALIZATION_READER_SCHEMA = 'vexwork.experience-graph.localization/v1';

export const ANCHOR_STRENGTH = Object.freeze(['MAIN_SOURCE', 'TEST_SOURCE', 'CATALOG_DECLARED']);

export const KEY_RESOLUTIONS = Object.freeze(['FAMILY_CONTROL', 'FAMILY_STATE', 'FAMILY_DETAIL', 'OWNER_DETAIL', 'UNRESOLVED_REF', 'UNANCHORED']);

const compare = (left, right) => (left < right ? -1 : left > right ? 1 : 0);
const lineAt = (text, index) => text.slice(0, index).split('\n').length;
const OWNER_SYMBOL = /\b((?:VexLife|Heretic)[A-Z]\w*)\b/g;
const TEST_PATH = /\/(?:jvmTest|commonTest|test)\//;

function ownerSymbols(text) {
  return [...new Set([...text.matchAll(OWNER_SYMBOL)].map((match) => match[1]))];
}

// ---- catalog --------------------------------------------------------------------------------

export function readLocalizationCatalog({ scopes }) {
  const keys = [];
  const scopeRows = [];
  for (const { scope, path, text } of [...scopes].sort((a, b) => compare(a.scope, b.scope))) {
    const source = JSON.parse(text);
    const meta = source._meta ?? {};
    const entries = Object.entries(source).filter(([key]) => !key.startsWith('_')).sort(([a], [b]) => compare(a, b));
    const languages = new Set();
    for (const [key, entry] of entries) {
      const strings = entry.strings ?? {};
      const current = Object.entries(strings).filter(([, value]) => value && typeof value.text === 'string' && !value._stale).map(([language]) => language).sort(compare);
      for (const language of Object.keys(strings)) languages.add(language);
      const at = text.indexOf(`"${key}"`);
      keys.push({
        key,
        scope,
        sourcePath: path,
        line: at >= 0 ? lineAt(text, at) : null,
        surfaces: [...(entry.surfaces ?? [])],
        dataKey: entry.dataKey ?? null,
        lens: entry.lens ?? null,
        languages: current,
        en: strings.en?.text ?? null,
      });
    }
    const scoped = keys.filter((row) => row.scope === scope);
    const all = [...languages].sort(compare);
    const missingByLanguage = Object.fromEntries(all.map((language) => [language, scoped.filter((row) => !row.languages.includes(language)).length]));
    scopeRows.push({
      scope,
      sourcePath: path,
      keyCount: scoped.length,
      dataKeyCount: scoped.filter((row) => row.dataKey).length,
      lensKeyCount: scoped.filter((row) => row.lens).length,
      languages: all,
      completeLanguages: all.filter((language) => missingByLanguage[language] === 0),
      missingByLanguage,
      dataKeyOwners: Object.fromEntries(Object.entries(meta.dataKeyOwners ?? {}).sort(([a], [b]) => compare(a, b)).map(([prefix, prose]) => [prefix, ownerSymbols(String(prose))])),
    });
  }
  return { scopes: scopeRows, keys };
}

// ---- dataKey anchors ------------------------------------------------------------------------

// A literal `"owner:kind:` that is completed by `$it`, `${...}` or `" + expr` names a dataKey
// prefix; the owner symbols referenced by the same statement (or by the local collection it
// iterates) anchor that prefix to its semantic owner.
const ANCHOR_LITERAL = /"([a-z][a-z-]*):([a-z][a-z-]*):(?:\$|"\s*\+)/g;
const STATEMENT_START = /^\s*(?:(?:private|internal|public|override|const)\s+)*(?:val|var|fun)\b|^\s*$/;

function collectionBody(lines, name) {
  const start = lines.findIndex((line) => new RegExp(`\\b(?:val|var)\\s+${name}\\b`).test(line));
  if (start < 0) return '';
  const body = [lines[start]];
  for (let i = start + 1; i < lines.length && i < start + 30; i += 1) {
    if (STATEMENT_START.test(lines[i])) break;
    body.push(lines[i]);
  }
  return body.join('\n');
}

export function readDataKeyAnchors({ files }) {
  const rows = [];
  for (const file of files) {
    if (!file.text.includes(':')) continue;
    const lines = file.text.split('\n');
    for (const match of file.text.matchAll(ANCHOR_LITERAL)) {
      const prefix = `${match[1]}:${match[2]}`;
      const lineIndex = lineAt(file.text, match.index) - 1;
      const line = lines[lineIndex];
      // The statement is the literal's own line plus the lines it continues (a line above that
      // ends in `+ ( , = -> {`, or this line opening with `+ . )`); a sibling `add(...)` in the same
      // builder is a different statement and lends no owner.
      const window = [line];
      for (let i = lineIndex - 1; i >= 0 && i >= lineIndex - 15; i -= 1) {
        const continues = /(?:\+|\(|,|=|->|\{)\s*$/.test(lines[i]) || /^\s*(?:\+|\.|\))/.test(lines[i + 1]);
        if (!continues || /^\s*$/.test(lines[i])) break;
        window.unshift(lines[i]);
      }
      let text = window.join('\n');
      // A line that iterates a local collection takes its owners from that collection alone.
      const local = /(?<![.\w])([A-Z]\w*)\s*\.\s*(?:forEach|map)\s*\{/.exec(line);
      if (local && !/^(?:VexLife|Heretic)/.test(local[1])) text = `${line}\n${collectionBody(lines, local[1])}`;
      const owners = ownerSymbols(text).filter((symbol) => !/Test$/.test(symbol));
      rows.push({
        prefix,
        owners,
        sourcePath: file.path,
        line: lineIndex + 1,
        anchor: TEST_PATH.test(file.path) ? 'TEST_SOURCE' : 'MAIN_SOURCE',
      });
    }
  }
  return rows.sort((a, b) => compare(`${a.prefix}|${a.sourcePath}|${a.line}`, `${b.prefix}|${b.sourcePath}|${b.line}`));
}

function prefixAnchors(anchors, catalog) {
  const byPrefix = new Map();
  const add = (prefix, row) => (byPrefix.get(prefix) ?? byPrefix.set(prefix, []).get(prefix)).push(row);
  for (const row of anchors) add(row.prefix, row);
  for (const scope of catalog.scopes) {
    for (const [owner, symbols] of Object.entries(scope.dataKeyOwners)) {
      add(`${owner}:*`, { prefix: `${owner}:*`, owners: symbols, sourcePath: scope.sourcePath, line: null, anchor: 'CATALOG_DECLARED' });
    }
  }
  return byPrefix;
}

// Each dataKey resolves through its strongest anchor to a Family coordinate when it can.
// A Family may own display refs that are not States or Controls (a release item's UNREAD status);
// a dataKey naming one of the Family's own string constants is owned, not unresolved.
export function familyOwnedValues({ laws, files }) {
  const textByPath = new Map(files.map((file) => [file.path, file.text]));
  return new Map(laws.map((law) => [law.family, new Set([...(textByPath.get(law.sourcePath) ?? '').matchAll(/const val \w+\s*=\s*"([A-Z][A-Z0-9_]*)"/g)].map((match) => match[1]))]));
}

export function resolveDataKeys({ catalog, anchors, laws, ownedValues = new Map() }) {
  const lawBySymbol = new Map(laws.map((law) => [law.family, law]));
  const byPrefix = prefixAnchors(anchors, catalog);
  const prefixes = new Map();
  const rows = [];
  for (const key of catalog.keys) {
    if (!key.dataKey) continue;
    const [owner, kind, ...rest] = key.dataKey.split(':');
    const ref = rest.join(':');
    const prefix = `${owner}:${kind}`;
    const candidates = [...(byPrefix.get(prefix) ?? []), ...(byPrefix.get(`${owner}:*`) ?? [])]
      .sort((a, b) => ANCHOR_STRENGTH.indexOf(a.anchor) - ANCHOR_STRENGTH.indexOf(b.anchor));
    const strongest = candidates[0] ?? null;
    const familySymbol = candidates.flatMap((row) => row.owners).find((symbol) => lawBySymbol.has(symbol)) ?? null;
    const anchorRow = familySymbol ? candidates.find((row) => row.owners.includes(familySymbol)) : strongest;
    const law = familySymbol ? lawBySymbol.get(familySymbol) : null;
    let resolution = 'UNANCHORED';
    let target = null;
    if (law) {
      const owned = ownedValues.get(law.family)?.has(ref) ? 'FAMILY_DETAIL' : 'UNRESOLVED_REF';
      if (kind === 'control') {
        const control = law.controls.find((row) => row.ref === ref);
        resolution = control ? 'FAMILY_CONTROL' : owned;
        target = control ? `${law.family}.${control.symbol}` : null;
      } else if (kind === 'state') {
        const state = law.states.find((row) => row.ref === ref);
        resolution = state ? 'FAMILY_STATE' : owned;
        target = state ? `${law.family}.${state.symbol}` : null;
      } else {
        resolution = 'FAMILY_DETAIL';
      }
    } else if (anchorRow) {
      resolution = 'OWNER_DETAIL';
    }
    const anchor = anchorRow?.anchor ?? 'UNANCHORED';
    rows.push({ key: key.key, scope: key.scope, dataKey: key.dataKey, prefix, ref, family: law?.family ?? null, owner: familySymbol ?? anchorRow?.owners?.[0] ?? null, anchor, anchorSourcePath: anchorRow?.sourcePath ?? null, anchorLine: anchorRow?.line ?? null, resolution, target });
    const seen = prefixes.get(prefix) ?? { prefix, family: law?.family ?? null, owner: familySymbol ?? anchorRow?.owners?.[0] ?? null, anchors: [...new Set(candidates.map((row) => row.anchor))].sort((a, b) => ANCHOR_STRENGTH.indexOf(a) - ANCHOR_STRENGTH.indexOf(b)), keys: 0 };
    seen.keys += 1;
    prefixes.set(prefix, seen);
  }
  return { keys: rows, prefixes: [...prefixes.values()].sort((a, b) => compare(a.prefix, b.prefix)) };
}

// ---- keyed markup ---------------------------------------------------------------------------

// A tag that carries both a typed element identity (data-vex-ref) and a catalog key names the
// same element in both identity systems.
export function readKeyedMarkup({ path, text, keys }) {
  const known = new Set(keys.map((row) => row.key));
  const rows = [];
  for (const match of text.matchAll(/<([a-z]+)\b([^<>]*data-vex-ref="\$\{(\w+)\.(\w+)\.identity\.ref\}"[^<>]*)>/g)) {
    const attrs = match[2];
    const linked = [...attrs.matchAll(/"((?:[a-z-]+)\.[a-z]+\.[a-z0-9-]+)"/g)].map((row) => row[1]).filter((key) => known.has(key));
    if (!linked.length) continue;
    rows.push({ elementSymbol: match[4], tag: match[1], keys: [...new Set(linked)].sort(compare), sourcePath: path, line: lineAt(text, match.index) });
  }
  return rows.sort((a, b) => compare(a.elementSymbol, b.elementSymbol));
}

// ---- language selection, script mapping ------------------------------------------------------

function functionBodies(text) {
  const out = [];
  for (const match of text.matchAll(/\bfun\s+(\w+)\s*\(/g)) {
    const open = text.indexOf('{', match.index);
    const eq = text.indexOf('=', match.index);
    if (open < 0) continue;
    if (eq >= 0 && eq < open && !/\)\s*(?::\s*[\w<>?, .]+)?\s*=/.test(text.slice(match.index, open))) continue;
    let depth = 0;
    let end = open;
    for (; end < text.length; end += 1) {
      if (text[end] === '{') depth += 1;
      else if (text[end] === '}' && (depth -= 1) === 0) break;
    }
    out.push({ name: match[1], body: text.slice(match.index, end + 1), line: lineAt(text, match.index) });
  }
  return out;
}

// Functions that derive a language themselves and resolve keyed text with it. A function that
// never consults completeness serves partial translation key by key (English where missing).
export function readLanguageSelection({ files }) {
  const rows = [];
  for (const file of files) {
    if (!/localizationLanguageForReply|normalizedLanguage|selectLanguage/.test(file.text)) continue;
    for (const fn of functionBodies(file.text)) {
      const derives = /localizationLanguageForReply\s*\(|\.replyLanguage\b|normalizedLanguage\s*\(/.test(fn.body);
      const resolves = /\b(?:catalog|VexLifeStrings)\.(?:text|resolve)\s*\(/.test(fn.body);
      if (!derives || !resolves) continue;
      const complete = /selectLanguage\s*\(|completeLanguages\s*\(/.test(fn.body);
      const scoped = /scope/.test(fn.body);
      rows.push({ function: fn.name, sourcePath: file.path, line: fn.line, rule: complete ? 'COMPLETE_LANGUAGE_ONLY' : 'PER_KEY_ENGLISH_FALLBACK', scoped });
    }
  }
  return rows.sort((a, b) => compare(`${a.sourcePath}|${a.function}`, `${b.sourcePath}|${b.function}`));
}

// A small, high-frequency discriminating set: each pair is one character written differently in
// Simplified and Traditional Chinese. Enough to say which script a catalog language holds.
const HANS = '这设运时门语们为发开关说话数据线页简览启动续让请现应还选连删错误';
const HANT = '這設運時門語們為發開關說話數據線頁簡覽啟動續讓請現應還選連刪錯誤';

export function chineseScript(texts) {
  let hans = 0;
  let hant = 0;
  for (const text of texts) {
    for (const ch of text) {
      if (HANS.includes(ch) && !HANT.includes(ch)) hans += 1;
      else if (HANT.includes(ch) && !HANS.includes(ch)) hant += 1;
    }
  }
  return { script: hans > hant * 4 ? 'Hans' : hant > hans * 4 ? 'Hant' : hans + hant ? 'MIXED' : 'UNKNOWN', hans, hant };
}

// Reply languages that carry a script subtag but resolve to one localization language.
export function readScriptMapping({ settings, strings, catalogScopes }) {
  const constants = Object.fromEntries([...settings.text.matchAll(/const val (\w+)\s*=\s*"([a-z]{2,3}(?:-[A-Z][a-z]{3})?)"/g)].map((match) => [match[1], match[2]]));
  const fn = functionBodies(settings.text).find((row) => row.name === 'localizationLanguageForReply');
  const mapping = [];
  if (fn) {
    for (const branch of fn.body.matchAll(/((?:\s*\w+\s*,)+)\s*->\s*"([a-z]{2,3})"/g)) {
      for (const symbol of branch[1].split(',').map((part) => part.trim()).filter(Boolean)) {
        if (constants[symbol]) mapping.push({ replyLanguage: constants[symbol], localizationLanguage: branch[2] });
      }
    }
  }
  const legacy = /fun canonicalReplyLanguage[\s\S]*?if \(code == (\w+)\) (\w+)/.exec(settings.text);
  const legacyRow = legacy && constants[legacy[1]] && constants[legacy[2]] ? { legacyCode: constants[legacy[1]], canonical: constants[legacy[2]] } : null;
  const normalized = strings ? /fun normalizedLanguage[^\n]*split\([^)]*\)\.first\(\)/.test(strings.text) : false;
  const collapses = [];
  const byTarget = new Map();
  for (const row of mapping) (byTarget.get(row.localizationLanguage) ?? byTarget.set(row.localizationLanguage, []).get(row.localizationLanguage)).push(row.replyLanguage);
  for (const [language, replies] of [...byTarget.entries()].sort(([a], [b]) => compare(a, b))) {
    if (replies.length < 2) continue;
    const texts = catalogScopes.flatMap((scope) => scope.texts?.[language] ?? []);
    const held = chineseScript(texts);
    const misserved = replies.filter((reply) => !reply.endsWith(`-${held.script}`)).sort(compare);
    collapses.push({ localizationLanguage: language, replyLanguages: [...replies].sort(compare), catalogScript: held, misserved, legacy: legacyRow && misserved.includes(legacyRow.canonical) ? legacyRow : null });
  }
  return {
    sourcePath: settings.path,
    line: fn?.line ?? null,
    mapping: mapping.sort((a, b) => compare(a.replyLanguage, b.replyLanguage)),
    systemLanguageDropsScript: normalized ? { sourcePath: strings.path, function: 'normalizedLanguage' } : null,
    collapses,
  };
}

// ---- DisplayState text typing -----------------------------------------------------------------

const HUMAN_TEXT_FIELD = /(?:label|title|heading|message|summary|description|text|status|hint|caption|prompt|explanation|detail|notice|empty)$/i;
const MACHINE_FIELD = /(?:Ref|Refs|Id|Ids|Code|Key|Url|Path|Hash|Handle|Digest)$/;

export function readDisplayStateText({ laws, files }) {
  const textByPath = new Map(files.map((file) => [file.path, file.text]));
  const rows = [];
  for (const law of laws) {
    const text = textByPath.get(law.sourcePath);
    if (!text) continue;
    const header = /data class (DisplayState|\w+DisplayState)\s*\(/.exec(text);
    if (!header) continue;
    let depth = 0;
    let end = header.index + header[0].length - 1;
    for (; end < text.length; end += 1) {
      if (text[end] === '(') depth += 1;
      else if (text[end] === ')' && (depth -= 1) === 0) break;
    }
    const params = text.slice(header.index + header[0].length, end);
    const fields = [...params.matchAll(/val\s+(\w+)\s*:\s*([\w.<>?, ]+?)\s*(?:,|$|=)/gm)].map((match) => ({ name: match[1], type: match[2].trim() }));
    const keyed = fields.filter((field) => /\bVexLifeText\b/.test(field.type)).map((field) => field.name);
    const hardcoded = fields.filter((field) => /^String\??$/.test(field.type) && HUMAN_TEXT_FIELD.test(field.name) && !MACHINE_FIELD.test(field.name)).map((field) => field.name);
    rows.push({ family: law.family, displayType: header[1], sourcePath: law.sourcePath, line: lineAt(text, header.index), keyedFields: keyed, hardcodedFields: hardcoded, form: hardcoded.length ? (keyed.length ? 'PARTIALLY_KEYED' : 'HARDCODED') : keyed.length ? 'KEYED' : 'NO_HUMAN_TEXT' });
  }
  return rows.sort((a, b) => compare(a.family, b.family));
}

// ---- one read -------------------------------------------------------------------------------

export function readLocalization({ catalogFiles, anchorFiles, settings, strings, selectionFiles, markup, laws, familyFiles }) {
  const catalog = readLocalizationCatalog({ scopes: catalogFiles });
  const anchors = readDataKeyAnchors({ files: anchorFiles });
  const resolved = resolveDataKeys({ catalog, anchors, laws, ownedValues: familyOwnedValues({ laws, files: familyFiles }) });
  const catalogTexts = catalogFiles.map((file) => {
    const source = JSON.parse(file.text);
    const texts = {};
    for (const [key, entry] of Object.entries(source)) {
      if (key.startsWith('_')) continue;
      for (const [language, value] of Object.entries(entry.strings ?? {})) (texts[language] ??= []).push(value.text ?? '');
    }
    return { scope: file.scope, texts };
  });
  return {
    schemaVersion: LOCALIZATION_READER_SCHEMA,
    scopes: catalog.scopes,
    keys: catalog.keys,
    dataKeys: resolved.keys,
    prefixes: resolved.prefixes,
    keyedMarkup: markup ? readKeyedMarkup({ path: markup.path, text: markup.text, keys: catalog.keys }) : [],
    selection: readLanguageSelection({ files: selectionFiles }),
    scripts: settings ? readScriptMapping({ settings, strings, catalogScopes: catalogTexts }) : null,
    displayText: readDisplayStateText({ laws, files: familyFiles }),
  };
}

// [VXG RealForever][VEXWORK][VEXLIFE-PROD][E2E][EXPERIENCE-GRAPH][LOCALIZATION]
