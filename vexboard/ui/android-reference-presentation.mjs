export const VEXBOARD_ANDROID_REFERENCE_PRESENTATION_SCHEMA = 'vexboard.android-reference-presentation/v1';
export const ANDROID_REFERENCE_STYLE_ID = 'vexboard-android-reference-presentation-v1';

const SAFE = /[^A-Za-z0-9_-]+/g;

const CSS = `
.shape.android-reference {
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
.shape.android-reference .role-marker,
.shape.android-reference .kind-marker,
.shape.android-reference .contained-marker,
.shape.android-reference .branch-marker { display:none; }
.shape.android-role-product-frame {
  background:transparent;border:1px solid #a8a29e;border-radius:18px;box-shadow:none;
}
.shape.android-role-product-frame>.shape-label {
  position:absolute;left:14px;top:10px;padding:4px 8px;border-radius:999px;
  background:#fafaf9;color:#57534e;font:700 9px ui-monospace,monospace;letter-spacing:.04em;text-transform:uppercase;
}
.shape.android-role-screen-frame {
  background:#0f1012;border:2px solid #383a42;border-radius:28px;box-shadow:0 16px 40px #0004;color:#f5f5f4;padding:0;
}
.shape.android-role-screen-frame>.shape-label {
  position:absolute;right:10px;bottom:9px;width:auto;padding:3px 7px;border:1px solid #5a5d68;border-radius:999px;
  background:#17181ce8;color:#b7b8bf;font:700 8px ui-monospace,monospace;text-transform:uppercase;letter-spacing:.05em;
}
.shape.android-role-screen-anchor {
  background:#f5f3ff;border:2px solid #7c3aed;border-radius:14px;color:#4c1d95;font-weight:800;
}
.shape.android-role-toolbar {
  background:#17181c;border:0;border-bottom:1px solid #383a42;border-radius:26px 26px 0 0;box-shadow:none;color:#f5f5f4;
  justify-content:flex-start;text-align:left;padding:0 18px;font-size:22px;font-weight:650;
}
.shape.android-role-surface {
  background:#272930;border:1px solid #383a42;border-radius:18px;box-shadow:none;color:#f5f5f4;
}
.shape.android-role-text { border:0;background:transparent;box-shadow:none;color:#f5f5f4;justify-content:flex-start;text-align:left;white-space:pre-line; }
.shape.android-role-text.android-variant-title { font-size:15px;font-weight:750;line-height:1.35; }
.shape.android-role-text.android-variant-supporting { color:#b7b8bf;font-size:11px;line-height:1.45; }
.shape.android-role-text.android-variant-empty { color:#b7b8bf;font-size:13px; }
.shape.android-role-button {
  border-radius:999px;box-shadow:none;font-size:11px;font-weight:750;padding:6px 12px;
}
.shape.android-role-button.android-variant-primary { background:#f2f2ef;border-color:#f2f2ef;color:#111216; }
.shape.android-role-button.android-variant-secondary { background:#51495f;border-color:#51495f;color:#f5f5f4; }
.shape.android-role-button.android-variant-danger { background:#5a3036;border-color:#7f454d;color:#ffe9eb; }
.shape.android-role-icon-button {
  border:0;border-radius:999px;background:transparent;box-shadow:none;color:#f5f5f4;padding:0;font-size:0;
}
.shape.android-role-icon-button::after { font-size:20px;line-height:1; }
.shape.android-role-icon-button.android-variant-search::after { content:"⌕"; }
.shape.android-role-icon-button.android-variant-menu::after { content:"☰"; }
.shape.android-role-icon-button.android-variant-settings::after { content:"⚙"; }
.shape.android-role-icon-button>.shape-label { display:none; }
.shape.android-role-tab { border-radius:999px;box-shadow:none;font-size:11px;font-weight:750; }
.shape.android-role-tab.android-variant-selected { background:#f2f2ef;border-color:#f2f2ef;color:#111216; }
.shape.android-role-tab.android-variant-default { background:#0f1012;border:1px solid #5a5d68;color:#b7b8bf; }
.shape.android-role-status-row {
  background:#17181c;border:0;border-radius:12px;box-shadow:none;color:#b7b8bf;justify-content:flex-start;text-align:left;padding-left:18px;
}
.shape.android-role-status-row.android-variant-loading::before { content:"◌";font-size:18px;margin-right:10px;color:#f2f2ef; }
.shape.android-role-list-row {
  background:#17181c;border:0;border-radius:14px;box-shadow:none;color:#f5f5f4;justify-content:flex-start;text-align:left;
  white-space:pre-line;padding:12px 14px 12px 48px;font-size:11px;line-height:1.35;
}
.shape.android-role-list-row::before { content:"♪";position:absolute;left:16px;font-size:22px;color:#f2f2ef; }
.shape.android-role-list-row.android-variant-hub_and_local { outline:1px solid #51495f; }
.shape.android-role-fab {
  background:#5b3ca6;border:0;border-radius:14px;box-shadow:0 7px 18px #0005;color:#fff;font-size:0;padding:0;
}
.shape.android-role-fab::after { font-size:18px; }
.shape.android-role-fab.android-variant-play::after { content:"▶"; }
.shape.android-role-fab.android-variant-shuffle::after { content:"↝"; }
.shape.android-role-fab>.shape-label { display:none; }
.shape.android-role-modal_sheet {
  background:#202126;border:1px solid #5a5d68;border-radius:24px 24px 12px 12px;box-shadow:0 -12px 32px #0008;color:#f5f5f4;padding:16px 12px;
}
.shape.android-role-modal_sheet>.shape-label {
  position:absolute;left:18px;top:12px;width:auto;font-size:15px;font-weight:800;color:#f5f5f4;
}
.shape.android-role-depth_portal {
  background:#eef2ff;border:2px solid #6366f1;border-radius:14px;color:#3730a3;font-weight:800;
}
.shape.android-role-arch_node { background:#fff;border:1px solid #cbd5e1;border-radius:12px;color:#1c1917;box-shadow:0 4px 14px #0001; }
.shape.android-role-arch_node.android-variant-non_owner { border-style:dashed;color:#78716c;background:#fafaf9; }
.shape.android-role-arch_group { background:#f8fafc;border:2px dashed #94a3b8;border-radius:16px;color:#334155;align-items:flex-start;justify-content:flex-start; }
.shape.android-role-api_endpoint { background:#eff6ff;border:1px solid #93c5fd;border-radius:10px;color:#1e3a8a;justify-content:flex-start;text-align:left;padding-left:12px;font:700 10px ui-monospace,monospace; }
`;

