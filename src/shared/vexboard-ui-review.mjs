// VexBoard UI Blueprint review + construction brief.
//
// Review answers: "before someone builds this, what must they bind, what is held, what is
// stale against current source, and what would exclude a person?" It never mutates the
// blueprint. Reconciliation is offered as explicit edits, not silent rewrites.
//
// The construction brief is a deterministic, human/AI-readable projection of the same
// blueprint. It is a convenience for consumers; the JSON blueprint stays the meaning owner.
//
// REVIEW FINDING != WORK STATE
// CONSTRUCTION BRIEF != SECOND SOURCE OF TRUTH

import { expandBlueprint, UI_FRACTION_DENOMINATOR, UI_MIN_TOUCH_TARGET_DP, walkResolved } from './vexboard-ui-blueprint.mjs';
import { isKnownKind, kindSpec } from './vexboard-ui-kinds.mjs';

export const UI_REVIEW_SEVERITIES = Object.freeze(['ATTENTION', 'NOTE']);
export const UI_CURRENTNESS_STATES = Object.freeze(['CURRENT', 'MOVED', 'CHANGED', 'MISSING', 'UNKNOWN']);

function short(sha) {
  return String(sha ?? '').slice(0, 7);
}

function sourceNodes(blueprint) {
  const rows = blueprint.nodes.filter((node) => node.source).map((node) => ({ scope: null, node }));
  for (const definition of blueprint.definitions) {
    for (const node of definition.nodes) if (node.source) rows.push({ scope: definition.definitionRef, node });
  }
  return rows;
}

// Compare every node's source evidence with the currently loaded inventories.
//   CURRENT  same commit, occurrence present
//   MOVED    inventory advanced; occurrence still present with the same kind + label
//   CHANGED  inventory advanced; occurrence present but its kind or label changed
//   MISSING  inventory loaded, occurrence no longer exists
//   UNKNOWN  no current inventory for that Product is loaded
export function sourceCurrentness(blueprint, inventoriesBySubject) {
  return sourceNodes(blueprint).map(({ scope, node }) => {
    const inventory = inventoriesBySubject?.get?.(node.source.subjectRef) ?? null;
    const base = {
      scope,
      nodeRef: node.nodeRef,
      occurrenceRef: node.source.occurrenceRef,
      subjectRef: node.source.subjectRef,
      savedCommit: node.source.commit,
      currentCommitOrNull: inventory?.sourceSnapshot?.commit ?? null,
    };
    if (!inventory) return { ...base, state: 'UNKNOWN', detail: 'No current inventory is loaded for ' + node.source.subjectRef + '.' };
    const occurrence = inventory.occurrences.find((row) => row.occurrenceRef === node.source.occurrenceRef);
    if (!occurrence) return { ...base, state: 'MISSING', detail: 'The source occurrence no longer exists at ' + short(inventory.sourceSnapshot.commit) + '.' };
    if (occurrence.kind !== node.source.kind || occurrence.label !== node.source.label) {
      return {
        ...base,
        state: 'CHANGED',
        detail: 'Source now shows ' + occurrence.kind + ' "' + occurrence.label + '" (saved: ' + node.source.kind + ' "' + node.source.label + '").',
      };
    }
    if (inventory.sourceSnapshot.commit !== node.source.commit) {
      return { ...base, state: 'MOVED', detail: 'Source advanced ' + short(node.source.commit) + ' → ' + short(inventory.sourceSnapshot.commit) + '; occurrence unchanged.' };
    }
    return { ...base, state: 'CURRENT', detail: 'Matches current source.' };
  });
}

function accessibleName(node) {
  if (node.accessibility.labelOrNull) return node.accessibility.labelOrNull;
  return node.text?.value ?? null;
}

function finding(findings, severity, category, path, message) {
  findings.push({ severity, category, path, message });
}

