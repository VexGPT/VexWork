// Experience Relationship Graph — frontier debt, pathways, routes, journeys, test manifests.
//
// graph
// -> FRONTIER_DEBT (derived from the graph itself; never a hand-kept backlog)
// -> pathway (one Family's branch-capable subgraph)
// -> route (one lawful State + Control outcome, walked to realization / observation / projection)
// -> journey (routes the graph itself joins across owners)
// -> deterministic test-case manifest + human-readable explanation
//
// A route is CLEARED only when every coordinate it needs is stably addressable. Anything missing
// stays on the route as the smallest missing predicate.
//
// Pure: no file system, network or clock.

import { graphIndex, sha256, canonicalJson } from './experience-graph.mjs';

export const EXPERIENCE_DERIVATION_SCHEMA = 'vexwork.experience-graph.derivation/v1';

export const ROUTE_STATUSES = Object.freeze(['CLEARED', 'FRONTIER_DEBT', 'HELD', 'UNKNOWN']);

// README hard-edge classes A–G.
export const DEBT_CLASSES = Object.freeze({
  A: 'SEMANTIC_LAW_MISSING',
  B: 'EXTRACTION_OR_PROJECTABILITY',
  C: 'REALIZATION_MISSING',
  D: 'OBSERVATION_MISSING',
  E: 'PROJECTION_MISSING',
  F: 'TEST_SEAM_MISSING',
  G: 'HELD',
});

export const EXECUTION_CLASSES = Object.freeze({
  A: 'PURE_SOURCE',
  B: 'DETERMINISTIC_NERVOUS_SYSTEM',
  C: 'ISOLATED_TEST_SERVICE',
  D: 'LIVE_MODEL',
  E: 'LIVED_PRODUCT_LIFECYCLE',
  F: 'RELEASE_PUBLICATION',
});

const compare = (left, right) => (left < right ? -1 : left > right ? 1 : 0);

function familyStem(family) {
  return family.replace(/^VexLife(Prod)?/, '').replace(/Family$/, '').replace(/s$/, '');
}

function debtRow(kind, debtClass, coordinate, detail, { family = null, sourceRef = null, hints = [] } = {}) {
  return { ref: `debt:${kind}:${coordinate}`, kind, debtClass, debtClassMeaning: DEBT_CLASSES[debtClass], coordinate, family, detail, sourceRef, hints };
}

function familyOwners(index, family) {
  // Realization owners reached from this Family's Effects, scoped to the Family.
  const owners = new Set();
  const queue = [];
  for (const node of index.nodes.values()) {
    if (node.role === 'EFFECT' && node.family === family) queue.push(node.ref);
  }
  const seen = new Set(queue);
  while (queue.length) {
    const ref = queue.shift();
    for (const edge of index.outgoing.get(ref) ?? []) {
      if (edge.kind !== 'REALIZED_BY' || (edge.family && edge.family !== family)) continue;
      owners.add(edge.to);
      if (!seen.has(edge.to)) {
        seen.add(edge.to);
        queue.push(edge.to);
      }
    }
  }
  return owners;
}

