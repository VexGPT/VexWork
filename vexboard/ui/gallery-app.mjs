// VexBoard Component Library (Gallery) — the showroom.
//
// Answers: what building blocks exist, what is one like by itself, how does it really vary
// across source examples, and what evidence stands behind it? Composition happens in the
// Builder (one composer, one blueprint format); the Gallery hands items over by reference.
//
// GALLERY SPECIMEN != NATIVE PIXEL PARITY
// LOCAL PREVIEW INTERACTION != PRODUCT EFFECT

import * as Catalog from '../../src/shared/vexboard-lens-catalog.mjs';
import * as Components from '../../src/shared/vexboard-component-inventory.mjs';
import * as Architecture from '../../src/shared/vexboard-component-architecture.mjs';
import { kindSpec, seamsFromSourceIntent, UI_CATEGORY_LABELS, UI_KIND_CATEGORIES } from '../../src/shared/vexboard-ui-kinds.mjs';
import { h, humanize, isContainerKind, RENDERER_CSS, renderContainer, renderLeaf, renderThumb } from './component-renderer.mjs';

const CATALOG_URL = '../projects/vexboard/lens/catalog.json';
const INVENTORY_DIR = '../projects/component-library-architecture/inventory/';
const ARCHITECTURE_URL = '../projects/component-library-architecture/component-architecture-catalog.json';
const EVIDENCE_TABS = ['ABOUT', 'WHERE_USED', 'REALIZATIONS', 'PROOF', 'SOURCE'];

let params = new URLSearchParams();
const state = {
  catalog: null,
  architecture: null,
  inventories: new Map(),
  families: [],
  query: '',
  product: '',
  selectedKey: null,
  occurrenceIndex: 0,
  evidence: 'ABOUT',
  previewMessage: 'Preview interactions are local only; no Product effect runs here.',
};

const root = () => document.getElementById('app');
const short = (sha) => String(sha ?? '').slice(0, 7);

async function fetchJson(url) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(url + ' HTTP ' + response.status);
  return response.json();
}

function buildFamilies() {
  const rows = [];
  for (const [slug, inventory] of state.inventories) {
    const subject = Catalog.subjectFor(state.catalog, slug);
    for (const component of inventory.components) {
      const occurrences = Components.occurrencesForComponent(inventory, component.componentRef);
      if (occurrences.length) rows.push({ key: slug + '|' + component.componentRef, slug, subject, inventory, component, occurrences });
    }
  }
  rows.sort((a, b) => kindSpec(a.component.kind).label.localeCompare(kindSpec(b.component.kind).label) || a.subject.label.localeCompare(b.subject.label));
  state.families = rows;
}

function visibleFamilies() {
  const needle = state.query.trim().toLowerCase();
  return state.families.filter((row) => {
    if (state.product && row.slug !== state.product) return false;
    if (!needle) return true;
    return [kindSpec(row.component.kind).label, row.component.kind, row.subject.label, ...row.component.styles, ...row.component.textRoles, ...row.occurrences.flatMap((o) => [o.label, o.surfaceLabel, o.style, o.intent, o.sourcePath])]
      .filter(Boolean).join('\n').toLowerCase().includes(needle);
  });
}

function selectedFamily() {
  if (!state.selectedKey || !state.families.some((row) => row.key === state.selectedKey)) state.selectedKey = visibleFamilies()[0]?.key ?? state.families[0]?.key ?? null;
  return state.families.find((row) => row.key === state.selectedKey) ?? null;
}

function selectedOccurrence(family) {
  if (!family) return null;
  if (state.occurrenceIndex >= family.occurrences.length) state.occurrenceIndex = 0;
  return family.occurrences[state.occurrenceIndex];
}

function candidates(family) {
  return Architecture.candidatesForSourceFamily(state.architecture, family.component.componentRef);
}
function accepted(family) {
  return candidates(family).filter((row) => row.state === 'ACCEPTED_PORTABLE' && row.formation?.state === 'ACCEPTED');
}
function held(family) {
  return candidates(family).filter((row) => row.state === 'HELD' || row.formation?.state === 'HELD');
}
function realizations(family) {
  const refs = new Set(accepted(family).map((row) => row.candidateRef));
  return Architecture.targetRealizations(state.architecture).filter((row) => refs.has(row.candidateRef));
}
function candidateName(ref) {
  return state.architecture.candidates.find((row) => row.candidateRef === ref)?.label ?? ref;
}

