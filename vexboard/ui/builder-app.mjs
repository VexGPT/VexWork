// VexBoard UI Builder — browser application.
//
// Owns only browser concerns: loading source projections, the palette, layers, canvas
// interaction (drag / move / resize / keyboard), preview state, review and file handoff.
// Meaning lives in the UI Blueprint; every edit is an editor command.

import * as Catalog from '../../src/shared/vexboard-lens-catalog.mjs';
import * as Components from '../../src/shared/vexboard-component-inventory.mjs';
import * as Architecture from '../../src/shared/vexboard-component-architecture.mjs';
import * as Ui from '../../src/shared/vexboard-ui-blueprint.mjs';
import * as Doc from '../../src/shared/vexboard-ui-document.mjs';
import * as Review from '../../src/shared/vexboard-ui-review.mjs';
import { canContainKind, kindSpec, UI_CATEGORY_LABELS, UI_KIND_CATEGORIES, UI_LAYOUT_GROUPS } from '../../src/shared/vexboard-ui-kinds.mjs';
import { h, humanize, RENDERER_CSS, renderThumb } from './component-renderer.mjs';
import { CANVAS_CSS, renderViewport, selectablePath } from './builder-canvas.mjs';
import { renderInspector } from './builder-inspector.mjs';

const CATALOG_URL = '../projects/vexboard/lens/catalog.json';
const INVENTORY_DIR = '../projects/component-library-architecture/inventory/';
const ARCHITECTURE_URL = '../projects/component-library-architecture/component-architecture-catalog.json';
export const DRAFT_STORAGE_KEY = 'vexboard.ui-builder.draft/v2';
const D = Ui.UI_FRACTION_DENOMINATOR;
const EXAMPLE_PAGE = 40;

const $ = (id) => document.getElementById(id);

const app = {
  catalog: null,
  architecture: null,
  inventories: new Map(), // slug -> inventory
  bySubject: new Map(), // subjectRef -> inventory
  families: [],
  editor: Doc.createEditorState(),
  ui: {
    tab: 'ADD',
    query: '',
    product: '',
    expanded: new Set(),
    examplesShown: new Map(),
    collapsed: new Set(),
    zoomMode: 'FIT',
    reviewOpen: false,
    migrationNotes: [],
  },
  preview: { openOverlays: new Set(), hiddenConditions: new Set(), stressText: false, tryMode: false, toggled: new Set() },
  review: null,
};

// ---------------------------------------------------------------------------------------
// state transitions
// ---------------------------------------------------------------------------------------

function status(message, tone = 'info') {
  const el = $('status');
  el.textContent = message ?? '';
  el.dataset.tone = tone;
}

function commit(nextState, message = null) {
  app.editor = nextState;
  app.review = null;
  render();
  if (message) status(message);
  scheduleSave();
}

const DONE = {
  MOVE: 'Moved.', PLACE: 'Placed.', UPDATE_LAYOUT: 'Layout updated.', SET_SURFACE: 'Screen layout updated.', SET_TEXT: 'Text updated.',
  ADD_SEAM: 'Behavior added — it stays open for the app to implement.', SET_SEAM: 'Behavior updated.', REMOVE_SEAM: 'Behavior removed.',
  SET_VISIBILITY: 'Visibility updated.', SET_ACCESSIBILITY: 'Accessibility updated.', DEPTH: 'Layer order updated.', DUPLICATE: 'Duplicated.',
  DETACH: 'Detached — these are now ordinary editable elements.', SET_OVERRIDE: 'Instance text updated.', SET_BINDING: 'Instance behavior name updated.',
  SET_SLOT: 'Slot updated.', RENAME_DEFINITION: 'Component renamed.', DELETE_DEFINITION: 'Component removed from the library.', RENAME: 'Design renamed.',
  REBIND_SOURCE: 'Now pointing at the current source commit.',
};

export function apply(command) {
  const result = Doc.applyCommand(app.editor, command);
  if (!result.ok) {
    status(result.message, 'error');
    return false;
  }
  commit(result.state, result.message ?? DONE[command.type] ?? '');
  return true;
}

function undo() {
  if (!app.editor.past.length) return status('Nothing to undo.');
  commit(Doc.undo(app.editor), 'Undone.');
}
function redo() {
  if (!app.editor.future.length) return status('Nothing to redo.');
  commit(Doc.redo(app.editor), 'Redone.');
}
function select(nodeRef) {
  app.editor = Doc.select(app.editor, nodeRef);
  renderCanvas();
  renderInspectorPanel();
  renderLayers();
}

// ---------------------------------------------------------------------------------------
// source projections
// ---------------------------------------------------------------------------------------

async function fetchJson(url) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(url + ' HTTP ' + response.status);
  return response.json();
}

function productLabel(subjectRef) {
  return app.catalog?.subjects.find((row) => row.subjectRef === subjectRef)?.label ?? String(subjectRef).replace(/^subject\./u, '');
}

function buildFamilies() {
  const rows = [];
  for (const [slug, inventory] of app.inventories) {
    const subject = Catalog.subjectFor(app.catalog, slug);
    for (const component of inventory.components) {
      const occurrences = Components.occurrencesForComponent(inventory, component.componentRef);
      if (!occurrences.length) continue;
      rows.push({ key: slug + '|' + component.componentRef, slug, subject, inventory, kind: component.kind, component, occurrences });
    }
  }
  rows.sort((a, b) => kindSpec(a.kind).label.localeCompare(kindSpec(b.kind).label) || a.subject.label.localeCompare(b.subject.label));
  app.families = rows;
}

function evidenceFor(inventory, occurrenceRef) {
  return Ui.sourceEvidenceFromOccurrence({ inventory, occurrenceRef, architectureCatalog: app.architecture });
}

// A source occurrence plus (optionally) its source children, as INSERT items.
function itemsForOccurrence(inventory, occurrence, withChildren) {
  const items = [{ source: evidenceFor(inventory, occurrence.occurrenceRef) }];
  if (!withChildren) return items;
  const byElement = new Map(inventory.occurrences.map((row) => [row.elementRef, row]));
  const visit = (row, parentIndex, depth) => {
    if (depth > 4 || items.length > 60) return;
    for (const childRef of row.childElementRefs) {
      const child = byElement.get(childRef);
      if (!child) continue;
      if (!canContainKind(kindSpec(row.kind).container ? row.kind : 'UNKNOWN', child.kind)) continue;
      items.push({ source: evidenceFor(inventory, child.occurrenceRef), parentIndex });
      visit(child, items.length - 1, depth + 1);
    }
  };
  visit(occurrence, 0, 0);
  return items;
}

function itemKind(item) {
  if (item.source) return item.source.kind;
  if (item.group) return 'GROUP';
  if (item.instance) {
    const definition = app.editor.blueprint.definitions.find((row) => row.definitionRef === item.instance.definitionRef);
    return definition ? Ui.effectiveKind({ kind: 'INSTANCE', instance: item.instance }, app.editor.blueprint.definitions) : 'GROUP';
  }
  return 'UNKNOWN';
}

// ---------------------------------------------------------------------------------------
// insertion target (keyboard / click insert)
// ---------------------------------------------------------------------------------------

function insertionTarget(kind) {
  const { draft, scope, selection } = app.editor;
  const nodes = Doc.scopeNodes(draft, scope);
  const selected = nodes.find((row) => row.nodeRef === selection);
  if (!selected) return { parentRef: null, slotRef: null, index: null };
  if (selected.kind === 'INSTANCE') {
    const definition = draft.definitions.find((row) => row.definitionRef === selected.instance.definitionRef);
    if (definition?.slots.length) return { parentRef: selected.nodeRef, slotRef: definition.slots[0].slotRef, index: null };
  } else if (canContainKind(selected.kind, kind)) {
    return { parentRef: selected.nodeRef, slotRef: null, index: null };
  }
  if (!selected.parentRef && scope) return { parentRef: selected.nodeRef, slotRef: null, index: null };
  return { parentRef: selected.parentRef ?? null, slotRef: selected.slotRef ?? null, index: selected.order + 1 };
}