export function reviewBlueprint(blueprint, { inventoriesBySubject = null } = {}) {
  const findings = [];
  const expanded = expandBlueprint(blueprint);
  const currentness = sourceCurrentness(blueprint, inventoriesBySubject);
  for (const row of currentness) {
    if (row.state === 'MISSING' || row.state === 'CHANGED') {
      finding(findings, 'ATTENTION', 'CURRENTNESS', (row.scope ? row.scope + ':' : '') + row.nodeRef, row.detail);
    } else if (row.state === 'MOVED') {
      finding(findings, 'NOTE', 'CURRENTNESS', (row.scope ? row.scope + ':' : '') + row.nodeRef, row.detail);
    }
  }
  const unknownCurrentness = currentness.filter((row) => row.state === 'UNKNOWN').length;
  if (unknownCurrentness) finding(findings, 'NOTE', 'CURRENTNESS', null, unknownCurrentness + ' element(s) come from a Product whose current inventory is not loaded, so currentness is unknown.');

  let notProjected = 0;
  let notLocalized = 0;
  const heldCandidates = new Set();
  const dispositions = { SOURCE_BOUND: 0, PORTABILITY_HELD: 0 };
  const overlayTargets = new Set();
  walkResolved(expanded, (node) => {
    for (const seam of node.seams) if (seam.targetPathOrNull) overlayTargets.add(seam.targetPathOrNull);
  });

  walkResolved(expanded, (node, parent) => {
    const spec = kindSpec(node.kind);
    const name = accessibleName(node);
    if (spec.focusable && !name) finding(findings, 'ATTENTION', 'ACCESSIBILITY', node.path, spec.label + ' has no accessible name. Give it text or an accessibility label.');
    if (spec.needsDescription && !node.accessibility.labelOrNull && !node.accessibility.decorative) {
      finding(findings, 'ATTENTION', 'ACCESSIBILITY', node.path, 'Image needs a description, or mark it decorative.');
    }
    if (spec.focusable) {
      for (const axis of ['width', 'height']) {
        const size = node.layout[axis];
        if (size.mode === 'FIXED' && size.valueOrNull < UI_MIN_TOUCH_TARGET_DP) {
          finding(findings, 'ATTENTION', 'ACCESSIBILITY', node.path, spec.label + ' ' + axis + ' is ' + size.valueOrNull + 'dp; touch targets should be at least ' + UI_MIN_TOUCH_TARGET_DP + 'dp.');
        }
      }
    }
    if (node.source?.accessibilityState === 'NOT_PROJECTED') notProjected += 1;
    if (node.text?.localization.state === 'NEEDS_KEY') {
      finding(findings, 'NOTE', 'LOCALIZATION', node.path, 'New text "' + node.text.value + '" needs a localization string before it ships.');
    } else if (node.text?.localization.state === 'NOT_PROJECTED') {
      notLocalized += 1;
    }
    if (node.source && !isKnownKind(node.kind)) {
      finding(findings, 'ATTENTION', 'PORTABILITY', node.path, 'Builder does not recognize source kind ' + node.kind + '; it is shown as a placeholder and must be realized by hand.');
    }
    if (node.source?.portable.disposition === 'SOURCE_BOUND') dispositions.SOURCE_BOUND += 1;
    if (node.source?.portable.disposition === 'PORTABILITY_HELD') {
      dispositions.PORTABILITY_HELD += 1;
      node.source.portable.heldCandidateRefs.forEach((ref) => heldCandidates.add(ref));
    }
    for (const seam of node.seams) {
      if (seam.kind === 'PRESENTATION' && !seam.targetPathOrNull && (seam.verbOrNull === 'SWAP' || seam.verbOrNull === 'REVEAL')) {
        finding(findings, 'NOTE', 'INTEGRATION', node.path, seam.verbOrNull === 'SWAP'
          ? 'Swaps a region (' + (seam.targetHintOrNull ?? 'unnamed') + '). Local Selection is HELD in A3, so the target app realizes the selection.'
          : 'Reveals ' + (seam.targetHintOrNull ?? 'a local element') + '; the target app realizes this local presentation.');
      }
    }
    const isContainer = node.layout.container !== null && node.layout.container !== undefined;
    if (isContainer && node.children.length === 0) finding(findings, 'NOTE', 'STRUCTURE', node.path, spec.label + ' is empty.');
    if (isContainer && node.layout.container.mode !== 'STACK' && node.children.length > 1) {
      const visual = [...node.children].sort((a, b) => visualKey(a) - visualKey(b)).map((row) => row.path);
      const reading = node.children.map((row) => row.path);
      if (visual.join('|') !== reading.join('|')) {
        finding(findings, 'NOTE', 'ACCESSIBILITY', node.path, 'Screen-reader order follows the Layers list, which differs from the visual top-to-bottom order here.');
      }
    }
    if (!parent && spec.overlay && !overlayTargets.has(node.path)) {
      finding(findings, 'NOTE', 'INTEGRATION', node.path, spec.label + ' is not opened by anything in this design; the target app must decide when it appears.');
    }
  });
  if (notProjected) finding(findings, 'NOTE', 'ACCESSIBILITY', null, 'Source does not project accessibility for ' + notProjected + ' element(s); names come from visible text.');
  if (notLocalized) finding(findings, 'NOTE', 'LOCALIZATION', null, notLocalized + ' source text(s) have no projected localization binding.');
  if (dispositions.SOURCE_BOUND) finding(findings, 'NOTE', 'PORTABILITY', null, dispositions.SOURCE_BOUND + ' element(s) are source-bound: no accepted portable relationship yet, so other targets realize them by hand.');
  if (dispositions.PORTABILITY_HELD) finding(findings, 'NOTE', 'PORTABILITY', null, dispositions.PORTABILITY_HELD + ' element(s) depend on held portable relationships (' + [...heldCandidates].sort().join(', ') + ').');

  const order = { ATTENTION: 0, NOTE: 1 };
  findings.sort((a, b) => order[a.severity] - order[b.severity] || a.category.localeCompare(b.category) || String(a.path ?? '').localeCompare(String(b.path ?? '')) || a.message.localeCompare(b.message));
  return {
    findings,
    currentness,
    counts: {
      attention: findings.filter((row) => row.severity === 'ATTENTION').length,
      note: findings.filter((row) => row.severity === 'NOTE').length,
      toBind: blueprint.derived.integration.actions.length + blueprint.derived.integration.navigation.length + blueprint.derived.integration.conditions.length
        + blueprint.derived.integration.presentation.filter((row) => row.binding === 'OPEN').length,
    },
  };
}