export function deriveFrontier(graph) {
  const index = graphIndex(graph);
  const debt = [];
  const families = graph.nodes.filter((node) => node.role === 'FAMILY');
  const elements = graph.nodes.filter((node) => node.role === 'ELEMENT');
  const manifested = new Set(graph.edges.filter((edge) => edge.kind === 'MANIFESTS').map((edge) => edge.to));
  const elementBound = new Set(graph.edges.filter((edge) => edge.kind === 'MANIFESTS').map((edge) => edge.from));

  for (const item of graph.extractionDebt) {
    const debtClass = item.kind === 'MISSING_ACT_LAW' ? 'A' : 'B';
    debt.push(debtRow(item.kind, debtClass, item.cell ? `${item.family}:${item.cell}` : item.family, item.detail, { family: item.family }));
  }

  for (const family of families) {
    const controls = graph.nodes.filter((node) => node.role === 'CONTROL' && node.family === family.ref);
    const offered = new Set(graph.edges.filter((edge) => edge.kind === 'OFFERS' && edge.family === family.ref).map((edge) => edge.to));
    const unbound = controls.filter((control) => offered.has(control.ref) && !manifested.has(control.ref));
    if (unbound.length) {
      const stem = familyStem(family.ref);
      const hints = elements
        .filter((element) => !elementBound.has(element.ref) && element.detail.symbol && element.detail.symbol.includes(stem))
        .map((element) => element.ref);
      const literals = graph.untypedControlLiterals.filter((row) => row.control.startsWith(`${family.ref}.`));
      for (const control of unbound) {
        const literal = literals.find((row) => row.control === control.ref);
        debt.push(debtRow(
          literal ? 'UNTYPED_MANIFESTATION' : 'MISSING_MANIFESTATION_BINDING',
          'B',
          control.ref,
          literal
            ? `${control.label} reaches the person only through a raw controlRef literal in generated presentation source; no typed element -> Control binding exists`
            : `${control.label} is lawful in some State but no stable element manifests it (if this Control is system-driven rather than human-facing, source should say so; otherwise bind its element)`,
          { family: family.ref, sourceRef: literal?.sourceRef ?? control.sourceRef, hints },
        ));
      }
    }

    const effects = graph.nodes.filter((node) => node.role === 'EFFECT' && node.family === family.ref);
    const requested = new Set(graph.edges.filter((edge) => edge.kind === 'REQUESTS_EFFECT' && edge.family === family.ref).map((edge) => edge.to));
    for (const effect of effects) {
      const realized = (index.outgoing.get(effect.ref) ?? []).some((edge) => edge.kind === 'REALIZED_BY');
      if (requested.has(effect.ref) && !realized) {
        debt.push(debtRow('MISSING_REALIZATION', 'C', effect.ref, `${effect.label} is requested by Family law but no source realizes it`, { family: family.ref, sourceRef: effect.sourceRef }));
      }
    }

    const owners = familyOwners(index, family.ref);
    if (owners.size) {
      const observes = graph.edges.some((edge) => edge.kind === 'OBSERVES_AS' && edge.family === family.ref);
      const returns = graph.edges.some((edge) => edge.kind === 'RETURNS_TO' && edge.family === family.ref && (owners.has(edge.from) || owners.has(edge.to)));
      if (!observes || !returns) {
        debt.push(debtRow('MISSING_OBSERVATION', 'D', family.ref,
          observes
            ? `${family.ref} has observation law but no realization owner visibly returns outside truth to it`
            : `${family.ref} Effects are realized but the graph sees no observation/reconciliation back into Family State`,
          { family: family.ref, sourceRef: family.sourceRef }));
      }
    }

    const display = `${family.ref}.DisplayState`;
    if (index.nodes.has(display)) {
      const surfaced = (index.outgoing.get(display) ?? []).some((edge) => edge.kind === 'PROJECTS_TO');
      if (!surfaced) {
        debt.push(debtRow('PROJECTION_NOT_SURFACED', 'E', display, `${family.ref} projects a DisplayState but no stable element is bound to show it`, { family: family.ref, sourceRef: family.sourceRef }));
      }
    } else if (controls.length) {
      debt.push(debtRow('MISSING_PROJECTION', 'E', family.ref, `${family.ref} has Controls but no displayStateFor() projection the graph can read`, { family: family.ref, sourceRef: family.sourceRef }));
    }
  }

  for (const element of elements) {
    if (elementBound.has(element.ref)) continue;
    const binding = element.detail.bindingKind;
    if (binding === 'LOCAL') continue; // presentation-local navigation decides nothing
    if (binding === 'CAPABILITY') {
      debt.push(debtRow('MISSING_CONTROL_LAW', 'A', element.ref, `capability ${element.detail.bindingTarget} is bound to this element but no Family or registered owner pathway carries its meaning`, { sourceRef: element.sourceRef }));
    } else {
      debt.push(debtRow('ELEMENT_WITHOUT_BINDING', 'B', element.ref, `human-visible ${element.detail.kind} has a stable elementRef but no typed binding to the relationship it manifests`, { sourceRef: element.sourceRef }));
    }
  }

  debt.push(...localizationDebt(graph), ...stringIdentityDebt(graph));

  debt.sort((a, b) => compare(a.ref, b.ref));
  return Object.freeze({
    schemaVersion: EXPERIENCE_DERIVATION_SCHEMA,
    graphFingerprint: graph.fingerprint,
    debt: Object.freeze(debt.map((row) => Object.freeze(row))),
    byClass: Object.freeze(Object.fromEntries(Object.keys(DEBT_CLASSES).map((key) => [key, debt.filter((row) => row.debtClass === key).length]))),
  });
}


// ---- localization frontier ------------------------------------------------------------------

const catalogRef = (path, line = null) => `repo.vexlife-prod:${path}${line ? `:L${line}` : ''}`;

