// Experience Relationship Graph — compiler, normalizer and traversal.
//
// source-owned relationships -> one normalized graph over existing coordinates.
//
// Node refs are existing source coordinates (Family symbols, State/Control/Effect symbols,
// elementRefs, owner class symbols, exact Intent/Receipt fields). No alias namespace is minted.
// Edge refs are relationship-row keys built from those coordinates.
//
// The graph answers "what relationships exist?". It is not a Product state machine, not a
// scheduler, not an evidence ledger and not a Relay. VexBoard reads it through the ordinary
// BoardGraph projection, so BoardJourney traversal / BACK / REVISIT / loop analysis are reused.
//
// Pure: no file system, network or clock.

import crypto from 'node:crypto';
import { normalizeBoardGraph } from '../shared/vexboard-model.mjs';

export const EXPERIENCE_GRAPH_SCHEMA = 'vexwork.experience-relationship-graph/v1';

export const EDGE_KINDS = Object.freeze([
  'OFFERS',
  'MANIFESTS',
  'REQUESTS_EFFECT',
  'ADMITS_STATE',
  'REALIZED_BY',
  'OBSERVES_AS',
  'PROJECTS_TO',
  'CONSUMED_BY',
  'CAPTURED_AT_SEND',
  'RETURNS_TO',
  'CONVERGES_IN',
  'DERIVES_RELATIONSHIP',
]);

export const NODE_ROLES = Object.freeze([
  'FAMILY', 'STATE', 'CONTROL', 'EFFECT', 'OBSERVATION', 'PROJECTION', 'ELEMENT', 'OWNER', 'CAPTURE', 'RECEIPT',
]);

const BOARD_NODE_KIND = Object.freeze({
  FAMILY: 'CONTAINER',
  STATE: 'SCENE',
  CONTROL: 'CONTROL',
  EFFECT: 'PROCESS',
  OBSERVATION: 'DECISION',
  PROJECTION: 'ARTIFACT',
  ELEMENT: 'PORTAL',
  OWNER: 'PROCESS',
  CAPTURE: 'ARTIFACT',
  RECEIPT: 'ARTIFACT',
});

const BOARD_RELATIONSHIP_KIND = Object.freeze({
  OFFERS: 'TRANSITION',
  ADMITS_STATE: 'TRANSITION',
  OBSERVES_AS: 'TRANSITION',
  REQUESTS_EFFECT: 'FLOW',
  REALIZED_BY: 'FLOW',
  MANIFESTS: 'REFERENCE',
  PROJECTS_TO: 'REFERENCE',
  CONSUMED_BY: 'DATA',
  CAPTURED_AT_SEND: 'DATA',
  RETURNS_TO: 'DATA',
  CONVERGES_IN: 'DATA',
  DERIVES_RELATIONSHIP: 'DATA',
});

const REF = /^[A-Za-z0-9][A-Za-z0-9._:/-]*$/u;

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

const compare = (left, right) => (left < right ? -1 : left > right ? 1 : 0);

export function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort(compare).map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

export const sha256 = (text) => crypto.createHash('sha256').update(text).digest('hex');

export function sourceRef(path, line) {
  return line ? `repo.vexlife-prod:${path}:L${line}` : `repo.vexlife-prod:${path}`;
}

const safe = (value) => String(value).replace(/[^A-Za-z0-9._:/-]/g, '-');

class GraphBuilder {
  constructor() {
    this.nodes = new Map();
    this.edges = new Map();
  }

  node(ref, role, fields = {}) {
    assert(REF.test(ref), `graph node ref is not a stable coordinate: ${ref}`);
    assert(NODE_ROLES.includes(role), `unsupported node role ${role}`);
    const existing = this.nodes.get(ref);
    if (existing) {
      for (const [key, value] of Object.entries(fields)) if (existing[key] === null || existing[key] === undefined) existing[key] = value;
      return ref;
    }
    this.nodes.set(ref, {
      ref,
      role,
      family: fields.family ?? null,
      label: fields.label ?? ref.split('.').at(-1),
      sourceRef: fields.sourceRef ?? null,
      detail: fields.detail ?? {},
    });
    return ref;
  }