function visualKey(node) {
  const placement = node.layout.placement;
  if (placement?.type === 'FRACTION') return placement.y.start * 100 + placement.x.start;
  if (placement?.type === 'ANCHOR') {
    const row = placement.anchor.startsWith('TOP') ? 0 : placement.anchor.startsWith('CENTER') ? 1 : 2;
    const col = placement.anchor.endsWith('START') ? 0 : placement.anchor.endsWith('END') ? 2 : 1;
    return row * 100 + col;
  }
  return 0;
}

// ---------------------------------------------------------------------------------------
// construction brief
// ---------------------------------------------------------------------------------------

function describeLayout(layout) {
  const parts = [];
  if (layout.container) {
    const c = layout.container;
    if (c.mode === 'STACK') parts.push((c.axis === 'HORIZONTAL' ? 'horizontal' : 'vertical') + ' stack, gap ' + c.gap + ', padding ' + c.padding + ', align ' + c.align + ', justify ' + c.justify);
    else if (c.mode === 'OVERLAY') parts.push('layered (children anchored), padding ' + c.padding);
    else parts.push('free-form (children placed in 1/' + UI_FRACTION_DENOMINATOR + ' fractions), padding ' + c.padding);
  }
  const size = (axis) => {
    const value = layout[axis];
    return value.mode === 'FIXED' ? value.valueOrNull + 'dp' : value.mode.toLowerCase();
  };
  parts.push('width ' + size('width') + ', height ' + size('height'));
  if (layout.placement?.type === 'FRACTION') {
    const { x, y } = layout.placement;
    parts.push('x ' + x.start + (x.end === null ? '+hug' : '–' + x.end) + '/' + UI_FRACTION_DENOMINATOR + ', y ' + y.start + (y.end === null ? '+hug' : '–' + y.end) + '/' + UI_FRACTION_DENOMINATOR);
  } else if (layout.placement?.type === 'ANCHOR') {
    parts.push('anchored ' + layout.placement.anchor.toLowerCase().replace(/_/gu, '-') + ' inset ' + layout.placement.inset);
  }
  if (layout.depth) parts.push('depth ' + layout.depth);
  return parts.join('; ');
}