function localizationDebt(graph) {
  const localization = graph.localization;
  if (!localization) return [];
  const debt = [];
  const offered = [...new Set(localization.scopes.flatMap((scope) => scope.completeLanguages))].sort(compare);
  for (const scope of localization.scopes) {
    const missing = offered.filter((language) => !scope.completeLanguages.includes(language));
    if (!missing.length) continue;
    const partial = missing.filter((language) => scope.languages.includes(language));
    const detail = partial.length
      ? `${scope.scope}: ${partial.length} of ${missing.length} product languages hold some translations but none is complete (${partial.map((language) => `${language} missing ${scope.missingByLanguage[language]}/${scope.keyCount}`).join(', ')}); a person in those languages is not offered this scope`
      : `${scope.scope}: English only while other scopes are complete in ${missing.join(' ')}; every non-English person sees this scope in English`;
    debt.push(debtRow('LANGUAGE_INCOMPLETE', 'E', `localization:${scope.scope}`, detail, { sourceRef: catalogRef(scope.sourcePath) }));
  }
  const incomplete = localization.scopes.filter((scope) => scope.completeLanguages.length < scope.languages.length).map((scope) => scope.scope);
  for (const row of localization.selection ?? []) {
    if (row.rule !== 'PER_KEY_ENGLISH_FALLBACK') continue;
    debt.push(debtRow('PARTIAL_LANGUAGE_SERVED', 'E', `${row.sourcePath.split('/').at(-1).replace(/\.kt$/, '')}.${row.function}`,
      `${row.function}() derives the person's language and resolves keys one by one, English where untranslated, without consulting completeness; a partially translated scope (${incomplete.join(', ') || 'none today'}) is shown mixed, which the catalog law says is never presented as finished`,
      { sourceRef: catalogRef(row.sourcePath, row.line) }));
  }
  for (const collapse of localization.scripts?.collapses ?? []) {
    for (const reply of collapse.misserved) {
      const legacy = collapse.legacy?.canonical === reply ? `; legacy Homes that saved "${collapse.legacy.legacyCode}" canonicalize to ${reply} and are affected too` : '';
      const system = localization.scripts.systemLanguageDropsScript ? `; ${localization.scripts.systemLanguageDropsScript.function}() also drops the script subtag of a system language (zh-Hant-TW -> ${collapse.localizationLanguage})` : '';
      debt.push(debtRow('SCRIPT_COLLAPSE', 'E', `localization:reply:${reply}`,
        `reply language ${reply} resolves to localization language "${collapse.localizationLanguage}", whose catalog text is ${collapse.catalogScript.script} script (${collapse.catalogScript.hans} Simplified-only / ${collapse.catalogScript.hant} Traditional-only characters sampled): a ${reply} reader is shown the other script${legacy}${system}`,
        { sourceRef: catalogRef(localization.scripts.sourcePath, localization.scripts.line) }));
    }
  }
  for (const row of localization.displayText ?? []) {
    if (!['HARDCODED', 'PARTIALLY_KEYED'].includes(row.form)) continue;
    debt.push(debtRow('HARDCODED_DISPLAY_TEXT', 'E', `${row.family}.DisplayState`,
      `${row.family}.${row.displayType} carries human text as String (${row.hardcodedFields.join(', ')}) instead of VexLifeText keys: it cannot be translated, and its words are not element identity`,
      { family: row.family, sourceRef: catalogRef(row.sourcePath, row.line) }));
  }
  for (const row of localization.dataKeys) {
    if (row.resolution !== 'UNRESOLVED_REF' && row.resolution !== 'UNANCHORED') continue;
    debt.push(debtRow('DATAKEY_UNRESOLVED', 'B', `key:${row.key}`,
      row.resolution === 'UNANCHORED'
        ? `dataKey ${row.dataKey} names prefix ${row.prefix}, which no source expression or catalog owner declaration anchors`
        : `dataKey ${row.dataKey} is anchored to ${row.family} but names a ${row.prefix.split(':')[1]} ref that Family does not own`,
      { family: row.family, sourceRef: null }));
  }
  const weak = new Map();
  for (const prefix of localization.prefixes) {
    if (prefix.anchors.includes('MAIN_SOURCE') || !prefix.anchors.length) continue;
    const owner = prefix.family ?? prefix.owner;
    (weak.get(owner) ?? weak.set(owner, []).get(owner)).push(prefix);
  }
  for (const [owner, prefixes] of [...weak.entries()].sort(([a], [b]) => compare(a, b))) {
    const keys = prefixes.reduce((sum, row) => sum + row.keys, 0);
    debt.push(debtRow('DATAKEY_ANCHOR_NOT_IN_MAIN', 'B', `dataKey:${owner}`,
      `${keys} dataKey(s) under ${prefixes.map((row) => `${row.prefix} (${row.anchors.join(' + ')})`).join(', ')} map to ${owner} without any main-source owner enumerating them; setup's equivalent is VexLifeProdSetupElements.DataKeys`,
      { family: prefixes[0].family, sourceRef: null, hints: prefixes.map((row) => row.prefix) }));
  }
  const elements = graph.nodes.filter((node) => node.role === 'ELEMENT' && !node.detail?.identity && ['BUTTON', 'FIELD'].includes(node.detail?.kind));
  const keyed = new Set(graph.edges.filter((edge) => edge.detail?.identity === 'LOCALIZATION_KEY' && edge.kind === 'MANIFESTS').map((edge) => edge.from));
  const unlinked = elements.filter((node) => !keyed.has(node.ref)).map((node) => node.ref).sort(compare);
  if (unlinked.length) {
    debt.push(debtRow('LENS_KEY_UNLINKED', 'B', 'lens:screen.vexlife-workspace',
      `${unlinked.length} of ${elements.length} Screen Lens buttons/fields carry no catalog key in either identity system (markup co-location or the reserved \`lens\` namespace, used by ${localization.lensKeys?.length ?? 0} keys): the Lens and the catalog cannot be joined for them`,
      { sourceRef: 'repo.vexlife-prod:docs/lens/vexlife-prod.screen-lens.json', hints: unlinked }));
  }
  return debt;
}

