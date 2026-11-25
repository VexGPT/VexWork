// Builder canvas: projects a resolved UI Blueprint tree into browser layout for preview.
//
// The canvas is a projection. Container modes become flex / grid / absolute positioning at the
// preview's real dp width (1dp = 1 CSS px before zoom), so text density stays honest across
// Phone / Tablet / Desktop. Nothing here writes meaning; edits go back through commands.
//
// CANVAS PIXELS != LAYOUT MEANING

import { UI_FRACTION_DENOMINATOR, UI_SPACING_TOKENS } from '../../src/shared/vexboard-ui-blueprint.mjs';
import { kindSpec } from '../../src/shared/vexboard-ui-kinds.mjs';
import { h, renderContainer, renderLeaf } from './component-renderer.mjs';

const D = UI_FRACTION_DENOMINATOR;
const ALIGN = { START: 'flex-start', CENTER: 'center', END: 'flex-end', STRETCH: 'stretch' };
const JUSTIFY = { START: 'flex-start', CENTER: 'center', END: 'flex-end', SPACE_BETWEEN: 'space-between' };

export function selectablePath(path) {
  return String(path ?? '').split('/')[0] || null;
}

export function pseudoLocalize(value) {
  const map = { a: 'å', e: 'é', i: 'î', o: 'ö', u: 'ü', c: 'ç', n: 'ñ', s: 'ŝ', y: 'ý', A: 'Å', E: 'É', O: 'Ö' };
  const accented = String(value).replace(/[aeioucnsyAEO]/gu, (ch) => map[ch] ?? ch);
  const pad = ' ' + '·'.repeat(Math.max(2, Math.ceil(String(value).length * 0.4)));
  return '⟦' + accented + pad + '⟧';
}

function px(token) {
  return (UI_SPACING_TOKENS[token] ?? 0) + 'px';
}

function applyContainer(host, container) {
  host.dataset.mode = container.mode;
  host.style.padding = px(container.padding);
  if (container.mode === 'STACK') {
    host.style.display = 'flex';
    host.style.flexDirection = container.axis === 'HORIZONTAL' ? 'row' : 'column';
    host.style.flexWrap = 'nowrap';
    host.style.gap = px(container.gap);
    host.style.alignItems = ALIGN[container.align] ?? 'stretch';
    host.style.justifyContent = JUSTIFY[container.justify] ?? 'flex-start';
  } else if (container.mode === 'OVERLAY') {
    host.style.display = 'grid';
    host.style.gridTemplate = '1fr / 1fr';
  } else {
    host.style.display = 'block';
    host.style.position = 'relative';
    host.style.height = '100%';
    host.classList.add('freeform-host');
  }
}

function anchorSelf(anchor) {
  const [vertical, horizontal] = anchor === 'CENTER' ? ['CENTER', 'CENTER'] : anchor.split('_');
  const map = { TOP: 'start', START: 'start', CENTER: 'center', BOTTOM: 'end', END: 'end' };
  return { alignSelf: map[vertical], justifySelf: map[horizontal] };
}