  edge(kind, from, to, fields = {}) {
    assert(EDGE_KINDS.includes(kind), `unsupported edge kind ${kind}`);
    assert(this.nodes.has(from) && this.nodes.has(to), `edge ${kind} endpoint missing: ${from} -> ${to}`);
    const qualifier = fields.qualifier ? `:${safe(fields.qualifier)}` : '';
    const ref = `edge:${kind}:${from}:${to}${qualifier}`;
    assert(!this.edges.has(ref), `duplicate relationship row ${ref}`);
    this.edges.set(ref, {
      ref,
      kind,
      from,
      to,
      family: fields.family ?? null,
      whenState: fields.whenState ?? null,
      guards: [...(fields.guards ?? [])],
      sourceRef: fields.sourceRef ?? null,
      detail: fields.detail ?? {},
    });
    return ref;
  }
}

const stateRef = (law, symbol) => `${law.family}.${symbol}`;
const controlRef = (law, symbol) => `${law.family}.${symbol}`;
const effectRef = (law, symbol) => `${law.family}.${symbol}`;
const observationRef = (law, fn) => `${law.family}.${fn}`;
const displayRef = (law) => `${law.family}.DisplayState`;

function addFamilyLaw(builder, law) {
  const familySource = sourceRef(law.sourcePath, null);
  builder.node(law.family, 'FAMILY', { family: law.family, label: law.family, sourceRef: familySource, detail: { contractForm: law.contractForm, stateShape: law.stateShape } });
  for (const state of law.states) {
    builder.node(stateRef(law, state.symbol), 'STATE', {
      family: law.family,
      label: state.ref,
      sourceRef: sourceRef(law.sourcePath, state.line),
      detail: { symbol: state.symbol, stateRef: state.ref, refSource: state.refSource, params: state.params.map((param) => `${param.name}: ${param.type}`) },
    });
  }
  for (const control of law.controls) {
    builder.node(controlRef(law, control.symbol), 'CONTROL', {
      family: law.family,
      label: control.ref,
      sourceRef: sourceRef(law.sourcePath, control.line),
      detail: { symbol: control.symbol, controlRef: control.ref, refSource: control.refSource, params: control.params.map((param) => `${param.name}: ${param.type}`) },
    });
  }
  for (const effect of law.effects) {
    builder.node(effectRef(law, effect.symbol), 'EFFECT', {
      family: law.family,
      label: effect.name,
      sourceRef: sourceRef(law.sourcePath, effect.line),
      detail: { symbol: effect.symbol, effectRef: effect.ref, params: effect.params.map((param) => `${param.name}: ${param.type}`) },
    });
  }

  const actSource = law.actLine ? sourceRef(law.sourcePath, law.actLine) : familySource;
  for (const cell of law.cells) {
    const lawful = cell.outcomes.filter((outcome) => outcome.kind !== 'REJECT');
    if (!lawful.length) continue;
    const from = stateRef(law, cell.state);
    const control = controlRef(law, cell.control);
    const unconditional = lawful.some((outcome) => outcome.guards.length === 0);
    builder.edge('OFFERS', from, control, {
      family: law.family,
      guards: unconditional ? [] : lawful.map((outcome) => outcome.guards.join(' && ')),
      sourceRef: actSource,
      detail: { availability: unconditional ? 'UNCONDITIONAL' : 'GUARDED', alternatives: cell.outcomes.length },
    });
    lawful.forEach((outcome, index) => {
      const qualifier = `when:${cell.state}:${index}`;
      if (outcome.effect && outcome.effect !== 'UNRESOLVED') {
        builder.edge('REQUESTS_EFFECT', control, effectRef(law, outcome.effect), {
          family: law.family, whenState: from, guards: outcome.guards, sourceRef: actSource, qualifier,
          detail: { act: outcome.kind },
        });
      }
      if (outcome.kind === 'ADMIT' && outcome.admittedState && outcome.admittedState.variant !== 'UNRESOLVED') {
        builder.edge('ADMITS_STATE', control, stateRef(law, outcome.admittedState.variant), {
          family: law.family, whenState: from, guards: outcome.guards, sourceRef: actSource, qualifier,
          detail: { axisUpdates: outcome.admittedState.axisUpdates, withEffect: outcome.effect ?? null },
        });
      }
    });
  }
  for (const row of law.availability) {
    const control = law.controls.find((candidate) => candidate.ref === row.controlRef);
    builder.edge('OFFERS', stateRef(law, 'State'), controlRef(law, control.symbol), {
      family: law.family, guards: [row.guard], sourceRef: sourceRef(law.sourcePath, row.line),
      detail: { availability: 'GUARDED', alternatives: 1, lawForm: 'AVAILABILITY_ONLY' },
    });
  }
  for (const observation of law.observations) {
    const ref = builder.node(observationRef(law, observation.function), 'OBSERVATION', {
      family: law.family,
      label: `${observation.function}()`,
      sourceRef: sourceRef(law.sourcePath, observation.line),
      detail: { returnForm: 'FAMILY_OBSERVATION', takesCurrentState: observation.takesCurrentState, params: observation.params.map((param) => param.name) },
    });
    for (const successor of observation.successors) {
      builder.edge('OBSERVES_AS', ref, stateRef(law, successor), { family: law.family, sourceRef: sourceRef(law.sourcePath, observation.line), detail: { precision: 'BRANCH' } });
    }
  }
  if (law.projection) {
    const display = builder.node(displayRef(law), 'PROJECTION', { family: law.family, label: 'DisplayState', sourceRef: familySource });
    for (const row of law.projection) {
      builder.edge('PROJECTS_TO', stateRef(law, row.state), display, {
        family: law.family, sourceRef: familySource,
        detail: { projectedControls: row.controls.map((symbol) => controlRef(law, symbol)) },
      });
    }
  }
}

