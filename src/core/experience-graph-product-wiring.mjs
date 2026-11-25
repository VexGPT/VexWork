// Experience Relationship Graph — VexLife-Prod wiring readers.
//
// Family law says what a Control means. These readers find where that meaning meets the rest of
// the Product, using only coordinates the Product already owns:
//
//   readLensSurface        Product Screen Lens export -> element bindings, pathway depth
//   readRealizationSites   source branches that realize a Family Effect / return outside truth
//   readSendBoundary       accepted-Send capture: Intent fields, their current-truth sources,
//                          admission gates and the prompt Receipt evidence they reach
//
// Nothing is inferred from names alone. A reader either finds the exact source coordinate or
// leaves the relationship absent for the frontier validator to report.
//
// Pure: callers supply file text; no file system, network or Kotlin execution.

import { kdocBefore, matchClose, splitArgs, stripComments } from './vexboard-kotlin-source.mjs';

export const EXPERIENCE_WIRING_SCHEMA = 'vexwork.experience-graph.product-wiring/v1';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

const lineAt = (text, index) => text.slice(0, index).split('\n').length;
const compactText = (value) => String(value).replace(/\s+/g, ' ').trim();
const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// ---- Screen Lens surface ------------------------------------------------------------------

const LENS_SOURCE = /^(common|jvm|js):(.+)$/;

function lensSourcePath(source) {
  if (!source) return null;
  const match = LENS_SOURCE.exec(source);
  return match ? `src/${match[1]}Main/kotlin/vexlife/${match[2]}` : null;
}

function lensControlSelectors(control) {
  if (!control) return [];
  const label = String(control.label ?? '');
  const parameterized = [...label.matchAll(/\bControl\.([A-Za-z_][A-Za-z0-9_]*)\b/g)]
    .map((match) => match[1]);
  if (parameterized.length) return [...new Set(parameterized)];
  return label.split('·').map((value) => value.trim()).filter(Boolean);
}

export function readLensSurface(lens) {
  assert(lens?.schemaVersion === 'vexboard.screen-lens/v1', 'Product Screen Lens schema mismatch');
  const pathways = new Map(lens.pathways.map((pathway) => [pathway.pathwayRef, pathway]));
  const elements = [];
  for (const screen of lens.screens) {
    for (const element of screen.elements) {
      const intent = element.intent ? /^(capability|local)\s+(\S+)$/.exec(element.intent) : null;
      elements.push(Object.freeze({
        elementRef: element.ref,
        kind: element.kind,
        label: element.label ?? null,
        symbol: element.symbol ?? null,
        bindingKind: intent ? intent[1].toUpperCase() : null,
        bindingTarget: intent ? intent[2] : null,
        pathwayRef: element.pathwayRef ?? null,
        screenRef: screen.screenRef,
      }));
    }
  }

  const familyPathways = [];
  for (const pathway of lens.pathways) {
    const role = (name) => pathway.nodes.filter((node) => node.role === name);
    const control = role('CONTROL')[0] ?? null;
    const family = control ? control.symbol.replace(/\.Control$/, '') : null;
    const controlRefs = lensControlSelectors(control);
    const method = role('METHOD')[0] ?? null;
    const effect = role('EFFECT')[0] ?? null;
    const projection = role('PROJECTION')[0] ?? null;
    const observation = role('OBSERVATION')[0] ?? null;
    const dispatch = role('DISPATCH')[0] ?? null;
    // Depth nodes reached from the Effect node (or the method), in pathway edge order.
    const byRef = new Map(pathway.nodes.map((node) => [node.ref, node]));
    const after = (start) => {
      const chain = [];
      let cursor = start;
      const seen = new Set();
      for (;;) {
        const next = pathway.edges.find((edge) => edge.from === cursor && edge.kind !== 'RETURN');
        if (!next || seen.has(next.to)) break;
        seen.add(next.to);
        chain.push(byRef.get(next.to));
        cursor = next.to;
      }
      return chain;
    };
    const depthFrom = effect ?? method;
    const depth = depthFrom ? after(depthFrom.ref).filter((node) => node && node.face === 'DEPTH') : [];
    const node = (value) => (value ? Object.freeze({
      ref: value.ref,
      role: value.role,
      label: value.label,
      symbol: value.symbol,
      sourcePath: lensSourcePath(value.source),
    }) : null);
    familyPathways.push(Object.freeze({
      pathwayRef: pathway.pathwayRef,
      disposition: pathway.disposition,
      family,
      controlRefs: Object.freeze(controlRefs),
      dispatch: node(dispatch),
      method: node(method),
      projection: node(projection),
      observation: node(observation),
      depth: Object.freeze(depth.map(node)),
      returnRef: pathway.returnRef ?? null,
    }));
    void pathways;
  }

  return Object.freeze({
    schemaVersion: EXPERIENCE_WIRING_SCHEMA,
    lensRef: lens.lensRef,
    elements: Object.freeze(elements),
    pathways: Object.freeze(familyPathways),
  });
}