// ---- string identity frontier ---------------------------------------------------------------

function stringIdentityDebt(graph) {
  const identity = graph.stringIdentity;
  if (!identity) return [];
  const debt = [];
  // Coordinates name the nth occurrence of a literal in its file, not its line, so an unrelated
  // edit above it (or a candidate branch) does not read as one finding resolved and another new.
  const ordinal = new Map();
  const occurrence = (row) => {
    const key = `${row.sourcePath}|${row.literal}`;
    ordinal.set(key, (ordinal.get(key) ?? 0) + 1);
    return `${row.sourcePath.split('/').at(-1)}:${row.literal}#${ordinal.get(key)}`;
  };
  for (const row of identity.runtimeLiterals) {
    const coordinate = occurrence(row);
    debt.push(row.owners.length
      ? debtRow('LITERAL_SHADOWS_CONSTANT', 'B', coordinate, `generated browser runtime compares ${row.subject} to the literal '${row.literal}' although source already owns that value (${row.owners.join(', ')}); renaming the owner would not fail the build`, { sourceRef: catalogRef(row.sourcePath, row.line), hints: row.owners })
      : debtRow('UNOWNED_WIRE_LITERAL', 'B', coordinate, `generated browser runtime compares ${row.subject} to '${row.literal}', a wire value no Kotlin constant, enum or Family ref owns: both sides of the boundary repeat the string`, { sourceRef: catalogRef(row.sourcePath, row.line) }));
  }
  const familyRows = new Map();
  for (const row of identity.kotlinLiterals) {
    if (row.layer === 'FAMILY_LAW') {
      const family = graph.nodes.find((node) => node.role === 'FAMILY' && node.sourceRef === catalogRef(row.sourcePath))?.ref ?? row.sourcePath.split('/').at(-1).replace(/\.kt$/, '');
      (familyRows.get(family) ?? familyRows.set(family, []).get(family)).push(row);
    } else if (row.owners.length) {
      debt.push(debtRow('LITERAL_SHADOWS_CONSTANT', 'B', occurrence(row), `Kotlin compares the literal "${row.literal}" although ${row.owners.join(', ')} already owns that value in a file this one references`, { sourceRef: catalogRef(row.sourcePath, row.line), hints: row.owners }));
    }
  }
  for (const [family, rows] of [...familyRows.entries()].sort(([a], [b]) => compare(a, b))) {
    debt.push(debtRow('FAMILY_READS_WIRE_STRING', 'B', family,
      `${family} law branches on wire strings (${rows.map((row) => `"${row.literal}" L${row.line}`).join(', ')}); the culture keeps wire strings at the serialization boundary and hands the Family a typed value`,
      { family: graph.nodes.some((node) => node.ref === family) ? family : null, sourceRef: catalogRef(rows[0].sourcePath, rows[0].line) }));
  }
  if (identity.domIds) {
    const bypassed = identity.domIds.rows.filter((row) => row.kind === 'TYPED_REF_BYPASSED');
    const untyped = identity.domIds.rows.filter((row) => row.kind === 'UNTYPED_INTERACTIVE');
    if (bypassed.length) {
      debt.push(debtRow('TYPED_REF_BYPASSED', 'B', `runtime:${identity.domIds.runtimePath.split('/').at(-1)}`,
        `the browser runtime binds ${bypassed.length} elements by DOM id string although each carries a typed data-vex-ref (${identity.domIds.typedSelectors} runtime lookups use data-vex-ref); behavior and identity can drift apart silently`,
        { sourceRef: catalogRef(identity.domIds.runtimePath), hints: bypassed.map((row) => `${row.elementId}=${row.elementSymbol}`) }));
    }
    if (untyped.length) {
      debt.push(debtRow('UNTYPED_INTERACTIVE', 'B', `markup:${identity.domIds.markupPath.split('/').at(-1)}`,
        `${untyped.length} interactive elements the runtime binds have only a DOM id: no typed element identity names them`,
        { sourceRef: catalogRef(identity.domIds.markupPath), hints: untyped.map((row) => `${row.tag}#${row.elementId}`) }));
    }
  }
  for (const row of identity.reflection) {
    if (row.use !== 'REFLECTION_IDENTITY') continue;
    debt.push(debtRow('REFLECTION_IDENTITY', 'B', `${row.sourcePath.split('/').at(-1)}:L${row.line}`, `a reflected class name is used as identity: ${row.text}`, { sourceRef: catalogRef(row.sourcePath, row.line) }));
  }
  return debt;
}