function lensNodeRef(node) {
  return node.symbol && REF.test(node.symbol) ? node.symbol : node.ref;
}

function addSurface(builder, surface, laws) {
  const lawByFamily = new Map(laws.map((law) => [law.family, law]));
  const pathways = new Map(surface.pathways.map((pathway) => [pathway.pathwayRef, pathway]));
  for (const element of surface.elements) {
    if (!['BUTTON', 'FIELD'].includes(element.kind)) continue;
    builder.node(element.elementRef, 'ELEMENT', {
      label: element.label ?? element.elementRef.split('.').at(-1),
      sourceRef: 'repo.vexlife-prod:docs/lens/vexlife-prod.screen-lens.json',
      detail: { kind: element.kind, symbol: element.symbol, bindingKind: element.bindingKind, bindingTarget: element.bindingTarget, pathwayRef: element.pathwayRef },
    });
    const pathway = element.pathwayRef ? pathways.get(element.pathwayRef) : null;
    if (!pathway || element.bindingKind !== 'CAPABILITY') continue;
    const law = pathway.family ? lawByFamily.get(pathway.family) : null;
    const evidence = { capability: element.bindingTarget, pathwayRef: pathway.pathwayRef, disposition: pathway.disposition };
    if (law) {
      for (const control of law.controls) {
        builder.edge('MANIFESTS', element.elementRef, controlRef(law, control.symbol), { family: law.family, sourceRef: 'repo.vexlife-prod:docs/lens/vexlife-prod.screen-lens.json', detail: evidence });
      }
      if (pathway.projection && builder.nodes.has(displayRef(law))) {
        builder.edge('PROJECTS_TO', displayRef(law), element.elementRef, { family: law.family, sourceRef: 'repo.vexlife-prod:docs/lens/vexlife-prod.screen-lens.json', detail: evidence });
      }
    } else if (pathway.method) {
      const owner = builder.node(lensNodeRef(pathway.method), 'OWNER', { label: pathway.method.symbol, sourceRef: pathway.method.sourcePath ? sourceRef(pathway.method.sourcePath) : null, detail: { lensRole: pathway.method.role } });
      builder.edge('MANIFESTS', element.elementRef, owner, { sourceRef: 'repo.vexlife-prod:docs/lens/vexlife-prod.screen-lens.json', detail: evidence });
      let previous = owner;
      for (const depth of pathway.depth) {
        const next = builder.node(lensNodeRef(depth), 'OWNER', { label: depth.symbol ?? depth.label, sourceRef: depth.sourcePath ? sourceRef(depth.sourcePath) : null, detail: { lensRole: depth.role } });
        if (!builder.edges.has(`edge:REALIZED_BY:${previous}:${next}`)) builder.edge('REALIZED_BY', previous, next, { sourceRef: 'repo.vexlife-prod:docs/lens/vexlife-prod.screen-lens.json', detail: { pathwayRef: pathway.pathwayRef } });
        previous = next;
      }
    }
  }
}