function seamsFor(row) {
  return seamsFromSourceIntent({
    kind: row.kind, intentOrNull: row.intent, actionKeyOrNull: row.actionKey, callOrNull: row.call,
    pathwayRefOrNull: row.pathwayRef, navigatesToOrNull: row.navigatesTo, elementRef: row.elementRef, interactions: row.interactions,
  });
}

function toast(message) {
  state.previewMessage = message;
  const el = document.getElementById('preview-toast');
  if (el) el.textContent = message;
}

// Render a source occurrence with (a bounded slice of) its real source children.
function specimen(row, inventory, depth = 0) {
  const byElement = new Map(inventory.occurrences.map((item) => [item.elementRef, item]));
  const model = { kind: row.kind, label: row.label, styleOrNull: row.style, textRoleOrNull: row.textRole, iconOrNull: row.icon };
  if (isContainerKind(row.kind)) {
    const { element, host } = renderContainer(model);
    host.style.display = 'flex';
    host.style.flexDirection = row.kind === 'ROW' ? 'row' : 'column';
    host.style.gap = '8px';
    host.style.flexWrap = row.kind === 'ROW' ? 'wrap' : 'nowrap';
    const kids = row.childElementRefs.map((ref) => byElement.get(ref)).filter(Boolean);
    if (depth < 3) kids.slice(0, 8).forEach((child) => host.append(specimen(child, inventory, depth + 1)));
    if (kids.length > 8 && depth < 3) host.append(h('span', { class: 'more-kids' }, '+' + (kids.length - 8) + ' more in source'));
    if (!kids.length) host.append(h('span', { class: 'empty-kids' }, 'No children projected in source'));
    return element;
  }
  const leaf = renderLeaf(model);
  const seams = seamsFor(row);
  if (['BUTTON', 'FAB', 'MENU_ITEM', 'TOGGLE'].includes(row.kind)) {
    const wrapper = h('button', {
      type: 'button',
      class: 'specimen-press',
      title: [row.elementRef, row.style, row.intent].filter(Boolean).join('\n'),
      onclick: () => {
        if (row.kind === 'TOGGLE') {
          leaf.classList.toggle('on');
          toast('Toggled the local specimen ' + (leaf.classList.contains('on') ? 'on' : 'off') + ' · Product State was not changed.');
        } else {
          toast('Activated locally: ' + row.label + ' · ' + (seams.length ? 'in the app this ' + describeSeam(seams[0]).toLowerCase() : 'source projects no behavior') + ' · no Product effect was run.');
        }
      },
    }, leaf);
    return wrapper;
  }
  return leaf;
}

function describeSeam(seam) {
  if (seam.kind === 'ACTION') return 'Asks the app to run “' + seam.key + '”';
  if (seam.kind === 'NAVIGATION') return 'Navigates' + (seam.destinationOrNull ? ' to ' + seam.destinationOrNull : '');
  return humanize(seam.verbOrNull) + 's ' + (seam.targetHintOrNull ?? 'a local view');
}

function builderHref(family, row, withChildren) {
  return './builder.html?add=' + encodeURIComponent(family.slug + '~' + row.occurrenceRef) + (withChildren ? '&children=1' : '');
}