function insertItems(items, target = null) {
  const kind = itemKind(items[0]);
  const where = target ?? insertionTarget(kind);
  if (apply({ type: 'INSERT', items, ...where })) {
    const spec = kindSpec(kind);
    const definition = items[0].instance ? app.editor.blueprint.definitions.find((row) => row.definitionRef === items[0].instance.definitionRef) : null;
    const overlayNote = spec.overlay && where.parentRef ? ' It sits on the overlay layer, above the screen.' : '';
    status((definition ? 'Placed ' + definition.label + ' (follows the component).' : 'Added ' + spec.label.toLowerCase() + (items.length > 1 ? ' with ' + (items.length - 1) + ' source children' : '') + '.') + overlayNote);
  }
}

// ---------------------------------------------------------------------------------------
// palette
// ---------------------------------------------------------------------------------------

function visibleFamilies() {
  const needle = app.ui.query.trim().toLowerCase();
  return app.families.filter((row) => {
    if (app.ui.product && row.slug !== app.ui.product) return false;
    if (!needle) return true;
    return [kindSpec(row.kind).label, row.kind, row.subject.label, ...row.component.styles, ...row.occurrences.flatMap((o) => [o.label, o.surfaceLabel, o.intent])]
      .filter(Boolean).join('\n').toLowerCase().includes(needle);
  });
}

function startPaletteDrag(event, items, label) {
  beginDrag(event, { items, label, kind: itemKind(items[0]) }, () => insertItems(items));
}

function exampleRow(family, occurrence) {
  const hasChildren = occurrence.childElementRefs.length > 0 && kindSpec(occurrence.kind).container;
  const add = (withChildren) => insertItems(itemsForOccurrence(family.inventory, occurrence, withChildren));
  return h('li', { class: 'example' },
    h('button', {
      type: 'button',
      class: 'example-main',
      title: [occurrence.surfaceLabel, occurrence.style, occurrence.intent].filter(Boolean).join(' · '),
      onpointerdown: (event) => startPaletteDrag(event, itemsForOccurrence(family.inventory, occurrence, false), occurrence.label),
      onkeydown: (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); add(false); } },
    }, h('span', { class: 'example-label' }, occurrence.label), h('span', { class: 'example-meta' }, occurrence.surfaceLabel + (occurrence.style ? ' · ' + occurrence.style : ''))),
    hasChildren ? h('button', {
      type: 'button',
      class: 'example-children',
      title: 'Add with its ' + occurrence.childElementRefs.length + ' source children',
      onpointerdown: (event) => startPaletteDrag(event, itemsForOccurrence(family.inventory, occurrence, true), occurrence.label),
      onkeydown: (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); add(true); } },
    }, '+' + occurrence.childElementRefs.length) : null);
}

function familyCard(family) {
  const first = family.occurrences[0];
  const expanded = app.ui.expanded.has(family.key);
  const shown = app.ui.examplesShown.get(family.key) ?? EXAMPLE_PAGE;
  const byElement = new Map(family.inventory.occurrences.map((row) => [row.elementRef, row]));
  const children = first.childElementRefs.map((ref) => byElement.get(ref)).filter(Boolean).map((row) => ({ kind: row.kind, label: row.label, styleOrNull: row.style }));
  const card = h('div', { class: 'family' + (expanded ? ' open' : '') },
    h('button', {
      type: 'button',
      class: 'family-main',
      'aria-label': 'Add ' + kindSpec(family.kind).label + ' from ' + family.subject.label,
      onpointerdown: (event) => startPaletteDrag(event, itemsForOccurrence(family.inventory, first, false), kindSpec(family.kind).label),
      onkeydown: (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); insertItems(itemsForOccurrence(family.inventory, first, false)); } },
    },
    h('span', { class: 'family-thumb' }, renderThumb({ kind: family.kind, label: first.label, styleOrNull: first.style, textRoleOrNull: first.textRole, iconOrNull: first.icon }, children)),
    h('span', { class: 'family-text' }, h('strong', {}, kindSpec(family.kind).label), h('span', { class: 'family-meta' }, family.subject.label + ' · ' + family.occurrences.length + ' example' + (family.occurrences.length === 1 ? '' : 's')))),
    h('button', {
      type: 'button', class: 'family-toggle', 'aria-expanded': expanded ? 'true' : 'false', title: expanded ? 'Hide examples' : 'Choose a source example',
      onclick: () => { if (expanded) app.ui.expanded.delete(family.key); else app.ui.expanded.add(family.key); renderPalette(); },
    }, expanded ? '▾' : '▸'));
  if (expanded) {
    const list = h('ul', { class: 'examples' }, family.occurrences.slice(0, shown).map((row) => exampleRow(family, row)));
    card.append(list);
    if (family.occurrences.length > shown) {
      card.append(h('button', { type: 'button', class: 'link-btn more', onclick: () => { app.ui.examplesShown.set(family.key, shown + EXAMPLE_PAGE); renderPalette(); } }, 'Show ' + Math.min(EXAMPLE_PAGE, family.occurrences.length - shown) + ' more of ' + family.occurrences.length));
    }
  }
  return card;
}

function definitionCard(definition) {
  const root = definition.nodes.find((row) => row.nodeRef === definition.rootNodeRef);
  const rootKind = Ui.effectiveKind(root, app.editor.blueprint.definitions);
  const items = [{ instance: { definitionRef: definition.definitionRef } }];
  const uses = [...app.editor.blueprint.nodes, ...app.editor.blueprint.definitions.flatMap((row) => row.nodes)].filter((row) => row.instance?.definitionRef === definition.definitionRef).length;
  return h('div', { class: 'family mine' },
    h('button', {
      type: 'button', class: 'family-main', 'aria-label': 'Place ' + definition.label,
      onpointerdown: (event) => startPaletteDrag(event, items, definition.label),
      onkeydown: (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); insertItems(items); } },
    },
    h('span', { class: 'family-thumb' }, renderThumb({ kind: rootKind, label: definition.label })),
    h('span', { class: 'family-text' }, h('strong', {}, '◇ ' + definition.label), h('span', { class: 'family-meta' }, 'v' + definition.version + ' · ' + uses + ' placed · ' + definition.ports.length + ' behavior' + (definition.ports.length === 1 ? '' : 's')))),
    h('button', { type: 'button', class: 'family-toggle', title: 'Edit component', onclick: () => editDefinition(definition.definitionRef) }, '✎'));
}

function layoutCard(group) {
  const items = [{ group }];
  return h('div', { class: 'family layout' },
    h('button', {
      type: 'button', class: 'family-main', 'aria-label': 'Add ' + group.label,
      onpointerdown: (event) => startPaletteDrag(event, items, group.label),
      onkeydown: (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); insertItems(items); } },
    },
    h('span', { class: 'family-thumb layout-thumb layout-' + group.container.mode.toLowerCase() + (group.container.axis === 'HORIZONTAL' ? ' horizontal' : '') }, h('i'), h('i'), h('i')),
    h('span', { class: 'family-text' }, h('strong', {}, group.label), h('span', { class: 'family-meta' }, 'Builder layout · no source'))));
}

function paletteSection(key, title, cards, count = cards.length) {
  const collapsed = app.ui.collapsed.has(key) && !app.ui.query;
  return h('section', { class: 'palette-section' },
    h('button', { type: 'button', class: 'palette-heading', 'aria-expanded': collapsed ? 'false' : 'true', onclick: () => { if (collapsed) app.ui.collapsed.delete(key); else app.ui.collapsed.add(key); renderPalette(); } },
      h('span', {}, (collapsed ? '▸ ' : '▾ ') + title), h('span', { class: 'count' }, String(count))),
    collapsed ? null : h('div', { class: 'palette-cards' }, cards));
}

