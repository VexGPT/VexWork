// Shared visual grammar for source-grounded components.
//
// Gallery specimens, Builder palette thumbnails and the Builder canvas all draw components
// through this one module so the same kind / style always looks the same everywhere.
// It is a preview projection: it does not claim native pixel parity and owns no meaning.
//
// RENDERER = PREVIEW PROJECTION
// RENDERER != TARGET REALIZATION

import { kindSpec } from '../../src/shared/vexboard-ui-kinds.mjs';

export function h(tag, attrs, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs || {})) {
    if (value === null || value === undefined || value === false) continue;
    if (key === 'class') node.className = value;
    else if (key === 'style') node.style.cssText = value;
    else if (key === 'dataset') Object.assign(node.dataset, value);
    else if (key.startsWith('on') && typeof value === 'function') node.addEventListener(key.slice(2), value);
    else if (key === 'value') node.value = value;
    else if (key === 'checked') node.checked = Boolean(value);
    else node.setAttribute(key, value === true ? '' : String(value));
  }
  for (const child of children.flat(Infinity)) {
    if (child === null || child === undefined || child === false) continue;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return node;
}

export function humanize(value) {
  return String(value ?? '').toLowerCase().split(/[_-]/u).map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word)).join(' ');
}

// Source style vocabulary -> one of a handful of visual emphases.
export function emphasisFor(styleOrNull) {
  const value = String(styleOrNull ?? '').toLowerCase();
  if (value.includes('danger')) return 'danger';
  if (value.includes('primary')) return 'primary';
  if (value.includes('secondary')) return 'secondary';
  if (value.includes('navigation')) return 'navigation';
  if (value.includes('toolbar')) return 'toolbar';
  if (value.includes('transient')) return 'transient';
  return 'default';
}

const ICON_GLYPHS = Object.freeze({
  Add: '+', Close: '×', Delete: '⌫', Download: '↓', Upload: '↑', Search: '⌕', Settings: '⚙', Menu: '≡', Back: '‹', Forward: '›', Play: '▶', Pause: '❚❚', Edit: '✎', Check: '✓', Info: 'i', Refresh: '↻', Share: '⇪',
});

function glyph(iconOrNull) {
  if (!iconOrNull) return null;
  return ICON_GLYPHS[iconOrNull] ?? '◆';
}

// Draw one leaf element. `model` = { kind, label, styleOrNull, textRoleOrNull, iconOrNull }.
export function renderLeaf(model, { size = 'canvas' } = {}) {
  const kind = String(model.kind ?? '').toUpperCase();
  const spec = kindSpec(kind);
  const label = model.label ?? spec.label;
  const emphasis = emphasisFor(model.styleOrNull);
  const icon = glyph(model.iconOrNull);
  const base = 'vx vx-' + size + ' vx-' + kind.toLowerCase().replace(/_/gu, '-') + ' vx-em-' + emphasis;
  switch (kind) {
    case 'BUTTON':
      return h('span', { class: base + ' vx-button', role: 'presentation' }, icon ? h('span', { class: 'vx-icon', 'aria-hidden': 'true' }, icon) : null, h('span', { class: 'vx-label' }, label));
    case 'FAB':
      return h('span', { class: base + ' vx-fab', title: label }, h('span', { class: 'vx-icon', 'aria-hidden': 'true' }, icon ?? '+'), size === 'thumb' ? null : h('span', { class: 'vx-sr' }, label));
    case 'MENU_ITEM':
      return h('span', { class: base + ' vx-menu-item' }, icon ? h('span', { class: 'vx-icon', 'aria-hidden': 'true' }, icon) : null, h('span', { class: 'vx-label' }, label));
    case 'FIELD':
      return h('span', { class: base + ' vx-field' }, h('span', { class: 'vx-placeholder' }, label));
    case 'TOGGLE':
      return h('span', { class: base + ' vx-toggle' }, h('span', { class: 'vx-label' }, label), h('span', { class: 'vx-switch', 'aria-hidden': 'true' }));
    case 'TEXT': {
      const role = String(model.textRoleOrNull ?? '').toUpperCase();
      return h('span', { class: base + ' vx-text' + (role.includes('TITLE') ? ' vx-title' : role.includes('SUPPORTING') ? ' vx-supporting' : '') }, label);
    }
    case 'IMAGE':
      return h('span', { class: base + ' vx-image' }, h('span', { class: 'vx-image-mark', 'aria-hidden': 'true' }, '▧'), h('span', { class: 'vx-label' }, label));
    case 'SEAM':
      return h('span', { class: base + ' vx-seam', title: label });
    case 'HANDLE':
      return h('span', { class: base + ' vx-handle', title: label }, '⋮');
    default:
      return h('span', { class: base + ' vx-unknown', title: 'Unrecognized kind ' + kind }, h('span', { class: 'vx-unknown-kind' }, kind || '?'), h('span', { class: 'vx-label' }, label));
  }
}