function libraryPanel() {
  const rows = visibleFamilies();
  const sections = UI_KIND_CATEGORIES.map((category) => {
    const items = rows.filter((row) => kindSpec(row.component.kind).category === category);
    if (!items.length) return null;
    return h('section', { class: 'lib-section' },
      h('h3', {}, UI_CATEGORY_LABELS[category], h('span', { class: 'count' }, String(items.length))),
      items.map((row) => {
        const first = row.occurrences[0];
        const byElement = new Map(row.inventory.occurrences.map((item) => [item.elementRef, item]));
        const kids = first.childElementRefs.map((ref) => byElement.get(ref)).filter(Boolean).map((item) => ({ kind: item.kind, label: item.label, styleOrNull: item.style }));
        return h('button', {
          type: 'button', class: 'lib-card' + (row.key === state.selectedKey ? ' on' : ''), 'aria-pressed': row.key === state.selectedKey ? 'true' : 'false',
          onclick: () => { state.selectedKey = row.key; state.occurrenceIndex = 0; state.evidence = 'ABOUT'; render(); },
        },
        h('span', { class: 'lib-thumb' }, renderThumb({ kind: row.component.kind, label: first.label, styleOrNull: first.style, textRoleOrNull: first.textRole, iconOrNull: first.icon }, kids)),
        h('span', { class: 'lib-text' }, h('strong', {}, kindSpec(row.component.kind).label), h('span', {}, row.subject.label + ' · ' + row.occurrences.length + ' example' + (row.occurrences.length === 1 ? '' : 's')),
          accepted(row).length ? h('span', { class: 'chip good' }, 'portable relationship') : null));
      }));
  }).filter(Boolean);
  return h('aside', { class: 'panel library' },
    h('div', { class: 'panel-head' }, h('h2', {}, 'Library'), h('span', { class: 'badge' }, String(rows.length))),
    h('div', { class: 'panel-body' },
      h('input', { class: 'search', type: 'search', placeholder: 'Find a component, style, behavior or screen', value: state.query, 'aria-label': 'Search component library', oninput: (event) => { state.query = event.target.value; renderLibraryOnly(); } }),
      h('select', { 'aria-label': 'Product', onchange: (event) => { state.product = event.target.value; state.selectedKey = null; render(); } },
        h('option', { value: '', selected: !state.product }, 'All Products'),
        [...state.inventories.keys()].map((slug) => h('option', { value: slug, selected: state.product === slug }, Catalog.subjectFor(state.catalog, slug)?.label ?? slug))),
      h('div', { id: 'lib-sections' }, sections.length ? sections : h('p', { class: 'muted' }, 'Nothing matches.'))));
}

function renderLibraryOnly() {
  const fresh = libraryPanel();
  document.querySelector('.library')?.replaceWith(fresh);
  const input = fresh.querySelector('.search');
  input.focus();
  input.setSelectionRange(input.value.length, input.value.length);
}

function stagePanel(family, row) {
  const spec = kindSpec(row.kind);
  const select = h('select', { 'aria-label': 'Source example', onchange: (event) => { state.occurrenceIndex = Number(event.target.value); render(); } },
    family.occurrences.map((item, index) => h('option', { value: String(index), selected: index === state.occurrenceIndex ? true : null }, (index + 1) + '. ' + item.label + ' · ' + item.surfaceLabel + (item.style ? ' · ' + item.style : ''))));
  const step = (delta) => { state.occurrenceIndex = (state.occurrenceIndex + delta + family.occurrences.length) % family.occurrences.length; render(); };
  return h('section', { class: 'panel stage' },
    h('div', { class: 'stage-top' },
      h('div', {}, h('h2', {}, spec.label), h('p', {}, 'One real source occurrence in isolation. Step through examples to see how it actually varies in ' + family.subject.label + '.')),
      h('div', { class: 'actions' },
        h('a', { class: 'btn primary', href: builderHref(family, row, false) }, 'Use in Builder'),
        row.childElementRefs.length && isContainerKind(row.kind) ? h('a', { class: 'btn', href: builderHref(family, row, true) }, 'Use with its ' + row.childElementRefs.length + ' children') : null)),
    h('div', { class: 'example-bar' },
      h('button', { type: 'button', class: 'btn', 'aria-label': 'Previous example', onclick: () => step(-1) }, '‹'),
      select,
      h('button', { type: 'button', class: 'btn', 'aria-label': 'Next example', onclick: () => step(1) }, '›'),
      h('span', { class: 'counter' }, (state.occurrenceIndex + 1) + ' / ' + family.occurrences.length)),
    h('div', { class: 'specimen-wrap' }, h('div', { class: 'specimen-stage' }, h('span', { class: 'specimen-note' }, 'relationship specimen · not native pixel parity'), h('div', { class: 'specimen-tree' }, specimen(row, family.inventory)))),
    h('div', { id: 'preview-toast', class: 'preview-toast', role: 'status' }, state.previewMessage),
    h('div', { class: 'edge-strip' }, edgeEvidence(row).map(([kind, value]) => h('span', { class: 'edge' + (String(value).includes('no explicit') ? ' absent' : '') }, kind + ' · ' + value))));
}