function renderPalette() {
  const families = visibleFamilies();
  const needle = app.ui.query.trim().toLowerCase();
  const definitions = app.editor.blueprint.definitions.filter((row) => !needle || row.label.toLowerCase().includes(needle));
  const sections = [];
  if (definitions.length || !needle) {
    sections.push(paletteSection('MINE', 'My components', definitions.length ? definitions.map(definitionCard)
      : [h('p', { class: 'palette-empty' }, 'Select something on the canvas and choose “Make component” to reuse it here.')], definitions.length));
  }
  const layouts = UI_LAYOUT_GROUPS.filter((row) => !needle || row.label.toLowerCase().includes(needle) || 'layout'.includes(needle));
  if (layouts.length) sections.push(paletteSection('LAYOUT', 'Layout', layouts.map(layoutCard)));
  for (const category of UI_KIND_CATEGORIES) {
    const rows = families.filter((row) => kindSpec(row.kind).category === category);
    if (rows.length) sections.push(paletteSection(category, UI_CATEGORY_LABELS[category], rows.map(familyCard)));
  }
  if (!families.length && needle) sections.push(h('p', { class: 'palette-empty' }, 'Nothing matches “' + app.ui.query + '”. Try a kind (button), a screen, or a style.'));
  $('palette').replaceChildren(...sections);
  $('palette-count').textContent = String(families.reduce((sum, row) => sum + row.occurrences.length, 0)) + ' source examples';
}

// ---------------------------------------------------------------------------------------
// layers
// ---------------------------------------------------------------------------------------

function nodeLabel(node) {
  const kind = Doc.nodeKind(app.editor.draft, node);
  if (node.instance) return app.editor.draft.definitions.find((row) => row.definitionRef === node.instance.definitionRef)?.label ?? 'Component';
  return node.content?.text?.value ?? node.source?.label ?? kindSpec(kind).label;
}

function layerRows() {
  const { draft, scope } = app.editor;
  const nodes = Doc.scopeNodes(draft, scope);
  const rows = [];
  const visit = (node, depth) => {
    rows.push({ node, depth });
    const kids = nodes.filter((row) => row.parentRef === node.nodeRef).sort((a, b) => (a.slotRef ?? '').localeCompare(b.slotRef ?? '') || a.order - b.order);
    kids.forEach((child) => visit(child, depth + 1));
  };
  const roots = nodes.filter((row) => !row.parentRef);
  const content = roots.filter((row) => !kindSpec(Doc.nodeKind(draft, row)).overlay).sort((a, b) => a.order - b.order);
  const overlays = roots.filter((row) => kindSpec(Doc.nodeKind(draft, row)).overlay).sort((a, b) => a.order - b.order);
  content.forEach((row) => visit(row, 0));
  const overlayStart = rows.length;
  overlays.forEach((row) => visit(row, 0));
  return { rows, overlayStart };
}

function renderLayers() {
  const { rows, overlayStart } = layerRows();
  const items = [];
  rows.forEach(({ node, depth }, index) => {
    if (index === overlayStart) items.push(h('li', { class: 'layer-heading' }, 'Overlays'));
    const kind = Doc.nodeKind(app.editor.draft, node);
    const spec = kindSpec(kind);
    const selected = node.nodeRef === app.editor.selection;
    const overlay = !node.parentRef && spec.overlay;
    items.push(h('li', {
      class: 'layer' + (selected ? ' selected' : '') + (node.instance ? ' instance' : ''),
      style: '--depth:' + depth,
      role: 'treeitem',
      'aria-selected': selected ? 'true' : 'false',
      'aria-level': String(depth + 1),
      tabindex: selected ? '0' : '-1',
      'data-layer': node.nodeRef,
      onpointerdown: (event) => {
        if (event.target.closest('.layer-eye')) return;
        beginDrag(event, { moveRef: node.nodeRef, label: nodeLabel(node), kind }, () => select(node.nodeRef));
      },
    },
    h('span', { class: 'layer-kind', 'aria-hidden': 'true' }, node.instance ? '◇' : spec.container ? '▦' : '▪'),
    h('span', { class: 'layer-name' }, nodeLabel(node)),
    node.slotRef ? h('span', { class: 'layer-slot' }, node.slotRef) : null,
    h('span', { class: 'layer-type' }, spec.label),
    overlay ? h('button', {
      type: 'button', class: 'layer-eye', title: app.preview.openOverlays.has(node.nodeRef) ? 'Close in preview' : 'Open in preview',
      'aria-pressed': app.preview.openOverlays.has(node.nodeRef) ? 'true' : 'false',
      onclick: () => { togglePreviewOverlay(node.nodeRef); },
    }, app.preview.openOverlays.has(node.nodeRef) ? '◉' : '○') : null));
  });
  if (!rows.length) items.push(h('li', { class: 'palette-empty' }, 'Layers appear here as you build. Screen readers follow this order.'));
  $('layers').replaceChildren(h('ul', { class: 'layer-tree', role: 'tree', 'aria-label': 'Layers' }, items));
}

function togglePreviewOverlay(path) {
  if (app.preview.openOverlays.has(path)) app.preview.openOverlays.delete(path);
  else app.preview.openOverlays.add(path);
  renderCanvas();
  renderLayers();
}

// ---------------------------------------------------------------------------------------
// canvas + inspector rendering
// ---------------------------------------------------------------------------------------

function resolvedForScope() {
  const { blueprint, scope } = app.editor;
  if (!scope) return Ui.expandBlueprint(blueprint);
  const definition = blueprint.definitions.find((row) => row.definitionRef === scope);
  return Ui.expandBlueprint({ nodes: definition.nodes, definitions: blueprint.definitions });
}

function profile() {
  return Ui.UI_PREVIEW_PROFILES[app.editor.blueprint.preview.profile];
}

function zoomFor() {
  if (app.ui.zoomMode === 'ACTUAL') return 1;
  const available = Math.max(320, $('stage').clientWidth - 48);
  return Math.min(1, available / profile().width);
}

function renderCanvas() {
  const { blueprint, scope, selection } = app.editor;
  const resolved = resolvedForScope();
  const definition = scope ? blueprint.definitions.find((row) => row.definitionRef === scope) : null;
  const zoom = zoomFor();
  const viewport = renderViewport({
    resolved,
    surface: blueprint.surface,
    profile: profile(),
    direction: blueprint.preview.direction,
    zoom,
    selection,
    preview: app.preview,
    scope: definition ? { rootPath: definition.rootNodeRef } : null,
    callbacks: {
      onSelect: (path) => select(path),
      onTry: tryNode,
      onDismissOverlays: () => {
        app.preview.openOverlays.clear();
        select(null);
        status('Overlay preview closed. Open it again from Layers (○) or by selecting it.');
      },
      definitionLabel: (ref) => blueprint.definitions.find((row) => row.definitionRef === ref)?.label,
    },
  });
  if (app.preview.tryMode) viewport.classList.add('try');
  const frame = h('div', { class: 'viewport-frame', style: 'width:' + Math.round(profile().width * zoom) + 'px;height:' + Math.round(profile().height * zoom) + 'px' }, viewport);
  const banner = definition ? h('div', { class: 'scope-banner' },
    h('span', {}, '◇ Editing component ', h('strong', {}, definition.label), ' · v' + definition.version + ' — changes apply to every placed instance.'),
    h('button', { type: 'button', class: 'btn primary', onclick: finishDefinition }, 'Done')) : null;
  const tryBanner = app.preview.tryMode ? h('div', { class: 'try-banner' }, 'Trying it: taps run Builder-local links only. App actions are shown, not run.', h('button', { type: 'button', class: 'btn', onclick: () => setTryMode(false) }, 'Stop')) : null;
  $('stage').replaceChildren(...[banner, tryBanner, frame].filter(Boolean));
  $('profile-size').textContent = profile().width + ' × ' + profile().height + ' dp · ' + Math.round(zoom * 100) + '%';
  viewport.addEventListener('pointerdown', onCanvasPointerDown);
}