function addRealization(builder, realization, laws, surface) {
  const lawByFamily = new Map(laws.map((law) => [law.family, law]));
  const realizersByFamily = new Map();
  for (const site of realization.realizations) {
    const law = lawByFamily.get(site.family);
    const owner = builder.node(site.owner, 'OWNER', {
      label: site.owner, sourceRef: sourceRef(site.sourcePath),
      detail: { realizationClass: site.realizationClass },
    });
    builder.edge('REALIZED_BY', effectRef(law, site.effect), owner, {
      family: site.family, sourceRef: sourceRef(site.sourcePath, site.line),
      detail: {
        realizationClass: site.realizationClass,
        lines: site.lines,
        handler: site.handler ?? null,
        carriedKey: site.carriedKey ?? null,
      },
    });
    (realizersByFamily.get(site.family) ?? realizersByFamily.set(site.family, new Set()).get(site.family)).add(site.owner);
    for (const delegate of site.delegates ?? []) {
      const target = builder.node(delegate.type, 'OWNER', { label: delegate.type, detail: { realizationClass: 'DELEGATE' } });
      // One row per Family: a shared realizing owner must not join unrelated Families' routes.
      if (!builder.edges.has(`edge:REALIZED_BY:${owner}:${target}:${site.family}`)) {
        builder.edge('REALIZED_BY', owner, target, { family: site.family, qualifier: site.family, sourceRef: sourceRef(site.sourcePath, site.line), detail: { via: `${delegate.receiver}.${delegate.method}` } });
      }
      realizersByFamily.get(site.family).add(delegate.type);
    }
  }
  // Lens depth beyond the realizing owner (runtime child, partner) for Family pathways.
  for (const pathway of surface.pathways) {
    if (!pathway.family || !lawByFamily.has(pathway.family)) continue;
    const realizers = realizersByFamily.get(pathway.family) ?? new Set();
    let previous = [...realizers].find((owner) => pathway.dispatch?.symbol === owner) ?? null;
    for (const depth of pathway.depth) {
      const next = builder.node(lensNodeRef(depth), 'OWNER', { label: depth.symbol ?? depth.label, sourceRef: depth.sourcePath ? sourceRef(depth.sourcePath) : null, detail: { lensRole: depth.role } });
      if (previous && previous !== next && !builder.edges.has(`edge:REALIZED_BY:${previous}:${next}`)) {
        builder.edge('REALIZED_BY', previous, next, { family: pathway.family, sourceRef: 'repo.vexlife-prod:docs/lens/vexlife-prod.screen-lens.json', detail: { pathwayRef: pathway.pathwayRef } });
      }
      realizers.add(next);
      previous = next;
    }
    realizersByFamily.set(pathway.family, realizers);
  }
  for (const row of realization.returns) {
    const law = lawByFamily.get(row.family);
    let target;
    if (row.returnForm === 'FAMILY_OBSERVATION') target = observationRef(law, row.observation);
    else {
      target = builder.node(row.returnForm === 'OWNER_FORMS_STATE' ? row.owner : row.observation, row.returnForm === 'OWNER_FORMS_STATE' ? 'OWNER' : 'OBSERVATION', {
        family: row.family, label: row.observation, sourceRef: sourceRef(row.sourcePath, row.line),
        detail: { returnForm: row.returnForm },
      });
      for (const state of law.states) {
        const ref = `edge:OBSERVES_AS:${target}:${stateRef(law, state.symbol)}`;
        if (!builder.edges.has(ref)) builder.edge('OBSERVES_AS', target, stateRef(law, state.symbol), { family: row.family, sourceRef: sourceRef(row.sourcePath, row.line), detail: { precision: 'TYPE' } });
      }
    }
    const owner = builder.node(row.owner, 'OWNER', { label: row.owner, sourceRef: sourceRef(row.sourcePath) });
    if (owner !== target && !builder.edges.has(`edge:RETURNS_TO:${owner}:${target}`)) {
      builder.edge('RETURNS_TO', owner, target, { family: row.family, sourceRef: sourceRef(row.sourcePath, row.line), detail: { returnForm: row.returnForm, lines: row.lines } });
    }
  }
}