function edgeEvidence(row) {
  const items = [];
  if (row.visibleWhen) items.push(['visible when', row.visibleWhen]);
  if (row.alwaysVisible) items.push(['always visible', 'source-authored']);
  for (const ref of row.realization.presenceRefs) items.push(['presence', ref]);
  for (const ref of row.realization.conditionRefs) items.push(['condition', ref]);
  for (const value of row.interactions) items.push(['interaction', value]);
  if (row.childElementRefs.length) items.push(['children', String(row.childElementRefs.length)]);
  if (row.localization.sourceStringRefs.length) items.push(['localized', row.localization.sourceStringRefs.length + ' bindings']);
  if (!items.length) items.push(['state', 'no explicit state/condition projected']);
  items.push(['accessibility', humanize(row.accessibility.state)]);
  return items;
}

function evidenceSection(family, row) {
  const tabs = h('div', { class: 'evidence-tabs', role: 'tablist' }, EVIDENCE_TABS.map((key) => h('button', {
    type: 'button', role: 'tab', class: 'tab' + (state.evidence === key ? ' on' : ''), 'aria-selected': state.evidence === key ? 'true' : 'false',
    onclick: () => { state.evidence = key; render(); },
  }, humanize(key))));
  let body;
  if (state.evidence === 'ABOUT') {
    const seams = seamsFor(row);
    body = [
      h('div', { class: 'evidence-row' }, h('strong', {}, 'What it does'), seams.length
        ? seams.map((seam) => h('span', { class: 'sub' }, h('span', { class: 'seam-kind seam-' + seam.kind.toLowerCase() }, seam.kind === 'PRESENTATION' ? 'Local UI' : humanize(seam.kind)), ' ' + describeSeam(seam)))
        : h('span', { class: 'sub' }, 'No behavior projected for this occurrence, so none is assumed.')),
      h('div', { class: 'evidence-row' }, h('strong', {}, 'Relationships'), h('span', { class: 'sub' }, [row.semanticRole, row.slot, row.layer, row.parentElementRef].filter(Boolean).join(' · ') || 'No additional relationship metadata.')),
      h('div', { class: 'evidence-row' }, h('strong', {}, 'Localization / accessibility'), h('span', { class: 'sub' }, row.localization.sourceStringRefs.length + ' string refs · accessibility ' + humanize(row.accessibility.state).toLowerCase())),
    ];
  } else if (state.evidence === 'WHERE_USED') {
    body = family.occurrences.map((item, index) => h('button', { type: 'button', class: 'evidence-row link-row', onclick: () => { state.occurrenceIndex = index; render(); } }, h('strong', {}, item.surfaceLabel + ' · ' + item.label), h('span', { class: 'sub' }, item.elementRef), h('span', { class: 'sub' }, item.sourcePath ?? 'Source path not projected')));
  } else if (state.evidence === 'REALIZATIONS') {
    const rows = realizations(family);
    body = rows.length ? rows.map((item) => h('div', { class: 'evidence-row' }, h('strong', {}, candidateName(item.candidateRef) + ' → ' + item.platformRef + ' / ' + item.framework), h('span', { class: 'sub' }, item.state + ' · ' + short(item.commit)), h('span', { class: 'sub' }, item.realizationRef)))
      : [h('div', { class: 'evidence-row' }, 'No accepted portable realization is attached to this source family yet.')];
  } else if (state.evidence === 'PROOF') {
    const rows = realizations(family).flatMap((realization) => realization.proofs.map((proof) => ({ realization, proof })));
    body = rows.length ? rows.map(({ realization, proof }) => h('div', { class: 'evidence-row' }, h('strong', {}, proof.proofRef + ' · ' + proof.state), h('span', { class: 'sub' }, realization.platformRef + ' · ' + short(realization.commit)), h('span', { class: 'sub' }, proof.note)))
      : [h('div', { class: 'evidence-row' }, 'No target proof is attached through an accepted portable relationship yet.')];
  } else {
    body = [
      h('div', { class: 'evidence-row' }, h('strong', {}, row.sourcePath ?? 'Source path not projected'), h('span', { class: 'sub' }, row.elementRef), row.declared ? h('code', { class: 'sub' }, row.declared) : null),
      h('div', { class: 'evidence-row' }, h('strong', {}, family.inventory.sourceSnapshot.repositoryRef + ' @ ' + short(family.inventory.sourceSnapshot.commit)), h('span', { class: 'sub' }, family.inventory.sourceSnapshot.lensRef ?? '')),
    ];
  }
  return h('section', { class: 'evidence' }, tabs, h('div', { class: 'evidence-body', role: 'tabpanel' }, body));
}