// ---- test seams (class F), from executed law proof ------------------------------------------

export function withTestSeamDebt(frontier, lawProof) {
  if (!lawProof) return frontier;
  const byFamily = new Map();
  for (const cell of lawProof.cells) {
    if (cell.status !== 'FIXTURE_REJECTED' && cell.status !== 'NOT_RUN') continue;
    (byFamily.get(cell.family) ?? byFamily.set(cell.family, []).get(cell.family)).push(cell);
  }
  const rows = [...byFamily.entries()].sort(([a], [b]) => compare(a, b)).map(([family, cells]) => {
    const rejected = cells.filter((cell) => cell.status === 'FIXTURE_REJECTED').length;
    const reasons = [...new Set(cells.map((cell) => cell.detail))].sort(compare);
    return debtRow('TEST_SEAM_MISSING', 'F', `${family}:law-probe`,
      `${cells.length} lawful cell(s) could not be exercised by the deterministic law probe (${rejected} fixture rejected by the Family's own require(), ${cells.length - rejected} with no fixture): ${reasons.slice(0, 3).join('; ')}${reasons.length > 3 ? `; +${reasons.length - 3} more` : ''}`,
      { family, sourceRef: null, hints: cells.map((cell) => `${cell.state.split('.').at(-1)}×${cell.control.split('.').at(-1)}`) });
  });
  const debt = [...frontier.debt, ...rows].sort((a, b) => compare(a.ref, b.ref));
  return Object.freeze({
    ...frontier,
    debt: Object.freeze(debt.map((row) => Object.freeze(row))),
    byClass: Object.freeze(Object.fromEntries(Object.keys(DEBT_CLASSES).map((key) => [key, debt.filter((row) => row.debtClass === key).length]))),
  });
}

// ---- routes ---------------------------------------------------------------------------------

function realizationClassFor(index, ownerRef) {
  const node = index.nodes.get(ownerRef);
  if (node?.detail?.lensRole === 'PARTNER') return 'E';
  if (node?.detail?.realizationClass === 'BROWSER_RUNTIME') return 'C';
  return 'B';
}

function scopedChain(index, startRef, family, kinds, maxDepth = 6) {
  const out = [];
  const seen = new Set([startRef]);
  let frontier = [startRef];
  for (let depth = 0; depth < maxDepth && frontier.length; depth += 1) {
    const next = [];
    for (const ref of frontier) {
      for (const edge of index.outgoing.get(ref) ?? []) {
        if (!kinds.has(edge.kind) || (edge.family && edge.family !== family)) continue;
        out.push(edge);
        if (!seen.has(edge.to)) {
          seen.add(edge.to);
          next.push(edge.to);
        }
      }
    }
    frontier = next;
  }
  return out;
}

