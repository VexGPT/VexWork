// Android realization reader for the Screen Lens.
//
// The Screen Lens adapter already projects REGISTRATION (ScreenBlueprint element trees). For a
// Screen that renders custom content, that tree is a semantic manifest, not the visible body. This
// module reads the REALIZATION relationships current source already expresses:
//
//   which registered or runtime coordinate becomes presentation, and why it is or is not present.
//
// It recognizes only reusable vocabulary:
//
//   Kotlin control flow          if / else, when, ?.let
//   VexRuntime presentation API  presentation.isOpen(X), presentation.selected(Container)
//   Vex presentation primitives  learned from the elements module's own `fun Vex*` signatures:
//                                  element = …   registered element realization
//                                  id = "…"      local slot beneath the inherited Vex parent
//                                  parent/parentRef  VexComposeScope semantic parent
//                                  listRef + items + itemRef   stable repeated population
//                                  presentationRef             anchored presentation
//   Compose lazy list            items(items = …, key = …)  (repeated, but without list identity)
//   Compose / Android boundary   AndroidView and other non-Vex calls stay opaque
//
// It must never learn product nouns. Feature meaning stays in feature source; expressions that
// decide feature meaning are carried verbatim and left uninterpreted.
//
// Pure: inputs are keyed collections of repo-relative path -> text and small resolver callbacks. No file system,
// network or clock access, so the build script and the in-browser commit projection agree.

import { matchClose, splitArgs, splitArgsRaw, stripComments, kdocBefore } from './vexboard-kotlin-source.mjs';

export const REALIZATION_READER_VERSION = 'vexlife-android-realization/1';

export const PRESENCE_KINDS = Object.freeze({
  PRESENTATION: 'Opened or closed by VexRuntime presentation state (isOpen).',
  SELECTION: 'One child of a swappable container is selected by VexRuntime presentation state.',
  POPULATION: 'Repeated once per item of a source-owned collection; an empty alternative may realize instead.',
  BRANCH: 'A feature-owned condition decides whether this realizes. The expression is source text, not interpreted here.',
  CASES: 'A feature-owned subject chooses one of several realizations. The cases are source text, not interpreted here.',
  ALTERNATIVE: 'One slot realizes exactly one of several alternatives (for example a value or its fallback).',
});

const MAX_DEPTH = 14;
const KOTLIN_KEYWORDS = new Set(['if', 'else', 'when', 'for', 'while', 'do', 'return', 'val', 'var', 'fun', 'try', 'catch', 'finally', 'object', 'class', 'is', 'in', 'as', 'null', 'true', 'false', 'this', 'super', 'throw', 'break', 'continue']);

/* ---------- Kotlin text reading ---------- */

function skipTrivia(text, i) {
  for (;;) {
    while (i < text.length && /\s/.test(text[i])) i += 1;
    if (text.startsWith('//', i)) { const end = text.indexOf('\n', i); i = end < 0 ? text.length : end; continue; }
    if (text.startsWith('/*', i)) { const end = text.indexOf('*/', i + 2); i = end < 0 ? text.length : end + 2; continue; }
    return i;
  }
}

// Same-line trivia only: used to decide whether an expression continues.
function skipInlineTrivia(text, i) {
  while (i < text.length && (text[i] === ' ' || text[i] === '\t')) i += 1;
  return i;
}

function skipString(text, i) {
  if (text.startsWith('"""', i)) { const end = text.indexOf('"""', i + 3); return end < 0 ? text.length : end + 3; }
  const quote = text[i];
  let j = i + 1;
  while (j < text.length && text[j] !== quote) j += text[j] === '\\' ? 2 : 1;
  return j + 1;
}

const compactText = (value) => stripComments(String(value ?? '')).replace(/\s+/g, ' ').replace(/\(\s+/g, '(').replace(/\s+\)/g, ')').replace(/,\s*\)/g, ')').replace(/\s*(\?\.|\.)\s*(?=[A-Za-z_])/g, '$1').trim();
const identAt = (text, i) => /^[A-Za-z_][\w]*/.exec(text.slice(i, i + 200))?.[0] ?? null;
const wordAt = (text, i, word) => text.startsWith(word, i) && !/[\w]/.test(text[i + word.length] ?? '') && (i === 0 || !/[\w.]/.test(text[i - 1]));

// One expression starting at i: identifier chains, ?. / !! / . segments, balanced groups, trailing
// lambdas and binary-operator continuations. Stops at a statement boundary.
function readExpression(text, start) {
  let i = skipTrivia(text, start);
  const begin = i;
  let lastLine = i;
  for (;;) {
    if (i >= text.length) break;
    const c = text[i];
    if (c === '"' || c === "'") { i = skipString(text, i); continue; }
    if (c === '(' || c === '[') { i = matchClose(text, i) + 1; continue; }
    if (c === '{') {
      // A lambda belongs to this expression only directly after a call/identifier on the same logical line.
      i = matchClose(text, i) + 1; continue;
    }
    if (/[\w.!?@:]/.test(c) && !(c === ':' && text[i + 1] !== ':')) {
      if (c === '?' && text[i + 1] === ':') { i = skipTrivia(text, i + 2); continue; }
      i += 1; continue;
    }
    if (c === ' ' || c === '\t') {
      const j = skipInlineTrivia(text, i);
      if (wordAt(text, j, 'else') && text[i - 1] === '}') { i = skipTrivia(text, j + 4); continue; }
      const operator = /^(&&|\|\||==|!=|<=|>=|\?:|[+\-*/%<>](?!>)|as\b|is\b|in\b|!in\b|!is\b|to\b|\.\.)/.exec(text.slice(j, j + 4));
      if (operator) { i = skipTrivia(text, j + operator[0].length); continue; }
      if (text[j] === '{' || text[j] === '(') { i = j; continue; }
      if (/[=]/.test(text[j]) && text[j + 1] !== '=') break;
      const word = identAt(text, j);
      if (word && /^(and|or|until|downTo|step|xor|shl|shr)$/.test(word)) { i = j; continue; }
      break;
    }
    if (c === '\n' || c === '\r') {
      const j = skipTrivia(text, i);
      if (wordAt(text, j, 'else') && text.slice(0, i).trimEnd().endsWith('}')) { i = skipTrivia(text, j + 4); continue; }
      const operator = /^(\?\.|\?:|&&|\|\||==|!=|\.|\+|-(?!>)|\*|\/)/.exec(text.slice(j, j + 3));
      if (operator) { i = operator[0] === '.' || operator[0] === '?.' ? j : skipTrivia(text, j + operator[0].length); continue; }
      break;
    }
    if (/^(&&|\|\||==|!=|<=|>=|\?:)/.test(text.slice(i, i + 2)) || /[+\-*/%<>!]/.test(c)) {
      if (c === '-' && text[i + 1] === '>') break;
      const width = /^(&&|\|\||==|!=|<=|>=|\?:)/.test(text.slice(i, i + 2)) ? 2 : 1;
      i = skipTrivia(text, i + width); continue;
    }
    break;
  }
  lastLine = i;
  return { text: text.slice(begin, lastLine), start: begin, end: lastLine };
}

