// Kotlin source text reading shared by the Screen Lens readers.
//
// Just enough Kotlin to read VexLife's regular DSL and realization idioms: balanced brackets that
// respect strings and comments, top-level argument splitting, top-level call discovery and the
// first KDoc paragraph above a declaration. It never executes or type-checks source.
//
// Pure: no file system, network or clock access.

export function skipLiteralOrComment(text, i) {
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
  if (!closer) throw new TypeError(`kotlin source: matchClose needs an opening bracket at ${open}`);
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
  throw new TypeError(`kotlin source: unbalanced ${opener} at ${open}`);
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
export function splitArgs(text, { withRaw = false } = {}) {
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
    return named ? { name: named[1], value: compact(named[2]), raw: named[2] } : { name: null, value: compact(part), raw: part };
  }).map(({ raw, ...arg }) => (withRaw ? { ...arg, raw } : arg));
}

// Same split, keeping each value's original line structure beside its compact form. A newline
// ends a Kotlin statement, so code inside a lambda argument must be read from `raw`, never `value`.
export function splitArgsRaw(text) {
  return splitArgs(text, { withRaw: true });
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

// [VXG RealForever][VEXWORK][VEXBOARD][KOTLIN-SOURCE]