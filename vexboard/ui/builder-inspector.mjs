// Builder inspector: plain-language editing of one selected element.
// Every control issues an editor command; nothing here mutates the draft directly.

import { UI_ANCHORS, UI_FRACTION_DENOMINATOR, UI_SPACING_TOKENS } from '../../src/shared/vexboard-ui-blueprint.mjs';
import { containerModeOf, nodeKind, scopeNodes } from '../../src/shared/vexboard-ui-document.mjs';
import { kindSpec, UI_TRIGGERS } from '../../src/shared/vexboard-ui-kinds.mjs';
import { h, humanize } from './component-renderer.mjs';

const D = UI_FRACTION_DENOMINATOR;
const MODE_LABELS = { STACK: 'Stack', OVERLAY: 'Layered', FREEFORM: 'Free-form' };
const SEAM_LABELS = { ACTION: 'App action', NAVIGATION: 'Navigation', PRESENTATION: 'Local UI' };

function section(title, open, ...body) {
  const details = h('details', { class: 'insp-section', open: open ? true : null }, h('summary', {}, title), h('div', { class: 'insp-body' }, ...body));
  return details;
}

function field(label, control, hint = null) {
  return h('label', { class: 'insp-field' }, h('span', { class: 'insp-label' }, label), control, hint ? h('span', { class: 'insp-hint' }, hint) : null);
}

function select(value, options, onchange, attrs = {}) {
  return h('select', { onchange: (event) => onchange(event.target.value), ...attrs }, options.map(([key, label]) => h('option', { value: key, selected: key === value ? true : null }, label)));
}

function segmented(value, options, onchange, label) {
  return h('div', { class: 'segmented', role: 'radiogroup', 'aria-label': label }, options.map(([key, text]) => h('button', {
    type: 'button',
    role: 'radio',
    'aria-checked': key === value ? 'true' : 'false',
    class: key === value ? 'on' : '',
    onclick: () => onchange(key),
  }, text)));
}

function textInput(value, onchange, attrs = {}) {
  return h('input', { type: 'text', value: value ?? '', onchange: (event) => onchange(event.target.value), ...attrs });
}

function sizeControl(axis, size, apply, nodeRef) {
  const mode = size.mode;
  const number = h('input', {
    type: 'number', min: '1', step: '1', value: mode === 'FIXED' ? String(size.valueOrNull) : '', placeholder: 'dp', disabled: mode !== 'FIXED' ? true : null,
    'aria-label': humanize(axis) + ' in dp',
    onchange: (event) => apply({ type: 'UPDATE_LAYOUT', nodeRef, patch: { [axis]: { mode: 'FIXED', valueOrNull: Math.max(1, Number(event.target.value) || 1) } } }),
  });
  return h('div', { class: 'size-row' },
    segmented(mode, [['HUG', 'Hug'], ['FILL', 'Fill'], ['FIXED', 'Fixed']], (next) => apply({ type: 'UPDATE_LAYOUT', nodeRef, patch: { [axis]: next === 'FIXED' ? { mode: 'FIXED', valueOrNull: size.valueOrNull ?? (axis === 'width' ? 160 : 48) } : { mode: next } } }), humanize(axis)),
    number);
}