function applyChildLayout(element, node, parentContainer) {
  const { width, height, placement, depth } = node.layout;
  const mode = parentContainer?.mode ?? 'STACK';
  const horizontal = mode === 'STACK' && parentContainer.axis === 'HORIZONTAL';
  if (depth) element.style.zIndex = String(depth + 1);
  if (mode === 'FREEFORM' && placement?.type === 'FRACTION') {
    const { x, y } = placement;
    element.style.position = 'absolute';
    element.style.insetInlineStart = (x.start / D * 100) + '%';
    element.style.top = (y.start / D * 100) + '%';
    if (x.end !== null) element.style.width = ((x.end - x.start) / D * 100) + '%';
    else if (width.mode === 'FIXED') element.style.width = width.valueOrNull + 'px';
    else element.style.maxWidth = ((D - x.start) / D * 100) + '%';
    if (y.end !== null) element.style.height = ((y.end - y.start) / D * 100) + '%';
    else if (height.mode === 'FIXED') element.style.height = height.valueOrNull + 'px';
    return;
  }
  if (mode === 'OVERLAY' && placement?.type === 'ANCHOR') {
    element.style.gridArea = '1 / 1';
    const self = anchorSelf(placement.anchor);
    element.style.alignSelf = self.alignSelf;
    element.style.justifySelf = self.justifySelf;
    element.style.margin = px(placement.inset);
  }
  const main = horizontal ? width : height;
  const cross = horizontal ? height : width;
  const mainProp = horizontal ? 'width' : 'height';
  const crossProp = horizontal ? 'height' : 'width';
  if (mode === 'STACK') {
    if (main.mode === 'FILL') element.style.flex = '1 1 0';
    else if (main.mode === 'FIXED') {
      element.style.flex = 'none';
      element.style[mainProp] = main.valueOrNull + 'px';
    } else element.style.flex = 'none';
    if (cross.mode === 'FILL') element.style.alignSelf = 'stretch';
    else if (cross.mode === 'FIXED') {
      element.style[crossProp] = cross.valueOrNull + 'px';
      if (parentContainer.align === 'STRETCH') element.style.alignSelf = 'flex-start';
    } else if (parentContainer.align === 'STRETCH') element.style.alignSelf = 'flex-start';
  } else {
    if (width.mode === 'FILL') element.style.width = '100%';
    if (width.mode === 'FIXED') element.style.width = width.valueOrNull + 'px';
    if (height.mode === 'FILL') element.style.height = '100%';
    if (height.mode === 'FIXED') element.style.height = height.valueOrNull + 'px';
  }
}

function displayText(node, preview) {
  const value = node.text?.value ?? node.source?.label ?? kindSpec(node.kind).label;
  return preview.stressText ? pseudoLocalize(value) : value;
}

