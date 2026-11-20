// Experience Relationship Graph — VexLife-Prod Family law reader.
//
// Reads one Kotlin Family source file the way VexLife-Prod authors it under
// `vexlife.semantic.VexFamilyContract` and returns its exact semantic law:
//
//   declared State / Control / Effect variants
//   act(): every State-variant × Control-variant cell -> REJECT | STAY | ADMIT (+ Effect)
//   observe*/interpret*: outside truth -> State variants (reconciliation boundary)
//   displayStateFor(): State variant -> Controls the Projection offers
//
// The reader partially evaluates act() over declared variants. Conditions that depend only on
// which variant is current are decided; anything else (payload fields, axis predicates, local
// values) stays as an explicit residual guard on that outcome. Source shapes the reader cannot
// interpret are returned as extraction debt instead of being guessed.
//
// Pure: no file system, network, clock or Kotlin execution. Product source is never modified.

import { matchClose, splitArgs, stripComments } from './vexboard-kotlin-source.mjs';

export const EXPERIENCE_FAMILY_LAW_SCHEMA = 'vexwork.experience-graph.family-law/v1';

export const FAMILY_CONTRACT_FORMS = Object.freeze({
  VEX_FAMILY_CONTRACT: 'VEX_FAMILY_CONTRACT',
  AVAILABILITY_ONLY: 'AVAILABILITY_ONLY',
});

export const OUTCOME_KINDS = Object.freeze(['REJECT', 'STAY', 'ADMIT']);

export const EXTRACTION_DEBT = Object.freeze({
  UNREAD_ACT_FORM: 'UNREAD_ACT_FORM',
  UNRESOLVED_EFFECT: 'UNRESOLVED_EFFECT',
  UNRESOLVED_ADMITTED_STATE: 'UNRESOLVED_ADMITTED_STATE',
  MISSING_ACT_LAW: 'MISSING_ACT_LAW',
});

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

const lineAt = (text, index) => text.slice(0, index).split('\n').length;
const compactText = (value) => String(value).replace(/\s+/g, ' ').replace(/\(\s+/g, '(').replace(/\s+\)/g, ')').trim();

function skipSpace(text, i) {
  while (i < text.length && /\s/.test(text[i])) i += 1;
  return i;
}

// Top-level split on a two-character operator (&& or ||), respecting brackets and strings.
function splitTop(text, operator) {
  const parts = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (c === '"') {
      i += 1;
      while (i < text.length && text[i] !== '"') i += text[i] === '\\' ? 2 : 1;
      continue;
    }
    if ('({['.includes(c)) depth += 1;
    else if (')}]'.includes(c)) depth -= 1;
    else if (depth === 0 && text.startsWith(operator, i)) {
      parts.push(text.slice(start, i));
      start = i + operator.length;
      i += operator.length - 1;
    }
  }
  parts.push(text.slice(start));
  return parts.map((part) => part.trim()).filter(Boolean);
}

function unwrapParens(text) {
  let value = text.trim();
  while (value.startsWith('(') && matchClose(value, 0) === value.length - 1) value = value.slice(1, -1).trim();
  return value;
}

function constTable(text) {
  const table = new Map();
  for (const match of text.matchAll(/const val (\w+)\s*(?::\s*String\s*)?=\s*"([^"]*)"/g)) table.set(match[1], match[2]);
  return table;
}

function enumTable(text) {
  const table = new Map();
  for (const match of text.matchAll(/enum class (\w+)\s*(\([^)]*\))?\s*\{/g)) {
    const open = text.indexOf('{', match.index + match[0].length - 1);
    const body = text.slice(open + 1, matchClose(text, open));
    const entriesText = body.split(';')[0];
    const entries = [];
    let depth = 0;
    let token = '';
    for (const c of `${entriesText},`) {
      if ('({['.includes(c)) depth += 1;
      else if (')}]'.includes(c)) depth -= 1;
      if (depth === 0 && c === ',') {
        const name = /^\s*(?:\/\*\*[\s\S]*?\*\/\s*)?([A-Z]\w*)/.exec(stripComments(token));
        if (name) entries.push(name[1]);
        token = '';
      } else token += c;
    }
    table.set(match[1], entries);
  }
  return table;
}

// Supertype text with every balanced <...> generic argument list removed.
function withoutGenerics(text) {
  let out = '';
  let depth = 0;
  for (const c of text) {
    if (c === '<') depth += 1;
    else if (c === '>') depth -= 1;
    else if (depth === 0) out += c;
  }
  return out;
}

function parseParams(paramText) {
  return splitArgs(paramText).map((arg) => {
    const raw = arg.name ? `${arg.name}=${arg.value}` : arg.value;
    const match = /^(?:(?:override|private|internal)\s+)*(?:(?:val|var)\s+)?(\w+)\s*:\s*([^=]+?)\s*(?:=\s*(.+))?$/.exec(raw.replace(/@\w+(\([^)]*\))?\s*/g, '').trim());
    if (!match) return null;
    return Object.freeze({ name: match[1], type: compactText(match[2]), hasDefault: match[3] !== undefined });
  }).filter(Boolean);
}