function containerControls(container, onPatch) {
  const tokens = Object.keys(UI_SPACING_TOKENS).map((key) => [key, key === 'NONE' ? 'None' : key + ' · ' + UI_SPACING_TOKENS[key]]);
  const rows = [field('Arrange children', segmented(container.mode, Object.entries(MODE_LABELS), (mode) => onPatch({ mode }), 'Arrange children'))];
  if (container.mode === 'STACK') {
    rows.push(field('Direction', segmented(container.axis, [['VERTICAL', '↓ Vertical'], ['HORIZONTAL', '→ Horizontal']], (axis) => onPatch({ axis }), 'Direction')));
    rows.push(field('Align', select(container.align, [['STRETCH', 'Stretch'], ['START', 'Start'], ['CENTER', 'Center'], ['END', 'End']], (align) => onPatch({ align }))));
    rows.push(field('Distribute', select(container.justify, [['START', 'Packed at start'], ['CENTER', 'Centered'], ['END', 'Packed at end'], ['SPACE_BETWEEN', 'Spread out']], (justify) => onPatch({ justify }))));
    rows.push(field('Gap', select(container.gap, tokens, (gap) => onPatch({ gap }))));
  } else if (container.mode === 'FREEFORM') {
    rows.push(h('p', { class: 'insp-note' }, 'Children are placed in 24ths of this area, so they keep their proportions on every screen size. Drag to move; pull a handle to resize.'));
  } else {
    rows.push(h('p', { class: 'insp-note' }, 'Children stack on top of each other, each pinned to an anchor.'));
  }
  rows.push(field('Padding', select(container.padding, tokens, (padding) => onPatch({ padding }))));
  return rows;
}

function placementControls(node, apply) {
  const placement = node.layout.placement;
  if (placement?.type === 'FRACTION') {
    const set = (axisName, key, raw) => {
      const axis = { ...placement[axisName] };
      axis[key] = raw === '' || raw === null ? null : Math.max(0, Math.min(D, Math.round(Number(raw))));
      if (key === 'start') axis.start = Math.min(axis.start ?? 0, D - 1);
      if (axis.end !== null && axis.end <= axis.start) axis.end = Math.min(D, axis.start + 1);
      apply({ type: 'PLACE', nodeRef: node.nodeRef, placement: { ...placement, [axisName]: axis } });
    };
    const num = (axisName, key, label) => h('label', { class: 'frac' }, h('span', {}, label), h('input', {
      type: 'number', min: '0', max: String(D), value: placement[axisName][key] === null ? '' : String(placement[axisName][key]), placeholder: 'hug',
      onchange: (event) => set(axisName, key, event.target.value),
    }));
    return [
      h('p', { class: 'insp-note' }, 'Position in 24ths of the parent. Leave an end empty to hug the content.'),
      h('div', { class: 'frac-grid' }, num('x', 'start', 'From start'), num('x', 'end', 'To'), num('y', 'start', 'From top'), num('y', 'end', 'To')),
    ];
  }
  if (placement?.type === 'ANCHOR') {
    const grid = h('div', { class: 'anchor-grid', role: 'radiogroup', 'aria-label': 'Anchor' }, UI_ANCHORS.map((anchor) => h('button', {
      type: 'button', role: 'radio', title: humanize(anchor), 'aria-label': humanize(anchor), 'aria-checked': anchor === placement.anchor ? 'true' : 'false', class: anchor === placement.anchor ? 'on' : '',
      onclick: () => apply({ type: 'PLACE', nodeRef: node.nodeRef, placement: { ...placement, anchor } }),
    })));
    const inset = select(placement.inset, Object.keys(UI_SPACING_TOKENS).map((key) => [key, key === 'NONE' ? 'None' : key + ' · ' + UI_SPACING_TOKENS[key]]), (value) => apply({ type: 'PLACE', nodeRef: node.nodeRef, placement: { ...placement, inset: value } }));
    return [field('Anchor', grid), field('Inset', inset)];
  }
  return [];
}

function depthControls(node, siblings, apply) {
  const ordered = [...siblings].sort((a, b) => a.layout.depth - b.layout.depth);
  const index = ordered.findIndex((row) => row.nodeRef === node.nodeRef);
  const button = (action, text, disabled) => h('button', { type: 'button', class: 'btn', disabled: disabled ? true : null, onclick: () => apply({ type: 'DEPTH', nodeRef: node.nodeRef, action }) }, text);
  return [
    h('p', { class: 'insp-note' }, 'Layer ' + (index + 1) + ' of ' + ordered.length + ' among its siblings. Higher layers draw in front.'),
    h('div', { class: 'btn-grid' }, button('BACK', 'Send to back', index <= 0), button('BACKWARD', 'Backward', index <= 0), button('FORWARD', 'Forward', index >= ordered.length - 1), button('FRONT', 'Bring to front', index >= ordered.length - 1)),
  ];
}