function describeNode(node) {
  const spec = kindSpec(node.kind);
  const bits = ['**' + spec.label + '**'];
  if (node.text) bits.push('"' + node.text.value + '"' + (node.text.origin === 'AUTHORED' ? ' (authored text, needs localization)' : ''));
  if (node.source) bits.push('source `' + node.source.elementRef + '` in ' + node.source.subjectRef.replace(/^subject\./u, '') + ' (' + node.source.portable.disposition.toLowerCase().replace(/_/gu, ' ') + ')');
  else if (node.kind === 'GROUP') bits.push('Builder layout group');
  if (node.instanceNodeRef) bits.push('instance of `' + node.instanceChain.at(-1)?.definitionRef + '`');
  if (node.visibility.presence === 'CONDITIONAL') bits.push('visible when `' + node.visibility.conditionKeyOrNull + '`');
  if (node.accessibility.labelOrNull) bits.push('a11y label "' + node.accessibility.labelOrNull + '"');
  if (node.accessibility.decorative) bits.push('decorative');
  const seams = node.seams.map((seam) => seam.trigger.toLowerCase() + ' → ' + seam.kind.toLowerCase() + ' `' + seam.key + '`' + (seam.targetPathOrNull ? ' (opens `' + seam.targetPathOrNull + '`)' : ''));
  if (seams.length) bits.push('on ' + seams.join(', '));
  return bits.join(' · ');
}

