// VexLife-Android -> Screen Lens adapter.
//
// Reads the parts of VexLife-Android source that VexArchitecture keeps regular
// and projects them into `vexboard.screen-lens/v1`:
//
//   AppScreens.primary / shared          -> screens + placement
//   *Screen.kt  xRef(...) + layout { }   -> element trees, ids, intents
//   AppShell Elements + blueprint        -> one chrome owner
//   AppActions ActionKey("...")          -> action keys
//   appAction(action = ...) { ... }      -> registration bodies
//   ScreenActionContext closure          -> Family bond (follows the captured hop)
//   <X>Family sealed vocabulary          -> one SCAE + Depth template for every Family
//
// Every Family is projected through the same VexArchitecture path, which is why
// one template covers them: Control -> act() -> admitted State + Begin(Effect,
// Approach) -> Act.Method -> launchWith -> VexExecution -> Store -> observation.
//
// Human knowledge that code cannot say (notes, sharper summaries, ThemeMode's
// === fence) lives in a separate overlay file, merged last. The generated lens
// is never edited by hand; regenerate it.
//
// Pure: inputs are an adapter config, a Map of repo-relative path -> source
// text, and an optional overlay. No file system, network or clock access.

export const SCREEN_LENS_ADAPTER_SCHEMA = 'vexboard.screen-lens-adapter/v1';
export const SCREEN_LENS_OVERLAY_SCHEMA = 'vexboard.screen-lens-overlay/v1';
export const ADAPTER_VERSION = 'vexlife-android-adapter/2';

function fail(message) {
  throw new TypeError(`screen lens adapter: ${message}`);
}

/* ---------- Kotlin reading helpers (just enough for the VexLife DSL) ---------- */

function skipLiteralOrComment(text, i) {
  if (text.startsWith('"""', i)) {
    const end = text.indexOf('"""', i + 3);
    return end < 0 ? text.length : end + 3;
  }
  const c = text[i];
  if (c === '"' || c === "'") {
    let j = i + 1;
    while (j < text.length && text[j] !== c) j += text[j] === '\\' ? 2 : 1;
    return j + 1;
  }
  if (text.startsWith('//', i)) {
    const end = text.indexOf('\n', i);
    return end < 0 ? text.length : end;
  }
  if (text.startsWith('/*', i)) {
    const end = text.indexOf('*/', i + 2);
    return end < 0 ? text.length : end + 2;
  }
  return -1;
}

// Index of the bracket that closes the one at `open`.
export function matchClose(text, open) {
  const pairs = { '(': ')', '{': '}', '[': ']', '<': '>' };
  const opener = text[open];
  const closer = pairs[opener];
  if (!closer) fail(`matchClose needs an opening bracket at ${open}`);
  let depth = 0;
  for (let i = open; i < text.length; i += 1) {
    const skipped = skipLiteralOrComment(text, i);
    if (skipped >= 0) { i = skipped - 1; continue; }
    if (text[i] === opener) depth += 1;
    else if (text[i] === closer) {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return fail(`unbalanced ${opener} at ${open}`);
}

export function stripComments(text) {
  let out = '';
  for (let i = 0; i < text.length; i += 1) {
    if (text.startsWith('//', i) || text.startsWith('/*', i)) { i = skipLiteralOrComment(text, i) - 1; continue; }
    const skipped = skipLiteralOrComment(text, i);
    if (skipped >= 0) { out += text.slice(i, skipped); i = skipped - 1; continue; }
    out += text[i];
  }
  return out;
}

export const compact = (value) => String(value ?? '').replace(/\s+/g, ' ').replace(/\(\s+/g, '(').replace(/\s+\)/g, ')').replace(/,\s*\)/g, ')').trim();

// Top-level comma split that respects brackets, strings and comments.
export function splitArgs(text) {
  const parts = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < text.length; i += 1) {
    const skipped = skipLiteralOrComment(text, i);
    if (skipped >= 0) { i = skipped - 1; continue; }
    const c = text[i];
    if ('({['.includes(c)) depth += 1;
    else if (')}]'.includes(c)) depth -= 1;
    else if (c === ',' && depth === 0) { parts.push(text.slice(start, i)); start = i + 1; }
  }
  parts.push(text.slice(start));
  return parts.map((part) => stripComments(part).trim()).filter(Boolean).map((part) => {
    const named = /^([A-Za-z_]\w*)\s*=(?!=)\s*([\s\S]*)$/.exec(part);
    return named ? { name: named[1], value: compact(named[2]) } : { name: null, value: compact(part) };
  });
}

const KEYWORDS = new Set(['if', 'else', 'when', 'for', 'while', 'return', 'val', 'var', 'fun', 'try', 'catch', 'object', 'class', 'override', 'private', 'internal']);

// Call expressions at the top level of `body`: name(args) { lambda }.
export function topLevelCalls(body) {
  const calls = [];
  const ident = /[A-Za-z_][\w.]*/y;
  for (let i = 0; i < body.length;) {
    const skipped = skipLiteralOrComment(body, i);
    if (skipped >= 0) { i = skipped; continue; }
    ident.lastIndex = i;
    const match = /[A-Za-z_]/.test(body[i]) && (i === 0 || !/[\w.]/.test(body[i - 1])) ? ident.exec(body) : null;
    if (match) {
      let j = i + match[0].length;
      while (/\s/.test(body[j] ?? '')) j += 1;
      if (!KEYWORDS.has(match[0]) && (body[j] === '(' || body[j] === '{')) {
        let args = '';
        if (body[j] === '(') {
          const close = matchClose(body, j);
          args = body.slice(j + 1, close);
          j = close + 1;
          let k = j;
          while (/\s/.test(body[k] ?? '')) k += 1;
          if (body[k] === '{') j = k;
        }
        let lambda = null;
        if (body[j] === '{') {
          const close = matchClose(body, j);
          lambda = body.slice(j + 1, close);
          j = close + 1;
        }
        calls.push({ name: match[0], args, body: lambda, start: i });
        i = j;
        continue;
      }
      i += match[0].length;
      continue;
    }
    if ('({['.includes(body[i])) { i = matchClose(body, i) + 1; continue; }
    i += 1;
  }
  return calls;
}

// First paragraph of the KDoc directly above `index`, if any.
export function kdocBefore(text, index) {
  let end = index;
  for (;;) {
    const before = text.slice(0, end).replace(/\s+$/, '');
    const annotation = /(@\w+(\([^)]*\))?|\b(internal|private|public|protected|data|sealed|abstract|open|enum|inline|value))$/.exec(before);
    if (annotation) { end = annotation.index; continue; }
    if (!before.endsWith('*/')) return null;
    const start = before.lastIndexOf('/**');
    if (start < 0) return null;
    const lines = before.slice(start + 3, before.length - 2).split('\n').map((line) => line.replace(/^\s*\*\s?/, '').trim());
    const paragraph = [];
    for (const line of lines) {
      if (!line && paragraph.length) break;
      if (line) paragraph.push(line);
    }
    const summary = paragraph.join(' ').replace(/\[([^\]]+)\]/g, '$1').trim();
    return summary || null;
  }
}

function blockAfter(text, pattern) {
  const match = pattern.exec(text);
  if (!match) return null;
  const open = text.indexOf('{', match.index + match[0].length - 1);
  if (open < 0) return null;
  return { body: text.slice(open + 1, matchClose(text, open)), index: match.index };
}

