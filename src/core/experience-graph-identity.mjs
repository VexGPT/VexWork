// Experience Relationship Graph — string identity outside its owner.
//
// VexArchitecture binds by relationship: a Family owns its State / Control refs, a presentation
// carries the typed element ref, and wire strings stay at the serialization boundary. This module
// finds the places where an identity is a copied string instead:
//
//   LITERAL_SHADOWS_CONSTANT   a literal compare duplicates a value a source owner already names
//   FAMILY_READS_WIRE_STRING   Family law itself branches on a wire string
//   TYPED_REF_BYPASSED         runtime binds an element by DOM id although it carries data-vex-ref
//   UNTYPED_INTERACTIVE        an interactive element the runtime binds has only a DOM id
//   REFLECTION_IDENTITY        a reflected class name used as identity (not as evidence text)
//
// Pure: callers pass file text.

export const IDENTITY_READER_SCHEMA = 'vexwork.experience-graph.string-identity/v1';

export const IDENTITY_KINDS = Object.freeze(['LITERAL_SHADOWS_CONSTANT', 'FAMILY_READS_WIRE_STRING', 'TYPED_REF_BYPASSED', 'UNTYPED_INTERACTIVE', 'REFLECTION_IDENTITY']);

const compare = (left, right) => (left < right ? -1 : left > right ? 1 : 0);
const lineAt = (text, index) => text.slice(0, index).split('\n').length;
const WIRE = '[A-Z][A-Z0-9]*_[A-Z0-9_]+|[A-Z]{3,}';

// Owners of string constants: `const val Name = "VALUE"` (or `val Name = "VALUE"`) inside the
// nearest enclosing object / class.
export function indexStringConstants(files) {
  const byValue = new Map();
  for (const file of files) {
    const stack = [];
    let depth = 0;
    let pending = null;
    const lines = file.text.split('\n');
    lines.forEach((line, index) => {
      const declared = /^\s*(?:(?:private|internal|public|data|sealed|abstract|open|enum|companion)\s+)*(?:object|class|interface)\s+(\w+)/.exec(line);
      if (declared) pending = declared[1];
      if (pending && line.includes('{')) {
        stack.push({ name: pending, depth: depth + 1 });
        pending = null;
      }
      const constant = new RegExp(`^\\s*(?:(?:private|internal|public)\\s+)?(?:const\\s+)?val\\s+(\\w+)\\s*(?::\\s*String\\s*)?=\\s*"(${WIRE})"\\s*$`).exec(line);
      if (constant && stack.length) {
        const owner = stack.map((frame) => frame.name).join('.');
        const row = { value: constant[2], owner, name: constant[1], symbol: `${owner}.${constant[1]}`, sourcePath: file.path, line: index + 1, private: /\bprivate\b/.test(line) };
        (byValue.get(row.value) ?? byValue.set(row.value, []).get(row.value)).push(row);
      }
      for (const ch of line) {
        if (ch === '{') depth += 1;
        else if (ch === '}') {
          depth -= 1;
          while (stack.length && stack.at(-1).depth > depth) stack.pop();
        }
      }
    });
  }
  return byValue;
}

// Enum entries are owned refs too (`enum class Standing { Unread, Viewed }` is not a wire string,
// but `CARRIED` in `enum class X { CARRIED, ... }` is the wire form of a typed value).
export function indexEnumEntries(files) {
  const byValue = new Map();
  for (const file of files) {
    for (const match of file.text.matchAll(/enum class (\w+)[^{]*\{([^}]*)\}/g)) {
      const body = match[2].split(';')[0];
      for (const entry of body.matchAll(new RegExp(`(?:^|[,\\s])(${WIRE})\\b(?=\\s*(?:\\(|,|$))`, 'gm'))) {
        const row = { value: entry[1], owner: match[1], name: entry[1], symbol: `${match[1]}.${entry[1]}`, sourcePath: file.path, line: lineAt(file.text, match.index), enumEntry: true };
        (byValue.get(row.value) ?? byValue.set(row.value, []).get(row.value)).push(row);
      }
    }
  }
  return byValue;
}