function seamEditor(node, seam, overlays, apply) {
  const head = h('div', { class: 'seam-head' },
    h('span', { class: 'seam-kind seam-' + seam.kind.toLowerCase() }, SEAM_LABELS[seam.kind]),
    h('span', { class: 'seam-trigger' }, 'on ' + humanize(seam.trigger)),
    h('span', { class: 'spacer' }),
    h('span', { class: 'seam-origin' }, seam.origin === 'SOURCE' ? 'from source' : 'added here'),
    h('button', { type: 'button', class: 'icon-btn', title: 'Remove', 'aria-label': 'Remove this behavior', onclick: () => apply({ type: 'REMOVE_SEAM', nodeRef: node.nodeRef, seamRef: seam.seamRef }) }, '×'));
  const rows = [head];
  if (seam.kind === 'PRESENTATION') {
    const verbs = [['OPEN', 'Opens'], ['CLOSE', 'Closes'], ['TOGGLE', 'Toggles']];
    const target = select(seam.targetNodeRefOrNull ?? '', [['', overlays.length ? 'Choose an overlay…' : 'No overlays in this design'], ...overlays.map((row) => [row.nodeRef, row.label])],
      (value) => apply({ type: 'SET_SEAM', nodeRef: node.nodeRef, seamRef: seam.seamRef, patch: { targetNodeRefOrNull: value || null, ...(value && !['OPEN', 'CLOSE', 'TOGGLE'].includes(seam.verbOrNull) ? { verbOrNull: 'OPEN' } : {}) } }));
    if (['OPEN', 'CLOSE', 'TOGGLE'].includes(seam.verbOrNull)) {
      rows.push(h('div', { class: 'seam-row' }, select(seam.verbOrNull, verbs, (value) => apply({ type: 'SET_SEAM', nodeRef: node.nodeRef, seamRef: seam.seamRef, patch: { verbOrNull: value } })), target));
      rows.push(h('p', { class: 'insp-note' }, seam.targetNodeRefOrNull ? 'Builder owns this link. Try it with “Try it” in the toolbar.' : 'Source says this ' + humanize(seam.verbOrNull).toLowerCase() + 's ' + (seam.targetHintOrNull ?? 'something') + '. Link an overlay here, or leave it for the app.'));
    } else {
      rows.push(h('p', { class: 'insp-note' }, humanize(seam.verbOrNull) + ' ' + (seam.targetHintOrNull ?? '') + ' — realized by the target app (Local Selection is held).'));
    }
  } else {
    rows.push(field(seam.kind === 'ACTION' ? 'Action name' : 'Navigation name', textInput(seam.key, (value) => apply({ type: 'SET_SEAM', nodeRef: node.nodeRef, seamRef: seam.seamRef, patch: { key: value } }), { spellcheck: 'false', class: 'mono' })));
    if (seam.kind === 'NAVIGATION') rows.push(field('Destination', textInput(seam.destinationOrNull, (value) => apply({ type: 'SET_SEAM', nodeRef: node.nodeRef, seamRef: seam.seamRef, patch: { destinationOrNull: value } }), { placeholder: 'screen or URL' })));
    const source = seam.source?.intent ? 'Source: ' + seam.source.intent + (seam.source.actionKeyOrNull ? ' · ' + seam.source.actionKeyOrNull : '') : null;
    rows.push(h('p', { class: 'insp-note' }, (source ? source + '. ' : '') + 'Open seam — the app registers what this does.'));
  }
  if (kindSpec(node.kind).triggers.length > 1) {
    rows.push(field('Trigger', select(seam.trigger, UI_TRIGGERS.filter((row) => kindSpec(node.kind).triggers.includes(row)).map((row) => [row, humanize(row)]), (value) => apply({ type: 'SET_SEAM', nodeRef: node.nodeRef, seamRef: seam.seamRef, patch: { trigger: value } }))));
  }
  return h('div', { class: 'seam' }, rows);
}