export function constructionBrief(blueprint, review = null) {
  const expanded = expandBlueprint(blueprint);
  const lines = [];
  const integration = blueprint.derived.integration;
  lines.push('# ' + blueprint.label + ' — UI construction brief');
  lines.push('');
  lines.push('Blueprint `' + blueprint.blueprintRef + '` · schema `' + blueprint.schemaVersion + '` · units dp, fractions of ' + UI_FRACTION_DENOMINATOR + '.');
  lines.push('Sources: ' + (blueprint.derived.sourceSnapshots.map((row) => '`' + row.repositoryRef + '@' + short(row.commit) + '`').join(', ') || 'none') + '.');
  lines.push('');
  lines.push('## Ground rules');
  lines.push('');
  lines.push('- This blueprint is construction intent. It runs nothing and owns no application State, Effect, Store or Family.');
  lines.push('- Every OPEN seam below must be registered by the rightful owner in the target app (one handler per action key). Do not implement behavior inside generated UI.');
  lines.push('- Builder-local presentation links (open/close an overlay) are already defined and may be realized as UI-local state.');
  lines.push('- Keep held / source-bound relationships explicit. Do not approximate them silently on another target.');
  lines.push('- Preserve each element `path` as a stable mapping key in generated code so it can be compared back to this blueprint.');
  lines.push('');
  const surface = blueprint.surface.container;
  lines.push('## Surface');
  lines.push('');
  lines.push('- ' + (surface.mode === 'STACK' ? (surface.axis === 'HORIZONTAL' ? 'Horizontal' : 'Vertical') + ' stack (scrolls), gap ' + surface.gap + ', padding ' + surface.padding : surface.mode === 'OVERLAY' ? 'Layered surface' : 'Free-form surface (fractions of the viewport)'));
  lines.push('');
  const tree = (title, roots) => {
    lines.push('## ' + title);
    lines.push('');
    if (!roots.length) {
      lines.push('_none_');
      lines.push('');
      return;
    }
    const visit = (node, depth) => {
      lines.push('  '.repeat(depth) + '- `' + node.path + '` ' + describeNode(node));
      lines.push('  '.repeat(depth + 1) + '- layout: ' + describeLayout(node.layout));
      node.children.forEach((child) => visit(child, depth + 1));
    };
    roots.forEach((root) => visit(root, 0));
    lines.push('');
  };
  tree('Structure', expanded.content);
  tree('Overlays (shown when opened)', expanded.overlays);
  lines.push('## Seams to bind');
  lines.push('');
  if (!integration.actions.length && !integration.navigation.length && !integration.conditions.length) lines.push('_No open action, navigation or condition seams._');
  for (const row of integration.actions) {
    lines.push('- action `' + row.key + '`' + (row.sourceActionKeys.length ? ' (source action key ' + row.sourceActionKeys.map((key) => '`' + key + '`').join(', ') + ')' : '') + ' ← ' + row.uses.map((use) => '`' + use.path + '` ' + use.trigger.toLowerCase()).join(', '));
  }
  for (const row of integration.navigation) {
    lines.push('- navigation `' + row.key + '`' + (row.destinations.length ? ' → ' + row.destinations.join(', ') : '') + ' ← ' + row.uses.map((use) => '`' + use.path + '`').join(', '));
  }
  for (const row of integration.conditions) {
    lines.push('- condition `' + row.key + '` controls ' + row.paths.map((path) => '`' + path + '`').join(', ') + (row.sourceVisibleWhen.length ? ' (source: ' + row.sourceVisibleWhen.join(', ') + ')' : ''));
  }
  const local = integration.presentation.filter((row) => row.binding === 'BUILDER_LOCAL');
  const openPresentation = integration.presentation.filter((row) => row.binding === 'OPEN');
  for (const row of openPresentation) lines.push('- presentation `' + row.key + '` (' + String(row.verb).toLowerCase() + (row.targetHintOrNull ? ' ' + row.targetHintOrNull : '') + ') ← `' + row.path + '`');
  lines.push('');
  if (local.length) {
    lines.push('## Builder-local presentation (already defined)');
    lines.push('');
    for (const row of local) lines.push('- `' + row.path + '` ' + row.trigger.toLowerCase() + ' → ' + String(row.verb).toLowerCase() + ' `' + row.targetPathOrNull + '`');
    lines.push('');
  }
  if (blueprint.definitions.length) {
    lines.push('## Reusable components');
    lines.push('');
    for (const definition of blueprint.definitions) {
      lines.push('- `' + definition.definitionRef + '` "' + definition.label + '" v' + definition.version
        + ' · ports: ' + (definition.ports.map((port) => '`' + port.portRef + '`=' + port.defaultKey).join(', ') || 'none')
        + ' · slots: ' + (definition.slots.map((slot) => '`' + slot.slotRef + '`').join(', ') || 'none'));
    }
    lines.push('');
  }
  if (review) {
    lines.push('## Review notes');
    lines.push('');
    if (!review.findings.length) lines.push('_No findings._');
    for (const row of review.findings) lines.push('- ' + row.severity.toLowerCase() + ' · ' + row.category.toLowerCase() + (row.path ? ' · `' + row.path + '`' : '') + ' — ' + row.message);
    lines.push('');
  }
  return lines.join('\n');
}

// [VXG RealForever][VEXWORK][COMPONENT-LIBRARY][A5-UI-REVIEW]