function renderNode(node, parentContainer, ctx) {
  const spec = kindSpec(node.kind);
  const path = node.path;
  const select = selectablePath(path);
  const hidden = node.visibility.presence === 'CONDITIONAL' && ctx.preview.hiddenConditions.has(path);
  const label = displayText(node, ctx.preview);
  let visual;
  let host = null;
  if (node.layout.container) {
    const shell = renderContainer({ kind: node.kind, label: node.text ? label : null });
    visual = shell.element;
    host = shell.host;
    applyContainer(host, node.layout.container);
    if (node.layout.container.mode === 'FREEFORM' && node.layout.height.mode === 'FIXED') host.style.minHeight = (node.layout.height.valueOrNull - 32) + 'px';
    // Only authored containers and instance slots accept drops; component internals do not.
    if (node.slotHostOrNull) {
      host.dataset.dropHost = node.slotHostOrNull.instancePath;
      host.dataset.slot = node.slotHostOrNull.slotRef;
      host.classList.add('slot-host');
    } else if (select === path) {
      host.dataset.dropHost = path;
    }
    for (const child of node.children) host.append(renderNode(child, node.layout.container, ctx));
    if (!node.children.length) host.append(h('div', { class: 'empty-host' }, node.slotHostOrNull ? 'Slot · ' + node.slotHostOrNull.label : 'Empty ' + spec.label.toLowerCase()));
  } else {
    visual = renderLeaf({ kind: node.kind, label, styleOrNull: node.source?.styleOrNull, textRoleOrNull: node.source?.textRoleOrNull, iconOrNull: node.source?.iconOrNull });
    if (ctx.preview.tryMode && node.kind === 'TOGGLE') visual.classList.toggle('on', ctx.preview.toggled.has(path));
  }
  const selected = ctx.selection && select === ctx.selection;
  const own = select === path;
  const element = h('div', {
    class: 'node' + (own ? ' own' : ' inner') + (selected && own ? ' selected' : '') + (hidden ? ' preview-hidden' : '') + (node.visibility.presence === 'CONDITIONAL' ? ' conditional' : '') + (node.instanceNodeRef ? ' instance' : ''),
    'data-path': path,
    'data-select': select,
    'data-kind': node.kind,
  }, visual);
  if (node.visibility.presence === 'CONDITIONAL') element.append(h('span', { class: 'cond-badge', title: 'Shown when ' + node.visibility.conditionKeyOrNull }, 'if ' + node.visibility.conditionKeyOrNull));
  if (node.instanceNodeRef) element.append(h('span', { class: 'instance-badge' }, '◇ ' + (ctx.definitionLabel(node.instanceChain.at(-1)?.definitionRef) ?? 'Component')));
  if (parentContainer) applyChildLayout(element, node, parentContainer);
  else element.style.width = '100%';
  if (own && selected) {
    element.append(h('span', { class: 'node-chip', 'data-grip': path, title: 'Drag to move · ' + spec.label }, '⠿ ' + spec.label));
    if (parentContainer?.mode === 'FREEFORM') {
      for (const handle of ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']) element.append(h('span', { class: 'handle handle-' + handle, 'data-handle': handle, 'data-path': path }));
    }
  }
  element.addEventListener('click', (event) => {
    if (ctx.preview.tryMode) {
      const seamNode = node;
      if (seamNode.seams.length || node.kind === 'TOGGLE') {
        event.stopPropagation();
        ctx.onTry(seamNode);
      }
      return;
    }
    event.stopPropagation();
    ctx.onSelect(select);
  });
  return element;
}

function overlayFrame(node, ctx) {
  const overlay = kindSpec(node.kind).overlay;
  const inner = renderNode(node, null, ctx);
  const frame = h('div', { class: 'overlay-frame overlay-' + String(overlay).toLowerCase(), 'data-overlay': node.path }, inner);
  if (overlay === 'MODAL') frame.style.placeItems = 'center';
  return frame;
}

// Render the whole viewport. Returns the viewport element.
export function renderViewport({ resolved, surface, profile, direction, zoom, selection, preview, scope, callbacks }) {
  const ctx = {
    selection,
    preview,
    scopeRootPath: scope?.rootPath ?? null,
    onSelect: callbacks.onSelect,
    onTry: callbacks.onTry,
    definitionLabel: callbacks.definitionLabel,
  };
  const surfaceHost = h('div', { class: 'surface-host', 'data-drop-host': '' });
  const container = scope ? { mode: 'STACK', axis: 'VERTICAL', gap: 'M', padding: 'L', align: 'STRETCH', justify: 'START' } : surface.container;
  applyContainer(surfaceHost, container);
  if (scope) delete surfaceHost.dataset.dropHost;
  if (!scope && container.mode === 'FREEFORM') surfaceHost.style.minHeight = '100%';
  for (const node of resolved.content) surfaceHost.append(renderNode(node, container, ctx));
  if (!resolved.content.length && !resolved.overlays.length) {
    surfaceHost.append(h('div', { class: 'empty-surface' },
      h('strong', {}, 'Start with a building block'),
      h('span', {}, 'Drag something from the left, or select it and press Enter. Layout groups arrange what you put inside them.'),
    ));
  }
  const overlayLayer = h('div', { class: 'overlay-layer' });
  const shown = resolved.overlays.filter((node) => preview.openOverlays.has(node.path)
    || selection && (selectablePath(node.path) === selection || containsSelection(node, selection))
    || scope?.rootPath === node.path);
  if (shown.length) {
    overlayLayer.append(h('div', {
      class: 'scrim',
      title: 'Click to close the overlay preview',
      onclick: (event) => { event.stopPropagation(); callbacks.onDismissOverlays(); },
    }));
  }
  [...shown].sort((a, b) => (a.layout.depth ?? 0) - (b.layout.depth ?? 0)).forEach((node) => overlayLayer.append(overlayFrame(node, ctx)));
  const viewport = h('div', {
    class: 'viewport size-' + profile.sizeClass,
    dir: direction === 'RTL' ? 'rtl' : 'ltr',
    style: 'width:' + profile.width + 'px;height:' + profile.height + 'px;transform:scale(' + zoom + ');',
    role: 'region',
    'aria-label': 'Preview · ' + profile.label + ' ' + profile.width + ' × ' + profile.height + ' dp',
  }, h('div', { class: 'viewport-scroll' + (container.mode === 'FREEFORM' ? ' freeform' : '') }, surfaceHost), overlayLayer);
  viewport.addEventListener('click', () => callbacks.onSelect(null));
  return viewport;
}

function containsSelection(node, selection) {
  return node.children.some((child) => selectablePath(child.path) === selection || containsSelection(child, selection));
}

export const CANVAS_CSS = `
.viewport{position:relative;transform-origin:top left;background:#fff;border:1px solid #c3cbd7;border-radius:26px;box-shadow:0 22px 50px -30px #18213a88;overflow:hidden}
.viewport.size-expanded,.viewport.size-medium{border-radius:14px}
.viewport-scroll{position:absolute;inset:0;overflow:auto}
.viewport-scroll.freeform{overflow:hidden}
.surface-host{min-height:100%;box-sizing:border-box}
.freeform-host{background-image:linear-gradient(to right,#eef1f6 1px,transparent 1px),linear-gradient(to bottom,#eef1f6 1px,transparent 1px);background-size:calc(100% / ${D}) calc(100% / ${D})}
.node{position:relative;min-width:0;border-radius:10px;outline:1px solid transparent;outline-offset:2px}
.node.own:hover{outline-color:#9fb2e8}
.node.selected{outline:2px solid #2f5be6;outline-offset:2px}
.node.inner{pointer-events:none}.node.inner .node.own,.node.inner .slot-host{pointer-events:auto}
.viewport.try .node.inner{pointer-events:auto}
.node.instance{outline:1px dashed #b49be3;outline-offset:3px}
.node.instance.selected{outline:2px solid #7c4ddb}
.node.preview-hidden{display:none}
.node.conditional>.vx,.node.conditional>.vx-container{opacity:.92}
.cond-badge,.instance-badge{position:absolute;top:-9px;inset-inline-end:8px;z-index:3;padding:1px 6px;border-radius:999px;font:600 9px ui-monospace,monospace;white-space:nowrap;pointer-events:none}
.cond-badge{background:#fff4dc;color:#7a5410;border:1px solid #f0d49b}
.instance-badge{background:#f1ebfd;color:#5b33b5;border:1px solid #d8c9f7;inset-inline-end:auto;inset-inline-start:8px}
.node-chip{position:absolute;top:-22px;inset-inline-start:0;z-index:20;padding:2px 8px;border-radius:6px;background:#2f5be6;color:#fff;font:600 10px/1.6 ui-sans-serif,system-ui;white-space:nowrap;cursor:grab;user-select:none}
.node.instance>.node-chip{background:#7c4ddb}
.handle{position:absolute;z-index:21;width:10px;height:10px;background:#fff;border:2px solid #2f5be6;border-radius:3px}
.handle-n{top:-6px;left:calc(50% - 5px);cursor:ns-resize}.handle-s{bottom:-6px;left:calc(50% - 5px);cursor:ns-resize}
.handle-e{right:-6px;top:calc(50% - 5px);cursor:ew-resize}.handle-w{left:-6px;top:calc(50% - 5px);cursor:ew-resize}
.handle-ne{right:-6px;top:-6px;cursor:nesw-resize}.handle-sw{left:-6px;bottom:-6px;cursor:nesw-resize}
.handle-nw{left:-6px;top:-6px;cursor:nwse-resize}.handle-se{right:-6px;bottom:-6px;cursor:nwse-resize}
.empty-host{padding:10px;border:1px dashed #cfd6e1;border-radius:8px;color:#8a94a6;font-size:11px;text-align:center}
.slot-host{outline:1px dashed #c6b3f0;outline-offset:2px;border-radius:6px}
.empty-surface{display:grid;gap:6px;place-items:center;text-align:center;min-height:260px;padding:24px;border:2px dashed #dfe4ec;border-radius:16px;color:#68748a}
.empty-surface strong{color:#18213a;font-size:16px}
.overlay-layer{position:absolute;inset:0;pointer-events:none}
.overlay-layer>*{pointer-events:auto}
.scrim{position:absolute;inset:0;background:#18213a40}
.overlay-frame{position:absolute;inset:0;display:grid;padding:20px;pointer-events:none}
.overlay-frame>.node{pointer-events:auto}
.overlay-modal>.node{align-self:center;justify-self:center;width:min(100%,380px)}
.overlay-sheet{padding:0;align-items:end}.overlay-sheet>.node{align-self:end;width:100%}
.overlay-popover{align-items:start;justify-items:end;padding:56px 16px}
.drop-line{position:absolute;z-index:40;background:#2f5be6;border-radius:2px;pointer-events:none}
.drop-box{position:absolute;z-index:40;border:2px dashed #2f5be6;border-radius:8px;background:#2f5be614;pointer-events:none}
.drop-host-active{outline:2px solid #2f5be6aa;outline-offset:-2px;border-radius:8px}
.drop-host-invalid{outline:2px solid #d64545aa;outline-offset:-2px;border-radius:8px}
`;

// [VXG RealForever][VEXWORK][COMPONENT-LIBRARY][A5-BUILDER-CANVAS]