function overlayChoices(state) {
  return scopeNodes(state.draft, state.scope)
    .filter((row) => !row.parentRef && kindSpec(nodeKind(state.draft, row)).overlay)
    .map((row) => ({ nodeRef: row.nodeRef, label: (row.content?.text?.value ?? row.source?.label ?? kindSpec(nodeKind(state.draft, row)).label) + ' · ' + kindSpec(nodeKind(state.draft, row)).label }));
}

export function renderInspector({ state, apply, actions, currentnessFor, definitionFor }) {
  const nodes = scopeNodes(state.draft, state.scope);
  const node = nodes.find((row) => row.nodeRef === state.selection);
  if (!node) return renderSurfaceInspector({ state, apply });
  const kind = nodeKind(state.draft, node);
  const spec = kindSpec(kind);
  const resolved = state.blueprint;
  const definition = node.instance ? definitionFor(node.instance.definitionRef) : null;
  const parentMode = !node.parentRef && spec.overlay ? null : containerModeOf(state.draft, state.scope, node.parentRef ?? null, node.slotRef ?? null);
  const origin = node.instance
    ? h('span', { class: 'origin origin-instance' }, '◇ Instance of ' + definition?.label + ' v' + definition?.version)
    : node.source
      ? h('span', { class: 'origin origin-source' }, 'From ' + actions.productLabel(node.source.subjectRef))
      : h('span', { class: 'origin origin-layout' }, 'Builder layout group');
  const header = h('div', { class: 'insp-header' },
    h('div', { class: 'insp-title' }, h('strong', {}, spec.label), origin),
    h('div', { class: 'insp-path mono' }, node.nodeRef));
  const out = [header];

  // Content
  if (node.instance) {
    const overrides = definition.texts.map((text) => {
      const current = node.instance.textOverrides.find((row) => row.templatePath === text.templatePath)?.value ?? '';
      return field(text.defaultValue.length > 28 ? text.defaultValue.slice(0, 28) + '…' : text.defaultValue, textInput(current, (value) => apply({ type: 'SET_OVERRIDE', nodeRef: node.nodeRef, templatePath: text.templatePath, value }), { placeholder: text.defaultValue }));
    });
    const bindings = definition.ports.map((port) => {
      const current = node.instance.portBindings.find((row) => row.portRef === port.portRef)?.key ?? '';
      return field(SEAM_LABELS[port.kind] + ' · ' + humanize(port.trigger), textInput(current, (value) => apply({ type: 'SET_BINDING', nodeRef: node.nodeRef, portRef: port.portRef, key: value || null }), { placeholder: port.defaultKey, class: 'mono', spellcheck: 'false' }));
    });
    out.push(section('Component', true,
      h('p', { class: 'insp-note' }, 'This instance follows ' + definition.label + '. Change its texts or behavior names here; change its structure by editing the component.'),
      overrides.length ? h('div', { class: 'insp-group' }, h('h4', {}, 'Texts'), overrides) : null,
      bindings.length ? h('div', { class: 'insp-group' }, h('h4', {}, 'Behavior names'), bindings) : null,
      definition.slots.length ? h('p', { class: 'insp-note' }, 'Slots: ' + definition.slots.map((row) => row.label).join(', ') + ' — drop content into them on the canvas.') : null,
      h('div', { class: 'btn-row' },
        h('button', { type: 'button', class: 'btn soft', onclick: () => actions.editDefinition(definition.definitionRef) }, 'Edit component'),
        h('button', { type: 'button', class: 'btn', onclick: () => apply({ type: 'DETACH', nodeRef: node.nodeRef }) }, 'Detach'))));
  } else if (spec.text && node.source) {
    const text = resolvedText(resolved, state, node);
    const authored = text?.origin === 'AUTHORED';
    out.push(section('Content', true,
      field('Text', h('textarea', { rows: '2', onchange: (event) => apply({ type: 'SET_TEXT', nodeRef: node.nodeRef, value: event.target.value }) }, text?.value ?? '')),
      h('div', { class: 'chip-row' },
        authored ? h('span', { class: 'chip warn' }, 'New text · needs a localization string') : h('span', { class: 'chip ' + (text?.localization.state === 'BOUND' ? 'good' : '') }, text?.localization.state === 'BOUND' ? 'Localized in source' : 'Source text'),
        authored ? h('button', { type: 'button', class: 'link-btn', onclick: () => apply({ type: 'SET_TEXT', nodeRef: node.nodeRef, value: '' }) }, 'Reset to source') : null)));
  }

  // Layout
  const layoutRows = [];
  if (node.layout.container && !node.instance) layoutRows.push(...containerControls(node.layout.container, (patch) => apply({ type: 'UPDATE_LAYOUT', nodeRef: node.nodeRef, patch: { container: patch } })));
  if (!spec.overlay || node.parentRef) {
    if (parentMode !== 'FREEFORM' || node.layout.placement?.x?.end === null) layoutRows.push(field('Width', sizeControl('width', node.layout.width, apply, node.nodeRef)));
    if (parentMode !== 'FREEFORM' || node.layout.placement?.y?.end === null) layoutRows.push(field('Height', sizeControl('height', node.layout.height, apply, node.nodeRef)));
  } else if (node.layout.container?.mode === 'FREEFORM') {
    layoutRows.push(field('Height', sizeControl('height', node.layout.height, apply, node.nodeRef)));
  }
  layoutRows.push(...placementControls(node, apply));
  const layered = parentMode === 'OVERLAY' || parentMode === 'FREEFORM' || (!node.parentRef && spec.overlay);
  if (layered) {
    const siblings = nodes.filter((row) => (row.parentRef ?? null) === (node.parentRef ?? null) && (row.slotRef ?? null) === (node.slotRef ?? null)
      && (node.parentRef || Boolean(kindSpec(nodeKind(state.draft, row)).overlay) === Boolean(spec.overlay)));
    if (siblings.length > 1) layoutRows.push(h('div', { class: 'insp-group' }, h('h4', {}, 'Depth'), depthControls(node, siblings, apply)));
  } else if (parentMode === 'STACK') {
    layoutRows.push(h('p', { class: 'insp-note' }, 'In a stack, order is position. Reorder in Layers or drag it; depth only applies in layered or free-form areas.'));
  }
  if (spec.overlay && !node.parentRef) layoutRows.push(h('p', { class: 'insp-note' }, spec.label + 's sit on the overlay layer above the screen and appear when opened.'));
  out.push(section('Layout', true, layoutRows));

  // Behavior
  if (!node.instance) {
    const seams = node.behavior.seams.map((seam) => seamEditor(node, seam, overlayChoices(state).filter((row) => row.nodeRef !== node.nodeRef), apply));
    const interactive = spec.triggers.length > 0;
    out.push(section('Behavior', seams.length > 0 || interactive,
      seams.length ? seams : h('p', { class: 'insp-note' }, interactive ? 'Source projects no behavior for this element, so none is assumed.' : 'This element has no interaction.'),
      interactive ? h('div', { class: 'btn-row' },
        h('button', { type: 'button', class: 'btn', onclick: () => actions.addSeam(node, 'ACTION') }, '+ App action'),
        h('button', { type: 'button', class: 'btn', onclick: () => actions.addSeam(node, 'NAVIGATION') }, '+ Navigation'),
        h('button', { type: 'button', class: 'btn', onclick: () => actions.addSeam(node, 'PRESENTATION') }, '+ Open overlay')) : null,
      h('p', { class: 'insp-fine' }, 'Builder records what should happen, never how. The target app owns behavior.')));
  }

  // Visibility
  const visibility = resolvedVisibility(state, node);
  const presenceOptions = spec.overlay && !node.parentRef ? [['WHEN_OPEN', 'When opened'], ['ALWAYS', 'Always'], ['CONDITIONAL', 'When…']] : [['ALWAYS', 'Always'], ['CONDITIONAL', 'When…']];
  out.push(section('Visibility', visibility.presence === 'CONDITIONAL',
    field('Shown', segmented(visibility.presence, presenceOptions, (presence) => apply({ type: 'SET_VISIBILITY', nodeRef: node.nodeRef, presence, conditionKeyOrNull: presence === 'CONDITIONAL' ? (visibility.conditionKeyOrNull ?? 'condition') : null }), 'Shown')),
    visibility.presence === 'CONDITIONAL' ? field('Condition name', textInput(visibility.conditionKeyOrNull, (value) => apply({ type: 'SET_VISIBILITY', nodeRef: node.nodeRef, presence: 'CONDITIONAL', conditionKeyOrNull: value }), { class: 'mono', spellcheck: 'false' }), 'The app decides when this is true.') : null,
    visibility.sourceVisibleWhenOrNull ? h('p', { class: 'insp-note' }, 'Source: visible when ' + visibility.sourceVisibleWhenOrNull) : null,
    visibility.presence === 'CONDITIONAL' ? h('label', { class: 'check' }, h('input', { type: 'checkbox', checked: !actions.isConditionHidden(node.nodeRef), onchange: (event) => actions.setConditionHidden(node.nodeRef, !event.target.checked) }), 'Show in preview') : null));

  // Accessibility
  const name = node.accessibility?.labelOrNull ?? '';
  out.push(section('Accessibility', false,
    field('Role', h('span', { class: 'mono' }, spec.a11yRole)),
    field('Accessible name', textInput(name, (value) => apply({ type: 'SET_ACCESSIBILITY', nodeRef: node.nodeRef, patch: { labelOrNull: value } }), { placeholder: 'Uses the visible text' })),
    kind === 'IMAGE' ? h('label', { class: 'check' }, h('input', { type: 'checkbox', checked: Boolean(node.accessibility?.decorative), onchange: (event) => apply({ type: 'SET_ACCESSIBILITY', nodeRef: node.nodeRef, patch: { decorative: event.target.checked } }) }), 'Decorative (screen readers skip it)') : null,
    h('p', { class: 'insp-note' }, 'Screen readers follow the Layers order.')));

  // Source
  if (node.source) {
    const currentness = currentnessFor(node.nodeRef);
    out.push(section('Source', false,
      h('dl', { class: 'kv' },
        h('dt', {}, 'Product'), h('dd', {}, actions.productLabel(node.source.subjectRef)),
        h('dt', {}, 'Screen'), h('dd', {}, node.source.surfaceLabelOrNull ?? node.source.surfaceRef),
        h('dt', {}, 'Element'), h('dd', { class: 'mono' }, node.source.elementRef),
        h('dt', {}, 'Commit'), h('dd', { class: 'mono' }, node.source.commit.slice(0, 10)),
        node.source.sourcePathOrNull ? [h('dt', {}, 'File'), h('dd', { class: 'mono' }, node.source.sourcePathOrNull)] : null,
        h('dt', {}, 'Portability'), h('dd', {}, humanize(node.source.portable.disposition)),
        node.source.styleOrNull ? [h('dt', {}, 'Style'), h('dd', {}, node.source.styleOrNull)] : null,
        node.source.layerOrNull ? [h('dt', {}, 'Source layer'), h('dd', {}, node.source.layerOrNull + ' (evidence, not depth)')] : null),
      currentness ? h('div', { class: 'chip-row' }, h('span', { class: 'chip ' + ({ CURRENT: 'good', MOVED: '', CHANGED: 'warn', MISSING: 'warn', UNKNOWN: '' }[currentness.state]) }, humanize(currentness.state)), h('span', { class: 'insp-note' }, currentness.detail),
        currentness.state === 'MOVED' ? h('button', { type: 'button', class: 'link-btn', onclick: () => actions.rebind(node) }, 'Use current source') : null) : null,
      h('div', { class: 'btn-row' }, actions.libraryLink(node))));
  }

  out.push(h('div', { class: 'insp-actions' },
    !node.instance || state.scope ? null : null,
    h('button', { type: 'button', class: 'btn', onclick: () => apply({ type: 'DUPLICATE', nodeRef: node.nodeRef }), title: 'Duplicate (Ctrl/⌘ D)' }, 'Duplicate'),
    state.scope && node.parentRef === null ? null : h('button', { type: 'button', class: 'btn soft', onclick: () => actions.createDefinition(node) }, 'Make component'),
    h('button', { type: 'button', class: 'btn danger', onclick: () => actions.remove(node), title: 'Delete (Del)' }, 'Delete')));
  if (state.scope && node.layout.container && !node.instance) {
    const definitionDraft = state.draft.definitions.find((row) => row.definitionRef === state.scope);
    const slot = definitionDraft.slots.find((row) => row.templateNodeRef === node.nodeRef);
    out.splice(2, 0, section('Slot', true,
      h('p', { class: 'insp-note' }, 'A slot lets each instance put its own content here.'),
      field('Slot name', textInput(slot?.slotRef ?? '', (value) => apply({ type: 'SET_SLOT', templateNodeRef: node.nodeRef, slotRef: value || null, label: value || null }), { placeholder: 'not a slot', class: 'mono' }))));
  }
  return out;
}

