// Experience Relationship Graph — deterministic Family-law proof (execution class A).
//
// graph + Family law
// -> fixture plan derived from Product source (declared variants, enum entries, constructor
//    require(Regex(...)) patterns)
// -> generated Kotlin probe that calls each Family's real `resolve(state, control)`
// -> evidence rows (produced by running the probe against the pinned, unmodified Product)
// -> compareLawEvidence(): every executed cell must land in the outcome set the graph claims
//
// The probe is VexWork-owned and is only ever placed into a throwaway copy of the Product checkout.
// Unconstructible fixtures become test-seam debt (class F), never invented values.
//
// Pure: plans and compares; it does not run Kotlin itself.

import { matchClose } from './vexboard-kotlin-source.mjs';
import { canonicalJson, graphIndex, lawFingerprint, sha256 } from './experience-graph.mjs';

export const LAW_PROBE_SCHEMA = 'vexwork.experience-graph.law-probe/v1';
export const LAW_EVIDENCE_SCHEMA = 'vexwork.experience-graph.law-evidence/v1';
export const CELL_RESULTS = Object.freeze(['PASS', 'PASS_PARTIAL', 'FAIL', 'FIXTURE_REJECTED', 'NOT_RUN']);

const MAX_FIXTURES = 8;
const compare = (left, right) => (left < right ? -1 : left > right ? 1 : 0);

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

// ---- external enum index ---------------------------------------------------------------------