function currentnessFor(nodeRef) {
  if (!app.review) app.review = Review.reviewBlueprint(app.editor.blueprint, { inventoriesBySubject: app.bySubject });
  return app.review.currentness.find((row) => row.nodeRef === nodeRef && row.scope === app.editor.scope) ?? null;
}

const inspectorActions = {
  productLabel,
  editDefinition: (ref) => editDefinition(ref),
  addSeam: (node, kind) => {
    const words = (node.content?.text?.value ?? node.source?.label ?? 'action').toLowerCase().replace(/[^a-z0-9]+/gu, '-').replace(/^-+|-+$/gu, '').slice(0, 32).replace(/-+$/u, '');
    const seam = kind === 'PRESENTATION'
      ? { kind, key: 'open.overlay', verbOrNull: 'OPEN', targetNodeRefOrNull: null }
      : kind === 'NAVIGATION'
        ? { kind, key: 'navigate.destination', destinationOrNull: null }
        : { kind, key: 'action.' + (/^[a-z]/u.test(words) ? words : 'do') };
    apply({ type: 'ADD_SEAM', nodeRef: node.nodeRef, seam });
  },
  isConditionHidden: (path) => app.preview.hiddenConditions.has(path),
  setConditionHidden: (path, hidden) => { if (hidden) app.preview.hiddenConditions.add(path); else app.preview.hiddenConditions.delete(path); renderCanvas(); },
  createDefinition: (node) => {
    const name = window.prompt('Name this component', nodeLabel(node).slice(0, 40));
    if (name === null) return;
    if (apply({ type: 'CREATE_DEFINITION', nodeRef: node.nodeRef, label: name })) status('“' + (name.trim() || 'Component') + '” is now reusable. Find it under My components.');
  },
  remove: (node) => {
    const count = Doc.scopeNodes(app.editor.draft, app.editor.scope).filter((row) => isDescendant(row, node.nodeRef)).length;
    if (apply({ type: 'DELETE', nodeRef: node.nodeRef })) status('Deleted ' + nodeLabel(node) + (count ? ' and ' + count + ' inside it' : '') + '. Undo with Ctrl/⌘ Z.');
  },
  rebind: (node) => {
    const inventory = app.bySubject.get(node.source.subjectRef);
    if (!inventory) return;
    apply({ type: 'REBIND_SOURCE', nodeRef: node.nodeRef, source: evidenceFor(inventory, node.source.occurrenceRef) });
  },
  libraryLink: (node) => {
    const slug = [...app.inventories.entries()].find(([, inv]) => inv.subjectRef === node.source.subjectRef)?.[0];
    return slug ? h('a', { class: 'btn', href: './components.html?product=' + encodeURIComponent(slug) + '&occurrence=' + encodeURIComponent(node.source.occurrenceRef) }, 'Open in Library') : null;
  },
};

function isDescendant(row, ancestorRef) {
  const nodes = Doc.scopeNodes(app.editor.draft, app.editor.scope);
  let cursor = row.parentRef;
  while (cursor) {
    if (cursor === ancestorRef) return true;
    cursor = nodes.find((item) => item.nodeRef === cursor)?.parentRef ?? null;
  }
  return false;
}

function renderInspectorPanel() {
  const content = renderInspector({
    state: app.editor,
    apply,
    actions: inspectorActions,
    currentnessFor,
    definitionFor: (ref) => app.editor.blueprint.definitions.find((row) => row.definitionRef === ref),
  });
  $('inspector').replaceChildren(...content.filter(Boolean));
}

function renderToolbar() {
  const { blueprint, past, future } = app.editor;
  $('design-name').value = blueprint.label;
  $('undo').disabled = !past.length;
  $('redo').disabled = !future.length;
  $('profile').value = blueprint.preview.profile;
  $('rtl').setAttribute('aria-pressed', blueprint.preview.direction === 'RTL' ? 'true' : 'false');
  $('stress').setAttribute('aria-pressed', app.preview.stressText ? 'true' : 'false');
  $('try').setAttribute('aria-pressed', app.preview.tryMode ? 'true' : 'false');
  $('zoom').textContent = app.ui.zoomMode === 'FIT' ? 'Fit' : '100%';
  const summary = blueprint.derived.summary;
  const review = app.review ?? (app.review = Review.reviewBlueprint(blueprint, { inventoriesBySubject: app.bySubject }));
  $('review-count').textContent = review.counts.attention ? String(review.counts.attention) : '';
  $('review-count').hidden = !review.counts.attention;
  $('summary').textContent = summary.resolvedNodeCount + ' elements · ' + review.counts.toBind + ' to bind' + (summary.definitionCount ? ' · ' + summary.definitionCount + ' components' : '');
}

function renderTabs() {
  for (const tab of ['ADD', 'LAYERS']) {
    $('tab-' + tab.toLowerCase()).setAttribute('aria-selected', app.ui.tab === tab ? 'true' : 'false');
    $('panel-' + tab.toLowerCase()).hidden = app.ui.tab !== tab;
  }
}

function render() {
  renderToolbar();
  renderTabs();
  renderPalette();
  renderLayers();
  renderCanvas();
  renderInspectorPanel();
  if (app.ui.reviewOpen) renderReview();
}

// ---------------------------------------------------------------------------------------
// component editing
// ---------------------------------------------------------------------------------------

function editDefinition(definitionRef) {
  const result = Doc.enterDefinition(app.editor, definitionRef);
  if (!result.ok) return status(result.message, 'error');
  app.editor = result.state;
  render();
  status('Editing the component. Press Done to apply to every instance.');
}

function finishDefinition() {
  const result = Doc.exitDefinition(app.editor);
  commit(result.state, result.message ?? 'Back to the design.');
}

// ---------------------------------------------------------------------------------------
// try-it preview (local only)
// ---------------------------------------------------------------------------------------

function overlayName(path) {
  const node = Doc.scopeNodes(app.editor.draft, app.editor.scope).find((row) => row.nodeRef === selectablePath(path));
  return node ? nodeLabel(node) : path;
}

function setTryMode(on) {
  app.preview.tryMode = on;
  if (on) app.editor = Doc.select(app.editor, null);
  render();
  status(on ? 'Try it: tap controls to see what they do. Nothing runs in an app.' : 'Back to editing.');
}

function tryNode(node) {
  const messages = [];
  if (node.kind === 'TOGGLE') {
    if (app.preview.toggled.has(node.path)) app.preview.toggled.delete(node.path);
    else app.preview.toggled.add(node.path);
  }
  for (const seam of node.seams) {
    if (seam.kind === 'PRESENTATION' && seam.targetPathOrNull) {
      const open = app.preview.openOverlays.has(seam.targetPathOrNull);
      const next = seam.verbOrNull === 'OPEN' ? true : seam.verbOrNull === 'CLOSE' ? false : !open;
      if (next) app.preview.openOverlays.add(seam.targetPathOrNull);
      else app.preview.openOverlays.delete(seam.targetPathOrNull);
      messages.push((next ? 'Opened ' : 'Closed ') + overlayName(seam.targetPathOrNull));
    } else if (seam.kind === 'ACTION') {
      messages.push('Would ask the app to run “' + seam.key + '”');
    } else if (seam.kind === 'NAVIGATION') {
      messages.push('Would navigate: ' + seam.key + (seam.destinationOrNull ? ' → ' + seam.destinationOrNull : ''));
    } else {
      messages.push('The app would ' + String(seam.verbOrNull).toLowerCase() + ' ' + (seam.targetHintOrNull ?? 'something'));
    }
  }
  renderCanvas();
  renderLayers();
  status(messages.join(' · ') || 'Toggled locally.');
}

// ---------------------------------------------------------------------------------------
// drag and drop (pointer based: mouse, pen and touch)
// ---------------------------------------------------------------------------------------

let drag = null;