// Every sealed interface / class body, so nested declarations get a qualified name.
// Headers may wrap (`sealed interface State :\n    VexFamilyContract.State<F> {`); a sealed type
// with no body (`sealed interface State : VexFamilyContract.State<F>`) contains nothing.
function containers(text) {
  const result = [];
  for (const match of text.matchAll(/sealed (?:interface|class) (\w+)/g)) {
    let depth = 0;
    let open = -1;
    for (let i = match.index + match[0].length; i < text.length; i += 1) {
      const c = text[i];
      if (c === '(' || c === '<') depth += 1;
      else if (c === ')' || c === '>') depth -= 1;
      else if (depth === 0 && c === '{') { open = i; break; }
      else if (depth === 0 && c === '\n' && /^\s*(?:\n|(?:data |sealed |enum |object |class |fun |val |const |override |@|\/\*\*|\}))/.test(text.slice(i + 1, i + 40))) break;
    }
    if (open >= 0) result.push({ name: match[1], open, close: matchClose(text, open) });
  }
  return result;
}

function declarations(text, family) {
  const boxes = containers(text);
  const result = [];
  const pattern = /(?:^|\n)[ \t]*((?:data )?object|data class|class) (\w+)\s*(\()?/g;
  for (const match of text.matchAll(pattern)) {
    const start = match.index + match[0].indexOf(match[1]);
    let cursor = match.index + match[0].length;
    let params = [];
    if (match[3]) {
      const open = cursor - 1;
      const close = matchClose(text, open);
      params = parseParams(text.slice(open + 1, close));
      cursor = close + 1;
    }
    cursor = skipSpace(text, cursor);
    if (text[cursor] !== ':') continue;
    const tail = /^:\s*([\s\S]*?)(\{|\n\s*\n|\n\s*(?:data |object |class |sealed |enum |const |fun |override |val |\/\/|\/\*|\}))/.exec(text.slice(cursor));
    const supers = tail ? splitArgs(withoutGenerics(tail[1])).map((arg) => compactText(arg.value).replace(/\(.*$/, '')).filter(Boolean) : [];
    const container = boxes.filter((box) => box.open < start && start < box.close).sort((a, b) => b.open - a.open)[0];
    const qualified = container && container.name !== family ? `${container.name}.${match[2]}` : match[2];
    let body = '';
    const bodyOpen = tail && tail[2] === '{' ? cursor + tail[0].length - 1 : -1;
    if (bodyOpen >= 0) body = text.slice(bodyOpen + 1, matchClose(text, bodyOpen));
    result.push({
      name: match[2],
      qualified,
      form: match[1] === 'data class' || match[1] === 'class' ? 'CLASS' : 'OBJECT',
      params,
      supers,
      body,
      line: lineAt(text, start),
    });
  }
  return result;
}

function memberRef(body, property, consts) {
  const match = new RegExp(`override val ${property}\\s*(?::\\s*String\\s*)?=\\s*(\\w+|"[^"]*")`).exec(body);
  if (!match) return null;
  if (match[1].startsWith('"')) return match[1].slice(1, -1);
  return consts.get(match[1]) ?? null;
}

function variantsOf(decls, typeName, family, consts, refProperty) {
  const accepted = new Set([typeName, `${family}.${typeName}`]);
  return decls
    .filter((decl) => decl.supers.some((value) => accepted.has(value) || accepted.has(value.replace(/^VexFamilyContract\./, ''))))
    .filter((decl) => decl.name !== typeName)
    .map((decl) => Object.freeze({
      symbol: decl.qualified,
      name: decl.name,
      form: decl.form,
      ref: memberRef(decl.body, refProperty, consts) ?? decl.name,
      refSource: memberRef(decl.body, refProperty, consts) ? 'CONSTANT' : 'SYMBOL',
      params: Object.freeze(decl.params),
      line: decl.line,
    }));
}

// ---- act() expression reading -------------------------------------------------------------

function exprEnd(text, i) {
  let depth = 0;
  for (; i < text.length; i += 1) {
    const c = text[i];
    if (c === '"') {
      i += 1;
      while (i < text.length && text[i] !== '"') i += text[i] === '\\' ? 2 : 1;
      continue;
    }
    if ('({['.includes(c)) depth += 1;
    else if (')}]'.includes(c)) {
      if (depth === 0) return i;
      depth -= 1;
    } else if (c === '\n' && depth === 0) {
      const before = text.slice(0, i).trimEnd();
      const after = text.slice(i + 1).trimStart();
      const continued = /(&&|\|\||[=,+\-*/(.]|\?:|->)$/.test(before) || /^(&&|\|\||\.|\?:|\)|\]|\}|else\b)/.test(after);
      if (!continued) return i;
    }
  }
  return i;
}