// Statements of one Kotlin block body, reduced to the shapes realization needs.
export function parseKotlinBlock(text) {
  const nodes = [];
  let i = 0;
  while (i < text.length) {
    i = skipTrivia(text, i);
    if (i >= text.length) break;
    const c = text[i];
    if (c === ';' || c === ',') { i += 1; continue; }
    if (c === '"' || c === "'") { i = skipString(text, i); continue; }
    if (c === '@') { const w = /^@\w+(\([^)]*\))?/.exec(text.slice(i)); i += w ? w[0].length : 1; continue; }
    if (wordAt(text, i, 'if')) { const parsed = parseIf(text, i); nodes.push(parsed.node); i = parsed.end; continue; }
    if (wordAt(text, i, 'when')) { const parsed = parseWhen(text, i); if (parsed) { nodes.push(parsed.node); i = parsed.end; continue; } }
    if (wordAt(text, i, 'val') || wordAt(text, i, 'var')) { const parsed = parseBinding(text, i); if (parsed.node) nodes.push(parsed.node); i = parsed.end; continue; }
    if (wordAt(text, i, 'return') || wordAt(text, i, 'throw')) { const expr = readExpression(text, i + 6); i = Math.max(expr.end, i + 6); continue; }
    if (wordAt(text, i, 'fun') || wordAt(text, i, 'class') || wordAt(text, i, 'object')) { const open = text.indexOf('{', i); const nl = text.indexOf('\n', i); if (open >= 0 && (nl < 0 || open < text.indexOf('\n', nl + 1) + 200)) { i = matchClose(text, open) + 1; } else i = nl < 0 ? text.length : nl; continue; }
    if (/[A-Za-z_(]/.test(c)) {
      const expr = readExpression(text, i);
      if (expr.end <= i) { i += 1; continue; }
      const node = expressionNode(expr.text);
      if (node) nodes.push(node);
      i = expr.end;
      continue;
    }
    if (c === '{') { const close = matchClose(text, i); nodes.push(...parseKotlinBlock(text.slice(i + 1, close))); i = close + 1; continue; }
    i += 1;
  }
  return nodes;
}

function branchBody(text, start) {
  const i = skipTrivia(text, start);
  if (text[i] === '{') {
    const close = matchClose(text, i);
    return { nodes: parseKotlinBlock(text.slice(i + 1, close)), end: close + 1 };
  }
  const expr = readExpression(text, i);
  const node = expressionNode(expr.text);
  return { nodes: node ? [node] : [], end: Math.max(expr.end, i + 1) };
}

function parseIf(text, start) {
  const alternatives = [];
  let i = start;
  let exhaustive = false;
  for (;;) {
    const open = text.indexOf('(', i);
    const close = matchClose(text, open);
    const condition = compactText(text.slice(open + 1, close));
    const body = branchBody(text, close + 1);
    alternatives.push({ condition, nodes: body.nodes });
    i = body.end;
    const after = skipTrivia(text, i);
    if (!wordAt(text, after, 'else')) break;
    const next = skipTrivia(text, after + 4);
    if (wordAt(text, next, 'if')) { i = next; continue; }
    const tail = branchBody(text, next);
    alternatives.push({ condition: 'else', nodes: tail.nodes });
    exhaustive = true;
    i = tail.end;
    break;
  }
  return { node: { type: 'BRANCH', form: 'IF', subject: null, alternatives, exhaustive }, end: i };
}

function parseWhen(text, start) {
  let i = skipTrivia(text, start + 4);
  let subject = null;
  if (text[i] === '(') {
    const close = matchClose(text, i);
    subject = compactText(text.slice(i + 1, close)).replace(/^val\s+\w+\s*=\s*/, '');
    i = skipTrivia(text, close + 1);
  }
  if (text[i] !== '{') return null;
  const close = matchClose(text, i);
  const body = text.slice(i + 1, close);
  const alternatives = [];
  let j = 0;
  while (j < body.length) {
    j = skipTrivia(body, j);
    while (body[j] === ';') j = skipTrivia(body, j + 1);
    if (j >= body.length) break;
    // condition: everything up to the top-level "->"
    let k = j;
    while (k < body.length && !(body[k] === '-' && body[k + 1] === '>')) {
      const c = body[k];
      if (c === '"' || c === "'") { k = skipString(body, k); continue; }
      if ('([{'.includes(c)) { k = matchClose(body, k) + 1; continue; }
      k += 1;
    }
    if (k >= body.length) break;
    const condition = compactText(body.slice(j, k));
    const entry = branchBody(body, k + 2);
    alternatives.push({ condition, nodes: entry.nodes });
    j = entry.end;
  }
  const exhaustive = alternatives.some((alt) => alt.condition === 'else') || Boolean(subject);
  return { node: { type: 'BRANCH', form: subject ? 'WHEN_SUBJECT' : 'WHEN', subject, alternatives, exhaustive }, end: close + 1 };
}

function parseBinding(text, start) {
  let i = skipTrivia(text, start + 3);
  const name = identAt(text, i);
  if (!name) return { node: null, end: i + 1 };
  i += name.length;
  // optional type
  i = skipTrivia(text, i);
  if (text[i] === ':') {
    i += 1;
    while (i < text.length && !/[=\n]/.test(text[i]) && !wordAt(text, i, 'by')) {
      if (text[i] === '<' || text[i] === '(') { i = matchClose(text, text[i] === '<' ? i : i) + 1; continue; }
      i += 1;
    }
  }
  i = skipTrivia(text, i);
  let delegated = false;
  if (wordAt(text, i, 'by')) { delegated = true; i += 2; } else if (text[i] === '=') i += 1;
  else return { node: { type: 'BIND', name, expr: null, delegated }, end: i };
  const expr = readExpression(text, i);
  // A binding expression can itself contain realization (val content = @Composable { … }) — rare; keep it simple.
  return { node: { type: 'BIND', name, expr: compactText(expr.text), delegated }, end: Math.max(expr.end, i + 1) };
}

function topLevelSplit(text, separator) {
  const parts = [];
  let start = 0;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (c === '"' || c === "'") { i = skipString(text, i) - 1; continue; }
    if ('([{'.includes(c)) { i = matchClose(text, i); continue; }
    if (text.startsWith(separator, i)) { parts.push(text.slice(start, i).trim()); start = i + separator.length; i += separator.length - 1; }
  }
  parts.push(text.slice(start).trim());
  return parts.filter(Boolean);
}

// `receiver?.let {` where `?.let` sits at bracket depth 0 of this statement (not inside an argument
// or a nested lambda). Returns a match-like [prefixWithBrace, receiver] or null.
function topLevelLet(text) {
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (c === '"' || c === "'") { i = skipString(text, i) - 1; continue; }
    if ('([{'.includes(c)) { i = matchClose(text, i); continue; }
    const tail = /^\?\.\s*(let|also|run)\s*\{/.exec(text.slice(i, i + 24));
    if (tail) return [text.slice(0, i + tail[0].length), text.slice(0, i)];
  }
  return null;
}