function beginDrag(event, payload, onClick) {
  if (event.button !== undefined && event.button !== 0) return;
  const start = { x: event.clientX, y: event.clientY };
  drag = { payload, start, active: false, onClick, ghost: null, target: null, pointerId: event.pointerId };
  document.addEventListener('pointermove', onDragMove);
  document.addEventListener('pointerup', onDragEnd, { once: true });
  document.addEventListener('pointercancel', cancelDrag, { once: true });
}

function onDragMove(event) {
  if (!drag) return;
  if (!drag.active) {
    if (Math.hypot(event.clientX - drag.start.x, event.clientY - drag.start.y) < 5) return;
    drag.active = true;
    drag.ghost = h('div', { class: 'drag-ghost' }, drag.payload.label);
    document.body.append(drag.ghost);
    document.body.classList.add('dragging');
  }
  event.preventDefault();
  drag.ghost.style.transform = 'translate(' + (event.clientX + 12) + 'px,' + (event.clientY + 10) + 'px)';
  drag.target = dropTargetAt(event.clientX, event.clientY, drag.payload);
  showIndicator(drag.target);
}

function cleanupDrag() {
  document.removeEventListener('pointermove', onDragMove);
  drag?.ghost?.remove();
  document.body.classList.remove('dragging');
  showIndicator(null);
}

function cancelDrag() {
  cleanupDrag();
  drag = null;
}

function onDragEnd() {
  const current = drag;
  cleanupDrag();
  drag = null;
  if (!current) return;
  if (!current.active) {
    current.onClick?.();
    return;
  }
  const target = current.target;
  if (!target) return status('Drop onto the preview or the layers list.');
  if (!target.valid) return status(target.reason, 'error');
  if (current.payload.items) {
    insertItems(current.payload.items, { parentRef: target.parentRef, slotRef: target.slotRef, index: target.index, placement: target.placement ?? null });
  } else if (current.payload.moveRef) {
    apply({ type: 'MOVE', nodeRef: current.payload.moveRef, parentRef: target.parentRef, slotRef: target.slotRef, index: target.index, placement: target.placement ?? null });
  }
}

function parentKindFor(path) {
  if (!path) return app.editor.scope ? null : 'GROUP';
  const node = Doc.scopeNodes(app.editor.draft, app.editor.scope).find((row) => row.nodeRef === path);
  return node ? Doc.nodeKind(app.editor.draft, node) : null;
}

function insideMoved(path, moveRef) {
  if (!moveRef || !path) return false;
  if (path === moveRef) return true;
  const node = Doc.scopeNodes(app.editor.draft, app.editor.scope).find((row) => row.nodeRef === path);
  return node ? isDescendant(node, moveRef) : false;
}

function dropTargetAt(x, y, payload) {
  const hit = document.elementFromPoint(x, y);
  if (!hit) return null;
  const layer = hit.closest('[data-layer]');
  if (layer) return layerDropTarget(layer, y, x, payload);
  let host = hit.closest('[data-drop-host]');
  while (host && insideMoved(host.dataset.dropHost, payload.moveRef)) host = host.parentElement?.closest('[data-drop-host]') ?? null;
  if (!host || !host.closest('.viewport')) return null;
  const parentRef = host.dataset.dropHost || null;
  const slotRef = host.dataset.slot ?? null;
  const kind = payload.kind;
  const overlay = Boolean(kindSpec(kind).overlay);
  const base = { host, parentRef: overlay ? null : parentRef, slotRef: overlay ? null : slotRef, valid: true, reason: '' };
  if (!overlay && parentRef && !slotRef && !canContainKind(parentKindFor(parentRef), kind)) {
    return { ...base, valid: false, reason: kindSpec(parentKindFor(parentRef)).label + ' cannot hold a ' + kindSpec(kind).label.toLowerCase() + '.' };
  }
  if (overlay) return { ...base, index: null, mode: 'OVERLAY_LAYER' };
  const mode = host.dataset.mode ?? 'STACK';
  const rect = host.getBoundingClientRect();
  const rtl = getComputedStyle(host).direction === 'rtl';
  if (mode === 'FREEFORM') {
    const relX = rtl ? (rect.right - x) / rect.width : (x - rect.left) / rect.width;
    const relY = (y - rect.top) / rect.height;
    const start = Math.max(0, Math.min(D - 2, Math.round(relX * D)));
    const top = Math.max(0, Math.min(D - 1, Math.round(relY * D)));
    const fill = kindSpec(kind).defaultWidth === 'FILL' || kindSpec(kind).container;
    return { ...base, index: null, mode, placement: { type: 'FRACTION', x: { start, end: fill ? Math.min(D, start + 12) : null }, y: { start: top, end: null } }, rect };
  }
  if (mode === 'OVERLAY') {
    const col = Math.min(2, Math.floor((rtl ? rect.right - x : x - rect.left) / rect.width * 3));
    const row = Math.min(2, Math.floor((y - rect.top) / rect.height * 3));
    const anchor = Ui.UI_ANCHORS[Math.max(0, row) * 3 + Math.max(0, col)];
    return { ...base, index: null, mode, placement: { type: 'ANCHOR', anchor, inset: 'S' }, rect };
  }
  const horizontal = host.style.flexDirection === 'row';
  const children = [...host.children].filter((el) => el.matches('.node.own') && el.dataset.select !== payload.moveRef);
  let index = children.length;
  for (let i = 0; i < children.length; i += 1) {
    const r = children[i].getBoundingClientRect();
    const before = horizontal ? (rtl ? x > r.left + r.width / 2 : x < r.left + r.width / 2) : y < r.top + r.height / 2;
    if (before) { index = i; break; }
  }
  return { ...base, index, mode: 'STACK', horizontal, children, rect };
}

function layerDropTarget(row, y, x, payload) {
  const ref = row.dataset.layer;
  if (insideMoved(ref, payload.moveRef)) return null;
  const nodes = Doc.scopeNodes(app.editor.draft, app.editor.scope);
  const node = nodes.find((item) => item.nodeRef === ref);
  if (!node) return null;
  const rect = row.getBoundingClientRect();
  const kind = Doc.nodeKind(app.editor.draft, node);
  const intoContainer = !node.instance && canContainKind(kind, payload.kind) && x > rect.left + rect.width * 0.55;
  if (intoContainer) return { layer: row, parentRef: node.nodeRef, slotRef: null, index: null, valid: true, into: true };
  const before = y < rect.top + rect.height / 2;
  const parentRef = node.parentRef ?? null;
  if (!parentRef && app.editor.scope) return { layer: row, valid: false, reason: 'A component keeps one root.' };
  const parentKind = parentKindFor(parentRef);
  const valid = Boolean(kindSpec(payload.kind).overlay) || !parentRef || node.slotRef || canContainKind(parentKind, payload.kind);
  return {
    layer: row, parentRef, slotRef: node.slotRef ?? null,
    index: node.order + (before ? 0 : 1) - (payload.moveRef && nodes.find((item) => item.nodeRef === payload.moveRef)?.parentRef === parentRef && nodes.find((item) => item.nodeRef === payload.moveRef).order < node.order ? 1 : 0),
    valid, reason: valid ? '' : kindSpec(parentKind).label + ' cannot hold a ' + kindSpec(payload.kind).label.toLowerCase() + '.', before,
  };
}