function addSendBoundary(builder, send, laws) {
  if (!send) return;
  const turn = builder.node('DirectCompanionTurn', 'OWNER', { label: 'DirectCompanionTurn', sourceRef: sourceRef(send.intentSourcePath) });
  const lawByFamily = new Map(laws.map((law) => [law.family, law]));
  if (send.idempotency) {
    const key = builder.node(`${send.intentOwner}.${send.idempotency.name}`, 'CAPTURE', {
      label: send.idempotency.name, sourceRef: sourceRef(send.intentSourcePath, send.idempotency.line),
      detail: { type: send.idempotency.type, role: 'IDEMPOTENCY_IDENTITY' },
    });
    builder.edge('CONSUMED_BY', key, turn, { sourceRef: sourceRef(send.intentSourcePath, send.idempotency.line), detail: { boundary: 'ACCEPTED_SEND', role: 'IDEMPOTENCY_IDENTITY' } });
  }
  for (const capture of send.captures) {
    const field = send.intentFields.find((candidate) => candidate.name === capture.field);
    const captureRef = builder.node(`${send.intentOwner}.${capture.field}`, 'CAPTURE', {
      label: capture.field, sourceRef: sourceRef(send.intentSourcePath, field?.line),
      detail: { type: field?.type ?? null, captureLaw: field?.doc ?? null },
    });
    builder.edge('CONSUMED_BY', captureRef, turn, { sourceRef: sourceRef(send.intentSourcePath, field?.line), detail: { boundary: 'ACCEPTED_SEND' } });
    for (const source of capture.sources) {
      const ownerRef = source.ownerType === 'PRESENTATION_REQUEST'
        ? `VexLifeProdServiceContract.SendRequest.${source.method}`
        : source.ownerType ?? source.receiver;
      if (!REF.test(ownerRef)) continue;
      const owner = builder.node(ownerRef, 'OWNER', { label: ownerRef, detail: { readVia: `${source.receiver}.${source.method}`, helper: source.via ?? null } });
      const ref = `edge:CAPTURED_AT_SEND:${owner}:${captureRef}`;
      if (!builder.edges.has(ref)) builder.edge('CAPTURED_AT_SEND', owner, captureRef, { sourceRef: sourceRef(capture.sourcePath, capture.line), detail: { expression: capture.expression, readVia: `${source.receiver}.${source.method}` } });
    }
  }
  for (const evidence of send.receipt) {
    const receipt = builder.node(`DirectPromptContext.Receipt.${evidence.receiptField}`, 'RECEIPT', { label: evidence.receiptField, sourceRef: sourceRef(evidence.sourcePath, evidence.line) });
    builder.edge('PROJECTS_TO', `${send.intentOwner}.${evidence.field}`, receipt, { sourceRef: sourceRef(evidence.sourcePath, evidence.line), detail: { evidence: 'PROMPT_RECEIPT' } });
  }
  for (const gate of send.gates) {
    const law = gate.family ? lawByFamily.get(gate.family) : null;
    let from;
    if (law && law.states.some((state) => state.symbol === gate.state)) from = stateRef(law, gate.state);
    else if (gate.receiverType) from = builder.node(`${gate.receiverType}.${gate.receiverMethod}`, 'OWNER', { label: `${gate.receiverType}.${gate.receiverMethod}()`, sourceRef: sourceRef(gate.sourcePath, gate.line) });
    else continue;
    builder.edge('CONSUMED_BY', from, turn, { qualifier: gate.refusalCode, sourceRef: sourceRef(gate.sourcePath, gate.line), detail: { gate: 'SEND_ADMISSION', refusalCode: gate.refusalCode, status: gate.status, condition: gate.condition } });
  }
}

// Catalog keys are the Product's own element identity (docs/CULTURE.md "the key is the element").
// A key whose dataKey names a Family Control manifests it; one naming a Family State is where the
// DisplayState is surfaced. A Lens element that carries the key in markup (or a key that names its
// Lens element in the reserved `lens` namespace) is the same element in both identity systems.
function addLocalization(builder, localization, surface) {
  if (!localization) return;
  const keyRows = new Map((localization.keys ?? []).map((row) => [row.key, row]));
  const keyNode = (row) => {
    const key = keyRows.get(row.key) ?? {};
    return builder.node(`key:${row.key}`, 'ELEMENT', {
      label: row.key,
      sourceRef: key.sourcePath ? sourceRef(key.sourcePath, key.line) : null,
      detail: { identity: 'LOCALIZATION_KEY', key: row.key, scope: row.scope, surfaces: key.surfaces ?? [], dataKey: row.dataKey, anchor: row.anchor },
    });
  };
  const controlsByKey = new Map();
  for (const row of localization.dataKeys) {
    if (row.resolution === 'FAMILY_CONTROL' && builder.nodes.has(row.target)) {
      const ref = keyNode(row);
      builder.edge('MANIFESTS', ref, row.target, { family: row.family, sourceRef: builder.nodes.get(ref).sourceRef, detail: { identity: 'LOCALIZATION_KEY', dataKey: row.dataKey, anchor: row.anchor } });
      controlsByKey.set(row.key, row);
    } else if (row.resolution === 'FAMILY_STATE' && builder.nodes.has(`${row.family}.DisplayState`)) {
      const ref = keyNode(row);
      builder.edge('PROJECTS_TO', `${row.family}.DisplayState`, ref, { family: row.family, sourceRef: builder.nodes.get(ref).sourceRef, detail: { identity: 'LOCALIZATION_KEY', state: row.target, dataKey: row.dataKey, anchor: row.anchor } });
    }
  }
  const lensBySymbol = new Map(surface.elements.filter((element) => builder.nodes.has(element.elementRef) && element.symbol).map((element) => [element.symbol.split('.').at(-1), element.elementRef]));
  const lensRefs = new Set(surface.elements.map((element) => element.elementRef));
  const links = [
    ...(localization.keyedMarkup ?? []).flatMap((row) => row.keys.map((key) => ({ elementRef: lensBySymbol.get(row.elementSymbol), key, via: 'MARKUP_COLOCATION', sourceRef: sourceRef(row.sourcePath, row.line) }))),
    ...(localization.keys ?? []).filter((row) => row.lens && lensRefs.has(row.lens)).map((row) => ({ elementRef: row.lens, key: row.key, via: 'LENS_NAMESPACE', sourceRef: sourceRef(row.sourcePath, row.line) })),
  ];
  for (const link of links) {
    const control = controlsByKey.get(link.key);
    if (!link.elementRef || !control || !builder.nodes.has(link.elementRef)) continue;
    const ref = `edge:MANIFESTS:${link.elementRef}:${control.target}:key`;
    if (builder.edges.has(ref)) continue;
    builder.edge('MANIFESTS', link.elementRef, control.target, { family: control.family, qualifier: 'key', sourceRef: link.sourceRef, detail: { identity: 'LOCALIZATION_KEY', key: link.key, via: link.via } });
  }
}