// Owners whose top-level declaration the literal's own file already references: a value equal to
// some unrelated constant elsewhere is a coincidence, not a shadow.
// Generated browser runtime consumes projections of every owner, so every equal-valued owner is a
// candidate there (more than one candidate is itself the symptom of untyped vocabulary).
function ownersFor(value, constants, enums, file, { near = true } = {}) {
  return [...(constants.get(value) ?? []), ...(enums.get(value) ?? [])]
    .filter((row) => (row.sourcePath !== file.path || row.enumEntry) && (!near || row.sourcePath === file.path || new RegExp(`\\b${row.owner.split('.')[0]}\\b`).test(file.text)))
    .sort((a, b) => compare(a.symbol, b.symbol));
}

// Family law vocabulary is an owner even when its refs are not `const val` lines.
export function indexFamilyVocabulary(laws) {
  const byValue = new Map();
  for (const law of laws) {
    for (const [kind, rows] of [['control', law.controls], ['state', law.states]]) {
      for (const row of rows) {
        if (!row.ref || !new RegExp(`^(?:${WIRE})$`).test(row.ref)) continue;
        const owner = { value: row.ref, owner: law.family, name: `${kind}:${row.ref}`, symbol: `${law.family}.${row.symbol}`, sourcePath: law.sourcePath, line: row.line, enumEntry: true };
        (byValue.get(row.ref) ?? byValue.set(row.ref, []).get(row.ref)).push(owner);
      }
    }
  }
  return byValue;
}

function merge(...maps) {
  const out = new Map();
  for (const map of maps) for (const [value, rows] of map) out.set(value, [...(out.get(value) ?? []), ...rows]);
  for (const [value, rows] of out) out.set(value, [...new Map(rows.map((row) => [row.symbol, row])).values()]);
  return out;
}

// Literal compares in generated browser runtime source (JS inside Kotlin raw strings).
export function readRuntimeLiterals({ files, constants, enums }) {
  const rows = [];
  for (const file of files) {
    const pattern = new RegExp(`([\\w.$\\]\\)]+)\\s*(===|!==)\\s*'(${WIRE})'|case\\s+'(${WIRE})'\\s*:`, 'g');
    for (const match of file.text.matchAll(pattern)) {
      const literal = match[3] ?? match[4];
      const owners = ownersFor(literal, constants, enums, file, { near: false });
      rows.push({ literal, subject: match[1] ?? 'switch', sourcePath: file.path, line: lineAt(file.text, match.index), owners: owners.map((row) => row.symbol), layer: 'BROWSER_RUNTIME' });
    }
  }
  return rows.sort((a, b) => compare(`${a.sourcePath}|${String(a.line).padStart(6, '0')}|${a.literal}`, `${b.sourcePath}|${String(b.line).padStart(6, '0')}|${b.literal}`));
}