// A call-shaped statement: head(args) { lambda } with an optional receiver/let chain.
function expressionNode(raw) {
  const text = raw.trim();
  if (!text) return null;
  // receiver?.let { … } and receiver?.also { … } realize only when the receiver is non-null.
  const letMatch = topLevelLet(text);
  if (letMatch) {
    const open = letMatch[0].length - 1;
    const close = matchClose(text, open);
    let lambda = text.slice(open + 1, close);
    const param = /^\s*(\w+)\s*->/.exec(lambda);
    if (param) lambda = lambda.slice(param[0].length);
    return { type: 'BRANCH', form: 'LET', subject: compactText(letMatch[1]), param: param?.[1] ?? 'it', alternatives: [{ condition: `${compactText(letMatch[1])} != null`, nodes: parseKotlinBlock(lambda) }], exhaustive: false };
  }
  const head = /^([A-Za-z_][\w]*(?:\s*\.\s*[A-Za-z_][\w]*)*)\s*/.exec(text);
  if (!head) return null;
  const name = head[1].replace(/\s+/g, '');
  if (KOTLIN_KEYWORDS.has(name)) return null;
  let i = head[0].length;
  let args = null;
  if (text[i] === '(') { const close = matchClose(text, i); args = text.slice(i + 1, close); i = skipTrivia(text, close + 1); }
  let lambda = null;
  let lambdaParam = null;
  if (text[i] === '{') {
    const close = matchClose(text, i);
    lambda = text.slice(i + 1, close);
    const param = /^\s*(\(?[\w\s,]+\)?)\s*->/.exec(lambda);
    if (param && !/[=(]/.test(param[1].replace(/^\(|\)$/g, ''))) { lambdaParam = param[1].trim(); lambda = lambda.slice(param[0].length); }
  }
  if (args === null && lambda === null) return { type: 'REF', name, text: compactText(text) };
  return { type: 'CALL', name, args: args === null ? [] : splitArgsRaw(args), rawArgs: args ?? '', lambda: lambda === null ? null : parseKotlinBlock(lambda), lambdaParam, text: compactText(text) };
}

/* ---------- source catalog: composables and Vex primitives ---------- */

function paramList(text) {
  const params = [];
  for (const arg of splitArgs(text)) {
    const match = /^(?:(?:vararg|noinline|crossinline)\s+)?(\w+)\s*:\s*([\s\S]+?)(?:\s*=\s*([\s\S]+))?$/.exec(arg.name ? `${arg.name}=${arg.value}` : arg.value);
    if (match) params.push({ name: match[1], type: compactText(match[2]), defaultValue: match[3] ? compactText(match[3]) : null });
  }
  return params;
}

// Every @Composable function body in the given files.
export function composableIndex(files) {
  const index = new Map();
  for (const [path, text] of [...files.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    if (!path.endsWith('.kt') || !text.includes('@Composable')) continue;
    const pattern = /@Composable\s+(?:@\w+(?:\([^)]*\))?\s+)*((?:(?:internal|private|public|protected|override|inline|actual)\s+)*)fun\s+(?:<[^>]*>\s*)?(?:([\w.<>?, ]+)\.)?(\w+)\s*\(/g;
    for (const match of text.matchAll(pattern)) {
      const open = match.index + match[0].length - 1;
      let close;
      try { close = matchClose(text, open); } catch { continue; }
      const after = /^\s*(?::\s*[\w.<>?, ]+?)?\s*([{=])/.exec(text.slice(close + 1));
      if (!after || after[1] !== '{') continue;
      const bodyOpen = close + 1 + after[0].length - 1;
      let bodyClose;
      try { bodyClose = matchClose(text, bodyOpen); } catch { continue; }
      const name = match[3];
      const entry = {
        name,
        path,
        modifiers: match[1].trim(),
        receiver: match[2] ?? null,
        params: paramList(text.slice(open + 1, close)),
        body: text.slice(bodyOpen + 1, bodyClose),
        start: match.index,
        doc: kdocBefore(text, match.index),
      };
      if (!index.has(name)) index.set(name, []);
      index.get(name).push(entry);
    }
  }
  return index;
}

// Vex presentation primitives are learned from their own declarations: the parameter names say
// what relationship each primitive carries.
export function primitiveCatalog(files, isPrimitiveSource) {
  const primitives = new Map();
  for (const [path, text] of files) {
    if (!path.endsWith('.kt') || !isPrimitiveSource(path)) continue;
    for (const match of text.matchAll(/(?:^|\n)\s*(?:@\w+\s+)*(?:(?:internal|public|inline)\s+)*fun\s+(?:<[^>]*>\s*)?(Vex\w+)\s*\(/g)) {
      const open = match.index + match[0].length - 1;
      let close;
      try { close = matchClose(text, open); } catch { continue; }
      const params = paramList(text.slice(open + 1, close));
      const names = new Set(params.map((param) => param.name));
      const relationship =
        names.has('listRef') && names.has('items') && names.has('itemRef') ? 'REPEAT'
          : /Scope$/.test(match[1]) && (names.has('parentRef') || names.has('parent')) ? 'SCOPE'
            : names.has('presentationRef') ? 'PRESENTATION_REF'
              : names.has('element') ? 'ELEMENT'
                : names.has('id') ? 'LOCAL'
                  : names.has('placement') ? 'TREE'
                    : 'OTHER';
      const signature = { name: match[1], path, relationship, params, hasContent: params.some((param) => /Composable/.test(param.type)) };
      const existing = primitives.get(match[1]) ?? [];
      existing.push(signature);
      primitives.set(match[1], existing);
    }
  }
  return primitives;
}

const KIND_BY_NAME = [
  [/TextField/, 'FIELD'], [/Toggle/, 'TOGGLE'], [/Fab/, 'FAB'], [/Button/, 'BUTTON'], [/BottomSheet/, 'SHEET'], [/Dialog/, 'DIALOG'],
  [/Overlay/, 'OVERLAY'], [/LazyColumn|Column/, 'COLUMN'], [/Row/, 'ROW'], [/Box/, 'STACK'], [/Card/, 'CARD'], [/Container|Tree/, 'REGION'],
  [/Icon/, 'IMAGE'], [/Text/, 'TEXT'],
];
const kindForPrimitive = (name) => KIND_BY_NAME.find(([pattern]) => pattern.test(name))?.[1] ?? 'REGION';

/* ---------- realization walk ---------- */

const named = (args, name) => args.find((arg) => arg.name === name)?.value ?? null;
// How a cell asks to be drawn, as source names it: a text role (`role = TextRole.Supporting`) and a
// typography token (`style = MaterialTheme.typography.titleMedium`). Names only; never resolved.
function appearanceOf(args) {
  const role = /(?:^|\.)(\w+)$/.exec(named(args, 'role') ?? '')?.[1] ?? null;
  const textStyle = /\btypography\s*\.\s*(\w+)$/.exec(named(args, 'style') ?? '')?.[1] ?? null;
  return { ...(role ? { role } : {}), ...(textStyle ? { textStyle } : {}) };
}
const unquote = (value) => (/^"[^"$]*"$/.test(value ?? '') ? value.slice(1, -1) : null);
const slug = (value) => String(value).replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase();

function selectedOverload(signatures, args) {
  if (!signatures?.length) return null;
  const argNames = new Set(args.filter((arg) => arg.name).map((arg) => arg.name));
  return signatures.find((sig) => [...argNames].every((name) => sig.params.some((param) => param.name === name)))
    ?? signatures.find((sig) => sig.params.some((param) => argNames.has(param.name)))
    ?? signatures[0];
}

class RealizationWalker {
  constructor({ composables, primitives, resolveRef, rootRef, toSource, screenSymbols, constants = null }) {
    this.constants = constants;
    this.composables = composables;
    this.primitives = primitives;
    this.resolveRef = resolveRef;
    this.rootRef = rootRef;
    this.toSource = toSource;
    this.screenSymbols = screenSymbols;
    this.held = [];
    this.opaque = [];
    this.templates = new Map();
    this.calls = new Set();
  }

  // Follow identifiers back through local bindings and parameters to the realization entry.
  provenance(expression, scope, limit = 9) {
    const steps = [];
    let expr = expression;
    let current = scope;
    const seen = new Map();
    while (expr && current && steps.length < limit) {
      const lead = /^\s*\(?\s*([a-z_]\w*)/.exec(expr)?.[1];
      if (!lead || seen.get(current)?.has(lead)) break;
      if (!seen.has(current)) seen.set(current, new Set());
      seen.get(current).add(lead);
      const binding = current.lookup(lead);
      if (!binding) break;
      if (binding.kind === 'LOCAL') {
        steps.push({ symbol: lead, expression: binding.expr ?? '…', via: binding.delegated ? 'by' : '=', source: binding.source });
        if (!binding.expr) break;
        const elvis = topLevelSplit(binding.expr, '?:');
        // `held ?: source`: the left side holds a snapshot; the right side names where truth comes from.
        expr = elvis.length > 1 ? elvis.at(-1) : binding.expr;
        current = binding.scope;
        continue;
      }
      if (binding.kind === 'PARAM') {
        steps.push({ symbol: lead, expression: `${lead}: ${binding.type}`, via: 'parameter', source: binding.source });
        if (binding.arg == null) break;
        steps.push({ symbol: binding.callee, expression: `${binding.callee}(${lead} = ${compactText(binding.arg)})`, via: 'call', value: compactText(binding.arg), source: binding.callSource });
        expr = binding.arg;
        current = binding.callerScope;
        continue;
      }
      if (binding.kind === 'LAMBDA') {
        steps.push({ symbol: lead, expression: `${lead} ← one item of ${binding.of}`, via: 'item', source: binding.source });
        if (!binding.of || !binding.scope) break;
        expr = binding.of;
        current = binding.scope;
        continue;
      }
      break;
    }
    return steps;
  }

  // Candidates of registered elements named inside an expression and its binding chain.
  elementCandidates(expression, scope) {
    const direct = this.resolveRef(expression);
    if (direct) return [direct];
    const texts = [expression, ...this.provenance(expression, scope).map((step) => step.expression)].map(compactText);
    const found = new Set();
    for (const text of texts) {
      for (const match of String(text).matchAll(/\b([A-Z]\w*(?:\.[A-Z]\w*)?\.[A-Z]\w*)\b(?!\s*\.\s*elementId)/g)) {
        const ref = this.resolveRef(match[1]);
        if (ref && ref.startsWith('element.')) found.add(ref);
      }
    }
    return [...found];
  }

  walk(nodes, ctx) {
    const out = [];
    for (const node of nodes) {
      const produced = this.walkNode(node, ctx);
      if (Array.isArray(produced)) out.push(...produced); else if (produced) out.push(produced);
    }
    return out;
  }

  walkNode(node, ctx) {
    if (node.type === 'BIND') {
      ctx.scope.define(node.name, { kind: 'LOCAL', expr: node.expr, delegated: node.delegated, scope: ctx.scope, source: ctx.source });
      return null;
    }
    if (node.type === 'BRANCH') return this.branch(node, ctx);
    if (node.type === 'CALL') return this.call(node, ctx);
    return null;
  }

  classifyCondition(condition, ctx) {
    const expanded = [condition, ...this.provenance(condition, ctx.scope, 3).map((step) => step.expression)].join(' ');
    const open = /presentation\s*\.\s*isOpen\(\s*([\w.]+)\s*,?\s*\)/.exec(expanded);
    if (open) return { kind: 'PRESENTATION', targetRef: this.resolveRef(open[1]), target: open[1] };
    const selected = /presentation\s*\.\s*selected\(\s*([\w.]+)\s*,?\s*\)/.exec(expanded);
    const equals = /==\s*([\w.]+?)(?:\.elementId)?\s*$/.exec(condition);
    if (selected) return { kind: 'SELECTION', containerRef: this.resolveRef(selected[1]), container: selected[1], targetRef: equals ? this.resolveRef(equals[1]) : null, target: equals?.[1] ?? null };
    return { kind: null };
  }

  branch(node, ctx) {
    const alternatives = node.alternatives.map((alt) => {
      const classified = alt.condition === 'else' ? { kind: null } : this.classifyCondition(alt.condition, ctx);
      const altScope = ctx.scope.child();
      if (node.form === 'LET') altScope.define(node.param, { kind: 'LOCAL', expr: node.subject, scope: ctx.scope, source: ctx.source });
      return { condition: alt.condition, classified, children: this.walk(alt.nodes, { ...ctx, scope: altScope }) };
    });
    // A branch matters when any alternative realizes something or names presentation state. Then every
    // alternative stays, including the ones that realize nothing: "nothing here" is part of the meaning.
    if (!alternatives.some((alt) => alt.children.length || alt.classified.kind)) return null;
    const kinds = new Set(alternatives.map((alt) => alt.classified.kind).filter(Boolean));
    let presence = 'BRANCH';
    if (kinds.has('PRESENTATION') && alternatives.length === 1) presence = 'PRESENTATION';
    else if (kinds.has('SELECTION')) presence = 'SELECTION';
    else if (node.form === 'WHEN_SUBJECT') presence = 'CASES';
    else if (node.exhaustive && alternatives.length >= 2 && alternatives.every((alt) => alt.children.length === 1 && alt.children[0].type !== 'BRANCH')) presence = 'ALTERNATIVE';
    // A selection `when` may carry non-selection guards (loading); keep each alternative's own kind.
    return { type: 'BRANCH', presence, form: node.form, subject: node.subject ?? null, exhaustive: node.exhaustive, source: ctx.source, alternatives: alternatives.map((alt) => ({ condition: alt.condition, kind: alt.classified.kind ?? null, targetRef: alt.classified.targetRef ?? null, containerRef: alt.classified.containerRef ?? null, children: alt.children })) };
  }

  modifierIdentity(args, ctx) {
    for (const arg of args) {
      if (!/\.vex(?:Element)?\(/.test(arg.value)) continue;
      const match = /\.vex(?:Element)?\(\s*([\s\S]+?)\s*,?\s*\)(?=\s*(?:\.|$))/.exec(arg.value);
      if (!match) continue;
      const expr = compactText(match[1]);
      const ref = this.resolveRef(expr) ?? this.resolveRef(this.provenance(expr, ctx.scope, 1)[0]?.expression ?? '');
      if (ref) return { ref };
      const formation = this.formationOf(expr, ctx.scope);
      // A runtime identity formed from a registered element (`rowAction(…, action = X)`) realizes X per instance.
      const via = /\(/.test(formation) ? this.elementCandidates(formation.replace(/^[^(]*\(/, '').replace(/\)$/, ''), ctx.scope) : [];
      return { dynamic: expr, formation, via };
    }
    return null;
  }

  formationOf(expr, scope) {
    const steps = this.provenance(expr, scope, 2);
    return steps.find((step) => step.via === '=' || step.via === 'by')?.expression ?? expr;
  }

  call(node, ctx) {
    const name = node.name;
    const leaf = name.split('.').pop();
    // Transparent collection iteration over a static list: realize the body once.
    if (/^(forEach|forEachIndexed|map|onEach)$/.test(leaf) && node.lambda) {
      const scope = ctx.scope.child();
      for (const param of String(node.lambdaParam ?? 'it').replace(/[()]/g, '').split(',').map((part) => part.trim()).filter(Boolean)) scope.define(param, { kind: 'LAMBDA', of: name.replace(/\.(forEach|forEachIndexed|map|onEach)$/, ''), scope: ctx.scope, source: ctx.source });
      return this.walk(node.lambda, { ...ctx, scope });
    }
    const signatures = this.primitives.get(leaf);
    if (signatures && /^Vex/.test(leaf)) return this.primitive(node, leaf, selectedOverload(signatures, node.args), ctx);
    if (leaf === 'items' && node.lambda && ctx.inLazy) return this.lazyItems(node, ctx);
    if (leaf === 'item' && node.lambda && ctx.inLazy) return this.walk(node.lambda, ctx);
    if (/^LazyColumn$|^LazyRow$/.test(leaf) && node.lambda) {
      const children = this.walk(node.lambda, { ...ctx, inLazy: true });
      const identity = this.modifierIdentity(node.args, ctx);
      return [{ type: 'LAZY', symbol: leaf, ref: identity?.ref ?? null, source: ctx.source, children }];
    }
    if (leaf === 'AndroidView') {
      this.opaque.push({ symbol: leaf, source: ctx.source, withinRef: ctx.parentRef, reason: 'native view boundary' });
      return [{ type: 'OPAQUE', symbol: leaf, reason: 'NATIVE', source: ctx.source }];
    }
    const defs = this.composables.get(leaf);
    if (defs?.length && /^[A-Z]/.test(leaf)) return this.expand(node, leaf, defs, ctx);
    // Unknown capitalized call: Compose/material or another library. Opaque, but content it is handed
    // (trailing or named lambdas) is the caller's own source and may still contain Vex realization.
    const trailingContent = node.lambda ? this.walk(node.lambda, ctx) : [];
    // Content shown only while an `expanded` argument holds (a dropdown) is a popup layer.
    const expanded = named(node.args, 'expanded');
    if (expanded) for (const child of trailingContent) child.popup ??= expanded;
    const children = [...this.lambdaArgs(node, ctx, leaf), ...trailingContent];
    const identity = this.modifierIdentity(node.args, ctx);
    if (/^[A-Z]/.test(leaf)) {
      if (identity?.ref || identity?.dynamic) return [{ type: 'SLOT', primitive: leaf, kind: kindForPrimitive(leaf), ref: identity.ref ?? null, dynamic: identity.dynamic ?? null, formation: identity.formation ?? null, oneOf: identity.via?.length ? identity.via : null, perInstance: Boolean(ctx.inTemplate), opaque: true, source: ctx.source, children }];
      if (!children.length) return [{ type: 'OPAQUE', symbol: leaf, reason: 'NON_VEX', source: ctx.source }];
      return children;
    }
    return children;
  }

  // Named content lambdas (`bottomBar = { … }`) keep the name they were handed under: it is the
  // region of the caller's layout that content occupies.
  lambdaArgs(node, ctx, call = null) {
    const out = [];
    for (const arg of node.args) {
      if (!/^\{[\s\S]*\}$/.test(arg.value)) continue;
      // Statements end at newlines: read the lambda from its original text, not the compact value.
      const text = (arg.raw ?? arg.value).trim();
      let body = text.slice(1, -1);
      const param = /^\s*(\(?[\w\s,]+\)?)\s*->/.exec(body);
      if (param) body = body.slice(param[0].length);
      const walked = this.walk(parseKotlinBlock(body), ctx);
      if (arg.name) for (const child of walked) child.region ??= { slot: arg.name, call };
      out.push(...walked);
    }
    return out;
  }

  lazyItems(node, ctx) {
    const items = named(node.args, 'items') ?? node.args.find((arg) => !arg.name)?.value ?? null;
    const key = named(node.args, 'key');
    const scope = ctx.scope.child();
    const param = String(node.lambdaParam ?? 'it').replace(/[()]/g, '').split(',').pop().trim();
    scope.define(param, { kind: 'LAMBDA', of: items, scope: ctx.scope, source: ctx.source });
    const template = this.walk(node.lambda, { ...ctx, scope, inLazy: false, inTemplate: true });
    return [{ type: 'REPEAT', primitive: 'items', listRef: null, listExpr: null, items, itemKey: key, contentType: named(node.args, 'contentType'), provenance: this.provenance(items, ctx.scope), template, empty: [], source: ctx.source }];
  }

  primitive(node, leaf, signature, ctx) {
    const relationship = signature?.relationship ?? 'OTHER';
    const args = node.args;
    if (relationship === 'REPEAT') {
      const listExpr = named(args, 'listRef');
      const items = named(args, 'items');
      const scope = ctx.scope.child();
      const param = String(node.lambdaParam ?? 'it').replace(/[()]/g, '').split(',').pop().trim();
      scope.define(param, { kind: 'LAMBDA', of: items, scope: ctx.scope, source: ctx.source });
      const emptyArg = named(args, 'emptyContent');
      const empty = emptyArg && /^\{/.test(emptyArg) ? this.walk(parseKotlinBlock(emptyArg.slice(1, -1)), ctx) : [];
      const listRef = listExpr ? (this.resolveRef(listExpr) ?? this.resolveFromChain(listExpr, ctx) ?? this.relativeRef(listExpr, ctx) ?? this.resolveConstant(listExpr)) : null;
      const template = node.lambda ? this.walk(node.lambda, { ...ctx, scope, inTemplate: true, parentRef: listRef ?? ctx.parentRef }) : [];
      // Other content lambdas the list is handed (a header) realize once, beside the repeated items.
      const contentSlots = new Set((signature?.params ?? []).filter((param) => /Composable/.test(param.type) && !['emptyContent', 'itemContent'].includes(param.name)).map((param) => param.name));
      const once = this.walk(args.filter((arg) => contentSlots.has(arg.name) && /^\{[\s\S]*\}$/.test(arg.value)).flatMap((arg) => parseKotlinBlock(arg.value.slice(1, -1))), ctx);
      return [{ type: 'REPEAT', primitive: leaf, listRef, listExpr, items, itemKey: named(args, 'itemRef'), contentType: named(args, 'contentType'), provenance: this.provenance(items ?? '', ctx.scope), template, empty, once, source: ctx.source }];
    }
    if (relationship === 'SCOPE') {
      const parentExpr = named(args, 'parentRef') ?? named(args, 'parent') ?? args.find((arg) => !arg.name)?.value ?? null;
      const ref = parentExpr ? (this.resolveRef(parentExpr) ?? this.resolveFromChain(parentExpr, ctx)) : null;
      const literal = ref ? null : this.literalOf(parentExpr, ctx);
      const children = node.lambda ? this.walk(node.lambda, { ...ctx, parentRef: ref ?? null, dynamicParent: ref ? null : this.formationOf(parentExpr, ctx.scope), templatePath: ref ? null : '' }) : [];
      return [{ type: 'SCOPE', primitive: leaf, ref: ref ?? null, literal, dynamic: ref ? null : this.formationOf(parentExpr ?? '', ctx.scope), source: ctx.source, children }];
    }
    const kind = kindForPrimitive(leaf);
    if (relationship === 'ELEMENT') {
      const elementExpr = named(args, 'element') ?? args.find((arg) => !arg.name)?.value ?? null;
      const candidates = elementExpr ? this.elementCandidates(elementExpr, ctx.scope) : [];
      const semanticRef = named(args, 'semanticRef');
      const ref = candidates.length === 1 ? candidates[0] : null;
      const children = node.lambda ? this.walk(node.lambda, { ...ctx, parentRef: ref ?? ctx.parentRef }) : [];
      return [{ type: 'SLOT', primitive: leaf, kind, ref, oneOf: candidates.length > 1 ? candidates : null, elementExpr, instanceRef: semanticRef ? this.formationOf(semanticRef, ctx.scope) : null, perInstance: Boolean(ctx.inTemplate), source: ctx.source, ...appearanceOf(args), children }];
    }
    if (relationship === 'LOCAL') {
      const localId = unquote(named(args, 'id') ?? args.find((arg) => !arg.name)?.value ?? '');
      if (!localId) { this.held.push({ source: ctx.source, symbol: leaf, reason: 'Vex slot id is not a literal; its address cannot be read from source' }); return node.lambda ? this.walk(node.lambda, ctx) : []; }
      const ref = ctx.parentRef ? `${ctx.parentRef}.${localId}` : null;
      const path = ctx.templatePath !== null && ctx.templatePath !== undefined ? [ctx.templatePath, localId].filter(Boolean).join('.') : null;
      const childCtx = { ...ctx, parentRef: ref, templatePath: ref ? null : path };
      const children = node.lambda ? this.walk(node.lambda, childCtx) : [];
      return [{ type: 'SLOT', primitive: leaf, kind, ref, localId, path, dynamicParent: ref ? null : ctx.dynamicParent ?? null, perInstance: Boolean(ctx.inTemplate), source: ctx.source, ...appearanceOf(args), children }];
    }
    if (relationship === 'PRESENTATION_REF') {
      const expr = named(args, 'presentationRef');
      const children = node.lambda ? this.walk(node.lambda, ctx) : [];
      return [{ type: 'SLOT', primitive: leaf, kind, ref: this.resolveRef(expr ?? '') ?? null, dynamic: expr ? this.formationOf(expr, ctx.scope) : null, perInstance: Boolean(ctx.inTemplate), source: ctx.source, children }];
    }
    if (relationship === 'TREE') {
      const placement = named(args, 'placement');
      return [{ type: 'TREE', primitive: leaf, placement, ref: placement ? this.resolveRef(placement) : null, source: ctx.source }];
    }
    // Other Vex primitives (icons, status glyphs): opaque leaves with a readable label.
    const icon = named(args, 'icon');
    return [{ type: 'OPAQUE', symbol: icon ? `${leaf}(${icon})` : leaf, reason: 'VEX_LEAF', source: ctx.source }];
  }

  relativeRef(expr, ctx) {
    const literal = /^"([^"$]*)"$/.exec(expr);
    if (literal) return literal[1];
    const template = /^"\$([a-z]\w*)\.([\w.-]+)"$/.exec(expr) ?? /^"\$\{([a-z]\w*)\}\.([\w.-]+)"$/.exec(expr);
    if (template) {
      const base = this.resolveFromChain(template[1], ctx);
      return base ? `${base}.${template[2]}` : null;
    }
    return null;
  }

  // `Owner.NAME` where `const val NAME = "literal"` is declared inside `object Owner`.
  resolveConstant(expr) {
    const match = /^([A-Z]\w*)\.([A-Z]\w*)$/.exec(compactText(expr));
    return match ? this.constants?.get(`${match[1]}.${match[2]}`) ?? null : null;
  }

  // A string literal the expression ultimately carries, if any (a root no Blueprint declares).
  literalOf(expr, ctx) {
    if (/^"[^"$]*"$/.test(expr ?? '')) return expr;
    for (const step of this.provenance(expr ?? '', ctx.scope)) {
      const literal = /^"[^"$]*"$/.test(step.value ?? '') ? step.value : /=\s*("[^"$]*")\)?\s*$/.exec(step.expression)?.[1];
      if (literal) return literal;
    }
    return null;
  }

  resolveFromChain(expr, ctx) {
    for (const step of this.provenance(expr, ctx.scope)) {
      const candidate = step.value ?? (/=\s*([\s\S]+)$/.exec(step.expression)?.[1] ?? step.expression);
      const ref = this.resolveRef(candidate.replace(/^\w+\s*=\s*/, ''));
      if (ref) return ref;
    }
    return null;
  }

  expand(node, leaf, defs, ctx) {
    const sameFile = defs.filter((def) => def.path === ctx.path);
    const pool = defs.length === 1 ? defs : sameFile.length ? sameFile : defs;
    const argNames = node.args.filter((arg) => arg.name).map((arg) => arg.name);
    const fitting = pool.filter((def) => argNames.every((name) => def.params.some((param) => param.name === name)));
    const def = pool.length === 1 ? pool[0] : fitting.length === 1 ? fitting[0] : null;
    if (!def) {
      this.held.push({ source: ctx.source, symbol: leaf, reason: `${defs.length} composables named ${leaf} fit this call; source must name one` });
      // Still realize what the caller passes as content: it is the caller's own source.
      return node.lambda ? this.walk(node.lambda, ctx) : [];
    }
    if (ctx.stack.includes(leaf) || ctx.stack.length >= MAX_DEPTH) return [{ type: 'OPAQUE', symbol: leaf, reason: ctx.stack.includes(leaf) ? 'RECURSIVE' : 'DEPTH', source: ctx.source }];
    this.calls.add(leaf);
    const callerScope = ctx.scope;
    const scope = new Scope();
    const positional = node.args.filter((arg) => !arg.name);
    def.params.forEach((param, index) => {
      const arg = named(node.args, param.name) ?? positional[index]?.value ?? param.defaultValue ?? null;
      scope.define(param.name, { kind: 'PARAM', type: param.type, arg, callee: leaf, callerScope, callSource: ctx.source, source: this.toSource(def.path, leaf) });
    });
    // A trailing lambda passed to a composable content slot realizes where the callee invokes it.
    const contentParam = def.params.findLast?.((param) => /Composable/.test(param.type)) ?? [...def.params].reverse().find((param) => /Composable/.test(param.type));
    const trailing = [...this.lambdaArgs(node, ctx, leaf), ...(node.lambda ? this.walk(node.lambda, ctx) : [])];
    const source = this.toSource(def.path, leaf);
    const children = this.walk(parseKotlinBlock(def.body), { ...ctx, scope, source, path: def.path, stack: [...ctx.stack, leaf] });
    if (trailing.length && contentParam) children.push({ type: 'CONTENT', param: contentParam.name, children: trailing });
    else children.push(...trailing);
    // A feature composable handed a registered element (a parameter typed …Element) realizes it.
    const elementArgs = def.params.filter((param) => /Element\??$/.test(param.type)).map((param) => named(node.args, param.name) ?? positional[def.params.indexOf(param)]?.value ?? null).filter(Boolean);
    const realizes = [...new Set(elementArgs.flatMap((arg) => this.elementCandidates(arg, callerScope)))];
    return [{ type: 'CALL', symbol: leaf, source, doc: def.doc ?? null, realizes: realizes.length ? realizes : null, perInstance: Boolean(ctx.inTemplate), children }];
  }
}

class Scope {
  constructor(parent = null) { this.parent = parent; this.values = new Map(); }
  child() { return new Scope(this); }
  define(name, binding) { this.values.set(name, binding); }
  lookup(name) { return this.values.get(name) ?? this.parent?.lookup(name) ?? null; }
}

/* ---------- from walk to the lens realization contract ---------- */

function visit(nodes, fn, path = []) {
  for (const node of nodes) {
    fn(node, path);
    for (const list of [node.children, node.once, node.template, node.empty].filter(Boolean)) visit(list, fn, [...path, node]);
    // Alternatives carry a marker so a nested relationship knows which choice of which branch gates it.
    (node.alternatives ?? []).forEach((alt, index) => visit(alt.children, fn, [...path, node, { type: 'ALT', branch: node, index }]));
  }
}

// The nearest enclosing choice that must be realized for a relationship to matter at all.
function gateOf(path) {
  for (let i = path.length - 1; i >= 0; i -= 1) {
    const entry = path[i];
    if (entry.type === 'ALT' && entry.branch.presenceRefs?.[entry.index]) return { presenceRef: entry.branch.presenceRefs[entry.index], choice: entry.branch.choiceIndex?.[entry.index] ?? entry.index };
  }
  return null;
}

// Collapse a walked tree into the projection: presence relationships, templates, element facts.
export function summarizeRealization(tree, { screenKey, knownRefs, screenRef }) {
  const presence = [];
  const templates = [];
  const elementFacts = new Map();
  const fact = (ref) => {
    if (!elementFacts.has(ref)) elementFacts.set(ref, { ref, presenceRefs: [], realizedBy: new Set(), realizedIn: new Set(), conditionsAbove: [] });
    return elementFacts.get(ref);
  };
  const usedRefs = new Set();
  const presenceRef = (base) => {
    let ref = `presence.${screenKey}.${slug(base) || 'branch'}`;
    let n = 2;
    while (usedRefs.has(ref)) ref = `presence.${screenKey}.${slug(base) || 'branch'}-${n++}`;
    usedRefs.add(ref);
    return ref;
  };
  const refsWithin = (nodes) => {
    const refs = new Set();
    visit(nodes, (node) => { if (node.ref && knownRefs.has(node.ref)) refs.add(node.ref); for (const ref of node.oneOf ?? []) if (knownRefs.has(ref)) refs.add(ref); });
    return [...refs];
  };
  const realizerOf = (path) => [...path].reverse().find((node) => node.type === 'CALL')?.symbol ?? null;
  // The named content region of a caller's layout (`bottomBar`, `floatingActionButton`) a
  // relationship sits in, nearest first.
  const regionOf = (path, node) => [node, ...[...path].reverse()].find((entry) => entry?.region)?.region ?? null;
  const withRegion = (entry, path, node) => { const region = regionOf(path, node); return region ? { ...entry, region } : entry; };
  const sourceOf = (path, node) => node.source ?? [...path].reverse().find((entry) => entry.source)?.source ?? null;

  const templateFor = (repeat, path) => {
    // The template is the first realization call inside the repeated item, or the item block itself.
    const call = repeat.template.find((node) => node.type === 'CALL') ?? null;
    const inline = repeat.template.find((node) => node.primitive || node.symbol);
    const symbol = call?.symbol ?? null;
    const ref = `template.${screenKey}.${slug(symbol ?? `${realizerOf(path) ?? 'item'}-${inline?.primitive ?? inline?.symbol ?? 'item'}`)}`;
    let template = templates.find((entry) => entry.ref === ref);
    if (!template) {
      const slots = [];
      let instanceFormation = null;
      const realizes = new Set();
      const walkSlots = (nodes, outer, depth) => {
        for (const node of nodes) {
          const prefix = node.popup && !outer.popup ? { ...outer, popup: node.popup } : outer;
          const extra = { ...(node.role ? { role: node.role } : {}), ...(node.textStyle ? { textStyle: node.textStyle } : {}), ...(prefix.popup ? { popup: prefix.popup } : {}) };
          if (node.type === 'SCOPE' && !node.ref && node.dynamic && !instanceFormation) instanceFormation = node.dynamic;
          if (node.type === 'SLOT' && !node.ref && node.dynamic && !instanceFormation && depth === 0) instanceFormation = node.formation ?? node.dynamic;
          if (node.type === 'SLOT') {
            const local = node.path ?? node.localId ?? null;
            const entry = {
              path: local ?? (node.ref ? null : node.primitive),
              kind: node.kind,
              primitive: node.primitive,
              realizes: node.ref && knownRefs.has(node.ref) ? node.ref : null,
              oneOf: node.oneOf?.filter((ref) => knownRefs.has(ref)) ?? null,
              instanceFormation: node.instanceRef ?? node.dynamic ?? null,
              depth,
              condition: prefix.condition ?? null,
              alternative: prefix.alternative ?? null,
              ...extra,
            };
            if (entry.realizes) realizes.add(entry.realizes);
            for (const ref of entry.oneOf ?? []) realizes.add(ref);
            if (entry.path || entry.realizes || entry.oneOf) slots.push(entry);
            walkSlots(node.children ?? [], prefix, depth + 1);
            continue;
          }
          if (node.type === 'BRANCH') {
            node.alternatives.forEach((alt, index) => walkSlots(alt.children, { condition: alt.condition, alternative: node.presence === 'ALTERNATIVE' ? `${index + 1}/${node.alternatives.length}` : null, popup: prefix.popup ?? null }, depth));
            continue;
          }
          if (node.type === 'CALL' && node.realizes) {
            const refs = node.realizes.filter((ref) => knownRefs.has(ref));
            for (const ref of refs) realizes.add(ref);
            slots.push({ path: null, kind: 'BUTTON', primitive: node.symbol, realizes: refs.length === 1 ? refs[0] : null, oneOf: refs.length > 1 ? refs : null, instanceFormation: null, depth, condition: prefix.condition ?? null, alternative: prefix.alternative ?? null, ...extra });
            continue;
          }
          if (node.type === 'OPAQUE' && depth > 0) { slots.push({ path: null, kind: 'OPAQUE', primitive: node.symbol, realizes: null, oneOf: null, instanceFormation: null, depth, condition: prefix.condition ?? null, alternative: prefix.alternative ?? null, ...extra }); continue; }
          walkSlots([...(node.children ?? []), ...(node.template ?? [])], prefix, depth);
        }
      };
      walkSlots(repeat.template, {}, 0);
      // Consecutive plain (non-Vex) cells under the same condition read as one opaque run.
      const compressed = [];
      for (const slot of slots) {
        const last = compressed.at(-1);
        if (slot.kind === 'OPAQUE' && last?.kind === 'OPAQUE' && last.depth === slot.depth && last.condition === slot.condition && last.popup === slot.popup) { last.count = (last.count ?? 1) + 1; if (!last.primitives.includes(slot.primitive)) last.primitives.push(slot.primitive); continue; }
        compressed.push(slot.kind === 'OPAQUE' ? { ...slot, count: 1, primitives: [slot.primitive] } : slot);
      }
      slots.length = 0;
      slots.push(...compressed);
      template = {
        ref,
        symbol: symbol ?? `${inline?.primitive ?? inline?.symbol ?? 'item'} (inline in ${realizerOf(path) ?? 'list'})`,
        source: call?.source ?? repeat.source,
        summary: call?.doc ?? null,
        instanceFormation,
        slots,
        realizes: [...realizes].sort(),
        usedBy: [],
      };
      templates.push(template);
    }
    return template;
  };

  visit(tree, (node, path) => {
    if (node.type === 'CALL' && node.realizes) {
      const repeat = [...path].reverse().find((parent) => parent.type === 'REPEAT');
      for (const ref of node.realizes) if (knownRefs.has(ref)) {
        const entry = fact(ref);
        entry.realizedBy.add(node.symbol);
        if (repeat && node.perInstance) entry.realizedIn.add(repeat);
      }
    }
    if (node.type === 'SLOT' || node.type === 'LAZY' || node.type === 'SCOPE') {
      if (node.ref && knownRefs.has(node.ref)) {
        const entry = fact(node.ref);
        const realizer = realizerOf(path);
        if (realizer) entry.realizedBy.add(realizer);
        const repeat = [...path].reverse().find((parent) => parent.type === 'REPEAT');
        if (repeat && node.perInstance) entry.realizedIn.add(repeat);
      }
      for (const ref of node.oneOf ?? []) if (knownRefs.has(ref) && node.perInstance) {
        const repeat = [...path].reverse().find((parent) => parent.type === 'REPEAT');
        if (repeat) fact(ref).realizedIn.add(repeat);
      }
    }
    if (node.type === 'REPEAT') {
      const template = templateFor(node, path);
      node.templateRef = template.ref; // visit is pre-order: descendants see their template
      const owner = node.listRef && knownRefs.has(node.listRef) ? node.listRef : null;
      const lexical = [...path].reverse().find((parent) => parent.ref && knownRefs.has(parent.ref))?.ref ?? null;
      const ref = presenceRef(`${owner ? owner.replace(`element.${screenKey}.`, '') : lexical ? lexical.replace(`element.${screenKey}.`, '') : (realizerOf(path) ?? 'list')}-population`);
      const entry = {
        ref,
        kind: 'POPULATION',
        subjectRef: owner ?? lexical,
        owner: node.primitive,
        list: { ref: node.listRef, expression: node.listExpr, identity: owner ? 'REGISTERED' : node.listRef ? 'RUNTIME' : 'NONE' },
        items: node.items,
        itemKey: node.itemKey,
        contentType: node.contentType,
        provenance: node.provenance,
        templateRef: template.ref,
        empty: refsWithin(node.empty),
        emptyRealization: node.empty.length ? 'DECLARED' : 'NONE',
        realizedBy: realizerOf(path),
        source: sourceOf(path, node),
        held: owner || node.listRef ? null : 'raw lazy list without stable list identity; population cannot bind to a registered container',
      };
      template.usedBy.push(ref);
      entry.gate = gateOf(path);
      presence.push(withRegion(entry, path, node));
      if (owner) fact(owner).presenceRefs.push(ref);
    }
    if (node.type === 'BRANCH') {
      const realizer = realizerOf(path);
      const nearest = [...path].reverse().find((parent) => parent.ref && knownRefs.has(parent.ref))?.ref ?? null;
      const gate = gateOf(path);
      node.presenceRefs = [];
      node.choiceIndex = [];
      node.alternatives.forEach((alt, index) => {
        if (alt.kind === 'PRESENTATION' && alt.targetRef) {
          const ref = presenceRef(`${alt.targetRef.replace(`element.${screenKey}.`, '')}-open`);
          const realized = refsWithin(alt.children);
          const call = alt.children.find((child) => child.type === 'CALL');
          node.presenceRefs[index] = ref;
          node.choiceIndex[index] = 0;
          presence.push(withRegion({ ref, kind: 'PRESENTATION', subjectRef: alt.targetRef, owner: 'runtime.presentation', condition: alt.condition, realizedBy: call?.symbol ?? realizer, realizes: realized, source: call?.source ?? sourceOf(path, node), gate }, path, node));
          fact(alt.targetRef).presenceRefs.push(ref);
          for (const child of realized) if (child !== alt.targetRef) fact(child).conditionsAbove.push(ref);
        }
      });
      const selection = node.alternatives.filter((alt) => alt.kind === 'SELECTION');
      if (selection.length) {
        const containerRef = selection.find((alt) => alt.containerRef)?.containerRef ?? null;
        const ref = presenceRef(`${(containerRef ?? 'selection').replace(`element.${screenKey}.`, '')}-selection`);
        const choices = node.alternatives.map((alt) => {
          const call = alt.children.find((child) => child.type === 'CALL');
          return { condition: alt.condition, kind: alt.kind ?? (alt.condition === 'else' ? 'OTHERWISE' : 'GUARD'), targetRef: alt.targetRef ?? null, realizedBy: call?.symbol ?? null, realizes: refsWithin(alt.children), source: call?.source ?? null };
        });
        node.alternatives.forEach((_, index) => { node.presenceRefs[index] ??= ref; node.choiceIndex[index] ??= index; });
        presence.push(withRegion({ ref, kind: 'SELECTION', subjectRef: containerRef, owner: 'runtime.presentation', choices, realizedBy: realizer, source: sourceOf(path, node), gate }, path, node));
        if (containerRef) fact(containerRef).presenceRefs.push(ref);
        for (const choice of choices) for (const child of choice.realizes) fact(child).conditionsAbove.push(ref);
        for (const choice of choices) if (choice.targetRef) fact(choice.targetRef).presenceRefs.push(ref);
      }
      if (node.presence === 'BRANCH' || node.presence === 'CASES' || node.presence === 'ALTERNATIVE') {
        const realizedPerAlt = node.alternatives.map((alt) => refsWithin(alt.children));
        const anyRegistered = realizedPerAlt.some((refs) => refs.length);
        const inTemplate = path.some((parent) => parent.type === 'REPEAT');
        if (anyRegistered && !inTemplate) {
          const first = realizedPerAlt.find((refs) => refs.length)[0];
          const base = nearest ? nearest.replace(`element.${screenKey}.`, '') : realizer ?? first.replace(`element.${screenKey}.`, '');
          const ref = presenceRef(`${base}-${node.presence.toLowerCase()}`);
          node.alternatives.forEach((_, index) => { node.presenceRefs[index] ??= ref; node.choiceIndex[index] ??= index; });
          presence.push(withRegion({
            ref,
            gate,
            kind: node.presence,
            subjectRef: nearest ?? first,
            owner: realizer ?? 'feature',
            subject: node.subject,
            choices: node.alternatives.map((alt, index) => {
              const call = alt.children.find((child) => child.type === 'CALL');
              return { condition: alt.condition, realizedBy: call?.symbol ?? null, realizes: realizedPerAlt[index] };
            }),
            exhaustive: node.exhaustive,
            source: sourceOf(path, node),
          }, path, node));
          for (const refs of realizedPerAlt) for (const child of refs) fact(child).conditionsAbove.push(ref);
        }
      }
    }
  });

  const facts = [...elementFacts.values()].map((entry) => ({
    ref: entry.ref,
    presenceRefs: [...new Set(entry.presenceRefs)],
    conditionRefs: [...new Set(entry.conditionsAbove)],
    realizedBy: [...entry.realizedBy].sort(),
    realizedIn: [...new Set([...entry.realizedIn].map((repeat) => repeat.templateRef).filter(Boolean))].sort(),
  })).filter((entry) => entry.presenceRefs.length || entry.conditionRefs.length || entry.realizedBy.length || entry.realizedIn.length).sort((a, b) => a.ref.localeCompare(b.ref));

  return { presence, templates, elements: facts, screenRef };
}

/* ---------- entry point used by the adapter ---------- */

// `object Owner { … const val NAME = "literal" … }` across the read sources.
export function stringConstants(files) {
  const constants = new Map();
  for (const [path, text] of files) {
    if (!path.endsWith('.kt') || !text.includes('const val')) continue;
    for (const object of text.matchAll(/\bobject\s+(\w+)[^{]*\{/g)) {
      const open = object.index + object[0].length - 1;
      let close;
      try { close = matchClose(text, open); } catch { continue; }
      for (const constant of text.slice(open, close).matchAll(/const\s+val\s+(\w+)\s*(?::\s*String\s*)?=\s*"([^"$]*)"/g)) {
        if (!constants.has(`${object[1]}.${constant[1]}`)) constants.set(`${object[1]}.${constant[1]}`, constant[2]);
      }
    }
  }
  return constants;
}

export function realizeScreen({ screen, files, composables, primitives, resolveRef, toSource, knownRefs, constants = null, renderSymbol = 'renderContent' }) {
  const result = { status: 'BLUEPRINT', entry: null, rendersRegisteredTree: null, presence: [], templates: [], elements: [], opaque: [], held: [], calls: [] };
  if (!screen.customRender) return result;
  const text = files.get(screen.path);
  const objectMatch = new RegExp(`object\\s+${screen.object}\\s*:`).exec(text);
  const render = new RegExp(`override\\s+fun\\s+${renderSymbol}\\s*\\(`, 'g');
  render.lastIndex = objectMatch?.index ?? 0;
  const match = render.exec(text);
  if (!match) { result.status = 'HELD'; result.held.push({ reason: `${renderSymbol} override not found`, source: screen.source }); return result; }
  const open = match.index + match[0].length - 1;
  const close = matchClose(text, open);
  const bodyOpen = text.indexOf('{', close);
  const body = text.slice(bodyOpen + 1, matchClose(text, bodyOpen));
  const walker = new RealizationWalker({ composables, primitives, resolveRef, toSource, constants, rootRef: `screen.${screen.screenKey}` });
  const scope = new Scope();
  for (const param of paramList(text.slice(open + 1, close))) scope.define(param.name, { kind: 'PARAM', type: param.type, arg: null, callee: renderSymbol, source: toSource(screen.path, `${screen.object}.${renderSymbol}`) });
  const source = toSource(screen.path, `${screen.object}.${renderSymbol}`);
  const tree = walker.walk(parseKotlinBlock(body), { scope, source, path: screen.path, stack: [`${screen.object}.${renderSymbol}`], parentRef: null, templatePath: null, inTemplate: false, inLazy: false });
  const summary = summarizeRealization(tree, { screenKey: screen.screenKey, knownRefs, screenRef: `screen.${screen.screenKey}` });
  const firstCall = tree.find((node) => node.type === 'CALL');
  visit(tree, (node) => { if (node.type === 'TREE' && node.ref && knownRefs.has(node.ref) && !result.rendersRegisteredTree) result.rendersRegisteredTree = node.ref; });
  result.entry = { symbol: firstCall?.symbol ?? `${screen.object}.${renderSymbol}`, source: firstCall?.source ?? source };
  result.presence = summary.presence;
  result.templates = summary.templates;
  result.elements = summary.elements;
  result.opaque = dedupe(walker.opaque.map((entry) => ({ symbol: entry.symbol, source: entry.source, reason: entry.reason })), (entry) => `${entry.symbol}|${entry.source}`);
  result.held = dedupe([...walker.held, ...summary.presence.filter((entry) => entry.held).map((entry) => ({ reason: entry.held, source: entry.source, symbol: entry.realizedBy ?? null }))], (entry) => `${entry.reason}|${entry.source}|${entry.symbol}`);
  result.calls = [...walker.calls].sort();
  const realizedCount = summary.elements.length + summary.presence.length + (result.rendersRegisteredTree ? 1 : 0);
  result.status = result.opaque.length && !realizedCount ? 'OPAQUE' : realizedCount ? (result.held.length || result.opaque.length ? 'PARTIAL' : 'PROJECTED') : 'OPAQUE';
  return result;
}

// Semantic roots a rendered example composable carries: registered/known refs and literal roots the
// production source does not share. Used to bind a source-authored example to its subject.
export function semanticRootsOf({ body, path, symbol, composables, primitives, resolveRef, toSource, knownRefs }) {
  const walker = new RealizationWalker({ composables, primitives, resolveRef, toSource });
  const source = toSource(path, symbol);
  const tree = walker.walk(parseKotlinBlock(body), { scope: new Scope(), source, path, stack: [symbol], parentRef: null, templatePath: null, inTemplate: false, inLazy: false });
  const known = [];
  const foreign = [];
  const rendered = [];
  // The subject is the outermost semantic ROOT: a scope, a repeated list or an identified container.
  // A registered action or text inside the example is content, never the subject.
  const rootKinds = new Set(['COLUMN', 'ROW', 'STACK', 'CARD', 'REGION', 'SHEET', 'DIALOG']);
  visit(tree, (node, trail) => {
    if (node.type === 'CALL' && !trail.some((entry) => entry.ref || entry.listRef)) rendered.push(node.symbol);
    if (trail.some((entry) => (entry.ref && knownRefs.has(entry.ref)) || (entry.listRef && knownRefs.has(entry.listRef)) || entry.literal)) return;
    const candidate = node.type === 'REPEAT' ? node.listRef : (node.type === 'SCOPE' || node.type === 'LAZY' || (node.type === 'SLOT' && rootKinds.has(node.kind))) ? node.ref : null;
    if (candidate && knownRefs.has(candidate)) known.push(candidate);
    else if (node.type === 'REPEAT' && node.listExpr && !node.listRef) foreign.push(node.listExpr);
    else if (node.type === 'SCOPE' && !node.ref && node.literal) foreign.push(node.literal);
  });
  return { known: [...new Set(known)], foreign: [...new Set(foreign)], rendered: [...new Set(rendered)], calls: [...walker.calls].sort() };
}

function dedupe(list, keyOf) {
  const seen = new Set();
  return list.filter((entry) => { const key = keyOf(entry); if (seen.has(key)) return false; seen.add(key); return true; });
}

// [VXG RealForever][VEXWORK][VEXBOARD][SCREEN-LENS][REALIZATION]