export function compileExperienceGraph({ source, families, surface, realization, sendBoundary, untypedLiterals = [], localization = null, stringIdentity = null, extractor }) {
  assert(source && typeof source.commit === 'string' && /^[0-9a-f]{40}$/.test(source.commit), 'graph source must carry one exact commit');
  assert(Array.isArray(families) && families.length > 0, 'graph needs Family law');
  const builder = new GraphBuilder();
  for (const law of families) addFamilyLaw(builder, law);
  addSurface(builder, surface, families);
  addRealization(builder, realization, families, surface);
  addSendBoundary(builder, sendBoundary, families);
  addLocalization(builder, localization, surface);

  const extractionDebt = families.flatMap((law) => law.debt.map((item) => ({ family: law.family, ...item })));
  return normalizeExperienceGraph({
    schemaVersion: EXPERIENCE_GRAPH_SCHEMA,
    graphRef: 'graph.vexlife-prod.experience-relationships',
    source: {
      repository: source.repository,
      commit: source.commit,
      files: [...source.files].sort((a, b) => compare(a.path, b.path)),
    },
    extractor: extractor ?? null,
    nodes: [...builder.nodes.values()],
    edges: [...builder.edges.values()],
    extractionDebt,
    untypedControlLiterals: untypedLiterals.map((row) => ({ control: `${row.family}.${row.control}`, controlRef: row.controlRef, sourceRef: sourceRef(row.sourcePath, row.line) })),
    localization: localization ? {
      schemaVersion: localization.schemaVersion,
      scopes: localization.scopes,
      prefixes: localization.prefixes,
      dataKeys: localization.dataKeys,
      lensKeys: (localization.keys ?? []).filter((row) => row.lens).map((row) => ({ key: row.key, lens: row.lens })),
      keyedMarkup: localization.keyedMarkup,
      selection: localization.selection,
      scripts: localization.scripts,
      displayText: localization.displayText,
    } : null,
    stringIdentity,
  });
}

export function graphFingerprint(graph) {
  const { fingerprint, extractor, ...semantic } = graph;
  void fingerprint;
  void extractor;
  return sha256(canonicalJson(semantic));
}

// The Family-law subgraph an executed law probe exercises: Families, States, Controls, Effects and
// the act() edges between them. Presentation, localization or wiring changes leave it unchanged,
// so executed law evidence stays current across them (and across candidate builds that do not
// touch Family law).
const LAW_ROLES = new Set(['FAMILY', 'STATE', 'CONTROL', 'EFFECT']);
const LAW_EDGES = new Set(['OFFERS', 'REQUESTS_EFFECT', 'ADMITS_STATE']);
export function lawFingerprint(graph) {
  return sha256(canonicalJson({
    nodes: graph.nodes.filter((node) => LAW_ROLES.has(node.role)).map(({ ref, role, family, detail }) => ({ ref, role, family, detail })),
    edges: graph.edges.filter((edge) => LAW_EDGES.has(edge.kind)).map(({ ref, guards, whenState, detail }) => ({ ref, guards, whenState, detail })),
  }));
}