const humanize = (value) => {
  const words = String(value).replace(/^R\.string\./, '').replace(/[._-]+/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').trim().toLowerCase();
  return words ? words[0].toUpperCase() + words.slice(1) : value;
};
const stringArg = (args) => {
  const first = args.find((arg) => !arg.name && /^"/.test(arg.value)) ?? args.find((arg) => (arg.name === 'id' || arg.name === 'elementId') && /^"/.test(arg.value));
  return first ? first.value.replace(/^"|"$/g, '') : null;
};
const named = (args, name) => args.find((arg) => arg.name === name)?.value ?? null;

// Android string resources: <string name="x">value</string>, default locale.
export function parseStringResources(xml) {
  const strings = new Map();
  for (const match of String(xml).matchAll(/<string\s+name="([^"]+)"[^>]*>([\s\S]*?)<\/string>/g)) {
    const value = match[2]
      .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
      .replace(/<[^>]+>/g, '')
      .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&')
      .replace(/\\(['"])/g, '$1').replace(/\\n/g, ' ')
      .replace(/^"([\s\S]*)"$/, '$1')
      .trim();
    strings.set(match[1], value);
  }
  return strings;
}

/* ---------- source catalog ---------- */

function resolveRoot(adapter, path) {
  const match = /^([a-z][a-z0-9-]*):(.+)$/.exec(path);
  if (!match) return path;
  const root = adapter.repository.roots[match[1]];
  if (root === undefined) fail(`unknown root ${match[1]} in ${path}`);
  return `${root}${match[2]}`;
}
function toRootRef(adapter, path) {
  for (const [name, root] of Object.entries(adapter.repository.roots).sort((a, b) => b[1].length - a[1].length)) {
    if (path.startsWith(root)) return `${name}:${path.slice(root.length)}`;
  }
  return path;
}

function catalog(adapter, files) {
  const find = (pattern) => [...files.entries()].filter(([, text]) => pattern.test(text)).map(([path]) => path).sort();
  const read = (logical) => {
    const path = resolveRoot(adapter, logical);
    if (!files.has(path)) fail(`missing source ${path}`);
    return { path, text: files.get(path) };
  };
  return { find, read, files };
}

function normalizeAdapter(input) {
  if (!input || input.schemaVersion !== SCREEN_LENS_ADAPTER_SCHEMA) fail(`adapter schemaVersion must be ${SCREEN_LENS_ADAPTER_SCHEMA}`);
  for (const key of ['lensRef', 'title']) if (typeof input[key] !== 'string' || !input[key]) fail(`adapter ${key} required`);
  const repository = input.repository;
  if (!repository || typeof repository.url !== 'string' || typeof repository.commit !== 'string' || !repository.roots) fail('adapter repository { url, commit, roots } required');
  for (const key of ['appScreens', 'appShell', 'appActions', 'session', 'screenActionContext']) if (!input.sources?.[key]) fail(`adapter sources.${key} required`);
  return input;
}

/* ---------- parsing the VexLife source ---------- */

function parseActions(text) {
  const keys = new Map();
  for (const match of text.matchAll(/val\s+(\w+)\s*=\s*ActionKey\(\s*"([^"]+)"\s*\)/g)) keys.set(match[1], match[2]);
  return keys;
}

function parseScreenList(text, name) {
  const match = new RegExp(`val\\s+${name}\\s*:[^=]*=\\s*listOf\\(`).exec(text);
  if (!match) return [];
  const open = match.index + match[0].length - 1;
  return splitArgs(text.slice(open + 1, matchClose(text, open))).map((arg) => arg.value);
}

function parseRefs(text) {
  const refs = new Map();
  for (const match of text.matchAll(/val\s+(\w+)\s*=\s*(\w+Ref)\(/g)) {
    const open = match.index + match[0].length - 1;
    const args = splitArgs(text.slice(open + 1, matchClose(text, open)));
    refs.set(match[1], {
      name: match[1],
      fn: match[2],
      id: stringArg(args),
      labelRes: named(args, 'labelRes') ?? named(args, 'textRes'),
      intent: named(args, 'intent'),
      style: named(args, 'style'),
    });
  }
  return refs;
}

const LAYOUT_KINDS = Object.freeze({
  scrollableColumn: 'COLUMN', column: 'COLUMN', row: 'ROW', card: 'CARD', stack: 'STACK', swappable: 'REGION', container: 'REGION',
  toggle: 'TOGGLE', button: 'BUTTON', fab: 'FAB', text: 'TEXT', textField: 'FIELD', modalBottomSheet: 'SHEET', dialog: 'DIALOG',
});
const REF_KINDS = Object.freeze({
  scrollableColumnRef: 'COLUMN', columnRef: 'COLUMN', swappableRef: 'REGION', toggleRef: 'TOGGLE', buttonRef: 'BUTTON', fabRef: 'FAB',
  textRef: 'TEXT', textFieldRef: 'FIELD', modalBottomSheetRef: 'SHEET', dialogRef: 'DIALOG', vexComposeChildRef: 'REGION',
});

function parseScreen(path, text) {
  const head = /object\s+(\w+)\s*:\s*AppScreenBlueprint\(/.exec(text);
  if (!head) return null;
  const open = head.index + head[0].length - 1;
  const args = splitArgs(text.slice(open + 1, matchClose(text, open)));
  const layout = blockAfter(text, /override\s+val\s+content\s*=\s*layout\s*\{/);
  return {
    path,
    text,
    object: head[1],
    screenKey: named(args, 'screenKey')?.replace(/^"|"$/g, '') ?? stringArg(args),
    titleRes: named(args, 'titleRes'),
    doc: kdocBefore(text, head.index),
    refs: parseRefs(text),
    layout: layout ? layout.body : null,
    customRender: /override\s+fun\s+renderContent\(/.test(text),
  };
}

// Every `appAction(action = AppActions.X) { ... }` in every file, with the locals
// and parameters of the function that encloses it. Registrations may live in a
// Screen's appActionRegistrations or in any helper that returns registrations.
function functionSpans(text) {
  const spans = [];
  for (const match of text.matchAll(/\bfun\s+(?:[\w.<>]+\.)?(\w+)\s*\(/g)) {
    const paramsOpen = match.index + match[0].length - 1;
    let paramsClose;
    try { paramsClose = matchClose(text, paramsOpen); } catch { continue; }
    const after = /^\s*(?::\s*[\w.<>?,\s]+?)?\s*([{=])/.exec(text.slice(paramsClose + 1));
    if (!after) continue;
    const marker = paramsClose + 1 + after[0].length - 1;
    let end = marker;
    if (after[1] === '{') end = matchClose(text, marker);
    else {
      const next = /[({]/.exec(text.slice(marker + 1));
      end = next ? matchClose(text, marker + 1 + next.index) : marker;
    }
    const params = new Map();
    for (const arg of splitArgs(text.slice(paramsOpen + 1, paramsClose))) {
      const param = /^(\w+)\s*:\s*([\w.<>?]+)/.exec(arg.value);
      if (param) params.set(param[1], param[2]);
    }
    spans.push({ name: match[1], start: match.index, bodyStart: marker + 1, end, params });
  }
  return spans;
}

function registrationIndex(adapter, files) {
  const index = new Map();
  for (const [path, text] of [...files.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    if (!text.includes('appAction(')) continue;
    const spans = functionSpans(text);
    const ownerMatch = /object\s+(\w+)\s*:\s*AppScreenBlueprint\(/.exec(text);
    let ownerRange = null;
    if (ownerMatch) {
      const argsClose = matchClose(text, ownerMatch.index + ownerMatch[0].length - 1);
      const bodyOpen = text.indexOf('{', argsClose);
      if (bodyOpen >= 0) ownerRange = [bodyOpen, matchClose(text, bodyOpen)];
    }
    for (const match of text.matchAll(/\bappAction\(/g)) {
      const argOpen = match.index + match[0].length - 1;
      const argClose = matchClose(text, argOpen);
      const args = splitArgs(text.slice(argOpen + 1, argClose));
      const action = named(args, 'action')?.replace(/^AppActions\./, '');
      const lambdaOpen = /^\s*\{/.test(text.slice(argClose + 1)) ? text.indexOf('{', argClose) : -1;
      if (!action || lambdaOpen < 0 || index.has(action)) continue;
      const raw = text.slice(lambdaOpen + 1, matchClose(text, lambdaOpen));
      const fn = spans.filter((span) => span.start < match.index && span.end > match.index).sort((a, b) => b.start - a.start)[0] ?? null;
      const locals = new Map();
      if (fn) {
        const body = text.slice(fn.bodyStart, fn.end);
        for (const local of body.matchAll(/val\s+(\w+)\s*=\s*/g)) {
          const rest = body.slice(local.index + local[0].length);
          const stop = rest.search(/\n\s*(val\s|return\b|AppActionRegistrations\.of\()/);
          locals.set(local[1], compact(stripComments(stop < 0 ? rest : rest.slice(0, stop))));
        }
      }
      index.set(action, {
        code: compact(stripComments(raw).replace(/^\s*\w+\s*->/, '')),
        comment: /\/\/\s*(.+)/.exec(raw)?.[1]?.trim() ?? null,
        locals,
        params: fn?.params ?? new Map(),
        source: toRootRef(adapter, path),
        symbol: `${ownerRange && fn && fn.start > ownerRange[0] && fn.start < ownerRange[1] ? `${ownerMatch[1]}.` : ''}${fn?.name ?? 'appAction'}`,
      });
    }
  }
  return index;
}

function contextFields(text) {
  const fields = new Map();
  const match = /class\s+ScreenActionContext\(/.exec(text);
  if (!match) return fields;
  const open = match.index + match[0].length - 1;
  for (const arg of splitArgs(text.slice(open + 1, matchClose(text, open)))) {
    const field = /^val\s+(\w+)\s*:\s*(.+)$/.exec(arg.value);
    if (field) fields.set(field[1], field[2].trim());
  }
  return fields;
}

// Both chaining forms appear in source: `a(x) then b(y)` and `a(x).then(b(y))`.
export function parseIntent(expression) {
  if (!expression) return [];
  const text = expression.trim();
  const steps = [];
  let i = 0;
  for (;;) {
    const match = /^\s*(?:\.?\s*then\s*\(?)?\s*(\w+)\s*\(/.exec(text.slice(i));
    if (!match) break;
    const open = i + match[0].length - 1;
    const close = matchClose(text, open);
    steps.push({ op: match[1], arg: compact(text.slice(open + 1, close)) });
    i = close + 1;
  }
  return steps.length ? steps : [{ op: 'unknown', arg: text }];
}

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/* ---------- Family vocabulary (one template for every VexFamily) ---------- */

function sealedMembers(text, interfaceName) {
  const block = blockAfter(text, new RegExp(`sealed\\s+(?:interface|class)\\s+${interfaceName}\\b[^{]*\\{`));
  if (!block) return [];
  return [...block.body.matchAll(/(?:data\s+class|data\s+object|class|object)\s+(\w+)/g)].map((match) => match[1]);
}

function parseFamily(cat, adapter, familyName) {
  const [path] = cat.find(new RegExp(`class\\s+${familyName}\\s*\\(`));
  if (!path) return null;
  const text = cat.files.get(path);
  const classMatch = new RegExp(`class\\s+${familyName}\\s*\\(`).exec(text);
  const stateEnum = new RegExp(`enum\\s+class\\s+(\\w+)\\s*:\\s*VexFamily\\.State<${familyName}>\\s*\\{([^}]*)\\}`).exec(text);
  const act = blockAfter(text, /object\s+Act\s*\{/);
  const methods = [];
  if (act) {
    for (const match of act.body.matchAll(/\bclass\s+(\w+)\s*\(/g)) {
      if (match[1] === 'Method') continue;
      const open = match.index + match[0].length - 1;
      const params = splitArgs(act.body.slice(open + 1, matchClose(act.body, open))).map((arg) => arg.value.replace(/^(private\s+)?val\s+/, ''));
      const storeParam = params.map((param) => /^(\w+)\s*:\s*(\w+Store)\b/.exec(param)).find(Boolean);
      const after = act.body.slice(open);
      const op = storeParam ? new RegExp(`${storeParam[1]}\\.(\\w+)\\(`).exec(after)?.[1] ?? null : null;
      const classBody = act.body.indexOf('{', matchClose(act.body, open));
      const methodText = classBody >= 0 ? act.body.slice(classBody, matchClose(act.body, classBody)) : '';
      const result = /VexMethod\.Result\.(\w+)\(/.exec(methodText)?.[1] ?? null;
      methods.push({ name: match[1], params: params.map((param) => param.split(':')[0].trim()), storeName: storeParam?.[1] ?? null, storeType: storeParam?.[2] ?? null, op, result });
    }
  }
  const approach = /\bbegin(Latest|Earliest|Queued)\(/.exec(text)?.[1] ?? (/\bbegin\(/.test(text) ? 'Independent' : null);
  const presentation = /override\s+val\s+presentation\s*=\s*(\w+)\./.exec(text)?.[1] ?? null;
  return {
    name: familyName,
    path,
    doc: classMatch ? kdocBefore(text, classMatch.index) : null,
    stateType: stateEnum?.[1] ?? 'State',
    stateValues: stateEnum ? stateEnum[2].split(',').map((value) => value.trim()).filter(Boolean) : [],
    controls: sealedMembers(text, 'Control'),
    effects: sealedMembers(text, 'Effect'),
    parameters: sealedMembers(text, 'Parameter'),
    displayStates: sealedMembers(text, 'DisplayState'),
    presentation,
    methods,
    approach,
    observe: /fun\s+(observe\w*Store)\s*\(/.exec(text)?.[1] ?? null,
    activate: /fun\s+(activate\w+)\s*\(/.exec(text)?.[1] ?? null,
    records: /record\w*Fact\s*\(/.test(text),
    excerpt: (kind, member) => {
      const block = blockAfter(text, new RegExp(`sealed\\s+interface\\s+${kind}\\b[^{]*\\{`));
      const match = block ? new RegExp(`data\\s+class\\s+${member}\\s*\\(`).exec(block.body) : null;
      if (!match) return null;
      const open = match.index + match[0].length - 1;
      return compact(`data class ${member}(${block.body.slice(open + 1, matchClose(block.body, open))}) : ${kind}`);
    },
    source: toRootRef(adapter, path),
  };
}

function parseStore(cat, adapter, storeType) {
  const [path] = cat.find(new RegExp(`interface\\s+${storeType}\\b`));
  if (!path) return null;
  const text = cat.files.get(path);
  const impls = [...text.matchAll(new RegExp(`class\\s+(\\w+)[^{]*?:\\s*(?:[\\w.<>,\\s]*,\\s*)?${storeType}\\b`, 'g'))].map((match) => match[1]).filter((name) => name !== storeType);
  const success = blockAfter(text, /sealed\s+interface\s+Result\b[^{]*\{/) ? sealedMembers(text, 'Result') : [];
  return { type: storeType, source: toRootRef(adapter, path), impls, results: success };
}

function providerFor(cat, adapter, familyName) {
  for (const [path, text] of cat.files) {
    const match = new RegExp(`class\\s+(${familyName}Provider)\\s*\\(`).exec(text);
    if (!match) continue;
    const deps = /dependencies\s*=\s*listOf\(([^)]*)\)/.exec(text.slice(match.index));
    return { name: match[1], deps: deps ? splitArgs(deps[1]).map((arg) => arg.value) : [], source: toRootRef(adapter, path) };
  }
  return null;
}

// Follow `name()` -> ScreenActionContext.name -> `name = { fn(...) }` in the
// session -> `fun fn(` -> `<Family>.Control.<C>(`. Returns null when any hop
// is missing; the caller then projects a direct registration instead.
function followClosure(cat, adapter, name) {
  const session = cat.read(adapter.sources.session);
  const assign = new RegExp(`\\b${name}\\s*=\\s*\\{`).exec(session.text);
  if (!assign) return null;
  const open = session.text.indexOf('{', assign.index);
  const lambda = session.text.slice(open + 1, matchClose(session.text, open));
  const call = /([a-z]\w*)\s*\(/.exec(stripComments(lambda));
  if (!call) return null;
  for (const [path, text] of cat.files) {
    const fn = new RegExp(`fun\\s+${call[1]}\\s*\\(`).exec(text);
    if (!fn) continue;
    const paramsOpen = text.indexOf('(', fn.index);
    const bodyOpen = text.indexOf('{', matchClose(text, paramsOpen));
    const body = text.slice(bodyOpen + 1, matchClose(text, bodyOpen));
    const control = /(\w+Family)\.Control\.(\w+)\s*\(/.exec(body);
    const params = splitArgs(text.slice(paramsOpen + 1, matchClose(text, paramsOpen))).map((arg) => arg.value.split(':')[0].trim());
    return { closure: name, fn: call[1], fnParams: params, fnSource: toRootRef(adapter, path), fnDoc: kdocBefore(text, fn.index), family: control?.[1] ?? null, control: control?.[2] ?? null };
  }
  return null;
}


// One earned VexBehavior shape: a custom presentation doorway forwards a
// Family-bound Control through an Experience membrane into a typed VexPort /
// VexPortFlow Connection. This does not cover session/Relay/convergence entry;
// those shapes must earn their own traversal from source.
function uniqueSource(cat, adapter, pattern) {
  const paths = cat.find(pattern);
  if (paths.length !== 1) return null;
  const path = paths[0];
  return { path, text: cat.files.get(path), source: toRootRef(adapter, path) };
}

function behaviorControlActs(text, controlType, controlMember, actType) {
  const pattern = new RegExp(`\\bcontrol\\s*\\(\\s*${escapeRegex(controlType)}\\.${escapeRegex(controlMember)}\\b`, 'g');
  const candidates = [];
  for (const match of text.matchAll(pattern)) {
    const open = text.indexOf('(', match.index);
    if (open < 0) continue;
    let close;
    try { close = matchClose(text, open); } catch { continue; }
    const acts = splitArgs(text.slice(open + 1, close)).slice(1)
      .map((arg) => new RegExp(`${escapeRegex(actType)}\\.(\\w+)`).exec(arg.value)?.[1])
      .filter(Boolean);
    if (acts.length) candidates.push(acts);
  }
  const unique = new Map(candidates.map((acts) => [acts.join('|'), acts]));
  return unique.size === 1 ? [...unique.values()][0] : null;
}

function behaviorEffectsForActs(text, actType, effectType, acts) {
  const effects = [];
  for (const match of text.matchAll(/\bon\s*\(/g)) {
    const open = match.index + match[0].length - 1;
    let close;
    try { close = matchClose(text, open); } catch { continue; }
    const args = splitArgs(text.slice(open + 1, close));
    const actValue = named(args, 'act');
    const effectValue = named(args, 'effect');
    const act = actValue ? new RegExp(`${escapeRegex(actType)}\\.(\\w+)`).exec(actValue)?.[1] : null;
    const effect = effectValue ? new RegExp(`${escapeRegex(effectType)}\\.(\\w+)`).exec(effectValue)?.[1] : null;
    if (act && effect && acts.includes(act)) effects.push(effect);
  }
  return [...new Set(effects)];
}

function typealiasCoordinates(text, alias, target) {
  const match = new RegExp(`typealias\\s+${escapeRegex(alias)}\\s*=\\s*${escapeRegex(target)}\\s*<([\\s\\S]{0,900}?)>`).exec(text);
  if (!match) return null;
  const args = splitArgs(match[1]).map((arg) => arg.value.trim());
  return args.length >= 4 ? args.slice(0, 4) : null;
}

function behaviorBlueprintCoordinates(cat, adapter, familyType, stateType, actType) {
  for (const [path, text] of cat.files) {
    if (!text.includes('vexBehaviorBlueprint') || !text.includes(familyType)) continue;
    const match = new RegExp(`VexBehaviorBlueprint\\s*<\\s*${escapeRegex(familyType)}\\s*,\\s*${escapeRegex(stateType)}\\s*,\\s*${escapeRegex(actType)}\\s*,\\s*(\\w+)\\s*>`).exec(text);
    if (!match) continue;
    const behaviorRef = /behaviorRef\s*=\s*"([^"]+)"/.exec(text)?.[1] ?? null;
    if (!behaviorRef) continue;
    return { path, text, source: toRootRef(adapter, path), effectType: match[1], behaviorRef };
  }
  return null;
}

function implementationOf(cat, adapter, interfaceType, controlType) {
  const candidates = [];
  for (const [path, text] of cat.files) {
    for (const match of text.matchAll(/\bclass\s+(\w+)\s*\(/g)) {
      const paramsOpen = match.index + match[0].length - 1;
      let paramsClose;
      try { paramsClose = matchClose(text, paramsOpen); } catch { continue; }
      const bodyOpen = text.indexOf('{', paramsClose);
      if (bodyOpen < 0) continue;
      const header = text.slice(paramsClose + 1, bodyOpen);
      if (!new RegExp(`:\\s*${escapeRegex(interfaceType)}\\b`).test(header)) continue;
      let bodyClose;
      try { bodyClose = matchClose(text, bodyOpen); } catch { continue; }
      const body = text.slice(bodyOpen + 1, bodyClose);
      const params = splitArgs(text.slice(paramsOpen + 1, paramsClose));
      const port = params
        .map((arg) => /(?:private\s+)?val\s+(\w+)\s*:\s*([A-Z]\w*Connection(?:Flow)?)\??/.exec(arg.value))
        .find(Boolean);
      if (!port) continue;
      const activate = functionSpans(body).find((fn) => fn.name === 'activate' && [...fn.params.values()].includes(controlType));
      if (!activate) continue;
      const controlName = [...activate.params.entries()].find(([, type]) => type === controlType)?.[0] ?? null;
      if (!controlName) continue;
      const activateBody = body.slice(activate.bodyStart, activate.end);
      const forwards = new RegExp(`${escapeRegex(port[1])}\\s*(?:\\?\\.|\\.)\\s*activate\\s*\\(\\s*${escapeRegex(controlName)}\\s*,?\\s*\\)`).test(activateBody);
      if (!forwards) continue;
      candidates.push({ name: match[1], portField: port[1], portType: port[2], source: toRootRef(adapter, path), path, text });
    }
  }
  const unique = new Map(candidates.map((candidate) => [`${candidate.name}|${candidate.portType}`, candidate]));
  return unique.size === 1 ? [...unique.values()][0] : null;
}

function concreteConnection(cat, adapter, flowAlias, controlType) {
  const candidates = [];
  for (const [path, text] of cat.files) {
    for (const match of text.matchAll(/\bclass\s+(\w*Connection)\s*\(/g)) {
      const paramsOpen = match.index + match[0].length - 1;
      let paramsClose;
      try { paramsClose = matchClose(text, paramsOpen); } catch { continue; }
      const bodyOpen = text.indexOf('{', paramsClose);
      if (bodyOpen < 0) continue;
      const header = text.slice(paramsClose + 1, bodyOpen);
      if (!new RegExp(`:\\s*${escapeRegex(flowAlias)}\\b`).test(header)) continue;
      let bodyClose;
      try { bodyClose = matchClose(text, bodyOpen); } catch { continue; }
      const body = text.slice(bodyOpen + 1, bodyClose);
      if (!new RegExp(`override\\s+fun\\s+activate\\s*\\([\\s\\S]{0,180}${escapeRegex(controlType)}\\b`).test(body)) continue;
      const params = splitArgs(text.slice(paramsOpen + 1, paramsClose));
      const provider = params
        .map((arg) => /(?:private\s+)?val\s+(\w+)\s*:\s*([A-Z][\w.]*)/.exec(arg.value))
        .find(Boolean);
      candidates.push({
        name: match[1], path, source: toRootRef(adapter, path), text: text.slice(match.index, bodyClose + 1),
        providerName: provider?.[1] ?? null, providerType: provider?.[2] ?? null,
      });
    }
  }
  const unique = new Map(candidates.map((candidate) => [candidate.name, candidate]));
  return unique.size === 1 ? [...unique.values()][0] : null;
}

function sourceForFunction(cat, adapter, functionName) {
  const candidates = [];
  for (const [path, text] of cat.files) {
    if (new RegExp(`fun\\s+(?:\\w+\\.)?${escapeRegex(functionName)}\\s*\\(`).test(text)) candidates.push({ path, text, source: toRootRef(adapter, path) });
  }
  return candidates.length === 1 ? candidates[0] : null;
}

function followBehaviorPort(cat, adapter, screen, element) {
  const declaration = element.symbol?.split('.').at(-1) ?? null;
  if (!screen || !declaration) return null;
  const elementPattern = `${escapeRegex(screen.object)}\\s*\\.\\s*${escapeRegex(declaration)}`;
  const doorways = [];
  for (const [path, text] of cat.files) {
    const pattern = new RegExp(`${elementPattern}\\s*->[\\s\\S]{0,260}?([a-z]\\w*)\\s*(?:\\?\\.)?\\.\\s*activate\\s*\\(\\s*([A-Z]\\w*Control)\\s*\\.\\s*(\\w+)`, 'g');
    for (const match of text.matchAll(pattern)) {
      const span = functionSpans(text).filter((fn) => fn.start < match.index && fn.end > match.index).sort((a, b) => b.start - a.start)[0] ?? null;
      const receiverType = span?.params.get(match[1])?.replace(/\?$/, '') ?? null;
      if (!receiverType) continue;
      doorways.push({ receiver: match[1], receiverType, controlType: match[2], control: match[3], functionName: span.name, source: toRootRef(adapter, path), path });
    }
  }
  const doorwayKeys = new Set(doorways.map((doorway) => `${doorway.receiverType}|${doorway.controlType}|${doorway.control}`));
  const doorwaySources = new Set(doorways.map((doorway) => doorway.source));
  if (doorwayKeys.size !== 1 || doorwaySources.size !== 1) return null;
  const doorway = { ...doorways[0], functions: [...new Set(doorways.map((entry) => entry.functionName))] };

  const experience = uniqueSource(cat, adapter, new RegExp(`interface\\s+${escapeRegex(doorway.receiverType)}\\b`));
  if (!experience) return null;
  const implementation = implementationOf(cat, adapter, doorway.receiverType, doorway.controlType);
  if (!implementation) return null;

  const types = uniqueSource(cat, adapter, new RegExp(`typealias\\s+${escapeRegex(implementation.portType)}\\b`));
  if (!types) return null;
  const coordinates = typealiasCoordinates(types.text, implementation.portType, 'VexPort');
  if (!coordinates) return null;
  const [familyType, stateType, controlType, actType] = coordinates;
  if (controlType !== doorway.controlType) return null;

  const flowAliases = [...types.text.matchAll(/typealias\s+(\w+)\s*=\s*VexPortFlow\s*</g)].map((match) => match[1]);
  const flowAlias = flowAliases.find((alias) => {
    const flow = typealiasCoordinates(types.text, alias, 'VexPortFlow');
    return flow && flow.join('|') === coordinates.join('|');
  }) ?? null;
  if (!flowAlias) return null;

  const family = uniqueSource(cat, adapter, new RegExp(`(?:sealed\\s+interface|interface|class)\\s+${escapeRegex(familyType)}[\\s\\S]{0,240}VexBehaviorFamily\\s*<\\s*${escapeRegex(familyType)}\\s*>`));
  const state = uniqueSource(cat, adapter, new RegExp(`(?:sealed\\s+interface|interface|class)\\s+${escapeRegex(stateType)}[\\s\\S]{0,280}VexBehaviorFamily\\.State\\s*<\\s*${escapeRegex(familyType)}\\s*>`));
  const control = uniqueSource(cat, adapter, new RegExp(`enum\\s+class\\s+${escapeRegex(controlType)}[\\s\\S]{0,280}VexBehaviorFamily\\.Control\\s*<\\s*${escapeRegex(familyType)}\\s*>`));
  const act = uniqueSource(cat, adapter, new RegExp(`(?:sealed\\s+interface|interface|class)\\s+${escapeRegex(actType)}[\\s\\S]{0,280}VexBehaviorFamily\\.Act\\s*<\\s*${escapeRegex(familyType)}\\s*>`));
  const behavior = behaviorBlueprintCoordinates(cat, adapter, familyType, stateType, actType);
  if (!family || !state || !control || !act || !behavior) return null;

  const effectType = behavior.effectType;
  const effect = uniqueSource(cat, adapter, new RegExp(`(?:sealed\\s+interface|interface|class)\\s+${escapeRegex(effectType)}[\\s\\S]{0,280}VexBehaviorFamily\\.Effect\\s*<\\s*${escapeRegex(familyType)}\\s*>`));
  if (!effect) return null;

  const acts = behaviorControlActs(control.text, controlType, doorway.control, actType);
  if (!acts) return null;
  const effects = behaviorEffectsForActs(behavior.text, actType, effectType, acts);
  if (!effects.length) return null;

  const connection = concreteConnection(cat, adapter, flowAlias, controlType);
  if (!connection) return null;
  const hasResolve = /controls\.resolve[\s\S]{0,1200}behavior\.resolve/.test(connection.text);
  const admittedCall = /\bcurrent\.(\w+)\(\s*effect\s*,?\s*\)/.exec(connection.text)?.[1] ?? null;
  const reconcileCall = /(reconcile\w*Observation)\s*\(/.exec(connection.text)?.[1] ?? null;
  if (!hasResolve || !admittedCall || !reconcileCall) return null;
  const admitted = sourceForFunction(cat, adapter, admittedCall);
  const reconcile = sourceForFunction(cat, adapter, reconcileCall);
  if (!admitted || !reconcile) return null;

  const projectionMatch = [...types.text.matchAll(/typealias\s+(\w+)\s*=\s*VexBehaviorProjection\s*</g)]
    .map((match) => match[1])
    .find((alias) => new RegExp(`typealias\\s+${escapeRegex(alias)}\\s*=[\\s\\S]{0,500}${escapeRegex(familyType)}`).test(types.text)) ?? null;
  if (!projectionMatch) return null;

  const displayType = /val\s+displayState\s*:\s*([A-Z]\w*DisplayState)/.exec(experience.text)?.[1] ?? null;
  const display = displayType ? uniqueSource(cat, adapter, new RegExp(`(?:sealed\\s+interface|interface|class)\\s+${escapeRegex(displayType)}\\b`)) : null;
  if (!display) return null;

  const owners = [];
  for (const [path, text] of cat.files) {
    if (path === connection.path || !text.includes(flowAlias)) continue;
    if (!new RegExp(`${escapeRegex(connection.name)}\\s*\\(`).test(text)) continue;
    const match = /class\s+(\w+)\s*\(/.exec(text);
    if (match) owners.push({ name: match[1], source: toRootRef(adapter, path), path, text });
  }
  const owner = owners.length === 1 ? owners[0] : null;

  const listenerType = /object\s*:\s*([A-Z][\w.]*)\s*\{/.exec(connection.text)?.[1] ?? null;
  const publishObserved = /\b(publishObserved)\s*\(/.test(connection.text) ? 'publishObserved' : null;
  if (!listenerType || !publishObserved) return null;

  return {
    ...doorway,
    behaviorRef: behavior.behaviorRef,
    familyType, stateType, controlType, actType, effectType,
    familySource: family, stateSource: state, controlSource: control, actSource: act, effectSource: effect,
    behavior, experience, implementation, types,
    flowAlias, connection, owner, acts, effects,
    stateValues: sealedMembers(state.text, stateType),
    admittedCall, admitted, reconcileCall, reconcile,
    projectionType: projectionMatch,
    displayType, display,
    listenerType, publishObserved,
  };
}

/* ---------- pathway templates ---------- */

const SUMMARY = Object.freeze({
  runtime: 'Runtime interprets the Invoke intent and looks up the one registered owner for the ActionKey.',
  registration: 'Screen-local registration next to the screen source.',
  navigate: 'Runtime changes currentScreen to the destination.',
  frame: 'AppFrame renders the destination; primary destinations keep the bottom bar and FAB.',
  back: 'Runtime pops to the back target.',
  presentation: 'Runtime presentation state changes; no Behavior is earned.',
  act: 'Pure. Authors the accepted Act and claims nothing about persistence.',
  admitted: 'Semantic State updates now, while outside work is only requested.',
  launch: 'Transports the owner, Approach and RelationshipId the Act already authored.',
  custody: 'Owns which Jobs are alive and how they overlap. It does not decide feature meaning.',
  observe: 'Outside observations re-enter through the rightful semantic owner.',
  provider: 'Session lifetime. Prerequisites resolve first, then the Family is built and wired.',
  chronology: 'Facts recorded beside the path, never as the next owner.',
});

class PathwayBuilder {
  constructor(ref, label, disposition) {
    this.pathway = { pathwayRef: ref, label, disposition, summary: null, returns: null, nodes: [], edges: [] };
    this.prefix = ref.replace(/^pathway\./, '');
  }
  node(slot, face, role, label, extra = {}) {
    const ref = `${this.prefix}.${slot}`;
    if (!this.pathway.nodes.some((node) => node.ref === ref)) this.pathway.nodes.push({ ref, face, role, label, ...Object.fromEntries(Object.entries(extra).filter(([, value]) => value)) });
    return ref;
  }
  edge(from, to, label, kind = 'FLOW') {
    if (from && to) this.pathway.edges.push({ from, to, label, ...(kind === 'FLOW' ? {} : { kind }) });
  }
}

/* ---------- projection ---------- */

export function projectAndroidScreenLens({ adapter: adapterInput, files, overlay = null, observedAt = null }) {
  const adapter = normalizeAdapter(adapterInput);
  if (!(files instanceof Map)) fail('files must be a Map of repo-relative path -> text');
  const cat = catalog(adapter, files);
  const report = { screens: 0, elements: 0, pathways: 0, bonds: [], held: [], unknownCalls: [] };
  const actions = parseActions(cat.read(adapter.sources.appActions).text);
  const screensText = cat.read(adapter.sources.appScreens).text;
  const placement = new Map([...parseScreenList(screensText, 'primary').map((name) => [name, 'PRIMARY']), ...parseScreenList(screensText, 'shared').map((name) => [name, 'SHARED'])]);
  const fields = contextFields(cat.read(adapter.sources.screenActionContext).text);
  const strings = new Map();
  for (const path of adapter.stringResources ?? []) if (files.has(path)) for (const [key, value] of parseStringResources(files.get(path))) strings.set(key, value);
  const textOf = (labelRes, fallback) => {
    const key = /^R\.string\.(\w+)$/.exec(labelRes ?? '')?.[1];
    return (key && strings.get(key)) || (labelRes ? humanize(labelRes) : humanize(fallback));
  };
  report.strings = strings.size;
  const screenObjects = new Map();
  for (const [path, text] of files) {
    if (!/Screen\.kt$/.test(path)) continue;
    const parsed = parseScreen(path, text);
    if (parsed && placement.has(parsed.object)) screenObjects.set(parsed.object, parsed);
  }
  const screenRefOf = (object) => (screenObjects.has(object) ? `screen.${screenObjects.get(object).screenKey}` : null);
  const pathways = new Map();
  const families = new Map();
  const registrations = registrationIndex(adapter, files);

  const typedPathway = (ownerKey, steps, elementInfo) => {
    const shape = steps.map((step) => step.op.replace(/([A-Z])/g, '-$1').toLowerCase()).join('-then-');
    const target = steps.length === 1 && ['open', 'close', 'toggle'].includes(steps[0].op) ? `.${elementInfo.targetLocal}` : '';
    const ref = `pathway.${ownerKey}.${shape}${target}`;
    if (pathways.has(ref)) return ref;
    const navigates = steps.some((step) => step.op === 'navigateTo' || step.op === 'navigateBack');
    const builder = new PathwayBuilder(ref, elementInfo.pathwayLabel, navigates ? 'TYPED_NAVIGATION' : 'TYPED_PRESENTATION');
    const intent = builder.node('intent', 'BEHAVIOR', 'INTENT', navigates && steps.at(-1).op === 'navigateTo' ? steps.map((step) => (step.op === 'navigateTo' ? 'navigateTo(<Screen>)' : `${step.op}(${step.arg})`)).join(' then ') : steps.map((step) => `${step.op}(${step.arg})`).join(' then '), { symbol: 'ElementIntent', summary: 'Declared on the element.', source: elementInfo.source });
    let previous = intent;
    steps.forEach((step, i) => {
      const label = step.op === 'navigateTo' ? 'NavigateTo(ScreenId)' : step.op === 'navigateBack' ? 'NavigateBack' : `${step.op[0].toUpperCase()}${step.op.slice(1)}(${elementInfo.targetRef ?? step.arg})`;
      const next = builder.node(`step-${i + 1}`, 'BEHAVIOR', 'NAVIGATION', label, { symbol: step.op.startsWith('navigate') ? 'VexRuntime' : 'runtime.presentation', summary: step.op === 'navigateTo' ? SUMMARY.navigate : step.op === 'navigateBack' ? SUMMARY.back : SUMMARY.presentation, source: adapter.sources.runtime });
      builder.edge(previous, next, i === 0 ? step.op : 'then');
      previous = next;
    });
    if (steps.at(-1).op === 'navigateTo') {
      const frame = builder.node('frame', 'BEHAVIOR', 'PROJECTION', 'AppFrame renders destination', { symbol: 'runtime.currentScreen', summary: SUMMARY.frame, source: adapter.sources.frame });
      builder.edge(previous, frame, 'currentScreen');
      builder.pathway.returnRef = frame;
      builder.pathway.returns = 'The destination screen is shown.';
    }
    if (elementInfo.renderer) {
      const view = builder.node('renderer', 'BEHAVIOR', 'PROJECTION', `${elementInfo.renderer.name}(…)`, { symbol: `isOpen(${elementInfo.targetLocal})`, summary: 'The screen renders this while presentation says it is open.', source: elementInfo.source });
      builder.edge(previous, view, 'renders');
      builder.pathway.returnRef = view;
      for (const store of elementInfo.renderer.stores) {
        const depth = builder.node(`reads-${store}`, 'DEPTH', 'STORE', store, { symbol: store, summary: 'Read by the rendered content.', source: elementInfo.source });
        builder.edge(view, depth, 'reads', 'DATA');
      }
    }
    builder.pathway.summary = navigates ? 'A typed navigation relationship already says everything; no Act identity is earned.' : 'A typed presentation relationship already says everything; no Family, Act or Effect is earned.';
    pathways.set(ref, builder.pathway);
    return ref;
  };

  const familyPathway = (actionKey, registration, bond) => {
    const family = families.get(bond.family) ?? parseFamily(cat, adapter, bond.family);
    if (!family) return null;
    families.set(bond.family, family);
    const ref = `pathway.${actionKey.replace(/^action\./, '')}`;
    const builder = new PathwayBuilder(ref, `${family.name.replace(/Family$/, '')} · ${bond.control}`, 'SCAE_FAMILY');
    const method = family.methods[0] ?? null;
    const effect = family.effects[0] ?? null;
    const intent = builder.node('intent', 'BEHAVIOR', 'INTENT', `invoke(AppActions.${registration.actionName})`, { symbol: actionKey, summary: 'The element names an application action. It does not save or mutate State.', source: adapter.sources.appActions });
    const runtime = builder.node('runtime', 'BEHAVIOR', 'DISPATCH', 'VexRuntime → AppActionRegistrations.dispatch', { symbol: 'ElementIntent.Invoke', summary: SUMMARY.runtime, source: adapter.sources.runtime });
    const reg = builder.node('registration', 'BEHAVIOR', 'DISPATCH', `appAction(${registration.actionName}) { ${registration.code} }`, { symbol: registration.symbol, summary: SUMMARY.registration, source: registration.source });
    const closure = builder.node('closure', 'BEHAVIOR', 'DISPATCH', `${bond.fn}(${bond.fnParams.join(', ')})`, { symbol: `ScreenActionContext.${bond.closure}`, summary: bond.fnDoc ?? 'Closure captured when the session was built; it forms the Family Control.', source: bond.fnSource });
    const control = builder.node('control', 'BEHAVIOR', 'CONTROL', `Control.${bond.control}(${family.parameters[0] ? `Parameter.${family.parameters[0]}` : '…'})`, { symbol: `${family.name}.Control.${bond.control}`, summary: 'Family-owned semantic input.', source: family.source, code: family.excerpt('Control', bond.control) });
    const state = builder.node('state', 'BEHAVIOR', 'STATE', `CURRENT State · ${family.stateType}`, { symbol: family.stateValues.length ? `${family.stateType}.${family.stateValues.join(' | ')}` : family.stateType, summary: 'Exact current semantic truth that act() reads.', source: family.source });
    const act = builder.node('act', 'BEHAVIOR', 'ACT', `${family.name}.act(State, Control)`, { symbol: 'VexFamily.activate', summary: SUMMARY.act, source: family.source });
    const admitted = builder.node('admitted', 'BEHAVIOR', 'STATE', 'admitted State', { symbol: 'accepted.admittedState', summary: SUMMARY.admitted, source: adapter.sources.vexFamily });
    builder.edge(intent, runtime, 'Invoke');
    builder.edge(runtime, reg, 'dispatch');
    builder.edge(reg, closure, 'closure');
    builder.edge(closure, control, 'creates');
    builder.edge(control, act, 'Control');
    builder.edge(state, act, 'CURRENT', 'DATA');
    builder.edge(act, admitted, 'admits');
    let effectRef = null;
    if (effect) {
      effectRef = builder.node('effect', 'BEHAVIOR', 'EFFECT', `Begin(Effect.${effect}${family.approach ? `, ${family.approach}` : ''})`, { symbol: `${family.name}.Effect.${effect}`, summary: `Inert request for outside work${family.approach ? ` with the ${family.approach} overlap Approach` : ''}.`, source: family.source, code: family.excerpt('Effect', effect) });
      builder.edge(act, effectRef, 'begins');
    }
    if (family.displayStates.length) {
      const display = builder.node('display', 'BEHAVIOR', 'PROJECTION', `DisplayState → ${family.presentation ?? 'presentation'}`, { symbol: `${family.name}.displayStateFor`, summary: 'The Family decides presentation meaning; the UI only manifests it.', source: family.source });
      builder.edge(admitted, display, 'projects');
      builder.pathway.returnRef = display;
    }
    if (method) {
      const store = method.storeType ? parseStore(cat, adapter, method.storeType) : null;
      const m = builder.node('method', 'DEPTH', 'METHOD', `Act.Method.${method.name}(${method.params.join(', ')})`, { symbol: `${family.name}.Act.Method.${method.name}`, summary: 'Fully bound: the real Store plus the semantic Parameter. Nothing downstream reconstructs them.', source: family.source });
      const launch = builder.node('launch', 'DEPTH', 'EXECUTION', 'act.launchWith(executionRoot).method(…)', { symbol: family.activate, summary: SUMMARY.launch, source: family.source });
      const custody = builder.node('custody', 'DEPTH', 'EXECUTION', `VexExecution · Job custody${family.approach ? ` (${family.approach})` : ''}`, { symbol: 'VexExecution', summary: SUMMARY.custody, source: adapter.sources.vexExecution });
      builder.edge(effectRef, m, 'binds');
      builder.edge(m, launch, 'launch');
      builder.edge(launch, custody, 'Job');
      if (store) {
        const storeRef = builder.node('store', 'DEPTH', 'STORE', `${store.type}.${method.op ?? 'call'}(…)`, { symbol: store.type, summary: 'Boundary to independently owned outside truth.', source: store.source });
        builder.edge(custody, storeRef, 'runs');
        let last = storeRef;
        if (store.impls.length) {
          const impl = builder.node('store-impl', 'DEPTH', 'STORE', store.impls[0], { symbol: store.impls.join(' | '), summary: store.impls.length > 1 ? `Implementations: ${store.impls.join(', ')}.` : 'Concrete store implementation.', source: store.source });
          builder.edge(storeRef, impl, 'persists');
          last = impl;
        }
        if (method.result || store.results.length) {
          const result = method.result
            ? builder.node('result', 'DEPTH', 'OBSERVATION', `VexMethod.Result.${method.result}(…)`, { symbol: 'VexMethod.Result', summary: 'The bound Method reports what outside truth did. It is not admitted until the Family interprets it.', source: family.source })
            : builder.node('result', 'DEPTH', 'OBSERVATION', `Result.${store.results[0]}(…)`, { symbol: `${store.type}.Result`, summary: 'Outside truth came back. It is not admitted until the Family interprets it.', source: store.source });
          builder.edge(last, result, 'returns');
          last = result;
        }
        if (family.observe) {
          const observe = builder.node('observe', 'DEPTH', 'OBSERVATION', `${family.observe} → same Family`, { symbol: family.observe, summary: SUMMARY.observe, source: family.source });
          builder.edge(last, observe, 'observes');
          builder.edge(observe, state, 'interpreted', 'RETURN');
        }
      }
      if (family.records) {
        const log = builder.node('log', 'DEPTH', 'CHRONOLOGY', 'VexLogger facts', { symbol: 'VexLogger', summary: SUMMARY.chronology, source: adapter.sources.logger });
        builder.edge(launch, log, 'facts', 'SIDE');
      }
      const provider = providerFor(cat, adapter, family.name);
      if (provider && store) {
        const p = builder.node('provider', 'DEPTH', 'CONSTRUCTION', `${provider.name}(${provider.deps.join(', ')})`, { symbol: provider.name, summary: SUMMARY.provider, source: provider.source });
        builder.edge(p, `${builder.prefix}.store`, 'constructs', 'SIDE');
      }
    }
    builder.pathway.summary = family.doc ?? `${family.name} owns this meaning through State, Control, Act and Effect.`;
    builder.pathway.returns = 'Presentation derived from the returned Family truth reaches the screen.';
    pathways.set(ref, builder.pathway);
    report.bonds.push({ actionKey, closure: bond.closure, fn: bond.fn, family: family.name, control: bond.control });
    return ref;
  };


  const behaviorPortPathway = (screen, element, bond) => {
    const controlSlug = bond.control.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    const ref = `pathway.${bond.behaviorRef}.${controlSlug}`;
    if (pathways.has(ref)) return ref;
    const builder = new PathwayBuilder(ref, `${humanize(bond.behaviorRef)} · ${humanize(bond.control)}`, 'SCAE_FAMILY');

    const intent = builder.node('intent', 'BEHAVIOR', 'INTENT', 'localEffect()', {
      symbol: element.symbol,
      summary: 'The registered element delegates feature-local meaning to its custom presentation handler.',
      source: screen.source,
      code: 'intent = localEffect()',
    });
    const doorway = builder.node('doorway', 'BEHAVIOR', 'DISPATCH', `${bond.receiverType}.activate(${bond.control})`, {
      symbol: `${bond.receiverType}.activate`,
      summary: 'The visible control manifestations forward the same Family-bound Control through the UI-facing membrane.',
      source: bond.source,
    });
    const control = builder.node('control', 'BEHAVIOR', 'CONTROL', `${bond.controlType}.${bond.control}`, {
      symbol: `${bond.controlType}.${bond.control}`,
      summary: 'Family-bound semantic input.',
      source: bond.controlSource.source,
    });
    const stateLabel = bond.stateValues.length ? `${bond.stateType} · ${bond.stateValues.join(' | ')}` : bond.stateType;
    const state = builder.node('state', 'BEHAVIOR', 'STATE', `CURRENT ${stateLabel}`, {
      symbol: bond.stateType,
      summary: 'Exact current semantic truth used to resolve the Control.',
      source: bond.stateSource.source,
    });
    const act = builder.node('act', 'BEHAVIOR', 'ACT', `${bond.control} → ${bond.acts.join(' | ')}`, {
      symbol: bond.actType,
      summary: 'The Control blueprint chooses the lawful Act for exact current State.',
      source: bond.controlSource.source,
    });
    const effect = builder.node('effect', 'BEHAVIOR', 'EFFECT', bond.effects.join(' | '), {
      symbol: bond.effectType,
      summary: 'Behavior resolves the Act into the runtime transformation appropriate to current State.',
      source: bond.behavior.source,
    });
    const admitted = builder.node('admitted', 'BEHAVIOR', 'STATE', `current.${bond.admittedCall}(effect)`, {
      symbol: `${bond.stateType}.${bond.admittedCall}`,
      summary: 'Semantic State reflects admitted intent before outside observation converges.',
      source: bond.admitted.source,
    });
    const projection = builder.node('projection', 'BEHAVIOR', 'PROJECTION', bond.projectionType, {
      symbol: bond.projectionType,
      summary: 'The typed Connection publishes the Family projection.',
      source: bond.types.source,
    });
    const presentation = builder.node('presentation', 'BEHAVIOR', 'PROJECTION', `${bond.displayType} → ${humanize(bond.control)} presentation`, {
      symbol: bond.displayType,
      summary: 'The Experience derives display meaning from the returned projection without becoming semantic owner.',
      source: bond.experience.source,
    });

    let owner = null;
    if (bond.owner) {
      owner = builder.node('connection-owner', 'DEPTH', 'CONSTRUCTION', bond.owner.name, {
        symbol: bond.owner.name,
        summary: 'Lifetime owner of the concrete Connection; construction support, not semantic truth.',
        source: bond.owner.source,
      });
    }
    const connection = builder.node('connection', 'DEPTH', 'DISPATCH', `${bond.implementation.portType} / ${bond.flowAlias} → ${bond.connection.name}`, {
      symbol: bond.connection.name,
      summary: 'Typed VexPort boundary carrying the same Family / State / Control / Act coordinates into provider realization and reconciliation.',
      source: bond.connection.source,
    });
    const providerLabel = bond.connection.providerType ?? 'outside provider';
    const provider = builder.node('provider', 'DEPTH', 'STORE', providerLabel, {
      symbol: bond.connection.providerType ?? undefined,
      summary: 'Independently owned outside/runtime truth.',
      source: bond.connection.source,
    });
    const observation = builder.node('observation', 'DEPTH', 'OBSERVATION', `${bond.listenerType} → ${bond.publishObserved}()`, {
      symbol: bond.listenerType,
      summary: 'Asynchronous provider observations re-enter through the same concrete Connection.',
      source: bond.connection.source,
    });
    const reconcile = builder.node('reconcile', 'DEPTH', 'OBSERVATION', `${bond.reconcileCall}(observed, pending)`, {
      symbol: bond.reconcileCall,
      summary: 'Observed provider truth is reconciled with still-pending local intent before it may replace semantic State.',
      source: bond.reconcile.source,
    });

    builder.edge(intent, doorway, 'custom handler');
    builder.edge(doorway, control, 'same Control');
    builder.edge(state, act, 'CURRENT', 'DATA');
    builder.edge(control, act, 'resolve');
    builder.edge(act, effect, 'Behavior');
    builder.edge(effect, admitted, 'admits');
    builder.edge(admitted, projection, 'projects');
    builder.edge(projection, presentation, 'display');
    builder.edge(doorway, connection, 'forwards typed Control');
    if (owner) builder.edge(owner, connection, 'owns', 'SIDE');
    builder.edge(effect, connection, 'realize');
    builder.edge(connection, provider, 'provider');
    builder.edge(provider, observation, 'callback');
    builder.edge(observation, reconcile, 'observed');
    builder.edge(reconcile, state, 'reconciled', 'RETURN');
    builder.edge(reconcile, projection, 'publishes', 'RETURN');

    builder.pathway.summary = `${bond.familyType} owns ${bond.control} meaning; the typed Connection realizes and reconciles outside truth back into the same Family projection.`;
    builder.pathway.returnRef = presentation;
    builder.pathway.returns = `The returned ${bond.projectionType} / ${bond.displayType} reaches the same human-facing control.`;
    pathways.set(ref, builder.pathway);
    report.bonds.push({ elementRef: element.ref, via: 'BEHAVIOR_PORT', family: bond.familyType, control: bond.control });
    return ref;
  };

  const directPathway = (actionKey, registration) => {
    const ref = `pathway.${actionKey.replace(/^action\./, '')}`;
    const builder = new PathwayBuilder(ref, humanize(registration.actionName), 'DIRECT_REGISTRATION');
    const intent = builder.node('intent', 'BEHAVIOR', 'INTENT', `invoke(AppActions.${registration.actionName})`, { symbol: actionKey, summary: 'Application action key.', source: adapter.sources.appActions });
    const runtime = builder.node('runtime', 'BEHAVIOR', 'DISPATCH', 'VexRuntime → AppActionRegistrations.dispatch', { symbol: 'ElementIntent.Invoke', summary: SUMMARY.runtime, source: adapter.sources.runtime });
    const reg = builder.node('registration', 'BEHAVIOR', 'DISPATCH', registration.code ? `appAction(${registration.actionName}) { ${registration.code} }` : `appAction(${registration.actionName}) { }`, { symbol: registration.symbol, summary: registration.code ? 'Calls the rightful owners directly. No Act, no Effect.' : (registration.comment ?? 'No product effect yet.'), source: registration.source });
    builder.edge(intent, runtime, 'Invoke');
    builder.edge(runtime, reg, 'dispatch');
    const receivers = [...new Set([...(registration.code ?? '').matchAll(/\b([a-z]\w*)\.\w+\(/g)].map((match) => match[1]))];
    for (const receiver of receivers) {
      const expression = registration.locals.get(receiver) ?? null;
      const paramType = registration.params.get(receiver) ?? null;
      if (!expression && paramType) {
        const role = /Logger/.test(paramType) ? 'CHRONOLOGY' : /Repository|Store|Persistence|Queue/.test(paramType) ? 'STORE' : 'DISPATCH';
        const owner = builder.node(`owner-${receiver}`, role === 'DISPATCH' ? 'BEHAVIOR' : 'DEPTH', role, paramType, { symbol: receiver, summary: role === 'STORE' ? 'Outside truth this registration touches.' : 'Collaborator passed into the registration.', source: registration.source });
        builder.edge(reg, owner, 'calls');
        continue;
      }
      if (!expression) continue;
      const ctor = /^([A-Z]\w*)\(/.exec(expression);
      if (ctor) {
        const controller = builder.node(`calls-${receiver}`, 'BEHAVIOR', 'DISPATCH', ctor[1], { symbol: receiver, summary: 'Feature-owned controller built inside the registrations.', source: registration.source, code: expression });
        builder.edge(reg, controller, 'calls');
        for (const dep of expression.matchAll(/context\.((?:repositories\.)?\w+)/g)) {
          const store = builder.node(`dep-${dep[1].replace(/\W+/g, '-')}`, 'DEPTH', 'STORE', dep[1], { symbol: dep[1], summary: 'Normal feature truth the controller writes through.', source: registration.source });
          builder.edge(controller, store, 'writes');
        }
        continue;
      }
      const context = /^context\.([\w.]+)$/.exec(expression);
      if (!context) continue;
      const fieldName = context[1].split('.')[0];
      const type = context[1].startsWith('repositories.') ? context[1] : fields.get(fieldName) ?? context[1];
      const role = /Logger/.test(type) ? 'CHRONOLOGY' : 'STORE';
      const owner = builder.node(`owner-${receiver}`, 'DEPTH', role, type, { symbol: `context.${context[1]}`, summary: role === 'CHRONOLOGY' ? 'In-session chronology.' : 'Outside truth this registration touches.', source: adapter.sources.screenActionContext });
      builder.edge(reg, owner, 'calls');
    }
    builder.pathway.summary = registration.code ? 'The registration calls owners directly; no Family has earned this meaning yet.' : 'Registered, with no product effect yet.';
    pathways.set(ref, builder.pathway);
    return ref;
  };

  const elementFromIntent = (element, intentExpression, ownerKey, screen, localRefs) => {
    if (!intentExpression) return element;
    element.intent = intentExpression;
    const steps = parseIntent(intentExpression);
    const invoke = steps.find((step) => step.op === 'invoke');
    if (invoke) {
      const actionName = invoke.arg.replace(/^AppActions\./, '');
      const actionKey = actions.get(actionName) ?? null;
      element.actionKey = actionKey;
      const registration = registrations.get(actionName);
      if (!actionKey || !registration) { report.held.push({ elementRef: element.ref, reason: `no registration for ${invoke.arg}` }); return element; }
      registration.actionName = actionName;
      element.call = registration.code || registration.comment || null;
      const pathwayRef = `pathway.${actionKey.replace(/^action\./, '')}`;
      if (pathways.has(pathwayRef)) { element.pathwayRef = pathwayRef; return element; }
      const bare = /^(\w+)\(\)$/.exec(registration.code ?? '');
      const closureName = bare ? (registration.locals.get(bare[1])?.match(/^context\.(\w+)$/)?.[1] ?? null) : null;
      const bond = closureName && /->/.test(fields.get(closureName) ?? '') ? followClosure(cat, adapter, closureName) : null;
      element.pathwayRef = (bond?.family ? familyPathway(actionKey, registration, bond) : null) ?? directPathway(actionKey, registration);
      return element;
    }
    if (screen && steps.length === 1 && steps[0].op === 'localEffect') {
      const bond = followBehaviorPort(cat, adapter, screen, element);
      if (bond) {
        element.pathwayRef = behaviorPortPathway(screen, element, bond);
        return element;
      }
    }
    const nav = steps.find((step) => step.op === 'navigateTo');
    if (nav) element.navigatesTo = screenRefOf(nav.arg) ?? undefined;
    if (steps.some((step) => step.op === 'navigateBack')) element.navigatesTo = 'BACK';
    const target = steps.length === 1 && ['open', 'close', 'toggle'].includes(steps[0].op) ? steps[0].arg.replace(/^Elements\./, '') : null;
    const targetRef = target ? localRefs.get(target) ?? null : null;
    const renderer = target && screen?.text ? (() => {
      const match = new RegExp(`isOpen\\(\\s*${escapeRegex(screen.object)}\\.${escapeRegex(target)}\\s*\\)\\s*\\)\\s*\\{\\s*(\\w+)\\(`).exec(screen.text);
      if (!match) return null;
      const open = screen.text.indexOf('(', match.index + match[0].length - 1);
      const args = splitArgs(screen.text.slice(open + 1, matchClose(screen.text, open)));
      return { name: match[1], stores: args.filter((arg) => /repository|store/i.test(arg.name ?? '')).map((arg) => arg.value) };
    })() : null;
    element.pathwayRef = typedPathway(ownerKey, steps, {
      pathwayLabel: nav ? (steps.length > 1 ? 'Close options, then navigate' : 'Navigate') : steps[0].op === 'navigateBack' ? 'Back' : `${humanize(steps[0].op)} ${humanize(target ?? '')}`.trim(),
      targetLocal: target,
      targetRef,
      renderer,
      source: screen?.source ?? adapter.sources.appShell,
    });
    return element;
  };

  /* chrome */
  const chromeConfig = adapter.chrome;
  const chromeElements = [];
  if (chromeConfig) {
    const shell = cat.read(adapter.sources.appShell).text;
    const objects = new Map();
    for (const match of shell.matchAll(/object\s+(\w+)\s*:\s*(\w+)Element\(/g)) {
      const open = match.index + match[0].length - 1;
      const args = splitArgs(shell.slice(open + 1, matchClose(shell, open)));
      objects.set(match[1], { name: match[1], cls: match[2], id: stringArg(args), labelRes: named(args, 'labelRes'), intent: named(args, 'intent'), style: named(args, 'style') });
    }
    const localRefs = new Map([...objects.values()].map((object) => [object.name, object.id]));
    const blueprint = blockAfter(shell, /val\s+blueprint\s*=\s*column\(\s*Elements\.(\w+)\s*\)\s*\{/);
    const rootName = /val\s+blueprint\s*=\s*column\(\s*Elements\.(\w+)/.exec(shell)?.[1];
    const kindOf = (object) => chromeConfig.kinds?.[object.id] ?? ({ Column: 'COLUMN', Row: 'ROW', Stack: 'STACK', Image: 'IMAGE', Text: 'TEXT', Button: 'BUTTON', Fab: /FabOption/.test(object.style ?? '') ? 'MENU_ITEM' : 'FAB' })[object.cls] ?? 'REGION';
    const walk = (body, parentRef) => {
      for (const call of topLevelCalls(body)) {
        const name = /Elements\.(\w+)/.exec(call.args)?.[1];
        const object = name ? objects.get(name) : null;
        if (!object) continue;
        const element = {
          ref: object.id,
          kind: kindOf(object),
          label: chromeConfig.labels?.[object.id] ?? textOf(object.labelRes, object.name),
          parentRef,
          symbol: `AppShell.Elements.${object.name}`,
          labelRes: object.labelRes ?? undefined,
          slot: chromeConfig.slots?.[object.id],
          visibleWhen: chromeConfig.visibleWhen?.[object.id],
          alwaysVisible: chromeConfig.alwaysVisible?.includes(object.id) || undefined,
        };
        elementFromIntent(element, object.intent, 'shell', null, localRefs);
        chromeElements.push(element);
        if (call.body) walk(call.body, element.ref);
      }
    };
    if (blueprint) walk(blueprint.body, rootName && chromeConfig.includeRoot ? objects.get(rootName).id : null);
  }

  /* screens */
  const screens = [];
  for (const [object, kind] of placement) {
    const screen = screenObjects.get(object);
    if (!screen) { report.held.push({ screen: object, reason: 'screen source not found' }); continue; }
    screen.source = toRootRef(adapter, screen.path);
    const prefix = `element.${screen.screenKey}`;
    const localRefs = new Map([...screen.refs.values()].map((ref) => [ref.name, ref.id ? `${prefix}.${ref.id}` : null]));
    const elements = [];
    const build = (body, parentPath, parentRef) => {
      for (const call of topLevelCalls(body)) {
        const kind = LAYOUT_KINDS[call.name];
        if (!kind) {
          if (call.body) build(call.body, parentPath, parentRef);
          else if (!/^(VexElementStyles|R|TextRole|ElementIcon)\b/.test(call.name)) report.unknownCalls.push({ screen: screen.screenKey, call: call.name });
          continue;
        }
        const args = splitArgs(call.args);
        const refName = named(args, 'element') ?? args.find((arg) => !arg.name && /^[A-Z]\w*$/.test(arg.value))?.value ?? null;
        const decl = refName ? screen.refs.get(refName) : null;
        const localId = decl?.id ?? named(args, 'id')?.replace(/^"|"$/g, '') ?? stringArg(args);
        if (!localId) { report.unknownCalls.push({ screen: screen.screenKey, call: `${call.name} without id` }); continue; }
        const relative = decl ? decl.id : parentPath ? `${parentPath}.${localId}` : localId;
        const labelRes = decl?.labelRes ?? named(args, 'textRes') ?? named(args, 'labelRes');
        const element = {
          ref: `${prefix}.${relative}`,
          kind: decl ? (REF_KINDS[decl.fn] ?? kind) : kind,
          label: textOf(labelRes, localId.split('.').at(-1)),
          parentRef,
          symbol: decl ? `${screen.object}.${decl.name}` : undefined,
          declared: decl ? `${decl.fn}(id = "${decl.id}")` : `${call.name}("${localId}")`,
          labelRes: labelRes ?? undefined,
          textRole: kind === 'TEXT' ? named(args, 'role')?.replace(/^TextRole\./, '').toUpperCase() : undefined,
        };
        if (kind === 'SHEET' || kind === 'DIALOG') element.visibleWhen = `runtime.presentation.isOpen(${refName ?? localId})`;
        elementFromIntent(element, decl?.intent, screen.screenKey, screen, localRefs);
        elements.push(element);
        if (call.body) build(call.body, relative, element.ref);
      }
    };
    if (screen.layout) build(screen.layout, '', null);
    const pathwayCount = elements.filter((element) => element.pathwayRef).length;
    screens.push({
      screenRef: `screen.${screen.screenKey}`,
      label: screen.titleRes ? textOf(screen.titleRes, screen.object.replace(/Screen$/, '')) : humanize(screen.object.replace(/Screen$/, '')),
      placement: kind,
      symbol: screen.object,
      source: screen.source,
      mapped: elements.length ? 'MAPPED' : (chromeConfig?.appliesTo === kind ? 'CHROME_ONLY' : 'HELD'),
      summary: [screen.doc, screen.customRender ? 'Renders custom content over its registered element tree; the tree shows the registered identities.' : null, !elements.length ? 'No registered element tree was found in source.' : null].filter(Boolean).join(' ') || `${pathwayCount} traced controls.`,
      elements,
    });
    report.elements += elements.length;
  }
  report.screens = screens.length;
  report.elements += chromeElements.length;

  const clean = (value) => JSON.parse(JSON.stringify(value));
  let lens = {
    schemaVersion: 'vexboard.screen-lens/v1',
    lensRef: adapter.lensRef,
    title: adapter.title,
    summary: adapter.summary ?? null,
    entryScreenRef: adapter.entry?.screenRef ?? screens[0]?.screenRef,
    entryElementRef: adapter.entry?.elementRef ?? null,
    relatedBoardRefs: adapter.relatedBoardRefs ?? [],
    sourceSnapshot: {
      repositoryRef: adapter.repository.ref ?? null,
      repositoryUrl: adapter.repository.url,
      commit: adapter.repository.commit,
      observedAt,
      roots: adapter.repository.roots,
      notes: [
        `Generated by ${ADAPTER_VERSION} from ${adapter.repository.url} @ ${adapter.repository.commit.slice(0, 7)}. Regenerate it; do not edit by hand.`,
        `Element refs follow the layout DSL: element.<screenKey>.<declared or nested id>. Visible text comes from ${(adapter.stringResources ?? []).join(', ') || 'string resource names'} (default locale).`,
        ...(adapter.notes ?? []),
      ],
    },
    chrome: chromeConfig ? [{ chromeRef: chromeConfig.chromeRef, label: chromeConfig.label, symbol: chromeConfig.symbol, source: adapter.sources.appShell, appliesTo: chromeConfig.appliesTo, summary: chromeConfig.summary, elements: chromeElements }] : [],
    screens,
    pathways: [...pathways.values()],
    annotations: [],
  };
  lens = clean(lens);
  if (overlay) lens = applyOverlay(lens, overlay);
  report.pathways = lens.pathways.length;
  return { lens, report };
}

/* ---------- overlay: human knowledge merged over generated structure ---------- */

export function applyOverlay(lensInput, overlay) {
  if (!overlay || overlay.schemaVersion !== SCREEN_LENS_OVERLAY_SCHEMA) fail(`overlay schemaVersion must be ${SCREEN_LENS_OVERLAY_SCHEMA}`);
  const lens = JSON.parse(JSON.stringify(lensInput));
  const misses = [];
  const assign = (target, patch) => { for (const [key, value] of Object.entries(patch)) target[key] = value; };
  for (const [ref, patch] of Object.entries(overlay.screens ?? {})) {
    const screen = lens.screens.find((candidate) => candidate.screenRef === ref);
    if (screen) assign(screen, patch); else misses.push(ref);
  }
  const allElements = [...lens.chrome.flatMap((entry) => entry.elements), ...lens.screens.flatMap((screen) => screen.elements)];
  for (const [ref, patch] of Object.entries(overlay.elements ?? {})) {
    const element = allElements.find((candidate) => candidate.ref === ref);
    if (element) assign(element, patch); else misses.push(ref);
  }
  for (const [ref, patch] of Object.entries(overlay.pathways ?? {})) {
    const pathway = lens.pathways.find((candidate) => candidate.pathwayRef === ref);
    if (!pathway) { misses.push(ref); continue; }
    const { addNodes = [], addEdges = [], removeEdges = [], nodes = {}, ...fields } = patch;
    assign(pathway, fields);
    for (const [nodeRef, nodePatch] of Object.entries(nodes)) {
      const node = pathway.nodes.find((candidate) => candidate.ref === nodeRef);
      if (node) assign(node, nodePatch); else misses.push(nodeRef);
    }
    pathway.nodes.push(...addNodes);
    pathway.edges = pathway.edges.filter((edge) => !removeEdges.some((remove) => remove.from === edge.from && remove.to === edge.to));
    pathway.edges.push(...addEdges);
  }
  lens.annotations = [...lens.annotations, ...(overlay.notes ?? [])];
  if (overlay.summary) lens.summary = overlay.summary;
  if (misses.length) fail(`overlay targets refs the generated lens does not have: ${misses.join(', ')}`);
  return lens;
}

// [VXG RealForever][VEXWORK][VEXBOARD][SCREEN-LENS][ANDROID-ADAPTER]