export function indexEnums(files) {
  const index = new Map();
  for (const file of files) {
    const pkg = /^package ([\w.]+)/m.exec(file.text)?.[1] ?? null;
    const owners = [];
    for (const match of file.text.matchAll(/(?:^|\n)[ \t]*(?:(?:data|sealed|private|internal)\s+)*(?:object|class)\s+(\w+)[^{\n]*\{/g)) {
      const open = match.index + match[0].length - 1;
      try { owners.push({ name: match[1], open, close: matchClose(file.text, open) }); } catch { /* unbalanced: skip */ }
    }
    for (const match of file.text.matchAll(/enum class (\w+)\s*(\([^)]*\))?\s*\{/g)) {
      const open = file.text.indexOf('{', match.index + match[0].length - 1);
      const body = file.text.slice(open + 1, matchClose(file.text, open)).split(';')[0];
      const entries = [];
      let depth = 0;
      let token = '';
      for (const c of `${body},`) {
        if ('({['.includes(c)) depth += 1;
        else if (')}]'.includes(c)) depth -= 1;
        if (depth === 0 && c === ',') {
          const name = /([A-Z]\w*)\s*(?:\(|$)/.exec(token.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, '').trim());
          if (name) entries.push(name[1]);
          token = '';
        } else token += c;
      }
      const chain = owners.filter((owner) => owner.open < match.index && match.index < owner.close).sort((a, b) => a.open - b.open).map((owner) => owner.name);
      const qualified = [pkg, ...chain, match[1]].filter(Boolean).join('.');
      for (const key of [match[1], [...chain, match[1]].join('.')]) {
        if (!index.has(key)) index.set(key, { qualified, entries });
      }
    }
  }
  return index;
}

// ---- string fixtures from require(Regex(...)) -----------------------------------------------

function exampleForRegex(pattern, variant) {
  const out = [];
  let i = 0;
  const source = pattern.replace(/^\^/, '').replace(/\$$/, '');
  const pick = (chars) => chars[(variant + out.length) % chars.length];
  while (i < source.length) {
    let unit;
    if (source[i] === '\\') {
      unit = [source[i + 1]];
      i += 2;
    } else if (source[i] === '[') {
      const end = source.indexOf(']', i);
      if (end < 0) return null;
      const spec = source.slice(i + 1, end);
      const chars = [];
      for (let k = 0; k < spec.length; k += 1) {
        if (spec[k + 1] === '-' && spec[k + 2]) {
          for (let code = spec.charCodeAt(k); code <= spec.charCodeAt(k + 2); code += 1) chars.push(String.fromCharCode(code));
          k += 2;
        } else chars.push(spec[k]);
      }
      unit = chars;
      i = end + 1;
    } else if ('()|.'.includes(source[i])) {
      return null;
    } else {
      unit = [source[i]];
      i += 1;
    }
    let count = 1;
    const quantifier = /^\{(\d+)(?:,(\d*))?\}|^[+*?]/.exec(source.slice(i));
    if (quantifier) {
      count = quantifier[1] ? Number(quantifier[1]) : quantifier[0] === '*' || quantifier[0] === '?' ? 1 : 1;
      if (quantifier[0] === '+' && count < 1) count = 1;
      i += quantifier[0].length;
    }
    for (let n = 0; n < count; n += 1) out.push(unit.length > 1 ? pick(unit) : unit[0]);
  }
  return out.join('');
}

function requiredPattern(text, className, param) {
  const match = new RegExp(`(?:data )?class ${className}\\s*\\(`).exec(text);
  if (!match) return null;
  const close = matchClose(text, match.index + match[0].length - 1);
  const brace = /^[^{\n]*\{/.exec(text.slice(close + 1));
  if (!brace) return null;
  const open = close + brace[0].length;
  const body = text.slice(open, matchClose(text, open));
  const regex = new RegExp(`${param}\\s*\\.matches\\(\\s*Regex\\(\\s*"((?:[^"\\\\]|\\\\.)*)"`).exec(body);
  return regex ? regex[1].replace(/\\\\/g, '\\') : null;
}

// ---- fixture planning ------------------------------------------------------------------------

function kotlinString(value) {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\$/g, '\\$')}"`;
}

function product(lists) {
  let out = [[]];
  for (const list of lists) {
    const next = [];
    for (const prefix of out) for (const item of list) next.push([...prefix, item]);
    out = next;
    if (out.length > MAX_FIXTURES * 4) out = out.slice(0, MAX_FIXTURES * 4);
  }
  return out;
}

function fixturesForType(type, context, depth) {
  const nullable = type.endsWith('?');
  const base = type.replace(/\?$/, '').trim();
  const withNull = (values) => (nullable ? [...values, 'null'] : values);
  if (base === 'Boolean') return withNull(['true', 'false']);
  if (base === 'Int') return withNull(['0']);
  if (base === 'Long') return withNull(['0L']);
  if (base === 'String') return null; // resolved per parameter (may carry a source pattern)
  const local = base.replace(new RegExp(`^${context.family}\\.`), '');
  if (context.enums[local]) return withNull(context.enums[local].map((entry) => `${context.qualifiedFamily}.${local}.${entry}`));
  const external = context.enumIndex.get(base) ?? context.enumIndex.get(local);
  if (external) return withNull(external.entries.map((entry) => `${external.qualified}.${entry}`));
  // A Family-declared parameter data class (for example a typed ref) constructed recursively.
  if (depth < 2) {
    const nested = new RegExp(`data class ${local}\\s*\\(([^)]*)\\)`).exec(context.text);
    if (nested) {
      const params = nested[1].split(',').map((part) => /val (\w+)\s*:\s*([\w.?<>]+)/.exec(part)).filter(Boolean);
      const lists = params.map(([, name, paramType]) => fixturesForParam({ name, type: paramType, hasDefault: false }, local, context, depth + 1));
      if (lists.some((list) => list === null)) return null;
      return withNull(product(lists).slice(0, 2).map((args) => `${context.qualifiedFamily}.${local}(${args.join(', ')})`));
    }
  }
  return nullable ? ['null'] : null;
}

function fixturesForParam(param, className, context, depth = 0) {
  if (param.type.replace(/\?$/, '') === 'String') {
    const pattern = requiredPattern(context.text, className, param.name);
    if (pattern) {
      const examples = [0, 1].map((variant) => exampleForRegex(pattern, variant)).filter(Boolean);
      if (!examples.length) return null;
      return [...new Set(examples)].map(kotlinString);
    }
    return [kotlinString(`fixture-${param.name}-a`), kotlinString(`fixture-${param.name}-b`)];
  }
  return fixturesForType(param.type, context, depth);
}

function planVariants(variants, context) {
  return variants.map((variant) => {
    const qualified = `${context.qualifiedFamily}.${variant.symbol}`;
    if (variant.form === 'OBJECT') return { variant: variant.symbol, fixtures: [{ label: variant.symbol, expr: qualified }], notFixturable: null };
    const required = variant.params.filter((param) => !param.hasDefault);
    const lists = required.map((param) => ({ param, values: fixturesForParam(param, variant.name, context) }));
    const missing = lists.filter((entry) => entry.values === null).map((entry) => `${entry.param.name}: ${entry.param.type}`);
    if (missing.length) return { variant: variant.symbol, fixtures: [], notFixturable: `no deterministic fixture for ${missing.join(', ')}` };
    const fixtures = product(lists.map((entry) => entry.values)).slice(0, MAX_FIXTURES).map((args, index) => ({
      label: `${variant.symbol}#${index}`,
      expr: `${qualified}(${required.map((param, k) => `${param.name} = ${args[k]}`).join(', ')})`,
    }));
    return { variant: variant.symbol, fixtures, notFixturable: null };
  });
}

export function planLawProbe({ laws, enumIndex, sourceTexts }) {
  const families = [];
  for (const law of laws) {
    if (law.contractForm !== 'VEX_FAMILY_CONTRACT') continue;
    const text = sourceTexts.get(law.sourcePath);
    const pkg = /^package ([\w.]+)/m.exec(text)?.[1];
    assert(pkg, `${law.sourcePath} declares no package`);
    const qualifiedFamily = `${pkg}.${law.family}`;
    const context = { family: law.family, qualifiedFamily, enums: law.enums, enumIndex, text };
    const states = planVariants(law.states, context);
    const controls = planVariants(law.controls, context);
    families.push({
      family: law.family,
      instance: law.instance ? `${pkg}.${law.instance}` : null,
      stateType: `${qualifiedFamily}.${law.types.state}`,
      controlType: `${qualifiedFamily}.${law.types.control}`,
      states,
      controls,
      runnable: Boolean(law.instance) && controls.length > 0 && states.some((state) => state.fixtures.length) && controls.some((control) => control.fixtures.length),
      notRunnable: !law.instance ? 'no reachable Family instance' : controls.length === 0 ? 'Family declares no Control' : null,
    });
  }
  return { schemaVersion: LAW_PROBE_SCHEMA, families, kotlinSource: kotlinProbe(families) };
}

function kotlinProbe(families) {
  const blocks = families.filter((family) => family.runnable).map((family) => {
    const list = (rows, type) => rows.flatMap((row) => row.fixtures.map((fixture) => `            Triple(${kotlinString(row.variant)}, ${kotlinString(fixture.label)}, { ${fixture.expr} }),`)).join('\n')
      .replace(/^/, `        val list: List<Triple<String, String, () -> ${type}>> = listOf(\n`) + '\n        )';
    return `    private fun probe${family.family}(cell: (String, String, String, String, String, () -> Pair<String?, String?>?) -> Unit) {
        val family = ${family.instance}
${list(family.states, family.stateType).replace('val list', 'val states')}
${list(family.controls, family.controlType).replace('val list', 'val controls')}
        for ((stateVariant, stateFixture, state) in states) {
            for ((controlVariant, controlFixture, control) in controls) {
                cell(${kotlinString(family.family)}, stateVariant, stateFixture, controlVariant, controlFixture) {
                    family.resolve(state(), control())?.let { act -> simple(act.admittedState) to simple(act.effect) }
                }
            }
        }
    }`;
  });
  const calls = families.filter((family) => family.runnable).map((family) => `        probe${family.family}(::cell)`).join('\n');
  return `// GENERATED by VexWork experience-graph-law-probe. Placed only into a throwaway copy of the
// pinned VexLife-Prod checkout; never committed to Product source.
package vexwork.experience.probe

import java.io.File
import kotlin.test.Test

class ExperienceLawProbeTest {
    private val out = StringBuilder()

    private fun simple(value: Any?): String? = value?.let { it::class.simpleName }

    private fun esc(value: String): String = value.replace("\\\\", "\\\\\\\\").replace("\\"", "\\\\\\"").replace("\\n", " ")

    private fun cell(family: String, stateVariant: String, stateFixture: String, controlVariant: String, controlFixture: String, run: () -> Pair<String?, String?>?) {
        val result =
            try {
                val act = run()
                if (act == null) "\\"REJECT\\"" else "{\\"admitted\\":" + (act.first?.let { "\\"" + it + "\\"" } ?: "null") + ",\\"effect\\":" + (act.second?.let { "\\"" + it + "\\"" } ?: "null") + "}"
            } catch (error: Throwable) {
                "{\\"error\\":\\"" + esc((error::class.simpleName ?: "Throwable") + ": " + (error.message ?: "")) + "\\"}"
            }
        out.append("{\\"family\\":\\"" + family + "\\",\\"state\\":\\"" + stateVariant + "\\",\\"stateFixture\\":\\"" + esc(stateFixture) + "\\",\\"control\\":\\"" + controlVariant + "\\",\\"controlFixture\\":\\"" + esc(controlFixture) + "\\",\\"result\\":" + result + "}\\n")
    }

${blocks.join('\n\n')}

    @Test
    fun probeFamilyLaw() {
${calls}
        val target = File(System.getProperty("user.dir"), "build/experience-law-probe.jsonl")
        target.parentFile.mkdirs()
        target.writeText(out.toString())
    }
}
`;
}

// ---- evidence comparison ---------------------------------------------------------------------

function expectedOutcomes(index, family, stateRef, controlRef) {
  const offers = index.edges.get(`edge:OFFERS:${stateRef}:${controlRef}`);
  if (!offers) return { allowed: [{ kind: 'REJECT' }], lawful: [], guarded: false };
  const rows = (index.outgoing.get(controlRef) ?? []).filter((edge) => edge.whenState === stateRef && (edge.kind === 'REQUESTS_EFFECT' || edge.kind === 'ADMITS_STATE'));
  const byQualifier = new Map();
  for (const edge of rows) {
    const key = edge.ref.split(':').at(-1);
    const entry = byQualifier.get(key) ?? { admitted: null, effect: null };
    const symbol = index.nodes.get(edge.to).detail.symbol.split('.').at(-1);
    if (edge.kind === 'ADMITS_STATE') entry.admitted = symbol;
    else entry.effect = symbol;
    byQualifier.set(key, entry);
  }
  const lawful = byQualifier.size ? [...byQualifier.values()] : [{ admitted: null, effect: null }];
  const guarded = offers.guards.length > 0;
  // REJECT is reachable only when the law itself had a refusing alternative for this cell
  // (an exhaustive payload `when` with guarded branches never refuses).
  const rejectReachable = guarded && (offers.detail?.alternatives ?? lawful.length + 1) > lawful.length;
  return { allowed: [...lawful.map((value) => ({ kind: 'ACT', ...value })), ...(rejectReachable ? [{ kind: 'REJECT' }] : [])], lawful, guarded };
}

const sameOutcome = (expected, actual) => (expected.kind === 'REJECT'
  ? actual === 'REJECT'
  : actual !== 'REJECT' && actual.admitted === expected.admitted && actual.effect === expected.effect);

export function compareLawEvidence({ graph, derivation, evidence }) {
  assert(evidence?.schemaVersion === LAW_EVIDENCE_SCHEMA, 'law evidence schema mismatch');
  const index = graphIndex(graph);
  const law = lawFingerprint(graph);
  const current = evidence.source.commit === graph.source.commit
    && (evidence.lawFingerprint ? evidence.lawFingerprint === law : evidence.graphFingerprint === graph.fingerprint);
  const rowsByCell = new Map();
  for (const row of evidence.rows) {
    const key = `${row.family}|${row.state}|${row.control}`;
    (rowsByCell.get(key) ?? rowsByCell.set(key, []).get(key)).push(row);
  }
  const cells = [];
  for (const family of graph.nodes.filter((node) => node.role === 'FAMILY' && node.detail.contractForm === 'VEX_FAMILY_CONTRACT')) {
    const states = graph.nodes.filter((node) => node.role === 'STATE' && node.family === family.ref);
    const controls = graph.nodes.filter((node) => node.role === 'CONTROL' && node.family === family.ref);
    const plan = evidence.plan.find((entry) => entry.family === family.ref);
    for (const state of states) {
      for (const control of controls) {
        const rows = rowsByCell.get(`${family.ref}|${state.detail.symbol}|${control.detail.symbol}`) ?? [];
        const expected = expectedOutcomes(index, family.ref, state.ref, control.ref);
        const executed = rows.filter((row) => !(row.result && typeof row.result === 'object' && 'error' in row.result));
        let status;
        let detail = null;
        if (!rows.length) {
          status = 'NOT_RUN';
          const reason = !plan ? 'Family not planned' : !plan.runnable ? plan.notRunnable ?? 'no runnable fixtures'
            : plan.states.find((entry) => entry.variant === state.detail.symbol)?.notFixturable
              ?? plan.controls.find((entry) => entry.variant === control.detail.symbol)?.notFixturable ?? 'not executed';
          detail = reason;
        } else if (!executed.length) {
          status = 'FIXTURE_REJECTED';
          detail = rows[0].result.error;
        } else {
          const outside = executed.filter((row) => !expected.allowed.some((outcome) => sameOutcome(outcome, row.result)));
          if (outside.length) {
            status = 'FAIL';
            detail = `graph does not allow ${JSON.stringify(outside[0].result)} at ${outside[0].stateFixture} × ${outside[0].controlFixture}`;
          } else {
            const reached = expected.allowed.filter((outcome) => executed.some((row) => sameOutcome(outcome, row.result)));
            status = reached.length === expected.allowed.length ? 'PASS' : 'PASS_PARTIAL';
            if (status === 'PASS_PARTIAL') detail = `fixtures reached ${reached.length}/${expected.allowed.length} outcomes the graph allows (a guard was not exercised)`;
          }
        }
        cells.push({ family: family.ref, state: state.ref, control: control.ref, status, rows: rows.length, executed: executed.length, detail });
      }
    }
  }
  const caseStatus = new Map(cells.map((cell) => [`${cell.state}|${cell.control}`, cell]));
  const cases = derivation.cases.map((testCase) => {
    const cell = caseStatus.get(`${testCase.target.state}|${testCase.target.control}`);
    return { caseRef: testCase.caseRef, status: cell ? cell.status : 'NOT_RUN', detail: cell?.detail ?? 'no Family law cell (availability-only Family)' };
  });
  const count = (rows) => Object.fromEntries(CELL_RESULTS.map((name) => [name, rows.filter((row) => row.status === name).length]));
  return {
    current,
    evidenceLawFingerprint: evidence.lawFingerprint ?? null,
    lawFingerprint: law,
    cellCounts: count(cells),
    caseCounts: count(cases),
    cells,
    cases,
    failures: cells.filter((cell) => cell.status === 'FAIL'),
  };
}

export function lawEvidence({ graph, plan, rows, runner }) {
  return {
    schemaVersion: LAW_EVIDENCE_SCHEMA,
    graphFingerprint: graph.fingerprint,
    lawFingerprint: lawFingerprint(graph),
    source: { repository: graph.source.repository, commit: graph.source.commit },
    probeSourceSha256: sha256(plan.kotlinSource),
    runner,
    plan: plan.families.map(({ family, runnable, notRunnable, states, controls }) => ({
      family,
      runnable,
      notRunnable,
      states: states.map(({ variant, fixtures, notFixturable }) => ({ variant, fixtures: fixtures.map((fixture) => fixture.label), notFixturable })),
      controls: controls.map(({ variant, fixtures, notFixturable }) => ({ variant, fixtures: fixtures.map((fixture) => fixture.label), notFixturable })),
    })),
    rows: [...rows].sort((a, b) => compare(canonicalJson(a), canonicalJson(b))),
  };
}

// [VXG RealForever][VEXWORK][VEXLIFE-PROD][E2E][EXPERIENCE-GRAPH][LAW-PROBE]