export function normalizeExperienceGraph(input) {
  assert(input?.schemaVersion === EXPERIENCE_GRAPH_SCHEMA, 'Experience Relationship Graph schema mismatch');
  const nodes = [...input.nodes].map((node) => ({ ...node, detail: node.detail ?? {} })).sort((a, b) => compare(a.ref, b.ref));
  const edges = [...input.edges].map((edge) => ({ ...edge, guards: [...edge.guards] })).sort((a, b) => compare(a.ref, b.ref));
  const byRef = new Map(nodes.map((node) => [node.ref, node]));
  assert(byRef.size === nodes.length, 'Experience Relationship Graph node refs must be unique');
  assert(new Set(edges.map((edge) => edge.ref)).size === edges.length, 'Experience Relationship Graph edge refs must be unique');
  for (const node of nodes) {
    assert(REF.test(node.ref), `node ref ${node.ref} is not a stable coordinate`);
    assert(NODE_ROLES.includes(node.role), `node ${node.ref} role ${node.role} unsupported`);
  }
  for (const edge of edges) {
    assert(EDGE_KINDS.includes(edge.kind), `edge ${edge.ref} kind ${edge.kind} unsupported`);
    assert(byRef.has(edge.from) && byRef.has(edge.to), `edge ${edge.ref} endpoint missing`);
    if (edge.kind === 'OFFERS') assert(byRef.get(edge.from).role === 'STATE' && byRef.get(edge.to).role === 'CONTROL', `OFFERS ${edge.ref} must join State -> Control`);
    if (edge.kind === 'MANIFESTS') assert(byRef.get(edge.from).role === 'ELEMENT', `MANIFESTS ${edge.ref} must leave an element`);
    if (edge.kind === 'REQUESTS_EFFECT') assert(byRef.get(edge.to).role === 'EFFECT' && edge.whenState, `REQUESTS_EFFECT ${edge.ref} must carry its State predicate`);
    if (edge.kind === 'ADMITS_STATE') assert(byRef.get(edge.to).role === 'STATE' && edge.whenState, `ADMITS_STATE ${edge.ref} must carry its State predicate`);
    if (edge.kind === 'CONVERGES_IN' || edge.kind === 'DERIVES_RELATIONSHIP') {
      assert(edge.detail?.sourceProvenRelay === true, `${edge.kind} ${edge.ref} requires a source-proven Relay owner`);
    }
  }
  const graph = {
    schemaVersion: EXPERIENCE_GRAPH_SCHEMA,
    graphRef: input.graphRef,
    source: input.source,
    extractor: input.extractor ?? null,
    nodes,
    edges,
    extractionDebt: [...(input.extractionDebt ?? [])],
    untypedControlLiterals: [...(input.untypedControlLiterals ?? [])].sort((a, b) => compare(`${a.control}${a.sourceRef}`, `${b.control}${b.sourceRef}`)),
    localization: input.localization ?? null,
    stringIdentity: input.stringIdentity ?? null,
  };
  return { ...graph, fingerprint: graphFingerprint(graph) };
}

// ---- queries --------------------------------------------------------------------------------

export function graphIndex(graph) {
  const nodes = new Map(graph.nodes.map((node) => [node.ref, node]));
  const outgoing = new Map(graph.nodes.map((node) => [node.ref, []]));
  const incoming = new Map(graph.nodes.map((node) => [node.ref, []]));
  for (const edge of graph.edges) {
    outgoing.get(edge.from).push(edge);
    incoming.get(edge.to).push(edge);
  }
  return { nodes, outgoing, incoming, edges: new Map(graph.edges.map((edge) => [edge.ref, edge])) };
}

// Extraction debt is semantic unreadability, not negative law. Downstream projections use this
// exact cell query before interpreting the absence of an OFFERS edge as a lawful REJECT.
export function lawCellExtractionDebt(graph, family, stateSymbol, controlSymbol) {
  const cell = `${stateSymbol}×${controlSymbol}`;
  return (graph.extractionDebt ?? []).filter((row) => row.family === family && row.cell === cell);
}

// Reverse: what must be true / what a human does to reach `ref`. Forward: what follows from it.
const REVERSE_KINDS = new Set(['OFFERS', 'MANIFESTS', 'ADMITS_STATE', 'OBSERVES_AS', 'RETURNS_TO', 'REALIZED_BY', 'REQUESTS_EFFECT', 'CAPTURED_AT_SEND', 'CONSUMED_BY']);
const FORWARD_KINDS = new Set(['REQUESTS_EFFECT', 'ADMITS_STATE', 'REALIZED_BY', 'RETURNS_TO', 'OBSERVES_AS', 'PROJECTS_TO', 'CONSUMED_BY', 'CAPTURED_AT_SEND', 'CONVERGES_IN', 'DERIVES_RELATIONSHIP']);