function inspectorPanel(family, row) {
  const accept = accepted(family);
  const hold = held(family);
  const reach = realizations(family);
  const disposition = accept.length ? 'Portable relationship available' : hold.length ? 'Portability held' : 'Source-bound';
  const lens = row.screenRef ? Catalog.lensHref(family.subject, { build: 'main', screen: row.screenRef, element: row.elementRef }) : null;
  return h('aside', { class: 'panel inspector' },
    h('div', { class: 'panel-head' }, h('h2', {}, 'About this item'), h('span', { class: 'badge ' + (accept.length ? 'good' : hold.length ? 'held' : '') }, disposition)),
    h('div', { class: 'panel-body' },
      h('dl', { class: 'kv' },
        h('dt', {}, 'Product'), h('dd', {}, family.subject.label),
        h('dt', {}, 'Screen'), h('dd', {}, row.surfaceLabel),
        h('dt', {}, 'Family'), h('dd', { class: 'mono' }, family.component.componentRef),
        h('dt', {}, 'Element'), h('dd', { class: 'mono' }, row.elementRef)),
      h('h3', {}, 'Portable relationships'),
      accept.length ? h('div', { class: 'chips' }, accept.map((item) => h('span', { class: 'chip good' }, item.label))) : h('p', { class: 'muted' }, hold.length ? 'A related portable contract is held; this item stays source-grounded.' : 'No accepted portable relationship yet — other targets realize it by hand.'),
      hold.length ? h('div', { class: 'chips' }, hold.map((item) => h('span', { class: 'chip held' }, item.label + ' · held'))) : null,
      h('h3', {}, 'Target reach'),
      h('p', { class: 'muted' }, reach.length ? reach.length + ' accepted realization record(s) can inform target adapters (A6).' : 'No cross-target realization can be claimed from this family yet.'),
      h('div', { class: 'inspector-actions' },
        h('a', { class: 'btn primary', href: builderHref(family, row, false) }, 'Use in Builder'),
        lens ? h('a', { class: 'btn', href: lens }, 'Open in Screen Lens') : null),
      evidenceSection(family, row)));
}

function hero() {
  return h('section', { class: 'hero' },
    h('div', {}, h('h1', {}, 'Component Library'), h('p', {}, 'Every building block Vex already knows how to build, taken from real Product source. Look at one by itself, step through its real examples, see what it does and where it comes from — then use it in the Builder.')),
    h('div', { class: 'truth' }, h('span', { class: 'badge good' }, 'AI required: No'), h('span', { class: 'badge' }, 'Source-grounded'), h('a', { class: 'btn soft', href: './builder.html' }, 'Open Builder')));
}

function render() {
  const family = selectedFamily();
  const row = selectedOccurrence(family);
  if (!family || !row) {
    root().replaceChildren(hero(), h('div', { class: 'panel panel-body' }, 'No component inventories are available.'));
    return;
  }
  root().replaceChildren(hero(), h('div', { class: 'shell' }, libraryPanel(), stagePanel(family, row), inspectorPanel(family, row)));
}

function applyDeepLink() {
  const occurrenceRef = params.get('occurrence');
  if (!occurrenceRef) return;
  for (const family of state.families) {
    const index = family.occurrences.findIndex((row) => row.occurrenceRef === occurrenceRef);
    if (index >= 0) {
      state.selectedKey = family.key;
      state.occurrenceIndex = index;
      return;
    }
  }
}

export async function boot() {
  params = new URLSearchParams(location.search);
  state.product = params.get('product') ?? '';
  const style = document.createElement('style');
  style.textContent = RENDERER_CSS;
  document.head.append(style);
  try {
    state.catalog = Catalog.normalizeLensCatalog(await fetchJson(CATALOG_URL));
    state.architecture = Architecture.normalizeComponentArchitectureCatalog(await fetchJson(ARCHITECTURE_URL));
    const loaded = await Promise.all(state.catalog.subjects.map(async (subject) => {
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
    state.inventories = new Map(loaded.filter(Boolean));
    buildFamilies();
    applyDeepLink();
    render();
  } catch (error) {
    root().replaceChildren(hero(), h('div', { class: 'panel panel-body' }, 'The component library could not load: ' + (error?.message ?? String(error))));
  }
}

// [VXG RealForever][VEXWORK][COMPONENT-LIBRARY][A5-GALLERY-APP]