function parseExpr(input) {
  const text = stripComments(input).trim();
  if (!text) return { k: 'UNKNOWN', text: input };
  if (text === 'null') return { k: 'NULL' };
  if (text.startsWith('return ')) return parseExpr(text.slice(7));
  if (text.startsWith('{') && matchClose(text, 0) === text.length - 1) return parseBlock(text.slice(1, -1));
  const call = /^(stay|admit)\s*\(/.exec(text);
  if (call) {
    const open = text.indexOf('(');
    const close = matchClose(text, open);
    if (close === text.length - 1) return { k: call[1].toUpperCase(), args: splitArgs(text.slice(open + 1, close), { withRaw: true }) };
  }
  if (/^when\b/.test(text)) return parseWhen(text);
  if (/^if\s*\(/.test(text)) return parseIf(text);
  return { k: 'UNKNOWN', text: compactText(text) };
}

function parseIf(text) {
  const open = text.indexOf('(');
  const close = matchClose(text, open);
  const cond = compactText(text.slice(open + 1, close));
  let i = skipSpace(text, close + 1);
  let thenText;
  if (text[i] === '{') {
    const end = matchClose(text, i);
    thenText = text.slice(i, end + 1);
    i = end + 1;
  } else {
    const elseAt = findTopLevelElse(text, i);
    thenText = text.slice(i, elseAt < 0 ? text.length : elseAt);
    i = elseAt < 0 ? text.length : elseAt;
  }
  i = skipSpace(text, i);
  let elseText = null;
  if (text.startsWith('else', i)) elseText = text.slice(i + 4).trim();
  return { k: 'IF', cond, then: parseExpr(thenText), else: elseText === null ? { k: 'UNIT' } : parseExpr(elseText) };
}

function findTopLevelElse(text, start) {
  let depth = 0;
  for (let i = start; i < text.length; i += 1) {
    const c = text[i];
    if ('({['.includes(c)) depth += 1;
    else if (')}]'.includes(c)) depth -= 1;
    else if (depth === 0 && /\belse\b/.test(text.slice(i, i + 5)) && (i === 0 || /\s|\}/.test(text[i - 1]))) return i;
  }
  return -1;
}

function parseWhen(text) {
  let i = skipSpace(text, 4);
  let subject = null;
  if (text[i] === '(') {
    const close = matchClose(text, i);
    subject = compactText(text.slice(i + 1, close));
    i = skipSpace(text, close + 1);
  }
  assert(text[i] === '{', 'when without body');
  const close = matchClose(text, i);
  const body = text.slice(i + 1, close);
  return { k: 'WHEN', subject, branches: whenBranches(body) };
}

function arrowsAtTop(body) {
  const arrows = [];
  let depth = 0;
  for (let i = 0; i < body.length; i += 1) {
    const c = body[i];
    if (c === '"') {
      i += 1;
      while (i < body.length && body[i] !== '"') i += body[i] === '\\' ? 2 : 1;
      continue;
    }
    if (body.startsWith('//', i)) { i = body.indexOf('\n', i); if (i < 0) break; continue; }
    if ('({['.includes(c)) depth += 1;
    else if (')}]'.includes(c)) depth -= 1;
    else if (depth === 0 && body.startsWith('->', i)) arrows.push(i);
  }
  return arrows;
}

// Where the condition that precedes `arrow` begins: the arrow's own line plus earlier lines that
// end in a comma (multi-subject branches such as `A,\n B,\n ->`).
function conditionStart(body, arrow) {
  let lineStart = body.lastIndexOf('\n', arrow - 1) + 1;
  for (;;) {
    const prevEnd = lineStart - 1;
    if (prevEnd <= 0) return 0;
    const prevStart = body.lastIndexOf('\n', prevEnd - 1) + 1;
    const prevLine = stripComments(body.slice(prevStart, prevEnd)).trim();
    if (prevLine.endsWith(',')) lineStart = prevStart;
    else if (prevLine === '') lineStart = prevStart;
    else return lineStart;
  }
}

function whenBranches(body) {
  const clean = stripComments(body);
  const arrows = arrowsAtTop(clean);
  const starts = arrows.map((arrow) => conditionStart(clean, arrow));
  return arrows.map((arrow, index) => {
    const conditionText = clean.slice(starts[index], arrow);
    const exprText = clean.slice(arrow + 2, index + 1 < arrows.length ? starts[index + 1] : clean.length);
    const conds = splitArgs(conditionText).map((arg) => compactText(arg.value));
    return { conds, expr: parseExpr(exprText) };
  });
}

function parseBlock(blockText) {
  const statements = [];
  const text = stripComments(blockText);
  let i = skipSpace(text, 0);
  while (i < text.length) {
    const end = exprEnd(text, i);
    statements.push(text.slice(i, end).trim());
    i = skipSpace(text, end + 1);
  }
  const prelude = [];
  for (let index = 0; index < statements.length; index += 1) {
    const statement = statements[index];
    const valMatch = /^val (\w+)\s*=\s*([\s\S]+)$/.exec(statement);
    if (valMatch) {
      const value = compactText(valMatch[2]);
      const narrowing = /^currentState as\? ([\w.]+) \?: return null$/.exec(value);
      if (narrowing) prelude.push({ k: 'NARROW', alias: valMatch[1], type: narrowing[1] });
      else if (/\?: return null$/.test(value)) prelude.push({ k: 'REQUIRE', alias: valMatch[1], guard: `${value.replace(/\s*\?: return null$/, '')} != null` });
      else prelude.push({ k: 'LOCAL', alias: valMatch[1], value });
      continue;
    }
    const guard = /^if\s*\(([\s\S]*)\)\s*\{?\s*return null\s*\}?$/.exec(statement);
    if (guard) {
      prelude.push({ k: 'GUARD', guard: `!(${compactText(guard[1])})` });
      continue;
    }
    const expr = parseExpr(statement);
    return { k: 'BLOCK', prelude, expr, trailing: statements.length - index - 1 };
  }
  return { k: 'BLOCK', prelude, expr: { k: 'UNKNOWN', text: 'block without result' }, trailing: 0 };
}

// ---- partial evaluation over declared variants --------------------------------------------

function makeResolver(states, controls) {
  const byName = (variants) => {
    const map = new Map();
    for (const variant of variants) {
      map.set(variant.symbol, variant);
      map.set(variant.name, variant);
    }
    return map;
  };
  return { states: byName(states), controls: byName(controls) };
}

function stripQualifier(value, family) {
  return value.replace(new RegExp(`^${family}\\.`), '');
}

function variantMatch(token, lookup, family) {
  const value = stripQualifier(token.replace(/^is\s+/, '').trim(), family);
  return lookup.get(value) ?? lookup.get(value.split('.').at(-1)) ?? null;
}

function evalTerm(term, cell, ctx) {
  const text = term.trim();
  const negated = /^!\s*\(/.test(text) && matchClose(text, text.indexOf('(')) === text.length - 1;
  if (negated) {
    const inner = evalCond(text.slice(text.indexOf('(') + 1, -1), cell, ctx);
    if (inner.v === 'T') return { v: 'F' };
    if (inner.v === 'F') return { v: 'T' };
    return { v: 'R', text };
  }
  const subjects = [
    ['state', /^(currentState|state)\s*(==|!=|is|!is)\s*([\w.]+)$/],
    ['control', /^(control)\s*(==|!=|is|!is)\s*([\w.]+)$/],
  ];
  for (const [axis, pattern] of subjects) {
    const match = pattern.exec(text);
    if (!match) continue;
    const variant = variantMatch(match[3], axis === 'state' ? ctx.resolver.states : ctx.resolver.controls, ctx.family);
    if (!variant) return { v: 'R', text };
    const equal = (axis === 'state' ? cell.state : cell.control) === variant.symbol;
    const positive = match[2] === '==' || match[2] === 'is';
    return { v: equal === positive ? 'T' : 'F' };
  }
  return { v: 'R', text };
}

function evalCond(condText, cell, ctx) {
  const cond = unwrapParens(condText);
  const disjuncts = splitTop(cond, '||');
  if (disjuncts.length > 1) {
    const values = disjuncts.map((part) => evalCond(part, cell, ctx));
    if (values.some((value) => value.v === 'T')) return { v: 'T' };
    const residual = values.filter((value) => value.v === 'R');
    if (!residual.length) return { v: 'F' };
    return { v: 'R', text: residual.map((value) => value.text).join(' || ') };
  }
  const residual = [];
  for (const term of splitTop(cond, '&&')) {
    const value = evalTerm(unwrapParens(term) === term ? term : unwrapParens(term), cell, ctx);
    if (value.v === 'F') return { v: 'F' };
    if (value.v === 'R') residual.push(value.text);
  }
  return residual.length ? { v: 'R', text: residual.join(' && ') } : { v: 'T' };
}

const negate = (text) => (/^!\(.*\)$/.test(text) ? text.slice(2, -1) : `!(${text})`);

function substitute(text, ctx) {
  let value = text;
  for (const [alias, replacement] of ctx.aliases) value = value.replace(new RegExp(`\\b${alias}\\b`, 'g'), replacement);
  return value;
}

function outcome(kind, guards, admittedState = null, effect = null, effectGuards = []) {
  return { kind, guards: [...guards, ...effectGuards], admittedState, effect };
}

function readEffect(raw, ctx, guards) {
  if (raw === undefined || raw === null) return [{ effect: null, guards: [] }];
  const text = compactText(stripComments(raw));
  if (text === 'null') return [{ effect: null, guards: [] }];
  if (/^when\b/.test(text)) {
    const tree = parseWhen(stripComments(raw).trim());
    const results = [];
    const prior = [];
    for (const branch of tree.branches) {
      const guard = branch.conds[0] === 'else'
        ? prior.map(negate).join(' && ')
        : branch.conds.map((cond) => `${substitute(tree.subject, ctx)} == ${cond}`).join(' || ');
      prior.push(guard);
      if (branch.expr.k !== 'UNKNOWN') {
        ctx.debt.push({ kind: EXTRACTION_DEBT.UNRESOLVED_EFFECT, detail: `nested effect expression ${branch.expr.k}`, cell: guards.cell });
        continue;
      }
      for (const resolved of readEffect(branch.expr.text, ctx, guards)) results.push({ effect: resolved.effect, guards: [guard, ...resolved.guards] });
    }
    return results;
  }
  const name = /^(?:Effect\.)?([\w.]+?)(?:\s*\(|$)/.exec(stripQualifier(text, ctx.family));
  if (name) {
    const candidate = ctx.effects.find((effect) => effect.symbol === name[1] || effect.name === name[1] || `Effect.${effect.name}` === name[1]);
    if (candidate) return [{ effect: candidate.symbol, guards: [] }];
    const helper = ctx.helpers.get(name[1]);
    if (helper && !ctx.helperStack.includes(name[1])) {
      ctx.helperStack.push(name[1]);
      const resolved = readEffect(helper, ctx, guards);
      ctx.helperStack.pop();
      return resolved;
    }
  }
  ctx.debt.push({ kind: EXTRACTION_DEBT.UNRESOLVED_EFFECT, detail: text, cell: guards.cell });
  return [{ effect: 'UNRESOLVED', guards: [] }];
}

function readAdmittedState(raw, ctx, cell) {
  const text = compactText(stripComments(raw));
  const copy = /^(currentState|\w+)\.copy\((.*)\)$/.exec(text);
  if (copy && (copy[1] === 'currentState' || ctx.aliases.has(copy[1]))) {
    const updates = Object.fromEntries(splitArgs(copy[2]).filter((arg) => arg.name).map((arg) => [arg.name, arg.value]));
    return { variant: cell.state, axisUpdates: updates };
  }
  if (text === 'currentState') return { variant: cell.state, axisUpdates: {} };
  // `when (currentState) { is A -> ...; is B -> ... }` inside admit(): the cell already fixes which
  // variant currentState is, so partial evaluation picks that branch.
  if (/^when\s*\(\s*currentState\s*\)/.test(text)) {
    const tree = parseWhen(stripComments(raw).trim());
    const branch = tree.branches.find((row) => row.conds.some((cond) => variantMatch(cond.replace(/^is\s+/, ''), ctx.resolver.states, ctx.family)?.symbol === cell.state))
      ?? tree.branches.find((row) => row.conds[0] === 'else');
    if (branch && branch.expr.k === 'UNKNOWN') return readAdmittedState(branch.expr.text, ctx, cell);
  }
  const name = /^([\w.]+?)(?:\s*\(|$)/.exec(stripQualifier(text, ctx.family));
  const variant = name ? variantMatch(name[1], ctx.resolver.states, ctx.family) : null;
  if (variant) return { variant: variant.symbol, axisUpdates: {} };
  ctx.debt.push({ kind: EXTRACTION_DEBT.UNRESOLVED_ADMITTED_STATE, detail: text, cell: `${cell.state}×${cell.control}` });
  return { variant: 'UNRESOLVED', axisUpdates: {} };
}

function evalTree(tree, cell, guards, ctx) {
  const cellGuards = Object.assign([...guards], { cell: `${cell.state}×${cell.control}` });
  switch (tree.k) {
    case 'NULL':
      return [outcome('REJECT', guards)];
    case 'UNIT':
      ctx.debt.push({ kind: EXTRACTION_DEBT.UNREAD_ACT_FORM, detail: 'if without else', cell: cellGuards.cell });
      return [];
    case 'STAY': {
      const named = tree.args.find((arg) => arg.name === 'effect');
      const raw = named ? named.raw : tree.args.find((arg) => !arg.name)?.raw;
      return readEffect(raw, ctx, cellGuards).map((resolved) => outcome('STAY', guards, null, resolved.effect, resolved.guards));
    }
    case 'ADMIT': {
      const stateArg = tree.args.find((arg) => arg.name === 'state') ?? tree.args.find((arg) => !arg.name);
      const effectArg = tree.args.find((arg) => arg.name === 'effect') ?? tree.args.filter((arg) => !arg.name)[1];
      const admitted = readAdmittedState(stateArg.raw, ctx, cell);
      return readEffect(effectArg?.raw, ctx, cellGuards).map((resolved) => outcome('ADMIT', guards, admitted, resolved.effect, resolved.guards));
    }
    case 'BLOCK': {
      let local = [...guards];
      for (const step of tree.prelude) {
        if (step.k === 'NARROW') {
          const variant = variantMatch(step.type, ctx.resolver.states, ctx.family);
          if (!variant) {
            ctx.debt.push({ kind: EXTRACTION_DEBT.UNREAD_ACT_FORM, detail: `narrowing to ${step.type}`, cell: cellGuards.cell });
            return [];
          }
          if (variant.symbol !== cell.state) return [outcome('REJECT', local)];
          ctx.aliases.set(step.alias, 'currentState');
        } else if (step.k === 'REQUIRE') {
          const guard = substitute(step.guard, ctx);
          ctx.requirements.add(guard);
          const rejected = outcome('REJECT', [...local, negate(guard)]);
          local = [...local, guard];
          const rest = evalTree({ ...tree, prelude: tree.prelude.slice(tree.prelude.indexOf(step) + 1) }, cell, local, ctx);
          return [rejected, ...rest];
        } else if (step.k === 'LOCAL') {
          ctx.locals.set(step.alias, substitute(step.value, ctx));
        } else if (step.k === 'GUARD') {
          const decided = evalCond(substitute(step.guard, ctx), cell, ctx);
          if (decided.v === 'F') return [outcome('REJECT', local)];
          if (decided.v === 'R') {
            const rejected = outcome('REJECT', [...local, negate(decided.text)]);
            local = [...local, decided.text];
            const rest = evalTree({ ...tree, prelude: tree.prelude.slice(tree.prelude.indexOf(step) + 1) }, cell, local, ctx);
            return [rejected, ...rest];
          }
        }
      }
      return evalTree(tree.expr, cell, local, ctx);
    }
    case 'IF': {
      const decided = evalCond(substitute(tree.cond, ctx), cell, ctx);
      if (decided.v === 'T') return evalTree(tree.then, cell, guards, ctx);
      if (decided.v === 'F') return evalTree(tree.else, cell, guards, ctx);
      return [
        ...evalTree(tree.then, cell, [...guards, decided.text], ctx),
        ...evalTree(tree.else, cell, [...guards, negate(decided.text)], ctx),
      ];
    }
    case 'WHEN': {
      const subject = tree.subject === null ? null : substitute(tree.subject, ctx);
      const axis = subject === 'currentState' || subject === 'state' ? 'state' : subject === 'control' ? 'control' : subject === null ? null : 'payload';
      const results = [];
      let pending = [...guards];
      const prior = [];
      for (const branch of tree.branches) {
        let decided;
        if (branch.conds.length === 1 && branch.conds[0] === 'else') decided = axis === 'payload' && prior.length ? { v: 'R', text: prior.map(negate).join(' && ') } : { v: 'T' };
        else if (axis === null) decided = evalCond(branch.conds.join(' || '), cell, ctx);
        else if (axis === 'payload') decided = { v: 'R', text: branch.conds.map((cond) => `${subject} == ${cond}`).join(' || ') };
        else {
          const lookup = axis === 'state' ? ctx.resolver.states : ctx.resolver.controls;
          const current = axis === 'state' ? cell.state : cell.control;
          const matched = branch.conds.map((cond) => variantMatch(cond, lookup, ctx.family));
          if (matched.some((variant) => variant === null)) {
            ctx.debt.push({ kind: EXTRACTION_DEBT.UNREAD_ACT_FORM, detail: `when(${subject}) branch ${branch.conds.join(', ')}`, cell: cellGuards.cell });
            decided = { v: 'F' };
          } else decided = { v: matched.some((variant) => variant.symbol === current) ? 'T' : 'F' };
        }
        if (axis === 'payload' && branch.conds[0] !== 'else') prior.push(decided.text);
        if (decided.v === 'F') continue;
        if (decided.v === 'T') {
          results.push(...evalTree(branch.expr, cell, pending, ctx));
          return results;
        }
        results.push(...evalTree(branch.expr, cell, [...pending, decided.text], ctx));
        if (axis !== 'payload') pending = [...pending, negate(decided.text)];
      }
      if (axis === 'payload') return results;
      // Kotlin requires exhaustive when-expressions; no branch matched means the reader missed one.
      if (!results.length) ctx.debt.push({ kind: EXTRACTION_DEBT.UNREAD_ACT_FORM, detail: `no branch of when(${subject ?? ''}) matched`, cell: cellGuards.cell });
      return results;
    }
    default:
      ctx.debt.push({ kind: EXTRACTION_DEBT.UNREAD_ACT_FORM, detail: tree.text ?? tree.k, cell: cellGuards.cell });
      return [];
  }
}

function functionBodies(text) {
  // Expression-bodied helper functions returning one value: `fun name(...): Type = expr`.
  const helpers = new Map();
  for (const match of text.matchAll(/(?:private |internal )?fun (\w+)\s*\(/g)) {
    const open = match.index + match[0].length - 1;
    const close = matchClose(text, open);
    const after = text.slice(close + 1);
    const typed = /^\s*:\s*[\w.<>?, ]+?\s*=\s*/.exec(after);
    if (!typed) continue;
    const start = close + 1 + typed[0].length;
    const end = exprEnd(text, start);
    helpers.set(match[1], text.slice(start, end).trim());
  }
  return helpers;
}

function actBody(text) {
  const match = /override fun act\s*\(/.exec(text);
  if (!match) return null;
  const open = match.index + match[0].length - 1;
  const close = matchClose(text, open);
  let i = close + 1;
  let depth = 0;
  for (; i < text.length; i += 1) {
    const c = text[i];
    if (c === '<') depth += 1;
    else if (c === '>') depth -= 1;
    else if (depth === 0 && (c === '=' || c === '{')) break;
  }
  if (text[i] === '{') return { form: 'BLOCK', text: text.slice(i, matchClose(text, i) + 1), line: lineAt(text, match.index) };
  const start = skipSpace(text, i + 1);
  if (text.startsWith('when', start)) {
    const brace = text.indexOf('{', start);
    return { form: 'EXPRESSION', text: text.slice(start, matchClose(text, brace) + 1), line: lineAt(text, match.index) };
  }
  return { form: 'EXPRESSION', text: text.slice(start, exprEnd(text, start)), line: lineAt(text, match.index) };
}

function familyFunctions(text, family, stateType) {
  const observations = [];
  const pattern = /\n    (?:internal )?fun (\w+)\s*\(/g;
  for (const match of text.matchAll(pattern)) {
    const open = match.index + match[0].length - 1;
    const close = matchClose(text, open);
    const ret = /^\s*:\s*([\w.]+)\s*(=|\{)/.exec(text.slice(close + 1));
    if (!ret) continue;
    const returned = stripQualifier(ret[1], family);
    if (returned !== stateType) continue;
    let bodyStart = close + 1 + ret[0].length - 1;
    let body;
    if (ret[2] === '{') body = text.slice(bodyStart, matchClose(text, bodyStart) + 1);
    else {
      bodyStart = skipSpace(text, bodyStart + 1);
      if (text.startsWith('when', bodyStart)) body = text.slice(bodyStart, matchClose(text, text.indexOf('{', bodyStart)) + 1);
      else body = text.slice(bodyStart, exprEnd(text, bodyStart));
    }
    observations.push({ name: match[1], params: parseParams(text.slice(open + 1, close)), body: stripComments(body), line: lineAt(text, match.index + 1) });
  }
  return observations;
}

function successorVariants(body, states, family) {
  const found = new Set();
  const clean = body.replace(/"[^"]*"/g, '""');
  for (const variant of states) {
    const names = [variant.symbol, `${family}.${variant.symbol}`, variant.name];
    const pattern = new RegExp(`(?:->|=|return|\\belse\\b|\\)|^)\\s*(?:${names.map((name) => name.replace(/\./g, '\\.')).join('|')})\\b(?!\\s*\\.)`, 'm');
    if (pattern.test(clean)) found.add(variant.symbol);
  }
  return [...found].sort();
}

function displayControls(text, family, stateType, states, controls, consts) {
  const match = /override fun displayStateFor\s*\(/.exec(text);
  if (!match) return null;
  const open = match.index + match[0].length - 1;
  const close = matchClose(text, open);
  // A displayStateFor that builds one DisplayState without branching projects every State the same
  // way and claims no per-state Controls; only a `when` inside its own body is read per State.
  const next = /\n {0,4}(?:override |private |internal |public )?(?:fun|val|const|data|sealed|object|enum|\})\b/g;
  next.lastIndex = close;
  const bodyEnd = next.exec(text)?.index ?? text.length;
  const whenAt = text.indexOf('when', close);
  // One DisplayState for every State: each State is projected, and no Control is claimed per State.
  if (whenAt < 0 || whenAt > bodyEnd) return states.map((state) => ({ state: state.symbol, controls: [] }));
  const brace = text.indexOf('{', whenAt);
  const tree = parseWhen(text.slice(whenAt, matchClose(text, brace) + 1));
  const controlByConst = new Map();
  for (const [name, value] of consts) {
    const control = controls.find((candidate) => candidate.ref === value);
    if (control) controlByConst.set(name, control.symbol);
  }
  const rows = [];
  const lookup = makeResolver(states, controls);
  const branchText = (expr) => JSON.stringify(expr);
  for (const branch of tree.branches) {
    const targets = branch.conds[0] === 'else'
      ? states.filter((state) => !rows.some((row) => row.state === state.symbol)).map((state) => state.symbol)
      : branch.conds.map((cond) => variantMatch(cond, lookup.states, family)?.symbol).filter(Boolean);
    const body = branchText(branch.expr);
    const offered = new Set();
    for (const [name, symbol] of controlByConst) if (new RegExp(`\\b${name}\\b`).test(body)) offered.add(symbol);
    for (const control of controls) if (new RegExp(`primary\\s*=\\s*${control.name}\\s+to\\b`).test(body)) offered.add(control.symbol);
    for (const state of targets) rows.push({ state, controls: [...offered].sort() });
  }
  return rows;
}

function availabilityLaw(text, consts) {
  const match = /fun lawfulControls\s*\(/.exec(text);
  if (!match) return [];
  const open = text.indexOf('{', matchClose(text, match.index + match[0].length - 1));
  const body = stripComments(text.slice(open + 1, matchClose(text, open)));
  const locals = new Map();
  for (const local of body.matchAll(/val (\w+)\s*=\s*([\s\S]*?)\n\s*(?=return|val )/g)) locals.set(local[1], compactText(local[2]));
  const rows = [];
  for (const guarded of body.matchAll(/if\s*\(/g)) {
    const condOpen = guarded.index + guarded[0].length - 1;
    const condClose = matchClose(body, condOpen);
    const blockOpen = body.indexOf('{', condClose);
    const block = body.slice(blockOpen + 1, matchClose(body, blockOpen));
    const added = /add\(\s*(\w+)\s*,?\s*\)/.exec(block);
    if (!added || !consts.has(added[1])) continue;
    let guard = compactText(body.slice(condOpen + 1, condClose));
    for (const [alias, value] of locals) guard = guard.replace(new RegExp(`\\b${alias}\\b`, 'g'), `(${value})`);
    rows.push({ controlRef: consts.get(added[1]), controlConst: added[1], guard, line: lineAt(text, open + 1 + guarded.index) });
  }
  return rows;
}

export function readFamilyLaw({ path, text }) {
  assert(typeof path === 'string' && path.endsWith('.kt'), 'family source path must name one Kotlin file');
  assert(typeof text === 'string' && text.length > 0, `family source ${path} must be non-empty text`);
  const consts = constTable(text);
  const enums = enumTable(text);
  const contract = /(?:object|class) (\w+)(?:\s+(?:private|internal)\s+constructor\s*\(\s*\))?\s*:\s*VexFamilyContract\s*</.exec(text);

  if (!contract) {
    const plain = /object (\w+)\s*\{/.exec(text);
    assert(plain, `${path} declares no Family object`);
    const family = plain[1];
    const stateDecl = /data class State\s*\(/.exec(text);
    const axes = stateDecl ? parseParams(text.slice(stateDecl.index + stateDecl[0].length, matchClose(text, stateDecl.index + stateDecl[0].length - 1))) : [];
    const availability = availabilityLaw(text, consts);
    return Object.freeze({
      schemaVersion: EXPERIENCE_FAMILY_LAW_SCHEMA,
      family,
      sourcePath: path,
      contractForm: FAMILY_CONTRACT_FORMS.AVAILABILITY_ONLY,
      stateShape: 'AXES',
      states: [{ symbol: 'State', name: 'State', form: 'CLASS', ref: 'State', refSource: 'SYMBOL', params: axes, line: stateDecl ? lineAt(text, stateDecl.index) : 1 }],
      controls: availability.map((row) => ({ symbol: row.controlConst, name: row.controlConst, form: 'CONSTANT', ref: row.controlRef, refSource: 'CONSTANT', params: [], line: row.line })),
      effects: [],
      enums: Object.fromEntries(enums),
      cells: [],
      availability,
      observations: [],
      projection: null,
      debt: [{ kind: EXTRACTION_DEBT.MISSING_ACT_LAW, detail: `${family} offers Controls through lawfulControls() but declares no State + Control -> Act law or Effect vocabulary`, cell: null }],
    });
  }

  const family = contract[1];
  const genericOpen = text.indexOf('<', contract.index + contract[0].length - 2);
  const generic = splitArgs(text.slice(genericOpen + 1, matchClose(text, genericOpen))).map((arg) => stripQualifier(arg.value, family));
  assert(generic.length === 4, `${path} VexFamilyContract must carry Family, State, Control, Effect`);
  const [, stateType, controlType, effectType] = generic;
  const decls = declarations(text, family);
  const axisState = decls.find((decl) => decl.name === stateType && decl.form === 'CLASS' && decl.params.length);
  const states = axisState
    ? [{ symbol: stateType, name: stateType, form: 'CLASS', ref: stateType, refSource: 'SYMBOL', params: axisState.params, line: axisState.line }]
    : variantsOf(decls, stateType, family, consts, 'stateRef');
  const controls = variantsOf(decls, controlType, family, consts, 'controlRef');
  const effects = variantsOf(decls, effectType, family, consts, 'effectRef');
  const nestedEnums = {};
  for (const decl of decls) {
    if (decl.form === 'OBJECT' && decl.name !== family && decl.supers.length === 1 && !/VexFamilyContract/.test(decl.supers[0]) && !decl.supers.some((value) => [stateType, controlType, effectType].includes(stripQualifier(value, family)))) {
      (nestedEnums[stripQualifier(decl.supers[0], family)] ??= []).push(decl.name);
    }
  }

  const ctx = {
    family,
    resolver: makeResolver(states, controls),
    effects,
    helpers: functionBodies(text),
    helperStack: [],
    aliases: new Map(),
    locals: new Map(),
    requirements: new Set(),
    debt: [],
  };

  const body = actBody(text);
  const cells = [];
  if (body) {
    const tree = body.form === 'BLOCK' ? parseBlock(body.text.slice(1, -1)) : parseExpr(body.text);
    for (const state of states) {
      for (const control of controls) {
        ctx.aliases = new Map();
        const cell = { state: state.symbol, control: control.symbol };
        const outcomes = evalTree(tree, cell, [], ctx).map((value) => ({
          ...value,
          guards: value.guards.map((guard) => {
            let expanded = guard;
            for (const [alias, local] of ctx.locals) expanded = expanded.replace(new RegExp(`\\b${alias}\\b`, 'g'), `(${local})`);
            return expanded;
          }),
        }));
        cells.push(Object.freeze({ state: state.symbol, control: control.symbol, outcomes: Object.freeze(outcomes) }));
      }
    }
  } else {
    ctx.debt.push({ kind: EXTRACTION_DEBT.MISSING_ACT_LAW, detail: `${family} has no act()`, cell: null });
  }

  const observations = familyFunctions(text, family, stateType).map((fn) => Object.freeze({
    function: fn.name,
    params: fn.params,
    successors: successorVariants(fn.body, states, family),
    takesCurrentState: fn.params.some((param) => stripQualifier(param.type, family) === stateType),
    line: fn.line,
  }));

  const uniqueDebt = [];
  const seen = new Set();
  for (const item of ctx.debt) {
    const key = `${item.kind}|${item.detail}|${item.cell}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueDebt.push(Object.freeze(item));
    }
  }

  // How executable code reaches this Family's law: the object itself, or a companion instance.
  const isObject = new RegExp(`object ${family}\\b`).test(text);
  const companionInstance = new RegExp(`val (\\w+)\\s*=\\s*${family}\\(\\)`).exec(text);
  const instance = isObject ? family : companionInstance ? `${family}.${companionInstance[1]}` : null;

  return Object.freeze({
    schemaVersion: EXPERIENCE_FAMILY_LAW_SCHEMA,
    family,
    instance,
    sourcePath: path,
    contractForm: FAMILY_CONTRACT_FORMS.VEX_FAMILY_CONTRACT,
    stateShape: axisState ? 'AXES' : 'VARIANTS',
    types: Object.freeze({ state: stateType, control: controlType, effect: effectType }),
    actLine: body?.line ?? null,
    states: Object.freeze(states),
    controls: Object.freeze(controls),
    effects: Object.freeze(effects),
    enums: Object.freeze({ ...Object.fromEntries(enums), ...nestedEnums }),
    cells: Object.freeze(cells),
    requirements: Object.freeze([...ctx.requirements].sort()),
    availability: [],
    observations: Object.freeze(observations),
    projection: displayControls(text, family, stateType, states, controls, consts),
    debt: Object.freeze(uniqueDebt),
  });
}

// [VXG RealForever][VEXWORK][VEXLIFE-PROD][E2E][EXPERIENCE-GRAPH][FAMILY-LAW]