// Draw a container shell. Returns { element, host } where `host` receives children.
export function renderContainer(model, { size = 'canvas', titled = null } = {}) {
  const kind = String(model.kind ?? '').toUpperCase();
  const spec = kindSpec(kind);
  const base = 'vx vx-' + size + ' vx-container vx-' + kind.toLowerCase().replace(/_/gu, '-');
  const showTitle = titled ?? ['CARD', 'DIALOG', 'SHEET', 'REGION', 'FRAME'].includes(kind);
  const host = h('div', { class: 'vx-host' });
  const title = showTitle && model.label ? h('div', { class: 'vx-container-title' }, model.label) : null;
  const grip = kind === 'SHEET' ? h('div', { class: 'vx-sheet-grip', 'aria-hidden': 'true' }) : null;
  const element = h('div', { class: base, 'data-kind': kind, title: size === 'thumb' ? spec.label : null }, grip, title, host);
  return { element, host };
}

export function isContainerKind(kind) {
  return kindSpec(kind).container;
}

// Render a small, static thumbnail (palette cards, library). Containers get a few ghost lines.
export function renderThumb(model, childModels = []) {
  const kind = String(model.kind ?? '').toUpperCase();
  if (!isContainerKind(kind)) return renderLeaf(model, { size: 'thumb' });
  const { element, host } = renderContainer(model, { size: 'thumb' });
  const axis = kind === 'ROW' ? 'row' : 'column';
  host.classList.add('vx-thumb-host', 'vx-thumb-' + axis);
  const kids = childModels.slice(0, 3);
  if (kids.length) kids.forEach((child) => host.append(isContainerKind(child.kind) ? h('span', { class: 'vx-ghost' }) : renderLeaf(child, { size: 'thumb' })));
  else for (let index = 0; index < (kind === 'MENU' ? 3 : 2); index += 1) host.append(h('span', { class: 'vx-ghost' + (index ? ' short' : '') }));
  return element;
}