function safe(value) {
  return String(value ?? '').trim().replace(SAFE, '_').replace(/^_+|_+$/g, '').toLowerCase();
}

export function normalizeAndroidReferencePresentation(input) {
  if (!input || input.schemaVersion !== VEXBOARD_ANDROID_REFERENCE_PRESENTATION_SCHEMA) return null;
  if (typeof input.profileRef !== 'string' || !input.profileRef) throw new TypeError('Android presentation profileRef required');
  if (!Array.isArray(input.items)) throw new TypeError('Android presentation items must be an array');
  const seen = new Set();
  for (const entry of input.items) {
    if (typeof entry?.projectionItemRef !== 'string' || !entry.projectionItemRef) throw new TypeError('Android presentation projectionItemRef required');
    if (seen.has(entry.projectionItemRef)) throw new TypeError(`duplicate Android presentation projectionItemRef ${entry.projectionItemRef}`);
    seen.add(entry.projectionItemRef);
    if (typeof entry.role !== 'string' || !entry.role) throw new TypeError(`Android presentation role required for ${entry.projectionItemRef}`);
  }
  return input;
}

export function androidReferenceHint(presentationInput, projectionItemRef) {
  const presentation = normalizeAndroidReferencePresentation(presentationInput);
  if (!presentation) return null;
  return presentation.items.find((entry) => entry.projectionItemRef === projectionItemRef) ?? null;
}

export function androidReferenceClassNames(presentationInput, projectionItemRef) {
  const hint = androidReferenceHint(presentationInput, projectionItemRef);
  if (!hint) return Object.freeze([]);
  const classes = ['android-reference', `android-role-${safe(hint.role)}`];
  if (hint.variant) classes.push(`android-variant-${safe(hint.variant)}`);
  return Object.freeze(classes);
}

export function androidReferenceProfileSummary(presentationInput) {
  const presentation = normalizeAndroidReferencePresentation(presentationInput);
  if (!presentation) return null;
  const viewport = presentation.referenceViewport ?? {};
  return Object.freeze({
    profileRef: presentation.profileRef,
    widthDp: Number(viewport.widthDp),
    heightDp: Number(viewport.heightDp),
    boardScalePerDp: Number(viewport.boardScalePerDp),
  });
}

export function installAndroidReferencePresentation(documentRef = globalThis.document) {
  if (!documentRef?.documentElement || typeof documentRef.createElement !== 'function') return false;
  if (documentRef.getElementById?.(ANDROID_REFERENCE_STYLE_ID)) return false;
  const style = documentRef.createElement('style');
  style.id = ANDROID_REFERENCE_STYLE_ID;
  style.textContent = CSS;
  (documentRef.head ?? documentRef.documentElement).append(style);
  return true;
}

installAndroidReferencePresentation();

// [VXG RealForever][VEXWORK][VEXBOARD][ANDROID-REFERENCE-PRESENTATION]