// Family-scoped walk: arriving through Family F's edge, a shared owner may only be left along F's
// edges or along Family-less cross-owner edges (which reset the scope). This keeps a realizing
// service that serves several Families from joining their unrelated routes.
function walk(graph, startRefs, direction, maxDepth, startFamily = null) {
  const index = graphIndex(graph);
  const visited = new Map(startRefs.map((ref) => [ref, 0]));
  const edges = [];
  let frontier = startRefs.map((ref) => ({ ref, scope: startFamily }));
  const seenScoped = new Set(frontier.map((item) => `${item.ref}|${item.scope}`));
  for (let depth = 1; depth <= maxDepth && frontier.length; depth += 1) {
    const next = [];
    for (const { ref, scope } of frontier) {
      const list = direction === 'reverse' ? index.incoming.get(ref) ?? [] : index.outgoing.get(ref) ?? [];
      for (const edge of list) {
        if (!(direction === 'reverse' ? REVERSE_KINDS : FORWARD_KINDS).has(edge.kind)) continue;
        if (edge.family && scope && edge.family !== scope) continue;
        edges.push(edge.ref);
        const other = direction === 'reverse' ? edge.from : edge.to;
        const nextScope = edge.family ?? null;
        if (!visited.has(other)) visited.set(other, depth);
        const key = `${other}|${nextScope}`;
        if (!seenScoped.has(key)) {
          seenScoped.add(key);
          next.push({ ref: other, scope: nextScope });
        }
      }
    }
    frontier = next;
  }
  return {
    nodes: [...visited.entries()].map(([ref, depth]) => ({ ref, depth, role: index.nodes.get(ref).role })).sort((a, b) => a.depth - b.depth || compare(a.ref, b.ref)),
    edges: [...new Set(edges)].sort(compare),
  };
}

export function reverseNeighborhood(graph, targetRef, { maxDepth = 4 } = {}) {
  const index = graphIndex(graph);
  const edge = index.edges.get(targetRef);
  const start = edge ? [edge.from] : [targetRef];
  assert(edge || index.nodes.has(targetRef), `unknown graph coordinate ${targetRef}`);
  const scope = edge?.family ?? index.nodes.get(start[0])?.family ?? null;
  return { target: targetRef, ...walk(graph, start, 'reverse', maxDepth, scope) };
}

export function forwardNeighborhood(graph, targetRef, { maxDepth = 6 } = {}) {
  const index = graphIndex(graph);
  const edge = index.edges.get(targetRef);
  const start = edge ? [edge.to] : [targetRef];
  assert(edge || index.nodes.has(targetRef), `unknown graph coordinate ${targetRef}`);
  const scope = edge?.family ?? index.nodes.get(start[0])?.family ?? null;
  return { target: targetRef, ...walk(graph, start, 'forward', maxDepth, scope) };
}

// ---- VexBoard projection ---------------------------------------------------------------------

export function experienceBoardGraph(graph) {
  const nodes = graph.nodes.map((node) => ({
    nodeRef: node.ref,
    kind: BOARD_NODE_KIND[node.role],
    label: `${node.role} · ${node.label}`,
    parentRefOrNull: node.family && node.ref !== node.family && ['STATE', 'CONTROL', 'EFFECT', 'OBSERVATION', 'PROJECTION'].includes(node.role) && graph.nodes.some((candidate) => candidate.ref === node.family) ? node.family : null,
    detailBoardRefOrNull: null,
    sourceRefs: node.sourceRef ? [node.sourceRef] : [],
  }));
  const relationships = graph.edges.map((edge) => ({
    relationshipRef: edge.ref,
    kind: BOARD_RELATIONSHIP_KIND[edge.kind],
    fromRef: edge.from,
    toRef: edge.to,
    labelOrNull: edge.guards.length ? `${edge.kind} · when ${edge.guards.join(' | ')}` : edge.kind,
    sourceRefs: edge.sourceRef ? [edge.sourceRef] : [],
  }));
  return normalizeBoardGraph({
    schemaVersion: 'vexboard.board-graph/v1',
    graphRef: graph.graphRef,
    nodes,
    relationships,
    sourceRefs: [`repo.vexlife-prod:commit:${graph.source.commit}`],
  });
}

// [VXG RealForever][VEXWORK][VEXLIFE-PROD][E2E][EXPERIENCE-GRAPH]