// Literal compares and when-branches in Kotlin main source.
export function readKotlinLiterals({ files, constants, enums, familyPaths }) {
  const rows = [];
  for (const file of files) {
    const lines = file.text.split('\n');
    lines.forEach((line, index) => {
      if (/^\s*(?:\/\/|\*|\/\*)/.test(line) || /^\s*(?:(?:private|internal|public)\s+)?(?:const\s+)?val\s+\w+\s*(?::\s*String\s*)?=\s*"/.test(line)) return;
      const found = [];
      for (const match of line.matchAll(new RegExp(`(?:==|!=)\\s*"(${WIRE})"|"(${WIRE})"\\s*(?:==|!=)`, 'g'))) found.push(match[1] ?? match[2]);
      const branch = new RegExp(`^\\s*"(${WIRE})"((?:\\s*,\\s*"(?:${WIRE})")*)\\s*->`).exec(line);
      if (branch) {
        found.push(branch[1]);
        for (const more of branch[2].matchAll(/"([A-Z0-9_]+)"/g)) found.push(more[1]);
      }
      for (const literal of found) {
        const owners = ownersFor(literal, constants, enums, file);
        rows.push({ literal, sourcePath: file.path, line: index + 1, owners: owners.map((row) => row.symbol), layer: familyPaths.has(file.path) ? 'FAMILY_LAW' : 'KOTLIN' });
      }
    });
  }
  return rows.sort((a, b) => compare(`${a.sourcePath}|${String(a.line).padStart(6, '0')}|${a.literal}`, `${b.sourcePath}|${String(b.line).padStart(6, '0')}|${b.literal}`));
}

const INTERACTIVE = new Set(['button', 'input', 'select', 'textarea', 'form', 'a', 'details', 'summary']);

// DOM-id bindings: runtime `byId('x')` / getElementById('x') against the markup's elements.
export function readDomIdBindings({ markup, runtime }) {
  const elements = new Map();
  for (const match of markup.text.matchAll(/<([a-z]+)\b([^<>]*)>/g)) {
    const id = /\bid="([a-z][a-z0-9-]*)"/.exec(match[2]);
    if (!id) continue;
    const vexRef = /data-vex-ref="\$\{(\w+)\.(\w+)\.identity\.ref\}"/.exec(match[2]);
    elements.set(id[1], { elementId: id[1], tag: match[1], elementSymbol: vexRef ? vexRef[2] : null, line: lineAt(markup.text, match.index) });
  }
  const lookups = new Map();
  for (const match of runtime.text.matchAll(/\b(?:byId|document\.getElementById)\('([a-z][a-z0-9-]*)'\)/g)) {
    (lookups.get(match[1]) ?? lookups.set(match[1], []).get(match[1])).push(lineAt(runtime.text, match.index));
  }
  const rows = [];
  for (const [elementId, lines] of [...lookups.entries()].sort(([a], [b]) => compare(a, b))) {
    const element = elements.get(elementId) ?? null;
    const kind = element?.elementSymbol ? 'TYPED_REF_BYPASSED' : element && INTERACTIVE.has(element.tag) ? 'UNTYPED_INTERACTIVE' : 'PRESENTATION_SLOT';
    rows.push({ elementId, tag: element?.tag ?? null, elementSymbol: element?.elementSymbol ?? null, kind, markupLine: element?.line ?? null, runtimeLines: lines });
  }
  return {
    markupPath: markup.path,
    runtimePath: runtime.path,
    typedElements: [...elements.values()].filter((row) => row.elementSymbol).length,
    domIdElements: elements.size,
    typedSelectors: (runtime.text.match(/data-vex-ref=/g) ?? []).length,
    rows,
  };
}

export function readReflection({ files }) {
  const rows = [];
  for (const file of files) {
    const lines = file.text.split('\n');
    lines.forEach((line, index) => {
      if (!/::class\.(?:simpleName|qualifiedName)|javaClass\.(?:simpleName|name)\b|Class\.forName\(/.test(line)) return;
      // A reflected name that only becomes evidence/diagnostic text is not identity.
      const statement = [line];
      for (let back = index - 1; back >= 0 && back >= index - 4 && lines[back].trim(); back -= 1) statement.unshift(lines[back]);
      const window = statement.join('\n');
      const evidence = /"(?:reason|failureType|detail|error|message)"|message\s*\?:|\?:\s*\w*\s*error|detail\s*=|error\.|\berror\(|throw\b|exception|throwable|"\s*\+\s*$|^\s*\+?\s*"/im.test(window);
      rows.push({ sourcePath: file.path, line: index + 1, use: evidence ? 'EVIDENCE_TEXT' : 'REFLECTION_IDENTITY', text: line.trim().slice(0, 140) });
    });
  }
  return rows.sort((a, b) => compare(`${a.sourcePath}|${String(a.line).padStart(6, '0')}`, `${b.sourcePath}|${String(b.line).padStart(6, '0')}`));
}

export function readStringIdentity({ mainFiles, familyPaths, markup, runtime, laws = [] }) {
  const constants = indexStringConstants(mainFiles);
  const enums = merge(indexEnumEntries(mainFiles), indexFamilyVocabulary(laws));
  const runtimeLiterals = runtime ? readRuntimeLiterals({ files: [runtime], constants, enums }) : [];
  const kotlinLiterals = readKotlinLiterals({ files: mainFiles.filter((file) => !runtime || file.path !== runtime.path), constants, enums, familyPaths });
  return {
    schemaVersion: IDENTITY_READER_SCHEMA,
    runtimeLiterals,
    kotlinLiterals,
    domIds: markup && runtime ? readDomIdBindings({ markup, runtime }) : null,
    reflection: readReflection({ files: mainFiles }),
  };
}

// [VXG RealForever][VEXWORK][VEXLIFE-PROD][E2E][EXPERIENCE-GRAPH][STRING-IDENTITY]