export function deriveRoutes(graph, frontier) {
  const index = graphIndex(graph);
  const debtByCoordinate = new Map();
  for (const row of frontier.debt) (debtByCoordinate.get(row.coordinate) ?? debtByCoordinate.set(row.coordinate, []).get(row.coordinate)).push(row);
  const routes = [];
  const cases = [];
  const pathways = new Map();

  for (const offers of graph.edges.filter((edge) => edge.kind === 'OFFERS')) {
    const family = offers.family;
    const stateNode = index.nodes.get(offers.from);
    const controlNode = index.nodes.get(offers.to);
    const elements = (index.incoming.get(controlNode.ref) ?? []).filter((edge) => edge.kind === 'MANIFESTS').map((edge) => edge.from).sort(compare);
    const outcomes = (index.outgoing.get(controlNode.ref) ?? [])
      .filter((edge) => (edge.kind === 'REQUESTS_EFFECT' || edge.kind === 'ADMITS_STATE') && edge.whenState === stateNode.ref);
    // Group REQUESTS_EFFECT / ADMITS_STATE rows of the same outcome (same qualifier).
    const byOutcome = new Map();
    for (const edge of outcomes) {
      const key = edge.ref.split(':').at(-1);
      (byOutcome.get(key) ?? byOutcome.set(key, []).get(key)).push(edge);
    }
    const outcomeGroups = byOutcome.size ? [...byOutcome.entries()].sort(([a], [b]) => compare(a, b)) : [['0', []]];

    for (const [key, group] of outcomeGroups) {
      const effectEdge = group.find((edge) => edge.kind === 'REQUESTS_EFFECT') ?? null;
      const admitEdge = group.find((edge) => edge.kind === 'ADMITS_STATE') ?? null;
      const guards = (effectEdge ?? admitEdge)?.guards ?? (offers.guards.length === 1 ? offers.guards[0].split(' && ').filter(Boolean) : []);
      const routeRef = `route:${stateNode.ref}:${controlNode.detail.symbol}:${key}`;
      const missing = [];
      const steps = [];
      steps.push({ step: 'PRECONDITION', coordinate: stateNode.ref, guards, executionClass: 'A' });
      steps.push({ step: 'HUMAN_ACTION', coordinate: controlNode.ref, elementRefs: elements, executionClass: elements.length ? 'C' : 'A' });
      if (!elements.length) missing.push({ predicate: 'MISSING_STABLE_ELEMENT_BINDING', coordinate: controlNode.ref });
      const act = { kind: admitEdge ? 'ADMIT' : 'STAY', admittedState: admitEdge?.to ?? null, axisUpdates: admitEdge?.detail?.axisUpdates ?? {}, effect: effectEdge?.to ?? null };
      steps.push({ step: 'ACT', coordinate: (effectEdge ?? admitEdge ?? offers).ref, act, executionClass: 'A' });

      let successors = [];
      if (effectEdge) {
        const realization = scopedChain(index, effectEdge.to, family, new Set(['REALIZED_BY']));
        const owners = [...new Set(realization.map((edge) => edge.to))];
        steps.push({ step: 'REALIZATION', coordinate: effectEdge.to, owners, executionClass: owners.length ? owners.map((owner) => realizationClassFor(index, owner)).sort().at(-1) : null });
        if (!owners.length) missing.push({ predicate: 'MISSING_REALIZATION_EDGE', coordinate: effectEdge.to });
        const ownerSet = new Set([effectEdge.to, ...owners]);
        const returns = graph.edges.filter((edge) => edge.kind === 'RETURNS_TO' && edge.family === family && ownerSet.has(edge.from));
        const observations = [...new Set(returns.map((edge) => edge.to))];
        for (const observation of observations) {
          for (const edge of index.outgoing.get(observation) ?? []) if (edge.kind === 'OBSERVES_AS') successors.push(edge.to);
        }
        successors = [...new Set(successors)].sort(compare);
        steps.push({ step: 'OBSERVATION', coordinate: observations[0] ?? null, observations, successors, executionClass: observations.length ? steps.at(-1).executionClass : null });
        if (!observations.length) missing.push({ predicate: 'MISSING_OBSERVATION_EDGE', coordinate: effectEdge.to });
      } else if (admitEdge) {
        successors = [admitEdge.to];
      }
      const projected = successors.length ? successors : [stateNode.ref];
      const projection = projected.map((ref) => ({
        state: ref,
        display: (index.outgoing.get(ref) ?? []).find((edge) => edge.kind === 'PROJECTS_TO')?.to ?? null,
      }));
      const display = projection.find((row) => row.display)?.display ?? null;
      const surfaced = display ? (index.outgoing.get(display) ?? []).filter((edge) => edge.kind === 'PROJECTS_TO').map((edge) => edge.to) : [];
      steps.push({ step: 'PROJECTION', coordinate: display, states: projection, elementRefs: surfaced, executionClass: display ? 'A' : null });
      if (!display) missing.push({ predicate: 'MISSING_PROJECTION', coordinate: projected[0] });
      else if (!surfaced.length) missing.push({ predicate: 'PROJECTION_NOT_SURFACED', coordinate: display });

      const cellDebt = (debtByCoordinate.get(`${family}:${stateNode.detail.symbol}×${controlNode.detail.symbol}`) ?? []).length;
      const unresolved = cellDebt > 0;
      const status = unresolved ? 'UNKNOWN' : missing.length ? 'FRONTIER_DEBT' : 'CLEARED';
      const route = {
        routeRef,
        family,
        pathwayRef: elements.length ? (index.nodes.get(elements[0]).detail.pathwayRef ?? null) : null,
        status,
        missing,
        steps,
        explanation: explainRoute({ elements, stateNode, controlNode, act, steps, successors, surfaced, guards }),
      };
      routes.push(route);
      (pathways.get(family) ?? pathways.set(family, []).get(family)).push(routeRef);
      cases.push(testCaseFor(route, graph.fingerprint));
    }
  }

  // Negative cases: every declared State × Control cell with no OFFERS edge must stay effect-free.
  const offered = new Set(graph.edges.filter((edge) => edge.kind === 'OFFERS').map((edge) => `${edge.from}|${edge.to}`));
  for (const family of graph.nodes.filter((node) => node.role === 'FAMILY' && node.detail.contractForm === 'VEX_FAMILY_CONTRACT')) {
    const states = graph.nodes.filter((node) => node.role === 'STATE' && node.family === family.ref);
    const controls = graph.nodes.filter((node) => node.role === 'CONTROL' && node.family === family.ref);
    for (const state of states) {
      for (const control of controls) {
        if (offered.has(`${state.ref}|${control.ref}`)) continue;
        cases.push({
          caseRef: `case:reject:${state.ref}:${control.detail.symbol}`,
          routeRef: null,
          family: family.ref,
          executionClass: 'A',
          target: { state: state.ref, control: control.ref },
          preconditions: { state: state.ref, guards: [] },
          actions: [{ control: control.ref, elementRefs: [] }],
          expect: { act: { kind: 'REJECT', admittedState: null, effect: null }, effectFree: true },
          deeper: [],
          graphFingerprint: graph.fingerprint,
        });
      }
    }
  }

  routes.sort((a, b) => compare(a.routeRef, b.routeRef));
  cases.sort((a, b) => compare(a.caseRef, b.caseRef));
  const journeys = deriveJourneys(graph, routes);
  const counts = Object.fromEntries(ROUTE_STATUSES.map((status) => [status, routes.filter((route) => route.status === status).length]));
  return Object.freeze({
    schemaVersion: EXPERIENCE_DERIVATION_SCHEMA,
    graphFingerprint: graph.fingerprint,
    counts,
    pathways: Object.freeze([...pathways.entries()].sort(([a], [b]) => compare(a, b)).map(([family, refs]) => ({ family, routeRefs: refs.sort(compare) }))),
    routes: Object.freeze(routes),
    journeys: Object.freeze(journeys),
    cases: Object.freeze(cases),
    manifestFingerprint: sha256(canonicalJson(cases)),
  });
}