export const RENDERER_CSS = `
.vx{box-sizing:border-box;min-width:0;font:inherit;color:#18213a}
.vx-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
.vx-icon{display:inline-grid;place-items:center;font-weight:700}
.vx-button{display:inline-flex;align-items:center;justify-content:center;gap:7px;min-height:40px;padding:0 16px;border-radius:10px;border:1px solid #18213a;background:#18213a;color:#fff;font-weight:650;line-height:1.2;text-align:center;max-width:100%}
.vx-button .vx-label{overflow-wrap:anywhere}
.vx-button.vx-em-default{background:#e9edf6;border-color:#d3dae7;color:#18213a}
.vx-button.vx-em-secondary{background:#fff;border-color:#9aa6b8;color:#18213a}
.vx-button.vx-em-danger{background:#fff6f5;border-color:#d9776b;color:#9b2c1f}
.vx-button.vx-em-navigation{background:transparent;border-color:transparent;color:#2448c9;padding:0 6px;justify-content:flex-start}
.vx-button.vx-em-navigation::after{content:"›";margin-inline-start:4px}
.vx-button.vx-em-toolbar{min-width:40px;padding:0 10px;background:transparent;border-color:#d3dae7}
.vx-fab{display:inline-grid;place-items:center;width:52px;height:52px;border-radius:16px;background:#2448c9;color:#fff;font-size:20px;box-shadow:0 8px 18px #2448c933}
.vx-menu-item{display:flex;align-items:center;gap:9px;width:100%;min-height:40px;padding:8px 12px;border-radius:8px;background:#fff}
.vx-field{display:flex;align-items:center;width:100%;min-height:44px;padding:0 12px;border:1px solid #b9c3d3;border-radius:10px;background:#fff;color:#7a8597}
.vx-field .vx-placeholder{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.vx-toggle{display:flex;align-items:center;justify-content:space-between;gap:14px;width:100%;min-height:44px;padding:8px 12px;border:1px solid #d8dee8;border-radius:10px;background:#fff}
.vx-switch{flex:none;width:38px;height:22px;border-radius:999px;background:#c6cfdc;position:relative}
.vx-switch::after{content:"";position:absolute;top:3px;inset-inline-start:3px;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 1px 2px #0003}
.vx-toggle.on .vx-switch{background:#2448c9}.vx-toggle.on .vx-switch::after{inset-inline-start:19px}
.vx-text{display:block;line-height:1.45;overflow-wrap:anywhere}
.vx-title{font-size:18px;font-weight:750;letter-spacing:-.01em}
.vx-supporting{color:#5b667a;font-size:13px}
.vx-image{display:grid;place-items:center;gap:4px;width:100%;min-height:120px;border-radius:12px;background:linear-gradient(135deg,#e7ecf5,#d3dbe9);color:#5f6b80;text-align:center;padding:10px}
.vx-image-mark{font-size:22px}
.vx-seam{display:block;width:100%;height:1px;background:#c9d1de;margin:4px 0}
.vx-handle{display:inline-grid;place-items:center;width:20px;height:40px;border-radius:8px;background:#eef1f7;border:1px solid #d3dae7;color:#68748a;font-weight:800}
.vx-unknown{display:flex;flex-direction:column;gap:2px;padding:10px;border:1px dashed #c48a2b;border-radius:10px;background:#fffaf0;color:#7a5410}
.vx-unknown-kind{font:700 10px ui-monospace,monospace;letter-spacing:.04em}
.vx-container{position:relative;display:flex;flex-direction:column;min-width:0}
.vx-container-title{font-weight:700;font-size:13px;color:#2b3650;margin-bottom:8px;overflow-wrap:anywhere}
.vx-host{position:relative;min-width:0;flex:1 1 auto}
.vx-card{padding:14px;border:1px solid #d6dce6;border-radius:16px;background:#fff;box-shadow:0 6px 16px #18213a10}
.vx-column{padding:10px 10px 10px 14px;border-inline-start:3px solid #c3cee0;border-radius:4px 10px 10px 4px;background:#fafbfd}
.vx-row{padding:10px;border-block:1px dashed #bcc7d8;background:#fcfdff}
.vx-stack{padding:12px;border:1px solid #dce2ea;border-radius:12px;background:repeating-linear-gradient(135deg,#fbfcfe,#fbfcfe 9px,#f3f5fa 9px,#f3f5fa 18px)}
.vx-region{padding:12px;border:2px dashed #b4c3d7;border-radius:12px;background:#f8fbff}
.vx-frame{padding:12px;border:2px solid #a9b4c6;border-radius:8px;background:#fbfcfe}
.vx-group{padding:0;border:1px dashed transparent;border-radius:8px}
.vx-dialog{padding:18px;border:1px solid #c9d1dd;border-radius:20px;background:#fff;box-shadow:0 22px 48px #18213a33;width:min(100%,360px)}
.vx-dialog>.vx-container-title{font-size:16px;color:#18213a}
.vx-sheet{padding:10px 16px 16px;border:1px solid #c9d1dd;border-radius:22px 22px 0 0;background:#fff;box-shadow:0 -10px 30px #18213a22;width:100%}
.vx-sheet-grip{width:40px;height:4px;border-radius:999px;background:#c6cdd8;margin:0 auto 10px}
.vx-menu{padding:6px;border:1px solid #d6dce6;border-radius:12px;background:#fff;box-shadow:0 12px 28px #18213a24;min-width:200px}
.vx-thumb{pointer-events:none}
.vx-thumb.vx-button{min-height:26px;padding:0 10px;font-size:10px;border-radius:7px;max-width:100%;overflow:hidden}
.vx-thumb.vx-button .vx-label{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.vx-thumb.vx-fab{width:32px;height:32px;border-radius:10px;font-size:14px}
.vx-thumb.vx-field,.vx-thumb.vx-toggle,.vx-thumb.vx-menu-item{min-height:26px;font-size:10px;padding:0 8px}
.vx-thumb.vx-toggle .vx-label{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.vx-thumb .vx-switch{width:24px;height:14px}.vx-thumb .vx-switch::after{width:10px;height:10px;top:2px}
.vx-thumb.vx-text{font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:100%}
.vx-thumb.vx-title{font-size:12px}
.vx-thumb.vx-image{min-height:46px;font-size:9px;padding:4px}
.vx-thumb.vx-image .vx-label{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
.vx-thumb.vx-container{padding:6px;width:100%;font-size:9px}
.vx-thumb .vx-container-title{font-size:9px;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.vx-thumb.vx-dialog{width:88%;padding:8px;border-radius:12px}
.vx-thumb.vx-sheet{padding:4px 8px 8px}.vx-thumb .vx-sheet-grip{width:20px;margin-bottom:4px}
.vx-thumb.vx-menu{min-width:0;width:80%}
.vx-thumb-host{display:flex;gap:4px}.vx-thumb-column{flex-direction:column}.vx-thumb-row{flex-direction:row}
.vx-thumb-host>.vx{transform:none}
.vx-ghost{display:block;flex:1;height:7px;border-radius:3px;background:#e2e7ef}.vx-ghost.short{max-width:62%}
.vx-thumb-row .vx-ghost{height:16px}
`;

// [VXG RealForever][VEXWORK][COMPONENT-LIBRARY][A5-COMPONENT-RENDERER]