function resolvedText(blueprint, state, node) {
  const list = state.scope ? blueprint.definitions.find((row) => row.definitionRef === state.scope)?.nodes : blueprint.nodes;
  return list?.find((row) => row.nodeRef === node.nodeRef)?.content?.text ?? null;
}

function resolvedVisibility(state, node) {
  const list = state.scope ? state.blueprint.definitions.find((row) => row.definitionRef === state.scope)?.nodes : state.blueprint.nodes;
  return list?.find((row) => row.nodeRef === node.nodeRef)?.visibility ?? { presence: 'ALWAYS', conditionKeyOrNull: null, sourceVisibleWhenOrNull: null };
}

function renderSurfaceInspector({ state, apply }) {
  if (state.scope) {
    const definition = state.draft.definitions.find((row) => row.definitionRef === state.scope);
    return [h('div', { class: 'insp-header' }, h('div', { class: 'insp-title' }, h('strong', {}, definition.label), h('span', { class: 'origin origin-instance' }, 'Component · v' + definition.version))),
      h('p', { class: 'insp-note' }, 'Select an element of the component to edit it. Changes apply to every instance when you press Done.'),
      field('Component name', textInput(definition.label, (value) => apply({ type: 'RENAME_DEFINITION', definitionRef: definition.definitionRef, label: value })))];
  }
  const container = state.draft.surface.container;
  const full = { gap: 'M', padding: 'L', align: 'STRETCH', justify: 'START', axis: 'VERTICAL', ...container };
  return [
    h('div', { class: 'insp-header' }, h('div', { class: 'insp-title' }, h('strong', {}, 'Screen'), h('span', { class: 'origin origin-layout' }, 'Design surface'))),
    h('p', { class: 'insp-note' }, 'Nothing selected. These settings arrange the top level of the screen. A vertical stack scrolls like most app screens; free-form places things in 24ths of the screen.'),
    section('Layout', true, containerControls(full, (patch) => apply({ type: 'SET_SURFACE', container: patch }))),
  ];
}

// [VXG RealForever][VEXWORK][COMPONENT-LIBRARY][A5-BUILDER-INSPECTOR]