function testCaseFor(route, fingerprint) {
  const pre = route.steps.find((step) => step.step === 'PRECONDITION');
  const action = route.steps.find((step) => step.step === 'HUMAN_ACTION');
  const act = route.steps.find((step) => step.step === 'ACT');
  return {
    caseRef: `case:${route.routeRef.slice('route:'.length)}`,
    routeRef: route.routeRef,
    family: route.family,
    executionClass: 'A',
    target: { state: pre.coordinate, control: action.coordinate },
    preconditions: { state: pre.coordinate, guards: pre.guards },
    actions: [{ control: action.coordinate, elementRefs: action.elementRefs }],
    expect: { act: act.act, effectFree: act.act.effect === null && act.act.admittedState === null },
    // Deeper steps are part of the route but need a harness beyond source law; they stay HELD
    // here instead of being asserted from the graph.
    deeper: route.steps
      .filter((step) => ['REALIZATION', 'OBSERVATION', 'PROJECTION'].includes(step.step) && step.coordinate)
      .map((step) => ({ step: step.step, coordinate: step.coordinate, executionClass: step.executionClass, status: step.executionClass === 'A' ? 'ASSERTABLE_FROM_SOURCE' : 'HELD_NO_HARNESS_IN_LANE' })),
    graphFingerprint: fingerprint,
  };
}