// ---- realization sites --------------------------------------------------------------------

// The innermost class/object whose body contains `index` (a data class or interface that merely
// precedes the site is not its owner).
const ownerCache = new WeakMap();
function ownerBodies(text) {
  const bodies = [];
  for (const match of text.matchAll(/(?:^|\n)[ \t]*(?:(?:private|internal|public|abstract|open|sealed)\s+)*(class|object)\s+(\w+)/g)) {
    let i = match.index + match[0].length;
    // Skip an optional (private) constructor parameter list, then the supertype list, to the body.
    const header = /^\s*(?:(?:private|internal)\s+constructor\s*)?\(/.exec(text.slice(i));
    if (header) i = matchClose(text, i + header[0].length - 1) + 1;
    let depth = 0;
    let open = -1;
    for (; i < text.length; i += 1) {
      const c = text[i];
      if (c === '(' || c === '<') depth += 1;
      else if (c === ')' || c === '>') depth -= 1;
      else if (depth === 0 && c === '{') { open = i; break; }
      else if (depth === 0 && c === '\n' && /^\s*(?:\n|(?:private |internal |data |sealed |enum |fun |val |class |object |\/\/|\/\*|@))/.test(text.slice(i + 1, i + 40))) break;
    }
    if (open < 0) continue;
    let close;
    try { close = matchClose(text, open); } catch { continue; }
    bodies.push({ name: match[2], open, close });
  }
  return bodies;
}

function enclosingOwner(text, index, file) {
  let bodies = file ? ownerCache.get(file) : null;
  if (!bodies) {
    bodies = ownerBodies(text);
    if (file) ownerCache.set(file, bodies);
  }
  const containing = bodies.filter((body) => body.open < index && index < body.close);
  return containing.sort((a, b) => b.open - a.open)[0]?.name ?? null;
}

// Typed owners a realization branch calls: `receiver.method(` where the receiver is a property whose
// type the same file declares or constructs. The branch ends at the first later line indented no
// deeper than the branch head.
const typeCache = new WeakMap();
// Kotlin / JDK library values are local data, not Product owners a realization delegates to.
const LIBRARY_TYPES = new Set([
  'Any', 'Boolean', 'ByteArray', 'Double', 'Duration', 'File', 'Files', 'Float', 'Instant', 'Int', 'Json',
  'List', 'Long', 'Map', 'MutableList', 'MutableMap', 'MutableSet', 'Object', 'Pair', 'Path', 'Paths',
  'Regex', 'Result', 'Set', 'String', 'StringBuilder', 'Thread', 'Triple', 'Unit',
]);
function branchDelegates(text, index, file) {
  let types = typeCache.get(file);
  if (!types) {
    types = propertyTypes(text);
    typeCache.set(file, types);
  }
  const lineStart = text.lastIndexOf('\n', index) + 1;
  const indent = /^[ \t]*/.exec(text.slice(lineStart))[0].length;
  const lines = text.slice(lineStart).split('\n');
  const body = [lines[0]];
  for (const line of lines.slice(1, 40)) {
    if (line.trim() && /^[ \t]*/.exec(line)[0].length <= indent) break;
    body.push(line);
  }
  const delegates = new Map();
  for (const match of body.join('\n').matchAll(/\b(\w+)\.(\w+)\s*\(/g)) {
    const type = types.get(match[1]);
    if (type && !LIBRARY_TYPES.has(type.split('.')[0]) && !delegates.has(type)) delegates.set(type, { receiver: match[1], method: match[2], type });
  }
  return [...delegates.values()];
}

// Effects realized by a JVM owner (when-branch on the Effect) or carried into the generated browser
// runtime (the Effect's ref constant interpolated into runtime source), plus observation call sites.
export function readRealizationSites({ families, files }) {
  assert(Array.isArray(families) && Array.isArray(files), 'realization reader needs Family law and source files');
  const sites = [];
  const returns = [];
  for (const law of families) {
    const ownFile = law.sourcePath;
    for (const effect of law.effects) {
      const forms = [
        `${law.family}.${effect.symbol}`,
        effect.symbol.startsWith('Effect.') ? null : `${law.family}.Effect.${effect.name}`,
      ].filter(Boolean);
      const handler = new RegExp(`(?:\\bis\\s+)?(?:${forms.map(escape).join('|')})\\b(?:\\s*\\(|\\s*->)`, 'g');
      const constName = effect.refSource === 'CONSTANT' ? `Effect${effect.name}` : null;
      const runtime = constName ? new RegExp(`\\$\\{jsString\\(${escape(law.family)}\\.${escape(constName)}\\)\\}`, 'g') : null;
      for (const file of files) {
        if (file.path === ownFile) continue;
        const clean = file.text;
        for (const match of clean.matchAll(handler)) {
          const tail = clean.slice(match.index, match.index + match[0].length + 160);
          if (!/->/.test(tail.split('\n')[0]) && !/^\s*(?:is\s+)?[\w.]+\s*->/.test(tail)) continue;
          sites.push({ family: law.family, effect: effect.symbol, owner: enclosingOwner(clean, match.index, file), sourcePath: file.path, line: lineAt(clean, match.index), realizationClass: 'JVM_OWNER', delegates: branchDelegates(clean, match.index, file) });
        }
        if (runtime) {
          for (const match of clean.matchAll(runtime)) {
            sites.push({ family: law.family, effect: effect.symbol, owner: enclosingOwner(clean, match.index, file), sourcePath: file.path, line: lineAt(clean, match.index), realizationClass: 'BROWSER_RUNTIME' });
          }
        }
      }
    }
    for (const observation of law.observations) {
      const call = new RegExp(`\\b${escape(law.family)}\\.${escape(observation.function)}\\s*\\(`, 'g');
      for (const file of files) {
        if (file.path === ownFile) continue;
        for (const match of file.text.matchAll(call)) {
          returns.push({ family: law.family, observation: observation.function, owner: enclosingOwner(file.text, match.index, file), sourcePath: file.path, line: lineAt(file.text, match.index), returnForm: 'FAMILY_OBSERVATION' });
        }
      }
    }
    // An owner that hands back the Family's State type is also a reconciliation boundary:
    // `fun state(): Family.State` (whole-State return) or `Family.State(...)` (axis-State formation).
    if (law.types) {
      const stateType = `${law.family}.${law.types.state}`;
      const returnsState = new RegExp(`fun (\\w+)\\s*\\([^)]*\\)\\s*:\\s*${escape(stateType)}\\b`, 'g');
      const formsState = law.stateShape === 'AXES' ? new RegExp(`\\b${escape(stateType)}\\s*\\(`, 'g') : null;
      for (const file of files) {
        if (file.path === ownFile) continue;
        for (const match of file.text.matchAll(returnsState)) {
          const owner = enclosingOwner(file.text, match.index, file);
          returns.push({ family: law.family, observation: `${owner}.${match[1]}`, owner, sourcePath: file.path, line: lineAt(file.text, match.index), returnForm: 'OWNER_RETURNS_STATE' });
        }
        if (formsState) {
          for (const match of file.text.matchAll(formsState)) {
            const owner = enclosingOwner(file.text, match.index, file);
            returns.push({ family: law.family, observation: `${owner}:forms-state`, owner, sourcePath: file.path, line: lineAt(file.text, match.index), returnForm: 'OWNER_FORMS_STATE' });
          }
        }
      }
    }
  }
  const unique = (rows, key) => {
    const seen = new Map();
    for (const row of rows) {
      const k = key(row);
      if (!seen.has(k)) seen.set(k, { ...row, lines: [row.line] });
      else seen.get(k).lines.push(row.line);
    }
    return [...seen.values()].map(({ line, ...row }) => Object.freeze({ ...row, line: row.lines[0], lines: Object.freeze(row.lines) }));
  };
  return Object.freeze({
    schemaVersion: EXPERIENCE_WIRING_SCHEMA,
    realizations: Object.freeze(unique(sites, (row) => `${row.family}|${row.effect}|${row.owner}|${row.sourcePath}|${row.realizationClass}`)),
    returns: Object.freeze(unique(returns, (row) => `${row.family}|${row.observation}|${row.owner}|${row.sourcePath}|${row.returnForm}`)),
  });
}

// ---- untyped Control literals in the generated presentation ------------------------------

// A Family Control ref spelled as a raw string literal inside generated runtime source is a
// manifestation the typed graph cannot see. It is evidence for a frontier, never an edge.
export function readUntypedControlLiterals({ families, files }) {
  const rows = [];
  for (const law of families) {
    for (const control of law.controls) {
      if (control.refSource !== 'CONSTANT') continue;
      const literal = new RegExp(`controlRef\\s*===\\s*'${escape(control.ref)}'`, 'g');
      for (const file of files) {
        for (const match of file.text.matchAll(literal)) {
          rows.push(Object.freeze({ family: law.family, control: control.symbol, controlRef: control.ref, sourcePath: file.path, line: lineAt(file.text, match.index) }));
        }
      }
    }
  }
  return Object.freeze(rows);
}

// ---- accepted-Send boundary ---------------------------------------------------------------

function dataClassFields(text, qualifiedOwner, className) {
  const match = new RegExp(`data class ${escape(className)}(?:\\s+internal constructor)?\\s*\\(`).exec(text);
  if (!match) return [];
  const open = match.index + match[0].length - 1;
  const body = text.slice(open + 1, matchClose(text, open));
  const fields = [];
  for (const field of body.matchAll(/(?:^|\n)[ \t]*(?:@[\w.]+(?:\([^)]*\))?\s*)*val (\w+)\s*:\s*([^=,\n]+)/g)) {
    const at = field.index + field[0].indexOf('val ');
    fields.push(Object.freeze({
      owner: qualifiedOwner,
      name: field[1],
      type: compactText(field[2]),
      doc: kdocBefore(body, body.lastIndexOf('\n', at) + 1 + (/^[ \t]*/.exec(body.slice(body.lastIndexOf('\n', at) + 1))[0].length)),
      line: lineAt(text, open + 1 + at),
    }));
  }
  return fields;
}

function functionBody(text, name) {
  const match = new RegExp(`fun ${escape(name)}\\s*\\(`).exec(text);
  if (!match) return null;
  const close = matchClose(text, match.index + match[0].length - 1);
  const after = text.slice(close + 1);
  const eq = /^\s*:\s*[^={]+?\s*=\s*/.exec(after);
  const brace = /^\s*(?::\s*[^={]+?)?\s*\{/.exec(after);
  if (eq && (!brace || eq[0].length < brace[0].length)) {
    // An expression body ends at the next line indented no deeper than the `fun` itself.
    const start = close + 1 + eq[0].length;
    const funLine = text.slice(text.lastIndexOf('\n', match.index) + 1);
    const indent = /^[ \t]*/.exec(funLine)[0].length;
    let end = text.length;
    let depth = 0;
    for (let i = start; i < text.length; i += 1) {
      const c = text[i];
      if ('({['.includes(c)) depth += 1;
      else if (')}]'.includes(c)) {
        if (depth === 0) { end = i; break; }
        depth -= 1;
      } else if (c === '\n' && depth === 0) {
        const next = text.slice(i + 1).split('\n').find((line) => line.trim());
        if (next !== undefined && /^[ \t]*/.exec(next)[0].length <= indent) { end = i; break; }
      }
    }
    return { start, text: text.slice(start, end), line: lineAt(text, match.index) };
  }
  if (brace) {
    const open = close + brace[0].length;
    return { start: open, text: text.slice(open, matchClose(text, open) + 1), line: lineAt(text, match.index) };
  }
  return null;
}

// Declared or constructor-initialized property types: `val x: T` and `val x = T(...)`.
function propertyTypes(text) {
  const types = new Map();
  for (const match of text.matchAll(/(?:private |internal )?val (\w+)\s*(?::\s*([\w.]+)|=\s*\n?\s*([A-Z][\w.]*)\s*\()/g)) {
    // `Type.factory(...)` names Type; a lower-case last segment is the factory, not the type.
    const named = (match[2] ?? match[3]).split('.');
    while (named.length > 1 && /^[a-z]/.test(named.at(-1))) named.pop();
    if (!types.has(match[1])) types.set(match[1], named.join('.'));
  }
  return types;
}

// Receivers whose current value an expression reads: `x.read()`, `x.readActive(...)`, `request.y`.
function readSources(expression, types, serviceText) {
  const sources = [];
  for (const match of expression.matchAll(/\b(\w+)\.(read\w*)\s*\(/g)) {
    sources.push({ receiver: match[1], method: match[2], ownerType: types.get(match[1]) ?? null });
  }
  for (const match of expression.matchAll(/\b(request)\.(\w+)/g)) sources.push({ receiver: match[1], method: match[2], ownerType: 'PRESENTATION_REQUEST' });
  for (const match of expression.matchAll(/\b(\w+)\(\s*\)/g)) {
    const helper = functionBody(serviceText, match[1]);
    if (helper && !/^(read|readActive)$/.test(match[1])) {
      for (const inner of helper.text.matchAll(/\b(\w+)\.(read\w*)\s*\(/g)) sources.push({ receiver: inner[1], method: inner[2], ownerType: types.get(inner[1]) ?? null, via: match[1] });
    }
  }
  const seen = new Set();
  return sources.filter((source) => {
    const key = `${source.receiver}.${source.method}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function readSendBoundary({ turnSource, promptSource, serviceSource }) {
  for (const [label, file] of Object.entries({ turnSource, promptSource, serviceSource })) {
    assert(typeof file?.path === 'string' && typeof file?.text === 'string', `${label} must be one source file`);
  }
  const turnText = stripComments(turnSource.text).length ? turnSource.text : '';
  const allIntentFields = dataClassFields(turnText, 'DirectCompanionTurn.Intent', 'Intent');
  const idempotency = allIntentFields.find((field) => field.name === 'idempotencyKey') ?? null;
  const intentFields = allIntentFields.filter((field) => !['idempotencyKey', 'content'].includes(field.name));

  const service = serviceSource.text;
  const types = propertyTypes(service);
  const build = functionBody(service, 'sendIntent');
  const captures = [];
  if (build) {
    const call = /DirectCompanionTurn\.Intent\s*\(/.exec(build.text);
    if (call) {
      const open = build.text.indexOf('(', call.index);
      for (const arg of splitArgs(build.text.slice(open + 1, matchClose(build.text, open)), { withRaw: true })) {
        const field = intentFields.find((candidate) => candidate.name === arg.name);
        if (!field) continue;
        captures.push(Object.freeze({
          field: field.name,
          fieldDoc: field.doc,
          expression: compactText(arg.raw),
          sources: Object.freeze(readSources(arg.raw, types, service)),
          sourcePath: serviceSource.path,
          line: lineAt(service, build.start + build.text.indexOf(`${arg.name} =`, open)),
        }));
      }
    }
  }

  // Admission gates in the handler that builds the Intent: a Family State test answered with a
  // refusal before the Send is accepted.
  const gates = [];
  const handlerCall = service.indexOf('sendIntent(\n');
  const handlerStart = handlerCall >= 0 ? service.lastIndexOf('fun ', handlerCall) : -1;
  if (handlerStart >= 0) {
    const handlerText = service.slice(handlerStart, handlerCall);
    for (const match of handlerText.matchAll(/if\s*\(/g)) {
      const open = match.index + match[0].length - 1;
      const close = matchClose(handlerText, open);
      const condition = compactText(handlerText.slice(open + 1, close));
      const after = handlerText.slice(close + 1, close + 400);
      const refusal = /respondError\(\s*exchange,\s*(\d+),\s*"([A-Z_]+)"/.exec(after);
      if (!refusal) continue;
      const family = /\b(VexLife\w+Family)\.(\w+)\b/.exec(condition);
      const receiver = /^!?\s*(\w+)\.(\w+)\s*\(/.exec(condition);
      gates.push(Object.freeze({
        condition,
        refusalCode: refusal[2],
        status: Number(refusal[1]),
        family: family ? family[1] : null,
        state: family ? family[2] : null,
        receiverType: receiver ? types.get(receiver[1]) ?? null : null,
        receiverMethod: receiver ? receiver[2] : null,
        sourcePath: serviceSource.path,
        line: lineAt(service, handlerStart + match.index),
      }));
    }
  }

  // Receipt fields formed from the captured Intent values (same identifier flow).
  const prompt = promptSource.text;
  const receiptFields = dataClassFields(prompt, 'DirectPromptContext.Receipt', 'Receipt');
  const evidence = [];
  for (const capture of captures) {
    const stem = capture.field;
    for (const field of receiptFields) {
      const flows = new RegExp(`\\b${escape(field.name)}\\s*=\\s*[^\\n]*\\b(?:turnContext\\.)?${escape(stem)}\\b`).test(prompt);
      if (flows && field.name.startsWith(stem.replace(/Context$|Profile$/, ''))) {
        evidence.push(Object.freeze({ field: capture.field, receiptField: field.name, sourcePath: promptSource.path, line: field.line }));
      }
    }
  }

  return Object.freeze({
    schemaVersion: EXPERIENCE_WIRING_SCHEMA,
    intentOwner: 'DirectCompanionTurn.Intent',
    intentSourcePath: turnSource.path,
    intentFields: Object.freeze(intentFields),
    idempotency,
    captures: Object.freeze(captures),
    gates: Object.freeze(gates),
    receipt: Object.freeze(evidence),
  });
}

// [VXG RealForever][VEXWORK][VEXLIFE-PROD][E2E][EXPERIENCE-GRAPH][PRODUCT-WIRING]