let indicator = null;
let activeHost = null;
function showIndicator(target) {
  activeHost?.classList.remove('drop-host-active', 'drop-host-invalid');
  activeHost = null;
  indicator?.remove();
  indicator = null;
  if (!target) return;
  if (target.layer) {
    activeHost = target.layer;
    activeHost.classList.add(target.valid ? 'drop-host-active' : 'drop-host-invalid');
    const r = target.layer.getBoundingClientRect();
    if (!target.into && target.valid) {
      indicator = h('div', { class: 'drop-line', style: 'position:fixed;left:' + r.left + 'px;width:' + r.width + 'px;height:3px;top:' + ((target.before ? r.top : r.bottom) - 1) + 'px' });
      document.body.append(indicator);
    }
    return;
  }
  activeHost = target.host;
  activeHost?.classList.add(target.valid ? 'drop-host-active' : 'drop-host-invalid');
  if (!target.valid || !target.rect) return;
  if (target.mode === 'STACK') {
    const r = target.rect;
    const kids = target.children;
    let pos;
    if (target.horizontal) {
      const ref = kids[target.index] ?? kids[kids.length - 1];
      const rr = ref?.getBoundingClientRect();
      const left = !rr ? r.left + 4 : kids[target.index] ? rr.left - 3 : rr.right + 1;
      pos = 'left:' + left + 'px;top:' + r.top + 'px;width:3px;height:' + r.height + 'px';
    } else {
      const ref = kids[target.index] ?? kids[kids.length - 1];
      const rr = ref?.getBoundingClientRect();
      const top = !rr ? r.top + 4 : kids[target.index] ? rr.top - 3 : rr.bottom + 1;
      pos = 'left:' + r.left + 'px;top:' + top + 'px;width:' + r.width + 'px;height:3px';
    }
    indicator = h('div', { class: 'drop-line', style: 'position:fixed;' + pos });
  } else if (target.mode === 'FREEFORM') {
    const r = target.rect;
    const { x, y } = target.placement;
    const width = ((x.end ?? x.start + 8) - x.start) / D * r.width;
    indicator = h('div', { class: 'drop-box', style: 'position:fixed;left:' + (r.left + x.start / D * r.width) + 'px;top:' + (r.top + y.start / D * r.height) + 'px;width:' + width + 'px;height:' + (2 / D * r.height) + 'px' });
  } else if (target.mode === 'OVERLAY') {
    const r = target.rect;
    const i = Ui.UI_ANCHORS.indexOf(target.placement.anchor);
    indicator = h('div', { class: 'drop-box', style: 'position:fixed;left:' + (r.left + (i % 3) * r.width / 3) + 'px;top:' + (r.top + Math.floor(i / 3) * r.height / 3) + 'px;width:' + (r.width / 3) + 'px;height:' + (r.height / 3) + 'px' });
  }
  if (indicator) document.body.append(indicator);
}

// ---------------------------------------------------------------------------------------
// canvas pointer: structural drag via chip, spatial move / resize in free-form areas
// ---------------------------------------------------------------------------------------

let spatial = null;