function explainRoute({ elements, stateNode, controlNode, act, steps, successors, surfaced, guards }) {
  const parts = ['<subject:user>'];
  parts.push(elements.length ? `<element:${elements[0]}>` : '<element:FRONTIER_DEBT>');
  parts.push(`<state:${stateNode.label}>${guards.length ? `[${guards.join(' && ')}]` : ''}`);
  parts.push(`<control:${controlNode.label}>`);
  if (act.admittedState) parts.push(`<admit:${act.admittedState.split('.').at(-1)}>`);
  if (act.effect) parts.push(`<effect:${act.effect.split('.').at(-1)}>`);
  const realization = steps.find((step) => step.step === 'REALIZATION');
  if (realization?.owners?.length) parts.push(`<realized-by:${realization.owners.join(' + ')}>`);
  if (act.effect) parts.push(successors.length ? `<observed:${successors.map((ref) => ref.split('.').at(-1)).join(' | ')}>` : '<observed:FRONTIER_DEBT>');
  parts.push(surfaced.length ? `<projection:${surfaced[0]}>` : '<projection:FRONTIER_DEBT>');
  return parts.join('\n  -> ');
}

// A journey is only as cleared as the routes feeding it; it inherits their smallest missing
// predicates (deduplicated) so FRONTIER_DEBT always says what is missing.
function inheritedMissing(routes) {
  const rows = new Map();
  for (const route of routes) {
    for (const row of route.missing) {
      const key = `${row.predicate}|${row.coordinate}`;
      const seen = rows.get(key) ?? { predicate: row.predicate, coordinate: row.coordinate, routes: [] };
      seen.routes.push(route.routeRef);
      rows.set(key, seen);
    }
  }
  return [...rows.values()].map((row) => ({ ...row, routes: row.routes.sort(compare) })).sort((a, b) => compare(`${a.predicate}|${a.coordinate}`, `${b.predicate}|${b.coordinate}`));
}

// Journeys the graph itself joins: a Family Effect realized into an owner whose current truth is
// captured at Send, or a Family State consumed as an admission gate on Send.
function deriveJourneys(graph, routes) {
  const index = graphIndex(graph);
  const journeys = [];
  const captures = graph.edges.filter((edge) => edge.kind === 'CAPTURED_AT_SEND');
  const gates = graph.edges.filter((edge) => edge.kind === 'CONSUMED_BY' && edge.detail?.gate === 'SEND_ADMISSION');
  for (const capture of captures) {
    const feeding = routes.filter((route) => route.steps.find((step) => step.step === 'REALIZATION')?.owners?.includes(capture.from));
    const receipts = (index.outgoing.get(capture.to) ?? []).filter((edge) => edge.kind === 'PROJECTS_TO').map((edge) => edge.to).sort(compare);
    journeys.push({
      journeyRef: `journey:capture:${capture.to.split('.').at(-1)}:${capture.from}`,
      shape: 'MUTABLE_CURRENT_TRUTH_CAPTURED_AT_SEND',
      captureEdge: capture.ref,
      currentTruthOwner: capture.from,
      feedingRoutes: feeding.map((route) => route.routeRef).sort(compare),
      sendManifestation: graph.edges.filter((edge) => edge.kind === 'MANIFESTS' && edge.to === 'DirectCompanionTurn').map((edge) => edge.from),
      receiptEvidence: receipts,
      captureLaw: index.nodes.get(capture.to).detail.captureLaw ?? null,
      status: feeding.length ? (feeding.every((route) => route.status === 'CLEARED') ? 'CLEARED' : 'FRONTIER_DEBT') : 'FRONTIER_DEBT',
      missing: feeding.length ? inheritedMissing(feeding) : [{ predicate: 'NO_FAMILY_ROUTE_REALIZES_CURRENT_TRUTH', coordinate: capture.from }],
    });
  }
  for (const gate of gates) {
    const reaching = routes.filter((route) => route.steps.find((step) => step.step === 'OBSERVATION')?.successors?.includes(gate.from)
      || route.steps.find((step) => step.step === 'ACT')?.act?.admittedState === gate.from);
    journeys.push({
      journeyRef: `journey:gate:${gate.detail.refusalCode}`,
      shape: 'CURRENT_STATE_GATES_SEND_ADMISSION',
      gateEdge: gate.ref,
      gatingTruth: gate.from,
      refusalCode: gate.detail.refusalCode,
      feedingRoutes: reaching.map((route) => route.routeRef).sort(compare),
      status: reaching.length ? (reaching.every((route) => route.status === 'CLEARED') ? 'CLEARED' : 'FRONTIER_DEBT') : 'UNKNOWN',
      missing: reaching.length ? inheritedMissing(reaching) : [{ predicate: 'NO_ROUTE_REACHES_GATING_TRUTH', coordinate: gate.from }],
    });
  }
  return journeys.sort((a, b) => compare(a.journeyRef, b.journeyRef));
}

// [VXG RealForever][VEXWORK][VEXLIFE-PROD][E2E][EXPERIENCE-GRAPH][DERIVATION]