function onCanvasPointerDown(event) {
  if (app.preview.tryMode || event.button !== 0) return;
  const grip = event.target.closest('[data-grip]');
  if (grip) {
    event.preventDefault();
    event.stopPropagation();
    const ref = grip.dataset.grip;
    const node = Doc.scopeNodes(app.editor.draft, app.editor.scope).find((row) => row.nodeRef === ref);
    if (node) beginDrag(event, { moveRef: ref, label: nodeLabel(node), kind: Doc.nodeKind(app.editor.draft, node) }, null);
    return;
  }
  const handle = event.target.closest('[data-handle]');
  const element = event.target.closest('.node.own');
  if (!element) return;
  const ref = element.dataset.select;
  const node = Doc.scopeNodes(app.editor.draft, app.editor.scope).find((row) => row.nodeRef === ref);
  if (!node || node.layout.placement?.type !== 'FRACTION' || ref !== app.editor.selection) return;
  event.preventDefault();
  event.stopPropagation();
  const host = element.parentElement.closest('[data-mode]');
  const rect = host.getBoundingClientRect();
  const own = element.getBoundingClientRect();
  const rtl = getComputedStyle(host).direction === 'rtl';
  const placement = structuredClone(node.layout.placement);
  // materialize hug ends so resizing works from the visible size
  const measuredEndX = Math.min(D, Math.max(placement.x.start + 1, Math.round(((rtl ? rect.right - own.left : own.right - rect.left) / rect.width) * D)));
  const measuredEndY = Math.min(D, Math.max(placement.y.start + 1, Math.round(((own.bottom - rect.top) / rect.height) * D)));
  spatial = { ref, element, rect, rtl, start: placement, measured: { x: measuredEndX, y: measuredEndY }, origin: { x: event.clientX, y: event.clientY }, handle: handle?.dataset.handle ?? null, moved: false, next: placement };
  element.setPointerCapture?.(event.pointerId);
  document.addEventListener('pointermove', onSpatialMove);
  document.addEventListener('pointerup', onSpatialEnd, { once: true });
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function onSpatialMove(event) {
  if (!spatial) return;
  const { rect, rtl, start, handle, measured } = spatial;
  const dx = Math.round(((event.clientX - spatial.origin.x) * (rtl ? -1 : 1)) / rect.width * D);
  const dy = Math.round((event.clientY - spatial.origin.y) / rect.height * D);
  if (!dx && !dy && !spatial.moved) return;
  spatial.moved = true;
  const x = { ...start.x };
  const y = { ...start.y };
  if (!handle) {
    const spanX = (x.end ?? measured.x) - x.start;
    const spanY = (y.end ?? measured.y) - y.start;
    x.start = clamp(start.x.start + dx, 0, D - Math.max(1, x.end === null ? 1 : spanX));
    if (x.end !== null) x.end = x.start + spanX;
    y.start = clamp(start.y.start + dy, 0, D - Math.max(1, y.end === null ? 1 : spanY));
    if (y.end !== null) y.end = y.start + spanY;
  } else {
    if (handle.includes('e')) x.end = clamp((start.x.end ?? measured.x) + dx, x.start + 1, D);
    if (handle.includes('w')) { x.end = x.end ?? measured.x; x.start = clamp(start.x.start + dx, 0, x.end - 1); }
    if (handle.includes('s')) y.end = clamp((start.y.end ?? measured.y) + dy, y.start + 1, D);
    if (handle.includes('n')) { y.end = y.end ?? measured.y; y.start = clamp(start.y.start + dy, 0, y.end - 1); }
  }
  spatial.next = { type: 'FRACTION', x, y };
  const style = spatial.element.style;
  style.insetInlineStart = (x.start / D * 100) + '%';
  style.top = (y.start / D * 100) + '%';
  if (x.end !== null) style.width = ((x.end - x.start) / D * 100) + '%';
  if (y.end !== null) style.height = ((y.end - y.start) / D * 100) + '%';
  status('x ' + x.start + (x.end === null ? '' : '–' + x.end) + ' · y ' + y.start + (y.end === null ? '' : '–' + y.end) + ' (of ' + D + ')');
}

function onSpatialEnd() {
  document.removeEventListener('pointermove', onSpatialMove);
  const current = spatial;
  spatial = null;
  if (!current?.moved) return;
  apply({ type: 'PLACE', nodeRef: current.ref, placement: current.next });
}

// ---------------------------------------------------------------------------------------
// keyboard
// ---------------------------------------------------------------------------------------

function onKeyDown(event) {
  const typing = event.target.closest('input, textarea, select, [contenteditable]');
  const mod = event.metaKey || event.ctrlKey;
  if (mod && event.key.toLowerCase() === 'z') {
    if (typing) return;
    event.preventDefault();
    if (event.shiftKey) redo(); else undo();
    return;
  }
  if (mod && event.key.toLowerCase() === 'y') { if (!typing) { event.preventDefault(); redo(); } return; }
  if (mod && event.key.toLowerCase() === 's') { event.preventDefault(); saveBlueprint(); return; }
  if (typing || app.ui.reviewOpen || event.target.closest('#palette')) return;
  const { selection, draft, scope } = app.editor;
  const nodes = Doc.scopeNodes(draft, scope);
  const node = nodes.find((row) => row.nodeRef === selection);
  if (event.key === 'Escape') {
    if (app.preview.tryMode) return setTryMode(false);
    if (scope && !node) return finishDefinition();
    if (node) return select(node.parentRef ?? null);
    return;
  }
  if (!node) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      const { rows } = layerRows();
      if (rows.length) { event.preventDefault(); select(rows[0].node.nodeRef); }
    }
    return;
  }
  if (mod && event.key.toLowerCase() === 'd') { event.preventDefault(); apply({ type: 'DUPLICATE', nodeRef: node.nodeRef }); return; }
  if (event.key === 'Delete' || event.key === 'Backspace') { event.preventDefault(); inspectorActions.remove(node); return; }
  const fraction = node.layout.placement?.type === 'FRACTION';
  if (event.shiftKey && fraction && event.key.startsWith('Arrow')) {
    event.preventDefault();
    const rtl = app.editor.blueprint.preview.direction === 'RTL';
    const delta = { ArrowLeft: [rtl ? 1 : -1, 0], ArrowRight: [rtl ? -1 : 1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[event.key];
    const p = structuredClone(node.layout.placement);
    const shift = (axis, d) => {
      const span = axis.end === null ? null : axis.end - axis.start;
      axis.start = clamp(axis.start + d, 0, D - (span ?? 1));
      if (span !== null) axis.end = axis.start + span;
    };
    shift(p.x, delta[0]);
    shift(p.y, delta[1]);
    apply({ type: 'PLACE', nodeRef: node.nodeRef, placement: p });
    return;
  }
  if (event.altKey && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
    event.preventDefault();
    apply({ type: 'MOVE', nodeRef: node.nodeRef, parentRef: node.parentRef ?? null, slotRef: node.slotRef ?? null, index: Math.max(0, node.order + (event.key === 'ArrowUp' ? -1 : 1)) });
    return;
  }
  const { rows } = layerRows();
  const index = rows.findIndex((row) => row.node.nodeRef === node.nodeRef);
  if (event.key === 'ArrowDown' && index < rows.length - 1) { event.preventDefault(); select(rows[index + 1].node.nodeRef); }
  if (event.key === 'ArrowUp' && index > 0) { event.preventDefault(); select(rows[index - 1].node.nodeRef); }
  if (event.key === 'ArrowLeft' && node.parentRef) { event.preventDefault(); select(node.parentRef); }
  if (event.key === 'ArrowRight') {
    const child = nodes.filter((row) => row.parentRef === node.nodeRef).sort((a, b) => a.order - b.order)[0];
    if (child) { event.preventDefault(); select(child.nodeRef); }
  }
}

// ---------------------------------------------------------------------------------------
// review + handoff
// ---------------------------------------------------------------------------------------

function download(name, bytes, type) {
  const blob = new Blob([bytes], { type });
  const url = URL.createObjectURL(blob);
  const link = h('a', { href: url, download: name });
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function fileSlug() {
  return app.editor.blueprint.blueprintRef.replace(/^ui\.blueprint\./u, '') || 'design';
}

function saveBlueprint() {
  if (app.editor.scope) finishDefinition();
  const bytes = Ui.uiBlueprintBytes(app.editor.blueprint);
  download(fileSlug() + '.ui-blueprint.json', bytes, 'application/json');
  const summary = app.editor.blueprint.derived.summary;
  status('Saved ' + fileSlug() + '.ui-blueprint.json · ' + summary.resolvedNodeCount + ' elements, ' + (summary.openActionCount + summary.openNavigationCount) + ' open seams.');
}

function briefText() {
  const review = app.review ?? Review.reviewBlueprint(app.editor.blueprint, { inventoriesBySubject: app.bySubject });
  return Review.constructionBrief(app.editor.blueprint, review);
}

function renderReview() {
  const blueprint = app.editor.blueprint;
  const review = app.review ?? (app.review = Review.reviewBlueprint(blueprint, { inventoriesBySubject: app.bySubject }));
  const integration = blueprint.derived.integration;
  const use = (row) => row.uses.map((item) => item.path).join(', ');
  const bindRows = [
    ...integration.actions.map((row) => h('li', {}, h('span', { class: 'seam-kind seam-action' }, 'Action'), h('code', {}, row.key), h('span', { class: 'muted' }, ' ← ' + use(row)), row.sourceActionKeys.length ? h('span', { class: 'chip good' }, 'source key') : null)),
    ...integration.navigation.map((row) => h('li', {}, h('span', { class: 'seam-kind seam-navigation' }, 'Navigation'), h('code', {}, row.key), h('span', { class: 'muted' }, (row.destinations.length ? ' → ' + row.destinations.join(', ') : '') + ' ← ' + use(row)))),
    ...integration.conditions.map((row) => h('li', {}, h('span', { class: 'seam-kind seam-condition' }, 'Condition'), h('code', {}, row.key), h('span', { class: 'muted' }, ' controls ' + row.paths.join(', ')))),
    ...integration.presentation.filter((row) => row.binding === 'OPEN').map((row) => h('li', {}, h('span', { class: 'seam-kind seam-presentation' }, 'Local UI'), h('code', {}, row.key), h('span', { class: 'muted' }, ' ← ' + row.path))),
  ];
  const local = integration.presentation.filter((row) => row.binding === 'BUILDER_LOCAL');
  const findings = review.findings.map((row) => h('li', { class: 'finding ' + row.severity.toLowerCase() },
    h('span', { class: 'finding-tag' }, humanize(row.severity) + ' · ' + humanize(row.category)),
    h('span', {}, row.message),
    row.path && !row.path.includes(':') ? h('button', { type: 'button', class: 'link-btn', onclick: () => { closeReview(); select(selectablePath(row.path)); } }, 'Show') : null));
  const notes = app.ui.migrationNotes.length ? h('section', {}, h('h3', {}, 'Opened from an older blueprint'), h('ul', { class: 'notes' }, app.ui.migrationNotes.map((note) => h('li', {}, note)))) : null;
  const moved = review.currentness.filter((row) => row.state === 'MOVED' && row.scope === null);
  $('review-body').replaceChildren(...[
    h('p', { class: 'lede' }, 'Before an engineer, adapter or AI builds this: what must the app supply, what is already defined here, and what needs attention.'),
    h('section', {}, h('h3', {}, 'The app must supply (' + bindRows.length + ')'), bindRows.length ? h('ul', { class: 'bind-list' }, bindRows) : h('p', { class: 'muted' }, 'Nothing — this design asks the app for no actions, navigation or conditions.')),
    local.length ? h('section', {}, h('h3', {}, 'Already defined here (' + local.length + ')'), h('ul', { class: 'bind-list' }, local.map((row) => h('li', {}, h('span', { class: 'seam-kind seam-presentation' }, 'Local UI'), h('code', {}, row.path), ' ' + String(row.verb).toLowerCase() + 's ', h('code', {}, row.targetPathOrNull))))) : null,
    h('section', {}, h('h3', {}, 'Findings (' + review.findings.length + ')'),
      moved.length ? h('p', {}, moved.length + ' element(s) come from an older source commit with the same content. ', h('button', { type: 'button', class: 'btn', onclick: rebindAllMoved }, 'Update to current source')) : null,
      findings.length ? h('ul', { class: 'findings' }, findings) : h('p', { class: 'muted' }, 'No findings.')),
    notes,
    h('section', {}, h('h3', {}, 'Construction brief'), h('pre', { class: 'brief' }, briefText())),
  ].filter(Boolean)); // DOM replaceChildren would print a literal "null" for absent sections
}

function rebindAllMoved() {
  const review = app.review ?? Review.reviewBlueprint(app.editor.blueprint, { inventoriesBySubject: app.bySubject });
  let state = app.editor;
  let count = 0;
  for (const row of review.currentness.filter((item) => item.state === 'MOVED' && item.scope === null)) {
    const inventory = app.bySubject.get(row.subjectRef);
    const result = Doc.applyCommand(state, { type: 'REBIND_SOURCE', nodeRef: row.nodeRef, source: evidenceFor(inventory, row.occurrenceRef) });
    if (result.ok) { state = result.state; count += 1; }
  }
  commit(state, 'Updated ' + count + ' element(s) to the current source commit.');
}

function openReview() {
  app.ui.reviewOpen = true;
  renderReview();
  $('review').showModal();
}

function closeReview() {
  app.ui.reviewOpen = false;
  $('review').close();
}

async function openFile(file) {
  try {
    const parsed = JSON.parse(await file.text());
    const { blueprint, migratedFrom, notes } = Ui.readUiBlueprint(parsed);
    app.preview.openOverlays.clear();
    app.preview.hiddenConditions.clear();
    app.ui.migrationNotes = notes;
    commit(Doc.replaceDesign(app.editor, blueprint), 'Opened ' + blueprint.label + (migratedFrom ? ' (upgraded from an older format — see Review for notes)' : '') + '. Undo returns to your previous design.');
    if (migratedFrom) openReview();
  } catch (error) {
    status('Could not open that file: ' + String(error.message ?? error).replace(/^ui blueprint: /u, ''), 'error');
  }
}

// ---------------------------------------------------------------------------------------
// browser draft (this browser only)
// ---------------------------------------------------------------------------------------

let saveTimer = null;
function scheduleSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, Ui.uiBlueprintBytes(app.editor.blueprint));
      $('draft-state').textContent = 'Draft kept in this browser';
    } catch {
      $('draft-state').textContent = 'Draft not kept (browser storage unavailable)';
    }
  }, 400);
}

function restoreDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return false;
    const { blueprint } = Ui.readUiBlueprint(JSON.parse(raw));
    app.editor = Doc.createEditorState(blueprint);
    return true;
  } catch {
    return false;
  }
}

function newDesign() {
  if (app.editor.blueprint.nodes.length && !window.confirm('Start a new design? Your current one stays available through Undo until you close this tab.')) return;
  app.ui.migrationNotes = [];
  commit(Doc.replaceDesign(app.editor, Doc.blueprintFromDraft(Doc.emptyDraft())), 'New design. Undo brings the previous one back.');
}

// ---------------------------------------------------------------------------------------
// boot
// ---------------------------------------------------------------------------------------

function handoffFromGallery() {
  const params = new URLSearchParams(location.search);
  const add = params.get('add');
  if (!add) return;
  const [slug, occurrenceRef] = add.split('~');
  const inventory = app.inventories.get(slug);
  const occurrence = inventory?.occurrences.find((row) => row.occurrenceRef === occurrenceRef);
  history.replaceState(null, '', location.pathname);
  if (!occurrence) return status('That Library item is not in the current source anymore.', 'error');
  insertItems(itemsForOccurrence(inventory, occurrence, params.get('children') === '1'));
}

function wireToolbar() {
  $('design-name').addEventListener('change', (event) => apply({ type: 'RENAME', label: event.target.value }));
  $('undo').addEventListener('click', undo);
  $('redo').addEventListener('click', redo);
  $('profile').replaceChildren(...Object.entries(Ui.UI_PREVIEW_PROFILES).map(([key, value]) => h('option', { value: key }, value.label + ' · ' + value.width)));
  $('profile').addEventListener('change', (event) => { app.editor = Doc.setPreview(app.editor, { profile: event.target.value }); renderCanvas(); scheduleSave(); });
  $('rtl').addEventListener('click', () => { app.editor = Doc.setPreview(app.editor, { direction: app.editor.blueprint.preview.direction === 'RTL' ? 'LTR' : 'RTL' }); renderToolbar(); renderCanvas(); scheduleSave(); });
  $('stress').addEventListener('click', () => { app.preview.stressText = !app.preview.stressText; renderToolbar(); renderCanvas(); status(app.preview.stressText ? 'Long-text preview: text is pseudo-localized and ~40% longer. Preview only.' : 'Normal text.'); });
  $('try').addEventListener('click', () => setTryMode(!app.preview.tryMode));
  $('zoom').addEventListener('click', () => { app.ui.zoomMode = app.ui.zoomMode === 'FIT' ? 'ACTUAL' : 'FIT'; renderToolbar(); renderCanvas(); });
  $('new').addEventListener('click', newDesign);
  $('open').addEventListener('click', () => { $('file').value = ''; $('file').click(); });
  $('file').addEventListener('change', () => { const file = $('file').files?.[0]; if (file) openFile(file); });
  $('save').addEventListener('click', saveBlueprint);
  $('review-open').addEventListener('click', openReview);
  $('review-close').addEventListener('click', closeReview);
  $('review').addEventListener('close', () => { app.ui.reviewOpen = false; });
  $('save-brief').addEventListener('click', () => { download(fileSlug() + '.construction-brief.md', briefText(), 'text/markdown'); status('Saved the construction brief.'); });
  $('copy-brief').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(briefText()); status('Construction brief copied.'); } catch { status('Copy is not available here; use Save brief instead.', 'error'); }
  });
  $('save-json').addEventListener('click', saveBlueprint);
  $('search').addEventListener('input', (event) => { app.ui.query = event.target.value; renderPalette(); });
  // Keyboard: Enter adds the top match; ArrowDown moves into the results.
  $('search').addEventListener('keydown', (event) => {
    const first = $('palette').querySelector('.family-main');
    if (event.key === 'Enter' && first && app.ui.query.trim()) { event.preventDefault(); first.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })); }
    if (event.key === 'ArrowDown' && first) { event.preventDefault(); first.focus(); }
  });
  $('palette').addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    const items = [...$('palette').querySelectorAll('.family-main, .example-main')];
    const index = items.indexOf(document.activeElement);
    if (index < 0) return;
    event.preventDefault();
    if (event.key === 'ArrowUp' && index === 0) return $('search').focus();
    items[Math.max(0, Math.min(items.length - 1, index + (event.key === 'ArrowDown' ? 1 : -1)))].focus();
  });
  $('tab-add').addEventListener('click', () => { app.ui.tab = 'ADD'; renderTabs(); });
  $('tab-layers').addEventListener('click', () => { app.ui.tab = 'LAYERS'; renderTabs(); renderLayers(); });
  $('product').addEventListener('change', (event) => { app.ui.product = event.target.value; renderPalette(); });
  document.addEventListener('keydown', onKeyDown);
  window.addEventListener('resize', () => { if (app.ui.zoomMode === 'FIT') renderCanvas(); });
}

export async function boot() {
  const style = document.createElement('style');
  style.textContent = RENDERER_CSS + CANVAS_CSS;
  document.head.append(style);
  wireToolbar();
  const restored = restoreDraft();
  render();
  status('Loading current component source…');
  try {
    app.catalog = Catalog.normalizeLensCatalog(await fetchJson(CATALOG_URL));
    app.architecture = Architecture.normalizeComponentArchitectureCatalog(await fetchJson(ARCHITECTURE_URL));
    const loaded = await Promise.all(app.catalog.subjects.map(async (subject) => {
      const main = Catalog.buildFor(subject, 'main');
      if (!main) return null;
      try {
        const inventory = Components.normalizeComponentInventory(await fetchJson(INVENTORY_DIR + subject.slug + '.main.components.json'));
        if (inventory.subjectRef !== subject.subjectRef || inventory.sourceSnapshot.commit !== main.commit) throw new Error(subject.slug + ' inventory does not match its Main build');
        return [subject.slug, inventory];
      } catch (error) {
        console.warn('Component inventory unavailable for ' + subject.slug, error);
        return null;
      }
    }));
    app.inventories = new Map(loaded.filter(Boolean));
    app.bySubject = new Map([...app.inventories.values()].map((inventory) => [inventory.subjectRef, inventory]));
    buildFamilies();
    $('product').replaceChildren(h('option', { value: '' }, 'All Products'), ...[...app.inventories.keys()].map((slug) => h('option', { value: slug }, Catalog.subjectFor(app.catalog, slug)?.label ?? slug)));
    app.review = null;
    render();
    status(restored ? 'Restored your draft from this browser.' : 'Ready. Drag a building block onto the screen, or select one and press Enter.');
    handoffFromGallery();
  } catch (error) {
    status('The component library could not load: ' + (error?.message ?? String(error)) + '. You can still open a saved blueprint.', 'error');
  }
}

// [VXG RealForever][VEXWORK][COMPONENT-LIBRARY][A5-BUILDER-APP]
